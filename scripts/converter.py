import os
import re


def build_agent_map(agents_dir):
    """Build a map from command name to agent file path.

    Agent files are named arckit-{name}.md. The corresponding command
    is arckit.{name}.md. Returns {command_filename: agent_path}.
    """
    agent_map = {}
    if not os.path.isdir(agents_dir):
        return agent_map
    for filename in os.listdir(agents_dir):
        if filename.startswith('arckit-') and filename.endswith('.md'):
            # arckit-research.md -> arckit.research.md
            name = filename.replace('arckit-', '', 1).replace('.md', '')
            command_filename = f'arckit.{name}.md'
            agent_map[command_filename] = os.path.join(agents_dir, filename)
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
    return f'---\ndescription: {description}\n---\n\n{prompt}\n'


def get_prompt_for_target(filename, command_prompt, agent_map):
    """Get the appropriate prompt for non-Claude targets.

    For agent-delegating commands, returns the full agent prompt (since
    Gemini and Codex don't support the Task/agent architecture).
    For regular commands, returns the command prompt as-is.

    Returns (prompt, source_label).
    """
    claude_path = os.path.join('.claude/commands/', filename)
    if filename in agent_map:
        agent_path = agent_map[filename]
        with open(agent_path, 'r') as f:
            agent_content = f.read()
        prompt = extract_agent_prompt(agent_content)
        source_label = f'{claude_path} (agent: {agent_path})'
    else:
        prompt = command_prompt
        source_label = claude_path
    return prompt, source_label


def generate_gemini(claude_dir, agents_dir):
    """Generate Gemini TOML commands from Claude source commands."""
    gemini_dir = '.gemini/commands/arckit'

    if not os.path.exists(gemini_dir):
        os.makedirs(gemini_dir)

    agent_map = build_agent_map(agents_dir)
    count = 0

    for filename in sorted(os.listdir(claude_dir)):
        if not filename.endswith('.md'):
            continue

        claude_path = os.path.join(claude_dir, filename)

        with open(claude_path, 'r') as f:
            command_content = f.read()

        description, command_prompt = extract_frontmatter_and_prompt(command_content)
        prompt, source_label = get_prompt_for_target(filename, command_prompt, agent_map)

        toml_content = format_toml(description, prompt)

        # Create new filename: arckit.foo.md -> foo.toml
        new_filename = filename.replace('arckit.', '').replace('.md', '.toml')
        gemini_path = os.path.join(gemini_dir, new_filename)

        with open(gemini_path, 'w') as f:
            f.write(toml_content)
        print(f"  Gemini: {source_label} -> {gemini_path}")
        count += 1

    return count


def generate_codex(claude_dir, agents_dir):
    """Generate Codex markdown prompts from Claude source commands."""
    codex_dir = '.codex/prompts'

    if not os.path.exists(codex_dir):
        os.makedirs(codex_dir)

    agent_map = build_agent_map(agents_dir)
    count = 0

    for filename in sorted(os.listdir(claude_dir)):
        if not filename.endswith('.md'):
            continue

        claude_path = os.path.join(claude_dir, filename)

        with open(claude_path, 'r') as f:
            command_content = f.read()

        description, command_prompt = extract_frontmatter_and_prompt(command_content)
        prompt, source_label = get_prompt_for_target(filename, command_prompt, agent_map)

        codex_content = format_codex(description, prompt)

        # Output filename: arckit.foo.md (same prefix as Claude, root level)
        codex_path = os.path.join(codex_dir, filename)

        with open(codex_path, 'w') as f:
            f.write(codex_content)
        print(f"  Codex:  {source_label} -> {codex_path}")
        count += 1

    return count


if __name__ == '__main__':
    claude_dir = '.claude/commands/'
    agents_dir = '.claude/agents/'

    print("Converting Claude commands to Gemini and Codex formats...")
    print()

    print(f"Source: {claude_dir}")
    print(f"Agents: {agents_dir}")
    print()

    print("--- Gemini TOML ---")
    gemini_count = generate_gemini(claude_dir, agents_dir)
    print(f"Generated {gemini_count} Gemini TOML files")
    print()

    print("--- Codex Markdown ---")
    codex_count = generate_codex(claude_dir, agents_dir)
    print(f"Generated {codex_count} Codex prompt files")
    print()

    print(f"Done. {gemini_count} Gemini + {codex_count} Codex = {gemini_count + codex_count} total files.")
