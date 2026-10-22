# Content Model & Seed Strategy

## Studio
`studioName`, `tagline`, `description`, `email`, `locationText?`, `githubUrl?`, `linkedinUrl?`, `logoPath?`, `socialImagePath?`. Use clearly marked placeholders until provided.

## Board fields
```
slug: string
name: string
summary: string
description: string
category: 'industrial-iot'|'embedded'|'power'|'interface'|'test-equipment'|'other'
status: 'concept'|'in-progress'|'prototype'|'validated'
featured: boolean
year?: number
heroImage: {src:string, alt:string}
gallery: Array<{src:string,alt:string,type:'render'|'photo'|'diagram'}>
specs: Array<{label:string,value:string}>
features: string[]
components?: Array<{designator:string,quantity:number,manufacturer?:string,mpn?:string,description:string}>
stackup?: Array<{layer:string,type:string,thicknessMm?:number,material?:string}>
files?: Array<{label:string,href:string,kind:'pdf'|'zip'|'step'|'gerber'|'other'}>
repoUrl?: string
published: boolean
```

## Seed content — explicitly illustrative, not verified product claims
1. `stm32-industrial-iot-controller`: STM32F407, CAN, RS485/RS232, Ethernet, cellular/GNSS; status `in-progress`; list exact specs only after user verification.
2. `esp32-connected-io-platform`: ESP32-based remote monitoring/control with analog I/O and industrial communications; status `concept`.
3. `six-channel-fan-controller`: six PWM fan channels and tachometer monitoring; status `concept` or `in-progress` after confirmation.

Do not invent PCB photographs, test results, revision numbers, released source files, open-source licenses, customers, company history or commercial certifications. For placeholders use original abstract technical illustrations and `Illustrative concept` label where needed.

## English copy suggestions
Hero eyebrow: `INDEPENDENT HARDWARE ENGINEERING STUDIO`
Hero title: `HARDWARE. DESIGNED. ENGINEERED.`
Hero body: `We turn electronic concepts into thoughtfully engineered boards, embedded platforms and connected systems.`
Section: `ENGINEERING IN EVERY LAYER`
Boards intro: `Explore prototypes, development platforms and purpose-built electronics.`
CTA: `EXPLORE OUR BOARDS`
Contact: `LET'S BUILD SOMETHING REAL.`

## Publishing workflow
New board -> add MDX/JSON -> validate schema -> add original assets -> mark `published=true` -> run tests/build -> deploy. Do not show unavailable downloads.
