'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AnimatedCounter({text}:{text:string}){
  const ref=useRef<HTMLSpanElement>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    const element=ref.current,match=text.match(/^(\d[\d,]*)(.*)$/);
    if(!element||!match||reduced)return;
    let frame=0;
    const target=Number(match[1].replaceAll(',','')),suffix=match[2];
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      const start=performance.now();
      function tick(now:number){
        const progress=Math.min(1,(now-start)/800),value=Math.round(target*(1-(1-progress)**3));
        element!.textContent=(match![1].includes(',')?value.toLocaleString('en-US'):String(value))+suffix;
        if(progress<1)frame=requestAnimationFrame(tick);
        else element!.textContent=text;
      }
      frame=requestAnimationFrame(tick);
    },{threshold:.5});
    observer.observe(element);
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);element.textContent=text;};
  },[text,reduced]);
  if(!/^\d[\d,]*/.test(text))return text;
  return <span role="img" aria-label={text}><span aria-hidden="true" ref={ref}>{text}</span></span>;
}
