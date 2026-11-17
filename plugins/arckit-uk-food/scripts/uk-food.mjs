#!/usr/bin/env node
// UK food overlay helper. Standard library only.
// Commands are entries in COMMANDS; each is one exported function returning an exit code.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATA_ID = 'sfbb-caterers-2026-11-17';
export const SCHEMA_ID = 'uk-food-sfbb-data-1.0';
export const SECTION_IDS = ['XC', 'CL', 'CH', 'CK', 'MG'];
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

// Loads every data file that exists. front, diary and limits are null until they are transcribed.
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
  'check-it': { required: [], fields: { text: isStringOrNull, rows: ROWS, questions: ROWS } },
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
    fields: { columns: isStringArray, rows: isRowsOfStrings, questions: ROWS }
  }
};
const BLOCK_COMMON = { kind: isString, heading: isStringOrNull, page: () => true };

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

  const FILE = { schema: isString, data: isString, section: isObject, methods: Array.isArray };
  const SECTION = {
    id: isString, code: isString, title: isString, pages: Array.isArray, intro: Array.isArray
  };
  const METHOD = {
    id: isString, title: isString, summary: isStringOrNull, pages: Array.isArray, blocks: Array.isArray
  };
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
      for (const block of method.blocks) {
        const kind = block && block.kind;
        const here = `${at} ${kind} block`;
        if (!Object.hasOwn(BLOCK_KINDS, kind)) {
          errors.push(`${at}: unknown block kind ${JSON.stringify(kind)}`);
          continue;
        }
        const { required, fields } = BLOCK_KINDS[kind];
        if (!shape(block, here, { ...BLOCK_COMMON, ...fields }, ['page', ...required])) continue;
        needPage(block.page, here);
        if (kind === 'points' || kind === 'manage-it' || (kind === 'check-it' && block.rows !== undefined)) {
          rows(block.rows, here);
        }
        questions(block.questions, here);
      }
    }
  }
  return errors;
}

const USAGE = `usage: uk-food.mjs <command> [options]

commands:
  validate-data [--data DIR]   check the data files; exit 0 when valid, 1 when not
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

// Later tasks add worksheet, render, check, reference, status and sign-off here.
export const COMMANDS = { 'validate-data': validateDataCommand };

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
