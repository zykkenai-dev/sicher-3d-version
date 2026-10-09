# Immersive redesign verification

Verified locally on 8 October 2026. This report applies to the separate Documents/Sicher-Engineering-Immersive project.

## Visitor story

A visitor loads the new site, explores its illustrative 3D door study, follows product links to source-backed specifications and image galleries, and prepares a quotation or general enquiry draft for review on their device.

## Build and server evidence

- `npm run build`: generated all 18 content pages.
- `npm run check`: local links, anchors, image assets, metadata, schema, product tables, form associations and source-content checks passed.
- Loader regression checks passed real image/font/scene readiness, short introduction, 1.7-second failure deadline, failed/missing scene, interaction dismissal, reduced motion, Save-Data and history restoration.
- Motion regressions passed scroll chapters, pause/resume, mobile stacking, preference changes and live short-window breakpoint restoration.
- Both local previews returned HTTP 200: Classic on port 4173 and Immersive on 4174.
- Both locally served Three.js module files returned HTTP 200 with JavaScript content types.
- The legacy benches URL returned HTTP 301 to `/stainless-steel-benches`; an unknown URL returned HTTP 404.
- Browser console inspection returned no site errors or warnings.

## Responsive browser matrix

All 18 routes were inspected at the following CSS viewport sizes:

| Viewport | Use |
|---|---|
|320 ×740|Small phone|
|390 ×844|Phone|
|768 ×1024|Tablet portrait|
|901 ×600|Narrow, short desktop window|
|1024 ×768|Tablet/small desktop|
|1440 ×900|Desktop|
|2560 ×1440|Ultrawide|
|844 ×390|Phone landscape|

144 page/viewport checks passed: no document horizontal overflow, one primary heading on each route, and no failed images with a source URL. Empty, unopened gallery image slots were excluded. Detailed readings are in `qa/responsive-matrix.json`.

Additional homepage checks verified the final 700/701px height boundary, a 1440×540 short window, mobile-to-desktop resize, accessible sequential chapters on narrow/short screens, and restoration of the desktop sticky story. Temporary viewport overrides were reset after testing.

## Interaction and visual evidence

- The real WebGL assembly rendered successfully. Assemble, Explode, Rotate and Reset controls responded; the exploded view visibly separated the glazed leaves and overhead components.
- Native scroll reached the middle and final engineering chapters and updated accessible chapter visibility.
- In the initial build, Pause motion and Resume motion passed interaction checks. The global control was removed on 9 October 2026 at the user’s request; automatic motion preferences remain supported.
- The homepage, portfolio section, mobile hero, menu and review dialog were inspected visually.
- Mobile navigation and product submenu opened correctly and stayed within a scrollable viewport.
- Product gallery opened, advanced to the application image, loaded that image and closed with Escape. The dialog fit the 390px-high landscape viewport.
- Product-specific quote links preselected the matching product.
- Quotation and general enquiry forms produced accurate review drafts with local QA values. No email was sent. The enquiry dialog fit390×844 and844×390 viewports. Phone fields used at least 16px text.
- Inner pages did not request the Three.js scene module.
- Low-contrast secondary text and mobile submenu labels were corrected. The loaded 3D study has an accessible descriptive label; scene controls begin disabled until ready.
- Screenshots: `qa/hero-desktop.png`, `qa/hero-mobile.png` and `qa/loading-introduction.png`.

## Source and preservation

The published site was refreshed for content and product facts; see `FRESH-SOURCE-RESEARCH.md`. No invented clients, test results or certification claims were added. The procedural 3D door remains labeled as an illustrative assembly concept. Original image provenance, product details and the source email spelling discrepancy remain documented.

The original Downloads project and the saved Classic folder each matched all 221 baseline file hashes after the new redesign was completed. The Classic manifest is stored separately in Documents/Sicher-Engineering-Classic-SHA256.json.

## Practical limits

Browser checks used the available local Chromium environment and representative viewport sizes. They do not establish coverage of every physical device or browser engine. Reduced-motion, missing-WebGL and stalled-loader behavior have code/regression coverage; the available browser rendered WebGL successfully. Forms currently prepare local drafts and provide email/export actions; there is no submission API or upload backend. The new site is a local preview and has not replaced the published company site.


## Copper theme and homepage typography revision

The later visual refinement replaces lime/green with graphite, warm ivory and copper throughout the Immersive project, including scene lighting and the vector fallback. The homepage drops decorative microtext, source-provenance captions and redundant numbering. Useful controls, captions, categories, specification labels and source notes use readable sans-serif text at 13px or above. Header and footer labels were enlarged as well. Phone supply figures now use clear horizontal rows, eliminating the overflow caused by the larger numbers.

The revised 18 pages passed 144 checks at the eight viewport sizes above, comparing document scroll width against its actual client width. There were no horizontal overflows, missing primary headings or broken sourced images. See `qa/copper-responsive-matrix.json` and `qa/copper-hero-desktop.png`. The 320px homepage typography inspection found no retained useful main/footer text below 13px. An independent CSS audit found no meaningful small-text contrast failures. The real scene rendered successfully with copper lighting; native scroll behavior and motion controls retain their existing implementation.

The build, content and loader checks passed after this refinement. The original and Classic folders remained unchanged against all 221 saved hashes. The new local preview was refreshed at http://localhost:4174/.


## Motion toggle removal — 9 October 2026

Removed the global Pause/Resume button from every page, its styles, and manual-toggle JavaScript wiring. Reduced-motion and Save-Data preferences still expose the full story and stop continuous motion automatically. Removed the hero/footer spacing reserved for the floating button.

Before the GitHub push, all 18 generated content pages returned HTTP 200 and were checked for the absence of toggle markup and for device-width viewport metadata. The build, content, asset, link, specification, form and loader checks passed. JavaScript syntax and focused motion regressions passed without a toggle, including native scroll, mobile chapters, live preference changes, Save-Data, scene state replay and observer fallback.

A responsive source review found and fixed a narrow-phone submenu issue: the mobile product menu now uses 100% of its parent width, including padding through border-box sizing, instead of a fixed 320px width. Comparing parsed CSS rules with the previously tested commit confirms that all other page layouts and breakpoint rules retain the prior 144-check responsive baseline. The only additional style changes remove the toggle and its reserved spacing. No unresolved source-level layout concerns were found.

A fresh visual viewport pass was unavailable: the browser tool’s automatic security review rejected access to the localhost preview with a disallowed URL-protocol message. No alternate browser route was attempted. These are source/regression checks against prior browser evidence; they are not a new 144-viewport rendering result or a guarantee for every physical device. Local readings are in `qa/motion-toggle-removal-checks.json`.
