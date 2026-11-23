import { sentenceCase } from './uk-food-worksheet.mjs';
import { businessText, NAME_QUESTION, paragraphs, tableLines } from './uk-food-document.mjs';
import { quotedSourceLine } from './uk-food-lists.mjs';

// ---------------------------------------------------------------------------------------------
// The diary and record sheets (FOODREC): the pack's blank forms, for people at the business to print or
// copy and fill in by hand. The overlay never keeps the diary: people do, on paper or typed into these
// same tables, and the 4-weekly review later reads what they kept. Nobody signs this document off, as
// there is nothing in it for anyone to confirm: it is forms, whose pages are for the business's people to
// sign as they fill them in. So no line of it can show it unfinished (its row's unfinishedLine is always
// false), and nothing in it says that a check has been done, that the business does it, or that anything
// is safe.
//
// Every word of the forms is read from the data's diary.json, at render time, from the page and form the
// constants below name; a test ties each to the data. Nothing of a filled-in example the pack prints
// (a block marked fromImage, or the first row of the prove it records, which is an invented business's
// entry) is ever printed. The business adds two things only: its name on the diary's cover, when its
// profile confirms one, and its own opening and closing checks, when its Management worksheet confirms
// them. Each is escaped (businessText), as a business's words are everywhere, and tableLines escapes a
// pipe and turns a line break into <br>, so nothing typed can add a column or a line.
//
// The body, after the coverage sentence:
// 1. "## " and the diary's title (page 80), sentence-cased, as the documents name a section; then the
//    cover's labels as a two-column table, each beside an empty cell, the business's name in its cell
//    when the profile confirms it.
// 2. For each of the opening and closing checks forms (page 82): "## " and its heading, sentence-cased;
//    a table of its checks, each beside an empty cell for a tick, under its instruction; then, when the
//    Management worksheet confirms the business's own checks for it, a second table of them under a
//    line of the helper's that says they are the business's own. A check the pack prints is never left
//    out, whatever the business has said: these are the pack's forms.
// 3. The text the checks page prints about extra checks, under its heading, sentence-cased.
// 4. "## Week" and the blank week page (page 95, never page 94, the pack's filled-in example): each box
//    of the page a two-column table, its heading (a day, or the extra checks box) in its header row,
//    each label beside an empty cell. The pack's statement under a day's signature is printed in the
//    same cell as "Signed", under it, so that it stands beside the signature as the form prints it: it is
//    what a person signs to, never a line of the helper's or the business's.
// 5. "## " and the prove it records' title (page 93), sentence-cased; its text; and its form's columns
//    over as many empty rows as the form leaves blank (every row but the pack's example).
// 6. A line of the helper's own: one week page is printed, to be copied for each week, and the diary is
//    for the people at the business to keep.
// The table cells left for writing in are empty, with no line or box typed in: a printed table gives a
// person room, and a typed copy the same layout.
//
// This module imports the document module, which imports it for the FOODREC row, so nothing of the
// document or lists modules is read here until a function runs: everything at the top level is this
// module's own.
// ---------------------------------------------------------------------------------------------

// The diary's cover (page 80): its one table, whose questions are its labels. `business` is the label
// beside which the business's name is printed, when the profile confirms one.
export const DIARY_COVER = { page: 80, business: 'DY-80-Q02' };
// The opening and closing checks forms (page 82), by their form names, in the page's order, each with the
// question of the Management worksheet that holds the business's own checks for it: the list question of
// MG-01 in the block with the same heading. The page's one text box, on extra checks, follows them.
export const CHECK_FORMS = {
  page: 82, method: 'MG-01', forms: [{ form: 'openingChecks', own: 'MG-01-Q11' }, { form: 'closingChecks', own: 'MG-01-Q21' }]
};
// The blank week page: the first of the pack's week pages after its filled-in example (page 94), whose
// blocks are all the pack's printed words.
export const WEEK_PAGE = { form: 'weekPage', page: 95 };
// The prove it records form (page 93). Its first row is the pack's example, an invented entry.
export const PROVE_IT_FORM = { form: 'proveItRecords', page: 93 };

// The helper's own lines.
const WEEK_HEADING = '## Week';
const COPY_LINE = 'One week page is printed here: print or copy it for each week. These pages are for people at the business to fill in, ' +
  'sign and keep: this tool does not keep the diary.';
// The heading of the business's own checks for a form, from the form's own heading: "The business's own
// opening checks".
const ownHeading = (heading) => `The business's own ${heading.toLowerCase()}`;
// The source line's account of what is quoted: the forms' words, and the two paragraphs the document
// prints. The business's name and own checks, and the helper's lines, are not quoted.
const QUOTED = 'The labels, checks, prompts and instructions on the forms, the statement beside each day\'s signature, and the ' +
  'paragraphs on extra checks and on prove it records are quoted from';

const isWords = (value) => typeof value === 'string' && value !== '';
const pageOf = (data, page) => data.diary?.pages?.find((p) => p.page === page);
// The blocks of a page that the pack prints for a business to fill in: never one read from its filled-in
// example's picture (fromImage), which holds an invented business's words.
const printedBlocks = (page) => (page?.blocks ?? []).filter((block) => !block.fromImage);
// A box of questions alone: a table with no columns and no rows, whose questions each have words and are
// one of `types`.
const questionBox = (block, types) => block?.kind === 'table' && !(block.columns ?? []).length && !(block.rows ?? []).length &&
  (block.questions ?? []).length > 0 && block.questions.every((q) => isWords(q.text) && types.includes(q.type));

// Each form, read from the data as the document prints it, or null when the data lacks it or lays it out
// otherwise; nothing is printed from a form that is not laid out as this module reads it, so no label is
// printed beside the wrong cell. Each reader returns { error } in place of null, saying what is not there.
const missing = (what) => ({ error: `the data's diary.json has no ${what}, laid out as the diary and record sheets print it` });

// The cover: its title and its labels (the questions of its one table).
function coverForm(data) {
  const page = pageOf(data, DIARY_COVER.page);
  const tables = printedBlocks(page).filter((block) => block.kind === 'table');
  const fits = tables.length === 1 && isWords(page.title) && questionBox(tables[0], ['text']) &&
    tables[0].questions.some((q) => q.id === DIARY_COVER.business);
  return fits ? { title: page.title, labels: tables[0].questions } : missing(`diary cover on page ${DIARY_COVER.page} with a label ${DIARY_COVER.business}`);
}

// The opening and closing checks: for each form, its heading, its instruction (its one column), its checks
// (its tick questions, in order) and the question holding the business's own checks for it; and the
// page's text box on extra checks. A form's other questions are the list the pack leaves for a business's
// own checks, with no words of their own: those come from the Management worksheet.
function checkForms(data) {
  const blocks = printedBlocks(pageOf(data, CHECK_FORMS.page));
  const forms = CHECK_FORMS.forms.map(({ form, own }) => {
    const found = blocks.filter((block) => block.form === form);
    const [block] = found;
    const questions = block?.questions ?? [];
    const fits = found.length === 1 && block.kind === 'table' && isWords(block.heading) && block.columns?.length === 1 &&
      isWords(block.columns[0]) && !(block.rows ?? []).length && questions.some((q) => q.type === 'tick') &&
      questions.every((q) => (q.type === 'tick' && isWords(q.text)) || (q.type === 'list' && q.text === ''));
    return fits ? { heading: block.heading, instruction: block.columns[0], checks: questions.filter((q) => q.type === 'tick').map((q) => q.text), own } : null;
  });
  const texts = blocks.filter((block) => block.kind === 'text');
  const extra = texts.length === 1 && isWords(texts[0].heading) && isWords(texts[0].text) ? texts[0] : null;
  if (forms.some((form) => !form)) return missing(`${CHECK_FORMS.forms.map(({ form }) => form).join(' and ')} forms on page ${CHECK_FORMS.page}`);
  if (!extra) return missing(`text box on extra checks on page ${CHECK_FORMS.page}`);
  return { forms, extra };
}

// The week page's boxes, in order. A page that holds a block read from a picture is a filled-in example,
// not a blank page, and is not printed at all. A note is printed under the label before it, so a box never
// starts with one.
function weekForm(data) {
  const page = pageOf(data, WEEK_PAGE.page);
  const boxes = (page?.blocks ?? []).filter((block) => block.form === WEEK_PAGE.form);
  const fits = boxes.length > 0 && !page.blocks.some((block) => block.fromImage) &&
    boxes.every((box) => questionBox(box, ['text', 'tick', 'note']) && box.questions[0].type !== 'note');
  return fits ? { boxes } : missing(`blank ${WEEK_PAGE.form} form on page ${WEEK_PAGE.page}`);
}

// The prove it records: the page's title and text, the form's columns, and how many of its rows are blank.
// Only blank rows are printed, so the pack's example, the one row that holds words, never is.
function proveItForm(data) {
  const page = pageOf(data, PROVE_IT_FORM.page);
  const blocks = printedBlocks(page);
  const tables = blocks.filter((block) => block.form === PROVE_IT_FORM.form);
  const [table] = tables;
  const columns = table?.columns ?? [];
  const blank = (table?.rows ?? []).filter((row) => row.every((cell) => cell === ''));
  const fits = tables.length === 1 && table.kind === 'table' && isWords(page.title) && columns.length > 0 && columns.every(isWords) && blank.length > 0;
  if (!fits) return missing(`${PROVE_IT_FORM.form} form on page ${PROVE_IT_FORM.page} with blank rows`);
  return { title: page.title, texts: blocks.filter((block) => block.kind === 'text'), columns, blankRows: blank.length };
}

// Every form, or { error } for the first the data lacks.
function recordForms(data) {
  const parts = { cover: coverForm(data), checks: checkForms(data), week: weekForm(data), proveIt: proveItForm(data) };
  return Object.values(parts).find((part) => part.error) ?? parts;
}

// What the data lacks that the document prints, as render says it, or null. The row's `lacking`.
export const recordSheetsLacking = (data) => recordForms(data).error ?? null;

// A text box: its heading in bold, when it has one, then one paragraph to each line of its text.
const textChunks = (block) => [...(block.heading ? [[`**${block.heading}**`]] : []), ...paragraphs(block.text)];

// The business's own checks for a form: the lines of its question's answer in the Management worksheet,
// when that worksheet is there and confirms the answer, each as the business wrote it. None when the
// answer is not confirmed (unanswered or only proposed: nothing is printed for it, and no mark either, as
// the pack's checks stand whole without it), and none when MG-01 is marked not relevant, as the business
// has then said it keeps no such checks; the pack's checks are printed all the same.
function ownChecks(mg, question) {
  if (!mg || mg.methods.get(CHECK_FORMS.method)?.status === 'not-relevant') return [];
  const record = mg.answers.get(question);
  return record?.answered ? record.value.filter((line) => line.trim() !== '') : [];
}

// One form of checks: its heading, its checks each beside an empty cell, then the business's own.
function checksChunks(form, mg) {
  const own = ownChecks(mg, form.own);
  return [[`## ${sentenceCase(form.heading)}`], tableLines([form.instruction, ''], form.checks.map((check) => [check, ''])),
    ...(own.length ? [tableLines([ownHeading(form.heading), ''], own.map((check) => [businessText(check), '']))] : [])];
}

// A box of the week page: its heading in the header row (empty for the box with none), then a row to each
// label, beside an empty cell. A note is put in the cell of the label before it, on a line under it.
function weekBoxLines(box) {
  const rows = [];
  for (const question of box.questions) {
    if (question.type === 'note') rows.at(-1)[0] += `\n${question.text}`;
    else rows.push([question.text, '']);
  }
  return tableLines([box.heading ?? '', ''], rows);
}

// The body, after the coverage sentence and before the closing notice. The row's `chunks`.
export function recordSheetsChunks(sources, data) {
  const { cover, checks, week, proveIt } = recordForms(data);
  const name = sources.get('profile').parsed.answers.get(NAME_QUESTION);
  // The Management worksheet is in sources only when it exists and has no problems: render refuses, as for any
  // worksheet a document uses, when it has problems or is for other data.
  const mg = sources.get('MG')?.parsed ?? null;
  return [
    [`## ${sentenceCase(cover.title)}`],
    tableLines(['', ''], cover.labels.map((q) => [q.text, q.id === DIARY_COVER.business && name?.answered ? businessText(name.answer) : ''])),
    ...checks.forms.flatMap((form) => checksChunks(form, mg)),
    [`## ${sentenceCase(checks.extra.heading)}`], ...paragraphs(checks.extra.text),
    [WEEK_HEADING], ...week.boxes.map(weekBoxLines),
    [`## ${sentenceCase(proveIt.title)}`], ...proveIt.texts.flatMap(textChunks),
    tableLines(proveIt.columns, Array.from({ length: proveIt.blankRows }, () => proveIt.columns.map(() => ''))),
    [COPY_LINE]
  ];
}

// The body's last line, which says what it quotes. The row's `source`.
export const recordSheetsSource = (data) => quotedSourceLine(QUOTED, data.source);
