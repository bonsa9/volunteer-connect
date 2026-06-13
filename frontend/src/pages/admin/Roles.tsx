import React, { useState } from 'react';

type Permission = { id: string; label: string; enabled: boolean };
type Role = { id: string; name: string; level: string; color: string; permissions: Permission[] };

const INITIAL_ROLES: Role[] = [
  {
    id: '1', name: 'Admin', level: 'System', color: '#0A3D91',
    permissions: [
      { id: 'p1', label: 'Manage Users', enabled: true },
      { id: 'p2', label: 'Manage Campaigns', enabled: true },
      { id: 'p3', label: 'Verify Organizations', enabled: true },
      { id: 'p4', label: 'Issue Badges', enabled: true },
      { id: 'p5', label: 'Send Broadcasts', enabled: true },
    ]
  },
  {
    id: '2', name: 'Organization', level: 'Institutional', color: '#DA121A',
    permissions: [
      { id: 'p1', label: 'Manage Users', enabled: false },
      { id: 'p2', label: 'Manage Campaigns', enabled: true },
      { id: 'p3', label: 'Verify Organizations', enabled: false },
      { id: 'p4', label: 'Issue Badges', enabled: false },
      { id: 'p5', label: 'Send Broadcasts', enabled: false },
    ]
  },
  {
    id: '3', name: 'Volunteer', level: 'Public', color: '#078930',
    permissions: [
      { id: 'p1', label: 'Manage Users', enabled: false },
      { id: 'p2', label: 'Manage Campaigns', enabled: false },
      { id: 'p3', label: 'Verify Organizations', enabled: false },
      { id: 'p4', label: 'Issue Badges', enabled: false },
      { id: 'p5', label: 'Send Broadcasts', enabled: false },
    ]
  },
];

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
  const [toast, setToast] = useState<string | null>(null);

  const selectedRole = roles.find(r => r.id === selectedRoleId)!;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const togglePermission = (permId: string) => {
    setRoles(roles.map(role =>
      role.id === selectedRoleId
        ? { ...role, permissions: role.permissions.map(p => p.id === permId ? { ...p, enabled: !p.enabled } : p) }
        : role
    ));
  };

  const saveRole = () => showToast(`✅ Permissions updated for "${selectedRole.name}" role!`);

  return (
    <div className="space-y-6 pb-10 relative">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-50 text-[#0A3D91] border border-blue-200 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A3D91] tracking-tight">Role Management</h1>
          <p className="text-sm text-slate-500 mt-1">Configure platform roles and their associated permissions.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#0A3D91] hover:bg-[#082d6b] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">System Roles</h2>
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedRoleId === role.id
                  ? 'shadow-md border-transparent'
                  : 'bg-white border-slate-200 hover:shadow-sm'
              }`}
              style={selectedRoleId === role.id ? { background: role.color, borderColor: role.color } : {}}
            >
              <div className={`font-bold text-sm mb-1 ${selectedRoleId === role.id ? 'text-white' : 'text-slate-900'}`}>
                {role.name}
              </div>
              <div className={`text-xs ${selectedRoleId === role.id ? 'text-white/70' : 'text-slate-500'}`}>
                Level: {role.level}
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mt-2 px-2 py-0.5 rounded-md inline-block ${
                selectedRoleId === role.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {role.permissions.filter(p => p.enabled).length}/{role.permissions.length} permissions
              </div>
            </button>
          ))}
        </div>

        {/* Permissions Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">{selectedRole.name} — Permissions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Toggle permissions granted to this role across the platform.</p>
            </div>
            <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-lg shrink-0"
              style={{ background: selectedRole.color }}>
              {selectedRole.name.charAt(0)}
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {selectedRole.permissions.map(perm => (
              <label key={perm.id} className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer group transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    perm.enabled ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-sm ${perm.enabled ? 'text-slate-900' : 'text-slate-500'}`}>
                    {perm.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                    perm.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {perm.enabled ? 'Allowed' : 'Denied'}
                  </span>
                  {/* Toggle switch */}
                  <div
                    onClick={() => togglePermission(perm.id)}
                    className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${perm.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${perm.enabled ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">
              <span className="font-black text-slate-800">{selectedRole.permissions.filter(p => p.enabled).length}</span> of {selectedRole.permissions.length} permissions enabled
            </span>
            <button
              onClick={saveRole}
              className="bg-[#0A3D91] hover:bg-[#082d6b] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
