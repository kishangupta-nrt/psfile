'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockSenders, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function SenderListPage() {
  const [rows, setRows] = useState<any[]>(mockSenders);
  const [senderId, setSenderId] = useState('');
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/senders');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list.length ? list : mockSenders);
      setOffline(false);
    } catch {
      setOffline(true);
      setRows(mockSenders);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/senders', { senderId });
      setMsg('Sender ID created.');
      setSenderId('');
      load();
    } catch (err: any) {
      setMsg(`Couldn't create sender ID — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Sender List</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <Table
        columns={['senderId', 'status']}
        rows={rows.map((s: any) => [s.senderId ?? s.id, s.status ?? ''])}
      />
      <form className="form" onSubmit={submit} style={{ marginTop: 12 }}>
        <label>New sender ID<input value={senderId} onChange={(e) => setSenderId(e.target.value)} placeholder="NRTINF" /></label>
        <button className="btn">Request sender</button>
      </form>
    </main>
  );
}
