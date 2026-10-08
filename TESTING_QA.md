# Testing & QA

- Backend: Jest unit (cost calc, E.164, abilities, wallet TX) + Supertest e2e (auth, send→DLR→balance, reseller isolation, exports). Coverage ≥70%.
- Frontend: Vitest + Playwright (login, send SMS, schedule+stop, import contacts, credit-request, voice upload, WA send, report export).
- Load: k6 `campaign enqueue 10k` <30s, DLR ingest 1k/min, export 100k rows <2m (worker).
- Parity checklist vs legacy routes/endpoints (minus DLT); every `UNVERIFIED` needs HAR or owner sign-off.
- Security: npm audit, zap baseline, JWT/IDOR tests, IP-whitelist tests.

## Local manual test (no automation yet — 2026-10-06)

1. Start backend (`:3001`) + frontend (`:3000`), log in as `admin@local.dev` / `Admin@123`.
2. Happy path: send SMS → campaigns shows queued/completed → change password → log in with new → revert.
3. Backend-down honesty: stop backend, click every page — each must show `Offline demo data.` / `backend unreachable. Nothing was saved.` and **zero** success toasts. `loading.tsx`/`error.tsx`/`not-found.tsx` cover route-level states.
4. Auth: wrong password → 401 + error toast (never success); direct-URL `/dashboard` without login renders shell with failing fetches (middleware auth pending P1).

## Mock-vs-real matrix (local dev)

- Real: bcrypt login/change-password, JWT issue, in-memory CRUD math (wallet debit/credit, segmentation counter client-side).
- Mock (resets on restart): all campaign/contact/wallet/voice/WA stores, `gateway: mock` pill, DLR explanation, Kannel status, reports rows.
- Missing (404): `POST /auth/register`, `GET/PATCH /users/me`, `/exports/*`, `/dashboard/summary`, 8 of 11 reports, roles/permissions, 2FA, child-login — frontend falls back to mock/empty with an offline note.
