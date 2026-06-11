import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin Pages (Assuming these will be moved/recreated)
import AdminDashboard from './pages/admin/Dashboard';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminOpportunities from './pages/admin/Opportunities';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminRoles from './pages/admin/Roles';

// Public Pages (Assuming these will be created)
import PublicHome from './pages/public/Home';
import PublicCampaigns from './pages/public/Campaigns';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // default language setup
    if (!i18n.language) {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<PublicHome />} />
          <Route path="campaigns" element={<PublicCampaigns />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="roles" element={<AdminRoles />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
