import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  COMPLETION_ROWS, DATA_ID, DEFAULT_DATA_DIR, PENDING, PROFILE_QUESTIONS, SECTION_DOCS, SECTION_IDS, SIGN_OFFS_SCHEMA,
  STATUS_ORDER, blankWorksheet, checkDocument, completionTargets, emitWorksheet, loadData, parseWorksheet, projectStatus,
  renderDocument
} from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const data = loadData(DEFAULT_DATA_DIR);
const CAFE = 'tests/fixtures/uk-food/project-cafe';
const GOLDEN = join(CAFE, 'expected', 'FOODCMP.body.md');
const DOC_OF = Object.fromEntries(Object.entries(SECTION_DOCS).map(([doc, section]) => [section, doc]));

// A temporary copy of the cafe's project: its worksheets, and no document written.
const cafe = () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-status-'));
  cpSync(join(CAFE, 'food-safety'), join(dir, 'food-safety'), { recursive: true });
  return dir;
};
const sheetFile = (dir, section) => join(dir, 'food-safety', `answers-${section}.md`);
const sheet = (dir, section) => readFileSync(sheetFile(dir, section), 'utf8');
const setSheet = (dir, section, text) => writeFileSync(sheetFile(dir, section), text);
const signOffsFile = (dir) => join(dir, 'food-safety', 'sign-offs.json');
const swap = (text, from, to) => {
  assert.ok(text.includes(from), `${JSON.stringify(from)} is not in the text`);
  return text.replace(from, to);
};
const rendered = (doc, dir) => {
  const result = renderDocument(doc, dir, data);
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  return result.text;
};
// Writes a document into the project as a person's tools would: a line of header text, a fresh
// render, a line of footer text.
const writeDocument = (dir, doc, version = '1.0', body = rendered(doc, dir)) => {
  const file = join(dir, `ARC-001-${doc}-v${version}.md`);
  writeFileSync(file, `Header text for ${doc}.\n\n${body}\n\nFooter text.\n`);
  return file;
};
const status = (dir) => {
  const result = projectStatus(dir, data);
  assert.equal(result.exit, undefined, (result.messages ?? []).join('\n'));
  return result;
};
const docStatus = (dir, code) => status(dir).documents.find((d) => d.code === code);
const linesFor = (dir, code) => status(dir).unfinished.filter((line) => line.code === code).map((line) => line.what);
const signOff = (dir, doc, ...extra) => run('sign-off', '--doc', doc, '--project', dir, '--name', 'Sam Okafor', '--role', 'Owner',
  ...(extra.includes('--version') ? [] : ['--version', '1.0']), ...(extra.includes('--date') ? [] : ['--date', '2026-11-21']), ...extra);
const markerHash = (file) => /answers=([0-9a-f]{64})/.exec(readFileSync(file, 'utf8'))[1];
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// A block's rows and the block itself: the two places a question can sit.
const holders = (block) => [block, ...(block.kind !== 'table' && Array.isArray(block.rows) ? block.rows : [])];
const askedOf = (method) => method.blocks.flatMap(holders).flatMap((h) => h.questions ?? []).filter((q) => q.type !== 'note');
// The completion record's tables in diary.json, and its rows, as printed.
const recordTables = data.diary.pages.flatMap((page) => page.blocks.filter((block) => block.form === 'completionRecord'));
const recordRows = recordTables.flatMap((table) => table.rows);
// The rows of the completion record's table in a render, each split into its cells.
const tableRows = (text) => {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line === `| ${recordTables[0].columns.join(' | ')} |`);
  assert.ok(start >= 0, 'the completion record\'s table is not in the render');
  const rows = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith('| ')) break;
    rows.push(line.slice(2, -2).split(' | '));
  }
  return rows;
};
// The section each row of the completion record belongs to, and its method (null for a section's own row).
const targets = completionTargets(recordRows, data).rows;

// ---- Status ----

test('status counts each document\'s questions from its worksheet, and the cafe\'s CK and XC are as the fixture holds them', () => {
  const dir = cafe();
  const documents = status(dir).documents;
  for (const section of SECTION_IDS) {
    const parsed = parseWorksheet(sheet(dir, section), data);
    const asked = data.sections.get(section).methods.filter((m) => parsed.methods.get(m.id).status !== 'not-relevant').flatMap(askedOf)
      .map((q) => parsed.answers.get(q.id));
    const doc = documents.find((d) => d.code === DOC_OF[section]);
    const expected = {
      questions: asked.length, confirmed: asked.filter((a) => a.answered).length, proposed: asked.filter((a) => a.state === 'proposed').length
    };
    expected.unanswered = expected.questions - expected.confirmed - expected.proposed;
    assert.deepEqual({ questions: doc.questions, confirmed: doc.confirmed, proposed: doc.proposed, unanswered: doc.unanswered }, expected, section);
  }
  const cook = documents.find((d) => d.code === 'FOODCOOK');
  // CK-06 is not relevant, so its questions are not counted; every other CK question is confirmed.
  const ck = data.sections.get('CK').methods;
  assert.equal(cook.questions, ck.filter((m) => m.id !== 'CK-06').flatMap(askedOf).length);
  assert.ok(cook.questions < ck.flatMap(askedOf).length);
  assert.equal(cook.confirmed, cook.questions);
  assert.equal(cook.unanswered, 0);
  assert.deepEqual(cook.notRelevantMethods, ['CK-06']);
  assert.deepEqual(cook.adaptedMethods, []);
  const xc = documents.find((d) => d.code === 'FOODXC');
  assert.equal(xc.questions, data.sections.get('XC').methods.flatMap(askedOf).length);
  assert.equal(xc.proposed, 2);
  assert.ok(xc.confirmed > 0 && xc.unanswered > 0);
  assert.deepEqual(documents.find((d) => d.code === 'FOODCLN').adaptedMethods, ['CL-04']);
  const profile = documents.find((d) => d.code === 'FOODPROF');
  assert.deepEqual([profile.questions, profile.confirmed], [PROFILE_QUESTIONS.length, PROFILE_QUESTIONS.length]);
  const own = documents.find((d) => d.code === 'FOODOWN');
  assert.deepEqual([own.questions, own.confirmed, own.proposed, own.unanswered], [2, 2, 0, 0]);
});

test('the status JSON has the documented shape: the seven documents in order, then the special processes, the own entries awaiting review and what is unfinished', () => {
  const dir = cafe();
  const result = status(dir);
  assert.deepEqual(Object.keys(result), ['data', 'documents', 'specialProcesses', 'ownAwaitingReview', 'unfinished']);
  assert.equal(result.data, DATA_ID);
  assert.deepEqual(result.documents.map((d) => d.code), ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN']);
  assert.deepEqual(STATUS_ORDER, result.documents.map((d) => d.code));
  for (const doc of result.documents) {
    assert.deepEqual(Object.keys(doc), ['code', 'worksheets', 'missingWorksheets', 'problems', 'questions', 'confirmed', 'proposed',
      'unanswered', 'notRelevantMethods', 'adaptedMethods', 'file', 'version', 'rendered', 'inSync', 'signedOff', 'signOff'], doc.code);
    assert.deepEqual([doc.file, doc.version, doc.rendered, doc.inSync, doc.signedOff, doc.signOff], [null, null, false, false, false, null], doc.code);
    assert.deepEqual([doc.missingWorksheets, doc.problems], [[], 0], doc.code);
  }
  const worksheets = Object.fromEntries(result.documents.map((d) => [d.code, d.worksheets]));
  assert.deepEqual(worksheets.FOODCOOK, ['answers-CK.md', 'answers-profile.md']);
  assert.deepEqual(worksheets.FOODOWN, ['answers-own.md', 'answers-profile.md']);
  assert.deepEqual(worksheets.FOODPROF, ['profile', ...SECTION_IDS, 'own'].map((s) => `answers-${s}.md`));
  assert.deepEqual(result.specialProcesses, [
    { name: 'sous vide', ownEntry: 'OWN-02', ehReview: 'pending' },
    { name: 'low temperature cooking', ownEntry: null, ehReview: null }
  ]);
  assert.deepEqual(result.ownAwaitingReview, ['OWN-02']);
  for (const line of result.unfinished) assert.deepEqual(Object.keys(line), ['code', 'what']);
  const cli = run('status', '--project', dir, '--json');
  assert.equal(cli.status, 0, cli.stderr);
  assert.deepEqual(JSON.parse(cli.stdout), result);
});

test('the unfinished list says, for each document in order, everything outstanding, then each special process with no own entry and each own entry awaiting review', () => {
  const dir = cafe();
  assert.deepEqual(status(dir).unfinished, [
    { code: 'FOODPROF', what: 'document not written' },
    { code: 'FOODPROF', what: 'document not signed off' },
    { code: 'FOODXC', what: `${docStatus(dir, 'FOODXC').unanswered} questions not yet answered` },
    { code: 'FOODXC', what: '2 answers proposed and not confirmed' },
    { code: 'FOODXC', what: 'document not written' },
    { code: 'FOODXC', what: 'document not signed off' },
    { code: 'FOODCLN', what: `${docStatus(dir, 'FOODCLN').questions} questions not yet answered` },
    { code: 'FOODCLN', what: 'document not written' },
    { code: 'FOODCLN', what: 'document not signed off' },
    { code: 'FOODCHL', what: `${docStatus(dir, 'FOODCHL').unanswered} questions not yet answered` },
    { code: 'FOODCHL', what: 'document not written' },
    { code: 'FOODCHL', what: 'document not signed off' },
    { code: 'FOODCOOK', what: 'document not written' },
    { code: 'FOODCOOK', what: 'document not signed off' },
    { code: 'FOODMGT', what: `${docStatus(dir, 'FOODMGT').questions} questions not yet answered` },
    { code: 'FOODMGT', what: 'document not written' },
    { code: 'FOODMGT', what: 'document not signed off' },
    { code: 'FOODOWN', what: 'document not written' },
    { code: 'FOODOWN', what: 'document not signed off' },
    { code: 'FOODOWN', what: 'low temperature cooking has no own entry: add an own entry of kind special-process whose Process is low temperature cooking, and confirm it' },
    { code: 'FOODOWN', what: 'own entry OWN-02 (Sous vide eggs) awaiting environmental health review' }
  ]);
  // A worksheet not started, and one with problems, come first.
  rmSync(sheetFile(dir, 'CK'));
  setSheet(dir, 'MG', `${sheet(dir, 'MG')}a line that is not understood\nand another\n`);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual(cook.missingWorksheets, ['answers-CK.md']);
  assert.equal(cook.questions, data.sections.get('CK').methods.flatMap(askedOf).length);
  assert.deepEqual(linesFor(dir, 'FOODCOOK').slice(0, 2), ['worksheet answers-CK.md not started', `${cook.questions} questions not yet answered`]);
  assert.equal(docStatus(dir, 'FOODMGT').problems, 2);
  assert.equal(linesFor(dir, 'FOODMGT')[0], 'worksheet answers-MG.md has 2 problems');
  // The profile reads every worksheet, so it cannot be rendered while one has problems.
  assert.equal(docStatus(dir, 'FOODPROF').problems, 2);
  assert.equal(linesFor(dir, 'FOODPROF')[0], 'worksheet answers-MG.md has 2 problems');
});

test('a worksheet with problems has none of its answers counted as confirmed', () => {
  const dir = cafe();
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a line that is not understood\n`);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.equal(cook.problems, 1);
  assert.equal(cook.confirmed, 0);
  assert.equal(cook.unanswered, cook.questions);
  // A worksheet in the wrong file is a problem too, and nothing in it is counted.
  setSheet(dir, 'CK', sheet(dir, 'XC'));
  const misplaced = docStatus(dir, 'FOODCOOK');
  assert.equal(misplaced.problems, 1);
  assert.equal(misplaced.confirmed, 0);
});

test('status exits 0 however unfinished the work, prints readable lines without --json, and exits 2 on a usage or input error', () => {
  const dir = cafe();
  const text = run('status', '--project', dir);
  assert.equal(text.status, 0, text.stderr);
  assert.equal(text.stderr, '');
  const lines = text.stdout.split('\n');
  assert.ok(lines.some((line) => line.startsWith('FOODCOOK') && line.includes('41 of 41 questions confirmed') && line.includes('not relevant: CK-06')), text.stdout);
  assert.ok(lines.some((line) => line.startsWith('FOODCLN') && line.includes('adapted: CL-04')), text.stdout);
  assert.ok(lines.some((line) => line.includes('sous vide') && line.includes('OWN-02') && line.includes('pending')), text.stdout);
  for (const { code, what } of status(dir).unfinished) assert.ok(lines.includes(`- ${code}: ${what}`), what);
  const empty = mkdtempSync(join(tmpdir(), 'uk-food-empty-'));
  const nothing = run('status', '--project', empty, '--json');
  assert.equal(nothing.status, 0, nothing.stderr);
  const started = JSON.parse(nothing.stdout);
  assert.deepEqual(started.documents.find((d) => d.code === 'FOODCOOK').missingWorksheets, ['answers-CK.md', 'answers-profile.md']);
  for (const args of [['status'], ['status', '--project'], ['status', '--project', dir, '--extra'], ['status', '--json']]) {
    const result = run(...args);
    assert.equal(result.status, 2, args.join(' '));
    assert.match(result.stderr, /usage: uk-food\.mjs/, args.join(' '));
  }
  const missing = run('status', '--project', join(empty, 'no-such-folder'));
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /no-such-folder/);
});

test('of several versions of a document, the highest by number is current: 1.10 comes after 1.9, and 2 after both', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK', '1.9');
  writeDocument(dir, 'FOODCOOK', '1.10');
  assert.equal(docStatus(dir, 'FOODCOOK').file, 'ARC-001-FOODCOOK-v1.10.md');
  writeDocument(dir, 'FOODCOOK', '2');
  assert.deepEqual([docStatus(dir, 'FOODCOOK').file, docStatus(dir, 'FOODCOOK').version], ['ARC-001-FOODCOOK-v2.md', '2']);
  // A file under food-safety/, or one not named for a document, is not a document.
  writeFileSync(join(dir, 'food-safety', 'ARC-001-FOODCOOK-v9.0.md'), 'not here');
  writeFileSync(join(dir, 'ARC-001-FOODCOOK-v9.0.txt'), 'not this');
  writeFileSync(join(dir, 'ARC-1-FOODCOOK-v9.0.md'), 'not this either');
  assert.equal(docStatus(dir, 'FOODCOOK').version, '2');
});

test('a document is in step only when it passes check: an edited document is out of date', () => {
  const dir = cafe();
  const file = writeDocument(dir, 'FOODCOOK');
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.file, cook.version, cook.rendered, cook.inSync], ['ARC-001-FOODCOOK-v1.0.md', '1.0', true, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), ['document not signed off']);
  writeFileSync(file, swap(readFileSync(file, 'utf8'), 'Poached eggs', 'Boiled eggs'));
  assert.equal(docStatus(dir, 'FOODCOOK').inSync, false);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), ['document ARC-001-FOODCOOK-v1.0.md out of date: it does not match its worksheets',
    'document not signed off']);
});

test('a special process is covered by the confirmed own entry whose Process names it, never by an entry\'s title', () => {
  const dir = cafe();
  // The profile says yes to smoking or curing meat or fish too. OWN-03 names it in its Process; OWN-04's
  // title names low temperature cooking, but its Process is sous vide, so it does not cover it.
  setSheet(dir, 'profile', sheet(dir, 'profile').replace(/(### PR-Q15\n\n[^\n]*\nAnswer: )no/, '$1yes'));
  const entry = (id, title, process) => [`## ${id} ${title}`, '', 'Kind: special-process', `Process: ${process}`, 'Hazard:', 'Control:',
    'Limit:', 'Limit-source:', 'Check:', 'If-it-fails:', 'Supplied-text: Our written method', 'EH-review: 2026-12-01 accepted',
    'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20'].join('\n');
  setSheet(dir, 'own', `${sheet(dir, 'own')}\n${entry('OWN-03', 'Hot smoked salmon', 'smoking or curing meat/fish')}\n\n` +
    `${entry('OWN-04', 'Low temperature cooking of eggs', 'sous vide')}\n`);
  assert.deepEqual(parseWorksheet(sheet(dir, 'own'), data).problems, []);
  assert.deepEqual(status(dir).specialProcesses, [
    { name: 'sous vide', ownEntry: 'OWN-02', ehReview: 'pending' },
    { name: 'low temperature cooking', ownEntry: null, ehReview: null },
    { name: 'smoking or curing meat/fish', ownEntry: 'OWN-03', ehReview: '2026-12-01 accepted' }
  ]);
});

// ---- Sign-off ----

test('sign-off of CK records who, what and when, with the answers hash the document carries, and status shows it signed off', () => {
  const dir = cafe();
  const file = writeDocument(dir, 'FOODCOOK');
  const result = signOff(dir, 'FOODCOOK', '--paper-signed', 'yes');
  assert.equal(result.status, 0, result.stderr);
  const record = { doc: 'FOODCOOK', version: '1.0', file: 'ARC-001-FOODCOOK-v1.0.md', name: 'Sam Okafor', role: 'Owner', date: '2026-11-21',
    paperSigned: 'yes', answers: markerHash(file) };
  const text = readFileSync(signOffsFile(dir), 'utf8');
  assert.equal(text, `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [record] }, null, 2)}\n`);
  assert.deepEqual(Object.keys(JSON.parse(text).signOffs[0]), ['doc', 'version', 'file', 'name', 'role', 'date', 'paperSigned', 'answers']);
  // One line, saying what was recorded and that the document's header still says DRAFT.
  assert.equal(result.stdout.trimEnd().split('\n').length, 1, result.stdout);
  for (const word of ['Sam Okafor', 'ARC-001-FOODCOOK-v1.0.md', '2026-11-21', 'DRAFT']) assert.ok(result.stdout.includes(word), word);
  assert.equal(result.stderr, '');
  const cook = docStatus(dir, 'FOODCOOK');
  assert.equal(cook.signedOff, true);
  assert.deepEqual(cook.signOff, record);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  // The helper does not edit the document.
  assert.ok(readFileSync(file, 'utf8').startsWith('Header text for FOODCOOK.'));
  assert.equal(checkDocument('FOODCOOK', dir, file, data).exit, 0);
});

test('sign-off takes today\'s date and paper signed "no" when they are not given', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  const result = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0');
  assert.equal(result.status, 0, result.stderr);
  const [record] = JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs;
  assert.equal(record.date, today());
  assert.equal(record.paperSigned, 'no');
});

test('a sign-off name written with a joiner or a direction mark is accepted and recorded as given; a direction override is not', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  // Hindi with a joiner, then Arabic followed by a left-to-right mark.
  const name = '\u092a\u0926\u094d\u200d\u092e\u093e \u0645\u0631\u064a\u0645\u200e';
  const refused = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam\u202eOkafor', '--role', 'Owner', '--version', '1.0');
  assert.equal(refused.status, 2);
  const result = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', name, '--role', 'Owner', '--version', '1.0',
    '--date', '2026-11-21');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(docStatus(dir, 'FOODCOOK').signOff.name, name);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  assert.ok(tableRows(rendered('FOODCMP', dir)).some((row) => row[2] === name));
});

test('sign-off of XC is refused, saying why, and nothing is written', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODXC');
  const refused = signOff(dir, 'FOODXC');
  assert.equal(refused.status, 1);
  assert.equal(refused.stdout, '');
  const xc = docStatus(dir, 'FOODXC');
  assert.ok(refused.stderr.includes(`${xc.unanswered} questions not yet answered`), refused.stderr);
  assert.ok(refused.stderr.includes('2 answers proposed and not confirmed'), refused.stderr);
  assert.ok(!existsSync(signOffsFile(dir)));
  // With a sign-offs file already there, it is left byte for byte as it was.
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const before = readFileSync(signOffsFile(dir));
  assert.equal(signOff(dir, 'FOODXC').status, 1);
  assert.ok(readFileSync(signOffsFile(dir)).equals(before));
});

test('sign-off is refused, writing nothing, when the document is not written, is another version, does not pass check, or lacks a worksheet', () => {
  const dir = cafe();
  const refused = (args, pattern) => {
    const result = signOff(dir, 'FOODCOOK', ...args);
    assert.equal(result.status, 1, `${args.join(' ')}: ${result.stderr}`);
    assert.match(result.stderr, pattern, args.join(' '));
    assert.ok(!existsSync(signOffsFile(dir)), args.join(' '));
  };
  refused([], /no FOODCOOK document/);
  const file = writeDocument(dir, 'FOODCOOK');
  refused(['--version', '1.1'], /ARC-001-FOODCOOK-v1\.0\.md, version 1\.0, not version 1\.1/);
  writeFileSync(file, swap(readFileSync(file, 'utf8'), 'Poached eggs', 'Boiled eggs'));
  refused([], /does not pass check/);
  writeDocument(dir, 'FOODCOOK');
  rmSync(sheetFile(dir, 'profile'));
  refused([], /answers-profile\.md does not exist/);
});

test('Review Focus 5a: editing one CK answer after sign-off makes it not signed off, and says who signed it and that it changed', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const cook = docStatus(dir, 'FOODCOOK');
  assert.equal(cook.signedOff, false);
  assert.equal(cook.inSync, false);
  assert.equal(cook.signOff.name, 'Sam Okafor');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), ['document ARC-001-FOODCOOK-v1.0.md out of date: it does not match its worksheets',
    'signed off by Sam Okafor on 2026-11-21, but changed since: sign off again']);
});

test('a change to a worksheet that does not change what is read (a byte order mark, line endings, spaces at the ends of lines, blank lines at the end) leaves it signed off', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const text = sheet(dir, 'CK');
  const spaced = `\ufeff${text.replace(/\n/g, ' \t\r\n')}\r\n\r\n`;
  // What is read, without the line numbers it was read from.
  const read = (worksheet) => JSON.stringify([...parseWorksheet(worksheet, data).answers.values()].map(({ line, ...answer }) => answer));
  assert.equal(read(spaced), read(text));
  setSheet(dir, 'CK', spaced);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff], [true, true]);
  // A blank line added inside the worksheet is not set aside: blank lines carry meaning in a worksheet
  // (one ends a value, and the guidance comment is compared line by line), so the hash changes.
  setSheet(dir, 'CK', swap(text, '### CK-02-Q01', '\n### CK-02-Q01'));
  assert.equal(read(sheet(dir, 'CK')), read(text));
  assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').signedOff], [false, false]);
});

test('Review Focus 5b: a section with every method not relevant, each with its reason and decider, can be signed off; with one reason missing it cannot', () => {
  const methods = new Map(data.sections.get('CL').methods.map((m) => [m.id, { status: 'not-relevant', reason: `We have no need of ${m.id}.`, decidedBy: 'Sam Okafor' }]));
  const none = emitWorksheet({ data: DATA_ID, section: 'CL', methods, answers: new Map(), entries: new Map(), problems: [] }, data);
  const dir = cafe();
  setSheet(dir, 'CL', none);
  writeDocument(dir, 'FOODCLN');
  const clean = docStatus(dir, 'FOODCLN');
  assert.deepEqual([clean.questions, clean.confirmed, clean.proposed, clean.unanswered, clean.problems], [0, 0, 0, 0, 0]);
  assert.deepEqual(clean.notRelevantMethods, data.sections.get('CL').methods.map((m) => m.id));
  assert.equal(signOff(dir, 'FOODCLN').status, 0);
  assert.equal(docStatus(dir, 'FOODCLN').signedOff, true);
  const other = cafe();
  setSheet(other, 'CL', none);
  writeDocument(other, 'FOODCLN');
  setSheet(other, 'CL', swap(none, 'Reason: We have no need of CL-02.', 'Reason:'));
  const result = signOff(other, 'FOODCLN');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /answers-CL\.md has 1 problem/);
  assert.match(result.stderr, /CL-02 is not-relevant, so it needs Reason/);
  assert.ok(!existsSync(signOffsFile(other)));
  assert.equal(docStatus(other, 'FOODCLN').problems, 1);
});

test('sign-off of version 1.0, then a new file for version 1.1: the new document is not signed off until it is signed itself', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  writeDocument(dir, 'FOODCOOK', '1.1');
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.file, cook.version, cook.inSync, cook.signedOff], ['ARC-001-FOODCOOK-v1.1.md', '1.1', true, false]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), ['signed off by Sam Okafor on 2026-11-21, but changed since: sign off again']);
  assert.equal(signOff(dir, 'FOODCOOK').status, 1);
  assert.equal(signOff(dir, 'FOODCOOK', '--version', '1.1').status, 0);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
});

test('two sign-offs for one document: the newest governs', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const second = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0',
    '--date', '2026-11-22');
  assert.equal(second.status, 0, second.stderr);
  assert.equal(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.length, 2);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').signOff.name], [true, 'Priya Shah']);
  // Priya then signs off version 1.1, which is later removed: Sam's sign-off of 1.0 matches the file
  // now current, but it is not the newest, so the document is not signed off.
  const later = writeDocument(dir, 'FOODCOOK', '1.1');
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.1').status, 0);
  rmSync(later);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.version, cook.signedOff, cook.signOff.version], ['1.0', false, '1.1']);
});

test('a sign-offs.json that is not valid JSON or has the wrong shape: status, the completion record and sign-off exit 2, say so, and never change it', () => {
  const record = { doc: 'FOODCOOK', version: '1.0', file: 'ARC-001-FOODCOOK-v1.0.md', name: 'Sam Okafor', role: 'Owner', date: '2026-11-21',
    paperSigned: 'no', answers: 'a'.repeat(64) };
  const shaped = (signOffs, schema = SIGN_OFFS_SCHEMA) => JSON.stringify({ schema, signOffs });
  const cases = ['{ "schema": ', '[]', shaped([], 'uk-food-sign-offs-0.1'), JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: {} }),
    JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [], extra: 1 }), shaped([{ ...record, answers: undefined }]),
    shaped([{ ...record, note: 'x' }]), shaped([{ ...record, date: '2026-02-30' }]), shaped([{ ...record, paperSigned: 'maybe' }]),
    shaped([{ ...record, doc: 'FOODCMP' }]), shaped([{ ...record, file: 'ARC-001-FOODXC-v1.0.md' }]), shaped([{ ...record, name: ' ' }]),
    shaped([{ ...record, name: 'Sam\nOkafor' }]), shaped([{ ...record, answers: 'not a hash' }])];
  for (const text of cases) {
    const dir = cafe();
    writeDocument(dir, 'FOODCOOK');
    writeFileSync(signOffsFile(dir), text);
    for (const args of [['status', '--project', dir], ['render', '--doc', 'FOODCMP', '--project', dir]]) {
      const result = run(...args);
      assert.equal(result.status, 2, `${text}: ${args[0]}`);
      assert.equal(result.stdout, '', text);
      assert.ok(result.stderr.includes(signOffsFile(dir)), result.stderr);
      assert.doesNotMatch(result.stderr, /usage:|TypeError/, text);
    }
    assert.equal(projectStatus(dir, data).exit, 2, text);
    const refused = signOff(dir, 'FOODCOOK');
    assert.equal(refused.status, 2, text);
    assert.ok(refused.stderr.includes(signOffsFile(dir)), refused.stderr);
    assert.equal(readFileSync(signOffsFile(dir), 'utf8'), text);
  }
});

test('sign-off exits 2, writing nothing, on a usage error: the completion record, an empty name or role, a date that is not real, or paper signed not yes or no', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  const base = ['sign-off', '--project', dir, '--version', '1.0'];
  const person = ['--name', 'Sam Okafor', '--role', 'Owner'];
  for (const args of [
    ['--doc', 'FOODCMP', ...person], ['--doc', 'FOODNONE', ...person], ['--doc', 'FOODCOOK', '--name', '', '--role', 'Owner'],
    ['--doc', 'FOODCOOK', '--name', '  \t ', '--role', 'Owner'], ['--doc', 'FOODCOOK', '--name', 'Sam Okafor', '--role', ''],
    ['--doc', 'FOODCOOK', '--name', 'Sam Okafor', '--role', '   '], ['--doc', 'FOODCOOK', '--name', 'Sam\nOkafor', '--role', 'Owner'],
    ['--doc', 'FOODCOOK', '--name', 'Sam\u202eOkafor', '--role', 'Owner'], ['--doc', 'FOODCOOK', '--role', 'Owner'],
    ['--doc', 'FOODCOOK', ...person, '--date', '2026-02-30'], ['--doc', 'FOODCOOK', ...person, '--date', 'tomorrow'],
    ['--doc', 'FOODCOOK', ...person, '--paper-signed', 'maybe'], ['--doc', 'FOODCOOK', ...person, '--extra']
  ]) {
    const result = run(...base, ...args);
    assert.equal(result.status, 2, args.join(' '));
    assert.equal(result.stdout, '', args.join(' '));
    assert.match(result.stderr, /usage: uk-food\.mjs/, args.join(' '));
    assert.ok(!existsSync(signOffsFile(dir)), args.join(' '));
  }
  assert.match(run(...base, '--doc', 'FOODCMP', ...person).stderr, /report/);
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, ...person).status, 2);
});

// ---- The completion record ----

test('each row of the pack\'s completion record resolves to one section or safe method, and every safe method is reached once', () => {
  assert.equal(recordTables.length, 2);
  assert.deepEqual(recordTables.map((table) => table.page), [78, 79]);
  assert.equal(recordRows.length, 36);
  const methods = [...data.sections.values()].flatMap((file) => file.methods.map((m) => m.id));
  assert.equal(methods.length, 31);
  assert.equal(targets.length, recordRows.length);
  assert.deepEqual(targets.filter((t) => t.method === null).map((t) => t.section), SECTION_IDS);
  const reached = targets.filter((t) => t.method !== null).map((t) => t.method);
  assert.deepEqual([...reached].sort(), [...methods].sort());
  for (const target of targets.filter((t) => t.method)) assert.equal(target.section, target.method.slice(0, 2));
  // The rows that name a method in other words than its title are printed on the record, and only those need the constant.
  for (const [wording, id] of Object.entries(COMPLETION_ROWS)) {
    assert.ok(recordRows.some((row) => row[0] === wording), wording);
    const method = data.sections.get(id.slice(0, 2)).methods.find((m) => m.id === id);
    assert.notEqual(method.title.toLowerCase(), wording.toLowerCase());
  }
  for (const row of recordRows) assert.deepEqual(row.slice(1), ['', '', ''], row[0]);
  // A row that matches nothing, or a method reached twice, is an error, not a guess.
  assert.match(completionTargets([...recordRows, ['Something else', '', '', '']], data).error, /Something else/);
  assert.match(completionTargets([...recordRows, ['Cloths', '', '', '']], data).error, /XC-02/);
});

test('the cafe\'s completion record, with no document written, equals the golden file, through the function and the command', () => {
  const dir = cafe();
  const golden = readFileSync(GOLDEN, 'utf8');
  assert.equal(`${rendered('FOODCMP', dir)}\n`, golden);
  const cli = run('render', '--doc', 'FOODCMP', '--project', dir);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(cli.stdout, golden);
});

test('the completion record prints the pack\'s title, introduction, columns and rows in printed order, all pending until signed off', () => {
  const text = rendered('FOODCMP', cafe());
  const [page] = data.diary.pages.filter((p) => p.blocks.some((b) => b.form === 'completionRecord'));
  const intro = page.blocks.find((b) => b.kind === 'text').text.split('\n');
  assert.ok(text.includes(`\n\n## ${page.title}\n\n${intro.join('\n\n')}\n\n| ${recordTables[0].columns.join(' | ')} |\n`));
  const rows = tableRows(text);
  assert.deepEqual(rows.map((row) => row[0]), recordRows.map((row) => row[0]));
  for (const [i, row] of rows.entries()) {
    const notRelevant = targets[i].method === 'CK-06' ? 'Not relevant' : '';
    assert.deepEqual(row, [recordRows[i][0], PENDING, PENDING, notRelevant], row[0]);
  }
  assert.equal(text.split('\n').at(-3), 'Safety points, reasons and checks are quoted from the Food Standards Agency\'s Safer food, better ' +
    'business for caterers, retrieved 17 November 2026. Contains public sector information licensed under the Open Government ' +
    'Licence v3.0. The Food Standards Agency has not reviewed or endorsed this document.');
});

test('with one section document signed off, its rows show who signed it and when; every other row shows [PENDING]', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const rows = tableRows(rendered('FOODCMP', dir));
  let signed = 0;
  for (const [i, row] of rows.entries()) {
    const { section, method } = targets[i];
    if (section === 'CK') {
      signed++;
      assert.deepEqual(row, [recordRows[i][0], '2026-11-21', 'Sam Okafor', method === 'CK-06' ? 'Not relevant' : ''], row[0]);
    } else {
      assert.deepEqual(row.slice(1, 3), [PENDING, PENDING], row[0]);
    }
  }
  assert.equal(signed, 1 + data.sections.get('CK').methods.length);
});

test('the completion record lists what is unfinished, the sous vide entry awaiting review among it, and a sign-off\'s name is escaped', () => {
  const dir = cafe();
  const text = rendered('FOODCMP', dir);
  const list = text.slice(text.indexOf('\n## Unfinished\n'));
  assert.ok(list.includes('\n- Own methods (FOODOWN): own entry OWN-02 (Sous vide eggs) awaiting environmental health review\n'), list);
  assert.ok(list.includes('\n- Own methods (FOODOWN): low temperature cooking has no own entry: add an own entry of kind special-process whose Process is low temperature cooking, and confirm it\n'));
  assert.ok(list.includes('\n- Cooking (FOODCOOK): document not written\n'));
  assert.equal(list.split('\n').filter((line) => line.startsWith('- ')).length, status(dir).unfinished.length);
  writeDocument(dir, 'FOODCOOK');
  const odd = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam *Okafor* <b>$x$</b>', '--role', 'Owner', '--version', '1.0',
    '--date', '2026-11-21');
  assert.equal(odd.status, 0, odd.stderr);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const changed = rendered('FOODCMP', dir);
  assert.ok(changed.includes('- Cooking (FOODCOOK): signed off by Sam \\*Okafor\\* &lt;b&gt;\\$x\\$&lt;/b&gt; on 2026-11-21, but changed since: sign off again\n'), changed);
  assert.doesNotMatch(changed, /<b>|(?<!\\)\*Okafor/);
});

test('when everything is finished, every row shows its signer and the list says nothing is outstanding', () => {
  const dir = cafe();
  // Every method not relevant, each with its reason and decider; no special process; no own entries.
  for (const section of SECTION_IDS) {
    const methods = new Map(data.sections.get(section).methods.map((m) => [m.id, { status: 'not-relevant', reason: `No need of ${m.id}.`, decidedBy: 'Sam Okafor' }]));
    setSheet(dir, section, emitWorksheet({ data: DATA_ID, section, methods, answers: new Map(), entries: new Map(), problems: [] }, data));
  }
  setSheet(dir, 'profile', sheet(dir, 'profile').replace(/(### PR-Q1[23]\n\n[^\n]*\nAnswer: )yes/g, '$1no'));
  setSheet(dir, 'own', blankWorksheet('own', data));
  for (const doc of STATUS_ORDER) {
    writeDocument(dir, doc);
    assert.equal(signOff(dir, doc).status, 0, doc);
  }
  const result = status(dir);
  assert.deepEqual(result.unfinished, []);
  assert.deepEqual(result.specialProcesses, []);
  assert.ok(result.documents.every((d) => d.signedOff), JSON.stringify(result.documents));
  const text = rendered('FOODCMP', dir);
  assert.ok(text.includes('\n## Unfinished\n\nNothing is outstanding.\n'), text);
  for (const [i, row] of tableRows(text).entries()) {
    assert.deepEqual(row, [recordRows[i][0], '2026-11-21', 'Sam Okafor', targets[i].method ? 'Not relevant' : ''], row[0]);
  }
  assert.equal(run('status', '--project', dir).stdout.split('\n').filter((line) => line.startsWith('- ')).length, 0);
});

test('check --doc FOODCMP passes on a fresh completion record, and once the project changes says it is out of date: render it again', () => {
  const dir = cafe();
  const record = writeDocument(dir, 'FOODCMP');
  assert.equal(checkDocument('FOODCMP', dir, record, data).exit, 0);
  assert.equal(run('check', '--doc', 'FOODCMP', '--project', dir, '--report', record).status, 0);
  // The completion record is not a document status lists.
  assert.ok(!status(dir).documents.some((d) => d.code === 'FOODCMP'));
  writeDocument(dir, 'FOODCOOK');
  const written = checkDocument('FOODCMP', dir, record, data);
  assert.equal(written.exit, 1);
  assert.match(written.message, /out of date/);
  assert.match(written.message, /render it again/);
  const fresh = writeDocument(dir, 'FOODCMP');
  assert.equal(checkDocument('FOODCMP', dir, fresh, data).exit, 0);
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const signed = checkDocument('FOODCMP', dir, fresh, data);
  assert.equal(signed.exit, 1);
  assert.equal(signed.line, readFileSync(fresh, 'utf8').split('\n').findIndex((line) => line.startsWith('<!-- UK-FOOD:BEGIN')) + 1);
  assert.match(signed.message, /render it again/);
});

test('the completion record\'s marker hashes every worksheet in the fixed order, then the sign-offs file', () => {
  const dir = cafe();
  const hash = (...texts) => {
    const sha = createHash('sha256');
    for (const text of texts) sha.update(text);
    return sha.digest('hex');
  };
  const sheets = ['profile', ...SECTION_IDS, 'own'].map((section) => sheet(dir, section));
  assert.equal(rendered('FOODCMP', dir).split('\n')[0], `<!-- UK-FOOD:BEGIN doc=FOODCMP data=${DATA_ID} answers=${hash(...sheets)} -->`);
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  assert.equal(rendered('FOODCMP', dir).split('\n')[0],
    `<!-- UK-FOOD:BEGIN doc=FOODCMP data=${DATA_ID} answers=${hash(...sheets, readFileSync(signOffsFile(dir), 'utf8'))} -->`);
});
