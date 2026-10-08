# Website Map — app.ok-go.in (primary reference, static analysis 2026-09-28)

Source: `https://app.ok-go.in/authentication` + `main.203e21be.chunk.js` + chunks 18–147. Live `/api/*` → 404, so authenticated payloads are UNVERIFIED; structure below is from observable bundle strings.

## 1. Pages/routes (SPA, Vuexy base)
Public: `/authentication` (login), `/register-user`, `/two-factor-authentication`, `/whatsapp-policy`, `/forgot-password` (inferred).
App: `/dashboard`, `/admin-send-sms`, `/admin-send-two-ways-sms`, `/admin-manage-campaign`, `/admin-credit-list`, `/admin-all-voice-status`, `/send-sms` (via `add_sms`), `/two-way-message`, `/campaign-report`, `/scheduled-campaign-report`, `/message-campaign-report` (consumption), `/detailed-report`, `/export-report`, `/report-by-mobile-number`, `/report-by-time`, `/month-wise-report`, `/consumption-report`, `/overview`, `/create-phone-book`, `/phone-book`, `/group`, `/blacklist`, `/sender-list`, `/api-documentation`, `/api-key`, `/users`, `/users-list`, `/role-list`, `/user-credit-report`, `/user-monthly-report`, `/credit-request`, `/daily-report`, `/voice-sms`, `/voice-upload`, `/voice-message`, `/voice-report`, `/send-whatsapp`, `/whatsapp-media`, `/whatsapp-message-template`, `/whatsapp-message-configuration`, `/whatsapp-message-report`, `/whatsapp-summary-report`, `/whatsapp-conversation-report`, `/whatsapp-analytics-report`, `/whatsapp-template-report`, `/whatsapp-chatbots-self-webhook`, `/whatsapp-rate-card`, `/notification`, `/notification-template`, `/send-notification`, `/login-user-log`, `/country-list`, `/routes` (+secondary), `/user-route`, `/profile`, `/apps/invoice/*`, `/apps/user/*`, `/get-kannel-status`.
Removed (DLT_DISABLED): `/dlt-template-list`, `/template-group-list`, `/report-by-template-group`.

## 2. UI components
Vuexy: vertical sidebar (grouped nav), top navbar (search, balance, `unread-notification-count`, avatar/profile dropdown), cards, server tables, filter bars (date/sender/mobile/campaign), export buttons with `export-status/` polling → `download-export/`, modals (DLR explain `get-dlr-explanation/`, campaign info `get-campaign-info/`), toasts (`showSuccessToast/showErrorToast`), file-upload wizards with sample-file links, timezone select (`get-all-timezones`), charts (overview/daily/WA analytics).

## 3. User flows
Signup→login (`nrtData`+`access_token`)→dashboard→credit-request→phonebook import→plain sender→send (quick/bulk/dynamic/schedule)→campaign/detailed/delivery reports→export. Reseller: create user→`user-credit`→`assign-route-to-user`→user-wise reports. Voice: upload→process→send→stop. WA: pull template→send→analytics. API dev: docs→rotate key→IP whitelist→webhook.

## 4. Forms & validations
Login (email+password, Terms+SMS-consent checkbox on register), send-SMS (sender select, message counter 160/Unicode, mobiles/file, schedule+timezone), contacts import (CSV + sample), blacklist add/import, credit-request (amount+note), voice upload (audio mime), WA send (to+template+lang+vars), profile/password change, role abilities checkboxes.

## 5. API calls (observable)
Base `https://ok-go.in/api/` + `Bearer`. 225 `action→path` mappings (see `API_SPECIFICATION.md`): `send-sms`, `campaign-list`, `repush-campaign`, `change-campaign-status-to-stop`, `contact-groups/numbers`, `blacklists`, `manage-sender-ids`, `notification-templates`, `delivery/detailed-report`, `export-*`, `credit-requests`, `users/roles/permissions`, `voice-sms/upload`, `wa-campaigns/send-message/pull-template`, `administration/*` (kannel, server-commands, countries, routes, app-settings). JWT `/jwt/*` mocked in bundle via `axios-mock-adapter` — NOT copied; real guard implemented.

## 6–9. Data/Auth/Dashboard/Admin/Integrations
Dashboard: balance, today submitted/delivered, recent campaigns, kannel dot. Auth: JWT 15m + refresh, `child-login` impersonation, login-log. Admin: manage-campaign, credit list, voice status, gateway, countries/routes, rate-cards, documents. Integrations: Kannel/SMPP, WA Cloud, voice vendor, SES/SMTP, S3 — all behind `SmsProvider/WhatsAppProvider/VoiceProvider/WalletProvider` mocks; real endpoints via env only (TODO).
