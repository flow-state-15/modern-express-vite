import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  UserWithProfile,
  CreateUserInput,
} from "../../../../shared/shared.types";
import { queryClient } from "../../common/utils/queryClient";

export const userQueryKeys = {
  all: ["users"] as const,
  profile: (id: string) => ["users", "profile", id] as const,
};

async function fetchUserProfile(userId: string): Promise<UserWithProfile> {
  // TODO: Replace with real HTTP client implementation (axios wrapper).
  // Example flow:
  // 1) GET /api/users/:id
  // 2) handle non-2xx responses
  // 3) return typed payload from shared types
  throw new Error(`Implement fetchUserProfile for user ${userId}`);
}

async function createUser(input: CreateUserInput): Promise<UserWithProfile> {
  // TODO: Replace with real HTTP client implementation (POST /api/users).
  throw new Error(`Implement createUser for email ${input.email}`);
}

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: createUser,
    onSuccess: (createdUser) => {
      // Core data flow reminder:
      // - React Query owns server state/cache.
      // - Redux should store app/UI state (auth session flags, filters, wizard steps, etc.).
      // - If needed, dispatch a Redux action here for side effects, but avoid duplicating server data in Redux.
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      queryClient.setQueryData(
        userQueryKeys.profile(createdUser.id),
        createdUser,
      );
    },
  });
}
