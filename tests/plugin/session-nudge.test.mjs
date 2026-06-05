import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { selectNudge } = await import(resolve('arckit-claude/hooks/session-nudge.mjs'));

// Build a Map<projNum, Set<code>> from a plain object for terse fixtures.
const codes = (obj) => new Map(Object.entries(obj).map(([k, v]) => [k, new Set(v)]));

test('rule 1: REQ touched but no TRAC on disk → traceability', () => {
  const r = selectNudge({
    projectCodes: codes({ '001': ['REQ'] }),
    diskCodesByProject: codes({ '001': ['REQ'] }),
  });
  assert.ok(r, 'expected a nudge');
  assert.equal(r.command, '/arckit:traceability');
  assert.equal(r.projNum, '001');
  assert.match(r.message, /\/arckit:traceability/);
  assert.match(r.message, /001/);
});

test('rule 2: STKE touched but no REQ on disk → requirements', () => {
  const r = selectNudge({
    projectCodes: codes({ '002': ['STKE'] }),
    diskCodesByProject: codes({ '002': ['STKE'] }),
  });
  assert.ok(r);
  assert.equal(r.command, '/arckit:requirements');
});

test('rule 3: REQ touched, TRAC present, but no DATA → data-model', () => {
  const r = selectNudge({
    projectCodes: codes({ '003': ['REQ'] }),
    diskCodesByProject: codes({ '003': ['REQ', 'TRAC'] }),
  });
  assert.ok(r);
  assert.equal(r.command, '/arckit:data-model');
});

test('rule 4: ADR touched but no DIAG on disk → diagram', () => {
  const r = selectNudge({
    projectCodes: codes({ '004': ['ADR'] }),
    diskCodesByProject: codes({ '004': ['ADR', 'REQ', 'TRAC', 'DATA'] }),
  });
  assert.ok(r);
  assert.equal(r.command, '/arckit:diagram');
});

test('priority: REQ touched, both TRAC and DATA missing → rule 1 (traceability) wins', () => {
  const r = selectNudge({
    projectCodes: codes({ '001': ['REQ'] }),
    diskCodesByProject: codes({ '001': ['REQ'] }), // no TRAC, no DATA
  });
  assert.equal(r.command, '/arckit:traceability');
});

test('no match: REQ touched but TRAC and DATA both present → null', () => {
  const r = selectNudge({
    projectCodes: codes({ '001': ['REQ'] }),
    diskCodesByProject: codes({ '001': ['REQ', 'TRAC', 'DATA'] }),
  });
  assert.equal(r, null);
});

test('multi-project, same rule: lowest project number wins', () => {
  const r = selectNudge({
    projectCodes: codes({ '005': ['REQ'], '002': ['REQ'] }),
    diskCodesByProject: codes({ '005': ['REQ'], '002': ['REQ'] }), // both lack TRAC
  });
  assert.equal(r.projNum, '002');
});

test('empty input → null', () => {
  const r = selectNudge({ projectCodes: new Map(), diskCodesByProject: new Map() });
  assert.equal(r, null);
});
