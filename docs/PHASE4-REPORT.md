# Phase 4 implementation and validation

## Changes

The existing layout, sections, hardware content, palette and component architecture are preserved. The actual Phase 3 implementation uses Motion mini and native scrolling, not GSAP/Lenis. No additional runtime dependency was added. The existing coordinated hero entrance, shared reveal observer, keyboard navigation, accordion, tabs and disclosure behavior were retained. Completed reveal cleanup callbacks now leave the active Set immediately, rather than retaining their elements until route teardown. Cancellation still restores original styles; repeated client navigation is tested for detached observers.

A reusable CircuitBackground renders deterministic SVG routes, pads, a subtle grid and three slow signal paths. Decorative layers do not take layout space or pointer input. IntersectionObserver, visibilitychange and media-query listeners control animation playback without frame-driven React state. Traces become sparse on tablets; signals are disabled on mobile and reduced motion. Initial SSR/no-JS decoration is static. No WebGL, canvas, blur filters or pointer tracking were added.

The owner-provided public email is hoangduy2206.ute@gmail.com. Contact fields and their layout remain. A direct Send Email action was added beside the existing social links. Valid form submission composes an encoded mailto with name/email/phone/message and subject; it does not contact any delivery API or report delivery. Form values stay in the visitor's browser until their mail application handles the draft. Explicitly empty/invalid configuration disables composition and shows a warning. No-JS visitors can use Send Email; the form submit stays disabled to prevent accidental GET submission.

Measured large PNG payloads prompted four WebP derivatives (quality 90, full alpha, same intrinsic dimensions). Originals remain as replaceable sources. Combined bytes: 9,340,118 PNG to 1,034,360 WebP, approximately 89% smaller. Project thumbnails below the hero now load lazily. Portrait/image containers and object-fit remain unchanged. Fixed a prohibited generic-span aria-label on the counter and marked the decorative social glyph hidden from accessibility naming.

## Files changed

- src/components/PortfolioHome.tsx: integration, contact extraction, lazy project loading, decorative social glyph.
- src/components/ContactForm.tsx (new): direct email and form composition.
- src/components/backgrounds/CircuitBackground.tsx (new): reusable lightweight SVG.
- src/components/animation/AnimatedCounter.tsx: valid accessible role.
- src/hooks/usePortfolioMotion.ts and src/lib/animations.ts: release completed reveal callbacks.
- src/lib/contact.ts and src/data/contact.ts (new): safe composition and public configuration.
- src/data/site.ts, src/data/portfolio-media.ts: centralized email and optimized image paths.
- src/app/reference.css: background layers and compact email action only.
- src/app/contact/page.tsx and src/app/privacy/page.tsx: accurate contact behavior.
- public/assets/portraits/engineer-placeholder.webp; public/assets/projects/{iot-controller,io-platform,fan-controller}.webp (new).
- package.json, .node-version (new), .env.example, .gitignore: reproducible public build configuration.
- README.md, DEPLOY.md: local workflow and Cloudflare Pages Git integration.
- scripts/serve-export.mjs: correct WebP MIME type.
- scripts/review-fidelity.mjs, scripts/test-animations.mjs: email tests, six widths and separate evidence output.
- scripts/test-phase4.mjs and tests/unit/contact.test.ts (new): email encoding and background behavior.
- docs/fidelity-phase4, docs/animation-phase4, docs/phase4 and docs/export-check.json: generated verification evidence.

next.config.ts was already compatible with static export and was preserved. No API routes, server actions, Workers adapter or credentials were added.

## Validation

- pnpm install --frozen-lockfile --offline: passed with the pinned lockfile.
- pnpm lint: passed after final source edits.
- pnpm test: all 11 tests passed, including Unicode/punctuation round-trip, required fields, missing configuration and header-injection safety.
- pnpm build: passed; all routes prerendered; out/ generated. Existing postbuild created 23 Windows segment aliases.
- pnpm check:export: passed, 26 HTML pages, 1,069 internal references and 42 images.
- Production Edge tests: passed at 1440, 1280, 1024, 768, 390 and 375px. No horizontal overflow, runtime/hydration errors or missing responses.
- Project expansion/collapse, native smooth anchors, mobile focus trap/Escape/history/resize, FAQ keyboard/rapid toggle, career tabs/arrow keys, button hover/focus, finite counter, reduced-motion/live preference, no-JS content and repeated client navigation passed.
- Direct email recipient and encoded subject/body verified by intercepting anchor navigation; no email was sent. Required input validation retained.
- Background playback enabled only when visible; offscreen, mobile and reduced-motion pause passed. Document-hidden handling tested using a controlled visibilitychange event, not a claim of OS background throttling.
- Bounded 120-frame headless sample with contact background running: mean 16.67ms, max 17.2ms, no samples over 34ms. This is a local idle sample, not a complete scroll/CPU benchmark.
- Twelve production screenshots at the exact twelve reference dimensions were visually reviewed and saved in docs/fidelity-phase4. A contact sheet is docs/phase4/comparison-sheet.png. Across 384 x/y/width/height measurements of eight reference elements per capture, no differences over 0.1px from Phase 3 were found. Portrait, project images, type wrapping and card frames remain; intentional visual additions are subtle routing and the compact email action.

### Lighthouse

Local static production preview, Lighthouse 13.5.0 with Edge. JSON reports include full environment and audit findings. Scores are lab observations, not guarantees. Initial Phase 4 reports were captured before image optimization (not a controlled Phase 3 comparison); final measurements ran after browser interaction tests finished.

| Run | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Desktop before image optimization | 75 | 92 | 100 | 69 | 5.54s | 73ms | 0.013 |
| Mobile before image optimization | 34 | 92 | 100 | 69 | 33.69s | 1493ms | 0.000 |
| Desktop final | 95 | 95 | 100 | 69 | 1.48s | 26ms | 0.013 |
| Mobile final | 66 | 95 | 100 | 69 | 6.91s | 53ms | 0.000 |

Preview SEO remains 69 because no production origin is configured and indexing is deliberately blocked. Accessibility findings remaining are inherited pink-on-dark contrast and heading order; exact failing elements remain in the JSON reports. No delivery or public deployment has been verified.

## Remaining limitations

- No public deployment, GitHub repository or DNS connection was created. The local folder is not yet a Git repository. DEPLOY.md contains the exact owner-account steps.
- No production origin is supplied. Preview remains noindex, robots disallow and localhost canonicals/sitemap. Set NEXT_PUBLIC_SITE_URL to the actual Pages/custom-domain HTTPS origin and rebuild for launch; this affects the local Lighthouse SEO score.
- An installed/default email handler is needed. Tests intercept the mailto navigation to inspect the draft and never transmit email. A website cannot verify delivery from mailto.
- The fictional portrait and illustrative hardware renders remain explicitly labelled. They do not establish the owner's identity or verified electrical/manufacturing results.
- Some inherited pink-on-dark contrast and heading-order findings remain because this phase preserves reference typography and colors. Lighthouse reports retain the exact nodes. Hosted headers and domain behavior need verification after an actual Cloudflare deployment.
- Final mobile Lighthouse performance is 66 (LCP 6.91s under simulated mobile throttling), improved from the initial 34 but still a loading-performance limitation. Desktop is 95. Neither the idle frame sample nor local lab measurements guarantees performance on every device; Cloudflare/CDN delivery was not benchmarked.
