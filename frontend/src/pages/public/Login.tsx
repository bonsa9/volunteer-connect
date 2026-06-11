import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
      <p className="text-slate-500 text-sm mb-6">Enter your credentials to access your account.</p>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded text-blue-600" />
            <span className="text-slate-600">Remember me</span>
          </label>
          <a href="#" className="text-blue-600 font-medium hover:underline">Forgot password?</a>
        </div>
        <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-blue-700 mt-2">Log In</button>
      </form>
      
      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
