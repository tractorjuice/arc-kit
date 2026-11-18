import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import {
  COMPLETION_ROWS, DATA_ID, DEFAULT_DATA_DIR, PENDING, PROFILE_QUESTIONS, SECTION_DOCS, SECTION_IDS, SIGN_OFFS_SCHEMA,
  STATUS_ORDER, blankWorksheet, checkDocument, completionTargets, documentHashes, emitWorksheet, loadData, parseWorksheet,
  projectStatus, renderDocument
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
  ...(extra.includes('--version') ? [] : ['--version', '1.0']), ...(extra.includes('--date') ? [] : ['--date', '2026-11-17']), ...extra);
const markerHash = (file) => /body=([0-9a-f]{64})/.exec(readFileSync(file, 'utf8'))[1];
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
// The two hashes a sign-off holds for a document as it is now.
const hashesOf = (file, doc) => documentHashes(readFileSync(file, 'utf8'), doc);
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

// The lines status, the completion record and sign-off use, each saying what to do next: the
// specification for their words.
const HOW = 'an answer counts when its State is confirmed and By and On are filled in';
const NOT_WRITTEN = 'document not written yet: write the document from its worksheet';
const NOT_SIGNED = 'document not signed off yet: once it is finished, a named person signs it off';
const UNCOVERED = 'low temperature cooking has no own entry: add an own entry of kind special-process whose Process is ' +
  'low temperature cooking, and confirm it';
const AWAITING = 'own entry OWN-02 (Sous vide eggs) is awaiting environmental health review: once the council has replied, ' +
  'record the review\'s date and outcome in the entry\'s EH-review field';
// What the unfinished list says of a document's sign-off when a record exists and it is not signed off.
const otherVersionLine = (version, name, signed, date) => `this is version ${version}, and the newest sign-off is ${name}'s of ` +
  `version ${signed}, on ${date}: once this version is finished, a named person signs it off`;
const changedLine = (name, date) => `signed off by ${name} on ${date}, but changed since: sign off again`;
const answersChangedLine = (name, date) => `signed off by ${name} on ${date}, but its answers have changed since: the new ` +
  'version needs signing off';
const outsideChangedLine = (name, date) => `signed off by ${name} on ${date}, but the file was changed outside its UK-FOOD ` +
  'markers after that, so the sign-off no longer covers it: take that change out again, or write the document again with ' +
  'its command, which makes a new version to sign off';
// A written document that fails check, by check's own first reason.
const staleLine = (file) => `document ${file} is out of date, as its worksheets have changed since it was written: write the ` +
  'document again from its worksheet';
const editedLine = (file, line) => `document ${file} was changed between its UK-FOOD markers, at line ${line}: make the change in ` +
  'its worksheet instead, and write the document again from its worksheet';
const outsideLine = (file, line) => `document ${file} holds the pack's text outside its UK-FOOD markers, at line ${line}, where it ` +
  'is not checked: write the document again from its worksheet, with the pack\'s text only between the markers';
const markersLine = (file, problem) => `document ${file} has its UK-FOOD markers missing or damaged (${problem}): write the ` +
  'document again from its worksheet';
// A worksheet in the wrong file: where it probably belongs, and what to do.
const misplacedLine = (section, found, taken) => `worksheet food-safety/answers-${section}.md is the ${found} worksheet, not the ` +
  `${section} one: move or rename it first, so that it is not overwritten, as it probably belongs in food-safety/answers-${found}.md` +
  `${taken ? ' (a file is already there: compare the two first)' : ''}, then make the ${section} worksheet with worksheet --section ${section}`;
const lineOfCheck = (dir, file) => checkDocument('FOODCOOK', dir, file, data).line;
const notStarted = (section) => `worksheet food-safety/answers-${section}.md is not started yet: make it with worksheet --section ${section} and fill it in`;
const problemsLine = (section, n) => `worksheet food-safety/answers-${section}.md has ${n} ${n === 1 ? 'problem' : 'problems'}, so none of ` +
  `its answers counts until ${n === 1 ? 'it is' : 'they are'} fixed: parse-worksheet --file food-safety/answers-${section}.md lists ` +
  `${n === 1 ? 'it' : 'them'}`;
const andList = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);
// Up to five identifiers, then how many more.
const someOf = (ids) => (ids.length <= 5 ? andList(ids) : `${ids.slice(0, 5).join(', ')} and ${ids.length - 5} more`);
const unansweredLine = (section, ids) => `${ids.length} ${ids.length === 1 ? 'question' : 'questions'} in food-safety/answers-${section}.md ` +
  `${ids.length === 1 ? 'is' : 'are'} not yet answered (${someOf(ids)}): ${HOW}`;
const proposedLine = (section, ids) => `${ids.length} ${ids.length === 1 ? 'answer' : 'answers'} in food-safety/answers-${section}.md ` +
  `${ids.length === 1 ? 'is' : 'are'} proposed but not confirmed (${someOf(ids)}): ${HOW}`;
// A section's questions a person must answer that are not yet answered, and those only proposed, in order.
const outstanding = (dir, section) => {
  const parsed = parseWorksheet(sheet(dir, section), data);
  const asked = data.sections.get(section).methods.filter((m) => parsed.methods.get(m.id).status !== 'not-relevant').flatMap(askedOf)
    .map((q) => parsed.answers.get(q.id));
  return { unanswered: asked.filter((a) => !a.answered && a.state !== 'proposed').map((a) => a.id),
    proposed: asked.filter((a) => a.state === 'proposed').map((a) => a.id) };
};
// The reasons a refused sign-off gives, one to a line.
const reasons = (stderr) => stderr.split('\n').filter((line) => line.startsWith('- ')).map((line) => line.slice(2));
// A confirmed own entry of kind special-process.
const specialEntry = (id, title, process, review = 'pending') => [`## ${id} ${title}`, '', 'Kind: special-process', `Process: ${process}`,
  'Hazard:', 'Control:', 'Limit:', 'Limit-source:', 'Check:', 'If-it-fails:', 'Supplied-text: Our written method', `EH-review: ${review}`,
  'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17'].join('\n');

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
  assert.deepEqual(Object.keys(result), ['data', 'documents', 'specialProcesses', 'ownAwaitingReview', 'unfinished', 'completionRecord',
    'foodSafetyFolder']);
  assert.deepEqual([result.completionRecord, result.foodSafetyFolder], [null, true]);
  assert.equal(result.data, DATA_ID);
  assert.deepEqual(result.documents.map((d) => d.code), ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN']);
  assert.deepEqual(STATUS_ORDER, result.documents.map((d) => d.code));
  for (const doc of result.documents) {
    assert.deepEqual(Object.keys(doc), ['code', 'worksheets', 'missingWorksheets', 'problems', 'misplaced', 'questions', 'confirmed', 'proposed',
      'unanswered', 'notRelevantMethods', 'adaptedMethods', 'file', 'version', 'rendered', 'inSync', 'signedOff', 'signOff'], doc.code);
    assert.deepEqual([doc.file, doc.version, doc.rendered, doc.inSync, doc.signedOff, doc.signOff], [null, null, false, false, false, null], doc.code);
    assert.deepEqual([doc.missingWorksheets, doc.problems, doc.misplaced], [[], 0, null], doc.code);
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

test('the unfinished list says, for each document in order, what is outstanding and what to do next, then each special process with no own entry and each own entry awaiting review', () => {
  const dir = cafe();
  const xc = outstanding(dir, 'XC');
  assert.deepEqual(xc.proposed, ['XC-02-Q01', 'XC-06-Q02']);
  assert.deepEqual(status(dir).unfinished, [
    { code: 'FOODPROF', what: NOT_WRITTEN },
    { code: 'FOODPROF', what: NOT_SIGNED },
    { code: 'FOODXC', what: unansweredLine('XC', xc.unanswered) },
    { code: 'FOODXC', what: '2 answers in food-safety/answers-XC.md are proposed but not confirmed (XC-02-Q01 and XC-06-Q02): an ' +
      'answer counts when its State is confirmed and By and On are filled in' },
    { code: 'FOODXC', what: NOT_WRITTEN },
    { code: 'FOODXC', what: NOT_SIGNED },
    { code: 'FOODCLN', what: unansweredLine('CL', outstanding(dir, 'CL').unanswered) },
    { code: 'FOODCLN', what: NOT_WRITTEN },
    { code: 'FOODCLN', what: NOT_SIGNED },
    { code: 'FOODCHL', what: unansweredLine('CH', outstanding(dir, 'CH').unanswered) },
    { code: 'FOODCHL', what: NOT_WRITTEN },
    { code: 'FOODCHL', what: NOT_SIGNED },
    { code: 'FOODCOOK', what: NOT_WRITTEN },
    { code: 'FOODCOOK', what: NOT_SIGNED },
    { code: 'FOODMGT', what: unansweredLine('MG', outstanding(dir, 'MG').unanswered) },
    { code: 'FOODMGT', what: NOT_WRITTEN },
    { code: 'FOODMGT', what: NOT_SIGNED },
    { code: 'FOODOWN', what: NOT_WRITTEN },
    { code: 'FOODOWN', what: NOT_SIGNED },
    { code: 'FOODOWN', what: UNCOVERED },
    { code: 'FOODOWN', what: AWAITING }
  ]);
  // Up to five identifiers are named, then how many more.
  assert.match(linesFor(dir, 'FOODXC')[0], /^25 questions in food-safety\/answers-XC\.md are not yet answered \((XC-\d\d-Q\d\d, ){4}XC-\d\d-Q\d\d and 20 more\): /);
  // A worksheet not started is told once, by how to make it. Its questions are all unanswered, and are
  // counted, but no line names questions "in" a file that is not there (M4).
  rmSync(sheetFile(dir, 'CK'));
  const ck = data.sections.get('CK').methods.flatMap(askedOf).map((q) => q.id);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.missingWorksheets, cook.questions, cook.unanswered], [['answers-CK.md'], ck.length, ck.length]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [notStarted('CK'), NOT_WRITTEN, NOT_SIGNED]);
  assert.ok(!status(dir).unfinished.some((line) => line.what.includes('in food-safety/answers-CK.md')));
  // One question is "is", and names it.
  const one = cafe();
  setSheet(one, 'CK', swap(sheet(one, 'CK'), 'Answer: We do not cook rice.\nState: confirmed\nBy: Sam Okafor\nOn: 2026-11-17',
    'Answer:\nState: unanswered\nBy:\nOn:'));
  assert.equal(linesFor(one, 'FOODCOOK')[0], `1 question in food-safety/answers-CK.md is not yet answered (CK-02-Q03): ${HOW}`);
});

test('P1: a worksheet with problems gives one line, under its own document, naming it and how to list its problems, and no line from its counts', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a stray line\n`);
  // The counts stay as they are: nothing confirmed, with problems saying why.
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.problems, cook.confirmed, cook.unanswered], [1, 0, cook.questions]);
  // The document cannot be checked until the worksheet is put right, so it is not called out of date.
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [problemsLine('CK', 1), NOT_SIGNED]);
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [problemsLine('CK', 1)]);
  assert.match(run('parse-worksheet', '--file', sheetFile(dir, 'CK')).stdout, /answers-CK\.md:\d+: line not understood/);
  // Two worksheets with problems: each named once, under the document it belongs to.
  setSheet(dir, 'MG', `${sheet(dir, 'MG')}a line that is not understood\nand another\n`);
  assert.deepEqual(linesFor(dir, 'FOODMGT'), [problemsLine('MG', 2), NOT_WRITTEN, NOT_SIGNED]);
  // The profile reads every worksheet, so it counts their problems, but does not repeat their lines.
  assert.equal(docStatus(dir, 'FOODPROF').problems, 3);
  assert.deepEqual(linesFor(dir, 'FOODPROF'), [NOT_WRITTEN, NOT_SIGNED]);
  // A problem in the own worksheet: no special process is said to lack an entry, and no entry to await review.
  setSheet(dir, 'own', `${sheet(dir, 'own')}a stray line\n`);
  assert.deepEqual(linesFor(dir, 'FOODOWN'), [problemsLine('own', 1), NOT_WRITTEN, NOT_SIGNED]);
  // A problem in the profile: one line, under the profile; another document's refusal gives it as its reason.
  const other = cafe();
  writeDocument(other, 'FOODCOOK');
  setSheet(other, 'profile', `${sheet(other, 'profile')}a stray line\n`);
  assert.equal(status(other).unfinished.filter((line) => line.what === problemsLine('profile', 1)).length, 1);
  assert.equal(linesFor(other, 'FOODPROF')[0], problemsLine('profile', 1));
  assert.deepEqual(reasons(signOff(other, 'FOODCOOK').stderr), [problemsLine('profile', 1)]);
});

test('I1: a status read from a worksheet with problems is not used: the method counts as applying, and the record leaves its tick empty', () => {
  for (const [from, to] of [[/^Reason: We never keep food hot.*$/m, 'Reason:'], [/^Decided-by: Sam Okafor$/m, 'Decided-by:']]) {
    const dir = cafe();
    setSheet(dir, 'CK', sheet(dir, 'CK').replace(from, to));
    assert.match(run('parse-worksheet', '--file', sheetFile(dir, 'CK')).stdout, /CK-06 is not-relevant, so it needs/);
    const cook = docStatus(dir, 'FOODCOOK');
    assert.equal(cook.problems, 1);
    assert.deepEqual(cook.notRelevantMethods, []);
    assert.equal(cook.questions, data.sections.get('CK').methods.flatMap(askedOf).length);
    assert.deepEqual(tableRows(rendered('FOODCMP', dir)).find((row) => row[0] === 'Hot holding'), ['Hot holding', PENDING, PENDING, '']);
  }
  const dir = cafe();
  setSheet(dir, 'CL', sheet(dir, 'CL').replace(/^Proved-safe: .*$/m, 'Proved-safe:'));
  assert.deepEqual([docStatus(dir, 'FOODCLN').problems, docStatus(dir, 'FOODCLN').adaptedMethods], [1, []]);
});

test('P2: a refusal for unanswered or proposed answers names the worksheet, the questions and how an answer counts; the usage names every refusal', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODXC');
  const refused = signOff(dir, 'FOODXC');
  assert.equal(refused.status, 1);
  const xc = outstanding(dir, 'XC');
  assert.deepEqual(reasons(refused.stderr), [unansweredLine('XC', xc.unanswered), proposedLine('XC', xc.proposed)]);
  const usage = run('sign-off').stderr;
  for (const words of ['a worksheet it needs is missing or has problems', 'an answer is not confirmed', 'is not written',
    'is not that version', 'does not pass check', 'a special process the profile confirms has no own entry']) {
    assert.ok(usage.replace(/\s+/g, ' ').includes(words), words);
  }
});

test('a worksheet with problems has none of its answers counted as confirmed', () => {
  const dir = cafe();
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a line that is not understood\n`);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.equal(cook.problems, 1);
  assert.equal(cook.confirmed, 0);
  assert.equal(cook.unanswered, cook.questions);
  // Nothing in a worksheet in the wrong file is counted either.
  setSheet(dir, 'CK', sheet(dir, 'XC'));
  const misplaced = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([misplaced.problems, misplaced.confirmed], [0, 0]);
  assert.ok(misplaced.misplaced);
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

test('a document is in step only when it passes check: an edited document fails it, and the line says where', () => {
  const dir = cafe();
  const file = writeDocument(dir, 'FOODCOOK');
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.file, cook.version, cook.rendered, cook.inSync], ['ARC-001-FOODCOOK-v1.0.md', '1.0', true, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [NOT_SIGNED]);
  writeFileSync(file, swap(readFileSync(file, 'utf8'), 'Poached eggs', 'Boiled eggs'));
  assert.equal(docStatus(dir, 'FOODCOOK').inSync, false);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [editedLine('ARC-001-FOODCOOK-v1.0.md', lineOfCheck(dir, file)), NOT_SIGNED]);
});

test('a special process is covered by the confirmed own entry whose Process names it, never by an entry\'s title', () => {
  const dir = cafe();
  // The profile says yes to smoking or curing meat or fish too. OWN-03 names it in its Process; OWN-04's
  // title names low temperature cooking, but its Process is sous vide, so it does not cover it.
  setSheet(dir, 'profile', sheet(dir, 'profile').replace(/(### PR-Q15\n\n[^\n]*\nAnswer: )no/, '$1yes'));
  const entry = (id, title, process) => [`## ${id} ${title}`, '', 'Kind: special-process', `Process: ${process}`, 'Hazard:', 'Control:',
    'Limit:', 'Limit-source:', 'Check:', 'If-it-fails:', 'Supplied-text: Our written method', 'EH-review: 2026-11-03 accepted',
    'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17'].join('\n');
  setSheet(dir, 'own', `${sheet(dir, 'own')}\n${entry('OWN-03', 'Hot smoked salmon', 'smoking or curing meat/fish')}\n\n` +
    `${entry('OWN-04', 'Low temperature cooking of eggs', 'sous vide')}\n`);
  assert.deepEqual(parseWorksheet(sheet(dir, 'own'), data).problems, []);
  assert.deepEqual(status(dir).specialProcesses, [
    { name: 'sous vide', ownEntry: 'OWN-02', ehReview: 'pending' },
    { name: 'low temperature cooking', ownEntry: null, ehReview: null },
    { name: 'smoking or curing meat/fish', ownEntry: 'OWN-03', ehReview: '2026-11-03 accepted' }
  ]);
});

test('a worksheet in the wrong file is its own state: its line says where it belongs and what to do, and problems counts only what parse-worksheet lists', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  setSheet(dir, 'CK', sheet(dir, 'XC'));
  const listed = run('parse-worksheet', '--file', sheetFile(dir, 'CK'));
  assert.equal(listed.status, 0, listed.stdout);
  const advice = misplacedLine('CK', 'XC', true);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.problems, cook.misplaced, cook.confirmed], [0, advice, 0]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [advice, NOT_SIGNED]);
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [advice]);
  // With problems of its own as well, problems is the number parse-worksheet lists, and the line is still the advice.
  setSheet(dir, 'CK', `${sheet(dir, 'XC')}a stray line\nand another\n`);
  const twice = run('parse-worksheet', '--file', sheetFile(dir, 'CK'));
  assert.equal(twice.stdout.trim().split('\n').length, 2, twice.stdout);
  assert.equal(docStatus(dir, 'FOODCOOK').problems, 2);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [advice, NOT_SIGNED]);
  // When the file it belongs in is free, the line says only where that is.
  setSheet(dir, 'CK', sheet(dir, 'XC'));
  rmSync(sheetFile(dir, 'XC'));
  assert.equal(docStatus(dir, 'FOODCOOK').misplaced, misplacedLine('CK', 'XC', false));
  // A worksheet for other data: parse-worksheet lists the one problem, and the line says what to do.
  const other = cafe();
  setSheet(other, 'CK', swap(sheet(other, 'CK'), `data=${DATA_ID}`, 'data=sfbb-caterers-2025-01-01'));
  assert.equal(run('parse-worksheet', '--file', sheetFile(other, 'CK')).stdout.trim().split('\n').length, 1);
  const data2025 = 'worksheet food-safety/answers-CK.md answers data sfbb-caterers-2025-01-01, not this helper\'s data ' +
    `${DATA_ID}: keep a copy of it, make a new one with worksheet --section CK and copy the answers across`;
  assert.deepEqual([docStatus(other, 'FOODCOOK').problems, docStatus(other, 'FOODCOOK').misplaced], [1, data2025]);
  assert.deepEqual(linesFor(other, 'FOODCOOK'), [data2025, NOT_WRITTEN, NOT_SIGNED]);
});

test('a written document that fails check is given check\'s own first reason, with its next step, in status and in the refusal', () => {
  const dir = cafe();
  const file = writeDocument(dir, 'FOODCOOK');
  const name = basename(file);
  const body = readFileSync(file, 'utf8');
  for (const [text, expected] of [
    [swap(body, 'Poached eggs', 'Boiled eggs'), (check) => editedLine(name, check.line)],
    [swap(body, 'Header text for FOODCOOK.', '## COOKING'), () => outsideLine(name, 1)],
    [swap(body, '<!-- UK-FOOD:END -->', ''), () => markersLine(name, 'there is no UK-FOOD:END marker line, so there is no rendered body to check')]
  ]) {
    writeFileSync(file, text);
    const check = checkDocument('FOODCOOK', dir, file, data);
    assert.equal(check.exit, 1);
    // The line is check's own reason, taken from check.
    assert.equal(`document ${name} ${check.reason}`, expected(check));
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [expected(check), NOT_SIGNED]);
    const refused = signOff(dir, 'FOODCOOK');
    assert.equal(refused.status, 1);
    assert.deepEqual(reasons(refused.stderr), [expected(check)]);
  }
  // Out of date: the worksheet changed after the document was written.
  writeFileSync(file, body);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  assert.equal(`document ${name} ${checkDocument('FOODCOOK', dir, file, data).reason}`, staleLine(name));
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [staleLine(name), NOT_SIGNED]);
});

test('the readable status says the own worksheet could not be read, not that a special process has no own entry, when it has problems or is in the wrong file', () => {
  const dir = cafe();
  const special = () => run('status', '--project', dir).stdout.split('\n').find((line) => line.startsWith('Special processes and foods:'));
  assert.equal(special(), 'Special processes and foods: sous vide (own entry OWN-02, environmental health review: pending); ' +
    'low temperature cooking (no own entry)');
  const unread = 'Special processes and foods: sous vide; low temperature cooking (the own worksheet could not be read, so which ' +
    'own entries cover them is not known)';
  setSheet(dir, 'own', `${sheet(dir, 'own')}a stray line\n`);
  assert.equal(special(), unread);
  setSheet(dir, 'own', sheet(dir, 'CK'));
  assert.equal(special(), unread);
});

// ---- Sign-off ----

test('sign-off of CK records who, what and when, with the hash of the body the document carries and the hash of the rest of the file, and status shows it signed off', () => {
  const dir = cafe();
  const file = writeDocument(dir, 'FOODCOOK');
  const result = signOff(dir, 'FOODCOOK', '--paper-signed', 'yes');
  assert.equal(result.status, 0, result.stderr);
  const record = { doc: 'FOODCOOK', version: '1.0', file: 'ARC-001-FOODCOOK-v1.0.md', name: 'Sam Okafor', role: 'Owner', date: '2026-11-17',
    paperSigned: 'yes', body: markerHash(file), outside: hashesOf(file, 'FOODCOOK').outside };
  assert.match(record.outside, /^[0-9a-f]{64}$/);
  assert.equal(hashesOf(file, 'FOODCOOK').body, record.body);
  const text = readFileSync(signOffsFile(dir), 'utf8');
  assert.equal(text, `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [record] }, null, 2)}\n`);
  assert.deepEqual(Object.keys(JSON.parse(text).signOffs[0]), ['doc', 'version', 'file', 'name', 'role', 'date', 'paperSigned', 'body', 'outside']);
  // One line, saying what was recorded and that the document's header still says DRAFT.
  assert.equal(result.stdout.trimEnd().split('\n').length, 1, result.stdout);
  for (const word of ['Sam Okafor', 'ARC-001-FOODCOOK-v1.0.md', '2026-11-17', 'DRAFT']) assert.ok(result.stdout.includes(word), word);
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
    '--date', '2026-11-17');
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
  const xc = outstanding(dir, 'XC');
  assert.ok(refused.stderr.includes(unansweredLine('XC', xc.unanswered)), refused.stderr);
  assert.ok(refused.stderr.includes(proposedLine('XC', xc.proposed)), refused.stderr);
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
  refused([], new RegExp(`^- ${NOT_WRITTEN}$`, 'm'));
  const file = writeDocument(dir, 'FOODCOOK');
  refused(['--version', '1.1'], /^- the current FOODCOOK document is ARC-001-FOODCOOK-v1\.0\.md, version 1\.0, not version 1\.1: give --version 1\.0 to sign off the current document$/m);
  writeFileSync(file, swap(readFileSync(file, 'utf8'), 'Poached eggs', 'Boiled eggs'));
  const edited = signOff(dir, 'FOODCOOK');
  assert.equal(edited.status, 1);
  assert.deepEqual(reasons(edited.stderr), [editedLine('ARC-001-FOODCOOK-v1.0.md', lineOfCheck(dir, file))]);
  writeDocument(dir, 'FOODCOOK');
  rmSync(sheetFile(dir, 'profile'));
  const noProfile = signOff(dir, 'FOODCOOK');
  assert.equal(noProfile.status, 1);
  assert.deepEqual(reasons(noProfile.stderr), [notStarted('profile')]);
  assert.ok(!existsSync(signOffsFile(dir)));
});

test('Review Focus 5a: editing one CK answer after sign-off makes it not signed off, and says who signed it and that its answers changed', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const cook = docStatus(dir, 'FOODCOOK');
  assert.equal(cook.signedOff, false);
  assert.equal(cook.inSync, false);
  assert.equal(cook.signOff.name, 'Sam Okafor');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [staleLine('ARC-001-FOODCOOK-v1.0.md'), answersChangedLine('Sam Okafor', '2026-11-17')]);
  // The answer put back as it was: the signed file is what a fresh print gives again, so it is signed off again.
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans and soup', 'Answer: Baked beans'));
  assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').signedOff], [true, true]);
});

test('a change to a worksheet that does not change the document\'s printed body (a byte order mark, line endings, spaces at the ends of lines, blank lines, a remark in a comment) leaves it signed off', () => {
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
  // Nor does a blank line or a remark added inside the worksheet: the document reads the same, word for word.
  setSheet(dir, 'CK', swap(text, '### CK-02-Q01', '\n<!-- ask Sam about the eggs -->\n\n### CK-02-Q01'));
  assert.equal(read(sheet(dir, 'CK')), read(text));
  assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').signedOff], [true, true]);
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
  assert.deepEqual(reasons(result.stderr), [problemsLine('CL', 1)]);
  assert.match(run('parse-worksheet', '--file', sheetFile(other, 'CL')).stdout, /CL-02 is not-relevant, so it needs Reason/);
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
  // M4: version 1.1 was never signed, so it is not said to have been signed and changed.
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [otherVersionLine('1.1', 'Sam Okafor', '1.0', '2026-11-17')]);
  assert.equal(signOff(dir, 'FOODCOOK').status, 1);
  assert.equal(signOff(dir, 'FOODCOOK', '--version', '1.1').status, 0);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
});

test('two sign-offs for one document: the newest governs', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const second = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0',
    '--date', '2026-11-17');
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
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [otherVersionLine('1.0', 'Priya Shah', '1.1', today())]);
});

test('R50a: the own methods document is not signed off while a special process the profile confirms has no own entry naming it', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODOWN');
  const refused = signOff(dir, 'FOODOWN');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [UNCOVERED]);
  assert.ok(!existsSync(signOffsFile(dir)));
  // Once an own entry names low temperature cooking in its Process, it can be. An entry awaiting
  // environmental health review does not hold it up.
  setSheet(dir, 'own', `${sheet(dir, 'own')}\n${specialEntry('OWN-03', 'Slow-cooked eggs', 'low temperature cooking')}\n`);
  writeDocument(dir, 'FOODOWN');
  assert.equal(signOff(dir, 'FOODOWN').status, 0);
  assert.equal(docStatus(dir, 'FOODOWN').signedOff, true);
  assert.deepEqual(status(dir).ownAwaitingReview, ['OWN-02', 'OWN-03']);
});

test('R50b: a sign-off recorded for an unfinished document does not make it signed off, nor fill its rows of the completion record', () => {
  const dir = cafe();
  const forged = (doc, file) => ({ doc, version: '1.0', file: basename(file), name: 'Forged Name', role: 'Owner', date: '2026-11-17',
    paperSigned: 'no', ...hashesOf(file, doc) });
  // XC has questions unanswered and proposed; the own methods document has a special process with no entry.
  const records = ['FOODXC', 'FOODOWN', 'FOODCOOK'].map((doc) => forged(doc, writeDocument(dir, doc)));
  writeFileSync(signOffsFile(dir), `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: records }, null, 2)}\n`);
  for (const code of ['FOODXC', 'FOODOWN']) {
    const doc = docStatus(dir, code);
    assert.deepEqual([doc.inSync, doc.signedOff, doc.signOff.name], [true, false, 'Forged Name'], code);
  }
  // Nothing has changed since the record, so it is not said to have; the lines say only what is unfinished.
  const xc = outstanding(dir, 'XC');
  assert.deepEqual(linesFor(dir, 'FOODXC'), [unansweredLine('XC', xc.unanswered), proposedLine('XC', xc.proposed)]);
  assert.deepEqual(linesFor(dir, 'FOODOWN'), [UNCOVERED, AWAITING]);
  const rows = tableRows(rendered('FOODCMP', dir));
  rows.forEach((row, i) => assert.deepEqual(row.slice(1, 3), targets[i].section === 'CK' ? ['2026-11-17', 'Forged Name'] : [PENDING, PENDING], row[0]));
  // FOODCOOK is finished, so a matching record makes it signed off, whoever wrote it: the record is the business's to keep.
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
});

test('a sign-offs.json that is not valid JSON or has the wrong shape: status, the completion record and sign-off exit 2, say so, and never change it', () => {
  const record = { doc: 'FOODCOOK', version: '1.0', file: 'ARC-001-FOODCOOK-v1.0.md', name: 'Sam Okafor', role: 'Owner', date: '2026-11-17',
    paperSigned: 'no', body: 'a'.repeat(64), outside: 'b'.repeat(64) };
  const shaped = (signOffs, schema = SIGN_OFFS_SCHEMA) => JSON.stringify({ schema, signOffs });
  const cases = ['{ "schema": ', '[]', shaped([], 'uk-food-sign-offs-0.1'), JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: {} }),
    JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [], extra: 1 }), shaped([{ ...record, body: undefined }]),
    shaped([{ ...record, outside: undefined }]), shaped([{ ...record, answers: 'a'.repeat(64) }]), shaped([{ ...record, outside: 'not a hash' }]),
    shaped([{ ...record, note: 'x' }]), shaped([{ ...record, date: '2026-02-30' }]), shaped([{ ...record, paperSigned: 'maybe' }]),
    shaped([{ ...record, doc: 'FOODCMP' }]), shaped([{ ...record, file: 'ARC-001-FOODXC-v1.0.md' }]), shaped([{ ...record, name: ' ' }]),
    shaped([{ ...record, name: 'Sam\nOkafor' }]), shaped([{ ...record, body: 'not a hash' }])];
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
      assert.deepEqual(row, [recordRows[i][0], '2026-11-17', 'Sam Okafor', method === 'CK-06' ? 'Not relevant' : ''], row[0]);
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
  assert.ok(list.includes(`\n- Own methods (FOODOWN): ${AWAITING}\n`), list);
  assert.ok(list.includes(`\n- Own methods (FOODOWN): ${UNCOVERED}\n`));
  assert.ok(list.includes(`\n- Cooking (FOODCOOK): ${NOT_WRITTEN}\n`));
  assert.equal(list.split('\n').filter((line) => line.startsWith('- ')).length, status(dir).unfinished.length);
  writeDocument(dir, 'FOODCOOK');
  const odd = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam *Okafor* <b>$x$</b>', '--role', 'Owner', '--version', '1.0',
    '--date', '2026-11-17');
  assert.equal(odd.status, 0, odd.stderr);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const changed = rendered('FOODCMP', dir);
  assert.ok(changed.includes('- Cooking (FOODCOOK): signed off by Sam \\*Okafor\\* &lt;b&gt;\\$x\\$&lt;/b&gt; on 2026-11-17, but its answers have changed since: the new version needs signing off\n'), changed);
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
    assert.deepEqual(row, [recordRows[i][0], '2026-11-17', 'Sam Okafor', targets[i].method ? 'Not relevant' : ''], row[0]);
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

test('the completion record\'s marker carries the hash of its own body, which changes when a document is signed off', () => {
  const dir = cafe();
  const bodyOf = (text) => text.split('\n').slice(1, -1).join('\n');
  const before = rendered('FOODCMP', dir);
  assert.equal(before.split('\n')[0], `<!-- UK-FOOD:BEGIN doc=FOODCMP data=${DATA_ID} body=${sha256(bodyOf(before))} -->`);
  writeDocument(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const after = rendered('FOODCMP', dir);
  assert.equal(after.split('\n')[0], `<!-- UK-FOOD:BEGIN doc=FOODCMP data=${DATA_ID} body=${sha256(bodyOf(after))} -->`);
  assert.notEqual(after.split('\n')[0], before.split('\n')[0]);
});

// ---- What a header may claim, and what a sign-off covers ----

const TEMPLATE = readFileSync('plugins/arckit-uk-food/templates/uk-food-safe-methods-template.md', 'utf8');
const PARTIALS = 'plugins/arckit-uk-food/templates/_partials';
// Every regime's Document Control partial: the row forms a document's header can take.
const REGIMES = readdirSync(PARTIALS).map((name) => /^document-control-([a-z]+)\.md$/.exec(name)?.[1]).filter(Boolean);
const HEADER_MARKER = '<!-- DOC-CONTROL-HEADER -->\n<!-- Resolved at command-execution time per _partials/RENDERING.md. -->';
// A document written as a command writes it: the template, its Document Control marker resolved to a
// regime's partial, and a fresh render at the body marker. `header` gives Status, Reviewed By and
// Approved By; `history` the approval cells of the Revision History row.
const templated = (dir, doc, { regime = 'uk', version = '1.0', status = 'DRAFT', reviewed = '[PENDING]', approved = '[PENDING]',
  history = ['[PENDING]', '[PENDING]'], body = rendered(doc, dir) } = {}) => {
  const partial = readFileSync(join(PARTIALS, `document-control-${regime}.md`), 'utf8').trimEnd();
  for (const row of ['| **Status** | DRAFT |', '| **Reviewed By** | [PENDING] |', '| **Approved By** | [PENDING] |']) {
    assert.ok(partial.includes(`\n${row}\n`), `${regime}: ${row}`);
  }
  const text = swap(swap(swap(TEMPLATE, HEADER_MARKER, partial
    .replace('| **Status** | DRAFT |', `| **Status** | ${status} |`)
    .replace('| **Reviewed By** | [PENDING] |', `| **Reviewed By** | ${reviewed} |`)
    .replace('| **Approved By** | [PENDING] |', `| **Approved By** | ${approved} |`)),
  '| [VERSION] | [YYYY-MM-DD] | ArcKit AI | [CHANGES] | [PENDING] | [PENDING] |',
  `| ${version} | 2026-11-17 | ArcKit AI | Written from the business's confirmed answers | ${history.join(' | ')} |`),
  '<!-- UK-FOOD-BODY -->', body);
  const file = join(dir, `ARC-001-${doc}-v${version}.md`);
  writeFileSync(file, text);
  return file;
};
const edit = (file, from, to) => writeFileSync(file, swap(readFileSync(file, 'utf8'), from, to));
// What the sign-off command does to a document once the helper has recorded a sign-off.
const mark = (file, who = 'Sam Okafor, Owner, 2026-11-17') => {
  edit(file, '| **Status** | DRAFT |', '| **Status** | APPROVED |');
  edit(file, '| **Reviewed By** | [PENDING] |', `| **Reviewed By** | ${who} |`);
  edit(file, '| **Approved By** | [PENDING] |', `| **Approved By** | ${who} |`);
  edit(file, '| **Last Modified** | [YYYY-MM-DD] |', '| **Last Modified** | 2026-11-17 |');
  edit(file, 'confirmed answers | [PENDING] | [PENDING] |', 'confirmed answers | Sam Okafor, Owner | 2026-11-17 |');
};
const lineNumber = (file, needle) => {
  const at = readFileSync(file, 'utf8').split('\n').findIndex((line) => line.includes(needle));
  assert.ok(at >= 0, needle);
  return at + 1;
};
const check = (dir, doc, file) => checkDocument(doc, dir, file, data);
const overClaimLine = (file, line, field, value) => `document ${file} says in its header, at line ${line}, that ${field} is ` +
  `"${value}", though no sign-off is recorded for it: put Status back to DRAFT and Reviewed By and Approved By back to [PENDING], ` +
  'and have a named person sign the document off once it is finished';

test('C1: a header that says APPROVED, with a name, when no sign-off is recorded fails check at the header line, whichever regime\'s header it is; status says so, and it is not signed off', () => {
  assert.ok(REGIMES.length >= 8 && REGIMES.includes('uk') && REGIMES.includes('uae') && REGIMES.includes('at'), REGIMES.join(' '));
  for (const regime of REGIMES) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK', { regime, status: 'APPROVED', approved: 'Dana Okafor, Owner, 2026-11-17' });
    assert.ok(!existsSync(signOffsFile(dir)));
    const line = lineNumber(file, '| **Status** | APPROVED |');
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 1, regime);
    assert.equal(result.line, line, regime);
    assert.ok(result.message.startsWith(`${file}:${line}: `), result.message);
    assert.match(result.message, /Status is "APPROVED", but no sign-off is recorded for this file/);
    assert.match(result.message, /Put Status back to DRAFT and Reviewed By and Approved By back to \[PENDING\]/);
    const cli = run('check', '--doc', 'FOODCOOK', '--project', dir, '--report', file);
    assert.equal(cli.status, 1, regime);
    assert.ok(cli.stdout.includes(`:${line}: `), cli.stdout);
    const cook = docStatus(dir, 'FOODCOOK');
    assert.deepEqual([cook.rendered, cook.inSync, cook.signedOff], [true, false, false], regime);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [overClaimLine(basename(file), line, 'Status', 'APPROVED'), NOT_SIGNED], regime);
    // The completion record shows the line, and the document's rows stay pending.
    const record = rendered('FOODCMP', dir);
    assert.ok(record.includes(`- Cooking (FOODCOOK): ${overClaimLine(basename(file), line, 'Status', 'APPROVED').replace(/[[\]]/g, '\\$&')}\n`), record);
    assert.ok(tableRows(record).every((row) => row[1] === PENDING && row[2] === PENDING));
    // And nothing can be signed off over it.
    assert.equal(signOff(dir, 'FOODCOOK').status, 1);
    assert.ok(!existsSync(signOffsFile(dir)));
  }
});

test('C1: each over-claim is caught at its own line: a status other than DRAFT, a name in Reviewed By or Approved By, a header copied into a new version, a name that is not the signer\'s, an approval in the Revision History', () => {
  const claims = [
    [{ status: 'IN_REVIEW' }, '| **Status** | IN_REVIEW |', /Status is "IN_REVIEW", but no sign-off is recorded/],
    [{ status: 'Approved' }, '| **Status** | Approved |', /Status is "Approved", but no sign-off is recorded/],
    [{ reviewed: 'Sam Okafor' }, '| **Reviewed By** | Sam Okafor |', /Reviewed By is "Sam Okafor", but no sign-off is recorded/],
    [{ approved: 'Sam Okafor, Owner, 2026-11-17' }, '| **Approved By** | Sam Okafor, Owner, 2026-11-17 |', /Approved By is "Sam Okafor, Owner, 2026-11-17", but no sign-off is recorded/],
    [{ history: ['Sam Okafor, Owner', '[PENDING]'] }, 'confirmed answers | Sam Okafor, Owner | [PENDING] |', /Revision History says version 1\.0 was approved \("Sam Okafor, Owner"\), but no sign-off is recorded for that version/],
    [{ history: ['[PENDING]', '2026-11-17'] }, 'confirmed answers | [PENDING] | 2026-11-17 |', /Revision History says version 1\.0 was approved \("2026-11-17"\), but no sign-off is recorded for that version/]
  ];
  for (const [header, needle, pattern] of claims) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK', header);
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 1, needle);
    assert.equal(result.line, lineNumber(file, needle), needle);
    assert.match(result.message, pattern, needle);
    assert.equal(docStatus(dir, 'FOODCOOK').signedOff, false, needle);
    assert.equal(linesFor(dir, 'FOODCOOK').length, 2, needle);
  }
  // Written without the bold marks, or with other marks round the value, the rows are read the same.
  const plain = cafe();
  const file = templated(plain, 'FOODCOOK');
  edit(file, '| **Status** | DRAFT |', '| Status | `APPROVED` |');
  assert.equal(check(plain, 'FOODCOOK', file).exit, 1);
  assert.match(check(plain, 'FOODCOOK', file).message, /Status is "APPROVED"/);
  edit(file, '| Status | `APPROVED` |', '|Status|**draft**|');
  edit(file, '| **Reviewed By** | [PENDING] |', '| Reviewed By | PENDING |');
  edit(file, '| **Approved By** | [PENDING] |', '| **Approved By** |  |');
  assert.equal(check(plain, 'FOODCOOK', file).exit, 0, check(plain, 'FOODCOOK', file).message);

  // A second row of the same name is read too: a claim is not hidden by a DRAFT row above it.
  edit(file, '| **Approved By** |  |', '| **Approved By** |  |\n| **Status** | APPROVED |\n| **Approved By** | Dana Okafor |');
  const second = check(plain, 'FOODCOOK', file);
  assert.equal(second.exit, 1);
  assert.equal(second.line, lineNumber(file, '| **Status** | APPROVED |'));
  assert.match(second.message, /Status is "APPROVED", but no sign-off is recorded/);

  // The slip the review named: version 1.0 is signed off and marked, and its header is copied into version 1.1.
  const dir = cafe();
  const signed = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(signed);
  assert.equal(check(dir, 'FOODCOOK', signed).exit, 0, check(dir, 'FOODCOOK', signed).message);
  const copied = templated(dir, 'FOODCOOK', { version: '1.1', status: 'APPROVED', reviewed: 'Sam Okafor, Owner, 2026-11-17',
    approved: 'Sam Okafor, Owner, 2026-11-17' });
  const result = check(dir, 'FOODCOOK', copied);
  assert.equal(result.exit, 1);
  assert.equal(result.line, lineNumber(copied, '| **Status** | APPROVED |'));
  assert.match(result.message, /no sign-off is recorded for this file/);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').file, docStatus(dir, 'FOODCOOK').signedOff], ['ARC-001-FOODCOOK-v1.1.md', false]);
  // A Revision History carried over may say who approved version 1.0, which is recorded; not version 1.1.
  const carried = templated(dir, 'FOODCOOK', { version: '1.1' });
  edit(carried, '| 1.1 | 2026-11-17 |', '| 1.0 | 2026-11-17 | ArcKit AI | Written from the business\'s confirmed answers | Sam Okafor, Owner | 2026-11-17 |\n| 1.1 | 2026-11-17 |');
  assert.equal(check(dir, 'FOODCOOK', carried).exit, 0, check(dir, 'FOODCOOK', carried).message);
  // A version written with its "v" is read the same.
  edit(carried, '| 1.0 | 2026-11-17 | ArcKit AI', '| v1.0 | 2026-11-17 | ArcKit AI');
  assert.equal(check(dir, 'FOODCOOK', carried).exit, 0, check(dir, 'FOODCOOK', carried).message);
  edit(carried, 'confirmed answers | [PENDING] | [PENDING] |', 'confirmed answers | Sam Okafor, Owner | [PENDING] |');
  assert.match(check(dir, 'FOODCOOK', carried).message, /Revision History says version 1\.1 was approved/);

  // A name that is not the signer's.
  const other = cafe();
  const named = templated(other, 'FOODCOOK');
  assert.equal(signOff(other, 'FOODCOOK').status, 0);
  mark(named, 'Dana Okafor, Owner, 2026-11-17');
  const wrong = check(other, 'FOODCOOK', named);
  assert.equal(wrong.exit, 1);
  assert.equal(wrong.line, lineNumber(named, '| **Reviewed By** | Dana Okafor'));
  assert.match(wrong.message, /Reviewed By is "Dana Okafor, Owner, 2026-11-17", which does not name Sam Okafor, who signed this file off on 2026-11-17/);
  assert.equal(docStatus(other, 'FOODCOOK').signedOff, false);
});

test('C1: the completion record\'s header is always DRAFT and [PENDING], whatever is signed off', () => {
  const dir = cafe();
  templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const fine = templated(dir, 'FOODCMP');
  assert.equal(check(dir, 'FOODCMP', fine).exit, 0, check(dir, 'FOODCMP', fine).message);
  for (const [header, needle] of [[{ status: 'APPROVED' }, '| **Status** | APPROVED |'], [{ reviewed: 'Sam Okafor, Owner, 2026-11-17' }, '| **Reviewed By** | Sam Okafor'],
    [{ approved: 'Sam Okafor, Owner, 2026-11-17' }, '| **Approved By** | Sam Okafor'], [{ history: ['Sam Okafor, Owner', '2026-11-17'] }, 'confirmed answers | Sam Okafor, Owner |']]) {
    const file = templated(dir, 'FOODCMP', header);
    const result = check(dir, 'FOODCMP', file);
    assert.equal(result.exit, 1, needle);
    assert.equal(result.line, lineNumber(file, needle), needle);
    assert.match(result.message, /the completion record is a report that nobody signs/, needle);
  }
});

test('C1 is not raised for a signed file whose answers later changed, a signed file whose header still says DRAFT, or a file with no Document Control table', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  // Signed, the header still DRAFT: the helper has recorded it and the command has not marked it yet.
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  // Signed and marked, then an answer changes: the file is as it was signed, so its header claims nothing false.
  mark(file);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const stale = check(dir, 'FOODCOOK', file);
  assert.equal(stale.exit, 1);
  assert.equal(stale.line, lineNumber(file, '<!-- UK-FOOD:BEGIN'));
  assert.match(stale.message, /worksheets have changed since/);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [staleLine(basename(file)), answersChangedLine('Sam Okafor', '2026-11-17')]);
  // No Document Control table at all.
  const bare = cafe();
  assert.equal(check(bare, 'FOODCOOK', writeDocument(bare, 'FOODCOOK')).exit, 0);
});

test('I1: text added outside the markers after sign-off un-signs the document, with a line of its own; before it is marked check passes, and once the header says it is signed off check fails', () => {
  const addendum = '\n## Addendum\n\nA note nobody signed.\n';
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  writeFileSync(file, `${readFileSync(file, 'utf8')}${addendum}`);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  let cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff, cook.signOff.name], [true, false, 'Sam Okafor']);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [outsideChangedLine('Sam Okafor', '2026-11-17')]);
  assert.ok(tableRows(rendered('FOODCMP', dir)).every((row) => row[1] === PENDING));
  // The addendum taken out again: the file is as it was signed.
  edit(file, addendum, '');
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);

  // Marked as signed off, then added to: the header now claims a sign-off that does not cover the file.
  mark(file);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  writeFileSync(file, `${readFileSync(file, 'utf8')}${addendum}`);
  const result = check(dir, 'FOODCOOK', file);
  assert.equal(result.exit, 1);
  assert.equal(result.line, lineNumber(file, '| **Status** | APPROVED |'));
  assert.match(result.message, /Status is "APPROVED", but the file was changed outside its UK-FOOD markers after Sam Okafor signed it off on 2026-11-17/);
  cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff], [false, false]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [`document ${basename(file)} ${result.reason}`]);
  assert.match(result.reason, /^says in its header, at line \d+, that it is signed off, but the file was changed outside its UK-FOOD markers after Sam Okafor signed it off on 2026-11-17: take that change out again, or write the document again with its command, which makes a new version to sign off$/);
  // Text before the markers counts the same.
  edit(file, addendum, '');
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  edit(file, '## Revision History', '## Summary\n\nA summary nobody signed.\n\n## Revision History');
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, false);
});

test('I1: marking the header, filling in the Revision History row and a Build Provenance block leave the sign-off standing; any other change outside the markers ends it', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const signed = () => docStatus(dir, 'FOODCOOK').signedOff;
  mark(file);
  assert.equal(signed(), true);
  const provenance = (stamp) => `\n<!-- arckit-provenance:start -->\n\n## Build Provenance\n\n*Stamped automatically.*\n\n| Field | Value |\n` +
    `|-------|-------|\n| Stamped at | ${stamp} |\n\n<!-- arckit-provenance:end -->\n`;
  writeFileSync(file, `${readFileSync(file, 'utf8')}${provenance('2026-11-17T10:00:00Z')}`);
  assert.equal(signed(), true);
  edit(file, '2026-11-17T10:00:00Z', '2026-11-17T11:30:00Z');
  assert.equal(signed(), true);
  edit(file, '| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 2026-11-16 |');
  assert.equal(signed(), true);
  // The approval cells of the Revision History row, written another way: still the sign-off command's to fill in.
  edit(file, 'answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor, Owner, 2026-11-17 | 17 November 2026 |');
  assert.equal(signed(), true);
  // A row written without its closing pipe is read the same.
  edit(file, 'answers | Sam Okafor, Owner, 2026-11-17 | 17 November 2026 |', 'answers | Sam Okafor, Owner | 2026-11-17');
  assert.equal(signed(), false, 'the closing pipe of the row is itself part of the file');
  edit(file, 'answers | Sam Okafor, Owner | 2026-11-17\n', 'answers | Sam Okafor, Owner | 2026-11-17 |\n');
  assert.equal(signed(), true);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  const text = readFileSync(file, 'utf8');
  for (const [from, to] of [
    ['# [DOCUMENT_TYPE_NAME]: [BUSINESS_NAME]', '# [DOCUMENT_TYPE_NAME]: Another business'],
    ['| **Owner** | [OWNER_NAME_AND_ROLE] |', '| **Owner** | Somebody else |'],
    ['| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |', '| **Classification** | OFFICIAL |'],
    ['**Generated by**: ArcKit', 'A line added to the footer.\n\n**Generated by**: ArcKit'],
    ['| **Status** | APPROVED |\n', ''],
    // The Revision History: only a row's two approval cells are the sign-off command's to fill in.
    ['| ArcKit AI | Written from the business\'s confirmed answers |', '| ArcKit AI | Written from the business\'s confirmed answers, with a note nobody signed |'],
    ['| 1.0 | 2026-11-17 | ArcKit AI |', '| 1.0 | 2026-11-16 | ArcKit AI |'],
    ['answers | Sam Okafor, Owner | 2026-11-17 |\n', 'answers | Sam Okafor, Owner | 2026-11-17 |\n| 1.0 | 2026-11-17 | Somebody | A row added afterwards | [PENDING] | [PENDING] |\n'],
    ['<!-- arckit-provenance:end -->\n', '<!-- arckit-provenance:end -->\n\nA note after the provenance block.\n'],
    ['<!-- arckit-provenance:start -->\n', '']
  ]) {
    writeFileSync(file, swap(text, from, to));
    assert.equal(signed(), false, from);
  }
  writeFileSync(file, text);
  assert.equal(signed(), true);
});

test('I2: a change to the profile that the document does not print leaves it signed off; the business\'s name, which it does print, does not', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const before = readFileSync(file, 'utf8');
  // One more member of staff, in the profile's list of who works with food.
  const staff = /(### PR-Q10\n\n[^\n]*\nAnswer: [^\n]*\n(?: {2}[^\n]*\n)*)/;
  assert.match(sheet(dir, 'profile'), staff);
  setSheet(dir, 'profile', sheet(dir, 'profile').replace(staff, '$1  Jo Bell, weekend cook\n'));
  assert.deepEqual(parseWorksheet(sheet(dir, 'profile'), data).problems, []);
  assert.equal(rendered('FOODCOOK', dir), before.slice(before.indexOf('<!-- UK-FOOD:BEGIN'), before.indexOf('<!-- UK-FOOD:END -->') + '<!-- UK-FOOD:END -->'.length));
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff], [true, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  // The profile document does print it.
  assert.ok(rendered('FOODPROF', dir).includes('Jo Bell, weekend cook'));
  // The business's name is printed in every document, so changing it changes them all.
  setSheet(dir, 'profile', swap(sheet(dir, 'profile'), 'Answer: Bramble Cafe\n', 'Answer: Bramble Cafe and Bakery\n'));
  assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').signedOff], [false, false]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [staleLine(basename(file)), answersChangedLine('Sam Okafor', '2026-11-17')]);
});

test('a signed document written again in place, with different answers, is not signed off, and is told to sign off again', () => {
  const dir = cafe();
  templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  templated(dir, 'FOODCOOK');
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff], [true, false]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [changedLine('Sam Okafor', '2026-11-17')]);
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
});

test('I5: an own entry held as unanswered, or stepped back to it, counts as confirmed nowhere: status lists it, a special process it covered has no entry, and the own methods document is not signed off', () => {
  const dir = cafe();
  const half = ['## OWN-03 Carrying food to a customer', '', 'Kind: additional', 'Process:', 'Hazard: Food warming up on the way.', 'Control:', 'Limit:',
    'Limit-source:', 'Check:', 'If-it-fails:', 'Supplied-text:', 'EH-review:', 'State: unanswered', 'By:', 'On:', 'Source: Sam Okafor, the rest to follow'].join('\n');
  setSheet(dir, 'own', `${sheet(dir, 'own')}\n${half}\n`);
  assert.deepEqual(parseWorksheet(sheet(dir, 'own'), data).problems, []);
  const own = docStatus(dir, 'FOODOWN');
  assert.deepEqual([own.questions, own.confirmed, own.proposed, own.unanswered, own.problems], [3, 2, 0, 1, 0]);
  const waiting = '1 own entry in food-safety/answers-own.md is not yet confirmed (OWN-03): an entry counts when its State is confirmed and By and On are filled in';
  assert.equal(linesFor(dir, 'FOODOWN')[0], waiting);
  writeDocument(dir, 'FOODOWN');
  const refused = signOff(dir, 'FOODOWN');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [waiting, UNCOVERED]);
  assert.ok(rendered('FOODCMP', dir).includes(`- Own methods (FOODOWN): ${waiting}\n`));
  // The sous vide entry stepped back to unanswered, its words kept: the profile's sous vide then has no own entry.
  const stepped = swap(sheet(dir, 'own'), 'EH-review: pending\nState: confirmed\nBy: Sam Okafor\nOn: 2026-11-17', 'EH-review: pending\nState: unanswered\nBy:\nOn:');
  setSheet(dir, 'own', stepped);
  assert.deepEqual(parseWorksheet(stepped, data).problems, []);
  assert.ok(parseWorksheet(stepped, data).entries.get('OWN-02').suppliedText.startsWith('Our sous vide egg method'));
  assert.deepEqual(status(dir).specialProcesses.map((process) => process.ownEntry), [null, null]);
  assert.deepEqual(status(dir).ownAwaitingReview, []);
  assert.equal(docStatus(dir, 'FOODOWN').confirmed, 1);
  assert.ok(rendered('FOODOWN', dir).includes('Not yet confirmed, so not shown: OWN-02 and OWN-03.'));
  assert.ok(!rendered('FOODOWN', dir).includes('British Lion'));
});

// ---- What status says of a document, the completion record and the folder (M4) ----

test('M4: the readable status says what is wrong with a written document, not "out of date" for every failed check', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  const text = readFileSync(file, 'utf8');
  const line = () => run('status', '--project', dir).stdout.split('\n').find((l) => l.startsWith('FOODCOOK'));
  const says = (words) => `FOODCOOK (Cooking): 41 of 41 questions confirmed; not relevant: CK-06; ARC-001-FOODCOOK-v1.0.md ${words}; not signed off`;
  assert.equal(line(), says('in step with its worksheets'));
  for (const [from, to, words] of [
    ['Poached eggs', 'Boiled eggs', 'changed by hand between its markers'],
    ['<!-- UK-FOOD:END -->', '', 'with its markers missing or damaged'],
    ['## Revision History', '## COOKING\n\n## Revision History', 'with the pack\'s text outside its markers'],
    ['| **Status** | DRAFT |', '| **Status** | APPROVED |', 'with a header that claims a sign-off nobody recorded']
  ]) {
    writeFileSync(file, swap(text, from, to));
    assert.equal(line(), says(words), words);
  }
  writeFileSync(file, text);
  // A file that cannot be opened is said to be so (a user who can read every file cannot test this).
  chmodSync(file, 0o000);
  if (run('check', '--doc', 'FOODCOOK', '--project', dir, '--report', file).status === 2) {
    assert.equal(line(), says('that cannot be read'));
    assert.match(linesFor(dir, 'FOODCOOK')[0], /^document ARC-001-FOODCOOK-v1\.0\.md cannot be read \(/);
  }
  chmodSync(file, 0o644);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  assert.equal(line(), says('out of date'));
  // A document whose worksheet has problems cannot be compared with a fresh print, and is not called out of date.
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a stray line\n`);
  assert.equal(line(), 'FOODCOOK (Cooking): 1 worksheet problem; 0 of 46 questions confirmed; ARC-001-FOODCOOK-v1.0.md not checked, as a ' +
    'worksheet it needs is missing or has problems; not signed off');
  // Signed, marked, then added to: the file is no longer the one signed.
  const other = cafe();
  const signed = templated(other, 'FOODCOOK');
  assert.equal(signOff(other, 'FOODCOOK').status, 0);
  mark(signed);
  writeFileSync(signed, `${readFileSync(signed, 'utf8')}\nA note nobody signed.\n`);
  assert.ok(run('status', '--project', other).stdout.includes('ARC-001-FOODCOOK-v1.0.md changed since it was signed off; not signed off'));
});

test('M4: status says where the completion record stands, in its own place: not written, up to date, or out of date and what to do', () => {
  const dir = cafe();
  const recordLine = () => run('status', '--project', dir).stdout.split('\n').find((l) => l.startsWith('FOODCMP'));
  assert.equal(recordLine(), 'FOODCMP (Completion record): not written');
  assert.equal(status(dir).completionRecord, null);
  const record = writeDocument(dir, 'FOODCMP');
  assert.equal(recordLine(), 'FOODCMP (Completion record): ARC-001-FOODCMP-v1.0.md up to date');
  assert.deepEqual(status(dir).completionRecord, { file: 'ARC-001-FOODCMP-v1.0.md', version: '1.0', inSync: true, problem: null });
  // A document is written: the record no longer matches the project.
  writeDocument(dir, 'FOODCOOK');
  const stale = 'document ARC-001-FOODCMP-v1.0.md is out of date, as it no longer matches the project: render it again';
  assert.equal(recordLine(), `FOODCMP (Completion record): ${stale}`);
  assert.deepEqual(status(dir).completionRecord, { file: 'ARC-001-FOODCMP-v1.0.md', version: '1.0', inSync: false, problem: stale });
  // It is not one of the documents, and is never in the unfinished list: the record prints that list,
  // so a line about the record there could never be true of the record that holds it.
  assert.ok(!status(dir).documents.some((d) => d.code === 'FOODCMP'));
  assert.ok(!status(dir).unfinished.some((line) => line.code === 'FOODCMP' || line.what.includes('FOODCMP')));
  assert.deepEqual(JSON.parse(run('status', '--project', dir, '--json').stdout), status(dir));
  // Written again, it is up to date, and still passes its own check.
  writeFileSync(record, readFileSync(writeDocument(dir, 'FOODCMP'), 'utf8'));
  assert.equal(recordLine(), 'FOODCMP (Completion record): ARC-001-FOODCMP-v1.0.md up to date');
  assert.equal(checkDocument('FOODCMP', dir, record, data).exit, 0);
  // A header that claims a sign-off is told the same way.
  const claimed = templated(dir, 'FOODCMP', { status: 'APPROVED' });
  assert.match(recordLine(), /^FOODCMP \(Completion record\): document ARC-001-FOODCMP-v1\.0\.md says in its header, at line \d+, that Status is "APPROVED", though the completion record is a report that nobody signs/);
  assert.equal(status(dir).completionRecord.inSync, false);
  assert.ok(claimed);
});

test('M4: status on a folder that holds no food-safety folder says in its first line that nothing has been started there, and still exits 0', () => {
  const empty = mkdtempSync(join(tmpdir(), 'uk-food-empty-'));
  const result = run('status', '--project', empty);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.split('\n')[0], `Food safety status, data ${DATA_ID}: nothing has been started in this folder, which holds no ` +
    'food-safety folder. Check that it is the business\'s project folder');
  assert.equal(JSON.parse(run('status', '--project', empty, '--json').stdout).foodSafetyFolder, false);
  // An empty food-safety folder is a project just begun.
  mkdirSync(join(empty, 'food-safety'));
  assert.equal(run('status', '--project', empty).stdout.split('\n')[0], `Food safety status, data ${DATA_ID}`);
  assert.equal(status(empty).foodSafetyFolder, true);
  assert.equal(run('status', '--project', cafe()).stdout.split('\n')[0], `Food safety status, data ${DATA_ID}`);
});

// ---- The date of a sign-off (M2) ----

const dayFrom = (offset) => {
  const day = new Date();
  day.setDate(day.getDate() + offset);
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
};

test('M2: sign-off refuses a date after today, writing nothing, and takes today or any earlier day', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  for (const date of [dayFrom(1), dayFrom(30), '2999-01-01']) {
    const refused = signOff(dir, 'FOODCOOK', '--date', date);
    assert.equal(refused.status, 2, date);
    assert.equal(refused.stdout, '', date);
    assert.ok(refused.stderr.includes(`--date is the day the document was signed off, which cannot be after today, ${today()}: ${date} is`), refused.stderr);
    assert.match(refused.stderr, /usage: uk-food\.mjs/);
    assert.ok(!existsSync(signOffsFile(dir)), date);
  }
  assert.match(run('sign-off').stderr.replace(/\s+/g, ' '), /DATE is YYYY-MM-DD, today when not given, and never after today/);
  assert.equal(signOff(dir, 'FOODCOOK', '--date', today()).status, 0);
  assert.equal(signOff(dir, 'FOODCOOK', '--date', dayFrom(-1)).status, 0);
  assert.equal(signOff(dir, 'FOODCOOK', '--date', '2026-11-17').status, 0);
  assert.deepEqual(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.map((record) => record.date), [today(), dayFrom(-1), '2026-11-17']);
  // A record read back is not held to today's date: the day it was made, it was not in the future.
  const records = JSON.parse(readFileSync(signOffsFile(dir), 'utf8'));
  records.signOffs.at(-1).date = '2999-01-01';
  writeFileSync(signOffsFile(dir), `${JSON.stringify(records, null, 2)}\n`);
  assert.equal(run('status', '--project', dir).status, 0);
});
