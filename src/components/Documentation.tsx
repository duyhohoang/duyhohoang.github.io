'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { articleHref, categoryFor, documentationArticles, documentationCategories, searchDocumentation, type DocumentationArticle } from '@/data/documentation';
import { slugHeading } from '@/lib/documentation-markdown';

type HeadingItem = { id: string; text: string; level: number };

function Inline({ text }: { text: string }) {
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return <>{pieces.map((piece, index) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(piece);
    if (link) {
      const match = documentationArticles.find(article => link[2].endsWith(article.file.split('/').at(-1)!));
      return <Link key={index} href={match ? articleHref(match.slug) : link[2]}>{link[1]}</Link>;
    }
    if (piece.startsWith('**') && piece.endsWith('**')) return <strong key={index}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith('`') && piece.endsWith('`')) return <code key={index}>{piece.slice(1, -1)}</code>;
    return piece;
  })}</>;
}

function ArticleImage({ alt, source, caption, onZoom }: { alt: string; source: string; caption: string; onZoom: (item: { alt: string; source: string; caption: string }) => void }) {
  const placeholder = source.startsWith('placeholder:');
  return <figure className="docs-figure">
    <button className={`docs-image-frame${placeholder ? ' is-placeholder' : ''}`} onClick={() => onZoom({ alt, source, caption })} aria-label={`Open image: ${caption}`}>
      {placeholder ? <><span className="docs-image-icon" aria-hidden="true">▧</span><span className="docs-placeholder-label">IMAGE PLACEHOLDER</span><strong>{caption}</strong><small>Replace in article Markdown when the illustration is ready</small></> : <Image src={source} alt={alt} width={1000} height={620} sizes="(max-width: 900px) 100vw, 760px"/>}
      <span className="docs-zoom-hint">⌕ &nbsp; View</span>
    </button>
    <figcaption>{caption}</figcaption>
  </figure>;
}

function ArticleBody({ source, onZoom }: { source: string; onZoom: (item: { alt: string; source: string; caption: string }) => void }) {
  const lines = source.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      const Tag = heading[1].length === 2 ? 'h2' : 'h3';
      blocks.push(<Tag id={slugHeading(heading[2])} key={`h-${i}`}>{heading[2]}</Tag>); i++; continue;
    }
    if (line.startsWith('```')) {
      const kind = line.slice(3).trim(); i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i++;
      blocks.push(kind === 'formula' ? <div className="docs-formula" role="math" key={`f-${i}`}><span>DESIGN RELATION</span>{code.map((entry, index) => <code key={index}>{entry}</code>)}</div> : <pre key={`c-${i}`}><code>{code.join('\n')}</code></pre>); continue;
    }
    const image = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/.exec(line);
    if (image) { blocks.push(<ArticleImage key={`img-${i++}`} alt={image[1]} source={image[2]} caption={image[3] || image[1]} onZoom={onZoom}/>); continue; }
    if (line.startsWith('> ')) {
      const text = line.slice(2).replace(/^\*\*(.+?)\*\*:?\s*/, '');
      const kind = /\*\*(Engineering note|Warning|Design note):?\*\*/.exec(line)?.[1]?.toLowerCase().replace(' ', '-') || 'note';
      blocks.push(<aside className={`docs-callout ${kind}`} key={`q-${i++}`}><span>{kind.replace('-', ' ')}</span><p><Inline text={text}/></p></aside>); continue;
    }
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i++].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
        if (!row.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(row);
      }
      const [head, ...body] = rows;
      blocks.push(<div className="docs-table-wrap" key={`t-${i}`}><table><thead><tr>{head?.map((cell, index) => <th key={index}><Inline text={cell}/></th>)}</tr></thead><tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index}><Inline text={cell}/></td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s/, ''));
      blocks.push(<ul key={`ul-${i}`}>{items.map((item, index) => <li key={index}><Inline text={item}/></li>)}</ul>); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s/, ''));
      blocks.push(<ol key={`ol-${i}`}>{items.map((item, index) => <li key={index}><Inline text={item}/></li>)}</ol>); continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|> |\||[-*]\s|\d+\.\s|!\[)/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
    blocks.push(<p key={`p-${i}`}><Inline text={paragraph.join(' ')}/></p>);
  }
  return <div className="docs-prose">{blocks}</div>;
}

function DocsSidebar({ active }: { active?: string }) {
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const matches = query.trim() ? searchDocumentation(query) : [];
  useEffect(() => { const shortcut = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchInput.current?.focus(); } }; window.addEventListener('keydown', shortcut); return () => window.removeEventListener('keydown', shortcut); }, []);
  return <aside className="docs-sidebar">
    <Link href="/documentation/" className="docs-sidebar-home"><span>⌂</span> Documentation home</Link>
    <label className="docs-search-label"><span>SEARCH THE LIBRARY</span><span className="docs-search-box"><b aria-hidden="true">⌕</b><input ref={searchInput} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search topics…" aria-label="Search documentation"/><kbd>Ctrl K</kbd></span></label>
    {query && <div className="docs-search-results" role="status">{matches.length ? matches.map(article => <Link key={article.slug} href={articleHref(article.slug)}>{article.title}</Link>) : <span>No matching articles</span>}</div>}
    <nav aria-label="Documentation sections" className="docs-tree">{documentationCategories.map(category => {
      const articles = documentationArticles.filter(article => article.category === category.id);
      return <details key={category.id} open={articles.some(article => article.slug === active) || undefined}>
        <summary><span>{category.icon}</span><b>{category.title}</b><i>{category.topics.length}</i></summary>
        <div className="docs-tree-group">{[...new Set(articles.map(article => article.group))].map(group => <div key={group}><small>{group}</small>{articles.filter(article => article.group === group).map(article => <Link key={article.slug} href={articleHref(article.slug)} aria-current={active === article.slug ? 'page' : undefined}>{article.title}</Link>)}</div>)}
          <span className="docs-coming-soon">More topics in this section are being documented.</span>
        </div>
      </details>;
    })}</nav>
    <div className="docs-sidebar-foot"><span className="docs-status-dot"/> ENGINEERING KNOWLEDGE BASE <small>Built for practical hardware design</small></div>
  </aside>;
}

function ThemeControl({ theme, toggle }: { theme: string; toggle: () => void }) { return <button className="docs-theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle documentation theme">{theme === 'dark' ? '☼' : '☾'}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button>; }
function useDocsTheme() {
  const theme = useSyncExternalStore(
    listener => { window.addEventListener('storage', listener); window.addEventListener('engineering-docs-theme-change', listener); return () => { window.removeEventListener('storage', listener); window.removeEventListener('engineering-docs-theme-change', listener); }; },
    () => window.localStorage.getItem('engineering-docs-theme') === 'light' ? 'light' : 'dark',
    () => 'dark',
  );
  function toggle() { const next = theme === 'dark' ? 'light' : 'dark'; window.localStorage.setItem('engineering-docs-theme', next); window.dispatchEvent(new Event('engineering-docs-theme-change')); }
  return { theme, toggle };
}

export function DocumentationHome() {
  const { theme, toggle } = useDocsTheme();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => searchDocumentation(query), [query]);
  return <div className="docs-shell" data-theme={theme}>
    <div className="docs-home-wrap"><div className="docs-home-top"><Link href="/" className="docs-back-link">← Portfolio</Link><ThemeControl theme={theme} toggle={toggle}/></div>
      <section className="docs-hero"><span className="docs-eyebrow"><i/> ENGINEERING KNOWLEDGE BASE <b>·</b> VERSION 1.0</span><h1>Electronics Engineering <em>Documentation</em></h1><p>Learn, understand and design electronic hardware — from circuit fundamentals to manufacturable PCB layouts.</p><label className="docs-hero-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search circuits, components, layout…" aria-label="Search technical documentation"/><kbd>SEARCH</kbd></label><div className="docs-hero-meta"><span>04 STARTER ARTICLES</span><span>THEORY · SCHEMATIC · LAYOUT · COMPONENTS</span></div></section>
      {query ? <section className="docs-home-section"><div className="docs-section-head"><div><span className="docs-overline">LIBRARY SEARCH</span><h2>Search results</h2></div><span>{filtered.length} ARTICLES</span></div><ArticleCards articles={filtered}/></section> : <>
        <section className="docs-home-section"><div className="docs-section-head"><div><span className="docs-overline">EXPLORE THE LIBRARY</span><h2>Four connected disciplines.</h2></div><span>01 — 04</span></div><div className="docs-category-grid">{documentationCategories.map((category, index) => <article key={category.id} className="docs-category-card"><span className="docs-card-index">0{index + 1} / {category.short}</span><span className="docs-category-icon" aria-hidden="true">{category.icon}</span><h3>{category.title}</h3><p>{category.description}</p><div>{category.topics.slice(0, 4).map(topic => <span key={topic}>{topic}</span>)}</div><small>{documentationArticles.filter(article => article.category === category.id).length} ARTICLES · EXPANDING LIBRARY</small></article>)}</div></section>
        <section className="docs-home-section docs-featured-section"><div className="docs-section-head"><div><span className="docs-overline">START WITH THE FOUNDATIONS</span><h2>Featured topics</h2></div><span>CURATED STARTING POINTS</span></div><ArticleCards articles={documentationArticles.filter(article => article.featured)}/></section>
        <section className="docs-home-section docs-recent-section"><div className="docs-section-head"><div><span className="docs-overline">RECENTLY UPDATED</span><h2>New in the library</h2></div><span>UPDATED NOV 2026</span></div><ArticleCards articles={[...documentationArticles].slice(0, 3)}/></section>
        <section className="docs-popular"><span className="docs-overline">POPULAR TOPICS</span><div>{['Buck converter','MOSFET datasheet','PCB stack-up','Grounding techniques','Resistor selection','EMI / EMC'].map(item => <button key={item} onClick={() => setQuery(item)}>{item} <span>↗</span></button>)}</div></section>
      </>}
      <footer className="docs-home-footer"><span>HOÀNG DUY <i>·</i> ELECTRONICS ENGINEERING</span><span>REFERENCE CONTENT IS A STARTING POINT — VERIFY AGAINST COMPONENT DATA SHEETS AND FABRICATOR GUIDANCE.</span></footer>
    </div>
  </div>;
}

function ArticleCards({ articles }: { articles: DocumentationArticle[] }) {
  if (!articles.length) return <div className="docs-empty">No articles match that search. Try a component or design topic.</div>;
  return <div className="docs-article-grid">{articles.map(article => <Link className="docs-article-card" href={articleHref(article.slug)} key={article.slug}><span className="docs-article-category">{categoryFor(article.category)?.short} <i>·</i> {article.group}</span><h3>{article.title}</h3><p>{article.description}</p><span className="docs-card-footer"><small>{article.level} <i>·</i> {article.readTime}</small><b aria-hidden="true">↗</b></span></Link>)}</div>;
}

export function DocumentationArticlePage({ article, markdown, headings, previous, next }: { article: DocumentationArticle; markdown: string; headings: HeadingItem[]; previous?: DocumentationArticle; next?: DocumentationArticle }) {
  const { theme, toggle } = useDocsTheme();
  const [zoom, setZoom] = useState<{ alt: string; source: string; caption: string } | null>(null);
  const [activeHeading, setActiveHeading] = useState('');
  const zoomDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const nodes = headings.map(heading => document.getElementById(heading.id)).filter((node): node is HTMLElement => !!node);
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (visible) setActiveHeading(visible.target.id); }, { rootMargin: '-14% 0px -72% 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);
  useEffect(() => { if (zoom && zoomDialog.current && !zoomDialog.current.open) zoomDialog.current.showModal(); else if (!zoom && zoomDialog.current?.open) zoomDialog.current.close(); }, [zoom]);
  const cat = categoryFor(article.category)!;
  return <div className="docs-shell docs-article-shell" data-theme={theme}>
    <div className="docs-layout"><DocsSidebar active={article.slug}/><main className="docs-article-main"><div className="docs-article-toolbar"><details className="docs-mobile-sidebar"><summary>☰ &nbsp; Contents and sections</summary><DocsSidebar active={article.slug}/></details><ThemeControl theme={theme} toggle={toggle}/></div>
        <nav className="docs-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/documentation/">Documentation</Link><span>/</span><span>{cat.title}</span></nav>
        <header className="docs-article-header"><div className="docs-article-meta"><span>{cat.short}</span><i>·</i><span>{article.group}</span><i>·</i><span>{article.level}</span><i>·</i><span>{article.readTime} READ</span></div><h1>{article.title}</h1><p>{article.description}</p><div className="docs-author-line"><span className="docs-author-mark">HD</span><span>HOÀNG DUY <small>UPDATED {article.updated.toUpperCase()}</small></span><span className="docs-article-saved">ENGINEERING NOTE</span></div></header>
        <ArticleBody source={markdown} onZoom={setZoom}/>
        <section className="docs-related"><span className="docs-overline">CONTINUE LEARNING</span><h2>Related articles</h2><ArticleCards articles={documentationArticles.filter(item => item.slug !== article.slug && (item.category === article.category || item.featured)).slice(0, 3)}/></section>
        <nav className="docs-prev-next" aria-label="Article navigation">{previous ? <Link href={articleHref(previous.slug)}><small>← PREVIOUS ARTICLE</small><b>{previous.title}</b></Link> : <span/>}{next ? <Link href={articleHref(next.slug)}><small>NEXT ARTICLE →</small><b>{next.title}</b></Link> : <span/>}</nav>
      </main><aside className="docs-right-rail"><div className="docs-toc"><span className="docs-overline">ON THIS PAGE</span><nav aria-label="On this page">{headings.map(heading => <a key={heading.id} href={`#${heading.id}`} className={`${heading.level === 3 ? 'is-nested' : ''}${activeHeading === heading.id ? ' is-active' : ''}`}>{heading.text}</a>)}</nav></div><div className="docs-right-note"><span>DESIGN PRACTICE</span><p>Confirm component limits and recommended circuits in the original manufacturer documentation.</p><Link href="/documentation/">Browse the full library →</Link></div></aside></div>
    <dialog ref={zoomDialog} className="docs-zoom-dialog" aria-label="Image detail" onClose={() => setZoom(null)} onClick={event => { if (event.target === event.currentTarget) setZoom(null); }}><button className="docs-zoom-close" onClick={() => setZoom(null)} aria-label="Close image view">×</button>{zoom && <>{zoom.source.startsWith('placeholder:') ? <div className="docs-zoom-placeholder"><span>▧</span><small>IMAGE PLACEHOLDER</small><strong>{zoom.caption}</strong><p>Replace this reference slot with the relevant engineering illustration when available.</p></div> : <Image src={zoom.source} alt={zoom.alt} width={1400} height={900}/>}<p>{zoom.caption}</p></>}</dialog>
  </div>;
}
