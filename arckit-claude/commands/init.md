---
description: Initialize ArcKit project structure for enterprise architecture governance
argument-hint: "<project name, e.g. 'NHS Appointment System'>"
tags: [init, setup, project, start]
---

# ArcKit Project Initialization

## User Input

```text
$ARGUMENTS
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
