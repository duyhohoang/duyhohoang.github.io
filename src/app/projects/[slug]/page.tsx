import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { boards, getBoard } from '@/lib/projects';
import { BoardProjectDetails } from '@/components/BoardDetails';
import { BoardCard } from '@/components/BoardCard';
import { ContactCTA } from '@/components/ui';
export const dynamicParams = false;
export function generateStaticParams() { return boards.map(board => ({ slug: board.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const board = getBoard((await params).slug);
  if (!board) return { title: 'Board not found' };
  return { title: board.name, description: board.summary, alternates: { canonical: `/projects/${board.slug}/` }, openGraph: { title: board.name, description: board.summary, images: [{ url: board.heroImage.src, alt: board.heroImage.alt }] } };
}
export default async function BoardPage({ params }: Props) {
  const board = getBoard((await params).slug);
  if (!board) notFound();
  return <><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/#projects">Projects</Link><span aria-hidden="true">/</span><span aria-current="page">{board.name}</span></nav><BoardProjectDetails board={board}/><section className="related"><h2>RELATED STUDIES</h2><div className="ref-three ref-projects board-project-grid">{boards.filter(item => item.slug !== board.slug).map((item, index) => <BoardCard board={item} index={index} key={item.slug} />)}</div></section></div><ContactCTA /></>;
}
