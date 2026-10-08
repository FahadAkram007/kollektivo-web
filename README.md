# KollektivO Shop-Portal (kollektivo-web)

Web portal for partner shops: create payment codes at the till, accept printed-QR payments,
see payments, manage the shop profile and team. German only, made for tablets and phones at the
counter (installable as a web app).

Stack: Next.js (App Router), Tailwind CSS, TanStack Query, Firebase Auth (session only),
typed API client generated from `kollektivo-api/openapi.json`.

## Run locally

1. Start the API (`kollektivo-api`: `npm run start:dev`, port 3000).
2. `cp .env.example .env.local` and fill in the Firebase web config
   (`firebase apps:sdkconfig WEB --project kollektivo-dev`).
3. `npm install`, then `npm run dev` → http://localhost:3001

Shops are created by KollektivO (`npm run partner:create` in the API); the owner gets an invite email.
Demo shops (`npm run db:seed:demo` in the API) have owner logins like `inhaber@shop-bakery.example`;
the sign-in code appears in the API log.

## Scripts

- `npm run api:types` – regenerate `src/lib/api-types.ts` after API changes (`npm run openapi` in the API first)
- `npm run lint`, `npm test`, `npm run build`, `npm run format`

## Structure

- `src/app/` – routes (German paths: `/anmelden`, `/kasse`, `/zahlungen`, `/profil`, `/team`, `/qr-code`)
- `src/features/<feature>/` – components, hooks and API calls per feature
- `src/components/ui/` – shared building blocks (buttons, inputs)
- `src/lib/` – API client, Firebase, formatting
