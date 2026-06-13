import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

const MOCK_CAMPAIGN = {
  id: '1', title: 'Addis Community Cleanup', description: 'Join neighborhood teams to remove waste and restore public spaces across Addis Ababa.',
  location: { placeName: 'Addis Ababa' }, startDate: '2026-06-22', endDate: '2026-06-28',
  opportunities: [
    { id: 'o1', title: 'Riverbank Cleanup Team', date: '2026-06-22', startTime: '09:00', endTime: '15:00', capacity: 15, signups: 8 },
    { id: 'o2', title: 'Logistics Coordinator', date: '2026-06-23', startTime: '10:00', endTime: '17:00', capacity: 5, signups: 3 },
  ]
};

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppDate, setOppDate] = useState('');
  const [oppStartTime, setOppStartTime] = useState('');
  const [oppEndTime, setOppEndTime] = useState('');
  const [oppCapacity, setOppCapacity] = useState(10);
  const [oppAdding, setOppAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetchWithAuth(`/api/campaigns/${id}`)
      .then(data => { setCampaign(data); setLoading(false); })
      .catch(() => { setCampaign(MOCK_CAMPAIGN); setLoading(false); });
  }, [id]);

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setOppAdding(true);
    try {
      const payload = { title: oppTitle, date: oppDate, startTime: oppStartTime, endTime: oppEndTime, capacity: Number(oppCapacity), campaignId: id };
      await fetchWithAuth('/api/opportunities', { method: 'POST', body: JSON.stringify(payload) });
      setOppTitle(''); setOppDate(''); setOppStartTime(''); setOppEndTime(''); setOppCapacity(10);
      setShowOpportunityForm(false);
      showToast('✅ Shift added successfully!');
      // refresh
      fetchWithAuth(`/api/campaigns/${id}`).then(d => setCampaign(d)).catch(() => {});
    } catch {
      showToast('❌ Failed to add shift — please try again.');
    } finally { setOppAdding(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
      <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm font-medium">Loading campaign details...</p>
    </div>
  );

  if (!campaign) return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-red-500 font-semibold shadow-sm">
      Campaign not found.
    </div>
  );

  return (
    <div className="space-y-6 pb-12 relative">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-bounce ${
          toast.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>{toast}</div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/org/campaigns')} className="p-2 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#DA121A] tracking-tight">{campaign.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            <span>📍 {campaign.location?.placeName}</span>
            <span className="text-slate-300">•</span>
            <span>📅 {campaign.startDate} to {campaign.endDate}</span>
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Campaign Description</h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
      </div>

      {/* Shifts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Shifts & Opportunities</h2>
          {!showOpportunityForm && (
            <button
              onClick={() => setShowOpportunityForm(true)}
              className="inline-flex items-center gap-2 bg-[#DA121A] hover:bg-[#b00e15] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Shift
            </button>
          )}
        </div>

        {/* Add Shift Form */}
        {showOpportunityForm && (
          <form onSubmit={handleAddOpportunity} className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-red-900 text-sm uppercase tracking-wider">New Shift Details</h3>
              <button type="button" onClick={() => setShowOpportunityForm(false)} className="text-red-400 hover:text-red-700 font-black text-lg leading-none">×</button>
            </div>
            <div>
              <label className="block text-xs font-bold text-red-900 uppercase tracking-wider mb-1.5">Shift Title / Role</label>
              <input type="text" value={oppTitle} onChange={(e) => setOppTitle(e.target.value)} required className="w-full border-2 border-red-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#DA121A] transition-all text-sm font-medium" placeholder="e.g. Tree Planter, Medical Volunteer" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Date', type: 'date', val: oppDate, set: setOppDate },
                { label: 'Start Time', type: 'time', val: oppStartTime, set: setOppStartTime },
                { label: 'End Time', type: 'time', val: oppEndTime, set: setOppEndTime },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-red-900 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required className="w-full border-2 border-red-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#DA121A] transition-all text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-red-900 uppercase tracking-wider mb-1.5">Capacity</label>
                <input type="number" min="1" value={oppCapacity} onChange={e => setOppCapacity(Number(e.target.value))} required className="w-full border-2 border-red-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#DA121A] transition-all text-sm" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button disabled={oppAdding} className="bg-[#DA121A] hover:bg-[#b00e15] text-white font-bold py-2.5 px-6 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors">
                {oppAdding ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</> : 'Save Shift'}
              </button>
            </div>
          </form>
        )}

        {/* Shift Cards */}
        {!campaign.opportunities || campaign.opportunities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">⏱️</div>
            <p className="font-semibold">No shifts created yet.</p>
            <p className="text-sm text-slate-400 mt-1">Add a shift so volunteers can sign up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.opportunities.map((opp: any) => {
              const fillPercent = opp.capacity ? Math.min(100, Math.round(((opp.signups || 0) / opp.capacity) * 100)) : 0;
              return (
                <div key={opp.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-3">{opp.title}</h4>
                    <div className="flex flex-col gap-2 text-sm text-slate-500">
                      <span className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg w-fit">
                        📅 {opp.date}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg w-fit">
                        ⏰ {opp.startTime} — {opp.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                      <span>{opp.signups || 0} / {opp.capacity} Signed Up</span>
                      <span className={`font-bold ${fillPercent >= 90 ? 'text-red-600' : fillPercent >= 50 ? 'text-amber-600' : 'text-green-700'}`}>{fillPercent}% Full</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 50 ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${fillPercent}%` }} />
                    </div>
                    <div className="flex justify-end">
                      <button className="text-xs font-bold text-[#DA121A] hover:underline">Edit Shift →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
