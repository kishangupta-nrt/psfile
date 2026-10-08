'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
import { useToast } from '../../components/Toast';
export default function Page() {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState('delivery'); const [url, setUrl] = useState('');
  async function load() { setLoading(true); try { const r: any = await apiGet('/webhooks'); setRows(r?.data ?? []); } catch { setRows([]); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function add(e: React.FormEvent) { e.preventDefault(); try { await apiPost('/webhooks', { event, url }); push('ok', 'Webhook saved.'); setUrl(''); load(); } catch (er: any) { push('err', er?.message || 'Save failed'); } }
  return <main><h1>Webhooks</h1><p className="muted">Outbound delivery and campaign events.</p>
    <form onSubmit={add} className="form"><div className="row"><select value={event} onChange={(e) => setEvent(e.target.value)}><option>delivery</option><option>wa-inbound</option><option>voice-status</option></select><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={{ flex: 1 }} /><button className="btn btn-sm">Add</button></div></form>
    <States loading={loading} empty={!loading && !rows.length} />{!loading && rows.length > 0 && <DataTable columns={['id', 'event', 'url']} rows={rows.map((r: any) => [r.id, r.event, r.url])} />}</main>;
}
