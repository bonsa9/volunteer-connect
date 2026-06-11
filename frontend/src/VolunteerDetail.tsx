import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  points: number;
  level: number;
};

export default function VolunteerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vol, setVol] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/volunteers/${id}`)
      .then(r => r.json())
      .then(setVol)
      .catch(() => setVol(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Delete this volunteer?')) return;
    await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
    navigate('/');
  };

  if (loading) return <div>Loading…</div>;
  if (!vol) return <div>Volunteer not found.</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">{vol.name}</h1>
      <p className="text-sm text-slate-600">{vol.email}</p>
      <p className="text-sm text-slate-600">{vol.phone}</p>
      <p className="mt-4">Points: <strong>{vol.points}</strong></p>
      <p>Level: <strong>{vol.level}</strong></p>
      <p className="mt-2">Skills: {vol.skills?.join(', ') || 'Not specified'}</p>

      <div className="mt-6 flex gap-2">
        <Link to={`/volunteers/${vol.id}/edit`} className="rounded-3xl border border-slate-200 px-4 py-2">Edit</Link>
        <button onClick={handleDelete} className="rounded-3xl border border-red-400 px-4 py-2 text-red-600">Delete</button>
      </div>
    </div>
  );
}

