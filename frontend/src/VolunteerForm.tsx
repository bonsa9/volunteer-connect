import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Volunteer = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  points: number;
  level: number;
};

export default function VolunteerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Volunteer>({ name: '', email: '', phone: '', skills: [], points: 0, level: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/volunteers/${id}`)
      .then(r => r.json())
      .then((v: Volunteer) => setForm({ ...v, skills: v.skills || [] }))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e: any) => {
    e.preventDefault();
    const payload = { ...form, skills: form.skills?.map(s => s.trim()).filter(Boolean) };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/volunteers/${id}` : '/api/volunteers';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    navigate('/');
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm">Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm">Phone</label>
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm">Skills (comma separated)</label>
        <input value={(form.skills || []).join(', ')} onChange={e => setForm({ ...form, skills: e.target.value.split(',') })} className="w-full rounded-2xl border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Points</label>
          <input type="number" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} className="w-full rounded-2xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Level</label>
          <input type="number" value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })} className="w-full rounded-2xl border px-3 py-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-3xl bg-slate-900 px-4 py-2 text-white">Save</button>
        <button type="button" onClick={() => navigate(-1)} className="rounded-3xl border px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}
