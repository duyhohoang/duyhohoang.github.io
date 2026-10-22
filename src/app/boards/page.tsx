import type { Metadata } from 'next';
import { BoardCatalog } from '@/components/BoardCatalog';
import { ContactCTA } from '@/components/ui';
import { boards } from '@/lib/projects';
export const metadata: Metadata = { title: 'Boards', description: 'Explore five personal PCB and embedded hardware projects by Hoàng Duy.', alternates: { canonical: '/boards/' } };
export default function Boards() { return <><div className="page-heading container"><p className="eyebrow">THE HARDWARE COLLECTION / 05 PROJECTS</p><h1>BOARDS.<br />BUILDING POSSIBILITIES.</h1><p>Explore my IoT Board, ESP32 PLC, ESP32 Datalogger, ESP32 Devkit and 6 Fan Control designs.</p></div><BoardCatalog boards={boards} /><ContactCTA /></>; }
