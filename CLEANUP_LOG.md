# Cleanup Log — removed taglines, dev details & dead code

Date: 2026-09-28. Scope: `project/frontend` UI. Behavior preserved unless noted.
Scope facts (DLT exclusion, API contracts) remain in spec docs and API responses.

## Deleted files
- `project/frontend/components/Nav.tsx` — legacy topnav, unimported anywhere (shell uses `AppShell` + `Sidebar` + `Header`).

## Endpoint dumps removed from page subtitles (info belongs in docs, not UI)
- `app/dashboard/page.tsx` — “Balance, submissions, delivery — parity with legacy overview.”
- `app/send-sms/page.tsx` — “Quick / bulk / scheduled — parity with legacy send-sms.”
- `app/campaigns/page.tsx` — “GET /campaigns.”
- `app/campaign-report/page.tsx` — “GET /reports/campaigns with filter.”
- `app/contacts/page.tsx` — “GET/POST /contacts/groups + numbers.”
- `app/blacklist/page.tsx` — “GET/POST/DELETE /blacklist.”
- `app/sender-list/page.tsx` — “GET/POST /senders.”
- `app/users-list/page.tsx` — “GET/POST /users.”
- `app/credits/page.tsx` — “GET /wallet/balance + GET /wallet/txns.”
- `app/credit-request/page.tsx` — “POST/GET /wallet/credit-requests.”
- `app/voice-sms/page.tsx` — “POST /voice/campaigns/send + GET /voice/campaigns.”
- `app/voice-upload/page.tsx` — “POST /voice/uploads (multipart) + POST /voice/process. Mock fallback offline.”
- `app/send-whatsapp/page.tsx` — “POST /whatsapp/send + POST /whatsapp/campaigns. Mock fallback offline.”
- `app/whatsapp-message-report/page.tsx` — “GET /whatsapp/campaigns + GET /whatsapp/analytics.”
- `app/api-documentation/page.tsx` — “GET /api-docs (static fallback) + API key rotate UI. Keys are mock offline.” → replaced with “Endpoints and API keys.”
- `app/admin-manage-campaign/page.tsx` — “GET /admin/kannel-status + POST /admin/manage-campaign + POST /admin/server-commands.”
- `app/scheduled-campaign-report/page.tsx` — “Filters + search + pagination parity.”
- `app/detailed-report/page.tsx` — “Per-message DLR parity (GET /reports/detailed, /reports/by-mobile, /reports/delivery).”
- `app/export-report/page.tsx` — “Parity: export-* → export-status/:id → download-export/:id.”
- `app/get-kannel-status/page.tsx` — “Parity: /get-kannel-status → administration/get-current-kannel-status.”
- `app/webhooks/page.tsx` — “Outbound DLR/campaign events — parity with add-webhook-url.” → replaced with “Outbound delivery and campaign events.”
- `app/notification-template/page.tsx` — “Plain templates only — DLT excluded.”
- `app/register-user/page.tsx` — “Parity route: /register-user”.
- `app/two-factor-authentication/page.tsx` — “Parity route: /two-factor-authentication (TOTP stub).” → replaced with “Enter the 6-digit code from your authenticator app.”
- `app/whatsapp-policy/page.tsx` — “Parity route: /whatsapp-policy (static replica).” + “NRT-SMS local replica.” prefix + DLT sentence.
- `app/dashboard/page.tsx` (DLR modal) — “Live parity: GET /dlr/explain/:code” → replaced with “Delivery status codes and their meaning.”
- `app/authentication/page.tsx` (right panel) — replica-vs-original explanation paragraph + “DLT excluded by design (DLT_DISABLED).” → replaced with one product line.
- `components/Sidebar.tsx` — “DLT / Removed by design (DLT_DISABLED).” section (DLT block behavior unchanged: backend 410 + middleware redirect).
- `app/layout.tsx` metadata — “(local-dev)” / “Local-dev frontend…” wording.
- `lib/api.ts` header comment — “Local-dev” wording.

## Status-message labels simplified (kept meaning, dropped jargon + JSON dumps)
- All `X (live): <json>` confirmations → plain confirmations (“Group created.”, “Message sent.”, “API key created.”, admin “Done:” / “Output:”).
- All `X (mock offline): …` failures → “Couldn't … — offline demo data.”
- Toasts: “Queued N SMS (mock fallback)” → “Queued N SMS (demo)”; kept short “(demo)/(live)” qualifier on send-SMS confirmation.
- `app/campaign-report/page.tsx` — dropped “— showing mock.” suffix.
- `app/admin-manage-campaign/page.tsx` — kept command output (functional), dropped prefixes.
- `app/voice-upload/page.tsx` — offline accept reworded to “Upload saved locally (demo).”
- `app/export-report/page.tsx` — “export id: … (mock)” → “Export ID: …”.
- `app/api-documentation/page.tsx` — default key label “local-dev key” → “Default key”; fallback key “mock key / nrt_mock” → “Demo key / nrt_demo”.

## Demo-data labels cleaned (`lib/mock.ts`; offline pill now signals demo state)
- “Hello (mock)” → “Hello”, “Offer (mock)” → “Welcome offer”, “OTP test (mock)” → “OTP test”, “Family (mock)” → “Family”, “Staff (mock)” → “Staff”, “mock opt-out” → “Opt-out request”, “promo.mp3 (mock)” → “promo.mp3”, “hello_world (mock)” → “hello_world”, “topup (mock)” → “Top-up”, kannel “(mock)” suffixes + “Backend unreachable…” note removed.
- `OFFLINE_NOTE` shortened to “Offline demo data.” (shown only when backend unreachable).

## Fixed (not removed)
- Header search input was dead — now submits to `/campaign-report?q=…`; report page applies it as initial table search.

## Kept intentionally
- Single “Offline demo data.” notice per page (required: distinguishes demo from live data).
- Backend `410 DLT_DISABLED` response + middleware DLT redirect (functional scope guard, no UI text).
- `DLT_DISABLED` in backend code/docs; DLT scope statements in spec MDs.
