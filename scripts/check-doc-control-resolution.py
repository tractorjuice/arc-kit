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

Three things are checked.

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

# Templates that ship but that no command or agent reads by name. These cannot
# fail the resolution check because there is no reader to carry the instruction —
# the defect is one level up: each template names its owning command in its own
# header, and that command writes the artefact from a skeleton inlined in the
# command body instead, with no `## Document Control` and no `## Revision
# History` at all. Against the Template-Driven Generation rule in CLAUDE.md, and
# a behaviour change rather than a wording one, so recorded here and tracked on
# #792. Drop the entry once the command reads its template — the stale-exemption
# check below will catch it if anyone forgets.
NO_READER_KNOWN = {
    "backlog-template.md": "/arckit:backlog inlines its own skeleton instead (#792)",
    "gcloud-clarify-template.md": "/arckit:gcloud-clarify inlines its own skeleton instead (#792)",
    "gcloud-requirements-template.md": "/arckit:gcloud-search inlines its own skeleton instead (#792)",
}


def plugin_dirs() -> list[Path]:
    return sorted(
        p for p in PLUGINS_DIR.iterdir() if p.is_dir() and (p / ".claude-plugin").is_dir()
    )


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
    stale_comment: list[tuple[str, str]] = []
    undeclared_inline: list[tuple[str, str]] = []
    stale_exemption: list[str] = []
    marker_total = 0

    seen_inline: set[str] = set()
    seen_unread: set[str] = set()

    for plugin in plugin_dirs():
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
        (set(INLINE_BY_DESIGN) - seen_inline) | (set(NO_READER_KNOWN) - seen_unread)
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
        f"{len(INLINE_BY_DESIGN)} inline by design, {len(NO_READER_KNOWN)} with no reader."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
