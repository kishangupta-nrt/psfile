# Local-Test Fix Plan — file-by-file, executable in order

> Goal: go from mock-demo-only to `docker compose up` + real Postgres/Redis local test.
> No real vendor keys needed — `PROVIDER_*=mock` stays, but persistence, authz, contract, and honesty become real.
> Run top-to-bottom. Each item has file, fix, and verify.

## Phase 0 — Unblock local boot (30 min)

### 0.1 Deps: add missing test/seed tooling
- **File:** `project/backend/package.json`
- **Problem:** `test/app.e2e.spec.ts` imports `supertest`; `prisma/seed.ts` needs `ts-node`; no `jest.config`, no e2e/cov scripts.
- **Fix:**
  1. `cd project/backend; npm i -D supertest @types/supertest ts-node ts-jest`
  2. Add `jest.config.js`: `{ preset:'ts-jest', testEnvironment:'node', roots:['<rootDir>/test','<rootDir>/src'] }`
  3. Scripts add: `"test:e2e":"jest --config jest.config.js --runInBand", "test:cov":"jest --coverage", "prisma:migrate":"prisma migrate dev --name 0001_init", "prisma:deploy":"prisma migrate deploy", "db:seed":"ts-node prisma/seed.ts"`
  4. Keep `"test":"jest --passWithNoTests"` only until 0.1 verified, then switch CI to `test:e2e`.
- **Verify:** `npm run test:e2e` fails on missing DB (expected) not on missing module.

### 0.2 Env hygiene (do before sharing logs)
- **Files:** `project/backend/.env`, `project/backend/.env.example`, `project/frontend/.env`, `project/frontend/.env.example`
- **Problem:** real-looking secrets committed (`Admin@123`, `sb_publishable_*`/`sb_secret_*` in frontend `.env`).
- **Fix:**
  1. `cp project/backend/.env.example project/backend/.env.local` for local overrides; add `.env.local` to `.gitignore` if absent.
  2. Rotate `JWT_SECRET`/`JWT_REFRESH_SECRET` to 32+ random chars in your local `.env` only.
  3. Delete committed secret values from `project/frontend/.env` (leave empty keys); frontend `.env` must contain only `NEXT_PUBLIC_*`.
  4. `README.md:34` already says copy `.env.example` → `.env` — enforce, never commit `.env`.
- **Verify:** `git status --porcelain | grep env` shows only `.env.example` tracked changes.

### 0.3 Compose: add missing services + healthchecks
- **File:** `project/docker-compose.yml`
- **Problem:** 5 services vs spec 7 (no `kannel-mock`, no `nginx`); no healthcheck; `api command: start:dev`; obsolete `version: "3.9"`.
- **Fix:**
  1. Remove `version:` line.
  2. Add `healthcheck:` to `postgres` (`pg_isready -U nrtsms`) and `redis` (`redis-cli ping`).
  3. Change `api.depends_on` to `condition: service_healthy`; change `api.command` to `sh -c "npx prisma migrate deploy && node dist/main"` with `Dockerfile` building prod (see 0.4). Keep `start:dev` override in `docker-compose.override.yml` for dev.
  4. Add `kannel-mock` (simple `node:20-alpine` http stub on `:13000` returning `OK <id>`) and `nginx` (`:80` → `web:3000`, `/api/` → `api:3001`) — minimal conf in `project/nginx.conf` (new file).
  5. Add `env_file` fallback: document `frontend/.env` must exist (already does).
- **Verify:** `docker compose -f project/docker-compose.yml config` parses; `up -d postgres redis` healthy.

### 0.4 Dockerfiles: prod build, not dev server
- **Files:** `project/backend/Dockerfile`, `project/frontend/Dockerfile`
- **Problem:** backend `RUN npm run build || echo deferred` hides failures; frontend `CMD npm run dev`.
- **Fix (backend):** multi-stage `node:20-alpine` → `npm ci` → `npx prisma generate` → `npm run build` (fail loudly, no `|| echo`) → `CMD ["node","dist/main"]`.
- **Fix (frontend):** `npm ci` → `npm run build` → `CMD ["npm","start"]` (`next start`, standalone). Keep dev via `docker-compose.override.yml command: npm run dev`.
- **Verify:** `docker build ./project/backend`, `docker build ./project/frontend` both green.

---

## Phase 1 — Backend: contract + persistence (biggest gap)

### 1.1 Prisma schema: add 9 missing models + constraints
- **File:** `project/backend/prisma/schema.prisma`
- **Problem:** missing `voice_files, wa_templates, wa_campaigns, email_campaigns, invoices, countries, routes, user_routes, app_settings`; no `documents/ip_whitelist/refresh_tokens`; `User.ownerId` no FK/index; no `balance>=0`.
- **Fix:** append models (matching `DATABASE_SCHEMA.md` names):
  ```prisma
  model VoiceFile { id String @id @default(cuid()) ownerId String fileName String sizeBytes Int status String @default("uploaded") createdAt DateTime @default(now()) @@index([ownerId]) }
  model WaTemplate { id String @id @default(cuid()) name String lang String @default("en") body String status String @default("active") }
  model WaCampaign { id String @id @default(cuid()) ownerId String template String status String @default("queued") total Int @default(0) createdAt DateTime @default(now()) @@index([ownerId]) }
  model EmailCampaign { id String @id @default(cuid()) ownerId String subject String body String status String @default("queued") createdAt DateTime @default(now()) }
  model Invoice { id String @id @default(cuid()) userId String amount Int status String @default("pending") createdAt DateTime @default(now()) @@index([userId]) }
  model Country { id String @id @default(cuid()) name String code String @unique }
  model Route { id String @id @default(cuid()) name String kind String @default("primary") ratio Int @default(100) priority Int @default(1) }
  model UserRoute { userId String routeId String @@id([userId, routeId]) }
  model AppSetting { key String @id value Json }
  model RefreshToken { id String @id @default(cuid()) userId String hash String createdAt DateTime @default(now()) @@index([userId]) }
  model IpWhitelist { id String @id @default(cuid()) userId String cidr String @@index([userId]) }
  ```
  Add to `User`: `owner User? @relation("Hierarchy", fields:[ownerId], references:[id])` + `children User[] @relation("Hierarchy")` + `@@index([ownerId])`. Add `Wallet.balanceCredits @db.Int` + app-level `>=0` guard in service (Phase 1.5).
- **Verify:** `npx prisma validate && npx prisma migrate dev --name 0001_init` creates `prisma/migrations/`.

### 1.2 Seed: real Prisma writes
- **File:** `project/backend/prisma/seed.ts`
- **Problem:** only `console.log INSERT...`, `TODO wire PrismaClient`.
- **Fix:** replace with `PrismaClient` upserts for `u_admin/u_reseller/u_customer` (bcrypt 12, env passwords), wallets (5000/1000), `ContactGroup g_demo` + 2 contacts. Keep `// No dlt_*` comment.
- **Verify:** `npm run db:seed && npx prisma studio` shows rows (or `psql -c "select * from \"User\""`).

### 1.3 Security baseline: helmet, throttler, bcrypt12, guards global
- **Files:** `project/backend/src/main.ts`, `project/backend/src/app.module.ts`, `project/backend/src/modules/users/users.service.ts`, `project/backend/src/modules/auth/auth.service.ts`
- **Fix:**
  1. `npm i helmet @nestjs/throttler`; `main.ts`: `import helmet from 'helmet'; app.use(helmet()); app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:3000', credentials:true })` (replace `origin:true`).
  2. `app.module.ts`: `ThrottlerModule.forRoot([{ ttl:60000, limit:5 }])` for `auth/login`; register `APP_GUARD: JwtGuard` + `APP_GUARD: RolesGuard` (keep `APP_FILTER`). Import `Reflector` providers as needed.
  3. `users.service.ts:21,58,74,86`: `bcrypt.hashSync(...,10)` → `12`; `auth.service.ts` unchanged except cost follows.
  4. Mark public routes with existing `@Public()`: `health`, `auth/login`, `auth/refresh`, `webhooks/dlr/:vendor`.
- **Verify:** `GET /api/v1/campaigns` without token → 401; `POST /auth/login` wrong pw → 401; 6th rapid login → 429.

### 1.4 DTOs + validation (kills bad-number billing bug)
- **Files (new):** `src/modules/campaigns/dto/create-campaign.dto.ts`, `src/modules/contacts/dto/*.dto.ts`, `src/modules/blacklist/dto/*.dto.ts`, `src/modules/auth/dto/login.dto.ts`, `src/common/phone.util.ts` (new)
- **Problem:** zero `*.dto.ts`, controllers take `Record<string,unknown>`; no E.164/blacklist/segmentation.
- **Fix:**
  1. `phone.util.ts`: `normalizeE164(m:string): string|null` (strip non-digits, enforce `^[1-9]\d{7,14}$`), `segmentCount(msg)` (GSM 160 / Unicode 70).
  2. `create-campaign.dto.ts`: `IsString senderId, IsString message @MaxLength(2000), IsArray mobiles @ArrayMinSize(1), IsOptional scheduledAt/timezone`.
  3. Wire `@Body() dto` in `campaigns.controller.ts:11`, `contacts.controller.ts`, `blacklist.controller.ts`, `auth.controller.ts:7`.
  4. `campaigns.service.ts:61` (debit `1/mobile` mock): replace with `cost = segmentCount(message).parts * mobiles.length` after filtering `blacklist + invalid-series`.
- **Verify:** `POST /campaigns {mobiles:["abc"]}` → 400; valid → correct debit.

### 1.5 Services: Prisma instead of in-memory (per-module checklist)
Each service header has `TODO: swap with Prisma when DB is up`. Convert in this order (auth-scoped `ownerId` = `req.user`):
- `src/modules/users/users.service.ts` → `PrismaClient.user` CRUD, `ownerId` closure (`self+descendants`), strip `passwordHash`.
- `src/modules/campaigns/campaigns.service.ts` → persist `campaign+messages(pending)`, `queue.add('sms-send')`, no hardcoded `ownerId:'u_customer'` (use JWT).
- `src/modules/wallet/wallet.service.ts` → `$transaction` debit+`walletTxn+auditLog`, `balance>=0` check.
- `src/modules/contacts/contacts.service.ts:49` → stream CSV + `createMany` (keep `importStub` name as alias for compat).
- `src/modules/blacklist/blacklist.service.ts`, `senders.service.ts`, `templates.service.ts`, `voice.service.ts`, `whatsapp.service.ts`, `reports.service.ts`, `admin.service.ts`, `notifications/*`, `api-keys/*`, `webhooks/*` → same pattern.
- **Verify per module:** restart API → data survives (not reset); `GET` after `POST` returns Prisma row.

### 1.6 Missing endpoints (frontend currently falls back to mock)
Add to existing controllers (keep old paths as `@Get` aliases for 1 release to avoid breaking FE):
- `src/modules/auth/auth.controller.ts`: `POST register`, `POST child-login` (audit + `impersonatedBy`), `PATCH users/me`, `PATCH password`, refresh rotation (`{refreshToken}` + reuse detection via `RefreshToken` model).
- `src/modules/campaigns/campaigns.controller.ts`: `GET :id/status`.
- `src/modules/reports/reports.controller.ts`: `GET scheduled|by-mobile|by-time|monthly|consumption|overview|daily`, `GET dlr/explain/:code`.
- **New** `src/modules/exports/exports.controller.ts` + `exports.service.ts` + module: `POST /exports/:report` → BullMQ `export` job → `GET /exports/:id/status` → `GET /exports/:id/download` (signed URL/S3 or local).
- `src/modules/users/users.controller.ts:15`: enforce `ownerId` from `req.user` (remove TODO), add `POST :id/action`, `GET ddl` (`users-for-ddl`).
- **New** `src/modules/roles/roles.controller.ts`: `CRUD /roles`, `GET /permissions`, `GET /permissions/all`.
- `src/modules/admin/admin.controller.ts`: `CRUD countries|routes|secondary-routes|app-settings`, `POST assign-route|set-ratio|set-priority`, `POST change-status-to-complete|reupdate-pending-status`.
- `src/modules/voice/voice.controller.ts`: `POST campaigns/:id/resend`, `GET files/by-status`.
- `src/modules/whatsapp/whatsapp.controller.ts`: `POST media|verify|register`, `GET conversation|template/summary|rate-card`, `POST chatbots/*` stubs returning 501 with `WA_NOT_CONFIGURED` (honest, not mock success).
- `src/modules/webhooks/webhooks.controller.ts`: `POST wa/:vendor`, `POST voice/:vendor` + HMAC check (`x-signature` sha256 vs `Webhook.secret`) + `messageId` idempotency.
- `src/modules/api-keys/*`: full `ip-whitelist` CRUD + `enable-additional-security` toggle (enforce 2FA+IP for `api_user`).
- `src/modules/dashboard/dashboard.controller.ts`: add `GET /dashboard/summary` alias (frontend tries `summary` then `dashboard`).
- **Verify:** `npx ts-node -e "fetch swagger /api/docs-json"` lists new paths; `project/shared/openapi.json` regenerated (see 1.8).

### 1.7 Path aliases (spec-name compat)
- **Files:** `contacts.controller.ts` (`@Controller('contacts')` → add `@Controller('contact-groups')` alias controller or second `@Controller` via extra controller class), `blacklist.controller.ts` (`blacklist` → also mount `blacklists`), `senders.controller.ts` (`senders` → also `sender-ids`), `templates.controller.ts` (`templates` → also `notification-templates`), `wallet.controller.ts` (`wallet` → also `credits` + `credit-requests`).
- **Fix:** cheapest honest fix — keep implementation, add alias `@Controller` classes delegating to same service (2 lines each). Remove after FE migrates.
- **Verify:** `GET /sender-ids` and `GET /senders` both 200.

### 1.8 OpenAPI contract regeneration
- **Files:** `project/shared/openapi.json`, `src/main.ts:18`
- **Fix:** after 1.6, `curl localhost:3001/api/docs-json > project/shared/openapi.json`; assert >20 paths (currently 2).
- **Verify:** `node -e "console.log(Object.keys(require('./project/shared/openapi.json').paths).length)"` ≥ 30.

### 1.9 Queue + worker: real BullMQ wiring
- **Files:** `src/queue/queue.service.ts`, `src/queue/worker.ts`
- **Problem:** `worker.ts:31 TODO BullMQ wiring pending — idle`; `QueueService` lazy `Queue.add` only.
- **Fix:** `worker.ts`: when `QUEUE_DRIVER=redis`, `new Worker('sms-send'|'wa-send'|'voice-send'|'export', handler, { connection, concurrency:50 })` with per-route rate-limit; `queue.service.ts`: support `delayMs` for `scheduledAt+timezone` (delayed job) + `Idempotency-Key` header dedupe.
- **Verify:** `WORKER_DEMO=1 npm run worker` processes; `POST /campaigns {scheduledAt}` → delayed job visible in Redis (`redis-cli llen`).

---

## Phase 2 — Frontend: stop masking backend gaps

### 2.1 Env + Supabase (unused but bundled)
- **Files:** `project/frontend/.env`, `lib/supabase.ts`, `lib/supabase-server.ts`
- **Fix:** ensure `.env` has only `NEXT_PUBLIC_API_BASE` (+ empty Supabase public keys); assert zero imports of `supabase` in `app/` (currently true — keep it). Either wire Supabase or `npm uninstall @supabase/supabase-js` to cut bundle.
- **Verify:** `grep -r supabase app/ --include=*.tsx` empty; `npm run build` bundle smaller.

### 2.2 Auth hardening (currently permissive)
- **Files:** `lib/auth.tsx`, `lib/api.ts`, `middleware.ts`, `components/Sidebar.tsx`
- **Fix:**
  1. `auth.tsx: can()`: `if (!abs.length) return false` (currently `true`); add `isLoggedIn` guard in `AppShell.tsx` redirecting to `/authentication` (currently only shell-less allowlist).
  2. `middleware.ts`: extend `matcher` to auth-guard `/dashboard|/send-sms|...` via JWT cookie (or document client-only guard explicitly — pick one, don't leave half).
  3. `api.ts:getToken()`: also accept `accessToken` key (backend spec says `accessToken`, FE uses `access_token` — normalize both).
- **Verify:** incognito `GET /dashboard` → redirect `/authentication`; logged-in nav filters by `abilities`.

### 2.3 Contract alignment (FE calls wrong paths)
- **Files:** every `app/*/page.tsx` (see table)
- **Fix (search-replace after 1.7 aliases land, then migrate to canonical):**
  | Page | Now | Change to |
  |---|---|---|
  | `dashboard/page.tsx` | `GET /dashboard/summary` fallback `/dashboard` | keep (backend now aliases both) + drop `gateway:mock` pill when live |
  | `send-sms/page.tsx` | `GET /senders`, `POST /campaigns` | `GET /sender-ids`, `POST /campaigns` + `scheduledAt/timezone` + template select |
  | `contacts/*` | `GET /contacts/groups` | `GET /contact-groups` (alias covers) + add import wizard + `group-sample-file` link |
  | `blacklist/page.tsx` | `GET/POST/DELETE /blacklist` | `GET/POST /blacklists` + `POST /blacklists/action` toggles |
  | `sender-list/page.tsx` | `GET/POST /senders` | `GET /sender-ids` CRUD + `POST /sender-ids/:id/assign` |
  | `notification-template/*` | `GET /templates` | `GET /notification-templates` |
  | `credits/*` | `GET /wallet/*` | `GET /credits`, `POST /credit-requests` (alias covers) |
  | `export-report/page.tsx` | `POST /exports/:report` only, `exp_demo_1` | add `GET /exports/:id/status` polling + `GET /exports/:id/download` link |
  | `campaign-report|scheduled|detailed` | 3 reports | add `by-mobile|by-time|monthly|consumption|overview|daily` pages or query tabs |
  | `voice-*` | `POST /voice/uploads` JSON `{fileName}` | `multipart FormData` + `process` → `send` → `stop/resend/status` flow |
  | `whatsapp-*` | `POST /whatsapp/send` | add `pull-templates`, `media upload`, `analytics/conversation/template` charts |
- **Verify:** with backend down, writes show `backend unreachable. Nothing was saved.` (already via `friendlyError`) + zero success toasts; with backend up, zero `OFFLINE_NOTE`.

### 2.4 Mock gating (currently ~20 pages silently mock)
- **Files:** `lib/mock.ts`, all `app/*/page.tsx`, `components/Header.tsx` (hardcoded `1,250.50/3`)
- **Fix:** `const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK==='1'`; `catch → if (USE_MOCK) setData(mock) else setError(friendlyError(...))`. Remove `useState(mock*)` initial values (start `null`). Header balance/unread must come from `GET /wallet/balance|/notifications/unread-count`, not constants.
- **Verify:** `NEXT_PUBLIC_USE_MOCK=0 npm run dev` + backend down → error states, no mock numbers (`919999999901`, `NRTINF`, `DELIVRD` gone).

### 2.5 Missing pages (34 → ~60 parity)
Create (copy nearest existing page as scaffold): `app/admin-send-sms/`, `app/two-way-message/`, `app/report-by-mobile-number/`, `app/report-by-time/`, `app/month-wise-report/`, `app/consumption-report/`, `app/overview/`, `app/daily-report/`, `app/phone-book/`, `app/group/`, `app/api-key/`, `app/role-list/`, `app/user-monthly-report/`, `app/voice-message/`, `app/whatsapp-message-template/`, `app/whatsapp-analytics-report/`, `app/whatsapp-rate-card/`, `app/send-notification/`, `app/login-user-log/`, `app/country-list/`, `app/routes/`, `app/apps/invoice/`, `app/apps/user/`. Each: `page.tsx` with `apiGet` + `States` + `DataTable` (no mock default).
- **Verify:** `next build` route count ≥ 50; dead links in `Sidebar.tsx` all resolve.

### 2.6 `two-factor-authentication/page.tsx:8` TODO
- **File:** `app/two-factor-authentication/page.tsx`
- **Fix:** wire TOTP verify `POST /auth/2fa/verify` (backend 1.6) or gate behind `NEXT_PUBLIC_2FA=1`, else show `501 + enable-additional-security` hint — never `Verify (mock)` accepting any code in prod build.
- **Verify:** wrong code → error, not login.

---

## Phase 3 — SEO, performance, design (after functional parity)

### 3.1 SEO
- **Files (new):** `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.png` (copy legacy `nrt.912b8864.png` when owner provides), `app/opengraph-image.png`, `public/robots.txt`, `public/favicon.ico`
- **Fix:** `layout.tsx:6`: expand `metadata` to `openGraph/twitter/canonical/alternates`; move per-route titles out of `'use client'` pages into `generateMetadata` in server wrappers; `Sidebar.tsx`: `<aside>` → `<nav aria-label>`; ensure single `h1` hierarchy.
- **Verify:** `npm run build && curl localhost:3000/sitemap.xml + /robots.txt` 200; Lighthouse SEO ≥ 90.

### 3.2 Performance
- **Files:** `next.config.js`, `Dockerfile`, all image/font usages, `components/Table.tsx`
- **Fix:** `next.config.js`: `{ compress:true, images:{remotePatterns:[]}, modularizeImports:{}, experimental:{optimizePackageImports:[]} }`; replace `<img>` with `next/image` (with `alt/priority`); add `next/font` (system fallback ok); `Table.tsx`: server pagination (`?page&per&sort`) instead of client `per=10`; add `loading.tsx` suspense boundaries per route.
- **Verify:** Lighthouse Perf ≥ 85 on `/dashboard`; `next build` bundle report no duplicated `mock.ts`.

### 3.3 Design system parity
- **Files:** `app/globals.css` (67 lines hand CSS), `components/ui.tsx`, `app/send-sms/page.tsx`, `app/dashboard/page.tsx`
- **Fix (minimal, no full Tailwind rewrite required for local test):** add timezone select (`GET /meta/timezones`, default `Asia/Kolkata`), sender/template pickers, sample-file links (`normal-sms-campaign-file`), `export-status` polling UI, `get-dlr-explanation/:code` modal (replace hardcoded `DELIVRD`), phonebook CSV wizard, charts (Recharts `npm i recharts`) for overview/daily/monthly + WA analytics.
- **Verify:** manual checklist in `TESTING_QA.md` passes without "missing picker" notes.

---

## Phase 4 — Tests + docs (definition of done)

### 4.1 Backend tests
- **Files:** `test/app.e2e.spec.ts` (fix imports), new `src/**/*.spec.ts` (cost/E.164/abilities/wallet-TX)
- **Fix:** cover login→send→DLR→report→export happy path; JWT/IDOR (reseller can't see sibling data); coverage ≥70%.
- **Verify:** `npm run test:cov` green.

### 4.2 Frontend + load
- **Files (new):** `playwright.config.ts`, `k6/send.js`
- **Fix:** Playwright login→send→report→export; k6 `10k enqueue <30s`, DLR `1k/min`, export `100k <2m` (all against mock provider + Redis).
- **Verify:** `npx playwright test`, `k6 run k6/send.js` meet NFRs.

### 4.3 Docs sync (repo rule: docs-first)
- **Files:** `README.md:35` (`404` → `410 DLT_DISABLED`), `README.md:41` (`21` → `23` MDs), `API_SPECIFICATION.md` (add `timezones/dlrcode/invalid-series/documents` endpoints), `DATABASE_SCHEMA.md` (add 9 models + `refresh_tokens/ip_whitelist`), `DEVELOPMENT_PLAN.md` (mark P2 done, re-estimate P3-P7), `project/shared/openapi.json` (regenerated), `CHANGELOG.md` (new entry per phase).
- **Verify:** `grep -r TODO project/backend/src --include=*.ts | wc -l` → 0 (currently ~22).

## Execution order (copy-paste)

```powershell
# 0
cd project/backend; npm i -D supertest @types/supertest ts-node ts-jest; npm i helmet @nestjs/throttler
# 1
npx prisma validate; npx prisma migrate dev --name 0001_init; npm run db:seed
# edit main.ts (helmet+CORS), app.module.ts (APP_GUARD x2 + Throttler), users.service (bcrypt 12)
npm run build; npm run test:e2e
# 2-4 per file list above
docker compose -f project/docker-compose.yml up -d postgres redis
npm run start:dev  # :3001 health lagbe
cd ../frontend; npm run dev  # :3000
```

**Done when:** `compose up` green, `migrate+seed` green, `login→send→report→export` real rows survive restart, no `OFFLINE_NOTE` when backend up, no success toast when backend down, `410 /dlt*`, Lighthouse SEO/Perf ≥85, `test:cov` ≥70%.
