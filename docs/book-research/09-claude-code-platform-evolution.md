# Claude Code Platform Evolution

## Tracking the Platform (Issue #215)

ArcKit actively tracks Claude Code releases for capabilities that improve the plugin. Issue #215 consolidates tracking from v2.1.83 through v2.1.112.

## High-Value Capabilities Identified (23 Items)

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
| 10 | Skill description 250-char cap | v2.1.86 | **Fixed in v4.6.1** -- trimmed all 4 skill descriptions; cap raised to 1,536 in v2.1.105 (see #14) |
| 11 | `keep-coding-instructions` frontmatter | v2.1.94 | Persist static instructions across compaction |
| 12 | `hookSpecificOutput.sessionTitle` | v2.1.94 | Session-aware learning in session-learner.mjs |
| 13 | `Monitor` tool | v2.1.98 | Stream events from long-running background scripts (research agents, govreposcrape) |
| 14 | `monitors` top-level manifest key | v2.1.105 | Background monitors for artifact watch and stale-doc detection |
| 15 | PreCompact hook blocking | v2.1.105 | Block compaction mid-session when critical state is still needed |
| 16 | `ENABLE_PROMPT_CACHING_1H` | v2.1.108 | **Documented in #293** -- 1-hour prompt cache for 10 research agents and long workflows |
| 17 | Model invokes built-in slash commands via Skill tool | v2.1.108 | Skill tool can now call `/init`, `/review`, `/security-review` |
| 18 | Opus 4.7 `xhigh` effort level | v2.1.111 | Audit candidate for commands currently on `effort: max` |
| 19 | `/ultrareview` cloud PR review | v2.1.111 | Parallel multi-agent review — useful for reviewing generated artifacts |
| 20 | `/less-permission-prompts` skill | v2.1.111 | Scans transcripts and proposes settings allowlist |
| 21 | Push notification tool | v2.1.110 | Mobile notifications when long research agent runs complete |
| 22 | `/tui fullscreen` toggle | v2.1.110 | Switch to no-flicker rendering mid-session for long architecture work |
| 23 | OS CA certificate store trust by default | v2.1.101 | Enterprise TLS proxies work out-of-box (UK Gov / corporate users) |

## Platform Fixes That Affected ArcKit

### v2.1.89

- Hook `if` compound-command bug fix
- `file_path` now absolute in PreToolUse/PostToolUse hooks
- Hook output >50K saved to disk instead of context
- MCP non-blocking startup + 5s connection bound
- Autocompact thrash loop fix
- `PermissionDenied` hook added -- handle auto-mode denials with retry
- `defer` permission for PreToolUse -- headless/CI pause-and-resume

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

### v2.1.97

- MCP SSE memory leak ~50 MB/hr on reconnects fixed (benefits 5 MCP servers)
- 429 exponential backoff fix (was burning all retries in ~13s, benefits research agents)
- Stop/SubagentStop hooks no longer fail on long sessions (benefits session-learner.mjs)
- Subagent worktree/cwd leak fixed (benefits 10 agents)
- `claude plugin update` now detects new remote commits (critical for ArcKit distribution)
- Compaction dedup of multi-MB subagent transcript files
- Session transcript size reduced by skipping empty hook entries (benefits 18 hooks)

### v2.1.98

- **Security:** compound Bash permission bypass fixed (affects auto/bypass-permissions modes)
- **Security:** backslash-escaped flag auto-allow bypass fixed
- Subagent MCP tool inheritance from dynamically-injected servers fixed (affects 10 agents x 5 MCP servers)
- Prompt-type Stop/SubagentStop hooks failing on long sessions further hardened
- `/reload-plugins` now picks up plugin-provided skills without restart
- `/claude-api` skill updated to cover Managed Agents alongside Claude API

### v2.1.101

- Sub-agents in isolated worktrees can now Read/Edit their own worktree (affects ArcKit agents)
- MCP tools available on first turn of headless/remote-trigger sessions
- `permissions.deny` now overrides PreToolUse hook `permissionDecision: "ask"` (safer default)
- Plugin slash commands with duplicate `name:` frontmatter resolving to wrong plugin fixed
- Skills now honor `context: fork` and `agent` frontmatter fields
- Bedrock SigV4 with Authorization header env vars fixed
- Grep tool ENOENT on stale ripgrep binary path self-heals mid-session
- **Security:** command injection in POSIX `which` fallback (LSP binary detection) fixed

### v2.1.105

- `monitors` top-level plugin manifest key for background monitors
- Skill description cap raised from 250 to 1,536 characters
- PreCompact hook can now block compaction (exit 2 or `{"decision":"block"}`)
- Marketplace plugins with `package.json` + lockfile auto-install deps (**critical for the Paperclip TS plugin**)
- Marketplace auto-update no longer leaves broken state on file-lock during update
- Stalled API streams abort after 5 minutes with non-streaming retry
- WebFetch strips `<style>`/`<script>` tags (benefits research agents)
- Stale agent worktree cleanup for squash-merged PRs

### v2.1.107

- Thinking hints shown sooner during long operations (no ArcKit impact)

### v2.1.108

- `ENABLE_PROMPT_CACHING_1H` env var for 1-hour prompt cache TTL (API key, Bedrock, Vertex, Foundry)
- Recap feature (`/recap`) for long architecture sessions
- Model can invoke built-in slash commands (`/init`, `/review`, `/security-review`) via Skill tool
- `--resume <session-id>` keeps custom session name/color
- Policy-managed plugins now auto-update when running from a different project (affects ArcKit distribution)
- Agent tool no longer prompts for permission in auto mode when safety-classifier transcript exceeds its context

### v2.1.110

- `/tui` command to toggle fullscreen rendering mid-session
- Push notification tool for mobile notifications from the model
- MCP tool calls no longer hang on SSE/HTTP connection drop (affects 5 MCP servers)
- stdio MCP servers tolerate stray non-JSON lines on stdout (**regression fix from v2.1.105**)
- Non-streaming fallback multi-minute hangs when API unreachable fixed
- Plugin install now honors dependencies declared in `plugin.json`

### v2.1.111

- Opus 4.7 `xhigh` effort level (between `high` and `max`)
- Auto mode available for Max subscribers with Opus 4.7
- `/ultrareview` command for cloud-based parallel multi-agent code review
- `/less-permission-prompts` skill to propose settings allowlist from transcript
- Read-only bash commands with glob patterns no longer trigger permission prompts
- Commands starting with `cd <project-dir> &&` no longer trigger permission prompts
- Auto mode no longer requires `--enable-auto-mode`

### v2.1.112

- `claude-opus-4-7 is temporarily unavailable` for auto mode fixed

## Minimum Version History

| Date | Min Version | Reason |
|------|------------|--------|
| Pre-April 2026 | v2.1.90 | PreToolUse blocking fix, MCP performance |
| 9 April 2026 | v2.1.97 | `claude plugin update` fix, MCP memory leak, 429 backoff |
| 17 April 2026 | v2.1.112 | Opus 4.7 `xhigh` effort, auto mode without flag, read-only bash glob patterns, carries all v2.1.98-2.1.111 fixes |

## The Relationship Between ArcKit and Claude Code

ArcKit is one of the most complex Claude Code plugins in existence, pushing the platform's capabilities in areas like:

- Hook system (17 registered handlers across 7 event types)
- Agent system (10 autonomous agents with isolated contexts)
- MCP integration (5 external servers)
- Multi-format distribution (7 formats from one source)

This makes ArcKit both a beneficiary and a stress-tester of Claude Code features. Bugs discovered through ArcKit usage have contributed to platform improvements.
