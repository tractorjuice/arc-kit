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

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v4: First-Class Codex and Gemini Support](article-viewer.html?a=2026-03-08-v4-codex-gemini-support)
- [ArcKit v4.1.1: GitHub Copilot, Vendor Scoring, and Blast Radius](article-viewer.html?a=2026-03-11-v411-copilot-vendor-scoring-impact)
- [ArcKit v5.0.0: One Toolkit, Seven Plugins, Install Only What You Need](article-viewer.html?a=2026-05-18-arckit-v5-plugin-split)
- [The Token Budget Behind ArcKit's Plugin Split](article-viewer.html?a=2026-05-20-plugin-split-token-budget)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
