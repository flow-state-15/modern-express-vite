import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <p>Scaffold page for routing and future dashboard content.</p>

      <nav>
        <Link to="/users/new">Create user</Link>
        {' | '}
        {/* TODO: Replace hardcoded ID with selected/authenticated user context. */}
        <Link to="/profiles/demo-user-id">View demo profile</Link>
      </nav>
    </main>
  );
}
