import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
export { diaryPage, isObject, isString, isWords };

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
// Words to print: a string with something in it. The modules that read the pack's forms (lists and sheets)
// print a label only when it is words.
const isWords = (value) => isString(value) && value !== '';
// A page of the diary and record sheets (diary.json) by its page number, or undefined when the data has none.
const diaryPage = (data, page) => data.diary?.pages?.find((p) => p.page === page);

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
