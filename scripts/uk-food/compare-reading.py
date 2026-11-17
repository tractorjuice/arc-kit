#!/usr/bin/env python3
"""Compare a data file with an independent plain-text reading of the same section.

    python3 scripts/uk-food/compare-reading.py DATA_JSON READING_TXT

The reading has one table cell or paragraph per line; lines starting with # are
headings and are ignored. After the same word-by-word normalisation the test
suite uses, this reports (a) every page-text string in DATA_JSON with no
matching line, and (b) every reading line that matches no data string.
Exit 0 when both lists are empty, 1 otherwise, 2 on a usage error.
"""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from textlayer import string_key, strings_of  # noqa: E402


def compare(data: dict, reading: str):
    """Return (unmatched data strings, unmatched reading lines)."""
    by_key: dict[str, list[tuple[int, str, str | None]]] = defaultdict(list)
    for page, text, method in strings_of(data):
        key = string_key(text)
        if key:
            by_key[key].append((page, text, method))
    lines: Counter = Counter()
    originals: dict[str, str] = {}
    for line in reading.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key = string_key(line)
        if key:
            lines[key] += 1
            originals.setdefault(key, line.strip())
    missing_from_reading = []
    for key, items in by_key.items():
        spare = len(items) - lines.get(key, 0)
        if spare > 0:
            missing_from_reading.extend(items[-spare:])
    extra_in_reading = []
    for key, count in lines.items():
        spare = count - len(by_key.get(key, []))
        extra_in_reading.extend([originals[key]] * max(spare, 0))
    return missing_from_reading, extra_in_reading


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: compare-reading.py DATA_JSON READING_TXT", file=sys.stderr)
        return 2
    data = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    reading = Path(argv[2]).read_text(encoding="utf-8")
    missing, extra = compare(data, reading)
    for page, text, method in missing:
        print(f"in data, not in reading: [{method or '-'}] p{page}: {text}")
    for line in extra:
        print(f"in reading, not in data: {line}")
    return 1 if missing or extra else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
