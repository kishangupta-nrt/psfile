# Project Requirements

## Goal
Rebuild `app.ok-go.in` (NRT-SMS bulk messaging reseller panel) from legacy PHP backend to modern **NestJS + Next.js**, preserving all non-DLT features.

## In scope (non-DLT)
Auth (login/register/refresh/logout, 2FA route `/two-factor-authentication`, reset-password, child-login/impersonation), Dashboard, Send SMS (`send-sms`, `two-ways-sms`), Campaigns (`campaign-list`, `repush-campaign`, `change-campaign-status-to-stop`), Contacts/Phonebook (`contact-groups`, `contact-numbers`, import/sample-file), Blacklist (`blacklists`, import/action), Sender IDs (plain list/view/create/edit/delete + `assign-sender-id`), Templates (notification-templates only; DLT excluded), Reports (`campaign-report`, `scheduled-campaign-report`, `detailed-report`, `delivery-report`, `report-by-mobile`, `report-by-time-frame`, `month-wise-submission-report`, `msg-consumption-report`, exports), Credits/Wallet (`user-credits`, `user-credit`, `credit-requests`, `credit-request-reply`), Users/Roles (`users`, `roles`, `get-permissions`, `user-action`), Reseller hierarchy (`users-for-ddl`, `child-login`), API docs/keys (`administration/documents`, `user-change-api-key`, `ip-white-list-for-api*`, `enable-additional-security`, webhooks `add-webhook-url`), Voice (`voice-sms`, `voice-upload`, `voice-campaign-list`, `voice-file-list`, `voice-file-process`, `bulk-voice-file-action`, `manage-voice-campaign`), WhatsApp (`wa-campaigns`, `wa-send-message`, `wa-pull-template*`, `upload-wa-file`, `wa-charges`, `set-wa-charge`, analytics `get-analytics`, `get-conversation-analytics`, `get-template-analytics`, summary `get-wa-summery`, chatbot `wa-chatbots*`, phone-number verify/register), Email campaigns (`email-campaigns`), Notifications (`notifications`, `unread-notification-count`), Invoices (`apps/invoice/*`), Admin ops (`administration/*`: manage-campaign, server-commands, kannel-status, countries, routes, dlrcode vendor list, app-settings).

## Out of scope
DLT fully excluded: `dlt-templates*`, `dlt-template-group*`, `/dlt-template-list`, `/template-group-list`, `summary-report-by-template-group`, DLT assign/priority/import. Return `DLT_DISABLED`.

## Constraints
- Live legacy API `https://ok-go.in/api/*` currently 404 (verified 2026-09-28); rebuild from static mapping + owner HAR when available.
- Must keep kebab-case route parity; Vuexy invoice/user screens retained.
- Apache → Docker (Node 20+, Postgres 16, Redis 7).
- NFRs: 99% delivery-report accuracy, bulk 10k SMS enqueue < 30s, DLR webhook < 60s, audit all credit mutations.
