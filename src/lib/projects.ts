import { z } from 'zod';
import seeds from '../../data/example-projects.json';
import { categories, statuses } from './catalog';
export { categories, statuses, label, filterBoards } from './catalog';
const localAsset = z.string().regex(/^\/assets\/[\w/.-]+$/).refine(value => !value.includes('..'));
const image = z.object({ src: localAsset, alt: z.string().min(10), type: z.enum(['render', 'photo', 'diagram']) });
export const boardSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(3), summary: z.string().min(10), description: z.string().min(20),
  category: z.enum(categories), status: z.enum(statuses), featured: z.boolean(), published: z.boolean(), disclaimer: z.string(),
  heroImage: image, gallery: z.array(image).min(1), personal: z.boolean().default(false), scope: z.array(z.string()).default([]), techStack: z.array(z.string()).default([]),
  specs: z.array(z.object({ label: z.string(), value: z.string() })), features: z.array(z.string()),
  components: z.array(z.object({ designator: z.string(), quantity: z.number().int().positive(), manufacturer: z.string().optional(), mpn: z.string().optional(), description: z.string() })).optional(),
  stackup: z.array(z.object({ layer: z.string(), type: z.string(), thicknessMm: z.number().positive().optional(), material: z.string().optional() })).optional(),
  files: z.array(z.object({ label: z.string(), href: localAsset, kind: z.enum(['pdf', 'zip', 'step', 'gerber', 'other']) })).optional(),
  interactiveBom: z.object({ src: localAsset.regex(/\.html$/), title: z.string().min(3) }).optional(),
  repoUrl: z.url().refine(url => url.startsWith('https://')).optional(),
});
export type Board = z.infer<typeof boardSchema>;
export const boards: Board[] = seeds.map(seed => {
  const media = { src: `/assets/projects/personal/${seed.slug}.webp`, alt: `${seed.name}: original PCB project image supplied by Hoàng Duy`, type: 'render' as const };
  return boardSchema.parse({ ...seed, heroImage: media, gallery: [media], specs: [] });
}).filter(board => board.published);
if (new Set(boards.map(board => board.slug)).size !== boards.length) throw new Error('Duplicate board slug');
export function getBoard(slug: string) { return boards.find(board => board.slug === slug); }

