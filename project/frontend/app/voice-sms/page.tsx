'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockVoiceCampaigns, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function VoiceSmsPage() {
  const [to, setTo] = useState('919999999901');
  const [file, setFile] = useState('promo.mp3');
  const [rows, setRows] = useState<any[]>(mockVoiceCampaigns);
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/voice/campaigns');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list.length ? list : mockVoiceCampaigns);
      setOffline(false);
    } catch {
      setOffline(true);
      setRows(mockVoiceCampaigns);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/voice/campaigns/send', { to, file });
      setMsg('Voice SMS sent.');
      load();
    } catch (err: any) {
      setMsg(`Couldn't send — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Voice SMS</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <form className="form" onSubmit={submit}>
        <label>To<input value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <label>Audio file key<input value={file} onChange={(e) => setFile(e.target.value)} placeholder="upload via Voice Upload first" /></label>
        <button className="btn">Send voice SMS</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <Table columns={['id', 'file', 'status']} rows={rows.map((r: any) => [r.id, r.file ?? r.audio ?? '', r.status])} />
      </div>
    </main>
  );
}
