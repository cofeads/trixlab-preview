import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:980}});
const errors = [];
page.on('console',(message) => {if(message.type()==='error')errors.push(message.text());});
page.on('pageerror',(error) => errors.push(error.message));

await page.goto('http://127.0.0.1:4173/studio.html',{waitUntil:'networkidle'});
assert.ok((await page.locator('body').innerText()).length>1000,'page has meaningful content');
assert.equal(await page.locator('.design-card').count(),12,'12 graphics designs render');
assert.equal(await page.locator('[data-tab]').count(),8,'8 editor tabs render');

const fixedBase = await page.locator('[data-vehicle-image]').getAttribute('src');
await page.locator('.design-card[data-design="electric"]').click();
assert.match(await page.locator('[data-vehicle-image]').getAttribute('src'),/design-electric-left/,'design changes to a finished panel-aligned render');
assert.equal(await page.locator('[data-wrap-layer]').getAttribute('hidden'),'','crude vector overlay stays hidden');
assert.equal(await page.locator('[data-studio]').getAttribute('data-pattern'),'bolt','design changes vector pattern');

await page.locator('[data-products-open]').first().click();
assert.ok(await page.locator('[data-products-drawer]').evaluate((el)=>el.classList.contains('open')),'product drawer opens');
assert.equal(await page.locator('.product-card').count(),3,'duplicate aliases are grouped into 3 platform lengths');
await page.locator('[data-product="spark-trixx-1up"]').click();
assert.match(await page.locator('[data-vehicle-meta]').innerText(),/1UP/,'1UP platform selection works');
await page.locator('[data-products-open]').first().click();
await page.locator('[data-product="spark-trixx-2up"]').click();
assert.match(await page.locator('[data-vehicle-image]').getAttribute('src'),/design-electric-left/,'returning to 2UP preserves selected livery');

await page.locator('[data-tab="mats"]').click();
await page.locator('[data-mat-pattern="hive"]').click();
assert.equal(await page.locator('[data-studio]').getAttribute('data-mat-pattern'),'hive','traction pattern changes');
const priceWithMats = await page.locator('[data-price]').innerText();
await page.locator('[data-mats-enabled]').uncheck();
const priceWithoutMats = await page.locator('[data-price]').innerText();
assert.notEqual(priceWithMats,priceWithoutMats,'mats update live price');
assert.equal(await page.locator('[data-studio]').getAttribute('data-mats'),'off','mats can be disabled');
await page.locator('[data-mats-enabled]').check();

await page.locator('[data-tab="personalize"]').click();
await page.locator('[data-logo]').setInputFiles('trix-performance-theme/assets/trixlab-logo.svg');
const logo = page.locator('[data-logo-preview]');
await logo.waitFor({state:'visible'});
const before = await logo.boundingBox();
assert.ok(before,'uploaded logo is visible');
await page.mouse.move(before.x+before.width/2,before.y+before.height/2);
await page.mouse.down();
await page.mouse.move(before.x-110,before.y+35,{steps:8});
await page.mouse.up();
const after = await logo.boundingBox();
assert.ok(Math.abs(after.x-before.x)>40,'uploaded logo can be dragged');

await page.locator('[data-save]').click();
assert.equal(await page.locator('[data-build-count]').innerText(),'1','build can be saved');
await page.locator('[data-add]').click();
assert.equal(await page.locator('[data-cart] b').innerText(),'1','configured kit can be added to cart');

await page.screenshot({path:'studio-browser-test.png',fullPage:true});
assert.deepEqual(errors,[],'no browser console or page errors');
console.log('TRIXLAB browser: HQ designs, grouped models, mats, drag logo, save and cart checks passed.');
await browser.close();
