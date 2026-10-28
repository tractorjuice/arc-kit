#!/usr/bin/env python3
"""Show overlay commands on arckit.org under the names Claude Code gives them.

In Claude Code each community overlay is its own plugin, so its commands carry
the plugin's name: the command is `/arckit-uae:uae-pdpl`, and `/arckit:uae-pdpl`
gets "Unknown skill". Core commands keep `/arckit:<command>`. The site showed
every overlay command in the bare form until arc-kit#982.

The sources keep `/arckit:<command>`, because scripts/converter.py builds every
other runtime's form from it, and scripts/claude_command_namespacing.py rewrites
them when the plugins are published. That module is the one map of which
plugin owns which command; this applies the same rewrite to the site:

  scripts/generate-site-pages.py calls claude_code_names() on the pages it
  writes, docs/guide/ and docs/share/, film labels from
  docs/assets/guide-films.json included.

  Run as a script, this rewrites the hand-written pages in place: every tracked
  docs/**/*.html that generate-site-pages.py does not write, plus docs/llms.txt
  and docs/manifest.json.

Left as they are:

  alt text, and og:image:alt, which say what an image shows;
  docs/on-github.html, whose lists quote other repositories' READMEs and commits;
  the Markdown the site also serves (docs/guides/, docs/articles/,
  docs/README.md and the like), which is the source;
  other runtimes' forms ($arckit-X, /arckit-X, /skill:arckit-X), which never match.

    python3 scripts/site_command_names.py          # rewrite the hand-written pages
    python3 scripts/site_command_names.py --check  # exit 1 if any shows a bare overlay command

Run it before scripts/generate-site-pages.py, which dates each hand-written
sitemap entry by its text.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from claude_command_namespacing import command_namespaces, invocation_pattern, rewrite  # noqa: E402

REPO = Path(__file__).resolve().parents[1]

NAMESPACES = command_namespaces(REPO)
PATTERN = invocation_pattern(NAMESPACES)

# Text that describes an image says what the image shows, so it keeps the name
# the image shows.
KEEP_RE = re.compile(r'(\balt="[^"]*"|<meta property="og:image:alt" content="[^"]*")')

# Pages scripts/generate-site-pages.py writes, which it rewrites as it renders them.
GENERATED_DIRS = ("docs/guide/", "docs/share/")

# docs/on-github.html: its lists quote other repositories' text.
# docs/plans/: maintainer notes, which _config.yml keeps off the site.
NOT_REWRITTEN = ("docs/on-github.html", "docs/plans/")

EXTRA_FILES = ("docs/llms.txt", "docs/manifest.json")


def claude_code_names(text: str) -> str:
    """`/arckit:uae-pdpl` -> `/arckit-uae:uae-pdpl`, outside alt text. Core commands never match."""
    parts = KEEP_RE.split(text)
    return "".join(part if i % 2 else rewrite(part, PATTERN, NAMESPACES) for i, part in enumerate(parts))


def bare_mentions(text: str) -> list[str]:
    """Overlay commands written `/arckit:<command>` outside alt text."""
    if PATTERN is None:
        return []
    return [m.group(0) for i, part in enumerate(KEEP_RE.split(text)) if not i % 2 for m in PATTERN.finditer(part)]


def hand_written_pages(repo: Path = REPO) -> list[Path]:
    out = subprocess.run(["git", "ls-files", "-z", "docs"], cwd=repo, capture_output=True, text=True, check=True).stdout
    pages = []
    for name in sorted(filter(None, out.split("\0"))):
        if name.startswith(GENERATED_DIRS + NOT_REWRITTEN):
            continue
        if name.endswith(".html") or name in EXTRA_FILES:
            pages.append(repo / name)
    return pages


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--check", action="store_true", help="report pages to rewrite and exit 1 instead of writing")
    args = parser.parse_args()

    stale = []
    for path in hand_written_pages():
        if not path.is_file():
            continue
        text = path.read_bytes().decode("utf-8")
        found = bare_mentions(text)
        if not found:
            continue
        stale.append(f"{path.relative_to(REPO)}: {len(found)} ({', '.join(sorted(set(found))[:3])}{', ...' if len(set(found)) > 3 else ''})")
        if not args.check:
            path.write_bytes(claude_code_names(text).encode("utf-8"))

    if args.check:
        if stale:
            print("Overlay commands shown in the bare /arckit:<command> form. Run: python3 scripts/site_command_names.py")
            for line in stale:
                print(f"  ✗ {line}")
            return 1
        print("Site pages show overlay commands under their Claude Code names.")
        return 0
    print(f"Rewrote {len(stale)} page(s)." + "".join(f"\n  {line}" for line in stale))
    return 0


if __name__ == "__main__":
    sys.exit(main())
