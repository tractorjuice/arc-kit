#!/usr/bin/env bash
# Create a new ArcKit project for requirements and vendor management

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Usage function
usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Create a new ArcKit project for architecture governance.

Options:
    --name "PROJECT_NAME"    Name of the project (optional - will prompt if not provided)
    --json                   Output JSON for AI agent consumption
    --force                  Skip prerequisites check (not recommended)

Examples:
    $0 --name "Payment Gateway Modernization"
    $0 --json
    $0 --name "M365 Integration" --json

Interactive Mode:
    If --name is not provided, the script will prompt you for a project name.
EOF
    exit 1
}

# Parse arguments
PROJECT_NAME=""
OUTPUT_JSON=false
FORCE_CREATE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --name)
            PROJECT_NAME="$2"
            shift 2
            ;;
        --json)
            OUTPUT_JSON=true
            shift
            ;;
        --force)
            FORCE_CREATE=true
            shift
            ;;
        --help|-h)
            usage
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Find repository root first
REPO_ROOT="$(find_repo_root)"

# Check prerequisites (unless --force is used)
if [[ "$FORCE_CREATE" != "true" ]]; then
    ARCKIT_DIR="$(get_arckit_dir "$REPO_ROOT")"
    GLOBAL_DIR="$(get_memory_dir "$REPO_ROOT")"

    # Look for principles file with new naming convention (ARC-000-PRIN-*.md)
    PRINCIPLES_FILE=$(find "$GLOBAL_DIR" -name "ARC-000-PRIN-*.md" 2>/dev/null | head -1)

    if [[ -z "$PRINCIPLES_FILE" || ! -f "$PRINCIPLES_FILE" ]]; then
        log_error "Prerequisites not met: Architecture principles not found"
        log_error "Expected: projects/000-global/ARC-000-PRIN-v*.md"
        log_error ""
        log_error "Before creating a project, you must define architecture principles"
        log_error "Run: /arckit.principles"
        log_error ""
        log_error "Or use --force to skip this check (not recommended)"
        exit 1
    fi

    log_success "Prerequisites check passed"
fi

# Interactive mode - prompt for project name if not provided
if [[ -z "$PROJECT_NAME" ]]; then
    if [[ "$OUTPUT_JSON" == "true" ]]; then
        # In JSON mode, we can't do interactive prompts
        log_error "Project name is required in JSON mode"
        echo '{"error": "Project name is required", "success": false}'
        exit 1
    fi

    log_info "Interactive mode: Creating a new ArcKit project"
    echo ""
    read -p "Enter project name: " PROJECT_NAME

    if [[ -z "$PROJECT_NAME" ]]; then
        log_error "Project name cannot be empty"
        exit 1
    fi
fi

# Get next project number
PROJECT_NUMBER="$(get_next_project_number "$REPO_ROOT")"
log_info "Project number: $PROJECT_NUMBER"

# Create project slug
PROJECT_SLUG="$(slugify "$PROJECT_NAME")"
PROJECT_DIR_NAME="${PROJECT_NUMBER}-${PROJECT_SLUG}"
PROJECT_DIR="$REPO_ROOT/projects/$PROJECT_DIR_NAME"

log_info "Creating project: $PROJECT_DIR_NAME"

# Create project directory structure
create_project_dir "$PROJECT_DIR"

# Create README for external documents directory
cat > "$PROJECT_DIR/external/README.md" <<'EXTEOF'
# External Documents

Place external reference documents here for ArcKit commands to read as context.

## Supported File Types
- PDF (.pdf)
- Word (.docx)
- Markdown (.md)
- Images (.png, .jpg) - for diagrams and screenshots
- CSV (.csv) - for data exports
- SQL (.sql) - for database schemas

## What to Put Here
- RFP/ITT documents
- Legacy system specifications
- User research reports
- Previous assessments and audits
- Database schemas and ERD diagrams
- Compliance evidence and certificates
- Vendor proposals and technical responses
- Performance benchmarks and test results

## How It Works
ArcKit commands automatically scan this directory when generating artifacts.
External documents enhance output quality but are never blocking.

## See Also
- `projects/000-global/policies/` - Organization-wide standards and governance documents
EXTEOF

# Ensure 000-global/policies exists and has a README
GLOBAL_POLICIES_DIR="$REPO_ROOT/projects/000-global/policies"
if [[ -d "$REPO_ROOT/projects/000-global" ]]; then
    mkdir -p "$GLOBAL_POLICIES_DIR"
    if [[ ! -f "$GLOBAL_POLICIES_DIR/README.md" ]]; then
        cat > "$GLOBAL_POLICIES_DIR/README.md" <<'POLEOF'
# Organization Policies

Place organization-wide governance documents here. These are read by commands across ALL projects.

## Supported File Types
- PDF (.pdf), Word (.docx), Markdown (.md)

## What to Put Here
- Architecture principles and TOGAF standards
- Security policies and compliance frameworks
- Risk appetite statements and threat assessments
- Technology standards and approved platforms
- Procurement policies and spending thresholds
- Cloud-first mandates and approved supplier lists
- AI governance frameworks and ethical guidelines
- MOD/Defence security policies (JSP 440, CAAT)

## How It Works
Commands like /arckit.principles, /arckit.risk, /arckit.secure, and /arckit.sobc
automatically scan this directory for organizational context.
POLEOF
    fi
fi

# Ensure 000-global/external exists and has a README
GLOBAL_EXTERNAL_DIR="$REPO_ROOT/projects/000-global/external"
if [[ -d "$REPO_ROOT/projects/000-global" ]]; then
    mkdir -p "$GLOBAL_EXTERNAL_DIR"
    if [[ ! -f "$GLOBAL_EXTERNAL_DIR/README.md" ]]; then
        cat > "$GLOBAL_EXTERNAL_DIR/README.md" <<'GEXTEOF'
# Global External Documents

Place organization-wide reference documents here. These are read by commands across ALL projects.

## Supported File Types
- PDF (.pdf), Word (.docx), Markdown (.md)
- Images (.png, .jpg) - for diagrams and screenshots
- CSV (.csv) - for data exports
- SQL (.sql) - for database schemas

## What to Put Here
- Enterprise architecture blueprints and reference models
- Organization-wide technology standards documents
- Shared compliance evidence and audit reports
- Cross-project strategy and transformation documents
- Industry benchmarks and analyst reports

## How It Works
ArcKit commands automatically scan this directory alongside project-level
external documents when generating artifacts.

## See Also
- `projects/000-global/policies/` - Governance policies (risk appetite, security, procurement)
- `projects/{NNN}-{name}/external/` - Project-specific reference documents
GEXTEOF
    fi
fi

# Create a README for the project
cat > "$PROJECT_DIR/README.md" <<EOF
# $PROJECT_NAME

Project ID: $PROJECT_NUMBER
Created: $(date +"%Y-%m-%d")

## Overview

[Project description to be added]

## Workflow

Use ArcKit commands to generate project artifacts in the recommended order:

### Discovery Phase
1. \`/arckit.stakeholders\` - Analyze stakeholder drivers and goals
2. \`/arckit.risk\` - Create risk register
3. \`/arckit.sobc\` - Create Strategic Outline Business Case

### Alpha Phase
4. \`/arckit.requirements\` - Define comprehensive requirements
5. \`/arckit.data-model\` - Design data model and GDPR compliance
6. \`/arckit.wardley\` - Create Wardley maps for strategic planning
7. \`/arckit.research\` - Research technology options (if needed)
8. \`/arckit.sow\` - Generate Statement of Work for vendor procurement (if needed)
9. \`/arckit.evaluate\` - Create vendor evaluation framework (if needed)

### Beta Phase
10. \`/arckit.hld-review\` - Review High-Level Design
11. \`/arckit.dld-review\` - Review Detailed Design
12. \`/arckit.traceability\` - Generate requirements traceability matrix

### Compliance (as needed)
- \`/arckit.secure\` - UK Government Secure by Design review
- \`/arckit.tcop\` - Technology Code of Practice assessment
- \`/arckit.ai-playbook\` - AI Playbook compliance (for AI systems)

## Project Structure

Documents use standardized naming: \`ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md\`

\`\`\`
$PROJECT_DIR_NAME/
├── README.md (this file)
│
├── # Core Documents
├── ARC-$PROJECT_NUMBER-STKE-v1.0.md     # Stakeholder drivers (/arckit.stakeholders)
├── ARC-$PROJECT_NUMBER-RISK-v1.0.md     # Risk register (/arckit.risk)
├── ARC-$PROJECT_NUMBER-SOBC-v1.0.md     # Business case (/arckit.sobc)
├── ARC-$PROJECT_NUMBER-REQ-v1.0.md      # Requirements (/arckit.requirements)
├── ARC-$PROJECT_NUMBER-DATA-v1.0.md     # Data model (/arckit.data-model)
├── ARC-$PROJECT_NUMBER-RSCH-v1.0.md     # Research findings (/arckit.research)
├── ARC-$PROJECT_NUMBER-TRAC-v1.0.md     # Traceability matrix (/arckit.traceability)
│
├── # Procurement
├── ARC-$PROJECT_NUMBER-SOW-v1.0.md      # Statement of Work (/arckit.sow)
├── ARC-$PROJECT_NUMBER-EVAL-v1.0.md     # Evaluation criteria (/arckit.evaluate)
│
├── # Multi-instance Documents (subdirectories)
├── decisions/
│   ├── ARC-$PROJECT_NUMBER-ADR-001-v1.0.md  # Architecture decisions (/arckit.adr)
│   └── ARC-$PROJECT_NUMBER-ADR-002-v1.0.md
├── diagrams/
│   └── ARC-$PROJECT_NUMBER-DIAG-001-v1.0.md # Diagrams (/arckit.diagram)
├── wardley-maps/
│   └── ARC-$PROJECT_NUMBER-WARD-001-v1.0.md # Wardley maps (/arckit.wardley)
├── reviews/
│   ├── ARC-$PROJECT_NUMBER-HLD-v1.0.md      # HLD review (/arckit.hld-review)
│   └── ARC-$PROJECT_NUMBER-DLD-v1.0.md      # DLD review (/arckit.dld-review)
│
├── external/                            # External documents (PDFs, specs, reports)
└── vendors/                             # Vendor proposals
\`\`\`

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
EOF

log_success "Project created successfully"

# Determine next steps based on what artifacts exist
NEXT_STEPS=()
TEMPLATES_DIR="$(get_templates_dir "$REPO_ROOT")"

# Helper to check if a document exists (supports both old and new naming)
has_doc() {
    local type_code="$1"
    # Check new naming pattern: ARC-{PID}-{TYPE}-v*.md
    if ls "$PROJECT_DIR"/ARC-${PROJECT_NUMBER}-${type_code}-v*.md 1>/dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Check if stakeholder analysis exists in project (old or new naming)
if ! has_doc "STKE" && [[ ! -f "$PROJECT_DIR/stakeholder-drivers.md" ]]; then
    NEXT_STEPS+=("/arckit.stakeholders - Analyze stakeholder drivers and goals")
elif ! has_doc "RISK" && [[ ! -f "$PROJECT_DIR/risk-register.md" ]]; then
    NEXT_STEPS+=("/arckit.risk - Create risk register")
elif ! has_doc "SOBC" && [[ ! -f "$PROJECT_DIR/sobc.md" ]]; then
    NEXT_STEPS+=("/arckit.sobc - Create Strategic Outline Business Case")
elif ! has_doc "REQ" && [[ ! -f "$PROJECT_DIR/requirements.md" ]]; then
    NEXT_STEPS+=("/arckit.requirements - Define business and technical requirements")
elif ! has_doc "DATA" && [[ ! -f "$PROJECT_DIR/data-model.md" ]]; then
    NEXT_STEPS+=("/arckit.data-model - Design data model")
elif [[ ! -d "$PROJECT_DIR/wardley-maps" ]] || [[ -z $(ls -A "$PROJECT_DIR/wardley-maps" 2>/dev/null) ]]; then
    NEXT_STEPS+=("/arckit.research - Research technology options")
    NEXT_STEPS+=("/arckit.wardley - Create Wardley maps")
elif ! has_doc "SOW" && [[ ! -f "$PROJECT_DIR/sow.md" ]]; then
    NEXT_STEPS+=("/arckit.sow - Generate Statement of Work for RFP")
else
    NEXT_STEPS+=("/arckit.evaluate - Create vendor evaluation framework")
fi

# Output JSON if requested
if [[ "$OUTPUT_JSON" == "true" ]]; then
    echo "{"
    echo "  \"success\": true,"
    echo "  \"project_dir\": \"$PROJECT_DIR\","
    echo "  \"project_number\": \"$PROJECT_NUMBER\","
    echo "  \"project_name\": \"$PROJECT_NAME\","
    echo "  \"requirements_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-REQ-v1.0.md\","
    echo "  \"stakeholders_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-STKE-v1.0.md\","
    echo "  \"risk_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-RISK-v1.0.md\","
    echo "  \"sobc_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-SOBC-v1.0.md\","
    echo "  \"sow_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-SOW-v1.0.md\","
    echo "  \"evaluation_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-EVAL-v1.0.md\","
    echo "  \"traceability_file\": \"$PROJECT_DIR/ARC-${PROJECT_NUMBER}-TRAC-v1.0.md\","
    echo "  \"decisions_dir\": \"$PROJECT_DIR/decisions\","
    echo "  \"diagrams_dir\": \"$PROJECT_DIR/diagrams\","
    echo "  \"wardley_maps_dir\": \"$PROJECT_DIR/wardley-maps\","
    echo "  \"reviews_dir\": \"$PROJECT_DIR/reviews\","
    echo "  \"vendors_dir\": \"$PROJECT_DIR/vendors\","
    echo "  \"external_dir\": \"$PROJECT_DIR/external\","
    echo "  \"global_external_dir\": \"$REPO_ROOT/projects/000-global/external\","
    echo "  \"policies_dir\": \"$REPO_ROOT/projects/000-global/policies\","
    echo -n "  \"next_steps\": "
    output_json_array "${NEXT_STEPS[@]}"
    echo ""
    echo "}"
else
    log_info "Project directory: $PROJECT_DIR"
    echo ""
    log_info "Next steps:"
    for i in "${!NEXT_STEPS[@]}"; do
        log_info "  $((i+1)). ${NEXT_STEPS[$i]}"
    done
fi
