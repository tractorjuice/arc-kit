import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The Build Provenance block is appended to every artefact ArcKit stamps, so a
// markdown defect in it fails lint in each one — in user repos as well as this
// one. `.markdownlint-cli2.jsonc` sets MD049 to `asterisk`; both stamping hooks
// emitted `_..._` and shipped that violation into every stamped artefact.
//
// Asserted against the source text rather than by invoking the hooks: both are
// PostToolUse entry points that read stdin and write files, and the emphasis
// characters are what the lint rule actually sees.
const STAMPERS = [
  'plugins/arckit-claude/hooks/provenance-stamp.mjs',
  'extensions/arckit-codex/hooks/arckit-codex-hook.mjs',
];

for (const rel of STAMPERS) {
  const src = readFileSync(resolve(rel), 'utf8');

  test(`${rel}: provenance preamble opens with asterisk emphasis (MD049)`, () => {
    assert.match(src, /\*Stamped automatically by/);
  });

  test(`${rel}: provenance preamble uses no underscore emphasis (MD049)`, () => {
    assert.doesNotMatch(src, /_Stamped automatically by/);
  });

  test(`${rel}: the emphasis run is closed with an asterisk`, () => {
    // Grab the emitted preamble and check it terminates on `*` before the
    // following blank line — an unclosed run renders as a literal asterisk.
    const m = src.match(/\*Stamped automatically by[\s\S]*?(\\n\\n\| Field)/);
    assert.ok(m, 'could not locate the provenance preamble');
    assert.match(m[0], /\.\*\\n\\n\| Field/, 'preamble should end `.*` before the table');
  });
}
