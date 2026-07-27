"""Claude Code overlay command namespacing at publish time.

`/arckit:X` is the canonical, platform-neutral notation in command sources, and
scripts/converter.py rewrites it per target. Claude Code is the only target with
no rewrite step: it reads plugin bodies verbatim and namespaces by the `name` in
plugin.json. Core is named `arckit`, so `/arckit:adr` resolves. Every overlay is
named `arckit-<x>`, so `/arckit:uae-ai-charter` does NOT.

Confirmed 2026-07-27 in a live session: `arckit:repo-audit` returns
"Unknown skill" while `arckit-repo:repo-docs` runs.

scripts/sync-claude-plugin-layout.py therefore rewrites overlay invocations when
mirroring into plugins/arckit-claude/plugins/, which is what the marketplace
publishes. Sources stay portable.
"""

import glob
import importlib.util
import json
import os
import re
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SYNC = REPO_ROOT / "scripts/sync-claude-plugin-layout.py"
MIRROR = REPO_ROOT / "plugins/arckit-claude/plugins"


def load_sync():
    spec = importlib.util.spec_from_file_location("sync_claude_plugin_layout", SYNC)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def core_commands() -> set[str]:
    return {
        os.path.basename(c)[:-3]
        for c in glob.glob(str(REPO_ROOT / "plugins/arckit-claude/commands/*.md"))
    }


def mirror_refs() -> set[str]:
    out = subprocess.run(
        ["grep", "-rho", "--include=*.md", r"/arckit:[a-z0-9.-]*", str(MIRROR)],
        capture_output=True, text=True,
    ).stdout.split()
    return {r.split(":", 1)[1].rstrip(".") for r in out if ":" in r and r.split(":", 1)[1]}


def test_layout_is_in_sync():
    result = subprocess.run(
        ["python3", str(SYNC), "--check"], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"{result.stdout}\n{result.stderr}"


def test_namespace_map_covers_every_overlay_command():
    sync = load_sync()
    namespaces = sync.command_namespaces()
    assert namespaces, "no overlay commands discovered"
    assert "arckit" not in namespaces.values(), "core must never be namespaced"
    for command, namespace in namespaces.items():
        manifest = json.loads(
            (REPO_ROOT / "plugins" / namespace / ".claude-plugin/plugin.json").read_text()
        )
        assert manifest["name"] == namespace, f"{command} maps to a wrong namespace"


def test_core_references_are_never_rewritten():
    sync = load_sync()
    namespaces = sync.command_namespaces()
    pattern = sync._invocation_pattern(namespaces)
    text = "Run `/arckit:adr` then `/arckit:risk` and `/arckit:hld-review`."
    assert sync.rewrite_overlay_invocations(text, pattern, namespaces) == text


def test_overlay_references_are_rewritten():
    sync = load_sync()
    namespaces = sync.command_namespaces()
    pattern = sync._invocation_pattern(namespaces)
    got = sync.rewrite_overlay_invocations(
        "Run `/arckit:uae-ai-charter` and `/arckit:repo-audit`.", pattern, namespaces
    )
    assert "/arckit-uae:uae-ai-charter" in got
    assert "/arckit-repo:repo-audit" in got
    assert "/arckit:uae-ai-charter" not in got


def test_longest_match_wins():
    """`fr-anssi` is a prefix of `fr-anssi-carto`; a naive alternation mangles it."""
    sync = load_sync()
    namespaces = sync.command_namespaces()
    pattern = sync._invocation_pattern(namespaces)
    got = sync.rewrite_overlay_invocations("/arckit:fr-anssi-carto", pattern, namespaces)
    assert got == "/arckit-fr:fr-anssi-carto", got


def test_sources_keep_the_portable_form():
    """Never rewrite the sources: converter.py depends on `/arckit:X`."""
    body = (REPO_ROOT / "plugins/arckit-repo/commands/repo-docs.md").read_text()
    assert "/arckit:repo-audit" in body
    assert "/arckit-repo:repo-audit" not in body


def test_published_mirror_uses_the_namespaced_form():
    body = (MIRROR / "repo/commands/repo-docs.md").read_text()
    assert "/arckit-repo:repo-audit" in body
    assert "/arckit:repo-audit" not in body


def test_no_dangling_command_reference_survives_in_the_mirror():
    """Anything left as `/arckit:X` must be a real core command.

    This caught three pre-existing dangling references (`/arckit:hld`,
    `/arckit:dld`, `/arckit:app-inventory`) that no other check validates:
    check_references.py verifies plugin-root paths and handoffs, not whether a
    referenced command exists.
    """
    dangling = sorted(mirror_refs() - core_commands())
    assert not dangling, f"references to non-existent core commands: {dangling}"


def test_no_double_namespacing():
    out = subprocess.run(
        ["grep", "-rho", "--include=*.md", r"/arckit-[a-z-]*:/*arckit", str(MIRROR)],
        capture_output=True, text=True,
    ).stdout.strip()
    assert not out, f"double-namespaced references: {out[:200]}"


@pytest.mark.parametrize("suffix", [".json", ".yaml", ".yml"])
def test_only_markdown_is_rewritten(suffix):
    sync = load_sync()
    assert suffix not in sync.REWRITABLE_SUFFIXES


# --- the publish path (the one users actually receive) --------------------

PUSH_SCRIPT = REPO_ROOT / "scripts/push-extensions.sh"
SHARED_MODULE = REPO_ROOT / "scripts/claude_command_namespacing.py"


def test_shared_module_exists():
    assert SHARED_MODULE.is_file()


def test_push_script_namespaces_before_committing():
    """The mirror alone never reaches users.

    push-extensions.sh copies the core plugin (which contains the namespaced
    mirror) and then tar-extracts the RAW overlay sources over the same paths,
    overwriting it. Verified by replicating the staging: the published tree came
    out with 12 raw refs where the mirror had 12 namespaced ones. So the publish
    step must run its own pass.
    """
    body = PUSH_SCRIPT.read_text(encoding="utf-8")
    assert "claude_command_namespacing.py" in body, (
        "publish step does not namespace; the mirror's rewriting is overwritten "
        "by the raw overlay sources and never reaches users"
    )


def test_namespacing_runs_after_the_overlay_copy_loop():
    """Ordering is the whole point: before the loop, it would be undone."""
    body = PUSH_SCRIPT.read_text(encoding="utf-8")
    loop = body.index('for entry in "${CLAUDE_PLUGIN_LAYOUT[@]}"')
    call = body.index("claude_command_namespacing.py")
    commit = body.index('git add -A')
    assert loop < call < commit, (
        "namespacing must run after the overlay copy loop and before the commit"
    )


def test_both_call_sites_use_the_shared_module():
    sync_body = (REPO_ROOT / "scripts/sync-claude-plugin-layout.py").read_text()
    assert "claude_command_namespacing" in sync_body
    assert "claude_command_namespacing" in PUSH_SCRIPT.read_text(encoding="utf-8")


def test_rewrite_is_idempotent():
    """Both call sites may touch the same tree; a second pass must be a no-op."""
    sync = load_sync()
    namespaces = sync.command_namespaces()
    pattern = sync._invocation_pattern(namespaces)
    once = sync.rewrite_overlay_invocations("/arckit:uae-ai-charter", pattern, namespaces)
    twice = sync.rewrite_overlay_invocations(once, pattern, namespaces)
    assert once == twice == "/arckit-uae:uae-ai-charter"


def test_namespace_tree_rewrites_a_core_style_tree(tmp_path):
    """The core tree (guides referencing overlay commands) is covered too."""
    import importlib.util

    spec = importlib.util.spec_from_file_location("ccn", SHARED_MODULE)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    guide = tmp_path / "docs" / "guides" / "example.md"
    guide.parent.mkdir(parents=True)
    guide.write_text("Run `/arckit:adm-preliminary` then `/arckit:adr`.\n")

    files, refs = module.namespace_tree(tmp_path)
    assert files == 1 and refs == 1
    got = guide.read_text()
    assert "/arckit-togaf-adm:adm-preliminary" in got
    assert "/arckit:adr" in got, "core reference must survive untouched"


def test_cli_check_mode_exits_nonzero_when_work_remains(tmp_path):
    guide = tmp_path / "g.md"
    guide.write_text("`/arckit:uae-ai-charter`\n")
    result = subprocess.run(
        ["python3", str(SHARED_MODULE), str(tmp_path), "--check"],
        capture_output=True, text=True, cwd=REPO_ROOT,
    )
    assert result.returncode == 1, "check mode must fail when refs would change"
    assert guide.read_text() == "`/arckit:uae-ai-charter`\n", "check must not write"
