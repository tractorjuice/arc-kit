"""
Recipe Parser + DAG Computation

Handles loading recipe YAML files, validating schema, resolving optional
targets, computing dependency DAGs, and performing topological sort into
waves for parallel execution.
"""

import re
from dataclasses import dataclass, field
from fnmatch import fnmatch
from pathlib import Path
from typing import Optional

import yaml


@dataclass
class Target:
    """A single build target within a recipe."""

    id: str
    skill: str
    args: str
    output: dict
    deps: list[str]
    optional_deps: list[str] = field(default_factory=list)
    is_optional: bool = False


@dataclass
class Wave:
    """A wave of targets that can be executed in parallel."""

    number: int
    targets: list[Target]


@dataclass
class Recipe:
    """A parsed recipe definition."""

    name: str
    schema_version: int
    description: str
    defaults: dict
    optional_targets: dict
    post_build_hooks: list[dict]
    targets: list[Target]


def load_recipe(path: str) -> Recipe:
    """Load a recipe from a YAML file and parse it into a Recipe object.

    Args:
        path: Path to the recipe YAML file.

    Returns:
        Parsed Recipe object.

    Raises:
        FileNotFoundError: If the recipe file does not exist.
        yaml.YAMLError: If the YAML is malformed.
        ValueError: If required fields are missing.
    """
    recipe_path = Path(path)
    if not recipe_path.is_file():
        raise FileNotFoundError(f"Recipe file not found: {path}")

    raw = yaml.safe_load(recipe_path.read_text(encoding="utf-8"))

    # Validate required top-level keys
    errors = _validate_raw(raw)
    if errors:
        raise ValueError(f"Recipe validation failed:\n" + "\n".join(f"  - {e}" for e in errors))

    # Parse optional_targets
    optional_targets: dict = raw.get("optional_targets") or {}

    # Parse targets
    targets: list[Target] = []
    for t in raw.get("targets", []):
        target = Target(
            id=t["id"],
            skill=t["skill"],
            args=t.get("args", ""),
            output=t.get("output", {}),
            deps=list(t.get("deps", [])),
            optional_deps=list(t.get("optional_deps", [])),
            is_optional=False,
        )
        # Mark as optional if declared in optional_targets
        if target.id in optional_targets:
            target.is_optional = True
        targets.append(target)

    return Recipe(
        name=raw["recipe"],
        schema_version=raw["schema_version"],
        description=raw.get("description", ""),
        defaults=raw.get("defaults", {}),
        optional_targets=optional_targets,
        post_build_hooks=list(raw.get("post_build_hooks", [])),
        targets=targets,
    )


def validate_recipe(recipe: Recipe) -> list[str]:
    """Validate a Recipe object and return a list of error messages.

    Checks:
    - Duplicate target IDs
    - Missing target dependencies
    - Self-dependencies
    - Optional targets with default true not included

    Args:
        recipe: Parsed Recipe to validate.

    Returns:
        List of error messages. Empty list means valid.
    """
    errors: list[str] = []
    ids = [t.id for t in recipe.targets]

    # Check for duplicate IDs
    seen: set[str] = set()
    for tid in ids:
        glob_matches = [s for s in seen if fnmatch(s, tid)]
        if glob_matches:
            # Allow exact duplicates only if the same literal ID
            pass
        if tid in seen:
            errors.append(f"Duplicate target ID: {tid}")
        seen.add(tid)

    # Build a set of all known IDs (including glob-expanded)
    known_ids = set(ids)

    # Check dependencies exist, no self-deps, and no overlap between deps/optional_deps
    for t in recipe.targets:
        all_deps = t.deps + t.optional_deps
        for dep in all_deps:
            dep_matches = _resolve_glob_deps(dep, known_ids)
            if not dep_matches:
                errors.append(
                    f"Target '{t.id}' depends on '{dep}', which is not defined"
                )
            if _matches_id(dep, t.id):
                errors.append(f"Target '{t.id}' depends on itself")
        # Check for overlap between required and optional deps
        overlap = set(t.deps) & set(t.optional_deps)
        if overlap:
            errors.append(
                f"Target '{t.id}' lists {', '.join(overlap)} in both deps and optional_deps"
            )

    # Check optional targets with default=true
    for tid, opt in recipe.optional_targets.items():
        if opt.get("default", False):
            has_target = any(t.id == tid for t in recipe.targets)
            if not has_target:
                errors.append(
                    f"Optional target '{tid}' has default=true but is not in targets list"
                )

    return errors


def compute_waves(
    recipe: Recipe,
    enabled: Optional[set[str]] = None,
    excluded: Optional[set[str]] = None,
    filter_targets: Optional[set[str]] = None,
) -> list[Wave]:
    """Compute wave decomposition from a recipe using topological sort.

    Algorithm:
    1. Build adjacency list from target deps
    2. Remove excluded targets and cascade-remove anything depending on them
    3. Include enabled optional targets
    4. Iterative topological sort: each pass removes nodes with no
       remaining upstream deps (that becomes the next wave)
    5. If nodes remain with unresolved deps, a cycle exists

    Args:
        recipe: Parsed Recipe.
        enabled: Target IDs to enable (optional targets).
        excluded: Target IDs to exclude.

    Returns:
        List of Wave objects in execution order.

    Raises:
        ValueError: If a cycle is detected in the dependency graph.
    """
    enabled = enabled or set()
    excluded = excluded or set()

    # Work with a copy of targets
    all_targets: dict[str, Target] = {t.id: t for t in recipe.targets}

    # Start with all non-optional targets + optional targets that have default=true
    active_ids = set()
    for tid, t in all_targets.items():
        if not t.is_optional:
            active_ids.add(tid)
        elif t.is_optional:
            opt = recipe.optional_targets.get(tid, {})
            if opt.get("default", False):
                active_ids.add(tid)
            elif tid in (enabled or set()):
                active_ids.add(tid)

    # Add explicitly enabled optional targets
    if enabled:
        for eid in enabled:
            if eid in all_targets and all_targets[eid].is_optional:
                active_ids.add(eid)

    # Remove excluded targets from active set
    exclude_set = _expand_exclusions(excluded, all_targets)
    active_ids -= exclude_set

    # Apply filter_targets: restrict to requested targets + their transitive deps
    if filter_targets:
        filter_closure = set(filter_targets)
        changed = True
        while changed:
            changed = False
            for tid in list(filter_closure):
                if tid in all_targets:
                    # Include both required and optional deps in closure
                    for dep in all_targets[tid].deps + all_targets[tid].optional_deps:
                        resolved = _resolve_glob_deps(dep, set(all_targets.keys()))
                        for resolved_tid in resolved:
                            if resolved_tid not in filter_closure:
                                filter_closure.add(resolved_tid)
                                changed = True
        active_ids &= filter_closure

    # Cascade removal: remove targets whose REQUIRED deps are not in active set
    # (optional_deps never trigger cascade removal)
    changed = True
    while changed:
        changed = False
        for tid in list(active_ids):
            t = all_targets[tid]
            for dep in t.deps:
                resolved = _resolve_glob_deps(dep, active_ids)
                if not resolved:
                    active_ids.discard(tid)
                    changed = True
                    break

    # Build adjacency for active targets only
    in_edges: dict[str, set[str]] = {tid: set() for tid in active_ids}
    for tid in active_ids:
        t = all_targets[tid]
        for dep in t.deps:
            resolved = _resolve_glob_deps(dep, active_ids)
            in_edges[tid].update(resolved)

    # Iterative topological sort into waves
    remaining = set(active_ids)
    waves: list[Wave] = []
    wave_num = 1

    while remaining:
        # Find nodes with no remaining upstream deps
        wave_ids = {
            tid
            for tid in remaining
            if not in_edges[tid].intersection(remaining)
        }

        if not wave_ids:
            # Cycle detected among remaining nodes
            cycle_nodes = ", ".join(sorted(remaining))
            raise ValueError(f"Cycle detected among targets: {cycle_nodes}")

        wave_targets = [all_targets[tid] for tid in sorted(wave_ids)]
        waves.append(Wave(number=wave_num, targets=wave_targets))

        # Remove processed nodes
        remaining -= wave_ids
        wave_num += 1

    return waves


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _validate_raw(raw: dict) -> list[str]:
    """Validate raw YAML dict for required keys."""
    errors: list[str] = []
    required_keys = ["recipe", "schema_version", "targets", "defaults"]
    for key in required_keys:
        if key not in raw:
            errors.append(f"Missing required key: '{key}'")

    # defaults must contain 'version'
    defaults = raw.get("defaults", {})
    if "version" not in defaults:
        errors.append("Missing required key: 'defaults.version'")

    # Validate targets structure
    if "targets" in raw:
        for i, t in enumerate(raw["targets"]):
            if not isinstance(t, dict):
                errors.append(f"Target at index {i} is not a mapping")
                continue
            if "id" not in t:
                errors.append(f"Target at index {i} missing 'id'")
            if "skill" not in t:
                errors.append(f"Target '{t.get('id', i)}' missing 'skill'")

    return errors


def _matches_id(pattern: str, target_id: str) -> bool:
    """Check if a target_id matches a pattern (which may contain glob wildcards)."""
    return fnmatch(target_id, pattern) or pattern == target_id


def _resolve_glob_deps(dep: str, known_ids: set[str]) -> list[str]:
    """Resolve a dependency pattern against known target IDs.

    Handles glob patterns like 'ADR-*' matching 'ADR-01', 'ADR-02', etc.
    """
    matches = [tid for tid in known_ids if _matches_id(dep, tid)]
    return matches


def _expand_exclusions(excluded: set[str], all_targets: dict[str, Target]) -> set[str]:
    """Expand exclusion set to include glob matches."""
    expanded = set()
    for exc in excluded:
        for tid in all_targets:
            if _matches_id(exc, tid):
                expanded.add(tid)
    return expanded | excluded


if __name__ == "__main__":
    # Quick self-test with the sample recipe
    sample = (
        Path(__file__).resolve().parent.parent.parent
        / "plugins"
        / "arckit-togaf-adm"
        / "recipes"
        / "togaf-adm-full.yaml"
    )

    if sample.exists():
        recipe = load_recipe(str(sample))
        print(f"Loaded recipe: {recipe.name} (v{recipe.schema_version})")
        print(f"  Targets: {len(recipe.targets)}")
        print(f"  Optional: {len(recipe.optional_targets)}")

        errors = validate_recipe(recipe)
        if errors:
            print(f"Validation errors: {errors}")
        else:
            print("  Validation: OK")

        # Test with no exclusions (optional targets with default=false excluded)
        waves = compute_waves(recipe)
        print(f"  Waves: {len(waves)}")
        for w in waves:
            print(f"    Wave {w.number}: {[t.id for t in w.targets]}")

        # Test with optional targets enabled
        waves_full = compute_waves(recipe, enabled={"ACHG", "REPO"})
        print(f"\n  With ACHG+REPO enabled: {len(waves_full)} waves")
        for w in waves_full:
            print(f"    Wave {w.number}: {[t.id for t in w.targets]}")

        # Test with excluded targets
        waves_min = compute_waves(recipe, excluded={"REPO"})
        print(f"\n  With REPO excluded: {len(waves_min)} waves")
        for w in waves_min:
            print(f"    Wave {w.number}: {[t.id for t in w.targets]}")
    else:
        print(f"Sample recipe not found at {sample}")