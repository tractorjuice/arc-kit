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

test('every relative href and src in the pages resolves to a file', () => {
  // jwks.json is generated and committed at deploy time (Task 10).
  const deployTime = new Set(['certification/jwks.json']);
  for (const p of ['index', 'awareness', 'credential']) {
    const html = read(`certification/${p}.html`);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
      const target = new URL(ref, `file:///docs/certification/${p}.html`).pathname.replace(/^\/docs\//, '');
      if (deployTime.has(target)) continue;
      assert.ok(existsSync(new URL(`../../docs/${target}`, import.meta.url)), `${p}.html -> ${ref}`);
    }
  }
});

test('pages carry their own keywords, not the privacy page ones', () => {
  for (const p of ['index', 'awareness', 'credential']) assert.doesNotMatch(read(`certification/${p}.html`), /ArcKit privacy policy/, p);
});

test('an invalid credential says it confirms nothing', () => {
  const js = read('certification/credential.js');
  assert.match(js, /if \(!c\.valid\) \{[\s\S]*cred-confirms[\s\S]*doesn’t confirm that anyone passed/);
});

test('quiz never shows a raw parser error', () => {
  const js = read('certification/awareness.js');
  assert.doesNotMatch(js, /showError\(e\.message/);
  assert.match(js, /res\.json\(\)\.catch\(/);
});

test('API base is a placeholder that can never resolve until deploy time', () => {
  assert.match(read('certification/config.js'), /export const API_BASE = 'https:\/\/[^']+\.invalid';/);
});
