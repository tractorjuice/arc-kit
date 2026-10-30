import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  assess,
  score,
  anniversary,
  renderComponentChart
} from '../../plugins/arckit-claude/scripts/legacy-assessment.mjs';

const helper = 'plugins/arckit-claude/scripts/legacy-assessment.mjs';
const base = JSON.parse(
  readFileSync('tests/fixtures/legacy-assessment/published-example.input.json')
);
const fresh = () => structuredClone(base);
const result = (a) => assess(a).results.systems[0];
function system(a, id) {
  a.systems.push({
    ...structuredClone(a.systems[0]),
    id,
    name: id,
    components: []
  });
  a.findings.push(
    ...a.findings
      .filter((f) => f.systemId === 'payments')
      .map((f) => ({
        ...structuredClone(f),
        id: `${id}_${f.id}`,
        systemId: id
      }))
  );
}
function dependency(a, consumerId, dependencyId) {
  a.dependencies.push({
    id: `edge_${a.dependencies.length}`,
    consumerId,
    dependencyId,
    externalAssessment: null,
    thresholdId: 'rule_D7',
    qualification: 'qualifies',
    rationale: 'Documented necessary reliance',
    evidenceIds: ['operating_record']
  });
}
function action(a, id = 'containment') {
  const raw = JSON.parse(
    readFileSync(
      'plugins/arckit-claude/evals/fixtures/legacy-unsupported/projects/001-payments/assessment-input.json'
    )
  );
  const act = { ...structuredClone(raw.actions[0]), id };
  a.actions.push(act);
  return act;
}
function cli(raw, flags = ['--json']) {
  const tmp = mkdtempSync(join(tmpdir(), 'legacy-adversarial-'));
  try {
    const file = join(tmp, 'assessment.json');
    writeFileSync(file, raw);
    return spawnSync('node', [helper, '--input', file, ...flags], {
      encoding: 'utf8',
      timeout: 5000,
      maxBuffer: 16 * 1024 * 1024
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

test('operating evidence cannot approve policy', () => {
  const a = fresh();
  a.policies[0].approvalEvidenceIds = ['operating_record'];
  assert.throws(() => assess(a), /approval/i);
});
test('approval for a policy cannot approve this assessment', () => {
  const a = fresh();
  a.metadata.approvalEvidenceIds = ['policy_approval'];
  assert.throws(() => assess(a), /approval/i);
});
test('evidence about another system cannot establish a direct finding', () => {
  const a = fresh();
  system(a, 'unrelated');
  assert.throws(() => assess(a), /scope|system.*evidence/i);
});
test('a component-only Accepted finding cannot cover an unassessed sibling', () => {
  const a = fresh();
  a.systems[0].components.push({
    id: 'untested_database',
    name: 'Database',
    version: '1.0'
  });
  a.findings[0].componentId = 'payments_app';
  assert.equal(result(a).outcome, 'Undetermined');
});
test('D7 cannot originate Legacy without an independently evidenced dependency origin', () => {
  const a = fresh();
  a.findings[6].outcome = 'Legacy';
  assert.throws(() => assess(a), /D7|origin/i);
});
test('a consumer with its own gap still exposes dependency uncertainty at D7', () => {
  const a = fresh();
  a.evidence[1].systemId = null;
  a.evidence[1].componentId = null;
  system(a, 'reporting');
  a.findings[0].outcome = 'Unknown';
  a.findings[0].completeness = 'incomplete';
  a.findings.find((f) => f.id === 'reporting_finding_D3').outcome = 'Unknown';
  dependency(a, 'reporting', 'payments');
  assert.equal(
    assess(a).results.systems[1].criterionResults[6].outcome,
    'Unknown'
  );
});
test('risk acceptance review date participates in proposed next review', () => {
  const a = fresh();
  for (const i of a.riskInputs[0].inputs) i.value = 1;
  a.riskAcceptances.push({
    id: 'acceptance',
    findingIds: ['finding_D1'],
    owner: null,
    rationale: 'Pending owner decision',
    approvalEvidenceIds: [],
    compensatingControls: [],
    reviewDate: '2026-10-29'
  });
  assert.equal(result(a).proposedReviewDate, '2026-10-29');
});
test('confirmed Legacy without a forecast event still recommends urgent review', () => {
  const a = fresh();
  a.findings[0].outcome = 'Legacy';
  assert.equal(result(a).proposedReviewDate, a.metadata.assessmentDate);
});
test('proposal evidence cannot be presented as completed remediation', () => {
  const a = fresh();
  a.evidence.push({
    ...structuredClone(a.evidence[1]),
    id: 'proposal',
    provenance: 'proposal'
  });
  action(a).completionEvidenceIds = ['proposal'];
  assert.throws(() => assess(a), /completion|evidence/i);
});
test('a circular action plan is rejected independently of permissible system cycles', () => {
  const a = fresh();
  const act = action(a);
  act.dependencyActionIds = [act.id];
  assert.throws(() => assess(a), /action.*cycl|self/i);
});
test('an approved risk acceptance requires an accountable owner', () => {
  const a = fresh();
  for (const i of a.riskInputs[0].inputs) i.value = 1;
  a.riskAcceptances.push({
    id: 'acceptance',
    findingIds: ['finding_D1'],
    owner: null,
    rationale: 'Claimed acceptance',
    approvalEvidenceIds: ['policy_approval'],
    compensatingControls: [],
    reviewDate: null
  });
  assert.throws(() => assess(a), /owner|approval/i);
});
test('the public scoring API rejects duplicate and out-of-range scores', () => {
  const inputs = fresh().riskInputs[0].inputs;
  assert.throws(() => score([...inputs, inputs[0]]));
  inputs[0].value = 99;
  assert.throws(() => score(inputs));
});
test('calendar helpers preserve four-digit years and reject impossible dates', () => {
  assert.equal(anniversary('0001-02-28'), '0002-02-28');
  assert.throws(() => anniversary('2026-02-30'));
  assert.throws(() => anniversary('9999-01-01'));
});
for (const key of ['schemaVersion', 'schema\\u0056ersion'])
  test(`duplicate JSON key ${key} is rejected before interpretation`, () => {
    const raw = JSON.stringify(fresh()).replace(
      '{',
      `{"${key}":"unsupported",`
    );
    const r = cli(raw);
    assert.equal(r.status, 1, r.stderr);
    assert.equal(r.stdout, '');
  });
test('invalid UTF-8 is not silently repaired into purported evidence', () => {
  const parts = JSON.stringify(fresh()).split('Synthetic owner decision');
  const raw = Buffer.concat([
    Buffer.from(parts[0] ?? ''),
    Buffer.from([0xc3, 0x28]),
    Buffer.from(parts.slice(1).join('Synthetic owner decision'))
  ]);
  const r = cli(raw);
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
});

// Targeted semantic attacks and independent reference properties.
test('policy approval is tied to the exact version', () => {
  const a = fresh();
  a.policies[0].version = '2.0';
  assert.throws(() => assess(a), /approval/i);
});
test('approval-only documents cannot substitute for observed system evidence', () => {
  const a = fresh();
  a.findings[0].evidenceIds = ['policy_approval'];
  assert.throws(() => assess(a), /evidence/i);
});
test('expired evidence cannot establish an Accepted finding', () => {
  const a = fresh();
  a.evidence[1].validUntil = '2026-10-27';
  assert.throws(() => assess(a), /evidence/i);
});
test('known evidence expiry proposes review before the anniversary', () => {
  const a = fresh();
  for (const i of a.riskInputs[0].inputs) i.value = 1;
  a.evidence[1].validUntil = '2026-11-05';
  assert.equal(result(a).proposedReviewDate, '2026-11-05');
});
test('a correctly targeted assessment approval is accepted, another version is not', () => {
  const a = fresh();
  a.evidence.push({
    ...structuredClone(a.evidence[0]),
    id: 'report_approval',
    approvalFor: [
      {
        kind: 'assessment',
        id: a.metadata.documentId,
        version: '1.0',
        approvedBy: 'Synthetic assessor owner',
        decision: 'approved'
      }
    ]
  });
  a.metadata.approvalEvidenceIds = ['report_approval'];
  assert.equal(result(a).outcome, 'Accepted');
  a.metadata.documentId = 'ARC-001-LEGACY-v1.1';
  assert.throws(() => assess(a), /approval/i);
});
test('component evidence cannot certify an unrelated sibling', () => {
  const a = fresh();
  a.systems[0].components.push({
    id: 'database',
    name: 'Database',
    version: null
  });
  a.evidence[1].componentId = 'database';
  a.findings[0].componentId = 'payments_app';
  assert.throws(() => assess(a), /component scope/i);
});
test('evidence completeness is independent of a known outcome', () => {
  const a = fresh();
  a.findings[0].completeness = 'incomplete';
  const r = result(a);
  assert.equal(r.outcome, 'Accepted');
  assert.equal(r.completeness, 'incomplete');
});
test('provisional dependency origins cannot be laundered through an approved D7 assertion', () => {
  const a = fresh();
  a.evidence[1].systemId = null;
  system(a, 'reporting');
  a.findings[0].outcome = 'Legacy';
  a.policies[0].status = 'draft';
  a.policies[0].approvalEvidenceIds = [];
  dependency(a, 'reporting', 'payments');
  a.findings.find((f) => f.id === 'reporting_finding_D7').outcome = 'Legacy';
  const r = assess(a).results.systems[1];
  assert.equal(r.provisional, true);
  assert.equal(r.criterionResults[6].provisional, true);
});
test('an incomplete management plan remains visible without rewriting classification', () => {
  const a = fresh();
  a.findings[0].outcome = 'Legacy';
  const r = result(a);
  assert.equal(r.outcome, 'Legacy');
  assert.equal(r.actionPlanCompleteness, 'incomplete');
  assert.ok(r.managementGaps.some((g) => g.includes('D1')));
});
test('numeric score ties use locale-independent ID order', () => {
  const a = fresh();
  a.evidence[1].systemId = null;
  system(a, 'Zebra');
  system(a, 'alpha');
  a.riskInputs.push(
    ...['Zebra', 'alpha'].map((systemId) => ({
      ...structuredClone(a.riskInputs[0]),
      systemId
    }))
  );
  assert.deepEqual(assess(a).results.riskOrdering, [
    'Zebra',
    'alpha',
    'payments'
  ]);
});
test('API objects with accessors and unsafe numbers are rejected before reading', () => {
  const a = fresh();
  Object.defineProperty(a.metadata, 'scope', {
    enumerable: true,
    get() {
      throw Error('Getter executed');
    }
  });
  assert.throws(() => assess(a), /accessors/i);
  const b = fresh();
  action(b).cost = Number.MAX_SAFE_INTEGER + 1;
  assert.throws(() => assess(b), /unsafe/i);
});
test('dense acyclic graphs produce bounded witnesses, not exponentially many paths', () => {
  const a = fresh();
  a.evidence[1].systemId = null;
  const ids = [
    'payments',
    ...Array.from({ length: 27 }, (_, i) => `system_${i}`)
  ];
  for (const id of ids.slice(1)) system(a, id);
  a.findings[0].outcome = 'Legacy';
  // Each node consumes every preceding node: over 2^26 simple paths, 28 witnesses.
  for (let i = 1; i < ids.length; i++)
    for (let j = 0; j < i; j++) dependency(a, ids[i], ids[j]);
  const raw = JSON.stringify(a),
    r = cli(raw);
  assert.equal(r.status, 0, r.stderr);
  const output = JSON.parse(r.stdout);
  assert.equal(
    output.results.systems.flatMap((s) => s.dependencyPaths).length,
    28
  );
  assert.ok(output.results.systems.every((s) => s.outcome === 'Legacy'));
});
let seed = 73129;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
test('seeded mixed findings obey independent conservative aggregation and do not mutate input', () => {
  for (let n = 0; n < 180; n++) {
    const a = fresh(),
      outcomes = ['Accepted', 'Action-Required', 'Legacy', 'Unknown'];
    for (const f of a.findings.slice(0, 6))
      f.outcome = outcomes[Math.floor(random() * 4)];
    const before = JSON.stringify(a),
      known = a.findings.map((f) => f.outcome);
    const expected = known.includes('Legacy')
      ? 'Legacy'
      : known.includes('Unknown')
        ? 'Undetermined'
        : known.includes('Action-Required')
          ? 'Action-Required'
          : 'Accepted';
    assert.equal(result(a).outcome, expected);
    assert.equal(JSON.stringify(a), before);
  }
});
test('seeded cyclic graph classifications agree with an independent reachability oracle', () => {
  for (let n = 0; n < 35; n++) {
    const a = fresh();
    a.evidence[1].systemId = null;
    const ids = ['payments', 'b', 'c', 'd', 'e', 'f'];
    for (const id of ids.slice(1)) system(a, id);
    const origins = new Set(ids.filter(() => random() < 0.3));
    for (const f of a.findings)
      if (f.criterionId === 'D1' && origins.has(f.systemId))
        f.outcome = 'Legacy';
    for (const consumer of ids)
      for (const target of ids)
        if (consumer !== target && random() < 0.25)
          dependency(a, consumer, target);
    const reachable = new Set(origins);
    for (let k = 0; k < ids.length; k++)
      for (const e of a.dependencies)
        if (reachable.has(e.dependencyId)) reachable.add(e.consumerId);
    const output = assess(a);
    for (const s of output.results.systems) {
      assert.equal(
        s.outcome,
        reachable.has(s.systemId) ? 'Legacy' : 'Accepted'
      );
      for (const p of s.dependencyPaths) {
        assert.equal(new Set(p.systemPath).size, p.systemPath.length);
        for (let i = 0; i < p.dependencyPath.length; i++) {
          const edge = a.dependencies.find((e) => e.id === p.dependencyPath[i]);
          assert.equal(edge.consumerId, p.systemPath[i]);
          assert.equal(edge.dependencyId, p.systemPath[i + 1]);
        }
      }
    }
  }
});

test('report block verification rejects tampering, stale inputs, missing or duplicate blocks', async () => {
  const { renderResults, verifyReport } = await import(
    '../../plugins/arckit-claude/scripts/legacy-assessment.mjs'
  );
  const a = fresh(),
    block = renderResults(a);
  assert.equal(verifyReport(a, `# Report\n\n${block}`), true);
  assert.throws(
    () => verifyReport(a, block.replace('26.67', '26.68')),
    /disagrees/i
  );
  assert.throws(() => verifyReport(a, block + block), /exactly one/i);
  assert.throws(() => verifyReport(a, 'No calculated block'), /exactly one/i);
  a.metadata.scope += ' Changed scope';
  assert.throws(() => verifyReport(a, block), /disagrees/i);
});
test('report CLI checks the generated block with the same supplied input', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'legacy-report-'));
  try {
    const input = join(tmp, 'input.json'),
      report = join(tmp, 'report.md');
    writeFileSync(input, JSON.stringify(fresh()));
    const generated = spawnSync(
      'node',
      [helper, '--input', input, '--markdown'],
      {
        encoding: 'utf8'
      }
    );
    assert.equal(generated.status, 0, generated.stderr);
    writeFileSync(report, generated.stdout);
    writeFileSync(
      join(tmp, 'ARC-001-LEGACY-v1.0-components.svg'),
      renderComponentChart(fresh())
    );
    const chart = spawnSync('node', [helper, '--input', input, '--svg'], {
      encoding: 'utf8'
    });
    assert.equal(chart.status, 0, chart.stderr);
    writeFileSync(join(tmp, 'ARC-001-LEGACY-v1.0-risk.svg'), chart.stdout);
    const check = () =>
      spawnSync('node', [helper, '--input', input, '--check-report', report], {
        encoding: 'utf8'
      });
    assert.equal(check().status, 0);
    writeFileSync(report, generated.stdout.replace('26.67', '0.00'));
    assert.equal(check().status, 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
test('oversized files and deeply nested JSON fail with no partial stdout', () => {
  const deep = '['.repeat(70) + 'null' + ']'.repeat(70);
  assert.equal(cli(deep).status, 1);
  const r = cli(' '.repeat(16 * 1024 * 1024 + 1));
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
});
test('CLI diagnostics do not replay terminal control characters', () => {
  const raw = '{"\\u001b[31m":"x",' + JSON.stringify(fresh()).slice(1);
  const r = cli(raw);
  assert.equal(r.status, 1);
  assert.ok(!r.stderr.includes('\x1b'));
  assert.ok(r.stderr.length < 2000);
});
test('ordinary acyclic action plans can be long without recursive stack exhaustion', () => {
  const a = fresh(),
    first = action(a);
  first.businessRiskOwner = 'Owner';
  first.deliveryOwner = 'Delivery';
  first.fundingStatus = 'Funded';
  first.targetDate = '2026-11-01';
  for (let i = 1; i < 1200; i++)
    a.actions.push({
      ...structuredClone(first),
      id: `act_${i}`,
      dependencyActionIds: [i === 1 ? first.id : `act_${i - 1}`]
    });
  assert.equal(result(a).outcome, 'Accepted');
});

test('artifact filenames cannot silently disagree with document identity', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'legacy-filename-'));
  try {
    const input = join(tmp, 'ARC-002-LEGACY-v1.0.json');
    writeFileSync(input, JSON.stringify(fresh()));
    const r = spawnSync('node', [helper, '--input', input, '--json'], {
      encoding: 'utf8'
    });
    assert.equal(r.status, 1);
    assert.equal(r.stdout, '');
    assert.match(r.stderr, /filename/i);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
test('missing policy is labelled as such, rather than looking approved', () => {
  const a = fresh();
  a.findings[0].outcome = 'Unknown';
  a.findings[0].thresholdId = null;
  assert.equal(result(a).criterionResults[0].basis, 'no-policy');
});
test('numerical red rating drives review and plan gaps without reclassifying the system', () => {
  const r = result(fresh());
  assert.equal(r.outcome, 'Accepted');
  assert.equal(r.proposedReviewDate, '2026-10-28');
  assert.equal(r.actionPlanCompleteness, 'incomplete');
  assert.ok(r.managementGaps.some((g) => g.includes('red-rated')));
});

test('API aggregate text limits apply even when individual strings fit the schema', () => {
  const a = fresh(),
    text = 'x'.repeat(20000);
  for (let i = 0; i < 850; i++)
    a.evidence.push({
      ...structuredClone(a.evidence[1]),
      id: `large_${i}`,
      observation: text
    });
  assert.throws(() => assess(a), /excessive|limit/i);
});
test('too many causal witnesses fail explicitly without partial JSON', () => {
  const a = fresh();
  a.evidence[1].systemId = null;
  a.findings[0].outcome = 'Legacy';
  const ids = [
    'payments',
    ...Array.from({ length: 255 }, (_, i) => `node_${i}`)
  ];
  for (const id of ids.slice(1)) system(a, id);
  for (let i = 0; i < ids.length; i++)
    dependency(a, ids[i], ids[(i + 1) % ids.length]);
  const r = cli(JSON.stringify(a));
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /complexity limit/i);
  assert.equal(r.stdout, '');
});
test(
  'a named pipe cannot hang the regular-file input interface',
  { skip: process.platform === 'win32' },
  () => {
    const tmp = mkdtempSync(join(tmpdir(), 'legacy-fifo-'));
    try {
      const fifo = join(tmp, 'input');
      assert.equal(spawnSync('mkfifo', [fifo]).status, 0);
      const r = spawnSync('node', [helper, '--input', fifo, '--json'], {
        encoding: 'utf8',
        timeout: 2000
      });
      assert.equal(r.status, 2, r.stderr);
      assert.equal(r.stdout, '');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }
);

test('placeholder owner or approver names cannot manufacture policy approval', () => {
  const a = fresh();
  a.policies[0].owner = 'PENDING';
  assert.throws(() => assess(a), /owner/i);
  const b = fresh();
  b.evidence[0].approvalFor[0].approvedBy = 'Unknown';
  assert.throws(() => assess(b), /approval/i);
});
test('placeholder owner names do not make the action plan complete', () => {
  const a = fresh();
  a.systems[0].businessRiskOwner = 'Unknown';
  assert.ok(
    result(a).managementGaps.some((g) => g.includes('business risk owner'))
  );
});

test('report approval claims cannot contradict the JSON approval state', async () => {
  const { renderResults, verifyReport } = await import(
    '../../plugins/arckit-claude/scripts/legacy-assessment.mjs'
  );
  const a = fresh(),
    control =
      '## Document Control\n\n| Field | Value |\n|-------|-------|\n| **Document ID** | ARC-001-LEGACY-v1.0 |\n| **Version** | 1.0 |\n| **Status** | DRAFT |\n| **Approved By** | PENDING |\n\n## Results\n\n';
  const report = control + renderResults(a);
  assert.equal(verifyReport(a, report), true);
  assert.throws(
    () => verifyReport(a, report.replace('| DRAFT |', '| APPROVED |')),
    /approval/i
  );
  assert.throws(
    () =>
      verifyReport(a, report.replace('| PENDING |', '| Invented approver |')),
    /approval/i
  );
  assert.throws(
    () => verifyReport(a, report.replace('| 1.0 |', '| 9.0 |')),
    /version/i
  );
});
