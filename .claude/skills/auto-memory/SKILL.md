---
name: auto-memory
description: "This skill should be used when the user asks to 'set up memory', 'create memory files', 'create MEMORY.md', 'set up topic files', 'improve memory organization', 'what should I remember', 'how to structure memory files', 'MEMORY.md is too long', 'what goes in memory vs topic files', 'memory best practices', or wants to establish a persistent knowledge base across Claude Code sessions. Triggers on: memory setup, MEMORY.md, topic files, cross-session knowledge, persistent notes, memory maintenance, memory pruning."
---

# Auto Memory Management

Use persistent auto memory to retain project knowledge across Claude Code sessions. The memory directory (`~/.claude/projects/<path>/memory/`) stores a concise index file (`MEMORY.md`) and detailed topic files, creating a structured knowledge base that grows with the project.

## Core Architecture

```text
~/.claude/projects/<project-path>/memory/
├── MEMORY.md          # Always loaded into system prompt (~200 lines max)
├── architecture.md    # Topic file: system architecture decisions
├── patterns.md        # Topic file: code patterns and conventions
├── debugging.md       # Topic file: debugging insights
├── workflows.md       # Topic file: development workflows
└── known-issues.md    # Topic file: bug tracking
```

### Two-Tier Design

1. **MEMORY.md** (always in context): Concise index with key facts, quick reference tables, and links to topic files. Lines after 200 are truncated — keep it tight.
2. **Topic files** (consulted as needed): Detailed reference organized by domain. No size limit, but keep each file focused on one topic.

## What to Save

### Save These

- **Stable patterns** confirmed across multiple interactions (naming conventions, file organization, coding style)
- **Architectural decisions** and their rationale
- **Important file paths** and project structure
- **User preferences** for workflow, tools, and communication style
- **Solutions to recurring problems** and debugging insights
- **Critical gotchas** that cause repeated mistakes
- **Explicit user requests** ("always use bun", "never auto-commit") — save immediately, no need to wait for confirmation across sessions

### Do NOT Save

- **Session-specific context** (current task details, in-progress work, temporary state)
- **Unverified information** — verify against project docs before writing
- **Duplicates of CLAUDE.md** — memory supplements project instructions, never contradicts them
- **Speculative conclusions** from reading a single file
- **Rapidly changing values** (exact line numbers, temporary feature flags)

## Setting Up Auto Memory

### Step 1: Create the Memory Directory

The directory is created automatically by Claude Code, but to initialize manually:

```bash
mkdir -p ~/.claude/projects/<project-path>/memory/
```

The `<project-path>` typically mirrors the working directory with slashes replaced by dashes (e.g., `/workspaces/my-app` becomes `-workspaces-my-app`).

### Step 2: Create MEMORY.md

Start with a minimal index and expand as patterns emerge. Include:

- **Project overview**: Key architectural facts (2-3 bullet points)
- **Quick reference**: Counts, paths, conventions that come up repeatedly
- **Critical gotchas**: Hard-won lessons that prevent repeated mistakes
- **Topic file index**: Table linking to detailed files with "when to consult" guidance

See [examples/MEMORY.md](examples/MEMORY.md) for a starter template.

### Step 3: Create Topic Files as Needed

Create topic files only when a domain accumulates enough detail to warrant its own file. Common topic files:

| File | Purpose |
|------|---------|
| `architecture.md` | System design decisions, component relationships |
| `patterns.md` | Code conventions, naming, file organization |
| `debugging.md` | Solutions to recurring problems |
| `workflows.md` | Build, test, deploy procedures |
| `known-issues.md` | Bug tracking, open/fixed issues |
| `release-process.md` | Version management, release checklists |
| `dependencies.md` | Package versions, compatibility notes |

See [examples/topic-file.md](examples/topic-file.md) for the recommended structure.

## Organization Principles

### Semantic Over Chronological

Organize by topic, not by date. "Architecture decisions" is better than "Session notes 2026-02-15". When new information arrives, integrate it into the appropriate topic rather than appending chronologically.

### Concise Index, Detailed Topics

MEMORY.md answers "what do I need to know right now?" Topic files answer "what are all the details about X?" Keep the index scannable — use bullet points, tables, and bold for key terms.

### Topic File Index Table

Always include a table in MEMORY.md linking to topic files with guidance on when to consult each:

```markdown
## Topic Files

| File | When to consult |
|------|----------------|
| `architecture.md` | Working on system design, component changes |
| `patterns.md` | Writing new code, reviewing conventions |
| `debugging.md` | Investigating bugs, error messages |
```

### One Topic Per File

Each file covers one domain. If a file grows beyond ~5,000 words or covers multiple unrelated topics, split it. A file named `misc.md` or `notes.md` is a sign of poor organization.

## Maintenance

### When to Update

- After discovering a mistake that could recur
- When a pattern is confirmed across 2+ interactions
- When the user explicitly asks to remember something
- After resolving a tricky bug worth documenting
- When project structure changes significantly

### When to Remove or Edit

- When stored information becomes outdated (version bumps, removed features)
- When a gotcha is fixed and no longer relevant
- When the user asks to forget something
- When MEMORY.md exceeds ~200 lines — prune or move detail to topic files

### Avoiding Drift

Periodically review memory files against the actual project state. Stale entries (wrong counts, outdated paths, fixed bugs still listed as open) erode trust in the memory system. Mark fixed issues as fixed rather than deleting them — the history of what went wrong is itself valuable.

## Additional Resources

### Reference Files

For detailed patterns, anti-patterns, and advanced techniques:

- **[references/patterns.md](references/patterns.md)** — Writing style guide, MEMORY.md structure patterns, topic file patterns, common anti-patterns

### Example Files

Working examples ready to adapt:

- **[examples/MEMORY.md](examples/MEMORY.md)** — Starter MEMORY.md template
- **[examples/topic-file.md](examples/topic-file.md)** — Topic file template with recommended structure
