#!/usr/bin/env bash
# Create a new ArcKit project for requirements and vendor management

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Usage function
usage() {
    cat <<EOF
Usage: $0 --name "PROJECT_NAME" [--json]

Create a new ArcKit project for architecture governance.

Options:
    --name "PROJECT_NAME"    Name of the project (required)
    --json                   Output JSON for AI agent consumption

Example:
    $0 --name "Payment Gateway Modernization" --json
EOF
    exit 1
}

# Parse arguments
PROJECT_NAME=""
OUTPUT_JSON=false

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
        --help|-h)
            usage
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate inputs
if [[ -z "$PROJECT_NAME" ]]; then
    log_error "Project name is required"
    usage
fi

# Find repository root
REPO_ROOT="$(find_repo_root)"
log_info "Repository root: $REPO_ROOT"

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

# Output JSON if requested
if [[ "$OUTPUT_JSON" == "true" ]]; then
    output_json "$PROJECT_DIR" "$PROJECT_NUMBER" "$PROJECT_NAME"
else
    log_info "Project directory: $PROJECT_DIR"
    log_info "Next steps:"
    log_info "  1. Run /arckit.requirements to define requirements"
    log_info "  2. Run /arckit.sow to generate Statement of Work"
    log_info "  3. Run /arckit.evaluate to create evaluation framework"
fi
