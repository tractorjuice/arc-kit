# SDG Mono-Repo Design

**Date**: 2026-03-09
**Issue**: #44
**Status**: Approved

## Summary

Create a single GitHub repo (`arckit-test-project-v46-sdg`) containing all 17 UN Sustainable Development Goals as self-contained ArcKit workspaces, with 78 pre-created UK Government technology projects across them.

## Approach

Standalone Python script (`scripts/create-sdg-repo.py`) that creates the repo, scaffolds all files, and pushes to GitHub. Does not reuse `create-project.sh` — replicates its logic to avoid fighting with repo-root assumptions.

## Repo Structure

```text
arckit-test-project-v46-sdg/
├── .claude/settings.json          # Plugin marketplace config
├── .devcontainer/devcontainer.json
├── .mcp.json                      # Data Commons + AWS + Azure + Google MCPs
├── CLAUDE.md                      # Top-level context
├── README.md                      # Overview of all 17 SDGs
├── CHANGELOG.md
├── VERSION
├── docs/
│   ├── README.md
│   ├── guides/.gitkeep
│   ├── DEPENDENCY-MATRIX.md
│   └── WORKFLOW-DIAGRAMS.md
│
├── sdg-01-no-poverty/
│   ├── .arckit/.gitkeep           # ArcKit workspace root marker
│   ├── README.md                  # SDG-level readme
│   └── projects/
│       ├── 000-global/
│       │   ├── policies/
│       │   └── external/
│       ├── 001-universal-credit-modernisation/
│       │   ├── README.md
│       │   ├── external/
│       │   └── vendors/
│       ├── 002-social-housing-allocation-platform/
│       └── ... (5 projects)
│
├── sdg-02-zero-hunger/
│   └── ... (5 projects)
│
└── ... (17 SDG directories, 78 projects total)
```

## Key Design Decisions

### One repo, not 17

Issue #44 originally proposed 17 separate repos (v46-v62). Consolidating into one repo reduces GitHub sprawl and keeps all SDG work in one place. Each SDG dir is a self-contained ArcKit workspace.

### `.arckit/` per SDG directory

Each `sdg-XX/` dir contains `.arckit/.gitkeep` so that `create-project.sh` and other scripts find the correct workspace root when the user `cd`s into an SDG directory. This means `find_repo_root()` in `common.sh` resolves to the SDG dir, not the top-level repo.

### Plugin-only (no CLI init)

Each SDG workspace uses the Claude Code plugin (enabled via top-level `.claude/settings.json`). No `.codex/`, `.opencode/`, or CLI scaffolding. Matches the plugin-only pattern used by all test repos since v23.

### Pre-created project directories

All 78 project directories are created by the script with README.md, external/, and vendors/ subdirectories. Projects are ready for immediate use with ArcKit commands.

### All 4 MCP servers

The `.mcp.json` includes all MCP servers from the plugin:
- `aws-knowledge` — AWS service research
- `microsoft-learn` — Azure documentation
- `google-developer-knowledge` — GCP documentation
- `datacommons-mcp` — UN SDG datasets (population, GDP, health, climate, education)

## `.mcp.json`

```json
{
  "mcpServers": {
    "aws-knowledge": {
      "type": "http",
      "url": "https://knowledge-mcp.global.api.aws"
    },
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    },
    "google-developer-knowledge": {
      "type": "http",
      "url": "https://developerknowledge.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${GOOGLE_API_KEY}"
      }
    },
    "datacommons-mcp": {
      "type": "http",
      "url": "https://api.datacommons.org/mcp",
      "headers": {
        "X-API-Key": "${DATA_COMMONS_API_KEY}"
      }
    }
  }
}
```

## Script: `scripts/create-sdg-repo.py`

### Data structure

```python
SDGS = [
    {
        "number": 1,
        "name": "No Poverty",
        "slug": "no-poverty",
        "projects": [
            {"name": "Universal Credit Modernisation", "desc": "DWP digital platform..."},
            ...
        ]
    },
    ...  # all 17 SDGs, 78 projects
]
```

### Steps

1. Read `VERSION` from main repo
2. Create repo via `gh repo create tractorjuice/arckit-test-project-v46-sdg --public --clone`
3. Scaffold top-level files:
   - `.claude/settings.json` (plugin marketplace)
   - `.devcontainer/devcontainer.json` (Claude Code auto-install)
   - `.mcp.json` (4 MCP servers)
   - `CLAUDE.md` (navigation context)
   - `README.md` (SDG overview with project tables)
   - `CHANGELOG.md`
   - `VERSION`
   - `docs/README.md`, `docs/guides/.gitkeep`
   - Copy `docs/DEPENDENCY-MATRIX.md` and `docs/WORKFLOW-DIAGRAMS.md` from main repo
4. Loop through 17 SDGs:
   - Create `sdg-{NN}-{slug}/`
   - Create `.arckit/.gitkeep`
   - Create `projects/000-global/policies/`, `projects/000-global/external/`
   - Create SDG-level `README.md`
   - Loop through projects:
     - Create `projects/{NNN}-{slug}/`
     - Create `README.md` (project workflow, document codes, status checklist)
     - Create `external/` and `vendors/` dirs (with `.gitkeep`)
5. `git add -A && git commit && git push`
6. Clean up `/tmp/`

### Workflow

```bash
# Run from arc-kit repo
python scripts/create-sdg-repo.py

# Then in any SDG workspace:
cd /path/to/arckit-test-project-v46-sdg/sdg-01-no-poverty/
# ArcKit commands work from here
/arckit:stakeholders "Universal Credit Modernisation"
```

## SDG-to-Project Mapping

### SDG 1: No Poverty (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Universal Credit Modernisation | DWP digital platform for benefits administration and claims processing |
| 002 | Social Housing Allocation Platform | DLUHC system for fair, transparent social housing allocation |
| 003 | Debt Advice Digital Service | MaPS digital debt advice and financial guidance service |
| 004 | Food Bank Coordination System | Cross-government platform linking food banks with referral agencies |
| 005 | Fuel Poverty Intervention Tracker | DESNZ system to identify and support fuel-poor households |

### SDG 2: Zero Hunger (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Food Supply Chain Resilience Platform | DEFRA system for monitoring UK food supply chain risks |
| 002 | School Meals Management System | DfE platform for free school meals eligibility and delivery |
| 003 | Food Waste Reduction Analytics | DEFRA data platform tracking food waste across the supply chain |
| 004 | Agricultural Subsidy Management | DEFRA post-Brexit Environmental Land Management scheme platform |
| 005 | National Food Strategy Dashboard | Cabinet Office monitoring platform for national food strategy KPIs |

### SDG 3: Good Health and Well-Being (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | NHS Appointment Booking Platform | DHSC next-generation patient appointment and referral system |
| 002 | Mental Health Digital Triage | NHS England AI-assisted mental health assessment and routing |
| 003 | Pandemic Preparedness System | UKHSA disease surveillance and early warning platform |
| 004 | Health Data Research Platform | DHSC secure research environment for health data analytics |
| 005 | Social Prescribing Link Worker System | NHS platform connecting patients with community support services |

### SDG 4: Quality Education (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | National Digital Learning Platform | DfE unified learning platform for schools and colleges |
| 002 | School Performance Analytics | Ofsted data platform for school inspection and performance |
| 003 | SEND Case Management System | DfE platform for Special Educational Needs and Disabilities support |
| 004 | Apprenticeship Matching Service | DfE platform connecting apprentices with employers |
| 005 | Teacher Recruitment Portal | DfE digital service for teacher training and recruitment |

### SDG 5: Gender Equality (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Gender Pay Gap Reporting Platform | GEO automated gender pay gap collection and analytics |
| 002 | Domestic Abuse Case Management | Home Office multi-agency case management for DA support |
| 003 | Workplace Equality Monitoring | EHRC platform for monitoring workplace equality duties |
| 004 | Women in STEM Tracking Dashboard | DSIT platform tracking gender diversity in science and technology |

### SDG 6: Clean Water and Sanitation (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Water Quality Monitoring Platform | DEFRA real-time water quality monitoring across UK waterways |
| 002 | Flood Risk Management System | Environment Agency flood forecasting and warning platform |
| 003 | Wastewater Treatment Analytics | Ofwat platform for sewage treatment performance monitoring |
| 004 | Water Resource Planning Tool | DEFRA long-term water supply and demand planning system |

### SDG 7: Affordable and Clean Energy (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Smart Meter Data Platform | DESNZ national smart meter data collection and analytics |
| 002 | Renewable Energy Grid Management | National Grid ESO platform for renewable energy integration |
| 003 | Energy Performance Certificate System | DLUHC digital EPC rating and building efficiency platform |
| 004 | Green Homes Grant Portal | DESNZ application and management system for home energy grants |
| 005 | Community Energy Fund Tracker | DESNZ platform for community renewable energy project funding |

### SDG 8: Decent Work and Economic Growth (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Job Matching Platform | DWP AI-powered job matching and career guidance service |
| 002 | Skills Passport System | DfE digital skills and qualifications verification platform |
| 003 | Labour Market Intelligence | ONS real-time labour market analytics and forecasting |
| 004 | Small Business Support Portal | DBT integrated support platform for SMEs |
| 005 | Modern Slavery Reporting System | Home Office platform for modern slavery transparency compliance |

### SDG 9: Industry Innovation and Infrastructure (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Digital Infrastructure Mapping | DSIT national broadband and 5G coverage mapping platform |
| 002 | Smart Transport Network | DfT connected transport infrastructure management |
| 003 | Innovation Funding Platform | UKRI grants application and portfolio management system |
| 004 | National Underground Asset Register | Geospatial Commission platform for sub-surface infrastructure |
| 005 | Research Collaboration Hub | DSIT platform connecting UK research institutions with industry |

### SDG 10: Reduced Inequalities (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Accessibility Compliance Platform | GDS monitoring service for public sector website accessibility |
| 002 | Digital Inclusion Tracker | DSIT platform measuring digital skills and internet access gaps |
| 003 | Levelling Up Dashboard | DLUHC regional inequality monitoring and fund tracking |
| 004 | Disability Confident Employer Portal | DWP platform for disability-inclusive employment certification |

### SDG 11: Sustainable Cities and Communities (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Smart City IoT Platform | DLUHC connected sensors platform for urban services |
| 002 | Urban Planning Analytics | DLUHC data-driven spatial planning and development system |
| 003 | Public Transport Optimisation | DfT platform for multi-modal transport planning and scheduling |
| 004 | Heritage Asset Management | DCMS digital platform for listed buildings and heritage sites |
| 005 | Air Quality Monitoring Network | DEFRA real-time air pollution monitoring and alerts |

### SDG 12: Responsible Consumption and Production (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Carbon Footprint Calculator | DESNZ product and service carbon footprint assessment tool |
| 002 | Circular Economy Marketplace | DEFRA platform connecting waste producers with recyclers |
| 003 | Waste Management Analytics | DEFRA national waste tracking and reporting platform |
| 004 | Sustainable Procurement Portal | Crown Commercial Service green procurement decision support |

### SDG 13: Climate Action (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Net Zero Tracking Dashboard | DESNZ national net zero progress monitoring platform |
| 002 | Climate Risk Assessment Platform | DEFRA infrastructure climate risk assessment and adaptation |
| 003 | UK Emissions Trading Registry | DESNZ carbon trading scheme registration and compliance |
| 004 | Climate Adaptation Planning Tool | DEFRA local authority climate adaptation planning system |
| 005 | Green Finance Taxonomy Platform | HMT platform for classifying green investment activities |

### SDG 14: Life Below Water (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Marine Protected Areas Monitoring | DEFRA surveillance platform for UK marine conservation zones |
| 002 | Fishing Quota Management | MMO digital catch reporting and quota allocation system |
| 003 | Ocean Pollution Tracking | DEFRA platform for monitoring marine litter and pollution |
| 004 | Coastal Erosion Monitoring | Environment Agency coastal change mapping and prediction |

### SDG 15: Life on Land (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Biodiversity Net Gain Platform | DEFRA platform for biodiversity credits and habitat banking |
| 002 | Forestry Management System | Forestry Commission woodland creation and management platform |
| 003 | Land Use Planning Analytics | DEFRA land use change monitoring and environmental impact |
| 004 | Wildlife Crime Intelligence | NCA platform for wildlife trafficking intelligence and enforcement |

### SDG 16: Peace Justice and Strong Institutions (5 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | Digital Court Case Management | HMCTS end-to-end digital case management for courts |
| 002 | Legal Aid Digital Service | LAA legal aid eligibility and application platform |
| 003 | Open Government Data Portal | Cabinet Office transparency and open data publishing platform |
| 004 | Anti-Fraud Analytics Platform | Cabinet Office cross-government fraud detection and prevention |
| 005 | Citizen Participation Platform | DLUHC digital platform for public consultations and engagement |

### SDG 17: Partnerships for the Goals (4 projects)

| # | Project | Description |
|---|---------|-------------|
| 001 | International Aid Tracking | FCDO overseas development assistance tracking and reporting |
| 002 | Cross-Government Data Sharing | Cabinet Office platform for secure inter-departmental data exchange |
| 003 | SDG Progress Dashboard | ONS UK SDG indicator monitoring and reporting platform |
| 004 | Global Britain Trade Platform | DBT international trade and partnership management system |

## Version Numbering

- Repo uses `v46` (per issue #44 comment: v44 and v45 already taken)
- Total test repos after creation: 47 (v0-v46), but only one new repo instead of 17
- Issue #44 to be updated to reflect the mono-repo approach
