import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { boards } from '@/lib/projects';
import { portfolio } from '@/data/portfolio';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/workspace/', '/firmware/', '/dashboard/', ...boards.map(board=>"/dashboard/"+board.slug+"/"), '/boards/', '/capabilities/', '/workflow/', '/about/', '/contact/', '/privacy/', ...boards.map(board=>`/boards/${board.slug}/`), ...portfolio.map(item=>`/portfolio/${item.slug}/`)].map(path=>({url:new URL(path,site.url).href}));
}

