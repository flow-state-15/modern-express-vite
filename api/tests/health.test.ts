import request from "supertest";

import { app } from "../src/app.js";

describe("api smoke", () => {
  it("responds to GET /api/test", async () => {
    const res = await request(app).get("/api/test");
    expect(res.status).toBe(200);
  });
});
