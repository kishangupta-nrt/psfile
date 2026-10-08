# NRT-SMS Clone — PHP → NestJS + Next.js

> Clone of `https://app.ok-go.in` (also served at `https://ok-go.in`) — Bulk SMS / Voice / WhatsApp reseller panel.
> Legacy: PHP backend + React CRA SPA (`webpackJsonpnrt-sms`, Vuexy-based).
> Target: **NestJS 10 backend + Next.js 14 frontend**, PostgreSQL + Redis/BullMQ. **DLT excluded fully** per owner.

## Discovery snapshot (2026-09-28, unauthenticated static analysis)
- SPA shell at `/authentication`, `/register-user`, `/whatsapp-policy`; all other routes client-side.
- API base (from `main.203e21be.chunk.js`): `baseUrl: "https://"+ "ok-go.in" + "/api/"`, `baseUrl2: "https://"+ "ok-go.in" + "/"`.
- Auth: `Bearer access_token`, `localStorage["nrtData"]`, endpoints `/jwt/login`, `/jwt/register`, `/jwt/refresh-token`, `/jwt/logout` (JWT mocked via `axios-mock-adapter` in bundle; live `/api/*` currently 404 — backend down or moved; rebuild fresh).
- 225 API action→path mappings extracted (see `API_SPECIFICATION.md`), 30+ SPA routes + Vuexy `apps/invoice`, `apps/user` screens.
- CASL ability model: `{action, resource}` per feature (see `USER_ROLES_PERMISSIONS.md`).
- Server header: `Apache`; CSP permissive; `encryptKey: "NewRiseInc"`, `socketChatUrl: wss://...`.

## Monorepo layout
```
./README.md, *.md (21 spec files, docs-first, updated on every code change)
./project/
  backend/   # NestJS API (Swagger at /api/docs)
  frontend/  # Next.js App Router UI
  shared/    # OpenAPI + types
  docker-compose.yml
```

## Quick start (after scaffold)
```powershell
docker compose -f project/docker-compose.yml up -d  # postgres + redis
cd project/backend; npm install; npm run start:dev
cd project/frontend; npm install; npm run dev
```

## Rules
- Docs-first: update relevant `*.md` + `CHANGELOG.md` on every feature/fix.
- No secrets in repo. Copy `project/backend/.env.example` → `.env`.
- DLT out of scope: no `dlt-*` tables, routes, or UI. Return 410 Gone with `DLT_DISABLED`.
- See `PROJECT_RULES.md` + `AI_AGENT_RULES.md`.

## Status
- [x] Static discovery (routes, 225 endpoints, auth scheme)
- [ ] Authenticated crawl (blocked: live API 404; needs owner to confirm new backend host or provide HAR)
- [x] 21 spec MDs
- [ ] Backend MVP + Frontend MVP (scaffolded)
# psfile
