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
        if filename.startswith('arckit-') and filename.endswith('.md'):
            # arckit-research.md -> research.md
            name = filename.replace('arckit-', '', 1).replace('.md', '')
            command_filename = f'{name}.md'
            agent_path = os.path.join(agents_dir, filename)
            with open(agent_path, 'r') as f:
                agent_content = f.read()
            agent_prompt = extract_agent_prompt(agent_content)
            agent_map[command_filename] = (agent_path, agent_prompt)
    return agent_map


def extract_frontmatter_and_prompt(content):
    """Extract YAML frontmatter description and prompt body from markdown."""
    description = ''
    prompt = content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) > 1:
            frontmatter = parts[1]
            prompt = parts[2].strip()
            desc_match = re.search(r'description:\s*(.*)', frontmatter)
            if desc_match:
                description = desc_match.group(1).strip()
                # Remove surrounding quotes if present (from YAML)
                if description.startswith('"') and description.endswith('"'):
                    description = description[1:-1]
                elif description.startswith("'") and description.endswith("'"):
                    description = description[1:-1]
                # Handle multi-line YAML (e.g. description: |) by taking
                # only the first non-empty content line
                if description in ('|', '>'):
                    # Multi-line block — skip it, we'll use command description
                    description = ''
    return description, prompt


def extract_agent_prompt(content):
    """Extract prompt body from agent file, stripping agent-specific frontmatter."""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) > 2:
            return parts[2].strip()
    return content


def rewrite_paths_for_cli(prompt):
    """Rewrite ${CLAUDE_PLUGIN_ROOT} to project-local .arckit paths for CLI distribution.

    CLI projects (created by arckit init) have templates and scripts at .arckit/.
    """
    return prompt.replace('${CLAUDE_PLUGIN_ROOT}', '.arckit')


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
    result = prompt.replace('${CLAUDE_PLUGIN_ROOT}', '~/.gemini/extensions/arckit')

    # Rewrite "Read `~/.gemini/extensions/arckit/..." instructions to use cat
    result = re.sub(
        r'Read `(~/.gemini/extensions/arckit/[^`]+)`',
        r'Run `cat \1` to read the file',
        result,
    )

    # Prepend the file access instruction block
    result = EXTENSION_FILE_ACCESS_BLOCK + result

    return result


def format_toml(description, prompt):
    """Format description and prompt into Gemini TOML content."""
    # Escape for TOML triple-quoted strings
    prompt_escaped = prompt.replace('\\', '\\\\').replace('"', '\\"')
    prompt_formatted = '"""\n' + prompt_escaped + '\n"""'

    # Replace $ARGUMENTS with {{args}}
    prompt_formatted = prompt_formatted.replace('$ARGUMENTS', '{{args}}')

    description_formatted = '"""\n' + description + '\n"""'

    return f'description = {description_formatted}\nprompt = {prompt_formatted}\n'


def format_codex(description, prompt):
    """Format description and prompt into Codex markdown with YAML frontmatter."""
    # Quote description to handle YAML-special characters (: # [ { * &)
    escaped = description.replace('\\', '\\\\').replace('"', '\\"')
    return f'---\ndescription: "{escaped}"\n---\n\n{prompt}\n'


def convert(commands_dir, agents_dir, extension_dir='arckit-gemini/commands/arckit'):
    """Convert plugin commands to Gemini TOML, Codex Markdown, and Gemini extension formats.

    Reads each plugin command once, resolves agent prompts once, then
    writes all three output formats with appropriate path rewriting.

    Plugin command files are named {name}.md (e.g., requirements.md).
    Gemini CLI output:   .gemini/commands/arckit/{name}.toml  (paths -> .arckit)
    Codex output:        .codex/prompts/arckit.{name}.md      (paths -> .arckit)
    Extension output:    arckit-gemini/commands/arckit/{name}.toml (paths -> ~/.gemini/extensions/arckit)
    """
    gemini_dir = '.gemini/commands/arckit'
    codex_dir = '.codex/prompts'

    os.makedirs(gemini_dir, exist_ok=True)
    os.makedirs(codex_dir, exist_ok=True)
    os.makedirs(extension_dir, exist_ok=True)

    # Build agent map once (reads agent files once)
    agent_map = build_agent_map(agents_dir)

    gemini_count = 0
    codex_count = 0
    extension_count = 0

    for filename in sorted(os.listdir(commands_dir)):
        if not filename.endswith('.md'):
            continue

        command_path = os.path.join(commands_dir, filename)

        with open(command_path, 'r') as f:
            command_content = f.read()

        # Extract description from command (always use command's description)
        description, command_prompt = extract_frontmatter_and_prompt(command_content)

        # For agent-delegating commands, use the full agent prompt
        # (Gemini and Codex don't support the Task/agent architecture)
        if filename in agent_map:
            agent_path, agent_prompt = agent_map[filename]
            prompt = agent_prompt
            source_label = f'{command_path} (agent: {agent_path})'
        else:
            prompt = command_prompt
            source_label = command_path

        # Derive base name (e.g., "requirements" from "requirements.md")
        base_name = filename.replace('.md', '')

        # --- Gemini CLI TOML (project-local paths) ---
        cli_prompt = rewrite_paths_for_cli(prompt)
        toml_content = format_toml(description, cli_prompt)
        gemini_filename = f'{base_name}.toml'
        gemini_path = os.path.join(gemini_dir, gemini_filename)
        with open(gemini_path, 'w') as f:
            f.write(toml_content)
        print(f"  Gemini CLI: {source_label} -> {gemini_path}")
        gemini_count += 1

        # --- Codex Markdown (project-local paths) ---
        codex_prompt = rewrite_paths_for_cli(prompt)
        codex_content = format_codex(description, codex_prompt)
        codex_filename = f'arckit.{base_name}.md'
        codex_path = os.path.join(codex_dir, codex_filename)
        with open(codex_path, 'w') as f:
            f.write(codex_content)
        print(f"  Codex:      {source_label} -> {codex_path}")
        codex_count += 1

        # --- Gemini Extension TOML (extension install paths) ---
        ext_prompt = rewrite_paths_for_extension(prompt)
        ext_content = format_toml(description, ext_prompt)
        ext_path = os.path.join(extension_dir, f'{base_name}.toml')
        with open(ext_path, 'w') as f:
            f.write(ext_content)
        print(f"  Extension:  {source_label} -> {ext_path}")
        extension_count += 1

    return gemini_count, codex_count, extension_count


def copy_extension_files(plugin_dir, extension_dir):
    """Copy supporting files from plugin to extension directory.

    Copies templates, scripts, guides, and skills so the extension is
    self-contained when published as a separate repo.
    """
    copies = [
        ('templates', 'templates'),
        ('scripts/bash', 'scripts/bash'),
        ('docs/guides', 'docs/guides'),
        ('skills', 'skills'),
    ]
    for src_rel, dst_rel in copies:
        src = os.path.join(plugin_dir, src_rel)
        dst = os.path.join(extension_dir, dst_rel)
        if os.path.isdir(src):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            file_count = sum(len(files) for _, _, files in os.walk(dst))
            print(f"  Copied: {src} -> {dst} ({file_count} files)")


if __name__ == '__main__':
    claude_dir = 'arckit-plugin/commands/'
    agents_dir = 'arckit-plugin/agents/'
    plugin_dir = 'arckit-plugin'
    extension_dir = 'arckit-gemini'

    print("Converting plugin commands to Gemini CLI, Codex, and Gemini extension formats...")
    print()
    print(f"Source:    {claude_dir}")
    print(f"Agents:    {agents_dir}")
    print(f"Extension: {extension_dir}/")
    print()

    gemini_count, codex_count, ext_count = convert(
        claude_dir, agents_dir,
        extension_dir=os.path.join(extension_dir, 'commands/arckit'),
    )

    print()
    print("Copying extension supporting files...")
    copy_extension_files(plugin_dir, extension_dir)

    print()
    print(f"Generated {gemini_count} Gemini CLI + {codex_count} Codex + {ext_count} Extension = {gemini_count + codex_count + ext_count} total files.")
