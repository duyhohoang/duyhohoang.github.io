'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { transientAnimation, motionTiming } from '@/lib/animations';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const navigation=['About','Case Studies','Projects','Resume','Contact'];
const sectionId=(name:string)=>name.toLowerCase().replace(' ','-');
const sectionHref=(name:string)=>'/#'+sectionId(name);

export function Header(){
  const pathname=usePathname();
  const active=useActiveSection(pathname==='/');
  const reduced=useReducedMotion();
  const menuId=useId();
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const stop=useRef<(()=>void)|null>(null);
  const previousOverflow=useRef('');
  const closing=useRef(false);
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    const d=dialog.current;
    if(d?.open)d.close();
  },[pathname]);
  useEffect(()=>{
    const element=dialog.current;
    return ()=>{
      stop.current?.();
      if(element?.open)document.body.style.overflow=previousOverflow.current;
    };
  },[]);
  useEffect(()=>{
    const desktop=window.matchMedia('(min-width:800px)');
    const resize=()=>{if(desktop.matches)dialog.current?.close();};
    desktop.addEventListener('change',resize);
    return ()=>desktop.removeEventListener('change',resize);
  },[]);
  useEffect(()=>{
    if(reduced){stop.current?.();if(closing.current)dialog.current?.close();}
  },[reduced]);
  function open(){
    const element=dialog.current;
    if(!element)return;
    stop.current?.();
    closing.current=false;
    previousOverflow.current=document.body.style.overflow;
    element.showModal();
    document.body.style.overflow='hidden';
    setMenuOpen(true);
    if(!reduced)stop.current=transientAnimation(element,{opacity:[0,1],translate:['0px 14px','0px 0px']},
      {duration:.24,ease:motionTiming.ease});
  }
  function close(){
    const element=dialog.current;
    if(!element?.open)return;
    closing.current=true;
    stop.current?.();
    if(reduced){element.close();return;}
    stop.current=transientAnimation(element,{opacity:[1,0],translate:['0px 0px','0px 10px']},
      {duration:.16,ease:'easeOut'},()=>element.close());
  }
  function trapFocus(event:KeyboardEvent<HTMLDialogElement>){
    if(event.key!=='Tab')return;
    const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'));
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand" title="Hoàng Duy home"><span className="brand-wordmark"><em>H</em>oàng <em>D</em>uy</span></Link>
    <nav aria-label="Main navigation" className="desktop-nav">
      {navigation.map(name=><Link aria-current={pathname==='/'&&active===sectionId(name)?'location':undefined} key={name} href={sectionHref(name)}>{name}</Link>)}
      <Link href="/#contact" className="nav-hire">Hire Me</Link>
    </nav>
    <button ref={trigger} className="menu-trigger" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls={menuId} aria-label="Open navigation menu" onClick={open}>Menu <span aria-hidden="true">☰</span></button>
    <dialog id={menuId} ref={dialog} className="mobile-menu" aria-label="Navigation" onKeyDown={trapFocus}
      onCancel={event=>{event.preventDefault();close();}}
      onClose={()=>{closing.current=false;stop.current?.();setMenuOpen(false);document.body.style.overflow=previousOverflow.current;trigger.current?.focus({preventScroll:true});}}
      onClick={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="menu-content"><button className="menu-close" onClick={close}>Close <span aria-hidden="true">×</span></button>
        <nav aria-label="Mobile navigation">{['Home',...navigation].map((name,index)=><Link key={name} onClick={close} href={index===0?'/':sectionHref(name)}><span>0{index+1}</span>{name}<span aria-hidden="true">↗</span></Link>)}
          <Link href="/#contact" onClick={close} className="nav-hire">Hire Me</Link>
        </nav><p>HARDWARE / FIRMWARE / INTERFACES</p>
      </div>
    </dialog>
  </div></header>;
}


