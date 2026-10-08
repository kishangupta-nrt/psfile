'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE } from './api';

export interface Ability {
  action: string;
  resource: string;
}

export interface NrtUser {
  email?: string;
  id?: string;
  sub?: string;
  role?: string;
  [k: string]: unknown;
}

export interface NrtData {
  access_token?: string;
  user?: NrtUser | null;
  abilities?: Ability[];
  [k: string]: unknown;
}

interface AuthCtx {
  nrtData: NrtData | null;
  user: NrtUser | null;
  token: string | null;
  abilities: Ability[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<NrtData>;
  logout: () => void;
  can: (action: string) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

function readStored(): NrtData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('nrtData');
    return raw ? (JSON.parse(raw) as NrtData) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [nrtData, setNrtData] = useState<NrtData | null>(null);

  useEffect(() => {
    setNrtData(readStored());
  }, []);

  const persist = (d: NrtData | null) => {
    setNrtData(d);
    try {
      if (!d) localStorage.removeItem('nrtData');
      else localStorage.setItem('nrtData', JSON.stringify(d));
    } catch {
      /* ignore */
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body?.message || `Login failed (HTTP_${res.status})`);
    }
    const next: NrtData = body as NrtData;
    persist(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    const token = readStored()?.access_token;
    // Best-effort backend logout; never block local logout.
    try {
      if (token) {
        fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => undefined);
      }
    } catch {
      /* ignore */
    }
    persist(null);
  }, []);

  const can = useCallback(
    (action: string) => {
      const abs = nrtData?.abilities ?? [];
      if (!abs.length) return true; // permissive when backend omits abilities
      return abs.some((a) => a.action === action || a.action === '*' || a.resource === 'all');
    },
    [nrtData],
  );

  const value = useMemo<AuthCtx>(
    () => ({
      nrtData,
      user: (nrtData?.user as NrtUser) ?? null,
      token: nrtData?.access_token ?? null,
      abilities: nrtData?.abilities ?? [],
      isLoggedIn: Boolean(nrtData?.access_token),
      login,
      logout,
      can,
    }),
    [nrtData, login, logout, can],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
