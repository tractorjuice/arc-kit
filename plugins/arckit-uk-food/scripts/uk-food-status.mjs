import { existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_ID, DEFAULT_DATA_DIR, isObject, isString, SECTION_IDS } from './uk-food-data.mjs';
import { andList, counted, isAre, isIsoDate, localToday, unseenIn, worksheetTerms } from './uk-food-worksheet.mjs';
import {
  BEFORE_RENDER, bodyText, businessText, checkDocument, closingNotice, COMPLETION_RECORD, coverageChunks, DOC_CODES,
  DOC_OF_SECTION, documentOf, extraCareDone, failure, freshlyUnfinished, misplaced, NAME_QUESTION, otherText, paragraphs,
  readWorksheets, RECORD_SHEETS, SHEET_ORDER, sourceLine, STATUS_ORDER, tableLines, worksheetFile, worksheetName
} from './uk-food-document.mjs';
import { loadValidData, optionError, readOptions, usageError, valueError } from './uk-food.mjs';
export { completionRecordDocument, DOCUMENT_FILE, readSignOffs };

// ---------------------------------------------------------------------------------------------
// Status, the completion record and sign-off.
//
// `status` says, for each document, how far its worksheets have got, whether the document is written
// and in step with them, and whether a named person has signed it off (for a document someone signs);
// then whether the record sheets are written and in step, and whether the completion record is up to
// date; then the special processes and foods the business does, with the own entries that cover them;
// then, in plain English, everything that is not finished. The record sheets (RECORD_SHEETS) are blank
// forms: nobody signs them and they ask nothing, so they are not among the documents, and only their
// being written and in step is told, in `recordSheets` and in the unfinished list, as the business needs
// its diary pages. The completion record, FOODCMP, is the pack's own record (diary pages 78 and
// 79) filled in from that status, followed by the same list. `sign-off` records that a named person
// has confirmed a finished document, and refuses anything else: it is the only way a document becomes
// signed off. The helper never edits a document file.
//
// A document is a file in the project folder (not in food-safety/) named
// ARC-<3 digits>-<CODE>-v<version>.md. Of several for one code, the current one has the highest
// version, compared part by part as numbers, so 1.10 comes after 1.9. Sign-offs are appended to
// food-safety/sign-offs.json and never changed. A document is signed off only when it is finished
// (nothing blocks it: see collectStatus) and the last sign-off recorded for its code names the current
// file and version and holds the two hashes the file has now: `body`, of the text between its markers,
// and `outside`, of the rest of the file (documentHashes). So a sign-off covers the document as a
// person reads it, whole: it ends when a line of the document changes, inside the markers or outside
// them, and not when a worksheet changes in a way that changes no line of this document.
//
// Nothing counts as answered unless the parser marks it answered, and nothing in a worksheet with
// problems is relied on: none of its answers counts as confirmed, no method's status is read from it,
// and the special processes it names or the own entries it holds are not read from it. Such a
// worksheet is told as one line, naming it and how to list its problems.
// ---------------------------------------------------------------------------------------------

export const SIGN_OFFS_SCHEMA = 'uk-food-sign-offs-1.0';
// `body` and `outside` are the two hashes of the file as it was signed: see documentHashes.
// A record's fields, in the order written. All are text but otherTextRead, which is true or false: whether
// the person signing was shown lines outside the document's checked part (false when it held none).
const SIGN_OFF_FIELDS = ['doc', 'version', 'file', 'name', 'role', 'date', 'paperSigned', 'otherTextRead', 'body', 'outside'];
const SIGN_OFF_TEXT = SIGN_OFF_FIELDS.filter((name) => name !== 'otherTextRead');
// What the completion record prints in the date and signature cells of a document not signed off.
export const PENDING = '[PENDING]';
const NOT_RELEVANT = 'Not relevant';
const UNFINISHED_HEADING = '## Unfinished';
// The completion record's list of documents that say only where the business keeps a record, and the line it opens with.
const KEPT_ELSEWHERE_HEADING = '## Kept elsewhere';
const KEPT_ELSEWHERE_LEAD = 'Each line below names a record the business keeps elsewhere. The document named holds nothing of that record, and ' +
  'nothing in it was checked against that record.';
const NOTHING_OUTSTANDING = 'Nothing is outstanding.';
// The rows of the pack's completion record whose wording differs from their safe method's title,
// spelt as printed on page 78. A test ties each to the data.
export const COMPLETION_ROWS = { 'Personal hygiene': 'XC-01', 'Food allergies': 'XC-04' };
const COMPLETION_FORM = 'completionRecord';
const DOCUMENT_FILE = /^ARC-\d{3}-([A-Z]+)-v(\d+(?:\.\d+)*)\.md$/;
// What the completion record and status call a document: the name its row gives.
const docName = (code, data) => documentOf(code).name(data);
// The worksheets a document reads, as status lists them: its own first, then the others in SHEET_ORDER.
const worksheetsOf = (row) => [...(row.sheet === null ? [] : [row.sheet]),
  ...SHEET_ORDER.filter((section) => section !== row.sheet && row.uses.includes(section))];
// A sign-off's name or role: some text, on one line, with no tab and none of the UNSEEN characters.
const isPersonText = (value) => isString(value) && value.trim() !== '' && !/[\t\n\r]/.test(value) && !unseenIn(value);
const signOffsFile = (project) => join(project, 'food-safety', 'sign-offs.json');

// Compares two versions part by part, as numbers: negative when `a` comes first.
const compareVersions = (a, b) => {
  const [x, y] = [a, b].map((version) => version.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  }
  return 0;
};

// The current document of each code in the project folder: a Map from code to { file, version }. Of
// two versions equal as numbers, such as 1.0 and 1.00, the later file name is current, so that the
// choice is the same every time.
function currentDocuments(project) {
  const current = new Map();
  for (const entry of readdirSync(project, { withFileTypes: true })) {
    const match = DOCUMENT_FILE.exec(entry.name);
    if (!match || entry.isDirectory()) continue;
    const [, code, version] = match;
    const best = current.get(code);
    if (!best || (compareVersions(version, best.version) || (entry.name > best.file ? 1 : -1)) > 0) {
      current.set(code, { file: entry.name, version });
    }
  }
  return current;
}

// Reads food-safety/sign-offs.json: { records, text }, with no records and text null when there is
// none, or { error } when it cannot be read or is not the shape sign-off writes. Such a file is never
// rewritten: a sign-off is a record, and only a person may put one right.
function readSignOffs(project) {
  const file = signOffsFile(project);
  if (!existsSync(file)) return { records: [], text: null };
  const leave = 'It has not been changed: put it right by hand, or restore it from a copy, then run this again.';
  let text;
  let value;
  try {
    text = readFileSync(file, 'utf8');
  } catch (error) {
    return { error: `cannot read ${file}: ${error.message}` };
  }
  try {
    value = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch (error) {
    return { error: `${file} is not valid JSON (${error.message}), so the sign-offs in it cannot be read. ${leave}` };
  }
  const problems = signOffProblems(value);
  if (problems.length) return { error: `${file} is not a sign-offs file this helper can read: ${problems.join('; ')}. ${leave}` };
  return { records: value.signOffs, text };
}

// What is wrong with the shape of a parsed sign-offs file: nothing, or each fault in turn.
function signOffProblems(value) {
  if (!isObject(value)) return ['it is not a JSON object'];
  const problems = Object.keys(value).filter((name) => !['schema', 'signOffs'].includes(name)).map((name) => `unknown key ${name}`);
  if (value.schema !== SIGN_OFFS_SCHEMA) problems.push(`its schema is not ${SIGN_OFFS_SCHEMA}`);
  if (!Array.isArray(value.signOffs)) return [...problems, 'signOffs is not a list'];
  value.signOffs.forEach((record, i) => {
    const at = `sign-off ${i + 1}`;
    if (!isObject(record)) return problems.push(`${at} is not an object`);
    for (const name of Object.keys(record)) if (!SIGN_OFF_FIELDS.includes(name)) problems.push(`${at} has an unknown key ${name}`);
    const lacking = SIGN_OFF_TEXT.filter((name) => !isString(record[name]));
    if (lacking.length) return problems.push(`${at} has no ${andList(lacking)} written as text`);
    const file = DOCUMENT_FILE.exec(record.file);
    const checks = [
      [DOC_CODES.includes(record.doc), `doc ${JSON.stringify(record.doc)} is not one of ${DOC_CODES.join(', ')}`],
      [file && file[1] === record.doc && file[2] === record.version,
        `file ${JSON.stringify(record.file)} is not a ${record.doc} document of version ${JSON.stringify(record.version)}`],
      [isPersonText(record.name), 'its name is empty, runs over more than one line or holds a character that cannot be seen'],
      [isPersonText(record.role), 'its role is empty, runs over more than one line or holds a character that cannot be seen'],
      [isIsoDate(record.date), `date ${JSON.stringify(record.date)} is not a real date written YYYY-MM-DD`],
      [['yes', 'no'].includes(record.paperSigned), `paperSigned ${JSON.stringify(record.paperSigned)} is not yes or no`],
      [typeof record.otherTextRead === 'boolean', 'otherTextRead is not true or false'],
      [/^[0-9a-f]{64}$/.test(record.body), 'body is not a sha256 hash'],
      [/^[0-9a-f]{64}$/.test(record.outside), 'outside is not a sha256 hash']
    ];
    for (const [ok, message] of checks) if (!ok) problems.push(`${at}: ${message}`);
  });
  return problems;
}

// How many questions (or entries) a person must answer for a document, from its own worksheet, and where
// they stand: those its row's asks gives, each confirmed when the parser marks it answered, with the
// methods marked not relevant and adapted. With the identifiers of those not yet answered and of those
// only proposed, in order. Nothing in a worksheet with problems counts as confirmed.
function countsOf(row, sheet, data) {
  const counts = { questions: 0, confirmed: 0, proposed: 0, notRelevantMethods: [], adaptedMethods: [], unansweredIds: [], proposedIds: [] };
  const count = (id, record) => {
    counts.questions++;
    if (sheet?.clean && record?.answered) counts.confirmed++;
    else if (record?.state === 'proposed') {
      counts.proposed++;
      counts.proposedIds.push(id);
    } else counts.unansweredIds.push(id);
  };
  const { items, notRelevant = [], adapted = [] } = row.asks(sheet, data);
  items.forEach(([id, record]) => count(id, record));
  counts.notRelevantMethods.push(...notRelevant);
  counts.adaptedMethods.push(...adapted);
  return { ...counts, unanswered: counts.questions - counts.confirmed - counts.proposed };
}

// The special processes and foods a clean profile confirms the business does, each with the confirmed
// own entry of kind special-process whose Process names it (never its title) and that entry's review;
// and the confirmed own entries whose environmental health review is pending. Nothing is read from an
// own worksheet with problems.
function specialProcessesOf(sheets) {
  const profile = sheets.get('profile');
  const own = sheets.get('own');
  const entries = own?.clean ? [...own.parsed.entries.values()].filter((entry) => entry.answered) : [];
  const specialProcesses = (profile?.clean ? extraCareDone(profile.parsed) : []).map(({ name }) => {
    const entry = entries.find((e) => e.kind === 'special-process' && e.process === name);
    return { name, ownEntry: entry?.id ?? null, ehReview: entry?.ehReview ?? null };
  });
  return { specialProcesses, awaiting: entries.filter((entry) => entry.ehReview === 'pending') };
}

// The lines of status's unfinished list, the completion record's list and sign-off's reasons. Each is
// one sentence that says what is outstanding and what to do next. A worksheet is named by its path in
// the project folder, so that the completion record holds no path of this computer's.
const sheetPath = (section) => `food-safety/${worksheetName(section)}`;
// Up to five identifiers, then how many more: `shown` gives those named.
const shown = (ids) => ids.slice(0, 5);
const someOf = (ids) => (ids.length <= 5 ? andList(ids) : `${shown(ids).join(', ')} and ${ids.length - 5} more`);
const NOT_WRITTEN = 'document not written yet: write the document from its worksheet';
const NOT_SIGNED = 'document not signed off yet: once it is finished, a named person signs it off';
const notStartedLine = (section) => `worksheet ${sheetPath(section)} is not started yet: make it with worksheet --section ` +
  `${section} and fill it in`;
// Of a worksheet with problems, what counts for nothing until they are put right is said as its kind of worksheet
// has it (worksheetTerms): its answers, or everything written in a list worksheet, which has entries instead.
const problemsLine = (section, n) => `worksheet ${sheetPath(section)} has ${counted(n, 'problem', 'problems')}, so ` +
  `${worksheetTerms(section).counts} until ${n === 1 ? 'it is' : 'they are'} fixed: parse-worksheet --file ${sheetPath(section)} lists ` +
  `${n === 1 ? 'it' : 'them'}`;
// A worksheet whose only problem is that its wording is another version's: what to run, by its path.
const otherWordingLine = (section, what) => `worksheet ${sheetPath(section)} was made by a different version of the overlay ` +
  `(${what}), so ${worksheetTerms(section).counts} until it is brought up to date: upgrade-worksheet --file ${sheetPath(section)} shows ` +
  'each line it would take out or put in, and with --write does so and keeps a copy. Anything a person typed on a line it takes out ' +
  'cannot be told from old wording, so a person reads what it shows first';
// A written document that fails check: check's own first reason, with its next step.
const checkLine = (file, check) => `document ${file} ${check.reason ?? `does not pass check: ${check.messages?.[0] ?? check.message}`}`;
// What the unfinished list says of a document that has a sign-off record and is not signed off. Each
// names who signed and when, says truly what has happened since, and ends with what to do.
const changedLine = (record) => `signed off by ${record.name} on ${record.date}, but changed since: sign off again`;
// What the file prints is no longer what was signed, and is not what would be printed now either: a
// new version follows, as for answers that have changed.
const rewriteLine = (record) => `signed off by ${record.name} on ${record.date}, but what it prints has changed since: writing ` +
  'the document again makes a new version, which then needs signing off';
const answersChangedLine = (record) => `signed off by ${record.name} on ${record.date}, but its answers have changed since: ` +
  'writing the document again makes a new version, which then needs signing off';
// The header claims nothing here (check's own line covers a header that does), so the file is in step
// and its command has nothing to write: the change comes out, or the file is signed off as it now reads.
const outsideChangedLine = (record) => `signed off by ${record.name} on ${record.date}, but the file was changed outside its ` +
  'UK-FOOD markers after that, so the sign-off no longer covers it: take that change out again, or have a named person sign ' +
  'it off again as it now reads';
// A record that names this very body, when the body shows something unfinished: sign-off never made it.
const unsoundLine = (record) => `the sign-off recorded for this file in ${record.name}'s name, on ${record.date}, cannot be ` +
  'right: the document still shows a question not yet answered or an entry not yet confirmed, and one that does is never ' +
  'signed off. Once it is finished and written again, a named person signs it off';
// The same, when no line above says what is unfinished, as nothing counted explains the mark: then the record may have
// been sound when it was made (a later release can read a line as unfinished that an earlier one did not), so it is
// not called wrong, and the person is sent to the document to find what it shows.
const unexplainedLine = (record) => `signed off by ${record.name} on ${record.date}, but it still shows something not yet answered ` +
  'or not yet confirmed, and a document that does is never signed off: finish that in its worksheet, then write the document ' +
  'again, which makes a new version for a named person to sign off';
// A cell sign-off rewrites that holds something the commands do not write there (unwrittenCells).
const cellLine = (file, { line, field, typed, want }) => `document ${file} has ${typed === '' ? 'nothing' : `"${typed}"`} in ` +
  `${field}, at line ${line}, a cell the sign-off step rewrites: write ${want} there first, so that marking the document as ` +
  'signed off changes nothing else in the file';
const otherVersionLine = (record, current) => `this is version ${current.version}, and the newest sign-off is ${record.name}'s ` +
  `of version ${record.version}, on ${record.date}: once this version is finished, a named person signs it off`;
const goneLine = (record) => `${record.file}, which ${record.name} signed off on ${record.date}, is not in the project folder: ` +
  'put it back, or sign the document off again once it is written';
// The line for a document that is not signed off: null when the lines before it already say everything.
// `asSigned` is true when the newest sign-off names the current file and holds the hashes it has now;
// `unexplained`, when its body shows something unfinished and no line before this one says what.
function signLine(record, current, check, asSigned, unexplained) {
  if (!record) return NOT_SIGNED;
  if (!current) return goneLine(record);
  if (record.file !== current.file || record.version !== current.version) return otherVersionLine(record, current);
  if (check.unfinished && check.hashes?.body === record.body) return unexplained ? unexplainedLine(record) : unsoundLine(record);
  // A fault outside the body that check tells on a line of its own is put right as that line says, and
  // nothing is added to it: a header that claims a sign-off the file has outlived, a header cell that
  // is not what the record bears out (a slip while a sign-off is marked, which changes the file outside
  // its markers too, and is put right in that cell and nowhere else), the pack's text outside the
  // markers, or a file that cannot be read.
  if (['not-as-signed', 'header', 'pack-text', 'unreadable'].includes(check.kind)) return null;
  // The file is what was signed. If a fresh render now differs, its answers have moved on; otherwise the
  // lines before this one say what is unfinished, and nothing has changed since the sign-off.
  if (asSigned) return check.kind === 'stale' ? answersChangedLine(record) : null;
  // The body is not in step, so signing again is not what comes next: a new version is.
  if (['edited', 'stale', 'markers'].includes(check.kind)) return rewriteLine(record);
  return check.hashes?.body === record.body ? outsideChangedLine(record) : changedLine(record);
}
const uncoveredLine = (name) => `${name} has no own entry: add an own entry of kind special-process whose Process is ${name}, ` +
  'and confirm it';
const awaitingLine = (entry) => `own entry ${entry.id} (${entry.title}) is awaiting environmental health review: once the ` +
  'council has replied, record the review\'s date and outcome in the entry\'s EH-review field';
// What the unfinished list says of the record sheets when they are not written. They have no worksheet of their own and
// nothing to sign, so the remedy is to write them. (Once they are written, check's own reason is given for any fault, in
// the words their row gives check: see remedies in the table.)
const FORMS_NOT_WRITTEN = 'document not written yet: write it, so that people at the business have the blank forms to print and fill in';
// The line for a worksheet for other data, or in the wrong file: what to do, and for one in the wrong
// file where it probably belongs. Null for any other worksheet.
function misplacedLine(section, sheet, project) {
  if (sheet?.wrongData) {
    return `worksheet ${sheetPath(section)} answers data ${sheet.parsed.data}, not this helper's data ${DATA_ID}: keep a copy ` +
      `of it, make a new one with worksheet --section ${section} and copy the answers across`;
  }
  if (!sheet?.belongsTo) return null;
  const found = sheet.belongsTo;
  const taken = existsSync(worksheetFile(project, found)) ? ' (a file is already there: compare the two first)' : '';
  return `worksheet ${sheetPath(section)} is the ${found} worksheet, not the ${section} one: move or rename it first, so that ` +
    `it is not overwritten, as it probably belongs in ${sheetPath(found)}${taken}, then make the ${section} worksheet with ` +
    `worksheet --section ${section}`;
}
// The one line that tells the state of a worksheet that keeps a document of `row` from being finished: not started (in
// the row's own words when it is the row's own worksheet and the row has them, notStarted), for other data or in the
// wrong file, made by a different version and nothing else wrong, or with problems. `sheet` is as readWorksheets read
// it, null when it is not there.
function sheetLine(section, sheet, project, row) {
  if (!sheet) return section === row.sheet && row.notStarted ? row.notStarted() : notStartedLine(section);
  const misplacedNow = misplacedLine(section, sheet, project);
  if (misplacedNow) return misplacedNow;
  return sheet.otherVersion && sheet.problems.length === 1 ? otherWordingLine(section, sheet.otherVersion)
    : problemsLine(section, sheet.problems.length);
}

// The lines for a document's questions not yet answered and its answers only proposed, or its entries
// not yet confirmed and only proposed (its row's entries), naming the worksheet and up to five identifiers.
// Each ends with what those named need in order to count: the row's own words for them (countsWhen, given
// the identifiers the line shows), or the words the others share. `sheet` is the worksheet, with no problems.
function countLines(row, counts, section, sheet, data) {
  const { entries, nouns: [one, many] } = row;
  const how = (ids) => row.countsWhen?.(shown(ids), sheet, data) ??
    `${entries ? 'an entry' : 'an answer'} counts when its State is confirmed and By and On are filled in`;
  const { unansweredIds: open, proposedIds: proposed } = counts;
  return [
    ...(open.length ? [`${counted(open.length, one, many)} in ${sheetPath(section)} ${isAre(open.length)} not yet ` +
      `${entries ? 'confirmed' : 'answered'} (${someOf(open)}): ${how(open)}`] : []),
    ...(proposed.length ? [`${counted(proposed.length, entries ? one : 'answer', entries ? many : 'answers')} in ` +
      `${sheetPath(section)} ${isAre(proposed.length)} proposed but not confirmed (${someOf(proposed)}): ${how(proposed)}`] : [])
  ];
}

// Where the record sheets stand: { state, check, lines }. `state` is what status --json gives as recordSheets:
// { written, inStep, file }, inStep being whether the file passes check (false when it is not written). `check`
// is check's result, or null with no file. `lines` are the record sheets' lines in the unfinished list: that
// they are not written, or check's own first reason for a fault, as for a document; check words it for blank
// forms, which have no worksheet of their own to send a person to (remedies). A worksheet they are written from that is
// missing, in the wrong place or with problems is told under the document whose worksheet it is, and first here as well
// when their row says they tell it too (tellsToo: the Management worksheet, whose checks they print, as they cannot be
// written while it cannot be read). While it is so the record sheets are not called out of date, as they cannot be
// compared with a fresh print; only what check finds before it prints anything (BEFORE_RENDER) is told all the same.
function recordSheetsState(row, current, project, data, sheets, signOffs, options) {
  const told = (row.tellsToo ?? []).filter((section) => sheets.get(section) && !sheets.get(section).clean)
    .map((section) => sheetLine(section, sheets.get(section), project, row));
  if (!current) return { state: { written: false, inStep: false, file: null }, check: null, lines: [...told, FORMS_NOT_WRITTEN] };
  const check = checkDocument(row.code, project, join(project, current.file), data, signOffs, options);
  const inStep = check.exit === 0;
  const comparable = row.uses.every((section) => (sheets.get(section) ? sheets.get(section).clean : !row.needs.includes(section)));
  let lines = told;
  if (!inStep && (comparable || BEFORE_RENDER.includes(check.kind))) lines = [...told, checkLine(current.file, check)];
  return { state: { written: true, inStep, file: current.file }, check, lines };
}

// Everything status reports, with what sign-off and the completion record need besides: { status,
// sheets, hashes, blockers, signOffs }, or { exit: 2, messages } when the project cannot be read.
// `hashes` holds each written document's own two hashes (documentHashes), which a sign-off records.
// `blockers` holds, for each document, what keeps it from being finished: { what, sheet, after }, where
// `sheet` is the worksheet a line is about (null for the document's own lines) and `after` marks a
// line the unfinished list gives after the documents. `options` is the caller's: { today } (see beginReading).
function collectStatus(project, data, options = {}) {
  const lacking = SECTION_IDS.find((id) => !data.sections.has(id));
  if (lacking) return { exit: 2, messages: [`the data has no ${lacking}.json`] };
  let folder = false;
  try {
    folder = statSync(project).isDirectory();
  } catch {
    folder = false;
  }
  if (!folder) return { exit: 2, messages: [`${project} is not a folder: --project names the project folder that holds food-safety/`] };
  const signOffs = readSignOffs(project);
  if (signOffs.error) return { exit: 2, messages: [signOffs.error] };
  const sheets = readWorksheets(project, data, undefined, options);
  const unreadable = [...sheets.values()].find((sheet) => sheet?.readError);
  if (unreadable) return { exit: 2, messages: [unreadable.readError] };
  let files;
  try {
    files = currentDocuments(project);
  } catch (error) {
    return { exit: 2, messages: [`cannot read the project in ${project}: ${error.message}`] };
  }
  const { specialProcesses, awaiting } = specialProcessesOf(sheets);
  // A special process is said to have no entry only when the own worksheet, if there is one, has no problems.
  const own = sheets.get('own');
  const uncovered = !own || own.clean ? specialProcesses.filter((process) => !process.ownEntry).map(({ name }) => uncoveredLine(name)) : [];
  const hashes = new Map();
  const blockers = new Map();
  const signLines = new Map();
  const checks = new Map();
  const documents = STATUS_ORDER.map((code) => {
    const row = documentOf(code);
    // The worksheets the document reads, its own first, and those it cannot be rendered without.
    const reads = worksheetsOf(row);
    const { needs } = row;
    const current = files.get(code) ?? null;
    const check = current ? checkDocument(code, project, join(project, current.file), data, signOffs, options) : null;
    const inSync = check?.exit === 0;
    // Counted from its own worksheet: none, for a document with no worksheet of its own (sheet null).
    const counts = countsOf(row, sheets.get(row.sheet), data);
    const missing = reads.filter((section) => needs.includes(section) && !sheets.get(section));
    // A worksheet for other data or in the wrong file is told by what to do about it; any other with
    // problems by how many parse-worksheet lists.
    const advice = new Map(reads.map((section) => [section, misplacedLine(section, sheets.get(section), project)]));
    const wrong = reads.filter((section) => advice.get(section));
    const troubled = reads.filter((section) => !advice.get(section) && sheets.get(section)?.problems.length);
    const doc = {
      code,
      worksheets: reads.map(worksheetName),
      missingWorksheets: missing.map(worksheetName),
      problems: reads.reduce((sum, section) => sum + (sheets.get(section)?.problems.length ?? 0), 0),
      misplaced: wrong.length ? advice.get(wrong[0]) : null,
      questions: counts.questions,
      confirmed: counts.confirmed,
      proposed: counts.proposed,
      unanswered: counts.unanswered,
      notRelevantMethods: counts.notRelevantMethods,
      adaptedMethods: counts.adaptedMethods,
      // A document whose row tallies its own counts (a list document's entries, those confirmed and what its list
      // counts besides) gives them here; no other has the field.
      ...(row.tally ? { counts: row.tally(sheets.get(row.sheet), counts) } : {}),
      file: current?.file ?? null,
      version: current?.version ?? null,
      rendered: Boolean(current),
      inSync,
      // Whether the body between the markers equals a fresh print, whatever else is wrong with the file:
      // null with no file, or when it could not be compared. A body that cannot be found is not in step.
      bodyInStep: !current ? null : check.kind === 'markers' ? false : check.bodyInStep ?? null,
      otherText: check?.otherText ?? []
    };
    // Whether the file's header shows the newest sign-off recorded for it: see headerShows.
    const headerShowsSignOff = check?.headerShowsSignOff ?? null;
    // A worksheet that is not clean gives one line and none from its counts. A document whose worksheets
    // are missing, misplaced or have problems cannot be compared with a fresh render, but what check finds
    // before it renders is told all the same; any other that fails check is given check's own first reason.
    const comparable = !missing.length && !wrong.length && !troubled.length;
    const fileLines = !current ? [NOT_WRITTEN] : !inSync && (comparable || BEFORE_RENDER.includes(check.kind)) ? [checkLine(current.file, check)] : [];
    // A worksheet that is not there yet is told by how to make it, not by questions "in" it. A cell of
    // the header that sign-off would rewrite and that holds something else keeps the document from
    // being signed off, so that marking it as signed off changes nothing a person signed.
    // A document whose row has its own lines for what is outstanding (a list document's, see outstanding in the
    // table) gives them after its counts, from a clean worksheet only, as its counts are. It is given every worksheet
    // read too, for a document that prints from another (the allergen information, from the Management worksheet).
    const clean = sheets.get(row.sheet)?.clean;
    const docLines = [
      ...(clean ? countLines(row, counts, row.sheet, sheets.get(row.sheet), data) : []),
      ...(clean && row.outstanding ? row.outstanding(sheets.get(row.sheet), data, sheets) : []),
      ...fileLines,
      // (After a sign-off, check tells such a cell itself, one at a time, with what a signed document has there.)
      ...(check?.cell ? [] : check?.unwritten ?? []).map((cell) => cellLine(current.file, cell))
    ];
    const held = [
      ...reads.filter((section) => missing.includes(section) || wrong.includes(section) || troubled.includes(section))
        .map((section) => ({ what: sheetLine(section, sheets.get(section), project, row), sheet: section })),
      // A file that is no longer the one signed is put right by signing it again, so that line is
      // told, and keeps the document from counting as signed off, but does not stop a new sign-off.
      ...docLines.map((what) => ({ what, sheet: null, resign: check?.kind === 'not-as-signed' && what === fileLines[0] })),
      ...(row.specialProcesses ? uncovered : []).map((what) => ({ what, sheet: null, after: true }))
    ];
    const record = signOffs.records.filter((entry) => entry.doc === code).at(-1) ?? null;
    // Signed off only when finished, and the newest sign-off for it names this file and holds the two
    // hashes the file has now: what was signed is what is there, inside the markers and outside them.
    const asSigned = Boolean(record && current && check.hashes && record.file === current.file &&
      record.version === current.version && record.body === check.hashes.body && record.outside === check.hashes.outside);
    // Sign-off never records a body that shows something not yet answered or not yet confirmed, whatever status
    // counts (its backstop), so status does not take a recorded sign-off of one either. Nothing is held only when the
    // file is in step with a fresh render, so the body check read (`unfinished`) is the fresh body the backstop reads.
    // For every document today each such mark has a line of its own above (a count, or its row's outstanding), so
    // this changes nothing any of them says: it keeps status and sign-off in agreement should a body ever show a mark
    // that nothing counts, such as a line a later release reads as unfinished.
    const unexplained = held.length === 0 && Boolean(check?.unfinished);
    doc.signedOff = held.length === 0 && asSigned && !unexplained;
    doc.signOff = record;
    doc.headerShowsSignOff = headerShowsSignOff;
    // A document nobody signs (its row's signable is false) is never told that it is not signed off: nothing is
    // waiting for a signature, and sign-off refuses it in its own words.
    signLines.set(code, doc.signedOff || !row.signable ? null : signLine(record, current, check, asSigned, unexplained));
    checks.set(code, check);
    hashes.set(code, check?.hashes ?? null);
    blockers.set(code, held);
    return doc;
  });
  // The unfinished list tells each worksheet's state under the document whose own worksheet it is (its row's
  // sheet), and again under a document whose row says it tells it too, as that document prints from it and cannot
  // be written while it cannot be read (tellsToo); then the special processes with no entry and the entries
  // awaiting review, under the document whose row says it holds them (specialProcesses). A document with no
  // worksheet of its own has only its own lines there, and those of tellsToo.
  const unfinished = documents.flatMap((doc) => {
    const { sheet: mine, tellsToo = [] } = documentOf(doc.code);
    const lines = blockers.get(doc.code).filter(({ sheet, after }) => !after && (sheet === null || sheet === mine || tellsToo.includes(sheet)))
      .map(({ what }) => what);
    if (signLines.get(doc.code)) lines.push(signLines.get(doc.code));
    return lines.map((what) => ({ code: doc.code, what }));
  });
  // The record sheets, after the documents, as they come after them in the table, and before the lines the documents
  // give last. None in a table without them.
  const forms = RECORD_SHEETS ? recordSheetsState(documentOf(RECORD_SHEETS), files.get(RECORD_SHEETS) ?? null, project, data, sheets, signOffs,
    options) : null;
  if (forms) {
    checks.set(RECORD_SHEETS, forms.check);
    unfinished.push(...forms.lines.map((what) => ({ code: RECORD_SHEETS, what })));
  }
  const holder = STATUS_ORDER.find((code) => documentOf(code).specialProcesses);
  unfinished.push(...uncovered.map((what) => ({ code: holder, what })),
    ...awaiting.map((entry) => ({ code: holder, what: awaitingLine(entry) })));
  let started = false;
  try {
    started = statSync(join(project, 'food-safety')).isDirectory();
  } catch {
    started = false;
  }
  // `completionRecord` is filled in by fullStatus: the record is rendered from this status, so its own
  // state cannot be part of what it is rendered from. The record sheets' state is, as the record lists them
  // when they are not written or not in step.
  const status = { data: DATA_ID, documents, specialProcesses, ownAwaitingReview: awaiting.map((entry) => entry.id), unfinished,
    completionRecord: null, recordSheets: forms?.state ?? null, foodSafetyFolder: started };
  return { status, sheets, hashes, blockers, signOffs, checks, record: files.get(COMPLETION_RECORD) ?? null };
}

// Where the completion record stands: null when it is not written, else { file, version, inSync, problem },
// `problem` being check's own reason when it fails. It is told beside the documents, never among them or
// in the unfinished list: the record prints that list, so a line there about the record could never be
// true of the record that holds it.
function completionRecordState(project, data, collected, options = {}) {
  const current = collected.record;
  if (!current) return null;
  const check = checkDocument(COMPLETION_RECORD, project, join(project, current.file), data, collected.signOffs, options);
  return { file: current.file, version: current.version, inSync: check.exit === 0, problem: check.exit === 0 ? null : checkLine(current.file, check) };
}

// Everything status reports, the completion record's own state included: collectStatus's result with
// `status.completionRecord` filled in, or { exit: 2, messages }.
function fullStatus(project, data, options = {}) {
  const collected = collectStatus(project, data, options);
  if (collected.exit) return collected;
  collected.status.completionRecord = completionRecordState(project, data, collected, options);
  return collected;
}

// The status of the project in `project`, as status --json prints it, or { exit: 2, messages }.
export function projectStatus(project, data, options = {}) {
  const result = fullStatus(project, data, options);
  return result.exit ? result : result.status;
}

// Matches each row of the pack's completion record (each an array of its cells) to what it records:
// a row whose wording, ignoring letter case and runs of white space, is a section's title records that
// section; one that is a safe method's title, or a key of COMPLETION_ROWS, records that method.
// Returns { rows: [{ section, method }] }, method null for a section's own row, or { error } unless
// every row matches exactly one and every safe method is recorded exactly once.
export function completionTargets(rows, data) {
  const plain = (text) => String(text).replace(/\s+/g, ' ').trim().toLowerCase();
  const named = new Map(Object.entries(COMPLETION_ROWS).map(([wording, id]) => [plain(wording), id]));
  const reached = new Set();
  const targets = [];
  for (const [wording] of rows) {
    const key = plain(wording);
    const found = [...data.sections].flatMap(([section, file]) => [
      ...(plain(file.section.title) === key ? [{ section, method: null }] : []),
      ...file.methods.filter((m) => plain(m.title) === key || named.get(key) === m.id).map((m) => ({ section, method: m.id }))
    ]);
    if (found.length !== 1) {
      return { error: `the completion record's row "${wording}" matches ${found.length} sections and safe methods, not one` };
    }
    const [target] = found;
    if (target.method && reached.has(target.method)) return { error: `the completion record has more than one row for ${target.method}` };
    if (target.method) reached.add(target.method);
    targets.push(target);
  }
  const missed = [...data.sections.values()].flatMap((file) => file.methods.map((m) => m.id)).filter((id) => !reached.has(id));
  if (missed.length) return { error: `the completion record has no row for ${andList(missed)}` };
  return { rows: targets };
}

// The pack's completion record, from the blocks of diary.json marked completionRecord: the title of
// its pages, the text on them, its columns and its rows, each row with what it records. { error } when
// the data holds no such record, or one this helper cannot fill in.
function completionRecordData(data) {
  const pages = (data.diary?.pages ?? []).filter((page) => page.blocks.some((block) => block.form === COMPLETION_FORM));
  const tables = pages.flatMap((page) => page.blocks.filter((block) => block.form === COMPLETION_FORM));
  if (!tables.length) return { error: `the data's diary.json has no completion record: no block is marked ${COMPLETION_FORM}` };
  const { columns } = tables[0];
  if (columns?.length !== 4 || tables.some((table) => table.kind !== 'table' || table.columns.join('\n') !== columns.join('\n'))) {
    return { error: 'the completion record in the data\'s diary.json is not a table of four columns, the same on each of its pages' };
  }
  const rows = tables.flatMap((table) => table.rows);
  const matched = completionTargets(rows, data);
  if (matched.error) return { error: `${matched.error}, in the data's diary.json` };
  return {
    title: pages[0].title,
    intro: pages.flatMap((page) => page.blocks.filter((block) => block.kind === 'text' && !block.fromImage)).map((block) => block.text),
    columns,
    rows: rows.map((cells, i) => ({ wording: cells[0], ...matched.rows[i] }))
  };
}

// The completion record's body: the pack's title, text and table, each row's date and signature taken
// from the sign-off of the section document it belongs to (a section's own row as well as its methods'),
// or PENDING in both when that document is not signed off, and "Not relevant" beside a method marked
// not relevant; then what is unfinished; then the closing notice and the source line. It changes
// when a worksheet, a document or a sign-off does, so check simply compares it with a fresh render.
function completionRecordDocument(project, data, options = {}) {
  const record = completionRecordData(data);
  if (record.error) return { exit: 2, messages: [record.error] };
  const collected = collectStatus(project, data, options);
  if (collected.exit) return collected;
  const { status, sheets } = collected;
  const documents = new Map(status.documents.map((doc) => [doc.code, doc]));
  const rows = record.rows.map(({ wording, section, method }) => {
    const doc = documents.get(DOC_OF_SECTION[section]);
    const signed = doc.signedOff ? doc.signOff : null;
    return [wording, signed ? businessText(signed.date) : PENDING, signed ? businessText(signed.name) : PENDING,
      method && doc.notRelevantMethods.includes(method) ? NOT_RELEVANT : ''];
  });
  // A line may quote a sign-off's name and date, which are business text, so each is escaped whole: the
  // helper's own words in it hold no character that businessText changes.
  const unfinished = status.unfinished.map(({ code, what }) => `- ${docName(code, data)} (${code}): ${businessText(what)}`);
  // Each list document that says only where the business keeps its list, which is not unfinished, so not under Unfinished:
  // a list of its own after it, so that the record never reads as holding, or having checked, what is kept elsewhere. A
  // project with no such document prints none of it, so the record reads as it did before the list documents came.
  const keptElsewhere = status.documents.flatMap((doc) => {
    const row = documentOf(doc.code);
    const line = row.elsewhereOnlyLine?.(sheets.get(row.sheet));
    return line ? [`- ${docName(doc.code, data)} (${doc.code}): ${line}`] : [];
  });
  const profile = sheets.get('profile');
  const name = profile?.clean ? profile.parsed.answers.get(NAME_QUESTION) : null;
  const chunks = [
    ...coverageChunks(profile?.clean ? profile.parsed : null),
    ...(record.title ? [[`## ${record.title}`]] : []),
    ...record.intro.flatMap(paragraphs),
    tableLines(record.columns, rows),
    [UNFINISHED_HEADING],
    unfinished.length ? unfinished : [NOTHING_OUTSTANDING],
    ...status.documents.filter(unmarked).map((doc) => [`${docName(doc.code, data)} (${doc.code}) is signed off, and the header of ` +
      `${doc.file} is not yet marked to show it: ${MARK_HOW}.`]),
    ...(keptElsewhere.length ? [[KEPT_ELSEWHERE_HEADING], [KEPT_ELSEWHERE_LEAD], keptElsewhere] : []),
    [closingNotice(name?.answered ? name.answer : null)],
    [sourceLine(data.source)]
  ];
  return { exit: 0, text: bodyText(COMPLETION_RECORD, chunks) };
}

// Records that a named person has confirmed a document, when it is finished: its worksheets present
// and free of problems, every question confirmed, its current file of the version given and in step,
// each cell of its header that the sign-off step rewrites holding what the commands write there,
// and, for the own methods document, an own entry for each special process the profile confirms. Whatever
// else holds, a document whose body rendered afresh shows something unfinished is refused (the backstop).
// A document that holds text outside its checked part (otherText) is recorded only when `person.otherTextRead`
// is 'yes': the person signing has been shown those lines. The refusal lists them.
// `person` is { name, role, version, date, paperSigned, otherTextRead }. Returns { exit: 0, record, message }, or
// { exit, messages }: 1 for a refusal, which writes nothing and gives every reason with what to do
// next, and 2 when the project cannot be read, or for a document nobody signs, as the command treats it.
export function signOffDocument(code, project, person, data, options = {}) {
  // A document nobody signs is refused in its row's own words, as the command refuses it, before anything is read.
  const row = documentOf(code);
  if (row && !row.signable) return { exit: 2, messages: [row.signOffRefusal] };
  const collected = collectStatus(project, data, options);
  if (collected.exit) return collected;
  const { status, hashes, blockers, signOffs } = collected;
  const doc = status.documents.find((d) => d.code === code);
  const reasons = blockers.get(code).filter(({ resign }) => !resign).map(({ what }) => `- ${what}`);
  // Whether the document's own lines in status already say why it is not finished: its counts, its
  // worksheets, its file. See the backstop below.
  const told = reasons.length > 0;
  if (doc.rendered && doc.version !== person.version) {
    reasons.push(`- the current ${code} document is ${doc.file}, version ${doc.version}, not version ${person.version}: give ` +
      `--version ${doc.version} to sign off the current document`);
  }
  if (doc.otherText.length && person.otherTextRead !== 'yes') {
    const n = doc.otherText.length;
    reasons.push(`- document ${doc.file} holds ${counted(n, 'line', 'lines')} outside its checked part that ${isAre(n)} not part of ` +
      'its ordinary frame, and a sign-off covers the whole file: show them to the person signing, and give --other-text-read ' +
      'yes once that person has read them and says they are theirs', ...doc.otherText.map(({ line, text }) => `  line ${line}: ${text}`));
  }
  // The newest sign-off over again, while it stands, would be one statement recorded twice: it is refused,
  // and only the header may still need marking, which is the command's to do. The name and role are
  // compared as typed: the same person typed another way is a new statement, which is how a name or role
  // recorded with a slip in it is put right. A printed copy signed since it was recorded is a new
  // statement, and is recorded.
  const newest = doc.signOff;
  const paper = newest?.paperSigned === 'no' && person.paperSigned === 'yes';
  if (doc.signedOff && !paper && newest.name === person.name && newest.role === person.role) {
    reasons.push(`- ${person.name}'s sign-off of ${doc.file} (version ${doc.version}) as ${person.role} is already recorded, on ` +
      `${newest.date}, and the file has not changed since, so nothing more is recorded. ` +
      `${doc.headerShowsSignOff ? 'Its header shows it.' : `Its header is not yet marked to show it: ${MARK_HOW}.`}`);
  }
  // The backstop, which does not depend on what status counts: a document whose body, rendered afresh, shows
  // something not yet answered or not yet confirmed (its row's unfinishedLine) is never signed off. It is
  // told only when nothing in the document's own lines says why already, so that every refusal those lines
  // give is worded as it always was; whatever they say, sign-off refuses such a body.
  if (!told && freshlyUnfinished(code, project, data, options)) {
    reasons.push(`- ${code} still shows something not yet answered or not yet confirmed: finish its worksheet first, then write the document again`);
  }
  if (reasons.length) {
    return { exit: 1, messages: [`${code} is ${doc.signedOff ? `already signed off, by ${newest.name}, ${newest.role}, on ${newest.date}, and nothing ` +
      'more was' : 'not signed off, and nothing was'} written, because:`, ...reasons] };
  }
  const record = { doc: code, version: doc.version, file: doc.file, name: person.name, role: person.role, date: person.date,
    paperSigned: person.paperSigned, otherTextRead: doc.otherText.length > 0 && person.otherTextRead === 'yes', ...hashes.get(code) };
  const file = signOffsFile(project);
  // Written whole to a file beside it, then moved into place, so the record is never left half written.
  const next = `${file}.${process.pid}.tmp`;
  try {
    writeFileSync(next, `${JSON.stringify({ schema: SIGN_OFFS_SCHEMA, signOffs: [...signOffs.records, record] }, null, 2)}\n`);
    renameSync(next, file);
  } catch (error) {
    rmSync(next, { force: true });
    return { exit: 2, messages: [`cannot write ${file}: ${error.message}`] };
  }
  return {
    exit: 0, record,
    message: `Recorded in ${file}: ${person.name}, ${person.role}, signed off ${doc.file} (${code}, version ${doc.version}) on ` +
      `${person.date}${person.paperSigned === 'yes' ? ', with a signed paper copy' : ''}.${doc.signedOff && paper && newest.name === person.name &&
      newest.role === person.role ? ` A printed copy is now recorded as signed: this sign-off was already recorded, on ${newest.date}, without one.` : ''} ` +
      'The document\'s header reads as it did (DRAFT, or an earlier sign-off) until the slash command marks it: this helper does not edit document files.'
  };
}

// What the readable status says of a written document that fails check, by the kind of fault: the
// unfinished list gives the whole reason and what to do.
const FAULT_WORDS = {
  unreadable: 'that cannot be read', markers: 'with its markers missing or damaged', 'pack-text': 'with the pack\'s text outside its markers',
  header: 'with a header that no recorded sign-off bears out', edited: 'changed by hand between its markers', stale: 'out of date',
  'not-as-signed': 'changed since it was signed off'
};
const NOT_CHECKED = 'not checked, as a worksheet it needs is missing or has problems';
// What the readable status says of a fault in a written document: FAULT_WORDS for its kind, but for a header that
// claims a sign-off on a document nobody signs, which no sign-off could ever bear out. The unfinished list says what
// to do.
const UNSIGNED_HEADER = 'with a header that says it is signed off or approved, though nobody signs it off';
const faultWords = (row, kind) => (kind === 'header' && !row.signable ? UNSIGNED_HEADER : FAULT_WORDS[kind]);
// A slip in a header cell of a file whose sign-off is recorded: the record is there, so no claim lacks one, and the
// line under Unfinished says what to write.
const CELL_FAULT = 'with a sign-off recorded, and a cell of its header that is not what a signed document has there: write in it what ' +
  'its line under Unfinished says';
// A document can be signed off while its header still reads DRAFT: the record is made first, and the
// sign-off command then marks the header. That leaves nothing unfinished and blocks nothing, so it is
// not in the unfinished list; the readable status and the completion record each say it in one line.
const MARK_HOW = 'the sign-off command finishes the marking, and no new sign-off is needed';
const unmarked = (doc) => doc.signedOff && doc.headerShowsSignOff === false;

// The status as short lines a person can read: one for each document, then the record sheets, the completion
// record, the special processes and the own entries awaiting review, then what is unfinished. `checks` holds
// check's result for each written document, the record sheets included.
function statusLines(status, data, sheets, checks) {
  const lines = [`Food safety status, data ${status.data}${status.foodSafetyFolder ? '' : ': nothing has been started in this folder, ' +
    'which holds no food-safety folder. Check that it is the business\'s project folder'}`];
  for (const doc of status.documents) {
    const row = documentOf(doc.code);
    const [, many] = row.nouns;
    const parts = [
      ...(doc.missingWorksheets.length ? [`not started: ${doc.missingWorksheets.join(', ')}`] : []),
      ...(doc.problems ? [counted(doc.problems, 'worksheet problem', 'worksheet problems')] : []),
      // A list document says what its worksheet holds in its own words (its row's summary), as no count of
      // entries says that a list is kept elsewhere.
      ...(row.summary ? row.summary(doc, sheets.get(row.sheet))
        : [`${doc.confirmed} of ${doc.questions} ${many} confirmed${doc.proposed ? `, ${doc.proposed} proposed` : ''}`]),
      ...(doc.notRelevantMethods.length ? [`not relevant: ${doc.notRelevantMethods.join(', ')}`] : []),
      ...(doc.adaptedMethods.length ? [`adapted: ${doc.adaptedMethods.join(', ')}`] : []),
      doc.rendered ? `${doc.file} ${doc.inSync ? 'in step with its worksheets' : checks.get(doc.code)?.cell ? CELL_FAULT
        : faultWords(row, checks.get(doc.code)?.kind) ?? NOT_CHECKED}` : 'not written',
      ...(doc.otherText.length ? [`${counted(doc.otherText.length, 'line', 'lines')} outside its checked part`] : []),
      // Nothing about signing for a document nobody signs.
      ...(!row.signable ? [] : [doc.signedOff ? `signed off by ${doc.signOff.name}, ${doc.signOff.role}, on ${doc.signOff.date}` +
        (unmarked(doc) ? `, with its header not yet marked to show it: ${MARK_HOW}` : '') : 'not signed off'])
    ];
    lines.push(`${doc.code} (${docName(doc.code, data)}): ${parts.join('; ')}`);
  }
  // The record sheets, as they come in the table: how many problems the worksheets they are written from have, as a
  // document's line counts them, then written or not, and in step with their worksheets or how not. The unfinished list
  // says what to do.
  const forms = status.recordSheets;
  if (forms) {
    const row = documentOf(RECORD_SHEETS);
    const problems = row.uses.reduce((sum, section) => sum + (sheets.get(section)?.problems.length ?? 0), 0);
    const parts = [...(problems ? [counted(problems, 'worksheet problem', 'worksheet problems')] : []), !forms.written ? 'not written'
      : `${forms.file} ${forms.inStep ? 'in step with its worksheets' : faultWords(row, checks.get(RECORD_SHEETS)?.kind) ?? NOT_CHECKED}`];
    lines.push(`${RECORD_SHEETS} (${docName(RECORD_SHEETS, data)}): ${parts.join('; ')}`);
  }
  const record = status.completionRecord;
  lines.push(`${COMPLETION_RECORD} (${docName(COMPLETION_RECORD, data)}): ${!record ? 'not written' : record.problem ?? `${record.file} up to date`}`);
  const own = sheets.get('own');
  if (status.specialProcesses.length && own && !own.clean) {
    lines.push(`Special processes and foods: ${status.specialProcesses.map(({ name }) => name).join('; ')} (the own worksheet ` +
      'could not be read, so which own entries cover them is not known)');
  } else if (status.specialProcesses.length) {
    lines.push(`Special processes and foods: ${status.specialProcesses.map(({ name, ownEntry, ehReview }) =>
      (ownEntry ? `${name} (own entry ${ownEntry}, environmental health review: ${ehReview})` : `${name} (no own entry)`)).join('; ')}`);
  }
  if (status.ownAwaitingReview.length) lines.push(`Awaiting environmental health review: ${status.ownAwaitingReview.join(', ')}`);
  lines.push(status.unfinished.length ? 'Unfinished:' : NOTHING_OUTSTANDING);
  return [...lines, ...status.unfinished.map(({ code, what }) => `- ${code}: ${what}`)];
}

export function statusCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['project', 'data'], ['json']);
  if (error) return usageError(io, error);
  if (!options.project) return usageError(io, '--project names the project folder that holds food-safety/');
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return failure(io, { exit: 2, messages: [dataError] });
  const result = fullStatus(options.project, data, { today: localToday() });
  if (result.exit) return failure(io, result);
  io.out(options.json ? JSON.stringify(result.status, null, 2) : statusLines(result.status, data, result.sheets, result.checks).join('\n'));
  return 0;
}

export function signOffCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['doc', 'project', 'name', 'role', 'version', 'paper-signed', 'other-text-read', 'date', 'data']);
  if (error) return usageError(io, error);
  // A document nobody signs is refused in its row's own words.
  const row = documentOf(options.doc);
  if (row && !row.signable) return valueError(io, row.signOffRefusal);
  if (!DOC_CODES.includes(options.doc)) return optionError(io, options.doc, `--doc is one of ${DOC_CODES.join(', ')}`);
  if (!options.project) return usageError(io, '--project names the project folder that holds food-safety/');
  for (const [field, what] of [['name', 'name of the person signing off'], ['role', 'role of the person signing off, such as owner']]) {
    if (!isPersonText(options[field])) {
      // A character that cannot be seen is named by its code point: nobody can find it by looking.
      const unseen = isString(options[field]) ? unseenIn(options[field]) : '';
      return optionError(io, options[field], `--${field} is the ${what}: some text, on one line, with no character that cannot be seen` +
        (unseen ? `. It holds ${unseen}: delete ${unseen.includes(' and ') ? 'them' : 'it'}, or type it again` : ''));
    }
  }
  if (!options.version) {
    return optionError(io, options.version, '--version is the version of the document signed off, as in its file name: 1.0 for ARC-001-FOODCOOK-v1.0.md');
  }
  const paperSigned = options['paper-signed'] ?? 'no';
  if (!['yes', 'no'].includes(paperSigned)) return valueError(io, '--paper-signed is yes, when a signed paper copy is kept, or no');
  const otherTextRead = options['other-text-read'] ?? 'no';
  if (!['yes', 'no'].includes(otherTextRead)) {
    return valueError(io, '--other-text-read is yes, when the person signing has read the lines outside the document\'s checked part, or no');
  }
  const today = localToday();
  const date = options.date ?? today;
  if (!isIsoDate(date)) return valueError(io, `--date is a real date written YYYY-MM-DD, not ${JSON.stringify(date)}`);
  // A sign-off records something that has happened, so its date is never one still to come. Only a new
  // sign-off is held to this: a record already made is read back whatever this computer's date is.
  if (date > today) {
    return valueError(io, `--date is the day the document was signed off, which cannot be after today, ${today}: ${date} is still to come`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return failure(io, { exit: 2, messages: [dataError] });
  const person = { name: options.name.trim(), role: options.role.trim(), version: options.version, date, paperSigned, otherTextRead };
  const result = signOffDocument(options.doc, options.project, person, data, { today });
  if (result.exit) return failure(io, result);
  io.out(result.message);
  return 0;
}
