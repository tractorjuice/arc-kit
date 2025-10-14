#!/usr/bin/env bash
# Common utilities for ArcKit scripts

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Find the repository root
find_repo_root() {
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
        if [[ -d "$current_dir/.arckit" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    log_error "Not in an ArcKit project (no .arckit directory found)"
    exit 1
}

# Get the next project number
get_next_project_number() {
    local repo_root="$1"
    local projects_dir="$repo_root/projects"

    if [[ ! -d "$projects_dir" ]]; then
        echo "001"
        return 0
    fi

    local max_num=0
    for dir in "$projects_dir"/*; do
        if [[ -d "$dir" ]]; then
            local basename="$(basename "$dir")"
            if [[ "$basename" =~ ^([0-9]{3})- ]]; then
                local num="${BASH_REMATCH[1]}"
                if ((num > max_num)); then
                    max_num=$num
                fi
            fi
        fi
    done

    printf "%03d" $((max_num + 1))
}

# Create project directory structure
create_project_dir() {
    local project_dir="$1"

    mkdir -p "$project_dir"
    mkdir -p "$project_dir/vendors"
    mkdir -p "$project_dir/final"

    log_success "Created project directory: $project_dir"
}

# Output JSON for consumption by AI agents
output_json() {
    local project_dir="$1"
    local project_number="$2"
    local project_name="$3"

    cat <<EOF
{
  "project_dir": "$project_dir",
  "project_number": "$project_number",
  "project_name": "$project_name",
  "requirements_file": "$project_dir/requirements.md",
  "sow_file": "$project_dir/sow.md",
  "evaluation_file": "$project_dir/evaluation-criteria.md",
  "vendors_dir": "$project_dir/vendors",
  "traceability_file": "$project_dir/traceability-matrix.md"
}
EOF
}

# Check if git is available
check_git() {
    if ! command -v git &> /dev/null; then
        log_warning "Git not found - some features may not work"
        return 1
    fi
    return 0
}

# Slugify a string (convert to kebab-case)
slugify() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]\+/-/g' | sed 's/^-\|-$//g'
}
