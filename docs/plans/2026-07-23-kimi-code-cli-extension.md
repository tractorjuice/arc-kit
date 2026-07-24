# Kimi Code CLI Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **CORRECTION (2026-07-24, after Task 10 installed the real CLI).** This plan was written against documentation for **legacy `kimi-cli`**. The shipping product is **`kimi-code`** (verified at v0.29.1), and three facts below are wrong. The implementation has been corrected; the task text is left as written for the historical record.
>
> | Plan says | Actually correct |
> |---|---|
> | Manifest is `plugin.json` | `kimi.plugin.json` at plugin root, or `.kimi-plugin/plugin.json` |
> | Install via `kimi plugin install <url>` | No such subcommand. Use `/plugins install <path-or-url>` inside the TUI |
> | Frontmatter allows `license`, `compatibility`, `metadata` | Documented fields are `name`, `description`, `type`, `whenToUse`, `disableModelInvocation`, `arguments` |
>
> Config lives at `~/.kimi-code/`, not `~/.kimi/`. Skills are searched in `~/.kimi-code/skills/`, `~/.agents/skills/`, `.kimi-code/skills/`, `.agents/skills/`. Current docs: <https://moonshotai.github.io/kimi-code/>.

**Goal:** Ship ArcKit as a native Kimi Code CLI plugin (`arckit-kimi`), the seventh distribution format, with the full command set as Agent Skills, the six bundled MCP servers, and session-start workflow orientation.

**Architecture:** `plugins/arckit-claude/` remains the single source of truth. A new `"kimi"` entry in `scripts/converter.py`'s `AGENT_CONFIG` emits one `skills/<name>/SKILL.md` per command, and a new `generate_kimi_plugin_json()` emits the `plugin.json` manifest carrying the skill path, `sessionStart`, and the mapped MCP servers. The ~250-line `rewrite_codex_skills()` is first refactored into a shared, parameterised core so Kimi reuses its platform-generic rewrites instead of duplicating them.

**Tech Stack:** Python 3.12 (`scripts/converter.py`, `src/arckit_cli/`), pytest (`tests/kimi/`), Bash (`scripts/push-extensions.sh`, `scripts/bump-version.sh`), strict JSON (`plugin.json`), Markdown + YAML frontmatter (`SKILL.md`).

## Global Constraints

- **Never push to `main`.** All work lands via a feature branch and PR.
- **`plugins/arckit-claude/` is the single source of truth.** Never hand-edit generated files under `extensions/`; edit the source and re-run `python scripts/converter.py`.
- **Only three files under `extensions/arckit-kimi/` are tracked:** `README.md`, `VERSION`, `LICENSE`. Everything else is a converter output and must be gitignored, matching `arckit-vibe` and `arckit-codex`.
- **`plugin.json` is strict JSON.** No comments, no trailing commas.
- **Kimi frontmatter is a closed field set:** only `name`, `description`, `license`, `compatibility`, `metadata`, `type` are legal. Every Claude-only field must be stripped.
- **Confirmed Kimi facts** (verified 2026-07-23, do not substitute from memory): model id `kimi-k3`; OpenRouter id `moonshotai/kimi-k3`; base URL `https://api.moonshot.ai/v1` global and `https://api.moonshot.cn/v1` China only; env vars `KIMI_API_KEY`, `KIMI_BASE_URL`, `KIMI_MODEL`. There is no "Kimi V3".
- **Skill invocation is `/skill:<name>`.** ArcKit skills are named `arckit-<command>`, giving `/skill:arckit-requirements`.
- **Both CHANGELOGs:** repo root `CHANGELOG.md` and `plugins/arckit-claude/CHANGELOG.md`.
- **Pre-push checklist:** `python scripts/converter.py`, then `python -m pytest tests/kimi/ tests/codex/ tests/opencode/`, then `python scripts/sync-shared-assets.py --check`, then `npx markdownlint-cli2 "**/*.md"`.
- **Never `git add -A`.** Stage explicit paths only.

## File Structure

**New files:**

- `extensions/arckit-kimi/VERSION` — tracked, plain semver, read by the manifest generator.
- `extensions/arckit-kimi/LICENSE` — tracked, copy of the repo MIT licence.
- `extensions/arckit-kimi/README.md` — tracked, install and usage docs.
- `tests/kimi/__init__.py` — tracked, empty, makes the suite a package (mirrors `tests/opencode/`).
- `tests/kimi/test_kimi_extension.py` — tracked, validates generated output.

**Modified files:**

- `scripts/converter.py` — `kimi_skill_name()`, `kimi_skill_invocation()`, `_rewrite_skill_content()` extraction, `rewrite_kimi_skills()`, `generate_kimi_plugin_json()`, the `"kimi"` `AGENT_CONFIG` entry, the `kimi_skill` emission branch, the handoff `cmd_fmt` branch, and `main()` wiring.
- `.gitignore` — generated paths under `extensions/arckit-kimi/`.
- `src/arckit_cli/__init__.py` — `kimi` entry in the AI-assistant table.
- `scripts/push-extensions.sh` — `[kimi]` repo mapping and generated-path guard.
- `scripts/bump-version.sh` — `extensions/arckit-kimi/VERSION`.
- `CLAUDE.md`, `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`, `CHANGELOG.md`, `plugins/arckit-claude/CHANGELOG.md` — docs.

Tasks 1 to 6 build and verify the extension. Task 7 is the CLI. Task 8 is release plumbing. Task 9 is docs. Task 10 is the live smoke test, which gates release.

---

## Task 1: Extension scaffold and gitignore

**Files:**

- Create: `extensions/arckit-kimi/VERSION`
- Create: `extensions/arckit-kimi/LICENSE`
- Create: `extensions/arckit-kimi/README.md`
- Modify: `.gitignore`

**Interfaces:**

- Produces: `extensions/arckit-kimi/VERSION` containing the current plugin version, read by `generate_kimi_plugin_json()` in Task 4.

- [ ] **Step 1: Create the VERSION file**

Read the current version first so the two stay in step:

```bash
cat plugins/arckit-claude/VERSION
```

Write that exact value (at time of writing, `6.3.0`):

```bash
cp plugins/arckit-claude/VERSION extensions/arckit-kimi/VERSION
```

- [ ] **Step 2: Copy the licence**

```bash
cp LICENSE extensions/arckit-kimi/LICENSE
```

- [ ] **Step 3: Write the README**

Create `extensions/arckit-kimi/README.md`:

```markdown
# ArcKit for Kimi Code CLI

The Enterprise Architecture Governance Harness, packaged as a Kimi Code CLI plugin.

## Install

```bash
kimi plugin install https://github.com/tractorjuice/arckit-kimi.git
```

## Set up a project

ArcKit skills read templates and helper scripts from your project's `.arckit/`
directory, so scaffold it once per repository:

```bash
pip install arckit
arckit init my-project --ai kimi
```

## Use it

Every ArcKit command is an Agent Skill. Invoke one with `/skill:`:

```text
/skill:arckit-requirements
/skill:arckit-stakeholders
/skill:arckit-adr
```

The `architecture-workflow` skill loads automatically at session start and
recommends which command to run next.

## MCP servers

Six MCP servers ship with the plugin and are enabled by default. Toggle them
from `/plugins`. Two need API keys in your environment:

- `google-developer-knowledge` needs `GOOGLE_API_KEY`
- `datacommons-mcp` needs `DATA_COMMONS_API_KEY`

Without a key those two servers fail to connect and are marked failed. That is
expected and harmless; the rest of the plugin works normally.

## Licence

MIT. See LICENSE.
```

- [ ] **Step 4: Add the gitignore block**

In `.gitignore`, immediately after the `extensions/arckit-vibe` block, add:

```gitignore
# -- extensions/arckit-kimi (generated) --
extensions/arckit-kimi/skills/
extensions/arckit-kimi/templates/
extensions/arckit-kimi/docs/guides/
extensions/arckit-kimi/config/
extensions/arckit-kimi/schemas/
extensions/arckit-kimi/references/
extensions/arckit-kimi/scripts/
extensions/arckit-kimi/hooks/
extensions/arckit-kimi/plugin.json
```

- [ ] **Step 5: Verify only the three intended files are tracked**

Run:

```bash
git add extensions/arckit-kimi .gitignore && git status --short extensions/arckit-kimi
```

Expected: exactly three `A` lines, for `LICENSE`, `README.md`, and `VERSION`. If `plugin.json` or a directory appears, the gitignore block is wrong.

- [ ] **Step 6: Commit**

```bash
git add extensions/arckit-kimi/VERSION extensions/arckit-kimi/LICENSE \
        extensions/arckit-kimi/README.md .gitignore
git commit -m "chore(kimi): scaffold arckit-kimi extension directory"
```

---

## Task 2: Skill naming helpers

**Files:**

- Modify: `scripts/converter.py` (after `vibe_skill_name`, currently line 182)
- Create (test): `tests/kimi/__init__.py`
- Create (test): `tests/kimi/test_kimi_extension.py`

**Interfaces:**

- Produces: `kimi_skill_name(command_name: str) -> str` returning `arckit-<name>` with dots replaced by hyphens, and `kimi_skill_invocation(command_name: str) -> str` returning `/skill:arckit-<name>`. Both are used by Tasks 3, 5 and 6.

- [ ] **Step 1: Create the test package marker**

```bash
touch tests/kimi/__init__.py
```

- [ ] **Step 2: Write the failing test**

Create `tests/kimi/test_kimi_extension.py`:

```python
"""Validate the generated Kimi Code CLI extension structure."""

import importlib.util
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
KIMI_ROOT = REPO_ROOT / "extensions" / "arckit-kimi"
KIMI_SKILLS = KIMI_ROOT / "skills"
KIMI_MANIFEST = KIMI_ROOT / "plugin.json"

# Frontmatter keys Kimi Code CLI accepts. Anything else is a hard failure:
# Kimi validates against a closed set, so a leaked Claude-only field breaks
# the skill at load time rather than being ignored.
KIMI_ALLOWED_FRONTMATTER_KEYS = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "type",
}


def _load_converter():
    """Import scripts/converter.py as a module without executing main()."""
    spec = importlib.util.spec_from_file_location(
        "arckit_converter", REPO_ROOT / "scripts" / "converter.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_kimi_skill_name_prefixes_and_flattens():
    converter = _load_converter()
    assert converter.kimi_skill_name("requirements") == "arckit-requirements"
    assert converter.kimi_skill_name("wardley.climate") == "arckit-wardley-climate"


def test_kimi_skill_invocation_uses_skill_prefix():
    converter = _load_converter()
    assert converter.kimi_skill_invocation("requirements") == "/skill:arckit-requirements"
    assert (
        converter.kimi_skill_invocation("wardley.climate")
        == "/skill:arckit-wardley-climate"
    )
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `python -m pytest tests/kimi/test_kimi_extension.py -v`
Expected: FAIL with `AttributeError: module 'arckit_converter' has no attribute 'kimi_skill_name'`.

- [ ] **Step 4: Add the helpers**

In `scripts/converter.py`, directly after `vibe_skill_name()` (which ends at line 184), insert:

```python
def kimi_skill_name(command_name):
    """Return the Kimi Code CLI skill name for an ArcKit command name."""
    return f"arckit-{command_name.replace('.', '-')}"


def kimi_skill_invocation(command_name):
    """Return the invocation string for a Kimi skill-backed command."""
    return f"/skill:{kimi_skill_name(command_name)}"
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `python -m pytest tests/kimi/test_kimi_extension.py -v`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add scripts/converter.py tests/kimi/__init__.py tests/kimi/test_kimi_extension.py
git commit -m "feat(kimi): add skill naming and invocation helpers"
```

---

## Task 3: Extract the shared skill-rewriting core

**Files:**

- Modify: `scripts/converter.py` (`rewrite_codex_skills`, currently starting line 1317)
- Modify (test): `tests/codex/test_codex_extension.py`

**Interfaces:**

- Produces: `_rewrite_skill_content(content, *, skill_dir_name, invocation_fn, platform_label, plugin_root_prefix) -> str`, a pure function containing every rewrite currently inside `rewrite_codex_skills`'s file loop. Consumed by `rewrite_codex_skills` (this task) and `rewrite_kimi_skills` (Task 5).

`rewrite_codex_skills()` is roughly 250 lines, and the great majority of its rewrites are platform-generic: normalising command invocations, replacing Claude's `AskUserQuestion` tool references with plain instructions, removing SessionStart hook notes, and rewriting `${CLAUDE_PLUGIN_ROOT}`. Only the invocation format, the platform label used in the `arckit-template-builder` special case, and the plugin-root prefix differ per target. Duplicating all of it for Kimi would guarantee the two copies drift, so this task extracts the core first.

**This is a behaviour-preserving refactor.** The Codex output must be byte-identical afterwards. Step 1 locks that in before anything moves.

- [ ] **Step 1: Write the characterization test that locks current Codex output**

Add to `tests/codex/test_codex_extension.py`:

```python
def test_codex_skill_rewrite_is_stable():
    """Golden test: locks rewrite output so the shared-core extraction is provably safe.

    Exercises every branch that differs per platform: the invocation rewrite,
    the AskUserQuestion replacement, the SessionStart hook removal, and the
    plugin-root rewrite.
    """
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "arckit_converter", REPO_ROOT / "scripts" / "converter.py"
    )
    converter = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(converter)

    sample = (
        "Run /arckit:requirements then /arckit.stakeholders.\n"
        "Also /arckit:wardley.climate and /prompts:arckit.adr.\n"
        "Please use the **AskUserQuestion** tool to gather the project name.\n"
        "- Use ArcKit Project Context from the SessionStart hook if available\n"
        "Templates live in ${CLAUDE_PLUGIN_ROOT}/templates/.\n"
        "Beware Claude Code's 32K token output limit.\n"
    )
    expected = (
        "Run $arckit-requirements then $arckit-stakeholders.\n"
        "Also $arckit-wardley-climate and $arckit-adr.\n"
        "Please ask the user for the project name.\n"
        "Templates live in .arckit/templates/.\n"
        "Beware Codex output limits.\n"
    )
    result = converter._rewrite_skill_content(
        sample,
        skill_dir_name="arckit-requirements",
        invocation_fn=converter.codex_skill_invocation,
        platform_label="Codex",
        plugin_root_prefix=".arckit",
    )
    assert result == expected
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m pytest tests/codex/test_codex_extension.py::test_codex_skill_rewrite_is_stable -v`
Expected: FAIL with `AttributeError: module 'arckit_converter' has no attribute '_rewrite_skill_content'`.

- [ ] **Step 3: Extract the pure function**

In `scripts/converter.py`, define `_rewrite_skill_content` immediately **above** `rewrite_codex_skills`. Move the entire body of the per-file loop into it, verbatim, with these four substitutions applied throughout:

1. `os.path.basename(root)` becomes the `skill_dir_name` parameter.
2. `normalize_codex_invocation` becomes a local closure over the `invocation_fn` parameter.
3. Every literal `"Codex"` / `"Codex Skill"` / `"Codex skill"` / `"Codex output limits"` in the `arckit-template-builder` block and the output-limit replacement uses the `platform_label` parameter via f-strings.
4. `content.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")` uses the `plugin_root_prefix` parameter.

The signature is:

```python
def _rewrite_skill_content(
    content,
    *,
    skill_dir_name,
    invocation_fn,
    platform_label,
    plugin_root_prefix,
):
    """Rewrite Claude Code-specific references in one skill body.

    Pure and platform-parameterised so Codex and Kimi share one implementation.
    `invocation_fn` maps a bare command name to that platform's invocation
    string (for example `codex_skill_invocation` or `kimi_skill_invocation`).
    """
    def normalize_invocation(match):
        return invocation_fn(match.group(1))

    # ... entire existing rewrite body, with the four substitutions above ...

    return content
```

The `$arckit-` literals inside the generic normalisation block (for example `content.replace("`/$arckit-", "`$arckit-")`) are Codex-shaped. Replace those with a computed prefix so they work for any platform:

```python
    sample_invocation = invocation_fn("x")
    inv_prefix = sample_invocation[: -len("x")]  # "$arckit-" or "/skill:arckit-"
    content = content.replace(f"`/{inv_prefix}", f"`{inv_prefix}")
    content = content.replace(f"(/{inv_prefix}", f"({inv_prefix}")
    content = content.replace(f"Run `/{inv_prefix}", f"Run `{inv_prefix}")
```

- [ ] **Step 4: Reduce `rewrite_codex_skills` to a thin caller**

Replace the body of the per-file loop in `rewrite_codex_skills` with:

```python
            original = content
            content = _rewrite_skill_content(
                content,
                skill_dir_name=os.path.basename(root),
                invocation_fn=codex_skill_invocation,
                platform_label="Codex",
                plugin_root_prefix=".arckit",
            )

            if content != original:
```

leaving the surrounding walk, read, write, and counter logic untouched.

- [ ] **Step 5: Run the golden test to verify it passes**

Run: `python -m pytest tests/codex/test_codex_extension.py::test_codex_skill_rewrite_is_stable -v`
Expected: PASS.

- [ ] **Step 6: Prove the full Codex output is unchanged**

Capture the generated Codex skills before and after. From a clean tree:

```bash
python scripts/converter.py >/dev/null
find extensions/arckit-codex/skills -name '*.md' | sort | xargs sha256sum > /tmp/codex-after.txt
git stash && python scripts/converter.py >/dev/null
find extensions/arckit-codex/skills -name '*.md' | sort | xargs sha256sum > /tmp/codex-before.txt
git stash pop && python scripts/converter.py >/dev/null
diff /tmp/codex-before.txt /tmp/codex-after.txt && echo "IDENTICAL"
```

Expected: `IDENTICAL`. If the diff is non-empty the extraction changed behaviour; fix before continuing.

- [ ] **Step 7: Run the whole Codex suite**

Run: `python -m pytest tests/codex/ -v`
Expected: PASS, no regressions.

- [ ] **Step 8: Commit**

```bash
git add scripts/converter.py tests/codex/test_codex_extension.py
git commit -m "refactor(converter): extract platform-parameterised skill rewrite core"
```

---

## Task 4: Generate the plugin.json manifest

**Files:**

- Modify: `scripts/converter.py` (new function, place after `generate_codex_mcp_json`, currently ending near line 1030)
- Modify (test): `tests/kimi/test_kimi_extension.py`

**Interfaces:**

- Consumes: `plugins/arckit-claude/.mcp.json`, `extensions/arckit-kimi/VERSION` (Task 1).
- Produces: `generate_kimi_plugin_json(mcp_json_path, version, output_path) -> None`, writing `extensions/arckit-kimi/plugin.json`.

- [ ] **Step 1: Write the failing test**

Append to `tests/kimi/test_kimi_extension.py`:

```python
def test_generate_kimi_plugin_json_maps_mcp_and_session_start(tmp_path):
    converter = _load_converter()

    mcp_src = tmp_path / ".mcp.json"
    mcp_src.write_text(
        json.dumps(
            {
                "mcpServers": {
                    "aws-knowledge": {
                        "type": "http",
                        "url": "https://knowledge-mcp.global.api.aws",
                    },
                    "datacommons-mcp": {
                        "command": "uvx",
                        "args": ["datacommons-mcp@latest"],
                        "env": {"DC_API_KEY": "${user_config.DATA_COMMONS_API_KEY}"},
                    },
                }
            }
        ),
        encoding="utf-8",
    )
    out = tmp_path / "plugin.json"

    converter.generate_kimi_plugin_json(str(mcp_src), "6.3.0", str(out))

    manifest = json.loads(out.read_text(encoding="utf-8"))
    assert manifest["name"] == "arckit"
    assert manifest["version"] == "6.3.0"
    assert manifest["skills"] == "./skills/"
    assert manifest["sessionStart"] == {"skill": "architecture-workflow"}
    assert manifest["interface"]["displayName"] == "ArcKit"

    servers = manifest["mcpServers"]
    # Remote servers keep url and drop Claude's `type` discriminator.
    assert servers["aws-knowledge"] == {"url": "https://knowledge-mcp.global.api.aws"}
    # Stdio servers keep command/args/env, with user_config rewritten to env vars.
    assert servers["datacommons-mcp"]["command"] == "uvx"
    assert servers["datacommons-mcp"]["env"]["DC_API_KEY"] == "${DATA_COMMONS_API_KEY}"
    assert "type" not in servers["datacommons-mcp"]


def test_generate_kimi_plugin_json_is_strict_json(tmp_path):
    """No comments or trailing commas: Kimi parses this as strict JSON."""
    converter = _load_converter()
    mcp_src = tmp_path / ".mcp.json"
    mcp_src.write_text(json.dumps({"mcpServers": {}}), encoding="utf-8")
    out = tmp_path / "plugin.json"

    converter.generate_kimi_plugin_json(str(mcp_src), "6.3.0", str(out))

    raw = out.read_text(encoding="utf-8")
    assert "//" not in raw
    json.loads(raw)  # raises if malformed
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m pytest tests/kimi/test_kimi_extension.py -v`
Expected: FAIL, `AttributeError: ... has no attribute 'generate_kimi_plugin_json'`.

- [ ] **Step 3: Implement the generator**

In `scripts/converter.py`, after `generate_codex_mcp_json()`, add:

```python
def generate_kimi_plugin_json(mcp_json_path, version, output_path):
    """Generate the Kimi Code CLI plugin manifest.

    Kimi's mcpServers schema is close to Claude's: remote servers use `url`
    with optional `headers`, stdio servers use `command`/`args`/`env`. Claude's
    `type` discriminator has no Kimi equivalent and is dropped; the shape is
    inferred from whether `url` or `command` is present.
    """
    servers = {}
    if os.path.isfile(mcp_json_path):
        with open(mcp_json_path, "r", encoding="utf-8") as f:
            mcp_config = json.load(f)
        for name, entry in mcp_config.get("mcpServers", {}).items():
            mapped = {}
            if entry.get("url"):
                mapped["url"] = entry["url"]
                if entry.get("headers"):
                    mapped["headers"] = entry["headers"]
            elif entry.get("command"):
                mapped["command"] = entry["command"]
                if entry.get("args"):
                    mapped["args"] = entry["args"]
                if entry.get("env"):
                    mapped["env"] = entry["env"]
            else:
                continue
            servers[name] = mapped

    manifest = {
        "name": "arckit",
        "version": version,
        "description": (
            "The Enterprise Architecture Governance Harness: strategy, "
            "architecture, delivery and assurance artefacts."
        ),
        "skills": "./skills/",
        "sessionStart": {"skill": "architecture-workflow"},
        "mcpServers": servers,
        "interface": {
            "displayName": "ArcKit",
            "shortDescription": (
                "Strategy, architecture, delivery and assurance artefacts"
            ),
        },
    }

    # user_config placeholders are Claude-only; non-Claude targets fall back
    # to plain environment variables.
    rendered = rewrite_user_config_placeholders(
        json.dumps(manifest, indent=2, ensure_ascii=False)
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(rendered + "\n")
    print(f"  Generated: {output_path} ({len(servers)} MCP servers)")
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `python -m pytest tests/kimi/test_kimi_extension.py -v`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/converter.py tests/kimi/test_kimi_extension.py
git commit -m "feat(kimi): generate plugin.json manifest with mapped MCP servers"
```

---

## Task 5: Wire the kimi target into the converter

**Files:**

- Modify: `scripts/converter.py` — `AGENT_CONFIG` (after the `"vibe"` entry, currently ending line 348), the handoff `cmd_fmt` chain (currently lines 614-622), the emission branch (currently near line 675), a new `rewrite_kimi_skills()`, and `main()` (currently near line 1995).

**Interfaces:**

- Consumes: `kimi_skill_name`, `kimi_skill_invocation` (Task 2), `_rewrite_skill_content` (Task 3), `generate_kimi_plugin_json` (Task 4).
- Produces: populated `extensions/arckit-kimi/`.

- [ ] **Step 1: Add the AGENT_CONFIG entry**

In `scripts/converter.py`, after the `"vibe"` entry and before the closing `}` of `AGENT_CONFIG`, add:

```python
    "kimi": {
        "name": "Kimi Code CLI",
        "output_dir": "extensions/arckit-kimi/skills",
        "format": "kimi_skill",
        "path_prefix": ".arckit",
        "extension_dir": "extensions/arckit-kimi",
        "copy_commands_to_extension": False,
        "copy_agents_to_extension": False,
        "copy_scripts_to_extension": True,
        "copy_references_to_extension": True,
        "copy_schemas_to_extension": True,
        "clean_output_dir": True,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
```

`copy_core_skills_to_extension` is deliberately omitted: it defaults to `True`, which is what Kimi needs so `architecture-workflow` is present for `sessionStart`. `arckit-build` is excluded automatically by the existing `claude_only_skills` set in `copy_extension_files()`.

- [ ] **Step 2: Add the handoff invocation format**

In the `cmd_fmt` chain (currently lines 614-622), add a branch before the `else`:

```python
            elif config["format"] == "kimi_skill":
                cmd_fmt = kimi_skill_invocation
```

- [ ] **Step 3: Add the emission branch**

After the `elif config["format"] == "vibe_skill":` block and before the final `else:`, add:

```python
            elif config["format"] == "kimi_skill":
                skill_name = kimi_skill_name(base_name)
                skill_dir = os.path.join(config["output_dir"], skill_name)
                os.makedirs(skill_dir, exist_ok=True)

                escaped_desc = description.replace('"', '\\"')
                # Kimi validates frontmatter against a closed field set, so
                # only name/description/license/metadata are emitted. Every
                # Claude-only field (effort, keep-coding-instructions,
                # disallowed-tools, paths, handoffs, allowed-tools, model) is
                # dropped by construction: nothing here copies them through.
                skill_md = (
                    f"---\n"
                    f"name: {skill_name}\n"
                    f'description: "{escaped_desc}"\n'
                    f"license: MIT\n"
                    f"metadata:\n"
                    f"  arckit-command: {base_name}\n"
                    f"---\n\n"
                    f"{rewritten}\n"
                )
                with open(
                    os.path.join(skill_dir, "SKILL.md"), "w", encoding="utf-8"
                ) as f:
                    f.write(skill_md)
                print(f"  {config['name'] + ':':14s}{source_label} -> {skill_dir}/")
                counts[agent_id] += 1
```

- [ ] **Step 4: Add `rewrite_kimi_skills`**

Immediately after `rewrite_codex_skills()`, add:

```python
def rewrite_kimi_skills(skills_dir):
    """Rewrite Claude Code-specific references for the Kimi extension.

    Shares its implementation with the Codex rewriter via
    _rewrite_skill_content; only the invocation format, platform label and
    plugin-root prefix differ.
    """
    if not os.path.isdir(skills_dir):
        return

    count = 0
    for root, _dirs, files in os.walk(skills_dir):
        for filename in files:
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            original = content
            content = _rewrite_skill_content(
                content,
                skill_dir_name=os.path.basename(root),
                invocation_fn=kimi_skill_invocation,
                platform_label="Kimi",
                plugin_root_prefix=".arckit",
            )

            if content != original:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                count += 1

    if count:
        print(f"  Rewrote {count} skill files for Kimi skill invocation format")
```

- [ ] **Step 5: Wire into `main()`**

In `main()`, after the Mistral Vibe block and before the final totals print, add:

```python
    print()
    print("Generating Kimi Code CLI extension config...")
    kimi_version = "0.0.0"
    kimi_version_path = "extensions/arckit-kimi/VERSION"
    if os.path.isfile(kimi_version_path):
        with open(kimi_version_path, "r", encoding="utf-8") as f:
            kimi_version = f.read().strip() or kimi_version
    generate_kimi_plugin_json(
        os.path.join(plugin_dir, ".mcp.json"),
        kimi_version,
        "extensions/arckit-kimi/plugin.json",
    )

    print()
    print("Rewriting Kimi extension skills for Kimi command format...")
    rewrite_kimi_skills("extensions/arckit-kimi/skills")
```

- [ ] **Step 6: Run the converter**

Run: `python scripts/converter.py`
Expected: completes without error, and the summary line now includes a `Kimi Code CLI` count.

- [ ] **Step 7: Eyeball one generated skill**

Run:

```bash
head -12 extensions/arckit-kimi/skills/arckit-requirements/SKILL.md
grep -rc "/skill:arckit-" extensions/arckit-kimi/skills/arckit-requirements/SKILL.md
```

Expected: frontmatter with exactly `name`, `description`, `license`, `metadata`; at least one `/skill:arckit-` invocation from the handoffs section.

- [ ] **Step 8: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(kimi): wire Kimi Code CLI target into the converter"
```

---

## Task 6: Full validation suite

**Files:**

- Modify (test): `tests/kimi/test_kimi_extension.py`

**Interfaces:**

- Consumes: generated `extensions/arckit-kimi/` from Task 5.

These tests run against generated output, so `python scripts/converter.py` must have been run first. That matches how `tests/codex/` already works in CI.

- [ ] **Step 1: Write the structural tests**

Append to `tests/kimi/test_kimi_extension.py`:

```python
PLUGIN_COMMAND_DIRS = [
    REPO_ROOT / "plugins" / "arckit-claude" / "commands",
    REPO_ROOT / "plugins" / "arckit-uae" / "commands",
    REPO_ROOT / "plugins" / "arckit-fr" / "commands",
    REPO_ROOT / "plugins" / "arckit-ca" / "commands",
    REPO_ROOT / "plugins" / "arckit-eu" / "commands",
    REPO_ROOT / "plugins" / "arckit-at" / "commands",
    REPO_ROOT / "plugins" / "arckit-au" / "commands",
    REPO_ROOT / "plugins" / "arckit-au-energy" / "commands",
    REPO_ROOT / "plugins" / "arckit-us" / "commands",
    REPO_ROOT / "plugins" / "arckit-uk-finance" / "commands",
    REPO_ROOT / "plugins" / "arckit-uk-nhs" / "commands",
    REPO_ROOT / "plugins" / "arckit-togaf-adm" / "commands",
    REPO_ROOT / "plugins" / "arckit-agent-architecture" / "commands",
]


def _parse_frontmatter_keys(text):
    """Return top-level YAML frontmatter keys from a SKILL.md body."""
    if not text.startswith("---\n"):
        return set()
    end = text.index("\n---\n", 3)
    block = text[4:end]
    keys = set()
    for line in block.splitlines():
        if line and not line.startswith((" ", "\t", "-")) and ":" in line:
            keys.add(line.split(":", 1)[0].strip())
    return keys


def test_manifest_exists_and_has_required_fields():
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    for field in ("name", "version", "skills", "sessionStart", "mcpServers", "interface"):
        assert field in manifest, f"plugin.json missing required field: {field}"


def test_session_start_skill_actually_exists():
    """A sessionStart pointing at a missing skill breaks every session."""
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    skill = manifest["sessionStart"]["skill"]
    assert (KIMI_SKILLS / skill / "SKILL.md").is_file(), (
        f"sessionStart names '{skill}' but skills/{skill}/SKILL.md does not exist"
    )


def test_every_command_produces_a_skill():
    expected = set()
    for cmd_dir in PLUGIN_COMMAND_DIRS:
        if not cmd_dir.is_dir():
            continue
        for path in cmd_dir.glob("*.md"):
            expected.add(f"arckit-{path.stem.replace('.', '-')}")

    actual = {p.name for p in KIMI_SKILLS.iterdir() if p.is_dir()}
    missing = expected - actual
    assert not missing, f"commands with no generated Kimi skill: {sorted(missing)}"


def test_all_frontmatter_keys_are_kimi_legal():
    offenders = {}
    for skill_md in KIMI_SKILLS.rglob("SKILL.md"):
        keys = _parse_frontmatter_keys(skill_md.read_text(encoding="utf-8"))
        illegal = keys - KIMI_ALLOWED_FRONTMATTER_KEYS
        if illegal:
            offenders[str(skill_md.relative_to(KIMI_ROOT))] = sorted(illegal)
    assert not offenders, f"illegal Kimi frontmatter keys: {offenders}"


def test_no_claude_plugin_root_leaks():
    offenders = [
        str(p.relative_to(KIMI_ROOT))
        for p in KIMI_SKILLS.rglob("*.md")
        if "${CLAUDE_PLUGIN_ROOT}" in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"${{CLAUDE_PLUGIN_ROOT}} leaked into: {offenders}"


def test_no_claude_slash_command_leaks():
    """A surviving /arckit: tells the user to run a command Kimi does not have."""
    offenders = []
    for p in KIMI_SKILLS.rglob("*.md"):
        text = p.read_text(encoding="utf-8")
        if "/arckit:" in text or "/arckit." in text:
            offenders.append(str(p.relative_to(KIMI_ROOT)))
    assert not offenders, f"unrewritten Claude command invocations in: {offenders}"


def test_all_mcp_servers_mapped_without_user_config():
    source = json.loads(
        (REPO_ROOT / "plugins" / "arckit-claude" / ".mcp.json").read_text(encoding="utf-8")
    )
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    assert set(manifest["mcpServers"]) == set(source["mcpServers"])
    assert "${user_config." not in KIMI_MANIFEST.read_text(encoding="utf-8")


def test_arckit_build_skill_is_excluded():
    """arckit-build orchestrates parallel Agent dispatch and is Claude-only."""
    assert not (KIMI_SKILLS / "arckit-build").exists()
```

- [ ] **Step 2: Regenerate and run the suite**

Run: `python scripts/converter.py && python -m pytest tests/kimi/ -v`
Expected: PASS. If `test_no_claude_slash_command_leaks` fails, the rewrite in Task 5 Step 4 is not reaching those files; fix the rewriter rather than weakening the test.

- [ ] **Step 3: Run the neighbouring suites for regressions**

Run: `python -m pytest tests/kimi/ tests/codex/ tests/opencode/ -v`
Expected: PASS.

- [ ] **Step 4: Add the suite to CI**

In `.github/workflows/codex-plugin.yml`, after the existing Codex test step (line 55), add:

```yaml
      - name: Test Kimi extension
        run: python -m pytest tests/kimi/
```

- [ ] **Step 5: Commit**

```bash
git add tests/kimi/test_kimi_extension.py .github/workflows/codex-plugin.yml
git commit -m "test(kimi): validate generated extension structure and CI wiring"
```

---

## Task 7: Add `arckit init --ai kimi`

**Files:**

- Modify: `src/arckit_cli/__init__.py` (AI-assistant table, currently lines 44-60)

**Interfaces:**

- Produces: `arckit init <name> --ai kimi`, scaffolding `.arckit/` into the user's project.

Kimi documents no plugin-root variable, so skills reference `.arckit/templates/` in the user's project. Without this the onboarding story is "run `arckit init --ai codex` even though you use Kimi", which is confusing.

- [ ] **Step 1: Read the existing table to match its shape exactly**

Run: `sed -n '40,70p' src/arckit_cli/__init__.py`

Note the exact keys each entry uses (`name`, `folder`, `install_url`, and any others), because the new entry must match them.

- [ ] **Step 2: Add the kimi entry**

In the AI-assistant dict, after the `"copilot"` entry, add an entry matching the observed shape:

```python
    "kimi": {
        "name": "Kimi Code CLI",
        "folder": ".arckit/",
        "install_url": "https://github.com/tractorjuice/arckit-kimi",
    },
```

- [ ] **Step 3: Handle the post-init message**

Find the `if ai_assistant == "codex":` chain (currently near line 256) and add a `kimi` branch that prints the plugin install instruction rather than scaffolding CLI-specific command folders, since Kimi skills arrive via `kimi plugin install`:

```python
        elif ai_assistant == "kimi":
            console.print(
                "\n[bold]Next step:[/bold] install the ArcKit plugin for Kimi Code CLI:\n"
                "  [cyan]kimi plugin install https://github.com/tractorjuice/arckit-kimi.git[/cyan]\n"
                "\nThen invoke any command as a skill, for example "
                "[cyan]/skill:arckit-requirements[/cyan]."
            )
```

Match the surrounding branches' console API exactly; if they use `typer.echo` rather than `rich`, use that instead.

- [ ] **Step 4: Verify end to end**

Run:

```bash
cd /tmp && rm -rf kimi-init-test && arckit init kimi-init-test --ai kimi --no-git
ls kimi-init-test/.arckit/templates | head -5
```

Expected: the command succeeds, prints the plugin install instruction, and `.arckit/templates/` contains template files.

- [ ] **Step 5: Commit**

```bash
git add src/arckit_cli/__init__.py
git commit -m "feat(cli): add --ai kimi for Kimi Code CLI project scaffolding"
```

---

## Task 8: Release plumbing

**Files:**

- Modify: `scripts/push-extensions.sh` (EXTENSIONS map, line 27; generated-path guard, line 41)
- Modify: `scripts/bump-version.sh`

- [ ] **Step 1: Register the publish target**

In `scripts/push-extensions.sh`, add to the `EXTENSIONS` map after the `[vibe]` line:

```bash
  [kimi]="extensions/arckit-kimi:arckit-kimi"
```

- [ ] **Step 2: Add the generated-path guard**

Read the existing `GENERATED_EXTENSION_REQUIRED_PATHS` map:

```bash
sed -n '37,60p' scripts/push-extensions.sh
```

Add a matching `[kimi]` entry naming a path that only exists after a converter run, so a clean checkout cannot wipe the published repo. Use `skills` and `plugin.json`, matching the style of the neighbouring entries.

- [ ] **Step 3: Add the version-bearing file**

In `scripts/bump-version.sh`, after the `extensions/arckit-gemini/VERSION` block (near line 189), add:

```bash
# ── extensions/arckit-kimi/VERSION ────────────────────────────────────────
echo "$NEW_VERSION" > extensions/arckit-kimi/VERSION
update_file "extensions/arckit-kimi/VERSION" "overwrite"
```

The generated `plugin.json` picks the value up on the next converter run and is never edited directly.

- [ ] **Step 4: Verify the bump script is still syntactically valid**

Run: `bash -n scripts/bump-version.sh && bash -n scripts/push-extensions.sh && echo "SYNTAX OK"`
Expected: `SYNTAX OK`.

- [ ] **Step 5: Commit**

```bash
git add scripts/push-extensions.sh scripts/bump-version.sh
git commit -m "chore(kimi): register arckit-kimi for publishing and version bumps"
```

---

## Task 9: Documentation

**Files:**

- Modify: `CLAUDE.md`, `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`, `CHANGELOG.md`, `plugins/arckit-claude/CHANGELOG.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Change "Six distribution formats" to "Seven distribution formats" and add the numbered entry:

```markdown
7. **Kimi Code CLI extension** (`extensions/arckit-kimi/`) — published as `tractorjuice/arckit-kimi`, installed via `kimi plugin install https://github.com/tractorjuice/arckit-kimi.git`. Commands ship as Agent Skills (`skills/<name>/SKILL.md`) invoked with `/skill:arckit-<command>`; the `plugin.json` manifest carries the six MCP servers and auto-loads `architecture-workflow` at session start.
```

Add `extensions/arckit-kimi/` to the generated-formats paragraph listing gitignored converter outputs, and add a row to the slash-command format table:

```markdown
| Kimi Code CLI | `/skill:arckit-requirements` (skill) | `extensions/arckit-kimi/skills/arckit-requirements/SKILL.md` |
```

- [ ] **Step 2: Update `README.md` and `docs/index.html`**

Add Kimi Code CLI wherever the other six formats are enumerated, with the install command. Search first so none are missed:

```bash
grep -n "Mistral Vibe\|arckit-vibe" README.md docs/index.html docs/DEPENDENCY-MATRIX.md
```

Add a Kimi entry adjacent to each hit.

- [ ] **Step 3: Update both CHANGELOGs**

Add to the Unreleased section of `CHANGELOG.md` and `plugins/arckit-claude/CHANGELOG.md`:

```markdown
### Added

- **Kimi Code CLI extension** (`arckit-kimi`) — seventh distribution format. Every ArcKit command ships as a Kimi Agent Skill invoked with `/skill:arckit-<command>`, with the six bundled MCP servers declared in `plugin.json` and `architecture-workflow` auto-loaded at session start. Install with `kimi plugin install https://github.com/tractorjuice/arckit-kimi.git`; scaffold a project with `arckit init --ai kimi`.
```

- [ ] **Step 4: Lint**

Run: `npx markdownlint-cli2 "**/*.md"`
Expected: no errors. Fix with `npx markdownlint-cli2 --fix "**/*.md"` and re-run if needed.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md README.md docs/index.html docs/DEPENDENCY-MATRIX.md \
        CHANGELOG.md plugins/arckit-claude/CHANGELOG.md
git commit -m "docs: document the Kimi Code CLI distribution format"
```

---

## Task 10: Live smoke test (release gate)

**Files:** none. Verification only.

Every preceding task validated generated output against documentation. Nothing has been run against a real Kimi Code CLI. **Do not release without completing this task.** If the CLI is unavailable, say so explicitly rather than marking the task done.

- [ ] **Step 1: Install the CLI**

```bash
curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash
```

Installs to `$HOME/.kimi-code` and appends to PATH. Confirm with `kimi --version`.

- [ ] **Step 2: Install the plugin from the local build**

```bash
kimi plugin install /workspaces/arc-kit/extensions/arckit-kimi
```

Expected: install succeeds and `/plugins` lists ArcKit under Installed.

- [ ] **Step 3: Confirm the manifest loaded correctly**

In the Kimi TUI, run `/plugins` and `/mcp`.
Expected: ArcKit appears with displayName "ArcKit"; the MCP list shows the bundled servers, with the two keyed ones failing auth if no key is set (expected and harmless).

- [ ] **Step 4: Confirm session-start orientation**

Start a fresh session.
Expected: `architecture-workflow` content is present in context without being asked for.

- [ ] **Step 5: Run one command end to end**

In a scratch project scaffolded with `arckit init smoke --ai kimi`, run:

```text
/skill:arckit-requirements
```

Expected: the skill loads, reads its template from `.arckit/templates/`, and writes an `ARC-001-REQ-v1.0.md` artefact.

- [ ] **Step 6: Record the result**

Paste the observed behaviour into the PR description, including anything that did not work. If a documented field behaves differently from the spec's assumptions, fix the generator and re-run, rather than adjusting the smoke test to pass.

---

## Explicit non-goals

- **Do NOT touch the Mistral Vibe generators** (`converter.py:1191-1193`, `convert_vibe_agents.py:143`). `mistral-large-2` is correct there; Kimi is not Vibe.
- **Do NOT add Kimi model ids to `MODEL_MAX_EFFORT`** in `provenance-model.mjs`. That hook is Claude-only and it would be a no-op.
- **Do NOT add a Moonshot provider to Codex or OpenCode configs.** Letting those CLIs select `kimi-k3` is separate, deliberately dropped work. Note that OpenCode's `ProviderConfig` sets `additionalProperties: false` and has no `enabled` field, so any future attempt must not use a disabled-provider stanza.
- **Do NOT implement Kimi `tools`, `config_file` or `inject`.** ArcKit ships no executable plugin tools.
- **Do NOT implement Kimi flow skills (`type: flow`) or hooks.**
- **Do NOT change any default model anywhere in ArcKit.**
- **Do NOT port `arckit-build`.**

## Self-review

- **Spec coverage:** every spec section maps to a task. Package shape and gitignore (Task 1), skill naming (Task 2), the shared rewrite core the spec implied but did not name (Task 3), manifest and MCP mapping (Task 4), converter wiring including frontmatter mapping and invocation rewriting (Task 5), all seven of the spec's listed test assertions plus two more (Task 6), the CLI change (Task 7), publishing and version registration (Task 8), documentation (Task 9), and the live smoke test the spec's risk section demanded (Task 10).
- **Placeholder scan:** no TBDs. Two steps deliberately instruct reading existing code before editing (Task 7 Step 1, Task 8 Step 2) because the exact surrounding shape must be matched rather than guessed; both state precisely what to look for and what to add.
- **Type and name consistency:** `kimi_skill_name` and `kimi_skill_invocation` are used identically in Tasks 2, 5 and 6. `_rewrite_skill_content`'s five parameters are named identically in its definition (Task 3 Step 3), its Codex caller (Task 3 Step 4), its golden test (Task 3 Step 1) and its Kimi caller (Task 5 Step 4). `generate_kimi_plugin_json(mcp_json_path, version, output_path)` has the same signature in Task 4 Step 3 and its `main()` call site in Task 5 Step 5. The test file is `tests/kimi/test_kimi_extension.py` throughout, and `KIMI_ALLOWED_FRONTMATTER_KEYS` defined in Task 2 is consumed in Task 6.
