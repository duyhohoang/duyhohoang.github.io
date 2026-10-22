import Link from 'next/link';
import type { ReactNode } from 'react';

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="button" href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}
export function SectionHeading({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><div className="eyebrow"><span aria-hidden="true" />{label}</div><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
export function ContactCTA() {
  return <section className="contact-cta container"><div className="eyebrow">YOUR NEXT CHALLENGE</div><h2>LET’S BUILD<br />SOMETHING REAL.</h2><div className="cta-bottom"><p>From the first question to the final fabrication handoff.<br />A considered approach to every connection.</p><Button href="/contact/">Start a conversation</Button></div></section>;
}
