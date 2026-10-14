// Question bank helpers. The bank holds the answer key, so only
// publicQuestions() output may ever leave the Worker.

export function publicQuestions(bank) {
  return {
    level: bank.level,
    bankVersion: bank.bankVersion,
    passMark: bank.passMark,
    questions: bank.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
  };
}

// Rounded first so 0.7 * 40 (27.999...) doesn't become 28.000001 and round up to 29.
export function requiredScore(bank) {
  return Math.ceil(Number((bank.passMark * bank.questions.length).toFixed(6)));
}

// `answers` must already be validated (validateAnswers in validate.mjs).
export function mark(bank, answers) {
  const total = bank.questions.length;
  const score = bank.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const required = requiredScore(bank);
  return { score, total, required, passed: score >= required };
}
