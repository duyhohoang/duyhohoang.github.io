'use client';
import {useEffect,useRef,useState} from 'react';
import {mountKiCanvas,type KiCanvasController,type PCBSource} from './KiCanvasAdapter';

type LoadState={status:'loading'|'ready'|'error';message?:string};
export default function PCBViewer({source,active}:{source:PCBSource;active:boolean}){
  const container=useRef<HTMLDivElement>(null);
  const host=useRef<HTMLDivElement>(null);
  const controller=useRef<KiCanvasController|null>(null);
  const [state,setState]=useState<LoadState>({status:'loading'});
  const [attempt,setAttempt]=useState(0);
  const [layersOpen,setLayersOpen]=useState(false);
  const [notice,setNotice]=useState('');
  useEffect(()=>{
    const element=host.current;if(!element)return;
    const abort=new AbortController();let instance:KiCanvasController|undefined;
    mountKiCanvas(element,source,abort.signal,setLayersOpen).then(value=>{
      if(abort.signal.aborted){value.dispose();return;}
      instance=value;controller.current=value;setState({status:'ready'});
    }).catch(error=>{if(!abort.signal.aborted)setState({status:'error',message:error instanceof Error?error.message:'PCB viewer could not be loaded.'});});
    return()=>{abort.abort();instance?.dispose();controller.current=null;};
  },[source,attempt]);
  // KiCanvas's own ResizeObserver handles the camera when a visited tab is
  // shown again. Keep its instance mounted to retain layer visibility and view.
  useEffect(()=>{if(active&&state.status==='ready')window.dispatchEvent(new Event('resize'));},[active,state.status]);
  async function fullscreen(){try{if(document.fullscreenElement===container.current)await document.exitFullscreen();else await container.current?.requestFullscreen();}catch{setNotice('Fullscreen is unavailable in this browser. You can still zoom and pan in the viewer.');}}
  const ready=state.status==='ready';
  return <div className="pcb-viewer" ref={container} aria-label={source.title}>
    <div className="pcb-viewer-topbar"><div><span>PCB 2D</span><strong>{source.title}</strong></div><button type="button" disabled={!ready} aria-expanded={layersOpen} onClick={()=>controller.current?.toggleLayers()}>Layers</button></div>
    <div className="pcb-viewer-stage" aria-busy={state.status==='loading'}>
      <div className="pcb-viewer-host" ref={host}/>
      {state.status==='loading'&&<div className="pcb-viewer-state" role="status"><span className="pcb-loading-dot"/>Loading KiCanvas and PCB data…</div>}
      {state.status==='error'&&<div className="pcb-viewer-state pcb-viewer-error" role="alert"><h3>PCB preview unavailable</h3><p>{state.message}</p><button type="button" onClick={()=>{setState({status:'loading'});setAttempt(value=>value+1);}}>Retry</button><a href={source.src} download>Download KiCad source</a></div>}
    </div>
    <div className="pcb-viewer-toolbar"><p>Scroll to zoom · Middle/right drag to pan · Select footprints to inspect</p><div><button type="button" disabled={!ready} onClick={()=>controller.current?.fit()}>Fit Board</button><button type="button" disabled={!ready} onClick={()=>controller.current?.reset()}>Reset View</button><button type="button" onClick={fullscreen}>Fullscreen</button></div></div>
    {notice&&<p className="pcb-viewer-notice" role="status">{notice}</p>}
    <div className="pcb-viewer-credit"><a href={source.src} download>Download .kicad_pcb</a><span>Rendered from KiCad source · <a href="https://kicanvas.org/embedding/" target="_blank" rel="noopener noreferrer">KiCanvas</a></span></div>
  </div>;
}
