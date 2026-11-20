"""Coverage of the UK food overlay's data against the pack's PDF text layer.

The fixture holds the words of the FSA pack's text layer (words only, never the
PDF). Each data file must account for every word on the pages it declares, as a
multiset, after `normalise`. Furniture phrases (the footer, "SAFE METHOD:") are
subtracted from the fixture once per page, and only where they occur exactly as
printed (same case and punctuation) as a contiguous run of tokens, so the body
words "this safe method." are never taken for the "SAFE METHOD:" label.
Per-page exceptions add tokens that sit in the text layer but are not words
printed on the page; per-page joins rejoin a printed word the text layer split
in two at a line break.
"""
import hashlib
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path
from typing import NamedTuple

import pytest
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "uk-food"))
from textlayer import apply_joins, declared_pages, normalise, strings_of, words_of  # noqa: E402

DATA_ID = "sfbb-caterers-2026-11-17"
DATA_DIR = ROOT / "plugins" / "arckit-uk-food" / "data" / DATA_ID
FIXTURE = ROOT / "tests" / "fixtures" / "uk-food" / "sfbb-caterers-textlayer-2026-11-17.json"
EXCEPTIONS = ROOT / "tests" / "fixtures" / "uk-food" / "textlayer-exceptions.json"
DATA_FILES = ["front", "XC", "CL", "CH", "CK", "MG", "diary"]


def _load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def existing_files(data_dir: Path) -> list[str]:
    return [name for name in DATA_FILES if (data_dir / f"{name}.json").is_file()]


def page_words(data_dir: Path, files: list[str] | None = None) -> dict[int, Counter]:
    """Normalised words the data files transcribe, per page (fromImage left out)."""
    pages: dict[int, Counter] = {}
    for name in files if files is not None else existing_files(data_dir):
        data = _load(data_dir / f"{name}.json")
        for page, text, _method in strings_of(data):
            pages.setdefault(page, Counter()).update(words_of(text))
    return pages


def _subtract_furniture(tokens: list[str], furniture: list[str]) -> Counter:
    """Normalised fixture words for a page, minus each furniture phrase once where
    its tokens occur contiguously exactly as printed. A token is split at any
    whitespace inside it, because PyMuPDF splits words only at ASCII spaces and
    so keeps an em space printed between two words inside one token."""
    remaining = [word for t in tokens for word in t.split()]
    for phrase in furniture:
        target = phrase.split()
        for i in range(len(remaining) - len(target) + 1):
            if target and remaining[i:i + len(target)] == target:
                del remaining[i:i + len(target)]
                break
    return Counter(w for w in (normalise(t) for t in remaining) if w)


def page_claims(data_dir: Path) -> dict[int, list[str]]:
    """The data files that declare each page, in DATA_FILES order."""
    claims: dict[int, list[str]] = {}
    for name in existing_files(data_dir):
        for page in declared_pages(_load(data_dir / f"{name}.json")):
            claims.setdefault(page, []).append(name)
    return claims


def page_differences(data_dir: Path, fixture: dict, exceptions: dict,
                     files: list[str] | None = None, pages=None) -> dict[int, dict[str, Counter]]:
    """Pages where the data's words and the fixture's words differ.

    Returns {page: {"missing": words only in the fixture, "extra": words only in
    the data}} for differing pages; an empty dict means a perfect match. The
    pages compared are `pages` when given, otherwise the pages the files declare.
    """
    names = files if files is not None else existing_files(data_dir)
    if pages is None:
        pages = set()
        for name in names:
            pages |= declared_pages(_load(data_dir / f"{name}.json"))
    transcribed = page_words(data_dir, names)
    result: dict[int, dict[str, Counter]] = {}
    for page in sorted(pages):
        tokens = apply_joins(fixture["pages"].get(str(page), []), exceptions.get("joins", {}).get(str(page), []))
        expected = _subtract_furniture(tokens, exceptions.get("furniture", []))
        have = Counter(transcribed.get(page, Counter()))
        for entry in exceptions.get("pages", {}).get(str(page), []):
            token = normalise(entry["token"])
            if token:
                have[token] += entry.get("count", 1)
        missing, extra = expected - have, have - expected
        if missing or extra:
            result[page] = {"missing": missing, "extra": extra}
    return result


@pytest.mark.parametrize("name", DATA_FILES)
def test_section_pages_covered(name):
    if not (DATA_DIR / f"{name}.json").is_file():
        pytest.skip(f"{name}.json not transcribed yet")
    differences = page_differences(DATA_DIR, _load(FIXTURE), _load(EXCEPTIONS), [name])
    assert not differences, differences


# The per-file test compares only the pages a file declares, so a file that dropped a page from its
# `pages` and its blocks would pass it. The whole pack is therefore also compared page by page, whichever
# file declares each page, and every page must be declared by exactly one of the seven files.
WHOLE_PACK = range(1, 101)


def test_whole_pack_covered():
    missing_files = [name for name in DATA_FILES if not (DATA_DIR / f"{name}.json").is_file()]
    assert not missing_files, missing_files
    claims = page_claims(DATA_DIR)
    assert sorted(claims) == list(WHOLE_PACK), sorted(set(WHOLE_PACK) - set(claims))
    assert {page: names for page, names in claims.items() if len(names) > 1} == {}
    differences = page_differences(DATA_DIR, _load(FIXTURE), _load(EXCEPTIONS), DATA_FILES, pages=WHOLE_PACK)
    assert not differences, differences


def _drop_page(node, page: int):
    """A copy of a data file with every element on `page` removed and `page` taken out of every page list."""
    if isinstance(node, list):
        return [_drop_page(item, page) for item in node if not (isinstance(item, dict) and item.get("page") == page)]
    if isinstance(node, dict):
        return {key: ([p for p in value if p != page]
                      if key == "pages" and isinstance(value, list) and all(isinstance(p, int) for p in value)
                      else _drop_page(value, page))
                for key, value in node.items()}
    return node


def test_whole_pack_check_catches_a_dropped_page(tmp_path):
    data_dir = tmp_path / "data"
    shutil.copytree(DATA_DIR, data_dir)
    (data_dir / "CL.json").write_text(json.dumps(_drop_page(_load(data_dir / "CL.json"), 37)), encoding="utf-8")
    fixture, exceptions = _load(FIXTURE), _load(EXCEPTIONS)
    # The per-file comparison sees only the pages CL.json still declares, so it passes...
    assert page_differences(data_dir, fixture, exceptions, ["CL"]) == {}
    # ...but no file now claims page 37, and the whole-pack comparison finds its words missing.
    assert 37 not in page_claims(data_dir)
    differences = page_differences(data_dir, fixture, exceptions, DATA_FILES, pages=WHOLE_PACK)
    assert list(differences) == [37] and differences[37]["missing"] and not differences[37]["extra"]


def test_page_claims_finds_a_page_two_files_declare(tmp_path):
    data_dir = tmp_path / "data"
    shutil.copytree(DATA_DIR, data_dir)
    xc = _load(data_dir / "XC.json")
    xc["section"]["pages"] = [10, *xc["section"]["pages"]]
    (data_dir / "XC.json").write_text(json.dumps(xc), encoding="utf-8")
    assert page_claims(data_dir)[10] == ["front", "XC"]


def test_fixture_matches_declared_source():
    source = _load(DATA_DIR / "source.json")
    assert _load(FIXTURE)["source"]["sha256"] == source["sha256"]


# M1: the fixture holds the pack's whole text, so it says where that text comes from and under what
# licence it is reused, in the words of the data's own source.json.
ATTRIBUTED = ["title", "publisher", "url", "licence", "attribution"]


def test_fixture_names_its_source_and_its_licence():
    source = _load(DATA_DIR / "source.json")
    held = _load(FIXTURE)["source"]
    assert {key: held.get(key) for key in ATTRIBUTED} == {key: source[key] for key in ATTRIBUTED}
    assert list(held) == ["file", "sha256", "pages", *ATTRIBUTED]
    assert held["pages"] == source["pages"]


def _extractor():
    spec = importlib.util.spec_from_file_location("extract_textlayer", ROOT / "scripts" / "uk-food" / "extract-textlayer.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_the_extractor_writes_the_source_and_licence_into_a_new_fixture():
    """A refresh of the pack keeps the attribution: the extractor copies it from the data's source.json."""
    module = _extractor()
    source = _load(DATA_DIR / "source.json")
    described = module.describe_source("pack.pdf", "ab" * 32, 100, source)
    assert described == {"file": "pack.pdf", "sha256": "ab" * 32, "pages": 100, **{key: source[key] for key in ATTRIBUTED}}
    assert described == {**_load(FIXTURE)["source"], "file": "pack.pdf", "sha256": "ab" * 32}
    with pytest.raises(ValueError, match="attribution"):
        module.describe_source("pack.pdf", "ab" * 32, 100, {key: value for key, value in source.items() if key != "attribution"})


# M6: the coverage test above compares each page's words as a multiset, so it cannot see two words that
# have changed places on a page, and `normalise` strips a leading minus sign from a figure. Nothing else
# in the suite would notice such an edit to the pack's wording. So each data file's bytes are pinned.
# When one of these changes, the change was meant: re-read every page the changed file declares against
# the PDF (scripts/uk-food/render-limits-check.py prints the figures to read), then put the new hash here.
DATA_SHA256 = {
    "source": "708f9b05efd65989e0ed262341f202ba118cb75752ea21b84d01471ca5a47d2b",
    "front": "ffe5a53d73ea08f931457ff916613dfec0b2a7c4cd4380feaf0d7d92271daa37",
    "XC": "55468559bdbe1f86dbb76cf183d8fd7183bc9caa3bdd898fb1473512ea4ced05",
    "CL": "25c1641877bfba4bfd6fdec11f9fc4e086f9c6005bc516606cb366d10d8094a4",
    "CH": "75fda252014c3efd22ebc6bde234c42308460df40bb18ec4cdb842d8a31981bc",
    "CK": "4e3bf27b2c1c48cbb6b182baf2ae55522df29c5df9f22150d5d9ecd920e12120",
    "MG": "dd079219df3dff0b761d83bee6cf7d7a09dd0a82146155461762d12cd63003f3",
    "diary": "64562c73c9a8db79c69d01bc4fef427818d52a6be4e3956d91922486166f82c0",
    "limits": "1f010908835a694e418519ef5a347bf5ef981d10177fb7c4b406052a9830b99b",
}


def test_every_data_file_is_pinned():
    assert sorted(f"{name}.json" for name in DATA_SHA256) == sorted(path.name for path in DATA_DIR.glob("*.json"))


@pytest.mark.parametrize("name", list(DATA_SHA256))
def test_data_file_is_the_one_read_against_the_pack(name):
    found = hashlib.sha256((DATA_DIR / f"{name}.json").read_bytes()).hexdigest()
    assert found == DATA_SHA256[name], (
        f"{name}.json has changed. If that was meant, re-read the pages it declares against the PDF, "
        "then update DATA_SHA256 in this file.")


def test_the_pin_catches_what_the_coverage_test_cannot(tmp_path):
    """Two words changed places on one page: every page still holds the same words, but the bytes differ."""
    data_dir = tmp_path / "data"
    shutil.copytree(DATA_DIR, data_dir)
    path = data_dir / "CK.json"
    data = _load(path)
    summary = data["methods"][0]["summary"]
    words = summary.split(" ")
    assert len(words) > 4 and words[1] != words[2]
    words[1], words[2] = words[2], words[1]
    data["methods"][0]["summary"] = " ".join(words)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    assert page_differences(data_dir, _load(FIXTURE), _load(EXCEPTIONS), ["CK"]) == {}
    assert hashlib.sha256(path.read_bytes()).hexdigest() != DATA_SHA256["CK"]


# Safe methods per section in full-pack page order, from the plan's identifier table.
# A method's `title` is page text, so it is compared ignoring letter case and spacing.
METHOD_COUNTS = {"XC": 7, "CL": 4, "CH": 4, "CK": 7, "MG": 9}
METHOD_TITLES = {
    "XC": ["Personal hygiene and fitness to work", "Cloths", "Separating foods", "Food hypersensitivity",
           "Physical and chemical contamination", "Pest control", "Maintenance"],
    "CL": ["Handwashing", "Cleaning effectively", "Clear and clean as you go", "Your cleaning schedule"],
    "CH": ["Chilled storage and displaying chilled food", "Chilling down hot food", "Defrosting", "Freezing"],
    "CK": ["Cooking safely", "Foods that need extra care", "Reheating", "Acrylamide", "Checking your menu",
           "Hot holding", "Ready-to-eat food"],
    "MG": ["Opening and closing checks", "Extra checks", "Prove it", "Managing food allergen information",
           "Training and supervision", "Customers", "Suppliers and contractors", "Stock control",
           "Product withdrawal and recall"],
}
# Sections whose data file must exist. Each transcription task adds its own section.
REQUIRED_SECTIONS = ["XC", "CL", "CH", "CK", "MG"]


def _title_key(title: str) -> str:
    return " ".join(title.split()).lower()


@pytest.mark.parametrize("section", list(METHOD_COUNTS))
def test_section_counts(section):
    path = DATA_DIR / f"{section}.json"
    if not path.is_file():
        assert section not in REQUIRED_SECTIONS, f"{section}.json is required but missing"
        pytest.skip(f"{section}.json not transcribed yet")
    methods = _load(path)["methods"]
    assert len(methods) == METHOD_COUNTS[section] == len(METHOD_TITLES[section])
    expected = [(f"{section}-{n:02d}", _title_key(title)) for n, title in enumerate(METHOD_TITLES[section], 1)]
    assert [(m["id"], _title_key(m["title"])) for m in methods] == expected


# Self-tests of the comparison itself, on a tiny fake data directory.

FAKE_FIXTURE = {"pages": {"1": ["WASH", "your", "Hands.", "Food", "Standards", "Agency", "l",
                                "food.gov.uk/sfbb"]}}
FAKE_EXCEPTIONS = {"furniture": ["Food Standards Agency l food.gov.uk/sfbb"], "pages": {}}


def _fake_dir(tmp_path, text):
    data = {"schema": "x", "data": DATA_ID, "section": {"id": "XC", "intro": [{"text": text, "page": 1}]},
            "methods": []}
    (tmp_path / "XC.json").write_text(json.dumps(data), encoding="utf-8")
    return tmp_path


def test_comparison_accepts_a_correct_transcription(tmp_path):
    assert page_differences(_fake_dir(tmp_path, "Wash your hands"), FAKE_FIXTURE, FAKE_EXCEPTIONS) == {}


def test_comparison_reports_a_missing_word(tmp_path):
    diff = page_differences(_fake_dir(tmp_path, "Wash your"), FAKE_FIXTURE, FAKE_EXCEPTIONS)
    assert diff[1]["missing"] == Counter({"hands": 1}) and not diff[1]["extra"]


def test_comparison_reports_an_extra_word(tmp_path):
    diff = page_differences(_fake_dir(tmp_path, "Wash your hands well"), FAKE_FIXTURE, FAKE_EXCEPTIONS)
    assert diff[1]["extra"] == Counter({"well": 1}) and not diff[1]["missing"]


def test_furniture_is_subtracted_only_when_contiguous(tmp_path):
    broken = {"pages": {"1": ["WASH", "Food", "your", "Standards", "Agency", "l", "food.gov.uk/sfbb"]}}
    diff = page_differences(_fake_dir(tmp_path, "Wash your"), broken, FAKE_EXCEPTIONS)
    assert diff[1]["missing"] == Counter({"food": 1, "standards": 1, "agency": 1, "l": 1,
                                          "food.gov.uk/sfbb": 1})


def test_furniture_is_matched_as_printed_never_in_body_text(tmp_path):
    exceptions = {"furniture": ["SAFE METHOD:"], "pages": {}}
    labelled = {"pages": {"1": ["SAFE", "METHOD:", "Train", "on", "this", "safe", "method."]}}
    assert page_differences(_fake_dir(tmp_path, "Train on this safe method."), labelled, exceptions) == {}
    # A page that prints no label keeps its body words "safe method.".
    unlabelled = {"pages": {"1": ["Train", "on", "this", "safe", "method."]}}
    assert page_differences(_fake_dir(tmp_path, "Train on this safe method."), unlabelled, exceptions) == {}


def test_a_fixture_token_holding_two_printed_words_is_split_at_its_inner_space(tmp_path):
    # Page 63 prints "Do you do this?" and "Yes" apart; PyMuPDF splits words only at ASCII spaces, so the
    # text layer holds "this?", an em space, "Yes" and an en space as one token.
    fixture = {"pages": {"1": ["Do", "you", "do", "this?\u2003Yes\u2002"]}}
    no_exceptions = {"furniture": [], "pages": {}}
    assert page_differences(_fake_dir(tmp_path, "Do you do this? Yes"), fixture, no_exceptions) == {}
    diff = page_differences(_fake_dir(tmp_path, "Do you do this?"), fixture, no_exceptions)
    assert diff[1]["missing"] == Counter({"yes": 1}) and not diff[1]["extra"]


def test_page_exceptions_add_tokens_the_page_does_not_print(tmp_path):
    fixture = {"pages": {"1": ["WASH", "\u2002"]}}
    # A token that normalises to nothing is ignored on both sides; a real one is added.
    exceptions = {"furniture": [], "pages": {"1": [{"token": "zz", "count": 1, "reason": "test"}]}}
    diff = page_differences(_fake_dir(tmp_path, "wash"), fixture, exceptions)
    assert diff[1]["extra"] == Counter({"zz": 1})


def test_joins_rejoin_a_word_split_at_a_line_break(tmp_path):
    fixture = {"pages": {"1": ["Wash", "ready-", "to-eat", "hands"]}}
    joins = {"1": [{"parts": ["ready-", "to-eat"], "as": "ready-to-eat", "reason": "test"}]}
    exceptions = {"furniture": [], "pages": {}, "joins": joins}
    assert page_differences(_fake_dir(tmp_path, "Wash ready-to-eat hands"), fixture, exceptions) == {}
    diff = page_differences(_fake_dir(tmp_path, "Wash ready-to-eat hands"), fixture, {"furniture": [], "pages": {}})
    assert diff[1]["missing"] == Counter({"ready": 1, "to-eat": 1}) and diff[1]["extra"] == Counter({"ready-to-eat": 1})


def test_joins_apply_count_times_and_refuse_stale_or_invented_words():
    tokens = ["a-", "b", "x", "a-", "b"]
    assert apply_joins(tokens, [{"parts": ["a-", "b"], "as": "a-b", "count": 2}]) == ["a-b", "x", "a-b"]
    with pytest.raises(ValueError, match="not found"):
        apply_joins(tokens, [{"parts": ["a-", "b"], "as": "a-b", "count": 3}])
    with pytest.raises(ValueError, match="not the parts run together"):
        apply_joins(tokens, [{"parts": ["a-", "b"], "as": "a-c"}])


def test_joins_read_a_soft_hyphen_as_the_hyphen_it_prints(tmp_path):
    # Page 40 prints "ready-to-" at a line end and "eat" below; the text layer gives a soft hyphen.
    tokens = ["other", "ready-to\u00ad", "eat", "food"]
    join = {"parts": ["ready-to\u00ad", "eat"], "as": "ready-to-eat", "reason": "test"}
    assert apply_joins(tokens, [join]) == ["other", "ready-to-eat", "food"]
    fixture = {"pages": {"1": tokens}}
    exceptions = {"furniture": [], "pages": {}, "joins": {"1": [join]}}
    assert page_differences(_fake_dir(tmp_path, "other ready-to-eat food"), fixture, exceptions) == {}
    # Inside a join the soft hyphen is read as "-", never dropped.
    with pytest.raises(ValueError, match="not the parts run together"):
        apply_joins(tokens, [{"parts": ["ready-to\u00ad", "eat"], "as": "ready-toeat"}])


def test_a_soft_hyphen_is_kept_outside_a_declared_join(tmp_path):
    tokens = ["other", "ready-to\u00ad", "eat", "food"]
    assert apply_joins(tokens, []) == tokens
    assert apply_joins(tokens, [{"parts": ["eat", "food"], "as": "eatfood"}]) == ["other", "ready-to\u00ad", "eatfood"]
    assert normalise("a\u00adb") == "a\u00adb"  # normalise neither converts nor drops it inside a word
    diff = page_differences(_fake_dir(tmp_path, "other ready-to-eat food"), {"pages": {"1": tokens}},
                            {"furniture": [], "pages": {}})
    assert diff[1]["missing"] == Counter({"ready-to": 1, "eat": 1})
    assert diff[1]["extra"] == Counter({"ready-to-eat": 1})


def test_joins_read_only_a_line_end_soft_hyphen_as_a_printed_hyphen():
    # A soft hyphen ending a part that another part follows is a line-end hyphen, and may be read as "-".
    parts = ["ready\u00ad", "to\u00ad", "eat"]
    assert apply_joins(parts, [{"parts": parts, "as": "ready-to-eat"}]) == ["ready-to-eat"]
    # Anywhere else it is not a printed hyphen, so an `as` that reads it as "-" is refused.
    for parts in (["re\u00adady-to", "eat"],         # inside a part
                  ["ready-to", "\u00adeat"],         # at the start of a part
                  ["ready-to", "eat\u00ad"],         # at the end of the last part
                  ["re\u00adady-to\u00ad", "eat"]):  # inside a part, beside a line-end one
        with pytest.raises(ValueError, match="not the parts run together"):
            apply_joins(list(parts), [{"parts": parts, "as": "".join(parts).replace("\u00ad", "-")}])


def test_joins_refuse_a_count_below_one():
    # A count of 0 or less would apply nothing and so pass silently, like a stale join.
    for count in (0, -1):
        with pytest.raises(ValueError, match="count"):
            apply_joins(["a-", "b"], [{"parts": ["a-", "b"], "as": "a-b", "count": count}])


def test_every_exception_and_join_gives_a_reason():
    exceptions = _load(EXCEPTIONS)
    entries = [(page, entry) for page, items in exceptions.get("pages", {}).items() for entry in items]
    entries += [(page, join) for page, items in exceptions.get("joins", {}).items() for join in items]
    unexplained = [(page, entry) for page, entry in entries
                   if not isinstance(entry.get("reason"), str) or not entry["reason"].strip()]
    assert not unexplained, unexplained


def test_from_image_elements_are_left_out(tmp_path):
    data = {"section": {"intro": [{"text": "Wash your hands", "page": 1},
                                  {"text": "unreadable picture words", "page": 1, "fromImage": True}]}}
    (tmp_path / "XC.json").write_text(json.dumps(data), encoding="utf-8")
    assert page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS) == {}


def test_method_title_and_summary_count_on_first_page(tmp_path):
    data = {"methods": [{"id": "XC-01", "title": "Wash", "summary": "your", "pages": [1, 2],
                         "blocks": [{"kind": "text", "text": "hands", "page": 1}]}]}
    (tmp_path / "XC.json").write_text(json.dumps(data), encoding="utf-8")
    diff = page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS)
    assert diff == {}  # title and summary sit on page 1; page 2 is declared but absent from the fake fixture


def test_any_string_field_counts_but_excluded_keys_do_not(tmp_path):
    row = {"id": "XC-01-P01", "kind": "points", "section": "XC", "type": "tick", "code": "FOODXC",
           "point": "Wash", "page": 1,
           "questions": [{"id": "Q1", "text": "your", "options": ["hands", "Yes"], "elseText": "No"}]}
    (tmp_path / "XC.json").write_text(json.dumps({"methods": [{"id": "XC-01", "pages": [1],
                                                               "blocks": [{"rows": [row]}]}]}), encoding="utf-8")
    diff = page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS)
    # options and elseText (unexpected fields) are counted; id, kind, section, type, code are not.
    assert diff[1]["extra"] == Counter({"yes": 1, "no": 1}) and not diff[1]["missing"]


def test_column_group_label_counts_on_its_block_page(tmp_path):
    # A label printed across several columns is page text on the table's page; from and to are not.
    table = {"kind": "table", "heading": None, "columns": ["Wash", "your"], "page": 1, "rows": [],
             "columnGroups": [{"label": "Hands.", "from": 0, "to": 1}]}
    (tmp_path / "XC.json").write_text(json.dumps({"methods": [{"id": "XC-01", "pages": [2], "blocks": [table]}]}),
                                      encoding="utf-8")
    assert page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS) == {}
    table["columnGroups"] = []
    (tmp_path / "XC.json").write_text(json.dumps({"methods": [{"id": "XC-01", "pages": [2], "blocks": [table]}]}),
                                      encoding="utf-8")
    assert page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS)[1]["missing"] == Counter({"hands": 1})


def test_normalise_changes_only_case_quotes_dashes_and_edges():
    assert normalise("Don’t,") == "don't"
    assert normalise("(63°C)") == "63°c"
    assert normalise("120⁰C") == "120⁰c"
    assert normalise("a–b—c") == "a-b-c"
    assert normalise("•") == ""


def test_compare_reading_reports_both_directions(tmp_path):
    spec = importlib.util.spec_from_file_location("compare_reading", ROOT / "scripts" / "uk-food" / "compare-reading.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    data = {"methods": [{"id": "XC-01", "title": "Wash", "pages": [1],
                         "blocks": [{"kind": "text", "text": "Dry your hands.", "page": 1}]}]}
    assert module.compare(data, "# Heading\nwash\nDry your hands\n") == ([], [])
    missing, extra = module.compare(data, "wash\nrinse\n")
    assert missing == [(1, "Dry your hands.", "XC-01")] and extra == ["rinse"]


def test_compare_reading_matches_each_paragraph_and_bullet_of_a_cell(tmp_path):
    spec = importlib.util.spec_from_file_location("compare_reading", ROOT / "scripts" / "uk-food" / "compare-reading.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    data = {"methods": [{"id": "XC-02", "title": "Cloths", "pages": [15], "blocks": [
        {"kind": "points", "page": 15, "rows": [{"id": "XC-02-P01", "page": 15,
                                                  "point": "Wash cloths.\nDry them properly.", "why": None}]},
        {"kind": "wrong", "page": 16, "wrong": ["Throw it away:\n• food\n• towels"], "prevent": []}]}]}
    reading = "Cloths\nWash cloths.\nDry them properly.\nThrow it away:\n• food\n• towels\n"
    assert module.compare(data, reading) == ([], [])
    missing, extra = module.compare(data, "Cloths\nWash cloths.\nThrow it away:\n• food\n")
    assert missing == [(15, "Dry them properly.", "XC-02"), (16, "• towels", "XC-02")] and extra == []


def test_compare_reading_includes_from_image_text():
    # The coverage test cannot see fromImage text, so the comparison with the second reading must.
    spec = importlib.util.spec_from_file_location("compare_reading", ROOT / "scripts" / "uk-food" / "compare-reading.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    data = {"schema": "x", "data": DATA_ID, "part": "diary", "pages": [{"page": 94, "title": None, "blocks": [
        {"kind": "table", "heading": "Monday", "columns": [], "rows": [], "page": 94,
         "questions": [{"id": "DY-94-Q01", "text": "Name", "type": "text"}]},
        {"kind": "text", "heading": None, "text": "John Smith\nPacket of cooked ham.", "page": 94, "fromImage": True}]}]}
    assert module.compare(data, "Monday\nName\nJohn Smith\nPacket of cooked ham.\n") == ([], [])
    missing, extra = module.compare(data, "Monday\nName\nJohn Smith\n")
    assert missing == [(94, "Packet of cooked ham.", None)] and extra == []
    # The coverage walker still leaves it out unless asked.
    assert [text for _, text, _ in strings_of(data)] == ["Monday", "Name"]
    assert [text for _, text, _ in strings_of(data, include_from_image=True)][-1] == "John Smith\nPacket of cooked ham."


def test_section_title_counts_on_its_first_page():
    section = {"id": "XC", "title": "Cross-contamination", "pages": [3, 4], "intro": [{"text": "Keep apart", "page": 4}]}
    found = [(page, text) for page, text, _ in strings_of({"section": section})]
    assert (3, "Cross-contamination") in found and (4, "Keep apart") in found


def test_page_object_title_and_blocks_count_on_its_page(tmp_path):
    # front.json and diary.json hold one page object per printed page. The page's printed title is page
    # text on that page; `part` and a block's `form` are not.
    data = {"schema": "x", "data": DATA_ID, "part": "front", "pages": [
        {"page": 1, "title": "WASH", "blocks": [
            {"kind": "text", "heading": "your", "text": "Hands.", "page": 1, "form": "workingWithFood"}]}]}
    assert declared_pages(data) == {1}
    (tmp_path / "front.json").write_text(json.dumps(data), encoding="utf-8")
    assert page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS, ["front"]) == {}
    data["pages"][0]["title"] = None
    (tmp_path / "front.json").write_text(json.dumps(data), encoding="utf-8")
    diff = page_differences(tmp_path, FAKE_FIXTURE, FAKE_EXCEPTIONS, ["front"])
    assert diff[1]["missing"] == Counter({"wash": 1}) and not diff[1]["extra"]


# front.json and diary.json hold one page object for every page the page map gives them, in page order,
# so that the coverage test, which compares only the pages a file declares, cannot skip a page.
PART_PAGES = {"front": list(range(1, 11)), "diary": list(range(78, 101))}
REQUIRED_PARTS = ["front", "diary"]


@pytest.mark.parametrize("part", list(PART_PAGES))
def test_part_pages(part):
    path = DATA_DIR / f"{part}.json"
    if not path.is_file():
        assert part not in REQUIRED_PARTS, f"{part}.json is required but missing"
        pytest.skip(f"{part}.json not transcribed yet")
    data = _load(path)
    assert data["part"] == part
    assert [page["page"] for page in data["pages"]] == PART_PAGES[part]


def _diary_page(number: int) -> dict:
    path = DATA_DIR / "diary.json"
    if not path.is_file():
        assert "diary" not in REQUIRED_PARTS, "diary.json is required but missing"
        pytest.skip("diary.json not transcribed yet")
    found = next((page for page in _load(path)["pages"] if page["page"] == number), None)
    assert found is not None, f"diary.json has no page {number}"
    return found


def test_diary_page_reports_a_missing_page():
    with pytest.raises(AssertionError, match="diary.json has no page 101"):
        _diary_page(101)


def test_review_has_twelve_checklist_questions():
    # The blank 4-weekly review, page 100: its SAFE METHOD | CHECK LIST table asks twelve questions, each
    # with the printed Yes and No boxes.
    blocks = [block for block in _diary_page(100)["blocks"] if block.get("form") == "fourWeeklyReview"]
    checklists = [block for block in blocks if "CHECK LIST" in block.get("columns", [])]
    assert len(checklists) == 1
    questions = checklists[0]["questions"]
    assert len(questions) == 12
    assert all(q["type"] == "yes-no" and q["options"] == ["Yes", "No"] and q["text"] for q in questions)


# The completion record names a safe method in its own words. Where those words differ from the method's
# printed title (after letter case and spacing), the pack's own difference is listed here.
COMPLETION_RECORD_NAMES = {
    "Personal hygiene": "XC-01",  # the method's title is "PERSONAL HYGIENE AND FITNESS TO WORK"
    "Food allergies": "XC-04",    # the method's title is "FOOD HYPERSENSITIVITY"
}


def test_completion_record_lists_each_safe_method_once():
    rows = [row for number in (78, 79) for block in _diary_page(number)["blocks"]
            if block.get("form") == "completionRecord" for row in block["rows"]]
    sections = {_title_key(_load(DATA_DIR / f"{s}.json")["section"]["title"]) for s in METHOD_COUNTS}
    methods = {_title_key(m["title"]): m["id"] for s in METHOD_COUNTS for m in _load(DATA_DIR / f"{s}.json")["methods"]}
    # Every row is a name and three blank cells: date, signature, and the box to tick if not relevant.
    assert all(len(row) == 4 and row[0] and row[1:] == ["", "", ""] for row in rows), rows
    headings = [row[0] for row in rows if _title_key(row[0]) in sections]
    assert [_title_key(h) for h in headings] == ["cross-contamination", "cleaning", "chilling", "cooking",
                                                 "management"]
    names = [row[0] for row in rows if _title_key(row[0]) not in sections]
    assert len(names) == 31
    ids = [COMPLETION_RECORD_NAMES.get(name) or methods.get(_title_key(name)) for name in names]
    assert None not in ids, [name for name, id_ in zip(names, ids) if id_ is None]
    assert sorted(ids) == sorted(methods.values())  # one to one: each of the 31 methods exactly once


# The completion record's first column as printed on pages 78 and 79, top to bottom: five section
# headings, each followed by its safe methods. The order is the pack's own, which is not always the
# order of the methods' pages: page 79 prints Acrylamide (CK-04) last in Cooking.
COMPLETION_RECORD_ORDER = [
    "Cross-contamination", "Personal hygiene", "Cloths", "Separating foods", "Food allergies",
    "Physical and chemical contamination", "Pest control", "Maintenance",
    "Cleaning", "Handwashing", "Cleaning effectively", "Clear and clean as you go", "Your cleaning schedule",
    "Chilling", "Chilled storage and displaying chilled food", "Chilling down hot food", "Defrosting", "Freezing",
    "Cooking", "Cooking safely", "Foods that need extra care", "Reheating", "Checking your menu", "Hot holding",
    "Ready-to-eat food", "Acrylamide",
    "Management", "Opening and closing checks", "Extra checks", "Prove it", "Managing food allergen information",
    "Training and supervision", "Customers", "Suppliers and contractors", "Stock control",
    "Product withdrawal and recall",
]


def test_completion_record_is_in_printed_order():
    assert len(COMPLETION_RECORD_ORDER) == 5 + 31
    names = [row[0] for number in (78, 79) for block in _diary_page(number)["blocks"]
             if block.get("form") == "completionRecord" for row in block["rows"]]
    assert names == COMPLETION_RECORD_ORDER


# limits.json: every number, limit and standard the pack prints that a business must work to, one entry
# for each place it is printed. It is derived from the transcribed files, not page text, so the coverage
# tests never read it; instead each entry's text must be quoted exactly from the data.

LIMITS = DATA_DIR / "limits.json"


def _limits() -> list[dict]:
    assert LIMITS.is_file(), "limits.json is missing"
    return _load(LIMITS)["limits"]


def _file_of(method: str) -> str:
    """The data file a limit's method points to: front, diary, or the section its identifier starts with."""
    return method if method in PART_PAGES else method[:2]


def _parts(name: str) -> list[tuple[int, str | None, str]]:
    """(page, method id, part) for each "\\n"-separated part of each page-text string in a data file."""
    return [(page, method, part) for page, text, method in strings_of(_load(DATA_DIR / f"{name}.json"))
            for part in text.split("\n")]


def unquoted_limits(limits: list[dict]) -> list[str]:
    """Identifiers of limits whose text is not part of a string on their page, in their method's file."""
    parts = {name: _parts(name) for name in DATA_FILES}
    unquoted = []
    for limit in limits:
        name = _file_of(limit["method"])
        owner = None if name in PART_PAGES else limit["method"]  # front and diary strings belong to no method
        if not any(page == limit["page"] and method == owner and limit["text"] in part
                   for page, method, part in parts[name]):
            unquoted.append(limit["id"])
    return unquoted


def test_limit_text_is_quoted():
    assert not unquoted_limits(_limits())


# The order the check sheet relies on: the front matter, the five sections in pack order, then the diary,
# by page within each, numbered L-01 onwards with no gap.
LIMIT_GROUPS = ["front", *METHOD_COUNTS, "diary"]


def limits_out_of_order(limits: list[dict]) -> list[str]:
    """Identifiers not numbered by their position, then identifiers that come before the entry above them."""
    problems = [limit["id"] for i, limit in enumerate(limits, 1) if limit["id"] != f"L-{i:02d}"]
    keys = [(LIMIT_GROUPS.index(_file_of(limit["method"])), limit["page"]) for limit in limits]
    return problems + [limits[i]["id"] for i in range(1, len(keys)) if keys[i] < keys[i - 1]]


def test_limits_are_in_check_sheet_order():
    assert limits_out_of_order(_limits()) == []


def test_limits_out_of_order_are_reported():
    limits = json.loads(json.dumps(_limits()))
    limits.append(limits.pop(0))  # the front matter's entry moved after the diary's
    for i, limit in enumerate(limits, 1):
        limit["id"] = f"L-{i:02d}"
    assert limits_out_of_order(limits) == [limits[-1]["id"]]
    limits[0]["id"] = "L-99"
    assert limits_out_of_order(limits)[0] == "L-99"


def _limit(limits: list[dict], value: str, page: int) -> dict:
    return next(limit for limit in limits if (limit["value"], limit["page"]) == (value, page))


def test_a_limit_not_quoted_from_its_page_is_reported():
    limits = json.loads(json.dumps(_limits()))
    reworded = _limit(limits, "63°C", 60)
    reworded["text"] = reworded["text"].replace("at 63°C or above", "above 63°C")
    moved = _limit(limits, "90°C", 15)
    moved["page"] = 16
    assert unquoted_limits(limits) == [moved["id"], reworded["id"]]


def test_a_figure_with_no_limit_is_reported():
    limits = [limit for limit in _limits() if limit["value"] != "90°C"]
    unaccounted = figure_accounts(limits).unaccounted
    assert [(name, page, figure) for name, page, _, figure, _ in unaccounted] == [("XC", 15, "90°C")]


# Figures the table must hold, each as the data prints it: the degree sign U+00B0, the raised zero U+2070
# that pages 56, 57 and 67 print instead, and the en dash U+2013. (value, method, page, words its text must
# also hold, where the value alone does not say which rule it is.) A cooking temperature and its time are
# one printed cell, so they are one value and cannot be separated.
EXPECTED_LIMITS = [
    ("63°C", "CK-06", 60, None),
    ("8°C", "CH-01", 41, None),
    ("5°C", "CH-01", 41, None),
    ("-18°C", "MG-03", 68, None),
    ("80°C for at least 6 seconds", "CK-01", 51, None),
    ("75°C for at least 30 seconds", "CK-01", 51, None),
    ("70°C for at least 2 minutes", "CK-01", 51, None),
    ("65°C for at least 10 minutes", "CK-01", 51, None),
    ("60°C for at least 45 minutes", "CK-01", 51, None),
    ("between -1°C and 1°C", "MG-03", 69, "iced water"),
    ("between 99°C and 101°C", "MG-03", 69, "boiling water"),
    ("48 hours", "XC-01", 14, None),
    ("90°C", "XC-02", 15, None),
    ("3 days", "CH-01", 40, None),
    ("3 days", "CK-07", 63, None),
    ("1 day", "CK-07", 63, "Cooked rice"),
    ("four hours", "CH-01", 41, "\u20184 hour rule\u2019"),  # the four-hour rule
    ("two hours", "CK-06", 60, "up to two hours, but you can only do this once"),  # the two-hour rule
    # Each display rule may be used only once: its own entry, as reheating's "only once" has.
    ("once", "CH-01", 41, "for up to four hours, but you can only do this once"),
    ("once", "CK-06", 60, "for up to two hours, but you can only do this once"),
    ("between 0°C and 4°C", "CK-02", 53, None),
    ("60 days", "CK-02", 52, None),
    ("28 days", "front", 2, None),
    ("between 0 and 5", "front", 8, "given a rating between 0 and 5"),  # the food hygiene rating scale
    # The review's cadence is printed only in its name, so each place the name is printed is a limit: where
    # the pack tells the business to do the review, where it describes it, and the review's own headings.
    ("4-weekly", "front", 5, "There is also a 4-weekly review"),
    ("4-weekly", "MG-05", 73, "Use the 4-weekly review in the diary"),
    ("4-weekly", "MG-05", 73, "You should still complete the 4-weekly review yourself."),
    ("4-weekly", "diary", 81, "4-weekly review"),  # the bullet in the list of what the diary contains
    ("4-WEEKLY", "diary", 81, "4-WEEKLY REVIEW"),
    ("4-weekly", "diary", 81, "The 4-weekly review gives you the opportunity"),
    ("4-weekly", "diary", 81, "read the 4-weekly review before starting"),
    ("4-WEEKLY", "diary", 99, "4-WEEKLY REVIEW"),
    ("4-WEEKLY", "diary", 100, "4-WEEKLY REVIEW"),
    ("2 stage", "XC-03", 17, "\u20182 stage clean\u2019"),
    # A named scheme, as the BS EN numbers are named standards: the bullet that names it and the reason given.
    ("British Lion code", "CK-02", 52, "British Lion code or equivalent assurance scheme"),
    ("British Lion code", "CK-02", 52, "demonstrates eggs have been produced in a safe manner"),
    ("120\u2070C", "CK-04", 56, "Acrylamide"),
    ("175\u2070C", "CK-04", 57, "oil temperature"),
    ("30\u2013180 mins", "CK-04", 56, "Soak"),
    ("BS EN 1276", "CL-02", 31, None),
    ("BS EN 13697", "CL-02", 31, None),
    ("BS EN 1499", "CL-01", 29, None),
    ("BS EN 1500", "CL-01", 30, None),
    ("10mg/ kg", "XC-04", 20, "Sulphur dioxide"),
    ("within 1\u2070C of 100\u2070C and 0\u2070C", "MG-02", 67, "boiling water and melting ice"),
]


@pytest.mark.parametrize("value, method, page, words", EXPECTED_LIMITS,
                         ids=[f"{v} {m} p{p}" for v, m, p, _ in EXPECTED_LIMITS])
def test_limits_present(value, method, page, words):
    limits = _limits()
    found = [limit for limit in limits if (limit["value"], limit["method"], limit["page"]) == (value, method, page)
             and (words is None or words in limit["text"])]
    assert found, (value, method, page, words)
    # Where several expectations share a value, method and page, each needs an entry of its own: a bullet's
    # words can sit inside a sentence on the same page, so one entry could otherwise meet them all.
    expected = sum((v, m, p) == (value, method, page) for v, m, p, _ in EXPECTED_LIMITS)
    held = sum((limit["value"], limit["method"], limit["page"]) == (value, method, page) for limit in limits)
    assert held >= expected, (value, method, page, held, expected)


# Completeness: every figure in the front matter and the five section files (not the diary's forms and
# worked examples) is either inside some limit's text on its page, in its own method, or matched by one
# of these patterns for things that are not limits. Each pattern is narrow, names the pages it may match,
# and gives its reason; a figure matched by neither fails the test, and so does a pattern that matches
# nothing, so the list cannot go stale.
FIGURE = re.compile(r"\S*\d\S*")
NUMBER_WORD = re.compile(r"\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen"
                         r"|fourteen|once|twice|half)\b", re.IGNORECASE)


class NotALimit(NamedTuple):
    where: dict[str, tuple[int, ...]]
    pattern: str
    reason: str


THINK_TWICE_PAGES = {"XC": (18, 20, 22, 24), "CL": (30, 33), "CH": (41, 45, 47), "CK": (54, 57, 60, 63),
                     "MG": (77,)}
NOT_LIMITS = [
    NotALimit(THINK_TWICE_PAGES, r"^THINK TWICE!$", "the heading of a THINK TWICE! box"),
    NotALimit({"front": (8,)}, r"^[0-5] \u2013 ",
              "the meaning of one score on the food hygiene rating scale an inspector awards; the scale itself,"
              " the figures it runs between, is a limit (front page 8)"),
    NotALimit({"front": (10,), "CL": (29,)}, r"^Step [1-6]:", "the number of a handwashing step"),
    NotALimit({"CL": (31, 37), "CH": (44, 45), "MG": (75,)}, r"^[1-7]\. ", "the number of an item in a numbered list"),
    NotALimit({"XC": (20,)}, r"\bring 999\b", "the emergency telephone number in the allergic reaction box"),
    NotALimit({"MG": (70,)}, r"\bSince October 2021\b", "the date a labelling law came in; a date, not a limit"),
    NotALimit({"XC": (18,), "CL": (31, 32, 33)},
              r"\btwo stage clean(?:ing)?\b|\btwo stages\b",
              "the name of the two stage clean in words, a procedure CL-02 sets out step by step: a count of"
              " stages, not a figure to measure against; the one place the pack names it with a digit (XC-03"
              " page 17) is a limit"),
    NotALimit({"CL": (37,)}, r"\bA two-in-one product\b", "the name of a kind of product (a sanitiser)"),
    NotALimit({"front": (4,), "XC": (11, 12, 13, 15), "CK": (52, 56)},
              r"\bone of (?:these symbols|the most common causes|the best ways|the top causes|the main sources"
              r"|these steps)\b",
              "'one of', picking one of several things, not a quantity"),
    NotALimit({"XC": (24, 26), "CL": (34,), "CH": (43, 47), "CK": (63,), "MG": (69,)},
              r"\b(?:if you do not have one already|if you have one|or one that has been washed|choose the one that"
              r"|buy a new one|if there is one|if it has one)\b",
              "'one' as a pronoun standing for something already named"),
    NotALimit({"front": (6,), "CH": (41,)}, r"\bone section at a time\b|\bsmall batches one at a time\b",
              "the order of working, one thing after another, not a quantity"),
    NotALimit({"front": (10,), "CL": (29,)}, r"\bpalm of one hand\b", "which hand, in a handwashing step"),
    NotALimit({"XC": (19,)}, r"\bfrom one food to another\b", "how allergens move between foods, not a quantity"),
    NotALimit({"CL": (32,)}, r"\bIf you only have one sink\b", "a kitchen layout the method asks about"),
    NotALimit({"CH": (42, 43)}, r"\bYOU CAN USE ONE OR MORE OF THESE\b",
              "how many of the printed chilling options the reader may choose"),
    NotALimit({"MG": (68, 73)}, r"\bmore than one (?:way|person|shift|signature)\b|\busing one option\b",
              "a description of several ways, people or shifts, not a quantity to work to"),
    NotALimit({"MG": (72,)}, r"\bone-off dishes\b", "'one-off', meaning occasional"),
    NotALimit({"XC": (19,), "CH": (45, 47), "CK": (63,), "MG": (73,)},
              r"\b(?:foods once opened|Once food has been defrosted|Once the food is defrosted"
              r"|once it has started to defrost|keep food once prepared or opened|Once you have worked)\b",
              "'once' meaning 'after' or 'as soon as', not a count"),
    NotALimit({"XC": (22,)}, r"\bdesigned to be used once\b", "how packaging is designed, not a rule for the business"),
    NotALimit({"CH": (43,)}, r"\bYou will only need to do this once\b",
              "a trial of chilling options run one time, not a limit"),
    NotALimit({"CH": (42,)}, r"\bCut joints of meat in half\b",
              "a way to chill a joint faster: a technique, not a figure to measure against"),
]


def _figures(part: str) -> list[tuple[int, int]]:
    """Spans of the figures in a part: each token holding a digit, less any punctuation at its edges, and each
    number word."""
    spans = []
    for match in FIGURE.finditer(part):
        start, end = match.span()
        while not (part[start].isalnum() or part[start] == "°"):
            start += 1
        while not (part[end - 1].isalnum() or part[end - 1] == "°"):
            end -= 1
        spans.append((start, end))
    return spans + [match.span() for match in NUMBER_WORD.finditer(part)]


def _inside(pattern: re.Pattern, part: str, start: int, end: int) -> bool:
    """Whether the span lies inside a match of `pattern` in `part`."""
    return any(m.start() <= start and end <= m.end() for m in pattern.finditer(part))


class FigureAccounts(NamedTuple):
    counts: Counter      # figures per account: "limit", or the reason of the pattern that matched
    unaccounted: list    # figures inside no limit's text and matched by no pattern
    both: list           # figures inside a limit's text and also matched by a pattern
    used: set            # indices of the patterns that accounted for a figure


def figure_accounts(limits: list[dict]) -> FigureAccounts:
    """Account for each figure: inside a limit's text, or matched by a pattern in NOT_LIMITS, never both."""
    patterns = [re.compile(entry.pattern) for entry in NOT_LIMITS]
    result = FigureAccounts(Counter(), [], [], set())
    for name in ["front", *METHOD_COUNTS]:
        for page, method, part in _parts(name):
            owner = "front" if name == "front" else method
            texts = [re.compile(re.escape(limit["text"])) for limit in limits
                     if limit["page"] == page and limit["method"] == owner]
            for start, end in _figures(part):
                figure = (name, page, method, part[start:end], part)
                in_limit = any(_inside(text, part, start, end) for text in texts)
                matched = [i for i, entry in enumerate(NOT_LIMITS)
                           if page in entry.where.get(name, ()) and _inside(patterns[i], part, start, end)]
                if in_limit:
                    result.counts["limit"] += 1
                    if matched:
                        result.both.append(figure)
                elif matched:
                    result.used.update(matched)
                    result.counts[NOT_LIMITS[matched[0]].reason] += 1
                else:
                    result.unaccounted.append(figure)
    return result


def test_no_figure_is_unaccounted_for():
    accounts = figure_accounts(_limits())
    assert not accounts.unaccounted, accounts.unaccounted
    unused = set(range(len(NOT_LIMITS))) - accounts.used
    assert not unused, [NOT_LIMITS[i].pattern for i in sorted(unused)]
    assert accounts.counts["limit"] > 0


def test_no_figure_is_both_a_limit_and_not_a_limit():
    # A pattern in NOT_LIMITS must not also match a figure the table holds as a limit.
    accounts = figure_accounts(_limits())
    assert not accounts.both, accounts.both


def test_a_figure_both_a_limit_and_not_a_limit_is_reported():
    extra = {"id": "L-99", "value": "5", "text": "5 \u2013 hygiene standards are very good", "method": "front",
             "page": 8}
    both = figure_accounts([*_limits(), extra]).both
    assert [(name, page, figure) for name, page, _, figure, _ in both] == [("front", 8, "5")]


# render-limits-check.py renders limits.json as a table for reading against the PDF page by page.

def _run_render_limits_check(*args):
    script = ROOT / "scripts" / "uk-food" / "render-limits-check.py"
    return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)


def _render_module():
    spec = importlib.util.spec_from_file_location("render_limits_check",
                                                  ROOT / "scripts" / "uk-food" / "render-limits-check.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _introduction(text: str) -> str:
    return text.split("\n## ")[0]


def test_render_limits_check_introduction(tmp_path):
    out = tmp_path / "limits-check.md"
    assert _run_render_limits_check(DATA_DIR, out).returncode == 0
    intro = _introduction(out.read_text(encoding="utf-8"))
    # The PDF as it is on the owner's disk, by default; the FSA's own file name lacks the "01-" prefix.
    assert "`01-sfbb-caterers-pack-fixed_0_3.pdf` in `~/Documents/ArcKit/food-safety-overlay/sfbb-caterers/`" in intro
    for words in ("figures and named standards", "not a list of every frequency", "every day",
                  "beginning of the day", "daily and weekly", "several rows on one page show the same sentence",
                  "more than one figure",
                  "safe time and temperature combinations", "page 51", "prints no page numbers"):
        assert words in intro, words
    # The two places the pack prints differently, with the pages taken from limits.json.
    note = next(line for line in intro.splitlines() if "printed differently in two places" in line.lower())
    assert "\"keep it above 63°C\" (page 60)" in note and "\"kept at 63°C or above\" (page 60)" in note
    assert "\"High risk ready to eat foods\" (page 40)" in note and "\"Ready-to-eat foods\" (page 63)" in note
    # The two stage clean is listed where the pack prints it with a figure: the note takes that page from limits.json,
    # and gives no page for the places that name it in words, which the data does not hold.
    staged = sorted({limit["page"] for limit in _limits() if limit["value"].endswith(" stage")})
    assert len(staged) == 1
    assert (f"- A quantity is listed only where the pack prints it as a figure. The two stage clean, for one, is listed on page {staged[0]}, "
            "where it is printed with a figure, and not on the pages that name it in words.") in intro
    other = tmp_path / "other.md"
    assert _run_render_limits_check("--pdf", "/elsewhere/pack.pdf", DATA_DIR, other).returncode == 0
    assert "`pack.pdf` in `/elsewhere/`" in _introduction(other.read_text(encoding="utf-8"))


def test_printed_differently_phrases_are_in_the_data():
    # Each phrase the note quotes is in the text of a limit with that value, which test_limit_text_is_quoted
    # holds to the transcribed data.
    limits = _limits()
    for value, *phrases in _render_module().PRINTED_DIFFERENTLY:
        for phrase in phrases:
            assert any(limit["value"] == value and phrase in limit["text"] for limit in limits), (value, phrase)


def test_render_limits_check_writes_one_row_per_limit(tmp_path):
    out = tmp_path / "limits-check.md"
    result = _run_render_limits_check(DATA_DIR, out)
    assert result.returncode == 0, result.stderr
    text = out.read_text(encoding="utf-8")
    rows = [line for line in text.splitlines() if line.startswith("| ")
            and not line.startswith(("| Value |", "| --- |"))]
    limits = _limits()
    assert len(rows) == len(limits)
    # Grouped by section in page order, which is limits.json's own order.
    for limit, row in zip(limits, rows):
        cells = [cell.strip() for cell in row.strip("|").split(" | ")]
        assert cells[0] == limit["value"] and cells[1] == limit["text"] and cells[3] == str(limit["page"])
        assert cells[2].endswith(f"({limit['method']})")


def test_render_limits_check_usage():
    # Python itself exits 2 when the script is missing, so the usage message is checked too.
    result = _run_render_limits_check()
    assert result.returncode == 2 and "usage:" in result.stderr and "--pdf" in result.stderr, result.stderr


# differences.md: where the FSA's 38 individual sheets, published beside the full pack, differ from it in
# wording. The sheets are never committed, so their file names are listed here and the note must name each.
SHEET_FILES = [
    "02-sfbb-caterers-personal_hygiene_0_0.pdf", "03-sfbb-caterers-pack-food-allergies_0.pdf",
    "04-sfbb-caterers-cloths_0.pdf", "05-sfbb-caterers-separating-foods_2.pdf",
    "06-fsa-sfbb-chinese-cuisine-cross-contamination-physical_and_chemical_contamination_2__1_.pdf",
    "07-sfbb-caterers-pack-pest-control_0_4.pdf", "08-fsa-sfbb-chinese-cuisine-pack-maintenance_1.pdf",
    "09-sfbb-indian-cuisines-handwashing_0.pdf", "10-sfbb-cleaning-04-your-cleaning-schedule-fix_1.pdf",
    "11-sfbb-chinese-cleaning-02-cleaning-effectively.pdf", "12-sfbb-indian-cuisines-clean-clear-as-you-go_0.pdf",
    "13-sfbb-chilling-01-chilled-storage-and-display_4.pdf", "14-fsa-sfbb-chinese-cuisine-chilling_1.pdf",
    "15-sfbb-chilling-03-defrosting_3_1.pdf", "16-sfbb-chilling-04-freezing.pdf",
    "17-sfbb-caterer-cooking-01-cooking-safely_0.pdf", "18-sfbb-caterer-cooking-02-foods-that-need-extra-care_0.pdf",
    "19-sfbb-caterer-cooking-03-reheating_2.pdf", "20-sfbb-caterer-cooking-05-checking-your-menu_0.pdf",
    "21-sfbb-caterer-cooking-06-hot-holding_0.pdf", "22-sfbb-caterer-cooking-07-ready-to-eat-food.pdf",
    "23-sfbb-caterer-cooking-04-acrylamide_0.pdf", "24-sfbb-management-01-opening-closing-checks__1__1.pdf",
    "25-sfbb-management-02-prove-it_4.pdf", "26-sfbb-management-03-managing-food-allergen-information_2_3.pdf",
    "27-sfbb-management-04-training-and-supervison-customers_4.pdf",
    "28-sfbb-management-05-suppliers-and-contractors.pdf", "29-sfbb-management-06-stock-control_4.pdf",
    "30-sfbb-management-07-product-recall_4.pdf", "31-sfbb-management-08-safe-method-completion-record.pdf",
    "32-fsa-sfbb-diary-front-cover_0.pdf", "33-sfbb-diary-02-introduction_4.pdf",
    "34-fsa-sfbb-diary-training-record_0.pdf", "35-fsa-sfbb-diary-suppliers-list_1.pdf",
    "36-fsa-sfbb-contacts-list_0.pdf", "37-fsa-sfbb-cleaning-schedule_0.pdf", "38-fsa-sfbb-prove-it.pdf",
    "39-sfbb-diary-07-diary-and-4-weekly-review-fixed_0.pdf",
]


def test_differences_names_every_sheet():
    path = DATA_DIR / "differences.md"
    assert path.is_file(), "differences.md is missing"
    text = path.read_text(encoding="utf-8")
    assert len(SHEET_FILES) == len(set(SHEET_FILES)) == 38
    assert [name for name in SHEET_FILES if f"`{name}`" not in text] == []
    assert "Contains public sector information licensed under the Open Government Licence v3.0." in text


# The JSON schema, checked against the same files the helper validates by hand.

SCHEMA = _load(ROOT / "plugins" / "arckit-uk-food" / "schemas" / "uk-food-sfbb-data-1.0.schema.json")
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())
SHARED = ROOT / "tests" / "fixtures" / "uk-food"
EVERY_FIELD = _load(SHARED / "data-every-field.json")["section"]
EVERY_FIELD_FRONT = _load(SHARED / "data-every-field.json")["front"]
EVERY_FIELD_DIARY = _load(SHARED / "data-every-field.json")["diary"]
EVERY_FIELD_LIMITS = _load(SHARED / "data-every-field.json")["limits"]


def test_schema_is_valid_and_accepts_every_documented_field():
    Draft202012Validator.check_schema(SCHEMA)
    VALIDATOR.validate(EVERY_FIELD)
    VALIDATOR.validate(EVERY_FIELD_FRONT)
    VALIDATOR.validate(EVERY_FIELD_DIARY)
    VALIDATOR.validate(EVERY_FIELD_LIMITS)


def test_schema_rejects_unknown_keys_and_bad_pages():
    bad = json.loads(json.dumps(EVERY_FIELD))
    bad["methods"][0]["blocks"][0]["rows"][0]["page"] = 101
    assert not VALIDATOR.is_valid(bad)
    bad = json.loads(json.dumps(EVERY_FIELD))
    bad["methods"][0]["blocks"][2]["surprise"] = 1
    assert not VALIDATOR.is_valid(bad)


def test_data_files_match_schema():
    assert LIMITS.is_file(), "limits.json is missing"
    for name in ["source", *DATA_FILES, "limits"]:
        path = DATA_DIR / f"{name}.json"
        if path.is_file():
            VALIDATOR.validate(_load(path))


# compare-reading.py run as a program: exit 0 clean, 1 differences, 2 usage error.

def _run_compare(*args):
    return subprocess.run([sys.executable, str(ROOT / "scripts" / "uk-food" / "compare-reading.py"), *map(str, args)],
                          capture_output=True, text=True)


def test_compare_reading_exit_codes(tmp_path):
    data = tmp_path / "data.json"
    data.write_text(json.dumps({"methods": [{"id": "XC-01", "title": "Wash", "pages": [1],
                                              "blocks": [{"kind": "text", "text": "Dry", "page": 1}]}]}),
                    encoding="utf-8")
    reading = tmp_path / "reading.txt"
    reading.write_text("wash\ndry\n", encoding="utf-8")
    assert _run_compare(data, reading).returncode == 0
    reading.write_text("wash\n", encoding="utf-8")
    result = _run_compare(data, reading)
    assert result.returncode == 1 and "in data, not in reading" in result.stdout
    assert _run_compare(data).returncode == 2


# The shared fixture and mutation table, also run by tests/plugin/uk-food-data.test.mjs,
# keep the helper's validateData and the JSON schema accepting and rejecting the same files.

def _apply(fixture, ops):
    doc = json.loads(json.dumps(fixture))
    for op in ops:
        *parents, last = [int(k) if k.isdigit() else k for k in op["path"].split("/")[1:]]
        node = doc
        for key in parents:
            node = node[key]
        if op["op"] == "delete":
            del node[last]
        else:
            node[last] = op["value"]
    return doc


MUTATIONS = [m for m in _load(SHARED / "data-mutations.json") if "schema" in m.get("checkedBy", ["node", "schema"])]


def _schema_ok(doc):
    return all(VALIDATOR.is_valid(doc[part]) for part in ("source", "section", "front", "diary", "limits"))


def test_shared_fixture_validates():
    assert _schema_ok(_load(SHARED / "data-every-field.json"))


@pytest.mark.parametrize("mutation", MUTATIONS, ids=[m["name"] for m in MUTATIONS])
def test_schema_rejects_each_mutation(mutation):
    doc = _apply(_load(SHARED / "data-every-field.json"), mutation["ops"])
    assert not _schema_ok(doc)
