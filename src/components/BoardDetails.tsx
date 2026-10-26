'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { label, type Board } from '@/lib/projects';
import { ESP32BlockDiagram, ESP32Deployment } from './ESP32Architecture';
import {getCaseStudy} from '@/data/case-studies';
import {CaseStudyDocumentation, TechnicalMetadata} from './technical/CaseStudyDocumentation';
import {BoardStackup} from './technical/BoardStackup';
import {DocumentationPending} from './technical/TechnicalGallery';

const PCBViewer=dynamic(()=>import('./pcb-viewer/PCBViewer'),{ssr:false,loading:()=> <p className="pcb-viewer-notice" role="status">Loading PCB viewer…</p>});

export function BoardGallery({ board }: { board: Board }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const media = board.gallery[selected];
  const both = board.gallery.some(image => image.type === 'photo') && board.gallery.some(image => image.type === 'render');
  return <div className="gallery">{board.gallery.length > 1 && <div className="gallery-controls" role="group" aria-label="Project images">{board.gallery.map((image, index) => <button key={image.src} aria-pressed={selected === index} onClick={() => { setSelected(index); setFailed(false); }}>{image.type === 'diagram' ? 'Architecture study' : image.type === 'photo' && both ? 'Photo' : image.type === 'render' && both ? 'Render' : 'Concept illustration'}</button>)}</div>}<figure>{failed ? <div className="notice">This image is unavailable. The project description remains available below.</div> : <Image key={media.src} src={media.src} width={1000} height={760} loading="eager" alt={media.alt} onError={() => setFailed(true)} />}<figcaption>{media.type === 'diagram' ? 'ILLUSTRATIVE SYSTEM DIAGRAM · NOT A PROJECT SCHEMATIC' : board.personal ? 'PERSONAL PROJECT · ORIGINAL IMAGE SUPPLIED BY HOÀNG DUY' : 'ORIGINAL ILLUSTRATIVE CONCEPT · NOT A VERIFIED PCB'}</figcaption></figure></div>;
}
export function BomTable({ components }: { components: NonNullable<Board['components']> }) {
  const [ascending, setAscending] = useState(true);
  const rows = [...components].sort((a, b) => a.designator.localeCompare(b.designator, 'en', { numeric: true }) * (ascending ? 1 : -1));
  return <div className="table-scroll"><table><caption className="sr-only">Project bill of materials</caption><thead><tr><th scope="col" aria-sort={ascending ? 'ascending' : 'descending'}><button onClick={() => setAscending(value => !value)}>Designator {ascending ? '↑' : '↓'}</button></th>{['Quantity', 'Manufacturer', 'MPN', 'Description'].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.designator}><th scope="row">{row.designator}</th><td>{row.quantity}</td><td>{row.manufacturer || 'Not specified'}</td><td>{row.mpn || 'Not specified'}</td><td>{row.description}</td></tr>)}</tbody></table></div>;
}
export function InteractiveBom({bom}:{bom:NonNullable<Board['interactiveBom']>}) {
  const viewer=useRef<HTMLDivElement>(null);
  const frame=useRef<HTMLIFrameElement>(null);
  useEffect(()=>{
    const iframe=frame.current;
    if(!iframe)return;
    let lastMobile:boolean|undefined;
    function adapt(){
      const doc=iframe?.contentDocument;
      if(!doc?.getElementById('tb-btn'))return;
      if(!doc.getElementById('portfolio-bom-responsive')){
        const style=doc.createElement('style');
        style.id='portfolio-bom-responsive';
        style.textContent='@media(max-width:699px){#bomtable{min-width:640px}#bomdiv{overflow:auto}}';
        doc.head.appendChild(style);
      }
      const mobile=iframe!.clientWidth<700;
      if(mobile!==lastMobile){
        if(mobile)doc.getElementById('tb-btn')?.click();
        else if(lastMobile===true)doc.getElementById('lr-btn')?.click();
        lastMobile=mobile;
      }
    }
    iframe.addEventListener('load',adapt);
    const observer=new ResizeObserver(adapt);
    observer.observe(iframe);
    return ()=>{iframe.removeEventListener('load',adapt);observer.disconnect();};
  },[bom.src]);
  const [fullscreenError,setFullscreenError]=useState(false);
  async function fullscreen(){
    try{await viewer.current?.requestFullscreen();setFullscreenError(false);}catch{setFullscreenError(true);}
  }
  return <div className="interactive-bom" ref={viewer}>
    <div className="interactive-bom-toolbar"><div><span>INTERACTIVE BOM</span><strong>{bom.title}</strong></div><div className="interactive-bom-actions"><button type="button" onClick={fullscreen}>Fullscreen ↗</button><a href={bom.src} target="_blank" rel="noopener noreferrer">Open separately ↗</a></div></div>
    {fullscreenError&&<p className="interactive-bom-help" role="status">Fullscreen is unavailable. Use Open separately for a larger view.</p>}
    <iframe ref={frame} src={bom.src} title={bom.title} loading="lazy" sandbox="allow-scripts allow-same-origin allow-downloads" allow="fullscreen" allowFullScreen/>
  </div>;
}

function DemoNote({children}:{children:React.ReactNode}) {
  return <div className="board-demo-note"><span>Demo</span><p>{children}</p></div>;
}

export function BoardProjectDetails({board}:{board:Board}) {
  const study=getCaseStudy(board.slug);
  const [revision,setRevision]=useState('main');
  const isDemo=revision!=='main';
  const status=isDemo?(revision==='rev-1-1'?'prototype':'design'):board.status;
  return <>
    <div className="board-toolbar">
      <label className="board-revision">Revision<select value={revision} onChange={event=>setRevision(event.target.value)} aria-label="Select board revision"><option value="main">Main · Current</option><option value="rev-1-1">Rev 1.1 · Demo</option><option value="rev-1-0">Rev 1.0 · Demo</option></select></label>
      <div className="board-state"><span>Board status</span><strong data-status={status}><i aria-hidden="true"/>{!isDemo&&study?study.status:label(status)}{isDemo&&<small>Demo</small>}</strong></div>
    </div>
    {isDemo&&<p className="revision-demo-message" role="status">Demo revision metadata. The board image and documentation below are shared previews.</p>}
    <div className="detail-hero"><div className="detail-summary"><h1>{study?.title||board.name}</h1><section className="board-overview" aria-labelledby="board-overview-title"><h2 id="board-overview-title">Overview</h2>{study&&<span className="technical-overview-index">A / PROJECT OVERVIEW</span>}{board.overview?.length?board.overview.map((paragraph,index)=><p key={index}>{paragraph.title&&<strong>{paragraph.title}: </strong>}{paragraph.text}</p>):<p>{board.description}</p>}</section>{study&&<TechnicalMetadata study={study}/>}<div className="notice">{board.disclaimer}</div>{board.specs.length>0&&<dl className="specs">{board.specs.map(spec=><div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}{board.repoUrl&&<a className="button" href={board.repoUrl} target="_blank" rel="noopener noreferrer">Project repository ↗</a>}</div><BoardGallery board={board}/></div>
    {study?<CaseStudyDocumentation board={board} study={study}><FeatureTabs board={board}/></CaseStudyDocumentation>:<FeatureTabs board={board}/>}
    {board.slug==='esp32-devkit'&&<><p className="technical-caption">Deployment concept from the supplied project description; firmware completion and field validation are not documented.</p><ESP32Deployment/></>}
  </>;
}

function DemoBlockDiagram({board}:{board:Board}) {
  const controller=board.techStack.find(item=>/ESP32|STM32/.test(item))||'Controller';
  return <><DemoNote>Illustrative architecture for layout preview. Connections are examples, not this board’s schematic.</DemoNote><div className="demo-block-diagram" role="img" aria-label="Demo architecture: power input to regulation, controller, and peripheral interfaces"><div className="diagram-block"><small>01 / INPUT</small><strong>Power input</strong><span>External supply</span></div><div className="diagram-block"><small>02 / POWER</small><strong>Regulation</strong><span>Logic power rails</span></div><div className="diagram-block"><small>03 / PROCESSING</small><strong>{controller}</strong><span>Control & communication</span></div><div className="diagram-peripherals"><span>Sensors & inputs</span><span>Communication</span><span>Storage / outputs</span></div></div></>;
}
const demoStackup=[{layer:'L1',type:'Top signal',material:'Copper'},{layer:'L2',type:'Ground plane',material:'Copper'},{layer:'L3',type:'Power plane',material:'Copper'},{layer:'L4',type:'Bottom signal',material:'Copper'}];
const demoBom=[{designator:'U1',quantity:1,description:'Example microcontroller'},{designator:'U2',quantity:1,description:'Example voltage regulator'},{designator:'R1, R2',quantity:2,description:'Example resistors'},{designator:'C1, C2',quantity:2,description:'Example decoupling capacitors'},{designator:'J1',quantity:1,description:'Example connector'}];

export function FeatureTabs({ board }: { board: Board }) {
  const id = useId();
  const tabs = ['Key Features', 'Block Diagram', 'Stackup', 'Preview', 'BOM'];
  const [active, setActive] = useState(0);
  const [previewVisited,setPreviewVisited]=useState(false);
  function selectTab(index:number){setActive(index);if(index===3)setPreviewVisited(true);}
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
    if (next !== undefined) { event.preventDefault(); selectTab(next); buttons.current[next]?.focus(); }
  }
  const title = tabs[active];
  const diagram=board.gallery.find(image=>image.type==='diagram');
  const layers=board.stackup?.length?board.stackup:demoStackup;
  return <section className="project-documentation" aria-label="Project documentation"><div className="tablist" role="tablist" aria-label="Engineering sections">{tabs.map((tab,index)=><button ref={element=>{buttons.current[index]=element;}} key={tab} role="tab" id={id+'-tab-'+index} aria-controls={id+'-panel-'+index} aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>selectTab(index)} onKeyDown={event=>keyboard(event,index)}>{tab}</button>)}</div><div className="tabpanel" role="tabpanel" tabIndex={0} id={id+'-panel-'+active} aria-labelledby={id+'-tab-'+active}>
    <h2>{title}</h2>
    {title==='Key Features'&&(board.featureCards?.length?<div className="board-feature-cards">{board.featureCards.map(feature=><article key={feature.title}><span className="feature-icon" aria-hidden="true"><FeatureIcon kind={feature.icon}/></span><div><h3>{feature.title}</h3><p>{feature.text}</p></div></article>)}</div>:<ul className="board-feature-list">{board.features.map(feature=><li key={feature}>{feature}</li>)}</ul>)}
    {title==='Block Diagram'&&(board.slug==='esp32-devkit'?<ESP32BlockDiagram/>:diagram?<figure className="board-diagram"><Image src={diagram.src} width={1000} height={600} alt={diagram.alt}/><figcaption>{diagram.alt}</figcaption></figure>:getCaseStudy(board.slug)?<DocumentationPending>A verified block diagram has not been supplied for this project.</DocumentationPending>:<DemoBlockDiagram board={board}/>)}
    {title==='Stackup'&&(board.stackup?.length||getCaseStudy(board.slug)?<BoardStackup board={board}/>:<><DemoNote>Example 4-layer stackup for layout preview. Actual layer count, materials and thickness are not specified yet.</DemoNote><div className="stackup">{layers.map(layer=><div key={layer.layer}><span><b>{layer.layer}</b> · {layer.type}</span><span>{layer.material}</span></div>)}</div></>)}
    {(title==='Preview'||previewVisited)&&<div className="pcb-preview-panel" hidden={title!=='Preview'}>{board.pcbSource?<PCBViewer source={board.pcbSource} active={title==='Preview'}/>:<div className="pcb-source-missing"><h3>PCB source not available yet</h3><p>A KiCad PCB file has not been supplied for this project.</p></div>}{!!board.files?.length&&<div className="board-file-links">{board.files.map(file=><a key={file.href} className="button" href={file.href} download>{file.label} ↓</a>)}</div>}</div>}
    {title==='BOM'&&(board.interactiveBom?<InteractiveBom bom={board.interactiveBom}/>:getCaseStudy(board.slug)?<DocumentationPending>An Interactive BOM has not been supplied for this project.</DocumentationPending>:<>{!board.components?.length&&<DemoNote>Sample parts for layout preview. These are not the project’s actual components or purchasing quantities.</DemoNote>}<BomTable components={board.components?.length?board.components:demoBom}/></>)}
  </div></section>;
}

function FeatureIcon({kind}:{kind:NonNullable<Board['featureCards']>[number]['icon']}) {
 const paths:Record<typeof kind,string>={
  wifi:'M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0M12 20h.01',
  radio:'M2 12h4l3-7 5 14 3-7h5',
  sensor:'M4 8h16v10H4zM8 8V4m4 4V4m4 4V4',
  display:'M3 4h18v13H3zM12 17v4m-5 0h10',
  clock:'M12 8v5l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  relay:'M3 6h18v12H3zM7 12h3l4-3m2 3h2',
  storage:'M6 2h9l3 4v16H6zM9 3v5m3-5v5m3-5v5',
  power:'m13 2-9 12h7l-1 8 10-13h-8z'
 };
 return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]}/></svg>;
}
