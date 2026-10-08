'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { mockWhatsapp, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function WhatsappReportPage() {
  const [rows, setRows] = useState<any[]>(mockWhatsapp);
  const [analytics, setAnalytics] = useState<any>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const live = await apiGet<any>('/whatsapp/campaigns');
        const list = Array.isArray(live) ? live : live?.data ?? [];
        if (list.length) setRows(list);
        try {
          const a = await apiGet<any>('/whatsapp/analytics');
          setAnalytics(a);
        } catch {
          /* analytics optional */
        }
        setOffline(false);
      } catch {
        setOffline(true);
        setRows(mockWhatsapp);
      }
    })();
  }, []);

  return (
    <main className="container page">
      <h1>WhatsApp Message Report</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {analytics ? <pre className="dump">{JSON.stringify(analytics, null, 2)}</pre> : null}
      <Table
        columns={['id', 'to', 'template', 'status']}
        rows={rows.map((r: any) => [r.id, r.to ?? r.mobile ?? '', r.template ?? '', r.status ?? ''])}
      />
    </main>
  );
}
