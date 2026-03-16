# GitHub Issue Templates Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub issue forms (YAML) to enforce structured bug reports, feature requests, and questions.

**Architecture:** 4 static YAML files in `.github/ISSUE_TEMPLATE/`. No code, no Actions, no dependencies.

**Tech Stack:** GitHub Issue Forms (YAML)

**Spec:** `docs/superpowers/specs/2026-03-13-github-issue-templates-design.md`

---

## Chunk 1: Issue Templates

### Task 1: Create bug report form

**Files:**

- Create: `.github/ISSUE_TEMPLATE/bug-report.yml`

- [ ] **Step 1: Create the bug report form**

```yaml
name: Bug Report
description: Report a bug or unexpected behaviour
labels: ["bug"]
body:
  - type: input
    id: command
    attributes:
      label: Command
      description: Which ArcKit command triggered the bug?
      placeholder: "/arckit.requirements"
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: A clear description of the problem.
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: Numbered steps to reproduce the issue.
      placeholder: |
        1. Run `/arckit.requirements My Project`
        2. Wait for output
        3. See error...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behaviour
      description: What should have happened?
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual behaviour
      description: What actually happened? Include any error messages.
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots / logs
      description: Paste screenshots or terminal output if helpful.
      render: text
    validations:
      required: false

  - type: dropdown
    id: ai-tool
    attributes:
      label: AI Tool
      description: Which AI tool are you using?
      options:
        - Claude Code
        - Codex CLI
        - Gemini CLI
        - OpenCode CLI
        - GitHub Copilot
        - ArcKit CLI
    validations:
      required: true

  - type: input
    id: ai-tool-version
    attributes:
      label: AI Tool version
      description: The version of your AI tool.
      placeholder: "Claude Code v2.1.71"
    validations:
      required: true

  - type: input
    id: arckit-version
    attributes:
      label: ArcKit version
      description: The ArcKit plugin/CLI version.
      placeholder: "4.2.9"
    validations:
      required: true

  - type: dropdown
    id: os
    attributes:
      label: Operating System
      options:
        - macOS
        - Windows
        - Linux/WSL
        - Codespaces/DevContainer
    validations:
      required: true

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Anything else that might help.
    validations:
      required: false
```

- [ ] **Step 2: Commit**

```bash
git add .github/ISSUE_TEMPLATE/bug-report.yml
git commit -m "feat: add bug report issue form"
```

### Task 2: Create feature request form

**Files:**

- Create: `.github/ISSUE_TEMPLATE/feature-request.yml`

- [ ] **Step 1: Create the feature request form**

```yaml
name: Feature Request
description: Suggest a new feature or enhancement
labels: ["enhancement"]
body:
  - type: input
    id: summary
    attributes:
      label: Summary
      description: One-line summary of the feature.
      placeholder: "Add /arckit.security-review command"
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem / use case
      description: What problem does this solve? What's the use case?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: How do you envision this working?
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: Other approaches you've thought about.
    validations:
      required: false

  - type: dropdown
    id: ai-tool
    attributes:
      label: AI Tool
      description: Which AI tool is this most relevant to?
      options:
        - Claude Code
        - Codex CLI
        - Gemini CLI
        - OpenCode CLI
        - GitHub Copilot
        - ArcKit CLI
        - All
    validations:
      required: false

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Examples, screenshots, or references.
    validations:
      required: false
```

- [ ] **Step 2: Commit**

```bash
git add .github/ISSUE_TEMPLATE/feature-request.yml
git commit -m "feat: add feature request issue form"
```

### Task 3: Create question form

**Files:**

- Create: `.github/ISSUE_TEMPLATE/question.yml`

- [ ] **Step 1: Create the question form**

```yaml
name: Question
description: Ask a question or get help with ArcKit
labels: ["question"]
body:
  - type: textarea
    id: question
    attributes:
      label: Question
      description: What do you need help with?
    validations:
      required: true

  - type: textarea
    id: tried
    attributes:
      label: What I've tried
      description: What have you already tried or looked at?
    validations:
      required: true

  - type: dropdown
    id: ai-tool
    attributes:
      label: AI Tool
      description: Which AI tool are you using?
      options:
        - Claude Code
        - Codex CLI
        - Gemini CLI
        - OpenCode CLI
        - GitHub Copilot
        - ArcKit CLI
    validations:
      required: true

  - type: input
    id: arckit-version
    attributes:
      label: ArcKit version
      description: The ArcKit plugin/CLI version, if known.
      placeholder: "4.2.9"
    validations:
      required: false

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Screenshots, logs, or links.
    validations:
      required: false
```

- [ ] **Step 2: Commit**

```bash
git add .github/ISSUE_TEMPLATE/question.yml
git commit -m "feat: add question issue form"
```

### Task 4: Create config to disable blank issues

**Files:**

- Create: `.github/ISSUE_TEMPLATE/config.yml`

- [ ] **Step 1: Create the config**

```yaml
blank_issues_enabled: false
contact_links:
  - name: Discord
    url: https://discord.gg/e28w3deA
    about: Ask general questions and discuss ideas with the community
  - name: Documentation
    url: https://tractorjuice.github.io/arc-kit/
    about: Browse ArcKit documentation and command guides
```

- [ ] **Step 2: Commit**

```bash
git add .github/ISSUE_TEMPLATE/config.yml
git commit -m "feat: add issue template config — disable blank issues, add Discord link"
```

### Task 5: Validate YAML syntax

- [ ] **Step 1: Validate all YAML files parse correctly**

```bash
python -c "
import yaml, sys
for f in ['.github/ISSUE_TEMPLATE/bug-report.yml', '.github/ISSUE_TEMPLATE/feature-request.yml', '.github/ISSUE_TEMPLATE/question.yml', '.github/ISSUE_TEMPLATE/config.yml']:
    with open(f) as fh:
        yaml.safe_load(fh)
    print(f'{f}: OK')
print('All valid')
"
```

Expected: All 4 files print OK.
