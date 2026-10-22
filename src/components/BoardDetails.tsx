'use client';
import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Board } from '@/lib/projects';

export function BoardGallery({ board }: { board: Board }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const media = board.gallery[selected];
  const both = board.gallery.some(image => image.type === 'photo') && board.gallery.some(image => image.type === 'render');
  return <div className="gallery">{board.gallery.length > 1 && <div className="gallery-controls" role="group" aria-label="Project images">{board.gallery.map((image, index) => <button key={image.src} aria-pressed={selected === index} onClick={() => { setSelected(index); setFailed(false); }}>{image.type === 'diagram' ? 'Architecture study' : image.type === 'photo' && both ? 'Photo' : image.type === 'render' && both ? 'Render' : 'Concept illustration'}</button>)}</div>}<figure>{failed ? <div className="notice">This image is unavailable. The project description remains available below.</div> : <Image key={media.src} src={media.src} width={1000} height={760} loading="eager" alt={media.alt} onError={() => setFailed(true)} />}<figcaption>{media.type === 'diagram' ? 'ILLUSTRATIVE SYSTEM DIAGRAM · NOT A PROJECT SCHEMATIC' : 'ORIGINAL ILLUSTRATIVE CONCEPT · NOT A VERIFIED PCB'}</figcaption></figure></div>;
}
export function BomTable({ components }: { components: NonNullable<Board['components']> }) {
  const [ascending, setAscending] = useState(true);
  const rows = [...components].sort((a, b) => a.designator.localeCompare(b.designator, 'en', { numeric: true }) * (ascending ? 1 : -1));
  return <div className="table-scroll"><table><caption className="sr-only">Project bill of materials</caption><thead><tr><th scope="col" aria-sort={ascending ? 'ascending' : 'descending'}><button onClick={() => setAscending(value => !value)}>Designator {ascending ? '↑' : '↓'}</button></th>{['Quantity', 'Manufacturer', 'MPN', 'Description'].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.designator}><th scope="row">{row.designator}</th><td>{row.quantity}</td><td>{row.manufacturer || 'Not specified'}</td><td>{row.mpn || 'Not specified'}</td><td>{row.description}</td></tr>)}</tbody></table></div>;
}
export function FeatureTabs({ board }: { board: Board }) {
  const id = useId();
  const tabs = ['Overview', 'Features', ...(board.components?.length ? ['Components'] : []), ...(board.stackup?.length ? ['Stackup'] : []), 'Files'];
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
    if (next !== undefined) { event.preventDefault(); setActive(next); buttons.current[next]?.focus(); }
  }
  const title = tabs[active];
  return <section aria-label="Project documentation"><div className="tablist" role="tablist" aria-label="Engineering sections">{tabs.map((tab, index) => <button ref={element => { buttons.current[index] = element; }} key={tab} role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => keyboard(event, index)}>{tab}</button>)}</div><div className="tabpanel" role="tabpanel" tabIndex={0} id={`${id}-panel-${active}`} aria-labelledby={`${id}-tab-${active}`}><h2>{title === 'Overview' ? 'The system study' : title}</h2>{title === 'Overview' && <><p>{board.description}</p><p className="disclosure">{board.disclaimer}. Exact components, board layers, electrical limits and measured performance are not published.</p></>}{title === 'Features' && <ul>{board.features.map(feature => <li key={feature}>{feature}</li>)}</ul>}{title === 'Components' && board.components && <BomTable components={board.components} />}{title === 'Stackup' && board.stackup && <div className="stackup">{board.stackup.map(layer => <div key={layer.layer}><span>{layer.layer} · {layer.type}</span><span>{[layer.material, layer.thicknessMm !== undefined ? `${layer.thicknessMm} mm` : undefined].filter(Boolean).join(' / ')}</span></div>)}</div>}{title === 'Files' && (board.files?.length ? <ul>{board.files.map(file => <li key={file.href}><a className="button" href={file.href} download>{file.label}<span>{file.kind.toUpperCase()} ↓</span></a></li>)}</ul> : <p>No project files have been released. Schematics, BOMs, manufacturing files and mechanical models will only appear here when supplied and approved for publication.</p>)}</div></section>;
}
