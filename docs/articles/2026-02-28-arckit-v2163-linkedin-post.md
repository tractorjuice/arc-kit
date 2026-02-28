# ArcKit now recommends Claude Code v2.1.63+

If you're using ArcKit for enterprise architecture governance, update your Claude Code to v2.1.63 or later. Here's why it matters:

**Stable research agents** -- ArcKit's 5 autonomous research agents (AWS, Azure, GCP, market research, data discovery) run as subagents doing dozens of web searches and MCP calls. v2.1.63 fixes memory leaks in long-running subagent sessions, so your research commands complete reliably instead of degrading over time.

**Reliable MCP servers** -- ArcKit bundles 4 MCP servers for cloud provider documentation. Cache leak fixes on reconnect mean your `/arckit:aws-research` and `/arckit:azure-research` commands stay responsive across sessions.

**Clean skill caching** -- After running `/clear`, ArcKit's Wardley Mapping and Mermaid Syntax skills now reload fresh instead of serving stale content.

**Worktree support** -- Working across multiple architecture projects? Your plugin config and memory now share correctly across git worktrees.

**Auto memory across sessions** -- Claude Code now remembers what it learns about your architecture projects between sessions. It automatically records project patterns, debugging insights, key file locations, and your workflow preferences to a persistent MEMORY.md file. For ArcKit users, this means Claude remembers your project structure, naming conventions, and which artifacts you've already generated -- no more re-explaining context every time you start a new session. Detailed notes are organised into topic files (e.g., `debugging.md`, `patterns.md`) that Claude loads on demand, keeping startup fast while retaining deep project knowledge.

**Interactive decision-making with AskUserQuestion** -- Claude Code's AskUserQuestion tool transforms one-way AI interactions into structured, multi-step guided experiences. Instead of generating architecture artifacts based on assumptions, ArcKit commands can now present you with clear options -- multiple-choice questions with descriptions, trade-off context, and recommended defaults. Multi-select support means you can choose several options at once (e.g., selecting which compliance frameworks apply to your project). The result: fewer revision cycles and architecture documents that match your intent first time.

Seven reasons to update. One command to do it.

`/plugin marketplace add tractorjuice/arc-kit`

#EnterpriseArchitecture #ClaudeCode #ArcKit #AIGovernance #ArchitectureAsCode
