#!/usr/bin/env node
/**
 * Download G-Cloud pricing documents so a research reader can open them.
 *
 * Usage: node fetch-gcloud-prices.mjs --out <dir> <service-id> [<service-id> ...]
 *
 * G-Cloud suppliers publish their prices in a PDF linked from the listing,
 * which WebFetch can't read. A reader can open a local PDF, but readers have
 * no shell by design, so /arckit:research runs this script and hands the
 * reader the files.
 *
 * The caller holds reader output, which is untrusted, so the script takes
 * numeric service IDs only and builds every URL itself. A document is accepted
 * only from the Digital Marketplace's asset host, named for that service.
 * Redirects are refused. stdout carries status and paths, never document
 * content, so nothing a supplier wrote reaches the session that runs this.
 *
 * Each call replaces only the files for the IDs it is given: a service's old
 * file is removed before its fetch, so a failed or withdrawn document never
 * leaves an out-of-date one behind, and a second call for other IDs leaves
 * earlier files in place. Files untouched for a week are cleared.
 *
 * Exit 0: {ok:true, results:[{service_id, status, pdf_url?, file?, bytes?, reason?}]}
 *         status is "ok", "no-document" or "failed", per service.
 * Exit 2: {ok:false, errors:[...]} for bad arguments or an unusable --out
 *         folder. Nothing is downloaded.
 * Exit 1: {ok:false, errors:["unexpected failure"]}.
 */
import { lstatSync, mkdirSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LISTING_BASE = 'https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/';
export const ASSET_HOST = 'assets.applytosupply.digitalmarketplace.service.gov.uk';
export const MAX_IDS = 20;
export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;
const MAX_LISTING_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 30_000;
const CONCURRENCY = 3;
const USER_AGENT = 'ArcKit-research (+https://arckit.org)';
// Housekeeping only. Files from earlier calls in a run must survive, even a run paused for days,
// because a reader may not have opened them yet. Freshness comes from replacing each requested ID.
export const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

// Fixed strings only: a reason is printed to the calling session.
class FetchProblem extends Error {}

export function isServiceId(value) {
  return typeof value === 'string' && /^\d{6,20}$/.test(value);
}

export function findPricingDocument(html, serviceId) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let url;
    try {
      url = new URL(match[1].replaceAll('&amp;', '&'));
    } catch {
      continue;
    }
    const name = url.pathname.split('/').pop() ?? '';
    if (url.protocol === 'https:' && url.hostname === ASSET_HOST
      && name.startsWith(`${serviceId}-pricing-document`) && name.toLowerCase().endsWith('.pdf')) {
      return url.href;
    }
  }
  return null;
}

async function download(url, limit, fetchImpl) {
  const response = await fetchImpl(url, {
    redirect: 'error',
    headers: { 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new FetchProblem(`HTTP ${response.status}`);
  if (Number(response.headers.get('content-length') ?? 0) > limit) throw new FetchProblem('too large');
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new FetchProblem('too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function fetchOne(serviceId, directory, cwd, fetchImpl) {
  try {
    const html = (await download(LISTING_BASE + serviceId, MAX_LISTING_BYTES, fetchImpl)).toString('utf8');
    const pdfUrl = findPricingDocument(html, serviceId);
    if (!pdfUrl) return { service_id: serviceId, status: 'no-document' };
    const body = await download(pdfUrl, MAX_DOCUMENT_BYTES, fetchImpl);
    if (body.subarray(0, 5).toString('latin1') !== '%PDF-') throw new FetchProblem('not a PDF');
    const path = join(directory, `${serviceId}.pdf`);
    try {
      writeFileSync(path, body);
    } catch {
      throw new FetchProblem('could not save');
    }
    return { service_id: serviceId, status: 'ok', pdf_url: pdfUrl, file: relative(cwd, path).split(sep).join('/'), bytes: body.length };
  } catch (error) {
    return { service_id: serviceId, status: 'failed', reason: error instanceof FetchProblem ? error.message : 'network error' };
  }
}

// Remove one entry without ever throwing: another call may have removed it first, it may be a
// broken link, or it may be a folder, which is left alone.
function removeQuietly(path) {
  try {
    rmSync(path, { force: true });
  } catch {
    // Not removable. A later write to this path reports "could not save".
  }
}

function prepareDirectory(out, cwd, ids) {
  const directory = resolve(cwd, out);
  const inside = relative(cwd, directory);
  if (!inside || inside.startsWith('..') || isAbsolute(inside)) return { error: '--out must be a folder inside the working directory' };
  let names;
  try {
    mkdirSync(directory, { recursive: true });
    // These are working files, so keep them out of the project's history.
    writeFileSync(join(directory, '.gitignore'), '*\n');
    names = readdirSync(directory);
  } catch {
    return { error: '--out folder could not be prepared' };
  }
  // A requested service starts with no file, so a failed fetch can't leave an old document behind.
  for (const id of ids) removeQuietly(join(directory, `${id}.pdf`));
  const cutoff = Date.now() - STALE_AFTER_MS;
  for (const name of names) {
    if (!/^\d+\.pdf$/.test(name)) continue;
    const path = join(directory, name);
    try {
      if (lstatSync(path).mtimeMs < cutoff) removeQuietly(path);
    } catch {
      // Already gone.
    }
  }
  return { directory };
}

export async function run(argv, { fetchImpl = fetch, cwd = process.cwd() } = {}) {
  const errors = [];
  const ids = [];
  let out = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out') {
      out = argv[i += 1] ?? null;
    } else if (isServiceId(argv[i])) {
      if (!ids.includes(argv[i])) ids.push(argv[i]);
    } else {
      errors.push('every argument after --out must be a numeric G-Cloud service ID');
    }
  }
  if (!out) errors.push('--out <dir> is required');
  if (ids.length === 0) errors.push('at least one service ID is required');
  if (ids.length > MAX_IDS) errors.push(`at most ${MAX_IDS} service IDs per run`);
  const prepared = errors.length === 0 ? prepareDirectory(out, cwd, ids) : {};
  if (prepared.error) errors.push(prepared.error);
  if (errors.length > 0) return { code: 2, output: { ok: false, errors: [...new Set(errors)] } };
  const { directory } = prepared;

  const results = new Array(ids.length);
  let next = 0;
  const worker = async () => {
    while (next < ids.length) {
      const index = next;
      next += 1;
      results[index] = await fetchOne(ids[index], directory, cwd, fetchImpl);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, ids.length) }, worker));
  return { code: 0, output: { ok: true, results } };
}

function isMainModule() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  let outcome;
  try {
    outcome = await run(process.argv.slice(2));
  } catch {
    // Fixed text only: an error message could carry supplier-controlled text.
    outcome = { code: 1, output: { ok: false, errors: ['unexpected failure'] } };
  }
  process.stdout.write(`${JSON.stringify(outcome.output)}\n`);
  process.exitCode = outcome.code;
}
