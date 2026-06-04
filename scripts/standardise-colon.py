#!/usr/bin/env python3
"""One-shot: standardise ArcKit command references on the colon form.

Converts `/arckit.<command>` -> `/arckit:<command>` (the official Claude Code
plugin invocation syntax) across hand-authored source files.

Safety rules:
- Only the FIRST separator after `arckit` is rewritten, so Wardley sub-commands
  like `/arckit.wardley.gameplay` correctly become `/arckit:wardley.gameplay`
  (colon after arckit, dot kept before the sub-command).
- A negative lookbehind for word-char or slash means file PATHS such as
  `commands/arckit.foo.md` or `.claude/commands/arckit.bar.md` are left alone —
  only standalone slash-command references are rewritten. Mirrors the regex the
  converter already uses (scripts/converter.py rewrite_codex_skills).
- `$arckit-X` (Codex) and `/arckit-X` (Copilot) forms contain no dot and are
  untouched.

Mirrors/generated outputs are NOT edited here; run scripts/converter.py after
this to regenerate them from the converted sources.

Usage:  python scripts/standardise-colon.py [--apply]   (default: dry run)
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Authored source roots to process (relative to repo root).
INCLUDE_DIRS = [
    "arckit-claude/templates",
    "arckit-claude/commands",
    "arckit-claude/agents",
    "arckit-claude/skills",
    "arckit-claude/references",
    "arckit-claude/docs",
    "arckit-au/commands", "arckit-au/templates", "arckit-au/recipes",
    "arckit-au-energy/commands", "arckit-au-energy/templates", "arckit-au-energy/recipes",
    "arckit-ca/commands", "arckit-ca/templates", "arckit-ca/recipes",
    "arckit-eu/commands", "arckit-eu/templates", "arckit-eu/recipes",
    "arckit-fr/commands", "arckit-fr/templates", "arckit-fr/recipes",
    "arckit-at/commands", "arckit-at/templates", "arckit-at/recipes",
    "arckit-uae/commands", "arckit-uae/templates", "arckit-uae/recipes",
    "arckit-us/commands", "arckit-us/templates", "arckit-us/recipes",
    "arckit-uk-finance/commands", "arckit-uk-finance/templates", "arckit-uk-finance/recipes",
    "arckit-uk-nhs/commands", "arckit-uk-nhs/templates", "arckit-uk-nhs/recipes",
    ".arckit/templates",
    "scripts/bash",
    "scripts/python",
    "docs",
]

# Individual authored files.
INCLUDE_FILES = ["README.md", "CLAUDE.md"]

# Never touch these (history / published prose / generated extension mirrors).
EXCLUDE_PREFIXES = [
    "CHANGELOG.md",
    "arckit-claude/CHANGELOG.md",
    "docs/articles/",
    "docs/proposals/",
    "docs/superpowers/",
    "docs/pitch-decks/",
    ".arckit/memory/",
    "node_modules/", ".git/",
    "scripts/converter.py",        # community-rewrite literals patched by hand
    "scripts/standardise-colon.py",
]

TEXT_EXT = {".md", ".html", ".txt", ".xml", ".sh", ".py", ".json",
            ".yaml", ".yml", ".toml", ".mjs", ".ts", ".js"}

# colon after `arckit`, only the first segment; path-safe lookbehind.
PATTERN = re.compile(r"(?<![\w/])/arckit\.([a-z][\w-]*)")


def excluded(rel):
    return any(rel == p or rel.startswith(p) for p in EXCLUDE_PREFIXES)


def candidate_files():
    """All tracked text files (comprehensive); excludes applied in main()."""
    import subprocess
    out = subprocess.run(
        ["git", "ls-files"], cwd=REPO, capture_output=True, text=True, check=True
    ).stdout
    return sorted(out.splitlines())


def main():
    apply = "--apply" in sys.argv
    check = "--check" in sys.argv
    total_files = 0
    total_subs = 0
    for rel in candidate_files():
        if excluded(rel):
            continue
        if os.path.splitext(rel)[1] not in TEXT_EXT:
            continue
        path = os.path.join(REPO, rel)
        if not os.path.isfile(path):
            continue
        with open(path, "r", encoding="utf-8") as fh:
            content = fh.read()
        new, n = PATTERN.subn(r"/arckit:\1", content)
        if n:
            total_files += 1
            total_subs += n
            print(f"{n:5d}  {rel}")
            if apply:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(new)
    if check:
        if total_subs:
            print(
                f"\nFAIL: {total_subs} dot-form command reference(s) in "
                f"{total_files} file(s). Use the colon form `/arckit:<command>` "
                f"(run: python scripts/standardise-colon.py --apply)."
            )
            sys.exit(1)
        print("OK: no dot-form command references found.")
        return
    mode = "APPLIED" if apply else "DRY RUN (use --apply)"
    print(f"\n{mode}: {total_subs} substitutions across {total_files} files")


if __name__ == "__main__":
    main()
