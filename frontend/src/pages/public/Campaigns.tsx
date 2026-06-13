import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  skills?: string[] | string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: {
    placeName: string;
    latitude?: number;
    longitude?: number;
  };
  organization?: {
    name: string;
  };
  opportunities?: Opportunity[];
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [mySignupOpportunityIds, setMySignupOpportunityIds] = useState<Set<string>>(new Set());
  const [signingUpId, setSigningUpId] = useState<string | null>(null);
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Health', 'Education', 'Environment', 'Food Security', 'Disaster Relief'];
  
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  useEffect(() => {
    // Fetch active campaigns
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || data || [];
        // If empty, mock it so it looks good during UI development
        if (items.length === 0) {
          setCampaigns([
            { 
              id: '1', title: 'Addis Community Cleanup', description: 'Join neighborhood teams to remove waste and restore public spaces.', startDate: '2026-06-22', endDate: '2026-06-28', location: { placeName: 'Addis Ababa' }, organization: { name: 'Ethiopia Care Network' },
              opportunities: [
                { id: '1a', title: 'Riverbank Cleanup Team', description: 'Collect litter and sort recyclables along the river.', skills: ['Cleanup', 'Teamwork'], startsAt: '2026-06-22T09:00:00Z', endsAt: '2026-06-22T15:00:00Z', isActive: true },
                { id: '1b', title: 'Logistics Coordinator', description: 'Distribute supplies to cleanup teams.', skills: ['Organization'], startsAt: '2026-06-23T10:00:00Z', endsAt: '2026-06-23T17:00:00Z', isActive: true }
              ]
            },
            { 
              id: '2', title: 'Rural Clinic Supply Drive', description: 'Sort and package donated medical supplies for rural clinics.', startDate: '2026-07-01', endDate: '2026-07-05', location: { placeName: 'Hawassa' }, organization: { name: 'HealthFirst Ethiopia' },
              opportunities: [
                { id: '2a', title: 'Supply Sorter', description: 'Sort and categorize medical supplies.', skills: ['Attention to Detail'], startsAt: '2026-07-01T08:00:00Z', endsAt: '2026-07-01T12:00:00Z', isActive: true }
              ]
            }
          ]);
        } else {
          setCampaigns(items);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load campaigns:', err);
        setLoading(false);
      });

    // Fetch user's volunteer profile to get volunteerId and registered signups
    if (userInfo && userInfo.role === 'volunteer' && userInfo.email) {
      fetchWithAuth(`/api/volunteers?search=${userInfo.email}`)
        .then((data: any) => {
          const items = data.items || [];
          if (items.length > 0) {
            const vId = items[0].id;
            setVolunteerId(vId);
            
            // Now fetch their signups
            return fetchWithAuth(`/api/signups?volunteerId=${vId}`);
          }
          return null;
        })
        .then((data: any) => {
          if (data) {
            const registeredIds = new Set<string>();
            const items = data.items || [];
            items.forEach((item: any) => {
              if (item.opportunity && item.opportunity.id) {
                registeredIds.add(item.opportunity.id);
              }
            });
            setMySignupOpportunityIds(registeredIds);
          }
        })
        .catch((err) => {
          console.error('Failed to load volunteer data:', err);
        });
    }
  }, []);

  const handleSignUp = async (opportunityId: string) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (userInfo.role !== 'volunteer') {
      alert('Only volunteers can sign up for opportunities.');
      return;
    }

    if (!volunteerId) {
      alert('Could not identify your volunteer profile. Please update your profile first.');
      return;
    }

    setSigningUpId(opportunityId);

    try {
      await fetchWithAuth('/api/signups', {
        method: 'POST',
        body: JSON.stringify({
          volunteerId: volunteerId,
          opportunityId: opportunityId,
        }),
      });

      const updated = new Set(mySignupOpportunityIds);
      updated.add(opportunityId);
      setMySignupOpportunityIds(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setSigningUpId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-[#078930] tracking-tight">Explore Campaigns</h1>
          <p className="text-slate-500 mt-2">Join neighborhood campaigns to restore and enrich communities across Ethiopia. Find a cause you care about and start volunteering.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#078930]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            List
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-[#078930]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="flex overflow-x-auto pb-2 w-full hide-scrollbar gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-[#078930] text-white border border-[#078930]' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium">Loading campaigns...</p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative h-[500px]">
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <span className="text-4xl">🗺️</span>
              <p className="mt-2 font-medium">Map view placeholder</p>
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200">
            <h4 className="font-bold text-[#078930] mb-1">Active Regions</h4>
            <p className="text-sm text-slate-600">📍 {campaigns.length} campaigns currently active</p>
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 shadow-sm max-w-lg mx-auto">
          No active campaigns at the moment. Please check back later!
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-100">
                    {campaign.organization?.name || 'Local Organizer'}
                  </span>
                  {campaign.location?.placeName && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                      <span className="text-[10px]">📍</span> {campaign.location.placeName}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{campaign.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{campaign.description}</p>
                
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#078930]">⏱️</span> Available Shifts
                  </h4>
                  
                  {!campaign.opportunities || campaign.opportunities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No specific shifts scheduled yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {campaign.opportunities.map((opportunity) => {
                        const isRegistered = mySignupOpportunityIds.has(opportunity.id);
                        const isSigningUp = signingUpId === opportunity.id;
                        
                        let skillsArray: string[] = [];
                        if (Array.isArray(opportunity.skills)) {
                          skillsArray = opportunity.skills;
                        } else if (typeof opportunity.skills === 'string') {
                          try { skillsArray = JSON.parse(opportunity.skills); } 
                          catch (e) { skillsArray = opportunity.skills.split(',').map(s => s.trim()); }
                        }

                        return (
                          <div key={opportunity.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-[#078930] transition-colors group">
                            <div className="flex-1">
                              <h5 className="font-bold text-slate-800 text-sm group-hover:text-[#078930] transition-colors">{opportunity.title}</h5>
                              <p className="text-xs text-slate-500 mt-1 mb-3">{opportunity.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] text-slate-600 font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                                  <span className="text-[#078930]">📅</span>
                                  {new Date(opportunity.startsAt).toLocaleDateString()}
                                  <span className="text-slate-300">|</span>
                                  {new Date(opportunity.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                
                                {skillsArray.map((skill, index) => (
                                  <span key={index} className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-1 rounded-md border border-blue-100">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center shrink-0">
                              {isRegistered ? (
                                <button disabled className="w-full md:w-auto bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-default">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  Registered
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSignUp(opportunity.id)}
                                  disabled={isSigningUp}
                                  className={`w-full md:w-auto px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                    isSigningUp 
                                      ? 'bg-green-50 text-green-600 border border-green-200'
                                      : 'bg-[#078930] text-white hover:bg-[#056623] active:scale-95 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  {isSigningUp ? (
                                    <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-green-600"></div> Joining...</>
                                  ) : 'Sign Up'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-[11px] font-bold text-slate-400 mt-auto uppercase tracking-wider">
                <span>Campaign Run: {new Date(campaign.startDate).toLocaleDateString()} — {new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
