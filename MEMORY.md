# MEMORY.md — NRT-SMS Clone: persistent build memory

> **Purpose:** single source of truth for what is DONE vs PARTIAL vs TODO, so work resumes correctly.
> **Rule (mandatory):** every code change MUST update this file in the same commit/PR:
> 1. Flip the row status in §3/§4/§5/§6.
> 2. Append a line to §8 Change Log (date + files + result + test command).
> 3. Update spec MDs + `CHANGELOG.md` per `PROJECT_RULES.md`.
>
> **Status legend:** `TODO` = not started · `PARTIAL` = page exists but content/functions/buttons incomplete or mock-only · `WIRED` = live backend call, no mock fallback for writes · `TESTED` = verified locally with commands in §7 (mock or real noted).
> **No false-done:** a page is DONE only when content + functions + buttons from scope exist AND are wired AND tested locally. A route file existing is NOT done.

**Stack lock:** NestJS 10 + Next.js 14 App Router, Postgres 16 + Prisma, Redis 7 + BullMQ. Prefix `/api/v1`, Bearer JWT, `nrtData.access_token`. DLT fully excluded → `410 DLT_DISABLED`. No secrets in repo.

**Last updated:** 2026-10-06 · State: **mock-demo-only, NOT integration-ready** (see §2).

---

## 1. How to resume work

1. Read this file top-to-bottom (§2 status, then first `TODO`/`PARTIAL` row in §3).
2. Read `LOCAL_FIX_PLAN.md` phase for that row (file-by-file fix).
3. Implement → run §7 verify commands → update row to `WIRED`/`TESTED` → log in §8.
4. Never claim success on backend-down; UI must show `backend unreachable. Nothing was saved.` via `lib/api.ts:friendlyError`.

**Key paths:**
- Frontend pages: `project/frontend/app/<kebab-route>/page.tsx`, shared `components/AppShell|Sidebar|Header|Table|ui|Toast.tsx`, `lib/api.ts|auth.tsx|mock.ts`, `middleware.ts`, `next.config.js`
- Backend: `project/backend/src/modules/<domain>/*.controller|service.ts`, `src/common/auth/*`, `src/queue/*`, `src/providers/*`, `prisma/schema.prisma|seed.ts`, `project/shared/openapi.json`, `project/docker-compose.yml`

---

## 2. Global status snapshot (2026-10-06 audit)

| Area | State | Evidence / blocker |
|---|---|---|
| Backend boot | PARTIAL | `main.ts` prefix+pipe ok, no helmet/throttler, `CORS origin:true`, guards exist but `APP_GUARD` not registered (`app.module.ts`) → all routes public |
| DB persistence | TODO | `schema.prisma` 17 models, missing 9 (`VoiceFile,WaTemplate,WaCampaign,EmailCampaign,Invoice,Country,Route,UserRoute,AppSetting` + `RefreshToken,IpWhitelist`); zero `migrations/`; `seed.ts` only `console.log` |
| Auth | PARTIAL | `POST login/change-password/refresh/logout` real bcrypt (cost 10, need 12); missing `register,child-login,PATCH me/password,2FA,IP-guard,refresh-rotation` |
| API coverage | ~60% | ~40% endpoints missing, 4 path renames, `openapi.json` 2 paths; full gap table in `LOCAL_FIX_PLAN.md §1.6` |
| Validation | TODO | Zero `*.dto.ts`, no E.164/blacklist/segmentation; `campaigns.service` debits `1/mobile` flat |
| Queue/worker | PARTIAL | `QueueService` memory+lazy BullMQ ok; `worker.ts` idle `TODO BullMQ wiring pending` |
| Providers | MOCK-ONLY | `mock-sms/wa/voice` + `local-wallet` in-memory; `PROVIDER_*=mock`, `QUEUE_DRIVER=memory` → reset on restart by design |
| Frontend routes | PARTIAL 34/60 | 34 `page.tsx` exist, all `'use client'` CSR + `try/catch→mock.ts`; ~26 scope routes missing (see §3) |
| Frontend honesty | PARTIAL | P0 `isOfflineError/friendlyError`, `loading/error/not-found/forgot-password` done; writes still fall back to mock on ~20 pages; `export-report` shows `exp_demo_1` no polling |
| Design system | PARTIAL | Hand CSS (no Tailwind/shadcn), no charts, no timezone picker, single-tab send, no import wizards, no DLR modal |
| SEO | TODO | Only root title/desc + `main/h1`; no sitemap/robots/manifest/OG/JSON-LD/per-route metadata |
| Perf | TODO | No `next/image|font|dynamic`, no RSC/SSG, client `per=10` tables, `dev` server in Docker |
| Security | TODO | No helmet/rate-limit/HMAC/CIDR/2FA, bcrypt 10, verbose logs, committed `.env` secrets |
| Tests | TODO | `supertest/ts-node` missing, `jest --passWithNoTests` vacuous, zero unit, no Playwright/k6 |
| Infra | PARTIAL | Compose 5/7 services (missing `kannel-mock,nginx`), no healthcheck/migrate, weak Dockerfiles |

---

## 3. Frontend page tracker — content + functions + buttons + wiring + test

> Scope source: `WEBSITE_MAP.md §1`, `FEATURES.md`, `UI_UX_DESIGN.md`, `FRONTEND_SPECIFICATION.md`.
> Each row = scope-required inner content, NOT just route file. Update `FE` + `Wired to` + `Test` on every change.

### 3.1 Public / auth

| Route / file | Scope content · functions · buttons | FE | Wired to (backend) | Test |
|---|---|---|---|---|
| `/authentication` → `app/authentication/page.tsx` | Split auth layout; email+password form; validation errors; Login button; link → `/register-user`, `→/forgot-password`; persist `nrtData{access_token,user,abilities}`; error toast on 401, never false-success | PARTIAL (login works live, dead `href="#"` fixed to forgot-pw, no Terms checkbox on login per spec ok) | `POST /auth/login` live via `lib/auth.tsx` | TESTED mock (login OK/wrong-pw 401) |
| `/register-user` → `app/register-user/page.tsx` | Register form (name/email/phone/password); Terms+SMS-consent checkbox (required); Start button; link → login | PARTIAL (form renders, checkbox present, `POST /auth/register` 404 → mock fallback) | `POST /auth/register` MISSING | TODO local |
| `/two-factor-authentication` → `app/two-factor-authentication/page.tsx:8` | 6-digit TOTP input; Verify button (real verify); resend/back links | PARTIAL (`Verify (mock)` accepts any code, TODO noted) | `POST /auth/2fa/verify` MISSING | TODO local |
| `/forgot-password` → `app/forgot-password/page.tsx` | Email input; Send-reset button; honest `isn't available yet` note | PARTIAL (new 2026-10-06, no backend) | `POST /auth/forgot` MISSING | TESTED render only |
| `/whatsapp-policy` → `app/whatsapp-policy/page.tsx` | Static policy text | PARTIAL | none (static) | TESTED render |
| `/` → `app/page.tsx` | Redirect by `localStorage nrtData.access_token` → `/dashboard` else `/authentication` | PARTIAL | client-only | TESTED |

### 3.2 Dashboard / messaging

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/dashboard` → `app/dashboard/page.tsx` | Cards: balance, today submitted/delivered, campaigns; Kannel status dot; overview/daily/monthly charts; recent-campaigns mini-table; View buttons; `What does DELIVRD mean?` → `GET /dlr/explain/:code` modal | PARTIAL (cards+recent table ok, `gateway:mock/live` pill, charts missing, DLR hardcoded mock) | `GET /dashboard/summary` fallback `/dashboard` (backend mock counts) | TESTED mock |
| `/send-sms` → `app/send-sms/page.tsx` | Tabs Quick/Bulk/Dynamic/Schedule; sender-ID select; template select; message textarea + seg counter (160 GSM/70 Uni) + cost calc; mobiles textarea + file upload + sample link (`normal/custom-sms-campaign-file`); timezone select (`Asia/Kolkata` default); schedule datetime; Send now / Schedule buttons; honest error (no `Queued N (demo)` on fail) | PARTIAL (single form, seg counter ok, sender select ok, missing tabs/template/file/timezone/sample) | `GET /senders` (should be `/sender-ids`), `POST /campaigns` | TESTED mock |
| `/campaigns` → `app/campaigns/page.tsx` | Campaign list table (id/message/status/total/delivered); search/filter/pagination; Repush + Stop buttons per row; status polling | PARTIAL (list+repush/stop ok) | `GET /campaigns`, `POST /campaigns/:id/repush\|stop`; missing `GET :id/status` | TESTED mock |
| `/two-way-message` | Two-way inbox/outbox; reply box; Send button | TODO (no file) | `POST /two-ways-sms` MISSING | TODO |
| `/admin-send-sms`, `/admin-send-two-ways-sms` | Admin-as-user send (user picker + same send form) | TODO (no files) | MISSING | TODO |
| `/admin-manage-campaign` → `app/admin-manage-campaign/page.tsx` | Manage table; Stop/Complete/Repush buttons; `change-status-to-complete`, `reupdate-pending-status` | PARTIAL (stop/repush only) | `POST /admin/manage-campaign`; missing complete/reupdate | TESTED mock |
| `/campaign-report` → `app/campaign-report/page.tsx` | Filter bar (date from/to, sender, mobile, campaign, status); results table; Export button → export polling → download; campaign-info modal (`GET /campaign-info/`) | PARTIAL (status/from/to only) | `GET /reports/campaigns` only | TESTED mock |
| `/scheduled-campaign-report` → `app/scheduled-campaign-report/page.tsx` | Same filters for scheduled; Cancel-scheduled button | PARTIAL | `GET /reports/scheduled` MISSING (falls to mock) | TODO local |
| `/detailed-report` → `app/detailed-report/page.tsx` | Per-message rows (mobile/status/dlrCode/cost/sentAt); mobile/status filters; DLR-explain modal | PARTIAL | `GET /reports/detailed` mock rows | TESTED mock |
| `/message-campaign-report` (consumption) | Consumption summary table | TODO | `GET /reports/consumption` MISSING | TODO |
| `/export-report` → `app/export-report/page.tsx` | Report-type select; Request export button → Export ID; status polling (`GET /exports/:id/status`) → Download link (`GET /exports/:id/download`) | PARTIAL (POST only, `exp_demo_1`, no polling/download) | `POST /exports/:report` MISSING (all exports missing) | TODO local |
| `/report-by-mobile-number` | Mobile input + Search; per-mobile history table | TODO | `GET /reports/by-mobile` MISSING | TODO |
| `/report-by-time` | Time-frame picker + chart | TODO | `GET /reports/by-time` MISSING | TODO |
| `/month-wise-report` | Month picker + submission table | TODO | `GET /reports/monthly` MISSING | TODO |
| `/consumption-report` | Consumption table + `consumption-report-by-view` toggle | TODO | MISSING | TODO |
| `/overview`, `/daily-report` | Overview-by-user + daily-report tables + charts | TODO (only mock inline in other pages) | `GET /reports/overview\|daily` MISSING | TODO |

### 3.3 Contacts / blacklist / senders / templates

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/contacts` → `app/contacts/page.tsx` (covers `create-phone-book/phone-book/group`) | Group list + Create-group input/button; numbers list per group + Add-number form; CSV import wizard + `group-sample-file` link; group delete | PARTIAL (groups+add ok, no wizard/sample) | `GET/POST /contacts/groups`, `GET/POST groups/:id/numbers`, `POST groups/:id/import` (stub `mobile,name` only); spec path `/contact-groups` aliased TODO | TESTED mock |
| `/blacklist` → `app/blacklist/page.tsx` | Blacklist table (mobile/reason); Add form + Import button + `blacklist-action` toggles (block/unblock) | PARTIAL (add/remove only) | `GET/POST/DELETE /blacklist` (singular; spec plural), missing `POST /action` | TESTED mock |
| `/sender-list` → `app/sender-list/page.tsx` | Sender table (sender/status); Create + Edit + Delete + Assign-to-user buttons | PARTIAL (list/create/assign/delete, no edit/view) | `GET/POST /senders`, `POST /senders/:id/assign`; spec `/sender-ids` aliased TODO | TESTED mock |
| `/notification-template` → `app/notification-template/page.tsx` | Template list; Create/Edit/Delete modal; lang picker | PARTIAL | `GET/POST/PATCH/DELETE /templates` (spec `/notification-templates`) | TESTED mock |
| `/send-notification` | Compose notification (user picker + title/body + Send) | TODO | `POST /notifications` exists, page missing | TODO |

### 3.4 Credits / users / roles

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/credits` → `app/credits/page.tsx` | Balance card; txn history table; Top-up/Debit (admin) buttons | PARTIAL | `GET /wallet/balance\|txns`, `POST /wallet/topup\|debit\|credit` (spec `/credits`) | TESTED mock |
| `/credit-request` → `app/credit-request/page.tsx` | Request list + Create (amount+note) form; Approve/Reject (reseller) buttons | PARTIAL (list+create, reply on other page) | `GET/POST /wallet/credit-requests`, `POST .../:id/reply` | TESTED mock |
| `/user-credit-report` → `app/user-credit-report/page.tsx` | User-wise credit table; filter by user/date | PARTIAL (inline mock) | `GET /wallet/user-credit-report` MISSING (admin `user-wise` exists) | TODO local |
| `/user-monthly-report` | Monthly per-user table | TODO | `GET /admin/reports/user-wise-monthly` MISSING | TODO |
| `/users-list` → `app/users-list/page.tsx` (covers `users/users-list`) | Users table; Create/Edit/Delete; `user-action` (activate/suspend); `child-login` impersonate button + banner; `users-for-ddl` picker | PARTIAL (CRUD list ok, no action/impersonate/DDL, `ownerId` TODO) | `CRUD /users` only | TESTED mock |
| `/role-list` (covers `role-list`) | Roles table; abilities checkboxes; Create/Edit | TODO | `CRUD /roles`, `GET /permissions` MISSING | TODO |
| `/api-key` | API-key list; Create/Rotate buttons; IP-whitelist CIDR editor; `enable-additional-security` toggle | TODO (only `api-documentation` + `webhooks` pages exist) | `GET/POST /api-keys`, `POST :id/rotate` exist; whitelist CRUD MISSING | TODO |
| `/api-documentation` → `app/api-documentation/page.tsx` | Static docs table (method/path/desc) from backend | PARTIAL (static fallback) | `GET /api-docs` MISSING | TESTED render |
| `/webhooks` → `app/webhooks/page.tsx` | Webhook list + Add (event/url/secret) form; Test button | PARTIAL | `POST /webhooks/dlr/:vendor`, `GET /webhooks/dlr`; missing `wa|voice/:vendor` + HMAC | TESTED mock |
| `/profile` → `app/profile/page.tsx` | Profile view + Edit; change-password form (≥8 chars); honest save errors | PARTIAL (save no longer false-success) | `GET /users/me` MISSING, `POST /auth/change-password` live | TESTED mock |
| `/login-user-log` | Login history table (user/ip/ua/at) | TODO | `GET /users/login-log` MISSING | TODO |

### 3.5 Voice

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/voice-upload` → `app/voice-upload/page.tsx` | Audio file picker (mime+size check); Upload button → fileId; Process button; honest FAILED (NOT saved) on error | PARTIAL (JSON `{fileName}` not multipart; no S3 presigned) | `POST /voice/uploads`, `POST /voice/process` (mock) | TESTED mock |
| `/voice-sms` → `app/voice-sms/page.tsx` | Send form (file select + mobiles + schedule); Send button | PARTIAL (send separate from upload, no resend) | `POST /voice/campaigns/send` (spec `POST /campaigns`) | TESTED mock |
| `/voice-report`, `/voice-message`, `/admin-all-voice-status` | Voice campaign table; Status + Stop/Resend buttons; `get-all-voice-file-by-status` filter; `sync-voice-template-to-vendor` | PARTIAL (`voice-report` mock status only) | `GET /voice/campaigns`, `POST campaigns/:id/stop`; missing `resend`, `by-status` | TODO local |

### 3.6 WhatsApp

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/send-whatsapp` → `app/send-whatsapp/page.tsx` | To + template picker + lang + vars + body; Pull-templates button; Send button; honest NOT-sent on fail | PARTIAL (send ok, gallery minimal) | `POST /whatsapp/send\|campaigns`, `GET/POST /whatsapp/templates\|pull` | TESTED mock |
| `/whatsapp-media` → `app/whatsapp-media/page.tsx` | Media upload (FormData) + list; honest error toast | PARTIAL | `POST /whatsapp/media` MISSING (direct FormData, no S3) | TESTED mock |
| `/whatsapp-message-report` → `app/whatsapp-message-report/page.tsx` | WA delivery table + filters | PARTIAL (mock list) | `GET /whatsapp/campaigns\|analytics` mock | TESTED mock |
| `/whatsapp-summary-report` → `app/whatsapp-summary-report/page.tsx` | Summary cards (`get-wa-summery`) | PARTIAL (inline mock) | `GET /whatsapp/summary` MISSING | TODO local |
| `/whatsapp-message-template|configuration|conversation-report|analytics-report|template-report|chatbots-self-webhook|rate-card` | Gallery + config forms + charts + chatbot webhook editor + rate-card table | TODO (no files) | `GET /whatsapp/analytics` exists (static); rest MISSING | TODO |

### 3.7 Admin / gateway / misc

| Route / file | Scope content · functions · buttons | FE | Wired to | Test |
|---|---|---|---|---|
| `/admin-settings` → `app/admin-settings/page.tsx` | App-settings editor; server-commands runner (allowlisted); Save/Run buttons with honest errors | PARTIAL | `GET /admin/settings` MISSING, `POST /admin/server-commands` live-mock | TESTED mock |
| `/get-kannel-status` → `app/get-kannel-status/page.tsx` | Kannel status cards (uptime/smsbox); Refresh button | PARTIAL (hardcoded mock) | `GET /admin/kannel-status` mock | TESTED mock |
| `/admin-credit-list` | All credit requests + Approve/Reject | TODO | `GET /admin/reports/user-wise` exists, page missing | TODO |
| `/country-list`, `/routes`, `/user-route` | Countries CRUD; routes (primary/secondary) + ratio/priority editors; assign-route-to-user | TODO | All MISSING | TODO |
| `/notifications` → `app/notifications/page.tsx` | List + Mark-read; unread count in Header | PARTIAL (Header `3` hardcoded) | `GET/POST /notifications` in-memory | TESTED mock |
| `/apps/invoice/*`, `/apps/user/*` | Vuexy parity invoices/users screens | TODO | `invoices` model MISSING | TODO |

---

## 4. Backend module tracker (controller → service → DB → test)

| Module / files | Endpoints now | Missing / TODO | DB | Test |
|---|---|---|---|---|
| `auth/*` | `login,change-password,refresh{sub},logout` | `register,child-login,PATCH me/password,2FA,refresh-rotation,login-log/audit` — `auth.service.ts:7 TODO Prisma` | `User` in-mem, bcrypt 10 | TESTED (login 401 path) |
| `users/*` | `CRUD /users` | `action,ddl,ownerId scoping` — `users.controller.ts:15 TODO` | in-mem | TESTED mock |
| `roles` | — (none) | NEW module `roles/*` | `RoleDef` unused | TODO |
| `campaigns/*` | `POST,GET,GET:id,repush,stop` | `:id/status`, `Idempotency-Key`, E.164/cost | in-mem | TESTED mock 2/2 |
| `contacts/*` | `groups,groups/:id/numbers,import(stub)` | `sample`, full CRUD, stream+bulk — `contacts.service.ts:49 TODO` | in-mem | TESTED mock |
| `blacklist/*` | `GET,POST,DELETE:m,POST import` | `POST /action`, plural alias | in-mem | TESTED mock |
| `senders/*` | `GET,POST,POST:id/assign,DELETE` | `GET:id,PATCH`, `sender-ids` alias | in-mem | TESTED mock |
| `templates/*` | full CRUD | `notification-templates` alias | in-mem | TESTED mock |
| `reports/*` | `campaigns,detailed,delivery` | 8 missing + `dlr/explain` | mock rows | TESTED 3 only |
| `exports` | — (none) | NEW module `POST + :id/status + :id/download` | — | TODO |
| `wallet/*` | `balance,topup,debit,credit,txns,credit-requests*,reply` | `$transaction+audit`, `balance>=0`, `/credits` alias | in-mem | TESTED mock |
| `voice/*` | `uploads,process,campaigns/send,GET campaigns,stop` | `resend`, `by-status`, multipart/S3 | in-mem | TESTED mock |
| `whatsapp/*` | `send,campaigns,templates,pull,analytics` | `media,verify/register,conversation/template/summary,chatbots,rate-card` | in-mem | TESTED mock |
| `admin/*` | `kannel-status,server-commands,manage-campaign,user-wise` | `countries/routes/app-settings/assign/ratio/priority/complete` | mock | TESTED mock |
| `webhooks/*` | `POST dlr/:vendor,GET dlr` | `wa|voice/:vendor`, HMAC+idempotency | in-mem list | TESTED mock |
| `api-keys/*` | `GET,POST,rotate,check-ip` | whitelist CRUD, `additional-security` guard | in-mem (`includes` not CIDR) | TESTED mock |
| `dashboard/*` | `GET /dashboard` | `GET /dashboard/summary` alias | mock counts | TESTED mock |
| `notifications/*` | `GET,POST,POST:id/read` | unread-count | in-mem | TESTED mock |
| `queue/worker/providers` | memory queue ok | `worker.ts:31 TODO BullMQ`, `Real*Provider TODOs` | — | `WORKER_DEMO=1` only |

---

## 5. SEO / performance / design tracker

| Item | Scope expects | Now | Fix file | Status |
|---|---|---|---|---|
| Sitemap/robots/manifest/icons | `sitemap.ts,robots.ts,manifest.ts,icon,og-image,public/robots` | none, no `public/` | new `app/*` + `public/*` | TODO |
| Metadata/OG/JSON-LD | per-route titles, OG/Twitter/canonical | root only; all pages `'use client'` no metadata | `layout.tsx:6` + server wrappers | TODO |
| Semantic/a11y | `nav/section/article`, heading hierarchy, AA | `aside` no `nav`, single h1 ok | `Sidebar.tsx,ui.tsx` | PARTIAL |
| Images/fonts | `next/image`, `next/font`, logo `nrt.912b8864.png` | zero images, system font, logo absent | `next.config.js`, pages | TODO |
| Bundle/lazy | `dynamic/Suspense`, analyzer, Query/Zustand | none, every page bundles mock | `package.json` + pages | TODO |
| Data fetching | RSC/SSG, server pagination/sort | all CSR `no-store`, client `per=10` | `Table.tsx,api.ts` | TODO |
| Styling | Tailwind+shadcn, Vuexy parity, dark toggle, charts | hand CSS 67 lines, no charts/theme | `globals.css,ui.tsx` | PARTIAL |
| Forms | RHF+zod, S3 presigned, timezone picker, wizards | uncontrolled `useState`, FormData direct, `datetime-local` only | `send-sms,contacts,voice-upload` pages | TODO |

---

## 6. Infra / security / docs tracker

| Item | Now | Fix | Status |
|---|---|---|---|
| Compose `docker-compose.yml` | 5 services, no healthcheck, `start:dev`, `version 3.9` | add healthchecks, `migrate deploy`, `kannel-mock,nginx`, rm version | PARTIAL |
| Dockerfiles | `build \|\| echo deferred`, `CMD dev` | multi-stage prod builds | TODO |
| Env | `.env` committed w/ `Admin@123`, `sb_*` in FE `.env` | rotate, `.env.local`, FE only `NEXT_PUBLIC_*` | TODO |
| Security | no helmet/throttler/HMAC/CIDR/2FA, bcrypt 10, `CORS *` | ` helmet+throttler+12+HMAC`, `CORS_ORIGIN` | TODO |
| OpenAPI `shared/openapi.json` | 2 paths stub | regen from `/api/docs-json` (>30 paths) | TODO |
| Docs drift | README 404 vs 410, 21 vs 23 MDs, stale plan | fix `README,API_SPEC,DATABASE_SCHEMA,DEVELOPMENT_PLAN` | TODO |

---

## 7. Local test commands (run before marking TESTED)

```powershell
# infra
docker compose -f project/docker-compose.yml up -d postgres redis
# backend (mock mode, no paid keys)
cd project/backend; npm install; npm run start:dev   # :3001
curl http://localhost:3001/api/v1/health
curl -X POST http://localhost:3001/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"admin@local.dev","password":"Admin@123"}'
curl http://localhost:3001/api/v1/dlt-templates  # expect 410 DLT_DISABLED
# frontend
cd ../frontend; npm install; npm run dev             # :3000
npm run build  # expect 34 routes ok (grows as §3 TODOs land)
# honesty check (backend down): click send/save/upload → must show "backend unreachable. Nothing was saved.", zero success toasts, OFFLINE_NOTE only when USE_MOCK=1
```

---

## 8. Change log (append every change — newest at bottom)

| Date | Area (FE/BE/infra) | Files | What changed + wiring | Test cmd + result |
|---|---|---|---|---|
| 2026-09-28 | docs | 21 spec MDs | Discovery + 225 mappings, DLT excluded | static bundle parse ok |
| 2026-09-28 | BE+FE | scaffold `backend/`,`frontend/`,`compose`, `openapi.json` stub | `/api/v1` + Swagger, login+nrtData, DLT 410 | file tree + JSON parse (44 files) |
| 2026-09-28 | BE+FE | 16 modules, AppShell, 34 routes | mock providers, `QUEUE_DRIVER=memory` | `nest build` ok, `next build` 34 ok, `POST /campaigns` → worker 2/2 |
| 2026-10-06 | FE | `lib/api.ts`, `send-sms,profile,admin-settings,whatsapp-media,voice-upload,send-whatsapp`, `loading|error|not-found|forgot-password`, `TESTING_QA.md` | honest offline states, no false success | `tsc` clean, backend-down click-through error-only |
| 2026-10-06 | BE | `users.service,auth.service|controller`, `.env.example+.env` | bcrypt seed users + `change-password` | login OK→401→change→revert verified |
| 2026-10-06 | docs | `LOCAL_FIX_PLAN.md` | file-by-file executable plan | — |
| 2026-10-06 | docs | `MEMORY.md` (this file) | persistent tracker: §3 per-page inner content/buttons/wiring, §4 BE modules, §5-6 SEO/perf/infra | — |
| 2026-10-06 | BE+FE+docs | `src/common/dlt-block.controller.ts`, `frontend/middleware.ts`, `README.md` | DLT exclusion locked: BE 410 list extended (`template-group*`, `report-by-template-group*`, `summary-report-by-template-group*`), FE redirect matcher extended same, README 404→410 Gone; verified zero DLT pages/models/endpoints/nav entries | `tsc --noEmit` BE+FE clean; grep DLT only in intentional blocks |
| | | | | |

<!-- ADD NEW ROWS HERE, e.g.: | 2026-10-07 | BE | src/modules/exports/* | POST /exports + status/download wired to BullMQ | npm run test:e2e green, curl status→download 200 | -->
