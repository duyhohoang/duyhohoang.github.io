import Image from 'next/image';
import Link from 'next/link';
import type {Board} from '@/lib/projects';

/** Shared by Home, Boards and related projects to keep presentation identical. */
export function ProjectCard({board}:{board:Board}){
  return <Link className="project-card" href={`/boards/${board.slug}/`}>
    <div className={`ref-project-image project-visual${board.slug==='esp32-datalogger'?' project-visual-datalogger':''}`}>
      <Image src={board.heroImage.src} alt={board.heroImage.alt} width={600} height={400} loading="lazy"/>
    </div>
    <div><span>PERSONAL HARDWARE PROJECT</span><b className="project-arrow" aria-hidden="true">↗</b><h3>{board.name}</h3><p>{board.summary}</p></div>
  </Link>;
}
