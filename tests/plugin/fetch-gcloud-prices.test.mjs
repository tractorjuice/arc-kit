import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  ASSET_HOST, LISTING_BASE, MAX_DOCUMENT_BYTES, MAX_IDS, findPricingDocument, isServiceId, run,
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

  it('clears earlier downloads but leaves other files alone', async () => {
    mkdirSync(join(cwd, OUT), { recursive: true });
    writeFileSync(join(cwd, OUT, '111111.pdf'), 'old');
    writeFileSync(join(cwd, OUT, 'keep.txt'), 'keep');
    const { impl } = fakeFetch({ [LISTING_BASE + ID]: '<p>none</p>' });
    await run(['--out', OUT, ID], { fetchImpl: impl, cwd });
    assert.equal(existsSync(join(cwd, OUT, '111111.pdf')), false);
    assert.ok(existsSync(join(cwd, OUT, 'keep.txt')));
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
