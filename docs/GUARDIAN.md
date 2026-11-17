# Guardian SOS device — simulated integration

No physical device exists yet. This document describes the API contract a
future Guardian SOS remote (physical button + GPS + cellular + battery
monitor) would use, and how to exercise it today with simulated test
traffic only.

## Endpoints

### `POST /api/guardian/sos`

Headers:
```
Content-Type: application/json
x-guardian-device-secret: <GUARDIAN_DEVICE_API_SECRET from .env>
```

Body:
```json
{
  "deviceSerial": "SIM-DEVICE-0001",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "batteryPct": 87
}
```

Creates (or activates) a `GuardianDevice`, creates a genuine `Incident`, and
links a `SOSEvent` to that incident in one database transaction. The event is
**always** written with `isSimulated: true`; responders and administrators see
the real incident workflow without the UI claiming physical hardware exists.

The incident is owned by `GUARDIAN_REPORTER_EMAIL` when configured, otherwise
by the oldest active admin/operator account. The endpoint returns `503` instead
of creating partial telemetry if no suitable owner exists.

### `POST /api/guardian/simulate`

Authenticated admin/operator endpoint used by the virtual remote on
`/guardian`. It never exposes the shared device secret to browser code. The UI
supports simulated GPRS/GPS failures, retries, cancellation, battery telemetry,
and an optional real phone-location fix. Acknowledgement includes the linked
incident id so the demonstration can continue directly into triage.

### `POST /api/guardian/location`

Same auth header. Body:
```json
{ "deviceSerial": "SIM-DEVICE-0001", "latitude": 6.93, "longitude": 79.86 }
```

Appends a `LocationUpdate` row (history is kept, never overwritten) and
updates the device's `lastSeenAt`.

## Running a test event

```bash
GUARDIAN_DEVICE_API_SECRET=<value from your .env> npx tsx scripts/simulate-sos.ts
```

This hits your local dev server (`npm run dev` must be running) and prints the
created event plus the genuine linked `incidentId`.

## What's intentionally missing

- No real device firmware, no cellular/GPS hardware integration — out of
  scope until the software platform is complete, per the project plan.
- Authentication here is a single shared secret, suitable for a known small
  number of test devices. A production rollout with many real devices would
  want per-device credentials instead of one shared secret — noted here so
  it isn't forgotten, not implemented now.
