# System Architecture

```
[Next.js web] --REST /api/v1 + JWT--> [Nginx] --> [NestJS API]
      |                                       |--> [Postgres 16] (Prisma)
      |--Socket.io (chat/notify)--> [NestJS WS]--> [Redis 7 + BullMQ workers]
                                                        |--> [Vendor GW: Kannel/SMPP/HTTP, WA Cloud, Voice vendor]
                                                        |--> [S3 uploads] [SES mail] [DLR webhooks in]
```

## Backend modules (NestJS)
`auth`, `users`, `roles`, `credits`, `contacts`, `blacklists`, `senders`, `templates(notify-only)`, `campaigns`, `reports`, `exports`, `voice`, `whatsapp`, `email-campaigns`, `api-keys`, `webhooks`, `notifications`, `invoices`, `admin`, `audit`.

## Key flows
- **Send SMS:** `POST /api/v1/campaigns` → validate balance/sender → persist `campaign+messages(pending)` → BullMQ `sms-send` (rate-limited per route/user-priority) → vendor → DLR callback `POST /api/v1/webhooks/dlr/:vendor` → update + decrement wallet atomically + audit.
- **Schedule:** `scheduledAt + timezone` → delayed job; `change-campaign-status-to-stop` cancels.
- **Export:** request → `export-status/:id` polling → `download-export/:id` signed URL.
- **Voice/WA:** upload → `voice-file-process` worker → send workers → status/stop endpoints.
- **Reseller:** `child-login` issues scoped token with `impersonatedBy`, audited.

## DLT exclusion
No DLT service/tables/queues. Gateway `DLT_DISABLED` guard returns 410. Frontend DLT nav removed.
