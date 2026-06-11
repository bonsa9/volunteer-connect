import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navSections = [
  {
    title: 'Main',
    items: [{ label: 'Dashboard', path: '/admin', icon: '📊' }],
  },
  {
    title: 'Campaign Service',
    items: [
      { label: 'Campaigns', path: '/admin/campaigns', icon: '📋' },
      { label: 'Opportunities', path: '/admin/opportunities', icon: '🎯' },
    ],
  },
  {
    title: 'Volunteer Service',
    items: [
      { label: 'Volunteers List', path: '/admin/volunteers', icon: '👥' },
    ],
  },
  {
    title: 'User Management',
    items: [
      { label: 'Roles', path: '/admin/roles', icon: '🛡️' },
    ],
  },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">VC</div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-700 text-sm">Volunteer Connect</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">Admin Portal</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-6 px-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">Admin User</span>
              <span className="text-xs text-blue-600">admin@example.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="cursor-pointer hover:text-blue-600">🏠</span>
            <span>/</span>
            <span className="font-medium text-slate-800">
              {location.pathname === '/admin' ? 'Dashboard' : 
               location.pathname.includes('campaigns') ? 'Campaigns' : 
               location.pathname.includes('opportunities') ? 'Opportunities' : 
               location.pathname.includes('volunteers') ? 'Volunteers' : 'Roles'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="text-slate-400 hover:text-slate-600">🌐 EN</button>
             <button className="text-slate-400 hover:text-slate-600 relative">
               🔔
               <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
             </button>
             <div className="w-8 h-8 bg-slate-200 rounded-full cursor-pointer"></div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
