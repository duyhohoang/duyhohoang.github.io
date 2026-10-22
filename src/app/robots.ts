import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', ...(process.env.NEXT_PUBLIC_SITE_URL ? { allow: '/' } : { disallow: '/' }) }, sitemap: new URL('/sitemap.xml',site.url).href }; }
