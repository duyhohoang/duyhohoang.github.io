KiCanvas official bundled distribution, downloaded 2026-10-25.
Source: https://kicanvas.org/kicanvas/kicanvas.js
Upstream: https://github.com/theacodes/kicanvas
Original SHA256: ca910f25276c3efb9aacb3a5d6341d4d9af4736d4c875fb0440d2cc856865ab7

UI-only bundle changes: local Fonts CSS URL; defer SVG icon sprite href assignment until after the element is created to prevent template-placeholder 404 requests. Reproduce with scripts/prepare-kicanvas.mjs (pinned hash checked). KiCad 10 compatibility: track parsers accept plural layers and solder_mask_margin; native trace painters use the declared copper/mask layers and mask expansion without changing original geometry. Material Symbols font downloaded from the official Google Fonts stylesheet and served locally; the site supplies the text font.

Keep LICENSE.md and Material-Symbols-LICENSE.txt with distributions.
See docs/PCB-VIEWER.md for the source-verified, version-pinned React adapter and its API limitations.
