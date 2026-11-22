import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CLEANING_FORM, DATA_ID, DEFAULT_DATA_DIR, LIST_SECTIONS, LISTS, WORKSHEET_SECTIONS, blankWorksheet, emitWorksheet, loadData,
  parseWorksheet, upgradeWorksheet
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
