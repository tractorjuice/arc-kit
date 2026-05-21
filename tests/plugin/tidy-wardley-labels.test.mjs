import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { tidyMarkdown, tidyFileContent, tidyBlock } = await import(
  resolve('arckit-claude/hooks/tidy-wardley-labels.mjs')
);

// A stub tidy function — wraps the body so we can see exactly what was tidied
// without shelling out to the real placement engine.
const stub = (text) => `TIDIED(${text})`;

test('tidies a fenced mermaid wardley-beta block in markdown', () => {
  const md = [
    '# Wardley Map',
    '',
    'Some prose.',
    '',
    '```mermaid',
    'wardley-beta',
    'component A [0.5, 0.5]',
    '```',
    '',
    'More prose.',
    '',
  ].join('\n');
  const out = tidyMarkdown(md, stub);
  assert.match(out, /```mermaid\nTIDIED\(wardley-beta\ncomponent A \[0\.5, 0\.5\]\)\n```/);
  assert.match(out, /^# Wardley Map$/m);
  assert.match(out, /^Some prose\.$/m);
  assert.match(out, /^More prose\.$/m);
});

test('leaves the canonical ```wardley (OWM) block untouched', () => {
  // ArcKit artefacts carry both a ```wardley OWM block and a ```mermaid block.
  // validate-wardley-math.mjs owns the OWM block; this hook must not touch it.
  const md = [
    '## Map Visualization',
    '',
    '```wardley',
    'title Canonical',
    'component A [0.5, 0.5]',
    '```',
    '',
    '```mermaid',
    'wardley-beta',
    'component A [0.5, 0.5]',
    '```',
    '',
  ].join('\n');
  const out = tidyMarkdown(md, stub);
  assert.match(out, /```wardley\ntitle Canonical\ncomponent A \[0\.5, 0\.5\]\n```/);
  assert.match(out, /```mermaid\nTIDIED\(/);
});

test('leaves a non-wardley mermaid block untouched', () => {
  const md = ['```mermaid', 'flowchart TD', 'A --> B', '```', ''].join('\n');
  assert.equal(tidyMarkdown(md, stub), md);
});

test('tidyFileContent tidies a whole standalone .mmd', () => {
  const mmd = 'wardley-beta\ncomponent A [0.5, 0.5]\n';
  assert.equal(tidyFileContent('map.mmd', mmd, stub), `TIDIED(${mmd})`);
});

test('tidyFileContent ignores a .mmd that is not wardley-beta', () => {
  assert.equal(tidyFileContent('chart.mmd', 'flowchart TD\nA --> B\n', stub), null);
});

test('tidyFileContent ignores unrelated extensions', () => {
  assert.equal(tidyFileContent('notes.txt', 'wardley-beta\n', stub), null);
});

// Integration: exercise the real vendored placement engine (no stub), so a
// broken vendor/ re-sync is caught here rather than at hook runtime.
test('tidyBlock adds real label offsets via the vendored engine', () => {
  const body = [
    'wardley-beta',
    'size [900, 600]',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.55, 0.50]',
  ].join('\n');
  const out = tidyBlock(body);
  assert.match(out, /component Alpha Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.match(out, /component Beta Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.doesNotMatch(out, /\n$/, 'no trailing newline');
});

test('tidyBlock is idempotent', () => {
  const body = 'wardley-beta\nsize [900, 600]\ncomponent A [0.5, 0.5]\ncomponent B [0.4, 0.7]';
  const once = tidyBlock(body);
  assert.equal(tidyBlock(once), once);
});

test('tidyMarkdown with the real engine leaves prose and OWM block intact', () => {
  const md = [
    '## Map',
    '',
    '```wardley',
    'component A [0.5, 0.5]',
    '```',
    '',
    '```mermaid',
    'wardley-beta',
    'size [900, 600]',
    'component A [0.5, 0.5]',
    'component B [0.5, 0.5]',
    '```',
    '',
  ].join('\n');
  const out = tidyMarkdown(md, tidyBlock);
  assert.match(out, /```wardley\ncomponent A \[0\.5, 0\.5\]\n```/);
  assert.match(out, /^## Map$/m);
  assert.match(out, /component A \[0\.5, 0\.5\] label \[-?\d+, -?\d+\]/);
});
