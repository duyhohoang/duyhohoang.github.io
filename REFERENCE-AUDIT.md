# Phase 1 — reference audit

2026-10-15. All supplied Markdown and JSON specifications were read, including `color-override.md` added during the audit. The override is mandatory and supersedes the provisional palette. This report covers Phase 1; application UI and its build gates belong to Phase 2 onward.

## Verified source tokens

Read public styles `0.BzCzEfB7.css`, `4.DEza4-CX.css`, and `Button.CuPZovLP.css` from openhardware.antmicro.com for inspection only. No reference styles or assets are included in the implementation.

White #ffffff; gray 1 #d9d9d9; gray 2 #a7a7a7; gray 3 #8b8b8b; gray 4 #79797c; dark 1 #3f4043; dark 2 #282b30; dark 3 #2e2e2e; dark 4 #141618; error #ffa3a3. Additional observed colors: #16181b, #17181b, #24272a, #323539, #b4fdb1. Fonts: Lato and Roboto. Responsive CSS boundaries: 50rem and 56rem.

## Live observations

Home: dark full-width header, fine gray separator, outlined hero panel, uppercase heavy Lato headings, restrained outlined CTA; narrow layout places copy above imagery. Editorial section sequence agrees with the blueprint. Catalog: outlined cards with separate heading, dark image area and summary; search/count sidebar on desktop; two featured columns. Reference board renders were initially blank while loading. First browser navigation timed out but subsequent inspection succeeded.

Browser timeouts recovered. Repeated captures now assert `innerWidth` before saving screenshots and computed style records. Ignore the initial stale capture in the conversation; use saved evidence in `docs/reference-evidence/`.

| Page | Captured widths |
| --- | --- |
| Home | 1440, 1024, 768, 390, 375 |
| Catalog | 1440, 1024, 768, 390 |
| Jetson Orin detail | 1440, 1024, 768, 390 |
| Jetson AGX Thor detail | 1440, 1024, 390 |
| Mobile menu open / keyboard traversal | 390 |

All captures are audit evidence only, not website assets. Viewport heights: 900 desktop, 768 at 1024 width, 1024 at 768 width, 844 at 390 width, 812 at 375 width. Device scale is approximately 1. A scrollbar occupies about 15px of available layout width.

## Measured geometry and typography

- Desktop header is 89px tall. Logo bounds at 1440: x≈136, y≈22.5, 140×44px. Header inner area about 1152px; main editorial container 1200px, x≈112.
- Desktop hero title is 34px / 42px, four lines in the reference. Hero body is 16px / 22px, about 319px wide. Title begins x≈212, y≈215. The outlined panel is about 580px wide and overlays the large original-reference globe on a black stage.
- At 390px, header remains 89px. Hero heading is about 29.27px / 36.15px; body about 13.77px / 18.94px. Editorial h2 remains 34px / 42px. The paragraph is about 228px wide. Mobile hero stacks panel and globe vertically.
- Editorial sections use alternating image/text arrangements, uppercase eyebrows, 34px titles, substantial vertical separation and understated outlined buttons. Section order: library, hardware transparency, tooling, automation, contact.
- Desktop catalog has two featured columns plus a right search/count rail. Cards have distinct heading/image/description zones, 1px gray separators and a near-black image surface. Blueprint intentionally requests a three-column main studio catalog, with two at tablet and one at mobile.
- Orin detail has left descriptive column, right large render/photo comparison and vertical view controls. Thor omits the render/photo split when no photo is supplied. Both have horizontal engineering section selectors and related content. Studio implementation must similarly omit unavailable content.
- Mobile navigation opens a dark full-width menu with divider-separated links. Desktop switches around 800px; additional layout changes appear at 896px.

The blueprint's requested original three-line hero copy and extra capabilities/workflow routes remain intentional content differences. Do not mechanically preserve four reference lines at the expense of the supplied copy.

## Exact color and layer mapping

`docs/reference-colors.json` consolidates computed RGBA values, source tokens, selectors, viewport records and interaction evidence. `src/styles/tokens.css` maps them to semantic roles.

| Role | Audited value |
| --- | --- |
| Body fallback | #282b30 |
| Page underlay / gradient endpoints | #24272a / #16181b → #323539 |
| Header base / overlay | #17181b / rgba(0,0,0,0.2) |
| Hero stage / panel | #000000 / rgba(23,25,27,0.8) |
| Titles and hero copy | #d9d9d9 |
| Editorial paragraphs and inactive nav | #8b8b8b |
| Buttons | #a7a7a7 foreground/border; rgba(40,43,48,0.1) background |
| Outlined button hover | #d9d9d9 background/border; #3f4043 text/icons |
| Outlined button pressed | #a7a7a7 background/border; #79797c text/icons |
| Card overlay / image area | rgba(0,0,0,0.1) / #181a1c |
| Divider | #8b8b8b |
| Input text | #d9d9d9 |
| Keyboard focus | #b4fdb1, 2px outline |
| Disabled | opacity 0.5 |
| Error | #ffa3a3 |

Separate layers: the reference uses a noise texture, a faint 84px grid and complex radial/linear page gradients. The black hero backdrop contains a moving hardware globe. Those images and reference rendering code must not be reused. Original imagery, independently implemented gradients, and an original texture can approximate composition using the audited colors. Image pixel colors are not UI tokens. Computed inherited link values on image wrappers are preserved in raw evidence but are not promoted to semantic colors without a visible UI role.

## Interaction evidence and limits

Default computed colors, SVG fill/stroke, borders, opacity, outlines, and backgrounds were recorded. Mobile menu was actually opened/closed; keyboard traversal was exercised. CSSOM/source records include hover, focus, active and disabled rules. The available semantic browser API did not exercise held-pointer active or pointer hover, so those are **CSS_SOURCE_VERIFIED / LIVE_STATE_UNVERIFIED**. Do not represent them as screenshot-verified. Motion was visually observed but exact timings are unmeasured. No pixel parity to an implementation is claimed during Phase 1.

## Design system and component map

Global: Header (desktop links/mobile dialog), Footer, Container, Button, Reveal. Home: Hero, Intro, BoardCard, Engineering, Capabilities, Toolchain, Workflow, ContactCTA. Catalog: validated project collection, URL-backed BoardFilters, BoardGrid, EmptyState. Detail: Gallery, Specs, keyboard Tabs, sortable BomTable, Stackup, conditional Files.

Use original neutral technical illustrations labeled illustrative. HARDWARE LAB is the supplied provisional brand. Real email/domain, rights, specifications, files and GLB remain launch prerequisites. Do not invent these inputs.

## Phase 1 gate

Specification inventory, CSS token extraction, computed evidence and responsive screenshot matrix passed. `node scripts/audit-colors.mjs` passes: nine hex root tokens (plus separately verified gray-3), 20 evidence records, required screenshots, no provisional palette in tokens. Initial framework configuration/dependency preparation is present; no application pages have been implemented and no application build is claimed.

Phase 2 prerequisites: keep all UI colors in tokens; supply original illustrative board assets; use Lato/Roboto (self-host with license); implement the shell/home then run lint, strict TypeScript and build. Prioritized remaining checks: (1) held-pointer states, (2) original texture/gradient appearance, (3) original hero composition, (4) motion timing, (5) accessibility contrast. The reference's #8b8b8b on #282b30 is approximately 4.17:1, below the blueprint's 4.5:1 normal-text target; assess actual composited backgrounds and document any role adjustment within the audited palette.
