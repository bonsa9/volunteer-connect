import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

export default function CreateCampaign() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orgId, setOrgId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  React.useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.email) {
      fetchWithAuth(`/api/organizations?search=${userInfo.email}`)
        .then((res: any) => {
          if (Array.isArray(res.items) && res.items.length > 0) {
            setOrgId(res.items[0].id);
          }
        })
        .catch(err => console.error('Failed to load org profile', err));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userInfo = getUserInfo();
    if (!orgId) {
      setError('Could not find your organization profile. Please update your profile first.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        startDate,
        endDate,
        location: {
          latitude: 9.03, // Default to Addis Ababa roughly
          longitude: 38.74,
          placeName
        },
        organizationId: orgId
      };

      const res = await fetchWithAuth('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Redirect to campaign details or opportunities creation
      navigate(`/org/campaigns/${res.id || 1}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/org/campaigns')} 
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors shadow-sm bg-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#DA121A] tracking-tight">Create a Campaign</h1>
          <p className="text-sm text-slate-500 mt-1">Launch a new volunteer drive and start recruiting.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 space-y-6 flex-1">
          {/* Campaign Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Title <span className="text-[#DA121A]">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 transition-all outline-none text-slate-800 font-medium" 
              placeholder="e.g. Addis River Cleanup" 
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description <span className="text-[#DA121A]">*</span></label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 transition-all outline-none h-32 resize-none text-slate-800" 
              placeholder="What is this campaign about? What will volunteers be doing?" 
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location Name <span className="text-[#DA121A]">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
              <input 
                type="text" 
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 transition-all outline-none text-slate-800" 
                placeholder="e.g. Piazza, Addis Ababa" 
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date <span className="text-[#DA121A]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 transition-all outline-none text-slate-800" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date <span className="text-[#DA121A]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:border-[#DA121A] focus:ring-4 focus:ring-red-50 transition-all outline-none text-slate-800" 
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">You can add specific volunteer shifts (opportunities) after creating the campaign.</p>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#DA121A] hover:bg-[#b00e15] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
