// Shared types between frontend and backend to prevent drift.
// *Note: frontend/backend specific types do not belong here.

// TODO: Split these domains into separate files when it gets crowded.

// ─── Enums ───────────────────────────────────────────────

export type Role = "USER" | "ADMIN";

// ─── Models ──────────────────────────────────────────────

/**
 * Public-facing User shape (excludes passwordHash).
 * Dates are ISO-8601 strings as they appear in JSON responses.
 */
export type User = {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type UserWithProfile = User & {
  profile: Profile | null;
};

// ─── API Requests ─────────────────────────────────

export type CreateUserInput = {
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
};


// ─── API Responses ───────────────────────────────────

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: string;
  code?: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Specific Error Shapes ────────────────────────────

export type NotFoundError = {
  error: "Not Found";
};

export type NotAuthorizedError = {
  error: "Not Authorized";
};

export type ValidationError = {
  error: "Validation Error";
  details: Record<string, string>;
};

export type ServerError = {
  message: "Internal Server Error";
  error: unknown;
};
