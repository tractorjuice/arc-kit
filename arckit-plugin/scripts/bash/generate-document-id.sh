#!/usr/bin/env bash
#
# Generate standardized ArcKit document IDs
# Usage: ./generate-document-id.sh PROJECT_ID DOC_TYPE [VERSION] [OPTIONS]
#
# Options:
#   --filename           Return ID with .md extension (e.g., ARC-001-REQ-v1.0.md)
#   --next-num DIR       For multi-instance types, find next sequence number
#                        by scanning DIR for existing files
#
# Examples:
#   ./generate-document-id.sh 001 REQ          → ARC-001-REQ-v1.0
#   ./generate-document-id.sh 042 HLD 2.1      → ARC-042-HLD-v2.1
#   ./generate-document-id.sh 003 ATRS         → ARC-003-ATRS-v1.0
#   ./generate-document-id.sh 001 REQ 1.0 --filename → ARC-001-REQ-v1.0.md
#   ./generate-document-id.sh 001 ADR 1.0 --filename --next-num ./decisions → ARC-001-ADR-001-v1.0.md
#
# Multi-instance types (require --next-num for sequence numbering):
#   ADR, DIAG, WARD, DMC

set -euo pipefail

# Parse arguments
PROJECT_ID=""
DOC_TYPE=""
VERSION="1.0"
ADD_EXTENSION=false
NEXT_NUM_DIR=""

# Process positional and optional arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --filename)
            ADD_EXTENSION=true
            shift
            ;;
        --next-num)
            if [[ $# -lt 2 || "$2" == --* ]]; then
                echo "Error: --next-num requires a directory argument" >&2
                echo "Usage: $0 PROJECT_ID DOC_TYPE [VERSION] [--filename] [--next-num DIR]" >&2
                exit 1
            fi
            NEXT_NUM_DIR="$2"
            shift 2
            ;;
        -*)
            echo "Error: Unknown option: $1" >&2
            exit 1
            ;;
        *)
            # Positional arguments
            if [ -z "$PROJECT_ID" ]; then
                PROJECT_ID="$1"
            elif [ -z "$DOC_TYPE" ]; then
                DOC_TYPE="$1"
            else
                VERSION="$1"
            fi
            shift
            ;;
    esac
done

# Validate inputs
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID required" >&2
    echo "Usage: $0 PROJECT_ID DOC_TYPE [VERSION] [--filename] [--next-num DIR]" >&2
    exit 1
fi

if [ -z "$DOC_TYPE" ]; then
    echo "Error: DOC_TYPE required" >&2
    echo "Usage: $0 PROJECT_ID DOC_TYPE [VERSION] [--filename] [--next-num DIR]" >&2
    exit 1
fi

# Ensure PROJECT_ID is zero-padded to 3 digits
# Remove leading zeros first to avoid octal interpretation
PROJECT_ID_CLEAN=$(echo "$PROJECT_ID" | sed 's/^0*//')
PROJECT_ID_CLEAN=${PROJECT_ID_CLEAN:-0}
PROJECT_ID_PADDED=$(printf "%03d" "$PROJECT_ID_CLEAN")

# Multi-instance document types that require sequence numbers
MULTI_INSTANCE_TYPES="ADR DIAG WARD DMC"

# Check if this is a multi-instance type
is_multi_instance() {
    local type="$1"
    for t in $MULTI_INSTANCE_TYPES; do
        if [ "$t" = "$type" ]; then
            return 0
        fi
    done
    return 1
}

# Generate document ID
if is_multi_instance "$DOC_TYPE"; then
    if [ -n "$NEXT_NUM_DIR" ]; then
        # Find next sequence number by scanning directory
        if [ -d "$NEXT_NUM_DIR" ]; then
            # Look for existing files matching pattern ARC-{PID}-{TYPE}-{NUM}-*
            PATTERN="ARC-${PROJECT_ID_PADDED}-${DOC_TYPE}-"
            LAST_NUM=0

            shopt -s nullglob
            for file in "$NEXT_NUM_DIR"/${PATTERN}*.md; do
                if [ -f "$file" ]; then
                    # Extract the sequence number from filename
                    basename_file=$(basename "$file")
                    # Pattern: ARC-001-ADR-001-v1.0.md -> extract 001 (the sequence number)
                    num=$(echo "$basename_file" | sed -n "s/ARC-${PROJECT_ID_PADDED}-${DOC_TYPE}-\([0-9]*\)-.*/\1/p")
                    if [ -n "$num" ]; then
                        # Remove leading zeros for comparison
                        num_clean=$((10#$num))
                        if [ "$num_clean" -gt "$LAST_NUM" ]; then
                            LAST_NUM=$num_clean
                        fi
                    fi
                fi
            done

            NEXT_NUM=$(printf "%03d" $((LAST_NUM + 1)))
        else
            # Directory doesn't exist yet, start at 001
            NEXT_NUM="001"
        fi
        DOC_ID="ARC-${PROJECT_ID_PADDED}-${DOC_TYPE}-${NEXT_NUM}-v${VERSION}"
    else
        # No --next-num provided, require explicit sequence number
        echo "Error: Multi-instance type '$DOC_TYPE' requires --next-num DIR option" >&2
        echo "Usage: $0 $PROJECT_ID $DOC_TYPE $VERSION --next-num ./directory" >&2
        exit 1
    fi
else
    # Single-instance document type
    DOC_ID="ARC-${PROJECT_ID_PADDED}-${DOC_TYPE}-v${VERSION}"
fi

# Add file extension if requested
if [ "$ADD_EXTENSION" = true ]; then
    DOC_ID="${DOC_ID}.md"
fi

echo "$DOC_ID"
