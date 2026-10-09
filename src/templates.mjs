import {company, products, capabilities, milestones, articles} from './content.mjs';
import {readFileSync} from 'node:fs';
const assetMetadata=new Map(JSON.parse(readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8')).map(asset=>[asset.name,asset]));
const loadingScript=readFileSync(new URL('./loading.js',import.meta.url),'utf8');

export const esc = (value='') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const arrow = '<span aria-hidden="true">&rarr;</span>';
export const link = (href, text, cls='text-link') => `<a class="${cls}" href="${esc(href)}">${esc(text)} ${arrow}</a>`;
export const image = (name, alt, cls='', priority=false, sizes='(max-width: 680px) calc(100vw - 40px), (max-width: 1050px) 50vw, 600px') => {
  const [width,height]=assetMetadata.get(name).dimensions;
  const smallWidth=assetMetadata.get(name).smallDimensions[0];
  return `<img class="${cls}" src="/assets/${name}.webp" srcset="/assets/${name}-small.webp ${smallWidth}w, /assets/${name}.webp ${width}w" sizes="${sizes}" alt="${esc(alt)}" width="${width}" height="${height}" ${priority?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
};

export function header(active='') {
  const item = (url, title, key) => `<a href="${url}" ${active===key?'aria-current="page"':''}>${title}</a>`;
  return `<a class="skip-link" href="#main">Skip to content</a>
  <div class="utility"><div class="container"><span>Shahzadpur, Ambala · Haryana, India</span><a href="tel:${company.tel}">${company.phone}</a></div></div>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="/" aria-label="Sicher Engineering home"><img src="/assets/logo.png" width="165" height="47" alt="Sicher Engineering"></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-controls="main-navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav id="main-navigation" aria-label="Main navigation">
      ${item('/', 'Home','home')}${item('/about-us','Company','about')}
      <div class="product-navigation">${item('/products','Products','products')}<button class="product-toggle" aria-label="Show product categories" aria-controls="product-menu" aria-expanded="false"><svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
      <div class="product-menu" id="product-menu" hidden><span class="menu-label">Product range</span>${products.map(p=>`<a href="/${p.slug}">${esc(p.title)} ${arrow}</a>`).join('')}<a class="menu-all" href="/products">View all products ${arrow}</a></div></div>
      ${item('/capabilities','Capabilities','capabilities')}${item('/industries','Industries','industries')}${item('/blog','Insights','blog')}${item('/contact-us','Contact','contact')}
      <a class="button button-small nav-rfq" href="/contact-us#rfq">Request a Quote</a>
    </nav>
  </div></header>`;
}

export function footer() {
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-company"><a href="/" aria-label="Sicher Engineering home"><img src="/assets/logo.png" alt="Sicher Engineering" width="165" height="47"></a><p>Sheet metal fabrication and engineered systems for railways, electrical and infrastructure applications.</p><span class="legal-name">${company.name}</span></div>
    <div><h2>Company</h2><a href="/about-us">About Sicher</a><a href="/capabilities">Manufacturing capabilities</a><a href="/industries">Industries & applications</a><a href="/blog">Insights</a></div>
    <div><h2>Products</h2>${products.map(p=>`<a href="/${p.slug}">${p.title}</a>`).join('')}</div>
    <div class="footer-contact"><h2>Contact</h2><address>${company.address}</address><a href="tel:${company.tel}">${company.phone}</a><a href="mailto:${company.footerEmail}">${company.footerEmail}</a><a class="footer-email-note" href="/contact-us#email-details">View contact details & email clarification ${arrow}</a></div>
  </div><div class="container footer-bottom"><span>© 2026 ${company.name}</span><a href="/privacy">Privacy & enquiry information</a><a href="#top">Back to top ↑</a></div></footer>`;
}

export function cta(title='Discuss your product or fabrication requirement.', text='Share your application, drawings and quantities with our team.',href='/contact-us#rfq') {
  return `<section class="cta-section"><div class="container cta-inner"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><a class="button button-light" href="${esc(href)}">Request a Quote ${arrow}</a></div></section>`;
}

export function breadcrumb(items) {
  return `<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items.map(([name,url])=>`<li>${url?`<a href="${url}">${esc(name)}</a>`:`<span aria-current="page">${esc(name)}</span>`}</li>`).join('')}</ol></nav>`;
}

export function productTile(p, index=0) {
  return `<article class="product-item"><a class="product-image-link" href="/${p.slug}" aria-label="View ${esc(p.title)}">${image(p.image,p.imageAlt,'',false,'(max-width: 680px) calc((100vw - 58px) / 2), (max-width: 1050px) calc((100vw - 112px) / 3), 380px')}</a><div class="product-text"><span class="product-category">${esc(p.category)}</span><h3><a href="/${p.slug}">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p>${link('/'+p.slug,'View product details')}</div></article>`;
}

export function timeline() {
  return `<ol class="timeline">${milestones.map(([year,title,description])=>`<li><span class="timeline-year">${year}</span><h3>${title}</h3><p>${description}</p></li>`).join('')}</ol>`;
}

export function home() {
  return `<main id="main">
  <section class="engineering-experience" id="experience" data-chapter="0" aria-label="Engineering in motion">
    <div class="experience-sticky">
      <div class="container experience-body">
        <div class="experience-copy">
          <div class="experience-chapter" data-chapter="0"><p class="eyebrow">Sicher Engineering India Pvt. Ltd.</p><h1>Precision.<br><span>In motion.</span></h1><p class="experience-description">Sheet metal fabrication and engineered systems for railways, electrical and infrastructure applications.</p><div class="hero-actions"><a class="button" href="/products">Explore the products ${arrow}</a><a class="button button-outline" href="/contact-us#rfq">Request a Quote</a></div><p class="experience-location">Manufactured in Shahzadpur, Ambala, Haryana.</p></div>
          <div class="experience-chapter" data-chapter="1"><p class="eyebrow">From component to assembly</p><h2>Every component.<br><span>One system.</span></h2><p class="experience-description">Cutting, forming, welding and finishing. A connected manufacturing process for individual parts and complete assemblies.</p>${link('/capabilities','Explore the manufacturing process','experience-link')}</div>
          <div class="experience-chapter" data-chapter="2"><p class="eyebrow">Built around your application</p><h2>Your requirement.<br><span>Our starting point.</span></h2><p class="experience-description">Materials, configuration, dimensions and finish. Share the details that define your door system or fabrication requirement.</p>${link('/automated-door-solutions','See automated door specifications','experience-link')}</div>
        </div>
        <div class="scene-composition">
          <div id="hero-stage" class="assembly-stage" role="img" aria-label="Illustrative 3D sliding door assembly with a metal frame, glazed leaves and an overhead drive." data-engineering-scene data-scene-state="loading"><canvas class="assembly-canvas" aria-hidden="true"></canvas><div class="scene-fallback"><img src="/assets/assembly-fallback.svg" alt="Illustrative three-dimensional sliding door assembly" width="900" height="1000"></div><div class="scene-crosshair crosshair-one" aria-hidden="true"></div><div class="scene-crosshair crosshair-two" aria-hidden="true"></div></div>
          <div class="scene-toolbar"><span data-scene-status class="visually-hidden">Assembled view</span><div><button type="button" disabled data-scene-action="assemble">Assembled</button><button type="button" disabled data-scene-action="explode">Exploded</button><button type="button" disabled data-scene-action="rotate" aria-pressed="false">Rotate <span aria-hidden="true">↗</span></button><button type="button" disabled data-scene-action="reset" aria-label="Reset assembly view">Reset</button></div></div>
          <p class="scene-disclaimer">Illustrative assembly. Visit the product pages for specifications.</p>
        </div>
      </div>
      <div class="container experience-bottom"><div class="experience-step-dots" aria-hidden="true"><span></span><span></span><span></span></div><a href="#company" class="scroll-cue">Discover Sicher <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>
  <section class="proof-section" aria-label="Published company milestones and supply figures"><div class="container proof-grid"><div data-reveal><strong>2019</strong><span>Established</span></div><div data-reveal><strong>500<span>+</span></strong><span>Automatic doors supplied</span></div><div data-reveal><strong>10,000<span>+</span></strong><span>Lavatory units supplied</span></div><p>Supply figures published by Sicher.</p></div></section>
  <section class="section immersive-introduction" id="company"><div class="container intro-grid"><div data-reveal><p class="eyebrow">The company</p><h2>From sheet metal.<br><span>To complete systems.</span></h2></div><div data-reveal><p class="lead">Engineering starts with the details.</p><p>Sicher Engineering manufactures custom sheet metal components, stainless steel assemblies and automatic door systems. Established in 2019 near Ambala, Haryana, our work brings together cutting, forming, welding and surface finishing.</p><p>Individual components. Configurable doors and windows. Complete fabricated assemblies for the application.</p>${link('/about-us','Meet Sicher Engineering')}</div></div><figure class="container introduction-photo" data-reveal="depth"><div data-parallax="0.08">${image('laser-cutting','Metalworking machinery shown on the existing Sicher website','','', '(max-width: 680px) 100vw, 1184px')}</div><figcaption><span>Cut. Form. Join. Finish.</span></figcaption></figure></section>
  <section class="section immersive-products"><div class="container"><div class="section-heading"><div data-reveal><p class="eyebrow">Product portfolio</p><h2>Made for<br><span>the application.</span></h2></div><div data-reveal><p>Five product families. Material and configuration choices that begin with your specification.</p>${link('/products','View the complete range')}</div></div><div class="immersive-product-grid">${products.map((p,i)=>`<article class="portfolio-product" data-reveal="depth"><a class="portfolio-image" href="/${p.slug}" aria-label="View ${esc(p.title)}">${image(p.image,p.imageAlt,'',false,'(max-width: 680px) calc(100vw - 40px), 620px')}<span class="portfolio-arrow" aria-hidden="true">↗</span></a><div class="portfolio-text"><span class="product-category">${esc(p.category)}</span><h3><a href="/${p.slug}">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p>${link('/'+p.slug,'View specifications')}</div></article>`).join('')}<article class="portfolio-custom" data-reveal><span class="eyebrow">Custom fabrication</span><h3>A drawing.<br>A material.<br>A requirement.</h3><p>Talk to us about your sheet metal component, enclosure or fabricated assembly.</p>${link('/contact-us?product=custom#rfq','Start a fabrication enquiry')}</article></div></div></section>
  <section class="section immersive-capabilities"><div class="container capability-grid"><div class="capability-copy" data-reveal><p class="eyebrow">The manufacturing process</p><h2>Precision is<br><span>a process.</span></h2><p>From the first cut to the final surface. Our manufacturing services turn sheet metal into finished components.</p>${link('/capabilities','Explore our capabilities')}<figure class="process-image" data-reveal="depth">${image('welding-source','Welding process photograph published on Sicher’s original website')}</figure></div><div class="capability-list">${capabilities.map((c,i)=>`<a href="/capabilities#${c.id}" data-reveal><span class="process-number">0${i+1}</span><div><h3>${esc(c.title)}</h3><p>${esc(c.context)}</p></div>${arrow}</a>`).join('')}</div></div></section>
  <section class="section immersive-rail"><div class="container"><div class="rail-heading"><div data-reveal><p class="eyebrow">Railway & metro</p><h2>Door systems.<br><span>For working railways.</span></h2></div><p data-reveal>Pneumatic and electrical sliding doors with configurable controls, materials and opening speeds. Explore the published range and discuss the final configuration with our team.</p></div><figure class="rail-photo" data-reveal="depth"><div data-parallax="0.06">${image('sliding-door-installation','Sliding door installation in a railway coach, from the existing Sicher website','',false,'(max-width: 680px) 100vw, 1184px')}</div><figcaption>Sliding doors in a railway coach.</figcaption></figure><div class="rail-specs"><div data-reveal><span>Maximum leaf weight</span><strong>120 <small>kg</small></strong></div><div data-reveal><span>Configurable movement speed</span><strong>200–800 <small>mm/s</small></strong></div><a class="button" href="/automated-door-solutions">View door specifications ${arrow}</a></div></div></section>
  <section class="section industries-home"><div class="container"><div class="section-heading"><div data-reveal><p class="eyebrow">Industries & applications</p><h2>Engineering<br><span>in its working context.</span></h2></div>${link('/industries','Explore applications')}</div><div class="industry-grid"><article data-reveal><h3>Railways & metro</h3><p>Door systems, lavatory components, windows and seating for rail environments.</p><a href="/industries#railways">Railway applications ${arrow}</a></article><article data-reveal><h3>Electrical & industrial</h3><p>Custom sheet metal components and fabricated enclosures for electrical and industrial requirements.</p><a href="/industries#electrical">Industrial applications ${arrow}</a></article><article data-reveal><h3>Public infrastructure</h3><p>Stainless steel benches and configurable window systems for public and commercial facilities.</p><a href="/industries#infrastructure">Infrastructure applications ${arrow}</a></article></div></div></section>
  <section class="section history-home"><div class="container"><div class="section-heading"><div data-reveal><p class="eyebrow">Our development</p><h2>Built since<br><span>2019.</span></h2></div><p data-reveal>From our establishment near Ambala to the first railway door and automatic sliding door orders.</p></div><div data-reveal>${timeline()}</div><div class="standards-strip" data-reveal><div><h3>Quality & project requirements</h3><p>Our product information references ISO 9001 and ISO 14001 processes. Door specifications also reference UIC-564. Request current documents for your project.</p></div>${link('/capabilities#quality','Discuss requirements & documents')}</div></div></section>
  <section class="section insights-home"><div class="container"><div class="section-heading"><div data-reveal><p class="eyebrow">Knowledge & insights</p><h2>Details worth<br><span>understanding.</span></h2></div>${link('/blog','All insights')}</div><div class="article-grid">${articles.slice(0,3).map(a=>articleTile(a)).join('')}</div></div></section>
  ${cta('Let’s build to your specification.','Share your application, drawings and quantities with the team.')}
  </main>`;
}

export const formatDate = value => new Date(value+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
export function articleTile(a) {
  return `<article class="article-item"><div class="article-meta"><span>${a.tag}</span><time datetime="${a.date}">${formatDate(a.date)}</time></div><h3><a href="/post/${a.slug}">${esc(a.title)}</a></h3><p>${esc(a.summary)}</p>${link('/post/'+a.slug,'Read article')}</article>`;
}

export function document({title,description,path,body,active,base,structured}) {
  const url=base+(path==='/'?'/':path);
  const org={'@context':'https://schema.org','@type':'Organization',name:company.name,url:base,logo:base+'/assets/logo.png',telephone:company.tel,address:{'@type':'PostalAddress',streetAddress:'Village Kakkarmajra, Shahzadpur',addressLocality:'Ambala',addressRegion:'Haryana',postalCode:'134202',addressCountry:'IN'}};
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Sicher Engineering</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><meta name="theme-color" content="#141519"><meta property="og:type" content="${structured?'article':'website'}"><meta property="og:title" content="${esc(title)} | Sicher Engineering"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}/assets/product-workshop.webp"><meta property="og:site_name" content="Sicher Engineering"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="preload" href="/assets/ibm-plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/core.css"><link rel="stylesheet" href="/site.css"><script>${loadingScript}</script><script type="application/ld+json">${JSON.stringify(org).replace(/</g,'\\u003c')}</script>${structured?`<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>`:''}<script src="/site.js" defer></script><script src="/motion.js" defer></script>${path==='/'?'<script type="module" src="/scene.js"></script>':''}</head><body id="top" data-page="${esc(path)}"><div class="reading-progress" aria-hidden="true"></div><div class="site-loader" aria-hidden="true"><div class="loader-brand"><div class="loader-emblem"><span></span><span></span><span></span></div><img src="/assets/logo.png" alt="" width="165" height="47"><span>Engineering. In motion.</span><div class="loader-track"></div><small data-loader-step>Preparing the experience</small></div></div>${header(active)}${body}${footer()}</body></html>`;
}
