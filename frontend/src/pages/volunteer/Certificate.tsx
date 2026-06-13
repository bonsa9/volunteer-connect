import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

type CertificateData = {
  volunteerName: string;
  opportunityTitle: string;
  campaignTitle: string;
  organizationName: string;
  hoursLogged: number;
  date: string;
  certificateId: string;
  issuedAt: string;
};

export default function Certificate() {
  const { signupId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (signupId) {
      fetchWithAuth(`/api/signups/${signupId}/certificate`)
        .then((res: any) => {
          setData({
            volunteerName: res.volunteerName || 'Volunteer',
            opportunityTitle: res.opportunityTitle || 'Opportunity',
            campaignTitle: res.campaignTitle || 'Campaign',
            organizationName: res.organizationName || 'Organization',
            hoursLogged: res.hoursLogged || 0,
            date: res.date || new Date().toISOString(),
            certificateId: `VC-CERT-${(signupId || '1A2B3C4D').substring(0, 8).toUpperCase()}`,
            issuedAt: new Date().toISOString(),
          });
        })
        .catch((err) => {
          console.error(err);
          // Fallback if not found
          setData({
            volunteerName: 'Unknown',
            opportunityTitle: 'Unknown',
            campaignTitle: 'Unknown',
            organizationName: 'Unknown',
            hoursLogged: 0,
            date: new Date().toISOString(),
            certificateId: `VC-CERT-${(signupId || '1A2B3C4D').substring(0, 8).toUpperCase()}`,
            issuedAt: new Date().toISOString(),
          });
        });
    }
  }, [signupId]);

  if (!data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#078930]" />
        <div className="font-bold text-slate-500">Loading Certificate...</div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 font-sans">
      
      {/* Action Bar (Hidden when printing) */}
      <div className="flex gap-4 mb-8 print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          &larr; Back
        </button>
        <button 
          onClick={handlePrint}
          className="px-6 py-2 bg-[#DA121A] text-white font-bold rounded-xl shadow-sm hover:bg-[#b00e15] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* The Certificate (A4 Landscape aspect ratio roughly) */}
      <div className="bg-white w-[1056px] h-[816px] shadow-2xl relative overflow-hidden print:shadow-none print:m-0 print:w-full print:h-screen">
        
        {/* Background Patterns & Borders */}
        <div className="absolute inset-4 border-[12px] border-[#DA121A] rounded-sm z-10 pointer-events-none opacity-90" />
        <div className="absolute inset-8 border-[2px] border-slate-300 rounded-sm z-10 pointer-events-none" />
        
        {/* Ethiopian Flag Accents */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#078930] -translate-x-24 -translate-y-24 rotate-45 z-0" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FCDD09] translate-x-24 -translate-y-24 rotate-45 z-0" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#DA121A] translate-x-24 translate-y-24 rotate-45 z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#078930] -translate-x-24 translate-y-24 rotate-45 z-0" />

        {/* Content Container */}
        <div className="absolute inset-12 z-20 flex flex-col items-center text-center px-16 py-12">
          
          <div className="text-[#0A3D91] font-black text-2xl tracking-[0.3em] uppercase mb-10">
            Volunteer Connect
          </div>

          <h1 className="text-6xl font-black text-slate-800 tracking-tight mb-4 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Certificate of Participation
          </h1>
          
          <p className="text-xl text-slate-500 font-medium tracking-widest uppercase mb-12">
            This certificate is proudly presented to
          </p>

          <h2 className="text-5xl font-bold text-[#DA121A] border-b-2 border-slate-200 pb-2 mb-10 w-[80%] inline-block" style={{ fontFamily: 'Georgia, serif' }}>
            {data.volunteerName}
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-16">
            In recognition of their outstanding dedication and service. They have successfully completed <strong className="text-slate-800">{data.hoursLogged} hours</strong> of volunteer work as a <strong className="text-slate-800">{data.opportunityTitle}</strong> during the <strong className="text-slate-800">{data.campaignTitle}</strong> campaign. Their commitment to community development makes a lasting impact.
          </p>

          <div className="w-full flex justify-between items-end mt-auto px-12">
            {/* Left Signature */}
            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-slate-800 mb-2 relative">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-medium text-slate-800 text-2xl" style={{ fontFamily: "'Brush Script MT', cursive" }}>{new Date(data.date).toLocaleDateString()}</span>
              </div>
              <span className="uppercase text-xs font-bold tracking-widest text-slate-500">Date of Service</span>
            </div>

            {/* Seal Placeholder */}
            <div className="w-32 h-32 rounded-full border-4 border-[#FCDD09] bg-white flex items-center justify-center shadow-inner relative z-30">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#DA121A] flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="font-black text-[#078930] text-sm tracking-widest uppercase">Official</div>
                  <div className="font-bold text-slate-400 text-[10px] mt-1 tracking-widest">Seal</div>
                </div>
              </div>
            </div>

            {/* Right Signature */}
            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-slate-800 mb-2 relative">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-medium text-slate-800 text-2xl" style={{ fontFamily: "'Brush Script MT', cursive" }}>Official</span>
              </div>
              <span className="uppercase text-xs font-bold tracking-widest text-slate-500">{data.organizationName}</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono">
            ID: {data.certificateId} • Issued: {new Date(data.issuedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

    </div>
  );
}
