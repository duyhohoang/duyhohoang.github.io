# Phase 1 design system inventory

Authority order: user instruction → `color-override.md` → verified reference evidence → blueprint. Do not edit the specification files to reconcile differences.

## Foundations

- Colors: `src/styles/tokens.css`; evidence: `docs/reference-colors.json`. Use semantic variables throughout components; do not add arbitrary Tailwind colors. Pale green is reserved for the independently verified reference focus outline.
- Typography: Lato for heading/body and Roboto where technical UI requires it. Obtain licensed font files in Phase 2. Reference title 34/42px, body 16/22–24px, eyebrow 14px; the provisional oversized 7.5rem title is superseded by measurements.
- Layout: centered editorial regions; measured reference 1200px at 1440. Studio maximum may use 1320px where specified; visual QA must rank the discrepancy. Header 89px. Thin straight borders, restrained small button radius, no decorative rainbow accents.
- Surface layers: black hero, translucent dark panel, charcoal gradient page, outlined neutral cards, near-black image field. Reference imagery/texture is evidence only.
- Motion: restrained reveals with reduced-motion fallback per blueprint. Reference timing not yet measured. No fake 3D controls.
- Focus: 2px #b4fdb1 outline with offset; retain native semantics and visible keyboard focus.

## Component contracts

| Component | Input / responsibility | Phase |
| --- | --- | --- |
| Header / MobileNav | Route links; current page; scroll treatment; dialog focus trap, Escape, scroll lock | 2 |
| Container / Button / SectionHeading / Reveal | Token-based reusable foundations; reduced motion | 2 |
| Hero | Original copy, labeled original illustrative PCB; no proprietary assets | 2 |
| Intro / Engineering / Toolchain / Workflow / ContactCTA | Ordered editorial sections and truthful content | 2 |
| Footer | Navigation, privacy, provisional brand and launch status | 2 |
| BoardCard / BoardGrid | Typed summary; image alt, category, status, full accessible link | 3 |
| BoardFilters / EmptyState | URL-backed search/category/status; clear; live count | 3 |
| BoardGallery / Specs | Only available images/media types; no unverified spec chips | 4 |
| FeatureTabs | Arrow/Home/End keyboard support, linked tab/panel ARIA | 4 |
| BomTable / Stackup / Files | Conditional verified content only; sort, overflow, real file paths | 4 |
| Optional ModelViewer | Only valid supplied original GLB; on-demand loading and fallback | 5 |

## Content constraints

HARDWARE LAB is provisional. All three seed projects remain illustrative; in-progress status is supplied for the STM32 seed, not a verified product claim. Do not invent revisions, certifications, measured performance, board photos, released files, email/domain or customers. Publish only assets with confirmed rights.
