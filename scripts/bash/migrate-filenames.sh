#!/usr/bin/env bash
#
# Migrate ArcKit project files to new Document ID-based filenames
# Usage: ./migrate-filenames.sh [PROJECT_DIR] [OPTIONS]
#
# This script renames old-style filenames to the new ARC-{PID}-{TYPE}-v{VERSION}.md pattern.
# A backup is created before any changes are made.
#
# Examples:
#   ./migrate-filenames.sh projects/001-payment-gateway
#   ./migrate-filenames.sh projects/001-payment-gateway --dry-run
#   ./migrate-filenames.sh --all                    # Migrate all projects

set -euo pipefail

# Enable nullglob so non-matching globs expand to nothing
shopt -s nullglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# File mapping: old filename -> type code
declare -A FILE_MAPPING=(
    # Core documents
    ["requirements.md"]="REQ"
    ["stakeholder-drivers.md"]="STKE"
    ["stakeholder-analysis.md"]="STKE"  # Alternative name
    ["risk-register.md"]="RISK"
    ["sobc.md"]="SOBC"
    ["data-model.md"]="DATA"
    ["research-findings.md"]="RSCH"
    ["traceability-matrix.md"]="TRAC"
    ["analysis-report.md"]="ANAL"

    # Strategy & Operations
    ["project-plan.md"]="PLAN"
    ["roadmap.md"]="ROADMAP"
    ["devops-strategy.md"]="DEVOPS"
    ["mlops-strategy.md"]="MLOPS"
    ["finops-strategy.md"]="FINOPS"
    ["operational-readiness.md"]="OPS"
    ["servicenow-design.md"]="SNOW"
    ["backlog.md"]="BLOG"
    ["platform-design.md"]="PLAT"

    # Procurement
    ["sow.md"]="SOW"
    ["dos-requirements.md"]="DOS"
    ["gcloud-requirements.md"]="GCLD"
    ["gcloud-clarification-questions.md"]="GCLC"
    ["evaluation-criteria.md"]="EVAL"

    # Compliance
    ["tcop-review.md"]="TCOP"
    ["ukgov-secure-by-design.md"]="SECD"
    ["secure-by-design.md"]="SECD"  # Alternative name
    ["mod-secure-by-design.md"]="SECD-MOD"
    ["ai-playbook-assessment.md"]="AIPB"
    ["atrs-record.md"]="ATRS"
    ["jsp-936.md"]="JSP936"
    ["jsp936.md"]="JSP936"  # Alternative name
    ["dpia.md"]="DPIA"
    ["principles-compliance-assessment.md"]="PRIN-COMP"

    # Reviews
    ["hld-review.md"]="HLD"
    ["dld-review.md"]="DLD"

    # Other
    ["PROJECT-STORY.md"]="STORY"
)

# Subdirectory mappings for multi-instance types
declare -A SUBDIR_MAPPING=(
    ["decisions"]="ADR"
    ["diagrams"]="DIAG"
    ["wardley-maps"]="WARD"
    ["data-contracts"]="DMC"
)

usage() {
    cat <<EOF
Usage: $0 [PROJECT_DIR] [OPTIONS]

Migrate ArcKit project files to new Document ID-based filenames.

Options:
    --all           Migrate all projects in the projects/ directory
    --dry-run       Show what would be changed without making changes
    --no-backup     Skip creating backup (not recommended)
    --force         Overwrite existing files if they exist
    --help, -h      Show this help message

Examples:
    $0 projects/001-payment-gateway
    $0 projects/001-payment-gateway --dry-run
    $0 --all --dry-run

EOF
    exit 1
}

# Parse arguments
PROJECT_DIR=""
MIGRATE_ALL=false
DRY_RUN=false
NO_BACKUP=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            MIGRATE_ALL=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --no-backup)
            NO_BACKUP=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --help|-h)
            usage
            ;;
        -*)
            log_error "Unknown option: $1"
            usage
            ;;
        *)
            PROJECT_DIR="$1"
            shift
            ;;
    esac
done

# Find repository root
REPO_ROOT="$(find_repo_root)"

# Validate arguments
if [[ "$MIGRATE_ALL" == "false" && -z "$PROJECT_DIR" ]]; then
    log_error "PROJECT_DIR required (or use --all)"
    usage
fi

# Get project number from directory name
get_project_id() {
    local dir="$1"
    local basename=$(basename "$dir")

    if [[ "$basename" =~ ^([0-9]{3})- ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        log_error "Cannot extract project ID from: $basename"
        return 1
    fi
}

# Migrate a single file
migrate_file() {
    local old_path="$1"
    local new_path="$2"
    local backup_dir="$3"

    if [[ ! -f "$old_path" ]]; then
        return 0
    fi

    if [[ -f "$new_path" && "$FORCE" == "false" ]]; then
        log_warning "Target exists, skipping: $new_path"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY-RUN] Would rename: $(basename "$old_path") → $(basename "$new_path")"
    else
        # Create backup
        if [[ "$NO_BACKUP" == "false" ]]; then
            mkdir -p "$backup_dir"
            cp "$old_path" "$backup_dir/"
        fi

        # Rename file
        mv "$old_path" "$new_path"
        log_success "Renamed: $(basename "$old_path") → $(basename "$new_path")"
    fi
}

# Migrate files in a subdirectory (ADR, diagrams, etc.)
migrate_subdir() {
    local subdir="$1"
    local project_id="$2"
    local type_code="$3"
    local backup_dir="$4"

    if [[ ! -d "$subdir" ]]; then
        return 0
    fi

    local count=0

    # Find existing files that don't match new pattern
    for file in "$subdir"/*.md; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        local basename=$(basename "$file")

        # Skip if already in new format
        if [[ "$basename" =~ ^ARC-[0-9]{3}-${type_code}-[0-9]{3}-v[0-9]+\.[0-9]+\.md$ ]]; then
            continue
        fi

        # Determine sequence number
        count=$((count + 1))
        local seq_num=$(printf "%03d" $count)

        local new_name="ARC-${project_id}-${type_code}-${seq_num}-v1.0.md"
        local new_path="$subdir/$new_name"

        migrate_file "$file" "$new_path" "$backup_dir"
    done
}

# Migrate a single project
migrate_project() {
    local project_dir="$1"

    if [[ ! -d "$project_dir" ]]; then
        log_error "Project directory not found: $project_dir"
        return 1
    fi

    local project_id
    project_id=$(get_project_id "$project_dir") || return 1

    log_info "Migrating project: $(basename "$project_dir") (ID: $project_id)"

    local backup_dir="$project_dir/.backup/$(date +%Y%m%d_%H%M%S)"

    # Create subdirectories for new structure if they don't exist
    if [[ "$DRY_RUN" == "false" ]]; then
        mkdir -p "$project_dir/decisions"
        mkdir -p "$project_dir/diagrams"
        mkdir -p "$project_dir/wardley-maps"
        mkdir -p "$project_dir/data-contracts"
        mkdir -p "$project_dir/reviews"
    fi

    # Migrate root-level files
    for old_name in "${!FILE_MAPPING[@]}"; do
        local type_code="${FILE_MAPPING[$old_name]}"
        local old_path="$project_dir/$old_name"

        if [[ -f "$old_path" ]]; then
            # Handle date-suffixed files (e.g., principles-compliance-assessment-2025-01-15.md)
            local new_name="ARC-${project_id}-${type_code}-v1.0.md"

            # Determine subdirectory for reviews
            if [[ "$type_code" == "HLD" || "$type_code" == "DLD" ]]; then
                local new_path="$project_dir/reviews/$new_name"
            else
                local new_path="$project_dir/$new_name"
            fi

            migrate_file "$old_path" "$new_path" "$backup_dir"
        fi
    done

    # Migrate date-suffixed compliance files (e.g., principles-compliance-assessment-YYYY-MM-DD.md)
    for file in "$project_dir"/principles-compliance-assessment-*.md; do
        if [[ -f "$file" ]]; then
            local new_name="ARC-${project_id}-PRIN-COMP-v1.0.md"
            migrate_file "$file" "$project_dir/$new_name" "$backup_dir"
            break  # Only migrate the first one
        fi
    done

    # Migrate date-suffixed service assessment files
    for file in "$project_dir"/service-assessment-*-prep.md; do
        if [[ -f "$file" ]]; then
            local new_name="ARC-${project_id}-SVCASS-v1.0.md"
            migrate_file "$file" "$project_dir/$new_name" "$backup_dir"
            break
        fi
    done

    # Migrate subdirectories
    for subdir_name in "${!SUBDIR_MAPPING[@]}"; do
        local type_code="${SUBDIR_MAPPING[$subdir_name]}"
        migrate_subdir "$project_dir/$subdir_name" "$project_id" "$type_code" "$backup_dir"
    done

    # Also check for old wardley-maps location at root level
    for file in "$project_dir"/*-wardley.md "$project_dir"/*-map.md; do
        if [[ -f "$file" ]]; then
            # Move to wardley-maps subdirectory with new naming
            local count=$(ls "$project_dir/wardley-maps"/ARC-*.md 2>/dev/null | wc -l)
            count=$((count + 1))
            local seq_num=$(printf "%03d" $count)
            local new_name="ARC-${project_id}-WARD-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/wardley-maps"
            fi
            migrate_file "$file" "$project_dir/wardley-maps/$new_name" "$backup_dir"
        fi
    done

    # Check for old diagram files at root
    for file in "$project_dir"/*-diagram.md "$project_dir"/diagram-*.md; do
        if [[ -f "$file" ]]; then
            local count=$(ls "$project_dir/diagrams"/ARC-*.md 2>/dev/null | wc -l)
            count=$((count + 1))
            local seq_num=$(printf "%03d" $count)
            local new_name="ARC-${project_id}-DIAG-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/diagrams"
            fi
            migrate_file "$file" "$project_dir/diagrams/$new_name" "$backup_dir"
        fi
    done

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY-RUN] No changes made"
    else
        if [[ -d "$backup_dir" && -n $(ls -A "$backup_dir" 2>/dev/null) ]]; then
            log_success "Backup created at: $backup_dir"
        fi
    fi

    log_success "Migration complete for: $(basename "$project_dir")"
}

# Main execution
if [[ "$MIGRATE_ALL" == "true" ]]; then
    PROJECTS_DIR="$REPO_ROOT/projects"

    if [[ ! -d "$PROJECTS_DIR" ]]; then
        log_error "No projects directory found at: $PROJECTS_DIR"
        exit 1
    fi

    project_count=0
    for project_dir in "$PROJECTS_DIR"/*/; do
        if [[ -d "$project_dir" ]]; then
            migrate_project "$project_dir"
            project_count=$((project_count + 1))
        fi
    done

    log_success "Migrated $project_count projects"
else
    # Handle relative or absolute path
    if [[ "$PROJECT_DIR" != /* ]]; then
        PROJECT_DIR="$REPO_ROOT/$PROJECT_DIR"
    fi

    migrate_project "$PROJECT_DIR"
fi

# Summary
echo ""
if [[ "$DRY_RUN" == "true" ]]; then
    log_info "This was a dry run. Run without --dry-run to apply changes."
else
    log_success "Migration complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Review the changes and backups"
    echo "  2. Update any references to old filenames in your documentation"
    echo "  3. Commit the changes to version control"
fi
