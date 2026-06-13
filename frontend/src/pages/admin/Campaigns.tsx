import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

interface Organization {
  id: string;
  name: string;
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
  organization?: Organization;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orgId, setOrgId] = useState('');
  const [placeName, setPlaceName] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Alerts
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadCampaigns = () => {
    setLoading(true);
    fetchWithAuth('/api/campaigns')
      .then((data) => {
        setCampaigns(data.items || data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load campaigns:', err);
        showAlert('Could not load campaigns list.', 'error');
        setLoading(false);
      });
  };

  const loadOrganizations = () => {
    fetchWithAuth('/api/organizations')
      .then((data) => {
        setOrganizations(data.items || data || []);
      })
      .catch((err) => {
        console.error('Failed to load organizations:', err);
      });
  };

  useEffect(() => {
    loadCampaigns();
    loadOrganizations();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setOrgId(organizations[0]?.id || '');
    setPlaceName('');
    setIsModalOpen(true);
  };

  const openEditModal = (camp: Campaign) => {
    setModalMode('edit');
    setEditingId(camp.id);
    setTitle(camp.title);
    setDescription(camp.description || '');
    setStartDate(camp.startDate || '');
    setEndDate(camp.endDate || '');
    setOrgId(camp.organization?.id || organizations[0]?.id || '');
    setPlaceName(camp.location?.placeName || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !orgId) {
      showAlert('Campaign Title and Organization are required.', 'error');
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      description,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      organizationId: orgId,
      location: placeName ? {
        latitude: 9.03,
        longitude: 38.74,
        placeName
      } : undefined
    };

    try {
      if (modalMode === 'create') {
        await fetchWithAuth('/api/campaigns', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showAlert('Campaign created successfully!', 'success');
      } else {
        await fetchWithAuth(`/api/campaigns/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showAlert('Campaign updated successfully!', 'success');
      }
      setIsModalOpen(false);
      loadCampaigns();
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || 'Failed to save campaign.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (camp: Campaign) => {
    setDeleteTarget(camp);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetchWithAuth(`/api/campaigns/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      showAlert('Campaign deleted successfully.', 'success');
      setCampaigns(campaigns.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || 'Failed to delete campaign.', 'error');
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Campaign?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <strong className="text-slate-800">{deleteTarget.title}</strong>? 
              This will also remove any opportunities associated with this campaign. This action cannot be undone.
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
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-250 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-950">
                {modalMode === 'create' ? 'Create New Campaign' : 'Edit Campaign'}
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Campaign Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Addis Community Cleanup"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the goals and focus of this campaign..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organizing NGO</label>
                <select 
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                  required
                >
                  {organizations.length === 0 ? (
                    <option value="" disabled>No organizations available. Please seed them.</option>
                  ) : (
                    organizations.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location (City / Region)</label>
                <input 
                  type="text" 
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-sm text-slate-800 transition-all outline-none"
                />
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
                    'Save Campaign'
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaigns</h1>
          <p className="text-slate-500 mt-1">Add, update, or remove community outreach campaigns.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          + Create Campaign
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No campaigns found</h3>
            <p className="text-sm text-slate-500">Create a new volunteer campaign to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Campaign Info</th>
                  <th className="p-4">NGO Partner</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-800 text-base">{camp.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{camp.description || 'No description provided.'}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {camp.organization?.name || 'Local NGO'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-650 font-medium">
                      {camp.startDate ? new Date(camp.startDate).toLocaleDateString() : 'N/A'} - {camp.endDate ? new Date(camp.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600">
                      📍 {camp.location?.placeName || 'Not specified'}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => openEditModal(camp)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 rounded-lg text-xs font-bold transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(camp)}
                          className="px-3 py-1.5 border border-red-100 bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-750 rounded-lg text-xs font-bold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
