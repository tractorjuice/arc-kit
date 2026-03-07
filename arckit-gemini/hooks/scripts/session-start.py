#!/usr/bin/env python3
"""
ArcKit SessionStart Hook for Gemini CLI.

Fires once at session start. Injects ArcKit extension version and
project status into the context window.

Python equivalent of arckit-claude/hooks/arckit-session.mjs.

Hook Type: SessionStart
Input (stdin): JSON with cwd, etc.
Output (stdout): JSON with additionalContext
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import (
    parse_hook_input, is_dir, is_file, read_text,
    list_dir, mtime_ms, output_context,
)

data = parse_hook_input()
cwd = data.get("cwd", ".")

# Read extension version
script_dir = os.path.dirname(os.path.abspath(__file__))
extension_root = os.environ.get(
    "extensionPath",
    os.path.normpath(os.path.join(script_dir, "..", "..")),
)
version_file = os.path.join(extension_root, "VERSION")
arckit_version = "unknown"
if is_file(version_file):
    content = read_text(version_file)
    if content:
        arckit_version = content.strip()

# Build context
context = f"ArcKit Extension v{arckit_version} is active."

projects_dir = os.path.join(cwd, "projects")
if is_dir(projects_dir):
    context += f"\n\nProjects directory: found at {projects_dir}"
else:
    context += (
        "\n\nNo projects/ directory found. "
        "Run /arckit:init to scaffold a new project or /arckit:create to add one."
    )

# Check for external files newer than latest artifacts
if is_dir(projects_dir):
    ext_alerts = ""
    entries = list_dir(projects_dir)

    for entry in entries:
        project_dir = os.path.join(projects_dir, entry)
        if not is_dir(project_dir):
            continue
        external_dir = os.path.join(project_dir, "external")
        if not is_dir(external_dir):
            continue

        # Find newest ARC-* artifact mtime across main dir and subdirs
        newest_artifact = 0

        # Main dir
        for f in list_dir(project_dir):
            fp = os.path.join(project_dir, f)
            if is_file(fp) and f.startswith("ARC-") and f.endswith(".md"):
                mt = mtime_ms(fp)
                if mt > newest_artifact:
                    newest_artifact = mt

        # Subdirectories
        for subdir in ["decisions", "diagrams", "wardley-maps", "data-contracts", "reviews"]:
            sub_path = os.path.join(project_dir, subdir)
            if is_dir(sub_path):
                for f in list_dir(sub_path):
                    fp = os.path.join(sub_path, f)
                    if is_file(fp) and f.startswith("ARC-") and f.endswith(".md"):
                        mt = mtime_ms(fp)
                        if mt > newest_artifact:
                            newest_artifact = mt

        # Compare external files against newest artifact
        new_ext_files = []
        for f in list_dir(external_dir):
            fp = os.path.join(external_dir, f)
            if not is_file(fp):
                continue
            if f == "README.md":
                continue
            ext_mtime = mtime_ms(fp)
            if ext_mtime > newest_artifact:
                new_ext_files.append(f)

        if new_ext_files:
            ext_alerts += (
                f"\n[{entry}] {len(new_ext_files)} external file(s) "
                f"newer than latest artifact:"
            )
            for ef in new_ext_files:
                ext_alerts += f"\n  - {ef}"
            sys.stderr.write(
                f"[ArcKit] {entry}: {len(new_ext_files)} new external file(s) detected\n"
            )

    if ext_alerts:
        context += (
            f"\n\n## New External Files Detected\n{ext_alerts}\n\n"
            "Consider re-running relevant commands to incorporate these files. "
            "Run /arckit:health for detailed recommendations."
        )

output_context(context)
