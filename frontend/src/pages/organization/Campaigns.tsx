import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserInfo } from '../../utils/api';

export default function OrganizationCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.email) {
        setLoading(false);
        return;
      }
      
      try {
        const orgRes: any = await fetchWithAuth(`/api/organizations?search=${userInfo.email}`);
        const org = Array.isArray(orgRes.items) && orgRes.items.length > 0 ? orgRes.items[0] : null;
        
        if (org) {
          const data: any = await fetchWithAuth(`/api/campaigns?organizationId=${org.id}`);
          if (Array.isArray(data.items)) {
            setCampaigns(data.items);
          } else {
            setCampaigns([]);
          }
        } else {
          setCampaigns([]);
        }
      } catch (e) {
        console.error('Failed to load campaigns:', e);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#DA121A]">My Campaigns</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your active volunteer drives.</p>
        </div>
        <Link 
          to="/org/campaigns/create"
          id="create-campaign-header-btn"
          className="inline-flex items-center gap-2 bg-[#DA121A] hover:bg-[#b00e15] text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm shadow-red-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Campaign
        </Link>
      </div>
      
      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl mb-4">
            📋
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Campaigns Yet</h3>
          <p className="text-slate-500 max-w-sm mb-6">You haven't created any campaigns. Start by creating one to mobilize volunteers.</p>
          <button 
            id="create-first-campaign-btn"
            onClick={() => navigate('/org/campaigns/create')}
            className="bg-[#DA121A] hover:bg-[#b00e15] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-[11px] font-bold uppercase tracking-wider border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{camp.title}</h3>
                <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed flex-1">{camp.description}</p>
                
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-slate-400 text-base">📍</span>
                    <span className="font-medium">{camp.location?.placeName || 'Online/TBD'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-slate-400 text-base">📅</span>
                    <span className="font-medium">{camp.startDate} <span className="text-slate-400 mx-1">to</span> {camp.endDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border-t border-slate-100 p-4 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#DA121A] flex items-center justify-center font-bold text-xs border border-red-100">
                    {camp.opportunities?.length || 0}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Shifts</span>
                </div>
                <Link 
                  to={`/org/campaigns/${camp.id}`} 
                  className="inline-flex items-center gap-1.5 text-[#DA121A] font-bold text-sm hover:underline"
                >
                  Manage Campaign
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
