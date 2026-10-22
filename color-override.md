# COLOR SYSTEM OVERRIDE — MANDATORY

Reference: https://openhardware.antmicro.com/

The studio website MUST reproduce the reference site's actual color system as closely as technically possible. This requirement supersedes all previously proposed palette values (including #10151B, #1E2933, and #62D7B1). Do not treat concept illustrations as color references.

## Required reference audit
1. Open the live reference in a browser capable of inspecting computed CSS styles at desktop and mobile widths.
2. Record exact computed foreground, background, border, fill, and SVG colors for: body, header, hero, section backgrounds, titles, paragraphs, links, buttons, cards, dividers, footer, inputs, hover, focus, active, and disabled states.
3. Capture screenshots and a machine-readable `docs/reference-colors.json` with values in HEX/RGBA and CSS selector/source evidence. Account for gradients, overlays, opacity and images separately.
4. Map the verified colors to semantic CSS custom properties in `src/styles/tokens.css`. Do not introduce a new palette or recolor to suit the new studio branding.
5. Verify against live screenshots at 1440px, 768px and 390px widths, including interaction states. Document remaining mismatches.
6. If browser inspection is blocked, mark tokens `UNVERIFIED`, request reference screenshots or CSS, and do not invent precise values.

## Acceptance criteria
- No mint/dark-tech proposal tokens remain unless independently verified in the reference.
- All site sections and interactive components use audited reference colors.
- Brand names, logos, original illustrations and proprietary imagery are replaced with studio-owned assets; visual color fidelity does not grant reuse rights to these assets.
