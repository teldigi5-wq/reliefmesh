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

Creates (or activates) a `GuardianDevice` row and a `SOSEvent` row. The
event is **always** written with `isSimulated: true` — this field is hard-
coded in `src/app/api/guardian/sos/route.ts`, not derived from the request,
so there is no way to make this endpoint claim a real device triggered it.

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

This hits your local dev server (`npm run dev` must be running) and prints
the created event, including the `notice` field confirming it's simulated.

## What's intentionally missing

- No real device firmware, no cellular/GPS hardware integration — out of
  scope until the software platform is complete, per the project plan.
- No UI yet surfacing these events on the dashboard/map — the data model and
  API exist so that UI can be added without a schema change later.
- Authentication here is a single shared secret, suitable for a known small
  number of test devices. A production rollout with many real devices would
  want per-device credentials instead of one shared secret — noted here so
  it isn't forgotten, not implemented now.
