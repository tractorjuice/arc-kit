#!/usr/bin/env python3
"""
Simple script to convert ArcKit Claude commands to Mistral Vibe skills.
Focuses on core commands from plugins/arckit-claude/commands/ only.
"""

import os
import re
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
CLAUDE_COMMANDS = REPO_ROOT / "plugins" / "arckit-claude" / "commands"
UAE_COMMANDS = REPO_ROOT / "plugins" / "arckit-uae" / "commands"
FR_COMMANDS = REPO_ROOT / "plugins" / "arckit-fr" / "commands"
VIBE_SKILLS = REPO_ROOT / "extensions" / "arckit-vibe" / "skills"

# Commands to skip
SKIP_COMMANDS = {
    "build.md",  # Claude-only
}

# Commands already converted
ALREADY_CONVERTED = {
    "principles.md",
    "requirements.md",
}

# Core commands to convert in this batch (high-value, commonly used)
BATCH_1_COMMANDS = [
    "stakeholders.md",
    "wardley.md", 
    "diagram.md",
    "data-model.md",
    "adr.md",
    "risk.md",
    "conformance.md",
    "backlog.md",
    "roadmap.md",
]

# Batch 2 - More commands
BATCH_2_COMMANDS = [
    "evaluate.md",
    "sow.md",
    "dfd.md",
    "dos.md",
    "dpia.md",
    "dld-review.md",
    "devops.md",
    "finops.md",
    "story.md",
    "analyze.md",
]

# Batch 3 - Research and vendor commands
BATCH_3_COMMANDS = [
    "research.md",
    "aws-research.md",
    "azure-research.md",
    "gcp-research.md",
    "build.md",  # Will be skipped as Claude-only
    "framework.md",
    "glossary.md",
    "customize.md",
    "pages.md",
    "gcloud-clarify.md",
]

# Batch 4 - More commands
BATCH_4_COMMANDS = [
    "gcloud-search.md",
    "gov-code-search.md",
    "gov-landscape.md",
    "gov-reuse.md",
    "grants.md",
    "competitors.md",
    "datascout.md",
    "tenders.md",
    "health.md",
]

# Batch 5 - Remaining core commands
BATCH_5_COMMANDS = [
    "ai-playbook.md",
    "atrs.md",
    "data-mesh-contract.md",
    "graph-report.md",
    "hld-review.md",
    "impact.md",
    "init.md",
    "jsp-936.md",
    "maturity-model.md",
    "mlops.md",
]

# Batch 6 - More remaining
BATCH_6_COMMANDS = [
    "mod-secure.md",
    "navigator.md",
    "operationalize.md",
    "plan.md",
    "platform-design.md",
    "presentation.md",
    "principles-compliance.md",
    "score.md",
    "search.md",
    "secure.md",
]

# Batch 7 - Final remaining
BATCH_7_COMMANDS = [
    "service-assessment.md",
    "servicenow.md",
    "sobc.md",
    "start.md",
    "strategy.md",
    "tcop.md",
    "template-builder.md",
    "traceability.md",
    "trello.md",
]

# Batch 8 - Wardley variants
BATCH_8_COMMANDS = [
    "wardley.climate.md",
    "wardley.doctrine.md",
    "wardley.gameplay.md",
    "wardley.value-chain.md",
]

# Batch 9 - UAE Overlay commands
BATCH_9_COMMANDS = [
    "uae-ai-autonomy-tier.md",
    "uae-ai-charter.md",
    "uae-classification.md",
    "uae-cloud-residency.md",
    "uae-data-sharing.md",
    "uae-digital-records.md",
    "uae-ias.md",
    "uae-pdpl.md",
    "uae-priorities-alignment.md",
    "uae-procurement.md",
    "uae-uaepass.md",
    "uae-zero-bureaucracy.md",
]

# Batch 10 - France Overlay commands
BATCH_10_COMMANDS = [
    "fr-algorithme-public.md",
    "fr-anssi-carto.md",
    "fr-anssi.md",
    "fr-audit.md",
    "fr-code-reuse.md",
    "fr-dinum.md",
    "fr-dr.md",
    "fr-ebios.md",
    "fr-marche-public.md",
    "fr-pdpl.md",  # Note: This doesn't exist, but keeping for structure
    "fr-pssi.md",
    "fr-rgpd.md",
]


def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown."""
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


def rewrite_claude_to_vibe(content):
    """Rewrite Claude-specific references to Vibe equivalents."""
    result = content
    
    # Replace plugin root references
    result = result.replace("${CLAUDE_PLUGIN_ROOT}", "${VIBE_EXTENSION_ROOT}")
    result = result.replace("${CLAUDE_PLUGIN_ROOT}/templates/", ".arckit/templates/")
    result = result.replace("${CLAUDE_PLUGIN_ROOT}/schemas/", ".arckit/schemas/")
    result = result.replace("${CLAUDE_PLUGIN_ROOT}/references/", "${VIBE_EXTENSION_ROOT}/references/")
    
    # Replace argument placeholder
    result = result.replace("$ARGUMENTS", "${args}")
    
    # Replace user_config references
    result = result.replace("${user_config.", "$")
    
    # Replace hook-dependent content
    result = re.sub(
        r"> \*\*Note\*\*: The ArcKit Project Context hook has already detected.*?no need to scan directories manually\.",
        "> **Note**: Use glob and bash tools to scan for existing artifacts.",
        result,
        flags=re.DOTALL
    )
    
    result = re.sub(
        r"The ArcKit Project Context hook has already detected.*?no need to scan directories manually\.",
        "Scan the workspace for existing artifacts using glob and bash tools",
        result,
        flags=re.DOTALL
    )
    
    # Replace tool references (Read -> read_file)
    # Skip for now - complex to handle inline
    
    return result


def create_vibe_skill(name, description, body):
    """Create a Vibe skill markdown file."""
    display_name = name.replace("-", " ").title()
    
    frontmatter = f"""---
name: arckit-{name}
display_name: ArcKit {display_name}
description: {description}
tags: [arckit, architecture, governance]
---

"""
    
    # Add Vibe-specific notes
    vibe_notes = """

## Vibe-Specific Notes

- Use `read_file` tool to read templates and existing documents
- Use `glob` tool to scan for artifacts: `glob pattern="projects/**/ARC-*.md"`
- Use `bash` tool for shell commands
- Use `write_file` tool to create new files
- Template files are in `.arckit/templates/` or `.arckit/templates-custom/`
- Extension files are in `${VIBE_EXTENSION_ROOT}/`
"""
    
    return frontmatter + body + vibe_notes


def convert_command(filename, source_dir=CLAUDE_COMMANDS):
    """Convert a single command file to a Vibe skill."""
    command_path = source_dir / filename
    
    if not command_path.exists():
        print(f"  WARNING: {filename} not found in {source_dir}, skipping")
        return False
    
    with open(command_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    frontmatter = extract_frontmatter(content)
    body = extract_body(content)
    
    description = frontmatter.get("description", "")
    name = filename.replace(".md", "")
    
    # Rewrite Claude-specific content
    body = rewrite_claude_to_vibe(body)
    
    # Create skill content
    skill_content = create_vibe_skill(name, description, body)
    
    # Write to file
    skill_path = VIBE_SKILLS / f"arckit-{name}.md"
    with open(skill_path, "w", encoding="utf-8") as f:
        f.write(skill_content)
    
    return True


def main():
    """Main conversion function."""
    print("Converting ArcKit commands to Mistral Vibe skills...")
    print(f"Source: {CLAUDE_COMMANDS}")
    print(f"Target: {VIBE_SKILLS}")
    print()
    
    # Ensure output directory exists
    os.makedirs(VIBE_SKILLS, exist_ok=True)
    
    # Convert batch 1
    print(f"Converting Batch 1 ({len(BATCH_1_COMMANDS)} commands)...")
    success_count = 0
    for filename in BATCH_1_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            success_count += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 2
    print(f"Converting Batch 2 ({len(BATCH_2_COMMANDS)} commands)...")
    batch2_success = 0
    for filename in BATCH_2_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch2_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 3
    print(f"Converting Batch 3 ({len(BATCH_3_COMMANDS)} commands)...")
    batch3_success = 0
    for filename in BATCH_3_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch3_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 4
    print(f"Converting Batch 4 ({len(BATCH_4_COMMANDS)} commands)...")
    batch4_success = 0
    for filename in BATCH_4_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch4_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 5
    print(f"Converting Batch 5 ({len(BATCH_5_COMMANDS)} commands)...")
    batch5_success = 0
    for filename in BATCH_5_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch5_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 6
    print(f"Converting Batch 6 ({len(BATCH_6_COMMANDS)} commands)...")
    batch6_success = 0
    for filename in BATCH_6_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch6_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 7
    print(f"Converting Batch 7 ({len(BATCH_7_COMMANDS)} commands)...")
    batch7_success = 0
    for filename in BATCH_7_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch7_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 8
    print(f"Converting Batch 8 ({len(BATCH_8_COMMANDS)} commands)...")
    batch8_success = 0
    for filename in BATCH_8_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch8_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    total_converted = success_count + batch2_success + batch3_success + batch4_success + batch5_success + batch6_success + batch7_success + batch8_success
    total_commands = len(BATCH_1_COMMANDS) + len(BATCH_2_COMMANDS) + len(BATCH_3_COMMANDS) + len(BATCH_4_COMMANDS) + len(BATCH_5_COMMANDS) + len(BATCH_6_COMMANDS) + len(BATCH_7_COMMANDS) + len(BATCH_8_COMMANDS)
    # Convert batch 9 - UAE Overlay
    print(f"Converting Batch 9 - UAE Overlay ({len(BATCH_9_COMMANDS)} commands)...")
    batch9_success = 0
    for filename in BATCH_9_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename, UAE_COMMANDS):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch9_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    # Convert batch 10 - France Overlay
    print(f"Converting Batch 10 - France Overlay ({len(BATCH_10_COMMANDS)} commands)...")
    batch10_success = 0
    for filename in BATCH_10_COMMANDS:
        if filename in SKIP_COMMANDS:
            print(f"  Skipped (Claude-only): {filename}")
            continue
        if filename in ALREADY_CONVERTED:
            print(f"  Skipped (already converted): {filename}")
            continue
        
        if convert_command(filename, FR_COMMANDS):
            print(f"  ✓ Created: arckit-{filename.replace('.md', '')}.md")
            batch10_success += 1
        else:
            print(f"  ✗ Failed: {filename}")
    
    print()
    
    total_converted = success_count + batch2_success + batch3_success + batch4_success + batch5_success + batch6_success + batch7_success + batch8_success + batch9_success + batch10_success
    total_commands = len(BATCH_1_COMMANDS) + len(BATCH_2_COMMANDS) + len(BATCH_3_COMMANDS) + len(BATCH_4_COMMANDS) + len(BATCH_5_COMMANDS) + len(BATCH_6_COMMANDS) + len(BATCH_7_COMMANDS) + len(BATCH_8_COMMANDS) + len(BATCH_9_COMMANDS) + len(BATCH_10_COMMANDS)
    print(f"Successfully converted {total_converted}/{total_commands} commands")
    print()
    
    # List all skills
    skills = sorted(VIBE_SKILLS.glob("arckit-*.md"))
    print(f"Total skills in extension: {len(skills)}")
    for skill in skills:
        print(f"  - {skill.name}")


if __name__ == "__main__":
    main()
