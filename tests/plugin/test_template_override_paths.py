"""Commands and agents must honour templates saved by /arckit:customize.

/arckit:customize writes user templates to `.arckit/templates-custom/` (CLAUDE.md,
docs/guides/customize.md), but most commands only looked in `.arckit/templates/`,
so a customised template was silently ignored and the plugin default was used.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PLUGINS = REPO_ROOT / "plugins"


def _sources() -> list[Path]:
    files = []
    for plugin in sorted(PLUGINS.glob("arckit-*")):
        for sub in ("commands", "agents"):
            files += sorted((plugin / sub).glob("*.md"))
    # the nested Claude publish layout mirrors the overlays; checking the sources is enough
    return [f for f in files if "arckit-claude/plugins" not in f.as_posix()]


OVERRIDE = re.compile(r"`\.arckit/templates/([^`/]+-template\.[a-z]+)`")


def test_every_project_template_override_checks_templates_custom_first():
    problems = []
    for f in _sources():
        text = f.read_text(encoding="utf-8")
        for name in sorted(set(OVERRIDE.findall(text))):
            custom = f"`.arckit/templates-custom/{name}`"
            plain = f"`.arckit/templates/{name}`"
            if custom not in text:
                problems.append(f"{f.relative_to(REPO_ROOT)}: reads {plain} but never {custom}")
            elif text.index(custom) > text.index(plain):
                problems.append(f"{f.relative_to(REPO_ROOT)}: checks {plain} before {custom}")
    assert not problems, (
        "templates saved by /arckit:customize live in .arckit/templates-custom/ and must be checked first:\n"
        + "\n".join(problems)
    )


def test_converter_collapses_the_codex_double_lookup():
    sys.path.insert(0, str(REPO_ROOT / "scripts"))
    import converter  # noqa: E402

    cfg = {"project_template_overrides": True, "path_prefix": ".arckit"}
    cmd = ("- **First**, check if `.arckit/templates-custom/x-template.md` exists in the project root, "
           "then `.arckit/templates/x-template.md`")
    out = converter.rewrite_paths(cmd, cfg)
    assert out.count(".arckit/templates-custom/x-template.md") == 1, out

    agent = ("If `.arckit/templates-custom/x-template.md` exists in the project root, prefer that (user override, "
             "written by `/arckit:customize`); otherwise, if `.arckit/templates/x-template.md` exists, prefer that.")
    out = converter.rewrite_paths(agent, cfg)
    assert out.count(".arckit/templates-custom/x-template.md") == 1, out
    assert out.endswith("`/arckit:customize`)."), out
