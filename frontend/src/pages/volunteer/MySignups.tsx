import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  campaign?: {
    title: string;
  };
}

interface Signup {
  id: string;
  createdAt: string;
  confirmed: boolean;
  attended?: boolean;
  opportunity: Opportunity;
}

export default function MySignups() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Cancellation Modal State
  const [cancelTarget, setCancelTarget] = useState<Signup | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadSignups = () => {
    if (!userInfo) {
      // For visual testing when not logged in, mock some data
      setTimeout(() => {
        setSignups([
          {
            id: 'signup1',
            createdAt: '2026-06-12T10:00:00Z',
            confirmed: true,
            opportunity: {
              id: 'opp1',
              title: 'Riverbank Cleanup Team',
              description: 'Collect litter and sort recyclables along the river.',
              startsAt: '2026-06-22T09:00:00Z',
              endsAt: '2026-06-22T15:00:00Z',
              campaign: { title: 'Addis Community Cleanup' }
            }
          },
          {
            id: 'signup2',
            createdAt: '2026-06-10T10:00:00Z',
            confirmed: true,
            attended: true,
            opportunity: {
              id: 'opp2',
              title: 'Logistics Coordinator',
              description: 'Distribute supplies to cleanup teams.',
              startsAt: '2026-06-23T10:00:00Z',
              endsAt: '2026-06-23T17:00:00Z',
              campaign: { title: 'Addis Community Cleanup' }
            }
          }
        ]);
        setLoading(false);
      }, 500);
      return;
    }
    
    fetchWithAuth(`/api/signups?volunteerId=${userInfo.userId}`)
      .then((data: any) => {
        setSignups(data.items || data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load signups:', err);
        showToast('Failed to retrieve your schedule.', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSignups();
  }, []);

  const handleCancelClick = (signup: Signup) => {
    setCancelTarget(signup);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);

    try {
      if (userInfo) {
        await fetchWithAuth(`/api/signups/${cancelTarget.id}`, { method: 'DELETE' });
      }
      showToast('Successfully cancelled your signup.', 'success');
      setSignups(signups.filter(s => s.id !== cancelTarget.id));
      setCancelTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel shift registration.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Filter signups
  const now = new Date();
  const upcomingSignups = signups.filter(s => new Date(s.opportunity.endsAt) >= now);
  const completedSignups = signups.filter(s => new Date(s.opportunity.endsAt) < now);
  
  const displayedSignups = activeTab === 'upcoming' ? upcomingSignups : completedSignups;

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce ${
          toast.type === 'success' 
            ? 'bg-green-50 text-[#078930] border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Shift?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to cancel your shift for <strong className="text-slate-800">{cancelTarget.opportunity.title}</strong>? 
              This will notify the campaign coordinators.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                No, Keep it
              </button>
              <button 
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {cancelling ? (
                  <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> Cancelling...</>
                ) : 'Yes, Cancel Shift'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#078930] tracking-tight">My Signups</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming and past community volunteer shifts.</p>
        </div>
        <Link 
          to="/campaigns" 
          className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm"
        >
          Browse Campaigns
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {/* Tabs navigation */}
        <div className="border-b border-slate-100 flex p-3 bg-slate-50/80 gap-2">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-white shadow-sm border border-slate-200 text-[#078930]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
            }`}
          >
            <span>Upcoming</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'upcoming' ? 'bg-green-50 text-[#078930]' : 'bg-slate-200 text-slate-600'}`}>
              {upcomingSignups.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-white shadow-sm border border-slate-200 text-slate-800'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
            }`}
          >
            <span>Completed</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'completed' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'}`}>
              {completedSignups.length}
            </span>
          </button>
        </div>
        
        {/* Signups List */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium">Loading your schedule...</p>
            </div>
          ) : displayedSignups.length === 0 ? (
            <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                {activeTab === 'upcoming' ? '📅' : '🏅'}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming shifts' : 'No completed shifts'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                {activeTab === 'upcoming' 
                  ? "You haven't registered for any upcoming opportunities. Browse active campaigns to find a shift!" 
                  : "You don't have any completed shifts recorded yet. Complete a scheduled shift to see it here!"}
              </p>
              {activeTab === 'upcoming' && (
                <Link to="/campaigns" className="bg-[#078930] hover:bg-[#056623] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm">
                  Find Opportunities
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayedSignups.map((signup) => (
                <div key={signup.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#078930] transition-colors truncate">
                        {signup.opportunity.title}
                      </h3>
                      {signup.confirmed ? (
                        <span className="bg-green-50 text-[#078930] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#078930]" /> Confirmed
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                        </span>
                      )}
                    </div>
                    
                    {signup.opportunity.campaign && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-3">
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-300">
                          Campaign
                        </span>
                        <span className="truncate">{signup.opportunity.campaign.title}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mb-4 line-clamp-2">
                      {signup.opportunity.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-medium bg-white border border-slate-200 w-fit px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="flex items-center gap-1">
                        <span className="text-[#078930]">📅</span> 
                        {new Date(signup.opportunity.startsAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1">
                        <span className="text-[#078930]">⏰</span> 
                        {new Date(signup.opportunity.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(signup.opportunity.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && (
                    <button 
                      onClick={() => handleCancelClick(signup)}
                      className="w-full md:w-auto px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl text-xs transition-colors shadow-sm shrink-0"
                    >
                      Cancel Shift
                    </button>
                  )}

                  {activeTab === 'completed' && signup.attended && (
                    <Link 
                      to={`/dashboard/certificate/${signup.id}`}
                      className="w-full md:w-auto px-5 py-2.5 bg-[#078930] hover:bg-[#056623] text-white font-bold rounded-xl text-xs transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      View Certificate
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
