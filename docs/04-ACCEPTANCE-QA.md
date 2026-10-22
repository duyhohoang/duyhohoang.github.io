# Acceptance Criteria and QA Checklist

## Global
- [ ] All routes load and navigation works on desktop/mobile.
- [ ] No Antmicro logos, copied copy, photos, code, or trademark confusion.
- [ ] Consistent English language, brand tokens and page metadata.
- [ ] Mobile menu accessible, scroll lock, focus management.
- [ ] No console errors, broken images, broken links or placeholder `#` CTAs.
- [ ] Lighthouse scores documented with testing environment; accessibility target >=90.

## Home
- [ ] Hero hierarchy and technical imagery evoke reference composition.
- [ ] Sections appear in prescribed order, responsive and motion-safe.
- [ ] Featured cards navigate to correct details.

## Catalog
- [ ] Search and category/status filters compose correctly.
- [ ] Result count and empty state update; URL state persists when supported.
- [ ] Keyboard card navigation works.

## Detail
- [ ] All board fields validated; 404 for unknown slug.
- [ ] Gallery controls and tabs accessible.
- [ ] BOM and stackup omitted gracefully if absent.
- [ ] Download links exist and are actually downloadable.

## Production
- [ ] `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` pass.
- [ ] 1440, 1024, 390, 375, 320 widths reviewed.
- [ ] SEO: canonical, title, description, OG, sitemap, robots.
- [ ] Contact is clearly functional or clearly mailto-only.
- [ ] Privacy and third-party tracking disclosures accurate.
- [ ] Deployment tested with hard refresh on nested routes.

## Codex delivery report per stage
Include files changed, key decisions, commands run, results, screenshots (if browser available), known limitations, and exact next-stage prerequisites.
