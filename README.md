# Hardware Lab portfolio

Existing black-and-pink portfolio for PCB Design, Embedded Systems and IoT. Next.js App Router, React, TypeScript and Motion. Self-hosted fonts and local imagery; no backend, API, database, server actions or runtime Node server.

## Local development

Use Node **24.19.0** (`.node-version`) and **pnpm 11.25.0** (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Development: http://127.0.0.1:3000. For production:

```sh
pnpm lint
pnpm test
pnpm build
pnpm check:export
pnpm preview
```

Static preview: http://127.0.0.1:3001. Deploy only `out/`. `next.config.ts` already preserves export, trailing slashes, unoptimized local images and disabled framework header. The postbuild helper preserves Windows-generated Next segment payload aliases; it is harmless on Linux.

## Public configuration

Copy `.env.example` to `.env.local` if overriding defaults. `src/data/contact.ts` contains the owner-provided public email, `hoangduy2206.ute@gmail.com`. `NEXT_PUBLIC_CONTACT_EMAIL` overrides it; an explicitly empty value disables composition and shows a configuration warning. Public variables are embedded at build time and must never contain secrets.

The contact form validates fields and composes a safely encoded `mailto:` draft. Visitors finish sending in their own email app. No delivery is performed or reported by this website. A direct **Send Email** link works without JavaScript; form submission is disabled until hydration to avoid leaking form fields into a GET URL.

Set `NEXT_PUBLIC_SITE_URL` to your real HTTPS Pages origin or custom domain and rebuild before enabling search indexing. Without it, the local preview intentionally emits noindex/disallow and localhost canonical/sitemap URLs.

## Cloudflare Pages

See [DEPLOY.md](DEPLOY.md) for GitHub connection, build settings, free Pages address, custom domain and automatic deploys. Use the **Next.js (Static HTML Export)** preset, `pnpm build`, output `out`, production branch `main`. This is prepared locally, not publicly deployed.

## Implementation and validation

- `src/components/PortfolioHome.tsx`: existing homepage sections and content.
- `src/components/backgrounds/CircuitBackground.tsx`: SVG decoration; visibility-aware CSS pulses, static on mobile/reduced motion.
- `src/hooks/usePortfolioMotion.ts`: one shared reveal observer and finite animations, with lifecycle cleanup.
- `src/components/ContactForm.tsx`, `src/lib/contact.ts`: validated email draft composition.
- `src/data/portfolio-media.ts`: replaceable local portrait and hardware media.
- `scripts/review-fidelity.mjs`: twelve reference-sized production screenshots.
- `scripts/test-animations.mjs`: production interactions, motion, six viewport widths, navigation cleanup and no-JS checks.
- `docs/PHASE4-REPORT.md`: validation evidence and remaining limitations.

Project studies remain illustrative, with validation status identified. No employment, education, manufacturing results or client metrics have been invented.
