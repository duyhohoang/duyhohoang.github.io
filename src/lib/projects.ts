import { z } from 'zod';
import seeds from '../../data/example-projects.json';
import { categories, statuses } from './catalog';
import { projectIllustrations } from '@/data/portfolio-media';
export { categories, statuses, label, filterBoards } from './catalog';
const localAsset = z.string().regex(/^\/assets\/[\w/.-]+$/).refine(value => !value.includes('..'));
const image = z.object({ src: localAsset, alt: z.string().min(10), type: z.enum(['render', 'photo', 'diagram']) });
export const boardSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(3), summary: z.string().min(10), description: z.string().min(20),
  category: z.enum(categories), status: z.enum(statuses), featured: z.boolean(), published: z.boolean(), disclaimer: z.string(),
  heroImage: image, gallery: z.array(image).min(1),
  specs: z.array(z.object({ label: z.string(), value: z.string() })), features: z.array(z.string()),
  components: z.array(z.object({ designator: z.string(), quantity: z.number().int().positive(), manufacturer: z.string().optional(), mpn: z.string().optional(), description: z.string() })).optional(),
  stackup: z.array(z.object({ layer: z.string(), type: z.string(), thicknessMm: z.number().positive().optional(), material: z.string().optional() })).optional(),
  files: z.array(z.object({ label: z.string(), href: localAsset, kind: z.enum(['pdf', 'zip', 'step', 'gerber', 'other']) })).optional(),
  repoUrl: z.url().refine(url => url.startsWith('https://')).optional(),
});
export type Board = z.infer<typeof boardSchema>;
const studies = [
  { image: 'controller', summary: 'An illustrative industrial controller study, exploring connected monitoring and system interfaces.', description: 'A system study for an industrial IoT controller. The concept explores how sensing, communication and control can be brought into one documented platform. Component selection, electrical specifications and manufacturing details require owner verification.', features: ['Connected monitoring architecture study', 'Industrial communication interface planning', 'Serviceable system and enclosure considerations'] },
  { image: 'io', summary: 'A connected I/O concept for exploring remote sensing, monitoring and control.', description: 'An illustrative connected I/O platform concept. The study considers a modular approach to remote monitoring and control, with clear boundaries between processing, communication and external interfaces. No electrical performance or released hardware is claimed.', features: ['Remote monitoring use-case exploration', 'Analog and digital interface planning', 'Modular application architecture'] },
  { image: 'fan', summary: 'A six-channel fan-control concept focused on PWM control and tachometer monitoring.', description: 'An illustrative fan-controller concept for exploring six control channels and tachometer monitoring. Channel circuitry, operating limits, component choices and board construction remain to be verified before implementation.', features: ['Six-channel control concept', 'PWM and tachometer monitoring study', 'Fault and system feedback planning'] },
];
export const boards: Board[] = seeds.map((seed, index) => {
  const study = studies[index];
  const media = { src: projectIllustrations[study.image], alt: `${seed.name}: AI-generated hardware concept render, not a validated PCB design`, type: 'render' as const };
  return boardSchema.parse({ ...seed, summary: study.summary, description: study.description, featured: true, heroImage: media, gallery: [media, { src: '/assets/blocks.svg', alt: 'Illustrative system architecture diagram; not a project-specific schematic', type: 'diagram' }], specs: [], features: study.features });
}).filter(board => board.published);
if (new Set(boards.map(board => board.slug)).size !== boards.length) throw new Error('Duplicate board slug');
export function getBoard(slug: string) { return boards.find(board => board.slug === slug); }

