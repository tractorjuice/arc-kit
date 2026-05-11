# Plugin / Extension Capability Comparison

**Claude Code (v2.1.117–128) vs Gemini CLI vs OpenAI Codex CLI**

Compiled from official docs in early 2026. Sources cited at the end.

---

## At-a-glance summary

| Capability | Claude Code | Gemini CLI | Codex CLI |
|---|---|---|---|
| Slash commands | Markdown + rich frontmatter | TOML (Markdown proposed) | Markdown — **deprecated**, migrate to skills |
| Skills | `SKILL.md`, `paths:` auto-activation | `skills/`, model-driven | `SKILL.md` + optional `agents/openai.yaml` |
| Subagents | 18 frontmatter fields, allow + deny tool lists | Allowlist only, per-agent MCP isolation | Sandbox + MCP filters, no per-tool list |
| Hooks | **31 events**, 5 handler types, `if:` filter | ~11 events, command handler | 6 events, regex matcher |
| MCP servers | `alwaysLoad`, `headersHelper`, per-subagent inline | All eager-load, per-extension | `enabled`/`required`, OAuth store |
| Background monitors | `experimental.monitors` key (stdout → notifications) | None | None |
| User config (typed) | `userConfig` + keychain | `settings[]` + envVar | env var only |
| Plugin root variable | `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}` | `${extensionPath}`, `${workspacePath}`, `${/}` | implicit (relative paths) |
| Distribution | `/plugin marketplace add` | `gemini extensions install` + gallery | `/plugins` + `marketplace.json` |
| Output styles | Plugin-shipped `output-styles/` | Themes only (different concept) | None |
| Themes | None at plugin level | `themes/` array with token overrides | None |
| LSP servers | Plugin-shipped `lsp/` + `.lsp.json` | None | None |
| Bin executables | Plugin `bin/` injected to PATH | None | None |
| Channels | Plugin `channels` (Telegram/Slack/Discord) | None | None |
| Plugin dependencies | `dependencies` semver + `claude plugin prune` | None | None |
| Policy engine | None | `policies/*.toml` | `requirements.toml` (admin-locked) |
| Profiles | None | None | `[profiles.<name>]` overrides |
| Sandbox modes | `permissionMode` per-agent | None | `read-only` / `workspace-write` / `danger-full-access` |
| Worktree isolation | `isolation: "worktree"` | None | (sandbox handles equivalent) |
| Remote control / mobile push | Research preview, Pro/Max | None | None |
| Agent teams | **EXPERIMENTAL** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) | None | None |
| Forked subagents | **EXPERIMENTAL** (`CLAUDE_CODE_FORK_SUBAGENT=1`) | None | None |

---

## 1. Slash commands

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| File format | Markdown + YAML frontmatter | TOML (`commands/*.toml`) | Markdown (`prompts/*.md`) — **deprecated** |
| Args | `$ARGUMENTS`, `$0..$9`, `$name` | `{{args}}` | `$1..$9`, `$ARGUMENTS`, `KEY=value` |
| Shell injection | `` !`cmd` `` | `!{cmd}` (auto-confirm) | n/a |
| File injection | `@file` | `@{file}` (multimodal) | n/a |
| `effort` / `model` override | `effort: low..max\|xhigh`, `model:` | None | Per-agent only |
| `keep-coding-instructions` | Persists across `/compact` | None | None |
| `handoffs:` next-step hints | Yes | None | None |
| `allowed-tools` pre-approval | Yes | None | n/a |
| `disable-model-invocation` | Yes (manual-only) | None | `policy.allow_implicit_invocation` |
| `context: fork` | Run in subagent | None | None |

## 2. Subagents / agents

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| Format | Markdown + frontmatter | Markdown + frontmatter | TOML (`.codex/agents/*.toml`) |
| Tool allowlist | `tools:` | `tools:` (with `*` wildcards) | None (use sandbox + `mcp_servers`) |
| Tool denylist | `disallowedTools:` | None | None |
| Model override | Yes (`sonnet/opus/haiku/inherit`) | Yes | `model`, `model_reasoning_effort` |
| Turn / time limits | `maxTurns` | `max_turns`, `timeout_mins` | `job_max_runtime_seconds` |
| Initial prompt | `initialPrompt` (v2.1.110+) | None | None |
| Per-agent MCP isolation | `mcpServers:` (inline) | `mcpServers:` | `mcp_servers` |
| Skills preload | `skills:` array | None | `skills.config` |
| Persistent memory | `memory: user/project/local` | None | None |
| Background mode | `background: true` | None | None |
| Worktree isolation | `isolation: "worktree"` | None | None |
| UI colour | `color:` | None | None |
| Parallel dispatch | Yes (Agent tool, agent teams) | Yes | `max_threads` (default 6) |
| Built-in agents | Explore, Plan, general-purpose, statusline-setup, claude-code-guide | None | `default`, `worker`, `explorer` |
| Plugin restrictions | Plugin agents stripped of `hooks`, `mcpServers`, `permissionMode` | None | None |
| Teams (multi-instance) | **EXPERIMENTAL** — shared task list, mailbox messaging | None | None |
| Fork (inherit context) | **EXPERIMENTAL** — full conversation history | None | None |

**Claude subagent frontmatter (18 fields)**: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`, plus `subagent: true` flag and `disable-model-invocation`.

## 3. Skills

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| Discovery | `skills/<name>/SKILL.md` | `skills/` | `.agents/skills/<name>/`, `$CODEX_HOME/skills/`, `/etc/codex/skills/` |
| Frontmatter | `name`, `description` (≤1536), `paths:` glob, `disable-model-invocation`, `allowed-tools`, `model`, `effort`, `context: fork` | `name`, `description` | `name`, `description` + optional `agents/openai.yaml` |
| Auto-activation | `paths:` glob | Model-driven | Implicit-invocation policy |
| Progressive disclosure | Yes | Yes | Yes (~2% / 8K-char metadata budget, fairness trimming) |
| Branding metadata | None | None | `display_name`, `icon`, `brand_color`, `default_prompt` |
| Search order | project → user → plugin | extension → project → user | repo → user → admin → bundled |

## 4. Hooks — full event list

### Claude Code (31 events)

**Session lifecycle**: SessionStart, SessionEnd, Setup
**Per-turn**: UserPromptSubmit, UserPromptExpansion, Stop, **StopFailure**
**Tool**: PreToolUse, PostToolUse, PostToolUseFailure, PostToolBatch
**Subagent**: SubagentStart, SubagentStop, TaskCreated, TaskCompleted, **TeammateIdle**
**Environment**: FileChanged, CwdChanged, ConfigChange, PreCompact, **PostCompact**, InstructionsLoaded
**MCP**: Elicitation, ElicitationResult
**Permission**: PermissionRequest, PermissionDenied
**Other**: Notification, WorktreeCreate, WorktreeRemove

**Handler types (5)**: `command`, `http`, `mcp_tool`, `prompt` (LLM eval), `agent` (verifier)

**Output protocol**: `continue`, `stopReason`, `suppressOutput`, `systemMessage`, `decision`, `reason`, `hookSpecificOutput.{permissionDecision: allow/deny/ask/defer, permissionDecisionReason, updatedInput, worktreePath, action, content, retry, additionalContext}`

**Filtering**: `if:` permission-rule (e.g. `Write(/projects/**)`) + matcher regex

**Async support**: `async: true`, `asyncRewake: false`

### Gemini CLI (~11 events)

BeforeTool, AfterTool, BeforeToolSelection, BeforeAgent, AfterAgent, BeforeModel, AfterModel, SessionStart, SessionEnd, Notification, PreCompress

Handler: `command` only. Matcher: regex.

### Codex CLI (6 events)

SessionStart, PreToolUse, PermissionRequest, PostToolUse, UserPromptSubmit, Stop

Handler: `command` (JSON stdio + exit-code-2 block). Matcher: regex only — no `if:` permission-rule scoping.

## 5. MCP servers

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| Config location | `.mcp.json` | `mcpServers` in `gemini-extension.json` | `[mcp_servers.<name>]` in `config.toml` |
| Transports | stdio / SSE / HTTP / WebSocket | stdio + standard | stdio + HTTP |
| Eager vs lazy | `alwaysLoad: true` (v2.1.121+) | Always eager | Always eager (`enabled` / `required`) |
| Header injection | `headersHelper` (v2.1.128+) | None | `http_headers`, `env_http_headers`, `bearer_token_env_var` |
| User-config substitution | `${user_config.KEY}` | None (env vars) | None (env vars) |
| OAuth | Partial | Partial | `mcp_oauth_callback_*`, `mcp_oauth_credentials_store` |
| Tool filters | Permissions | `excludeTools` | `enabled_tools`, `disabled_tools` |
| Per-subagent scope | Inline `mcpServers` field | `mcpServers:` per agent | `mcp_servers` per agent |

## 6. User config & secrets

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| Declarative schema | `userConfig` in `plugin.json` | `settings[]` in `gemini-extension.json` | None (document env vars) |
| Types | string / number / boolean / **directory / file** | string + envVar binding | string (env var) |
| Secret storage | `sensitive: true` → keychain | `sensitive: true` → keychain | OAuth only (`cli_auth_credentials_store`) |
| In-prompt substitution | `${user_config.KEY}` | None | None |
| Project-level overrides | `.claude/plugin-name.local.md` | None | None |

## 7. Plugin manifest & distribution

| Aspect | Claude | Gemini | Codex |
|---|---|---|---|
| Manifest | `.claude-plugin/plugin.json` | `gemini-extension.json` | `.codex-plugin/plugin.json` |
| Plugin root variable | `${CLAUDE_PLUGIN_ROOT}` | `${extensionPath}` | implicit (relative paths) |
| Persistent data dir | `${CLAUDE_PLUGIN_DATA}` (`~/.claude/plugins/data/{id}/`) | None | `$CODEX_HOME` for user-scope |
| Workspace variable | None | `${workspacePath}` | None |
| Path separator | None | `${/}` | None |
| Marketplace install | `/plugin marketplace add owner/repo` | `gemini extensions install <url\|path>` | `/plugins` + `marketplace.json` |
| Validation | `claude plugin tag --dry-run` | `gemini extensions list/update` | n/a |
| Migration | None | `migratedTo` field auto-redirects | None |
| Marketplace metadata | `keywords` | Gallery at geminicli.com/extensions | "OpenAI Curated" built-in |
| Installation scopes | user / project / local / managed | user / project / extension | user / project / admin |

## 8. Plugin-only capabilities (anything else a plugin author can ship)

### Claude Code

- **Output styles** (`output-styles/`) — modify system prompt role/tone/format; supports `keep-coding-instructions: true`.
- **LSP servers** (`lsp/` + `.lsp.json`) — language server integrations for diagnostics, go-to-def, hover.
- **Bin executables** (`bin/`) — adds executables to Bash tool's PATH.
- **Channels** (`channels`) — message injection for Telegram/Slack/Discord-style integrations, each bound to an MCP server with per-channel `userConfig`.
- **Plugin-shipped settings.json** — currently supports `agent` (default subagent) and `subagentStatusLine` keys.
- **Plugin dependencies** — `dependencies` array with semver constraints; `claude plugin prune`/`autoremove` for orphans.
- **Background monitors** (`experimental.monitors` key, moved from top-level in v2.1.129) — persistent subprocess; `when: always` or `on-skill-invoke:<skill>`; stdout → in-session notifications.

### Gemini CLI

- **Themes** — `themes` array with `base` preset + `overrides` for `background`, `text`, `status`, `border`, `ui` color tokens.
- **Policy engine** — `policies/*.toml` for behaviour interception/safety rules (distinct from hooks).
- **Context files** — `contextFileName` per-extension (defaults `GEMINI.md`); auto-loaded into model.
- **`excludeTools`** — array blocking tools/patterns at extension level (e.g. `"run_shell_command(rm -rf)"`).
- **Plan artefacts directory** — `plan.directory` for plan-mode outputs.

### Codex CLI

- **Profiles** — `[profiles.<name>]` overrides any config key (`model`, `model_reasoning_effort`, `approval_policy`, `sandbox_mode`); built-ins `:read-only`, `:workspace`, `:danger-no-sandbox`.
- **Permissions tables** — `[permissions.<name>]` with filesystem/network rules; `default_permissions` selects one.
- **Sandbox modes** — `read-only` / `workspace-write` / `danger-full-access`.
- **Approval policy** — granular sub-settings per prompt category.
- **Built-in agent roles** — `default`, `worker`, `explorer` (read-only); custom names matching built-ins take precedence.
- **Project trust levels** — `[projects.<path>] trust_level`, `project_doc_fallback_filenames`.
- **Credential store** — `cli_auth_credentials_store` = `file` / `keyring` / `auto`.
- **`requirements.toml`** — enterprise/admin lock for `allowed_approval_policies`, `allowed_sandbox_modes`, MCP allowlists.

## 9. Beta / experimental Claude Code features

| Feature | Status | Requirement |
|---|---|---|
| Remote Control | Research preview | v2.1.51+; Pro/Max/Team/Enterprise |
| Mobile push notifications | Stable (within Remote Control) | v2.1.110+ |
| **Agent teams** | EXPERIMENTAL | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
| **Forked subagents** | EXPERIMENTAL | `CLAUDE_CODE_FORK_SUBAGENT=1`; v2.1.117+ |
| Scheduled tasks (`/loop`, `/schedule`, cron) | Stable | v2.1.72+ |
| Routines (cloud scheduling) | Stable | Pro/Max/Team/Enterprise |
| Auto memory | Stable | v2.1.115+ |
| Output styles | Stable | v2.1+ |
| Plan mode | Stable | v2.1+ |
| Subagent persistent memory | Stable | v2.1+ |
| Status line scripts | Stable | v2.1+ |

### Agent teams (experimental) — what's different

- Subagents run inside the parent session; report results back only.
- **Agent teams** are separate Claude Code instances with their own context windows, working in parallel via:
  - Shared task list (teammates claim work; dependencies auto-managed)
  - Mailbox for inter-agent messaging
  - In-process or split-pane (tmux/iTerm2) display modes
- Limitations: one team per session, no nested teams, fixed lead, no `/resume` for in-process teammates.

### Forked subagents (experimental) — what's different

- Inherit **entire conversation history** instead of starting fresh.
- Same system prompt, tools, model as parent.
- Results stay isolated; only summary returns.
- Background by default; can use `isolation: "worktree"` for file-edit isolation.
- Invocation: `/fork <directive>` or auto-replace of general-purpose subagent.

## 10. Agent SDK relationship

- **Claude Agent SDK** (Python & TypeScript) is a separate runtime — NOT packageable as a Claude Code plugin.
- Plugins extend Claude Code; Agent SDK builds standalone agent apps that call the Claude API.
- They can coexist: an SDK app can shell out to the Claude Code CLI, or a plugin can shell out to an SDK app.

## 11. Where each platform is uniquely strong

### Claude Code

- 31 hook events; 5 handler types (`prompt` LLM-eval and `agent` are unique).
- Background monitors delivering stdout as notifications.
- `alwaysLoad` MCP eager-load toggle.
- Typed `userConfig` with directory/file pickers + `${user_config.KEY}` substitution.
- LSP servers, bin executables, channels, plugin dependencies.
- Remote Control + mobile push.
- Agent teams + forked subagents (experimental).

### Gemini CLI

- `BeforeModel`, `BeforeToolSelection` events Claude lacks.
- Built-in policy engine and themes.
- `${workspacePath}` variable.
- One-click install gallery.
- `migratedTo` repo-redirect.
- Per-extension `GEMINI.md` context files.

### Codex CLI

- Skills progressive disclosure with explicit token budget + fairness trimming.
- `agents/openai.yaml` branding metadata (display name, icon, brand colour).
- Profiles, sandbox modes, granular approval policy.
- Per-MCP `enabled_tools`/`disabled_tools` filters.
- OAuth credential store with multiple backends.
- `requirements.toml` enterprise lock.

## 12. ArcKit-specific implications

- Converter strategy is well-aligned: stripping `effort`, `keep-coding-instructions`, `handoffs`, `tools`/`disallowedTools`, `initialPrompt`, and rewriting `${user_config.KEY}` → `${KEY}` matches what Gemini and Codex actually accept.
- **Opportunity**: Gemini now supports `skills/` and Markdown+YAML subagents — the converter could emit ArcKit's 5 skills and 10 agents to `arckit-gemini/skills/` and `arckit-gemini/agents/` instead of inlining agent prompts.
- **Opportunity**: package `arckit-codex/` as a real Codex plugin (`.codex-plugin/plugin.json` + `marketplace.json`) for `/plugins install` parity; consider adding `agents/openai.yaml` per skill for branding.
- **Unportable to non-Claude**: `monitors` (stale-artifact-scan), `alwaysLoad`, `if:` hook scoping, typed `userConfig`, output styles, LSP, bin, channels, plugin dependencies — document as known gaps.
- **Not yet adopted**: agent teams + forked subagents (experimental); `${CLAUDE_PLUGIN_DATA}` for cached deps; `subagentStatusLine`.

---

## Sources

### Claude Code

- [Plugins overview](https://code.claude.com/docs/en/plugins.md)
- [Plugins reference](https://code.claude.com/docs/en/plugins-reference.md)
- [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugin dependencies](https://code.claude.com/docs/en/plugin-dependencies.md)
- [Skills](https://code.claude.com/docs/en/skills.md)
- [Subagents](https://code.claude.com/docs/en/sub-agents.md) / [Agents](https://code.claude.com/docs/en/agents.md)
- [Agent teams](https://code.claude.com/docs/en/agent-teams.md)
- [Hooks](https://code.claude.com/docs/en/hooks.md)
- [Output styles](https://code.claude.com/docs/en/output-styles.md)
- [Permission modes](https://code.claude.com/docs/en/permission-modes.md)
- [Memory](https://code.claude.com/docs/en/memory.md)
- [Statusline](https://code.claude.com/docs/en/statusline.md)
- [Remote control](https://code.claude.com/docs/en/remote-control.md)
- [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks.md)
- [Tools reference](https://code.claude.com/docs/en/tools-reference.md)

### Gemini CLI

- [Extensions overview](https://geminicli.com/docs/extensions/)
- [Extension reference](https://geminicli.com/docs/extensions/reference/)
- [Build extensions](https://geminicli.com/docs/extensions/writing-extensions/)
- [Custom commands (TOML)](https://geminicli.com/docs/cli/custom-commands/)
- [Subagents](https://geminicli.com/docs/core/subagents/)
- [Hooks reference](https://geminicli.com/docs/hooks/reference/) / [Writing hooks](https://geminicli.com/docs/hooks/writing-hooks/)
- [MCP servers](https://geminicli.com/docs/tools/mcp-server/)
- [Extensions gallery](https://geminicli.com/extensions/)
- [Issue #15535 — Markdown commands proposal](https://github.com/google-gemini/gemini-cli/issues/15535)

### Codex CLI

- [Agent skills](https://developers.openai.com/codex/skills)
- [Custom prompts (deprecated)](https://developers.openai.com/codex/custom-prompts)
- [Subagents](https://developers.openai.com/codex/subagents)
- [Hooks](https://developers.openai.com/codex/hooks)
- [MCP](https://developers.openai.com/codex/mcp)
- [Config reference](https://developers.openai.com/codex/config-reference)
- [Advanced config](https://developers.openai.com/codex/config-advanced)
- [Plugins](https://developers.openai.com/codex/plugins) / [Build plugins](https://developers.openai.com/codex/plugins/build)
- [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)
- [Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [Changelog](https://developers.openai.com/codex/changelog)
