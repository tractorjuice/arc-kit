#!/usr/bin/env python3
"""
Convert remaining ArcKit Claude agents to Mistral Vibe TOML format.
"""

import re
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
CLAUDE_AGENTS = REPO_ROOT / "plugins" / "arckit-claude" / "agents"
VIBE_AGENTS = REPO_ROOT / "extensions" / "arckit-vibe" / "agents"

# Agents to convert (including reader/writer variants for subagent dispatch)
AGENTS_TO_CONVERT = [
    "arckit-research.md",
    "arckit-aws-research.md",
    "arckit-azure-research.md",
    "arckit-gcp-research.md",
    "arckit-datascout.md",
    "arckit-datascout-reader.md",
    "arckit-datascout-writer.md",
    "arckit-framework.md",
    "arckit-gov-code-search.md",
    "arckit-gov-landscape.md",
    "arckit-gov-reuse.md",
    "arckit-gov-reuse-reader.md",
    "arckit-gov-reuse-writer.md",
    "arckit-grants.md",
    "arckit-grants-reader.md",
    "arckit-grants-writer.md",
    "arckit-tenders-reader.md",
    "arckit-tenders-writer.md",
    "arckit-competitors-writer.md",
]

# Tool mapping
CLAUDE_TO_VIBE_TOOLS = {
    "Read": "read_file",
    "Glob": "glob",
    "Grep": "grep",
    "Write": "write_file",
    "Bash": "bash",
    "TodoWrite": "todo",
    "WebSearch": "web_search",
    "WebFetch": "web_fetch",
}


def extract_frontmatter(content):
    """Extract YAML frontmatter."""
    if not content.startswith("---"):
        return {}
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}
    try:
        return yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError:
        return {}


def extract_body(content):
    """Extract body after frontmatter."""
    if not content.startswith("---"):
        return content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return content
    return parts[2].strip()


def convert_agent(agent_filename):
    """Convert a single agent file to TOML."""
    agent_path = CLAUDE_AGENTS / agent_filename
    
    if not agent_path.exists():
        print(f"  WARNING: {agent_filename} not found")
        return False
    
    with open(agent_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    frontmatter = extract_frontmatter(content)
    body = extract_body(content)
    
    # Extract fields
    name = frontmatter.get("name", agent_filename.replace(".md", ""))
    description = frontmatter.get("description", "")
    max_turns = frontmatter.get("maxTurns", 50)
    tools = frontmatter.get("tools", [])
    effort = frontmatter.get("effort", "high")
    model = frontmatter.get("model", "inherit")
    
    # Map tools to Vibe equivalents
    vibe_tools = []
    for tool in tools:
        if isinstance(tool, dict):
            continue  # Skip dict entries
        if tool in CLAUDE_TO_VIBE_TOOLS:
            vibe_tools.append(f'"{CLAUDE_TO_VIBE_TOOLS[tool]}"')
        elif tool.startswith("mcp__"):
            tool_name = tool.replace("mcp__plugin_arckit_", "mcp_")
            vibe_tools.append(f'"{tool_name}"')
        else:
            vibe_tools.append(f'"{tool.lower()}"')
    
    # Format tools list
    tools_str = "[" + ", ".join(vibe_tools) + "]"
    
    # Build TOML
    toml = f"""# ArcKit {name.replace('-', ' ').title()} Agent
# Derived from {agent_path}
# Part of the ArcKit Enterprise Architecture Governance Harness

agent_type = "subagent"
display_name = "ArcKit {name.replace('-', ' ').title()}"

"""
    
    # Handle description - might have quotes
    if description:
        # Escape triple quotes in description
        description_clean = description.replace("'''", "'")
        toml += f'description = """{description_clean}"""\n\n'
    else:
        toml += "description = \"\"\n\n"
    
    toml += f"""safety = "safe"
max_turns = {max_turns}
effort = "{effort}"

# Tool permissions
enabled_tools = {tools_str}
disabled_tools = []

# Model configuration
"""
    
    if model and model != "inherit":
        toml += f'model = "{model}"\n'
    else:
        toml += 'model = "mistral-large-2"\n'
    
    toml += "\n# System prompt\n"
    toml += 'system_prompt = """\n'
    
    # Add body (prompt content)
    # Clean up problematic characters
    body_clean = body.replace("```", "`` ` ``")
    toml += body_clean + '\n"""\n'
    
    toml += f"""
[metadata]
source = "{agent_path}"
version = "5.13.1"
tags = ["arckit", "{name.replace('-', ' ')}"]
"""
    
    # Write to file
    output_name = name + ".toml"
    output_path = VIBE_AGENTS / output_name
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(toml)
    
    return True


def main():
    """Main conversion function."""
    print("Converting ArcKit agents to Mistral Vibe TOML...")
    print(f"Source: {CLAUDE_AGENTS}")
    print(f"Target: {VIBE_AGENTS}")
    print()
    
    success_count = 0
    for agent_file in AGENTS_TO_CONVERT:
        
        if convert_agent(agent_file):
            output_name = agent_file.replace(".md", ".toml")
            print(f"  ✓ Created: {output_name}")
            success_count += 1
        else:
            print(f"  ✗ Failed: {agent_file}")
    
    print()
    print(f"Successfully converted {success_count}/{len(AGENTS_TO_CONVERT)} agents")
    print()
    
    # List all agents
    agents = sorted(VIBE_AGENTS.glob("*.toml"))
    print(f"Total agents in extension: {len(agents)}")
    for agent in agents:
        print(f"  - {agent.name}")


if __name__ == "__main__":
    main()
