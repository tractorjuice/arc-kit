#!/usr/bin/env python3
"""Hold `/arckit:customize`'s hardcoded template table to the templates on disk.

`plugins/arckit-claude/commands/customize.md` carries a table mapping template
short names to the command that writes them. The `list` action globs rather than
reading the table, so the table is documentation rather than control flow -- but
it is documentation the user is invited to act on, and it drifted in BOTH
directions before anything watched it (arc-kit#717):

  * 20 core templates were missing from it, so `/arckit:customize list` showed
    rows the table did not explain and the table under-reported the catalogue by
    a third.
  * one row named `uk-gov-tcop`, a template that has never existed. Asking for it
    hit the "source template does not exist" branch while the docs said it was
    valid.

This script asserts three things:

  1. every core template on disk has a table row
  2. every table row names a template that exists on disk
  3. every table row's `/arckit:<command>` reference resolves to a real command

It also checks that the command still states its scope. `/arckit:customize` can
only reach the core plugin's templates -- `${CLAUDE_PLUGIN_ROOT}` resolves to the
plugin the command ships in, so the overlays' templates (the larger half of the
catalogue) are invisible to it. Saying "copied all templates" after a core-only
pass is a wrong answer, not a terse one, so the scope wording is load-bearing and
guarded against silent removal.

Scope note: this guard deliberately covers the CORE table only. Overlay
templates are not expected to appear in it. When #717 makes overlay templates
first-class, widen the disk-side glob rather than relaxing the assertions.

Usage:
    python3 scripts/check-customize-table.py           # report drift, exit 1 if any
    python3 scripts/check-customize-table.py --check   # same (CI-friendly alias)
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
COMMANDS = REPO_ROOT / "plugins" / "arckit-claude" / "commands"
CUSTOMIZE = COMMANDS / "customize.md"
TEMPLATES = REPO_ROOT / "plugins" / "arckit-claude" / "templates"

TEMPLATE_SUFFIX = re.compile(r"-template\.(md|html)$")
ROW = re.compile(r"^\| `([^`]+)` \| `/arckit:([^`]+)` \| (.+?) \|$", re.M)

# Phrases that make the partial scope explicit to the user. The command must keep
# saying this somewhere; the exact sentence may be reworded.
SCOPE_MARKERS = (
    "core `arckit` plugin only",
    "does not cover",
)


def core_templates() -> set[str]:
    """Short names of every template the core plugin ships (top level only)."""
    return {
        TEMPLATE_SUFFIX.sub("", path.name)
        for path in TEMPLATES.iterdir()
        if path.is_file() and TEMPLATE_SUFFIX.search(path.name)
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="CI-friendly alias")
    parser.parse_args()

    text = CUSTOMIZE.read_text(encoding="utf-8")
    rows = ROW.findall(text)
    if not rows:
        print(
            f"FAIL {CUSTOMIZE.relative_to(REPO_ROOT)}: no template table found.\n"
            "     Expected rows shaped `| `name` | `/arckit:command` | description |`.",
            file=sys.stderr,
        )
        return 1

    tabled = {name for name, _command, _description in rows}
    on_disk = core_templates()
    failures: list[str] = []

    duplicates = sorted({n for n, _c, _d in rows if [r[0] for r in rows].count(n) > 1})
    if duplicates:
        failures.append(
            "Template listed more than once in the table:\n"
            + "".join(f"  {name}\n" for name in duplicates)
        )

    missing = sorted(on_disk - tabled)
    if missing:
        failures.append(
            f"{len(missing)} core template(s) on disk with no table row:\n"
            + "".join(f"  {name}-template.*\n" for name in missing)
            + "  Add a row to the table in customize.md.\n"
        )

    phantom = sorted(tabled - on_disk)
    if phantom:
        failures.append(
            f"{len(phantom)} table row(s) naming a template that does not exist:\n"
            + "".join(f"  {name}\n" for name in phantom)
            + "  /arckit:customize <name> will fail for these. Remove or correct the row.\n"
        )

    unresolved = sorted(
        {
            (name, command)
            for name, command, _description in rows
            if not (COMMANDS / f"{command}.md").is_file()
        }
    )
    if unresolved:
        failures.append(
            f"{len(unresolved)} table row(s) pointing at a command that does not exist:\n"
            + "".join(f"  {name} -> /arckit:{command}\n" for name, command in unresolved)
        )

    absent_markers = [marker for marker in SCOPE_MARKERS if marker not in text]
    if absent_markers:
        failures.append(
            "customize.md no longer states its scope. Missing wording:\n"
            + "".join(f"  {marker!r}\n" for marker in absent_markers)
            + "  The command reaches core templates only; a core-only result must\n"
            "  never be presented as the full inventory (arc-kit#717).\n"
        )

    if failures:
        print(
            f"FAIL {CUSTOMIZE.relative_to(REPO_ROOT)}\n\n" + "\n".join(failures),
            file=sys.stderr,
        )
        return 1

    print(
        f"customize table OK: {len(tabled)} rows match {len(on_disk)} core templates, "
        "all command references resolve, scope stated."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
