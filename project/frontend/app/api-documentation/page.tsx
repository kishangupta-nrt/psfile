'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockApiDocs } from '../../lib/mock';
import Table from '../../components/Table';

export default function ApiDocsPage() {
  const [docs, setDocs] = useState<any[]>(mockApiDocs);
  const [keys, setKeys] = useState<any[]>([]);
  const [label, setLabel] = useState('Default key');
  const [msg, setMsg] = useState('');
  const [offline, setOffline] = useState(false);

  async function loadKeys() {
    try {
      const live = await apiGet<any>('/api-keys');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      setKeys(list);
      setOffline(false);
    } catch {
      setOffline(true);
      setKeys([{ id: 'key_demo_1', label: 'Demo key', prefix: 'nrt_demo' }]);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const live = await apiGet<any>('/api-docs');
        const list = Array.isArray(live) ? live : live?.data ?? live?.endpoints ?? [];
        if (list.length) setDocs(list);
      } catch {
        setDocs(mockApiDocs); // static fallback list
      }
      loadKeys();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/api-keys', { label });
      setMsg('API key created.');
      loadKeys();
    } catch (err: any) {
      setMsg(`Couldn't create key — offline demo data.`);
    }
  }

  async function rotate(id: string) {
    try {
      const res = await apiPost(`/api-keys/${id}/rotate`, {});
      setMsg('API key rotated.');
      loadKeys();
    } catch (err: any) {
      setMsg(`Couldn't rotate key — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>API Documentation</h1>
      <p className="muted">Endpoints and API keys.</p>
      {offline && <p className="muted">Offline demo data.</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <h2>Endpoints</h2>
      <Table
        columns={['method', 'path', 'desc']}
        rows={docs.map((d: any) => [d.method ?? '', d.path ?? '', d.desc ?? d.description ?? ''])}
      />
      <h2>API keys</h2>
      <Table columns={['id', 'label']} rows={keys.map((k: any) => [k.id, k.label ?? k.prefix ?? ''])} />
      <div className="row" style={{ marginTop: 8 }}>
        {keys.map((k: any) => (
          <button key={k.id} className="btn btn-sm btn-ghost" onClick={() => rotate(k.id)}>
            Rotate {k.id}
          </button>
        ))}
      </div>
      <form className="form" onSubmit={createKey} style={{ marginTop: 12 }}>
        <label>Label<input value={label} onChange={(e) => setLabel(e.target.value)} /></label>
        <button className="btn">Create key</button>
      </form>
    </main>
  );
}
