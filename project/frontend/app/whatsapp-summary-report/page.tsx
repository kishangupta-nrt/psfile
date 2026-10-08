'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
export default function Page() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r: any = await apiGet('/whatsapp/summary'); setRows(r?.data ?? []); } catch { setRows([{ template: 'hello_world (mock)', sent: 120, delivered: 115 }]); } finally { setLoading(false); } })(); }, []);
  return <main><h1>WhatsApp Summary Report</h1><States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['template', 'sent', 'delivered']} rows={rows.map((r: any) => [r.template, r.sent, r.delivered])} />}</main>;
}
