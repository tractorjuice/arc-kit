# GitHub Issue Templates Design

**Date:** 2026-03-13
**Status:** Approved

## Problem

ArcKit's GitHub issues are frequently low-quality: vague titles, missing reproduction steps, screenshots with no text explanation, no environment information, and unclear whether the report is a bug, question, or feature request. There are no issue templates or forms enforcing structure, and CONTRIBUTING.md's text checklist is routinely ignored.

## Goals

- Force users to provide structured, actionable information when raising issues
- Auto-categorise issues by type (bug, feature request, question) with labels
- Capture environment details (AI tool, version, OS) for bug reports
- Eliminate blank/unstructured issues
- Serve both technical and non-technical users equally

## Approach

**Issue Forms (YAML)** — 3 structured form templates plus a `config.yml` to disable blank issues and provide external links. No bots, no GitHub Actions, no ongoing maintenance.

### Alternatives Considered

1. **Markdown templates** — simpler but users can delete pre-filled text, defeating the purpose
2. **Forms + bot enforcement** — adds a GitHub Action to auto-comment on incomplete issues; more maintenance for marginal benefit since forms already enforce required fields

## File Structure

```text
.github/
├── ISSUE_TEMPLATE/
│   ├── bug-report.yml
│   ├── feature-request.yml
│   ├── question.yml
│   └── config.yml
```

## Form Designs

### Bug Report (`bug-report.yml`)

**Auto-labels:** `bug`

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Command | input | yes | Which `/arckit.*` command triggered the bug |
| Description | textarea | yes | Clear description of the problem |
| Steps to reproduce | textarea | yes | Numbered steps to reproduce |
| Expected behaviour | textarea | yes | What should have happened |
| Actual behaviour | textarea | yes | What actually happened (including error messages) |
| Screenshots/logs | textarea | no | Paste screenshots or terminal output |
| AI Tool | dropdown | yes | Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, ArcKit CLI |
| AI Tool version | input | yes | e.g., "Claude Code v2.1.71" |
| ArcKit version | input | yes | e.g., "4.2.9" |
| OS | dropdown | yes | macOS, Windows, Linux/WSL, Codespaces/DevContainer |
| Additional context | textarea | no | Anything else relevant |

### Feature Request (`feature-request.yml`)

**Auto-labels:** `enhancement`

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Summary | input | yes | One-line summary of the feature |
| Problem/use case | textarea | yes | What problem does this solve? |
| Proposed solution | textarea | yes | How do you envision this working? |
| Alternatives considered | textarea | no | Other approaches you've thought about |
| AI Tool | dropdown | no | Most relevant tool (Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, ArcKit CLI, All) |
| Additional context | textarea | no | Examples, screenshots, references |

### Question (`question.yml`)

**Auto-labels:** `question`

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Question | textarea | yes | What do you need help with? |
| What I've tried | textarea | yes | What have you already tried or looked at? |
| AI Tool | dropdown | yes | Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, ArcKit CLI |
| ArcKit version | input | no | If known |
| Additional context | textarea | no | Screenshots, logs, links |

### Config (`config.yml`)

- Blank issues: **disabled**
- Contact links:
  - Discord — for general questions and community discussion
  - Documentation — browse ArcKit docs and command guides

## What This Solves

Looking at actual issues from the repo:

- **#160** "all spanish documentation..." — one-line body with no reproduction steps → Bug form forces steps, command, environment
- **#157** "/arckit.story pls tell me what happen here" — raw terminal dump → Bug form separates description from logs
- **#155** "is consuming a lot of tokens" — one-line body "that is a normal behaviour" → Question form requires "what I've tried"
- **#121** screenshots only, no text → Bug form requires text description; screenshots go in optional field

## Out of Scope

- GitHub Actions for automated triage or validation
- Issue labelling beyond the auto-applied type labels
- Changes to CONTRIBUTING.md (could be updated later to reference the forms)
