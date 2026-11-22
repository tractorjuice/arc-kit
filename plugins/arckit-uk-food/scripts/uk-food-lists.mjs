import { DATA_ID, isObject } from './uk-food-data.mjs';
import {
  addListWorksheets, blockTools, fieldKey, fieldLines, quotedBy, readBlocks, standard, STATE_WORDS, STATES, WORKSHEET_VERSION
} from './uk-food-worksheet.mjs';
import { businessText, notConfirmed, said, tableLines, UNANSWERED } from './uk-food-document.mjs';

// ---------------------------------------------------------------------------------------------
// List worksheets, and the documents printed from them. A list worksheet holds the entries of one list a
// business keeps (the things it cleans, and later its dishes and its suppliers), one entry to a "## "
// heading, or says that the business keeps that list somewhere else. It has the own worksheet's grammar
// and is read by the same reader (readBlocks), with the same slips read as meant, the same refusal of
// characters a reader cannot see, and the same guidance comment, which is the tool's own and which
// upgrade-worksheet puts right. Its only FSA words are those read from the data.
//
// A list worksheet, after its title and marker line:
// - the guidance comment, ending with an entry to copy;
// - "## Kept elsewhere", with Where, State, By, On and Source: where the business keeps this list, if it
//   keeps it somewhere else. Blank, with State unanswered, when it does not;
// - the entries, "## CS-01 Name of the item" and so on, each with its list's fields, then State, By, On and
//   Source.
// Only a confirmed entry, and Kept elsewhere when it is confirmed, is printed as the business's. An entry
// that is not confirmed, and a Kept elsewhere that holds anything and is not confirmed, is named in the
// document as not yet confirmed, so that nothing a person wrote is left out without a word.
//
// This module loads after the worksheet module and may read it as it loads. It imports the document
// module too, which imports it, so nothing of the document module is read here until a function runs.
// ---------------------------------------------------------------------------------------------

// The block that says a list is kept somewhere else, and its fields.
const ELSEWHERE = 'Kept elsewhere';
const ELSEWHERE_FIELDS = ['Where', 'State', 'By', 'On', 'Source'];
const BLANK_ELSEWHERE = { where: '', state: 'unanswered', by: '', on: '', source: '' };
// The fields every entry ends with, after its list's own.
const STATE_FIELDS = ['State', 'By', 'On', 'Source'];
const entryFields = (list) => [...list.fields, ...STATE_FIELDS];
const orList = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} or ${items.at(-1)}`);

// The pack's cleaning schedule form (diary page 91), found by its form name and page. The cleaning schedule
// document prints its columns as its header row. Its one column group spans the frequencies a cleaning entry
// takes, between the item column and the last two (precautions and method); the last of the frequencies is
// the one whose frequency the business says in its own words, in Other-frequency. A test ties this to the data.
export const CLEANING_FORM = { form: 'cleaningSchedule', page: 91 };
// The form's columns and frequencies, or null when the data lacks the form or lays it out otherwise.
function cleaningForm(data) {
  const { form, page } = CLEANING_FORM;
  const block = data.diary?.pages?.find((p) => p.page === page)?.blocks?.find((b) => b.form === form);
  const groups = block?.columnGroups ?? [];
  if (groups.length !== 1 || groups[0].from !== 1 || groups[0].to !== block.columns.length - 3) return null;
  return { columns: block.columns, frequencies: block.columns.slice(groups[0].from, groups[0].to + 1) };
}

// The lists, one object each. A list's fields:
// - section: its worksheet's section, as in answers-<section>.md; prefix: its entries' identifiers start
//   with it (CS-01); title: the worksheet's title and the document's heading; each: what one entry is, as
//   "Add an entry for each ..." says it; entryTitle: the words on the heading of the entry given to copy.
// - fields: the fields of an entry, in the worksheet's order, before State, By, On and Source.
// - values: for a field whose value is one of a set, a reader taking (value, data) and giving { value }, the
//   value in its standard form, or { error }, which says what is wrong after `<field> "<value>"`. A value
//   read is kept in its standard form whatever the entry's State; one with an error is reported only once
//   the entry is proposed or confirmed, as until then it holds what has been given so far, as it was given.
// - check(entry, data): what is wrong across one proposed or confirmed entry, as [{ field, message }]: a
//   field filled in that its other values do not use (as STATUS_USES does for a safe method).
// - checkList(entries, data), when a list needs it: what is wrong across the entries, as [{ id, field,
//   message }], such as two entries of a kind of which there may be one.
// - needs(entry, data): what a proposed or confirmed entry still lacks, each a field's name or a few words
//   that name fields ("Telephone or Email"). An entry is answered only when it is confirmed, its By and On
//   are valid and this is empty.
// - guidance(data): the guidance lines particular to the list, which guidanceOf puts with those every list
//   shares; quoted: what the line naming the pack says of them (null when they quote nothing of the pack).
// - elsewhereLabel: the list as "The business keeps a ... elsewhere" names it.
// - lacking(data, where): what the data lacks that the list is read or printed from, as a sentence
//   starting with `where` ('the data' unless given), or null.
export const LISTS = {
  cleaning: {
    section: 'cleaning', prefix: 'CS', title: 'Cleaning schedule', entryTitle: 'Name of the item', elsewhereLabel: 'cleaning schedule',
    fields: ['Frequency', 'Other-frequency', 'Precautions', 'Method'],
    values: {
      Frequency: (value, data) => {
        const { frequencies } = cleaningForm(data);
        const found = standard(value.replace(/\s+/g, ' '), frequencies);
        return frequencies.includes(found) ? { value: found }
          : { error: `is not one of the frequencies the pack's cleaning schedule names: ${orList(frequencies)}` };
      }
    },
    check: (entry, data) => {
      const { frequencies } = cleaningForm(data);
      const other = frequencies.at(-1);
      return entry.otherFrequency && frequencies.includes(entry.frequency) && entry.frequency !== other
        ? [{ field: 'Other-frequency', message: `Other-frequency is only for an entry whose Frequency is ${other}: clear it, or set Frequency to ${other}` }]
        : [];
    },
    needs: (entry, data) => [...(entry.frequency ? [] : ['Frequency']), ...(entry.method ? [] : ['Method']),
      ...(entry.frequency === cleaningForm(data).frequencies.at(-1) && !entry.otherFrequency ? ['Other-frequency'] : [])],
    each: 'item the business cleans',
    guidance: (data) => {
      const { frequencies } = cleaningForm(data);
      const other = frequencies.at(-1);
      return [
        `Frequency is how often the item is cleaned: one of ${frequencies.join('; ')}.`,
        `For ${other}, write how often in Other-frequency, in your own words; for any other Frequency, leave`,
        'Other-frequency empty.',
        'Precautions is anything to take care over while cleaning the item. Method is how the item is cleaned,',
        'with any chemicals and equipment it is cleaned with.',
        `An entry needs Frequency and Method before it can be proposed or confirmed, and Other-frequency too when`,
        `Frequency is ${other}.`
      ];
    },
    quoted: 'The frequencies named above are quoted from',
    lacking: (data, where = 'the data') => (cleaningForm(data) ? null : `${where} has no ${CLEANING_FORM.form} form on page ` +
      `${CLEANING_FORM.page} of diary.json in the layout the cleaning schedule is printed from: the item, one group of frequency ` +
      'columns, then two more columns')
  }
};
export const LIST_SECTIONS = Object.keys(LISTS).sort();

// A list worksheet's guidance comment, without its marks: how to add an entry, the list's own lines, then
// what every list shares, then where any of the pack's words in it come from, then the entry to copy. It is
// compared line by line when a worksheet is read, as every worksheet's guidance is (see readBlocks).
const guidanceOf = (list, data) => [
  `Add an entry for each ${list.each}: copy the lines from "## ${list.prefix}-01" down, paste them below the`,
  `Kept elsewhere block, number the entries ${list.prefix}-01, ${list.prefix}-02 and so on, and write each entry's name`,
  'after its number.',
  ...list.guidance(data),
  `If the business keeps its ${list.elsewhereLabel} somewhere else, write where in Where, under Kept elsewhere.`,
  'Entries may be listed here as well: both are printed.',
  'To carry a value on to more lines, start each extra line with two spaces, straight after the line before',
  'it, with no blank line between.',
  'State says where an entry, or Kept elsewhere, stands: unanswered (it may hold what has been given so far; By and On stay empty);',
  `${STATE_WORDS[0]};`,
  `or ${STATE_WORDS[1]}.`,
  'Only a confirmed entry, or a confirmed Kept elsewhere, goes into your documents. An entry that is not',
  'confirmed, and a Kept elsewhere that holds anything and is not confirmed, is named there as not yet confirmed.',
  ...(isObject(data.source) && list.quoted ? [quotedBy(list.quoted, data.source)] : []),
  '',
  `## ${list.prefix}-01 ${list.entryTitle}`,
  '',
  ...entryFields(list).map((field) => (field === 'State' ? 'State: unanswered' : `${field}:`))
];

// Reads a list worksheet, from the reading beginReading began, as readWorksheet reads the others: pass 1
// by readBlocks, then the Kept elsewhere block and each entry into records, checked field by field. Gives
// { parsed, layout }, `parsed` holding `elsewhere` (its record, blank and unanswered when the block is not
// there) and `entries`, each { id, title, line, the list's fields, state, by, on, source, answered }.
function readList(reading, data) {
  const { parsed, report, finish, markerLine, section } = reading;
  const list = LISTS[section];
  const lacking = list.lacking(data);
  if (lacking) {
    report(markerLine, `${lacking}, so this ${section} worksheet cannot be read`);
    return finish();
  }
  parsed.section = section;
  const fields = entryFields(list);
  const seen = readBlocks(reading, {
    guidance: ['<!--', ...guidanceOf(list, data), '-->'],
    names: new Map([...fields, ...ELSEWHERE_FIELDS].map((field) => [field.toLowerCase(), field])),
    kinds: { entry: { fields, called: `an entry of the ${list.title.toLowerCase()}` }, elsewhere: { fields: ELSEWHERE_FIELDS, called: `the ${ELSEWHERE} block` } },
    heading: ({ title, id, rest, at, raw }, { seen: found, open, hidden }) => {
      if (title.replace(/\s+/g, ' ').toLowerCase() === ELSEWHERE.toLowerCase()) {
        if (found.elsewhere) report(at, `${ELSEWHERE} appears more than once; only the first is read`);
        else {
          found.elsewhere = open('elsewhere', ELSEWHERE, at);
          return { block: found.elsewhere, method: null };
        }
      } else if (!id.startsWith(`${list.prefix}-`) || !/^\d{2}$/.test(id.slice(list.prefix.length + 1))) {
        report(at, `"## ${title}" is not read: number the entries ${list.prefix}-01, ${list.prefix}-02 and so on, each with its ` +
          `name after its number, or head the block that says where the list is kept "## ${ELSEWHERE}"`);
      } else if (found.entry.has(id)) {
        report(at, `${id} appears more than once; only the first is read`);
      } else {
        const block = open('entry', id, at, { title: rest });
        found.entry.set(id, block);
        // The name is printed in the document, so it is a value like any other.
        hidden(raw, at, block);
        return { block, method: null };
      }
      return null;
    }
  });
  const { get, lineOf, needs, checkState } = blockTools(report);

  // A name and a date belong to a confirmation, so Kept elsewhere unanswered has neither; it may hold Where
  // and Source, kept as they are and not printed as the business's.
  const kept = seen.elsewhere;
  const elsewhere = { line: kept?.line ?? null };
  for (const name of ELSEWHERE_FIELDS) elsewhere[fieldKey(name)] = kept ? get(kept, name) : BLANK_ELSEWHERE[fieldKey(name)];
  elsewhere.state = standard(elsewhere.state, STATES);
  if (kept) {
    checkState(kept, ELSEWHERE, elsewhere.state, ['By', 'On']);
    if (elsewhere.state === 'proposed') needs(kept, ELSEWHERE, ['Where', 'Source'], 'proposed');
    if (elsewhere.state === 'confirmed') needs(kept, ELSEWHERE, ['Where'], 'confirmed');
  }
  elsewhere.answered = Boolean(kept) && elsewhere.state === 'confirmed' && !kept.faulty;
  parsed.elsewhere = elsewhere;

  for (const block of seen.entry.values()) {
    const entry = { id: block.id, title: block.title, line: block.line };
    for (const name of fields) entry[fieldKey(name)] = get(block, name);
    entry.state = standard(entry.state, STATES);
    if (!entry.title) report(block.line, `${block.id} has no name: write it after ${block.id} on its heading`, block);
    // An unanswered entry holds what has been given so far, as it was given: its values are checked once it
    // is proposed or confirmed. It is never printed as the business's.
    const held = entry.state === 'unanswered';
    for (const [name, read] of Object.entries(list.values ?? {})) {
      const typed = entry[fieldKey(name)];
      if (!typed) continue;
      const result = read(typed, data);
      if (!result.error) entry[fieldKey(name)] = result.value;
      else if (!held) report(lineOf(block, name), `${block.id}: ${name} "${typed}" ${result.error}`, block);
    }
    if (!held) for (const { field, message } of list.check?.(entry, data) ?? []) report(lineOf(block, field), `${block.id}: ${message}`, block);
    checkState(block, block.id, entry.state, ['By', 'On']);
    if (entry.state === 'proposed' || entry.state === 'confirmed') {
      for (const name of list.needs(entry, data)) report(lineOf(block, name), `${block.id} is ${entry.state}, so it needs ${name}`, block);
      if (entry.state === 'proposed') needs(block, block.id, ['Source'], 'proposed');
    }
    entry.answered = entry.state === 'confirmed' && !block.faulty;
    parsed.entries.set(block.id, entry);
  }
  for (const { id, field, message } of list.checkList?.([...parsed.entries.values()], data) ?? []) {
    const block = seen.entry.get(id);
    report(lineOf(block, field), message, block);
    parsed.entries.get(id).answered = false;
  }
  return finish();
}

// Writes a list worksheet from a parsed one: its title, marker and guidance afresh, then the Kept elsewhere
// block and each entry with every field as it was read. readList reads back what this writes, unchanged.
// emitWorksheet has refused a parsed worksheet with problems, or for other data, before it calls this.
function emitList(parsed, data) {
  const list = LISTS[parsed.section];
  const lacking = list.lacking(data);
  if (lacking) throw new Error(lacking);
  const elsewhere = parsed.elsewhere ?? BLANK_ELSEWHERE;
  const blocks = [
    [`# Answers: ${list.title} (${list.section})`, '', `<!-- uk-food-answers ${WORKSHEET_VERSION} data=${DATA_ID} section=${list.section} -->`],
    ['<!--', ...guidanceOf(list, data), '-->'],
    [`## ${ELSEWHERE}`, '', ...ELSEWHERE_FIELDS.flatMap((field) => fieldLines(field, elsewhere[fieldKey(field)]))],
    ...[...parsed.entries.values()].map((entry) => [`## ${entry.id}${entry.title ? ` ${entry.title}` : ''}`, '',
      ...entryFields(list).flatMap((field) => fieldLines(field, entry[fieldKey(field)]))])
  ];
  return `${blocks.map((block) => block.join('\n')).join('\n\n')}\n`;
}

addListWorksheets({ sections: LIST_SECTIONS, read: readList, emit: emitList, guidance: (section, data) => guidanceOf(LISTS[section], data) });

// ---------------------------------------------------------------------------------------------
// The list documents. Each prints its list's confirmed entries, says where the business keeps the list
// when it says it keeps it elsewhere, and names whatever is not confirmed, in the line notConfirmed prints.
// With no confirmed entry and no confirmed Kept elsewhere, it says so, with UNANSWERED.
// ---------------------------------------------------------------------------------------------

// Whether a Kept elsewhere holds anything a person wrote.
const elsewhereGiven = (elsewhere) => Boolean(elsewhere.where || elsewhere.by || elsewhere.on || elsewhere.source) ||
  elsewhere.state !== 'unanswered';
// What a list document names as not yet confirmed, as notConfirmed takes them.
const pending = (parsed) => [...(elsewhereGiven(parsed.elsewhere) ? [{ id: ELSEWHERE, answered: parsed.elsewhere.answered }] : []),
  ...parsed.entries.values()];

// What a person confirms for a list document, from its worksheet, as a row's asks gives it to status (whose
// counts are what sign-off refuses on): each entry, and Kept elsewhere when it holds anything or there is no
// entry. So something is counted as not confirmed exactly when the document shows it unfinished: an entry or
// a Kept elsewhere not confirmed, or neither an entry nor Kept elsewhere confirmed.
export function listAsked(sheet) {
  const parsed = sheet?.parsed;
  const entries = [...(parsed?.entries.values() ?? [])].map((entry) => [entry.id, entry]);
  const elsewhere = parsed?.elsewhere;
  return { items: [...(elsewhere && (elsewhereGiven(elsewhere) || !entries.length) ? [[ELSEWHERE, elsewhere]] : []), ...entries] };
}

// The line a list document prints when Kept elsewhere is confirmed: where, and who said so and when.
const elsewhereChunks = (list, elsewhere) => (elsewhere.answered
  ? [[`The business keeps a ${list.elsewhereLabel} elsewhere: ${said(elsewhere.where)} (said by ${said(elsewhere.by)}, ${said(elsewhere.on)}).`]]
  : []);
// Who agreed an entry the document prints, and when, on a line of its own under its table.
const agreedLine = (entry) => `- ${entry.id} ${said(entry.title)}: ${said(entry.by)}, ${said(entry.on)}`;

// The cleaning schedule document: the pack's form, with a row for each confirmed entry, an X under its
// frequency (or, under the last frequency, the business's own words for it), and its precautions and method
// in the business's words. The form has no column for who agreed a row, and none is added: they are listed
// under the table.
export function cleaningScheduleChunks(sources, data) {
  const list = LISTS.cleaning;
  const { parsed } = sources.get(list.section);
  const { columns, frequencies } = cleaningForm(data);
  const other = frequencies.at(-1);
  const confirmed = [...parsed.entries.values()].filter((entry) => entry.answered);
  const kept = elsewhereChunks(list, parsed.elsewhere);
  const cells = (entry) => [businessText(entry.title),
    ...frequencies.map((frequency) => (entry.frequency !== frequency ? '' : frequency === other ? businessText(entry.otherFrequency) : 'X')),
    businessText(entry.precautions), businessText(entry.method)];
  const listed = confirmed.length ? [tableLines(columns, confirmed.map(cells)), ['Agreed by:'], confirmed.map(agreedLine)]
    : kept.length ? [] : [[`The cleaning schedule has no confirmed items yet: ${UNANSWERED}`]];
  return [[`## ${list.title}`], ...kept, ...listed, ...notConfirmed(pending(parsed))];
}
