import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { FeatureTabs, BomTable, BoardProjectDetails } from '../../src/components/BoardDetails';
import { boards } from '../../src/lib/projects';
test('detail tabs expose the requested documentation sections',()=>{for(const board of boards){const html=renderToStaticMarkup(<FeatureTabs board={board}/>);for(const title of ['Key Features','Block Diagram','Stackup','Preview','BOM'])assert(html.includes('>'+title+'</button>'));assert(!html.includes('>Overview</button>'));assert(!html.includes('>Files</button>'));assert(html.includes(board.features[0]));}});

test('overview is in the hero with explicit current and demo revision choices',()=>{const html=renderToStaticMarkup(<BoardProjectDetails board={boards[0]}/>);assert(html.indexOf('>Overview</h2>')<html.indexOf('role="tablist"'));assert(html.includes('Main · Current'));assert(html.includes('Rev 1.1 · Demo'));assert(html.includes('Board status'));assert(!html.includes('download='));});

test('BOM table sorts designators naturally and handles absent optional columns', () => { const html = renderToStaticMarkup(<BomTable components={[{ designator: 'R10', quantity: 1, description: 'Ten' }, { designator: 'R2', quantity: 2, description: 'Two' }]} />); assert(html.indexOf('>R2<') < html.indexOf('>R10<')); assert(html.includes('Not specified')); assert(html.includes('aria-sort="ascending"')); });
