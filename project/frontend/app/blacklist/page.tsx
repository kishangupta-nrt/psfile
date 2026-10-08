'use client';

import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../../lib/api';
import { mockBlacklist, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function BlacklistPage() {
  const [rows, setRows] = useState<any[]>(mockBlacklist);
  const [mobile, setMobile] = useState('');
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/blacklist');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list.length ? list : mockBlacklist);
      setOffline(false);
    } catch {
      setOffline(true);
      setRows(mockBlacklist);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost('/blacklist', { mobile });
      setMsg(`Added ${mobile}.`);
      setMobile('');
      load();
    } catch (err: any) {
      setMsg(`Couldn't add — offline demo data.`);
    }
  }

  async function remove(m: string) {
    try {
      await apiDelete(`/blacklist/${m}`);
      setMsg(`Removed ${m}.`);
      load();
    } catch (err: any) {
      setMsg(`Couldn't remove — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Blacklist</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <Table
        columns={['mobile', 'reason', 'action']}
        rows={rows.map((r: any) => [r.mobile ?? r.number ?? JSON.stringify(r), r.reason ?? '', 'remove →'])}
      />
      <div className="row" style={{ marginTop: 8 }}>
        {rows.map((r: any, i: number) => (
          <button key={i} className="btn btn-sm btn-ghost" onClick={() => remove(r.mobile ?? r.number)}>
            Remove {r.mobile ?? r.number}
          </button>
        ))}
      </div>
      <form className="form" onSubmit={add} style={{ marginTop: 12 }}>
        <label>Mobile<input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="91XXXXXXXXXX" /></label>
        <button className="btn">Add to blacklist</button>
      </form>
    </main>
  );
}
