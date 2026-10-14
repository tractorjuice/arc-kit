import { API_BASE } from './config.js';

const $ = (id) => document.getElementById(id);

function missing(title, text) {
  $('cred-loading').hidden = true;
  $('cred-missing-title').textContent = title;
  $('cred-missing-text').textContent = text;
  $('cred-missing').hidden = false;
}

async function load() {
  const id = new URLSearchParams(location.search).get('id') || '';
  if (!/^[a-z2-7]{12}$/.test(id)) return missing('No credential found', 'Check the link you were given.');
  try {
    const res = await fetch(`${API_BASE}/credentials/${id}`);
    const c = await res.json();
    if (res.status === 404) return missing('No credential found', c.error || 'No credential with that ID.');
    if (!res.ok) throw new Error();
    $('cred-loading').hidden = true;
    $('cred-status').textContent = c.valid ? 'Valid' : 'Not valid';
    $('cred-status').className = c.valid ? 'govuk-tag govuk-tag--green' : 'govuk-tag govuk-tag--red';
    $('cred-name').textContent = c.name;
    $('cred-achievement').textContent = c.achievementName;
    $('cred-issued').textContent = new Date(c.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    $('cred-id').textContent = c.id;
    $('cred-linkedin').href = c.linkedInUrl;
    $('cred-download').href = URL.createObjectURL(new Blob([c.jws], { type: 'application/jwt' }));
    if (!c.valid) { $('cred-linkedin').hidden = true; $('cred-download').hidden = true; }
    $('cred').hidden = false;
  } catch {
    missing('Couldn’t check the credential', 'Something went wrong. Try again later.');
  }
}

load();
