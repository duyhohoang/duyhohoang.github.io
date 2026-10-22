import type { Board } from './projects';
export const categories = ['industrial-iot', 'embedded', 'power', 'interface', 'test-equipment', 'other'] as const;
export const statuses = ['concept', 'in-progress', 'prototype', 'validated'] as const;
export function label(value: string) { return value.split('-').map(part => part === 'iot' ? 'IoT' : part[0].toUpperCase() + part.slice(1)).join(' '); }
export function filterBoards(collection: Board[], query = '', category = '', status = '') {
  const search = query.trim().toLocaleLowerCase('en');
  return collection.filter(board => (!search || `${board.name} ${board.summary} ${board.description}`.toLocaleLowerCase('en').includes(search)) && (!category || board.category === category) && (!status || board.status === status));
}
