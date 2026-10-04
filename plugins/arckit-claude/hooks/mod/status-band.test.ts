/**
 * The status band on each surface, run inside Claude Code's own engine:
 *
 *   claude plugin test plugins/arckit-claude
 *
 * The hooks each test registers stand for the engine beneath the mod: a small
 * projects/ tree on a fake disk, the session folder, and an empty band. The
 * desktop case is the one that matters: the desktop app runs the session
 * headless, so session.start names no surface and the band must start on
 * session.attach instead. Counting rules are covered by
 * tests/plugin/status-band.test.mjs.
 */

import { describe, expect, mock, test } from 'claude-code/testing';
import type { FsEntry, On } from 'claude-code';

const CWD = '/repo';

function doc(status: string): string {
  return [
    '| Field | Value |',
    '|-------|-------|',
    `| **Status** | ${status} |`,
    '| **Last Modified** | 2026-09-20 |',
    '| **Next Review Date** | 2099-01-01 |',
  ].join('\n');
}

const FILES: Record<string, string> = {
  '/repo/projects/001-alpha/ARC-001-REQ-v1.0.md': doc('APPROVED'),
  '/repo/projects/001-alpha/decisions/ARC-001-ADR-001-v1.0.md': doc('DRAFT'),
};

function entry(name: string, kind: FsEntry['kind']): FsEntry {
  return { name, kind, size: 100, mtimeMs: 0, isLink: false };
}

const DIRS: Record<string, FsEntry[]> = {
  '/repo/projects': [entry('001-alpha', 'dir'), entry('README.md', 'file')],
  '/repo/projects/001-alpha': [entry('ARC-001-REQ-v1.0.md', 'file'), entry('decisions', 'dir')],
  '/repo/projects/001-alpha/decisions': [entry('ARC-001-ADR-001-v1.0.md', 'file')],
};

/** Stands in for the engine beneath the plugin: the disk, the session, and an empty band. */
function repo(on: On): void {
  mock.env(on, {});
  mock.clock(on, { now: Date.UTC(2026, 9, 4) });
  on('fs.list', async (_$, e) => ({ value: DIRS[e.path] ?? [] }));
  on('fs.read', async (_$, e) => ({ value: FILES[e.path] ?? '' }));
  on('session.cwd', async () => ({ value: CWD }));
  on('session.start', async (_$, e) => ({ cwd: e.cwd }));
  on('session.attach', async (_$, e) => ({ clientId: e.clientId }));
  on('ui.render', { component: 'AbovePrompt' }, async () => ({ type: 'engine', ref: 0 }));
}

const BAND = {
  plugin: 'arckit',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 9 },
    view: {},
  },
} as const;

const LINE = /ArcKit · 1 project · 2 artefacts · 1 draft/;

describe('status band', () => {
  test('draws in the terminal from session start', async ($, on) => {
    repo(on);
    await $.session.start({ cwd: CWD, surface: 'terminal', isInteractive: true });
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' });
    expect((await ui.find({ type: 'Text', text: LINE }))?.text).toMatch(LINE);
    await ui.unmount();
  });

  test('draws in the desktop app once it attaches', async ($, on) => {
    repo(on);
    await $.session.start({ cwd: CWD, surface: null, isInteractive: false });
    await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' });
    const ui = await $.ui.mount({ ...BAND, surface: 'desktop' });
    expect((await ui.find({ type: 'Text', text: LINE }))?.text).toMatch(LINE);
    await ui.unmount();
  });

  test('stays empty in a headless run nothing attaches to', async ($, on) => {
    repo(on);
    await $.session.start({ cwd: CWD, surface: null, isInteractive: false });
    const ui = await $.ui.mount({ ...BAND, surface: 'desktop' });
    expect(await ui.find({ type: 'Text', text: /ArcKit/ })).toBeUndefined();
    await ui.unmount();
  });
});
