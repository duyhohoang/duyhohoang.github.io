import fs from 'node:fs';
import crypto from 'node:crypto';
const input=process.argv[2];
if(!input)throw new Error('Usage: node scripts/prepare-kicanvas.mjs <official-kicanvas.js>');
let source=fs.readFileSync(input,'utf8');
const expected='ca910f25276c3efb9aacb3a5d6341d4d9af4736d4c875fb0440d2cc856865ab7';
if(crypto.createHash('sha256').update(source).digest('hex')!==expected)throw new Error('Unrecognized KiCanvas snapshot. Review the adapter before updating.');
const font='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&family=Nunito:wght@300;400;500;600;700&display=swap';
source=source.replace(font,'/assets/vendor/kicanvas/fonts.css');
// Upstream's template placeholder in SVG <use href> briefly starts an invalid
// network request when its template is imported into the document. Set the
// identical real sprite href after creating the <use>, avoiding that 404.
const icon='return f`<svg viewBox="0 0 48 48" width="48">\n                <use xlink:href="${r}" />\n            </svg>`';
if(!source.includes(icon))throw new Error('Upstream icon markup changed.');
source=source.replace(icon,'let i=f`<svg viewBox="0 0 48 48" width="48"><use /></svg>`;i.querySelector("use").setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",r);return i');
fs.writeFileSync('public/assets/vendor/kicanvas/kicanvas.js',source);
console.log('Prepared pinned KiCanvas: local icon font and inert SVG icon href initialization. PCB parser/renderer unchanged.');
