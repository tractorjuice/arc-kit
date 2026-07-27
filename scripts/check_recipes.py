#!/usr/bin/env python3
"""Validate every arckit-*/recipes/*.yaml file.

Checks:
- parses as YAML
- has the required top-level keys (recipe, schema_version, targets, defaults.version)
- has unique target IDs within the recipe
- every target's `deps:` entries resolve to other target IDs in the same recipe
  (glob patterns like "ADR-*" are accepted if at least one target matches)
- the dependency graph is acyclic (a cycle makes the harness halt at runtime with
  an empty wave, which is a confusing way to learn about it)
- no wave is wider than Claude Code's concurrent-subagent cap

That last check exists because the cap DENIES rather than queues. Verified
against the Claude Code v2.1.220 binary: exceeding it throws "Concurrent
subagent limit reached ... Do not retry" per excess spawn, surfaced to the model
as a tool error. `/arckit:build` dispatches one subagent per target per wave and
is halt-on-fail, so a wave wider than the cap does not run slower -- it fails.

Exits non-zero if any check fails. Prints a one-line summary on success.
"""
import sys
import glob
import fnmatch

# Claude Code's default CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS (v2.1.217+).
CONCURRENCY_CAP = 20
# Warn when a recipe gets within this many agents of the cap.
HEADROOM_WARN = 4

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

REQUIRED_TOP_KEYS = {"recipe", "schema_version", "targets", "defaults"}

errors = []
warnings = []
recipes_checked = 0
widest_seen = 0


def compute_waves(targets, target_id_set):
    """Topological waves, mirroring the algorithm in the arckit-build SKILL.md.

    Returns (waves, unresolved). `unresolved` is non-empty only when a cycle or
    an unsatisfiable dependency leaves targets that can never enter a wave.
    """
    deps = {}
    for t in targets:
        resolved = set()
        for dep in t.get("deps") or []:
            if "*" in dep:
                resolved |= {tid for tid in target_id_set if fnmatch.fnmatch(tid, dep)}
            elif dep in target_id_set:
                resolved.add(dep)
        deps[t["id"]] = resolved - {t["id"]}

    pending, done, waves = set(target_id_set), set(), []
    while pending:
        wave = sorted(tid for tid in pending if deps[tid] <= done)
        if not wave:
            return waves, sorted(pending)
        waves.append(wave)
        pending -= set(wave)
        done |= set(wave)
    return waves, []

paths = sorted(
    glob.glob("plugins/arckit-*/recipes/*.yaml")
    + glob.glob("plugins/arckit-claude/skills/arckit-build/recipes/*.yaml")
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

    # Wave analysis uses the MAXIMAL target set -- every optional target enabled --
    # because that is the widest build a user can request with --enable.
    valid_targets = [t for t in targets if isinstance(t, dict) and "id" in t]
    if valid_targets:
        waves, unresolved = compute_waves(valid_targets, target_id_set)
        if unresolved:
            errors.append(
                f"{path}: dependency cycle or unsatisfiable deps -- these targets can "
                f"never run: {', '.join(unresolved)}"
            )
        if waves:
            widest = max(len(w) for w in waves)
            widest_seen = max(widest_seen, widest)
            if widest > CONCURRENCY_CAP:
                offending = next(w for w in waves if len(w) == widest)
                errors.append(
                    f"{path}: wave of {widest} targets exceeds the concurrent-subagent "
                    f"cap of {CONCURRENCY_CAP}; excess spawns are DENIED, not queued, and "
                    f"arckit-build is halt-on-fail, so this wave fails at runtime. "
                    f"Split it by adding deps. Wave: {', '.join(offending)}"
                )
            elif widest > CONCURRENCY_CAP - HEADROOM_WARN:
                warnings.append(
                    f"{path}: widest wave is {widest}, within {CONCURRENCY_CAP - widest} "
                    f"of the concurrent-subagent cap ({CONCURRENCY_CAP})"
                )

    recipes_checked += 1

if errors:
    print(f"FAIL: {len(errors)} error(s) across {recipes_checked} recipe(s):", file=sys.stderr)
    for e in errors:
        print(f"  {e}", file=sys.stderr)
    sys.exit(1)

for w in warnings:
    print(f"WARN: {w}")

print(
    f"OK: {recipes_checked} recipe(s) validated "
    f"(widest wave {widest_seen}/{CONCURRENCY_CAP})"
)
