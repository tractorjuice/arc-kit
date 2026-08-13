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

# Find the repository root (looks for projects/ directory)
#
# NOTE: this function differs between the two copies of common.sh ON PURPOSE.
# This one keys on projects/, because a marketplace user never runs `arckit
# init` and so has projects/ but no .arckit/. The root copy (scripts/bash/) keys
# on .arckit/ instead. The two are exactly complementary; each fails in the repo
# shape the other handles. Declared in scripts/check-common-parity.py, which
# enforces parity everywhere else in this file (#766).
find_repo_root() {
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
        if [[ -d "$current_dir/projects" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    log_error "Not in an ArcKit project (no projects/ directory found)"
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
                # Force base 10. Directory prefixes are zero-padded, and bash
                # reads a leading 0 in an arithmetic context as octal: 008 and
                # 009 are invalid (the comparison errors and is skipped) while
                # 010 and 011 are silently read as 8 and 9. max_num then never
                # reached the true maximum and this returned a number that
                # already existed (#762).
                local num=$((10#${BASH_REMATCH[1]}))
                if ((num > max_num)); then
                    max_num=$num
                fi
            fi
        fi
    done

    printf "%03d" $((max_num + 1))
}

# Create project directory structure
#
# Refuses an existing target. `create-project.sh` only ever creates: the
# directory name carries a freshly allocated number, so a target that already
# exists means the numbering is wrong, not that the user picked a taken name.
# Bare `mkdir -p` succeeded in that case and the caller wrote a README and a
# full set of ARC-{NNN}-* paths over the top of the existing project, exiting 0
# (#762, #765). Fail here instead, before anything is written.
create_project_dir() {
    local project_dir="$1"

    if [[ -d "$project_dir" ]]; then
        log_error "Project directory already exists: $project_dir"
        log_error "This indicates a project-numbering fault, not a name collision."
        return 1
    fi

    mkdir -p "$project_dir"
    mkdir -p "$project_dir/vendors"
    mkdir -p "$project_dir/external"
    mkdir -p "$project_dir/final"
    mkdir -p "$project_dir/decisions"
    mkdir -p "$project_dir/diagrams"
    mkdir -p "$project_dir/wardley-maps"
    mkdir -p "$project_dir/data-contracts"
    mkdir -p "$project_dir/reviews"

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

# Slugify a string (convert to kebab-case, transliterating accents to ASCII)
#
# Accented characters become their ASCII equivalent (café -> cafe) rather than
# being deleted. The four copies of this function disagreed before #766: three
# dropped the character mid-word (caf-modernisation) and the fourth kept it via
# [:alnum:], which follows LC_CTYPE and so produced a different directory name
# under LC_ALL=C than under a UTF-8 locale.
#
# Transliterating keeps the result identical in every locale and in both
# languages, and keeps non-ASCII out of names that end up in filesystem paths,
# git and published URLs. Characters outside the table are dropped.
#
# Keep this table in step with slugify() in scripts/python/common.py. All four
# copies are held equal by tests/plugin/test_slugify.py.
slugify() {
    local s="$1" pair from to

    # Both cases are listed so this runs before ASCII lowercasing: bash can
    # only lowercase A-Z without depending on the locale.
    local -a translit=(
        'À:a' 'Á:a' 'Â:a' 'Ã:a' 'Ä:a' 'Å:a' 'à:a' 'á:a' 'â:a' 'ã:a' 'ä:a' 'å:a'
        'Æ:ae' 'æ:ae' 'Ç:c' 'ç:c'
        'È:e' 'É:e' 'Ê:e' 'Ë:e' 'è:e' 'é:e' 'ê:e' 'ë:e'
        'Ì:i' 'Í:i' 'Î:i' 'Ï:i' 'ì:i' 'í:i' 'î:i' 'ï:i'
        'Ð:d' 'ð:d' 'Ñ:n' 'ñ:n'
        'Ò:o' 'Ó:o' 'Ô:o' 'Õ:o' 'Ö:o' 'Ø:o' 'ò:o' 'ó:o' 'ô:o' 'õ:o' 'ö:o' 'ø:o'
        'Ù:u' 'Ú:u' 'Û:u' 'Ü:u' 'ù:u' 'ú:u' 'û:u' 'ü:u'
        'Ý:y' 'ý:y' 'Ÿ:y' 'ÿ:y' 'Þ:th' 'þ:th' 'ß:ss'
        'Ā:a' 'ā:a' 'Ą:a' 'ą:a'
        'Ć:c' 'ć:c' 'Č:c' 'č:c' 'Ď:d' 'ď:d'
        'Ē:e' 'ē:e' 'Ė:e' 'ė:e' 'Ę:e' 'ę:e' 'Ě:e' 'ě:e'
        'Ğ:g' 'ğ:g'
        'Ī:i' 'ī:i' 'Į:i' 'į:i' 'İ:i' 'ı:i'
        'Ł:l' 'ł:l' 'Ń:n' 'ń:n' 'Ň:n' 'ň:n'
        'Ō:o' 'ō:o' 'Ő:o' 'ő:o' 'Œ:oe' 'œ:oe'
        'Ř:r' 'ř:r'
        'Ś:s' 'ś:s' 'Š:s' 'š:s' 'Ş:s' 'ş:s'
        'Ť:t' 'ť:t' 'Ţ:t' 'ţ:t'
        'Ū:u' 'ū:u' 'Ů:u' 'ů:u' 'Ű:u' 'ű:u'
        'Ź:z' 'ź:z' 'Ż:z' 'ż:z' 'Ž:z' 'ž:z'
    )

    for pair in "${translit[@]}"; do
        from="${pair%%:*}"
        to="${pair#*:}"
        s="${s//"$from"/"$to"}"
    done

    # LC_ALL=C keeps both steps byte-oriented, so the slug never depends on the
    # caller's environment. The character classes are spelled out rather than
    # using \+ or \|, which are GNU extensions and not portable to BSD sed.
    s="$(printf '%s' "$s" | LC_ALL=C tr 'A-Z' 'a-z')"
    printf '%s' "$s" | LC_ALL=C sed -e 's/[^a-z0-9][^a-z0-9]*/-/g' -e 's/^-//' -e 's/-$//'
}

# ============================================================================
# Git Integration Functions
# ============================================================================

# Check if git is available (enhanced version)
has_git() {
    command -v git >/dev/null 2>&1
}

# Get current git branch
get_current_branch() {
    if has_git && git rev-parse --git-dir > /dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main"
    else
        echo "main"
    fi
}

# Check if working directory is clean
check_git_clean() {
    if ! has_git; then
        return 0  # If no git, consider it "clean"
    fi

    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "You have uncommitted changes"
        return 1
    fi
    return 0
}

# Get repository root using git (fallback to .arckit search)
get_repo_root() {
    if has_git && git rev-parse --git-dir > /dev/null 2>&1; then
        git rev-parse --show-toplevel 2>/dev/null
    else
        find_repo_root
    fi
}

# ============================================================================
# Project Finding and Management
# ============================================================================

# Find project directory by number or prefix
find_project_dir_by_prefix() {
    local prefix="$1"
    local repo_root="${2:-$(find_repo_root)}"
    local projects_dir="$repo_root/projects"

    if [[ ! -d "$projects_dir" ]]; then
        log_error "No projects directory found"
        return 1
    fi

    # Exact match first (e.g., "001")
    for dir in "$projects_dir"/*; do
        if [[ -d "$dir" ]]; then
            local basename=$(basename "$dir")
            # Check if matches exactly at start (001, 001-payment)
            if [[ "$basename" == "$prefix" ]] || [[ "$basename" == "$prefix-"* ]]; then
                echo "$dir"
                return 0
            fi
        fi
    done

    # Fuzzy match (e.g., "payment" matches "001-payment-gateway")
    for dir in "$projects_dir"/*; do
        if [[ -d "$dir" ]]; then
            local basename=$(basename "$dir")
            if [[ "$basename" == *"$prefix"* ]]; then
                echo "$dir"
                return 0
            fi
        fi
    done

    log_error "No project found matching: $prefix"
    return 1
}

# List all projects
list_projects() {
    local repo_root="${1:-$(find_repo_root)}"
    local projects_dir="$repo_root/projects"

    if [[ ! -d "$projects_dir" ]] || [[ -z $(ls -A "$projects_dir" 2>/dev/null) ]]; then
        echo "No projects found"
        return 0
    fi

    echo "Available projects:"
    for dir in "$projects_dir"/*; do
        if [[ -d "$dir" ]]; then
            local basename=$(basename "$dir")
            echo "  - $basename"
        fi
    done
}

# Get project number from directory name
get_project_number_from_dir() {
    local dir="$1"
    local basename=$(basename "$dir")

    if [[ "$basename" =~ ^([0-9]{3})- ]]; then
        echo "${BASH_REMATCH[1]}"
        return 0
    fi

    return 1
}

# ============================================================================
# Validation Helper Functions
# ============================================================================

# Check if file exists and print status
check_file() {
    local file="$1"
    local description="${2:-$(basename "$file")}"

    if [[ -f "$file" ]]; then
        echo "  ✓ $description"
        return 0
    else
        echo "  ✗ $description"
        return 1
    fi
}

# Check if directory exists and is not empty
check_dir() {
    local dir="$1"
    local description="${2:-$(basename "$dir")}"

    if [[ -d "$dir" && -n $(ls -A "$dir" 2>/dev/null) ]]; then
        echo "  ✓ $description"
        return 0
    else
        echo "  ✗ $description"
        return 1
    fi
}

# Require file to exist (exit with error if not)
require_file() {
    local file="$1"
    local description="${2:-$(basename "$file")}"

    if [[ ! -f "$file" ]]; then
        log_error "Required file not found: $description"
        log_error "  Path: $file"
        return 1
    fi

    log_success "Found: $description"
    return 0
}

# Require directory to exist
require_dir() {
    local dir="$1"
    local description="${2:-$(basename "$dir")}"

    if [[ ! -d "$dir" ]]; then
        log_error "Required directory not found: $description"
        log_error "  Path: $dir"
        return 1
    fi

    log_success "Found: $description"
    return 0
}

# ============================================================================
# JSON Helper Functions
# ============================================================================

# Escape string for JSON
json_escape() {
    local string="$1"
    # Escape backslashes, quotes, and newlines
    echo "$string" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g'
}

# Output JSON array from bash array
output_json_array() {
    local items=("$@")
    local json="["
    local first=true

    for item in "${items[@]}"; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            json="$json,"
        fi
        json="$json\"$(json_escape "$item")\""
    done

    json="$json]"
    echo "$json"
}

# Check if running in JSON mode (common pattern)
is_json_mode() {
    [[ "${JSON_MODE:-false}" == "true" ]]
}

# ============================================================================
# Path Helper Functions
# ============================================================================

# Get .arckit directory path
get_arckit_dir() {
    local repo_root="${1:-$(find_repo_root)}"
    echo "$repo_root/.arckit"
}

# Get templates directory path
get_templates_dir() {
    local repo_root="${1:-$(find_repo_root)}"
    echo "$repo_root/.arckit/templates"
}

# Get projects directory path
get_projects_dir() {
    local repo_root="${1:-$(find_repo_root)}"
    echo "$repo_root/projects"
}

# Get memory directory path
get_memory_dir() {
    local repo_root="${1:-$(find_repo_root)}"
    echo "$repo_root/projects/000-global"
}
