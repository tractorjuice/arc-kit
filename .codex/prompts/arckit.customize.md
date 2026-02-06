---
description: Copy plugin templates to project for customization
---

You are helping a user customize ArcKit document templates for their project or organization.

## User Input

```text
$ARGUMENTS
```

## Overview

ArcKit uses document templates to generate consistent architecture artifacts. Users can customize these templates by copying them to `.arckit/templates-custom/`. When a template exists in the custom directory, it takes precedence over the default template.

**Template locations:**
- **Defaults**: `.arckit/templates/` (shipped with ArcKit, refreshed by `arckit init`)
- **User overrides**: `.arckit/templates-custom/` (your customizations, preserved across updates)

## Instructions

### 1. **Parse User Request**

The user may request:
- **List templates**: Show all available templates (no arguments or "list")
- **Copy specific template**: Copy one template (e.g., "requirements", "risk", "adr")
- **Copy all templates**: Copy all templates ("all")
- **Show template info**: Explain what a template contains ("info requirements")

### 2. **List Available Templates**

If user wants to see available templates, list them from `.arckit/templates/`:

```bash
ls -1 .arckit/templates/*.md | xargs -n1 basename | sed 's/-template\.md$//'
```

Display as a table:

| Template | Command | Description |
|----------|---------|-------------|
| `adr` | `/arckit.adr` | Architecture Decision Records (MADR v4.0) |
| `analysis-report` | `/arckit.analyze` | Governance quality analysis report |
| `architecture-diagram` | `/arckit.diagram` | Mermaid architecture diagrams |
| `architecture-principles` | `/arckit.principles` | Enterprise architecture principles |
| `architecture-strategy` | `/arckit.strategy` | Executive-level strategy document |
| `aws-research` | `/arckit.aws-research` | AWS service research findings |
| `azure-research` | `/arckit.azure-research` | Azure service research findings |
| `backlog` | `/arckit.backlog` | Product backlog with user stories |
| `data-mesh-contract` | `/arckit.data-mesh-contract` | Data product contracts |
| `data-model` | `/arckit.data-model` | Data model with GDPR compliance |
| `datascout` | `/arckit.datascout` | External data source discovery |
| `devops` | `/arckit.devops` | DevOps strategy and CI/CD |
| `dld-review` | `/arckit.dld-review` | Detailed design review |
| `dos-requirements` | `/arckit.dos` | Digital Outcomes & Specialists |
| `dpia` | `/arckit.dpia` | Data Protection Impact Assessment |
| `evaluation-criteria` | `/arckit.evaluate` | Vendor evaluation framework |
| `finops` | `/arckit.finops` | FinOps cloud cost management |
| `gcloud-clarify` | `/arckit.gcloud-clarify` | G-Cloud clarification questions |
| `gcloud-requirements` | `/arckit.gcloud-search` | G-Cloud service requirements |
| `hld-review` | `/arckit.hld-review` | High-level design review |
| `jsp-936` | `/arckit.jsp-936` | MOD AI assurance (JSP 936) |
| `mlops` | `/arckit.mlops` | MLOps strategy |
| `mod-secure-by-design` | `/arckit.mod-secure` | MOD Secure by Design |
| `operationalize` | `/arckit.operationalize` | Operational readiness pack |
| `platform-design` | `/arckit.platform-design` | Platform Design Toolkit |
| `principles-compliance-assessment` | `/arckit.principles-compliance` | Principles compliance scorecard |
| `project-plan` | `/arckit.plan` | Project plan with timeline |
| `requirements` | `/arckit.requirements` | Business & technical requirements |
| `research-findings` | `/arckit.research` | Technology research findings |
| `risk-register` | `/arckit.risk` | Risk register (Orange Book) |
| `roadmap` | `/arckit.roadmap` | Architecture roadmap |
| `service-assessment-prep` | `/arckit.service-assessment` | GDS Service Standard prep |
| `servicenow-design` | `/arckit.servicenow` | ServiceNow service design |
| `sobc` | `/arckit.sobc` | Strategic Outline Business Case |
| `sow` | `/arckit.sow` | Statement of Work / RFP |
| `stakeholder-drivers` | `/arckit.stakeholders` | Stakeholder analysis |
| `story` | `/arckit.story` | Project story with timeline |
| `tcop-review` | `/arckit.tcop` | Technology Code of Practice |
| `traceability-matrix` | `/arckit.traceability` | Requirements traceability |
| `uk-gov-ai-playbook` | `/arckit.ai-playbook` | AI Playbook compliance |
| `uk-gov-atrs` | `/arckit.atrs` | Algorithmic Transparency Record |
| `uk-gov-tcop` | `/arckit.tcop` | TCoP review template |
| `ukgov-secure-by-design` | `/arckit.secure` | UK Gov Secure by Design |
| `vendor-scoring` | `/arckit.evaluate` | Vendor scoring matrix |
| `wardley-map` | `/arckit.wardley` | Wardley Map documentation |

### 3. **Copy Template(s)**

**Create user templates directory:**
```bash
mkdir -p .arckit/templates-custom
```

**Copy specific template:**
```bash
# Map short name to full filename
TEMPLATE_NAME="$USER_INPUT"  # e.g., "requirements"
SOURCE=".arckit/templates/${TEMPLATE_NAME}-template.md"
DEST=".arckit/templates-custom/${TEMPLATE_NAME}-template.md"

# Check if source exists
if [[ -f "$SOURCE" ]]; then
    cp "$SOURCE" "$DEST"
    echo "✅ Copied ${TEMPLATE_NAME}-template.md to .arckit/templates-custom/"
else
    echo "❌ Template not found: ${TEMPLATE_NAME}"
    echo "Run '/arckit.customize list' to see available templates"
fi
```

**Copy all templates:**
```bash
mkdir -p .arckit/templates-custom
cp .arckit/templates/*-template.md .arckit/templates-custom/
echo "✅ Copied all templates to .arckit/templates-custom/"
```

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

When you run an ArcKit command (e.g., `/arckit.requirements`):

1. Command checks: Does `.arckit/templates-custom/requirements-template.md` exist?
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

### Keeping Templates Updated

When ArcKit CLI updates with new template features:
- Default templates in `.arckit/templates/` are refreshed by `arckit init`
- Your customizations in `.arckit/templates-custom/` are **preserved**
- Compare your templates with defaults periodically to adopt new features

To see the current default template:
\`\`\`bash
cat .arckit/templates/{name}-template.md
\`\`\`

To compare with your customization:
\`\`\`bash
diff .arckit/templates/{name}-template.md .arckit/templates-custom/{name}-template.md
\`\`\`

### Reverting to Default

To stop using a custom template and revert to default:
\`\`\`bash
rm .arckit/templates-custom/{name}-template.md
\`\`\`

### Git Recommendations

Commit your customized templates to share with your team:
\`\`\`bash
git add .arckit/templates-custom/
git commit -m "Add organization-specific document templates"
\`\`\`
```

## Output Summary

After completing the request, show:

```markdown
## Template Customization Complete ✅

**Action**: [Listed templates / Copied X template(s)]

**Location**: `.arckit/templates-custom/`

**Files**:
- [List of files copied or available]

**Next Steps**:
1. Edit the template(s) in `.arckit/templates-custom/`
2. Run the corresponding `/arckit.*` command
3. Your customized template will be used automatically

**Tip**: Use `diff .arckit/templates/{name}-template.md .arckit/templates-custom/{name}-template.md` to compare with the default.
```

## Example Usage

**List all templates:**
```
/arckit.customize list
```

**Copy requirements template:**
```
/arckit.customize requirements
```

**Copy multiple templates:**
```
/arckit.customize requirements risk adr
```

**Copy all templates:**
```
/arckit.customize all
```

**Get info about a template:**
```
/arckit.customize info requirements
```
