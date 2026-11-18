#!/usr/bin/env node
// UK food overlay helper. Standard library only.
// Commands are entries in COMMANDS; each is one exported function returning an exit code.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, realpathSync, renameSync, rmdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
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
const quotedFrom = (section, source) => `${QUOTED[section] ?? QUOTED_LINES} the ${source.publisher}'s ${source.title}, ` +
  `retrieved ${longDate(source.retrieved)}. ${source.attribution}`;

// The Markdown lint rules a worksheet cannot meet without changing the pack's words or the
// worksheet grammar, each turned off in that worksheet with its reason beside it.
const LINT_EXCEPTIONS = {
  profile: [['MD001', 'the profile has no methods, so its ### questions sit straight under the # title, as the worksheet grammar sets out']]
};

// The guidance comment each worksheet carries after its marker: how to fill it in, then where the
// pack's words in it come from (left out only for data that names no source), then, in the own
// worksheet, the entry to copy.
const guidanceFor = (section, data) => [
  ...(section === 'own' ? OWN_GUIDANCE : section === 'profile' ? ANSWER_GUIDANCE : [...ANSWER_GUIDANCE, ...STATUS_GUIDANCE]),
  ...(isObject(data.source) ? [quotedFrom(section, data.source)] : []),
  ...(section === 'own' ? OWN_TEMPLATE : [])
];

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
const FIELDS_OF = { method: METHOD_FIELDS, question: ANSWER_FIELDS, entry: OWN_FIELDS };

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
function readWorksheet(text, data) {
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
  layout.marker = markerLine;
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
  const guidance = ['<!--', ...guidanceFor(section, data), '-->'];
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
      if ((looks && FIELD_NAMES.has(looks[1].toLowerCase())) || /^#{1,6}[ \t]/.test(text)) {
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
    const heading = /^(#+)[ \t]+(\S.*)$/s.exec(line);
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
          // The title is printed in the documents, so it is a value like any other.
          hidden(lines[i], at, block);
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
      const name = FIELD_NAMES.get(match[1].toLowerCase());
      const allowed = FIELDS_OF[block?.kind];
      field = { line: at, lines: [], block: null, name: match[1], empty: match[2].trim() === '' };
      if (!allowed) report(at, `${match[1]} is not read: a field belongs under a heading`);
      else if (!allowed.includes(name)) report(at, `${match[1]} is not a field of ${block.kind === 'entry' ? 'an own entry' : `a ${block.kind}`}: the fields are ${allowed.join(', ')}`, block);
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
// whether its guidance comment is missing altogether. '' when nothing is.
const otherWording = ({ wording, noGuidance }, where = false) => {
  const n = wording.length;
  const lines = n ? `${counted(n, 'line', 'lines')} of its ${noGuidance ? '' : 'guidance or '}question wording ${isAre(n)} not what this ` +
    `version prints${where ? `, the first at line ${Math.min(...wording)}` : ''}` : '';
  return noGuidance ? `its guidance comment is missing${n ? `, and ${lines}` : ''}` : lines;
};
// What the strict parser says, once for the whole worksheet, of wording that is not this helper's.
const wordingProblem = (layout) => `this worksheet was made by a different version of the overlay: ${otherWording(layout, true)}. ` +
  `${layout.wording.length ? 'Nothing typed on such lines is read. ' : ''}Run upgrade-worksheet --file on this worksheet: it shows each ` +
  'line it would take out or put in and writes nothing, and with --write it brings the worksheet up to date, keeping a copy of it as it ' +
  'is. Anything a person typed on a line it takes out cannot be told from old wording, so a person reads what it shows before it is ' +
  'written. An answer belongs after Answer:, and an own entry below the opening comment.';

// Reads a worksheet strictly: readWorksheet's `parsed`, with one more problem when any of the tool's own
// wording in it is not what this helper prints. A worksheet with a problem counts nowhere, so no answer
// of one made by another version is used until it has been brought up to date.
// `strictWorksheet` gives, beside it, what differs in a few words (`otherVersion`, '' when nothing does).
// A worksheet that could not be read as far as its section has no wording to compare.
function strictWorksheet(text, data) {
  const { parsed, layout } = readWorksheet(text, data);
  const otherVersion = parsed.section === null ? '' : otherWording(layout);
  if (otherVersion) {
    parsed.problems.push({ line: Math.min(...layout.wording, ...(layout.noGuidance ? [layout.marker] : [])), message: wordingProblem(layout) });
    parsed.problems.sort((a, b) => a.line - b.line);
  }
  return { parsed, otherVersion };
}
export const parseWorksheet = (text, data) => strictWorksheet(text, data).parsed;

// What a person typed in a worksheet, as readWorksheet read it, without the line numbers it was read
// from: two worksheets that give the same text here say the same.
const typedIn = (parsed) => JSON.stringify([[...parsed.methods], [...parsed.answers], [...parsed.entries]],
  (name, value) => (name === 'line' ? undefined : value instanceof Map ? [...value] : value));

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
export function upgradeWorksheet(text, data) {
  const leave = 'Nothing has been changed.';
  const { parsed, layout } = readWorksheet(text, data);
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
  const after = readWorksheet(upgraded, data);
  if (after.parsed.problems.length || otherWording(after.layout) || typedIn(after.parsed) !== typedIn(parsed)) {
    return { exit: 1, messages: ['brought up to date, the worksheet would not read the same as it does now, so it is not ' +
      `written: ${after.parsed.problems[0]?.message ?? 'an answer, state, name, date or entry would differ'}. ${leave}`] };
  }
  return { exit: 0, text: upgraded, section, changes: changes.sort((a, b) => a.from - b.from) };
}

// A parsed worksheet as JSON: each Map becomes an object in the same order.
export const worksheetJson = (parsed) =>
  JSON.stringify(parsed, (_, value) => (value instanceof Map ? Object.fromEntries(value) : value), 2);

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

export const SECTION_DOCS = { FOODXC: 'XC', FOODCLN: 'CL', FOODCHL: 'CH', FOODCOOK: 'CK', FOODMGT: 'MG' };
export const DOC_CODES = [...Object.keys(SECTION_DOCS), 'FOODPROF', 'FOODOWN'];
// The completion record: rendered and checked like the documents above, but it reports on them, so it
// is neither in their status nor signed off itself. See the status part below.
export const COMPLETION_RECORD = 'FOODCMP';
const RENDERED_CODES = [...DOC_CODES, COMPLETION_RECORD];
export const UNANSWERED = '**NOT YET ANSWERED**';
// Printed before every answer in a business's document, and before the unanswered and proposed strings.
export const OUR_ANSWER = '**Our answer:** ';
const END_MARKER = '<!-- UK-FOOD:END -->';
// The BEGIN marker names the document, the data and the hash of the body: see bodyHash.
const BEGIN_MARKER = /^<!-- UK-FOOD:BEGIN doc=(\S+) data=(\S+) body=(\S+) -->$/;
const beginMarker = (doc, hash) => `<!-- UK-FOOD:BEGIN doc=${doc} data=${DATA_ID} body=${hash} -->`;
// The worksheets in the order they are read.
const SHEET_ORDER = ['profile', ...SECTION_IDS, 'own'];
// The worksheets a document renders from, and those it cannot be rendered without. The profile
// document says which section worksheets and own worksheet are missing; the others refuse.
const sourcesOf = (doc) => {
  if (doc === 'FOODPROF') return { uses: SHEET_ORDER, needs: ['profile'] };
  const own = SECTION_DOCS[doc] ?? 'own';
  return { uses: ['profile', own], needs: ['profile', own] };
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
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
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
// The helper itself, for the commands a message tells a person to run next.
const HELPER = fileURLToPath(import.meta.url);
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
const longDate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
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

// The cells of one row. A question goes in the first column of those it takes. `view.parts` gives
// what to print of a question, and `view.answer` its answer, or null to print none.
function rowCells(row, layout, view) {
  const cells = Array.from({ length: layout.width }, () => []);
  if (row.point) cells[0].push(row.point);
  if (row.why) cells[Number(layout.hasPoint)].push(row.why);
  const questions = row.questions ?? [];
  placements(questions, layout).places.forEach(({ at }, i) => {
    const answer = questions[i].type === 'note' ? null : view.answer(questions[i]);
    const lines = [...view.parts(questions[i]), ...(answer ? [answer] : [])];
    if (lines.length) cells[at].push(lines.join('\n'));
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

// A safe method. `view.method` gives the business's record of it (null in the reference, which
// prints no status and no variation line); `view.parts` and `view.answer` what to print of a question.
function methodChunks(method, view) {
  const heading = [`### ${method.id} ${method.title}`];
  const record = view.method(method.id);
  if (record?.status === 'not-relevant') {
    return [heading, [`Not relevant to this business: ${said(record.reason)} (decided by ${said(record.decidedBy)}).`]];
  }
  const chunks = [heading, ...paragraphs(method.summary), ...method.blocks.flatMap((block) => blockChunks(block, view))];
  if (record?.status !== 'adapted') return chunks;
  return [...chunks, [`Our variation: ${said(record.variation)} Reason: ${said(record.reason)} Shown to be safe by: ` +
    `${said(record.provedSafe)} Decided by: ${said(record.decidedBy)}`]];
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

// Whether the lines of a rendered body of `doc` show that the document is unfinished: a question not yet
// answered (UNANSWERED, wherever answerOf prints it), or, in the own methods document, an own entry not
// yet confirmed (the line notConfirmed prints). sign-off refuses a document with either outstanding, so
// a body that shows one was never signed off through this helper. The profile also lists own entries
// not yet confirmed, but it is finished when its own questions are, so that line counts for nothing
// there. A business's own words cannot make either mark: businessText escapes the asterisks, an answer
// never starts a line of its own, and the lines of a procedure printed word for word in a fenced code
// block are not read here.
function showsUnfinished(doc, inner) {
  let fence = null;
  for (const line of inner) {
    if (fence) {
      if (line === fence) fence = null;
    } else if (/^`{3,}text$/.test(line)) fence = line.slice(0, -'text'.length);
    else if (line.includes(UNANSWERED) || (doc === 'FOODOWN' && line.startsWith(NOT_CONFIRMED))) return true;
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

// Reads and parses a project's worksheets: those of `sections`, every one unless given, in SHEET_ORDER.
// This is the one place a worksheet is read. Returns a Map from section to null when its file does not
// exist; to { section, name, file, readError } when it cannot be read; or to { section, name, file,
// text, parsed, problems, wrongData, belongsTo, clean }. `problems` are the parser's, exactly what
// parse-worksheet lists, as file:line: message. A worksheet for other data has `wrongData`; one in the
// wrong file has `belongsTo`, the section it is the worksheet of. Neither is clean.
function readWorksheets(project, data, sections = SHEET_ORDER) {
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
    Object.assign(sheet, strictWorksheet(sheet.text, data));
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
function readSources(doc, project, data) {
  const { uses, needs } = sourcesOf(doc);
  const sheets = readWorksheets(project, data, uses);
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
// or { exit, messages }; nothing is rendered from a worksheet the parser could not read cleanly.
export function renderDocument(doc, project, data) {
  if (doc === COMPLETION_RECORD) return completionRecordDocument(project, data);
  if (!DOC_CODES.includes(doc)) return { exit: 2, messages: [`--doc is one of ${RENDERED_CODES.join(', ')}`] };
  const section = SECTION_DOCS[doc];
  // The profile quotes the special-processes paragraph from CK.json.
  const dataNeeded = section ?? (doc === 'FOODPROF' ? 'CK' : null);
  if (dataNeeded && !data.sections.has(dataNeeded)) return { exit: 2, messages: [`the data has no ${dataNeeded}.json`] };
  if (doc === 'FOODPROF' && !extraCareParagraph(data)) {
    return { exit: 2, messages: [`the data's CK.json has no text box in ${EXTRA_CARE_BOX.method} on page ${EXTRA_CARE_BOX.page}, ` +
      'whose first paragraph the profile quotes about special processes and foods'] };
  }
  const read = readSources(doc, project, data);
  if (read.exit) return read;
  let body;
  if (section) body = sectionChunks(data.sections.get(section), sectionView(read.sources.get(section).parsed));
  else body = doc === 'FOODPROF' ? profileChunks(read.sources, data) : ownChunks(read.sources);
  const profile = read.sources.get('profile').parsed;
  const name = profile.answers.get(NAME_QUESTION);
  const chunks = [...coverageChunks(profile), ...body, [closingNotice(name?.answered ? name.answer : null)],
    [doc === 'FOODOWN' ? OWN_SOURCE_LINE : sourceLine(data.source)]];
  return { exit: 0, text: bodyText(doc, chunks) };
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
// each template has above its body by its fingerprint (the three gathering templates share one, the
// check template has its own). A test reads the templates, so a comment changed there shows. The
// last is the gathering templates' note as it read before it said what a sign-off leaves out: a
// document written then keeps it, and it stays part of that document's frame.
const FRAME_COMMENTS = ['<!-- DOC-CONTROL-HEADER -->', '<!-- Resolved at command-execution time per _partials/RENDERING.md. -->',
  '<!-- UK-FOOD-BODY -->', PROVENANCE.start, PROVENANCE.end];
const FRAME_NOTES = ['6fe5a55718f40fbb5aeb1fc5e03f5caf629c07c15985ce122b9899ca8737f8d3', 'a9b0cbc3f58b12aca743acb7e344f5b2a998e6231116b621ddd6cfa3d8e8d3d9',
  '33f1bc78a00361c791b1a3651a9c23e5607d926a4ca07af57592625991e1908d'];
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
// - The completion record is a report that nobody signs, so it says nothing but DRAFT and [PENDING].
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
  const report = doc === COMPLETION_RECORD;
  const nobody = 'the completion record is a report that nobody signs';
  // Why a claim on this file has no sign-off behind it, as a message says it and as a reason does.
  const [none, noneOfIt] = recorded
    ? ['the document still shows a question not yet answered or an entry not yet confirmed, and one that does is never signed off',
      'it still shows a question not yet answered or an entry not yet confirmed, and a document that does is never signed off']
    : ['no sign-off is recorded for this file', 'no sign-off is recorded for it'];
  for (const { field, line, value, typed } of claims.rows) {
    const says = `${field} is "${value}"`;
    if (report) {
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
    const signed = report || untaken ? null : signings.filter((record) => record.version === row.version).at(-1) ?? null;
    const back = 'put that row\'s Approved By and Approval Date back to [PENDING]';
    if (!signed) {
      const why = report ? nobody : untaken && recorded ? none : 'no sign-off is recorded for that version';
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
export function checkDocument(doc, project, report, data, signOffs = readSignOffs(project)) {
  let text;
  try {
    text = readFileSync(report, 'utf8');
  } catch (error) {
    return { exit: 2, kind: 'unreadable', messages: [`cannot read ${report}: ${error.message}`],
      reason: `cannot be read (${error.message}): check that the file is there and can be opened` };
  }
  const lines = documentLines(text);
  const body = findBody(lines, doc);
  if (body.problem) {
    return { exit: 1, ok: false, kind: 'markers', line: body.line, message: `${report}:${body.line ? `${body.line}:` : ''} ${body.problem}`,
      reason: `has its UK-FOOD markers missing or damaged (${body.problem}${body.line ? `, at line ${body.line}` : ''}): write the ` +
        'document again from its worksheet' };
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
  const fresh = renderDocument(doc, project, data);
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
    // The completion record also depends on which documents are written, in step and signed off, so
    // any difference means it no longer matches the project.
    let kind = 'edited';
    let what = `this line is not what a fresh render of ${doc} gives.`;
    let reason = `was changed between its UK-FOOD markers, at line ${line}: make the change in its worksheet instead, and write ` +
      'the document again from its worksheet';
    if (doc === COMPLETION_RECORD) {
      kind = 'stale';
      what = COMPLETION_STALE;
      reason = 'is out of date, as it no longer matches the project: render it again';
    } else if (intact) {
      kind = 'stale';
      what = 'the worksheets have changed since this body was rendered: render the document again.';
      reason = 'is out of date, as its worksheets have changed since it was written: write the document again from its worksheet';
    }
    const [want, got] = [expected[at] ?? '', region[at] ?? ''];
    const { column, expectedChar, foundChar } = firstDifference(want, got);
    return failed(kind, line, `${what} The lines first differ at column ${column}, where the render has ${expectedChar} ` +
      `and the file has ${foundChar}.\n  expected: ${want}\n  found:    ${got}` + (doc === COMPLETION_RECORD ? '' : `\n${CHECK_ADVICE}`),
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
// Returns { options, data }, { usage } for a usage error or { input } for data that will not load.
function documentOptions(args, valued, flags = []) {
  const { options, error } = readOptions(args, ['doc', 'project', 'data', ...valued], flags);
  if (error) return { usage: error };
  if (!RENDERED_CODES.includes(options.doc)) return { usage: `--doc is one of ${RENDERED_CODES.join(', ')}` };
  if (!options.project) return { usage: '--project names the project folder that holds food-safety/' };
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  return dataError ? { input: dataError } : { options, data };
}

export function renderCommand(args, io = { out: console.log, err: console.error }) {
  const { options, data, usage, input } = documentOptions(args, []);
  if (usage) return usageError(io, usage);
  if (input) return failure(io, { exit: 2, messages: [input] });
  const result = renderDocument(options.doc, options.project, data);
  if (result.exit) return failure(io, result);
  io.out(result.text);
  return 0;
}

export function checkCommand(args, io = { out: console.log, err: console.error }) {
  const { options, data, usage, input } = documentOptions(args, ['report'], ['json']);
  if (usage) return usageError(io, usage);
  if (!options.report) return usageError(io, 'check needs --report: the document to check');
  if (input) return failure(io, { exit: 2, messages: [input] });
  const result = checkDocument(options.doc, options.project, options.report, data);
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
  if (!SECTION_IDS.includes(options.section)) return usageError(io, `--section is one of ${SECTION_IDS.join(', ')}`);
  const dir = options.data ?? DEFAULT_DATA_DIR;
  const { data, error: dataError } = loadValidData(dir);
  if (dataError) return failure(io, { exit: 2, messages: [dataError] });
  if (!data.sections.has(options.section)) return failure(io, { exit: 2, messages: [`the data in ${dir} has no ${options.section}.json`] });
  io.out(referenceText(options.section, data));
  return 0;
}

// ---------------------------------------------------------------------------------------------
// Status, the completion record and sign-off.
//
// `status` says, for each document, how far its worksheets have got, whether the document is written
// and in step with them, and whether a named person has signed it off; then whether the completion
// record is up to date; then the special processes and foods the business does, with the own entries
// that cover them; then, in plain English, everything that is not finished. The completion record, FOODCMP, is the pack's own record (diary pages 78 and
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

// The documents status lists, in its order. The completion record is not one: it reports on them.
export const STATUS_ORDER = ['FOODPROF', ...Object.keys(SECTION_DOCS), 'FOODOWN'];
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
const NOTHING_OUTSTANDING = 'Nothing is outstanding.';
// The rows of the pack's completion record whose wording differs from their safe method's title,
// spelt as printed on page 78. A test ties each to the data.
export const COMPLETION_ROWS = { 'Personal hygiene': 'XC-01', 'Food allergies': 'XC-04' };
const COMPLETION_FORM = 'completionRecord';
const COMPLETION_STALE = 'this completion record is out of date: it no longer matches the project\'s worksheets, documents ' +
  'and sign-offs, or it was edited. It is generated, so it is not changed by hand: render it again.';
const DOCUMENT_FILE = /^ARC-\d{3}-([A-Z]+)-v(\d+(?:\.\d+)*)\.md$/;
// What the completion record and status call the documents that are not a section's.
const DOC_NAMES = { FOODPROF: 'Business profile', FOODOWN: 'Own methods' };
const DOC_OF_SECTION = Object.fromEntries(Object.entries(SECTION_DOCS).map(([doc, section]) => [section, doc]));
const docName = (code, data) => DOC_NAMES[code] ?? sentenceCase(data.sections.get(SECTION_DOCS[code]).section.title);
// A sign-off's name or role: some text, on one line, with no tab and none of the UNSEEN characters.
const isPersonText = (value) => isString(value) && value.trim() !== '' && !/[\t\n\r]/.test(value) && !unseenIn(value);
const counted = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const signOffsFile = (project) => join(project, 'food-safety', 'sign-offs.json');
const localToday = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-');
};

// The worksheets a document reads, its own first: a section document and the own methods document
// read their own worksheet and the profile, and the profile reads every worksheet. `needs` are those
// it cannot be rendered without.
const worksheetsOf = (code) => {
  const { uses, needs } = sourcesOf(code);
  const own = SECTION_DOCS[code] ?? (code === 'FOODOWN' ? 'own' : 'profile');
  return { reads: [own, ...uses.filter((section) => section !== own)], needs };
};

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

// How many questions a person must answer for a document, from its own worksheet, and where they
// stand: the profile's questions; an own worksheet's entries, each confirmed when the parser marks it
// answered; or a section's questions under the methods not marked not relevant. With the identifiers
// of those not yet answered and of those only proposed, in order. Nothing in a worksheet with problems
// counts as confirmed, and no method's status is read from one: each method then counts as applying,
// as in a blank worksheet.
function countsOf(code, sheet, data) {
  const parsed = sheet?.parsed;
  const counts = { questions: 0, confirmed: 0, proposed: 0, notRelevantMethods: [], adaptedMethods: [], unansweredIds: [], proposedIds: [] };
  const count = (id, record) => {
    counts.questions++;
    if (sheet?.clean && record?.answered) counts.confirmed++;
    else if (record?.state === 'proposed') {
      counts.proposed++;
      counts.proposedIds.push(id);
    } else counts.unansweredIds.push(id);
  };
  if (code === 'FOODPROF') PROFILE_QUESTIONS.forEach((question) => count(question.id, parsed?.answers.get(question.id)));
  else if (code === 'FOODOWN') [...(parsed?.entries.values() ?? [])].forEach((entry) => count(entry.id, entry));
  else {
    for (const method of data.sections.get(SECTION_DOCS[code]).methods) {
      const status = sheet?.clean ? parsed.methods.get(method.id)?.status : 'applies';
      if (status === 'not-relevant') {
        counts.notRelevantMethods.push(method.id);
        continue;
      }
      if (status === 'adapted') counts.adaptedMethods.push(method.id);
      for (const { question } of methodQuestions(method)) count(question.id, parsed?.answers.get(question.id));
    }
  }
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
// Up to five identifiers, then how many more.
const someOf = (ids) => (ids.length <= 5 ? andList(ids) : `${ids.slice(0, 5).join(', ')} and ${ids.length - 5} more`);
const isAre = (n) => (n === 1 ? 'is' : 'are');
const NOT_WRITTEN = 'document not written yet: write the document from its worksheet';
const NOT_SIGNED = 'document not signed off yet: once it is finished, a named person signs it off';
const notStartedLine = (section) => `worksheet ${sheetPath(section)} is not started yet: make it with worksheet --section ` +
  `${section} and fill it in`;
const problemsLine = (section, n) => `worksheet ${sheetPath(section)} has ${counted(n, 'problem', 'problems')}, so none of ` +
  `its answers counts until ${n === 1 ? 'it is' : 'they are'} fixed: parse-worksheet --file ${sheetPath(section)} lists ` +
  `${n === 1 ? 'it' : 'them'}`;
// A worksheet whose only problem is that its wording is another version's: what to run, by its path.
const otherWordingLine = (section, what) => `worksheet ${sheetPath(section)} was made by a different version of the overlay ` +
  `(${what}), so none of its answers counts until it is brought up to date: upgrade-worksheet --file ${sheetPath(section)} shows ` +
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
// A cell sign-off rewrites that holds something the commands do not write there (unwrittenCells).
const cellLine = (file, { line, field, typed, want }) => `document ${file} has ${typed === '' ? 'nothing' : `"${typed}"`} in ` +
  `${field}, at line ${line}, a cell the sign-off step rewrites: write ${want} there first, so that marking the document as ` +
  'signed off changes nothing else in the file';
const otherVersionLine = (record, current) => `this is version ${current.version}, and the newest sign-off is ${record.name}'s ` +
  `of version ${record.version}, on ${record.date}: once this version is finished, a named person signs it off`;
const goneLine = (record) => `${record.file}, which ${record.name} signed off on ${record.date}, is not in the project folder: ` +
  'put it back, or sign the document off again once it is written';
// The line for a document that is not signed off: null when the lines before it already say everything.
// `asSigned` is true when the newest sign-off names the current file and holds the hashes it has now.
function signLine(record, current, check, asSigned) {
  if (!record) return NOT_SIGNED;
  if (!current) return goneLine(record);
  if (record.file !== current.file || record.version !== current.version) return otherVersionLine(record, current);
  if (check.unfinished && check.hashes?.body === record.body) return unsoundLine(record);
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
// What a document asks a person to answer: questions, or for the own methods document its entries.
const nounsOf = (code) => (code === 'FOODOWN' ? ['own entry', 'own entries'] : ['question', 'questions']);

// The lines for a document's questions not yet answered and its answers only proposed, naming the
// worksheet and up to five identifiers.
function countLines(code, counts, section) {
  const entries = code === 'FOODOWN';
  const [one, many] = nounsOf(code);
  const how = `${entries ? 'an entry' : 'an answer'} counts when its State is confirmed and By and On are filled in`;
  const { unansweredIds: open, proposedIds: proposed } = counts;
  return [
    ...(open.length ? [`${counted(open.length, one, many)} in ${sheetPath(section)} ${isAre(open.length)} not yet ` +
      `${entries ? 'confirmed' : 'answered'} (${someOf(open)}): ${how}`] : []),
    ...(proposed.length ? [`${counted(proposed.length, entries ? one : 'answer', entries ? many : 'answers')} in ` +
      `${sheetPath(section)} ${isAre(proposed.length)} proposed but not confirmed (${someOf(proposed)}): ${how}`] : [])
  ];
}

// Everything status reports, with what sign-off and the completion record need besides: { status,
// sheets, hashes, blockers, signOffs }, or { exit: 2, messages } when the project cannot be read.
// `hashes` holds each written document's own two hashes (documentHashes), which a sign-off records.
// `blockers` holds, for each document, what keeps it from being finished: { what, sheet, after }, where
// `sheet` is the worksheet a line is about (null for the document's own lines) and `after` marks a
// line the unfinished list gives after the documents.
function collectStatus(project, data) {
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
  const sheets = readWorksheets(project, data);
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
    const { reads, needs } = worksheetsOf(code);
    const current = files.get(code) ?? null;
    const check = current ? checkDocument(code, project, join(project, current.file), data, signOffs) : null;
    const inSync = check?.exit === 0;
    const counts = countsOf(code, sheets.get(reads[0]), data);
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
    const docLines = [
      ...(sheets.get(reads[0])?.clean ? countLines(code, counts, reads[0]) : []),
      ...fileLines,
      // (After a sign-off, check tells such a cell itself, one at a time, with what a signed document has there.)
      ...(check?.cell ? [] : check?.unwritten ?? []).map((cell) => cellLine(current.file, cell))
    ];
    const lineFor = (section) => {
      const sheet = sheets.get(section);
      if (!sheet) return notStartedLine(section);
      if (advice.get(section)) return advice.get(section);
      return sheet.otherVersion && sheet.problems.length === 1 ? otherWordingLine(section, sheet.otherVersion)
        : problemsLine(section, sheet.problems.length);
    };
    const held = [
      ...reads.filter((section) => missing.includes(section) || wrong.includes(section) || troubled.includes(section))
        .map((section) => ({ what: lineFor(section), sheet: section })),
      // A file that is no longer the one signed is put right by signing it again, so that line is
      // told, and keeps the document from counting as signed off, but does not stop a new sign-off.
      ...docLines.map((what) => ({ what, sheet: null, resign: check?.kind === 'not-as-signed' && what === fileLines[0] })),
      ...(code === 'FOODOWN' ? uncovered : []).map((what) => ({ what, sheet: null, after: true }))
    ];
    const record = signOffs.records.filter((entry) => entry.doc === code).at(-1) ?? null;
    // Signed off only when finished, and the newest sign-off for it names this file and holds the two
    // hashes the file has now: what was signed is what is there, inside the markers and outside them.
    const asSigned = Boolean(record && current && check.hashes && record.file === current.file &&
      record.version === current.version && record.body === check.hashes.body && record.outside === check.hashes.outside);
    doc.signedOff = held.length === 0 && asSigned;
    doc.signOff = record;
    doc.headerShowsSignOff = headerShowsSignOff;
    signLines.set(code, doc.signedOff ? null : signLine(record, current, check, asSigned));
    checks.set(code, check);
    hashes.set(code, check?.hashes ?? null);
    blockers.set(code, held);
    return doc;
  });
  // The unfinished list tells each worksheet's state once, under the document it belongs to, then the
  // special processes with no entry and the entries awaiting review.
  const unfinished = documents.flatMap((doc) => {
    const [mine] = worksheetsOf(doc.code).reads;
    const lines = blockers.get(doc.code).filter(({ sheet, after }) => !after && (sheet === null || sheet === mine)).map(({ what }) => what);
    if (signLines.get(doc.code)) lines.push(signLines.get(doc.code));
    return lines.map((what) => ({ code: doc.code, what }));
  });
  unfinished.push(...uncovered.map((what) => ({ code: 'FOODOWN', what })),
    ...awaiting.map((entry) => ({ code: 'FOODOWN', what: awaitingLine(entry) })));
  let started = false;
  try {
    started = statSync(join(project, 'food-safety')).isDirectory();
  } catch {
    started = false;
  }
  // `completionRecord` is filled in by fullStatus: the record is rendered from this status, so its own
  // state cannot be part of what it is rendered from.
  const status = { data: DATA_ID, documents, specialProcesses, ownAwaitingReview: awaiting.map((entry) => entry.id), unfinished,
    completionRecord: null, foodSafetyFolder: started };
  return { status, sheets, hashes, blockers, signOffs, checks, record: files.get(COMPLETION_RECORD) ?? null };
}

// Where the completion record stands: null when it is not written, else { file, version, inSync, problem },
// `problem` being check's own reason when it fails. It is told beside the documents, never among them or
// in the unfinished list: the record prints that list, so a line there about the record could never be
// true of the record that holds it.
function completionRecordState(project, data, collected) {
  const current = collected.record;
  if (!current) return null;
  const check = checkDocument(COMPLETION_RECORD, project, join(project, current.file), data, collected.signOffs);
  return { file: current.file, version: current.version, inSync: check.exit === 0, problem: check.exit === 0 ? null : checkLine(current.file, check) };
}

// Everything status reports, the completion record's own state included: collectStatus's result with
// `status.completionRecord` filled in, or { exit: 2, messages }.
function fullStatus(project, data) {
  const collected = collectStatus(project, data);
  if (collected.exit) return collected;
  collected.status.completionRecord = completionRecordState(project, data, collected);
  return collected;
}

// The status of the project in `project`, as status --json prints it, or { exit: 2, messages }.
export function projectStatus(project, data) {
  const result = fullStatus(project, data);
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
function completionRecordDocument(project, data) {
  const record = completionRecordData(data);
  if (record.error) return { exit: 2, messages: [record.error] };
  const collected = collectStatus(project, data);
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
    [closingNotice(name?.answered ? name.answer : null)],
    [sourceLine(data.source)]
  ];
  return { exit: 0, text: bodyText(COMPLETION_RECORD, chunks) };
}

// Records that a named person has confirmed a document, when it is finished: its worksheets present
// and free of problems, every question confirmed, its current file of the version given and in step,
// each cell of its header that the sign-off step rewrites holding what the commands write there,
// and, for the own methods document, an own entry for each special process the profile confirms.
// A document that holds text outside its checked part (otherText) is recorded only when `person.otherTextRead`
// is 'yes': the person signing has been shown those lines. The refusal lists them.
// `person` is { name, role, version, date, paperSigned, otherTextRead }. Returns { exit: 0, record, message }, or
// { exit, messages }: 1 for a refusal, which writes nothing and gives every reason with what to do
// next, and 2 when the project cannot be read.
export function signOffDocument(code, project, person, data) {
  const collected = collectStatus(project, data);
  if (collected.exit) return collected;
  const { status, hashes, blockers, signOffs } = collected;
  const doc = status.documents.find((d) => d.code === code);
  const reasons = blockers.get(code).filter(({ resign }) => !resign).map(({ what }) => `- ${what}`);
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
// A slip in a header cell of a file whose sign-off is recorded: the record is there, so no claim lacks one, and the
// line under Unfinished says what to write.
const CELL_FAULT = 'with a sign-off recorded, and a cell of its header that is not what a signed document has there: write in it what ' +
  'its line under Unfinished says';
// A document can be signed off while its header still reads DRAFT: the record is made first, and the
// sign-off command then marks the header. That leaves nothing unfinished and blocks nothing, so it is
// not in the unfinished list; the readable status and the completion record each say it in one line.
const MARK_HOW = 'the sign-off command finishes the marking, and no new sign-off is needed';
const unmarked = (doc) => doc.signedOff && doc.headerShowsSignOff === false;

// The status as short lines a person can read: one for each document, then the completion record, the
// special processes and the own entries awaiting review, then what is unfinished. `checks` holds
// check's result for each written document.
function statusLines(status, data, sheets, checks) {
  const lines = [`Food safety status, data ${status.data}${status.foodSafetyFolder ? '' : ': nothing has been started in this folder, ' +
    'which holds no food-safety folder. Check that it is the business\'s project folder'}`];
  for (const doc of status.documents) {
    const [, many] = nounsOf(doc.code);
    const parts = [
      ...(doc.missingWorksheets.length ? [`not started: ${doc.missingWorksheets.join(', ')}`] : []),
      ...(doc.problems ? [counted(doc.problems, 'worksheet problem', 'worksheet problems')] : []),
      `${doc.confirmed} of ${doc.questions} ${many} confirmed${doc.proposed ? `, ${doc.proposed} proposed` : ''}`,
      ...(doc.notRelevantMethods.length ? [`not relevant: ${doc.notRelevantMethods.join(', ')}`] : []),
      ...(doc.adaptedMethods.length ? [`adapted: ${doc.adaptedMethods.join(', ')}`] : []),
      doc.rendered ? `${doc.file} ${doc.inSync ? 'in step with its worksheets' : checks.get(doc.code)?.cell ? CELL_FAULT
        : FAULT_WORDS[checks.get(doc.code)?.kind] ?? NOT_CHECKED}` : 'not written',
      ...(doc.otherText.length ? [`${counted(doc.otherText.length, 'line', 'lines')} outside its checked part`] : []),
      doc.signedOff ? `signed off by ${doc.signOff.name}, ${doc.signOff.role}, on ${doc.signOff.date}` +
        (unmarked(doc) ? `, with its header not yet marked to show it: ${MARK_HOW}` : '') : 'not signed off'
    ];
    lines.push(`${doc.code} (${docName(doc.code, data)}): ${parts.join('; ')}`);
  }
  const record = status.completionRecord;
  lines.push(`${COMPLETION_RECORD} (Completion record): ${!record ? 'not written' : record.problem ?? `${record.file} up to date`}`);
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
  const result = fullStatus(options.project, data);
  if (result.exit) return failure(io, result);
  io.out(options.json ? JSON.stringify(result.status, null, 2) : statusLines(result.status, data, result.sheets, result.checks).join('\n'));
  return 0;
}

export function signOffCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['doc', 'project', 'name', 'role', 'version', 'paper-signed', 'other-text-read', 'date', 'data']);
  if (error) return usageError(io, error);
  if (options.doc === COMPLETION_RECORD) {
    return usageError(io, `${COMPLETION_RECORD}, the completion record, is not signed off: it is a report, signed through the ` +
      'documents it lists, so sign off each of them');
  }
  if (!DOC_CODES.includes(options.doc)) return usageError(io, `--doc is one of ${DOC_CODES.join(', ')}`);
  if (!options.project) return usageError(io, '--project names the project folder that holds food-safety/');
  for (const [field, what] of [['name', 'name of the person signing off'], ['role', 'role of the person signing off, such as owner']]) {
    if (!isPersonText(options[field])) {
      // A character that cannot be seen is named by its code point: nobody can find it by looking.
      const unseen = isString(options[field]) ? unseenIn(options[field]) : '';
      return usageError(io, `--${field} is the ${what}: some text, on one line, with no character that cannot be seen` +
        (unseen ? `. It holds ${unseen}: delete ${unseen.includes(' and ') ? 'them' : 'it'}, or type it again` : ''));
    }
  }
  if (!options.version) {
    return usageError(io, '--version is the version of the document signed off, as in its file name: 1.0 for ARC-001-FOODCOOK-v1.0.md');
  }
  const paperSigned = options['paper-signed'] ?? 'no';
  if (!['yes', 'no'].includes(paperSigned)) return usageError(io, '--paper-signed is yes, when a signed paper copy is kept, or no');
  const otherTextRead = options['other-text-read'] ?? 'no';
  if (!['yes', 'no'].includes(otherTextRead)) {
    return usageError(io, '--other-text-read is yes, when the person signing has read the lines outside the document\'s checked part, or no');
  }
  const today = localToday();
  const date = options.date ?? today;
  if (!isIsoDate(date)) return usageError(io, `--date is a real date written YYYY-MM-DD, not ${JSON.stringify(date)}`);
  // A sign-off records something that has happened, so its date is never one still to come. Only a new
  // sign-off is held to this: a record already made is read back whatever this computer's date is.
  if (date > today) {
    return usageError(io, `--date is the day the document was signed off, which cannot be after today, ${today}: ${date} is still to come`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return failure(io, { exit: 2, messages: [dataError] });
  const person = { name: options.name.trim(), role: options.role.trim(), version: options.version, date, paperSigned, otherTextRead };
  const result = signOffDocument(options.doc, options.project, person, data);
  if (result.exit) return failure(io, result);
  io.out(result.message);
  return 0;
}

const USAGE = `usage: uk-food.mjs <command> [options]

commands:
  set-up-folder --project DIR                        turn a project folder that has just been made
                                                     into a food business's own: an explanation of
                                                     the folder in place of ArcKit's architecture
                                                     README, and no empty architecture folders;
                                                     exit 1, changing nothing, for a folder that is
                                                     not exactly as a new project is made
  validate-data [--data DIR]                         check the data files; exit 0 when valid, 1 when not
  worksheet --section SECTION [--data DIR]           print a blank answer worksheet; SECTION is one of
                                                     XC, CL, CH, CK, MG, profile, own
  parse-worksheet --file FILE [--data DIR] [--json]  check a worksheet: print its problems (or, with
                                                     --json, what was read); exit 0 with no problems,
                                                     1 with problems
  upgrade-worksheet --file FILE [--data DIR] [--write]
                                                     bring a worksheet made by a different version of
                                                     the overlay up to date: print each line of its
                                                     guidance and question wording that would be
                                                     taken out or put in, and with --write do so,
                                                     keeping the worksheet as it was beside it; exit
                                                     1, changing nothing, for a worksheet for other
                                                     data, one with any other problem, or one whose
                                                     lines under a question's heading do not hold
                                                     the words that identify that question (a
                                                     heading that has been moved, lines typed
                                                     over, or wording this version does not know)
  render --doc DOC --project DIR [--data DIR]        print a document's body, from the worksheets in
                                                     DIR/food-safety; DOC is one of FOODXC, FOODCLN,
                                                     FOODCHL, FOODCOOK, FOODMGT, FOODPROF, FOODOWN,
                                                     or FOODCMP, the completion record; exit 1,
                                                     printing nothing, when a worksheet a document
                                                     needs has problems
  check --doc DOC --project DIR --report FILE        exit 0 when the body between the UK-FOOD markers
        [--data DIR] [--json]                        in FILE equals a fresh render and the file claims
                                                     no sign-off that is not recorded, 1 when not
  reference --section SECTION [--data DIR]           print a section's text from the pack, with no
                                                     answers; SECTION is one of XC, CL, CH, CK, MG
  status --project DIR [--data DIR] [--json]         say what is finished and what is not, for each
                                                     document, and whether the completion record is
                                                     up to date; exit 0 whenever the project can be
                                                     read
  sign-off --doc DOC --project DIR --name NAME       record that a named person has confirmed a
           --role ROLE --version VERSION             finished document, in DIR/food-safety/
           [--paper-signed yes|no] [--date DATE]     sign-offs.json; exit 1, writing nothing, when
           [--other-text-read yes|no] [--data DIR]   a worksheet it needs is missing or has
                                                     problems, an answer is not confirmed, it is
                                                     not written, is not that version or does not
                                                     pass check, a cell of its header that the
                                                     sign-off step rewrites holds something else,
                                                     it holds text outside its checked part and
                                                     --other-text-read yes is not given, (for
                                                     FOODOWN) a special process the profile
                                                     confirms has no own entry, or it is the
                                                     newest sign-off over again with nothing in
                                                     the file changed. DATE is
                                                     YYYY-MM-DD, today when not given, and never
                                                     after today. The sign-off covers the whole
                                                     file as it then reads: it ends when a line of
                                                     it changes, inside the UK-FOOD markers or
                                                     outside them, unless the change is the
                                                     sign-off step marking the header or core's
                                                     hook rewriting its Build Provenance section
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

// The name a worksheet is kept under before it is brought up to date: beside it, saying what it is, and
// never one that is already there, so an earlier kept copy is not written over. The name starts with
// what the file is, not with the worksheet's own name, so that no pattern for worksheets (answers-*.md)
// takes a kept copy for one. Nothing already in the folder is renamed.
function keptName(file) {
  for (let n = 1; ; n++) {
    const name = join(dirname(file), `before-upgrade-${n === 1 ? '' : `${n}-`}${basename(file)}`);
    if (!existsSync(name)) return name;
  }
}

export function upgradeWorksheetCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['file', 'data'], ['write']);
  if (error) return usageError(io, error);
  if (!options.file) return usageError(io, 'upgrade-worksheet needs --file: the worksheet to bring up to date');
  let bytes;
  try {
    bytes = readFileSync(options.file);
  } catch (readError) {
    return usageError(io, `cannot read ${options.file}: ${readError.message}`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return usageError(io, dataError);
  const result = upgradeWorksheet(bytes.toString('utf8'), data);
  if (result.exit) return failure(io, { exit: 1, messages: [`${options.file}: ${result.messages[0]}`, ...result.messages.slice(1)] });
  if (!result.changes.length) {
    io.out(`${options.file} is already what this version of the overlay prints: there is nothing to bring up to date.`);
    return 0;
  }
  const kept = keptName(options.file);
  const [out, put] = [result.changes.flatMap((change) => change.out), result.changes.flatMap((change) => change.put)];
  const lines = [`${options.file} was made by a different version of the overlay. Bringing it up to date takes out and puts in these lines ` +
    'of its guidance and question wording, and changes no other line:'];
  for (const change of result.changes) {
    lines.push(`${change.what}${change.back ? '' : `, ${change.from === change.to ? `line ${change.from}` : `lines ${change.from} to ${change.to}`}`}:`,
      ...(change.own ? [`  its own line as it stands: ${change.own[0]}`, `  its own line in this version: ${change.own[1]}`] : []),
      ...change.out.map(({ line, text }) => `  takes out, line ${line}: ${text}`), ...change.put.map((text) => `  puts in: ${text === '' ? '(a blank line)' : text}`));
  }
  lines.push(`${counted(out.length, 'line', 'lines')} taken out and ${put.length} put in. Every answer, state, name, date and entry is under ` +
    `the same identifier as before, unchanged${result.changes.some((change) => change.own) ? `, and the lines under each question it changes ` +
    `held ${identifying(result.section)} that question` : ''}.`);
  if (!options.write) {
    io.out([...lines, 'Anything a person typed on a line that is taken out is not carried over: read the lines above first.',
      `Nothing has been written. Run it again with --write to write it; the worksheet as it is now is then kept beside it as ${basename(kept)}.`]
      .join('\n'));
    return 0;
  }
  // The old worksheet is kept first, byte for byte, under a name nothing has. The new one is written
  // beside it, read back from the disk and compared once more, and only then moved into place.
  const next = `${options.file}.${process.pid}.tmp`;
  try {
    writeFileSync(kept, bytes, { flag: 'wx' });
    writeFileSync(next, result.text);
    const written = upgradeWorksheet(readFileSync(next, 'utf8'), data);
    const before = readWorksheet(bytes.toString('utf8'), data).parsed;
    if (written.exit || written.changes.length || typedIn(readWorksheet(readFileSync(next, 'utf8'), data).parsed) !== typedIn(before)) {
      rmSync(next, { force: true });
      rmSync(kept, { force: true });
      return failure(io, { exit: 1, messages: [`${options.file}: the worksheet as written would not read the same, so it is left as it was. Nothing has been changed.`] });
    }
    renameSync(next, options.file);
  } catch (writeError) {
    rmSync(next, { force: true });
    return failure(io, { exit: 2, messages: [`cannot write ${options.file}: ${writeError.message}`] });
  }
  io.out([...lines, `Written. The worksheet as it was is kept as ${kept}.`].join('\n'));
  return 0;
}

// ---------------------------------------------------------------------------------------------
// The project folder a business gets. ArcKit's shared create-project.sh makes every project the same
// way, for architecture work: a README that lists architecture commands, a note about external
// documents, and folders for decisions, diagrams and the like. None of that means anything to a food
// business, so the command that has just made a project has this helper turn the folder into the
// business's own. The wording below is the one copy of what the business is told.
// ---------------------------------------------------------------------------------------------

// What create-project.sh leaves in a new project, and nothing else: its README, and these folders, all
// empty but for the note in external. Each of the two files is compared whole, so a line added, taken
// out or changed anywhere in either is someone's, and the folder is then left alone. The README is the
// same for every project but for four things: the name the script was given (its title), the folder's
// number, the folder's own name (once, in the tree it draws) and the day. With those taken out it has
// one fingerprint; the note has no part that varies, so it has one as it stands. A test runs the real
// script, so a change to it shows there.
const SCRIPT_FOLDERS = ['data-contracts', 'decisions', 'diagrams', 'external', 'final', 'reviews', 'vendors', 'wardley-maps'];
const SCRIPT_README = '0debd70286495d174af21d6d8b91227ffe9720c1f56995cd71f32f1d4485ec46';
const SCRIPT_NOTE = '1c8dca3a4a8fc840cb64b2c4fd1fc27b1ace22e285394b80f59019835b2fa96d';
// The name in the title of a README that is, whole, the one the script writes into `folder`; else null.
function scriptReadme(text, folder) {
  const lines = text.split('\n');
  const number = /^\d{3}(?=-)/.exec(folder)?.[0];
  const name = /^# (.+)$/.exec(lines[0])?.[1];
  if (!number || !name || lines[2] !== `Project ID: ${number}` || !/^Created: \d{4}-\d{2}-\d{2}$/.test(lines[3] ?? '') || text.includes('\u0000')) return null;
  const shape = ['# \u0000', lines[1], 'Project ID: \u0000', 'Created: \u0000', ...lines.slice(4).map((line) =>
    (line === `${folder}/` ? '\u0000/' : line.replaceAll(`ARC-${number}-`, 'ARC-\u0000-')))].join('\n');
  return sha256(shape) === SCRIPT_README ? name : null;
}
// The name the commands give a project when nobody has said what the business is called: no name at all.
const named = (name) => (/^food safety$/i.test(name.trim().replace(/\s+/g, ' ')) ? '' : name);
const KEEP_PRIVATE = 'This folder holds the names of the people who work in the business. Keep it somewhere private, and if it ' +
  'is a git repository that is pushed anywhere, keep that private too.';
const folderReadme = (name, number) => `# ${name ? `${name}: food safety records` : 'Food safety records'}

This folder holds ${name ? `the food safety records of ${name}` : 'a food business\'s food safety records'}. They are built with ArcKit's UK Food Safety Overlay from the Food Standards Agency's pack, Safer food, better business for caterers, and from the answers that people at the business give.

## What is here

- \`food-safety/\`: the worksheets. There is one for the business profile, one for each of the pack's five sections and one for the business's own methods. Each holds the answers given, who gave each one and when. \`sign-offs.json\`, in the same folder, records who has signed each document off.
- \`ARC-${number}-FOOD...md\`, in this folder: the documents themselves, written from the worksheets. Each is a draft until a named person at the business signs it off, except the completion record (\`ARC-${number}-FOODCMP-v1.0.md\`): it reports where the others stand, and nobody signs it.
- \`external/\`: a place for documents of your own that you want the assistant to read, such as a written procedure for a special process. The note in that folder says more.

## What to do next

Run the overlay's commands in this order. Each can be run as often as you like, and picks up where the last run stopped.

1. \`uk-food-profile\`: the business profile.
2. \`uk-food-safe-methods\`: the pack's five sections of safe methods, one section at a time.
3. \`uk-food-own-methods\`: your own methods, and your written procedure for any special process.
4. \`uk-food-check\`: what is finished and what is still waiting. Run it at any time.
5. \`uk-food-sign-off\`: a named person signs each finished document off, the profile last.

In Claude Code these are typed \`/arckit-uk-food:uk-food-profile\` and so on. Other tools write the names their own way.

## Keep this folder private

${KEEP_PRIVATE}

## What these records are

They are the business's own record. They are not legal advice. The food business operator is responsible for the business's food safety and for these records, and the local council's environmental health team is the authority on whether they are adequate. The Food Standards Agency has not reviewed or endorsed the overlay or anything made with it.
`;
const FOLDER_NOTE = `# Documents of your own

Put here any document of your own that you want the assistant to read while it helps with these records: a written procedure for a special process, for example, or a supplier's instructions for a piece of equipment.

The assistant reads a document here when you point it to one. Nothing in a document is taken as the business's answer until a named person at the business confirms it, and a written procedure is recorded word for word, never rewritten.

These documents may hold names and other details of the business, so keep them as private as the rest of this folder.
`;

// Turns a project folder that create-project.sh has just made into a food business's own: its README
// and the note in external are replaced by the two texts above, and the empty folders for architecture
// work are taken away, external kept. It changes a folder only when the folder is exactly as the script
// leaves a new project, checked entry by entry and file by file before anything is written; a project
// that holds a file of its own, work already started, or a README or note with a line added, taken out
// or changed is refused, with nothing in it changed (exit 1). The refusal says only what the helper
// knows: that the folder is not as this version expects a new one to be, which is also what a later
// version of the script would bring about. A folder already set up is left as it is (exit 0).
export function setUpFolderCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['project']);
  if (error) return usageError(io, error);
  if (!options.project) return usageError(io, '--project names the project folder that has just been made');
  const project = options.project;
  let entries;
  try {
    entries = readdirSync(project, { withFileTypes: true });
  } catch (readError) {
    return usageError(io, `cannot read the project folder ${project}: ${readError.message}`);
  }
  const refuse = (why) => failure(io, { exit: 1, messages: [`${project} ${why}, so it is not as this version of the overlay expects a new ` +
    'project folder to be. Nothing in it has been changed: this command sets up only a folder that is exactly as ArcKit makes a new one.'] });
  const read = (...path) => readFileSync(join(project, ...path), 'utf8');
  const readme = entries.some((entry) => entry.isFile() && entry.name === 'README.md') ? read('README.md') : null;
  if (readme === null) return refuse('has no README.md');
  const folder = basename(realpathSync(project));
  const number = /^\d{3}/.exec(folder)?.[0] ?? '';
  const mine = /^# (.+): food safety records\n/.exec(readme);
  if (readme === folderReadme('', number) || (mine && readme === folderReadme(mine[1], number))) {
    io.out(`${project} is already set up: nothing has been changed.`);
    return 0;
  }
  const made = scriptReadme(readme, folder);
  if (made === null) return refuse('holds a README.md that is not the one a new project is given');
  const name = named(made);
  const kept = [];
  for (const entry of entries) {
    if (entry.name === 'README.md' && entry.isFile()) continue;
    if (!entry.isDirectory() || !SCRIPT_FOLDERS.includes(entry.name)) return refuse(`holds ${entry.name}, which a new project does not`);
    const inside = readdirSync(join(project, entry.name));
    if (entry.name !== 'external' && inside.length) return refuse(`holds a folder, ${entry.name}, that is not empty`);
    const other = inside.find((name) => name !== 'README.md');
    if (other) return refuse(`holds, in ${entry.name}, ${other}, which a new project does not`);
    if (inside.length && sha256(read('external', 'README.md')) !== SCRIPT_NOTE) return refuse('holds, in external, a README.md that is not the one a new project is given');
    if (entry.name !== 'external') kept.push(entry.name);
  }
  try {
    writeFileSync(join(project, 'README.md'), folderReadme(name, number));
    if (entries.some((entry) => entry.name === 'external')) writeFileSync(join(project, 'external', 'README.md'), FOLDER_NOTE);
    for (const name of kept) rmdirSync(join(project, name));
  } catch (writeError) {
    return failure(io, { exit: 2, messages: [`cannot set up ${project}: ${writeError.message}`] });
  }
  io.out([`${project} is now set up for ${name ? `the food safety records of ${name}` : 'a food business\'s food safety records'}.`,
    '- README.md says what the folder is, where the worksheets and documents are, which command to run next, and to keep the folder private.',
    '- external/README.md says what that folder is for: documents of the business\'s own for the assistant to read.',
    ...(kept.length ? [`- The empty folders for ArcKit's architecture work were taken away: ${andList(kept)}.`] : [])].join('\n'));
  return 0;
}

export const COMMANDS = {
  'set-up-folder': setUpFolderCommand,
  'validate-data': validateDataCommand,
  worksheet: worksheetCommand,
  'parse-worksheet': parseWorksheetCommand,
  'upgrade-worksheet': upgradeWorksheetCommand,
  render: renderCommand,
  check: checkCommand,
  reference: referenceCommand,
  status: statusCommand,
  'sign-off': signOffCommand
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
