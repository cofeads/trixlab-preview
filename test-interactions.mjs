import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire('/tmp/trixlab-jsdom/package.json');
const { JSDOM } = require('jsdom');
const script = fs.readFileSync('studio.js','utf8');
const markup = fs.readFileSync('studio.html','utf8')
  .replace('<link rel="stylesheet" href="studio.css">','')
  .replace('<script src="studio.js"></script>',`<script>${script}</script>`);
const dom = new JSDOM(markup,{
  url:'https://trixlab.test/studio.html',
  resources:'usable',
  runScripts:'dangerously',
  pretendToBeVisual:true,
  beforeParse(window) {
    window.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
    window.HTMLDialogElement.prototype.close = function(){this.open=false;};
    window.Element.prototype.setPointerCapture = function(){};
    window.Element.prototype.releasePointerCapture = function(){};
    window.Element.prototype.hasPointerCapture = function(){return true;};
  }
});
await new Promise((resolve) => dom.window.addEventListener('load',()=>setTimeout(resolve,50),{once:true}));
const { document } = dom.window;
const click = (selector) => document.querySelector(selector).click();
const fire = (element,type) => element.dispatchEvent(new dom.window.Event(type,{bubbles:true}));
const fixedBase = document.querySelector('[data-vehicle-image]').getAttribute('src');

click('[data-view="template"]');
assert.equal(document.querySelector('[data-photo-view]').hidden,true,'real photo can be hidden');
assert.equal(document.querySelector('[data-template-view]').hidden,false,'1:1 PDF panel map can be shown');
click('[data-view="photo"]');
assert.equal(document.querySelector('[data-photo-view]').hidden,false,'real photo view can be restored');

click('.design-card[data-design="electric"]');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),fixedBase,'design keeps fixed base image');
assert.equal(document.querySelector('[data-studio]').dataset.pattern,'bolt','design changes vector pattern');

click('[data-products-open]');
assert.ok(document.querySelector('[data-products-drawer]').classList.contains('open'),'product menu opens');
click('[data-product="gti"]');
assert.match(document.querySelector('[data-vehicle-image]').getAttribute('src'),/performance/,'product can be changed');
click('[data-products-open]');
click('[data-product="trixx-2up"]');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),fixedBase,'fixed Trixx base returns');

click('[data-tab="mats"]');
click('[data-mat-pattern="hive"]');
assert.equal(document.querySelector('[data-studio]').dataset.matPattern,'hive','mat pattern changes');
const matsToggle = document.querySelector('[data-mats-enabled]');
const priceWithMats = document.querySelector('[data-price]').textContent;
matsToggle.checked=false;
fire(matsToggle,'change');
assert.notEqual(document.querySelector('[data-price]').textContent,priceWithMats,'mat selection changes price');
matsToggle.checked=true;
fire(matsToggle,'change');

click('[data-tab="personalize"]');
const upload = document.querySelector('[data-logo]');
const testLogo = new dom.window.File(['<svg xmlns="http://www.w3.org/2000/svg"/>'],'logo.svg',{type:'image/svg+xml'});
Object.defineProperty(upload,'files',{configurable:true,value:[testLogo]});
fire(upload,'change');
await new Promise((resolve)=>setTimeout(resolve,50));
const logo = document.querySelector('[data-logo-preview]');
assert.equal(logo.hidden,false,'uploaded logo becomes visible');
const stack = document.querySelector('.vehicle-stack');
stack.getBoundingClientRect = () => ({left:100,top:100,width:1000,height:667,right:1100,bottom:767});
const pointer = (type,x,y) => {
  const event = new dom.window.MouseEvent(type,{bubbles:true,clientX:x,clientY:y});
  Object.defineProperty(event,'pointerId',{value:1});
  logo.dispatchEvent(event);
};
pointer('pointerdown',760,450);
pointer('pointermove',420,520);
pointer('pointerup',420,520);
assert.equal(logo.style.getPropertyValue('--logo-x'),'32%','logo drag updates horizontal position');
assert.ok(parseFloat(logo.style.getPropertyValue('--logo-y'))>60,'logo drag updates vertical position');

click('[data-save]');
assert.equal(document.querySelector('[data-build-count]').textContent,'1','build saves locally');
click('[data-add]');
assert.equal(document.querySelector('[data-cart] b').textContent,'1','configured kit adds to cart');

console.log('TRIXLAB interactions: base-lock, product menu, mats, logo drag, save and cart passed.');
dom.window.close();
