#!/usr/bin/env python3
"""Guard: O-AA C208 content integrity for the OAA plugin.

C208 (The Open Group, "The O-AA Standard", v3.0 Oct 2022) Chapter 9 defines
16 *named* axioms. The OAA plugin previously shipped fabricated axiom
quotes ("Axiom 2: Strategy must shape..."), a C208 chapter map that does not
exist in the standard, and "Learning Unit" scoping that C208 never uses.

This guard blocks that defect class. It checks:

  1. every ``Axiom N`` citation uses a published number (1-16)
  2. a *named* ``Axiom N`` citation (name following the number) names the
     published axiom — a wrong name for a number is a fabrication
  3. the 16-axiom table in ``references/oaa-reference.md`` matches the
     canonical name list exactly
  4. no "Learning Unit" phrasing remains (certification-syllabus vocabulary,
     not C208's — the standard's content is chapters and axioms)
  5. G216 (O-AA Security Playbook) and G226 (Agile EA Playbook) are cited in
     the right context
  6. no stale C208 chapter coordinates remain — the pre-v3.0-era mapping
     (Chapter 10 = Strategy, 12 = Product Architecture, 17 = Security,
     18 = Governance, "Chapters 1–9" = ADM) does not exist in C208 v3.0;
     the verified coordinates are Ch. 11 (Agile Strategy), Ch. 14
     (Product Architecture), Ch. 4.6 + Axiom 16 + G216 (security),
     Ch. 8 (Agile Governance), with ADM Lite as an ArcKit convention over
     TOGAF ADM (C182), not a C208 chapter range

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

# The 16 published axioms, C208 Ch. 9 (§9.1-§9.16).
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

# Stale C208 chapter coordinates. Each pattern is number+topic (or exact
# table-cell form) so a legitimate citation of C208's *real* Chapter 10/12
# (Part 2 building blocks, Ch. 10–22) can never false-positive.
STALE_CHAPTER_PATTERNS: list[tuple[str, str]] = [
    (r"(?:Chapter|Ch\.?)\s?10[—–\- ]+Strategy", "Agile Strategy is C208 Ch. 11"),
    (r"(?:Chapter|Ch\.?)\s?10\s?\(Strategy\)", "Agile Strategy is C208 Ch. 11"),
    (
        r"(?:Chapter|Ch\.?)\s?12[—–\- ]+Product Architecture",
        "Product Architecture is C208 Ch. 14",
    ),
    (r"(?:Chapter|Ch\.?)\s?12\s?\(Product Architecture\)", "Product Architecture is C208 Ch. 14"),
    (r"(?:Chapter|Ch\.?)\s?17[—–\- ]+Security", "C208 has no dedicated security chapter — use Ch. 4.6 + Axiom 16 + G216"),
    (r"(?:Chapter|Ch\.?)\s?17\s?\(Security\)", "C208 has no dedicated security chapter — use Ch. 4.6 + Axiom 16 + G216"),
    (r"(?:Chapter|Ch\.?)\s?18[—–\- ]+Governance", "Agile Governance is C208 Ch. 8"),
    (r"(?:Chapter|Ch\.?)\s?18\s?\(Governance\)", "Agile Governance is C208 Ch. 8"),
    (r"\|\s*Ch\.?\s?10\s?\|", "stale C208 chapter cell in the OAA coverage table"),
    (r"\|\s*Ch\.?\s?1[278]\s?\|", "stale C208 chapter cell in the OAA coverage table"),
    (r"Chapters? 1[–\-]9", "C208 does not define an ADM cycle — ADM Lite is an ArcKit convention over TOGAF ADM (C182)"),
    (r"\bCh\.?\s?1[–\-]9\b", "C208 does not define an ADM cycle — ADM Lite is an ArcKit convention over TOGAF ADM (C182)"),
]


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
                f"'Axiom {number}' — C208 Ch. 9 defines exactly 16 axioms (§9.1-§9.16)"
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
            f"'Learning Unit' is certification-syllabus vocabulary — cite C208 "
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
                f"stale C208 coordinate '{m.group(0).strip()}' — {reason}"
            )
    return failures


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

    if reference is None:
        failures.append("  plugins/arckit-oaa/references/oaa-reference.md not found")
    else:
        failures.extend(check_axiom_table(*reference))

    if failures:
        print(f"FAIL: {len(failures)} O-AA C208 integrity problem(s):", file=sys.stderr)
        print("\n".join(failures), file=sys.stderr)
        print(
            "\nFix: cite the 16 published axioms by name (C208 Ch. 9), the verified "
            "C208 v3.0 chapter coordinates (Ch. 11/14/4.6/8), and drop 'Learning Unit' "
            "phrasing. See plugins/arckit-oaa/references/oaa-reference.md for the "
            "canonical list.",
            file=sys.stderr,
        )
        return 1

    print(
        f"OK: O-AA C208 axiom/chapter integrity — {checked} files checked, "
        f"{len(CANON_AXIOMS)}-axiom table consistent, no fabricated citations, "
        f"no stale chapter coordinates."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
