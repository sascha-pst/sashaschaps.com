import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../assets/gate/rain.js',import.meta.url),'utf8');
function setup(reduce=false){
 const handlers={},docHandlers={},buttonHandlers={};let queued=0,cancelled=0;
 const ctx={clearRect(){},setTransform(){},createRadialGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},ellipse(){}};
 const canvas={getContext(){return ctx}},button={hidden:true,setAttribute(name,value){this[name]=value},addEventListener(name,fn){buttonHandlers[name]=fn}};
 const media={matches:reduce,addEventListener(name,fn){handlers.media=fn}};
 const document={hidden:false,querySelector(name){return name==='#opal-rain'?canvas:button},addEventListener(name,fn){docHandlers[name]=fn}};
 vm.runInNewContext(source,{document,matchMedia:()=>media,innerWidth:390,innerHeight:844,devicePixelRatio:2,requestAnimationFrame(){queued++;return queued},cancelAnimationFrame(){cancelled++},addEventListener(name,fn){handlers[name]=fn}});
 return {button,document,docHandlers,handlers,buttonHandlers,get queued(){return queued},get cancelled(){return cancelled}};
}
test('reduced motion starts static; user can play and pause the rain',()=>{
 const s=setup(true);assert.equal(s.queued,0);assert.equal(s.button.hidden,false);assert.equal(s.button.textContent,'Play rain');
 s.buttonHandlers.click();assert.equal(s.queued,1);assert.equal(s.button['aria-pressed'],'true');
 s.buttonHandlers.click();assert.equal(s.button.textContent,'Play rain');assert.equal(s.button['aria-pressed'],'false');
});
test('animation suspends when hidden and reacts to a reduced-motion preference change',()=>{
 const s=setup();assert.equal(s.queued,1);s.document.hidden=true;s.docHandlers.visibilitychange();const n=s.queued;
 s.document.hidden=false;s.docHandlers.visibilitychange();assert.equal(s.queued,n+1);
 s.handlers.media({matches:true});assert.equal(s.button.textContent,'Play rain');assert.ok(s.cancelled>0);
});
