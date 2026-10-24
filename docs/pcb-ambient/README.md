# Continuous PCB ambient background

The background is mounted once in the application layout and remains fixed across Home, Boards and project details. The old per-section circuit components are no longer rendered.

## Files changed
- src/components/backgrounds/PCBAnimatedBackground.tsx: deterministic SVG routes and four nodes; hidden-tab pause without frame-driven React state.
- src/app/pcb-ambient.css: 32px grid, pink glow, signal keyframes, continuous header/footer integration, reduced motion and compact ticker styling.
- src/app/layout.tsx: mount the background once and load its styles after the reference stylesheet.
- src/components/PortfolioHome.tsx: remove Capabilities and Work With Me; remove per-section backgrounds.
- src/components/VisionMarquee.tsx: PCB DESIGN / IOT / FIRMWARE / WEARABLE TECH / AI / EMBEDDED SYSTEMS with dot separators.
- scripts/check-pcb-ambient.mjs: geometry, timing, continuity, navigation, mobile and accessibility checks.

## Verification
- Exact supplied five SVG paths, viewBox 0 0 600 260, xMidYMid slice and four nodes.
- Grid: 32px, 25s diagonal translation. Glow: 260px, 9s alternate. Pulses: 5s and 7s, second delay -2.5s.
- Motion advances without scrolling, pauses when the tab is hidden, and becomes static with reduced motion.
- Fixed background retains its viewport box at the footer and persists through client navigation.
- Seven viewport widths: 1479, 1280, 1024, 800, 768, 390 and 375; no horizontal overflow.
- Production build, lint, 12 unit tests, static export (30 pages, 1,427 internal references, 66 images) and interaction suite passed.
- Existing project images, content, portrait geometry, menu, tabs, FAQ, form and scroll reveals remain functional.

The installed Next.js version still reports a security upgrade recommendation. The build completes on retry; dependencies were not changed by this visual task.
