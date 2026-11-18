# Push ReliefMesh from your local computer

The source archive contains the complete web app, Expo mobile app, Prisma
schema and migration, tests, documentation, production smoke test, and GitHub
Actions workflow. It intentionally excludes Git history, dependencies, build
output, test artifacts, and `.env` secrets.

## Before pushing

Install Node.js 20 LTS or newer and Git. Extract the archive, open a terminal
inside the extracted `reliefmesh` directory, then verify the package:

```bash
npm ci
npm ci --prefix mobile
npm run verify:ci
```

`verify:ci` runs web and mobile type checks, ESLint, 22 unit/security tests, a
production Next.js build, and the production-server smoke test.

## Option A: push as a new branch in the existing repository

If the extracted folder is already inside a clone of your repository:

```bash
git switch -c feature/premium-app-workflow
git add .
git commit -m "Add verified app build workflow and reliable incident actions"
git push -u origin feature/premium-app-workflow
```

If you extracted the archive separately, first clone your existing repository
and copy the archive contents into that clone. Do not copy a `.env` file or
`node_modules` directory. Then run the commands above from the clone.

Open a pull request from `feature/premium-app-workflow` into `main`. The new
GitHub Actions workflow will run automatically.

## Option B: push as a new repository

Create an empty repository on GitHub without adding a README, license, or
`.gitignore`. From the extracted `reliefmesh` directory, run:

```bash
git init
git add .
git commit -m "Initial ReliefMesh application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with the new GitHub location.

## Local configuration

Create your private environment file after cloning or extracting:

```bash
cp .env.example .env
```

Set at least:

- `DATABASE_URL`
- `AUTH_SECRET`
- `GUARDIAN_DEVICE_API_SECRET`
- `GUARDIAN_REPORTER_EMAIL`

Never commit `.env`. The included `.gitignore` already excludes it.

Apply the database and load demonstration accounts:

```bash
npm run prisma:deploy
npm run prisma:seed
```

Start the web application:

```bash
npm run dev
```

For the Expo application:

```bash
npm --prefix mobile start
```

See `README.md`, `docs/BUILD_WORKFLOW.md`, and `docs/DEMO_SCRIPT.md` for the
complete setup, CI, and presentation workflows.
