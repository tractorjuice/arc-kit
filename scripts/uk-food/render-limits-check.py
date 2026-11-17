#!/usr/bin/env python3
"""Render the UK food overlay's limits.json as a check sheet for reading against the PDF.

Maintainer tool. The output is for a person to tick off against the pack page by
page; it is never committed.

    python3 scripts/uk-food/render-limits-check.py DATA_DIR OUT

One table row per limit, grouped by section in page order: the value, the FSA
sentence it comes from, the safe method's title and identifier, and the page.
"""
import json
import sys
from pathlib import Path

SECTIONS = ["XC", "CL", "CH", "CK", "MG"]
PARTS = {"front": "Front matter", "diary": "Diary"}


def _load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def _cell(text: str) -> str:
    return text.replace("|", "\\|")


def render(data_dir: Path) -> str:
    source = _load(data_dir / "source.json")
    limits = _load(data_dir / "limits.json")["limits"]
    groups = {"front": (PARTS["front"], {"front": PARTS["front"]})}
    for section_id in SECTIONS:
        section = _load(data_dir / f"{section_id}.json")
        titles = {method["id"]: method["title"] for method in section["methods"]}
        groups[section_id] = (f"{section['section']['title']} ({section_id})", titles)
    groups["diary"] = (PARTS["diary"], {"diary": PARTS["diary"]})

    lines = [
        "# Limits to check against the PDF",
        "",
        f"For reading against `{source['file']}` page by page: each row is a figure the overlay takes from the pack.",
        "Check that the value and the FSA sentence are printed on that page exactly as shown, raised zeros (\u2070) included.",
    ]
    for key, (heading, titles) in groups.items():
        rows = sorted((limit for limit in limits if (limit["method"] if limit["method"] in PARTS
                                                     else limit["method"][:2]) == key),
                      key=lambda limit: limit["page"])
        if not rows:
            continue
        lines += ["", f"## {heading}", "", "| Value | FSA sentence | Safe method | Page |", "| --- | --- | --- | --- |"]
        for limit in rows:
            method = f"{titles[limit['method']]} ({limit['method']})"
            lines.append(f"| {_cell(limit['value'])} | {_cell(limit['text'])} | {_cell(method)} | {limit['page']} |")
    return "\n".join(lines) + "\n"


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: render-limits-check.py DATA_DIR OUT", file=sys.stderr)
        return 2
    Path(argv[2]).write_text(render(Path(argv[1])), encoding="utf-8")
    print(f"wrote {argv[2]}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
