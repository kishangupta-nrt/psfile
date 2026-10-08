# UI/UX Design

Base: Vuexy React admin (legacy) → Tailwind + shadcn/ui in Next.js. Keep IA, modernize visuals.

## Layout
Auth split-screen (logo `nrt.912b8864.png`, tagline "start the adventure", Terms + SMS-consent checkbox). App shell: left nav (Dashboard, Messaging, Phone Book, Reports, Credits, Voice, Whatsapp, API, Admin), topbar (credit balance, unread-notification-count, profile), content cards.

## Key screens (non-DLT)
- Dashboard: balance, today's submitted/delivered, campaign mini-table, kannel status dot.
- Send SMS: tabs Quick/Bulk/Dynamic/Schedule; sender-id select (plain), template select (notification-templates), character counter (160/Unicode), file upload with `normal-sms-campaign-file` sample, timezone picker (`get-all-timezones`), schedule.
- Reports: filter by date/sender/mobile/campaign; DLR explanation modal (`get-dlr-explanation/`); export with `export-status/` polling → `download-export/`.
- Phonebook/Blacklist: groups table, numbers import wizard, blacklist-action toggles.
- Credits: balance, `credit-request` form, history, invoices (`apps/invoice`).
- Voice/WhatsApp: upload → process → send → status/stop flows; WA template gallery + analytics charts.
- Admin: manage-campaign table (stop/complete/repush), server-commands terminal card, routes assign, countries CRUD.

## Conventions
kebab-case routes; empty states with sample-file links; toasts for `showSuccessToast/showErrorToast`; tables server-paginated; all dates Asia/Kolkata default + timezone override.
