# NRT-SMS Frontend (local-dev, Next.js 14)

Local-dev UI talking to the NestJS backend at `NEXT_PUBLIC_API_BASE`
(default `http://localhost:3001/api/v1`). No external credentials.
No hard-coded vendor endpoints. DLT routes removed by design.

## Install / Run

```bash
npm install
npm run dev
```

Build / start:

```bash
npm run build
npm start
```

App: http://localhost:3000 — `/` redirects to `/authentication` or `/dashboard`
based on `localStorage.nrtData`.

## Env

| Var | Default | Purpose |
|-----|---------|---------|
| `NEXT_PUBLIC_API_BASE` | `http://localhost:3001/api/v1` | NestJS backend base URL (all `lib/api.ts` calls derive from this) |

Copy `.env.example` to `.env.local` for local overrides:

```bash
cp .env.example .env.local
```

## Mock behavior

Every page tries the live backend first via `lib/api.ts`
(Bearer `nrtData.access_token`, error shape `{code,message}`),
then falls back to `lib/mock.ts` offline data with a notice:

> Backend unreachable — showing mock data. Start backend at NEXT_PUBLIC_API_BASE to see live data.

- `dashboard` tries `GET /dashboard/summary`, then `GET /dashboard`, then mock.
- All other pages use try/catch + mock fallback (lists, forms still render offline).
- Login (`/authentication`) requires the backend; token + user + abilities persist as `nrtData`.

## Routes

`/dashboard`, `/send-sms`, `/campaigns`, `/campaign-report`, `/contacts`,
`/blacklist`, `/sender-list`, `/credits`, `/credit-request`, `/voice-sms`,
`/voice-upload`, `/send-whatsapp`, `/whatsapp-message-report`,
`/api-documentation`, `/users-list`, `/admin-manage-campaign`,
`/authentication`. `/dlt*` and `/template-group-list` redirect to `/dashboard`
(`DLT_DISABLED`, see `middleware.ts`).
