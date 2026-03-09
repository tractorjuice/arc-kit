# ArcKit Enterprise Architecture Toolkit

This project uses ArcKit for architecture governance. Available commands
are in `.github/prompts/arckit-*.prompt.md` (type `/` in Copilot Chat).

## Conventions

- All architecture artifacts go in `projects/` directories (e.g., `projects/001-project-name/`)
- Use `bash .arckit/scripts/bash/create-project.sh --json` to create numbered project dirs
- Use `bash .arckit/scripts/bash/generate-document-id.sh` for document IDs (e.g., ARC-001-REQ-v1.0)
- Templates are in `.arckit/templates/` (custom overrides in `.arckit/templates-custom/`)
- Always write large documents to files (avoid output token limits)
- Show only a summary to the user after generating artifacts

## Document ID Format

`ARC-{project}-{type}-v{version}` (e.g., `ARC-001-REQ-v1.0`)

## Requirement ID Prefixes

- BR-xxx: Business Requirements
- FR-xxx: Functional Requirements
- NFR-xxx: Non-Functional Requirements (NFR-P-xxx Performance, NFR-SEC-xxx Security)
- INT-xxx: Integration Requirements
- DR-xxx: Data Requirements

## Project Structure

```text
projects/
├── 000-global/          # Cross-project artifacts (principles, policies)
└── 001-project-name/    # Numbered project directories
    ├── ARC-001-REQ-v1.0.md
    ├── ARC-001-STKE-v1.0.md
    ├── external/        # Reference documents
    └── vendors/         # Vendor evaluations
```
