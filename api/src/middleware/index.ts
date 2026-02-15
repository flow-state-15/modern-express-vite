import type { Request, Response, NextFunction, RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { prisma } from "../utils/db.js";

// ─── Session middleware ──────────────────────────────────

let sessionStore: InstanceType<ReturnType<typeof connectPgSimple>> | null = null;

/**
 * Creates the session middleware with Postgres-backed store.
 * Returns a ready-to-use RequestHandler for app.use().
 */
export function createSessionMiddleware(): RequestHandler {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set in environment");
  }

  const PgStore = connectPgSimple(session);
  sessionStore = new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  });

  return session({
    store: sessionStore,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  });
}

/**
 * Closes the session store's internal pg pool.
 * Call during graceful shutdown or test teardown.
 */
export function closeSessionStore(): void {
  sessionStore?.close();
  sessionStore = null;
}

// ─── Global middleware ───────────────────────────────────

/**
 * Loads the session user on every request.
 * If a valid session exists with a userId, fetches the user
 * (excluding passwordHash) and attaches to req.user.
 * Runs globally — does NOT block unauthenticated requests.
 */
export async function loadSessionUser(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      omit: { passwordHash: true },
    });
    if (user) {
      req.user = user;
    } else {
      req.session.destroy(() => {});
    }
  }
  next();
}

// ─── Route-level guards ──────────────────────────────────

/**
 * Rejects the request if no session user is present.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

/**
 * Rejects if the session user is not ADMIN role.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Not Authorized" });
  }
  next();
}
