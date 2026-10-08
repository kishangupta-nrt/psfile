'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockCreditRequests, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function CreditRequestPage() {
  const [amount, setAmount] = useState('1000');
  const [rows, setRows] = useState<any[]>(mockCreditRequests);
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/wallet/credit-requests');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list.length ? list : mockCreditRequests);
      setOffline(false);
    } catch {
      setOffline(true);
      setRows(mockCreditRequests);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/wallet/credit-requests', { amount: Number(amount) });
      setMsg('Credit request sent.');
      load();
    } catch (err: any) {
      setMsg(`Request failed — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Credit Request</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <form className="form" onSubmit={submit}>
        <label>Amount<input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" /></label>
        <button className="btn">Request credits</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <Table columns={['id', 'amount', 'status']} rows={rows.map((r: any) => [r.id, r.amount, r.status])} />
      </div>
    </main>
  );
}
