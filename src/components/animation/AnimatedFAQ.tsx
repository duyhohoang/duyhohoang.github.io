'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { motionTiming, transientAnimation } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AnimatedFAQ({question,answer}:{question:string;answer:string}){
  const id=useId();
  const detail=useRef<HTMLDetailsElement>(null);
  const stop=useRef<(()=>void)|null>(null);
  const desired=useRef(false);
  const [expanded,setExpanded]=useState<boolean|undefined>(undefined);
  const reduced=useReducedMotion();
  useEffect(()=>()=>stop.current?.(),[]);
  useEffect(()=>{if(reduced&&detail.current){stop.current?.();detail.current.open=desired.current;detail.current.style.removeProperty("overflow");}},[reduced]);
  function toggle(){
    const element=detail.current;
    if(!element)return;
    const start=element.getBoundingClientRect().height;
    stop.current?.();
    if(expanded===undefined)desired.current=element.open;
    desired.current=!desired.current;
    setExpanded(desired.current);
    if(reduced){
      element.open=desired.current;
      return;
    }
    element.open=true;
    const end=desired.current?element.scrollHeight:element.querySelector('summary')!.getBoundingClientRect().height+1;
    element.style.overflow='hidden';
    stop.current=transientAnimation(element,{height:[start+'px',end+'px']},
      {duration:motionTiming.accordion,ease:'easeOut'},()=>{
        element.open=desired.current;
        element.style.removeProperty('overflow');
      });
  }
  return <details ref={detail}>
    <summary aria-expanded={expanded} aria-controls={id} onClick={event=>{event.preventDefault();toggle();}}>
      {question}<span aria-hidden="true">⌄</span>
    </summary>
    <div id={id} className="faq-answer" aria-hidden={expanded===undefined?undefined:!expanded} inert={expanded===undefined?undefined:!expanded}><p>{answer}</p></div>
  </details>;
}

