import { API_BASE } from './config.js';

const $ = (id) => document.getElementById(id);
// The current attempt: the drawn questions (no answers) and the signed draw
// token, which goes back with the answers so the Worker knows what it asked.
let draw;

class QuizError extends Error {}

const UNAVAILABLE = 'The quiz isn’t available right now. Try again later.';
const httpsOnly = (url) => (typeof url === 'string' && url.startsWith('https://') ? url : '#');
const asText = (v) => (typeof v === 'string' ? v : '');

function showError(message) {
  $('quiz-error-text').textContent = message;
  $('quiz-error').hidden = false;
  $('quiz-error').focus();
}

function el(tag, attrs = {}, text) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderQuestions() {
  const box = $('questions');
  box.replaceChildren();
  const total = Number.isInteger(draw.total) ? draw.total : draw.questions.length;
  draw.questions.forEach((q, i) => {
    const group = el('div', { class: 'govuk-form-group app-cert-card app-cert-question' });
    const fs = el('fieldset', { class: 'govuk-fieldset' });
    const legend = el('legend', { class: 'govuk-fieldset__legend govuk-fieldset__legend--s' });
    legend.append(el('span', { class: 'app-cert-qnum' }, `Question ${i + 1} of ${total}`), q.prompt);
    const radios = el('div', { class: 'govuk-radios', 'data-module': 'govuk-radios' });
    q.options.forEach((opt, j) => {
      const id = `q${i}-o${j}`;
      const item = el('div', { class: 'govuk-radios__item' });
      const input = el('input', { class: 'govuk-radios__input', id, name: `q${i}`, type: 'radio', value: String(j) });
      const label = el('label', { class: 'govuk-label govuk-radios__label', for: id }, opt);
      item.append(input, label);
      radios.append(item);
    });
    fs.append(legend, radios);
    group.append(fs);
    box.append(group);
  });
}

// Each attempt is a fresh draw from the Worker, so "Try again" calls this too.
async function load() {
  $('quiz-error').hidden = true;
  $('quiz').hidden = true;
  $('quiz-loading').hidden = false;
  try {
    const res = await fetch(`${API_BASE}/awareness/questions`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(data.questions)) throw new QuizError(data.error || UNAVAILABLE);
    draw = data;
    renderQuestions();
    $('quiz-loading').hidden = true;
    $('quiz').hidden = false;
  } catch (e) {
    $('quiz-loading').hidden = true;
    showError(e instanceof QuizError ? e.message : UNAVAILABLE);
  }
}

function collectAnswers() {
  return draw.questions.map((_, i) => {
    const picked = document.querySelector(`input[name="q${i}"]:checked`);
    return picked ? Number(picked.value) : null;
  });
}

// After a pass: every question with the answer given, the right answer and
// why. Text only, through textContent and text nodes.
function renderReview(review) {
  const list = $('review-list');
  list.replaceChildren();
  if (!Array.isArray(review) || review.length === 0) return;
  for (const r of review) {
    const ok = r.correct === true;
    const item = el('li', { class: `app-cert-review__item app-cert-review__item--${ok ? 'correct' : 'wrong'}` });
    const prompt = el('p', { class: 'govuk-body app-cert-review__prompt' });
    prompt.append(
      el('span', { class: 'app-cert-review__mark', 'aria-hidden': 'true' }, ok ? '✓' : '✗'),
      el('span', { class: 'govuk-visually-hidden' }, ok ? 'Correct. ' : 'Incorrect. '),
      document.createTextNode(asText(r.prompt)),
    );
    const answers = el('dl', { class: 'govuk-body app-cert-review__answers' });
    answers.append(
      el('dt', {}, 'Your answer'), el('dd', {}, asText(r.yourAnswer)),
      el('dt', {}, 'Correct answer'), el('dd', {}, asText(r.correctAnswer)),
    );
    const why = el('p', { class: 'govuk-body app-cert-review__why' }, asText(r.explanation));
    item.append(prompt, answers, why);
    list.append(item);
  }
  $('review-box').hidden = false;
}

// After a fail: the domains with a wrong answer, never the questions.
function renderAreas(areas) {
  const list = $('areas-list');
  const names = Array.isArray(areas) ? areas.filter((a) => typeof a === 'string' && a) : [];
  list.replaceChildren(...names.map((name) => el('li', {}, name)));
  $('areas-box').hidden = names.length === 0;
}

function clearResult() {
  for (const id of ['result', 'pass-panel', 'pass-links', 'review-box', 'fail-box', 'areas-box']) $(id).hidden = true;
  $('review-list').replaceChildren();
  $('areas-list').replaceChildren();
}

async function onSubmit(ev) {
  ev.preventDefault();
  $('quiz-error').hidden = true;
  const name = $('name').value.trim();
  if (name.length < 2) return showError('Enter your full name as you want it on the credential.');
  const answers = collectAnswers();
  const missing = answers.indexOf(null);
  if (missing !== -1) return showError(`Answer question ${missing + 1}.`);
  $('submit').disabled = true;
  try {
    const res = await fetch(`${API_BASE}/awareness/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, answers, bankVersion: draw.bankVersion, drawToken: draw.drawToken }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) return showError(out.error || 'Something went wrong. Try again.');
    clearResult();
    $('quiz').hidden = true;
    $('result').hidden = false;
    if (out.passed) {
      $('pass-score').textContent = `You scored ${out.score} out of ${out.total}.`;
      $('linkedin-link').href = httpsOnly(out.linkedInUrl);
      $('credential-link').href = httpsOnly(out.credentialUrl);
      $('pass-panel').hidden = false;
      $('pass-links').hidden = false;
      renderReview(out.review);
    } else {
      $('fail-score').textContent = `You need ${out.required} out of ${out.total} to pass. Each attempt draws a fresh set of questions.`;
      renderAreas(out.areasToRevisit);
      $('fail-box').hidden = false;
    }
  } catch {
    showError('Something went wrong. Check your connection and try again.');
  } finally {
    $('submit').disabled = false;
  }
}

$('quiz').addEventListener('submit', onSubmit);
$('retry').addEventListener('click', () => {
  clearResult();
  window.scrollTo(0, 0);
  load();
});
load();
