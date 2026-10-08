'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
export default function Page() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r: any = await apiGet('/voice/campaigns'); setRows(r?.data ?? []); } catch { setRows([{ id: 'vcp_1', file: 'promo.mp3 (mock)', status: 'completed', total: 50 }]); } finally { setLoading(false); } })(); }, []);
  return <main><h1>Voice Report</h1><States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['id', 'file', 'status', 'total']} rows={rows.map((r: any) => [r.id, r.file, r.status, r.total])} />}</main>;
}
