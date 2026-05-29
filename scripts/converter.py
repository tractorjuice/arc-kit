import os
import re
import json
import shutil

import yaml


CLAUDE_ONLY_COMMAND_FIELDS = (
    "effort",
    "keep-coding-instructions",
    "paths",
)

CLAUDE_ONLY_AGENT_FIELDS = (
    "effort",
    "initialPrompt",
    "maxTurns",
    "disallowedTools",
    "tools",
)


USER_CONFIG_PLACEHOLDER_RE = re.compile(r"\$\{user_config\.([A-Za-z_][A-Za-z0-9_]*)\}")


def rewrite_user_config_placeholders(value):
    """Rewrite Claude Code `${user_config.KEY}` placeholders to plain `${KEY}`.

    Non-Claude extensions (Codex, Gemini, OpenCode, Copilot) don't support
    plugin user config and fall back to shell environment variables.
    """
    if not isinstance(value, str):
        return value
    return USER_CONFIG_PLACEHOLDER_RE.sub(r"${\1}", value)


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
            if is_subagent_file(agent_path):
                continue
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


def is_subagent_file(agent_path):
    """True if the agent file's frontmatter has `subagent: true`.

    Subagents are reader/writer subagents dispatched by an orchestrator
    via the Claude Code Agent tool. They are Claude-only — non-Claude
    runtimes (Codex, Gemini, OpenCode, Copilot) do not support subagent
    dispatch, so the converter filters them out of those targets.
    """
    try:
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return False
    if not content.startswith("---"):
        return False
    parts = content.split("---", 2)
    if len(parts) < 3:
        return False
    try:
        fm = yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError:
        return False
    return bool(fm.get("subagent"))


def copy_agent_stripped(src_path, dest_path, config=None):
    """Copy an agent file to dest, stripping Claude-only frontmatter fields."""
    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 2:
            try:
                fm = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                fm = {}
            for field in CLAUDE_ONLY_AGENT_FIELDS:
                fm.pop(field, None)
            rebuilt = "---\n" + yaml.dump(fm, default_flow_style=False, allow_unicode=True) + "---" + parts[2]
            if config:
                rebuilt = rewrite_paths(rebuilt, config)
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(rebuilt)
            return
    if config:
        content = rewrite_paths(content, config)
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
        invocation = (
            command_format(cmd)
            if callable(command_format)
            else command_format.format(cmd=cmd)
        )
        line = f"- `{invocation}`"
        if desc:
            line += f" -- {desc}"
        if cond:
            line += f" *(when {cond})*"
        lines.append(line)
    lines.append("")
    return "\n".join(lines)


def codex_skill_name(command_name):
    """Return a Codex-compatible skill name for an ArcKit command name."""
    return f"arckit-{command_name.replace('.', '-')}"


def codex_skill_invocation(command_name):
    """Return the invocation string for a Codex skill-backed command."""
    return f"${codex_skill_name(command_name)}"


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


# --- Plugin source directories merged into each non-Claude extension output ---
#
# After the v5.0.0 plugin split, commands live across 6 directories. Non-Claude
# extensions stay monolithic (per the v5 spec), so the converter walks every
# source and merges into one output per format.
#
# Order: community plugins first, core last. Filenames are jurisdiction-prefixed
# (uae-*, fr-*, ca-*, eu-*, at-*) so collisions don't happen, but if they ever
# did, core-last means core wins.

PLUGIN_SOURCES = [
    "arckit-uae",
    "arckit-fr",
    "arckit-ca",
    "arckit-eu",
    "arckit-at",
    "arckit-au",
    "arckit-us",
    "arckit-uk-finance",
    "arckit-uk-nhs",
    "arckit-claude",  # core last
]


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
        "project_template_overrides": True,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
    "codex_skills": {
        "name": "Codex Skills",
        "output_dir": "arckit-codex/skills",
        "format": "skill",
        "path_prefix": ".arckit",
        "project_template_overrides": True,
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
    "paperclip": {
        "name": "Paperclip",
        "output_dir": "arckit-paperclip/src/data",
        "format": "json",
        "path_prefix": "scripts/bash",
        "arg_placeholder": "{topic}",
        "extension_dir": "arckit-paperclip",
        "copy_commands_to_extension": False,
        "copy_agents_to_extension": False,
        "copy_scripts_to_extension": False,
        "has_context_hook": False,
        "has_sync_guides_hook": False,
    },
}


def rewrite_paths(prompt, config):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} paths using agent config."""
    result = prompt

    # Claude commands use literal `.arckit/templates/` for project-local
    # overrides and `${CLAUDE_PLUGIN_ROOT}/templates/` for shipped defaults.
    # Codex projects keep shipped defaults in `.arckit/templates/`, so their
    # project override path must be rewritten before plugin-root expansion.
    if config.get("project_template_overrides"):
        result = result.replace(".arckit/templates/", ".arckit/templates-custom/")

    result = result.replace("${CLAUDE_PLUGIN_ROOT}", config["path_prefix"])

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


def format_json_entry(name, description, prompt, template_content, handoffs):
    """Build a single JSON-serializable entry for commands.json."""
    processed_handoffs = []
    for h in (handoffs or []):
        entry = {
            "command": f"arckit-{h.get('command', '')}",
            "description": h.get("description", ""),
        }
        if h.get("condition"):
            entry["condition"] = h["condition"]
        processed_handoffs.append(entry)

    return {
        "name": f"arckit-{name}",
        "description": description,
        "prompt": prompt,
        "template": template_content,
        "handoffs": processed_handoffs,
    }


def read_template_for_command(name, templates_dir):
    """Read the template file for a command, if one exists.

    Template naming convention: {name}-template.md
    """
    template_path = os.path.join(templates_dir, f"{name}-template.md")
    if os.path.isfile(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            return f.read()
    return None


def convert(commands_dirs, agents_dir):
    """Convert plugin commands to all configured AI agent formats.

    Reads each plugin command once across all source directories, resolves
    agent prompts once, then writes output formats with appropriate path
    rewriting driven by AGENT_CONFIG.

    Args:
        commands_dirs: List of source command directories to merge
            (e.g. ["arckit-uae/commands/", ..., "arckit-claude/commands/"]).
            Multiple sources land in the same monolithic extension output per
            the v5.0.0 plugin split design.
        agents_dir: Single agents directory (agents stay in core).
    """
    # Commands that depend on Claude Code-only features (parallel Agent dispatch,
    # plugin skills, etc.). Skipped when generating non-Claude formats because
    # they would silently fail or behave incorrectly on those platforms.
    claude_only_commands = {"build.md"}

    for config in AGENT_CONFIG.values():
        os.makedirs(config["output_dir"], exist_ok=True)
        if config.get("format") == "skill":
            for dirname in os.listdir(config["output_dir"]):
                if dirname.startswith("arckit-"):
                    skill_dir = os.path.join(config["output_dir"], dirname)
                    if os.path.isdir(skill_dir):
                        shutil.rmtree(skill_dir)

    agent_map = build_agent_map(agents_dir)
    counts = {agent_id: 0 for agent_id in AGENT_CONFIG}
    paperclip_entries = []

    # Build merged file list across all plugin sources. Each entry is
    # (commands_dir, filename) so per-source path lookups (templates,
    # standalone overrides) resolve against the correct plugin's tree.
    merged_files = []
    seen_filenames = set()
    for commands_dir in commands_dirs:
        if not os.path.isdir(commands_dir):
            continue
        for filename in sorted(os.listdir(commands_dir)):
            if not filename.endswith(".md"):
                continue
            if filename in seen_filenames:
                # Collision (community vs core, or community vs community).
                # Filenames are jurisdiction-prefixed so this shouldn't
                # happen in practice; warn loudly if it does.
                print(
                    f"  WARNING: duplicate filename {filename} in {commands_dir} "
                    f"— skipping (first occurrence wins)"
                )
                continue
            seen_filenames.add(filename)
            merged_files.append((commands_dir, filename))

    # Sort by filename so extension output order doesn't depend on the
    # PLUGIN_SOURCES iteration order (paperclip's commands.json ordering
    # was previously alphabetical across all commands; preserve that).
    merged_files.sort(key=lambda entry: entry[1])

    for commands_dir, filename in merged_files:
        if filename in claude_only_commands:
            print(f"  Skipped Claude-only command: {filename}")
            continue

        command_path = os.path.join(commands_dir, filename)

        with open(command_path, "r", encoding="utf-8") as f:
            command_content = f.read()

        # Extract frontmatter from command (always use command's description)
        frontmatter, command_prompt = extract_frontmatter_and_prompt(command_content)
        description = frontmatter.get("description", "")
        handoffs = frontmatter.get("handoffs", [])
        # Strip Claude-only fields — they have no meaning for Codex/OpenCode/Gemini/Copilot targets
        for field in CLAUDE_ONLY_COMMAND_FIELDS:
            frontmatter.pop(field, None)

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

        # Collect entry for Paperclip JSON format
        if "paperclip" in AGENT_CONFIG:
            pc_config = AGENT_CONFIG["paperclip"]
            pc_prompt = rewrite_paths(prompt, pc_config)
            pc_prompt = rewrite_hook_dependencies(pc_prompt, pc_config)
            template_content = read_template_for_command(
                base_name,
                os.path.join(os.path.dirname(commands_dir.rstrip(os.sep)), "templates"),
            )
            paperclip_entries.append(
                format_json_entry(base_name, description, pc_prompt, template_content, handoffs)
            )
            counts["paperclip"] += 1

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
            if config["format"] == "json":
                continue  # Handled separately (single file for all commands)

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
                cmd_fmt = codex_skill_invocation
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
                skill_name = codex_skill_name(base_name)
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

    # Write Paperclip commands.json (single file for all commands)
    if "paperclip" in AGENT_CONFIG and paperclip_entries:
        pc_config = AGENT_CONFIG["paperclip"]
        os.makedirs(pc_config["output_dir"], exist_ok=True)
        out_path = os.path.join(pc_config["output_dir"], "commands.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(paperclip_entries, f, indent=2, ensure_ascii=False)
        print(f"  {'Paperclip:':14s}Generated {out_path} ({len(paperclip_entries)} commands)")

    return counts


def copy_extension_files(plugin_sources):
    """Copy supporting files from all plugin sources to extension directories.

    After the v5.0.0 plugin split, `templates/` lives in 6 different source
    directories (one per plugin). Non-Claude extensions stay monolithic, so
    templates from every source are merged into one `templates/` per extension.
    Other directories (scripts, guides, config, schemas, skills, references)
    only exist in `arckit-claude` and are copied from there.

    Args:
        plugin_sources: List of plugin source dirs (e.g. ["arckit-uae", ...,
            "arckit-claude"]). The last entry MUST be the core plugin
            ("arckit-claude") since that's where scripts/guides/etc. live.
    """
    core_plugin_dir = plugin_sources[-1]

    # Categories that exist only in the core plugin and are copied from there.
    core_only_copies = [
        ("scripts/bash", "scripts/bash"),
        ("scripts/python", "scripts/python"),
        ("scripts/validate-handoff.mjs", "scripts/validate-handoff.mjs"),
        ("scripts/owm-to-mermaid.mjs", "scripts/owm-to-mermaid.mjs"),
        # owm-tidy.mjs is invoked by /arckit:wardley --tidy-owm; ship it and its
        # placement-engine dependency so the flag works on non-Claude CLIs too.
        ("hooks/owm-tidy.mjs", "hooks/owm-tidy.mjs"),
        ("hooks/wardley-label-placement.mjs", "hooks/wardley-label-placement.mjs"),
        ("docs/guides", "docs/guides"),
        ("config", "config"),
        ("schemas", "schemas"),
        ("skills", "skills"),
        ("references", "references"),
    ]

    # Skills that depend on Claude Code-only features (parallel Agent tool
    # dispatch, plugin hooks). Skipped when copying to non-Claude extensions
    # because they would either silently fail or behave incorrectly there.
    claude_only_skills = {"arckit-build"}

    for config in AGENT_CONFIG.values():
        ext_dir = config.get("extension_dir")
        if not ext_dir:
            continue
        copy_scripts = config.get("copy_scripts_to_extension", True)
        print(f"Copying to {config['name']} extension ({ext_dir})...")

        # Merge templates from every plugin source into one templates/ dir.
        ext_templates_dir = os.path.join(ext_dir, "templates")
        if os.path.isdir(ext_templates_dir):
            shutil.rmtree(ext_templates_dir)
        os.makedirs(ext_templates_dir, exist_ok=True)
        merged_template_count = 0
        for src_plugin in plugin_sources:
            src_templates = os.path.join(src_plugin, "templates")
            if not os.path.isdir(src_templates):
                continue
            for entry in os.listdir(src_templates):
                src_path = os.path.join(src_templates, entry)
                dst_path = os.path.join(ext_templates_dir, entry)
                if os.path.isfile(src_path):
                    shutil.copy2(src_path, dst_path)
                    merged_template_count += 1
                elif os.path.isdir(src_path):
                    if os.path.isdir(dst_path):
                        shutil.rmtree(dst_path)
                    shutil.copytree(src_path, dst_path)
                    merged_template_count += sum(
                        len(files) for _, _, files in os.walk(dst_path)
                    )
        print(
            f"  Merged templates from {len(plugin_sources)} plugin source(s) "
            f"-> {ext_templates_dir} ({merged_template_count} files)"
        )

        # Core-only categories
        for src_rel, dst_rel in core_only_copies:
            if not copy_scripts and src_rel.startswith("scripts/"):
                continue
            src = os.path.join(core_plugin_dir, src_rel)
            dst = os.path.join(ext_dir, dst_rel)
            if os.path.isdir(src):
                if os.path.isdir(dst):
                    shutil.rmtree(dst)
                shutil.copytree(src, dst)
                if dst_rel == "skills":
                    # Skip Claude-only skills for non-Claude targets
                    for skill_name in claude_only_skills:
                        skill_path = os.path.join(dst, skill_name)
                        if os.path.isdir(skill_path):
                            shutil.rmtree(skill_path)
                            print(f"  Skipped Claude-only skill: {skill_name}")
                    strip_claude_only_skill_fields(dst)
                file_count = sum(len(files) for _, _, files in os.walk(dst))
                print(f"  Copied: {src} -> {dst} ({file_count} files)")
            elif os.path.isfile(src):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
                print(f"  Copied: {src} -> {dst}")


def strip_claude_only_skill_fields(skills_dir):
    """Strip Claude-only frontmatter fields (e.g. paths) from SKILL.md files."""
    if not os.path.isdir(skills_dir):
        return
    for root, _dirs, files in os.walk(skills_dir):
        for filename in files:
            if filename != "SKILL.md":
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            if not content.startswith("---"):
                continue
            parts = content.split("---", 2)
            if len(parts) <= 2:
                continue
            try:
                fm = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                continue
            if "paths" not in fm:
                continue
            fm.pop("paths", None)
            rebuilt = (
                "---\n"
                + yaml.dump(fm, default_flow_style=False, allow_unicode=True, sort_keys=False)
                + "---"
                + parts[2]
            )
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(rebuilt)


def generate_codex_config_toml(mcp_json_path, agents_dir, output_path):
    """Generate config.toml for Codex extension with MCP servers and agent roles."""
    lines = [
        "# ArcKit Codex Extension Configuration",
        "# Auto-generated by scripts/converter.py — do not edit directly",
        "",
        "[features]",
        "hooks = true",
        "plugin_hooks = true",
        "",
        "# ── Lifecycle Hooks ─────────────────────────────────",
        "# Resolve hook scripts from the git root so Codex can start in subdirectories.",
        "",
        "[[hooks.SessionStart]]",
        'matcher = "startup|resume|clear"',
        "",
        "[[hooks.SessionStart.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" SessionStart'",
        "timeout = 10",
        'statusMessage = "Loading ArcKit context"',
        "",
        "[[hooks.UserPromptSubmit]]",
        "",
        "[[hooks.UserPromptSubmit.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" UserPromptSubmit'",
        "timeout = 10",
        'statusMessage = "Checking ArcKit prompt"',
        "",
        "[[hooks.PreToolUse]]",
        'matcher = "Read|Bash|apply_patch|Edit|Write"',
        "",
        "[[hooks.PreToolUse.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" PreToolUse'",
        "timeout = 10",
        'statusMessage = "Checking ArcKit file policy"',
        "",
        "[[hooks.PostToolUse]]",
        'matcher = "apply_patch|Edit|Write"',
        "",
        "[[hooks.PostToolUse.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" PostToolUse'",
        "timeout = 10",
        'statusMessage = "Updating ArcKit metadata"',
        "",
        "[[hooks.PermissionRequest]]",
        'matcher = "mcp__.*"',
        "",
        "[[hooks.PermissionRequest.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" PermissionRequest'",
        "timeout = 10",
        'statusMessage = "Checking ArcKit MCP policy"',
        "",
        "[[hooks.Stop]]",
        "",
        "[[hooks.Stop.hooks]]",
        'type = "command"',
        "command = 'node \"$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs\" Stop'",
        "timeout = 10",
        'statusMessage = "Recording ArcKit session"',
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
            # Claude Code-only MCP fields that other platforms (Codex/Gemini/OpenCode)
            # don't understand and shouldn't see in their generated configs.
            CLAUDE_ONLY_MCP_FIELDS = {"alwaysLoad"}
            for name, server in servers.items():
                lines.append(f"[mcp_servers.{name}]")
                for key, value in server.items():
                    if key in CLAUDE_ONLY_MCP_FIELDS:
                        continue
                    if key == "headers":
                        header_parts = []
                        for hk, hv in value.items():
                            header_parts.append(f'"{hk}" = "{rewrite_user_config_placeholders(hv)}"')
                        lines.append(f"headers = {{ {', '.join(header_parts)} }}")
                    else:
                        lines.append(f'{key} = "{rewrite_user_config_placeholders(value)}"')
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
                if is_subagent_file(agent_path):
                    continue
                with open(agent_path, "r", encoding="utf-8") as f:
                    content = f.read()
                frontmatter, _ = extract_frontmatter_and_prompt(content)
                name = frontmatter.get("name", filename.replace(".md", ""))
                desc = frontmatter.get("description", "")
                first_line = desc.strip().split("\n")[0].strip()
                toml_name = filename.replace(".md", "")

                lines.append(f"[agents.{name}]")
                escaped_desc = first_line.replace('"', '\\"')
                lines.append(f'description = "{escaped_desc}"')
                lines.append(f'config_file = "agents/{toml_name}.toml"')
                lines.append("")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Generated: {output_path}")


def generate_codex_mcp_json(mcp_json_path, output_path):
    """Generate Codex plugin MCP config from Claude MCP config."""
    if not os.path.isfile(mcp_json_path):
        return

    with open(mcp_json_path, "r", encoding="utf-8") as f:
        mcp_config = json.load(f)

    servers = mcp_config.get("mcpServers", {})
    codex_servers = {}
    for name, server in servers.items():
        codex_server = {}
        for key, value in server.items():
            if key == "alwaysLoad":
                continue
            if key == "headers":
                codex_server[key] = {
                    header_name: rewrite_user_config_placeholders(header_value)
                    for header_name, header_value in value.items()
                }
            else:
                codex_server[key] = rewrite_user_config_placeholders(value)
        codex_servers[name] = codex_server

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"mcpServers": codex_servers}, f, indent=2)
        f.write("\n")
    print(f"  Generated: {output_path}")


def generate_codex_plugin_manifest(output_dir):
    """Generate Codex plugin manifest for the standalone ArcKit Codex bundle."""
    version_path = os.path.join(output_dir, "VERSION")
    version = "0.0.0"
    if os.path.isfile(version_path):
        with open(version_path, "r", encoding="utf-8") as f:
            version = f.read().strip() or version

    manifest = {
        "name": "arckit-codex",
        "version": version,
        "description": "Enterprise architecture governance, procurement, research, and delivery workflows for Codex.",
        "author": {
            "name": "ArcKit",
            "url": "https://github.com/tractorjuice/arc-kit",
        },
        "homepage": "https://github.com/tractorjuice/arckit-codex",
        "repository": "https://github.com/tractorjuice/arckit-codex",
        "license": "MIT",
        "keywords": [
            "enterprise-architecture",
            "governance",
            "procurement",
            "public-sector",
            "codex",
        ],
        "skills": "./skills/",
        "mcpServers": "./.mcp.json",
        "hooks": "./hooks/hooks.json",
        "interface": {
            "displayName": "ArcKit",
            "shortDescription": "Architecture governance workflows for Codex",
            "longDescription": "Use ArcKit to create, review, and connect architecture, procurement, governance, compliance, research, and delivery artifacts in Codex.",
            "developerName": "ArcKit",
            "category": "Productivity",
            "capabilities": [
                "Interactive",
                "Write",
                "MCP",
            ],
            "websiteURL": "https://github.com/tractorjuice/arc-kit",
            "defaultPrompt": [
                "Use ArcKit to start an architecture governance project.",
                "Use ArcKit to assess requirements, risks, decisions, and procurement options.",
            ],
            "brandColor": "#2F6F6D",
        },
    }

    manifest_dir = os.path.join(output_dir, ".codex-plugin")
    os.makedirs(manifest_dir, exist_ok=True)
    manifest_path = os.path.join(manifest_dir, "plugin.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"  Generated: {manifest_path}")


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
        if is_subagent_file(agent_path):
            continue
        with open(agent_path, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)
        prompt = rewrite_paths(
            prompt,
            {
                "path_prefix": path_prefix,
                "project_template_overrides": True,
            },
        )
        prompt_escaped = prompt.replace("\\", "\\\\").replace('"""', '\\"\\"\\"')

        agent_name = frontmatter.get("name", filename.replace(".md", ""))

        toml_name = filename.replace(".md", ".toml")
        toml_path = os.path.join(output_dir, toml_name)

        toml_content = (
            f"# Auto-generated from arckit-claude/agents/{filename}\n"
            f"# Do not edit — edit the source and re-run scripts/converter.py\n"
            f"\n"
            f'name = "{agent_name}"\n'
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

    def normalize_codex_invocation(match):
        return codex_skill_invocation(match.group(1))

    count = 0
    for root, dirs, files in os.walk(skills_dir):
        for filename in files:
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            original = content

            # Rewrite a small number of Claude Code-only workflow notes that
            # otherwise leak into generated Codex skills. Do this before the
            # generic command invocation rewrite so filesystem paths such as
            # `.claude/commands/arckit.foo.md` are converted as paths, not
            # accidentally rewritten into malformed `$arckit-foo` snippets.
            if os.path.basename(root) == "arckit-template-builder":
                content = content.replace("Slash Command", "Codex Skill")
                content = content.replace("slash command", "Codex skill")
                content = content.replace(
                    "Ask these questions BEFORE reading any templates. Call the **AskUserQuestion** tool exactly once with all 4 questions below in a single call. Do NOT proceed until the user has answered.",
                    "Ask these questions BEFORE reading any templates. Present all 4 questions together, then wait for the user's answers before continuing.",
                )
                content = content.replace(
                    "Use the Read tool only — do NOT use Bash, Glob, or Agent to search for templates.",
                    "Read these files directly. Do not search broadly or delegate this step.",
                )
                content = content.replace(" using the Write tool", "")
                content = content.replace(" using the Write tool.", ".")
                content = content.replace(
                    "The Write tool MUST be used for all file creation (avoids token limit issues)",
                    "Write generated artifacts to files instead of printing full content in the response",
                )
                content = content.replace("command file", "skill file")
                content = content.replace("Command Structure", "Skill Structure")
                content = content.replace(
                    "Generate a matching `$arckit-community-{name}` skill file",
                    "Generate a matching `$arckit-community-{name}` skill",
                )
                content = content.replace(
                    "If \"Codex Skill\" is selected, generate a skill file in Step 6.",
                    "If \"Codex Skill\" is selected, generate a skill in Step 6.",
                )
                content = content.replace(
                    "description: {Brief description of what this command generates}\nargument-hint: \"<project ID or name>\"",
                    "name: arckit-community-{name}\ndescription: \"{Brief description of what this skill generates}\"",
                )
                content = content.replace(
                    ".claude/commands/arckit.community.{name}.md",
                    ".agents/skills/arckit-community-{name}/SKILL.md",
                )
                content = content.replace(
                    ".claude/commands/arckit.community.security-assessment.md",
                    ".agents/skills/arckit-community-security-assessment/SKILL.md",
                )
                content = content.replace(".claude/commands/", ".agents/skills/")
                content = content.replace(".claude/commands", ".agents/skills")
                content = content.replace(
                    "arckit.community.{name}.md",
                    "arckit-community-{name}/SKILL.md",
                )
                content = content.replace(
                    "arckit.community.security-assessment.md",
                    "arckit-community-security-assessment/SKILL.md",
                )
                content = content.replace(
                    "/arckit.community.{name}",
                    "$arckit-community-{name}",
                )
                content = content.replace(
                    "/arckit.community.security-assessment",
                    "$arckit-community-security-assessment",
                )
                content = content.replace(
                    "arckit.community.{name}",
                    "$arckit-community-{name}",
                )
                content = content.replace(
                    "arckit.community.security-assessment",
                    "$arckit-community-security-assessment",
                )
                content = content.replace(
                    "This location is auto-discovered by Claude Code as a project-level Codex skill",
                    "This location is auto-discovered by Codex as a project-level skill",
                )

            # Rewrite /arckit:X -> $arckit-X (colon-prefixed plugin format)
            content = re.sub(
                r"(?<![\w/])/arckit:(\w[\w.-]*)",
                normalize_codex_invocation,
                content,
            )

            # Rewrite /arckit.X -> $arckit-X (dot-prefixed format)
            content = re.sub(
                r"(?<![\w/])/arckit\.(\w[\w.-]*)",
                normalize_codex_invocation,
                content,
            )

            # Rewrite /prompts:arckit.X -> $arckit-X (old Codex prompt format)
            content = re.sub(
                r"/prompts:arckit\.(\w[\w.-]*)",
                normalize_codex_invocation,
                content,
            )

            # Normalize any already-rewritten skill invocations that still
            # contain command-name dots, such as $arckit-wardley.climate.
            content = re.sub(
                r"\$arckit-([A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z0-9.-]*)",
                normalize_codex_invocation,
                content,
            )
            content = re.sub(r"(?<![\w/])/arckit:\*", "$arckit-*", content)
            content = re.sub(r"(?<![\w/])/arckit:", "$arckit-", content)
            content = re.sub(r"(?<![\w/])/arckit\.", "$arckit-", content)
            content = content.replace("`/$arckit-", "`$arckit-")
            content = content.replace("(/$arckit-", "($arckit-")
            content = content.replace("Run `/$arckit-", "Run `$arckit-")

            # Codex skills should ask the user directly instead of naming
            # Claude Code's AskUserQuestion UI tool.
            content = re.sub(
                r"use the \*\*AskUserQuestion\*\* tool to gather",
                "ask the user for",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use the \*\*AskUserQuestion\*\* tool to ask",
                "ask the user",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use the AskUserQuestion tool to interactively gather",
                "ask the user for",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use the AskUserQuestion tool to gather",
                "ask the user for",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use AskUserQuestion to ask",
                "ask the user",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use AskUserQuestion to confirm",
                "ask the user to confirm",
                content,
                flags=re.IGNORECASE,
            )
            content = re.sub(
                r"use AskUserQuestion to clarify with the user",
                "ask the user to clarify",
                content,
                flags=re.IGNORECASE,
            )
            content = content.replace("using AskUserQuestion", "by asking the user")
            content = content.replace(
                "AskUserQuestion with multiple-choice options",
                "multiple-choice options",
            )
            content = content.replace("single AskUserQuestion call", "single message")
            content = content.replace("AskUserQuestion", "direct user question")

            if os.path.basename(root) == "arckit-template-builder":
                content = content.replace(
                    "For official promotion: rename command (drop `community.` prefix), change banner to `Template Origin: Official`, and open a PR.",
                    "For official promotion: rename the generated skill if needed, change banner to `Template Origin: Official`, and open a PR.",
                )
                content = content.replace(
                    "Rename skill file: drop `community.` prefix",
                    "Rename or relocate the community skill if promoting it to an official ArcKit command",
                )
                content = content.replace(
                    "Rename command file: drop `community.` prefix",
                    "Rename or relocate the community skill if promoting it to an official ArcKit command",
                )
                content = content.replace(
                    "Copy of the command (if generated)",
                    "Copy of the skill (if generated)",
                )
                content = content.replace(
                    "Copy the command (if generated)",
                    "Copy of the skill (if generated)",
                )
                content = content.replace(
                    "Community commands use the `community.` prefix",
                    "Community skills use the `arckit-community-` prefix",
                )

            content = content.replace(
                "Claude Code's 32K token output limit",
                "Codex output limits",
            )
            content = content.replace(
                "The Stop hook (`validate-wardley-math.mjs`) checks both blocks for consistency.",
                "Manually check that the OWM source and Mermaid output stay consistent after conversion.",
            )
            content = content.replace(
                "### Example 5: Continuous Monitoring with `/loop`",
                "### Example 5: Repeat Monitoring",
            )
            content = content.replace(
                "```bash\n/loop 30m $arckit-health SEVERITY=HIGH\n```",
                "```text\n$arckit-health SEVERITY=HIGH\n```",
            )
            content = content.replace(
                "Runs the health check every 30 minutes during your session, surfacing HIGH severity findings as they appear. Useful during long architecture sessions where multiple artifacts are being created or updated. Requires Claude Code v2.1.97+.",
                "Re-run this health check periodically during long architecture sessions to surface HIGH severity findings as artifacts change. Codex does not provide a built-in loop command; use a scheduler if you need automation.",
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
        if is_subagent_file(agent_path):
            continue
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
        if is_subagent_file(agent_path):
            continue
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
    commands_dirs = [os.path.join(src, "commands") for src in PLUGIN_SOURCES]
    agents_dir = "arckit-claude/agents/"
    plugin_dir = "arckit-claude"  # for downstream functions that only touch core

    print(
        "Converting plugin commands to Codex, OpenCode, Gemini, and Copilot extension formats..."
    )
    print()
    print(f"Sources:      {len(PLUGIN_SOURCES)} plugin dirs")
    for src in PLUGIN_SOURCES:
        cmd_count = (
            len([f for f in os.listdir(os.path.join(src, "commands"))
                 if f.endswith(".md")])
            if os.path.isdir(os.path.join(src, "commands")) else 0
        )
        print(f"  {src}: {cmd_count} commands")
    print(f"Agents:       {agents_dir}")
    for config in AGENT_CONFIG.values():
        ext_dir = config.get("extension_dir")
        if ext_dir:
            print(f"{config['name'] + ' Ext:':14s}{ext_dir}/")
    print()

    # Copy extension supporting files BEFORE convert so reference skills
    # are in place before command skills are generated on top
    print("Copying extension supporting files...")
    copy_extension_files(PLUGIN_SOURCES)

    print()
    counts = convert(commands_dirs, agents_dir)

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
            agent_output_dirs = {local_agents_dir, ext_agents_dir}
            for agent_output_dir in agent_output_dirs:
                if os.path.isdir(agent_output_dir):
                    shutil.rmtree(agent_output_dir)
                os.makedirs(agent_output_dir, exist_ok=True)
            if os.path.isdir(agents_dir):
                for filename in sorted(os.listdir(agents_dir)):
                    if filename.startswith("arckit-") and filename.endswith(".md"):
                        src_agent = os.path.join(agents_dir, filename)
                        if is_subagent_file(src_agent):
                            continue
                        copy_agent_stripped(
                            src_agent,
                            os.path.join(local_agents_dir, filename),
                            config,
                        )
                        copy_agent_stripped(
                            src_agent,
                            os.path.join(ext_agents_dir, filename),
                            config,
                        )
                print(
                    f"  Copied agents to {local_agents_dir} and {ext_agents_dir}"
                )

    print()
    print("Generating Codex extension config...")
    generate_codex_plugin_manifest("arckit-codex")
    generate_codex_mcp_json(
        os.path.join(plugin_dir, ".mcp.json"),
        "arckit-codex/.mcp.json",
    )
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
