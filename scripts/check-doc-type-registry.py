#!/usr/bin/env python3
"""Assert every doc-type code referenced anywhere resolves against the registry.

`plugins/arckit-claude/config/doc-types.mjs` is the single source of truth for
doc-type codes. Three other places name codes independently, and each drifts
silently in its own way:

  1. Recipe `output.type` values (`plugins/arckit-*/recipes/*.yaml` and
     `plugins/arckit-claude/skills/arckit-build/recipes/*.yaml`).
     `output.type` keys `.arckit/state.json`, so an unregistered code does not
     block a write -- it produces a state key that `--resume` and `--target`
     cannot match, and a build target that cannot be validated.

  2. `ARC-{PID}-{CODE}-v` filenames written by commands and agents
     (`plugins/*/commands/*.md`, `plugins/*/agents/*.md`).
     This one is fatal: `validate-arc-filename.mjs` is a PreToolUse hook that
     BLOCKS any write whose code is not in KNOWN_TYPES, and the command has no
     conforming name to fall back to. The command is simply unusable.

  3. The `/arckit:pages` known-artifact-types table inside
     `plugins/arckit-claude/commands/pages.md` -- the dual registration that
     doc-types.mjs's header warns about. A code missing there is omitted from
     the rendered dashboard sidebar even though the manifest records it.

This gate exists because that drift shipped. #712 found `/arckit:glossary`
writing `ARC-{P}-GLOS-v1.0.md` with no `GLOS` in the registry, so every run was
blocked by the hook, plus three different spellings of the same missing code
(`GLOS`, `GLO`, `GLOSS`) across seven recipes in four plugins. `/arckit:framework`
was broken the same way via an unregistered `FWRK`. #545 was the same class of
bug one registry over (`regime: 'US'` missing from `REGIMES`).

Exit 0 when every reference resolves, 1 otherwise.
"""

from __future__ import annotations

import glob
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MJS = ROOT / "plugins/arckit-claude/config/doc-types.mjs"
PAGES = ROOT / "plugins/arckit-claude/commands/pages.md"

# Recipe target `output.type` values that deliberately name no registered
# doc-type. These targets invoke commands that write filenames outside the
# ARC-* convention entirely, so there is nothing to register; the value is an
# informational state.json key only. Keep this list short and justified -- an
# entry here silences a real gate.
NOT_A_DOC_TYPE = {
    # uk-nhs-clinical-safety.yaml: the DCB0129/DCB0160 commands write
    # Marcus-conventioned filenames under clinical-safety/, which carry no
    # ARC- prefix and therefore no doc-type code. The recipe says so inline.
    "NHSCSCR",
    "NHSDCSC",
}

# Tokens that occupy the code position in an `ARC-...-{X}-v` pattern but are
# placeholders or prose, not doc-type codes.
NOT_A_CODE_IN_PROSE = {
    # Multi-instance sequence placeholder: ARC-{P}-GRNT-NN-vN.N.md
    "NN",
    "NNN",
    # sobc.md names the later Green Book business-case stages as future work:
    # "Later stages will be: ARC-{PID}-OBC-v*.md, ARC-{PID}-FBC-v*.md".
    # Neither command exists yet, so neither code is registered.
    "OBC",
    "FBC",
    # uk-nhs-dcb0129.md / uk-nhs-dcb0160.md mention these codes only inside a
    # negation: the DCB Document ID "should be the literal filename ... NOT an
    # ARC-NNN-CSCR-vX.Y identifier". The Marcus convention is deliberate, so
    # there is nothing to register.
    "CSCR",
    "DSCR",
}

errors: list[str] = []


def load_registry() -> tuple[set[str], set[str]]:
    """Return (DOC_TYPES keys, SUBDIR_MAP keys) parsed from doc-types.mjs.

    Regex rather than a node subprocess: this must run in CI without assuming a
    node toolchain, and the file is a flat object literal.
    """
    text = MJS.read_text()

    def block(export_name: str, open_char: str, close_char: str) -> str:
        start = text.index(f"export const {export_name} = ")
        depth = 0
        for i in range(start, len(text)):
            if text[i] == open_char:
                depth += 1
            elif text[i] == close_char:
                depth -= 1
                if depth == 0:
                    return text[start : i + 1]
        raise ValueError(f"unterminated {export_name} block in {MJS}")

    doc_types = set(re.findall(r"^\s*'([A-Z0-9-]+)':\s*\{", block("DOC_TYPES", "{", "}"), re.M))
    subdirs = set(re.findall(r"^\s*([A-Z0-9-]+):\s*'", block("SUBDIR_MAP", "{", "}"), re.M))
    return doc_types, subdirs


def recipe_paths() -> list[str]:
    return sorted(
        glob.glob(str(ROOT / "plugins/arckit-*/recipes/*.yaml"))
        + glob.glob(str(ROOT / "plugins/arckit-claude/skills/arckit-build/recipes/*.yaml"))
    )


def check_recipe_types(known: set[str]) -> int:
    """Every `output.type` in every recipe resolves, or is declared exempt."""
    checked = 0
    # Match the code inside an inline `output: { ... type: CODE ... }` mapping
    # as well as a block-style `type: CODE` nested under `output:`.
    pat = re.compile(r"\btype:\s*([A-Za-z0-9][A-Za-z0-9-]*)")
    for path in recipe_paths():
        rel = Path(path).relative_to(ROOT)
        for lineno, line in enumerate(Path(path).read_text().splitlines(), 1):
            if "output:" not in line and "type:" not in line:
                continue
            # Only consider type: values that sit on an output mapping line.
            if "output:" not in line:
                continue
            m = pat.search(line)
            if not m:
                continue
            code = m.group(1)
            checked += 1
            if code in known or code in NOT_A_DOC_TYPE:
                continue
            hint = suggest(code, known)
            errors.append(
                f"{rel}:{lineno}: recipe output.type {code!r} is not in DOC_TYPES{hint}"
            )
    return checked


def check_command_codes(known: set[str]) -> int:
    """Every ARC-*-CODE-v filename in a command or agent body resolves.

    Unregistered codes here are fatal at runtime: validate-arc-filename.mjs
    blocks the write outright.
    """
    checked = 0
    # ARC-<pid-or-placeholder>-<CODE>-v...  CODE may be compound (PRIN-COMP).
    pat = re.compile(r"ARC-[A-Za-z0-9{}\[\]_-]*?-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-v")
    sources = sorted(
        glob.glob(str(ROOT / "plugins/*/commands/*.md"))
        + glob.glob(str(ROOT / "plugins/*/agents/*.md"))
    )
    for path in sources:
        rel = Path(path).relative_to(ROOT)
        for lineno, line in enumerate(Path(path).read_text().splitlines(), 1):
            # A line may name the same code twice ("`ARC-001-GLOS-v1.0` (for
            # filename: `ARC-001-GLOS-v1.0.md`)"); report it once.
            for code in dict.fromkeys(pat.findall(line)):
                # A compound match may be a registered compound code, or a
                # registered simple code followed by a placeholder segment.
                if code in known or code in NOT_A_CODE_IN_PROSE:
                    checked += 1
                    continue
                head = code.rsplit("-", 1)
                if len(head) == 2 and head[0] in known and head[1] in NOT_A_CODE_IN_PROSE:
                    checked += 1
                    continue
                checked += 1
                hint = suggest(code, known)
                errors.append(
                    f"{rel}:{lineno}: writes ARC-*-{code}-v* but {code!r} is not in "
                    f"DOC_TYPES -- validate-arc-filename.mjs will BLOCK this write{hint}"
                )
    return checked


def check_pages_parity(known: set[str]) -> int:
    """The /arckit:pages known-types table must list exactly the registry."""
    rows = set(
        re.findall(r"^\|\s*\|\s*([A-Z][A-Z0-9-]*)\s*\|\s*`ARC-", PAGES.read_text(), re.M)
    )
    rel = PAGES.relative_to(ROOT)
    for code in sorted(known - rows):
        errors.append(
            f"{rel}: DOC_TYPES has {code!r} but the known-artifact-types table does "
            f"not -- /arckit:pages will omit it from the dashboard sidebar"
        )
    for code in sorted(rows - known):
        errors.append(
            f"{rel}: known-artifact-types table lists {code!r}, which is not in DOC_TYPES"
        )
    return len(rows)


def suggest(code: str, known: set[str]) -> str:
    """Point at the most likely intended code, when one is obvious."""
    candidates = [k for k in known if k.startswith(code) or code.startswith(k)]
    if not candidates:
        return ""
    return f" (did you mean {' or '.join(sorted(candidates))}?)"


def main() -> int:
    known, _subdirs = load_registry()
    n_recipe = check_recipe_types(known)
    n_cmd = check_command_codes(known)
    n_pages = check_pages_parity(known)

    if errors:
        print(f"FAIL: {len(errors)} doc-type registry error(s):", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        print(
            "\nFix by registering the code in "
            "plugins/arckit-claude/config/doc-types.mjs AND adding a row to the "
            "known-artifact-types table in plugins/arckit-claude/commands/pages.md, "
            "or by correcting the reference to an existing code.",
            file=sys.stderr,
        )
        return 1

    print(
        f"Doc-type registry OK: {len(known)} registered codes; "
        f"{n_recipe} recipe output.type, {n_cmd} command/agent filename, "
        f"{n_pages} pages.md table reference(s) all resolve."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
