---
name: arckit-init
display_name: ArcKit Init
description: Initialize ArcKit project structure for enterprise architecture governance
tags: [arckit, architecture, governance]
---

# ArcKit Project Initialization

## User Input

```text
${args}
```

## Instructions

1. **Check if project structure already exists**:
   - Look for `projects/` directory in the current working directory
   - If it exists, inform the user and ask if they want to continue

2. **Create the project structure**:
   - Create directories `projects/000-global/policies/` and `projects/000-global/external/` (these will be created automatically when saving files with the Write tool, or use Bash `mkdir` if needed)

3. **Provide next steps**:

```text
ArcKit project structure initialized:

projects/
├── 000-global/
│   ├── policies/   (organization-wide policies)
│   └── external/   (external reference documents)

Next steps:
1. Run /arckit:principles to create architecture principles
2. Run /arckit:stakeholders to analyze stakeholders for a project
3. Run /arckit:requirements to create requirements

Individual projects will be created automatically in numbered directories (001-*, 002-*).
```

## Vibe-Specific Notes

- Use `read_file` tool to read templates and existing documents
- Use `glob` tool to scan for artifacts: `glob pattern="projects/**/ARC-*.md"`
- Use `bash` tool for shell commands
- Use `write_file` tool to create new files
- Template files are in `.arckit/templates/` or `.arckit/templates-custom/`
- Extension files are in `${VIBE_EXTENSION_ROOT}/`
