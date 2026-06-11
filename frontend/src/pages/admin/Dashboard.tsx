import React from 'react';

const stats = [
  { label: 'Total Volunteers', value: '1,240', delta: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-100', icon: '👥' },
  { label: 'Active Campaigns', value: '14', delta: '+2.0%', color: 'text-green-600', bg: 'bg-green-100', icon: '📋' },
  { label: 'Pending Signups', value: '42', delta: '-5.0%', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⏳' },
  { label: 'Total Hours', value: '18,500', delta: '+8.4%', color: 'text-purple-600', bg: 'bg-purple-100', icon: '⏱️' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of vital volunteer services and campaign statistics</p>
        </div>
        <div className="flex gap-2 text-sm">
          <select className="border border-slate-300 rounded-md px-3 py-1.5 bg-white"><option>Year</option></select>
          <select className="border border-slate-300 rounded-md px-3 py-1.5 bg-white"><option>Month</option></select>
          <button className="border border-slate-300 rounded-md px-4 py-1.5 bg-white font-medium hover:bg-slate-50">Clear</button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-medium text-sm">Vital Services</button>
        <button className="text-slate-500 hover:text-slate-800 px-4 py-2 font-medium text-sm">Registrations</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col relative overflow-hidden">
            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
            <div className="mt-2 text-3xl font-bold text-slate-800">{stat.value}</div>
            <div className={`mt-2 text-xs font-semibold ${stat.delta.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.delta} since last month
            </div>
            <div className={`absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-blue-600">Registrations</h3>
              <p className="text-xs text-slate-500">Monthly volunteer volume</p>
            </div>
            <select className="border border-slate-300 rounded text-sm px-2 py-1 bg-white">
              <option>Volunteers</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-l border-b border-slate-200 p-2 relative">
             {/* Fake chart bars */}
             <div className="w-1/12 bg-blue-100 rounded-t h-4"></div>
             <div className="w-1/12 bg-blue-200 rounded-t h-8"></div>
             <div className="w-1/12 bg-blue-300 rounded-t h-12"></div>
             <div className="w-1/12 bg-blue-400 rounded-t h-20"></div>
             <div className="w-1/12 bg-blue-500 rounded-t h-32"></div>
             <div className="w-1/12 bg-blue-600 rounded-t h-48"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-blue-600">Services Distribution</h3>
            <p className="text-xs text-slate-500">Distribution by service type</p>
          </div>
          <div className="flex items-center justify-around h-64">
             {/* Fake pie chart area */}
             <div className="w-40 h-40 rounded-full border-8 border-blue-500 border-t-red-500 border-r-green-500 border-b-yellow-500"></div>
             
             <ul className="space-y-3 text-sm">
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Campaign Signups (60%)</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Training (15%)</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Feedback (15%)</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Other (10%)</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
