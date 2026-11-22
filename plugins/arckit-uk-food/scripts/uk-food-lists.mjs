import { DATA_ID, isObject } from './uk-food-data.mjs';
import {
  addListWorksheets, andList, blockTools, fieldKey, fieldLines, isIsoDate, longDate, methodQuestions, quotedBy, readBlocks, standard, STATE_WORDS,
  STATES, WORKSHEET_VERSION
} from './uk-food-worksheet.mjs';
import { businessText, NOT_CONFIRMED, notConfirmed, said, tableLines, UNANSWERED, worksheetName } from './uk-food-document.mjs';

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
  const block = data.diary?.pages?.find((p) => p.page === page)?.blocks?.find((b) => b.form === form);
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
const cellOf = (box, [row, column]) => (row === null ? box?.columns : box?.rows?.[row])?.[column];
const isWords = (value) => typeof value === 'string' && value !== '';
// The labels of a box, as [field, label] in the order of `cells`, or null when the box is missing or any of them is
// not there: the document is then not printed (see lacking), rather than printed with a label left out.
const labelsOf = (box, cells) => {
  const labels = cells.map(([field, ...at]) => [field, cellOf(box, at)]);
  return labels.every(([, label]) => isWords(label)) ? labels : null;
};
// The labels of a supplier's box, the team's and another contact's, and the pack's list of what the team advises on;
// or null when the data lacks either form or lays one out otherwise. The boxes are the first of their form on its
// page that the pack prints for a business to fill in: never its filled-in example (blocks marked fromImage), which
// is an invented business's words and is never printed.
function supplierForms(data) {
  const boxes = ({ form, page }) => data.diary?.pages?.find((p) => p.page === page)?.blocks
    ?.filter((b) => b.form === form && b.kind === 'table' && !b.fromImage) ?? [];
  const [supplierBox] = boxes(SUPPLIERS_FORM);
  const [teamBox, contactBox] = boxes(CONTACTS_FORM);
  const [supplier, team, contact] = [[supplierBox, SUPPLIER_CELLS], [teamBox, CONTACT_CELLS], [contactBox, CONTACT_CELLS]]
    .map(([box, cells]) => labelsOf(box, cells));
  const advice = cellOf(teamBox, TEAM_ADVICE);
  if (!supplier || !team || !contact || !isWords(advice) || cellOf(contactBox, TEAM_ADVICE) !== '') return null;
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
  return CELL_VALUES.includes(found) ? { value: found }
    : { error: `is neither ${CELL_VALUES[0]} nor ${CELL_VALUES[1]}: write one of the two, or leave it empty while it is not known; a ` +
      'precautionary statement such as may contain, or any other note, goes in Notes' };
};
// Whether a dish is prepacked for direct sale: yes or no, in any letter case, or nothing yet.
const PPDS_VALUES = ['yes', 'no'];
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
// - elsewhereLabel: the list as "the business keeps its ... elsewhere" names it. With `each`, it gives the two
//   ways a list with nothing in it is finished, as status says them (listOutstanding).
// - keptElsewhere: the words the document's line opens with when Kept elsewhere is confirmed, before the colon and
//   where: the whole phrase, article and all, so that each list words it as reads right ("a cleaning schedule", "its
//   suppliers' list"), which no one rule for the article could.
// - outstanding(parsed, data), when a list needs it: what else keeps its document from being finished, as
//   plain lines for status, the completion record and sign-off, from a worksheet with no problems: no entry
//   for the environmental health team, say, or cells not confirmed in confirmed rows. None by default.
// - lacking(data, where): what the data lacks that the list is read or printed from, as a sentence
//   starting with `where` ('the data' unless given), or null.
export const LISTS = {
  cleaning: {
    section: 'cleaning', nouns: ['cleaning item', 'cleaning items'], prefix: 'CS', title: 'Cleaning schedule', entryTitle: 'Name of the item',
    elsewhereLabel: 'cleaning schedule', keptElsewhere: 'The business keeps a cleaning schedule elsewhere',
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
    elsewhereLabel: 'suppliers\' list', keptElsewhere: 'The business keeps its suppliers\' list elsewhere',
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
      'Delivery-days is the days a supplier delivers, in your own words, such as Monday and Thursday. Lead-time is',
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
  // The business's dishes, each against the pack's fourteen allergens. A cell is filled only from what a person checked
  // (a label, a specification, a supplier's statement, or, for an ingredient with none, their own knowledge, which
  // Checked-against then says), and the dish counts only once a named person confirms its row as a whole. Kept elsewhere
  // says where the business keeps its allergen information for its dishes, if it keeps it somewhere else (the pack's
  // MG-04-Q01 asks where it is kept).
  allergens: {
    section: 'allergens', nouns: ['dish', 'dishes'], prefix: 'DISH', title: 'Allergen information', entryTitle: 'Name of the dish',
    elsewhereLabel: 'allergen information for its dishes', keptElsewhere: 'The business keeps its allergen information for its dishes elsewhere',
    fields: ['Ingredients', 'PPDS', ...ALLERGEN_FIELDS, 'Notes', 'Checked-against', 'Checked-on', 'Free-from-claim'],
    values: {
      PPDS: (value) => {
        const found = standard(value, PPDS_VALUES);
        return PPDS_VALUES.includes(found) ? { value: found }
          : { error: 'is not yes or no: yes when the dish is prepacked for direct sale, and no when it is not' };
      },
      ...Object.fromEntries(ALLERGEN_FIELDS.map((field) => [field, cellValue])),
      // The day the labels were checked has happened, so it is never after the caller's today. The commands always give
      // one. A program that reads a worksheet without a date for today (as the tests do, through the module) has the date
      // read as a date, and compared with On (see check), but not with a today it was not given: refusing it there would
      // make every such reading of a business's worksheet differ from what the commands read.
      'Checked-on': (value, data, today) => {
        if (!isIsoDate(value)) return { error: 'is not a real date written YYYY-MM-DD' };
        return today && value > today
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
      `${ALLERGEN_FIELDS[0]} to ${ALLERGEN_FIELDS.at(-1)} are the fourteen allergens. Write contains or does not contain in each, as the`,
      'labels, specifications or supplier statements checked say. For an ingredient that has none, such as loose',
      'vegetables or fresh eggs, write what the person checking knows, and say so in Checked-against.',
      'Leave one empty while it is not known: the document shows it as not confirmed. Never fill one in from the name',
      'of a dish or of an ingredient.',
      'Notes is anything else to say, such as a precautionary statement on a label that the food may contain an',
      'allergen: that is never written in an allergen\'s field.',
      'Checked-against names what was checked: each label, specification or supplier statement. Checked-on is the day',
      'it was checked, written YYYY-MM-DD, and is not after today or after On.',
      'Free-from-claim is any claim the business makes that the dish is free from an allergen, in its own words.',
      'An entry needs Checked-against and Checked-on before it can be proposed or confirmed.',
      'When a recipe, an ingredient, a brand or a supplier changes, set the dish\'s State to unanswered and clear By',
      'and On until it has been checked again.'
    ],
    quoted: null,
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

addListWorksheets({
  sections: LIST_SECTIONS, read: (reading, data) => readList(LISTS[reading.section], reading, data), emit: emitList,
  guidance: (section, data) => guidanceOf(LISTS[section], data),
  placed: 'Each entry, and anything written under Kept elsewhere, belongs below the opening comment.'
});

// ---------------------------------------------------------------------------------------------
// The list documents. Each prints its list's confirmed entries, says where the business keeps the list
// when it says it keeps it elsewhere, and names whatever is not confirmed, in the line notConfirmed prints.
// With no confirmed entry and no confirmed Kept elsewhere, it says so, with UNANSWERED.
// ---------------------------------------------------------------------------------------------

// Whether a Kept elsewhere holds anything a person wrote.
const elsewhereGiven = (elsewhere) => Boolean(elsewhere.where || elsewhere.by || elsewhere.on || elsewhere.source) ||
  elsewhere.state !== 'unanswered';

// What a person confirms for a list document, as status counts it: its entries, and nothing else. What else
// keeps a list document from being finished (nothing recorded yet, Kept elsewhere not confirmed, and whatever
// its list's outstanding hook says) is told in its own words by listOutstanding, after the count. Sign-off
// refuses on both, and also, whatever they say, on any document whose body shows something unfinished
// (freshlyUnfinished in the document module).
export const listAsked = (sheet) => ({ items: [...(sheet?.parsed?.entries.values() ?? [])].map((entry) => [entry.id, entry]) });

// What keeps a list document from being finished besides its entries not yet confirmed, as lines for status's
// unfinished list: nothing recorded at all, with the two ways to finish; what is written under Kept elsewhere
// not confirmed, with what it needs; then the list's own (its `outstanding`). `sheet` is the worksheet as
// readWorksheets reads it, which status gives only when it has no problems.
export function listOutstanding(list, sheet, data) {
  const parsed = sheet?.parsed;
  if (!parsed?.elsewhere) return [];
  const file = `food-safety/${worksheetName(list.section)}`;
  const { elsewhere } = parsed;
  return [
    ...(!parsed.entries.size && !elsewhereGiven(elsewhere) ? [`${file} has no ${list.nouns[0]} yet, and nothing under Kept elsewhere: add and ` +
      `confirm an entry for each ${list.each}, or confirm under Kept elsewhere where the business keeps its ${list.elsewhereLabel}`] : []),
    ...(elsewhereGiven(elsewhere) && !elsewhere.answered ? [`Kept elsewhere in ${file} has something written in it but is not confirmed: ` +
      'fill in Where, set State to confirmed and fill in By and On, or clear it'] : []),
    ...(list.outstanding?.(parsed, data) ?? [])
  ];
}

// What status's line for a list document says of its worksheet: how many entries are confirmed, and that the
// business keeps the list elsewhere when that is confirmed; with no entry, that, or that there are none yet.
// `doc` is the document's status entry, `sheet` its worksheet as readWorksheets reads it, or missing.
export function listSummary(list, doc, sheet) {
  const [, many] = list.nouns;
  const kept = Boolean(sheet?.clean && sheet.parsed.elsewhere?.answered);
  const keeps = `the business ${doc.questions ? 'also ' : ''}keeps its ${list.elsewhereLabel} elsewhere`;
  if (!doc.questions) return [kept ? keeps : `no ${many} yet`];
  return [`${doc.confirmed} of ${doc.questions} ${many} confirmed${doc.proposed ? `, ${doc.proposed} proposed` : ''}`, ...(kept ? [keeps] : [])];
}

// A list document's last line, which says truly what it quotes from the pack: `lead` names it, and the source
// follows as the other documents' source line gives it, read from the data. A document that prints nothing of
// the pack says so instead, with no licence line, as it holds no public sector information.
export const quotedSourceLine = (lead, source) => `${lead} the ${source.publisher}'s ${source.title}, retrieved ` +
  `${longDate(source.retrieved)}. ${source.attribution} The ${source.publisher} has not reviewed or endorsed this document.`;
const unquotedSourceLine = (source) => `Nothing in this document is quoted from the ${source.publisher}'s ${source.title}, and the ` +
  `${source.publisher} has not reviewed or endorsed this document.`;

// The line a list document prints when Kept elsewhere is confirmed: where, and who said so and when.
const elsewhereChunks = (list, elsewhere) => (elsewhere.answered
  ? [[`${list.keptElsewhere}: ${said(elsewhere.where)} (said by ${said(elsewhere.by)}, ${said(elsewhere.on)}).`]]
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
  const kept = elsewhereChunks(list, parsed.elsewhere);
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
  const kept = elsewhereChunks(list, parsed.elsewhere);
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

