import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const {
  splitRow,
  parseInventoryRows,
  parseValueChainInventory,
  parseCitations,
  parseRegisterDocIds,
  resolveSource,
  resolveDocRef,
  docTypeOf,
  checkProvenance,
  normalizeComponentName,
} = await import(resolve('plugins/arckit-claude/hooks/wardley-provenance.mjs'));
const { KNOWN_TYPES } = await import(resolve('plugins/arckit-claude/config/doc-types.mjs'));

const HOOK = resolve('plugins/arckit-claude/hooks/validate-wardley-math.mjs');

// The value-chain command writes a multi-instance artefact: ARC-001-WVCH-001-v1.0.md.
// Every fixture below uses that real name, because the first version of this
// suite used an unsequenced name the product never writes and so passed while
// the shipped command blocked every value-chain-sourced row (#850 review).
const WVCH_ID = 'ARC-001-WVCH-001-V1.0';
const WVCH_FILE = 'ARC-001-WVCH-001-v1.0.md';

const INVENTORY_HEADER =
  '| Component | Visibility | Evolution | Stage | Description | Strategic Notes | Source |';
const INVENTORY_RULE =
  '|-----------|-----------|-----------|-------|-------------|-----------------|--------|';

function inventory(...rows) {
  return ['## Component Inventory', '', INVENTORY_HEADER, INVENTORY_RULE, ...rows, ''];
}

const VALUE_CHAIN = `## Component Inventory

| ID | Component | Description | Depends On | Visibility (0.0-1.0) |
|----|-----------|-------------|------------|----------------------|
| C-01 | Booking Portal | Front door | — | 0.95 |
| C-02 | Identity Service | Sign-in | C-01 | 0.62 |
`;

// --- parsing ---------------------------------------------------------------

test('splitRow keeps an escaped pipe and a pipe inside a code span as cell content', () => {
  assert.deepEqual(splitRow('| a | Build \\| Buy | `x | y` | d |'), ['a', 'Build | Buy', '`x | y`', 'd']);
});

test('parses only the Component Inventory tables, not the Evolution Analysis ones', () => {
  const lines = [
    ...inventory('| Booking Portal | 0.95 | 0.65 | Product | d | n | WVCH |'),
    '## Evolution Analysis',
    '',
    '| Component | Current Position | Risk | Opportunity | Action |',
    '|-----------|------------------|------|-------------|--------|',
    '| Booking Portal | 0.65 | high | none | keep |',
  ];
  const { rows } = parseInventoryRows(lines);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'Booking Portal');
  assert.equal(rows[0].source, 'WVCH');
  assert.ok(rows[0].hasSource);
});

test('an escaped pipe in a Description does not shift the Source column', () => {
  const { rows } = parseInventoryRows(
    inventory('| Booking Portal | 0.95 | 0.65 | Product | d | Build \\| Buy pending | ARC-001-WVCH-001-v1.0 |')
  );
  assert.equal(rows[0].source, 'ARC-001-WVCH-001-v1.0');
});

test('an emphasised header row is still recognised, so the check cannot be switched off with bold', () => {
  const { rows } = parseInventoryRows([
    '| **Component** | **Visibility** | **Evolution** | **Stage** | **Description** | **Strategic Notes** | **Source** |',
    '|---|---|---|---|---|---|---|',
    '| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-FAKE-v1.0 |',
  ]);
  assert.equal(rows.length, 1);
  assert.ok(rows[0].hasSource);
});

test('skips template placeholder rows', () => {
  const { rows } = parseInventoryRows(
    inventory('| {Component 1} | 0.95 | 0.65 | Product | d | n | WVCH |')
  );
  assert.deepEqual(rows, []);
});

test('a table with no Source column reports hasSource false', () => {
  const { rows } = parseInventoryRows([
    '| Component | Visibility | Evolution | Stage | Description | Strategic Notes |',
    '|---|---|---|---|---|---|',
    '| Booking Portal | 0.95 | 0.65 | Product | d | n |',
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].hasSource, false);
  assert.equal(rows[0].source, null);
});

test('reads the value chain inventory, ignoring placeholder rows', () => {
  const chain = parseValueChainInventory(VALUE_CHAIN);
  assert.equal(chain.size, 2);
  assert.equal(chain.get('booking portal').visibility, '0.95');
  assert.equal(chain.get('identity service').visibility, '0.62');
});

test('a value-chain row whose visibility is still a template placeholder is not trusted', () => {
  const chain = parseValueChainInventory(
    '| ID | Component | Description | Depends On | Visibility (0.0-1.0) |\n|---|---|---|---|---|\n| C-01 | Booking Portal | {Description} | — | {0.00} |\n'
  );
  assert.equal(chain.size, 0);
});

test('a value chain headed "Component Name" is still parsed', () => {
  const chain = parseValueChainInventory(
    '| ID | Component Name | Visibility |\n|---|---|---|\n| C-01 | Booking Portal | 0.95 |\n'
  );
  assert.equal(chain.get('booking portal').visibility, '0.95');
});

test('reads citations as id -> doc id, and register doc ids', () => {
  const lines = [
    '### Document Register',
    '',
    '| Doc ID | Filename | Type | Source Location | Description |',
    '|---|---|---|---|---|',
    '| VENDOR-A | a.pdf | PDF | vendors/ | Vendor brochure |',
    '',
    '### Citations',
    '',
    '| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |',
    '|---|---|---|---|---|',
    '| WVCH-C1 | ARC-001-WVCH-001-v1.0 | §3 | evidence | "..." |',
    '',
  ];
  assert.deepEqual([...parseRegisterDocIds(lines)], ['VENDOR-A']);
  assert.equal(parseCitations(lines).get('WVCH-C1'), WVCH_ID);
});

test('normalises names across case, quoting and emphasis', () => {
  assert.equal(normalizeComponentName('  **"Booking  Portal"** '), 'booking portal');
});

test('docTypeOf resolves hyphenated registered types and strips sequence numbers', () => {
  assert.equal(docTypeOf('ARC-001-SECD-MOD-v1.0', KNOWN_TYPES), 'SECD-MOD');
  assert.equal(docTypeOf('ARC-001-PRIN-COMP-v1.0', KNOWN_TYPES), 'PRIN-COMP');
  assert.equal(docTypeOf('ARC-001-WVCH-002-v1.0', KNOWN_TYPES), 'WVCH');
  assert.equal(docTypeOf('ARC-000-PRIN-v1.0', KNOWN_TYPES), 'PRIN');
});

test('resolveDocRef takes an exact ID, or the highest version of a version-less reference', () => {
  const ids = new Set(['ARC-001-WVCH-001-V1.0', 'ARC-001-WVCH-001-V1.2', 'ARC-001-REQ-V2.0']);
  assert.equal(resolveDocRef('ARC-001-WVCH-001-v1.0', ids), 'ARC-001-WVCH-001-V1.0');
  assert.equal(resolveDocRef('ARC-001-WVCH-001', ids), 'ARC-001-WVCH-001-V1.2');
  assert.equal(resolveDocRef('ARC-001-WVCH-001-v3.0', ids), null);
  assert.equal(resolveDocRef('ARC-001-RSCH', ids), null);
});

// --- source resolution -----------------------------------------------------

const CONTEXT = {
  citations: new Map([['WVCH-C1', WVCH_ID], ['FAKE-C1', 'ARC-001-RSCH-V1.0']]),
  registerDocIds: new Set(['VENDOR-A', 'ARC-001-RSCH-V1.0']),
  projectDocIds: new Set([WVCH_ID, 'ARC-001-REQ-V1.0', 'ARC-000-PRIN-V1.0', 'ARC-001-SECD-MOD-V1.0']),
  projectDocTypes: new Set(['WVCH', 'REQ', 'PRIN', 'SECD-MOD']),
  defaultValueChainDocId: WVCH_ID,
  knownTypes: KNOWN_TYPES,
};

test('resolves a sequenced document id, a version-less one, a doc-type code, a register id and an assumption', () => {
  for (const cell of ['ARC-001-WVCH-001-v1.0', 'ARC-001-WVCH-001', 'WVCH', 'REQ', 'VENDOR-A', 'Assumption — my judgement', 'ARC-000-PRIN-v1.0', 'ARC-001-SECD-MOD-v1.0', 'SECD-MOD']) {
    assert.equal(resolveSource(cell, CONTEXT).ok, true, `expected '${cell}' to resolve`);
  }
});

test('a value-chain source names the chain it cites, through an id, a marker or the bare code', () => {
  assert.equal(resolveSource('ARC-001-WVCH-001-v1.0', CONTEXT).valueChainDocId, WVCH_ID);
  assert.equal(resolveSource('[WVCH-C1]', CONTEXT).valueChainDocId, WVCH_ID);
  assert.equal(resolveSource('WVCH', CONTEXT).valueChainDocId, WVCH_ID);
});

test('a REQ source does not claim the value chain', () => {
  assert.equal(resolveSource('REQ', CONTEXT).valueChainDocId, null);
});

test('an empty or placeholder Source does not resolve', () => {
  for (const cell of ['', '—', 'N/A', 'TBD']) {
    assert.equal(resolveSource(cell, CONTEXT).ok, false, `expected '${cell}' to fail`);
  }
});

test('a fabricated document id does not resolve', () => {
  const resolved = resolveSource('ARC-001-RSCH-v1.0', CONTEXT);
  assert.equal(resolved.ok, false);
  assert.match(resolved.reason, /is listed in this map's Document Register but is not an artefact/);
  const plain = resolveSource('ARC-001-GRNT-v1.0', CONTEXT);
  assert.equal(plain.ok, false);
  assert.match(plain.reason, /is not an artefact in this repository/);
});

test('a citation the map never declared does not resolve', () => {
  const resolved = resolveSource('[RSCH-C7]', CONTEXT);
  assert.equal(resolved.ok, false);
  assert.match(resolved.reason, /not declared in this map's Citations table/);
});

test('a citation row cannot launder a document that is not on disk', () => {
  const resolved = resolveSource('[FAKE-C1]', CONTEXT);
  assert.equal(resolved.ok, false);
  assert.match(resolved.reason, /cites ARC-001-RSCH-v1\.0, which is not an artefact/i);
});

test('the fix hint names every accepted Source form', () => {
  const { provenanceErrors } = checkProvenance({
    rows: parseInventoryRows(inventory('| X | 0.5 | 0.5 | Custom | d | n | — |')).rows,
    ...CONTEXT,
  });
  for (const form of ['ARC-001-WVCH-001-v1.0', 'WVCH', '[WVCH-C1]', 'Document Register', '`Assumption`']) {
    assert.ok(provenanceErrors[0].includes(form), `hint should mention ${form}`);
  }
});

// --- the two rules ---------------------------------------------------------

function check(rows, overrides = {}) {
  return checkProvenance({
    rows,
    valueChains: new Map([[WVCH_ID, parseValueChainInventory(VALUE_CHAIN)]]),
    defaultValueChainDocId: WVCH_ID,
    citations: CONTEXT.citations,
    registerDocIds: CONTEXT.registerDocIds,
    projectDocIds: CONTEXT.projectDocIds,
    projectDocTypes: CONTEXT.projectDocTypes,
    knownTypes: KNOWN_TYPES,
    ...overrides,
  });
}

test('a grounded component with the value chain visibility passes', () => {
  const { rows } = parseInventoryRows(
    inventory('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
  );
  const { provenanceErrors, visibilityErrors } = check(rows);
  assert.deepEqual(provenanceErrors, []);
  assert.deepEqual(visibilityErrors, []);
});

test('a component sourced to the value chain but absent from it is blocked', () => {
  const { rows } = parseInventoryRows(
    inventory('| Payments Engine | 0.70 | 0.55 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
  );
  const { provenanceErrors } = check(rows);
  assert.equal(provenanceErrors.length, 1);
  assert.match(provenanceErrors[0], /Payments Engine/);
  assert.match(provenanceErrors[0], /no component of that name is in that value chain/i);
});

test('visibility that contradicts the cited value chain is blocked', () => {
  const { rows } = parseInventoryRows(
    inventory('| Identity Service | 0.88 | 0.55 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
  );
  const { visibilityErrors } = check(rows);
  assert.equal(visibilityErrors.length, 1);
  assert.match(visibilityErrors[0], /has visibility 0\.88 but ARC-001-WVCH-001-V1\.0 puts it at 0\.62/);
});

test('the join is against the value chain the row cites, not the project default', () => {
  const second = 'ARC-001-WVCH-002-V1.0';
  const secondChain = parseValueChainInventory(VALUE_CHAIN.replace('0.95', '0.50'));
  const overrides = {
    valueChains: new Map([[WVCH_ID, parseValueChainInventory(VALUE_CHAIN)], [second, secondChain]]),
    projectDocIds: new Set([...CONTEXT.projectDocIds, second]),
    citations: new Map([...CONTEXT.citations, ['X-C1', second]]),
  };
  // Sourced to 002 at 002's number: fine, even though 001 says 0.95.
  let { visibilityErrors } = check(
    parseInventoryRows(inventory('| Booking Portal | 0.50 | 0.65 | Product | d | n | ARC-001-WVCH-002-v1.0 |')).rows,
    overrides,
  );
  assert.deepEqual(visibilityErrors, []);
  // Sourced to 002 through a citation, at 001's number: blocked against 002.
  ({ visibilityErrors } = check(
    parseInventoryRows(inventory('| Booking Portal | 0.95 | 0.65 | Product | d | n | [X-C1] |')).rows,
    overrides,
  ));
  assert.equal(visibilityErrors.length, 1);
  assert.match(visibilityErrors[0], /ARC-001-WVCH-002-V1\.0 puts it at 0\.50/);
});

test('a value chain that exists but has no filled components blocks a row that cites it', () => {
  const { rows } = parseInventoryRows(
    inventory('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
  );
  const { provenanceErrors } = check(rows, { valueChains: new Map([[WVCH_ID, new Map()]]) });
  assert.equal(provenanceErrors.length, 1);
  assert.match(provenanceErrors[0], /has no components yet/);
});

test('a cited value chain that could not be read leaves the row unjoined', () => {
  const { rows } = parseInventoryRows(
    inventory('| Booking Portal | 0.10 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
  );
  const { provenanceErrors, visibilityErrors } = check(rows, { valueChains: new Map() });
  assert.deepEqual(provenanceErrors, []);
  assert.deepEqual(visibilityErrors, []);
});

test('a component sourced elsewhere is not joined against the value chain', () => {
  const { rows } = parseInventoryRows(
    inventory('| Identity Service | 0.88 | 0.55 | Product | d | n | REQ |')
  );
  const { provenanceErrors, visibilityErrors } = check(rows);
  assert.deepEqual(provenanceErrors, []);
  assert.deepEqual(visibilityErrors, []);
});

test('a table with no Source column is not provenance-checked at all', () => {
  const { rows } = parseInventoryRows([
    '| Component | Visibility | Evolution | Stage | Description | Strategic Notes |',
    '|---|---|---|---|---|---|',
    '| Invented Thing | 0.50 | 0.50 | Custom | d | n |',
  ]);
  const { provenanceErrors, visibilityErrors } = check(rows);
  assert.deepEqual(provenanceErrors, []);
  assert.deepEqual(visibilityErrors, []);
});

test('an ungrounded component in a Source-bearing table is blocked with a fix hint', () => {
  const { rows } = parseInventoryRows(
    inventory('| Invented Thing | 0.50 | 0.50 | Custom | d | n | — |')
  );
  const { provenanceErrors } = check(rows);
  assert.equal(provenanceErrors.length, 1);
  assert.match(provenanceErrors[0], /the Source cell is empty/);
  assert.match(provenanceErrors[0], /`Assumption`/);
});

// --- end to end through the hook ------------------------------------------

function runHook(filePath, content) {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } }),
    encoding: 'utf8',
  });
  return stdout.trim() ? JSON.parse(stdout) : null;
}

/** A repo with 000-global (PRIN) and 001-demo (REQ, SECD-MOD, WVCH-001), like the product writes. */
function withProject(fn, { extraFiles = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'arckit-wardley-'));
  const projects = join(root, 'projects');
  const global = join(projects, '000-global');
  const project = join(projects, '001-demo');
  const maps = join(project, 'wardley-maps');
  mkdirSync(global, { recursive: true });
  mkdirSync(maps, { recursive: true });
  writeFileSync(join(global, 'ARC-000-PRIN-v1.0.md'), '# Principles\n');
  writeFileSync(join(project, 'ARC-001-REQ-v1.0.md'), '# Requirements\n');
  writeFileSync(join(project, 'ARC-001-SECD-MOD-v1.0.md'), '# Secure by Design\n');
  writeFileSync(join(maps, WVCH_FILE), VALUE_CHAIN);
  for (const [rel, body] of Object.entries(extraFiles)) {
    mkdirSync(join(root, rel, '..'), { recursive: true });
    writeFileSync(join(root, rel), body);
  }
  try {
    return fn(join(maps, 'ARC-001-WARD-001-v1.0.md'), root);
  } finally {
    chmodSync(project, 0o755);
    rmSync(root, { recursive: true, force: true });
  }
}

function mapDocument(...rows) {
  // The OWM block must agree with the inventory (check 3), so mirror the first
  // row's Booking Portal coordinates when a row supplies them.
  const portal = rows.map((r) => r.match(/^\| Booking Portal \| ([\d.]+) \| ([\d.]+) \|/)).find(Boolean);
  const coords = portal ? `[${portal[1]}, ${portal[2]}]` : '[0.95, 0.65]';
  return [
    '# Wardley Map',
    '',
    ...inventory(...rows),
    '```wardley',
    `component Booking Portal ${coords}`,
    '```',
    '',
  ].join('\n');
}

test('hook: a map sourced to the sequenced value chain the product writes passes end to end', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
    );
    assert.equal(result, null);
  });
});

test('hook: sources in 000-global, a sibling artefact and a hyphenated doc type all resolve', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument(
        '| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-000-PRIN-v1.0 |',
        '| Identity Service | 0.40 | 0.55 | Product | d | n | ARC-001-REQ-v1.0 |',
        '| Audit Log | 0.30 | 0.80 | Commodity | d | n | ARC-001-SECD-MOD-v1.0 |',
        '| Key Store | 0.20 | 0.85 | Commodity | d | n | SECD-MOD |',
      )
    );
    assert.equal(result, null);
  });
});

test('hook: an invented component is blocked and the reason names it', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-RSCH-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Component Provenance/);
    assert.match(result.reason, /ARC-001-RSCH-v1\.0 is not an artefact in this repository/);
  });
});

test('hook: a self-authored Citations row does not launder an invented document', () => {
  withProject((mapPath) => {
    const doc = [
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | [RSCH-C1] |'),
      '### Citations',
      '',
      '| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |',
      '|---|---|---|---|---|',
      '| RSCH-C1 | ARC-001-RSCH-v1.0 | §2 | evidence | "..." |',
      '',
    ].join('\n');
    const result = runHook(mapPath, doc);
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /citation RSCH-C1 cites ARC-001-RSCH-v1\.0, which is not an artefact/i);
  });
});

test('hook: the value-chain visibility join blocks a contradicting number', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Identity Service | 0.88 | 0.55 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Value-Chain Visibility Mismatches/);
    assert.match(result.reason, /puts it at 0\.62/);
  });
});

test('hook: with two value chains, the join follows the one the row cites', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.50 | 0.65 | Product | d | n | ARC-001-WVCH-002-v1.0 |')
    );
    assert.equal(result, null);
  }, { extraFiles: { 'projects/001-demo/wardley-maps/ARC-001-WVCH-002-v1.0.md': VALUE_CHAIN.replace('0.95', '0.50') } });
});

test('hook: a project with no value chain leaves the join dormant', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-wardley-'));
  const maps = join(root, 'projects', '001-demo', 'wardley-maps');
  mkdirSync(maps, { recursive: true });
  try {
    const result = runHook(
      join(maps, 'ARC-001-WARD-001-v1.0.md'),
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | Assumption |')
    );
    assert.equal(result, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('hook: a projects root that cannot be read skips provenance instead of blocking every source', { skip: process.getuid?.() === 0 && 'root ignores mode bits' }, () => {
  withProject((mapPath, root) => {
    chmodSync(join(root, 'projects'), 0o000);
    try {
      const result = runHook(
        mapPath,
        mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
      );
      assert.equal(result, null);
    } finally {
      chmodSync(join(root, 'projects'), 0o755);
    }
  });
});

test('hook: a large external/ drop is not walked and cannot take the math checks down', () => {
  withProject((mapPath, root) => {
    const ext = join(root, 'projects', '001-demo', 'external', 'd0');
    mkdirSync(ext, { recursive: true });
    for (let i = 0; i < 2000; i++) writeFileSync(join(ext, `n${i}.md`), '# x\n');
    // Visibility 1.5 is a check-2 failure; it must still be reported.
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 1.50 | 0.65 | Product | d | n | ARC-001-WVCH-001-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Coordinate|range|1\.50/i);
  });
});

test('hook: the pre-existing math checks still fire alongside the new ones', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.95 | 0.65 | Genesis | d | n | ARC-001-WVCH-001-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Stage-Evolution Mismatches/);
  });
});
