#!/usr/bin/env python3
"""
ArcKit AfterTool Hook for Gemini CLI -- Auto-update docs/manifest.json.

Fires after any write_file tool call. If the written file is an ARC-*.md
under projects/, the hook incrementally updates docs/manifest.json so it
stays current without requiring a full /arckit:pages re-run.

Python equivalent of arckit-claude/hooks/update-manifest.mjs.

Hook Type: AfterTool
Input (stdin): JSON with tool_name, tool_input (file_path, content), cwd
Output (stdout): none (AfterTool hooks are silent)
Exit codes: 0 always
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import (
    parse_hook_input, is_file, find_repo_root,
    DOC_TYPES, SUBDIR_MAP, SUBDIR_TO_KEY, COMPOUND_TYPES, ARC_PATTERN,
)


def extract_doc_type(filename):
    """Extract document type code from ARC filename."""
    m = re.match(r"^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$", filename)
    if not m:
        return None
    rest = m.group(1)

    # Try compound types first (longest match)
    for code in COMPOUND_TYPES:
        if rest.startswith(code):
            return code

    # Strip trailing -NNN for multi-instance types
    rest = re.sub(r"-\d{3}$", "", rest)
    return rest


def extract_doc_id(filename):
    """Extract document ID (filename without .md)."""
    return filename.rsplit(".md", 1)[0] if filename.endswith(".md") else filename


def base_id(document_id):
    """Strip version to get base ID for dedup: ARC-001-REQ-v1.0 -> ARC-001-REQ."""
    return re.sub(r"-v\d+(\.\d+)?$", "", document_id)


def extract_first_heading(content):
    """Extract first # heading from markdown content."""
    if not content:
        return None
    for line in content.split("\n", 20)[:20]:
        m = re.match(r"^#\s+(.+)", line)
        if m:
            return m.group(1).strip()
    return None


# --- Main ---
data = parse_hook_input()
if not data:
    sys.exit(0)

file_path = data.get("tool_input", {}).get("file_path", "")
file_content = data.get("tool_input", {}).get("content", "")
cwd = data.get("cwd", os.getcwd())

# Guard: must be an ARC file under projects/
if "/projects/" not in file_path:
    sys.exit(0)

filename = os.path.basename(file_path)
if not ARC_PATTERN.match(filename):
    sys.exit(0)

# Guard: repo must have docs/manifest.json
repo_root = find_repo_root(cwd)
if not repo_root:
    sys.exit(0)

manifest_path = os.path.join(repo_root, "docs", "manifest.json")
if not is_file(manifest_path):
    sys.exit(0)

# Parse manifest
try:
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
except (OSError, json.JSONDecodeError):
    sys.exit(0)

# Extract file metadata
doc_type = extract_doc_type(filename)
meta = DOC_TYPES.get(doc_type, {"category": "Other", "name": doc_type or "Unknown"})
document_id = extract_doc_id(filename)
new_base_id = base_id(document_id)

# Determine project dir and subdirectory from path
# Path: .../projects/{NNN-name}/[subdir/]ARC-*.md
after_projects = file_path.split("/projects/", 1)[1]
parts = after_projects.split("/")
project_dir_name = parts[0]  # "001-foo" or "000-global"

# Determine if file is in a subdirectory
subdir_name = None
if len(parts) == 3:
    # projects/001-foo/decisions/ARC-*.md
    subdir_name = parts[1]

# Build the relative path for manifest
rel_path = f"projects/{after_projects}"

# Determine title: for multi-instance types in subdirs, use first heading
title = meta["name"]
if subdir_name and file_content:
    heading = extract_first_heading(file_content)
    if heading:
        title = heading

# Build the new entry
new_entry = {"path": rel_path, "title": title, "documentId": document_id}

# Handle 000-global
if project_dir_name == "000-global":
    new_entry["category"] = meta["category"]

    if not isinstance(manifest.get("global"), list):
        manifest["global"] = []

    # Dedup: remove any existing entry with same base ID
    manifest["global"] = [
        e for e in manifest["global"]
        if base_id(e.get("documentId", "")) != new_base_id
    ]
    manifest["global"].append(new_entry)

    # Update defaultDocument if this is a PRIN doc
    if doc_type == "PRIN":
        for d in manifest["global"]:
            if d.get("documentId") and "PRIN" in d["documentId"]:
                d["isDefault"] = True
                manifest["defaultDocument"] = d["path"]
                break

    # Update timestamp and write
    from datetime import datetime, timezone
    manifest["generated"] = datetime.now(timezone.utc).isoformat()
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    sys.exit(0)

# Handle numbered project
if not isinstance(manifest.get("projects"), list):
    manifest["projects"] = []

# Find existing project or create new one
project = None
for p in manifest["projects"]:
    if p.get("id") == project_dir_name:
        project = p
        break

if project is None:
    # Derive display name: "001-fuel-prices" -> "Fuel Prices"
    display_name = re.sub(r"^\d{3}-", "", project_dir_name)
    display_name = " ".join(
        word.capitalize() for word in display_name.split("-")
    )
    project = {
        "id": project_dir_name,
        "name": display_name,
        "documents": [],
    }
    manifest["projects"].append(project)

# Determine target array key
target_key = "documents"
if subdir_name and subdir_name in SUBDIR_TO_KEY:
    target_key = SUBDIR_TO_KEY[subdir_name]

# Ensure target array exists
if not isinstance(project.get(target_key), list):
    project[target_key] = []

# For root documents, include category
if target_key == "documents":
    new_entry["category"] = meta["category"]

# Dedup: remove any existing entry with same base ID
project[target_key] = [
    e for e in project[target_key]
    if base_id(e.get("documentId", "")) != new_base_id
]
project[target_key].append(new_entry)

# Update timestamp and write
from datetime import datetime, timezone
manifest["generated"] = datetime.now(timezone.utc).isoformat()
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)
sys.exit(0)
