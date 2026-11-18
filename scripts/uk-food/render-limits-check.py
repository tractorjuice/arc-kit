#!/usr/bin/env python3
"""Render the UK food overlay's limits.json as a check sheet for reading against the PDF.

Maintainer tool. The output is for a person to tick off against the pack page by
page; it is never committed.

    python3 scripts/uk-food/render-limits-check.py [--pdf PATH] DATA_DIR OUT

One table row per limit, grouped by section in page order: the value, the FSA
sentence it comes from, the safe method's title and identifier, and the page.
--pdf names the PDF as the reader has it; source.json holds the FSA's own file
name, which lacks the "01-" prefix of the owner's copy.
"""
import argparse
import json
from pathlib import Path, PurePosixPath

DEFAULT_PDF = "~/Documents/ArcKit/food-safety-overlay/sfbb-caterers/01-sfbb-caterers-pack-fixed_0_3.pdf"
SECTIONS = ["XC", "CL", "CH", "CK", "MG"]
PARTS = {"front": "Front matter", "diary": "Diary"}
# Figures the pack prints differently in two places: (value, phrase, phrase). Each phrase picks out the
# limits with that value whose text holds it; the note takes their pages from limits.json, and rendering
# stops if a phrase picks out none.
PRINTED_DIFFERENTLY = [
    ("63°C", "keep it above 63°C", "kept at 63°C or above"),
    ("3 days", "High risk ready to eat foods", "Ready-to-eat foods"),
]


def _load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def _cell(text: str) -> str:
    return text.replace("|", "\\|")


def _pages(numbers) -> str:
    numbers = sorted(set(numbers))
    if len(numbers) == 1:
        return f"page {numbers[0]}"
    return "pages " + ", ".join(map(str, numbers[:-1])) + f" and {numbers[-1]}"


def printed_differently(limits: list[dict]) -> str:
    """The note on figures the pack prints differently, with each phrase's pages from the limits."""
    notes = []
    for value, *phrases in PRINTED_DIFFERENTLY:
        quoted = []
        for phrase in phrases:
            pages = [limit["page"] for limit in limits if limit["value"] == value and phrase in limit["text"]]
            if not pages:
                raise SystemExit(f"render-limits-check.py: no limit with value {value!r} holds {phrase!r}")
            quoted.append(f'"{phrase}" ({_pages(pages)})')
        notes.append(f"{value}, " + " against ".join(quoted))
    return "; ".join(notes)


def render(data_dir: Path, pdf: str = DEFAULT_PDF) -> str:
    source = _load(data_dir / "source.json")
    limits = _load(data_dir / "limits.json")["limits"]
    groups = {"front": (PARTS["front"], {"front": PARTS["front"]})}
    for section_id in SECTIONS:
        section = _load(data_dir / f"{section_id}.json")
        titles = {method["id"]: method["title"] for method in section["methods"]}
        groups[section_id] = (f"{section['section']['title']} ({section_id})", titles)
    groups["diary"] = (PARTS["diary"], {"diary": PARTS["diary"]})
    cooking = [limit for limit in limits if limit["method"] == "CK-01"]
    path = PurePosixPath(pdf)

    lines = [
        "# Limits to check against the PDF",
        "",
        f"This lists the numeric figures and named standards in the FSA pack *{source['title']}*, each in the"
        f" place it is printed. Read it against `{path.name}` in `{path.parent}/` page by page, and check that"
        " each value and FSA sentence is printed on that page exactly as shown, raised zeros (\u2070) included.",
        "",
        "- It is not a list of every frequency the pack states in words, such as filling in the diary every day,"
        " doing the opening checks at the beginning of the day, or the daily and weekly columns of the cleaning"
        " schedule.",
        "- A quantity is listed only where the pack prints it as a figure. The two stage clean is printed with a"
        " figure once, on page 17, which is listed, and in words on pages 18, 31, 32 and 33, which are not.",
        "- Where several rows on one page show the same sentence, it is because that sentence holds more than one"
        " figure.",
        f"- The {len(cooking)} rows for CK-01, on {_pages(l['page'] for l in cooking)}, are the pack's examples of"
        " safe time and temperature combinations for cooking, printed together under that heading.",
        "- \"Page\" is the page of the PDF file, counting the cover as page 1: the pack prints no page numbers.",
        "- Printed differently in two places, so these rows are as printed and not transcription slips: "
        f"{printed_differently(limits)}.",
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


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="render-limits-check.py",
                                     description="Render limits.json as a check sheet for reading against the PDF.")
    parser.add_argument("--pdf", default=DEFAULT_PDF, help=f"the PDF as the reader has it (default: {DEFAULT_PDF})")
    parser.add_argument("data_dir", metavar="DATA_DIR", type=Path)
    parser.add_argument("out", metavar="OUT", type=Path)
    args = parser.parse_args(argv)
    args.out.write_text(render(args.data_dir, args.pdf), encoding="utf-8")
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
