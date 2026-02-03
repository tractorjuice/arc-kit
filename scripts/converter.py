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


def convert_claude_to_gemini():
    claude_dir = '.claude/commands/'
    agents_dir = '.claude/agents/'
    gemini_dir = '.gemini/commands/arckit'

    if not os.path.exists(gemini_dir):
        os.makedirs(gemini_dir)

    # Build map of commands that delegate to agents
    agent_map = build_agent_map(agents_dir)

    for filename in os.listdir(claude_dir):
        if not filename.endswith('.md'):
            continue

        claude_path = os.path.join(claude_dir, filename)

        with open(claude_path, 'r') as f:
            command_content = f.read()

        # Extract description from the command file (always use command description)
        description, command_prompt = extract_frontmatter_and_prompt(command_content)

        # For agent-delegating commands, use the agent file for the prompt body
        # The command file is a thin wrapper; Gemini needs the full instructions
        if filename in agent_map:
            agent_path = agent_map[filename]
            with open(agent_path, 'r') as f:
                agent_content = f.read()
            prompt = extract_agent_prompt(agent_content)
            source_label = f'{claude_path} (agent: {agent_path})'
        else:
            prompt = command_prompt
            source_label = claude_path

        toml_content = format_toml(description, prompt)

        # Create new filename: arckit.foo.md -> foo.toml
        new_filename = filename.replace('arckit.', '').replace('.md', '.toml')
        gemini_path = os.path.join(gemini_dir, new_filename)

        with open(gemini_path, 'w') as f:
            f.write(toml_content)
        print(f"Converted {source_label} to {gemini_path}")


if __name__ == '__main__':
    convert_claude_to_gemini()
