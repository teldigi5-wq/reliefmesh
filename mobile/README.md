# ReliefMesh Mobile (Citizen slice)

A native app built with Expo/React Native, talking to the **same backend**
as the web app (`reliefmesh-theta.vercel.app`) — no second backend, no
separate database. There is nothing to run locally except this app itself;
it hits the already-deployed, already-stabilized API.

## What's actually built right now

- Login / register, authenticated via a Bearer token (SecureStore) against
  the real backend's `/api/auth/login` and `/api/auth/register`.
- Citizen home screen with a large SOS button.
- SOS flow: grabs device GPS, lets you pick an emergency category, optional
  description, submits to the real `/api/incidents` endpoint.
- My reports: list of incidents you've submitted.
- Incident detail: a status timeline that polls every 10s so you can watch
  a report move from Reported → Verified → Assigned → Resolved.

## What is NOT built (be clear about this before a demo)

- Responder app and Admin app — only the Citizen role exists right now.
- The Guardian SOS hardware-device simulator UI (the backend for it already
  exists — `/api/guardian/sos`, `/api/guardian/location` — this app doesn't
  have a screen for it yet).
- Push notifications, offline queueing, maps/tracking view, photo/voice
  attachments on a report, biometric login, deep linking.
- No "whoami"/session-check endpoint on the backend yet, so the app can't
  tell a token is still valid without making a real request — closing and
  reopening the app may ask you to log in again sooner than strictly
  necessary. Low priority; not fixed.

I did **not** verify this app runs — this sandbox cannot run `npm install`
or Expo. The first real test happens when you run the steps below. Report
back the exact error if something breaks; don't assume it's wired wrong
without seeing the actual output, same as everything else today.

## Setup (run this on your own machine, not in this sandbox)

```bash
cd mobile
npm install
```

Expo Go app required on your phone: install it from the Play Store / App
Store first.

```bash
npx expo start
```

This prints a QR code in the terminal. Scan it with the Expo Go app (Android:
Expo Go's built-in scanner; iOS: the Camera app) — your phone and computer
need to be on the same Wi-Fi network.

The app is pre-configured (see `app.json` → `extra.apiUrl`) to talk to the
real deployed backend, so you don't need your own `.env` or a local dev
server running for this to work — login with the same accounts you already
use on the web app.

If you want it to hit a local `next dev` server instead (e.g. for testing a
backend change before pushing it), create `mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-computer's-LAN-IP>:3000
```

(`localhost` won't work from a physical phone — it needs your computer's
actual LAN IP address, e.g. `192.168.1.42`. Find it with `ipconfig` on
Windows or `ifconfig`/`ipconfig getifaddr en0` on Mac.)

## If `npx expo start` fails

Paste the exact terminal output — don't guess what's wrong, and I won't
either. Common first-run issues with Expo are a Node version mismatch or a
missing native module that needs `npx expo install <package>` instead of
plain `npm install`; the error message will say which.
