# ReliefMesh Flutter app

Native Android/iOS field client for the live ReliefMesh platform. This is not
an Expo project and it contains no mock-data fallback. Login, registration,
incident history, GPS reports and SOS submissions use the Next.js API and its
configured PostgreSQL/Supabase database.

Role-aware capabilities are enabled from the server-issued account role:

- `CITIZEN`: GPS SOS, detailed reports, personal incident history and alerts.
- `ADMIN` / `OPERATOR`: all-incident queue, review, verification, responder
  assignment, closure and critical-incident alerts.
- `RESPONDER`: assigned incidents, accept/start response, resolve and alerts.

## Run locally

Install Flutter stable, then from this directory:

```bash
flutter pub get
flutter run --dart-define=API_BASE_URL=https://reliefmesh-theta.vercel.app
```

The production URL above is also the safe default. To use a local Android
emulator against a local web server, pass `http://10.0.2.2:3000` instead.

## Push notifications

The app requests Android/iOS notification permission, creates the
`reliefmesh_alerts` notification channel, registers an FCM device token with
the authenticated API, and unregisters it on logout. Foreground notifications
also appear in the OS notification bar, while Firebase delivers background
and terminated-app notifications.

Pass the public Firebase app identifiers at build time:

```bash
flutter build apk --release \
  --dart-define=API_BASE_URL=https://reliefmesh-theta.vercel.app \
  --dart-define=FIREBASE_API_KEY=your-public-firebase-api-key \
  --dart-define=FIREBASE_APP_ID=your-android-firebase-app-id \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID=your-sender-id \
  --dart-define=FIREBASE_PROJECT_ID=your-project-id
```

For GitHub Actions set repository **Variables** named `FIREBASE_API_KEY`,
`FIREBASE_ANDROID_APP_ID`, `FIREBASE_MESSAGING_SENDER_ID`, and
`FIREBASE_PROJECT_ID`. These identify the Firebase client and are not service
credentials.

Set `FIREBASE_SERVICE_ACCOUNT_JSON` as a protected **Secret** in the Vercel
project for Production and Preview. Never add that JSON to GitHub variables,
Dart defines, source control, or a `NEXT_PUBLIC_` variable. Apply the committed
`20261118090000_add_push_tokens` migration before enabling delivery.

## Verify and build

```bash
flutter analyze
flutter test
flutter build apk --release \
  --dart-define=API_BASE_URL=https://reliefmesh-theta.vercel.app
```

The APK is written to `build/app/outputs/flutter-apk/app-release.apk`.
GitHub Actions performs the same checks and uploads the APK on every push.

## Security and backend configuration

- The app stores only its signed user session in Android Keystore/iOS
  Keychain through `flutter_secure_storage`.
- It never embeds `DATABASE_URL`, a Supabase service-role key, `AUTH_SECRET`,
  or the Guardian device secret.
- Supabase/PostgreSQL credentials stay in the deployed Next.js server. The
  mobile app authenticates with `Authorization: Bearer <session token>` and
  calls the same validated API routes as the website.
- `API_BASE_URL` is a compile-time public host setting, not a secret.
- Firebase Admin service credentials are read only by the Next.js server.

## Release signing

The checked-in Android configuration creates an installable release APK with
the standard development signing key in CI. Before Play Store distribution,
configure a private upload keystore in a protected CI secret; never commit a
keystore or `key.properties`.
