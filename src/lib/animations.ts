import { animate } from 'motion/mini';

export const motionTiming = {
  reveal: .7,
  stagger: .1,
  disclosure: .3,
  accordion: .2,
  ease: [.22, 1, .36, 1] as [number, number, number, number],
};

/** Transient animations restore their original inline styles, including on cancellation.
 * Individual CSS translate/scale preserve the reference layout's existing transforms. */
export function transientAnimation(
  element: HTMLElement,
  keyframes: Parameters<typeof animate>[1],
  options: Parameters<typeof animate>[2] = {},
  complete?: () => void,
) {
  const properties = Object.keys(keyframes);
  const original = properties.map(name => [name, element.style.getPropertyValue(name)] as const);
  let cancelled = false;
  element.dataset.motionActive = 'true';
  const controls = animate(element, keyframes, options);
  function restore() {
    for (const [name,value] of original) {
      if(value)element.style.setProperty(name,value);
      else element.style.removeProperty(name);
    }
    delete element.dataset.motionActive;
  }
  void Promise.resolve(controls).then(() => {
    if(cancelled)return;
    cancelled=true;
    controls.cancel();
    restore();
    complete?.();
  });
  return () => {
    if(cancelled)return;
    cancelled=true;
    controls.cancel();
    restore();
  };
}

export function reveal(
  element: HTMLElement,
  {delay=0,x=0,y=28,scale=false,onComplete}:{delay?:number;x?:number;y?:number;scale?:boolean;onComplete?:()=>void} = {},
) {
  return transientAnimation(element, {
    opacity: [0,1],
    translate: [x+'px '+y+'px','0px 0px'],
    ...(scale ? {scale:[.97,1]} : {}),
  }, {duration:motionTiming.reveal,delay,ease:motionTiming.ease},onComplete);
}
