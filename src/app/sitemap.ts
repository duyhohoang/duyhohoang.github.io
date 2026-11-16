import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { boards } from '@/lib/projects';
import { portfolio } from '@/data/portfolio';
import { documentationArticles } from '@/data/documentation';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/workspace/', '/firmware/', '/dashboard/', ...boards.map(board=>"/dashboard/"+board.slug+"/"), '/capabilities/', '/workflow/', '/about/', '/contact/', '/privacy/', '/documentation/', ...documentationArticles.map(article=>`/documentation/article/${article.slug}/`), ...boards.map(board=>`/projects/${board.slug}/`), ...portfolio.map(item=>`/portfolio/${item.slug}/`)].map(path=>({url:new URL(path,site.url).href}));
}

