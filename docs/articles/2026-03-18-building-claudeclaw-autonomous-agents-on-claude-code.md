# Building ClaudeClaw: An OpenClaw-Style Autonomous Agent System on Claude Code

*How Claude Code's recent features map to the architecture that made OpenClaw the fastest-growing open-source project of 2026, and where the gaps still are.*

*Updated March 20, 2026: Revised for Claude Code v2.1.80, which shipped native messaging channels for Telegram and Discord — directly addressing the platform bridge layer discussed in the original article.*

---

OpenClaw hit 247k GitHub stars in under four months. That trajectory tells you something important: developers want local-first, LLM-powered agents that reach into their real tools (Slack, email, calendars, git repos) and act on their behalf. The architecture Peter Steinberger shipped is deceptively simple: a local Gateway that routes messages between chat platforms and an LLM, a skills system for extensibility, and a thin event bus that ties it all together.

If you're already embedded in the Claude ecosystem (using Claude Code daily, building plugins, running subagents) you might be wondering: how much of OpenClaw's architecture can you replicate with Claude Code's native building blocks? The answer, as of v2.1.80, is "most of it — and the last mile is closing fast." But the interesting part isn't what maps cleanly. It's where the abstractions diverge, and what that means for the system you'd actually build.

This article walks through the architecture layer by layer.

---

## The OpenClaw Architecture in 60 Seconds

OpenClaw's architecture has four layers:

![OpenClaw Architecture](diagrams/openclaw-arch.png)

**Gateway**: A local process that acts as the single control plane. It manages sessions (one per conversation thread), routes inbound messages from any connected platform to the LLM, and dispatches responses back. It also manages the tool registry and event lifecycle.

**Skills**: Directories containing a `SKILL.md` with metadata and instructions. The LLM reads these to understand what tools are available and how to use them. Skills can declare dependencies, required permissions, and tool configurations.

**Multi-channel inbox**: The signature feature. One agent instance handles messages from WhatsApp, Telegram, Slack, Discord, and 20+ other platforms simultaneously. Each channel maps to a session, so context is preserved per conversation.

**Event bus**: Internal pub/sub for lifecycle events (message received, tool invoked, task completed, error). Plugins subscribe to events to extend behavior.

The critical insight: OpenClaw itself doesn't do the "thinking." It's plumbing. The intelligence comes from the LLM backend. OpenClaw's value is in the session management, platform bridging, and the skill/tool registry that makes the LLM useful in context.

---

## Claude Code's Feature Stack (v2.1.80)

Before we map architectures, here's what Claude Code gives you natively as of March 2026. If you've been building plugins but haven't tracked the changelog closely, some of these might surprise you.

### Agent Execution Model

Claude Code agents are processes. A main session runs in your terminal. Subagents spawn via the `Agent` tool (or `Task` tool for background execution). Each subagent gets its own context window, its own tool set, and optionally its own git worktree.
Agent frontmatter (the YAML block at the top of an agent `.md` file) now supports:

```yaml
---
name: my-agent
description: What this agent does
model: sonnet          # opus, sonnet, haiku, or full model ID
effort: medium         # low | medium | high
maxTurns: 25           # cap autonomous execution
disallowedTools: [Bash, Write]  # restrict capabilities
isolation: worktree    # each invocation gets its own git copy
background: true       # always run as a background task
memory: project        # persistent memory (user | project | local)
---
```

`maxTurns` (v2.1.78) is the big one for autonomous operation. Without it, a runaway agent can burn through your token budget. With it, you get deterministic upper bounds on execution cost.

`disallowedTools` (v2.1.78) gives you least-privilege per agent. A research agent that should only read the web? Block `Bash`, `Write`, `Edit`. A code-writing agent that shouldn't touch the network? Block `WebSearch`, `WebFetch`.

`isolation: worktree` (v2.1.49) means each agent invocation gets a fresh git worktree, its own copy of the repo on a temporary branch. The agent can make destructive changes without affecting your working tree. When it's done, you merge or discard.

### Hook System

Hooks are shell commands (or HTTP endpoints) that fire on lifecycle events. They're the closest thing Claude Code has to an event bus.

**Available hook events as of v2.1.80:**

The session lifecycle hooks fire at the boundaries: `SessionStart` when a session begins (useful for environment setup and logging init) and `SessionEnd` when it ends (cleanup, metrics flush). The `Setup` event fires when Claude Code is invoked with `--init` or `--maintenance`, enabling repo bootstrap workflows.

For tool execution, `PreToolUse` fires before any tool runs, giving you a chance to validate, inject context, or block the call entirely. `PostToolUse` fires after execution completes, enabling auditing and side effects.

The completion hooks are where orchestration lives. `Stop` fires when an agent turn completes normally, useful for notifications and chaining. `StopFailure` (v2.1.78) fires when a turn ends due to an API error like a rate limit or auth failure, enabling automatic retry and fallback logic. `SubagentStop` fires when any subagent completes, which is the hook you need for pipeline orchestration.

For multi-agent coordination, `TeammateIdle` fires when a team agent has no work (load balancing) and `TaskCompleted` fires when a background task finishes (pipeline advancement). `WorktreeCreate` and `WorktreeRemove` fire on worktree lifecycle events, enabling custom VCS setup and teardown.

Four more round out the set: `InstructionsLoaded` fires when CLAUDE.md is loaded (instruction augmentation), `ConfigChange` fires when settings files are modified (security auditing), `PostCompact` fires after context compaction (state preservation), and `Elicitation` fires when an MCP server requests structured input (UI bridging).

The HTTP hook variant (v2.1.63) is particularly interesting. Instead of running a shell command, you POST JSON to a URL:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "http",
        "url": "http://localhost:8080/events",
        "timeout": 5000
      }
    ]
  }
}
```

This means you can build an external event router that reacts to everything Claude Code does (tool invocations, completions, errors) without modifying Claude Code itself.

`PreToolUse` hooks can return `additionalContext` (v2.1.9), injecting information into the model's context before a tool runs. And they can return `"deny"` to block tool execution entirely. This is your policy enforcement layer.

### Remote Control and Programmatic Access

Claude Code offers two distinct paths for programmatic access, and understanding the difference is critical for a ClaudeClaw architecture.

**Remote Control** (v2.1.51) is designed for cross-device access to a local Claude Code session. It does not expose a local HTTP API. Instead, it works as an outbound relay: your local Claude Code process makes outbound HTTPS connections to Anthropic's servers, which act as a message router between your machine and remote devices (browser, mobile app, another terminal). No inbound ports are opened on your machine.

```bash
claude remote-control --name "my-agent-session"
```

When you run this, Claude Code registers with the Anthropic API over HTTPS, generates a session URL (and QR code), and begins polling for incoming messages. Remote devices connect to that URL via claude.ai/code or the Claude mobile app. Messages from remote devices are relayed through Anthropic's servers to your local session, and responses stream back in real-time over the same connection. If your machine sleeps or your network drops, the session automatically reconnects when it comes back.

Server mode supports concurrent sessions with `--spawn worktree` (each session gets its own git worktree) or `--spawn same-dir` (shared working directory), capped by `--capacity N` (default 32).

The key constraint: Remote Control requires claude.ai authentication, not API keys. It's designed for human-to-session interaction relayed through Anthropic's infrastructure, not for direct machine-to-machine communication.

**Headless mode** (`claude -p`) is what you'd actually use for a ClaudeClaw Gateway. It runs Claude Code non-interactively as a CLI subprocess, accepts a prompt via argument or stdin, and returns the result to stdout:

```bash
# Single prompt, JSON output
claude -p "Analyze this PR" --output-format json

# Resume a previous session
claude -p "Now fix the issues" --resume "$SESSION_ID" --output-format json

# Stream results as newline-delimited JSON
claude -p "Review the code" --output-format stream-json

# Restrict available tools
claude -p "Check the deploy" --allowedTools "Bash,Read,WebFetch"
```

Headless mode gives you full control: structured JSON output, session resumption via `--resume SESSION_ID`, tool allow-listing via `--allowedTools`, and streaming via `stream-json` output format. Your Gateway spawns `claude -p` processes, feeds them prompts from messaging platforms, parses the JSON responses, and routes them back. No Anthropic relay, no cloud dependency beyond the API itself, no authentication constraints beyond a standard API key.

**The Claude Agent SDK** (Python and TypeScript) provides a third option with higher-level abstractions for building multi-turn programmatic workflows. It wraps the same underlying API but adds conversation management, tool orchestration, and structured output handling as library features rather than CLI flags.

For a ClaudeClaw system, the architecture stacks these three layers: headless mode (`claude -p`) for the core Gateway-to-LLM bridge, Remote Control for optional human-in-the-loop access from mobile or browser, and the Agent SDK for any orchestration logic you want to write in code rather than markdown agents.

### Task Management

The Task system (redesigned in v2.1.16, refined through v2.1.30) gives you four things that matter for orchestration. First, dependency tracking: Task B can declare that it waits for Task A to complete before starting. Second, background execution: tasks run while the main session continues, so the orchestrator isn't blocked. Third, metrics: each completed task reports its token count, tool uses, and duration, giving you cost observability. Fourth, lifecycle hooks: the `TaskCompleted` event fires when any background task finishes, which is how you chain pipeline stages.

Put these together and a multi-step pipeline (research → analyze → draft → review) becomes a dependency graph of tasks, each running in the background with measurable resource consumption.

### Agent Teams (Experimental)

Enabled with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, Agent Teams (v2.1.32) introduce a leader/teammate model. A **leader** agent coordinates work and dispatches to **teammates**, each of which runs in its own process (optionally in tmux). Teammates communicate with the leader and each other via `SendMessage({to: agentId})`, and they inherit the leader's model by default (v2.1.45). The `TeammateIdle` and `TaskCompleted` hooks enable reactive orchestration, so the leader can reassign work when a teammate finishes or goes idle.

This is the most direct equivalent to OpenClaw's multi-agent pipeline architecture.

### Memory System

Auto-memory (v2.1.32) lets Claude automatically persist useful context across sessions. The `/memory` command manages it. Agents can declare a `memory` scope in frontmatter with three options: `user` for personal preferences that span projects, `project` for project-specific context shared across sessions, and `local` for machine-specific state that isn't committed to git.

Memory files include last-modified timestamps (v2.1.75) so Claude can reason about freshness. Memory directories are shared across git worktrees of the same repo (v2.1.63).

### Scheduling

`/loop` (v2.1.71) runs a prompt or slash command on a recurring interval:

```
/loop 5m check if the deploy succeeded
/loop 10m /my-custom-monitoring-command
```

Combined with cron scheduling tools, this enables always-on monitoring patterns like "check my email every 5 minutes and flag anything urgent," which is exactly the kind of workflow that OpenClaw users love.

### Channels (Research Preview)

This is the feature that changes the ClaudeClaw architecture most dramatically. Channels (v2.1.80) let MCP servers push messages *into* a running Claude Code session. Instead of Claude Code only reacting to your terminal input, external platforms can send events that Claude reads and responds to — bidirectionally.

```bash
# Start Claude Code with Telegram and Discord channels enabled
claude --channels plugin:telegram@claude-plugins-official plugin:discord@claude-plugins-official
```

When a message arrives from Telegram or Discord, it appears in your session as a `<channel source="telegram">` event. Claude reads it, does whatever work is needed (searches code, runs commands, reads files), and calls the channel's `reply` tool to send the response back to the originating platform. You see the inbound message and the tool call in your terminal, but the reply text itself appears on the other platform.

**How channels work**:

1. A channel is an MCP server that implements the channels protocol
2. You install it as a plugin (`/plugin install telegram@claude-plugins-official`)
3. You configure credentials (`/telegram:configure <bot-token>`)
4. You pair your account (send a message to the bot, get a pairing code, approve it in Claude Code)
5. You enable it per-session with `--channels`

**Security model**: Every channel maintains a sender allowlist. Only paired sender IDs can push messages; everyone else is silently dropped. The `--channels` flag is opt-in per session — being in `.mcp.json` alone isn't enough to push messages. Team and Enterprise organizations must explicitly enable channels via the `channelsEnabled` managed setting.

**Supported platforms in the research preview**: Telegram and Discord ship as first-party plugins in `claude-plugins-official`. A `fakechat` demo plugin runs a localhost chat UI for testing. For anything else, you can build your own channel using the channels reference API.

**The key constraint**: Events only arrive while the session is open. For an always-on setup, you run Claude Code in a background process or persistent terminal. This is where the Gateway pattern (covered below) still has a role to play.

Channels are the single biggest step toward native OpenClaw-style multi-channel messaging. Two platforms today, but the protocol is open and the plugin architecture means community channels are inevitable.

---

## Architecture Mapping: OpenClaw → ClaudeClaw

Here's how each OpenClaw layer maps to Claude Code features, and where you need to build bridging infrastructure.

### Layer 1: The Gateway

**OpenClaw**: A standalone local process (Node.js) that manages sessions, routes messages, and maintains the tool registry. It speaks to messaging platforms via adapters and to the LLM via API.

**ClaudeClaw**: Headless mode (`claude -p`) is your programmatic bridge. HTTP hooks are your outbound event stream. The Gateway orchestrates both.

![ClaudeClaw Gateway Architecture](diagrams/claudeclaw-gateway.png)

The Gateway is custom code — though its scope shrinks with every channel plugin Anthropic or the community ships. For platforms with native channel support (Telegram, Discord as of v2.1.80), the Gateway is optional: channels handle the full message lifecycle. For everything else, the Gateway's responsibilities are:

1. **Session mapping**: Each messaging channel/thread maps to a Claude Code session. The Gateway spawns `claude -p` processes in headless mode and tracks which channel ID corresponds to which session ID. For ongoing conversations, it uses `--resume SESSION_ID` to maintain context.
2. **Message routing**: Inbound messages from platform adapters get dispatched to the appropriate `claude -p` process. The process returns structured JSON (via `--output-format json` or `stream-json` for streaming). The Gateway parses the response and routes it back through the channel adapter to the originating platform.
3. **Session lifecycle**: Spin up a new `claude -p` process on first message from a channel. Resume with `--resume` on subsequent messages. The Gateway stores session IDs in a local database (SQLite is fine) so conversations persist across Gateway restarts.
4. **Tool governance**: The Gateway can pass `--allowedTools` per channel to restrict what each session can do. A Slack channel for code review might allow `Read` and `Grep` but block `Bash` and `Write`. A deployment channel might allow `Bash` but block `Edit`.

The Gateway is intentionally thin. It doesn't interpret messages or make decisions. It's pure plumbing, following the same design philosophy as OpenClaw's Gateway.

For optional human-in-the-loop access, the Gateway can also start sessions with `--remote-control`, which lets a human connect from a browser or phone via claude.ai/code and take over or observe the conversation. This is useful for escalation: the agent handles routine requests in headless mode, but when it encounters something it can't resolve, the Gateway upgrades the session to Remote Control mode and notifies a human to connect.

### Layer 2: Skills

**OpenClaw**: `SKILL.md` files in directories. Each skill declares metadata, instructions, and tool requirements.

**ClaudeClaw**: This maps 1:1. Claude Code's skill system uses the same `SKILL.md` convention. Skills live in `.claude/skills/` (project-level), `~/.claude/skills/` (user-level), or inside plugins. Each skill is a directory containing a `SKILL.md` file with metadata and instructions. So `.claude/skills/email-triage/SKILL.md`, `.claude/skills/calendar-manage/SKILL.md`, `.claude/skills/code-review/SKILL.md`, and `.claude/skills/deploy-monitor/SKILL.md` would each define a distinct capability.

Skill frontmatter supports `allowed-tools` for scoped permissions, and `${CLAUDE_SKILL_DIR}` (v2.1.69) lets skills reference files relative to their own directory.

Skills auto-discover from nested directories (v2.1.6), so you can organize them hierarchically. And since v2.1.32, skills in `--add-dir` directories load automatically.

**Key difference from OpenClaw**: In OpenClaw, skills can declare hard dependencies on external tools (e.g., "this skill requires the `gh` CLI"). In Claude Code, this is handled by `PreToolUse` hooks that validate tool availability before execution, or by the skill instructions themselves telling Claude to check prerequisites.

### Layer 3: Multi-Agent Orchestration

**OpenClaw**: Multi-agent pipelines where specialized agents hand off to each other. A research agent finds information, a writer agent drafts content, a reviewer agent checks quality.

**ClaudeClaw**: Agent Teams + Task dependency tracking.

```yaml
# .claude/agents/orchestrator.md
---
name: claudeclaw-orchestrator
description: Coordinates multi-agent workflows
model: sonnet
effort: medium
maxTurns: 50
---

You are the ClaudeClaw orchestrator. When a task arrives:

1. Classify the task (research, code, communication, monitoring)
2. Dispatch to the appropriate specialist agent
3. Monitor progress via TaskCompleted events
4. Chain results to downstream agents
5. Return the final result to the user

Available specialist agents:
- research-agent: Web research, document analysis
- code-agent: Code generation, review, refactoring
- comms-agent: Draft emails, Slack messages, responses
- monitor-agent: Check deployments, services, alerts
```

Each specialist agent runs with constrained capabilities:

```yaml
# .claude/agents/research-agent.md
---
name: research-agent
model: sonnet
effort: high
maxTurns: 30
disallowedTools: [Bash, Write, Edit]
isolation: worktree
background: true
memory: project
---
```

The orchestrator dispatches via the `Agent` tool. Each specialist runs in the background. `TaskCompleted` hooks notify the orchestrator when a specialist finishes. The orchestrator reads the result and decides what to do next.

This is roughly equivalent to OpenClaw's pipeline system, but with stronger isolation guarantees (worktrees) and native resource controls (`maxTurns`, `disallowedTools`).

### Layer 4: The Event Bus

**OpenClaw**: Internal pub/sub. Plugins subscribe to events like `message.received`, `tool.invoked`, `task.completed`.

**ClaudeClaw**: HTTP hooks are your event bus. Every Claude Code lifecycle event can POST to your Gateway's event router:

```json
{
  "hooks": {
    "Stop": [{
      "type": "http",
      "url": "http://localhost:9090/events/stop"
    }],
    "StopFailure": [{
      "type": "http",
      "url": "http://localhost:9090/events/error"
    }],
    "TaskCompleted": [{
      "type": "http",
      "url": "http://localhost:9090/events/task-done"
    }],
    "SubagentStop": [{
      "type": "http",
      "url": "http://localhost:9090/events/agent-done"
    }],
    "PostToolUse": [{
      "type": "http",
      "url": "http://localhost:9090/events/tool-used",
      "timeout": 3000
    }]
  }
}
```

The Gateway's event router receives these POSTs and can forward results to messaging platform channels, trigger downstream workflows, update a monitoring dashboard, or log to an observability stack.

**Limitation vs OpenClaw**: Claude Code's HTTP hooks are fire-and-forget. There's no built-in retry, backpressure, or dead-letter queue. If your event router is down when a hook fires, the event is lost. For production use, you'd want the Gateway to write events to a local queue (SQLite, Redis) before processing.

### Layer 5: Messaging Platform Bridges

**OpenClaw**: Native adapters for 25+ platforms. This is years of community contribution.

**ClaudeClaw**: For Telegram and Discord, this layer is now **zero custom code**. For everything else, you build adapters or wait for community channel plugins.

The channels feature (v2.1.80) fundamentally changes this layer. Before channels, every platform bridge required a custom adapter: a small service (50-200 lines) that listens for inbound messages, normalizes them, forwards to the Gateway, receives responses, and sends them back. That pattern still applies for platforms without a channel plugin. But for Telegram and Discord, the entire adapter is a first-party plugin:

```bash
# Install, configure, and run — no custom code
/plugin install telegram@claude-plugins-official
/telegram:configure <bot-token>
claude --channels plugin:telegram@claude-plugins-official
```

The channel handles the full lifecycle: listening for messages, routing them into the Claude Code session, and sending replies back to the platform. The sender allowlist handles authorization. No Gateway needed.

**For platforms without channel plugins**, the adapter pattern still applies. **Slack** bridges via a Bolt.js app or the official Slack MCP server. **WhatsApp** connects through the WhatsApp Business API. **Microsoft Teams** goes through the Bot Framework. **Email** uses an IMAP listener. **GitHub** fires webhooks for issues, PRs, and reviews. **Web Chat** connects via a WebSocket server. These still flow through a Gateway to `claude -p` processes.

Each custom adapter is a small service, typically 50 to 200 lines, that does five things: listens for inbound messages on the platform, normalizes them to a common format (`{channel_id, user_id, text, attachments}`), forwards to the Gateway, receives responses from the Gateway, then formats and sends the response back to the platform.

**The trajectory is clear**: channels ship as plugins, and the plugin marketplace is community-extensible. Expect Slack, Teams, and WhatsApp channel plugins to appear in the coming months, either from Anthropic or the community. Each one that ships eliminates another custom adapter from your ClaudeClaw architecture.

The hybrid approach works well during this transition: use native channels for Telegram/Discord, custom adapters via the Gateway for everything else. As channel plugins mature and cover more platforms, the Gateway's role in message routing shrinks toward zero.

---

## What ClaudeClaw Gets That OpenClaw Doesn't

Building on Claude Code gives you some things that OpenClaw has to bolt on:

### Native Code Execution

OpenClaw's agents can invoke tools, but "write code and run it" requires external sandboxes or Docker containers. Claude Code has native, sandboxed Bash execution with filesystem isolation, auto-approval for safe commands, and compound command parsing. Your ClaudeClaw agent can write a script, execute it, read the output, and iterate, all within the same turn.

### Git-Native Workflows

Worktree isolation means each agent invocation can safely branch, commit, and modify code without affecting the working tree. OpenClaw treats git as just another tool. Claude Code treats it as a first-class capability with built-in safety rails (no force-push without confirmation, branch protection awareness, PR status indicators).

### Deep IDE Integration

Claude Code runs inside VS Code with native session management, plan markdown views, and MCP server dialogs. An OpenClaw bot is a chat window. A ClaudeClaw agent is embedded in your development environment.

### Structured Agent Governance

`maxTurns`, `disallowedTools`, `effort`, and managed policy hierarchies give you fine-grained control over what agents can do, how long they run, and how deeply they reason. OpenClaw's permission model is coarser: you grant access to tools or you don't.

### Native Messaging Channels (v2.1.80)

Channels let external platforms push messages directly into Claude Code sessions — no custom adapter code needed for supported platforms. Install a Telegram or Discord plugin, pair your account, and Claude Code becomes a bidirectional chat agent on that platform. OpenClaw requires platform-specific adapter code for every integration; Claude Code's channel plugins are zero-code, install-and-configure. The sender allowlist model also provides security out of the box: only paired accounts can push messages, and enterprise organizations can disable channels entirely via managed settings.

---

## What's Still Missing

Honest assessment of the gaps:

### No Persistent Daemon Mode

Claude Code sessions are ephemeral. When the terminal closes, the session ends. You can `--resume`, but there's no systemd-style always-on daemon. OpenClaw's Gateway runs as a persistent background service. The channels documentation acknowledges this directly: "Events only arrive while the session is open, so for an always-on setup you run Claude in a background process or persistent terminal."

**Workaround**: The Gateway is the daemon. It runs as a persistent service (systemd, Docker, pm2) and spawns `claude -p` processes on demand. For long-lived conversations, it stores session IDs and resumes them with `--resume`. The Gateway manages the process pool; Claude Code sessions are stateless workers it spins up and tears down. For channel-based setups without a Gateway, running Claude Code in a persistent terminal (tmux, screen) or as a background process achieves the same effect.

### Limited Multi-Channel Routing

~~Claude Code has no concept of external channel identity.~~ This gap partially closed in v2.1.80. Channels give Claude Code native awareness of external messaging platforms, with per-sender allowlists and bidirectional routing for Telegram and Discord.

**What's solved**: For supported platforms, Claude Code natively understands "this message came from Telegram user X" and routes replies back to the right place. No custom routing logic needed.

**What's still missing**: Cross-platform session unification ("this Slack thread maps to this Telegram conversation") and coverage beyond Telegram and Discord. OpenClaw supports 25+ platforms natively; Claude Code supports 2 in research preview.

**Workaround for unsupported platforms**: The Gateway maintains a `channel_id → session_id` mapping in a local database. Each unique channel gets its own Claude Code session via headless mode. The Gateway handles the routing for platforms that don't have channel plugins yet.

### Agent Teams Are Experimental

`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is a research preview. The API surface may change. Memory leaks in long-running team sessions have been fixed but the feature isn't GA.

**Workaround**: For production, use Task-based orchestration (stable since v2.1.16) instead of the Teams API. Less elegant, but battle-tested.

### No Built-In Event Persistence

HTTP hooks don't guarantee delivery. If your event receiver is down, events are lost.

**Workaround**: Gateway writes all events to a local append-only log (SQLite WAL or simple JSONL file) before processing. Replay from the log on restart.

### No Web Dashboard

OpenClaw has community dashboards like [openclaw-mission-control](https://github.com/abhi1693/openclaw-mission-control). Claude Code's monitoring is terminal-based.

**Workaround**: Your Gateway's event router can feed a simple web UI. The `PostToolUse` and `TaskCompleted` hooks give you enough telemetry for a basic dashboard.

### Token Cost Management

OpenClaw supports local models (LLaMA, DeepSeek) for low-cost tasks. Claude Code requires Claude API access. Running 10 persistent agent sessions with Opus 4.6 at high effort will burn through tokens fast.

**Workaround**: Use the `model` and `effort` frontmatter aggressively. Haiku for triage and classification. Sonnet at medium effort for routine tasks. Opus at high effort only for complex reasoning. `maxTurns` prevents runaway costs.

---

## A Minimal ClaudeClaw: What You'd Build

If you wanted a working prototype, here's the minimum viable architecture:

![Minimal ClaudeClaw Project Structure](diagrams/claudeclaw-project.png)

With native channels for Telegram and Discord, the Gateway is only needed for unsupported platforms. If your messaging needs are covered by channel plugins, the Gateway is optional — the entire system reduces to Claude Code configuration files: agent markdown, skill markdown, channel credentials, and a `settings.json`. If you need Slack, Teams, or other platforms without channel plugins, the Gateway is ~500 lines of TypeScript on top of that.

Either way, the agents are markdown files with YAML frontmatter. The skills are markdown files. The channels are plugin configurations. The intelligence is in the model. The code is just plumbing — and with channels, there's less plumbing than ever.

---

## When to Use ClaudeClaw vs OpenClaw

**Use OpenClaw** when you need 25+ messaging platform support out of the box, when you want model-agnostic operation across GPT, DeepSeek, and local models, when you're building for non-developers who want a chat-first interface, or when you need the mature community ecosystem that comes with 247k stars worth of plugins.

**Use ClaudeClaw** when your workflows are code-centric (PRs, deployments, code review), when you want deep IDE integration via VS Code embedded sessions, when you need git-native isolation with worktrees per agent, when you're already in the Claude/Anthropic ecosystem, when you want fine-grained agent governance through maxTurns, disallowedTools, and effort levels, when your primary messaging platforms are Telegram or Discord (native channels, zero adapter code), or when your team builds Claude Code plugins and wants to extend them into autonomous workflows.

**Use both** in a hybrid configuration where OpenClaw provides breadth (adapters for the 20+ platforms Claude Code doesn't have channel plugins for yet), Claude Code provides depth (native code execution, git workflows, agent governance), and channel plugins handle the platforms they support natively without routing through OpenClaw.

This hybrid is arguably the most powerful configuration. As Claude Code's channel ecosystem grows, the boundary shifts: each new channel plugin removes one platform from OpenClaw's responsibilities. Today, OpenClaw covers the long tail of messaging platforms while Claude Code handles Telegram, Discord, and everything code-centric. The trend line suggests that boundary will keep moving.

---

## The Bigger Picture

OpenClaw proved that autonomous AI agents are a mainstream product category, not a research curiosity. The trajectory from Steinberger's solo project to Nvidia's NemoClaw fork to Chinese government security advisories, all in four months, shows how fast this space is moving.

Claude Code's recent changelog reads like a checklist of features you'd need to build exactly this kind of system: agent teams, lifecycle hooks, background execution, resource governance, worktree isolation, persistent memory, scheduling, remote control. Anthropic clearly sees the same trajectory.

The question used to be whether Anthropic would ship native messaging integration before the community built it with duct tape and HTTP hooks. With channels landing in v2.1.80 — two days after the original version of this article — the answer is: they already started. Telegram and Discord are native. The channel protocol is open. The plugin marketplace is community-extensible.

The remaining question is pace. Two platforms in research preview is a start, not a finish. But given that the v2.1.x changelog has shipped agent teams, lifecycle hooks, background execution, resource governance, worktree isolation, persistent memory, scheduling, remote control, *and* messaging channels in the span of a few months, the trajectory speaks for itself.

---

*March 2026. All Claude Code version numbers reference the public changelog at code.claude.com/docs/en/changelog. Channels documentation at code.claude.com/docs/en/channels.*

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v4.13.0: The Build Harness — A Full Architecture in One Session](article-viewer.html?a=2026-05-03-build-harness-parallel-architecture-generation)
- [The Token Budget Behind ArcKit's Plugin Split](article-viewer.html?a=2026-05-20-plugin-split-token-budget)
- [Wanted: /arckit:build Recipes for Your Jurisdiction](article-viewer.html?a=2026-05-03-community-recipes-wanted)
- [ArcKit v4: First-Class Codex and Gemini Support](article-viewer.html?a=2026-03-08-v4-codex-gemini-support)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
