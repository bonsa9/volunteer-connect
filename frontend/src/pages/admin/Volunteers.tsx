import React from 'react';

export default function Volunteers() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Volunteer Management</h1>
          <p className="text-sm text-slate-500">Manage volunteer information</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700">+ Add Volunteer</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Registration Number</th>
              <th className="px-6 py-4 font-medium">Full Name</th>
              <th className="px-6 py-4 font-medium">Phone Number</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">VC-0003700095</td>
              <td className="px-6 py-4">Merit Alem</td>
              <td className="px-6 py-4">+251911123456</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">Approved</span></td>
              <td className="px-6 py-4 text-blue-600 hover:text-blue-800 cursor-pointer">👁️</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
