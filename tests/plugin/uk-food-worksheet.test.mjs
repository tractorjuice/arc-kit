import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  DATA_ID, DEFAULT_DATA_DIR, EXTRA_CARE, PROFILE_QUESTIONS, SECTION_IDS, WORKSHEET_SECTIONS,
  blankWorksheet, emitWorksheet, loadData, parseWorksheet
} from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const data = loadData(DEFAULT_DATA_DIR);
const FIXTURE = 'tests/fixtures/uk-food/project-cafe/food-safety';
const fixture = (section) => readFileSync(join(FIXTURE, `answers-${section}.md`), 'utf8');

const methodOf = (id) => data.sections.get(id.slice(0, 2)).methods.find((m) => m.id === id.slice(0, 5));
// A block's rows and the block itself: the two places a question can sit.
const holders = (block) => [block, ...(block.kind !== 'table' && Array.isArray(block.rows) ? block.rows : [])];
const questionsOf = (method) => method.blocks.flatMap(holders).flatMap((h) => h.questions ?? []);
// Every question of a section a business answers: all but notes, in the data's order.
const askedIds = (section) => data.sections.get(section).methods
  .flatMap(questionsOf).filter((q) => q.type !== 'note').map((q) => q.id);
const rowOf = (rowId) => methodOf(rowId).blocks.flatMap(holders).find((h) => h.id === rowId);

const BLANK_FIELDS = 'Answer:\nState: unanswered\nBy:\nOn:\nSource:\n';
// Replaces a question's blank fields in a worksheet with the lines given.
const fill = (text, qid, ...lines) => {
  const at = text.indexOf(`### ${qid}\n`);
  assert.ok(at >= 0, `${qid} is not in the worksheet`);
  const from = text.indexOf(BLANK_FIELDS, at);
  return text.slice(0, from) + lines.map((l) => `${l}\n`).join('') + text.slice(from + BLANK_FIELDS.length);
};
const confirmed = (answer) => [`Answer: ${answer}`, 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20', 'Source:'];
// The 1-based line of the first line holding `needle`, searching from the line holding `after`.
const lineOf = (text, needle, after = '') => {
  const from = after ? text.indexOf(after) : 0;
  const at = text.indexOf(needle, from);
  assert.ok(at >= 0, `${JSON.stringify(needle)} is not in the text`);
  return text.slice(0, at).split('\n').length;
};
// The prompt lines printed above a question's fields.
const promptOf = (text, qid) => {
  const lines = text.split('\n');
  const start = lines.indexOf(`### ${qid}`);
  assert.ok(start >= 0, `${qid} is not in the worksheet`);
  const prompt = [];
  for (const line of lines.slice(start + 1)) {
    if (line === '' && prompt.length === 0) continue;
    if (!line.startsWith('>')) break;
    prompt.push(line);
  }
  return prompt;
};
// Whether a prompt prints every paragraph of a piece of the pack's text, each whole on its own line.
const shows = (prompt, text) => text.split('\n').every((paragraph) => prompt.includes(`> ${paragraph}`.trimEnd()));
const askedOf = (rowId) => rowOf(rowId).questions.filter((q) => q.type !== 'note').map((q) => q.id);
const messages = (parsed) => parsed.problems.map((p) => p.message).join('\n');
const parse = (text) => parseWorksheet(text, data);

// ---- Blank worksheets ----

test('a blank worksheet for each section parses with no problems and nothing answered', () => {
  for (const section of WORKSHEET_SECTIONS) {
    const parsed = parse(blankWorksheet(section, data));
    assert.deepEqual(parsed.problems, [], section);
    assert.equal(parsed.section, section);
    assert.equal(parsed.data, DATA_ID);
    for (const answer of parsed.answers.values()) {
      assert.equal(answer.state, 'unanswered', answer.id);
      assert.equal(answer.answer, '', answer.id);
      assert.equal(answer.answered, false, answer.id);
      assert.equal(answer.value, null, answer.id);
    }
    assert.equal(parsed.entries.size, 0, section);
  }
});

test('a section worksheet lists every question but notes, method by method in the data\'s order', () => {
  for (const section of SECTION_IDS) {
    const text = blankWorksheet(section, data);
    const parsed = parse(text);
    assert.deepEqual([...text.matchAll(/^### (\S+)$/gm)].map((m) => m[1]), askedIds(section), section);
    assert.deepEqual([...parsed.answers.keys()], askedIds(section), section);
    assert.deepEqual([...parsed.methods.keys()], data.sections.get(section).methods.map((m) => m.id));
    for (const method of parsed.methods.values()) {
      assert.equal(method.status, 'applies', method.id);
      assert.deepEqual([...method.answers.keys()], questionsOf(methodOf(method.id))
        .filter((q) => q.type !== 'note').map((q) => q.id));
    }
  }
});

test('a blank worksheet opens with its title and marker, and lays out methods and questions exactly', () => {
  const text = blankWorksheet('CK', data);
  const lines = text.split('\n');
  assert.equal(lines[0], '# Answers: Cooking (CK)');
  assert.equal(lines[1], '');
  assert.equal(lines[2], `<!-- uk-food-answers 1.0 data=${DATA_ID} section=CK -->`);
  assert.match(text, /\n\n## CK-06 Hot holding\n\nStatus: applies\nReason:\nDecided-by:\nVariation:\nProved-safe:\n\n### CK-06-Q01\n\n> /);
  assert.match(text, /\n> Do you hot hold\?  \(yes \/ no\)\nAnswer:\nState: unanswered\nBy:\nOn:\nSource:\n\n### CK-06-Q02\n/);
  assert.ok(text.endsWith('Source:\n'));
  for (const section of WORKSHEET_SECTIONS) {
    assert.doesNotMatch(blankWorksheet(section, data), /[ \t]$/m, `${section} has a line ending in white space`);
  }
});

test('only the profile turns a Markdown lint rule off, with its reason beside it, and the parser ignores both', () => {
  for (const section of WORKSHEET_SECTIONS) {
    const lines = blankWorksheet(section, data).split('\n');
    const off = lines.filter((line) => line.includes('markdownlint-disable'));
    assert.deepEqual(off, section === 'profile' ? ['<!-- markdownlint-disable MD001 -->'] : [], section);
    if (section === 'profile') assert.match(lines[lines.indexOf(off[0]) + 1], /^<!-- MD001: \S.* -->$/);
  }
  assert.deepEqual(parse(blankWorksheet('profile', data)).problems, []);
});

test('a paragraph of the pack that reads as a list item is kept apart from the one above by an empty > line', () => {
  const prompt = promptOf(blankWorksheet('CL', data), 'CL-02-Q01');
  const first = prompt.findIndex((line) => /^> 1\. /.test(line));
  assert.ok(first > 0);
  assert.equal(prompt[first - 1], '>');
  assert.match(prompt[first + 1], /^> 2\. /);
  assert.equal(prompt.filter((line) => line === '>').length, 1);
});

// ---- Prompts ----

test('a prompt gives the question, then the form of answer the helper expects', () => {
  const text = blankWorksheet('CK', data);
  assert.equal(promptOf(text, 'CK-02-Q01').at(-1),
    '> List the dishes containing eggs that you prepare or cook.  (one item per line)');
  assert.equal(promptOf(text, 'CK-02-Q02').at(-1),
    '> Do you cook eggs and food containing eggs thoroughly until they are steaming hot?' +
    '  (yes, or say what you do instead) If not, what do you do?');
  assert.equal(promptOf(text, 'CK-02-Q03').at(-1), '> How do you keep rice hot before serving?  (write your answer)');
  assert.match(promptOf(text, 'CK-04-Q01').at(-1), / {2}\(yes if you do this \/ no\)$/);
});

test('a question\'s safety point is printed whole above it, one line per paragraph', () => {
  for (const section of SECTION_IDS) {
    const text = blankWorksheet(section, data);
    for (const method of data.sections.get(section).methods) {
      for (const row of method.blocks.flatMap(holders).filter((h) => h.id && h.point)) {
        for (const question of (row.questions ?? []).filter((q) => q.type !== 'note')) {
          const prompt = promptOf(text, question.id);
          for (const paragraph of row.point.split('\n')) {
            assert.ok(prompt.includes(`> ${paragraph}`.trimEnd()), `${question.id} lacks ${JSON.stringify(paragraph)}`);
          }
        }
      }
    }
  }
});

test('a question that prints no text of its own is asked by its box heading, point and columns', () => {
  const xc = blankWorksheet('XC', data);
  const grid = methodOf('XC-02').blocks.find((b) => b.rows?.some((r) => r.id === 'XC-02-P05'));
  assert.deepEqual(promptOf(xc, 'XC-02-Q02'), [
    `> ${grid.heading}`,
    `> ${rowOf('XC-02-P05').point}`,
    `> ${grid.columns[2]} / ${grid.columns[3]}  (yes, or say what you do instead)`
  ]);
  const mg = blankWorksheet('MG', data);
  const extra = methodOf('MG-02').blocks[0];
  // The "Additional checks" row prints three empty cells, one under each column.
  assert.equal(promptOf(mg, 'MG-02-Q19').at(-1), `> ${extra.columns[0]}  (one item per line)`);
  assert.equal(promptOf(mg, 'MG-02-Q20').at(-1), `> ${extra.columns[1]}  (one item per line)`);
  assert.equal(promptOf(mg, 'MG-02-Q21').at(-1), `> ${extra.columns[2]}  (one item per line)`);
  // A row's printed note sits in the column before its answer, so it is shown with the question.
  const deepClean = rowOf('MG-02-P01');
  assert.deepEqual(promptOf(mg, 'MG-02-Q02'), [
    ...deepClean.point.split('\n').map((p) => `> ${p}`),
    `> ${deepClean.questions[0].text}`,
    `> ${extra.columns[2]}  (write your answer)`
  ]);
  const opening = methodOf('MG-01').blocks[0];
  assert.deepEqual(promptOf(mg, 'MG-01-Q11'), [`> ${opening.heading}`, `> ${opening.columns[0]}  (one item per line)`]);
});

test('a note printed before a question in its row or box is shown with that question only', () => {
  const ch = blankWorksheet('CH', data);
  const row = rowOf('CH-03-P09');
  const [iceCheck, , jointCheck] = row.questions;
  assert.ok(promptOf(ch, 'CH-03-Q16').includes(`> ${iceCheck.text}`));
  assert.ok(promptOf(ch, 'CH-03-Q18').includes(`> ${jointCheck.text}`));
  assert.ok(!promptOf(ch, 'CH-03-Q18').includes(`> ${iceCheck.text}`));
  // A question on a CHECK IT box is shown with the box's text, which says what "this" is.
  const box = methodOf('CK-06').blocks.find((b) => b.kind === 'check-it');
  const prompt = promptOf(blankWorksheet('CK', data), 'CK-06-Q05');
  assert.deepEqual(prompt, [`> ${box.heading}`, ...box.text.split('\n').map((p) => `> ${p}`), '> How do you do this?  (write your answer)']);
});

test('a lead-in row that asks nothing and ends with a colon is shown with each row it leads into', () => {
  const xc = blankWorksheet('XC', data);
  const cloths = rowOf('XC-02-P07').point;
  for (const row of ['XC-02-P08', 'XC-02-P09', 'XC-02-P10', 'XC-02-P11', 'XC-02-P12']) {
    for (const id of askedOf(row)) assert.ok(shows(promptOf(xc, id), cloths), id);
  }
  for (const id of [...askedOf('XC-02-P05'), ...askedOf('XC-02-P06')]) assert.ok(!shows(promptOf(xc, id), cloths), id);
  const ck = blankWorksheet('CK', data);
  const chips = rowOf('CK-04-P08').point;
  const bread = rowOf('CK-04-P12').point;
  for (const id of ['CK-04-P09', 'CK-04-P10', 'CK-04-P11'].flatMap(askedOf)) {
    assert.ok(shows(promptOf(ck, id), chips), id);
    assert.ok(!shows(promptOf(ck, id), bread), id);
  }
  for (const id of askedOf('CK-04-P13')) {
    assert.ok(shows(promptOf(ck, id), bread), id);
    assert.ok(!shows(promptOf(ck, id), chips), id);
  }
  // A lead-in reaches only the rows after it, up to the next row that asks nothing.
  for (const id of askedOf('CK-04-P07')) assert.ok(!shows(promptOf(ck, id), chips), id);
});

test('a row that continues a spanning cell is shown with that cell\'s point; a row that is a prompt of its own is not', () => {
  const mg = blankWorksheet('MG', data);
  for (const [row, cell] of [['MG-02-P03', 'MG-02-P02'], ['MG-02-P05', 'MG-02-P04'], ['MG-02-P08', 'MG-02-P07'], ['MG-02-P09', 'MG-02-P07']]) {
    for (const id of askedOf(row)) assert.ok(shows(promptOf(mg, id), rowOf(cell).point), id);
  }
  // Pages 43 and 45 print these as rows of their own, each asking about another method; the row
  // above them is a different method, and showing it would mislead.
  const ch = blankWorksheet('CH', data);
  for (const [row, above] of [['CH-02-P10', 'CH-02-P09'], ['CH-03-P08', 'CH-03-P07']]) {
    for (const id of askedOf(row)) assert.ok(!shows(promptOf(ch, id), rowOf(above).point), id);
  }
});

test('no two questions of a method are asked alike, and none is asked by its column headings alone', () => {
  const alike = [];
  const bare = [];
  for (const section of SECTION_IDS) {
    const text = blankWorksheet(section, data);
    for (const method of data.sections.get(section).methods) {
      const seenPrompts = new Map();
      for (const question of questionsOf(method).filter((q) => q.type !== 'note')) {
        const prompt = promptOf(text, question.id);
        const key = prompt.join('\n');
        if (seenPrompts.has(key)) alike.push(`${seenPrompts.get(key)} and ${question.id}`);
        else seenPrompts.set(key, question.id);
        if (question.text === '' && prompt.length === 1) bare.push(question.id);
      }
    }
  }
  assert.deepEqual(alike, []);
  assert.deepEqual(bare, []);
});

test('every question shows its box\'s heading, and a CHECK IT box\'s text unless it has a point of its own', () => {
  for (const section of SECTION_IDS) {
    const text = blankWorksheet(section, data);
    for (const method of data.sections.get(section).methods) {
      for (const block of method.blocks) {
        for (const holder of holders(block)) {
          for (const question of (holder.questions ?? []).filter((q) => q.type !== 'note')) {
            const prompt = promptOf(text, question.id);
            if (block.heading) assert.ok(shows(prompt, block.heading), `${question.id} lacks ${block.heading}`);
            if (block.kind === 'check-it' && block.text && !(holder !== block && holder.point)) {
              assert.ok(shows(prompt, block.text), `${question.id} lacks its CHECK IT text`);
            }
          }
        }
      }
    }
  }
  const mg = blankWorksheet('MG', data);
  const [opening, closing] = methodOf('MG-01').blocks;
  assert.ok(shows(promptOf(mg, 'MG-01-Q10'), opening.heading) && !shows(promptOf(mg, 'MG-01-Q10'), closing.heading));
  assert.ok(shows(promptOf(mg, 'MG-01-Q20'), closing.heading) && !shows(promptOf(mg, 'MG-01-Q20'), opening.heading));
});

test('a note or question ending with a colon is shown above the questions after it in its row or box, up to the next', () => {
  const ch = blankWorksheet('CH', data);
  const box = methodOf('CH-01').blocks.find((b) => b.kind === 'check-it');
  const textOf = (id) => [...box.questions, ...rowOf('CH-01-P03').questions, ...rowOf('CH-03-P08').questions].find((q) => q.id === id).text;
  for (const id of ['CH-01-Q11', 'CH-01-Q12', 'CH-01-Q13', 'CH-01-Q14']) {
    assert.ok(shows(promptOf(ch, id), textOf('CH-01-Q10')), id);
    assert.ok(!shows(promptOf(ch, id), textOf('CH-01-Q15')), id);
  }
  for (const id of ['CH-01-Q16', 'CH-01-Q17', 'CH-01-Q18', 'CH-01-Q19']) {
    assert.ok(shows(promptOf(ch, id), textOf('CH-01-Q15')), id);
    assert.ok(!shows(promptOf(ch, id), textOf('CH-01-Q10')), id);
  }
  // Page 41 prints "If you do not do this, what do you do?" after a gap below both groups: it is
  // about all chilling equipment, so it is shown neither group's lead-in. It is shown the question
  // the two groups answer, which "this" refers to.
  const q20 = promptOf(ch, 'CH-01-Q20');
  assert.ok(!shows(q20, textOf('CH-01-Q10')) && !shows(q20, textOf('CH-01-Q15')));
  assert.ok(shows(q20, textOf('CH-01-Q09')));
  assert.equal(q20.at(-2), `> ${textOf('CH-01-Q09')}`);
  // "If not, what do you do?" follows "Do you follow the manufacturer's instructions for using your:".
  for (const id of ['CH-01-Q04', 'CH-01-Q05', 'CH-01-Q06']) assert.ok(shows(promptOf(ch, id), textOf('CH-01-Q03')), id);
  // "Which foods do you defrost in this way?" is about row 7's own method.
  assert.ok(shows(promptOf(ch, 'CH-03-Q14'), textOf('CH-03-Q13')));
  // CK-03-Q02's TYPES OF DISH are the dishes that CK-03-Q01's different check is for.
  const ck03 = methodOf('CK-03').blocks.find((b) => (b.questions ?? []).some((q) => q.id === 'CK-03-Q02'));
  assert.ok(shows(promptOf(blankWorksheet('CK', data), 'CK-03-Q02'), ck03.questions[0].text));
});

test('every > line is the pack\'s text unchanged, a join of a box\'s column headings, or ends in a fixed hint', () => {
  const HINTS = ['(yes / no)', '(yes, or say what you do instead)', '(yes if you do this / no)', '(write your answer)', '(one item per line)'];
  for (const section of SECTION_IDS) {
    // Every whole paragraph of the section's headings, box text, points and question text (notes
    // included), and every join of neighbouring column headings of a box.
    const allowed = new Set();
    const elseTexts = new Set();
    const add = (text) => {
      for (const paragraph of (text ?? '').split('\n')) allowed.add(paragraph.trimEnd());
    };
    for (const method of data.sections.get(section).methods) {
      for (const block of method.blocks) {
        add(block.heading);
        if (block.kind === 'check-it') add(block.text);
        const columns = block.columns ?? [];
        for (let from = 0; from < columns.length; from++) {
          for (let to = from + 1; to <= columns.length; to++) allowed.add(columns.slice(from, to).join(' / '));
        }
        for (const holder of holders(block)) {
          if (holder !== block) add(holder.point);
          for (const question of holder.questions ?? []) {
            add(question.text);
            if (question.elseText) elseTexts.add(question.elseText);
          }
        }
      }
    }
    const endings = HINTS.flatMap((hint) => [hint, ...[...elseTexts].map((e) => `${hint} ${e}`)]);
    const fits = (content) => allowed.has(content) || endings.some((ending) => content === ending ||
      (content.endsWith(`  ${ending}`) && allowed.has(content.slice(0, -(ending.length + 2)))));
    const strays = blankWorksheet(section, data).split('\n').filter((line) => line.startsWith('>'))
      .map((line) => line.replace(/^> ?/, '')).filter((content) => content !== '' && !fits(content));
    assert.deepEqual(strays, [], section);
  }
});

// ---- Round trip ----

test('generate, parse, emit, parse is stable for every section', () => {
  for (const section of WORKSHEET_SECTIONS) {
    const text = blankWorksheet(section, data);
    const parsed = parse(text);
    const again = emitWorksheet(parsed, data);
    assert.equal(again, text, section);
    assert.deepEqual(parse(again), parsed, section);
  }
});

test('answers keep every field through parse and emit', () => {
  let text = blankWorksheet('CK', data);
  text = fill(text, 'CK-02-Q01', 'Answer: Egg mayonnaise sandwiches', '  Quiche', 'State: confirmed', 'By: Sam Okafor',
    'On: 2026-11-20', 'Source: Menu, autumn 2026');
  text = fill(text, 'CK-02-Q03', 'Answer: We do not cook rice.', 'State: proposed', 'By: Kitchen assistant', 'On:',
    'Source: Kitchen walk-round notes');
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(emitWorksheet(parsed, data), text);
  const eggs = parse(emitWorksheet(parsed, data)).answers.get('CK-02-Q01');
  assert.equal(eggs.answer, 'Egg mayonnaise sandwiches\nQuiche');
  assert.deepEqual(eggs.value, ['Egg mayonnaise sandwiches', 'Quiche']);
  assert.equal(eggs.state, 'confirmed');
  assert.equal(eggs.by, 'Sam Okafor');
  assert.equal(eggs.on, '2026-11-20');
  assert.equal(eggs.source, 'Menu, autumn 2026');
  assert.equal(eggs.answered, true);
  const rice = parsed.answers.get('CK-02-Q03');
  assert.equal(rice.state, 'proposed');
  assert.equal(rice.answered, false);
});

test('emitWorksheet refuses a worksheet with problems, since writing it would drop what was set aside', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: maybe', 'State: done', 'By:', 'On:', 'Source:');
  const parsed = parse(text);
  assert.match(messages(parsed), /maybe/);
  assert.match(messages(parsed), /done/);
  assert.throws(() => emitWorksheet(parsed, data), /has 2 problems/);
  const repeated = blankWorksheet('CK', data).replace('### CK-06-Q02\n', '### CK-06-Q01\n');
  assert.throws(() => emitWorksheet(parse(repeated), data), /problem/);
});

// ---- Hand-edited slips: each is read correctly or reported with its line number ----

test('slip: "answer: Yes" is read as yes', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'answer: Yes', ...confirmed('').slice(1));
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  const answer = parsed.answers.get('CK-06-Q01');
  assert.equal(answer.value, 'yes');
  assert.equal(answer.answered, true);
  assert.match(emitWorksheet(parsed, data), /\nAnswer: Yes\n/);
});

test('slip: spaces and tabs at the ends of lines are ignored', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q02', 'Answer: A bain-marie   ', 'State: confirmed  ',
    'By: Sam Okafor \t', 'On: 2026-11-20 ', 'Source: ');
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  const answer = parsed.answers.get('CK-06-Q02');
  assert.equal(answer.answer, 'A bain-marie');
  assert.equal(answer.by, 'Sam Okafor');
  assert.equal(answer.answered, true);
});

test('slip: Windows line endings are read, and line numbers stay right', () => {
  const unix = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: confirmed', 'By:', 'On: 2026-11-20', 'Source:');
  const parsed = parse(unix.replace(/\n/g, '\r\n'));
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(unix, 'By:', '### CK-06-Q01'));
  assert.match(parsed.problems[0].message, /By/);
  assert.deepEqual(parse(blankWorksheet('CK', data).replace(/\n/g, '\r\n')).problems, []);
});

test('slip: a blank line inside a two-line answer ends it, and the indented line after it is reported', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-02-Q01', 'Answer: Egg mayonnaise sandwiches', '', '  Quiche',
    ...confirmed('').slice(1));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, '  Quiche'));
  assert.match(parsed.problems[0].message, /blank line/);
  assert.equal(parsed.answers.get('CK-02-Q01').answer, 'Egg mayonnaise sandwiches');
  assert.equal(parsed.answers.get('CK-02-Q01').answered, false);
});

test('an indented line after a blank line is credited to no question', () => {
  // Meant for CK-06-Q02, typed above its heading: it must not become CK-06-Q01's Source.
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes'))
    .replace('### CK-06-Q02\n', '  Answer: A bain-marie, preheated\n\n### CK-06-Q02\n');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, '  Answer: A bain-marie'));
  assert.match(parsed.problems[0].message, /a field must start at the beginning of the line/);
  assert.equal(parsed.answers.get('CK-06-Q01').source, '');
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
  // An indented field straight after another field is not taken as part of its value either.
  const nested = parse(fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', '  state: confirmed', 'By: Sam Okafor', 'On: 2026-11-20', 'Source:'));
  assert.match(messages(nested), /a field must start at the beginning of the line/);
  assert.equal(nested.answers.get('CK-06-Q01').answer, 'yes');
  // Plain text, indented, after a blank line.
  const loose = fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes')).replace('### CK-06-Q02\n', '  preheated first\n\n### CK-06-Q02\n');
  const looseParsed = parse(loose);
  assert.equal(looseParsed.problems.length, 1);
  assert.equal(looseParsed.problems[0].line, lineOf(loose, '  preheated first'));
  assert.equal(looseParsed.answers.get('CK-06-Q01').source, '');
});

test('slip: a tab instead of spaces before a continuation line is accepted', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-02-Q01', 'Answer: Egg mayonnaise sandwiches', '\tQuiche',
    ...confirmed('').slice(1));
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.deepEqual(parsed.answers.get('CK-02-Q01').value, ['Egg mayonnaise sandwiches', 'Quiche']);
  assert.match(emitWorksheet(parsed, data), /\nAnswer: Egg mayonnaise sandwiches\n {2}Quiche\n/);
});

test('slip: a field name in a different letter case is accepted', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'ANSWER: no', 'state: Confirmed', 'by: Sam Okafor',
    'On: 2026-11-20', 'source:');
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  const answer = parsed.answers.get('CK-06-Q01');
  assert.equal(answer.value, 'no');
  assert.equal(answer.state, 'confirmed');
  assert.match(emitWorksheet(parsed, data), /\nAnswer: no\nState: confirmed\nBy: Sam Okafor\n/);
});

test('slip: a space before the colon is accepted', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer : yes', 'State :confirmed', 'By  : Sam Okafor',
    'On: 2026-11-20', 'Source :');
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.answers.get('CK-06-Q01').answered, true);
});

test('slip: a byte order mark at the start of the file is ignored', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes'));
  const parsed = parse(`\uFEFF${text}`);
  assert.deepEqual(parsed.problems, []);
  assert.deepEqual(parsed, parse(text));
});

test('slip: a Build Provenance section appended by another tool is neither a method nor a problem', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes'));
  const stamped = `${text}\n<!-- arckit-provenance:start -->\n\n## Build Provenance\n\n*Stamped automatically.*\n\n` +
    '| Field | Value |\n|-------|-------|\n| Stamped at | 2026-11-20T10:00:00Z |\n\nAnswer: not mine\n\n' +
    '<!-- arckit-provenance:end -->\n';
  const parsed = parse(stamped);
  assert.deepEqual(parsed.problems, []);
  assert.deepEqual(parsed, parse(text));
});

test('a heading of the worksheet after a Build Provenance section is read again, not swallowed', () => {
  // A filled question block after the section, in the profile (which has no method headings).
  const blank = blankWorksheet('profile', data);
  const start = blank.indexOf('### PR-Q20\n');
  const moved = `${blank.slice(0, start)}${blank.slice(blank.indexOf('Source:\n', start) + 'Source:\n'.length + 1)}`.replace(/\n+$/, '\n') +
    '\n## Build Provenance\n\n| Field | Value |\n|---|---|\n| x | y |\n\n' + `### PR-Q20\n\n${confirmed('no').join('\n')}\n`;
  const parsed = parse(moved);
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.answers.get('PR-Q20').answered, true);
  // In a section worksheet, a repeated question after the section is reported, not ignored.
  const ck = `${blankWorksheet('CK', data)}\n## Build Provenance\n\n| Field | Value |\n\n### CK-07-Q01\n\n${confirmed('Ham').join('\n')}\n`;
  const repeated = parse(ck);
  assert.equal(repeated.problems.length, 1);
  assert.match(repeated.problems[0].message, /CK-07-Q01 appears more than once/);
  // A method heading after it is read as before.
  const method = parse(blankWorksheet('CK', data).replace('## CK-07 ', '## Build Provenance\n\n| x | y |\n\n## CK-07 '));
  assert.deepEqual(method.problems, []);
});

test('whatever follows a Build Provenance section is read or reported, never silently unread', () => {
  const section = '## Build Provenance\n\n*Stamped automatically.*\n\n| Field | Value |\n|---|---|\n| x | y |\n';
  // Any ## heading but Build Provenance ends the section, as before: an unknown one is reported.
  const notes = blankWorksheet('CK', data).replace('## CK-07 ', `${section}\n## Notes\n\nAnswer: x\n\n## CK-07 `);
  const parsedNotes = parse(notes);
  assert.equal(parsedNotes.problems.length, 1);
  assert.equal(parsedNotes.problems[0].line, lineOf(notes, '## Notes'));
  // An own entry with a mistyped identifier after the section is reported, as it is without one.
  const entry = ['## OWN-3 Milk for coffee', '', 'Kind: additional', 'Hazard: h', 'Control: c', 'Check: k', 'If-it-fails: f',
    'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20'];
  const own = `${blankWorksheet('own', data)}\n${section}\n${entry.join('\n')}\n`;
  const parsedOwn = parse(own);
  assert.equal(parsedOwn.problems.length, 1);
  assert.equal(parsedOwn.problems[0].line, lineOf(own, '## OWN-3'));
  // The tool's end marker ends the section: what follows it is read.
  const ended = `${blankWorksheet('CK', data)}\n<!-- arckit-provenance:start -->\n\n${section}\n<!-- arckit-provenance:end -->\n\nWe also wash the fridge\n`;
  const parsedEnded = parse(ended);
  assert.equal(parsedEnded.problems.length, 1);
  assert.equal(parsedEnded.problems[0].line, lineOf(ended, 'We also wash the fridge'));
  assert.match(parsedEnded.problems[0].message, /not understood/);
});

test('an indented line after an empty field line is credited to no field, Answer included', () => {
  // Meant for CK-06-Q02, typed under CK-06-Q01's empty Source: it must not become that Source.
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes'), '  A bain-marie, preheated before service');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, '  A bain-marie, preheated'));
  assert.match(parsed.problems[0].message, /empty/);
  assert.equal(parsed.answers.get('CK-06-Q01').source, '');
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
  // A list answer starts on the Answer: line; items under an empty Answer: line are not read.
  const list = fill(blankWorksheet('CK', data), 'CK-02-Q01', 'Answer:', '  Quiche', '  Scrambled eggs', ...confirmed('').slice(1));
  const parsedList = parse(list);
  const indented = parsedList.problems.find((p) => p.line === lineOf(list, '  Quiche'));
  assert.ok(indented, messages(parsedList));
  assert.match(indented.message, /empty/);
  assert.equal(parsedList.answers.get('CK-02-Q01').answer, '');
  assert.equal(parsedList.answers.get('CK-02-Q01').answered, false);
});

test('a second line of an answer that is not indented is reported with its line number, and the answer is not used', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-02-Q01', 'Answer: Egg mayonnaise sandwiches', 'Quiche',
    ...confirmed('').slice(1));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Quiche'));
  assert.equal(parsed.answers.get('CK-02-Q01').answered, false);
});

test('an answer typed onto a question line is reported, not dropped', () => {
  const text = blankWorksheet('CK', data).replace('> Do you hot hold?  (yes / no)\n', '> Do you hot hold?  (yes / no) yes\n');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, '(yes / no) yes'));
  assert.match(parsed.problems[0].message, /Answer:/);
  // Deleting a question line loses nothing, so it is not a problem.
  assert.deepEqual(parse(blankWorksheet('CK', data).replace('> Do you hot hold?  (yes / no)\n', '')).problems, []);
});

test('a comment inside an answer is a problem, and the answer is not used: it would be hidden once rendered', () => {
  for (const lines of [['Answer: A bain-marie', '  <!-- ask Sam if this is still true -->'], ['Answer: A bain-marie <!-- ask Sam if this is still true -->']]) {
    const text = fill(blankWorksheet('CK', data), 'CK-06-Q02', ...lines, ...confirmed('').slice(1));
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, lines.join(' / '));
    assert.equal(parsed.problems[0].line, lineOf(text, '<!-- ask Sam'));
    assert.match(parsed.problems[0].message, /comment/);
    assert.equal(parsed.answers.get('CK-06-Q02').answered, false);
  }
  const reason = parse(blankWorksheet('CK', data).replace(/(## CK-06 [^\n]*\n\n?Status: )applies\nReason:\nDecided-by:\n/,
    '$1not-relevant\nReason: We never hot hold.\n  <!-- check with Sam -->\nDecided-by: Sam Okafor\n'));
  assert.equal(reason.problems.length, 1);
  assert.match(reason.problems[0].message, /comment/);
});

test('an own entry filled in inside the commented template is reported, not dropped', () => {
  const blank = blankWorksheet('own', data);
  const text = blank.replace('Kind:\n', 'Kind: additional\n').replace('State: unanswered\n', 'State: confirmed\n');
  const parsed = parse(text);
  assert.equal(parsed.entries.size, 0);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Kind: additional'));
  assert.match(parsed.problems[0].message, /nothing inside a comment is read: copy the entry below the comment/);
  // The same check guards each worksheet's guidance; a comment of a person's own elsewhere is not read and not a problem.
  const noted = blankWorksheet('CK', data).replace('Proved-safe:\n', 'Proved-safe:\n<!-- Sam to check -->\n<!--\nAnd this.\n-->\n');
  assert.deepEqual(parse(noted).problems, []);
  const changed = blankWorksheet('CK', data).replace('How to fill this in.', 'Answer: yes. How to fill this in.');
  assert.match(messages(parse(changed)), /nothing inside a comment is read/);
});

test('any other comment holding a worksheet line, such as a filled own entry in a comment of its own, is reported', () => {
  const own = blankWorksheet('own', data);
  const entry = ['## OWN-01 Milk for coffee', '', 'Kind: additional', 'Hazard: Milk going off', 'Control: Date cartons',
    'Limit:', 'Limit-source:', 'Check: Opening checks', 'If-it-fails: Throw away', 'Supplied-text:', 'EH-review:',
    'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20'];
  const wrapped = `${own}\n<!--\n${entry.join('\n')}\n-->\n`;
  const parsed = parse(wrapped);
  assert.equal(parsed.entries.size, 0);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(wrapped, '## OWN-01 Milk for coffee'));
  assert.match(parsed.problems[0].message, /nothing inside a comment is read/);
  // One line, in a section worksheet: a question heading, or a field.
  for (const comment of ['<!-- Answer: no -->', '<!-- ### CK-06-Q01 -->', '<!-- ## CK-06 Hot holding -->', '<!-- state : confirmed -->']) {
    const text = blankWorksheet('CK', data).replace('### CK-06-Q02\n', `${comment}\n### CK-06-Q02\n`);
    const one = parse(text);
    assert.equal(one.problems.length, 1, comment);
    assert.equal(one.problems[0].line, lineOf(text, comment), comment);
    assert.match(one.problems[0].message, /nothing inside a comment is read/, comment);
  }
  // A plain remark is not read and is not a problem; nor are the lint comments or another tool's markers.
  assert.deepEqual(parse(blankWorksheet('CK', data).replace('### CK-06-Q02\n', '<!-- ask Sam about the bain-marie -->\n### CK-06-Q02\n')).problems, []);
  assert.deepEqual(parse(`${blankWorksheet('profile', data)}\n<!-- arckit-provenance:start -->\n<!-- arckit-provenance:end -->\n`).problems, []);
});

test('text after the end of a comment is reported, not dropped', () => {
  const blank = blankWorksheet('CK', data);
  for (const insert of ['<!-- note --> yes\n', '<!--\nnote\n--> yes\n']) {
    const text = blank.replace('### CK-06-Q02\n', `${insert}### CK-06-Q02\n`);
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, insert);
    assert.equal(parsed.problems[0].line, lineOf(text, '--> yes'), insert);
    assert.match(parsed.problems[0].message, /after the end of a comment/);
  }
});

test('text after a question\'s identifier, or a method heading that is not the method\'s title, is reported', () => {
  const blank = blankWorksheet('CK', data);
  const question = fill(blank, 'CK-06-Q01', ...confirmed('yes')).replace('### CK-06-Q01\n', '### CK-06-Q01 yes we do\n');
  const parsedQuestion = parse(question);
  assert.equal(parsedQuestion.problems.length, 1);
  assert.equal(parsedQuestion.problems[0].line, lineOf(question, '### CK-06-Q01 yes we do'));
  assert.match(parsedQuestion.problems[0].message, /yes we do/);
  assert.equal(parsedQuestion.answers.get('CK-06-Q01').answered, false);
  const method = blank.replace('## CK-06 Hot holding\n', '## CK-06 Hot holding - NOT RELEVANT\n');
  const parsedMethod = parse(method);
  assert.equal(parsedMethod.problems.length, 1);
  assert.equal(parsedMethod.problems[0].line, lineOf(method, '## CK-06 Hot holding - NOT RELEVANT'));
  assert.match(parsedMethod.problems[0].message, /NOT RELEVANT/);
  // Letter case and spacing in a method's title are not changes.
  assert.deepEqual(parse(blank.replace('## CK-06 Hot holding\n', '## CK-06   HOT   holding\n')).problems, []);
});

// ---- State, Status and answer types ----

test('a confirmed answer with no By is a problem, and is not used', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: confirmed', 'By:', 'On: 2026-11-20', 'Source:');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /CK-06-Q01.*By/);
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
});

test('a confirmed answer needs a real date, YYYY-MM-DD, in On', () => {
  for (const on of ['', '20/11/2026', '2026-02-30', '2026-11-20 morning']) {
    const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: confirmed', 'By: Sam Okafor', `On: ${on}`, 'Source:');
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, on);
    assert.match(parsed.problems[0].message, /On/, on);
    assert.equal(parsed.answers.get('CK-06-Q01').answered, false, on);
  }
});

test('a proposed answer needs a Source, and never counts as answered', () => {
  const without = parse(fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: proposed', 'By:', 'On:', 'Source:'));
  assert.equal(without.problems.length, 1);
  assert.match(without.problems[0].message, /Source/);
  const sourced = parse(fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: proposed', 'By:', 'On:', 'Source: Owner, by phone'));
  assert.deepEqual(sourced.problems, []);
  assert.equal(sourced.answers.get('CK-06-Q01').answered, false);
  assert.equal(sourced.answers.get('CK-06-Q01').value, 'yes');
});

test('an answer left with State unanswered is a problem, and so is a By, On or Source', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: unanswered', 'By:', 'On:', 'Source:');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Answer: yes'));
  assert.match(parsed.problems[0].message, /unanswered/);
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
  const by = parse(fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer:', 'State: unanswered', 'By: Sam Okafor', 'On:', 'Source:'));
  assert.equal(by.problems.length, 1);
  assert.match(by.problems[0].message, /By/);
});

test('a State that is empty or not one of the three is a problem', () => {
  for (const state of ['', 'done', 'answered']) {
    const parsed = parse(fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', `State: ${state}`, 'By: Sam Okafor', 'On: 2026-11-20', 'Source:'));
    assert.equal(parsed.problems.length, 1, state);
    assert.match(parsed.problems[0].message, /unanswered, proposed or confirmed/, state);
    assert.equal(parsed.answers.get('CK-06-Q01').answered, false, state);
  }
});

test('an Answer that does not fit its question is reported with its line number, and is not used', () => {
  const cases = [['CK-06-Q01', 'maybe'], ['CK-04-Q01', 'ticked'], ['CK-06-Q01', 'yes\n  definitely']];
  for (const [qid, answer] of cases) {
    const [first, ...rest] = answer.split('\n');
    const text = fill(blankWorksheet('CK', data), qid, `Answer: ${first}`, ...rest, ...confirmed('').slice(1));
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, answer);
    assert.equal(parsed.problems[0].line, lineOf(text, `Answer: ${first}`), answer);
    assert.match(parsed.problems[0].message, /yes or no/, answer);
    assert.equal(parsed.answers.get(qid).answered, false, answer);
    assert.equal(parsed.answers.get(qid).value, null, answer);
  }
});

test('a yes-no-else question takes yes in any case, or what the business does instead', () => {
  for (const answer of ['YES', 'yes', 'Yes.']) {
    const yes = parse(fill(blankWorksheet('CK', data), 'CK-02-Q02', ...confirmed(answer)));
    assert.deepEqual(yes.problems, [], answer);
    assert.equal(yes.answers.get('CK-02-Q02').value, 'yes', answer);
  }
  const instead = parse(fill(blankWorksheet('CK', data), 'CK-02-Q02', 'Answer: We only use pasteurised liquid egg,',
    '  so nothing is served lightly cooked.', ...confirmed('').slice(1)));
  assert.deepEqual(instead.problems, []);
  assert.equal(instead.answers.get('CK-02-Q02').value, 'We only use pasteurised liquid egg,\nso nothing is served lightly cooked.');
});

test('a yes-no-else answer that is only no, or another yes-or-no word, is reported: it says nothing done instead', () => {
  for (const answer of ['no', 'No.', 'n', 'nope', 'Not', 'never', 'y', 'Yeah', 'yep!', 'yes!', 'yse', 'ok']) {
    const text = fill(blankWorksheet('CK', data), 'CK-02-Q02', ...confirmed(answer));
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, answer);
    assert.equal(parsed.problems[0].line, lineOf(text, `Answer: ${answer}`, '### CK-02-Q02'), answer);
    assert.match(parsed.problems[0].message, /say what you do instead/, answer);
    assert.equal(parsed.answers.get('CK-02-Q02').answered, false, answer);
    assert.equal(parsed.answers.get('CK-02-Q02').value, null, answer);
  }
  // A sentence that starts with no is what the business does instead.
  const sentence = parse(fill(blankWorksheet('CK', data), 'CK-02-Q02', ...confirmed('No: we only use pasteurised liquid egg.')));
  assert.deepEqual(sentence.problems, []);
});

test('a yes-no-else answer that is a refused word with any run of marks, or a non-answer, is reported', () => {
  const refused = ['no...', 'No\u2026', 'NO!!', 'no!?', 'Nope!!', 'Nah.', 'Yes!!', 'yes...', 'Yes\u2026', 'yes..', 'N/A', 'n/a',
    'na', 'NA.', 'none', 'None.', 'nil', '-', '?', '...', 'No,', 'No -'];
  for (const answer of refused) {
    const parsed = parse(fill(blankWorksheet('CK', data), 'CK-02-Q02', ...confirmed(answer)));
    assert.equal(parsed.problems.length, 1, answer);
    assert.match(parsed.problems[0].message, /say what you do instead/, answer);
    assert.equal(parsed.answers.get('CK-02-Q02').answered, false, answer);
  }
  for (const answer of ['yes', 'Yes.', 'Never: we use liquid egg', 'No fryer on site, we oven-bake', 'no thanks, we use liquid egg']) {
    const parsed = parse(fill(blankWorksheet('CK', data), 'CK-02-Q02', ...confirmed(answer)));
    assert.deepEqual(parsed.problems, [], answer);
  }
});

test('not applicable, n.a. and a lone em or en dash are refused for yes-no-else, and the message offers why it does not apply', () => {
  for (const answer of ['Not applicable', 'not applicable.', 'n.a.', 'N.A', '\u2014', '\u2013']) {
    const parsed = parse(fill(blankWorksheet('CK', data), 'CK-02-Q06', ...confirmed(answer)));
    assert.equal(parsed.problems.length, 1, answer);
    assert.match(parsed.problems[0].message, /write yes, or say what you do instead, or say why it does not apply$/, answer);
    assert.equal(parsed.answers.get('CK-02-Q06').answered, false, answer);
  }
  // A sentence saying why it does not apply is an answer.
  assert.deepEqual(parse(fill(blankWorksheet('CK', data), 'CK-02-Q06', ...confirmed('Not applicable: we do not prepare shellfish'))).problems, []);
});

test('a question\'s own else text, and a hint without its brackets or with a full stop, are copied hints', () => {
  const cases = [
    ['CK', 'CK-02-Q06', 'If not, what do you do?'], ['CK', 'CK-06-Q02', 'write your answer'], ['CK', 'CK-06-Q02', '(write your answer).'],
    ['CK', 'CK-06-Q02', 'Write your answer.'], ['CK', 'CK-02-Q02', 'yes, or say what you do instead'], ['CK', 'CK-06-Q01', 'yes / no.'],
    ['CK', 'CK-02-Q01', 'one item per line'], ['CL', 'CL-01-Q01', 'If no, what do you use?']
  ];
  for (const [section, qid, answer] of cases) {
    const parsed = parse(fill(blankWorksheet(section, data), qid, ...confirmed(answer)));
    assert.equal(parsed.problems.length, 1, `${qid} ${answer}`);
    assert.match(parsed.problems[0].message, /hint/, `${qid} ${answer}`);
    assert.equal(parsed.answers.get(qid).answered, false, `${qid} ${answer}`);
  }
});

test('an answer that is a hint copied from the question is reported, and not used', () => {
  const cases = [
    ['CK-06-Q02', '(write your answer)'], ['CK-06-Q02', '  (WRITE YOUR ANSWER) '], ['CK-06-Q01', '(yes / no)'],
    ['CK-04-Q01', '(yes if you do this / no)'], ['CK-02-Q01', '(one item per line)'],
    ['CK-02-Q02', '(yes, or say what you do instead)'], ['CK-02-Q02', '(yes, or say what you do instead) If not, what do you do?']
  ];
  for (const [qid, answer] of cases) {
    const parsed = parse(fill(blankWorksheet('CK', data), qid, ...confirmed(answer)));
    assert.equal(parsed.problems.length, 1, `${qid} ${answer}`);
    assert.match(parsed.problems[0].message, /hint/, `${qid} ${answer}`);
    assert.equal(parsed.answers.get(qid).answered, false, `${qid} ${answer}`);
    assert.equal(parsed.answers.get(qid).value, null, `${qid} ${answer}`);
  }
  const list = parse(fill(blankWorksheet('CK', data), 'CK-02-Q01', 'Answer: Quiche', '  (one item per line)', ...confirmed('').slice(1)));
  assert.match(messages(list), /hint/);
  const nation = parse(fill(blankWorksheet('profile', data), 'PR-Q06', ...confirmed('(England / Wales / Scotland / Northern Ireland / other)')));
  assert.match(messages(nation), /hint/);
});

test('yes and no may end with a full stop, and nothing else', () => {
  const read = (qid, answer) => parse(fill(blankWorksheet('CK', data), qid, ...confirmed(answer)));
  assert.equal(read('CK-06-Q01', 'Yes.').answers.get('CK-06-Q01').value, 'yes');
  assert.equal(read('CK-06-Q01', 'no.').answers.get('CK-06-Q01').value, 'no');
  assert.equal(read('CK-04-Q01', 'YES.').answers.get('CK-04-Q01').value, 'yes');
  for (const answer of ['yes!', 'no..', 'yes, always']) assert.match(messages(read('CK-06-Q01', answer)), /yes or no/, answer);
});

test('a text answer is read whole, and a list answer one item per line', () => {
  const text = fill(fill(blankWorksheet('CK', data), 'CK-06-Q02', 'Answer: A bain-marie,', '  preheated before service.',
    ...confirmed('').slice(1)), 'CK-02-Q07', ...confirmed('Prawns'));
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.answers.get('CK-06-Q02').value, 'A bain-marie,\npreheated before service.');
  assert.deepEqual(parsed.answers.get('CK-02-Q07').value, ['Prawns']);
});

// Replaces a method's blank status fields in a worksheet with the lines given.
const statusFields = (text, id, lines) => text.replace(
  new RegExp(`(## ${id} [^\\n]*\\n\\n?)Status: applies\\nReason:\\nDecided-by:\\nVariation:\\nProved-safe:\\n`),
  `$1${lines.map((l) => `${l}\n`).join('')}`);

test('a not-relevant method needs a Reason and a Decided-by', () => {
  const blank = blankWorksheet('CK', data);
  const ok = parse(statusFields(blank, 'CK-06', ['Status: not-relevant', 'Reason: We never keep food hot.', 'Decided-by: Sam Okafor', 'Variation:', 'Proved-safe:']));
  assert.deepEqual(ok.problems, []);
  assert.equal(ok.methods.get('CK-06').status, 'not-relevant');
  assert.equal(ok.methods.get('CK-06').reason, 'We never keep food hot.');
  assert.equal(ok.methods.get('CK-06').decidedBy, 'Sam Okafor');
  const text = statusFields(blank, 'CK-06', ['Status: not-relevant', 'Reason:', 'Decided-by: Sam Okafor', 'Variation:', 'Proved-safe:']);
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Reason:', '## CK-06'));
  assert.match(parsed.problems[0].message, /CK-06.*Reason/);
  // A field line that is missing altogether is reported at the method's heading.
  const gone = text.replace(/(## CK-06 [^\n]*\n\n?Status: not-relevant\n)Reason:\n/, '$1');
  assert.equal(parse(gone).problems[0].line, lineOf(gone, '## CK-06'));
  const noDecider = parse(statusFields(blank, 'CK-06', ['Status: Not-Relevant', 'Reason: We never keep food hot.', 'Decided-by:', 'Variation:', 'Proved-safe:']));
  assert.equal(noDecider.problems.length, 1);
  assert.match(noDecider.problems[0].message, /Decided-by/);
});

test('an adapted method needs a Variation, a Reason and Proved-safe', () => {
  const blank = blankWorksheet('CL', data);
  const ok = parse(statusFields(blank, 'CL-04', ['Status: adapted', 'Reason: r', 'Decided-by:', 'Variation: v', 'Proved-safe: p']));
  assert.deepEqual(ok.problems, []);
  assert.deepEqual(['variation', 'reason', 'provedSafe'].map((k) => ok.methods.get('CL-04')[k]), ['v', 'r', 'p']);
  const parsed = parse(statusFields(blank, 'CL-04', ['Status: adapted', 'Reason: r', 'Decided-by:', 'Variation:', 'Proved-safe:']));
  assert.equal(parsed.problems.length, 2);
  assert.match(messages(parsed), /Variation/);
  assert.match(messages(parsed), /Proved-safe/);
});

test('a status field that the method\'s status does not use is reported, not dropped', () => {
  const parsed = parse(statusFields(blankWorksheet('CK', data), 'CK-06', ['Status: applies', 'Reason:', 'Decided-by:', 'Variation: We use a soup kettle', 'Proved-safe:']));
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /Variation.*applies/);
});

test('a Status that is empty or not one of the three is a problem', () => {
  for (const status of ['', 'maybe']) {
    const parsed = parse(statusFields(blankWorksheet('CK', data), 'CK-06', [`Status: ${status}`, 'Reason:', 'Decided-by:', 'Variation:', 'Proved-safe:']));
    assert.equal(parsed.problems.length, 1, status);
    assert.match(parsed.problems[0].message, /applies, adapted or not-relevant/, status);
  }
});

test('answers given for a method marked not relevant are reported, and not used', () => {
  let text = statusFields(blankWorksheet('CK', data), 'CK-06', ['Status: not-relevant', 'Reason: We never keep food hot.', 'Decided-by: Sam Okafor', 'Variation:', 'Proved-safe:']);
  text = fill(text, 'CK-06-Q01', ...confirmed('no'));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /answers given for a method marked not relevant/);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Answer: no'));
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
});

test('answers under a method whose status has a problem are not answered', () => {
  for (const lines of [
    ['Status: not relevant', 'Reason:', 'Decided-by:', 'Variation:', 'Proved-safe:'],
    ['Status: adapted', 'Reason: r', 'Decided-by:', 'Variation:', 'Proved-safe: p'],
    ['Status: applies', 'Reason: We sometimes skip this', 'Decided-by:', 'Variation:', 'Proved-safe:']
  ]) {
    const text = fill(statusFields(blankWorksheet('CK', data), 'CK-06', lines), 'CK-06-Q01', ...confirmed('yes'));
    const parsed = parse(text);
    assert.equal(parsed.problems.length, 1, lines[0]);
    assert.equal(parsed.answers.get('CK-06-Q01').answered, false, lines.join(' / '));
    assert.equal(parsed.answers.get('CK-06-Q01').value, 'yes');
  }
});

// ---- Structure ----

test('an unknown question identifier is a problem', () => {
  const text = blankWorksheet('CK', data).replace('### CK-06-Q05\n', '### CK-06-Q99\n');
  const parsed = parse(text);
  assert.match(messages(parsed), /CK-06-Q99/);
  assert.ok(parsed.problems.some((p) => p.line === lineOf(text, '### CK-06-Q99')));
  assert.match(messages(parsed), /CK-06-Q05.*missing/);
});

test('a question under the wrong method is a problem, and its answer is not used', () => {
  const blank = blankWorksheet('CK', data);
  const moved = blank.replace('### CK-06-Q05\n', '### CK-03-Q01\n').replace('### CK-03-Q01\n', '### CK-06-Q05\n');
  const text = fill(moved, 'CK-03-Q01', ...confirmed('A probe in the thickest part'));
  const parsed = parse(text);
  assert.match(messages(parsed), /CK-03-Q01 belongs to CK-03/);
  assert.match(messages(parsed), /CK-06-Q05 belongs to CK-06/);
  assert.equal(parsed.answers.get('CK-03-Q01').answered, false);
});

test('a note is not a question to answer', () => {
  const note = questionsOf(methodOf('MG-02')).find((q) => q.type === 'note');
  const text = blankWorksheet('MG', data).replace('### MG-02-Q02\n', `### ${note.id}\n`);
  assert.match(messages(parse(text)), new RegExp(`${note.id} is a note`));
});

test('a missing method, a missing question and a repeated question are each a problem', () => {
  const blank = blankWorksheet('CK', data);
  const withoutMethod = blank.replace(/## CK-01 [^\n]*\n\nStatus: applies\nReason:\nDecided-by:\nVariation:\nProved-safe:\n\n/, '');
  const parsed = parse(withoutMethod);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /CK-01.*missing/);
  assert.equal(parsed.problems[0].line, 3);
  const start = blank.indexOf('### CK-06-Q05\n');
  const end = blank.indexOf('Source:\n', start) + 'Source:\n\n'.length;
  const withoutQuestion = blank.slice(0, start) + blank.slice(end);
  assert.match(messages(parse(withoutQuestion)), /CK-06-Q05.*missing/);
  const repeated = blank.slice(0, end) + blank.slice(start, end) + blank.slice(end);
  const twice = parse(repeated);
  assert.equal(twice.problems.length, 1);
  assert.match(twice.problems[0].message, /CK-06-Q05.*more than once/);
  assert.equal(twice.problems[0].line, repeated.slice(0, end).split('\n').length);
});

test('an unknown method heading, field or line is a problem with its line number', () => {
  const blank = blankWorksheet('CK', data);
  for (const [insert, pattern] of [
    ['## CK-99 Smoking\n', /CK-99/], ['## Notes\n', /Notes/], ['Colour: blue\n', /Colour/],
    ['We also wash the fridge\n', /not understood/], ['# Second title\n', /not understood/]
  ]) {
    const text = blank.replace('### CK-06-Q02\n', `${insert}### CK-06-Q02\n`);
    const parsed = parse(text);
    const problem = parsed.problems.find((p) => pattern.test(p.message));
    assert.ok(problem, `${insert}: ${messages(parsed)}`);
    assert.equal(problem.line, lineOf(text, insert.trim()), insert);
  }
  // An indented line straight after a heading has no field to continue.
  const stray = blank.replace('### CK-06-Q02\n', '### CK-06-Q02\n  stray\n');
  const parsed = parse(stray);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(stray, '  stray'));
  assert.match(parsed.problems[0].message, /continue/);
});

test('a method heading given twice is a problem, and the second is not read', () => {
  const blank = blankWorksheet('CK', data);
  const text = blank.replace('### CK-06-Q02\n', '## CK-06 Hot holding\nStatus: not-relevant\n\n### CK-06-Q02\n');
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /CK-06 appears more than once/);
  assert.equal(parsed.problems[0].line, lineOf(text, '## CK-06 Hot holding', '### CK-06-Q01'));
  assert.equal(parsed.methods.get('CK-06').status, 'applies');
});

test('a field given twice is a problem, and the second is not read', () => {
  const text = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'Answer: no', ...confirmed('').slice(1));
  const parsed = parse(text);
  assert.equal(parsed.problems.length, 1);
  assert.equal(parsed.problems[0].line, lineOf(text, 'Answer: no'));
  assert.equal(parsed.answers.get('CK-06-Q01').answered, false);
});

test('a comment that is never closed is reported where it starts', () => {
  const text = blankWorksheet('CK', data).replace('### CK-06-Q02\n', '<!-- left open\n### CK-06-Q02\n');
  const parsed = parse(text);
  assert.ok(parsed.problems.some((p) => p.line === lineOf(text, '<!-- left open') && /never closed/.test(p.message)));
});

test('the marker must name this data and a known section', () => {
  const blank = blankWorksheet('CK', data);
  const old = parse(blank.replace(`data=${DATA_ID}`, 'data=sfbb-caterers-2025-01-01'));
  assert.equal(old.problems.length, 1);
  assert.equal(old.problems[0].line, 3);
  assert.match(old.problems[0].message, /sfbb-caterers-2025-01-01/);
  assert.match(old.problems[0].message, new RegExp(DATA_ID));
  assert.match(messages(parse(blank.replace('section=CK', 'section=XX'))), /XX/);
  assert.match(messages(parse(blank.replace('uk-food-answers 1.0', 'uk-food-answers 2.0'))), /2\.0/);
  const none = parse('# Answers\n\nAnswer: yes\n');
  assert.equal(none.problems.length, 1);
  assert.equal(none.problems[0].line, 1);
  assert.equal(none.section, null);
  assert.match(messages(parse(`Hello\n${blank}`)), /before/);
});

test('a section the data does not hold is a problem, not a crash', () => {
  const partial = { ...data, sections: new Map([...data.sections].filter(([id]) => id !== 'CK')) };
  const parsed = parseWorksheet(blankWorksheet('CK', data), partial);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /CK/);
});

test('parseWorksheet never throws on malformed input, and every problem has a line number', () => {
  const blank = blankWorksheet('CK', data);
  const pieces = ['###', '## ', '### CK-06-Q01', '## CK-06 Hot holding', '<!--', '-->', '> x', '  x', '\tx', 'Answer:',
    'State: ???', 'On: 9999-99-99', ':', '## Build Provenance', '#', '', '\r', '\uFEFF', 'Status: not-relevant', 'Kind: x'];
  let seed = 7;
  const random = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  for (let round = 0; round < 300; round++) {
    const lines = (round % 3 === 0 ? blankWorksheet(['profile', 'own', 'XC'][round % 9 / 3], data) : blank).split('\n');
    for (let edit = 0; edit < 1 + random(6); edit++) {
      const at = random(lines.length);
      const choice = random(3);
      if (choice === 0) lines.splice(at, 1);
      else if (choice === 1) lines.splice(at, 0, pieces[random(pieces.length)]);
      else lines[at] = lines[at].slice(0, random(lines[at].length + 1));
    }
    const text = lines.join('\n');
    const parsed = parse(text);
    for (const problem of parsed.problems) {
      assert.ok(Number.isInteger(problem.line) && problem.line >= 1 && problem.line <= lines.length + 1,
        `round ${round}: line ${problem.line}`);
      assert.equal(typeof problem.message, 'string');
    }
  }
  for (const odd of ['', '\n', '<!--', '-->', '\uFEFF', 'x'.repeat(5000), '\u0000\u0001']) {
    assert.ok(Array.isArray(parse(odd).problems));
  }
});

// ---- Profile ----

test('the profile asks the fixed questions, PR-Q01 onward, with no status lines', () => {
  const text = blankWorksheet('profile', data);
  const ids = [...text.matchAll(/^### (\S+)$/gm)].map((m) => m[1]);
  assert.deepEqual(ids, PROFILE_QUESTIONS.map((q) => q.id));
  assert.deepEqual(ids, ids.map((_, i) => `PR-Q${String(i + 1).padStart(2, '0')}`));
  assert.equal(ids.length, 10 + EXTRA_CARE.processes.length + EXTRA_CARE.foods.length);
  assert.doesNotMatch(text, /^(Status|Reason|Decided-by|Variation|Proved-safe):/m);
  assert.doesNotMatch(text, /^## /m);
  assert.equal(PROFILE_QUESTIONS[5].type, 'nation');
  assert.match(promptOf(text, 'PR-Q06').at(-1), /\(England \/ Wales \/ Scotland \/ Northern Ireland \/ other\)$/);
  const extra = PROFILE_QUESTIONS.slice(10);
  assert.ok(extra.every((q) => q.type === 'yes-no'));
  for (const [i, name] of [...EXTRA_CARE.processes, ...EXTRA_CARE.foods].entries()) assert.ok(extra[i].text.includes(name), name);
});

test('the special processes and foods are named as printed in CK-02\'s "Other foods that need extra care" box', () => {
  const box = methodOf('CK-02').blocks.find((b) => b.kind === 'text' && b.page === 53 && /Other foods that need extra care/.test(b.heading));
  assert.ok(box, 'the box is not in CK.json');
  for (const name of [...EXTRA_CARE.processes, ...EXTRA_CARE.foods]) {
    assert.ok(box.text.includes(name), `${JSON.stringify(name)} is not in the box`);
  }
  assert.equal(new Set([...EXTRA_CARE.processes, ...EXTRA_CARE.foods]).size, EXTRA_CARE.processes.length + EXTRA_CARE.foods.length);
});

test('the special processes and foods are every one the box\'s two "Example ... include:" lines name, in order', () => {
  const box = methodOf('CK-02').blocks.find((b) => b.kind === 'text' && b.page === 53 && /Other foods that need extra care/.test(b.heading));
  const named = (label) => {
    const opening = `Example ${label} include: `;
    const line = box.text.split('\n').find((l) => l.startsWith(opening));
    assert.ok(line, `the box has no line starting ${JSON.stringify(opening)}`);
    return line.slice(opening.length).trimEnd().split(', ');
  };
  assert.deepEqual(EXTRA_CARE.processes, named('processes'));
  assert.deepEqual(EXTRA_CARE.foods, named('foods'));
});

test('the nation is England, Wales, Scotland, Northern Ireland or other, in any letter case', () => {
  const blank = blankWorksheet('profile', data);
  const read = (answer) => parse(fill(blank, 'PR-Q06', ...confirmed(answer)));
  for (const [answer, value] of [['england', 'England'], ['WALES', 'Wales'], ['scotland', 'Scotland'],
    ['northern  ireland', 'Northern Ireland'], ['Other', 'other']]) {
    const parsed = read(answer);
    assert.deepEqual(parsed.problems, [], answer);
    assert.equal(parsed.answers.get('PR-Q06').value, value, answer);
    assert.equal(parsed.answers.get('PR-Q06').answered, true, answer);
  }
  for (const answer of ['Cornwall', 'UK', 'England and Wales']) {
    const parsed = read(answer);
    assert.equal(parsed.problems.length, 1, answer);
    assert.match(parsed.problems[0].message, /England, Wales, Scotland, Northern Ireland or other/, answer);
    assert.equal(parsed.answers.get('PR-Q06').answered, false, answer);
    assert.equal(parsed.answers.get('PR-Q06').value, null, answer);
  }
  assert.match(messages(parse(fill(blank, 'PR-Q11', ...confirmed('sometimes')))), /yes or no/);
});

test('a profile with a method heading or a method question is a problem', () => {
  const blank = blankWorksheet('profile', data);
  assert.match(messages(parse(blank.replace('### PR-Q02\n', '## CK-06 Hot holding\n### PR-Q02\n'))), /CK-06/);
  assert.match(messages(parse(blank.replace('### PR-Q02\n', '### CK-06-Q01\n'))), /CK-06-Q01/);
});

// ---- Own entries ----

const OWN_ENTRY = [
  '## OWN-01 Milk for coffee', '', 'Kind: additional', 'Hazard: Milk going off once opened', 'Control: Date each carton when opened',
  'Limit: Use within three days of opening', 'Limit-source: Dairy supplier\'s label', 'Check: Opening checks', 'If-it-fails: Throw it away',
  'Supplied-text:', 'EH-review:', 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20'
];
const withEntry = (lines) => `${blankWorksheet('own', data)}\n${lines.join('\n')}\n`;

test('a blank own worksheet holds no entries, only a commented template the parser ignores', () => {
  const text = blankWorksheet('own', data);
  assert.match(text, /<!--[\s\S]*## OWN-01[\s\S]*Kind:[\s\S]*Limit-source:[\s\S]*EH-review:[\s\S]*-->/);
  assert.doesNotMatch(text.replace(/<!--[\s\S]*?-->/g, ''), /OWN-01|Kind:/);
  // The template's heading has a blank line after it, as an entry written from it must.
  assert.match(text, /\n## OWN-01 Name of the control\n\nKind:\n/);
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  assert.equal(parsed.entries.size, 0);
});

test('an own entry is read field by field, and keeps every field through emit', () => {
  const text = withEntry(OWN_ENTRY);
  const parsed = parse(text);
  assert.deepEqual(parsed.problems, []);
  const entry = parsed.entries.get('OWN-01');
  assert.equal(entry.title, 'Milk for coffee');
  assert.equal(entry.kind, 'additional');
  assert.equal(entry.limit, 'Use within three days of opening');
  assert.equal(entry.limitSource, 'Dairy supplier\'s label');
  assert.equal(entry.ifItFails, 'Throw it away');
  assert.equal(entry.answered, true);
  assert.equal(emitWorksheet(parsed, data), text);
});

test('own entries: a Limit needs a Limit-source, and Kind must be one of the two', () => {
  const noSource = withEntry(OWN_ENTRY.map((l) => (l.startsWith('Limit-source:') ? 'Limit-source:' : l)));
  const parsed = parse(noSource);
  assert.equal(parsed.problems.length, 1);
  assert.match(parsed.problems[0].message, /OWN-01.*Limit-source/);
  assert.equal(parsed.entries.get('OWN-01').answered, false);
  const kind = parse(withEntry(OWN_ENTRY.map((l) => (l.startsWith('Kind:') ? 'Kind: extra' : l))));
  assert.match(messages(kind), /additional or special-process/);
});

test('own entries: a special process needs its supplied text and an EH-review of pending or a dated outcome', () => {
  const special = (review, supplied = 'Supplied-text: Our written sous vide method') => withEntry([
    '## OWN-02 Sous vide eggs', '', 'Kind: special-process', 'Hazard:', 'Control:', 'Limit:', 'Limit-source:', 'Check:', 'If-it-fails:',
    supplied, `EH-review: ${review}`, 'State: confirmed', 'By: Sam Okafor', 'On: 2026-11-20']);
  assert.deepEqual(parse(special('pending')).problems, []);
  assert.equal(parse(special('Pending')).entries.get('OWN-02').ehReview, 'pending');
  assert.deepEqual(parse(special('2026-12-01 accepted by the council')).problems, []);
  assert.match(messages(parse(special(''))), /EH-review/);
  assert.match(messages(parse(special('next week'))), /EH-review/);
  assert.match(messages(parse(special('pending', 'Supplied-text:'))), /Supplied-text/);
});

test('own entries: identifiers are OWN- and two digits, once each, and an entry needs a title', () => {
  assert.match(messages(parse(withEntry(OWN_ENTRY.map((l, i) => (i === 0 ? '## OWN-1 Milk' : l))))), /OWN-1/);
  assert.match(messages(parse(withEntry([...OWN_ENTRY, '', ...OWN_ENTRY]))), /OWN-01.*more than once/);
  assert.match(messages(parse(withEntry(OWN_ENTRY.map((l, i) => (i === 0 ? '## OWN-01' : l))))), /title/);
  assert.match(messages(parse(withEntry(OWN_ENTRY.map((l, i) => (i === 0 ? '## OWN-01 Milk\n### OWN-01-Q01' : l))))), /OWN-01-Q01/);
});

test('own entries: an entry filled in but left unanswered is a problem', () => {
  const parsed = parse(withEntry(OWN_ENTRY.map((l) => (l.startsWith('State:') ? 'State: unanswered' : l))));
  assert.match(messages(parsed), /unanswered/);
  assert.equal(parsed.entries.get('OWN-01').answered, false);
});

// ---- Command line ----

test('worksheet --section prints the blank worksheet for each section', () => {
  for (const section of WORKSHEET_SECTIONS) {
    const result = run('worksheet', '--section', section);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, blankWorksheet(section, data), section);
  }
});

test('worksheet exits 2 on a usage error', () => {
  for (const args of [[], ['--section'], ['--section', 'XX'], ['--section', 'CK', '--bogus']]) {
    const result = run('worksheet', ...args);
    assert.equal(result.status, 2, args.join(' '));
    assert.match(result.stderr, /usage:/);
  }
  const empty = mkdtempSync(join(tmpdir(), 'uk-food-'));
  assert.equal(run('worksheet', '--section', 'CK', '--data', empty).status, 2);
  // Data that is valid but has no file for the section asked for.
  const partial = mkdtempSync(join(tmpdir(), 'uk-food-'));
  writeFileSync(join(partial, 'source.json'), readFileSync(join(DEFAULT_DATA_DIR, 'source.json')));
  const result = run('worksheet', '--section', 'XC', '--data', partial);
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /XC\.json/);
  assert.match(result.stderr, /usage:/);
  assert.equal(run('worksheet', '--section', 'own', '--data', partial).status, 0);
});

test('parse-worksheet exits 0 with no problems, 1 with problems and 2 on a usage error', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-'));
  const good = join(dir, 'answers-CK.md');
  writeFileSync(good, blankWorksheet('CK', data));
  const ok = run('parse-worksheet', '--file', good);
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, /no problems/);
  const badText = fill(blankWorksheet('CK', data), 'CK-06-Q01', 'Answer: yes', 'State: confirmed', 'By:', 'On: 2026-11-20', 'Source:');
  const bad = join(dir, 'answers-bad.md');
  writeFileSync(bad, badText);
  const failed = run('parse-worksheet', '--file', bad);
  assert.equal(failed.status, 1);
  assert.ok(failed.stdout.includes(`${bad}:${lineOf(badText, 'By:', '### CK-06-Q01')}: `), failed.stdout);
  assert.equal(run('parse-worksheet').status, 2);
  assert.equal(run('parse-worksheet', '--file', join(dir, 'absent.md')).status, 2);
  assert.equal(run('parse-worksheet', '--file', good, '--bogus').status, 2);
});

test('parse-worksheet --json prints the parsed worksheet', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-'));
  const file = join(dir, 'answers-CK.md');
  writeFileSync(file, fill(blankWorksheet('CK', data), 'CK-06-Q01', ...confirmed('yes')));
  const result = run('parse-worksheet', '--file', file, '--json');
  assert.equal(result.status, 0, result.stderr);
  const json = JSON.parse(result.stdout);
  assert.equal(json.section, 'CK');
  assert.equal(json.data, DATA_ID);
  assert.deepEqual(json.problems, []);
  assert.equal(json.methods['CK-06'].answers['CK-06-Q01'].value, 'yes');
  assert.equal(json.answers['CK-06-Q01'].answered, true);
});

// ---- The project-cafe fixture ----

const FIXTURE_SECTIONS = ['profile', ...SECTION_IDS, 'own'];

test('the cafe fixture: every worksheet parses with no problems and is in the helper\'s own layout', () => {
  for (const section of FIXTURE_SECTIONS) {
    const text = fixture(section);
    const parsed = parse(text);
    assert.deepEqual(parsed.problems, [], section);
    assert.equal(parsed.section, section);
    assert.equal(emitWorksheet(parsed, data), text, section);
  }
});

test('the cafe fixture: CK is fully confirmed, and CK-06 is not relevant with a reason and a decider', () => {
  const parsed = parse(fixture('CK'));
  for (const method of parsed.methods.values()) {
    if (method.id === 'CK-06') continue;
    assert.equal(method.status, 'applies', method.id);
    for (const answer of method.answers.values()) assert.equal(answer.answered, true, answer.id);
  }
  const hot = parsed.methods.get('CK-06');
  assert.equal(hot.status, 'not-relevant');
  assert.ok(hot.reason && hot.decidedBy);
  for (const answer of hot.answers.values()) {
    assert.equal(answer.answer, '', answer.id);
    assert.equal(answer.answered, false, answer.id);
  }
});

test('the cafe fixture: XC is about half answered, with exactly two proposed', () => {
  const answers = [...parse(fixture('XC')).answers.values()];
  const given = answers.filter((a) => a.state !== 'unanswered');
  assert.ok(given.length >= answers.length * 0.4 && given.length <= answers.length * 0.6, `${given.length} of ${answers.length}`);
  assert.equal(answers.filter((a) => a.state === 'proposed').length, 2);
  for (const answer of given) assert.equal(answer.answered, answer.state === 'confirmed', answer.id);
});

test('the cafe fixture: CL-04 is adapted with its variation, reason and proof', () => {
  const parsed = parse(fixture('CL'));
  const schedule = parsed.methods.get('CL-04');
  assert.equal(schedule.status, 'adapted');
  assert.ok(schedule.variation && schedule.reason && schedule.provedSafe);
  for (const method of parsed.methods.values()) if (method.id !== 'CL-04') assert.equal(method.status, 'applies');
});

test('the cafe fixture: the profile is confirmed, in England, with sous vide eggs its one special process', () => {
  const parsed = parse(fixture('profile'));
  for (const answer of parsed.answers.values()) assert.equal(answer.answered, true, answer.id);
  assert.equal(parsed.answers.get('PR-Q06').value, 'England');
  // Sous vide eggs are cooked at a low temperature, so the cafe answers yes to both.
  const extra = PROFILE_QUESTIONS.slice(10);
  const yes = extra.filter((q) => parsed.answers.get(q.id).value === 'yes').map((q) => q.text);
  assert.deepEqual(yes.map((text) => EXTRA_CARE.processes.find((name) => text.includes(`: ${name}?`))), ['sous vide', 'low temperature cooking']);
});

test('the cafe fixture: the cafe agrees with itself', () => {
  const profile = parse(fixture('profile'));
  const equipment = profile.answers.get('PR-Q09').value.join('\n');
  const sells = profile.answers.get('PR-Q08').value;
  const own = parse(fixture('own')).entries;
  // OWN-01 keeps opened milk in the drinks fridge; XC-02 washes cloths in a washing machine and dries salad in a spinner.
  assert.match(own.get('OWN-01').control, /drinks fridge/);
  for (const item of [/drinks fridge/i, /washing machine/i, /salad spinner/i, /sous vide/i, /meat slicer/i]) assert.match(equipment, item);
  // CK-04's potato and frying rows are answered no, which the profile explains.
  assert.match(sells, /no chips or other potato dishes/);
  assert.match(sells, /no deep fat fryer/);
});

test('the cafe fixture: two own entries, one additional with a sourced limit, one sous vide awaiting review', () => {
  const entries = [...parse(fixture('own')).entries.values()];
  assert.equal(entries.length, 2);
  const [additional, special] = entries;
  assert.equal(additional.kind, 'additional');
  assert.ok(additional.limit && additional.limitSource);
  assert.equal(special.kind, 'special-process');
  assert.match(special.title, /sous vide/i);
  assert.ok(special.suppliedText);
  assert.equal(special.ehReview, 'pending');
});
