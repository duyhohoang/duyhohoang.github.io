import { ContactCTA } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('About', 'Hoang Duy — PCB design, schematic capture, power supplies and 2–4 layer PCB layout.', '/about/');
export default function About() { return <><div className="page-heading container"><p className="eyebrow">HARDWARE LAB / PERSONAL WORKSPACE</p><h1>THOUGHTFUL DESIGN.<br />VISIBLE DECISIONS.</h1></div><article className="prose container"><p>I’m Hồ Hoàng Duy, an Automation and Control Engineering Technology graduate from Ho Chi Minh City University of Technology and Engineering. I’m focused on PCB design opportunities.</p><h2>Focus</h2><p>Schematic design, component selection, power supplies and 2–4 layer PCB layout. Tools: KiCad and Altium. Embedded C/C++ and STM32/ESP32 are supporting fundamentals.</p><h2>Project work</h2><p>Personal projects cover industrial IoT, pump control, PLC and board design. I also completed PCB design training at 3DVisionLab – AIoTSemiconductor.</p><div className="notice">PCB Design · Power Electronics · PCB Layout</div></article><ContactCTA /></>; }


