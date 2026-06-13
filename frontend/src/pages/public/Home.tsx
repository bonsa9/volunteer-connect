import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '12,400+', label: 'Volunteers', icon: '🙋' },
  { value: '320+', label: 'Campaigns', icon: '📋' },
  { value: '58', label: 'Organizations', icon: '🏢' },
  { value: '94,000+', label: 'Hours Volunteered', icon: '⏱️' },
];

const features = [
  { icon: '🔍', title: 'Discover Campaigns', desc: 'Browse active volunteer drives near you and across Ethiopia, filtered by cause, date, and location.' },
  { icon: '🏅', title: 'Earn XP & Badges', desc: 'Level up your volunteer profile with XP points, achievement badges, and a growing impact score.' },
  { icon: '🏢', title: 'For Organizations', desc: 'Post campaigns, schedule shifts, track attendance, and generate impact reports — all in one dashboard.' },
  { icon: '🇪🇹', title: 'Made for Ethiopia', desc: 'Built with Amharic language support and Ethiopia-specific workflows, communities, and NGO regulations.' },
];

const howItWorks = [
  { step: '01', title: 'Register an Account', desc: 'Sign up as a volunteer or organization in under 2 minutes. No fees, no barriers.' },
  { step: '02', title: 'Explore Opportunities', desc: 'Browse active campaigns, find shifts that fit your schedule and skills, and sign up in one click.' },
  { step: '03', title: 'Show Up & Make Impact', desc: 'Attend your shift, log your hours, and watch your impact score and XP grow with every contribution.' },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-16">
      {/* ── Hero ── */}
      <section className="text-center pt-12 pb-4 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-br from-blue-100 via-green-50 to-transparent rounded-full blur-3xl opacity-60" />
        </div>

        <span className="inline-block bg-green-50 text-[#078930] border border-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          🇪🇹 Ethiopia's #1 Volunteer Platform
        </span>

        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Empower Communities.<br />
          <span className="text-[#0A3D91]">Volunteer Today.</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of volunteers across Ethiopia in making a real difference. 
          Find campaigns that match your skills, earn XP, and build a legacy of impact.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/campaigns"
            className="bg-[#0A3D91] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-[#082d6b] hover:shadow-blue-300 transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Explore Campaigns
          </Link>
          <Link
            to="/register"
            className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl text-base font-bold hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Join the Network
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-[#0A3D91]">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Everything You Need to Make an Impact</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">From discovering opportunities to tracking your legacy — Volunteer Connect has it all.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-[#0A3D91] transition-all group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#0A3D91] transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 md:p-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 mt-3">Three simple steps to start volunteering.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {howItWorks.map((step, i) => (
            <div key={step.step} className="flex flex-col items-center text-center relative">
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-slate-200" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-[#0A3D91] text-white flex items-center justify-center font-black text-xl mb-5 shadow-md shadow-blue-200 shrink-0">
                {step.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A3D91] to-[#078930] p-10 md:p-16 text-white text-center shadow-xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <h2 className="text-3xl md:text-4xl font-black mb-4 relative">Ready to Make a Difference?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-base relative">
          Join Ethiopia's fastest-growing volunteer network and start changing lives — including your own.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
          <Link to="/register" className="bg-white text-[#0A3D91] px-8 py-4 rounded-2xl font-black text-base hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
            Get Started Free
          </Link>
          <Link to="/campaigns" className="border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/10 transition-all active:scale-95">
            Browse Campaigns
          </Link>
        </div>
      </section>
    </div>
  );
}
