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
    TEMPLATES_DIR="$(get_templates_dir "$REPO_ROOT")"
    PRINCIPLES_FILE="$TEMPLATES_DIR/architecture-principles.md"

    if [[ ! -f "$PRINCIPLES_FILE" ]]; then
        log_error "Prerequisites not met: architecture-principles.md not found"
        log_error "Before creating a project, you must define architecture principles"
        log_error ""
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

# Create placeholder files
touch "$PROJECT_DIR/requirements.md"
touch "$PROJECT_DIR/sow.md"
touch "$PROJECT_DIR/evaluation-criteria.md"
touch "$PROJECT_DIR/traceability-matrix.md"

# Create a README for the project
cat > "$PROJECT_DIR/README.md" <<EOF
# $PROJECT_NAME

Project ID: $PROJECT_NUMBER
Created: $(date +"%Y-%m-%d")

## Overview

[Project description to be added]

## Documents

- [Requirements](requirements.md) - Comprehensive business and technical requirements
- [Statement of Work](sow.md) - RFP document for vendor procurement
- [Evaluation Criteria](evaluation-criteria.md) - Vendor evaluation framework
- [Traceability Matrix](traceability-matrix.md) - Requirements to design traceability

## Vendors

[Vendor proposals will be stored in vendors/ directory]

## Status

- [ ] Requirements defined
- [ ] SOW generated
- [ ] Vendors evaluated
- [ ] Vendor selected
- [ ] HLD reviewed
- [ ] DLD reviewed
- [ ] Implementation started
EOF

log_success "Project created successfully"

# Determine next steps based on what artifacts exist
NEXT_STEPS=()
TEMPLATES_DIR="$(get_templates_dir "$REPO_ROOT")"

# Check if stakeholder-drivers.md exists in project
if [[ ! -f "$PROJECT_DIR/stakeholder-drivers.md" ]]; then
    NEXT_STEPS+=("/arckit.stakeholders - Analyze stakeholder drivers and goals")
elif [[ ! -f "$PROJECT_DIR/risk-register.md" ]]; then
    NEXT_STEPS+=("/arckit.risk - Create risk register")
elif [[ ! -f "$PROJECT_DIR/sobc.md" ]]; then
    NEXT_STEPS+=("/arckit.sobc - Create Strategic Outline Business Case")
elif [[ ! -f "$PROJECT_DIR/requirements.md" ]]; then
    NEXT_STEPS+=("/arckit.requirements - Define business and technical requirements")
elif [[ ! -f "$PROJECT_DIR/data-model.md" ]]; then
    NEXT_STEPS+=("/arckit.data-model - Design data model")
elif [[ ! -d "$PROJECT_DIR/wardley-maps" ]] || [[ -z $(ls -A "$PROJECT_DIR/wardley-maps" 2>/dev/null) ]]; then
    NEXT_STEPS+=("/arckit.research - Research technology options")
    NEXT_STEPS+=("/arckit.wardley - Create Wardley maps")
elif [[ ! -f "$PROJECT_DIR/sow.md" ]]; then
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
    echo "  \"requirements_file\": \"$PROJECT_DIR/requirements.md\","
    echo "  \"sow_file\": \"$PROJECT_DIR/sow.md\","
    echo "  \"evaluation_file\": \"$PROJECT_DIR/evaluation-criteria.md\","
    echo "  \"vendors_dir\": \"$PROJECT_DIR/vendors\","
    echo "  \"traceability_file\": \"$PROJECT_DIR/traceability-matrix.md\","
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
