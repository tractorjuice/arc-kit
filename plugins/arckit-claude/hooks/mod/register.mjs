/**
 * ArcKit status band: a Claude Code mod (hooks module).
 *
 * Draws one line above the prompt in an ArcKit repository (found by walking up
 * from the session's folder, as findRepoRoot does, so a session started inside
 * projects/ or a project still sees it): how many projects
 * and artefacts there are, how many are DRAFT, and how many reviews are
 * overdue, with a pointer to /arckit:health when something needs attention.
 * In the terminal it starts counting when the session starts; the desktop
 * app's Code tab joins its session later, so there it starts on session.attach.
 *
 * Claude Code only, and additive. It needs Claude Code v2.1.287+ (mods on by
 * default); an older client never loads it, and the classic hooks in
 * hooks.json run beside it unchanged. It only observes: every tool.call hook
 * passes the call on untouched, so no gate depends on it. It lives in a
 * subdirectory so the converter's hooks/*.mjs copy for Kimi never ships it.
 *
 * Set ARCKIT_NO_STATUS_BAND to switch it off.
 *
 * Counting rules live in status-model.mjs (pure, tested by
 * tests/plugin/status-band.test.mjs).
 */

import { bandText, candidateDirs, isArtefactName, isProjectDir, isProjectsListing, needsAttention, summarise } from './status-model.mjs';

const MAX_DEPTH = 4;
const MAX_FILES = 2000;
const MAX_BYTES = 4 * 1024 * 1024;
// The surfaces Claude Code raises the AbovePrompt band on.
const BAND_SURFACES = new Set(['terminal', 'desktop']);

function localDate(ms) {
  const at = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
}

let projectsDir = null;
let summary = null;
let isDirty = false;
let scanning = null;

async function collect($, dir, depth, found) {
  if (depth > MAX_DEPTH || found.length >= MAX_FILES) return;
  const entries = await $.fs.list(dir).catch(() => []);
  for (const entry of entries) {
    if (entry.isLink || found.length >= MAX_FILES) continue;
    if (entry.kind === 'dir' && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      await collect($, `${dir}/${entry.name}`, depth + 1, found);
    } else if (entry.kind === 'file' && isArtefactName(entry.name) && entry.size <= MAX_BYTES) {
      found.push(`${dir}/${entry.name}`);
    }
  }
}

async function scan($) {
  const top = await $.fs.list(projectsDir);
  const projectNames = top.filter((e) => e.kind === 'dir' && isProjectDir(e.name)).map((e) => e.name);
  const paths = [];
  for (const name of projectNames) {
    await collect($, `${projectsDir}/${name}`, 0, paths);
  }
  const texts = await Promise.all(paths.map((path) => $.fs.read(path).catch(() => '')));
  summary = summarise(projectNames, texts, localDate(await $.clock.now()));
  $.ui.invalidate('ui.render');
}

function rescan($) {
  if (!projectsDir || scanning) return;
  isDirty = false;
  scanning = scan($)
    .catch(() => {
      summary = null;
    })
    .finally(() => {
      scanning = null;
    });
}

async function findProjectsDir($, cwd) {
  for (const candidate of candidateDirs(cwd)) {
    const entries = await $.fs.list(candidate).catch(() => null);
    if (entries && isProjectsListing(entries)) return candidate;
  }
  return null;
}

async function start($, cwd) {
  if ((await $.env.get('ARCKIT_NO_STATUS_BAND')) !== undefined) return;
  if (!projectsDir) projectsDir = await findProjectsDir($, cwd);
  if (projectsDir) rescan($);
}

async function onSessionStart($, e, next) {
  const result = await next(e);
  if (e.isInteractive && e.surface === 'terminal') await start($, e.cwd);
  return result;
}

// The desktop app runs the session headless and joins it afterwards, so its
// session.start says no surface; it arrives here instead, before it first draws.
async function onSessionAttach($, e, next) {
  const result = await next(e);
  if (BAND_SURFACES.has(e.surface)) await start($, await $.session.cwd());
  return result;
}

async function markDirty($, e, next) {
  const result = await next(e);
  if (projectsDir) isDirty = true;
  return result;
}

async function onTurnComplete($, e, next) {
  const result = await next(e);
  if (isDirty) rescan($);
  return result;
}

async function drawBand($, e, next) {
  if (!summary || summary.projects === 0 || e.props.hasSurvey) return next(e);
  const { Box, Text } = await $.ui.resolve(e);
  const text = bandText(summary);
  return Box({
    paddingX: 1,
    children: [
      needsAttention(summary)
        ? Text({ color: 'yellow', wrap: 'truncate-end', children: text })
        : Text({ dimColor: true, wrap: 'truncate-end', children: text }),
    ],
  });
}

/** @type {import('claude-code').Register} */
export function register(on) {
  on('session.start', onSessionStart);
  on('session.attach', onSessionAttach);
  on('tool.call', { tool: 'Write' }, markDirty);
  on('tool.call', { tool: 'Edit' }, markDirty);
  on('tool.call', { tool: 'Bash' }, markDirty);
  on('turn.complete', onTurnComplete);
  on('ui.render', { component: 'AbovePrompt' }, drawBand);
}
