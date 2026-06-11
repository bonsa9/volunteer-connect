import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Create an Account</h2>
      <p className="text-slate-500 text-sm mb-6">Join as a volunteer to start making an impact.</p>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" placeholder="Abebe Bikila" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" placeholder="Create a strong password" />
        </div>
        <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-blue-700 mt-4">Register</button>
      </form>
      
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}
