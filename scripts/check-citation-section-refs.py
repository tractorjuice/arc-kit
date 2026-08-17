#!/usr/bin/env python3
"""Assert every citation instruction resolves to the tables it expects to fill.

Commands and agents that gather external evidence end by telling the model to
populate a citation trail:

    Populate the External References section per
    `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`.

`citation-instructions.md` is explicit that it does not create that section:

    Populate the `## External References` section in the template with three
    sub-tables. The template ships with these tables already; the rules below
    describe how to fill them ... without changing column structure.

When the template ships no such tables, the instruction resolves to nothing.
Nothing errors and nothing is logged; the artefact is simply written with no
citation trail, and a reader has no way to check a generated claim against its
source. That was live for 27 command/template pairs across five overlays until
issue #783 — worst in `arckit-uk-finance` and `arckit-uk-gcloud`, whose
artefacts (safeguarding reconciliations, CTP dependency registers, SCA-RTS
exemption matrices, G-Cloud service definitions) are read by a regulator or a
buyer, and where the citation trail is the part that makes them checkable.

`plugins/arckit-nl/commands/nl-cloud.md` was the sharpest case: it *mandated*
that two named sources appear in a Document Register the template did not have.

What is checked, per plugin: for every command or agent whose body references
`references/citation-instructions.md`, every `*-template.md` it names under its
own `templates/` directory must carry all three sub-headings. Resolution is PER
PLUGIN — `${CLAUDE_PLUGIN_ROOT}` resolves to each plugin's own root with no
cross-plugin fallback.

Sub-headings, not just the `External References` heading. A presence-only check
is too weak to hold the contract: 12 further pairs already carried the heading
while missing sub-tables, and would have passed a heading check on day one,
freezing that drift in as compliant.

Deliberately NOT checked here:

  * Templates whose command never references `citation-instructions.md`. Those
    are uncovered rather than broken, and whether every governed artefact should
    carry a citation trail is a policy question, not a dangling instruction.
  * Column names inside each table. Several plugins carry the three tables with
    locally-divergent columns (`Source` for `Source Location`, four-column
    registers in `arckit-ca`). Normalising them is a separate change; this guard
    holds the structural contract only.
  * Templates with no Document Control block. Those four are inlined *fragments*
    — `uk-fs-sca-rts-exemption-matrix-template.md` and friends define the shape
    of one block copied into a parent artefact, and the parent carries the
    citation trail. Giving each fragment its own register would emit duplicate
    tables inside a single artefact.
  * `plugins/arckit-claude/plugins/**`, the generated publish-layout mirror.
    Drift there is a sync failure and `tests/plugin/test_release_process.py`
    already catches it.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"

# Generated publish-layout mirror — see module docstring.
MIRROR_DIR = PLUGINS_DIR / "arckit-claude/plugins"

CITATION_REF = "citation-instructions"

# The three sub-tables citation-instructions.md says the template ships with.
REQUIRED_SECTIONS = (
    "### Document Register",
    "### Citations",
    "### Unreferenced Documents",
)

# `${CLAUDE_PLUGIN_ROOT}/templates/foo-template.md`, and the bare
# `templates/foo-template.md` form used in prose.
TEMPLATE_RE = re.compile(r"templates/([a-z0-9._-]+-template\.md)")

# A template with no Document Control block is an inlined fragment, not a
# standalone artefact — see module docstring.
DOC_CONTROL_MARKER = "Document Control"


def plugin_dirs() -> list[Path]:
    return sorted(
        p
        for p in PLUGINS_DIR.iterdir()
        if p.is_dir() and (p / ".claude-plugin").is_dir() and p != MIRROR_DIR
    )


def citing_sources(plugin: Path) -> list[Path]:
    """Commands and agents in this plugin that read citation-instructions.md."""
    sources: list[Path] = []
    for sub in ("commands", "agents"):
        d = plugin / sub
        if not d.is_dir():
            continue
        for f in sorted(d.glob("*.md")):
            if CITATION_REF in f.read_text(encoding="utf-8"):
                sources.append(f)
    return sources


def main() -> int:
    failures: list[str] = []
    checked = 0

    for plugin in plugin_dirs():
        for source in citing_sources(plugin):
            body = source.read_text(encoding="utf-8")
            for name in sorted(set(TEMPLATE_RE.findall(body))):
                template = plugin / "templates" / name
                if not template.is_file():
                    # A dangling template reference is a different defect, and
                    # tests/plugin/test_template_consistency.py owns it.
                    continue
                text = template.read_text(encoding="utf-8")
                if DOC_CONTROL_MARKER not in text:
                    continue  # inlined fragment
                checked += 1
                missing = [s for s in REQUIRED_SECTIONS if s not in text]
                if missing:
                    rel_src = source.relative_to(ROOT)
                    rel_tpl = template.relative_to(ROOT)
                    failures.append(
                        f"{rel_src} instructs citation population, but "
                        f"{rel_tpl} is missing: {', '.join(missing)}"
                    )

    if failures:
        print("Citation instructions pointing at absent tables:\n")
        for f in failures:
            print(f"  - {f}")
        print(
            f"\n{len(failures)} broken pair(s). Add the missing sub-tables to the "
            "template (and mirror into .arckit/templates/ where that copy exists), "
            "or drop the citation instruction from the command."
        )
        return 1

    print(f"OK: {checked} citation-instructed template(s) carry all three sub-tables.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
