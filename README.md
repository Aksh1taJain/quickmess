# QuickMess

QuickMess is a production-oriented college mess lunch ticketing app built with React + Vite + Tailwind, Node.js + Express, PostgreSQL, Razorpay test mode, and backend-generated QR tickets.

## What is included

- Student home, today's lunch menu, weekly lunch menu, buy lunch ticket, payment success, and QR ticket pages.
- Admin login, sold-ticket dashboard, and online ticket verifier.
- No student login. Students enter name, enrollment number, phone, and lunch date while buying.
- Lunch only. Ticket price is fixed at ₹80 in both frontend display and backend validation.
- No frontend menu/ticket hardcoding. Menu, ticket creation, payment confirmation, ticket lookup, and verification all call backend APIs.
- Provider architecture for future integrations:
  - `MenuProvider` currently reads PostgreSQL and can later call a college menu API.
  - `TicketProvider` currently reads/writes PostgreSQL and owns verification state.
  - `PaymentProvider` currently uses Razorpay test mode and can later be replaced.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Razorpay test keys

## Environment setup

```bash
cp .env.example .env
```

Update `.env`:

- `DATABASE_URL` PostgreSQL connection string
- `JWT_SECRET` long random secret for admin tokens
- `ADMIN_USERNAME` initial staff username
- `ADMIN_PASSWORD` initial staff password
- `RAZORPAY_KEY_ID` Razorpay test key ID
- `RAZORPAY_KEY_SECRET` Razorpay test key secret
- `VITE_RAZORPAY_KEY_ID` frontend Razorpay test key ID
- `VITE_API_URL` backend API URL for the frontend
- `FRONTEND_URL` allowed CORS origin
- `COLLEGE_API_BASE_URL` optional future college API base URL

## Install and database setup

The lockfile is generated from `package.json`; use `npm install` after pulling dependency changes.

```bash
npm install
createdb quickmess
npm run migrate
```

## Run locally

Use two terminals:

```bash
npm run dev:api
```

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend health check: http://localhost:5000/api/health

## API routes

### Menu

- `GET /api/menu/today`
- `GET /api/menu/week`

### Student ticket flow

- `POST /api/tickets/create-order`
- `POST /api/tickets/confirm-payment`
- `GET /api/tickets/:ticketId`

### Staff/admin flow

- `POST /api/admin/login`
- `GET /api/admin/tickets`
- `POST /api/tickets/:ticketId/verify`

## Database schema

Migrations live in `server/db/migrations` and create:

- `admins`
- `menus`
- `tickets`
- `payments`

`server/db/migrations/001_initial.sql` also seeds the weekly lunch menu in PostgreSQL so the frontend can load menu data from the backend immediately.

## QR verification model

The QR payload contains only the `ticketId`. Staff verification requires internet and calls `POST /api/tickets/:ticketId/verify`, which checks the backend ticket status and marks a valid active ticket as `USED`.
