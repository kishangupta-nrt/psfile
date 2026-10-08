'use client';
import { createContext, useCallback, useContext, useState } from 'react';
type Toast = { id: number; kind: 'ok' | 'err' | 'info'; text: string };
const Ctx = createContext<{ push: (kind: Toast['kind'], text: string) => void }>({ push: () => {} });
let seq = 1;
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [, setTick] = useState(0);
  const push = useCallback((kind: Toast['kind'], text: string) => {
    (window as any).__toasts = [...((window as any).__toasts || []), { id: seq++, kind, text }];
    setTick((t) => t + 1);
    setTimeout(() => { (window as any).__toasts = ((window as any).__toasts || []).slice(1); setTick((t) => t + 1); }, 3500);
  }, []);
  return <Ctx.Provider value={{ push }}>{children}</Ctx.Provider>;
}
export const useToast = () => useContext(Ctx);
export function ToastHost() {
  const items: Toast[] = typeof window !== 'undefined' ? (window as any).__toasts || [] : [];
  return <div className="toasts">{items.map((t) => <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>)}</div>;
}
