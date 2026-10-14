// Checks an Awareness bank (v2 schema) before upload:
//   node scripts/check-bank.mjs ../private/awareness.v2.json
// Prints "Bank OK", or each problem on its own line and exits 1.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const DOMAINS = ['basics', 'people', 'templates', 'evidence', 'traceability'];
export const PER_DOMAIN = 6;
export const DRAW_PER_DOMAIN = 2;
export const OPTIONS = 4;
export const PROMPT_MIN = 10;
export const PROMPT_MAX = 200;
export const OPTION_MAX = 160;
export const EXPLANATION_MAX = 300;
export const MIN_PER_POSITION = 4;

const isObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

function checkQuestion(q, at, problems) {
  if (!isObject(q)) { problems.push(`${at}: must be an object`); return; }
  if (!nonEmpty(q.id)) problems.push(`${at}: id must be a non-empty string`);
  if (!DOMAINS.includes(q.domain)) problems.push(`${at}: domain must be one of ${DOMAINS.join(', ')}`);
  if (typeof q.prompt !== 'string' || q.prompt.trim().length < PROMPT_MIN) problems.push(`${at}: prompt too short`);
  else if (q.prompt.length > PROMPT_MAX) problems.push(`${at}: prompt longer than ${PROMPT_MAX} characters`);
  if (!Array.isArray(q.options) || q.options.length !== OPTIONS) {
    problems.push(`${at}: needs exactly ${OPTIONS} options`);
  } else {
    q.options.forEach((o, j) => {
      if (!nonEmpty(o)) problems.push(`${at}: option ${j + 1} must be a non-empty string`);
      else if (o.length > OPTION_MAX) problems.push(`${at}: option ${j + 1} longer than ${OPTION_MAX} characters`);
    });
    if (new Set(q.options).size !== q.options.length) problems.push(`${at}: duplicate option`);
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= OPTIONS) problems.push(`${at}: answer out of range (0–${OPTIONS - 1})`);
  if (!nonEmpty(q.explanation)) problems.push(`${at}: explanation missing`);
  else if (q.explanation.length > EXPLANATION_MAX) problems.push(`${at}: explanation longer than ${EXPLANATION_MAX} characters`);
}

export function checkBank(bank) {
  if (!isObject(bank)) return ['bank must be a JSON object'];
  const problems = [];
  if (bank.level !== 'awareness') problems.push('level must be "awareness"');
  if (!nonEmpty(bank.bankVersion)) problems.push('bankVersion must be a non-empty string');
  if (bank.passMark !== 0.8) problems.push('passMark must be 0.8 for Awareness');
  if (bank.drawPerDomain !== DRAW_PER_DOMAIN) problems.push(`drawPerDomain must be ${DRAW_PER_DOMAIN}`);

  if (!isObject(bank.domains)) {
    problems.push(`domains must be an object with the keys ${DOMAINS.join(', ')}`);
  } else {
    const keys = Object.keys(bank.domains);
    const missing = DOMAINS.filter((d) => !keys.includes(d));
    const extra = keys.filter((d) => !DOMAINS.includes(d));
    if (missing.length) problems.push(`domains missing: ${missing.join(', ')}`);
    if (extra.length) problems.push(`domains not allowed: ${extra.join(', ')}`);
    for (const d of DOMAINS) {
      if (keys.includes(d) && !nonEmpty(bank.domains[d])) problems.push(`domain ${d} needs a name`);
    }
  }

  const total = DOMAINS.length * PER_DOMAIN;
  if (!Array.isArray(bank.questions)) {
    problems.push(`Awareness needs exactly ${total} questions`);
    return problems;
  }
  if (bank.questions.length !== total) problems.push(`Awareness needs exactly ${total} questions, not ${bank.questions.length}`);

  const ids = new Set();
  bank.questions.forEach((q, i) => {
    const at = `question ${i + 1}`;
    checkQuestion(q, at, problems);
    if (isObject(q) && nonEmpty(q.id)) {
      if (ids.has(q.id)) problems.push(`${at}: duplicate id ${q.id}`);
      ids.add(q.id);
    }
  });
  for (const d of DOMAINS) {
    const n = bank.questions.filter((q) => isObject(q) && q.domain === d).length;
    if (n !== PER_DOMAIN) problems.push(`domain ${d} needs exactly ${PER_DOMAIN} questions, not ${n}`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node scripts/check-bank.mjs <bank.json>');
    process.exit(1);
  }
  let bank;
  try {
    bank = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    // Only the error type: a JSON.parse message quotes the file, which holds the answer key.
    console.error(`Can't read ${path} as JSON (${e instanceof SyntaxError ? 'SyntaxError' : e.code || 'error'}).`);
    process.exit(1);
  }
  const problems = checkBank(bank);
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  // Not a failure: a lopsided answer key is a tell, so say so.
  const counts = Array.from({ length: OPTIONS }, (_, i) => bank.questions.filter((q) => q.answer === i).length);
  const thin = counts.map((n, i) => ({ n, i })).filter(({ n }) => n < MIN_PER_POSITION);
  for (const { n, i } of thin) {
    console.log(`Warning: answer position ${String.fromCharCode(65 + i)} holds only ${n} of ${bank.questions.length} answers (spread: ${counts.join(', ')}).`);
  }
  console.log('Bank OK');
}
