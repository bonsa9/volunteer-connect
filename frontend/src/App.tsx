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
import AdminVolunteerDetail from './pages/admin/VolunteerDetail';
import AdminRoles from './pages/admin/Roles';
import AdminOrgVerifications from './pages/admin/OrgVerifications';
import AdminOrgDetail from './pages/admin/OrgDetail';
import AdminBadgeVerifications from './pages/admin/BadgeVerifications';
import AdminNotifications from './pages/admin/Notifications';
import AdminDocVerification from './pages/admin/DocVerification';
import AdminTemplateList from './pages/admin/TemplateList';
import AdminCreateTemplate from './pages/admin/CreateTemplate';

// Public Pages (Assuming these will be created)
import PublicHome from './pages/public/Home';
import PublicCampaigns from './pages/public/Campaigns';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/NotFound';

// Volunteer Dashboard
import VolunteerLayout from './layouts/VolunteerLayout';
import VolunteerDashboard from './pages/volunteer/Dashboard';
import VolunteerSignups from './pages/volunteer/MySignups';
import VolunteerProfile from './pages/volunteer/Profile';
import VolunteerCertificate from './pages/volunteer/Certificate';

// Organization Dashboard
import OrganizationLayout from './layouts/OrganizationLayout';
import OrganizationDashboard from './pages/organization/Dashboard';
import OrganizationAttendance from './pages/organization/Attendance';
import OrganizationReports from './pages/organization/Reports';
import OrganizationCampaigns from './pages/organization/Campaigns';
import OrganizationCreateCampaign from './pages/organization/CreateCampaign';
import OrganizationCampaignDetails from './pages/organization/CampaignDetails';
import OrganizationProfile from './pages/organization/Profile';

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

        {/* Volunteer Dashboard Routes */}
        <Route path="/dashboard" element={<VolunteerLayout />}>
          <Route index element={<VolunteerDashboard />} />
          <Route path="signups" element={<VolunteerSignups />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>

        {/* Fullscreen Certificate Route */}
        <Route path="/dashboard/certificate/:signupId" element={<VolunteerCertificate />} />

        {/* Organization Dashboard Routes */}
        <Route path="/org" element={<OrganizationLayout />}>
          <Route path="dashboard" element={<OrganizationDashboard />} />
          <Route path="campaigns" element={<OrganizationCampaigns />} />
          <Route path="campaigns/create" element={<OrganizationCreateCampaign />} />
          <Route path="campaigns/:id" element={<OrganizationCampaignDetails />} />
          <Route path="attendance" element={<OrganizationAttendance />} />
          <Route path="reports" element={<OrganizationReports />} />
          <Route path="profile" element={<OrganizationProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="volunteers/:id" element={<AdminVolunteerDetail />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="verifications/orgs" element={<AdminOrgVerifications />} />
          <Route path="verifications/orgs/:id" element={<AdminOrgDetail />} />
          <Route path="verifications/badges" element={<AdminBadgeVerifications />} />
          <Route path="verifications/docs" element={<AdminDocVerification />} />
          <Route path="templates" element={<AdminTemplateList />} />
          <Route path="templates/create" element={<AdminCreateTemplate />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
