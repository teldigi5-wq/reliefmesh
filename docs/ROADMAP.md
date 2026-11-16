# Roadmap (maps to the 4-day schedule)

## Day 1 — done in this scaffold

- [x] Repository structure, Next.js + TypeScript + Tailwind config
- [x] Prisma schema covering all required entities
- [x] Authentication (register/login/logout) + role-based sessions
- [x] Permission layer (`src/lib/permissions`)
- [x] Application shell (landing page, login, register, dashboard shell)
- [x] Seed data (4 roles + 1 demo incident + 1 demo resource)
- [x] Incident reporting API + listing API, wired to a real service/repo layer
- [x] Simulated Guardian SOS + location API, clearly labelled test-only
- [x] One Vitest suite (permissions logic) as a starting pattern for more tests

## Day 2 — incident operations + map — done

- [x] Incident list/detail pages (citizen/responder view: own + assigned; operator/admin view: all)
- [x] Verification workflow UI (operator verifies → status change → audit row, via `ActionPanel`)
- [x] Interactive map (Leaflet + OpenStreetMap) plotting incidents by severity (`src/components/map/incident-map.tsx`)
- [x] Map/list sync — `MapWithList` renders both from the same data, same click target
- [x] Volunteer registration + profile UI (`/volunteers`, self-service for any role with `volunteer:register`)
- [x] Responder assignment UI (operator assigns an available volunteer to a VERIFIED incident)
- [x] Incident status tracking UI for responders (RESPONDING → RESOLVED from `/incidents/[id]`)
- [x] Server-side transition guard (`ALLOWED_TRANSITIONS` in `incident.service.ts`) — rejects invalid jumps (e.g. REPORTED → RESOLVED) with 409
- [x] Added `tests/validation.test.ts` and two more permission tests

Known gaps carried into Day 3: no charts yet on the dashboard; incident list
has no filter/search UI (data layer supports it, UI doesn't expose it yet);
`/api/volunteers` GET only returns the full roster (fine for a small demo
dataset, would want pagination for anything larger).

## Day 3 — resources, Guardian UI, notifications, charts — done

- [x] Resource registration/quantity/allocation (`/resources`) — allocation is
      transactional (quantity-in-use + allocation row commit together;
      over-allocating is rejected with a 409, not silently clamped)
- [x] Citizen portal — already covered by Day 1/2 (`/incidents`, `/incidents/new`,
      own-reports filtering); no separate build needed
- [x] Guardian monitoring page (`/guardian`) — simulated SOS events on a map +
      device table, explicitly labelled SIMULATED throughout
- [x] In-app notifications — status changes, verification, assignment, and a
      fan-out to every operator/admin when a CRITICAL incident is verified;
      nav bell with unread count, polls every 30s
- [x] Dashboard charts (Recharts) — by category, by severity, 14-day trend,
      and average VERIFIED→RESOLVED resolution time computed from the audit
      trail (not from current status alone)
- [x] 4 more tests (resource validation)

Carried into Day 4 (hardening): no Playwright e2e yet, no dedicated mobile
pass (Tailwind responsive classes are used throughout but not checked on an
actual small screen), PWA manifest still has no icons, notification bell
polls rather than pushing (fine at hackathon scale, said so in the code).

## Day 4 — hardening and demo readiness

- [x] Fixed real bugs caught by `npm run typecheck` before they shipped
      (three `noUncheckedIndexedAccess` violations in the map components
      and the dashboard — not hypothetical, these were caught during this
      session's own testing)
- [x] Playwright e2e tests (`tests/e2e/core-workflow.spec.ts`) — the full
      report→verify→assign→respond→resolve→close lifecycle against real
      seeded accounts and a real database, plus a cross-tenant access test
      (citizen A cannot open citizen B's incident — confirms the
      `PermissionError` → redirect behavior actually works, not just that
      it compiles)
- [x] Security review, concretely:
  - Rate limiting on `/api/auth/login`, `/api/auth/register`, and both
    Guardian device endpoints (`src/lib/security/rate-limit.ts` — in-memory,
    documented as not distributed; fine for one server, swap the
    implementation behind the same function signature for a real deployment)
  - Constant-time comparison for the Guardian device secret
    (`src/lib/security/timing-safe-equal.ts`) instead of `!==`, closing a
    timing side-channel on a bearer-secret endpoint
  - `AuditLog` rows now actually get written (`src/lib/security/audit.ts`)
    on login success/failure, registration, incident verification/
    assignment/status changes, and resource allocation — the table existed
    in the schema since Day 1 but nothing wrote to it until now
  - 8 new unit tests for both (`tests/security.test.ts`)
- [x] PWA icons generated and wired into `manifest.json` and
      `src/app/layout.tsx` (192px/512px PNG, a generic radar/ping mark —
      not any real brand's logo)
- [x] Follow-up security patch after review: a dummy bcrypt compare on
      login's "no such user" path (closes a timing-based email-enumeration
      gap the generic error message alone didn't), plus baseline security
      headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-
      Policy`, `Permissions-Policy`) in `next.config.js` — no CSP yet, see
      the comment there for why
- [x] Found and fixed a real gap while reviewing: **no ESLint config
      existed anywhere in the repo** despite `eslint`/`eslint-config-next`
      being installed. `npm run lint` and `npm run build` (which runs lint)
      would have hit `next lint`'s interactive "no config found, set one up?"
      prompt the first time anyone ran either — a dead end in a non-
      interactive terminal. Added `.eslintrc.json` (`next/core-web-vitals`).
- [x] Visual design pass — Inter font properly loaded (it was referenced in
      Tailwind config but never actually loaded, so every page was quietly
      rendering in the system font), a shared `Card`/`Button` design system,
      elevated surfaces with soft shadows instead of flat borders, a real
      nav bar (sticky, active-link state, role badge), and a proper landing/
      login/register treatment. No text content, labels, placeholders, or
      button names changed — the Playwright suite's selectors still match.
- [ ] Fresh-install test: clone repo, follow README exactly on a machine
      that's never seen this project, confirm it works start to finish
- [x] Verified `npm run build` succeeds — all 23 routes compile and
      typecheck cleanly in a real production build, not just `dev`
- [ ] Confirm no secrets are committed (`git log -p -- .env` should be empty)
- [ ] Demo script / talking points for presenting Thursday

Still open, worth a conscious decision (not an oversight) before Thursday:
a dedicated mobile-screen pass, and whether the poll-based notifications
and single-process rate limiter are acceptable for however this actually
gets demoed.

## Explicitly out of scope for this deadline

- Physical IoT hardware (postponed by design — see `docs/GUARDIAN.md`)
- Microservices / Kubernetes
- Push notifications, SMS, email (notification architecture is built to be
  extensible to these later, not to include them now)
