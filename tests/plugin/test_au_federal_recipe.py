"""
Mechanical validation for the au-federal community recipe contribution (#424).

Codifies the headline claims in docs/au-federal-validation-scorecard.md as
reproducible pytest checks, so reviewers can re-run them without trusting
prose. Specifically validates:

- Recipe schema (maintainer's verbatim snippet from #424 returns ok)
- Recipe top-level shape (recipe / schema_version / defaults / optional_targets
  / post_build_hooks / targets keys present)
- Target count == 35 and all 8 expected AU_* IDs present in targets
- AU_DISP consolidation flagship depends on AU_E8, AU_ISM, AU_PIA, AU_NDB, AU_PSPF
- Topological sort completes (no cycles, no orphan deps)
- All 8 AU type codes registered in arckit-claude/config/doc-types.mjs
- 'AU' regime present in REGIMES array and REGIME_LABELS map
- All 8 AU type codes appear in pages.md allow-list (dual registration)
- All 8 SKILL.md commands present in arckit-claude/commands/
- All 8 templates dual-pathed in arckit-claude/templates/ AND .arckit/templates/
- UK framework leakage <= 2 in arckit-claude/commands/au-*.md
  (intentional comparison references in au-dss + au-pia)
- AU framework presence >= 150 in arckit-claude/commands/au-*.md
- au-federal listed in arckit-build/SKILL.md recipes table

Run from repo root: pytest tests/plugin/test_au_federal_recipe.py -v
"""

import os
import re
import glob
import yaml
import pytest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

RECIPE_PATH = os.path.join(
    REPO_ROOT, "arckit-claude", "skills", "arckit-build", "recipes", "au-federal.yaml"
)
DOC_TYPES_PATH = os.path.join(REPO_ROOT, "arckit-claude", "config", "doc-types.mjs")
PAGES_MD_PATH = os.path.join(REPO_ROOT, "arckit-claude", "commands", "pages.md")
ARCKIT_BUILD_SKILL_PATH = os.path.join(
    REPO_ROOT, "arckit-claude", "skills", "arckit-build", "SKILL.md"
)
COMMANDS_DIR = os.path.join(REPO_ROOT, "arckit-claude", "commands")
PLUGIN_TEMPLATES_DIR = os.path.join(REPO_ROOT, "arckit-claude", "templates")
CLI_TEMPLATES_DIR = os.path.join(REPO_ROOT, ".arckit", "templates")

AU_COMMANDS = [
    "au-e8-posture",
    "au-ism-controls",
    "au-pia",
    "au-ndb-playbook",
    "au-dss",
    "au-pspf",
    "au-ai-assurance",
    "au-disp-attestation",
]

AU_TYPE_CODES = ["AUE8", "AUISM", "AUPIA", "AUNDB", "AUDSS", "AUPSPF", "AUAIA", "AUDISP"]

EXPECTED_TARGET_COUNT = 35

UK_LEAKAGE_PATTERN = (
    r"\b(NCSC|ICO|Cyber Essentials|GovS|UK GDPR|GDS|Cabinet Office|DPA 2018|DPIA)\b"
)
AU_PRESENCE_PATTERN = (
    r"\b(ASD|ACSC|OAIC|DTA|PSPF|IRAP|DISP|APP|ISM|Privacy Act 1988)\b"
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def recipe():
    with open(RECIPE_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


@pytest.fixture(scope="module")
def doc_types_source():
    with open(DOC_TYPES_PATH, "r", encoding="utf-8") as f:
        return f.read()


@pytest.fixture(scope="module")
def pages_md_source():
    with open(PAGES_MD_PATH, "r", encoding="utf-8") as f:
        return f.read()


# ---------------------------------------------------------------------------
# Recipe schema (maintainer's verbatim snippet from #424)
# ---------------------------------------------------------------------------


def test_recipe_schema_maintainer_snippet(recipe):
    """Maintainer's verbatim Python snippet from #424 must return 'ok'."""
    ids = {t["id"] for t in recipe["targets"]}
    deps_ok = all(
        d.rstrip("*") in {i.rstrip("-") for i in ids}
        or any(i.startswith(d.rstrip("*")) for i in ids)
        for t in recipe["targets"]
        for d in t["deps"]
    )
    assert deps_ok, "Maintainer's verbatim validation snippet returned FAIL"


def test_recipe_top_level_shape(recipe):
    """Required top-level keys present (per arckit-build/SKILL.md schema v1)."""
    assert recipe["recipe"] == "au-federal"
    assert recipe["schema_version"] == 1
    assert "description" in recipe
    assert recipe["defaults"]["version"] == "1.0"
    assert isinstance(recipe["optional_targets"], dict)
    assert isinstance(recipe["post_build_hooks"], list)
    assert isinstance(recipe["targets"], list)


def test_recipe_post_build_hooks(recipe):
    """post_build_hooks must include arckit:health and arckit:pages."""
    skills = [h["skill"] for h in recipe["post_build_hooks"]]
    assert "arckit:health" in skills
    assert "arckit:pages" in skills


def test_recipe_target_count(recipe):
    """Recipe target count is locked to 35 (regression guard)."""
    assert len(recipe["targets"]) == EXPECTED_TARGET_COUNT


def test_recipe_target_ids_unique(recipe):
    """No duplicate target IDs."""
    ids = [t["id"] for t in recipe["targets"]]
    assert len(ids) == len(set(ids)), f"Duplicate target IDs: {ids}"


@pytest.mark.parametrize(
    "expected_id",
    ["AU_E8", "AU_ISM", "AU_PIA", "AU_NDB", "AU_DSS", "AU_PSPF", "AU_AI", "AU_DISP"],
)
def test_recipe_au_command_targets_present(recipe, expected_id):
    """Each of the 8 AU community commands has a target in the recipe."""
    ids = {t["id"] for t in recipe["targets"]}
    assert expected_id in ids


def test_recipe_au_disp_is_consolidation_flagship(recipe):
    """AU_DISP (DISP attestation) must depend on the 5 prerequisite AU_* commands."""
    target_by_id = {t["id"]: t for t in recipe["targets"]}
    disp_deps = set(target_by_id["AU_DISP"]["deps"])
    required = {"AU_E8", "AU_ISM", "AU_PIA", "AU_NDB", "AU_PSPF"}
    missing = required - disp_deps
    assert not missing, f"AU_DISP missing required prereq deps: {missing}"


def test_recipe_topological_sort_no_cycle(recipe):
    """Topological sort must complete without cycles (matches build harness algorithm)."""
    ids = {t["id"] for t in recipe["targets"]}

    def expand_deps(deps):
        out = set()
        for d in deps:
            if d.endswith("*"):
                prefix = d[:-1]
                out.update(i for i in ids if i.startswith(prefix))
            else:
                out.add(d)
        return out

    remaining = {t["id"]: expand_deps(t["deps"]) for t in recipe["targets"]}
    done = set()
    waves = 0
    while remaining:
        ready = [tid for tid, d in remaining.items() if d <= done]
        assert ready, (
            f"Cycle or unresolvable dep at wave {waves}; "
            f"remaining target IDs: {list(remaining.keys())}"
        )
        for tid in ready:
            del remaining[tid]
        done |= set(ready)
        waves += 1
    # Sanity: full plan should resolve in a reasonable number of waves
    assert 5 <= waves <= 15, f"Wave count {waves} outside expected range"


def test_recipe_no_orphan_deps(recipe):
    """Every dep must resolve to a real target ID or a valid wildcard."""
    ids = {t["id"] for t in recipe["targets"]}
    orphans = []
    for t in recipe["targets"]:
        for d in t["deps"]:
            if d.endswith("*"):
                prefix = d[:-1]
                if not any(i.startswith(prefix) for i in ids):
                    orphans.append((t["id"], d))
            elif d not in ids:
                orphans.append((t["id"], d))
    assert not orphans, f"Orphan deps: {orphans}"


# ---------------------------------------------------------------------------
# Doc-types registration (regression guard for the dual-registration convention)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("type_code", AU_TYPE_CODES)
def test_au_type_code_registered_in_doc_types(doc_types_source, type_code):
    """Each AU type code must be registered in arckit-claude/config/doc-types.mjs."""
    pattern = rf"['\"]{type_code}['\"]\s*:"
    assert re.search(pattern, doc_types_source), (
        f"AU type code '{type_code}' not registered in doc-types.mjs"
    )


def test_au_regime_in_regimes_list(doc_types_source):
    """'AU' must appear in the REGIMES array."""
    match = re.search(r"export const REGIMES\s*=\s*\[([^\]]+)\]", doc_types_source)
    assert match, "REGIMES array not found in doc-types.mjs"
    regimes_str = match.group(1)
    assert "'AU'" in regimes_str or '"AU"' in regimes_str, (
        f"'AU' not in REGIMES: {regimes_str}"
    )


def test_au_regime_in_regime_labels(doc_types_source):
    """'AU' must have a label in REGIME_LABELS."""
    match = re.search(
        r"export const REGIME_LABELS\s*=\s*\{([^}]+)\}", doc_types_source, re.DOTALL
    )
    assert match, "REGIME_LABELS map not found in doc-types.mjs"
    labels_str = match.group(1)
    assert re.search(r"\bAU\s*:", labels_str), (
        f"'AU' label not in REGIME_LABELS: {labels_str}"
    )


# ---------------------------------------------------------------------------
# pages.md allow-list (dual registration convention)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("type_code", AU_TYPE_CODES)
def test_au_type_code_in_pages_md_allowlist(pages_md_source, type_code):
    """Each AU type code must appear in arckit-claude/commands/pages.md allow-list."""
    pattern = rf"\b{type_code}\b"
    assert re.search(pattern, pages_md_source), (
        f"AU type code '{type_code}' not in pages.md allow-list (dual registration)"
    )


# ---------------------------------------------------------------------------
# 8 SKILL.md commands + dual-pathed templates
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_au_command_file_exists(cmd):
    """Each au-* command file must exist in arckit-claude/commands/."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    assert os.path.isfile(path), f"Missing command file: {path}"


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_au_template_in_plugin_dir(cmd):
    """Each au-*-template.md must exist in arckit-claude/templates/."""
    path = os.path.join(PLUGIN_TEMPLATES_DIR, f"{cmd}-template.md")
    assert os.path.isfile(path), f"Missing plugin template: {path}"


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_au_template_in_cli_dir(cmd):
    """Each au-*-template.md must exist in .arckit/templates/ (dual-path)."""
    path = os.path.join(CLI_TEMPLATES_DIR, f"{cmd}-template.md")
    assert os.path.isfile(path), f"Missing CLI template: {path}"


# ---------------------------------------------------------------------------
# UK leakage / AU framework presence (mechanical-grep claims)
# ---------------------------------------------------------------------------


def _grep_count(pattern, files):
    """Count regex matches across a list of files (matches `grep -rE | wc -l`)."""
    rgx = re.compile(pattern)
    n = 0
    for path in files:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                if rgx.search(line):
                    n += 1
    return n


def test_uk_leakage_capped_in_au_commands():
    """
    UK framework leakage in arckit-claude/commands/au-*.md must be <= 2.

    The 2 intentional comparison references are in au-dss.md (DTA-DSS-vs-UK-TCoP
    swap rationale) and au-pia.md (Privacy-Act-vs-UK-GDPR swap rationale).
    """
    files = sorted(glob.glob(os.path.join(COMMANDS_DIR, "au-*.md")))
    assert len(files) == 8, f"Expected 8 au-*.md files, found {len(files)}"
    n = _grep_count(UK_LEAKAGE_PATTERN, files)
    assert n <= 2, (
        f"UK leakage in au-*.md = {n}, expected <= 2 "
        "(only intentional comparisons in au-dss.md + au-pia.md)"
    )


def test_au_framework_presence_in_au_commands():
    """
    AU framework references in arckit-claude/commands/au-*.md must be >= 150.

    Actual count at PR open: 188. Margin guards against minor copy-edits but
    catches accidental wholesale removal of jurisdiction-specific terminology.
    """
    files = sorted(glob.glob(os.path.join(COMMANDS_DIR, "au-*.md")))
    assert len(files) == 8
    n = _grep_count(AU_PRESENCE_PATTERN, files)
    assert n >= 150, (
        f"AU framework presence in au-*.md = {n}, expected >= 150 "
        "(ASD/ACSC/OAIC/DTA/PSPF/IRAP/DISP/APP/ISM/Privacy Act 1988)"
    )


# ---------------------------------------------------------------------------
# arckit-build/SKILL.md recipes table
# ---------------------------------------------------------------------------


def test_au_federal_in_recipes_table():
    """au-federal must be listed in arckit-build/SKILL.md 'Built-in recipes' table."""
    with open(ARCKIT_BUILD_SKILL_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    assert "au-federal" in content, "au-federal missing from arckit-build/SKILL.md"
    assert re.search(r"\|\s*`au-federal`\s*\|", content), (
        "au-federal not in the | `name` | use case | recipes table"
    )


# ---------------------------------------------------------------------------
# Maintainer review #441 — regression guards for fixed blockers and items
# https://github.com/tractorjuice/arc-kit/pull/441 (Code Review)
# ---------------------------------------------------------------------------


# Doc-type code per command, used by Blocker 3 / Item #7 tests.
AU_COMMAND_TO_TYPE = dict(zip(AU_COMMANDS, [
    "AUE8", "AUISM", "AUPIA", "AUNDB", "AUDSS", "AUPSPF", "AUAIA", "AUDISP",
]))

UAE_COMMANDS = [
    "uae-ai-autonomy-tier", "uae-ai-charter", "uae-classification",
    "uae-cloud-residency", "uae-data-sharing", "uae-digital-records",
    "uae-ias", "uae-pdpl", "uae-priorities-alignment", "uae-procurement",
    "uae-uaepass", "uae-zero-bureaucracy",
]


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_blocker1_template_has_document_control_heading_in_plugin_dir(cmd):
    """Blocker 1 (review #441): each AU template needs '## Document Control'
    heading directly above the <!-- DOC-CONTROL-HEADER --> marker.
    Mirrors ca-pia-template.md:5 pattern. Without it, partial inlining produces
    a Document Control table with no preceding section heading."""
    path = os.path.join(PLUGIN_TEMPLATES_DIR, f"{cmd}-template.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert "## Document Control\n\n<!-- DOC-CONTROL-HEADER -->" in text, (
        f"{cmd}-template.md missing '## Document Control' heading above marker"
    )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_blocker1_template_has_document_control_heading_in_cli_dir(cmd):
    """Blocker 1 dual-sync: same heading must exist in .arckit/templates/."""
    path = os.path.join(CLI_TEMPLATES_DIR, f"{cmd}-template.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert "## Document Control\n\n<!-- DOC-CONTROL-HEADER -->" in text, (
        f".arckit/templates/{cmd}-template.md missing '## Document Control' heading"
    )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_blocker2a_command_overrides_uk_classification_to_au(cmd):
    """Blocker 2a (review #441): each AU command must instruct the resolver to
    swap the standard UK classification line for the PSPF scheme.
    RENDERING.md only routes UAE today; everything else falls back to the UK
    partial. Without this override the artefact ships with UK header but AU body."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    # Required canonical phrasing (mirrors ca-pia.md:32 pattern)
    required_terms = [
        "Australian classification scheme",
        "UNOFFICIAL",
        "OFFICIAL:Sensitive",
        "PROTECTED",
        "replace the standard UK line",
    ]
    for term in required_terms:
        assert term in text, (
            f"{cmd}.md missing AU classification override term: {term!r}"
        )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_blocker3_doc_id_invocation_passes_project_id(cmd):
    """Blocker 3 (review #441): generate-document-id.sh signature is
    PROJECT_ID DOC_TYPE [VERSION]. AU commands must pass <PROJECT_ID> first.
    Bug was inherited from uae-* (also fixed in the same review pass)."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    code = AU_COMMAND_TO_TYPE[cmd]
    correct = f"generate-document-id.sh <PROJECT_ID> {code} --filename"
    bare = f"generate-document-id.sh {code} --filename"
    assert correct in text, f"{cmd}.md must use: {correct!r}"
    assert bare not in text, (
        f"{cmd}.md still has bare 'generate-document-id.sh {code} --filename'"
    )


@pytest.mark.parametrize("cmd", UAE_COMMANDS)
def test_blocker3_same_pass_uae_doc_id_invocation_fixed(cmd):
    """Same-pass tidy (review #441): UAE commands shared the same
    generate-document-id.sh invocation bug. AU PR fixes both AU and UAE so the
    inherited defect doesn't propagate further."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    if not os.path.isfile(path):
        pytest.skip(f"{cmd}.md not present")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    # No bare invocation should remain (CODE = uppercase letters/digits only).
    bare_matches = re.findall(
        r"generate-document-id\.sh ([A-Z][A-Z0-9]+) --filename", text
    )
    assert not bare_matches, (
        f"{cmd}.md still has bare invocations for codes: {bare_matches}"
    )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_item7_au_command_has_create_project_lookup(cmd):
    """Item #7 (review #441): every AU command must include the
    create-project.sh lookup step before generate-document-id.sh, matching the
    pattern used by ca-* and the other 5 AU commands."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert "scripts/bash/create-project.sh" in text, (
        f"{cmd}.md missing create-project.sh lookup step"
    )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_item8_no_non_canonical_name_frontmatter(cmd):
    """Item #8 (review #441): the `name:` frontmatter field is non-canonical —
    not used by ca-*, uae-*, fr-*, and not in CLAUDE.md schema. Strip from AU."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    # First frontmatter block (between leading --- delimiters)
    fm = re.match(r"---\n(.*?)\n---\n", text, re.DOTALL)
    assert fm, f"{cmd}.md has no frontmatter"
    fm_body = fm.group(1)
    assert not re.search(r"^name:\s", fm_body, re.MULTILINE), (
        f"{cmd}.md has non-canonical `name:` frontmatter field"
    )


@pytest.mark.parametrize("cmd", AU_COMMANDS)
def test_item10_marker_step_references_rendering_md(cmd):
    """Item #10 (review #441): every marker-resolution step must say
    'per `RENDERING.md`' — keeps the reference path explicit for the resolver."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert re.search(
        r"Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING\.md`\.",
        text,
    ), f"{cmd}.md marker step missing 'per `RENDERING.md`' reference"


@pytest.mark.parametrize(
    "cmd", ["au-e8-posture", "au-ndb-playbook"]
)
def test_item12_no_440_yaml_comment_leak_in_frontmatter(cmd):
    """Item #12 (review #441): YAML comments referencing #440 inside the
    frontmatter would pass through the converter to non-Claude targets unchanged.
    Removed in this review pass to prevent leakage."""
    path = os.path.join(COMMANDS_DIR, f"{cmd}.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    fm = re.match(r"---\n(.*?)\n---\n", text, re.DOTALL)
    assert fm, f"{cmd}.md has no frontmatter"
    assert "#440" not in fm.group(1), (
        f"{cmd}.md frontmatter still references #440 (YAML comment leak risk)"
    )


def test_item9_ism_controls_count_matches_listed_items():
    """Item #9 (review #441): au-ism-controls.md previously declared
    'all 12 ISM control domains' but listed 17 items. Reconcile to 17 areas."""
    path = os.path.join(COMMANDS_DIR, "au-ism-controls.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert "all 17 ISM control areas" in text, (
        "au-ism-controls.md must declare 'all 17 ISM control areas' "
        "(was 'all 12 ISM control domains' before review fix)"
    )
    assert "all 12 ISM control domains" not in text, (
        "au-ism-controls.md still has stale 'all 12 ISM control domains' phrasing"
    )


def test_item14_disp_step1_lists_aupspf_as_input():
    """Item #14 (review #441): AU_DISP recipe deps include AU_PSPF, but the
    command's Process step 1 didn't list AUPSPF. Reconciled by adding it as a
    primary input."""
    path = os.path.join(COMMANDS_DIR, "au-disp-attestation.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert "ARC-{P}-AUPSPF-v*" in text, (
        "au-disp-attestation.md Process step 1 must list AUPSPF as an input "
        "(matches AU_DISP recipe deps)"
    )


@pytest.mark.parametrize("templates_dir", [PLUGIN_TEMPLATES_DIR, CLI_TEMPLATES_DIR])
def test_item16_pspf_template_no_offset_numbering(templates_dir):
    """Item #16 (review #441): au-pspf-template.md previously rendered
    Outcome 1–4 as `## 2.`–`## 5.` (offset). Drop section numbers so headings
    align with PSPF outcome numbers themselves."""
    path = os.path.join(templates_dir, "au-pspf-template.md")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    # Should NOT have any "## N. Outcome M" form
    offset_form = re.findall(r"^##\s+\d+\.\s+Outcome\s+\d", text, flags=re.MULTILINE)
    assert not offset_form, (
        f"au-pspf-template.md still has offset-numbered Outcome headings: {offset_form}"
    )
    # Should have clean "## Outcome N: ..." form
    clean_form = re.findall(r"^##\s+Outcome\s+\d+:", text, flags=re.MULTILINE)
    assert len(clean_form) == 4, (
        f"au-pspf-template.md should have 4 '## Outcome N:' headings, found {len(clean_form)}"
    )


@pytest.mark.parametrize(
    "cmd", ["au-ndb-playbook", "au-pspf"]
)
def test_item5_template_footer_has_arckit_version_line(cmd):
    """Item #5 (review #441): au-ndb-playbook and au-pspf templates were
    missing **ArcKit Version**: [VERSION] in the Standard Footer."""
    for templates_dir in [PLUGIN_TEMPLATES_DIR, CLI_TEMPLATES_DIR]:
        path = os.path.join(templates_dir, f"{cmd}-template.md")
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        assert "**ArcKit Version**: [VERSION]" in text, (
            f"{templates_dir}/{cmd}-template.md missing ArcKit Version line"
        )
