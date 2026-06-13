import React, { useState } from 'react';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast('Notification broadcast queued successfully.', 'success');
      setTitle('');
      setMessage('');
      setTarget('all');
      setSending(false);
    }, 800);
  };

  return (
    <div className="space-y-6 relative pb-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce ${
          toast.type === 'success' 
            ? 'bg-blue-50 text-[#0A3D91] border-blue-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <span>{toast.type === 'success' ? '🚀' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A3D91] tracking-tight">Targeted Broadcasts</h1>
          <p className="text-sm text-slate-500 mt-1">Send push notifications and alerts to specific user segments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Compose Form */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-[#0A3D91] rounded-xl flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Compose Message</h2>
              <p className="text-xs text-slate-500">Draft a new system notification.</p>
            </div>
          </div>
          
          <form onSubmit={handleSend} className="p-6 md:p-8 space-y-6 flex-1">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 appearance-none focus:border-[#0A3D91] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-800 font-medium"
                >
                  <option value="all">🌍 All Users (Volunteers & Organizations)</option>
                  <option value="volunteers">🙋 All Volunteers</option>
                  <option value="organizations">🏢 All Organizations</option>
                  <option value="level_5_plus">⭐ Level 5+ Volunteers (XP)</option>
                  <option value="addis_ababa">📍 Location: Addis Ababa</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notification Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#0A3D91] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-800 font-bold" 
                placeholder="E.g., Urgent: Volunteers Needed in Bole" 
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message Body <span className="text-red-500">*</span></label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#0A3D91] focus:ring-4 focus:ring-blue-50 transition-all outline-none h-40 resize-none text-slate-800 leading-relaxed" 
                placeholder="Type your message here. Markdown is supported." 
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Limit: 500 characters
                </span>
                <span className={`text-[11px] font-bold ${message.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                  {message.length} / 500
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={sending}
              className="w-full bg-[#0A3D91] hover:bg-[#082d6b] text-white font-bold py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-60 flex justify-center items-center gap-2 active:scale-[0.99]"
            >
              {sending ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Sending Broadcast...</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Recent Broadcasts</h2>
            </div>
            
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl group hover:border-[#0A3D91] hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold bg-blue-100 text-[#0A3D91] px-2.5 py-1 rounded-md uppercase tracking-wider">🌍 All Users</span>
                  <span className="text-[11px] text-slate-400 font-semibold">2 days ago</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5 group-hover:text-[#0A3D91] transition-colors">Welcome to the new portal!</h4>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">We have completely revamped the Volunteer Connect experience. Please update your profiles with your latest skills.</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  <span>Sent by: Admin</span>
                  <span>14.2k Recipients</span>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl group hover:border-green-600 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-md uppercase tracking-wider">⭐ Level 5+ Volunteers</span>
                  <span className="text-[11px] text-slate-400 font-semibold">1 week ago</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5 group-hover:text-green-700 transition-colors">Exclusive Leadership Opportunity</h4>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">As our most experienced volunteers, we are inviting you to lead upcoming cleanup drives in Addis Ababa. Click here to sign up.</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  <span>Sent by: Admin</span>
                  <span>450 Recipients</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-xs font-bold text-[#0A3D91] hover:underline">View All History →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
