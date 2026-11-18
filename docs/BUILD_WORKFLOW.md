# ReliefMesh build workflow

This is the release path for a demonstrable ReliefMesh build. It keeps fast
feedback local while reserving the real database lifecycle test for an
isolated CI database.

## Workflow

```text
Change code
    ↓
Local verification
    ├─ TypeScript (web)
    ├─ ESLint
    ├─ Vitest unit/security tests
    ├─ TypeScript (Expo mobile)
    ├─ Next.js production build
    └─ Production-server smoke test
    ↓
Push or open a pull request
    ↓
GitHub Actions quality job
    ↓
Fresh PostgreSQL 16 database
    ├─ Apply committed Prisma migrations
    ├─ Seed isolated demo accounts
    └─ Playwright: report → verify → assign → respond → resolve → close
    ↓
Preview deployment and hands-on device check
    ↓
Promote to production
```

## Local commands

Install both dependency trees once:

```bash
npm ci
npm ci --prefix mobile
```

Run the full build gate:

```bash
npm run verify:ci
```

`verify:ci` runs the standard `verify` pipeline and then boots the optimized
Next.js output on port `3100`. The smoke test checks the home, login and
registration routes, the PWA manifest, and required security headers.

Run the database-backed lifecycle locally when PostgreSQL is available:

```bash
cp .env.example .env
npm run prisma:deploy
npm run prisma:seed
npx playwright install chromium
PW_START_SERVER=1 npm run test:e2e
```

The Playwright suite mutates seeded data. Use a disposable local or preview
database, never the production database.

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main` and `codex/**`, pull
requests, and manual dispatches.

The workflow has two gates:

1. **Type, test, build, and smoke** installs the locked web and mobile
   dependencies, runs all static/unit checks, builds the optimized web app,
   and validates the production server.
2. **PostgreSQL incident lifecycle** creates a clean PostgreSQL 16 service,
   applies the committed migration, seeds demo users, installs Chromium, and
   executes the complete multi-role emergency workflow. Browser traces and
   screenshots are uploaded for seven days when this job fails.

CI uses test-only secrets declared inside the isolated job. Deployment
credentials and production database URLs must remain in the hosting
provider's encrypted environment settings.

## Demo release gate

Before the Thursday demonstration, require all of the following:

- `npm run verify:ci` passes from a clean checkout.
- Both GitHub Actions jobs are green on the exact commit being presented.
- The preview deployment uses a migrated and seeded preview database.
- Guardian simulation is exercised once against the preview deployment.
- The Expo app is opened on the presentation device and location permission
  is confirmed.
- The citizen → operator → responder lifecycle is rehearsed using demo data.
- A fallback screen recording and the seeded account list are available if
  venue connectivity is unreliable.

The automated gates prove the source, production build, public routes,
database schema, permissions, and main browser workflow. They do not replace
the final phone GPS, network, and presentation-device checks.
