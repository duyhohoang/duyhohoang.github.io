'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function usePortfolioMotion(){
  const scope=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    const root=scope.current;
    if(!root)return;
    root.dataset.enhanced='true';
    return ()=>{delete root.dataset.enhanced;};
  },[]);
  useEffect(()=>{
    const root=scope.current;
    if(!root||reduced)return;
    // Only group-level targets: avoid simultaneous parent/child transforms and
    // repeated WAAPI allocations while scrolling. CSS handles interpolation.
    const targets=new Set<HTMLElement>();
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        const element=entry.target as HTMLElement;
        if(entry.isIntersecting)element.dataset.scrollState='visible';
        else if(entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? innerHeight)-1){
          element.dataset.scrollState='hidden';
        }
        // Content above the viewport remains visible when scrolling down.
      }
    },{threshold:0,rootMargin:'0px 0px -32px 0px'});
    function register(){
      for(const element of targets){
        if(!element.isConnected){observer.unobserve(element);targets.delete(element);}
      }
      const siblings=new Map<Element|null,number>();
      const selector='.ref-heading,.ref-trust > p,.ref-tools,.ref-stats > div,.ref-case,.ref-projects:not(.ref-extra) > a,.ref-services article,.ref-about > figure,.ref-about > div,.ref-capabilities article,.ref-tabs,.ref-timeline article,.ref-work article,.ref-faq details,.ref-contact > div,.ref-contact > form';
      root!.querySelectorAll<HTMLElement>(selector).forEach(element=>{
        const index=siblings.get(element.parentElement)||0;
        siblings.set(element.parentElement,index+1);
        if(targets.has(element))return;
        targets.add(element);
        element.dataset.scrollReveal='true';
        element.style.setProperty('--reveal-delay',Math.min(index*.07,.14)+'s');
        observer.observe(element);
      });
    }
    const focus=(event:FocusEvent)=>{
      (event.target as HTMLElement).closest<HTMLElement>('[data-scroll-reveal]')?.setAttribute('data-scroll-state','visible');
    };
    root.addEventListener('focusin',focus);
    register();
    const mutations=new MutationObserver(records=>{if(records.some(record=>Array.from(record.addedNodes).some(node=>node.nodeType===Node.ELEMENT_NODE)))register();});
    mutations.observe(root,{childList:true,subtree:true});
    root.dataset.motionReady='true';
    return ()=>{
      observer.disconnect();
      mutations.disconnect();
      root.removeEventListener('focusin',focus);
      for(const element of targets){
        delete element.dataset.scrollReveal;
        delete element.dataset.scrollState;
        element.style.removeProperty('--reveal-delay');
      }
      targets.clear();
      delete root.dataset.motionReady;
    };
  },[reduced]);
  return scope;
}





