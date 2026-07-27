import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('studio.html','utf8');
const css=fs.readFileSync('studio.css','utf8');
const js=fs.readFileSync('studio.js','utf8');
const landing=fs.readFileSync('index.html','utf8');
for(const angle of ['left','right','front','rear']){
  const image=`assets/trixx-2022-${angle}.webp`;
  assert.ok(fs.existsSync(image),`real 2022 Trixx 2UP ${angle} render exists`);
  assert.ok(fs.statSync(image).size>8_000,`${angle} render contains a real studio image`);
}
for(const layer of ['outline','white','black','red','grey']){
  const template=`assets/trixx-2up-template-${layer}.webp`;
  assert.ok(fs.existsSync(template),`real PDF template layer ${layer} exists`);
}
assert.match(landing,/href="studio\.html"/,'landing links to standalone studio');
assert.doesNotMatch(landing,/data-studio/,'studio is no longer embedded in landing');
for(const selector of ['data-studio','data-design','data-material','data-colorway','data-name','data-number','data-logo','data-coverage','data-finish','data-save','data-add','data-mat-pattern','data-mats-enabled','data-products-drawer']){
  assert.ok(html.includes(selector),`studio includes ${selector}`);
}
for(const feature of ['showModal','localStorage','FileReader','data-add-price','data-breakdown-price','pointerdown','pointermove','setPointerCapture','logoX','logoY']){
  assert.ok(js.includes(feature),`studio JavaScript includes ${feature}`);
}
for(const responsive of ['@media(max-width:900px)','@media(max-width:560px)']){
  assert.ok(css.includes(responsive),`studio CSS includes ${responsive}`);
}
assert.equal((html.match(/class="design-card/g)||[]).length,12,'studio offers 12 graphics designs');
assert.equal((html.match(/class="product-card/g)||[]).length,6,'product drawer offers 6 Sea-Doo products');
assert.equal((html.match(/data-mat-pattern="/g)||[]).length,6,'traction mats offer 6 routed patterns');
assert.equal((html.match(/data-tab="/g)||[]).length,8,'studio has 8 configuration steps');
assert.match(html,/class="photo-wrap-layer"/,'wrap is a separate panel-aligned vector layer');
assert.match(html,/class="photo-mat-layer"/,'traction mat is a separate vector layer');
assert.match(html,/data-template-view/,'exact 1:1 panel map is available');
assert.match(html,/trixx-2up-template-outline\.webp/,'user PDF panel outline is used');
assert.match(html,/data-vehicle-image src="assets\/trixx-2022-left\.webp"/,'real fixed 2022 base is used');
assert.equal((html.match(/data-camera-map="/g)||[]).length,4,'four separately mapped camera angles exist');
assert.equal((html.match(/data-view="/g)||[]).length,5,'four camera angles plus 1:1 panel map are selectable');
assert.match(html,/class="template-fit-points"/,'corresponding P1-P6 anchors are rendered on the PDF map');
assert.match(html,/data-camera-mats="rear"/,'traction mats have a dedicated rear-view mapping');
assert.doesNotMatch(css,/\.vehicle-image\{[^}]*filter:/,'base vehicle is never recolored by CSS filters');
assert.match(js,/const cameraImages =/,'camera-specific fixed base images are registered');
assert.match(js,/state\.design = button\.dataset\.design/,'design selection changes overlay state');
assert.ok(!js.includes('const $$'),'avoids double-dollar upload mangling');
console.log('TRIXLAB standalone studio: 48 structure and interaction checks passed.');
