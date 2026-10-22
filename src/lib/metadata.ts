import type { Metadata } from 'next';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | Hardware Lab`, description, images: [{ url: '/assets/social.png', width: 1200, height: 630, alt: 'Hardware Lab — Engineering in every layer' }] } };
}
