# Subtle animated grid background

Current revision removes all SVG circuit paths, signal pulses, vias and the pink ambient glow. Only the fixed 32px square grid remains, drifting diagonally by 32px over 40 seconds with linear, seamless repetition.

The single layout-mounted background persists from Hero to Footer and through client navigation. It pauses in hidden tabs and becomes static with reduced motion. Mobile keeps the grid at reduced opacity.

Files changed: src/components/backgrounds/PCBAnimatedBackground.tsx, src/app/pcb-ambient.css and scripts/check-pcb-ambient.mjs.

Production build, lint and browser checks passed. Seven viewport widths were checked for overflow, along with client navigation, mobile menu, tab visibility and reduced motion. Current screenshots and checks.json are in this directory.

The installed Next.js version still recommends a security upgrade. Build succeeds on retry; dependencies were not changed by this visual task.
