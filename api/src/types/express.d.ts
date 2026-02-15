// Augment Express and express-session types for auth

import "express-session";
import "express";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: "USER" | "ADMIN";
      isActive: boolean;
      emailVerified: boolean;
      lastLoginAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
