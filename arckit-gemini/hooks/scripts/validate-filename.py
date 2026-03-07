#!/usr/bin/env python3
"""
ArcKit BeforeTool Hook for Gemini CLI -- ARC Filename Validation.

Intercepts write_file tool calls targeting ARC-* files under projects/
and auto-corrects filenames to match the ArcKit naming convention
(ARC-{PID}-{TYPE}[-{SEQ}]-v{VER}.md).

Python equivalent of arckit-claude/hooks/validate-arc-filename.mjs.

Corrections applied:
  - Zero-pads project ID to 3 digits (1 -> 001)
  - Normalizes version format (v1 -> v1.0)
  - Corrects project ID to match directory number (ARC-999 in 001-foo/ -> ARC-001)
  - Moves multi-instance types to correct subdirectory (ADR -> decisions/)
  - Assigns next sequence number for multi-instance types missing one
  - Creates subdirectories as needed (mkdir -p equivalent)

Hook Type: BeforeTool
Input (stdin): JSON with tool_name, tool_input, cwd, etc.
Output (stdout): JSON with updatedInput if path changed, or nothing
Exit codes: 0 = allow, 2 = block (invalid type code)
"""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import (
    parse_hook_input, output_json, output_block,
    KNOWN_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP,
)

data = parse_hook_input()
if not data:
    sys.exit(0)

tool_input = data.get("tool_input", {})
file_path = tool_input.get("file_path", "")
if not file_path:
    sys.exit(0)

# Resolve relative paths using cwd
if not file_path.startswith("/"):
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
projects_base = file_path.split("projects/", 1)[0] + "projects"
project_dir = os.path.join(projects_base, project_dir_name)

# Extract project number from directory name
dir_project_num = ""
dir_match = re.match(r"^(\d+)-", project_dir_name)
if dir_match:
    dir_project_num = dir_match.group(1)

# --- Parse ARC filename ---
# Patterns: ARC-001-REQ-v1.0.md, ARC-001-ADR-001-v1.0.md, ARC-001-SECD-MOD-v1.0.md
core = filename[4:]      # Strip "ARC-"
core = core[:-3]         # Strip ".md"

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
    output_block(
        f"ArcKit: Unknown document type code '{doc_type}'. Valid codes: {valid_list}"
    )

# --- Normalize project ID (3-digit zero-padded) ---
if dir_project_num:
    pid_clean = int(dir_project_num.lstrip("0") or "0")
else:
    pid_clean = int(raw_project_id.lstrip("0") or "0")
padded_pid = str(pid_clean).zfill(3)

# --- Normalize version (ensure N.N format) ---
if re.match(r"^\d+$", raw_version):
    norm_version = f"{raw_version}.0"
else:
    norm_version = raw_version

# --- Route to correct directory and filename ---
corrected_path = None
if doc_type in MULTI_INSTANCE_TYPES:
    # Multi-instance types: route to subdirectory with sequence number
    required_subdir = SUBDIR_MAP.get(doc_type, "")
    target_dir = os.path.join(project_dir, required_subdir)

    if not seq_num:
        # Scan directory and assign next available sequence number
        os.makedirs(target_dir, exist_ok=True)
        last_num = 0

        try:
            escaped_type = re.escape(doc_type)
            pattern = re.compile(
                rf"ARC-{padded_pid}-{escaped_type}-(\d+)-"
            )
            for fname in os.listdir(target_dir):
                if not fname.endswith(".md"):
                    continue
                nm = pattern.match(fname)
                if nm:
                    num = int(nm.group(1))
                    if num > last_num:
                        last_num = num
        except OSError:
            pass

        seq_num = str(last_num + 1).zfill(3)
    else:
        # Keep provided sequence number, ensure directory exists
        os.makedirs(target_dir, exist_ok=True)

    corrected_filename = f"ARC-{padded_pid}-{doc_type}-{seq_num}-v{norm_version}.md"
    corrected_path = os.path.join(target_dir, corrected_filename)
elif doc_type in SUBDIR_MAP:
    # Single-instance type with required subdirectory (e.g. RSCH -> research/)
    required_subdir = SUBDIR_MAP[doc_type]
    target_dir = os.path.join(project_dir, required_subdir)
    os.makedirs(target_dir, exist_ok=True)
    corrected_filename = f"ARC-{padded_pid}-{doc_type}-v{norm_version}.md"
    corrected_path = os.path.join(target_dir, corrected_filename)
else:
    # Single-instance type in project root
    corrected_filename = f"ARC-{padded_pid}-{doc_type}-v{norm_version}.md"
    corrected_path = os.path.join(dirpath, corrected_filename)

# --- Compare and output ---
if corrected_path == file_path:
    sys.exit(0)

# Return updatedInput with corrected file_path (preserves original content)
updated_input = dict(tool_input)
updated_input["file_path"] = corrected_path
output_json({"updatedInput": updated_input})
sys.exit(0)
