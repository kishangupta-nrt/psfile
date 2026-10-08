'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { DataTable, States } from '../../components/ui';
export default function DetailedReportPage() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState('');
  async function load() { setLoading(true); try { const r: any = await apiGet(`/reports/detailed${mobile ? `?mobile=${mobile}` : ''}`); setRows(r?.data ?? []); } catch { setRows([{ id: 'msg_1', mobile: '919999999901', status: 'delivered', dlr: 'DELIVRD' }]); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  return <main><h1>Detailed Report</h1>
    <div className="row toolbar"><input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Filter by mobile…" /><button className="btn btn-sm" onClick={load}>Apply</button></div>
    <States loading={loading} empty={!loading && !rows.length} />
    {!loading && <DataTable columns={['id', 'mobile', 'status', 'dlr']} rows={rows.map((r: any) => [r.id, r.mobile, r.status, r.dlr ?? r.dlrCode])} />}</main>;
}
