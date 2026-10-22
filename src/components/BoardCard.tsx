import Image from 'next/image';
import Link from 'next/link';
import { label } from '@/lib/catalog';
import type { Board } from '@/lib/projects';
export function BoardCard({ board, index = 0 }: { board: Board; index?: number }) {
  return <Link className="board-card" href={`/boards/${board.slug}/`}><div className="card-heading"><span className="index">{String(index + 1).padStart(2, '0')} / {label(board.category).toUpperCase()}</span><span aria-hidden="true">↗</span></div><div className="card-image"><Image src={board.heroImage.src} width={900} height={680} alt={board.heroImage.alt} /></div><div className="card-description"><span className="status">{label(board.status)}</span><h3>{board.name}</h3><p>{board.summary}</p><span className="micro">PERSONAL PROJECT · {board.featured ? 'FEATURED PROJECT' : 'PCB DESIGN'}</span></div></Link>;
}
