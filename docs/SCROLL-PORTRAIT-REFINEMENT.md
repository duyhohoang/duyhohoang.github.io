# Portrait and scroll refinements

## Changes

- Hero: a display clip follows the inner lower half of the existing pink circle, removing the projecting sleeve edges without modifying the source photograph, ring dimensions or head position. Geometry is measured on resize only, using ResizeObserver; no per-scroll layout reads.
- About: a separate owner-supplied thumbs-up photograph was processed to a transparent monochrome cutout with built-in image_gen. Source PNG: public/assets/portraits/hoang-duy-about.png. Optimized website image: public/assets/portraits/hoang-duy-about.webp. The hero remains public/assets/portraits/hoang-duy.webp.
- Scroll: one shared IntersectionObserver controls CSS opacity/translate transitions on groups. Nested parent/child scroll reveals were removed. Groups below the viewport hide again when scrolling up, then reveal again on re-entry. Content above the viewport stays visible. No per-frame React updates or scroll handler was added. Reduced motion/no-JS content remains visible; focus reveals groups for keyboard access. Removed career nodes are unobserved, and all attributes/listeners are cleared on teardown.
- Hover: each of the three engineering scope cards now gets a bright red-pink border and inset outline without resizing.

Files: src/hooks/usePortraitClip.ts (new), src/hooks/usePortfolioMotion.ts, src/components/PortfolioHome.tsx, src/data/portfolio-media.ts, src/app/reference.css, two About portrait assets, scripts/check-scroll-refinement.mjs (new), scripts/check-personalization.mjs and scripts/test-animations.mjs.

## Built-in imagegen final prompt

Edit this supplied photograph for a portfolio About Me portrait. Preserve the exact person's identity, facial features, smile, hair, gray polo shirt, thumbs-up hand gesture and body proportions. Remove only the studio background to true transparent alpha, and convert the person to natural polished black-and-white photography with soft contrast. Do not redesign the face, change expression, clothing or pose. Centered head-to-lower-torso composition, entire thumbs-up hand visible, modest transparent margin above hair and at sides, portrait 1024x1536. No backdrop, circle, text or added objects. The site uses a dark #111 background; clean silhouette and hair edges without gray halo. Use case identity-preserve and background extraction.

Validation evidence: docs/scroll-refinement/ and docs/personalization/. Browser performance remains device-dependent; this change removes redundant scroll animation work, rather than claiming a universal frame-rate improvement.

## Verified production checks

pnpm lint and pnpm build passed. Static export verification passed for 26 pages, 1,069 internal references and 42 images. Dedicated Edge checks passed for lower-arm clip, repeated reveal, hide after upward scrolling, no nested card reveals, reduced-motion visibility, no overflow at 375px and bright border on all three scope cards. Screenshots hero.png, about.png, portrait-mobile.png and stat-hover.png were visually inspected for the requested framing and pose. Full interaction regression results are recorded in docs/animation-scroll-refinement/.
