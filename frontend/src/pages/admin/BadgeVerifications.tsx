import React, { useState } from 'react';

export default function BadgeVerifications() {
  const [requests] = useState([
    { id: '1', volunteer: 'Merit Alem', badge: 'Community Leader', xp: 1240, status: 'pending' },
    { id: '2', volunteer: 'Samuel Tesfaye', badge: 'First Responder', xp: 980, status: 'approved' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Badge Verifications</h1>
          <p className="text-sm text-slate-500 mt-1">Review volunteer milestones and issue badges</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Volunteer</th>
              <th className="p-4 font-semibold">Requested Badge</th>
              <th className="p-4 font-semibold">Current XP</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{req.volunteer}</td>
                <td className="p-4 text-slate-500 font-semibold text-blue-600">{req.badge}</td>
                <td className="p-4 text-slate-500">{req.xp}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  {req.status === 'pending' && (
                    <>
                      <button className="text-green-600 font-semibold hover:underline">Issue Badge</button>
                      <button className="text-red-600 font-semibold hover:underline">Deny</button>
                    </>
                  )}
                  <button className="text-slate-600 font-semibold hover:underline">Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
