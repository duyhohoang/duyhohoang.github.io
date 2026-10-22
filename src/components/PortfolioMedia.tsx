import Image from 'next/image';
import { getTool } from '@/data/tools';
import { PortfolioArt } from './PortfolioArt';
export function PortfolioMedia({ slug, kind }: { slug: string; kind: string }) {
  const tool = getTool(slug);
  return tool ? <div className="tool-image"><Image src={tool.image} width={tool.width} height={tool.height} alt={tool.alt} sizes="(max-width: 639px) 100vw, 50vw" /></div> : <PortfolioArt kind={kind} />;
}
