'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';

export default function SendWhatsappPage() {
  const [to, setTo] = useState('919999999901');
  const [template, setTemplate] = useState('hello_world');
  const [body, setBody] = useState('Hello from NRT-SMS');
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/whatsapp/send', { to, template, body });
      setMsg('Message sent.'); setMsgOk(true);
    } catch (err: any) {
      setMsg(`Couldn't send — backend unreachable. Nothing was sent.`); setMsgOk(false);
    }
  }

  async function campaign() {
    try {
      const res = await apiPost('/whatsapp/campaigns', { template, message: body, mobiles: [to] });
      setMsg('Campaign sent.'); setMsgOk(true);
    } catch (err: any) {
      setMsg(`Couldn't send campaign — backend unreachable. Nothing was sent.`); setMsgOk(false);
    }
  }

  return (
    <main className="container page">
      <h1>Send WhatsApp</h1>
      {msg ? <p className={msgOk ? 'ok' : 'err'}>{msg}</p> : null}
      <form className="form" onSubmit={submit}>
        <label>To<input value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <label>Template<input value={template} onChange={(e) => setTemplate(e.target.value)} /></label>
        <label>Body<textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} /></label>
        <div className="row">
          <button className="btn">Send message</button>
          <button type="button" className="btn btn-ghost" onClick={campaign}>Send as campaign</button>
        </div>
      </form>
    </main>
  );
}
