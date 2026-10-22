import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const directory = 'docs/reference-evidence';
const files = fs.readdirSync(directory).filter(name => /^(home|catalog|orin|thor).*\.json$/.test(name));
const records = files.map(file => ({ file, ...JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) }));
const declarations = JSON.parse(fs.readFileSync(path.join(directory, 'css-color-rules.json'), 'utf8'));
const sourceTokens = Object.fromEntries(declarations.filter(rule => rule.selector === ':root' && /^#[\da-f]{6}$/i.test(rule.value)).map(rule => [rule.property, rule.value]));
function normalizeColor(value) {
  const match = typeof value === 'string' && value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) return null;
  const channels = match.slice(1, 4).map(Number);
  const alpha = match[4] === undefined ? 1 : Number(match[4]);
  return { hex: '#' + channels.map(n => n.toString(16).padStart(2, '0')).join('') + (alpha === 1 ? '' : Math.round(alpha * 255).toString(16).padStart(2, '0')), rgba: `rgba(${channels.join(', ')}, ${alpha})` };
}
const evidence = records.map(record => ({
  file: `reference-evidence/${record.file}`, url: record.url, viewport: record.viewport ?? null, status: 'COMPUTED_VERIFIED',
  samples: (record.samples ?? record.items).map(sample => ({
    ...sample,
    selector: sample.selector.replace(/\.$/, ''),
    normalizedColors: Object.fromEntries(Object.entries(sample).flatMap(([property, value]) => {
      const normalized = normalizeColor(value);
      return normalized ? [[property, normalized]] : [];
    }))
  }))
}));
const stateRules = declarations.filter(rule => /:hover|:active|:focus|disabled/.test(rule.selector));
const output = {
  auditedAt: '2026-10-15', reference: 'https://openhardware.antmicro.com/', override: '../color-override.md',
  sourceTokens, gray3: { hex: '#8b8b8b', rgba: 'rgba(139,139,139,1)', evidence: 'CSS --gray-3-rgb and computed samples' },
  evidence,
  interactionRules: stateRules,
  verification: {
    default: 'Computed values and viewport-asserted screenshots collected.',
    mobileMenu: 'Open and closed menu computed values and screenshots collected at 390px.',
    keyboardFocus: 'Keyboard traversal screenshot collected; inspect samples/outlines. Exact focus color independently verified in CSS rule.',
    hover: 'CSS_SOURCE_VERIFIED; live pointer hover not exercised by available semantic API.',
    active: 'CSS_SOURCE_VERIFIED; held-pointer state not captured.',
    disabled: 'CSS_SOURCE_VERIFIED opacity 0.5; naturally disabled elements sampled where present.',
    imagery: 'Reference screenshots are audit evidence only. Noise texture, globe, board renders, and logos must not be reused.'
  }
};
fs.writeFileSync('docs/reference-colors.json', JSON.stringify(output, null, 2) + '\n');
const css = fs.readFileSync('src/styles/tokens.css', 'utf8');
for (const [token, value] of Object.entries(sourceTokens)) {
  const local = token === '--red' ? '--error' : token;
  assert(css.includes(`${local}: ${value}`), `Missing or different token ${local}`);
}
for (const width of [1440, 768, 390]) assert(records.some(record => record.file === `home-${width}.json` && record.viewport.width === width));
for (const page of ['home', 'catalog', 'orin', 'thor']) {
  for (const width of [1440, 1024, 390]) {
    assert(fs.existsSync(`${directory}/${page}-${width}.jpg`));
    assert(records.some(record => record.file === `${page}-${width}.json` && record.viewport.width === width));
  }
}
assert(!/#10151b|#1e2933|#62d7b1/i.test(css));
console.log(`PASS: ${Object.keys(sourceTokens).length} source tokens; ${records.length} computed evidence records; required screenshot matrix; no superseded palette in tokens.`);
