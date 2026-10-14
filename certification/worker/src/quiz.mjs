// Question bank helpers. The bank holds the answer key and the explanations,
// so before marking only publicDraw() output may ever leave the Worker.
//
// Each attempt draws `drawPerDomain` questions from every domain and shuffles
// them. The drawn IDs travel in a signed draw token (drawsig.mjs); marking
// looks them up again in the bank.

const RANGE = 2 ** 32;

// An unbiased random integer in [0, n), from 32-bit crypto randomness.
// Values at or above the largest multiple of n are rejected and redrawn, so
// `% n` maps the rest evenly (no modulo bias). `fill` is injectable for tests.
export function randomInt(n, fill = (a) => crypto.getRandomValues(a)) {
  if (!Number.isInteger(n) || n < 1 || n > RANGE) throw new RangeError('randomInt needs 1 <= n <= 2^32');
  const limit = RANGE - (RANGE % n);
  const buf = new Uint32Array(1);
  for (;;) {
    fill(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}

// Fisher–Yates on a copy. `rand(n)` must return an unbiased integer in [0, n).
export function shuffle(items, rand = randomInt) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// True when every domain holds at least drawPerDomain questions, so a draw can
// be made. A bank in the old (v1) shape has no domains and is not drawable.
export function isDrawable(bank) {
  if (!bank || typeof bank !== 'object' || !bank.domains || typeof bank.domains !== 'object') return false;
  if (!Number.isInteger(bank.drawPerDomain) || bank.drawPerDomain < 1 || !Array.isArray(bank.questions)) return false;
  if (typeof bank.bankVersion !== 'string' || bank.bankVersion.length === 0) return false;
  // drawIds reads domain and id from every question, so each must be an object with a string id.
  if (!bank.questions.every((q) => q && typeof q === 'object' && !Array.isArray(q) && typeof q.id === 'string')) return false;
  const keys = Object.keys(bank.domains);
  if (keys.length === 0) return false;
  return keys.every((d) => bank.questions.filter((q) => q.domain === d).length >= bank.drawPerDomain);
}

// True when `questions` (from resolveDraw) is the shape drawIds makes: exactly
// drawPerDomain from each domain, nothing else. A signed token for a shorter or
// lopsided list (for example one easy question) is not an attempt.
export function isWholeDraw(bank, questions) {
  if (!Array.isArray(questions) || questions.length !== bank.drawPerDomain * Object.keys(bank.domains).length) return false;
  return Object.keys(bank.domains).every((d) => questions.filter((q) => q.domain === d).length === bank.drawPerDomain);
}

// drawPerDomain random questions from each domain, in random order. Returns IDs.
export function drawIds(bank, rand = randomInt) {
  const picked = [];
  for (const domain of Object.keys(bank.domains)) {
    const pool = bank.questions.filter((q) => q.domain === domain);
    if (pool.length < bank.drawPerDomain) throw new Error(`Domain ${domain} has too few questions to draw`);
    picked.push(...shuffle(pool, rand).slice(0, bank.drawPerDomain).map((q) => q.id));
  }
  return shuffle(picked, rand);
}

// Rounded first so 0.7 * 40 (27.999...) doesn't become 28.000001 and round up to 29.
export function requiredScore(passMark, total) {
  return Math.ceil(Number((passMark * total).toFixed(6)));
}

// The bank's questions for `ids`, in that order, or null if any ID is unknown
// or repeated.
export function resolveDraw(bank, ids) {
  if (!Array.isArray(ids) || ids.length === 0 || new Set(ids).size !== ids.length) return null;
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const questions = ids.map((id) => byId.get(id));
  return questions.every(Boolean) ? questions : null;
}

// What the browser sees for a draw: no answer, no explanation.
export function publicDraw(bank, ids) {
  const questions = resolveDraw(bank, ids);
  if (!questions) throw new Error('Draw names a question the bank does not hold');
  return {
    level: bank.level,
    bankVersion: bank.bankVersion,
    total: questions.length,
    required: requiredScore(bank.passMark, questions.length),
    questions: questions.map(({ id, domain, prompt, options }) => ({
      id, domain, domainName: bank.domains[domain], prompt, options: [...options],
    })),
  };
}

// `answers` must already be validated against the drawn questions
// (validateAnswers in validate.mjs). `areasToRevisit` lists each domain with a
// wrong answer once, in the bank's domain order. The caller decides which of
// `areasToRevisit` and `review` to send.
export function mark(bank, ids, answers) {
  const questions = resolveDraw(bank, ids);
  if (!questions) throw new Error('Draw names a question the bank does not hold');
  const total = questions.length;
  const review = questions.map((q, i) => ({
    id: q.id,
    prompt: q.prompt,
    yourAnswer: q.options[answers[i]],
    correctAnswer: q.options[q.answer],
    correct: answers[i] === q.answer,
    explanation: q.explanation,
  }));
  const score = review.filter((r) => r.correct).length;
  const missed = new Set(questions.filter((q, i) => answers[i] !== q.answer).map((q) => q.domain));
  const areasToRevisit = Object.keys(bank.domains).filter((d) => missed.has(d)).map((d) => bank.domains[d]);
  const required = requiredScore(bank.passMark, total);
  return { score, total, required, passed: score >= required, areasToRevisit, review };
}
