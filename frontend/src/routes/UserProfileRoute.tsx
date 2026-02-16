import { useParams } from "react-router-dom";

import { useUserProfileQuery } from "../features/user/userQueries";

export function UserProfilePage() {
  const { userId = "" } = useParams();
  const { data, isLoading, isError, error } = useUserProfileQuery(userId);

  if (isLoading) {
    return <p>Loading user profile...</p>;
  }

  if (isError) {
    return (
      <p>
        Unable to load profile:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  return (
    <main>
      <h1>User Profile</h1>
      {/* TODO: Replace with your full profile component tree. */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
