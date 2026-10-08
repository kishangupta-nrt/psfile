// Typed env loader — all vendor endpoints come from env, never hard-coded.
// Defaults select mock providers + in-memory queue for local dev.

export interface AppConfig {
  port: number;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  providerSms: string;
  providerWa: string;
  providerVoice: string;
  queueDriver: 'memory' | 'redis';
  smsVendorBase: string;
  smsVendorKey: string;
  smsVendorUser: string;
  smsVendorPassword: string;
  waBaseUrl: string;
  waToken: string;
  waPhoneId: string;
  voiceBaseUrl: string;
  voiceApiKey: string;
  s3Endpoint: string;
  s3Bucket: string;
  smtpHost: string;
  legacyApiBase: string;
  supabaseUrl: string;
  supabaseSecretKey: string;
  supabaseJwksUrl: string;
}

function str(name: string, fallback = ''): string {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

let cached: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (cached) return cached;
  const queueDriverRaw = str('QUEUE_DRIVER', '').toLowerCase();
  const redisUrl = str('REDIS_URL', '');
  const queueDriver: 'memory' | 'redis' =
    queueDriverRaw === 'redis' ? 'redis' : queueDriverRaw === 'memory' ? 'memory' : redisUrl ? 'redis' : 'memory';
  cached = {
    port: Number(str('PORT', '3001')) || 3001,
    databaseUrl: str('DATABASE_URL', ''),
    redisUrl,
    jwtSecret: str('JWT_SECRET', 'dev-only-change-me-32-chars-minimum-123456'),
    jwtRefreshSecret: str('JWT_REFRESH_SECRET', 'dev-only-refresh-change-me-32-chars-min'),
    providerSms: str('PROVIDER_SMS', 'mock').toLowerCase() || 'mock',
    providerWa: str('PROVIDER_WA', 'mock').toLowerCase() || 'mock',
    providerVoice: str('PROVIDER_VOICE', 'mock').toLowerCase() || 'mock',
    queueDriver,
    smsVendorBase: str('SMS_VENDOR_BASE', str('SMS_VENDOR_URL', '')),
    smsVendorKey: str('SMS_VENDOR_KEY', str('SMS_API_KEY', '')),
    smsVendorUser: str('SMS_VENDOR_USER', ''),
    smsVendorPassword: str('SMS_VENDOR_PASSWORD', ''),
    waBaseUrl: str('WA_BASE_URL', str('WA_VENDOR_URL', '')),
    waToken: str('WA_TOKEN', str('WA_API_KEY', '')),
    waPhoneId: str('WA_PHONE_ID', ''),
    voiceBaseUrl: str('VOICE_BASE_URL', str('VOICE_VENDOR_URL', '')),
    voiceApiKey: str('VOICE_API_KEY', str('VOICE_VENDOR_KEY', '')),
    s3Endpoint: str('S3_ENDPOINT', ''),
    s3Bucket: str('S3_BUCKET', 'nrtsms-uploads'),
    smtpHost: str('SMTP_HOST', ''),
    legacyApiBase: str('LEGACY_API_BASE', 'https://ok-go.in/api/'),
    // Supabase (server-only, optional — P8 integration point; empty = disabled).
    supabaseUrl: str('SUPABASE_URL', ''),
    supabaseSecretKey: str('SUPABASE_SECRET_KEY', ''),
    supabaseJwksUrl: str('SUPABASE_JWKS_URL', ''),
  };
  return cached;
}

export function isSupabaseConfigured(): boolean {
  const c = getConfig();
  return Boolean(c.supabaseUrl && c.supabaseSecretKey);
}

// For tests / HMR — reset cache after mutating process.env.
export function resetConfigCache(): void {
  cached = null;
}
