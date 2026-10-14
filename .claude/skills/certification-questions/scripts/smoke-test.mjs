#!/usr/bin/env node
// Smoke test after uploading a bank: the live Worker serves the expected bankVersion and
// nothing that marks or explains an answer. Prints no question text.
//
//   node .claude/skills/certification-questions/scripts/smoke-test.mjs awareness aw-2026-10-2
const [level, expected] = process.argv.slice(2);
if (!level || !expected) {
  console.error('Usage: node smoke-test.mjs <level> <expected bankVersion>');
  process.exit(2);
}

const base = process.env.CERT_API_BASE ?? 'https://certification-api.arckit.org';
const res = await fetch(`${base}/${level}/questions`, { headers: { Origin: 'https://arckit.org' } });
const text = await res.text();
const problems = [];
if (!res.ok) problems.push(`HTTP ${res.status}`);

let body = {};
try { body = JSON.parse(text); } catch { problems.push('response is not JSON'); }
if (body.bankVersion !== expected) problems.push(`bankVersion is ${body.bankVersion ?? '(missing)'}, expected ${expected}`);
if (/"(answer|explanation|correctAnswer)"\s*:/.test(text)) problems.push('response contains answer or explanation keys');
if (!Array.isArray(body.questions) || body.questions.length === 0) problems.push('no questions served');
if (res.headers.get('access-control-allow-origin') !== 'https://arckit.org') problems.push('CORS does not allow https://arckit.org');

if (problems.length) {
  for (const p of problems) console.log(`FAIL  ${p}`);
  process.exit(1);
}
console.log(`OK  ${level} serves ${body.questions.length} questions at ${body.bankVersion}, no answers, CORS ok`);
