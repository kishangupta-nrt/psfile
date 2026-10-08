'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
export default function Page() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r: any = await apiGet('/wallet/user-credit-report'); setRows(r?.data ?? []); } catch { setRows([{ user: 'sms@nrt.co.in (mock)', balance: 1250.5, used: 300 }]); } finally { setLoading(false); } })(); }, []);
  return <main><h1>User Credit Report</h1><States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['user', 'balance', 'used']} rows={rows.map((r: any) => [r.user, r.balance, r.used])} />}</main>;
}
