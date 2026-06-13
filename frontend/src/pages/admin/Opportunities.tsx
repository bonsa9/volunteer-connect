import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

interface Campaign {
  id: string;
  title: string;
}

interface Opportunity {
  id: string;
  title: string;
  description?: string;
  skills?: string[] | string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  campaign?: Campaign;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [campaignId, setCampaignId] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Alerts
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadOpportunities = () => {
    setLoading(true);
    fetchWithAuth('/api/opportunities')
      .then((data) => {
        setOpportunities(data.items || data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load opportunities:', err);
        showAlert('Could not load opportunities list.', 'error');
        setLoading(false);
      });
  };

  const loadCampaigns = () => {
    fetchWithAuth('/api/campaigns')
      .then((data) => {
        setCampaigns(data.items || data || []);
      })
      .catch((err) => {
        console.error('Failed to load campaigns:', err);
      });
  };

  useEffect(() => {
    loadOpportunities();
    loadCampaigns();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSkillsText('');
    setStartsAt('');
    setEndsAt('');
    setIsActive(true);
    setCampaignId(campaigns[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setModalMode('edit');
    setEditingId(opp.id);
    setTitle(opp.title);
    setDescription(opp.description || '');
    
    // Parse skills to text
    let skillsString = '';
    if (Array.isArray(opp.skills)) {
      skillsString = opp.skills.join(', ');
    } else if (typeof opp.skills === 'string') {
      try {
        const parsed = JSON.parse(opp.skills);
        skillsString = Array.isArray(parsed) ? parsed.join(', ') : parsed;
      } catch (e) {
        skillsString = opp.skills;
      }
    }
    setSkillsText(skillsString);

    // Format datetime strings to match datetime-local input requirements (YYYY-MM-DDTHH:MM)
    const formatDateTime = (dateStr?: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setStartsAt(formatDateTime(opp.startsAt));
    setEndsAt(formatDateTime(opp.endsAt));
    setIsActive(opp.isActive);
    setCampaignId(opp.campaign?.id || campaigns[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !campaignId) {
      showAlert('Opportunity Title and Campaign are required.', 'error');
      return;
    }

    setSubmitting(true);

    const skillsArray = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      skills: skillsArray,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      isActive,
      campaignId,
    };

    try {
      if (modalMode === 'create') {
        await fetchWithAuth('/api/opportunities', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showAlert('Opportunity created successfully!', 'success');
      } else {
        await fetchWithAuth(`/api/opportunities/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showAlert('Opportunity updated successfully!', 'success');
      }
      setIsModalOpen(false);
      loadOpportunities();
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || 'Failed to save opportunity.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (opp: Opportunity) => {
    setDeleteTarget(opp);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetchWithAuth(`/api/opportunities/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      showAlert('Opportunity deleted successfully.', 'success');
      setOpportunities(opportunities.filter(o => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || 'Failed to delete opportunity.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Alert Banner */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all ${
          alert.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <span>{alert.type === 'success' ? '✅' : '❌'}</span>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-250 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Opportunity?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <strong className="text-slate-800">{deleteTarget.title}</strong>? 
              This will remove all associated volunteer signups. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-650 hover:bg-red-700 text-white shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-255 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-950">
                {modalMode === 'create' ? 'Create Opportunity / Shift' : 'Edit Opportunity'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-semibold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Shift Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning River Cleanup Crew"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Parent Campaign</label>
                <select 
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  required
                >
                  {campaigns.length === 0 ? (
                    <option value="" disabled>No campaigns active. Please create a campaign first.</option>
                  ) : (
                    campaigns.map((camp) => (
                      <option key={camp.id} value={camp.id}>{camp.title}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe specific duties, requirements, or meeting locations..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. First Aid, Teamwork, Cleanup"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Starts At</label>
                  <input 
                    type="datetime-local" 
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ends At</label>
                  <input 
                    type="datetime-local" 
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4.5 w-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Opportunity is Active & Recruitable
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-650 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Opportunity'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Opportunities</h1>
          <p className="text-slate-500 mt-1">Manage individual shifts, schedules, and skills requirements.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          + Create Opportunity
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No shifts found</h3>
            <p className="text-sm text-slate-500">Create a shift under an active campaign to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Opportunity / Shift</th>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Skills Required</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {opportunities.map((opp) => {
                  // Parse skills
                  let skillsArray: string[] = [];
                  if (Array.isArray(opp.skills)) {
                    skillsArray = opp.skills;
                  } else if (typeof opp.skills === 'string') {
                    try {
                      skillsArray = JSON.parse(opp.skills);
                    } catch (e) {
                      skillsArray = opp.skills.split(',').map(s => s.trim());
                    }
                  }

                  return (
                    <tr key={opp.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-800 text-base">{opp.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{opp.description || 'No description provided.'}</div>
                      </td>
                      <td className="p-4 text-slate-705 font-medium">
                        {opp.campaign?.title || 'Unknown Campaign'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {skillsArray.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          ) : (
                            skillsArray.map((skill, index) => (
                              <span key={index} className="text-[10px] bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded-md">
                                {skill}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 text-xs font-medium space-y-0.5">
                        <div>📅 {opp.startsAt ? new Date(opp.startsAt).toLocaleDateString() : 'N/A'}</div>
                        <div>⏱ {opp.startsAt ? new Date(opp.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} - {opp.endsAt ? new Date(opp.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                      </td>
                      <td className="p-4">
                        {opp.isActive ? (
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="bg-slate-150 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Inactive</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openEditModal(opp)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-355 text-slate-650 hover:text-slate-800 rounded-lg text-xs font-bold transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(opp)}
                            className="px-3 py-1.5 border border-red-100 bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-750 rounded-lg text-xs font-bold transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
