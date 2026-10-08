'use client';
import { useMemo, useState } from 'react';
export function States({ loading, error, empty, onRetry }: { loading?: boolean; error?: string; empty?: boolean; onRetry?: () => void }) {
  if (loading) return <div className="state"><div className="spinner" />Loading…</div>;
  if (error) return <div className="state error">⚠ {error} <button className="btn btn-sm btn-ghost" onClick={onRetry}>Retry</button></div>;
  if (empty) return <div className="state">No records found. Try adjusting filters or import data.</div>;
  return null;
}
export function DataTable({ columns, rows, searchKeys, initialQuery = '' }: { columns: string[]; rows: any[][]; searchKeys?: number[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const per = 10;
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => r.some((c, i) => {
      if (searchKeys && !searchKeys.includes(i)) return false;
      return String(c ?? '').toLowerCase().includes(needle);
    }));
  }, [q, rows, searchKeys]);
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * per, cur * per);
  return (
    <div>
      <div className="row toolbar"><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search…" className="search-input" /><span className="muted small">{filtered.length} rows</span></div>
      <div className="table-wrap"><table className="table"><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{slice.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{String(c ?? '')}</td>)}</tr>)}</tbody></table></div>
      {slice.length === 0 && <div className="state">No records found.</div>}
      <div className="row pager"><button className="btn btn-sm btn-ghost" disabled={cur <= 1} onClick={() => setPage(cur - 1)}>Prev</button><span className="muted small">Page {cur}/{pages}</span><button className="btn btn-sm btn-ghost" disabled={cur >= pages} onClick={() => setPage(cur + 1)}>Next</button></div>
    </div>
  );
}
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="modal-back" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="row between"><h3>{title}</h3><button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button></div>{children}</div></div>;
}
