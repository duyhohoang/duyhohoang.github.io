'use client';
import { useEffect, useState } from 'react';
export function useActiveSection(enabled:boolean){
  const [active,setActive]=useState<string|null>(null);
  useEffect(()=>{
    if(!enabled)return;
    const sections=Array.from(document.querySelectorAll<HTMLElement>(
      '#case-studies,#projects,#about,#resume,#contact'));
    let frame=0;
    const update=()=>{
      frame=0;
      const reached=sections.filter(section=>section.getBoundingClientRect().top<=innerHeight*.35);
      setActive(reached.at(-1)?.id||null);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[enabled]);
  return active;
}
