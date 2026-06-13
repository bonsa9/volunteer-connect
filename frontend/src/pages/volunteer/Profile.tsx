import React, { useState, useEffect } from 'react';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

export default function VolunteerProfile() {
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalHours, setTotalHours] = useState(0);
  const [completedShifts, setCompletedShifts] = useState(0);

  const [newSkill, setNewSkill] = useState('');
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
      // Find the volunteer entity by email
      fetchWithAuth(`/api/volunteers?search=${userInfo.email}`)
        .then((data: any) => {
          const v = Array.isArray(data.items) && data.items.length > 0 ? data.items[0] : null;
          if (v) {
            setVolunteerId(v.id);
            setName(v.name || '');
            setEmail(v.email || userInfo.email);
            setPhone(v.phone || '');
            setBio(v.bio || '');
            setSkills(v.skills || []);
            setPoints(v.points || 0);
            setLevel(v.level || 1);
            setTotalHours(v.totalHours || 0);
            
            // Calculate completed shifts if relations exist
            if (v.signups) {
              setCompletedShifts(v.signups.filter((s: any) => s.attended).length);
            }
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
    if (!volunteerId) {
      showToast('No volunteer profile found. Please contact support.', 'error');
      return;
    }
    setSaving(true);
    try {
      await fetchWithAuth(`/api/volunteers/${volunteerId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          bio,
          skills
        })
      });
      setSaving(false); 
      showToast('Profile updated successfully!'); 
    } catch (err: any) {
      setSaving(false);
      showToast(err.message || 'Failed to save profile', 'error');
    }
  };


  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#078930]" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-[#078930] tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Update your personal info, skills, and public profile.</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex items-center gap-6">
        <div className="w-20 h-20 bg-[#078930]/10 text-[#078930] rounded-2xl flex items-center justify-center font-black text-3xl border border-green-100">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-900 text-lg">{name}</div>
          <div className="text-sm text-slate-500">{email}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="bg-green-50 text-[#078930] border border-green-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">⭐ Level {level}</span>
            <span className="bg-blue-50 text-[#0A3D91] border border-blue-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">{points} XP</span>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">{totalHours} Hours / {completedShifts} Shifts Done</span>
          </div>
        </div>
        <button className="text-xs text-[#078930] font-bold hover:underline shrink-0">Change Photo</button>
      </div>

      {/* Edit Form */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-900">Personal Information</h2>
        </div>
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#078930] focus:ring-4 focus:ring-green-50 outline-none transition-all text-slate-800 font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#078930] focus:ring-4 focus:ring-green-50 outline-none transition-all text-slate-800 font-medium text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio / About Me</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#078930] focus:ring-4 focus:ring-green-50 outline-none transition-all text-slate-700 resize-none text-sm leading-relaxed" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skills & Interests</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 bg-green-50 text-[#078930] border border-green-200 px-3 py-1.5 rounded-xl text-sm font-semibold">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-green-400 hover:text-red-500 transition-colors text-base leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g. Teaching)"
                className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-[#078930] focus:ring-4 focus:ring-green-50 outline-none transition-all text-sm"
              />
              <button onClick={addSkill} className="bg-[#078930] hover:bg-[#056623] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="bg-[#078930] hover:bg-[#056623] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</> : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
