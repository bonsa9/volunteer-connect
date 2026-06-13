import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MOCK_ORGS: Record<string, any> = {
  '1': {
    id: '1', name: 'Ethiopia Care Network', email: 'contact@ethiopiacare.org',
    phone: '0911-200-300', website: 'www.ethiopiacare.org', type: 'Non-Profit NGO',
    founded: '2015-03-10', region: 'Addis Ababa', subcity: 'Bole', wereda: '05',
    tin: 'TIN-78901234', registration: 'REG-2015-ET-0012',
    campaigns: ['Addis Community Cleanup', 'Medical Supply Drive', 'School Renovation Project'],
    volunteers: 42, status: 'verified', docs: 3,
    description: 'Ethiopia Care Network is a registered NGO dedicated to community welfare, healthcare access, and education equity across Ethiopia.',
    contactPerson: 'Beza Haile',
    contactRole: 'Executive Director',
  },
  '2': {
    id: '2', name: 'Green Addis Initiative', email: 'info@greenaddis.org',
    phone: '0922-400-500', website: 'www.greenaddis.org', type: 'Environmental NGO',
    founded: '2018-07-22', region: 'Addis Ababa', subcity: 'Kirkos', wereda: '02',
    tin: 'TIN-12345678', registration: 'REG-2018-ET-0088',
    campaigns: ['Tree Planting Drive', 'River Clean-up'],
    volunteers: 28, status: 'verified', docs: 2,
    description: 'Green Addis Initiative focuses on environmental conservation, urban greening, and waste reduction programs across Addis Ababa.',
    contactPerson: 'Yonas Tesfaye',
    contactRole: 'Program Director',
  },
  '3': {
    id: '3', name: 'Tech for Good ET', email: 'hello@techforgood.et',
    phone: '0933-600-700', website: 'www.techforgood.et', type: 'Technology NGO',
    founded: '2021-01-15', region: 'Addis Ababa', subcity: 'Gullele', wereda: '07',
    tin: 'TIN-55667788', registration: 'REG-2021-ET-0234',
    campaigns: ['Digital Literacy for Youth'],
    volunteers: 15, status: 'pending', docs: 1,
    description: 'Tech for Good ET bridges the digital divide by providing free coding training and digital skills to underserved youth.',
    contactPerson: 'Liya Solomon',
    contactRole: 'Founder & CEO',
  },
};

export default function OrgDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const org = MOCK_ORGS[id || ''] || MOCK_ORGS['1'];

  const tabs = [
    {
      id: 'Overview', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    {
      id: 'Address', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )
    },
    {
      id: 'Campaigns', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      )
    },
    {
      id: 'Documents', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      )
    },
    {
      id: 'History', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/verifications/orgs')}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors bg-white shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A3D91] tracking-tight">Organization Detail</h1>
          <p className="text-sm text-slate-500">Full profile, legal information, and campaign history</p>
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
              {/* Org Header Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3D91] shrink-0 font-black text-3xl">
                  {org.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#0A3D91] mb-2">{org.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-3">{org.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold">
                      ORG-{org.id.padStart(6, '0')}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${
                      org.status === 'verified'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : org.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        org.status === 'verified' ? 'bg-green-500' :
                        org.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                      }`} />
                      {org.status}
                    </span>
                    <span className="bg-blue-50 text-[#0A3D91] px-3 py-1 rounded-lg border border-blue-100 text-xs font-bold">
                      {org.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Campaigns Run', value: org.campaigns.length, color: 'text-[#0A3D91]', icon: '📋' },
                  { label: 'Volunteers Recruited', value: org.volunteers, color: 'text-green-700', icon: '🙋' },
                  { label: 'Documents Submitted', value: org.docs, color: 'text-amber-700', icon: '📄' },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">
                    Organization Information
                  </h3>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'Full Name', value: org.name },
                      { label: 'Org Type', value: org.type },
                      { label: 'Founded', value: org.founded },
                      { label: 'Website', value: org.website },
                      { label: 'Phone', value: org.phone },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold break-all">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Legal Data */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">
                    Legal Information
                  </h3>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'TIN Number', value: org.tin },
                      { label: 'Registration', value: org.registration },
                      { label: 'Email', value: org.email },
                      { label: 'Region', value: org.region },
                      { label: 'Sub City', value: org.subcity },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold break-all">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Contact Person */}
                <div>
                  <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-5 pb-2 border-b border-blue-100">
                    Contact Person
                  </h3>
                  <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
                    <div className="w-12 h-12 bg-[#0A3D91] text-white rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                      {org.contactPerson.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{org.contactPerson}</div>
                      <div className="text-xs text-[#0A3D91] font-semibold">{org.contactRole}</div>
                    </div>
                  </div>
                  <dl className="space-y-3.5 text-sm">
                    {[
                      { label: 'Email', value: org.email },
                      { label: 'Phone', value: org.phone },
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-2">
                        <dt className="text-slate-400 font-medium min-w-[100px] shrink-0">{row.label} —</dt>
                        <dd className="text-slate-800 font-semibold">{row.value}</dd>
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
                  { label: 'Region', value: org.region },
                  { label: 'Sub City', value: org.subcity },
                  { label: 'Wereda', value: org.wereda },
                  { label: 'Zone', value: 'Addis Ababa Zone' },
                  { label: 'P.O. Box', value: 'PO-12034' },
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
              <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-6">Campaigns Organized</h3>
              <div className="space-y-3">
                {org.campaigns.map((c: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0A3D91] flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm flex-1">{c}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div>
              <h3 className="text-xs font-bold text-[#0A3D91] uppercase tracking-widest mb-6">Submitted Documents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Registration Certificate', date: '2026-06-10', status: 'verified' },
                  { name: 'TIN Document', date: '2026-06-10', status: 'verified' },
                  { name: 'Board Resolution Letter', date: '2026-06-11', status: 'pending' },
                ].slice(0, org.docs).map((doc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 group hover:border-[#0A3D91] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-sm group-hover:text-[#0A3D91] transition-colors">{doc.name}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">Submitted: {doc.date}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                      doc.status === 'verified'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {doc.status}
                    </span>
                    <button className="text-[#0A3D91] hover:underline text-xs font-bold">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 border-2 border-dashed border-slate-200 rounded-2xl">
              <span className="text-4xl">📜</span>
              <p className="font-medium">Activity history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
