import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Opportunity = {
  id: string;
  title: string;
  description?: string;
  campaign?: { id: string; title: string };
  skills?: string[];
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
};

export default function OpportunitiesList() {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterActive, setFilterActive] = useState(true);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/opportunities?page=${page}&limit=${limit}&isActive=${filterActive}`)
      .then(res => res.json())
      .then(data => {
        setOpportunities(data.items || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch(err => {
        setError('Failed to load opportunities');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page, filterActive]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Opportunities</h2>
          <p className="mt-2 text-sm text-slate-600">Explore volunteer opportunities</p>
        </div>
        <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
          New Opportunity
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setFilterActive(true); setPage(1); }}
          className={`rounded-3xl px-4 py-2 text-sm font-medium ${filterActive ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
        >
          Active Only
        </button>
        <button
          onClick={() => { setFilterActive(false); setPage(1); }}
          className={`rounded-3xl px-4 py-2 text-sm font-medium ${!filterActive ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
        >
          All
        </button>
      </div>

      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          Loading opportunities...
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
          No opportunities available yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{opp.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${opp.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {opp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{opp.description}</p>
                  {opp.campaign && (
                    <p className="mt-2 text-xs text-slate-500">
                      Campaign: <span className="font-medium">{opp.campaign.title}</span>
                    </p>
                  )}
                  {opp.skills && opp.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opp.skills.map(skill => (
                        <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <button className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ${page === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Prev
          </button>
          <div className="text-sm text-slate-700">Page {page}</div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= total}
            className={`rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ${page * limit >= total ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
