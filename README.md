# Sicher Engineering — Immersive

A separate 18-page redesign with a real-time 3D sliding-door assembly, native scroll chapters, editorial product pages, and a short branded loading introduction. This project lives independently of the preserved Classic version.

## Local preview

Requires Node.js 20.11 or later.

```bash
npm ci
npm run build
npm run dev
```

Open http://localhost:4174. Set `SICHER_PORT` to change the port. The saved Classic site runs independently on http://localhost:4173.

```bash
npm run check
```

The checks cover generated pages, local links/anchors/assets, metadata, structured data, specifications, enquiry preparation and loader readiness/failure cases. Browser verification is recorded in `docs/QA.md`.

## Design and interaction

The graphite, warm ivory and copper homepage pairs a procedural metal-and-glass door study with three engineering chapters. Native scrolling reveals the story; there is no scroll hijacking. Assemble, Explode, Rotate and Reset controls provide a closer look. The 3D model is an illustrative concept, not proprietary product CAD.

Phones and short windows display the chapters sequentially. Reduced-motion and Save-Data preferences expose the full story and bypass the loader and continuous scene animation. A vector illustration remains available when WebGL or the scene module cannot load. The loader follows image, font and scene readiness, allows interaction to skip it, and has a 1.7-second deadline.

Three.js and IBM Plex Sans are served locally. The scene module is requested only on the homepage; inner pages remain lightweight static pages.

## Editing

- `src/content.mjs`: source-backed company, product and article information.
- `src/templates.mjs`: shared layout and immersive homepage.
- `src/pages.mjs`: inner pages, product tables and enquiry forms.
- `src/loading.js`: inline readiness loader.
- `public/core.css`: shared structural styles.
- `public/site.css`: the new responsive visual system.
- `public/motion.js`: native scroll chapters, reveals, progress and motion preferences.
- `public/scene.js`: Three.js assembly, lighting and interactions.
- `public/site.js`: menus, image galleries and enquiry preparation.
- `scripts/build.mjs`: generates static pages and bundles local vendor assets into `dist/`.
- `docs/FRESH-SOURCE-RESEARCH.md`: refreshed original-site content and design reference audit.
- `docs/CONTENT-AUDIT.md`: retained source inventory and factual limits.

`SICHER_SITE_URL` overrides the canonical and sitemap origin; the default is https://www.sicherengineering.in. Deploy the generated `dist/` directory only when a destination is chosen. This redesign currently runs locally; the published company website has not been replaced.

## Enquiries and source details

Forms prepare an enquiry on the visitor’s device, with review, copy, download and email-draft actions. They do not send a message or upload drawings. The source contact page and footer use different email spellings; both are retained and labeled. A production submission backend requires a confirmed recipient.

The legacy `/copy-of-window-solutions` route redirects to `/stainless-steel-benches` with HTTP 301 on the local server. Static output includes `_redirects`, hosting configuration and an HTML fallback; retain equivalent redirect rules when deploying. Unknown routes return a real 404 locally.

Three.js uses the MIT license (`dist/vendor/THREE-LICENSE.txt`). IBM Plex Sans uses the SIL Open Font License (`public/assets/OFL.txt`). Original company imagery is documented in `public/assets/manifest.json`.
