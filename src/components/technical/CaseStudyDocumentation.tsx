import type {CaseStudy} from '@/data/case-studies';
import type {Board} from '@/lib/projects';
import {BoardStackup} from './BoardStackup';
import {DocumentationPending, TechnicalGallery} from './TechnicalGallery';

export function TechnicalMetadata({study}: {study: CaseStudy}) {
  return <dl className="technical-metadata">{[
    ['Main MCU', study.mcu], ['EDA software', study.edaTool], ['Copper layers', study.pcbLayers ? String(study.pcbLayers) : 'Not documented'], ['Project status', study.status], ['Interfaces', study.interfaces.join(' · ')],
  ].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;
}

export function CaseStudyDocumentation({board, study, children}: {board: Board; study: CaseStudy; children: React.ReactNode}) {
  const sections = [['architecture', 'System Architecture'], ['schematics', 'Schematic Design'], ['layout', 'PCB Layout & Routing'], ['stackup', 'PCB Stackup'], ['tools', 'Interactive PCB Tools'], ['decisions', 'Engineering Decisions'], ['status', 'Project Status']];
  const viewerImages = [...study.architectureImages, ...study.schematicImages, ...study.pcbImages];
  return <div className="technical-documentation">
    <nav className="technical-section-nav" aria-label="Case study sections">{sections.map(([id, title]) => <a key={id} href={'#documentation-' + id}>{title}</a>)}</nav>
    <section className="technical-section" id="documentation-architecture" aria-labelledby="architecture-heading"><header><span>B / SYSTEM ARCHITECTURE</span><h2 id="architecture-heading">System Architecture / Block Diagram</h2></header>{study.architectureImages.length ? <TechnicalGallery viewerImages={viewerImages} images={study.architectureImages} label="System architecture diagrams"/> : <DocumentationPending>A project block diagram has not been supplied. No illustrative circuit or inferred connectivity is substituted.</DocumentationPending>}</section>
    <section className="technical-section" id="documentation-schematics" aria-labelledby="schematics-heading"><header><span>C / CIRCUIT DOCUMENTATION</span><h2 id="schematics-heading">Schematic Design</h2></header>{study.schematicImages.length ? <TechnicalGallery viewerImages={viewerImages} images={study.schematicImages} label="Schematic design gallery"/> : <DocumentationPending>Actual schematic exports are awaiting upload. Power, MCU, communication, peripheral and protection categories will appear only when their project images are supplied.</DocumentationPending>}</section>
    <section className="technical-section" id="documentation-layout" aria-labelledby="layout-heading"><header><span>D / BOARD DOCUMENTATION</span><h2 id="layout-heading">PCB Layout & Routing</h2></header><TechnicalGallery viewerImages={viewerImages} images={study.pcbImages} label="PCB layout and 3D render gallery"/><p className="technical-caption">Top, bottom and inner-layer exports, component placement, routing and ground-plane views can be added as actual project assets.{board.pcbSource && ' The original PCB can already be inspected in Preview below.'}</p></section>
    <section className="technical-section" id="documentation-stackup" aria-labelledby="stackup-heading"><header><span>E / PCB CONSTRUCTION</span><h2 id="stackup-heading">PCB Stackup</h2></header><BoardStackup board={board}/></section>
    <section className="technical-section technical-tools" id="documentation-tools" aria-labelledby="tools-heading"><header><span>F / INTERACTIVE INSPECTION</span><h2 id="tools-heading">Interactive PCB Tools</h2></header><p className="technical-caption">Use Preview for native PCB inspection and BOM for component lookup. Interactive files load when their tab is opened.</p>{children}</section>
    <section className="technical-section" id="documentation-decisions" aria-labelledby="decisions-heading"><header><span>G / DESIGN RATIONALE</span><h2 id="decisions-heading">Engineering Decisions</h2></header><div className="technical-decisions">{study.engineeringDecisions.map(decision => <article key={decision.title}><h3>{decision.title}</h3><p>{decision.description}</p></article>)}</div></section>
    <section className="technical-section" id="documentation-status" aria-labelledby="status-heading"><header><span>H / EVIDENCE & PROGRESS</span><h2 id="status-heading">Project Status</h2></header><p className="technical-status-summary">{study.status}</p><ul className="technical-milestones">{study.milestones.map(milestone => <li key={milestone.label} data-state={milestone.state}><span>{milestone.state === 'completed' ? 'Completed' : milestone.state === 'documented' ? 'Documented' : 'Not documented'}</span><div><strong>{milestone.label}</strong><p>{milestone.evidence}</p></div></li>)}</ul></section>
  </div>;
}
