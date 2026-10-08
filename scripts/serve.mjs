import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';

const root=resolve(import.meta.dirname,'../dist');
const port=Number(process.env.SICHER_PORT||4174);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const route=decodeURIComponent(url.pathname);
  if(route==='/copy-of-window-solutions'||route==='/copy-of-window-solutions/') {res.writeHead(301,{Location:'/stainless-steel-benches'});res.end();return;}
  let file=resolve(root,'.'+route);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
  if((await stat(file)).isDirectory()) file=resolve(file,'index.html');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 } catch {
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
  try {res.end(await readFile(resolve(root,'404.html')));}catch {res.end('Page not found');}
 }
});
server.listen(port,'0.0.0.0',()=>console.log(`Local: http://localhost:${port}`));
process.on('SIGTERM',()=>server.close());
process.on('SIGINT',()=>server.close(()=>process.exit()));
