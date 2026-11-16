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

## Day 2 — incident operations + map

- [ ] Incident list/detail pages (citizen view: "my reports"; operator view: all)
- [ ] Verification workflow UI (operator verifies → status change → audit row)
- [ ] Interactive map (Leaflet + OpenStreetMap) plotting incidents by severity
- [ ] Map/list filter sync
- [ ] Volunteer registration + profile UI
- [ ] Responder assignment UI (operator assigns volunteer to verified incident)
- [ ] Incident status tracking UI for responders
- [ ] Expand automated tests to cover the incident status-transition logic

## Day 3 — resources, citizen portal, Guardian UI, notifications

- [ ] Resource registration/quantity/allocation UI
- [ ] Citizen portal: submit report, view own reports & statuses
- [ ] Guardian monitoring page (shows simulated SOS events + location history on the map)
- [ ] In-app notifications (new critical incident, verification, assignment, status change)
- [ ] Dashboard charts: incidents by category/severity/time, response performance
- [ ] Mobile responsiveness pass across all pages
- [ ] Wire all modules together into the four required end-to-end workflows

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
