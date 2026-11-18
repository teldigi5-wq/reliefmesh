import { test, expect, type Page } from "@playwright/test";

/**
 * Exercises Workflow 1 and Workflow 2 from the project spec against real
 * seeded accounts (see prisma/seed.ts) and a real database — no mocking.
 *
 * Prerequisites before running `npm run test:e2e`:
 *   1. `npm run prisma:migrate && npm run prisma:seed` has been run
 *   2. `npm run dev` is running (or set PW_START_SERVER=1 to let Playwright
 *      start it for you — see playwright.config.ts)
 *
 * Because all three roles act on the SAME incident in sequence, this test
 * is intentionally one long scenario rather than three isolated tests —
 * splitting it up would just mean re-deriving shared state (the incident
 * id) across files.
 */

const PASSWORD = "Password123!";

// Temporary diagnostics: surface any browser-side JS error or console.error
// directly in the terminal running `npm run test:e2e`, since a silent client
// exception otherwise just looks like "nothing happened" from the test side.
test.beforeEach(({ page }) => {
  page.on("pageerror", (err) => {
    console.log("\n[BROWSER PAGE ERROR]", err.message, "\n", err.stack);
  });
  page.on("console", (msg) => {
    // Recharts 2 emits this React deprecation warning from its XAxis/YAxis
    // internals in development mode. It is third-party noise rather than an
    // application exception, and printing its full component stack on every
    // dashboard visit hides useful diagnostics from CI logs.
    const isKnownRechartsWarning = msg
      .text()
      .includes("Support for defaultProps will be removed");
    if (msg.type() === "error" && !isKnownRechartsWarning) {
      console.log("\n[BROWSER CONSOLE ERROR]", msg.text());
    }
  });
});

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /log in/i }).click();
  // 20s, not the global 15s default: on a freshly started dev server this is
  // the very first hit to /dashboard, and Next.js has to compile that route
  // from scratch (observed ~5-7s for ~1300 modules) on top of the login
  // POST's own latency against the remote DB. Every later navigation to
  // /dashboard in this run reuses the compiled route and is fast; this is a
  // one-time cold-start cost, not a sign anything is broken.
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  // toHaveURL only checks the address bar, which can update while the
  // document is still loading (window.location.href is a hard navigation).
  // Every caller immediately does something else on this page — often
  // another page.goto() — and that races the still-in-flight load, which
  // can abort it outright ("net::ERR_ABORTED; maybe frame was detached?").
  // Waiting for an actual rendered element makes login() only return once
  // /dashboard has genuinely finished loading.
  await expect(
    page.getByRole("heading", { name: /operations dashboard/i })
  ).toBeVisible({ timeout: 20_000 });
}

async function logout(page: Page) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /log out/i }).click();
  // The logout route (src/app/api/auth/logout/route.ts) always redirects to
  // /login specifically, so this can be a precise match rather than the
  // looser "/ or /login" — and, as in login() above, wait for real content
  // rather than just the URL so the page has actually finished loading
  // before the next action runs.
  await expect(page).toHaveURL(/\/login$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible({
    timeout: 20_000,
  });
}

test("full incident lifecycle: report → verify → assign → respond → resolve → close", async ({
  page,
}) => {
  const title = `E2E test incident ${Date.now()}`;

  await test.step("citizen reports an incident", async () => {
    await login(page, "citizen@reliefmesh.test");
    await page.goto("/incidents/new");
    await page.getByLabel("Title").fill(title);
    await page
      .getByLabel("Description")
      .fill("Automated end-to-end test incident — safe to ignore/delete.");
    await page.getByLabel("Category").selectOption("FIRE");
    await page.getByLabel("Severity").selectOption("MEDIUM");
    await page.getByLabel("Latitude").fill("6.9271");
    await page.getByLabel("Longitude").fill("79.8612");
    await page.getByRole("button", { name: /submit report/i }).click();

    await expect(page).toHaveURL(/\/incidents\/[a-z0-9]+/);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  });

  const incidentUrl = page.url();
  await logout(page);

  await test.step("responder registers as an available volunteer", async () => {
    await login(page, "responder@reliefmesh.test");
    await page.goto("/volunteers");
    await page.getByPlaceholder(/first-aid/).fill("e2e-test-skill");
    await page.getByRole("button", { name: /save volunteer profile/i }).click();
    await expect(page.getByText("Saved.")).toBeVisible();
  });
  await logout(page);

  await test.step("operator verifies and assigns the incident", async () => {
    await login(page, "operator@reliefmesh.test");
    await page.goto(incidentUrl);
    await page.getByRole("button", { name: /verify incident/i }).click();
    await expect(page.getByTestId("status-badge")).toHaveText("VERIFIED");

    // The incident detail page has exactly one <select> at this point in
    // the lifecycle: the responder-assignment dropdown.
    // Label text is "<fullName> (<skills>)" — skills were just set to
    // "e2e-test-skill" in the previous step, so match on that exactly
    // rather than a RegExp (Playwright's selectOption label is typed as a
    // plain string, not a RegExp).
    await page
      .locator("select")
      .selectOption({ label: "Rita Responder (e2e-test-skill)" });
    await page.getByRole("button", { name: /^assign$/i }).click();
    await expect(page.getByTestId("status-badge")).toHaveText("ASSIGNED");
  });
  await logout(page);

  await test.step("responder progresses the incident to resolved", async () => {
    await login(page, "responder@reliefmesh.test");
    await page.goto(incidentUrl);
    await page.getByRole("button", { name: /accept.*start response/i }).click();
    await expect(page.getByTestId("status-badge")).toHaveText("RESPONDING");
    await page.getByRole("button", { name: /mark resolved/i }).click();
    await expect(page.getByTestId("status-badge")).toHaveText("RESOLVED");
  });
  await logout(page);

  await test.step("operator closes the incident", async () => {
    await login(page, "operator@reliefmesh.test");
    await page.goto(incidentUrl);
    await page.getByRole("button", { name: /close incident/i }).click();
    await expect(page.getByTestId("status-badge")).toHaveText("CLOSED");
    await expect(page.getByText(/no further actions are available/i)).toBeVisible();
  });
});

test("a citizen cannot see another citizen's incident", async ({ page }) => {
  // Report as citizen, then confirm a second, unrelated account can't open it.
  const title = `Private incident ${Date.now()}`;
  await login(page, "citizen@reliefmesh.test");
  await page.goto("/incidents/new");
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description").fill("Should not be visible to other citizens.");
  await page.getByLabel("Category").selectOption("OTHER");
  await page.getByLabel("Severity").selectOption("LOW");
  await page.getByLabel("Latitude").fill("6.9271");
  await page.getByLabel("Longitude").fill("79.8612");
  await page.getByRole("button", { name: /submit report/i }).click();
  await expect(page).toHaveURL(/\/incidents\/[a-z0-9]+/);
  // Wait for the hard-navigated (window.location.href) incident page to
  // actually finish loading before doing anything else. toHaveURL only
  // checks the address bar, which can update while the navigation is still
  // in flight; calling logout() immediately after — which itself does
  // page.goto("/dashboard") — then races that still-pending navigation and
  // the new goto gets aborted (net::ERR_ABORTED). The sibling test above
  // avoids this incidentally via its own heading-visibility assertion; this
  // makes the same wait explicit here.
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  const privateUrl = page.url();

  await logout(page);

  // Admin always has view_all, so this check uses a second real citizen
  // account instead — register one on the fly.
  await page.goto("/register");
  const email = `e2e-${Date.now()}@reliefmesh.test`;
  await page.getByLabel("Full name").fill("E2E Second Citizen");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto(privateUrl);
  // getById() throws PermissionError, which the page turns into a redirect
  // to /incidents rather than leaking the incident's content.
  await expect(page).toHaveURL(/\/incidents$/);
});

test("a responder cannot transition an incident they are not assigned to", async ({
  page,
}) => {
  // Regression test for a real IDOR: transitionStatus() used to only check
  // the RESPONDER role's global incident:update_status permission, never
  // whether this particular responder was actually assigned to this
  // particular incident — so any responder could change the status of any
  // incident by id alone. Uses page.request (not UI clicks) because the
  // attack itself is a direct API call, not something reachable through
  // the UI for an incident this account was never assigned.
  await login(page, "citizen@reliefmesh.test");

  const createRes = await page.request.post("/api/incidents", {
    data: {
      title: `Unassigned E2E incident ${Date.now()}`,
      description:
        "Created to verify a responder can't transition an incident they aren't assigned to.",
      category: "OTHER",
      severity: "LOW",
      latitude: 6.9271,
      longitude: 79.8612,
    },
  });
  expect(createRes.ok()).toBeTruthy();
  const incident = await createRes.json();

  await logout(page);
  await login(page, "responder@reliefmesh.test");

  const attempt = await page.request.post(
    `/api/incidents/${incident.id}/status`,
    { data: { toStatus: "RESOLVED" } }
  );
  expect(attempt.status()).toBe(403);
  const body = await attempt.json();
  expect(body.error).toMatch(/not permitted/i);
});

test("virtual Guardian SOS creates and live-updates a real incident", async ({
  page,
}) => {
  await login(page, "citizen@reliefmesh.test");
  const deviceSerial = "E2E-GUARDIAN-" + Date.now();

  const trigger = await page.request.post("/api/guardian/simulate", {
    data: {
      deviceSerial,
      latitude: 6.9271,
      longitude: 79.8612,
      batteryPct: 91,
      category: "MEDICAL_EMERGENCY",
      description: "Guardian live-location end-to-end verification.",
      networkType: "PHONE_DATA",
      locationSource: "PHONE_GPS",
    },
  });
  expect(trigger.status()).toBe(201);
  const created = await trigger.json();
  expect(created.incidentId).toBeTruthy();
  expect(created.incidentStatus).toBe("REPORTED");

  const liveUpdate = await page.request.post(
    "/api/guardian/simulate/location",
    {
      data: {
        deviceSerial,
        incidentId: created.incidentId,
        latitude: 6.9314,
        longitude: 79.8478,
        accuracy: 7.5,
        batteryPct: 90,
      },
    }
  );
  expect(liveUpdate.status()).toBe(201);

  const incidentResponse = await page.request.get(
    "/api/incidents/" + created.incidentId
  );
  expect(incidentResponse.ok()).toBeTruthy();
  const incident = await incidentResponse.json();
  expect(incident.latitude).toBeCloseTo(6.9314, 4);
  expect(incident.longitude).toBeCloseTo(79.8478, 4);
  expect(incident.address).toContain("LIVE PHONE GPS");
});

test("repeated failed logins get rate-limited", async ({ page }) => {
  // The login rate limiter keys on the client IP taken from
  // X-Forwarded-For (src/lib/security/rate-limit.ts). A real browser
  // hitting this dev server sends no such header, so every other test's
  // login() calls in this file share a single "unknown" bucket — sending
  // 11 requests under that same key here would blow through their shared
  // budget and could spuriously fail unrelated tests depending on run
  // order/timing. Setting an explicit header gives this test its own
  // isolated bucket without touching anything else's.
  const syntheticIp = "203.0.113.55"; // TEST-NET-3 (RFC 5737): reserved for documentation/testing, never a real client.

  let lastStatus = 0;
  let lastBody: { error?: string } = {};
  for (let i = 0; i < 11; i++) {
    const res = await page.request.post("/api/auth/login", {
      headers: { "x-forwarded-for": syntheticIp },
      data: { email: "citizen@reliefmesh.test", password: "definitely-wrong" },
    });
    lastStatus = res.status();
    lastBody = await res.json();
  }

  expect(lastStatus).toBe(429);
  expect(lastBody.error).toMatch(/too many/i);
});
