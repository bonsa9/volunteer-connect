import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const TOOLTIP_STYLE = { borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 };

const monthlyVolunteers = [
  { month: 'Jan', volunteers: 8 }, { month: 'Feb', volunteers: 14 }, { month: 'Mar', volunteers: 11 },
  { month: 'Apr', volunteers: 22 }, { month: 'May', volunteers: 18 }, { month: 'Jun', volunteers: 31 },
];

const campaignBreakdown = [
  { name: 'Addis Cleanup', hours: 120 },
  { name: 'Medical Supply', hours: 85 },
  { name: 'Youth Outreach', hours: 64 },
];

const attendancePie = [
  { name: 'Attended', value: 78 },
  { name: 'Absent', value: 22 },
];

const PIE_COLORS = ['#DA121A', '#f0a0a0'];

const topVolunteers = [
  { name: 'Alemu Bekele', hours: 48, shifts: 6 },
  { name: 'Selam Tadesse', hours: 36, shifts: 5 },
  { name: 'Merit Alem', hours: 30, shifts: 4 },
  { name: 'Dawit Yohannes', hours: 22, shifts: 3 },
];

export default function Reports() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#DA121A] tracking-tight">Impact Report</h1>
          <p className="text-sm text-slate-500 mt-1">Volunteer distribution, attendance, and campaign analytics for your organization.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#DA121A] hover:bg-[#b00e15] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Volunteers', value: '42', sub: '+12 this month', icon: '🙋', color: 'text-[#DA121A]' },
          { label: 'Total Hours', value: '369', sub: 'Across all campaigns', icon: '⏱️', color: 'text-[#DA121A]' },
          { label: 'Campaigns Run', value: '3', sub: '2 active, 1 completed', icon: '📋', color: 'text-[#DA121A]' },
          { label: 'Attendance Rate', value: '78%', sub: 'Platform average: 71%', icon: '✅', color: 'text-green-700' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
            <div className="text-xs font-bold text-slate-800 mt-1">{card.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Volunteer Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Monthly Volunteer Sign-ups</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyVolunteers}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DA121A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#DA121A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="volunteers" stroke="#DA121A" fill="url(#volGrad)" strokeWidth={2.5} dot={{ fill: '#DA121A', strokeWidth: 0, r: 4 }} name="Volunteers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Pie */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {attendancePie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(val: any) => [`${val}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by Campaign */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Volunteer Hours by Campaign</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={campaignBreakdown} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="hours" fill="#DA121A" radius={[6, 6, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Volunteers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Top Volunteers</h2>
          <div className="flex-1 space-y-4">
            {topVolunteers.map((vol, i) => (
              <div key={vol.name} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-slate-300 text-slate-700' : 'bg-orange-200 text-orange-800'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{vol.name}</div>
                  <div className="text-xs text-slate-400">{vol.shifts} shifts · {vol.hours} hrs</div>
                </div>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#DA121A] rounded-full" style={{ width: `${(vol.hours / 48) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
