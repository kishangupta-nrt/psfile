# Frontend Specification (Next.js 14)

- App Router groups: `(auth)/authentication|register-user|two-factor-authentication`, `(app)/dashboard|send-sms|campaign-report|...`, `(admin)/admin-*`. DLT routes deleted → middleware redirects to `/dashboard`.
- Data: TanStack Query keyed by new REST; Zustand `useAuth` (replaces `localStorage nrtData`): `{user, accessToken, abilities}`; `AbilityContext` filters nav.
- Forms: react-hook-form+zod; file uploads to S3 presigned; timezone select via `GET /api/v1/meta/timezones`.
- Tables: server pagination/sort/filter; export buttons poll `exports/:id/status`.
- Charts: Recharts for overview/daily/monthly/WA analytics.
- i18n ready (en default), theme light/dark, a11y AA, Playwright e2e for login→send→report→export.
- Env: `NEXT_PUBLIC_API_BASE=http://localhost:3001/api/v1`.
