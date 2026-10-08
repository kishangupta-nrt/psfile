# Project Rules — NRT-SMS Clone

1. **Docs-first:** every code change updates the owning spec (`API_SPECIFICATION.md`, `DATABASE_SCHEMA.md`, etc.) + `CHANGELOG.md` in the same PR.
2. **No DLT:** do not implement `dlt-template*`, `dlt-template-group*`, `sender-id` DLT approval flows. Stub returns `410 Gone / DLT_DISABLED`. Only plain sender IDs allowed.
3. **No secrets:** never commit `.env`, tokens, or the owner credential (`sms@nrt.co.in`). Use `process.env`. Rotate shared password after discovery.
4. **Stack lock:** Backend NestJS 10 + TS strict; Frontend Next.js 14 App Router + TS + Tailwind; DB PostgreSQL 16 + Prisma; Queue Redis + BullMQ.
5. **API contract:** all endpoints prefixed `/api/v1`, JSON, `Bearer` JWT. Breaking changes require major version + migration note.
6. **RBAC via CASL-compatible abilities:** backend enforces with guards; frontend only hides UI.
7. **Legacy parity:** route names kebab-case matching old SPA (`/campaign-report`, `/send-sms`, `/voice-sms`, `/send-whatsapp`, etc.) except DLT routes removed.
8. **Quality gates:** `npm run lint`, `npm run test`, `prisma validate` must pass. Coverage target 70% backend.
9. **Commits:** `type(scope): subject` (feat, fix, docs, chore). One logical change per commit.
10. **Windows dev:** PowerShell 5.1 compatible commands; LF line endings; UTF-8.
