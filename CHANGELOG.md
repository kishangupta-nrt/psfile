# Changelog

All notable changes. Docs updated alongside code per `PROJECT_RULES.md`.

## [2026-09-28] — Discovery + docs-first scaffold
- Static analysis of `app.ok-go.in`: SPA routes (30+), 225 API action→path mappings, auth (`Bearer`, `nrtData`, `/jwt/*`), CASL abilities, Vuexy base.
- Found live `https://ok-go.in/api/*` → 404; rebuild proceeds from mapping; authenticated crawl pending owner HAR.
- Added 21 spec MDs (this set). DLT excluded by decision.
- Scaffold next: `project/backend` (NestJS) + `project/frontend` (Next.js).

## [2026-09-28] — Monorepo scaffold (MVP stubs)
- `project/docker-compose.yml` (api/web/postgres/redis/worker).
- `project/backend`: NestJS TS skeleton (`main.ts` `/api/v1`, Swagger `/api/docs`), `health`, `auth/login|refresh|logout`, `campaigns` create/list/repush/stop, `reports`, DLT 410 block, Prisma schema (no DLT), `.env.example`, Dockerfile.
- `project/frontend`: Next.js 14 (`/authentication` login writing `nrtData`, `/dashboard` parity links), `.env.example`, Dockerfile.
- `project/shared/openapi.json` stub. Verified file tree + JSON parse (44 files).

## [2026-09-28] — Full local replica (mock providers, verified runnable)
- `WEBSITE_MAP.md`: pages/routes, UI components, flows, forms, 225 API mappings, auth/dashboard/admin/integrations from bundle analysis.
- Backend: provider contracts `SmsProvider/WhatsAppProvider/VoiceProvider/WalletProvider` + mock/local impls (`PROVIDER_*=mock`, `QUEUE_DRIVER=memory`), 16 modules, global error filter, DLT 410 block. Fixed `tsconfig` decorators, `tsc` clean, `nest build` ok.
- Frontend: AppShell (sidebar sections + header balance/notifications/search + responsive), auth replica (`Welcome to NRT-SMS!`, Terms + SMS-consent checkbox), `DataTable` (search/filter/pagination), `Modal`, `Toast`, `States` (loading/empty/error), 34 routes incl. scheduled/detailed/export reports, templates, credits, voice/wa, webhooks, profile, admin/kannel. `tsc` clean, `next build` 34 routes ok.
- Verified E2E (mock, no paid keys): `POST /auth/login` → JWT, `POST /campaigns` → queued → worker completed (2/2 delivered), `GET /campaigns` shows completed, `GET /dlt-templates` → 410 DLT_DISABLED, `GET /health` ok.
- Integration TODOs remain behind env (`SMS_VENDOR_*`, `WA_*`, `VOICE_*`); no real vendor connected and none claimed.

## [2026-10-06] — P0 honest local-test states
- `lib/api.ts`: new `isOfflineError()` / `friendlyError()` — network failure vs HTTP error distinguished; messages never claim success on failure.
- Removed false-success paths: `send-sms` no longer toasts `Queued N SMS (demo)` on POST failure; `profile` save, `admin-settings` run, `whatsapp-media` upload use honest error toasts; `voice-upload` / `send-whatsapp` failure banners styled as errors (`p.err`) with `NOT saved/sent` wording.
- New `app/loading.tsx`, `app/error.tsx` (retry), `app/not-found.tsx`; new `app/forgot-password` page; dead `href="#"` link on login now routes to it.
- `TESTING_QA.md`: manual local-test checklist + mock-vs-real matrix.
- Verified: `tsc` clean, backend-down click-through shows offline/error states only.

## [2026-10-06] — Seeded admin password + change-password
- `UsersService`: bcrypt-hashed demo passwords seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` (`admin@local.dev` / `Admin@123`), `RESELLER_PASSWORD`, `CUSTOMER_PASSWORD`; hashes never serialized via `/users`.
- `AuthService.login`: real `bcrypt.compare` check (401 on wrong password) instead of accept-any; returns user + role + abilities + JWT.
- New `POST /api/v1/auth/change-password` (`email, currentPassword, newPassword ≥8 chars`). Verified: login OK → wrong-pw 401 → change → login with new → revert to `Admin@123`.
- `.env.example` + `.env` document the seed vars. Spec updated (`API_SPECIFICATION.md` Auth).

## [2026-09-28] — UI declutter (taglines removed)
- Removed endpoint dumps, “parity” notes, “(live)/(mock offline)” labels, “local-dev” wording, repeated DLT banners, and “(mock)” demo-data suffixes from `project/frontend` UI; deleted unused `components/Nav.tsx`; wired dead header search to `/campaign-report?q=`.
- Offline state now shows a single “Offline demo data.” notice per page. Full removal list: `CLEANUP_LOG.md`.

## [2026-10-06] — DLT exclusion locked
- Backend `DltGuardController` 410 list extended (`template-group*`, `report-by-template-group*`, `summary-report-by-template-group*`); frontend `middleware.ts` redirect matcher extended same; `README.md` 404→410 Gone.
- Verified: zero DLT pages/models/endpoints/nav entries (grep only hits intentional blocks + `dlt: disabled` health flag). `tsc --noEmit` BE+FE clean.
