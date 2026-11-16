# Architecture overview

Modular monolith — one Next.js app, no microservices, no Kubernetes. Layers
are separated by folder, not by network boundary:

```
API route (src/app/api/.../route.ts)
    -> validates input with a Zod schema (src/lib/validation)
    -> calls a service (src/services)
        -> checks permissions (src/lib/permissions)
        -> calls a repository (src/repositories)
            -> talks to Prisma (src/lib/db/prisma.ts)
```

Why this split:

- **Repositories** only know how to read/write the database. No role checks,
  no business rules. This keeps Prisma usage in one place per entity.
- **Services** hold business rules (who can do what, what happens to related
  records on a status change). They're what a server component or an API
  route calls — never Prisma directly from a route.
- **API routes** are thin: parse request, call service, map errors to HTTP
  status codes. They don't contain business logic.
- Server Components (e.g. `src/app/dashboard/page.tsx`) can call services
  directly (no network hop needed inside the same process), which keeps the
  dashboard's numbers genuinely sourced from the database.

## Auth

No third-party auth provider. Two files do all of it:

- `src/lib/auth/password.ts` — bcrypt hash/verify
- `src/lib/auth/session.ts` — signs a JWT (via `jose`) containing
  `{ userId, role, email }`, stored in an `httpOnly` cookie. `getSession()`
  verifies and decodes it; `createSession()` / `destroySession()` set/clear
  the cookie.

This is deliberately simple for a 4-day solo build. If you later want
OAuth/social login or passwordless magic links, that's an additive change —
swap what `createSession` is called with, not the session mechanism itself.

## Permissions

One file, `src/lib/permissions/index.ts`, maps each `Role` to the
`Permission`s it holds. Every service method that performs a sensitive
action calls `hasPermission` / `requirePermission` before touching data.
Adding a new permission means: add it to the `Permission` union, add it to
the roles that should have it, and call `hasPermission` where it matters —
one file to review for "who can do X."

## Incident lifecycle

`REPORTED → UNDER_REVIEW → VERIFIED → ASSIGNED → RESPONDING → RESOLVED →
CLOSED`. Every transition is written through
`incidentRepository.updateStatus`, which — inside a single Prisma
transaction — writes an `IncidentUpdate` audit row *and* updates the
incident's `status` together, so the two can never disagree.

## Guardian (future SOS device)

No physical device exists. `/api/guardian/sos` and `/api/guardian/location`
define the contract a future device would call (device serial, shared
secret header, GPS coordinates, battery). Every event this API can produce
is tagged `isSimulated: true` in the database — there is no way to insert a
non-simulated row through this code path. `scripts/simulate-sos.ts` exercises
it. See `docs/GUARDIAN.md`.
