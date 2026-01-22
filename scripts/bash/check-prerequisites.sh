#!/usr/bin/env bash

# Consolidated prerequisite checking script for ArcKit
#
# This script provides unified prerequisite checking for ArcKit workflow.
# It helps find projects, validate environment, and check for required files.
#
# Usage: ./check-prerequisites.sh [OPTIONS]
#
# OPTIONS:
#   --json                Output in JSON format
#   --project <prefix>    Specify project by number or name prefix
#   --require-file <file> Require specific file to exist (can be used multiple times)
#   --paths-only          Only output path variables (no validation)
#   --list-projects       List all available projects
#   --help, -h            Show help message
#
# OUTPUTS:
#   JSON mode: {"REPO_ROOT":"...", "PROJECT_DIR":"...", "AVAILABLE_DOCS":["..."]}
#   Text mode: REPO_ROOT: ... \n PROJECT_DIR: ... \n AVAILABLE_DOCS: \n ✓/✗ file.md
#   Paths only: REPO_ROOT: ... \n PROJECT_DIR: ... etc.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Parse command line arguments
JSON_MODE=false
PATHS_ONLY=false
LIST_PROJECTS=false
PROJECT_PREFIX=""
REQUIRED_FILES=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --project)
            PROJECT_PREFIX="$2"
            shift 2
            ;;
        --require-file)
            REQUIRED_FILES+=("$2")
            shift 2
            ;;
        --paths-only)
            PATHS_ONLY=true
            shift
            ;;
        --list-projects)
            LIST_PROJECTS=true
            shift
            ;;
        --help|-h)
            cat << 'EOF'
Usage: check-prerequisites.sh [OPTIONS]

Consolidated prerequisite checking for ArcKit workflow.

OPTIONS:
  --json                Output in JSON format
  --project <prefix>    Specify project by number or name prefix
  --require-file <file> Require specific file to exist (can be used multiple times)
  --paths-only          Only output path variables (no validation)
  --list-projects       List all available projects
  --help, -h            Show this help message

EXAMPLES:
  # Check prerequisites in JSON mode
  ./check-prerequisites.sh --json

  # Find project by prefix
  ./check-prerequisites.sh --project "payment"

  # Require specific files
  ./check-prerequisites.sh --project "001" --require-file "requirements.md"

  # List all projects
  ./check-prerequisites.sh --list-projects

EXIT CODES:
  0 - Success
  1 - Error (missing required files, project not found, etc.)

EOF
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Get repository root
REPO_ROOT="$(find_repo_root)"

# List projects if requested
if [[ "$LIST_PROJECTS" == "true" ]]; then
    list_projects "$REPO_ROOT"
    exit 0
fi

# Paths only mode - just output variables
if [[ "$PATHS_ONLY" == "true" ]]; then
    echo "REPO_ROOT: $REPO_ROOT"
    echo "ARCKIT_DIR: $(get_arckit_dir "$REPO_ROOT")"
    echo "PROJECTS_DIR: $(get_projects_dir "$REPO_ROOT")"
    echo "MEMORY_DIR: $(get_memory_dir "$REPO_ROOT")"
    echo "TEMPLATES_DIR: $(get_templates_dir "$REPO_ROOT")"

    if [[ -n "$PROJECT_PREFIX" ]]; then
        PROJECT_DIR=$(find_project_dir_by_prefix "$PROJECT_PREFIX" "$REPO_ROOT" 2>/dev/null || echo "")
        if [[ -n "$PROJECT_DIR" ]]; then
            echo "PROJECT_DIR: $PROJECT_DIR"
            PROJECT_NUMBER=$(get_project_number_from_dir "$PROJECT_DIR")
            echo "PROJECT_NUMBER: $PROJECT_NUMBER"
        fi
    fi
    exit 0
fi

# Find project if prefix specified
PROJECT_DIR=""
PROJECT_NUMBER=""
if [[ -n "$PROJECT_PREFIX" ]]; then
    PROJECT_DIR=$(find_project_dir_by_prefix "$PROJECT_PREFIX" "$REPO_ROOT")
    if [[ $? -ne 0 ]]; then
        exit 1
    fi
    PROJECT_NUMBER=$(get_project_number_from_dir "$PROJECT_DIR")
fi

# Check for available documentation files
AVAILABLE_DOCS=()
if [[ -n "$PROJECT_DIR" ]]; then
    # Check for all standard ArcKit artifacts
    ARTIFACTS=(
        "stakeholder-drivers.md"
        "risk-register.md"
        "sobc.md"
        "requirements.md"
        "data-model.md"
        "research-findings.md"
        "sow.md"
        "evaluation-criteria.md"
        "traceability-matrix.md"
        "servicenow-design.md"
    )

    for artifact in "${ARTIFACTS[@]}"; do
        if [[ -f "$PROJECT_DIR/$artifact" ]]; then
            AVAILABLE_DOCS+=("$artifact")
        fi
    done

    # Check for Wardley maps
    if [[ -d "$PROJECT_DIR/wardley-maps" ]] && [[ -n $(ls -A "$PROJECT_DIR/wardley-maps" 2>/dev/null) ]]; then
        AVAILABLE_DOCS+=("wardley-maps/")
    fi

    # Check for vendor proposals
    if [[ -d "$PROJECT_DIR/vendors" ]] && [[ -n $(ls -A "$PROJECT_DIR/vendors" 2>/dev/null) ]]; then
        AVAILABLE_DOCS+=("vendors/")
    fi
fi

# Check required files if specified
ALL_REQUIRED_FOUND=true
for required_file in "${REQUIRED_FILES[@]}"; do
    if [[ -n "$PROJECT_DIR" ]]; then
        full_path="$PROJECT_DIR/$required_file"
    else
        full_path="$REPO_ROOT/$required_file"
    fi

    if [[ ! -f "$full_path" ]]; then
        if [[ "$JSON_MODE" != "true" ]]; then
            log_error "Required file not found: $required_file"
        fi
        ALL_REQUIRED_FOUND=false
    fi
done

# Output results
if [[ "$JSON_MODE" == "true" ]]; then
    # JSON output
    echo "{"
    echo "  \"REPO_ROOT\": \"$REPO_ROOT\","
    echo "  \"ARCKIT_DIR\": \"$(get_arckit_dir "$REPO_ROOT")\","
    echo "  \"PROJECTS_DIR\": \"$(get_projects_dir "$REPO_ROOT")\","
    echo "  \"MEMORY_DIR\": \"$(get_memory_dir "$REPO_ROOT")\","
    echo "  \"TEMPLATES_DIR\": \"$(get_templates_dir "$REPO_ROOT")\","

    if [[ -n "$PROJECT_DIR" ]]; then
        echo "  \"PROJECT_DIR\": \"$PROJECT_DIR\","
        echo "  \"PROJECT_NUMBER\": \"$PROJECT_NUMBER\","
    else
        echo "  \"PROJECT_DIR\": null,"
        echo "  \"PROJECT_NUMBER\": null,"
    fi

    echo -n "  \"AVAILABLE_DOCS\": "
    output_json_array "${AVAILABLE_DOCS[@]}"
    echo ""
    echo "}"
else
    # Text output
    echo "ArcKit Environment:"
    echo "==================="
    echo ""
    echo "Repository:"
    echo "  REPO_ROOT: $REPO_ROOT"
    echo "  ARCKIT_DIR: $(get_arckit_dir "$REPO_ROOT")"
    echo "  PROJECTS_DIR: $(get_projects_dir "$REPO_ROOT")"
    echo "  MEMORY_DIR: $(get_memory_dir "$REPO_ROOT")"
    echo "  TEMPLATES_DIR: $(get_templates_dir "$REPO_ROOT")"
    echo ""

    if [[ -n "$PROJECT_DIR" ]]; then
        echo "Project:"
        echo "  PROJECT_DIR: $PROJECT_DIR"
        echo "  PROJECT_NUMBER: $PROJECT_NUMBER"
        echo ""

        echo "Available Artifacts:"
        if [[ ${#AVAILABLE_DOCS[@]} -eq 0 ]]; then
            echo "  (no artifacts found)"
        else
            for doc in "${AVAILABLE_DOCS[@]}"; do
                echo "  ✓ $doc"
            done
        fi
    else
        echo "Project: (not specified)"
        echo ""
        echo "Use --project <prefix> to specify a project"
        list_projects "$REPO_ROOT"
    fi
fi

# Exit with error if required files missing
if [[ "$ALL_REQUIRED_FOUND" != "true" ]]; then
    exit 1
fi

exit 0
