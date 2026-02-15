import type { UserAction, UserState } from "./redux.types";

const initialState: UserState = {
  currentUser: null,
  isHydrated: false,
};

export function userReducer(
  state = initialState,
  action: UserAction,
): UserState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, currentUser: action.payload };
    case "HYDRATE_USER":
      // TODO: In your real hydrate flow, load persisted/auth bootstrap data before marking true.
      return { ...state, isHydrated: true };
    default:
      return state;
  }
}
