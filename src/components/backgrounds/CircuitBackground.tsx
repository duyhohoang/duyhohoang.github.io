'use client';
import {useEffect,useId,useRef} from 'react';

// Deterministic routes: no random hydration differences or frame-driven React state.
const routes=[
  'M0 70H140L180 110H300V170H390',
  'M0 95H120L160 135H245V220H355',
  'M70 0V30L100 60H210L250 100H350',
  'M450 0V55L490 95H570V145H680',
  'M1000 60H860L820 100H730V180H650',
  'M1000 85H885L845 125H770V210H695',
  'M1000 300H910L860 250H790V285H710',
  'M1000 330H900L840 270H800',
  'M0 350H120L165 305H260V270H360',
  'M0 375H145L190 330H280V300H405',
  'M500 400V355L540 315H610V255H680',
  'M1000 390H950V365L925 340H880',
];
const pads=[[390,170],[355,220],[350,100],[680,145],[650,180],[695,210],[710,285],[800,270],[360,270],[405,300],[680,255],[880,340]];
export function CircuitBackground({variant='hero'}:{variant?:'hero'|'transition'|'contact'}){
  const ref=useRef<HTMLElement>(null),id=useId().replace(/:/g,'');
  useEffect(()=>{
    const layer=ref.current;
    if(!layer)return;
    let visible=false;
    const preference=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 799px)');
    const update=()=>{layer.dataset.running=String(visible&&!document.hidden&&!preference.matches&&!mobile.matches);};
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;update();});
    observer.observe(layer);
    document.addEventListener('visibilitychange',update);
    preference.addEventListener('change',update);mobile.addEventListener('change',update);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);preference.removeEventListener('change',update);mobile.removeEventListener('change',update);};
  },[]);
  return <aside ref={ref} className={`circuit-background circuit-${variant}`} aria-hidden="true" data-running={variant==='hero'?'true':'false'}>
    <svg viewBox="0 0 1000 400" preserveAspectRatio="none" focusable="false">
      <defs><pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#aaa" strokeOpacity=".025" strokeWidth=".5"/></pattern></defs>
      <rect width="1000" height="400" fill={`url(#${id}-grid)`}/>
      <g className="circuit-traces">{routes.map((d,i)=><path key={d} d={d} className={i%3?'circuit-detail':''}/>)}</g>
      <g className="circuit-pads">{pads.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3?2:4} className={i%3?'circuit-detail':''}/>)}</g>
      <g className="circuit-signals">{[0,4,8].map((route,i)=><path key={route} d={routes[route]} pathLength="100" className={`circuit-signal signal-${i}`}/>)}</g>
    </svg>
  </aside>;
}
