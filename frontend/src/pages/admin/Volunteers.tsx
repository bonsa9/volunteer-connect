import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

const MOCK_VOLUNTEERS = [
  { id: '1', name: 'Alemu Bekele', email: 'alemu@example.com', phone: '0911-000-101', level: 5, points: 2450, status: 'active' },
  { id: '2', name: 'Selam Tadesse', email: 'selam@example.com', phone: '0922-300-200', level: 3, points: 1100, status: 'active' },
  { id: '3', name: 'Merit Alem', email: 'merit@example.com', phone: '0933-101-555', level: 4, points: 1800, status: 'inactive' },
  { id: '4', name: 'Dawit Yohannes', email: 'dawit@example.com', phone: '0944-210-300', level: 2, points: 640, status: 'active' },
  { id: '5', name: 'Hana Girma', email: 'hana@example.com', phone: '0911-333-444', level: 1, points: 120, status: 'active' },
];

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/volunteers')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVolunteers(data);
        } else {
          setVolunteers(MOCK_VOLUNTEERS);
        }
        setLoading(false);
      })
      .catch(() => {
        setVolunteers(MOCK_VOLUNTEERS);
        setLoading(false);
      });
  }, []);

  const filtered = volunteers.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A3D91] tracking-tight">Volunteers</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all registered volunteers on the platform.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:border-[#0A3D91] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium">Loading volunteers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-medium">
            No volunteers found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-5">Volunteer</th>
                  <th className="p-5">Contact</th>
                  <th className="p-5">Level</th>
                  <th className="p-5">XP Points</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0A3D91]/10 text-[#0A3D91] flex items-center justify-center font-bold text-sm shrink-0">
                          {vol.name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#0A3D91] transition-colors">{vol.name}</div>
                          <div className="text-xs text-slate-400 font-medium">VC-{vol.id?.toString().padStart(6, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-slate-700 font-medium">{vol.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{vol.phone || 'N/A'}</div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-[#0A3D91] text-xs font-bold rounded-md border border-blue-100">
                        ⭐ Level {vol.level || 1}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="font-bold text-slate-800">{(vol.points || 0).toLocaleString()}</span>
                      <span className="text-xs text-slate-400 ml-1">XP</span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                        vol.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vol.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                        {vol.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <Link
                        to={`/admin/volunteers/${vol.id}`}
                        className="inline-flex items-center gap-1.5 text-[#0A3D91] font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
