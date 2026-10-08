'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { mockSummary, OFFLINE_NOTE } from '../../lib/mock';
import Card from '../../components/Card';
import { DataTable, Modal, States } from '../../components/ui';
import { useToast } from '../../components/Toast';

export default function DashboardPage() {
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const [dlr, setDlr] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        try { setData(await apiGet('/dashboard/summary')); }
        catch { setData(await apiGet('/dashboard')); }
      } catch (e: any) { setOffline(true); setError(''); setData(mockSummary); }
      finally { setLoading(false); }
    })();
  }, []);
  const balance = data?.wallet?.balance ?? data?.balance ?? 0;
  const total = data?.campaigns?.total ?? 0;
  const delivered = data?.delivered?.delivered ?? 0;
  const recent = data?.recentCampaigns ?? data?.recent ?? [];
  return (
    <main>
      <div className="row between"><h1>Dashboard</h1><span className="pill">● gateway: {offline ? 'mock' : 'live'}</span></div>
      <p className="muted">Balance, submissions and delivery.</p>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      <States loading={loading} error={error} />
      {!loading && (<>
        <div className="grid">
          <Card title="Credit balance" value={String(balance)} sub="wallet.balance" />
          <Card title="Campaigns" value={String(total)} sub="campaigns.total" />
          <Card title="Delivered" value={String(delivered)} sub="delivery total" />
          <Card title="Queue" value={offline ? 'mock' : 'live'} sub="sms-send worker" />
        </div>
        <h2>Recent campaigns</h2>
        <DataTable columns={['id', 'message', 'status', 'total', 'delivered', '']} rows={recent.map((c: any) => [c.id, String(c.message).slice(0, 50), c.status, c.total, c.delivered, 'view'])} />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={() => { setDlr({ code: 'DELIVRD', text: 'Message delivered to handset (mock explanation).' }); push('info', 'DLR explanation opened.'); }}>What does DELIVRD mean?</button>
        </div>
        <Modal open={!!dlr} title="DLR explanation" onClose={() => setDlr(null)}>
          <p><b>{dlr?.code}</b></p><p>{dlr?.text}</p>
          <p className="muted small">Delivery status codes and their meaning.</p>
        </Modal>
      </>)}
    </main>
  );
}
