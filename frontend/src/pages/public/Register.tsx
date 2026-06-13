import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Role = 'VOLUNTEER' | 'ORGANIZATION';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [role, setRole]         = useState<Role>('VOLUNTEER');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate  = useNavigate();
  const { i18n }  = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { value: Role; label: string; desc: string; icon: string }[] = [
    { value: 'VOLUNTEER',    label: 'Volunteer',    desc: 'I want to find & join campaigns',   icon: '🙋' },
    { value: 'ORGANIZATION', label: 'Organization', desc: 'I want to post & manage campaigns', icon: '🏢' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0A3D91] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white opacity-5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full bg-white opacity-5" />

        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          {/* Flag stripe */}
          <div className="flex gap-0 w-64 h-2 rounded-full overflow-hidden mb-1">
            <div className="flex-1 bg-[#078930]" />
            <div className="flex-1 bg-[#FCDD09]" />
            <div className="flex-1 bg-[#DA121A]" />
          </div>

          {/* Badge */}
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-[#0A3D91] leading-none">VC</span>
              <div className="flex gap-0.5 mt-0.5">
                <div className="w-1.5 h-1 rounded-full bg-[#078930]" />
                <div className="w-1.5 h-1 rounded-full bg-[#FCDD09]" />
                <div className="w-1.5 h-1 rounded-full bg-[#DA121A]" />
              </div>
            </div>
          </div>

          <div className="text-white">
            <p className="text-lg font-bold tracking-wide">Join the Movement</p>
            <p className="text-xs font-medium tracking-widest uppercase text-blue-200 mt-1">
              Volunteer Connect Ethiopia
            </p>
          </div>

          <div className="w-20 border-t border-blue-400 opacity-40" />

          <p className="text-blue-200 text-sm max-w-xs leading-relaxed">
            Create your free account and start making a real difference across Ethiopia.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-3 mt-2 w-full max-w-xs">
            {[
              { step: '01', text: 'Create your free account' },
              { step: '02', text: 'Browse campaigns & opportunities' },
              { step: '03', text: 'Sign up & earn impact badges' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 text-sm">
                <span className="w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <span className="text-blue-100">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-[#0A3D91] flex items-center justify-center text-white font-black text-sm">VC</div>
            <span className="font-bold text-slate-800 text-sm">Volunteer Connect</span>
          </div>
          <div className="hidden lg:block" />
          <button
            id="register-lang-btn"
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A3D91] border border-slate-200 rounded-full px-3 py-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <span className="font-semibold">{i18n.language === 'en' ? 'EN' : 'አማ'}</span>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0A3D91]">Create Account</h1>
              <p className="text-slate-500 text-sm mt-1">Join thousands of volunteers across Ethiopia.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Role selector */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">I am registering as:</p>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      id={`role-${opt.value.toLowerCase()}`}
                      onClick={() => setRole(opt.value)}
                      className={`flex flex-col items-start gap-1 p-3.5 rounded-xl border-2 text-left transition-all ${
                        role === opt.value
                          ? 'border-[#0A3D91] bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className={`text-sm font-bold ${role === opt.value ? 'text-[#0A3D91]' : 'text-slate-700'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-tight">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full name */}
              <div className="relative">
                <label htmlFor="register-name" className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-[#0A3D91]">
                  Full Name *
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-md px-4 py-3 text-sm focus:border-[#0A3D91] focus:outline-none transition-colors"
                  placeholder="Abebe Bikila"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="register-email" className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-[#0A3D91]">
                  Email Address *
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-md px-4 py-3 text-sm focus:border-[#0A3D91] focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="register-password" className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-[#0A3D91]">
                  Password *
                </label>
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-md px-4 py-3 pr-12 text-sm focus:border-[#0A3D91] focus:outline-none transition-colors"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  id="register-toggle-pw"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A3D91] transition-colors"
                >
                  {showPw ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  id="register-terms"
                  type="checkbox"
                  required
                  className="mt-0.5 accent-[#0A3D91] w-4 h-4 shrink-0"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[#0A3D91] font-semibold hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-[#0A3D91] font-semibold hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A3D91] hover:bg-[#082d6b] text-white font-bold py-3.5 rounded-md text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" id="login-link" className="text-[#0A3D91] font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="px-8 pb-6 text-center text-xs text-slate-400">
          © 2026 Volunteer Connect Ethiopia. All rights reserved.
        </div>
      </div>
    </div>
  );
}
