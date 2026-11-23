import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import {
  COMPLETION_ROWS, CONTROL_FIELDS, DATA_ID, DEFAULT_DATA_DIR, PENDING, PROFILE_QUESTIONS, SECTION_DOCS, SECTION_IDS, SIGN_OFFS_SCHEMA,
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
// A cleaning worksheet that is finished with no entry: it says where the business keeps its schedule, confirmed.
const KEPT_ELSEWHERE = () => swap(blankWorksheet('cleaning', data), '## Kept elsewhere\n\nWhere:\nState: unanswered\nBy:\nOn:',
  '## Kept elsewhere\n\nWhere: The red folder in the office\nState: confirmed\nBy: Sam Okafor\nOn: 2026-11-17');
// An allergens worksheet that is finished with no dish: it says where the business keeps its allergen information, confirmed.
const ALLERGENS_KEPT = () => swap(blankWorksheet('allergens', data), '## Kept elsewhere\n\nWhere:\nState: unanswered\nBy:\nOn:',
  '## Kept elsewhere\n\nWhere: The recipe folder in the kitchen\nState: confirmed\nBy: Sam Okafor\nOn: 2026-11-17');
const swap = (text, from, to) => {
  assert.ok(text.includes(from), `${JSON.stringify(from)} is not in the text`);
  return text.replace(from, to);
};
// The date the commands would give as today. A worksheet with dated entries (the allergens worksheet's Checked-on) is read
// with it, as every command reads one: a reading given no date refuses such a date rather than take it unchecked.
const TODAY = '2026-11-22';
const rendered = (doc, dir) => {
  const result = renderDocument(doc, dir, data, { today: TODAY });
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
  const result = projectStatus(dir, data, { today: TODAY });
  assert.equal(result.exit, undefined, (result.messages ?? []).join('\n'));
  return result;
};
const docStatus = (dir, code) => status(dir).documents.find((d) => d.code === code);
const linesFor = (dir, code) => status(dir).unfinished.filter((line) => line.code === code).map((line) => line.what);
// A sign-off by Sam Okafor, the owner, of version 1.0 on 2026-11-17 unless `extra` says otherwise. signOffUnread
// gives nothing about text outside the document's checked part; signOff says it has been read, since
// writeDocument's header and footer lines are such text.
const signOffUnread = (dir, doc, ...extra) => run('sign-off', '--doc', doc, '--project', dir, '--name', 'Sam Okafor', '--role', 'Owner',
  ...(extra.includes('--version') ? [] : ['--version', '1.0']), ...(extra.includes('--date') ? [] : ['--date', '2026-11-17']), ...extra);
const signOff = (dir, doc, ...extra) => signOffUnread(dir, doc, ...(extra.includes('--other-text-read') ? [] : ['--other-text-read', 'yes']), ...extra);
const markerHash = (file) => /body=([0-9a-f]{64})/.exec(readFileSync(file, 'utf8'))[1];
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
// The two hashes a sign-off holds for a document as it is now, read as the helper reads them: with the
// file's name and the sign-offs recorded in its project.
const hashesOf = (file, doc) => {
  const records = existsSync(signOffsFile(dirname(file))) ? JSON.parse(readFileSync(signOffsFile(dirname(file)), 'utf8')).signOffs : [];
  return documentHashes(readFileSync(file, 'utf8'), doc, basename(file), records);
};
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
const answersChangedLine = (name, date) => `signed off by ${name} on ${date}, but its answers have changed since: writing ` +
  'the document again makes a new version, which then needs signing off';
// Told when the header claims nothing, so the file is in step and its command has nothing to write.
const outsideChangedLine = (name, date) => `signed off by ${name} on ${date}, but the file was changed outside its UK-FOOD ` +
  'markers after that, so the sign-off no longer covers it: take that change out again, or have a named person sign it off ' +
  'again as it now reads';
// A written document that fails check, by check's own first reason.
const staleLine = (file) => `document ${file} is out of date, as its worksheets have changed since it was written: write the ` +
  'document again from its worksheet';
const editedLine = (file, line) => `document ${file} was changed between its UK-FOOD markers, at line ${line}: make the change in ` +
  'its worksheet instead, and write the document again from its worksheet';
const outsideLine = (file, line) => `document ${file} holds the pack's text outside its UK-FOOD markers, at line ${line}, where it ` +
  'is not checked: take that heading out, so that the pack\'s text stands only between the markers';
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
    'recordSheets', 'foodSafetyFolder']);
  assert.deepEqual([result.completionRecord, result.foodSafetyFolder], [null, true]);
  // The record sheets are blank forms, reported apart from the documents: here, not written.
  assert.deepEqual(result.recordSheets, { written: false, inStep: false, file: null });
  assert.equal(result.data, DATA_ID);
  assert.deepEqual(result.documents.map((d) => d.code), ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN', 'FOODALG',
    'FOODCS', 'FOODSUP']);
  assert.deepEqual(STATUS_ORDER, result.documents.map((d) => d.code));
  for (const doc of result.documents) {
    // A list document gives its `counts` too (item 8); every other has exactly the fields it always had.
    const listed = ['FOODALG', 'FOODCS', 'FOODSUP'].includes(doc.code);
    assert.deepEqual(Object.keys(doc), ['code', 'worksheets', 'missingWorksheets', 'problems', 'misplaced', 'questions', 'confirmed', 'proposed',
      'unanswered', 'notRelevantMethods', 'adaptedMethods', ...(listed ? ['counts'] : []), 'file', 'version', 'rendered', 'inSync', 'bodyInStep',
      'otherText', 'signedOff', 'signOff', 'headerShowsSignOff'], doc.code);
    assert.deepEqual([doc.file, doc.version, doc.rendered, doc.inSync, doc.signedOff, doc.signOff], [null, null, false, false, false, null], doc.code);
    assert.deepEqual([doc.bodyInStep, doc.otherText, doc.headerShowsSignOff], [null, [], null], doc.code);
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

test('item 8: each list document\'s counts in status --json give its entries and those confirmed, and for the allergen information the empty cells of confirmed dishes', () => {
  const dir = cafe();
  const counts = (code) => docStatus(dir, code).counts;
  // The cafe: four dishes, three confirmed, two of whose cells (Celery and Mustard in DISH-02) are empty; four cleaning
  // items, three confirmed; four entries, all confirmed. Each is the same as the document's questions and confirmed.
  // keptElsewhereOnly (final review E2) is false for each: nothing in the cafe's lists is kept elsewhere.
  assert.deepEqual(counts('FOODALG'), { entries: 4, confirmed: 3, keptElsewhereOnly: false, cellsNotConfirmed: 2 });
  assert.deepEqual(counts('FOODCS'), { entries: 4, confirmed: 3, keptElsewhereOnly: false });
  assert.deepEqual(counts('FOODSUP'), { entries: 4, confirmed: 4, keptElsewhereOnly: false });
  for (const code of ['FOODALG', 'FOODCS', 'FOODSUP']) {
    const doc = docStatus(dir, code);
    assert.deepEqual([doc.counts.entries, doc.counts.confirmed], [doc.questions, doc.confirmed], code);
  }
  // The own methods document, whose entries are counted too, and the six others keep exactly the fields they had.
  for (const code of PLAN_1_DOCS) assert.equal(docStatus(dir, code).counts, undefined, code);
  const json = JSON.parse(run('status', '--project', dir, '--json').stdout);
  assert.deepEqual(json.documents.find((d) => d.code === 'FOODALG').counts, { entries: 4, confirmed: 3, keptElsewhereOnly: false, cellsNotConfirmed: 2 });
  // One of those cells filled in: one left.
  setSheet(dir, 'allergens', swap(sheet(dir, 'allergens'), 'Cereals-containing-gluten: contains\nCelery:\n',
    'Cereals-containing-gluten: contains\nCelery: does not contain\n'));
  assert.deepEqual(counts('FOODALG'), { entries: 4, confirmed: 3, keptElsewhereOnly: false, cellsNotConfirmed: 1 });
  // In a worksheet with a problem nothing counts as confirmed, so no cell of a confirmed dish is counted either.
  setSheet(dir, 'allergens', `${sheet(dir, 'allergens')}a stray line\n`);
  assert.deepEqual(counts('FOODALG'), { entries: 4, confirmed: 0, keptElsewhereOnly: false, cellsNotConfirmed: 0 });
  // Not started: nothing to count.
  rmSync(sheetFile(dir, 'allergens'));
  rmSync(sheetFile(dir, 'cleaning'));
  assert.deepEqual([counts('FOODALG'), counts('FOODCS')], [{ entries: 0, confirmed: 0, keptElsewhereOnly: false, cellsNotConfirmed: 0 }, { entries: 0, confirmed: 0, keptElsewhereOnly: false }]);
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
    { code: 'FOODALG', what: '1 dish in food-safety/answers-allergens.md is proposed but not confirmed (DISH-03): an entry counts when it has ' +
      'what the worksheet\'s guidance says it needs, its State is confirmed and By and On are filled in' },
    { code: 'FOODALG', what: '2 allergen cells of confirmed dishes in food-safety/answers-allergens.md are not filled in, so the document shows them ' +
      'as not confirmed (Celery and Mustard in DISH-02): fill in each as contains or does not contain from what was checked, then update that ' +
      'dish\'s Checked-against, Checked-on, By and On' },
    { code: 'FOODALG', what: 'MG-04-Q01, MG-04-Q06 and MG-04-Q14 in food-safety/answers-MG.md have no confirmed answer yet, and this document ' +
      'repeats them under How customers are told: answer them in the Management safe methods worksheet; an answer counts when its State is ' +
      'confirmed and By and On are filled in' },
    { code: 'FOODALG', what: NOT_WRITTEN },
    { code: 'FOODALG', what: NOT_SIGNED },
    { code: 'FOODCS', what: '1 cleaning item in food-safety/answers-cleaning.md is proposed but not confirmed (CS-04): an ' +
      'entry counts when it has what the worksheet\'s guidance says it needs, its State is confirmed and By and On are filled in' },
    { code: 'FOODCS', what: NOT_WRITTEN },
    { code: 'FOODCS', what: NOT_SIGNED },
    { code: 'FOODSUP', what: NOT_WRITTEN },
    { code: 'FOODSUP', what: NOT_SIGNED },
    { code: 'FOODREC', what: 'document not written yet: write it, so that people at the business have the blank forms to print and fill in' },
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

test('item 6: a problem in the Management worksheet is told under the two documents that print from it too, as neither can be written; one in the profile is told once, under the profile, for every document', () => {
  const FORMS_NOT_WRITTEN = 'document not written yet: write it, so that people at the business have the blank forms to print and fill in';
  const dir = cafe();
  const forms = writeDocument(dir, 'FOODREC');
  setSheet(dir, 'MG', `${sheet(dir, 'MG')}a stray line\n`);
  const mg = problemsLine('MG', 1);
  // Neither the allergen information nor the record sheets can be written while that worksheet has a problem.
  for (const doc of ['FOODALG', 'FOODREC']) assert.equal(renderDocument(doc, dir, data, { today: TODAY }).exit, 1, doc);
  assert.deepEqual(linesFor(dir, 'FOODMGT'), [mg, NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(linesFor(dir, 'FOODALG')[0], mg);
  assert.equal(linesFor(dir, 'FOODALG').filter((line) => line.includes('answers-MG.md')).length, 1, 'told once there');
  // The record sheets, written before the problem, cannot be compared with a fresh print, so only the worksheet is told.
  assert.deepEqual(linesFor(dir, 'FOODREC'), [mg]);
  const said = run('status', '--project', dir).stdout;
  assert.ok(said.includes(`\n- FOODALG: ${mg}\n`) && said.includes(`\n- FOODREC: ${mg}\n`), said);
  assert.match(said, /\nFOODALG \(Allergen information\): 1 worksheet problem; /);
  assert.match(said, new RegExp(`\\nFOODREC \\(Diary and record sheets\\): 1 worksheet problem; ${basename(forms)} not checked, `));
  assert.ok(rendered('FOODCMP', dir).includes(`\n- Diary and record sheets (FOODREC): ${mg}\n`));
  // Not written, the record sheets are told the worksheet first, then that they are not written.
  rmSync(forms);
  assert.deepEqual(linesFor(dir, 'FOODREC'), [mg, FORMS_NOT_WRITTEN]);
  // The profile document reads that worksheet too, for each safe method's status, and says what it always said: the
  // worksheet's line is under its own document, which follows.
  assert.deepEqual(linesFor(dir, 'FOODPROF'), [NOT_WRITTEN, NOT_SIGNED]);
  // Followed, the line is gone from all three.
  setSheet(dir, 'MG', sheet(dir, 'MG').replace(/a stray line\n$/, ''));
  for (const doc of ['FOODMGT', 'FOODALG', 'FOODREC']) assert.ok(!linesFor(dir, doc).includes(mg), doc);

  // A problem in the profile, which every document reads: one line, under the profile document at the head of the list.
  // Every other document, the new ones and the record sheets among them, counts it in its own line and says no more.
  const other = cafe();
  setSheet(other, 'profile', `${sheet(other, 'profile')}a stray line\n`);
  const profile = problemsLine('profile', 1);
  assert.deepEqual(status(other).unfinished.filter((line) => line.what === profile).map((line) => line.code), ['FOODPROF']);
  const out = run('status', '--project', other).stdout;
  for (const code of STATUS_ORDER.slice(1)) assert.match(out, new RegExp(`\\n${code} \\([^)]+\\): 1 worksheet problem; `), code);
  assert.match(out, /\nFOODREC \(Diary and record sheets\): 1 worksheet problem; not written\n/);
  assert.deepEqual(linesFor(other, 'FOODREC'), [FORMS_NOT_WRITTEN]);
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
    paperSigned: 'yes', otherTextRead: true, body: markerHash(file), outside: hashesOf(file, 'FOODCOOK').outside };
  assert.match(record.outside, /^[0-9a-f]{64}$/);
  assert.equal(hashesOf(file, 'FOODCOOK').body, record.body);
  const text = readFileSync(signOffsFile(dir), 'utf8');
  assert.equal(text, `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [record] }, null, 2)}\n`);
  assert.deepEqual(Object.keys(JSON.parse(text).signOffs[0]), ['doc', 'version', 'file', 'name', 'role', 'date', 'paperSigned', 'otherTextRead', 'body', 'outside']);
  // One line, saying what was recorded and that the document's header reads as it did, DRAFT or an earlier sign-off.
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
  const result = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--other-text-read', 'yes', '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0');
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
  const result = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--other-text-read', 'yes', '--name', name, '--role', 'Owner', '--version', '1.0',
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
  const second = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--other-text-read', 'yes', '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0',
    '--date', '2026-11-17');
  assert.equal(second.status, 0, second.stderr);
  assert.equal(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.length, 2);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').signOff.name], [true, 'Priya Shah']);
  // Priya then signs off version 1.1, which is later removed: Sam's sign-off of 1.0 matches the file
  // now current, but it is not the newest, so the document is not signed off.
  const later = writeDocument(dir, 'FOODCOOK', '1.1');
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--other-text-read', 'yes', '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.1').status, 0);
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
    paperSigned: 'no', otherTextRead: false, ...hashesOf(file, doc) });
  // XC has questions unanswered and proposed; the own methods document has a special process with no entry.
  const records = ['FOODXC', 'FOODOWN', 'FOODCOOK'].map((doc) => forged(doc, writeDocument(dir, doc)));
  writeFileSync(signOffsFile(dir), `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: records }, null, 2)}\n`);
  for (const code of ['FOODXC', 'FOODOWN']) {
    const doc = docStatus(dir, code);
    assert.deepEqual([doc.inSync, doc.signedOff, doc.signOff.name], [true, false, 'Forged Name'], code);
  }
  // Nothing has changed since the record, so it is not said to have. The cross-contamination document
  // still shows questions not yet answered, so its record cannot be right, and is said to be so (G8).
  // The own methods document shows none: it may have been signed before the profile confirmed the
  // process, so its lines say only what is unfinished.
  const xc = outstanding(dir, 'XC');
  assert.deepEqual(linesFor(dir, 'FOODXC'), [unansweredLine('XC', xc.unanswered), proposedLine('XC', xc.proposed),
    'the sign-off recorded for this file in Forged Name\'s name, on 2026-11-17, cannot be right: the document still shows a ' +
    'question not yet answered or an entry not yet confirmed, and one that does is never signed off. Once it is finished and ' +
    'written again, a named person signs it off']);
  assert.deepEqual(linesFor(dir, 'FOODOWN'), [UNCOVERED, AWAITING]);
  const rows = tableRows(rendered('FOODCMP', dir));
  rows.forEach((row, i) => assert.deepEqual(row.slice(1, 3), targets[i].section === 'CK' ? ['2026-11-17', 'Forged Name'] : [PENDING, PENDING], row[0]));
  // FOODCOOK is finished, so a matching record makes it signed off, whoever wrote it: the record is the business's to keep.
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
});

test('a sign-offs.json that is not valid JSON or has the wrong shape: status, the completion record and sign-off exit 2, say so, and never change it', () => {
  const record = { doc: 'FOODCOOK', version: '1.0', file: 'ARC-001-FOODCOOK-v1.0.md', name: 'Sam Okafor', role: 'Owner', date: '2026-11-17',
    paperSigned: 'no', otherTextRead: false, body: 'a'.repeat(64), outside: 'b'.repeat(64) };
  const shaped = (signOffs, schema = SIGN_OFFS_SCHEMA) => JSON.stringify({ schema, signOffs });
  const cases = ['{ "schema": ', '[]', shaped([], 'uk-food-sign-offs-0.1'), JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: {} }),
    JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [], extra: 1 }), shaped([{ ...record, body: undefined }]),
    shaped([{ ...record, outside: undefined }]), shaped([{ ...record, answers: 'a'.repeat(64) }]), shaped([{ ...record, outside: 'not a hash' }]),
    shaped([{ ...record, note: 'x' }]), shaped([{ ...record, date: '2026-02-30' }]), shaped([{ ...record, paperSigned: 'maybe' }]),
    shaped([{ ...record, otherTextRead: 'yes' }]), shaped([{ ...record, otherTextRead: undefined }]),
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
    ['--doc', 'FOODCOOK', '--name', 'Sam\u202eOkafor', '--role', 'Owner'],
    ['--doc', 'FOODCOOK', ...person, '--date', '2026-02-30'], ['--doc', 'FOODCOOK', ...person, '--date', 'tomorrow'],
    ['--doc', 'FOODCOOK', ...person, '--paper-signed', 'maybe']
  ]) {
    // Issue #1132: a value that is wrong gets its one-line message, and the usage text is left out.
    const result = run(...base, ...args);
    assert.equal(result.status, 2, args.join(' '));
    assert.equal(result.stdout, '', args.join(' '));
    assert.doesNotMatch(result.stderr, /usage:/, args.join(' '));
    assert.equal(result.stderr.trim().split('\n').length, 1, args.join(' '));
    assert.ok(!existsSync(signOffsFile(dir)), args.join(' '));
  }
  // An option left out, or one the command does not take, is a usage error and still shows the usage.
  for (const args of [['--doc', 'FOODCOOK', '--role', 'Owner'], ['--doc', 'FOODCOOK', ...person, '--extra'], [...person]]) {
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

test('item 2: the cafe\'s completion record differs from the one Plan 1 printed only by lines added under ## Unfinished, and the pack\'s table is byte-identical', () => {
  // The lines between the markers: the marker's hash differs whenever the body does, so it is left out.
  const inner = (text) => text.replace(/\n$/, '').split('\n').slice(1, -1);
  const before = inner(readFileSync(join(CAFE, 'expected', 'FOODCMP.plan-1.body.md'), 'utf8'));
  const now = inner(rendered('FOODCMP', cafe()));
  // Everything up to and including the heading is as it was: the coverage sentence, the pack's title and text, and its table.
  const [was, is] = [before, now].map((lines) => lines.indexOf('## Unfinished'));
  assert.ok(was > 0 && is > 0);
  assert.deepEqual(now.slice(0, is + 1), before.slice(0, was + 1));
  const table = (lines) => {
    const start = lines.indexOf(`| ${recordTables[0].columns.join(' | ')} |`);
    const length = lines.slice(start).findIndex((line) => !line.startsWith('|'));
    return lines.slice(start, start + length).join('\n');
  };
  assert.ok(table(before).split('\n').length > recordRows.length);
  assert.equal(table(now), table(before));
  // After the heading, every line Plan 1 printed is there, in its order, with lines added among them and nothing taken out.
  const rest = now.slice(is + 1);
  let at = 0;
  for (const line of before.slice(was + 1)) {
    const found = rest.indexOf(line, at);
    assert.ok(found >= 0, `missing or out of order: ${line}`);
    at = found + 1;
  }
  assert.ok(now.length > before.length, 'the new documents add lines under ## Unfinished');
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
  const odd = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--other-text-read', 'yes', '--name', 'Sam *Okafor* <b>$x$</b>', '--role', 'Owner', '--version', '1.0',
    '--date', '2026-11-17');
  assert.equal(odd.status, 0, odd.stderr);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const changed = rendered('FOODCMP', dir);
  assert.ok(changed.includes('- Cooking (FOODCOOK): signed off by Sam \\*Okafor\\* &lt;b&gt;\\$x\\$&lt;/b&gt; on 2026-11-17, but its answers have changed since: writing the document again makes a new version, which then needs signing off\n'), changed);
  assert.doesNotMatch(changed, /<b>|(?<!\\)\*Okafor/);
});

// Makes the cafe's worksheets finished: every safe method not relevant, each with its reason and decider, but those
// `applying` names, which apply with every question confirmed; no special process; no own entries; and the allergen
// information and the cleaning schedule kept elsewhere, unless `lists` gives a worksheet of entries for one. The cafe's
// suppliers' worksheet is finished as it is. Nothing is written or signed.
const finishEverything = (dir, { applying = [], lists = {} } = {}) => {
  for (const section of SECTION_IDS) {
    const parsed = parseWorksheet(blankWorksheet(section, data), data);
    for (const method of data.sections.get(section).methods) {
      if (!applying.includes(method.id)) {
        Object.assign(parsed.methods.get(method.id), { status: 'not-relevant', reason: `No need of ${method.id}.`, decidedBy: 'Sam Okafor' });
        continue;
      }
      for (const question of askedOf(method)) {
        Object.assign(parsed.answers.get(question.id), { answer: question.type === 'text' ? `Our way for ${question.id}` : 'yes', state: 'confirmed',
          by: 'Sam Okafor', on: '2026-11-17' });
      }
    }
    setSheet(dir, section, emitWorksheet(parsed, data));
    assert.deepEqual(parseWorksheet(sheet(dir, section), data).problems, [], section);
  }
  setSheet(dir, 'profile', sheet(dir, 'profile').replace(/(### PR-Q1[23]\n\n[^\n]*\nAnswer: )yes/g, '$1no'));
  setSheet(dir, 'own', blankWorksheet('own', data));
  setSheet(dir, 'allergens', lists.allergens ?? ALLERGENS_KEPT());
  setSheet(dir, 'cleaning', lists.cleaning ?? KEPT_ELSEWHERE());
};
// The seven documents a business could hold before the list documents came.
const PLAN_1_DOCS = ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN'];
const NEW_SHEETS = ['allergens', 'cleaning', 'suppliers'];
// What status says of a list document whose worksheet is not started: what the document is for, and the worksheet to make.
const START_LINES = {
  FOODALG: 'this document records each dish the business serves against the fourteen allergens, from its worksheet ' +
    'food-safety/answers-allergens.md, which is not started yet: make it with worksheet --section allergens and fill it in',
  FOODCS: 'this document lists what the business cleans, how often and how, from its worksheet food-safety/answers-cleaning.md, which is ' +
    'not started yet: make it with worksheet --section cleaning and fill it in',
  FOODSUP: 'this document lists the business\'s suppliers, its environmental health team and its other contacts, from its worksheet ' +
    'food-safety/answers-suppliers.md, which is not started yet: make it with worksheet --section suppliers and fill it in'
};

test('Review Focus 3: a project opened after the upgrade, with none of the new worksheets, is told what each new document is for and the worksheet to make; the seven keep their sign-offs', () => {
  // The cafe as a business kept it before the upgrade: its seven worksheets and none of the new ones.
  const dir = cafe();
  for (const section of NEW_SHEETS) rmSync(sheetFile(dir, section));
  const said = run('status', '--project', dir);
  assert.equal(said.status, 0, said.stderr);
  for (const [code, line] of Object.entries(START_LINES)) {
    assert.deepEqual(linesFor(dir, code), [line, NOT_WRITTEN, NOT_SIGNED], code);
    assert.ok(said.stdout.includes(`\n- ${code}: ${line}\n`), said.stdout);
    // Following the line's first step makes a worksheet that parses with no problem, and the line is gone.
    const section = /--section (\w+)/.exec(line)[1];
    const made = run('worksheet', '--section', section);
    assert.equal(made.status, 0, made.stderr);
    setSheet(dir, section, made.stdout);
    assert.deepEqual(parseWorksheet(made.stdout, data).problems, [], section);
    assert.ok(!linesFor(dir, code).includes(line), code);
    rmSync(sheetFile(dir, section));
  }
  assert.ok(said.stdout.includes('\nFOODALG (Allergen information): not started: answers-allergens.md; no dishes yet; not written; not signed off\n'));
  const record = run('render', '--doc', 'FOODCMP', '--project', dir);
  assert.equal(record.status, 0, record.stderr);
  assert.ok(record.stdout.includes(`\n- Cleaning schedule (FOODCS): ${START_LINES.FOODCS}\n`), record.stdout);

  // A business that had finished its seven documents and signed them off before it updated.
  const signed = cafe();
  finishEverything(signed);
  for (const section of NEW_SHEETS) rmSync(sheetFile(signed, section));
  const files = Object.fromEntries(PLAN_1_DOCS.map((doc) => [doc, writeDocument(signed, doc)]));
  for (const doc of PLAN_1_DOCS) assert.equal(signOff(signed, doc).status, 0, doc);
  const after = run('status', '--project', signed);
  assert.equal(after.status, 0, after.stderr);
  const result = status(signed);
  for (const doc of PLAN_1_DOCS) {
    const entry = result.documents.find((d) => d.code === doc);
    assert.deepEqual([entry.signedOff, entry.inSync, entry.signOff.name], [true, true, 'Sam Okafor'], doc);
    assert.match(after.stdout, new RegExp(`\\n${doc} \\([^)]+\\): .*; signed off by Sam Okafor, Owner, on 2026-11-17`), doc);
    // The sign-off recorded still names the file as it now reads, and check passes on it.
    assert.deepEqual({ body: entry.signOff.body, outside: entry.signOff.outside }, hashesOf(files[doc], doc), doc);
    assert.equal(run('check', '--doc', doc, '--project', signed, '--report', files[doc]).status, 0, doc);
  }
  // What is unfinished is the new documents and the record sheets, nothing of the seven.
  assert.deepEqual(result.unfinished, [
    ...Object.entries(START_LINES).flatMap(([code, line]) => [line, NOT_WRITTEN, NOT_SIGNED].map((what) => ({ code, what }))),
    { code: 'FOODREC', what: 'document not written yet: write it, so that people at the business have the blank forms to print and fill in' }
  ]);
  const signedRecord = run('render', '--doc', 'FOODCMP', '--project', signed);
  assert.equal(signedRecord.status, 0, signedRecord.stderr);
  for (const [i, row] of tableRows(signedRecord.stdout).entries()) {
    assert.deepEqual(row, [recordRows[i][0], '2026-11-17', 'Sam Okafor', targets[i].method ? 'Not relevant' : ''], row[0]);
  }
});

test('when everything is finished, every row shows its signer and the list says nothing is outstanding', () => {
  const dir = cafe();
  finishEverything(dir);
  for (const doc of STATUS_ORDER) {
    writeDocument(dir, doc);
    assert.equal(signOff(dir, doc).status, 0, doc);
  }
  // The record sheets are written too: nobody signs them, but until they are written the business has no diary pages.
  writeDocument(dir, 'FOODREC');
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

test('item 3: with every document finished and signed off, a change ends the sign-off of each document whose body it changes, and of no other', () => {
  const dir = cafe();
  // Lists that hold entries: the cafe's first dish, every cell filled in; its cleaning items, the proposed one confirmed;
  // and its suppliers as they are. MG-04 applies, every question confirmed, so the allergen information repeats its answers.
  const allergens = `${sheet(dir, 'allergens').split('\n\n## DISH-02 ')[0]}\n`;
  const cleaning = swap(sheet(dir, 'cleaning'), 'State: proposed\nBy:\nOn:\nSource: Tom Reid\'s notes from the kitchen walk-round',
    'State: confirmed\nBy: Sam Okafor\nOn: 2026-11-17\nSource:');
  finishEverything(dir, { applying: ['MG-04'], lists: { allergens, cleaning } });
  for (const doc of STATUS_ORDER) {
    writeDocument(dir, doc);
    assert.equal(signOff(dir, doc).status, 0, doc);
  }
  writeDocument(dir, 'FOODREC');
  const signed = () => Object.fromEntries(status(dir).documents.map((d) => [d.code, d.signedOff]));
  const ended = (...codes) => Object.fromEntries(STATUS_ORDER.map((code) => [code, !codes.includes(code)]));
  assert.deepEqual(signed(), ended());
  assert.deepEqual(status(dir).unfinished, []);
  // Each change, then the change taken out again: the body is what was signed once more, so the sign-off stands again.
  const tryChange = (section, from, to, ...codes) => {
    const before = sheet(dir, section);
    setSheet(dir, section, swap(before, from, to));
    assert.deepEqual(parseWorksheet(sheet(dir, section), data, { today: TODAY }).problems, [], section);
    assert.deepEqual(signed(), ended(...codes), `${section}: ${from}`);
    // Nothing else is unfinished: not even the record sheets, which print none of these.
    assert.deepEqual([...new Set(status(dir).unfinished.map((line) => line.code))], codes, `${section}: ${from}`);
    setSheet(dir, section, before);
    assert.deepEqual(signed(), ended(), `${section}: ${from}, taken out again`);
  };
  tryChange('cleaning', 'Method: Run its cleaning programme with a cleaning tablet', 'Method: Run its cleaning programme with two cleaning tablets', 'FOODCS');
  tryChange('MG', 'Answer: Our way for MG-04-Q01', 'Answer: In the red folder by the till', 'FOODMGT', 'FOODALG');
  tryChange('suppliers', 'Telephone: 01632 960118', 'Telephone: 01632 960119', 'FOODSUP');
  // A cell of a confirmed dish left empty ends the allergen information's sign-off alone. Written again, as a new version,
  // it shows that cell as not confirmed, and sign-off refuses it with status's own line as the reason.
  setSheet(dir, 'allergens', swap(allergens, 'Celery: does not contain\n', 'Celery:\n'));
  assert.deepEqual(signed(), ended('FOODALG'));
  const newer = writeDocument(dir, 'FOODALG', '1.1');
  assert.ok(readFileSync(newer, 'utf8').includes('| **NOT CONFIRMED** |'));
  const cells = linesFor(dir, 'FOODALG').find((line) => line.includes('allergen cell'));
  assert.equal(cells, '1 allergen cell of confirmed dishes in food-safety/answers-allergens.md is not filled in, so the document shows it as not confirmed ' +
    '(Celery in DISH-01): fill it in as contains or does not contain from what was checked, then update that dish\'s Checked-against, Checked-on, By and On');
  const refused = signOff(dir, 'FOODALG', '--version', '1.1');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [cells]);
  assert.deepEqual(signed(), ended('FOODALG'));
});

test('check --doc FOODCMP passes on a fresh completion record, and once the project changes says it is out of date: render it again', () => {
  const dir = cafe();
  const record = writeDocument(dir, 'FOODCMP');
  assert.equal(checkDocument('FOODCMP', dir, record, data, undefined, { today: TODAY }).exit, 0);
  assert.equal(run('check', '--doc', 'FOODCMP', '--project', dir, '--report', record).status, 0);
  // The completion record is not a document status lists.
  assert.ok(!status(dir).documents.some((d) => d.code === 'FOODCMP'));
  writeDocument(dir, 'FOODCOOK');
  const written = checkDocument('FOODCMP', dir, record, data, undefined, { today: TODAY });
  assert.equal(written.exit, 1);
  assert.match(written.message, /out of date/);
  assert.match(written.message, /render it again/);
  const fresh = writeDocument(dir, 'FOODCMP');
  assert.equal(checkDocument('FOODCMP', dir, fresh, data, undefined, { today: TODAY }).exit, 0);
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  const signed = checkDocument('FOODCMP', dir, fresh, data, undefined, { today: TODAY });
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
// regime's partial, Last Modified given its date, and a fresh render at the body marker. `header` gives
// Status, Reviewed By and Approved By; `history` the approval cells of the Revision History row.
const templated = (dir, doc, { regime = 'uk', version = '1.0', status = 'DRAFT', reviewed = '[PENDING]', approved = '[PENDING]',
  history = ['[PENDING]', '[PENDING]'], body = rendered(doc, dir), template = TEMPLATE } = {}) => {
  const partial = readFileSync(join(PARTIALS, `document-control-${regime}.md`), 'utf8').trimEnd();
  for (const row of ['| **Status** | DRAFT |', '| **Reviewed By** | [PENDING] |', '| **Approved By** | [PENDING] |', '| **Last Modified** | [YYYY-MM-DD] |']) {
    assert.ok(partial.includes(`\n${row}\n`), `${regime}: ${row}`);
  }
  const text = swap(swap(swap(template, HEADER_MARKER, partial
    .replace('| **Status** | DRAFT |', `| **Status** | ${status} |`)
    .replace('| **Reviewed By** | [PENDING] |', `| **Reviewed By** | ${reviewed} |`)
    .replace('| **Approved By** | [PENDING] |', `| **Approved By** | ${approved} |`)
    .replace('| **Last Modified** | [YYYY-MM-DD] |', '| **Last Modified** | 2026-11-16 |')),
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
  edit(file, '| **Last Modified** | 2026-11-16 |', '| **Last Modified** | 2026-11-17 |');
  edit(file, 'confirmed answers | [PENDING] | [PENDING] |', 'confirmed answers | Sam Okafor, Owner | 2026-11-17 |');
};
const lineNumber = (file, needle) => {
  const at = readFileSync(file, 'utf8').split('\n').findIndex((line) => line.includes(needle));
  assert.ok(at >= 0, needle);
  return at + 1;
};
const check = (dir, doc, file) => checkDocument(doc, dir, file, data, undefined, { today: TODAY });
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
  assert.match(result.reason, /^says in its header, at line \d+, that it is signed off, but the file was changed outside its UK-FOOD markers after Sam Okafor signed it off on 2026-11-17: take that change out again, or have a named person sign the document off again as it now reads$/);
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
  // The Build Provenance block as core's hook writes it (hookBlock, below, has the hook make one).
  const stamped = /\| Stamped at \| [^|]+ \|/;
  writeFileSync(file, `${readFileSync(file, 'utf8')}\n${hookBlock()}\n`);
  assert.equal(signed(), true);
  writeFileSync(file, readFileSync(file, 'utf8').replace(stamped, '| Stamped at | 2026-11-17T11:30:00.000Z |'));
  assert.ok(readFileSync(file, 'utf8').includes('| Stamped at | 2026-11-17T11:30:00.000Z |'));
  assert.equal(signed(), true);
  edit(file, '| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 2026-11-16 |');
  assert.equal(signed(), true);
  // The approval cells of the Revision History row hold what the sign-off command writes and nothing
  // else (G1): written another way, they count, so the sign-off ends.
  edit(file, 'answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor, Owner, 2026-11-17 | 17 November 2026 |');
  assert.equal(signed(), false);
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
    // The heading is also a line outside the document's checked part, and is counted as one.
    ['## Revision History', '## COOKING\n\n## Revision History', 'with the pack\'s text outside its markers; 1 line outside its checked part'],
    ['| **Status** | DRAFT |', '| **Status** | APPROVED |', 'with a header that no recorded sign-off bears out']
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
  assert.ok(run('status', '--project', other).stdout.includes('ARC-001-FOODCOOK-v1.0.md changed since it was signed off; 1 line outside its checked part; not signed off'));
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
  assert.equal(checkDocument('FOODCMP', dir, record, data, undefined, { today: TODAY }).exit, 0);
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
    // Issue #1132: the message stands alone, with no usage text after it.
    assert.doesNotMatch(refused.stderr, /usage:/, date);
    assert.equal(refused.stderr.trim().split('\n').length, 1, date);
    assert.ok(!existsSync(signOffsFile(dir)), date);
  }
  assert.match(run('sign-off').stderr.replace(/\s+/g, ' '), /DATE is YYYY-MM-DD, today when not given, and never after today/);
  // Three people, since the same person's sign-off of an unchanged file is not recorded twice (T5).
  const by = (name, date) => run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', name, '--role', 'Manager', '--version', '1.0',
    '--date', date, '--other-text-read', 'yes');
  assert.equal(signOff(dir, 'FOODCOOK', '--date', today()).status, 0);
  assert.equal(by('Priya Nair', dayFrom(-1)).status, 0);
  assert.equal(by('Ali Khan', '2026-11-17').status, 0);
  assert.deepEqual(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.map((record) => record.date), [today(), dayFrom(-1), '2026-11-17']);
  // A record read back is not held to today's date: the day it was made, it was not in the future.
  const records = JSON.parse(readFileSync(signOffsFile(dir), 'utf8'));
  records.signOffs.at(-1).date = '2999-01-01';
  writeFileSync(signOffsFile(dir), `${JSON.stringify(records, null, 2)}\n`);
  assert.equal(run('status', '--project', dir).status, 0);
});

// ---- The seven open items (rulings G1 to G8) ----

const HOOK = 'plugins/arckit-claude/hooks/provenance-stamp.mjs';
// A copy of the cafe's project inside a repository's projects folder, where core's hooks look for documents.
const cafeInRepo = () => {
  const root = mkdtempSync(join(tmpdir(), 'uk-food-repo-'));
  const dir = join(root, 'projects', '001-bramble-cafe');
  mkdirSync(dir, { recursive: true });
  cpSync(join(CAFE, 'food-safety'), join(dir, 'food-safety'), { recursive: true });
  return { root, dir };
};
// Runs core's provenance hook as Claude Code does after a Write or an Edit of `file`.
const stamp = (root, file, tool = 'Edit') => {
  const result = spawnSync('node', [HOOK], { input: JSON.stringify({ tool_name: tool, cwd: root, tool_input: { file_path: file } }), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
};
const blockOf = (text) => text.slice(text.indexOf('<!-- arckit-provenance:start -->'), text.indexOf('<!-- arckit-provenance:end -->') + '<!-- arckit-provenance:end -->'.length);
// The Build Provenance block exactly as the hook writes it today, made by the hook itself.
const hookBlock = (() => {
  let made = null;
  return () => {
    if (!made) {
      const { root, dir } = cafeInRepo();
      const file = templated(dir, 'FOODCOOK');
      stamp(root, file, 'Write');
      made = blockOf(readFileSync(file, 'utf8'));
      assert.match(made, /^<!-- arckit-provenance:start -->\n\n## Build Provenance\n/);
    }
    return made;
  };
})();
const SAM = 'Sam Okafor, Owner, 2026-11-17';
// A cell of the header that holds something the commands do not write there, as the unfinished list tells it.
const cellLine = (file, line, field, typed, want) => `document ${file} has ${typed === '' ? 'nothing' : `"${typed}"`} in ${field}, at line ${line}, ` +
  `a cell the sign-off step rewrites: write ${want} there first, so that marking the document as signed off changes nothing else in the file`;
const unsoundLine = (name, date) => `the sign-off recorded for this file in ${name}'s name, on ${date}, cannot be right: the document ` +
  'still shows a question not yet answered or an entry not yet confirmed, and one that does is never signed off. Once it is ' +
  'finished and written again, a named person signs it off';

test('G1: the real provenance hook, run on a document before and after it is signed off and marked, leaves the sign-off standing each time it stamps', () => {
  for (const model of ['[AI_MODEL]', 'claude-opus-5-5', 'claude-sonnet-4-6']) {
    const { root, dir } = cafeInRepo();
    const file = templated(dir, 'FOODCOOK');
    edit(file, '**Model**: [AI_MODEL]', `**Model**: ${model}`);
    stamp(root, file, 'Write');
    assert.match(readFileSync(file, 'utf8'), /\n<!-- arckit-provenance:start -->\n\n## Build Provenance\n/, model);
    assert.equal(signOff(dir, 'FOODCOOK').status, 0, model);
    assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true, model);
    mark(file);
    const before = readFileSync(file, 'utf8');
    stamp(root, file);
    const after = readFileSync(file, 'utf8');
    assert.notEqual(after, before, 'the hook stamps again, with a new time');
    assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
    assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').signedOff], [true, true], model);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [], model);
  }
  // A document signed before it was ever stamped, then stamped by the edit that marks it.
  const { root, dir } = cafeInRepo();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  stamp(root, file);
  assert.ok(readFileSync(file, 'utf8').includes('## Build Provenance'));
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  // Written inside a build: the hook adds the build's rows, and stamps the same ones again.
  const built = cafeInRepo();
  const other = templated(built.dir, 'FOODCOOK');
  mkdirSync(join(built.dir, '.arckit'), { recursive: true });
  const buildState = (topic) => writeFileSync(join(built.dir, '.arckit', 'state.json'), JSON.stringify({ recipe: 'uk-food-sfbb',
    targets: { CK: { status: 'complete', path: `projects/001-bramble-cafe/${basename(other)}`, wave: 2, skill: 'uk-food-safe-methods', topic } } }));
  buildState(null);
  stamp(built.root, other, 'Write');
  assert.match(readFileSync(other, 'utf8'), /\| Build Recipe \| `uk-food-sfbb` \|\n\| Build Wave \| 2 \|\n\| Build Target \| `CK` \|/);
  assert.equal(signOff(built.dir, 'FOODCOOK').status, 0);
  mark(other);
  stamp(built.root, other);
  assert.equal(docStatus(built.dir, 'FOODCOOK').signedOff, true);
  // A build's topic is free text the hook copies, so that one row counts as it was signed: another topic ends the sign-off.
  buildState('The cooking record');
  stamp(built.root, other);
  assert.match(readFileSync(other, 'utf8'), /\| Build Topic \| The cooking record \|/);
  assert.equal(docStatus(built.dir, 'FOODCOOK').signedOff, false);
});

test('G1: once a document is signed off, a header cell, an approval cell of the Revision History or a line of the Build Provenance block that holds anything but what the commands and the hook write ends the sign-off, and one that reads as a claim fails check at its own line', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  writeFileSync(file, `${readFileSync(file, 'utf8')}\n${hookBlock()}\n`);
  const signed = () => docStatus(dir, 'FOODCOOK').signedOff;
  assert.equal(signed(), true);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  const text = readFileSync(file, 'utf8');
  const name = basename(file);
  // What the commands and the hook do write: another date, another time of stamping, the rows put back to pending.
  for (const [from, to] of [
    ['| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 2026-11-18 |'],
    ['| **Last Modified** | 2026-11-17 |', '| **Last Modified** | [PENDING] |'],
    [/\| Stamped at \| [^|]+ \|/, '| Stamped at | 2027-01-02T03:04:05.678Z |'],
    [/\| Effective Effort \| [^\n]+ \|/, '| Effective Effort | `high` (downgraded from `max` \u2014 model does not support that level) |'],
    [/\| Effective Effort \| [^\n]+ \|/, '| Effective Effort | `max` |']
  ]) {
    assert.ok(typeof from === 'string' ? text.includes(from) : from.test(text), String(from));
    writeFileSync(file, text.replace(from, to));
    assert.equal(signed(), true, to);
    assert.equal(check(dir, 'FOODCOOK', file).exit, 0, to);
  }
  // The six the review showed, and others of their kinds. Each ends the sign-off; `kind` and `at` say how check fails.
  const header = (pattern) => ({ kind: 'header', pattern });
  const end = '<!-- arckit-provenance:end -->';
  const cases = [
    ['| **Status** | APPROVED |', '| **Status** | APPROVED by the council |', header(/Status is "APPROVED by the council".*Write APPROVED there, or put it back to DRAFT/)],
    ['| **Status** | APPROVED |', '| **Status** | Approved |', header(/Status is "Approved".*Write APPROVED there/)],
    ['| **Status** | APPROVED |', '| **Status** | **APPROVED** |', header(/Write APPROVED there/)],
    [`| **Approved By** | ${SAM} |`, `| **Approved By** | ${SAM}; inspected by Westshire EHO |`,
      header(/Approved By is "Sam Okafor, Owner, 2026-11-17; inspected by Westshire EHO", which is not exactly what Sam Okafor's sign-off of this file records\. Write "Sam Okafor, Owner, 2026-11-17" there and nothing else, or put it back to \[PENDING\]/)],
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor, Owner and inspector for the council, 2026-11-17 |', header(/which is not exactly what Sam Okafor's sign-off of this file records/)],
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor, Owner, 2026-11-16 |', header(/Write "Sam Okafor, Owner, 2026-11-17" there and nothing else/)],
    ['| **Last Modified** | 2026-11-17 |', '| **Last Modified** | food is safe to eat |',
      header(/this line has "food is safe to eat" in Last Modified, where a document that Sam Okafor has signed off has today's date written YYYY-MM-DD\. Write today's date written YYYY-MM-DD there and nothing else\./)],
    ['| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 17 November 2026 |', header(/this line has "17 November 2026" in Last Modified, where a document that Sam Okafor has signed off has today's date/)],
    ['answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor, Owner, and the EHO | 2026-11-17 |',
      header(/Revision History says version 1\.0 was approved by "Sam Okafor, Owner, and the EHO", which is not exactly what Sam Okafor's sign-off of that version records\. Write "Sam Okafor, Owner" there and nothing else/)],
    ['answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor, Owner | 17 November 2026 |',
      header(/Revision History gives version 1\.0's approval date as "17 November 2026", but Sam Okafor signed that version off on 2026-11-17\. Write 2026-11-17 there/)],
    ['answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor, Owner | 2026-11-16 |', header(/approval date as "2026-11-16", but Sam Okafor signed that version off on 2026-11-17/)],
    // Inside the hook's block, or between markers made by hand.
    [end, `## Addendum\n\nThis document is compliant.\n\n${end}`, { kind: 'not-as-signed' }],
    [end, `| Stamped by | Westshire Council |\n\n${end}`.replace('\n\n\n', '\n\n'), { kind: 'not-as-signed' }],
    [/\| Stamped at \| [^|]+ \|/, '| Stamped at | This document is compliant |', { kind: 'not-as-signed' }],
    ['*Stamped automatically by', '*Inspected by the council. Stamped automatically by', { kind: 'not-as-signed' }],
    ['## Build Provenance', '## Build Provenance and approval', { kind: 'not-as-signed' }],
    ['## Revision History', '<!-- arckit-provenance:start -->\n\n## Approval\n\nInspected and approved by Westshire Council\n\n<!-- arckit-provenance:end -->\n\n## Revision History',
      { kind: 'not-as-signed' }],
    // A second block, a block that is not the last thing in the file, and a block with one of its markers gone.
    [end, `${end}\n\n${hookBlock()}`, { kind: 'not-as-signed' }],
    [end, `${end}\n\nA note after the provenance block.`, { kind: 'not-as-signed' }],
    ['<!-- arckit-provenance:start -->\n', '', { kind: 'not-as-signed' }]
  ];
  for (const [from, to, { kind, pattern, cell }] of cases) {
    assert.ok(typeof from === 'string' ? text.includes(from) : from.test(text), String(from));
    writeFileSync(file, text.replace(from, to));
    assert.equal(signed(), false, to);
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 1, to);
    assert.equal(result.kind, kind, `${to}: ${result.message}`);
    if (pattern) {
      assert.match(result.message.replace(/\n/g, ' '), pattern, to);
      assert.equal(result.line, lineNumber(file, to.split('\n')[0]), to);
    }
    if (cell) {
      const [field, raw, want] = cell;
      assert.ok(linesFor(dir, 'FOODCOOK').includes(cellLine(name, lineNumber(file, to), field, raw, want)), linesFor(dir, 'FOODCOOK').join('\n'));
    }
  }
  writeFileSync(file, text);
  assert.equal(signed(), true);
});

test('G1: a document is not signed off while a cell the sign-off step rewrites holds something the commands do not write there; check still passes, status says which cell, and nothing is recorded', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  const name = basename(file);
  edit(file, '| **Status** | DRAFT |', '| **Status** | draft |');
  edit(file, '| **Reviewed By** | [PENDING] |', '| **Reviewed By** |  |');
  edit(file, '| **Approved By** | [PENDING] |', '| **Approved By** | Pending |');
  edit(file, '| **Last Modified** | 2026-11-16 |', '| **Last Modified** | [YYYY-MM-DD] |');
  edit(file, 'confirmed answers | [PENDING] | [PENDING] |', 'confirmed answers | pending | |');
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  const row = lineNumber(file, 'confirmed answers | pending | |');
  const lines = [
    cellLine(name, lineNumber(file, '| **Status** | draft |'), 'Status', 'draft', 'DRAFT'),
    cellLine(name, lineNumber(file, '| **Last Modified** | [YYYY-MM-DD] |'), 'Last Modified', '[YYYY-MM-DD]', 'a date as YYYY-MM-DD'),
    cellLine(name, lineNumber(file, '| **Reviewed By** |  |'), 'Reviewed By', '', '[PENDING]'),
    cellLine(name, lineNumber(file, '| **Approved By** | Pending |'), 'Approved By', 'Pending', '[PENDING]'),
    cellLine(name, row, 'Approved By in the Revision History', 'pending', '[PENDING]'),
    cellLine(name, row, 'Approval Date in the Revision History', '', '[PENDING]')
  ];
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [...lines, NOT_SIGNED]);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff], [true, false]);
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), lines);
  assert.ok(!existsSync(signOffsFile(dir)));
  assert.match(run('sign-off').stderr.replace(/\s+/g, ' '), /a cell of its header that the sign-off step rewrites holds something else/);
  // Written as the commands write it, it is signed off, and marking it changes nothing a person signed.
  templated(dir, 'FOODCOOK');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [NOT_SIGNED]);
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
});

test('G2: a header row that claims a sign-off is read however it is typed, above the body or below it; a claim in a sentence of prose is not attempted', () => {
  const nbsp = String.fromCodePoint(0xa0);
  const forms = [
    ['| **Status** | DRAFT |', '| **status** | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| **STATUS** | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| __Status__ | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| *Status* | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| ***Status*** | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| **Status:** | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| **Status**: | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| Status : | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '| **Status** | APPROVED', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '**Status** | APPROVED |', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', 'Status | APPROVED', 'Status', 'APPROVED'],
    ['| **Status** | DRAFT |', '    |  **Status**  |  APPROVED  |  ', 'Status', 'APPROVED'],
    ['| **Approved By** | [PENDING] |', '| **Approved  By** | Dana Okafor |', 'Approved By', 'Dana Okafor'],
    ['| **Approved By** | [PENDING] |', `| **Approved${nbsp}By** | Dana Okafor |`, 'Approved By', 'Dana Okafor'],
    ['| **Approved By** | [PENDING] |', '| **APPROVED BY:** | Dana Okafor', 'Approved By', 'Dana Okafor'],
    ['| **Reviewed By** | [PENDING] |', `| __reviewed${nbsp} by__ : | Dana Okafor |`, 'Reviewed By', 'Dana Okafor']
  ];
  for (const [from, to, field, value] of forms) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK');
    edit(file, from, to);
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 1, to);
    assert.equal(result.kind, 'header', to);
    assert.equal(result.line, lineNumber(file, to), to);
    assert.ok(result.message.includes(`${field} is "${value}", but no sign-off is recorded for this file`), `${to}: ${result.message}`);
    assert.equal(docStatus(dir, 'FOODCOOK').signedOff, false, to);
    assert.equal(signOff(dir, 'FOODCOOK').status, 1, to);
  }
  // A Document Control table, or a Revision History, below the body is read the same.
  for (const [added, needle, pattern] of [
    ['\n## Document Control\n\n| Field | Value |\n|-------|-------|\n| **Status** | APPROVED |\n| **Approved By** | Dana Okafor |\n', '| **Status** | APPROVED |',
      /Status is "APPROVED", but no sign-off is recorded for this file/],
    ['\n## Revision  history\n\n| Version | Date | Approved By | Approval Date |\n|---|---|---|---|\n| 1.0 | 2026-11-17 | Dana Okafor, Owner | 2026-11-17 |\n', '| 1.0 | 2026-11-17 | Dana Okafor, Owner |',
      /Revision History says version 1\.0 was approved \("Dana Okafor, Owner"\), but no sign-off is recorded for that version/]
  ]) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK');
    writeFileSync(file, `${readFileSync(file, 'utf8')}${added}`);
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 1, needle);
    assert.equal(result.line, lineNumber(file, needle), needle);
    assert.ok(result.line > lineNumber(file, '<!-- UK-FOOD:END -->'));
    assert.match(result.message, pattern);
  }
  // The stated limit: a sentence is not a row, and check does not try to read one.
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  edit(file, '## Revision History', 'Status: APPROVED by the owner.\n\n## Revision History');
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  // Nor is a row of another name, or a row inside the body.
  edit(file, '| **Status** | DRAFT |', '| **Status** | DRAFT |\n| **Review Status** | APPROVED |');
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
});

test('G5: white space at the end of a line of the body or of a marker line, or one more blank line before the END marker, is no change: the document passes check, stays in step and stays signed off', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  const text = readFileSync(file, 'utf8');
  const asSigned = () => {
    const result = check(dir, 'FOODCOOK', file);
    assert.equal(result.exit, 0, result.message);
    const cook = docStatus(dir, 'FOODCOOK');
    assert.deepEqual([cook.inSync, cook.signedOff], [true, true]);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  };
  asSigned();
  const body = (edited) => text.slice(0, text.indexOf('<!-- UK-FOOD:BEGIN')) + edited(text.slice(text.indexOf('<!-- UK-FOOD:BEGIN'),
    text.indexOf('<!-- UK-FOOD:END -->'))) + text.slice(text.indexOf('<!-- UK-FOOD:END -->'));
  for (const [what, changed] of [
    ['spaces after one line', body((inner) => swap(inner, 'Poached eggs', 'Poached eggs').replace(/\n## COOKING\n/, '\n## COOKING   \n'))],
    ['a tab after one line', body((inner) => inner.replace(/\n## COOKING\n/, '\n## COOKING\t\n'))],
    ['spaces after every line', body((inner) => inner.replace(/\n/g, ' \t \n'))],
    ['one more blank line before END', swap(text, '\n<!-- UK-FOOD:END -->', '\n\n<!-- UK-FOOD:END -->')],
    ['three more blank lines before END', swap(text, '\n<!-- UK-FOOD:END -->', '\n\n\n\n<!-- UK-FOOD:END -->')],
    ['a space after the END marker', swap(text, '<!-- UK-FOOD:END -->\n', '<!-- UK-FOOD:END --> \n')],
    ['a tab after the BEGIN marker', text.replace(/(<!-- UK-FOOD:BEGIN [^\n]*-->)\n/, '$1\t\n')],
    ['Windows line endings', text.replace(/\n/g, '\r\n')]
  ]) {
    assert.notEqual(changed, text, what);
    writeFileSync(file, changed);
    asSigned();
  }
  // What a reader can see is still a change, and so is a blank line the hash counts.
  for (const [what, changed, kind] of [
    ['a word', swap(text, 'Poached eggs', 'Boiled eggs'), 'edited'],
    ['a space inside a line', body((inner) => inner.replace(/\n## COOKING\n/, '\n##  COOKING\n')), 'edited'],
    ['a blank line after BEGIN', text.replace(/(<!-- UK-FOOD:BEGIN [^\n]*-->)\n/, '$1\n\n'), 'edited']
  ]) {
    writeFileSync(file, changed);
    const result = check(dir, 'FOODCOOK', file);
    assert.deepEqual([result.exit, result.kind], [1, kind], what);
    assert.equal(docStatus(dir, 'FOODCOOK').signedOff, false, what);
  }
  // With answers that really have changed, the lines say so, and that the new version is still to be written.
  writeFileSync(file, text.replace(/\n## COOKING\n/, '\n## COOKING  \n'));
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  assert.equal(check(dir, 'FOODCOOK', file).kind, 'stale');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [staleLine(basename(file)), answersChangedLine('Sam Okafor', '2026-11-17')]);
  assert.equal(answersChangedLine('Sam Okafor', '2026-11-17'), 'signed off by Sam Okafor on 2026-11-17, but its answers have changed since: ' +
    'writing the document again makes a new version, which then needs signing off');
  assert.ok(status(dir).unfinished.every(({ what }) => !what.includes('the new version needs signing off')));
});

test('G6: after a second person signs the same file, the header shows the newest sign-off: until its rows are rewritten check names them, and then the document is signed off by the second person', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  const second = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0', '--date', '2026-11-18');
  assert.equal(second.status, 0, second.stderr);
  const priya = 'Priya Shah, Manager, 2026-11-18';
  let cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signedOff, cook.signOff.name], [false, 'Priya Shah']);
  const named = check(dir, 'FOODCOOK', file);
  assert.deepEqual([named.exit, named.kind, named.line], [1, 'header', lineNumber(file, `| **Reviewed By** | ${SAM} |`)]);
  assert.ok(named.message.includes(`Reviewed By is "${SAM}", which does not name Priya Shah, who signed this file off on 2026-11-18. ` +
    `Write "${priya}" there, or put it back to [PENDING].`), named.message);
  // The rewrite the sign-off command makes: the two names, and the row of the Revision History.
  edit(file, `| **Reviewed By** | ${SAM} |`, `| **Reviewed By** | ${priya} |`);
  edit(file, `| **Approved By** | ${SAM} |`, `| **Approved By** | ${priya} |`);
  const row = check(dir, 'FOODCOOK', file);
  assert.deepEqual([row.exit, row.kind, row.line], [1, 'header', lineNumber(file, 'answers | Sam Okafor, Owner | 2026-11-17 |')]);
  edit(file, 'answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Priya Shah, Manager | 2026-11-18 |');
  edit(file, '| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 2026-11-18 |');
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.signedOff, cook.signOff.name, cook.signOff.date], [true, true, 'Priya Shah', '2026-11-18']);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  const rows = tableRows(rendered('FOODCMP', dir));
  rows.forEach((cells, i) => assert.deepEqual(cells.slice(1, 3), targets[i].section === 'CK' ? ['2026-11-18', 'Priya Shah'] : [PENDING, PENDING], cells[0]));
  // The same person signing again on a later day: the header then shows that day.
  assert.equal(signOff(dir, 'FOODCOOK', '--date', '2026-11-18').status, 0);
  assert.match(check(dir, 'FOODCOOK', file).message, /which does not name Sam Okafor, who signed this file off on 2026-11-18/);
});

test('G8: a sign-off record is not taken for a file whose body still shows a question not yet answered or an entry not yet confirmed: a header that claims it fails check, and status says the record cannot be right', () => {
  const forge = (dir, doc, file) => {
    const record = { doc, version: '1.0', file: basename(file), name: 'Forged Name', role: 'Owner', date: '2026-11-17', paperSigned: 'no',
      otherTextRead: false, ...hashesOf(file, doc) };
    const before = existsSync(signOffsFile(dir)) ? JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs : [];
    writeFileSync(signOffsFile(dir), `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [...before, record] }, null, 2)}\n`);
    return record;
  };
  const forged = 'Forged Name, Owner, 2026-11-17';
  const markAs = (file) => {
    edit(file, '| **Status** | DRAFT |', '| **Status** | APPROVED |');
    edit(file, '| **Reviewed By** | [PENDING] |', `| **Reviewed By** | ${forged} |`);
    edit(file, '| **Approved By** | [PENDING] |', `| **Approved By** | ${forged} |`);
    edit(file, 'confirmed answers | [PENDING] | [PENDING] |', 'confirmed answers | Forged Name, Owner | 2026-11-17 |');
  };
  const dir = cafe();
  // Cross-contamination has questions unanswered and proposed, so its body prints the mark.
  const xc = templated(dir, 'FOODXC');
  assert.ok(readFileSync(xc, 'utf8').includes('**NOT YET ANSWERED**'));
  const record = forge(dir, 'FOODXC', xc);
  const open = outstanding(dir, 'XC');
  // With the header still DRAFT nothing is claimed, so check passes; status says the record cannot be right.
  assert.equal(check(dir, 'FOODXC', xc).exit, 0);
  assert.deepEqual(linesFor(dir, 'FOODXC'), [unansweredLine('XC', open.unanswered), proposedLine('XC', open.proposed), unsoundLine('Forged Name', '2026-11-17')]);
  markAs(xc);
  assert.deepEqual(hashesOf(xc, 'FOODXC'), { body: record.body, outside: record.outside }, 'the record names this file as it now reads');
  const result = check(dir, 'FOODXC', xc);
  assert.deepEqual([result.exit, result.kind, result.line], [1, 'header', lineNumber(xc, '| **Status** | APPROVED |')]);
  assert.match(result.message, /Status is "APPROVED", but the document still shows a question not yet answered or an entry not yet confirmed, and one that does is never signed off\. Put Status back to DRAFT and Reviewed By and Approved By back to \[PENDING\]/);
  assert.equal(run('check', '--doc', 'FOODXC', '--project', dir, '--report', xc).status, 1);
  const doc = docStatus(dir, 'FOODXC');
  assert.deepEqual([doc.inSync, doc.signedOff, doc.signOff.name], [false, false, 'Forged Name']);
  assert.deepEqual(linesFor(dir, 'FOODXC'), [unansweredLine('XC', open.unanswered), proposedLine('XC', open.proposed),
    `document ${basename(xc)} ${result.reason}`, unsoundLine('Forged Name', '2026-11-17')]);
  assert.match(result.reason, /^says in its header, at line \d+, that Status is "APPROVED", though it still shows a question not yet answered or an entry not yet confirmed, and a document that does is never signed off: put Status back to DRAFT/);
  // A Revision History row for this version is a claim of the same kind.
  edit(xc, '| **Status** | APPROVED |', '| **Status** | DRAFT |');
  edit(xc, `| **Reviewed By** | ${forged} |`, '| **Reviewed By** | [PENDING] |');
  edit(xc, `| **Approved By** | ${forged} |`, '| **Approved By** | [PENDING] |');
  const history = check(dir, 'FOODXC', xc);
  assert.deepEqual([history.exit, history.kind, history.line], [1, 'header', lineNumber(xc, 'confirmed answers | Forged Name, Owner |')]);
  assert.match(history.message, /Revision History says version 1\.0 was approved \("Forged Name, Owner"\), but the document still shows a question not yet answered/);
  assert.ok(tableRows(rendered('FOODCMP', dir)).every((row) => row[1] === PENDING && row[2] === PENDING));

  // The own methods document with an entry not yet confirmed prints its own mark.
  const own = cafe();
  setSheet(own, 'own', `${sheet(own, 'own')}\n${specialEntry('OWN-03', 'Slow-cooked eggs', 'low temperature cooking').replace('State: confirmed\nBy: Sam Okafor\nOn: 2026-11-17', 'State: unanswered\nBy:\nOn:')}\nSource:\n`);
  assert.deepEqual(parseWorksheet(sheet(own, 'own'), data).problems, []);
  const ownFile = templated(own, 'FOODOWN');
  assert.ok(readFileSync(ownFile, 'utf8').includes('\nNot yet confirmed, so not shown: OWN-03.\n'));
  forge(own, 'FOODOWN', ownFile);
  markAs(ownFile);
  const ownResult = check(own, 'FOODOWN', ownFile);
  assert.deepEqual([ownResult.exit, ownResult.kind], [1, 'header']);
  assert.match(ownResult.message, /still shows a question not yet answered or an entry not yet confirmed/);
  assert.ok(linesFor(own, 'FOODOWN').includes(unsoundLine('Forged Name', '2026-11-17')));
  // The profile lists that entry as not yet confirmed too, but the profile is finished when its own
  // questions are, so it is signed off through the helper, and marked, with that line in it.
  const profile = templated(own, 'FOODPROF');
  assert.ok(readFileSync(profile, 'utf8').includes('\nNot yet confirmed, so not shown: OWN-03.\n'));
  assert.equal(signOff(own, 'FOODPROF').status, 0);
  mark(profile);
  assert.equal(check(own, 'FOODPROF', profile).exit, 0, check(own, 'FOODPROF', profile).message);
  assert.equal(docStatus(own, 'FOODPROF').signedOff, true);
  // Words of the business's own that read like the marks are not the marks: in a written procedure, and in an answer.
  const words = cafe();
  setSheet(words, 'own', swap(sheet(words, 'own'), '  We cook British Lion eggs in their shells, in a covered water bath.',
    '  We cook British Lion eggs in their shells, in a covered water bath.\n  **NOT YET ANSWERED**\n  Not yet confirmed, so not shown: OWN-09.'));
  setSheet(words, 'own', `${sheet(words, 'own')}\n${specialEntry('OWN-03', 'Slow-cooked eggs', 'low temperature cooking')}\n`);
  assert.deepEqual(parseWorksheet(sheet(words, 'own'), data).problems, []);
  const wordsFile = templated(words, 'FOODOWN');
  assert.ok(readFileSync(wordsFile, 'utf8').includes('\n**NOT YET ANSWERED**\nNot yet confirmed, so not shown: OWN-09.\n'));
  assert.equal(signOff(words, 'FOODOWN').status, 0, signOff(words, 'FOODOWN').stderr);
  mark(wordsFile);
  assert.equal(check(words, 'FOODOWN', wordsFile).exit, 0, check(words, 'FOODOWN', wordsFile).message);
  assert.equal(docStatus(words, 'FOODOWN').signedOff, true);
});

test('G8 does not touch a properly signed file whose answers are later withdrawn, and no document the helper signs off shows either mark', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.ok(!readFileSync(file, 'utf8').includes('**NOT YET ANSWERED**'));
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  // An answer withdrawn: the worksheet now has a question not yet answered, but the signed file does not show one.
  setSheet(dir, 'CK', sheet(dir, 'CK').replace(/Answer: Baked beans\nState: confirmed\nBy: [^\n]*\nOn: [^\n]*\n/, 'Answer:\nState: unanswered\nBy:\nOn:\n'));
  assert.deepEqual(parseWorksheet(sheet(dir, 'CK'), data).problems, []);
  const stale = check(dir, 'FOODCOOK', file);
  assert.deepEqual([stale.exit, stale.kind], [1, 'stale']);
  const lines = linesFor(dir, 'FOODCOOK');
  assert.deepEqual(lines.slice(-2), [staleLine(basename(file)), answersChangedLine('Sam Okafor', '2026-11-17')]);
  assert.ok(lines.every((line) => !line.includes('cannot be right')));
  // Written again in place over the signed file, against the commands' rule: the record is for another body.
  templated(dir, 'FOODCOOK');
  assert.ok(readFileSync(file, 'utf8').includes('**NOT YET ANSWERED**'));
  assert.deepEqual(linesFor(dir, 'FOODCOOK').slice(-1), [changedLine('Sam Okafor', '2026-11-17')]);
  // Everything finished, as in the test above: none of the seven bodies shows a mark, so each sign-off is taken.
  const done = cafe();
  for (const section of SECTION_IDS) {
    const methods = new Map(data.sections.get(section).methods.map((m) => [m.id, { status: 'not-relevant', reason: `No need of ${m.id}.`, decidedBy: 'Sam Okafor' }]));
    setSheet(done, section, emitWorksheet({ data: DATA_ID, section, methods, answers: new Map(), entries: new Map(), problems: [] }, data));
  }
  setSheet(done, 'profile', sheet(done, 'profile').replace(/(### PR-Q1[23]\n\n[^\n]*\nAnswer: )yes/g, '$1no'));
  setSheet(done, 'own', blankWorksheet('own', data));
  setSheet(done, 'allergens', ALLERGENS_KEPT());
  setSheet(done, 'cleaning', KEPT_ELSEWHERE());
  for (const doc of STATUS_ORDER) {
    const written = templated(done, doc);
    assert.ok(!/\*\*NOT YET ANSWERED\*\*|\nNot yet confirmed, so not shown: /.test(readFileSync(written, 'utf8')), doc);
    assert.equal(signOff(done, doc).status, 0, doc);
    mark(written);
    assert.equal(check(done, doc, written).exit, 0, doc);
  }
  // The record sheets are written too, in a DRAFT header: nobody signs them, but until they are written the business has
  // no diary pages.
  templated(done, 'FOODREC');
  assert.ok(status(done).documents.every((d) => d.signedOff));
  assert.deepEqual(status(done).unfinished, []);
});

test('G1: a signer whose name holds marks of its own is shown exactly as recorded, and that is taken', () => {
  for (const name of ['_Sam_ Okafor*', '`Sam` | Okafor', '[Sam] Okafor']) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK');
    assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', name, '--role', 'Owner', '--version', '1.0', '--date', '2026-11-17').status, 0);
    // A pipe in a table cell is written with a backslash before it, and read as the pipe.
    const typed = name.replace('|', '\\|');
    edit(file, '| **Status** | DRAFT |', '| **Status** | APPROVED |');
    edit(file, '| **Reviewed By** | [PENDING] |', `| **Reviewed By** | ${typed}, Owner, 2026-11-17 |`);
    edit(file, '| **Approved By** | [PENDING] |', `| **Approved By** | ${typed}, Owner, 2026-11-17 |`);
    edit(file, 'confirmed answers | [PENDING] | [PENDING] |', `confirmed answers | ${typed}, Owner | 2026-11-17 |`);
    assert.equal(check(dir, 'FOODCOOK', file).exit, 0, `${name}: ${check(dir, 'FOODCOOK', file).message}`);
    assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true, name);
  }
});

// ---- Round H: the printed body alone (H7) and text outside the checked part (H5) ----

// The line for a signed file changed outside its markers whose header still says it is signed off.
const lapsedOutsideLine = (file, line, name, date) => `document ${file} says in its header, at line ${line}, that it is signed off, but the ` +
  `file was changed outside its UK-FOOD markers after ${name} signed it off on ${date}: take that change out again, or have a named ` +
  'person sign the document off again as it now reads';
const otherTextReason = (file, n) => `document ${file} holds ${n} ${n === 1 ? 'line' : 'lines'} outside its checked part that ${n === 1 ? 'is' : 'are'} ` +
  'not part of its ordinary frame, and a sign-off covers the whole file: show them to the person signing, and give --other-text-read yes ' +
  'once that person has read them and says they are theirs';

test('H7: status says whether a document\'s printed body equals a fresh print, whatever is wrong outside its markers', () => {
  const state = (dir) => { const doc = docStatus(dir, 'FOODCOOK'); return [doc.inSync, doc.bodyInStep]; };
  const fresh = () => { const dir = cafe(); return [dir, templated(dir, 'FOODCOOK')]; };
  // No document yet, then one as written.
  const [dir, file] = fresh();
  assert.equal(docStatus(dir, 'FOODXC').bodyInStep, null);
  assert.deepEqual(state(dir), [true, true]);
  const text = readFileSync(file, 'utf8');
  // Faults outside the markers: the body is still what a fresh print gives.
  for (const [what, from, to] of [
    ['a header that claims a sign-off nobody recorded', '| **Status** | DRAFT |', '| **Status** | APPROVED |'],
    ['a pack heading outside the markers', '## Revision History', '## COOKING\n\n## Revision History']
  ]) {
    writeFileSync(file, swap(text, from, to));
    assert.deepEqual(state(dir), [false, true], what);
  }
  // Faults in the body, or no body to read.
  for (const [what, changed] of [
    ['a word changed by hand', swap(text, 'Poached eggs', 'Boiled eggs')],
    ['the END marker gone', swap(text, '<!-- UK-FOOD:END -->', '')]
  ]) {
    writeFileSync(file, changed);
    assert.deepEqual(state(dir), [false, false], what);
  }
  writeFileSync(file, text);
  setSheet(dir, 'CK', swap(sheet(dir, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  assert.deepEqual(state(dir), [false, false], 'an answer changed');
  // A worksheet that cannot be read: no fresh print, so it cannot be said either way.
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a stray line\n`);
  assert.deepEqual(state(dir), [false, null]);
  // A signed file: a second sign-off whose header is not rewritten yet, a cell typed inexactly, and
  // text added outside the markers are all faults outside the body.
  const [signedDir, signed] = fresh();
  assert.equal(signOff(signedDir, 'FOODCOOK').status, 0);
  mark(signed);
  const marked = readFileSync(signed, 'utf8');
  assert.deepEqual([...state(signedDir), docStatus(signedDir, 'FOODCOOK').signedOff], [true, true, true]);
  writeFileSync(signed, swap(marked, `| **Approved By** | ${SAM} |`, `| **Approved By** | ${SAM} and the manager |`));
  assert.deepEqual([...state(signedDir), check(signedDir, 'FOODCOOK', signed).kind], [false, true, 'header']);
  writeFileSync(signed, `${marked}\nA note nobody signed.\n`);
  assert.deepEqual([...state(signedDir), check(signedDir, 'FOODCOOK', signed).kind], [false, true, 'not-as-signed']);
  writeFileSync(signed, marked);
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', signedDir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0', '--date', '2026-11-18').status, 0);
  assert.deepEqual([...state(signedDir), check(signedDir, 'FOODCOOK', signed).kind], [false, true, 'header']);
  // check --json carries the same fact.
  const json = JSON.parse(run('check', '--doc', 'FOODCOOK', '--project', signedDir, '--report', signed, '--json').stdout);
  assert.deepEqual([json.ok, json.bodyInStep], [false, true]);
});

test('H7: a signed file changed outside its markers is put right by taking the change out or by signing again, never by a new version', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  const marked = readFileSync(file, 'utf8');
  writeFileSync(file, swap(marked, '## Revision History', '## A note of ours\n\nWe close on Mondays.\n\n## Revision History'));
  const result = check(dir, 'FOODCOOK', file);
  assert.deepEqual([result.exit, result.kind, result.bodyInStep], [1, 'not-as-signed', true]);
  assert.match(result.message, /but the file was changed outside its UK-FOOD markers after Sam Okafor signed it off on 2026-11-17, so that sign-off no longer covers it\. Take that change out again, or have a named person sign the document off again as it now reads\./);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [lapsedOutsideLine(basename(file), lineNumber(file, '| **Status** | APPROVED |'), 'Sam Okafor', '2026-11-17')]);
  assert.ok(status(dir).unfinished.every(({ what }) => !what.includes('new version')));
  // Signing again is not refused for that fault; it is refused until the added text has been shown.
  const unread = signOffUnread(dir, 'FOODCOOK');
  assert.equal(unread.status, 1);
  assert.deepEqual(reasons(unread.stderr), [otherTextReason(basename(file), 2)]);
  assert.equal(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.length, 1);
  assert.equal(signOff(dir, 'FOODCOOK', '--other-text-read', 'yes').status, 0);
  // Signed by the same person on the same day, the header already shows the newest sign-off.
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.bodyInStep, cook.signedOff], [true, true, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  // A signed file written over in place with other answers: its line also says to sign again, and that works.
  const over = cafe();
  const again = templated(over, 'FOODCOOK');
  assert.equal(signOff(over, 'FOODCOOK').status, 0);
  mark(again);
  setSheet(over, 'CK', swap(sheet(over, 'CK'), 'Answer: Baked beans', 'Answer: Baked beans and soup'));
  const body = rendered('FOODCOOK', over);
  const before = readFileSync(again, 'utf8');
  writeFileSync(again, before.slice(0, before.indexOf('<!-- UK-FOOD:BEGIN')) + body + before.slice(before.indexOf('<!-- UK-FOOD:END -->') + '<!-- UK-FOOD:END -->'.length));
  const written = check(over, 'FOODCOOK', again);
  assert.deepEqual([written.exit, written.kind, written.bodyInStep], [1, 'not-as-signed', true]);
  assert.match(written.message, /has been written again since Sam Okafor signed it off on 2026-11-17, so that sign-off does not cover what it says now\. Have a named person sign it off again\./);
  assert.equal(signOffUnread(over, 'FOODCOOK').status, 0);
  assert.equal(docStatus(over, 'FOODCOOK').signedOff, true);
});

test('H5: a document written from its template holds no text outside its checked part, whichever regime\'s header it has, with or without the hook\'s block', () => {
  for (const regime of REGIMES) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK', { regime });
    assert.deepEqual(check(dir, 'FOODCOOK', file).otherText, [], regime);
    assert.deepEqual(docStatus(dir, 'FOODCOOK').otherText, [], regime);
    writeFileSync(file, `${readFileSync(file, 'utf8')}\n${hookBlock()}\n`);
    assert.deepEqual(check(dir, 'FOODCOOK', file).otherText, [], regime);
    assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0, regime);
    mark(file);
    assert.deepEqual(docStatus(dir, 'FOODCOOK').otherText, [], regime);
  }
  // Every document, the completion record among them; and one not written has none.
  const dir = cafe();
  assert.deepEqual(docStatus(dir, 'FOODCOOK').otherText, []);
  for (const doc of [...STATUS_ORDER, 'FOODCMP']) assert.deepEqual(check(dir, doc, templated(dir, doc)).otherText, [], doc);
});

test('H5: text outside the markers that is not the document\'s frame is listed with its line numbers; sign-off refuses the document until the person signing has been shown it', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  const plain = readFileSync(file, 'utf8');
  const name = basename(file);
  const listed = (text) => { writeFileSync(file, text); return check(dir, 'FOODCOOK', file).otherText.map((entry) => entry.text); };
  // What counts as other text, each added to a document that has none.
  for (const [what, changed, expected] of [
    ['a section of the business\'s own', swap(plain, '## Revision History', '## Summary\n\nWe always cook to a figure nobody checked.\n\n## Revision History'),
      ['## Summary', 'We always cook to a figure nobody checked.']],
    ['a line after the footer', `${plain}\nSee the notice by the till.\n`, ['See the notice by the till.']],
    ['a second title', swap(plain, '## Document Control', '# Another title\n\n## Document Control'), ['# Another title']],
    ['a second template line', swap(plain, '## Document Control', '> **Template Origin**: Somewhere else | **ArcKit Version**: 1 | **Command**: `/x`\n\n## Document Control'),
      ['> **Template Origin**: Somewhere else | **ArcKit Version**: 1 | **Command**: `/x`']],
    ['a quotation', swap(plain, '## Document Control', '> Checked by the owner.\n\n## Document Control'), ['> Checked by the owner.']],
    ['a table of its own', swap(plain, '\n---\n', '\n| Day | Who |\n| --- | --- |\n| Monday | Sam |\n\n---\n'), ['| Day | Who |', '| --- | --- |', '| Monday | Sam |']],
    ['a second footer line of a name the footer has', swap(plain, '**Model**: [AI_MODEL]', '**Model**: [AI_MODEL]\n**Project**: Another project'), ['**Project**: Another project']],
    ['a labelled line the footer does not have', swap(plain, '**Model**: [AI_MODEL]', '**Model**: [AI_MODEL]\n**Checked by**: the council'), ['**Checked by**: the council']],
    ['words after a comment on its line', swap(plain, '## Revision History', '<!-- a remark --> Words a reader sees.\n\n## Revision History'), ['<!-- a remark --> Words a reader sees.']],
    ['words between provenance markers made by hand', swap(plain, '## Revision History', '<!-- arckit-provenance:start -->\n\nSeen by the council.\n\n<!-- arckit-provenance:end -->\n\n## Revision History'),
      ['Seen by the council.']],
    ['a heading that only starts like the frame\'s', swap(plain, '## Revision History', '## Document Control notes\n\n## Revision History'), ['## Document Control notes']]
  ]) {
    assert.deepEqual(listed(changed), expected, what);
  }
  // What is frame, and so is not listed: rules and blank lines. A comment that is not one of a template's is listed (J4).
  assert.deepEqual(listed(swap(plain, '## Revision History', '***\n\n___\n\n\n## Revision History')), []);
  assert.deepEqual(listed(swap(plain, '## Revision History', '<!-- a remark -->\n\n<!--\nA remark over\nseveral lines.\n-->\n\n***\n\n___\n\n## Revision History')),
    ['<!-- a remark -->', '<!--', 'A remark over', 'several lines.', '-->']);
  // Listed with line numbers, in check --json and status --json, and said in the readable status.
  const noted = swap(plain, '## Revision History', '## Summary\n\nWe always cook to a figure nobody checked.\n\n## Revision History');
  writeFileSync(file, noted);
  const other = [{ line: lineNumber(file, '## Summary'), text: '## Summary' },
    { line: lineNumber(file, 'We always cook'), text: 'We always cook to a figure nobody checked.' }];
  const result = check(dir, 'FOODCOOK', file);
  assert.deepEqual([result.exit, result.otherText], [0, other]);
  assert.deepEqual(JSON.parse(run('check', '--doc', 'FOODCOOK', '--project', dir, '--report', file, '--json').stdout).otherText, other);
  assert.deepEqual(docStatus(dir, 'FOODCOOK').otherText, other);
  assert.deepEqual(JSON.parse(run('status', '--project', dir, '--json').stdout).documents.find((d) => d.code === 'FOODCOOK').otherText, other);
  assert.ok(run('status', '--project', dir).stdout.includes('ARC-001-FOODCOOK-v1.0.md in step with its worksheets; 2 lines outside its checked part; not signed off'));
  // It does not make the document unfinished, and check passes: the person signing is the check.
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.inSync, cook.bodyInStep], [true, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [NOT_SIGNED]);
  // sign-off refuses, listing the lines, and writes nothing.
  for (const extra of [[], ['--other-text-read', 'no']]) {
    const refused = signOffUnread(dir, 'FOODCOOK', ...extra);
    assert.equal(refused.status, 1);
    assert.equal(refused.stdout, '');
    assert.deepEqual(reasons(refused.stderr), [otherTextReason(name, 2)]);
    assert.ok(refused.stderr.includes(`\n  line ${other[0].line}: ## Summary\n  line ${other[1].line}: We always cook to a figure nobody checked.\n`), refused.stderr);
    assert.ok(!existsSync(signOffsFile(dir)));
  }
  const wrong = signOff(dir, 'FOODCOOK', '--other-text-read', 'maybe');
  assert.equal(wrong.status, 2);
  assert.match(wrong.stderr, /--other-text-read is yes, when the person signing has read the lines outside the document's checked part, or no/);
  assert.ok(!existsSync(signOffsFile(dir)));
  assert.match(run('sign-off').stderr.replace(/\s+/g, ' '), /it holds text outside its checked part and --other-text-read yes is not given/);
  // Once shown, it is signed off like any other, and marking it keeps it so.
  const taken = signOff(dir, 'FOODCOOK', '--other-text-read', 'yes');
  assert.equal(taken.status, 0, taken.stderr);
  mark(file);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0, check(dir, 'FOODCOOK', file).message);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  assert.equal(docStatus(dir, 'FOODCOOK').otherText.length, 2);
  // With other reasons too, each is given, the text among them.
  const xc = templated(dir, 'FOODXC');
  writeFileSync(xc, `${readFileSync(xc, 'utf8')}\nA note.\n`);
  const both = signOffUnread(dir, 'FOODXC');
  assert.equal(both.status, 1);
  assert.equal(reasons(both.stderr).length, 3);
  assert.equal(reasons(both.stderr).at(-1), otherTextReason(basename(xc), 1));
  // A document with none takes the option either way.
  const clean = cafe();
  templated(clean, 'FOODCOOK');
  assert.equal(signOff(clean, 'FOODCOOK', '--other-text-read', 'no').status, 0);
});

test('H3: status and the sign-off refusal give one line for a worksheet made by a different version, which names upgrade-worksheet and the worksheet\'s path', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  const lines = sheet(dir, 'CK').split('\n');
  lines[lines.indexOf('<!--') + 1] += ' (as an older version said it)';
  const prompt = lines.findIndex((line) => line.startsWith('> ') && line.endsWith('(yes / no)'));
  lines[prompt] = lines[prompt].replace('(yes / no)', '[yes or no]');
  setSheet(dir, 'CK', lines.join('\n'));
  const line = 'worksheet food-safety/answers-CK.md was made by a different version of the overlay (2 lines of its guidance or question ' +
    'wording are not what this version prints), so none of its answers counts until it is brought up to date: upgrade-worksheet --file ' +
    'food-safety/answers-CK.md shows each line it would take out or put in, and with --write does so and keeps a copy. Anything a person ' +
    'typed on a line it takes out cannot be told from old wording, so a person reads what it shows first';
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [line, NOT_SIGNED]);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.problems, cook.confirmed, cook.inSync, cook.bodyInStep], [1, 0, false, null]);
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [line]);
  assert.ok(run('status', '--project', dir).stdout.includes(`- FOODCOOK: ${line}\n`));
  // With another problem as well, the count is given and parse-worksheet lists both.
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a stray line\n`);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [problemsLine('CK', 2), NOT_SIGNED]);
  // Brought up to date, the worksheet counts again and the document is in step as before.
  setSheet(dir, 'CK', lines.join('\n'));
  assert.equal(run('upgrade-worksheet', '--file', sheetFile(dir, 'CK'), '--write').status, 0);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [NOT_SIGNED]);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').inSync, docStatus(dir, 'FOODCOOK').bodyInStep], [true, true]);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
});

// ---- The project folder a business gets (H1, H2) ----

const CREATE_PROJECT = resolve('plugins/arckit-uk-food/scripts/bash/create-project.sh');
// A project made by the shared script, as the commands run it, in a folder that holds nothing but projects/.
const newProject = (name = 'Bramble Cafe') => {
  const root = mkdtempSync(join(tmpdir(), 'uk-food-new-'));
  mkdirSync(join(root, 'projects'));
  const made = spawnSync('bash', [CREATE_PROJECT, '--json', '--force', '--name', name], { cwd: root, encoding: 'utf8' });
  assert.equal(made.status, 0, made.stderr);
  return realpathSync(JSON.parse(made.stdout).project_dir);
};
const listing = (dir, under = '') => readdirSync(join(dir, under), { withFileTypes: true }).flatMap((entry) =>
  (entry.isDirectory() ? [`${under}${entry.name}/`, ...listing(dir, `${under}${entry.name}/`)] : [`${under}${entry.name}`])).sort();
const setUp = (dir) => spawnSync('node', [resolve(helper), 'set-up-folder', '--project', dir], { encoding: 'utf8' });
const PRIVATE = 'This folder holds the names of the people who work in the business. Keep it somewhere private, and if it is a git ' +
  'repository that is pushed anywhere, keep that private too.';

test('H1: a project folder the shared script has just made becomes the business\'s own: an explanation written for it, a place for its own documents, and no architecture work', () => {
  const dir = newProject();
  // What the script leaves: an architecture README, a note about external documents, and seven empty folders more.
  assert.deepEqual(listing(dir), ['README.md', 'data-contracts/', 'decisions/', 'diagrams/', 'external/', 'external/README.md', 'final/',
    'reviews/', 'vendors/', 'wardley-maps/']);
  assert.match(readFileSync(join(dir, 'README.md'), 'utf8'), /\/arckit:stakeholders/);
  const done = setUp(dir);
  assert.equal(done.status, 0, done.stderr);
  assert.deepEqual(listing(dir), ['README.md', 'external/', 'external/README.md']);
  const readme = readFileSync(join(dir, 'README.md'), 'utf8');
  assert.ok(readme.startsWith('# Bramble Cafe: food safety records\n\n'), readme.slice(0, 80));
  // What the folder is, where things are, what to run next, and that it is kept private.
  for (const needed of ['This folder holds the food safety records of Bramble Cafe.', '`food-safety/`', '`ARC-001-FOOD', '`external/`',
    '1. `uk-food-profile`', '2. `uk-food-safe-methods`', '3. `uk-food-own-methods`', '4. `uk-food-allergens`', '5. `uk-food-cleaning-schedule`',
    '6. `uk-food-suppliers`', '7. `uk-food-record-sheets`', '8. `uk-food-check`', '9. `uk-food-sign-off`',
    'There is one too for each of three lists: your allergen information, your cleaning schedule, and your suppliers and contacts.',
    '`/arckit-uk-food:uk-food-profile`', PRIVATE, 'They are not legal advice.',
    'The Food Standards Agency has not reviewed or endorsed the overlay or anything made with it.']) {
    assert.ok(readme.includes(needed), needed);
  }
  // Nothing of ArcKit's architecture work, in either file.
  const note = readFileSync(join(dir, 'external', 'README.md'), 'utf8');
  for (const text of [readme, note]) {
    assert.doesNotMatch(text, /stakeholders|requirements|Wardley|GDPR|architecture|vendor|RFP|\/arckit:|000-global|Statement of Work|traceability/i);
    assert.doesNotMatch(text, /\b(compliant|approved|inspected)\b/i);
  }
  assert.ok(note.startsWith('# Documents of your own\n\n'));
  assert.match(note, /a written procedure for a special process/);
  assert.match(note, /keep them as private as the rest of this folder/);
  assert.match(done.stdout, /README\.md/);
  assert.match(done.stdout, /data-contracts, decisions, diagrams, final, reviews, vendors and wardley-maps/);
  // Run again, there is nothing to do, and nothing changes. A name with marks in it is kept as the script wrote it.
  const before = readFileSync(join(dir, 'README.md'), 'utf8');
  const again = setUp(dir);
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /is already set up: nothing has been changed/);
  assert.equal(readFileSync(join(dir, 'README.md'), 'utf8'), before);
  const other = newProject('The Old Mill Tea-Room 2');
  assert.equal(setUp(other).status, 0);
  assert.ok(readFileSync(join(other, 'README.md'), 'utf8').startsWith('# The Old Mill Tea-Room 2: food safety records\n'));
  assert.ok(readFileSync(join(other, 'README.md'), 'utf8').includes('`ARC-001-FOOD'));
  // The folder is one status and the commands can then use as any other.
  assert.equal(run('status', '--project', dir).status, 0);
});

test('H1: set-up-folder changes nothing in a project that already existed: one with a file of its own, a README someone has changed, or work already in it', () => {
  const untouched = (dir, pattern) => {
    const before = listing(dir).map((name) => (name.endsWith('/') ? name : `${name}:${readFileSync(join(dir, name), 'utf8')}`));
    const result = setUp(dir);
    assert.equal(result.status, 1, result.stdout);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, pattern);
    assert.match(result.stderr, /Nothing in it has been changed/);
    assert.deepEqual(listing(dir).map((name) => (name.endsWith('/') ? name : `${name}:${readFileSync(join(dir, name), 'utf8')}`)), before);
  };
  // A README someone has written in.
  let dir = newProject();
  writeFileSync(join(dir, 'README.md'), readFileSync(join(dir, 'README.md'), 'utf8').replace('[Project description to be added]', 'Our payments platform.'));
  untouched(dir, /holds a README\.md that is not the one a new project is given/);
  // A document already in the project, in the folder or in one of its subfolders.
  dir = newProject();
  writeFileSync(join(dir, 'ARC-001-REQ-v1.0.md'), '# Requirements\n');
  untouched(dir, /holds ARC-001-REQ-v1\.0\.md, which a new project does not/);
  dir = newProject();
  writeFileSync(join(dir, 'decisions', 'ARC-001-ADR-001-v1.0.md'), '# A decision\n');
  untouched(dir, /holds a folder, decisions, that is not empty/);
  dir = newProject();
  writeFileSync(join(dir, 'external', 'our-procedure.md'), 'Our procedure.\n');
  untouched(dir, /holds, in external, our-procedure\.md, which a new project does not/);
  // A food safety project already under way: the cafe's worksheets, with whatever README it has.
  dir = cafe();
  untouched(dir, /has no README\.md/);
  writeFileSync(join(dir, 'README.md'), '# Bramble Cafe\n\nOur own notes.\n');
  untouched(dir, /holds a README\.md that is not the one a new project is given/);
  // Usage and input errors.
  assert.equal(run('set-up-folder').status, 2);
  assert.equal(run('set-up-folder', '--project', join(tmpdir(), 'no-such-project-folder')).status, 2);
  assert.match(run('set-up-folder').stderr.replace(/\s+/g, ' '), /set-up-folder --project DIR/);
});

// ---- What a signer is shown, and what the record keeps of it (J4, J5) ----

const TEMPLATES = 'plugins/arckit-uk-food/templates';
// The template each document is written from, as the commands name them.
const templateOf = (doc) => readFileSync(join(TEMPLATES, `uk-food-${doc === 'FOODPROF' ? 'profile' : doc === 'FOODOWN' ? 'own-methods'
  : doc === 'FOODCMP' ? 'check' : doc === 'FOODREC' ? 'record-sheets' : 'safe-methods'}-template.md`), 'utf8');
const fromItsTemplate = (dir, doc, regime = 'uk') => templated(dir, doc, { regime, template: templateOf(doc) });
const otherOf = (dir, doc, file) => check(dir, doc, file).otherText.map((entry) => entry.text);
const records = (dir) => JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs;

test('J4: each document, the record sheets among them, written from its own template with a header from each regime\'s partial, lists no other text, with or without the hook\'s block', () => {
  const dir = cafe();
  for (const doc of [...STATUS_ORDER, 'FOODREC', 'FOODCMP']) {
    for (const regime of REGIMES) {
      const file = fromItsTemplate(dir, doc, regime);
      assert.deepEqual(otherOf(dir, doc, file), [], `${doc} ${regime}`);
      writeFileSync(file, `${readFileSync(file, 'utf8')}\n${hookBlock()}\n`);
      assert.deepEqual(otherOf(dir, doc, file), [], `${doc} ${regime}, stamped`);
      rmSync(file);
    }
  }
  // The comments a template carries are its own, wherever a command has left one standing.
  const comments = new Set(readdirSync(TEMPLATES).filter((name) => name.endsWith('.md')).flatMap((name) =>
    readFileSync(join(TEMPLATES, name), 'utf8').split('\n').filter((line) => line.startsWith('<!--'))));
  assert.ok(comments.size >= 5, [...comments].join('\n'));
  const file = fromItsTemplate(dir, 'FOODCOOK');
  writeFileSync(file, swap(readFileSync(file, 'utf8'), '## Revision History', `${[...comments].join('\n\n')}\n\n## Revision History`));
  assert.deepEqual(otherOf(dir, 'FOODCOOK', file), []);
  // The fields a Document Control table may hold are exactly those of the regime partials.
  const fields = new Set(REGIMES.flatMap((regime) => [...readFileSync(join(PARTIALS, `document-control-${regime}.md`), 'utf8')
    .matchAll(/^\| \*\*([^*|]+)\*\* \|/gm)].map((found) => found[1])));
  assert.deepEqual([...CONTROL_FIELDS].sort(), [...fields].sort());
});

test('J4: a row the regime partials do not have, a comment that is not a template\'s, and a build\'s topic are text the signer is shown', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const plain = readFileSync(file, 'utf8');
  const listed = (text) => { writeFileSync(file, text); return otherOf(dir, 'FOODCOOK', file); };
  const distribution = /^\| \*\*Distribution\*\* \| .*\|$/m.exec(plain)[0];
  const owner = /^\| \*\*Owner\*\* \| .*\|$/m.exec(plain)[0];
  const block = hookBlock().replace('| Stamped at |', '| Build Recipe | `uk-food-sfbb` |\n| Build Target | `PASSED_BY_EHO` |\n| Build Topic | Approved by the Westshire EHO |\n| Stamped at |');
  for (const [what, changed, expected] of [
    ['a row of a field no partial has', swap(plain, distribution, `${distribution}\n| **Approved by the council** | yes |`), ['| **Approved by the council** | yes |']],
    ['the same without its marks', swap(plain, distribution, `${distribution}\n| Seen by | the council |`), ['| Seen by | the council |']],
    ['a second row of a field the table has', swap(plain, distribution, `${distribution}\n| **Owner** | The council |`), ['| **Owner** | The council |']],
    ['a row with a third cell', swap(plain, owner, `${owner.slice(0, -1)}| checked by the council |`), [`${owner.slice(0, -1)}| checked by the council |`]],
    ['a comment inside a cell', swap(plain, distribution, '| **Distribution** | Staff <!-- approved by the council --> |'),
      ['| **Distribution** | Staff <!-- approved by the council --> |']],
    ['a comment that says something', swap(plain, '## Revision History', '<!-- Approved by Westshire council on 2 November -->\n\n## Revision History'),
      ['<!-- Approved by Westshire council on 2 November -->']],
    ['a comment over several lines', swap(plain, '## Revision History', '<!--\nApproved by Westshire council\non 2 November\n-->\n\n## Revision History'),
      ['<!--', 'Approved by Westshire council', 'on 2 November', '-->']],
    ['a template\'s comment with a word added', swap(plain, '## Revision History', '<!-- DOC-CONTROL-HEADER approved -->\n\n## Revision History'),
      ['<!-- DOC-CONTROL-HEADER approved -->']],
    ['a comment in the Revision History', swap(plain, 'confirmed answers | [PENDING]', 'confirmed answers <!-- seen by the council --> | [PENDING]'),
      [/^\| 1\.0 \| .* <!-- seen by the council --> \| \[PENDING\] \| \[PENDING\] \|$/m.exec(swap(plain, 'confirmed answers | [PENDING]', 'confirmed answers <!-- seen by the council --> | [PENDING]'))[0]]],
    ['a build\'s topic, which is free text', `${plain}\n${block}\n`, ['| Build Topic | Approved by the Westshire EHO |']]
  ]) {
    assert.deepEqual(listed(changed), expected, what);
    // Each keeps the document from being signed off until the person signing has been shown it.
    const refused = signOffUnread(dir, 'FOODCOOK');
    assert.equal(refused.status, 1, what);
    assert.deepEqual(reasons(refused.stderr), [otherTextReason(basename(file), expected.length)], what);
    assert.ok(!existsSync(signOffsFile(dir)), what);
  }
  // The table's own two heading rows, and a field of another regime's partial, are the frame's.
  assert.deepEqual(listed(swap(plain, distribution, `${distribution}\n| **Organisation** | Bramble Cafe |`)), []);
  assert.deepEqual(listed(plain), []);
});

test('J5: the record says whether the person signing was shown text outside the checked part, and it is false when there was none to show', () => {
  const dir = cafe();
  // No other text: false, whatever option was given.
  fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK', '--other-text-read', 'yes').status, 0);
  assert.deepEqual(Object.keys(records(dir)[0]), ['doc', 'version', 'file', 'name', 'role', 'date', 'paperSigned', 'otherTextRead', 'body', 'outside']);
  assert.equal(records(dir)[0].otherTextRead, false);
  // Other text, shown: true.
  const own = fromItsTemplate(dir, 'FOODPROF');
  writeFileSync(own, `${readFileSync(own, 'utf8')}\nSee the notice by the till.\n`);
  assert.equal(signOffUnread(dir, 'FOODPROF').status, 1);
  assert.equal(signOffUnread(dir, 'FOODPROF', '--other-text-read', 'yes').status, 0);
  assert.deepEqual(records(dir).map((record) => [record.doc, record.otherTextRead]), [['FOODCOOK', false], ['FOODPROF', true]]);
  assert.equal(docStatus(dir, 'FOODPROF').signOff.otherTextRead, true);
  // A record without it, or with anything but true or false, is not one this helper wrote.
  const good = records(dir);
  for (const [what, value] of [['missing', undefined], ['text', 'yes'], ['a number', 1], ['null', null]]) {
    const { otherTextRead, ...rest } = good[1];
    assert.equal(otherTextRead, true);
    writeFileSync(signOffsFile(dir), `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [good[0], value === undefined ? rest : { ...rest, otherTextRead: value }] }, null, 2)}\n`);
    const result = run('status', '--project', dir);
    assert.equal(result.status, 2, what);
    assert.match(result.stderr, /sign-off 2: otherTextRead is not true or false/, what);
  }
  // The completion record does not print it.
  writeFileSync(signOffsFile(dir), `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: good }, null, 2)}\n`);
  assert.doesNotMatch(run('render', '--doc', 'FOODCMP', '--project', dir).stdout, /otherTextRead|outside its checked part/);
});

// ---- A slip in a cell the sign-off rewrites, after the sign-off (J6) ----

const signedCellLine = (file, line, field, typed, want) => `document ${file} has ${typed === '' ? 'nothing' : `"${typed}"`} in ${field}, at line ${line}, ` +
  `where a document that Sam Okafor has signed off has ${want}: write ${want} there and nothing else`;

test('J6: a Last Modified typed as anything but a date while a sign-off is marked gives one line, which says what to write there, and following it ends with the document signed off', () => {
  for (const typed of ['18 November 2026', '2026-11-18 (signed)', 'today', '']) {
    const dir = cafe();
    const file = fromItsTemplate(dir, 'FOODCOOK');
    const name = basename(file);
    assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
    mark(file);
    assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true]);
    edit(file, '| **Last Modified** | 2026-11-17 |', `| **Last Modified** | ${typed} |`);
    const line = lineNumber(file, '| **Last Modified** |');
    const said = signedCellLine(name, line, 'Last Modified', typed, 'today\'s date written YYYY-MM-DD');
    // One line, check's own, and no word about the file having been changed outside its markers.
    const result = check(dir, 'FOODCOOK', file);
    assert.deepEqual([result.exit, result.kind, result.line, result.bodyInStep], [1, 'header', line, true], typed);
    assert.equal(`document ${name} ${result.reason}`, said, typed);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [said], typed);
    assert.doesNotMatch(run('status', '--project', dir).stdout, /changed outside its UK-FOOD markers|sign it off again|changes nothing else in the file/, typed);
    const cook = docStatus(dir, 'FOODCOOK');
    assert.deepEqual([cook.signedOff, cook.inSync, cook.bodyInStep], [false, false, true], typed);
    // Signing again is not what puts it right, and is refused with the same one line.
    const again = signOffUnread(dir, 'FOODCOOK');
    assert.equal(again.status, 1, typed);
    assert.deepEqual(reasons(again.stderr), [said], typed);
    assert.equal(records(dir).length, 1, typed);
    // Written as the line says, the document is signed off, with its header showing it.
    edit(file, `| **Last Modified** | ${typed} |`, '| **Last Modified** | 2026-11-18 |');
    assert.equal(check(dir, 'FOODCOOK', file).exit, 0, typed);
    assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true], typed);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [], typed);
  }
});

test('J6: after a sign-off, any cell the sign-off rewrites that holds something else is told the same way, one at a time, with what a signed document has there', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  const marked = readFileSync(file, 'utf8');
  for (const [from, to, field, typed, want] of [
    ['| **Status** | APPROVED |', '| **Status** | Draft |', 'Status', 'Draft', 'APPROVED'],
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | pending |', 'Reviewed By', 'pending', `"${SAM}"`],
    [`| **Approved By** | ${SAM} |`, '| **Approved By** |  |', 'Approved By', '', `"${SAM}"`],
    ['| Sam Okafor, Owner | 2026-11-17 |', '| pending | 2026-11-17 |', 'Approved By in the Revision History', 'pending', '"Sam Okafor, Owner"'],
    ['| Sam Okafor, Owner | 2026-11-17 |', '| Sam Okafor, Owner | Pending |', 'Approval Date in the Revision History', 'Pending', '2026-11-17']
  ]) {
    writeFileSync(file, swap(marked, from, to));
    const said = signedCellLine(name, lineNumber(file, to), field, typed, want);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [said], field);
    assert.equal(check(dir, 'FOODCOOK', file).kind, 'header', field);
  }
  // Two such cells: the first is told, then the second, and then the document is signed off.
  writeFileSync(file, swap(swap(marked, '| **Status** | APPROVED |', '| **Status** | draft |'), '| **Last Modified** | 2026-11-17 |', '| **Last Modified** | yesterday |'));
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [signedCellLine(name, lineNumber(file, '| **Status** |'), 'Status', 'draft', 'APPROVED')]);
  edit(file, '| **Status** | draft |', '| **Status** | APPROVED |');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [signedCellLine(name, lineNumber(file, '| **Last Modified** |'), 'Last Modified', 'yesterday', 'today\'s date written YYYY-MM-DD')]);
  edit(file, '| **Last Modified** | yesterday |', '| **Last Modified** | 2026-11-18 |');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  // Before any sign-off, such a cell is told as before: what to write first, so that marking changes nothing else.
  const fresh = cafe();
  const unsigned = fromItsTemplate(fresh, 'FOODCOOK');
  edit(unsigned, '| **Last Modified** | 2026-11-16 |', '| **Last Modified** | 16 November 2026 |');
  assert.deepEqual(linesFor(fresh, 'FOODCOOK'), [cellLine(basename(unsigned), lineNumber(unsigned, '| **Last Modified** |'), 'Last Modified', '16 November 2026', 'a date as YYYY-MM-DD'), NOT_SIGNED]);
  assert.equal(check(fresh, 'FOODCOOK', unsigned).exit, 0);
});

// ---- Signed off, with a header still to be marked (J7) ----

test('J7: a document that is signed off while its header still reads DRAFT is said so in one line, by status and by the completion record, and is not among what is unfinished', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signedOff, cook.headerShowsSignOff, cook.inSync, cook.bodyInStep], [true, false, true, true]);
  // It blocks nothing, and nothing is unfinished about it.
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), []);
  const how = 'the sign-off command finishes the marking, and no new sign-off is needed';
  const readable = run('status', '--project', dir).stdout;
  assert.ok(readable.includes(`; signed off by Sam Okafor, Owner, on 2026-11-17, with its header not yet marked to show it: ${how}\n`), readable);
  const record = run('render', '--doc', 'FOODCMP', '--project', dir).stdout;
  const said = `Cooking (FOODCOOK) is signed off, and the header of ARC-001-FOODCOOK-v1.0.md is not yet marked to show it: ${how}.`;
  assert.equal(record.split('\n').filter((line) => line.includes('not yet marked')).join('\n'), said);
  // In the record it stands on its own, below the list of what is unfinished and not in it.
  const lines = record.split('\n');
  assert.equal(lines[lines.indexOf(said) - 1], '');
  assert.doesNotMatch(lines[lines.indexOf(said)], /^- /);
  assert.ok(lines.indexOf(said) > lines.indexOf('## Unfinished'));
  // Marked, neither says it any more.
  mark(file);
  assert.equal(docStatus(dir, 'FOODCOOK').headerShowsSignOff, true);
  assert.ok(run('status', '--project', dir).stdout.includes('; signed off by Sam Okafor, Owner, on 2026-11-17\n'));
  assert.doesNotMatch(run('render', '--doc', 'FOODCMP', '--project', dir).stdout, /not yet marked/);
  // A document that is not signed off is never said to be waiting only for its header.
  const other = cafe();
  fromItsTemplate(other, 'FOODCOOK');
  assert.doesNotMatch(run('status', '--project', other).stdout, /not yet marked/);
  assert.doesNotMatch(run('render', '--doc', 'FOODCMP', '--project', other).stdout, /not yet marked/);
});

// ---- The last touch-up (T5, T6) ----

// What the sign-off command's marking loop goes by (T1): the kind of fault check reports, and the two ends it may reach.
const unmark = (file) => {
  edit(file, '| **Status** | APPROVED |', '| **Status** | DRAFT |');
  edit(file, `| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | [PENDING] |');
  edit(file, `| **Approved By** | ${SAM} |`, '| **Approved By** | [PENDING] |');
  edit(file, 'confirmed answers | Sam Okafor, Owner | 2026-11-17 |', 'confirmed answers | [PENDING] | [PENDING] |');
};

test('T1: a marking that also changes another cell is told by its kind, not by its line, and each way out ends truly: marked, or with the header reading as unsigned', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  const json = () => JSON.parse(run('check', '--doc', 'FOODCOOK', '--project', dir, '--report', file, '--json').stdout);
  const facts = () => { const d = docStatus(dir, 'FOODCOOK'); return [d.signedOff, d.headerShowsSignOff, d.bodyInStep]; };
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  assert.deepEqual([json().ok, ...facts()], [true, true, true, true]);
  // The slip: while marking, the Classification cell is changed as well.
  const classification = /^\| \*\*Classification\*\* \| .*\|$/m.exec(readFileSync(file, 'utf8'))[0];
  edit(file, classification, '| **Classification** | OFFICIAL |');
  const fault = json();
  // The fault is reported on the Status line, like a fault in a header cell: only its kind tells the two apart.
  assert.deepEqual([fault.ok, fault.kind, fault.line, fault.cell ?? false], [false, 'not-as-signed', lineNumber(file, '| **Status** |'), false]);
  assert.deepEqual(facts(), [false, true, true]);
  assert.match(run('status', '--project', dir).stdout, /ARC-001-FOODCOOK-v1\.0\.md changed since it was signed off; not signed off\n/);
  // A slip in one of the cells the marking writes is the other kind, on the same sort of line.
  const slipped = readFileSync(file, 'utf8');
  edit(file, '| **Classification** | OFFICIAL |', classification);
  edit(file, `| **Approved By** | ${SAM} |`, '| **Approved By** | Sam Okafor (Owner), 2026-11-17 |');
  assert.deepEqual([json().kind, json().line], ['header', lineNumber(file, '| **Approved By** |')]);
  // Way out one: the stray change is put back exactly, and the document is marked.
  edit(file, '| **Approved By** | Sam Okafor (Owner), 2026-11-17 |', `| **Approved By** | ${SAM} |`);
  assert.deepEqual([json().ok, ...facts()], [true, true, true, true]);
  // Way out two: the stray change stays, and the header is put back to an unsigned document's. check passes, the header
  // claims nothing, and status says in its own words that the file is not the one that was signed.
  writeFileSync(file, slipped);
  unmark(file);
  assert.deepEqual([json().ok, ...facts()], [true, false, false, true]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [outsideChangedLine('Sam Okafor', '2026-11-17')]);
  const readable = run('status', '--project', dir).stdout;
  assert.ok(readable.includes(`${name} in step with its worksheets; not signed off\n`), readable);
  assert.doesNotMatch(readFileSync(file, 'utf8'), /APPROVED/);
  // The header put back with nothing else changed is the other not-marked state: the sign-off stands, and status says the header is still to be marked.
  const clean = cafe();
  const other = fromItsTemplate(clean, 'FOODCOOK');
  assert.equal(signOffUnread(clean, 'FOODCOOK').status, 0);
  mark(other);
  unmark(other);
  const d = docStatus(clean, 'FOODCOOK');
  assert.deepEqual([d.signedOff, d.headerShowsSignOff], [true, false]);
  assert.match(run('status', '--project', clean).stdout, /signed off by Sam Okafor, Owner, on 2026-11-17, with its header not yet marked to show it/);
});

test('T5: the helper refuses a sign-off that is the newest one over again: the same person, role, file and version, with nothing in the file changed', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  // The reason says truly whether the header shows the sign-off (V2): before the header is marked, and after.
  const already = (marked) => `Sam Okafor's sign-off of ${name} (version 1.0) as Owner is already recorded, on 2026-11-17, and the file has not ` +
    `changed since, so nothing more is recorded. ${marked ? 'Its header shows it.' : 'Its header is not yet marked to show it: the sign-off command ' +
    'finishes the marking, and no new sign-off is needed.'}`;
  for (const marked of [false, true]) {
    if (marked) mark(file);
    // (A printed copy signed since is not the same sign-off over again: V2 records it.)
    for (const extra of [[], ['--date', '2026-11-18'], ['--other-text-read', 'yes']]) {
      const again = signOffUnread(dir, 'FOODCOOK', ...extra);
      assert.equal(again.status, 1, `${marked} ${extra}: ${again.stdout}`);
      assert.equal(again.stdout, '');
      assert.deepEqual(reasons(again.stderr), [already(marked)], `${marked} ${extra}`);
      assert.equal(records(dir).length, 1);
    }
  }
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, true);
  // Another person, or the same person in another role, is another sign-off.
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Nair', '--role', 'Manager', '--version', '1.0', '--date', '2026-11-17').status, 0);
  assert.equal(records(dir).length, 2);
  // And once the file has changed outside its markers, the same person signs it again as it now reads.
  const other = cafe();
  const changed = fromItsTemplate(other, 'FOODCOOK');
  assert.equal(signOffUnread(other, 'FOODCOOK').status, 0);
  mark(changed);
  writeFileSync(changed, `${readFileSync(changed, 'utf8')}\nSee the notice by the till.\n`);
  assert.equal(signOffUnread(other, 'FOODCOOK', '--other-text-read', 'yes').status, 0);
  assert.equal(records(other).length, 2);
});

// ---- The open items (V2, V3) ----

const FIRST_LINE = (stderr) => stderr.split('\n')[0];

test('V2: asking again to sign a document that is signed off and marked records nothing, and the refusal says it is already signed off, never that it is not', () => {
  // The reviewer's demonstration: signed, marked, then the same sign-off asked for again.
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  const record = readFileSync(signOffsFile(dir), 'utf8');
  const marked = readFileSync(file, 'utf8');
  const again = signOffUnread(dir, 'FOODCOOK');
  assert.equal(again.status, 1, again.stdout);
  assert.equal(FIRST_LINE(again.stderr), 'FOODCOOK is already signed off, by Sam Okafor, Owner, on 2026-11-17, and nothing more was written, because:');
  assert.doesNotMatch(again.stderr, /not signed off/);
  assert.deepEqual(reasons(again.stderr), [`Sam Okafor's sign-off of ${name} (version 1.0) as Owner is already recorded, on 2026-11-17, and the file has ` +
    'not changed since, so nothing more is recorded. Its header shows it.']);
  assert.equal(readFileSync(signOffsFile(dir), 'utf8'), record);
  assert.equal(readFileSync(file, 'utf8'), marked);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signedOff, cook.headerShowsSignOff, cook.signOff.name, cook.signOff.role], [true, true, 'Sam Okafor', 'Owner']);
  // Another reason besides, on a document that is signed off: the first line still says what is true of it.
  const wrong = signOffUnread(dir, 'FOODCOOK', '--version', '1.1');
  assert.equal(wrong.status, 1);
  assert.equal(FIRST_LINE(wrong.stderr), 'FOODCOOK is already signed off, by Sam Okafor, Owner, on 2026-11-17, and nothing more was written, because:');
  assert.equal(reasons(wrong.stderr).length, 2);
  // A document that is not signed off is still told so.
  const other = cafe();
  writeDocument(other, 'FOODCOOK');
  setSheet(other, 'CK', sheet(other, 'CK').replace(/State: confirmed\nBy: Sam Okafor\nOn: 2026-11-17/, 'State: unanswered\nBy:\nOn:').replace(/^Answer: .*\n(State: unanswered\nBy:\nOn:)/m, 'Answer:\n$1'));
  assert.equal(FIRST_LINE(signOff(other, 'FOODCOOK').stderr), 'FOODCOOK is not signed off, and nothing was written, because:');
});

test('V2: the duplicate reason is given only while the recorded sign-off stands: with another fault, the refusal says the document is not signed off, why, and nothing of a marking step', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  // The file is as it was signed, but its worksheet now has a problem, so the sign-off does not stand.
  setSheet(dir, 'CK', `${sheet(dir, 'CK')}a stray line\n`);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signedOff, cook.signOff.name], [false, 'Sam Okafor']);
  const refused = signOffUnread(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.equal(FIRST_LINE(refused.stderr), 'FOODCOOK is not signed off, and nothing was written, because:');
  assert.deepEqual(reasons(refused.stderr), [problemsLine('CK', 1)]);
  assert.doesNotMatch(refused.stderr, /already recorded|marking/);
  assert.equal(records(dir).length, 1);
});

test('V2: a printed copy signed after the sign-off is recorded, as a record that differs only in that, and the summary can say so; the same again is not', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  const paper = signOffUnread(dir, 'FOODCOOK', '--paper-signed', 'yes', '--date', '2026-11-18');
  assert.equal(paper.status, 0, paper.stderr);
  assert.match(paper.stdout, new RegExp(`signed off ${name.replace(/\./g, '\\.')} \\(FOODCOOK, version 1\\.0\\) on 2026-11-18, with a signed paper copy\\. ` +
    'A printed copy is now recorded as signed: this sign-off was already recorded, on 2026-11-17, without one\\.'));
  const [first, second] = records(dir);
  assert.deepEqual([second.paperSigned, second.date, second.body, second.outside], ['yes', '2026-11-18', first.body, first.outside]);
  assert.deepEqual({ ...second, paperSigned: first.paperSigned, date: first.date }, first);
  // As for a second signer (G6), the header shows the earlier record's date until it is marked again with the newest, and
  // the document's one line says what to write.
  const before = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([before.signedOff, before.headerShowsSignOff, before.signOff.paperSigned], [false, false, 'yes']);
  assert.match(linesFor(dir, 'FOODCOOK').join('\n'), /Write "Sam Okafor, Owner, 2026-11-18" there and nothing else/i);
  for (const [from, to] of [[`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor, Owner, 2026-11-18 |'],
    [`| **Approved By** | ${SAM} |`, '| **Approved By** | Sam Okafor, Owner, 2026-11-18 |'],
    ['confirmed answers | Sam Okafor, Owner | 2026-11-17 |', 'confirmed answers | Sam Okafor, Owner | 2026-11-18 |']]) edit(file, from, to);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true]);
  // The printed copy recorded, asking again records nothing, with the paper copy or without.
  for (const extra of [['--paper-signed', 'yes'], []]) {
    const again = signOffUnread(dir, 'FOODCOOK', ...extra);
    assert.equal(again.status, 1, `${extra}: ${again.stdout}`);
    assert.match(reasons(again.stderr)[0], /is already recorded, on 2026-11-18, and the file has not changed since, so nothing more is recorded\. Its header shows it\.$/);
  }
  assert.equal(records(dir).length, 2);
});

test('V3: a marking whose own edit also changed a line between the markers is put right by undoing that edit, after which the sign-off stands and the header shows it', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  const marked = readFileSync(file, 'utf8');
  // The stray change falls inside the markers: check calls it an edit, and status a new version to write.
  edit(file, 'Poached eggs', 'Boiled eggs');
  const result = check(dir, 'FOODCOOK', file);
  assert.deepEqual([result.kind, result.bodyInStep], ['edited', false]);
  assert.equal(docStatus(dir, 'FOODCOOK').signedOff, false);
  assert.equal(linesFor(dir, 'FOODCOOK').at(-1), rewriteLine('Sam Okafor', '2026-11-17'));
  // Undone, exactly: nothing more is needed.
  edit(file, 'Boiled eggs', 'Poached eggs');
  assert.equal(readFileSync(file, 'utf8'), marked);
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true]);
});

test('V3: a signed document someone has since edited, still reading APPROVED, reads as unsigned once its five cells are put back, and status still says what to do', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  edit(file, 'Poached eggs', 'Boiled eggs');
  // Signing again is refused, and the header still reads APPROVED: the not-marked end puts the five cells back.
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.equal(FIRST_LINE(refused.stderr), 'FOODCOOK is not signed off, and nothing was written, because:');
  assert.match(readFileSync(file, 'utf8'), /\| \*\*Status\*\* \| APPROVED \|/);
  unmark(file);
  assert.doesNotMatch(readFileSync(file, 'utf8'), /APPROVED|Sam Okafor, Owner/);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signedOff, cook.headerShowsSignOff, cook.bodyInStep], [false, false, false]);
  assert.equal(check(dir, 'FOODCOOK', file).kind, 'edited');
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [editedLine(basename(file), check(dir, 'FOODCOOK', file).line), rewriteLine('Sam Okafor', '2026-11-17')]);
});

// What the readable status says of a slip in a header cell on a file with a sign-off recorded (V4): that a sign-off is
// recorded, and that the cell does not read as a signed document's does, with what to write in the line under Unfinished.
const SLIP = 'with a sign-off recorded, and a cell of its header that is not what a signed document has there: write in it what its ' +
  'line under Unfinished says';

test('V4: the readable status says of each slip in a header cell that a sign-off is recorded and the cell does not read as it should, never that no recorded sign-off bears it out', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  const name = basename(file);
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  const marked = readFileSync(file, 'utf8');
  // The reviewer's four: a role typed in another case, a date in another form, the role in brackets, and a Revision History
  // cell with the role in brackets. Each keeps the record's name.
  for (const [from, to, write] of [
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor, owner, 2026-11-17 |', `"${SAM}"`],
    [`| **Approved By** | ${SAM} |`, '| **Approved By** | Sam Okafor, Owner, 18/11/2026 |', `"${SAM}"`],
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor (owner), 2026-11-17 |', `"${SAM}"`],
    ['confirmed answers | Sam Okafor, Owner | 2026-11-17 |', 'confirmed answers | Sam Okafor (owner) | 2026-11-17 |', '"Sam Okafor, Owner"'],
    ['confirmed answers | Sam Okafor, Owner | 2026-11-17 |', 'confirmed answers | Sam Okafor, Owner | 17/11/2026 |', '2026-11-17']
  ]) {
    writeFileSync(file, swap(marked, from, to));
    const readable = run('status', '--project', dir).stdout;
    assert.ok(readable.includes(`; ${name} ${SLIP}; not signed off\n`), `${to}\n${readable}`);
    assert.doesNotMatch(readable, /no recorded sign-off bears out/, to);
    // The line under Unfinished says what to write there, and it is the document's only line.
    const lines = linesFor(dir, 'FOODCOOK');
    assert.equal(lines.length, 1, `${to}: ${lines.join('\n')}`);
    assert.ok(lines[0].includes(`write ${write} there`), `${to}: ${lines[0]}`);
    // Written as it says, the document is signed off with its header showing it again.
    writeFileSync(file, marked);
    assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true]);
  }
  // A header that claims a sign-off nobody recorded is still told as that.
  const other = cafe();
  const claimed = fromItsTemplate(other, 'FOODCOOK');
  edit(claimed, '| **Status** | DRAFT |', '| **Status** | APPROVED |');
  assert.ok(run('status', '--project', other).stdout.includes('with a header that no recorded sign-off bears out; not signed off\n'));
});

test('T6: the readable status says of a slip in a cell what is true of it, and the folder\'s text needs no possessive of the business\'s name', () => {
  // A Last Modified typed as words after a sign-off: the record is there and the names match, so no sign-off is "not borne out".
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  assert.equal(signOffUnread(dir, 'FOODCOOK').status, 0);
  mark(file);
  edit(file, '| **Last Modified** | 2026-11-17 |', '| **Last Modified** | 18 November 2026 |');
  const readable = run('status', '--project', dir).stdout;
  assert.ok(readable.includes(`; ARC-001-FOODCOOK-v1.0.md ${SLIP}; not signed off\n`), readable);
  assert.doesNotMatch(readable, /no recorded sign-off bears out/);
  // A header that claims a sign-off nobody recorded is still told as that.
  const other = cafe();
  const claimed = fromItsTemplate(other, 'FOODCOOK');
  edit(claimed, '| **Status** | DRAFT |', '| **Status** | APPROVED |');
  assert.ok(run('status', '--project', other).stdout.includes('with a header that no recorded sign-off bears out; not signed off\n'));
  // The folder's README: a name that ends in s, and the default name typed with two spaces.
  const kebabs = newProject('A-1 Kebabs');
  assert.equal(setUp(kebabs).status, 0);
  const readme = readFileSync(join(kebabs, 'README.md'), 'utf8');
  assert.ok(readme.startsWith('# A-1 Kebabs: food safety records\n\nThis folder holds the food safety records of A-1 Kebabs. '), readme.slice(0, 120));
  assert.doesNotMatch(readme, /Kebabs's|Kebabs'/);
  assert.match(setUp(newProject('Bramble Cafe')).stdout, /is now set up for the food safety records of Bramble Cafe\./);
  const spaced = newProject('Food  safety');
  const done = setUp(spaced);
  assert.equal(done.status, 0, done.stderr);
  assert.ok(readFileSync(join(spaced, 'README.md'), 'utf8').startsWith('# Food safety records\n\nThis folder holds a food business\'s food safety records. '));
});

// ---- A worksheet whose guidance comment is gone (J3) ----

test('J3: status and the sign-off refusal say, in one line, that a worksheet\'s guidance comment is missing, and what puts it back', () => {
  const dir = cafe();
  templated(dir, 'FOODCOOK');
  const lines = sheet(dir, 'CK').split('\n');
  const [opens, closes] = [lines.indexOf('<!--'), lines.indexOf('-->')];
  setSheet(dir, 'CK', [...lines.slice(0, opens), ...lines.slice(closes + 2)].join('\n'));
  const line = 'worksheet food-safety/answers-CK.md was made by a different version of the overlay (its guidance comment is missing), ' +
    'so none of its answers counts until it is brought up to date: upgrade-worksheet --file food-safety/answers-CK.md shows each line ' +
    'it would take out or put in, and with --write does so and keeps a copy. Anything a person typed on a line it takes out cannot be ' +
    'told from old wording, so a person reads what it shows first';
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [line, NOT_SIGNED]);
  const refused = signOff(dir, 'FOODCOOK');
  assert.equal(refused.status, 1);
  assert.deepEqual(reasons(refused.stderr), [line]);
  // Put back, the worksheet counts again.
  assert.equal(run('upgrade-worksheet', '--file', sheetFile(dir, 'CK'), '--write').status, 0);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [NOT_SIGNED]);
  assert.equal(sheet(dir, 'CK'), lines.join('\n'));
});

// ---- What the review of the overlay round found (J1) ----

const NOT_AS_EXPECTED = /is not as this version of the overlay expects a new project folder to be\. Nothing in it has been changed/;
const snapshot = (dir) => listing(dir).map((name) => (name.endsWith('/') ? name : `${name}:${readFileSync(join(dir, name), 'utf8')}`));

test('J1: set-up-folder compares the whole of each file the script writes: a line added, taken out or changed anywhere in either leaves the folder as it is', () => {
  const edits = {
    'a line appended': (text) => `${text}\n## Our notes\n\nKeep the spare key under the mat.\n`,
    'a line appended with no blank line before it': (text) => `${text}Our own note.\n`,
    'a line taken out of the middle': (text) => {
      const lines = text.split('\n');
      const at = Math.floor(lines.length / 2);
      assert.notEqual(lines[at], undefined);
      return [...lines.slice(0, at), ...lines.slice(at + 1)].join('\n');
    },
    'the very last line changed': (text) => {
      const lines = text.replace(/\n$/, '').split('\n');
      return `${[...lines.slice(0, -1), `${lines.at(-1)} (and our own word)`].join('\n')}\n`;
    },
    'one character changed near the end': (text) => `${text.slice(0, -12)}X${text.slice(-11)}`,
    'the line ending at the end taken off': (text) => text.replace(/\n$/, ''),
    'Windows line endings': (text) => text.replace(/\n/g, '\r\n')
  };
  for (const file of [['README.md'], ['external', 'README.md']]) {
    for (const [what, edit] of Object.entries(edits)) {
      const dir = newProject();
      const path = join(dir, ...file);
      const text = readFileSync(path, 'utf8');
      assert.notEqual(edit(text), text, what);
      writeFileSync(path, edit(text));
      const before = snapshot(dir);
      const result = setUp(dir);
      assert.equal(result.status, 1, `${file.join('/')}: ${what}: ${result.stdout}`);
      assert.equal(result.stdout, '', what);
      assert.match(result.stderr, NOT_AS_EXPECTED, `${file.join('/')}: ${what}`);
      assert.deepEqual(snapshot(dir), before, `${file.join('/')}: ${what}`);
    }
  }
  // The number and the folder's own name are the folder's: a README copied in from another project is not this one's.
  const dir = newProject();
  for (const [from, to] of [['Project ID: 001', 'Project ID: 002'], ['ARC-001-STKE', 'ARC-002-STKE'], ['001-bramble-cafe/', '001-another-cafe/']]) {
    const text = readFileSync(join(dir, 'README.md'), 'utf8');
    assert.ok(text.includes(from), from);
    writeFileSync(join(dir, 'README.md'), text.replace(from, to));
    const result = setUp(dir);
    assert.equal(result.status, 1, from);
    assert.match(result.stderr, NOT_AS_EXPECTED, from);
    writeFileSync(join(dir, 'README.md'), text);
  }
  // Untouched, the same folder is set up; whatever day the script ran, and whatever the business is called.
  const text = readFileSync(join(dir, 'README.md'), 'utf8');
  writeFileSync(join(dir, 'README.md'), text.replace(/^Created: \d{4}-\d{2}-\d{2}$/m, 'Created: 2025-03-09'));
  assert.equal(setUp(dir).status, 0);
});

test('J1: the refusal says what is true of the folder, and never that it was not just made', () => {
  for (const change of [(dir) => writeFileSync(join(dir, 'notes.txt'), 'x\n'), (dir) => writeFileSync(join(dir, 'README.md'), '# Bramble Cafe\n\nOur own notes.\n'),
    (dir) => rmSync(join(dir, 'README.md')), (dir) => writeFileSync(join(dir, 'decisions', 'a.md'), 'x\n')]) {
    const dir = newProject();
    change(dir);
    const result = setUp(dir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, NOT_AS_EXPECTED);
    assert.doesNotMatch(result.stderr, /not a project that has just been made|a project that already existed/);
  }
});

test('J1: a folder made with no business name reads well, and the folder\'s text is true of the completion record', () => {
  for (const name of ['Food safety', 'food safety', 'Food Safety']) {
    const dir = newProject(name);
    const done = setUp(dir);
    assert.equal(done.status, 0, done.stderr);
    const readme = readFileSync(join(dir, 'README.md'), 'utf8');
    assert.ok(readme.startsWith('# Food safety records\n\nThis folder holds a food business\'s food safety records. '), readme.slice(0, 120));
    assert.doesNotMatch(readme, /food safety: food safety|food safety's food safety/i);
    assert.doesNotMatch(done.stdout, /food safety's food safety/i);
    assert.match(done.stdout, /is now set up for a food business's food safety records\./);
    // Run again, it is already set up.
    const again = setUp(dir);
    assert.equal(again.status, 0, again.stderr);
    assert.match(again.stdout, /is already set up: nothing has been changed/);
    assert.equal(readFileSync(join(dir, 'README.md'), 'utf8'), readme);
  }
  // A business whose name only holds those words keeps its name.
  const named = newProject('Hartley Food Safety Kitchen');
  assert.equal(setUp(named).status, 0);
  assert.ok(readFileSync(join(named, 'README.md'), 'utf8').startsWith('# Hartley Food Safety Kitchen: food safety records\n'));
  // The completion record and the diary and record sheets are the two documents nobody signs, and the folder's text says so.
  const readme = readFileSync(join(named, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /Each is a draft until a named person at the business signs it off\.\n/);
  assert.match(readme, /Each is a draft until a named person at the business signs it off, except two that nobody signs: the completion record \(`ARC-001-FOODCMP-v1\.0\.md`\), which reports where the others stand, and the diary and record sheets \(`ARC-001-FOODREC-v1\.0\.md`\), which are blank forms whose pages are signed by the people who fill them in\./);
});

// ---- A folder an earlier release set up (final review A1) ----

const README_6_23_0 = JSON.parse(readFileSync(resolve('tests/fixtures/uk-food/folder-readme-6.23.0.json'), 'utf8'));

test('A1: a folder the 6.23.0 helper set up is one this helper made: already set up, left as it is, whatever its name and number', () => {
  // The fixture is 6.23.0's text, which names five commands; this version's names nine.
  for (const text of [README_6_23_0.named, README_6_23_0.unnamed]) {
    assert.match(text, /5\. `uk-food-sign-off`/);
    assert.doesNotMatch(text, /uk-food-allergens/);
  }
  const cases = [
    ['Bramble Cafe', README_6_23_0.named],
    ['Food safety', README_6_23_0.unnamed],
    ['The Old Mill Tea-Room 2', README_6_23_0.named.replaceAll('Bramble Cafe', 'The Old Mill Tea-Room 2')]
  ];
  for (const [name, text] of cases) {
    const dir = newProject(name);
    assert.equal(setUp(dir).status, 0);
    writeFileSync(join(dir, 'README.md'), text);
    const before = snapshot(dir);
    const result = setUp(dir);
    assert.equal(result.status, 0, `${name}: ${result.stderr}`);
    assert.match(result.stdout, /is already set up: nothing has been changed/, name);
    assert.deepEqual(snapshot(dir), before, name);
  }
  // Another folder number: the number in its file names is the folder's own.
  const root = dirname(newProject());
  for (const n of ['002', '003', '004', '005', '006', '007']) {
    const made = spawnSync('bash', [CREATE_PROJECT, '--json', '--force', '--name', `Cafe ${n}`], { cwd: dirname(root), encoding: 'utf8' });
    assert.equal(made.status, 0, made.stderr);
  }
  const seventh = realpathSync(join(root, readdirSync(root).find((entry) => entry.startsWith('007-'))));
  assert.equal(setUp(seventh).status, 0);
  writeFileSync(join(seventh, 'README.md'), README_6_23_0.named.replaceAll('Bramble Cafe', 'Cafe 007').replaceAll('ARC-001-', 'ARC-007-'));
  assert.match(setUp(seventh).stdout, /is already set up: nothing has been changed/);
  // But only as it was written: a line changed, or another folder's number, is a README someone has changed.
  for (const text of [`${README_6_23_0.named}Our own note.\n`, README_6_23_0.named.replace('5. `uk-food-sign-off`', '5. `uk-food-allergens`'),
    README_6_23_0.named.replaceAll('Bramble Cafe', 'Cafe 007')]) {
    writeFileSync(join(seventh, 'README.md'), text);
    const before = snapshot(seventh);
    const result = setUp(seventh);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, NOT_AS_EXPECTED);
    assert.deepEqual(snapshot(seventh), before);
  }
});

// ---- What the re-review of the seven fixes found (H8, H9) ----

const rewriteLine = (name, date) => `signed off by ${name} on ${date}, but what it prints has changed since: writing the document again ` +
  'makes a new version, which then needs signing off';

test('H8: a cell typed inexactly while a sign-off is marked gives one line, check\'s own, and following it leaves the document signed off with its header showing the sign-off', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  const name = basename(file);
  // Before any sign-off there is nothing for a header to show.
  assert.equal(docStatus(dir, 'FOODCOOK').headerShowsSignOff, null);
  assert.equal(docStatus(dir, 'FOODXC').headerShowsSignOff, null);
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, false]);
  mark(file);
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true]);
  const marked = readFileSync(file, 'utf8');
  // Each slip of the kind a marking makes, and each other header fault on a signed file: one line, the header's.
  for (const [from, to, pattern] of [
    [`| **Approved By** | ${SAM} |`, '| **Approved By** | Sam Okafor (Owner), 2026-11-17 |', /Write "Sam Okafor, Owner, 2026-11-17" there and nothing else/],
    [`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | Sam Okafor, Owner |', /Write "Sam Okafor, Owner, 2026-11-17" there and nothing else/],
    ['| **Status** | APPROVED |', '| **Status** | APPROVED by the council |', /Write APPROVED there, or put it back to DRAFT/],
    ['answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | Sam Okafor (Owner) | 2026-11-17 |', /Write "Sam Okafor, Owner" there and nothing else/]
  ]) {
    writeFileSync(file, swap(marked, from, to));
    const result = check(dir, 'FOODCOOK', file);
    assert.deepEqual([result.exit, result.kind, result.line], [1, 'header', lineNumber(file, to)], to);
    assert.match(result.message, pattern, to);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [`document ${name} ${result.reason}`], to);
    assert.ok(status(dir).unfinished.every(({ what }) => !/changed outside its UK-FOOD markers|sign it off again|sign the document off again/.test(what)), to);
    const cook = docStatus(dir, 'FOODCOOK');
    assert.deepEqual([cook.signedOff, cook.inSync, cook.bodyInStep, cook.headerShowsSignOff], [false, false, true, false], to);
    // Signing again does not put a header right, and is refused for that line alone.
    const refused = signOff(dir, 'FOODCOOK');
    assert.equal(refused.status, 1, to);
    assert.deepEqual(reasons(refused.stderr), [`document ${name} ${result.reason}`], to);
    // Following the line: the cell written as it says.
    writeFileSync(file, marked);
    assert.equal(check(dir, 'FOODCOOK', file).exit, 0, to);
    assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, true], to);
    assert.deepEqual(linesFor(dir, 'FOODCOOK'), [], to);
  }
  assert.equal(JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs.length, 1);
  // The end the review reached by "putting the edit back": the record stands and check passes, but the
  // header reads DRAFT. status says the document is signed off and that its header does not show it.
  const unmarked = readFileSync(templated(cafe(), 'FOODCOOK'), 'utf8');
  writeFileSync(file, unmarked);
  const draft = docStatus(dir, 'FOODCOOK');
  assert.equal(check(dir, 'FOODCOOK', file).exit, 0);
  assert.deepEqual([draft.signedOff, draft.headerShowsSignOff], [true, false]);
  // Half marked is not marked: a Status of APPROVED with the names still pending, or the history row not filled in.
  for (const [from, to] of [[`| **Reviewed By** | ${SAM} |`, '| **Reviewed By** | [PENDING] |'],
    ['answers | Sam Okafor, Owner | 2026-11-17 |', 'answers | [PENDING] | [PENDING] |']]) {
    writeFileSync(file, swap(marked, from, to));
    assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [true, false], to);
  }
  // A second signer: the header shows the newest sign-off only once it is rewritten to it.
  writeFileSync(file, marked);
  assert.equal(run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Priya Shah', '--role', 'Manager', '--version', '1.0', '--date', '2026-11-18').status, 0);
  assert.equal(docStatus(dir, 'FOODCOOK').headerShowsSignOff, false);
  assert.equal(linesFor(dir, 'FOODCOOK').length, 1);
  assert.match(linesFor(dir, 'FOODCOOK')[0], /which does not name Priya Shah/);
});

test('H9: a signed file whose text between the markers was changed by hand is told that writing it again makes a new version, not to sign off again', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  edit(file, 'Poached eggs', 'Boiled eggs');
  const result = check(dir, 'FOODCOOK', file);
  assert.deepEqual([result.exit, result.kind, result.bodyInStep], [1, 'edited', false]);
  assert.deepEqual(linesFor(dir, 'FOODCOOK'), [editedLine(basename(file), result.line), rewriteLine('Sam Okafor', '2026-11-17')]);
  assert.equal(signOff(dir, 'FOODCOOK').status, 1, 'signing again is refused until the document is written again');
  // The same when its markers are damaged: there is no body to compare, so a new version is what follows.
  edit(file, 'Boiled eggs', 'Poached eggs');
  edit(file, '<!-- UK-FOOD:END -->', '');
  assert.equal(linesFor(dir, 'FOODCOOK').at(-1), rewriteLine('Sam Okafor', '2026-11-17'));
  // A pack heading outside the markers is told on its own line, which says to take it out: nothing is added to it.
  const other = cafe();
  const second = templated(other, 'FOODCOOK');
  assert.equal(signOff(other, 'FOODCOOK').status, 0);
  mark(second);
  edit(second, '## Revision History', '## COOKING\n\n## Revision History');
  assert.deepEqual(linesFor(other, 'FOODCOOK'), [outsideLine(basename(second), lineNumber(second, '## COOKING'))]);
});

test('H9: the Build Provenance block is the hook\'s only with each field once, in the hook\'s order, and a recipe and a target of the shape a build writes', () => {
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  writeFileSync(file, `${readFileSync(file, 'utf8')}\n${hookBlock()}\n`);
  const signed = () => docStatus(dir, 'FOODCOOK').signedOff;
  assert.equal(signed(), true);
  const text = readFileSync(file, 'utf8');
  const stamped = /\| Stamped at \| [^|]+ \|\n/.exec(text)[0];
  const efforts = /\| Requested Effort \| [^\n]+\n\| Effective Effort \| [^\n]+\n/.exec(text)[0];
  const build = '| Build Recipe | `uk-food-sfbb` |\n| Build Wave | 2 |\n| Build Target | `CK` |\n';
  // What the hook itself may write in place of what is there: a build's rows, in their place, with or without a wave.
  for (const rows of [`${efforts}${build}${stamped}`, `${efforts}${build.replace('| Build Wave | 2 |\n', '')}${stamped}`, `${build}${stamped}`,
    `${efforts}| Build Recipe | _unknown_ |\n| Build Target | \`ADR-001\` |\n${stamped}`, `${efforts}| Build Recipe | \`uk-saas\` |\n| Build Target | \`ADR_AEMO_INTERFACES\` |\n${stamped}`]) {
    writeFileSync(file, swap(text, `${efforts}${stamped}`, rows));
    assert.equal(signed(), true, rows);
  }
  // What it never writes: a field twice, fields out of order, one effort without the other, a build's rows
  // without its recipe or its target, no time of stamping, or a recipe or target that is not shaped like one.
  for (const rows of [
    `${efforts}${stamped}${stamped}`, `${stamped}${efforts}`, `${efforts}${efforts}${stamped}`, `${efforts}${stamped}${build}`,
    `${efforts.split('\n')[0]}\n${stamped}`, `${efforts.split('\n')[1]}\n${stamped}`, `${efforts}`, `${stamped.repeat(1)}`.replace(stamped, ''),
    `${efforts}| Build Wave | 2 |\n${stamped}`, `${efforts}| Build Recipe | \`uk-food-sfbb\` |\n${stamped}`, `${efforts}| Build Target | \`CK\` |\n${stamped}`,
    `${efforts}${build}${build}${stamped}`, `${efforts}| Build Target | \`CK\` |\n| Build Recipe | \`uk-food-sfbb\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`approved-by-Westshire-EHO\` |\n| Build Target | \`CK\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`Approved\` |\n| Build Target | \`CK\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`recipes/uk-food-sfbb.yaml\` |\n| Build Target | \`CK\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`uk-food-sfbb\` |\n| Build Target | \`approved by the council\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`uk-food-sfbb\` |\n| Build Target | \`seen-by-the-eho\` |\n${stamped}`,
    `${efforts}| Build Recipe | \`uk-food-sfbb\` |\n| Build Wave | two |\n| Build Target | \`CK\` |\n${stamped}`
  ]) {
    writeFileSync(file, swap(text, `${efforts}${stamped}`, rows));
    assert.equal(signed(), false, JSON.stringify(rows));
    assert.equal(check(dir, 'FOODCOOK', file).kind, 'not-as-signed', JSON.stringify(rows));
  }
  writeFileSync(file, text);
  assert.equal(signed(), true);
});

test('H9: a header row inside a blockquote is read as a row: it cannot claim a sign-off nobody recorded, and it does not stand in for the header\'s own row', () => {
  for (const row of ['> | **Status** | APPROVED |', '>| Status | APPROVED |', '> > | **Status** | APPROVED |', '  > | __status:__ | APPROVED']) {
    const dir = cafe();
    const file = templated(dir, 'FOODCOOK');
    edit(file, '## Revision History', `${row}\n\n## Revision History`);
    const result = check(dir, 'FOODCOOK', file);
    assert.deepEqual([result.exit, result.kind, result.line], [1, 'header', lineNumber(file, row)], row);
    assert.match(result.message, /Status is "APPROVED", but no sign-off is recorded for this file/, row);
    // And in place of the header's own row.
    const stood = templated(dir, 'FOODCOOK');
    edit(stood, '| **Status** | DRAFT |', row);
    assert.deepEqual([check(dir, 'FOODCOOK', stood).exit, check(dir, 'FOODCOOK', stood).kind], [1, 'header'], row);
  }
  // On a signed and marked file, a quoted row is not one of the cells the sign-off step writes: it counts as any other line.
  const dir = cafe();
  const file = templated(dir, 'FOODCOOK');
  assert.equal(signOff(dir, 'FOODCOOK').status, 0);
  mark(file);
  edit(file, '| **Status** | APPROVED |', '> | **Status** | APPROVED |');
  assert.deepEqual([docStatus(dir, 'FOODCOOK').signedOff, docStatus(dir, 'FOODCOOK').headerShowsSignOff], [false, false]);
  assert.equal(check(dir, 'FOODCOOK', file).kind, 'not-as-signed');
  // A quoted row that claims nothing is only a line of other text, shown to whoever signs.
  const quiet = cafe();
  const plain = templated(quiet, 'FOODCOOK');
  edit(plain, '## Revision History', '> | **Status** | DRAFT |\n\n## Revision History');
  assert.equal(check(quiet, 'FOODCOOK', plain).exit, 0);
  assert.deepEqual(check(quiet, 'FOODCOOK', plain).otherText.map((entry) => entry.text), ['> | **Status** | DRAFT |']);
  assert.deepEqual(linesFor(quiet, 'FOODCOOK'), [NOT_SIGNED]);
});

test('H9: a sign-off name or role that holds a refused character is told which one, by its code point', () => {
  const dir = cafe();
  writeDocument(dir, 'FOODCOOK');
  const tag = String.fromCodePoint(0xe0041);
  const override = String.fromCodePoint(0x202e);
  const named = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', `Sam${override}Oka${tag}for`, '--role', 'Owner', '--version', '1.0');
  assert.equal(named.status, 2);
  assert.match(named.stderr, /--name is the name of the person signing off: some text, on one line, with no character that cannot be seen\. It holds U\+202E and U\+E0041: delete them, or type it again/);
  const role = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam Okafor', '--role', `Own${tag}er`, '--version', '1.0');
  assert.match(role.stderr, /--role is the role of the person signing off, such as owner: some text, on one line, with no character that cannot be seen\. It holds U\+E0041: delete it, or type it again/);
  // An empty name, or one over two lines, is told as before, with no code point to name.
  const empty = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', ' ', '--role', 'Owner', '--version', '1.0');
  assert.match(empty.stderr, /--name is the name of the person signing off: some text, on one line, with no character that cannot be seen\n/);
  assert.ok(!existsSync(signOffsFile(dir)));
});

test('the same person giving the name or role another way makes a new record, which is how a slip in a recorded one is put right', () => {
  const dir = cafe();
  const file = fromItsTemplate(dir, 'FOODCOOK');
  // Recorded with the role in small letters.
  const first = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam Okafor', '--role', 'owner', '--version', '1.0', '--date', '2026-11-17');
  assert.equal(first.status, 0, first.stderr);
  // The same words over again are refused, as the newest sign-off recorded twice would be.
  const again = run('sign-off', '--doc', 'FOODCOOK', '--project', dir, '--name', 'Sam Okafor', '--role', 'owner', '--version', '1.0', '--date', '2026-11-17');
  assert.equal(again.status, 1, again.stdout);
  assert.match(again.stderr, /is already recorded/);
  // Given as the person wants it shown, it is a statement of its own: recorded, and the newest.
  const put = signOffUnread(dir, 'FOODCOOK');
  assert.equal(put.status, 0, put.stderr);
  const records = JSON.parse(readFileSync(signOffsFile(dir), 'utf8')).signOffs;
  assert.deepEqual(records.map(({ name, role }) => [name, role]), [['Sam Okafor', 'owner'], ['Sam Okafor', 'Owner']]);
  const cook = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([cook.signOff.name, cook.signOff.role], ['Sam Okafor', 'Owner']);
  // Marked to the newest record, the document is signed off and its header shows the corrected role.
  mark(file);
  const marked = docStatus(dir, 'FOODCOOK');
  assert.deepEqual([marked.signedOff, marked.headerShowsSignOff], [true, true]);
  assert.match(readFileSync(file, 'utf8'), /\| \*\*Approved By\*\* \| Sam Okafor, Owner, 2026-11-17 \|/);
});
