# Home introduction and technical skills refresh

- Hero copy, 24px heading, spacing and primary/outline actions follow the supplied introduction screenshot. Existing portrait dimensions and frame are retained.
- Social icons use the owner's GitHub and Facebook URLs, plus email. Hover and keyboard focus display a pink background and a bordered tooltip.
- Four compact domain cards replace the three large headline cards, retaining the pink/red palette.
- Six Technical Skills cards appear immediately after Experience. Content stays within the existing PCB, embedded, interfaces, power, IoT and documentation scope; unverified claims from the reference are omitted.
- Productized Services and links to its deleted anchor have been removed.

Main files changed: PortfolioHome.tsx, PortfolioSocials.tsx, TechnicalSkills.tsx, ResumeDownload.tsx, Header.tsx, Footer.tsx, reference.css, site.ts, usePortfolioMotion.ts and useActiveSection.ts.

Validation: production build, ESLint, 12 unit tests, static export (30 pages, 1,429 internal references, 66 images), intro/social/skills checks at seven viewport widths, and menu/FAQ/tabs/form/animation/reduced-motion/no-JavaScript checks passed. See screenshots and checks.json in this directory and docs/animation-production/results.json.

Build limitation: installed Next.js 16.4.0 reports a known security vulnerability and recommends upgrading. The unchanged build command succeeds on retry. Dependency upgrades were not included in this visual change.
