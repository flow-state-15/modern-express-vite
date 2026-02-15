// *Note: Split these types into separate files if it gets crowded.

import type { UserWithProfile } from "../../../shared/shared.types";

// ─── User State ───────────────────────────────────────────────
export type UserState = {
  currentUser: UserWithProfile | null;
  isHydrated: boolean;
};

export type SetUserAction = {
  type: "SET_USER";
  payload: UserWithProfile | null;
};

export type HydrateUserAction = {
  type: "HYDRATE_USER";
};

// Expand this union as new user-related actions are added.
export type UserAction = SetUserAction | HydrateUserAction;
