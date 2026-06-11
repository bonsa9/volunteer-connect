import React from 'react';

export default function Campaigns() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Active Campaigns</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-4xl">🌳</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Addis Community Cleanup</h3>
          <p className="text-slate-600 text-sm mb-4 flex-1">Join neighborhood teams to remove waste and restore public spaces across Addis Ababa.</p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <span className="text-sm font-semibold text-blue-600">Jun 22 - Jun 28</span>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
