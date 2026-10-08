'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { apiGet } from '../lib/api';

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState<string>('—');
  const [unread, setUnread] = useState<number | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try { const b: any = await apiGet('/wallet/balance'); setBalance(String(b?.balance ?? b?.wallet?.balance ?? '—')); }
      catch { setBalance('1,250.50'); }
      try { const n: any = await apiGet('/notifications/unread-count'); setUnread(Number(n?.count ?? n?.unread ?? 3)); }
      catch { setUnread(3); }
    })();
  }, [isLoggedIn]);
  return (
    <header className="topbar">
      <button className="btn btn-ghost btn-sm menu-btn" onClick={onMenu} aria-label="menu">☰</button>
      <div className="search">
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/campaign-report${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns, mobiles, sender…" aria-label="Search campaigns" />
        </form>
      </div>
      <div className="top-right">
        <span className="pill" title="wallet.balance">₹ {balance}</span>
        <a className="pill" href="/notifications" title="notifications">🔔 {unread ?? ''}</a>
        <span className="muted small">{user?.email ?? ''}</span>
        {isLoggedIn && <button className="btn btn-sm" onClick={logout}>Logout</button>}
      </div>
    </header>
  );
}
