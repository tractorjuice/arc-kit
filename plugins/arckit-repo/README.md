# ArcKit - Repository Plugin

Optional ArcKit plugin for repository-oriented commands. The first command generates and maintains source-grounded, agent-readable repository documentation; future commands can cover git and repository operations.

## Commands

- `/arckit:repo-docs` - generate or update `docs/repository/` using targeted repository discovery, git-history-aware incremental updates, source references, and strict secret avoidance.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-repo
```

Without `arckit` core, this plugin still provides the command prompt, but it will not be installed as part of the ArcKit marketplace dependency chain.

## Scope

**In scope (v1)**: repository quickstart, source architecture overview, development workflow, testing workflow, release/configuration overview, and future-agent operating guidance.

**Out of scope**: replacing `/arckit:pages`, replacing TOGAF `/arckit:architecture-repository`, or vendoring the OpenWiki CLI runtime.

## OpenWiki Relationship

This plugin adapts OpenWiki-style prompt patterns for ArcKit:

- targeted repository discovery
- source-grounded claims
- incremental updates from git history
- temporary planning files removed before completion
- secret, cache, local-memory, and generated-file safety rules

It does not add LangChain/deepagents dependencies, provider credential storage, or automatic edits to top-level agent instruction files.

## Maintainer

`[COMMUNITY]` - recruiting domain co-maintainer.
