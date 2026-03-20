import os
import re
import json
import shutil

import yaml


def build_agent_map(agents_dir):
    """Build a map from command name to agent file path and content.

    Agent files are named arckit-{name}.md. The corresponding plugin command
    is {name}.md. Returns {command_filename: (agent_path, agent_prompt)}.
    """
    agent_map = {}
    if not os.path.isdir(agents_dir):
        return agent_map
    for filename in os.listdir(agents_dir):
        if filename.startswith("arckit-") and filename.endswith(".md"):
            # arckit-research.md -> research.md
            name = filename.replace("arckit-", "", 1).replace(".md", "")
            command_filename = f"{name}.md"
            agent_path = os.path.join(agents_dir, filename)
            with open(agent_path, "r", encoding="utf-8") as f:
                agent_content = f.read()
            agent_prompt = extract_agent_prompt(agent_content)
            agent_map[command_filename] = (agent_path, agent_prompt)
    return agent_map


def extract_frontmatter_and_prompt(content):
    """Extract YAML frontmatter dict and prompt body from markdown."""
    frontmatter = {}
    prompt = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 2:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                frontmatter = {}
            prompt = parts[2].strip()
    return frontmatter, prompt


def extract_agent_prompt(content):
    """Extract prompt body from agent file, stripping agent-specific frontmatter."""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 2:
            return parts[2].strip()
    return content


def copy_agent_stripped(src_path, dest_path):
    """Copy an agent file to dest, stripping the effort field from frontmatter."""
    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 2:
            try:
                fm = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                fm = {}
            fm.pop("effort", None)
            rebuilt = "---\n" + yaml.dump(fm, default_flow_style=False, allow_unicode=True) + "---" + parts[2]
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(rebuilt)
            return
    # No frontmatter — plain copy
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content)


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


EXTENSION_FILE_ACCESS_BLOCK = """\
**IMPORTANT — Gemini Extension File Access**:
This command runs as a Gemini CLI extension. The extension directory \
(`~/.gemini/extensions/arckit/`) is outside the workspace sandbox, so you \
CANNOT use the read_file tool to access it. Instead:

- To read templates/files: use a shell command, e.g. `cat ~/.gemini/extensions/arckit/templates/foo-template.md`
- To list files: use `ls ~/.gemini/extensions/arckit/templates/`
- To run scripts: use `python3 ~/.gemini/extensions/arckit/scripts/python/create-project.py --json`
- To check file existence: use `test -f ~/.gemini/extensions/arckit/templates/foo-template.md && echo exists`
All extension file access MUST go through shell commands.

"""

CONTEXT_HOOK_NOTE = (
    "> **Note**: The ArcKit Project Context hook has already detected all "
    "projects, artifacts, external documents, and global policies. Use that "
    "context below \u2014 no need to scan directories manually."
)

CONTEXT_HOOK_REPLACEMENT = (
    "> **Note**: Before generating, scan `projects/` for existing project "
    "directories. For each project, list all `ARC-*.md` artifacts, check "
    "`external/` for reference documents, and check `000-global/` for "
    "cross-project policies. If no external docs exist but they would "
    "improve output, ask the user."
)


# --- Agent configuration: adding a new AI target = adding a dictionary entry ---

AGENT_CONFIG = {
    "codex_extension": {
        "name": "Codex Extension",
        "output_dir": "arckit-codex/prompts",
        "filename_pattern": "arckit.{name}.md",
        "format": "markdown",
        "path_prefix": ".arckit",
        "extension_dir": "arckit-codex",
        "copy_commands_to_extension": True,
        "copy_agents_to_extension": True,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
    "codex_skills": {
        "name": "Codex Skills",
        "output_dir": "arckit-codex/skills",
        "format": "skill",
        "path_prefix": ".arckit",
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
    "opencode": {
        "name": "OpenCode CLI",
        "output_dir": "arckit-opencode/commands",
        "filename_pattern": "arckit.{name}.md",
        "format": "markdown",
        "path_prefix": ".arckit",
        "extension_dir": "arckit-opencode",
        "copy_agents_to_extension": True,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
    "gemini": {
        "name": "Gemini CLI",
        "output_dir": "arckit-gemini/commands/arckit",
        "filename_pattern": "{name}.toml",
        "format": "toml",
        "path_prefix": "~/.gemini/extensions/arckit",
        "arg_placeholder": "{{args}}",
        "extension_dir": "arckit-gemini",
        "prepend_block": EXTENSION_FILE_ACCESS_BLOCK,
        "rewrite_read_instructions": True,
        "has_context_hook": True,
        "has_sync_guides_hook": False,
    },
    "copilot": {
        "name": "Copilot",
        "output_dir": "arckit-copilot/prompts",
        "filename_pattern": "arckit-{name}.prompt.md",
        "format": "prompt",
        "path_prefix": ".arckit",
        "arg_placeholder": "${input:topic:Enter project name or topic}",
        "extension_dir": "arckit-copilot",
        "copy_commands_to_extension": False,
        "copy_agents_to_extension": False,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
}


def rewrite_paths(prompt, config):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} paths using agent config."""
    result = prompt.replace("${CLAUDE_PLUGIN_ROOT}", config["path_prefix"])

    if config.get("rewrite_read_instructions"):
        result = re.sub(
            r"Read `(" + re.escape(config["path_prefix"]) + r"/[^`]+)`",
            r"Run `cat \1` to read the file",
            result,
        )

    if config.get("prepend_block"):
        result = config["prepend_block"] + result

    if config.get("arg_placeholder"):
        result = result.replace("$ARGUMENTS", config["arg_placeholder"])

    return result


def rewrite_hook_dependencies(prompt, config):
    """Replace hook-dependent content for platforms without hooks."""
    result = prompt

    # Context injection: replace hook note with self-scan instructions
    if not config.get("has_context_hook", False):
        result = result.replace(CONTEXT_HOOK_NOTE, CONTEXT_HOOK_REPLACEMENT)

    return result


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
    if any(kw in prompt for kw in ["WebSearch", "WebFetch", "web research",
                                    "search the web", "fetch", "MCP"]):
        return _COPILOT_RESEARCH_TOOLS
    return _COPILOT_DEFAULT_TOOLS


def format_output(description, prompt, fmt):
    """Format into target format: 'markdown', 'toml', 'prompt', or 'skill'."""
    if fmt == "toml":
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')
        prompt_formatted = '"""\n' + prompt_escaped + '\n"""'
        description_formatted = '"""\n' + description + '\n"""'
        return f"description = {description_formatted}\nprompt = {prompt_formatted}\n"
    elif fmt == "prompt":
        escaped = description.replace("'", "''")
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


def convert(commands_dir, agents_dir):
    """Convert plugin commands to all configured AI agent formats.

    Reads each plugin command once, resolves agent prompts once, then
    writes output formats with appropriate path rewriting driven by AGENT_CONFIG.
    """
    for config in AGENT_CONFIG.values():
        os.makedirs(config["output_dir"], exist_ok=True)

    agent_map = build_agent_map(agents_dir)
    counts = {agent_id: 0 for agent_id in AGENT_CONFIG}

    for filename in sorted(os.listdir(commands_dir)):
        if not filename.endswith(".md"):
            continue

        command_path = os.path.join(commands_dir, filename)

        with open(command_path, "r", encoding="utf-8") as f:
            command_content = f.read()

        # Extract frontmatter from command (always use command's description)
        frontmatter, command_prompt = extract_frontmatter_and_prompt(command_content)
        description = frontmatter.get("description", "")
        handoffs = frontmatter.get("handoffs", [])
        # Strip effort field — only meaningful for Claude Code plugin
        frontmatter.pop("effort", None)

        # For agent-delegating commands, use the full agent prompt
        # (non-Claude targets don't support the Task/agent architecture)
        if filename in agent_map:
            agent_path, agent_prompt = agent_map[filename]
            prompt = agent_prompt
            # Agent prompts don't contain $ARGUMENTS — append it so the
            # user's query is injected into the generated command
            if "$ARGUMENTS" not in prompt:
                prompt += "\n\n## User Request\n\n```text\n$ARGUMENTS\n```\n"
            source_label = f"{command_path} (agent: {agent_path})"
        else:
            prompt = command_prompt
            source_label = command_path

        base_name = filename.replace(".md", "")

        # Check for standalone command override once (result is agent-independent)
        standalone_path = os.path.join(
            os.path.dirname(commands_dir.rstrip(os.sep)), "commands-standalone", filename
        )
        has_standalone = os.path.isfile(standalone_path)
        standalone_prompt = None
        if has_standalone:
            with open(standalone_path, "r", encoding="utf-8") as f:
                standalone_content = f.read()
            _, standalone_prompt = extract_frontmatter_and_prompt(standalone_content)

        for agent_id, config in AGENT_CONFIG.items():
            if has_standalone and not config.get("has_sync_guides_hook", False):
                # Use standalone version for platforms lacking required hook
                rewritten = rewrite_paths(standalone_prompt, config)
            else:
                rewritten = rewrite_paths(prompt, config)
                rewritten = rewrite_hook_dependencies(rewritten, config)

            # Determine handoff command format based on target
            if config["format"] == "prompt":
                cmd_fmt = "/arckit-{cmd}"
            elif config["format"] == "skill":
                cmd_fmt = "$arckit-{cmd}"
            else:
                cmd_fmt = "/arckit:{cmd}"

            handoffs_section = render_handoffs_section(handoffs, command_format=cmd_fmt)

            if handoffs_section:
                rewritten = rewritten.rstrip("\n") + "\n" + handoffs_section.rstrip("\n")

            # For Copilot prompt format with agent-backed commands,
            # generate a thin wrapper that references the .agent.md file
            if config["format"] == "prompt" and filename in agent_map:
                agent_name = filename.replace(".md", "")
                agent_ref = f"arckit-{agent_name}"
                escaped_desc = description.replace("'", "''")
                tools = _copilot_tools_for_prompt(rewritten)
                tools_yaml = "[" + ", ".join(f"'{t}'" for t in tools) + "]"

                content = (
                    f"---\n"
                    f"description: '{escaped_desc}'\n"
                    f"agent: '{agent_ref}'\n"
                    f"tools: {tools_yaml}\n"
                    f"---\n\n"
                    f"Use the `{agent_ref}` agent to handle this request.\n"
                )
                if handoffs_section:
                    content += "\n" + handoffs_section.strip("\n") + "\n"

                out_filename = config["filename_pattern"].format(name=base_name)
                out_path = os.path.join(config["output_dir"], out_filename)
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  {config['name'] + ':':14s}{source_label} -> {out_path} (agent wrapper)")
                counts[agent_id] += 1
                continue

            if config["format"] == "skill":
                skill_name = f"arckit-{base_name}"
                skill_dir = os.path.join(config["output_dir"], skill_name)
                os.makedirs(skill_dir, exist_ok=True)
                os.makedirs(os.path.join(skill_dir, "agents"), exist_ok=True)

                escaped_desc = description.replace('"', '\\"')
                skill_md = f'---\nname: {skill_name}\ndescription: "{escaped_desc}"\n---\n\n{rewritten}\n'
                openai_yaml = "policy:\n  allow_implicit_invocation: false\n"

                with open(os.path.join(skill_dir, "SKILL.md"), "w", encoding="utf-8") as f:
                    f.write(skill_md)
                with open(os.path.join(skill_dir, "agents", "openai.yaml"), "w", encoding="utf-8") as f:
                    f.write(openai_yaml)

                print(f"  {config['name'] + ':':14s}{source_label} -> {skill_dir}/")
                counts[agent_id] += 1
            else:
                content = format_output(description, rewritten, config["format"])
                out_filename = config["filename_pattern"].format(name=base_name)
                out_path = os.path.join(config["output_dir"], out_filename)
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  {config['name'] + ':':14s}{source_label} -> {out_path}")
                counts[agent_id] += 1

    return counts


def copy_extension_files(plugin_dir):
    """Copy supporting files from plugin to all extension directories.

    Copies templates, scripts, guides, and skills so the extensions are
    self-contained when published as separate repos.
    """
    copies = [
        ("templates", "templates"),
        ("scripts/bash", "scripts/bash"),
        ("scripts/python", "scripts/python"),
        ("docs/guides", "docs/guides"),
        ("skills", "skills"),
        ("references", "references"),
    ]

    for config in AGENT_CONFIG.values():
        ext_dir = config.get("extension_dir")
        if not ext_dir:
            continue
        print(f"Copying to {config['name']} extension ({ext_dir})...")
        for src_rel, dst_rel in copies:
            src = os.path.join(plugin_dir, src_rel)
            dst = os.path.join(ext_dir, dst_rel)
            if os.path.isdir(src):
                if os.path.isdir(dst):
                    shutil.rmtree(dst)
                shutil.copytree(src, dst)
                file_count = sum(len(files) for _, _, files in os.walk(dst))
                print(f"  Copied: {src} -> {dst} ({file_count} files)")


def generate_codex_config_toml(mcp_json_path, agents_dir, output_path):
    """Generate config.toml for Codex extension with MCP servers and agent roles."""
    lines = [
        "# ArcKit Codex Extension Configuration",
        "# Auto-generated by scripts/converter.py — do not edit directly",
        "",
    ]

    # MCP servers section
    if os.path.isfile(mcp_json_path):
        with open(mcp_json_path, "r", encoding="utf-8") as f:
            mcp_config = json.load(f)
        servers = mcp_config.get("mcpServers", {})
        if servers:
            lines.append("# ── MCP Servers ─────────────────────────────────────")
            lines.append("")
            for name, server in servers.items():
                lines.append(f"[mcp_servers.{name}]")
                for key, value in server.items():
                    if key == "headers":
                        header_parts = []
                        for hk, hv in value.items():
                            header_parts.append(f'"{hk}" = "{hv}"')
                        lines.append(f"headers = {{ {', '.join(header_parts)} }}")
                    else:
                        lines.append(f'{key} = "{value}"')
                lines.append("")

    # Agent roles section
    if os.path.isdir(agents_dir):
        agent_files = sorted(
            f for f in os.listdir(agents_dir)
            if f.startswith("arckit-") and f.endswith(".md")
        )
        if agent_files:
            lines.append("# ── Agent Roles (experimental) ──────────────────────")
            lines.append("# Requires: codex multi-agent feature flag enabled")
            lines.append("")
            lines.append("[agents]")
            lines.append("max_threads = 3")
            lines.append("max_depth = 1")
            lines.append("job_max_runtime_seconds = 600")
            lines.append("")

            for filename in agent_files:
                agent_path = os.path.join(agents_dir, filename)
                with open(agent_path, "r", encoding="utf-8") as f:
                    content = f.read()
                frontmatter, _ = extract_frontmatter_and_prompt(content)
                name = frontmatter.get("name", filename.replace(".md", ""))
                desc = frontmatter.get("description", "")
                first_line = desc.strip().split("\n")[0].strip()
                toml_name = filename.replace(".md", "")

                lines.append(f"[agents.roles.{name}]")
                escaped_desc = first_line.replace('"', '\\"')
                lines.append(f'description = "{escaped_desc}"')
                lines.append(f'config_file = "agents/{toml_name}.toml"')
                lines.append("")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Generated: {output_path}")


def generate_agent_toml_files(agents_dir, output_dir, path_prefix=".arckit"):
    """Generate per-agent .toml config files for Codex extension."""
    if not os.path.isdir(agents_dir):
        return

    os.makedirs(output_dir, exist_ok=True)
    count = 0

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()

        prompt = extract_agent_prompt(content)
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", path_prefix)
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"""', '\\"\\"\\"')

        toml_name = filename.replace(".md", ".toml")
        toml_path = os.path.join(output_dir, toml_name)

        toml_content = (
            f"# Auto-generated from arckit-claude/agents/{filename}\n"
            f"# Do not edit — edit the source and re-run scripts/converter.py\n"
            f"\n"
            f'developer_instructions = """\n'
            f"{prompt_escaped}\n"
            f'"""\n'
        )

        with open(toml_path, "w", encoding="utf-8") as f:
            f.write(toml_content)
        count += 1

    print(f"  Generated {count} agent .toml files in {output_dir}")


def rewrite_codex_skills(skills_dir):
    """Rewrite Claude Code-specific references in skills for Codex extension.

    - /arckit:X -> $arckit-X (skill invocation syntax)
    - /arckit.X -> $arckit-X
    - /prompts:arckit.X -> $arckit-X
    - Remove SessionStart hook references
    - ${CLAUDE_PLUGIN_ROOT} -> .arckit
    """
    if not os.path.isdir(skills_dir):
        return

    count = 0
    for root, dirs, files in os.walk(skills_dir):
        for filename in files:
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            original = content

            # Rewrite /arckit:X -> $arckit-X (colon-prefixed plugin format)
            content = re.sub(r"/arckit:(\w[\w.-]*)", r"$arckit-\1", content)

            # Rewrite /arckit.X -> $arckit-X (dot-prefixed format)
            # Only match when preceded by a space or start-of-line to avoid false matches
            content = re.sub(
                r"(?<=\s)/arckit\.(\w[\w.-]*)",
                r"$arckit-\1",
                content,
            )

            # Rewrite /prompts:arckit.X -> $arckit-X (old Codex prompt format)
            content = re.sub(
                r"/prompts:arckit\.(\w[\w.-]*)",
                r"$arckit-\1",
                content,
            )

            # Remove SessionStart hook reference
            content = content.replace(
                "- Use ArcKit Project Context from the SessionStart hook if available\n",
                "",
            )

            # Rewrite plugin root paths
            content = content.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")

            if content != original:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                rel_path = os.path.relpath(filepath, skills_dir)
                print(f"  Rewrote: {skills_dir}/{rel_path}")
                count += 1

    if count:
        print(f"  Rewrote {count} skill files for Codex skill invocation format")


def generate_gemini_agents(agents_dir, output_dir):
    """Generate Gemini CLI sub-agent markdown files from Claude Code agents.

    Reads each arckit-{name}.md from agents_dir, converts the YAML frontmatter
    (keeping name/description, dropping model, adding max_turns/timeout_mins),
    rewrites paths and Read instructions for Gemini, prepends the extension
    file access block, and writes to output_dir.
    """
    if not os.path.isdir(agents_dir):
        print(f"  Skipped: {agents_dir} not found")
        return

    os.makedirs(output_dir, exist_ok=True)
    gemini_path_prefix = "~/.gemini/extensions/arckit"
    count = 0

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)

        # Build Gemini frontmatter: keep name/description, drop model,
        # add Gemini-specific fields
        gemini_fm = {}
        if "name" in frontmatter:
            gemini_fm["name"] = frontmatter["name"]
        if "description" in frontmatter:
            gemini_fm["description"] = frontmatter["description"]
        gemini_fm["max_turns"] = 25
        gemini_fm["timeout_mins"] = 10

        # Rewrite paths: ${CLAUDE_PLUGIN_ROOT} -> ~/.gemini/extensions/arckit
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", gemini_path_prefix)

        # Rewrite Read instructions to shell commands
        prompt = re.sub(
            r"Read `(" + re.escape(gemini_path_prefix) + r"/[^`]+)`",
            r"Run `cat \1` to read the file",
            prompt,
        )

        # Prepend extension file access block
        prompt = EXTENSION_FILE_ACCESS_BLOCK + prompt

        # Serialize frontmatter with yaml for correct multi-line handling
        fm_str = yaml.dump(gemini_fm, default_flow_style=False, sort_keys=False).rstrip()
        output_content = f"---\n{fm_str}\n---\n\n{prompt}\n"

        out_path = os.path.join(output_dir, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(output_content)
        print(f"  {filename}")
        count += 1

    print(f"  Generated {count} Gemini sub-agent files in {output_dir}")


def generate_gemini_hooks(output_dir):
    """Generate hooks.json for Gemini CLI extension.

    Creates arckit-gemini/hooks/hooks.json which tells Gemini CLI
    which hook scripts to run for each lifecycle event.
    """
    hooks_dir = os.path.join(output_dir, "hooks")
    os.makedirs(hooks_dir, exist_ok=True)

    hooks_config = {
        "hooks": {
            "SessionStart": [
                {
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/session-start.py",
                            "name": "ArcKit Session Init",
                            "timeout": 5000,
                            "description": "Inject ArcKit version and project context",
                        }
                    ]
                }
            ],
            "BeforeAgent": [
                {
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/context-inject.py",
                            "name": "ArcKit Context",
                            "timeout": 10000,
                            "description": "Inject project context before agent planning",
                        }
                    ]
                }
            ],
            "BeforeTool": [
                {
                    "matcher": "write_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/validate-filename.py",
                            "name": "ARC Filename Validator",
                            "timeout": 5000,
                            "description": "Validate ARC-xxx filename convention",
                        }
                    ],
                },
                {
                    "matcher": "write_file|edit_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/file-protection.py",
                            "name": "File Protection",
                            "timeout": 5000,
                            "description": "Protect ArcKit system files from modification",
                        }
                    ],
                },
            ],
            "AfterTool": [
                {
                    "matcher": "write_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/update-manifest.py",
                            "name": "Manifest Updater",
                            "timeout": 5000,
                            "description": "Update manifest.json after writing project files",
                        }
                    ]
                }
            ],
        }
    }

    hooks_path = os.path.join(hooks_dir, "hooks.json")
    with open(hooks_path, "w", encoding="utf-8") as f:
        json.dump(hooks_config, f, indent=2)
        f.write("\n")

    print(f"  Generated: {hooks_path}")


def generate_gemini_policies(output_dir):
    """Generate policies/rules.toml for Gemini CLI extension."""
    policies_dir = os.path.join(output_dir, "policies")
    os.makedirs(policies_dir, exist_ok=True)

    rules = '''\
# ArcKit Gemini Extension Policies
# Auto-generated by scripts/converter.py

# Protect ArcKit extension files from modification
[[rules]]
description = "Prevent modification of ArcKit extension system files"
when = "tool_name in ['write_file', 'edit_file'] and '~/.gemini/extensions/arckit/' in tool_input.get('path', '')"
decision = "deny"
reason = "Cannot modify ArcKit extension files. These are managed by the extension."

# Warn on potential secret patterns in file content
[[rules]]
description = "Warn when writing files containing potential secrets"
when = "tool_name == 'write_file' and any(p in tool_input.get('content', '') for p in ['PRIVATE KEY', 'password=', 'secret=', 'api_key='])"
decision = "ask"
reason = "File content may contain secrets. Please confirm this is intentional."
'''

    rules_path = os.path.join(policies_dir, "rules.toml")
    with open(rules_path, "w", encoding="utf-8") as f:
        f.write(rules)
    print(f"  Generated: {rules_path}")


def generate_copilot_agents(agents_dir, output_dir):
    """Generate Copilot custom agent .agent.md files from Claude Code agents."""
    if not os.path.isdir(agents_dir):
        print(f"  Skipped: {agents_dir} not found")
        return

    os.makedirs(output_dir, exist_ok=True)
    count = 0

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)

        copilot_fm = {}
        if "name" in frontmatter:
            copilot_fm["name"] = frontmatter["name"]
        if "description" in frontmatter:
            desc = frontmatter["description"].strip().split("\n")[0].strip()
            copilot_fm["description"] = desc
        copilot_fm["tools"] = _copilot_tools_for_prompt(prompt)
        copilot_fm["user-invocable"] = False

        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")
        prompt = prompt.replace(CONTEXT_HOOK_NOTE, CONTEXT_HOOK_REPLACEMENT)

        fm_str = yaml.dump(copilot_fm, default_flow_style=False, sort_keys=False).rstrip()
        out_filename = filename.replace(".md", ".agent.md")
        output_content = f"---\n{fm_str}\n---\n\n{prompt}\n"

        out_path = os.path.join(output_dir, out_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(output_content)
        print(f"  {out_filename}")
        count += 1

    print(f"  Generated {count} Copilot agent files in {output_dir}")


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

```text
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
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Generated: {output_path}")


if __name__ == "__main__":
    commands_dir = "arckit-claude/commands/"
    agents_dir = "arckit-claude/agents/"
    plugin_dir = "arckit-claude"

    print(
        "Converting plugin commands to Codex, OpenCode, Gemini, and Copilot extension formats..."
    )
    print()
    print(f"Source:       {commands_dir}")
    print(f"Agents:       {agents_dir}")
    for config in AGENT_CONFIG.values():
        ext_dir = config.get("extension_dir")
        if ext_dir:
            print(f"{config['name'] + ' Ext:':14s}{ext_dir}/")
    print()

    # Copy extension supporting files BEFORE convert so reference skills
    # are in place before command skills are generated on top
    print("Copying extension supporting files...")
    copy_extension_files(plugin_dir)

    print()
    counts = convert(commands_dir, agents_dir)

    # Post-processing: copy commands and agents to extension directories
    for agent_id, config in AGENT_CONFIG.items():
        ext_dir = config.get("extension_dir")
        if not ext_dir:
            continue

        if config.get("copy_commands_to_extension"):
            ext_commands_dir = os.path.join(ext_dir, "commands")
            os.makedirs(ext_commands_dir, exist_ok=True)
            src_dir = config["output_dir"]
            if os.path.isdir(src_dir):
                for filename in sorted(os.listdir(src_dir)):
                    if filename.endswith(".md"):
                        shutil.copy2(
                            os.path.join(src_dir, filename),
                            os.path.join(ext_commands_dir, filename),
                        )
                print(
                    f"  Copied {counts[agent_id]} commands to {config['name']} extension: {ext_commands_dir}"
                )

        if config.get("copy_agents_to_extension"):
            # Copy agents to local dir (sibling of output_dir) and extension dir
            local_agents_dir = os.path.join(
                os.path.dirname(config["output_dir"]), "agents"
            )
            ext_agents_dir = os.path.join(ext_dir, "agents")
            os.makedirs(local_agents_dir, exist_ok=True)
            os.makedirs(ext_agents_dir, exist_ok=True)
            if os.path.isdir(agents_dir):
                for filename in sorted(os.listdir(agents_dir)):
                    if filename.endswith(".md"):
                        src_agent = os.path.join(agents_dir, filename)
                        copy_agent_stripped(
                            src_agent,
                            os.path.join(local_agents_dir, filename),
                        )
                        copy_agent_stripped(
                            src_agent,
                            os.path.join(ext_agents_dir, filename),
                        )
                print(
                    f"  Copied agents to {local_agents_dir} and {ext_agents_dir}"
                )

    print()
    print("Generating Codex extension config...")
    generate_codex_config_toml(
        os.path.join(plugin_dir, ".mcp.json"),
        agents_dir,
        "arckit-codex/config.toml",
    )
    generate_agent_toml_files(
        agents_dir,
        "arckit-codex/agents",
        path_prefix=".arckit",
    )

    print()
    print("Rewriting Codex extension skills for Codex command format...")
    rewrite_codex_skills("arckit-codex/skills")

    print()
    print("Generating Gemini CLI sub-agents...")
    generate_gemini_agents(agents_dir, "arckit-gemini/agents")

    print()
    print("Generating Gemini extension hooks...")
    generate_gemini_hooks("arckit-gemini")

    print()
    print("Generating Gemini extension policies...")
    generate_gemini_policies("arckit-gemini")

    print()
    print("Generating Copilot custom agents...")
    generate_copilot_agents(agents_dir, "arckit-copilot/agents")

    print()
    print("Generating Copilot instructions...")
    generate_copilot_instructions("arckit-copilot/copilot-instructions.md")

    print()
    total = sum(counts.values())
    parts = " + ".join(
        f"{counts[aid]} {cfg['name']}" for aid, cfg in AGENT_CONFIG.items()
    )
    print(f"Generated {parts} = {total} total files.")
