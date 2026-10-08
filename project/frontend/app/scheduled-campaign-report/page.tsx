'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { mockCampaigns, OFFLINE_NOTE } from '../../lib/mock';
import { DataTable, States } from '../../components/ui';
export default function Page() { return <Report title="Scheduled Campaign Report" path="/reports/scheduled" />; }
function Report({ title, path }: { title: string; path: string }) {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [offline, setOffline] = useState(false);
  const [status, setStatus] = useState(''); const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  async function load() {
    setLoading(true);
    try { const q = new URLSearchParams({ ...(status ? { status } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString(); const r: any = await apiGet(`${path}${q ? `?${q}` : ''}`); setRows(r?.data ?? r ?? []); }
    catch { setOffline(true); setRows(mockCampaigns as any[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  return <main><h1>{title}</h1>
    {offline && <p className="muted">{OFFLINE_NOTE}</p>}
    <div className="row toolbar"><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option>queued</option><option>sending</option><option>completed</option><option>stopped</option><option>failed</option></select>
    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /><button className="btn btn-sm" onClick={load}>Apply</button></div>
    <States loading={loading} empty={!loading && rows.length === 0} />
    {!loading && <DataTable columns={['id', 'message', 'status', 'total', 'delivered']} rows={rows.map((c: any) => [c.id, String(c.message ?? '').slice(0, 50), c.status, c.total, c.delivered])} />}</main>;
}
