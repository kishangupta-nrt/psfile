# Tech Stack (locked)

- **Backend:** NestJS 10, TypeScript strict, Swagger (`/api/docs`), class-validator, Passport JWT + refresh rotation, CASL-style guard, Prisma ORM, PostgreSQL 16, Redis 7 + BullMQ (send/schedule/dlrs/exports/voice/wa), Nodemailer/SES (mail), S3-compatible storage (uploads/media), Socket.io (replaces `wss://` chat), Pino logs.
- **Frontend:** Next.js 14 App Router, TS, Tailwind + shadcn/ui, TanStack Query, Zustand (auth `nrtData` equivalent), Recharts, react-hook-form+zod.
- **Shared:** OpenAPI 3.1 (`project/shared/openapi.json`), generated TS types.
- **Infra:** Docker Compose (api, web, postgres, redis, worker, kannel-mock), GitHub Actions (lint/test/build/migrate), Nginx reverse proxy (replaces Apache).
- **Tooling:** Node 20 LTS, npm workspaces, ESLint+Prettier, Jest+Supertest, Playwright, k6.
- **Legacy compat:** keep `baseUrl` env `LEGACY_API_BASE=https://ok-go.in/api/` for reference; new `API_BASE=/api/v1`.
