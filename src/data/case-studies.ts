export type TechnicalImage = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  category: string;
  width: number;
  height: number;
};

export type CaseStudy = {
  slug: string;
  title: string;
  mcu: string;
  edaTool: string;
  pcbLayers?: number;
  status: string;
  interfaces: string[];
  architectureImages: TechnicalImage[];
  schematicImages: TechnicalImage[];
  pcbImages: TechnicalImage[];
  engineeringDecisions: {title: string; description: string}[];
  milestones: {label: string; state: 'completed' | 'documented' | 'pending'; evidence: string}[];
};

// Only supplied project assets are listed. Add schematic/layout exports here
// after placing the actual files in the corresponding documentation folder.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'iot-board',
    title: 'STM32F407-Based Industrial Pump Controller & Data Logger',
    mcu: 'STM32F407',
    edaTool: 'Altium Designer',
    status: 'Schematic & PCB Layout Completed',
    interfaces: ['RS485 · intended Modbus RTU VFD interface', '2× CAN Bus', '2× RS232', 'Ethernet', 'SIM7600 4G LTE / GNSS'],
    architectureImages: [],
    schematicImages: [],
    pcbImages: [{src: '/assets/projects/personal/iot-board.webp', title: 'Assembled-board 3D render', alt: 'STM32F407 industrial pump controller PCB render showing Ethernet, cellular module and relay outputs', caption: 'Original project render supplied by Hoàng Duy. A render documents the design; it does not establish prototype assembly or hardware validation.', category: '3D PCB Render', width: 1276, height: 856}],
    engineeringDecisions: [
      {title: 'Multi-rail power architecture', description: 'The documented design provides 12V, 5V, 4V, 3.3V and 1.8V rails for the controller and peripherals. Converter schematics and rail-by-rail measurements have not been supplied for this page.'},
      {title: 'Industrial communication hardware', description: 'RS485 hardware is intended for Modbus RTU-based VFD control. CAN, RS232, Ethernet and SIM7600 LTE/GNSS provide additional connectivity. Completed protocol firmware or VFD operation is not asserted.'},
      {title: 'Local timekeeping and storage', description: 'RTC, EEPROM and SD card interfaces support the planned monitoring and logging architecture. Relay outputs and a buzzer are included in the hardware design.'},
      {title: 'Design scope', description: 'Schematic and PCB layout were completed in Altium Designer, as confirmed by the project owner. Layer stackup, detailed routing decisions and hardware test evidence are awaiting documentation.'},
    ],
    milestones: [
      {label: 'Schematic', state: 'completed', evidence: 'Completion confirmed by the project owner; schematic exports pending.'},
      {label: 'PCB layout', state: 'completed', evidence: 'Completion confirmed by the project owner; original 3D render supplied.'},
      {label: 'PCB ordered / prototype assembly', state: 'pending', evidence: 'No manufacturing or assembly evidence supplied.'},
      {label: 'Hardware testing', state: 'pending', evidence: 'No measurements or validation report supplied.'},
      {label: 'Firmware / VFD / cloud integration', state: 'pending', evidence: 'No completion evidence supplied; these remain outside the documented hardware milestone.'},
    ],
  },
  {
    slug: 'esp32-devkit',
    title: 'ESP32-Based IoT Node & Gateway',
    mcu: 'ESP32 · ESP-WROOM-32D',
    edaTool: 'KiCad',
    pcbLayers: 2,
    status: 'Hardware design documented · validation pending',
    interfaces: ['Wi-Fi / Bluetooth', 'LoRa · Ra-02', 'RS485', 'I2C', 'UART', 'microSD'],
    architectureImages: [{src: '/assets/projects/personal/esp32-devkit/documentation/block-diagram.svg', title: 'System architecture', alt: 'ESP32 Devkit system blocks: power conversion, I2C sensors, RTC, EEPROM, SPI storage, relay and RS485 hardware', caption: 'Redrawn from the owner-supplied KiCad hierarchy. This is a system block diagram, not a circuit schematic or evidence of firmware completion.', category: 'System Architecture', width: 1000, height: 660}],
    schematicImages: [],
    pcbImages: [{src: '/assets/projects/personal/esp32-devkit.webp', title: 'Integrated ESP32 board render', alt: 'ESP32 IoT node and gateway PCB render with power supply, RTC battery, LoRa module, relays and microSD', caption: 'Original project render supplied by Hoàng Duy. The native KiCad PCB and Interactive BOM are available in the tools section below.', category: '3D PCB Render', width: 993, height: 805}],
    engineeringDecisions: [
      {title: 'Integrated power conversion', description: 'The supplied hierarchy documents conversion from 220VAC to 24VDC, 5VDC and 3.3VDC. Protection and power hardware are described in the project overview; qualification or compliance is not inferred.'},
      {title: 'Sensor interface accessibility', description: 'The documented I2C interface uses a stacked USB-A connector and a jumper-selectable 3.3V / 5V supply. This connector carries I2C signals rather than standard USB data.'},
      {title: 'Local logging hardware', description: 'RTC timekeeping and EEPROM / microSD storage are part of the supplied hardware documentation. Wi-Fi, LoRa and RS485 provide the interface options for node and gateway use.'},
      {title: 'Two-layer PCB', description: 'The supplied MP1.kicad_pcb defines front and back copper layers with an FR4 core. The stackup table below uses its saved layer thicknesses. Routing and return paths can be inspected in the native PCB viewer; no signal-integrity or EMC test result is claimed.'},
    ],
    milestones: [
      {label: 'System architecture', state: 'documented', evidence: 'Owner-supplied KiCad hierarchy and project description.'},
      {label: 'Schematic', state: 'pending', evidence: 'Circuit-level schematic exports have not been supplied to this portfolio.'},
      {label: 'PCB layout & BOM', state: 'documented', evidence: 'Original MP1.kicad_pcb, Interactive BOM and 3D render supplied; completion sign-off is not documented.'},
      {label: 'PCB ordered / prototype assembly', state: 'pending', evidence: 'No manufacturing or assembly evidence supplied.'},
      {label: 'Hardware testing / firmware integration', state: 'pending', evidence: 'No test report or firmware completion evidence supplied. The deployment diagram describes intended system use.'},
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find(study => study.slug === slug);
}
