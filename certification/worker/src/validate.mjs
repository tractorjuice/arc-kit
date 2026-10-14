export const NAME_MAX = 100;

// The name appears on a public credential page, so links and angle
// brackets are refused outright. Pages still render it as text only.
export function validateName(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'Enter your name.' };
  const value = raw
    .normalize('NFC')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (value.length < 2) return { ok: false, error: 'Enter your full name as you want it on the credential.' };
  if (value.length > NAME_MAX) return { ok: false, error: `Keep your name to ${NAME_MAX} characters or fewer.` };
  if (/[<>]|https?:|www\./i.test(value)) {
    return { ok: false, error: 'Your name can’t contain links or the characters < and >.' };
  }
  return { ok: true, value };
}

export function validateAnswers(raw, bank) {
  const n = bank.questions.length;
  if (!Array.isArray(raw) || raw.length !== n) return { ok: false, error: `Answer all ${n} questions.` };
  for (let i = 0; i < n; i++) {
    const a = raw[i];
    if (!Number.isInteger(a) || a < 0 || a >= bank.questions[i].options.length) {
      return { ok: false, error: `Answer question ${i + 1}.` };
    }
  }
  return { ok: true, value: raw };
}
