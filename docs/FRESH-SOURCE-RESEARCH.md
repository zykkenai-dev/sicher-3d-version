# Fresh source review for the immersive redesign

Reviewed **8 October 2026**. This document belongs to the separate immersive project in the Documents directory. The existing redesign and its Classic archive were not edited.

The current company website was read through the web tool and re-fetched directly over HTTP. The essential facts match `src/content.mjs` and the earlier `docs/CONTENT-AUDIT.md`; no technical content corrections are required. HTTP results and current image identities are recorded in `FRESH-SOURCE-SNAPSHOT.json`.

## Company and source coverage

[Home](https://www.sicherengineering.in/) confirms the company name, Shahzadpur/Ambala location, sheet metal components, automatic doors and railway/electrical focus. It lists CNC laser cutting, bending, hydraulic pressing, laser/TIG/MIG/ARC welding and electropolishing. Its history remains 2019 establishment, first Indian Railways door supply in 2022, and first automatic sliding door order in 2023.

[About](https://www.sicherengineering.in/about-us) confirms stainless steel and mild steel fabrication. [Products](https://www.sicherengineering.in/products) confirms the same five product groups and electropolished, powder-coated and shot-blasted finishes. All nine main pages re-fetched returned HTTP 200. The live [page sitemap](https://www.sicherengineering.in/pages-sitemap.xml) is accessible. The attempted `/capabilities` URL returned **404**; the redesigned capabilities page is an editorial organization of published home/product information, not a migrated original page.

## Technical facts reconfirmed

| Live primary source | Confirmed information retained in the new version |
| --- | --- |
| [Automated doors](https://www.sicherengineering.in/automated-door-solutions) | Pneumatic/onboard air with electropneumatic logic, or electrical controls using IR sensors, pressure pads and push buttons; microcontroller and fail-safe circuitry references; aluminium, SS304/316 and mild steel; up to **120 kg per leaf**; **200–800 mm/s**; anti-pinch sensing, obstruction detection, emergency release and manual override; published **500+ supplied units**. |
| [Lavatory solutions](https://www.sicherengineering.in/lavatory-solutions) | LHB and Amrit Bharat; SS304/316 deep-drawn basins/sinks, dustbins, brackets and housings; polished/matte basin finishes; electropolished dustbins; CNC, TIG/MIG welding and mounting provisions; published **10,000+ supplied units**. |
| [Pivoted doors](https://www.sicherengineering.in/pivoted-door-solutions) | Heavy-duty hinges and reinforced frames; up to **150 kg per leaf**; aluminium, SS304/316 and mild steel; powder-coated, anodized or polished finishes; rail/metro, industrial and architectural applications. |
| [Windows](https://www.sicherengineering.in/window-solutions) | Fixed/sliding, two/three leaves; stainless steel, aluminium, FRP and UPVC; configurable dimensions, profile and finishes; published processing-to-installation scope. |
| [Stainless steel benches](https://www.sicherengineering.in/copy-of-window-solutions) | SS304/316, reinforced frames, CNC/laser processing, TIG/MIG welding, electropolishing; configurable length, seat capacity, legs, mounting and finishes; platforms, coaches, terminals, hospitals and industrial facilities. |

Door pages still publish ISO 9001/14001 and **UIC-564** references. The fetched material does not supply certificate number, scope, issuer, expiry date, independent test report or a quantified forced-entry rating. Keep these as attributed published references and request documentation; do not convert them into newly verified certification. Unit figures remain source supply totals, not capacity estimates or independently audited current deployment counts.

## Contact discrepancy remains unresolved

The [contact page](https://www.sicherengineering.in/contact-us) still displays `info@sicherengineering.in`; the shared footer still displays `info@sicherenginnering.in`. The new site should continue showing the source distinction and recipient choice until the company verifies its mailbox. Telephone is **+91 70820 03485**. The address remains Village Kakkarmajra, Shahzadpur, District Ambala, Haryana 134202; the live source also spells the locality “Shazadpur.” Hours remain Monday–Friday 9 am–6 pm, Saturday 9 am–5 pm, Sunday closed, IST.

## Existing imagery

Direct HTML confirms the original Wix media identities recorded in `public/assets/manifest.json`, including the logo, workshop/CNC imagery, all five catalogue images and door/window/bench application images. The separate project already contains optimized copies. No image replacement is needed to synchronize these retained assets with the current source.

The about page still uses generic sanding/workers imagery; the contact image is named as AI imagery. These do not establish company facilities and remain unsuitable as documentary manufacturing photography. Product illustrations and application photographs can remain useful with truthful captions. A newly created 3D door assembly should be identified as a **concept visualization**, not a measured company CAD model or a new product specification.

## Primary design references and original implementation direction

1. **[OSSO, Framer Marketplace](https://www.framer.com/marketplace/templates/osso/)** — a current industrial engineering template published 2 September 2026. Its source description emphasizes large industrial imagery, editorial typography, process explanations and structured services. Useful direction: retain a clear engineering information hierarchy beneath the immersive scene, with strong chapter labels and generous spacing. The marketplace page was accessible; its separate demo preview could not be fetched through the web tool, so no unobserved demo behavior is claimed or copied.
2. **[Framer Academy: 3D transforms](https://www.framer.com/academy/lessons/3d-transforms)** and **[scroll transforms](https://www.framer.com/academy/lessons/scroll-transforms)** — primary guidance on perspective/origin/depth and mapping section progress to rotation, position, scale or opacity. Useful direction: let scroll reveal how an assembly separates and rejoins; use a restrained camera angle and short movement ranges; verify intermediate states at every breakpoint; keep text and controls stable and respect reduced motion.
3. **[Bruno Simon’s interactive portfolio](https://bruno-simon.com/)** — its own implementation description identifies Three.js, WebGL/WebGPU and device-specific controls, alongside a quality setting. Useful direction: progressive enhancement, explicit touch/keyboard controls where needed and performance adaptation. For Sicher, apply those principles to a focused technical product scene and ordinary accessible navigation. Do not copy the portfolio’s car/game premise, geometry, audio or assets.

The resulting motion direction is original: a short branded mechanical loader, a brushed-metal conceptual door assembly, scroll-controlled camera/assembly progression, dimensional product reveals and measured typography entrances. The ordinary content, specifications, RFQ and links remain available when 3D or motion is disabled. Native page scrolling remains the basis of the experience.

The user now explicitly requested premium animation and 3D for this separate version. That request supersedes the first redesign brief’s motion restriction for this project only.
