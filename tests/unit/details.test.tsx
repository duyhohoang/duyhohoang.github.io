import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { FeatureTabs, BomTable } from '../../src/components/BoardDetails';
import { boards } from '../../src/lib/projects';
test('all seed detail views render meaningful content and omit absent technical tabs', () => { for (const board of boards) { const html = renderToStaticMarkup(<FeatureTabs board={board} />); assert(html.includes('The system study')); assert(html.includes('role="tablist"')); assert(!html.includes('>Components</button>')); assert(!html.includes('>Stackup</button>')); assert(!html.includes('download=')); } });
test('BOM table sorts designators naturally and handles absent optional columns', () => { const html = renderToStaticMarkup(<BomTable components={[{ designator: 'R10', quantity: 1, description: 'Ten' }, { designator: 'R2', quantity: 2, description: 'Two' }]} />); assert(html.indexOf('>R2<') < html.indexOf('>R10<')); assert(html.includes('Not specified')); assert(html.includes('aria-sort="ascending"')); });
