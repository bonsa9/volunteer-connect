import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-[#0A3D91]/10 text-[#0A3D91] rounded-3xl flex items-center justify-center font-black text-4xl mb-6 shadow-sm border border-blue-100">
        404
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Page Not Found</h1>
      <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you mistyped the URL.
      </p>
      <Link 
        to="/" 
        className="bg-[#0A3D91] hover:bg-[#082d6b] text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
