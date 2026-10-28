#!/usr/bin/env python3
"""Guard: O-AA Standard content integrity for the OAA plugin.

The overlay cites the Open Agile Architecture Standard, Version 2.0 (The Open
Group document C262, April 2026), which supersedes C208 (2020, re-issued
October 2022 with Technical Corrigendum U221). Version 2.0 Appendix A defines
16 *named* axioms, with the same numbers and names as C208 Ch. 9. The OAA
plugin previously shipped fabricated axiom quotes ("Axiom 2: Strategy must
shape..."), a chapter map that does not exist in the standard, "Learning
Unit" scoping that the standard never uses, and an edition label ("v3.0")
that matches no edition.

This guard blocks that defect class. It checks:

  1. every ``Axiom N`` citation uses a published number (1-16)
  2. a *named* ``Axiom N`` citation (name following the number) names the
     published axiom — a wrong name for a number is a fabrication
  3. the 16-axiom table in ``references/oaa-reference.md`` matches the
     canonical name list exactly
  4. no "Learning Unit" phrasing remains (certification-syllabus vocabulary,
     not the standard's — its content is chapters and axioms)
  5. G216 (O-AA Security Playbook) and G226 (Agile EA Playbook) are cited in
     the right context
  6. no stale chapter coordinates remain. Version 2.0 coordinates are
     Ch. 5 (Agile Strategy), Ch. 7 (Agile Governance), Ch. 12 (Product
     Architecture), Appendix A (axioms), and Axiom 16 + §14.6.1 + G216
     (security). Blocked: the C208 coordinates (Ch. 11 Strategy, Ch. 14
     Product Architecture, Ch. 8 Governance, Ch. 9 / §9.N axioms), the
     "Ch. 4.6 Security by Design" section that neither edition has, the
     fabricated pre-C208 map (Ch. 10 Strategy, Ch. 17 Security, Ch. 18
     Governance), and "Chapters 1–9" as an ADM range (ADM Lite is an ArcKit
     convention over TOGAF ADM, 10th Edition, C220)
  7. the ``oaa-adm-lite`` axiom set is consistent across the three places it
     is stated: the command's Axiom Alignment list, the template's per-sprint
     axiom blocks, and the 16-axiom table's "Applied by" column — a set that
     is declared but never applied (or applied but never declared) is drift
  8. the edition is named: ``C208`` appears only where the text says it is
     superseded, and no "v3.0" edition label is attached to the standard
  9. each command, and its row in the README coverage table, cites the
     command's Version 2.0 coordinate

Scanned trees: the canonical source of truth (``plugins/arckit-oaa``), its
arckit-claude mirror (``plugins/arckit-claude/plugins/oaa``), and the
OAA fixture deliverables in ``test-oaa-dummy`` (files whose names carry an
OAA doc-type code). CHANGELOG files are excluded — they describe past fixes.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# The 16 published axioms, O-AA Standard Version 2.0 Appendix A (C208 Ch. 9).
CANON_AXIOMS: dict[int, str] = {
    1: "Customer Experience Focus",
    2: "Outside-In Thinking",
    3: "Rapid Feedback Loops",
    4: "Touchpoint Orchestration",
    5: "Value Stream Alignment",
    6: "Autonomous Cross-Functional Teams",
    7: "Authority, Responsibility, and Accountability Distribution",
    8: "Loosely-Coupled Systems",
    9: "Modular Data Platform",
    10: "Simple Common Operating Principles",
    11: "Partitioning Over Layering",
    12: "Organization Mirroring Architecture",
    13: "Organizational Leveling",
    14: "Bias for Change",
    15: "Project to Product Shift",
    16: "Secure by Design",
}

OAA_DOC_CODES = ("OAAL", "OAPR", "OASTR", "OASEC", "OAGOV")

SOURCE_ROOTS = (
    ROOT / "plugins" / "arckit-oaa",
    ROOT / "plugins" / "arckit-claude" / "plugins" / "oaa",
)

# `Axiom N` followed by an optional separator (dash, colon, comma, opening
# paren, spaces) and then a word chain — the candidate axiom name.
AXIOM_CITE_RE = re.compile(r"Axiom\s+(\d+)")
NAME_RE = re.compile(
    r"[—–:,()\s]*([A-Z][A-Za-z0-9'\u2019\-]*(?:[ \t]+[A-Za-z0-9'\u2019\-]*)*)"
)

# Table rows of the shape `| 7 | Some Name | ... |` in oaa-reference.md.
TABLE_ROW_RE = re.compile(r"^\|\s*(\d{1,2})\s*\|\s*([^|]+?)\s*\|", re.MULTILINE)

PLAYBOOK_CONTEXT = {
    # (token, required context word(s), context window in chars)
    "G216": ("security", 80),
    "G226": ("agile enterprise architect", 80),
}

# `**Axiom N (...)**` bullets — the explicit citation form used by the
# oaa-adm-lite command's alignment list and the template's sprint blocks.
ADM_LITE_CITE_RE = re.compile(r"\*\*Axiom\s+(\d{1,2})\s*\(")

# `| N | Name | applied-by cell |` rows of the 16-axiom table.
APPLIED_BY_RE = re.compile(r"^\|\s*(\d{1,2})\s*\|[^|]*\|\s*([^|]*)\|", re.MULTILINE)

# Stale chapter coordinates. Each pattern is number+topic (or an exact
# section number) so a legitimate citation of a Version 2.0 chapter with the
# same number (Ch. 8 Architecture Development, Ch. 11 Continuous
# Architectural Refactoring, Ch. 14 Software Architecture) never
# false-positives. The topic must follow the number with only separators in
# between, so the C208 column of the reference's migration table is safe.
_CH = r"(?:Chapter|Ch\.?)\s?"
_SEP = r"[—–\-:,( ]+"
STALE_CHAPTER_PATTERNS: list[tuple[str, str]] = [
    # C208 coordinates, superseded by Version 2.0 (C262).
    (_CH + r"11" + _SEP + r"(?:Agile )?Strategy", "Agile Strategy is O-AA v2.0 Ch. 5 (C208 Ch. 11)"),
    (_CH + r"14" + _SEP + r"Product Architecture", "Product Architecture is O-AA v2.0 Ch. 12 (C208 Ch. 14)"),
    (_CH + r"8" + _SEP + r"(?:Agile )?Governance", "Agile Governance is O-AA v2.0 Ch. 7 (C208 Ch. 8)"),
    (_CH + r"9" + _SEP + r"(?:\(?\"?)?Axiom", "the axioms are O-AA v2.0 Appendix A (C208 Ch. 9)"),
    (r"§\s?9\.\d{1,2}\b", "the axioms are O-AA v2.0 Appendix A, cited by number and name (C208 §9.1–§9.16)"),
    (
        r"(?:Chapter|Ch\.?|§)\s?4\.6\b",
        "neither C208 nor v2.0 has a §4.6 — cite Axiom 16 (Appendix A) and §14.6.1 Security",
    ),
    # The fabricated pre-C208 map; still wrong in Version 2.0.
    (_CH + r"10" + _SEP + r"Strategy", "Agile Strategy is O-AA v2.0 Ch. 5"),
    (_CH + r"10\s?\(Strategy\)", "Agile Strategy is O-AA v2.0 Ch. 5"),
    (_CH + r"17" + _SEP + r"Security", "the standard has no security chapter — use Axiom 16 + §14.6.1 + G216"),
    (_CH + r"18" + _SEP + r"Governance", "Agile Governance is O-AA v2.0 Ch. 7"),
    (r"Chapters? 1[–\-]9", "the standard does not define an ADM cycle — ADM Lite is an ArcKit convention over TOGAF ADM (10th Edition, C220)"),
    (r"\bCh\.?\s?1[–\-]9\b", "the standard does not define an ADM cycle — ADM Lite is an ArcKit convention over TOGAF ADM (10th Edition, C220)"),
]

# Check 8: the superseded edition is only named as superseded, and the
# non-existent "v3.0" edition label never comes back.
EDITION_TOKEN_RE = re.compile(r"\bC208\b")
EDITION_CONTEXT = ("supersed", 120)
BAD_EDITION_LABEL_RE = re.compile(r"(?:C208|O-AA|Open Agile Architecture)[^\n]{0,60}\bv3\.0\b")

# Check 9: the Version 2.0 coordinate each command must cite, in its command
# file and in its row of the README coverage table.
EXPECTED_COORDINATES: dict[str, str] = {
    "oaa-adm-lite": "Appendix A",
    "product-architecture": "Ch. 12",
    "agile-strategy": "Ch. 5",
    "agile-security": "§14.6.1",
    "agile-governance": "Ch. 7",
}
COVERAGE_ROW_RE = re.compile(r"^\|\s*`([a-z-]+)`\s*\|([^|]*)\|", re.MULTILINE)


def norm(s: str) -> str:
    """Lowercase and unify dash variants for name comparison."""
    return re.sub(r"[—–\-]", "-", s).strip().lower()


def scan_files() -> list[Path]:
    files: set[Path] = set()
    for root in SOURCE_ROOTS:
        if not root.is_dir():
            continue
        files.update(p for p in root.rglob("*.md") if p.name != "CHANGELOG.md")
    fixture_dir = ROOT / "test-oaa-dummy"
    if fixture_dir.is_dir():
        for p in fixture_dir.rglob("*.md"):
            if any(code in p.name for code in OAA_DOC_CODES):
                files.add(p)
    return sorted(files)


def is_name_candidate(name: str) -> bool:
    """True when a captured word chain plausibly names an axiom.

    Excludes tokens like `G216` (single word containing digits) so
    `Axiom 16 / G216` is treated as an un-named citation, not a wrong name.
    """
    words = name.split()
    if len(words) >= 2:
        return True
    return (
        not any(ch.isdigit() for ch in name)
        and len(re.sub(r"[^A-Za-z]", "", name)) >= 4
    )


def _line_of(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def _safe_int(value: str) -> int | None:
    try:
        return int(value)
    except ValueError:
        return None


def check_axiom_citations(path: Path, text: str) -> list[str]:
    failures: list[str] = []
    for m in AXIOM_CITE_RE.finditer(text):
        number = _safe_int(m.group(1))
        if number is None:
            continue
        if number < 1 or number > 16:
            failures.append(
                f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
                f"'Axiom {number}' — O-AA v2.0 Appendix A defines exactly 16 axioms"
            )
            continue
        named = NAME_RE.match(text[m.end() :])
        if not named or not is_name_candidate(named.group(1)):
            continue
        claimed = named.group(1)
        canon = CANON_AXIOMS[number]
        claimed_n, canon_n = norm(claimed), norm(canon)
        if canon_n not in claimed_n and claimed_n not in canon_n:
            failures.append(
                f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
                f"Axiom {number} is named '{claimed}' but the published name is '{canon}'"
            )
    return failures


def check_axiom_table(path: Path, text: str) -> list[str]:
    failures: list[str] = []
    found: dict[int, str] = {}
    for m in TABLE_ROW_RE.finditer(text):
        number = _safe_int(m.group(1))
        if number is None:
            continue
        if 1 <= number <= 16:
            found[number] = m.group(2)
    for number, canon in CANON_AXIOMS.items():
        if number not in found:
            failures.append(
                f"  {path.relative_to(ROOT)}: axioms table missing row for Axiom {number} ({canon})"
            )
        elif norm(found[number]) != norm(canon):
            failures.append(
                f"  {path.relative_to(ROOT)}: axioms table row {number} reads '{found[number]}' "
                f"but the published name is '{canon}'"
            )
    return failures


def check_learning_units(path: Path, text: str) -> list[str]:
    failures = []
    for m in re.finditer(r"learning unit", text, re.IGNORECASE):
        failures.append(
            f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
            f"'Learning Unit' is certification-syllabus vocabulary — cite O-AA v2.0 "
            f"chapters/axioms (and, where useful, 'certification syllabus domain N')"
        )
    return failures


def check_playbook_context(path: Path, text: str) -> list[str]:
    failures = []
    for token, (context, window) in PLAYBOOK_CONTEXT.items():
        for m in re.finditer(re.escape(token), text):
            lo = max(0, m.start() - window)
            hi = min(len(text), m.end() + window)
            if context not in text[lo:hi].lower():
                failures.append(
                    f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
                    f"{token} cited without '{context}' context — "
                    f"G216 is the O-AA Security Playbook, G226 the Agile EA Playbook"
                )
    return failures


def check_chapter_citations(path: Path, text: str) -> list[str]:
    failures = []
    for pattern, reason in STALE_CHAPTER_PATTERNS:
        for m in re.finditer(pattern, text):
            failures.append(
                f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
                f"stale chapter coordinate '{m.group(0).strip()}' — {reason}"
            )
    return failures


def check_edition(path: Path, text: str) -> list[str]:
    """Check 8: name the edition cited; C208 only as the superseded edition."""
    failures = []
    window = EDITION_CONTEXT[1]
    for m in EDITION_TOKEN_RE.finditer(text):
        lo = max(0, m.start() - window)
        hi = min(len(text), m.end() + window)
        if EDITION_CONTEXT[0] not in text[lo:hi].lower():
            failures.append(
                f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
                f"cites C208 — the overlay cites the O-AA Standard, Version 2.0 (C262), "
                f"which supersedes C208; name C208 only as the superseded edition"
            )
    for m in BAD_EDITION_LABEL_RE.finditer(text):
        failures.append(
            f"  {path.relative_to(ROOT)}:{_line_of(text, m.start())} "
            f"'v3.0' matches no O-AA edition — C208 was re-issued in October 2022 "
            f"(Technical Corrigendum U221) and Version 2.0 is C262"
        )
    return failures


def check_command_coordinates(base: Path) -> list[str]:
    """Check 9: each command and its README coverage row cite the v2.0 coordinate."""
    failures: list[str] = []
    label = base.relative_to(ROOT) if base.is_relative_to(ROOT) else Path(str(base))
    for command, coordinate in EXPECTED_COORDINATES.items():
        cmd_path = base / "commands" / f"{command}.md"
        if not cmd_path.is_file():
            failures.append(f"  {label}/commands/{command}.md missing")
            continue
        if coordinate not in cmd_path.read_text(encoding="utf-8"):
            failures.append(
                f"  {label}/commands/{command}.md does not cite its O-AA v2.0 "
                f"coordinate '{coordinate}'"
            )
    readme = base / "README.md"
    if readme.is_file():
        rows = {m.group(1): m.group(2) for m in COVERAGE_ROW_RE.finditer(readme.read_text(encoding="utf-8"))}
        for command, coordinate in EXPECTED_COORDINATES.items():
            cell = rows.get(command)
            if cell is None or coordinate not in cell:
                failures.append(
                    f"  {label}/README.md: coverage table row for `{command}` "
                    f"must cite '{coordinate}' (O-AA v2.0)"
                )
    return failures


def _adm_lite_sets(base: Path) -> dict[str, set[int] | None]:
    """The oaa-adm-lite axiom set as stated in each of the three places.

    ``None`` marks a missing source file. Returns:
      - declared: ``commands/oaa-adm-lite.md`` Axiom Alignment list
      - applied:  ``templates/oaa-adm-lite-template.md`` per-sprint blocks
      - reference: rows of the 16-axiom table whose "Applied by" cell
        names oaa-adm-lite
    """
    out: dict[str, set[int] | None] = {}
    cmd_path = base / "commands" / "oaa-adm-lite.md"
    tpl_path = base / "templates" / "oaa-adm-lite-template.md"
    ref_path = base / "references" / "oaa-reference.md"
    cmd = cmd_path.read_text(encoding="utf-8") if cmd_path.is_file() else None
    tpl = tpl_path.read_text(encoding="utf-8") if tpl_path.is_file() else None
    ref = ref_path.read_text(encoding="utf-8") if ref_path.is_file() else None
    out["declared"] = (
        {int(m.group(1)) for m in ADM_LITE_CITE_RE.finditer(cmd)} if cmd is not None else None
    )
    out["applied"] = (
        {int(m.group(1)) for m in ADM_LITE_CITE_RE.finditer(tpl)} if tpl is not None else None
    )
    refset: set[int] = set()
    if ref is not None:
        for m in APPLIED_BY_RE.finditer(ref):
            if "oaa-adm-lite" in m.group(2):
                refset.add(int(m.group(1)))
    out["reference"] = refset if ref is not None else None
    return out


def check_adm_lite_set_consistency(base: Path) -> list[str]:
    """Check 7: the three oaa-adm-lite axiom-set statements must agree."""
    sets = _adm_lite_sets(base)
    missing = [k for k, v in sets.items() if v is None]
    if missing:
        label = base.relative_to(ROOT) if base.is_relative_to(ROOT) else str(base)
        return [f"  {label}: oaa-adm-lite set check missing file(s) for: {', '.join(missing)}"]
    declared, applied, refset = sets["declared"], sets["applied"], sets["reference"]
    if declared == applied == refset:
        return []

    def fmt(s: set[int]) -> str:
        return "{" + ", ".join(str(n) for n in sorted(s)) + "}"

    label = base.relative_to(ROOT) if base.is_relative_to(ROOT) else str(base)
    return [
        f"  {label}: oaa-adm-lite axiom set drift — command declares {fmt(declared)}, "
        f"template applies {fmt(applied)}, reference 'Applied by' lists {fmt(refset)}"
    ]


def main() -> int:
    files = scan_files()
    if not files:
        print(
            "ERROR: no OAA content files found — scan roots missing?", file=sys.stderr
        )
        return 1

    reference = None
    failures: list[str] = []
    checked = 0
    for path in files:
        text = path.read_text(encoding="utf-8")
        checked += 1
        rel = path.relative_to(ROOT)
        if rel == Path("plugins/arckit-oaa/references/oaa-reference.md"):
            reference = (path, text)
        failures.extend(check_axiom_citations(path, text))
        failures.extend(check_learning_units(path, text))
        failures.extend(check_playbook_context(path, text))
        failures.extend(check_chapter_citations(path, text))
        failures.extend(check_edition(path, text))

    if reference is None:
        failures.append("  plugins/arckit-oaa/references/oaa-reference.md not found")
    else:
        failures.extend(check_axiom_table(*reference))

    for base in SOURCE_ROOTS:
        if base.is_dir():
            failures.extend(check_adm_lite_set_consistency(base))
            failures.extend(check_command_coordinates(base))

    if failures:
        print(f"FAIL: {len(failures)} O-AA Standard integrity problem(s):", file=sys.stderr)
        print("\n".join(failures), file=sys.stderr)
        print(
            "\nFix: cite the O-AA Standard, Version 2.0 (C262): the 16 published "
            "axioms by number and name (Appendix A) and the v2.0 chapter coordinates "
            "(Ch. 5 Agile Strategy, Ch. 7 Agile Governance, Ch. 12 Product "
            "Architecture, Axiom 16 + §14.6.1 security), and drop 'Learning Unit' "
            "phrasing. See plugins/arckit-oaa/references/oaa-reference.md for the "
            "canonical list and the C208-to-v2.0 map.",
            file=sys.stderr,
        )
        return 1

    print(
        f"OK: O-AA Standard v2.0 (C262) axiom/chapter integrity — {checked} files "
        f"checked, {len(CANON_AXIOMS)}-axiom table consistent, no fabricated citations, "
        f"no stale chapter coordinates, edition named, command coordinates cited, "
        f"oaa-adm-lite axiom set consistent."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
