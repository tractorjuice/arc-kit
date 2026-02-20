#!/usr/bin/env bash
# ArcKit Stop Hook — Wardley Map Math Validation
#
# Validates a generated Wardley Map document for consistency:
#   1. Stage-evolution alignment (Component Inventory tables)
#   2. Coordinate range validation (all values in [0.00, 1.00])
#   3. OWM syntax consistency (wardley code block vs Component Inventory)
#
# Input (stdin):  JSON { stop_hook_active, ... }
# Output (stdout): JSON with "decision": "block" and "reason" on failure, or empty on success
# Exit codes:      0 always (block via JSON decision, not exit code)

set -euo pipefail

# --- Read hook input ---
INPUT=$(cat)

# If this is already a re-fire after a block, allow stop to prevent infinite loops
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [[ "$STOP_HOOK_ACTIVE" == "true" ]]; then
  exit 0
fi

# --- Find most recently modified WARD file ---
WARD_FILE=""
NEWEST_MTIME=0
NOW=$(date +%s)
MAX_AGE=300  # 5 minutes

shopt -s nullglob globstar
for f in projects/*/wardley-maps/ARC-*-WARD-*.md; do
  MTIME=$(stat -c %Y "$f" 2>/dev/null || echo 0)
  AGE=$((NOW - MTIME))
  if [[ $AGE -le $MAX_AGE && $MTIME -gt $NEWEST_MTIME ]]; then
    NEWEST_MTIME=$MTIME
    WARD_FILE="$f"
  fi
done
shopt -u nullglob globstar

# No recent wardley file found — not a wardley run, allow stop
if [[ -z "$WARD_FILE" ]]; then
  exit 0
fi

FILENAME=$(basename "$WARD_FILE")
ERRORS=""

# --- Helper: classify evolution value into expected stage ---
evolution_to_stage() {
  local evo="$1"
  # Use awk for float comparison
  awk -v e="$evo" 'BEGIN {
    if (e < 0.25) print "Genesis"
    else if (e < 0.50) print "Custom"
    else if (e < 0.75) print "Product"
    else print "Commodity"
  }'
}

# --- Check 1: Stage-evolution alignment in Component Inventory tables ---
# Parse rows: | ComponentName | 0.XX | 0.XX | Stage | ... |
STAGE_ERRORS=""
while IFS= read -r line; do
  # Match table rows with at least 4 pipe-delimited columns containing coordinates
  if echo "$line" | grep -qP '^\|\s*[^|]+\s*\|\s*[0-9]+\.[0-9]+\s*\|\s*[0-9]+\.[0-9]+\s*\|\s*(Genesis|Custom|Product|Commodity)\s*\|'; then
    COMP=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2}')
    VIS=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3}')
    EVO=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $4); print $4}')
    STAGE=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $5); print $5}')

    # Skip template placeholder rows
    [[ "$COMP" == *"{"* ]] && continue
    [[ "$COMP" == "Component" ]] && continue

    EXPECTED=$(evolution_to_stage "$EVO")
    if [[ "$STAGE" != "$EXPECTED" ]]; then
      STAGE_ERRORS="${STAGE_ERRORS}\n- '${COMP}' has evolution ${EVO} but Stage is '${STAGE}' (expected '${EXPECTED}')"
    fi

    # Check 2: Coordinate range validation
    VIS_BAD=$(awk -v v="$VIS" 'BEGIN { print (v < 0.0 || v > 1.0) ? "1" : "0" }')
    EVO_BAD=$(awk -v e="$EVO" 'BEGIN { print (e < 0.0 || e > 1.0) ? "1" : "0" }')
    if [[ "$VIS_BAD" == "1" ]]; then
      ERRORS="${ERRORS}\n- '${COMP}' has visibility ${VIS} outside valid range [0.00, 1.00]"
    fi
    if [[ "$EVO_BAD" == "1" ]]; then
      ERRORS="${ERRORS}\n- '${COMP}' has evolution ${EVO} outside valid range [0.00, 1.00]"
    fi
  fi
done < "$WARD_FILE"

# --- Check 3: OWM syntax consistency ---
# Extract component coordinates from the wardley code block
declare -A OWM_VIS
declare -A OWM_EVO
declare -A TABLE_VIS
declare -A TABLE_EVO
OWM_ERRORS=""

IN_WARDLEY=0
while IFS= read -r line; do
  # Detect wardley code block boundaries
  if echo "$line" | grep -qP '^\s*```wardley'; then
    IN_WARDLEY=1
    continue
  fi
  if [[ $IN_WARDLEY -eq 1 ]] && echo "$line" | grep -qP '^\s*```'; then
    IN_WARDLEY=0
    continue
  fi

  if [[ $IN_WARDLEY -eq 1 ]]; then
    # Match: component Name [vis, evo]
    if echo "$line" | grep -qP '^\s*component\s+.+\s+\['; then
      # Extract component name and coordinates
      COMP_NAME=$(echo "$line" | sed -n 's/^\s*component\s\+\(.\+\)\s\+\[.*/\1/p' | sed 's/\s*$//')
      COORDS=$(echo "$line" | sed -n 's/.*\[\s*\([0-9.]*\)\s*,\s*\([0-9.]*\)\s*\].*/\1 \2/p')
      if [[ -n "$COMP_NAME" && -n "$COORDS" ]]; then
        OWM_V=$(echo "$COORDS" | awk '{print $1}')
        OWM_E=$(echo "$COORDS" | awk '{print $2}')
        OWM_VIS["$COMP_NAME"]="$OWM_V"
        OWM_EVO["$COMP_NAME"]="$OWM_E"
      fi
    fi
  fi
done < "$WARD_FILE"

# Build table coordinate map (re-read to collect table data for cross-reference)
while IFS= read -r line; do
  if echo "$line" | grep -qP '^\|\s*[^|]+\s*\|\s*[0-9]+\.[0-9]+\s*\|\s*[0-9]+\.[0-9]+\s*\|\s*(Genesis|Custom|Product|Commodity)\s*\|'; then
    COMP=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2}')
    VIS=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3}')
    EVO=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $4); print $4}')

    [[ "$COMP" == *"{"* ]] && continue
    [[ "$COMP" == "Component" ]] && continue

    TABLE_VIS["$COMP"]="$VIS"
    TABLE_EVO["$COMP"]="$EVO"
  fi
done < "$WARD_FILE"

# Cross-reference OWM coordinates vs table coordinates
for COMP_NAME in "${!OWM_VIS[@]}"; do
  if [[ -n "${TABLE_VIS[$COMP_NAME]+x}" ]]; then
    T_VIS="${TABLE_VIS[$COMP_NAME]}"
    T_EVO="${TABLE_EVO[$COMP_NAME]}"
    O_VIS="${OWM_VIS[$COMP_NAME]}"
    O_EVO="${OWM_EVO[$COMP_NAME]}"

    VIS_MATCH=$(awk -v a="$O_VIS" -v b="$T_VIS" 'BEGIN { print (a == b) ? "1" : "0" }')
    EVO_MATCH=$(awk -v a="$O_EVO" -v b="$T_EVO" 'BEGIN { print (a == b) ? "1" : "0" }')

    if [[ "$VIS_MATCH" == "0" || "$EVO_MATCH" == "0" ]]; then
      OWM_ERRORS="${OWM_ERRORS}\n- '${COMP_NAME}' is [${O_VIS}, ${O_EVO}] in OWM but [${T_VIS}, ${T_EVO}] in Component Inventory"
    fi
  fi
done

# --- Build error report ---
REPORT=""

if [[ -n "$STAGE_ERRORS" ]]; then
  REPORT="${REPORT}**Stage-Evolution Mismatches:**${STAGE_ERRORS}\n\n"
fi

if [[ -n "$ERRORS" ]]; then
  REPORT="${REPORT}**Coordinate Range Errors:**${ERRORS}\n\n"
fi

if [[ -n "$OWM_ERRORS" ]]; then
  REPORT="${REPORT}**OWM Coordinate Mismatches:**${OWM_ERRORS}\n\n"
fi

if [[ -n "$REPORT" ]]; then
  REASON="Wardley Map validation errors in ${FILENAME}:\n\n${REPORT}Fix these errors in the document, then stop again."
  # Use printf to expand \n, then jq to safely encode
  REASON_EXPANDED=$(printf '%b' "$REASON")
  jq -n --arg reason "$REASON_EXPANDED" '{"decision":"block","reason":$reason}'
  exit 0
fi

# All checks passed — allow stop
exit 0
