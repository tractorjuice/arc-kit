---
name: arckit-start
display_name: ArcKit Start
description: Get oriented with ArcKit — guided project onboarding, workflow selection, and command recommendations
tags: [arckit, architecture, governance]
---

# ArcKit: Project Onboarding

Use the **architecture-workflow** skill to guide this user through project onboarding and workflow selection.

## User Input

```text
${args}
```

## Instructions

1. Follow the architecture-workflow skill process exactly
2. If the user provided `${args}` with a specific focus (e.g., "procurement", "governance review"), use that as context during triage — it may let you skip some questions
3. The skill will detect project state, ask adaptive questions, and present a tailored command plan
4. Do NOT run any commands — only present the recommended plan for the user to execute

## Vibe-Specific Notes

- Use `read_file` tool to read templates and existing documents
- Use `glob` tool to scan for artifacts: `glob pattern="projects/**/ARC-*.md"`
- Use `bash` tool for shell commands
- Use `write_file` tool to create new files
- Template files are in `.arckit/templates/` or `.arckit/templates-custom/`
- Extension files are in `${VIBE_EXTENSION_ROOT}/`
