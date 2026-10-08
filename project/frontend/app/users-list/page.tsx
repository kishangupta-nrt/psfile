'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockUsers, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function UsersListPage() {
  const [rows, setRows] = useState<any[]>(mockUsers);
  const [email, setEmail] = useState('');
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const live = await apiGet<any>('/users');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setRows(list.length ? list : mockUsers);
      setOffline(false);
    } catch {
      setOffline(true);
      setRows(mockUsers);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/users', { email, password: 'changeme123' });
      setMsg('User created.');
      setEmail('');
      load();
    } catch (err: any) {
      setMsg(`Couldn't create user — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Users List</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <Table columns={['id', 'email', 'role']} rows={rows.map((u: any) => [u.id, u.email, u.role ?? ''])} />
      <form className="form" onSubmit={submit} style={{ marginTop: 12 }}>
        <label>New user email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <button className="btn">Create user</button>
      </form>
    </main>
  );
}
