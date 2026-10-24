import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { site } from '@/data/site';
import { PCBAnimatedBackground } from '@/components/backgrounds/PCBAnimatedBackground';
import './globals.css';
import './workspace.css';
import './reference.css';
import './pcb-ambient.css';
export const metadata: Metadata = { metadataBase: new URL(site.url), title: { default: 'Hardware Lab — Engineering in every layer', template: '%s | Hardware Lab' }, description: site.description, alternates: { canonical: '/' }, openGraph: { title: site.name, description: site.description, type: 'website', images: [{ url: '/assets/social.png', width: 1200, height: 630, alt: 'Hardware Lab engineering studio' }] }, robots: process.env.NEXT_PUBLIC_SITE_URL ? { index: true, follow: true } : { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><head><link rel="preload" href="/assets/fonts/montserrat-900.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/><link rel="preload" href="/assets/fonts/montserrat-400.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/><link rel="preload" href="/assets/fonts/pacifico-400.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></head><body><PCBAnimatedBackground/><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}


