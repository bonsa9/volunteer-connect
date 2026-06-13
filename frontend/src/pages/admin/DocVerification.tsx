import React, { useState } from 'react';

export default function DocVerification() {
  const [certNumber, setCertNumber] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Document Verification</h1>
        <p className="text-slate-500 text-sm mt-1">Verify documents using certificate number or QR code</p>
      </div>

      <div className="flex-1 p-8 pt-4 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* Left Pane - Input Form */}
        <div className="border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 border border-blue-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2">Verify Document</h2>
          <p className="text-slate-500 text-sm mb-8">Enter certificate number or scan/upload QR code</p>

          <div className="w-full text-left">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Certificate Number or QR Code
            </label>
            <div className="relative mb-6">
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="Enter certificate number or scan QR code"
                className="w-full border border-slate-300 rounded-lg py-3 pl-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                <button className="hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>
                <button className="hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
              </div>
            </div>

            <button className="w-full bg-[#8fb3fc] hover:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Verify Document
            </button>
          </div>
        </div>

        {/* Right Pane - Results */}
        <div className="border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <p className="text-slate-400 font-medium">
            Verification result will appear here after scanning or entering a certificate number
          </p>
        </div>
      </div>
    </div>
  );
}
