# Sicher Engineering source inventory

Audit performed on 6 October 2026. Primary source: https://www.sicherengineering.in/.
Original HTML, extracted text, navigation and image metadata are retained locally in `docs/source-audit/` (excluded from the source publication).

## Pages inspected

| Existing URL | Content retained / action |
| --- | --- |
| `/` | Company services, Ambala location, 2019/2022/2023 milestones |
| `/about-us` | Stainless/mild steel manufacturing, mission, vision |
| `/products` | Five product categories, materials and finishes |
| `/automated-door-solutions` | Pneumatic/electrical modes, controls, safeguards, 120 kg, 200–800 mm/s, materials, 500+ units, published standards |
| `/lavatory-solutions` | LHB/Amrit Bharat, SS304/316, basin/sink deep drawing, dustbins/brackets/housings, CNC/TIG/MIG/electropolishing, 10,000+ units |
| `/pivoted-door-solutions` | 150 kg per leaf, reinforced frame, pivot hinges, materials, powder coat/anodize/polish, published standards |
| `/window-solutions` | Fixed/sliding, two/three leaves, SS/aluminium/FRP/UPVC, configurable dimensions/profiles/finishes, installation scope |
| `/copy-of-window-solutions` | Actual benches URL: SS304/316, reinforced frames, TIG/MIG, CNC/laser/electropolishing, length/capacity/leg/mounting/finish options |
| `/blog` | Article index and internal links |
| `/contact-us` | Telephone, email discrepancy, address, business hours |
| `/sitemap.xml` | Sitemap index inspected |
| `/pages-sitemap.xml` | All ten core pages cross-checked |
| `/blog-posts-sitemap.xml` | Five articles, including one omitted from the current fetched index |
| `/blog-categories-sitemap.xml` | Only the existing blog category/index |
| `/robots.txt` | Crawling rules inspected |

All five articles were read, including dates, updated dates, headings and the body:

- `/post/online-services-for-custom-metal-fabrication`
- `/post/the-rise-of-online-sheet-metal-fabrication`
- `/post/the-ultimate-guide-to-institutional-sheet-metal-fabrication`
- `/post/expert-tips-for-precision-sheet-metal-fabrication-success`
- `/post/innovative-sheet-metal-solutions-for-institutional-clients`

Articles are concise edited adaptations with original titles, dates, URLs and links to the originals. Technical guidance and procurement information are retained. Generic promotional language, speculative technology claims and illustrative school/hospital stories are not turned into company capabilities, clients or case studies.

## Verified contact information and unresolved discrepancy

- Legal name: Sicher Engineering India Pvt. Ltd.
- Location: Village Kakkarmajra, Shahzadpur, District Ambala, Haryana, 134202. The source uses both “Shahzadpur” and “Shazadpur”; the locality is preserved with consistent spelling.
- Telephone: +91 70820 03485 (contact page).
- Contact page email: `info@sicherengineering.in`.
- Footer email: `info@sicherenginnering.in`.
- **The two email spellings are not assumed equivalent or corrected automatically.** Both appear with source labels on the contact page; the footer spelling is retained in the footer. The enquiry recipient selector exposes both. The company must verify which mailbox is active.
- Hours: Monday–Friday 9 am–6 pm, Saturday 9 am–5 pm, Sunday closed (IST).

## Standards and figures

- Original product pages reference ISO 9001 and ISO 14001 certified processes. No certificate number, issuer, scope, expiry date or downloadable certificate was supplied.
- Door pages reference `UIC-564` exactly. This is retained as a published reference, not independently validated, amended to another designation or used to imply a new safety certification.
- Lavatory fittings are described as in line with Indian Railways specifications; no drawing number or revision is published.
- 500+ automatic door units and 10,000+ lavatory units are existing published supply figures. They are not estimates of annual output, manufacturing capacity or newly audited deployment totals.
- No fabricated customers, contracts, testimonials, plant area, employee counts, awards, machinery capacities, tolerances or delivery times were introduced.
- Original footer copyright “2035” was replaced by the current year, 2026.

## Images

Source image URLs, original dimensions and page origins are recorded in `public/assets/manifest.json`.

- The actual existing logo is retained; a larger version of the original Wix crop was downloaded.
- Product illustrations and railway/application photographs are reused from the original website.
- Original images include stock scenes and apparent product illustrations. They are labelled by context rather than claimed as photos of Sicher’s premises or installations.
- The machining image does not establish a particular Sicher machine or capacity.
- Sanding a wooden board, generic construction workers, a generic domestic bathroom and the AI-named contact image are not used in the finished site.
- No new images or imaginary products were generated.
- **Genuine facility photographs, close-ups of manufactured components and current certificate documents remain desirable company-supplied replacements.**

## Architecture and design references

Sitemap: home, company, product catalogue, five product details, capabilities, industries, insights, five article details, contact/RFQ and privacy information (18 pages).

Existing indexed page and article URLs are retained. The benches page uses `/stainless-steel-benches`; the former `/copy-of-window-solutions` receives a 301 in the local server and a redirect rule plus an HTML canonical/refresh fallback in the static output.

Professional industrial references inspected:

- https://www.knorr-bremse.com/en/ — conventional corporate divisions, company information and clear resource links.
- https://schaltbau.com/en/ — separation of applications, product information and technical resources.
- https://www.hoermann.com/ — restrained company presentation and conventional product hierarchy.

No reference’s claims, branding, imagery or effects were copied. The design uses self-hosted IBM Plex Sans, the existing navy/white identity with neutral backgrounds and a small muted brass accent, square image crops, conventional buttons and specification tables. There are no gradients, glass panels, animated counters, icon grids or scroll effects.

## Enquiry behavior

There is no authenticated company mail service or upload backend in the supplied project. Forms validate details, prepare a review dialog, copy/download text and open a `mailto:` draft. They never claim to send or upload. Files are attached in the visitor’s email application. Fields remain disabled when JavaScript is unavailable to prevent accidental default form submission.
