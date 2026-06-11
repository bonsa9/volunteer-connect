import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">VC</div>
          <div>
             <div className="font-bold text-slate-800 text-lg leading-tight">Volunteer Connect</div>
             <div className="text-xs text-slate-500 uppercase tracking-widest">Public Portal</div>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-slate-600 hover:text-blue-600">Home</Link>
          <Link to="/campaigns" className="text-slate-600 hover:text-blue-600">Campaigns</Link>
          <div className="h-4 w-px bg-slate-300"></div>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">Log in</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">Sign up</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>&copy; 2026 Volunteer Connect. Empowering Ethiopian communities.</p>
      </footer>
    </div>
  );
}
