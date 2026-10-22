# Portfolio deployment

## GitHub Pages: selected production address

Target: **https://duyhohoang.github.io/**. The publishing repository must be named exactly `duyhohoang.github.io` on account `duyhohoang`. The root domain means existing root-relative fonts, images and navigation need no basePath changes.

The workflow `.github/workflows/pages.yml` installs the pinned Node/pnpm versions, runs lint/tests/build/export checks, uploads only `out/`, then deploys through GitHub Pages. It sets NEXT_PUBLIC_SITE_URL to the selected HTTPS origin at build time, enabling correct canonical/Open Graph/robots/sitemap URLs. No personal access token belongs in workflow files; deployment uses the repository GITHUB_TOKEN and OIDC permissions. Jobs are restricted to the exact publishing repository so they do not accidentally publish a project site from the original Cloudflare repository.

Repository setup: use a Public repository for GitHub Free, and select **Settings → Pages → Build and deployment → Source: GitHub Actions**. Push main to trigger publishing; subsequent main pushes automatically update the site. Actions → Deploy portfolio to GitHub Pages shows progress and the deployment URL.

Local production verification:

```powershell
$env:NEXT_PUBLIC_SITE_URL='https://duyhohoang.github.io'
pnpm build
pnpm check:export
```

The original `hoangduyportfolio` repository and Cloudflare configuration can remain as a backup. GitHub Pages does not apply Cloudflare's `_headers` file; hosted headers are controlled by GitHub. No server or email backend is added. The form still opens an email draft.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

---

# Alternative Cloudflare deployment

Prepared for static Git integration; no public deployment has been created. Publish only `out/`, never project sources or reference evidence as the output folder. No Worker adapter, Pages Functions, API or runtime Node server is needed.

## Existing Workers project: deploy static assets

For the existing Cloudflare Worker named `hoangduyportfolio`, the repository now includes `wrangler.jsonc`. It explicitly deploys only `out/`, with directory-index HTML handling and the exported 404 page. There is no Worker script, OpenNext adapter or runtime Next.js server.

In **Settings → Build**, use:

| Setting | Value |
|---|---|
| Build command | pnpm build |
| Deploy command | npx wrangler@4.151.3 deploy |
| Root directory | repository root |
| Production branch | main |

Disable preview builds until needed; do not use `npx wrangler preview`. If preview versions are later configured, use the documented `wrangler versions upload` workflow.

A plain `wrangler deploy` without configuration previously detected Next.js, chose `.next`, and attempted an OpenNext migration. That led to the ignored `workerd` install script failure. The explicit assets-only configuration avoids this migration entirely; do not add OpenNext or change pnpm's project build-script permissions to work around that unrelated failure. Keep the committed lockfile unchanged.

Push the configuration, then deploy the latest main commit (retrying an old commit will not include it). Confirm the build log reads assets from `out` and does not run `@opennextjs/cloudflare migrate`. The assigned public URL must be read from Cloudflare; it is not known locally. Set NEXT_PUBLIC_SITE_URL to that actual origin and rebuild before search indexing.

Official references: [static-site routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/) and [Workers Builds commands](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Pages build settings

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

Create an empty repository in your GitHub account, then run these commands from this project folder, substituting your actual repository URL. This project is already initialized and pushed to https://github.com/duyhohoang/hoangduyportfolio; these commands are only for setting up a fresh copy.

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

## Static Workers configuration verification (2026-10-22)

The exported site passed verification for 26 HTML pages, 1,069 internal references and 42 images. Parsed wrangler.jsonc and verified the assets directory, absence of a Worker script and required index/404/deep-link HTML files. The application and lockfile were unchanged. A Wrangler 4.151.3 dry-run was attempted in an isolated pnpm dlx environment but failed before configuration processing because miniflare could not resolve undici on this Windows setup; dry-run success and hosted deployment are not claimed. The actual Cloudflare build must still be retried on the new commit.
