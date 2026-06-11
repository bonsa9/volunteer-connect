import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const statCards = [
  { label: 'Active Campaigns', value: '12', delta: '+18%' },
  { label: 'Volunteer Hours', value: '1.2k', delta: '+9%' },
  { label: 'Partner NGOs', value: '27', delta: '+3%' },
  { label: 'Impact Score', value: '94', delta: '+6%' },
];

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/volunteers')
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
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
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[4fr_1fr]">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Addis community cleanup</h3>
                    <p className="mt-2 text-sm text-slate-600">Volunteer-led river cleanup and neighborhood awareness campaign.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Open slots</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">24</p>
                  </div>
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[4fr_1fr]">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Rural health outreach</h3>
                    <p className="mt-2 text-sm text-slate-600">Support vaccination and education efforts in partnership with local clinics.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Open slots</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">18</p>
                  </div>
                </div>
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
                  <li className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span>Merit Alem</span>
                    <span className="font-semibold text-slate-900">1,240 pts</span>
                  </li>
                  <li className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span>Ruth Bekele</span>
                    <span className="font-semibold text-slate-900">1,120 pts</span>
                  </li>
                  <li className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span>Samuel Tesfaye</span>
                    <span className="font-semibold text-slate-900">1,020 pts</span>
                  </li>
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
              {loading && <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-500">Loading volunteers...</div>}
            </div>

            <div className="mt-6 grid gap-4">
              {volunteers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">No volunteers available yet.</div>
              ) : (
                volunteers.map(volunteer => (
                  <div key={volunteer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{volunteer.name}</p>
                        <p className="text-sm text-slate-600">{volunteer.email}</p>
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">Level {volunteer.level}</div>
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
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
