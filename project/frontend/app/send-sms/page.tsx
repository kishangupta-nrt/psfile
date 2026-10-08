'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, friendlyError } from '../../lib/api';
import { mockSenders, OFFLINE_NOTE } from '../../lib/mock';
import { States } from '../../components/ui';
import { useToast } from '../../components/Toast';

function segCount(msg: string) { const uni = /[^\x00-\x7F]/.test(msg); const per = uni ? 70 : 160; return { per, parts: Math.max(1, Math.ceil(msg.length / per)), uni }; }
export default function SendSmsPage() {
  const { push } = useToast();
  const [senders, setSenders] = useState<any[]>(mockSenders);
  const [sender, setSender] = useState('NRTINF');
  const [mobiles, setMobiles] = useState('919999999901\n919999999902');
  const [message, setMessage] = useState('Hello from NRT-SMS.');
  const [schedule, setSchedule] = useState('');
  const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true); const [offline, setOffline] = useState(false);
  useEffect(() => { (async () => {
    try { const s: any = await apiGet('/senders'); setSenders(s?.data ?? s ?? mockSenders); }
    catch { setOffline(true); }
    finally { setLoading(false); }
  })(); }, []);
  const seg = segCount(message);
  const count = mobiles.split(/[\s,;]+/).filter(Boolean).length;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const list = mobiles.split(/[\s,;]+/).map((m) => m.trim()).filter(Boolean);
    if (!list.length) { push('err', 'Add at least one mobile number.'); return; }
    if (!message.trim()) { push('err', 'Message cannot be empty.'); return; }
    setBusy(true);
    try { const r: any = await apiPost('/campaigns', { senderId: sender, message, mobiles: list, scheduledAt: schedule || undefined }); push('ok', `Queued ${r?.queued ?? list.length} SMS.`); }
    catch (e: any) { push('err', friendlyError(e, 'Queue SMS')); }
    finally { setBusy(false); }
  }
  return <main><h1>Send SMS</h1>
    {offline && <p className="muted">{OFFLINE_NOTE}</p>}
    <States loading={loading} />
    {!loading && <form onSubmit={submit} className="form">
      <div className="row"><label style={{ flex: 1 }}>Sender ID<select value={sender} onChange={(e) => setSender(e.target.value)}>{senders.map((s: any) => <option key={s.id ?? s.senderId} value={s.senderId ?? s.sender}>{s.senderId ?? s.sender} ({s.status})</option>)}</select></label>
      <label>Schedule (optional)<input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} /></label></div>
      <label>Mobiles (one per line)<textarea rows={4} value={mobiles} onChange={(e) => setMobiles(e.target.value)} /></label>
      <label>Message<textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
      <div className="row between"><span className="muted small">{message.length} chars • {seg.parts} part(s) • {seg.uni ? 'Unicode (70/part)' : 'GSM (160/part)'} • {count} recipients ≈ {count * seg.parts} credits</span><button className="btn" disabled={busy}>{busy ? 'Queueing…' : schedule ? 'Schedule' : 'Send now'}</button></div>
    </form>}</main>;
}
