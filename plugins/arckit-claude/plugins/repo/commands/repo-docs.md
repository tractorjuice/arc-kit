---
description: Generate and maintain agent-readable repository documentation from source, docs, and git history
argument-hint: "<mode or focus, e.g. '--init', '--update', 'document hooks and release flow'>"
tags: [repo-docs, documentation, source-wiki, agents, onboarding]
effort: max
keep-coding-instructions: true
handoffs:
  - command: pages
    description: Publish generated repository docs alongside ArcKit guides and artifacts
  - command: search
    description: Find related ArcKit artifacts, guides, and source references
---

# Repository Documentation Wiki

Create or update an agent-readable source wiki for this repository. The output is a compact, source-grounded documentation set that helps humans and future agents understand how the repository is structured, how to change it safely, and where key behavior lives.

This command adapts the strongest OpenWiki prompt patterns to ArcKit's plugin-first workflow: targeted repository discovery, source references, incremental updates from git history, temporary planning, and strict secret avoidance.

## User Input

```text
$ARGUMENTS
```

## Operating Modes

Infer the mode from `$ARGUMENTS`.

| Mode | Trigger | Behavior |
|---|---|---|
| Init | `--init`, no existing docs, or no mode specified | Create the first useful repository wiki under `docs/repository/`. |
| Update | `--update`, existing docs, or request to refresh | Inspect recent changes and update only stale or affected pages. |
| Focused | Any named area, path, workflow, or concern | Document or refresh only the requested scope while preserving the rest. |
| Check | `--check` or `--dry-run` | Report gaps and proposed edits without writing files. |

## Output Location

Write repository documentation under `docs/repository/`.

Required files for a full init:

```text
docs/repository/
|-- index.md
|-- quickstart.md
|-- agent-guide.md
|-- architecture/
|   `-- overview.md
|-- workflows/
|   |-- development.md
|   `-- testing.md
|-- operations/
|   `-- release-and-configuration.md
`-- .last-update.json
```

For focused runs, write the smallest useful subset. `index.md` and `quickstart.md` should exist after any write-mode run unless the user explicitly asked for a single file.

## Repository Discovery

Start with targeted discovery. Do not exhaustively read the whole repository.

1. Read the root `README.md`, `AGENTS.md`, `CHANGELOG.md`, relevant package or build manifests, and existing docs under `docs/` and `docs/repository/`.
2. List candidate source files with `rg --files` when available. If `rg` is unavailable, use `find`.
3. Exclude generated, vendor, cache, secret, and bulky directories:
   - `.git/`
   - `.arckit/memory/`
   - `.codex/`
   - `.claude/`
   - `.venv/`
   - `node_modules/`
   - `dist/`
   - `build/`
   - `coverage/`
   - `extensions/*/node_modules/`
4. Prioritize files that define behavior over files that mirror generated output:
   - command sources
   - hooks
   - scripts
   - tests
   - configuration
   - release tooling
   - templates
5. Read enough implementation to verify claims. Every non-obvious claim in the docs should be traceable to a source file, existing doc, test, or git commit.

## Incremental Update Process

When updating existing docs:

1. Read `docs/repository/.last-update.json` if it exists.
2. Use git history to identify changes since the last successful update:

```bash
git log --oneline --name-only <lastCommit>..HEAD
```

3. If no metadata exists, compare current docs against the current repository shape and inspect recent commits:

```bash
git log --oneline --name-only -20
```

4. Update affected pages surgically. Do not rewrite stable pages just to change wording.
5. Preserve user-authored sections unless they are directly stale, and explain any substantial replacement in the final summary.
6. After a successful write-mode run, update `.last-update.json` with:

```json
{
  "updatedAt": "ISO-8601 timestamp",
  "commit": "current HEAD SHA",
  "mode": "init|update|focused",
  "scope": "short scope summary",
  "pages": ["docs/repository/quickstart.md"]
}
```

## Planning Discipline

For write-mode runs, create a short temporary plan at `docs/repository/_plan.md` only if the change spans more than two pages.

The plan should include:

- target pages
- source files to inspect
- expected edits
- known gaps

Delete `docs/repository/_plan.md` before finishing. Do not leave planning scratch files in the repository.

## Documentation Standards

Each generated or updated page must:

- start with a clear H1
- explain what the reader can do next
- include concrete paths and commands
- cite local source references using repo-relative paths
- distinguish verified facts from inferred guidance
- avoid repeating large chunks of source code
- avoid marketing language
- avoid stale duplication of existing docs when a short link is better

Use this source reference format where possible:

```markdown
## Source References

| Topic | Source |
|---|---|
| Command conversion | `scripts/converter.py` |
| Claude command sources | `plugins/arckit-claude/commands/` |
```

## Safety Rules

- Do not read `.env`, secret files, API tokens, credentials, private keys, or local shell history.
- Do not include secret-looking values in generated docs.
- Do not modify `AGENTS.md`, `CLAUDE.md`, or other top-level agent instructions unless the user explicitly asks.
- If an agent-entry pointer would help, add a "Recommended Agent Entry" section to `docs/repository/agent-guide.md` instead of editing the top-level file.
- Do not touch `.arckit/memory/`.
- Do not document generated extension files as source of truth when a canonical plugin source exists.
- Do not invent behavior. If implementation is unclear, mark it as a gap and name the file or test needed to resolve it.

## Suggested Page Content

### `docs/repository/index.md`

Create a short navigation page with:

- repository purpose
- primary audiences
- page index
- source-of-truth map
- update metadata

### `docs/repository/quickstart.md`

Create an onboarding path with:

- prerequisites
- install/build/test commands
- first files to read
- common change workflows
- where generated outputs come from

### `docs/repository/agent-guide.md`

Create an agent operating guide with:

- safe discovery commands
- generated-file boundaries
- edit discipline
- test selection guidance
- files agents must not touch
- recommended pointer text for `AGENTS.md` or `CLAUDE.md`

### `docs/repository/architecture/overview.md`

Document:

- major directories
- canonical sources vs generated targets
- command/template/hook relationships
- data flow for conversion, docs generation, and release publishing
- diagrams only when they clarify the flow

### `docs/repository/workflows/development.md`

Document:

- how to add or change a command
- where guides and templates live
- how converter output is regenerated
- how to keep edits scoped

### `docs/repository/workflows/testing.md`

Document:

- focused test commands
- generated-output tests
- hook/runtime smoke tests
- markdownlint scope
- common local-environment caveats

### `docs/repository/operations/release-and-configuration.md`

Document:

- release flow at a high level
- version files and generated targets
- plugin configuration files
- operational checks
- links to existing release docs instead of duplicating them

## Success Criteria

- `docs/repository/` contains a compact, navigable repository wiki.
- Claims are grounded in local source files, docs, tests, or git history.
- Existing user-authored docs are preserved or updated surgically.
- Generated outputs are identified as generated, not treated as canonical source.
- Secret, memory, cache, and dependency directories are avoided.
- `_plan.md` is removed before completion.
- `.last-update.json` records the update when files are written.
- The final response lists files changed, gaps, and validation performed.

## Example Usage

```text
/arckit:repo-docs --init
```

```text
/arckit:repo-docs --update
```

```text
/arckit:repo-docs document hooks and release flow only
```

```text
/arckit:repo-docs --check
```

## Key References

| Reference | Purpose | URL |
|---|---|---|
| OpenWiki repository | Source of the repository-wiki workflow inspiration | https://github.com/langchain-ai/openwiki |
| OpenWiki agent prompt | Prompt patterns adapted for targeted discovery, planning, updates, and safety | https://github.com/langchain-ai/openwiki/blob/main/src/agent/prompt.ts |
| OpenWiki license | MIT license for reuse/copying with notice preservation | https://github.com/langchain-ai/openwiki/blob/main/LICENSE |
| ArcKit custom commands guide | Local pattern for adding command sources and guides | `docs/guides/custom-commands.md` |
| ArcKit Pages guide | Publishing path for generated docs and `llms.txt` | `docs/guides/pages.md` |

## Related Commands

- `/arckit:pages` publishes ArcKit artifacts, guides, and documentation indexes.
- `/arckit:search` locates ArcKit artifacts and guide references.
- `/arckit:architecture-repository` in the TOGAF ADM overlay creates a governance repository artifact, not source-code repository docs.
