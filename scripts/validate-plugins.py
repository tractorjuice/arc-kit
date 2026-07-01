#!/usr/bin/env python3
"""Validate all plugin.json manifests before conversion."""

import json
import sys
from pathlib import Path


def validate_manifest(path: Path) -> list[str]:
    errors: list[str] = []
    with path.open() as f:
        data = json.load(f)

    uc = data.get("userConfig")
    if not uc:
        return errors

    for key, val in uc.items():
        if not isinstance(val, dict):
            errors.append(f"{path}: userConfig.{key} must be an object")
            continue
        if "title" not in val:
            errors.append(f"{path}: userConfig.{key}.title is required (missing)")
        elif not isinstance(val["title"], str):
            errors.append(f"{path}: userConfig.{key}.title must be a string")
    return errors


def main():
    base = Path(__file__).resolve().parent.parent / "plugins"
    all_errors: list[str] = []

    for manifest in base.rglob("*/.claude-plugin/plugin.json"):
        all_errors.extend(validate_manifest(manifest))

    if all_errors:
        print("Validation FAILED:")
        for err in all_errors:
            print(f"  {err}")
        sys.exit(1)
    print("All plugin manifests valid.")
    sys.exit(0)


if __name__ == "__main__":
    main()
