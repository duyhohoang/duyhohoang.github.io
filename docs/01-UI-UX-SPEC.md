# UI/UX Specification — v1.0

## Experience goals
- Premium engineering-studio visual identity; English-only UI.
- High fidelity to reference *layout concepts and interaction patterns*, not its proprietary assets, logos, text or source code.
- Desktop-first editorial sections; polished tablet/mobile adaptation.
- Visual hierarchy: oversized display headings, technical eyebrow labels, generous negative space, highly legible board imagery, precise tables.

## Reference inventory (observed from indexed pages)
Home: hero; growing library introduction; Boards and Components; Open Hardware / BOM / Schematics / Stackup; Tools (KiCad and Blender); Automation; Contact.
Boards: featured boards, count and board catalog, searchable results.
Board detail: description, board assets, render/photo switching, features, components table, stackup, optional block diagram and mechanical info.

## Proposed navigation
Header: logo / Boards / Capabilities / Workflow / About / Contact. Primary CTA: Explore Boards.
Routes: `/`, `/boards`, `/boards/[slug]`, `/capabilities`, `/workflow`, `/about`, `/contact`, `/privacy`, `/404`.

## Home sections (ordered)
1. Sticky minimal header; translucent-on-scroll optional.
2. Hero: eyebrow `INDEPENDENT HARDWARE ENGINEERING STUDIO`, large 3-line title `HARDWARE. DESIGNED. ENGINEERED.`, short supporting text, Explore Boards CTA, large original PCB render.
3. Intro: `A growing collection of engineered systems` with two feature tiles: Boards / Building Blocks.
4. Selected Work: 3 featured board cards with large renders and spec tags.
5. Engineering Transparency: three editorial sections for BOM, schematics and PCB stackup. Do not claim downloadable open-source files unless actually supplied.
6. Capabilities: schematic capture, multilayer PCB layout, embedded firmware integration, design-for-manufacture.
7. Toolchain: KiCad, Altium Designer, Blender, version-controlled documentation; no unsupported certifications.
8. Workflow: requirements -> architecture -> schematic -> layout -> verification -> fabrication handoff.
9. Contact CTA + footer.

## Catalog
- Desktop responsive 3-column grid, tablet 2, mobile 1.
- Search by project title/description; filter category and status; clear filters; result count; zero state.
- Featured projects visually distinguished; image cards with keyboard-accessible links.
- Search/filter state in URL query parameters when practical.

## Project detail
- Breadcrumb, project title, status badge (Concept / In Progress / Prototype / Validated), summary.
- Image gallery: render/photo tabs only when both media types exist; fallback if missing.
- Key Specs chips: MCU, interfaces, input voltage, PCB layers where verified.
- Tabbed sections: Overview, Features, Components, Stackup, Files; optional Block Diagram.
- BOM table columns: Designator, Quantity, Manufacturer, MPN, Description; sorting and mobile overflow.
- Stackup: visual layer diagram with thickness/material values only if verified.
- Downloads: only files present in project assets; no fake links.
- Related projects + contact CTA.

## Tokens (provisional; adjust against reference screenshots)
Colors: background `#10151B`, surface `#1E2933`, elevated `#25313D`, text `#F6F8FA`, muted `#AAB7C3`, accent `#62D7B1`, border `#34414D`, error `#F87171`.
Typography: Space Grotesk for display, Inter for body, JetBrains Mono for metadata (self-host or approved font provider).
Layout: max width 1320px, desktop side padding 48px, tablet 32px, mobile 20px; 12-column desktop grid; 8px spacing base.
Display type: clamp(3rem, 7vw, 7.5rem); section title clamp(2rem, 4vw, 4.5rem); body 16–18px; line-height 1.5–1.65.
Breakpoints: 640 / 768 / 1024 / 1280px; verify against screenshots.

## Interaction
- Header changes treatment on scroll; mobile drawer with focus trap, Escape dismissal, no background scroll.
- Intersection-triggered reveals (opacity and translateY 16–24px, 450–700ms) with reduced-motion fallback.
- Hover on cards: subtle lift, border/accent transition, no aggressive scaling.
- Tabs keyboard operable (arrow keys, Home/End), active panel linked by ARIA.
- No auto-rotating carousels; any galleries provide manual controls.
- Contact form has validation, anti-spam and clear success/error states; do not simulate sending.

## Accessibility and responsiveness
WCAG 2.2 AA target; semantic headings; visible focus; keyboard-only navigation; descriptive image alt; contrast >=4.5:1 normal text; 44px preferred touch targets; respect `prefers-reduced-motion`; no horizontal page overflow at 320px width.

## Visual fidelity protocol
Capture reference and implementation at 1440x900, 1024x768, 390x844 and 375x812; compare section ordering, proportions, typography, spacing, grid, image placement, hover and mobile nav. Record differences in `VISUAL-AUDIT.md`; fix top 10 by impact. Never copy protected imagery or logos.
