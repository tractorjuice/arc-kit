#!/usr/bin/env python3
"""Create the arckit-test-project-v46-sdg mono-repo.

Scaffolds a single GitHub repo containing all 17 UN SDGs as self-contained
ArcKit workspaces, with 78 pre-created UK Government technology projects.

Uses Python stdlib only (pathlib, subprocess, json, shutil, datetime).
"""

import json
import os
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ARCKIT_ROOT = Path(__file__).resolve().parent.parent
VERSION = (ARCKIT_ROOT / "VERSION").read_text().strip()
TODAY = date.today().isoformat()

REPO_NAME = "arckit-test-project-v46-sdg"
REPO_FULL = f"tractorjuice/{REPO_NAME}"
CLONE_BASE = Path("/tmp/arckit-test-setup")
REPO_DIR = CLONE_BASE / REPO_NAME

# ---------------------------------------------------------------------------
# SDG Data
# ---------------------------------------------------------------------------

SDGS = [
    {
        "number": 1,
        "name": "No Poverty",
        "slug": "no-poverty",
        "projects": [
            ("Universal Credit Modernisation", "universal-credit-modernisation", "DWP digital platform for benefits administration and claims processing"),
            ("Social Housing Allocation Platform", "social-housing-allocation-platform", "DLUHC system for fair, transparent social housing allocation"),
            ("Debt Advice Digital Service", "debt-advice-digital-service", "MaPS digital debt advice and financial guidance service"),
            ("Food Bank Coordination System", "food-bank-coordination-system", "Cross-government platform linking food banks with referral agencies"),
            ("Fuel Poverty Intervention Tracker", "fuel-poverty-intervention-tracker", "DESNZ system to identify and support fuel-poor households"),
        ],
    },
    {
        "number": 2,
        "name": "Zero Hunger",
        "slug": "zero-hunger",
        "projects": [
            ("Food Supply Chain Resilience Platform", "food-supply-chain-resilience-platform", "DEFRA system for monitoring UK food supply chain risks"),
            ("School Meals Management System", "school-meals-management-system", "DfE platform for free school meals eligibility and delivery"),
            ("Food Waste Reduction Analytics", "food-waste-reduction-analytics", "DEFRA data platform tracking food waste across the supply chain"),
            ("Agricultural Subsidy Management", "agricultural-subsidy-management", "DEFRA post-Brexit Environmental Land Management scheme platform"),
            ("National Food Strategy Dashboard", "national-food-strategy-dashboard", "Cabinet Office monitoring platform for national food strategy KPIs"),
        ],
    },
    {
        "number": 3,
        "name": "Good Health and Well-Being",
        "slug": "good-health",
        "projects": [
            ("NHS Appointment Booking Platform", "nhs-appointment-booking-platform", "DHSC next-generation patient appointment and referral system"),
            ("Mental Health Digital Triage", "mental-health-digital-triage", "NHS England AI-assisted mental health assessment and routing"),
            ("Pandemic Preparedness System", "pandemic-preparedness-system", "UKHSA disease surveillance and early warning platform"),
            ("Health Data Research Platform", "health-data-research-platform", "DHSC secure research environment for health data analytics"),
            ("Social Prescribing Link Worker System", "social-prescribing-link-worker-system", "NHS platform connecting patients with community support services"),
        ],
    },
    {
        "number": 4,
        "name": "Quality Education",
        "slug": "quality-education",
        "projects": [
            ("National Digital Learning Platform", "national-digital-learning-platform", "DfE unified learning platform for schools and colleges"),
            ("School Performance Analytics", "school-performance-analytics", "Ofsted data platform for school inspection and performance"),
            ("SEND Case Management System", "send-case-management-system", "DfE platform for Special Educational Needs and Disabilities support"),
            ("Apprenticeship Matching Service", "apprenticeship-matching-service", "DfE platform connecting apprentices with employers"),
            ("Teacher Recruitment Portal", "teacher-recruitment-portal", "DfE digital service for teacher training and recruitment"),
        ],
    },
    {
        "number": 5,
        "name": "Gender Equality",
        "slug": "gender-equality",
        "projects": [
            ("Gender Pay Gap Reporting Platform", "gender-pay-gap-reporting-platform", "GEO automated gender pay gap collection and analytics"),
            ("Domestic Abuse Case Management", "domestic-abuse-case-management", "Home Office multi-agency case management for DA support"),
            ("Workplace Equality Monitoring", "workplace-equality-monitoring", "EHRC platform for monitoring workplace equality duties"),
            ("Women in STEM Tracking Dashboard", "women-in-stem-tracking-dashboard", "DSIT platform tracking gender diversity in science and technology"),
        ],
    },
    {
        "number": 6,
        "name": "Clean Water and Sanitation",
        "slug": "clean-water",
        "projects": [
            ("Water Quality Monitoring Platform", "water-quality-monitoring-platform", "DEFRA real-time water quality monitoring across UK waterways"),
            ("Flood Risk Management System", "flood-risk-management-system", "Environment Agency flood forecasting and warning platform"),
            ("Wastewater Treatment Analytics", "wastewater-treatment-analytics", "Ofwat platform for sewage treatment performance monitoring"),
            ("Water Resource Planning Tool", "water-resource-planning-tool", "DEFRA long-term water supply and demand planning system"),
        ],
    },
    {
        "number": 7,
        "name": "Affordable and Clean Energy",
        "slug": "clean-energy",
        "projects": [
            ("Smart Meter Data Platform", "smart-meter-data-platform", "DESNZ national smart meter data collection and analytics"),
            ("Renewable Energy Grid Management", "renewable-energy-grid-management", "National Grid ESO platform for renewable energy integration"),
            ("Energy Performance Certificate System", "energy-performance-certificate-system", "DLUHC digital EPC rating and building efficiency platform"),
            ("Green Homes Grant Portal", "green-homes-grant-portal", "DESNZ application and management system for home energy grants"),
            ("Community Energy Fund Tracker", "community-energy-fund-tracker", "DESNZ platform for community renewable energy project funding"),
        ],
    },
    {
        "number": 8,
        "name": "Decent Work and Economic Growth",
        "slug": "economic-growth",
        "projects": [
            ("Job Matching Platform", "job-matching-platform", "DWP AI-powered job matching and career guidance service"),
            ("Skills Passport System", "skills-passport-system", "DfE digital skills and qualifications verification platform"),
            ("Labour Market Intelligence", "labour-market-intelligence", "ONS real-time labour market analytics and forecasting"),
            ("Small Business Support Portal", "small-business-support-portal", "DBT integrated support platform for SMEs"),
            ("Modern Slavery Reporting System", "modern-slavery-reporting-system", "Home Office platform for modern slavery transparency compliance"),
        ],
    },
    {
        "number": 9,
        "name": "Industry Innovation and Infrastructure",
        "slug": "innovation",
        "projects": [
            ("Digital Infrastructure Mapping", "digital-infrastructure-mapping", "DSIT national broadband and 5G coverage mapping platform"),
            ("Smart Transport Network", "smart-transport-network", "DfT connected transport infrastructure management"),
            ("Innovation Funding Platform", "innovation-funding-platform", "UKRI grants application and portfolio management system"),
            ("National Underground Asset Register", "national-underground-asset-register", "Geospatial Commission platform for sub-surface infrastructure"),
            ("Research Collaboration Hub", "research-collaboration-hub", "DSIT platform connecting UK research institutions with industry"),
        ],
    },
    {
        "number": 10,
        "name": "Reduced Inequalities",
        "slug": "reduced-inequalities",
        "projects": [
            ("Accessibility Compliance Platform", "accessibility-compliance-platform", "GDS monitoring service for public sector website accessibility"),
            ("Digital Inclusion Tracker", "digital-inclusion-tracker", "DSIT platform measuring digital skills and internet access gaps"),
            ("Levelling Up Dashboard", "levelling-up-dashboard", "DLUHC regional inequality monitoring and fund tracking"),
            ("Disability Confident Employer Portal", "disability-confident-employer-portal", "DWP platform for disability-inclusive employment certification"),
        ],
    },
    {
        "number": 11,
        "name": "Sustainable Cities and Communities",
        "slug": "sustainable-cities",
        "projects": [
            ("Smart City IoT Platform", "smart-city-iot-platform", "DLUHC connected sensors platform for urban services"),
            ("Urban Planning Analytics", "urban-planning-analytics", "DLUHC data-driven spatial planning and development system"),
            ("Public Transport Optimisation", "public-transport-optimisation", "DfT platform for multi-modal transport planning and scheduling"),
            ("Heritage Asset Management", "heritage-asset-management", "DCMS digital platform for listed buildings and heritage sites"),
            ("Air Quality Monitoring Network", "air-quality-monitoring-network", "DEFRA real-time air pollution monitoring and alerts"),
        ],
    },
    {
        "number": 12,
        "name": "Responsible Consumption and Production",
        "slug": "responsible-consumption",
        "projects": [
            ("Carbon Footprint Calculator", "carbon-footprint-calculator", "DESNZ product and service carbon footprint assessment tool"),
            ("Circular Economy Marketplace", "circular-economy-marketplace", "DEFRA platform connecting waste producers with recyclers"),
            ("Waste Management Analytics", "waste-management-analytics", "DEFRA national waste tracking and reporting platform"),
            ("Sustainable Procurement Portal", "sustainable-procurement-portal", "Crown Commercial Service green procurement decision support"),
        ],
    },
    {
        "number": 13,
        "name": "Climate Action",
        "slug": "climate-action",
        "projects": [
            ("Net Zero Tracking Dashboard", "net-zero-tracking-dashboard", "DESNZ national net zero progress monitoring platform"),
            ("Climate Risk Assessment Platform", "climate-risk-assessment-platform", "DEFRA infrastructure climate risk assessment and adaptation"),
            ("UK Emissions Trading Registry", "uk-emissions-trading-registry", "DESNZ carbon trading scheme registration and compliance"),
            ("Climate Adaptation Planning Tool", "climate-adaptation-planning-tool", "DEFRA local authority climate adaptation planning system"),
            ("Green Finance Taxonomy Platform", "green-finance-taxonomy-platform", "HMT platform for classifying green investment activities"),
        ],
    },
    {
        "number": 14,
        "name": "Life Below Water",
        "slug": "life-below-water",
        "projects": [
            ("Marine Protected Areas Monitoring", "marine-protected-areas-monitoring", "DEFRA surveillance platform for UK marine conservation zones"),
            ("Fishing Quota Management", "fishing-quota-management", "MMO digital catch reporting and quota allocation system"),
            ("Ocean Pollution Tracking", "ocean-pollution-tracking", "DEFRA platform for monitoring marine litter and pollution"),
            ("Coastal Erosion Monitoring", "coastal-erosion-monitoring", "Environment Agency coastal change mapping and prediction"),
        ],
    },
    {
        "number": 15,
        "name": "Life on Land",
        "slug": "life-on-land",
        "projects": [
            ("Biodiversity Net Gain Platform", "biodiversity-net-gain-platform", "DEFRA platform for biodiversity credits and habitat banking"),
            ("Forestry Management System", "forestry-management-system", "Forestry Commission woodland creation and management platform"),
            ("Land Use Planning Analytics", "land-use-planning-analytics", "DEFRA land use change monitoring and environmental impact"),
            ("Wildlife Crime Intelligence", "wildlife-crime-intelligence", "NCA platform for wildlife trafficking intelligence and enforcement"),
        ],
    },
    {
        "number": 16,
        "name": "Peace Justice and Strong Institutions",
        "slug": "peace-justice",
        "projects": [
            ("Digital Court Case Management", "digital-court-case-management", "HMCTS end-to-end digital case management for courts"),
            ("Legal Aid Digital Service", "legal-aid-digital-service", "LAA legal aid eligibility and application platform"),
            ("Open Government Data Portal", "open-government-data-portal", "Cabinet Office transparency and open data publishing platform"),
            ("Anti-Fraud Analytics Platform", "anti-fraud-analytics-platform", "Cabinet Office cross-government fraud detection and prevention"),
            ("Citizen Participation Platform", "citizen-participation-platform", "DLUHC digital platform for public consultations and engagement"),
        ],
    },
    {
        "number": 17,
        "name": "Partnerships for the Goals",
        "slug": "partnerships",
        "projects": [
            ("International Aid Tracking", "international-aid-tracking", "FCDO overseas development assistance tracking and reporting"),
            ("Cross-Government Data Sharing", "cross-government-data-sharing", "Cabinet Office platform for secure inter-departmental data exchange"),
            ("SDG Progress Dashboard", "sdg-progress-dashboard", "ONS UK SDG indicator monitoring and reporting platform"),
            ("Global Britain Trade Platform", "global-britain-trade-platform", "DBT international trade and partnership management system"),
        ],
    },
]

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------


def run(cmd: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess:
    """Run a subprocess command, printing it first. Exits on failure."""
    print(f"  > {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr.strip()}", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def write(path: Path, content: str) -> None:
    """Write content to a file, creating parent dirs as needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def gitkeep(path: Path) -> None:
    """Create a directory with a .gitkeep file."""
    path.mkdir(parents=True, exist_ok=True)
    (path / ".gitkeep").touch()


def fmt_sdg_num(n: int) -> str:
    """Format SDG number as zero-padded two-digit string."""
    return f"{n:02d}"


def fmt_project_num(n: int) -> str:
    """Format project number as zero-padded three-digit string."""
    return f"{n:03d}"


# ---------------------------------------------------------------------------
# Top-level file generators
# ---------------------------------------------------------------------------


def create_claude_settings() -> None:
    """Create .claude/settings.json."""
    settings = {
        "extraKnownMarketplaces": {
            "arc-kit": {
                "source": {
                    "source": "github",
                    "repo": "tractorjuice/arc-kit",
                }
            }
        },
        "enabledPlugins": {
            "arckit@arc-kit": True,
        },
    }
    write(REPO_DIR / ".claude" / "settings.json", json.dumps(settings, indent=2) + "\n")


def create_devcontainer() -> None:
    """Create .devcontainer/devcontainer.json."""
    devcontainer = {
        "postCreateCommand": "curl -fsSL https://claude.ai/install.sh | bash",
        "remoteEnv": {
            "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "64000",
        },
    }
    write(REPO_DIR / ".devcontainer" / "devcontainer.json", json.dumps(devcontainer, indent=2) + "\n")


def create_mcp_json() -> None:
    """Create .mcp.json with MCP server configs."""
    mcp = {
        "mcpServers": {
            "aws-knowledge": {
                "type": "http",
                "url": "https://knowledge-mcp.global.api.aws",
            },
            "microsoft-learn": {
                "type": "http",
                "url": "https://learn.microsoft.com/api/mcp",
            },
            "google-developer-knowledge": {
                "type": "http",
                "url": "https://developerknowledge.googleapis.com/mcp",
                "headers": {
                    "X-Goog-Api-Key": "${GOOGLE_API_KEY}",
                },
            },
            "datacommons-mcp": {
                "type": "http",
                "url": "https://api.datacommons.org/mcp",
                "headers": {
                    "X-API-Key": "${DATA_COMMONS_API_KEY}",
                },
            },
        }
    }
    write(REPO_DIR / ".mcp.json", json.dumps(mcp, indent=2) + "\n")


def create_version() -> None:
    """Create VERSION file."""
    write(REPO_DIR / "VERSION", VERSION + "\n")


def create_changelog() -> None:
    """Create CHANGELOG.md."""
    content = f"""# Changelog

All notable changes to this project will be documented in this file.

## [{VERSION}] - {TODAY}

### Added

- Initial mono-repo creation with 17 UN SDG workspaces
- 78 UK Government technology projects across all SDGs
- ArcKit plugin integration via marketplace
- MCP server configuration (AWS, Azure, GCP, Data Commons)
"""
    write(REPO_DIR / "CHANGELOG.md", content)


def build_sdg_table() -> str:
    """Build a Markdown table of all SDGs with project counts."""
    lines = [
        "| SDG | Name | Workspace | Projects |",
        "|-----|------|-----------|----------|",
    ]
    for sdg in SDGS:
        nn = fmt_sdg_num(sdg["number"])
        slug = sdg["slug"]
        lines.append(
            f"| {sdg['number']} | {sdg['name']} | `sdg-{nn}-{slug}/` | {len(sdg['projects'])} |"
        )
    return "\n".join(lines)


def create_claude_md() -> None:
    """Create top-level CLAUDE.md with navigation context."""
    sdg_listing = ""
    for sdg in SDGS:
        nn = fmt_sdg_num(sdg["number"])
        slug = sdg["slug"]
        sdg_listing += f"- `sdg-{nn}-{slug}/` -- SDG {sdg['number']}: {sdg['name']} ({len(sdg['projects'])} projects)\n"

    content = f"""# CLAUDE.md

## Overview

This is the **ArcKit SDG Mono-Repo** -- a single repository containing 17 UN Sustainable Development Goal workspaces, each with UK Government technology projects scaffolded for architecture governance using ArcKit.

**Total**: 17 SDG workspaces, 78 projects

## Navigation

Each SDG workspace is a self-contained ArcKit workspace under `sdg-{{NN}}-{{slug}}/`:

{sdg_listing}

## How to Use

1. Navigate to an SDG workspace directory
2. Use ArcKit slash commands to generate architecture artifacts for any project
3. Each project has its own `projects/{{NNN}}-{{slug}}/` directory with standard ArcKit structure

## ArcKit Commands

This repo uses the ArcKit plugin via the Claude Code marketplace. Commands are available as `/arckit.{{command}}` slash commands.

Key commands for getting started:
- `/arckit.stakeholders` -- Analyze stakeholder drivers and goals
- `/arckit.requirements` -- Define comprehensive requirements
- `/arckit.risk` -- Create risk register
- `/arckit.sobc` -- Create Strategic Outline Business Case
- `/arckit.research` -- Research technology options

## MCP Servers

Four MCP servers are configured for cloud platform research:
- **AWS Knowledge** -- AWS service documentation and recommendations
- **Microsoft Learn** -- Azure documentation and code samples
- **Google Developer Knowledge** -- GCP documentation
- **Data Commons** -- UN SDG indicators and statistical data

## Version

ArcKit Version: {VERSION}
"""
    write(REPO_DIR / "CLAUDE.md", content)


def create_readme() -> None:
    """Create top-level README.md."""
    sdg_table = build_sdg_table()
    total_projects = sum(len(s["projects"]) for s in SDGS)

    content = f"""# ArcKit SDG Mono-Repo

Enterprise Architecture Governance for UN Sustainable Development Goals -- UK Government Technology Projects

## Overview

This repository contains **{total_projects} UK Government technology projects** organised across all **17 UN Sustainable Development Goals (SDGs)**. Each SDG is a self-contained ArcKit workspace with pre-scaffolded project directories ready for architecture artifact generation.

## SDG Workspaces

{sdg_table}

**Total: {total_projects} projects across 17 SDGs**

## Getting Started

### Prerequisites

- [Claude Code](https://claude.ai/code) with ArcKit plugin enabled
- GitHub Codespaces (recommended) or local development environment

### Quick Start

1. Open this repo in GitHub Codespaces (Claude Code auto-installs via devcontainer)
2. Navigate to an SDG workspace: `cd sdg-01-no-poverty/`
3. Run ArcKit commands to generate architecture artifacts:

```bash
# Stakeholder analysis for a project
/arckit.stakeholders Universal Credit Modernisation

# Requirements specification
/arckit.requirements Universal Credit Modernisation

# Risk register
/arckit.risk Universal Credit Modernisation
```

## Repository Structure

```
{REPO_NAME}/
├── .claude/settings.json          # ArcKit plugin marketplace config
├── .devcontainer/devcontainer.json # Claude Code auto-install
├── .mcp.json                      # MCP server configuration
├── CLAUDE.md                      # AI assistant context
├── README.md                      # This file
├── CHANGELOG.md                   # Release history
├── VERSION                        # ArcKit version
├── docs/                          # Documentation
│   ├── README.md
│   ├── guides/
│   ├── DEPENDENCY-MATRIX.md
│   └── WORKFLOW-DIAGRAMS.md
└── sdg-NN-slug/                   # SDG workspaces (x17)
    ├── .arckit/                   # Workspace root marker
    ├── README.md                  # SDG overview with project table
    └── projects/
        ├── 000-global/            # Cross-project artifacts
        │   ├── policies/
        │   └── external/
        └── NNN-project-slug/      # Individual projects
            ├── README.md
            ├── external/
            └── vendors/
```

## ArcKit

This repository is powered by [ArcKit](https://github.com/tractorjuice/arc-kit) -- an Enterprise Architecture Governance & Vendor Procurement Toolkit providing 64 slash commands for AI coding assistants.

**Version**: {VERSION}
"""
    write(REPO_DIR / "README.md", content)


def create_docs() -> None:
    """Create docs/ directory with README and copy dependency/workflow files."""
    write(REPO_DIR / "docs" / "README.md", f"""# Documentation

ArcKit SDG Mono-Repo documentation.

## Guides

See `guides/` for ArcKit command usage guides.

## References

- [DEPENDENCY-MATRIX.md](DEPENDENCY-MATRIX.md) -- Command dependency matrix
- [WORKFLOW-DIAGRAMS.md](WORKFLOW-DIAGRAMS.md) -- Visual workflow diagrams

## ArcKit Version

{VERSION}
""")
    gitkeep(REPO_DIR / "docs" / "guides")

    # Copy dependency matrix and workflow diagrams from arc-kit
    src_dep = ARCKIT_ROOT / "docs" / "DEPENDENCY-MATRIX.md"
    src_wf = ARCKIT_ROOT / "docs" / "WORKFLOW-DIAGRAMS.md"
    if src_dep.exists():
        shutil.copy2(src_dep, REPO_DIR / "docs" / "DEPENDENCY-MATRIX.md")
    if src_wf.exists():
        shutil.copy2(src_wf, REPO_DIR / "docs" / "WORKFLOW-DIAGRAMS.md")


# ---------------------------------------------------------------------------
# SDG workspace generators
# ---------------------------------------------------------------------------


def create_project_readme(
    project_dir: Path,
    project_name: str,
    project_number: str,
    project_slug: str,
    description: str,
    sdg_name: str,
    sdg_number: int,
) -> None:
    """Create a project README matching create-project.sh output format."""
    dir_name = f"{project_number}-{project_slug}"
    content = f"""# {project_name}

Project ID: {project_number}
Created: {TODAY}

## Overview

{description}

**SDG Alignment**: SDG {sdg_number} -- {sdg_name}

## Workflow

Use ArcKit commands to generate project artifacts in the recommended order:

### Discovery Phase
1. `/arckit.stakeholders` - Analyze stakeholder drivers and goals
2. `/arckit.risk` - Create risk register
3. `/arckit.sobc` - Create Strategic Outline Business Case

### Alpha Phase
4. `/arckit.requirements` - Define comprehensive requirements
5. `/arckit.data-model` - Design data model and GDPR compliance
6. `/arckit.wardley` - Create Wardley maps for strategic planning
7. `/arckit.research` - Research technology options (if needed)
8. `/arckit.sow` - Generate Statement of Work for vendor procurement (if needed)
9. `/arckit.evaluate` - Create vendor evaluation framework (if needed)

### Beta Phase
10. `/arckit.hld-review` - Review High-Level Design
11. `/arckit.dld-review` - Review Detailed Design
12. `/arckit.traceability` - Generate requirements traceability matrix

### Compliance (as needed)
- `/arckit.secure` - UK Government Secure by Design review
- `/arckit.tcop` - Technology Code of Practice assessment
- `/arckit.ai-playbook` - AI Playbook compliance (for AI systems)

## Project Structure

Documents use standardized naming: `ARC-{{PROJECT_ID}}-{{TYPE}}-v{{VERSION}}.md`

```
{dir_name}/
├── README.md (this file)
│
├── # Core Documents
├── ARC-{project_number}-STKE-v1.0.md     # Stakeholder drivers (/arckit.stakeholders)
├── ARC-{project_number}-RISK-v1.0.md     # Risk register (/arckit.risk)
├── ARC-{project_number}-SOBC-v1.0.md     # Business case (/arckit.sobc)
├── ARC-{project_number}-REQ-v1.0.md      # Requirements (/arckit.requirements)
├── ARC-{project_number}-DATA-v1.0.md     # Data model (/arckit.data-model)
├── ARC-{project_number}-RSCH-v1.0.md     # Research findings (/arckit.research)
├── ARC-{project_number}-TRAC-v1.0.md     # Traceability matrix (/arckit.traceability)
│
├── # Procurement
├── ARC-{project_number}-SOW-v1.0.md      # Statement of Work (/arckit.sow)
├── ARC-{project_number}-EVAL-v1.0.md     # Evaluation criteria (/arckit.evaluate)
│
├── # Multi-instance Documents (subdirectories)
├── decisions/
│   ├── ARC-{project_number}-ADR-001-v1.0.md  # Architecture decisions (/arckit.adr)
│   └── ARC-{project_number}-ADR-002-v1.0.md
├── diagrams/
│   └── ARC-{project_number}-DIAG-001-v1.0.md # Diagrams (/arckit.diagram)
├── wardley-maps/
│   └── ARC-{project_number}-WARD-001-v1.0.md # Wardley maps (/arckit.wardley)
├── reviews/
│   ├── ARC-{project_number}-HLD-v1.0.md      # HLD review (/arckit.hld-review)
│   └── ARC-{project_number}-DLD-v1.0.md      # DLD review (/arckit.dld-review)
│
├── external/                            # External documents (PDFs, specs, reports)
└── vendors/                             # Vendor proposals
```

## Document Type Codes

| Code | Document Type |
|------|---------------|
| REQ | Requirements |
| STKE | Stakeholder Analysis |
| RISK | Risk Register |
| SOBC | Strategic Outline Business Case |
| DATA | Data Model |
| ADR | Architecture Decision Record |
| RSCH | Research Findings |
| SOW | Statement of Work |
| EVAL | Evaluation Criteria |
| HLD | High-Level Design Review |
| DLD | Detailed-Level Design Review |
| TRAC | Traceability Matrix |
| DIAG | Architecture Diagram |
| WARD | Wardley Map |
| TCOP | Technology Code of Practice |
| SECD | Secure by Design |

## Status

Track your progress through the workflow:

**Discovery Phase:**
- [ ] Stakeholder analysis complete
- [ ] Risk register created
- [ ] Business case approved

**Alpha Phase:**
- [ ] Requirements defined
- [ ] Data model designed
- [ ] Vendor procurement started (if needed)

**Beta Phase:**
- [ ] HLD reviewed and approved
- [ ] DLD reviewed and approved
- [ ] Traceability matrix validated

**Live Phase:**
- [ ] Implementation complete
- [ ] Production deployment
"""
    write(project_dir / "README.md", content)


def create_sdg_workspace(sdg: dict) -> None:
    """Create a complete SDG workspace directory."""
    nn = fmt_sdg_num(sdg["number"])
    slug = sdg["slug"]
    workspace_dir = REPO_DIR / f"sdg-{nn}-{slug}"

    # .arckit workspace root marker
    gitkeep(workspace_dir / ".arckit")

    # Global project directories
    gitkeep(workspace_dir / "projects" / "000-global" / "policies")
    gitkeep(workspace_dir / "projects" / "000-global" / "external")

    # Build project table for SDG README
    project_rows = []
    for idx, (name, proj_slug, desc) in enumerate(sdg["projects"], start=1):
        pid = fmt_project_num(idx)
        project_rows.append(f"| {pid} | {name} | {desc} |")

    project_table = "| ID | Project | Description |\n|-----|---------|-------------|\n" + "\n".join(project_rows)

    # SDG-level README
    sdg_readme = f"""# SDG {sdg['number']}: {sdg['name']}

UN Sustainable Development Goal {sdg['number']} -- UK Government Technology Projects

## Projects

{project_table}

## Getting Started

Navigate to a project directory and use ArcKit commands:

```bash
cd projects/{fmt_project_num(1)}-{sdg['projects'][0][1]}/
/arckit.stakeholders {sdg['projects'][0][0]}
```

## Workspace Structure

```
sdg-{nn}-{slug}/
├── .arckit/                    # Workspace root marker
├── README.md                   # This file
└── projects/
    ├── 000-global/             # Cross-project artifacts
    │   ├── policies/
    │   └── external/
"""
    for idx, (name, proj_slug, _desc) in enumerate(sdg["projects"], start=1):
        pid = fmt_project_num(idx)
        sdg_readme += f"    ├── {pid}-{proj_slug}/\n"
    sdg_readme += "```\n"

    write(workspace_dir / "README.md", sdg_readme)

    # Create individual projects
    for idx, (name, proj_slug, desc) in enumerate(sdg["projects"], start=1):
        pid = fmt_project_num(idx)
        project_dir = workspace_dir / "projects" / f"{pid}-{proj_slug}"
        project_dir.mkdir(parents=True, exist_ok=True)

        create_project_readme(
            project_dir=project_dir,
            project_name=name,
            project_number=pid,
            project_slug=proj_slug,
            description=desc,
            sdg_name=sdg["name"],
            sdg_number=sdg["number"],
        )
        gitkeep(project_dir / "external")
        gitkeep(project_dir / "vendors")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    """Create the SDG mono-repo."""
    total_projects = sum(len(s["projects"]) for s in SDGS)
    print(f"ArcKit SDG Mono-Repo Creator")
    print(f"Version: {VERSION}")
    print(f"SDGs: {len(SDGS)}, Projects: {total_projects}")
    print()

    # 1. Clean up any previous attempt
    if REPO_DIR.exists():
        print(f"Removing existing {REPO_DIR}...")
        shutil.rmtree(REPO_DIR)
    CLONE_BASE.mkdir(parents=True, exist_ok=True)

    # 2. Create GitHub repo and clone into target dir
    print(f"\nCreating GitHub repo {REPO_FULL}...")
    orig_cwd = os.getcwd()
    os.chdir(CLONE_BASE)
    run([
        "gh", "repo", "create", REPO_FULL,
        "--public",
        "--clone",
        "--description", f"ArcKit SDG Mono-Repo: 17 UN SDGs, {total_projects} UK Government technology projects",
    ])
    os.chdir(orig_cwd)

    # 3. Scaffold top-level files
    print("\nCreating top-level files...")
    create_claude_settings()
    create_devcontainer()
    create_mcp_json()
    create_version()
    create_changelog()
    create_claude_md()
    create_readme()
    create_docs()

    # 4. Create SDG workspaces
    print("\nCreating SDG workspaces...")
    for sdg in SDGS:
        nn = fmt_sdg_num(sdg["number"])
        print(f"  SDG {sdg['number']:2d}: {sdg['name']} ({len(sdg['projects'])} projects)")
        create_sdg_workspace(sdg)

    # 5. Git commit and push
    print("\nCommitting and pushing...")
    run(["git", "add", "-A"], cwd=REPO_DIR)
    run([
        "git", "commit", "-m",
        f"feat: initial SDG mono-repo with 17 SDGs and {total_projects} UK Government projects\n\nArcKit Version: {VERSION}\n\nCo-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>",
    ], cwd=REPO_DIR)
    run(["git", "push", "-u", "origin", "main"], cwd=REPO_DIR)

    # 6. Clean up (only after successful push)
    print("\nCleaning up...")
    shutil.rmtree(CLONE_BASE)

    print(f"\nDone! Repo created at https://github.com/{REPO_FULL}")


if __name__ == "__main__":
    main()
