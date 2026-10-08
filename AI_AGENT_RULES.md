# AI Agent Rules

You are rebuilding NRT-SMS (PHP → NestJS + Next.js). Follow strictly:

1. **Read before write:** check `FEATURES.md`, `API_SPECIFICATION.md`, `DATABASE_SCHEMA.md` before coding.
2. **Discovery evidence:** only claim parity for endpoints verified in `main.203e21be.chunk.js` mapping table (225 entries). Mark others `UNVERIFIED`.
3. **DLT ban:** if asked to add DLT, refuse and point to `PRODUCT_SPECIFICATION.md` out-of-scope. Do not create `dlt*` tables.
4. **Credential hygiene:** never echo `NrtP@ssw0red#2024` or tokens. Use `process.env.*`. Redact logs.
5. **Tool use:** use `read` before `edit`; prefer `edit` over `write` for existing files; verify with `bash` (PowerShell syntax, no `&&`, no `head`).
6. **Docs sync:** after each module, update its spec + `CHANGELOG.md` (date, scope, endpoints).
7. **No mock auth in prod:** `axios-mock-adapter` `/jwt/*` mocks found in legacy bundle must NOT be copied. Use real JwtAuthGuard + refresh rotation.
8. **Ask when blocked:** live legacy API returns 404 (`https://ok-go.in/api/*`). If authenticated crawl needed, request HAR/export instead of retrying login loops.
9. **Small diffs:** scaffold MVP first, then iterate per `DEVELOPMENT_PLAN.md` phases.
