#!/usr/bin/env python3
"""Assert no per-type quality-checklist section asserts a foreign regime's ladder.

`references/quality-checklist.md` is what a command reads to verify the artefact
it just wrote. Since #744 routed the Document Control classification ladder by
regime, a per-type section can assert a classification the artefact never
renders: `document-control-fr.md` puts `Diffusion Restreinte` in the header while
the checklist demanded `OFFICIAL-SENSITIVE`, so the artefact was correct and
failed its own check. Seven sections were in that state (six FR plus `ATDSG`)
until PR #788 fixed them, and every one arose the same way, by copying a UK
section when adding an overlay type. Nothing guarded it; this does (#790).

The check is derived end to end, not hand-maintained:

  * code -> regime            `config/doc-types.mjs`, `DOC_TYPES`
  * regime -> partial         `config/doc-types.mjs`, `REGIME_PARTIALS`
  * does the regime route?    `config/doc-types.mjs`, `UK_FALLBACK_BY_DESIGN`
  * partial -> ladder         the partial's own `**Classification**` row

Adding a regime therefore extends this guard automatically. Enumerating the
schemes by hand is the defect #788 fixed in the checklist itself, where a list of
three had drifted from a registry of six, so it is not repeated here.

Resolution is PER PLUGIN. `${CLAUDE_PLUGIN_ROOT}` resolves to each plugin's own
root with no cross-plugin fallback, so a command in `arckit-fr` reads that
plugin's checklist against that plugin's partials. Both are synced copies and
`sync-shared-assets.py --check` holds them byte-identical, but this guard does
not assume it has run. The doc-type registry is read from core, because core is
the only plugin that ships `config/` at all — see `_partials/RENDERING.md`.

Only the hard-routing regimes are policed (AT, AU, CA, FR, NL, UAE, US). A
fall-through regime (UK, MOD, EU) resolves through user config and can
legitimately render a UAE or AT ladder for a UAE- or AT-configured operator, so
asserting a UK value there is not drift.

Deliberately NOT checked:

  * Anything outside an anchored Document Control assertion. A bare scan for
    ladder tokens cannot work: `OFFICIAL` and `SECRET` sit on three ladders at
    once, and `Open`, `Shared`, `Secret` and `Confidential` are ordinary English
    -- the detection pass for #787 false-positived on FITAA's "Open Items". The
    anchors below are the phrasings actually in use.
  * The parenthetical after an assertion. `classified Eingeschränkt (or
    Vertraulich where ...)` is free prose, and policing tokens inside it
    reintroduces exactly the noise the anchors exist to avoid. The primary
    asserted value is checked; the escalation note is not.
  * Case and accents. `DIFFUSION RESTREINTE` is how a DR document is marked in
    French practice and is not a foreign-ladder defect.
  * `plugins/arckit-claude/plugins/**`, the generated publish-layout mirror.
    Drift there is a sync failure and `tests/plugin/test_release_process.py`
    already catches it.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"
CORE = PLUGINS_DIR / "arckit-claude"

# Generated publish-layout mirror -- see module docstring.
MIRROR_DIR = PLUGINS_DIR / "arckit-claude/plugins"

MJS_REL = Path("config/doc-types.mjs")
CHECKLIST_REL = Path("references/quality-checklist.md")
PARTIALS_REL = Path("templates/_partials")

SECTION_RE = re.compile(r"^### ([A-Z0-9][A-Z0-9-]*)\s", re.M)

# The two Document Control assertion phrasings in the tree. Anchored on the
# bullet and on "Document ... classified" / "Classification:" so that ordinary
# uses of the word ("Change classified as EVOLUTIONARY", "Every provider
# classified as designated CTP") are not read as classification assertions.
ASSERT_RE = re.compile(
    r"^\s*[-*]\s+(?:Document(?:\s+itself)?\s+classified|Classification:)\s+(.+?)\s*$"
)

# `| **Classification** | [PUBLIC / OFFICIAL / ...] |` in a Document Control partial.
LADDER_RE = re.compile(r"^\|\s*\*\*Classification\*\*\s*\|\s*\[(.+?)\]\s*\|", re.M)


def norm(value: str) -> str:
    """Casefold, strip accents, collapse whitespace -- see docstring."""
    decomposed = unicodedata.normalize("NFKD", value)
    stripped = "".join(c for c in decomposed if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", stripped).strip().casefold()


def block(text: str, export_name: str, open_char: str, close_char: str) -> str:
    """Balanced-delimiter slice of `export const NAME = ...` from doc-types.mjs.

    Regex rather than a node subprocess: this must run in CI without assuming a
    node toolchain, matching check-doc-type-registry.py.
    """
    start = text.index(f"export const {export_name} = ")
    depth = 0
    for i in range(start, len(text)):
        if text[i] == open_char:
            depth += 1
        elif text[i] == close_char:
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    raise ValueError(f"unterminated {export_name} block in {MJS_REL}")


def load_registry(mjs: Path) -> tuple[dict[str, str], dict[str, str], set[str]]:
    """(code -> regime, regime -> partial filename, fall-through regimes)."""
    text = mjs.read_text(encoding="utf-8")

    regime_of: dict[str, str] = {}
    for m in re.finditer(
        r"^\s*'([A-Z0-9-]+)':\s*\{(.*)$", block(text, "DOC_TYPES", "{", "}"), re.M
    ):
        found = re.search(r"regime:\s*'([A-Z]+)'", m.group(2))
        if found:
            regime_of[m.group(1)] = found.group(1)

    partial_of = dict(
        re.findall(
            r"^\s*([A-Z]+):\s*'([^']+)'", block(text, "REGIME_PARTIALS", "{", "}"), re.M
        )
    )

    fallthrough = set(
        re.findall(
            r"'([A-Z]+)'", block(text, "UK_FALLBACK_BY_DESIGN", "(", ")")
        )
    )

    return regime_of, partial_of, fallthrough


def ladder_for(plugin: Path, partial_name: str) -> list[str] | None:
    """Classification values from a plugin's own partial, falling back to core."""
    for base in (plugin, CORE):
        path = base / PARTIALS_REL / partial_name
        if path.is_file():
            found = LADDER_RE.search(path.read_text(encoding="utf-8"))
            if found:
                return [v.strip() for v in found.group(1).split("/") if v.strip()]
    return None


def primary_regime(partial_name: str) -> str:
    """`document-control-uk.md` -> `UK`.

    Four regimes share the UK partial, so naming them all in a failure message
    buries the point. The filename convention is the one
    scripts/tests/test-regime-registration.mjs already enforces.
    """
    return Path(partial_name).stem.replace("document-control-", "").upper()


def asserted_values(line: str) -> list[str]:
    """Primary classification value(s) on an assertion line.

    Drops a trailing parenthetical or dash-led aside and the `minimum`
    qualifier, then splits an `X or Y` pair. The dash must be whitespace
    delimited: a bare `-` would cut `OFFICIAL-SENSITIVE` down to `OFFICIAL`,
    which reports the wrong value and, worse, one that IS on another ladder.
    See the module docstring for why the aside itself is not policed.
    """
    raw = ASSERT_RE.match(line)
    if not raw:
        return []
    value = re.sub(r"\s*\(.*$", "", raw.group(1))
    value = re.sub(r"\s+[—–-]\s+.*$", "", value)
    out = []
    for part in re.split(r"\s+or\s+|\s*/\s*", value):
        part = re.sub(r"\s+minimum\b.*$", "", part).strip().rstrip(".,;:")
        if part:
            out.append(part)
    return out


def plugin_dirs() -> list[Path]:
    return sorted(
        p for p in PLUGINS_DIR.iterdir() if p.is_dir() and (p / ".claude-plugin").is_dir()
    )


def check_plugin(
    plugin: Path,
    regime_of: dict[str, str],
    partial_of: dict[str, str],
    routing: set[str],
) -> tuple[list[tuple[Path, int, str, str, str, list[str]]], int]:
    """(failures, assertions seen) for one plugin's checklist copy."""
    checklist = plugin / CHECKLIST_REL
    if not checklist.is_file():
        return [], 0

    # Every partial, not just the hard-routing ones. A UK value in an FR section
    # is the defect's signature, and saying so names the cause (a copied UK
    # section) instead of reporting the value as unrecognised.
    ladders: dict[str, set[str]] = {}
    for partial_name in sorted(set(partial_of.values())):
        values = ladder_for(plugin, partial_name)
        if values is None:
            raise SystemExit(
                f"ERROR: {plugin.name} has no readable {partial_name} "
                f"and core carries none either"
            )
        ladders[partial_name] = {norm(v) for v in values}

    rel = checklist.relative_to(ROOT)
    failures = []
    seen = 0
    code = None

    for lineno, line in enumerate(checklist.read_text(encoding="utf-8").splitlines(), 1):
        heading = SECTION_RE.match(line)
        if heading:
            code = heading.group(1)
            continue
        values = asserted_values(line)
        if not values or code is None:
            continue
        seen += 1
        regime = regime_of.get(code)
        if regime is None or regime not in routing:
            continue
        allowed = ladders[partial_of[regime]]
        for value in values:
            if norm(value) in allowed:
                continue
            elsewhere = sorted(
                primary_regime(name) for name, vals in ladders.items() if norm(value) in vals
            )
            failures.append((rel, lineno, code, regime, value, elsewhere))

    return failures, seen


def main() -> int:
    mjs = CORE / MJS_REL
    if not mjs.is_file():
        print(f"ERROR: {mjs.relative_to(ROOT)} not found", file=sys.stderr)
        return 1

    regime_of, partial_of, fallthrough = load_registry(mjs)
    routing = {r for r in partial_of if r not in fallthrough}
    if not routing:
        print(
            "ERROR: no hard-routing regimes parsed from config/doc-types.mjs — "
            "REGIME_PARTIALS or UK_FALLBACK_BY_DESIGN has been reshaped and the "
            "parser no longer matches it.",
            file=sys.stderr,
        )
        return 1

    failures: list[tuple[Path, int, str, str, str, list[str]]] = []
    total = 0
    checklists = 0

    for plugin in plugin_dirs():
        if plugin == MIRROR_DIR or MIRROR_DIR in plugin.parents:
            continue
        found, seen = check_plugin(plugin, regime_of, partial_of, routing)
        if (plugin / CHECKLIST_REL).is_file():
            checklists += 1
        failures.extend(found)
        total += seen

    if total == 0:
        print(
            "ERROR: no Document Control classification assertions found in any "
            "quality-checklist.md — the phrasing has probably changed and "
            "ASSERT_RE no longer matches it.",
            file=sys.stderr,
        )
        return 1

    if failures:
        print(
            f"FAIL {len(failures)} per-type check(s) asserting a classification the "
            f"artefact will never render:",
            file=sys.stderr,
        )
        for rel, lineno, code, regime, value, elsewhere in failures:
            where = (
                f"on the {'/'.join(elsewhere)} ladder"
                if elsewhere
                else "on no registered ladder"
            )
            print(
                f"  {rel}:{lineno}  ### {code} ({regime}) asserts "
                f"{value!r} — {where}, not {regime}'s",
                file=sys.stderr,
            )
        example = sorted(routing)[0]
        print(
            "\n  The regime hard-routes, so the Document Control header renders the\n"
            "  regime's own ladder whoever runs the command. A check demanding another\n"
            "  ladder fails a correct artefact. Ladders are listed per regime in\n"
            f"  plugins/arckit-claude/templates/_partials/RENDERING.md (e.g. {example}).\n"
            "  Fix plugins/arckit-claude/references/quality-checklist.md (the canonical\n"
            "  copy), then run: python3 scripts/sync-shared-assets.py\n"
            "                and python3 scripts/sync-claude-plugin-layout.py\n"
            "  Check the command's own inline checklist too — it usually carries the\n"
            "  same assertion, and fixing only the shared file leaves them contradicting.",
            file=sys.stderr,
        )
        return 1

    print(
        f"Quality-checklist ladder check OK: {total} classification assertion(s) "
        f"across {checklists} plugin checklist(s), all on their own regime's ladder "
        f"({len(routing)} hard-routing regimes: {', '.join(sorted(routing))})."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
