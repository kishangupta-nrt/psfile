'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockKannelStatus, OFFLINE_NOTE } from '../../lib/mock';
import Card from '../../components/Card';

export default function AdminManageCampaignPage() {
  const [kannel, setKannel] = useState<any>(mockKannelStatus);
  const [offline, setOffline] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [action, setAction] = useState('stop');
  const [command, setCommand] = useState('');
  const [msg, setMsg] = useState('');

  async function loadKannel() {
    try {
      const live = await apiGet<any>('/admin/kannel-status');
      setKannel(live);
      setOffline(false);
    } catch {
      setOffline(true);
      setKannel(mockKannelStatus);
    }
  }

  useEffect(() => {
    loadKannel();
  }, []);

  async function manage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/admin/manage-campaign', { campaignId, action });
      setMsg(`Done: ${JSON.stringify(res).slice(0, 300)}`);
    } catch (err: any) {
      setMsg(`Couldn't apply action — offline demo data.`);
    }
  }

  async function serverCmd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/admin/server-commands', { command });
      setMsg(`Output: ${JSON.stringify(res).slice(0, 300)}`);
    } catch (err: any) {
      setMsg(`Couldn't run command — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Admin Manage Campaign</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <div className="grid">
        <Card title="Kannel" value={kannel?.ok ? 'OK' : String(kannel?.status ?? 'unknown')} sub={kannel?.note ?? kannel?.smsbox ?? 'kannel-status'} />
        <Card title="Mode" value={String(kannel?.mode ?? (offline ? 'mock' : 'live'))} sub="gateway mode" />
      </div>
      <pre className="dump">{JSON.stringify(kannel, null, 2)}</pre>
      <div className="row" style={{ margin: '8px 0' }}>
        <button className="btn btn-ghost" onClick={loadKannel}>Refresh kannel-status</button>
      </div>
      <form className="form" onSubmit={manage}>
        <label>Campaign ID<input value={campaignId} onChange={(e) => setCampaignId(e.target.value)} placeholder="cmp_..." /></label>
        <label>Action
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="stop">stop</option>
            <option value="repush">repush</option>
            <option value="retry">retry</option>
          </select>
        </label>
        <button className="btn">Manage campaign</button>
      </form>
      <form className="form" onSubmit={serverCmd} style={{ marginTop: 12 }}>
        <label>Server command<input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="status" /></label>
        <button className="btn btn-ghost">Run command</button>
      </form>
    </main>
  );
}
