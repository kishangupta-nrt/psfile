# Deployment

- `project/docker-compose.yml`: `api (NestJS:3001)`, `web (Next.js:3000)`, `postgres:16`, `redis:7`, `worker (BullMQ)`, `kannel-mock`, `nginx (:80→web/api)`.
- Env: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `S3_*`, `SMS_VENDOR_*`, `WA_*`, `SMTP_*`. Examples in `project/backend/.env.example`, `project/frontend/.env.example`. Never commit real `.env`.
- CI (GitHub Actions): lint → test → prisma validate → build → docker push → migrate on deploy.
- Backups: pg_dump nightly + WAL; Redis AOF; S3 versioning.
- Cutover from Apache/PHP: freeze credits, export users/wallets/campaigns, import via `prisma/seed`, verify balances, switch Nginx upstream to Node, keep PHP read-only 7d.
