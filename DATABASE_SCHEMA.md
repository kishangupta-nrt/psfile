# Database Schema (PostgreSQL + Prisma, no DLT)

## Core
- `users(id, uuid, email unique, passwordHash, name, phone, role[super_admin|reseller|customer|api_user], ownerId FK users, status, createdAt)`; index(ownerId).
- `roles(id, name unique, abilities JSONB [{action, resource}])`.
- `wallets(userId PK, balanceCredits, lockedCredits, updatedAt)` + `wallet_txns(id, userId, delta, reason[campaign|topup|reversal|adjust], refId, meta, createdBy, createdAt)` — every mutation audited.
- `credit_requests(id, userId, amount, status[pending|approved|rejected], reply, createdAt)`.
- `sender_ids(id, userId, sender, status[pending|approved|rejected], createdAt)` — plain only, no DLT columns.
- `notification_templates(id, name, body, lang, createdBy)`.
- `contact_groups(id, ownerId, name)`; `contacts(id, groupId, mobile E.164, name, vars JSONB, status)`; `blacklists(mobile PK, reason, createdAt)`.
- `campaigns(id, ownerId, type[sms|two_way|voice|wa|email], senderId, message, filePath, scheduledAt, timezone, status[queued|sending|stopped|completed|failed], total, delivered, failed, createdAt)`; `messages(id, campaignId, mobile, status[pending|sent|delivered|failed|dnd], dlrCode, dlrText, cost, sentAt)`.
- `voice_files(id, ownerId, filePath, status, vendorId)`; `wa_templates(id, name, lang, body, status)`; `wa_campaigns(id, ownerId, templateId, ...)`; `email_campaigns(...)`.
- `api_keys(id, userId, keyHash, ips TEXT[], enabled, lastUsed)`; `webhooks(id, userId, event, url, secret)`; `notifications(id, userId, title, body, readAt)`; `invoices(...)`; `login_logs(id, userId, ip, ua, at)`; `audit_logs(id, actorId, action, entity, entityId, diff, at)`.
- `countries(id, code, name, dial)`, `routes(id, name, type[smpp|secondary], priority)`, `user_routes(userId, routeId, ratio)`; `app_settings(key PK, value JSONB)`.

## Rules
- Credit decrement in TX with `wallet_txns` row; never negative (check constraint).
- Mobile normalized to E.164 + `blacklists`/`invalid-series` check before enqueue.
- Drop all legacy `dlt_*` tables. Migration `0001_init` documents removal.
- See `project/backend/prisma/schema.prisma` (scaffold).
