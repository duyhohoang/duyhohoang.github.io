# Run Hardware Lab locally

Use Node.js 24 LTS and pnpm 11.25.0 (the checked lockfile). npm can run the same package scripts after `npm install`; this workspace originally has no npm executable on PATH.

```powershell
pnpm install --frozen-lockfile
pnpm run dev
```

Development URL: http://127.0.0.1:3000. Webpack is selected because the available Windows runtime failed to connect Turbopack's CSS worker.

On this machine, bundled pnpm is available without installing anything globally:

```powershell
$pnpmCommand = 'C:\Users\LAPTOP\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd'
& $pnpmCommand run dev
```

## Checks and static preview

```powershell
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run audit:colors
pnpm run build
node scripts/verify-export.mjs
node scripts/serve-export.mjs
pnpm run test:e2e
```

Static production preview: http://127.0.0.1:3001. It serves compressed files and nested routes directly, and returns the custom 404 for unknown paths. The build automatically adds compatibility aliases for Windows-exported Next.js segment payloads; do not omit the post-build step by running only `next build`. The Playwright suite uses an installed Microsoft Edge in a temporary headless testing profile. It does not use your normal browser profile. Stop either server with Ctrl+C in its terminal.

## Configuration

`src/data/site.ts` centralizes the provisional brand, contact placeholder, email, location and social links. With no email, the contact page displays **Contact email coming soon**. No fake address or sending form is present.

Optional `.env.local` values:

```text
NEXT_PUBLIC_SITE_URL=https://your-actual-approved-domain
NEXT_PUBLIC_CONTACT_EMAIL=your-actual-public-address
```

Leave both unset until finalized. These are public build-time values, never credentials. Restart development or rebuild after changes. Without a configured public site URL, metadata and robots discourage indexing.

Content: original seed specs remain in `data/example-projects.json`; validated display content lives in `src/lib/projects.ts`. Add only confirmed technical data and approved files. See `ASSETS.md`, `REFERENCE-AUDIT.md`, `VISUAL-AUDIT.md`, `PROGRESS.md`, and `DEPLOY.md` for provenance, verification and launch requirements.
