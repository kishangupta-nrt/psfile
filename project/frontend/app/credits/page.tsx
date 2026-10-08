'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { mockBalance, mockTxns, OFFLINE_NOTE } from '../../lib/mock';
import Card from '../../components/Card';
import Table from '../../components/Table';

export default function CreditsPage() {
  const [balance, setBalance] = useState<any>(mockBalance);
  const [txns, setTxns] = useState<any[]>(mockTxns);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const b = await apiGet<any>('/wallet/balance');
        setBalance(b?.balance ?? b);
        const t = await apiGet<any>('/wallet/txns');
        const list = Array.isArray(t) ? t : t?.data ?? t?.txns ?? [];
        if (list.length) setTxns(list);
        setOffline(false);
      } catch {
        setOffline(true);
        setBalance(mockBalance);
        setTxns(mockTxns);
      }
    })();
  }, []);

  return (
    <main className="container page">
      <h1>Credits</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      <div className="grid">
        <Card title="Balance" value={String((balance as any)?.balance ?? balance)} sub={(balance as any)?.currency ?? 'credits'} />
        <Card title="Transactions" value={txns.length} sub="recent count" />
      </div>
      <Table
        columns={['id', 'type', 'amount', 'note']}
        rows={txns.map((t: any) => [t.id ?? '', t.type ?? '', t.amount ?? '', (t.note ?? '').toString().slice(0, 60)])}
      />
    </main>
  );
}
