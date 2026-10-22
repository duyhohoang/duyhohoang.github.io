'use client';
import { useEffect, useState } from 'react';
import { BoardCard } from './BoardCard';
import { categories, statuses, filterBoards, label } from '@/lib/catalog';
import type { Board } from '@/lib/projects';
type Filters = { q: string; category: string; status: string };
const empty: Filters = { q: '', category: '', status: '' };
export function BoardCatalog({ boards }: { boards: Board[] }) {
  const [filters, setFilters] = useState<Filters>(empty);
  useEffect(() => {
    function read() {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category') || '', status = params.get('status') || '';
      setFilters({ q: params.get('q') || '', category: categories.some(value => value === category) ? category : '', status: statuses.some(value => value === status) ? status : '' });
    }
    read(); window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  function change(next: Filters) {
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value) params.set(key, value); });
    window.history.replaceState(null, '', window.location.pathname + (params.size ? '?' + params.toString() : ''));
  }
  const results = filterBoards(boards, filters.q, filters.category, filters.status);
  return <div className="catalog container"><div className="catalog-top"><h2>FEATURED BOARD STUDIES</h2><p role="status" aria-live="polite">{results.length} of {boards.length} {boards.length === 1 ? 'board' : 'boards'}</p></div><div className="filters" role="search" aria-label="Filter boards"><label>Search boards<input type="search" value={filters.q} onChange={event => change({ ...filters, q: event.target.value })} placeholder="Search by name or description" /></label><label>Category<select value={filters.category} onChange={event => change({ ...filters, category: event.target.value })}><option value="">All categories</option>{categories.map(value => <option key={value} value={value}>{label(value)}</option>)}</select></label><label>Status<select value={filters.status} onChange={event => change({ ...filters, status: event.target.value })}><option value="">All statuses</option>{statuses.map(value => <option key={value} value={value}>{label(value)}</option>)}</select></label><button className="button" onClick={() => change(empty)}>Clear filters <span aria-hidden="true">×</span></button></div>{results.length ? <div className="board-grid">{results.map((board, index) => <BoardCard board={board} index={index} key={board.slug} />)}</div> : <div className="empty-state"><h2>No matching boards</h2><p>Try another search or clear your filters to see every study.</p><button className="button" onClick={() => change(empty)}>Clear all filters</button></div>}<p className="disclosure">Personal projects by Hoàng Duy, using original project images. Detailed test results and manufacturing status are not published.</p></div>;
}
