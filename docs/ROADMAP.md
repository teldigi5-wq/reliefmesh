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

- [ ] Fix bugs found in integration testing
- [ ] Playwright end-to-end tests for the four core workflows
- [ ] Security review (rate limiting on auth endpoints, audit log coverage)
- [ ] UI refinement pass
- [ ] Fresh-install test: clone repo, follow README exactly, confirm it works
- [ ] Verify `npm run build` succeeds
- [ ] Finish README, architecture and database docs (this scaffold's docs are
      the starting point, not the final version)
- [ ] Confirm no secrets are committed (`git log -p -- .env` should be empty)

## Explicitly out of scope for this deadline

- Physical IoT hardware (postponed by design — see `docs/GUARDIAN.md`)
- Microservices / Kubernetes
- Push notifications, SMS, email (notification architecture is built to be
  extensible to these later, not to include them now)
