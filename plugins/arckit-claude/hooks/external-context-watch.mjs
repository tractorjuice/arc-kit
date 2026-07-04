#!/usr/bin/env node
/**
 * ArcKit FileChanged Hook - external document context watcher.
 *
 * Refreshes project `external/` directory watch paths and injects refreshed
 * ArcKit project context when a watched external document changes.
 */

import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { buildProjectContext } from './project-context-builder.mjs';
import {
  collectExternalWatchPaths,
  findExternalDocumentChange,
  resolveEventPath,
} from './external-context-utils.mjs';

export function runExternalContextWatch(data) {
  const eventName = data.hook_event_name || data.hookEventName || 'FileChanged';
  const eventPath = resolveEventPath(data.file_path || '', data.cwd || process.cwd());
  const cwd = data.cwd || (eventPath ? dirname(eventPath) : process.cwd());
  const repoRoot = findRepoRoot(cwd) || (eventPath ? findRepoRoot(dirname(eventPath)) : null);

  const output = {
    hookSpecificOutput: {
      hookEventName: eventName,
      watchPaths: repoRoot ? collectExternalWatchPaths(repoRoot) : [],
    },
  };

  if (!repoRoot || !eventPath) return output;

  const change = findExternalDocumentChange(repoRoot, eventPath);
  if (!change) return output;

  const contextText = buildProjectContext(repoRoot);
  if (!contextText) return output;

  const verbByEvent = {
    add: 'added',
    change: 'changed',
    unlink: 'removed',
  };
  const event = data.event || 'change';
  const verb = verbByEvent[event] || event;

  output.hookSpecificOutput.additionalContext = [
    '## ArcKit External Document Update',
    '',
    `A project external document was ${verb}:`,
    `- Project: ${change.projectName}`,
    `- Path: \`${change.projectRelativePath}\``,
    '',
    'Use the refreshed project context below when deciding whether existing artifacts should be updated.',
    '',
    contextText,
  ].join('\n');

  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(runExternalContextWatch(parseHookInput())));
}
