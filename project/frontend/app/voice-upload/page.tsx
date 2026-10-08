'use client';

import { useState } from 'react';
import { API_BASE, getToken } from '../../lib/api';

export default function VoiceUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);
  const [busy, setBusy] = useState(false);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg('Pick a file first.'); setMsgOk(false);
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = getToken();
      const res = await fetch(`${API_BASE}/voice/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `HTTP_${res.status}`);
      setMsg('File uploaded.'); setMsgOk(true);
    } catch (err: any) {
      // Honest failure: nothing was stored anywhere.
      setMsg('Upload failed — backend unreachable. File was NOT saved.'); setMsgOk(false);
    } finally {
      setBusy(false);
    }
  }

  async function process() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/voice/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ file: file?.name ?? 'promo.mp3' }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `HTTP_${res.status}`);
      setMsg('File processed.'); setMsgOk(true);
    } catch (err: any) {
      setMsg(`Couldn't process — backend unreachable. Nothing was processed.`); setMsgOk(false);
    }
  }

  return (
    <main className="container page">
      <h1>Voice Upload</h1>
      {msg ? <p className={msgOk ? 'ok' : 'err'}>{msg}</p> : null}
      <form className="form" onSubmit={upload}>
        <label>Audio file<input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
        <div className="row">
          <button className="btn" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
          <button type="button" className="btn btn-ghost" onClick={process}>Process</button>
        </div>
      </form>
    </main>
  );
}
