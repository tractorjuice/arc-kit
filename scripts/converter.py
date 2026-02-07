import os
import re


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


def convert(commands_dir, agents_dir):
    """Convert plugin commands to Gemini TOML and Codex Markdown formats.

    Reads each plugin command once, resolves agent prompts once, then
    writes both Gemini and Codex output files.

    Plugin command files are named {name}.md (e.g., requirements.md).
    Gemini output: .gemini/commands/arckit/{name}.toml
    Codex output:  .codex/prompts/arckit.{name}.md
    """
    gemini_dir = '.gemini/commands/arckit'
    codex_dir = '.codex/prompts'

    os.makedirs(gemini_dir, exist_ok=True)
    os.makedirs(codex_dir, exist_ok=True)

    # Build agent map once (reads agent files once)
    agent_map = build_agent_map(agents_dir)

    gemini_count = 0
    codex_count = 0

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

        # --- Gemini TOML ---
        toml_content = format_toml(description, prompt)
        gemini_filename = f'{base_name}.toml'
        gemini_path = os.path.join(gemini_dir, gemini_filename)
        with open(gemini_path, 'w') as f:
            f.write(toml_content)
        print(f"  Gemini: {source_label} -> {gemini_path}")
        gemini_count += 1

        # --- Codex Markdown ---
        codex_content = format_codex(description, prompt)
        codex_filename = f'arckit.{base_name}.md'
        codex_path = os.path.join(codex_dir, codex_filename)
        with open(codex_path, 'w') as f:
            f.write(codex_content)
        print(f"  Codex:  {source_label} -> {codex_path}")
        codex_count += 1

    return gemini_count, codex_count


if __name__ == '__main__':
    claude_dir = 'arckit-plugin/commands/'
    agents_dir = 'arckit-plugin/agents/'

    print("Converting plugin commands to Gemini and Codex formats...")
    print()
    print(f"Source: {claude_dir}")
    print(f"Agents: {agents_dir}")
    print()

    gemini_count, codex_count = convert(claude_dir, agents_dir)

    print()
    print(f"Generated {gemini_count} Gemini TOML + {codex_count} Codex Markdown = {gemini_count + codex_count} total files.")
