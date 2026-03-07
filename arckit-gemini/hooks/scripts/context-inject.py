#!/usr/bin/env python3
"""
ArcKit BeforeAgent Hook for Gemini CLI -- Context Injection.

Pre-computes project context when any /arckit: command is run.
Injects project inventory, artifact lists, and external documents
via additionalContext so commands don't need to discover this themselves.

Python equivalent of arckit-claude/hooks/arckit-context.mjs.

Hook Type: BeforeAgent
Input (stdin): JSON with prompt, cwd, etc.
Output (stdout): JSON with additionalContext containing project context
"""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import (
    parse_hook_input, is_dir, is_file, read_text,
    list_dir, mtime_ms, find_repo_root, extract_doc_type,
    doc_type_name, output_context, SUBDIR_MAP, ARTIFACT_SUBDIRS,
)

data = parse_hook_input()
user_prompt = data.get("prompt", "")

# Only run for /arckit: commands
if not user_prompt.startswith("/arckit:"):
    sys.exit(0)

# Commands that don't need project context
cmd_match = re.match(r"^/arckit:([a-z_-]*)", user_prompt)
if cmd_match:
    command = cmd_match.group(1)
    if command in ("pages", "customize", "create", "init", "list", "trello"):
        sys.exit(0)

# Find repo root
cwd = data.get("cwd", os.getcwd())
repo_root = find_repo_root(cwd)
if not repo_root:
    sys.exit(0)

projects_dir = os.path.join(repo_root, "projects")
if not is_dir(projects_dir):
    sys.exit(0)

# Read ArcKit version from extension VERSION file
script_dir = os.path.dirname(os.path.abspath(__file__))
extension_root = os.path.normpath(os.path.join(script_dir, "..", ".."))
arckit_version = read_text(os.path.join(extension_root, "VERSION"))
arckit_version = arckit_version.strip() if arckit_version else "unknown"

# Build context string
lines = []
lines.append("## ArcKit Project Context (auto-detected by hook)\n")
lines.append(f"Repository: {repo_root}")
lines.append(f"ArcKit Version: {arckit_version}\n")

# Count projects
project_entries = [
    e for e in list_dir(projects_dir)
    if is_dir(os.path.join(projects_dir, e))
]
lines.append(f"**{len(project_entries)} project(s) found:**\n")

# Scan each project
for project_name in project_entries:
    project_dir = os.path.join(projects_dir, project_name)

    # Extract project number
    project_number = ""
    pm = re.match(r"^(\d{3})-", project_name)
    if pm:
        project_number = pm.group(1)

    lines.append(f"### {project_name}")
    lines.append(f"- **Path**: {project_dir}")
    if project_number:
        lines.append(f"- **Project ID**: {project_number}")

    # Scan for ARC-* artifacts in main project dir
    artifact_list = []
    artifact_count = 0
    newest_artifact_mtime = 0

    for f in list_dir(project_dir):
        fp = os.path.join(project_dir, f)
        if is_file(fp) and f.startswith("ARC-") and f.endswith(".md"):
            dtype = extract_doc_type(f) or f
            dname = doc_type_name(dtype)
            artifact_list.append(f"  - `{f}` ({dname})")
            artifact_count += 1
            amtime = mtime_ms(fp)
            if amtime > newest_artifact_mtime:
                newest_artifact_mtime = amtime

    # Also scan subdirectories
    for subdir in ARTIFACT_SUBDIRS:
        sub_path = os.path.join(project_dir, subdir)
        if is_dir(sub_path):
            for f in list_dir(sub_path):
                fp = os.path.join(sub_path, f)
                if is_file(fp) and f.startswith("ARC-") and f.endswith(".md"):
                    dtype = extract_doc_type(f) or f
                    dname = doc_type_name(dtype)
                    artifact_list.append(f"  - `{subdir}/{f}` ({dname})")
                    artifact_count += 1
                    amtime = mtime_ms(fp)
                    if amtime > newest_artifact_mtime:
                        newest_artifact_mtime = amtime

    if artifact_count > 0:
        lines.append(f"- **Artifacts** ({artifact_count}):")
        lines.extend(artifact_list)
    else:
        lines.append("- **Artifacts**: none")

    # Check for vendor directories and profiles
    vendors_dir = os.path.join(project_dir, "vendors")
    if is_dir(vendors_dir):
        vendor_dirs = []
        vendor_profiles = []
        for vname in list_dir(vendors_dir):
            vpath = os.path.join(vendors_dir, vname)
            if is_dir(vpath):
                vendor_dirs.append(f"  - {vname}")
            elif is_file(vpath) and vname.endswith("-profile.md"):
                vendor_profiles.append(f"  - {vname}")
        if vendor_dirs or vendor_profiles:
            lines.append(f"- **Vendors** ({len(vendor_dirs) + len(vendor_profiles)}):")
            lines.extend(vendor_profiles)
            lines.extend(vendor_dirs)

    # Check for tech notes
    tech_notes_dir = os.path.join(project_dir, "tech-notes")
    if is_dir(tech_notes_dir):
        note_list = []
        for f in list_dir(tech_notes_dir):
            if is_file(os.path.join(tech_notes_dir, f)) and f.endswith(".md"):
                note_list.append(f"  - {f}")
        if note_list:
            lines.append(f"- **Tech Notes** ({len(note_list)}):")
            lines.extend(note_list)

    # Check for external documents
    external_dir = os.path.join(project_dir, "external")
    if is_dir(external_dir):
        ext_list = []
        for f in list_dir(external_dir):
            fp = os.path.join(external_dir, f)
            if not is_file(fp):
                continue
            if f == "README.md":
                continue
            ext_mtime = mtime_ms(fp)
            if ext_mtime > newest_artifact_mtime:
                ext_list.append(f"  - `{f}` (**NEW** -- newer than latest artifact)")
            else:
                ext_list.append(f"  - `{f}`")
        if ext_list:
            lines.append(f"- **External documents** ({len(ext_list)}) in `external/`:")
            lines.extend(ext_list)

    lines.append("")  # blank line between projects

# Check for global policies
policies_dir = os.path.join(projects_dir, "000-global", "policies")
if is_dir(policies_dir):
    policy_list = []
    for f in list_dir(policies_dir):
        fp = os.path.join(policies_dir, f)
        if is_file(fp):
            policy_list.append(f"  - `{f}`")
    if policy_list:
        lines.append("### Global Policies (000-global/policies/)")
        lines.extend(policy_list)
        lines.append("")

context_text = "\n".join(lines)
output_context(context_text)
