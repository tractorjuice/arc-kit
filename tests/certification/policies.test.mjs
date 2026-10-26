import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../docs/${p}`, import.meta.url), 'utf8');
const PAGE = 'certification/policies.html';
const URL_ABS = 'https://arckit.org/certification/policies.html';

const SECTIONS = [
  'Appeals',
  'Access arrangements',
  'Malpractice and revoking a credential',
  'Conflicts of interest',
  'Retakes',
  'Validity and ArcKit versions',
  'Complaints',
  'Equality',
  'Recognising prior learning',
  'Yearly report',
  'Changes to these policies',
];

test('the policies page exists', () => {
  assert.ok(existsSync(new URL(`../../docs/${PAGE}`, import.meta.url)));
});

test('the policies page has every section heading', () => {
  const html = read(PAGE);
  const headings = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1].trim());
  for (const s of SECTIONS) assert.ok(headings.includes(s), `missing section: ${s}`);
});

test('the policies page has its own title, canonical URL and share image', () => {
  const html = read(PAGE);
  assert.match(html, /<title>ArcKit certification policies<\/title>/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${URL_ABS}">`));
  assert.match(html, new RegExp(`og:url" content="${URL_ABS}"`));
  assert.match(html, /og:image" content="https:\/\/arckit\.org\/certification\/og-image\.png"/);
  assert.match(html, /og:image:width" content="1200"/);
  assert.match(html, /og:image:height" content="630"/);
  assert.match(html, /og:image:alt" content="[^"]+"/);
  assert.match(html, /twitter:image" content="https:\/\/arckit\.org\/certification\/og-image\.png"/);
  assert.match(html, /href="certification\.css\?v=1"/);
  assert.match(html, /class="app-page-hero app-page-hero--certification"/);
  assert.doesNotMatch(html, /ArcKit privacy policy/);
});

test('the landing page links to the policies', () => {
  assert.match(read('certification/index.html'), /<a class="govuk-link" href="policies\.html">read the certification policies<\/a>/);
});

test('the sitemap and llms.txt include the policies page', () => {
  assert.match(read('sitemap.xml'), new RegExp(`<loc>${URL_ABS}</loc>\\s*<lastmod>2026-10-14</lastmod>\\s*<changefreq>monthly</changefreq>\\s*<priority>0\\.4</priority>`));
  assert.match(read('llms.txt'), new RegExp(`## Certification\\n[^#]*\\(${URL_ABS.replace(/\./g, '\\.')}\\)`));
});

test('the policies JSON-LD parses and has a breadcrumb', () => {
  const graph = JSON.parse(read(PAGE).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const page = graph.find((n) => n['@type'] === 'WebPage');
  assert.equal(page['@id'], URL_ABS);
  assert.equal(page.isPartOf['@id'], 'https://arckit.org/#website');
  assert.equal(page.publisher['@id'], 'https://arckit.org/#organization');
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList');
  assert.equal(page.breadcrumb['@id'], crumbs['@id']);
  assert.deepEqual(crumbs.itemListElement.map((i) => i.name), ['ArcKit', 'Certification', 'Policies']);
  assert.equal(crumbs.itemListElement.at(-1).item, URL_ABS);
});

test('the policies page publishes no email address', () => {
  // The domain must end in a letter TLD, so the CDN's "govuk-frontend@5.13.0" version pin is not an address.
  const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?![A-Za-z0-9-])/;
  assert.match('write to someone@example.org', email);
  const html = read(PAGE);
  assert.doesNotMatch(html, email);
  assert.doesNotMatch(html, /mailto:/i);
});

test('the policies page runs no inline script beyond analytics and theme', () => {
  const inline = [...read(PAGE).matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !/application\/ld\+json/.test(attrs))
    .map(([, , body]) => body);
  assert.equal(inline.length, 2);
  assert.match(inline[0], /gtag\('config'/);
  assert.match(inline[1], /arckit-theme/);
});

test('every relative href and src in the policies page resolves to a file', () => {
  const html = read(PAGE);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const target = new URL(ref, `file:///docs/${PAGE}`).pathname.replace(/^\/docs\//, '');
    assert.ok(existsSync(new URL(`../../docs/${target}`, import.meta.url)), `policies.html -> ${ref}`);
  }
});

test('every in-page link on the policies page has a target', () => {
  const html = read(PAGE);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(anchor), `#${anchor}`);
});
