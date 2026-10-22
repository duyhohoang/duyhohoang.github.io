import type { ReactNode } from 'react';
const drawings:Record<string,ReactNode>={
'ϟ':<path d="m13 2-9 12h7l-1 8 10-12h-8z"/>,
'♡':<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
'♧':<path d="M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7z"/>,
'↔':<><path d="M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 0 0 7 7l2-2"/></>,
'▱':<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/></>,
'◇':<><path d="m2 9 10-5 10 5-10 5zM6 11v6c4 3 8 3 12 0v-6M22 9v8"/></>,
'⌕':<><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></>,
'◎':<><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/></>,
'✧':<><path d="m9 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1"/></>
};
export function ReferenceIcon({symbol}:{symbol:string}){return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[symbol]||drawings['♧']}</svg>}
