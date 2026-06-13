import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type NavItem = {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin', icon: 'dashboard', exact: true },
    ],
  },
  {
    title: 'Campaign Service',
    items: [
      { label: 'Campaigns', path: '/admin/campaigns', icon: 'campaigns' },
      { label: 'Opportunities', path: '/admin/opportunities', icon: 'opportunities' },
    ],
  },
  {
    title: 'Volunteer Service',
    items: [
      { label: 'Volunteers List', path: '/admin/volunteers', icon: 'volunteers' },
    ],
  },
  {
    title: 'User Management',
    items: [
      { label: 'Roles', path: '/admin/roles', icon: 'roles' },
    ],
  },
  {
    title: 'Approvals & Verifications',
    items: [
      { label: 'Organizations', path: '/admin/verifications/orgs', icon: 'orgs' },
      { label: 'Badges', path: '/admin/verifications/badges', icon: 'badges' },
      { label: 'Doc Verification', path: '/admin/verifications/docs', icon: 'docs' },
    ],
  },
  {
    title: 'Template Service',
    items: [
      { label: 'Template List', path: '/admin/templates', icon: 'templates', exact: true },
      { label: 'Create Template', path: '/admin/templates/create', icon: 'create_template' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Notifications', path: '/admin/notifications', icon: 'notifications' },
    ],
  },
];

const NavIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    campaigns: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    opportunities: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    volunteers: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    orgs: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    badges: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    docs: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    templates: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    create_template: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    notifications: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  };
  return icons[name] ?? <span className="w-4 h-4" />;
};

function getBreadcrumb(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.includes('campaigns/')) return 'Campaign Details';
  if (pathname.includes('campaigns')) return 'Campaigns';
  if (pathname.includes('opportunities')) return 'Opportunities';
  if (pathname.includes('volunteers')) return 'Volunteers';
  if (pathname.includes('roles')) return 'Roles';
  if (pathname.includes('verifications/orgs')) return 'Org Verifications';
  if (pathname.includes('verifications/badges')) return 'Badge Verifications';
  if (pathname.includes('verifications/docs')) return 'Doc Verification';
  if (pathname.includes('templates/create')) return 'Create Template';
  if (pathname.includes('templates')) return 'Template List';
  if (pathname.includes('notifications')) return 'Notifications';
  return 'Admin';
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const breadcrumb = getBreadcrumb(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] text-slate-800 font-sans">
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-[#0A3D91] rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">VC</div>
          {sidebarOpen && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-bold text-slate-700 text-sm whitespace-nowrap">Volunteer Connect</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest whitespace-nowrap">Admin Portal</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              {sidebarOpen && (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1.5">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path) && item.path !== '/admin';
                  const exactActive = location.pathname === item.path;
                  const active = item.exact ? exactActive : isActive;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        title={!sidebarOpen ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#0A3D91] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                      >
                        <span className={active ? 'text-white' : 'text-slate-400'}>
                          <NavIcon name={item.icon} />
                        </span>
                        {sidebarOpen && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-100">
          <div className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-[#0A3D91] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">A</div>
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-700 truncate">Admin ICS</span>
                <span className="text-xs text-[#0A3D91] truncate">admin@vc.gov.et</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          {/* Left: toggle + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              id="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <svg className="w-4 h-4 cursor-pointer hover:text-[#0A3D91]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-700">{breadcrumb}</span>
            </div>
          </div>

          {/* Right: lang, notif, avatar */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="relative">
              <button
                id="admin-lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                <span className="font-semibold">{i18n.language === 'en' ? 'US English' : 'አማርኛ'}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2 w-40">
                  <p className="text-xs text-slate-400 uppercase tracking-wider px-4 pb-1.5 font-semibold">Select Language</p>
                  {[
                    { code: 'en', label: 'US English', flag: '🇺🇸' },
                    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${i18n.language === lang.code ? 'text-[#0A3D91] font-semibold' : 'text-slate-700'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {i18n.language === lang.code && (
                        <svg className="w-3.5 h-3.5 ml-auto text-[#0A3D91]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification bell */}
            <button id="admin-notif-btn" className="relative text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
            </button>

            {/* Avatar + logout */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center text-slate-500 font-bold text-sm">A</div>
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>

      {/* Overlay for lang dropdown */}
      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}
