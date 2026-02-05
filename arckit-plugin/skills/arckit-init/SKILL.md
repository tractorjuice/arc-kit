---
description: Use this skill when the user wants to initialize an ArcKit project, set up the project structure, start a new architecture governance project, or asks "how do I start with ArcKit". Trigger phrases include "arckit init", "initialize arckit", "set up arckit project", "create arckit structure", "start new architecture project".
---

# ArcKit Project Initialization

Initialize an ArcKit project structure for enterprise architecture governance.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Check if project structure already exists**:
   - Look for `projects/` directory in the current working directory
   - If it exists, inform the user and ask if they want to continue

2. **Create the project structure**:
   Create the following directory structure:

   ```
   projects/
   ├── 000-global/
   │   ├── policies/      # Organization-wide policies and standards
   │   └── external/      # External reference documents
   ```

3. **Create directories using Bash**:
   ```bash
   mkdir -p projects/000-global/policies
   mkdir -p projects/000-global/external
   ```

4. **Provide next steps**:
   Tell the user:
   - The project structure is ready
   - They can now use `/arckit.principles` to create architecture principles in `projects/000-global/`
   - Individual projects will be created in numbered directories (001-*, 002-*, etc.) when they run commands like `/arckit.requirements`
   - External documents (RFPs, existing specs) can be placed in `projects/{project}/external/`
   - Organization-wide policies go in `projects/000-global/policies/`

## Output

Confirm the creation with a brief message:

```
ArcKit project structure initialized:

projects/
├── 000-global/
│   ├── policies/   (organization-wide policies)
│   └── external/   (external reference documents)

Next steps:
1. Run /arckit.principles to create architecture principles
2. Run /arckit.stakeholders to analyze stakeholders for a project
3. Run /arckit.requirements to create requirements

Individual projects will be created automatically in numbered directories (001-*, 002-*).
```
