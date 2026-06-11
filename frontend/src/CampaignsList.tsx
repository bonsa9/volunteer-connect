import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Campaign = {
  id: string;
  title: string;
  description?: string;
  organization?: { id: string; name: string };
  opportunities?: Array<{ id: string; title: string }>;
  startDate?: string;
  endDate?: string;
  location?: { latitude: number; longitude: number; placeName?: string };
};

export default function CampaignsList() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/campaigns?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setCampaigns(data.items || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch(err => {
        setError('Failed to load campaigns');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Campaigns</h2>
          <p className="mt-2 text-sm text-slate-600">Browse all volunteer campaigns and opportunities</p>
        </div>
        <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
          New Campaign
        </button>
      </div>

      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
          No campaigns available yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{campaign.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{campaign.description}</p>
                  {campaign.organization && (
                    <p className="mt-2 text-xs text-slate-500">
                      Organization: <span className="font-medium">{campaign.organization.name}</span>
                    </p>
                  )}
                  {campaign.location?.placeName && (
                    <p className="mt-1 text-xs text-slate-500">
                      Location: <span className="font-medium">{campaign.location.placeName}</span>
                    </p>
                  )}
                  {campaign.startDate && campaign.endDate && (
                    <p className="mt-1 text-xs text-slate-500">
                      {campaign.startDate} to {campaign.endDate}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Opportunities</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{campaign.opportunities?.length || 0}</p>
                  <button className="mt-3 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    View
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
