import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchWithAuth } from '../../utils/api';

// ── Types ──────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string | number;
  delta: string;
  positive: boolean;
  icon: JSX.Element;
  color: string;
  bg: string;
  border: string;
}

// ── Mock monthly data (replace with real API data when available) ──
const monthlyVolunteers = [
  { month: 'Jul', count: 3 },
  { month: 'Aug', count: 5 },
  { month: 'Sep', count: 4 },
  { month: 'Oct', count: 7 },
  { month: 'Nov', count: 6 },
  { month: 'Dec', count: 8 },
  { month: 'Jan', count: 11 },
  { month: 'Feb', count: 9 },
  { month: 'Mar', count: 13 },
  { month: 'Apr', count: 18 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 30 },
];

// ── Stat card icons ──
const Icons = {
  volunteers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  campaigns: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  opportunities: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  signups: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  orgs: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

const PIE_COLORS = ['#0A3D91', '#DA121A', '#078930', '#FCDD09', '#6366f1'];

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#1e293b',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    volunteers: 0,
    campaigns: 0,
    opportunities: 0,
    signups: 0,
    organizations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'volunteers' | 'campaigns'>('volunteers');

  useEffect(() => {
    const load = async () => {
      try {
        const [volunteers, campaigns, opportunities, signups, organizations] = await Promise.all([
          fetchWithAuth('/api/volunteers'),
          fetchWithAuth('/api/campaigns'),
          fetchWithAuth('/api/opportunities'),
          fetchWithAuth('/api/signups'),
          fetchWithAuth('/api/organizations'),
        ]);
        setStats({
          volunteers: Array.isArray(volunteers?.items) ? volunteers.items.length : (Array.isArray(volunteers) ? volunteers.length : 0),
          campaigns: Array.isArray(campaigns?.items) ? campaigns.items.length : (Array.isArray(campaigns) ? campaigns.length : 0),
          opportunities: Array.isArray(opportunities?.items) ? opportunities.items.length : (Array.isArray(opportunities) ? opportunities.length : 0),
          signups: Array.isArray(signups?.items) ? signups.items.length : (Array.isArray(signups) ? signups.length : 0),
          organizations: Array.isArray(organizations?.items) ? organizations.items.length : (Array.isArray(organizations) ? organizations.length : 0),
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards: StatCard[] = [
    {
      label: 'Total Volunteers',
      value: loading ? '—' : stats.volunteers,
      delta: '+12.5%',
      positive: true,
      icon: Icons.volunteers,
      color: 'text-[#0A3D91]',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Active Campaigns',
      value: loading ? '—' : stats.campaigns,
      delta: '+2.0%',
      positive: true,
      icon: Icons.campaigns,
      color: 'text-[#DA121A]',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      label: 'Total Opportunities',
      value: loading ? '—' : stats.opportunities,
      delta: '+5.0%',
      positive: true,
      icon: Icons.opportunities,
      color: 'text-[#078930]',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Total Sign-ups',
      value: loading ? '—' : stats.signups,
      delta: '0.0%',
      positive: true,
      icon: Icons.signups,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Organizations',
      value: loading ? '—' : stats.organizations,
      delta: '0.0%',
      positive: true,
      icon: Icons.orgs,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ];

  // Pie data based on stats
  const pieData = [
    { name: 'Volunteers', value: Math.max(stats.volunteers, 1) },
    { name: 'Campaigns', value: Math.max(stats.campaigns, 1) },
    { name: 'Opportunities', value: Math.max(stats.opportunities, 1) },
    { name: 'Sign-ups', value: Math.max(stats.signups, 1) },
    { name: 'Organizations', value: Math.max(stats.organizations, 1) },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-ET', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* ── Page Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A3D91]">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of vital volunteer services and campaign statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date filter */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-slate-400 text-xs font-medium">From</span>
            <select id="filter-from-year" className="border border-slate-300 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:border-[#0A3D91]">
              <option>Year</option>
              {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <select id="filter-from-month" className="border border-slate-300 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:border-[#0A3D91]">
              <option>Month</option>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-slate-400 text-xs font-medium">To</span>
            <select id="filter-to-year" className="border border-slate-300 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:border-[#0A3D91]">
              <option>Year</option>
              {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <select id="filter-to-month" className="border border-slate-300 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:border-[#0A3D91]">
              <option>Month</option>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button id="filter-clear-btn" className="text-xs border border-slate-300 rounded-md px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
            Clear
          </button>

          {/* Clock */}
          <div className="hidden xl:flex flex-col items-end text-xs text-slate-500 border-l border-slate-200 pl-3">
            <span className="font-bold text-slate-700 text-base leading-none">{timeStr}</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex gap-2">
        <button
          id="tab-volunteers"
          onClick={() => setActiveTab('volunteers')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'volunteers'
              ? 'bg-[#0A3D91] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Volunteers
        </button>
        <button
          id="tab-campaigns"
          onClick={() => setActiveTab('campaigns')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'campaigns'
              ? 'bg-[#0A3D91] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Campaigns
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl border ${card.border} p-4 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow`}
          >
            <div className={`absolute top-4 right-4 w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
            <span className="text-xs font-medium text-slate-500 pr-12 leading-tight">{card.label}</span>
            <div className={`mt-3 text-3xl font-bold text-slate-800 ${loading ? 'animate-pulse' : ''}`}>
              {card.value}
            </div>
            <div className={`mt-1.5 text-xs font-semibold flex items-center gap-1 ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
              {card.positive ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {card.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Area chart — 3/5 width */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-700">
                {activeTab === 'volunteers' ? 'Volunteer Registration' : 'Campaign Activity'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly registration volume</p>
            </div>
            <select id="chart-metric-select" className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-[#0A3D91] text-slate-600">
              <option>{activeTab === 'volunteers' ? 'Volunteers' : 'Campaigns'}</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyVolunteers} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A3D91" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0A3D91" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ stroke: '#0A3D91', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0A3D91"
                strokeWidth={2.5}
                fill="url(#colorCount)"
                dot={false}
                activeDot={{ r: 5, fill: '#0A3D91', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart — 2/5 width */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-700">Distribution of Services</h3>
            <p className="text-xs text-slate-400 mt-0.5">By service type</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="mt-2 space-y-1.5">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-700">{loading ? '—' : entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {[
            { icon: '👤', text: 'New volunteer registered', sub: 'Abebe Bikila joined as a volunteer', time: '2 min ago', color: 'bg-blue-50 text-blue-600' },
            { icon: '📋', text: 'New campaign created', sub: 'Tree Planting Drive — Addis Ababa', time: '1 hr ago', color: 'bg-green-50 text-green-600' },
            { icon: '🏢', text: 'Organization pending verification', sub: 'Green Ethiopia NGO awaiting review', time: '3 hrs ago', color: 'bg-amber-50 text-amber-600' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center text-base shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{item.sub}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
