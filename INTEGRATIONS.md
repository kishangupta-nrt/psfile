# Integrations

- **SMS Gateway:** Kannel HTTP + SMPP primary/secondary routes, ratio/priority per user. Endpoints: send, balance, DLR push. Mock `kannel-mock` in compose for dev.
- **Voice vendor:** file upload → process callback → send → status/stop; `sync-voice-template-to-vendor`.
- **WhatsApp Cloud:** phone register/verify, template pull, send message/reply, media upload/download, quality-check, debug-token, subscribed-apps, ecommerce/commerce settings, conversation/template analytics, rate-card.
- **Email:** SES/SMTP for `email-campaigns` + transactional (reset, credit-approved).
- **Storage:** S3-compatible (campaign files, voice, WA media, documents).
- **DLR/Webhooks out:** `add-webhook-url` per event (`delivery`, `wa-inbound`, `voice-status`); retries with backoff, signing secret.
- **No DLT vendor** integration.
