'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../lib/api';
import { useToast } from '../../components/Toast';
export default function RegisterPage() {
  const router = useRouter(); const { push } = useToast();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setErr('Please accept Terms and SMS consent to continue.'); return; }
    setBusy(true); setErr('');
    try { await apiPost('/auth/register', { name, email, password }); push('ok', 'Account created — please log in.'); router.push('/authentication'); }
    catch (e: any) { const m = e?.message || 'Registration failed (backend may be offline)'; setErr(m); push('err', m); }
    finally { setBusy(false); }
  }
  return <div className="auth-wrap"><div className="auth-left"><div className="auth-card">
    <div style={{ fontWeight: 800, fontSize: 20 }}>NRT-SMS</div>
    <h2>Create your account</h2>
    <form onSubmit={submit} className="form" style={{ marginTop: 12 }}>
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label className="check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I hereby authorize to receive notifications via SMS, messages, and promotional/informational communications. I accept <Link href="/whatsapp-policy">Terms and Conditions</Link> and Privacy Policy. *</span></label>
      {err && <div className="state error">{err}</div>}
      <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
      <Link href="/authentication" className="small">Back to login</Link>
    </form></div></div>
    <div className="auth-right"><div className="art"><h2>Start the adventure</h2><p>Local replica with mock providers. No paid keys required.</p></div></div></div>;
}
