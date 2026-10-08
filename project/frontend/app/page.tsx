'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    try {
      const raw = localStorage.getItem('nrtData');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.access_token) router.replace('/dashboard');
      else router.replace('/authentication');
    } catch {
      router.replace('/authentication');
    }
  }, [router]);
  return (
    <main className="container">
      <p className="muted">Redirecting…</p>
    </main>
  );
}
