/**
 * PlantUML encoding in the /arckit:pages template (arc-kit#648).
 *
 * The template used PlantUML's ~h hex form: two URL characters per source
 * byte. A large diagram's URL passed the PlantUML server's limit, the server
 * answered 400, and the page said "check diagram syntax" about valid source.
 * Verified on 2026-09-27: a 6 KB diagram gave a 12,144-character hex URL
 * (HTTP 400) and a 1,158-character deflate URL (rendered).
 *
 * The template now uses PlantUML's standard encoding: raw deflate via the
 * browser's CompressionStream, then PlantUML's base64 alphabet. This test runs
 * the template's own functions (extracted from the HTML) offline and checks
 * them against Node's zlib, so it needs no network.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { deflateRawSync, inflateRawSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

const TEMPLATES = [
  'plugins/arckit-claude/templates/pages-template.html',
  '.arckit/templates/pages-template.html',
];
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

async function loadEncoder(templatePath) {
  const html = readFileSync(resolve(templatePath), 'utf8');
  const start = html.indexOf('        const PLANTUML_ALPHABET');
  const end = html.indexOf('        // Marked Configuration');
  assert.ok(start > 0 && end > start, `${templatePath}: PlantUML encoder block not found`);
  const dir = mkdtempSync(join(tmpdir(), 'pu-'));
  const file = join(dir, 'encoder.mjs');
  writeFileSync(
    file,
    html.slice(start, html.lastIndexOf('\n', end))
      + '\nexport { plantumlGetUrl, plantumlEncode64, PLANTUML_MAX_URL };\n',
  );
  return import(pathToFileURL(file).href);
}

function decode64(text) {
  const bytes = [];
  for (let i = 0; i < text.length; i += 4) {
    const [c1, c2, c3, c4] = [...text.slice(i, i + 4)].map((c) => ALPHABET.indexOf(c));
    bytes.push((c1 << 2) | (c2 >> 4), ((c2 & 0xF) << 4) | (c3 >> 2), ((c3 & 0x3) << 6) | c4);
  }
  return Buffer.from(bytes);
}

const SOURCES = {
  small: '@startuml\nAlice -> Bob: hello\n@enduml',
  unicode: '@startuml\nactor "Utilisateur Élodie" as U\nU -> (Réserver) : café ☕\n@enduml',
  large: ['@startuml',
    ...Array.from({ length: 60 }, (_, i) => `component "Service number ${i} with a long descriptive name" as C${i}`),
    ...Array.from({ length: 59 }, (_, i) => `C${i} --> C${i + 1} : calls API endpoint ${i}`),
    '@enduml'].join('\n'),
};

for (const templatePath of TEMPLATES) {
  test(`${templatePath}: URL decodes back to the exact source`, async () => {
    const { plantumlGetUrl } = await loadEncoder(templatePath);
    for (const [name, source] of Object.entries(SOURCES)) {
      const url = await plantumlGetUrl(source, 'svg');
      assert.match(url, /^https:\/\/www\.plantuml\.com\/plantuml\/svg\/[0-9A-Za-z_-]+$/, name);
      const encoded = url.split('/').pop();
      // Trailing padding bytes decode as zeros; inflateRaw stops at the end of stream.
      const roundTrip = inflateRawSync(decode64(encoded), { finishFlush: 2 }).toString('utf8');
      assert.equal(roundTrip, source, `${name} did not round-trip`);
    }
  });

  test(`${templatePath}: base64 step matches PlantUML's alphabet`, async () => {
    const { plantumlEncode64 } = await loadEncoder(templatePath);
    const bytes = deflateRawSync(Buffer.from(SOURCES.small));
    const encoded = plantumlEncode64(new Uint8Array(bytes));
    assert.ok([...encoded].every((c) => ALPHABET.includes(c)));
    assert.equal(encoded.length, Math.ceil(bytes.length / 3) * 4);
  });

  test(`${templatePath}: a large diagram fits under the URL limit that hex broke`, async () => {
    const { plantumlGetUrl, PLANTUML_MAX_URL } = await loadEncoder(templatePath);
    const url = await plantumlGetUrl(SOURCES.large, 'svg');
    const hexLength = 'https://www.plantuml.com/plantuml/svg/~h'.length + Buffer.byteLength(SOURCES.large) * 2;
    assert.ok(hexLength > PLANTUML_MAX_URL, 'fixture no longer exercises the hex failure');
    assert.ok(url.length < PLANTUML_MAX_URL, `deflate URL is ${url.length} characters`);
  });
}

test('the error message no longer blames syntax alone', () => {
  const html = readFileSync(resolve(TEMPLATES[0]), 'utf8');
  assert.ok(!html.includes('PlantUML rendering failed. Check diagram syntax'));
  assert.match(html, /too large for the PlantUML server/);
});
