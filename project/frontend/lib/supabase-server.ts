// SERVER-ONLY Supabase helper — for Route Handlers / Server Components / middleware.
// NEVER import this file from a 'use client' module: SUPABASE_SECRET_KEY must
// never enter the browser bundle. Currently unused (P8 integration point).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined;

export function isSupabaseServerConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function getSupabaseServer(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  if (!isSupabaseServerConfigured()) {
    cached = null;
    return cached;
  }
  cached = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
  return cached;
}
