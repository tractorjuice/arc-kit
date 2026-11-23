import { DATA_ID, isObject, SECTION_IDS } from './uk-food-data.mjs';
export {
  andList, codePoint, counted, fieldLines, identifying, isAre, isIsoDate, key as fieldKey, localToday, longDate, methodQuestions, profileQuestion,
  quotedBy, readWorksheet, sentenceCase, spanOf, standard, STATE_WORDS, strictWorksheet, typedIn, unseenIn
};

// ---------------------------------------------------------------------------------------------
// Worksheets: a business's answers to the pack's questions, one Markdown file per section, that
// a person types into and the helper reads. Its only FSA words are those read from the data.
// ---------------------------------------------------------------------------------------------

export const WORKSHEET_VERSION = '1.0';
// Every worksheet's section: the seven this module makes and reads, then the list worksheets'. Let, not
// const, only so that addListWorksheets can add those: see there.
export let WORKSHEET_SECTIONS = [...SECTION_IDS, 'profile', 'own'];
// The list worksheets (cleaning, and the others uk-food-lists.mjs names) are that module's: it reads and
// writes them with the parts of this one they share (beginReading, readBlocks, blockTools, fieldLines,
// STATE_WORDS), and hands this module its reader, its writer and its guidance as it loads, so that every
// function here that takes a section takes a list section too. It cannot be imported here: it also prints
// the list documents, so it imports the document module, which imports this one, and a module that loads
// before one it imports cannot read that one while it loads. Every program that reads a worksheet loads
// it, as the helper's entry and the document module both import it. Until it has loaded, the list
// sections are not worksheet sections.
let LIST_WORKSHEETS = { sections: [] };
const isListSection = (section) => LIST_WORKSHEETS.sections.includes(section);
// For uk-food-lists.mjs alone, as it loads: `lists` is { sections, read(reading, data), emit(parsed, data),
// guidance(section, data), placed, wording, counts }, which readWorksheet, emitWorksheet and guidanceFor call for a
// list section; `placed` is the sentence that ends the problem about another version's wording, saying where a
// person's own lines belong in a list worksheet; `wording` and `counts` are what worksheetTerms gives for one.
export function addListWorksheets(lists) {
  LIST_WORKSHEETS = lists;
  WORKSHEET_SECTIONS = [...SECTION_IDS, 'profile', 'own', ...lists.sections];
}
// The words every worksheet's messages share that a list worksheet has words of its own for, as it has entries where
// the others have questions and answers: `wording`, what the tool's own wording in it is, as the problem about another
// version's wording and upgrade-worksheet's report name it, or null for a worksheet of questions, whose words for it
// those messages give themselves (its guidance, and its questions' lines); and `counts`, what of it counts for nothing
// while it has a problem, as status says it. A worksheet of questions keeps the words it has always printed.
export const worksheetTerms = (section) => (isListSection(section) ? { wording: LIST_WORKSHEETS.wording, counts: LIST_WORKSHEETS.counts }
  : { wording: null, counts: 'none of its answers counts' });
export const STATES = ['unanswered', 'proposed', 'confirmed'];
export const STATUSES = ['applies', 'adapted', 'not-relevant'];
export const OWN_KINDS = ['additional', 'special-process'];
const METHOD_FIELDS = ['Status', 'Reason', 'Decided-by', 'Variation', 'Proved-safe'];
const ANSWER_FIELDS = ['Answer', 'State', 'By', 'On', 'Source'];
const OWN_FIELDS = [
  'Kind', 'Process', 'Hazard', 'Control', 'Limit', 'Limit-source', 'Check', 'If-it-fails', 'Supplied-text', 'EH-review',
  'State', 'By', 'On', 'Source'
];
// The field that holds a business's own written procedure, read as it is written: see the parser.
const VERBATIM_FIELD = 'Supplied-text';
// The status fields each status uses. A field the status does not use, filled in, is reported:
// no document would show it, and nothing a person writes is dropped without saying so.
const STATUS_USES = {
  applies: [], adapted: ['Variation', 'Reason', 'Proved-safe', 'Decided-by'], 'not-relevant': ['Reason', 'Decided-by']
};
// What an own entry of each kind must fill in before it can be proposed or confirmed. Only a special
// process has a Process: the pack's special process or food that it covers. An entry whose State is
// unanswered may hold any of its fields but By and On, unchecked: it is where a half-given entry, or
// one nobody now stands by, keeps the person's words until it is proposed or confirmed.
const KIND_NEEDS = {
  additional: ['Hazard', 'Control', 'Check', 'If-it-fails'], 'special-process': ['Process', 'Supplied-text', 'EH-review']
};
// Printed after each question: the form of answer the helper reads. The helper's words, not the pack's.
const HINTS = {
  'yes-no': '(yes / no)', 'yes-no-else': '(yes, or say what you do instead)', tick: '(yes if you do this / no)',
  text: '(write your answer)', list: '(one item per line)', nation: '(England / Wales / Scotland / Northern Ireland / other)'
};
const NATIONS = ['England', 'Wales', 'Scotland', 'Northern Ireland', 'other'];
// The two lists below, of refused words and of copied hints, are a convenience, not the guard. The
// guards are that nothing typed is dropped or credited to the wrong place without a problem, that
// only confirmed answers count, and that a named person reads the rendered document before
// sign-off. Do not grow these lists word by word.
//
// Only yes (or yes.) is yes. An answer to a yes-no-else question that is nothing but one of these
// words, or a non-answer (n/a, n.a., not applicable, none, a dash, a question mark), followed by
// any run of marks (. ! ? an ellipsis, and also , ; : - and spaces), says neither yes nor what the
// business does instead, so it is reported and not used. So is an answer made only of such marks,
// or a lone em or en dash.
const NOT_AN_INSTEAD = new RegExp('^(?:(?:no|n|nope|nah|not|never|none|nil|na|n/a|n\\.a|not applicable|y|ye|yea|yeah|yep|' +
  'yup|yes|yess|yse|ys|yrs|ues|ok|okay|true|false)[\\s.!?\u2026,;:-]*|[\\s.!?\u2026,;:\u2013\u2014-]+)$', 'i');
// The hints printed after each question, each with and without its brackets: an answer line that
// is one of them, or the question's own else text, was copied from the prompt.
const HINT_TEXTS = Object.values(HINTS).flatMap((hint) => [hint, hint.slice(1, -1)]).map((hint) => hint.toLowerCase());
// The special processes and foods the pack names in CK-02's box "Other foods that need extra care"
// (page 53), spelt as printed there. A test checks that each is in that box's text.
export const EXTRA_CARE = {
  processes: ['Vacuum packing', 'sous vide', 'low temperature cooking', 'fermenting', 'smoking or curing meat/fish'],
  foods: ['Kebabs', 'sushi/sashimi', 'liver parfait', 'fish/meat carpaccio and tartare', 'less than thoroughly cooked burgers']
};
const EXTRA_CARE_NAMES = [...EXTRA_CARE.processes, ...EXTRA_CARE.foods];
// The name of the pack's special process or food that `text` names, ignoring letter case and runs of
// white space, in the pack's spelling; or null when it names none.
const extraCareName = (text) => {
  const plain = (name) => name.replace(/\s+/g, ' ').trim().toLowerCase();
  return EXTRA_CARE_NAMES.find((name) => plain(name) === plain(text)) ?? null;
};
// The profile's questions. The pack asks none of them, so the words are the helper's own. Each has a
// key that says what it asks, and the identifier a worksheet prints for it is written out here against
// that key, never worked out from its place in the list. Code that needs one question finds it by its
// key (profileQuestion). So a question added later, anywhere in the list, takes a new identifier, and
// no answer already in a worksheet changes its meaning. A test pins each identifier to its key.
const PROFILE_IDS = {
  'business-name': 'PR-Q01', operator: 'PR-Q02', premises: 'PR-Q03', council: 'PR-Q04', 'registered-on': 'PR-Q05', nation: 'PR-Q06',
  'pack-keeper': 'PR-Q07', sells: 'PR-Q08', equipment: 'PR-Q09', staff: 'PR-Q10',
  'process:Vacuum packing': 'PR-Q11', 'process:sous vide': 'PR-Q12', 'process:low temperature cooking': 'PR-Q13',
  'process:fermenting': 'PR-Q14', 'process:smoking or curing meat/fish': 'PR-Q15', 'food:Kebabs': 'PR-Q16',
  'food:sushi/sashimi': 'PR-Q17', 'food:liver parfait': 'PR-Q18', 'food:fish/meat carpaccio and tartare': 'PR-Q19',
  'food:less than thoroughly cooked burgers': 'PR-Q20'
};
// A profile question the tool words itself is known by that wording (identifiedBy), so a worksheet filled in
// before one was reworded holds words this version no longer prints. Each wording a release has printed and
// this version has since changed is kept here under the question's key, and an upgrade takes lines that hold
// one as that question's. A test holds every wording released, so one dropped from here shows.
const PROFILE_WAS = {};
export const PROFILE_QUESTIONS = [
  ['business-name', 'text', 'What is the business called?'],
  ['operator', 'text', 'Who is the food business operator: the person or company legally responsible for the business?'],
  ['premises', 'text', 'What is the address of the premises? If the business has none, write "no premises".'],
  ['council', 'text', 'Which council is the business registered with?'],
  ['registered-on', 'text', 'On what date was the business registered with the council?'],
  ['nation', 'nation', 'Which nation is the business in?'],
  ['pack-keeper', 'text', 'Who is in charge of keeping this pack up to date?'],
  ['sells', 'text', 'What food and drink does the business sell?'],
  ['equipment', 'list', 'What equipment do you use to store, prepare, cook and serve food?'],
  ['staff', 'list', 'Who works with food, and what is each person\'s role?'],
  ...EXTRA_CARE.processes.map((name) => [`process:${name}`, 'yes-no', `Do you use this process, which needs extra care: ${name}?`]),
  ...EXTRA_CARE.foods.map((name) => [`food:${name}`, 'yes-no', `Do you make or serve this food, which needs extra care: ${name}?`])
].map(([key, type, text]) => ({ id: PROFILE_IDS[key], key, type, text, elseText: null, was: PROFILE_WAS[key] ?? [] }));
const profileQuestion = (key) => PROFILE_QUESTIONS.find((question) => question.key === key);

const WORKSHEET_TITLES = { profile: 'Business profile', own: 'Your own controls and special processes' };
// The guidance each worksheet opens with. It is compared line by line when a worksheet is read (see
// closeComment), so a change to a word of it makes every worksheet already filled in one that was made
// by a different version: it says only what the parser does, and a worksheet that holds an earlier
// wording is brought up to date with upgrade-worksheet, which replaces the tool's own lines and nothing else.
const STATE_WORDS = [
  'proposed (taken from a file, or given without a name, and not yet agreed by a named person at the business: say where it came from in Source)',
  'confirmed (given or agreed by a named person at the business: put their name in By and the date, as YYYY-MM-DD, in On)'
];
const ANSWER_GUIDANCE = [
  'How to fill this in. Write each answer after "Answer:". To carry an answer on to more lines, start',
  'each extra line with two spaces, straight after the line before it, with no blank line between.',
  'State says where an answer stands: unanswered (Answer, By, On and Source stay empty);',
  `${STATE_WORDS[0]};`,
  `or ${STATE_WORDS[1]}.`,
  'Only a confirmed answer is printed in your documents as the business\'s answer. Until then its question',
  'is printed as not yet answered, with a proposed answer shown beside that and where it came from.',
  'Lines that start with > show what is asked. The note in brackets on the last of them, such as',
  '"(write your answer)", is this tool\'s: it says what form the answer takes. Leave those lines as they',
  'are: nothing typed on them is read, and a changed one is reported as a problem.'
];
const STATUS_GUIDANCE = [
  'Status says whether a safe method applies to the business: applies (the four lines under it stay',
  'empty); adapted (you do it differently: fill in Variation, what you do instead; Reason, why;',
  'Proved-safe, how you have shown that your way works; and Decided-by, who decided); or not-relevant',
  '(fill in Reason and Decided-by, leave Variation and Proved-safe empty, and leave the method\'s',
  'questions unanswered: the document then says only that the method is not relevant, why, and who decided).'
];
const OWN_GUIDANCE = [
  'Add an entry for each food safety control of your own that the pack does not cover, and for each',
  'special process you use, such as sous vide. Copy the lines from "## OWN-01" down, paste them below',
  'this comment, number the entries OWN-01, OWN-02 and so on, and write each entry\'s name after its',
  'number. Kind is additional or special-process.',
  'An entry of kind additional needs Hazard, Control, Check and If-it-fails, and leaves Process empty.',
  'A Limit needs a Limit-source: where the figure comes from.',
  'An entry of kind special-process needs Process, Supplied-text and EH-review. Process names the',
  'special process or food the entry covers, as the profile asks about it, and is one of these:',
  `${EXTRA_CARE_NAMES.join('; ')}.`,
  'Supplied-text is the business\'s own written procedure, kept exactly as it is written. Start each',
  'line after the first with two spaces: whatever follows them is kept, further spaces included, and',
  'so is a blank line between two such lines.',
  'EH-review is pending, or the date and outcome of the council\'s review, such as 2026-11-03 accepted.',
  'To carry any other value on to more lines, start each extra line with two spaces, straight after',
  'the line before it, with no blank line between.',
  'State says where an entry stands: unanswered (it may hold what has been given so far; By and On stay empty);',
  `${STATE_WORDS[0]};`,
  `or ${STATE_WORDS[1]}.`,
  'Only a confirmed entry goes into your documents: any other is named there as not yet confirmed.'
];
const OWN_TEMPLATE = [
  '',
  '## OWN-01 Name of the control',
  '',
  ...OWN_FIELDS.map((field) => (field === 'State' ? 'State: unanswered' : `${field}:`))
];
// Where the pack's words in a worksheet come from, with the licence line: read from the data's source.
// The pack's words are the > lines of a section worksheet and the names of the special processes and
// foods in the other two.
const QUOTED = {
  profile: 'The questions are this tool\'s own. The special processes and foods they name are named as in',
  own: 'The names of the special processes and foods are quoted from'
};
const QUOTED_LINES = 'Everything else on the lines that start with > is quoted from';
// The line that says where a worksheet's words from the pack come from: what they are (`lead`), then the source.
const quotedBy = (lead, source) => `${lead} the ${source.publisher}'s ${source.title}, retrieved ${longDate(source.retrieved)}. ` +
  `${source.attribution}`;
const quotedFrom = (section, source) => quotedBy(QUOTED[section] ?? QUOTED_LINES, source);

// The Markdown lint rules a worksheet cannot meet without changing the pack's words or the
// worksheet grammar, each turned off in that worksheet with its reason beside it.
const LINT_EXCEPTIONS = {
  profile: [['MD001', 'the profile has no methods, so its ### questions sit straight under the # title, as the worksheet grammar sets out']]
};

// The guidance comment each worksheet carries after its marker: how to fill it in, then where the
// pack's words in it come from (left out only for data that names no source), then, in the own
// worksheet, the entry to copy. A list worksheet's is its own module's.
const guidanceFor = (section, data) => (isListSection(section) ? LIST_WORKSHEETS.guidance(section, data) : [
  ...(section === 'own' ? OWN_GUIDANCE : section === 'profile' ? ANSWER_GUIDANCE : [...ANSWER_GUIDANCE, ...STATUS_GUIDANCE]),
  ...(isObject(data.source) ? [quotedFrom(section, data.source)] : []),
  ...(section === 'own' ? OWN_TEMPLATE : [])
]);

// A field's name as a property of a parsed record: Decided-by is decidedBy, EH-review ehReview.
const key = (field) => field.toLowerCase().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
const sentenceCase = (title) => title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
const worksheetTitle = (section, data) =>
  `${WORKSHEET_TITLES[section] ?? sentenceCase(data.sections.get(section).section.title)} (${section})`;
// A word as kept: a valid word in its standard spelling, anything else exactly as typed.
const standard = (value, words) => words.find((word) => word.toLowerCase() === value.toLowerCase()) ?? value;
const isIsoDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const andList = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
const longDate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};
const counted = (n, one, many) => `${n} ${n === 1 ? one : many}`;
// This computer's date, written YYYY-MM-DD: what the helper's commands give as today. Nothing below a command reads it.
const localToday = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-');
};
const isAre = (n) => (n === 1 ? 'is' : 'are');
// A character as its code point, U+ and four or more hex digits, so that one that looks like another shows.
const codePoint = (char) => `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
// The characters no value may hold. This is the one list, and it is a list, not a rule about a kind of
// character: each character on it is refused, in a worksheet value and in a sign-off's name and role
// alike, and any character not on it is taken as written. It does not hold every character a reader
// cannot see, because some of those belong to real writing.
// Refused, because a reader cannot see them or because they change what a reader sees, so that a
// document could show something other than what was written:
// - The control characters, but for the tab and the line endings (U+0000 to U+001F without U+0009,
//   U+000A and U+000D; U+007F to U+009F): an escape sequence, a backspace or a form feed changes what
//   a terminal or a viewer shows.
// - The line and paragraph separators (U+2028, U+2029), which break a line where none is written.
// - The direction overrides and embeddings (U+202A to U+202E) and isolates (U+2066 to U+2069), the
//   zero-width space (U+200B), the word joiner (U+2060) and a byte order mark inside the text (U+FEFF).
// - The invisible operators of mathematics (U+2061 to U+2064), the combining grapheme joiner (U+034F),
//   the Mongolian vowel separator (U+180E) and the interlinear annotation marks (U+FFF9 to U+FFFB).
// - The fillers, which show as nothing where a letter is expected (U+115F, U+1160, U+3164, U+FFA0).
// - The musical format characters (U+1D173 to U+1D17A).
// - The tag characters (U+E0001 and U+E0020 to U+E007F), which can carry a hidden message of any length.
//   The cost: the flags of England, Scotland and Wales are each an emoji followed by tag characters,
//   so a value that holds one is refused. The message names each tag character, by its code point: in
//   a worksheet with the line it is on, and for a sign-off's name or role in the usage error.
// Allowed, because writing needs them: the joiners that Persian, Urdu, Hindi and other scripts and many
// emoji use (U+200C, U+200D), the direction marks editors put around right-to-left text (U+200E and
// U+200F, and the Arabic letter mark, U+061C, which does the same job) and the soft hyphen (U+00AD).
const UNSEEN = new RegExp('[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u034F\u115F\u1160\u180E\u200B\u2028\u2029' +
  '\u2060-\u2064\u202A-\u202E\u2066-\u2069\u3164\uFEFF\uFFA0\uFFF9-\uFFFB\u{1D173}-\u{1D17A}\u{E0001}\u{E0020}-\u{E007F}]', 'gu');
// The unseen characters in a line, each once, in the order they first appear: "U+202E and U+200B".
const unseenIn = (text) => andList([...new Set(text.match(UNSEEN) ?? [])].map(codePoint));

// Where a method's questions sit: on a block, and on each row of any block but a table.
const holdersOf = (block) => [
  ...(Array.isArray(block.questions) ? [{ questions: block.questions, row: null }] : []),
  ...(block.kind !== 'table' && Array.isArray(block.rows) ? block.rows.map((row) => ({ questions: row.questions ?? [], row })) : [])
];

// The columns a question takes: a yes-no-else question with no printed follow-up takes two, its
// tick column and the "if not" column beside it; any other takes one.
const spanOf = (q) => (q.type === 'yes-no-else' && !q.elseText ? 2 : 1);

// The printed column headings each question of a row or box sits under. The questions fill the
// rightmost columns in order, after the point and its reason, each taking spanOf columns.
// Questions that outnumber the columns are stacked in one column, so each sits under the last.
function columnsFor(questions, columns) {
  const widths = questions.map(spanOf);
  const total = widths.reduce((sum, width) => sum + width, 0);
  if (total > columns.length) return widths.map((width) => columns.slice(-width));
  let at = columns.length - total;
  return widths.map((width) => columns.slice(at, (at += width)));
}

// The questions of a method a business answers, in the data's order, each with what the
// worksheet prints above it so that it is not read out of context, in this order:
// - its box's heading, when the box has one;
// - a CHECK IT box's text, when the question has no row point of its own;
// - a lead-in row: a row that asks nothing and whose point ends with a colon ("Use disposable
//   cloths or paper towels for the following jobs:") is shown with every question of the rows
//   after it in its box, up to the next row that asks nothing;
// - the row's safety point, whole. A row with no point continues the spanning cell above it when
//   its question prints no text of its own (MG-02's "Maintenance" spans two rows on page 67), so
//   it is shown the nearest point above it in its box. A row with no point whose question prints
//   its own text is a prompt of its own (CH-02 page 43, CH-03 page 45: "If you have another
//   method ..."), and the row above is a different method, so it is shown nothing;
// - a lead-in within the row or box: the latest note or question before it whose text ends with
//   a colon ("Fridge:", "7. If you have another method of defrosting, write the details here:"),
//   until the next one. Where a row or box holds two or more such lead-ins, each heading a group
//   of questions of one type, a question after the last group whose type differs from that
//   group's is outside every group (CH-01-Q20 on page 41, printed below both groups), so it is
//   shown none of them; it is shown instead the note printed just before the first lead-in, when
//   that note ends with "?", as the question the groups answer;
// - the notes printed before it in its row or box since the question before, in printed order;
// - for a question that prints no text, the column headings it sits under.
// A note asks nothing, so it is never listed itself.
function methodQuestions(method) {
  const listed = [];
  const endsWithColon = (text) => /:\s*$/.test(text ?? '');
  for (const block of method.blocks) {
    let leadInRow = null;
    let cell = null; // the nearest point above, in this box
    for (const { questions, row } of holdersOf(block)) {
      const asked = questions.filter((q) => q.type !== 'note');
      if (row && asked.length === 0) leadInRow = endsWithColon(row.point) ? row.point : null;
      const point = row?.point ?? (row && asked.some((q) => q.text === '') ? cell : null);
      if (row?.point) cell = row.point;
      const columns = columnsFor(questions, block.columns ?? []);
      const leads = questions.map((q, i) => (endsWithColon(q.text) ? i : -1)).filter((i) => i >= 0);
      const lastLead = leads.length >= 2 ? leads.at(-1) : -1;
      const groupType = questions.slice(lastLead + 1).find((q) => q.type !== 'note')?.type;
      const before = questions[leads[0] - 1];
      const groupsAnswer = before?.type === 'note' && /\?\s*$/.test(before.text) ? before : null;
      let outside = false;
      let notes = [];
      let leadIn = null;
      questions.forEach((question, i) => {
        if (question.type === 'note') {
          notes.push(question);
          if (endsWithColon(question.text)) leadIn = question;
          return;
        }
        if (lastLead >= 0 && i > lastLead && question.type !== groupType) outside = true;
        const context = [];
        if (block.heading) context.push(block.heading);
        if (block.kind === 'check-it' && block.text && !row?.point) context.push(block.text);
        if (row && leadInRow) context.push(leadInRow);
        if (point) context.push(point);
        if (outside && groupsAnswer) context.push(groupsAnswer.text);
        else if (!outside && leadIn && !notes.includes(leadIn)) context.push(leadIn.text);
        context.push(...notes.map((note) => note.text));
        listed.push({ question, context, columns: question.text === '' ? columns[i] : [] });
        notes = [];
        if (endsWithColon(question.text)) leadIn = question;
      });
    }
  }
  return listed;
}
const everyQuestion = (method) => method.blocks.flatMap(holdersOf).flatMap((holder) => holder.questions);

// A paragraph that Markdown reads as a list item, such as the pack's "1. Clean: ...".
const LIST_ITEM = /^(\d{1,9}[.)]|[-*+])\s/;

// The lines printed after ">" above a question: its context, then its own text (or, when it has
// none, its column headings), ending with the form of answer the helper reads. Every paragraph of
// the pack's text is printed whole on a line of its own: a cut-off FSA sentence is a misquote. A
// paragraph that starts like a list item, after one that does not, gets an empty ">" line before
// it, so Markdown keeps it apart from the paragraph above without a word of the pack changing.
function promptLines({ question, context, columns }) {
  const asked = question.text !== '' ? question.text.split('\n') : [columns.join(' / ')];
  let hint = HINTS[question.type];
  if (question.type === 'yes-no-else' && question.elseText) hint += ` ${question.elseText}`;
  const last = asked.length - 1;
  asked[last] = asked[last] === '' ? hint : `${asked[last]}  ${hint}`;
  const lines = [...context.flatMap((text) => text.split('\n')), ...asked].map((line) => line.trimEnd());
  return lines.flatMap((line, i) =>
    (i > 0 && LIST_ITEM.test(line) && lines[i - 1] !== '' && !LIST_ITEM.test(lines[i - 1]) ? ['', line] : [line]));
}
const profilePrompt = (question) => promptLines({ question, context: [], columns: [] });

// Writes a field: its first line after the name, every further line indented by two spaces. A blank
// line inside a value (only a written procedure has one) is written blank.
const fieldLines = (name, value = '') => {
  const [first, ...rest] = String(value).split('\n');
  return [first === '' ? `${name}:` : `${name}: ${first}`, ...rest.map((line) => (line === '' ? '' : `  ${line}`))];
};

// Writes a worksheet from a parsed one, in the data's order, with every `>` line written afresh
// from the data and every field kept as it was read. A method or question the parsed worksheet
// lacks is written blank. `parseWorksheet` reads back what this writes, unchanged.
// Throws on a parsed worksheet with problems: the parse set aside whatever it could not read (a
// repeated question, a line it did not understand, a comment), so writing it would lose that.
export function emitWorksheet(parsed, data) {
  const { section, problems = [] } = parsed;
  if (problems.length) {
    const [first] = problems;
    throw new Error(`the worksheet has ${problems.length} problem${problems.length === 1 ? '' : 's'}, so it is not ` +
      `rewritten: what could not be read would be lost. The first, at line ${first.line}: ${first.message}`);
  }
  if (!WORKSHEET_SECTIONS.includes(section)) throw new Error(`no worksheet for section ${section}`);
  if (parsed.data !== DATA_ID) throw new Error(`the worksheet answers data ${parsed.data}, not ${DATA_ID}`);
  if (SECTION_IDS.includes(section) && !data.sections.has(section)) throw new Error(`the data has no ${section}.json`);
  if (isListSection(section)) return LIST_WORKSHEETS.emit(parsed, data);
  const comment = (lines) => ['<!--', ...lines, '-->'];
  const answerBlock = (question, prompt, record = { state: 'unanswered' }) => [
    `### ${question.id}`,
    '',
    ...prompt.map((line) => (line === '' ? '>' : `> ${line}`)),
    ...ANSWER_FIELDS.flatMap((field) => fieldLines(field, record[key(field)]))
  ];
  const blocks = [[
    `# Answers: ${worksheetTitle(section, data)}`,
    '',
    `<!-- uk-food-answers ${WORKSHEET_VERSION} data=${DATA_ID} section=${section} -->`,
    ...(LINT_EXCEPTIONS[section] ?? []).flatMap(([rule, reason]) =>
      [`<!-- markdownlint-disable ${rule} -->`, `<!-- ${rule}: ${reason} -->`])
  ]];
  blocks.push(comment(guidanceFor(section, data)));
  if (section === 'own') {
    for (const entry of parsed.entries.values()) {
      blocks.push([`## ${entry.id}${entry.title ? ` ${entry.title}` : ''}`, '',
        ...OWN_FIELDS.flatMap((field) => fieldLines(field, entry[key(field)]))]);
    }
  } else if (section === 'profile') {
    for (const question of PROFILE_QUESTIONS) {
      blocks.push(answerBlock(question, profilePrompt(question), parsed.answers.get(question.id)));
    }
  } else {
    for (const method of data.sections.get(section).methods) {
      const record = parsed.methods.get(method.id) ?? { status: 'applies' };
      blocks.push([`## ${method.id} ${sentenceCase(method.title)}`, '',
        ...METHOD_FIELDS.flatMap((field) => fieldLines(field, record[key(field)]))]);
      for (const asked of methodQuestions(method)) {
        blocks.push(answerBlock(asked.question, promptLines(asked), parsed.answers.get(asked.question.id)));
      }
    }
  }
  return `${blocks.map((block) => block.join('\n')).join('\n\n')}\n`;
}

export function blankWorksheet(section, data) {
  return emitWorksheet(
    { data: DATA_ID, section, methods: new Map(), answers: new Map(), entries: new Map(), problems: [] }, data
  );
}

const MARKER = /^<!--\s*uk-food-answers\s+(\S+)\s+data=(\S+)\s+section=(\S+)\s*-->$/;
// A field line: a name, then the value after a colon. Hand-edited slips, each read as meant:
// the name may be in any letter case (answer:), and may have spaces or tabs before the colon
// (Answer :); spaces and tabs at the ends of lines, Windows line endings and a byte order mark
// at the start of the file are ignored. A value continues on a line that starts with a space or a
// tab (a tab is read as the indent it looks like) and follows its field's line, or another such
// line, directly. A blank line ends the value, so an indented line after one is reported and
// credited to no question; so is an indented line that is itself a field or a heading, and a later
// line that is not indented and is not a field. Nothing is added to a value unseen.
//
// One field is read differently, because it holds a business's own written procedure, which must
// reach the document exactly as it was written: Supplied-text (VERBATIM_FIELD). While it is the open
// field, every indented line is taken as written, whatever it starts with: a line that looks like a
// field, a heading, a list item or a table row is part of the procedure. Only the indent that
// carries the value on is taken off (two spaces, or a tab, or a single space), so any further
// indentation is kept. A blank line is kept when more of the procedure follows it, which is when the
// next line that is not blank is indented; otherwise it ends the value as for any field. Spaces at
// the ends of lines are dropped as everywhere, and the first line, on the field's own line, is
// trimmed. A comment mark or an unseen character in it is still refused.
// (The s flag: a value is the rest of its line whatever it holds, a line separator included, so that
// an unseen character in it is reported as one and the line is not read as something else.)
const FIELD = /^([A-Za-z][A-Za-z-]*)[ \t]*:(.*)$/s;
const FIELD_NAMES = new Map([...METHOD_FIELDS, ...ANSWER_FIELDS, ...OWN_FIELDS].map((f) => [f.toLowerCase(), f]));
// The fields each kind of block of these worksheets takes, and what a message calls such a block.
const KINDS = {
  method: { fields: METHOD_FIELDS, called: 'a method' }, question: { fields: ANSWER_FIELDS, called: 'a question' },
  entry: { fields: OWN_FIELDS, called: 'an own entry' }
};

// Reads an answer as its question's type. Returns the value a document may print, or an error.
function readValue(question, answer) {
  switch (question.type) {
    case 'yes-no':
    case 'tick':
      return /^(yes|no)\.?$/i.test(answer) ? { value: answer.replace(/\.$/, '').toLowerCase() } : { error: 'is not yes or no' };
    case 'yes-no-else':
      if (/^yes\.?$/i.test(answer)) return { value: 'yes' };
      if (NOT_AN_INSTEAD.test(answer)) {
        return { error: 'does not say what you do instead: write yes, or say what you do instead, or say why it does not apply' };
      }
      return { value: answer };
    case 'nation': {
      const nation = standard(answer.replace(/\s+/g, ' '), NATIONS);
      return NATIONS.includes(nation) ? { value: nation } : { error: 'is not England, Wales, Scotland, Northern Ireland or other' };
    }
    case 'list':
      return { value: answer.split('\n') };
    default:
      return { value: answer };
  }
}

// Begins reading a worksheet, for readWorksheet and for the list worksheets' reader in uk-food-lists.mjs:
// its lines, and its marker line read and checked. Returns the reading: { parsed, layout, lines, report,
// finish, today, markerAt, markerLine, section, stopped }. `report(line, message, block)` records a problem and,
// given a block, marks it faulty; `finish()` gives { parsed, layout } with the problems in line order (see
// readWorksheet for both). `stopped` is true when the marker line stops the reading: there is none, it is
// not understood, or it names another version, other data or a section that has no worksheet. The reader
// sets `parsed.section` itself, once it knows the data holds what the section needs.
// `today` is the date, written YYYY-MM-DD, that a rule about dates compares a value with. It is the caller's
// (`options.today`): the helper's commands give this computer's date, and nothing here reads the clock, so
// what a worksheet reads as does not change with the day it is read on. It is null when the caller gives none.
export function beginReading(text, { today = null } = {}) {
  const problems = [];
  const parsed = { data: null, section: null, methods: new Map(), answers: new Map(), entries: new Map(), problems };
  const report = (line, message, block = null) => {
    problems.push({ line, message });
    if (block) block.faulty = true;
  };
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r\n|\n|\r/);
  const layout = { lines, guidance: null, noGuidance: false, marker: 0, prompts: new Map(), wording: [] };
  const finish = () => {
    problems.sort((a, b) => a.line - b.line);
    return { parsed, layout };
  };
  const stopped = { parsed, layout, lines, report, finish, today, stopped: true };

  const markerAt = lines.findIndex((line) => /^<!--.*uk-food-answers/.test(line.trim()));
  if (markerAt < 0) {
    report(1, 'there is no uk-food-answers marker line, so this is not a worksheet the helper can read');
    return stopped;
  }
  for (let i = 0; i < markerAt; i++) {
    const line = lines[i].trim();
    if (line !== '' && !line.startsWith('# ')) report(i + 1, 'text before the uk-food-answers marker line is not read');
  }
  const markerLine = markerAt + 1;
  layout.marker = markerLine;
  const marker = MARKER.exec(lines[markerAt].trim());
  if (!marker) {
    report(markerLine, 'the marker line is not understood: it reads <!-- uk-food-answers 1.0 data=... section=... -->');
    return stopped;
  }
  const [, version, dataId, section] = marker;
  parsed.data = dataId;
  if (version !== WORKSHEET_VERSION) {
    report(markerLine, `this worksheet is version ${version}; the helper reads version ${WORKSHEET_VERSION}`);
    return stopped;
  }
  if (dataId !== DATA_ID) {
    report(markerLine, `this worksheet answers data ${dataId}, but the helper's data is ${DATA_ID}`);
    return stopped;
  }
  if (!WORKSHEET_SECTIONS.includes(section)) {
    report(markerLine, `section ${section} is not one of ${WORKSHEET_SECTIONS.join(', ')}`);
    return stopped;
  }
  return { parsed, layout, lines, report, finish, today, markerAt, markerLine, section, stopped: false };
}

// Pass 1 of reading a worksheet, the same for every worksheet: the lines after the marker into blocks of
// fields, read as the comment at FIELD says, with the guidance comment compared with `guidance` (every line
// of the comment this helper prints, its marks included) and noted in the reading's layout as readWorksheet
// says. What differs from one worksheet to another is given:
// - heading({ title, id, rest, at, raw }, { seen, open, hidden }): what a "## " heading opens: { block,
//   method } (`method` the method its questions belong to, or null), having put the block in `seen`; or
//   null, having reported why, when the heading opens nothing, so that the lines under it are read and set
//   aside. `id` is its first word in capitals and `rest` the words after it. `open(kind, id, line, extra)`
//   makes a block; `hidden(raw, at, block)` reports an unseen character in a line that holds a value.
// - asked and notes: the questions a "### " heading may name, each { owner, question, prompt }, and the
//   identifiers of the pack's notes. A list worksheet has neither.
// - notAQuestion(id): what a "### " heading that names neither is told, given its first word in capitals.
// - names: every field name this worksheet knows, from its name in small letters. An indented line that
//   starts with one is a field out of place, not a value carried on.
// - kinds: for each kind of block that takes fields, { fields, called }: the fields it takes, and what a
//   message calls such a block.
// Returns `seen`: { method, question, entry }, each a Map from identifier to its block, and anything else
// `heading` keeps there. Each block is { kind, id, line, fields, faulty }: `fields` maps each field read to
// { line, lines }, the line it starts on and its value's lines.
export function readBlocks({ lines, layout, report, markerAt }, {
  guidance, asked = new Map(), notes = new Set(), names, kinds, heading, notAQuestion = (id) => `${id} is not a question in this worksheet`
}) {
  // A block that is reported as it opens (an unknown or repeated heading) is read and set aside, so its
  // lines are not reported again.
  const seen = { method: new Map(), question: new Map(), entry: new Map() };
  const open = (kind, id, line, extra = {}) => ({ kind, id, line, fields: new Map(), faulty: false, ...extra });
  let guidanceChecked = false;
  let method = null;
  let block = null;
  let field = null; // the field an indented line continues
  let comment = null; // the lines, { at, text }, of a comment not yet closed
  let provenance = false; // inside a "## Build Provenance" section another tool appended: not read
  // A line that the worksheet would read if it were not in a comment: a heading or a field.
  const worksheetLine = (text) => {
    const match = FIELD.exec(text.trim());
    return /^#{2,3}[ \t]+\S/.test(text.trim()) || Boolean(match && names.has(match[1].toLowerCase()));
  };
  // Nothing in a comment is read. Text after a comment's end on the same line is reported, never
  // dropped. The first comment over several lines, when it stands above every heading, is the
  // helper's guidance; where it differs from what the helper writes, each line of it that the helper
  // does not print is noted in the layout (or its first line, when lines are only missing or there
  // twice), since someone may have written an answer or an own entry inside it. A worksheet with no
  // such comment has lost its guidance (noGuidance), which upgrade-worksheet puts back; a comment
  // further down is a remark, wherever the guidance is. Any other comment, except the lint comments, that holds a line of the
  // worksheet is reported: a plain remark is allowed, a commented-out answer or entry is not lost
  // without a word.
  const closeComment = (lines) => {
    const last = lines.at(-1);
    const end = last.text.indexOf('-->', lines.length === 1 ? 4 : 0);
    if (last.text.slice(end + 3).trim()) report(last.at, 'text after the end of a comment ("-->") is not read', block);
    if (lines.length > 1 && !guidanceChecked && !block && !method) {
      guidanceChecked = true;
      layout.guidance = { from: lines[0].at, to: last.at };
      if (lines.length !== guidance.length || lines.some((line, i) => line.text !== guidance[i])) {
        const foreign = lines.filter((line) => !guidance.includes(line.text)).map((line) => line.at);
        layout.wording.push(...(foreign.length ? foreign : [lines[0].at]));
      }
      return;
    }
    const inner = lines.map(({ at, text }, i) => {
      const upTo = i === lines.length - 1 ? end : text.length;
      return { at, text: text.slice(i === 0 ? 4 : 0, upTo) };
    });
    if (/^\s*markdownlint-/.test(inner[0].text)) return;
    const held = inner.find((line) => worksheetLine(line.text));
    if (held) {
      report(held.at, 'nothing inside a comment is read, and this comment holds a line of the worksheet: take the comment marks away for it to be read, or delete it', block);
    }
  };
  // A "## Build Provenance" section another tool appended is not read. It ends at the tool's end
  // marker or at any other ## heading (read as usual: an unknown one is reported), and a question
  // heading of this worksheet resumes reading. So nothing after it is left unread without a word.
  const endsProvenance = (line) => {
    const heading = /^(#{2,3})[ \t]+(\S+)/.exec(line);
    if (heading) return heading[1].length === 2 || asked.has(heading[2].toUpperCase());
    return /^<!--\s*arckit-provenance:end\s*-->$/.test(line.trim());
  };
  // Adds a line to a field's value. A comment in a value would be hidden once a document is
  // rendered, so the document would say something no reader could see: reported, value not used.
  // So would a character that cannot be seen or that turns the text around (UNSEEN), looked for in
  // the whole line as written, `raw`, since trimming would drop one at either end unseen.
  const take = (target, text, at, raw) => {
    target.lines.push(text);
    if (!target.block) return;
    if (text.includes('<!--')) {
      report(at, 'a comment inside a value would be hidden once the document is rendered, so the value is not used: take the comment out', target.block);
    }
    hidden(raw, at, target.block);
  };
  // Reports any UNSEEN character in a line that holds a value: the value is not used.
  const hidden = (raw, at, owner) => {
    const found = unseenIn(raw);
    if (!found) return;
    const one = !found.includes(' and ');
    report(at, `this line holds ${found}: ${one ? 'a character that cannot be seen or that changes' : 'characters that cannot be seen or that change'} ` +
      'the direction of the text, so a document could show something other than what is written. The value is not used: ' +
      `delete ${one ? 'the character' : 'them'}, or type the line again`, owner);
  };
  for (let i = markerAt + 1; i < lines.length; i++) {
    const at = i + 1;
    const line = lines[i].trimEnd();
    if (comment) {
      comment.push({ at, text: line });
      if (line.includes('-->')) {
        closeComment(comment);
        comment = null;
      }
      continue;
    }
    if (line === '') {
      // A blank line ends a field: a continued line follows its field directly. In a written procedure
      // it is part of the text when more of the procedure follows.
      if (field?.verbatim) {
        let next = i + 1;
        while (next < lines.length && lines[next].trim() === '') next++;
        if (next < lines.length && /^[ \t]/.test(lines[next])) {
          for (let blank = i; blank < next; blank++) field.lines.push('');
          i = next - 1;
          continue;
        }
      }
      field = null;
      continue;
    }
    if (provenance) {
      if (!endsProvenance(line)) continue;
      provenance = false;
      if (line.trim().startsWith('<!--')) continue;
    }
    if (/^[ \t]/.test(line) && field?.verbatim) {
      take(field, line.replace(/^(?: {2}|\t| )/, ''), at, lines[i]);
      continue;
    }
    if (/^[ \t]/.test(line)) {
      const text = line.trim();
      const looks = FIELD.exec(text);
      if ((looks && names.has(looks[1].toLowerCase())) || /^#{1,6}[ \t]/.test(text)) {
        report(at, `a ${looks ? 'field' : 'heading'} must start at the beginning of the line: this indented line is not read`, block);
        field = { lines: [] };
      } else if (field?.empty) {
        if (field.block) report(at, `this indented line follows an empty ${field.name}: line, so it is not read: a value starts on its field's own line, after the colon`, block);
        field = { lines: [] };
      } else if (field) {
        take(field, text, at, lines[i]);
      } else {
        report(at, 'this indented line does not continue a field: a continued line follows its field\'s line directly, with no blank line between, and starts with two spaces', block);
      }
      continue;
    }
    field = null;
    if (line.startsWith('<!--')) {
      comment = [{ at, text: line }];
      if (line.includes('-->', 4)) {
        closeComment(comment);
        comment = null;
      }
      continue;
    }
    const headingLine = /^(#+)[ \t]+(\S.*)$/s.exec(line);
    if (headingLine && headingLine[1].length === 2) {
      const title = headingLine[2].trim();
      provenance = /^build provenance$/i.test(title);
      method = block = null;
      if (provenance) continue;
      const [first] = title.split(/\s+/);
      const id = first.toUpperCase();
      const rest = title.slice(first.length).trim();
      const opened = heading({ title, id, rest, at, raw: lines[i] }, { seen, open, hidden });
      if (opened) {
        ({ block, method } = opened);
        continue;
      }
      method = block = open('set-aside', id, at);
      continue;
    }
    if (headingLine && headingLine[1].length === 3) {
      const [first, ...after] = headingLine[2].trim().split(/\s+/);
      const id = first.toUpperCase();
      const known = asked.get(id);
      if (!known) {
        report(at, notes.has(id) ? `${id} is a note in the pack, not a question to answer` : notAQuestion(id));
        block = open('set-aside', id, at);
      } else if (seen.question.has(id)) {
        report(at, `${id} appears more than once; only the first is read`);
        block = open('set-aside', id, at);
      } else {
        block = open('question', id, at, { prompt: known.prompt });
        seen.question.set(id, block);
        layout.prompts.set(id, { at: [], foreign: [], now: known.prompt });
        if (after.length) {
          report(at, `text after ${id} on its heading is not read: "${after.join(' ')}". Put any answer after Answer:`, block);
        }
        if (known.owner && method?.id !== known.owner) {
          report(at, `${id} belongs to ${known.owner}, but is not under ${known.owner}'s heading`, block);
        }
      }
      continue;
    }
    if (line.startsWith('>')) {
      if (block?.kind === 'question') {
        // Only a changed or added line is noted: someone may have typed an answer on it. A deleted
        // question line loses nothing.
        const prompt = layout.prompts.get(block.id);
        prompt.at.push(at);
        if (!block.prompt.includes(line.replace(/^>[ \t]?/, ''))) {
          prompt.foreign.push(at);
          layout.wording.push(at);
        }
      } else if (block?.kind !== 'set-aside') {
        report(at, 'a line starting > outside a question is not read', block);
      }
      continue;
    }
    const match = FIELD.exec(line);
    if (match && block?.kind === 'set-aside') {
      field = { lines: [] };
    } else if (match) {
      const name = names.get(match[1].toLowerCase());
      const kind = block && Object.hasOwn(kinds, block.kind) ? kinds[block.kind] : null;
      field = { line: at, lines: [], block: null, name: match[1], empty: match[2].trim() === '' };
      if (!kind) report(at, `${match[1]} is not read: a field belongs under a heading`);
      else if (!kind.fields.includes(name)) report(at, `${match[1]} is not a field of ${kind.called}: the fields are ${kind.fields.join(', ')}`, block);
      else if (block.fields.has(name)) report(at, `${name} is given twice in ${block.id}; only the first is read`, block);
      else {
        field.block = block;
        // A procedure starts on its field's own line like any value, and is then read as written.
        field.verbatim = name === VERBATIM_FIELD && !field.empty;
        block.fields.set(name, field);
      }
      if (match[2].trim() !== '') take(field, match[2].trim(), at, lines[i]);
    } else {
      report(at, 'line not understood: a field starts with its name and a colon, and a value carries on to a line that starts with two spaces', block);
    }
  }
  if (comment) report(comment[0].at, 'a comment that starts here is never closed, so nothing after it is read');
  layout.noGuidance = !guidanceChecked && !comment;
  return seen;
}

// What pass 2 of reading a worksheet uses to turn blocks into records, the same for every worksheet, each
// reporting through `report`: get(block, name), a field's value ('' when it is empty or not there);
// lineOf(block, name), the line it starts on, or the block's heading line; needs(block, id, fields, why),
// which reports each of `fields` that is empty; and checkState(block, id, state, words), which checks
// State and, for a state that is not unanswered, By and On, and reports any of `words` given while State
// is unanswered.
export function blockTools(report) {
  const get = (b, name) => b?.fields.get(name)?.lines.join('\n') ?? '';
  const lineOf = (b, name) => b.fields.get(name)?.line ?? b.line;
  const needs = (b, id, fields, why) => {
    for (const name of fields) if (!get(b, name)) report(lineOf(b, name), `${id} is ${why}, so it needs ${name}`, b);
  };
  const checkState = (b, id, state, words) => {
    if (state === '') report(lineOf(b, 'State'), `${id}: State is empty: write unanswered, proposed or confirmed`, b);
    else if (!STATES.includes(state)) report(lineOf(b, 'State'), `${id}: State "${state}" is not unanswered, proposed or confirmed`, b);
    else if (state === 'unanswered') {
      const given = words.filter((name) => get(b, name));
      if (given.length) report(lineOf(b, given[0]), `${id}: ${given.join(', ')} given, but State is unanswered: set State to proposed or confirmed, or clear ${given.length > 1 ? 'them' : 'it'}`, b);
    } else {
      if (state === 'confirmed') needs(b, id, ['By', 'On'], 'confirmed');
      const on = get(b, 'On');
      if (on && !isIsoDate(on)) report(lineOf(b, 'On'), `${id}: On "${on}" is not a date written YYYY-MM-DD`, b);
    }
  };
  return { get, lineOf, needs, checkState };
}

// Reads a worksheet against the data (what loadData returns), as { parsed, layout }. Never throws on
// what a person or tool has written: every fault is a { line, message } problem, and an answer with a
// problem in its block is not used. `answered` is true only for a confirmed answer with no problem,
// under a method that is not marked not-relevant: nothing else counts as answered anywhere.
// Two kinds of line are the tool's own, printed by emitWorksheet and never read: the guidance comment
// and the lines starting > above a question. Where one of them is not what this helper prints, the
// worksheet was made by a different version of the overlay, or someone typed there; the two cannot be
// told apart. That is not reported here line by line: `layout` holds where those lines are, for
// parseWorksheet to report once and upgradeWorksheet to replace. It is { lines, guidance, prompts,
// wording }: the worksheet's lines; the guidance comment's first and last line numbers, or null; for
// each question read, the line numbers of its > lines (`at`), those of them this helper does not
// print (`foreign`) and what it does print (`now`); and the line number of every line of either kind
// that is not this helper's wording.
// A list worksheet is read by its own module's reader (see addListWorksheets), from the same beginning.
// `options` is the caller's: { today } (see beginReading).
function readWorksheet(text, data, options = {}) {
  const reading = beginReading(text, options);
  if (reading.stopped) return reading.finish();
  const { parsed, report, finish, markerLine, section } = reading;
  if (isListSection(section)) return LIST_WORKSHEETS.read(reading, data);
  const methods = SECTION_IDS.includes(section) ? data.sections.get(section)?.methods : null;
  if (SECTION_IDS.includes(section) && !Array.isArray(methods)) {
    report(markerLine, `there is no ${section}.json in the data, so this ${section} worksheet cannot be read`);
    return finish();
  }
  parsed.section = section;

  // Every question this worksheet asks, with its method and its prompt; and the pack's notes.
  const asked = new Map();
  const notes = new Set();
  for (const method of methods ?? []) {
    for (const entry of methodQuestions(method)) {
      asked.set(entry.question.id, { owner: method.id, question: entry.question, prompt: promptLines(entry) });
    }
    for (const question of everyQuestion(method)) if (question.type === 'note') notes.add(question.id);
  }
  if (section === 'profile') {
    for (const question of PROFILE_QUESTIONS) asked.set(question.id, { owner: null, question, prompt: profilePrompt(question) });
  }
  const methodIds = new Set((methods ?? []).map((method) => method.id));

  // Pass 1: lines into blocks. A block is a method's status, a question or an own entry.
  const titles = new Map((methods ?? []).map((m) => [m.id, m.title]));
  const sameTitle = (a, b) => a.replace(/\s+/g, ' ').toLowerCase() === b.replace(/\s+/g, ' ').toLowerCase();
  const seen = readBlocks(reading, {
    guidance: ['<!--', ...guidanceFor(section, data), '-->'], asked, notes, names: FIELD_NAMES, kinds: KINDS,
    heading: ({ title, id, rest, at, raw }, { seen: found, open, hidden }) => {
      if (section === 'own') {
        if (!/^OWN-\d{2}$/.test(id)) report(at, `${id} is not an own entry: number entries OWN-01, OWN-02 and so on`);
        else if (found.entry.has(id)) report(at, `${id} appears more than once; only the first is read`);
        else {
          const block = open('entry', id, at, { title: rest });
          found.entry.set(id, block);
          // The title is printed in the documents, so it is a value like any other.
          hidden(raw, at, block);
          return { block, method: null };
        }
      } else if (methodIds.has(id)) {
        if (found.method.has(id)) report(at, `${id} appears more than once; only the first is read`);
        else {
          const block = open('method', id, at);
          found.method.set(id, block);
          // The title is rewritten from the data, so anything else written on the heading is lost.
          if (!sameTitle(rest, titles.get(id))) {
            report(at, `the heading of ${id} reads "${rest}", but the method is "${sentenceCase(titles.get(id))}": text on a heading is not read`, block);
          }
          return { block, method: block };
        }
      } else {
        report(at, section === 'profile'
          ? `the profile worksheet has no ## headings: "## ${title}" is not read`
          : `"## ${title}" is not a safe method of ${section}`);
      }
      return null;
    }
  });

  // Pass 2: blocks into records, checked field by field.
  const { get, lineOf, needs, checkState } = blockTools(report);
  // Reads a question's block. `methodFaulty` is true when its method's status has a problem: no
  // answer under a method whose status cannot be read is used.
  const readAnswer = (b, question, ignored, methodFaulty = false) => {
    const record = {
      id: question.id, type: question.type, line: b?.line ?? null, answer: get(b, 'Answer'),
      state: b ? standard(get(b, 'State'), STATES) : 'unanswered', by: get(b, 'By'), on: get(b, 'On'),
      source: get(b, 'Source'), value: null, answered: false
    };
    if (!b || ignored) return record;
    checkState(b, question.id, record.state, ['Answer', 'By', 'On', 'Source']);
    if (record.state === 'proposed' || record.state === 'confirmed') {
      needs(b, question.id, record.state === 'proposed' ? ['Answer', 'Source'] : ['Answer'], record.state);
    }
    if (record.answer && record.state !== 'unanswered') {
      // A hint copied from the prompt into the answer, alone on a line, is not an answer.
      const plain = (text) => text.trim().replace(/\s+/g, ' ').replace(/\.+$/, '').toLowerCase();
      const hints = [...HINT_TEXTS, ...(question.elseText ? [`${HINTS['yes-no-else']} ${question.elseText}`, question.elseText] : [])]
        .map(plain);
      const read = record.answer.split('\n').some((line) => hints.includes(plain(line)))
        ? { error: 'is the hint printed after the question, not an answer: write the business\'s own answer' }
        : readValue(question, record.answer);
      if (read.error) report(lineOf(b, 'Answer'), `${question.id}: Answer "${record.answer}" ${read.error}`, b);
      else record.value = read.value;
    }
    record.answered = record.state === 'confirmed' && !b.faulty && !methodFaulty;
    return record;
  };

  for (const methodData of methods ?? []) {
    const b = seen.method.get(methodData.id);
    if (!b) report(markerLine, `${methodData.id} (${sentenceCase(methodData.title)}) is missing: every safe method needs its heading and Status`);
    const record = { id: methodData.id, line: b?.line ?? null, answers: new Map() };
    for (const name of METHOD_FIELDS) record[key(name)] = get(b, name);
    record.status = b ? standard(record.status, STATUSES) : 'applies';
    if (b && record.status === '') report(lineOf(b, 'Status'), `${methodData.id}: Status is empty: write applies, adapted or not-relevant`, b);
    else if (b && !STATUSES.includes(record.status)) report(lineOf(b, 'Status'), `${methodData.id}: Status "${record.status}" is not applies, adapted or not-relevant`, b);
    else if (b) {
      const uses = STATUS_USES[record.status];
      needs(b, methodData.id, uses, record.status);
      for (const name of METHOD_FIELDS.slice(1)) {
        if (!uses.includes(name) && get(b, name)) {
          report(lineOf(b, name), `${methodData.id}: ${name} is filled in, but Status is ${record.status}, which does not use it: change Status or clear ${name}`, b);
        }
      }
    }
    const ignored = record.status === 'not-relevant';
    let reported = false;
    for (const { question } of methodQuestions(methodData)) {
      const qb = seen.question.get(question.id);
      if (!qb) report(b?.line ?? markerLine, `${question.id} is missing from ${methodData.id}`);
      const answer = readAnswer(qb, question, ignored, Boolean(b?.faulty));
      if (ignored && qb && !reported && (answer.answer || !['', 'unanswered'].includes(answer.state))) {
        report(lineOf(qb, answer.answer ? 'Answer' : 'State'), `${methodData.id}: answers given for a method marked not relevant are not read`);
        reported = true;
      }
      record.answers.set(question.id, answer);
      parsed.answers.set(question.id, answer);
    }
    parsed.methods.set(methodData.id, record);
  }

  if (section === 'profile') {
    for (const question of PROFILE_QUESTIONS) {
      const b = seen.question.get(question.id);
      if (!b) report(markerLine, `${question.id} is missing`);
      parsed.answers.set(question.id, readAnswer(b, question, false));
    }
  }

  for (const b of seen.entry.values()) {
    const record = { id: b.id, title: b.title, line: b.line };
    for (const name of OWN_FIELDS) record[key(name)] = get(b, name);
    record.kind = standard(record.kind, OWN_KINDS);
    record.state = standard(record.state, STATES);
    record.ehReview = standard(record.ehReview, ['pending']);
    if (!record.title) report(b.line, `${b.id} has no title: write one after ${b.id} on its heading`, b);
    // An unanswered entry holds what has been given so far, as it was given: its fields are checked
    // when it is proposed or confirmed. It is never shown in a document or counted as confirmed.
    const held = record.state === 'unanswered';
    if (!held) {
      if (record.kind && !OWN_KINDS.includes(record.kind)) report(lineOf(b, 'Kind'), `${b.id}: Kind "${record.kind}" is not additional or special-process`, b);
      // A special process names the pack's process or food it covers, kept in the pack's spelling.
      if (record.process && record.kind !== 'special-process') {
        report(lineOf(b, 'Process'), `${b.id}: Process is only for an entry of kind special-process: clear it, or set Kind to special-process`, b);
      } else if (record.process && !extraCareName(record.process)) {
        report(lineOf(b, 'Process'), `${b.id}: Process "${record.process}" is not one of the special processes and foods the pack ` +
          `names, which are: ${EXTRA_CARE_NAMES.join('; ')}`, b);
      } else if (record.process) record.process = extraCareName(record.process);
      if (record.limit && !record.limitSource) report(lineOf(b, 'Limit-source'), `${b.id} has a Limit, so it needs a Limit-source saying where the figure comes from`, b);
      const review = /^(\d{4}-\d{2}-\d{2})\s+\S/.exec(record.ehReview);
      if (record.ehReview && record.ehReview !== 'pending' && !(review && isIsoDate(review[1]))) {
        report(lineOf(b, 'EH-review'), `${b.id}: EH-review is pending, or a date written YYYY-MM-DD and the outcome`, b);
      }
    }
    // A name and a date belong to a confirmation, so an unanswered entry has neither.
    checkState(b, b.id, record.state, ['By', 'On']);
    if (record.state === 'proposed' || record.state === 'confirmed') {
      needs(b, b.id, ['Kind'], record.state);
      if (OWN_KINDS.includes(record.kind)) needs(b, b.id, KIND_NEEDS[record.kind], `${record.state} and ${record.kind}`);
      if (record.state === 'proposed') needs(b, b.id, ['Source'], 'proposed');
    }
    record.answered = record.state === 'confirmed' && !b.faulty;
    parsed.entries.set(b.id, record);
  }
  return finish();
}

// What is not this helper's in a worksheet's own wording, in a few words: how many lines differ, and
// whether its guidance comment is missing altogether. '' when nothing is. A list worksheet's wording is
// named as its module names it (worksheetTerms): it has no questions, so only its guidance can differ.
const otherWording = ({ wording, noGuidance }, section, where = false) => {
  const n = wording.length;
  const whose = worksheetTerms(section).wording ?? `${noGuidance ? '' : 'guidance or '}question wording`;
  const lines = n ? `${counted(n, 'line', 'lines')} of its ${whose} ${isAre(n)} not what this ` +
    `version prints${where ? `, the first at line ${Math.min(...wording)}` : ''}` : '';
  return noGuidance ? `its guidance comment is missing${n ? `, and ${lines}` : ''}` : lines;
};
// What the strict parser says, once for the whole worksheet, of wording that is not this helper's. It ends by
// saying where a person's own lines belong: in a list worksheet, as its module words it.
const wordingProblem = (layout, section) => `this worksheet was made by a different version of the overlay: ${otherWording(layout, section, true)}. ` +
  `${layout.wording.length ? 'Nothing typed on such lines is read. ' : ''}Run upgrade-worksheet --file on this worksheet: it shows each ` +
  'line it would take out or put in and writes nothing, and with --write it brings the worksheet up to date, keeping a copy of it as it ' +
  'is. Anything a person typed on a line it takes out cannot be told from old wording, so a person reads what it shows before it is ' +
  `written. ${isListSection(section) ? LIST_WORKSHEETS.placed : 'An answer belongs after Answer:, and an own entry below the opening comment.'}`;

// Reads a worksheet strictly: readWorksheet's `parsed`, with one more problem when any of the tool's own
// wording in it is not what this helper prints. A worksheet with a problem counts nowhere, so no answer
// of one made by another version is used until it has been brought up to date.
// `strictWorksheet` gives, beside it, what differs in a few words (`otherVersion`, '' when nothing does).
// A worksheet that could not be read as far as its section has no wording to compare.
function strictWorksheet(text, data, options = {}) {
  const { parsed, layout } = readWorksheet(text, data, options);
  const otherVersion = parsed.section === null ? '' : otherWording(layout, parsed.section);
  if (otherVersion) {
    parsed.problems.push({ line: Math.min(...layout.wording, ...(layout.noGuidance ? [layout.marker] : [])),
      message: wordingProblem(layout, parsed.section) });
    parsed.problems.sort((a, b) => a.line - b.line);
  }
  return { parsed, otherVersion };
}
export const parseWorksheet = (text, data, options = {}) => strictWorksheet(text, data, options).parsed;

// What a person typed in a worksheet, as readWorksheet read it, without the line numbers it was read
// from: two worksheets that give the same text here say the same. A list worksheet's Kept elsewhere block
// is part of it.
const typedIn = (parsed) => JSON.stringify([[...parsed.methods], [...parsed.answers], [...parsed.entries],
  ...(parsed.elsewhere ? [parsed.elsewhere] : [])], (name, value) => (name === 'line' ? undefined : value instanceof Map ? [...value] : value));

// A line's words as an upgrade compares them: small letters and digits, one space apart, nothing else.
const plainWords = (text) => (String(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(' ');
// Whether lines (plainWords) hold a part of what a question is known by: a line of context is a whole line; the
// question's own words start one, since the note on the form of answer follows them; a name is within one.
const holdsPart = (plain, [how, words]) => plain.some((line) => line === words ||
  (how === 'start' && line.startsWith(`${words} `)) || (how === 'within' && ` ${line} `.includes(` ${words} `)));
const holdsAll = (plain, parts) => parts.every((part) => holdsPart(plain, part));
const identifying = (section) => (section === 'profile' ? 'the words that identify' : 'the pack\'s words for');
// The words each question of a worksheet is known by: a Map from its identifier to { parts, own, plain }. Within
// one edition only the tool's own words can change (the note on the form of answer, which lines of context it
// prints), so a question is known by the pack's words for it: its text, or the column headings it sits under, and
// where another question's wording holds those too, the one string of its context, nearest first, that tells it
// apart. `own` is what its own line holds. In the profile, a question about a special process or food is known by
// the pack's name for it, any other by the tool's own question, or by an earlier wording of it (`was`, from
// PROFILE_WAS). Worked out once for each worksheet.
const KNOWN = new WeakMap();
export function identifiedBy(section, data) {
  const done = KNOWN.get(data) ?? KNOWN.set(data, new Map()).get(data);
  if (done.has(section)) return done.get(section);
  const parts = (how, text) => text.split('\n').map(plainWords).filter(Boolean).map((words) => [how, words]);
  const asked = section === 'profile' ? PROFILE_QUESTIONS.map((question) => {
    const name = /^(?:process|food):(.+)$/.exec(question.key)?.[1];
    return { id: question.id, prompt: profilePrompt(question), own: name ? [['within', plainWords(name)]] : parts('start', question.text),
      was: name ? [] : question.was.map((text) => parts('start', text)).filter((words) => words.length), context: [] };
  }) : (data.sections.get(section)?.methods ?? []).flatMap(methodQuestions).map((entry) => ({ id: entry.question.id, prompt: promptLines(entry),
    own: parts('start', entry.question.text || entry.columns.join(' / ')), context: entry.context.map((text) => parts('line', text)).reverse() }));
  const plain = new Map(asked.map(({ id, prompt }) => [id, prompt.map(plainWords).filter(Boolean)]));
  const alone = (id, held) => asked.every((other) => other.id === id || !holdsAll(plain.get(other.id), held));
  const known = new Map(asked.map(({ id, own, was = [], context }) => [id, { plain: plain.get(id), own: own.at(-1), was,
    parts: [own, ...context.map((more) => [...own, ...more])].find((held) => alone(id, held)) ?? own }]));
  done.set(section, known);
  return known;
}
// Whose wording lines under a heading are: the questions whose words they hold, less any whose words they hold
// only as a line of another such question's wording (a question that is the next one's lead-in). An earlier
// wording decides only lines that hold no question's present words, so it never takes another question's lines.
export function wordingOf(lines, known) {
  const plain = lines.map(plainWords).filter(Boolean);
  const now = [...known].filter(([, { parts }]) => holdsAll(plain, parts));
  const held = now.length ? now : [...known].filter(([, { was }]) => was.some((words) => holdsAll(plain, words)));
  return held.filter(([id, { parts }]) => !held.some(([other, theirs]) => other !== id && holdsAll(theirs.plain, parts))).map(([id]) => id);
}

// The steps that turn the lines `old` into the lines `now`, keeping every line the two share, in order
// (a longest common subsequence): ['keep', i] and ['out', i] for a line of `old`, ['put', j] for one of `now`.
function lineSteps(old, now) {
  const [m, n] = [old.length, now.length];
  const longest = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) longest[i][j] = old[i] === now[j] ? longest[i + 1][j + 1] + 1 : Math.max(longest[i + 1][j], longest[i][j + 1]);
  }
  const steps = [];
  for (let i = 0, j = 0; i < m || j < n;) {
    if (i < m && j < n && old[i] === now[j]) steps.push(['keep', (j++, i++)]);
    else if (j < n && (i === m || longest[i][j + 1] >= longest[i + 1][j])) steps.push(['put', j++]);
    else steps.push(['out', i++]);
  }
  return steps;
}

// Brings a worksheet made by a different version of the overlay up to date, for the same data: the
// guidance comment and the > lines above each question, where they are not what this helper prints,
// are made what it prints, and no other line is touched, so everything a person typed stays exactly
// as it is. Within the comment and under each question only the lines that differ are taken out or
// put in: a line that is already right stays as it stands, byte for byte. A guidance comment that is
// missing is put back where the helper prints it: below the marker and the one-line comments that
// follow it, above the first line of anything else. Returns { exit: 0, text, changes },
// `changes` empty when there is nothing to do, each a { what, from, to, out, put }: the place, its
// first and last line numbers, the lines taken out as { line, text } and the lines put in, which are
// every line the new text differs by; or { exit: 1, messages } when it will not, which is for:
// - a worksheet for other data (a new edition of the pack is another job), or one that is not a
//   worksheet this helper reads;
// - any problem besides the wording, an identifier the data does not have among them: those are put
//   right first, so that nothing a person typed is in a place this cannot carry;
// - > lines it would replace that are not their heading's question's (wordingOf): another question's are a
//   heading that has been moved, and replacing them would leave an answer under the wrong question, which
//   reading the answers back cannot show; no question's have been typed over, and a person must look;
// - a result that would not read the same: the new text is read back, and must have no problem and
//   hold every answer, state, name, date and entry under the same identifier as before (typedIn).
// A line a person typed inside the guidance or on a > line cannot be told from old wording, so it is
// taken out with the rest: `changes` lists every line taken out, for a person to read before writing.
export function upgradeWorksheet(text, data, options = {}) {
  const leave = 'Nothing has been changed.';
  const { parsed, layout } = readWorksheet(text, data, options);
  if (parsed.data !== null && parsed.data !== DATA_ID) {
    return { exit: 1, messages: [`this worksheet answers data ${parsed.data}, not this helper's data ${DATA_ID}: a new edition of ` +
      `the pack is another job, which this command does not do. ${leave}`] };
  }
  if (parsed.problems.length) {
    const n = parsed.problems.length;
    const listed = parsed.problems.map(({ line, message }) => `  line ${line}: ${message}`);
    const first = parsed.section === null ? 'this is not a worksheet this helper can bring up to date:'
      : `the worksheet has ${counted(n, 'problem', 'problems')} besides its wording, which ${isAre(n)} put right first:`;
    return { exit: 1, messages: [first, ...listed, leave] };
  }
  const { section } = parsed;
  const known = identifiedBy(section, data);
  const judged = [...layout.prompts].filter(([, prompt]) => prompt.foreign.length)
    .map(([id, prompt]) => [id, wordingOf(prompt.at.map((line) => layout.lines[line - 1]), known)]).filter(([id, whose]) => whose.join() !== id);
  const moved = judged.map(([id, whose]) => [id, whose.filter((other) => other !== id)]).filter(([, others]) => others.length);
  const lost = judged.filter(([id, whose]) => !whose.some((other) => other !== id)).map(([id]) => id);
  if (judged.length) {
    const one = lost.length === 1;
    return { exit: 1, messages: [[...(moved.length ? [`a question's heading is not over its own question: ${andList(moved.map(([id, others], i) =>
      `${i ? 'those' : 'the lines starting >'} under ${id} hold ${identifying(section)} ${andList(others)}`))}. That is the mark of a ` +
      'heading that has been moved, not wording from another version, and bringing the worksheet up to date would leave an answer under the ' +
      'wrong question. Put each heading back over its own question first.'] : []),
    ...(lost.length ? [`the lines starting > under ${andList(lost)} are not ${identifying(section)} ${one ? 'it' : 'them'} or ` +
      `${section === 'profile' ? '' : 'for '}any other question of this worksheet, so a person must look at them: compare them with ` +
      `what worksheet --section ${section} prints, then put each heading back over its own question, or its question's lines back as printed there.`] : []),
    leave].join(' ')] };
  }
  const bom = String(text).startsWith('\uFEFF') ? '\uFEFF' : '';
  const pieces = String(text).slice(bom.length).split(/(\r\n|\n|\r)/);
  const ending = (index) => pieces[2 * index + 1] || pieces[1] || '\n';
  const gone = new Set();
  const before = new Map(); // the lines to put in above the line at an index, in order
  const putIn = (index, added) => before.set(index, [...(before.get(index) ?? []), ...added]);
  const changes = [];
  const replace = (what, at, now) => {
    const old = at.map((line) => layout.lines[line - 1].trimEnd());
    // `own`: a question's own line, which holds its own words, as it stands and as this version prints it.
    const { own: mine, was = [] } = known.get(what) ?? {};
    const ownLine = (lines) => lines.find((line) => [mine, ...was.map((words) => words.at(-1))].some((part) => holdsPart([plainWords(line)], part))) ?? lines.at(-1);
    const change = { what, from: at[0], to: at.at(-1), out: [], put: [], own: mine ? [ownLine(old), ownLine(now)] : null };
    let waiting = [];
    for (const [step, k] of lineSteps(old, now)) {
      if (step === 'put') {
        waiting.push(now[k]);
        continue;
      }
      putIn(at[k] - 1, waiting);
      change.put.push(...waiting);
      waiting = [];
      if (step === 'out') {
        gone.add(at[k] - 1);
        change.out.push({ line: at[k], text: old[k] });
      }
    }
    putIn(at.at(-1), waiting);
    change.put.push(...waiting);
    changes.push(change);
  };
  const { guidance } = layout;
  const now = ['<!--', ...guidanceFor(parsed.section, data), '-->'];
  if (guidance && layout.lines.slice(guidance.from - 1, guidance.to).map((line) => line.trimEnd()).join('\n') !== now.join('\n')) {
    replace('The guidance comment', Array.from({ length: guidance.to - guidance.from + 1 }, (_, i) => guidance.from + i), now);
  }
  if (layout.noGuidance) {
    let next = layout.marker;
    while (next < layout.lines.length && /^(?:<!--.*-->)?$/.test(layout.lines[next].trim())) next++;
    const added = [...(layout.lines[next - 1].trim() === '' ? [] : ['']), ...now, ''];
    putIn(next, added);
    changes.push({ what: `The guidance comment, which is missing, goes back before line ${next + 1}`, from: next + 1, to: next + 1, out: [], put: added, back: true });
  }
  for (const [id, prompt] of layout.prompts) {
    if (prompt.foreign.length) replace(id, prompt.at, prompt.now.map((line) => (line === '' ? '>' : `> ${line}`)));
  }
  if (!changes.length) return { exit: 0, text: String(text), changes };
  const last = layout.lines.length;
  const upgraded = bom + [...layout.lines.flatMap((line, i) => [
    ...(before.get(i) ?? []).map((added) => added + ending(i)), ...(gone.has(i) ? [] : [line + (pieces[2 * i + 1] ?? '')])]),
  ...(before.get(last) ?? []).map((added) => ending(last - 1) + added)].join('');
  const after = readWorksheet(upgraded, data, options);
  if (after.parsed.problems.length || otherWording(after.layout, section) || typedIn(after.parsed) !== typedIn(parsed)) {
    return { exit: 1, messages: ['brought up to date, the worksheet would not read the same as it does now, so it is not ' +
      `written: ${after.parsed.problems[0]?.message ?? 'an answer, state, name, date or entry would differ'}. ${leave}`] };
  }
  return { exit: 0, text: upgraded, section, changes: changes.sort((a, b) => a.from - b.from) };
}

// A parsed worksheet as JSON: each Map becomes an object in the same order.
export const worksheetJson = (parsed) =>
  JSON.stringify(parsed, (_, value) => (value instanceof Map ? Object.fromEntries(value) : value), 2);
