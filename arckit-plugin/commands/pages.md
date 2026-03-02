---
description: Generate documentation site with governance dashboard, document viewer, and Mermaid diagram support
argument-hint: "<project ID or 'all', e.g. '001', 'all'>"
---

# ArcKit: Documentation Site Generator

You are an expert web developer helping generate a documentation site that displays all ArcKit project documents with full Mermaid diagram rendering support.

## What is the Pages Generator?

The Pages Generator creates a `docs/index.html` file that:

- **Dashboard** with KPI cards, donut charts, coverage bars, and governance checklist
- **Displays** all ArcKit artifacts in a navigable web interface
- **Renders** Mermaid diagrams inline
- **Organizes** documents by project with sidebar navigation
- **Follows** GOV.UK Design System styling
- **Works** with any static hosting provider (GitHub Pages, Netlify, Vercel, S3, etc.)

## Your Task

**User Request**: $ARGUMENTS

Generate a documentation site for this ArcKit repository.

## Steps 0–4: Handled by Hook

**The `sync-guides` hook runs before this command and handles everything:**

1. Syncs all guide `.md` files from plugin to `docs/guides/`
2. Extracts titles from each guide
3. Reads `.git/config` for repo name, owner, URL
4. Reads plugin VERSION
5. Processes `pages-template.html` → writes `docs/index.html`
6. Scans all projects, artifacts, vendors, external files → writes `docs/manifest.json`

**CRITICAL: The hook's hook context contains ALL document stats you need. Use ONLY those stats for the Step 5 summary. Do NOT call any tools — no Read, Write, Glob, Grep, or Bash. Do NOT read manifest.json or any other file. The hook has already written docs/index.html and docs/manifest.json with correct data. Go directly to Step 5 and output the summary using the stats from the hook context.**

The following reference sections document the manifest structure and data tables used by the hook. They are preserved here for maintenance reference only — the command does not need to process them.

---

### Reference: Guide Categories

**Guide Categories** (based on filename):

| Category | Guide Files |
|----------|-------------|
| Discovery | requirements, stakeholders, stakeholder-analysis, research, datascout |
| Planning | sobc, business-case, plan, roadmap, backlog, strategy |
| Architecture | principles, adr, diagram, wardley, data-model, hld-review, dld-review, design-review, platform-design, data-mesh-contract, c4-layout-science |
| Governance | risk, risk-management, traceability, principles-compliance, analyze, artifact-health, data-quality-framework, knowledge-compounding |
| Compliance | tcop, secure, mod-secure, dpia, ai-playbook, atrs, jsp-936, service-assessment, govs-007-security, national-data-strategy, codes-of-practice, security-hooks |
| Operations | devops, mlops, finops, servicenow, operationalize |
| Procurement | sow, evaluate, dos, gcloud-search, gcloud-clarify, procurement |
| Research | aws-research, azure-research, gcp-research |
| Other | pages, story, presentation, trello, migration, customize, upgrading, pinecone-mcp, start, conformance, productivity, remote-control, mcp-servers |

**DDaT Role Guides** (in `docs/guides/roles/`):

Role guides map ArcKit commands to [DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/) roles. These are stored separately from command guides.

| DDaT Family | Role Guide Files |
|-------------|-----------------|
| Architecture | enterprise-architect, solution-architect, data-architect, security-architect, business-architect, technical-architect, network-architect |
| Chief Digital and Data | cto-cdio, cdo, ciso |
| Product and Delivery | product-manager, delivery-manager, business-analyst, service-owner |
| Data | data-governance-manager, performance-analyst |
| IT Operations | it-service-manager |
| Software Development | devops-engineer |

Add role guides to a separate `roleGuides` array in manifest.json (not the `guides` array). Use titles from the hook's `guideTitles` map for `docs/guides/roles/*.md` paths (suffix already stripped). Map the DDaT family from the filename using the table above. Use the commandCount reference table below to populate `commandCount`.

**Role guide commandCount reference**:

| File | commandCount |
|------|-------------|
| enterprise-architect | 12 |
| solution-architect | 10 |
| data-architect | 4 |
| security-architect | 5 |
| business-architect | 5 |
| technical-architect | 5 |
| network-architect | 3 |
| cto-cdio | 5 |
| cdo | 4 |
| ciso | 5 |
| product-manager | 5 |
| delivery-manager | 6 |
| business-analyst | 4 |
| service-owner | 3 |
| data-governance-manager | 4 |
| performance-analyst | 4 |
| it-service-manager | 3 |
| devops-engineer | 3 |

**Guide Status** (from README command maturity):

| Status | Description | Guide Files |
|--------|-------------|-------------|
| live | Production-ready | plan, principles, stakeholders, stakeholder-analysis, risk, sobc, requirements, data-model, diagram, traceability, principles-compliance, story, sow, evaluate, customize, risk-management, business-case |
| beta | Feature-complete | dpia, research, strategy, roadmap, adr, hld-review, dld-review, backlog, servicenow, analyze, service-assessment, tcop, secure, presentation, artifact-health, design-review, procurement, knowledge-compounding, c4-layout-science, security-hooks, codes-of-practice, data-quality-framework, govs-007-security, national-data-strategy, upgrading, start, conformance, productivity, remote-control, mcp-servers |
| alpha | Working, limited testing | data-mesh-contract, ai-playbook, atrs, pages |
| experimental | Early adopters | platform-design, wardley, azure-research, aws-research, gcp-research, datascout, dos, gcloud-search, gcloud-clarify, trello, devops, mlops, finops, operationalize, mod-secure, jsp-936, migration, pinecone-mcp |

### 1.2 Global Documents

Use **Glob** to check `projects/000-global/` for global artifacts:

```text
projects/000-global/
├── ARC-000-PRIN-v1.0.md    # Architecture Principles (global)
├── policies/                # Governance policies
│   └── *.pdf, *.docx, *.md
├── external/                # Enterprise-wide reference documents
│   └── *.pdf, *.docx, *.md
└── {other global documents}
```

### 1.3 Project Documents

Use **Glob** to check `projects/` for all project folders. Documents use standardized naming: `ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md`

```text
projects/
├── 001-{project-name}/
│   ├── # Core Documents (ARC-001-{TYPE}-v1.0.md pattern)
│   ├── ARC-001-REQ-v1.0.md      # Requirements
│   ├── ARC-001-STKE-v1.0.md     # Stakeholder Drivers
│   ├── ARC-001-RISK-v1.0.md     # Risk Register
│   ├── ARC-001-SOBC-v1.0.md     # Strategic Outline Business Case
│   ├── ARC-001-DATA-v1.0.md     # Data Model
│   ├── ARC-001-TRAC-v1.0.md     # Traceability Matrix
│   ├── ARC-001-SOW-v1.0.md      # Statement of Work
│   ├── ARC-001-EVAL-v1.0.md     # Evaluation Criteria
│   ├── ARC-001-BKLG-v1.0.md     # Product Backlog
│   ├── ARC-001-PLAN-v1.0.md     # Project Plan
│   ├── ARC-001-ROAD-v1.0.md     # Roadmap
│   ├── ARC-001-STRAT-v1.0.md    # Architecture Strategy
│   ├── ARC-001-DPIA-v1.0.md     # DPIA
│   ├── ARC-001-SNOW-v1.0.md     # ServiceNow Design
│   ├── ARC-001-DEVOPS-v1.0.md   # DevOps Strategy
│   ├── ARC-001-MLOPS-v1.0.md    # MLOps Strategy
│   ├── ARC-001-FINOPS-v1.0.md   # FinOps Strategy
│   ├── ARC-001-OPS-v1.0.md      # Operational Readiness
│   ├── ARC-001-TCOP-v1.0.md     # TCoP Review
│   ├── ARC-001-SECD-v1.0.md     # Secure by Design
│   ├── ARC-001-SECD-MOD-v1.0.md # MOD Secure by Design
│   ├── ARC-001-AIPB-v1.0.md     # AI Playbook Assessment
│   ├── ARC-001-ATRS-v1.0.md     # ATRS Record
│   ├── ARC-001-PRIN-COMP-v1.0.md # Principles Compliance
│   │
│   ├── # Multi-instance Documents (subdirectories)
│   ├── diagrams/
│   │   └── ARC-001-DIAG-{NNN}-v1.0.md  # Diagrams
│   ├── decisions/
│   │   └── ARC-001-ADR-{NNN}-v1.0.md   # ADRs
│   ├── wardley-maps/
│   │   └── ARC-001-WARD-{NNN}-v1.0.md  # Wardley Maps
│   ├── data-contracts/
│   │   └── ARC-001-DMC-{NNN}-v1.0.md   # Data Mesh Contracts
│   ├── research/
│   │   ├── ARC-001-RSCH-{NNN}-v1.0.md  # Research Findings
│   │   ├── ARC-001-DSCT-{NNN}-v1.0.md  # Data Source Discovery
│   │   ├── ARC-001-AWRS-{NNN}-v1.0.md  # AWS Research
│   │   ├── ARC-001-AZRS-{NNN}-v1.0.md  # Azure Research
│   │   └── ARC-001-GCRS-{NNN}-v1.0.md  # GCP Research
│   ├── reviews/
│   │   ├── ARC-001-HLDR-v1.0.md        # HLD Review
│   │   └── ARC-001-DLDR-v1.0.md        # DLD Review
│   ├── vendors/
│   │   ├── {vendor-slug}-profile.md      # Vendor profiles (flat)
│   │   └── {vendor-name}/               # Vendor documents (nested)
│   │       ├── hld*.md
│   │       ├── dld*.md
│   │       └── proposal*.md
│   ├── tech-notes/                       # Tech notes
│   │   └── {topic-slug}.md
│   └── external/
│       ├── README.md             # (excluded from listing)
│       ├── rfp-document.pdf
│       └── legacy-spec.docx
├── 002-{another-project}/
│   └── ...
└── ...
```

### 1.3 Known ArcKit Artifact Types

Only include these known artifact types. Match by type code pattern `ARC-{PID}-{TYPE}-*.md`:

| Category | Type Code | Pattern | Display Name |
|----------|-----------|---------|--------------|
| **Discovery** | | | |
| | REQ | `ARC-*-REQ-*.md` | Requirements |
| | STKE | `ARC-*-STKE-*.md` | Stakeholder Drivers |
| | RSCH | `ARC-*-RSCH-*.md` | Research Findings |
| **Planning** | | | |
| | SOBC | `ARC-*-SOBC-*.md` | Strategic Outline Business Case |
| | PLAN | `ARC-*-PLAN-*.md` | Project Plan |
| | ROAD | `ARC-*-ROAD-*.md` | Roadmap |
| | STRAT | `ARC-*-STRAT-*.md` | Architecture Strategy |
| | BKLG | `ARC-*-BKLG-*.md` | Product Backlog |
| **Architecture** | | | |
| | PRIN | `ARC-*-PRIN-*.md` | Architecture Principles |
| | HLDR | `ARC-*-HLDR-*.md` | High-Level Design Review |
| | DLDR | `ARC-*-DLDR-*.md` | Detailed Design Review |
| | DATA | `ARC-*-DATA-*.md` | Data Model |
| | WARD | `ARC-*-WARD-*.md` | Wardley Map |
| | DIAG | `ARC-*-DIAG-*.md` | Architecture Diagrams |
| | ADR | `ARC-*-ADR-*.md` | Architecture Decision Records |
| **Governance** | | | |
| | RISK | `ARC-*-RISK-*.md` | Risk Register |
| | TRAC | `ARC-*-TRAC-*.md` | Traceability Matrix |
| | PRIN-COMP | `ARC-*-PRIN-COMP-*.md` | Principles Compliance |
| | ANAL | `ARC-*-ANAL-*.md` | Analysis Report |
| **Compliance** | | | |
| | TCOP | `ARC-*-TCOP-*.md` | TCoP Assessment |
| | SECD | `ARC-*-SECD-*.md` | Secure by Design |
| | SECD-MOD | `ARC-*-SECD-MOD-*.md` | MOD Secure by Design |
| | AIPB | `ARC-*-AIPB-*.md` | AI Playbook Assessment |
| | ATRS | `ARC-*-ATRS-*.md` | ATRS Record |
| | DPIA | `ARC-*-DPIA-*.md` | Data Protection Impact Assessment |
| | JSP936 | `ARC-*-JSP936-*.md` | JSP 936 Assessment |
| | SVCASS | `ARC-*-SVCASS-*.md` | Service Assessment |
| **Operations** | | | |
| | SNOW | `ARC-*-SNOW-*.md` | ServiceNow Design |
| | DEVOPS | `ARC-*-DEVOPS-*.md` | DevOps Strategy |
| | MLOPS | `ARC-*-MLOPS-*.md` | MLOps Strategy |
| | FINOPS | `ARC-*-FINOPS-*.md` | FinOps Strategy |
| | OPS | `ARC-*-OPS-*.md` | Operational Readiness |
| | PLAT | `ARC-*-PLAT-*.md` | Platform Design |
| **Procurement** | | | |
| | SOW | `ARC-*-SOW-*.md` | Statement of Work |
| | EVAL | `ARC-*-EVAL-*.md` | Evaluation Criteria |
| | DOS | `ARC-*-DOS-*.md` | DOS Requirements |
| | GCLD | `ARC-*-GCLD-*.md` | G-Cloud Search |
| | GCLC | `ARC-*-GCLC-*.md` | G-Cloud Clarifications |
| | DMC | `ARC-*-DMC-*.md` | Data Mesh Contract |
| | | `vendors/*/*.md` | Vendor Documents |
| **Research** | | | |
| | AWRS | `ARC-*-AWRS-*.md` | AWS Research |
| | AZRS | `ARC-*-AZRS-*.md` | Azure Research |
| | GCRS | `ARC-*-GCRS-*.md` | GCP Research |
| | DSCT | `ARC-*-DSCT-*.md` | Data Source Discovery |
| **Other** | | | |
| | STORY | `ARC-*-STORY-*.md` | Project Story |

### Reference: Manifest Structure

The hook generates `docs/manifest.json` with this structure:

```json
{
  "generated": "2026-01-22T10:30:00Z",
  "repository": {
    "name": "{repo-name}"
  },
  "defaultDocument": "projects/000-global/ARC-000-PRIN-v1.0.md",
  "guides": [
    {
      "path": "docs/guides/requirements.md",
      "title": "Requirements Guide",
      "category": "Discovery",
      "status": "live"
    },
    {
      "path": "docs/guides/principles.md",
      "title": "Principles Guide",
      "category": "Architecture",
      "status": "live"
    }
  ],
  "roleGuides": [
    {
      "path": "docs/guides/roles/enterprise-architect.md",
      "title": "Enterprise Architect",
      "family": "Architecture",
      "commandCount": 12
    },
    {
      "path": "docs/guides/roles/product-manager.md",
      "title": "Product Manager",
      "family": "Product and Delivery",
      "commandCount": 5
    }
  ],
  "global": [
    {
      "path": "projects/000-global/ARC-000-PRIN-v1.0.md",
      "title": "Architecture Principles",
      "category": "Architecture",
      "documentId": "ARC-000-PRIN-v1.0",
      "isDefault": true
    }
  ],
  "globalExternal": [
    {
      "path": "projects/000-global/external/enterprise-architecture.pdf",
      "title": "enterprise-architecture.pdf",
      "type": "pdf"
    }
  ],
  "globalPolicies": [
    {
      "path": "projects/000-global/policies/security-policy.pdf",
      "title": "security-policy.pdf",
      "type": "pdf"
    }
  ],
  "projects": [
    {
      "id": "001-project-name",
      "name": "Project Name",
      "documents": [
        {
          "path": "projects/001-project-name/ARC-001-REQ-v1.0.md",
          "title": "Requirements",
          "category": "Discovery",
          "documentId": "ARC-001-REQ-v1.0"
        },
        {
          "path": "projects/001-project-name/ARC-001-STKE-v1.0.md",
          "title": "Stakeholder Drivers",
          "category": "Discovery",
          "documentId": "ARC-001-STKE-v1.0"
        }
      ],
      "diagrams": [
        {
          "path": "projects/001-project-name/diagrams/ARC-001-DIAG-001-v1.0.md",
          "title": "System Context Diagram",
          "documentId": "ARC-001-DIAG-001-v1.0"
        }
      ],
      "research": [
        {
          "path": "projects/001-project-name/research/ARC-001-RSCH-001-v1.0.md",
          "title": "Technology Research",
          "documentId": "ARC-001-RSCH-001-v1.0"
        }
      ],
      "decisions": [
        {
          "path": "projects/001-project-name/decisions/ARC-001-ADR-001-v1.0.md",
          "title": "ADR-001: Cloud Provider Selection",
          "documentId": "ARC-001-ADR-001-v1.0"
        }
      ],
      "wardleyMaps": [
        {
          "path": "projects/001-project-name/wardley-maps/ARC-001-WARD-001-v1.0.md",
          "title": "Technology Landscape",
          "documentId": "ARC-001-WARD-001-v1.0"
        }
      ],
      "dataContracts": [
        {
          "path": "projects/001-project-name/data-contracts/ARC-001-DMC-001-v1.0.md",
          "title": "Customer Data Contract",
          "documentId": "ARC-001-DMC-001-v1.0"
        }
      ],
      "reviews": [
        {
          "path": "projects/001-project-name/reviews/ARC-001-HLDR-v1.0.md",
          "title": "High-Level Design Review",
          "documentId": "ARC-001-HLDR-v1.0"
        },
        {
          "path": "projects/001-project-name/reviews/ARC-001-DLDR-v1.0.md",
          "title": "Detailed Design Review",
          "documentId": "ARC-001-DLDR-v1.0"
        }
      ],
      "vendors": [
        {
          "name": "Acme Corp",
          "documents": [
            {
              "path": "projects/001-project-name/vendors/acme-corp/hld-v1.md",
              "title": "HLD v1.0"
            }
          ]
        }
      ],
      "vendorProfiles": [
        {
          "path": "projects/001-project-name/vendors/aws-profile.md",
          "title": "AWS"
        }
      ],
      "techNotes": [
        {
          "path": "projects/001-project-name/tech-notes/aws-lambda.md",
          "title": "AWS Lambda"
        }
      ],
      "external": [
        {
          "path": "projects/001-project-name/external/rfp-document.pdf",
          "title": "rfp-document.pdf",
          "type": "pdf"
        }
      ]
    }
  ]
}
```

## Step 5: Provide Summary

Use the stats from the hook's hook context (under "Document Stats") to fill in the summary:

```text
Documentation Site Generated

Files Created:
- docs/index.html (main page)
- docs/manifest.json (document index)

Repository: {repo}
Projects Found: {count}
Documents Indexed: {total_documents}

Document Breakdown:
- Guides: {guides_count}
- DDaT Role Guides: {role_guides_count}
- Global: {global_count}
- Project Documents: {project_doc_count}
- Diagrams: {diagram_count}
- ADRs: {adr_count}
- Vendor Documents: {vendor_doc_count}
- Vendor Profiles: {vendor_profile_count}
- Tech Notes: {tech_note_count}

Features:
- Dashboard view with KPI cards, charts, and governance checklist (default landing page)
- Sidebar navigation for all projects
- Markdown rendering with syntax highlighting
- Mermaid diagram support (auto-rendered)
- GOV.UK Design System styling
- Responsive mobile layout
- Uses relative paths — works on any static hosting provider

Health Integration:
- Run `/arckit:health JSON=true` to generate docs/health.json
- Re-run `/arckit:pages` to display health data on the dashboard

Deployment:
The site uses relative paths and can be deployed to any static hosting provider:
- **GitHub Pages**: Settings > Pages > Source "Deploy from branch" > Branch "main", folder "/docs"
- **Netlify/Vercel**: Set publish directory to the repo root (docs/index.html references ../projects/)
- **Any static host**: Serve the entire repo directory; docs/index.html loads files via relative paths

Next Steps:
- Commit and push the docs/ folder
- Deploy to your hosting provider of choice
- Access your documentation site
```

## Important Notes

### Default Landing Page (Dashboard)

- **The dashboard (`#dashboard`) is the default landing page** — it shows automatically when no hash is present
- Set `defaultDocument` in manifest.json to the principles path (for backward compatibility and direct linking)
- The dashboard displays KPI cards, category charts, coverage bars, and governance checklist computed from manifest.json
- Users can navigate to any document via sidebar, search, or dashboard project table

---

**Remember**: The `sync-guides` hook handles ALL I/O before this command runs — guide sync, title extraction, repo info, template processing, project scanning, and manifest generation. The command MUST output the Step 5 summary using ONLY the stats from the hook's hook context. Do NOT call any tools — no Read, no Glob, no Write, no Bash. The hook's stats are the single source of truth.
