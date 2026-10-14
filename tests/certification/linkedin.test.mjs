import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linkedInAddUrl, LINKEDIN_ORG_ID } from '../../certification/worker/src/linkedin.mjs';

test('builds a pre-filled LinkedIn certification link for the ArcKit page', () => {
  const url = new URL(linkedInAddUrl({
    certName: 'ArcKit Awareness (ArcKit 6)',
    issuedAt: '2026-10-26T10:00:00.000Z',
    certUrl: 'https://arckit.org/certification/credential.html?id=abcdefghjkmn',
    certId: 'abcdefghjkmn',
  }));
  assert.equal(url.origin + url.pathname, 'https://www.linkedin.com/profile/add');
  assert.equal(url.searchParams.get('startTask'), 'CERTIFICATION_NAME');
  assert.equal(url.searchParams.get('name'), 'ArcKit Awareness (ArcKit 6)');
  assert.equal(url.searchParams.get('organizationId'), '146637218');
  assert.equal(LINKEDIN_ORG_ID, '146637218');
  assert.equal(url.searchParams.get('issueYear'), '2026');
  assert.equal(url.searchParams.get('issueMonth'), '10');
  assert.equal(url.searchParams.get('certUrl'), 'https://arckit.org/certification/credential.html?id=abcdefghjkmn');
  assert.equal(url.searchParams.get('certId'), 'abcdefghjkmn');
});

test('uses the UTC month, so a late-night pass is not shifted', () => {
  const url = new URL(linkedInAddUrl({ certName: 'x', issuedAt: '2026-10-31T23:59:59.000Z', certUrl: 'https://arckit.org', certId: 'a' }));
  assert.equal(url.searchParams.get('issueMonth'), '10');
});
