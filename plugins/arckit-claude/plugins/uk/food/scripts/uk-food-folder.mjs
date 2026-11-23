import { readdirSync, readFileSync, realpathSync, rmdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { andList } from './uk-food-worksheet.mjs';
import { failure, sha256 } from './uk-food-document.mjs';
import { readOptions, usageError, valueError } from './uk-food.mjs';

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

- \`food-safety/\`: the worksheets. There is one for the business profile, one for each of the pack's five sections and one for the business's own methods. Each holds the answers given, who gave each one and when. There is one too for each of three lists: your allergen information, your cleaning schedule, and your suppliers and contacts. Each holds an entry for each dish, each thing you clean or each supplier and contact, with who confirmed it and when. \`sign-offs.json\`, in the same folder, records who has signed each document off.
- \`ARC-${number}-FOOD...md\`, in this folder: the documents themselves, written from the worksheets. Each is a draft until a named person at the business signs it off, except two that nobody signs: the completion record (\`ARC-${number}-FOODCMP-v1.0.md\`), which reports where the others stand, and the diary and record sheets (\`ARC-${number}-FOODREC-v1.0.md\`), which are blank forms whose pages are signed by the people who fill them in.
- \`external/\`: a place for documents of your own that you want the assistant to read, such as a written procedure for a special process. The note in that folder says more.

## What to do next

Run the overlay's commands in this order. Each can be run as often as you like, and picks up where the last run stopped.

1. \`uk-food-profile\`: the business profile.
2. \`uk-food-safe-methods\`: the pack's five sections of safe methods, one section at a time.
3. \`uk-food-own-methods\`: your own methods, and your written procedure for any special process.
4. \`uk-food-allergens\`: each dish against the fourteen allergens, from the labels, product specifications and suppliers' statements you give.
5. \`uk-food-cleaning-schedule\`: what you clean, how often, what to take care over and how.
6. \`uk-food-suppliers\`: your suppliers, your council's environmental health team and your other contacts.
7. \`uk-food-record-sheets\`: the pack's blank diary and record sheets, to print or copy and fill in by hand.
8. \`uk-food-check\`: what is finished and what is still waiting. Run it at any time.
9. \`uk-food-sign-off\`: a named person signs each finished document off, the profile last.

Steps 4 to 6 can come in any order once the profile is started.

In Claude Code these are typed \`/arckit-uk-food:uk-food-profile\` and so on. Other tools write the names their own way.

## Keep this folder private

${KEEP_PRIVATE}

## What these records are

They are the business's own record. They are not legal advice. The food business operator is responsible for the business's food safety and for these records, and the local council's environmental health team is the authority on whether they are adequate. The Food Standards Agency has not reviewed or endorsed the overlay or anything made with it.
`;
// The README a released version of this helper wrote, as it reads with the two things that vary taken out
// (readmeShape): 6.23.0's, for a business with a name and for one without. A folder one of them set up is a
// folder this helper made, so it is left as it is: never refused as not the one a new project is given, and
// never rewritten unasked. When a release changes the README's wording, the wording it replaces is added
// here, as FRAME_NOTES keeps the template notes of earlier releases.
const EARLIER_READMES = ['452902619c610837bcdffdb27a3eac461ec342afc92990cdc75aac8938f89222', '04ba4c6702349b7c2fe7afe9b132aa53a76ee482158523676af646d8195652b8'];
// A README with the business's name taken out of its title and first sentence, and the folder's number out
// of the file names it gives; a README that already holds either stand-in is nobody's shape.
const readmeShape = (text, name, number) => (/[\u0000\u0001]/.test(text) ? null : (name ? text
  .replace(`# ${name}: food safety records\n`, '# \u0000: food safety records\n')
  .replace(`the food safety records of ${name}. `, 'the food safety records of \u0000. ') : text).replaceAll(`ARC-${number}-FOOD`, 'ARC-\u0001-FOOD'));
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
// version of the script would bring about. A folder already set up, by this version or by an earlier
// release (EARLIER_READMES), is left as it is (exit 0).
export function setUpFolderCommand(args, io = { out: console.log, err: console.error }) {
  const { options, error } = readOptions(args, ['project']);
  if (error) return usageError(io, error);
  if (!options.project) return usageError(io, '--project names the project folder that has just been made');
  const project = options.project;
  let entries;
  try {
    entries = readdirSync(project, { withFileTypes: true });
  } catch (readError) {
    return valueError(io, `cannot read the project folder ${project}: ${readError.message}`);
  }
  const refuse = (why) => failure(io, { exit: 1, messages: [`${project} ${why}, so it is not as this version of the overlay expects a new ` +
    'project folder to be. Nothing in it has been changed: this command sets up only a folder that is exactly as ArcKit makes a new one.'] });
  const read = (...path) => readFileSync(join(project, ...path), 'utf8');
  const readme = entries.some((entry) => entry.isFile() && entry.name === 'README.md') ? read('README.md') : null;
  if (readme === null) return refuse('has no README.md');
  const folder = basename(realpathSync(project));
  const number = /^\d{3}/.exec(folder)?.[0] ?? '';
  const mine = /^# (.+): food safety records\n/.exec(readme);
  const earlier = readmeShape(readme, mine?.[1] ?? '', number);
  if (readme === folderReadme('', number) || (mine && readme === folderReadme(mine[1], number)) ||
    (earlier !== null && EARLIER_READMES.includes(sha256(earlier)))) {
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
