'use client';
import {useEffect,useRef} from 'react';

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
 </div>;
}
