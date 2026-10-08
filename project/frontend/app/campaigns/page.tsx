'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockCampaigns, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function CampaignsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/campaigns');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list);
    } catch {
      setOffline(true);
      setRows(mockCampaigns);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, op: 'repush' | 'stop') {
    try {
      await apiPost(`/campaigns/${id}/${op}`, {});
      setMsg(`${op === 'repush' ? 'Repush started' : 'Stopped'}: ${id}`);
      load();
    } catch (e: any) {
      setMsg(`${op} failed — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Campaigns</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      <div className="row">
        <button className="btn btn-ghost" onClick={load}>Refresh</button>
      </div>
      {msg ? <p className="ok">{msg}</p> : null}
      <Table
        columns={['id', 'status', 'total', 'delivered', 'actions']}
        rows={rows.map((c) => [c.id, c.status, c.total ?? '', c.delivered ?? '', 'repush/stop →'])}
      />
      <div className="row" style={{ marginTop: 8 }}>
        {rows.map((c) => (
          <span key={c.id} className="row">
            <code>{c.id}</code>
            <button className="btn btn-sm" onClick={() => act(c.id, 'repush')}>Repush</button>
            <button className="btn btn-sm btn-ghost" onClick={() => act(c.id, 'stop')}>Stop</button>
          </span>
        ))}
      </div>
    </main>
  );
}
