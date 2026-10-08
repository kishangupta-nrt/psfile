# Product Specification

## Vision
Self-serve Bulk SMS/Voice/WhatsApp panel for SMB + resellers under own brand (NRT-SMS), upgraded from PHP to maintainable NestJS/Next.js.

## Personas
1. **End customer** — sends campaigns, manages contacts, views DLR, buys credits.
2. **Reseller** — creates child users, assigns credits/routes/sender-ids, sets pricing/ratio, views user-wise reports.
3. **Admin** — manages campaigns, gateway (Kannel/SMPP), voice files, countries/routes, documents, server commands, rate cards.
4. **API developer** — HTTP API + webhooks + IP whitelist.

## Core journeys (non-DLT)
- Signup → login (`nrtData` + `access_token`) → dashboard → recharge (credit-request) → create phonebook group → import numbers → pick plain sender ID → send SMS (quick/bulk/dynamic/scheduled) → track campaign-report/detailed-report → export.
- Reseller: create user → `user-credit` add → `assign-route-to-user` → monitor `user-wise-monthly-reports`.
- Voice: `voice-upload` → `voice-file-process` → `voice-sms` send → `voice-campaign-list` + stop.
- WhatsApp: pull template → send `wa-send-message` → summary/conversation/template analytics.
- Support: notifications, login-log, tickets (if present), documents upload.

## Non-goals
DLT registration, DLT template approval, DLT group assignment, DLT priority. Any UI referencing DLT removed; deep links redirect to `/dashboard` with toast.

## Success metrics
Parity on 30+ SPA routes and 225 API mappings (minus ~20 DLT ones); login p95 < 800ms; campaign enqueue p95 < 30s/10k; zero credit-mutation without audit row.
