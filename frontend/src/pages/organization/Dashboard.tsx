import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#1e293b',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
};

const signupTrend = [
  { month: 'Jan', signups: 3 },
  { month: 'Feb', signups: 5 },
  { month: 'Mar', signups: 8 },
  { month: 'Apr', signups: 12 },
  { month: 'May', signups: 18 },
  { month: 'Jun', signups: 24 },
];

const shiftAttendance = [
  { shift: 'Shift 1', attended: 12, absent: 3 },
  { shift: 'Shift 2', attended: 18, absent: 2 },
  { shift: 'Shift 3', attended: 9,  absent: 6 },
  { shift: 'Shift 4', attended: 15, absent: 1 },
  { shift: 'Shift 5', attended: 22, absent: 4 },
];

const recentSignups = [
  { name: 'Abebe Bikila',   role: 'Field Volunteer',   time: '2 hrs ago',   avatar: 'AB' },
  { name: 'Hana Girma',     role: 'Event Coordinator', time: '5 hrs ago',   avatar: 'HG' },
  { name: 'Yonas Haile',    role: 'Field Volunteer',   time: '1 day ago',   avatar: 'YH' },
  { name: 'Ruth Bekele',    role: 'Translator',        time: '2 days ago',  avatar: 'RB' },
];

export default function OrganizationDashboard() {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    upcomingShifts: 0,
    totalVolunteers: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const userInfo = getUserInfo();
        if (!userInfo || !userInfo.email) return;

        // Fetch org profile
        const orgRes: any = await fetchWithAuth(`/api/organizations?search=${userInfo.email}`);
        const org = Array.isArray(orgRes.items) && orgRes.items.length > 0 ? orgRes.items[0] : null;
        
        if (org) {
          // Fetch campaigns for this org
          const campaignsRes: any = await fetchWithAuth(`/api/campaigns?organizationId=${org.id}`);
          const campaigns = campaignsRes.items || [];
          
          let totalShifts = 0;
          let totalVols = 0;

          // Simple mock aggregation for the dashboard using real activeCampaigns count
          setStats({
            activeCampaigns: campaigns.length,
            upcomingShifts: campaigns.reduce((acc: number, c: any) => acc + (c.opportunities?.length || 0), 0) || 8,
            totalVolunteers: 45, // In a real app we would query unique signups for this org
            attendanceRate: 87, // Mock
          });
        }
      } catch (err) { 
        console.error('Failed to load org dashboard data', err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#DA121A]">Organization Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage campaigns, track attendance, and view impact reports.</p>
        </div>
        <Link
          to="/org/campaigns/create"
          id="create-campaign-btn"
          className="inline-flex items-center gap-2 bg-[#DA121A] hover:bg-[#b00e15] text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm shadow-red-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Campaign
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns',   value: stats.activeCampaigns,  sub: 'Currently running',       icon: '📋', bg: 'bg-red-50',    border: 'border-red-100',    color: 'text-[#DA121A]' },
          { label: 'Upcoming Shifts',    value: stats.upcomingShifts,   sub: 'Manage shifts →',          icon: '📅', bg: 'bg-blue-50',   border: 'border-blue-100',   color: 'text-[#0A3D91]', link: '/org/campaigns' },
          { label: 'Volunteers Engaged', value: stats.totalVolunteers,  sub: 'Unique sign-ups',          icon: '👥', bg: 'bg-green-50',  border: 'border-green-100',  color: 'text-[#078930]' },
          { label: 'Attendance Rate',    value: `${stats.attendanceRate}%`, sub: '+3% from last month',  icon: '✅', bg: 'bg-amber-50',  border: 'border-amber-100',  color: 'text-amber-600' },
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-xl border ${card.border} p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
            <div className={`absolute top-3 right-3 w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center text-xl`}>
              {card.icon}
            </div>
            <p className="text-xs font-medium text-slate-500 pr-10">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            {card.link ? (
              <Link to={card.link} className="text-xs text-[#0A3D91] font-semibold mt-1 hover:underline block">{card.sub}</Link>
            ) : (
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Volunteer signup trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-700">Volunteer Sign-up Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly new volunteer sign-ups</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={signupTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#DA121A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DA121A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#DA121A', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#DA121A"
                strokeWidth={2.5}
                fill="url(#redGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#DA121A', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-700">Shift Attendance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Attended vs. absent per shift</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={shiftAttendance} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="shift" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(218,18,26,0.05)' }} />
              <Bar dataKey="attended" fill="#078930" radius={[4, 4, 0, 0]} maxBarSize={24} name="Attended" />
              <Bar dataKey="absent"   fill="#DA121A" radius={[4, 4, 0, 0]} maxBarSize={24} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-[#078930]" /> Attended
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DA121A]" /> Absent
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Signups ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-700">Recent Volunteer Sign-ups</h3>
          <Link to="/org/campaigns" className="text-xs text-[#DA121A] font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Volunteer</th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Role</th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Joined</th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSignups.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#DA121A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {v.avatar}
                      </div>
                      <span className="font-medium text-slate-700">{v.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500">{v.role}</td>
                  <td className="py-3 text-slate-400">{v.time}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
