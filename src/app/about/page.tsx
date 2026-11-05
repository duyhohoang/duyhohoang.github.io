import { ContactCTA } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('About', 'Hardware Lab is a personal hardware and software workspace, built around clear and thoughtful design.', '/about/');
export default function About() { return <><div className="page-heading container"><p className="eyebrow">HARDWARE LAB / PERSONAL WORKSPACE</p><h1>THOUGHTFUL DESIGN.<br />VISIBLE DECISIONS.</h1></div><article className="prose container"><p>I’m Hồ Hoàng Duy, an Automation and Control Engineering Technology graduate from Ho Chi Minh City University of Technology and Engineering. I’m seeking a Hardware Design Engineer role.</p><h2>Focus</h2><p>Schematic design and 2–4 layer PCB layout, power supplies, and STM32/ESP32 hardware. Tools: KiCad, Altium and STM32CubeMX; programming: C/C++.</p><h2>Project work</h2><p>Personal projects cover industrial IoT, pump control, PLC and embedded boards. I also completed PCB design training at 3DVisionLab – AIoTSemiconductor.</p><div className="notice">PCB Design · Embedded Hardware · Industrial IoT</div></article><ContactCTA /></>; }


