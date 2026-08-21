---
description: Copy plugin templates to project for customization
doc-type: none
argument-hint: "<template name or 'list', e.g. 'requirements', 'risk', 'list'>"
---

You are helping a user customize ArcKit document templates for their project or organization.

## User Input

```text
$ARGUMENTS
```

## Overview

ArcKit uses document templates to generate consistent architecture artifacts. Users can customize these templates by copying them to `.arckit/templates-custom/`. When a template exists in the custom directory, it takes precedence over the default template.

**Template locations:**

- **Defaults**: `${CLAUDE_PLUGIN_ROOT}/templates/` (shipped with ArcKit, refreshed by `arckit init`)
- **User overrides**: `.arckit/templates-custom/` (your customizations, preserved across updates)

**Scope: this command covers the core `arckit` plugin only.** `${CLAUDE_PLUGIN_ROOT}` resolves to the plugin the command itself ships in, so the templates that community overlay plugins ship (`arckit-uae`, `arckit-ca`, `arckit-uk-nhs`, `arckit-repo` and the rest) are not in the glob. They are the larger half of the catalogue. Never present a core-only result as the complete inventory; see "Copy an overlay template" below for how to copy one.

## Instructions

### 1. **Parse User Request**

The user may request:

- **List templates**: Show all available templates (no arguments or "list")
- **Copy specific template**: Copy one template (e.g., "requirements", "risk", "adr")
- **Copy all templates**: Copy all templates ("all")
- **Show template info**: Explain what a template contains ("info requirements")

### 2. **List Available Templates**

If user wants to see available templates, use Glob to find `${CLAUDE_PLUGIN_ROOT}/templates/*-template.md` and `${CLAUDE_PLUGIN_ROOT}/templates/*-template.html`, then extract the template name from each filename (strip the `-template.md`/`.html` suffix).

**State the scope before the table**, in these words or close to them:

> Showing the NN templates in the core `arckit` plugin. Community overlay plugins ship their own templates, which this list does not cover.

Display as a table:

| Template | Command | Description |
|----------|---------|-------------|
| `adr` | `/arckit:adr` | Architecture Decision Records (MADR v4.0) |
| `analysis-report` | `/arckit:analyze` | Governance quality analysis report |
| `architecture-diagram` | `/arckit:diagram` | Mermaid architecture diagrams |
| `architecture-principles` | `/arckit:principles` | Enterprise architecture principles |
| `architecture-strategy` | `/arckit:strategy` | Executive-level strategy document |
| `aws-research` | `/arckit:aws-research` | AWS service research findings |
| `azure-research` | `/arckit:azure-research` | Azure service research findings |
| `backlog` | `/arckit:backlog` | Product backlog with user stories |
| `competitors` | `/arckit:competitors` | Competitor landscape and market share |
| `conformance-assessment` | `/arckit:conformance` | Architecture conformance assessment |
| `data-mesh-contract` | `/arckit:data-mesh-contract` | Data product contracts |
| `data-model` | `/arckit:data-model` | Data model with GDPR compliance |
| `data-source-profile` | `/arckit:datascout` | Per-source data profile (multi-instance) |
| `datascout` | `/arckit:datascout` | External data source discovery |
| `devops` | `/arckit:devops` | DevOps strategy and CI/CD |
| `dfd` | `/arckit:dfd` | Yourdon-DeMarco data flow diagrams |
| `dld-review` | `/arckit:dld-review` | Detailed design review |
| `dos-requirements` | `/arckit:dos` | Digital Outcomes & Specialists |
| `dpia` | `/arckit:dpia` | Data Protection Impact Assessment |
| `evaluation-criteria` | `/arckit:evaluate` | Vendor evaluation framework |
| `finops` | `/arckit:finops` | FinOps cloud cost management |
| `framework-overview` | `/arckit:framework` | Framework overview and executive guide |
| `gcloud-clarify` | `/arckit:gcloud-clarify` | G-Cloud clarification questions |
| `gcloud-requirements` | `/arckit:gcloud-search` | G-Cloud service requirements |
| `gcp-research` | `/arckit:gcp-research` | Google Cloud service research findings |
| `glossary` | `/arckit:glossary` | Consolidated project glossary |
| `gov-code-search` | `/arckit:gov-code-search` | UK government code search report |
| `gov-landscape` | `/arckit:gov-landscape` | UK government domain landscape |
| `gov-reuse` | `/arckit:gov-reuse` | Government code reuse assessment |
| `grants` | `/arckit:grants` | UK grants and funding research |
| `hld-review` | `/arckit:hld-review` | High-level design review |
| `jsp-936` | `/arckit:jsp-936` | MOD AI assurance (JSP 936) |
| `maturity-model` | `/arckit:maturity-model` | Capability maturity model |
| `mlops` | `/arckit:mlops` | MLOps strategy |
| `mod-secure-by-design` | `/arckit:mod-secure` | MOD Secure by Design |
| `operationalize` | `/arckit:operationalize` | Operational readiness pack |
| `pages` | `/arckit:pages` | GitHub Pages site (HTML/CSS/JS) |
| `platform-design` | `/arckit:platform-design` | Platform Design Toolkit |
| `presentation` | `/arckit:presentation` | MARP governance board slides |
| `principles-compliance-assessment` | `/arckit:principles-compliance` | Principles compliance scorecard |
| `project-plan` | `/arckit:plan` | Project plan with timeline |
| `requirements` | `/arckit:requirements` | Business & technical requirements |
| `research-findings` | `/arckit:research` | Technology research findings |
| `risk-register` | `/arckit:risk` | Risk register (Orange Book) |
| `roadmap` | `/arckit:roadmap` | Architecture roadmap |
| `service-assessment-prep` | `/arckit:service-assessment` | GDS Service Standard prep |
| `servicenow-design` | `/arckit:servicenow` | ServiceNow service design |
| `sobc` | `/arckit:sobc` | Strategic Outline Business Case |
| `sow` | `/arckit:sow` | Statement of Work / RFP |
| `stakeholder-drivers` | `/arckit:stakeholders` | Stakeholder analysis |
| `story` | `/arckit:story` | Project story with timeline |
| `tcop-review` | `/arckit:tcop` | Technology Code of Practice |
| `tech-note` | `/arckit:research` | Per-candidate technical note (multi-instance) |
| `tenders` | `/arckit:tenders` | Procurement market intelligence |
| `traceability-matrix` | `/arckit:traceability` | Requirements traceability |
| `uk-gov-ai-playbook` | `/arckit:ai-playbook` | AI Playbook compliance |
| `uk-gov-atrs` | `/arckit:atrs` | Algorithmic Transparency Record |
| `ukgov-secure-by-design` | `/arckit:secure` | UK Gov Secure by Design |
| `vendor-profile` | `/arckit:research` | Per-vendor profile (multi-instance) |
| `vendor-scoring` | `/arckit:evaluate` | Vendor scoring matrix |
| `wardley-climate` | `/arckit:wardley.climate` | Wardley climatic patterns assessment |
| `wardley-doctrine` | `/arckit:wardley.doctrine` | Wardley doctrine maturity assessment |
| `wardley-gameplay` | `/arckit:wardley.gameplay` | Wardley gameplay analysis |
| `wardley-map` | `/arckit:wardley` | Wardley Map documentation |
| `wardley-value-chain` | `/arckit:wardley.value-chain` | Wardley value chain decomposition |

### 3. **Copy Template(s)**

**Copy specific template:**

1. Map the user's short name to the full filename (e.g., "requirements" → `requirements-template.md`, "pages" → `pages-template.html`)
2. Use the Read tool to read the source template from `${CLAUDE_PLUGIN_ROOT}/templates/{name}-template.{ext}`
3. **Update the origin banner**: Before writing, change the `Template Origin` line from `Official` to `Custom` and add a `Based On` reference:
   - Find: ``> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.{command}` ``
   - Replace with: ``> **Template Origin**: Custom | **Based On**: `/arckit.{command}` | **ArcKit Version**: [VERSION]``
4. Use the Write tool to save it to `.arckit/templates-custom/{name}-template.{ext}` (the directory will be created automatically)
5. If the source template does not exist, do **not** stop at "not found". Glob `${CLAUDE_PLUGIN_ROOT}/plugins/**/templates/{name}-template.*` before answering: if it matches, the template ships in an overlay plugin, so follow "Copy an overlay template" below. Only if both globs come back empty, tell the user it does not exist and suggest `/arckit:customize list`.

**Copy all templates:**

1. Use Glob to find all `${CLAUDE_PLUGIN_ROOT}/templates/*-template.md` and `${CLAUDE_PLUGIN_ROOT}/templates/*-template.html` files
2. For each template found, use Read to load it, update the origin banner (change `Template Origin: Official` to `Template Origin: Custom | Based On: /arckit.{command}`), and Write to save it to `.arckit/templates-custom/`
3. **Report the scope, not just the count.** "all" here means all *core* templates. Say so explicitly, and say that overlay templates were not included:

   > Copied NN core `arckit` templates. Community overlay plugins ship their own templates, which `all` does not cover.

   Reporting "copied all templates" after a core-only pass is a wrong answer, not a terse one.

**Copy an overlay template:**

Templates belonging to a community overlay plugin cannot be reached through `${CLAUDE_PLUGIN_ROOT}/templates/`, but the core plugin bundles a copy of every overlay under its own root, so they can still be read and copied by hand:

1. Glob `${CLAUDE_PLUGIN_ROOT}/plugins/**/templates/{name}-template.*` to locate the file (overlay directories nest one or two levels deep, e.g. `plugins/uae/`, `plugins/uk/finance/`)
2. Read it, update the origin banner as under "Copy specific template" above, and Write it to `.arckit/templates-custom/{name}-template.{ext}`
3. Tell the user which overlay it came from, and that the copy is the version bundled with the installed core plugin, which can lag a separately installed overlay

Tracked on issue #717, which will make this path a first-class part of the command.

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

Your template has been copied to `.arckit/templates-custom/`. You can now customize it.

### How It Works

When you run an ArcKit command (e.g., `/arckit:requirements`):

1. Command checks: Does `.arckit/templates-custom/requirements-template.md` exist?
2. **If YES** → Uses YOUR customized template
3. **If NO** → Uses default from `${CLAUDE_PLUGIN_ROOT}/templates/`

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
- Default templates in `${CLAUDE_PLUGIN_ROOT}/templates/` are refreshed by `arckit init`
- Your customizations in `.arckit/templates-custom/` are **preserved**
- Compare your templates with defaults periodically to adopt new features

To see the current default template, use the Read tool on `${CLAUDE_PLUGIN_ROOT}/templates/{name}-template.md`.

To compare your customization with the default, read both files and compare the content.

### Reverting to Default

To stop using a custom template and revert to default, delete `.arckit/templates-custom/{name}-template.md`.

```

## Output Summary

After completing the request, show:

```markdown
## Template Customization Complete ✅

**Action**: [Listed templates / Copied X template(s)]

**Scope**: Core `arckit` plugin ([N] templates). Overlay plugin templates not included.

**Location**: `.arckit/templates-custom/`

**Files**:
- [List of files copied or available]

**Next Steps**:
1. Edit the template(s) in `.arckit/templates-custom/`
2. Run the corresponding `/arckit:*` command
3. Your customized template will be used automatically

**Tip**: Read both the default and your custom template to compare differences.
```

## Example Usage

**List all templates:**

```text
/arckit:customize list
```

**Copy requirements template:**

```text
/arckit:customize requirements
```

**Copy multiple templates:**

```text
/arckit:customize requirements risk adr
```

**Copy all templates:**

```text
/arckit:customize all
```

**Get info about a template:**

```text
/arckit:customize info requirements
```
