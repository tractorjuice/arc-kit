# ArcKit for GitHub Copilot

**Enterprise Architecture Governance & Vendor Procurement Toolkit for GitHub Copilot**

ArcKit transforms GitHub Copilot into a powerful Architecture Governance platform, providing specialized prompts and instructions for generating architecture artifacts, vendor procurement documents, and UK Government compliance assessments.

## Features

- **Project Context Awareness**: Automatically reads project artifacts (Requirements, Risks, Principles) to inform new documents.
- **UK Government Aligned**: Built-in support for GDS Service Standard, Technology Code of Practice (TCoP), and Secure by Design.
- **Cloud Native**: Integrated research instructions for AWS, Azure, and GCP.
- **Traceability**: Maintains a strict traceability chain from stakeholders to user stories.

## Usage

Use the instructions in `copilot-instructions.md` to configure your GitHub Copilot custom instructions or use them as a reference in your chat sessions.

## Directory Structure

```text
.
├── copilot-instructions.md    # Core instructions for GitHub Copilot
├── agents/                   # Autonomous research agents (Markdown)
├── commands/                 # Command reference (Markdown)
├── prompts/                  # Reusable prompt snippets
├── skills/                   # Reusable ArcKit skills
├── templates/                # Document templates
├── references/               # Quality checklists and guides
├── scripts/                  # Helper scripts
└── docs/                     # Documentation and guides
```

## License

MIT License - see [LICENSE](LICENSE) for details.
