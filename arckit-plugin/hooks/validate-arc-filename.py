#!/usr/bin/env python3
"""
ArcKit PreToolUse (Write) Hook - ARC Filename Convention Enforcement

Intercepts Write tool calls targeting ARC-* files under projects/ and auto-corrects
filenames to match the ArcKit naming convention (ARC-{PID}-{TYPE}[-{SEQ}]-v{VER}.md).

Corrections applied:
  - Zero-pads project ID to 3 digits (1 -> 001)
  - Normalizes version format (v1 -> v1.0)
  - Corrects project ID to match directory number (ARC-999 in 001-foo/ -> ARC-001)
  - Moves multi-instance types to correct subdirectory (ADR -> decisions/)
  - Assigns next sequence number for multi-instance types missing one
  - Creates subdirectories as needed (mkdir -p)

Hook Type: PreToolUse
Matcher: Write
Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
Output (stdout): JSON with updatedInput for corrected path, or empty for pass-through
Exit codes:      0 = allow (with or without corrections), 2 = block (invalid type code)
"""

import json
import os
import re
import sys
from pathlib import Path

# All valid ArcKit document type codes (~47)
KNOWN_TYPES = {
    "PRIN", "STKE", "REQ", "RISK", "SOBC", "PLAN", "ROAD", "STRAT", "BKLG", "STORY",
    "HLDR", "DLDR", "DATA", "WARD", "DIAG", "DFD", "ADR", "TRAC", "TCOP",
    "SECD", "SECD-MOD", "AIPB", "ATRS", "DPIA", "JSP936", "SVCASS", "SNOW",
    "DEVOPS", "MLOPS", "FINOPS", "OPS", "PLAT", "SOW", "EVAL", "DOS", "GCLD", "GCLC",
    "DMC", "RSCH", "AWRS", "AZRS", "GCRS", "DSCT", "ANAL", "GAPS", "PRIN-COMP", "VEND", "CONF",
}

# Multi-instance types that require sequence numbers
MULTI_INSTANCE_TYPES = {"ADR", "DIAG", "DFD", "WARD", "DMC"}

# Multi-instance type -> required subdirectory
SUBDIR_MAP = {
    "ADR": "decisions",
    "DIAG": "diagrams",
    "DFD": "diagrams",
    "WARD": "wardley-maps",
    "DMC": "data-contracts",
}


def main():
    try:
        raw = sys.stdin.read()
        if not raw or not raw.strip():
            sys.exit(0)
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        sys.exit(0)

    # Resolve relative paths using cwd
    if not os.path.isabs(file_path):
        cwd = data.get("cwd", "")
        if cwd:
            file_path = os.path.join(cwd, file_path)

    filename = os.path.basename(file_path)
    dirpath = os.path.dirname(file_path)

    # Early exit: only process ARC-*.md files under a projects/ directory
    if "/projects/" not in file_path:
        sys.exit(0)
    if not filename.startswith("ARC-"):
        sys.exit(0)
    if not filename.endswith(".md"):
        sys.exit(0)

    # --- Extract project directory info ---
    # Path format: .../projects/{NNN-name}/[subdir/]ARC-*.md
    after_projects = file_path.split("projects/", 1)[1]
    project_dir_name = after_projects.split("/")[0]
    projects_base = file_path.split("projects/")[0] + "projects"
    project_dir = os.path.join(projects_base, project_dir_name)

    # Extract project number from directory name
    dir_project_num = ""
    m = re.match(r"^(\d+)-", project_dir_name)
    if m:
        dir_project_num = m.group(1)

    # --- Parse ARC filename ---
    # Patterns: ARC-001-REQ-v1.0.md, ARC-001-ADR-001-v1.0.md, ARC-001-SECD-MOD-v1.0.md
    core = filename[4:]  # Strip "ARC-"
    core = core[:-3]     # Strip ".md"

    # Extract version: match last -vN.N or -vN
    vm = re.match(r"^(.+)-v(\d+\.?\d*)$", core)
    if not vm:
        # Can't parse version - not a standard ARC filename, pass through
        sys.exit(0)
    pre_version = vm.group(1)
    raw_version = vm.group(2)

    # Extract project ID (first numeric segment)
    pm = re.match(r"^(\d+)-(.+)$", pre_version)
    if not pm:
        sys.exit(0)
    raw_project_id = pm.group(1)
    type_and_seq = pm.group(2)

    # --- Determine doc type code and optional sequence number ---
    doc_type = ""
    seq_num = ""

    tm = re.match(r"^(.+)-(\d{3})$", type_and_seq)
    if tm:
        potential_type = tm.group(1)
        potential_seq = tm.group(2)
        if potential_type in MULTI_INSTANCE_TYPES:
            doc_type = potential_type
            seq_num = potential_seq
        else:
            doc_type = type_and_seq
    else:
        doc_type = type_and_seq

    # --- Validate doc type code ---
    if doc_type not in KNOWN_TYPES:
        valid_list = " ".join(sorted(KNOWN_TYPES))
        print(
            f"ArcKit: Unknown document type code '{doc_type}'. Valid codes: {valid_list}",
            file=sys.stderr,
        )
        sys.exit(2)

    # --- Normalize project ID (3-digit zero-padded) ---
    if dir_project_num:
        pid_clean = int(dir_project_num.lstrip("0") or "0")
    else:
        pid_clean = int(raw_project_id.lstrip("0") or "0")
    padded_pid = f"{pid_clean:03d}"

    # --- Normalize version (ensure N.N format) ---
    if re.match(r"^\d+$", raw_version):
        norm_version = f"{raw_version}.0"
    else:
        norm_version = raw_version

    # --- Handle multi-instance types (ADR, DIAG, DFD, WARD, DMC) ---
    if doc_type in MULTI_INSTANCE_TYPES:
        required_subdir = SUBDIR_MAP[doc_type]
        target_dir = os.path.join(project_dir, required_subdir)

        if not seq_num:
            # Claude omitted sequence number - scan directory and assign next available
            os.makedirs(target_dir, exist_ok=True)
            last_num = 0
            pattern_prefix = f"ARC-{padded_pid}-{doc_type}-"

            if os.path.isdir(target_dir):
                for fname in os.listdir(target_dir):
                    if not fname.endswith(".md"):
                        continue
                    nm = re.match(
                        rf"ARC-{padded_pid}-{re.escape(doc_type)}-(\d+)-",
                        fname,
                    )
                    if nm:
                        num = int(nm.group(1))
                        if num > last_num:
                            last_num = num

            seq_num = f"{last_num + 1:03d}"
        else:
            # Claude provided a sequence number - keep it, ensure directory exists
            os.makedirs(target_dir, exist_ok=True)

        corrected_filename = f"ARC-{padded_pid}-{doc_type}-{seq_num}-v{norm_version}.md"
        corrected_path = os.path.join(target_dir, corrected_filename)
    else:
        # Single-instance type - keep directory as Claude specified, only correct filename
        corrected_filename = f"ARC-{padded_pid}-{doc_type}-v{norm_version}.md"
        corrected_path = os.path.join(dirpath, corrected_filename)

    # --- Compare and output ---
    if corrected_path == file_path:
        sys.exit(0)

    # Return updatedInput with corrected file_path (preserves original content)
    tool_input = dict(data.get("tool_input", {}))
    tool_input["file_path"] = corrected_path
    print(json.dumps({"updatedInput": tool_input}))
    sys.exit(0)


if __name__ == "__main__":
    main()
