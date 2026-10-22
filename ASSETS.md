# Asset provenance

- `public/assets/boards/*.svg`, `blocks.svg`, `social.svg`, and `src/app/icon.svg` are original procedural drawings created in this workspace by `scripts/create-assets.mjs`. Board illustrations are abstract concept studies, not photographs, verified layouts or fabrication designs. No reference logo, board image, texture, or rendering code is used in the application.
- `social.png` is rasterized from the original `social.svg`; `noise.svg` is an original procedural grayscale texture, separate from the UI palette. No reference noise image is reused.
- Lato and Roboto font files are self-hosted from Google Fonts. Their SIL Open Font License notices are included in `public/assets/fonts/`. `provider-css.txt` records font-provider URLs for provenance; it is not imported at runtime.
- `docs/reference-evidence/*.jpg` are screenshots for private comparison and audit only. They contain reference branding and imagery and are never imported or copied into `public/`. Do not include this documentation directory in a public static deployment.

Before public launch, replace the provisional studio identity and illustrative projects with owner-approved branding, content and assets.

## User-supplied software images (2026-10-16)
- public/assets/tools/kicad-pcb-editor.png: copied from user attachment kicad_pcbnew.png; KiCad editor screenshot.
- public/assets/tools/altium-designer.jpg: copied from user attachment altium-cb-690x425.jpg; Altium Designer promotional image, including its original branding.
- Used as supplied to illustrate the corresponding third-party software, per the user's explicit request. These are not original Hardware Lab board assets.

## Portfolio fidelity assets (2026-10-22)
- public/assets/portraits/engineer-placeholder.png is an AI-generated fictional model, with transparency. It is explicitly labeled as replaceable illustrative photography.
- public/assets/projects/*.png are AI-generated hardware concept illustrations, not verified schematics or real project photographs.
- Generation prompts, replacement instructions and local paths: docs/PORTFOLIO-ASSETS.md.
- Pacifico and Montserrat are locally hosted under the SIL Open Font License; notices are included in public/assets/fonts/.
