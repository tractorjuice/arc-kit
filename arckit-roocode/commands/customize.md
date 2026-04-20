---
description: "Copy plugin templates to project for customization"
---

You are helping a user customize ArcKit document templates for their project or organization.

## User Input

```text
$ARGUMENTS
```

## Overview

ArcKit uses document templates to generate consistent architecture artifacts. Users can customize these templates by copying them to `.arckit/templates/`. When a template exists in the custom directory, it takes precedence over the default template.

**Template locations:**

- **Defaults**: `.arckit/templates/` (shipped with ArcKit, refreshed by `arckit init`)
- **User overrides**: `.arckit/templates/` (your customizations, preserved across updates)

## Instructions

### 1. **Parse User Request**

The user may request:

- **List templates**: Show all available templates (no arguments or "list")
- **Copy specific template**: Copy one template (e.g., "requirements", "risk", "adr")
- **Copy all templates**: Copy all templates ("all")
- **Show template info**: Explain what a template contains ("info requirements")

### 2. **List Available Templates**

If user wants to see available templates, use Glob to find `.arckit/templates/*-template.md` and `.arckit/templates/*-template.html`, then extract the template name from each filename (strip the `-template.md`/`.html` suffix).

Display as a table:

| Template | Command | Description |
|----------|---------|-------------|
| `adr` | `ArcKit adr` | Architecture Decision Records (MADR v4.0) |
| `analysis-report` | `ArcKit analyze` | Governance quality analysis report |
| `architecture-diagram` | `ArcKit diagram` | Mermaid architecture diagrams |
| `architecture-principles` | `ArcKit principles` | Enterprise architecture principles |
| `architecture-strategy` | `ArcKit strategy` | Executive-level strategy document |
| `aws-research` | `ArcKit aws-research` | AWS service research findings |
| `azure-research` | `ArcKit azure-research` | Azure service research findings |
| `backlog` | `ArcKit backlog` | Product backlog with user stories |
| `data-mesh-contract` | `ArcKit data-mesh-contract` | Data product contracts |
| `data-model` | `ArcKit data-model` | Data model with GDPR compliance |
| `datascout` | `ArcKit datascout` | External data source discovery |
| `devops` | `ArcKit devops` | DevOps strategy and CI/CD |
| `dld-review` | `ArcKit dld-review` | Detailed design review |
| `dos-requirements` | `ArcKit dos` | Digital Outcomes & Specialists |
| `dpia` | `ArcKit dpia` | Data Protection Impact Assessment |
| `evaluation-criteria` | `ArcKit evaluate` | Vendor evaluation framework |
| `finops` | `ArcKit finops` | FinOps cloud cost management |
| `gcloud-clarify` | `ArcKit gcloud-clarify` | G-Cloud clarification questions |
| `gcloud-requirements` | `ArcKit gcloud-search` | G-Cloud service requirements |
| `hld-review` | `ArcKit hld-review` | High-level design review |
| `jsp-936` | `ArcKit jsp-936` | MOD AI assurance (JSP 936) |
| `mlops` | `ArcKit mlops` | MLOps strategy |
| `mod-secure-by-design` | `ArcKit mod-secure` | MOD Secure by Design |
| `operationalize` | `ArcKit operationalize` | Operational readiness pack |
| `platform-design` | `ArcKit platform-design` | Platform Design Toolkit |
| `principles-compliance-assessment` | `ArcKit principles-compliance` | Principles compliance scorecard |
| `project-plan` | `ArcKit plan` | Project plan with timeline |
| `requirements` | `ArcKit requirements` | Business & technical requirements |
| `research-findings` | `ArcKit research` | Technology research findings |
| `risk-register` | `ArcKit risk` | Risk register (Orange Book) |
| `roadmap` | `ArcKit roadmap` | Architecture roadmap |
| `service-assessment-prep` | `ArcKit service-assessment` | GDS Service Standard prep |
| `servicenow-design` | `ArcKit servicenow` | ServiceNow service design |
| `sobc` | `ArcKit sobc` | Strategic Outline Business Case |
| `sow` | `ArcKit sow` | Statement of Work / RFP |
| `stakeholder-drivers` | `ArcKit stakeholders` | Stakeholder analysis |
| `story` | `ArcKit story` | Project story with timeline |
| `tcop-review` | `ArcKit tcop` | Technology Code of Practice |
| `traceability-matrix` | `ArcKit traceability` | Requirements traceability |
| `uk-gov-ai-playbook` | `ArcKit ai-playbook` | AI Playbook compliance |
| `uk-gov-atrs` | `ArcKit atrs` | Algorithmic Transparency Record |
| `uk-gov-tcop` | `ArcKit tcop` | TCoP review template |
| `ukgov-secure-by-design` | `ArcKit secure` | UK Gov Secure by Design |
| `vendor-scoring` | `ArcKit evaluate` | Vendor scoring matrix |
| `wardley-map` | `ArcKit wardley` | Wardley Map documentation |
| `pages` | `ArcKit pages` | GitHub Pages site (HTML/CSS/JS) |

### 3. **Copy Template(s)**

**Copy specific template:**

1. Map the user's short name to the full filename (e.g., "requirements" → `requirements-template.md`, "pages" → `pages-template.html`)
2. Use the Read tool to read the source template from `.arckit/templates/{name}-template.{ext}`
3. **Update the origin banner**: Before writing, change the `Template Origin` line from `Official` to `Custom` and add a `Based On` reference:
   - Find: ``> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.{command}` ``
   - Replace with: ``> **Template Origin**: Custom | **Based On**: `/arckit.{command}` | **ArcKit Version**: [VERSION]``
4. Use the Write tool to save it to `.arckit/templates/{name}-template.{ext}` (the directory will be created automatically)
5. If the source template does not exist, inform the user and suggest running `ArcKit customize list`

**Copy all templates:**

1. Use Glob to find all `.arckit/templates/*-template.md` and `.arckit/templates/*-template.html` files
2. For each template found, use Read to load it, update the origin banner (change `Template Origin: Official` to `Template Origin: Custom | Based On: /arckit.{command}`), and Write to save it to `.arckit/templates/`

### 4. **Show Template Info**

If user asks about a specific template (e.g., "info requirements"), read and summarize:

- What document it generates
- Key sections included
- UK Government frameworks referenced
- Common customization points

### 5. **Provide Customization Guidance**

After copying, explain:

```markdown
## Template Customization Guide

Your template has been copied to `.arckit/templates/`. You can now customize it.

### How It Works

When you run an ArcKit command (e.g., `ArcKit requirements`):

1. Command checks: Does `.arckit/templates/requirements-template.md` exist?
2. **If YES** → Uses YOUR customized template
3. **If NO** → Uses default from `.arckit/templates/`

### Common Customizations

**Remove UK Government sections** (for non-UK Gov projects):
- Delete "UK Government Alignment" sections
- Remove TCoP, GDS Service Standard references
- Change classification from "OFFICIAL-SENSITIVE" to your scheme

**Change Document Control fields**:
- Add organization-specific fields (Cost Centre, Programme, etc.)
- Remove fields not relevant to your organization
- Change review cycle defaults

**Modify requirement prefixes**:
- Change BR/FR/NFR to your organization's taxonomy
- Update priority levels (MUST/SHOULD/MAY → P1/P2/P3)

**Add organization branding**:
- Add logo placeholder
- Include standard headers/footers
- Add disclaimer text

**Customize the Pages template** (`pages-template.html`):
- Replace GOV.UK Design System CSS with neutral or organization-specific styling
- Change the color palette (header, sidebar, accent colors)
- Remove or rename UK-specific guide categories (e.g., "UK Government" section)
- Adjust the governance dashboard checklist items to match your framework
- Add organization logo or branding to the header
- Modify the footer text and links

### Keeping Templates Updated

When ArcKit CLI updates with new template features:
- Default templates in `.arckit/templates/` are refreshed by `arckit init`
- Your customizations in `.arckit/templates/` are **preserved**
- Compare your templates with defaults periodically to adopt new features

To see the current default template, use the Read tool on `.arckit/templates/{name}-template.md`.

To compare your customization with the default, read both files and compare the content.

### Reverting to Default

To stop using a custom template and revert to default, delete `.arckit/templates/{name}-template.md`.

```

## Output Summary

After completing the request, show:

```markdown
## Template Customization Complete ✅

**Action**: [Listed templates / Copied X template(s)]

**Location**: `.arckit/templates/`

**Files**:
- [List of files copied or available]

**Next Steps**:
1. Edit the template(s) in `.arckit/templates/`
2. Run the corresponding `ArcKit` command
3. Your customized template will be used automatically

**Tip**: Read both the default and your custom template to compare differences.
```

## Example Usage

**List all templates:**

```text
ArcKit customize list
```

**Copy requirements template:**

```text
ArcKit customize requirements
```

**Copy multiple templates:**

```text
ArcKit customize requirements risk adr
```

**Copy all templates:**

```text
ArcKit customize all
```

**Get info about a template:**

```text
ArcKit customize info requirements
```
