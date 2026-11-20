/**
 * Section links in the /arckit:pages site.
 *
 * The site opens a document from the address hash, so `#projects/001-x/ARC-001-REQ-v1.0.md`
 * loads that file. A link to a heading inside a document is also a hash,
 * `#executive-summary`, and the hash handler tried to open it as a file:
 * every "Contents" link written in a document's own Markdown showed
 * "Document not found". A reader of a sample project reported it.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TEMPLATES = [
  'plugins/arckit-claude/templates/pages-template.html',
  '.arckit/templates/pages-template.html',
];

function loadParseHash(html) {
  const start = html.indexOf('        function parseHash(hash)');
  assert.ok(start > 0, 'parseHash not found');
  const end = html.indexOf('\n        }\n', start);
  return new Function(`${html.slice(start, end + 10)}\nreturn parseHash;`)();
}

for (const templatePath of TEMPLATES) {
  const html = readFileSync(resolve(templatePath), 'utf8');

  test(`${templatePath}: a hash with no folder or extension is a section, not a document`, () => {
    const parseHash = loadParseHash(html);
    assert.deepEqual(parseHash('executive-summary'), { section: 'executive-summary' });
    assert.deepEqual(parseHash('br-1-establish-validated-programme-cost-baseline'),
      { section: 'br-1-establish-validated-programme-cost-baseline' });
  });

  test(`${templatePath}: views and documents are still what they were`, () => {
    const parseHash = loadParseHash(html);
    for (const view of ['dashboard', 'guides', 'roles', 'dependency-map']) {
      assert.deepEqual(parseHash(view), { view });
    }
    assert.deepEqual(parseHash('projects/001-x/ARC-001-REQ-v1.0.md'),
      { doc: 'projects/001-x/ARC-001-REQ-v1.0.md', section: '' });
    assert.deepEqual(parseHash('README.md'), { doc: 'README.md', section: '' });
    // The roles index writes its links percent-encoded.
    assert.deepEqual(parseHash('docs%2Fguides%2Froles%2Fenterprise-architect.md'),
      { doc: 'docs%2Fguides%2Froles%2Fenterprise-architect.md', section: '' });
  });

  test(`${templatePath}: a document link can name one of its sections`, () => {
    const parseHash = loadParseHash(html);
    assert.deepEqual(parseHash('projects/001-x/ARC-001-REQ-v1.0.md#executive-summary'),
      { doc: 'projects/001-x/ARC-001-REQ-v1.0.md', section: 'executive-summary' });
  });

  test(`${templatePath}: both hash handlers read the hash through parseHash`, () => {
    assert.match(html, /const initial = parseHash\(window\.location\.hash\.slice\(1\)\);/);
    assert.match(html, /addEventListener\('hashchange', \(\) => \{\s+const target = parseHash\(/);
    // Nothing loads a document straight from the raw hash any more.
    assert.doesNotMatch(html, /const path = window\.location\.hash\.slice\(1\);/);
  });

  test(`${templatePath}: a section link in a document's Markdown scrolls instead of changing the hash`, () => {
    const at = html.indexOf("if (href.startsWith('#')) {");
    assert.ok(at > 0, 'no handler for in-document section links');
    const block = html.slice(at, at + 500);
    assert.match(block, /e\.preventDefault\(\);\s+showSection\(href\.slice\(1\)\);/);
  });

  test(`${templatePath}: the page on show is remembered without its section`, () => {
    // Otherwise a later section link puts an earlier section back in the address.
    assert.equal((html.match(/shownHash = path;/g) || []).length, 2);
    assert.doesNotMatch(html, /shownHash = window\.location\.hash/);
  });

  test(`${templatePath}: a link to the address already on show still opens it`, () => {
    // Setting the hash to its current value fires no hashchange.
    const at = html.indexOf('if (window.location.hash.slice(1) === resolvedPath) {');
    assert.ok(at > 0, 'no same-address case in the document link handler');
    assert.match(html.slice(at, at + 400), /loadDocument\(resolved\.join\('\/'\)\)/);
  });
}
