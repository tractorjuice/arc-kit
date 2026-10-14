export const NAME_MAX = 100;

// The name appears on a public credential page, so links and angle
// brackets are refused outright. Pages still render it as text only.
export function validateName(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'Enter your name.' };
  const value = raw
    .normalize('NFC')
    .replace(/\s+/g, ' ') // \n and \t become spaces before control characters are stripped
    .replace(/[\u0000-\u001F\u007F]/g, '')
    // Invisible format and bidi controls. U+200C ZWNJ and U+200D ZWJ stay:
    // Persian and Indic names need them.
    .replace(/[\u061C\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (value.length < 2) return { ok: false, error: 'Enter your full name as you want it on the credential.' };
  if (value.length > NAME_MAX) return { ok: false, error: `Keep your name to ${NAME_MAX} characters or fewer.` };
  if (/[<>]|https?:|www\./i.test(value)) {
    return { ok: false, error: 'Your name can’t contain links or the characters < and >.' };
  }
  return { ok: true, value };
}

// `questions` are the drawn questions, in the order the answers come in.
export function validateAnswers(raw, questions) {
  const n = questions.length;
  if (!Array.isArray(raw) || raw.length !== n) return { ok: false, error: `Answer all ${n} questions.` };
  for (let i = 0; i < n; i++) {
    const a = raw[i];
    if (!Number.isInteger(a) || a < 0 || a >= questions[i].options.length) {
      return { ok: false, error: `Answer question ${i + 1}.` };
    }
  }
  return { ok: true, value: raw };
}
