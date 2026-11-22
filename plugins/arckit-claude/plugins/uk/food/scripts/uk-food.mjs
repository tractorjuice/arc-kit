#!/usr/bin/env node
// UK food overlay helper. Standard library only.
// Commands are entries in COMMANDS; each is one exported function returning an exit code.
import { existsSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_DATA_DIR, loadData, SECTION_IDS, validateData } from './uk-food-data.mjs';
import {
  blankWorksheet, counted, identifying, parseWorksheet, readWorksheet, typedIn, upgradeWorksheet, WORKSHEET_SECTIONS,
  worksheetJson
} from './uk-food-worksheet.mjs';
import { checkCommand, failure, referenceCommand, renderCommand } from './uk-food-document.mjs';
import { signOffCommand, statusCommand } from './uk-food-status.mjs';
import { setUpFolderCommand } from './uk-food-folder.mjs';

export * from './uk-food-data.mjs';
export * from './uk-food-worksheet.mjs';
export * from './uk-food-document.mjs';
export * from './uk-food-status.mjs';
export * from './uk-food-folder.mjs';
export { HELPER, loadValidData, optionError, readOptions, usageError, valueError };

// The helper itself, for the commands a message tells a person to run next.
const HELPER = fileURLToPath(import.meta.url);

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

// A value that is wrong: the message says what it must be, so the usage text is left out.
function valueError(io, message) {
  return failure(io, { exit: 2, messages: [message] });
}

// An option a command needs. Left out, it is a usage error like any other; given with a value that is
// wrong, the message stands alone.
function optionError(io, value, message) {
  return value === undefined ? usageError(io, message) : valueError(io, message);
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
    return optionError(io, options.section, `--section is one of ${WORKSHEET_SECTIONS.join(', ')}`);
  }
  const dir = options.data ?? DEFAULT_DATA_DIR;
  const { data, error: dataError } = loadValidData(dir);
  if (dataError) return valueError(io, dataError);
  if (SECTION_IDS.includes(options.section) && !data.sections.has(options.section)) {
    return valueError(io, `the data in ${dir} has no ${options.section}.json`);
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
    return valueError(io, `cannot read ${options.file}: ${readError.message}`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return valueError(io, dataError);
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
    return valueError(io, `cannot read ${options.file}: ${readError.message}`);
  }
  const { data, error: dataError } = loadValidData(options.data ?? DEFAULT_DATA_DIR);
  if (dataError) return valueError(io, dataError);
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
