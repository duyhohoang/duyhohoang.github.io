# Phase 3 — animation and interaction report

22 October 2026. The existing PCB Design, Embedded Systems and IoT content, image assets, reference colors, card dimensions and component hierarchy were retained.

## Implemented

- Coordinated navbar, availability badge, heading, copy, highlights, CTA, portrait and social-icon entrance. The portrait follows the CTA; the About quote follows its checklist.
- Once-only viewport reveals for section headings, technology/tool labels, statistics cards, principles, case studies, scope indicators, projects, services, About, capabilities, timeline, engagement cards, FAQ and contact fields.
- 4px card hover lift, restrained surface/border emphasis, image zoom inside the original thumbnail frame, project arrow movement, title color and social hover feedback.
- Smooth intrinsic-height project expansion/collapse, staggered additional cards, accurate three-study label and closed-region inert/aria semantics.
- 200ms FAQ height transitions, animated chevrons, native details/summary fallback, keyboard operation, aria-controls/expanded and safe rapid toggling.
- Career panel fade-out/switch/fade-in with a short height interpolation, labeled tabs/panel, roving tab stops and Arrow/Home/End keyboard control.
- Active-section navigation, underline transitions, native smooth anchors/history, animated modal menu, focus trap, Escape/backdrop close, focus restoration without scroll jumps and automatic close at desktop width.
- Input focus transitions and button press/focus feedback. Contact remains an honest demo; no delivery/loading success is simulated.
- An 800ms count-up for the existing “6 channels” concept scope. Existing PCB, STM32/ESP32 and CAN/RS485 labels remain literal strings. No metrics or achievements were added.
- Live reduced-motion support cancels reveal movement and disables smooth scrolling while preserving controls. Essential server-rendered content remains visible without JavaScript.

## Technology and performance

Retained the installed Motion package as the sole animation library, using its small DOM/mini entry point. The brief explicitly permits retaining existing Motion rather than introducing a conflicting GSAP system. No GSAP, ScrollTrigger or Lenis dependency was added; native scrolling already matched the observed behavior.

Viewport work uses native IntersectionObserver; a scoped MutationObserver registers newly inserted content. Transient animation cleanup restores prior inline styles, preserving the portrait's existing CSS transforms and allowing CSS hover effects after reveals. Observers, animation controls, event listeners and the counter's animation frame are cleaned up on hide/unmount. will-change exists only during active animation.

Most animation changes opacity and individual CSS translate/scale. Intrinsic grid height, FAQ height and career height animate only during short requested disclosures. There is no continuous animation loop; the counter stops after 800ms. Active navigation uses a passive scroll listener coalesced with requestAnimationFrame.

## Files modified / added

Application:
- src/app/reference.css
- src/components/Header.tsx
- src/components/PortfolioHome.tsx
- src/components/animation/AnimatedRegion.tsx
- src/components/animation/AnimatedFAQ.tsx
- src/components/animation/AnimatedCounter.tsx
- src/hooks/usePortfolioMotion.ts
- src/hooks/useReducedMotion.ts
- src/hooks/useAnimatedPanel.ts
- src/hooks/useActiveSection.ts
- src/lib/animations.ts

Validation/documentation:
- scripts/observe-reference-motion.mjs
- scripts/test-animations.mjs
- scripts/review-fidelity.mjs
- docs/ANIMATION-INVENTORY.md
- docs/PHASE3-MOTION-REPORT.md
- docs/animation-reference/observations.json and private source captures
- docs/animation-dev/ and docs/animation-production/
- docs/fidelity-animation/ (twelve new resting-state captures plus desktop/mobile full-page evidence)
- docs/export-check.json and generated export metadata

No package/dependency changes or unrelated route rewrites.

## Validation

The development and production browser runs cover 1440, 1280, 1024, 768 and 390px. They check active reveals, computed hover lift, intermediate disclosure heights, rapid FAQ toggles, keyboard tabs, form focus/demo submission, mobile focus trap/Escape/anchor/history/resize, reduced motion and live preference changes.

Repeated client navigation away and back verifies observer cleanup with zero detached targets and stable active-observer counts. Production additionally checks JavaScript-disabled hero visibility and native FAQ operation.

At 1479×952, the tested resting rectangles (wordmark, lead, hero heading, circle, portrait window and project image) match the saved Phase 2 baseline with zero measured change. The twelve reference-size captures were repeated; no missing asset responses or horizontal overflow were found.

Commands:
- pnpm lint
- pnpm build
- pnpm check:export
- node scripts/test-animations.mjs http://127.0.0.1:3000
- node scripts/test-animations.mjs http://127.0.0.1:3001
- node scripts/review-fidelity.mjs --reuse-server

Machine-readable evidence: docs/animation-production/results.json and docs/fidelity-animation/validation.json.

## Verified source behavior and remaining differences

The live source was inspected in a browser before implementation. Its sampled fade-up transitions are 700ms, FAQ expansion is 200ms, and CSS uses native smooth scrolling. Full observation details and uncertainties are in docs/ANIMATION-INVENTORY.md.

The hero choreography, detailed stagger ordering, project height treatment and career panel crossfade are brief-driven additions, not claimed identical to the source. Travel is deliberately restrained to 12–28px rather than the source's sampled 100px. Reveals play once per route appearance. Source continuous background/pulse/bounce effects were omitted to follow the brief's restraint and reduced-motion requirements.

The existing fictional portrait, illustrative board renders and content-dependent text wrapping remain unchanged from Phase 2. This phase does not claim pixel-perfect animation equivalence.

Sources: https://www.wilsonkinyua.com/ ; https://motion.dev/docs/animate ; https://motion.dev/docs/inview

Local production preview: http://127.0.0.1:3001
