import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

export default function OrgVerifications() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchWithAuth('/api/organizations')
      .then((data: any) => {
        if (Array.isArray(data.items)) setOrgs(data.items);
      })
      .catch(err => console.error('Failed to load orgs', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: 'verified' | 'rejected') => {
    try {
      await fetchWithAuth(`/api/organizations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: action }),
      });
      setOrgs(orgs.map(org => org.id === id ? { ...org, status: action } : org));
      showToast(`Organization successfully ${action}.`, 'success');
    } catch (err) {
      showToast('Failed to update organization status', 'error');
    }
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
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A3D91] tracking-tight">Organization Verifications</h1>
          <p className="text-sm text-slate-500 mt-1">Review legal documents and approve non-profit organizations for the platform.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
          <div className="px-4 py-2 text-sm font-bold text-slate-700">
            Pending: <span className="text-amber-600 ml-1">{orgs.filter(o => o.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-5">Organization</th>
                <th className="p-5">Contact Details</th>
                <th className="p-5">Submission Date</th>
                <th className="p-5">Status</th>
                <th className="p-5">Documents</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orgs.map(org => (
                <tr key={org.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-900">{org.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">ID: {org.id.substring(0,6)}</div>
                  </td>
                  <td className="p-5 text-slate-600 font-medium">{org.email || 'N/A'}</td>
                  <td className="p-5 text-slate-500 font-medium flex items-center gap-2 mt-1">
                    <span className="text-slate-400">📅</span> {new Date().toLocaleDateString()}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                      org.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' : 
                      org.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        org.status === 'verified' ? 'bg-green-500' : 
                        org.status === 'rejected' ? 'bg-red-500' :
                        'bg-amber-500 animate-pulse'
                      }`} />
                      {org.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <button className="flex items-center gap-2 text-[#0A3D91] hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      {org.docs || 0} Files
                    </button>
                  </td>
                  <td className="p-5 text-right">
                    {org.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(org.id, 'verified')}
                          className="bg-green-100 hover:bg-green-200 text-green-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          title="Approve Organization"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => handleAction(org.id, 'rejected')}
                          className="bg-red-100 hover:bg-red-200 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          title="Reject Organization"
                        >
                          ✕
                        </button>
                        <Link
                          to={`/admin/verifications/orgs/${org.id}`}
                          className="bg-blue-50 hover:bg-blue-100 text-[#0A3D91] w-8 h-8 rounded-lg flex items-center justify-center transition-colors border border-blue-100"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Resolved</span>
                        <Link
                          to={`/admin/verifications/orgs/${org.id}`}
                          className="bg-blue-50 hover:bg-blue-100 text-[#0A3D91] w-8 h-8 rounded-lg flex items-center justify-center transition-colors border border-blue-100"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3D91] mx-auto mb-4" />
            Loading organizations...
          </div>
        )}
        {!loading && orgs.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No organizations currently awaiting verification.
          </div>
        )}
      </div>
    </div>
  );
}
