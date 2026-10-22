'use client';
import {useEffect,type RefObject} from 'react';

/** Clip the lower arms inside the pink ring, while allowing the head above it.
 * Measure layout only on resize, never during scrolling/animation frames. */
export function usePortraitClip(scope:RefObject<HTMLDivElement|null>){
  useEffect(()=>{
    const art=scope.current?.querySelector<HTMLElement>('.ref-hero-art');
    const window=art?.querySelector<HTMLElement>('.ref-portrait-window');
    const circle=art?.querySelector<HTMLElement>('.ref-circle');
    if(!art||!window||!circle)return;
    function update(){
      const width=art!.clientWidth,outer=circle!.offsetWidth/2;
      const radius=Math.max(0,outer-5);
      const cx=width/2-window!.offsetLeft,cy=art!.clientHeight-outer-window!.offsetTop;
      const path=`M0 0H${window!.clientWidth}V${cy}H${cx+radius}A${radius} ${radius} 0 0 1 ${cx-radius} ${cy}H0Z`;
      window!.style.setProperty('--portrait-clip',`path("${path}")`);
    }
    update();
    const observer=new ResizeObserver(update);
    observer.observe(art);observer.observe(circle);observer.observe(window);
    return ()=>{observer.disconnect();window.style.removeProperty('--portrait-clip');};
  },[scope]);
}
