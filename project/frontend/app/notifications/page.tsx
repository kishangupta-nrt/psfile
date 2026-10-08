'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
export default function Page() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r: any = await apiGet('/notifications'); setRows(r?.data ?? []); } catch { setRows([{ id: 'n1', title: 'Welcome (mock)', body: 'Replica running on mock providers.' }]); } finally { setLoading(false); } })(); }, []);
  return <main><h1>Notifications</h1><States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['id', 'title', 'body']} rows={rows.map((r: any) => [r.id, r.title, String(r.body ?? '').slice(0, 80)])} />}</main>;
}
