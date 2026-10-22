'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { transientAnimation, motionTiming } from '@/lib/animations';
import { useReducedMotion } from './useReducedMotion';

export function useAnimatedPanel<T>(initial:T){
  const [value,setValue]=useState(initial);
  const panelRef=useRef<HTMLDivElement>(null);
  const stop=useRef<(()=>void)|null>(null);
  const beforeHeight=useRef<number|null>(null);
  const reduced=useReducedMotion();
  useLayoutEffect(()=>{
    const element=panelRef.current;
    if(!element||beforeHeight.current===null)return;
    const start=beforeHeight.current,end=element.getBoundingClientRect().height;
    beforeHeight.current=null;
    if(reduced)return;
    element.style.overflow='hidden';
    stop.current=transientAnimation(element,{opacity:[0,1],height:[start+'px',end+'px']},
      {duration:.28,ease:motionTiming.ease},()=>element.style.removeProperty('overflow'));
    return ()=>{stop.current?.();element.style.removeProperty('overflow');};
  },[value,reduced]);
  useLayoutEffect(()=>()=>stop.current?.(),[]);
  function select(next:T){
    const element=panelRef.current;
    stop.current?.();
    if(next===value)return;
    if(reduced||!element){setValue(next);return;}
    beforeHeight.current=element.getBoundingClientRect().height;
    stop.current=transientAnimation(element,{opacity:[1,0]},{duration:.12,ease:'easeOut'},()=>setValue(next));
  }
  return {value,select,panelRef};
}
