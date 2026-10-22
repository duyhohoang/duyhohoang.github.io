import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('out');
function walk(directory) { return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]); }
const pages=walk(root).filter(file=>file.endsWith('.html'));
for(const file of walk(root).filter(file=>file.endsWith('.txt'))){
  const parts=path.relative(root,file).split(path.sep),index=parts.findIndex(part=>part.startsWith('__next.'));
  if(index>=0&&index<parts.length-1)assert(fs.existsSync(path.join(root,...parts.slice(0,index),parts.slice(index).join('.'))),'Missing flat prefetch alias for '+file);
}
let links=0,images=0;
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  assert.match(html,/<html[^>]+lang="en"/,file+' language');
  assert.equal((html.match(/<main(?:\s|>)/g)||[]).length,1,file+' main landmark');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file+' primary heading');
  assert(!html.includes('contact@antmicro.com'),file+' reference contact');
  for(const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*\b(?:href|src)="([^"]+)"[^>]*>/g)){
    const value=match[1].replaceAll('&amp;','&');
    assert(value!=='#','Fake CTA');
    if(value.startsWith('#')){assert(html.includes(`id="${value.slice(1)}"`),'Missing anchor '+value);continue;}
    if(/^(?:https?:|mailto:|data:|blob:)/.test(value))continue;
    const urlPath=decodeURIComponent(value.split(/[?#]/)[0]);
    const target=urlPath.startsWith('/')?path.resolve(root,'.'+urlPath):path.resolve(path.dirname(file),urlPath);
    assert(target===root||target.startsWith(root+path.sep),'Unsafe exported link '+value);
    assert(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),`${path.relative(root,file)} broken URL ${value}`);
    links++;
  }
  for(const match of html.matchAll(/<img\b[^>]*>/g)){assert(/\balt="[^"]+"/.test(match[0]),file+' image alt');images++;}
}
for(const route of ['','boards','about','capabilities','workflow','contact','privacy','boards/iot-board','boards/esp32-plc','boards/6-fan-control','boards/esp32-datalogger','boards/esp32-devkit'])assert(fs.existsSync(path.join(root,route,'index.html')),'Missing route '+route);
for(const name of ['sitemap.xml','robots.txt','404.html','assets/social.png'])assert(fs.existsSync(path.join(root,name)),'Missing '+name);
const report={date:new Date().toISOString(),pages:pages.length,internalReferences:links,images,passed:true};
fs.writeFileSync('docs/export-check.json',JSON.stringify(report,null,2)+'\n');
console.log(report);
