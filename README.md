# ٹھیکیدار رجسٹر — Thekedar Register (Next.js + MongoDB)

Contractor / site-labor ledger app — Next.js (App Router + TypeScript + Tailwind CSS v4), MongoDB (via Mongoose) for data, JWT cookie sessions for auth.

## Auth
- Real signup/login with name + email + password (passwords hashed with bcrypt).
- **Admin approval required**: new accounts sign up with `status: "pending"` and cannot log in until an admin approves them at `/admin`.
  - Bootstrap your first admin by setting `ADMIN_EMAIL` in `.env.local` — the first account that signs up with that exact email is auto-created as `role: "admin"`, `status: "approved"`, so it can log in immediately and approve everyone else.
  - Logging in with a `pending` account shows a "Pending Approval" screen; a `rejected` account shows an "Access Denied" screen (both on `/login`).
- On login/signup, a JWT is issued (`lib/jwt.ts`) and set as an **httpOnly cookie** (`token`).
- `/api/auth/me` restores the session on page load; `/api/auth/logout` clears the cookie.
- All data API routes check this cookie (`lib/auth.ts` → `getUserFromRequest`) and scope every query to `userId`, so each account only ever sees its own labors/owners/expenses.
- `/login` is the only public route — `components/layout/AppShell.tsx` redirects everything else to it when there's no valid session, and redirects away from `/login` once logged in.
- `/admin` is visible in the sidebar only for `role: "admin"` accounts, and lets you approve/reject any pending or existing account.

## Data
All app data now lives in MongoDB instead of localStorage:
- `models/User.ts`
- `models/Labor.ts`
- `models/Owner.ts`
- `models/Expense.ts`

`context/DataContext.tsx` fetches these from the API on login and exposes the same CRUD functions the pages already used (`addLabor`, `editLabor`, `markAttendance`, `addDeal`, `receiveMoney`, etc.) — just async now, calling the API instead of writing to localStorage.

## Routes
- `/` — dashboard overview
- `/mazdoor` — labor (مزدور)
- `/malik` — owners/contracts (مالک)
- `/kharcha` — expenses (خرچہ)
- `/site` — site-wise summary

### API routes
```
POST /api/auth/register        { name, email, password }
POST /api/auth/login           { email, password }
POST /api/auth/logout
GET  /api/auth/me

GET  /api/labors                     POST /api/labors
PATCH/DELETE /api/labors/:id
POST /api/labors/:id/attendance      { date }
POST /api/labors/:id/expense         { date, amount, note }

GET  /api/owners                     POST /api/owners
PATCH/DELETE /api/owners/:id
POST /api/owners/:id/deal            { date, amount, desc }
POST /api/owners/:id/receipt         { date, amount, from }

GET  /api/expenses                   POST /api/expenses
PATCH/DELETE /api/expenses/:id

GET   /api/admin/users               (admin only — list all accounts)
PATCH /api/admin/users/:id           { status: "approved" | "rejected" | "pending" }  (admin only)
```

## Setup
1. Have a MongoDB instance running (local `mongod`, Docker, or Atlas).
2. Copy `.env.local` (already included) and set:
   ```
   MONGODB_URI=mongodb://localhost:27017/contract_management
   JWT_SECRET=change-this-to-something-long-and-random
   ADMIN_EMAIL=you@yourdomain.com
   ```
   (`JWT_SECRET` falls back to `MY_SECRET_KEY` if unset — please set your own for anything beyond local testing.)
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000/login, sign up with the exact email you put in `ADMIN_EMAIL` — that account is auto-approved as admin and can log in right away. Everyone else who signs up afterward will need that admin to approve them at `/admin`.

> This sandbox couldn't reach an actual MongoDB server (no network access to a DB in this environment), so the API routes are verified by build + type-check only, not a live run. Please test the signup/login flow and a couple of CRUD actions once you have MongoDB reachable — happy to fix anything that comes up.

## Not carried over (can be added back on request)
- The canvas/html2canvas "share as image to WhatsApp" export was simplified to a plain WhatsApp text-message link.
- No server-side route middleware yet — the app gates pages client-side (same pattern as before, now backed by a real session check via `/api/auth/me`). Can add `middleware.ts` to also protect routes at the edge if you want defense-in-depth.

## Project structure
```
src/
  app/
    api/                # auth + labors/owners/expenses routes
    mazdoor/ malik/ kharcha/ site/   # pages
  components/
    layout/           # sidebar, app shell, login/signup screen
    ui/               # Modal, Toast, ConfirmProvider, HistoryModal, Field inputs, StatCard
    labor/ owner/ expense/   # feature-specific modals
  context/            # DataContext (API-backed CRUD), AuthContext (session)
  lib/                # types.ts, mongoose.js, jwt.ts, auth.ts
  models/             # User, Labor, Owner, Expense (Mongoose schemas)
```
