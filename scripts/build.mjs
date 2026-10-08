import {mkdir, rm, cp, writeFile, readFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {document,home,esc} from '../src/templates.mjs';
import {about,catalogue,productPage,capabilityPage,industryPage,blogPage,articlePage,contactPage,privacyPage,notFound} from '../src/pages.mjs';
import {products,articles,company} from '../src/content.mjs';

const root=resolve(import.meta.dirname,'..');
const base=process.env.SICHER_SITE_URL || 'https://www.sicherengineering.in';
await rm(resolve(root,'dist'),{recursive:true,force:true});
await mkdir(resolve(root,'dist'),{recursive:true});
await cp(resolve(root,'public'),resolve(root,'dist'),{recursive:true});
const pages=[
 {path:'/',title:'Sheet Metal Fabrication & Railway Systems',description:'Sicher Engineering manufactures sheet metal components, door systems, lavatory fittings, windows and stainless steel benches in Ambala, Haryana.',body:home(),active:'home'},
 {path:'/about-us',title:'Company & History',description:'About Sicher Engineering India Pvt. Ltd., established in 2019 near Ambala, Haryana. Company history, mission and manufacturing expertise.',body:about(),active:'about'},
 {path:'/products',title:'Products & Engineered Systems',description:'Explore Sicher’s automated doors, lavatory components, pivoted doors, windows and stainless steel benches, with specifications and material options.',body:catalogue(),active:'products'},
 ...products.map(p=>({path:'/'+p.slug,title:p.title,description:p.summary,body:productPage(p),active:'products'})),
 {path:'/capabilities',title:'Manufacturing Capabilities',description:'CNC laser cutting, bending, hydraulic pressing, TIG/MIG/ARC and laser welding, electropolishing and sheet metal fabrication.',body:capabilityPage(),active:'capabilities'},
 {path:'/industries',title:'Industries & Applications',description:'Products and fabrication for railway and metro systems, electrical manufacturing, industrial facilities and public infrastructure.',body:industryPage(),active:'industries'},
 {path:'/blog',title:'Fabrication & Procurement Insights',description:'Practical articles on sheet metal fabrication, materials, drawings and procurement from Sicher Engineering’s existing knowledge library.',body:blogPage(),active:'blog'},
 ...articles.map(a=>({path:'/post/'+a.slug,title:a.title,description:a.summary,body:articlePage(a),active:'blog',structured:{'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.summary,datePublished:a.date,...(a.updated?{dateModified:a.updated}:{}),author:{'@type':'Organization',name:company.name},publisher:{'@type':'Organization',name:company.name,logo:{'@type':'ImageObject',url:base+'/assets/logo.png'}},mainEntityOfPage:base+'/post/'+a.slug}})),
 {path:'/contact-us',title:'Contact & Request a Quote',description:'Contact Sicher Engineering in Ambala, Haryana. Call +91 70820 03485, review contact information or prepare a product or fabrication enquiry.',body:contactPage(),active:'contact'},
 {path:'/privacy',title:'Privacy & Enquiry Information',description:'How enquiry drafts, files, cookies and external services are handled on the Sicher Engineering website.',body:privacyPage()},
];
for(const page of pages){
 const out=resolve(root,'dist',page.path.slice(1),'index.html');
 await mkdir(dirname(out),{recursive:true});
 await writeFile(out,document({...page,base}));
}
await writeFile(resolve(root,'dist/404.html'),document({title:'Page Not Found',description:'Browse Sicher Engineering products or contact the team.',path:'/404',body:notFound(),base}));
await mkdir(resolve(root,'dist/copy-of-window-solutions'),{recursive:true});
await writeFile(resolve(root,'dist/copy-of-window-solutions/index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Stainless Steel Benches | Sicher Engineering</title><link rel="canonical" href="${base}/stainless-steel-benches"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/stainless-steel-benches"></head><body><a href="/stainless-steel-benches">View Stainless Steel Benches</a></body></html>`);
await writeFile(resolve(root,'dist/_redirects'),'/copy-of-window-solutions /stainless-steel-benches 301\n/copy-of-window-solutions/ /stainless-steel-benches 301\n');
await writeFile(resolve(root,'dist/page-inventory.json'),JSON.stringify(pages.map(({path,title})=>({path,title})),null,2));
await writeFile(resolve(root,'dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${base}${p.path}</loc></url>`).join('')}</urlset>`);
await writeFile(resolve(root,'dist/robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
await mkdir(resolve(root,'dist/vendor'),{recursive:true});
await cp(resolve(root,'node_modules/three/build/three.module.js'),resolve(root,'dist/vendor/three.module.js'));
await cp(resolve(root,'node_modules/three/build/three.core.js'),resolve(root,'dist/vendor/three.core.js'));
await cp(resolve(root,'node_modules/three/LICENSE'),resolve(root,'dist/vendor/THREE-LICENSE.txt'));
console.log(`Built ${pages.length} static pages in ${resolve(root,'dist')}`);
