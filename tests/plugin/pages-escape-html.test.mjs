/**
 * Attribute escaping in the /arckit:pages template (arc-kit#875).
 *
 * escapeHtml read text back from a DOM node's innerHTML, which escapes
 * `&`, `<` and `>` but not quotes. Titles and paths go into `href` and
 * `data-path` attributes, so a project folder named
 * `001-x" onmouseover="alert(1)` added an event handler to every nav link.
 * The dashboard also wrote document paths into those attributes unescaped.
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

function loadEscapeHtml(html) {
  const start = html.indexOf('        function escapeHtml(text)');
  assert.ok(start > 0, 'escapeHtml not found');
  const end = html.indexOf('\n        }\n', start);
  return new Function(`${html.slice(start, end + 10)}\nreturn escapeHtml;`)();
}

for (const templatePath of TEMPLATES) {
  const html = readFileSync(resolve(templatePath), 'utf8');

  test(`${templatePath}: escapeHtml escapes quotes as well as markup`, () => {
    const escapeHtml = loadEscapeHtml(html);
    assert.equal(
      escapeHtml(`001-x" onmouseover='alert(1)' <b>&`),
      '001-x&quot; onmouseover=&#39;alert(1)&#39; &lt;b&gt;&amp;',
    );
    assert.equal(escapeHtml(undefined), '');
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(3), '3');
  });

  test(`${templatePath}: href and data-path values are never interpolated raw`, () => {
    const raw = [...html.matchAll(/(?:href="#|data-path=")\$\{(?!escapeHtml\()([^}]*)\}/g)]
      .map((m) => m[0]);
    // `path` in the guides list is escaped when it is assigned.
    assert.deepEqual(raw.filter((m) => !m.endsWith('${path}')), []);
  });
}
