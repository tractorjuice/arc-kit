# Codex Skills Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 57 Codex commands from deprecated `.codex/prompts/` files to `.agents/skills/` directories, eliminating the `CODEX_HOME` requirement and reducing installation to 3 steps.

**Architecture:** Add a `"skill"` format to the converter that creates `arckit-{name}/SKILL.md` + `agents/openai.yaml` per command. Update the CLI to copy skills instead of prompts and remove all `CODEX_HOME`/`.envrc` references.

**Tech Stack:** Python (converter + CLI), YAML frontmatter, Codex Open Agent Skills spec

---

### Task 1: Add `"skill"` format to `format_output()` in converter

**Files:**
- Modify: `scripts/converter.py:158-167`

**Step 1: Write the skill format handler**

In `format_output()`, add a `"skill"` format branch that returns a tuple of `(skill_md, openai_yaml)`:

```python
def format_output(description, prompt, fmt):
    """Format into target format: 'markdown', 'toml', or 'skill'."""
    if fmt == "skill":
        # Return tuple: (SKILL.md content, agents/openai.yaml content)
        skill_md = f'---\nname: "placeholder"\ndescription: "{description}"\n---\n\n{prompt}\n'
        openai_yaml = "policy:\n  allow_implicit_invocation: false\n"
        return (skill_md, openai_yaml)
    elif fmt == "toml":
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')
        prompt_formatted = '"""\n' + prompt_escaped + '\n"""'
        description_formatted = '"""\n' + description + '\n"""'
        return f"description = {description_formatted}\nprompt = {prompt_formatted}\n"
    else:
        escaped = description.replace("\\", "\\\\").replace('"', '\\"')
        return f'---\ndescription: "{escaped}"\n---\n\n{prompt}\n'
```

Note: The `name` field in SKILL.md gets the real skill name in `convert()` — this is just the formatting layer.

**Step 2: Run converter to verify no errors**

Run: `python scripts/converter.py`
Expected: Completes without errors (skill format not used by any AGENT_CONFIG yet)

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat(converter): add skill format to format_output"
```

---

### Task 2: Add `codex_skills` AGENT_CONFIG entry and update `convert()` to handle skill format

**Files:**
- Modify: `scripts/converter.py:96-135` (AGENT_CONFIG)
- Modify: `scripts/converter.py:170-223` (convert function)

**Step 1: Add the `codex_skills` config entry**

Add after the `codex_extension` entry in AGENT_CONFIG:

```python
"codex_skills": {
    "name": "Codex Skills",
    "output_dir": "arckit-codex/skills",
    "filename_pattern": "arckit-{name}",  # directory name, not file
    "format": "skill",
    "path_prefix": ".arckit",
    "extension_dir": "arckit-codex",
},
```

**Step 2: Update `convert()` to handle skill format**

In the inner loop of `convert()`, after `content = format_output(...)`, add a branch for skill format:

```python
for agent_id, config in AGENT_CONFIG.items():
    rewritten = rewrite_paths(prompt, config)

    if config["format"] == "skill":
        # Skill format: create directory with SKILL.md + agents/openai.yaml
        skill_name = f"arckit-{base_name}"
        skill_dir = os.path.join(config["output_dir"], skill_name)
        os.makedirs(skill_dir, exist_ok=True)
        os.makedirs(os.path.join(skill_dir, "agents"), exist_ok=True)

        # Build SKILL.md with proper name
        escaped_desc = description.replace('"', '\\"')
        skill_md = f'---\nname: {skill_name}\ndescription: "{escaped_desc}"\n---\n\n{rewritten}\n'
        openai_yaml = "policy:\n  allow_implicit_invocation: false\n"

        with open(os.path.join(skill_dir, "SKILL.md"), "w") as f:
            f.write(skill_md)
        with open(os.path.join(skill_dir, "agents", "openai.yaml"), "w") as f:
            f.write(openai_yaml)

        print(f"  {config['name'] + ':':14s}{source_label} -> {skill_dir}/")
        counts[agent_id] += 1
    else:
        content = format_output(description, rewritten, config["format"])
        out_filename = config["filename_pattern"].format(name=base_name)
        out_path = os.path.join(config["output_dir"], out_filename)
        with open(out_path, "w") as f:
            f.write(content)
        print(f"  {config['name'] + ':':14s}{source_label} -> {out_path}")
        counts[agent_id] += 1
```

**Step 3: Run converter and verify 57 skill directories are created**

Run: `python scripts/converter.py`
Expected: See 57 "Codex Skills" lines in output

Run: `ls arckit-codex/skills/arckit-* | wc -l`
Expected: 57

Run: `cat arckit-codex/skills/arckit-requirements/SKILL.md | head -5`
Expected: Frontmatter with `name: arckit-requirements` and description

Run: `cat arckit-codex/skills/arckit-requirements/agents/openai.yaml`
Expected: `policy:\n  allow_implicit_invocation: false`

**Step 4: Commit**

```bash
git add scripts/converter.py arckit-codex/skills/
git commit -m "feat(converter): generate 57 command skills in arckit-codex/skills"
```

---

### Task 3: Update CLI `build_paths()` and `create_project_structure()` for skills-only Codex

**Files:**
- Modify: `src/arckit_cli/__init__.py:144-163` (build_paths)
- Modify: `src/arckit_cli/__init__.py:215-308` (create_project_structure)

**Step 1: Verify `build_paths()` already has `codex_skills` entry**

`build_paths()` at line 160 already has `"codex_skills": base_path / "arckit-codex" / "skills"`. No change needed here.

**Step 2: Update Codex init section to copy skill directories instead of prompts**

In the Codex section of `init()` (around line 492-539), replace the prompts copy block with skills-only logic. Remove the `.codex/prompts/` copy since skills replace them. Keep the agents and config.toml copies.

Replace the block at lines 492-539 that starts with `if ai_assistant == "codex" or all_ai:`:

```python
    if ai_assistant == "codex" or all_ai:
        # Copy Codex skills to .agents/skills/ (replaces deprecated .codex/prompts/)
        codex_skills_src = data_paths.get("codex_skills")
        if codex_skills_src and codex_skills_src.exists():
            skills_dst = project_path / ".agents" / "skills"
            skills_dst.mkdir(parents=True, exist_ok=True)
            shutil.copytree(codex_skills_src, skills_dst, dirs_exist_ok=True)
            skill_count = sum(
                1 for d in skills_dst.iterdir()
                if d.is_dir() and not d.name.startswith(".")
            )
            console.print(f"[green]✓[/green] Copied {skill_count} skills to .agents/skills/")
        else:
            console.print(
                f"[yellow]Warning: Codex skills not found at {codex_skills_src}[/yellow]"
            )

        # Copy Codex agent configs
        codex_agents_src = data_paths.get("codex_agents")
        if codex_agents_src and codex_agents_src.exists():
            agents_dst = project_path / ".codex" / "agents"
            agents_dst.mkdir(parents=True, exist_ok=True)
            agent_count = 0
            for agent_file in sorted(codex_agents_src.iterdir()):
                if agent_file.suffix in (".toml", ".md"):
                    shutil.copy2(agent_file, agents_dst / agent_file.name)
                    agent_count += 1
            console.print(f"[green]✓[/green] Copied {agent_count} agent configs to .codex/agents/")

        # Copy Codex config.toml (MCP servers + agent roles)
        codex_config_src = data_paths.get("codex_config")
        if codex_config_src and codex_config_src.exists():
            config_dst = project_path / ".codex" / "config.toml"
            shutil.copy2(codex_config_src, config_dst)
            console.print(f"[green]✓[/green] Copied config.toml (MCP servers + agent roles)")
```

**Step 3: Remove `.codex/prompts` from directory creation**

In `create_project_structure()` around line 250, the codex branch creates `.codex/prompts`. Change it to only create `.agents/skills` and `.codex/agents`:

```python
        else:
            if ai_assistant == "codex":
                directories.append(".agents/skills")
                directories.append(f"{agent_folder}agents")
            else:
                directories.append(f"{agent_folder}commands")
```

Remove `directories.append(f"{agent_folder}prompts")` for codex.

**Step 4: Test**

Run: `cd /tmp && arckit init test-skills --ai codex --no-git`
Expected: No `.codex/prompts/` created. `.agents/skills/arckit-requirements/SKILL.md` exists. `.codex/agents/` and `.codex/config.toml` exist.

Run: `ls /tmp/test-skills/.agents/skills/arckit-* | wc -l`
Expected: 57+ (57 commands + 4 reference skills)

Run: `ls /tmp/test-skills/.codex/prompts/ 2>/dev/null`
Expected: No such directory

**Step 5: Commit**

```bash
git add src/arckit_cli/__init__.py
git commit -m "feat(cli): copy skills instead of prompts for codex init"
```

---

### Task 4: Remove `.envrc` generation and `CODEX_HOME` references from CLI

**Files:**
- Modify: `src/arckit_cli/__init__.py:747-798` (Codex environment section)
- Modify: `src/arckit_cli/__init__.py:901-932` (Next Steps section)

**Step 1: Remove `.envrc` creation for Codex**

Delete the entire block at lines 747-798 that creates `.envrc` and sets up `CODEX_HOME`. Replace with a simpler block that only handles `.gitignore`:

```python
    # Create .gitignore for Codex projects
    if ai_assistant == "codex":
        gitignore_path = project_path / ".gitignore"
        codex_ignore_entries = [
            "# Codex CLI",
            ".codex/*",
            "!.codex/agents/",
            "!.codex/config.toml",
        ]

        if gitignore_path.exists():
            existing_content = gitignore_path.read_text(encoding='utf-8')
            if ".codex" not in existing_content:
                with open(gitignore_path, 'a', encoding='utf-8') as f:
                    f.write("\n" + "\n".join(codex_ignore_entries) + "\n")
        else:
            gitignore_path.write_text("\n".join(codex_ignore_entries) + "\n", encoding='utf-8')

        console.print("[green]✓[/green] Codex environment configured")
```

**Step 2: Update "Next Steps" for Codex**

Replace the Codex next_steps block (lines 906-914) with simpler instructions that have no CODEX_HOME:

```python
    if ai_assistant == "codex":
        next_steps.append(f"2. Start Codex: [cyan]codex[/cyan]")
        next_steps.append(
            "3. Run a skill: [cyan]$arckit-principles[/cyan]"
        )
```

Also update the final next_steps items (lines 927-931) to use skill invocation syntax for codex:

```python
    if ai_assistant == "codex":
        next_steps.append(
            "4. Create your first project: [cyan]$arckit-requirements[/cyan]"
        )
    else:
        next_steps.append(
            "4. Establish architecture principles: [cyan]/arckit.principles[/cyan]"
        )
        next_steps.append("5. Create your first project: [cyan]/arckit.requirements[/cyan]")
```

**Step 3: Test**

Run: `cd /tmp && rm -rf test-skills && arckit init test-skills --ai codex --no-git`
Expected: No `.envrc` created. No mention of `CODEX_HOME` or `direnv` in output. Next Steps show `$arckit-principles` syntax.

Run: `test -f /tmp/test-skills/.envrc && echo "FAIL: .envrc exists" || echo "PASS: no .envrc"`
Expected: PASS

**Step 4: Commit**

```bash
git add src/arckit_cli/__init__.py
git commit -m "feat(cli): remove CODEX_HOME/.envrc, use skill invocation syntax"
```

---

### Task 5: Update README template in CLI for skills

**Files:**
- Modify: `src/arckit_cli/__init__.py:629-737` (README content)

**Step 1: Update README content for Codex users**

The README template references `/arckit.requirements` etc. For Codex users, commands are now `$arckit-requirements`. Update the README template to detect if Codex and show skill syntax:

Add a conditional block before the README content generation:

```python
    # Determine command prefix based on AI assistant
    if ai_assistant == "codex":
        cmd_prefix = "$arckit-"
        cmd_sep = "-"
    else:
        cmd_prefix = "/arckit."
        cmd_sep = "."
```

Then replace all `/arckit.` references in the README content with `{cmd_prefix}` and `.` separators with `{cmd_sep}`. The key lines like:
- `- \`/arckit.plan\`` becomes `- \`{cmd_prefix}plan\``
- `- \`/arckit.requirements\`` becomes `- \`{cmd_prefix}requirements\``

Also update the "Next Steps" section at the bottom of README to use skill syntax for Codex.

**Step 2: Test**

Run: `cd /tmp && rm -rf test-skills && arckit init test-skills --ai codex --no-git`
Run: `grep '$arckit-' /tmp/test-skills/README.md | head -5`
Expected: Lines with `$arckit-requirements`, `$arckit-principles` etc.

**Step 3: Commit**

```bash
git add src/arckit_cli/__init__.py
git commit -m "feat(cli): use skill invocation syntax in generated README for codex"
```

---

### Task 6: Update `pyproject.toml` shared-data for skills

**Files:**
- Modify: `pyproject.toml`

**Step 1: Verify shared-data already includes arckit-codex**

Check that `"arckit-codex" = "share/arckit/arckit-codex"` is already in `[tool.hatch.build.targets.wheel.shared-data]`. This was added in the previous implementation. No change should be needed unless the skills are in a new location.

Run: `grep "arckit-codex" pyproject.toml`
Expected: See the shared-data entry

**Step 2: Commit (only if changes needed)**

```bash
git add pyproject.toml
git commit -m "chore: update pyproject.toml shared-data for skills"
```

---

### Task 7: Update `arckit-codex/README.md` for skills installation

**Files:**
- Modify: `arckit-codex/README.md`

**Step 1: Update README to reflect skills-based installation**

Update the installation instructions to show the 3-step install (no CODEX_HOME) and document `$arckit-*` invocation. Remove references to `.codex/prompts/` and `CODEX_HOME`.

Key sections to update:
- Installation: 3 steps (pip install, arckit init, cd && codex)
- Usage: Show `$arckit-requirements` instead of `/prompts:arckit.requirements`
- Directory structure: Show `.agents/skills/` instead of `.codex/prompts/`

**Step 2: Commit**

```bash
git add arckit-codex/README.md
git commit -m "docs(codex): update README for skills-based installation"
```

---

### Task 8: Run converter and verify end-to-end

**Files:**
- All generated files in `arckit-codex/skills/arckit-*/`

**Step 1: Run converter**

Run: `python scripts/converter.py`
Expected: All formats generated without errors, including 57 skill directories

**Step 2: Verify skill structure**

Run: `find arckit-codex/skills/arckit-* -name "SKILL.md" | wc -l`
Expected: 57

Run: `find arckit-codex/skills/arckit-* -name "openai.yaml" | wc -l`
Expected: 57

Run: `cat arckit-codex/skills/arckit-requirements/SKILL.md | head -5`
Expected: Valid YAML frontmatter with name and description

Run: `cat arckit-codex/skills/arckit-requirements/agents/openai.yaml`
Expected: `policy:\n  allow_implicit_invocation: false`

**Step 3: Verify CLI end-to-end**

Run: `cd /tmp && rm -rf test-skills && arckit init test-skills --ai codex --no-git`

Verify:
- `ls /tmp/test-skills/.agents/skills/arckit-requirements/SKILL.md` exists
- `ls /tmp/test-skills/.agents/skills/arckit-requirements/agents/openai.yaml` exists
- `ls /tmp/test-skills/.codex/prompts/ 2>/dev/null` does not exist
- `test -f /tmp/test-skills/.envrc` is false
- `grep 'CODEX_HOME' /tmp/test-skills/README.md` returns nothing
- `grep '$arckit-' /tmp/test-skills/README.md` returns matches

**Step 4: Commit all generated files**

```bash
git add arckit-codex/skills/
git commit -m "chore: regenerate all converter output with skills format"
```

---

### Task 9: Update CLAUDE.md and memory

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md**

Update the following sections:
- **Multi-AI Command Formats table**: Add Codex Skills row showing `$arckit-requirements` invocation
- **Project Structure Created by `arckit init`**: Show `.agents/skills/` instead of `.codex/prompts/` for Codex
- **Init flags**: Note that `--ai codex` now uses skills (auto-discovered, no CODEX_HOME needed)
- **Converter description**: Mention skill format output

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for skills-based Codex installation"
```

---

### Task 10: Push arckit-codex to standalone repo

**Step 1: Push updated arckit-codex to tractorjuice/arckit-codex**

```bash
cd arckit-codex
git add -A
git commit -m "feat: migrate 57 commands from prompts to skills format"
git push origin main
cd ..
```

**Step 2: Verify**

Check that the repo at `tractorjuice/arckit-codex` has the updated `skills/arckit-*/` directories and updated README.

---

## Summary

| Task | Description | Key Change |
|------|-------------|------------|
| 1 | Add `"skill"` format to `format_output()` | New format type returns SKILL.md + openai.yaml |
| 2 | Add `codex_skills` AGENT_CONFIG + update `convert()` | Generates 57 skill directories |
| 3 | Update CLI to copy skills instead of prompts | `.agents/skills/` replaces `.codex/prompts/` |
| 4 | Remove `.envrc`/`CODEX_HOME` from CLI | 3-step install, zero config |
| 5 | Update README template for skill syntax | `$arckit-requirements` instead of `/arckit.requirements` |
| 6 | Verify pyproject.toml shared-data | Ensure `arckit-codex` is included |
| 7 | Update arckit-codex/README.md | Document 3-step install |
| 8 | Run converter + end-to-end verification | Verify 57 skills + CLI integration |
| 9 | Update CLAUDE.md | Document new format |
| 10 | Push to standalone repo | Update tractorjuice/arckit-codex |
