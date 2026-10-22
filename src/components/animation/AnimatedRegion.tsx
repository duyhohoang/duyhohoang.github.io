'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { reveal } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Grid tracks interpolate intrinsic height without measuring or fixing the final layout. */
export function AnimatedRegion({open,id,children}:{open:boolean;id:string;children:ReactNode}){
  const ref=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(!open||reduced||!ref.current)return;
    const stop=Array.from(ref.current.querySelectorAll<HTMLElement>('.ref-extra > a'))
      .map((element,index)=>reveal(element,{y:18,delay:index*.08}));
    return ()=>stop.forEach(cancel=>cancel());
  },[open,reduced]);
  return <div id={id} ref={ref} className="motion-collapse" data-open={open} aria-hidden={!open} inert={!open}>
    <div className="motion-collapse-inner">{children}</div>
  </div>;
}
