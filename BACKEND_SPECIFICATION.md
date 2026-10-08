# Backend Specification (NestJS 10)

- Structure: `src/modules/<domain>/{controller,service,repo,dto,guard.spec}` + `src/common/{auth,abilities,queue,storage,vendor}` + `prisma/schema.prisma`.
- Auth: JWT access 15m + refresh 7d rotation (reuse detection), bcrypt 12, `child-login` scoped tokens, IP-whitelist guard for `api_user`, login-log rows.
- Abilities: `AbilitiesGuard` reads `roles.abilities`; reseller scoping by `ownerId` closure table (self + descendants).
- Queue: BullMQ `sms-send` (concurrency 50, rate limit per route), `sms-schedule`, `dlr-ingest`, `export`, `voice-process/send`, `wa-send`. Idempotency-Key on `POST /campaigns`.
- Vendor abstraction: `SmsVendor` (Kannel HTTP/SMPP), `VoiceVendor`, `WaVendor` (Cloud API) with mock for dev (`kannel-mock`).
- Validation: DTO + `ValidationPipe`, E.164 normalization, blacklist/invalid-series filter, 160-char/Unicode segmentation + cost calc.
- Observability: Pino, `/health`, `/metrics` (Prometheus), OpenTelemetry optional. Swagger `/api/docs`.
- No DLT module. Any `dlt*` import fails lint (`no-restricted-paths`).
