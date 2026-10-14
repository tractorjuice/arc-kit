import { API_BASE } from './config.js';

const $ = (id) => document.getElementById(id);
let bank;

class QuizError extends Error {}

const httpsOnly = (url) => (typeof url === 'string' && url.startsWith('https://') ? url : '#');

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
  bank.questions.forEach((q, i) => {
    const group = el('div', { class: 'govuk-form-group' });
    const fs = el('fieldset', { class: 'govuk-fieldset' });
    const legend = el('legend', { class: 'govuk-fieldset__legend govuk-fieldset__legend--s' }, `${i + 1}. ${q.prompt}`);
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

async function load() {
  try {
    const res = await fetch(`${API_BASE}/awareness/questions`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(data.questions)) throw new QuizError(data.error || 'The quiz isn’t available right now. Try again later.');
    bank = data;
    renderQuestions();
    $('quiz-loading').hidden = true;
    $('quiz').hidden = false;
  } catch (e) {
    $('quiz-loading').hidden = true;
    showError(e instanceof QuizError ? e.message : 'The quiz isn’t available right now. Try again later.');
  }
}

function collectAnswers() {
  return bank.questions.map((_, i) => {
    const picked = document.querySelector(`input[name="q${i}"]:checked`);
    return picked ? Number(picked.value) : null;
  });
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
      body: JSON.stringify({ name, answers, bankVersion: bank.bankVersion }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) return showError(out.error || 'Something went wrong. Try again.');
    $('quiz').hidden = true;
    $('result').hidden = false;
    if (out.passed) {
      $('pass-score').textContent = `You scored ${out.score} out of ${out.total}.`;
      $('linkedin-link').href = httpsOnly(out.linkedInUrl);
      $('credential-link').href = httpsOnly(out.credentialUrl);
      $('pass-panel').hidden = false;
      $('pass-links').hidden = false;
    } else {
      $('fail-score').textContent = `You scored ${out.score} out of ${out.total}. You need ${out.required} to pass.`;
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
  $('result').hidden = true;
  $('fail-box').hidden = true;
  $('pass-panel').hidden = true;
  $('pass-links').hidden = true;
  document.querySelectorAll('#questions input:checked').forEach((r) => { r.checked = false; });
  $('quiz').hidden = false;
  window.scrollTo(0, 0);
});
load();
