# ReliefMesh 6-minute hackathon demonstration

## 0:00 — Frame the system

Open the landing page. Explain that ReliefMesh coordinates one incident record
across citizens, operators, responders, administrators, and a simulated Guardian
remote. State clearly that the remote hardware is simulated.

## 0:30 — Citizen SOS

1. Sign in as the citizen or open the Expo citizen app.
2. Open SOS, select an emergency category, and acquire the phone GPS fix.
3. Submit once and show the confirmation/incident id.
4. Open **My reports** and show the live status timeline.

## 1:45 — Operator triage

1. Sign in as operator.
2. Open the new incident from **Notifications** or **Incidents**.
3. Verify it, assign the responder, and point out the timestamped audit trail.
4. Open the map and show that the incident location is the same record.

## 2:45 — Responder lifecycle

1. Sign in as responder.
2. Wait for the assignment notification (polling can take up to 30 seconds).
3. Open the assignment and select **Accept & start response**.
4. Mark it resolved and show the completed assignment/history.

## 3:45 — Guardian remote

1. Sign in as admin/operator and open **Guardian**.
2. Disconnect SIM800L, arm the remote, press SOS, and show the failed send.
3. Restore GPRS and retry successfully.
4. Open the acknowledged incident and show the `SIMULATED` telemetry label.
5. If location permission is reliable, reset and demonstrate **Use phone GPS**.

## 5:00 — Administrator visibility

1. Open **Dashboard** for total, active, critical, and resolved counts.
2. Open **Map** for live operational geography.
3. Open the Guardian monitor to show device battery, last seen time, event, and
   linked incident.

## 5:40 — Close

Emphasize the evidence: one persisted incident, server-side authorization,
role-specific actions, GPS, audit history, assignment state, and simulator-to-
backend acknowledgement. Name polling and simulated hardware honestly as
hackathon tradeoffs.

## Pre-demo safety check

Run `npm run verify`, test the preview URL on the presentation phone, keep four
role tabs ready, and retain one backup incident in case venue connectivity is
poor. Do not deploy a fresh production build during the presentation window.
