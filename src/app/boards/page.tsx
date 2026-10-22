import type { Metadata } from 'next';
import { BoardCatalog } from '@/components/BoardCatalog';
import { ContactCTA } from '@/components/ui';
import { boards } from '@/lib/projects';
export const metadata: Metadata = { title: 'Boards', description: 'Explore illustrative hardware engineering studies, embedded platforms and purpose-built electronics.', alternates: { canonical: '/boards/' } };
export default function Boards() { return <><div className="page-heading container"><p className="eyebrow">THE HARDWARE COLLECTION / 03 STUDIES</p><h1>BOARDS.<br />BUILDING POSSIBILITIES.</h1><p>Explore prototypes, development platforms and purpose-built electronics through three illustrative project studies.</p></div><BoardCatalog boards={boards} /><ContactCTA /></>; }
