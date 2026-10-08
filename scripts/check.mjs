import {readFile,stat,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {products,articles} from '../src/content.mjs';

const root=resolve(import.meta.dirname,'../dist');
const pages=JSON.parse(await readFile(resolve(root,'page-inventory.json'),'utf8'));
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
const htmls=new Map();
for(const p of pages)htmls.set(p.path,await readFile(resolve(root,'.'+p.path,'index.html'),'utf8'));
for(const [path,html] of htmls){
 const label=path+': ';
 assert((html.match(/<h1[ >]/g)||[]).length===1,label+'Expected one H1');
 assert((html.match(/<main[ >]/g)||[]).length===1,label+'Expected one main landmark');
 assert(/<html lang="en-IN"/.test(html),label+'Missing document language');
 assert(/name="viewport"/.test(html),label+'Missing responsive viewport');
 assert(/<title>[^<]+<\/title>/.test(html),label+'Missing title');
 assert(/name="description" content="[^"]+"/.test(html),label+'Missing description');
 assert(/rel="canonical" href="https:\/\//.test(html),label+'Missing absolute canonical');
 assert(/property="og:image"/.test(html),label+'Missing Open Graph image');
 assert(/href="#main"/.test(html),label+'Missing skip link');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert(new Set(ids).size===ids.length,label+'Duplicate element IDs');
 for(const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  try{const data=JSON.parse(script[1]);assert(!!data['@type'],label+'Missing schema type');}catch{errors.push(label+'Invalid structured JSON');}
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g)){
  assert(/\balt="[^"]*"/.test(img[0]),label+'Image without alt');
  if(/src="\/assets\//.test(img[0]))assert(/width="\d+"/.test(img[0])&&/height="\d+"/.test(img[0]),label+'Image without dimensions');
 }
 for(const a of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
  const href=a[1].replaceAll('&amp;','&');
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,'https://local.test'+path);
  const target=url.pathname==='/'?'/':url.pathname.replace(/\/$/,'');
  const targetHtml=htmls.get(target);
  if(!targetHtml){errors.push(label+'Broken internal link '+href);continue;}
  if(url.hash)assert(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),label+'Broken anchor '+href);
 }
 for(const attr of html.matchAll(/\b(?:src|href)="(\/[^"?#]+)"/g)){
  const value=attr[1];if(htmls.has(value)||htmls.has(value.replace(/\/$/,'')))continue;
  try{await stat(resolve(root,'.'+value));}catch{errors.push(label+'Missing asset '+value);}
 }
 for(const labelMatch of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g))assert(ids.includes(labelMatch[1]),label+'Label has no associated field');
 assert(!/revolutionising|redefining|unlocking possibilities|transformative solutions|cutting-edge innovation|seamless solutions|future-ready|next-generation|innovation meets excellence|pushing boundaries|empowering businesses|engineered for tomorrow|limitless possibilities/i.test(html),label+'Promotional cliché found');
}
for(const p of products){
 const html=htmls.get('/'+p.slug);
 assert(html.includes('Technical specifications'),p.slug+': Missing specifications');
 for(const section of ['overview','applications','specifications','materials','manufacturing','standards','gallery'])assert(html.includes(`id="${section}"`),p.slug+': Missing '+section);
 assert((html.match(/<tr>/g)||[]).length>=p.specs.length+2,p.slug+': Incomplete technical tables');
 assert(html.includes('/contact-us?product='+p.slug+'#rfq'),p.slug+': Product RFQ is not preselected');
}
for(const a of articles)assert(htmls.get('/post/'+a.slug).includes('"@type":"Article"'),a.slug+': Missing article schema');
const contact=htmls.get('/contact-us');
assert(contact.includes('info@sicherengineering.in')&&contact.includes('info@sicherenginnering.in'),'Email discrepancy lost');
assert(contact.includes('disabled'),'Forms should be disabled before JS handles submit');
const css=await readFile(resolve(root,'site.css'),'utf8');
assert(!/backdrop-filter/i.test(css),'Avoid unnecessary filter cost in the immersive layout');
assert(css.includes('prefers-reduced-motion'),'Missing reduced-motion handling');
assert(css.includes('focus-visible'),'Missing keyboard focus styles');
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
assert((sitemap.match(/<loc>/g)||[]).length===pages.length,'Sitemap page count mismatch');
assert((await readFile(resolve(root,'_redirects'),'utf8')).includes('/copy-of-window-solutions /stainless-steel-benches 301'),'Missing legacy benches redirect');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else{
 console.log(`Passed: ${pages.length} pages; local links and anchors, assets, SEO/schema, product tables, form associations and content checks.`);
}
