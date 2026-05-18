#!/usr/bin/env python3
"""Validate every arckit-*/recipes/*.yaml file.

Checks:
- parses as YAML
- has the required top-level keys (recipe, schema_version, targets, defaults.version)
- has unique target IDs within the recipe
- every target's `deps:` entries resolve to other target IDs in the same recipe
  (glob patterns like "ADR-*" are accepted if at least one target matches)

Exits non-zero if any check fails. Prints a one-line summary on success.
"""
import sys
import glob
import fnmatch

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

REQUIRED_TOP_KEYS = {"recipe", "schema_version", "targets", "defaults"}

errors = []
recipes_checked = 0

paths = sorted(
    glob.glob("arckit-*/recipes/*.yaml")
    + glob.glob("arckit-claude/skills/arckit-build/recipes/*.yaml")
)

for path in paths:
    try:
        with open(path) as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        errors.append(f"{path}: YAML parse error: {e}")
        continue

    if not isinstance(data, dict):
        errors.append(f"{path}: top-level must be a mapping")
        continue

    missing = REQUIRED_TOP_KEYS - set(data.keys())
    if missing:
        errors.append(f"{path}: missing required keys: {sorted(missing)}")
        continue

    if "version" not in data.get("defaults", {}):
        errors.append(f"{path}: defaults.version is required")

    targets = data.get("targets", [])
    if not isinstance(targets, list):
        errors.append(f"{path}: targets must be a list")
        continue

    target_ids = []
    for t in targets:
        if not isinstance(t, dict) or "id" not in t:
            errors.append(f"{path}: target missing id field: {t!r}")
            continue
        target_ids.append(t["id"])

    seen = set()
    for tid in target_ids:
        if tid in seen:
            errors.append(f"{path}: duplicate target id: {tid}")
        seen.add(tid)

    target_id_set = set(target_ids)
    for t in targets:
        if not isinstance(t, dict):
            continue
        for dep in t.get("deps") or []:
            if "*" in dep:
                if not any(fnmatch.fnmatch(tid, dep) for tid in target_id_set):
                    errors.append(
                        f"{path}: target {t.get('id')}: glob dep {dep!r} matches no target"
                    )
            elif dep not in target_id_set:
                errors.append(
                    f"{path}: target {t.get('id')}: dep {dep!r} not a target in this recipe"
                )

    recipes_checked += 1

if errors:
    print(f"FAIL: {len(errors)} error(s) across {recipes_checked} recipe(s):", file=sys.stderr)
    for e in errors:
        print(f"  {e}", file=sys.stderr)
    sys.exit(1)

print(f"OK: {recipes_checked} recipe(s) validated")
