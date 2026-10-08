'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, friendlyError } from '../../lib/api';
import { States } from '../../components/ui';
import { useToast } from '../../components/Toast';
export default function Page() {
  const { push } = useToast();
  const [cfg, setCfg] = useState<any>({}); const [loading, setLoading] = useState(true);
  const [cmd, setCmd] = useState('');
  useEffect(() => { (async () => { try { setCfg(await apiGet('/admin/settings')); } catch { setCfg({ appName: 'NRT-SMS (mock)', timezone: 'Asia/Kolkata' }); } finally { setLoading(false); } })(); }, []);
  async function run(e: React.FormEvent) { e.preventDefault(); try { const r: any = await apiPost('/admin/server-commands', { cmd }); push('ok', String(r?.output ?? 'Command accepted.')); } catch (er: any) { push('err', friendlyError(er, 'Run command')); } }
  return <main><h1>Admin Settings</h1><States loading={loading} />
    {!loading && (<><pre className="dump">{JSON.stringify(cfg, null, 2)}</pre>
    <h2>Server commands (allowlisted)</h2><form onSubmit={run} className="form"><div className="row"><input value={cmd} onChange={(e) => setCmd(e.target.value)} placeholder="status" style={{ flex: 1 }} /><button className="btn btn-sm">Run</button></div></form></>)}</main>;
}
