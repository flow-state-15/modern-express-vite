import { Navigate, Route, Routes } from 'react-router-dom';

import { CreateUserPage } from '../routes/CreateUserRoute';
import { HomePage } from '../routes/HomeRoute';
import { UserProfilePage } from '../routes/UserProfileRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/users/new" element={<CreateUserPage />} />
      <Route path="/profiles/:userId" element={<UserProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
