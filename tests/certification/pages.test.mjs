import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../docs/${p}`, import.meta.url), 'utf8');

test('pages exist and load their scripts as modules', () => {
  for (const p of ['index', 'awareness', 'credential']) assert.ok(existsSync(new URL(`../../docs/certification/${p}.html`, import.meta.url)), p);
  assert.match(read('certification/awareness.html'), /<script type="module" src="awareness\.js">/);
  assert.match(read('certification/credential.html'), /<script type="module" src="credential\.js">/);
});

test('scripts never write HTML from data', () => {
  for (const f of ['awareness.js', 'credential.js']) {
    const js = read(`certification/${f}`);
    assert.equal(/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(js), false, f);
  }
});

test('API base is https and comes from config.js', () => {
  assert.match(read('certification/config.js'), /export const API_BASE = 'https:\/\/[^']+';/);
  for (const f of ['awareness.js', 'credential.js']) assert.match(read(`certification/${f}`), /from '\.\/config\.js'/);
});

test('credential page carries the no-endorsement sentence', () => {
  assert.match(read('certification/credential.html'), /It does not endorse their work or their organisation\./);
});

test('no answer key shipped to the browser', () => {
  for (const f of ['awareness.js', 'awareness.html', 'config.js']) assert.equal(/"answer"\s*:/.test(read(`certification/${f}`)), false, f);
});

test('sitemap and privacy policy mention certification', () => {
  assert.match(read('sitemap.xml'), /https:\/\/arckit\.org\/certification\/index\.html/);
  assert.match(read('sitemap.xml'), /https:\/\/arckit\.org\/certification\/awareness\.html/);
  assert.match(read('privacy.html'), /id="certification"/);
});
