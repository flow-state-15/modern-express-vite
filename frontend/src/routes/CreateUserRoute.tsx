import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateUserMutation } from "../features/user/userQueries";

export function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const createUserMutation = useCreateUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Add form validation and better UX for error handling.
    const created = await createUserMutation.mutateAsync({ email, password, role });
    // TODO: Verify no race condition here.
    navigate(`/profiles/${created.id}`);
  };

  return (
    <main>
      <h1>Create User</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value as "USER" | "ADMIN")}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button type="submit" disabled={createUserMutation.isLoading}>
          {createUserMutation.isLoading ? "Creating..." : "Create user"}
        </button>
      </form>
    </main>
  );
}
