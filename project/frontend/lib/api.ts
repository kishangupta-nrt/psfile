// API wrapper for the NestJS backend.
// Base URL comes from NEXT_PUBLIC_API_BASE, default http://localhost:3001/api/v1.
// No external credentials. No hard-coded vendor endpoints.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(shape: ApiErrorShape) {
    super(shape.message || 'API error');
    this.name = 'ApiError';
    this.code = shape.code || 'API_ERROR';
    this.status = shape.status ?? 500;
    this.details = shape.details;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('nrtData');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.access_token ?? null;
  } catch {
    return null;
  }
}

function buildHeaders(initHeaders?: HeadersInit, isForm = false): Headers {
  const h = new Headers(initHeaders);
  if (!isForm && !h.has('Content-Type')) h.set('Content-Type', 'application/json');
  const token = getToken();
  if (token && !h.has('Authorization')) h.set('Authorization', `Bearer ${token}`);
  return h;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    headers: buildHeaders(init.headers, isForm),
    cache: 'no-store',
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const shape: ApiErrorShape = {
      code: data?.code || `HTTP_${res.status}`,
      message: data?.message || res.statusText || 'Request failed',
      details: data?.details ?? data?.error ?? data,
      status: res.status,
    };
    throw new ApiError(shape);
  }
  return data as T;
}

export const apiGet = <T>(path: string, init?: RequestInit) =>
  api<T>(path, { ...init, method: 'GET' });

export const apiPost = <T>(path: string, body?: unknown, init?: RequestInit) =>
  api<T>(path, {
    ...init,
    method: 'POST',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiPatch = <T>(path: string, body?: unknown, init?: RequestInit) =>
  api<T>(path, {
    ...init,
    method: 'PATCH',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiDelete = <T>(path: string, init?: RequestInit) =>
  api<T>(path, { ...init, method: 'DELETE' });

// True when fetch itself threw (network down / backend unreachable) rather
// than the backend returning an HTTP error. Use to distinguish "nothing was
// saved" from "backend rejected the request" in UI error states.
export function isOfflineError(e: unknown): boolean {
  return !(e instanceof ApiError);
}

// Honest user-facing message: never claim success when the request failed.
export function friendlyError(e: unknown, action: string): string {
  if (isOfflineError(e)) return `${action} failed — backend unreachable. Nothing was saved.`;
  return (e as Error)?.message || `${action} failed.`;
}
