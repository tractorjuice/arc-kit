/**
 * hooks/supplier-isolation.mjs: while /arckit:evaluate or /arckit:score runs,
 * only arckit-evaluate-reader may open a supplier's documents.
 *
 * Research stays clean by not calling WebFetch, but here the same Read tool
 * loads the EVAL and the bids, so the split needs a gate (#873). It has to stay
 * off for /arckit:hld-review, which reads the same folders in the main thread,
 * so the gate is switched per command by a session marker. A frontmatter hook
 * can't do this: it would stay on for the rest of the session.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { decide, isolatingCommand, isSlashCommand, isSupplierPath } from '../../plugins/arckit-claude/hooks/supplier-isolation.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN = resolve(__dirname, '../../plugins/arckit-claude');
const HOOK = resolve(PLUGIN, 'hooks/supplier-isolation.mjs');

const BID = '/repo/projects/001-x/vendors/acme/proposal.pdf';
const read = (file_path, extra = {}) => ({ hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: { file_path }, ...extra });
const grep = (path, cwd = '/nowhere') => ({ hook_event_name: 'PreToolUse', tool_name: 'Grep', tool_input: { pattern: 'x', ...(path ? { path } : {}) }, cwd });
const bash = (command) => ({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } });
const denied = (out) => out?.hookSpecificOutput?.permissionDecision === 'deny';

test('supplier documents are told apart from the files ArcKit writes', () => {
  for (const p of [
    BID,
    'projects/001-x/vendors/acme/proposal.md',
    '/repo/projects/001-x/vendors/acme/pricing/rates.md',
    '/repo/projects/001-x/vendors/acme-proposal.pdf',
    '/repo/projects/001-x/vendors/x/../acme/proposal.pdf',
    // A bid pack can use any name, so nothing in a vendor's folder is ArcKit's.
    '/repo/projects/001-x/vendors/acme/evaluation.md',
    '/repo/projects/001-x/vendors/acme/notes.md',
    '/repo/projects/001-x/vendors/acme/claims.json',
  ]) assert.equal(isSupplierPath(p), true, p);
  for (const p of [
    '/repo/projects/001-x/vendors/scores.json',
    '/repo/projects/001-x/vendors/acme-profile.md',
    '/repo/projects/001-x/vendors/_evaluations/acme/evaluation.md',
    '/repo/projects/001-x/vendors/_evaluations/acme/claims.json',
    '/repo/projects/001-x/ARC-001-EVAL-v1.0.md',
    '/repo/plugins/arckit-claude/vendors/readme.md',
  ]) assert.equal(isSupplierPath(p), false, p);
});

test('only these two commands switch the gate on', () => {
  assert.equal(isolatingCommand('/arckit:evaluate 001'), 'evaluate');
  assert.equal(isolatingCommand('  /arckit:score vendor "Acme" --project=001'), 'score');
  assert.equal(isolatingCommand('/arckit.score compare --project=001'), 'score');
  assert.equal(isolatingCommand('<command-name>/arckit:score</command-name>'), 'score');
  for (const p of ['/arckit:hld-review 001', '/arckit:scorecard', 'why did /arckit:score fail?', 'score the vendor']) {
    assert.equal(isolatingCommand(p), null, p);
  }
});

test('a prompt starting with a slash is a command only if it looks like one', () => {
  for (const p of ['/arckit:hld-review 001', '/commit', '  /superpowers:brainstorm idea']) assert.equal(isSlashCommand(p), true, p);
  for (const p of ['/Users/mark/Downloads/acme.pdf', '/tmp/bid.pdf is the file', 'see /arckit:score', '']) assert.equal(isSlashCommand(p), false, p);
});

test('the main thread cannot read a bid while the gate is on', () => {
  assert.ok(denied(decide(read(BID), { isolated: true })));
  assert.match(decide(read(BID), { isolated: true }).hookSpecificOutput.permissionDecisionReason, /arckit-evaluate-reader/);
});

test('the same read is untouched when the gate is off', () => {
  assert.equal(decide(read(BID), { isolated: false }), null);
});

test('the main thread can still read what ArcKit wrote', () => {
  assert.equal(decide(read('/repo/projects/001-x/vendors/scores.json'), { isolated: true }), null);
  assert.equal(decide(read('/repo/projects/001-x/ARC-001-EVAL-v1.0.md'), { isolated: true }), null);
});

test('the reader may open a bid, under either form of its name', () => {
  for (const agent_type of ['arckit-evaluate-reader', 'arckit:arckit-evaluate-reader']) {
    assert.equal(decide(read(BID, { agent_type, agent_id: 'a1' }), { isolated: true }), null, agent_type);
  }
});

test('no other subagent may open a bid', () => {
  for (const agent_type of ['arckit:arckit-evaluate-writer', 'arckit:arckit-evaluate', 'general-purpose', 'Explore']) {
    assert.ok(denied(decide(read(BID, { agent_type, agent_id: 'a1' }), { isolated: true })), agent_type);
  }
});

test('Grep cannot reach a bid from above its folder', () => {
  const on = { isolated: true };
  const root = mkdtempSync(join(tmpdir(), 'iso-'));
  mkdirSync(join(root, 'projects', '001-x', 'vendors', 'acme'), { recursive: true });
  mkdirSync(join(root, 'projects', '001-x', 'decisions'), { recursive: true });
  assert.ok(denied(decide(grep(join(root, 'projects/001-x/vendors/acme')), on)), 'the bid folder');
  assert.ok(denied(decide(grep(join(root, 'projects/001-x')), on)), 'the project');
  assert.ok(denied(decide(grep(join(root, 'projects')), on)), 'all projects');
  assert.ok(denied(decide(grep(null, root), on)), 'no path, from the repo root');
  assert.equal(decide(grep(join(root, 'projects/001-x/decisions')), on), null, 'a folder with no bids');
  assert.equal(decide(grep(join(root, 'projects/001-x/vendors/scores.json')), on), null, 'an ArcKit file');
});

test('Grep from the root is fine in a repo with no vendor folders', () => {
  const root = mkdtempSync(join(tmpdir(), 'iso-'));
  mkdirSync(join(root, 'projects', '001-x', 'decisions'), { recursive: true });
  assert.equal(decide(grep(null, root), { isolated: true }), null, 'the repo root');
  assert.equal(decide(grep(join(root, 'projects'), root), { isolated: true }), null, 'all projects');
});

test('Bash cannot read a bid', () => {
  for (const c of [
    'cat projects/001-x/vendors/acme/proposal.md',
    'head -60 /repo/projects/001-x/vendors/acme/proposal.md | cat -A',
    'grep -r foo projects/001-x/vendors/',
    'cd projects/001-x/vendors/acme && cat proposal.md',
    'cat projects/001-x/vendors/*/proposal.md',
    'pdftotext projects/001-x/vendors/acme/proposal.pdf -',
    'grep -r price projects/001-x/vendors',
    'find projects/001-x/vendors -type f -exec cat {} +',
    String.raw`cat projects\001-x\vendors\acme\proposal.md`,
    'grep -r price projects/001-x',
    'find projects -type f -exec cat {} +',
    'cat projects/001-x/vendors/acme/evaluation.md',
    'cat vendors/acme/proposal.md',
    'git grep price projects/001-x',
    'git grep price projects/',
    'grep -r price projects/001-x/*',
    String.raw`Get-ChildItem -Recurse projects\001-x | Select-String price`,
  ]) assert.ok(denied(decide(bash(c), { isolated: true })), c);
});

test('PowerShell is held to the same rule as Bash', () => {
  const ps = (command) => ({ hook_event_name: 'PreToolUse', tool_name: 'PowerShell', tool_input: { command } });
  assert.ok(denied(decide(ps(String.raw`Get-Content projects\001-x\vendors\acme\proposal.md`), { isolated: true })));
  assert.equal(decide(ps('Get-Date'), { isolated: true }), null);
});

test('Bash can still do the command\'s own housekeeping', () => {
  for (const c of [
    'git status',
    'mkdir -p projects/001-x/vendors/acme',
    'ls -la projects/001-x/vendors/',
    'cd /repo && ls projects/001-x/vendors/acme',
    'test -d projects/001-x/vendors/acme',
    `python3 -c "import json; json.load(open('projects/001-x/vendors/scores.json'))"`,
    'cat projects/001-x/vendors/_evaluations/acme/evaluation.md',
    'git add projects/001-x/vendors/',
    'git status projects/001-x/vendors/acme',
    'test -f projects/001-x/vendors/acme/proposal.pdf',
    'FOO=1 ls projects/001-x/vendors',
    'cat src/vendors.ts',
    'cat src/vendors/readme.md',
    'curl -s https://example.test/vendors/x',
    'cat projects/001-x/vendors.md',
    'ls projects/001-x/vendors',
    'ls projects/001-x',
    'cat projects/001-x/ARC-001-REQ-v1.0.md',
    'git log --stat projects/001-x',
    'grep vendors README.md',
  ]) assert.equal(decide(bash(c), { isolated: true }), null, c);
});

// --- End to end, through the real hook process and its marker ---

function hook(event) {
  const run = spawnSync('node', [HOOK], { input: JSON.stringify(event), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  return run.stdout.trim() ? JSON.parse(run.stdout) : null;
}

function session() {
  const session_id = randomUUID();
  return {
    prompt: (prompt) => hook({ hook_event_name: 'UserPromptSubmit', session_id, prompt }),
    skill: (skill) => hook({ hook_event_name: 'PreToolUse', tool_name: 'Skill', session_id, tool_input: { skill } }),
    readBid: () => hook({ ...read(BID), session_id }),
  };
}

test('a typed command switches the gate on', () => {
  const s = session();
  assert.equal(s.readBid(), null, 'off before the command');
  s.prompt('/arckit:score vendor "Acme" --project=001');
  assert.ok(denied(s.readBid()));
});

test('a command started through the Skill tool switches it on too', () => {
  const s = session();
  s.prompt('please score Acme for project 001');
  assert.equal(s.readBid(), null);
  s.skill('arckit:evaluate');
  assert.ok(denied(s.readBid()));
});

test('answering a question in chat does not switch it off mid-command', () => {
  const s = session();
  s.prompt('/arckit:evaluate 001');
  s.prompt('The team stood out, and the pricing worries me.');
  assert.ok(denied(s.readBid()));
});

test('replying with a file path does not switch it off mid-command', () => {
  const s = session();
  s.prompt('/arckit:evaluate 001');
  s.prompt('/Users/mark/Downloads/acme.pdf');
  assert.ok(denied(s.readBid()));
});

test('a later /arckit:hld-review can read supplier designs', () => {
  const s = session();
  s.prompt('/arckit:score vendor "Acme" --project=001');
  s.prompt('/arckit:hld-review 001');
  assert.equal(s.readBid(), null);
});

test('another ArcKit command switches it off, but a reference or unrelated skill does not', () => {
  const s = session();
  s.prompt('/arckit:evaluate 001');
  s.skill('superpowers:brainstorming');
  assert.ok(denied(s.readBid()));
  s.skill('arckit:mermaid-syntax');
  assert.ok(denied(s.readBid()));
  s.skill('arckit:hld-review');
  assert.equal(s.readBid(), null);
});

test('sessions do not share a gate', () => {
  const a = session();
  const b = session();
  a.prompt('/arckit:score vendor "Acme" --project=001');
  assert.equal(b.readBid(), null);
});

test('the command refuses to start if the gate can\'t be switched on', () => {
  const noTmp = { ...process.env, TMPDIR: '/nonexistent/arckit-gate' };
  const session_id = randomUUID();
  const run = (event) => spawnSync('node', [HOOK], { input: JSON.stringify({ session_id, ...event }), encoding: 'utf8', env: noTmp });
  const prompt = run({ hook_event_name: 'UserPromptSubmit', prompt: '/arckit:score vendor x' });
  assert.equal(prompt.status, 0, prompt.stderr);
  assert.equal(JSON.parse(prompt.stdout).decision, 'block');
  const skill = run({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'arckit:evaluate' } });
  assert.equal(JSON.parse(skill.stdout).hookSpecificOutput.permissionDecision, 'deny');
  const other = run({ hook_event_name: 'UserPromptSubmit', prompt: '/arckit:hld-review 001' });
  assert.equal(other.stdout.trim(), '', 'other commands are unaffected');
});

test('hooks.json runs the gate on every event it needs', () => {
  const { hooks } = JSON.parse(readFileSync(resolve(PLUGIN, 'hooks/hooks.json'), 'utf8'));
  const uses = (entries) => entries.filter((e) => e.hooks.some((h) => (h.args || []).join().includes('supplier-isolation.mjs')));
  assert.equal(uses(hooks.UserPromptSubmit).length, 1);
  const matchers = uses(hooks.PreToolUse).map((e) => e.matcher).sort();
  assert.deepEqual(matchers, ['Read', 'Read|Grep|Bash|PowerShell', 'Skill']);
});
