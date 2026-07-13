# Repository Documentation Wiki Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:repo-docs` generates and maintains an agent-readable source wiki for a repository. It is designed for implementation onboarding, future agent sessions, and safe change work.

The command ships in the optional `arckit-repo` plugin. It is inspired by OpenWiki's repository documentation workflow, but it runs as an ArcKit-native command instead of adding the OpenWiki CLI and provider configuration as dependencies.

---

## Quick Start

Install the optional repository plugin with the ArcKit core plugin:

```bash
claude plugin install arckit-repo
```

Create the first repository wiki:

```text
/arckit:repo-docs --init
```

Refresh existing repository docs after implementation changes:

```text
/arckit:repo-docs --update
```

Document one area only:

```text
/arckit:repo-docs document hooks and release flow only
```

Preview gaps without writing files:

```text
/arckit:repo-docs --check
```

---

## Output

The command writes repository documentation under `docs/repository/`.

| File | Purpose |
|---|---|
| `docs/repository/index.md` | Navigation, repository purpose, and source-of-truth map |
| `docs/repository/quickstart.md` | Onboarding path, first commands, and first files to read |
| `docs/repository/agent-guide.md` | Safe operating guidance for future agent sessions |
| `docs/repository/architecture/overview.md` | Directory map and source/generated boundaries |
| `docs/repository/workflows/development.md` | How to make common repository changes |
| `docs/repository/workflows/testing.md` | Focused test and validation guidance |
| `docs/repository/operations/release-and-configuration.md` | Release, version, and configuration overview |
| `docs/repository/.last-update.json` | Metadata used for later incremental refreshes |

Focused runs may update a smaller subset.

---

## How It Works

`/arckit:repo-docs` uses a targeted discovery process:

- reads the root README, changelog, agent instructions, and existing docs
- lists source files with `rg --files` or `find`
- prioritises canonical source files over generated outputs
- inspects git history for incremental updates
- cites local source references in each generated page
- avoids secrets, local memory, caches, dependency folders, and bulky generated trees

The command can create a temporary `docs/repository/_plan.md` while preparing a multi-page write, but removes it before finishing.

---

## Relationship to Other Commands

| Command | Scope | Output |
|---|---|---|
| `/arckit:repo-docs` | Source-code repository understanding | `docs/repository/*.md` |
| `/arckit:pages` | Static site for ArcKit artifacts and guides | `docs/index.html`, `docs/manifest.json`, `docs/llms.txt` |
| `/arckit:architecture-repository` | TOGAF-style governance repository | `ARC-000-REPO-v*.md` or project repository artifact |

Use `/arckit:repo-docs` when the question is "how does this repo work?" Use `/arckit:pages` when the question is "how do we publish ArcKit artifacts?" Use the TOGAF architecture repository when the question is "what reusable architecture knowledge has this organisation captured?"

---

## OpenWiki Compatibility

OpenWiki remains useful as an external tool when you want a standalone CLI with model/provider selection and scheduled GitHub Actions updates. ArcKit's command keeps the same core documentation discipline without adding:

- Node 20 CLI runtime requirements
- LangChain/deepagents dependencies
- provider credential setup in `~/.openwiki/.env`
- automatic edits to top-level `AGENTS.md` or `CLAUDE.md`

If you run OpenWiki directly, review generated changes before committing them and keep provider keys outside the repository.

---

## Review Checklist

- The docs explain source-of-truth files rather than generated mirrors.
- Every non-obvious claim has a local source reference.
- `docs/repository/_plan.md` is absent after the run.
- Secret, cache, memory, and dependency directories were not read or documented.
- `.last-update.json` reflects the latest successful write-mode run.
- The final summary lists changed pages and remaining gaps.

---

## References

| Reference | URL |
|---|---|
| OpenWiki repository | https://github.com/langchain-ai/openwiki |
| OpenWiki agent prompt | https://github.com/langchain-ai/openwiki/blob/main/src/agent/prompt.ts |
| OpenWiki license | https://github.com/langchain-ai/openwiki/blob/main/LICENSE |
| ArcKit custom command guide | custom-commands.md |
| ArcKit Pages guide | pages.md |
