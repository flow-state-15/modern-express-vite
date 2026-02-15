import request from "supertest";
import bcrypt from "bcrypt";

import { app } from "../src/app.js";
import { prisma } from "../src/utils/db.js";
import { teardownAll } from "./teardown.js";

const SALT_ROUNDS = 12;

describe("User CRUD & Roles", () => {
  const adminEmail = "admin@crud-test.local";
  const adminPassword = "admin-secret-123";
  const userEmail = "user@crud-test.local";
  const userPassword = "user-secret-456";

  let adminId: string;
  let regularUserId: string;

  beforeAll(async () => {
    // Seed admin user (required for admin-only endpoints)
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    const admin = await prisma.user.create({
      data: { email: adminEmail, passwordHash, role: "ADMIN" },
    });
    adminId = admin.id;
  });

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminEmail, userEmail, "created@crud-test.local", "updated@crud-test.local"],
        },
      },
    });
    await teardownAll();
  });

  describe("Auth flow", () => {
    it("registers a new user (defaults to USER role)", async () => {
      const agent = request.agent(app);
      const res = await agent
        .post("/api/auth/register")
        .send({ email: userEmail, password: userPassword })
        .expect(201);

      expect(res.body.data).toMatchObject({
        email: userEmail,
        role: "USER",
        isActive: true,
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.passwordHash).toBeUndefined();
      regularUserId = res.body.data.id;
    });

    it("rejects duplicate email on register", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: userEmail, password: "other-pass" })
        .expect(409);

      expect(res.body.error).toBeDefined();
    });

    it("logs in as admin", async () => {
      const agent = request.agent(app);
      const res = await agent
        .post("/api/auth/login")
        .send({ email: adminEmail, password: adminPassword })
        .expect(200);

      expect(res.body.data.role).toBe("ADMIN");
      expect(res.body.data.email).toBe(adminEmail);
    });

    it("logs in as regular user", async () => {
      const agent = request.agent(app);
      const res = await agent
        .post("/api/auth/login")
        .send({ email: userEmail, password: userPassword })
        .expect(200);

      expect(res.body.data.role).toBe("USER");
      expect(res.body.data.email).toBe(userEmail);
    });

    it("rejects invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: adminEmail, password: "wrong" })
        .expect(401);
    });
  });

  describe("User CRUD (admin)", () => {
    let adminAgent: request.SuperAgentTest;

    beforeAll(async () => {
      adminAgent = request.agent(app);
      await adminAgent
        .post("/api/auth/login")
        .send({ email: adminEmail, password: adminPassword });
    });

    it("GET /users - lists all users (admin only)", async () => {
      const res = await adminAgent.get("/api/users").expect(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      expect(res.body.data.every((u: { passwordHash?: unknown }) => !("passwordHash" in u))).toBe(true);
    });

    it("POST /users - creates user with role (admin only)", async () => {
      const res = await adminAgent
        .post("/api/users")
        .send({
          email: "created@crud-test.local",
          password: "created-pass",
          role: "USER",
        })
        .expect(201);

      expect(res.body.data).toMatchObject({
        email: "created@crud-test.local",
        role: "USER",
      });
      expect(res.body.data.id).toBeDefined();
    });

    it("POST /users - creates admin user", async () => {
      const res = await adminAgent
        .post("/api/users")
        .send({
          email: "created-admin@crud-test.local",
          password: "admin-pass",
          role: "ADMIN",
        })
        .expect(201);

      expect(res.body.data).toMatchObject({
        email: "created-admin@crud-test.local",
        role: "ADMIN",
      });

      // Clean up
      await prisma.user.delete({ where: { id: res.body.data.id } });
    });

    it("DELETE /users - deletes user by userId (admin only)", async () => {
      const created = await adminAgent
        .post("/api/users")
        .send({ email: "to-delete@crud-test.local", password: "pass", role: "USER" })
        .expect(201);

      const userId = created.body.data.id;

      const res = await adminAgent
        .delete("/api/users")
        .send({ userId })
        .expect(200);

      expect(res.body.data.message).toContain("deleted");

      const gone = await prisma.user.findUnique({ where: { id: userId } });
      expect(gone).toBeNull();
    });

    it("DELETE /users - requires userId", async () => {
      await adminAgent.delete("/api/users").send({}).expect(400);
    });
  });

  describe("User update (self & admin)", () => {
    it("PUT /users - admin can update another user", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: adminEmail, password: adminPassword });

      const res = await agent
        .put("/api/users")
        .send({ userId: regularUserId, email: "updated@crud-test.local" })
        .expect(200);

      expect(res.body.data.email).toBe("updated@crud-test.local");

      // Restore for other tests
      await prisma.user.update({
        where: { id: regularUserId },
        data: { email: userEmail },
      });
    });

    it("PUT /users - user can update own email (no userId)", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: userEmail, password: userPassword });

      const res = await agent
        .put("/api/users")
        .send({ email: "self-updated@crud-test.local" })
        .expect(200);

      expect(res.body.data.email).toBe("self-updated@crud-test.local");

      // Restore
      await prisma.user.update({
        where: { id: regularUserId },
        data: { email: userEmail },
      });
    });

    it("PUT /users - user cannot update another user", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: userEmail, password: userPassword });

      await agent
        .put("/api/users")
        .send({ userId: adminId, email: "hacked@crud-test.local" })
        .expect(403);
    });
  });

  describe("Role-based access", () => {
    it("GET /users - regular user gets 403", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: userEmail, password: userPassword });

      await agent.get("/api/users").expect(403);
    });

    it("POST /users - regular user gets 403", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: userEmail, password: userPassword });

      await agent
        .post("/api/users")
        .send({ email: "nope@crud-test.local", password: "pass", role: "USER" })
        .expect(403);
    });

    it("DELETE /users - regular user gets 403", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: userEmail, password: userPassword });

      await agent.delete("/api/users").send({ userId: adminId }).expect(403);
    });

    it("unauthenticated requests get 401 or 403", async () => {
      // requireAdmin returns 403 for both unauthenticated and non-admin
      await request(app).get("/api/users").expect(403);
      await request(app).post("/api/users").send({ email: "x@x.com", password: "p" }).expect(403);
      await request(app).delete("/api/users").send({ userId: "x" }).expect(403);
      // requireAuth returns 401 for unauthenticated
      await request(app).put("/api/users").send({ email: "x@x.com" }).expect(401);
    });
  });

  describe("Validation", () => {
    it("POST /users - requires email and password", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({ email: adminEmail, password: adminPassword });

      await agent.post("/api/users").send({ email: "only@x.com" }).expect(400);
      await agent.post("/api/users").send({ password: "only" }).expect(400);
    });
  });
});
