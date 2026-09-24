import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const {
  normalisePriority,
  parseRequirementPriorities,
  checkBacklog,
} = await import(resolve('plugins/arckit-claude/hooks/backlog-totals.mjs'));

const HOOK = resolve('plugins/arckit-claude/hooks/validate-backlog-totals.mjs');

/** A small backlog whose every declared total is correct. */
function consistent() {
  return {
    project: 'Demo',
    summary: {
      total_stories: 4,
      total_epics: 2,
      total_points: 21,
      must_have_points: 13,
      should_have_points: 5,
      could_have_points: 3,
      total_requirements: 3,
    },
    epics: [
      { id: 'EPIC-001', points: 13, stories: ['STORY-001', 'STORY-002'] },
      { id: 'EPIC-002', points: 8, stories: ['STORY-003', 'TASK-NFR-001'] },
    ],
    stories: [
      { id: 'STORY-001', epic: 'EPIC-001', priority: 'Must Have', story_points: 8, sprint: 1, requirements: ['FR-001'] },
      { id: 'STORY-002', epic: 'EPIC-001', priority: 'Should Have', story_points: 5, sprint: 2, requirements: ['FR-002'] },
      { id: 'STORY-003', epic: 'EPIC-002', priority: 'Could Have', story_points: 3, sprint: null, requirements: [] },
      { id: 'TASK-NFR-001', epic: 'EPIC-002', priority: 'MUST_HAVE', story_points: 5, sprint: 1, requirements: ['NFR-P-001'] },
    ],
    sprints: [
      { number: 1, stories: ['STORY-001', 'TASK-NFR-001'] },
      { number: 2, stories: ['STORY-002'] },
    ],
    traceability: [
      { requirement: 'FR-001', stories: ['STORY-001'], sprint: 1 },
      { requirement: 'FR-002', stories: ['STORY-002'], sprint: 2 },
      { requirement: 'NFR-P-001', stories: ['TASK-NFR-001'], sprint: 1 },
    ],
  };
}

const REQ = `# Requirements

### BR-001: Faster booking

**Priority**: MUST_HAVE

#### FR-001: Book an appointment

**Priority**: MUST_HAVE (MoSCoW)

#### FR-002: Cancel an appointment

**Priority**: MUST_HAVE (MoSCoW)

#### NFR-P-001: Response time

**Priority**: CRITICAL
`;

const noFindings = { totals: [], epics: [], sprints: [], priorities: [] };

test('normalisePriority accepts the spellings the command and template use', () => {
  for (const v of ['Must Have', 'MUST_HAVE', 'must', 'M']) assert.equal(normalisePriority(v), 'must');
  for (const v of ["Won't Have", 'WONT_HAVE', 'Won’t Have']) assert.equal(normalisePriority(v), 'wont');
  assert.equal(normalisePriority('Imprescindible'), null);
  assert.equal(normalisePriority('HIGH'), null);
  assert.equal(normalisePriority(undefined), null);
});

test('a consistent backlog passes', () => {
  assert.deepEqual(checkBacklog(consistent()), noFindings);
});

test('declared totals that disagree with the items are reported (#856 INC-01, INC-02, INC-04)', () => {
  const b = consistent();
  b.summary.total_stories = 3;
  b.summary.total_points = 25;
  b.summary.should_have_points = 6;
  const r = checkBacklog(b);
  assert.equal(r.totals.length, 3);
  assert.match(r.totals.join('\n'), /total_stories` is 3, but `stories` holds 4/);
  assert.match(r.totals.join('\n'), /total_points` is 25, but .* add up to 21/);
  assert.match(r.totals.join('\n'), /should_have_points` is 6, but Should Have items add up to 5/);
});

test('epic subtotals that cancel out in the grand total are still caught (#855)', () => {
  const b = consistent();
  b.epics[0].points = 14;
  b.epics[1].points = 7;
  const r = checkBacklog(b);
  assert.deepEqual(r.totals, []);
  assert.equal(r.epics.length, 2);
  assert.match(r.epics[0], /EPIC-001: `points` is 14, but its 2 items add up to 13/);
});

test('epic membership lists must match the items that name the epic', () => {
  const b = consistent();
  b.epics[0].stories = ['STORY-001', 'STORY-003'];
  b.stories.push({ id: 'STORY-009', epic: 'EPIC-404', priority: 'Could Have', story_points: 0, sprint: null });
  b.summary.total_stories = 5;
  const r = checkBacklog(b);
  assert.match(r.epics.join('\n'), /missing from its `stories` list: STORY-002/);
  assert.match(r.epics.join('\n'), /lists STORY-003, which is not an item of this epic/);
  assert.match(r.epics.join('\n'), /STORY-009: `epic` is EPIC-404/);
});

test('a Sprint 0 placeholder is reported on items and traceability rows (#855)', () => {
  const b = consistent();
  b.traceability[2].sprint = 0;
  b.stories[2].sprint = '0';
  const r = checkBacklog(b);
  assert.equal(r.sprints.length, 2);
  assert.match(r.sprints.join('\n'), /traceability NFR-P-001: sprint is 0/);
});

test('a sprint list that disagrees with an item\'s own sprint is reported', () => {
  const b = consistent();
  b.stories[1].sprint = 3;
  const r = checkBacklog(b);
  assert.match(r.sprints.join('\n'), /Sprint 2 lists STORY-002, but STORY-002 has `"sprint": 3`/);
});

test('an unestimated item is reported once and does not cascade into sum errors', () => {
  const b = consistent();
  delete b.stories[0].story_points;
  const r = checkBacklog(b);
  assert.equal(r.totals.length, 1);
  assert.match(r.totals[0], /STORY-001/);
  assert.deepEqual(r.epics, []);
});

test('translated priority labels skip the per-priority sums instead of miscounting', () => {
  const b = consistent();
  b.stories[0].priority = 'Imprescindible';
  b.summary.must_have_points = 999;
  assert.deepEqual(checkBacklog(b).totals, []);
});

test('parseRequirementPriorities reads MoSCoW priorities and skips other scales', () => {
  const p = parseRequirementPriorities(REQ);
  assert.equal(p.get('BR-001'), 'must');
  assert.equal(p.get('FR-001'), 'must');
  assert.equal(p.get('FR-002'), 'must');
  assert.equal(p.has('NFR-P-001'), false);
});

test('parseRequirementPriorities ignores the template placeholder', () => {
  const p = parseRequirementPriorities('#### FR-001: [Name]\n\n**Priority**: [MUST_HAVE | SHOULD_HAVE | COULD_HAVE | WONT_HAVE] (MoSCoW)\n');
  assert.equal(p.size, 0);
});

test('a Must requirement delivered only by a Should item is reported (#856 INC-05)', () => {
  const r = checkBacklog(consistent(), parseRequirementPriorities(REQ));
  assert.equal(r.priorities.length, 1);
  assert.match(r.priorities[0], /FR-002 is Must Have in the requirements document, but its highest-priority backlog item \(STORY-002\) is Should Have/);
});

test('a recorded priority_change reason accepts the lowered priority', () => {
  const b = consistent();
  b.traceability[1].priority_change = 'Deferred to phase 2 by the product owner, 2026-09-20';
  assert.deepEqual(checkBacklog(b, parseRequirementPriorities(REQ)).priorities, []);
});

test('requirements with no backlog item are left to the coverage checks', () => {
  const r = checkBacklog(consistent(), new Map([['FR-099', 'must']]));
  assert.deepEqual(r.priorities, []);
});

test('a backlog without a stories array is reported', () => {
  assert.equal(checkBacklog({ summary: {} }).totals.length, 1);
});

// --- The hook end to end ---

function runHook(filePath, content) {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } }),
    encoding: 'utf8',
  });
  return stdout.trim() ? JSON.parse(stdout) : null;
}

function withProject(fn, { req = REQ } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'arckit-backlog-'));
  const project = join(root, 'projects', '001-demo');
  mkdirSync(project, { recursive: true });
  writeFileSync(join(project, 'ARC-001-REQ-v1.0.md'), '# Old requirements\n');
  if (req !== null) writeFileSync(join(project, 'ARC-001-REQ-v1.3.md'), req);
  try {
    fn(project);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('hook: passes a consistent backlog whose lowered priority is recorded', () => {
  withProject((project) => {
    const b = consistent();
    b.traceability[1].priority_change = 'Agreed with the SRO';
    assert.equal(runHook(join(project, 'ARC-001-BKLG-v1.0.json'), JSON.stringify(b)), null);
  });
});

test('hook: blocks on mismatched totals and reads the latest REQ version', () => {
  withProject((project) => {
    const b = consistent();
    b.summary.total_points = 30;
    const out = runHook(join(project, 'ARC-001-BKLG-v1.0.json'), JSON.stringify(b));
    assert.equal(out.decision, 'block');
    assert.match(out.reason, /total_points` is 30/);
    assert.match(out.reason, /FR-002 is Must Have/);
    assert.match(out.reason, /Recompute every total from the items/);
  });
});

test('hook: skips the priority check when the project has no requirements document', () => {
  withProject((project) => {
    assert.equal(runHook(join(project, 'ARC-001-BKLG-v1.0.json'), JSON.stringify(consistent())), null);
  }, { req: null });
});

test('hook: blocks invalid JSON', () => {
  withProject((project) => {
    const out = runHook(join(project, 'ARC-001-BKLG-v1.0.json'), '{ "stories": [ ');
    assert.equal(out.decision, 'block');
    assert.match(out.reason, /Invalid JSON in ARC-001-BKLG-v1.0.json/);
  });
});

test('hook: ignores files that are not a backlog JSON', () => {
  withProject((project) => {
    assert.equal(runHook(join(project, 'ARC-001-BKLG-v1.0.md'), '# Backlog\n'), null);
    assert.equal(runHook(join(project, 'ARC-001-BKLG-v1.0.csv'), 'Type,Key\n'), null);
    assert.equal(runHook(join(project, 'backlog.json'), '{'), null);
  });
});
