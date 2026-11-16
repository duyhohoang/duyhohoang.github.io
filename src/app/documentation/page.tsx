import type { Metadata } from 'next';
import { DocumentationHome } from '@/components/Documentation';

export const metadata: Metadata = {
  title: 'Electronics Engineering Documentation',
  description: 'A practical engineering knowledge base for circuit theory, schematic design, PCB layout and electronic components.',
  alternates: { canonical: '/documentation/' },
};

export default function DocumentationPage() { return <DocumentationHome/>; }
