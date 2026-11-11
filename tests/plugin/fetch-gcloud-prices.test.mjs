import assert from 'node:assert/strict';
import {
  existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, utimesSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  ASSET_HOST, LISTING_BASE, MAX_DOCUMENT_BYTES, MAX_IDS, STALE_AFTER_MS, findPricingDocument, isServiceId, run,
} from '../../plugins/arckit-claude/scripts/fetch-gcloud-prices.mjs';

const ID = '849857478096097';
const PDF_URL = `https://${ASSET_HOST}/g-cloud-15/documents/708928/${ID}-pricing-document-2026-01-27-1611.pdf`;
const LISTING = `<a href="https://${ASSET_HOST}/g-cloud-15/documents/708928/${ID}-terms-and-conditions.pdf">Terms</a><a href="${PDF_URL}">Pricing</a>`;
const PDF = Buffer.from('%PDF-1.7 SUPPLIER WROTE THIS');
const OUT = '.arckit/cache/gcloud-prices';

function fakeFetch(routes) {
  const calls = [];
  const impl = async (url, options) => {
    calls.push({ url, options });
    const route = routes[url];
    if (!route) return new Response('missing', { status: 404 });
    return typeof route === 'function' ? route() : new Response(route);
  };
  return { impl, calls };
}

describe('fetch-gcloud-prices', () => {
  let cwd;
  beforeEach(() => { cwd = realpathSync(mkdtempSync(join(tmpdir(), 'gcloud-prices-'))); });
  afterEach(() => { rmSync(cwd, { recursive: true, force: true }); });

  it('accepts only numeric service IDs, so reader text cannot reach a shell or URL', () => {
    assert.ok(isServiceId(ID));
    for (const bad of ['https://example.com/1', '123;rm -rf ~', '$(whoami)', '12345', '../123456', '']) {
      assert.equal(isServiceId(bad), false, bad);
    }
  });

  it('finds this service\'s pricing document and nothing else', () => {
    assert.equal(findPricingDocument(LISTING, ID), PDF_URL);
    assert.equal(findPricingDocument(`<a href="https://evil.example/${ID}-pricing-document.pdf">x</a>`, ID), null);
    assert.equal(findPricingDocument(`<a href="http://${ASSET_HOST}/${ID}-pricing-document.pdf">x</a>`, ID), null);
    assert.equal(findPricingDocument(`<a href="https://${ASSET_HOST}/999999-pricing-document.pdf">x</a>`, ID), null);
    assert.equal(findPricingDocument(`<a href="https://${ASSET_HOST}.evil.example/${ID}-pricing-document.pdf">x</a>`, ID), null);
  });

  it('saves the document, ignores the folder in git, and prints no document content', async () => {
    const { impl, calls } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: () => new Response(PDF) });
    const { code, output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(code, 0);
    assert.deepEqual(output.results, [{ service_id: ID, status: 'ok', pdf_url: PDF_URL, file: `${OUT}/${ID}.pdf`, bytes: PDF.length }]);
    assert.deepEqual(readFileSync(join(cwd, OUT, `${ID}.pdf`)), PDF);
    assert.equal(readFileSync(join(cwd, OUT, '.gitignore'), 'utf8'), '*\n');
    assert.ok(!JSON.stringify(output).includes('SUPPLIER WROTE THIS'));
    assert.ok(calls.every((call) => call.options.redirect === 'error'));
  });

  it('reports a listing with no pricing document', async () => {
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: '<p>none</p>' });
    const { output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.deepEqual(output.results, [{ service_id: ID, status: 'no-document' }]);
  });

  it('refuses a file that is not a PDF, and saves nothing', async () => {
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: '<html>login</html>' });
    const { output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(output.results[0].reason, 'not a PDF');
    assert.equal(existsSync(join(cwd, OUT, `${ID}.pdf`)), false);
  });

  it('refuses an oversized document', async () => {
    const big = () => new Response(Buffer.alloc(16), { headers: { 'content-length': String(MAX_DOCUMENT_BYTES + 1) } });
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: big });
    const { output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(output.results[0].reason, 'too large');
  });

  it('never prints the text of a network error', async () => {
    const impl = async () => { throw new Error('supplier-controlled message'); };
    const { code, output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(code, 0);
    assert.deepEqual(output.results, [{ service_id: ID, status: 'failed', reason: 'network error' }]);
  });

  it('reports each service separately', async () => {
    const other = '192802101890655';
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: () => new Response(PDF) });
    const { output } = await run(['--out', OUT, ID, other], { fetchImpl: impl, cwd });
    assert.deepEqual(output.results.map((r) => r.status), ['ok', 'failed']);
    assert.equal(output.results[1].reason, 'HTTP 404');
  });

  const age = (path, ms) => {
    const then = new Date(Date.now() - ms);
    utimesSync(path, then, then);
  };

  it('keeps downloads from earlier calls, even days old, which a reader may not have opened yet', async () => {
    mkdirSync(join(cwd, OUT), { recursive: true });
    const earlier = join(cwd, OUT, '111111.pdf');
    writeFileSync(earlier, 'earlier call');
    age(earlier, 3 * 24 * 60 * 60 * 1000);
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: '<p>none</p>' });
    await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.ok(existsSync(earlier));
  });

  it('clears only its own stale downloads, never other files in the folder', async () => {
    mkdirSync(join(cwd, OUT), { recursive: true });
    const stale = join(cwd, OUT, '222222.pdf');
    const others = ['keep.txt', 'report.pdf', 'notes-123.pdf'].map((name) => join(cwd, OUT, name));
    for (const path of [stale, ...others]) {
      writeFileSync(path, 'old');
      age(path, STALE_AFTER_MS + 60_000);
    }
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: '<p>none</p>' });
    await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(existsSync(stale), false);
    for (const path of others) assert.ok(existsSync(path), path);
  });

  it('never leaves an old document behind when a service has none or its fetch fails', async () => {
    const file = join(cwd, OUT, `${ID}.pdf`);
    const cases = [
      [{ [LISTING_BASE + ID]: '<p>none</p>' }, 'no-document'],
      [{ [LISTING_BASE + ID]: LISTING, [PDF_URL]: '<html>login</html>' }, 'failed'],
      [{}, 'failed'],
    ];
    for (const [routes, status] of cases) {
      mkdirSync(join(cwd, OUT), { recursive: true });
      writeFileSync(file, '%PDF-out of date');
      const { output } = await run(['--out', OUT, ID], { fetchImpl: fakeFetch(routes).impl, cwd });
      assert.equal(output.results[0].status, status);
      assert.equal(existsSync(file), false, status);
    }
  });

  it('replaces a link at the document path instead of writing through it', async () => {
    mkdirSync(join(cwd, OUT), { recursive: true });
    const outside = join(cwd, 'outside.txt');
    writeFileSync(outside, 'untouched');
    symlinkSync(outside, join(cwd, OUT, `${ID}.pdf`));
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: () => new Response(PDF) });
    const { output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(output.results[0].status, 'ok');
    assert.equal(readFileSync(outside, 'utf8'), 'untouched');
    assert.equal(lstatSync(join(cwd, OUT, `${ID}.pdf`)).isSymbolicLink(), false);
  });

  it('still returns results when the folder holds a broken link or a folder named like a download', async () => {
    mkdirSync(join(cwd, OUT, '333333.pdf'), { recursive: true });
    symlinkSync(join(cwd, 'missing'), join(cwd, OUT, '444444.pdf'));
    age(join(cwd, OUT, '333333.pdf'), STALE_AFTER_MS + 60_000);
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: '<p>none</p>' });
    const { code, output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(code, 0);
    assert.deepEqual(output.results, [{ service_id: ID, status: 'no-document' }]);
    assert.ok(existsSync(join(cwd, OUT, '333333.pdf')));
  });

  it('reports a document it cannot save, without the system error text', async () => {
    mkdirSync(join(cwd, OUT, `${ID}.pdf`), { recursive: true });
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: LISTING, [PDF_URL]: () => new Response(PDF) });
    const { code, output } = await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(code, 0);
    assert.deepEqual(output.results, [{ service_id: ID, status: 'failed', reason: 'could not save' }]);
  });

  it('rejects an --out path that cannot be a folder', async () => {
    writeFileSync(join(cwd, 'blocked'), 'a file');
    const { impl, calls } = fakeFetch({});
    const { code, output } = await run(['--out', 'blocked/prices', ID], { fetchImpl: impl, cwd });
    assert.equal(code, 2);
    assert.deepEqual(output, { ok: false, errors: ['--out folder could not be prepared'] });
    assert.equal(calls.length, 0);
  });

  it('rejects bad arguments without touching the network', async () => {
    const { impl, calls } = fakeFetch({});
    const tooMany = Array.from({ length: MAX_IDS + 1 }, (_, i) => String(1000000 + i));
    for (const argv of [[ID], ['--out', OUT], ['--out', OUT, 'https://example.com'], ['--out', '../outside', ID], ['--out', '.', ID], ['--out', OUT, ...tooMany]]) {
      const { code, output } = await run(argv, { fetchImpl: impl, cwd });
      assert.equal(code, 2, argv.join(' '));
      assert.equal(output.ok, false);
    }
    assert.equal(calls.length, 0);
  });
});
