# ArcKit - Repository Plugin

Optional ArcKit plugin for repository-oriented commands: source-grounded documentation of a repository, and governance auditing of one.

## Commands

- `/arckit:repo-docs` - generate or update `docs/repository/` using targeted repository discovery, git-history-aware incremental updates, source references, and strict secret avoidance.
- `/arckit:repo-audit` - audit a codebase (local path, or a public GitHub/GitLab URL) against architecture principles and requirements. Writes a `CDAU` artefact to `projects/{PID}-{name}/audits/`, with findings graded by severity and confidence, and undocumented decisions emitted as ready-to-file ADR stubs.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-repo
```

Without `arckit` core, this plugin still provides the command prompt, but it will not be installed as part of the ArcKit marketplace dependency chain.

## Scope

**In scope**: repository quickstart, source architecture overview, development workflow, testing workflow, release/configuration overview, future-agent operating guidance, and codebase auditing against ArcKit governance artefacts.

**Deliberately out of bounds for `/arckit:repo-audit`**: executing any code from the audited repository (no install, build, or test run - it is static reading only), writing into the audited repository, writing a discovered secret's value into a report, and private repositories (clone locally and audit the path).

**Out of scope**: replacing `/arckit:pages`, replacing TOGAF `/arckit:architecture-repository`, replacing `/arckit:conformance` (which stays artefact-to-artefact), vendoring the OpenWiki CLI runtime, or language-specific deep static analysis. `/arckit:repo-audit` is an architecture-level audit, not a linter or SAST tool.

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
