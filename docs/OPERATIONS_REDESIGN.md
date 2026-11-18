# ReliefMesh operations workspace redesign

This branch updates the authenticated user interface while preserving API routes, Prisma logic, role permissions, forms and Guardian simulation behaviour.

## Updated pages
- Dashboard: redesigned database-driven KPIs, accessible analytics visualisations, lifecycle overview, quick navigation
- Incidents: case counts, status/severity badges and improved register
- Map: geospatial workspace and incident list
- Volunteers: availability metrics, roster and unchanged profile form
- Resources: inventory health, availability bars, unchanged allocation workflows
- Guardian: explicit SIMULATED labels, device roster, SOS map and test alerts
- Incident detail / incident report: consistent navigation, typography and content panels
- Application navigation: responsive, keyboard-accessible menu, active state and role badge

## Safety
- Do not promote to main until Vercel preview checks pass and manual testing confirms auth, incident updates, volunteers, resources and map interactions.
- New CSS is scoped to ops-page and ops-nav; public website remains unchanged.
- All incident charts use real database data. No fabricated operational metrics.
- Guardian remains test-only; not an emergency service.
- No API/schema/back-end code was changed.

## Test
npm run typecheck
npm run lint
npm run build

Then manually verify /dashboard, /incidents, /incidents/new, /incidents/[id], /map, /volunteers, /resources, /guardian at desktop/mobile sizes with different roles.
