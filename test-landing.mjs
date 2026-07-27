import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require=createRequire('/tmp/trixlab-jsdom/package.json');
const {JSDOM}=require('jsdom');
const script=fs.readFileSync('landing.js','utf8');
const item={
  id:'test-kit',quantity:1,title:'VOLTAGE · Spark Trixx 2UP',
  subtitle:'Side Kit · Standard Marine Vinyl · HIVE Mats',
  price:58800,image:'assets/design-electric-left.webp'
};
const markup=fs.readFileSync('index.html','utf8')
  .replace('<link rel="stylesheet" href="trix-preview/style.css">','')
  .replace('<link rel="stylesheet" href="landing.css">','')
  .replace('<script src="landing.js"></script>',`<script>localStorage.setItem('trixlab-cart-v1',JSON.stringify(${JSON.stringify([item])}));</script><script>${script}</script>`);
const dom=new JSDOM(markup,{
  url:'https://trixlab.test/index.html',
  runScripts:'dangerously',
  pretendToBeVisual:true,
  beforeParse(window){
    window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
    window.HTMLDialogElement.prototype.close=function(){this.open=false;};
    window.HTMLFormElement.prototype.reportValidity=function(){return true;};
  }
});
await new Promise((resolve)=>dom.window.addEventListener('load',()=>setTimeout(resolve,30),{once:true}));
const {document}=dom.window;
const click=(selector)=>document.querySelector(selector).click();

assert.equal(document.querySelectorAll('[data-model-card]').length,4,'homepage model chooser is visible');
assert.equal(document.querySelectorAll('.model-card.coming-soon').length,2,'1UP and 3UP are marked coming soon');
assert.equal(document.querySelectorAll('[data-model-card="trixx-2up"] a[href*="product=trixx-2up"]').length,1,'2UP is the only active graphics model');
assert.equal(document.querySelector('[data-cart-count]').textContent,'1','saved studio cart is shown on homepage');
click('[data-cart-open]');
assert.ok(document.querySelector('[data-cart-drawer]').classList.contains('open'),'cart drawer opens');
assert.match(document.querySelector('[data-cart-items]').textContent,/VOLTAGE/,'configured studio item appears in cart');
click('[data-cart-increase="0"]');
assert.equal(document.querySelector('[data-cart-count]').textContent,'2','cart quantity can be increased');
click('[data-checkout]');
assert.equal(document.querySelector('[data-checkout-dialog]').open,true,'checkout dialog opens');
document.querySelector('[name="name"]').value='Jeff';
document.querySelector('[name="email"]').value='jeff@example.com';
document.querySelector('[data-checkout-form]').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert.equal(document.querySelector('[data-checkout-success]').hidden,false,'checkout request shows success');
assert.equal(JSON.parse(dom.window.localStorage.getItem('trixlab-order-requests-v1')).length,1,'checkout request is saved');
assert.equal(document.querySelector('[data-cart-count]').textContent,'0','cart clears after successful checkout request');

console.log('TRIXLAB landing: model chooser, shared cart and checkout request passed.');
dom.window.close();
