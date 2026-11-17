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
import importlib.util
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

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


def page_differences(data_dir: Path, fixture: dict, exceptions: dict,
                     files: list[str] | None = None) -> dict[int, dict[str, Counter]]:
    """Pages where the data's words and the fixture's words differ.

    Returns {page: {"missing": words only in the fixture, "extra": words only in
    the data}} for differing pages; an empty dict means a perfect match. Only
    pages a file declares are compared.
    """
    names = files if files is not None else existing_files(data_dir)
    declared: set[int] = set()
    for name in names:
        declared |= declared_pages(_load(data_dir / f"{name}.json"))
    transcribed = page_words(data_dir, names)
    result: dict[int, dict[str, Counter]] = {}
    for page in sorted(declared):
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


def test_fixture_matches_declared_source():
    source = _load(DATA_DIR / "source.json")
    assert _load(FIXTURE)["source"]["sha256"] == source["sha256"]


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


def test_section_title_counts_on_its_first_page():
    section = {"id": "XC", "title": "Cross-contamination", "pages": [3, 4], "intro": [{"text": "Keep apart", "page": 4}]}
    found = [(page, text) for page, text, _ in strings_of({"section": section})]
    assert (3, "Cross-contamination") in found and (4, "Keep apart") in found


# The JSON schema, checked against the same files the helper validates by hand.

SCHEMA = _load(ROOT / "plugins" / "arckit-uk-food" / "schemas" / "uk-food-sfbb-data-1.0.schema.json")
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())
SHARED = ROOT / "tests" / "fixtures" / "uk-food"
EVERY_FIELD = _load(SHARED / "data-every-field.json")["section"]


def test_schema_is_valid_and_accepts_every_documented_field():
    Draft202012Validator.check_schema(SCHEMA)
    VALIDATOR.validate(EVERY_FIELD)


def test_schema_rejects_unknown_keys_and_bad_pages():
    bad = json.loads(json.dumps(EVERY_FIELD))
    bad["methods"][0]["blocks"][0]["rows"][0]["page"] = 101
    assert not VALIDATOR.is_valid(bad)
    bad = json.loads(json.dumps(EVERY_FIELD))
    bad["methods"][0]["blocks"][2]["surprise"] = 1
    assert not VALIDATOR.is_valid(bad)


def test_data_files_match_schema():
    for name in ["source", *DATA_FILES]:
        path = DATA_DIR / f"{name}.json"
        if path.is_file() and name not in ("front", "diary"):
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


# The shared fixture and mutation table, also run by tests/plugin/uk-food-worksheet.test.mjs,
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
    return VALIDATOR.is_valid(doc["source"]) and VALIDATOR.is_valid(doc["section"])


def test_shared_fixture_validates():
    assert _schema_ok(_load(SHARED / "data-every-field.json"))


@pytest.mark.parametrize("mutation", MUTATIONS, ids=[m["name"] for m in MUTATIONS])
def test_schema_rejects_each_mutation(mutation):
    doc = _apply(_load(SHARED / "data-every-field.json"), mutation["ops"])
    assert not _schema_ok(doc)
