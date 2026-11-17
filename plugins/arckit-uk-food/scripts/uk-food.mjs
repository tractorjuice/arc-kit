#!/usr/bin/env node
// UK food overlay helper. Standard library only.
// Commands are entries in COMMANDS; each is one exported function returning an exit code.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATA_ID = 'sfbb-caterers-2026-11-17';
export const SCHEMA_ID = 'uk-food-sfbb-data-1.0';
export const SECTION_IDS = ['XC', 'CL', 'CH', 'CK', 'MG'];
export const QUESTION_TYPES = ['yes-no', 'yes-no-else', 'tick', 'text', 'list'];
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
const isStringArray = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

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

  const source = data.source;
  if (!isObject(source)) errors.push('source.json: missing');
  else {
    for (const field of SOURCE_FIELDS) {
      if (source[field] === undefined || source[field] === null || source[field] === '') {
        errors.push(`source.json: missing ${field}`);
      }
    }
  }

  const questions = (list, where) => {
    if (list === undefined) return;
    if (!Array.isArray(list)) return errors.push(`${where}: questions is not an array`);
    for (const question of list) {
      const at = `${where} question ${question && question.id}`;
      claim(question && question.id, at);
      if (!QUESTION_TYPES.includes(question && question.type)) {
        errors.push(`${at}: type ${JSON.stringify(question && question.type)} is not one of ${QUESTION_TYPES.join(', ')}`);
      }
      if (question.options !== undefined && !isStringArray(question.options)) {
        errors.push(`${at}: options is not an array of strings`);
      }
      if (typeof question.text !== 'string' || (question.text === '' && question.type !== 'tick')) {
        errors.push(`${at}: text must be a string, empty only for type tick`);
      }
    }
  };
  const rows = (list, where) => {
    if (!Array.isArray(list)) return errors.push(`${where}: rows is not an array`);
    for (const row of list) {
      const at = `${where} row ${row && row.id}`;
      claim(row && row.id, at);
      needPage(row && row.page, at);
      questions(row && row.questions, at);
    }
  };

  for (const [key, file] of data.sections) {
    const section = file.section || {};
    if (section.id !== key) errors.push(`${key}.json: section id is ${section.id}`);
    if (file.schema !== SCHEMA_ID) errors.push(`${key}.json: schema is not ${SCHEMA_ID}`);
    if (file.data !== DATA_ID) errors.push(`${key}.json: data is not ${DATA_ID}`);
    for (const item of section.intro || []) needPage(item.page, `${key} intro`);
    for (const page of section.pages || []) needPage(page, `${key} section pages`);
    for (const method of file.methods || []) {
      const at = `method ${method.id}`;
      claim(method.id, at);
      if (typeof method.id === 'string' && !method.id.startsWith(`${key}-`)) {
        errors.push(`${at}: identifier does not start with ${key}-`);
      }
      if (!Array.isArray(method.pages) || method.pages.length === 0) {
        errors.push(`${at}: pages is empty`);
      } else {
        for (const page of method.pages) needPage(page, `${at} pages`);
      }
      for (const block of method.blocks || []) {
        const here = `${at} ${block.kind} block`;
        needPage(block.page, here);
        if (block.kind === 'points' || block.kind === 'manage-it') rows(block.rows, here);
        else if (block.rows !== undefined && block.kind === 'check-it') rows(block.rows, here);
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
