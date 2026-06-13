import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar,
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

const monthlyHours = [
  { month: 'Aug', hours: 2 },
  { month: 'Sep', hours: 3 },
  { month: 'Oct', hours: 1 },
  { month: 'Nov', hours: 4 },
  { month: 'Dec', hours: 3 },
  { month: 'Jan', hours: 5 },
  { month: 'Feb', hours: 4 },
  { month: 'Mar', hours: 6 },
  { month: 'Apr', hours: 8 },
  { month: 'May', hours: 7 },
  { month: 'Jun', hours: 12 },
];

const leaderboard = [
  { rank: 1, name: 'Merit Alem',      xp: 1240, badge: '🥇', color: 'bg-yellow-100 text-yellow-700' },
  { rank: 2, name: 'Ruth Bekele',     xp: 1120, badge: '🥈', color: 'bg-slate-100 text-slate-600' },
  { rank: 3, name: 'Samuel Tesfaye',  xp:  980, badge: '🥉', color: 'bg-orange-100 text-orange-600' },
  { rank: 4, name: 'Hana Girma',      xp:  860, badge: '',    color: 'bg-slate-50 text-slate-500' },
  { rank: 5, name: 'Yonas Haile',     xp:  740, badge: '',    color: 'bg-slate-50 text-slate-500' },
];

const badges = [
  { icon: '🌱', label: 'First Shift',       earned: true },
  { icon: '🌿', label: '5 Hours',           earned: true },
  { icon: '🌳', label: '10 Hours',          earned: true },
  { icon: '⭐', label: 'Top Volunteer',     earned: false },
  { icon: '🏅', label: 'Campaign Leader',   earned: false },
  { icon: '🎖️', label: 'Community Hero',   earned: false },
];

const recentActivity = [
  { icon: '✅', text: 'Signed up for Tree Planting Drive', time: '2 days ago', color: 'bg-green-50 text-green-600' },
  { icon: '⏱️', text: 'Logged 3 hours at Food Bank Campaign', time: '1 week ago', color: 'bg-blue-50 text-blue-600' },
  { icon: '🏅', text: 'Earned "10 Hours" badge', time: '2 weeks ago', color: 'bg-amber-50 text-amber-600' },
];

export default function VolunteerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ hours: 0, upcomingShifts: 0, impactScore: 0, xp: 0, level: 1 });
  const [volunteerName, setVolunteerName] = useState('Volunteer');

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.email) {
      fetchWithAuth(`/api/volunteers?search=${userInfo.email}`)
        .then((data: any) => {
          const v = Array.isArray(data.items) && data.items.length > 0 ? data.items[0] : null;
          if (v) {
            setVolunteerName(v.name || 'Volunteer');
            let upcoming = 0;
            if (v.signups) {
              upcoming = v.signups.filter((s: any) => !s.attended).length;
            }
            setStats({
              hours: Number(v.totalHours) || 0,
              upcomingShifts: upcoming,
              impactScore: v.points || 0,
              xp: v.points || 0,
              level: v.level || 1
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const xpPercent = Math.round((stats.xp / (stats.level * 200 + 300)) * 100) || 0;
  const nextLevelXp = stats.level * 200 + 300;
  const xpNeeded = nextLevelXp - stats.xp;

  const radialData = [
    { name: 'XP', value: xpPercent, fill: '#078930' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#078930]">Welcome back, {volunteerName.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's your volunteer impact overview.</p>
        </div>
        <Link
          to="/campaigns"
          id="find-opportunities-btn"
          className="inline-flex items-center gap-2 bg-[#078930] hover:bg-[#056623] text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm shadow-green-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find Opportunities
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours',     value: stats.hours,         sub: 'All time',   icon: '⏱️', bg: 'bg-green-50',  border: 'border-green-100', color: 'text-[#078930]' },
          { label: 'Upcoming Shifts', value: stats.upcomingShifts, sub: 'View schedule →', icon: '📅', bg: 'bg-blue-50',   border: 'border-blue-100',  color: 'text-[#0A3D91]', link: '/volunteer/signups' },
          { label: 'Impact Score',    value: stats.impactScore,   sub: `Level ${stats.level} Volunteer`, icon: '🔥', bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-600' },
          { label: 'XP Points',       value: `${stats.xp}`,       sub: `${xpNeeded} to next level`, icon: '⭐', bg: 'bg-yellow-50', border: 'border-yellow-100', color: 'text-yellow-600' },
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

      {/* ── Charts + Leaderboard row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Bar chart */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-700">Monthly Volunteer Hours</h3>
            <p className="text-xs text-slate-400">Your volunteering activity over time</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyHours} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(7,137,48,0.06)' }} />
              <Bar dataKey="hours" fill="#078930" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* XP Radial + Badges */}
        <div className="xl:col-span-2 space-y-4">
          {/* XP progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-3">XP Progress</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ResponsiveContainer width={90} height={90}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={radialData}
                    startAngle={90}
                    endAngle={90 - 360 * (xpPercent / 100)}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#f1f5f9' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#078930]">{xpPercent}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Level {stats.level}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stats.xp} / {nextLevelXp} XP</p>
                <p className="text-xs text-[#078930] font-semibold mt-1">{xpNeeded} XP to Level {stats.level + 1}</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-3">My Badges</h3>
            <div className="grid grid-cols-3 gap-2">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                    b.earned ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100 opacity-40'
                  }`}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-600 leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: Activity + Leaderboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center text-base shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700">🏆 Top Volunteers</h3>
            <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-full">This Month</span>
          </div>
          <div className="space-y-2">
            {leaderboard.map((v) => (
              <div
                key={v.rank}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  v.name === volunteerName ? 'bg-green-50 border border-green-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-7 h-7 rounded-full ${v.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {v.badge || v.rank}
                </div>
                <span className={`flex-1 text-sm font-medium ${v.name === volunteerName ? 'text-[#078930] font-bold' : 'text-slate-700'}`}>
                  {v.name} {v.name === volunteerName && <span className="text-xs">(You)</span>}
                </span>
                <span className="text-sm font-bold text-slate-600">{v.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
