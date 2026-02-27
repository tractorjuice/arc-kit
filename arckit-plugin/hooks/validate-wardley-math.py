#!/usr/bin/env python3
"""
ArcKit Wardley Map Math Validation

Validates a generated Wardley Map document for consistency:
  1. Stage-evolution alignment (Component Inventory tables)
  2. Coordinate range validation (all values in [0.00, 1.00])
  3. OWM syntax consistency (wardley code block vs Component Inventory)

Input (stdin):  JSON { stop_hook_active, ... }
Output (stdout): JSON with "decision": "block" and "reason" on failure, or empty on success
Exit codes:      0 always (block via JSON decision, not exit code)
"""

import json
import os
import re
import sys
import time
from pathlib import Path


def evolution_to_stage(evo):
    """Classify evolution value into expected stage."""
    evo = float(evo)
    if evo < 0.25:
        return "Genesis"
    elif evo < 0.50:
        return "Custom"
    elif evo < 0.75:
        return "Product"
    else:
        return "Commodity"


def main():
    try:
        raw = sys.stdin.read()
        if not raw or not raw.strip():
            sys.exit(0)
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(0)

    # If this is already a re-fire after a block, allow stop to prevent infinite loops
    if data.get("stop_hook_active", False):
        sys.exit(0)

    # --- Find most recently modified WARD file ---
    ward_file = None
    newest_mtime = 0
    now = time.time()
    max_age = 300  # 5 minutes

    # Walk projects/*/wardley-maps/ looking for ARC-*-WARD-*.md
    projects_dir = Path("projects")
    if projects_dir.is_dir():
        for project_dir in sorted(projects_dir.iterdir()):
            wm_dir = project_dir / "wardley-maps"
            if not wm_dir.is_dir():
                continue
            for f in wm_dir.iterdir():
                if not f.is_file():
                    continue
                if not f.name.startswith("ARC-") or "-WARD-" not in f.name or not f.name.endswith(".md"):
                    continue
                mtime = f.stat().st_mtime
                age = now - mtime
                if age <= max_age and mtime > newest_mtime:
                    newest_mtime = mtime
                    ward_file = f

    # No recent wardley file found - not a wardley run, allow stop
    if ward_file is None:
        sys.exit(0)

    filename = ward_file.name
    content = ward_file.read_text(encoding="utf-8", errors="replace")
    lines = content.splitlines()

    errors = []
    stage_errors = []
    owm_errors = []

    # Regex for table rows: | Component | 0.XX | 0.XX | Stage | ... |
    table_row_re = re.compile(
        r"^\|\s*([^|]+?)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(Genesis|Custom|Product|Commodity)\s*\|"
    )

    # --- Check 1 & 2: Stage-evolution alignment and coordinate range ---
    table_vis = {}
    table_evo = {}

    for line in lines:
        m = table_row_re.match(line)
        if not m:
            continue
        comp = m.group(1).strip()
        vis = m.group(2)
        evo = m.group(3)
        stage = m.group(4)

        # Skip template placeholder rows
        if "{" in comp or comp == "Component":
            continue

        # Check stage-evolution alignment
        expected = evolution_to_stage(evo)
        if stage != expected:
            stage_errors.append(
                f"- '{comp}' has evolution {evo} but Stage is '{stage}' (expected '{expected}')"
            )

        # Check coordinate range
        vis_f = float(vis)
        evo_f = float(evo)
        if vis_f < 0.0 or vis_f > 1.0:
            errors.append(f"- '{comp}' has visibility {vis} outside valid range [0.00, 1.00]")
        if evo_f < 0.0 or evo_f > 1.0:
            errors.append(f"- '{comp}' has evolution {evo} outside valid range [0.00, 1.00]")

        # Store for cross-reference
        table_vis[comp] = vis
        table_evo[comp] = evo

    # --- Check 3: OWM syntax consistency ---
    owm_vis = {}
    owm_evo = {}
    in_wardley = False
    component_re = re.compile(r"^\s*component\s+(.+?)\s+\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]")

    for line in lines:
        if re.match(r"^\s*```wardley", line):
            in_wardley = True
            continue
        if in_wardley and re.match(r"^\s*```", line):
            in_wardley = False
            continue
        if in_wardley:
            cm = component_re.match(line)
            if cm:
                comp_name = cm.group(1).strip()
                owm_v = cm.group(2)
                owm_e = cm.group(3)
                owm_vis[comp_name] = owm_v
                owm_evo[comp_name] = owm_e

    # Cross-reference OWM coordinates vs table coordinates
    for comp_name in owm_vis:
        if comp_name in table_vis:
            t_vis = table_vis[comp_name]
            t_evo = table_evo[comp_name]
            o_vis = owm_vis[comp_name]
            o_evo = owm_evo[comp_name]

            if o_vis != t_vis or o_evo != t_evo:
                owm_errors.append(
                    f"- '{comp_name}' is [{o_vis}, {o_evo}] in OWM but [{t_vis}, {t_evo}] in Component Inventory"
                )

    # --- Build error report ---
    report_parts = []

    if stage_errors:
        report_parts.append("**Stage-Evolution Mismatches:**\n" + "\n".join(stage_errors))

    if errors:
        report_parts.append("**Coordinate Range Errors:**\n" + "\n".join(errors))

    if owm_errors:
        report_parts.append("**OWM Coordinate Mismatches:**\n" + "\n".join(owm_errors))

    if report_parts:
        report = "\n\n".join(report_parts)
        reason = f"Wardley Map validation errors in {filename}:\n\n{report}\n\nFix these errors in the document, then stop again."
        print(json.dumps({"decision": "block", "reason": reason}))

    sys.exit(0)


if __name__ == "__main__":
    main()
