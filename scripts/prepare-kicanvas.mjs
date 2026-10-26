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
// KiCad 10 exposed tracks use (layers "B.Cu" "B.Mask") rather than
// (layer "B.Cu"). Preserve the actual layer list and mask expansion; retain
// legacy single-layer segments/arcs without changing any PCB source geometry.
function replaceOnce(before,after){
  if(source.split(before).length!==2)throw new Error('Upstream track implementation changed: '+before.slice(0,70));
  source=source.replace(before,()=>after);
}
for(const kind of ['LineSegment','ArcSegment']){
  const end=')))}static{c(this,"'+kind+'")}';
  const begin=source.lastIndexOf('Object.assign(this,V(',source.indexOf(end));
  const finish=source.indexOf(end,begin)+end.length;
  const original=source.slice(begin,finish);
  if(begin<0||!original.includes('a.pair("layer",R.string)'))throw new Error('Track parser changed');
  const updated=original.replace('a.pair("layer",R.string),','a.pair("layer",R.string),a.list("layers",R.string),a.pair("solder_mask_margin",R.number),').replace(')))}static', ')));this.layer??=this.layers?.find(layer=>layer.endsWith(".Cu"));}static');
  replaceOnce(original,updated);
}
replaceOnce('c(this,"TraceSegmentPainter")}layers_for(t){return[t.layer]}','c(this,"TraceSegmentPainter")}layers_for(t){return t.layers??[t.layer]}');
replaceOnce('c(this,"TraceArcPainter")}layers_for(t){return[t.layer]}','c(this,"TraceArcPainter")}layers_for(t){return t.layers??[t.layer]}');
replaceOnce('let i=[r.start,r.end];this.gfx.line(new x(i,r.width,t.color))','let i=[r.start,r.end],w=Math.max(0,r.width+(t.name.endsWith(".Mask")?2*(r.solder_mask_margin??0):0));if(w>0)this.gfx.line(new x(i,w,t.color))');
replaceOnce('let i=q.from_three_points(r.start,r.mid,r.end,r.width),n=i.to_polyline();this.gfx.line(new x(n,i.width,t.color))','let w=Math.max(0,r.width+(t.name.endsWith(".Mask")?2*(r.solder_mask_margin??0):0));if(w<=0)return;let i=q.from_three_points(r.start,r.mid,r.end,w),n=i.to_polyline();this.gfx.line(new x(n,i.width,t.color))');
fs.writeFileSync('public/assets/vendor/kicanvas/kicanvas.js',source);
console.log('Prepared pinned KiCanvas: local icon font and inert SVG icon href initialization. KiCad 10 exposed-track layers and mask margins supported.');
