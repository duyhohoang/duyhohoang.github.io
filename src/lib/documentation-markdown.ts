export type DocumentationHeading = { id: string; text: string; level: number };
export function slugHeading(text: string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
export function markdownHeadings(source: string): DocumentationHeading[] {
  return source.split('\n').flatMap(line => {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    return match ? [{ id: slugHeading(match[2]), text: match[2].replace(/[*`]/g, ''), level: match[1].length }] : [];
  });
}
