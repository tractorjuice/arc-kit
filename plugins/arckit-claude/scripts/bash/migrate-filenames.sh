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

# File mapping: old filename -> type code, as "old-name:CODE" pairs. Pairs, not
# an associative array: macOS ships bash 3.2, which has none.
FILE_MAPPING=(
    # Core documents
    "requirements.md:REQ"
    "stakeholder-drivers.md:STKE"
    "stakeholder-analysis.md:STKE"  # Alternative name
    "risk-register.md:RISK"
    "sobc.md:SOBC"
    "data-model.md:DATA"
    # research-findings.md moved to research/ subdirectory (multi-instance)
    "traceability-matrix.md:TRAC"
    "analysis-report.md:ANAL"

    # Global documents (for 000-global)
    "architecture-principles.md:PRIN"
    "principles.md:PRIN"  # Alternative name

    # Strategy & Operations
    "project-plan.md:PLAN"
    "roadmap.md:ROAD"
    "devops-strategy.md:DEVOPS"
    "mlops-strategy.md:MLOPS"
    "finops-strategy.md:FINOPS"
    "operational-readiness.md:OPS"
    "servicenow-design.md:SNOW"
    "backlog.md:BKLG"
    "platform-design.md:PLAT"

    # Procurement
    "sow.md:SOW"
    "dos-requirements.md:DOS"
    "digital-marketplace-dos.md:DOS"  # Alternative name
    "gcloud-requirements.md:GCLD"
    "gcloud-clarification-questions.md:GCLC"
    "evaluation-criteria.md:EVAL"

    # Compliance
    "tcop-review.md:TCOP"
    "tcop-assessment.md:TCOP"  # Alternative name
    "ukgov-secure-by-design.md:SECD"
    "secure-by-design.md:SECD"  # Alternative name
    "mod-secure-by-design.md:SECD-MOD"
    "ai-playbook-assessment.md:AIPB"
    "atrs-record.md:ATRS"
    "jsp-936.md:JSP936"
    "jsp936.md:JSP936"  # Alternative name
    "dpia.md:DPIA"
    "principles-compliance-assessment.md:PRIN-COMP"
    "conformance-assessment.md:CONF"

    # Reviews
    "hld-review.md:HLDR"
    "hld.md:HLDR"  # Alternative name
    "dld-review.md:DLDR"
    "dld.md:DLDR"  # Alternative name

    # Other
    "PROJECT-STORY.md:STORY"
)

# Subdirectory mappings for multi-instance types, as "subdir:CODE" pairs
SUBDIR_MAPPING=(
    "decisions:ADR"
    "diagrams:DIAG"
    "wardley-maps:WARD"
    "data-contracts:DMC"
    "research:RSCH"
)

# Subdirectory a single-instance type belongs in, or nothing for the project root.
# GCLD, GCLC and DOS go in procurement/ (SUBDIR_MAP in config/doc-types.mjs);
# validate-arc-filename.mjs blocks them anywhere else.
type_subdir() {
    case "$1" in
        HLDR|DLDR) echo "reviews" ;;
        GCLD|GCLC|DOS) echo "procurement" ;;
    esac
}

usage() {
    cat <<EOF
Usage: $0 [PROJECT_DIR] [OPTIONS]

Migrate ArcKit project files to new Document ID-based filenames.

Options:
    --all           Migrate all projects in the projects/ directory
    --global        Migrate only the global directory (000-global)
    --dry-run       Show what would be changed without making changes
    --no-backup     Skip creating backup (not recommended)
    --force         Overwrite existing files if they exist
    --help, -h      Show this help message

Examples:
    $0 projects/001-payment-gateway
    $0 projects/001-payment-gateway --dry-run
    $0 projects/000-global                      # Migrate global principles
    $0 --global --dry-run                       # Dry run for global only
    $0 --all --dry-run                          # Migrate all (including global)

Supported global files (000-global):
    architecture-principles.md  → ARC-000-PRIN-v1.0.md
    principles.md               → ARC-000-PRIN-v1.0.md

Legacy locations checked for principles:
    .arckit/memory/architecture-principles.md
    .arckit/memory/principles.md

EOF
    exit 1
}

# Parse arguments
PROJECT_DIR=""
MIGRATE_ALL=false
MIGRATE_GLOBAL=false
DRY_RUN=false
NO_BACKUP=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            MIGRATE_ALL=true
            shift
            ;;
        --global)
            MIGRATE_GLOBAL=true
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
if [[ "$MIGRATE_ALL" == "false" && "$MIGRATE_GLOBAL" == "false" && -z "$PROJECT_DIR" ]]; then
    log_error "PROJECT_DIR required (or use --all or --global)"
    usage
fi

# Get project number from directory name
get_project_id() {
    local dir="$1"
    local basename=$(basename "$dir")

    # Handle 000-global specially
    if [[ "$basename" == "000-global" ]]; then
        echo "000"
        return 0
    fi

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
        mkdir -p "$(dirname "$new_path")"
        mv "$old_path" "$new_path"
        log_success "Renamed: $(basename "$old_path") → $(basename "$new_path")"
    fi
}

# Highest sequence number among a folder's ARC-{PID}-{TYPE}-NNN files, or 0.
# Migrated files are numbered after it, as generate-document-id.mjs --next-num
# numbers new ones, so a migrated file never takes an existing file's number.
last_sequence() {
    local dir="$1" project_id="$2" type_code="$3"
    local last=0 file num

    for file in "$dir"/ARC-"$project_id"-"$type_code"-*.md; do
        if [[ "$(basename "$file")" =~ ^ARC-${project_id}-${type_code}-([0-9]+)- ]]; then
            num=$((10#${BASH_REMATCH[1]}))
            if (( num > last )); then
                last=$num
            fi
        fi
    done
    echo "$last"
}

# Migrate files in a subdirectory (ADR, diagrams, etc.)
migrate_subdir() {
    local subdir="$1"
    local project_id="$2"
    local type_code="$3"
    local backup_dir="$4"

    local count
    count=$(last_sequence "$subdir" "$project_id" "$type_code")
    # Shared with the root-level loops in migrate_project, which number after it.
    # In a dry run nothing is renamed, so the disk alone would give them a lower number.
    eval "LAST_SEQ_${type_code}=\$count"

    if [[ ! -d "$subdir" ]]; then
        return 0
    fi

    # Find existing files that don't match new pattern
    for file in "$subdir"/*.md; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        local basename=$(basename "$file")

        # Skip a name that already carries a sequence number, whatever its type:
        # a folder can hold several (research/ holds AWRS, GOVR and others beside RSCH).
        if [[ "$basename" =~ ^ARC-[0-9]{3}-[A-Z][A-Z0-9-]*-[0-9]{3}-v[0-9]+\.[0-9]+\.md$ ]]; then
            continue
        fi

        # An ARC name with no sequence number keeps its version. One of another
        # type is left for a person: renaming it to this folder's type would be wrong.
        local version="1.0"
        if [[ "$basename" =~ ^ARC-[0-9]{3}-([A-Z][A-Z0-9-]*)-v([0-9]+\.[0-9]+)\.md$ ]]; then
            if [[ "${BASH_REMATCH[1]}" != "$type_code" ]]; then
                log_warning "Left as it is: $basename is a ${BASH_REMATCH[1]} document with no sequence number; give it one by hand"
                continue
            fi
            version="${BASH_REMATCH[2]}"
        fi

        # Determine sequence number
        count=$((count + 1))
        local seq_num=$(printf "%03d" $count)
        eval "LAST_SEQ_${type_code}=\$count"

        local new_name="ARC-${project_id}-${type_code}-${seq_num}-v${version}.md"
        local new_path="$subdir/$new_name"

        migrate_file "$file" "$new_path" "$backup_dir"
    done
}

# Migrate a single project
migrate_project() {
    local project_dir="$1"

    # Create directory if it doesn't exist (especially for 000-global)
    if [[ ! -d "$project_dir" ]]; then
        local basename=$(basename "$project_dir")
        if [[ "$basename" == "000-global" ]]; then
            log_info "Creating global directory: $project_dir"
            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir"
            else
                log_info "[DRY-RUN] Would create directory: $project_dir"
            fi
        else
            log_error "Project directory not found: $project_dir"
            return 1
        fi
    fi

    local project_id
    project_id=$(get_project_id "$project_dir") || return 1

    log_info "Migrating project: $(basename "$project_dir") (ID: $project_id)"

    local backup_dir="$project_dir/.backup/$(date +%Y%m%d_%H%M%S)"

    # Special handling for 000-global: check legacy locations for principles
    if [[ "$project_id" == "000" ]]; then
        local legacy_locations=(
            "$REPO_ROOT/.arckit/memory/architecture-principles.md"
            "$REPO_ROOT/.arckit/memory/principles.md"
        )

        for legacy_path in "${legacy_locations[@]}"; do
            if [[ -f "$legacy_path" ]]; then
                local new_name="ARC-000-PRIN-v1.0.md"
                local new_path="$project_dir/$new_name"

                if [[ -f "$new_path" && "$FORCE" == "false" ]]; then
                    log_warning "Principles already exist at: $new_path (use --force to overwrite)"
                else
                    log_info "Found principles at legacy location: $legacy_path"
                    migrate_file "$legacy_path" "$new_path" "$backup_dir"
                fi
                break
            fi
        done
    fi

    # Create subdirectories for new structure if they don't exist (skip for 000-global)
    if [[ "$DRY_RUN" == "false" && "$project_id" != "000" ]]; then
        mkdir -p "$project_dir/decisions"
        mkdir -p "$project_dir/diagrams"
        mkdir -p "$project_dir/wardley-maps"
        mkdir -p "$project_dir/data-contracts"
        mkdir -p "$project_dir/reviews"
        mkdir -p "$project_dir/research"
    fi

    # Migrate root-level files
    for pair in "${FILE_MAPPING[@]}"; do
        local old_name="${pair%%:*}" type_code="${pair##*:}"
        local old_path="$project_dir/$old_name"

        if [[ -f "$old_path" ]]; then
            # Handle date-suffixed files (e.g., principles-compliance-assessment-2025-01-15.md)
            local new_name="ARC-${project_id}-${type_code}-v1.0.md"
            local subdir
            subdir=$(type_subdir "$type_code")

            migrate_file "$old_path" "$project_dir/${subdir:+$subdir/}$new_name" "$backup_dir"
        fi
    done

    # Also check procurement/ subdirectory for old-style files. G-Cloud and DOS
    # files stay in procurement/; other types go where the loop above puts them.
    if [[ -d "$project_dir/procurement" ]]; then
        for pair in "${FILE_MAPPING[@]}"; do
            local old_name="${pair%%:*}" type_code="${pair##*:}"
            local old_path="$project_dir/procurement/$old_name"

            if [[ -f "$old_path" ]]; then
                local new_name="ARC-${project_id}-${type_code}-v1.0.md"
                local subdir
                subdir=$(type_subdir "$type_code")
                migrate_file "$old_path" "$project_dir/${subdir:+$subdir/}$new_name" "$backup_dir"
            fi
        done
    fi

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
    for pair in "${SUBDIR_MAPPING[@]}"; do
        local subdir_name="${pair%%:*}" type_code="${pair##*:}"
        migrate_subdir "$project_dir/$subdir_name" "$project_id" "$type_code" "$backup_dir"
    done

    # Also check for old wardley-maps location at root level
    local ward_count
    ward_count=${LAST_SEQ_WARD:-$(last_sequence "$project_dir/wardley-maps" "$project_id" "WARD")}
    for file in "$project_dir"/*-wardley.md "$project_dir"/*-map.md; do
        if [[ -f "$file" ]]; then
            ward_count=$((ward_count + 1))
            local seq_num=$(printf "%03d" $ward_count)
            local new_name="ARC-${project_id}-WARD-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/wardley-maps"
            fi
            migrate_file "$file" "$project_dir/wardley-maps/$new_name" "$backup_dir"
        fi
    done

    # Check for old diagram files at root
    local diag_count
    diag_count=${LAST_SEQ_DIAG:-$(last_sequence "$project_dir/diagrams" "$project_id" "DIAG")}
    for file in "$project_dir"/*-diagram.md "$project_dir"/diagram-*.md; do
        if [[ -f "$file" ]]; then
            diag_count=$((diag_count + 1))
            local seq_num=$(printf "%03d" $diag_count)
            local new_name="ARC-${project_id}-DIAG-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/diagrams"
            fi
            migrate_file "$file" "$project_dir/diagrams/$new_name" "$backup_dir"
        fi
    done

    # Check for ADR files at root level (should be in decisions/)
    local adr_count
    adr_count=${LAST_SEQ_ADR:-$(last_sequence "$project_dir/decisions" "$project_id" "ADR")}
    for file in "$project_dir"/adr-*.md "$project_dir"/ADR-*.md; do
        if [[ -f "$file" ]]; then
            adr_count=$((adr_count + 1))
            local seq_num=$(printf "%03d" $adr_count)
            local new_name="ARC-${project_id}-ADR-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/decisions"
            fi
            migrate_file "$file" "$project_dir/decisions/$new_name" "$backup_dir"
        fi
    done

    # Check for research files at root level (should be in research/)
    local rsch_count
    rsch_count=${LAST_SEQ_RSCH:-$(last_sequence "$project_dir/research" "$project_id" "RSCH")}
    for file in "$project_dir"/research-*.md "$project_dir"/research.md; do
        if [[ -f "$file" ]]; then
            rsch_count=$((rsch_count + 1))
            local seq_num=$(printf "%03d" $rsch_count)
            local new_name="ARC-${project_id}-RSCH-${seq_num}-v1.0.md"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$project_dir/research"
            fi
            migrate_file "$file" "$project_dir/research/$new_name" "$backup_dir"
        fi
    done

    # Check for version-suffixed traceability files (e.g., traceability-matrix-v4.md)
    for file in "$project_dir"/traceability-matrix-v*.md; do
        if [[ -f "$file" ]]; then
            local new_name="ARC-${project_id}-TRAC-v1.0.md"
            local new_path="$project_dir/$new_name"
            if [[ ! -f "$new_path" || "$FORCE" == "true" ]]; then
                migrate_file "$file" "$new_path" "$backup_dir"
            fi
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

# Migrate global principles from legacy locations
migrate_global_principles() {
    local global_dir="$REPO_ROOT/projects/000-global"
    local backup_dir="$global_dir/.backup/$(date +%Y%m%d_%H%M%S)"

    # Check legacy locations for principles
    local legacy_locations=(
        "$REPO_ROOT/.arckit/memory/architecture-principles.md"
        "$REPO_ROOT/.arckit/memory/principles.md"
    )

    for legacy_path in "${legacy_locations[@]}"; do
        if [[ -f "$legacy_path" ]]; then
            local new_name="ARC-000-PRIN-v1.0.md"
            local new_path="$global_dir/$new_name"

            if [[ -f "$new_path" && "$FORCE" == "false" ]]; then
                log_info "Principles already exist at: $new_path"
                return 0
            fi

            log_info "Found principles at legacy location: $legacy_path"

            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$global_dir"
            fi

            migrate_file "$legacy_path" "$new_path" "$backup_dir"
            return 0
        fi
    done
}

# Main execution
# Always try to migrate global principles first
migrate_global_principles

if [[ "$MIGRATE_GLOBAL" == "true" ]]; then
    # Migrate only the global directory (will be created if it doesn't exist)
    GLOBAL_DIR="$REPO_ROOT/projects/000-global"
    migrate_project "$GLOBAL_DIR"
elif [[ "$MIGRATE_ALL" == "true" ]]; then
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
