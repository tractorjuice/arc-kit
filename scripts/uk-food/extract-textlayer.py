#!/usr/bin/env python3
"""Extract the text layer of the FSA SFBB caterers pack to a JSON fixture.

Maintainer tool. The PDF is never committed; the fixture (words only) is.

    uv run --no-project --with pymupdf python -I scripts/uk-food/extract-textlayer.py PDF OUT

Words are written in reading order, exactly as PyMuPDF's get_text("words")
returns them, with no normalisation.
"""
import hashlib
import json
import sys
from pathlib import Path


def extract(pdf_path: Path) -> dict:
    import pymupdf as fitz

    data = pdf_path.read_bytes()
    pages = {}
    with fitz.open(stream=data, filetype="pdf") as doc:
        for number, page in enumerate(doc, start=1):
            words = page.get_text("words")
            pages[str(number)] = [w[4] for w in words]
        count = doc.page_count
    return {
        "source": {
            "file": pdf_path.name,
            "sha256": hashlib.sha256(data).hexdigest(),
            "pages": count,
        },
        "pages": pages,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: extract-textlayer.py PDF OUT", file=sys.stderr)
        return 2
    result = extract(Path(argv[1]))
    Path(argv[2]).write_text(
        json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    total = sum(len(w) for w in result["pages"].values())
    print(f"{result['source']['pages']} pages, {total} words")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
