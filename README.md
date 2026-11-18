# ReliefMesh

Disaster-management and emergency-response coordination platform connecting
citizens, operators, responders and organisations.

Status: **Days 1–4 of the build schedule complete.** Auth/roles, the full
incident lifecycle (report → verify → assign → respond → resolve → close),
the interactive map, volunteer registration, resource allocation, Guardian
device monitoring (simulated), in-app notifications, dashboard charts, rate
limiting + audit logging, and a Playwright e2e suite are all in and working
against a real database — see `docs/ROADMAP.md` for exactly what's done
versus what's intentionally left (a mobile-screen pass, demo prep).

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS
- PostgreSQL + Prisma ORM
- Custom auth: bcrypt password hashing + signed JWT session cookie (no
  third-party auth service — see `src/lib/auth/`)
- Vitest (unit) + Playwright (e2e — `tests/e2e/core-workflow.spec.ts`)

## Prerequisites

- Node.js 20 LTS or later (`node -v`)
- PostgreSQL 14+ running locally, or a connection string to a hosted instance
  (Supabase, Neon, Railway, etc. all work)
- Git

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

- `DATABASE_URL` — point this at your Postgres instance. If you're running
  Postgres locally, create a database and user first, e.g.:
  ```bash
  createdb reliefmesh
  ```
- `AUTH_SECRET` — generate a real random value:
  ```bash
  openssl rand -base64 32
  ```
- `GUARDIAN_DEVICE_API_SECRET` — another random value (same command as above).
  This is the shared secret the simulated SOS test script uses.

**Never commit `.env`.** It's already in `.gitignore`.

## 3. Set up the database

```bash
npm run prisma:migrate   # creates tables from prisma/schema.prisma
npm run prisma:seed      # loads demonstration users + one demo incident
```

The seed script prints four demo accounts (ADMIN, OPERATOR, RESPONDER,
CITIZEN), all with password `Password123!`. These are for local development
only — change or remove them before any public deployment.

## 4. Run the app

```bash
npm run dev
```

Visit http://localhost:3000. Log in with one of the seeded accounts, or
register a new citizen account.

## 5. Verify things actually work

Don't take any of this on faith — run it yourself:

```bash
npm run typecheck     # TypeScript strict-mode check
npm run lint          # ESLint
npm run test          # Vitest unit tests (permissions logic)
npm run build         # production build — catches issues dev mode won't
```

Run the complete local build gate, including the optimized production-server
smoke test:

```bash
npm ci --prefix mobile   # required once after cloning
npm run verify:ci
```

Pushes and pull requests run the same gate in GitHub Actions, followed by the
full Playwright incident lifecycle against a fresh PostgreSQL service. See
[`docs/BUILD_WORKFLOW.md`](docs/BUILD_WORKFLOW.md) for the workflow, CI design,
and final demo-release checklist.

To exercise the simulated Guardian SOS endpoint (no physical device exists —
this creates a real linked incident through the device API contract):

```bash
GUARDIAN_DEVICE_API_SECRET=<same value as in .env> npx tsx scripts/simulate-sos.ts
```

Admins and operators can also open `/guardian` and use the virtual remote to
demonstrate battery, GPS, GPRS failure/retry, phone GPS, acknowledgement, and
the resulting incident without exposing the device secret to the browser.

To run the end-to-end test suite (exercises the real app in a real browser
against your seeded database — install browsers once, then run):

```bash
npx playwright install chromium    # one-time
npm run prisma:seed                # make sure seeded accounts exist
npm run dev                        # in a separate terminal, leave running
npm run test:e2e                   # in this terminal
```

## Project structure

```
src/
  app/            Next.js routes (pages + API routes)
  components/     UI components (ui/, layout/, dashboard/)
  services/       Business logic (role checks, orchestration)
  repositories/   Database access (Prisma queries only — no business logic)
  lib/
    auth/         Password hashing, session (JWT cookie) handling
    db/           Prisma client singleton
    validation/   Zod schemas for all inputs
    permissions/  Centralised role → permission map
    security/     Rate limiting, constant-time secret comparison, audit log
  types/          Shared TypeScript types
prisma/
  schema.prisma   Full database schema (see docs/DATABASE.md)
  seed.ts         Demonstration data
tests/            Vitest unit tests (tests/) + Playwright e2e (tests/e2e/)
scripts/          One-off scripts (e.g. SOS simulator)
docs/             Architecture, database, and Guardian integration notes
```

## Roles

`ADMIN`, `OPERATOR`, `RESPONDER`, `CITIZEN`, `ORGANISATION`. Permissions are
defined once in `src/lib/permissions/index.ts` — every API route checks
permissions through that module rather than re-implementing role logic.

## Security notes

- Passwords are hashed with bcrypt (12 rounds), never stored or logged in
  plain text.
- Sessions are signed JWTs in an `httpOnly`, `sameSite=lax` cookie — not
  readable from client-side JavaScript.
- All API inputs are validated with Zod before touching the database.
- Login, registration, and both Guardian device endpoints are rate-limited
  (`src/lib/security/rate-limit.ts`) — in-memory, single-process, which is
  an explicit tradeoff for a one-server hackathon deployment, not an
  oversight; swap in a shared store for anything bigger.
- The Guardian device secret is compared in constant time
  (`src/lib/security/timing-safe-equal.ts`), not with `!==`, to avoid a
  timing side-channel on that bearer-secret header.
- Login runs a dummy bcrypt compare even when the email doesn't exist
  (`src/app/api/auth/login/route.ts`), so the response doesn't take
  noticeably less time for an unregistered email than a wrong password —
  closing the one enumeration path the generic error message alone didn't.
- Every response carries `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, a `Referrer-Policy`, and a restrictive `Permissions-Policy`
  (`next.config.js`). No `Content-Security-Policy` yet — Leaflet and
  Recharts inject inline styles, and a CSP worth having needs to be tuned
  against the running app rather than guessed at from here.
- Sensitive actions (login success/failure, registration, incident verify/
  assign/status-change, resource allocation) write an `AuditLog` row via
  `src/lib/security/audit.ts`. Audit-log failures are swallowed so they can
  never block the action itself — see that file's comment.
- The Guardian SOS/location endpoints require a shared secret header and tag
  every event `isSimulated: true`; there is no code path that claims a real
  device is connected.
- `.env` is git-ignored; `.env.example` contains placeholders only.

## Pushing this to your `reliefmesh` GitHub repository

This zip is **not** a git repository yet (it's handed to you as plain files
on purpose, per your request). To turn it into one and push it to the GitHub
repo you already created:

```bash
# from inside the unzipped reliefmesh/ folder
git init
git add .
git commit -m "Day 1: project foundation, auth, schema, dashboard shell"
git branch -M main
git remote add origin https://github.com/<your-username>/reliefmesh.git
git push -u origin main
```

Double-check `git status` before your first commit — `.env` must **not**
appear in the list of files to be committed (if it does, your `.gitignore`
isn't being picked up; stop and fix that first).

## What's deliberately still open

- Dedicated mobile responsiveness pass (Tailwind responsive classes are used
  throughout, but nothing has been checked on an actual small screen yet)
- Fresh-install verification (clone → README → working app on a machine
  that's never touched this project) and a production `npm run build`
  check — do these before presenting, not after
- Notification delivery is poll-based (every 30s), not push — fine at this
  scale, noted in `src/components/layout/notification-bell.tsx`
- The rate limiter is in-memory and per-process — fine for one server
  during a demo, would need a shared store (Redis etc.) for anything
  running on more than one instance

See `docs/ROADMAP.md` for the day-by-day plan this maps to.
