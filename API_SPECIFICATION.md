# API Specification (new `/api/v1`, mapped from 225 legacy actions)

Auth header: `Authorization: Bearer <access_token>`. Legacy `POST https://ok-go.in/api/<legacy-path>` → new REST below. Legacy path in parentheses.

## Auth
- `POST /api/v1/auth/login` (`jwt/login`), `POST /api/v1/auth/register` (`jwt/register`), `POST /api/v1/auth/refresh` (`jwt/refresh-token`), `POST /api/v1/auth/logout` (`jwt/logout`), `POST /api/v1/auth/child-login` (`child-login`), `POST /api/v1/auth/change-password` (body: `email, currentPassword, newPassword ≥8 chars`), `PATCH /api/v1/auth/password`, `PATCH /api/v1/users/me`.
- Demo seed (in-memory MVP): `ADMIN_EMAIL`/`ADMIN_PASSWORD` (default `admin@local.dev` / `Admin@123`), `RESELLER_PASSWORD`, `CUSTOMER_PASSWORD` via env; bcrypt-hashed, never returned by `/users`. Login rejects wrong passwords with 401.

## SMS/Campaigns
- `POST /api/v1/campaigns` (`send-sms`, `two-ways-sms`), `GET /api/v1/campaigns` (`campaign-list`), `GET /api/v1/campaigns/:id` (`send-sms/:id`, `get-campaign-info/`), `POST /api/v1/campaigns/:id/repush` (`repush-campaign`), `POST /api/v1/campaigns/:id/stop` (`change-campaign-status-to-stop`), `GET /api/v1/campaigns/:id/status` (`get-campaign-current-status/`).

## Contacts/Blacklist/Senders/Templates
- `CRUD /api/v1/contact-groups`, `POST /api/v1/contact-groups/import` (`contact-numbers-import`), `GET /api/v1/contact-groups/sample` (`group-sample-file`).
- `CRUD /api/v1/contacts`, blacklist: `GET/POST /api/v1/blacklists` (`blacklists`, `blacklist`), `POST /api/v1/blacklists/import`, `POST /api/v1/blacklists/action` (`blacklist-action`).
- `CRUD /api/v1/sender-ids` (`manage-sender-ids`, `sender-id-*`), `POST /api/v1/sender-ids/assign` (`assign-sender-id`).
- `CRUD /api/v1/notification-templates` (`administration/notification-template*`).

## Reports/Exports
- `GET /api/v1/reports/campaigns` (`campaign-report`), `GET /api/v1/reports/scheduled` (`scheduled-campaign-report`), `GET /api/v1/reports/detailed` (`detailed-report`), `GET /api/v1/reports/delivery` (`delivery-report`), `GET /api/v1/reports/by-mobile` (`report-by-mobile`), `GET /api/v1/reports/by-time` (`get-report-by-time-frame`), `GET /api/v1/reports/monthly` (`month-wise-submission-report`), `GET /api/v1/reports/consumption` (`msg-consumption-report`), `GET /api/v1/reports/overview` (`overview-report-by-user`), `GET /api/v1/reports/daily` (`administration/get-daily-report`), `GET /api/v1/dlr/explain/:code` (`get-dlr-explanation/`).
- `POST /api/v1/exports/*` (`export-*`, `report-export-*`), `GET /api/v1/exports/:id/status` (`export-status/`), `GET /api/v1/exports/:id/download` (`download-export/`).

## Credits/Users/Admin
- `GET/POST /api/v1/credits` (`user-credits`, `user-credit`), `GET/POST /api/v1/credit-requests` + `POST /:id/reply` (`credit-request*`).
- `CRUD /api/v1/users` (`users`, `user/`), `POST /api/v1/users/:id/action` (`user-action`), `GET /api/v1/users-ddl` (`users-for-ddl`), `CRUD /api/v1/roles` + `GET /api/v1/permissions` (`roles`, `get-permissions`).
- Admin: `POST /api/v1/admin/manage-campaign`, `GET /api/v1/admin/kannel-status`, `POST /api/v1/admin/server-commands`, `CRUD /api/v1/admin/countries|routes|secondary-routes|app-settings`, `POST /api/v1/admin/assign-route`, `POST /api/v1/admin/set-ratio|priority`.

## Voice/WhatsApp/Email/API-dev
- Voice: `POST /api/v1/voice/uploads` + `/process`, `POST /api/v1/voice/campaigns`, `GET /api/v1/voice/campaigns`, `POST /:id/stop|resend`.
- WA: `GET /api/v1/whatsapp/campaigns` (`wa-campaigns`), `POST /api/v1/whatsapp/send` (`wa-send-message`), `POST /api/v1/whatsapp/pull-template(s)`, `POST /api/v1/whatsapp/uploads` (`upload-wa-file`), `GET /api/v1/whatsapp/analytics|conversation|template|summary`, `POST /api/v1/whatsapp/chatbots*`, phone `verify/register`.
- `GET /api/v1/email-campaigns`; API-dev: `GET /api/v1/api-docs` (`administration/documents`), `POST /api/v1/api-keys/rotate` (`user-change-api-key`), `CRUD /api/v1/ip-whitelist`, `POST /api/v1/webhooks`.
- Webhooks inbound: `POST /api/v1/webhooks/dlr/:vendor`, `POST /api/v1/webhooks/wa/:vendor`, `POST /api/v1/webhooks/voice/:vendor`.

Full OpenAPI: `project/shared/openapi.json` (to generate). DLT paths absent by design.
