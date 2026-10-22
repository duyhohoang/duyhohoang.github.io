import fs from 'node:fs';
import path from 'node:path';

// Next.js 16.4 on Windows can retain directory separators inside segment keys.
// Preserve the generated files and add aliases matching the browser's flat URLs.
const root=path.resolve('out');
function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
const aliases=[];
for(const file of files(root)){
  const parts=path.relative(root,file).split(path.sep);
  const index=parts.findIndex(part=>part.startsWith('__next.'));
  if(index<0||index===parts.length-1||!file.endsWith('.txt'))continue;
  const target=path.join(root,...parts.slice(0,index),parts.slice(index).join('.'));
  fs.copyFileSync(file,target);
  aliases.push({from:path.relative(root,file),to:path.relative(root,target)});
}
fs.writeFileSync('docs/export-compatibility.json',JSON.stringify({platform:process.platform,aliases},null,2)+'\n');
console.log(`Static export compatibility: ${aliases.length} segment aliases created.`);
