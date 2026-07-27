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
    window.fetch = async () => ({ok:true,blob:async()=>new window.Blob(['asset'],{type:'image/webp'})});
    window.URL.createObjectURL = () => 'blob:https://trixlab.test/production-export';
    window.URL.revokeObjectURL = () => {};
    window.HTMLAnchorElement.prototype.click = function(){this.dataset.testClicked='true';};
  }
});
await new Promise((resolve) => dom.window.addEventListener('load',()=>setTimeout(resolve,50),{once:true}));
const { document } = dom.window;
const click = (selector) => document.querySelector(selector).click();
const fire = (element,type) => element.dispatchEvent(new dom.window.Event(type,{bubbles:true}));
const fixedBase = document.querySelector('[data-vehicle-image]').getAttribute('src');

click('[data-view="template"]');
assert.equal(document.querySelector('[data-photo-view]').hidden,true,'real photo can be hidden');
assert.equal(document.querySelector('[data-template-view]').hidden,false,'single panel layout can be shown');
click('[data-view="right"]');
assert.equal(document.querySelector('[data-photo-view]').hidden,false,'real photo view can be restored');
assert.match(document.querySelector('[data-vehicle-image]').getAttribute('src'),/right/,'right camera has its own fixed image');
assert.equal(document.querySelector('[data-wrap-layer]').hidden,false,'right camera uses the selected live motif mapping instead of an old fixed design');
click('[data-view="left"]');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),fixedBase,'left camera returns to the same fixed base');

click('[data-colorway="ocean"]');
assert.match(document.querySelector('[data-studio]').style.getPropertyValue('--livery-hue'),/deg/,'ocean palette recolors the selected design');
click('[data-colorway="toxic"]');
assert.equal(document.querySelector('[data-studio]').dataset.colorway,'toxic','toxic palette becomes active');
click('[data-colorway="race"]');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),fixedBase,'race preset restores its exact high-quality render');

click('.design-card[data-design="electric"]');
const electricRender = document.querySelector('[data-vehicle-image]').getAttribute('src');
assert.match(electricRender,/design-electric-left/,'electric selects its finished panel-aligned render');
assert.equal(document.querySelector('[data-template-design]').textContent,'VOLTAGE','panel-layout ticket follows the selected motif name');
assert.equal(document.querySelector('[data-studio]').dataset.hq,'true','all customer photo views use a finished render');
assert.equal(document.querySelector('[data-wrap-layer]').hidden,true,'crude vector polygons never stack over the customer photo');
assert.equal(document.querySelector('[data-studio]').dataset.pattern,'bolt','design changes vector pattern');

click('[data-tab="coverage"]');
click('[data-coverage="side"]');
assert.equal(document.querySelector('[data-studio]').dataset.coverage,'side','side kit becomes active');
assert.equal(document.querySelector('[data-studio]').dataset.hq,'false','side kit uses the neutral base plus its own panel map');
assert.match(document.querySelector('[data-vehicle-image]').getAttribute('src'),/trixx-2022-left/,'side kit is shown on the fixed neutral left base');
assert.equal(document.querySelector('[data-wrap-layer]').hidden,false,'side-kit panel mapping is visible');
assert.match(document.querySelector('[data-coverage-label]').textContent,/SIDE KIT/,'side-kit coverage label is visible');
click('[data-coverage="accent"]');
assert.equal(document.querySelector('[data-studio]').dataset.coverage,'accent','accent kit becomes active');
assert.match(document.querySelector('[data-coverage-label]').textContent,/ACCENT KIT/,'accent-kit coverage label is visible');
click('[data-coverage="full"]');
assert.equal(document.querySelector('[data-studio]').dataset.hq,'true','full kit restores its finished render');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),electricRender,'full kit restores the selected high-quality design');

click('[data-products-open]');
assert.ok(document.querySelector('[data-products-drawer]').classList.contains('open'),'product menu opens');
assert.equal(document.querySelector('[data-product="trixx-1up"]').disabled,true,'Trixx 1UP is coming soon and cannot select the wrong geometry');
assert.equal(document.querySelector('[data-product="trixx-3up"]').disabled,true,'Trixx 3UP is coming soon and cannot select the wrong geometry');
click('[data-product="trixx-2up"]');
assert.equal(document.querySelector('[data-vehicle-image]').getAttribute('src'),electricRender,'2UP returns without changing the selected design');

click('[data-tab="colors"]');
click('[data-randomize]');
assert.match(document.querySelector('[data-variant-id]').textContent,/\/ 240/,'random button selects one of 240 live variants');

click('[data-tab="mats"]');
assert.equal(document.querySelector('[data-studio]').dataset.view,'rear','mats step automatically opens the useful rear perspective');
assert.equal(document.querySelector('[data-mat-layer]').hidden,false,'traction mats are visible in rear view');
assert.equal(document.querySelector('[data-camera-mats="rear"]').hasAttribute('hidden'),false,'rear mat geometry is selected');
click('[data-mat-pattern="hive"]');
assert.equal(document.querySelector('[data-studio]').dataset.matPattern,'hive','mat pattern changes');
click('[data-view="left"]');
assert.equal(document.querySelector('[data-camera-mats="left"]').hasAttribute('hidden'),false,'left perspective uses its matching traction mat geometry');
click('[data-view="right"]');
assert.equal(document.querySelector('[data-camera-mats="right"]').hasAttribute('hidden'),false,'right perspective uses its matching traction mat geometry');
click('[data-view="front"]');
assert.equal(document.querySelector('[data-mat-layer]').hidden,true,'front perspective hides mats that are not visible from this angle');
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
assert.equal(document.querySelector('[data-template-logo]').hidden,false,'uploaded logo is also visible in the production panel layout');
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

const configuredName=document.querySelector('[data-name]');
configuredName.value='JEFF RACING';
fire(configuredName,'input');
const configuredNumber=document.querySelector('[data-number]');
configuredNumber.value='77';
fire(configuredNumber,'input');
assert.equal(document.querySelector('[data-template-name]').textContent,'JEFF RACING','panel layout follows the configured name');
assert.equal(document.querySelector('[data-template-number]').textContent,'77','panel layout follows the configured race number');
click('[data-view="template"]');
click('[data-export-svg]');
await new Promise((resolve)=>setTimeout(resolve,100));
assert.equal(document.querySelector('[data-export-svg]').disabled,false,'1:1 production export completes');
assert.match(document.querySelector('[data-toast]').textContent,/1:1 PRODUCTION SVG READY/,'production export reports a ready 1:1 file');

click('[data-save]');
assert.equal(document.querySelector('[data-build-count]').textContent,'1','build saves locally');
click('[data-add]');
assert.equal(document.querySelector('[data-cart] b').textContent,'1','configured kit adds to cart');
assert.equal(JSON.parse(dom.window.localStorage.getItem('trixlab-cart-v1')).length,1,'configured cart item persists for homepage checkout');

console.log('TRIXLAB interactions: base-lock, product menu, mats, logo drag, save and cart passed.');
dom.window.close();
