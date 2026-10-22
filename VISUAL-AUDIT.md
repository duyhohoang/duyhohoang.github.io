# Visual fidelity audit

Reference: https://openhardware.antmicro.com/ · Local implementation: http://127.0.0.1:3000/ · 2026-10-15.

Evidence lives in `docs/reference-evidence/` and `docs/implementation-evidence/`. Screenshots are private comparison artifacts, not application assets. Resize and capture must occur in separate browser calls: the first immediate screenshot after a viewport override can be stale. Early `phase2-*` screenshots are retained as work-in-progress evidence; final `production-*` captures supersede them.

## Ranked findings and changes

| Priority | Difference | Action / remaining scope |
| --- | --- | --- |
| 1 | Provisional teal palette differed from live reference | Replaced with exact audited reference colors; computed source evidence in `docs/reference-colors.json`. No arbitrary new brand colors. |
| 2 | Desktop hero panel was too low and too short | At 1440, now measured x≈112, y=143, 580×627px, matching the reference panel geometry. Original three-line title intentionally replaces reference four-line copy. |
| 3 | Header proportions and neutral surfaces | Header 89px, logo region aligned around x=136 at 1440; audited charcoal/overlay and divider. Original H+ mark and required studio navigation replace reference branding/links. |
| 4 | Typography was provisional | Self-hosted licensed Lato/Roboto. Editorial heading 34/42px; original three-line hero uses 49px on wide desktop to retain comparable title-block height. No exact text-shape parity is claimed. |
| 5 | White native scrollbar and flat header | Dark color-scheme/neutral scrollbar; original procedural noise over audited header colors. No reference texture copied. |
| 6 | Page background lacked technical layering | Added independently implemented 84px grid, original grayscale texture and radial gradient using audited endpoints. Reference has a more complex multi-origin gradient; exact texture pixels are intentionally different. |
| 7 | Catalog cards lacked reference zone treatment | Outlined heading/image/description zones, near-black image surface and fine dividers. Studio main grid is 3/2/1 as required by blueprint; reference has two featured columns plus a sidebar. Filter bar and studio title are intentional content/layout extensions. |
| 8 | Detail imagery and technical controls | Split description/gallery, breadcrumbs, tabs and related cards follow observed hierarchy. Only original illustrations/diagram are available; no photo comparison, mechanical data, fabricated BOM or fake 360° controls. |
| 9 | Small gray labels could miss AA contrast | Small labels use audited #a7a7a7 instead of #8b8b8b over the lighter charcoal. Palette remains exact; this is a documented foreground-role adjustment for readability. Reference active button colors remain source-matched; their transient contrast is not represented as an independently certified WCAG result. |
| 10 | Mobile proportions and motion | Mobile stacks panel and illustration with drawer navigation; zero page overflow checked initially at 320/390/1024/1440. Original shorter copy makes its mobile panel more compact than the reference. Reduced-motion handling is implemented. Reveal timing is original; reference exact motion/globe rotation was not reproduced. |

## Verified composition and interaction

Home section ordering matches the blueprint. Main hero and interface colors are derived from CSS/computed styles, not board-image colors. Original illustrations are explicitly labeled. Catalog search, combined filters, clearing and refreshable URL state have been exercised. Native mobile dialog focus, Escape, focus restoration and background scroll lock have been exercised. Additional full route/viewport, image, accessibility and performance outcomes are recorded in `PROGRESS.md` and machine-readable reports after final checks.

Final browser coverage passes real client navigation, query refresh, mobile focus wrapping, reduced motion, all seed detail routes, five viewport sizes, image loading, normal-route console errors and automated accessibility. Static segment aliases correct an observed Windows export mismatch. Mobile Lighthouse on compressed delivery measured performance 81, accessibility 100, best practices 100, LCP 3.1s and CLS 0, with a slow-test-CPU warning; the LCP target remains a measured limitation. The earlier desktop result is not presented as a final rerun, which was declined.

## Remaining visual limits

Reference hover/pressed/disabled rules are CSS-source verified; held-pointer reference screenshots were not captured through the available semantic browser API. Full pixel parity is not claimed because branding, copy and imagery are original, the reference's 3D globe is proprietary, and the blueprint intentionally adds content/routes and different catalog columns. No original GLB was provided, so optional 3D is intentionally omitted. Real PCB imagery and finalized content will require another visual review before public launch.
