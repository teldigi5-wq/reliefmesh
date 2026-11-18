# ReliefMesh Flutter app

Native Android/iOS field client for the live ReliefMesh platform. This is not
an Expo project and it contains no mock-data fallback. Login, registration,
incident history, GPS reports and SOS submissions use the Next.js API and its
configured PostgreSQL/Supabase database.

## Run locally

Install Flutter stable, then from this directory:

```bash
flutter pub get
flutter run --dart-define=API_BASE_URL=https://reliefmesh-theta.vercel.app
```

The production URL above is also the safe default. To use a local Android
emulator against a local web server, pass `http://10.0.2.2:3000` instead.

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

## Release signing

The checked-in Android configuration creates an installable release APK with
the standard development signing key in CI. Before Play Store distribution,
configure a private upload keystore in a protected CI secret; never commit a
keystore or `key.properties`.
