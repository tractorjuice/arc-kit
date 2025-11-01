#!/usr/bin/env bash
#
# Generate standardized ArcKit document IDs
# Usage: ./generate-document-id.sh PROJECT_ID DOC_TYPE [VERSION]
#
# Examples:
#   ./generate-document-id.sh 001 REQ          → ARC-001-REQ-v1.0
#   ./generate-document-id.sh 042 HLD 2.1      → ARC-042-HLD-v2.1
#   ./generate-document-id.sh 003 ATRS         → ARC-003-ATRS-v1.0

set -euo pipefail

# Get arguments
PROJECT_ID="${1:-}"
DOC_TYPE="${2:-}"
VERSION="${3:-1.0}"

# Validate inputs
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID required" >&2
    echo "Usage: $0 PROJECT_ID DOC_TYPE [VERSION]" >&2
    exit 1
fi

if [ -z "$DOC_TYPE" ]; then
    echo "Error: DOC_TYPE required" >&2
    echo "Usage: $0 PROJECT_ID DOC_TYPE [VERSION]" >&2
    exit 1
fi

# Ensure PROJECT_ID is zero-padded to 3 digits
PROJECT_ID_PADDED=$(printf "%03d" "$PROJECT_ID")

# Generate document ID
DOC_ID="ARC-${PROJECT_ID_PADDED}-${DOC_TYPE}-v${VERSION}"

echo "$DOC_ID"
