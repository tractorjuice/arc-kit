#!/usr/bin/env bash

# List all ArcKit projects with status indicators
#
# This script lists all projects in the repository with information about
# which artifacts exist and their completion status.
#
# Usage: ./list-projects.sh [OPTIONS]
#
# OPTIONS:
#   --json           Output in JSON format
#   --verbose, -v    Show detailed artifact status
#   --help, -h       Show help message

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Parse command line arguments
JSON_MODE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            cat << 'EOF'
Usage: list-projects.sh [OPTIONS]

List all ArcKit projects with status indicators.

OPTIONS:
  --json           Output in JSON format
  --verbose, -v    Show detailed artifact status
  --help, -h       Show this help message

EXAMPLES:
  # List all projects
  ./list-projects.sh

  # List with detailed artifact status
  ./list-projects.sh --verbose

  # Output in JSON format
  ./list-projects.sh --json

EXIT CODES:
  0 - Success
  1 - Error

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
PROJECTS_DIR="$(get_projects_dir "$REPO_ROOT")"

# Check if projects directory exists
if [[ ! -d "$PROJECTS_DIR" ]]; then
    if [[ "$JSON_MODE" == "true" ]]; then
        echo '{"projects": []}'
    else
        log_warning "No projects directory found"
        echo ""
        echo "Run: /arckit.init to initialize an ArcKit repository"
    fi
    exit 0
fi

# Count projects
PROJECT_COUNT=$(find "$PROJECTS_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)

if [[ $PROJECT_COUNT -eq 0 ]]; then
    if [[ "$JSON_MODE" == "true" ]]; then
        echo '{"projects": []}'
    else
        echo "No projects found"
        echo ""
        echo "Run: /arckit.create to create a new project"
    fi
    exit 0
fi

# Function to check artifact existence
check_artifact() {
    local project_dir="$1"
    local artifact="$2"

    if [[ "$artifact" == "wardley-maps/" ]]; then
        if [[ -d "$project_dir/wardley-maps" ]] && [[ -n $(ls -A "$project_dir/wardley-maps" 2>/dev/null) ]]; then
            echo "true"
        else
            echo "false"
        fi
    elif [[ "$artifact" == "vendors/" ]]; then
        if [[ -d "$project_dir/vendors" ]] && [[ -n $(ls -A "$project_dir/vendors" 2>/dev/null) ]]; then
            echo "true"
        else
            echo "false"
        fi
    else
        if [[ -f "$project_dir/$artifact" ]]; then
            echo "true"
        else
            echo "false"
        fi
    fi
}

# Count vendor proposals
count_vendors() {
    local project_dir="$1"
    if [[ -d "$project_dir/vendors" ]]; then
        find "$project_dir/vendors" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l
    else
        echo "0"
    fi
}

# Count external documents
count_external_docs() {
    local project_dir="$1"
    if [[ -d "$project_dir/external" ]]; then
        find "$project_dir/external" -maxdepth 1 -type f \
            \( -name "*.pdf" -o -name "*.docx" -o -name "*.md" -o -name "*.csv" -o -name "*.sql" -o -name "*.png" -o -name "*.jpg" \) \
            ! -name "README.md" 2>/dev/null | wc -l
    else
        echo "0"
    fi
}

# Calculate completion percentage
calculate_completion() {
    local project_dir="$1"
    local total=10
    local completed=0

    # Standard artifacts (8 items)
    local artifacts=(
        "stakeholder-drivers.md"
        "risk-register.md"
        "sobc.md"
        "requirements.md"
        "data-model.md"
        "research-findings.md"
        "sow.md"
        "evaluation-criteria.md"
    )

    for artifact in "${artifacts[@]}"; do
        if [[ -f "$project_dir/$artifact" ]]; then
            ((completed++))
        fi
    done

    # Wardley maps (1 item)
    if [[ -d "$project_dir/wardley-maps" ]] && [[ -n $(ls -A "$project_dir/wardley-maps" 2>/dev/null) ]]; then
        ((completed++))
    fi

    # Vendors (1 item)
    if [[ -d "$project_dir/vendors" ]] && [[ -n $(ls -A "$project_dir/vendors" 2>/dev/null) ]]; then
        ((completed++))
    fi

    # Calculate percentage
    local percentage=$((completed * 100 / total))
    echo "$percentage"
}

# Get status emoji based on completion
get_status_emoji() {
    local percentage=$1

    if [[ $percentage -eq 100 ]]; then
        echo "✅"
    elif [[ $percentage -ge 75 ]]; then
        echo "🟢"
    elif [[ $percentage -ge 50 ]]; then
        echo "🟡"
    elif [[ $percentage -ge 25 ]]; then
        echo "🟠"
    else
        echo "🔴"
    fi
}

# JSON output mode
if [[ "$JSON_MODE" == "true" ]]; then
    echo "{"
    echo "  \"repository_root\": \"$REPO_ROOT\","
    echo "  \"projects_dir\": \"$PROJECTS_DIR\","
    echo "  \"project_count\": $PROJECT_COUNT,"
    echo "  \"projects\": ["

    first_project=true
    for project_dir in "$PROJECTS_DIR"/*; do
        if [[ -d "$project_dir" ]]; then
            if [[ "$first_project" == "true" ]]; then
                first_project=false
            else
                echo ","
            fi

            project_name=$(basename "$project_dir")
            project_number=$(get_project_number_from_dir "$project_dir" || echo "")
            vendor_count=$(count_vendors "$project_dir")
            external_doc_count=$(count_external_docs "$project_dir")
            completion=$(calculate_completion "$project_dir")

            echo "    {"
            echo "      \"name\": \"$project_name\","
            echo "      \"number\": \"$project_number\","
            echo "      \"path\": \"$project_dir\","
            echo "      \"completion_percentage\": $completion,"
            echo "      \"vendor_count\": $vendor_count,"
            echo "      \"external_doc_count\": $external_doc_count,"
            echo "      \"artifacts\": {"
            echo "        \"stakeholder_drivers\": $(check_artifact "$project_dir" "stakeholder-drivers.md"),"
            echo "        \"risk_register\": $(check_artifact "$project_dir" "risk-register.md"),"
            echo "        \"sobc\": $(check_artifact "$project_dir" "sobc.md"),"
            echo "        \"requirements\": $(check_artifact "$project_dir" "requirements.md"),"
            echo "        \"data_model\": $(check_artifact "$project_dir" "data-model.md"),"
            echo "        \"research_findings\": $(check_artifact "$project_dir" "research-findings.md"),"
            echo "        \"wardley_maps\": $(check_artifact "$project_dir" "wardley-maps/"),"
            echo "        \"sow\": $(check_artifact "$project_dir" "sow.md"),"
            echo "        \"evaluation_criteria\": $(check_artifact "$project_dir" "evaluation-criteria.md"),"
            echo "        \"vendors\": $(check_artifact "$project_dir" "vendors/")"
            echo "      }"
            echo -n "    }"
        fi
    done

    echo ""
    echo "  ]"
    echo "}"
    exit 0
fi

# Text output mode
echo "ArcKit Projects"
echo "==============="
echo ""
echo "Repository: $REPO_ROOT"
echo "Projects found: $PROJECT_COUNT"
echo ""

for project_dir in "$PROJECTS_DIR"/*; do
    if [[ -d "$project_dir" ]]; then
        project_name=$(basename "$project_dir")
        project_number=$(get_project_number_from_dir "$project_dir" || echo "")
        vendor_count=$(count_vendors "$project_dir")
        external_doc_count=$(count_external_docs "$project_dir")
        completion=$(calculate_completion "$project_dir")
        status_emoji=$(get_status_emoji $completion)

        echo "$status_emoji [$project_number] $project_name ($completion% complete)"

        if [[ "$VERBOSE" == "true" ]]; then
            echo "    Path: $project_dir"
            echo "    Artifacts:"

            # Check each artifact
            if [[ -f "$project_dir/stakeholder-drivers.md" ]]; then
                echo "      ✓ Stakeholder Drivers"
            else
                echo "      ✗ Stakeholder Drivers"
            fi

            if [[ -f "$project_dir/risk-register.md" ]]; then
                echo "      ✓ Risk Register"
            else
                echo "      ✗ Risk Register"
            fi

            if [[ -f "$project_dir/sobc.md" ]]; then
                echo "      ✓ Strategic Outline Business Case"
            else
                echo "      ✗ Strategic Outline Business Case"
            fi

            if [[ -f "$project_dir/requirements.md" ]]; then
                echo "      ✓ Requirements"
            else
                echo "      ✗ Requirements"
            fi

            if [[ -f "$project_dir/data-model.md" ]]; then
                echo "      ✓ Data Model"
            else
                echo "      ✗ Data Model"
            fi

            if [[ -f "$project_dir/research-findings.md" ]]; then
                echo "      ✓ Research Findings"
            else
                echo "      ✗ Research Findings"
            fi

            if [[ -d "$project_dir/wardley-maps" ]] && [[ -n $(ls -A "$project_dir/wardley-maps" 2>/dev/null) ]]; then
                echo "      ✓ Wardley Maps"
            else
                echo "      ✗ Wardley Maps"
            fi

            if [[ -f "$project_dir/sow.md" ]]; then
                echo "      ✓ Statement of Work"
            else
                echo "      ✗ Statement of Work"
            fi

            if [[ -f "$project_dir/evaluation-criteria.md" ]]; then
                echo "      ✓ Evaluation Criteria"
            else
                echo "      ✗ Evaluation Criteria"
            fi

            if [[ $vendor_count -gt 0 ]]; then
                echo "      ✓ Vendor Proposals ($vendor_count)"
            else
                echo "      ✗ Vendor Proposals"
            fi

            if [[ $external_doc_count -gt 0 ]]; then
                echo "      ✓ External Documents ($external_doc_count)"
            else
                echo "      ✗ External Documents"
            fi

            echo ""
        fi
    fi
done

echo ""
echo "Legend:"
echo "  ✅ Complete (100%)"
echo "  🟢 Mostly complete (75-99%)"
echo "  🟡 In progress (50-74%)"
echo "  🟠 Started (25-49%)"
echo "  🔴 Not started (0-24%)"

exit 0
