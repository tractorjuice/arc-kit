#!/usr/bin/env python3
"""Assert everyone credited in a CHANGELOG has a card on the contributors page.

`docs/contributors.html` is hand-maintained and nothing derives it from the
CHANGELOGs, so crediting someone at release time and adding them to the site
are two independent acts. Only one of them is part of the release flow, and it
is not the site one. The page therefore drifts release by release: at v6.7.3
it was missing @chrismckelt (#693, that release), @jhonurrego-tekton (#688,
the release before), and @Yumstezy (#111/#357, long since shipped).

The failure is silent and one-directional — the CHANGELOG is right and the
site is quietly incomplete — so nobody notices until someone goes looking.

Checked in one direction only: every handle credited in a CHANGELOG must
appear on the contributors page. The reverse is deliberately NOT checked, as
a card may legitimately predate the CHANGELOG convention or record a
contribution (a proposed overlay, an adopted external spec) that never
produced a release note.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANGELOGS = (ROOT / "CHANGELOG.md", ROOT / "plugins/arckit-claude/CHANGELOG.md")
CONTRIBUTORS = ROOT / "docs/contributors.html"

# A handle mention must not be preceded by a word character, or every
# `mermaid@11.15.0` / `mermaid@7147` package specifier in the CHANGELOG reads
# as a credit to "@11" / "@7147". GitHub handles are alphanumeric plus internal
# hyphens, max 39 chars.
HANDLE_RE = re.compile(r"(?<![\w@/-])@([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)\b")
PROFILE_RE = re.compile(r"github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)[\"/]")

# Code is stripped before scanning: a credit is always prose, never code, and
# `@`-prefixed tokens are everywhere in code. Without this, PlantUML's
# `@startuml`/`@enduml` read as contributors — as would npm scopes
# (`@types/node`), decorators (`@Component`), and Python's `@property`.
FENCED_RE = re.compile(r"^```.*?^```", re.MULTILINE | re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")


def strip_code(text: str) -> str:
    return INLINE_CODE_RE.sub(" ", FENCED_RE.sub(" ", text))
# Handles that are mentioned in a CHANGELOG but are not outside contributors.
# Keep this list short and justified.
NOT_CONTRIBUTORS = {
    # Repository owner and maintainer — the whole CHANGELOG is their work.
    "tractorjuice",
}


def handles_in_changelogs() -> dict[str, list[str]]:
    """Map each credited handle to the changelog files mentioning it."""
    found: dict[str, list[str]] = {}
    for path in CHANGELOGS:
        if not path.is_file():
            raise SystemExit(f"ERROR: changelog not found: {path.relative_to(ROOT)}")
        prose = strip_code(path.read_text(encoding="utf-8"))
        for handle in set(HANDLE_RE.findall(prose)):
            if handle.isdigit() or handle in NOT_CONTRIBUTORS:
                continue
            found.setdefault(handle, []).append(str(path.relative_to(ROOT)))
    return found


def handles_on_page() -> set[str]:
    if not CONTRIBUTORS.is_file():
        raise SystemExit(f"ERROR: contributors page not found: {CONTRIBUTORS.relative_to(ROOT)}")
    return set(PROFILE_RE.findall(CONTRIBUTORS.read_text(encoding="utf-8")))


def main() -> int:
    credited = handles_in_changelogs()
    if not credited:
        print("ERROR: no contributor handles found in any CHANGELOG — check HANDLE_RE", file=sys.stderr)
        return 1

    listed = {h.lower() for h in handles_on_page()}
    missing = {h: files for h, files in credited.items() if h.lower() not in listed}

    if missing:
        print("Contributors credited in a CHANGELOG but missing from the site:\n", file=sys.stderr)
        for handle in sorted(missing, key=str.lower):
            print(f"  @{handle}  (credited in {', '.join(sorted(missing[handle]))})", file=sys.stderr)
        print(
            f"\nAdd a card for each to {CONTRIBUTORS.relative_to(ROOT)}, then update the two"
            "\ncounts it carries: the `app-page-hero__stat` and the Community Impact paragraph."
            "\nIf a handle is not an outside contributor, add it to NOT_CONTRIBUTORS in"
            f"\n{Path(__file__).relative_to(ROOT)} with a reason.",
            file=sys.stderr,
        )
        return 1

    print(f"All {len(credited)} contributors credited in the CHANGELOGs are listed on the site.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
