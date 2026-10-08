# Development Plan (phased, docs-first)

- **P0 Discovery (done):** static bundle mapping (225 endpoints, 30+ routes). Pending: owner HAR for authenticated payloads.
- **P1 Docs (done):** 21 MDs. Keep in sync per change.
- **P2 Scaffold (next):** `project/` monorepo, compose, Prisma init, NestJS modules stub + Swagger, Next.js routes stub, OpenAPI export.
- **P3 Auth/Users/Roles/Wallet:** login/refresh/child-login, CRUD users/roles, wallet + credit-requests + audit. E2E pass.
- **P4 Messaging core:** contacts/blacklist/senders/notify-templates, send/list/stop/repush, DLR webhook, reports/exports.
- **P5 Voice/WA/Email/API-dev/Notifications/Invoices/Admin:** per specs.
- **P6 Hardening:** rate-limit, IP whitelist, 2FA, backups, metrics, k6, Playwright, staging parity review.
- **P7 Cutover:** PHP data dump → Prisma seed, dual-run, DNS switch from Apache to Nginx/Node.

Estimates (1 dev): P2 1d, P3 3d, P4 5d, P5 6d, P6 3d, P7 2d.
