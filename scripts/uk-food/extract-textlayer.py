#!/usr/bin/env python3
"""Extract the text layer of the FSA SFBB caterers pack to a JSON fixture.

Maintainer tool. The PDF is never committed; the fixture (words only) is.

    uv run --no-project --with pymupdf python -I scripts/uk-food/extract-textlayer.py PDF OUT [SOURCE]

SOURCE is the data's source.json. The committed fixture holds the pack's whole
text, so its `source` says where that text comes from and under what licence it
is reused: the title, publisher, address, licence and attribution line are
copied from SOURCE, beside the file's name, checksum and page count read from
the PDF. Give SOURCE whenever the output is to be committed; a test holds the
committed fixture to it. Without SOURCE (a working copy of another PDF, never
committed) the output's `source` holds only what was read from the PDF.

Words are written in reading order, exactly as PyMuPDF's get_text("words")
returns them, with no normalisation.
"""
import hashlib
import json
import sys
from pathlib import Path

# What the fixture's `source` takes from the data's source.json.
ATTRIBUTED = ("title", "publisher", "url", "licence", "attribution")


def describe_source(file_name: str, sha256: str, pages: int, declared: dict) -> dict:
    """The fixture's `source`: the PDF as read, then where it comes from and its licence."""
    missing = [key for key in ATTRIBUTED if not declared.get(key)]
    if missing:
        raise ValueError(f"the source file gives no {', '.join(missing)}")
    return {"file": file_name, "sha256": sha256, "pages": pages, **{key: declared[key] for key in ATTRIBUTED}}


def extract(pdf_path: Path, declared: dict | None = None) -> dict:
    import pymupdf as fitz

    data = pdf_path.read_bytes()
    pages = {}
    with fitz.open(stream=data, filetype="pdf") as doc:
        for number, page in enumerate(doc, start=1):
            words = page.get_text("words")
            pages[str(number)] = [w[4] for w in words]
        count = doc.page_count
    sha256 = hashlib.sha256(data).hexdigest()
    source = ({"file": pdf_path.name, "sha256": sha256, "pages": count} if declared is None
              else describe_source(pdf_path.name, sha256, count, declared))
    return {"source": source, "pages": pages}


def main(argv: list[str]) -> int:
    if len(argv) not in (3, 4):
        print("usage: extract-textlayer.py PDF OUT [SOURCE]", file=sys.stderr)
        return 2
    declared = json.loads(Path(argv[3]).read_text(encoding="utf-8")) if len(argv) == 4 else None
    result = extract(Path(argv[1]), declared)
    Path(argv[2]).write_text(
        json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    total = sum(len(w) for w in result["pages"].values())
    print(f"{result['source']['pages']} pages, {total} words")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
