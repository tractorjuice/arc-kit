#!/usr/bin/env python3
"""
Generate standardized ArcKit document IDs.

Usage:
    python3 generate-document-id.py PROJECT_ID DOC_TYPE [VERSION] [OPTIONS]

Options:
    --filename           Return ID with .md extension
    --next-num DIR       For multi-instance types, find next sequence number

Examples:
    python3 generate-document-id.py 001 REQ          -> ARC-001-REQ-v1.0
    python3 generate-document-id.py 042 HLD 2.1      -> ARC-042-HLD-v2.1
    python3 generate-document-id.py 001 REQ 1.0 --filename -> ARC-001-REQ-v1.0.md
    python3 generate-document-id.py 001 ADR 1.0 --filename --next-num ./decisions -> ARC-001-ADR-001-v1.0.md
"""

import argparse
import glob
import os
import re
import sys

# Multi-instance document types that require sequence numbers
# Keep in sync with arckit-claude/config/doc-types.mjs MULTI_INSTANCE_TYPES
MULTI_INSTANCE_TYPES = {"ADR", "DIAG", "DFD", "WARD", "DMC", "RSCH", "AWRS", "AZRS", "GCRS", "DSCT", "WGAM", "WCLM", "WVCH", "GOVR", "GCSR", "GLND"}


def is_multi_instance(doc_type):
    return doc_type in MULTI_INSTANCE_TYPES


def main():
    parser = argparse.ArgumentParser(
        description="Generate standardized ArcKit document IDs",
        add_help=True,
    )
    parser.add_argument("project_id", help="Project ID (e.g., 001)")
    parser.add_argument("doc_type", help="Document type code (e.g., REQ, ADR)")
    parser.add_argument("version", nargs="?", default="1.0", help="Version (default: 1.0)")
    parser.add_argument("--filename", action="store_true", help="Return ID with .md extension")
    parser.add_argument("--next-num", dest="next_num_dir", metavar="DIR",
                        help="For multi-instance types, scan DIR for next sequence number")
    args = parser.parse_args()

    # Normalize project ID to 3-digit zero-padded
    try:
        pid_clean = int(args.project_id.lstrip("0") or "0")
    except ValueError:
        print(f"Error: Invalid PROJECT_ID: {args.project_id}", file=sys.stderr)
        sys.exit(1)
    padded_pid = f"{pid_clean:03d}"

    doc_type = args.doc_type
    version = args.version

    if is_multi_instance(doc_type):
        if args.next_num_dir:
            next_num_dir = args.next_num_dir
            if os.path.isdir(next_num_dir):
                # Scan directory for existing files to find next sequence number
                pattern_prefix = f"ARC-{padded_pid}-{doc_type}-"
                last_num = 0
                for fname in os.listdir(next_num_dir):
                    if not fname.endswith(".md"):
                        continue
                    m = re.match(
                        rf"ARC-{padded_pid}-{re.escape(doc_type)}-(\d+)-",
                        fname,
                    )
                    if m:
                        num = int(m.group(1))
                        if num > last_num:
                            last_num = num
                next_num = f"{last_num + 1:03d}"
            else:
                # Directory doesn't exist yet, start at 001
                next_num = "001"
            doc_id = f"ARC-{padded_pid}-{doc_type}-{next_num}-v{version}"
        else:
            print(f"Error: Multi-instance type '{doc_type}' requires --next-num DIR option", file=sys.stderr)
            print(f"Usage: {sys.argv[0]} {args.project_id} {doc_type} {version} --next-num ./directory", file=sys.stderr)
            sys.exit(1)
    else:
        # Single-instance document type
        doc_id = f"ARC-{padded_pid}-{doc_type}-v{version}"

    if args.filename:
        doc_id += ".md"

    print(doc_id)


if __name__ == "__main__":
    main()
