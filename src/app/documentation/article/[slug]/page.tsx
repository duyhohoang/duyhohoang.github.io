import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { documentationArticles, getDocumentationArticle } from '@/data/documentation';
import { DocumentationArticlePage } from '@/components/Documentation';
import { markdownHeadings } from '@/lib/documentation-markdown';

export const dynamicParams = false;
export function generateStaticParams() { return documentationArticles.map(article => ({ slug: article.slug })); }
function readArticle(slug: string) {
  const article = getDocumentationArticle(slug);
  if (!article) return null;
  return { article, markdown: readFileSync(join(process.cwd(), 'documentation', article.file), 'utf8') };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = readArticle(slug);
  if (!data) return { title: 'Article not found' };
  return { title: data.article.title, description: data.article.description, alternates: { canonical: `/documentation/article/${slug}/` }, openGraph: { title: data.article.title, description: data.article.description, type: 'article', publishedTime: data.article.updated } };
}
export default async function DocumentationArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readArticle(slug);
  if (!data) notFound();
  const index = documentationArticles.findIndex(article => article.slug === slug);
  return <DocumentationArticlePage article={data.article} markdown={data.markdown} headings={markdownHeadings(data.markdown)} previous={documentationArticles[index - 1]} next={documentationArticles[index + 1]}/>;
}
