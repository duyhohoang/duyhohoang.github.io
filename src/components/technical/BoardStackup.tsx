import type {Board} from '@/lib/projects';
import {DocumentationPending} from './TechnicalGallery';

export function BoardStackup({board}: {board: Board}) {
  if (!board.stackup?.length) return <DocumentationPending>The project’s layer count, stackup materials and manufacturing thicknesses have not been supplied.</DocumentationPending>;
  return <>
    {board.stackupDetails && <><div className="stackup-summary"><span><strong>{board.stackupDetails.copperLayers}</strong> copper layers</span><span><strong>{board.stackupDetails.totalThicknessMm} mm</strong> total thickness</span><span>Impedance control: <strong>{board.stackupDetails.impedanceControlled ? 'enabled in KiCad' : 'disabled'}</strong></span></div>{board.stackupDetails.note && <p className="stackup-source-note">{board.stackupDetails.note}</p>}</>}
    <div className="table-scroll stackup-table"><table><caption className="sr-only">{board.name} PCB stackup, from top to bottom</caption><thead><tr>{['Layer', 'Type', 'Material', 'Thickness', 'Epsilon R', 'Loss Tan'].map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{board.stackup.map(layer => <tr key={layer.layer} data-kind={layer.type.toLowerCase()}><th scope="row">{layer.layer}</th><td>{layer.type}</td><td>{layer.material || 'Not specified'}</td><td>{layer.thicknessMm !== undefined ? layer.thicknessMm + ' mm' : '—'}</td><td>{layer.epsilonR ?? '—'}</td><td>{layer.lossTan ?? '—'}</td></tr>)}</tbody></table></div>
  </>;
}
