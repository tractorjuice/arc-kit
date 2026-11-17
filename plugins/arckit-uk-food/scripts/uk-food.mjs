#!/usr/bin/env node
// UK food overlay helper. Standard library only.
// Commands are entries in COMMANDS; each is one exported function returning an exit code.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATA_ID = 'sfbb-caterers-2026-11-17';
export const SCHEMA_ID = 'uk-food-sfbb-data-1.0';
export const SECTION_IDS = ['XC', 'CL', 'CH', 'CK', 'MG'];
// The two files that hold the pack's pages that are not safe methods, with their identifier prefixes.
export const PARTS = { front: 'FR', diary: 'DY' };
// A block of front.json or diary.json may carry `form`: later work renders a business's own form from it.
export const FORMS = [
  'openingChecks', 'closingChecks', 'extraChecks', 'trainingRecord', 'suppliersList', 'contactsList',
  'cleaningSchedule', 'proveItRecords', 'weekPage', 'fourWeeklyReview', 'completionRecord',
  'workingWithFood', 'reviewLog', 'packCompletion'
];
// The diary pages whose text blocks may carry `fromImage: true`: words printed on the page that are not in
// the PDF's text layer, transcribed from the page image. The coverage test cannot see such a block, so it is
// allowed nowhere else. Each page here is a picture, or holds one, whose filled-in example entries are not in
// the text layer: 87 the example supplier, 89 the example contact, 94 the example week (whose text layer also
// lacks Friday's printed prompt), 99 the example 4-weekly review. The schema's $defs.fromImagePage repeats
// this list; a Node test keeps the two the same.
export const FROM_IMAGE_PAGES = [87, 89, 94, 99];
// The pages of front.json and diary.json, first and last: a limit outside a safe method lies within them.
export const PART_PAGE_RANGES = { front: [1, 10], diary: [78, 100] };
// `note` is FSA text printed in an answer column that asks nothing: never asked, never unanswered.
export const QUESTION_TYPES = ['yes-no', 'yes-no-else', 'tick', 'text', 'list', 'note'];
export const SOURCE_FIELDS = [
  'title', 'publisher', 'url', 'publication', 'retrieved',
  'file', 'sha256', 'pages', 'licence', 'attribution'
];
export const DEFAULT_DATA_DIR = fileURLToPath(
  new URL(`../data/${DATA_ID}`, import.meta.url)
);

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${path}: ${error.message}`);
  }
};
const readOptional = (dir, name) =>
  existsSync(join(dir, `${name}.json`)) ? readJson(join(dir, `${name}.json`)) : null;

// Loads every data file that exists; a file that does not exist is null. front and diary are each
// { schema, data, part, pages: [{ page, title, blocks }] }; limits is { schema, data, limits: [{ id,
// value, text, method, page }] }, derived from the other files rather than transcribed.
export function loadData(dataDir) {
  const sections = new Map();
  for (const id of SECTION_IDS) {
    const section = readOptional(dataDir, id);
    if (section) sections.set(id, section);
  }
  return {
    source: readOptional(dataDir, 'source'),
    front: readOptional(dataDir, 'front'),
    sections,
    diary: readOptional(dataDir, 'diary'),
    limits: readOptional(dataDir, 'limits')
  };
}

const isPage = (value) => Number.isInteger(value) && value >= 1 && value <= 100;
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isString = (value) => typeof value === 'string';
const isStringOrNull = (value) => value === null || isString(value);
const isStringArray = (value) => Array.isArray(value) && value.every(isString);
const isRowsOfStrings = (value) => Array.isArray(value) && value.every(isStringArray);

export const SOURCE_VALUES = {
  title: isString, url: isString, publication: isString, file: isString,
  publisher: (v) => v === 'Food Standards Agency',
  retrieved: (v) => isString(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
  sha256: (v) => isString(v) && /^[0-9a-f]{64}$/.test(v),
  pages: (v) => v === 100,
  licence: (v) => v === 'OGL-3.0',
  attribution: (v) =>
    v === 'Contains public sector information licensed under the Open Government Licence v3.0.'
};

// Every block carries kind and page, and may carry heading. `required` and `fields` list the rest,
// each with the check its value must pass. Any other key is rejected.
const ROWS = (v) => Array.isArray(v);
const BLOCK_KINDS = {
  points: { required: ['rows'], fields: { columns: isStringArray, rows: ROWS } },
  'manage-it': { required: ['rows'], fields: { columns: isStringArray, rows: ROWS } },
  // A check-it block's columns hold the headings printed after "CHECK IT" in its header row.
  'check-it': { required: [], fields: { columns: isStringArray, text: isStringOrNull, rows: ROWS, questions: ROWS } },
  'think-twice': { required: ['text'], fields: { text: isString } },
  'prove-it': { required: ['text'], fields: { text: isString } },
  text: { required: ['text'], fields: { text: isString, fromImage: (v) => typeof v === 'boolean' } },
  wrong: {
    required: ['wrong', 'prevent'],
    fields: {
      wrongHeading: isStringOrNull, preventHeading: isStringOrNull, wrong: isStringArray,
      prevent: isStringArray, diaryNote: isStringOrNull
    }
  },
  table: {
    required: ['columns', 'rows'],
    fields: { columns: isStringArray, columnGroups: ROWS, rows: isRowsOfStrings, questions: ROWS }
  }
};
// `form` is checked here against FORMS; a section file's block is refused it separately.
const BLOCK_COMMON = { kind: isString, heading: isStringOrNull, page: () => true, form: (v) => FORMS.includes(v) };

// Returns a list of problems; an empty list means the data is valid.
export function validateData(data) {
  const errors = [];
  const ids = new Set();
  const claim = (id, where) => {
    if (typeof id !== 'string' || id === '') errors.push(`${where}: missing identifier`);
    else if (ids.has(id)) errors.push(`${where}: duplicate identifier ${id}`);
    else ids.add(id);
  };
  const needPage = (value, where) => {
    if (value === undefined || value === null) errors.push(`${where}: no page`);
    else if (!isPage(value)) errors.push(`${where}: page ${JSON.stringify(value)} is outside 1 to 100`);
  };
  // Rejects keys outside `allowed` and absent keys in `required`; checks each present value.
  const shape = (object, where, allowed, required) => {
    if (!isObject(object)) {
      errors.push(`${where}: is not an object`);
      return false;
    }
    for (const key of Object.keys(object)) {
      if (!Object.hasOwn(allowed, key)) errors.push(`${where}: unknown key ${key}`);
      else if (!allowed[key](object[key])) errors.push(`${where}: invalid value for ${key}`);
    }
    for (const key of required) {
      if (object[key] === undefined) errors.push(`${where}: missing ${key}`);
    }
    return true;
  };

  const source = data.source;
  if (!isObject(source)) errors.push('source.json: missing');
  else shape(source, 'source.json', SOURCE_VALUES, SOURCE_FIELDS);

  const QUESTION = {
    id: isString, text: isString, type: isString,
    options: isStringArray, elseText: isStringOrNull
  };
  const questions = (list, where) => {
    if (list === undefined) return;
    if (!Array.isArray(list)) return errors.push(`${where}: questions is not an array`);
    for (const question of list) {
      const at = `${where} question ${question && question.id}`;
      if (!shape(question, at, QUESTION, ['id', 'text', 'type'])) continue;
      claim(question.id, at);
      if (!QUESTION_TYPES.includes(question.type)) {
        errors.push(`${at}: type ${JSON.stringify(question.type)} is not one of ${QUESTION_TYPES.join(', ')}`);
      }
      if (question.options !== undefined && !isStringArray(question.options)) {
        errors.push(`${at}: options is not an array of strings`);
      }
      // Any question but a note may have empty text: its prompt is then its block's column
      // headings and its row's point. A note is printed FSA text that asks nothing.
      if (question.type === 'note') {
        if (question.text === '') errors.push(`${at}: a note must have text`);
        if (Array.isArray(question.options) && question.options.length > 0) {
          errors.push(`${at}: a note has no options`);
        }
        if (question.elseText !== undefined && question.elseText !== null) {
          errors.push(`${at}: a note has no elseText`);
        }
      }
    }
  };
  // A label printed across several columns of a two-level table header, over the block's
  // columns `from` to `to` (0-based, inclusive). Groups do not overlap.
  const COLUMN_GROUP = { label: isString, from: Number.isInteger, to: Number.isInteger };
  const columnGroups = (list, columns, where) => {
    if (!Array.isArray(list)) return; // absent, or already reported by shape
    const width = isStringArray(columns) ? columns.length : 0;
    const spans = [];
    for (const group of list) {
      const at = `${where} column group ${JSON.stringify(group && group.label)}`;
      if (!shape(group, at, COLUMN_GROUP, ['label', 'from', 'to'])) continue;
      if (group.label === '') errors.push(`${at}: label is empty`);
      const { from, to } = group;
      if (!Number.isInteger(from) || !Number.isInteger(to)) continue;
      if (from < 0) errors.push(`${at}: from ${from} is below 0`);
      else if (from > to) errors.push(`${at}: from ${from} is after to ${to}`);
      else if (to >= width) errors.push(`${at}: to ${to} is beyond the last column, ${width - 1}`);
      else spans.push({ from, to, at });
    }
    spans.sort((a, b) => a.from - b.from);
    let reach = -1; // the last column covered by the groups so far
    for (const span of spans) {
      if (span.from <= reach) errors.push(`${span.at}: overlaps another column group`);
      reach = Math.max(reach, span.to);
    }
  };
  const ROW = { id: isString, point: isStringOrNull, why: isStringOrNull, page: () => true, questions: ROWS };
  const rows = (list, where) => {
    if (!Array.isArray(list)) return errors.push(`${where}: rows is not an array`);
    for (const row of list) {
      const at = `${where} row ${row && row.id}`;
      if (!shape(row, at, ROW, ['id', 'page'])) continue;
      claim(row.id, at);
      needPage(row.page, at);
      questions(row.questions, at);
    }
  };

  // Checks one block of any kind; returns true when it has a known kind and is an object.
  const block = (value, owner) => {
    const kind = value && value.kind;
    const here = `${owner} ${kind} block`;
    if (!Object.hasOwn(BLOCK_KINDS, kind)) {
      errors.push(`${owner}: unknown block kind ${JSON.stringify(kind)}`);
      return false;
    }
    const { required, fields } = BLOCK_KINDS[kind];
    if (!shape(value, here, { ...BLOCK_COMMON, ...fields }, ['page', ...required])) return false;
    needPage(value.page, here);
    if (kind === 'points' || kind === 'manage-it' || (kind === 'check-it' && value.rows !== undefined)) {
      rows(value.rows, here);
    }
    if (kind === 'table') columnGroups(value.columnGroups, value.columns, here);
    questions(value.questions, here);
    return true;
  };
  // A block's rows that carry identifiers (a table's rows are cells), and every question in it.
  const rowsOf = (value) =>
    value.kind !== 'table' && Array.isArray(value.rows) ? value.rows.filter(isObject) : [];
  const questionsOf = (value) => [value, ...rowsOf(value)]
    .flatMap((holder) => (Array.isArray(holder.questions) ? holder.questions : []))
    .filter(isObject);

  // front.json and diary.json: one page object per printed page, in page order. Everything on a
  // page object is on its page, and row and question identifiers name the part and the page.
  const PAGES_FILE = { schema: isString, data: isString, part: isString, pages: Array.isArray };
  // A page's printed title, or null when it prints none: never an empty string.
  const isTitle = (v) => v === null || (isString(v) && v !== '');
  const PAGE_OBJECT = { page: () => true, title: isTitle, blocks: Array.isArray };
  // fromImage text is invisible to the coverage test, so it is allowed only on the diary pages listed.
  const fromImageAllowed = (name, page) => name === 'diary' && FROM_IMAGE_PAGES.includes(page);
  const FROM_IMAGE_ONLY = `fromImage is allowed only on diary.json pages ${FROM_IMAGE_PAGES.join(', ') || '(none)'}`;
  const pagesFile = (name) => {
    const file = data[name];
    const where = `${name}.json`;
    if (file === null || file === undefined) return;
    if (!shape(file, where, PAGES_FILE, ['schema', 'data', 'part', 'pages'])) return;
    if (file.schema !== SCHEMA_ID) errors.push(`${where}: schema is not ${SCHEMA_ID}`);
    if (file.data !== DATA_ID) errors.push(`${where}: data is not ${DATA_ID}`);
    if (file.part !== name) errors.push(`${where}: part ${JSON.stringify(file.part)} is not ${name}`);
    if (!Array.isArray(file.pages)) return;
    if (file.pages.length === 0) errors.push(`${where}: pages is empty`);
    let previous = 0;
    for (const pageObject of file.pages) {
      const at = `${where} page ${pageObject && pageObject.page}`;
      if (!shape(pageObject, at, PAGE_OBJECT, ['page', 'title', 'blocks'])) continue;
      needPage(pageObject.page, at);
      const page = pageObject.page;
      if (!isPage(page)) continue;
      if (page === previous) errors.push(`${at}: printed twice`);
      else if (page < previous) errors.push(`${at}: out of order, after page ${previous}`);
      previous = Math.max(previous, page);
      const tag = `${PARTS[name]}-${String(page).padStart(2, '0')}`;
      for (const value of Array.isArray(pageObject.blocks) ? pageObject.blocks : []) {
        if (!block(value, at)) continue;
        const here = `${at} ${value.kind} block`;
        if (isPage(value.page) && value.page !== page) {
          errors.push(`${here}: page ${value.page} is not its page object's page ${page}`);
        }
        if (value.fromImage === true && !fromImageAllowed(name, page)) errors.push(`${here}: ${FROM_IMAGE_ONLY}`);
        for (const row of rowsOf(value)) {
          if (isString(row.id) && !new RegExp(`^${tag}-P[0-9]{2}$`).test(row.id)) {
            errors.push(`${here} row ${row.id}: identifier is not ${tag}-P and two digits`);
          }
          if (isPage(row.page) && row.page !== page) {
            errors.push(`${here} row ${row.id}: page ${row.page} is not its page object's page ${page}`);
          }
        }
        for (const question of questionsOf(value)) {
          if (isString(question.id) && !new RegExp(`^${tag}-Q[0-9]{2}$`).test(question.id)) {
            errors.push(`${here} question ${question.id}: identifier is not ${tag}-Q and two digits`);
          }
        }
      }
    }
  };

  const FILE = { schema: isString, data: isString, section: isObject, methods: Array.isArray };
  const SECTION = {
    id: isString, code: isString, title: isString, pages: Array.isArray, intro: Array.isArray
  };
  const METHOD = {
    id: isString, title: isString, summary: isStringOrNull, pages: Array.isArray, blocks: Array.isArray
  };
  pagesFile('front');
  for (const [key, file] of data.sections) {
    if (!shape(file, `${key}.json`, FILE, ['schema', 'data', 'section', 'methods'])) continue;
    const section = file.section;
    shape(section, `${key}.json section`, SECTION, ['id', 'code', 'title', 'intro']);
    if (section.id !== key || !SECTION_IDS.includes(section.id)) {
      errors.push(`${key}.json: section id ${section.id} is not ${key}`);
    }
    if (file.schema !== SCHEMA_ID) errors.push(`${key}.json: schema is not ${SCHEMA_ID}`);
    if (file.data !== DATA_ID) errors.push(`${key}.json: data is not ${DATA_ID}`);
    for (const item of Array.isArray(section.intro) ? section.intro : []) {
      if (shape(item, `${key} intro`, { text: isString, page: () => true }, ['text', 'page'])) {
        needPage(item.page, `${key} intro`);
      }
    }
    for (const page of Array.isArray(section.pages) ? section.pages : []) needPage(page, `${key} section pages`);
    for (const method of file.methods) {
      const at = `method ${method && method.id}`;
      if (!shape(method, at, METHOD, ['id', 'title', 'pages', 'blocks'])) continue;
      claim(method.id, at);
      if (isString(method.id) && !/^[A-Z]{2}-[0-9]{2}$/.test(method.id)) {
        errors.push(`${at}: identifier is not two capital letters, a hyphen and two digits`);
      }
      if (isString(method.id) && !method.id.startsWith(`${key}-`)) {
        errors.push(`${at}: identifier does not start with ${key}-`);
      }
      if (!Array.isArray(method.pages) || method.pages.length === 0) {
        errors.push(`${at}: pages is empty`);
      } else {
        for (const page of method.pages) needPage(page, `${at} pages`);
      }
      if (!Array.isArray(method.blocks)) continue;
      for (const value of method.blocks) {
        if (!block(value, at)) continue;
        if (Object.hasOwn(value, 'form')) {
          errors.push(`${at} ${value.kind} block: form is allowed only in front.json and diary.json`);
        }
        if (value.fromImage === true) errors.push(`${at} ${value.kind} block: ${FROM_IMAGE_ONLY}`);
      }
    }
  }
  pagesFile('diary');

  // limits.json: one entry per place the pack prints a figure a business must work to, numbered in order.
  const LIMITS_FILE = { schema: isString, data: isString, limits: Array.isArray };
  const isText = (v) => isString(v) && v !== '';
  const LIMIT = { id: isString, value: isText, text: isText, method: isString, page: () => true };
  const methodPages = new Map();
  for (const [, file] of data.sections) {
    for (const method of Array.isArray(file?.methods) ? file.methods : []) {
      if (isObject(method) && isString(method.id) && Array.isArray(method.pages)) {
        methodPages.set(method.id, method.pages);
      }
    }
  }
  const limitsFile = () => {
    const file = data.limits;
    const where = 'limits.json';
    if (file === null || file === undefined) return;
    if (!shape(file, where, LIMITS_FILE, ['schema', 'data', 'limits'])) return;
    if (file.schema !== SCHEMA_ID) errors.push(`${where}: schema is not ${SCHEMA_ID}`);
    if (file.data !== DATA_ID) errors.push(`${where}: data is not ${DATA_ID}`);
    if (!Array.isArray(file.limits)) return;
    if (file.limits.length === 0) errors.push(`${where}: limits is empty`);
    file.limits.forEach((limit, index) => {
      const at = `${where} limit ${limit && limit.id}`;
      if (!shape(limit, at, LIMIT, Object.keys(LIMIT))) return;
      claim(limit.id, at);
      const expected = `L-${String(index + 1).padStart(2, '0')}`;
      if (isString(limit.id) && limit.id !== expected) {
        errors.push(`${at}: identifier is not ${expected}; limits are numbered L-01, L-02 and so on in order`);
      }
      needPage(limit.page, at);
      let pages = null;
      let described = '';
      if (Object.hasOwn(PART_PAGE_RANGES, limit.method)) {
        const [first, last] = PART_PAGE_RANGES[limit.method];
        pages = Array.from({ length: last - first + 1 }, (_, i) => first + i);
        described = `${first} to ${last}`;
      } else if (methodPages.has(limit.method)) {
        pages = methodPages.get(limit.method);
        described = pages.join(', ');
      } else {
        errors.push(`${at}: method ${JSON.stringify(limit.method)} is not a safe method, front or diary`);
      }
      if (pages && isPage(limit.page) && !pages.includes(limit.page)) {
        errors.push(`${at}: page ${limit.page} is not one of ${limit.method}'s pages (${described})`);
      }
      if (isText(limit.text) && isText(limit.value) && !limit.text.includes(limit.value)) {
        errors.push(`${at}: text does not contain value ${JSON.stringify(limit.value)}`);
      }
    });
  };
  limitsFile();
  return errors;
}

// ---------------------------------------------------------------------------------------------
// Worksheets: a business's answers to the pack's questions, one Markdown file per section, that
// a person types into and the helper reads. Its only FSA words are those read from the data.
// ---------------------------------------------------------------------------------------------

export const WORKSHEET_VERSION = '1.0';
export const WORKSHEET_SECTIONS = [...SECTION_IDS, 'profile', 'own'];
export const STATES = ['unanswered', 'proposed', 'confirmed'];
export const STATUSES = ['applies', 'adapted', 'not-relevant'];
export const OWN_KINDS = ['additional', 'special-process'];
const METHOD_FIELDS = ['Status', 'Reason', 'Decided-by', 'Variation', 'Proved-safe'];
const ANSWER_FIELDS = ['Answer', 'State', 'By', 'On', 'Source'];
const OWN_FIELDS = [
  'Kind', 'Hazard', 'Control', 'Limit', 'Limit-source', 'Check', 'If-it-fails', 'Supplied-text', 'EH-review',
  'State', 'By', 'On'
];
// The status fields each status uses. A field the status does not use, filled in, is reported:
// no document would show it, and nothing a person writes is dropped without saying so.
const STATUS_USES = {
  applies: [], adapted: ['Variation', 'Reason', 'Proved-safe'], 'not-relevant': ['Reason', 'Decided-by']
};
// What an own entry of each kind must fill in before it can be proposed or confirmed.
const KIND_NEEDS = {
  additional: ['Hazard', 'Control', 'Check', 'If-it-fails'], 'special-process': ['Supplied-text', 'EH-review']
};
// Printed after each question: the form of answer the helper reads. The helper's words, not the pack's.
const HINTS = {
  'yes-no': '(yes / no)', 'yes-no-else': '(yes, or say what you do instead)', tick: '(yes if you do this / no)',
  text: '(write your answer)', list: '(one item per line)', nation: '(England / Wales / Scotland / Northern Ireland / other)'
};
const NATIONS = ['England', 'Wales', 'Scotland', 'Northern Ireland', 'other'];
// Only yes (or yes.) is yes. An answer to a yes-no-else question that is nothing but one of these
// words, or a non-answer (n/a, none, a dash, a question mark), followed by any run of marks (. ! ?
// an ellipsis, and also , ; : - and spaces), says neither yes nor what the business does instead,
// so it is reported and not used. So is an answer made only of such marks.
const NOT_AN_INSTEAD = new RegExp('^(?:(?:no|n|nope|nah|not|never|none|nil|na|n/a|y|ye|yea|yeah|yep|yup|yes|yess|yse|ys|yrs|' +
  'ues|ok|okay|true|false)[\\s.!?\u2026,;:-]*|[\\s.!?\u2026,;:-]+)$', 'i');
// The bracketed hints, lower-cased: an answer line that is one of them was copied from the prompt.
const HINT_TEXTS = Object.values(HINTS).map((hint) => hint.toLowerCase());
// The special processes and foods the pack names in CK-02's box "Other foods that need extra care"
// (page 53), spelt as printed there. A test checks that each is in that box's text.
export const EXTRA_CARE = {
  processes: ['Vacuum packing', 'sous vide', 'low temperature cooking', 'fermenting', 'smoking or curing meat/fish'],
  foods: ['Kebabs', 'sushi/sashimi', 'liver parfait', 'fish/meat carpaccio and tartare', 'less than thoroughly cooked burgers']
};
// The profile's questions. The pack asks none of them, so the words are the helper's own.
export const PROFILE_QUESTIONS = [
  ['text', 'What is the business called?'],
  ['text', 'Who is the food business operator: the person or company legally responsible for the business?'],
  ['text', 'What is the address of the premises? If the business has none, write "no premises".'],
  ['text', 'Which council is the business registered with?'],
  ['text', 'On what date was the business registered with the council?'],
  ['nation', 'Which nation is the business in?'],
  ['text', 'Who is in charge of keeping this pack up to date?'],
  ['text', 'What food and drink does the business sell?'],
  ['list', 'What equipment do you use to store, prepare, cook and serve food?'],
  ['list', 'Who works with food, and what is each person\'s role?'],
  ...EXTRA_CARE.processes.map((name) => ['yes-no', `Do you use this process, which needs extra care: ${name}?`]),
  ...EXTRA_CARE.foods.map((name) => ['yes-no', `Do you make or serve this food, which needs extra care: ${name}?`])
].map(([type, text], i) => ({ id: `PR-Q${String(i + 1).padStart(2, '0')}`, type, text, elseText: null }));

const WORKSHEET_TITLES = { profile: 'Business profile', own: 'Your own controls and special processes' };
const ANSWER_GUIDANCE = [
  'How to fill this in. Write each answer after "Answer:". To carry an answer on to more lines, start',
  'each extra line with two spaces. State says where an answer stands: unanswered; proposed (suggested',
  'but not yet agreed: say where it came from in Source); or confirmed (agreed by the business: put who',
  'agreed it in By and the date, as YYYY-MM-DD, in On). Only confirmed answers go into your documents.',
  'Lines that start with > show what is asked. They are rewritten each time, so anything typed on them',
  'is not read.'
];
const STATUS_GUIDANCE = [
  'Status says whether a safe method applies to the business: applies; adapted (you do it differently:',
  'fill in Variation, Reason and Proved-safe); or not-relevant (fill in Reason and Decided-by).'
];
const OWN_GUIDANCE = [
  'Add an entry for each food safety control of your own that the pack does not cover, and for each',
  'special process you use, such as sous vide. Copy the lines from "## OWN-01" down, paste them below',
  'this comment, and number the entries OWN-01, OWN-02 and so on. Kind is additional or special-process.',
  'A Limit needs a Limit-source: where the figure comes from. EH-review is pending, or the date and',
  'outcome of the council\'s review, such as 2026-12-01 accepted. To carry a value on to more lines,',
  'start each extra line with two spaces. State is unanswered, proposed (suggested but not yet agreed)',
  'or confirmed (agreed by the business: put who agreed it in By and the date, as YYYY-MM-DD, in On).',
  'Only a confirmed entry goes into your documents.',
  '',
  '## OWN-01 Name of the control',
  '',
  ...OWN_FIELDS.map((field) => (field === 'State' ? 'State: unanswered' : `${field}:`))
];

// The Markdown lint rules a worksheet cannot meet without changing the pack's words or the
// worksheet grammar, each turned off in that worksheet with its reason beside it.
const LINT_EXCEPTIONS = {
  profile: [['MD001', 'the profile has no methods, so its ### questions sit straight under the # title, as the worksheet grammar sets out']]
};

// The guidance comment each worksheet carries after its marker.
const guidanceFor = (section) =>
  ({ own: OWN_GUIDANCE, profile: ANSWER_GUIDANCE })[section] ?? [...ANSWER_GUIDANCE, ...STATUS_GUIDANCE];

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

// Where a method's questions sit: on a block, and on each row of any block but a table.
const holdersOf = (block) => [
  ...(Array.isArray(block.questions) ? [{ questions: block.questions, row: null }] : []),
  ...(block.kind !== 'table' && Array.isArray(block.rows) ? block.rows.map((row) => ({ questions: row.questions ?? [], row })) : [])
];

// The printed column headings each question of a row or box sits under. The questions fill the
// rightmost columns in order, after the point and its reason; a yes-no-else question with no
// printed follow-up takes two, its tick column and the "if not" column beside it. Questions that
// outnumber the columns are stacked in one column, so each sits under the last.
function columnsFor(questions, columns) {
  const widths = questions.map((q) => (q.type === 'yes-no-else' && !q.elseText ? 2 : 1));
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
//   until the next one;
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
      let notes = [];
      let leadIn = null;
      questions.forEach((question, i) => {
        if (question.type === 'note') {
          notes.push(question);
          if (endsWithColon(question.text)) leadIn = question;
          return;
        }
        const context = [];
        if (block.heading) context.push(block.heading);
        if (block.kind === 'check-it' && block.text && !row?.point) context.push(block.text);
        if (row && leadInRow) context.push(leadInRow);
        if (point) context.push(point);
        if (leadIn && !notes.includes(leadIn)) context.push(leadIn.text);
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

// Writes a field: its first line after the name, every further line indented by two spaces.
const fieldLines = (name, value = '') => {
  const [first, ...rest] = String(value).split('\n');
  return [first === '' ? `${name}:` : `${name}: ${first}`, ...rest.map((line) => `  ${line}`)];
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
  blocks.push(comment(guidanceFor(section)));
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
const FIELD = /^([A-Za-z][A-Za-z-]*)[ \t]*:(.*)$/;
const FIELD_NAMES = new Map([...METHOD_FIELDS, ...ANSWER_FIELDS, ...OWN_FIELDS].map((f) => [f.toLowerCase(), f]));
const FIELDS_OF = { method: METHOD_FIELDS, question: ANSWER_FIELDS, entry: OWN_FIELDS };

// Reads an answer as its question's type. Returns the value a document may print, or an error.
function readValue(question, answer) {
  switch (question.type) {
    case 'yes-no':
    case 'tick':
      return /^(yes|no)\.?$/i.test(answer) ? { value: answer.replace(/\.$/, '').toLowerCase() } : { error: 'is not yes or no' };
    case 'yes-no-else':
      if (/^yes\.?$/i.test(answer)) return { value: 'yes' };
      if (NOT_AN_INSTEAD.test(answer)) return { error: 'does not say what you do instead: write yes, or say what you do instead' };
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

// Reads a worksheet against the data (what loadData returns). Never throws on what a person or
// tool has written: every fault is a { line, message } problem, and an answer with a problem in
// its block is not used. `answered` is true only for a confirmed answer with no problem, under a
// method that is not marked not-relevant: nothing else counts as answered anywhere.
export function parseWorksheet(text, data) {
  const problems = [];
  const parsed = { data: null, section: null, methods: new Map(), answers: new Map(), entries: new Map(), problems };
  const report = (line, message, block = null) => {
    problems.push({ line, message });
    if (block) block.faulty = true;
  };
  const finish = () => {
    problems.sort((a, b) => a.line - b.line);
    return parsed;
  };
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r\n|\n|\r/);

  const markerAt = lines.findIndex((line) => /^<!--.*uk-food-answers/.test(line.trim()));
  if (markerAt < 0) {
    report(1, 'there is no uk-food-answers marker line, so this is not a worksheet the helper can read');
    return finish();
  }
  for (let i = 0; i < markerAt; i++) {
    const line = lines[i].trim();
    if (line !== '' && !line.startsWith('# ')) report(i + 1, 'text before the uk-food-answers marker line is not read');
  }
  const markerLine = markerAt + 1;
  const marker = MARKER.exec(lines[markerAt].trim());
  if (!marker) {
    report(markerLine, 'the marker line is not understood: it reads <!-- uk-food-answers 1.0 data=... section=... -->');
    return finish();
  }
  const [, version, dataId, section] = marker;
  parsed.data = dataId;
  if (version !== WORKSHEET_VERSION) {
    report(markerLine, `this worksheet is version ${version}; the helper reads version ${WORKSHEET_VERSION}`);
    return finish();
  }
  if (dataId !== DATA_ID) {
    report(markerLine, `this worksheet answers data ${dataId}, but the helper's data is ${DATA_ID}`);
    return finish();
  }
  if (!WORKSHEET_SECTIONS.includes(section)) {
    report(markerLine, `section ${section} is not one of ${WORKSHEET_SECTIONS.join(', ')}`);
    return finish();
  }
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

  // Pass 1: lines into blocks. A block is a method's status, a question or an own entry; a block
  // that is reported as it opens (an unknown or repeated heading) is read and set aside, so its
  // lines are not reported again.
  const seen = { method: new Map(), question: new Map(), entry: new Map() };
  const open = (kind, id, line, extra = {}) => ({ kind, id, line, fields: new Map(), faulty: false, ...extra });
  const titles = new Map((methods ?? []).map((m) => [m.id, m.title]));
  const sameTitle = (a, b) => a.replace(/\s+/g, ' ').toLowerCase() === b.replace(/\s+/g, ' ').toLowerCase();
  const guidance = ['<!--', ...guidanceFor(section), '-->'];
  let guidanceChecked = false;
  let method = null;
  let block = null;
  let field = null; // the field an indented line continues
  let comment = null; // the lines, { at, text }, of a comment not yet closed
  let provenance = false; // inside a "## Build Provenance" section another tool appended: not read
  // A line that the worksheet would read if it were not in a comment: a heading or a field.
  const worksheetLine = (text) => {
    const match = FIELD.exec(text.trim());
    return /^#{2,3}[ \t]+\S/.test(text.trim()) || Boolean(match && FIELD_NAMES.has(match[1].toLowerCase()));
  };
  // Nothing in a comment is read. Text after a comment's end on the same line is reported, never
  // dropped. The first comment over several lines is the helper's guidance; if it differs from what
  // the helper writes, someone may have written an answer or an own entry inside it. Any other
  // comment, except the lint comments, that holds a line of the worksheet is reported too: a
  // plain remark is allowed, a commented-out answer or entry is not lost without a word.
  const closeComment = (lines) => {
    const last = lines.at(-1);
    const end = last.text.indexOf('-->', lines.length === 1 ? 4 : 0);
    if (last.text.slice(end + 3).trim()) report(last.at, 'text after the end of a comment ("-->") is not read', block);
    if (lines.length > 1 && !guidanceChecked) {
      guidanceChecked = true;
      const differs = lines.findIndex((line, i) => line.text !== guidance[i]);
      if (differs >= 0) {
        report(lines[differs].at, 'this comment differs from the helper\'s guidance, and nothing inside a comment is read: ' +
          (section === 'own' ? 'copy the entry below the comment' : 'write answers below the comment, after Answer:'));
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
  // Inside a "## Build Provenance" section another tool appended, only a heading of this worksheet
  // is read again: a method or own-entry heading, or a question heading. Everything else is not.
  const resumesAfterProvenance = (line) => {
    const heading = /^(#{2,3})[ \t]+(\S+)/.exec(line);
    if (!heading) return false;
    const id = heading[2].toUpperCase();
    if (heading[1].length === 3) return asked.has(id);
    return methodIds.has(id) || (section === 'own' && /^OWN-\d{2}$/.test(id));
  };
  // Adds a line to a field's value. A comment in a value would be hidden once a document is
  // rendered, so the document would say something no reader could see: reported, value not used.
  const take = (target, text, at) => {
    target.lines.push(text);
    if (target.block && text.includes('<!--')) {
      report(at, 'a comment inside a value would be hidden once the document is rendered, so the value is not used: take the comment out', target.block);
    }
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
      field = null; // a blank line ends a field: a continued line follows its field directly
      continue;
    }
    if (provenance) {
      if (!resumesAfterProvenance(line)) continue;
      provenance = false;
    }
    if (/^[ \t]/.test(line)) {
      const text = line.trim();
      const looks = FIELD.exec(text);
      if ((looks && FIELD_NAMES.has(looks[1].toLowerCase())) || /^#{1,6}[ \t]/.test(text)) {
        report(at, `a ${looks ? 'field' : 'heading'} must start at the beginning of the line: this indented line is not read`, block);
        field = { lines: [] };
      } else if (field) {
        take(field, text, at);
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
    const heading = /^(#+)[ \t]+(\S.*)$/.exec(line);
    if (heading && heading[1].length === 2) {
      const title = heading[2].trim();
      provenance = /^build provenance$/i.test(title);
      method = block = null;
      if (provenance) continue;
      const [first] = title.split(/\s+/);
      const id = first.toUpperCase();
      const rest = title.slice(first.length).trim();
      if (section === 'own') {
        if (!/^OWN-\d{2}$/.test(id)) report(at, `${id} is not an own entry: number entries OWN-01, OWN-02 and so on`);
        else if (seen.entry.has(id)) report(at, `${id} appears more than once; only the first is read`);
        else {
          block = open('entry', id, at, { title: rest });
          seen.entry.set(id, block);
          continue;
        }
      } else if (methodIds.has(id)) {
        if (seen.method.has(id)) report(at, `${id} appears more than once; only the first is read`);
        else {
          method = block = open('method', id, at);
          seen.method.set(id, block);
          // The title is rewritten from the data, so anything else written on the heading is lost.
          if (!sameTitle(rest, titles.get(id))) {
            report(at, `the heading of ${id} reads "${rest}", but the method is "${sentenceCase(titles.get(id))}": text on a heading is not read`, block);
          }
          continue;
        }
      } else {
        report(at, section === 'profile'
          ? `the profile worksheet has no ## headings: "## ${title}" is not read`
          : `"## ${title}" is not a safe method of ${section}`);
      }
      method = block = open('set-aside', id, at);
      continue;
    }
    if (heading && heading[1].length === 3) {
      const [first, ...after] = heading[2].trim().split(/\s+/);
      const id = first.toUpperCase();
      const known = asked.get(id);
      if (!known) {
        report(at, notes.has(id) ? `${id} is a note in the pack, not a question to answer` : `${id} is not a question in this worksheet`);
        block = open('set-aside', id, at);
      } else if (seen.question.has(id)) {
        report(at, `${id} appears more than once; only the first is read`);
        block = open('set-aside', id, at);
      } else {
        block = open('question', id, at, { prompt: known.prompt });
        seen.question.set(id, block);
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
        // Only a changed or added line is a problem: someone may have typed an answer on it.
        // A deleted question line loses nothing.
        if (!block.prompt.includes(line.replace(/^>[ \t]?/, ''))) {
          report(at, 'this line starting > is not what the pack asks, and lines starting > are not read: put any answer after Answer:', block);
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
      const name = FIELD_NAMES.get(match[1].toLowerCase());
      const allowed = FIELDS_OF[block?.kind];
      field = { line: at, lines: [], block: null };
      if (!allowed) report(at, `${match[1]} is not read: a field belongs under a heading`);
      else if (!allowed.includes(name)) report(at, `${match[1]} is not a field of ${block.kind === 'entry' ? 'an own entry' : `a ${block.kind}`}: the fields are ${allowed.join(', ')}`, block);
      else if (block.fields.has(name)) report(at, `${name} is given twice in ${block.id}; only the first is read`, block);
      else {
        field.block = block;
        block.fields.set(name, field);
      }
      if (match[2].trim() !== '') take(field, match[2].trim(), at);
    } else {
      report(at, 'line not understood: a field starts with its name and a colon, and a value carries on to a line that starts with two spaces', block);
    }
  }
  if (comment) report(comment[0].at, 'a comment that starts here is never closed, so nothing after it is read');

  // Pass 2: blocks into records, checked field by field.
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
      const hints = [...HINT_TEXTS, ...(question.elseText ? [`${HINTS['yes-no-else']} ${question.elseText}`.toLowerCase()] : [])];
      const read = record.answer.split('\n').some((line) => hints.includes(line.trim().replace(/\s+/g, ' ').toLowerCase()))
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
    if (record.kind && !OWN_KINDS.includes(record.kind)) report(lineOf(b, 'Kind'), `${b.id}: Kind "${record.kind}" is not additional or special-process`, b);
    if (record.limit && !record.limitSource) report(lineOf(b, 'Limit-source'), `${b.id} has a Limit, so it needs a Limit-source saying where the figure comes from`, b);
    const review = /^(\d{4}-\d{2}-\d{2})\s+\S/.exec(record.ehReview);
    if (record.ehReview && record.ehReview !== 'pending' && !(review && isIsoDate(review[1]))) {
      report(lineOf(b, 'EH-review'), `${b.id}: EH-review is pending, or a date written YYYY-MM-DD and the outcome`, b);
    }
    checkState(b, b.id, record.state, OWN_FIELDS.filter((name) => name !== 'State'));
    if (record.state === 'proposed' || record.state === 'confirmed') {
      needs(b, b.id, ['Kind'], record.state);
      if (OWN_KINDS.includes(record.kind)) needs(b, b.id, KIND_NEEDS[record.kind], `${record.state} and ${record.kind}`);
    }
    record.answered = record.state === 'confirmed' && !b.faulty;
    parsed.entries.set(b.id, record);
  }
  return finish();
}

// A parsed worksheet as JSON: each Map becomes an object in the same order.
export const worksheetJson = (parsed) =>
  JSON.stringify(parsed, (_, value) => (value instanceof Map ? Object.fromEntries(value) : value), 2);

const USAGE = `usage: uk-food.mjs <command> [options]

commands:
  validate-data [--data DIR]                         check the data files; exit 0 when valid, 1 when not
  worksheet --section SECTION [--data DIR]           print a blank answer worksheet; SECTION is one of
                                                     XC, CL, CH, CK, MG, profile, own
  parse-worksheet --file FILE [--data DIR] [--json]  check a worksheet: print its problems (or, with
                                                     --json, what was read); exit 0 with no problems,
                                                     1 with problems
`;

export function validateDataCommand(args, io = { out: console.log, err: console.error }) {
  let dir = DEFAULT_DATA_DIR;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1] !== undefined) dir = args[++i];
    else return usageError(io, `unexpected argument: ${args[i]}`);
  }
  let errors;
  try {
    errors = validateData(loadData(dir));
  } catch (error) {
    errors = [error.message];
  }
  if (errors.length) {
    for (const message of errors) io.err(message);
    return 1;
  }
  io.out('data is valid');
  return 0;
}

function usageError(io, message) {
  io.err(`${message}\n${USAGE}`);
  return 2;
}

// Reads `--name value` options and bare `--flag`s; anything else is an error.
function readOptions(args, valued, flags = []) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const name = args[i].startsWith('--') ? args[i].slice(2) : null;
    if (valued.includes(name) && args[i + 1] !== undefined) options[name] = args[++i];
    else if (flags.includes(name)) options[name] = true;
    else return { error: `unexpected argument: ${args[i]}` };
  }
  return { options };
}

// Loads the data and checks it. Data that will not load or is not valid is an input error.
function loadValidData(dir) {
  try {
    const data = loadData(dir);
    const errors = validateData(data);
    return errors.length ? { error: errors.join('\n') } : { data };
  } catch (error) {
    return { error: error.message };
  }
}

export function worksheetCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['section', 'data']);
  if (error) return usageError(io, error);
  if (!WORKSHEET_SECTIONS.includes(options.section)) {
    return usageError(io, `--section is one of ${WORKSHEET_SECTIONS.join(', ')}`);
  }
  const dir = options.data ?? DEFAULT_DATA_DIR;
  const { data, error: dataError } = loadValidData(dir);
  if (dataError) return usageError(io, dataError);
  if (SECTION_IDS.includes(options.section) && !data.sections.has(options.section)) {
    return usageError(io, `the data in ${dir} has no ${options.section}.json`);
  }
  io.out(blankWorksheet(options.section, data).replace(/\n$/, ''));
  return 0;
}

export function parseWorksheetCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['file', 'data'], ['json']);
  if (error) return usageError(io, error);
  if (!options.file) return usageError(io, 'parse-worksheet needs --file');
  let text;
  try {
    text = readFileSync(options.file, 'utf8');
  } catch (readError) {
    return usageError(io, `cannot read ${options.file}: ${readError.message}`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return usageError(io, dataError);
  const parsed = parseWorksheet(text, data);
  if (options.json) io.out(worksheetJson(parsed));
  else if (parsed.problems.length === 0) io.out(`${options.file}: no problems`);
  else for (const { line, message } of parsed.problems) io.out(`${options.file}:${line}: ${message}`);
  return parsed.problems.length ? 1 : 0;
}

// Later tasks add render, check, reference, status and sign-off here.
export const COMMANDS = {
  'validate-data': validateDataCommand,
  worksheet: worksheetCommand,
  'parse-worksheet': parseWorksheetCommand
};

export function main(argv, io = { out: console.log, err: console.error }) {
  const [name, ...rest] = argv;
  const command = Object.hasOwn(COMMANDS, name ?? '') ? COMMANDS[name] : null;
  if (!command) return usageError(io, name ? `unknown command: ${name}` : 'no command given');
  return command(rest, io);
}

if (process.argv[1]) {
  let direct = false;
  try {
    direct = realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    direct = false;
  }
  if (direct) process.exitCode = main(process.argv.slice(2));
}
