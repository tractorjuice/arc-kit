import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  ALLERGEN_TABLE, CLEANING_FORM, CONTACTS_FORM, CUSTOMER_QUESTIONS, DATA_ID, DEFAULT_DATA_DIR, DOCUMENTS, FREE_FROM_POINT, LIST_SECTIONS, LISTS,
  NOT_CONFIRMED_CELL, NOTES_MARK, PPDS_PARAGRAPH, RENDERED_CODES, SUPPLIERS_FORM, UNANSWERED, WORKSHEET_SECTIONS, allergensOf, beginReading, blankWorksheet,
  checkDocument, documentOf, emitWorksheet, listOutstanding, loadData, main, parseWorksheet, projectStatus, readList, renderDocument,
  signOffDocument, upgradeWorksheet, withDocuments
} from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

// The list worksheets and the list documents. The pack's words are never typed here: the cleaning
// schedule's frequencies and columns are read from the data, as the helper reads them.

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const data = loadData(DEFAULT_DATA_DIR);
const parse = (text) => parseWorksheet(text, data);
const messages = (parsed) => parsed.problems.map((p) => p.message).join('\n');

// The pack's cleaning schedule form, found in the data the way the test of CLEANING_FORM finds it.
const FORM = data.diary.pages.find((p) => p.page === CLEANING_FORM.page).blocks.find((b) => b.form === CLEANING_FORM.form);
const [GROUP] = FORM.columnGroups;
const FREQUENCIES = FORM.columns.slice(GROUP.from, GROUP.to + 1);
// The frequency whose words the business writes itself, in Other-frequency: the last of them.
const OTHER = FREQUENCIES.at(-1);

const ENTRY_FIELDS = ['Frequency', 'Other-frequency', 'Precautions', 'Method', 'State', 'By', 'On', 'Source'];
const BLANK_ELSEWHERE = '## Kept elsewhere\n\nWhere:\nState: unanswered\nBy:\nOn:\nSource:\n';
// An entry as the worksheet prints it: its heading, a blank line, then every field, filled or empty, a value's
// further lines each carried on with two spaces.
const entry = (id, title, fields) => [`## ${id} ${title}`, '',
  ...ENTRY_FIELDS.map((f) => (fields[f] ? `${f}: ${fields[f].replace(/\n/g, '\n  ')}` : `${f}:`))].join('\n');
const agreed = { State: 'confirmed', By: 'Sam Okafor', On: '2026-11-17' };
// The blank cleaning worksheet with the entries given after it, as emitWorksheet writes them.
const sheet = (...entries) => `${blankWorksheet('cleaning', data)}${entries.map((e) => `\n${e}\n`).join('')}`;
const withElsewhere = (text, lines) => {
  assert.ok(text.includes(BLANK_ELSEWHERE));
  return text.replace(BLANK_ELSEWHERE, `## Kept elsewhere\n\n${lines.join('\n')}\n`);
};
// The 1-based line of the first line holding `needle`, searching from the line holding `after`.
const lineOf = (text, needle, after = '') => {
  const from = after ? text.indexOf(after) : 0;
  const at = text.indexOf(needle, from);
  assert.ok(at >= 0, `${JSON.stringify(needle)} is not in the text`);
  return text.slice(0, at).split('\n').length;
};

const BOARDS = entry('CS-01', 'Chopping boards', { Frequency: FREQUENCIES[0], Method: 'Scrape off, then put through the dishwasher.', ...agreed });
const FRIDGE = entry('CS-02', 'Drinks fridge', {
  Frequency: OTHER, 'Other-frequency': 'On the first Monday of the month', Precautions: 'Unplug it first.',
  Method: 'Empty it into the cool box.\nWash the shelves in the sink and wipe inside.', ...agreed
});
const FLOOR = entry('CS-03', 'Floor behind the counter', { Frequency: FREQUENCIES[2], Method: 'Sweep, then mop.', State: 'proposed', Source: 'Walk-round notes' });

// ---- The form and the list table ----

test('CLEANING_FORM finds one block of that form on that page, whose one column group spans five columns between the item column and the last two', () => {
  const page = data.diary.pages.find((p) => p.page === CLEANING_FORM.page);
  const blocks = page.blocks.filter((b) => b.form === CLEANING_FORM.form);
  assert.equal(blocks.length, 1);
  const [block] = blocks;
  assert.equal(block.columnGroups.length, 1);
  assert.deepEqual([GROUP.from, GROUP.to, block.columns.length], [1, 5, 8]);
  assert.equal(FREQUENCIES.length, 5);
  // The field the business words the last frequency in is named after it.
  assert.equal(`${OTHER}-frequency`.toLowerCase(), 'other-frequency');
});

test('LIST_SECTIONS are the sections of LISTS, in order, each a worksheet the helper makes, parses and upgrades', () => {
  assert.deepEqual(LIST_SECTIONS, Object.keys(LISTS).sort());
  assert.deepEqual(LIST_SECTIONS, ['allergens', 'cleaning', 'suppliers']);
  for (const section of LIST_SECTIONS) {
    assert.ok(WORKSHEET_SECTIONS.includes(section), section);
    assert.equal(LISTS[section].section, section);
    for (const field of ['prefix', 'title', 'elsewhereLabel', 'keptElsewhere']) assert.equal(typeof LISTS[section][field], 'string', `${section} ${field}`);
    assert.ok(Array.isArray(LISTS[section].fields), section);
    assert.equal(typeof LISTS[section].needs, 'function', section);
    assert.equal(typeof LISTS[section].guidance, 'function', section);
  }
  assert.deepEqual(WORKSHEET_SECTIONS.slice(0, 7), ['XC', 'CL', 'CH', 'CK', 'MG', 'profile', 'own']);
  assert.deepEqual(LISTS.cleaning.fields, ['Frequency', 'Other-frequency', 'Precautions', 'Method']);
  assert.equal(LISTS.cleaning.prefix, 'CS');
  assert.deepEqual(LISTS.suppliers.fields, ['Kind', 'Contact-name', 'Telephone', 'Email', 'Address', 'Delivery-days', 'Lead-time',
    'Goods-supplied', 'Useful-for']);
  assert.equal(LISTS.suppliers.prefix, 'SUP');
});

// ---- The cleaning worksheet ----

test('a blank cleaning worksheet parses with no problems and no entries, and its Kept elsewhere block is unanswered', () => {
  const text = blankWorksheet('cleaning', data);
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.section, 'cleaning');
  assert.equal(parsed.data, DATA_ID);
  assert.equal(parsed.entries.size, 0);
  assert.deepEqual({ ...parsed.elsewhere, line: undefined },
    { where: '', state: 'unanswered', by: '', on: '', source: '', answered: false, line: undefined });
  const lines = text.split('\n');
  assert.equal(lines[0], '# Answers: Cleaning schedule (cleaning)');
  assert.equal(lines[2], `<!-- uk-food-answers 1.0 data=${DATA_ID} section=cleaning -->`);
  assert.ok(text.endsWith(`-->\n\n${BLANK_ELSEWHERE}`), text);
  // The entry to copy ends the guidance, and names the frequencies as the data does.
  assert.ok(text.includes(`\n## CS-01 Name of the item\n\n${ENTRY_FIELDS.map((f) => (f === 'State' ? 'State: unanswered' : `${f}:`)).join('\n')}\n-->\n`));
  assert.ok(text.includes(FREQUENCIES.join('; ')), text);
});

test('a filled cleaning worksheet round-trips through emitWorksheet unchanged', () => {
  const text = withElsewhere(sheet(BOARDS, FRIDGE, FLOOR), ['Where: The red folder in the office', 'State: confirmed', 'By: Sam Okafor',
    'On: 2026-11-17', 'Source:']);
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(emitWorksheet(parsed, data), text);
  assert.deepEqual(parse(emitWorksheet(parsed, data)), parsed);
  assert.deepEqual([...parsed.entries.keys()], ['CS-01', 'CS-02', 'CS-03']);
  const fridge = parsed.entries.get('CS-02');
  assert.deepEqual([fridge.title, fridge.frequency, fridge.otherFrequency, fridge.precautions, fridge.state, fridge.by, fridge.on, fridge.answered],
    ['Drinks fridge', OTHER, 'On the first Monday of the month', 'Unplug it first.', 'confirmed', 'Sam Okafor', '2026-11-17', true]);
  assert.equal(fridge.method, 'Empty it into the cool box.\nWash the shelves in the sink and wipe inside.');
  assert.equal(parsed.entries.get('CS-03').answered, false);
  assert.equal(parsed.elsewhere.answered, true);
  assert.equal(parsed.elsewhere.where, 'The red folder in the office');
});

test('Review Focus 1 of Plan 1: a lower-case field name or frequency, trailing spaces and Windows line endings are read as meant; a blank line inside a value is reported by its line', () => {
  const clean = sheet(BOARDS, FRIDGE);
  const expected = parse(clean);
  const slipped = clean.replace('Frequency: ', 'frequency : ').replace(`Frequency: ${OTHER}`, `Frequency: ${OTHER.toLowerCase()}`)
    .replace('State: confirmed', 'state: confirmed   ').replace(/\n/g, '\r\n');
  const parsed = parse(slipped);
  assert.deepEqual(parsed.problems, []);
  const typed = (p) => JSON.stringify([...p.entries], (name, value) => (name === 'line' ? undefined : value));
  assert.equal(typed(parsed), typed(expected));
  assert.equal(parsed.entries.get('CS-02').frequency, OTHER, 'kept in the pack\'s spelling');
  // A blank line ends a value, so the line after it is reported, by its number, and credited to no entry.
  const gap = clean.replace('Empty it into the cool box.\n', 'Empty it into the cool box.\n\n');
  const broken = parse(gap);
  assert.equal(broken.problems.length, 1, messages(broken));
  assert.equal(broken.problems[0].line, lineOf(gap, '  Wash the shelves'));
  assert.match(broken.problems[0].message, /indented line does not continue a field/);
});

test('Frequency: fortnightly is a problem naming its line and the five frequencies the pack names, and the entry is not used', () => {
  const text = sheet(entry('CS-01', 'Chopping boards', { Frequency: 'fortnightly', Method: 'Scrape off.', ...agreed }));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1, messages(parsed));
  const [problem] = parsed.problems;
  assert.equal(problem.line, lineOf(text, 'Frequency: fortnightly'));
  assert.ok(problem.message.startsWith('CS-01: Frequency "fortnightly" is not '), problem.message);
  for (const frequency of FREQUENCIES) assert.ok(problem.message.includes(frequency), `${frequency}: ${problem.message}`);
  assert.equal(parsed.entries.get('CS-01').answered, false);
  // Each frequency is read in any letter case, and kept in the pack's spelling.
  for (const frequency of FREQUENCIES.slice(0, -1)) {
    const read = parse(sheet(entry('CS-01', 'Chopping boards', { Frequency: frequency.toUpperCase(), Method: 'Scrape off.', ...agreed })));
    assert.deepEqual(read.problems, [], frequency);
    assert.equal(read.entries.get('CS-01').frequency, frequency);
    assert.equal(read.entries.get('CS-01').answered, true, frequency);
  }
});

test('Frequency: other with no Other-frequency cannot be confirmed, and Other-frequency with any other Frequency is a problem', () => {
  const text = sheet(entry('CS-01', 'Drinks fridge', { Frequency: OTHER.toLowerCase(), Method: 'Wipe inside.', ...agreed }));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1, messages(parsed));
  assert.equal(parsed.problems[0].message, 'CS-01 is confirmed, so it needs Other-frequency');
  assert.equal(parsed.problems[0].line, lineOf(text, 'Other-frequency:', '## CS-01 Drinks fridge'));
  assert.equal(parsed.entries.get('CS-01').answered, false);
  // Frequency and Method are what every entry needs, proposed or confirmed.
  const bare = parse(sheet(entry('CS-01', 'Drinks fridge', { State: 'proposed', Source: 'Walk-round notes' })));
  assert.deepEqual(bare.problems.map((p) => p.message), ['CS-01 is proposed, so it needs Frequency', 'CS-01 is proposed, so it needs Method']);
  // An Other-frequency beside a frequency that does not take one would be shown nowhere: reported, entry not used.
  const stray = sheet(entry('CS-01', 'Chopping boards', { Frequency: FREQUENCIES[1], 'Other-frequency': 'Twice a day', Method: 'Scrape off.', ...agreed }));
  const read = parse(stray);
  assert.equal(read.problems.length, 1, messages(read));
  assert.equal(read.problems[0].line, lineOf(stray, 'Other-frequency: Twice a day'));
  assert.match(read.problems[0].message, new RegExp(`^CS-01: Other-frequency is only for an entry whose Frequency is ${OTHER}`));
  assert.equal(read.entries.get('CS-01').answered, false);
  // An unanswered entry keeps what has been given so far, as it was given, unchecked.
  const held = parse(sheet(entry('CS-01', 'Chopping boards', { Frequency: 'fortnightly', 'Other-frequency': 'Twice a day', State: 'unanswered' })));
  assert.deepEqual(held.problems, []);
  assert.equal(held.entries.get('CS-01').frequency, 'fortnightly');
  assert.equal(held.entries.get('CS-01').answered, false);
});

test('an unseen character in a value or an entry\'s name is refused, naming it, and the entry is not used', () => {
  for (const [what, text] of [
    ['a value', sheet(entry('CS-01', 'Chopping boards', { Frequency: FREQUENCIES[0], Method: 'Scrape off\u202E the boards.', ...agreed }))],
    ['a name', sheet(entry('CS-01', 'Chopping\u200B boards', { Frequency: FREQUENCIES[0], Method: 'Scrape off.', ...agreed }))],
    ['Where', withElsewhere(sheet(), ['Where: The red\u2066 folder', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'])]
  ]) {
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, `${what}: ${messages(parsed)}`);
    assert.match(parsed.problems[0].message, /^this line holds U\+(202E|200B|2066): a character that cannot be seen/, what);
    assert.equal(parsed.entries.get('CS-01')?.answered ?? parsed.elsewhere.answered, false, what);
  }
});

test('an entry heading ## CS-02 given twice is a problem at the second, and only the first is read', () => {
  const text = sheet(BOARDS, entry('CS-02', 'Drinks fridge', { Frequency: FREQUENCIES[3], Method: 'Wipe inside.', ...agreed }),
    entry('CS-02', 'Coffee machine', { Frequency: FREQUENCIES[0], Method: 'Purge the wand.', ...agreed }));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1, messages(parsed));
  assert.equal(parsed.problems[0].message, 'CS-02 appears more than once; only the first is read');
  assert.equal(parsed.problems[0].line, lineOf(text, '## CS-02 Coffee machine'));
  assert.equal(parsed.entries.get('CS-02').title, 'Drinks fridge');
  // A heading that is not an entry is reported, and its lines are not read.
  const odd = sheet(entry('CS-1', 'Kettle', { Frequency: FREQUENCIES[2], Method: 'Descale.', ...agreed }));
  assert.match(messages(parse(odd)), /"## CS-1 Kettle" is not read: number the entries CS-01, CS-02 and so on/);
  assert.equal(parse(odd).problems.length, 1);
});

test('Kept elsewhere counts only with Where, State confirmed and a valid By and On; Where given and not confirmed is kept, not used', () => {
  const base = sheet();
  const said = (...lines) => parse(withElsewhere(base, lines));
  const confirmed = said('Where: The red folder', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:');
  assert.deepEqual(confirmed.problems, []);
  assert.equal(confirmed.elsewhere.answered, true);
  const kept = said('Where: The red folder', 'State: unanswered', 'By:', 'On:', 'Source:');
  assert.deepEqual(kept.problems, []);
  assert.deepEqual([kept.elsewhere.where, kept.elsewhere.answered], ['The red folder', false]);
  assert.equal(emitWorksheet(kept, data), withElsewhere(base, ['Where: The red folder', 'State: unanswered', 'By:', 'On:', 'Source:']));
  for (const [lines, problem] of [
    [['Where:', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'], 'Kept elsewhere is confirmed, so it needs Where'],
    [['Where: The red folder', 'State: confirmed', 'By:', 'On: 2026-11-17', 'Source:'], 'Kept elsewhere is confirmed, so it needs By'],
    [['Where: The red folder', 'State: confirmed', 'By: Sam Okafor', 'On: 17/11/2026', 'Source:'], 'Kept elsewhere: On "17/11/2026" is not a date written YYYY-MM-DD'],
    [['Where: The red folder', 'State: proposed', 'By:', 'On:', 'Source:'], 'Kept elsewhere is proposed, so it needs Source'],
    [['Where: The red folder', 'State: unanswered', 'By: Sam Okafor', 'On:', 'Source:'], 'Kept elsewhere: By given, but State is unanswered: set State to proposed or confirmed, or clear it']
  ]) {
    const parsed = said(...lines);
    assert.deepEqual(parsed.problems.map((p) => p.message), [problem], lines.join(' / '));
    assert.equal(parsed.elsewhere.answered, false, problem);
  }
  // A second Kept elsewhere block is reported, and only the first is read.
  const twice = `${base}\n${BLANK_ELSEWHERE.replace('Where:', 'Where: The office')}`;
  assert.deepEqual(parse(twice).problems.map((p) => p.message), ['Kept elsewhere appears more than once; only the first is read']);
});

test('a field another kind of block takes is reported, naming the fields the block takes', () => {
  const text = sheet(entry('CS-01', 'Chopping boards', { Frequency: FREQUENCIES[0], Method: 'Scrape off.', ...agreed }).replace('Method:', 'Where: the shelf\nMethod:'));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1, messages(parsed));
  assert.equal(parsed.problems[0].message, 'Where is not a field of an entry of the cleaning schedule: the fields are Frequency, Other-frequency, ' +
    'Precautions, Method, State, By, On, Source');
});

test('the cleaning worksheet is made, checked and brought up to date from the command line', () => {
  const made = run('worksheet', '--section', 'cleaning');
  assert.equal(made.status, 0, made.stderr);
  assert.equal(made.stdout, blankWorksheet('cleaning', data));
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-lists-'));
  const file = join(dir, 'answers-cleaning.md');
  writeFileSync(file, sheet(BOARDS, FRIDGE));
  const checked = run('parse-worksheet', '--file', file, '--json');
  assert.equal(checked.status, 0, checked.stdout + checked.stderr);
  const json = JSON.parse(checked.stdout);
  assert.deepEqual([json.section, json.elsewhere.state, Object.keys(json.entries)], ['cleaning', 'unanswered', ['CS-01', 'CS-02']]);
  // Its guidance as another version worded it is put back as this version prints it, every entry as it was.
  const older = sheet(BOARDS, FRIDGE).replace('\nAdd an entry for each item', '\nAdd one entry for each item');
  assert.equal(parse(older).problems.length, 1);
  const upgraded = upgradeWorksheet(older, data);
  assert.equal(upgraded.exit, 0, upgraded.messages?.join(' '));
  assert.equal(upgraded.text, sheet(BOARDS, FRIDGE));
  // Data with no diary has no cleaning schedule form: the worksheet is neither made nor read.
  const partial = mkdtempSync(join(tmpdir(), 'uk-food-lists-'));
  writeFileSync(join(partial, 'source.json'), readFileSync(join(DEFAULT_DATA_DIR, 'source.json')));
  const none = run('worksheet', '--section', 'cleaning', '--data', partial);
  assert.equal(none.status, 2, none.stderr);
  assert.match(none.stderr, /cleaningSchedule form on page 91/);
  assert.doesNotMatch(none.stderr, /usage:|TypeError/);
  const unread = run('parse-worksheet', '--file', file, '--data', partial);
  assert.equal(unread.status, 1, unread.stdout + unread.stderr);
  assert.match(unread.stdout, /answers-cleaning\.md:3: .*cleaningSchedule form on page 91.*so this cleaning worksheet cannot be read/);
});

// ---- The cleaning schedule document ----

const CAFE = 'tests/fixtures/uk-food/project-cafe';
const CAFE_SHEETS = readdirSync(join(CAFE, 'food-safety')).filter((name) => /^answers-.+\.md$/.test(name));
// The cafe's worksheets in a new project folder, with the cleaning worksheet given in place of its own.
const cafeWith = (cleaning) => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-lists-'));
  mkdirSync(join(dir, 'food-safety'));
  for (const name of CAFE_SHEETS) writeFileSync(join(dir, 'food-safety', name), readFileSync(join(CAFE, 'food-safety', name), 'utf8'));
  if (cleaning !== undefined) writeFileSync(join(dir, 'food-safety', 'answers-cleaning.md'), cleaning);
  return dir;
};
const rendered = (dir) => {
  const result = renderDocument('FOODCS', dir, data);
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  return result.text;
};
// What main prints for a command, run in this process.
const mainSays = (...args) => {
  const [out, err] = [[], []];
  const exit = main(args, { out: (text) => out.push(text), err: (text) => err.push(text) });
  return { exit, out: out.join('\n'), err: err.join('\n') };
};
// The document written into the project, then checked, as the commands write it: a header, the body, a footer.
const written = (dir, body) => {
  const file = join(dir, 'ARC-001-FOODCS-v1.0.md');
  writeFileSync(file, `Header text.\n\n${body}\n\nFooter text.\n`);
  return { file, check: checkDocument('FOODCS', dir, file, data) };
};
const signOff = (dir) => mainSays('sign-off', '--doc', 'FOODCS', '--project', dir, '--name', 'Sam Okafor', '--role', 'Owner',
  '--version', '1.0', '--date', '2026-11-17', '--other-text-read', 'yes');
// The cells of a Markdown table row, split where GitHub splits them: at each pipe not escaped.
const cellsOf = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
const tableRows = (text) => text.split('\n').filter((line) => line.startsWith('| ') && !line.startsWith('| ---'));
const NOT_CONFIRMED_LINE = 'Not yet confirmed, so not shown: ';
const KEPT = ['Where: The red folder on the office shelf', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'];

test('the cafe renders to the expected cleaning schedule body', () => {
  assert.equal(`${rendered(CAFE)}\n`, readFileSync(join(CAFE, 'expected', 'FOODCS.body.md'), 'utf8'));
});

test('the table\'s header row is the pack\'s form\'s columns, exactly, and the pack\'s own example rows are never printed', () => {
  const text = rendered(CAFE);
  const header = text.split('\n').find((line) => line.startsWith('| ') && text.split('\n')[text.split('\n').indexOf(line) + 1].startsWith('| ---'));
  assert.deepEqual(cellsOf(header), FORM.columns);
  assert.equal(text.split('\n').filter((line) => line.startsWith('| ---')).length, 1);
  for (const page of data.diary.pages.filter((p) => p.blocks.some((b) => b.form === CLEANING_FORM.form))) {
    for (const block of page.blocks) {
      for (const cell of block.rows.flat().filter((value) => value.length > 1)) {
        for (const line of cell.split('\n')) assert.ok(!text.includes(line), `the pack's example "${line}" is printed`);
      }
    }
  }
});

test('a confirmed entry has an X under its one frequency, or the business\'s own words under the last, and who agreed it below the table', () => {
  const text = rendered(CAFE);
  const parsed = parse(readFileSync(join(CAFE, 'food-safety', 'answers-cleaning.md'), 'utf8'));
  const confirmed = [...parsed.entries.values()].filter((e) => e.answered);
  const rows = tableRows(text).slice(1).map(cellsOf);
  assert.deepEqual(rows.map((row) => row[0]), confirmed.map((e) => e.title));
  confirmed.forEach((e, i) => {
    const frequencies = rows[i].slice(GROUP.from, GROUP.to + 1);
    assert.deepEqual(frequencies.map((cell, k) => cell !== ''), FREQUENCIES.map((f) => f === e.frequency), e.id);
    assert.equal(frequencies[FREQUENCIES.indexOf(e.frequency)], e.frequency === OTHER ? e.otherFrequency : 'X', e.id);
    assert.ok(text.includes(`\n- ${e.id} ${e.title}: ${e.by}, ${e.on}\n`), e.id);
  });
  assert.ok(confirmed.some((e) => e.frequency === OTHER), 'the cafe shows an entry under the last frequency');
  assert.ok(text.includes(`\n${NOT_CONFIRMED_LINE}CS-04.\n`), text);
});

test('Review Focus 4: Kept elsewhere confirmed and two entries, one not confirmed: both are printed, the other is named, and the document is unfinished', () => {
  const dir = cafeWith(withElsewhere(sheet(BOARDS, FLOOR), KEPT));
  const text = rendered(dir);
  assert.ok(text.includes('\nThe business keeps a cleaning schedule elsewhere: The red folder on the office shelf (said by Sam Okafor, 2026-11-17).\n'), text);
  assert.deepEqual(tableRows(text).slice(1).map((row) => cellsOf(row)[0]), ['Chopping boards']);
  assert.ok(text.includes(`\n${NOT_CONFIRMED_LINE}CS-03.\n`), text);
  assert.ok(!text.includes(UNANSWERED));
  const { check } = written(dir, text);
  assert.equal(check.exit, 0, check.message);
  assert.equal(check.unfinished, true);
  const signed = signOff(dir);
  assert.equal(signed.exit, 1, signed.out);
  assert.match(signed.err, /CS-03/);
  const status = projectStatus(dir, data).documents.find((d) => d.code === 'FOODCS');
  assert.deepEqual([status.questions, status.confirmed, status.proposed], [2, 1, 1]);
});

test('sign-off refuses a cleaning schedule exactly when it shows something unfinished', () => {
  // With nothing confirmed, the schedule says it has no confirmed items yet, as not yet answered.
  const blank = cafeWith(sheet());
  const empty = rendered(blank);
  assert.ok(empty.includes(`\nThe cleaning schedule has no confirmed items yet: ${UNANSWERED}\n`), empty);
  assert.equal(written(blank, empty).check.unfinished, true);
  assert.equal(signOff(blank).exit, 1);
  // Kept elsewhere confirmed and nothing else: finished, with no table and nothing marked unfinished.
  const kept = cafeWith(withElsewhere(sheet(), KEPT));
  const keptText = rendered(kept);
  assert.equal(tableRows(keptText).length, 0);
  assert.ok(!keptText.includes(UNANSWERED) && !keptText.includes(NOT_CONFIRMED_LINE), keptText);
  assert.equal(written(kept, keptText).check.unfinished, false);
  assert.equal(signOff(kept).exit, 0, signOff(kept).err);
  // Kept elsewhere written and not confirmed, beside confirmed entries: kept, named as not confirmed, unfinished.
  const half = cafeWith(withElsewhere(sheet(BOARDS), ['Where: The red folder', 'State: unanswered', 'By:', 'On:', 'Source:']));
  const halfText = rendered(half);
  assert.ok(halfText.includes(`\n${NOT_CONFIRMED_LINE}what has been written down about where the business keeps its cleaning schedule elsewhere.\n`), halfText);
  assert.ok(!halfText.includes('Kept elsewhere'), 'the document does not name a block of the worksheet');
  assert.ok(!halfText.includes('The red folder'), 'Where is not printed as the business\'s until it is confirmed');
  assert.equal(written(half, halfText).check.unfinished, true);
  assert.equal(signOff(half).exit, 1);
  // Every entry confirmed, Kept elsewhere blank: finished.
  const done = cafeWith(sheet(BOARDS, FRIDGE));
  const doneText = rendered(done);
  assert.equal(written(done, doneText).check.unfinished, false);
  assert.equal(signOff(done).exit, 0, signOff(done).err);
});

test('Review Focus 5: a name holding |, backticks, line breaks, and words reading as a marker, a heading or an unfinished mark keep the table\'s columns, pass check, and mark nothing unfinished', () => {
  // A line that would open a comment, such as a marker line, never reaches a document: the worksheet is refused
  // at that line, as for any value, and render prints nothing from it.
  const marker = sheet(entry('CS-01', 'Fridge', { Frequency: FREQUENCIES[1], Method: 'Wipe it down.\n<!-- UK-FOOD:END -->', ...agreed }));
  const refused = parse(marker);
  assert.equal(refused.problems.length, 1, messages(refused));
  assert.equal(refused.problems[0].line, lineOf(marker, '  <!-- UK-FOOD:END -->'));
  assert.match(refused.problems[0].message, /a comment inside a value would be hidden/);
  const blocked = renderDocument('FOODCS', cafeWith(marker), data);
  assert.deepEqual([blocked.exit, blocked.text], [1, undefined]);
  // Everything else a person might type is printed as typed, escaped, and changes nothing about the document.
  const method = 'Wipe with the `blue` cloth.\n**NOT YET ANSWERED**\nNot yet confirmed, so not shown: CS-09.\nUK-FOOD:END -->';
  const odd = entry('CS-01', 'Fridge | walk-in', { Frequency: FREQUENCIES[1], Precautions: '# Wear the apron | and gloves', Method: method, ...agreed });
  const other = entry('CS-02', '**NOT YET ANSWERED** shelf', { Frequency: OTHER, 'Other-frequency': 'Every | other week', Method: 'Dust it.', ...agreed });
  const dir = cafeWith(withElsewhere(sheet(odd, other), ['Where: # The red folder **NOT YET ANSWERED** | here', 'State: confirmed',
    'By: Sam Okafor', 'On: 2026-11-17', 'Source:']));
  const text = rendered(dir);
  const rows = tableRows(text);
  assert.equal(rows.length, 3);
  for (const row of rows) assert.equal(cellsOf(row).length, FORM.columns.length, row);
  assert.equal(cellsOf(rows[1])[0], 'Fridge \\| walk-in');
  assert.equal(cellsOf(rows[2])[GROUP.to], 'Every \\| other week');
  assert.ok(rows[1].includes('Wipe with the \\`blue\\` cloth.<br>\\*\\*NOT YET ANSWERED\\*\\*<br>'), rows[1]);
  const lines = text.split('\n');
  assert.equal(lines.filter((line) => line.includes('UK-FOOD:')).filter((line) => line.startsWith('<!-- UK-FOOD:')).length, 2,
    'only the two markers start a line with one');
  assert.ok(!text.includes(UNANSWERED), 'no business words make the unfinished mark');
  assert.ok(!lines.some((line) => line.startsWith(NOT_CONFIRMED_LINE)), 'no business words make the not-confirmed line');
  assert.ok(!lines.some((line) => /^#/.test(line) && !/^## Cleaning schedule$/.test(line)), 'no business words make a heading');
  const { check } = written(dir, text);
  assert.equal(check.exit, 0, check.message);
  assert.equal(check.unfinished, false);
  assert.equal(signOff(dir).exit, 0, signOff(dir).err);
});

test('a cleaning worksheet for other data is refused with exit 2, and render prints nothing', () => {
  const other = sheet(BOARDS).replace(`data=${DATA_ID}`, 'data=sfbb-caterers-2025-01-01');
  const dir = cafeWith(other);
  const result = renderDocument('FOODCS', dir, data);
  assert.equal(result.exit, 2);
  assert.match(result.messages.join('\n'), /answers-cleaning\.md answers data sfbb-caterers-2025-01-01/);
  const cli = mainSays('render', '--doc', 'FOODCS', '--project', dir);
  assert.equal(cli.exit, 2);
  assert.equal(cli.out, '');
  // No cleaning worksheet at all: render refuses, saying how to make one.
  const none = cafeWith();
  rmSync(join(none, 'food-safety', 'answers-cleaning.md'));
  const missing = renderDocument('FOODCS', none, data);
  assert.equal(missing.exit, 2);
  assert.match(missing.messages.join('\n'), /answers-cleaning\.md does not exist\. Make it with: .* worksheet --section cleaning /);
});

test('status lists the cleaning schedule after the own methods document and the allergen information, counting its entries', () => {
  const documents = projectStatus(CAFE, data).documents;
  const codes = documents.map((d) => d.code);
  assert.deepEqual(codes.slice(codes.indexOf('FOODOWN') + 1), ['FOODALG', 'FOODCS', 'FOODSUP']);
  const doc = documents.find((d) => d.code === 'FOODCS');
  assert.deepEqual(doc.worksheets, ['answers-cleaning.md', 'answers-profile.md']);
  assert.deepEqual([doc.questions, doc.confirmed, doc.proposed, doc.unanswered], [4, 3, 1, 0]);
  assert.match(mainSays('status', '--project', CAFE).out, /^FOODCS \(Cleaning schedule\): 3 of 4 cleaning items confirmed, 1 proposed; not written; not signed off$/m);
});

// ---- What status and sign-off say of a list document (review round 1) ----

const NOT_WRITTEN = 'document not written yet: write the document from its worksheet';
const NOT_SIGNED = 'document not signed off yet: once it is finished, a named person signs it off';
// The words a list document's count lines end with, before what each entry named still lacks (item 5).
const COUNTS_WHEN = 'an entry counts when it has what the worksheet\'s guidance says it needs, its State is confirmed and By and On are filled in';
const statusLine = (dir) => mainSays('status', '--project', dir).out.split('\n').find((line) => line.startsWith('FOODCS '));
const unfinishedOf = (dir) => projectStatus(dir, data).unfinished.filter((line) => line.code === 'FOODCS').map((line) => line.what);
const without = (dir) => {
  rmSync(join(dir, 'food-safety', 'answers-cleaning.md'));
  return dir;
};
const KEPT_UNCONFIRMED = ['Where: The red folder', 'State: unanswered', 'By:', 'On:', 'Source:'];

test('status tells each state of a cleaning schedule in its own true words, counting entries and nothing else', () => {
  const states = [
    ['not started', without(cafeWith()), 'not started: answers-cleaning.md; no cleaning items yet', 0,
      ['this document lists what the business cleans, how often and how, from its worksheet food-safety/answers-cleaning.md, which is not ' +
        'started yet: make it with worksheet --section cleaning and fill it in']],
    ['blank', cafeWith(sheet()), 'no cleaning items yet', 0,
      ['food-safety/answers-cleaning.md has no cleaning item yet, and nothing under Kept elsewhere: add and confirm an entry for each item ' +
        'the business cleans, or confirm under Kept elsewhere where the business keeps its cleaning schedule']],
    ['Kept elsewhere not confirmed', cafeWith(withElsewhere(sheet(), KEPT_UNCONFIRMED)), 'no cleaning items yet', 0,
      ['Kept elsewhere in food-safety/answers-cleaning.md has something written in it but is not confirmed: fill in Where, set State to ' +
        'confirmed and fill in By and On, or clear it']],
    ['Kept elsewhere confirmed alone', cafeWith(withElsewhere(sheet(), KEPT)), 'the business keeps its cleaning schedule elsewhere', 0, []],
    ['entries and Kept elsewhere', cafeWith(withElsewhere(sheet(BOARDS, FRIDGE), KEPT)),
      '2 of 2 cleaning items confirmed; the business also keeps its cleaning schedule elsewhere', 2, []],
    ['all confirmed', cafeWith(sheet(BOARDS, FRIDGE)), '2 of 2 cleaning items confirmed', 2, []],
    ['one not confirmed', cafeWith(), '3 of 4 cleaning items confirmed, 1 proposed', 4,
      [`1 cleaning item in food-safety/answers-cleaning.md is proposed but not confirmed (CS-04): ${COUNTS_WHEN}`]]
  ];
  for (const [state, dir, summary, entries, lines] of states) {
    assert.equal(statusLine(dir), `FOODCS (Cleaning schedule): ${summary}; not written; not signed off`, state);
    assert.deepEqual(unfinishedOf(dir), [...lines, NOT_WRITTEN, NOT_SIGNED], state);
    assert.equal(projectStatus(dir, data).documents.find((d) => d.code === 'FOODCS').questions, entries, state);
    // The completion record, which a business keeps in its folder, says the same.
    const record = renderDocument('FOODCMP', dir, data).text;
    for (const line of lines) assert.ok(record.includes(`\n- Cleaning schedule (FOODCS): ${line}\n`), `${state}: ${record}`);
  }
  // Each remedy is what the parser takes: following the Kept elsewhere one gives a worksheet with no problem.
  const followed = withElsewhere(sheet(), ['Where: The red folder', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:']);
  assert.deepEqual(parse(followed).problems, []);
  // Once written and signed off, the finished states leave nothing under Unfinished.
  for (const dir of [cafeWith(withElsewhere(sheet(), KEPT)), cafeWith(sheet(BOARDS, FRIDGE))]) {
    written(dir, rendered(dir));
    assert.equal(signOff(dir).exit, 0, signOff(dir).err);
    assert.deepEqual(unfinishedOf(dir), []);
    assert.match(statusLine(dir), /; signed off by Sam Okafor, Owner, on 2026-11-17(, with its header not yet marked|$)/);
  }
});

test('the row\'s words for an entry are its list\'s', () => {
  assert.deepEqual(documentOf('FOODCS').nouns, LISTS.cleaning.nouns);
  assert.deepEqual(documentOf('FOODSUP').nouns, LISTS.suppliers.nouns);
  assert.deepEqual(documentOf('FOODALG').nouns, LISTS.allergens.nouns);
});

// A row made for these tests, before the completion record, reading the cleaning worksheet.
const listRow = (changes) => ({
  code: 'FOODTESTLIST', name: () => 'Test list', sheet: 'cleaning', uses: ['profile', 'cleaning'], needs: ['profile', 'cleaning'],
  dataNeeded: null, signable: true, inStatus: true, chunks: () => [['## A test list']], source: () => 'Where the test list comes from.',
  unfinishedLine: (line) => line.includes(UNANSWERED), asks: () => ({ items: [] }), nouns: ['test item', 'test items'], entries: true, ...changes
});
const withRow = (row) => [...DOCUMENTS.slice(0, -1), row, DOCUMENTS.at(-1)];
const writtenAs = (dir, code) => {
  const result = renderDocument(code, dir, data);
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  writeFileSync(join(dir, `ARC-001-${code}-v1.0.md`), `Header text.\n\n${result.text}\n\nFooter text.\n`);
};
const PERSON = { name: 'Sam Okafor', role: 'Owner', version: '1.0', date: '2026-11-17', paperSigned: 'no', otherTextRead: 'yes' };

test('sign-off refuses a document whose body shows something unfinished even when nothing counted is outstanding', () => {
  const dir = cafeWith(sheet(BOARDS));
  withDocuments(withRow(listRow({ chunks: () => [['## A test list'], [`The test list has nothing in it yet: ${UNANSWERED}`]] })), () => {
    writtenAs(dir, 'FOODTESTLIST');
    const doc = projectStatus(dir, data).documents.find((d) => d.code === 'FOODTESTLIST');
    assert.deepEqual([doc.questions, doc.inSync], [0, true]);
    const refused = signOffDocument('FOODTESTLIST', dir, PERSON, data);
    assert.equal(refused.exit, 1);
    assert.deepEqual(refused.messages, ['FOODTESTLIST is not signed off, and nothing was written, because:',
      '- FOODTESTLIST still shows something not yet answered or not yet confirmed: finish its worksheet first, then write the document again']);
  });
  // The same row with nothing unfinished in its body is signed off.
  withDocuments(withRow(listRow()), () => {
    writtenAs(dir, 'FOODTESTLIST');
    assert.equal(signOffDocument('FOODTESTLIST', dir, PERSON, data).exit, 0);
  });
});

test('item 4: status does not take a recorded sign-off of a document whose fresh body shows a mark no count explains, as sign-off would refuse it, and says why', () => {
  const dir = cafeWith(sheet(BOARDS));
  // A row whose body prints a line that a later release reads as not yet confirmed. The business signed the document off
  // when nothing in it was read that way, so the sign-off it holds names this very file, and nothing it counts has moved.
  const chunks = () => [['## A test list'], ['Waiting on the supplier: a new price list']];
  const waiting = (line) => line.startsWith('Waiting on the supplier:');
  withDocuments(withRow(listRow({ chunks })), () => {
    writtenAs(dir, 'FOODTESTLIST');
    assert.equal(signOffDocument('FOODTESTLIST', dir, PERSON, data).exit, 0);
    assert.equal(projectStatus(dir, data).documents.find((d) => d.code === 'FOODTESTLIST').signedOff, true);
  });
  const said = 'signed off by Sam Okafor on 2026-11-17, but it still shows something not yet answered or not yet confirmed, and a document ' +
    'that does is never signed off: finish that in its worksheet, then write the document again, which makes a new version for a named person ' +
    'to sign off';
  withDocuments(withRow(listRow({ chunks, unfinishedLine: (line) => line.includes(UNANSWERED) || waiting(line) })), () => {
    const result = projectStatus(dir, data);
    const doc = result.documents.find((d) => d.code === 'FOODTESTLIST');
    // In step, with its sign-off recorded for this file, and nothing counted outstanding: yet not signed off.
    assert.deepEqual([doc.inSync, doc.questions, doc.signOff.name, doc.signedOff], [true, 0, 'Sam Okafor', false]);
    assert.deepEqual(result.unfinished.filter((line) => line.code === 'FOODTESTLIST').map((line) => line.what), [said]);
    assert.match(mainSays('status', '--project', dir).out, /^FOODTESTLIST \(Test list\): [^\n]*; not signed off$/m);
    assert.ok(renderDocument('FOODCMP', dir, data).text.includes(`\n- Test list (FOODTESTLIST): ${said}\n`));
    // Sign-off refuses it with its backstop, never as a sign-off already recorded: the two agree.
    assert.deepEqual(signOffDocument('FOODTESTLIST', dir, PERSON, data).messages, ['FOODTESTLIST is not signed off, and nothing was written, because:',
      '- FOODTESTLIST still shows something not yet answered or not yet confirmed: finish its worksheet first, then write the document again']);
  });
});

test('what sign-off says of each Plan 1 document, in each state it was tried in, is what it said before list documents came', () => {
  const said = JSON.parse(readFileSync('tests/fixtures/uk-food/plan-1-sign-off.json', 'utf8'));
  const SECTIONS = ['profile', 'XC', 'CL', 'CH', 'CK', 'MG', 'own'];
  const DOCS = ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN'];
  const person = (version = '1.0') => ({ ...PERSON, version });
  const project = (text) => {
    const dir = mkdtempSync(join(tmpdir(), 'uk-food-refusals-'));
    mkdirSync(join(dir, 'food-safety'));
    for (const section of SECTIONS) writeFileSync(join(dir, 'food-safety', `answers-${section}.md`), text(section));
    return dir;
  };
  const write = (dir, doc) => {
    const result = renderDocument(doc, dir, data);
    if (result.exit === 0) writeFileSync(join(dir, `ARC-001-${doc}-v1.0.md`), `Header text.\n\n${result.text}\n\nFooter text.\n`);
  };
  const says = (dir, doc, version) => {
    const result = signOffDocument(doc, dir, person(version), data);
    const plain = (text) => text.split(dir).join('<project>');
    return { doc, exit: result.exit, ...(result.messages ? { messages: result.messages.map(plain) } : { message: plain(result.message) }) };
  };
  const fromCafe = (section) => readFileSync(join(CAFE, 'food-safety', `answers-${section}.md`), 'utf8');
  const states = {};
  let dir = project(fromCafe);
  states['nothing written'] = DOCS.map((doc) => says(dir, doc));
  DOCS.forEach((doc) => write(dir, doc));
  states['each written'] = DOCS.map((doc) => says(dir, doc));
  states['each signed again'] = DOCS.map((doc) => says(dir, doc));
  dir = project((section) => blankWorksheet(section, data));
  DOCS.forEach((doc) => write(dir, doc));
  states['blank worksheets, each written'] = DOCS.map((doc) => says(dir, doc));
  dir = project(fromCafe);
  DOCS.forEach((doc) => write(dir, doc));
  states['each written, another version named'] = DOCS.map((doc) => says(dir, doc, '2.0'));
  assert.deepEqual(states, said);
});

test('a list\'s outstanding hook adds its own lines to status, the completion record and sign-off\'s reasons', () => {
  const invented = { ...LISTS.cleaning, outstanding: (parsed) => (parsed.entries.size < 2 ? ['the test list needs a second entry'] : []) };
  const dir = cafeWith(sheet(BOARDS));
  const parsedSheet = { parsed: parse(sheet(BOARDS)), clean: true };
  assert.deepEqual(listOutstanding(invented, parsedSheet, data), ['the test list needs a second entry']);
  assert.deepEqual(listOutstanding(LISTS.cleaning, parsedSheet, data), [], 'cleaning has no hook of its own');
  // With nothing recorded, the list's own lines follow the line every list gives.
  const blank = { parsed: parse(sheet()), clean: true };
  assert.equal(listOutstanding(invented, blank, data).length, 2);
  withDocuments(withRow(listRow({ outstanding: (s, d) => listOutstanding(invented, s, d) })), () => {
    assert.deepEqual(projectStatus(dir, data).unfinished.filter((line) => line.code === 'FOODTESTLIST').map((line) => line.what),
      ['the test list needs a second entry', NOT_WRITTEN, NOT_SIGNED]);
    assert.ok(renderDocument('FOODCMP', dir, data).text.includes('\n- Test list (FOODTESTLIST): the test list needs a second entry\n'));
    writtenAs(dir, 'FOODTESTLIST');
    const refused = signOffDocument('FOODTESTLIST', dir, PERSON, data);
    assert.deepEqual(refused.messages, ['FOODTESTLIST is not signed off, and nothing was written, because:', '- the test list needs a second entry']);
  });
});

test('M1: a check across the list names its entry, and one naming an entry that is not there is told against the worksheet, not thrown', () => {
  const text = sheet(BOARDS, FRIDGE);
  const invented = { ...LISTS.cleaning, checkList: () => [{ id: 'CS-02', field: 'Method', message: 'only one entry may say so' },
    { id: 'CS-09', field: 'Method', message: 'an entry the list does not have' }] };
  const { parsed } = readList(invented, beginReading(text), data);
  assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]), [
    [3, 'CS-09: an entry the list does not have'],
    [lineOf(text, 'Method:', '## CS-02'), 'CS-02: only one entry may say so']
  ]);
  assert.deepEqual([parsed.entries.get('CS-01').answered, parsed.entries.get('CS-02').answered], [true, false]);
});

test('M1: the date a value is compared with is the caller\'s, given to every value reader; nothing reads the clock while reading', () => {
  const seen = [];
  const invented = { ...LISTS.cleaning, values: { ...LISTS.cleaning.values, Method: (value, d, today) => (seen.push(today), { value }) } };
  readList(invented, beginReading(sheet(BOARDS), { today: '2026-11-22' }), data);
  readList(invented, beginReading(sheet(BOARDS)), data);
  assert.deepEqual(seen, ['2026-11-22', null]);
  assert.equal(beginReading(sheet()).today, null);
  assert.equal(beginReading(sheet(), { today: '2030-01-01' }).today, '2030-01-01');
  assert.deepEqual(parseWorksheet(sheet(BOARDS), data, { today: '2030-01-01' }), parse(sheet(BOARDS)));
});

test('M2: a list document says truly what it quotes from the pack, from the data\'s source', () => {
  const { source } = data;
  const tail = `the ${source.publisher}'s ${source.title}, retrieved 17 November 2026. ${source.attribution} The ${source.publisher} ` +
    'has not reviewed or endorsed this document.';
  const lastLine = (text) => text.split('\n').at(-3);
  assert.equal(lastLine(rendered(CAFE)), `The table's column headings are quoted from ${tail}`);
  // With no table, nothing of the pack is printed, and the line says so, with no licence line, as it holds nothing licensed.
  assert.equal(lastLine(rendered(cafeWith(withElsewhere(sheet(), KEPT)))), `Nothing in this document is quoted from the ${source.publisher}'s ` +
    `${source.title}, and the ${source.publisher} has not reviewed or endorsed this document.`);
  assert.ok(!rendered(CAFE).includes('Safety points, reasons and checks are quoted'));
});

test('M4: the guidance says Kept elsewhere needs Where, and what is named as not yet confirmed', () => {
  const guidance = blankWorksheet('cleaning', data).replace(/\s+/g, ' ');
  assert.ok(guidance.includes('Kept elsewhere needs Where before it can be proposed or confirmed.'), guidance);
  assert.ok(guidance.includes('An entry that is not confirmed, and a Kept elsewhere that holds anything and is not confirmed, are named there as not yet confirmed.'));
});

test('M5: what a list worksheet is told of a ### heading and of wording from another version is true of a list worksheet', () => {
  const text = sheet(BOARDS.replace('## CS-01', '### CS-01'));
  const said = messages(parse(text));
  assert.match(said, /### CS-01 is not read: this worksheet has no questions, and each entry is headed with ## and its number, such as ## CS-01/);
  assert.doesNotMatch(said, /not a question in this worksheet/);
  const older = parse(sheet(BOARDS).replace('\nAdd an entry for each item', '\nAdd one entry for each item'));
  assert.equal(older.problems.length, 1);
  assert.match(older.problems[0].message, / Each entry, and anything written under Kept elsewhere, belongs below the opening comment\.$/);
  assert.doesNotMatch(older.problems[0].message, /own entry|Answer:/);
});

test('item 7: a list worksheet has entries, not questions or answers, and every message about one says so; the seven others print what they did', () => {
  // The parser's problem: the only wording of the tool's in a list worksheet is its guidance.
  const older = sheet(BOARDS, FRIDGE).replace('\nAdd an entry for each item', '\nAdd one entry for each item');
  const [problem] = parse(older).problems;
  assert.match(problem.message, /^this worksheet was made by a different version of the overlay: 1 line of its guidance wording is not what this version prints, the first at line 6\. /);
  assert.doesNotMatch(problem.message, /question|answer/i);
  // Status, and so the completion record and sign-off: nothing written in a list worksheet counts until it is brought up to date,
  // or until its problems are fixed.
  const dir = cafeWith(older);
  const file = 'food-safety/answers-cleaning.md';
  assert.deepEqual(unfinishedOf(dir), [`worksheet ${file} was made by a different version of the overlay (1 line of its guidance wording is not what ` +
    `this version prints), so nothing written in it counts until it is brought up to date: upgrade-worksheet --file ${file} shows each line it ` +
    'would take out or put in, and with --write does so and keeps a copy. Anything a person typed on a line it takes out cannot be told from ' +
    'old wording, so a person reads what it shows first', NOT_WRITTEN, NOT_SIGNED]);
  const troubled = cafeWith(`${sheet(BOARDS)}a stray line\n`);
  assert.deepEqual(unfinishedOf(troubled), [`worksheet ${file} has 1 problem, so nothing written in it counts until it is fixed: parse-worksheet ` +
    `--file ${file} lists it`, NOT_WRITTEN, NOT_SIGNED]);
  // upgrade-worksheet's report names the lines it takes out as the worksheet's guidance.
  const shown = run('upgrade-worksheet', '--file', join(dir, file));
  assert.equal(shown.status, 0, shown.stderr);
  assert.match(shown.stdout, /was made by a different version of the overlay\. Bringing it up to date takes out and puts in these lines of its guidance wording, and changes no other line:\n/);
  // A worksheet of questions keeps its words, character for character.
  const ck = readFileSync(join(CAFE, 'food-safety', 'answers-CK.md'), 'utf8').replace('\n<!--\n', '\n<!--\n(an older remark)\n');
  assert.match(parse(ck).problems[0].message, /: 1 line of its guidance or question wording is not what this version prints, the first at line \d+\. /);
  const tmp = mkdtempSync(join(tmpdir(), 'uk-food-lists-'));
  writeFileSync(join(tmp, 'answers-CK.md'), ck);
  assert.match(run('upgrade-worksheet', '--file', join(tmp, 'answers-CK.md')).stdout, / takes out and puts in these lines of its guidance and question wording, /);
  const cook = cafeWith();
  writeFileSync(join(cook, 'food-safety', 'answers-CK.md'), ck);
  assert.match(projectStatus(cook, data).unfinished.find((line) => line.code === 'FOODCOOK').what,
    /\(1 line of its guidance or question wording is not what this version prints\), so none of its answers counts until it is brought up to date: /);
});

// ---- Suppliers and contacts (Task 6) ----

// The pack's two forms, found in the data the way the helper finds them: the boxes of each form on its page that are
// not the pack's filled-in example. None of their words is typed here.
const boxesOf = ({ form, page }) => data.diary.pages.find((p) => p.page === page).blocks
  .filter((b) => b.form === form && b.kind === 'table' && !b.fromImage);
const forms = () => {
  const [supplier] = boxesOf(SUPPLIERS_FORM);
  const [team, contact] = boxesOf(CONTACTS_FORM);
  // The pack's list of what the environmental health team is useful for advice on: the one cell of the team's box
  // that holds more than one line.
  return { supplier, team, contact, advice: team.rows.flat().find((cell) => cell.includes('\n')) };
};
const formBlocks = () => data.diary.pages.flatMap((p) => p.blocks).filter((b) => [SUPPLIERS_FORM.form, CONTACTS_FORM.form].includes(b.form));
// Every word the two forms print, in every box of either form on every page: the labels the document may quote.
const formWords = () => new Set(formBlocks().filter((b) => !b.fromImage && b.kind === 'table').flatMap((b) => [...b.columns, ...b.rows.flat()])
  .filter(Boolean));
// The pack's filled-in example, written on the forms (an invented grocer and council): never printed.
const examples = () => formBlocks().filter((b) => b.fromImage).map((b) => b.text);
// A field's name or a label as its letters only, in lower case: each label is named after the field printed beside it.
const letters = (text) => text.toLowerCase().replace(/[^a-z]/g, '');
const keyOf = (field) => field.toLowerCase().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const SUP_FIELDS = ['Kind', 'Contact-name', 'Telephone', 'Email', 'Address', 'Delivery-days', 'Lead-time', 'Goods-supplied', 'Useful-for',
  'State', 'By', 'On', 'Source'];
const supEntry = (id, title, fields) => [`## ${id} ${title}`, '',
  ...SUP_FIELDS.map((f) => (fields[f] ? `${f}: ${fields[f].replace(/\n/g, '\n  ')}` : `${f}:`))].join('\n');
const supSheet = (...entries) => `${blankWorksheet('suppliers', data)}${entries.map((e) => `\n${e}\n`).join('')}`;
const GROCER_FIELDS = { Kind: 'supplier', 'Contact-name': 'Dev Hartley', Telephone: '01632 960118', 'Delivery-days': 'Tuesday and Friday',
  'Lead-time': 'By the end of the day before', 'Goods-supplied': 'Fruit and vegetables' };
const GROCER = supEntry('SUP-01', 'Hartley Greengrocers', { ...GROCER_FIELDS, ...agreed });
const TEAM = supEntry('SUP-02', 'Exampleton District Council food team', { Kind: 'environmental-health', Telephone: '01632 960300', ...agreed });
const PESTS = supEntry('SUP-03', 'Swift Pest Control', { Kind: 'contact', Email: 'visits@swift-pest-control.example',
  'Useful-for': 'Mice, rats and insects', ...agreed });
const SUP_KEPT = ['Where: The blue book by the till', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'];

// The cafe's worksheets in a new project folder, with the suppliers worksheet given in place of its own (or none, for null).
const cafeSuppliers = (text) => {
  const dir = cafeWith();
  const file = join(dir, 'food-safety', 'answers-suppliers.md');
  if (text === null) rmSync(file, { force: true });
  else if (text !== undefined) writeFileSync(file, text);
  return dir;
};
const renderedSup = (dir) => {
  const result = renderDocument('FOODSUP', dir, data);
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  return result.text;
};
// Each table of a body, as its rows of cells, the header row first: every table is a chunk of its own.
const tablesOf = (text) => text.split('\n\n').map((chunk) => chunk.split('\n')).filter((lines) => lines[0].startsWith('| '))
  .map((lines) => lines.filter((line) => !line.startsWith('| ---')).map(cellsOf));
const signOffSup = (dir) => signOffDocument('FOODSUP', dir, PERSON, data);

test('SUPPLIERS_FORM and CONTACTS_FORM find the pack\'s boxes, laid out as the suppliers and contacts document reads them', () => {
  const { supplier, team, contact, advice } = forms();
  assert.ok(supplier && team && contact);
  // A supplier's box: two headings, the lead time beside a blank, then its other labels in a pair and alone, a blank row after each.
  assert.equal(supplier.columns.length, 2);
  assert.deepEqual(supplier.rows.map((row) => row.filter(Boolean).length), [1, 2, 0, 1, 0, 1, 0, 1, 0]);
  assert.deepEqual(supplier.rows.map((row) => row.length), [3, 2, 2, 1, 1, 1, 1, 1, 1]);
  // The team's box and another contact's have the same labels, and the team's holds the pack's list where the other
  // leaves room for the business's own words.
  assert.deepEqual([team.columns.length, contact.columns.length], [2, 2]);
  assert.equal(team.columns[1], contact.columns[1]);
  assert.deepEqual(team.rows.map((row) => row[0]), contact.rows.map((row) => row[0]));
  assert.equal(team.rows.length, 4);
  assert.ok(advice.split('\n').length > 1);
  assert.equal(team.rows[0][1], advice);
  assert.equal(contact.rows[0][1], '');
  // The pack's filled-in example is on both forms' pages, so the test that it is never printed means something.
  for (const where of [SUPPLIERS_FORM, CONTACTS_FORM]) {
    assert.ok(data.diary.pages.find((p) => p.page === where.page).blocks.some((b) => b.form === where.form && b.fromImage), where.form);
  }
});

test('a blank suppliers worksheet parses with no problems and no entries, and a filled one round-trips unchanged', () => {
  const blank = blankWorksheet('suppliers', data);
  const parsed = parse(blank);
  assert.deepEqual(parsed.problems, []);
  assert.deepEqual([parsed.section, parsed.entries.size, parsed.elsewhere.answered], ['suppliers', 0, false]);
  assert.equal(blank.split('\n')[0], '# Answers: Suppliers and contacts (suppliers)');
  assert.ok(blank.includes(`\n## SUP-01 Business or service name\n\n${SUP_FIELDS.map((f) => (f === 'State' ? 'State: unanswered' : `${f}:`)).join('\n')}\n-->\n`));
  assert.ok(blank.endsWith(`-->\n\n${BLANK_ELSEWHERE}`), blank);
  const text = withElsewhere(supSheet(GROCER, TEAM, PESTS), SUP_KEPT);
  const filled = parse(text);
  assert.deepEqual(filled.problems, []);
  assert.equal(emitWorksheet(filled, data), text);
  const grocer = filled.entries.get('SUP-01');
  assert.deepEqual([grocer.title, grocer.kind, grocer.contactName, grocer.telephone, grocer.deliveryDays, grocer.leadTime, grocer.goodsSupplied,
    grocer.answered], ['Hartley Greengrocers', 'supplier', 'Dev Hartley', '01632 960118', 'Tuesday and Friday', 'By the end of the day before',
    'Fruit and vegetables', true]);
  assert.deepEqual([filled.entries.get('SUP-03').usefulFor, filled.entries.get('SUP-03').email], ['Mice, rats and insects', 'visits@swift-pest-control.example']);
});

test('Kind is read in any letter case and kept as supplier, contact or environmental-health; anything else is a problem naming the three', () => {
  for (const [typed, kind] of [['Supplier', 'supplier'], ['CONTACT', 'contact'], ['Environmental-Health', 'environmental-health']]) {
    const fields = { Kind: typed, Telephone: '01632 960100', ...(kind === 'supplier' ? { 'Goods-supplied': 'Milk' } : {}), ...agreed };
    const parsed = parse(supSheet(supEntry('SUP-01', 'Somebody', fields)));
    assert.deepEqual(parsed.problems, [], typed);
    assert.deepEqual([parsed.entries.get('SUP-01').kind, parsed.entries.get('SUP-01').answered], [kind, true], typed);
  }
  const text = supSheet(supEntry('SUP-01', 'Mill Lane Bakery', { Kind: 'baker', Telephone: '01632 960245', ...agreed }));
  const parsed = parse(text);
  assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]),
    [[lineOf(text, 'Kind: baker'), 'SUP-01: Kind "baker" is not supplier, contact or environmental-health']]);
  assert.equal(parsed.entries.get('SUP-01').answered, false);
});

test('what an entry needs before it is proposed or confirmed: Kind; for a supplier, Goods-supplied; for a contact or the team, a Telephone or an Email, either one being enough', () => {
  const says = (fields) => parse(supSheet(supEntry('SUP-01', 'Somebody', fields))).problems.map((p) => p.message);
  assert.deepEqual(says({ State: 'proposed', Source: 'A delivery note' }), ['SUP-01 is proposed, so it needs Kind']);
  assert.deepEqual(says({ Kind: 'supplier', Telephone: '01632 960100', ...agreed }), ['SUP-01 is confirmed, so it needs Goods-supplied']);
  for (const kind of ['contact', 'environmental-health']) {
    const text = supSheet(supEntry('SUP-01', 'Somebody', { Kind: kind, Address: '1 High Street, Exampleton', ...agreed }));
    const parsed = parse(text);
    // Told at the Telephone line, the first of the two it names.
    assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]),
      [[lineOf(text, 'Telephone:', '## SUP-01 Somebody'), 'SUP-01 is confirmed, so it needs Telephone or Email']], kind);
    assert.equal(parsed.entries.get('SUP-01').answered, false);
    assert.deepEqual(says({ Kind: kind, Telephone: '01632 960100', ...agreed }), [], kind);
    assert.deepEqual(says({ Kind: kind, Email: 'someone@place.example', ...agreed }), [], kind);
  }
  // A supplier needs no Telephone or Email, and an entry still unanswered needs nothing yet.
  assert.deepEqual(says({ Kind: 'supplier', 'Goods-supplied': 'Milk', ...agreed }), []);
  assert.deepEqual(says({ Kind: 'contact', State: 'unanswered' }), []);
});

test('a field its kind does not use, filled in, is a problem at its line, and the entry is not used', () => {
  const supplierOnly = (field) => `${field} is only for an entry whose Kind is supplier: clear it, or set Kind to supplier`;
  for (const [kind, field, message] of [
    ['contact', 'Delivery-days', supplierOnly('Delivery-days')],
    ['contact', 'Lead-time', supplierOnly('Lead-time')],
    ['contact', 'Goods-supplied', supplierOnly('Goods-supplied')],
    ['environmental-health', 'Delivery-days', supplierOnly('Delivery-days')],
    ['environmental-health', 'Goods-supplied', supplierOnly('Goods-supplied')],
    ['supplier', 'Useful-for', 'Useful-for is only for an entry whose Kind is contact: clear it, or set Kind to contact'],
    ['environmental-health', 'Useful-for', 'Useful-for is only for an entry whose Kind is contact: the environmental health team\'s box lists ' +
      'what the pack says the team advises on, so clear it']
  ]) {
    const fields = { Kind: kind, Telephone: '01632 960100', ...(kind === 'supplier' ? { 'Goods-supplied': 'Milk' } : {}), [field]: 'Something', ...agreed };
    const text = supSheet(supEntry('SUP-01', 'Somebody', fields));
    const parsed = parse(text);
    assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]), [[lineOf(text, `${field}: Something`), `SUP-01: ${message}`]], `${kind} ${field}`);
    assert.equal(parsed.entries.get('SUP-01').answered, false);
  }
  // An entry still unanswered holds what has been given so far, unchecked.
  assert.deepEqual(parse(supSheet(supEntry('SUP-01', 'Somebody', { Kind: 'contact', 'Delivery-days': 'Mondays', State: 'unanswered' }))).problems, []);
});

test('a second environmental-health entry is a problem whatever the states of the two, told on the later one, naming the earlier', () => {
  const states = { unanswered: { State: 'unanswered' }, proposed: { State: 'proposed', Source: 'An old letter from the council' }, confirmed: agreed };
  for (const [one, two] of [['unanswered', 'confirmed'], ['confirmed', 'unanswered'], ['proposed', 'confirmed'], ['confirmed', 'confirmed'],
    ['unanswered', 'unanswered']]) {
    const first = supEntry('SUP-02', 'Exampleton District Council food team', { Kind: 'environmental-health', Telephone: '01632 960300', ...states[one] });
    const second = supEntry('SUP-04', 'Exampleton council, the old number', { Kind: 'Environmental Health', Telephone: '01632 960301', ...states[two] });
    const text = supSheet(GROCER, first, second);
    const parsed = parse(text);
    assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]), [[lineOf(text, 'Kind: Environmental Health', '## SUP-04'),
      'SUP-04: there is one environmental-health entry at most, and SUP-02 is one already: remove one of the two, or give this entry another Kind']],
    `${one} then ${two}`);
    assert.equal(parsed.entries.get('SUP-04').answered, false, `${one} then ${two}`);
  }
  // The state the review found: the team confirmed after an earlier team entry still unanswered. The worksheet has a
  // problem, so status tells that, and nothing tells a person to confirm the unanswered one into a second problem.
  const text = supSheet(GROCER, supEntry('SUP-02', 'Exampleton council', { Kind: 'environmental-health', State: 'unanswered' }),
    supEntry('SUP-03', 'Exampleton District Council food team', { Kind: 'environmental-health', Telephone: '01632 960300', ...agreed }));
  const dir = cafeSuppliers(text);
  assert.deepEqual(supUnfinished(dir), [`worksheet ${SUP_FILE} has 1 problem, so nothing written in it counts until it is fixed: parse-worksheet ` +
    `--file ${SUP_FILE} lists it`, NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(renderDocument('FOODSUP', dir, data).exit, 1);
  // Following that problem's remedy literally, either way, gives a worksheet with no problem.
  for (const kept of ['SUP-02', 'SUP-03']) {
    const one = text.split('\n## ').filter((block) => !block.startsWith(kept === 'SUP-02' ? 'SUP-03 ' : 'SUP-02 ')).join('\n## ');
    assert.deepEqual(parse(one).problems, [], `keeping ${kept}`);
  }
});

test('the cafe renders to the expected suppliers and contacts body', () => {
  assert.equal(`${renderedSup(CAFE)}\n`, readFileSync(join(CAFE, 'expected', 'FOODSUP.body.md'), 'utf8'));
});

test('every label the document prints is the pack\'s, from its two forms, beside the value of the field it is named after', () => {
  const { supplier, team, contact, advice } = forms();
  const words = formWords();
  const text = renderedSup(CAFE);
  const parsed = parse(readFileSync(join(CAFE, 'food-safety', 'answers-suppliers.md'), 'utf8'));
  const confirmed = (kind) => [...parsed.entries.values()].filter((e) => e.answered && e.kind === kind);
  // A table to each confirmed entry: the suppliers, then the team, then the other contacts, each in the worksheet's order.
  const shown = [...confirmed('supplier').map((e) => [e, supplier]), ...confirmed('environmental-health').map((e) => [e, team]),
    ...confirmed('contact').map((e) => [e, contact])];
  assert.deepEqual(shown.map(([e]) => e.kind), ['supplier', 'supplier', 'environmental-health', 'contact'], 'the cafe shows every kind');
  const tables = tablesOf(text);
  assert.equal(tables.length, shown.length);
  tables.forEach((rows, i) => {
    const [entry, box] = shown[i];
    for (const [label] of rows) assert.ok(words.has(label), `${label} is not a word of the pack's forms`);
    // The header row is the box's first heading, then the entry's name.
    assert.deepEqual(rows[0], [box.columns[0], entry.title]);
    assert.deepEqual(rows.map(([label]) => label).sort(), [box.columns[0], ...(box === supplier
      ? [box.columns[1], ...box.rows.flat().filter((cell) => cell && !cell.includes('\n'))] : [box.columns[1], ...box.rows.map((row) => row[0])])].sort(),
    `${entry.id} prints every label of its box`);
    for (const [label, value] of rows.slice(1)) {
      const named = SUP_FIELDS.filter((field) => letters(label).startsWith(letters(field)));
      assert.equal(named.length, 1, `${label} names one field`);
      const want = box === team && named[0] === 'Useful-for' ? advice.replace(/\n/g, '<br>') : entry[keyOf(named[0])];
      assert.equal(value, want, `${entry.id}: ${label}`);
    }
  });
});

test('the pack\'s filled-in examples on the two forms are never printed, in any document of the cafe or any state of this one', () => {
  const found = examples();
  assert.ok(found.length >= 11);
  const bodies = [...RENDERED_CODES.map((code) => renderDocument(code, CAFE, data, { today: TODAY }).text), renderedSup(cafeSuppliers(supSheet())),
    renderedSup(cafeSuppliers(withElsewhere(supSheet(TEAM), SUP_KEPT)))];
  for (const body of bodies) {
    assert.equal(typeof body, 'string');
    for (const example of found) for (const line of example.split('\n')) assert.ok(!body.includes(line), `the pack's example "${line}" is printed`);
  }
});

const SUP_FILE = 'food-safety/answers-suppliers.md';
const NOTHING_YET = `${SUP_FILE} has no entry yet, and nothing under Kept elsewhere: add and confirm an entry for each supplier, or confirm ` +
  'under Kept elsewhere where the business keeps its suppliers\' list';
const NO_SUPPLIER = `${SUP_FILE} has no entry whose Kind is supplier: add and confirm one for each supplier, or confirm under Kept elsewhere ` +
  'where the business keeps its suppliers\' list';
const NO_TEAM = `${SUP_FILE} has no entry whose Kind is environmental-health: add and confirm one for the environmental health team, with ` +
  'its Telephone or Email (Kept elsewhere covers the suppliers\' list only)';
const SUP_KEPT_OPEN = `Kept elsewhere in ${SUP_FILE} has something written in it but is not confirmed: fill in Where, set State to confirmed ` +
  'and fill in By and On, or clear it';
const supStatusLine = (dir) => mainSays('status', '--project', dir).out.split('\n').find((line) => line.startsWith('FOODSUP '));
const supUnfinished = (dir) => projectStatus(dir, data).unfinished.filter((line) => line.code === 'FOODSUP').map((line) => line.what);

test('status tells each state of a suppliers and contacts list in its own true words; whatever the document shows unfinished, status says why, and sign-off refuses with those words', () => {
  const proposedGrocer = supEntry('SUP-01', 'Hartley Greengrocers', { ...GROCER_FIELDS, State: 'proposed', Source: 'A delivery note' });
  const states = [
    ['blank', supSheet(), 'no entries yet', [NOTHING_YET, NO_TEAM]],
    ['a supplier confirmed, no environmental health entry', supSheet(GROCER), '1 of 1 entries confirmed', [NO_TEAM]],
    ['the team confirmed, no supplier', supSheet(TEAM), '1 of 1 entries confirmed', [NO_SUPPLIER]],
    ['Kept elsewhere confirmed alone', withElsewhere(supSheet(), SUP_KEPT), 'the business keeps its suppliers\' list elsewhere', [NO_TEAM]],
    ['Kept elsewhere not confirmed', withElsewhere(supSheet(), KEPT_UNCONFIRMED), 'no entries yet', [SUP_KEPT_OPEN, NO_SUPPLIER, NO_TEAM]],
    ['a supplier proposed, the team confirmed', supSheet(proposedGrocer, TEAM), '1 of 2 entries confirmed, 1 proposed',
      [`1 entry in ${SUP_FILE} is proposed but not confirmed (SUP-01): ${COUNTS_WHEN}`]],
    ['Kept elsewhere and the team confirmed', withElsewhere(supSheet(TEAM), SUP_KEPT),
      '1 of 1 entries confirmed; the business also keeps its suppliers\' list elsewhere', []],
    ['everything confirmed', supSheet(GROCER, TEAM, PESTS), '3 of 3 entries confirmed', []]
  ];
  for (const [state, text, summary, lines] of states) {
    const dir = cafeSuppliers(text);
    assert.equal(supStatusLine(dir), `FOODSUP (Suppliers and contacts): ${summary}; not written; not signed off`, state);
    assert.deepEqual(supUnfinished(dir), [...lines, NOT_WRITTEN, NOT_SIGNED], state);
    const record = renderDocument('FOODCMP', dir, data).text;
    for (const line of lines) assert.ok(record.includes(`\n- Suppliers and contacts (FOODSUP): ${line}\n`), `${state}: ${record}`);
    // Written, the document is unfinished exactly when status names something, and sign-off gives status's own words, never
    // the backstop's alone.
    writtenAs(dir, 'FOODSUP');
    const check = checkDocument('FOODSUP', dir, join(dir, 'ARC-001-FOODSUP-v1.0.md'), data);
    assert.deepEqual([check.exit, check.unfinished], [0, lines.length > 0], state);
    const signed = signOffSup(dir);
    if (lines.length) assert.deepEqual(signed.messages, ['FOODSUP is not signed off, and nothing was written, because:', ...lines.map((l) => `- ${l}`)], state);
    else assert.equal(signed.exit, 0, `${state}: ${signed.messages ?? signed.message}`);
  }
  // Not started: status says how to make the worksheet, and render refuses, saying the same.
  const none = cafeSuppliers(null);
  assert.equal(supStatusLine(none), 'FOODSUP (Suppliers and contacts): not started: answers-suppliers.md; no entries yet; not written; not signed off');
  assert.deepEqual(supUnfinished(none), ['this document lists the business\'s suppliers, its environmental health team and its other contacts, from ' +
    'its worksheet food-safety/answers-suppliers.md, which is not started yet: make it with worksheet --section suppliers and fill it in',
    NOT_WRITTEN, NOT_SIGNED]);
  const refused = renderDocument('FOODSUP', none, data);
  assert.equal(refused.exit, 2);
  assert.match(refused.messages.join('\n'), /answers-suppliers\.md does not exist\. Make it with: .* worksheet --section suppliers /);
});

test('the document shows each part not yet answered in its own place: no confirmed supplier in the suppliers\' list, no confirmed team in its box', () => {
  const { team, advice } = forms();
  const noTeam = renderedSup(cafeSuppliers(supSheet(GROCER)));
  const box = `| ${team.columns[0]} | ${UNANSWERED} |\n| --- | --- |\n| ${team.columns[1]} | ${advice.replace(/\n/g, '<br>')} |`;
  assert.ok(noTeam.includes(`\n\n${box}\n\n`), noTeam);
  assert.ok(!noTeam.includes('The suppliers\' list has no confirmed supplier yet'));
  const noSupplier = renderedSup(cafeSuppliers(supSheet(TEAM)));
  assert.ok(noSupplier.includes(`\n## Suppliers' list\n\nThe suppliers' list has no confirmed supplier yet: ${UNANSWERED}\n\n## Contacts list\n`), noSupplier);
  assert.equal(noSupplier.split(UNANSWERED).length, 2, 'the team\'s box is answered');
  // Kept elsewhere confirmed covers the suppliers' list, in the business's words, and the team's box still asks.
  const kept = renderedSup(cafeSuppliers(withElsewhere(supSheet(), SUP_KEPT)));
  assert.ok(kept.includes('\n## Suppliers\' list\n\nThe business keeps its suppliers\' list elsewhere: The blue book by the till (said by Sam Okafor, ' +
    '2026-11-17).\n\n## Contacts list\n'), kept);
  assert.ok(kept.includes(`\n\n${box}\n\n`), kept);
  // An entry not confirmed is named by its identifier, and nothing of it is printed: a supplier in the suppliers' part,
  // any other (a contact, the team, an entry with no Kind yet) at the end.
  const open = renderedSup(cafeSuppliers(supSheet(supEntry('SUP-01', 'Hartley Greengrocers', { ...GROCER_FIELDS, State: 'unanswered' }), TEAM,
    supEntry('SUP-03', 'Swift Pest Control', { Kind: 'contact', Telephone: '01632 960477', State: 'proposed', Source: 'A card through the door' }),
    supEntry('SUP-04', 'Mill Lane Bakery', { State: 'unanswered' }))));
  const [suppliersPart, contactsPart] = open.split('\n## Contacts list\n');
  assert.ok(suppliersPart.endsWith(`\n\n${NOT_CONFIRMED_LINE}SUP-01.\n`), suppliersPart);
  assert.ok(contactsPart.includes(`\n${NOT_CONFIRMED_LINE}SUP-03 and SUP-04.\n`), contactsPart);
  assert.ok(!open.includes('Hartley') && !open.includes('Swift') && !open.includes('Bakery'), open);
});

test('Kept elsewhere confirmed with a supplier still unconfirmed: the suppliers\' part names that supplier, so it does not read as complete', () => {
  const proposed = supEntry('SUP-01', 'Hartley Greengrocers', { ...GROCER_FIELDS, State: 'proposed', Source: 'A delivery note' });
  const dir = cafeSuppliers(withElsewhere(supSheet(proposed, TEAM, PESTS), SUP_KEPT));
  const text = renderedSup(dir);
  assert.ok(text.includes('\n## Suppliers\' list\n\nThe business keeps its suppliers\' list elsewhere: The blue book by the till (said by Sam Okafor, ' +
    `2026-11-17).\n\n${NOT_CONFIRMED_LINE}SUP-01.\n\n## Contacts list\n`), text);
  assert.equal(text.split(NOT_CONFIRMED_LINE).length, 2, 'named once, and nothing under the contacts list');
  assert.deepEqual(supUnfinished(dir), [`1 entry in ${SUP_FILE} is proposed but not confirmed (SUP-01): ${COUNTS_WHEN}`, NOT_WRITTEN, NOT_SIGNED]);
});

test('an entry with no Kind of the three yet is named in the line that would otherwise say only to add one, so following it adds nothing twice', () => {
  const unkinded = supEntry('SUP-01', 'Hartley Greengrocers', { 'Goods-supplied': 'Fruit and vegetables', State: 'unanswered' });
  const guessed = supEntry('SUP-02', 'Exampleton council', { Kind: 'council', Telephone: '01632 960300', State: 'unanswered' });
  const dir = cafeSuppliers(supSheet(unkinded, guessed));
  assert.deepEqual(supUnfinished(dir), [
    // SUP-02's Kind is not one of the three, which the guidance says it must be; SUP-01 has no Kind at all.
    `2 entries in ${SUP_FILE} are not yet confirmed (SUP-01 and SUP-02): ${COUNTS_WHEN}; SUP-01 still needs Kind`,
    `${SUP_FILE} has no entry whose Kind is supplier: add and confirm one for each supplier (if SUP-01 or SUP-02 is a supplier, set its Kind ` +
      'to supplier instead of adding it again), or confirm under Kept elsewhere where the business keeps its suppliers\' list',
    `${SUP_FILE} has no entry whose Kind is environmental-health: add and confirm one for the environmental health team, with its Telephone ` +
      'or Email (if SUP-01 or SUP-02 is the team\'s entry, set its Kind to environmental-health instead of adding it again; Kept elsewhere ' +
      'covers the suppliers\' list only)',
    NOT_WRITTEN, NOT_SIGNED]);
  // Followed: each given its Kind and confirmed, the document is finished.
  const done = cafeSuppliers(supSheet(supEntry('SUP-01', 'Hartley Greengrocers', { Kind: 'supplier', 'Goods-supplied': 'Fruit and vegetables', ...agreed }),
    supEntry('SUP-02', 'Exampleton council', { Kind: 'environmental-health', Telephone: '01632 960300', ...agreed })));
  assert.deepEqual(supUnfinished(done), [NOT_WRITTEN, NOT_SIGNED]);
  writtenAs(done, 'FOODSUP');
  assert.equal(signOffSup(done).exit, 0);
});

test('needs gives what an entry lacks as the field to tell it at and the words to print, which may name two fields', () => {
  assert.deepEqual(LISTS.suppliers.needs({ kind: 'contact', telephone: '', email: '' }, data), [{ field: 'Telephone', says: 'Telephone or Email' }]);
  assert.deepEqual(LISTS.suppliers.needs({ kind: '' }, data), [{ field: 'Kind', says: 'Kind' }]);
  assert.deepEqual(LISTS.cleaning.needs({ frequency: '', method: '' }, data), [{ field: 'Frequency', says: 'Frequency' }, { field: 'Method', says: 'Method' }]);
  assert.deepEqual(LISTS.cleaning.needs({ frequency: OTHER, method: 'Wipe.', otherFrequency: '' }, data), [{ field: 'Other-frequency', says: 'Other-frequency' }]);
});

test('Kind takes a space for its hyphen, in any letter case, and is kept hyphenated', () => {
  for (const typed of ['environmental health', 'Environmental  Health', ' ENVIRONMENTAL-HEALTH ']) {
    const parsed = parse(supSheet(supEntry('SUP-01', 'Exampleton council', { Kind: typed, Telephone: '01632 960300', ...agreed })));
    assert.deepEqual(parsed.problems, [], typed);
    assert.equal(parsed.entries.get('SUP-01').kind, 'environmental-health', typed);
  }
});

test('Review Focus 5 for suppliers: a name or value holding |, backticks, a # heading or the unfinished marks keeps every table\'s two columns, passes check and marks nothing unfinished', () => {
  // A line that would start a heading inside a value never reaches a document: the worksheet is refused at that line,
  // as for any value, and render prints nothing from it.
  const heading = supSheet(supEntry('SUP-01', 'Hartley', { Kind: 'supplier', 'Goods-supplied': 'Fruit\n# Vegetables', ...agreed }));
  const refused = parse(heading);
  assert.deepEqual(refused.problems.map((p) => p.line), [lineOf(heading, '  # Vegetables')], messages(refused));
  assert.equal(renderDocument('FOODSUP', cafeSuppliers(heading), data).exit, 1);
  // Everything else a person might type is printed as typed, escaped, and changes nothing about the document.
  const odd = supEntry('SUP-01', '# Hartley | Sons **NOT YET ANSWERED**', { Kind: 'supplier', 'Contact-name': 'Dev `Hartley`',
    'Delivery-days': 'Tuesday | Friday', 'Goods-supplied': '# Vegetables\n**NOT YET ANSWERED**\nNot yet confirmed, so not shown: SUP-09.\nUK-FOOD:END -->',
    Address: 'Unit 3 | Station Yard', ...agreed });
  const team = supEntry('SUP-02', 'Not yet confirmed, so not shown: SUP-08.', { Kind: 'environmental-health', Telephone: '01632 960300 | ext 4', ...agreed });
  const contact = supEntry('SUP-03', '**NOT YET ANSWERED**', { Kind: 'contact', Email: 'someone@place.example', 'Useful-for': '| a | b |\n- a list item',
    ...agreed });
  const dir = cafeSuppliers(withElsewhere(supSheet(odd, team, contact), ['Where: # The **NOT YET ANSWERED** | book', 'State: confirmed',
    'By: Sam Okafor', 'On: 2026-11-17', 'Source:']));
  const text = renderedSup(dir);
  const tables = tablesOf(text);
  assert.equal(tables.length, 3);
  for (const rows of tables) for (const row of rows) assert.equal(row.length, 2, row.join(' | '));
  assert.equal(tables[0][0][1], '# Hartley \\| Sons \\*\\*NOT YET ANSWERED\\*\\*');
  assert.ok(tables[0].some(([, value]) => value === '# Vegetables<br>\\*\\*NOT YET ANSWERED\\*\\*<br>Not yet confirmed, so not shown: SUP-09.<br>UK-FOOD:END --&gt;'),
    JSON.stringify(tables[0]));
  assert.ok(!text.includes(UNANSWERED), 'no business words make the unfinished mark');
  const lines = text.split('\n');
  assert.ok(!lines.some((line) => line.startsWith(NOT_CONFIRMED_LINE)), 'no business words make the not-confirmed line');
  assert.deepEqual(lines.filter((line) => /^#/.test(line)), ['## Suppliers\' list', '## Contacts list'], 'no business words make a heading');
  assert.equal(lines.filter((line) => line.includes('UK-FOOD:')).filter((line) => line.startsWith('<!-- UK-FOOD:')).length, 2);
  writtenAs(dir, 'FOODSUP');
  const check = checkDocument('FOODSUP', dir, join(dir, 'ARC-001-FOODSUP-v1.0.md'), data);
  assert.deepEqual([check.exit, check.unfinished], [0, false], check.message);
  assert.equal(signOffSup(dir).exit, 0);
});

test('the suppliers and contacts document says truly what it quotes from the pack, which it does in every state', () => {
  const { source } = data;
  const line = `The labels in the tables, and the list of what the environmental health team can advise on, are quoted from the ${source.publisher}'s ` +
    `${source.title}, retrieved 17 November 2026. ${source.attribution} The ${source.publisher} has not reviewed or endorsed this document.`;
  for (const dir of [CAFE, cafeSuppliers(supSheet()), cafeSuppliers(withElsewhere(supSheet(), SUP_KEPT))]) {
    assert.equal(renderedSup(dir).split('\n').at(-3), line);
  }
});

test('the suppliers guidance says plainly that Kept elsewhere covers the suppliers\' list only, and that the team\'s entry is still needed', () => {
  const guidance = blankWorksheet('suppliers', data).replace(/\s+/g, ' ');
  assert.ok(guidance.includes('Kept elsewhere covers the suppliers\' list only: the document still needs the environmental health team\'s entry, ' +
    'confirmed, even when the business keeps its suppliers\' list somewhere else.'), guidance);
  assert.ok(guidance.includes('Kind is supplier, contact or environmental-health. There is one environmental-health entry at most. Write'), guidance);
  assert.ok(!guidance.includes('quoted from'), 'the guidance quotes nothing of the pack');
});

// ---- Allergen information (Task 7) ----

// The fourteen fields, in the pack's order, as the helper names them. Each is tied to the data's table by the first test
// below; no allergen's name, nor where the pack says it is found, is typed here.
const ALG = ['Nuts', 'Peanuts', 'Eggs', 'Milk', 'Fish', 'Crustaceans', 'Molluscs', 'Cereals-containing-gluten', 'Celery', 'Lupin', 'Mustard',
  'Sesame-seeds', 'Soya', 'Sulphur-dioxide'];
const DISH_FIELDS = ['Ingredients', 'PPDS', ...ALG, 'Notes', 'Checked-against', 'Checked-on', 'Free-from-claim', 'State', 'By', 'On', 'Source'];
const dish = (id, title, fields) => [`## ${id} ${title}`, '',
  ...DISH_FIELDS.map((f) => (fields[f] ? `${f}: ${fields[f].replace(/\n/g, '\n  ')}` : `${f}:`))].join('\n');
const algSheet = (...entries) => `${blankWorksheet('allergens', data)}${entries.map((e) => `\n${e}\n`).join('')}`;
const cellsAll = (value) => Object.fromEntries(ALG.map((f) => [f, value]));
// The date the commands would give as today in these tests. A worksheet is read with it, as every command reads one.
const TODAY = '2026-11-22';
const CHECKED = { 'Checked-against': 'Hollin Vale wholemeal bread label', 'Checked-on': '2026-11-17' };
// A dish confirmed with every cell and PPDS filled in.
const DONE = { PPDS: 'no', ...cellsAll('does not contain'), ...CHECKED, ...agreed };
const ALG_FILE = 'food-safety/answers-allergens.md';
const ALG_KEPT = ['Where: The recipe folder in the kitchen', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-17', 'Source:'];
const algParse = (text, today = TODAY) => parseWorksheet(text, data, { today });
// The pack's table, and the MG-04 safe method, found in the data as the helper finds them.
const allergenBlocks = () => data.sections.get('XC').methods.find((m) => m.id === ALLERGEN_TABLE.method).blocks
  .filter((b) => b.kind === 'table' && b.page === ALLERGEN_TABLE.page);
const mgMethod = () => data.sections.get('MG').methods.find((m) => m.id === CUSTOMER_QUESTIONS.method);
const pointRow = (id) => mgMethod().blocks.filter((b) => b.kind === 'points').flatMap((b) => b.rows).find((r) => r.id === id);
const askedQuestion = (id) => mgMethod().blocks.flatMap((b) => b.rows ?? []).flatMap((r) => r.questions ?? []).find((q) => q.id === id);
// The heading the Dishes table gives the allergen of `field`: its name in the pack, cut at its first " (".
const shortName = (name) => name.split(' (')[0];
const headingOf = (field) => shortName(allergensOf(data).find((a) => a.field === field).name);
// The cafe's MG worksheet with the questions given answered or proposed, or MG-04 marked not relevant.
const mgText = ({ answered = [], proposed = [], notRelevant = false } = {}) => {
  const parsed = parse(readFileSync(join(CAFE, 'food-safety', 'answers-MG.md'), 'utf8'));
  for (const id of answered) Object.assign(parsed.answers.get(id), { answer: `Our way for ${id}`, state: 'confirmed', by: 'Sam Okafor', on: '2026-11-18' });
  for (const id of proposed) Object.assign(parsed.answers.get(id), { answer: `A guess for ${id}`, state: 'proposed', source: 'The old menu' });
  if (notRelevant) {
    Object.assign(parsed.methods.get(CUSTOMER_QUESTIONS.method), { status: 'not-relevant', reason: 'We sell only sealed drinks.', decidedBy: 'Sam Okafor' });
  }
  return emitWorksheet(parsed, data);
};
const MG_ANSWERED = () => mgText({ answered: CUSTOMER_QUESTIONS.questions });
// The cafe's worksheets with the allergens and MG worksheets given: undefined keeps the cafe's own, null takes it away.
const cafeAlg = (allergens, mg) => {
  const dir = cafeWith();
  for (const [section, text] of [['allergens', allergens], ['MG', mg]]) {
    const file = join(dir, 'food-safety', `answers-${section}.md`);
    if (text === null) rmSync(file, { force: true });
    else if (text !== undefined) writeFileSync(file, text);
  }
  return dir;
};
const renderedAlg = (dir) => {
  const result = renderDocument('FOODALG', dir, data, { today: TODAY });
  assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
  return result.text;
};
const algUnfinished = (dir) => projectStatus(dir, data, { today: TODAY }).unfinished.filter((l) => l.code === 'FOODALG').map((l) => l.what);
const algStatusLine = (dir) => mainSays('status', '--project', dir).out.split('\n').find((line) => line.startsWith('FOODALG '));
const signOffAlg = (dir) => signOffDocument('FOODALG', dir, PERSON, data, { today: TODAY });
const writtenAlg = (dir) => {
  const file = join(dir, 'ARC-001-FOODALG-v1.0.md');
  writeFileSync(file, `Header text.\n\n${renderedAlg(dir)}\n\nFooter text.\n`);
  return checkDocument('FOODALG', dir, file, data, undefined, { today: TODAY });
};
// The Dishes table, as rows of cells, its header row first: the table whose header starts with Dish and has fifteen columns.
const dishesTable = (text) => tablesOf(text).find((rows) => rows[0][0] === 'Dish' && rows[0].length === 15);
// What status says, word for word, in each state of the allergen information.
const ALG_NOTHING_YET = `${ALG_FILE} has no dish yet, and nothing under Kept elsewhere: add and confirm an entry for each dish the business ` +
  'serves, or confirm under Kept elsewhere where the business keeps its allergen information for its dishes';
const ALG_KEPT_OPEN = `Kept elsewhere in ${ALG_FILE} has something written in it but is not confirmed: fill in Where, set State to confirmed ` +
  'and fill in By and On, or clear it';
const algCountLine = (n, ids, how, still = '') => `${n} ${n === 1 ? 'dish' : 'dishes'} in ${ALG_FILE} ${n === 1 ? 'is' : 'are'} ${how} (${ids}): ` +
  `${COUNTS_WHEN}${still}`;
const cellsLine = (n, where, dishes = 1) => `${n} allergen ${n === 1 ? 'cell' : 'cells'} of confirmed dishes in ${ALG_FILE} ${n === 1 ? 'is' : 'are'} ` +
  `not filled in, so the document shows ${n === 1 ? 'it' : 'them'} as not confirmed (${where}): ${n === 1 ? 'fill it in' : 'fill in each'} as contains or ` +
  `does not contain from what was checked, then update ${dishes === 1 ? 'that dish\'s' : 'each of those dishes\''} Checked-against, Checked-on, By and On`;
const ppdsLine = (ids, n = 1) => `PPDS is not filled in for ${n} confirmed ${n === 1 ? 'dish' : 'dishes'} in ${ALG_FILE} (${ids}), so the document shows ` +
  `${n === 1 ? 'it' : 'them'} as not confirmed under Prepacked for direct sale: write yes or no in ${n === 1 ? 'its' : 'each one\'s'} PPDS, for ` +
  'whether it is prepacked for direct sale, then update its By and On';
const MG_MISSING = 'food-safety/answers-MG.md, the Management safe methods worksheet, is not started yet, and this document repeats its answers ' +
  'to MG-04-Q01, MG-04-Q06 and MG-04-Q14 on how customers are told: make it with worksheet --section MG, and answer those three there; an ' +
  'answer counts when its State is confirmed and By and On are filled in';
const mgOpenLine = (ids, n) => `${ids} in food-safety/answers-MG.md ${n === 1 ? 'has' : 'have'} no confirmed answer yet, and this document repeats ` +
  `${n === 1 ? 'it' : 'them'} under How customers are told: answer ${n === 1 ? 'it' : 'them'} in the Management safe methods worksheet; an ` +
  'answer counts when its State is confirmed and By and On are filled in';
const MG_ALL_OPEN = mgOpenLine('MG-04-Q01, MG-04-Q06 and MG-04-Q14', 3);
// Every string in the data, and every line of one: what the pack prints. A line of a body found here is the pack's.
const DATA_TEXT = (() => {
  const found = new Set();
  const walk = (value) => {
    if (typeof value === 'string') {
      found.add(value);
      for (const line of value.split('\n')) found.add(line);
    } else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  for (const name of readdirSync(DEFAULT_DATA_DIR).filter((file) => file.endsWith('.json'))) walk(JSON.parse(readFileSync(join(DEFAULT_DATA_DIR, name), 'utf8')));
  return found;
})();
// A business's words as a document prints them, in a line and in a table cell.
const esc = (text) => text.replace(/[\\`*_[\]~$]/g, '\\$&').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escForms = (text) => [esc(text).replace(/\n/g, '<br>'), esc(text).replace(/\|/g, '\\|').replace(/\n/g, '<br>')];
// The helper's own words in a body: each line, or each cell of a table row, leaving out those that are the pack's (found in the
// data, or a heading of the Dishes table), then with every business value in `values` taken out of what is left. A value from
// a fixed set (a cell's contains or does not contain, PPDS's yes or no, a State) is the helper's own spelling, so it stays.
const FIXED_WORDS = new Set(['contains', 'does not contain', 'yes', 'no', 'unanswered', 'proposed', 'confirmed', 'applies', 'adapted', 'not-relevant']);
const helperWords = (body, values) => {
  const forms = values.filter((v) => v && !FIXED_WORDS.has(v)).flatMap(escForms).sort((a, b) => b.length - a.length);
  const shorts = new Set(allergensOf(data).map((a) => shortName(a.name)));
  const pieces = body.split('\n').flatMap((line) => (line.startsWith('|') ? cellsOf(line) : [line.replace(/^> /, '')]));
  return pieces.filter((piece) => !DATA_TEXT.has(piece.replace(/<br>/g, '\n').replace(/\\\|/g, '|')) && !DATA_TEXT.has(piece) && !shorts.has(piece))
    .map((piece) => forms.reduce((left, form) => left.split(form).join(''), piece));
};
// Every value a person wrote in an allergens worksheet and in an MG worksheet, as the document could print it.
const valuesOf = (dir) => {
  const values = [];
  for (const section of ['allergens', 'MG']) {
    const file = join(dir, 'food-safety', `answers-${section}.md`);
    let parsed;
    try {
      parsed = parse(readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    for (const entry of parsed.entries.values()) values.push(...Object.values(entry).filter((v) => typeof v === 'string'));
    for (const answer of parsed.answers.values()) values.push(answer.answer, answer.by, answer.on, answer.source);
    for (const method of parsed.methods.values()) values.push(method.reason, method.decidedBy);
    if (parsed.elsewhere) values.push(parsed.elsewhere.where, parsed.elsewhere.by, parsed.elsewhere.on);
  }
  return values.filter((v) => typeof v === 'string' && v.length > 1);
};

test('ALLERGEN_TABLE finds the one table of the pack\'s fourteen rows, and the fourteen fields tie to its rows in order', () => {
  const blocks = allergenBlocks();
  assert.equal(blocks.length, 1);
  const [table] = blocks;
  assert.equal(table.rows.length, 14);
  assert.equal(ALG.length, 14);
  // Each field, with its hyphens read as spaces, is the start of its row's name, in any letter case.
  table.rows.forEach(([name], i) => assert.ok(name.toLowerCase().startsWith(ALG[i].replace(/-/g, ' ').toLowerCase()), `${ALG[i]}: ${name}`));
  assert.deepEqual(allergensOf(data), table.rows.map(([name, found], i) => ({ field: ALG[i], name, found })));
  assert.deepEqual(LISTS.allergens.fields, ['Ingredients', 'PPDS', ...ALG, 'Notes', 'Checked-against', 'Checked-on', 'Free-from-claim']);
  assert.deepEqual([LISTS.allergens.prefix, LISTS.allergens.section, LISTS.allergens.title], ['DISH', 'allergens', 'Allergen information']);
  // The Dishes table's headings, each name cut at its first " (": fourteen different words, each the start of its name.
  const short = table.rows.map(([name]) => shortName(name));
  assert.equal(new Set(short).size, 14);
  short.forEach((s, i) => assert.ok(s.length > 0 && table.rows[i][0].startsWith(s), s));
  assert.ok(short.some((s, i) => s !== table.rows[i][0]), 'some names are cut');
  assert.equal(NOT_CONFIRMED_CELL, '**NOT CONFIRMED**');
});

test('PPDS_PARAGRAPH and FREE_FROM_POINT each name the one paragraph of its text that holds its phrase, and CUSTOMER_QUESTIONS are text questions of MG-04', () => {
  const holds = (text, index, phrase) => {
    const paragraphs = text.split('\n');
    assert.ok(paragraphs[index]?.includes(phrase), `${phrase}: ${paragraphs[index]}`);
    assert.deepEqual(paragraphs.flatMap((p, i) => (p.includes(phrase) ? [i] : [])), [index], `${phrase} is in no other paragraph`);
  };
  holds(pointRow(PPDS_PARAGRAPH.point).point, PPDS_PARAGRAPH.paragraph, 'PPDS');
  const free = pointRow(FREE_FROM_POINT.point);
  assert.equal(free.page, FREE_FROM_POINT.page);
  holds(free.point, FREE_FROM_POINT.paragraph, '\u2018free from\u2019');
  holds(free.why, FREE_FROM_POINT.reasonParagraph, '\u2018free from\u2019');
  assert.equal(CUSTOMER_QUESTIONS.method, 'MG-04');
  assert.deepEqual(CUSTOMER_QUESTIONS.questions, ['MG-04-Q01', 'MG-04-Q06', 'MG-04-Q14']);
  for (const id of CUSTOMER_QUESTIONS.questions) assert.equal(askedQuestion(id)?.type, 'text', id);
});

test('a blank allergens worksheet parses with no problems and no entries, and a filled one round-trips unchanged', () => {
  const blank = blankWorksheet('allergens', data);
  const parsed = algParse(blank);
  assert.deepEqual(parsed.problems, []);
  assert.deepEqual([parsed.section, parsed.entries.size, parsed.elsewhere.answered], ['allergens', 0, false]);
  assert.equal(blank.split('\n')[0], '# Answers: Allergen information (allergens)');
  assert.ok(blank.includes(`\n## DISH-01 Name of the dish\n\n${DISH_FIELDS.map((f) => (f === 'State' ? 'State: unanswered' : `${f}:`)).join('\n')}\n-->\n`));
  assert.ok(blank.endsWith(`-->\n\n${BLANK_ELSEWHERE}`), blank);
  const text = withElsewhere(algSheet(dish('DISH-01', 'Cheese toastie', { ...DONE, PPDS: 'yes', Milk: 'contains', Ingredients: 'Bread, cheese',
    Notes: 'The bread label says it may contain sesame.', 'Free-from-claim': 'In our own words.' })), ALG_KEPT);
  const filled = algParse(text);
  assert.deepEqual(filled.problems, []);
  assert.equal(emitWorksheet(filled, data), text);
  const entry = filled.entries.get('DISH-01');
  assert.deepEqual([entry.title, entry.ppds, entry.milk, entry.fish, entry.cerealsContainingGluten, entry.sulphurDioxide, entry.checkedAgainst,
    entry.checkedOn, entry.freeFromClaim, entry.answered], ['Cheese toastie', 'yes', 'contains', 'does not contain', 'does not contain',
    'does not contain', CHECKED['Checked-against'], '2026-11-17', 'In our own words.', true]);
});

test('Review Focus 2: an allergen cell reads only contains or does not contain, in any letter case and spacing; anything else is a problem at its line and the dish is not used', () => {
  for (const [typed, kept] of [['Contains', 'contains'], ['CONTAINS', 'contains'], ['Does Not Contain', 'does not contain'],
    ['does   not  contain', 'does not contain']]) {
    const parsed = algParse(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Fish: typed })));
    assert.deepEqual(parsed.problems, [], typed);
    assert.deepEqual([parsed.entries.get('DISH-01').fish, parsed.entries.get('DISH-01').answered], [kept, true], typed);
  }
  for (const typed of ['no', 'none', 'n/a', 'may contain', 'yes', 'free', '-', 'x', '\u2713', 'contain', 'doesnt contain', 'does not contains']) {
    const text = algSheet(dish('DISH-01', 'Toastie', { ...DONE, Fish: typed }));
    const parsed = algParse(text);
    // A tick is not a plain character, so it is named by its code point (M6, tested below).
    const holds = typed === '\u2713' ? ' (it holds U+2713, which is not a plain letter or space)' : '';
    assert.deepEqual(parsed.problems.map((p) => [p.line, p.message]), [[lineOf(text, `\nFish: ${typed}\n`) + 1, `DISH-01: Fish "${typed}" is neither ` +
      `contains nor does not contain${holds}: write one of the two, or leave it empty while it is not known; a precautionary statement such as may contain, ` +
      'or any other note, goes in Notes']], typed);
    assert.equal(parsed.entries.get('DISH-01').answered, false, typed);
  }
  // A proposed dish is held to it too, and nothing is rendered from a worksheet with a problem.
  const proposed = algParse(algSheet(dish('DISH-01', 'Toastie', { ...cellsAll('does not contain'), Milk: 'may contain', ...CHECKED, State: 'proposed',
    Source: 'The label' })));
  assert.deepEqual(proposed.problems.map((p) => p.message.slice(0, 27)), ['DISH-01: Milk "may contain"']);
  assert.equal(renderDocument('FOODALG', cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Fish: 'no' })), MG_ANSWERED()), data, { today: TODAY }).exit, 1);
  // An unanswered dish holds what it has been given, as given, and is never shown.
  const held = algParse(algSheet(dish('DISH-01', 'Toastie', { Fish: 'no', PPDS: 'maybe', State: 'unanswered' })));
  assert.deepEqual(held.problems, []);
  assert.equal(held.entries.get('DISH-01').fish, 'no');
  // PPDS reads yes or no, in any letter case.
  assert.equal(algParse(algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: 'YES' }))).entries.get('DISH-01').ppds, 'yes');
  const maybe = algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: 'maybe' }));
  assert.deepEqual(algParse(maybe).problems.map((p) => [p.line, p.message]), [[lineOf(maybe, 'PPDS: maybe'),
    'DISH-01: PPDS "maybe" is not yes or no: yes when the dish is prepacked for direct sale, and no when it is not']]);
});

test('what a dish needs before it is proposed or confirmed is Checked-against and Checked-on; an empty cell or an empty PPDS does not stop it', () => {
  const says = (fields) => algParse(algSheet(dish('DISH-01', 'Toastie', fields))).problems.map((p) => p.message);
  assert.deepEqual(says({ ...DONE, 'Checked-against': '' }), ['DISH-01 is confirmed, so it needs Checked-against']);
  assert.deepEqual(says({ ...DONE, 'Checked-on': '' }), ['DISH-01 is confirmed, so it needs Checked-on']);
  assert.deepEqual(says({ State: 'proposed', Source: 'A label' }), ['DISH-01 is proposed, so it needs Checked-against',
    'DISH-01 is proposed, so it needs Checked-on']);
  const sparse = algParse(algSheet(dish('DISH-01', 'Toastie', { ...CHECKED, ...agreed })));
  assert.deepEqual(sparse.problems, []);
  assert.equal(sparse.entries.get('DISH-01').answered, true);
  assert.deepEqual(LISTS.allergens.needs({ checkedAgainst: '', checkedOn: '' }, data), [{ field: 'Checked-against', says: 'Checked-against' },
    { field: 'Checked-on', says: 'Checked-on' }]);
});

test('Checked-on is a real date, not after today and not after On: tomorrow, a slip, and a day after the dish was agreed are each a problem at its line', () => {
  const read = (fields, today = TODAY) => {
    const text = algSheet(dish('DISH-01', 'Toastie', { ...DONE, ...fields }));
    return { text, problems: algParse(text, today).problems.map((p) => [p.line, p.message]) };
  };
  const tomorrow = read({ 'Checked-on': '2026-11-23', On: '2026-11-23' });
  assert.deepEqual(tomorrow.problems, [[lineOf(tomorrow.text, 'Checked-on: 2026-11-23'), 'DISH-01: Checked-on "2026-11-23" is after today, ' +
    '2026-11-22: it is the day the labels were checked, which cannot be still to come']]);
  for (const slip of ['17/11/2026', '2026-02-30', 'last Tuesday']) {
    const { text, problems } = read({ 'Checked-on': slip });
    assert.deepEqual(problems, [[lineOf(text, `Checked-on: ${slip}`), `DISH-01: Checked-on "${slip}" is not a real date written YYYY-MM-DD`]], slip);
  }
  const late = read({ 'Checked-on': '2026-11-18', On: '2026-11-17' });
  assert.deepEqual(late.problems, [[lineOf(late.text, 'Checked-on: 2026-11-18'), 'DISH-01: Checked-on 2026-11-18 is after On 2026-11-17: a dish ' +
    'cannot be agreed before it was checked, so correct whichever of the two dates is wrong']]);
  assert.deepEqual(read({ 'Checked-on': '2026-11-17', On: '2026-11-17' }).problems, [], 'checked and agreed the same day');
  assert.deepEqual(read({ 'Checked-on': '2026-11-22', On: '2026-11-22' }).problems, [], 'today');
  // The commands read a worksheet with this computer's date, so a day still to come is refused through them.
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-lists-'));
  const file = join(dir, 'answers-allergens.md');
  writeFileSync(file, algSheet(dish('DISH-01', 'Toastie', { ...DONE, 'Checked-on': '2999-01-01', On: '2999-01-01' })));
  const checked = run('parse-worksheet', '--file', file);
  assert.equal(checked.status, 1, checked.stdout + checked.stderr);
  assert.match(checked.stdout, /DISH-01: Checked-on "2999-01-01" is after today, \d{4}-\d\d-\d\d: it is the day the labels were checked/);
  // A program that reads the worksheet with no date for today cannot check the date against it, so the date is refused, in
  // words that put the fault on the program, not the person; even a day long past is not taken unchecked.
  for (const date of ['2026-11-23', '2026-11-17']) {
    const unchecked = read({ 'Checked-on': date, On: '2026-11-23' }, null);
    assert.deepEqual(unchecked.problems, [[lineOf(unchecked.text, `Checked-on: ${date}`), `DISH-01: Checked-on "${date}" could not be checked ` +
      'against today\'s date, because the program reading this worksheet gave none: that is the program\'s fault, not the worksheet\'s, and ' +
      'the helper\'s own commands always give it']], date);
  }
  // An unanswered dish holds its date unchecked, as it holds every value, and is never printed.
  assert.deepEqual(algParse(algSheet(dish('DISH-01', 'Toastie', { 'Checked-on': '2999-01-01', State: 'unanswered' })), null).problems, []);
});

test('the cafe renders to the expected allergen information body', () => {
  assert.equal(`${renderedAlg(CAFE)}\n`, readFileSync(join(CAFE, 'expected', 'FOODALG.body.md'), 'utf8'));
  // The command, which gives this computer's date, prints the same.
  const cli = run('render', '--doc', 'FOODALG', '--project', CAFE);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(cli.stdout, readFileSync(join(CAFE, 'expected', 'FOODALG.body.md'), 'utf8'));
});

test('the body\'s parts come in the brief\'s order, and the pack\'s table of fourteen is printed unchanged', () => {
  const body = renderedAlg(CAFE);
  const headings = body.split('\n').filter((line) => line.startsWith('#'));
  assert.deepEqual(headings, ['## Allergen information', '### The fourteen allergens', '### Dishes', '### What each row was checked against',
    '### Prepacked for direct sale', '### The business\'s own "free from" statements', '### How customers are told']);
  const [table] = allergenBlocks();
  const pack = tablesOf(body).find((rows) => rows.length === 15 && rows[0].every((c) => c === ''));
  assert.deepEqual(pack.slice(1), table.rows);
  // The Dishes table's header: Dish, then each name cut at its first " (".
  assert.deepEqual(dishesTable(body)[0], ['Dish', ...table.rows.map(([name]) => shortName(name))]);
});

test('Review Focus 1: a dish confirmed with a cell left empty shows NOT CONFIRMED in that cell, never does not contain; status says why, and sign-off refuses with that', () => {
  const text = algSheet(dish('DISH-01', 'Cheese toastie', { ...DONE, Celery: '' }));
  const dir = cafeAlg(text, MG_ANSWERED());
  const body = renderedAlg(dir);
  const [header, row] = dishesTable(body);
  assert.equal(row[0], 'DISH-01 Cheese toastie');
  assert.equal(row[header.indexOf(headingOf('Celery'))], NOT_CONFIRMED_CELL);
  assert.deepEqual(row.slice(1).filter((cell) => cell !== 'does not contain'), [NOT_CONFIRMED_CELL]);
  const line = cellsLine(1, 'Celery in DISH-01');
  assert.deepEqual(algUnfinished(dir), [line, NOT_WRITTEN, NOT_SIGNED]);
  assert.deepEqual([writtenAlg(dir).exit, writtenAlg(dir).unfinished], [0, true]);
  assert.deepEqual(signOffAlg(dir).messages, ['FOODALG is not signed off, and nothing was written, because:', `- ${line}`]);
  // Two dishes with cells left empty are named together.
  const two = cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Mustard: '', Soya: '' }), dish('DISH-02', 'Scone', { ...DONE, Eggs: '' })), MG_ANSWERED());
  assert.deepEqual(algUnfinished(two).slice(0, 1), [cellsLine(3, 'Mustard and Soya in DISH-01, and Eggs in DISH-02', 2)]);
  // Following the line, the cell filled in and the dish's dates brought up to date, the document is finished and signed off.
  const followed = cafeAlg(algSheet(dish('DISH-01', 'Cheese toastie', { ...DONE, 'Checked-on': '2026-11-21', On: '2026-11-21' })), MG_ANSWERED());
  assert.deepEqual(algUnfinished(followed), [NOT_WRITTEN, NOT_SIGNED]);
  assert.deepEqual(writtenAlg(followed).unfinished, false);
  assert.equal(signOffAlg(followed).exit, 0);
});

test('a dish proposed, or unanswered, with every cell filled shows NOT CONFIRMED in all fourteen, by its identifier alone, and nothing it holds anywhere', () => {
  const filled = { ...cellsAll('does not contain'), Milk: 'contains', PPDS: 'yes', Ingredients: 'Walnuts and flour', Notes: 'Read off the box',
    'Free-from-claim': 'Nothing in it to worry about', ...CHECKED };
  for (const state of [{ State: 'proposed', Source: 'The cake box' }, { State: 'unanswered' }]) {
    const dir = cafeAlg(algSheet(dish('DISH-01', 'Walnut cake', { ...filled, ...state })), MG_ANSWERED());
    const body = renderedAlg(dir);
    const rows = dishesTable(body);
    assert.deepEqual(rows.slice(1), [['DISH-01', ...Array(14).fill(NOT_CONFIRMED_CELL)]], state.State);
    for (const words of ['Walnut cake', 'Walnuts and flour', 'Read off the box', 'Nothing in it to worry about', 'The cake box', CHECKED['Checked-against']]) {
      assert.ok(!body.includes(words), `${state.State}: ${words}`);
    }
    // No cell anywhere in the body says contains or does not contain, and the dish is named as not confirmed.
    assert.ok(!tablesOf(body).flat(2).some((cell) => ['contains', 'does not contain'].includes(cell)), state.State);
    assert.ok(body.includes(`\n${NOT_CONFIRMED_LINE}DISH-01.\n`), body);
    assert.ok(body.includes('\nNo dish is confirmed in this document, so it does not say which dishes are prepacked for direct sale.\n'), body);
    assert.ok(body.includes('\nNo dish is confirmed in this document, so none of the business\'s statements is recorded here.\n'), body);
    // Not confirmed, its notes are not the business's yet, so its row carries no notes mark.
    assert.ok(!rows.flat().some((cell) => cell.includes(NOTES_MARK)), state.State);
  }
});

test('a confirmed dish with PPDS empty is listed as NOT CONFIRMED under Prepacked for direct sale; one with yes is listed; status says why', () => {
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: '' }), dish('DISH-02', 'Cheese and pickle sandwich', { ...DONE, PPDS: 'yes' }),
    dish('DISH-03', 'Scone', DONE)), MG_ANSWERED());
  const body = renderedAlg(dir);
  const part = body.slice(body.indexOf('### Prepacked for direct sale'), body.indexOf('### The business'));
  assert.ok(part.includes('\nThe business records these dishes as prepacked for direct sale:\n\n- DISH-02 Cheese and pickle sandwich\n'), part);
  assert.ok(part.includes(`\nWhether these dishes are prepacked for direct sale is not yet recorded:\n\n- DISH-01 Toastie: ${NOT_CONFIRMED_CELL}\n`), part);
  assert.ok(!part.includes('Scone') && !part.includes('No dish in this document'), part);
  assert.deepEqual(algUnfinished(dir), [ppdsLine('DISH-01'), NOT_WRITTEN, NOT_SIGNED]);
  const two = cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: '' }), dish('DISH-02', 'Scone', { ...DONE, PPDS: '' })), MG_ANSWERED());
  assert.equal(writtenAlg(two).unfinished, true);
  assert.deepEqual(signOffAlg(two).messages.slice(1), [`- ${ppdsLine('DISH-01 and DISH-02', 2)}`]);
  // Following the line, PPDS written and the dates brought up to date, the document is finished.
  const followed = cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: 'no', On: '2026-11-21' })), MG_ANSWERED());
  assert.equal(writtenAlg(followed).unfinished, false);
  assert.equal(signOffAlg(followed).exit, 0);
});

test('the pack\'s PPDS sentence and its two paragraphs on advertising food as free from are printed whole, labelled as the pack\'s', () => {
  const body = renderedAlg(CAFE);
  const ppds = pointRow(PPDS_PARAGRAPH.point).point.split('\n')[PPDS_PARAGRAPH.paragraph];
  const free = pointRow(FREE_FROM_POINT.point);
  const ppdsPart = body.slice(body.indexOf('### Prepacked for direct sale'), body.indexOf('### The business'));
  assert.ok(ppdsPart.startsWith(`### Prepacked for direct sale\n\nWhat the pack says:\n\n> ${ppds}\n\n`), ppdsPart);
  const freePart = body.slice(body.indexOf('### The business'), body.indexOf('### How customers are told'));
  assert.ok(freePart.includes(`\n\nWhat the pack says, in a safety point and then in the reason it gives:\n\n> ` +
    `${free.point.split('\n')[FREE_FROM_POINT.paragraph]}\n\n> ${free.why.split('\n')[FREE_FROM_POINT.reasonParagraph]}\n\n`), freePart);
  // Every line given as the pack's is one whole paragraph of the data, never cut.
  const quoted = body.split('\n').filter((line) => line.startsWith('> '));
  assert.equal(quoted.length, 3);
  for (const line of quoted) assert.ok(DATA_TEXT.has(line.slice(2)), line);
});

test('no line of the helper\'s own says "free from" but the heading, nor that a dish is safe, compliant, approved, free of an allergen, without risk, or suitable for anyone', () => {
  const claims = algSheet(dish('DISH-01', 'Free from bread', { ...DONE, 'Free-from-claim': 'Free from nuts, free-from gluten, ‘free from’ milk',
    Notes: 'free of sesame, no risk, anyone can eat it, nut free' }), dish('DISH-02', 'Scone', { ...DONE, PPDS: 'yes', 'Free-from-claim': 'Suitable for vegans' }));
  const adapted = (() => {
    const parsed = parse(MG_ANSWERED());
    Object.assign(parsed.methods.get(CUSTOMER_QUESTIONS.method), { status: 'adapted', variation: 'We take no phone orders.', reason: 'We have no phone.',
      provedSafe: 'Nobody can order by phone.', decidedBy: 'Sam Okafor' });
    return emitWorksheet(parsed, data);
  })();
  const states = [CAFE, cafeAlg(claims, MG_ANSWERED()), cafeAlg(claims, null), cafeAlg(algSheet(), mgText({ notRelevant: true })),
    cafeAlg(withElsewhere(algSheet(), ALG_KEPT), MG_ANSWERED()), cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), adapted),
    cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, State: 'proposed', By: '', On: '', Source: 'A label' })), MG_ANSWERED())];
  // "<allergen> free" in any spelling, for each of the fourteen as the Dishes table names it: the name, its last word, each without
  // a final s too ("Sesame seeds", "seeds", "seed"; "Cereals containing gluten", "gluten").
  const names = allergensOf(data).map(({ name }) => shortName(name).toLowerCase()).flatMap((short) => [short, short.split(' ').at(-1)])
    .flatMap((word) => [word, word.replace(/s$/, '')]);
  const freeOf = [...new Set(names)].map((word) => new RegExp(`\\b${word.replace(/ /g, '\\W+')}\\W{0,3}free\\b`, 'i'));
  // "safe" is allowed in two of the helper's names alone: the pack's "safe method(s)", and the Management document's label for how a
  // business showed its variation to be safe, printed with that document's variation line.
  const banned = [/(?<!Shown to be )\bsafe\b(?! methods?\b)/i, /\bcompliant\b/i, /\bapproved\b/i, /allergen\W?free/i, /\bfree of\b/i, /suitable for/i,
    /\bno risk\b/i, /\bcan eat\b/i, ...freeOf];
  for (const dir of states) {
    const words = helperWords(renderedAlg(dir), valuesOf(dir));
    assert.deepEqual(words.filter((piece) => /free\W{0,3}from/i.test(piece)), ['### The business\'s own "free from" statements'], dir);
    for (const ban of banned) assert.deepEqual(words.filter((piece) => ban.test(piece)), [], `${ban} in ${dir}`);
  }
  // The scan catches what it is meant to: each banned spelling, written into a line of the helper's own, is found.
  for (const sample of ['Nuts free', 'nut-free', 'Gluten free', 'sesame seed free', 'Celery-free', 'safe to eat', 'no risk', 'anyone can eat', 'suitable for all',
    'free of milk', 'allergen-free']) {
    assert.ok(banned.some((ban) => ban.test(sample)), sample);
  }
  // The business's own words are printed, as its own, under that heading.
  const body = renderedAlg(states[1]);
  assert.ok(body.includes('\nThe business\'s own words, as confirmed for each dish:\n\n- DISH-01 Free from bread: Free from nuts, free-from gluten, ' +
    '‘free from’ milk\n- DISH-02 Scone: Suitable for vegans\n'), body);
});

test('I3: a confirmed dish with Notes carries the notes mark in its own row of the Dishes table; one without does not, nor does a dish not confirmed', () => {
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Notes: 'The bread label says it may contain sesame.' }), dish('DISH-02', 'Scone', DONE),
    dish('DISH-03', 'Cake', { ...DONE, Notes: 'The box says it may contain nuts.', State: 'proposed', By: '', On: '', Source: 'The box' })), MG_ANSWERED());
  const body = renderedAlg(dir);
  const rows = dishesTable(body);
  assert.deepEqual(rows.slice(1).map((row) => row[0]), [`DISH-01 Toastie<br>${NOTES_MARK}`, 'DISH-02 Scone', 'DISH-03']);
  // The cells keep their three states; the mark is in the Dish cell alone.
  assert.ok(rows.slice(1).every((row) => row.slice(1).every((cell) => ['contains', 'does not contain', NOT_CONFIRMED_CELL].includes(cell))));
  assert.equal(NOTES_MARK, '**see notes**');
  // The mark says nothing about allergens; the lead line says what a marked row has.
  assert.ok(!allergensOf(data).some(({ name }) => NOTES_MARK.toLowerCase().includes(shortName(name).toLowerCase())));
  assert.ok(body.includes(`\nA confirmed row records what a named person at the business agreed, from what the next section names for it: ` +
    `labels, specifications or suppliers' statements, or a single whole food looked at by the person named there. A row marked ${NOTES_MARK} has a note there, ` +
    'which may be a label\'s statement that the food may contain an allergen.\n'), body);
  // A dish's own name cannot imitate the mark: its asterisks are escaped.
  const imitation = renderedAlg(cafeAlg(algSheet(dish('DISH-01', `Toastie ${NOTES_MARK}`, DONE)), MG_ANSWERED()));
  assert.equal(dishesTable(imitation)[1][0], 'DISH-01 Toastie \\*\\*see notes\\*\\*');
});

test('a dish agreed by one person whose whole foods another looked at: nothing in the body says the person who agreed it looked', () => {
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Carrot cake', { ...DONE, 'Checked-against': 'Fenwick self-raising flour bag;\nwhole carrots and fresh eggs, ' +
    'nothing added, seen by Priya Shah', By: 'Sam Okafor' })), MG_ANSWERED());
  const body = renderedAlg(dir);
  // Each name is printed only in its own column of the checked table: Priya Shah in what was checked, Sam Okafor in who agreed it.
  const checked = tablesOf(body).find((rows) => rows[0][0] === 'Dish' && rows[0].length === 6);
  const [header, row] = checked;
  assert.equal(row[header.indexOf('Checked against')], 'Fenwick self-raising flour bag;<br>whole carrots and fresh eggs, nothing added, seen by Priya Shah');
  assert.equal(row[header.indexOf('Agreed by')], 'Sam Okafor, 2026-11-17');
  const lines = body.split('\n');
  assert.deepEqual(lines.filter((line) => line.includes('Priya Shah')), lines.filter((line) => line.startsWith('| DISH-01 Carrot cake |') &&
    cellsOf(line).length === 6));
  // Sam Okafor elsewhere only as the one who answered the Management questions repeated under How customers are told.
  assert.deepEqual(lines.filter((line) => line.includes('Sam Okafor') && !line.includes('[answered by Sam Okafor, ') && cellsOf(line).length !== 6), []);
  // No line of the helper's own puts the looking on whoever agreed the row.
  const words = helperWords(body, valuesOf(dir));
  for (const said of [/that person (looked|saw|checked)/i, /agreed after (checking|looking)/i, /\b(who agreed|agreeing)\b[^.]*\b(looked|saw|checked)\b/i,
    /\bthey (looked|saw|checked)\b/i, /\b(looked|seen) (at )?by (that|the same) person\b/i]) {
    assert.deepEqual(words.filter((piece) => said.test(piece)), [], `${said}`);
  }
  // The lead line puts the looking on the person Checked-against names.
  assert.ok(words.some((piece) => piece.includes('or a single whole food looked at by the person named there.')), words.join('\n'));
});

test('M3: an adapted MG-04 prints its variation line after the three questions, exactly as the Management document prints it', () => {
  const parsed = parse(MG_ANSWERED());
  Object.assign(parsed.methods.get(CUSTOMER_QUESTIONS.method), { status: 'adapted', variation: 'We take no phone or online orders.',
    reason: 'We have no phone line or website.', provedSafe: 'Every order is taken at the counter.', decidedBy: 'Sam Okafor' });
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), emitWorksheet(parsed, data));
  const body = renderedAlg(dir);
  const management = renderDocument('FOODMGT', dir, data, { today: TODAY }).text;
  const variation = management.split('\n').find((line, i, all) => line.startsWith('Our variation: ') &&
    all.slice(0, i).reverse().find((l) => l.startsWith('### ')).startsWith('### MG-04 '));
  assert.ok(variation, management);
  const part = body.slice(body.indexOf('### How customers are told'));
  assert.ok(part.includes(` |\n\n${variation}\n\n`), part);
  assert.equal(tablesOf(part)[0].length, 4, 'the three questions are printed too');
  assert.deepEqual(algUnfinished(dir), [NOT_WRITTEN, NOT_SIGNED]);
});

test('M4: with no dish confirmed, the PPDS and free-from parts say so, and never that the business has no such food or statement; with dishes confirmed they speak of those', () => {
  const kept = renderedAlg(cafeAlg(withElsewhere(algSheet(), ALG_KEPT), MG_ANSWERED()));
  assert.ok(kept.includes('\nNo dish is confirmed in this document, so it does not say which dishes are prepacked for direct sale.\n'), kept);
  assert.ok(kept.includes('\nNo dish is confirmed in this document, so none of the business\'s statements is recorded here.\n'), kept);
  assert.ok(!kept.includes('No confirmed dish is recorded as prepacked') && !kept.includes('No confirmed dish has one recorded.'), kept);
  const confirmed = renderedAlg(cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), MG_ANSWERED()));
  assert.ok(confirmed.includes('\nNo confirmed dish is recorded as prepacked for direct sale.\n'), confirmed);
  // A proposed dish that says yes is listed in the document, so the line speaks of the confirmed dishes alone.
  const mixed = renderedAlg(cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE), dish('DISH-02', 'Sandwich', { ...DONE, PPDS: 'yes', State: 'proposed',
    By: '', On: '', Source: 'A label' })), MG_ANSWERED()));
  assert.ok(mixed.includes('\nNo confirmed dish is recorded as prepacked for direct sale.\n'), mixed);
  assert.ok(!mixed.includes('No dish in this document is recorded'), mixed);
  assert.ok(confirmed.includes('\nNo confirmed dish has one recorded.\n'), confirmed);
  assert.ok(!confirmed.includes('No dish is confirmed in this document'), confirmed);
});

test('M6: a cell holding a character that is not a plain letter or space is named by its code point, so the message never seems to refuse the words it asks for', () => {
  const message = (typed, held, retype) => `DISH-01: Fish "${typed}" is neither contains nor does not contain (it holds ${held}, which ` +
    `${held.includes(' and ') ? 'are not plain letters or spaces' : 'is not a plain letter or space'}${retype ? ': type it again' : ''}): write one of the two, ` +
    'or leave it empty while it is not known; a precautionary statement such as may contain, or any other note, goes in Notes';
  for (const [typed, held, retype] of [
    // One of the two once its odd character is a plain space or letter: worth typing again.
    ['does not contain', 'U+00A0', true], ['dоes not contain', 'U+043E', true], ['does\tnot contain', 'U+0009', true],
    ['CONTAINЅ', 'U+0405', true], ['does  not contain', 'U+00A0', true],
    // Wrong in substance: typing it again would not help, and the rest of the message says what to write.
    ['✓', 'U+2713', false], ['may contain – traces', 'U+2013', false], ['\u{1F95C}', 'U+1F95C', false], ['contains nuts', 'U+00A0', false]
  ]) {
    const [problem] = algParse(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Fish: typed }))).problems;
    assert.equal(problem.message, message(typed, held, retype), typed);
  }
  // A plain wrong word names nothing.
  assert.doesNotMatch(algParse(algSheet(dish('DISH-01', 'Toastie', { ...DONE, Fish: 'n/a' }))).problems[0].message, /U\+/);
});

test('a confirmed dish with a cell line left out altogether shows it as not confirmed, and status calls it not filled in', () => {
  const text = algSheet(dish('DISH-01', 'Toastie', DONE)).replace('\nLupin: does not contain\n', '\n');
  assert.deepEqual(algParse(text).problems, []);
  const dir = cafeAlg(text, MG_ANSWERED());
  const [header, row] = dishesTable(renderedAlg(dir));
  assert.equal(row[header.indexOf(headingOf('Lupin'))], NOT_CONFIRMED_CELL);
  assert.deepEqual(algUnfinished(dir), [cellsLine(1, 'Lupin in DISH-01'), NOT_WRITTEN, NOT_SIGNED]);
});

test('Review Focus 5: a dish named Fish | chips and a note reading **NOT CONFIRMED** keep every table\'s columns, pass check and mark nothing unfinished', () => {
  // A line that would open a comment, or start a heading, inside a value never reaches a document: the worksheet is refused at that line.
  for (const [value, problem] of [['Wipe it.\n<!-- UK-FOOD:END -->', /a comment inside a value would be hidden/], ['Bread\n# Butter', /a heading must start/]]) {
    const text = algSheet(dish('DISH-01', 'Toastie', { ...DONE, Ingredients: value }));
    assert.equal(algParse(text).problems.length, 1, value);
    assert.match(algParse(text).problems[0].message, problem);
    assert.equal(renderDocument('FOODALG', cafeAlg(text, MG_ANSWERED()), data, { today: TODAY }).exit, 1);
  }
  const odd = dish('DISH-01', 'Fish | chips', { ...DONE, Fish: 'contains', Notes: '**NOT CONFIRMED**', Ingredients: '# Cod | `batter`\n**NOT YET ANSWERED**\n' +
    'Not yet confirmed, so not shown: DISH-09.\nUK-FOOD:END -->', 'Checked-against': 'Not yet confirmed, so not shown: DISH-08.', PPDS: 'yes',
    'Free-from-claim': '**NOT CONFIRMED** | \n**NOT YET ANSWERED**' });
  const other = dish('DISH-02', '**NOT CONFIRMED** soup', DONE);
  const dir = cafeAlg(withElsewhere(algSheet(odd, other), ['Where: # The **NOT CONFIRMED** | folder', 'State: confirmed', 'By: Sam Okafor',
    'On: 2026-11-17', 'Source:']), MG_ANSWERED());
  const body = renderedAlg(dir);
  const dishes = dishesTable(body);
  for (const row of dishes) assert.equal(row.length, 15, row.join(' | '));
  assert.equal(dishes[1][0], `DISH-01 Fish \\| chips<br>${NOTES_MARK}`);
  assert.equal(dishes[2][0], 'DISH-02 \\*\\*NOT CONFIRMED\\*\\* soup');
  const checked = tablesOf(body).find((rows) => rows[0][0] === 'Dish' && rows[0].length === 6);
  for (const row of checked) assert.equal(row.length, 6, row.join(' | '));
  assert.ok(checked[1].includes('\\*\\*NOT CONFIRMED\\*\\*'), JSON.stringify(checked[1]));
  assert.ok(!body.includes(NOT_CONFIRMED_CELL), 'no business words make the not-confirmed mark');
  assert.ok(!body.includes(UNANSWERED), 'no business words make the unanswered mark');
  const lines = body.split('\n');
  assert.ok(!lines.some((line) => line.startsWith(NOT_CONFIRMED_LINE)), 'no business words make the not-confirmed line');
  assert.deepEqual(lines.filter((line) => /^#/.test(line)), ['## Allergen information', '### The fourteen allergens', '### Dishes',
    '### What each row was checked against', '### Prepacked for direct sale', '### The business\'s own "free from" statements', '### How customers are told']);
  assert.equal(lines.filter((line) => line.startsWith('<!-- UK-FOOD:')).length, 2);
  const check = writtenAlg(dir);
  assert.deepEqual([check.exit, check.unfinished], [0, false], check.message);
  assert.equal(signOffAlg(dir).exit, 0);
});

test('a project with no MG worksheet still renders: how customers are told shows NOT YET ANSWERED naming the worksheet, status says why, and sign-off refuses with that', () => {
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), null);
  const body = renderedAlg(dir);
  const part = body.slice(body.indexOf('### How customers are told'));
  assert.ok(part.startsWith('### How customers are told\n\nHow customers are told is answered in the Management safe methods worksheet, which ' +
    `has not been started yet: ${UNANSWERED}\n\n`), part);
  assert.deepEqual(algUnfinished(dir), [MG_MISSING, NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(writtenAlg(dir).unfinished, true);
  assert.deepEqual(signOffAlg(dir).messages, ['FOODALG is not signed off, and nothing was written, because:', `- ${MG_MISSING}`]);
  // The source line no longer names questions it does not print.
  assert.doesNotMatch(body.split('\n').at(-3), /questions/);
});

test('the three questions on how customers are told print exactly as the Management safe methods document prints them, from its worksheet', () => {
  const mg = mgText({ answered: ['MG-04-Q01'], proposed: ['MG-04-Q14'] });
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), mg);
  const body = renderedAlg(dir);
  const management = renderDocument('FOODMGT', dir, data, { today: TODAY }).text;
  const part = body.slice(body.indexOf('### How customers are told'));
  assert.ok(part.startsWith(`### How customers are told\n\nFrom MG-04 ${mgMethod().title}, in the business's Management safe methods ` +
    'document:\n\n'), part);
  // What the Management document prints for one question: in its table, a cell holds each question of its row with its answer, a
  // blank line (<br><br>) apart, so the question's own part of its cell is the part that starts with its text.
  const cellOf = (text, question) => text.split('\n').filter((line) => line.startsWith('| ')).flatMap(cellsOf).flatMap((cell) => cell.split('<br><br>'))
    .find((part) => part.startsWith(question.text));
  const [table] = tablesOf(part);
  assert.equal(table.length, 4, 'an empty header, then a row to each question');
  CUSTOMER_QUESTIONS.questions.forEach((id, i) => {
    const question = askedQuestion(id);
    const shown = cellOf(management, question);
    assert.ok(shown, id);
    assert.equal(table[i + 1][0], shown, id);
  });
  assert.match(table[1][0], /\*\*Our answer:\*\* Our way for MG-04-Q01 \[answered by Sam Okafor, 2026-11-18\]$/);
  assert.match(table[3][0], /\*\*Our answer:\*\* \*\*NOT YET ANSWERED\*\* \(proposed from The old menu: /);
  assert.deepEqual(algUnfinished(dir), [mgOpenLine('MG-04-Q06 and MG-04-Q14', 2), NOT_WRITTEN, NOT_SIGNED]);
  // Answering them there finishes this document.
  const done = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), MG_ANSWERED());
  assert.deepEqual(algUnfinished(done), [NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(writtenAlg(done).unfinished, false);
  assert.equal(signOffAlg(done).exit, 0);
});

test('MG-04 marked not relevant: its not-relevant line, as the Management document prints it, and no questions; the document can be finished', () => {
  const mg = mgText({ notRelevant: true });
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), mg);
  const body = renderedAlg(dir);
  const management = renderDocument('FOODMGT', dir, data, { today: TODAY }).text;
  const notRelevant = management.split('\n').find((line, i, all) => line.startsWith('Not relevant to this business: ') &&
    all.slice(0, i).reverse().find((l) => l.startsWith('### ')).startsWith('### MG-04 '));
  assert.ok(notRelevant, management);
  const part = body.slice(body.indexOf('### How customers are told'));
  assert.ok(part.startsWith(`### How customers are told\n\nFrom MG-04 ${mgMethod().title}, in the business's Management safe methods ` +
    `document:\n\n${notRelevant}\n\n`), part);
  for (const id of CUSTOMER_QUESTIONS.questions) assert.ok(!body.includes(askedQuestion(id).text), id);
  assert.deepEqual(algUnfinished(dir), [NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(writtenAlg(dir).unfinished, false);
  assert.equal(signOffAlg(dir).exit, 0);
});

test('an MG worksheet with a problem, or for other data, is never printed from: render refuses as the Management document does', () => {
  const broken = mgText().replace('### MG-04-Q01\n', '### MG-04-Q01 with words after it\n');
  const dir = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), broken);
  const mine = renderDocument('FOODALG', dir, data, { today: TODAY });
  const management = renderDocument('FOODMGT', dir, data, { today: TODAY });
  assert.equal(mine.exit, 1);
  assert.deepEqual(mine.messages, management.messages);
  const other = cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), mgText().replace(`data=${DATA_ID}`, 'data=sfbb-caterers-2025-01-01'));
  const refused = renderDocument('FOODALG', other, data, { today: TODAY });
  assert.equal(refused.exit, 2);
  assert.match(refused.messages.join('\n'), /answers-MG\.md answers data sfbb-caterers-2025-01-01/);
  // Status tells the problem under the Management document, and under this one too, as it cannot be written until that
  // worksheet is put right; and the allergen information is not signed off.
  const problem = 'worksheet food-safety/answers-MG.md has 1 problem, so none of its answers counts until it is fixed: parse-worksheet --file ' +
    'food-safety/answers-MG.md lists it';
  assert.ok(projectStatus(dir, data, { today: TODAY }).unfinished.some((l) => l.code === 'FOODMGT' && l.what === problem));
  assert.deepEqual(algUnfinished(dir), [problem, NOT_WRITTEN, NOT_SIGNED]);
});

test('Kept elsewhere confirmed alone: the document is finished, prints where, the pack\'s table, PPDS, the business\'s statements and how customers are told, and no Dishes table', () => {
  const dir = cafeAlg(withElsewhere(algSheet(), ALG_KEPT), MG_ANSWERED());
  const body = renderedAlg(dir);
  assert.ok(body.includes('\n## Allergen information\n\nThe business keeps its allergen information for its dishes elsewhere: The recipe folder in ' +
    'the kitchen (said by Sam Okafor, 2026-11-17).\n\n### The fourteen allergens\n'), body);
  assert.deepEqual(body.split('\n').filter((line) => line.startsWith('#')), ['## Allergen information', '### The fourteen allergens',
    '### Prepacked for direct sale', '### The business\'s own "free from" statements', '### How customers are told']);
  assert.equal(dishesTable(body), undefined);
  assert.deepEqual(algUnfinished(dir), [NOT_WRITTEN, NOT_SIGNED]);
  assert.equal(writtenAlg(dir).unfinished, false);
  assert.equal(signOffAlg(dir).exit, 0);
  assert.match(algStatusLine(dir), /^FOODALG \(Allergen information\): the business keeps its allergen information for its dishes elsewhere; /);
  // Entries beside it are printed too, and one not confirmed still leaves the document unfinished.
  const both = cafeAlg(withElsewhere(algSheet(dish('DISH-01', 'Toastie', DONE), dish('DISH-02', 'Scone', { State: 'unanswered' })), ALG_KEPT), MG_ANSWERED());
  const bothBody = renderedAlg(both);
  assert.deepEqual(dishesTable(bothBody).map((row) => row[0]), ['Dish', 'DISH-01 Toastie', 'DISH-02']);
  assert.deepEqual(algUnfinished(both), [algCountLine(1, 'DISH-02', 'not yet confirmed', '; DISH-02 still needs Checked-against and Checked-on'),
    NOT_WRITTEN, NOT_SIGNED]);
});

test('status tells each state of the allergen information in its own true words; whatever the body shows unfinished, status says why, and sign-off refuses with those words', () => {
  const finished = dish('DISH-01', 'Toastie', DONE);
  const states = [
    ['blank', algSheet(), MG_ANSWERED(), 'no dishes yet', [ALG_NOTHING_YET]],
    ['Kept elsewhere not confirmed', withElsewhere(algSheet(), KEPT_UNCONFIRMED), MG_ANSWERED(), 'no dishes yet', [ALG_KEPT_OPEN]],
    ['Kept elsewhere confirmed alone', withElsewhere(algSheet(), ALG_KEPT), MG_ANSWERED(), 'the business keeps its allergen information for its dishes elsewhere', []],
    ['a dish proposed', algSheet(dish('DISH-01', 'Toastie', { ...DONE, State: 'proposed', By: '', On: '', Source: 'The label' })), MG_ANSWERED(),
      '0 of 1 dishes confirmed, 1 proposed', [algCountLine(1, 'DISH-01', 'proposed but not confirmed')]],
    ['a dish confirmed, every cell filled', algSheet(finished), MG_ANSWERED(), '1 of 1 dishes confirmed', []],
    ['a dish confirmed with two cells empty', algSheet(dish('DISH-01', 'Toastie', { ...DONE, Lupin: '', Mustard: '' })), MG_ANSWERED(),
      '1 of 1 dishes confirmed', [cellsLine(2, 'Lupin and Mustard in DISH-01')]],
    ['a dish confirmed with PPDS empty', algSheet(dish('DISH-01', 'Toastie', { ...DONE, PPDS: '' })), MG_ANSWERED(), '1 of 1 dishes confirmed',
      [ppdsLine('DISH-01')]],
    ['no MG worksheet', algSheet(finished), null, '1 of 1 dishes confirmed', [MG_MISSING]],
    ['the cafe\'s MG worksheet, its customer questions unanswered', algSheet(finished), undefined, '1 of 1 dishes confirmed', [MG_ALL_OPEN]],
    ['MG-04 not relevant', algSheet(finished), mgText({ notRelevant: true }), '1 of 1 dishes confirmed', []]
  ];
  for (const [state, allergens, mg, summary, lines] of states) {
    const dir = cafeAlg(allergens, mg);
    assert.equal(algStatusLine(dir), `FOODALG (Allergen information): ${summary}; not written; not signed off`, state);
    assert.deepEqual(algUnfinished(dir), [...lines, NOT_WRITTEN, NOT_SIGNED], state);
    const record = renderDocument('FOODCMP', dir, data, { today: TODAY }).text;
    for (const line of lines) assert.ok(record.includes(`\n- Allergen information (FOODALG): ${line}\n`), `${state}: ${record}`);
    const check = writtenAlg(dir);
    assert.deepEqual([check.exit, check.unfinished], [0, lines.length > 0], state);
    const signed = signOffAlg(dir);
    if (lines.length) assert.deepEqual(signed.messages, ['FOODALG is not signed off, and nothing was written, because:', ...lines.map((l) => `- ${l}`)], state);
    else assert.equal(signed.exit, 0, `${state}: ${signed.messages ?? signed.message}`);
  }
  // Not started: status says how to make the worksheet, and render refuses, saying the same.
  const none = cafeAlg(null, MG_ANSWERED());
  assert.equal(algStatusLine(none), 'FOODALG (Allergen information): not started: answers-allergens.md; no dishes yet; not written; not signed off');
  assert.deepEqual(algUnfinished(none), ['this document records each dish the business serves against the fourteen allergens, from its worksheet ' +
    'food-safety/answers-allergens.md, which is not started yet: make it with worksheet --section allergens and fill it in', NOT_WRITTEN, NOT_SIGNED]);
  const refused = renderDocument('FOODALG', none, data, { today: TODAY });
  assert.equal(refused.exit, 2);
  assert.match(refused.messages.join('\n'), /answers-allergens\.md does not exist\. Make it with: .* worksheet --section allergens /);
});

test('the allergen information says truly what it quotes from the pack, in each state', () => {
  const { source } = data;
  const tail = `are quoted from the ${source.publisher}'s ${source.title}, retrieved 17 November 2026. ${source.attribution} The ${source.publisher} ` +
    'has not reviewed or endorsed this document.';
  const last = (dir) => renderedAlg(dir).split('\n').at(-3);
  assert.equal(last(cafeAlg(algSheet(dish('DISH-01', 'Toastie', DONE)), MG_ANSWERED())), 'The table of the fourteen allergens, their shortened names ' +
    `over the Dishes table, the paragraphs given as what the pack says and the questions under How customers are told ${tail}`);
  assert.equal(last(cafeAlg(withElsewhere(algSheet(), ALG_KEPT), null)), `The table of the fourteen allergens and the paragraphs given as what the pack says ${tail}`);
  assert.equal(last(cafeAlg(withElsewhere(algSheet(), ALG_KEPT), mgText({ notRelevant: true }))),
    `The table of the fourteen allergens and the paragraphs given as what the pack says ${tail}`);
});

test('the allergens guidance says how a cell is filled and that a change to a dish takes it back to unanswered', () => {
  const guidance = blankWorksheet('allergens', data).replace(/\s+/g, ' ');
  for (const words of ['Never fill one in from the name of a dish or of an ingredient.', 'Leave a cell empty while it is not known: the document shows it as not confirmed.',
    'as what was checked says: a label, a product specification or a supplier\'s statement for each ingredient.',
    'An ingredient with no label may rest on a named person\'s own check only when it is a single whole food with nothing added, such as a loose ' +
      'tomato or a fresh egg: Checked-against then says what was looked at, and by whom.',
    'Anything made of more than one thing, such as a mix, a sauce, bread, or a dressed or prepared product, needs a label, a specification or a ' +
      'supplier\'s statement.',
    'An entry needs Checked-against and Checked-on before it can be proposed or confirmed.',
    'When an empty cell of a confirmed dish is filled in later, bring the dish\'s Checked-against, Checked-on, By and On up to date.',
    'When a recipe, an ingredient, a brand or a supplier changes, set the dish\'s State to unanswered and clear By and On until it has been checked again.']) {
    assert.ok(guidance.includes(words), words);
  }
  // No cell rests on what a person merely knows, and the guidance suggests no answer for any cell.
  assert.doesNotMatch(guidance, /\bknows?\b/);
  assert.doesNotMatch(guidance, /(write|is|are) (contains|does not contain) (for|in) (a|an|the) /i);
  assert.ok(!guidance.includes('quoted from'), 'the guidance quotes nothing of the pack');
});

// ---- What a list document's count lines say an entry needs (item 5) ----

// The count lines status gives for a document: those naming entries not yet confirmed and entries only proposed.
const countLinesOf = (dir, code) => projectStatus(dir, data, { today: TODAY }).unfinished
  .filter((line) => line.code === code && / (?:is|are) (?:not yet confirmed|proposed but not confirmed) \(/.test(line.what)).map((line) => line.what);
// A worksheet with one entry's lines replaced: its State, By and On set as a confirmation sets them, and each field in
// `fill` filled in, the way a person following a count line does.
const followed = (text, id, fill) => {
  // Below the guidance comment, which holds an entry to copy under the same heading as the first entry.
  const end = text.indexOf('\n-->\n') + '\n-->\n'.length;
  const [head, ...blocks] = text.slice(end).split('\n## ');
  return text.slice(0, end) + [head, ...blocks.map((block) => {
    if (!block.startsWith(`${id} `)) return block;
    let out = block.replace(/^State: .*$/m, 'State: confirmed').replace(/^By:.*$/m, 'By: Sam Okafor').replace(/^On:.*$/m, 'On: 2026-11-20');
    for (const [field, value] of Object.entries(fill)) out = out.replace(new RegExp(`^${field}:.*$`, 'm'), `${field}: ${value}`);
    return out;
  })].join('\n## ');
};

test('item 5: a list document\'s count lines say what an entry needs, naming what each entry named still lacks; followed literally, the worksheet has no problem and the line is gone', () => {
  // The cleaning schedule: an entry with nothing filled in, and one proposed with everything it needs.
  const blank = entry('CS-01', 'Walk-in fridge', { State: 'unanswered' });
  const cleaning = sheet(blank, FLOOR.replace('## CS-03', '## CS-02'));
  const csDir = cafeWith(cleaning);
  assert.deepEqual(countLinesOf(csDir, 'FOODCS'), [
    `1 cleaning item in food-safety/answers-cleaning.md is not yet confirmed (CS-01): ${COUNTS_WHEN}; CS-01 still needs Frequency and Method`,
    `1 cleaning item in food-safety/answers-cleaning.md is proposed but not confirmed (CS-02): ${COUNTS_WHEN}`
  ]);
  // Why the line says more than State, By and On: an entry confirmed with only those is not read, for what it lacks.
  assert.deepEqual(algParse(followed(cleaning, 'CS-01', {})).problems.map((p) => p.message), ['CS-01 is confirmed, so it needs Frequency',
    'CS-01 is confirmed, so it needs Method']);
  const csDone = followed(followed(cleaning, 'CS-01', { Frequency: FREQUENCIES[1], Method: 'Empty it, then wipe the shelves with the sanitiser.' }), 'CS-02', {});
  assert.deepEqual(algParse(csDone).problems, []);
  assert.deepEqual(countLinesOf(cafeWith(csDone), 'FOODCS'), []);

  // The suppliers and contacts: an entry with nothing filled in lacks Kind. The guidance, which the line names first, says
  // what each Kind needs besides: a contact a Telephone or an Email.
  const nameless = supEntry('SUP-03', 'Swift Pest Control', { State: 'unanswered' });
  const suppliers = supSheet(GROCER, TEAM, nameless);
  assert.deepEqual(countLinesOf(cafeSuppliers(suppliers), 'FOODSUP'), [
    `1 entry in food-safety/answers-suppliers.md is not yet confirmed (SUP-03): ${COUNTS_WHEN}; SUP-03 still needs Kind`
  ]);
  assert.ok(blankWorksheet('suppliers', data).replace(/\s+/g, ' ').includes('A supplier needs Goods-supplied too, and a contact or the environmental ' +
    'health team a Telephone or an Email, or both.'));
  const supDone = followed(suppliers, 'SUP-03', { Kind: 'contact', Telephone: '01632 960477' });
  assert.deepEqual(algParse(supDone).problems, []);
  assert.deepEqual(countLinesOf(cafeSuppliers(supDone), 'FOODSUP'), []);
  // Once its Kind is given, what that Kind needs is named too.
  const kinded = supSheet(GROCER, TEAM, supEntry('SUP-03', 'Swift Pest Control', { Kind: 'contact', State: 'unanswered' }));
  assert.deepEqual(countLinesOf(cafeSuppliers(kinded), 'FOODSUP'), [
    `1 entry in food-safety/answers-suppliers.md is not yet confirmed (SUP-03): ${COUNTS_WHEN}; SUP-03 still needs Telephone or Email`
  ]);

  // The allergen information: a dish with nothing filled in lacks what it was checked against, and when.
  const allergens = algSheet(dish('DISH-01', 'Toastie', DONE), dish('DISH-02', 'Soup of the day', { State: 'unanswered' }),
    dish('DISH-03', 'Scone', { ...DONE, 'Checked-on': '', State: 'unanswered', By: '', On: '' }));
  const algDir = cafeAlg(allergens, MG_ANSWERED());
  assert.deepEqual(countLinesOf(algDir, 'FOODALG'), [
    `2 dishes in food-safety/answers-allergens.md are not yet confirmed (DISH-02 and DISH-03): ${COUNTS_WHEN}; DISH-02 still needs Checked-against ` +
      'and Checked-on; DISH-03 still needs Checked-on'
  ]);
  const algDone = followed(followed(allergens, 'DISH-02', { 'Checked-against': 'The soup base label', 'Checked-on': '2026-11-19' }), 'DISH-03',
    { 'Checked-on': '2026-11-19' });
  assert.deepEqual(algParse(algDone).problems, []);
  assert.deepEqual(countLinesOf(cafeAlg(algDone, MG_ANSWERED()), 'FOODALG'), []);

  // Up to five entries are named, and what each of those lacks; the rest are counted.
  const many = sheet(...[1, 2, 3, 4, 5, 6, 7].map((n) => entry(`CS-0${n}`, `Item ${n}`, { State: 'unanswered', Method: n === 2 ? 'Wipe it.' : '' })));
  assert.deepEqual(countLinesOf(cafeWith(many), 'FOODCS'), [`7 cleaning items in food-safety/answers-cleaning.md are not yet confirmed (CS-01, CS-02, ` +
    `CS-03, CS-04, CS-05 and 2 more): ${COUNTS_WHEN}; CS-01 still needs Frequency and Method; CS-02 still needs Frequency; CS-03 still needs ` +
    'Frequency and Method; CS-04 still needs Frequency and Method; CS-05 still needs Frequency and Method']);
  // A worksheet of questions, and the own methods worksheet, keep the words they always had.
  const cafeLines = projectStatus(CAFE, data, { today: TODAY }).unfinished;
  assert.ok(cafeLines.some(({ code, what }) => code === 'FOODXC' && what.endsWith(': an answer counts when its State is confirmed and By and On are filled in')));
});
