import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { DATA_ID, DEFAULT_DATA_DIR, SECTION_IDS } from './uk-food-data.mjs';
import {
  andList, codePoint, EXTRA_CARE, isIsoDate, localToday, longDate, methodQuestions, PROFILE_QUESTIONS, profileQuestion, sentenceCase,
  spanOf, strictWorksheet
} from './uk-food-worksheet.mjs';
import { completionRecordDocument, DOCUMENT_FILE, PENDING, readSignOffs } from './uk-food-status.mjs';
import { HELPER, loadValidData, optionError, readOptions, usageError, valueError } from './uk-food.mjs';
import {
  allergenChunks, allergenSource, cleaningScheduleChunks, cleaningScheduleSource, keptElsewhereLine, listAsked, listCounts, listCountsWhen,
  listNotStarted, listOutstanding, LISTS, listSummary, suppliersChunks, suppliersSource
} from './uk-food-lists.mjs';
import { recordSheetsChunks, recordSheetsLacking, recordSheetsSource } from './uk-food-sheets.mjs';
export {
  BEFORE_RENDER, bodyText, businessText, closingNotice, COMPLETION_STALE, coverageChunks, DOC_OF_SECTION, extraCareDone,
  failure, misplaced, NAME_QUESTION, NOT_CONFIRMED, notConfirmed, notRelevantLine, otherText, packBlockChunks, paragraphs, questionCell,
  readWorksheets, said, sectionView, sha256, sourcesOf, tableLines, variationLine, worksheetFile, worksheetName
};

// ---------------------------------------------------------------------------------------------
// Documents: `render` writes a document body from the pack's text, read from the data, and a
// business's confirmed answers; `check` proves that a body written into a document still equals a
// fresh render; `reference` prints a section's pack text with no answers. Every word of the pack
// that reaches a document comes from the data here: the helper adds only its own labels and lines.
//
// How a section document (FOODXC, FOODCLN, FOODCHL, FOODCOOK, FOODMGT) is laid out:
// - "## " and the section's title, then its introduction, one paragraph per line of the data. A
//   paragraph already printed is not printed again: each section's title page repeats its first.
// - Each safe method under "### ", its identifier and title. A method that is not relevant shows
//   only the not-relevant line. Any other shows its summary and its boxes in order; an adapted one
//   then shows its variation line. A method that applies has no line about the business: applies
//   is the worksheet's blank default, which nobody at the business stated.
// - A box heading is a line in bold above its box. The text of a box that asks nothing (think
//   twice, prove it, text, and a CHECK IT box with no questions) is one paragraph per line.
// - The rows of a points, manage it or check it box are a table, and so are a CHECK IT box's own
//   questions, beside its text as on the page. The header row is the box's printed columns, after
//   an empty cell for each cell the rows hold that the box prints no heading over (a MANAGE IT box
//   prints none over its points). A row holds its point, its reason (when any row of the box has
//   one), then its questions in the rightmost columns, each in a column of its own when there is
//   room. Questions that print no text of their own may also use the point's column, as on page
//   67, where "Additional checks" asks for one entry under each column. Otherwise the questions
//   are stacked in the last column, an empty line apart, and a row that holds nothing but
//   questions is printed one question to a row.
// - A question shows its text and its follow-up, one to a line, then OUR_ANSWER and the answer, or
//   the unanswered or proposed string. The labels the pack prints beside its tick boxes ("Yes",
//   "No") are left out: without the boxes a reader would take them for answers. The reference keeps
//   them, joined by " / ", after the question's text. A question that takes a tick column and an
//   "if not" column (spanOf) is printed in the first, and the second is left empty. A note is
//   printed in place, with no answer. Nothing else is shown for a question: no identifier, no box.
// - A table prints its columns, then its rows, then its questions as above. A column group's
//   label is printed above the name of each column it spans, in that column's header cell. A
//   table that prints no columns has an empty header row.
// - A "what to do if things go wrong" box is a table of its two headings over their bullets,
//   then its diary line.
// - In a cell, "|" is escaped (a run of backslashes just before it is made even, so they stay text)
//   and a line break is <br>. In a line of the helper's that quotes a business's words, a line
//   break is <br>. Nothing is cut, reordered or reworded.
// - A business's words are escaped wherever they are printed (businessText), so that nothing typed
//   can hide or change the document. The one exception is a special process's own text, printed
//   word for word in a fenced code block. The pack's text is never escaped beyond the cell escaping.
// profileChunks and ownChunks describe the FOODPROF and FOODOWN bodies. Every body opens with the
// out-of-coverage sentence when the profile confirms a nation the pack does not cover, and ends with the
// closing notice and the source line (FOODOWN, which quotes nothing from the pack, with a line that
// says so instead), between the UK-FOOD:BEGIN and UK-FOOD:END marker lines. The BEGIN marker names
// the document, the data and the hash of the body (bodyHash).
// A body is built as chunks, each a list of lines, joined by an empty line.
// ---------------------------------------------------------------------------------------------

export const UNANSWERED = '**NOT YET ANSWERED**';
// What the allergen information prints in an allergen's cell, or beside a dish's PPDS, that no named person has
// confirmed: in every cell of a dish not confirmed, whatever its worksheet holds, and in any cell a confirmed dish left
// empty. Like UNANSWERED it shows the document unfinished wherever it is printed (see FOODALG's unfinishedLine), and a
// business's words can never make it, as businessText escapes the asterisks.
export const NOT_CONFIRMED_CELL = '**NOT CONFIRMED**';
// Printed before every answer in a business's document, and before the unanswered and proposed strings.
export const OUR_ANSWER = '**Our answer:** ';
const END_MARKER = '<!-- UK-FOOD:END -->';
// The BEGIN marker names the document, the data and the hash of the body: see bodyHash.
const BEGIN_MARKER = /^<!-- UK-FOOD:BEGIN doc=(\S+) data=(\S+) body=(\S+) -->$/;
const beginMarker = (doc, hash) => `<!-- UK-FOOD:BEGIN doc=${doc} data=${DATA_ID} body=${hash} -->`;
// The worksheets the documents read, in the order they are read: the one list a new worksheet is added
// to. Let, not const, only so that withDocuments can give a test's list in its place.
export let SHEET_ORDER = ['profile', ...SECTION_IDS, 'own', 'allergens', 'cleaning', 'suppliers'];

// ---------------------------------------------------------------------------------------------
// The documents, one row each, in the order status lists them, the completion record last. Adding a
// document is adding its row, before the completion record's: every list of documents the helper
// keeps or prints (DOC_CODES, RENDERED_CODES, STATUS_ORDER, SECTION_DOCS, the usage text and each
// "--doc is one of" message) is derived from this table, and render, check, status and sign-off read
// what is particular to a document from its row. A row's fields:
// - code: the document's code, as in its file name.
// - name(data): what status and the completion record call it.
// - sheet: its own worksheet, whose questions or entries status counts for it and whose state status
//   tells under it; null for a document with none.
// - uses: the worksheets it is rendered from, in any order: status lists its own first, then the
//   others in SHEET_ORDER.
// - needs: those of `uses` it cannot be rendered without: render refuses while one is missing. Any other
//   it uses may be missing, and the document says so; one there with problems stops render all the same.
// - dataNeeded: the section whose data file it cannot be rendered without, or null.
// - signable: whether a named person signs it off. sign-off refuses one nobody signs, and its header
//   says nothing but DRAFT and [PENDING]. Status never tells such a document that it is not signed off.
// - inStatus: whether status lists it among the documents, each with its counts, to be finished and signed.
//   Two are not there, and each says why by a field of its own: the completion record (render), which
//   reports on them, and the record sheets (blankForms), which status reports apart. tableProblems refuses
//   any other row left out, as status would then say nothing of it.
// - chunks(sources, data, project): its body, after the coverage sentence and before the closing
//   notice, as chunks (see the layout above). `sources` maps each worksheet of `uses` that exists to
//   what readWorksheets reads from it.
// - source(data, sources): the body's last line, which says where its words come from. `sources` is as for
//   chunks, for a document whose words from the pack depend on what its worksheet holds.
// - unfinishedLine(line): whether a line of its body shows it unfinished (see showsUnfinished). Whatever status
//   counts, sign-off refuses any document whose body rendered afresh shows a line this marks (see freshlyUnfinished).
// - asks(sheet, data): what a person answers for it, from its own worksheet (`sheet`, as readWorksheets
//   reads it, or undefined when it is missing or the document has none): { items }, an [identifier,
//   record] for each question or entry in order, and for a section document `notRelevant` and
//   `adapted`, the methods marked so. No method's status is read from a worksheet with problems: each
//   method then counts as applying, as in a blank worksheet.
// - nouns: what status calls those, one and many.
// - entries: whether they are entries a person confirms, rather than questions a person answers.
// - outstanding(sheet, data, sheets), when given: what else keeps the document from being finished, as lines
//   for status's unfinished list (and so for the completion record and sign-off's reasons), after the lines its
//   counts give; read from its own worksheet, `sheet`, only when that worksheet has no problems. `sheets` is
//   every worksheet status read (readWorksheets), for a document that prints from another worksheet too: the
//   allergen information repeats the Management worksheet's answers on how customers are told, so what it
//   shows unfinished depends on that worksheet as well. A list document's says that nothing is recorded yet, or
//   that what is written under Kept elsewhere is not confirmed, and whatever else its list needs
//   (uk-food-lists.mjs).
// - summary(doc, sheet), when given: what status's line for the document says in place of "N of M ...
//   confirmed", as a list of parts; `doc` is the document's status entry. A list document's says that the
//   list is kept elsewhere, where a count of entries could not.
// - notStarted(), when given: the line status gives, in place of the one every worksheet shares, while the document's
//   own worksheet is not started. A list document's says what the document is for and which worksheet to make, as a
//   business that kept its documents before the list documents came meets each of them there first.
// - countsWhen(ids, sheet, data), when given: what status's count lines say, after naming the questions or entries
//   `ids` (those a line shows), that they need in order to count, in place of the words the others share ("an answer
//   counts when its State is confirmed and By and On are filled in"); `sheet` is the document's own worksheet, with no
//   problems. A list document's names the worksheet's guidance too, and what each entry named still lacks, since an
//   entry confirmed without a field its list needs is not read at all.
// - tally(sheet, counts), when given: what status --json gives as the document's `counts`, from its own worksheet and
//   status's count for it (`counts`: questions, confirmed and the rest). A list document's gives its entries and those
//   confirmed, under the names a list uses, and whatever its list counts besides (the allergen information's empty
//   cells of confirmed dishes). A document without it has no `counts`, so the fields the seven before the lists give
//   are what they always were.
// - section: set by sectionDocument alone, on a document that prints a section of the pack; the
//   section, which is also its own worksheet. SECTION_DOCS and DOC_OF_SECTION come from it, and the
//   usage text and each "--doc is one of" message list these documents first.
// A rule that belongs to one document alone is a field of its row and no other:
// - lacking(data), the profile's and the list documents': what the data lacks that the document quotes,
//   beyond its data file, as render says it, or null.
// - tellsToo, the allergen information's and the record sheets': the worksheets besides its own whose state status's
//   unfinished list gives under this document as well as under their own, as it prints words from them and cannot be
//   written while one of them cannot be read: both print from the Management worksheet. The profile is never one: every
//   document reads it, and its state is told once, under the profile document at the head of the list. Nor are the
//   worksheets the profile document reads for each safe method's status: they are told under their own documents,
//   which follow it, as they always were.
// - specialProcesses, the own methods document's: a special process the profile confirms that has no
//   own entry keeps it from being signed off, and status lists that, and each own entry awaiting
//   environmental health review, under this document.
// - render(project, data), the completion record's: its own renderer, in uk-food-status.mjs, used in
//   place of chunks and source. It is rendered from the project's status, so check reads any difference
//   from a fresh render as out of date, in the words of `outOfDate`, never as an edit. The row that has it
//   is the completion record (COMPLETION_RECORD): one row at most, and never one in status.
// - blankForms, the record sheets': true on the one document of blank forms that people at the business fill
//   in by hand. Nobody signs it and it asks nothing, so it is not in status among the documents to finish;
//   status says only whether it is written and in step, in its own key (recordSheets) and in the unfinished
//   list (RECORD_SHEETS). One row at most, never in status, never signed off, with no render of its own.
// - remedies, on the blank forms' row and no other: what check says to do about a fault, where the shared words
//   would send a person to a worksheet of the document's own, which it has none of: { advice, the line check's
//   message ends with in place of CHECK_ADVICE, as { stale, edited, markers }, one for each kind of fault; stale,
//   edited(line) and markers(detail), the reason for each kind }.
// - nobodySigns and signOffRefusal, on every row nobody signs: how a header claim and sign-off say so.
// A new worksheet is added to SHEET_ORDER, at the place it is to be read (and to the worksheet module,
// which makes and parses it). A row may use only worksheets SHEET_ORDER lists; status reads each
// worksheet some row uses, and no other; and a document reads only the worksheets of its own `uses`, so
// a worksheet another document adds never reaches the profile. tableProblems checks every row as the
// helper loads, so a row that is not whole stops it then, naming the row and the field.
// ---------------------------------------------------------------------------------------------

const QUESTIONS = ['question', 'questions'];
// What shows a document unfinished, but for the own methods document: a question not yet answered,
// wherever answerOf prints it.
const unanswered = (line) => line.includes(UNANSWERED);
// The last line of a document that quotes the pack.
const packSource = (data) => sourceLine(data.source);
const COMPLETION_STALE = 'this completion record is out of date: it no longer matches the project\'s worksheets, documents ' +
  'and sign-offs, or it was edited. It is generated, so it is not changed by hand: render it again.';
// What check says to do about a fault in the record sheets, in place of the shared words, which send a person to the
// document's own worksheet: the record sheets have none. What a person changes there by hand is most likely a form filled
// in, or a check of the pack's taken out, and neither can be made in any worksheet; and writing the document again
// replaces everything between the markers, so what was typed there is copied out first. The business's own checks are the
// one thing in them a worksheet holds. Each remedy says what the record sheets command then accepts: it prints the forms
// afresh over forms typed into only once a person running it says that what was typed has been copied or is not wanted,
// and never over a file whose markers are damaged, whatever anyone says. FORMS_AFRESH says why, and FORMS_REMEDY and
// MARKERS_REMEDY what to do instead, in the words a status line and check's message share; advice is check's message's
// last line, for each kind of fault.
const FORMS_AFRESH = 'its forms are printed afresh each time it is written, and writing it again replaces everything between its UK-FOOD markers';
const KEEP_APART = 'fill in a printed page, or a copy kept apart from this file, never this file itself; copy anything already filled in it ' +
  'to such a copy first; add or change the business\'s own opening and closing checks in the Management safe methods worksheet';
const FORMS_REMEDY = `${KEEP_APART}; then run the record sheets command again and say that what was typed has been copied or is not ` +
  'wanted: until a person running it says so, it writes nothing over this file';
const MARKERS_REMEDY = `${KEEP_APART}; then put the UK-FOOD marker lines back as they were, or move this file out of the project folder ` +
  'so that the record sheets command writes the document new: it writes nothing over a file whose markers are damaged, whatever anyone says';
const ADVICE_LEAD = 'This document is printed afresh each time it is written, and writing it again replaces everything between its UK-FOOD markers';
const RECORD_SHEETS_REMEDIES = {
  advice: {
    stale: `${ADVICE_LEAD}: run the record sheets command again, which prints it afresh.`,
    edited: `${ADVICE_LEAD}: ${FORMS_REMEDY}.`,
    markers: `${ADVICE_LEAD}: ${MARKERS_REMEDY}.`
  },
  stale: 'is out of date, as a worksheet it is written from has changed since: write it again',
  edited: (line) => `was changed between its UK-FOOD markers, at line ${line}, but ${FORMS_AFRESH}: ${FORMS_REMEDY}`,
  markers: (detail) => `has its UK-FOOD markers missing or damaged (${detail}), and ${FORMS_AFRESH}: ${MARKERS_REMEDY}`
};

// A section document: the pack's section `section`, with the business's answers from its worksheet.
function sectionDocument(code, section) {
  return {
    code, name: (data) => sentenceCase(data.sections.get(section).section.title), sheet: section, uses: ['profile', section],
    needs: ['profile', section], dataNeeded: section, signable: true, inStatus: true,
    chunks: (sources, data) => sectionChunks(data.sections.get(section), sectionView(sources.get(section).parsed)),
    source: packSource, unfinishedLine: unanswered, asks: (sheet, data) => methodsAsked(sheet, data.sections.get(section)),
    nouns: QUESTIONS, entries: false, section
  };
}

// The questions of each method of a section that is not marked not relevant. See asks above.
function methodsAsked(sheet, file) {
  const asked = { items: [], notRelevant: [], adapted: [] };
  for (const method of file.methods) {
    const status = sheet?.clean ? sheet.parsed.methods.get(method.id)?.status : 'applies';
    if (status === 'not-relevant') {
      asked.notRelevant.push(method.id);
      continue;
    }
    if (status === 'adapted') asked.adapted.push(method.id);
    for (const { question } of methodQuestions(method)) asked.items.push([question.id, sheet?.parsed?.answers.get(question.id)]);
  }
  return asked;
}

// A list document: the list `section` of uk-food-lists.mjs (one of LISTS), printed from its own worksheet and the
// profile. `overrides` gives what is particular to the document: always its `code`, its `nouns` (a literal equal to
// its list's, which a test holds equal, as the list module cannot be read while this table is made), its `chunks`
// and its `source`; and any field to put in place of the one given here, such as `uses` and `needs` for a document
// that reads another worksheet too, or `unfinishedLine` for one with a mark of its own. Every field that calls the
// list module, which imports this one, does so when it runs.
// - An entry or a Kept elsewhere not yet confirmed shows it unfinished, as an own entry does FOODOWN; so does
//   UNANSWERED, which a list document prints wherever it is unfinished in any other way.
// - Its entries, and nothing else, are counted; listOutstanding and listSummary say the rest in its list's words.
// - elsewhereOnlyLine(sheet): what the completion record says of it when it says only where the business keeps the
//   list (keptElsewhereLine), or null. Only a list document has it.
function listDocument(section, overrides) {
  return {
    name: () => LISTS[section].title, sheet: section, uses: ['profile', section], needs: ['profile', section], dataNeeded: null,
    signable: true, inStatus: true, unfinishedLine: (line) => unanswered(line) || line.startsWith(NOT_CONFIRMED),
    asks: (sheet) => listAsked(sheet), entries: true,
    outstanding: (sheet, data, sheets) => listOutstanding(LISTS[section], sheet, data, sheets),
    summary: (doc, sheet) => listSummary(LISTS[section], doc, sheet),
    notStarted: () => listNotStarted(LISTS[section]),
    countsWhen: (ids, sheet, data) => listCountsWhen(LISTS[section], ids, sheet, data),
    tally: (sheet, counts) => listCounts(LISTS[section], sheet, counts),
    elsewhereOnlyLine: (sheet) => keptElsewhereLine(LISTS[section], sheet),
    lacking: (data) => LISTS[section].lacking(data),
    ...overrides
  };
}

// Let, not const, only so that withDocuments can put a test's table in its place.
export let DOCUMENTS = [
  {
    // It reads the five sections' worksheets and the own worksheet, for the status of each safe method
    // and the list of own methods, and quotes the special-processes paragraph from CK.json.
    code: 'FOODPROF', name: () => 'Business profile', sheet: 'profile', uses: ['profile', ...SECTION_IDS, 'own'],
    needs: ['profile'], dataNeeded: 'CK', signable: true, inStatus: true, chunks: profileChunks, source: packSource,
    unfinishedLine: unanswered,
    asks: (sheet) => ({ items: PROFILE_QUESTIONS.map((question) => [question.id, sheet?.parsed?.answers.get(question.id)]) }),
    nouns: QUESTIONS, entries: false,
    lacking: (data) => (extraCareParagraph(data) ? null : `the data's CK.json has no text box in ${EXTRA_CARE_BOX.method} on page ` +
      `${EXTRA_CARE_BOX.page}, whose first paragraph the profile quotes about special processes and foods`)
  },
  sectionDocument('FOODXC', 'XC'),
  sectionDocument('FOODCLN', 'CL'),
  sectionDocument('FOODCHL', 'CH'),
  sectionDocument('FOODCOOK', 'CK'),
  sectionDocument('FOODMGT', 'MG'),
  {
    code: 'FOODOWN', name: () => 'Own methods', sheet: 'own', uses: ['profile', 'own'], needs: ['profile', 'own'], dataNeeded: null,
    signable: true, inStatus: true, chunks: ownChunks,
    // It quotes nothing from the pack, and its last line says so.
    source: () => OWN_SOURCE_LINE,
    // An own entry not yet confirmed shows it unfinished too: the line notConfirmed prints. The profile
    // lists such entries as well, but is finished when its own questions are, so that line counts for
    // nothing there.
    unfinishedLine: (line) => unanswered(line) || line.startsWith(NOT_CONFIRMED),
    asks: (sheet) => listAsked(sheet),
    nouns: ['own entry', 'own entries'], entries: true, specialProcesses: true
  },
  // The business's dishes against the pack's fourteen allergens, with what each was checked against, its prepacked for
  // direct sale food, its own "free from" statements beside the pack's conditions for them, and, from the Management
  // worksheet, its answers on how customers are told. It renders without that worksheet (it says what is not yet
  // answered), so the worksheet is in its uses and not its needs; one there with problems stops render, as for any
  // worksheet a document uses, and status tells it under this document too (tellsToo). An allergen cell nobody confirmed
  // shows it unfinished, as UNANSWERED and an entry not confirmed do.
  listDocument('allergens', {
    code: 'FOODALG', nouns: ['dish', 'dishes'], uses: ['profile', 'allergens', 'MG'], needs: ['profile', 'allergens'], tellsToo: ['MG'],
    chunks: (sources, data) => allergenChunks(sources, data), source: (data, sources) => allergenSource(sources, data),
    unfinishedLine: (line) => unanswered(line) || line.includes(NOT_CONFIRMED_CELL) || line.startsWith(NOT_CONFIRMED)
  }),
  // The pack's cleaning schedule form, with the business's own entries. It says truly what it quotes: the form's
  // column headings, when it prints the form.
  listDocument('cleaning', {
    code: 'FOODCS', nouns: ['cleaning item', 'cleaning items'], chunks: (sources, data) => cleaningScheduleChunks(sources, data),
    source: (data, sources) => cleaningScheduleSource(sources, data)
  }),
  // The pack's suppliers' list and contacts list forms, with the business's suppliers, its environmental health team
  // and its other contacts. It quotes the forms' labels and the team's list in every state, and says so.
  listDocument('suppliers', {
    code: 'FOODSUP', nouns: ['entry', 'entries'], chunks: (sources, data) => suppliersChunks(sources, data), source: (data) => suppliersSource(data)
  }),
  // The pack's blank diary cover, opening and closing checks, week page and prove it records, for people at the
  // business to print or copy and fill in by hand (uk-food-sheets.mjs). It has no worksheet of its own: it prints the
  // business's name from the profile and its own opening and closing checks from the Management worksheet. It renders
  // without that worksheet (it then adds no checks of the business's own), so the worksheet is in its uses and not its
  // needs; one there with problems stops render, as for any worksheet a document uses, as it does the allergen
  // information's, and status tells it under this document too (tellsToo). Nobody signs it off, as it is forms whose
  // pages are for people to sign, and it asks nothing, so no line of it can show it unfinished, and status reports
  // only whether it is written and in step (blankForms).
  {
    code: 'FOODREC', name: () => 'Diary and record sheets', sheet: null, uses: ['profile', 'MG'], needs: ['profile'], tellsToo: ['MG'], dataNeeded: null,
    signable: false, inStatus: false, chunks: (sources, data) => recordSheetsChunks(sources, data), source: (data) => recordSheetsSource(data),
    unfinishedLine: () => false, asks: null, nouns: null, entries: false, blankForms: true, lacking: (data) => recordSheetsLacking(data),
    remedies: RECORD_SHEETS_REMEDIES,
    nobodySigns: 'the diary and record sheets are blank forms for people at the business to fill in and sign, so the document itself ' +
      'is never signed off',
    signOffRefusal: 'FOODREC, the diary and record sheets, is not signed off: it is a set of blank forms, for people at the business to ' +
      'fill in and sign themselves as they use them'
  },
  {
    // It reads no worksheet itself: status, which it is rendered from, reads them all.
    code: 'FOODCMP', name: () => 'Completion record', sheet: null, uses: [], needs: [], dataNeeded: null, signable: false,
    inStatus: false, chunks: null, source: null, unfinishedLine: unanswered, asks: null, nouns: null, entries: false,
    render: (project, data, options) => completionRecordDocument(project, data, options),
    outOfDate: { message: COMPLETION_STALE, reason: 'is out of date, as it no longer matches the project: render it again' },
    nobodySigns: 'the completion record is a report that nobody signs',
    signOffRefusal: 'FOODCMP, the completion record, is not signed off: it is a report, signed through the documents it lists, so ' +
      'sign off each of them'
  }
];

// What is wrong with a table of documents and its list of worksheets: one message for each field that
// render, check, status or sign-off reads and could not, naming the row and the field, or none.
function tableProblems(rows, sheets) {
  const problems = [];
  const isText = (value) => typeof value === 'string' && value !== '';
  const isFunction = (value) => typeof value === 'function';
  rows.forEach((row, i) => {
    const fault = (field, what) => problems.push(`${isText(row.code) ? row.code : `row ${i + 1}`}: ${field} ${what}`);
    if (!/^[A-Z]+$/.test(row.code ?? '')) fault('code', 'is not capital letters, as a document\'s file name holds them');
    else if (rows.findIndex((other) => other.code === row.code) !== i) fault('code', 'is another row\'s too');
    for (const field of ['name', 'unfinishedLine']) if (!isFunction(row[field])) fault(field, 'is not a function');
    for (const field of ['signable', 'inStatus']) if (typeof row[field] !== 'boolean') fault(field, 'is not true or false');
    if (!Array.isArray(row.uses) || !Array.isArray(row.needs)) return fault('uses and needs', 'are not both lists of worksheets');
    for (const name of row.uses) if (!sheets.includes(name)) fault('uses', `names ${name}, which is not in SHEET_ORDER, so nothing reads it`);
    for (const name of row.needs) if (!row.uses.includes(name)) fault('needs', `names ${name}, which is not in its uses`);
    if (row.tellsToo !== undefined && !Array.isArray(row.tellsToo)) fault('tellsToo', 'is not a list of worksheets');
    for (const name of row.tellsToo ?? []) {
      if (!row.uses.includes(name) || name === row.sheet) fault('tellsToo', `names ${name}, which is not one of its uses other than its own worksheet`);
    }
    if (row.sheet !== null && !row.uses.includes(row.sheet)) fault('sheet', 'is neither null nor one of its uses');
    if (row.section !== undefined && (!SECTION_IDS.includes(row.section) || row.section !== row.sheet)) {
      fault('section', 'is not a section of the pack that is also its own worksheet');
    } else if (row.section !== undefined && rows.findIndex((other) => other.section === row.section) !== i) {
      fault('section', `is ${row.section}, which another row prints too`);
    }
    if (row.dataNeeded !== null && !SECTION_IDS.includes(row.dataNeeded)) fault('dataNeeded', 'is neither null nor a section of the pack');
    if (row.render === undefined) {
      for (const field of ['chunks', 'source']) if (!isFunction(row[field])) fault(field, 'is not a function, and the row has no render of its own');
      if (!row.needs.includes('profile')) fault('needs', 'leaves out profile, which render reads for the coverage sentence and the closing notice');
    } else {
      if (!isFunction(row.render)) fault('render', 'is not a function');
      if (!isText(row.outOfDate?.message) || !isText(row.outOfDate?.reason)) fault('outOfDate', 'does not give the message and the reason check prints');
      // The completion record is the row with a renderer of its own: rendered from the status of the others, so it is
      // not one of them, and there is one.
      if (row.inStatus) fault('render', 'is given on a row in status, and a document rendered from the status of the others is not one of them');
      if (rows.findIndex((other) => other.render !== undefined) !== i) fault('render', 'is another row\'s too: one document is the completion record');
    }
    if (row.blankForms !== undefined && row.blankForms !== true) fault('blankForms', 'is neither true nor left out');
    else if (row.blankForms && (row.inStatus || row.signable || row.render !== undefined)) {
      fault('blankForms', 'is on a row in status, signed off or with a renderer of its own, where blank forms are none of these');
    } else if (row.blankForms && rows.findIndex((other) => other.blankForms) !== i) {
      fault('blankForms', 'is another row\'s too: status reports one document of blank forms, as the record sheets');
    }
    // Blank forms have no worksheet of their own, so check's shared words for a fault would send a person to one.
    const remedies = row.remedies;
    if (remedies !== undefined && !row.blankForms) fault('remedies', 'is given on a row that is not blank forms, whose own worksheet check\'s words name');
    else if (row.blankForms && !(['stale', 'edited', 'markers'].every((kind) => isText(remedies?.advice?.[kind])) && isText(remedies?.stale) &&
      isFunction(remedies?.edited) && isFunction(remedies?.markers))) {
      fault('remedies', 'does not give the advice, stale, edited and markers words check gives blank forms, which have no worksheet of their own');
    }
    // Status lists every document but these two, and says nothing of any other row left out of it.
    if (!row.inStatus && row.render === undefined && !row.blankForms) {
      fault('inStatus', 'is false, though the row is neither the completion record (render) nor the record sheets (blankForms), so status ' +
        'would say nothing of it');
    }
    if (row.inStatus) {
      if (!isFunction(row.asks)) fault('asks', 'is not a function, and status counts what a document in it asks');
      if (!Array.isArray(row.nouns) || row.nouns.length !== 2 || !row.nouns.every(isText)) fault('nouns', 'is not the two words status uses, one and many');
      if (typeof row.entries !== 'boolean') fault('entries', 'is not true or false');
    }
    if (row.signable === false) {
      for (const field of ['nobodySigns', 'signOffRefusal']) if (!isText(row[field])) fault(field, 'is not given, and a document nobody signs needs its words');
    }
    for (const field of ['lacking', 'outstanding', 'summary', 'notStarted', 'countsWhen', 'tally']) {
      if (row[field] !== undefined && !isFunction(row[field])) fault(field, 'is not a function');
    }
    if (row.specialProcesses !== undefined && row.specialProcesses !== true) fault('specialProcesses', 'is neither true nor left out');
    else if (row.specialProcesses && rows.findIndex((other) => other.specialProcesses) !== i) {
      fault('specialProcesses', 'is another row\'s too: one document holds the special processes and own entries');
    }
  });
  return problems;
}

// The lists derived from DOCUMENTS, by deriveLists. Let, not const, only so that withDocuments can
// derive them again from a test's table: nothing else assigns them.
export let DOC_CODES;
export let RENDERED_CODES;
export let STATUS_ORDER;
export let SECTION_DOCS;
let DOC_OF_SECTION;
export let COMPLETION_RECORD;
export let RECORD_SHEETS;
// The worksheets status reads: each one some document uses, in SHEET_ORDER.
let SHEETS_USED;
// Checks the table, and derives the lists above from it. A table that is not whole is refused.
function deriveLists() {
  const problems = tableProblems(DOCUMENTS, SHEET_ORDER);
  if (problems.length) throw new Error(`the table of documents in uk-food-document.mjs is not whole:\n${problems.join('\n')}`);
  const sections = DOCUMENTS.filter((row) => row.section !== undefined);
  // The usage text and each "--doc is one of" message list the section documents first.
  const listed = [...sections, ...DOCUMENTS.filter((row) => row.section === undefined)];
  // Every document render and check take, and those a named person signs off.
  RENDERED_CODES = listed.map((row) => row.code);
  DOC_CODES = listed.filter((row) => row.signable).map((row) => row.code);
  // The documents status lists, in its order.
  STATUS_ORDER = DOCUMENTS.filter((row) => row.inStatus).map((row) => row.code);
  // Each section document's section, and each section's document.
  SECTION_DOCS = Object.fromEntries(sections.map((row) => [row.code, row.section]));
  DOC_OF_SECTION = Object.fromEntries(sections.map((row) => [row.section, row.code]));
  // The completion record: rendered and checked like the documents above, but it reports on them, so it
  // is neither in their status nor signed off itself. It is the row with a renderer of its own (render),
  // which tableProblems holds to one. Its renderer and its line in status are in uk-food-status.mjs.
  COMPLETION_RECORD = DOCUMENTS.find((row) => row.render !== undefined)?.code;
  // The record sheets: blank forms, rendered and checked like the documents, but nobody signs them and they ask
  // nothing, so status reports them apart (blankForms, held to one row). Undefined in a table without them.
  RECORD_SHEETS = DOCUMENTS.find((row) => row.blankForms)?.code;
  SHEETS_USED = SHEET_ORDER.filter((name) => DOCUMENTS.some((row) => row.uses.includes(name)));
}
deriveLists();

// The row of the document `code`, or undefined when there is none.
export const documentOf = (code) => DOCUMENTS.find((row) => row.code === code);

// For tests only: runs `fn` with `rows` in place of the table, and `sheets`, when given, in place of
// SHEET_ORDER, every list derived from them, then puts the table, SHEET_ORDER and the lists back, however
// `fn` ends. Returns what `fn` returns. `fn` runs synchronously, so one that returns a promise (an async
// function) is refused: the part after its first await would run against the real table.
export function withDocuments(rows, fn, sheets = SHEET_ORDER) {
  const kept = [DOCUMENTS, SHEET_ORDER];
  try {
    [DOCUMENTS, SHEET_ORDER] = [rows, sheets];
    deriveLists();
    const result = fn();
    if (typeof result?.then === 'function') {
      throw new Error('withDocuments runs fn synchronously and puts the table back as soon as it returns: give it a function that ' +
        'is not async and returns no promise');
    }
    return result;
  } finally {
    [DOCUMENTS, SHEET_ORDER] = kept;
    deriveLists();
  }
}

// The worksheets a document renders from, and those it cannot be rendered without. The profile
// document says which section worksheets and own worksheet are missing; the others refuse.
const sourcesOf = (doc) => {
  const { uses, needs } = documentOf(doc);
  return { uses, needs };
};
const OUTSIDE_COVERAGE = 'Safer food, better business applies to England and Wales. This business is outside that ' +
  'coverage: Scotland and Northern Ireland have their own guidance.';
const COVERED_NATIONS = ['England', 'Wales'];
// What every document opens with when the profile confirms that the business is in neither: the
// sentence above, so that no document of a business the pack does not cover reads as if it did.
// `profile` is the parsed profile worksheet, or null when it cannot be relied on.
const coverageChunks = (profile) => {
  const nation = profile?.answers.get(NATION_QUESTION);
  return nation?.answered && !COVERED_NATIONS.includes(nation.value) ? [[OUTSIDE_COVERAGE]] : [];
};
const NAME_QUESTION = profileQuestion('business-name').id;
const NATION_QUESTION = profileQuestion('nation').id;
// The profile's last questions ask about the special processes and foods, in EXTRA_CARE's order.
const EXTRA_CARE_ASKED = [...EXTRA_CARE.processes.map((name) => [`process:${name}`, name]), ...EXTRA_CARE.foods.map((name) => [`food:${name}`, name])]
  .map(([key, name]) => ({ id: profileQuestion(key).id, name }));
// The text box that names them; its first paragraph says what a business that does them must do.
export const EXTRA_CARE_BOX = { method: 'CK-02', page: 53 };
const STATUS_WORDS = { applies: 'applies', adapted: 'adapted', 'not-relevant': 'not relevant' };
const KIND_WORDS = { additional: 'additional control', 'special-process': 'special process' };
// An own entry's fields as the own methods document labels them. Supplied-text is quoted below.
const OWN_ROWS = [['Kind', 'kind'], ['Special process or food', 'process'], ['Hazard', 'hazard'], ['Control', 'control'], ['Limit', 'limit'],
  ['Where the limit comes from', 'limitSource'], ['Check', 'check'], ['If it fails', 'ifItFails'],
  ['Environmental health review', 'ehReview']];
const CHECK_ADVICE = 'The text between the UK-FOOD markers is generated, so it is not changed there: to change what ' +
  'it says, edit the worksheet and render the document again.';
// FOODOWN's last line in place of the source line: it quotes nothing from the pack.
const OWN_SOURCE_LINE = 'The methods in this document are this business\'s own. They are not Food Standards Agency ' +
  'wording, and the Food Standards Agency has not reviewed or endorsed this document.';
const makeWorksheet = (section, file) => `node "${HELPER}" worksheet --section ${section} > "${file}"`;

const inline = (text) => String(text).replace(/\n/g, '<br>');
const cell = (text) => inline(String(text).replace(/(\\*)\|/g, (_, slashes) => `${slashes}${slashes.length % 2 ? '\\' : ''}\\|`));
// A business's words as a document prints them: <, > and & as entities, and each character Markdown
// reads as markup (\ ` * _ [ ] ~) after a backslash, so that nothing typed can hide or change the
// document. So is $, which some Markdown viewers read as the start of mathematics. Line breaks are
// left for the caller: <br> in a cell or a line of the helper's.
const businessText = (text) => String(text).replace(/[\\`*_[\]~$]/g, '\\$&').replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;');
const said = (text) => inline(businessText(text));
// Text printed word for word in a fenced code block, so that nothing in it is read as markup. The
// fence is longer than the longest run of backticks in the text, so no line of it can close the block.
const fenced = (text) => {
  const fence = '`'.repeat(Math.max(3, ...(text.match(/`+/g) ?? []).map((run) => run.length + 1)));
  return [`${fence}text`, ...text.split('\n'), fence];
};
export const sourceLine = (source) => `Safety points, reasons and checks are quoted from the ${source.publisher}'s ` +
  `${source.title}, retrieved ${longDate(source.retrieved)}. ${source.attribution} The ${source.publisher} has not ` +
  'reviewed or endorsed this document.';
const closingNotice = (name) => `This is ${name ? `${said(name)}'s` : 'the business\'s'} own food safety record. It ` +
  'is not legal advice. The food business operator is responsible for it, and the local council\'s environmental ' +
  'health team is the authority on whether it is adequate.';
// What a document prints for an answer: the answer itself only when the parser marks it answered.
const answerOf = (record) => {
  const [answer, by, on, source] = [record?.answer, record?.by, record?.on, record?.source].map((v) => businessText(v ?? ''));
  if (record?.answered) return `${OUR_ANSWER}${answer} [answered by ${by}, ${on}]`;
  if (record?.state === 'proposed') return `${OUR_ANSWER}${UNANSWERED} (proposed from ${source}: \u201c${answer}\u201d)`;
  return `${OUR_ANSWER}${UNANSWERED}`;
};

const paragraphs = (text) => (text ? text.split('\n').filter((line) => line !== '').map((line) => [line]) : []);
const tableLines = (header, rows) => {
  const line = (cells) => `| ${cells.map(cell).join(' | ')} |`;
  return [line(header), `|${' --- |'.repeat(header.length)}`, ...rows.map(line)];
};
// What the pack prints for a question: its text, the labels beside its tick boxes (when `labels`) and
// its follow-up.
const printedParts = (q, labels) => [q.text, labels ? (q.options ?? []).join(' / ') : '', q.elseText ?? '']
  .filter((part) => part !== '');

// Where each question of a row goes: its first column and how many it takes. See the layout above.
function placements(questions, { left, width }) {
  const spans = questions.map(spanOf);
  const total = spans.reduce((sum, span) => sum + span, 0);
  const fits = total <= width - left || (total <= width && questions.every((q) => q.text === ''));
  let at = width - total;
  return { fits, places: spans.map((span) => (fits ? { at: (at += span) - span, span } : { at: width - 1, span: 1 })) };
}

// What a document prints in a cell for one question: what `view.parts` gives of it, then the answer `view.answer`
// gives (none for a note), one to a line; '' when there is nothing. This is the one printer of a question and its
// answer: the section documents use it in their tables, and the allergen information uses it to repeat three of the
// Management document's questions exactly as that document prints them.
const questionCell = (question, view) => {
  const answer = question.type === 'note' ? null : view.answer(question);
  return [...view.parts(question), ...(answer ? [answer] : [])].join('\n');
};

// The cells of one row. A question goes in the first column of those it takes. `view.parts` gives
// what to print of a question, and `view.answer` its answer, or null to print none.
function rowCells(row, layout, view) {
  const cells = Array.from({ length: layout.width }, () => []);
  if (row.point) cells[0].push(row.point);
  if (row.why) cells[Number(layout.hasPoint)].push(row.why);
  const questions = row.questions ?? [];
  placements(questions, layout).places.forEach(({ at }, i) => {
    const text = questionCell(questions[i], view);
    if (text) cells[at].push(text);
  });
  return cells.map((segments) => segments.join('\n\n'));
}

// The table rows of one row: one, or one for each question of a row of nothing but questions that
// cannot each have a column.
function tableRowsOf(row, layout, view) {
  const questions = row.questions ?? [];
  if (layout.left > 0 || questions.length < 2 || placements(questions, layout).fits) return [rowCells(row, layout, view)];
  return questions.map((question) => rowCells({ point: null, why: null, questions: [question] }, layout, view));
}

function rowTable(columns, rows, view) {
  const hasPoint = rows.some((row) => row.point != null);
  const left = Number(hasPoint) + Number(rows.some((row) => row.why != null));
  const asks = rows.some((row) => (row.questions ?? []).length > 0);
  const layout = { hasPoint, left, width: Math.max(columns.length, left + Number(asks), 1) };
  const header = [...Array(layout.width - columns.length).fill(''), ...columns];
  return tableLines(header, rows.flatMap((row) => tableRowsOf(row, layout, view)));
}

// A CHECK IT box: its text beside its own questions, or above its rows, or alone.
function checkItChunks(block, view) {
  const rows = [...(block.rows ?? [])];
  const asks = (block.questions ?? []).length > 0;
  const textApart = Boolean(block.text) && (rows.length > 0 || !asks);
  if (asks) rows.push({ point: textApart ? null : block.text ?? null, why: null, questions: block.questions });
  return [...(textApart ? paragraphs(block.text) : []), ...(rows.length ? [rowTable(block.columns ?? [], rows, view)] : [])];
}

function tableChunk(block, view) {
  const { columns, rows } = block;
  const questions = block.questions ?? [];
  const width = Math.max(columns.length, ...rows.map((row) => row.length), 1);
  const groupOf = (i) => (block.columnGroups ?? []).find((group) => i >= group.from && i <= group.to);
  const header = Array.from({ length: width }, (_, i) => {
    const group = groupOf(i);
    return group ? `${group.label}\n${columns[i]}` : columns[i] ?? '';
  });
  const asked = questions.length ? tableRowsOf({ point: null, why: null, questions }, { hasPoint: false, left: 0, width }, view) : [];
  return tableLines(header, [...rows.map((row) => [...row, ...Array(width - row.length).fill('')]), ...asked]);
}

function wrongChunks(block) {
  const sides = [[block.wrongHeading, block.wrong], [block.preventHeading, block.prevent]]
    .filter(([heading, bullets]) => heading != null || bullets.length > 0);
  return [tableLines(sides.map(([heading]) => heading ?? ''), [sides.map(([, bullets]) => bullets.join('\n'))]),
    ...paragraphs(block.diaryNote)];
}

function blockChunks(block, view) {
  const heading = block.heading ? [[`**${block.heading}**`]] : [];
  if (block.kind === 'points' || block.kind === 'manage-it') return [...heading, rowTable(block.columns ?? [], block.rows, view)];
  if (block.kind === 'check-it') return [...heading, ...checkItChunks(block, view)];
  if (block.kind === 'table') return [...heading, tableChunk(block, view)];
  if (block.kind === 'wrong') return [...heading, ...wrongChunks(block)];
  return [...heading, ...paragraphs(block.text)];
}

// The lines a document prints from a method's record in the business's worksheet, in the business's words: for a method
// marked not relevant, the reason and who decided; for an adapted one, its variation, why, how it was shown to be safe and
// who decided. The allergen information prints them too, for MG-04, exactly as the Management document does.
const notRelevantLine = (record) => `Not relevant to this business: ${said(record.reason)} (decided by ${said(record.decidedBy)}).`;
const variationLine = (record) => `Our variation: ${said(record.variation)} Reason: ${said(record.reason)} Shown to be safe by: ` +
  `${said(record.provedSafe)} Decided by: ${said(record.decidedBy)}`;

// A safe method. `view.method` gives the business's record of it (null in the reference, which
// prints no status and no variation line); `view.parts` and `view.answer` what to print of a question.
function methodChunks(method, view) {
  const heading = [`### ${method.id} ${method.title}`];
  const record = view.method(method.id);
  if (record?.status === 'not-relevant') return [heading, [notRelevantLine(record)]];
  const chunks = [heading, ...paragraphs(method.summary), ...method.blocks.flatMap((block) => blockChunks(block, view))];
  return record?.status === 'adapted' ? [...chunks, [variationLine(record)]] : chunks;
}

function sectionChunks(file, view) {
  const intro = [...new Set(file.section.intro.map((item) => item.text))];
  return [[`## ${file.section.title}`], ...intro.flatMap(paragraphs), ...file.methods.flatMap((method) => methodChunks(method, view))];
}

const sectionView = (parsed) => ({
  method: (id) => parsed.methods.get(id) ?? null,
  parts: (question) => printedParts(question, false),
  answer: (question) => answerOf(parsed.answers.get(question.id))
});
const REFERENCE_VIEW = { method: () => null, parts: (question) => printedParts(question, true), answer: () => null };
// A box of the pack printed as the reference prints it, with no answers: for a box that asks nothing, such as the table
// of the fourteen allergens the allergen information quotes, exactly as its section document prints it too.
const packBlockChunks = (block) => blockChunks(block, REFERENCE_VIEW);

// The profile document: the business's answers about itself, each safe method's status from the
// section worksheets, the special processes and foods it has said it does with the pack's own
// paragraph about them, and its own methods.
function profileChunks(sources, data) {
  const profile = sources.get('profile').parsed;
  return [
    ['## The business'],
    tableLines(['Question', 'Answer'], PROFILE_QUESTIONS.map((q) => [q.text, answerOf(profile.answers.get(q.id))])),
    ...methodStatusChunks(sources, data),
    ...extraCareChunks(profile, data),
    ['## The business\'s own methods'],
    ...ownListChunks(sources.get('own')?.parsed)
  ];
}

function methodStatusChunks(sources, data) {
  const missing = SECTION_IDS.filter((id) => data.sections.has(id) && !sources.has(id));
  const one = missing.length === 1;
  const names = missing.map((id) => `${sentenceCase(data.sections.get(id).section.title)} (${id})`);
  const rows = [...data.sections].flatMap(([id, file]) => file.methods.map((method) => {
    const record = sources.get(id)?.parsed.methods.get(method.id);
    const stated = record && record.status !== 'applies';
    return [method.id, method.title, record ? STATUS_WORDS[record.status] : 'not yet started',
      stated ? businessText(record.reason) : '', stated ? businessText(record.decidedBy) : ''];
  }));
  return [
    ['## Safe methods'],
    ...(missing.length ? [[`The worksheet${one ? '' : 's'} for ${andList(names)} ${one ? 'has' : 'have'} not been started ` +
      `yet, so ${one ? 'its' : 'their'} safe methods show as not yet started.`]] : []),
    tableLines(['Safe method', 'Title', 'Status', 'Reason', 'Decided by'], rows)
  ];
}

// The special processes and foods the profile confirms the business does, as EXTRA_CARE_ASKED lists them.
const extraCareDone = (profile) => EXTRA_CARE_ASKED.filter(({ id }) => profile.answers.get(id)?.answered &&
  profile.answers.get(id).value === 'yes');

function extraCareChunks(profile, data) {
  const heading = ['## Special processes and foods that need extra care'];
  const done = extraCareDone(profile);
  if (!done.length) {
    return [heading, ['The business has not confirmed that it does any of the special processes or makes or serves any ' +
      'of the foods that need extra care. Its answers are in the first table.']];
  }
  return [heading, ['The business has confirmed that it does these, which the pack says need extra care:'],
    done.map(({ name }) => `- ${name}`), ['What the pack says about these processes and foods:'],
    [`> ${extraCareParagraph(data)}`]];
}

// The paragraph the profile quotes about the special processes and foods: the first of the box
// EXTRA_CARE_BOX names. Null when the data lacks the box.
const extraCareParagraph = (data) => data.sections.get('CK')?.methods.find((method) => method.id === EXTRA_CARE_BOX.method)
  ?.blocks.find((block) => block.kind === 'text' && block.page === EXTRA_CARE_BOX.page)?.text.split('\n')[0] ?? null;

// What a document prints, at the start of a line of its own, for the own entries nobody has confirmed.
const NOT_CONFIRMED = 'Not yet confirmed, so not shown: ';
const notConfirmed = (entries) => {
  const ids = entries.filter((entry) => !entry.answered).map((entry) => said(entry.id));
  return ids.length ? [[`${NOT_CONFIRMED}${andList(ids)}.`]] : [];
};
const NO_OWN = 'The business has not confirmed any methods of its own.';

function ownListChunks(own) {
  if (!own) return [['The worksheet for the business\'s own methods has not been started yet.']];
  const entries = [...own.entries.values()];
  const confirmed = entries.filter((entry) => entry.answered);
  const rows = confirmed.map((entry) => [`${entry.id} ${businessText(entry.title)}`, KIND_WORDS[entry.kind], businessText(entry.ehReview)]);
  return [confirmed.length ? tableLines(['Own method', 'Kind', 'Environmental health review'], rows) : [NO_OWN],
    ...notConfirmed(entries)];
}

// The own methods document: each confirmed own entry under its heading, its filled-in fields as a
// table, and any text the business supplied printed word for word in a fenced code block. An entry
// not confirmed is named only.
function ownChunks(sources) {
  const entries = [...sources.get('own').parsed.entries.values()];
  const confirmed = entries.filter((entry) => entry.answered);
  return [['## The business\'s own methods'], ...(confirmed.length ? confirmed.flatMap(ownEntryChunks) : [[NO_OWN]]),
    ...notConfirmed(entries)];
}

function ownEntryChunks(entry) {
  const rows = OWN_ROWS.filter(([, field]) => entry[field] !== '')
    .map(([label, field]) => [label, field === 'kind' ? KIND_WORDS[entry.kind] : businessText(entry[field])]);
  const chunks = [[`### ${entry.id} ${said(entry.title)} (this business's own method, not Food Standards Agency wording)`],
    tableLines(['Field', 'Value'], [...rows, ['Agreed by', `${businessText(entry.by)}, ${businessText(entry.on)}`]])];
  if (!entry.suppliedText) return chunks;
  return [...chunks, ['The text below is the business\'s own, and this tool did not write or check it.'], fenced(entry.suppliedText)];
}

// Whether the lines of a rendered body of `doc` show that the document is unfinished: a line its row's
// unfinishedLine marks, which is a question not yet answered (UNANSWERED, wherever answerOf prints it),
// or, in the own methods and list documents, an entry not yet confirmed (the line notConfirmed prints), or, in
// the allergen information, a cell no named person has confirmed (NOT_CONFIRMED_CELL).
// sign-off refuses a document with either outstanding, so a body that shows one was never signed off
// through this helper. A business's own words cannot make either mark: businessText escapes the
// asterisks, an answer never starts a line of its own, and the lines of a procedure printed word for
// word in a fenced code block are not read here. A code with no row, which check can be given and then
// cannot render, is read for a question not yet answered.
function showsUnfinished(doc, inner) {
  const unfinished = documentOf(doc)?.unfinishedLine ?? unanswered;
  let fence = null;
  for (const line of inner) {
    if (fence) {
      if (line === fence) fence = null;
    } else if (/^`{3,}text$/.test(line)) fence = line.slice(0, -'text'.length);
    else if (unfinished(line)) return true;
  }
  return false;
}

const worksheetName = (section) => `answers-${section}.md`;
const worksheetFile = (project, section) => join(project, 'food-safety', worksheetName(section));
// Text as a hash takes it: what a reader cannot see makes no difference. That is a byte order mark at
// the start, Windows line endings, spaces and tabs at the ends of lines and blank lines at the end.
// Every other character counts.
const normalised = (text) => text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '')
  .replace(/\n*$/, '\n');
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
// A document's identity is the text a person reads: the hash of the lines between its two marker
// lines, normalised. render puts it in the BEGIN marker and sign-off records it, so a document, its
// status and its sign-off always agree on it; a change to a worksheet that changes no line of a
// document's body changes nothing about that document. This is the one place the hash is made.
const bodyHash = (lines) => sha256(normalised(lines.join('\n')));
// A rendered body: the BEGIN marker, the chunks an empty line apart, the END marker.
const bodyText = (doc, chunks) => {
  const inner = ['', ...chunks.map((chunk) => chunk.join('\n')).join('\n\n').split('\n'), ''];
  return [beginMarker(doc, bodyHash(inner)), ...inner, END_MARKER].join('\n');
};

// What to do about `file`, which holds the `found` worksheet where the `wanted` one should be. Making
// the wanted worksheet in its place would overwrite it, so it is moved or renamed first.
function misplaced(file, found, wanted, project) {
  const home = worksheetFile(project, found);
  const taken = existsSync(home) ? ', but there is already a file there: compare the two before you move it' : '';
  return `${file} is the ${found} worksheet, not the ${wanted} one. Move or rename it first, so that it is not ` +
    `overwritten: it probably belongs in ${home}${taken}. Then make the ${wanted} worksheet with: ` +
    `${makeWorksheet(wanted, file)}.`;
}

// Reads and parses a project's worksheets: those of `sections`, unless given each one a document uses
// (SHEETS_USED), in SHEET_ORDER.
// This is the one place a worksheet is read. Returns a Map from section to null when its file does not
// exist; to { section, name, file, readError } when it cannot be read; or to { section, name, file,
// text, parsed, problems, wrongData, belongsTo, clean }. `problems` are the parser's, exactly what
// parse-worksheet lists, as file:line: message. A worksheet for other data has `wrongData`; one in the
// wrong file has `belongsTo`, the section it is the worksheet of. Neither is clean. `options` is the caller's:
// { today } (see beginReading).
function readWorksheets(project, data, sections = SHEETS_USED, options = {}) {
  const sheets = new Map();
  for (const section of SHEET_ORDER.filter((name) => sections.includes(name))) {
    const file = worksheetFile(project, section);
    if (!existsSync(file)) {
      sheets.set(section, null);
      continue;
    }
    const sheet = { section, name: worksheetName(section), file };
    try {
      sheet.text = readFileSync(file, 'utf8');
    } catch (error) {
      sheets.set(section, { ...sheet, readError: `cannot read ${file}: ${error.message}` });
      continue;
    }
    // `otherVersion`: what of the tool's own wording is not this helper's, in a few words, so that the
    // worksheet is another version's; '' when nothing is.
    Object.assign(sheet, strictWorksheet(sheet.text, data, options));
    sheet.problems = sheet.parsed.problems.map(({ line, message }) => `${file}:${line}: ${message}`);
    sheet.wrongData = sheet.parsed.data !== null && sheet.parsed.data !== DATA_ID;
    const found = sheet.parsed.section;
    sheet.belongsTo = found !== null && found !== section ? found : null;
    sheet.clean = sheet.problems.length === 0 && !sheet.wrongData && !sheet.belongsTo;
    sheets.set(section, sheet);
  }
  return sheets;
}

// Reads and parses the worksheets a document renders from. Returns { sources }, holding only the
// worksheets that exist, or { exit, messages }: 2 for a missing, unreadable or wrong worksheet, 1 for
// problems.
function readSources(doc, project, data, options = {}) {
  const { uses, needs } = sourcesOf(doc);
  const sheets = readWorksheets(project, data, uses, options);
  const refused = [];
  const problems = [];
  for (const [section, sheet] of sheets) {
    const file = worksheetFile(project, section);
    if (!sheet) {
      if (needs.includes(section)) refused.push(`${file} does not exist. Make it with: ${makeWorksheet(section, file)}, then fill it in.`);
    } else if (sheet.readError) {
      refused.push(sheet.readError);
    } else if (sheet.wrongData) {
      refused.push(`${file} answers data ${sheet.parsed.data}, but the helper's data is ${DATA_ID}. Keep a copy of it, make a ` +
        `worksheet for this data with: ${makeWorksheet(section, file)}, and copy the answers across.`);
    } else if (sheet.belongsTo) {
      refused.push(misplaced(file, sheet.belongsTo, section, project));
    } else {
      problems.push(...sheet.problems);
    }
  }
  if (refused.length) return { exit: 2, messages: refused };
  if (problems.length) return { exit: 1, messages: problems };
  return { sources: new Map([...sheets].filter(([, sheet]) => sheet)) };
}

// Renders a document's body from the worksheets in `project`/food-safety. Returns { exit: 0, text }
// or { exit, messages }; nothing is rendered from a worksheet the parser could not read cleanly. `options` is
// the caller's: { today } (see beginReading).
export function renderDocument(doc, project, data, options = {}) {
  const row = documentOf(doc);
  if (!row) return { exit: 2, messages: [`--doc is one of ${RENDERED_CODES.join(', ')}`] };
  if (row.render) return row.render(project, data, options);
  if (row.dataNeeded && !data.sections.has(row.dataNeeded)) return { exit: 2, messages: [`the data has no ${row.dataNeeded}.json`] };
  const lacking = row.lacking?.(data);
  if (lacking) return { exit: 2, messages: [lacking] };
  const read = readSources(doc, project, data, options);
  if (read.exit) return read;
  const profile = read.sources.get('profile').parsed;
  const name = profile.answers.get(NAME_QUESTION);
  const chunks = [...coverageChunks(profile), ...row.chunks(read.sources, data, project),
    [closingNotice(name?.answered ? name.answer : null)], [row.source(data, read.sources)]];
  return { exit: 0, text: bodyText(doc, chunks) };
}

// Whether `doc`'s body, rendered afresh from the worksheets in `project`, shows it unfinished (showsUnfinished);
// false when it cannot be rendered, which status tells in its own lines. sign-off's backstop.
export function freshlyUnfinished(doc, project, data, options = {}) {
  const fresh = renderDocument(doc, project, data, options);
  return fresh.exit === 0 && showsUnfinished(doc, fresh.text.split('\n').slice(1, -1));
}

// Finds the one rendered body in a document's lines: { begin, end, marker } (1-based line numbers),
// or { line, problem }, where line is null when the problem has no line of its own.
// A marker indented in the document's own part is a quotation of one, not a marker; it is named only
// when the document has no marker of that name at the start of a line.
function findBody(lines, doc) {
  const at = (name) => lines.flatMap((line, i) => (line.startsWith(`<!-- UK-FOOD:${name}`) ? [i + 1] : []));
  const [begins, ends] = [at('BEGIN'), at('END')];
  for (const [name, found] of [['BEGIN', begins], ['END', ends]]) {
    if (found.length === 0) {
      const indented = lines.findIndex((line) => new RegExp(`^\\s+<!-- UK-FOOD:${name}`).test(line));
      if (indented >= 0) {
        return { line: indented + 1, problem: `this UK-FOOD:${name} marker line is indented: a marker line starts at the beginning of its line` };
      }
      return { line: null, problem: `there is no UK-FOOD:${name} marker line, so there is no rendered body to check` };
    }
    if (found.length > 1) return { line: found[1], problem: `there is more than one UK-FOOD:${name} marker line; a document holds one rendered body` };
  }
  const [begin, end] = [begins[0], ends[0]];
  // Spaces and tabs after a marker are not part of it: no reader sees them, and no hash counts them.
  const bare = (line) => line.replace(/[ \t]+$/, '');
  const marker = BEGIN_MARKER.exec(bare(lines[begin - 1]));
  if (end < begin) return { line: end, problem: 'the UK-FOOD:END marker line comes before the UK-FOOD:BEGIN marker line' };
  if (!marker || bare(lines[end - 1]) !== END_MARKER) {
    return { line: marker ? end : begin, problem: 'this marker line is not understood: render the document and copy its output whole' };
  }
  if (marker[1] !== doc) return { line: begin, problem: `the rendered body is doc=${marker[1]}, not ${doc}` };
  if (marker[2] !== DATA_ID) {
    return { line: begin, problem: `the rendered body is from data ${marker[2]}, but the helper's data is ${DATA_ID}: render it again` };
  }
  return { begin, end, marker };
}

// The first line outside the body that is a heading of the pack: a heading whose text is a section's
// title, or starts with a safe method's identifier and title, as the data has them. A heading is read
// in each of the three ways one can be written: a line of # marks and text (trimmed, without a closing
// run of #); a line of text with a line of = or - under it; and an HTML heading on one line, h1 to h6,
// whatever its attributes. The pack's text outside the markers is not checked, so a document may not
// hold any; a heading of its own that only starts with a section's title, such as "COOKING RECORD FOR
// BRAMBLE CAFE", is its own. -1 if none.
function packHeadingOutside(lines, body, data) {
  const files = [...data.sections.values()];
  const sections = files.map((file) => file.section.title);
  const methods = files.flatMap((file) => file.methods.map((m) => `${m.id} ${m.title}`));
  const isPack = (text) => sections.includes(text) || methods.some((title) => text.startsWith(title));
  const inside = (i) => i >= body.begin - 1 && i < body.end;
  const underlined = (i) => i + 1 < lines.length && !inside(i + 1) && /^ {0,3}(?:=+|-+)[ \t]*$/.test(lines[i + 1]);
  return lines.findIndex((line, i) => {
    if (inside(i)) return false;
    const marked = /^ {0,3}#{1,6}[ \t]+(.*)$/.exec(line);
    if (marked) return isPack(marked[1].replace(/[ \t]+#+[ \t]*$/, '').trim());
    const html = /<h([1-6])(?:\s[^>]*)?>(.*?)<\/h\1\s*>/i.exec(line);
    if (html && isPack(html[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())) return true;
    return line.trim() !== '' && underlined(i) && isPack(line.trim());
  });
}

// ---------------------------------------------------------------------------------------------
// What a document says outside its body. The helper never writes these lines, but it reads them: a
// header may not say a document is signed off when no sign-off is recorded for it, and a sign-off
// binds the whole file, not only the body.
// ---------------------------------------------------------------------------------------------

// The Document Control rows that say a document is signed off, and those the sign-off command edits.
const CLAIM_FIELDS = ['Status', 'Reviewed By', 'Approved By'];
const SIGNED_FIELDS = [...CLAIM_FIELDS, 'Last Modified'];
// A Document Control row of one of SIGNED_FIELDS, however it is typed. Every regime's partial writes
// "| **Status** | DRAFT |", but a person reads the row the same in capitals or small letters, with up
// to three * or _ round the name, with a colon after the name inside those marks or outside them, with
// more than one space or a no-break space between its words (\s takes both), set in from the margin,
// with or without the pipe before the name or after the value, and inside a blockquote (after one or
// more > marks), which is still a table row to a reader. Each of those is read as the row, and its
// value is everything after the name's cell. A quoted row is read for what it claims, but it is not
// one of the header's own rows: it never stands for the cell the sign-off command writes.
// That is as far as reading goes. A claim made in a sentence of prose cannot be told from any other
// sentence, so it is not looked for: before a sign-off, such a sentence is the business of the person
// who reads the document and signs it; after one, the sign-off covers every line outside the markers,
// so a sentence added there ends it.
const CONTROL_ROW = new RegExp(`^\\s*((?:>\\s*)*)\\|?\\s*[*_]{0,3}\\s*(${SIGNED_FIELDS.map((name) => name.replace(' ', '\\s+')).join('|')})` +
  '\\s*:?\\s*[*_]{0,3}\\s*:?\\s*\\|(.*?)(?:(?<!\\\\)\\|)?\\s*$', 'i');
const fieldNamed = (typed) => SIGNED_FIELDS.find((name) => name.toLowerCase() === typed.replace(/\s+/g, ' ').toLowerCase());
const REVISION_HEADING = /^ {0,3}#{1,6}\s+Revision\s+History[\s#]*$/i;
// The Build Provenance block that core's provenance-stamp.mjs hook appends to a document and stamps
// again after each later Write or Edit, line for line as that hook writes it today: its two marker
// comments, its heading, its note, the two heading rows of its table, then its rows.
const PROVENANCE = { start: '<!-- arckit-provenance:start -->', end: '<!-- arckit-provenance:end -->' };
const PROVENANCE_OPENS = [PROVENANCE.start, '', '## Build Provenance', '',
  '*Stamped automatically by the ArcKit plugin\'s `provenance-stamp.mjs` PostToolUse hook. Complements (does not replace) the ' +
  'human-authored footer above. Carries only fields the model can\'t authoritatively self-report: build context from ' +
  '`.arckit/state.json` and effort levels derived from command frontmatter + the silent-downgrade matrix.*',
  '', '| Field | Value |', '|-------|-------|'];
// The rows the hook writes, each field once at most and in the hook's order, with the form its value
// takes. The command's two effort rows come together or not at all, each one of the five levels. A
// build's rows follow: its recipe, which is a recipe file's base name as the build harness records it
// (small letters and digits joined by hyphens, as every recipe ArcKit ships is named); its wave, a
// number, when it has one; its target, an identifier of a recipe target (capitals, digits, hyphens and
// underscores); and its topic, when it has one. The time of stamping is always there, last. The hook
// writes no block that has neither the effort rows nor the build's. A build's topic is free text the
// hook copies from the build's state, so no form can be asked of it: see stampedBlock.
const EFFORT = '`(?:low|medium|high|xhigh|max)`';
const PROVENANCE_ROWS = new RegExp('^' +
  `(?:\\| Requested Effort \\| ${EFFORT} \\|\\n\\| Effective Effort \\| (?:${EFFORT}(?: \\(downgraded from ${EFFORT} \u2014 model does not ` +
  'support that level\\))?|_unknown \u2014 model not parsed from existing footer_) \\|\\n)?' +
  '(?:\\| Build Recipe \\| (?:`[a-z0-9]+(?:[-_.][a-z0-9]+)*`|_unknown_) \\|\\n(?:\\| Build Wave \\| \\d+ \\|\\n)?' +
  '\\| Build Target \\| `[A-Z][A-Z0-9_-]*` \\|\\n(?:\\| Build Topic \\| [^\\n]*\\|\\n)?)?' +
  '\\| Stamped at \\| \\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z \\|$');
const BUILD_TOPIC = /^\| Build Topic \| .*\|$/;
// What stands for the body in the text outsideHash hashes: where the body is still counts.
const BODY_PLACE = '<!-- UK-FOOD body -->';
// A table cell's text without the marks Markdown reads round it.
const plainCell = (text) => text.trim().replace(/^[*_`]+/, '').replace(/[*_`]+$/, '').trim();
// A table cell exactly as typed, but for the white space round it, with a pipe written "\|" read as the pipe.
const typedCell = (text) => text.trim().replace(/\\\|/g, '|');
// What the sign-off command writes for a sign-off record: in the header's Reviewed By and Approved By,
// and in the Approved By cell of a Revision History row, where the date has a cell of its own.
const signedText = (record) => `${record.name}, ${record.role}, ${record.date}`;
const signedCell = (record) => `${record.name}, ${record.role}`;
const cellsOfRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(plainCell);
const isDraft = (value) => /^draft$/i.test(value);
const isPending = (value) => value === '' || /^\[?pending\]?$/i.test(value);
// A file's text as lines. A byte order mark at the start is not part of its first line, and a file
// saved with Windows line endings reads as the same text, which keeps every line number.
const documentLines = (text) => text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n');

// The rows of a Revision History table: of the first table between line indexes `from` and `to`, each
// row as { line, version, approvedBy, approvalDate, typedBy, typedDate, pieces, by, date }, its cells
// found by the table's own column headings. `approvedBy` and `approvalDate` are the two approval cells
// as read (plainCell) and `typedBy` and `typedDate` as typed (typedCell); a cell under a heading the
// table lacks is empty. `pieces` is the row as written, split at each pipe that is not escaped, and `by`
// and `date` are where the two approval cells sit in it, or -1.
function revisionRows(lines, from, to) {
  let at = from;
  while (at < to && !lines[at].trim().startsWith('|')) {
    if (/^ {0,3}#{1,6}[ \t]/.test(lines[at])) return [];
    at++;
  }
  if (at >= to) return [];
  const columns = cellsOfRow(lines[at]).map((name) => name.toLowerCase().replace(/\s+/g, ' '));
  const [version, approvedBy, approvalDate] = ['version', 'approved by', 'approval date'].map((name) => columns.indexOf(name));
  const rows = [];
  for (at++; at < to && lines[at].trim().startsWith('|'); at++) {
    if (/^[\s|:-]+$/.test(lines[at])) continue;
    const cells = cellsOfRow(lines[at]);
    // The piece before the first pipe is the indent, and the piece after a closing pipe is not a cell.
    const pieces = lines[at].split(/(?<!\\)\|/);
    const lastCell = pieces.length - (/(?<!\\)\|[ \t]*$/.test(lines[at]) ? 2 : 1);
    const [by, date] = [approvedBy, approvalDate].map((column) => (column >= 0 && column + 1 <= lastCell ? column + 1 : -1));
    // A version written "v1.0" is version 1.0.
    rows.push({ line: at + 1, version: (cells[version] ?? '').replace(/^v/i, ''), approvedBy: cells[approvedBy] ?? '',
      approvalDate: cells[approvalDate] ?? '', typedBy: by < 0 ? '' : typedCell(pieces[by]), typedDate: date < 0 ? '' : typedCell(pieces[date]),
      pieces, by, date });
  }
  return rows;
}

// What a document says about sign-off outside its body, above it or below it: `rows`, the first Document
// Control row of each of SIGNED_FIELDS as { field, line, value, typed }, the value as read (plainCell)
// and as typed (typedCell); `all`, every such row in the order written, since a second row of a name is
// read by a person as much as the first; and `history`, the rows of every Revision History table. A
// document with no such row or table claims nothing.
function headerOf(lines, body) {
  const rows = new Map();
  const all = [];
  const history = [];
  for (let i = 0; i < lines.length; i++) {
    if (i >= body.begin - 1 && i < body.end) continue;
    const row = CONTROL_ROW.exec(lines[i]);
    if (row) {
      all.push({ field: fieldNamed(row[2]), line: i + 1, value: plainCell(row[3]), typed: typedCell(row[3]) });
      if (row[1] === '' && !rows.has(all.at(-1).field)) rows.set(all.at(-1).field, all.at(-1));
    }
    if (REVISION_HEADING.test(lines[i])) history.push(...revisionRows(lines, i + 1, i < body.begin - 1 ? body.begin - 1 : lines.length));
  }
  return { rows, all, history };
}

// Which of the cells the sign-off command fills in hold exactly what the overlay's own commands write
// there: { rows, history }, a true or false for each first Document Control row of SIGNED_FIELDS, by
// field, and for the two approval cells of each Revision History row. What the commands write:
// - Status: DRAFT or APPROVED;
// - Reviewed By and Approved By: [PENDING], or the text of a sign-off recorded for this file (signedText);
// - Last Modified, and a history row's Approval Date: [PENDING], or a real date written YYYY-MM-DD;
// - a history row's Approved By: [PENDING], or the name and role of a sign-off recorded for that
//   version of this document (signedCell).
// A cell a row lacks counts as written: there is nothing in it. The file is `name`, a document of `doc`.
function writtenCells(doc, name, header, records) {
  const version = DOCUMENT_FILE.exec(name)?.[2] ?? null;
  const signings = records.filter((record) => record.doc === doc);
  const mine = signings.filter((record) => record.file === name && record.version === version).map(signedText);
  const dated = (typed) => typed === PENDING || isIsoDate(typed);
  const rows = new Map([...header.rows].map(([field, row]) => [field, field === 'Status' ? ['DRAFT', 'APPROVED'].includes(row.typed)
    : field === 'Last Modified' ? dated(row.typed) : row.typed === PENDING || mine.includes(row.typed)]));
  const history = header.history.map((row) => ({
    by: row.by < 0 || row.typedBy === PENDING || signings.some((record) => record.version === row.version && signedCell(record) === row.typedBy),
    date: row.date < 0 || dated(row.typedDate)
  }));
  return { rows, history };
}

// Whether the file's header shows the newest sign-off recorded for it, exactly as the sign-off command
// marks one: Status APPROVED, Reviewed By and Approved By that record's text, and, where the Revision
// History has a row for this version, that row's two approval cells. Null with no sign-off recorded for
// the file. A document can be signed off with a header that does not show it (the record is made before
// the header is marked, and a marking can be undone), so this is told as a fact of its own: the sign-off
// command is not finished until it is true.
function headerShows(doc, name, header, records) {
  const version = DOCUMENT_FILE.exec(name)?.[2] ?? null;
  const mine = records.filter((record) => record.doc === doc && record.file === name && record.version === version).at(-1);
  if (!mine) return null;
  const typed = (field) => header.rows.get(field)?.typed;
  const row = header.history.find((entry) => entry.version === version);
  return typed('Status') === 'APPROVED' && typed('Reviewed By') === signedText(mine) && typed('Approved By') === signedText(mine) &&
    (!row || (row.typedBy === signedCell(mine) && row.typedDate === mine.date));
}

// The cells the sign-off command fills in that hold something the commands do not write there and that
// claims nothing, each as { line, field, typed, want }, in the order written: a Status that reads as
// DRAFT but is typed another way, a name left empty or typed "pending", a Last Modified that is not a
// date. sign-off rewrites each of these cells, so while one holds anything else, marking the document
// as signed off would change what was signed. A cell that does claim a sign-off is headerClaim's.
// A cell of a Revision History row carries its row's `version`.
function unwrittenCells(header, written) {
  const cells = [...header.rows.values()].filter((row) => !written.rows.get(row.field) &&
    (row.field === 'Last Modified' || (row.field === 'Status' ? isDraft(row.value) : isPending(row.value))))
    .map((row) => ({ line: row.line, field: row.field, typed: row.typed, want: row.field === 'Status' ? 'DRAFT'
      : row.field === 'Last Modified' ? 'a date as YYYY-MM-DD' : PENDING }));
  header.history.forEach((row, i) => {
    if (!written.history[i].by && isPending(row.approvedBy)) {
      cells.push({ line: row.line, field: 'Approved By in the Revision History', typed: row.typedBy, want: PENDING, version: row.version });
    }
    if (!written.history[i].date && isPending(row.approvalDate)) {
      cells.push({ line: row.line, field: 'Approval Date in the Revision History', typed: row.typedDate, want: PENDING, version: row.version });
    }
  });
  return cells.sort((a, b) => a.line - b.line);
}

// The Build Provenance block that outsideHash leaves out, as { from, to, kept }: its first and last line
// indexes, and those of its lines that count all the same. Null unless the file holds exactly one of
// each of the hook's markers outside the body, the block is the last thing in the file, and every line
// of it is one the hook writes (PROVENANCE_OPENS, then the rows PROVENANCE_ROWS allows, each once and in
// order). Anything else between such markers, a field given twice or out of its place, a second block,
// a marker in the middle of a line or a block with text after it is no stamp of the hook's, and every
// line of it counts like any other line. A Build Topic row is in the hook's form whatever it says, so
// it is the one line of a block that counts as written. What a recipe's or a target's name says cannot
// be checked beyond its shape: a row of that shape is taken as the hook's.
// If the hook's output ever changes, its blocks stop matching these forms and count. A signed document
// then loses its sign-off the next time the hook stamps it, and status says the file was changed
// outside its markers: the change fails where it is seen, and no document passes with lines nobody
// checked. tests/plugin/uk-food-status.test.mjs runs the real hook, so such a change fails there first,
// and the forms above are then brought into line with the hook.
function stampedBlock(lines, body) {
  const outside = (i) => i < body.begin - 1 || i >= body.end;
  const holding = (marker) => lines.flatMap((line, i) => (outside(i) && line.includes(marker) ? [i] : []));
  const [starts, ends] = [holding(PROVENANCE.start), holding(PROVENANCE.end)];
  if (starts.length !== 1 || ends.length !== 1) return null;
  const [from, to] = [starts[0], ends[0]];
  const block = lines.slice(from, to + 1).map((line) => line.replace(/[ \t]+$/, ''));
  const rows = block.slice(PROVENANCE_OPENS.length, -2);
  const shaped = to > from && lines.slice(to + 1).every((line) => line.trim() === '') &&
    PROVENANCE_OPENS.every((line, i) => block[i] === line) && block.at(-2) === '' && block.at(-1) === PROVENANCE.end &&
    rows.length > 1 && PROVENANCE_ROWS.test(rows.join('\n'));
  if (!shaped) return null;
  return { from, to, kept: new Set(rows.flatMap((row, i) => (BUILD_TOPIC.test(row) ? [from + PROVENANCE_OPENS.length + i] : []))) };
}

// The lines of a document outside its markers that are not its ordinary frame, each as { line, text }.
// check compares nothing outside the markers with anything, and a sign-off covers the whole file, so
// these are the lines a person signing must be shown: sign-off refuses a document that holds any until
// it is told they have been read. The frame is what a template gives and a command fills in:
// - blank lines and horizontal rules;
// - a comment line that is, whole, one the overlay's own templates carry, or one of the two markers of
//   core's provenance hook (FRAME_COMMENTS, FRAME_NOTES). Any other comment is text someone put
//   there, whether it stands on a line of its own, runs over several or sits inside a cell: a
//   reader of the rendered page does not see it, and the file a person signs holds it;
// - above the body, each once: the title (the first level-one heading), the template line under it,
//   and the Document Control and Revision History headings, each with the table that follows it. Of
//   the Document Control table, its two heading rows and one row of two cells for each field a regime
//   partial has (CONTROL_FIELDS): a row of any other field, a second row of a field, or a row with a
//   third cell is a row someone added;
// - below the body, once each: the footer's five labelled lines;
// - the one Build Provenance block core's hook wrote (stampedBlock), but for a Build Topic row: its
//   value is free text, which the hook copies from the build's state.
// Everything else is other text: a section of the business's own, a note, a second table, a quotation.
// A custom template that adds sections or comments therefore has other text, and is signed once it
// has been shown. What a frame row's value says is not judged here: the sign-off command shows the
// person the two tables as they stand, and the header checks hold the cells that claim a sign-off.
// The fields a Document Control table may hold: those of the regime partials under templates/_partials,
// every one of them. A test reads the partials, so a field added to one shows there.
export const CONTROL_FIELDS = ['Document ID', 'Document Type', 'Project', 'Classification', 'Status', 'Version', 'Created Date', 'Last Modified',
  'Review Cycle', 'Next Review Date', 'Owner', 'Reviewed By', 'Approved By', 'Distribution', 'Klassifizierung nach', 'Organisation',
  'Federal Entity', 'Cabinet Instrument cited', 'Sovereign Cloud Region', 'AI Autonomy Tier'];
const FOOTER_LABELS = ['Generated by', 'Generated on', 'ArcKit Version', 'Project', 'Model'];
const FRAME_ABOVE = [['title', /^# \S/], ['template', /^> \*\*Template Origin\*\*: /],
  ['control', /^ {0,3}#{1,6}\s+Document\s+Control[\s#]*$/i], ['history', REVISION_HEADING]];
const RULE_LINE = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
// The comment lines the overlay's templates carry: three short ones as they are written, and the note
// each template has above its body by its fingerprint (the templates of the documents a person signs
// share one, and the check template and the record sheets template each have their own). A test reads
// the templates, so a comment changed there shows. The third is the signed templates' note as it read
// before it said what a sign-off leaves out: a document written then keeps it, and it stays part of
// that document's frame. The fourth is the record sheets template's, which says that nobody signs them and when a
// later run writes nothing over them; no release has shipped an earlier wording of it, so none is kept.
const FRAME_COMMENTS = ['<!-- DOC-CONTROL-HEADER -->', '<!-- Resolved at command-execution time per _partials/RENDERING.md. -->',
  '<!-- UK-FOOD-BODY -->', PROVENANCE.start, PROVENANCE.end];
const FRAME_NOTES = ['6fe5a55718f40fbb5aeb1fc5e03f5caf629c07c15985ce122b9899ca8737f8d3', 'a9b0cbc3f58b12aca743acb7e344f5b2a998e6231116b621ddd6cfa3d8e8d3d9',
  '33f1bc78a00361c791b1a3651a9c23e5607d926a4ca07af57592625991e1908d', 'aece9a24d200ce5e819d364636a789c7b987d138c6233073ca4af2d748080d6f'];
function otherText(lines, body) {
  const stamp = stampedBlock(lines, body);
  const once = new Set();
  const first = (name) => !once.has(name) && Boolean(once.add(name));
  const other = [];
  let comment = false; // inside a comment that runs over several lines
  let table = null; // 'awaited' after one of the two headings, 'open' while its rows run
  let kind = null; // which of the two tables that is: 'control' or 'history'
  // A row of the Document Control table that a template gives: a heading row, or a field's one row.
  const controlRow = (line) => {
    if (/^[\s|:-]+$/.test(line)) return true;
    const cells = cellsOfRow(line);
    const name = cells[0].replace(/\s+/g, ' ').toLowerCase();
    if (cells.length !== 2) return false;
    if (name === 'field' && cells[1].toLowerCase() === 'value') return first('control heading row');
    const field = CONTROL_FIELDS.find((known) => known.toLowerCase() === name);
    return Boolean(field) && first(`control row ${field}`);
  };
  lines.forEach((raw, i) => {
    if (i >= body.begin - 1 && i < body.end) return;
    const line = raw.replace(/[ \t]+$/, '');
    const above = i < body.begin - 1;
    const row = line.trim().startsWith('|');
    let framed;
    if (comment || line.includes('<!--')) {
      framed = !comment && (FRAME_COMMENTS.includes(line) || FRAME_NOTES.includes(sha256(line)));
      comment = line.indexOf('-->', comment ? 0 : line.indexOf('<!--') + 4) < 0;
    } else if (line === '') framed = true;
    else if (stamp && i >= stamp.from && i <= stamp.to) framed = !stamp.kept.has(i);
    else if (table && row) {
      table = 'open';
      framed = kind === 'history' || controlRow(line);
    } else {
      table = null;
      const named = above ? FRAME_ABOVE.find(([, form]) => form.test(line)) : null;
      const label = above ? null : FOOTER_LABELS.find((name) => line.startsWith(`**${name}**: `));
      if (named) {
        framed = first(named[0]);
        if (framed && (named[0] === 'control' || named[0] === 'history')) [table, kind] = ['awaited', named[0]];
      } else framed = RULE_LINE.test(line) || Boolean(label && first(label));
    }
    if (table === 'open' && !row) table = null;
    if (!framed) other.push({ line: i + 1, text: line });
  });
  return other;
}

// The hash of a document's text outside its markers, as a sign-off binds it: every line above the BEGIN
// marker and below the END marker, less only what changes after a sign-off without changing what the
// person signed. That is what the sign-off command itself writes and what core's hook stamps, and
// nothing that only looks like either:
// - the value of the first Document Control row of each of SIGNED_FIELDS, when it holds exactly what
//   the commands write there (`written`, from writtenCells). The row itself still counts, a value that
//   holds anything else counts as typed, and a second row of a name counts whole;
// - the Approved By and Approval Date cells of each Revision History row, each on the same condition
//   (the rest of each row counts, and so does a row added or taken out);
// - the one Build Provenance block the hook wrote (stampedBlock).
// Anything else added, taken out or changed gives another hash.
function outsideHash(lines, body, header, written) {
  const values = new Map();
  for (const [field, row] of header.rows) if (written.rows.get(field)) values.set(row.line, `| **${field}** |`);
  header.history.forEach((row, i) => {
    const pieces = [...row.pieces];
    if (row.by >= 0 && written.history[i].by) pieces[row.by] = '';
    if (row.date >= 0 && written.history[i].date) pieces[row.date] = '';
    values.set(row.line, pieces.join('|'));
  });
  const stamp = stampedBlock(lines, body);
  const dropped = (i) => stamp !== null && i >= stamp.from && i <= stamp.to && !stamp.kept.has(i);
  const kept = [];
  lines.forEach((line, i) => {
    if (i === body.begin - 1) kept.push(BODY_PLACE);
    if ((i < body.begin - 1 || i >= body.end) && !dropped(i)) kept.push(values.get(i + 1) ?? line);
  });
  return sha256(normalised(kept.join('\n')));
}

// The two hashes a sign-off holds for a document's text: `body`, of the lines between its markers
// (bodyHash), and `outside`, of the rest of the file (outsideHash). Null when the text holds no body of
// `doc`. `name` is the document's file name and `records` the sign-offs recorded in its project: a name
// in the header is left out of `outside` only when it is the text of one of them for this file.
export function documentHashes(text, doc, name = '', records = []) {
  const lines = documentLines(text);
  const body = findBody(lines, doc);
  if (body.problem) return null;
  const header = headerOf(lines, body);
  return { body: bodyHash(lines.slice(body.begin, body.end - 1)), outside: outsideHash(lines, body, header, writtenCells(doc, name, header, records)) };
}

const PUT_BACK = 'put Status back to DRAFT and Reviewed By and Approved By back to [PENDING]';
const sentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// What a document's header says about sign-off, in the order it is written: each Document Control row
// of CLAIM_FIELDS that does not read DRAFT or [PENDING], then each Revision History row whose Approved
// By or Approval Date is filled in.
function claimsOf(header) {
  const rows = header.all.filter((row) => CLAIM_FIELDS.includes(row.field) &&
    !(row.field === 'Status' ? isDraft(row.value) : isPending(row.value)));
  const history = header.history.map((row) => ({ ...row, value: [row.approvedBy, row.approvalDate].find((value) => !isPending(value)) }))
    .filter((row) => row.value !== undefined);
  return { rows, history };
}

// The first thing a document says about sign-off, outside its body, that no sign-off record bears out,
// as { line, message, reason }, or null. The file is `name`, a document of code `doc`.
// - A document nobody signs (its row's signable is false: the completion record, a report, and the record
//   sheets, blank forms) says nothing but DRAFT and [PENDING]. Its row's nobodySigns says why.
// - With no sign-off recorded for this file and version, so does any other document. This is what
//   stops a document reading as approved, with a name, when nobody signed it: a status promoted by
//   hand, or a signed version's header copied into the next version.
// - `unfinished` says the file's own body shows a question not yet answered or an entry not yet
//   confirmed (showsUnfinished). sign-off never records such a document, so a record that names this
//   file cannot be right, and is not taken: the header is read as if there were none.
// - With a sign-off that is taken, the header says exactly what the sign-off command writes for the
//   newest one and nothing more: Status reads APPROVED, and a name given in Reviewed By or Approved By
//   is that record's name, role and date (signedText). Words added to either are a claim nobody signed.
// - A Revision History row that says a version was approved needs a sign-off recorded for that
//   version of this document, and gives the name and role of the newest of them (signedCell) and its date.
// A signed file whose header still says DRAFT claims nothing, and is not reported.
function headerClaim(doc, name, header, records, unfinished = false) {
  const version = DOCUMENT_FILE.exec(name)?.[2] ?? null;
  const signings = records.filter((record) => record.doc === doc);
  const recorded = signings.filter((record) => record.file === name && record.version === version).at(-1) ?? null;
  const mine = unfinished ? null : recorded;
  const claims = claimsOf(header);
  const { signable, nobodySigns: nobody } = documentOf(doc) ?? {};
  const unsigned = signable === false;
  // Why a claim on this file has no sign-off behind it, as a message says it and as a reason does.
  const [none, noneOfIt] = recorded
    ? ['the document still shows a question not yet answered or an entry not yet confirmed, and one that does is never signed off',
      'it still shows a question not yet answered or an entry not yet confirmed, and a document that does is never signed off']
    : ['no sign-off is recorded for this file', 'no sign-off is recorded for it'];
  for (const { field, line, value, typed } of claims.rows) {
    const says = `${field} is "${value}"`;
    if (unsigned) {
      return { line, message: `this line says ${says}, but ${nobody}. ${sentence(PUT_BACK)}.`,
        reason: `says in its header, at line ${line}, that ${says}, though ${nobody}: ${PUT_BACK}` };
    }
    if (!mine) {
      return { line, message: `this line says ${says}, but ${none}. ${sentence(PUT_BACK)}: these ` +
        'lines change only when a named person signs the document off with the sign-off command.',
      reason: `says in its header, at line ${line}, that ${says}, though ${noneOfIt}: ${PUT_BACK}, and have a ` +
        'named person sign the document off once it is finished' };
    }
    if (field === 'Status' && typed !== 'APPROVED') {
      const only = `where a document that is signed off reads APPROVED and nothing else, which says only that ${mine.name} signed it off`;
      return { line, cell: true, message: `this line says Status is "${typed}", ${only}. Write APPROVED there, or put it back to DRAFT.`,
        reason: `says in its header, at line ${line}, that Status is "${typed}", ${only}: write APPROVED there, or put it back to DRAFT` };
    }
    // Exactly the record's text is right, whatever marks the name itself holds.
    if (field === 'Status' || typed === signedText(mine)) continue;
    const right = `"${signedText(mine)}"`;
    if (!value.includes(mine.name)) {
      return { line, cell: true, message: `this line says ${says}, which does not name ${mine.name}, who signed this file off on ${mine.date}. ` +
        `Write ${right} there, or put it back to [PENDING].`,
      reason: `says in its header, at line ${line}, that ${says}, which does not name ${mine.name}, who signed it off on ` +
        `${mine.date}: write ${right} there, or put it back to [PENDING]` };
    }
    const not = `which is not exactly what ${mine.name}'s sign-off of this file records`;
    return { line, cell: true, message: `this line says ${field} is "${typed}", ${not}. Write ${right} there and nothing else, or put it back ` +
      'to [PENDING].',
    reason: `says in its header, at line ${line}, that ${field} is "${typed}", ${not}: write ${right} there and nothing else, ` +
      'or put it back to [PENDING]' };
  }
  for (const row of claims.history) {
    const { line } = row;
    const which = row.version ? `version ${row.version}` : 'a version';
    const untaken = unfinished && row.version === version;
    const signed = unsigned || untaken ? null : signings.filter((record) => record.version === row.version).at(-1) ?? null;
    const back = 'put that row\'s Approved By and Approval Date back to [PENDING]';
    if (!signed) {
      const why = unsigned ? nobody : untaken && recorded ? none : 'no sign-off is recorded for that version';
      return { line, message: `this row of the Revision History says ${which} was approved ("${row.value}"), but ${why}. ` +
        `${sentence(back)}.`,
      reason: `says in its Revision History, at line ${line}, that ${which} was approved ("${row.value}"), though ${why}: ${back}` };
    }
    const right = `"${signedCell(signed)}"`;
    const named = isPending(row.approvedBy) || row.typedBy === signedCell(signed);
    if (!named && !row.approvedBy.includes(signed.name)) {
      return { line, cell: true, message: `this row of the Revision History says ${which} was approved by "${row.approvedBy}", which does ` +
        `not name ${signed.name}, who signed that version off on ${signed.date}. Write ${right} there, ` +
        'or put it back to [PENDING].',
      reason: `says in its Revision History, at line ${line}, that ${which} was approved by "${row.approvedBy}", which does not ` +
        `name ${signed.name}, who signed that version off on ${signed.date}: write ${right} there, or put ` +
        'it back to [PENDING]' };
    }
    if (!named) {
      const not = `which is not exactly what ${signed.name}'s sign-off of that version records`;
      return { line, cell: true, message: `this row of the Revision History says ${which} was approved by "${row.typedBy}", ${not}. Write ` +
        `${right} there and nothing else, or put it back to [PENDING].`,
      reason: `says in its Revision History, at line ${line}, that ${which} was approved by "${row.typedBy}", ${not}: write ` +
        `${right} there and nothing else, or put it back to [PENDING]` };
    }
    if (!isPending(row.approvalDate) && row.typedDate !== signed.date) {
      const but = `but ${signed.name} signed that version off on ${signed.date}`;
      return { line, cell: true, message: `this row of the Revision History gives ${which}'s approval date as "${row.typedDate}", ${but}. ` +
        `Write ${signed.date} there, or put it back to [PENDING].`,
      reason: `gives in its Revision History, at line ${line}, ${which}'s approval date as "${row.typedDate}", ${but}: write ` +
        `${signed.date} there, or put it back to [PENDING]` };
    }
  }
  return null;
}

// A header that says a document is signed off when the file is no longer what was signed: the newest
// sign-off for this file holds other hashes than the file has now. As { line, message, reason }, or null
// when the header claims nothing or the file is as it was signed. `hashes` are the file's (documentHashes).
function lapsedClaim(doc, name, header, hashes, records) {
  const version = DOCUMENT_FILE.exec(name)?.[2] ?? null;
  const mine = records.filter((record) => record.doc === doc && record.file === name && record.version === version).at(-1);
  if (!mine || (mine.body === hashes.body && mine.outside === hashes.outside)) return null;
  const claims = claimsOf(header);
  const first = claims.rows[0] ?? claims.history.find((row) => row.version === version);
  if (!first) return null;
  const says = first.field ? `${first.field} is "${first.value}"` : `version ${version} was approved ("${first.value}")`;
  const signed = `${mine.name} signed it off on ${mine.date}`;
  // Neither is put right by a new version: what the file prints is what would be printed now. A named
  // person signs it again as it reads, which sign-off allows for this fault alone (collectStatus).
  if (mine.body === hashes.body) {
    const next = 'take that change out again, or have a named person sign the document off again as it now reads';
    return { line: first.line, message: `this line says ${says}, but the file was changed outside its UK-FOOD markers after ` +
      `${signed}, so that sign-off no longer covers it. ${sentence(next)}.`,
    reason: `says in its header, at line ${first.line}, that it is signed off, but the file was changed outside its UK-FOOD ` +
      `markers after ${signed}: ${next}` };
  }
  const next = 'have a named person sign it off again';
  return { line: first.line, message: `this line says ${says}, but the document has been written again since ${signed}, so that ` +
    `sign-off does not cover what it says now. ${sentence(next)}.`,
  reason: `says in its header, at line ${first.line}, that it is signed off, but it has been written again since ${signed}: ${next}` };
}

// Where two lines first differ: the column, counted in characters from 1, and each line's character
// there as a code point (so that a look-alike shows), or the end of the line.
function firstDifference(expected, found) {
  const [a, b] = [Array.from(expected), Array.from(found)];
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const point = (char) => (char === undefined ? 'the end of the line' : codePoint(char));
  return { column: i + 1, expectedChar: point(a[i]), foundChar: point(b[i]) };
}

// What check finds before it renders anything, so that it holds whatever state the worksheets are in.
const BEFORE_RENDER = ['unreadable', 'markers', 'pack-text', 'header'];

// Checks the document in `report`, in this order, and stops at the first fault:
// - `unreadable`: the file can be read (exit 2 when it cannot);
// - `markers`: it holds one rendered body of `doc`, between its two marker lines;
// - `pack-text`: no heading of the pack stands outside the markers (packHeadingOutside);
// - `header`: its header says nothing about sign-off that no record bears out (headerClaim);
// - `edited` or `stale`: the body equals a fresh render, line by line, each read as the body's hash
//   reads it (normalised): white space at the end of a line and blank lines before the END marker are
//   seen by no reader and counted by no hash, so they are no difference here either, and a file that
//   differs only in them passes, stays in step and stays signed off. render itself never prints either:
//   every line it prints ends in a visible character, and one blank line stands before the END marker.
//   A body that is not the one its own marker's hash names was changed by hand; one that is, and
//   differs from a fresh render, is out of date, because its worksheets have changed since it was rendered;
// - `not-as-signed`: a header that says it is signed off is true of the file as it now is (lapsedClaim).
// Returns { exit, ok, kind, hashes, unwritten, unfinished, otherText, bodyInStep, line, column, expected,
// found, expectedChar, foundChar, message, reason }, or { exit, messages } when there is nothing to
// compare. `reason`, on a failure, is the fault as one clause that follows "document <file>" and ends
// with the next step: status and sign-off give it as it is. Whenever the markers were found: `hashes`
// are the file's own (documentHashes), `unwritten` the cells sign-off rewrites that hold something else
// (unwrittenCells), `unfinished` whether its body shows something not yet answered (showsUnfinished),
// `otherText` the lines outside the markers that are not its frame (otherText), `headerShowsSignOff`
// whether its header shows the newest sign-off recorded for it (headerShows), and `bodyInStep`
// whether the body equals a fresh render, whatever else is wrong with the file: true or false, or null
// when no fresh render could be made. A fault outside the body leaves it true. `signOffs` is what
// readSignOffs returns, read here unless given. Text outside the markers is not compared with anything:
// until a document is signed off it is held only to the three checks above, and a sign-off then binds it.
// `options` is the caller's, for the fresh render: { today } (see beginReading).
export function checkDocument(doc, project, report, data, signOffs = readSignOffs(project), options = {}) {
  let text;
  try {
    text = readFileSync(report, 'utf8');
  } catch (error) {
    return { exit: 2, kind: 'unreadable', messages: [`cannot read ${report}: ${error.message}`],
      reason: `cannot be read (${error.message}): check that the file is there and can be opened` };
  }
  const lines = documentLines(text);
  const body = findBody(lines, doc);
  // A document of blank forms (its row's remedies) has no worksheet to write it again from, and is told what to do in its
  // own words, in the message as in the reason; any other is sent to its worksheet.
  const remedies = documentOf(doc)?.remedies;
  if (body.problem) {
    const detail = `${body.problem}${body.line ? `, at line ${body.line}` : ''}`;
    return { exit: 1, ok: false, kind: 'markers', line: body.line,
      message: `${report}:${body.line ? `${body.line}:` : ''} ${body.problem}${remedies ? `\n${remedies.advice.markers}` : ''}`,
      reason: remedies ? remedies.markers(detail) : `has its UK-FOOD markers missing or damaged (${detail}): write the document again from its worksheet` };
  }
  const header = headerOf(lines, body);
  const inner = lines.slice(body.begin, body.end - 1);
  const written = writtenCells(doc, basename(report), header, signOffs.records ?? []);
  const hashes = { body: bodyHash(inner), outside: outsideHash(lines, body, header, written) };
  const facts = { hashes, unwritten: unwrittenCells(header, written), unfinished: showsUnfinished(doc, inner),
    otherText: otherText(lines, body), bodyInStep: null,
    headerShowsSignOff: headerShows(doc, basename(report), header, signOffs.records ?? []) };
  const failed = (kind, line, message, reason, more = {}) =>
    ({ exit: 1, ok: false, kind, ...facts, line, ...more, message: `${report}:${line}: ${message}`, reason });
  // The body is compared first, though a fault outside it is told first: whether the body is in step is a
  // fact of its own, which says whether a signed document needs a new version (only when it is not).
  // Each body is read as its hash reads it, between its marker line and the END marker.
  const fresh = renderDocument(doc, project, data, options);
  const read = (between) => normalised(between.join('\n')).split('\n').slice(0, -1);
  const printed = fresh.exit ? [] : fresh.text.split('\n');
  const expected = fresh.exit ? [] : [printed[0], ...read(printed.slice(1, -1)), END_MARKER];
  const region = [lines[body.begin - 1].replace(/[ \t]+$/, ''), ...read(inner), END_MARKER];
  let index = expected.findIndex((line, i) => region[i] !== line);
  if (!fresh.exit) facts.bodyInStep = index < 0 && region.length === expected.length;
  const outside = packHeadingOutside(lines, body, data);
  if (outside >= 0) {
    return failed('pack-text', outside + 1, 'this heading is the pack\'s text, outside the UK-FOOD markers, where it is not ' +
      'checked: take it out, so that the pack\'s text stands only between the markers.',
    `holds the pack's text outside its UK-FOOD markers, at line ${outside + 1}, where it is not checked: take that heading ` +
      'out, so that the pack\'s text stands only between the markers');
  }
  if (signOffs.error) return { exit: 2, ...facts, messages: [signOffs.error] };
  const claim = headerClaim(doc, basename(report), header, signOffs.records, facts.unfinished);
  if (claim) return failed('header', claim.line, claim.message, claim.reason, { cell: claim.cell ?? false });
  // Once a sign-off is recorded for this file, a cell the sign-off command rewrites holds what a signed
  // document has there, and one that holds anything else is a slip made while the header was marked: a
  // Last Modified that is not a date, a name typed "pending". It is told like any other fault in the
  // header, on one line that says what to write, and nothing is said of the file having changed since
  // it was signed: it is put right in that cell (`cell` marks the fault for status).
  const version = DOCUMENT_FILE.exec(basename(report))?.[2] ?? null;
  const signings = signOffs.records.filter((record) => record.doc === doc);
  const signedBy = facts.unfinished ? null : signings.filter((record) => record.file === basename(report) && record.version === version).at(-1);
  if (signedBy && facts.unwritten.length) {
    const [cell] = facts.unwritten;
    const ofRow = cell.version === undefined ? signedBy : signings.filter((record) => record.version === cell.version).at(-1);
    const want = cell.field === 'Status' ? 'APPROVED' : cell.field === 'Last Modified' ? 'today\'s date written YYYY-MM-DD'
      : cell.version === undefined ? `"${signedText(signedBy)}"` : !ofRow ? PENDING : cell.field.startsWith('Approved By') ? `"${signedCell(ofRow)}"` : ofRow.date;
    const has = `${cell.typed === '' ? 'nothing' : `"${cell.typed}"`} in ${cell.field}`;
    const where = `where a document that ${signedBy.name} has signed off has ${want}`;
    return failed('header', cell.line, `this line has ${has}, ${where}. Write ${want} there and nothing else.`,
      `has ${has}, at line ${cell.line}, ${where}: write ${want} there and nothing else`, { cell: true });
  }
  if (fresh.exit) return { ...fresh, ...facts };
  if (!facts.bodyInStep) {
    // A body its own marker's hash names is as it was rendered: it differs because the project has
    // moved on. Any other was changed by hand, and the line named is the first that differs below the
    // marker line, which differs only because the worksheets have changed as well.
    const intact = hashes.body === body.marker[3];
    if (!intact && index === 0) {
      const below = expected.findIndex((line, i) => i > 0 && region[i] !== line);
      if (below > 0 || region.length !== expected.length) index = below;
    }
    const at = index < 0 ? Math.min(region.length, expected.length) : index;
    const line = body.begin + at;
    // A document rendered from the project's status (its row's outOfDate: the completion record) also
    // depends on which documents are written, in step and signed off, so any difference means it no
    // longer matches the project.
    const { outOfDate } = documentOf(doc);
    let kind = 'edited';
    let what = `this line is not what a fresh render of ${doc} gives.`;
    let reason = remedies ? remedies.edited(line) : `was changed between its UK-FOOD markers, at line ${line}: make the change in its ` +
      'worksheet instead, and write the document again from its worksheet';
    if (outOfDate) {
      kind = 'stale';
      what = outOfDate.message;
      reason = outOfDate.reason;
    } else if (intact) {
      kind = 'stale';
      what = 'the worksheets have changed since this body was rendered: render the document again.';
      reason = remedies ? remedies.stale : 'is out of date, as its worksheets have changed since it was written: write the document again from ' +
        'its worksheet';
    }
    const [want, got] = [expected[at] ?? '', region[at] ?? ''];
    const { column, expectedChar, foundChar } = firstDifference(want, got);
    return failed(kind, line, `${what} The lines first differ at column ${column}, where the render has ${expectedChar} ` +
      `and the file has ${foundChar}.\n  expected: ${want}\n  found:    ${got}` + (outOfDate ? '' : `\n${remedies?.advice[kind] ?? CHECK_ADVICE}`),
    reason, { column, expected: want, found: got, expectedChar, foundChar });
  }
  const lapsed = lapsedClaim(doc, basename(report), header, hashes, signOffs.records);
  if (lapsed) return failed('not-as-signed', lapsed.line, lapsed.message, lapsed.reason);
  return { exit: 0, ok: true, ...facts, message: `${report}: the rendered body of ${doc} matches a fresh render` };
}

// A section's pack text as readable Markdown, opening with the source line: the section document's
// layout with no answers, no status and no variation lines.
export function referenceText(section, data) {
  const chunks = [[sourceLine(data.source)], ...sectionChunks(data.sections.get(section), REFERENCE_VIEW)];
  return chunks.map((chunk) => chunk.join('\n')).join('\n\n');
}

// Prints the messages of a result that is not a success, each with what to do next, and returns its
// exit code: 2 for an input error (a missing or wrong worksheet, data or file), 1 for a refusal. The
// usage is printed only for a usage error, by usageError.
function failure(io, result) {
  for (const message of result.messages) io.err(message);
  return result.exit;
}

// The options render and check share: --doc, --project and --data, checked, with the data loaded.
// Returns { options, data }, { usage } for a usage error, { wrong } for a value that is wrong, or { input }
// for data that will not load.
function documentOptions(args, valued, flags = []) {
  const { options, error } = readOptions(args, ['doc', 'project', 'data', ...valued], flags);
  if (error) return { usage: error };
  if (!RENDERED_CODES.includes(options.doc)) {
    // Left out, a usage error; given and wrong, a value that is wrong: as optionError decides it.
    return { [options.doc === undefined ? 'usage' : 'wrong']: `--doc is one of ${RENDERED_CODES.join(', ')}` };
  }
  if (!options.project) return { usage: '--project names the project folder that holds food-safety/' };
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  return dataError ? { input: dataError } : { options, data };
}

export function renderCommand(args, io = { out: console.log, err: console.error }) {
  const { options, data, usage, wrong, input } = documentOptions(args, []);
  if (usage) return usageError(io, usage);
  if (wrong) return valueError(io, wrong);
  if (input) return failure(io, { exit: 2, messages: [input] });
  const result = renderDocument(options.doc, options.project, data, { today: localToday() });
  if (result.exit) return failure(io, result);
  io.out(result.text);
  return 0;
}

export function checkCommand(args, io = { out: console.log, err: console.error }) {
  const { options, data, usage, wrong, input } = documentOptions(args, ['report'], ['json']);
  if (usage) return usageError(io, usage);
  if (wrong) return valueError(io, wrong);
  if (!options.report) return usageError(io, 'check needs --report: the document to check');
  if (input) return failure(io, { exit: 2, messages: [input] });
  const result = checkDocument(options.doc, options.project, options.report, data, undefined, { today: localToday() });
  if (options.json) {
    io.out(JSON.stringify({ doc: options.doc, report: options.report, ok: result.exit === 0, ...result }, null, 2));
    return result.exit;
  }
  if (result.messages) return failure(io, result);
  io.out(result.message);
  return result.exit;
}

export function referenceCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['section', 'data']);
  if (error) return usageError(io, error);
  if (!SECTION_IDS.includes(options.section)) return optionError(io, options.section, `--section is one of ${SECTION_IDS.join(', ')}`);
  const dir = options.data ?? DEFAULT_DATA_DIR;
  const { data, error: dataError } = loadValidData(dir);
  if (dataError) return failure(io, { exit: 2, messages: [dataError] });
  if (!data.sections.has(options.section)) return failure(io, { exit: 2, messages: [`the data in ${dir} has no ${options.section}.json`] });
  io.out(referenceText(options.section, data));
  return 0;
}
