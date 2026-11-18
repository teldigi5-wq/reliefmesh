# ReliefMesh — Professional Responsive Website Redesign

A high-fidelity, static homepage implementation aligned with the ReliefMesh Figma redesign.

## What is included

- `index.html` — accessible homepage markup
- `styles.css` — professional dark navy / cyan / red design system and responsive layouts
- `app.js` — mobile menu, image zoom dialog, progressive reveal animations, focus management
- `assets/` — all nine uploaded ReliefMesh visuals converted to high-quality, web-optimized WebP

## Run locally

Open `index.html` in a browser, or serve the directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Image aspect ratios

The original artwork is preserved without cropping:

- Four product posters use `aspect-ratio: 1122 / 1402` (approximately **4:5 portrait**).
- Five unique landscape illustrations use `aspect-ratio: 1672 / 941` (approximately **16:9 landscape**).
- CSS uses `object-fit: contain` rather than `cover`, so the infographic text remains visible.
- The community relief illustration is intentionally reused in the final community section.

## Integrating into the existing Vercel website

**Important:** This package is the redesigned homepage/front-end prototype, not a replacement for the production authentication and incident backend. Merge the styles and section markup into the existing app's homepage component and copy image assets into its public assets directory. Do **not** replace your entire deployed application with these static files: that could remove your real `/login` and `/register` routes and other functionality.

The login and registration CTAs currently point to:

- `https://reliefmesh-theta.vercel.app/login`
- `https://reliefmesh-theta.vercel.app/register`

Keep or replace those links according to the current app router when integrating.

The IoT and wearable images are labeled as concepts. Do not claim production readiness, certified safety functionality, live GPS performance, medical accuracy, water-resistance ratings, or emergency response guarantees without validation.

## Figma

Editable desktop (1440px) and mobile (390px) layout mockups:

https://www.figma.com/design/gWujcD28Du5JHVmizLQMsD

All nine supplied images have been placed into the Figma design at their correct aspect ratios. The Figma image fills are optimized preview renditions; the downloadable HTML package includes all nine artwork images as high-quality WebP assets.
