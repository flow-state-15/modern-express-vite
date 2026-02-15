import { Navigate, Route, Routes } from 'react-router-dom';

import { CreateUserPage } from '../routes/CreateUserPage';
import { HomePage } from '../routes/HomePage';
import { UserProfilePage } from '../routes/UserProfilePage';

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
