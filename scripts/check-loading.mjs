import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../src/loading.js',import.meta.url),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));

function browser({reducedMotion=false,saveData=false,history=false,fonts=Promise.resolve(),images=[],scene=null,readyState='loading'}={}){
  const classes=new Set(),timers=new Map(),properties=new Map();
  const progress={style:{setProperty:(name,value)=>properties.set(name,value)}};
  const status={textContent:''};
  const motion=Object.assign(new EventTarget(),{matches:reducedMotion});
  const document=Object.assign(new EventTarget(),{
    readyState,documentElement:{
      classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name))},
      style:{setProperty:(name,value)=>properties.set(name,value)}
    },
    fonts:fonts===null?undefined:{ready:fonts},querySelectorAll:()=>images,
    querySelector:selector=>selector==='[data-loader-step]'?status:selector==='[data-loader-progress]'?progress:scene
  });
  let nextTimer=0,clock=0;
  const window=Object.assign(new EventTarget(),{
    matchMedia:()=>motion,
    setTimeout:(callback,delay)=>{const id=++nextTimer;timers.set(id,{callback,delay,due:clock+delay});return id;},
    clearTimeout:id=>timers.delete(id),
    performance:{now:()=>clock,getEntriesByType:()=>[{type:history?'back_forward':'navigate'}]}
  });
  vm.runInNewContext(source,{window,document,navigator:{connection:{saveData}}});
  const advance=time=>{
    let next;
    while((next=[...timers].sort((a,b)=>a[1].due-b[1].due).find(([,timer])=>timer.due<=time))){
      const [id,timer]=next;
      clock=timer.due;
      timers.delete(id);
      timer.callback();
    }
    clock=time;
  };
  return {classes,timers,motion,document,window,properties,status,advance,ready:()=>document.dispatchEvent(new Event('DOMContentLoaded'))};
}

for(const preference of [{reducedMotion:true},{saveData:true},{history:true}]){
  const page=browser(preference);
  assert(!page.classes.has('is-loading'),'Accessibility/data preferences should bypass the overlay');
  assert(page.classes.has('is-ready'),'A bypassed page should enter its visible state');
  assert.equal(page.timers.size,0,'Bypassed loading must not add a delay');
}

const ready=browser();
assert(ready.classes.has('is-loading'));
ready.ready();await flush();
assert(ready.classes.has('is-loading'),'Fast cached assets can receive a brief branded introduction');
ready.advance(319);
assert(ready.classes.has('is-loading'));
ready.advance(320);
assert(!ready.classes.has('is-loading'),'The introduction must end within 450ms for ready assets');
assert.equal(ready.timers.size,0,'Successful readiness must clear the deadline');
assert.equal(ready.properties.get('--loader-progress'),'1');

const lateReady=browser({readyState:'complete'});
await flush();lateReady.advance(450);
assert(!lateReady.classes.has('is-loading'),'The script should also initialize after DOM readiness');

const failedImage=browser({images:[{decode:()=>Promise.reject(new Error('Unavailable image'))}]});
failedImage.ready();await flush();failedImage.advance(450);
assert(!failedImage.classes.has('is-loading'),'A failed image must not trap the visitor');

const thrownImage=browser({images:[{decode:()=>{throw new Error('Decode unavailable');}}]});
thrownImage.ready();await flush();thrownImage.advance(450);
assert(!thrownImage.classes.has('is-loading'),'A synchronous decode failure must also settle safely');

const noFonts=browser({fonts:null,images:[{}]});
noFonts.ready();await flush();noFonts.advance(450);
assert(!noFonts.classes.has('is-loading'),'Missing optional font/decode APIs must not block content');

let resolveFonts;
const slowReady=browser({fonts:new Promise(resolve=>{resolveFonts=resolve;})});
slowReady.ready();slowReady.advance(600);resolveFonts();await flush();
assert(!slowReady.classes.has('is-loading'),'Assets ready after the introduction must release without an extra delay');
assert.equal(slowReady.timers.size,0);

const stalled=browser({fonts:new Promise(()=>{})});
stalled.ready();
const deadline=[...stalled.timers.values()][0];
assert(deadline.delay<=1800,'Slow assets must have a short upper bound');
stalled.advance(1800);
assert(!stalled.classes.has('is-loading'),'The deadline must reveal the page with stalled assets');
assert.equal(stalled.timers.size,0,'The hard deadline must clear every timer');

const scene=browser({scene:{dataset:{sceneState:'loading'}}});
scene.ready();await flush();scene.advance(500);
assert(scene.classes.has('is-loading'),'A declared 3D scene can contribute actual readiness');
assert.equal(scene.status.textContent,'Building the 3D study');
scene.window.dispatchEvent(new Event('sicher:scene-ready'));await flush();
assert(!scene.classes.has('is-loading'),'The rendered scene must release its readiness stage');

const earlyScene=browser({scene:{dataset:{sceneState:'loading'}}});
earlyScene.window.dispatchEvent(new Event('sicher:scene-ready'));
earlyScene.ready();await flush();earlyScene.advance(450);
assert(!earlyScene.classes.has('is-loading'),'An early scene event must not be lost before DOM readiness');

for(const state of ['ready','fallback','failed']){
  const page=browser({scene:{dataset:{sceneState:state}}});
  page.ready();await flush();page.advance(450);
  assert(!page.classes.has('is-loading'),'A prepared or fallback scene must not delay the page');
}

const stalledScene=browser({scene:{dataset:{sceneState:'loading'}}});
stalledScene.ready();await flush();stalledScene.advance(1800);
assert(!stalledScene.classes.has('is-loading'),'A missing scene module must not hold the loader');
stalledScene.window.dispatchEvent(new Event('sicher:scene-ready'));await flush();
assert(!stalledScene.classes.has('is-loading'),'Late scene events must not replay a completed loader');

for(const interaction of ['pointerdown','keydown']){
  const page=browser({fonts:new Promise(()=>{})});
  page.document.dispatchEvent(new Event(interaction));
  assert(!page.classes.has('is-loading'),'Visitors must be able to dismiss loading by interacting');
  page.ready();await flush();
  assert.equal(page.timers.size,0,'Skipped loading must not restart after DOM readiness');
}

const changedMotion=browser();
changedMotion.motion.dispatchEvent(Object.assign(new Event('change'),{matches:true}));
assert(!changedMotion.classes.has('is-loading'),'A live reduced-motion preference must dismiss loading');

const restored=browser();
restored.window.dispatchEvent(Object.assign(new Event('pageshow'),{persisted:true}));
assert(!restored.classes.has('is-loading'),'History restoration must never replay a loader');
console.log('Passed: real image/font/scene readiness, bounded introduction and fallback deadline, failed/missing scene, keyboard/touch dismissal, reduced motion, Save-Data and history restoration.');
