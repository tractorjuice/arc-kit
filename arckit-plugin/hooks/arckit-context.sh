#!/usr/bin/env bash
# ArcKit UserPromptSubmit Hook
#
# Pre-computes project context when any /arckit: command is run.
# Injects project inventory, artifact lists, and external documents
# as a systemMessage so commands don't need to discover this themselves.
#
# Input (stdin): JSON with user_prompt, cwd, etc.
# Output (stdout): JSON with systemMessage containing project context

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)

# Extract user prompt
USER_PROMPT=$(echo "$INPUT" | jq -r '.user_prompt // ""')

# Only run for /arckit: commands (not for general prompts)
if [[ ! "$USER_PROMPT" =~ ^/arckit: ]]; then
  exit 0
fi

# Commands that don't need project context — exit early
COMMAND=$(echo "$USER_PROMPT" | sed 's|^/arckit:\([a-z_-]*\).*|\1|')
case "$COMMAND" in
  pages|customize|create|init|list|trello)
    exit 0
    ;;
esac

# Find repo root by looking for projects/ directory
CWD=$(echo "$INPUT" | jq -r '.cwd // ""')
REPO_ROOT="${CWD:-$PWD}"
while [[ "$REPO_ROOT" != "/" ]]; do
  if [[ -d "$REPO_ROOT/projects" ]]; then
    break
  fi
  REPO_ROOT="$(dirname "$REPO_ROOT")"
done

if [[ ! -d "$REPO_ROOT/projects" ]]; then
  exit 0
fi

PROJECTS_DIR="$REPO_ROOT/projects"

# Doc type code to human-readable name mapping
doc_type_name() {
  case "$1" in
    PRIN)     echo "Architecture Principles" ;;
    STKE)     echo "Stakeholder Analysis" ;;
    REQ)      echo "Requirements" ;;
    RISK)     echo "Risk Register" ;;
    SOBC)     echo "Business Case" ;;
    PLAN)     echo "Project Plan" ;;
    ROAD)     echo "Roadmap" ;;
    STRAT)    echo "Architecture Strategy" ;;
    BKLG)     echo "Product Backlog" ;;
    HLDR)     echo "High-Level Design Review" ;;
    DLDR)     echo "Detailed Design Review" ;;
    DATA)     echo "Data Model" ;;
    WARD)     echo "Wardley Map" ;;
    DIAG)     echo "Architecture Diagram" ;;
    DFD)      echo "Data Flow Diagram" ;;
    ADR)      echo "Architecture Decision Record" ;;
    TRAC)     echo "Traceability Matrix" ;;
    TCOP)     echo "TCoP Assessment" ;;
    SECD)     echo "Secure by Design" ;;
    SECD-MOD) echo "MOD Secure by Design" ;;
    AIPB)     echo "AI Playbook Assessment" ;;
    ATRS)     echo "ATRS Record" ;;
    DPIA)     echo "Data Protection Impact Assessment" ;;
    JSP936)   echo "JSP 936 Assessment" ;;
    SVCASS)   echo "Service Assessment" ;;
    SNOW)     echo "ServiceNow Design" ;;
    DEVOPS)   echo "DevOps Strategy" ;;
    MLOPS)    echo "MLOps Strategy" ;;
    FINOPS)   echo "FinOps Strategy" ;;
    OPS)      echo "Operational Readiness" ;;
    PLAT)     echo "Platform Design" ;;
    SOW)      echo "Statement of Work" ;;
    EVAL)     echo "Evaluation Criteria" ;;
    DOS)      echo "DOS Requirements" ;;
    GCLD)     echo "G-Cloud Search" ;;
    GCLC)     echo "G-Cloud Clarifications" ;;
    DMC)      echo "Data Mesh Contract" ;;
    RSCH)     echo "Research Findings" ;;
    AWRS)     echo "AWS Research" ;;
    AZRS)     echo "Azure Research" ;;
    GCRS)     echo "GCP Research" ;;
    DSCT)     echo "Data Source Discovery" ;;
    STORY)    echo "Project Story" ;;
    ANAL)     echo "Analysis Report" ;;
    PRIN-COMP) echo "Principles Compliance" ;;
    *)        echo "$1" ;;
  esac
}

# Extract doc type code from ARC filename
# ARC-001-REQ-v1.0.md → REQ
# ARC-001-ADR-001-v1.0.md → ADR
# ARC-001-SECD-MOD-v1.0.md → SECD-MOD
extract_doc_type() {
  local filename="$1"
  # Strip ARC-NNN- prefix and -vN.N.md suffix
  local middle="${filename#ARC-[0-9][0-9][0-9]-}"
  # Remove version suffix: -vN.N.md or -NNN-vN.N.md (multi-instance)
  # Handle: REQ-v1.0.md, ADR-001-v1.0.md, SECD-MOD-v1.0.md
  local type_part="${middle%-v[0-9]*}"
  # Strip trailing -NNN for multi-instance types
  if [[ "$type_part" =~ ^([A-Z]+-?[A-Z]*)-[0-9]{3}$ ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    echo "$type_part"
  fi
}

# Build context string
CONTEXT="## ArcKit Project Context (auto-detected by hook)\n\n"
CONTEXT+="Repository: ${REPO_ROOT}\n\n"

PROJECT_COUNT=0
for project_dir in "$PROJECTS_DIR"/*/; do
  [[ -d "$project_dir" ]] || continue
  PROJECT_COUNT=$((PROJECT_COUNT + 1))
done

CONTEXT+="**${PROJECT_COUNT} project(s) found:**\n\n"

# Scan each project
for project_dir in "$PROJECTS_DIR"/*/; do
  [[ -d "$project_dir" ]] || continue

  project_name=$(basename "$project_dir")

  # Extract project number
  project_number=""
  if [[ "$project_name" =~ ^([0-9]{3})- ]]; then
    project_number="${BASH_REMATCH[1]}"
  fi

  CONTEXT+="### ${project_name}\n"
  CONTEXT+="- **Path**: ${project_dir%/}\n"
  [[ -n "$project_number" ]] && CONTEXT+="- **Project ID**: ${project_number}\n"

  # Scan for ARC-* artifacts in main project dir
  ARTIFACT_LIST=""
  ARTIFACT_COUNT=0
  for f in "$project_dir"ARC-*.md; do
    [[ -f "$f" ]] || continue
    fname=$(basename "$f")
    dtype=$(extract_doc_type "$fname")
    dname=$(doc_type_name "$dtype")
    ARTIFACT_LIST+="  - \`${fname}\` (${dname})\n"
    ARTIFACT_COUNT=$((ARTIFACT_COUNT + 1))
  done

  # Also scan subdirectories: decisions/, diagrams/, wardley-maps/
  for subdir in decisions diagrams wardley-maps data-contracts reviews; do
    if [[ -d "${project_dir}${subdir}" ]]; then
      for f in "${project_dir}${subdir}"/ARC-*.md; do
        [[ -f "$f" ]] || continue
        fname=$(basename "$f")
        dtype=$(extract_doc_type "$fname")
        dname=$(doc_type_name "$dtype")
        ARTIFACT_LIST+="  - \`${subdir}/${fname}\` (${dname})\n"
        ARTIFACT_COUNT=$((ARTIFACT_COUNT + 1))
      done
    fi
  done

  if [[ $ARTIFACT_COUNT -gt 0 ]]; then
    CONTEXT+="- **Artifacts** (${ARTIFACT_COUNT}):\n${ARTIFACT_LIST}"
  else
    CONTEXT+="- **Artifacts**: none\n"
  fi

  # Check for vendor directories
  if [[ -d "${project_dir}vendors" ]]; then
    VENDOR_COUNT=0
    VENDOR_LIST=""
    for vdir in "${project_dir}vendors"/*/; do
      [[ -d "$vdir" ]] || continue
      VENDOR_COUNT=$((VENDOR_COUNT + 1))
      VENDOR_LIST+="  - $(basename "$vdir")\n"
    done
    if [[ $VENDOR_COUNT -gt 0 ]]; then
      CONTEXT+="- **Vendors** (${VENDOR_COUNT}):\n${VENDOR_LIST}"
    fi
  fi

  # Check for external documents
  if [[ -d "${project_dir}external" ]]; then
    EXT_LIST=""
    EXT_COUNT=0
    for f in "${project_dir}external"/*; do
      [[ -f "$f" ]] || continue
      fname=$(basename "$f")
      [[ "$fname" == "README.md" ]] && continue
      EXT_LIST+="  - \`${fname}\`\n"
      EXT_COUNT=$((EXT_COUNT + 1))
    done
    if [[ $EXT_COUNT -gt 0 ]]; then
      CONTEXT+="- **External documents** (${EXT_COUNT}) in \`external/\`:\n${EXT_LIST}"
    fi
  fi

  CONTEXT+="\n"
done

# Also check for global policies
if [[ -d "$PROJECTS_DIR/000-global/policies" ]]; then
  POLICY_COUNT=0
  POLICY_LIST=""
  for f in "$PROJECTS_DIR/000-global/policies"/*; do
    [[ -f "$f" ]] || continue
    fname=$(basename "$f")
    POLICY_LIST+="  - \`${fname}\`\n"
    POLICY_COUNT=$((POLICY_COUNT + 1))
  done
  if [[ $POLICY_COUNT -gt 0 ]]; then
    CONTEXT+="### Global Policies (000-global/policies/)\n"
    CONTEXT+="${POLICY_LIST}\n"
  fi
fi

# Use jq to safely build JSON output with proper escaping
CONTEXT_TEXT=$(printf '%b' "$CONTEXT")

jq -n \
  --arg msg "$CONTEXT_TEXT" \
  '{
    "suppressOutput": true,
    "systemMessage": $msg
  }'
