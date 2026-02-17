import os
import re
import shutil


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
    """Extract YAML frontmatter description and prompt body from markdown."""
    description = ""
    prompt = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 1:
            frontmatter = parts[1]
            prompt = parts[2].strip()
            desc_match = re.search(r"description:\s*(.*)", frontmatter)
            if desc_match:
                description = desc_match.group(1).strip()
                # Remove surrounding quotes if present (from YAML)
                if description.startswith('"') and description.endswith('"'):
                    description = description[1:-1]
                elif description.startswith("'") and description.endswith("'"):
                    description = description[1:-1]
                # Handle multi-line YAML (e.g. description: |) by taking
                # only the first non-empty content line
                if description in ("|", ">"):
                    # Multi-line block — skip it, we'll use command description
                    description = ""
    return description, prompt


def extract_agent_prompt(content):
    """Extract prompt body from agent file, stripping agent-specific frontmatter."""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) > 2:
            return parts[2].strip()
    return content


def rewrite_paths_for_cli(prompt):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} to project-local .arckit paths for CLI distribution.

    CLI projects (created by arckit init) have templates and scripts at .arckit/.
    """
    return prompt.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")


def rewrite_paths_for_opencode(prompt):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} to project-local .arckit paths for OpenCode.

    OpenCode projects have templates and scripts at .arckit/.
    """
    return prompt.replace("${CLAUDE_PLUGIN_ROOT}", ".arckit")


EXTENSION_FILE_ACCESS_BLOCK = """\
**IMPORTANT — Gemini Extension File Access**:
This command runs as a Gemini CLI extension. The extension directory \
(`~/.gemini/extensions/arckit/`) is outside the workspace sandbox, so you \
CANNOT use the read_file tool to access it. Instead:
- To read templates/files: use a shell command, e.g. `cat ~/.gemini/extensions/arckit/templates/foo-template.md`
- To list files: use `ls ~/.gemini/extensions/arckit/templates/`
- To run scripts: use `bash ~/.gemini/extensions/arckit/scripts/bash/create-project.sh --json`
- To check file existence: use `test -f ~/.gemini/extensions/arckit/templates/foo-template.md && echo exists`
All extension file access MUST go through shell commands.

"""


def rewrite_paths_for_extension(prompt):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} to Gemini extension install path.

    Gemini extensions install to ~/.gemini/extensions/{name}/.
    Also rewrites 'Read `path`' instructions to use shell commands,
    since the extension directory is outside Gemini's workspace sandbox.
    """
    result = prompt.replace("${CLAUDE_PLUGIN_ROOT}", "~/.gemini/extensions/arckit")

    # Rewrite "Read `~/.gemini/extensions/arckit/..." instructions to use cat
    result = re.sub(
        r"Read `(~/.gemini/extensions/arckit/[^`]+)`",
        r"Run `cat \1` to read the file",
        result,
    )

    # Prepend the file access instruction block
    result = EXTENSION_FILE_ACCESS_BLOCK + result

    return result


def format_toml(description, prompt):
    """Format description and prompt into Gemini TOML content."""
    # Escape for TOML triple-quoted strings
    prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')
    prompt_formatted = '"""\n' + prompt_escaped + '\n"""'

    # Replace $ARGUMENTS with {{args}}
    prompt_formatted = prompt_formatted.replace("$ARGUMENTS", "{{args}}")

    description_formatted = '"""\n' + description + '\n"""'

    return f"description = {description_formatted}\nprompt = {prompt_formatted}\n"


def format_codex(description, prompt):
    """Format description and prompt into Codex markdown with YAML frontmatter."""
    # Quote description to handle YAML-special characters (: # [ { * &)
    escaped = description.replace("\\", "\\\\").replace('"', '\\"')
    return f'---\ndescription: "{escaped}"\n---\n\n{prompt}\n'


def format_opencode(description, prompt):
    """Format description and prompt into OpenCode markdown with YAML frontmatter."""
    # Reuse Codex formatting for now as it matches standard markdown + frontmatter
    return format_codex(description, prompt)


def convert(commands_dir, agents_dir, extension_dir="arckit-gemini/commands/arckit"):
    """Convert plugin commands to Codex, OpenCode, and Gemini extension formats.

    Reads each plugin command once, resolves agent prompts once, then
    writes output formats with appropriate path rewriting.

    Plugin command files are named {name}.md (e.g., requirements.md).
    Codex output:        .codex/prompts/arckit.{name}.md      (paths -> .arckit)
    OpenCode output:     .opencode/prompts/arckit.{name}.md   (paths -> .arckit)
    Extension output:    arckit-gemini/commands/arckit/{name}.toml (paths -> ~/.gemini/extensions/arckit)
    """
    codex_dir = ".codex/prompts"
    opencode_dir = ".opencode/commands"

    os.makedirs(codex_dir, exist_ok=True)
    os.makedirs(opencode_dir, exist_ok=True)
    os.makedirs(extension_dir, exist_ok=True)

    # Build agent map once (reads agent files once)
    agent_map = build_agent_map(agents_dir)

    codex_count = 0
    opencode_count = 0
    extension_count = 0

    for filename in sorted(os.listdir(commands_dir)):
        if not filename.endswith(".md"):
            continue

        command_path = os.path.join(commands_dir, filename)

        with open(command_path, "r") as f:
            command_content = f.read()

        # Extract description from command (always use command's description)
        description, command_prompt = extract_frontmatter_and_prompt(command_content)

        # For agent-delegating commands, use the full agent prompt
        # (Gemini and Codex don't support the Task/agent architecture)
        if filename in agent_map:
            agent_path, agent_prompt = agent_map[filename]
            prompt = agent_prompt
            source_label = f"{command_path} (agent: {agent_path})"
        else:
            prompt = command_prompt
            source_label = command_path

        # Derive base name (e.g., "requirements" from "requirements.md")
        base_name = filename.replace(".md", "")

        # --- Codex Markdown (project-local paths) ---
        codex_prompt = rewrite_paths_for_cli(prompt)
        codex_content = format_codex(description, codex_prompt)
        codex_filename = f"arckit.{base_name}.md"
        codex_path = os.path.join(codex_dir, codex_filename)
        with open(codex_path, "w") as f:
            f.write(codex_content)
        print(f"  Codex:      {source_label} -> {codex_path}")
        codex_count += 1

        # --- OpenCode Markdown (project-local paths) ---
        opencode_prompt = rewrite_paths_for_opencode(prompt)
        opencode_content = format_opencode(description, opencode_prompt)
        opencode_filename = f"arckit.{base_name}.md"
        opencode_path = os.path.join(opencode_dir, opencode_filename)
        with open(opencode_path, "w") as f:
            f.write(opencode_content)
        print(f"  OpenCode:   {source_label} -> {opencode_path}")
        opencode_count += 1

        # --- Gemini Extension TOML (extension install paths) ---
        ext_prompt = rewrite_paths_for_extension(prompt)
        ext_content = format_toml(description, ext_prompt)
        ext_path = os.path.join(extension_dir, f"{base_name}.toml")
        with open(ext_path, "w") as f:
            f.write(ext_content)
        print(f"  Extension:  {source_label} -> {ext_path}")
        extension_count += 1

    return codex_count, opencode_count, extension_count


def copy_extension_files(plugin_dir, extension_dir, opencode_dir="arckit-opencode"):
    """Copy supporting files from plugin to extension directories (Gemini & OpenCode).

    Copies templates, scripts, guides, and skills so the extensions are
    self-contained when published as separate repos.
    """
    copies = [
        ("templates", "templates"),
        ("scripts/bash", "scripts/bash"),
        ("docs/guides", "docs/guides"),
        ("skills", "skills"),
    ]

    # Copy to Gemini extension
    print(f"Copying to Gemini extension ({extension_dir})...")
    for src_rel, dst_rel in copies:
        src = os.path.join(plugin_dir, src_rel)
        dst = os.path.join(extension_dir, dst_rel)
        if os.path.isdir(src):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            file_count = sum(len(files) for _, _, files in os.walk(dst))
            print(f"  Copied: {src} -> {dst} ({file_count} files)")

    # Copy to OpenCode extension
    print(f"Copying to OpenCode extension ({opencode_dir})...")
    for src_rel, dst_rel in copies:
        src = os.path.join(plugin_dir, src_rel)
        dst = os.path.join(opencode_dir, dst_rel)
        if os.path.isdir(src):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            file_count = sum(len(files) for _, _, files in os.walk(dst))
            print(f"  Copied: {src} -> {dst} ({file_count} files)")


if __name__ == "__main__":
    claude_dir = "arckit-plugin/commands/"
    agents_dir = "arckit-plugin/agents/"
    plugin_dir = "arckit-plugin"
    extension_dir = "arckit-gemini"

    opencode_ext_dir = "arckit-opencode"

    print(
        "Converting plugin commands to Codex, OpenCode, and Gemini extension formats..."
    )
    print()
    print(f"Source:       {claude_dir}")
    print(f"Agents:       {agents_dir}")
    print(f"Gemini Ext:   {extension_dir}/")
    print(f"OpenCode Ext: {opencode_ext_dir}/")
    print()

    codex_count, opencode_count, ext_count = convert(
        claude_dir,
        agents_dir,
        extension_dir=os.path.join(extension_dir, "commands/arckit"),
    )

    # Also copy generated OpenCode commands to the extension directory
    # The convert() function generates .opencode/commands (for CLI usage)
    # We need to copy these to arckit-opencode/commands (for extension usage)
    # OpenCode format for extension is arckit.command.md directly in commands/
    opencode_ext_commands_dir = os.path.join(opencode_ext_dir, "commands")
    opencode_ext_agents_dir = os.path.join(opencode_ext_dir, "agents")
    os.makedirs(opencode_ext_commands_dir, exist_ok=True)
    os.makedirs(opencode_ext_agents_dir, exist_ok=True)

    cli_opencode_dir = ".opencode/commands"
    cli_opencode_agents_dir = ".opencode/agents"
    os.makedirs(cli_opencode_agents_dir, exist_ok=True)

    # Copy agents to .opencode/agents (for CLI) and arckit-opencode/agents (for extension)
    # We copy them as-is from arckit-plugin/agents
    if os.path.isdir(agents_dir):
        for filename in os.listdir(agents_dir):
            if filename.endswith(".md"):
                src_agent = os.path.join(agents_dir, filename)
                # Copy to CLI dir
                shutil.copy2(src_agent, os.path.join(cli_opencode_agents_dir, filename))
                # Copy to Extension dir
                shutil.copy2(src_agent, os.path.join(opencode_ext_agents_dir, filename))
        print(
            f"  Copied agents to {cli_opencode_agents_dir} and {opencode_ext_agents_dir}"
        )

    if os.path.isdir(cli_opencode_dir):
        for filename in os.listdir(cli_opencode_dir):
            if filename.endswith(".md"):
                shutil.copy2(
                    os.path.join(cli_opencode_dir, filename),
                    os.path.join(opencode_ext_commands_dir, filename),
                )
        print(
            f"  Copied {opencode_count} commands to OpenCode extension: {opencode_ext_commands_dir}"
        )

    print()
    print("Copying extension supporting files...")
    copy_extension_files(plugin_dir, extension_dir, opencode_ext_dir)

    print()
    print(
        f"Generated {codex_count} Codex + {opencode_count} OpenCode + {ext_count} Extension = {codex_count + opencode_count + ext_count} total files."
    )
