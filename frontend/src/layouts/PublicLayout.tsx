import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const FULL_SCREEN_ROUTES = ['/login', '/register'];

export default function PublicLayout() {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => location.pathname === r);

  if (isFullScreen) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A3D91] rounded-full flex items-center justify-center text-white font-bold text-base">VC</div>
          <div>
            <div className="font-bold text-slate-800 text-base leading-tight">Volunteer Connect</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Ethiopia</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-slate-600 hover:text-[#0A3D91] transition-colors">Home</Link>
          <Link to="/campaigns" className="text-slate-600 hover:text-[#0A3D91] transition-colors">Campaigns</Link>
          <div className="h-4 w-px bg-slate-300" />
          <Link to="/login" className="text-[#0A3D91] hover:text-blue-900 font-semibold transition-colors">Log in</Link>
          <Link
            to="/register"
            className="bg-[#0A3D91] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#082d6b] transition-colors text-sm font-semibold"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 Volunteer Connect Ethiopia. Empowering communities.</p>
      </footer>
    </div>
  );
}
