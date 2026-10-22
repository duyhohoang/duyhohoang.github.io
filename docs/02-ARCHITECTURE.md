# Architecture & Engineering Plan

## Stack
Next.js App Router + TypeScript (strict), Tailwind CSS, Framer Motion / Motion for React for targeted animations, MDX or typed JSON project content, Zod for schema validation. Three.js / React Three Fiber only in a lazy-loaded, optional phase when actual optimized GLB models exist. No database required in MVP.

## Why
Static content reduces cost and attack surface; server rendering/static generation improves SEO; content is versioned in Git; a typed schema makes future CMS migration possible.

## Suggested directory tree
```
src/
  app/
    layout.tsx page.tsx globals.css not-found.tsx
    boards/page.tsx boards/[slug]/page.tsx
    capabilities/page.tsx workflow/page.tsx about/page.tsx
    contact/page.tsx privacy/page.tsx
    sitemap.ts robots.ts
  components/
    layout/{Header,Footer,MobileNav}.tsx
    home/{Hero,Intro,FeaturedBoards,Engineering,Toolchain,Workflow,ContactCTA}.tsx
    boards/{BoardCard,BoardGrid,BoardFilters,BoardGallery,Specs,FeatureTabs,BomTable,Stackup}.tsx
    ui/{Button,Container,SectionHeading,Reveal,EmptyState}.tsx
  content/boards/*.mdx
  data/{site,projects}.ts
  lib/{projects,metadata,schemas,utils}.ts
  styles/tokens.css
public/assets/{boards,studio,icons}/
tests/{unit,e2e}/
```

## Rendering and data
Static generate board detail routes with `generateStaticParams`. Derive catalog from a validated server-side content collection. Search/filter can be client-side for <=100 projects. `generateMetadata` for each route. Keep data and display logic separate.

## Component boundaries
`BoardCard` accepts a typed `BoardSummary`; `BoardGallery` accepts image metadata; `FeatureTabs` composes optional sections; `BomTable` accepts validated component rows. Avoid page-specific duplicated UI. Use design tokens, no hardcoded repeated colors.

## 3D strategy
MVP uses original PNG/WebP render images. Phase 5 optional GLB viewer, lazy load only on click, show static poster until model loaded, cap model sizes, camera orbit limits, reset control, WebGL fallback. Never claim a STEP file can be directly rendered by browser without conversion.

## Contact integration
MVP can use a clearly labeled mailto link. Production form requires configured server-side provider/API, environment secrets, rate limiting, honeypot/CAPTCHA as appropriate, and privacy disclosure. Never embed secret keys in client code.

## Deployment
Default: static export if all features remain compatible (`output: 'export'`), deploy generated `out/` to Cloudflare Pages static hosting. If server actions/API routes or dynamic features are added, use a compatible Cloudflare Workers/Next.js adapter and verify current deployment instructions. Do not assume static export supports server actions.

## Quality gates
ESLint, TypeScript strict, production build, unit tests for schemas/filters, Playwright smoke tests, Lighthouse mobile/desktop, broken link check, image alt check, keyboard nav, 320px overflow test. Aim LCP <2.5s and CLS <0.1 under representative test conditions; record actual metrics.

## Security
Validate all content and external links; rel=noopener noreferrer for target=_blank; Content Security Policy appropriate to fonts/images/scripts; never expose unpublished schematics or private client IP. Project publication is opt-in per asset.
