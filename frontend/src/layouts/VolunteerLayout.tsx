import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
      { label: 'Dashboard',         path: '/dashboard',          icon: 'dashboard',  exact: true },
    ],
  },
  {
    title: 'My Activity',
    items: [
      { label: 'My Signups',        path: '/dashboard/signups',  icon: 'signups' },
      { label: 'Browse Campaigns',  path: '/campaigns',          icon: 'campaigns' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Profile',        path: '/dashboard/profile',  icon: 'profile' },
    ],
  },
];

const NavIcon = ({ name }: { name: string }) => {
  const map: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    signups: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    campaigns: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    profile: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };
  return map[name] ?? <span className="w-4 h-4" />;
};

function getBreadcrumb(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.includes('signups')) return 'My Signups';
  if (pathname.includes('campaigns')) return 'Browse Campaigns';
  return 'Volunteer';
}

export default function VolunteerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-sans">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-[#078930] rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">VC</div>
          {sidebarOpen && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-bold text-slate-700 text-sm whitespace-nowrap">Volunteer Connect</span>
              <span className="text-[10px] text-[#078930] uppercase tracking-widest whitespace-nowrap font-semibold">Volunteer Portal</span>
            </div>
          )}
        </div>

        {/* XP Badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold opacity-80">XP Points</p>
                <p className="text-2xl font-black">1,240</p>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 opacity-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold">Lvl 7</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-[10px] opacity-75 mb-1">
                <span>Progress to Lvl 8</span>
                <span>1240 / 1500</span>
              </div>
              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        )}

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
                  const active = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        title={!sidebarOpen ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#078930] text-white shadow-sm'
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
            <img
              src="https://ui-avatars.com/api/?name=Merit+Alem&background=078930&color=fff"
              alt="Profile"
              className="w-8 h-8 rounded-full shrink-0"
            />
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-700 truncate">Merit Alem</span>
                <span className="text-xs text-[#078930] truncate">volunteer@vc.gov.et</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              id="vol-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-700">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang */}
            <div className="relative">
              <button
                id="vol-lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                <span className="font-semibold">{i18n.language === 'en' ? 'EN' : 'አማ'}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2 w-36">
                  {[{ code: 'en', label: 'English', flag: '🇺🇸' }, { code: 'am', label: 'አማርኛ', flag: '🇪🇹' }].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 ${i18n.language === l.code ? 'text-[#078930] font-semibold' : 'text-slate-700'}`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button id="vol-notif-btn" className="relative p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Avatar + logout */}
            <img src="https://ui-avatars.com/api/?name=Merit+Alem&background=078930&color=fff" alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
            <button id="vol-logout-btn" onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}
