#!/usr/bin/env python3
"""Assert every `<!-- DOC-CONTROL-HEADER -->` template has a command that resolves it.

`templates/_partials/RENDERING.md` states the rule normatively:

    When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command
    that reads the template MUST resolve the marker to the contents of one of the
    partials in this directory before writing the artefact to disk.

Nothing enforced it. A template carrying the marker whose command never resolves
it emits a literal HTML comment and NO Document Control block at all — strictly
worse than the short hand-maintained table the marker replaced. That state was
live for 91 template/command pairs, including all 12 France commands: FR
hard-routes and `document-control-fr.md` shipped in #752, but no FR command read
`RENDERING.md`, so the French ladder was unreachable from the command that needed
it (#760).

Five things are checked.

1. **Resolution.** Every marker-carrying template has at least one reader —
   command or agent — that references `_partials/RENDERING.md`. Readers are
   matched by template basename, and an orchestrator that delegates its Write to
   a writer subagent is satisfied by the subagent, since that is the tier holding
   the Write call.

2. **Comment currency.** The descriptive comment under the marker is the current
   one-line form. It used to paraphrase the routing rule, naming two partials of
   seven and describing the pre-#744 user-config routing. Because
   `apply_doc_control_marker.py` was never updated, that stale wording reached 121
   of 168 templates and contradicted the file it pointed at. The comment defers
   now instead of paraphrasing, and this check keeps it that way.

3. **The converse.** A template with a `## Document Control` block and no marker
   is outside regime routing by construction and re-drifts freely, so it must be
   on `INLINE_BY_DESIGN` with a stated reason.

4. **No ladder restatement.** The marker comment must not carry a
   `| Classification | ... |` row. Check 2 tests that the required comment is
   PRESENT, so extra lines under it were invisible, and 34 templates used them to
   restate a ladder. In 10 of those — the `us-*` set — the restated ladder was the
   UK one, mandated as a `MUST`, which is what #746 is about: it would have
   contradicted `document-control-us.md` the moment US stopped falling through,
   and no guard would have said so. Notes that add something the menu does not
   (AU's SOCI caveat, CA's "frequently SECRET or higher") are not rows and stay.

5. **A command declaring a `doc-type:` names a template.** Checks 1-3 walk
   TEMPLATES and ask who reads them, so a command that writes a governed artefact
   with no template at all was invisible to them. Two were —
   `gcloud-competitors` (GCMP) and `review` (GCRV) — and both shipped an artefact
   with no Document Control block and no Revision History, found only by a
   separate sweep (#792). This check closes that direction.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"

# Generated publish-layout mirror. Drift there is a sync failure, and
# tests/plugin/test_release_process.py already catches it.
MIRROR_DIR = PLUGINS_DIR / "arckit-claude/plugins"

MARKER = "<!-- DOC-CONTROL-HEADER -->"
COMMENT = "<!-- Resolved at command-execution time per _partials/RENDERING.md. -->"
RESOLVER = "_partials/RENDERING.md"

# A `| Classification | ... |` row commented out under the marker. Check 2 asks
# whether COMMENT is present, so anything ADDED after it was invisible: 34
# templates restated a ladder there, and the 10 us-* ones restated the UK one as
# a `MUST` while RENDERING.md was routing US elsewhere (#746).
LADDER_ROW_RE = re.compile(r"^<!--\s*\|\s*Classification\s*\|")


def marker_comment_block(text: str) -> list[str]:
    """The run of HTML comment lines directly under the marker."""
    lines = text.splitlines()
    try:
        start = next(i for i, line in enumerate(lines) if MARKER in line)
    except StopIteration:
        return []
    block: list[str] = []
    for line in lines[start + 1 :]:
        if not line.startswith("<!--"):
            break
        block.append(line)
    return block

DOC_CONTROL_RE = re.compile(r"^## Document Control\s*$", re.M)

# Templates that keep a hand-maintained Document Control block on purpose.
#
# The DCB0129/DCB0160 safety case set follows the Marcus Baw SAFETY.md spec
# convention, whose Document ID is the literal `SAFETY.md` with no `ARC-` prefix,
# and the commands document that deviation explicitly. They already carry all 14
# fields with a constrained PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE ladder.
# Converting them would impose an ARC- ID and break the convention on purpose.
#
# `uk-mdr-classification-template.md` and `uk-nhs-dtac-template.md` are NOT
# exempt — they use the marker like any other template.
INLINE_BY_DESIGN = {
    "uk-nhs-dcb0129-case-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
    "uk-nhs-dcb0129-hazard-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
    "uk-nhs-dcb0129-safety-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
    "uk-nhs-dcb0160-deployment-case-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
    "uk-nhs-dcb0160-deployment-hazard-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
    "uk-nhs-dcb0160-deployment-safety-template.md": "Marcus Baw SAFETY.md spec convention (no ARC- ID)",
}

# Templates that ship but that no command or agent reads by name. Empty, and
# meant to stay that way: a template nothing reads cannot resolve its marker.
#
# Three lived here between #791 and #792 — backlog, gcloud-clarify and
# gcloud-requirements — because their commands wrote the artefact from a skeleton
# inlined in the command body, with no `## Document Control` and no
# `## Revision History` at all. All three now read their template.
NO_READER_KNOWN: dict[str, str] = {}

# Commands that declare a `doc-type:` but reference no template file. Also empty.
#
# This is the converse blind spot: the checks above walk TEMPLATES and ask who
# reads them, so a command writing a governed artefact with no template at all is
# invisible to them. Two were — arckit-uk-gcloud's `gcloud-competitors` (GCMP)
# and `review` (GCRV), both of which said "there is no template for this
# doc-type; author it inline" — and both needed a separate sweep to find rather
# than surfacing in the #760 pass. Templates now exist for both.
#
# `doc-type: none` commands are out of scope: they write no governed artefact.
NO_TEMPLATE_KNOWN: dict[str, str] = {}


DOC_TYPE_RE = re.compile(r"^doc-type:\s*(.+?)\s*$", re.M)
TEMPLATE_REF_RE = re.compile(r"templates/[A-Za-z0-9._-]+\.md")


def plugin_dirs() -> list[Path]:
    return sorted(
        p for p in PLUGINS_DIR.iterdir() if p.is_dir() and (p / ".claude-plugin").is_dir()
    )


def commands_without_a_template(plugin: Path) -> list[tuple[Path, str]]:
    """(command, doc-type) for commands that declare a governed doc-type but name
    no template file anywhere in their body.

    Such a command necessarily builds its artefact from an inlined skeleton, which
    is how five of them ended up shipping with no Document Control block at all.
    """
    found: list[tuple[Path, str]] = []
    commands = plugin / "commands"
    if not commands.is_dir():
        return found
    for path in sorted(commands.glob("*.md")):
        if MIRROR_DIR in path.parents:
            continue
        text = path.read_text(encoding="utf-8")
        m = DOC_TYPE_RE.search(text)
        if not m or m.group(1) == "none":
            continue
        if TEMPLATE_REF_RE.search(text):
            continue
        found.append((path, m.group(1)))
    return found


def readers_for(plugin: Path, basename: str) -> list[Path]:
    """Commands and agents that name this template.

    Agents count: the reader/writer split moves the Write call into a writer
    subagent, so for `/arckit:grants` the tier that renders the template — and so
    the tier that must resolve the marker — is `arckit-grants-writer`.
    """
    found: list[Path] = []
    for sub in ("commands", "agents"):
        for path in sorted((plugin / sub).glob("*.md")) if (plugin / sub).is_dir() else []:
            if MIRROR_DIR in path.parents:
                continue
            if basename in path.read_text(encoding="utf-8"):
                found.append(path)
    return found


def main() -> int:
    if not PLUGINS_DIR.is_dir():
        print(f"ERROR: {PLUGINS_DIR} not found", file=sys.stderr)
        return 1

    unresolved: list[tuple[str, str, list[str]]] = []  # (plugin, template, readers)
    unread: list[tuple[str, str]] = []
    no_template: list[tuple[str, str, str]] = []  # (plugin, command, doc-type)
    stale_comment: list[tuple[str, str]] = []
    ladder_restated: list[tuple[str, str, str]] = []  # (plugin, template, offending line)
    undeclared_inline: list[tuple[str, str]] = []
    stale_exemption: list[str] = []
    marker_total = 0

    seen_inline: set[str] = set()
    seen_unread: set[str] = set()

    seen_no_template: set[str] = set()

    for plugin in plugin_dirs():
        for cmd, code in commands_without_a_template(plugin):
            if cmd.name in NO_TEMPLATE_KNOWN:
                seen_no_template.add(cmd.name)
            else:
                no_template.append((plugin.name, str(cmd.relative_to(ROOT)), code))

        templates_dir = plugin / "templates"
        if not templates_dir.is_dir():
            continue
        for tpl in sorted(templates_dir.glob("*.md")):
            text = tpl.read_text(encoding="utf-8")
            name = tpl.name
            rel = str(tpl.relative_to(ROOT))

            if MARKER not in text:
                if DOC_CONTROL_RE.search(text):
                    if name in INLINE_BY_DESIGN:
                        seen_inline.add(name)
                    else:
                        undeclared_inline.append((plugin.name, rel))
                continue

            marker_total += 1

            if COMMENT not in text:
                stale_comment.append((plugin.name, rel))

            restated = [line for line in marker_comment_block(text) if LADDER_ROW_RE.match(line)]
            if restated:
                ladder_restated.append((plugin.name, rel, restated[0]))

            readers = readers_for(plugin, name)
            if not readers:
                if name in NO_READER_KNOWN:
                    seen_unread.add(name)
                else:
                    unread.append((plugin.name, rel))
                continue

            if not any(RESOLVER in r.read_text(encoding="utf-8") for r in readers):
                unresolved.append(
                    (plugin.name, rel, [str(r.relative_to(ROOT)) for r in readers])
                )

    if marker_total == 0:
        print(
            f"ERROR: no template carries {MARKER} — the marker has probably been "
            "renamed and this guard no longer matches anything.",
            file=sys.stderr,
        )
        return 1

    stale_exemption = sorted(
        (set(INLINE_BY_DESIGN) - seen_inline)
        | (set(NO_READER_KNOWN) - seen_unread)
        | (set(NO_TEMPLATE_KNOWN) - seen_no_template)
    )

    failed = False

    if unresolved:
        failed = True
        print(
            f"FAIL {len(unresolved)} template(s) carry {MARKER} but no reader resolves it:",
            file=sys.stderr,
        )
        for plugin, rel, readers in unresolved:
            print(f"  {rel}  (plugin {plugin})", file=sys.stderr)
            for r in readers:
                print(f"      read by {r}", file=sys.stderr)
        print(
            f"\n  Each of these renders a literal HTML comment and no Document Control\n"
            f"  block at all. Add a step telling the model to read\n"
            f"  ${{CLAUDE_PLUGIN_ROOT}}/templates/{RESOLVER} and resolve the marker,\n"
            f"  next to where the command or writer subagent reads the template.",
            file=sys.stderr,
        )

    if unread:
        failed = True
        print(
            f"\nFAIL {len(unread)} template(s) carry {MARKER} but no command or agent "
            "reads them:",
            file=sys.stderr,
        )
        for plugin, rel in unread:
            print(f"  {rel}  (plugin {plugin})", file=sys.stderr)
        print(
            "\n  A template nothing reads cannot resolve its marker. Either make the\n"
            "  command template-driven, or record it in NO_READER_KNOWN with a reason.",
            file=sys.stderr,
        )

    if stale_comment:
        failed = True
        print(
            f"\nFAIL {len(stale_comment)} template(s) carry a marker comment that is not "
            "the current form:",
            file=sys.stderr,
        )
        for plugin, rel in stale_comment:
            print(f"  {rel}  (plugin {plugin})", file=sys.stderr)
        print(
            f"\n  Expected exactly:\n    {COMMENT}\n\n"
            "  Run: python3 scripts/python/apply_doc_control_marker.py "
            "plugins/*/templates .arckit/templates",
            file=sys.stderr,
        )

    if ladder_restated:
        failed = True
        print(
            f"\nFAIL {len(ladder_restated)} template(s) restate a classification ladder "
            "under the marker:",
            file=sys.stderr,
        )
        for plugin, rel, line in ladder_restated:
            print(f"  {rel}  (plugin {plugin})\n    {line.strip()}", file=sys.stderr)
        print(
            "\n  RENDERING.md is the only ladder source. A second copy in the template is\n"
            "  a ladder the router cannot see: the us-* templates mandated the UK ladder\n"
            "  as a MUST while RENDERING.md routed US to its own partial (#746). Delete\n"
            "  the row — a note that adds something beyond the menu is fine to keep.",
            file=sys.stderr,
        )

    if undeclared_inline:
        failed = True
        print(
            f"\nFAIL {len(undeclared_inline)} template(s) hand-maintain a Document Control "
            "block without the marker:",
            file=sys.stderr,
        )
        for plugin, rel in undeclared_inline:
            print(f"  {rel}  (plugin {plugin})", file=sys.stderr)
        print(
            "\n  These sit outside the regime routing in RENDERING.md and re-drift freely.\n"
            "  Convert them with scripts/python/apply_doc_control_marker.py, or add them to\n"
            "  INLINE_BY_DESIGN with the reason the deviation is deliberate.",
            file=sys.stderr,
        )

    if no_template:
        failed = True
        print(
            f"\nFAIL {len(no_template)} command(s) declare a doc-type but reference no template:",
            file=sys.stderr,
        )
        for plugin, rel, code in no_template:
            print(f"  {rel}  (doc-type: {code}, plugin {plugin})", file=sys.stderr)
        print(
            "\n  A command with no template builds its artefact from an inlined skeleton, which is\n"
            "  how five of them shipped with no Document Control block at all (#792). Author a\n"
            "  template and read it, or record the command in NO_TEMPLATE_KNOWN with a reason.",
            file=sys.stderr,
        )

    if stale_exemption:
        failed = True
        print(
            f"\nFAIL {len(stale_exemption)} exemption(s) no longer match any template:",
            file=sys.stderr,
        )
        for name in stale_exemption:
            print(f"  {name}", file=sys.stderr)
        print(
            "\n  The template was renamed, removed, or fixed. Drop the stale entry so the\n"
            "  exemption lists stay an accurate record of what is deliberately excluded.",
            file=sys.stderr,
        )

    if failed:
        return 1

    print(
        f"OK {marker_total} marker template(s) resolve via {RESOLVER}; "
        f"{len(INLINE_BY_DESIGN)} inline by design, {len(NO_READER_KNOWN)} with no reader, "
        f"{len(NO_TEMPLATE_KNOWN)} command(s) with no template."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
