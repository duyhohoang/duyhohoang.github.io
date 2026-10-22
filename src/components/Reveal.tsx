'use client';
import { LazyMotion, m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
const loadFeatures = () => import('./motion-features').then(module => module.default);
export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <LazyMotion features={loadFeatures} strict><m.div initial={false} whileInView={reduced ? undefined : { opacity: [0.6, 1], y: [18, 0] }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>{children}</m.div></LazyMotion>;
}
