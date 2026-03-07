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
            with open(agent_path, "r") as f:
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


def render_handoffs_section(handoffs):
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
        line = f"- `/arckit:{cmd}`"
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


# --- Agent configuration: adding a new AI target = adding a dictionary entry ---

AGENT_CONFIG = {
    "codex": {
        "name": "Codex CLI",
        "output_dir": ".codex/prompts",
        "filename_pattern": "arckit.{name}.md",
        "format": "markdown",
        "path_prefix": ".arckit",
    },
    "codex_extension": {
        "name": "Codex Extension",
        "output_dir": "arckit-codex/prompts",
        "filename_pattern": "arckit.{name}.md",
        "format": "markdown",
        "path_prefix": ".arckit",
        "extension_dir": "arckit-codex",
        "copy_commands_to_extension": True,
        "copy_agents_to_extension": True,
    },
    "codex_skills": {
        "name": "Codex Skills",
        "output_dir": "arckit-codex/skills",
        "format": "skill",
        "path_prefix": ".arckit",
    },
    "opencode": {
        "name": "OpenCode CLI",
        "output_dir": ".opencode/commands",
        "filename_pattern": "arckit.{name}.md",
        "format": "markdown",
        "path_prefix": ".arckit",
        "extension_dir": "arckit-opencode",
        "copy_commands_to_extension": True,
        "copy_agents_to_extension": True,
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


def format_output(description, prompt, fmt):
    """Format into target format: 'markdown', 'toml', or 'skill'."""
    if fmt == "toml":
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')
        prompt_formatted = '"""\n' + prompt_escaped + '\n"""'
        description_formatted = '"""\n' + description + '\n"""'
        return f"description = {description_formatted}\nprompt = {prompt_formatted}\n"
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

        with open(command_path, "r") as f:
            command_content = f.read()

        # Extract frontmatter from command (always use command's description)
        frontmatter, command_prompt = extract_frontmatter_and_prompt(command_content)
        description = frontmatter.get("description", "")
        handoffs = frontmatter.get("handoffs", [])

        # For agent-delegating commands, use the full agent prompt
        # (non-Claude targets don't support the Task/agent architecture)
        if filename in agent_map:
            agent_path, agent_prompt = agent_map[filename]
            prompt = agent_prompt
            source_label = f"{command_path} (agent: {agent_path})"
        else:
            prompt = command_prompt
            source_label = command_path

        # Append rendered handoffs section to prompt for all output formats
        handoffs_section = render_handoffs_section(handoffs)
        if handoffs_section:
            prompt = prompt + "\n" + handoffs_section

        base_name = filename.replace(".md", "")

        for agent_id, config in AGENT_CONFIG.items():
            rewritten = rewrite_paths(prompt, config)

            if config["format"] == "skill":
                skill_name = f"arckit-{base_name}"
                skill_dir = os.path.join(config["output_dir"], skill_name)
                os.makedirs(skill_dir, exist_ok=True)
                os.makedirs(os.path.join(skill_dir, "agents"), exist_ok=True)

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
        with open(mcp_json_path, "r") as f:
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
                with open(agent_path, "r") as f:
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
    with open(output_path, "w") as f:
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
        with open(agent_path, "r") as f:
            content = f.read()

        prompt = extract_agent_prompt(content)
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", path_prefix)
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"""', '\\"\\"\\"')

        toml_name = filename.replace(".md", ".toml")
        toml_path = os.path.join(output_dir, toml_name)

        toml_content = (
            f"# Auto-generated from arckit-plugin/agents/{filename}\n"
            f"# Do not edit — edit the source and re-run scripts/converter.py\n"
            f"\n"
            f'developer_instructions = """\n'
            f"{prompt_escaped}\n"
            f'"""\n'
        )

        with open(toml_path, "w") as f:
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
            with open(filepath, "r") as f:
                content = f.read()

            original = content

            # Rewrite /arckit:X -> $arckit-X (colon-prefixed plugin format)
            content = re.sub(r"/arckit:(\w[\w-]*)", r"$arckit-\1", content)

            # Rewrite /arckit.X -> $arckit-X (dot-prefixed format)
            # Only match when preceded by a space or start-of-line to avoid false matches
            content = re.sub(
                r"(?<=\s)/arckit\.(\w[\w-]*)",
                r"$arckit-\1",
                content,
            )

            # Rewrite /prompts:arckit.X -> $arckit-X (old Codex prompt format)
            content = re.sub(
                r"/prompts:arckit\.(\w[\w-]*)",
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
                with open(filepath, "w") as f:
                    f.write(content)
                rel_path = os.path.relpath(filepath, skills_dir)
                print(f"  Rewrote: {skills_dir}/{rel_path}")
                count += 1

    if count:
        print(f"  Rewrote {count} skill files for Codex skill invocation format")


if __name__ == "__main__":
    commands_dir = "arckit-plugin/commands/"
    agents_dir = "arckit-plugin/agents/"
    plugin_dir = "arckit-plugin"

    print(
        "Converting plugin commands to Codex, OpenCode, and Gemini extension formats..."
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
                        shutil.copy2(
                            src_agent,
                            os.path.join(local_agents_dir, filename),
                        )
                        shutil.copy2(
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
    total = sum(counts.values())
    parts = " + ".join(
        f"{counts[aid]} {cfg['name']}" for aid, cfg in AGENT_CONFIG.items()
    )
    print(f"Generated {parts} = {total} total files.")
