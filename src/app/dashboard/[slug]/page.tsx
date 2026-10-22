import { notFound } from 'next/navigation';
import { boards, getBoard } from '@/lib/projects';
import { ProjectDashboard } from '@/components/ProjectDashboard';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams=false;
export function generateStaticParams(){return boards.map(board=>({slug:board.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const board=getBoard((await params).slug);return board?pageMetadata(`${board.name} Dashboard`,'An interactive dashboard preview with simulated data.',`/dashboard/${board.slug}/`):{};}
export default async function DashboardPage({params}:{params:Promise<{slug:string}>}){const board=getBoard((await params).slug);if(!board)notFound();return <ProjectDashboard slug={board.slug} name={board.name} projects={boards.map(({slug,name})=>({slug,name}))}/>;}
