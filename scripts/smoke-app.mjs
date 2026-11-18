import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = Number(process.env.SMOKE_PORT ?? 3100);
const baseUrl = `http://127.0.0.1:${port}`;
const startupTimeoutMs = Number(process.env.SMOKE_STARTUP_TIMEOUT_MS ?? 45_000);
const nextBinary = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url)
);

// Launch Next directly instead of through `npm run start`. Killing an npm
// wrapper can orphan its Next child and leave the smoke-test port occupied.
const server = spawn(process.execPath, [nextBinary, "start", "-p", String(port)], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
let serverExited = false;

for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
  });
}

server.once("exit", () => {
  serverExited = true;
});

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithTimeout(path) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(5_000),
  });
}

async function waitForServer() {
  const deadline = Date.now() + startupTimeoutMs;

  while (Date.now() < deadline) {
    if (serverExited) {
      throw new Error(`Production server exited before it became ready.\n${serverOutput}`);
    }

    try {
      const response = await fetchWithTimeout("/");
      if (response.ok) return;
    } catch {
      // The server is still starting. Retry until the deadline below.
    }

    await delay(250);
  }

  throw new Error(
    `Production server did not become ready within ${startupTimeoutMs}ms.\n${serverOutput}`
  );
}

async function assertPage(path, expectedText) {
  const response = await fetchWithTimeout(path);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}.`);
  }

  if (!body.toLowerCase().includes(expectedText.toLowerCase())) {
    throw new Error(`${path} did not contain the expected text: ${expectedText}`);
  }

  return response;
}

async function stopServer() {
  if (serverExited) return;

  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(5_000),
  ]);

  if (!serverExited) server.kill("SIGKILL");
}

try {
  await waitForServer();

  const homeResponse = await assertPage("/", "ReliefMesh");
  await assertPage("/login", "Welcome back");
  await assertPage("/register", "Create your account");

  const manifestResponse = await fetchWithTimeout("/manifest.json");
  const manifest = await manifestResponse.json();
  if (!manifestResponse.ok || manifest.name !== "ReliefMesh") {
    throw new Error("The web app manifest is missing or invalid.");
  }

  const requiredHeaders = {
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
  };

  for (const [name, expectedValue] of Object.entries(requiredHeaders)) {
    const actualValue = homeResponse.headers.get(name);
    if (actualValue !== expectedValue) {
      throw new Error(
        `Expected ${name}=${expectedValue}, received ${actualValue ?? "<missing>"}.`
      );
    }
  }

  console.log(
    "Smoke test passed: production server, public routes, PWA manifest, and security headers are healthy."
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (serverOutput) console.error("\nProduction server output:\n", serverOutput);
  process.exitCode = 1;
} finally {
  await stopServer();
}
