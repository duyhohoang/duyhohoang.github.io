/**
 * Adapter for the vendored KiCanvas snapshot. Public embedding attributes drive
 * loading; source-verified native controls bridge gaps in the alpha embed API.
 * No custom PCB parser, camera, layer list, or renderer lives here.
 */
export type PCBSource = { src: string; title: string };
type NativeBoardViewer = {
  zoom_to_board: () => void;
  draw: () => void;
  select: (item: null) => void;
};
export type KiCanvasController = {
  fit: () => void;
  reset: () => void;
  toggleLayers: () => void;
  dispose: () => void;
};
const SCRIPT_PATH='/assets/vendor/kicanvas/kicanvas.js';
const SCRIPT_URL=SCRIPT_PATH+'?v=20261025-exposed-tracks';
let modulePromise: Promise<void>|undefined;

function loadModule():Promise<void>{
  if(customElements.get('kicanvas-embed'))return Promise.resolve();
  if(modulePromise)return modulePromise;
  modulePromise=new Promise<void>((resolve,reject)=>{
    const script=document.createElement('script');
    script.id='portfolio-kicanvas-module';script.type='module';script.src=SCRIPT_URL;
    const timeout=window.setTimeout(()=>fail(),30000);
    function fail(){window.clearTimeout(timeout);script.remove();modulePromise=undefined;reject(new Error('KiCanvas could not start. Check your connection and try again.'));}
    script.onerror=fail;
    script.onload=()=>{window.clearTimeout(timeout);if(customElements.get('kicanvas-embed'))resolve();else fail();};
    document.head.appendChild(script);
  });
  return modulePromise;
}

/** KiCanvas uses open shadow roots; keep version-specific DOM access here only. */
export function queryNative<T extends Element=HTMLElement>(root:ParentNode,selector:string):T|null{
  if(root instanceof Element&&root.shadowRoot){const match=queryNative<T>(root.shadowRoot,selector);if(match)return match;}
  const found=root.querySelector<T>(selector);
  if(found)return found;
  for(const child of root.querySelectorAll('*')){
    if(child.shadowRoot){const match=queryNative<T>(child.shadowRoot,selector);if(match)return match;}
  }
  return null;
}
function boardViewer(embed:HTMLElement):NativeBoardViewer|undefined{
  const element=queryNative<HTMLElement&{viewer?:NativeBoardViewer}>(embed,'kc-board-viewer[loaded]');
  const viewer=element?.viewer;
  return typeof viewer?.zoom_to_board==='function'&&typeof viewer.draw==='function'?viewer:undefined;
}
function abortError(){return new DOMException('PCB loading cancelled','AbortError');}

export async function mountKiCanvas(host:HTMLElement,source:PCBSource,signal:AbortSignal,onLayersChange:(open:boolean)=>void):Promise<KiCanvasController>{
  const [response]=await Promise.all([fetch(source.src,{signal}),loadModule()]);
  if(!response.ok)throw new Error(response.status===404?'PCB file was not found. Please check the project source path.':'PCB file could not be loaded (HTTP '+response.status+').');
  const text=await response.text();
  if(!text.trimStart().startsWith('(kicad_pcb'))throw new Error('This file is not a supported KiCad PCB document.');
  if(signal.aborted)throw abortError();
  const embed=document.createElement('kicanvas-embed');
  embed.setAttribute('controls','full');embed.setAttribute('controlslist','nooverlay noflipview nodownload');
  embed.setAttribute('aria-label',source.title);embed.style.fontFamily='inherit';
  const input=document.createElement('kicanvas-source');
  input.setAttribute('type','board');input.setAttribute('name',source.src.split('/').pop()||'board.kicad_pcb');input.textContent=text;
  embed.append(input);
  let disposed=false;
  function remove(){if(disposed)return;disposed=true;embed.remove();}
  signal.addEventListener('abort',remove,{once:true});
  try{
    await new Promise<void>((resolve,reject)=>{
      function cleanup(){window.clearInterval(interval);window.clearTimeout(timeout);embed.removeEventListener('kicanvas:load',check,true);embed.removeEventListener('kicanvas:error',error);window.removeEventListener('unhandledrejection',rejection);signal.removeEventListener('abort',cancel);}
      function check(){if(boardViewer(embed)){cleanup();resolve();}}
      function error(){cleanup();reject(new Error('KiCanvas could not render this PCB. Its format may not yet be supported.'));}
      function rejection(event:PromiseRejectionEvent){const stack=event.reason instanceof Error?event.reason.stack||'':'';if(stack.includes(SCRIPT_PATH)){event.preventDefault();error();}}
      function cancel(){cleanup();reject(abortError());}
      embed.addEventListener('kicanvas:load',check,true);embed.addEventListener('kicanvas:error',error);
      window.addEventListener('unhandledrejection',rejection);signal.addEventListener('abort',cancel,{once:true});
      const interval=window.setInterval(check,100);
      const timeout=window.setTimeout(()=>{cleanup();reject(new Error('The PCB viewer did not finish loading. Retry, or check that WebGL 2 is available in your browser.'));},45000);
      host.replaceChildren(embed);
    });
    if(signal.aborted)throw abortError();
    const native=boardViewer(embed)!;
    const sidebar=queryNative<HTMLElement>(embed,'kc-ui-activity-side-bar');
    if(!sidebar)throw new Error('This KiCanvas version does not provide its native layer manager.');
    // Use the native preference control, rather than an invented embed theme API.
    const navigation=queryNative<HTMLInputElement>(embed,'input[name="align-controls-kicad"]');
    if(navigation&&!navigation.checked){navigation.checked=true;navigation.dispatchEvent(new Event('input',{bubbles:true,composed:true}));}
    const theme=queryNative<HTMLSelectElement>(embed,'select[name="theme"]');
    if(theme&&theme.value!=='witchhazel'){theme.value='witchhazel';theme.dispatchEvent(new Event('input',{bubbles:true,composed:true}));}
    // Upstream WebGL initializes clearColor before its document theme is loaded.
    // Set only the existing context's clear color; all geometry stays native.
    const nativeElement=queryNative<HTMLElement>(embed,'kc-board-viewer');
    const canvas=nativeElement?queryNative<HTMLCanvasElement>(nativeElement,'canvas'):null;
    canvas?.getContext('webgl2')?.clearColor(17/255,20/255,31/255,1);
    if(host.clientWidth>=760)sidebar.removeAttribute('collapsed');
    function layersChanged(){onLayersChange(!sidebar!.hasAttribute('collapsed'));}
    const observer=new MutationObserver(layersChanged);observer.observe(sidebar,{attributes:true,attributeFilter:['collapsed']});layersChanged();
    const fit=()=>{if(!disposed){native.zoom_to_board();native.draw();}};
    // The method is real in this pinned upstream snapshot, but not promised by
    // the public alpha embedding API. See docs/PCB-VIEWER.md before upgrading.
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{fit();resolve();})));
    const dispose=()=>{observer.disconnect();signal.removeEventListener('abort',remove);remove();};
    signal.addEventListener('abort',()=>observer.disconnect(),{once:true});
    return{fit,reset:()=>{native.select(null);fit();},toggleLayers:()=>sidebar.toggleAttribute('collapsed'),dispose};
  }catch(error){signal.removeEventListener('abort',remove);remove();throw error;}
}
