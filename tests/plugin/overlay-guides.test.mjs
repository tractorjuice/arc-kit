#!/usr/bin/env node
/**
 * Tests for overlay guide discovery: hook-utils.mjs :: overlayGuideDirs, and
 * its use in sync-guides.mjs (/arckit:pages).
 *
 * Each overlay ships the guides for its own commands in its own docs/guides/.
 * Core used to carry all of them, which put 111 guides for commands core
 * doesn't have into every install and took core past the Claude plugin
 * directory's 512-file limit. /arckit:pages now picks an overlay's guides up
 * only when that overlay is available: beside core in the source checkout, or
 * installed for the user or this repo per Claude Code's installed_plugins.json.
 *
 * Run with:  node --test tests/plugin/overlay-guides.test.mjs
 */

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

import { overlayGuideDirs } from '../../plugins/arckit-claude/hooks/hook-utils.mjs';

const REPO_PLUGIN_ROOT = resolve(import.meta.dirname, '../../plugins/arckit-claude');

function withTmp(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-overlay-guides-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function makePlugin(dir, name, guides = []) {
  mkdirSync(join(dir, '.claude-plugin'), { recursive: true });
  writeFileSync(join(dir, '.claude-plugin', 'plugin.json'), JSON.stringify({ name }));
  if (guides.length > 0) {
    mkdirSync(join(dir, 'docs', 'guides'), { recursive: true });
    for (const g of guides) writeFileSync(join(dir, 'docs', 'guides', g), `# ${g}\n`);
  }
  return dir;
}

function writeInstalled(configDir, plugins) {
  mkdirSync(join(configDir, 'plugins'), { recursive: true });
  writeFileSync(
    join(configDir, 'plugins', 'installed_plugins.json'),
    JSON.stringify({ version: 2, plugins }),
  );
}

test('source checkout: finds the overlays beside core, not core or plugins without guides', () => {
  withTmp((tmp) => {
    const plugins = join(tmp, 'plugins');
    const core = makePlugin(join(plugins, 'arckit-claude'), 'arckit', ['adr.md']);
    makePlugin(join(plugins, 'arckit-fr'), 'arckit-fr', ['fr-irn.md']);
    makePlugin(join(plugins, 'arckit-eu'), 'arckit-eu', ['eu-dora.md']);
    makePlugin(join(plugins, 'arckit-nl'), 'arckit-nl');
    makePlugin(join(plugins, 'other-tool'), 'other-tool', ['x.md']);
    const env = { CLAUDE_CONFIG_DIR: join(tmp, 'empty-config') };

    assert.deepEqual(overlayGuideDirs(core, tmp, env), [
      join(plugins, 'arckit-eu', 'docs', 'guides'),
      join(plugins, 'arckit-fr', 'docs', 'guides'),
    ]);
  });
});

test('plugin cache: other core versions are ignored; installed overlays are found', () => {
  withTmp((tmp) => {
    const cache = join(tmp, 'config', 'plugins', 'cache', 'arckit-claude');
    const core = makePlugin(join(cache, 'arckit', '6.18.0'), 'arckit', ['adr.md']);
    makePlugin(join(cache, 'arckit', '6.17.5'), 'arckit', ['adr.md']);
    const fr = makePlugin(join(cache, 'arckit-fr', '6.18.0'), 'arckit-fr', ['fr-irn.md']);
    const configDir = join(tmp, 'config');
    writeInstalled(configDir, {
      'arckit@arckit-claude': [{ scope: 'user', installPath: core, version: '6.18.0' }],
      'arckit-fr@arckit-claude': [{ scope: 'user', installPath: fr, version: '6.18.0' }],
    });

    assert.deepEqual(overlayGuideDirs(core, join(tmp, 'repo'), { CLAUDE_CONFIG_DIR: configDir }), [
      join(fr, 'docs', 'guides'),
    ]);
  });
});

test('installs scoped to another repo are skipped; this repo and folders above it count', () => {
  withTmp((tmp) => {
    const cache = join(tmp, 'config', 'plugins', 'cache', 'arckit-claude');
    const core = makePlugin(join(cache, 'arckit', '6.18.0'), 'arckit', ['adr.md']);
    const eu = makePlugin(join(cache, 'arckit-eu', '6.18.0'), 'arckit-eu', ['eu-dora.md']);
    const ca = makePlugin(join(cache, 'arckit-ca', '6.18.0'), 'arckit-ca', ['ca-aia.md']);
    const repo = join(tmp, 'work', 'repo');
    const configDir = join(tmp, 'config');
    writeInstalled(configDir, {
      'arckit-eu@arckit-claude': [{ scope: 'project', projectPath: join(tmp, 'elsewhere'), installPath: eu }],
      'arckit-ca@arckit-claude': [{ scope: 'project', projectPath: join(tmp, 'work'), installPath: ca }],
      'superpowers@claude-plugins-official': [{ scope: 'user', installPath: join(tmp, 'sp') }],
    });

    assert.deepEqual(overlayGuideDirs(core, repo, { CLAUDE_CONFIG_DIR: configDir }), [
      join(ca, 'docs', 'guides'),
    ]);
  });
});

test('a repo-scoped install wins over a user-scoped one', () => {
  withTmp((tmp) => {
    const cache = join(tmp, 'config', 'plugins', 'cache', 'arckit-claude');
    const core = makePlugin(join(cache, 'arckit', '6.18.0'), 'arckit', ['adr.md']);
    const older = makePlugin(join(cache, 'arckit-fr', '6.17.5'), 'arckit-fr', ['fr-irn.md']);
    const newer = makePlugin(join(cache, 'arckit-fr', '6.18.0'), 'arckit-fr', ['fr-irn.md']);
    const repo = join(tmp, 'repo');
    const configDir = join(tmp, 'config');
    writeInstalled(configDir, {
      'arckit-fr@arckit-claude': [
        { scope: 'project', projectPath: repo, installPath: newer },
        { scope: 'user', installPath: older },
      ],
    });

    assert.deepEqual(overlayGuideDirs(core, repo, { CLAUDE_CONFIG_DIR: configDir }), [
      join(newer, 'docs', 'guides'),
    ]);
  });
});

test('a missing or unreadable installed_plugins.json finds nothing and does not throw', () => {
  withTmp((tmp) => {
    const core = makePlugin(join(tmp, 'cache', 'arckit', '6.18.0'), 'arckit', ['adr.md']);
    assert.deepEqual(overlayGuideDirs(core, tmp, { CLAUDE_CONFIG_DIR: join(tmp, 'none') }), []);

    const configDir = join(tmp, 'config');
    mkdirSync(join(configDir, 'plugins'), { recursive: true });
    writeFileSync(join(configDir, 'plugins', 'installed_plugins.json'), '{not json');
    assert.deepEqual(overlayGuideDirs(core, tmp, { CLAUDE_CONFIG_DIR: configDir }), []);
  });
});

test('/arckit:pages copies core and overlay guides from the source checkout', () => {
  withTmp((tmp) => {
    const repo = join(tmp, 'repo');
    mkdirSync(join(repo, 'projects', '000-global'), { recursive: true });
    spawnSync('git', ['init', '-q'], { cwd: repo });
    const r = spawnSync('node', [join(REPO_PLUGIN_ROOT, 'hooks', 'sync-guides.mjs')], {
      cwd: repo,
      input: JSON.stringify({ prompt: '/arckit:pages', cwd: repo }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: REPO_PLUGIN_ROOT, CLAUDE_CONFIG_DIR: join(tmp, 'config') },
      timeout: 60000,
    });
    assert.equal(r.status, 0, `hook failed: ${r.stderr}`);
    assert.ok(existsSync(join(repo, 'docs', 'guides', 'adr.md')), 'core guide missing');
    assert.ok(existsSync(join(repo, 'docs', 'guides', 'fr-irn.md')), 'overlay guide missing');
    assert.ok(!existsSync(join(REPO_PLUGIN_ROOT, 'docs', 'guides', 'fr-irn.md')), 'overlay guide back in core');
  });
});
