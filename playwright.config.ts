import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Raised from 30s, then from 60s: this spec visits several routes
  // (dashboard, incidents/new, the incident detail page, etc.) for the
  // first time in sequence, each first visit paying a one-time Next.js
  // dev-mode compile cost (observed 5-7s for routes with ~1000+ modules) on
  // top of the remote-DB latency below. The full lifecycle test also logs in
  // and out 5 times, and login()/logout() each now wait for the destination
  // page to actually render (not just for the URL to change) to avoid racing
  // the next action against a still-in-flight hard navigation — that's
  // correctness, not just speed, but it does add up across one long test.
  timeout: 90_000,
  // The dev DB is a remote (Supabase) Postgres instance, so individual
  // round-trips routinely take 2-5s on top of normal dev-mode compile
  // overhead. On top of that, the FIRST visit to any given route in a test
  // run pays Next.js's one-time dev-mode compile cost for that route
  // (observed 5-7s for routes with ~1000+ modules) — well above Playwright's
  // 5s default. 15s gives assertions enough room for a cold compile plus a
  // slow DB round-trip without masking a genuinely broken action; login() and
  // logout() get an even larger override since they're usually the very
  // first navigation of the whole run.
  expect: { timeout: 15_000 },
  fullyParallel: false, // these tests share seeded accounts and mutate shared state
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Assumes `npm run dev` (or a seeded, migrated DB) is already running.
  // Set PW_START_SERVER=1 to have Playwright start it for you instead.
  webServer: process.env.PW_START_SERVER
    ? {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 60_000,
      }
    : undefined,
});
