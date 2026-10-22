import type {Board} from '@/lib/projects';
import {ProjectCard} from './ProjectCard';
export function BoardCard({board}:{board:Board;index?:number}){return <ProjectCard board={board}/>;}
