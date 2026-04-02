# Hooks Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit's Claude Code plugin includes 17 automation hooks across 7 event types. Hooks run automatically — no manual configuration required.

## Overview

| Event | Hooks | When it fires |
|-------|-------|---------------|
| **SessionStart** | arckit-session, version-check | Session start, resume, clear, compact |
| **Stop** | session-learner | Session ends normally |
| **StopFailure** | session-learner | Session ends with error |
| **UserPromptSubmit** | arckit-context, secret-detection, + 6 command-specific | Every user message |
| **PreToolUse** | validate-arc-filename, score-validator, file-protection, secret-file-scanner | Before Write or Edit |
| **PostToolUse** | update-manifest | After Write |
| **PermissionRequest** | allow-mcp-tools | MCP tool permission prompt |

## SessionStart Hooks

### arckit-session

Fires once at session start (and on resume/clear/compact). Injects ArcKit plugin version into context and exports environment variables (`ARCKIT_VERSION`, `CLAUDE_CODE_NO_FLICKER=1`) for the session.

Also detects:

- Whether a `projects/` directory exists
- External files newer than the latest artifacts (prompts re-running commands)
- Recent session history from `.arckit/memory/sessions.md`

### version-check

Compares the local plugin version against the latest GitHub release tag. Shows a notification if an update is available.

## Stop / StopFailure Hooks

### session-learner

Fires when a session ends (both normal and failure). Records session activity — which projects were touched, what artifact types were created or modified — to `.arckit/memory/sessions.md` for context in future sessions.

## UserPromptSubmit Hooks

### arckit-context (all prompts)

Pre-computes project context when any `/arckit:` command is run. Injects project inventory, artifact lists, newest artifact timestamps, and ArcKit version via `additionalContext` so commands don't need to discover this themselves.

### secret-detection (all prompts)

Scans user prompts for secret patterns (API keys, tokens, passwords, connection strings, private keys). Blocks the message before it reaches the model if a secret is detected. See the [Security Hooks Guide](security-hooks.md) for details.

### Command-Specific Hooks

These fire only when the matched command is invoked:

| Hook | Fires on | Purpose |
|------|----------|---------|
| **sync-guides** | `/arckit:pages` | Syncs guide files and regenerates `docs/index.html` from the pages template |
| **health-scan** | `/arckit:health` | Pre-scans all artifacts for staleness, broken traceability, unresolved conditions, and version drift |
| **traceability-scan** | `/arckit:traceability` | Pre-extracts requirement IDs from REQ files, cross-references ADRs and vendor documents, computes coverage |
| **governance-scan** | `/arckit:analyze` | Pre-scans governance posture across projects — compliance gaps, missing artifacts, risk exposure |
| **search-scan** | `/arckit:search` | Pre-indexes artifact content for the search command |
| **impact-scan** | `/arckit:impact` | Pre-analyzes cross-artifact dependency chains for impact assessment |

## PreToolUse Hooks

These fire before Claude writes or edits a file. They can block the operation.

### validate-arc-filename (Write)

Validates that files written to `projects/` follow the ARC naming convention (`ARC-{PID}-{TYPE}-v{VERSION}.md`). Checks:

- Project ID matches the directory number
- Document type is a known type code
- Version format is valid
- Multi-instance types (ADR, DIAG, etc.) have sequence numbers
- File goes in the correct subdirectory (e.g., ADRs in `decisions/`)

Blocks the write with a corrected filename suggestion if invalid.

### score-validator (Write)

Validates scoring/assessment documents for numeric consistency. Checks that individual scores match totals, percentages are calculated correctly, and rating scales are applied consistently.

### file-protection (Edit | Write)

Blocks writes to sensitive file paths — environment files (`.env`), credential stores, private keys, lock files, and CI/CD configuration. See the [Security Hooks Guide](security-hooks.md) for the full list.

### secret-file-scanner (Edit | Write)

Scans the content being written for embedded secret patterns. Catches cases where a secret is embedded in an otherwise safe file path. See the [Security Hooks Guide](security-hooks.md) for details.

## PostToolUse Hooks

### update-manifest (Write)

After a file is written to `projects/`, updates `docs/manifest.json` with the new artifact metadata (document ID, type, version, path, timestamp). This keeps the documentation site's artifact index in sync.

## PermissionRequest Hooks

### allow-mcp-tools

Auto-allows MCP tool calls from ArcKit's bundled MCP servers (AWS Knowledge, Microsoft Learn, Google Developer Knowledge, DataCommons, govreposcrape) so users don't need to approve each one manually.

## Utility Files

These are shared libraries, not hooks themselves:

| File | Purpose |
|------|---------|
| **hook-utils.mjs** | Shared utilities: `parseHookInput()`, `findRepoRoot()`, `extractDocType()`, file I/O helpers |
| **graph-utils.mjs** | Dependency graph construction for impact analysis |
| **hooks.json** | Hook registration — maps events and matchers to handler commands |

## Troubleshooting

**Hook not firing?** Check that the hook is registered in `hooks.json` and the matcher pattern matches the tool or command name.

**Hook blocking unexpectedly?** PreToolUse hooks that exit with code 2 and output JSON with `"decision": "block"` will block the tool call. Check stderr output for the hook's reasoning.

**Timeout errors?** Each hook has a timeout (5–30 seconds) defined in `hooks.json`. Long-running hooks (health-scan, governance-scan) have 30-second timeouts. If a hook times out, it passes silently.
