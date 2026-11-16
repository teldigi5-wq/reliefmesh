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

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function logout(page: Page) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/($|login)/);
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
    await expect(page.getByText("VERIFIED")).toBeVisible();

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
    await expect(page.getByText("ASSIGNED")).toBeVisible();
  });
  await logout(page);

  await test.step("responder progresses the incident to resolved", async () => {
    await login(page, "responder@reliefmesh.test");
    await page.goto(incidentUrl);
    await page.getByRole("button", { name: /start responding/i }).click();
    await expect(page.getByText("RESPONDING")).toBeVisible();
    await page.getByRole("button", { name: /mark resolved/i }).click();
    await expect(page.getByText("RESOLVED")).toBeVisible();
  });
  await logout(page);

  await test.step("operator closes the incident", async () => {
    await login(page, "operator@reliefmesh.test");
    await page.goto(incidentUrl);
    await page.getByRole("button", { name: /close incident/i }).click();
    await expect(page.getByText("CLOSED")).toBeVisible();
    await expect(page.getByText(/no further actions are available/i)).toBeVisible();
  });
});

test("a citizen cannot see another citizen's incident", async ({ page }) => {
  // Report as citizen, then confirm a second, unrelated account can't open it.
  await login(page, "citizen@reliefmesh.test");
  await page.goto("/incidents/new");
  await page.getByLabel("Title").fill(`Private incident ${Date.now()}`);
  await page.getByLabel("Description").fill("Should not be visible to other citizens.");
  await page.getByLabel("Category").selectOption("OTHER");
  await page.getByLabel("Severity").selectOption("LOW");
  await page.getByLabel("Latitude").fill("6.9271");
  await page.getByLabel("Longitude").fill("79.8612");
  await page.getByRole("button", { name: /submit report/i }).click();
  await expect(page).toHaveURL(/\/incidents\/[a-z0-9]+/);
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
