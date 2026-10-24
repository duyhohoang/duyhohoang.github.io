'use client';
import {useEffect,useRef} from 'react';

const traces=[
 'M-10 54 H135 L176 95 H390 L430 55 H620',
 'M-10 200 H105 L151 154 H310 L365 209 H620',
 'M480 -10 V80 L448 112 V180 L510 242',
 'M220 -10 V45 L262 87 V260',
 'M-10 116 H60 L91 147',
];
const nodes=[[176,95],[390,95],[151,154],[448,112]];

/** A single, persistent decorative layer. CSS owns every animation frame. */
export function PCBAnimatedBackground(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const update=()=>{if(ref.current)ref.current.dataset.paused=String(document.hidden);};
  update();document.addEventListener('visibilitychange',update);
  return ()=>document.removeEventListener('visibilitychange',update);
 },[]);
 return <div ref={ref} className="pcb-ambient" aria-hidden="true">
  <div className="pcb-ambient-grid"/>
  <div className="pcb-ambient-glow"/>
  <svg className="pcb-ambient-circuits" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" focusable="false">
   <g className="pcb-ambient-traces">{traces.map(d=><path key={d} d={d}/>)}</g>
   <g className="pcb-ambient-signals"><path className="pcb-ambient-pulse" d={traces[0]}/><path className="pcb-ambient-pulse pcb-ambient-pulse-second" d={traces[1]}/></g>
   <g className="pcb-ambient-nodes">{nodes.map(([cx,cy])=><circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3"/>)}</g>
  </svg>
 </div>;
}
