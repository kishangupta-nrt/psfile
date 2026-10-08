'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, friendlyError } from '../../lib/api';
import { OFFLINE_NOTE } from '../../lib/mock';
import { DataTable, States } from '../../components/ui';
import { useToast } from '../../components/Toast';
export default function Page() {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [offline, setOffline] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  async function load() { setLoading(true); try { const r: any = await apiGet('/whatsapp/media'); setRows(r?.data ?? []); } catch { setRows([]); setOffline(true); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function up(e: React.FormEvent) { e.preventDefault(); if (!file) { push('err', 'Choose a file first.'); return; } const fd = new FormData(); fd.append('file', file); try { await apiPost('/whatsapp/media', fd); push('ok', 'Media uploaded.'); load(); } catch (er: any) { push('err', friendlyError(er, 'Upload media')); } }
  return <main><h1>Whatsapp Media</h1>{offline && <p className="muted">{OFFLINE_NOTE}</p>}<form onSubmit={up} className="form"><div className="row"><input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><button className="btn btn-sm">Upload</button></div></form>
    <States loading={loading} empty={!loading && !rows.length} />{!loading && rows.length > 0 && <DataTable columns={['id', 'name', 'url']} rows={rows.map((r: any) => [r.id, r.name, r.url])} />}</main>;
}
