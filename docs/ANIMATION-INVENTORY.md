# Phase 3 animation inventory

Inspected 22 October 2026 before implementation. The twelve supplied screenshots and docs/fidelity-final captures establish resting layout, not animation. No /references directory is present.

Live source: https://www.wilsonkinyua.com/ . Browser observations and private screenshots are saved in docs/animation-reference/.

## Verified in the live browser

- Section/card fade-up transitions: sampled opacity 0→1 and translateY(100px)→0, duration 700ms, AOS attributes/classes.
- Cards declare a small upward hover translation, pink border and 300–500ms transitions. The first hover sample targeted an inner card header and showed no change, so it is not treated as evidence of the outer card's measured displacement.
- FAQ content exposes a 200ms height 0→128px ease-out opening transition in the sampled answer.
- Education switching changes the selected tab and panel. Tab visual transitions declare 700ms; a panel crossfade was not established.
- Project disclosure responds to a click. The expected “Show fewer projects” text was not observed, so the brief's label change is an implementation requirement rather than a claimed replica.
- Native html scroll-behavior:smooth. No globally exposed GSAP/Lenis instance was found; that alone does not prove bundled libraries absent.
- Availability indicator uses a pulse, and timeline markers use continuous bounce. These continuous effects are omitted to follow the brief's restrained-motion and performance requirements.

## Brief-driven / inferred additions

Coordinated hero sequence, per-heading/card staggers, portrait scale, controlled project height collapse, career panel crossfade, active-section navigation, mobile dialog entrance/exit, focus/press feedback and counter timing are not claimed identical to the live site.

## Implementation decision and plan

Motion already exists in the repository and is used by Reveal on other routes. Retain that single library, using its small DOM animation entry point and reusable React hooks. Do not introduce GSAP/ScrollTrigger alongside it. Native IntersectionObserver provides once-only viewport triggers, with explicit observer/animation cleanup for Strict Mode and route changes. Keep native smooth scrolling; no Lenis or double smoothing.

1. Central motion settings, reduced-motion subscription and homepage entrance/reveal hook.
2. Reusable height disclosure and panel transition helpers for projects, FAQ and career.
3. Active navigation, dialog transition and restrained CSS hover/focus/press treatment.
4. Browser interaction, normal/reduced-motion, no-JavaScript, layout and production checks.

Only the existing “6 channels” design-scope value is a numeric quantity suitable for counting. PCB, STM32/ESP32 and CAN/RS485 are labels/model names and will not be turned into invented statistics.
