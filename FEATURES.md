# Features (verified via static bundle analysis)

Source: `https://app.ok-go.in/static/js/main.203e21be.chunk.js` + chunks 18–147. Live login not possible (API 404); mark authenticated-only behavior UNVERIFIED until HAR.

## SPA routes (parity list, DLT removed)
`/authentication`, `/register-user`, `/two-factor-authentication`, `/dashboard`, `/admin-send-sms`, `/admin-send-two-ways-sms`, `/admin-manage-campaign`, `/admin-credit-list`, `/admin-all-voice-status`, `/send-sms` (via `add_sms`), `/two-way-message`, `/campaign-report`, `/scheduled-campaign-report`, `/message-campaign-report`, `/detailed-report`, `/export-report`, `/report-by-mobile-number`, `/report-by-time`, `/month-wise-report`, `/consumption-report`, `/overview`, `/create-phone-book`, `/phone-book`, `/group`, `/blacklist`, `/sender-list`, `/api-documentation`, `/api-key`, `/users`, `/users-list`, `/role-list`, `/user-credit-report`, `/user-monthly-report`, `/credit-request`, `/daily-report`, `/voice-sms`, `/voice-upload`, `/voice-message`, `/voice-report`, `/send-whatsapp`, `/whatsapp-media`, `/whatsapp-message-template`, `/whatsapp-message-configuration`, `/whatsapp-message-report`, `/whatsapp-summary-report`, `/whatsapp-conversation-report`, `/whatsapp-analytics-report`, `/whatsapp-template-report`, `/whatsapp-chatbots-self-webhook`, `/whatsapp-rate-card`, `/notification`, `/notification-template`, `/send-notification`, `/login-user-log`, `/country-list`, `/routes` (primary/secondary), `/user-route`, `/profile`, `/apps/invoice/*`, `/apps/user/*`, `/whatsapp-policy`, `/get-kannel-status`.
REMOVED: `/dlt-template-list`, `/template-group-list`, `/report-by-template-group`.

## API actions (225 mapped, sample)
Auth: `child-login`, `update-self-password`, `change-password`, `reset-user-password`, `update-profile`, `enable-additional-security`.
SMS: `send-sms`, `campaign-list`, `repush-campaign`, `change-campaign-status-to-stop`, `get-campaign-info/`, `get-campaign-current-status/`, `delivery-report`, `detailed-report`, `export-*`, `normal-sms-campaign-file`, `custom-sms-campaign-file`.
Contacts: `contact-groups`, `contact-numbers`, `contact-numbers-import`, `group-sample-file`.
Blacklist: `blacklists`, `blacklist-action`, `blacklists-import`.
Sender: `manage-sender-ids`, `sender-id-list/view/create/edit/delete`, `assign-sender-id`.
Reports: `scheduled-campaign-report`, `report-by-mobile`, `get-report-by-time-frame`, `month-wise-submission-report`, `msg-consumption-report`, `consumption-report-by-view`, `overview-report-by-user`, `administration/get-daily-report`, `administration/user-wise-monthly-report*`.
Credits: `user-credits`, `user-credit`, `credit-requests`, `credit-request-reply`, `administration/user-wise-credit-info`.
Users/Roles: `users`, `user/`, `user-action`, `users-for-ddl`, `roles`, `role/`, `get-permissions`, `get-all-permissions`, `view-login-log`.
Gateway/Admin: `administration/manage-campaign`, `administration/get-current-kannel-status`, `administration/server-commands`, `administration/informing-user-about-server`, `server-info`, `administration/assign-route-to-user`, `administration/get-user-route-info`, `administration/set-user-ratio`, `administration/change-user-priority-for-send-sms`, `administration/secondary-route*`, `countries`, `administration/country*`, `administration/app-setting-update`, `get-app-setting`.
Voice: `voice-sms`, `voice-upload`, `voice-campaign-list`, `voice-file-list`, `administration/voice-file-process`, `administration/bulk-voice-file-action`, `administration/manage-voice-campaign`, `change-voice-campaign-status-to-stop`, `resend-this-voice-sms`, `administration/sync-voice-template-to-vendor`.
WhatsApp: full `wa-*` set (see requirements) + `get-analytics`, `get-wa-summery`, `export-wa-report`, `wa-chatbots*`.
API dev: `administration/documents`, `document-code-lang`, `user-change-api-key`, `ip-white-list-for-api*`, `add-webhook-url`, `get-webhook-*`.
Full table: see `API_SPECIFICATION.md`.
