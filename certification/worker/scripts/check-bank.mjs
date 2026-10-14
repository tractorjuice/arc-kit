import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function checkBank(bank) {
  const problems = [];
  if (bank.level !== 'awareness') problems.push('level must be "awareness"');
  if (typeof bank.bankVersion !== 'string' || !bank.bankVersion) problems.push('bankVersion must be a non-empty string');
  if (bank.passMark !== 0.8) problems.push('passMark must be 0.8 for Awareness');
  if (!Array.isArray(bank.questions) || bank.questions.length !== 10) problems.push('Awareness needs exactly 10 questions');
  const ids = new Set();
  (bank.questions || []).forEach((q, i) => {
    const at = `question ${i + 1}`;
    if (ids.has(q.id)) problems.push(`${at}: duplicate id ${q.id}`);
    ids.add(q.id);
    if (typeof q.prompt !== 'string' || q.prompt.length < 10) problems.push(`${at}: prompt too short`);
    if (!Array.isArray(q.options) || q.options.length < 3) problems.push(`${at}: needs at least 3 options`);
    else if (new Set(q.options).size !== q.options.length) problems.push(`${at}: duplicate option`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) problems.push(`${at}: answer out of range`);
  });
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkBank(JSON.parse(readFileSync(process.argv[2], 'utf8')));
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  console.log('Bank OK');
}
