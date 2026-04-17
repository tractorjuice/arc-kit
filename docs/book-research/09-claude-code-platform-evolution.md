# Claude Code Platform Evolution

## Tracking the Platform (Issue #215)

ArcKit actively tracks Claude Code releases for capabilities that improve the plugin. Issue #215 consolidates tracking from v2.1.83 through v2.1.97.

## High-Value Capabilities Identified (14 Items)

| # | Capability | Claude Code Version | Impact on ArcKit |
|---|-----------|-------------------|-----------------|
| 1 | Plugin `userConfig` | v2.1.83 | API keys and org config in plugin.json |
| 2 | Conditional `if` on hooks | v2.1.85 | Reduce process spawning; compound-command bug fixed in v2.1.89 |
| 3 | Agent `initialPrompt` | v2.1.83 | Auto-submit first turn for 9 agents |
| 4 | Skills `paths:` globs | v2.1.84 | Scope 4 skills to relevant file patterns |
| 5 | `FileChanged`/`CwdChanged` hooks | v2.1.83 | Reactive context injection |
| 6 | `TaskCreated` hook | v2.1.84 | Agent tracking with blocking behavior (v2.1.89) |
| 7 | `PostCompact` hook | v2.1.76 | Re-inject context after compaction |
| 8 | `${CLAUDE_PLUGIN_DATA}` | v2.1.78 | Persistent state for session learning |
| 9 | MCP `headersHelper` env vars | v2.1.85 | Shared auth for multiple MCP servers |
| 10 | `PermissionDenied` hook | v2.1.89 | Handle auto-mode denials with retry |
| 11 | `defer` permission for PreToolUse | v2.1.89 | Headless/CI pause-and-resume |
| 12 | Skill description 250-char cap | v2.1.86 | **Fixed in v4.6.1** -- trimmed all 4 skill descriptions |
| 13 | `keep-coding-instructions` frontmatter | v2.1.94 | Persist static instructions across compaction |
| 14 | `hookSpecificOutput.sessionTitle` | v2.1.94 | Session-aware learning in session-learner.mjs |

## Platform Fixes That Affected ArcKit

### v2.1.89

- Hook `if` compound-command bug fix
- `file_path` now absolute in PreToolUse/PostToolUse hooks
- Hook output >50K saved to disk instead of context
- MCP non-blocking startup + 5s connection bound
- Autocompact thrash loop fix

### v2.1.90

- PostToolUse format-on-save hook no longer causes "File content has changed" failures
- PreToolUse JSON exit-code-2 blocking fix (affects ArcKit's blocking hooks)
- MCP tool schema JSON.stringify eliminated (performance win for 5 MCP servers)
- SSE transport now linear-time (was quadratic)
- `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` for offline environments

### v2.1.91

- Plugin `bin/` executables -- ArcKit's 6 bash scripts could ship under `bin/`
- `disableSkillShellExecution` setting -- could break ArcKit commands that invoke bash scripts

### v2.1.92

- Stop hook semantics fix -- restores `preventContinuation:true` behavior (relevant to session-learner.mjs)
- Plugin MCP servers stuck 'connecting' fix (affects ArcKit's 5 MCP servers)
- Subagent spawning fix in tmux (affects ArcKit's 10 agents)
- Write tool 60% faster for large files with tabs/`&`/`$` (common in architecture documents)

### v2.1.94

- `keep-coding-instructions` frontmatter -- persist instructions across compaction
- Default effort changed medium->high for API-key users
- Fixed `${CLAUDE_PLUGIN_ROOT}` resolving for local-marketplace plugins
- Fixed agents stuck after 429 with long Retry-After (affects 10 ArcKit agents)

### v2.1.97 (Current Minimum)

- MCP SSE memory leak ~50 MB/hr on reconnects fixed (benefits 5 MCP servers)
- 429 exponential backoff fix (was burning all retries in ~13s, benefits research agents)
- Stop/SubagentStop hooks no longer fail on long sessions (benefits session-learner.mjs)
- Subagent worktree/cwd leak fixed (benefits 10 agents)
- `claude plugin update` now detects new remote commits (critical for ArcKit distribution)
- Compaction dedup of multi-MB subagent transcript files
- Session transcript size reduced by skipping empty hook entries (benefits 18 hooks)

## Minimum Version History

| Date | Min Version | Reason |
|------|------------|--------|
| Pre-April 2026 | v2.1.90 | PreToolUse blocking fix, MCP performance |
| 9 April 2026 | v2.1.97 | `claude plugin update` fix, MCP memory leak, 429 backoff |

## The Relationship Between ArcKit and Claude Code

ArcKit is one of the most complex Claude Code plugins in existence, pushing the platform's capabilities in areas like:

- Hook system (17 registered handlers across 7 event types)
- Agent system (10 autonomous agents with isolated contexts)
- MCP integration (5 external servers)
- Multi-format distribution (7 formats from one source)

This makes ArcKit both a beneficiary and a stress-tester of Claude Code features. Bugs discovered through ArcKit usage have contributed to platform improvements.
