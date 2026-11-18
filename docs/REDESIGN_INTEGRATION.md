# ReliefMesh production homepage integration

This branch integrates the Figma-inspired ReliefMesh landing page into the existing Next.js App Router website.

## Included

- \`src/app/page.tsx\`: native React/Next.js homepage, responsive navigation and functional internal links.
- \`src/app/reliefmesh-landing.css\`: styles scoped to \`.rm-site\`, leaving authenticated routes unchanged.
- \`public/reliefmesh/*.webp\`: nine original website artwork assets reused from \`redesign-preview/assets\` without altering them.
- Images render at intrinsic 1122×1402 (portrait) or 1672×941 (landscape), with \`object-fit:contain\`. Clicking artwork opens the full image in a new tab.

## Existing functionality preserved

The integration does not modify auth/session logic, routes, API handlers, Prisma data models, maps, dashboards, notification flows, Guardian simulation services, or mobile code.

The homepage's "Report an emergency" and "Get started" actions open the existing \`/register\` route. Existing users can use \`/login\` and continue to the dashboard and incident reporting system.

Guardian hardware is a **concept**; the existing monitoring route explicitly labels its current events as simulated.

## Verification before merging

Run on a clean copy of the branch:

\`\`\`powershell
npm ci
npx prisma generate
npm run typecheck
npm run lint
npm run build
npm run dev
\`\`\`

Check \`http://localhost:3000/\` and the existing \`/login\`, \`/register\`, \`/dashboard\`, \`/incidents\`, \`/guardian\` routes. Verify responsive widths around 390px, 768px and 1440px.

Do not overwrite uncommitted local edits. Changes in \`mobile/\` and \`package-lock.json\` were not modified in this commit. Keep \`main\` unchanged until testing and review are complete.
