# ReliefMesh

Disaster-management and emergency-response coordination platform connecting
citizens, operators, responders and organisations.

Status: **Day 1 foundation.** Authentication, roles, database schema, the
app shell, dashboard shell, and a simulated Guardian SOS API contract are in
place. Incident map, volunteer/resource management UI, and notifications are
the next build stages — see `docs/ROADMAP.md`.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS
- PostgreSQL + Prisma ORM
- Custom auth: bcrypt password hashing + signed JWT session cookie (no
  third-party auth service — see `src/lib/auth/`)
- Vitest (unit) + Playwright (e2e, not yet configured with a test file)

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

To exercise the simulated Guardian SOS endpoint (no physical device exists —
this just proves the API contract works):

```bash
GUARDIAN_DEVICE_API_SECRET=<same value as in .env> npx tsx scripts/simulate-sos.ts
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
  types/          Shared TypeScript types
prisma/
  schema.prisma   Full database schema (see docs/DATABASE.md)
  seed.ts         Demonstration data
tests/            Vitest unit tests
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

## What's deliberately not done yet (Day 4 hardening)

- Playwright end-to-end test suite (unit tests exist; e2e for the four core
  workflows is the Day 4 item)
- Dedicated mobile responsiveness pass (Tailwind responsive classes are used
  throughout, but nothing has been checked on an actual small screen yet)
- PWA icons (`public/manifest.json` has no icons yet — add them before
  relying on "Add to Home Screen")
- Notification delivery is poll-based (every 30s), not push — fine at this
  scale, noted in `src/components/layout/notification-bell.tsx`

See `docs/ROADMAP.md` for the day-by-day plan this maps to.
