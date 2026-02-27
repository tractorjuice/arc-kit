#!/usr/bin/env python3
"""
ArcKit SessionStart Hook

Fires once at session start (and on resume/clear/compact).
Injects ArcKit plugin version into the context window and exports
ARCKIT_VERSION as an environment variable for Bash tool calls.

Hook Type: SessionStart
Input (stdin): JSON with session_id, cwd, etc.
Output (stdout): JSON with additionalContext
"""

import json
import os
import sys
from pathlib import Path


def main():
    try:
        raw = sys.stdin.read()
        if not raw or not raw.strip():
            sys.exit(0)
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(0)

    cwd = data.get("cwd", ".")
    env_file = data.get("env_file", "")

    # Read plugin version
    plugin_root = os.environ.get(
        "CLAUDE_PLUGIN_ROOT",
        str(Path(__file__).resolve().parent.parent),
    )
    version_file = os.path.join(plugin_root, "VERSION")

    if os.path.isfile(version_file):
        arckit_version = Path(version_file).read_text().strip()
    else:
        arckit_version = "unknown"

    # Export ARCKIT_VERSION so Bash tool calls can use it
    if env_file:
        try:
            with open(env_file, "a") as f:
                f.write(f"ARCKIT_VERSION={arckit_version}\n")
        except OSError:
            pass

    # Build context
    context = f"ArcKit Plugin v{arckit_version} is active."

    projects_dir = os.path.join(cwd, "projects")
    if os.path.isdir(projects_dir):
        context += f"\n\nProjects directory: found at {projects_dir}"
    else:
        context += "\n\nNo projects/ directory found. Run /arckit:init to scaffold a new project or /arckit:create to add one."

    # Check for external files newer than latest artifacts
    if os.path.isdir(projects_dir):
        ext_alerts = ""
        for entry in sorted(os.listdir(projects_dir)):
            project_dir = os.path.join(projects_dir, entry)
            if not os.path.isdir(project_dir):
                continue
            external_dir = os.path.join(project_dir, "external")
            if not os.path.isdir(external_dir):
                continue

            project_name = entry

            # Find newest ARC-* artifact mtime across main dir and subdirs
            newest_artifact = 0
            # Main dir
            for f in os.listdir(project_dir):
                fp = os.path.join(project_dir, f)
                if os.path.isfile(fp) and f.startswith("ARC-") and f.endswith(".md"):
                    mtime = os.path.getmtime(fp)
                    if mtime > newest_artifact:
                        newest_artifact = mtime

            # Subdirectories
            for subdir in ("decisions", "diagrams", "wardley-maps", "data-contracts", "reviews"):
                sub_path = os.path.join(project_dir, subdir)
                if os.path.isdir(sub_path):
                    for f in os.listdir(sub_path):
                        fp = os.path.join(sub_path, f)
                        if os.path.isfile(fp) and f.startswith("ARC-") and f.endswith(".md"):
                            mtime = os.path.getmtime(fp)
                            if mtime > newest_artifact:
                                newest_artifact = mtime

            # Compare external files against newest artifact
            new_ext_files = []
            for f in os.listdir(external_dir):
                fp = os.path.join(external_dir, f)
                if not os.path.isfile(fp):
                    continue
                if f == "README.md":
                    continue
                ext_mtime = os.path.getmtime(fp)
                if ext_mtime > newest_artifact:
                    new_ext_files.append(f)

            if new_ext_files:
                ext_alerts += f"\n[{project_name}] {len(new_ext_files)} external file(s) newer than latest artifact:"
                for ef in new_ext_files:
                    ext_alerts += f"\n  - {ef}"
                # Print to stderr so the user sees it in terminal
                print(
                    f"[ArcKit] {project_name}: {len(new_ext_files)} new external file(s) detected",
                    file=sys.stderr,
                )

        if ext_alerts:
            context += f"\n\n## New External Files Detected\n{ext_alerts}\n\nConsider re-running relevant commands to incorporate these files. Run /arckit:health for detailed recommendations."

    # Output additionalContext
    output = {
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": context,
        }
    }
    print(json.dumps(output))


if __name__ == "__main__":
    main()
