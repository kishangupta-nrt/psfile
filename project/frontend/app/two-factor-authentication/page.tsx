'use client';
import { useState } from 'react';
export default function Page() {
  const [code, setCode] = useState('');
  return <div className="auth-wrap"><div className="auth-left"><div className="auth-card">
    <h2>Two-factor authentication</h2><p className="muted">Enter the 6-digit code from your authenticator app.</p>
    <form className="form" onSubmit={(e) => e.preventDefault()}><label>6-digit code<input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" /></label><button className="btn">Verify (mock)</button></form>
  </div></div><div className="auth-right"><div className="art"><h2>Extra security</h2><p>Real TOTP wiring is a TODO behind env; mock accepts any code locally.</p></div></div></div>;
}
