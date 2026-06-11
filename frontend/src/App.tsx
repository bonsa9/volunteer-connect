import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import VolunteerDetail from './VolunteerDetail';
import VolunteerForm from './VolunteerForm';
import CampaignsList from './CampaignsList';
import OpportunitiesList from './OpportunitiesList';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'om', label: 'Oromoo' },
  { code: 'ti', label: 'ትግርኛ' },
];

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  points: number;
  level: number;
};

type Campaign = {
  id: string;
  title: string;
  description?: string;
  organization?: { name: string };
  opportunities?: Array<{ id: string }>;
  startDate?: string;
  endDate?: string;
};

type Organization = {
  id: string;
  name: string;
};

type StatCard = {
  label: string;
  value: string | number;
  delta: string;
};

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statCards, setStatCards] = useState<StatCard[]>([
    { label: 'Active Campaigns', value: '...', delta: '' },
    { label: 'Volunteer Hours', value: '...', delta: '' },
    { label: 'Partner NGOs', value: '...', delta: '' },
    { label: 'Total Volunteers', value: '...', delta: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch volunteers
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));

    fetch(`/api/volunteers?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setVolunteers(data.items || data);
        if (typeof data.total === 'number') setTotal(data.total);
      })
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, [search, page, limit]);

  useEffect(() => {
    // Fetch campaigns, organizations, and contributions for stats
    Promise.all([
      fetch('/api/campaigns?limit=100').then(r => r.json()),
      fetch('/api/organizations?limit=100').then(r => r.json()),
      fetch('/api/contributions?limit=100').then(r => r.json()),
      fetch('/api/volunteers?limit=1').then(r => r.json()),
    ])
      .then(([campaignsRes, orgsRes, contribRes, volRes]) => {
        const campaignList = campaignsRes.items || [];
        const orgList = orgsRes.items || [];
        const contributions = contribRes.items || [];
        const volunteerCount = volRes.total || 0;

        const totalHours = contributions.reduce((sum: number, c: any) => sum + (c.hours || 0), 0);

        setCampaigns(campaignList);
        setStatCards([
          { label: 'Active Campaigns', value: campaignList.length, delta: '' },
          { label: 'Volunteer Hours', value: totalHours, delta: '' },
          { label: 'Partner NGOs', value: orgList.length, delta: '' },
          { label: 'Total Volunteers', value: volunteerCount, delta: '' },
        ]);
      })
      .catch(() => {});
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  const roster = (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-6 py-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white">VC</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Volunteer Connect</p>
              <p className="text-xs text-slate-400">Ethiopia impact hub</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm text-slate-700">
            <a className="block rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-sm" href="#">Dashboard</a>
            <a className="block rounded-3xl px-4 py-3 hover:bg-slate-50" href="#">Campaigns</a>
            <a className="block rounded-3xl px-4 py-3 hover:bg-slate-50" href="#">Volunteers</a>
            <a className="block rounded-3xl px-4 py-3 hover:bg-slate-50" href="#">Reports</a>
            <a className="block rounded-3xl px-4 py-3 hover:bg-slate-50" href="#">Settings</a>
          </nav>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Languages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${language === lang.code ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="px-6 py-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">Empower volunteers across Ethiopia</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">{t('hero.description')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm hover:border-slate-300">Notifications</button>
              <div className="flex items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">A</div>
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {statCards.map(card => (
              <article key={card.label} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-emerald-600">{card.delta} since last week</p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Campaign overview</h2>
                  <p className="mt-2 text-sm text-slate-600">Track volunteer opportunities, locations and impact.</p>
                </div>
                <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">New campaign</button>
              </div>

              <div className="mt-8 space-y-4">
                {campaigns.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">No campaigns available yet.</div>
                ) : (
                  campaigns.slice(0, 5).map(campaign => (
                    <div key={campaign.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[4fr_1fr]">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{campaign.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{campaign.description}</p>
                        {campaign.organization && <p className="mt-1 text-xs text-slate-500">by {campaign.organization.name}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Opportunities</p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{campaign.opportunities?.length || 0}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Recent activity</h3>
                <ul className="mt-5 space-y-4 text-sm text-slate-600">
                  <li className="rounded-3xl bg-slate-50 p-4">Volunteer registration completed for Addis Ababa clean drive.</li>
                  <li className="rounded-3xl bg-slate-50 p-4">New partner NGO added for youth empowerment.</li>
                  <li className="rounded-3xl bg-slate-50 p-4">Report generated for last month’s outreach.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Top volunteers</h3>
                <ol className="mt-5 space-y-3 text-sm text-slate-600">
                  {volunteers.length === 0 ? (
                    <li className="rounded-3xl bg-slate-50 p-4">No volunteers yet.</li>
                  ) : (
                    volunteers.slice(0, 3).sort((a, b) => b.points - a.points).map(vol => (
                      <li key={vol.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                        <span>{vol.name}</span>
                        <span className="font-semibold text-slate-900">{vol.points} pts</span>
                      </li>
                    ))
                  )}
                </ol>
              </div>
            </aside>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Volunteer roster</h2>
                <p className="mt-2 text-sm text-slate-600">See volunteer profiles and skill sets.</p>
              </div>
                <div className="flex items-center gap-3">
                  <Link to="/volunteers/new" className="rounded-3xl bg-slate-900 px-4 py-2 text-white">New Volunteer</Link>
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search volunteers..."
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                  />
                  {loading && <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-500">Loading...</div>}
                </div>
            </div>

            <div className="mt-6 grid gap-4">
              {volunteers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">No volunteers available yet.</div>
              ) : (
                volunteers.map(volunteer => (
                  <div key={volunteer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link to={`/volunteers/${volunteer.id}`} className="text-lg font-semibold text-slate-900">{volunteer.name}</Link>
                        <p className="text-sm text-slate-600">{volunteer.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">Level {volunteer.level}</div>
                        <Link to={`/volunteers/${volunteer.id}/edit`} className="rounded-3xl border px-3 py-2 text-sm">Edit</Link>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span>{volunteer.points} pts</span>
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span>Skills: {volunteer.skills?.join(', ') || 'Not specified'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">Total: {total}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >Prev</button>
                <div className="text-sm text-slate-700">Page {page}</div>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= total}
                  className={`rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ${page * limit >= total ? 'opacity-40 cursor-not-allowed' : ''}`}
                >Next</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
          <Sidebar language={language} onLanguageChange={handleLanguageChange} />
          
          <Routes>
            <Route path="/" element={roster} />
            <Route path="/campaigns" element={<div className="px-6 py-8"><CampaignsList /></div>} />
            <Route path="/opportunities" element={<div className="px-6 py-8"><OpportunitiesList /></div>} />
            <Route path="/volunteers/new" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerForm /></div>} />
            <Route path="/volunteers/:id" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerDetail /></div>} />
            <Route path="/volunteers/:id/edit" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerForm /></div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function Sidebar({ language, onLanguageChange }: { language: string; onLanguageChange: (code: string) => void }) {
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Campaigns', path: '/campaigns', icon: '📋' },
    { label: 'Opportunities', path: '/opportunities', icon: '🎯' },
    { label: 'Volunteers', path: '/volunteers', icon: '👥' },
  ];

  return (
    <aside className="border-r border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white">VC</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Volunteer Connect</p>
          <p className="text-xs text-slate-400">Ethiopia impact hub</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2 text-sm text-slate-700">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-3xl px-4 py-3 ${location.pathname === item.path ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Languages</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`rounded-full border px-3 py-2 text-xs transition ${language === lang.code ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
          <Sidebar language={language} onLanguageChange={handleLanguageChange} />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<div className="px-6 py-8"><CampaignsList /></div>} />
            <Route path="/opportunities" element={<div className="px-6 py-8"><OpportunitiesList /></div>} />
            <Route path="/volunteers/new" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerForm /></div>} />
            <Route path="/volunteers/:id" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerDetail /></div>} />
            <Route path="/volunteers/:id/edit" element={<div className="px-6 py-8"><Link to="/" className="block mb-4 text-slate-600 hover:text-slate-900">← Back</Link><VolunteerForm /></div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
