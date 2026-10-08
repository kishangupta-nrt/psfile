'use client';

// Browser Supabase client — PUBLIC key only. Disabled (null) when env absent,
// so local dev works with zero Supabase configuration.
// NEVER reference SUPABASE_SECRET_KEY here — it must not enter the browser bundle.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  if (!isSupabaseConfigured()) {
    cached = null;
    return cached;
  }
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return cached;
}
