#!/usr/bin/env node
// Item-quality lint for a private certification question bank.
// check-bank.mjs (in certification/worker/scripts/) checks structure; this checks how the
// questions are written. Output names item IDs and rules only, never question text, so it is
// safe to paste into a PR or chat.
//
//   node .claude/skills/certification-questions/scripts/lint-bank.mjs certification/private/awareness.json
//
// Exit 1 when any error is found. Warnings are for a reviewer to judge.
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node lint-bank.mjs <bank.json>');
  process.exit(2);
}

let bank;
try {
  bank = JSON.parse(readFileSync(path, 'utf8'));
} catch (e) {
  console.error(`Cannot read the bank (${e.name}).`);
  process.exit(2);
}

const qs = Array.isArray(bank.questions) ? bank.questions : [];
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const errors = [];
const warnings = [];
const err = (id, rule) => errors.push(`${id}: ${rule}`);
const warn = (id, rule) => warnings.push(`${id}: ${rule}`);

const BANNED_OPTIONS = /\b(all|none) of the above\b|\bboth (a|b) and\b/i;
const NEGATIVE_STEM = /\b(not|except|never|least)\b/i;
const VERSIONISH = /\bv?\d+\.\d+(\.\d+)?\b|\b\d{2,}\b/;
const PATHISH = /(^|\s)[\w.-]+\/[\w./-]+/;

const prompts = new Map();
for (const q of qs) {
  const id = q.id ?? '(no id)';
  const opts = Array.isArray(q.options) ? q.options.map(String) : [];
  const key = opts[q.answer];
  if (key === undefined) { err(id, 'answer does not point at an option'); continue; }

  const p = norm(q.prompt);
  if (prompts.has(p)) err(id, `duplicate prompt of ${prompts.get(p)}`);
  prompts.set(p, id);

  if (String(q.prompt).length > 200) err(id, 'prompt over 200 characters');
  if (opts.some((o) => o.length > 160)) err(id, 'option over 160 characters');
  if (opts.some((o) => BANNED_OPTIONS.test(o))) err(id, '"all/none of the above" style option');
  if (NEGATIVE_STEM.test(q.prompt)) warn(id, 'negative word in the stem (not/except/never/least)');

  const lens = opts.map((o) => o.length);
  const longest = Math.max(...lens);
  if (key.length === longest) err(id, 'the correct option is (or ties for) the longest');
  if (longest / Math.max(1, Math.min(...lens)) > 1.25) warn(id, 'option lengths vary by more than 1.25x');

  if ([q.prompt, ...opts].some((t) => VERSIONISH.test(t))) warn(id, 'number that may be a version or count (trivia, or goes stale)');
  if ([q.prompt, ...opts].some((t) => PATHISH.test(t))) warn(id, 'file path in the item (goes stale)');

  const expl = String(q.explanation ?? '');
  if (!expl) err(id, 'no explanation');
  else {
    if (expl.length > 300) err(id, 'explanation over 300 characters');
    const sentences = expl.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    if (sentences > 2) warn(id, 'explanation longer than two sentences');
    if (norm(expl) === norm(key) || norm(expl).startsWith(norm(key))) warn(id, 'explanation restates the option instead of explaining');
  }
}

// One item must not give away another: a correct option that appears inside another item's
// prompt or options. Draws take several items per domain, so leaks matter within a paper.
for (const q of qs) {
  const key = norm(q.options?.[q.answer]);
  if (key.split(' ').length < 4) continue;
  for (const other of qs) {
    if (other === q) continue;
    const hay = norm([other.prompt, ...(other.options ?? [])].join(' '));
    if (hay.includes(key)) err(q.id, `correct option appears in ${other.id}`);
  }
}

// Answer positions: spread overall, and at least three positions used in each domain.
const pos = [0, 0, 0, 0];
const byDomain = {};
for (const q of qs) {
  pos[q.answer] = (pos[q.answer] ?? 0) + 1;
  (byDomain[q.domain ?? '(none)'] ??= new Set()).add(q.answer);
}
const maxShare = qs.length ? Math.max(...pos) / qs.length : 0;
if (maxShare > 0.35) warnings.push(`bank: one answer position holds ${Math.round(maxShare * 100)}% of keys`);
for (const [d, set] of Object.entries(byDomain)) {
  if (byDomain[d] && qs.filter((q) => (q.domain ?? '(none)') === d).length >= 4 && set.size < 3) {
    warnings.push(`bank: domain ${d} uses only ${set.size} answer position(s)`);
  }
}

console.log(`Items: ${qs.length}. Answer positions: ${pos.map((n, i) => `${i}=${n}`).join(', ')}.`);
console.log(`Errors: ${errors.length}. Warnings: ${warnings.length}.`);
for (const e of errors) console.log(`ERROR  ${e}`);
for (const w of warnings) console.log(`WARN   ${w}`);
process.exit(errors.length ? 1 : 0);
