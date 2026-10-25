import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { portfolio } from '@/data/portfolio';
import { PortfolioArt } from '@/components/PortfolioArt';
import { Button } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
import { getTool } from '@/data/tools';
import { Reveal } from '@/components/Reveal';
export const dynamicParams = false;
export function generateStaticParams(){return portfolio.map(item=>({area:item.slug}));}
export async function generateMetadata({params}:{params:Promise<{area:string}>}){
 const {area}=await params;const item=portfolio.find(item=>item.slug===area);
 return item?pageMetadata(item.title,item.description,`/portfolio/${area}/`):{};
}
export default async function PortfolioPage({params}:{params:Promise<{area:string}>}){
 const {area}=await params;const item=portfolio.find(item=>item.slug===area);if(!item)notFound();
 const tool=getTool(area);
 if(tool) return <>
  <div className="page-heading container"><p className="eyebrow">DESIGN TOOL / {tool.category}</p><h1>{tool.title}</h1><p>{tool.intro}</p></div>
  <div className="container tool-detail"><figure className="tool-detail-hero"><Image src={tool.image} width={tool.width} height={tool.height} alt={tool.alt} sizes="(max-width: 799px) 100vw, 1000px" priority /><figcaption>{tool.caption}</figcaption></figure>
  <section className="section"><div className="section-heading"><p className="eyebrow">FROM CIRCUIT TO BOARD</p><h2>What can {tool.title} do?</h2><p>A closer look at the core functions used throughout an electronic design project.</p></div><div className="tool-features">{tool.features.map(([title,body],index)=><Reveal key={title}><article><span className="index">0{index+1} / FUNCTION</span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></section>
  <section className="tool-process"><h2>A typical design flow</h2><ol>{tool.workflow.map((step,index)=><li key={step}><span className="index">0{index+1}</span>{step}</li>)}</ol></section>
  <section className="tool-resources"><h2>Explore the official documentation</h2><p>Continue learning with documentation from the software publisher.</p><div>{tool.sources.map(([label,url])=><a className="button" key={url} href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>)}</div></section>
  <div className="section-end tool-return"><Button href="/#tools">Back to design tools</Button><Link href={`/portfolio/${area==='kicad'?'altium':'kicad'}/`}>Explore {area==='kicad'?'Altium Designer':'KiCad'} →</Link></div></div>
 </>;
 return <><div className="page-heading container"><p className="eyebrow">PERSONAL WORKSPACE / DESIGN EXPLORATION</p><h1>{item.title}</h1><p>{item.description}</p></div><article className="container portfolio-detail"><PortfolioArt kind={item.image}/><div className="prose"><h2>Inside the process</h2><p>{item.description} This area brings together the thinking behind the work, connecting hardware decisions with the wider system.</p><h2>A growing collection</h2><p>Project notes, design revisions and practical observations will be collected here as individual studies develop.</p><p className="notice">This is a workspace concept overview. The illustration is original; project-specific screenshots, source files and verified results have not yet been published.</p><Button href="/#projects">Explore projects</Button><p><Link href="/#library">Back to the workspace</Link></p></div></article></>;
}


