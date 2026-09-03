import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const {
  parseInventoryRows,
  parseValueChainInventory,
  parseCitations,
  parseRegisterDocIds,
  resolveSource,
  checkProvenance,
  normalizeComponentName,
} = await import(resolve('plugins/arckit-claude/hooks/wardley-provenance.mjs'));

const HOOK = resolve('plugins/arckit-claude/hooks/validate-wardley-math.mjs');

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
    '| WVCH-C1 | ARC-001-WVCH-v1.0 | §3 | evidence | "..." |',
    '',
  ];
  assert.deepEqual([...parseRegisterDocIds(lines)], ['VENDOR-A']);
  // Doc IDs are upper-cased so comparison against filenames is case-insensitive.
  assert.equal(parseCitations(lines).get('WVCH-C1'), 'ARC-001-WVCH-V1.0');
});

test('normalises names across case, quoting and emphasis', () => {
  assert.equal(normalizeComponentName('  **"Booking  Portal"** '), 'booking portal');
});

// --- source resolution -----------------------------------------------------

const CONTEXT = {
  citations: new Map([['WVCH-C1', 'ARC-001-WVCH-V1.0']]),
  registerDocIds: new Set(['VENDOR-A']),
  projectDocIds: new Set(['ARC-001-WVCH-V1.0', 'ARC-001-REQ-V1.0']),
  projectDocTypes: new Set(['WVCH', 'REQ']),
  valueChainDocId: 'ARC-001-WVCH-V1.0',
};

test('resolves a document id, a doc-type code, a register id and an assumption', () => {
  for (const cell of ['ARC-001-WVCH-v1.0', 'WVCH', 'REQ', 'VENDOR-A', 'Assumption — my judgement']) {
    assert.equal(resolveSource(cell, CONTEXT).ok, true, `expected '${cell}' to resolve`);
  }
});

test('a value-chain source is recognised through a citation marker', () => {
  const resolved = resolveSource('[WVCH-C1]', CONTEXT);
  assert.equal(resolved.ok, true);
  assert.equal(resolved.citesValueChain, true);
});

test('a REQ source does not claim the value chain', () => {
  assert.equal(resolveSource('REQ', CONTEXT).citesValueChain, false);
});

test('an empty or placeholder Source does not resolve', () => {
  for (const cell of ['', '—', 'N/A', 'TBD']) {
    assert.equal(resolveSource(cell, CONTEXT).ok, false, `expected '${cell}' to fail`);
  }
});

test('a fabricated document id does not resolve', () => {
  const resolved = resolveSource('ARC-001-RSCH-v1.0', CONTEXT);
  assert.equal(resolved.ok, false);
  assert.match(resolved.reason, /is not in this project/);
});

test('a citation the map never declared does not resolve', () => {
  const resolved = resolveSource('[RSCH-C7]', CONTEXT);
  assert.equal(resolved.ok, false);
  assert.match(resolved.reason, /not declared in this map's Citations table/);
});

// --- the two rules ---------------------------------------------------------

function check(rows, overrides = {}) {
  return checkProvenance({
    rows,
    valueChain: parseValueChainInventory(VALUE_CHAIN),
    valueChainDocId: 'ARC-001-WVCH-V1.0',
    citations: CONTEXT.citations,
    registerDocIds: CONTEXT.registerDocIds,
    projectDocIds: CONTEXT.projectDocIds,
    projectDocTypes: CONTEXT.projectDocTypes,
    ...overrides,
  });
}

test('a grounded component with the value chain visibility passes', () => {
  const { rows } = parseInventoryRows(
    inventory('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-v1.0 |')
  );
  const { provenanceErrors, visibilityErrors } = check(rows);
  assert.deepEqual(provenanceErrors, []);
  assert.deepEqual(visibilityErrors, []);
});

test('a component sourced to the value chain but absent from it is blocked', () => {
  const { rows } = parseInventoryRows(
    inventory('| Payments Engine | 0.70 | 0.55 | Product | d | n | ARC-001-WVCH-v1.0 |')
  );
  const { provenanceErrors } = check(rows);
  assert.equal(provenanceErrors.length, 1);
  assert.match(provenanceErrors[0], /Payments Engine/);
  assert.match(provenanceErrors[0], /no component of that name is in ARC-001-WVCH-V1\.0/i);
});

test('visibility that contradicts the cited value chain is blocked', () => {
  const { rows } = parseInventoryRows(
    inventory('| Identity Service | 0.88 | 0.55 | Product | d | n | ARC-001-WVCH-v1.0 |')
  );
  const { visibilityErrors } = check(rows);
  assert.equal(visibilityErrors.length, 1);
  assert.match(visibilityErrors[0], /has visibility 0\.88 but the value chain it cites puts it at 0\.62/);
});

test('a component sourced elsewhere is not joined against the value chain', () => {
  // Same contradiction as above, but the row does not claim the value chain,
  // so a map re-anchored on a different user need is not blocked.
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

function withProject(fn) {
  const root = mkdtempSync(join(tmpdir(), 'arckit-wardley-'));
  const maps = join(root, 'projects', '001-demo', 'wardley-maps');
  mkdirSync(maps, { recursive: true });
  writeFileSync(join(maps, 'ARC-001-WVCH-v1.0.md'), VALUE_CHAIN);
  try {
    return fn(join(maps, 'ARC-001-WARD-v1.0.md'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function mapDocument(...rows) {
  return [
    '# Wardley Map',
    '',
    ...inventory(...rows),
    '```wardley',
    'component Booking Portal [0.95, 0.65]',
    '```',
    '',
  ].join('\n');
}

test('hook: a grounded map passes end to end', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | ARC-001-WVCH-v1.0 |')
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
    assert.match(result.reason, /ARC-001-RSCH-v1\.0 is not in this project/);
  });
});

test('hook: the value-chain visibility join blocks a contradicting number', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Identity Service | 0.88 | 0.55 | Product | d | n | ARC-001-WVCH-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Value-Chain Visibility Mismatches/);
    assert.match(result.reason, /puts it at 0\.62/);
  });
});

test('hook: a project with no value chain leaves the join dormant', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-wardley-'));
  const maps = join(root, 'projects', '001-demo', 'wardley-maps');
  mkdirSync(maps, { recursive: true });
  try {
    const result = runHook(
      join(maps, 'ARC-001-WARD-v1.0.md'),
      mapDocument('| Booking Portal | 0.95 | 0.65 | Product | d | n | Assumption |')
    );
    assert.equal(result, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('hook: the pre-existing math checks still fire alongside the new ones', () => {
  withProject((mapPath) => {
    const result = runHook(
      mapPath,
      mapDocument('| Booking Portal | 0.95 | 0.65 | Genesis | d | n | ARC-001-WVCH-v1.0 |')
    );
    assert.equal(result?.decision, 'block');
    assert.match(result.reason, /Stage-Evolution Mismatches/);
  });
});
