# Admin Specification

Routes: `/admin-send-sms`, `/admin-send-two-ways-sms`, `/admin-manage-campaign`, `/admin-credit-list`, `/admin-all-voice-status`, plus `administration/*` APIs.

Capabilities:
- Manage Campaign: list all reseller campaigns, stop/complete/repush, change-status-to-complete, reupdate-pending-status.
- Credit List: `user-wise-credit-info`, add/reverse with mandatory note → audit.
- Voice Admin: `get-all-voice-file-by-status`, `bulk-voice-file-action`, `check-voice-file-status`, `manage-voice-campaign`.
- Gateway: `get-current-kannel-status`, `informing-user-about-server`, `server-commands` (allowlisted commands only), `server-info`.
- Master: countries, invalid-series, dlrcode vendor list/import, notification-templates, secondary-routes, assign-route, set-ratio/priority, app-settings, documents, user-wise-monthly-reports.
- All admin actions write `audit_logs` + `notifications` to affected users. DLT admin screens removed.
