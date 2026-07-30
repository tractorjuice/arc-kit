#!/usr/bin/env bash
#
# Backward-compatibility shim for generate-document-id.mjs.
#
# The generator moved to Node in #723 so it could import the doc-type registry
# from config/doc-types.mjs rather than restating it. This wrapper keeps the old
# path and argument contract working for projects scaffolded before the move,
# and for anything invoking the script by its historic name.
#
# Prefer calling the .mjs directly:
#   node "$(dirname "${BASH_SOURCE[0]}")/../generate-document-id.mjs" ...
#
# This shim will be removed a release after #723 ships.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATOR="${SCRIPT_DIR}/../generate-document-id.mjs"

if [ ! -f "$GENERATOR" ]; then
    echo "Error: generator not found at $GENERATOR" >&2
    echo "       Re-run 'arckit init' to refresh .arckit/, or reinstall the plugin." >&2
    exit 1
fi

exec node "$GENERATOR" "$@"
