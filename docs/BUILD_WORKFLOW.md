# ReliefMesh build and release workflow

The repository now ships two real clients backed by one API and database:
the Next.js web app and the native Flutter app. Expo is not part of the build.

## Pipeline

```text
Change code
    ↓
Local verification
    ├─ TypeScript + ESLint
    ├─ Vitest security/unit tests
    ├─ Flutter static analysis + tests
    ├─ Next.js production build
    └─ Production-server smoke test
    ↓
Push / pull request
    ↓
GitHub Actions quality job
    ├─ Repeat every local gate
    ├─ Build a release Android APK against the live API host
    └─ Upload the APK as a workflow artifact
    ↓
PostgreSQL 16 lifecycle job
    ├─ Apply committed Prisma migrations
    ├─ Seed an isolated CI database
    └─ Playwright: report → verify → assign → respond → resolve → close
    ↓
Device acceptance check → signed store release
```

## Local commands

Install dependencies once:

```bash
npm ci
cd mobile
flutter pub get
cd ..
```

Run the full gate:

```bash
npm run verify:ci
```

Build an installable Android app connected to the current deployment:

```bash
npm run mobile:build:android
```

The result is `mobile/build/app/outputs/flutter-apk/app-release.apk`.

## API and Supabase configuration

The mobile app calls `https://reliefmesh-theta.vercel.app` by default. Change
the public API host at build time without editing source:

```bash
cd mobile
flutter build apk --release \
  --dart-define=API_BASE_URL=https://your-reliefmesh-host.example
```

For GitHub Actions, set the repository variable `MOBILE_API_BASE_URL`. Do not
add database credentials or Supabase service-role keys to Flutter build
arguments. They remain server-side as deployment secrets (`DATABASE_URL`,
`AUTH_SECRET`, and Guardian secrets).

For notification-bar push delivery, also set these GitHub repository
**Variables**: `FIREBASE_API_KEY`, `FIREBASE_ANDROID_APP_ID`,
`FIREBASE_MESSAGING_SENDER_ID`, and `FIREBASE_PROJECT_ID`. Add
`FIREBASE_SERVICE_ACCOUNT_JSON` to Vercel as a protected **Secret** scoped to
Production/Preview. The service-account JSON is server-only and must never be
passed to Flutter or committed. Deploy the `20261118090000_add_push_tokens`
migration before the mobile rollout.

## GitHub artifact

Open the repository's **Actions** tab, select a successful **Build and
verify** run, and download the `reliefmesh-android-<commit>` artifact. It
contains the APK; there is no Expo/EAS dependency.

## Release requirements

- Both GitHub Actions jobs pass on the exact release commit.
- The deployed web API has its production database migration applied.
- Login, registration, GPS permission, SOS creation and incident refresh are
  checked on a physical Android device.
- Notification permission, background delivery and notification-tap routing
  are checked on a physical device with the production Firebase project.
- A private Android upload keystore is supplied through protected CI secrets
  before Play Store distribution.
- Production Supabase/database secrets remain only in the server deployment.

Automated tests prove source integrity, buildability, permissions and the main
database lifecycle. Physical-device GPS and store signing remain deliberate
release checks because CI cannot truthfully simulate the phone hardware or
hold your private signing key.
