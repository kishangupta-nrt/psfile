'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../components/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('sms@nrt.co.in');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr('Enter a valid email address.'); return; }
    if (password.length < 4) { setErr('Password must be at least 4 characters.'); return; }
    setBusy(true); setErr('');
    try {
      await login(email, password);
      push('ok', 'Welcome to NRT-SMS!');
      router.push('/dashboard');
    } catch (e: any) { const m = e?.message || 'Login failed'; setErr(m); push('err', m); }
    finally { setBusy(false); }
  }
  return (
    <div className="auth-wrap">
      <div className="auth-left"><div className="auth-card">
        <div style={{ fontWeight: 800, fontSize: 20 }}>NRT-SMS</div>
        <h2>Welcome to NRT-SMS! 👋</h2>
        <p className="muted">Please log-in to your account and start the adventure</p>
        <form onSubmit={submit} className="form" style={{ marginTop: 12 }}>
          <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="sms@nrt.co.in" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" /></label>
          {err && <div className="state error">{err}</div>}
          <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
          <div className="row between"><Link href="/register-user" className="small">Create account</Link><Link href="/forgot-password" className="small">Forgot password?</Link></div>
          <p className="muted small"><Link href="/whatsapp-policy">Terms and Conditions</Link> and Privacy Policy apply. Local replica — credentials stay in your browser + your own backend only.</p>
        </form>
      </div></div>
      <div className="auth-right"><div className="art"><h2>Bulk SMS • Voice • WhatsApp</h2><p>Send campaigns, manage contacts, track delivery reports and handle credits from one panel.</p></div></div>
    </div>
  );
}
