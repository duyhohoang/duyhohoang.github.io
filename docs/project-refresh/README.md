# Project presentation refresh

- Priority: ESP32 Devkit, IoT Board, ESP32 Datalogger, ESP32 PLC, 6 Fan Control.
- Shared ProjectCard renders Home, Boards, and related projects with the same colors and hover behavior.
- Card image frames stay at 1.6 aspect ratio. Datalogger preview crops the software UI with CSS; the detail gallery retains the supplied original.
- Neon marquee runs right to left between case studies and Recent Projects. Reduced motion disables it.
- Download Resume uses the owner-approved Ngô Triệu Vy example PDF, clearly labeled Demo CV. Replace through src/data/resume.ts or NEXT_PUBLIC_RESUME_URL.

Validation: production build, ESLint, 12 unit tests, static export references, project-refresh browser checks (7 viewport widths), animation/menu/FAQ/tabs/form checks, and no-JavaScript content checks passed. Screenshots in this folder show the final presentation.
