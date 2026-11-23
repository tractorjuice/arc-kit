import { DATA_ID, diaryPage, isObject, isWords } from './uk-food-data.mjs';
import {
  addListWorksheets, andList, blockTools, codePoint, counted, fieldKey, fieldLines, isAre, isIsoDate, longDate, methodQuestions, quotedBy, readBlocks,
  standard, STATE_WORDS, STATES, WORKSHEET_VERSION
} from './uk-food-worksheet.mjs';
import {
  businessText, NOT_CONFIRMED, NOT_CONFIRMED_CELL, notConfirmed, notRelevantLine, packBlockChunks, questionCell, said, sectionView, tableLines,
  UNANSWERED, variationLine, worksheetName
} from './uk-food-document.mjs';

// ---------------------------------------------------------------------------------------------
// List worksheets, and the documents printed from them. A list worksheet holds the entries of one list a
// business keeps (the things it cleans, its suppliers and contacts, and later its dishes), one entry to a "## "
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
// that is not confirmed, and a Kept elsewhere that holds anything and is not confirmed, are named in the
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
// What an entry lacks, as a list's needs gives it: the field whose line the problem is told at, and what the problem
// says is needed, which is the field's name unless the need is met by either of two fields ("Telephone or Email").
const need = (field, says = field) => ({ field, says });
const orList = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} or ${items.at(-1)}`);

// The pack's cleaning schedule form (diary page 91), found by its form name and page. The cleaning schedule
// document prints its columns as its header row. Its one column group spans the frequencies a cleaning entry
// takes, between the item column and the last two (precautions and method); the last of the frequencies is
// the one whose frequency the business says in its own words, in Other-frequency. A test ties this to the data.
export const CLEANING_FORM = { form: 'cleaningSchedule', page: 91 };
// The form's columns and frequencies, or null when the data lacks the form or lays it out otherwise.
function cleaningForm(data) {
  const { form, page } = CLEANING_FORM;
  const block = diaryPage(data, page)?.blocks?.find((b) => b.form === form);
  const groups = block?.columnGroups ?? [];
  if (groups.length !== 1 || groups[0].from !== 1 || groups[0].to !== block.columns.length - 3) return null;
  return { columns: block.columns, frequencies: block.columns.slice(groups[0].from, groups[0].to + 1) };
}

// The pack's suppliers' list form (diary pages 87 and 88, a box to each supplier) and its contacts list form (pages
// 89 and 90: the environmental health team's box first, then a box to each other contact), each found by its form
// name and the page its first box is on. The suppliers and contacts document prints their labels beside the
// business's words, and the team's box with the pack's own list of what the team advises on. A test ties both to
// the data.
export const SUPPLIERS_FORM = { form: 'suppliersList', page: 87 };
export const CONTACTS_FORM = { form: 'contactsList', page: 89 };
// Where each label the document prints sits in a box of the form, as [row, column], a null row being the box's
// column headings. The fields are the entry's (title being its name), in the order the document prints them, which is
// the order the box reads in: a supplier's name and delivery days head its box, the lead time sits under the delivery
// days, the contact name and goods supplied side by side, then telephone, email and address, each above a blank row.
const SUPPLIER_CELLS = [['title', null, 0], ['deliveryDays', null, 1], ['leadTime', 0, 1], ['contactName', 1, 0], ['goodsSupplied', 1, 1],
  ['telephone', 3, 0], ['email', 5, 0], ['address', 7, 0]];
// A contact's box, and the team's: its heading, the contact name, telephone, email and address down its first column,
// and "useful for advice on" heading its second, printed last here. The team's box has the pack's list under that
// heading (TEAM_ADVICE), where another contact's leaves room for the business's own words.
const CONTACT_CELLS = [['title', null, 0], ['contactName', 0, 0], ['telephone', 1, 0], ['email', 2, 0], ['address', 3, 0], ['usefulFor', null, 1]];
const TEAM_ADVICE = [0, 1];
const boxCell = (box, [row, column]) => (row === null ? box?.columns : box?.rows?.[row])?.[column];
// The labels of a box, as [field, label] in the order of `cells`, or null when the box is missing or any of them is
// not there: the document is then not printed (see lacking), rather than printed with a label left out.
const labelsOf = (box, cells) => {
  const labels = cells.map(([field, ...at]) => [field, boxCell(box, at)]);
  return labels.every(([, label]) => isWords(label)) ? labels : null;
};
// The labels of a supplier's box, the team's and another contact's, and the pack's list of what the team advises on;
// or null when the data lacks either form or lays one out otherwise. The boxes are the first of their form on its
// page that the pack prints for a business to fill in: never its filled-in example (blocks marked fromImage), which
// is an invented business's words and is never printed.
function supplierForms(data) {
  const boxes = ({ form, page }) => diaryPage(data, page)?.blocks
    ?.filter((b) => b.form === form && b.kind === 'table' && !b.fromImage) ?? [];
  const [supplierBox] = boxes(SUPPLIERS_FORM);
  const [teamBox, contactBox] = boxes(CONTACTS_FORM);
  const [supplier, team, contact] = [[supplierBox, SUPPLIER_CELLS], [teamBox, CONTACT_CELLS], [contactBox, CONTACT_CELLS]]
    .map(([box, cells]) => labelsOf(box, cells));
  const advice = boxCell(teamBox, TEAM_ADVICE);
  if (!supplier || !team || !contact || !isWords(advice) || boxCell(contactBox, TEAM_ADVICE) !== '') return null;
  return { supplier, team, contact, advice };
}

// The kinds of entry a suppliers worksheet holds, and the fields that belong to one kind alone: a field another kind
// fills in is a problem, as STATUS_USES has it for a safe method, since the document would show it nowhere. The team's
// box prints the pack's own list of what the team advises on, so the team has no Useful-for of its own.
const TEAM = 'environmental-health';
const SUPPLIER_KINDS = ['supplier', 'contact', TEAM];
const KIND_ONLY = { 'Delivery-days': 'supplier', 'Lead-time': 'supplier', 'Goods-supplied': 'supplier', 'Useful-for': 'contact' };

// The pack's table of the fourteen allergens and where each may be found (in XC-04, on page 20), found by its safe method
// and page: the one table there. The allergen information prints it whole, and heads its Dishes table with its names.
// ALLERGEN_FIELDS are the allergens worksheet's fields for the fourteen, in the table's order: the helper's names for
// the cells a person fills in, never printed as the pack's. Each, with its hyphens read as spaces, is the start of its
// row's name in any letter case: allergensOf will not read the table otherwise, and a test ties both to the data.
export const ALLERGEN_TABLE = { method: 'XC-04', page: 20 };
const ALLERGEN_FIELDS = ['Nuts', 'Peanuts', 'Eggs', 'Milk', 'Fish', 'Crustaceans', 'Molluscs', 'Cereals-containing-gluten', 'Celery', 'Lupin',
  'Mustard', 'Sesame-seeds', 'Soya', 'Sulphur-dioxide'];
// A safe method of the data, by its identifier, whichever section holds it.
const methodOf = (data, id) => [...(data.sections?.values() ?? [])].flatMap((file) => file.methods ?? []).find((method) => method.id === id);
// The table's block, or null when the data has none, or more than one, there.
const allergenBlock = (data) => {
  const blocks = methodOf(data, ALLERGEN_TABLE.method)?.blocks?.filter((block) => block.kind === 'table' && block.page === ALLERGEN_TABLE.page) ?? [];
  return blocks.length === 1 ? blocks[0] : null;
};
// The fourteen allergens, in the pack's order, as [{ field, name, found }]: `name` the first cell of its row as the pack
// prints it, `found` the second (where the pack says it may be found), `field` the worksheet's field for it. Null when the
// data lacks the table, or lays it out otherwise: fourteen rows of two cells, each starting with the allergen its field
// names. Nothing is printed from a table that is not that, so no field is ever printed beside another allergen's name.
export function allergensOf(data) {
  const rows = allergenBlock(data)?.rows;
  if (rows?.length !== ALLERGEN_FIELDS.length) return null;
  const read = rows.map((row, i) => ({ field: ALLERGEN_FIELDS[i], name: row[0], found: row[1], cells: row.length }));
  const fits = ({ field, name, found, cells }) => cells === 2 && isWords(name) && isWords(found) &&
    name.toLowerCase().startsWith(field.replace(/-/g, ' ').toLowerCase());
  return read.every(fits) ? read.map(({ field, name, found }) => ({ field, name, found })) : null;
}
// The heading the Dishes table gives an allergen: its name as the pack prints it, cut at its first " (", which leaves the
// pack's own word for it without the list of what it takes in, printed whole in the table above.
const shortName = (name) => name.split(' (')[0];

// The paragraphs of MG-04 the allergen information quotes, each whole, never cut inside a paragraph (each paragraph is a
// line of the data's text), and each located by its safety point and its place in that point's text:
// - PPDS_PARAGRAPH, the pack's sentence on labelling food prepacked for direct sale, in the first safety point;
// - FREE_FROM_POINT, the safety point on page 71 that holds the pack's conditions for advertising food as free from an
//   allergen: one paragraph of its point and one of its reason.
// A test ties each to the data: the paragraph found holds the words it is quoted for, and no other paragraph of the same
// text does. The words themselves are never typed here.
export const PPDS_PARAGRAPH = { point: 'MG-04-P01', paragraph: 1 };
export const FREE_FROM_POINT = { point: 'MG-04-P04', page: 71, paragraph: 1, reasonParagraph: 1 };
// The three questions of MG-04 on how customers are told, whose answers in the Management worksheet the allergen
// information repeats (call 7): where the allergen information is kept, where the signposting is, and how customers
// ordering by phone or online are told. A test ties each to a text question of MG-04.
export const CUSTOMER_QUESTIONS = { method: 'MG-04', questions: ['MG-04-Q01', 'MG-04-Q06', 'MG-04-Q14'] };
// What the allergen information quotes from MG-04: { method, ppds, freeFrom: [point's paragraph, reason's paragraph],
// questions }, or null when the data lacks any of it.
function allergenQuotes(data) {
  const method = methodOf(data, CUSTOMER_QUESTIONS.method);
  if (!method) return null;
  const rows = method.blocks.filter((block) => block.kind === 'points').flatMap((block) => block.rows ?? []);
  const rowOf = (id) => rows.find((row) => row.id === id);
  const paragraph = (text, index) => (typeof text === 'string' ? text.split('\n')[index] : undefined);
  const ppds = paragraph(rowOf(PPDS_PARAGRAPH.point)?.point, PPDS_PARAGRAPH.paragraph);
  const free = rowOf(FREE_FROM_POINT.point);
  const freeFrom = free?.page === FREE_FROM_POINT.page
    ? [paragraph(free.point, FREE_FROM_POINT.paragraph), paragraph(free.why, FREE_FROM_POINT.reasonParagraph)] : [];
  const asked = methodQuestions(method).map(({ question }) => question);
  const questions = CUSTOMER_QUESTIONS.questions.map((id) => asked.find((question) => question.id === id));
  if (!isWords(ppds) || freeFrom.length !== 2 || !freeFrom.every(isWords) || !questions.every((question) => question?.type === 'text')) return null;
  return { method, ppds, freeFrom, questions };
}

// What an allergen cell may hold: exactly one of the two, read in any letter case and with any run of spaces between the
// words, and kept in this spelling; or nothing, which the document prints as not confirmed. There is no shorthand, on
// purpose: "no", "none", "n/a", "x" or a tick could each be read two ways, and a cell read the wrong way is the worst
// thing this overlay could print. A precautionary "may contain", or any other remark, is a note, and goes in Notes.
const CELL_VALUES = ['contains', 'does not contain'];
const cellValue = (value) => {
  const found = standard(value.replace(/ +/g, ' '), CELL_VALUES);
  if (CELL_VALUES.includes(found)) return { value: found };
  // A character that is not a plain printable one (a no-break space, a tab, a line break, a letter of another alphabet
  // that looks like ours) can make a value look exactly like one of the two when it is not, so the message names it by
  // its code point, as the message for a character that cannot be seen does: otherwise it would seem to refuse the very
  // words it asks for. It says to type the value again only when that is the fault: when the value would be one of the
  // two with each such character made a plain space, or a plain letter. A value wrong in substance (a tick, "may contain
  // – traces") would be no better typed again, and the rest of the message says what to write.
  const plain = /[^\x20-\x7E]/u;
  const odd = [...new Set(value.match(/[^\x20-\x7E]/gu) ?? [])].map(codePoint);
  const spaced = value.replace(/[^\x20-\x7E]/gu, ' ').replace(/ +/g, ' ').trim().toLowerCase();
  const lettered = new RegExp(`^${[...value].map((char) => (plain.test(char) ? '[a-z]' : char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('')}$`, 'i');
  const retype = CELL_VALUES.some((allowed) => allowed === spaced || lettered.test(allowed));
  const holds = odd.length ? ` (it holds ${andList(odd)}, which ${odd.length === 1 ? 'is not a plain letter or space' : 'are not plain letters or ' +
    'spaces'}${retype ? ': type it again' : ''})` : '';
  return { error: `is neither ${CELL_VALUES[0]} nor ${CELL_VALUES[1]}${holds}: write one of the two, or leave it empty while it is not known; ` +
    'a precautionary statement such as may contain, or any other note, goes in Notes' };
};
// Whether a dish is prepacked for direct sale: yes or no, in any letter case, or nothing yet.
const PPDS_VALUES = ['yes', 'no'];
// What a dish's row shows, by the one rule the document and status both follow, so that they cannot come to disagree:
// a cell's value only when it is exactly one of the two, null otherwise (printed as not confirmed); the cells a dish has
// not filled in with one of the two (left empty, or with no line at all); and whether its PPDS is recorded. A dish not
// confirmed shows none of its cells at all: that is decided where the row is made, from `answered`.
const confirmedCell = (entry, field) => (CELL_VALUES.includes(entry[fieldKey(field)]) ? entry[fieldKey(field)] : null);
const cellsNotFilled = (entry) => ALLERGEN_FIELDS.filter((field) => confirmedCell(entry, field) === null);
// Each confirmed dish with a cell not filled in, as { id, fields }, in the worksheet's order: what status names and counts.
const emptyCells = (parsed) => [...parsed.entries.values()].filter((entry) => entry.answered)
  .map((entry) => ({ id: entry.id, fields: cellsNotFilled(entry) })).filter(({ fields }) => fields.length);
const ppdsRecorded = (entry) => PPDS_VALUES.includes(entry.ppds);
const ANSWER_COUNTS = 'an answer counts when its State is confirmed and By and On are filled in';
// The lines status gives when the allergen information shows how customers are told as not yet answered, from the
// Management worksheet as status read it (`sheets`, every worksheet read): not started, or one or more of the three
// questions without a confirmed answer. Nothing when MG-04 is marked not relevant (the document prints the not-relevant
// line then, which is finished), and nothing when that worksheet has problems or is for other data or in the wrong file:
// the allergen information is not rendered from it then, and status tells that worksheet's state in its own line, under
// the Management document and under this one (its row's tellsToo). Nothing either when no worksheets are given, as
// nothing is then known of that one.
function customerLines(sheets) {
  if (!sheets?.has('MG')) return [];
  const mg = sheets.get('MG');
  const file = `food-safety/${worksheetName('MG')}`;
  const { method, questions } = CUSTOMER_QUESTIONS;
  if (!mg) {
    return [`${file}, the Management safe methods worksheet, is not started yet, and this document repeats its answers to ${andList(questions)} on ` +
      `how customers are told: make it with worksheet --section MG, and answer those three there; ${ANSWER_COUNTS}`];
  }
  if (!mg.clean || mg.parsed.methods.get(method)?.status === 'not-relevant') return [];
  const open = questions.filter((id) => !mg.parsed.answers.get(id)?.answered);
  if (!open.length) return [];
  const [it, has] = open.length === 1 ? ['it', 'has'] : ['them', 'have'];
  return [`${andList(open)} in ${file} ${has} no confirmed answer yet, and this document repeats ${it} under How customers are told: answer ${it} ` +
    `in the Management safe methods worksheet; ${ANSWER_COUNTS}`];
}

// The lists, one object each. A list's fields:
// - section: its worksheet's section, as in answers-<section>.md; nouns: what one entry is called, and many,
//   in status and the unfinished list ("3 of 4 cleaning items confirmed"); prefix: its entries' identifiers start
//   with it (CS-01); title: the worksheet's title and the document's heading; each: what one entry is, as
//   "Add an entry for each ..." says it; entryTitle: the words on the heading of the entry given to copy.
// - fields: the fields of an entry, in the worksheet's order, before State, By, On and Source.
// - values: for a field whose value is one of a set, or must meet a rule, a reader taking (value, data, today)
//   and giving { value }, the value in its standard form, or { error }, which says what is wrong after
//   `<field> "<value>"`. `today` is the caller's date, YYYY-MM-DD, for a rule such as "not after today", or
//   null when the caller gives none (see beginReading): nothing here reads the clock. A value read is kept in
//   its standard form whatever the entry's State; one with an error is reported only once the entry is
//   proposed or confirmed, as until then it holds what has been given so far, as it was given.
// - check(entry, data, today): what is wrong across one proposed or confirmed entry, as [{ field, message }]:
//   a field filled in that its other values do not use (as STATUS_USES does for a safe method).
// - checkList(entries, data), when a list needs it: what is wrong across the entries, as [{ id, field,
//   message }], such as two entries of a kind of which there may be one. Each is told as check's are, after
//   its entry's identifier, and the entry is not used; one naming no entry of the list is told against the
//   worksheet's marker line.
// - needs(entry, data): what a proposed or confirmed entry still lacks, each as { field, says }: `says` is what
//   the problem names as needed (a field's name, or a few words naming fields, such as "Telephone or Email"),
//   and `field` the field whose line the problem is told at (Telephone, there). need(field) is { field, says:
//   field }. An entry is answered only when it is confirmed, its By and On are valid and this is empty.
// - guidance(data): the guidance lines particular to the list, which guidanceOf puts with those every list
//   shares; quoted: what the line naming the pack says of them (null when they quote nothing of the pack).
// - purpose: what the list's document is for, in a few words after "this document", as status says it while the
//   worksheet is not started (listNotStarted): a business that has just updated meets the document there first.
// - elsewhereLabel: the list as "the business keeps its ... elsewhere" names it. With `each`, it gives the two
//   ways a list with nothing in it is finished, as status says them (listOutstanding).
// - keptElsewhere: the words the document's line opens with when Kept elsewhere is confirmed, before the colon and
//   where: the whole phrase, article and all, so that each list words it as reads right ("a cleaning schedule", "its
//   suppliers' list"), which no one rule for the article could.
// - elsewhereOnly: what is said when Kept elsewhere is confirmed and no entry it stands for is (keptElsewhereOnly):
//   { body, the sentence the document prints after its Kept elsewhere line; status, the words status's line and the
//   completion record add after "keeps its ... elsewhere" }. Each says that nothing of the record kept elsewhere is
//   held in the document or was checked here, so that a document finished that way never reads as holding the list.
// - elsewhereCovers(entry), when Kept elsewhere stands for only some of a list's entries: whether it stands for this
//   one (for the suppliers, a supplier, and not the environmental health team or another contact). Every entry by
//   default.
// - outstanding(parsed, data, sheets), when a list needs it: what else keeps its document from being finished, as
//   plain lines for status, the completion record and sign-off, from a worksheet with no problems: no entry
//   for the environmental health team, say, or cells not confirmed in confirmed rows. `sheets` is every worksheet
//   status read, for a document that prints from another worksheet too (or undefined when not given). None by default.
// - counts(parsed), when a list needs it: what status --json gives in the document's `counts` besides its entries
//   and those confirmed (listCounts), from a worksheet with no problems, or from none (parsed null) when it has
//   problems or is not there: the empty cells of confirmed dishes, say. Each number is then 0, as nothing in such a
//   worksheet counts.
// - lacking(data, where): what the data lacks that the list is read or printed from, as a sentence
//   starting with `where` ('the data' unless given), or null.
export const LISTS = {
  cleaning: {
    section: 'cleaning', nouns: ['cleaning item', 'cleaning items'], prefix: 'CS', title: 'Cleaning schedule', entryTitle: 'Name of the item',
    purpose: 'lists what the business cleans, how often and how',
    elsewhereLabel: 'cleaning schedule', keptElsewhere: 'The business keeps a cleaning schedule elsewhere',
    elsewhereOnly: { body: 'No cleaning item is confirmed in this document, so it holds nothing of that cleaning schedule, and nothing in it ' +
      'was checked against that schedule.', status: 'no cleaning item is confirmed here, so nothing of that schedule is held or checked here' },
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
    needs: (entry, data) => [...(entry.frequency ? [] : [need('Frequency')]), ...(entry.method ? [] : [need('Method')]),
      ...(entry.frequency === cleaningForm(data).frequencies.at(-1) && !entry.otherFrequency ? [need('Other-frequency')] : [])],
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
  },
  // The business's suppliers, the environmental health team and its other contacts, each an entry of its Kind. The
  // pack keeps them on two forms; the document prints both, one box to an entry. Kept elsewhere stands in for the
  // suppliers' list alone: the document asks for the environmental health team's details whatever it says, as the
  // team's box is the contact every business keeps.
  suppliers: {
    section: 'suppliers', nouns: ['entry', 'entries'], prefix: 'SUP', title: 'Suppliers and contacts', entryTitle: 'Business or service name',
    purpose: 'lists the business\'s suppliers, its environmental health team and its other contacts',
    elsewhereLabel: 'suppliers\' list', keptElsewhere: 'The business keeps its suppliers\' list elsewhere',
    // Kept elsewhere stands for the suppliers alone, so the words speak of suppliers: the team and other contacts are
    // printed, or asked for, in the contacts part whatever it says.
    elsewhereOnly: { body: 'No supplier is confirmed in this document, so it holds nothing of that suppliers\' list, and nothing in it was ' +
      'checked against that list.', status: 'no supplier is confirmed here, so nothing of that list is held or checked here' },
    elsewhereCovers: (entry) => entry.kind === 'supplier',
    fields: ['Kind', 'Contact-name', 'Telephone', 'Email', 'Address', 'Delivery-days', 'Lead-time', 'Goods-supplied', 'Useful-for'],
    // Kind is read in any letter case, with a space for the hyphen ("environmental health"), and kept in its own
    // spelling. The days a supplier delivers are the business's own words, printed under the pack's delivery days
    // label: the pack's day boxes are not asked one by one.
    values: {
      Kind: (value) => {
        const found = standard(value.trim().replace(/\s+/g, '-'), SUPPLIER_KINDS);
        return SUPPLIER_KINDS.includes(found) ? { value: found } : { error: `is not ${orList(SUPPLIER_KINDS)}` };
      }
    },
    check: (entry) => (SUPPLIER_KINDS.includes(entry.kind) ? Object.entries(KIND_ONLY) : [])
      .filter(([field, kind]) => entry[fieldKey(field)] && entry.kind !== kind)
      .map(([field, kind]) => ({
        field,
        message: `${field} is only for an entry whose Kind is ${kind}: ${entry.kind === TEAM && kind === 'contact'
          ? 'the environmental health team\'s box lists what the pack says the team advises on, so clear it'
          : `clear it, or set Kind to ${kind}`}`
      })),
    // The document has one box for the environmental health team, so the list has one entry of that Kind at most,
    // whatever the entries' states: a second one held unanswered would otherwise sit there until it was confirmed,
    // and status's remedy for it (confirm it) would then fail on the first. Kind is read even on an entry still
    // unanswered (see values), so a second one is seen as soon as it is written. It is told on the later entry,
    // naming the earlier.
    checkList: (entries) => {
      const [first, ...more] = entries.filter((entry) => entry.kind === TEAM);
      return more.map((entry) => ({ id: entry.id, field: 'Kind', message: `there is one ${TEAM} entry at most, and ${first.id} is one ` +
        'already: remove one of the two, or give this entry another Kind' }));
    },
    needs: (entry) => [...(entry.kind ? [] : [need('Kind')]), ...(entry.kind === 'supplier' && !entry.goodsSupplied ? [need('Goods-supplied')] : []),
      ...(['contact', TEAM].includes(entry.kind) && !entry.telephone && !entry.email ? [need('Telephone', 'Telephone or Email')] : [])],
    each: 'supplier',
    guidance: () => [
      'Add one the same way for the environmental health team, and for each other service or person the business',
      'may need to contact.',
      `Kind is ${orList(SUPPLIER_KINDS)}. There is one ${TEAM} entry at most.`,
      'Write the business\'s or service\'s name after the entry\'s number: for the environmental health team, what',
      'you call it, such as the council\'s name. Contact-name is the person to ask for.',
      'Delivery-days is the days a supplier delivers, in your own words. Lead-time is',
      'how far ahead an order has to be placed, in your own words. Goods-supplied is what the supplier supplies.',
      'Useful-for is what a contact is useful for advice on, in your own words. The environmental health team\'s',
      'box lists what the pack says the team advises on, so its Useful-for stays empty.',
      'Delivery-days, Lead-time and Goods-supplied are for a supplier only, and Useful-for for a contact only.',
      'An entry needs Kind before it can be proposed or confirmed. A supplier needs Goods-supplied too, and a',
      'contact or the environmental health team a Telephone or an Email, or both.',
      'Kept elsewhere covers the suppliers\' list only: the document still needs the environmental health team\'s',
      'entry, confirmed, even when the business keeps its suppliers\' list somewhere else.'
    ],
    quoted: null,
    // What else keeps the document from being finished, each in the words of what to do. listOutstanding has already
    // said so when nothing at all is written (with how to begin), so the line about suppliers is left out then. An
    // entry of the kind that is there but not confirmed is told by status's count of entries not confirmed, with how
    // to confirm it; these lines are for a kind with no entry at all. An entry whose Kind is not yet one of the three
    // (only one still unanswered can be, in a worksheet with no problems) may be the one meant, so it is named, so
    // that following the line does not add the same supplier or team twice. Kept elsewhere stands in for suppliers,
    // never for the team.
    outstanding: (parsed) => {
      const file = `food-safety/${worksheetName('suppliers')}`;
      const entries = [...parsed.entries.values()];
      const has = (kind) => entries.some((entry) => entry.kind === kind);
      const nothingYet = !entries.length && !elsewhereGiven(parsed.elsewhere);
      const unkinded = orList(entries.filter((entry) => !SUPPLIER_KINDS.includes(entry.kind)).map((entry) => entry.id));
      const instead = (what, kind) => (unkinded ? `if ${unkinded} is ${what}, set its Kind to ${kind} instead of adding it again` : '');
      return [
        ...(!has('supplier') && !parsed.elsewhere.answered && !nothingYet ? [`${file} has no entry whose Kind is supplier: add and confirm one ` +
          `for each supplier${unkinded ? ` (${instead('a supplier', 'supplier')})` : ''}, or confirm under Kept elsewhere where the business ` +
          'keeps its suppliers\' list'] : []),
        ...(!has(TEAM) ? [`${file} has no entry whose Kind is ${TEAM}: add and confirm one for the environmental health team, with its ` +
          `Telephone or Email (${unkinded ? `${instead('the team\'s entry', TEAM)}; ` : ''}Kept elsewhere covers the suppliers' list only)`] : [])
      ];
    },
    lacking: (data, where = 'the data') => (supplierForms(data) ? null : `${where} has no ${SUPPLIERS_FORM.form} form on page ` +
      `${SUPPLIERS_FORM.page} and ${CONTACTS_FORM.form} form on page ${CONTACTS_FORM.page} of diary.json in the layout the suppliers and ` +
      'contacts document is printed from: a supplier\'s box, then the environmental health team\'s box with its list of what the team ' +
      'advises on, and another contact\'s box')
  },
  // The business's dishes, each against the pack's fourteen allergens. A cell is filled only from what was checked: a
  // label, a product specification or a supplier's statement for each ingredient; or, for an ingredient with no label that
  // is a single whole food with nothing added (a loose tomato, a fresh egg), a named person's own look at it, which
  // Checked-against then records with who looked. Anything made of more than one thing needs one of the three. The helper
  // cannot tell which an ingredient is, so the guidance says it plainly, and never what a cell should hold. The dish
  // counts only once a named person confirms its row as a whole. Kept elsewhere
  // says where the business keeps its allergen information for its dishes, if it keeps it somewhere else (the pack's
  // MG-04-Q01 asks where it is kept).
  allergens: {
    section: 'allergens', nouns: ['dish', 'dishes'], prefix: 'DISH', title: 'Allergen information', entryTitle: 'Name of the dish',
    purpose: 'records each dish the business serves against the fourteen allergens',
    elsewhereLabel: 'allergen information for its dishes', keptElsewhere: 'The business keeps its allergen information for its dishes elsewhere',
    elsewhereOnly: { body: 'No dish is confirmed in this document, so it holds nothing of that allergen information, and nothing in it was ' +
      'checked against that record.', status: 'no dish is confirmed here, so nothing of that record is held or checked here' },
    fields: ['Ingredients', 'PPDS', ...ALLERGEN_FIELDS, 'Notes', 'Checked-against', 'Checked-on', 'Free-from-claim'],
    values: {
      PPDS: (value) => {
        const found = standard(value, PPDS_VALUES);
        return PPDS_VALUES.includes(found) ? { value: found }
          : { error: 'is not yes or no: yes when the dish is prepacked for direct sale, and no when it is not' };
      },
      ...Object.fromEntries(ALLERGEN_FIELDS.map((field) => [field, cellValue])),
      // The day the labels were checked has happened, so it is never after the caller's today. The commands always give
      // one. A program that reads a worksheet without a date for today cannot check that, so the date is refused rather
      // than taken unchecked: a date on which what a customer is told rests is never accepted on trust. The message says
      // the fault is the reading program's, as nothing in the worksheet can put it right.
      'Checked-on': (value, data, today) => {
        if (!isIsoDate(value)) return { error: 'is not a real date written YYYY-MM-DD' };
        if (!today) {
          return { error: 'could not be checked against today\'s date, because the program reading this worksheet gave none: that is ' +
            'the program\'s fault, not the worksheet\'s, and the helper\'s own commands always give it' };
        }
        return value > today
          ? { error: `is after today, ${today}: it is the day the labels were checked, which cannot be still to come` } : { value };
      }
    },
    // A dish is agreed after what it was checked against was checked, never before: a Checked-on after On is one of the
    // two dates written wrongly, and nothing can tell which.
    check: (entry) => (isIsoDate(entry.checkedOn) && isIsoDate(entry.on) && entry.checkedOn > entry.on
      ? [{ field: 'Checked-on', message: `Checked-on ${entry.checkedOn} is after On ${entry.on}: a dish cannot be agreed before it was checked, so ` +
        'correct whichever of the two dates is wrong' }] : []),
    // An empty cell, or an empty PPDS, does not stop a dish being confirmed: the document prints it as not confirmed, and
    // status says so. What it was checked against, and when, it cannot do without.
    needs: (entry) => [...(entry.checkedAgainst ? [] : [need('Checked-against')]), ...(entry.checkedOn ? [] : [need('Checked-on')])],
    each: 'dish the business serves',
    guidance: () => [
      'Ingredients is what goes into the dish, in your own words. PPDS is yes when the dish is prepacked for direct',
      'sale, and no when it is not.',
      `${ALLERGEN_FIELDS[0]} to ${ALLERGEN_FIELDS.at(-1)} are the fourteen allergens. Write contains or does not contain in each, as what was`,
      'checked says: a label, a product specification or a supplier\'s statement for each ingredient.',
      'A does not contain counts only as a named person\'s statement for the dish as it now stands: when the allergens',
      'command is next run, it asks a named person to state each one again before the dish is confirmed.',
      'An ingredient with no label may rest on a named person\'s own check only when it is a single whole food with',
      'nothing added, such as a loose tomato or a fresh egg: Checked-against then says what was looked at, and by whom.',
      'Anything made of more than one thing, such as a mix, a sauce, bread, or a dressed or prepared product, needs a',
      'label, a specification or a supplier\'s statement.',
      'Leave a cell empty while it is not known: the document shows it as not confirmed. Never fill one in from the',
      'name of a dish or of an ingredient.',
      'Notes is anything else to say, such as a precautionary statement on a label that the food may contain an',
      'allergen: that is never written in an allergen\'s field. The document marks each dish that has Notes, so that',
      'its notes are read.',
      'Checked-against names what was checked: each label, specification or supplier\'s statement, and each single',
      'whole food looked at, with who looked. Checked-on is the day it was checked, written YYYY-MM-DD, and is not',
      'after today or after On.',
      'Free-from-claim is any claim the business makes that the dish is free from an allergen, in its own words.',
      'An entry needs Checked-against and Checked-on before it can be proposed or confirmed.',
      'When an empty cell of a confirmed dish is filled in later, bring the dish\'s Checked-against, Checked-on, By',
      'and On up to date.',
      'When a recipe, an ingredient, a brand or a supplier changes, set the dish\'s State to unanswered and clear By',
      'and On until it has been checked again.'
    ],
    quoted: null,
    // What else the document shows unfinished, each in the words of what to do: a cell a confirmed dish has not filled in
    // (left empty, or its line not there at all: both are read as nothing), a confirmed dish with no PPDS, and the
    // Management worksheet's answers on how customers are told not yet confirmed (customerLines). A dish not confirmed is
    // told by status's count of entries not confirmed. The cells and PPDS are judged by the same helpers the body uses.
    outstanding: (parsed, data, sheets) => {
      const file = `food-safety/${worksheetName('allergens')}`;
      const confirmed = [...parsed.entries.values()].filter((entry) => entry.answered);
      const empty = emptyCells(parsed);
      const n = empty.reduce((sum, { fields }) => sum + fields.length, 0);
      // Each dish's empty cells, as "Mustard and Soya in DISH-01"; the dishes a comma apart, the last after ", and", so
      // that no reader can take one dish's cells for another's.
      const where = empty.map(({ id, fields }) => `${andList(fields)} in ${id}`);
      const named = where.length < 2 ? where.join('') : `${where.slice(0, -1).join(', ')}, and ${where.at(-1)}`;
      const noPpds = confirmed.filter((entry) => !ppdsRecorded(entry)).map((entry) => entry.id);
      return [
        ...(n ? [`${counted(n, 'allergen cell', 'allergen cells')} of confirmed dishes in ${file} ${isAre(n)} not filled in, so the document shows ` +
          `${n === 1 ? 'it' : 'them'} as not confirmed (${named}): ` +
          `${n === 1 ? 'fill it in' : 'fill in each'} as ${CELL_VALUES[0]} or ${CELL_VALUES[1]} from what was checked, then update ` +
          `${empty.length === 1 ? 'that dish\'s' : 'each of those dishes\''} Checked-against, Checked-on, By and On`] : []),
        ...(noPpds.length ? [`PPDS is not filled in for ${counted(noPpds.length, 'confirmed dish', 'confirmed dishes')} in ${file} (${andList(noPpds)}), so ` +
          `the document shows ${noPpds.length === 1 ? 'it' : 'them'} as not confirmed under Prepacked for direct sale: write yes or no in ` +
          `${noPpds.length === 1 ? 'its' : 'each one\'s'} PPDS, for whether it is prepacked for direct sale, then update its By and On`] : []),
        ...customerLines(sheets)
      ];
    },
    // The cells the document shows as not confirmed in the rows of confirmed dishes, counted by the rule its line above
    // names them by. A dish not confirmed shows every cell so, and is counted as a dish not confirmed instead.
    counts: (parsed) => ({ cellsNotConfirmed: parsed ? emptyCells(parsed).reduce((sum, { fields }) => sum + fields.length, 0) : 0 }),
    lacking: (data, where = 'the data') => (!allergensOf(data) ? `${where} has no table in ${ALLERGEN_TABLE.method} on page ${ALLERGEN_TABLE.page} ` +
      `of XC.json in the layout the allergen information is made from: ${ALLERGEN_FIELDS.length} rows of two cells, each an allergen and where it may ` +
      'be found, in the order of the allergens worksheet\'s fields'
      : !allergenQuotes(data) ? `${where} has no ${PPDS_PARAGRAPH.point}, ${FREE_FROM_POINT.point} on page ${FREE_FROM_POINT.page}, or text ` +
        `questions ${andList(CUSTOMER_QUESTIONS.questions)}, in ${CUSTOMER_QUESTIONS.method} of MG.json, in the layout the allergen information quotes ` +
        'them from' : null)
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
  'Kept elsewhere needs Where before it can be proposed or confirmed. Entries may be listed here as well:',
  'both are printed.',
  'To carry a value on to more lines, start each extra line with two spaces, straight after the line before',
  'it, with no blank line between.',
  'State says where an entry, or Kept elsewhere, stands: unanswered (it may hold what has been given so far; By and On stay empty);',
  `${STATE_WORDS[0]};`,
  `or ${STATE_WORDS[1]}.`,
  'Only a confirmed entry, or a confirmed Kept elsewhere, goes into your documents. An entry that is not',
  'confirmed, and a Kept elsewhere that holds anything and is not confirmed, are named there as not yet confirmed.',
  ...(isObject(data.source) && list.quoted ? [quotedBy(list.quoted, data.source)] : []),
  '',
  `## ${list.prefix}-01 ${list.entryTitle}`,
  '',
  ...entryFields(list).map((field) => (field === 'State' ? 'State: unanswered' : `${field}:`))
];

// Reads a list worksheet of `list` (one of LISTS), from the reading beginReading began, as readWorksheet
// reads the others: pass 1 by readBlocks, then the Kept elsewhere block and each entry into records, checked
// field by field, with the reading's `today` given to each value reader. Gives { parsed, layout }, `parsed`
// holding `elsewhere` (its record, blank and unanswered when the block is not there) and `entries`, each
// { id, title, line, the list's fields, state, by, on, source, answered }.
export function readList(list, reading, data) {
  const { parsed, report, finish, markerLine, section, today } = reading;
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
    notAQuestion: (id) => `### ${id} is not read: this worksheet has no questions, and each entry is headed with ## and its number, ` +
      `such as ## ${list.prefix}-01`,
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
      const result = read(typed, data, today);
      if (!result.error) entry[fieldKey(name)] = result.value;
      else if (!held) report(lineOf(block, name), `${block.id}: ${name} "${typed}" ${result.error}`, block);
    }
    if (!held) for (const { field, message } of list.check?.(entry, data, today) ?? []) report(lineOf(block, field), `${block.id}: ${message}`, block);
    checkState(block, block.id, entry.state, ['By', 'On']);
    if (entry.state === 'proposed' || entry.state === 'confirmed') {
      for (const { field, says } of list.needs(entry, data)) report(lineOf(block, field), `${block.id} is ${entry.state}, so it needs ${says}`, block);
      if (entry.state === 'proposed') needs(block, block.id, ['Source'], 'proposed');
    }
    entry.answered = entry.state === 'confirmed' && !block.faulty;
    parsed.entries.set(block.id, entry);
  }
  // A check across the list is told as an entry's own is. One that names no entry of the list (a slip in the
  // list's own code) is told against the worksheet, so that it is seen and nothing is thrown.
  for (const { id, field, message } of list.checkList?.([...parsed.entries.values()], data) ?? []) {
    const block = seen.entry.get(id);
    if (!block) {
      report(markerLine, `${id}: ${message}`);
      continue;
    }
    report(lineOf(block, field), `${id}: ${message}`, block);
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

// A list worksheet has entries where the others have questions and answers, so the messages every worksheet shares
// take these words for one (worksheetTerms): the only wording of the tool's in it is its guidance comment, and while it
// has a problem nothing written in it counts, its entries and Kept elsewhere alike.
addListWorksheets({
  sections: LIST_SECTIONS, read: (reading, data) => readList(LISTS[reading.section], reading, data), emit: emitList,
  guidance: (section, data) => guidanceOf(LISTS[section], data),
  placed: 'Each entry, and anything written under Kept elsewhere, belongs below the opening comment.',
  wording: 'guidance wording', counts: 'nothing written in it counts'
});

// ---------------------------------------------------------------------------------------------
// The list documents. Each prints its list's confirmed entries, says where the business keeps the list
// when it says it keeps it elsewhere, and names whatever is not confirmed, in the line notConfirmed prints.
// With no confirmed entry and no confirmed Kept elsewhere, it says so, with UNANSWERED.
// ---------------------------------------------------------------------------------------------

// Whether a Kept elsewhere holds anything a person wrote.
const elsewhereGiven = (elsewhere) => Boolean(elsewhere.where || elsewhere.by || elsewhere.on || elsewhere.source) ||
  elsewhere.state !== 'unanswered';
// Whether a list's document says only where the business keeps the list: Kept elsewhere is confirmed, and no entry it
// stands for is (elsewhereCovers). Such a document can be finished, and signed off, but holds nothing of the record
// kept elsewhere, and its body, status's line, status --json and the completion record each say so (elsewhereOnly).
// `parsed` is a worksheet read with no problems, or null.
export const keptElsewhereOnly = (list, parsed) => Boolean(parsed?.elsewhere?.answered) &&
  ![...parsed.entries.values()].some((entry) => entry.answered && (list.elsewhereCovers?.(entry) ?? true));

// What a person confirms for a list document, as status counts it: its entries, and nothing else. What else
// keeps a list document from being finished (nothing recorded yet, Kept elsewhere not confirmed, and whatever
// its list's outstanding hook says) is told in its own words by listOutstanding, after the count. Sign-off
// refuses on both, and also, whatever they say, on any document whose body shows something unfinished
// (freshlyUnfinished in the document module).
export const listAsked = (sheet) => ({ items: [...(sheet?.parsed?.entries.values() ?? [])].map((entry) => [entry.id, entry]) });

// What status says of a list document whose worksheet is not started, in place of the line every worksheet shares: what
// the document is for, then the worksheet to make. A business that kept its documents before the list documents came
// meets each of them here first, so the line says what it is, and nothing in it reads as a fault in what the business
// already has: the worksheet is simply not started yet.
export const listNotStarted = (list) => `this document ${list.purpose}, from its worksheet food-safety/${worksheetName(list.section)}, which is ` +
  `not started yet: make it with worksheet --section ${list.section} and fill it in`;

// What keeps a list document from being finished besides its entries not yet confirmed, as lines for status's
// unfinished list: nothing recorded at all, with the two ways to finish; what is written under Kept elsewhere
// not confirmed, with what it needs; then the list's own (its `outstanding`). `sheet` is the worksheet as
// readWorksheets reads it, which status gives only when it has no problems; `sheets`, every worksheet status read,
// passed to the list's own for a document that prints from another worksheet too.
export function listOutstanding(list, sheet, data, sheets) {
  const parsed = sheet?.parsed;
  if (!parsed?.elsewhere) return [];
  const file = `food-safety/${worksheetName(list.section)}`;
  const { elsewhere } = parsed;
  return [
    ...(!parsed.entries.size && !elsewhereGiven(elsewhere) ? [`${file} has no ${list.nouns[0]} yet, and nothing under Kept elsewhere: add and ` +
      `confirm an entry for each ${list.each}, or confirm under Kept elsewhere where the business keeps its ${list.elsewhereLabel}`] : []),
    ...(elsewhereGiven(elsewhere) && !elsewhere.answered ? [`Kept elsewhere in ${file} has something written in it but is not confirmed: ` +
      'fill in Where, set State to confirmed and fill in By and On, or clear it'] : []),
    ...(list.outstanding?.(parsed, data, sheets) ?? [])
  ];
}

// What status's count lines say a list document's entries need in order to count, after the entries a line names
// (`ids`, those it shows): what the worksheet's guidance says an entry needs, as well as State, By and On, since an
// entry confirmed without a field its list needs is a problem and is not read at all; then, for each entry named that
// still lacks a field its list needs as it now stands (needs), what it lacks. A field needed only once another is
// filled in (a supplier's Goods-supplied, once Kind says supplier) cannot be named before then: the guidance, named
// first, says it. `sheet` is the worksheet as readWorksheets reads it, with no problems, as status gives count lines
// only from such a worksheet.
export function listCountsWhen(list, ids, sheet, data) {
  const lacking = ids.map((id) => [id, list.needs(sheet.parsed.entries.get(id), data).map(({ says }) => says)]).filter(([, says]) => says.length);
  return 'an entry counts when it has what the worksheet\'s guidance says it needs, its State is confirmed and By and On are filled in' +
    lacking.map(([id, says]) => `; ${id} still needs ${andList(says)}`).join('');
}

// What status --json gives as a list document's `counts`: how many entries its worksheet holds and how many of them are
// confirmed (status's own counts, the same as the document's `questions` and `confirmed`, under the names a list uses),
// then whatever its list counts besides (its `counts`), from the worksheet only when it has no problems. `counted` is
// status's count for the document, `sheet` the worksheet as readWorksheets reads it, or missing.
export const listCounts = (list, sheet, counted) => ({ entries: counted.questions, confirmed: counted.confirmed,
  keptElsewhereOnly: keptElsewhereOnly(list, sheet?.clean ? sheet.parsed : null), ...(list.counts?.(sheet?.clean ? sheet.parsed : null) ?? {}) });

// What status's line for a list document says of its worksheet: how many entries are confirmed, and that the
// business keeps the list elsewhere when that is confirmed; with no entry, that, or that there are none yet.
// `doc` is the document's status entry, `sheet` its worksheet as readWorksheets reads it, or missing.
export function listSummary(list, doc, sheet) {
  const [, many] = list.nouns;
  const kept = Boolean(sheet?.clean && sheet.parsed.elsewhere?.answered);
  const keeps = `the business ${doc.questions ? 'also ' : ''}keeps its ${list.elsewhereLabel} elsewhere` +
    (kept && keptElsewhereOnly(list, sheet.parsed) ? `, and ${list.elsewhereOnly.status}` : '');
  if (!doc.questions) return [kept ? keeps : `no ${many} yet`];
  return [`${doc.confirmed} of ${doc.questions} ${many} confirmed${doc.proposed ? `, ${doc.proposed} proposed` : ''}`, ...(kept ? [keeps] : [])];
}

// What the completion record says of a list document that says only where the business keeps the list
// (keptElsewhereOnly), or null: the same words as status's line, which name nothing of the business's own.
export const keptElsewhereLine = (list, sheet) => (sheet?.clean && keptElsewhereOnly(list, sheet.parsed)
  ? `the business keeps its ${list.elsewhereLabel} elsewhere, and ${list.elsewhereOnly.status}` : null);

// A list document's last line, which says truly what it quotes from the pack: `lead` names it, and the source
// follows as the other documents' source line gives it, read from the data. A document that prints nothing of
// the pack says so instead, with no licence line, as it holds no public sector information.
export const quotedSourceLine = (lead, source) => `${lead} the ${source.publisher}'s ${source.title}, retrieved ` +
  `${longDate(source.retrieved)}. ${source.attribution} The ${source.publisher} has not reviewed or endorsed this document.`;
const unquotedSourceLine = (source) => `Nothing in this document is quoted from the ${source.publisher}'s ${source.title}, and the ` +
  `${source.publisher} has not reviewed or endorsed this document.`;

// The line a list document prints when Kept elsewhere is confirmed: where, and who said so and when; then, when no
// entry it stands for is confirmed, that the document holds nothing of that record (elsewhereOnly).
const elsewhereChunks = (list, parsed) => (parsed.elsewhere.answered
  ? [[`${list.keptElsewhere}: ${said(parsed.elsewhere.where)} (said by ${said(parsed.elsewhere.by)}, ${said(parsed.elsewhere.on)}).`],
    ...(keptElsewhereOnly(list, parsed) ? [[list.elsewhereOnly.body]] : [])]
  : []);
// Who agreed an entry the document prints, and when, on a line of its own under its table.
const agreedLine = (entry) => `- ${entry.id} ${said(entry.title)}: ${said(entry.by)}, ${said(entry.on)}`;
// The line a list document prints when something is written under Kept elsewhere and not confirmed, in the
// document's own terms: a reader of the document has never seen the worksheet's block.
const elsewhereNotConfirmed = (list, elsewhere) => (elsewhereGiven(elsewhere) && !elsewhere.answered
  ? [[`${NOT_CONFIRMED}what has been written down about where the business keeps its ${list.elsewhereLabel} elsewhere.`]]
  : []);

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
  const kept = elsewhereChunks(list, parsed);
  const cells = (entry) => [businessText(entry.title),
    ...frequencies.map((frequency) => (entry.frequency !== frequency ? '' : frequency === other ? businessText(entry.otherFrequency) : 'X')),
    businessText(entry.precautions), businessText(entry.method)];
  const listed = confirmed.length ? [tableLines(columns, confirmed.map(cells)), ['Agreed by:'], confirmed.map(agreedLine)]
    : kept.length ? [] : [[`The cleaning schedule has no confirmed items yet: ${UNANSWERED}`]];
  return [[`## ${list.title}`], ...kept, ...listed, ...elsewhereNotConfirmed(list, parsed.elsewhere),
    ...notConfirmed([...parsed.entries.values()])];
}

// The cleaning schedule's last line: it quotes the form's column headings when it prints the form, which is
// when an entry is confirmed, and nothing of the pack otherwise.
export function cleaningScheduleSource(sources, data) {
  const printsForm = [...sources.get(LISTS.cleaning.section).parsed.entries.values()].some((entry) => entry.answered);
  return printsForm ? quotedSourceLine("The table's column headings are quoted from", data.source) : unquotedSourceLine(data.source);
}

// The headings of the document's two parts: the helper's words for the pack's two forms.
const SUPPLIERS_HEADING = 'Suppliers\' list';
const CONTACTS_HEADING = 'Contacts list';

// The suppliers and contacts document. Under the first heading, a box for each confirmed supplier, its labels the
// pack's suppliers' list form's; or, with none, the confirmed Kept elsewhere line; or, with neither, UNANSWERED.
// Under the second, the environmental health team's box first, under the pack's heading for it and with the pack's
// list of what the team advises on, holding UNANSWERED in place of the team's name until its entry is confirmed; then
// a box for each confirmed contact. Each box is a two-column table: the label, then the business's words, escaped,
// with every label of the box printed, so a detail not given shows as a blank, as on the paper form. Who agreed each
// entry is listed under its part's boxes, as the forms have no place for it. An entry not confirmed is named by its
// identifier, and nothing else of it is printed: a supplier in the suppliers' part, so that part never reads as
// complete while one is outstanding; any other (a contact, the team, or an entry with no Kind of the three yet) at
// the end.
export function suppliersChunks(sources, data) {
  const list = LISTS.suppliers;
  const { parsed } = sources.get(list.section);
  const forms = supplierForms(data);
  const entries = [...parsed.entries.values()];
  const confirmed = (kind) => entries.filter((entry) => entry.answered && entry.kind === kind);
  const [suppliers, [team], contacts] = ['supplier', TEAM, 'contact'].map(confirmed);
  // A box of `labels` for `entry`: its header row the first label and the entry's name, then a row for each other
  // label. `own` gives a value the pack prints in place of the business's (the team's list of what it advises on).
  const box = (labels, entry, own = {}) => {
    const value = (field) => own[field] ?? businessText(entry[field]);
    const [[field, label], ...rest] = labels;
    return tableLines([label, value(field)], rest.map(([name, text]) => [text, value(name)]));
  };
  const agreed = (shown) => (shown.length ? [['Agreed by:'], shown.map(agreedLine)] : []);
  const kept = elsewhereChunks(list, parsed);
  const supplierPart = suppliers.length ? [...suppliers.map((entry) => box(forms.supplier, entry)), ...agreed(suppliers)]
    : kept.length ? [] : [[`The suppliers' list has no confirmed supplier yet: ${UNANSWERED}`]];
  // The team's heading and its "useful for advice on" heading are its box's first and last labels.
  const teamHeading = forms.team[0][1];
  const adviceHeading = forms.team.at(-1)[1];
  const teamBox = team ? box(forms.team, team, { usefulFor: forms.advice })
    : tableLines([teamHeading, UNANSWERED], [[adviceHeading, forms.advice]]);
  const isSupplier = (entry) => entry.kind === 'supplier';
  return [[`## ${SUPPLIERS_HEADING}`], ...kept, ...supplierPart, ...elsewhereNotConfirmed(list, parsed.elsewhere),
    ...notConfirmed(entries.filter(isSupplier)),
    [`## ${CONTACTS_HEADING}`], teamBox, ...contacts.map((entry) => box(forms.contact, entry)), ...agreed([...(team ? [team] : []), ...contacts]),
    ...notConfirmed(entries.filter((entry) => !isSupplier(entry)))];
}

// The suppliers and contacts document's last line. It always quotes the pack: the team's box, with its heading and its
// list, is printed in every state, and every other box's labels are the pack's.
export const suppliersSource = (data) => quotedSourceLine('The labels in the tables, and the list of what the environmental health team ' +
  'can advise on, are quoted from', data.source);

// The allergen information's headings and its own lines. None says what a dish contains, or who can eat it: a confirmed
// row is what a named person at the business agreed after checking what is named beside it, and every line here says
// only that, or names what is not yet recorded. None but the free-from heading holds the words "free from".
const ALLERGEN_HEADINGS = {
  table: '### The fourteen allergens', dishes: '### Dishes', checked: '### What each row was checked against', ppds: '### Prepacked for direct sale',
  freeFrom: '### The business\'s own "free from" statements', customers: '### How customers are told'
};
// The mark a confirmed dish's row carries in its Dish cell when the dish has Notes, on a line of its own there, so that a
// reader of the Dishes table (the part a customer is shown) is sent to the note, which may be a label's precautionary
// statement. It says nothing about allergens itself. It is bold, which no business's words can be (businessText escapes
// the asterisks), so a dish's name can never imitate it. A dish not confirmed never carries it: its notes are not yet the
// business's.
export const NOTES_MARK = '**see notes**';
// What a confirmed row is, in the words of what Checked-against may hold, and what the notes mark sends a reader to. The
// person who agreed a row is not always the one who looked at a whole food (Checked-against names who did), so the line
// puts the looking on the person named there, and says only that the row was agreed from what is named.
const DISHES_LEAD = 'A confirmed row records what a named person at the business agreed, from what the next section names for it: ' +
  `labels, specifications or suppliers' statements, or a single whole food looked at by the person named there. A row marked ${NOTES_MARK} has a ` +
  'note there, which may be a label\'s statement that the food may contain an allergen.';
const CHECKED_COLUMNS = ['Dish', 'Ingredients', 'Checked against', 'Checked on', 'Notes', 'Agreed by'];
const PACK_SAYS = 'What the pack says:';
const PACK_SAYS_TWICE = 'What the pack says, in a safety point and then in the reason it gives:';

// The allergen information, in this order:
// 1. Its heading; where the business keeps its allergen information for its dishes, when Kept elsewhere is confirmed; or
//    that what is written about that is not confirmed.
// 2. The pack's table of the fourteen allergens, unchanged.
// 3. The Dishes table: a row to each entry, its cells under the fourteen names cut short. A confirmed dish's row is its
//    identifier and name (with NOTES_MARK under them when it has Notes), then each cell as confirmed, or NOT_CONFIRMED_CELL
//    for one not filled in. A dish not confirmed
//    shows its identifier alone (its name is not yet the business's) and NOT_CONFIRMED_CELL in every cell, whatever its
//    worksheet holds: nothing of a row nobody confirmed is printed. A cell is printed only when it is exactly one of the
//    two values, so nothing else a worksheet could hold can reach a cell. With no entry and Kept elsewhere not confirmed,
//    UNANSWERED instead; with no entry and Kept elsewhere confirmed, this part and the next are left out.
// 4. What each confirmed dish was checked against, and when, its ingredients and notes, and who agreed it and when; then
//    the dishes not confirmed, by identifier.
// 5. The pack's sentence on prepacked for direct sale food, then the confirmed dishes the business records as such, and
//    those whose PPDS is not recorded, as NOT_CONFIRMED_CELL. With neither, but some dish confirmed, a line saying no
//    confirmed dish is recorded as such: true only because every confirmed dish said no. It speaks of the confirmed dishes
//    alone, as a dish not confirmed may say otherwise and is still listed in the document. With no dish confirmed at all
//    (Kept elsewhere alone, say), a line saying so instead, so that the document never reads as saying the business has
//    no such food when it has said nothing about any dish.
// 6. Each confirmed dish's own claim, in the business's words, then the pack's conditions for such a claim, its safety
//    point's paragraph and its reason's. With no claim, a line saying no confirmed dish has one; with no dish confirmed, a
//    line saying none is recorded for that reason, never one that reads as the business making no such statement.
// 7. The three questions on how customers are told, with the Management worksheet's answers, each printed by questionCell
//    exactly as the Management document prints it, and MG-04's variation line when it is adapted, as that document prints
//    it; or MG-04's not-relevant line, as that document prints it; or, with no Management worksheet, UNANSWERED on a line
//    naming it.
// Every word of a business's is escaped (businessText, said); tableLines escapes a pipe and turns a line break into <br>.
export function allergenChunks(sources, data) {
  const list = LISTS.allergens;
  const { parsed } = sources.get(list.section);
  const allergens = allergensOf(data);
  const quotes = allergenQuotes(data);
  const entries = [...parsed.entries.values()];
  const confirmed = entries.filter((entry) => entry.answered);
  const kept = elsewhereChunks(list, parsed);
  // A confirmed dish named in a line of the helper's, and in a table cell (where tableLines makes its line breaks <br>).
  const named = (entry) => `${entry.id} ${said(entry.title)}`;
  const inCell = (entry) => `${entry.id} ${businessText(entry.title)}`;
  const row = (entry) => (entry.answered
    ? [`${inCell(entry)}${entry.notes ? `\n${NOTES_MARK}` : ''}`, ...allergens.map(({ field }) => confirmedCell(entry, field) ?? NOT_CONFIRMED_CELL)]
    : [entry.id, ...allergens.map(() => NOT_CONFIRMED_CELL)]);
  const dishes = entries.length
    ? [[ALLERGEN_HEADINGS.dishes], [DISHES_LEAD], tableLines(['Dish', ...allergens.map(({ name }) => shortName(name))], entries.map(row))]
    : kept.length ? [] : [[ALLERGEN_HEADINGS.dishes], [`No dish has been confirmed yet: ${UNANSWERED}`]];
  const checked = entries.length ? [[ALLERGEN_HEADINGS.checked],
    ...(confirmed.length ? [tableLines(CHECKED_COLUMNS, confirmed.map((entry) => [inCell(entry),
      ...[entry.ingredients, entry.checkedAgainst, entry.checkedOn, entry.notes].map(businessText), `${businessText(entry.by)}, ${businessText(entry.on)}`]))] : []),
    ...notConfirmed(entries)] : [];
  const prepacked = confirmed.filter((entry) => entry.ppds === 'yes');
  const unrecorded = confirmed.filter((entry) => !ppdsRecorded(entry));
  const noneConfirmed = 'No dish is confirmed in this document, so';
  const ppds = [[ALLERGEN_HEADINGS.ppds], [PACK_SAYS], [`> ${quotes.ppds}`],
    ...(prepacked.length ? [['The business records these dishes as prepacked for direct sale:'], prepacked.map((entry) => `- ${named(entry)}`)] : []),
    ...(unrecorded.length ? [['Whether these dishes are prepacked for direct sale is not yet recorded:'],
      unrecorded.map((entry) => `- ${named(entry)}: ${NOT_CONFIRMED_CELL}`)] : []),
    ...(prepacked.length || unrecorded.length ? [] : [[confirmed.length ? 'No confirmed dish is recorded as prepacked for direct sale.'
      : `${noneConfirmed} it does not say which dishes are prepacked for direct sale.`]])];
  const claims = confirmed.filter((entry) => entry.freeFromClaim);
  const freeFrom = [[ALLERGEN_HEADINGS.freeFrom],
    ...(claims.length ? [['The business\'s own words, as confirmed for each dish:'], claims.map((entry) => `- ${named(entry)}: ${said(entry.freeFromClaim)}`)]
      : [[confirmed.length ? 'No confirmed dish has one recorded.' : `${noneConfirmed} none of the business's statements is recorded here.`]]),
    [PACK_SAYS_TWICE], ...quotes.freeFrom.map((paragraph) => [`> ${paragraph}`])];
  return [[`## ${list.title}`], ...kept, ...elsewhereNotConfirmed(list, parsed.elsewhere),
    [ALLERGEN_HEADINGS.table], ...packBlockChunks(allergenBlock(data)),
    ...dishes, ...checked, ...ppds, ...freeFrom, ...customerChunks(sources, quotes)];
}

// Part 7: how customers are told, from the Management worksheet. It is in sources only when it exists and has no
// problems: render refuses, as for any worksheet a document uses, when it has problems or is for other data.
function customerChunks(sources, { method, questions }) {
  const heading = [ALLERGEN_HEADINGS.customers];
  const mg = sources.get('MG')?.parsed;
  if (!mg) return [heading, [`How customers are told is answered in the Management safe methods worksheet, which has not been started yet: ${UNANSWERED}`]];
  // A reader of the document knows the Management safe methods document, not the worksheet behind it, so the lead names
  // the document; its words here are that document's.
  const lead = [`From ${method.id} ${method.title}, in the business's Management safe methods document:`];
  const record = mg.methods.get(method.id);
  if (record?.status === 'not-relevant') return [heading, lead, [notRelevantLine(record)]];
  const view = sectionView(mg);
  // An adapted MG-04 has a variation of the business's, which may bear on these answers ("we take no phone orders"): it
  // is printed after them, as the Management document prints it.
  return [heading, lead, tableLines([''], questions.map((question) => [questionCell(question, view)])),
    ...(record?.status === 'adapted' ? [[variationLine(record)]] : [])];
}

// The allergen information's last line: what it quotes, which is the pack's table and its three paragraphs in every state,
// the table's names over the Dishes table when that is printed, and the three questions when they are printed.
export function allergenSource(sources, data) {
  const { parsed } = sources.get(LISTS.allergens.section);
  const mg = sources.get('MG')?.parsed;
  const asks = Boolean(mg) && mg.methods.get(CUSTOMER_QUESTIONS.method)?.status !== 'not-relevant';
  const parts = ['The table of the fourteen allergens', ...(parsed.entries.size ? ['their shortened names over the Dishes table'] : []),
    'the paragraphs given as what the pack says', ...(asks ? ['the questions under How customers are told'] : [])];
  return quotedSourceLine(`${andList(parts)} are quoted from`, data.source);
}
