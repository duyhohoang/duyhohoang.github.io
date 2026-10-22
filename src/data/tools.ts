export const tools = {
  kicad: {
    title: 'KiCad', category: 'OPEN-SOURCE ELECTRONIC DESIGN',
    image: '/assets/tools/kicad-pcb-editor.png', width: 1920, height: 1080,
    alt: 'KiCad PCB Editor showing a board layout, copper traces, component pads and layer controls',
    caption: 'KiCad PCB Editor — image supplied for this workspace.',
    intro: 'KiCad is a free, open-source electronic design suite. It connects schematic capture, PCB layout and board visualization in one project workflow, making it a flexible environment for learning, prototyping and developing electronic hardware.',
    features: [
      ['Schematic capture', 'Build circuits from symbols and wires, organize connections and check electrical consistency with ERC.'],
      ['PCB layout & routing', 'Place footprints and route copper with interactive routing modes that work with design rules.'],
      ['Design rule checking', 'Review clearances and layout conditions with configurable DRC checks before preparing a board for fabrication.'],
      ['Component libraries', 'Work with symbols, footprints and matching 3D models; create custom library elements when needed.'],
      ['3D board visualization', 'Inspect the assembled board in the integrated 3D Viewer to better understand placement and physical form.'],
      ['Connected design workflow', 'Update the PCB from the schematic and cross-probe between the two editors to locate components.'],
    ],
    workflow: ['Capture the circuit', 'Assign footprints', 'Place & route', 'Run checks', 'Review in 3D'],
    sources: [
      ['Schematic capture', 'https://www.kicad.org/discover/schematic-capture/'],
      ['PCB design', 'https://www.kicad.org/discover/pcb-design/'],
      ['3D Viewer', 'https://www.kicad.org/discover/3dviewer/'],
    ],
  },
  altium: {
    title: 'Altium Designer', category: 'INTEGRATED PCB DESIGN',
    image: '/assets/tools/altium-designer.jpg', width: 690, height: 425,
    alt: 'Altium Designer promotional illustration of a populated circuit board with illuminated traces',
    caption: 'Altium Designer — image supplied for this workspace.',
    intro: 'Altium Designer is a commercial electronic design environment that brings schematic capture, PCB layout, component information and manufacturing documentation together. Its integrated workflow helps keep the circuit, board and design constraints connected as a project evolves.',
    features: [
      ['Schematic capture', 'Create circuit documents with components, connections and parameters that describe the design intent.'],
      ['PCB layout', 'Define the board, arrange components and develop the copper layout in a dedicated PCB editor.'],
      ['Design constraints', 'Set rules such as copper clearance to guide routing and check the physical design.'],
      ['Components & libraries', 'Connect schematic symbols, PCB footprints, parameters and 3D models through component libraries.'],
      ['Schematic–PCB synchronization', 'Manage design changes between circuit and board so the two representations stay aligned.'],
      ['Manufacturing documentation', 'Prepare board documentation and manufacturing outputs as part of the wider design workflow.'],
    ],
    workflow: ['Create the schematic', 'Set board constraints', 'Place & route', 'Review changes', 'Prepare outputs'],
    sources: [
      ['Altium documentation', 'https://www.altium.com/documentation/'],
      ['Component libraries', 'https://www.altium.com/documentation/altium-designer/components-libraries/file-based-libraries'],
      ['Electrical design rules', 'https://www.altium.com/documentation/altium-designer/pcb/design-rule-types/electrical'],
    ],
  },
} as const;
export function getTool(slug: string) { return slug === 'kicad' ? tools.kicad : slug === 'altium' ? tools.altium : undefined; }

