# Technical Case Studies

The existing static Next.js project routes are retained:

- `/projects/iot-board/`: STM32F407 pump controller.
- `/projects/esp32-devkit/`: ESP32 IoT node/gateway.

Home Case Study cards link to those routes. Home, About, Skills, Experience and Contact layouts are unchanged.

## Content and components

- `src/data/case-studies.ts`: typed metadata, galleries, factual design notes and evidence-based milestones.
- `data/example-projects.json`: existing board overview, features, stackup and native viewer paths.
- `src/components/technical/CaseStudyDocumentation.tsx`: ordered architecture, schematic, PCB, stackup, tools, decisions and status sections.
- `TechnicalGallery.tsx`: responsive, aspect-preserving images and category filters. Filters appear only for categories that have images.
- `TechnicalImageViewer.tsx`: lazy native-dialog viewer with 100–800% zoom, pointer pan, two-finger pinch, previous/next navigation, fit/reset and Escape. Keyboard: `+`, `-`, `0`, left/right arrows. Focus returns to the opening button.
- `BoardStackup.tsx`: shared real-data table, also reused by the existing Stackup tab.
- `src/app/technical-documentation.css`: styles scoped to documentation and its modal.

The existing `FeatureTabs`, `InteractiveBom`, `PCBViewer` and `KiCanvasAdapter` remain in use. PCB/BOM files and the pinned KiCanvas renderer are unchanged. Large native viewers still load when their tabs are opened and a mounted PCB instance survives tab changes.

## Assets

Existing supplied board renders:

```text
public/assets/projects/personal/
  iot-board.webp
  esp32-devkit.webp
  esp32-devkit/
    MP1.kicad_pcb
    ibom.html
    documentation/
      block-diagram.svg
```

`block-diagram.svg` is a standalone export of the existing ESP32 architecture drawing, redrawn from the owner-supplied KiCad hierarchy. It is a block diagram, not a schematic. The original PNG reference and all engineering source files are left untouched.

For new uploads, create folders only when adding real assets, for example:

```text
public/assets/projects/personal/iot-board/documentation/schematic/
public/assets/projects/personal/iot-board/documentation/pcb/
public/assets/projects/personal/esp32-devkit/documentation/schematic/
public/assets/projects/personal/esp32-devkit/documentation/pcb/
```

## Add a real image

1. Export the actual project sheet or PCB view as PNG or a self-contained SVG with a `viewBox`. Prefer readable high-resolution exports; preserve all technical content and avoid external font/image dependencies in SVGs.
2. Put the file under the project's documentation folder. Use a URL-safe filename.
3. Add a `TechnicalImage` entry to `architectureImages`, `schematicImages` or `pcbImages` in `src/data/case-studies.ts`:

```ts
{
  src: '/assets/projects/personal/iot-board/documentation/schematic/power-supply.png',
  title: 'Power supply schematic',
  alt: 'Actual power-supply schematic showing the documented controller rails',
  caption: 'Describe the actual sheet, revision and scope of the export.',
  category: 'Power Supply',
  width: 2400,
  height: 1600,
}
```

Use the image's actual pixel dimensions (or SVG viewBox dimensions). Category strings are flexible: Power Supply, Microcontroller, Communication Interfaces, Peripheral Circuits, Protection Circuits, PCB Top Layer, PCB Bottom Layer, Inner Layers, Component Placement, Copper Routing, Ground Planes and 3D PCB Render are all supported. Do not add an entry until the file exists. Images from all documentation galleries on the page can be navigated in the lightbox.

## Add verified stackup data

Populate `stackup` and `stackupDetails` in the existing board JSON. Add the verified copper layer count to its Case Study record. Do not infer thickness or materials from a render. Unavailable values are left unspecified. The STM32 stackup currently remains pending; the ESP32 stackup comes from the original MP1 KiCad file.

## Status and remaining evidence

- STM32: schematic and PCB layout completion are confirmed by the owner. Altium Designer is the stated EDA tool. Actual schematic exports, routing screenshots, native board/BOM and stackup are not yet supplied to this site.
- ESP32: original PCB, BOM, render, saved two-layer stackup and owner-supplied hierarchy are available. Circuit-level schematic exports and completion sign-off remain pending.
- Neither case study asserts completed firmware, VFD control, cloud deployment, prototype assembly or hardware validation without evidence. Existing ESP32 deployment content is identified as a deployment concept.
- No invented images or manufacturing values are used. Missing galleries show documentation-pending messages, and unavailable image URLs have a readable error state.

## Verification

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm check:export`.

Browser regression coverage is in `tests/e2e/technical-documentation.spec.ts`, plus the existing PCB, BOM and ESP32 documentation tests. The temporary local preview configuration uses Edge where Chromium is not installed. GitHub Pages continues to publish only `out/` through the existing workflow; there is no backend or new dependency.

## Change manifest

Created:

- `src/data/case-studies.ts`
- `src/components/technical/CaseStudyDocumentation.tsx`
- `src/components/technical/TechnicalGallery.tsx`
- `src/components/technical/TechnicalImageViewer.tsx`
- `src/components/technical/BoardStackup.tsx`
- `src/app/technical-documentation.css`
- `public/assets/projects/personal/esp32-devkit/documentation/block-diagram.svg`
- `tests/e2e/technical-documentation.spec.ts`
- `docs/TECHNICAL-CASE-STUDIES.md`

Modified:

- `src/components/BoardDetails.tsx`: case-study sections, metadata, shared stackup and honest missing-documentation states.
- `src/components/PortfolioHome.tsx`: documentation links inside the two existing Case Study cards only.
- `src/data/resume.ts`: existing case-study route slugs and accurate STM32 scope / EDA tool.
- `data/example-projects.json`: accurate STM32 hardware scope and Altium attribution.
- `src/app/layout.tsx`: import the scoped documentation stylesheet.
- `tests/e2e/esp32-documentation.spec.ts`: scope the existing stackup-tab checks after adding the standalone table.
- `tests/e2e/resume-update.spec.ts`: the expanded STM32 technical page title.
- `docs/export-check.json`: regenerated static-export validation report.

Local verification completed: full ESLint, TypeScript / production build, 17 unit tests, 13 browser tests, and static-export verification (29 pages, 1,362 internal references, 67 rendered image references). Browser tests include native touch pinch, pan/zoom, image navigation, focus restoration, missing assets, lazy loading, and PCB/BOM regressions.
