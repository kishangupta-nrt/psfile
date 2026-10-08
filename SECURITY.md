# Security

- JWT Bearer, short-lived access + rotating refresh; `encryptKey NewRiseInc` legacy constant REMOVED — use `JWT_SECRET` env 32+ bytes.
- Passwords bcrypt(12); reset via single-use token; 2FA route retained (TOTP).
- RBAC server-side always; reseller horizontal isolation; `child-login` audited + banner "impersonating".
- API keys hashed (sha256), IP whitelist CIDR check, `enable-additional-security` toggle enforces 2FA+IP for api_user.
- Uploads: mime/size limits, AV scan hook, S3 private + presigned GET; no PHP execution (no Apache).
- Webhook HMAC verification per vendor; DLR replay protection (idempotency on messageId).
- Headers: helmet, CSP strict, HSTS, rate-limit login 5/min/IP, PII redaction in logs. Secrets only via env. Rotate shared owner password immediately.
