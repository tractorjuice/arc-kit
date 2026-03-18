# Codex Subagent Delegation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update ArcKit's Codex extension so that the 6 agent-backed skills delegate to named subagents instead of inlining the full prompt, and upgrade agent `.toml` files to the new Codex subagent schema.

**Architecture:** `converter.py` gains a `CODEX_AGENT_CONFIG` dict and `generate_thin_wrapper()` function. The `convert()` skill-format branch checks `agent_map` to decide between thin wrapper and full inline. `generate_agent_toml_files()` switches from `extract_agent_prompt()` to `extract_frontmatter_and_prompt()` to emit the full subagent schema.

**Tech Stack:** Python 3, PyYAML, TOML (string generation), Markdown

**Spec:** `docs/superpowers/specs/2026-03-16-codex-subagent-delegation-design.md`

---

## File Structure

| File | Responsibility | Change Type |
|------|---------------|-------------|
| `scripts/converter.py` | All conversion logic — single file with `CODEX_AGENT_CONFIG`, `description_oneline()`, updated `generate_agent_toml_files()`, updated `convert()` skill branch, new `generate_thin_wrapper()` | Modify |
| `arckit-codex/agents/arckit-*.toml` (6 files) | Per-agent subagent config | Regenerated |
| `arckit-codex/skills/arckit-{research,datascout,aws-research,azure-research,gcp-research,framework}/SKILL.md` (6 files) | Thin wrapper skills | Regenerated |
| `arckit-codex/config.toml` | Central agent + MCP config | Regenerated (no structural change) |

All generated files are output of `python scripts/converter.py` — we only hand-edit `converter.py`.

---

## Chunk 1: converter.py Changes

### Task 1: Add `CODEX_AGENT_CONFIG` dict and `description_oneline()` helper

**Files:**
- Modify: `scripts/converter.py:109` (after existing `AGENT_CONFIG` dict)

- [ ] **Step 1: Add `CODEX_AGENT_CONFIG` dict after `AGENT_CONFIG`**

Insert after line 169 (end of `AGENT_CONFIG`), before `def rewrite_paths`:

```python
# --- Codex subagent configuration: per-agent overrides for the new schema ---
# name/description come from Claude agent frontmatter; these are Codex-specific fields.
# Agents not listed here fall back to the old format (developer_instructions only).

CODEX_AGENT_CONFIG = {
    "arckit-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": [],
    },
    "arckit-datascout": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["datacommons-mcp"],
    },
    "arckit-aws-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["aws-knowledge"],
    },
    "arckit-azure-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["microsoft-learn"],
    },
    "arckit-gcp-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["google-developer-knowledge"],
    },
    "arckit-framework": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": [],
    },
}
```

- [ ] **Step 2: Add `description_oneline()` helper**

Insert immediately after `CODEX_AGENT_CONFIG`:

```python
def description_oneline(description):
    """Extract a clean one-line description from a multi-line agent description.

    Algorithm: first line, strip trailing 'Examples:', truncate to 200 chars.
    """
    first_line = description.strip().split("\n")[0].strip()
    # Strip trailing "Examples:" suffix
    if first_line.endswith("Examples:"):
        first_line = first_line[: -len("Examples:")].strip()
    # Truncate to 200 chars at word boundary
    if len(first_line) > 200:
        truncated = first_line[:200].rsplit(" ", 1)[0]
        first_line = truncated + "..."
    return first_line
```

- [ ] **Step 3: Verify syntax**

Run: `python -c "import scripts.converter"` (or `python scripts/converter.py --help` if applicable)
Expected: No import errors

- [ ] **Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(converter): add CODEX_AGENT_CONFIG and description_oneline helper"
```

---

### Task 2: Update `generate_agent_toml_files()` to emit full subagent schema

**Files:**
- Modify: `scripts/converter.py:474-510` (`generate_agent_toml_files` function)

- [ ] **Step 1: Replace the function body**

Replace the current `generate_agent_toml_files()` function (lines 474-510) with:

```python
def generate_agent_toml_files(agents_dir, output_dir, path_prefix=".arckit"):
    """Generate per-agent .toml config files for Codex extension.

    Uses the full Codex subagent schema (name, description, model, sandbox_mode,
    mcp_servers, developer_instructions) for agents listed in CODEX_AGENT_CONFIG.
    Falls back to developer_instructions-only for unlisted agents.
    """
    if not os.path.isdir(agents_dir):
        return

    os.makedirs(output_dir, exist_ok=True)
    count = 0

    # Load MCP server names for validation
    mcp_json_path = os.path.join(os.path.dirname(agents_dir.rstrip(os.sep)), ".mcp.json")
    known_mcp_servers = set()
    if os.path.isfile(mcp_json_path):
        with open(mcp_json_path, "r", encoding="utf-8") as f:
            mcp_config = json.load(f)
        known_mcp_servers = set(mcp_config.get("mcpServers", {}).keys())

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", path_prefix)
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"""', '\\"\\"\\"')

        agent_name = filename.replace(".md", "")  # e.g. "arckit-research"
        toml_name = filename.replace(".md", ".toml")
        toml_path = os.path.join(output_dir, toml_name)

        lines = [
            f"# Auto-generated from arckit-claude/agents/{filename}",
            f"# Do not edit — edit the source and re-run scripts/converter.py",
            "",
        ]

        if agent_name in CODEX_AGENT_CONFIG:
            # Full subagent schema
            cfg = CODEX_AGENT_CONFIG[agent_name]
            desc = frontmatter.get("description", "")
            oneline = description_oneline(desc)
            escaped_name = agent_name.replace('"', '\\"')
            escaped_desc = oneline.replace('"', '\\"')

            lines.append(f'name = "{escaped_name}"')
            lines.append(f'description = "{escaped_desc}"')

            if "model" in cfg:
                lines.append(f'model = "{cfg["model"]}"')
            if "sandbox_mode" in cfg:
                lines.append(f'sandbox_mode = "{cfg["sandbox_mode"]}"')

            # MCP servers — validate against known servers
            if "mcp_servers" in cfg:
                for server in cfg["mcp_servers"]:
                    if known_mcp_servers and server not in known_mcp_servers:
                        print(f"  WARNING: MCP server '{server}' in CODEX_AGENT_CONFIG['{agent_name}'] not found in .mcp.json")
                servers_str = ", ".join(f'"{s}"' for s in cfg["mcp_servers"])
                lines.append(f"mcp_servers = [{servers_str}]")

            lines.append("")

        lines.append(f'developer_instructions = """')
        lines.append(prompt_escaped)
        lines.append(f'"""')

        with open(toml_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        count += 1

    print(f"  Generated {count} agent .toml files in {output_dir}")
```

- [ ] **Step 2: Verify the function runs without error**

Run: `python scripts/converter.py 2>&1 | head -20`
Expected: No Python errors; should see "Generated 6 agent .toml files"

- [ ] **Step 3: Inspect one generated .toml**

Run: `head -12 arckit-codex/agents/arckit-research.toml`
Expected output should show `name`, `description`, `model`, `sandbox_mode`, `mcp_servers` fields before `developer_instructions`.

- [ ] **Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(converter): generate full subagent schema in agent .toml files"
```

---

### Task 3: Add `generate_thin_wrapper()` function

**Files:**
- Modify: `scripts/converter.py` (add new function before `convert()`)

- [ ] **Step 1: Add the function**

Insert before the `convert()` function definition (before line 246):

```python
# --- Thin wrapper content for each agent-backed command ---
# Maps agent name -> (title, purpose, prerequisites, output, execution_prompt)
# Extracted from Claude command files for use in Codex thin wrappers.

THIN_WRAPPER_CONTENT = {
    "research": {
        "title": "Technology and Service Research",
        "purpose": (
            "Conduct comprehensive market research to identify available technologies, services, and "
            "products that satisfy the project's requirements. Covers SaaS vendors, open source, "
            "managed cloud services, and UK Government platforms (GOV.UK, Digital Marketplace)."
        ),
        "prerequisites": [
            "Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first",
            "Architecture principles (`ARC-000-PRIN-*.md`) should exist — run `$arckit-principles` first",
        ],
        "output": [
            "Categorised technology/vendor comparison with real pricing",
            "Build vs buy recommendation per category",
            "3-year TCO analysis",
            "UK Government framework availability (G-Cloud, DOS)",
            "Comprehensive research document saved to `projects/{project}/`",
        ],
        "execution_prompt": (
            "Research technology and service options for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read requirements, identify categories, conduct web research, "
            "build vs buy analysis, TCO comparison, write document, return summary."
        ),
        "execution_note": (
            'If the user included `--no-spawn` in their arguments, append:\n'
            '"Skip Step 11b (do not spawn vendor profiles or tech notes)."'
        ),
    },
    "datascout": {
        "title": "Data Source Discovery (DataScout)",
        "purpose": (
            "Discover external data sources — APIs, datasets, open data portals, and commercial data "
            "providers — that can fulfil the project's data and integration requirements. Covers UK "
            "Government open data (data.gov.uk, api.gov.uk), commercial APIs, free/freemium sources, "
            "and assesses data utility beyond primary requirements."
        ),
        "prerequisites": [
            "Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first",
            "Data requirements (DR-xxx) and integration requirements (INT-xxx) are especially important",
        ],
        "output": [
            "Categorised data source catalogue with scoring",
            "API availability and authentication details",
            "Data quality and freshness assessments",
            "Gap analysis for unmet data requirements",
            "Data utility analysis for cross-project value",
            "Comprehensive datascout document saved to `projects/{project}/`",
        ],
        "execution_prompt": (
            "Discover external data sources for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read requirements, check api.gov.uk and data.gov.uk first, "
            "discover sources per category, evaluate with weighted scoring, gap analysis, data utility "
            "analysis, write document, return summary."
        ),
        "execution_note": None,
    },
    "aws-research": {
        "title": "AWS Technology Research",
        "purpose": (
            "Research AWS services and architecture patterns using the AWS Knowledge MCP server to "
            "match project requirements to AWS services, Well-Architected guidance, Security Hub "
            "controls, and UK Government compliance."
        ),
        "prerequisites": [
            "Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first",
            "Architecture principles (`ARC-000-PRIN-*.md`) should exist — run `$arckit-principles` first",
        ],
        "output": [
            "AWS service recommendations per requirement category",
            "Well-Architected Framework assessment",
            "Security Hub control mappings",
            "UK Government compliance verification",
            "Cost estimation with AWS pricing",
            "Research document saved to `projects/{project}/`",
        ],
        "execution_prompt": (
            "Research AWS services and architecture patterns for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read requirements, research AWS services per category, "
            "Well-Architected assessment, Security Hub mapping, UK Government compliance, cost "
            "estimation, write document, return summary."
        ),
        "execution_note": None,
    },
    "azure-research": {
        "title": "Azure Technology Research",
        "purpose": (
            "Research Azure services and architecture patterns using the Microsoft Learn MCP server to "
            "match project requirements to Azure services, Well-Architected guidance, Security Benchmark "
            "controls, and UK Government compliance."
        ),
        "prerequisites": [
            "Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first",
            "Architecture principles (`ARC-000-PRIN-*.md`) should exist — run `$arckit-principles` first",
        ],
        "output": [
            "Azure service recommendations per requirement category",
            "Well-Architected Framework assessment",
            "Security Benchmark control mappings",
            "UK Government compliance verification",
            "Cost estimation with Azure pricing",
            "Research document saved to `projects/{project}/`",
        ],
        "execution_prompt": (
            "Research Azure services and architecture patterns for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read requirements, research Azure services per category, "
            "Well-Architected assessment, Security Benchmark mapping, UK Government compliance, cost "
            "estimation, write document, return summary."
        ),
        "execution_note": None,
    },
    "gcp-research": {
        "title": "Google Cloud Technology Research",
        "purpose": (
            "Research Google Cloud services and architecture patterns using the Google Developer "
            "Knowledge MCP server to match project requirements to Google Cloud services, Architecture "
            "Framework guidance, Security Command Center controls, and UK Government compliance."
        ),
        "prerequisites": [
            "Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first",
            "Architecture principles (`ARC-000-PRIN-*.md`) should exist — run `$arckit-principles` first",
        ],
        "output": [
            "Google Cloud service recommendations per requirement category",
            "Architecture Framework assessment",
            "Security Command Center control mappings",
            "UK Government compliance verification",
            "Cost estimation with Google Cloud pricing",
            "Research document saved to `projects/{project}/`",
        ],
        "execution_prompt": (
            "Research Google Cloud services and architecture patterns for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read requirements, research Google Cloud services per category, "
            "Architecture Framework assessment, Security Command Center mapping, UK Government compliance, "
            "cost estimation, write document, return summary."
        ),
        "execution_note": None,
    },
    "framework": {
        "title": "Framework Generation",
        "purpose": (
            "Transform existing project artifacts (requirements, strategies, stakeholder analyses, "
            "data models, research findings) into a structured, phased framework with overview "
            "document and Executive Guide for senior stakeholders."
        ),
        "prerequisites": [
            "Architecture principles (`ARC-*-PRIN-*.md`) and requirements (`ARC-*-REQ-*.md`) must exist",
            "Recommended: stakeholder analysis, strategy, data model, research findings",
        ],
        "output": [
            "Phased framework directory structure",
            "Framework overview document (FWRK)",
            "Executive Guide for senior stakeholders",
            "Documents saved to `projects/{project}/framework/`",
        ],
        "execution_prompt": (
            "Create a structured framework for the project in projects/{{project-dir}}/.\n"
            "User's additional context: $ARGUMENTS\n"
            "Follow your full process: read all artifacts, categorise into phases, create framework "
            "directory structure, generate FWRK overview document, generate Executive Guide, return summary."
        ),
        "execution_note": None,
    },
}


def generate_thin_wrapper(base_name, description, handoffs, cmd_fmt):
    """Generate an informative SKILL.md that delegates to a named Codex subagent.

    Args:
        base_name: Command name without extension (e.g. "research")
        description: One-line description from command frontmatter
        handoffs: List of handoff dicts from command frontmatter
        cmd_fmt: Command format string for handoffs (e.g. "$arckit-{cmd}")

    Returns:
        String content for SKILL.md
    """
    agent_name = f"arckit-{base_name}"
    content_cfg = THIN_WRAPPER_CONTENT.get(base_name)

    if not content_cfg:
        # Fallback: no thin wrapper content defined, return None to signal
        # the caller should use the full inline prompt
        return None

    escaped_desc = description.replace('"', '\\"')
    lines = [
        "---",
        f"name: {agent_name}",
        f'description: "{escaped_desc}"',
        "---",
        "",
        f"# {content_cfg['title']}",
        "",
        "## Purpose",
        "",
        content_cfg["purpose"],
        "",
        "## Prerequisites",
        "",
    ]
    for prereq in content_cfg["prerequisites"]:
        lines.append(f"- {prereq}")

    lines += [
        "",
        "## What This Command Produces",
        "",
    ]
    for item in content_cfg["output"]:
        lines.append(f"- {item}")

    lines += [
        "",
        "## Execution",
        "",
        f"Spawn the `{agent_name}` agent to handle this request:",
        "",
    ]
    for prompt_line in content_cfg["execution_prompt"].split("\n"):
        lines.append(f"> {prompt_line}")

    if content_cfg.get("execution_note"):
        lines += [
            "",
            content_cfg["execution_note"],
        ]

    # Add handoffs as Suggested Next Steps
    if handoffs:
        lines += [
            "",
            "## Suggested Next Steps",
            "",
        ]
        for h in handoffs:
            cmd = h.get("command", "")
            desc = h.get("description", "")
            formatted_cmd = cmd_fmt.format(cmd=cmd)
            line = f"- `{formatted_cmd}`"
            if desc:
                line += f" — {desc}"
            lines.append(line)

    lines.append("")
    return "\n".join(lines)
```

- [ ] **Step 2: Verify syntax**

Run: `python -c "from scripts.converter import generate_thin_wrapper; print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(converter): add THIN_WRAPPER_CONTENT and generate_thin_wrapper()"
```

---

### Task 4: Update `convert()` skill-format branch to use thin wrappers

**Files:**
- Modify: `scripts/converter.py:348-364` (the `if config["format"] == "skill":` branch inside `convert()`)

- [ ] **Step 1: Update the skill-format branch**

Replace the existing skill-format block (lines 348-364) with:

```python
            if config["format"] == "skill":
                skill_name = f"arckit-{base_name}"
                skill_dir = os.path.join(config["output_dir"], skill_name)
                os.makedirs(skill_dir, exist_ok=True)
                os.makedirs(os.path.join(skill_dir, "agents"), exist_ok=True)

                # For agent-backed commands, generate thin wrapper
                if filename in agent_map:
                    wrapper = generate_thin_wrapper(
                        base_name, description, handoffs, cmd_fmt
                    )
                    if wrapper:
                        skill_md = wrapper
                    else:
                        # Fallback: no wrapper content defined for this agent
                        print(f"  WARNING: No THIN_WRAPPER_CONTENT for '{base_name}' — using full inline prompt")
                        escaped_desc = description.replace('"', '\\"')
                        skill_md = f'---\nname: {skill_name}\ndescription: "{escaped_desc}"\n---\n\n{rewritten}\n'
                else:
                    escaped_desc = description.replace('"', '\\"')
                    skill_md = f'---\nname: {skill_name}\ndescription: "{escaped_desc}"\n---\n\n{rewritten}\n'

                openai_yaml = "policy:\n  allow_implicit_invocation: false\n"

                with open(os.path.join(skill_dir, "SKILL.md"), "w", encoding="utf-8") as f:
                    f.write(skill_md)
                with open(os.path.join(skill_dir, "agents", "openai.yaml"), "w", encoding="utf-8") as f:
                    f.write(openai_yaml)

                print(f"  {config['name'] + ':':14s}{source_label} -> {skill_dir}/")
                counts[agent_id] += 1
```

- [ ] **Step 2: Run the full converter**

Run: `python scripts/converter.py`
Expected: No errors; all outputs generated. The 6 agent-backed skills should still appear in the output.

- [ ] **Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(converter): thin wrapper delegation for agent-backed Codex skills"
```

---

## Chunk 2: Verification

### Task 5: Verify generated agent .toml files

**Files:**
- Check: `arckit-codex/agents/arckit-*.toml` (6 files)

- [ ] **Step 1: Run the converter to regenerate all files**

Run: `python scripts/converter.py`
Expected: Clean output with no warnings about MCP server mismatches.

- [ ] **Step 2: Verify arckit-research.toml has full schema**

Run: `head -15 arckit-codex/agents/arckit-research.toml`
Expected: Shows `name`, `description`, `model = "o3"`, `sandbox_mode = "full-auto"`, `mcp_servers = []`, then `developer_instructions`.

- [ ] **Step 3: Verify arckit-aws-research.toml has scoped MCP**

Run: `head -15 arckit-codex/agents/arckit-aws-research.toml`
Expected: Shows `mcp_servers = ["aws-knowledge"]`.

- [ ] **Step 4: Verify arckit-datascout.toml has datacommons MCP**

Run: `head -15 arckit-codex/agents/arckit-datascout.toml`
Expected: Shows `mcp_servers = ["datacommons-mcp"]`.

- [ ] **Step 5: Verify all 6 agent files have the name field**

Run: `grep '^name = ' arckit-codex/agents/arckit-*.toml`
Expected: 6 lines, one per agent.

---

### Task 6: Verify generated thin wrapper skills

**Files:**
- Check: `arckit-codex/skills/arckit-{research,datascout,aws-research,azure-research,gcp-research,framework}/SKILL.md` (6 files)

- [ ] **Step 1: Check arckit-research SKILL.md is a thin wrapper**

Run: `wc -l arckit-codex/skills/arckit-research/SKILL.md`
Expected: ~40-50 lines (not 334).

- [ ] **Step 2: Verify it contains spawn instruction**

Run: `grep "Spawn the" arckit-codex/skills/arckit-research/SKILL.md`
Expected: `Spawn the \`arckit-research\` agent to handle this request:`

- [ ] **Step 3: Verify it has Suggested Next Steps with Codex format**

Run: `grep '\$arckit-' arckit-codex/skills/arckit-research/SKILL.md`
Expected: Lines like `$arckit-wardley`, `$arckit-sobc`, `$arckit-sow`.

- [ ] **Step 4: Verify all 6 agent-backed skills are thin wrappers**

Run: `for f in research datascout aws-research azure-research gcp-research framework; do echo "$f: $(wc -l < arckit-codex/skills/arckit-$f/SKILL.md) lines"; done`
Expected: All should be ~40-55 lines.

- [ ] **Step 5: Verify a non-agent skill is unchanged (full inline)**

Run: `wc -l arckit-codex/skills/arckit-requirements/SKILL.md`
Expected: >100 lines (full inline prompt, unchanged).

---

### Task 7: Verify idempotency and command reference rewriting

- [ ] **Step 1: Run converter twice, check for diff**

Run: `python scripts/converter.py && python scripts/converter.py && git diff --stat arckit-codex/`
Expected: No diff — second run produces identical output.

- [ ] **Step 2: Verify rewrite_codex_skills() rewrites references in thin wrappers**

Run: `grep '/arckit:' arckit-codex/skills/arckit-research/SKILL.md`
Expected: No matches — all `/arckit:X` should be rewritten to `$arckit-X`.

- [ ] **Step 3: Commit all generated files**

Run: `git add arckit-codex/ && git status`
Then:
```bash
git commit -m "feat(codex): regenerate with subagent schema and thin wrapper skills

- Agent .toml files now use full Codex subagent schema (name, description,
  model, sandbox_mode, mcp_servers, developer_instructions)
- 6 agent-backed skills use thin wrappers that spawn named agents
- 58 non-agent skills unchanged"
```

---

## Chunk 3: Final Verification

### Task 8: End-to-end verification

- [ ] **Step 1: Verify no Python syntax errors**

Run: `python -c "import scripts.converter; print('converter imports OK')"`

- [ ] **Step 2: Verify converter runs cleanly from scratch**

Run: `python scripts/converter.py 2>&1 | tail -5`
Expected: Summary line showing total generated files count (should match previous).

- [ ] **Step 3: Spot-check that config.toml is structurally unchanged**

Run: `head -30 arckit-codex/config.toml`
Expected: Same structure as before — MCP servers, then agent roles with `config_file` pointers.

- [ ] **Step 4: Verify no regressions in other extensions**

Run: `git diff --stat arckit-gemini/ arckit-opencode/ arckit-copilot/`
Expected: No changes to Gemini, OpenCode, or Copilot extensions (unless converter also regenerated supporting files, which is expected and benign).
