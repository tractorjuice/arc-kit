import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../docs/${p}`, import.meta.url), 'utf8');

test('pages exist and load their scripts as modules', () => {
  for (const p of ['index', 'awareness', 'credential']) assert.ok(existsSync(new URL(`../../docs/certification/${p}.html`, import.meta.url)), p);
  assert.match(read('certification/awareness.html'), /<script type="module" src="awareness\.js(\?v=\d+)?">/);
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
  for (const p of ['index', 'awareness', 'credential']) {
    const html = read(`certification/${p}.html`);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
      const target = new URL(ref, `file:///docs/certification/${p}.html`).pathname.replace(/^\/docs\//, '');
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
  assert.match(read('certification/config.js'), /export const API_BASE = 'https:\/\/certification-api\.arckit\.org';/);
});

test('credential pages stay out of search results; the others are in the sitemap', () => {
  assert.match(read('certification/credential.html'), /<meta name="robots" content="noindex, follow">/);
  assert.doesNotMatch(read('sitemap.xml'), /certification\/credential\.html/);
});

test('JSON-LD describes the credentials and the quiz', () => {
  const ld = (p) => JSON.parse(read(`certification/${p}.html`).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const creds = ld('index').filter((n) => n['@type'] === 'EducationalOccupationalCredential');
  assert.deepEqual(creds.map((c) => c.name), ['ArcKit Awareness', 'ArcKit Foundation', 'ArcKit Practitioner', 'ArcKit Expert']);
  assert.equal(creds[0]['@id'], 'https://arckit.org/certification/achievements/awareness.json');
  const quiz = ld('awareness').find((n) => n['@type'] === 'Quiz');
  assert.equal(quiz.about['@id'], creds[0]['@id']);
  assert.doesNotMatch(read('certification/awareness.html'), /acceptedAnswer|"answer"/);
});

test('the site links to certification and llms.txt indexes it', () => {
  assert.match(read('index.html'), /href="certification\/index\.html"/);
  assert.match(read('llms.txt'), /## Certification[\s\S]*certification\/awareness\.html/);
  for (const p of ['index', 'awareness', 'credential']) assert.match(read(`certification/${p}.html`), /og:image" content="https:\/\/arckit\.org\/certification\/og-image\.png"/, p);
});

test('the quiz sends the signed draw back with the answers', () => {
  const js = read('certification/awareness.js');
  assert.match(js, /JSON\.stringify\(\{ name, answers, bankVersion: draw\.bankVersion, drawToken: draw\.drawToken \}\)/);
  // The caption counts from the response, not a hard-coded 10.
  assert.match(js, /`Question \$\{i \+ 1\} of \$\{total\}`/);
  assert.match(js, /draw\.total/);
});

test('a pass shows the review and a fail shows the areas to revisit', () => {
  const html = read('certification/awareness.html');
  assert.match(html, /<section id="review-box"[^>]*hidden>[\s\S]*<ol class="app-cert-review" id="review-list"><\/ol>/);
  assert.match(html, /<div id="areas-box" hidden>\s*<h3 class="govuk-heading-s">Areas to revisit<\/h3>\s*<ul class="govuk-list govuk-list--bullet" id="areas-list"><\/ul>/);
  const js = read('certification/awareness.js');
  for (const field of ['prompt', 'yourAnswer', 'correctAnswer', 'explanation']) assert.match(js, new RegExp(`r\\.${field}`), field);
  assert.match(js, /'✓' : '✗'/);
  assert.match(js, /renderReview\(out\.review\)/);
  assert.match(js, /renderAreas\(out\.areasToRevisit\)/);
  // Built from elements and text nodes only.
  const review = js.match(/function renderReview[\s\S]*?\n\}\n/)[0];
  assert.match(review, /createTextNode|el\(/);
  assert.doesNotMatch(review, /innerHTML|outerHTML|insertAdjacentHTML/);
});

test('"Try again" loads a fresh draw instead of clearing the radios', () => {
  const js = read('certification/awareness.js');
  const retry = js.match(/\$\('retry'\)\.addEventListener\('click', \(\) => \{[\s\S]*?\n\}\);/)[0];
  assert.match(retry, /load\(\)/);
  assert.doesNotMatch(retry, /checked = false/);
  assert.match(js, /fetch\(`\$\{API_BASE\}\/awareness\/questions`\)/);
});

test('the quiz intro still promises 10 questions and 8 to pass', () => {
  assert.match(read('certification/awareness.html'), /<p class="app-page-hero__description">10 questions\. Get 8 right to earn your credential\./);
});

test('the review styles use the shared --cert-* colours, so they follow dark mode', () => {
  const css = read('certification/certification.css');
  const review = css.slice(css.indexOf('.app-cert-review {'), css.indexOf('Credential'));
  assert.ok(review.length > 0);
  assert.doesNotMatch(review, /#[0-9a-f]{3,6}\b/i); // no fixed colours
  assert.match(review, /var\(--cert-teal\)/);
  assert.match(read('certification/awareness.html'), /certification\.css\?v=2/);
});
