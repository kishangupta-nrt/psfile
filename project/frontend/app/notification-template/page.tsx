'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
import { useToast } from '../../components/Toast';
export default function TemplatesPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [name, setName] = useState(''); const [body, setBody] = useState('');
  async function load() { setLoading(true); try { const r: any = await apiGet('/templates'); setRows(r?.data ?? r ?? []); } catch { setRows([{ id: 'tpl_1', name: 'OTP (mock)', body: 'Your OTP is {#var#}' }]); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function add(e: React.FormEvent) { e.preventDefault(); try { await apiPost('/templates', { name, body }); push('ok', 'Template saved.'); setName(''); setBody(''); load(); } catch (er: any) { push('err', er?.message || 'Save failed'); } }
  return <main><h1>Notification Templates</h1>
    <form onSubmit={add} className="form"><div className="row"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" /><button className="btn btn-sm">Add</button></div><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body with {#var#}" /></form>
    <States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['id', 'name', 'body']} rows={rows.map((t: any) => [t.id, t.name, String(t.body ?? '').slice(0, 80)])} />}</main>;
}
