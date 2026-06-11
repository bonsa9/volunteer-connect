import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Empower Communities. <br/><span className="text-blue-600">Volunteer Today.</span></h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">Join thousands of volunteers across Ethiopia in making a real difference. Find campaigns that match your skills and passion.</p>
      <div className="flex justify-center gap-4">
        <Link to="/campaigns" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all">Explore Campaigns</Link>
        <Link to="/register" className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-slate-300 hover:bg-slate-50 transition-all">Join the Network</Link>
      </div>
    </div>
  );
}
