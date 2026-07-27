import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
const themeSection = await readFile(new URL('../trix-performance-theme/sections/product-configurator.liquid', import.meta.url), 'utf8');
const themeJavaScript = themeSection.match(/{% javascript %}([\s\S]*?){% endjavascript %}/)?.[1] || '';
new Function(themeJavaScript);

const dom = new JSDOM(html.replace('<script src="app.js"></script>', ''), {
  runScripts: 'outside-only',
  url: 'https://preview.trix-performance.test/'
});
const { window } = dom;
window.HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute('open', '');
};
window.HTMLDialogElement.prototype.close = function close() {
  this.removeAttribute('open');
};
window.URL.createObjectURL = () => 'blob:trix-logo-preview';
window.URL.revokeObjectURL = () => {};
window.eval(app);

const document = window.document;
const root = document.querySelector('[data-studio]');
const click = (selector) => {
  const element = document.querySelector(selector);
  assert.ok(element, `Missing element ${selector}`);
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  return element;
};
const input = (selector, value, eventName = 'input') => {
  const element = document.querySelector(selector);
  assert.ok(element, `Missing element ${selector}`);
  element.value = value;
  element.dispatchEvent(new window.Event(eventName, { bubbles: true }));
  return element;
};
const expectText = (selector, expected) => {
  assert.equal(document.querySelector(selector)?.textContent.trim(), expected);
};

assert.ok(root);
expectText('[data-price]', '595,00 €');

click('[data-menu]');
assert.equal(document.querySelector('[data-menu-drawer]').hidden, false);
click('[data-menu-drawer] a');
assert.equal(document.querySelector('[data-menu-drawer]').hidden, true);

click('[data-tab="colors"]');
assert.equal(document.querySelector('[data-panel-wrap]').hidden, false);
assert.equal(document.querySelector('[data-panel="colors"]').hidden, false);
input('[data-color="primary"]', '#ff0000');
assert.equal(root.style.getPropertyValue('--primary'), '#ff0000');

click('[data-preset="#28abe2,#111827,#ec008c"]');
assert.equal(root.style.getPropertyValue('--primary'), '#28abe2');
assert.equal(root.style.getPropertyValue('--accent'), '#ec008c');

click('[data-tab="material"]');
click('[data-material="Chrome"]');
assert.equal(root.dataset.material, 'Chrome');
expectText('[data-price]', '895,00 €');

click('[data-tab="coverage"]');
click('[data-coverage="Partial"]');
assert.equal(root.dataset.coverage, 'Partial');
expectText('[data-price]', '695,00 €');

click('[data-tab="overlay"]');
click('[data-overlay="hex"]');
assert.equal(root.dataset.overlay, 'hex');

click('[data-tab="text"]');
input('[data-text]', 'TRIX 21');
expectText('.custom-text', 'TRIX 21');
input('[data-text-color]', '#00ff00');
assert.equal(document.querySelector('.custom-text').style.fill, '#00ff00');

click('[data-tab="logo"]');
const logoInput = document.querySelector('[data-logo]');
const logoFile = new window.File(['logo'], 'trix-logo.png', { type: 'image/png' });
Object.defineProperty(logoInput, 'files', { configurable: true, value: [logoFile] });
logoInput.dispatchEvent(new window.Event('change', { bubbles: true }));
assert.equal(document.querySelector('[data-logo-preview]').hidden, false);
assert.equal(document.querySelector('[data-logo-preview]').src, 'blob:trix-logo-preview');
input('[data-logo-scale]', '120');
assert.equal(document.querySelector('[data-logo-preview]').style.width, '186px');
click('[data-logo-remove]');
assert.equal(document.querySelector('[data-logo-preview]').hidden, true);

click('[data-zoom-in]');
expectText('[data-zoom]', '110%');
click('[data-zoom-out]');
expectText('[data-zoom]', '100%');

const beforeRandom = root.style.getPropertyValue('--accent');
click('[data-random]');
click('[data-undo]');
assert.equal(root.style.getPropertyValue('--accent'), beforeRandom);
click('[data-redo]');
assert.notEqual(root.style.getPropertyValue('--accent'), '');

click('[data-tab="mix"]');
input('[data-mix-prompt]', 'fire');
click('[data-generate]');
assert.equal(root.style.getPropertyValue('--accent'), '#ffd23f');
assert.equal(root.dataset.overlay, 'hex');

click('[data-tab="notes"]');
input('[data-notes]', 'Race number on the rear panel');
assert.equal(document.querySelector('[data-notes]').value, 'Race number on the rear panel');

click('[data-save]');
assert.equal(JSON.parse(window.localStorage.getItem('trix-preview-builds')).length, 1);
click('[data-builds]');
assert.equal(document.querySelector('[data-builds-dialog]').hasAttribute('open'), true);
assert.equal(document.querySelectorAll('.saved').length, 1);
click('[data-builds-dialog] [data-dialog-close]');

click('[data-model]');
assert.equal(document.querySelector('[data-model-dialog]').hasAttribute('open'), true);
click('[data-model-continue]');
assert.equal(document.querySelector('[data-model-dialog]').hasAttribute('open'), false);

click('[data-price-info]');
assert.equal(document.querySelector('[data-price-dialog]').hasAttribute('open'), true);
click('[data-price-dialog] [data-dialog-close]');

click('[data-add]');
expectText('[data-cart] b', '1');

click('[data-panel-close]');
assert.equal(document.querySelector('[data-panel-wrap]').hidden, true);

const requiredThemeFiles = [
  'layout/theme.liquid',
  'sections/trix-home.liquid',
  'sections/product-configurator.liquid',
  'templates/index.json',
  'templates/product.json',
  'locales/de.json',
  'assets/trixlab-logo.svg'
];
for (const file of requiredThemeFiles) {
  const content = await readFile(new URL(`../trix-performance-theme/${file}`, import.meta.url), 'utf8');
  assert.ok(content.length > 20, `${file} should not be empty`);
}

console.log('TRIXLAB preview: 31 interaction and structure checks passed.');
