'use client';

import { useState } from 'react';
import { apiGet } from '../../lib/api';
import { mockCampaigns, OFFLINE_NOTE } from '../../lib/mock';
import { DataTable } from '../../components/ui';

function initialQuery(): string {
  try {
    return new URLSearchParams(window.location.search).get('q') ?? '';
  } catch {
    return '';
  }
}

export default function CampaignReportPage() {
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q0] = useState(initialQuery);
  const [rows, setRows] = useState<any[]>(mockCampaigns);
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      const q = new URLSearchParams();
      if (status) q.set('status', status);
      if (from) q.set('from', from);
      if (to) q.set('to', to);
      const live = await apiGet<any>(`/reports/campaigns${q.toString() ? `?${q}` : ''}`);
      const list = Array.isArray(live) ? live : live?.data ?? live?.rows ?? [];
      setRows(list.length ? list : mockCampaigns);
      setOffline(false);
      setMsg('');
    } catch (err: any) {
      setOffline(true);
      setMsg(`${err?.code || 'OFFLINE'}: ${err?.message || 'backend unreachable'}`);
      setRows(mockCampaigns);
    }
  }

  return (
    <main className="container page">
      <h1>Campaign Report</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      <form className="form" onSubmit={load}>
        <div className="row">
          <label>Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">all</option>
              <option value="queued">queued</option>
              <option value="sending">sending</option>
              <option value="completed">completed</option>
              <option value="stopped">stopped</option>
            </select>
          </label>
          <label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        </div>
        <button className="btn">Apply filter</button>
      </form>
      {msg ? <p className="error">{msg}</p> : null}
      <DataTable
        columns={['id', 'message', 'status', 'total', 'delivered', 'failed']}
        rows={rows.map((c: any) => [c.id, String(c.message ?? '').slice(0, 50), c.status, c.total ?? '', c.delivered ?? '', c.failed ?? ''])}
        initialQuery={q0}
      />
    </main>
  );
}
