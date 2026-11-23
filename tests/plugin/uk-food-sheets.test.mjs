import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CHECK_FORMS, COMPLETION_RECORD, DEFAULT_DATA_DIR, DIARY_COVER, DOC_CODES, DOCUMENTS, NOT_CONFIRMED, NOT_CONFIRMED_CELL, PROVE_IT_FORM,
  RECORD_SHEETS, RENDERED_CODES, STATUS_ORDER, UNANSWERED, WEEK_PAGE, checkDocument, documentOf, loadData, main, projectStatus, renderDocument,
  sentenceCase, signOffDocument, withDocuments
} from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

// The diary and record sheets (FOODREC): the pack's blank forms. The pack's words are never typed here: every
// label, check and prompt is read from the data, as the helper reads it.

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const data = loadData(DEFAULT_DATA_DIR);
const CAFE = 'tests/fixtures/uk-food/project-cafe';
const EXPECTED = join(CAFE, 'expected', 'FOODREC.body.md');
// The date the commands would give as today, as the other tests pass it to every reading.
const TODAY = '2026-11-22';

// A temporary copy of the cafe's worksheets, with any changed ({ section: text }) or taken away ({ section: null }).
const cafe = (changes = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-sheets-'));
  cpSync(join(CAFE, 'food-safety'), join(dir, 'food-safety'), { recursive: true });
  for (const [section, text] of Object.entries(changes)) {
    const file = join(dir, 'food-safety', `answers-${section}.md`);
    if (text === null) rmSync(file);
    else writeFileSync(file, text);
  }
  return dir;
};
const cafeText = (section) => readFileSync(join(CAFE, 'food-safety', `answers-${section}.md`), 'utf8');
const swap = (text, from, to) => {
  assert.ok(text.includes(from), `${JSON.stringify(from)} is not in the text`);
  return text.replace(from, to);
};
const render = (dir, from = data) => renderDocument('FOODREC', dir, from, { today: TODAY });
const rendered = (dir) => {
  const result = render(dir);
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  return result.text;
};
// The lines between the markers.
const inner = (text) => text.split('\n').slice(1, -1);
// The lines of a body under the "## " heading given, up to the next one (or the line after the forms).
const sectionOf = (text, heading) => {
  const lines = inner(text);
  const from = lines.indexOf(`## ${heading}`);
  assert.ok(from >= 0, `## ${heading} is not in the body`);
  const next = lines.findIndex((line, i) => i > from && (line.startsWith('## ') || line.startsWith('One week page')));
  return lines.slice(from + 1, next);
};
// A table row's cells, split at each pipe not escaped.
const cellsOf = (row) => row.slice(2, -2).split(/(?<!\\) \| /);
const rowsOf = (lines) => lines.filter((line) => line.startsWith('| ') && !/^\|( --- \|)+$/.test(line)).map(cellsOf);

// The forms in the data, found as the constants name them.
const pageOf = (page) => data.diary.pages.find((p) => p.page === page);
const coverBlock = () => pageOf(DIARY_COVER.page).blocks.find((block) => block.kind === 'table');
const checkBlock = (form) => pageOf(CHECK_FORMS.page).blocks.find((block) => block.form === form);
const checksOf = (form) => checkBlock(form).questions.filter((q) => q.type === 'tick').map((q) => q.text);
const weekBoxes = () => pageOf(WEEK_PAGE.page).blocks.filter((block) => block.form === WEEK_PAGE.form);
const proveIt = () => pageOf(PROVE_IT_FORM.page).blocks.find((block) => block.form === PROVE_IT_FORM.form);
const headingOf = (form) => sentenceCase(checkBlock(form).heading);
// The days of the week, Monday first, as this computer names them in English: not typed here.
const DAYS = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }));

// An answer in the cafe's Management worksheet, which leaves MG-01-Q11 and MG-01-Q21 unanswered, given as the lines that
// replace its unanswered fields.
const BLANK_ANSWER = 'Answer:\nState: unanswered\nBy:\nOn:\nSource:';
const answered = (text, id, lines) => {
  const at = text.indexOf(`### ${id}\n`);
  const from = text.indexOf(BLANK_ANSWER, at);
  assert.ok(at >= 0 && from > at && from - at < 400, id);
  return `${text.slice(0, from)}${lines.join('\n')}${text.slice(from + BLANK_ANSWER.length)}`;
};
const typed = (answer) => `Answer: ${answer.join('\n  ')}`;
const confirmed = (...answer) => [typed(answer), 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'];
const proposed = (...answer) => [typed(answer), 'State: proposed', 'By:', 'On:', 'Source: Walk-round notes'];
const OWN = ['Ice machine scoop is in its holder', 'Extractor fan is switched on'];
const mgWith = (id, lines) => answered(cafeText('MG'), id, lines);
// Ruling B: each checks form ends with three empty rows for checks written in by hand, where the pack's form leaves a list.
const ROOM = Array.from({ length: 3 }, () => ['', '']);
// The labels of a week page box, a note joined to the label before it as a table cell prints it.
const labelsOf = (box) => box.questions.reduce((labels, q) => (q.type === 'note' ? [...labels.slice(0, -1), `${labels.at(-1)}<br>${q.text}`]
  : [...labels, q.text]), []);

// ---- The forms, tied to the data ----

test('DIARY_COVER names the one table of the diary\'s cover, every question of it a label, and the one label for the business', () => {
  const tables = pageOf(DIARY_COVER.page).blocks.filter((block) => block.kind === 'table');
  assert.equal(tables.length, 1);
  const labels = tables[0].questions;
  assert.ok(labels.length > 0 && labels.every((q) => q.type === 'text' && q.text !== ''));
  assert.deepEqual(labels.filter((q) => /business/i.test(q.text)).map((q) => q.id), [DIARY_COVER.business]);
});

test('CHECK_FORMS names the opening and closing checks forms, each with the Management list question that holds the business\'s own checks for it', () => {
  const mg = data.sections.get('MG').methods.find((method) => method.id === CHECK_FORMS.method);
  assert.deepEqual(CHECK_FORMS.forms.map(({ form }) => form), ['openingChecks', 'closingChecks']);
  for (const { form, own } of CHECK_FORMS.forms) {
    const blocks = pageOf(CHECK_FORMS.page).blocks.filter((block) => block.form === form);
    assert.equal(blocks.length, 1, form);
    const [block] = blocks;
    assert.equal(block.columns.length, 1, form);
    // Ticks with words, then the empty list the pack leaves for the business's own, last.
    assert.deepEqual(block.questions.map((q) => q.type), [...checksOf(form).map(() => 'tick'), 'list'], form);
    assert.equal(block.questions.at(-1).text, '', form);
    // The Management worksheet's question is that list in MG-01's block of the same heading, after the same checks.
    const same = mg.blocks.find((b) => b.heading === block.heading);
    assert.deepEqual(same.questions.map((q) => [q.type, q.text]), block.questions.map((q) => [q.type, q.text]), form);
    assert.equal(same.questions.at(-1).id, own, form);
  }
  // The page's one text box, on extra checks, which the document prints after them.
  assert.equal(pageOf(CHECK_FORMS.page).blocks.filter((block) => block.kind === 'text').length, 1);
});

test('WEEK_PAGE names a blank week page: no block read from a picture, and between its first box and its last, the seven days in order', () => {
  const page = pageOf(WEEK_PAGE.page);
  assert.ok(!page.blocks.some((block) => block.fromImage), 'the page holds no filled-in example');
  const boxes = weekBoxes();
  assert.equal(boxes.length, page.blocks.length);
  assert.deepEqual(boxes.slice(1, -1).map((box) => box.heading), DAYS);
  // The first box has no heading, the last is the extra checks box, headed as the checks page's text box is.
  assert.equal(boxes[0].heading, null);
  assert.equal(boxes.at(-1).heading, pageOf(CHECK_FORMS.page).blocks.find((block) => block.kind === 'text').heading);
  // The page before it is the pack's filled-in example, which the document never reads.
  assert.ok(pageOf(WEEK_PAGE.page - 1).blocks.some((block) => block.fromImage && block.form === WEEK_PAGE.form));
});

test('PROVE_IT_FORM names the one prove it table, whose first row is the pack\'s example and every other row blank', () => {
  const tables = pageOf(PROVE_IT_FORM.page).blocks.filter((block) => block.form === PROVE_IT_FORM.form);
  assert.equal(tables.length, 1);
  const [example, ...rest] = tables[0].rows;
  assert.ok(example.some((cell) => cell !== ''));
  assert.ok(rest.length > 0 && rest.every((row) => row.length === tables[0].columns.length && row.every((cell) => cell === '')));
});

// ---- The body ----

test('the cafe renders to the expected diary and record sheets body, through the function and the command', () => {
  const expected = readFileSync(EXPECTED, 'utf8');
  assert.equal(`${rendered(CAFE)}\n`, expected);
  const cli = run('render', '--doc', 'FOODREC', '--project', CAFE);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(cli.stdout, expected);
});

test('every check on page 82 appears once in its form\'s section, in order, beside an empty cell, and none is left out', () => {
  const text = rendered(CAFE);
  for (const { form } of CHECK_FORMS.forms) {
    const rows = rowsOf(sectionOf(text, headingOf(form)));
    // Then the room the form's empty list leaves for checks written in by hand.
    assert.ok(checkBlock(form).questions.some((q) => q.type === 'list' && q.text === ''), form);
    assert.deepEqual(rows, [[checkBlock(form).columns[0], ''], ...checksOf(form).map((check) => [check, '']), ...ROOM], form);
  }
  // Each heading is the form's, and the sections come in the page's order.
  const lines = inner(text);
  const at = CHECK_FORMS.forms.map(({ form }) => lines.indexOf(`## ${headingOf(form)}`));
  assert.ok(at[0] > 0 && at[1] > at[0], at.join(' '));
});

test('the week section is page 95: Week commencing, then one table of the seven days under the page\'s labels, then the extra checks box', () => {
  const text = rendered(CAFE);
  const [start, ...days] = weekBoxes();
  const extra = days.pop();
  // The tables of the section, each as its rows of cells, the header row first.
  const grouped = sectionOf(text, 'Week').join('\n').split('\n\n').map((part) => part.trim()).filter((part) => part.startsWith('| ')).map((part) => rowsOf(part.split('\n')));
  assert.equal(grouped.length, 3);
  const [first, week, last] = grouped;
  // Week commencing, and the extra checks box, each a label beside an empty cell under its heading (or none).
  assert.deepEqual(first, [['', ''], ...labelsOf(start).map((label) => [label, ''])]);
  assert.deepEqual(last, [[extra.heading, ''], ...labelsOf(extra).map((label) => [label, ''])]);
  assert.ok(!extra.questions.some((q) => q.type === 'note'), 'the extra checks box has no statement');
  // The week: seven rows and six columns; each heading label is page 95's; every day once, in order, every cell empty.
  const [header, ...rows] = week;
  assert.equal(rows.length, 7);
  assert.ok(week.every((cells) => cells.length === 6));
  const words = new Set(weekBoxes().flatMap((box) => box.questions.map((q) => q.text)));
  assert.equal(header[0], '');
  for (const label of header.slice(1)) assert.ok(label.split('<br>').every((part) => words.has(part)), label);
  assert.deepEqual(header.slice(1), labelsOf(days[0]));
  assert.deepEqual(rows.map(([day]) => day), days.map((day) => day.heading));
  assert.ok(rows.every((cells) => cells.slice(1).every((cell) => cell === '')));
  // The statement is never a line of its own: it is only in the signature column's heading, after its label.
  const notes = new Set(days.flatMap((day) => day.questions.filter((q) => q.type === 'note').map((q) => q.text)));
  assert.equal(notes.size, 1);
  const [note] = notes;
  assert.equal(header.at(-1), `${days[0].questions.find((q, i, all) => all[i + 1]?.type === 'note').text}<br>${note}`);
  assert.deepEqual(inner(text).filter((line) => line.includes(note)), [`| ${header.join(' | ')} |`]);
});

test('the seven days on page 95 carry the same labels, so the one table loses no word; a day that differed would show its own words', () => {
  const [, ...days] = weekBoxes();
  days.pop();
  for (const day of days) assert.deepEqual(labelsOf(day), labelsOf(days[0]), day.heading);
  // Data in which one day's prompt differs: that day's cell holds its own words, and every other cell stays empty.
  const copy = structuredClone(data);
  const page = copy.diary.pages.find((p) => p.page === WEEK_PAGE.page);
  const friday = page.blocks.filter((block) => block.form === WEEK_PAGE.form)[5];
  friday.questions[0].text = 'Anything else to note today?';
  const text = render(CAFE, copy).text;
  const week = sectionOf(text, 'Week').join('\n').split('\n\n').map((part) => part.trim()).filter((part) => part.startsWith('| '))[1];
  const rows = rowsOf(week.split('\n')).slice(1);
  assert.deepEqual(rows[4], [friday.heading, 'Anything else to note today?', '', '', '', '']);
  assert.ok(rows.filter((_, i) => i !== 4).every((cells) => cells.slice(1).every((cell) => cell === '')));
});

test('nothing of a filled-in example is printed: no text read from a picture, nor the prove it example row; the blank rows are the form\'s own count', () => {
  const text = rendered(CAFE);
  const blocks = data.diary.pages.flatMap((page) => page.blocks);
  // Words the pack also prints on its forms (a label read from the picture as well as the page) are not the example's.
  const printed = new Set(blocks.filter((block) => !block.fromImage).flatMap((block) => [block.heading, block.text, ...(block.columns ?? []),
    ...(block.questions ?? []).map((q) => q.text)]).filter(Boolean));
  const example = [...blocks.filter((block) => block.fromImage).map((block) => block.text), ...proveIt().rows[0].filter((cell) => cell !== '')]
    .filter((words) => !printed.has(words));
  assert.ok(example.length > 0);
  for (const words of example) assert.ok(!text.includes(words), words);
  // The prove it table: its columns over as many empty rows as the form leaves blank.
  const rows = rowsOf(sectionOf(text, sentenceCase(pageOf(PROVE_IT_FORM.page).title)));
  assert.deepEqual(rows[0], proveIt().columns);
  assert.deepEqual(rows.slice(1), proveIt().rows.filter((row) => row.every((cell) => cell === '')));
  assert.equal(rows.length - 1, proveIt().rows.length - 1);
});

test('own checks confirmed in MG-01-Q11 are printed, both lines, under the own-checks line after the pack\'s opening checks; proposed or unanswered, nothing', () => {
  const [opening, closing] = CHECK_FORMS.forms;
  const text = rendered(cafe({ MG: mgWith(opening.own, confirmed(...OWN)) }));
  const section = sectionOf(text, headingOf(opening.form));
  const own = section.indexOf(`| The business's own ${checkBlock(opening.form).heading.toLowerCase()} |  |`);
  const last = section.indexOf(`| ${checksOf(opening.form).at(-1)} |  |`);
  assert.ok(last > 0 && own > last, section.join('\n'));
  assert.deepEqual(rowsOf(section.slice(own)), [[`The business's own ${checkBlock(opening.form).heading.toLowerCase()}`, ''], ...OWN.map((check) => [check, '']),
    ...ROOM]);
  // The room for checks written in by hand follows the business's own, and is not printed twice.
  assert.deepEqual(rowsOf(section.slice(0, own)).slice(-1), [[checksOf(opening.form).at(-1), '']]);
  // The closing checks gain nothing from the opening checks' answer.
  assert.deepEqual(sectionOf(text, headingOf(closing.form)), sectionOf(rendered(CAFE), headingOf(closing.form)));
  // Proposed, it adds nothing and leaves no mark: the body is the fixture's.
  const fixture = rendered(CAFE);
  assert.equal(rendered(cafe({ MG: mgWith(opening.own, proposed(...OWN)) })), fixture);
  for (const check of OWN) assert.ok(!fixture.includes(check));
  // The closing checks' own, from MG-01-Q21, go under the closing checks.
  const shut = rendered(cafe({ MG: mgWith(closing.own, confirmed('Back door is locked')) }));
  assert.deepEqual(rowsOf(sectionOf(shut, headingOf(closing.form))).slice(-5),
    [[`The business's own ${checkBlock(closing.form).heading.toLowerCase()}`, ''], ['Back door is locked', ''], ...ROOM]);
  assert.deepEqual(sectionOf(shut, headingOf(opening.form)), sectionOf(fixture, headingOf(opening.form)));
});

test('with MG-01 marked not relevant, every check the pack prints is still there, no own check is added and no not-relevant line is printed', () => {
  // (The worksheet reader refuses an answer under a method marked not relevant, so its questions stay unanswered.)
  const mg = swap(cafeText('MG'), '## MG-01 Opening and closing checks\n\nStatus: applies\nReason:\nDecided-by:',
    '## MG-01 Opening and closing checks\n\nStatus: not-relevant\nReason: We keep our own check list on the wall.\nDecided-by: Sam Okafor');
  const text = rendered(cafe({ MG: mg }));
  assert.equal(text, rendered(CAFE));
  assert.ok(!text.includes('Not relevant') && !text.includes('We keep our own check list'));
});

test('with no Management worksheet the record sheets render, adding no own checks; one with problems stops render, as for the allergen information', () => {
  const none = render(cafe({ MG: null }));
  assert.equal(none.exit, 0, (none.messages ?? []).join('\n'));
  assert.equal(`${none.text}\n`, readFileSync(EXPECTED, 'utf8'));
  // A worksheet with a problem is not printed from: render refuses, naming it, exactly as FOODALG does.
  const broken = cafe({ MG: `${cafeText('MG')}a stray line\n` });
  const refused = render(broken);
  assert.equal(refused.exit, 1);
  assert.match(refused.messages.join('\n'), /answers-MG\.md:\d+: /);
  assert.deepEqual(refused, renderDocument('FOODALG', broken, data, { today: TODAY }));
  // One for other data is refused as any document refuses it.
  const other = render(cafe({ MG: cafeText('MG').replace('data=sfbb-caterers-2026-11-17', 'data=sfbb-caterers-2099-01-01') }));
  assert.equal(other.exit, 2);
  assert.match(other.messages.join('\n'), /answers data sfbb-caterers-2099-01-01/);
  // With no profile there is nothing to render from.
  assert.equal(render(cafe({ profile: null })).exit, 2);
});

test('the business\'s name is printed beside the cover\'s business label only when the profile confirms it, escaped', () => {
  const label = coverBlock().questions.find((q) => q.id === DIARY_COVER.business).text;
  const coverRows = (text) => rowsOf(sectionOf(text, sentenceCase(pageOf(DIARY_COVER.page).title)));
  assert.deepEqual(coverRows(rendered(CAFE)), [['', ''], ...coverBlock().questions.map((q) => [q.text, q.id === DIARY_COVER.business ? 'Bramble Cafe' : ''])]);
  const named = 'Answer: Bramble Cafe\nState: confirmed\nBy: Sam Okafor\nOn: 2026-11-17\nSource:';
  const unconfirmed = rendered(cafe({ profile: swap(cafeText('profile'), named, 'Answer: Bramble Cafe\nState: proposed\nBy:\nOn:\nSource: The shop sign') }));
  assert.ok(coverRows(unconfirmed).every(([, value]) => value === ''), 'nothing beside any label');
  assert.ok(unconfirmed.includes('This is the business\'s own food safety record.'));
  // A name holding a pipe and the unfinished marks keeps the table's two columns and shows neither mark.
  const odd = rendered(cafe({ profile: swap(cafeText('profile'), named, 'Answer: Bramble | **NOT YET ANSWERED** Cafe\nState: confirmed\nBy: Sam Okafor\n' +
    'On: 2026-11-17\nSource:') }));
  const row = coverRows(odd).find(([text]) => text === label);
  assert.deepEqual(row, [label, 'Bramble \\| \\*\\*NOT YET ANSWERED\\*\\* Cafe']);
  assert.ok(coverRows(odd).every((cells) => cells.length === 2));
  assert.ok(!odd.includes(UNANSWERED));
});

test('an own check holding a pipe or an unfinished mark is escaped, keeps its table\'s columns, and nothing in the body marks it unfinished', () => {
  const [opening] = CHECK_FORMS.forms;
  const dir = cafe({ MG: mgWith(opening.own, confirmed('Ice machine | scoop', UNANSWERED, `${NOT_CONFIRMED}x`, NOT_CONFIRMED_CELL)) });
  const text = rendered(dir);
  const rows = rowsOf(sectionOf(text, headingOf(opening.form)));
  assert.ok(rows.every((cells) => cells.length === 2));
  assert.deepEqual(rows.slice(-7, -3).map(([check]) => check), ['Ice machine \\| scoop', '\\*\\*NOT YET ANSWERED\\*\\*', `${NOT_CONFIRMED}x`,
    '\\*\\*NOT CONFIRMED\\*\\*']);
  // No line is one that any document's row reads as unfinished, and this one reads none so.
  const marks = DOCUMENTS.map((row) => row.unfinishedLine);
  for (const line of inner(text)) assert.ok(!marks.some((marked) => marked(line)), line);
  assert.ok(!text.includes(UNANSWERED) && !text.includes(NOT_CONFIRMED_CELL));
  // Written into the project it passes check.
  const file = join(dir, 'ARC-001-FOODREC-v1.0.md');
  writeFileSync(file, `Header text.\n\n${text}\n\nFooter text.\n`);
  assert.equal(checkDocument('FOODREC', dir, file, data, undefined, { today: TODAY }).exit, 0);
});

test('every figure in the body comes from the data: none is typed by the helper', () => {
  const lines = inner(rendered(CAFE));
  const known = JSON.stringify([data.diary, data.source]);
  const figures = lines.join('\n').match(/\d+/g) ?? [];
  assert.ok(figures.length > 0);
  for (const figure of figures) assert.ok(known.includes(figure), figure);
});

test('data that lacks a form, or lays it out otherwise, is refused with a message naming it, and nothing is printed', () => {
  const changed = (change) => {
    const copy = structuredClone(data);
    change(copy.diary.pages);
    return copy;
  };
  const page = (pages, n) => pages.find((p) => p.page === n);
  const refusals = [
    // The pack's filled-in example in place of the blank week page.
    [(pages) => { page(pages, WEEK_PAGE.page).blocks = structuredClone(page(pages, WEEK_PAGE.page - 1).blocks); }, /weekPage form on page 95/],
    // A prove it form with no blank row.
    [(pages) => { proveItOf(pages).rows = proveItOf(pages).rows.slice(0, 1); }, /proveItRecords form on page 93/],
    // A cover with no label for the business.
    [(pages) => { page(pages, DIARY_COVER.page).blocks[0].questions = page(pages, DIARY_COVER.page).blocks[0].questions.filter((q) => q.id !== DIARY_COVER.business); },
      /diary cover on page 80/],
    // A check form with a question of a kind it does not print.
    [(pages) => { page(pages, CHECK_FORMS.page).blocks[0].questions[0].type = 'text'; }, /openingChecks and closingChecks forms on page 82/],
    // A day whose questions are not the other days' kinds in their order, so a label would stand over the wrong cell.
    [(pages) => { page(pages, WEEK_PAGE.page).blocks[3].questions.reverse(); }, /weekPage form on page 95/],
    // No text box on extra checks.
    [(pages) => { page(pages, CHECK_FORMS.page).blocks = page(pages, CHECK_FORMS.page).blocks.filter((b) => b.kind !== 'text'); }, /extra checks on page 82/]
  ];
  for (const [change, pattern] of refusals) {
    const result = render(CAFE, changed(change));
    assert.equal(result.exit, 2, String(pattern));
    assert.equal(result.text, undefined);
    assert.match(result.messages.join('\n'), pattern);
  }
});
const proveItOf = (pages) => pages.find((p) => p.page === PROVE_IT_FORM.page).blocks.find((b) => b.form === PROVE_IT_FORM.form);

// ---- The table, sign-off and check ----

test('FOODREC is in the table before the completion record: rendered and checked, never signed, not among the documents status counts', () => {
  const row = documentOf('FOODREC');
  assert.deepEqual([row.sheet, row.uses, row.needs, row.signable, row.inStatus, row.blankForms], [null, ['profile', 'MG'], ['profile'], false, false, true]);
  assert.equal(row.unfinishedLine(UNANSWERED), false);
  assert.equal(RECORD_SHEETS, 'FOODREC');
  assert.deepEqual(RENDERED_CODES.slice(-2), ['FOODREC', 'FOODCMP']);
  assert.ok(!DOC_CODES.includes('FOODREC') && !STATUS_ORDER.includes('FOODREC'));
  // The completion record is the row with a renderer of its own, said so in the table, not the one row left out of status.
  assert.equal(COMPLETION_RECORD, DOCUMENTS.find((r) => r.render).code);
  assert.equal(COMPLETION_RECORD, 'FOODCMP');
});

test('sign-off refuses FOODREC in its own words, through the function and the command, and records nothing', () => {
  const dir = cafe();
  writeFileSync(join(dir, 'ARC-001-FOODREC-v1.0.md'), `Header text.\n\n${rendered(dir)}\n\nFooter text.\n`);
  const person = { name: 'Sam Okafor', role: 'Owner', version: '1.0', date: '2026-11-17', paperSigned: 'no', otherTextRead: 'yes' };
  const refused = signOffDocument('FOODREC', dir, person, data, { today: TODAY });
  assert.equal(refused.exit, 2);
  assert.deepEqual(refused.messages, [documentOf('FOODREC').signOffRefusal]);
  assert.match(refused.messages[0], /^FOODREC, the diary and record sheets, is not signed off: it is a set of blank forms/);
  const cli = run('sign-off', '--doc', 'FOODREC', '--project', dir, '--name', 'Sam Okafor', '--role', 'Owner', '--version', '1.0', '--date', '2026-11-17');
  assert.equal(cli.status, 2);
  assert.equal(cli.stderr, `${documentOf('FOODREC').signOffRefusal}\n`);
  assert.ok(!existsSync(join(dir, 'food-safety', 'sign-offs.json')));
});

test('a written FOODREC passes check, and a header that says it is approved fails, saying nobody signs it off', () => {
  const dir = cafe();
  const body = rendered(dir);
  const file = join(dir, 'ARC-001-FOODREC-v1.0.md');
  writeFileSync(file, `Header text.\n\n${body}\n\nFooter text.\n`);
  assert.equal(checkDocument('FOODREC', dir, file, data, undefined, { today: TODAY }).exit, 0);
  writeFileSync(file, `| Field | Value |\n| --- | --- |\n| **Status** | APPROVED |\n\n${body}\n`);
  const claimed = checkDocument('FOODREC', dir, file, data, undefined, { today: TODAY });
  assert.deepEqual([claimed.exit, claimed.kind], [1, 'header']);
  assert.match(claimed.message, /this line says Status is "APPROVED", but the diary and record sheets are blank forms for people at the business to fill in and sign, so the document itself is never signed off/);
});

// A row for these tests only, made from FOODOWN's, with what changes given.
const testRow = (changes) => ({ ...documentOf('FOODOWN'), code: 'FOODTEST', name: () => 'Test document', specialProcesses: undefined, ...changes });
const withRow = (row) => [...DOCUMENTS.slice(0, -1), row, DOCUMENTS.at(-1)];

test('the table refuses a row left out of status that is neither the completion record nor blank forms, and a second of either', () => {
  const refused = (rows, pattern) => assert.throws(() => withDocuments(rows, () => assert.fail('a table that is not whole was used')), pattern);
  refused(withRow(testRow({ inStatus: false })), /FOODTEST: inStatus is false, though the row is neither the completion record \(render\) nor the record sheets \(blankForms\)/);
  refused(withRow(testRow({ inStatus: false, signable: false, nobodySigns: 'x', signOffRefusal: 'y', blankForms: true })),
    /FOODTEST: blankForms is another row's too/);
  refused(withRow(testRow({ blankForms: true })), /FOODTEST: blankForms is on a row in status, signed off or with a renderer of its own/);
  refused(withRow(testRow({ inStatus: false, render: () => ({ exit: 0, text: '' }), outOfDate: { message: 'm', reason: 'r' } })),
    /render is another row's too: one document is the completion record/);
  refused(withRow(testRow({ blankForms: 'yes' })), /FOODTEST: blankForms is neither true nor left out/);
  // Blank forms have no worksheet of their own, so check needs their own words; no other row takes them.
  refused(withRow(testRow({ remedies: documentOf('FOODREC').remedies })), /FOODTEST: remedies is given on a row that is not blank forms/);
  refused(DOCUMENTS.map((row) => (row.code === 'FOODREC' ? { ...row, remedies: undefined } : row)),
    /FOODREC: remedies does not give the advice, stale, edited and markers words/);
  assert.equal(documentOf('FOODTEST'), undefined);
  assert.equal(RECORD_SHEETS, 'FOODREC');
});

// ---- Status ----

const status = (dir) => {
  const result = projectStatus(dir, data, { today: TODAY });
  assert.equal(result.exit, undefined, (result.messages ?? []).join('\n'));
  return result;
};
const NOT_WRITTEN_LINE = 'document not written yet: write it, so that people at the business have the blank forms to print and fill in';
const staleLine = (file) => `document ${file} is out of date, as a worksheet it is written from has changed since: write it again`;
const statusText = (dir) => {
  const out = [];
  assert.equal(main(['status', '--project', dir], { out: (text) => out.push(text), err: (text) => out.push(text) }), 0);
  return out.join('\n').split('\n');
};
const completionList = (dir) => {
  const text = renderDocument('FOODCMP', dir, data, { today: TODAY }).text;
  return text.slice(text.indexOf('\n## Unfinished\n'), text.indexOf('\nThis is '));
};

test('status reports the record sheets apart: not written, then written and in step, then out of date once an own check changes', () => {
  const dir = cafe();
  const linesOf = () => status(dir).unfinished.filter((line) => line.code === 'FOODREC').map((line) => line.what);
  // Not written: a line in the unfinished list, in the readable status and the completion record, and none saying it is not signed off.
  assert.deepEqual(status(dir).recordSheets, { written: false, inStep: false, file: null });
  assert.deepEqual(linesOf(), [NOT_WRITTEN_LINE]);
  assert.ok(statusText(dir).includes('FOODREC (Diary and record sheets): not written'));
  assert.ok(statusText(dir).includes(`- FOODREC: ${NOT_WRITTEN_LINE}`));
  assert.ok(completionList(dir).includes(`\n- Diary and record sheets (FOODREC): ${NOT_WRITTEN_LINE}\n`));
  // It comes after the documents' own lines and before the special processes, as in the table.
  const codes = status(dir).unfinished.map((line) => line.code);
  assert.equal(codes.indexOf('FOODREC'), codes.lastIndexOf('FOODSUP') + 1);
  // Written and in step: nothing in any list.
  const file = join(dir, 'ARC-001-FOODREC-v1.0.md');
  writeFileSync(file, `Header text.\n\n${rendered(dir)}\n\nFooter text.\n`);
  assert.deepEqual(status(dir).recordSheets, { written: true, inStep: true, file: 'ARC-001-FOODREC-v1.0.md' });
  assert.deepEqual(linesOf(), []);
  assert.ok(statusText(dir).includes('FOODREC (Diary and record sheets): ARC-001-FOODREC-v1.0.md in step with its worksheets'));
  assert.ok(!completionList(dir).includes('FOODREC'));
  // An own check confirmed since: out of date, and said so in each place.
  writeFileSync(join(dir, 'food-safety', 'answers-MG.md'), mgWith(CHECK_FORMS.forms[0].own, confirmed(...OWN)));
  assert.deepEqual(status(dir).recordSheets, { written: true, inStep: false, file: 'ARC-001-FOODREC-v1.0.md' });
  assert.deepEqual(linesOf(), [staleLine('ARC-001-FOODREC-v1.0.md')]);
  assert.ok(statusText(dir).includes('FOODREC (Diary and record sheets): ARC-001-FOODREC-v1.0.md out of date'));
  assert.ok(completionList(dir).includes(`\n- Diary and record sheets (FOODREC): ${staleLine('ARC-001-FOODREC-v1.0.md')}\n`));
  // check's message says only that the command prints it afresh: nothing was typed, so nobody need say anything was copied.
  const stale = checkDocument('FOODREC', dir, file, data, undefined, { today: TODAY });
  assert.equal(stale.kind, 'stale');
  assert.ok(stale.message.endsWith('\nThis document is printed afresh each time it is written, and writing it again replaces everything between its ' +
    'UK-FOOD markers: run the record sheets command again, which prints it afresh.'), stale.message);
  // Nowhere is it told that it is not signed off.
  for (const said of [JSON.stringify(status(dir)), statusText(dir).filter((line) => line.includes('FOODREC')).join('\n'), completionList(dir)]) {
    assert.ok(!/FOODREC[^\n]*not signed off/.test(said), said);
  }
  // While the Management worksheet has problems the document cannot be compared, and that worksheet's own line says so, under
  // the Management document and here too, as the record sheets cannot be written until it is put right.
  writeFileSync(join(dir, 'food-safety', 'answers-MG.md'), `${cafeText('MG')}a stray line\n`);
  assert.deepEqual(status(dir).recordSheets, { written: true, inStep: false, file: 'ARC-001-FOODREC-v1.0.md' });
  const problem = 'worksheet food-safety/answers-MG.md has 1 problem, so none of its answers counts until it is fixed: parse-worksheet --file ' +
    'food-safety/answers-MG.md lists it';
  assert.deepEqual(linesOf(), [problem]);
  assert.ok(status(dir).unfinished.some((line) => line.code === 'FOODMGT' && line.what === problem));
});

// What check and status say of a FOODREC changed by hand: the forms are printed afresh, so a filled-in copy is kept apart,
// and the business's own checks are changed in the Management worksheet. Never "its worksheet". Then, as the record sheets
// command accepts it (final review B5): forms typed into are printed afresh once a person running the command says that what
// was typed has been copied or is not wanted; a file whose markers are damaged never is, so they are put back or the file
// moved out of the project folder.
const AFRESH = 'its forms are printed afresh each time it is written, and writing it again replaces everything between its UK-FOOD markers';
const KEEP_APART = 'fill in a printed page, or a copy kept apart from this file, never this file itself; copy anything already filled in it to such ' +
  'a copy first; add or change the business\'s own opening and closing checks in the Management safe methods worksheet';
const REMEDY = `${KEEP_APART}; then run the record sheets command again and say that what was typed has been copied or is not wanted: until a ` +
  'person running it says so, it writes nothing over this file';
const MARKERS_REMEDY = `${KEEP_APART}; then put the UK-FOOD marker lines back as they were, or move this file out of the project folder so that ` +
  'the record sheets command writes the document new: it writes nothing over a file whose markers are damaged, whatever anyone says';
const LEAD = 'This document is printed afresh each time it is written, and writing it again replaces everything between its UK-FOOD markers';
const ADVICE = { edited: `${LEAD}: ${REMEDY}.`, markers: `${LEAD}: ${MARKERS_REMEDY}.`,
  stale: `${LEAD}: run the record sheets command again, which prints it afresh.` };

test('a FOODREC filled in or cut by hand between its markers, or with its markers damaged, is told to keep a filled-in copy apart, never to use a worksheet', () => {
  const dir = cafe();
  const file = join(dir, 'ARC-001-FOODREC-v1.0.md');
  const body = rendered(dir);
  const firstDay = weekBoxes()[1].heading;
  const lineOf = (text, needle) => text.split('\n').findIndex((line) => line.startsWith(needle)) + 1;
  const linesOf = () => status(dir).unfinished.filter((line) => line.code === 'FOODREC').map((line) => line.what);
  const cases = [
    // A cell of the week filled in.
    ['edited', `Header text.\n\n${swap(body, `| ${firstDay} |  |`, `| ${firstDay} | Fridge door left open |`)}\n`],
    // A check of the pack's taken out.
    ['edited', `Header text.\n\n${swap(body, `| ${checksOf(CHECK_FORMS.forms[0].form)[0]} |  |\n`, '')}\n`],
    // The END marker gone.
    ['markers', `Header text.\n\n${swap(body, '\n<!-- UK-FOOD:END -->', '')}\n`]
  ];
  for (const [kind, text] of cases) {
    writeFileSync(file, text);
    const checked = checkDocument('FOODREC', dir, file, data, undefined, { today: TODAY });
    assert.equal(checked.kind, kind);
    const reason = kind === 'edited'
      ? `was changed between its UK-FOOD markers, at line ${checked.line}, but ${AFRESH}: ${REMEDY}`
      : `has its UK-FOOD markers missing or damaged (there is no UK-FOOD:END marker line, so there is no rendered body to check), and ${AFRESH}: ` +
        MARKERS_REMEDY;
    assert.equal(checked.reason, reason);
    assert.ok(checked.message.endsWith(`\n${ADVICE[kind]}`), checked.message);
    // Nothing tells a person to write the document again without saying what the record sheets command then needs.
    for (const said of [checked.message, reason]) assert.doesNotMatch(said, /then write the document again/);
    if (kind === 'edited') assert.equal(checked.line, lineOf(text, text.includes('Fridge door') ? `| ${firstDay} ` : `| ${checksOf(CHECK_FORMS.forms[0].form)[1]} `));
    // The same in status, the readable lines and the business's completion record; nothing sends a person to a worksheet of its own.
    assert.deepEqual(linesOf(), [`document ARC-001-FOODREC-v1.0.md ${reason}`]);
    assert.ok(completionList(dir).includes(`\n- Diary and record sheets (FOODREC): document ARC-001-FOODREC-v1.0.md ${reason.replace(/[\\`*_[\]~$]/g, '\\$&')}\n`));
    const cli = run('check', '--doc', 'FOODREC', '--project', dir, '--report', file);
    assert.equal(cli.status, 1);
    const recordLines = completionList(dir).split('\n').filter((line) => line.includes('FOODREC')).join('\n');
    for (const said of [checked.message, reason, cli.stdout + cli.stderr, recordLines]) assert.ok(!/its worksheet/.test(said), said);
  }
  // The body itself says where a filled-in copy is kept, and why.
  assert.ok(inner(body).at(-6).startsWith('One week page is printed here: print or copy it for each week. These pages are for people at the business to fill ' +
    'in, sign and keep, on paper or in a copy kept apart from this document, as writing this document again prints these forms afresh and ' +
    'anything filled in here would be lost.'), inner(body).at(-6));
});

test('the readable status of a FOODREC whose header claims a sign-off says nobody signs it off, not that no sign-off bears it out', () => {
  const dir = cafe();
  const file = join(dir, 'ARC-001-FOODREC-v1.0.md');
  writeFileSync(file, `| Field | Value |\n| --- | --- |\n| **Status** | APPROVED |\n\n${rendered(dir)}\n`);
  const line = statusText(dir).find((l) => l.startsWith('FOODREC ('));
  assert.equal(line, 'FOODREC (Diary and record sheets): ARC-001-FOODREC-v1.0.md with a header that says it is signed off or approved, though nobody ' +
    'signs it off');
  assert.ok(!statusText(dir).join('\n').includes('no recorded sign-off bears out'));
});

test('a document nobody signs that is in status is never told it is not signed off, in status, its readable lines or the completion record', () => {
  const dir = cafe();
  const refusal = 'FOODTEST is not signed off: it is a test document';
  withDocuments(withRow(testRow({ signable: false, nobodySigns: 'the test document is one nobody signs', signOffRefusal: refusal })), () => {
    const lines = status(dir).unfinished.filter((line) => line.code === 'FOODTEST').map((line) => line.what);
    assert.ok(lines.length > 0, 'it has lines of its own: its counts, and that it is not written');
    assert.ok(lines.every((line) => !line.includes('not signed off')), lines.join('\n'));
    const line = statusText(dir).find((l) => l.startsWith('FOODTEST (Test document): '));
    assert.ok(line && !line.includes('signed off'), line);
    assert.ok(!completionList(dir).includes('Test document (FOODTEST): document not signed off'));
    const person = { name: 'Sam Okafor', role: 'Owner', version: '1.0', date: '2026-11-17', paperSigned: 'no', otherTextRead: 'yes' };
    assert.deepEqual(signOffDocument('FOODTEST', dir, person, data, { today: TODAY }), { exit: 2, messages: [refusal] });
  });
});
