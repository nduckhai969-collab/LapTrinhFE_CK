import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import ChatPage from '../pages/chat/ChatPage';
import ContactsPage from '../pages/contacts/ContactsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        {/* Main app routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATHS.ROOT} element={<Navigate to={ROUTE_PATHS.CHAT} replace />} />
          <Route path={ROUTE_PATHS.CHAT} element={<ChatPage />} />
          <Route path={ROUTE_PATHS.CHAT_CONVERSATION} element={<ChatPage />} />
          <Route path={ROUTE_PATHS.CONTACTS} element={<ContactsPage />} />
          <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.CHAT} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
