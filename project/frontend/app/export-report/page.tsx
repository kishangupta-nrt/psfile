'use client';
import { useState } from 'react';
import { apiPost } from '../../lib/api';
import { useToast } from '../../components/Toast';
export default function Page() {
  const { push } = useToast();
  const [report, setReport] = useState('campaigns'); const [busy, setBusy] = useState(false); const [id, setId] = useState('');
  async function req(e: React.FormEvent) { e.preventDefault(); setBusy(true); try { const r: any = await apiPost(`/exports/${report}`, {}); setId(r?.id ?? 'exp_demo_1'); push('ok', 'Export queued. Poll status, then download.'); } catch (er: any) { push('err', er?.message || 'Export failed'); } finally { setBusy(false); } }
  return <main><h1>Download Report</h1>
    <form onSubmit={req} className="form"><div className="row"><select value={report} onChange={(e) => setReport(e.target.value)}><option value="campaigns">campaigns</option><option value="detailed">detailed</option><option value="by-mobile">by-mobile</option></select><button className="btn btn-sm" disabled={busy}>{busy ? 'Queueing…' : 'Request export'}</button></div>{id && <span className="muted small">Export ID: {id}</span>}</form></main>;
}
