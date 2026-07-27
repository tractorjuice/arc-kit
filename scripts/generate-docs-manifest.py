#!/usr/bin/env python3
"""Generate docs/manifest.json from disk, or check it for drift.

docs/manifest.json is published at https://arckit.org/manifest.json as a
programmatic document index. Nothing in the site HTML reads it, so nobody
noticed it going stale: before this script it was six months old and roughly
a quarter complete (54 of 238 guides, 45 of 166 templates, 2 of 62 articles),
with one entry pointing at a file that no longer existed.

Hand-maintaining a ~470-entry index does not work. This derives it from disk.

Sources of truth:
  guides     docs/guides/**/*.md, grouped via GUIDE_METADATA in
             plugins/arckit-claude/config/guide-groups.mjs (the same registry
             /arckit:pages and check-guide-site-links.py rely on)
  templates  .arckit/templates/*.md
  articles   docs/articles/*.md
  global     a small fixed set of top-level docs (GLOBAL_DOCS below)

Usage:
  generate-docs-manifest.py --write   rebuild the file
  generate-docs-manifest.py --check   exit 1 if it differs from disk (CI)

`--check` ignores the `generated` timestamp, so a rebuild on a day when
nothing else changed is not spurious drift.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "docs/manifest.json"
GUIDES_DIR = ROOT / "docs/guides"
TEMPLATES_DIR = ROOT / ".arckit/templates"
ARTICLES_DIR = ROOT / "docs/articles"
GUIDE_GROUPS = ROOT / "plugins/arckit-claude/config/guide-groups.mjs"

REPOSITORY = {"owner": "tractorjuice", "name": "arc-kit", "branch": "main"}

# Top-level docs surfaced as "global". Path -> title. Kept explicit rather than
# globbed: the repo root holds many markdown files that are not public docs.
GLOBAL_DOCS = [
    ("README.md", "ArcKit Overview"),
    ("docs/README.md", "Documentation Index"),
    ("CHANGELOG.md", "Changelog"),
    ("docs/DEPENDENCY-MATRIX.md", "Command Dependencies"),
    ("docs/WORKFLOW-DIAGRAMS.md", "Workflow Diagrams"),
    ("docs/RELEASING.md", "Release Process"),
]

# Titles come from each file's first H1 verbatim, so the index matches what a
# reader sees at the top of the page.
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def title_of(path: Path, fallback_stem: str) -> str:
    """First H1 in the file, else a prettified stem."""
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        text = ""
    match = H1_RE.search(text)
    if match:
        title = match.group(1).strip()
        # Drop trailing bracketed qualifiers and inline markdown emphasis.
        title = re.sub(r"\s*[\[(].*?[\])]\s*$", "", title).strip("*_` ")
        if title:
            return title
    return fallback_stem.replace("-", " ").replace("/", " / ").title()


def load_guide_metadata() -> dict[str, dict]:
    """Read GUIDE_METADATA out of the ESM config via node."""
    script = (
        f"import({json.dumps(GUIDE_GROUPS.as_uri())})"
        ".then(m => console.log(JSON.stringify(m.GUIDE_METADATA)))"
    )
    result = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        capture_output=True, text=True, cwd=ROOT,
    )
    if result.returncode != 0:
        raise SystemExit(f"ERROR: could not read GUIDE_METADATA via node:\n{result.stderr}")
    return json.loads(result.stdout)


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def guide_projects(metadata: dict[str, dict]) -> list[dict]:
    """Group every guide on disk into a project bucket.

    Bucketing rules, in order:
      roles/*            -> "Role Guides"       (surfaced on roles.html)
      <subdir>/*         -> "<Subdir> Guides"   (uk-government/, uk-mod/)
      in GUIDE_METADATA  -> "<category> Guides"
      otherwise          -> "Other Guides"
    """
    buckets: dict[str, dict] = {}

    for path in sorted(GUIDES_DIR.rglob("*.md")):
        stem = str(path.relative_to(GUIDES_DIR)).removesuffix(".md")
        parent = stem.split("/")[0] if "/" in stem else None

        if parent == "roles":
            category = "Roles"
        elif parent:
            category = parent.replace("-", " ").title()
        else:
            category = (metadata.get(stem) or {}).get("category") or "Other"

        bucket = buckets.setdefault(
            category,
            {"id": f"guides-{slug(category)}", "name": f"{category} Guides", "documents": []},
        )
        bucket["documents"].append({
            "path": f"docs/guides/{stem}.md",
            "title": title_of(path, stem),
            "category": category,
        })

    for bucket in buckets.values():
        bucket["documents"].sort(key=lambda d: d["path"])
    return [buckets[k] for k in sorted(buckets)]


def flat_project(project_id: str, name: str, directory: Path, prefix: str, category: str) -> dict:
    documents = []
    for path in sorted(directory.glob("*.md")):
        documents.append({
            "path": f"{prefix}/{path.name}",
            "title": title_of(path, path.stem),
            "category": category,
        })
    return {"id": project_id, "name": name, "documents": documents}


def build(generated: str) -> dict:
    metadata = load_guide_metadata()
    projects = guide_projects(metadata)
    projects.append(flat_project("templates", "Document Templates", TEMPLATES_DIR, ".arckit/templates", "Templates"))
    projects.append(flat_project("articles", "Articles", ARTICLES_DIR, "docs/articles", "Marketing"))

    return {
        "generated": generated,
        "repository": REPOSITORY,
        "global": [
            {"path": p, "title": t, "category": "Overview"}
            for p, t in GLOBAL_DOCS
            if (ROOT / p).is_file()
        ],
        "projects": projects,
    }


def existing_generated() -> str:
    try:
        return json.loads(MANIFEST.read_text(encoding="utf-8")).get("generated", "")
    except (OSError, json.JSONDecodeError):
        return ""


def serialise(manifest: dict) -> str:
    return json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true", help="rebuild docs/manifest.json")
    group.add_argument("--check", action="store_true", help="exit 1 if it differs from disk")
    parser.add_argument("--date", help="ISO date to stamp as `generated` (default: today, --write only)")
    args = parser.parse_args()

    if args.check:
        # Reuse the committed timestamp so an unchanged tree never reports drift.
        manifest = build(existing_generated())
        if not MANIFEST.is_file():
            print("FAIL docs/manifest.json is missing. Run --write.", file=sys.stderr)
            return 1
        if MANIFEST.read_text(encoding="utf-8") != serialise(manifest):
            current = json.loads(MANIFEST.read_text(encoding="utf-8"))
            have = sum(len(p["documents"]) for p in current["projects"]) + len(current["global"])
            want = sum(len(p["documents"]) for p in manifest["projects"]) + len(manifest["global"])
            print("FAIL docs/manifest.json is out of date.", file=sys.stderr)
            print(f"  committed: {have} document(s)   from disk: {want} document(s)", file=sys.stderr)
            print("  Run: python3 scripts/generate-docs-manifest.py --write", file=sys.stderr)
            return 1
        total = sum(len(p["documents"]) for p in manifest["projects"]) + len(manifest["global"])
        print(f"docs/manifest.json OK: {total} documents across {len(manifest['projects'])} groups.")
        return 0

    if args.date:
        generated = args.date
    else:
        # Date only, no clock time: avoids a diff on every run.
        generated = subprocess.run(
            ["date", "-u", "+%Y-%m-%dT00:00:00Z"], capture_output=True, text=True
        ).stdout.strip()

    manifest = build(generated)
    MANIFEST.write_text(serialise(manifest), encoding="utf-8")
    total = sum(len(p["documents"]) for p in manifest["projects"]) + len(manifest["global"])
    print(f"Wrote docs/manifest.json: {total} documents across {len(manifest['projects'])} groups.")
    for project in manifest["projects"]:
        print(f"  {project['id']:34} {len(project['documents']):4}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
