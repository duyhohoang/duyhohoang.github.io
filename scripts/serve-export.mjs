import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
const root=path.resolve('out');
const cache=new Map();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.woff2':'font/woff2','.ico':'image/x-icon'};
const server=http.createServer((request,response)=>{
  let filename;
  try{filename=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));}catch{response.writeHead(400).end();return;}
  if(filename!==root&&!filename.startsWith(root+path.sep)){response.writeHead(403).end();return;}
  if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
  const exists=fs.existsSync(filename)&&fs.statSync(filename).isFile();
  if(!exists)filename=path.join(root,'404.html');
  if(!fs.existsSync(filename)){response.writeHead(404).end('Build the static export first.');return;}
  const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Vary':'Accept-Encoding'};
  let data;
  const compressible=/\.(html|js|css|json|txt|xml|svg|ttf)$/.test(filename);
  const accepted=request.headers['accept-encoding']||'';
  const encoding=compressible&&accepted.includes('br')?'br':compressible&&accepted.includes('gzip')?'gzip':'';
  const stat=fs.statSync(filename),key=filename+':'+stat.mtimeMs+':'+encoding;
  if(cache.has(key))data=cache.get(key);
  else {data=fs.readFileSync(filename);if(encoding==='br')data=brotliCompressSync(data,{params:{[constants.BROTLI_PARAM_QUALITY]:5}});else if(encoding==='gzip')data=gzipSync(data);cache.set(key,data);}
  if(encoding)headers['Content-Encoding']=encoding;
  headers['Content-Length']=data.length;
  response.writeHead(exists?200:404,headers);
  if(request.method==='HEAD')response.end();else response.end(data);
});
server.listen(3001,'127.0.0.1',()=>console.log('Static production preview: http://127.0.0.1:3001'));
