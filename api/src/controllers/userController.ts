import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/db.js";

const SALT_ROUNDS = 12;

// ─── User CRUD (protected by route-level middleware) ─────

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  const users = await prisma.user.findMany({
    omit: { passwordHash: true },
  });
  res.json({ data: users });
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Validation Error", details: { email: "Email and password are required" } });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    omit: { passwordHash: true },
  });
  res.status(201).json({ data: user });
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const { userId, email, password } = req.body;
  const targetId = userId || req.user!.id;

  // non-admins can only update themselves
  if (req.user!.role !== "ADMIN" && targetId !== req.user!.id) {
    return res.status(403).json({ error: "Not Authorized" });
  }

  const data: Record<string, unknown> = {};
  if (email) data.email = email;
  if (password) data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.update({
    where: { id: targetId },
    data,
    omit: { passwordHash: true },
  });
  res.json({ data: user });
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Validation Error", details: { userId: "userId is required" } });
  }
  await prisma.user.delete({ where: { id: userId } });
  res.json({ data: { message: "User deleted successfully" } });
}
