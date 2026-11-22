import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CLEANING_FORM, DATA_ID, DEFAULT_DATA_DIR, DOCUMENTS, LIST_SECTIONS, LISTS, UNANSWERED, WORKSHEET_SECTIONS, beginReading, blankWorksheet,
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
  assert.deepEqual(LIST_SECTIONS, ['cleaning']);
  for (const section of LIST_SECTIONS) {
    assert.ok(WORKSHEET_SECTIONS.includes(section), section);
    assert.equal(LISTS[section].section, section);
    for (const field of ['prefix', 'title', 'elsewhereLabel']) assert.equal(typeof LISTS[section][field], 'string', `${section} ${field}`);
    assert.ok(Array.isArray(LISTS[section].fields), section);
    assert.equal(typeof LISTS[section].needs, 'function', section);
    assert.equal(typeof LISTS[section].guidance, 'function', section);
  }
  assert.deepEqual(WORKSHEET_SECTIONS.slice(0, 7), ['XC', 'CL', 'CH', 'CK', 'MG', 'profile', 'own']);
  assert.deepEqual(LISTS.cleaning.fields, ['Frequency', 'Other-frequency', 'Precautions', 'Method']);
  assert.equal(LISTS.cleaning.prefix, 'CS');
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

test('status lists the cleaning schedule after the own methods document, counting its entries', () => {
  const documents = projectStatus(CAFE, data).documents;
  const codes = documents.map((d) => d.code);
  assert.equal(codes[codes.indexOf('FOODOWN') + 1], 'FOODCS');
  const doc = documents.find((d) => d.code === 'FOODCS');
  assert.deepEqual(doc.worksheets, ['answers-cleaning.md', 'answers-profile.md']);
  assert.deepEqual([doc.questions, doc.confirmed, doc.proposed, doc.unanswered], [4, 3, 1, 0]);
  assert.match(mainSays('status', '--project', CAFE).out, /^FOODCS \(Cleaning schedule\): 3 of 4 cleaning items confirmed, 1 proposed; not written; not signed off$/m);
});

// ---- What status and sign-off say of a list document (review round 1) ----

const NOT_WRITTEN = 'document not written yet: write the document from its worksheet';
const NOT_SIGNED = 'document not signed off yet: once it is finished, a named person signs it off';
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
      ['worksheet food-safety/answers-cleaning.md is not started yet: make it with worksheet --section cleaning and fill it in']],
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
      ['1 cleaning item in food-safety/answers-cleaning.md is proposed but not confirmed (CS-04): an entry counts when its State is ' +
        'confirmed and By and On are filled in']]
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
