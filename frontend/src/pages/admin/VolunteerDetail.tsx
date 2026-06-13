import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MOCK_DATA: Record<string, any> = {
  '1': {
    name: 'Alemu Bekele', fullName: 'Alemu Bekele Wolde', id: '1',
    gender: 'MALE', dob: '1991-04-12', nationality: 'Ethiopian', phone: '0911-000-101',
    email: 'alemu@example.com', occupation: 'Software Engineer', education: 'Bachelor',
    bloodType: 'O+', nationalId: 'ET-33445566', faydaId: 'FAYDA-0001',
    region: 'Addis Ababa', subcity: 'Bole', wereda: '03',
    xp: 2450, level: 5, shifts: 14, status: 'active',
    campaigns: ['Addis Community Cleanup', 'Medical Supply Drive'],
    badges: ['Community Leader', 'Early Adopter', 'Top Volunteer'],
  },
  '2': {
    name: 'Selam Tadesse', fullName: 'Selam Tadesse Kebede', id: '2',
    gender: 'FEMALE', dob: '1995-08-22', nationality: 'Ethiopian', phone: '0922-300-200',
    email: 'selam@example.com', occupation: 'Teacher', education: 'Master\'s',
    bloodType: 'A+', nationalId: 'ET-77889900', faydaId: 'FAYDA-0043',
    region: 'Addis Ababa', subcity: 'Kirkos', wereda: '08',
    xp: 1100, level: 3, shifts: 7, status: 'active',
    campaigns: ['Rural Clinic Supply Drive'],
    badges: ['Early Adopter'],
  },
};

export default function VolunteerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const vol = MOCK_DATA[id || ''] || MOCK_DATA['1'];

  const tabs = [
    { id: 'Overview', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    { id: 'Address', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { id: 'Campaigns', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { id: 'Badges', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    )},
    { id: 'Documents', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { id: 'History', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/volunteers')}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors bg-white shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A3D91] tracking-tight">Volunteer Detail</h1>
          <p className="text-sm text-slate-500">Volunteer profile and detailed activity records</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-slate-100 bg-slate-50/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0A3D91] text-white border-[#0A3D91] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
              {tab.id}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'Overview' && (
            <div className="space-y-10">
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0A3D91] mb-2">{vol.name}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">VCID: VC-{vol.id.padStart(6, '0')}</span>
                    <span className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider ${vol.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${vol.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                      {vol.status}
                    </span>
                    <span className="bg-blue-50 text-[#0A3D91] px-3 py-1 rounded-lg border border-blue-100 font-bold text-xs uppercase tracking-wider">⭐ Level {vol.level}</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total XP', value: `${vol.xp.toLocaleString()} XP`, color: 'text-[#0A3D91]' },
                  { label: 'Shifts Completed', value: vol.shifts, color: 'text-green-700' },
                  { label: 'Campaigns', value: vol.campaigns.length, color: 'text-amber-700' },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">Basic Information</h3>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'Full Name', value: vol.fullName },
                      { label: 'Gender', value: vol.gender },
                      { label: 'Date of Birth', value: vol.dob },
                      { label: 'Nationality', value: vol.nationality },
                      { label: 'Phone', value: vol.phone },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Verification Data */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">Legal / Verification</h3>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'National ID', value: vol.nationalId },
                      { label: 'Fayda ID', value: vol.faydaId },
                      { label: 'Region', value: vol.region },
                      { label: 'Sub City', value: vol.subcity },
                      { label: 'Wereda', value: vol.wereda },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Work & Education */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">Work & Education</h3>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'Occupation', value: vol.occupation },
                      { label: 'Education', value: vol.education },
                      { label: 'Blood Type', value: vol.bloodType },
                      { label: 'Phone', value: vol.phone },
                      { label: 'Email', value: vol.email },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold break-all">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Address' && (
            <div>
              <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-6">Address Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-sm max-w-2xl">
                {[
                  { label: 'Region', value: vol.region },
                  { label: 'Sub City', value: vol.subcity },
                  { label: 'Wereda', value: vol.wereda },
                  { label: 'Zone', value: 'Addis Ababa Zone' },
                  { label: 'House No.', value: 'HN-2021' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-2">
                    <dt className="text-slate-400 font-medium min-w-[110px] shrink-0">{row.label} —</dt>
                    <dd className="text-slate-800 font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activeTab === 'Campaigns' && (
            <div>
              <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-6">Campaigns Participated In</h3>
              <div className="space-y-3">
                {vol.campaigns.map((c: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0A3D91] flex items-center justify-center font-bold text-sm border border-blue-100">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{c}</span>
                    <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Badges' && (
            <div>
              <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-6">Earned Badges</h3>
              <div className="flex flex-wrap gap-4">
                {vol.badges.map((b: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
                    <span className="text-2xl">🏅</span>
                    <span className="font-bold text-amber-800 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'Documents' || activeTab === 'History') && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 border-2 border-dashed border-slate-200 rounded-2xl">
              <span className="text-4xl">{activeTab === 'Documents' ? '📄' : '📜'}</span>
              <p className="font-medium">{activeTab} data will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
