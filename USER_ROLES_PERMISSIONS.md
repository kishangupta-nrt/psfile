# User Roles & Permissions (CASL-compatible)

Legacy ability shape: `{action: "<kebab>", resource: "all"}` stored in `nrtData.ability`. Frontend `navLink` gated; backend must enforce via guard.

## Roles
- **super_admin**: `adminOperation` + all. Access `/admin-*`, `administration/*`, server-commands, kannel-status, user-wise credit/ratio/priority.
- **reseller**: create `users`, `user-credit` add/reverse, `assign-route-to-user`, `assign-sender-id`, view `user-wise-monthly-reports`, `overview-report-by-user`. `child-login` impersonation allowed (audit).
- **customer**: `send-sms`, `campaign-list`, contacts/blacklist own, `delivery-report` own, `credit-request` create, whatsapp/voice own.
- **api_user**: HTTP API only, IP-whitelist enforced (`ip-white-list-for-api`), `user-change-api-key` self.

## Key abilities (from bundle)
`dashboard`, `campaign-list`, `send-sms`, `repush-campaign`, `contact-groups`, `blacklist`, `sender-id-list/view/create/edit/delete`, `report-view`, `credit-request`, `user-credit-add/reverse`, `voice-sms`, `voice-file-list`, `wa-campaigns`, `wa-send-message`, `notifications`, `roles`, `get-permissions`, `server-info`, `manage-campaign`.
DLT abilities (`dlt-template-action`, `is-visible-dlt-template-group`) **deleted** — any token containing them is stripped on login.

## Enforcement
NestJS `AbilitiesGuard` + `@CheckAbility(action, resource)`. Reseller scoping: `where: {ownerId: req.user.sub OR self}`. Admin bypass with audit log. Frontend `AbilityContext` mirrors for nav filtering only.
