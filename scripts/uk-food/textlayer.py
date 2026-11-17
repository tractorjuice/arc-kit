"""Shared helpers for comparing the UK food overlay's data with the pack's text layer.

Used by tests/plugin/test_uk_food_data.py and scripts/uk-food/compare-reading.py.
"""
import re
from collections import Counter
from typing import Iterator

# Keys whose values are identifiers or structure, never words printed on a page.
# Every other string anywhere inside an element is page text. `section` is
# excluded only when it is an identifier string (a section file's own `section`
# is an object whose intro items are page text). `pages` is excluded only when
# it lists page numbers (front.json and diary.json hold page objects there).
NOT_PAGE_TEXT = {"id", "kind", "type", "schema", "data", "code", "section", "page", "pages", "fromImage",
                 "part", "form"}


def _is_page_text_key(key: str, value) -> bool:
    if key == "section":
        return not isinstance(value, str)
    if key == "pages":
        return isinstance(value, list) and any(isinstance(item, dict) for item in value)
    return key not in NOT_PAGE_TEXT

_EDGE = re.compile(r"^[^\w°]+|[^\w°]+$")
_TRANSLATE = str.maketrans({"’": "'", "‘": "'", "–": "-", "—": "-"})


def normalise(word: str) -> str:
    """Lower-case, straighten curly quotes and dashes, trim non-word edges.

    Nothing else: no Unicode folding, because the pack prints both 120⁰C and
    63°C and a digit must never be normalised away.
    """
    return _EDGE.sub("", word.lower().translate(_TRANSLATE))


SOFT_HYPHEN = "\u00ad"


def _as_printed(parts: list[str]) -> str:
    """The parts run together, each soft hyphen that ends a part another part follows read as "-"."""
    last = len(parts) - 1
    return "".join(part[:-1] + "-" if i < last and part.endswith(SOFT_HYPHEN) else part
                   for i, part in enumerate(parts))


def apply_joins(tokens: list[str], joins: list[dict]) -> list[str]:
    """Rejoin a printed word the text layer split in two at a line break.

    Each join {"parts": [...], "as": "...", "count": n} replaces n contiguous runs
    of the raw tokens `parts` (n defaults to 1) with the single token `as`, which
    must be the parts run together: a join can only undo a split, never add a
    word. A soft hyphen (U+00AD) at the end of a part that is not the last part
    is a line-end hyphen, and may be read as the "-" the page prints there, only
    inside a declared join; a soft hyphen anywhere else is never read as "-". A
    join that is not found, or whose count is below 1 (so it would apply
    nothing), raises ValueError, so a stale one cannot pass.
    """
    result = list(tokens)
    for join in joins:
        parts, whole, count = join["parts"], join["as"], join.get("count", 1)
        if whole not in ("".join(parts), _as_printed(parts)):
            raise ValueError(f"join {parts} -> {whole!r}: not the parts run together")
        if count < 1:
            raise ValueError(f"join {parts} -> {whole!r}: count {count} is below 1")
        for _ in range(count):
            for i in range(len(result) - len(parts) + 1):
                if result[i:i + len(parts)] == parts:
                    result[i:i + len(parts)] = [whole]
                    break
            else:
                raise ValueError(f"join {parts} -> {whole!r}: not found")
    return result


def words_of(text: str) -> list[str]:
    """Normalised words of a string, dropping any that normalise to nothing."""
    return [w for w in (normalise(t) for t in text.split()) if w]


def strings_of(node, page=None, method=None,
               include_from_image=False) -> Iterator[tuple[int | None, str, str | None]]:
    """Yield (page, string, method id) for every page-text string in a data file.

    A dict's own `page` applies to its strings, so a page object's `title`
    counts on its page; a dict with a list of page numbers in `pages` and no
    `page` (a method or a section) uses its first page, so its `title` and
    `summary` count on `pages[0]`; anything else inherits the page of its
    parent. Strings with no page in context are not yielded. Elements with
    "fromImage": true are left out, because the text layer cannot hold their
    words, unless `include_from_image` is set: compare-reading.py sets it, so
    the second reading checks the words the coverage test cannot.
    """
    if isinstance(node, str):
        if page is not None:
            yield page, node, method
    elif isinstance(node, list):
        for item in node:
            yield from strings_of(item, page, method, include_from_image)
    elif isinstance(node, dict):
        if node.get("fromImage") is True and not include_from_image:
            return
        if isinstance(node.get("page"), int):
            page = node["page"]
        elif isinstance(node.get("pages"), list) and node["pages"] and isinstance(node["pages"][0], int):
            page = node["pages"][0]
        if ("methods" not in node and "intro" not in node
                and isinstance(node.get("id"), str) and "pages" in node):
            method = node["id"]
        for key, value in node.items():
            if _is_page_text_key(key, value):
                yield from strings_of(value, page, method, include_from_image)


def declared_pages(node) -> set[int]:
    """Every page number a data file declares, in `page` and `pages` keys."""
    found: set[int] = set()
    if isinstance(node, list):
        for item in node:
            found |= declared_pages(item)
    elif isinstance(node, dict):
        if node.get("fromImage") is True:
            return found
        if isinstance(node.get("page"), int):
            found.add(node["page"])
        if isinstance(node.get("pages"), list):
            found |= {p for p in node["pages"] if isinstance(p, int)}
        for key, value in node.items():
            if _is_page_text_key(key, value):
                found |= declared_pages(value)
    return found


def string_key(text: str) -> str:
    """A string's normalised words joined by single spaces, for matching lines."""
    return " ".join(words_of(text))


def word_counter(strings: Iterator[str]) -> Counter:
    counter: Counter = Counter()
    for text in strings:
        counter.update(words_of(text))
    return counter
