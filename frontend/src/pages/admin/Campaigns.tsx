import React from 'react';

export default function Campaigns() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Campaigns</h1>
          <p className="text-sm text-slate-500">View and manage all active campaigns</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700">+ New Campaign</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Campaign #</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Start Date</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">CMP-20260611</td>
              <td className="px-6 py-4">Addis Community Cleanup</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span></td>
              <td className="px-6 py-4">Jun 22, 2026</td>
              <td className="px-6 py-4 text-blue-600 hover:text-blue-800 cursor-pointer">View</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
