# Copilot Prompt Files Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GitHub Copilot as a 6th distribution format for ArcKit, generating `.prompt.md` prompt files, `.agent.md` agent files, and `copilot-instructions.md` from the existing plugin commands.

**Architecture:** Extend `scripts/converter.py` with a new `"copilot"` entry in `AGENT_CONFIG` and a new `"prompt"` output format. Add `generate_copilot_agents()` and `generate_copilot_instructions()` functions. Extend the CLI with `--ai copilot` in `arckit init`. Create `arckit-copilot/` as the standalone extension directory.

**Tech Stack:** Python (converter.py, CLI), YAML frontmatter, Markdown prompt files, Bash (bump-version.sh)

---

### Task 1: Create arckit-copilot/ directory and VERSION file

**Files:**
- Create: `arckit-copilot/VERSION`

**Step 1: Create the extension directory and VERSION**

```bash
mkdir -p arckit-copilot
```

Read the current plugin version from `arckit-claude/VERSION` and write the same version to `arckit-copilot/VERSION`.

```python
# arckit-copilot/VERSION should contain just the version number, e.g.:
4.0.0
```

**Step 2: Verify**

```bash
cat arckit-copilot/VERSION
# Expected: same version as arckit-claude/VERSION
```

**Step 3: Commit**

```bash
git add arckit-copilot/VERSION
git commit -m "feat(copilot): create arckit-copilot extension directory"
```

---

### Task 2: Add "copilot" to AGENT_CONFIG in converter.py

**Files:**
- Modify: `scripts/converter.py:111-156` (AGENT_CONFIG dictionary)

**Step 1: Add the copilot config entry**

Add this entry after the `"gemini"` entry in `AGENT_CONFIG` (around line 156):

```python
    "copilot": {
        "name": "Copilot",
        "output_dir": "arckit-copilot/prompts",
        "filename_pattern": "arckit-{name}.prompt.md",
        "format": "prompt",
        "path_prefix": ".arckit",
        "extension_dir": "arckit-copilot",
        "copy_commands_to_extension": False,
        "copy_agents_to_extension": False,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
```

Note: `copy_commands_to_extension` and `copy_agents_to_extension` are `False` because Copilot prompt files go directly to `arckit-copilot/prompts/` (no separate commands/ copy needed). Agents are generated separately by `generate_copilot_agents()`.

**Step 2: Verify the config is syntactically valid**

```bash
python -c "import scripts.converter" 2>&1 || python scripts/converter.py --help 2>&1 | head -5
```

This will fail because the `"prompt"` format doesn't exist yet — that's expected. Verify there are no syntax errors.

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): add copilot entry to AGENT_CONFIG"
```

---

### Task 3: Add "prompt" format to format_output()

**Files:**
- Modify: `scripts/converter.py:190-199` (format_output function)

**Step 1: Add the prompt format handler**

Modify `format_output()` to handle the `"prompt"` format. The function currently handles `"toml"` and defaults to markdown. Add a new branch:

```python
def format_output(description, prompt, fmt):
    """Format into target format: 'markdown', 'toml', 'prompt', or 'skill'."""
    if fmt == "toml":
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')
        prompt_formatted = '"""\n' + prompt_escaped + '\n"""'
        description_formatted = '"""\n' + description + '\n"""'
        return f"description = {description_formatted}\nprompt = {prompt_formatted}\n"
    elif fmt == "prompt":
        escaped = description.replace("'", "''")
        # Determine tools based on prompt content
        tools = _copilot_tools_for_prompt(prompt)
        tools_yaml = "[" + ", ".join(f"'{t}'" for t in tools) + "]"
        return (
            f"---\n"
            f"description: '{escaped}'\n"
            f"agent: 'agent'\n"
            f"tools: {tools_yaml}\n"
            f"---\n\n"
            f"{prompt}\n"
        )
    else:
        escaped = description.replace("\\", "\\\\").replace('"', '\\"')
        return f'---\ndescription: "{escaped}"\n---\n\n{prompt}\n'
```

**Step 2: Add the tool heuristic helper function**

Add this function before `format_output()` (around line 189):

```python
# Default Copilot tools for most ArcKit commands
_COPILOT_DEFAULT_TOOLS = [
    "readFile", "editFiles", "runCommand", "codebase", "search",
]

# Additional tools for research-heavy commands
_COPILOT_RESEARCH_TOOLS = [
    "fetch", "readFile", "editFiles", "runCommand", "codebase", "search",
]


def _copilot_tools_for_prompt(prompt):
    """Determine Copilot tools based on prompt content."""
    # Commands that reference web searching get the fetch tool
    if any(kw in prompt for kw in ["WebSearch", "WebFetch", "web research",
                                    "search the web", "fetch", "MCP"]):
        return _COPILOT_RESEARCH_TOOLS
    return _COPILOT_DEFAULT_TOOLS
```

**Step 3: Run the converter to test**

```bash
python scripts/converter.py 2>&1 | tail -20
```

Expected: Copilot prompt files are generated in `arckit-copilot/prompts/`. Check one:

```bash
head -10 arckit-copilot/prompts/arckit-requirements.prompt.md
```

Expected output should show YAML frontmatter with `description`, `agent`, and `tools` fields.

**Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): add prompt format to format_output with tool heuristic"
```

---

### Task 4: Add Copilot-specific argument and handoff rewriting

**Files:**
- Modify: `scripts/converter.py:159-176` (rewrite_paths function)
- Modify: `scripts/converter.py:55-77` (render_handoffs_section function)
- Modify: `scripts/converter.py:260-292` (convert function loop)

**Step 1: Handle $ARGUMENTS rewriting for Copilot**

In the `rewrite_paths()` function, the Copilot config doesn't set `arg_placeholder` in AGENT_CONFIG, so `$ARGUMENTS` stays as-is. We need to add an `arg_placeholder` to the copilot config entry:

Update the copilot entry in `AGENT_CONFIG` to add:

```python
    "copilot": {
        ...
        "arg_placeholder": "${input:topic:Enter project name or topic}",
        ...
    },
```

This will cause `rewrite_paths()` to automatically replace `$ARGUMENTS` with the Copilot input variable syntax.

**Step 2: Add Copilot-specific handoff rendering**

The current `render_handoffs_section()` uses `/arckit:{cmd}` format. For Copilot, handoffs should use `/arckit-{cmd}` (matching prompt filenames).

Modify `render_handoffs_section()` to accept a format parameter:

```python
def render_handoffs_section(handoffs, command_format="/arckit:{cmd}"):
    """Render handoffs list as a markdown Suggested Next Steps section."""
    if not handoffs:
        return ""
    lines = [
        "",
        "## Suggested Next Steps",
        "",
        "After completing this command, consider running:",
        "",
    ]
    for h in handoffs:
        cmd = h.get("command", "")
        desc = h.get("description", "")
        cond = h.get("condition", "")
        line = f"- `{command_format.format(cmd=cmd)}`"
        if desc:
            line += f" -- {desc}"
        if cond:
            line += f" *(when {cond})*"
        lines.append(line)
    lines.append("")
    return "\n".join(lines)
```

**Step 3: Update the convert() function to pass format**

In `convert()`, around line 243, update the handoffs rendering call. The existing call is:

```python
handoffs_section = render_handoffs_section(handoffs)
```

This needs to move inside the per-agent loop so each format gets the right command syntax. Move the handoffs rendering inside the `for agent_id, config in AGENT_CONFIG.items():` loop:

```python
        for agent_id, config in AGENT_CONFIG.items():
            # Determine handoff command format based on target
            if config["format"] == "prompt":
                cmd_fmt = "/arckit-{cmd}"
            elif config["format"] == "skill":
                cmd_fmt = "$arckit-{cmd}"
            elif config["format"] == "toml":
                cmd_fmt = "/arckit:{cmd}"
            else:
                cmd_fmt = "/arckit:{cmd}"

            handoffs_section = render_handoffs_section(handoffs, command_format=cmd_fmt)

            if has_standalone and not config.get("has_sync_guides_hook", False):
                rewritten = rewrite_paths(standalone_prompt, config)
            else:
                rewritten = rewrite_paths(prompt, config)
                rewritten = rewrite_hook_dependencies(rewritten, config)

            if handoffs_section:
                rewritten = rewritten + "\n" + handoffs_section
```

And remove the old handoffs rendering that was outside the loop (around lines 242-245):

```python
        # DELETE these lines:
        handoffs_section = render_handoffs_section(handoffs)
        if handoffs_section:
            prompt = prompt + "\n" + handoffs_section
```

**Step 4: Run the converter and verify handoffs**

```bash
python scripts/converter.py 2>&1 | tail -5
```

Check a command with handoffs:

```bash
grep -A5 "Suggested Next Steps" arckit-copilot/prompts/arckit-requirements.prompt.md
```

Expected: `/arckit-data-model`, `/arckit-research`, etc.

Also verify Codex skills still use `$arckit-` format:

```bash
grep -A5 "Suggested Next Steps" arckit-codex/skills/arckit-requirements/SKILL.md
```

Expected: `$arckit-data-model`, `$arckit-research`, etc.

And verify Gemini TOML still uses `/arckit:` format:

```bash
grep -A5 "Suggested Next Steps" arckit-gemini/commands/arckit/requirements.toml
```

Expected: `/arckit:data-model`, `/arckit:research`, etc.

**Step 5: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): copilot-specific argument and handoff rewriting"
```

---

### Task 5: Add generate_copilot_agents() function

**Files:**
- Modify: `scripts/converter.py` (add new function after `generate_gemini_policies()`, around line 671)

**Step 1: Write the function**

Add `generate_copilot_agents()` after `generate_gemini_policies()`:

```python
def generate_copilot_agents(agents_dir, output_dir):
    """Generate Copilot custom agent .agent.md files from Claude Code agents.

    Reads each arckit-{name}.md from agents_dir, converts the YAML frontmatter
    (keeping name/description, dropping model, adding tools and user-invocable),
    rewrites paths for .arckit prefix, and writes to output_dir as .agent.md files.
    """
    if not os.path.isdir(agents_dir):
        print(f"  Skipped: {agents_dir} not found")
        return

    os.makedirs(output_dir, exist_ok=True)
    count = 0

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)

        # Build Copilot agent frontmatter
        copilot_fm = {}
        if "name" in frontmatter:
            copilot_fm["name"] = frontmatter["name"]
        if "description" in frontmatter:
            # Use first line of description for Copilot
            desc = frontmatter["description"].strip().split("\n")[0].strip()
            copilot_fm["description"] = desc

        # Determine tools based on agent content
        copilot_fm["tools"] = _copilot_tools_for_prompt(prompt)
        copilot_fm["user-invocable"] = False

        # Rewrite paths
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")

        # Replace hook-dependent content
        prompt = prompt.replace(CONTEXT_HOOK_NOTE, CONTEXT_HOOK_REPLACEMENT)

        # Serialize frontmatter
        fm_str = yaml.dump(copilot_fm, default_flow_style=False, sort_keys=False).rstrip()

        # Output as .agent.md
        out_filename = filename.replace(".md", ".agent.md")
        output_content = f"---\n{fm_str}\n---\n\n{prompt}\n"

        out_path = os.path.join(output_dir, out_filename)
        with open(out_path, "w") as f:
            f.write(output_content)
        print(f"  {out_filename}")
        count += 1

    print(f"  Generated {count} Copilot agent files in {output_dir}")
```

**Step 2: Wire it into the __main__ pipeline**

In the `__main__` block (around line 770), after the Gemini policies generation, add:

```python
    print()
    print("Generating Copilot custom agents...")
    generate_copilot_agents(agents_dir, "arckit-copilot/agents")
```

**Step 3: Run the converter and verify**

```bash
python scripts/converter.py 2>&1 | grep -A8 "Copilot"
```

Check a generated agent:

```bash
head -15 arckit-copilot/agents/arckit-research.agent.md
```

Expected: YAML frontmatter with `name`, `description`, `tools`, `user-invocable: false`, then the agent prompt body.

**Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): add generate_copilot_agents function"
```

---

### Task 6: Add generate_copilot_instructions() function

**Files:**
- Modify: `scripts/converter.py` (add new function after `generate_copilot_agents()`)

**Step 1: Write the function**

```python
def generate_copilot_instructions(output_path):
    """Generate copilot-instructions.md for Copilot repos using ArcKit."""
    content = """\
# ArcKit Enterprise Architecture Toolkit

This project uses ArcKit for architecture governance. Available commands
are in `.github/prompts/arckit-*.prompt.md` (type `/` in Copilot Chat).

## Conventions

- All architecture artifacts go in `projects/` directories (e.g., `projects/001-project-name/`)
- Use `bash .arckit/scripts/bash/create-project.sh --json` to create numbered project dirs
- Use `bash .arckit/scripts/bash/generate-document-id.sh` for document IDs (e.g., ARC-001-REQ-v1.0)
- Templates are in `.arckit/templates/` (custom overrides in `.arckit/templates-custom/`)
- Always write large documents to files (avoid output token limits)
- Show only a summary to the user after generating artifacts

## Document ID Format

`ARC-{project}-{type}-v{version}` (e.g., `ARC-001-REQ-v1.0`)

## Requirement ID Prefixes

- BR-xxx: Business Requirements
- FR-xxx: Functional Requirements
- NFR-xxx: Non-Functional Requirements (NFR-P-xxx Performance, NFR-SEC-xxx Security)
- INT-xxx: Integration Requirements
- DR-xxx: Data Requirements

## Project Structure

```
projects/
├── 000-global/          # Cross-project artifacts (principles, policies)
└── 001-project-name/    # Numbered project directories
    ├── ARC-001-REQ-v1.0.md
    ├── ARC-001-STKE-v1.0.md
    ├── external/        # Reference documents
    └── vendors/         # Vendor evaluations
```
"""

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w") as f:
        f.write(content)
    print(f"  Generated: {output_path}")
```

**Step 2: Wire it into the __main__ pipeline**

After the `generate_copilot_agents` call:

```python
    print()
    print("Generating Copilot instructions...")
    generate_copilot_instructions("arckit-copilot/copilot-instructions.md")
```

**Step 3: Run and verify**

```bash
python scripts/converter.py 2>&1 | grep -A2 "Copilot instructions"
cat arckit-copilot/copilot-instructions.md | head -20
```

**Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): add generate_copilot_instructions function"
```

---

### Task 7: Update the __main__ summary output

**Files:**
- Modify: `scripts/converter.py:674-779` (__main__ block)

**Step 1: Update the print header**

Change the opening print statement (line 679-681) from:

```python
    print(
        "Converting plugin commands to Codex, OpenCode, and Gemini extension formats..."
    )
```

to:

```python
    print(
        "Converting plugin commands to Codex, OpenCode, Gemini, and Copilot formats..."
    )
```

**Step 2: Run the full converter and verify summary**

```bash
python scripts/converter.py
```

Expected: The summary line at the end should show 5 counts (Codex Extension + Codex Skills + OpenCode CLI + Gemini CLI + Copilot) and a higher total.

**Step 3: Verify generated files**

```bash
ls arckit-copilot/prompts/ | wc -l    # Expected: 60
ls arckit-copilot/agents/ | wc -l     # Expected: 6
test -f arckit-copilot/copilot-instructions.md && echo "OK"
```

**Step 4: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): update converter summary for copilot output"
```

---

### Task 8: Update copy_extension_files() for Copilot

**Files:**
- Modify: `scripts/converter.py:297-326` (copy_extension_files function)

**Step 1: Verify Copilot gets extension files automatically**

The `copy_extension_files()` function iterates over `AGENT_CONFIG` and copies supporting files to any entry with an `extension_dir`. Since the copilot config has `"extension_dir": "arckit-copilot"`, it should already copy templates, scripts, guides, skills, and references.

Run the converter and check:

```bash
python scripts/converter.py 2>&1 | grep "Copying to Copilot"
ls arckit-copilot/templates/ | head -5
ls arckit-copilot/scripts/bash/ | head -5
```

If the output shows "Copying to Copilot extension (arckit-copilot)..." and the directories have files, this step is already working. No code changes needed.

**Step 2: Commit (only if changes were needed)**

If any changes were required:

```bash
git add scripts/converter.py
git commit -m "feat(copilot): ensure extension files copied to arckit-copilot"
```

---

### Task 9: Update prompt files for agent-backed commands

**Files:**
- Modify: `scripts/converter.py:260-292` (convert function, inside the per-agent loop)

**Step 1: Make agent-backed Copilot prompts reference the agent**

For commands that have corresponding agents (research, datascout, aws-research, azure-research, gcp-research, framework), the Copilot prompt file should be a thin wrapper that references the agent via `agent:` frontmatter, rather than inlining the full agent prompt.

Add a special case in the convert loop for the `"prompt"` format when the command has an agent:

In the `convert()` function, inside the `for agent_id, config in AGENT_CONFIG.items():` loop, before the format_output call, add:

```python
            # For Copilot prompt format with agent-backed commands,
            # generate a thin wrapper that references the .agent.md file
            if config["format"] == "prompt" and filename in agent_map:
                agent_name = filename.replace(".md", "")
                agent_ref = f"arckit-{agent_name}"
                escaped_desc = description.replace("'", "''")
                tools = _copilot_tools_for_prompt(rewritten)
                tools_yaml = "[" + ", ".join(f"'{t}'" for t in tools) + "]"

                # Determine handoff command format for Copilot
                handoffs_md = render_handoffs_section(handoffs, command_format="/arckit-{cmd}")

                content = (
                    f"---\n"
                    f"description: '{escaped_desc}'\n"
                    f"agent: '{agent_ref}'\n"
                    f"tools: {tools_yaml}\n"
                    f"---\n\n"
                    f"Use the `{agent_ref}` agent to handle this request.\n"
                )
                if handoffs_md:
                    content += "\n" + handoffs_md

                out_filename = config["filename_pattern"].format(name=base_name)
                out_path = os.path.join(config["output_dir"], out_filename)
                with open(out_path, "w") as f:
                    f.write(content)
                print(f"  {config['name'] + ':':14s}{source_label} -> {out_path} (agent wrapper)")
                counts[agent_id] += 1
                continue  # Skip the normal format_output path
```

**Step 2: Run and verify**

```bash
python scripts/converter.py 2>&1 | grep "agent wrapper"
```

Expected: 6 lines showing agent wrapper generation.

Check a research prompt:

```bash
cat arckit-copilot/prompts/arckit-research.prompt.md
```

Expected: thin wrapper with `agent: 'arckit-research'` in frontmatter.

Check a non-agent prompt (requirements):

```bash
head -8 arckit-copilot/prompts/arckit-requirements.prompt.md
```

Expected: full prompt with `agent: 'agent'` (not a wrapper).

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(copilot): agent-backed prompts reference .agent.md files"
```

---

### Task 10: Add --ai copilot to CLI init command

**Files:**
- Modify: `src/arckit_cli/__init__.py:43-56` (AGENT_CONFIG)
- Modify: `src/arckit_cli/__init__.py:214-249` (create_project_structure)
- Modify: `src/arckit_cli/__init__.py:307-898` (init command)

**Step 1: Add copilot to CLI AGENT_CONFIG**

In `src/arckit_cli/__init__.py`, add a `"copilot"` entry to the CLI's `AGENT_CONFIG` (around line 56):

```python
AGENT_CONFIG = {
    "codex": {
        "name": "OpenAI Codex CLI",
        "folder": ".codex/",
        "install_url": "https://developers.openai.com/codex/cli/",
        "requires_cli": True,
    },
    "opencode": {
        "name": "OpenCode CLI",
        "folder": ".opencode/",
        "install_url": "https://opencode.net/cli/",
        "requires_cli": True,
    },
    "copilot": {
        "name": "GitHub Copilot",
        "folder": ".github/",
        "install_url": "https://github.com/features/copilot",
        "requires_cli": False,
    },
}
```

**Step 2: Add copilot data paths to get_data_paths()**

In `get_data_paths()` (around line 141), add paths for copilot data:

```python
            "copilot_prompts": base_path / "arckit-copilot" / "prompts",
            "copilot_agents": base_path / "arckit-copilot" / "agents",
            "copilot_instructions": base_path / "arckit-copilot" / "copilot-instructions.md",
```

**Step 3: Update create_project_structure() for copilot directories**

In `create_project_structure()`, add the copilot case to the directory creation (around line 242):

```python
        elif ai_assistant == "copilot":
            directories.append(f"{agent_folder}prompts")
            directories.append(f"{agent_folder}agents")
```

**Step 4: Add copilot to the interactive AI selection menu**

In the `init` command (around line 398-411), add copilot as option 3:

```python
        console.print("\n[cyan]Select your AI assistant:[/cyan]")
        console.print("1. codex (OpenAI Codex CLI)")
        console.print("2. opencode (OpenCode CLI)")
        console.print("3. copilot (GitHub Copilot in VS Code)")
        console.print()
        console.print("[dim]For Claude Code, use the ArcKit plugin instead:[/dim]")
        console.print("[dim]  /plugin marketplace add tractorjuice/arc-kit[/dim]")
        console.print("[dim]For Gemini CLI, use the ArcKit extension instead:[/dim]")
        console.print(
            "[dim]  gemini extensions install https://github.com/tractorjuice/arckit-gemini[/dim]"
        )

        choice = typer.prompt("Enter choice", default="1")
        ai_map = {"1": "codex", "2": "opencode", "3": "copilot"}
        ai_assistant = ai_map.get(choice, "codex")
```

**Step 5: Add copilot file copy logic**

After the OpenCode section (around line 577), add the Copilot section:

```python
    # Copy Copilot prompt files and agents
    if ai_assistant == "copilot":
        console.print("[cyan]Setting up Copilot environment...[/cyan]")

        # Copy prompt files to .github/prompts/
        copilot_prompts_src = data_paths.get("copilot_prompts")
        if copilot_prompts_src and copilot_prompts_src.exists():
            prompts_dst = project_path / ".github" / "prompts"
            prompts_dst.mkdir(parents=True, exist_ok=True)
            prompt_count = 0
            for prompt_file in copilot_prompts_src.glob("*.prompt.md"):
                shutil.copy2(prompt_file, prompts_dst / prompt_file.name)
                prompt_count += 1
            console.print(f"[green]✓[/green] Copied {prompt_count} prompt files to .github/prompts/")
        else:
            console.print(
                f"[yellow]Warning: Copilot prompts not found at {copilot_prompts_src}[/yellow]"
            )

        # Copy agent files to .github/agents/
        copilot_agents_src = data_paths.get("copilot_agents")
        if copilot_agents_src and copilot_agents_src.exists():
            agents_dst = project_path / ".github" / "agents"
            agents_dst.mkdir(parents=True, exist_ok=True)
            agent_count = 0
            for agent_file in copilot_agents_src.glob("*.agent.md"):
                shutil.copy2(agent_file, agents_dst / agent_file.name)
                agent_count += 1
            console.print(f"[green]✓[/green] Copied {agent_count} agent files to .github/agents/")

        # Copy copilot-instructions.md
        copilot_instructions_src = data_paths.get("copilot_instructions")
        if copilot_instructions_src and copilot_instructions_src.exists():
            instructions_dst = project_path / ".github" / "copilot-instructions.md"
            shutil.copy2(copilot_instructions_src, instructions_dst)
            console.print(f"[green]✓[/green] Copied copilot-instructions.md")

        console.print("[green]✓[/green] Copilot environment configured")
```

**Step 6: Update the command prefix and next steps for copilot**

In the command prefix section (around line 628):

```python
    if ai_assistant == "codex":
        p = "$arckit-"
    elif ai_assistant == "copilot":
        p = "/arckit-"
    else:
        p = "/arckit."
```

In the next steps section (around line 871), add copilot:

```python
    elif ai_assistant == "copilot":
        next_steps.append("2. Open in VS Code: [cyan]code .[/cyan]")
        next_steps.append("3. Open Copilot Chat and type: [cyan]/arckit-principles[/cyan]")
        next_steps.append(
            "4. Create your first project: [cyan]/arckit-requirements[/cyan]"
        )
```

**Step 7: Update the --ai option help text**

In the `init` function signature (around line 313):

```python
    ai_assistant: str = typer.Option(None, "--ai", help="AI assistant to use: codex, opencode, copilot"),
```

**Step 8: Test the init command**

```bash
cd /tmp && arckit init test-copilot --ai copilot --no-git && ls -la test-copilot/.github/prompts/ | head -10 && ls test-copilot/.github/agents/ && cat test-copilot/.github/copilot-instructions.md | head -5 && rm -rf test-copilot
```

**Step 9: Commit**

```bash
git add src/arckit_cli/__init__.py
git commit -m "feat(copilot): add --ai copilot to arckit init"
```

---

### Task 11: Update pyproject.toml shared-data

**Files:**
- Modify: `pyproject.toml:53-62` (shared-data section)

**Step 1: Add arckit-copilot to shared-data**

Add this line to `[tool.hatch.build.targets.wheel.shared-data]`:

```toml
"arckit-copilot" = "share/arckit/arckit-copilot"
```

**Step 2: Verify syntax**

```bash
python -c "import tomllib; tomllib.load(open('pyproject.toml', 'rb'))" && echo "OK"
```

**Step 3: Commit**

```bash
git add pyproject.toml
git commit -m "feat(copilot): add arckit-copilot to pyproject shared-data"
```

---

### Task 12: Update bump-version.sh

**Files:**
- Modify: `scripts/bump-version.sh:102-105` (add new version file entry)

**Step 1: Add arckit-copilot/VERSION**

After the `arckit-codex/VERSION` section (line 105), add:

```bash
# ── 13. arckit-copilot/VERSION ─────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-copilot/VERSION
update_file "arckit-copilot/VERSION" "overwrite"
```

**Step 2: Update the verification section**

In the verification section (line 117), add `arckit-copilot/VERSION` to the grep:

```bash
grep -H "$NEW_VERSION" VERSION arckit-claude/VERSION arckit-gemini/VERSION arckit-opencode/VERSION arckit-codex/VERSION arckit-copilot/VERSION
```

**Step 3: Verify syntax**

```bash
bash -n scripts/bump-version.sh && echo "OK"
```

**Step 4: Commit**

```bash
git add scripts/bump-version.sh
git commit -m "feat(copilot): add arckit-copilot/VERSION to bump-version.sh"
```

---

### Task 13: Run full converter and verify all outputs

**Files:** None (verification only)

**Step 1: Run the converter end-to-end**

```bash
python scripts/converter.py
```

Expected output should include:
- "Copying to Copilot extension (arckit-copilot)..."
- 60 Copilot prompt file conversions
- 6 Copilot agent wrapper lines ("agent wrapper")
- "Generating Copilot custom agents..." with 6 files
- "Generating Copilot instructions..."
- Summary showing 5 format counts including Copilot

**Step 2: Verify prompt file content**

```bash
# Check a standard command
cat arckit-copilot/prompts/arckit-requirements.prompt.md | head -8
# Expected: description, agent: 'agent', tools array

# Check an agent-backed command
cat arckit-copilot/prompts/arckit-research.prompt.md
# Expected: thin wrapper with agent: 'arckit-research'

# Check argument substitution
grep "input:topic" arckit-copilot/prompts/arckit-requirements.prompt.md
# Expected: ${input:topic:Enter project name or topic}

# Check handoffs format
grep "/arckit-" arckit-copilot/prompts/arckit-requirements.prompt.md
# Expected: /arckit-data-model, /arckit-research, etc.
```

**Step 3: Verify agent file content**

```bash
cat arckit-copilot/agents/arckit-research.agent.md | head -10
# Expected: name, description, tools, user-invocable: false
```

**Step 4: Verify extension directory is complete**

```bash
ls arckit-copilot/
# Expected: VERSION, prompts/, agents/, copilot-instructions.md, templates/, scripts/, guides/, references/
```

**Step 5: Verify existing formats are unbroken**

```bash
# Codex skills
head -5 arckit-codex/skills/arckit-requirements/SKILL.md
# Gemini TOML
head -3 arckit-gemini/commands/arckit/requirements.toml
# OpenCode markdown
head -5 arckit-opencode/commands/arckit.requirements.md
```

**Step 6: Verify CLI init**

```bash
cd /tmp && arckit init copilot-test --ai copilot --no-git
ls copilot-test/.github/prompts/ | wc -l   # Expected: 60
ls copilot-test/.github/agents/ | wc -l    # Expected: 6
cat copilot-test/.github/copilot-instructions.md | head -3
rm -rf copilot-test
```

**Step 7: Commit all generated files**

```bash
git add arckit-copilot/
git commit -m "feat(copilot): add generated copilot extension files"
```

---

### Task 14: Run markdown lint and fix any issues

**Files:** Generated `.prompt.md` and `.agent.md` files

**Step 1: Lint the generated files**

```bash
npx markdownlint-cli2 "arckit-copilot/**/*.md" 2>&1 | head -30
```

**Step 2: Fix any issues**

If there are lint errors in the generated files, fix the generator functions in `scripts/converter.py` (not the generated files themselves, since they'll be overwritten).

Common issues to watch for:
- Missing blank lines before/after headings
- Trailing whitespace
- Multiple consecutive blank lines

**Step 3: Re-run converter if generator was fixed**

```bash
python scripts/converter.py
npx markdownlint-cli2 "arckit-copilot/**/*.md" 2>&1 | head -10
```

**Step 4: Commit fixes if any**

```bash
git add scripts/converter.py arckit-copilot/
git commit -m "fix(copilot): resolve markdown lint issues in generated files"
```
