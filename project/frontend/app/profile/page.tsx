'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPatch, friendlyError } from '../../lib/api';
import { OFFLINE_NOTE } from '../../lib/mock';
import { States } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../lib/auth';
export default function Page() {
  const { user } = useAuth(); const { push } = useToast();
  const [form, setForm] = useState({ name: '', phone: '' }); const [loading, setLoading] = useState(true); const [offline, setOffline] = useState(false);
  useEffect(() => { (async () => { try { const r: any = await apiGet('/users/me'); setForm({ name: r?.name ?? '', phone: r?.phone ?? '' }); } catch { setOffline(true); } finally { setLoading(false); } })(); }, []);
  async function save(e: React.FormEvent) { e.preventDefault(); try { await apiPatch('/users/me', form); push('ok', 'Profile updated.'); } catch (er: any) { push('err', friendlyError(er, 'Save profile')); } }
  return <main><h1>Profile</h1><p className="muted">{user?.email}</p>
    {offline && <p className="muted">{OFFLINE_NOTE}</p>}<States loading={loading} />
    {!loading && <form onSubmit={save} className="form"><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><button className="btn">Save</button></form>}</main>;
}
