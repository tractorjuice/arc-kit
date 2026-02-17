#!/usr/bin/env bash
# ArcKit PreToolUse (Write) Hook — ARC Filename Convention Enforcement
#
# Intercepts Write tool calls targeting ARC-* files under projects/ and auto-corrects
# filenames to match the ArcKit naming convention (ARC-{PID}-{TYPE}[-{SEQ}]-v{VER}.md).
#
# Corrections applied:
#   - Zero-pads project ID to 3 digits (1 → 001)
#   - Normalizes version format (v1 → v1.0)
#   - Corrects project ID to match directory number (ARC-999 in 001-foo/ → ARC-001)
#   - Moves multi-instance types to correct subdirectory (ADR → decisions/)
#   - Assigns next sequence number for multi-instance types missing one
#   - Creates subdirectories as needed (mkdir -p)
#
# Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
# Output (stdout): JSON with updatedInput for corrected path, or empty for pass-through
# Exit codes:      0 = allow (with or without corrections), 2 = block (invalid type code)

set -euo pipefail

# --- Configuration ---

# All valid ArcKit document type codes (~47)
KNOWN_TYPES=(
  PRIN STKE REQ RISK SOBC PLAN ROAD STRAT BKLG STORY
  HLDR DLDR DATA WARD DIAG DFD ADR TRAC TCOP
  SECD SECD-MOD AIPB ATRS DPIA JSP936 SVCASS SNOW
  DEVOPS MLOPS FINOPS OPS PLAT SOW EVAL DOS GCLD GCLC
  DMC RSCH AWRS AZRS GCRS DSCT ANAL GAPS PRIN-COMP VEND
)

# Multi-instance types that require sequence numbers
MULTI_INSTANCE_TYPES=(ADR DIAG DFD WARD DMC)

# Multi-instance type → required subdirectory
declare -A SUBDIR_MAP=(
  [ADR]="decisions"
  [DIAG]="diagrams"
  [DFD]="diagrams"
  [WARD]="wardley-maps"
  [DMC]="data-contracts"
)

# --- Helper functions ---

is_known_type() {
  local type="$1"
  for t in "${KNOWN_TYPES[@]}"; do
    [[ "$t" == "$type" ]] && return 0
  done
  return 1
}

is_multi_instance() {
  local type="$1"
  for t in "${MULTI_INSTANCE_TYPES[@]}"; do
    [[ "$t" == "$type" ]] && return 0
  done
  return 1
}

# --- Main ---

# Read hook input from stdin
INPUT=$(cat)

# Extract file_path from tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
[[ -z "$FILE_PATH" ]] && exit 0

# Resolve relative paths using cwd (Write tool should always use absolute, but be safe)
if [[ "$FILE_PATH" != /* ]]; then
  CWD=$(echo "$INPUT" | jq -r '.cwd // ""')
  [[ -n "$CWD" ]] && FILE_PATH="${CWD}/${FILE_PATH}"
fi

FILENAME=$(basename "$FILE_PATH")
DIRPATH=$(dirname "$FILE_PATH")

# Early exit: only process ARC-*.md files under a projects/ directory
[[ "$FILE_PATH" != *"/projects/"* ]] && exit 0
[[ "$FILENAME" != ARC-* ]] && exit 0
[[ "$FILENAME" != *.md ]] && exit 0

# --- Extract project directory info ---
# Path format: .../projects/{NNN-name}/[subdir/]ARC-*.md

AFTER_PROJECTS="${FILE_PATH#*projects/}"
PROJECT_DIR_NAME="${AFTER_PROJECTS%%/*}"
PROJECTS_BASE="${FILE_PATH%%projects/*}projects"
PROJECT_DIR="${PROJECTS_BASE}/${PROJECT_DIR_NAME}"

# Extract project number from directory name (e.g., "001-foo" → "001")
DIR_PROJECT_NUM=""
if [[ "$PROJECT_DIR_NAME" =~ ^([0-9]+)- ]]; then
  DIR_PROJECT_NUM="${BASH_REMATCH[1]}"
fi

# --- Parse ARC filename ---
# Patterns: ARC-001-REQ-v1.0.md, ARC-001-ADR-001-v1.0.md, ARC-001-SECD-MOD-v1.0.md

CORE="${FILENAME#ARC-}"   # Strip ARC- prefix
CORE="${CORE%.md}"         # Strip .md suffix

# Extract version: match last -vN.N or -vN
if [[ "$CORE" =~ ^(.+)-v([0-9]+\.?[0-9]*)$ ]]; then
  PRE_VERSION="${BASH_REMATCH[1]}"
  RAW_VERSION="${BASH_REMATCH[2]}"
else
  # Can't parse version — not a standard ARC filename, pass through
  exit 0
fi

# Extract project ID (first numeric segment)
if [[ "$PRE_VERSION" =~ ^([0-9]+)-(.+)$ ]]; then
  RAW_PROJECT_ID="${BASH_REMATCH[1]}"
  TYPE_AND_SEQ="${BASH_REMATCH[2]}"
else
  # Can't parse project ID — pass through
  exit 0
fi

# --- Determine doc type code and optional sequence number ---
# Distinguish multi-instance seq nums (ADR-001) from compound types (SECD-MOD)
# by checking if trailing -NNN is all digits AND the prefix is a multi-instance type

DOC_TYPE=""
SEQ_NUM=""

if [[ "$TYPE_AND_SEQ" =~ ^(.+)-([0-9]{3})$ ]]; then
  POTENTIAL_TYPE="${BASH_REMATCH[1]}"
  POTENTIAL_SEQ="${BASH_REMATCH[2]}"
  if is_multi_instance "$POTENTIAL_TYPE"; then
    DOC_TYPE="$POTENTIAL_TYPE"
    SEQ_NUM="$POTENTIAL_SEQ"
  else
    # Trailing digits aren't a sequence number (no known multi-instance type matches)
    DOC_TYPE="$TYPE_AND_SEQ"
  fi
else
  DOC_TYPE="$TYPE_AND_SEQ"
fi

# --- Validate doc type code ---

if ! is_known_type "$DOC_TYPE"; then
  VALID_LIST=$(printf '%s ' "${KNOWN_TYPES[@]}")
  echo "ArcKit: Unknown document type code '${DOC_TYPE}'. Valid codes: ${VALID_LIST}" >&2
  exit 2
fi

# --- Normalize project ID (3-digit zero-padded) ---
# Use directory number as authoritative source if available

if [[ -n "$DIR_PROJECT_NUM" ]]; then
  PID_CLEAN=$(echo "$DIR_PROJECT_NUM" | sed 's/^0*//')
  PID_CLEAN=${PID_CLEAN:-0}
else
  PID_CLEAN=$(echo "$RAW_PROJECT_ID" | sed 's/^0*//')
  PID_CLEAN=${PID_CLEAN:-0}
fi
PADDED_PID=$(printf "%03d" "$PID_CLEAN")

# --- Normalize version (ensure N.N format) ---

if [[ "$RAW_VERSION" =~ ^[0-9]+$ ]]; then
  NORM_VERSION="${RAW_VERSION}.0"
else
  NORM_VERSION="$RAW_VERSION"
fi

# --- Handle multi-instance types (ADR, DIAG, DFD, WARD, DMC) ---

if is_multi_instance "$DOC_TYPE"; then
  REQUIRED_SUBDIR="${SUBDIR_MAP[$DOC_TYPE]}"
  TARGET_DIR="${PROJECT_DIR}/${REQUIRED_SUBDIR}"

  if [[ -z "$SEQ_NUM" ]]; then
    # Claude omitted sequence number — scan directory and assign next available
    mkdir -p "$TARGET_DIR"
    LAST_NUM=0
    PATTERN="ARC-${PADDED_PID}-${DOC_TYPE}-"

    shopt -s nullglob
    for file in "${TARGET_DIR}"/${PATTERN}*.md; do
      fname=$(basename "$file")
      num=$(echo "$fname" | sed -n "s/ARC-${PADDED_PID}-${DOC_TYPE}-\([0-9]*\)-.*/\1/p")
      if [[ -n "$num" ]]; then
        num_clean=$((10#$num))
        if [[ $num_clean -gt $LAST_NUM ]]; then
          LAST_NUM=$num_clean
        fi
      fi
    done
    shopt -u nullglob

    SEQ_NUM=$(printf "%03d" $((LAST_NUM + 1)))
  else
    # Claude provided a sequence number — keep it, ensure directory exists
    mkdir -p "$TARGET_DIR"
  fi

  CORRECTED_FILENAME="ARC-${PADDED_PID}-${DOC_TYPE}-${SEQ_NUM}-v${NORM_VERSION}.md"
  CORRECTED_PATH="${TARGET_DIR}/${CORRECTED_FILENAME}"
else
  # Single-instance type — keep directory as Claude specified, only correct filename
  CORRECTED_FILENAME="ARC-${PADDED_PID}-${DOC_TYPE}-v${NORM_VERSION}.md"
  CORRECTED_PATH="${DIRPATH}/${CORRECTED_FILENAME}"
fi

# --- Compare and output ---

# If no corrections needed, exit silently (allow as-is)
if [[ "$CORRECTED_PATH" == "$FILE_PATH" ]]; then
  exit 0
fi

# Return updatedInput with corrected file_path (preserves original content)
echo "$INPUT" | jq --arg path "$CORRECTED_PATH" \
  '{ updatedInput: (.tool_input | .file_path = $path) }'
