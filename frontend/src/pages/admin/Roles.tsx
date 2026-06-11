import React from 'react';

export default function Roles() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Role Management</h1>
          <p className="text-sm text-slate-500">Manage User Roles and Permissions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700">+ Create Role</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Role Name</th>
              <th className="px-6 py-4 font-medium">Level</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Admin</td>
              <td className="px-6 py-4">System</td>
              <td className="px-6 py-4">
                 <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                   <div className="w-3 h-3 bg-white rounded-full translate-x-5"></div>
                 </div>
              </td>
              <td className="px-6 py-4 text-slate-400 flex gap-2">
                 <span className="hover:text-blue-600 cursor-pointer">✏️</span>
                 <span className="hover:text-red-600 cursor-pointer">🗑️</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Volunteer</td>
              <td className="px-6 py-4">Public</td>
              <td className="px-6 py-4">
                 <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                   <div className="w-3 h-3 bg-white rounded-full translate-x-5"></div>
                 </div>
              </td>
              <td className="px-6 py-4 text-slate-400 flex gap-2">
                 <span className="hover:text-blue-600 cursor-pointer">✏️</span>
                 <span className="hover:text-red-600 cursor-pointer">🗑️</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
