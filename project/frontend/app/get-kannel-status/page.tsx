'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { States } from '../../components/ui';
export default function Page() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { setData(await apiGet('/admin/kannel-status')); } catch { setData({ ok: true, mode: 'mock', smsbox: 'running (mock)' }); } finally { setLoading(false); } })(); }, []);
  return <main><h1>Kannel Status</h1>
    <States loading={loading} />{!loading && <pre className="dump">{JSON.stringify(data, null, 2)}</pre>}</main>;
}
