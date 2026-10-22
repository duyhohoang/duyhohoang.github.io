# Cloudflare Pages deployment

Prepared for static Git integration; no public deployment has been created. Publish only `out/`, never project sources or reference evidence as the output folder. No Worker adapter, Pages Functions, API or runtime Node server is needed.

## Build settings

| Setting | Value |
|---|---|
| Platform | Cloudflare Pages, Git integration |
| Framework preset | Next.js (Static HTML Export) |
| Production branch | main |
| Root directory | repository root |
| Build command | pnpm build |
| Output directory | out |
| NODE_VERSION | 24.19.0 |
| PNPM_VERSION | 11.25.0 |
| NEXT_PUBLIC_CONTACT_EMAIL | hoangduy2206.ute@gmail.com |
| NEXT_PUBLIC_SITE_URL | actual HTTPS production origin |

Cloudflare build image v3 allows version overrides; it does not infer pnpm version from the lockfile or Node version from package.json engines. `.node-version` pins Node; set PNPM_VERSION explicitly. Dependencies and pnpm are pinned, and `pnpm-lock.yaml` is included. Use `pnpm install --frozen-lockfile` to reproduce locally. The build uses Webpack and the existing Windows export alias repair, preserving Linux compatibility.

## Push to GitHub

Create an empty repository in your GitHub account, then run these commands from this project folder, substituting your actual repository URL. The current folder has not been initialized as a Git repository.

```sh
git init -b main
git add .
git status
# Review staged files; .env files, dependencies and build outputs are ignored.
git commit -m "Prepare Hardware Lab static portfolio"
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

The email is intentionally public. Never stage credentials, tokens or private environment files. Review project image publication rights before public release.

## Connect and deploy

1. In Cloudflare, open Workers & Pages, create a **Pages** project and connect GitHub.
2. Authorize access to the intended repository and select it.
3. Apply the settings above. Select `main` as production branch and save/deploy.
4. Cloudflare assigns a free `https://PROJECT.pages.dev` address. Set NEXT_PUBLIC_SITE_URL to that actual origin and rebuild/redeploy so canonical, Open Graph, robots and sitemap URLs use it. A first build without a configured origin intentionally remains noindex.
5. Open the deployed URL; verify images/fonts, internal deep links, mobile menu, project expansion, FAQ, career tabs, email draft and 404 page. Confirm response headers from `public/_headers` on the actual host. Local preview does not emulate every Cloudflare header.
6. Later use the project's **Custom domains** flow to add a domain you control, follow DNS instructions, set NEXT_PUBLIC_SITE_URL to its HTTPS origin, and rebuild.
7. Subsequent pushes to `main` trigger production deployments. Other branches can create preview deployments; keep previews noindex by omitting NEXT_PUBLIC_SITE_URL in preview environment settings.

No Cloudflare/GitHub account connection or deployment credentials are included. Actual domain assignment, DNS and hosted checks require the owner’s accounts.

## Validate before pushing

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
pnpm check:export
pnpm preview
```

In another terminal, with Edge installed:

```sh
node scripts/test-animations.mjs http://127.0.0.1:3001
node scripts/review-fidelity.mjs --reuse-server
node scripts/test-phase4.mjs
```

## Official references

- [Cloudflare static Next.js Pages guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Build image and version overrides](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

Contact composition opens an email application, not a delivery service. No email transmission is claimed by local or deployment tests.
