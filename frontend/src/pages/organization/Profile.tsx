import React, { useState, useEffect } from 'react';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

export default function OrgProfile() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => { 
    setToast({ message, type }); 
    setTimeout(() => setToast(null), 3000); 
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.email) {
      fetchWithAuth(`/api/organizations?search=${userInfo.email}`)
        .then((data: any) => {
          const org = Array.isArray(data.items) && data.items.length > 0 ? data.items[0] : null;
          if (org) {
            setOrgId(org.id);
            setName(org.name || '');
            setPhone(org.phone || '');
            setWebsite(org.website || '');
            setEmail(org.email || userInfo.email);
            setDescription(org.description || '');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const save = async () => {
    if (!orgId) {
      showToast('No organization profile found. Please contact support.', 'error');
      return;
    }
    setSaving(true);
    try {
      await fetchWithAuth(`/api/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          website,
          description
        })
      });
      setSaving(false); 
      showToast('Organization profile updated!'); 
    } catch (err: any) {
      setSaving(false);
      showToast(err.message || 'Failed to save profile', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12 relative max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-bounce ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DA121A]" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-[#DA121A] tracking-tight">Organization Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Update your organization's public info and contact details.</p>
      </div>

      {/* Org Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex items-center gap-6">
        <div className="w-20 h-20 bg-red-50 text-[#DA121A] rounded-2xl flex items-center justify-center font-black text-3xl border border-red-100">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-900 text-lg">{name}</div>
          <div className="text-sm text-slate-500">{email}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Verified
            </span>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Non-Profit NGO</span>
            <span className="bg-blue-50 text-[#0A3D91] border border-blue-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">3 Campaigns</span>
          </div>
        </div>
        <button className="text-xs text-[#DA121A] font-bold hover:underline shrink-0">Change Logo</button>
      </div>

      {/* Edit Form */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-900">Organization Information</h2>
        </div>
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 outline-none transition-all text-slate-800 font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 outline-none transition-all text-slate-800 font-medium text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Website</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🌐</span>
              <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 outline-none transition-all text-slate-800 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About the Organization</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 outline-none transition-all text-slate-700 resize-none text-sm leading-relaxed" />
          </div>

          {/* Read-only verification data */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Legal Information (Read-only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                { label: 'TIN Number', value: 'TIN-78901234' },
                { label: 'Registration No.', value: 'REG-2015-ET-0012' },
                { label: 'Region', value: 'Addis Ababa' },
                { label: 'Sub City', value: 'Bole' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium min-w-[120px]">{f.label} —</span>
                  <span className="text-slate-700 font-semibold">{f.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">To update legal data, contact the platform admin.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="bg-[#DA121A] hover:bg-[#b00e15] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</> : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
