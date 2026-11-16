/**
 * Sends a clearly-labelled SIMULATED SOS event to the local API, exercising
 * the same contract a future Guardian SOS device will use.
 *
 * Usage:
 *   GUARDIAN_DEVICE_API_SECRET=<value from .env> npx tsx scripts/simulate-sos.ts
 */

async function main() {
  const secret = process.env.GUARDIAN_DEVICE_API_SECRET;
  if (!secret) {
    console.error(
      "Set GUARDIAN_DEVICE_API_SECRET (same value as in your .env) before running this script."
    );
    process.exit(1);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/guardian/sos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guardian-device-secret": secret,
    },
    body: JSON.stringify({
      deviceSerial: "SIM-DEVICE-0001",
      latitude: 6.9271,
      longitude: 79.8612,
      batteryPct: 87,
    }),
  });

  const data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(data);
}

main();
