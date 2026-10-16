#!/usr/bin/env python3
"""Fetch and refresh the NORA and GEMMA extracts that /arckit:nl-nora and
/arckit:nl-gemma assess against.

NORA and GEMMA are too large to assess from model knowledge, and NORA's
licence (CC BY-ND 3.0 NL) rules out shipping a reworked copy. So ArcKit
ships no NORA or GEMMA text: this script builds the extracts on the user's
machine, from the public sources, into projects/000-global/external/.

    nora   nora-principes.md             from the NORA Online Semantic MediaWiki API
    gemma  gemma-principes.md            from `export/GEMMA release.xml` in the
           gemma-referentiecomponenten.md  GEMMA Archi-repository on GitHub
           gemma-bedrijfsfuncties.md

Each extract keeps its title as the first line (that is how the commands
identify it) and carries a version stamp on the second line:

    <!-- arckit-extract: source=nora origin=api version=... fetched=YYYY-MM-DD -->

On every run the script asks the live source for its version, once, and
refreshes the extract only when the source has changed. An extract without
a stamp counts as placed by hand: nothing replaces it, not even --from-dump
or --from-xml, unless --force is given. One built from a local file
(origin=file) is not refreshed from the live source unless --force is given,
but a new --from-* build replaces it. Offline, an existing extract is kept
and reported as such. Downloads are requested compressed.

Text is copied verbatim (wiki markup stripped, wording untouched). Relations
that do not resolve are reported in a Data notes section, not corrected.

Usage:
    python3 nl-references.py {nora,gemma,all} [--dir DIR] [--force]
    python3 nl-references.py nora  --from-dump nora-dump.xml [...]   # offline
    python3 nl-references.py gemma --from-xml "GEMMA release.xml"    # offline

Prints one JSON object per source on stdout, for example
    {"source": "nora", "status": "current", "version": "...", "files": [...]}
status is one of: fetched, refreshed, current, manual, offline, missing.
Exit code 0 when every requested source has a usable extract, 2 otherwise.
"""
import argparse
import html
import http.client
import json
import os
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zlib
from collections import defaultdict
from xml.parsers import expat
from datetime import date, datetime, timezone

DEFAULT_DIR = os.path.join("projects", "000-global", "external")
USER_AGENT = "arckit-nl-references (+https://github.com/tractorjuice/arc-kit)"
STAMP_RE = re.compile(r"^<!-- arckit-extract: (.*?) -->\s*$")

NORA_API = "https://www.noraonline.nl/api.php"
NORA_WIKI = "https://www.noraonline.nl/wiki/"
NORA_FILE = "nora-principes.md"
NORA_TITLE = "# NORA — Architectuurprincipes (extract)"
NORA_TYPES = ("Kernwaarde", "Kwaliteitsdoel", "Architectuurprincipe", "Implicatie")
NORA_LAYERS = {
    "1": "Grondslagenlaag",
    "2": "Organisatorische laag",
    "3": "Informatielaag",
    "4": "Applicatielaag",
    "5": "IT-Infrastructuurlaag",
}
MW_NS = "{http://www.mediawiki.org/xml/export-0.11/}"

GEMMA_REPO = "VNG-Realisatie/GEMMA-Archi-repository"
GEMMA_REPO_URL = f"https://github.com/{GEMMA_REPO}"
GEMMA_EXPORT = "export/GEMMA release.xml"
GEMMA_FILES = {
    "gemma-principes.md": "# GEMMA — Architectuurprincipes (extract)",
    "gemma-referentiecomponenten.md": "# GEMMA — Referentiecomponenten (extract)",
    "gemma-bedrijfsfuncties.md": "# GEMMA — Bedrijfsfunctiemodel (extract)",
}
AM_NS = "{http://www.opengroup.org/xsd/archimate/3.0/}"
XSI_TYPE = "{http://www.w3.org/2001/XMLSchema-instance}type"
COMPONENT_TYPES = ("Referentiecomponent", "Buitengemeentelijke voorziening")


class SourceUnavailable(Exception):
    """The live source could not be reached or returned something unusable."""


# ---------------------------------------------------------------- shared

def log(msg):
    print(msg, file=sys.stderr)


MAX_BYTES = 64 * 1024 * 1024   # GEMMA release.xml is about 13 MB


def http_get(url, params=None, timeout=60):
    """GET a URL and return the body, unpacked if the server compressed it."""
    if params:
        url += "?" + urllib.parse.urlencode(params)
    where = url.split("?")[0]
    too_large = f"{where}: response larger than {MAX_BYTES // 2**20} MB, refused"
    # Ask for gzip: GEMMA release.xml is 13 MB as it is, under 2 MB compressed.
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Encoding": "gzip"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read(MAX_BYTES + 1)
            encoding = (resp.headers.get("Content-Encoding") or "").strip().lower()
    # URLError, HTTPError and timeouts are OSErrors; a connection dropped
    # mid-response (IncompleteRead, BadStatusLine) is an HTTPException.
    except (OSError, ValueError, http.client.HTTPException) as exc:
        raise SourceUnavailable(f"{where}: {exc}") from exc
    if len(data) > MAX_BYTES:
        raise SourceUnavailable(too_large)
    if encoding == "gzip":
        # Unpack with the same cap, so a small compressed body cannot expand
        # without limit, and refuse a stream that was cut short.
        unpack = zlib.decompressobj(16 + zlib.MAX_WBITS)
        try:
            data = unpack.decompress(data, MAX_BYTES + 1)
        except zlib.error as exc:
            raise SourceUnavailable(f"{where}: compressed response is corrupt ({exc})") from exc
        if len(data) > MAX_BYTES:
            raise SourceUnavailable(too_large)
        if not unpack.eof:
            raise SourceUnavailable(f"{where}: compressed response was cut short")
    elif encoding not in ("", "identity"):
        raise SourceUnavailable(f"{where}: unsupported Content-Encoding {encoding!r}")
    return data


def http_json(url, params=None):
    try:
        return json.loads(http_get(url, params))
    except ValueError as exc:  # JSONDecodeError, or bytes that are not UTF-8
        raise SourceUnavailable(f"{url}: not JSON ({exc})") from exc


def parse_xml(data, label):
    """Parse XML, refusing any DTD or entity declaration (XXE and entity-expansion guard).

    The check runs inside expat, on the document as the parser decodes it, so
    it holds in every encoding: a byte search for "<!DOCTYPE" misses UTF-16.
    Neither source uses a DTD; MediaWiki and Archi exports carry none."""
    def refuse(*_args):
        raise SourceUnavailable(f"refusing {label}: contains a DOCTYPE or ENTITY declaration")

    scan = expat.ParserCreate()
    scan.StartDoctypeDeclHandler = refuse
    scan.EntityDeclHandler = refuse
    try:
        scan.Parse(data, True)
        return ET.fromstring(data)
    except (expat.ExpatError, ET.ParseError) as exc:
        raise SourceUnavailable(f"{label}: not valid XML ({exc})") from exc


def read_stamp(path):
    """Return (first line, stamp dict or None) for an existing extract.

    A file that cannot be read as UTF-8 is not one this script wrote: it
    returns (None, None), so it counts as placed by hand and is left alone."""
    try:
        with open(path, encoding="utf-8") as f:
            first, second = f.readline().rstrip("\n"), f.readline()
    except (OSError, UnicodeDecodeError):
        return None, None
    m = STAMP_RE.match(second)
    if not m:
        return first, None
    return first, dict(kv.split("=", 1) for kv in m.group(1).split() if "=" in kv)


def stamp_line(source, origin, version):
    return (f"<!-- arckit-extract: source={source} origin={origin} version={version} "
            f"fetched={date.today().isoformat()} -->")


# Characters that render as nothing: Unicode format characters (zero-width,
# bidi controls, the U+E0000 tag block), private-use and unassigned code points,
# controls other than newline and tab, variation selectors, and the blank
# letters some fonts draw as empty. Any of them can carry a hidden message.
INVISIBLE_CATEGORIES = {"Cf", "Co", "Cn", "Cs", "Zl", "Zp"}
INVISIBLE_EXTRA = set(range(0xFE00, 0xFE10)) | set(range(0xE0100, 0xE01F0)) | {
    0x034F, 0x115F, 0x1160, 0x17B4, 0x17B5, 0x2800, 0x3164, 0xFFA0}
# This script's own source links. No `&` or backslash inside, so nothing in a
# link can be read as an entity or an escape; a URL with either is escaped
# like any other text and stays visible.
AUTOLINK = re.compile(r"<https?://[^\s<>&\\]*>")


def visible_chars(text):
    return "".join(
        ch for ch in text
        if ch in "\n\t" or not (unicodedata.category(ch) in INVISIBLE_CATEGORIES
                                or unicodedata.category(ch) == "Cc"
                                or ord(ch) in INVISIBLE_EXTRA))


def neutralise(text):
    """Make every part of an extract render as the text it is.

    The sources are editable by others, and the model reads the raw Markdown,
    so nothing may be hidden from a person reading the rendered page. This is
    an allow-list, not a list of known tricks: after invisible characters are
    removed, every `&` and every `<` is escaped except in the `<https://...>`
    autolinks this script writes, so no entity and no HTML of any kind
    (comment, tag, CDATA, processing instruction) can form; and below the
    header every backslash and every `[` is escaped, so no link title, image
    alt text, footnote or reference definition can form.
    Hidden text is not deleted but shown, where a reviewer can see it. Runs
    over the whole extract after every field is in place, so no field and no
    order of cleaning steps can get round it."""
    text = visible_chars(text)
    # The header blockquote (before the first section) is this script's own
    # text and links to its sources; everything after it holds source text.
    split = text.find("\n## ")
    split = len(text) if split < 0 else split

    def escape(segment, in_body):
        # Escape unconditionally rather than recognise syntax: deciding what
        # counts as an entity or an escaped bracket is exactly where a filter
        # and a renderer disagree (`&#8203` without `;`, `\\[` = `\` + `[`).
        segment = segment.replace("&", "&amp;").replace("<", "&lt;")
        if in_body:
            segment = segment.replace("\\", "\\\\").replace("[", "\\[")
        return segment

    parts, pos = [], 0
    for m in list(AUTOLINK.finditer(text)) + [None]:
        end = m.start() if m else len(text)
        for a, b in ((pos, min(end, split)), (max(pos, split), end)):
            if a < b:
                parts.append(escape(text[a:b], a >= split))
        if m:
            parts.append(m.group(0))   # this script's own <https://...> link: left as written
            pos = m.end()
    return "".join(parts)


def write_extract(path, title, stamp, body):
    """body starts with the title line; the stamp goes in as line 2."""
    assert body.startswith(title + "\n"), f"{path}: body does not start with its title"
    text = title + "\n" + stamp + "\n" + neutralise(body[len(title) + 1:])
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, path)


def clean(value):
    """Strip wiki markup and entities; never rewords the text."""
    v = (value or "").replace("\r\n", "\n")
    # HTML comments are invisible on the rendered page but read in full by
    # the model; drop them, raw and entity-encoded, so nothing hidden in a
    # wiki edit reaches the extract.
    v = re.sub(r"<!--.*?(?:-->|$)", "", v, flags=re.S)
    v = html.unescape(v).replace("\u00a0", " ")
    v = re.sub(r"<!--.*?(?:-->|$)", "", v, flags=re.S)
    v = re.sub(r"\{\{[^{}]*\}\}", "", v)                        # templates
    v = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"\1", v)     # [[target|label]] -> label
    v = re.sub(r"\[(https?://\S+)\s+([^\]]+)\]", r"\2 (\1)", v)  # [url label]
    v = re.sub(r"<br\s*/?>", "\n", v, flags=re.I)
    v = re.sub(r"</?(?:span|div|small|sup|sub|u|s)[^>]*>", "", v, flags=re.I)
    # Bullets before bold: once '''x''' is **x**, a line opening in bold
    # would read as a sub-bullet.
    v = re.sub(r"^\*\*\s*", "  - ", v, flags=re.M)              # wiki sub-bullets
    v = re.sub(r"^\*\s*", "- ", v, flags=re.M)                  # wiki bullets
    v = re.sub(r"'''(.*?)'''", r"**\1**", v)
    v = re.sub(r"''(.*?)''", r"*\1*", v)
    v = re.sub(r"[ \t]+\n", "\n", v)
    return re.sub(r"\n{3,}", "\n\n", v).strip()


def data_notes(notes, what):
    lines = ["## Data notes\n", f"Inconsistencies found in the {what}. They are reported, not corrected.\n"]
    lines += [f"- {n}" for n in notes] or ["- None."]
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------- NORA

NORA_QUERY = "[[Elementtype::" + "||".join(NORA_TYPES) + "]]"


def nora_ask(query, printouts=()):
    """Run a Semantic MediaWiki ask query, following offsets; yield (title, printouts)."""
    offset = 0
    while True:
        q = query + "".join(f"|?{p}" for p in printouts) + f"|limit=200|offset={offset}"
        data = http_json(NORA_API, {"action": "ask", "query": q, "format": "json"})
        if "query" not in data:
            raise SourceUnavailable(f"NORA ask query failed: {data.get('error', data)}")
        results = data["query"].get("results") or {}
        for title, row in results.items():
            yield title, row.get("printouts", {})
        nxt = data.get("query-continue-offset")
        if not nxt or not results:
            return
        offset = int(nxt)


def nora_live_version():
    """(version, titles): the latest modification of any element page of the
    four types plus their count, and the titles of those pages.

    The count makes a deleted element change the version too."""
    rows = list(nora_ask(NORA_QUERY, ("Modification date",)))
    latest = 0
    for _title, printouts in rows:
        for values in printouts.values():  # label is localised (Wijzigingsdatum)
            for v in values:
                latest = max(latest, int(v.get("timestamp", 0)))
    if not rows or not latest:
        raise SourceUnavailable("NORA ask query returned no element pages")
    stamp = datetime.fromtimestamp(latest, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"{stamp}/{len(rows)}", [t for t, _ in rows]


def nora_export(titles):
    """Fetch the pages as MediaWiki XML export, 50 titles per request."""
    roots = []
    for i in range(0, len(titles), 50):
        data = http_get(NORA_API, {"action": "query", "titles": "|".join(titles[i:i + 50]),
                                   "export": "1", "exportnowrap": "1"})
        roots.append(parse_xml(data, "NORA export"))
    return roots


def nora_pages(roots):
    """Yield (title, latest revision timestamp, wikitext) for every page."""
    for root in roots:
        for page in root.iter(MW_NS + "page"):
            yield (page.findtext(MW_NS + "title"),
                   page.findtext(f"{MW_NS}revision/{MW_NS}timestamp") or "",
                   page.findtext(f"{MW_NS}revision/{MW_NS}text") or "")


def element_props(text):
    """Parse the `{{#element: |Key=Value ...}}` block; values may span lines."""
    m = re.search(r"\{\{#[Ee]lement:(.*?)\n\}\}", text, re.S)
    body = m.group(1) if m else text
    props, key = {}, None
    for line in body.split("\n"):
        km = re.match(r"^\|\s*([^=|]+?)\s*=(.*)$", line)
        if km:
            key = km.group(1).strip()
            props[key] = km.group(2)
        elif key is not None:
            props[key] += "\n" + line
    return {k: v.strip() for k, v in props.items()}


def nora_load(roots):
    type_re = re.compile(r"\|\s*Elementtype\s*=\s*([^\n|}]+)")
    elements, latest = {t: {} for t in NORA_TYPES}, ""
    for title, ts, text in nora_pages(roots):
        latest = max(latest, ts)
        m = type_re.search(text)
        if not m or m.group(1).strip() not in NORA_TYPES:
            continue
        p = element_props(text)
        if p.get("Status actualiteit") != "Actueel":
            continue
        elements[m.group(1).strip()][title] = p
    return elements, latest


def split_list(value):
    return [x.strip() for x in html.unescape(value).split(",") if x.strip()]


def nora_url(title):
    return NORA_WIKI + title.replace(" ", "_")


def nora_id_key(eid):
    m = re.match(r"([A-Za-z-]+)(\d+)(?:\.(\d+))?", eid)
    return (m.group(1), int(m.group(2)), int(m.group(3) or 0)) if m else (eid, 0, 0)


def nora_build(elements, latest, source_desc):
    kwd, kd = elements["Kernwaarde"], elements["Kwaliteitsdoel"]
    nap, imp = elements["Architectuurprincipe"], elements["Implicatie"]
    kd_id = {t: p.get("ID", "?") for t, p in kd.items()}
    notes = []

    def resolve_kd(names, owner):
        out = []
        for n in names:
            if n in kd_id:
                out.append(f"{kd_id[n]} {n.replace(' (Doel)', '')}")
            else:
                notes.append(f"{owner} references kwaliteitsdoel `{n}`, which is not a current kwaliteitsdoel.")
        return out

    imps_by_nap = {t: [] for t in nap}
    for title, p in imp.items():
        targets = split_list(p.get("Realiseert", ""))
        hit = False
        for target in targets:
            if target in imps_by_nap:
                imps_by_nap[target].append((title, p))
                hit = True
        if not hit:
            notes.append(f"Implicatie {p.get('ID', '?')} `{title}` realises `{', '.join(targets) or '(nothing)'}`, "
                         "which is not a current architectuurprincipe; it is omitted.")

    L = [NORA_TITLE + "\n"]
    L.append("> **Source:** NORA — Nederlandse Overheid Referentie Architectuur, "
             "[noraonline.nl](https://www.noraonline.nl). Copyright Staat der Nederlanden, licensed "
             "[CC BY-ND 3.0 NL](http://creativecommons.org/licenses/by-nd/3.0/nl/). "
             "Text is reproduced verbatim (wiki markup removed); it must not be adapted or translated.\n>\n"
             f"> **Dump:** {source_desc}, latest revision {latest[:10]}. "
             f"**Extracted:** {date.today().isoformat()} with `nl-references.py`.\n>\n"
             "> **Scope:** elements with *Status actualiteit = Actueel* only: "
             f"{len(kwd)} kernwaarden, {len(kd)} kwaliteitsdoelen, {len(nap)} architectuurprincipes, "
             f"{len({t for v in imps_by_nap.values() for t, _ in v})} implicaties "
             f"({sum(len(v) for v in imps_by_nap.values())} principle links; "
             "an implicatie that serves several principles is listed under each).\n")

    L.append("## NORA Vijflaagsmodel\n")
    L.append("| Laag | Naam |\n|---|---|")
    L += [f"| {k} | {v} |" for k, v in NORA_LAYERS.items()]
    L.append("")

    L.append("## Kernwaarden\n")
    for title, p in sorted(kwd.items(), key=lambda x: nora_id_key(x[1].get("ID", ""))):
        L.append(f"### {p.get('ID')} {title}\n")
        L.append(f"- **Bron:** <{nora_url(title)}>")
        L.append(f"- **Motiveert:** {', '.join(resolve_kd(split_list(p.get('Motiveert', '')), p.get('ID')))}\n")
        L.append(clean(p.get("Omschrijving", "")) + "\n")

    L.append("## Kwaliteitsdoelen\n")
    for title, p in sorted(kd.items(), key=lambda x: nora_id_key(x[1].get("ID", ""))):
        L.append(f"### {p.get('ID')} {title.replace(' (Doel)', '')}\n")
        L.append(f"- **Bron:** <{nora_url(title)}>\n")
        L.append(clean(p.get("Beschrijving", "")) + "\n")

    L.append("## Architectuurprincipes\n")
    for title, p in sorted(nap.items(), key=lambda x: nora_id_key(x[1].get("ID", ""))):
        nid = p.get("ID")
        L.append(f"### {nid} {title}\n")
        L.append(f"- **Bron:** <{nora_url(title)}>")
        L.append(f"- **Realiseert:** {', '.join(resolve_kd(split_list(p.get('Realiseert', '')), nid))}\n")
        L.append(f"**Stelling:** {clean(p.get('Stelling', ''))}\n")
        L.append(f"**Rationale:**\n\n{clean(p.get('Rationale', ''))}\n")
        rows = sorted(imps_by_nap[title], key=lambda x: nora_id_key(x[1].get("ID", "")))
        if not rows:
            notes.append(f"Architectuurprincipe {nid} `{title}` has no current implicaties.")
            continue
        L.append(f"#### Implicaties van {nid}\n")
        for ititle, ip in rows:
            layers = sorted(set(re.findall(r"[1-5]", ip.get("Laag binnen vijflaagsmodel", ""))))
            layer_txt = ", ".join(f"{x} {NORA_LAYERS[x]}" for x in layers) or "geen laag opgegeven"
            L.append(f"- **{ip.get('ID')} {ititle}** — laag: {layer_txt} — <{nora_url(ititle)}>  ")
            L.append("  " + clean(ip.get("Beschrijving", "")).replace("\n", "\n  "))
        L.append("")

    L.append(data_notes(notes, "source"))
    if not nap:
        raise SourceUnavailable("NORA source holds no current architectuurprincipes")
    return "\n".join(L)


def nora_from_api(live=None):
    """(version, texts) from the live source; `live` is a nora_live_version()
    result the caller already has, so the version is not fetched twice."""
    version, titles = live or nora_live_version()
    elements, latest = nora_load(nora_export(titles))
    return version, {NORA_FILE: nora_build(elements, latest, "NORA Online API export")}


def nora_from_dumps(paths):
    roots = []
    for p in paths:
        with open(p, "rb") as f:
            roots.append(parse_xml(f.read(), p))
    elements, latest = nora_load(roots)
    names = ", ".join(os.path.basename(p) for p in paths)
    text = nora_build(elements, latest, f"NORA Online export ({names})")
    return f"dump-{latest[:19] or 'unknown'}", {NORA_FILE: text}


# ---------------------------------------------------------------- GEMMA

def gemma_live_version():
    """(version, full SHA) of the last commit that changed the export; the
    version is the short SHA and the commit date."""
    commits = http_json(f"https://api.github.com/repos/{GEMMA_REPO}/commits",
                        {"path": GEMMA_EXPORT, "per_page": "1"})
    if not isinstance(commits, list) or not commits:
        raise SourceUnavailable(f"GitHub returned no commit for {GEMMA_EXPORT}: {commits}")
    record = commits[0] if isinstance(commits[0], dict) else {}
    sha = record.get("sha")
    if not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{40}", sha):   # goes into a URL path
        raise SourceUnavailable(f"GitHub returned an invalid commit id: {sha!r}")
    try:
        when = record["commit"]["committer"]["date"][:10]
    except (KeyError, TypeError) as exc:
        raise SourceUnavailable(f"GitHub returned an unexpected commit record: {exc!r}") from exc
    return f"{sha[:7]}-{when}", sha


def gemma_model(data):
    root = parse_xml(data, GEMMA_EXPORT)
    prop_names = {p.get("identifier"): p.findtext(AM_NS + "name") or ""
                  for p in root.iter(AM_NS + "propertyDefinition")}
    elements = {}
    for el in root.iter(AM_NS + "element"):
        props = {}
        for p in el.findall(f"{AM_NS}properties/{AM_NS}property"):
            props[prop_names.get(p.get("propertyDefinitionRef"), "?")] = p.findtext(AM_NS + "value") or ""
        elements[el.get("identifier")] = {
            "id": el.get("identifier"),
            "type": el.get(XSI_TYPE),
            "gtype": props.get("GEMMA type", ""),
            "name": (el.findtext(AM_NS + "name") or "").strip(),
            "doc": el.findtext(AM_NS + "documentation") or "",
            "props": props,
        }
    relations = [(r.get(XSI_TYPE), r.get("source"), r.get("target"))
                 for r in root.iter(AM_NS + "relationship")]
    if not elements:
        raise SourceUnavailable(f"{GEMMA_EXPORT} holds no elements")
    return elements, relations


class Graph:
    def __init__(self, elements, relations, notes):
        self.el = elements
        self.by_src = defaultdict(lambda: defaultdict(list))
        self.by_tgt = defaultdict(lambda: defaultdict(list))
        dangling = 0
        for rtype, src, tgt in relations:
            if src not in elements or tgt not in elements:
                dangling += 1
                continue
            self.by_src[src][rtype].append(tgt)
            self.by_tgt[tgt][rtype].append(src)
        self.model_notes = notes
        if dangling:
            notes.append(f"{dangling} relationship(s) in the model point to an element that is not in the "
                         "export; ignored.")

    def targets(self, eid, rtype, etype=None):
        return [t for t in self.by_src[eid][rtype] if etype is None or self.el[t]["type"] == etype]

    def sources(self, eid, rtype, etype=None):
        return [s for s in self.by_tgt[eid][rtype] if etype is None or self.el[s]["type"] == etype]

    def name(self, eid):
        return self.el[eid]["name"]

    def ancestors(self, eid, rtype="Aggregation"):
        """Aggregation parents of the same element type, transitively."""
        seen, todo, etype = set(), [eid], self.el[eid]["type"]
        while todo:
            for parent in self.sources(todo.pop(), rtype, etype):
                if parent not in seen:
                    seen.add(parent)
                    todo.append(parent)
        return seen


def names(graph, ids):
    return sorted({graph.name(i) for i in ids}, key=str.casefold)


def gemma_id_key(value):
    m = re.match(r"([A-Za-z]+)(\d+)", value or "")
    return (m.group(1), int(m.group(2))) if m else (value or "~", 0)


def gemma_header(title, source_desc, counts, extra=""):
    return (f"{title}\n\n"
            f"> **Source:** GEMMA — Gemeentelijke Model Architectuur, VNG Realisatie. "
            f"[GEMMA Archi-repository]({GEMMA_REPO_URL}), `{GEMMA_EXPORT}`, {source_desc}. "
            "Licensed EUPL (per the repository Readme). Text is reproduced verbatim (wiki markup removed).\n>\n"
            f"> **Extracted:** {date.today().isoformat()} with `nl-references.py`. **Scope:** {counts}\n"
            + (f">\n> {extra}\n" if extra else "") + "\n")


def gemma_principles(g, source_desc):
    notes = list(g.model_notes)
    principles = [e for e in g.el.values() if e["type"] == "Principle"]
    goals = sorted((e for e in g.el.values() if e["type"] == "Goal"), key=lambda e: e["name"].casefold())
    drivers = sorted((e for e in g.el.values() if e["type"] == "Driver"), key=lambda e: e["name"].casefold())
    principles.sort(key=lambda e: gemma_id_key(e["props"].get("ID")))

    L = [gemma_header(GEMMA_FILES["gemma-principes.md"], source_desc,
                      f"{len(principles)} principes, {len(goals)} kwaliteitsdoelen, {len(drivers)} kernwaarden.",
                      "Principles with *Bron: NORA* take omschrijving, stelling and rationale one-to-one from NORA "
                      "(© Staat der Nederlanden, CC BY-ND 3.0 NL — no adaptation or translation); "
                      "GEMMA-toelichting and implicaties are GEMMA's own.")]

    L.append("## Kernwaarden\n")
    for d in drivers:
        L.append(f"### {d['name']}\n")
        if d["doc"]:
            L.append(clean(d["doc"]) + "\n")
        motivated = names(g, g.sources(d["id"], "Influence", "Goal"))
        L.append(f"- **Beïnvloed door kwaliteitsdoelen:** {', '.join(motivated) or '—'}\n")

    L.append("## Kwaliteitsdoelen\n")
    for q in goals:
        L.append(f"### {q['name']}\n")
        if q["doc"]:
            L.append(clean(q["doc"]) + "\n")
        L.append(f"- **Draagt bij aan kernwaarden:** {', '.join(names(g, g.targets(q['id'], 'Influence', 'Driver'))) or '—'}")
        L.append(f"- **Gerealiseerd door principes:** "
                 f"{', '.join(names(g, g.sources(q['id'], 'Realization', 'Principle'))) or '—'}\n")

    L.append("## Architectuurprincipes\n")
    for p in principles:
        pr = p["props"]
        pid = pr.get("ID") or "(geen ID)"
        if not pr.get("ID"):
            notes.append(f"Principle `{p['name']}` has no ID.")
        L.append(f"### {pid} {p['name']}\n")
        L.append(f"- **Bron:** {pr.get('Heeft bron', '—')}")
        if pr.get("NORA principe"):
            L.append(f"- **NORA-principe:** {pr['NORA principe']}")
        L.append(f"- **Realiseert kwaliteitsdoelen:** "
                 f"{', '.join(names(g, g.targets(p['id'], 'Realization', 'Goal'))) or '—'}")
        related = set(g.targets(p["id"], "Association", "Principle")) | set(g.sources(p["id"], "Association", "Principle"))
        if related:
            L.append(f"- **Gerelateerd aan:** {', '.join(names(g, related))}")
        L.append("")
        L.append(f"**Stelling:** {clean(p['doc'])}\n")
        for label, key in (("Toelichting", "Toelichting"), ("GEMMA-toelichting", "GEMMA-toelichting"),
                           ("Implicaties", "Implicaties")):
            if pr.get(key):
                L.append(f"**{label}:**\n\n{clean(pr[key])}\n")
    L.append(data_notes(notes, "source model"))
    return "\n".join(L)


def component_functions(g, service_ids):
    """Business functions served by the given services or their aggregation ancestors."""
    funcs = set()
    for s in service_ids:
        for svc in {s} | g.ancestors(s):
            funcs.update(g.targets(svc, "Serving", "BusinessFunction"))
    return funcs


def gemma_components(g, source_desc):
    notes = []
    comps = [e for e in g.el.values() if e["type"] == "ApplicationComponent" and e["gtype"] in COMPONENT_TYPES]
    untyped = sum(1 for e in g.el.values() if e["type"] == "ApplicationComponent" and e["gtype"] not in COMPONENT_TYPES)
    if untyped:
        notes.append(f"{untyped} application component(s) without a GEMMA type (examples and illustrations) are omitted.")

    L = [gemma_header(GEMMA_FILES["gemma-referentiecomponenten.md"], source_desc,
                      f"{sum(c['gtype'] == COMPONENT_TYPES[0] for c in comps)} referentiecomponenten, "
                      f"{sum(c['gtype'] == COMPONENT_TYPES[1] for c in comps)} buitengemeentelijke voorzieningen.",
                      "A referentiecomponent is a product-independent kind of application; products from the "
                      "GEMMA Softwarecatalogus fill it. Business functions are derived: component realises "
                      "application service, service serves business function.")]

    for gtype, title in ((COMPONENT_TYPES[0], "Referentiecomponenten"),
                         (COMPONENT_TYPES[1], "Buitengemeentelijke voorzieningen")):
        L.append(f"## {title}\n")
        for c in sorted((c for c in comps if c["gtype"] == gtype), key=lambda c: c["name"].casefold()):
            pr = c["props"]
            L.append(f"### {c['name']}\n")
            meta = [f"Status: {pr.get('GEMMA status') or '—'}", f"Object ID: `{pr.get('Object ID', '—')}`"]
            biv = [f"{k[0]}: {pr[k]}" for k in ("Beschikbaarheid", "Integriteit", "Vertrouwelijkheid") if pr.get(k)]
            if biv:
                bbn = pr.get("BBN", "")
                if bbn and not bbn.upper().startswith("BBN"):
                    bbn = f"BBN {bbn}"
                meta.append("BIV " + " / ".join(biv) + (f" ({bbn})" if bbn else ""))
            L.append("- " + " · ".join(meta))
            groups = names(g, g.sources(c["id"], "Aggregation", "Grouping"))
            if groups:
                L.append(f"- **Groep:** {', '.join(groups)}")
            L.append("")
            if c["doc"]:
                L.append(clean(c["doc"]) + "\n")
            else:
                notes.append(f"{gtype} `{c['name']}` has no description.")
            if pr.get("Toelichting"):
                L.append(f"**Toelichting:** {clean(pr['Toelichting'])}\n")

            services = g.targets(c["id"], "Realization", "ApplicationService")
            if services:
                L.append("**Applicatieservices:**\n")
                for s in sorted(services, key=lambda i: g.name(i).casefold()):
                    desc = clean(g.el[s]["doc"]).replace("\n", " ")
                    L.append(f"- {g.name(s)}" + (f" — {desc}" if desc else ""))
                L.append("")
            bservices = g.targets(c["id"], "Realization", "BusinessService")
            if bservices:
                L.append(f"**Diensten:** {', '.join(names(g, bservices))}\n")
            funcs = component_functions(g, services)
            if funcs:
                L.append(f"**Ondersteunt bedrijfsfuncties:** {', '.join(names(g, funcs))}\n")
            standards = g.targets(c["id"], "Realization", "Constraint")
            if standards:
                L.append(f"**Standaarden:** {', '.join(names(g, standards))}\n")
            flows_out = names(g, g.targets(c["id"], "Flow", "ApplicationComponent"))
            flows_in = names(g, g.sources(c["id"], "Flow", "ApplicationComponent"))
            if flows_out or flows_in:
                L.append(f"**Gegevensuitwisseling:** levert aan {', '.join(flows_out) or '—'}; "
                         f"ontvangt van {', '.join(flows_in) or '—'}\n")
    L.append(data_notes(notes, "source model"))
    return "\n".join(L)


def gemma_functions(g, source_desc):
    notes = []
    funcs = {i for i, e in g.el.items() if e["type"] == "BusinessFunction"}
    children = {f: sorted(g.targets(f, "Aggregation", "BusinessFunction"), key=lambda i: g.name(i).casefold())
                for f in funcs}
    has_parent = {c for kids in children.values() for c in kids}
    roots = sorted(funcs - has_parent, key=lambda i: (g.el[i]["gtype"] != "Bedrijfsfunctie domein",
                                                      g.el[i]["gtype"] != "Bedrijfsfunctie laag",
                                                      g.name(i).casefold()))

    supporting = defaultdict(set)   # function -> components (direct)
    for c, e in g.el.items():
        if e["type"] == "ApplicationComponent" and e["gtype"] in COMPONENT_TYPES:
            for f in component_functions(g, g.targets(c, "Realization", "ApplicationService")):
                supporting[f].add(c)

    L = [gemma_header(GEMMA_FILES["gemma-bedrijfsfuncties.md"], source_desc,
                      f"{len(funcs)} bedrijfsfuncties in {len(roots)} top-level groups.",
                      "Tree follows the model's aggregation relations. *Ondersteund door* lists the "
                      "referentiecomponenten whose application services serve that function directly.")]
    seen = set()
    shared = sorted((f for f in funcs if sum(f in kids for kids in children.values()) > 1),
                    key=lambda i: g.name(i).casefold())

    def render(fid, depth):
        e = g.el[fid]
        if fid in seen:   # modelled under several parents: point back to the first occurrence
            ref = f"*{e['name']}* — zie eerder in dit document (valt onder meerdere bovenliggende functies)"
            L.append(f"{'  ' * max(depth - 4, 0)}- {ref}" if depth > 3 else f"- {ref}\n")
            return
        seen.add(fid)
        if depth <= 3:
            L.append(f"{'#' * (depth + 1)} {e['name']}\n")
            if e["gtype"]:
                L.append(f"*{e['gtype']}*\n")
            if e["doc"]:
                L.append(clean(e["doc"]) + "\n")
            if supporting[fid]:
                L.append(f"**Ondersteund door:** {', '.join(names(g, supporting[fid]))}\n")
        else:
            line = f"{'  ' * (depth - 4)}- **{e['name']}**"
            if e["doc"]:
                line += " — " + clean(e["doc"]).replace("\n", " ")
            if supporting[fid]:
                line += f" *(Ondersteund door: {', '.join(names(g, supporting[fid]))})*"
            L.append(line)
        for c in children[fid]:
            render(c, depth + 1)
        if depth == 3 and children[fid]:
            L.append("")

    for r in roots:
        render(r, 1)
    if shared:
        L.append("\n## Functies onder meerdere bovenliggende functies\n")
        L.append("Modelled deliberately under more than one parent; described at their first occurrence.\n")
        L += [f"- {g.name(f)}" for f in shared]
        L.append("")
    L.append(data_notes(notes, "source model"))
    return "\n".join(L)


def gemma_build(data, source_desc):
    elements, relations = gemma_model(data)
    g = Graph(elements, relations, [])
    return {
        "gemma-principes.md": gemma_principles(g, source_desc),
        "gemma-referentiecomponenten.md": gemma_components(g, source_desc),
        "gemma-bedrijfsfuncties.md": gemma_functions(g, source_desc),
    }


def gemma_from_api(live=None):
    """(version, texts) from the live source; `live` is a gemma_live_version()
    result the caller already has, so the version is not fetched twice."""
    version, sha = live or gemma_live_version()
    path = urllib.parse.quote(GEMMA_EXPORT)
    data = http_get(f"https://raw.githubusercontent.com/{GEMMA_REPO}/{sha}/{path}", timeout=180)
    return version, gemma_build(data, f"commit {version}")


def gemma_from_xml(path):
    with open(path, "rb") as f:
        data = f.read()
    return "file", gemma_build(data, f"local copy `{os.path.basename(path)}`")


# ---------------------------------------------------------------- refresh logic

def existing_state(directory, files):
    """(state, version) for one source's extract files.

    missing  none of the files exists
    manual   one of them was placed by hand or is not one of this script's
             extracts: never replaced without --force, not even by --from-*
    file     built from a local file with --from-dump or --from-xml: not
             refreshed from the live source without --force, but a new
             --from-* build replaces it
    api      all of them were fetched by this script, at one version
    partial  some are missing, or they carry different versions (an
             interrupted refresh): rebuilt when the source can be reached,
             used as they are when it cannot
    """
    versions, origins, present = set(), set(), 0
    for name, title in files.items():
        path = os.path.join(directory, name)
        if not os.path.isfile(path):
            continue
        present += 1
        first, stamp = read_stamp(path)
        if first != title or stamp is None:
            return "manual", None  # unstamped, unreadable or another file: leave it alone
        origins.add(stamp.get("origin"))
        versions.add(stamp.get("version"))
    if not present:
        return "missing", None
    if origins != {"api"}:
        return "file", versions.pop() if len(versions) == 1 else None
    if present < len(files) or len(versions) > 1:
        return "partial", None
    return "api", versions.pop()


# A source that answers in a shape this script does not read (a format
# change) is handled like one that cannot be reached: the existing extract
# is kept and the error is reported, rather than the run ending in a
# traceback the command cannot read.
SOURCE_ERRORS = (SourceUnavailable, KeyError, IndexError, TypeError, AttributeError, ValueError)


def refresh(source, directory, force, live_version, build, files):
    """Bring one source's extracts up to date. Returns the JSON-able status.

    live_version() returns (version, ...) for the live source; build(live)
    returns (version, texts), reusing a live result it is given, so a
    refresh asks the source for its version once."""
    state, version = existing_state(directory, files)
    paths = [os.path.join(directory, n) for n in files]
    result = {"source": source, "files": paths}
    if state in ("manual", "file") and not force:
        how = "placed by hand" if state == "manual" else "built from a local file"
        return {**result, "status": "manual", "version": version,
                "note": f"extract was {how}; not refreshed (use --force to replace it)"}
    try:
        live = None
        if state == "api" and not force:
            live = live_version()
            if live[0] == version:
                return {**result, "status": "current", "version": version}
        new_version, texts = build(live)
    except SOURCE_ERRORS as exc:
        error = str(exc) if isinstance(exc, SourceUnavailable) else f"unexpected response: {exc!r}"
        if state == "missing":
            return {**result, "status": "missing", "version": None, "error": error}
        note = ("source unreachable; existing extract used as is" if state != "partial" else
                "source unreachable; some extract files are missing or from different "
                "versions, and the existing ones are used as they are")
        return {**result, "status": "offline", "version": version, "note": note, "error": error}
    os.makedirs(directory, exist_ok=True)
    for name, title in files.items():
        write_extract(os.path.join(directory, name), title, stamp_line(source, "api", new_version), texts[name])
    return {**result, "status": "fetched" if state == "missing" else "refreshed", "version": new_version}


def from_local(source, directory, force, build, files):
    """Build one source's extracts from local files (--from-dump, --from-xml).

    Replaces an extract this script wrote, fetched or built from a file, but
    not one placed by hand unless --force is given."""
    paths = [os.path.join(directory, n) for n in files]
    result = {"source": source, "files": paths}
    if existing_state(directory, files)[0] == "manual" and not force:
        return {**result, "status": "manual", "version": None,
                "note": "an extract placed by hand is in the way; not replaced (use --force to replace it)"}
    version, texts = build()
    os.makedirs(directory, exist_ok=True)
    for name, title in files.items():
        write_extract(os.path.join(directory, name), title, stamp_line(source, "file", version), texts[name])
    return {**result, "status": "fetched", "version": version}


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", choices=("nora", "gemma", "all"))
    ap.add_argument("--dir", default=DEFAULT_DIR, help=f"output directory (default: {DEFAULT_DIR})")
    ap.add_argument("--force", action="store_true",
                    help="rebuild even when current, and replace extracts placed by hand")
    ap.add_argument("--from-dump", nargs="+", metavar="XML",
                    help="build the NORA extract offline from NORA Online MediaWiki XML export file(s)")
    ap.add_argument("--from-xml", metavar="XML",
                    help="build the GEMMA extracts offline from a local copy of `GEMMA release.xml`")
    args = ap.parse_args(argv)
    if args.from_dump and args.source == "gemma":
        ap.error("--from-dump builds the NORA extract; use it with nora or all")
    if args.from_xml and args.source == "nora":
        ap.error("--from-xml builds the GEMMA extracts; use it with gemma or all")

    nora_files = {NORA_FILE: NORA_TITLE}
    results = []
    try:
        if args.source in ("nora", "all"):
            if args.from_dump:
                results.append(from_local("nora", args.dir, args.force,
                                          lambda: nora_from_dumps(args.from_dump), nora_files))
            else:
                results.append(refresh("nora", args.dir, args.force,
                                       nora_live_version, nora_from_api, nora_files))
        if args.source in ("gemma", "all"):
            if args.from_xml:
                results.append(from_local("gemma", args.dir, args.force,
                                          lambda: gemma_from_xml(args.from_xml), GEMMA_FILES))
            else:
                results.append(refresh("gemma", args.dir, args.force,
                                       gemma_live_version, gemma_from_api, GEMMA_FILES))
    except (OSError, *SOURCE_ERRORS) as exc:  # a --from-* file missing or not a usable export
        log(f"error: {exc}")
        return 2
    for r in results:
        print(json.dumps(r, ensure_ascii=False))
    return 0 if all(r["status"] != "missing" for r in results) else 2


if __name__ == "__main__":
    sys.exit(main())
