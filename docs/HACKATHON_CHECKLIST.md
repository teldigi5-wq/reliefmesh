# ReliefMesh hackathon readiness — 17 November 2026

Status reflects source inspection, the connected GitHub history, the live
Vercel deployment, and local verification on
`codex/hackathon-readiness-2026-11-17`.

## Completed and verified

- [x] Next.js production build (`npm run build`)
- [x] Web TypeScript, ESLint, and Vitest (22 tests)
- [x] Expo citizen app TypeScript validation
- [x] Reproducible root and mobile dependency lockfiles
- [x] Password login/register and server-validated role sessions
- [x] Citizen report creation with database persistence and GPS coordinates
- [x] Expo citizen SOS, confirmation/detail, history, and 10-second status polling
- [x] Operator verification and responder assignment
- [x] Responder assignment visibility, acceptance/start, status update, resolution
- [x] Assignment state now follows incident state (`IN_PROGRESS` → `COMPLETED`)
- [x] Admin/operator operational counts, incident list, incident map, resources
- [x] Poll-based in-app notifications (30 seconds)
- [x] Guardian virtual remote creates a genuine linked critical incident
- [x] Guardian GPRS/GPS failure, cancel, retry, battery, and phone-GPS modes
- [x] Guardian shared-secret API creates the same linked incident workflow
- [x] Live deployment responds, demo admin login works, and production incidents
  are readable through authorized API access

## Needs hands-on environment testing

- [ ] Run the new Guardian simulator against a database-backed preview branch
- [ ] Run Playwright lifecycle tests against an isolated seeded database
- [ ] Check Expo app on an Android device or emulator
- [ ] Verify phone location permission and accuracy on the presentation device
- [ ] Verify Vercel preview environment variables, including
  `GUARDIAN_REPORTER_EMAIL`
- [ ] Confirm the preview deployment before promoting any commit to production

## Partially working / deliberate deadline tradeoffs

- [~] Real-time updates use short polling, not WebSockets/SSE. Assignment alerts
  arrive without a full-page refresh but can take up to 30 seconds.
- [~] Admin live map is a dedicated `/map` view rather than embedded in the
  dashboard card grid.
- [~] Citizen identity uses the existing email/password system; Google OAuth is
  not configured.
- [~] Responder identity is role-based but not yet backed by an organisation
  invitation/approval flow.

## Not implemented before freeze

- [ ] Administrator TOTP/MFA
- [ ] Push/SMS/email notification delivery
- [ ] Per-device production credentials and physical firmware
- [ ] Persistent database idempotency keys for network-level SOS retries
- [ ] Native citizen profile editing

Google OAuth and TOTP require credential provisioning and authentication-flow
changes. They should not displace end-to-end emergency workflow testing during
the final hackathon day.
