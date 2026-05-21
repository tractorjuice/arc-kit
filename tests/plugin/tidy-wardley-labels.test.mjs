import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { tidyMarkdown, tidyFileContent } = await import(
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
