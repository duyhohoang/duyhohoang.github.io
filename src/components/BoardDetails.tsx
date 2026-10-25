'use client';
import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { label, type Board } from '@/lib/projects';

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
function DemoNote({children}:{children:React.ReactNode}) {
  return <div className="board-demo-note"><span>Demo</span><p>{children}</p></div>;
}

export function BoardProjectDetails({board}:{board:Board}) {
  const [revision,setRevision]=useState('main');
  const isDemo=revision!=='main';
  const status=isDemo?(revision==='rev-1-1'?'prototype':'design'):board.status;
  return <>
    <div className="board-toolbar">
      <label className="board-revision">Revision<select value={revision} onChange={event=>setRevision(event.target.value)} aria-label="Select board revision"><option value="main">Main · Current</option><option value="rev-1-1">Rev 1.1 · Demo</option><option value="rev-1-0">Rev 1.0 · Demo</option></select></label>
      <div className="board-state"><span>Board status</span><strong data-status={status}><i aria-hidden="true"/>{label(status)}{isDemo&&<small>Demo</small>}</strong></div>
    </div>
    {isDemo&&<p className="revision-demo-message" role="status">Demo revision metadata. The board image and documentation below are shared previews.</p>}
    <div className="detail-hero"><div className="detail-summary"><h1>{board.name}</h1><section className="board-overview" aria-labelledby="board-overview-title"><h2 id="board-overview-title">Overview</h2><p>{board.description}</p></section><div className="notice">{board.disclaimer}</div>{board.specs.length>0&&<dl className="specs">{board.specs.map(spec=><div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}{board.repoUrl&&<a className="button" href={board.repoUrl} target="_blank" rel="noopener noreferrer">Project repository ↗</a>}</div><BoardGallery board={board}/></div>
    <FeatureTabs board={board}/>
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
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
    if (next !== undefined) { event.preventDefault(); setActive(next); buttons.current[next]?.focus(); }
  }
  const title = tabs[active];
  const diagram=board.gallery.find(image=>image.type==='diagram');
  const layers=board.stackup?.length?board.stackup:demoStackup;
  return <section className="project-documentation" aria-label="Project documentation"><div className="tablist" role="tablist" aria-label="Engineering sections">{tabs.map((tab,index)=><button ref={element=>{buttons.current[index]=element;}} key={tab} role="tab" id={id+'-tab-'+index} aria-controls={id+'-panel-'+index} aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>keyboard(event,index)}>{tab}</button>)}</div><div className="tabpanel" role="tabpanel" tabIndex={0} id={id+'-panel-'+active} aria-labelledby={id+'-tab-'+active}>
    <h2>{title}</h2>
    {title==='Key Features'&&<ul className="board-feature-list">{board.features.map(feature=><li key={feature}>{feature}</li>)}</ul>}
    {title==='Block Diagram'&&(diagram?<figure className="board-diagram"><Image src={diagram.src} width={1000} height={600} alt={diagram.alt}/><figcaption>{diagram.alt}</figcaption></figure>:<DemoBlockDiagram board={board}/>)}
    {title==='Stackup'&&<>{!board.stackup?.length&&<DemoNote>Example 4-layer stackup for layout preview. Actual layer count, materials and thickness are not specified yet.</DemoNote>}<div className="stackup">{layers.map(layer=><div key={layer.layer}><span><b>{layer.layer}</b> · {layer.type}</span><span>{[layer.material,'thicknessMm' in layer&&layer.thicknessMm!==undefined?String(layer.thicknessMm)+' mm':undefined].filter(Boolean).join(' / ')}</span></div>)}</div></>}
    {title==='Preview'&&<div className="board-preview"><BoardGallery board={board}/>{!!board.files?.length&&<div className="board-file-links">{board.files.map(file=><a key={file.href} className="button" href={file.href} download>{file.label} ↓</a>)}</div>}</div>}
    {title==='BOM'&&<>{!board.components?.length&&<DemoNote>Sample parts for layout preview. These are not the project’s actual components or purchasing quantities.</DemoNote>}<BomTable components={board.components?.length?board.components:demoBom}/></>}
  </div></section>;
}
