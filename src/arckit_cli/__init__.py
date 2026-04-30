#!/usr/bin/env python3
"""
ArcKit CLI - Enterprise Architecture Governance & Vendor Procurement Toolkit

A toolkit for enterprise architects to manage:
- Architecture principles and governance
- Requirements documentation
- Vendor RFP/SOW generation
- Vendor evaluation and selection
- Design review processes (HLD/DLD)
- Requirements traceability
"""

import os
import subprocess
import sys
import zipfile
import tempfile
import shutil
from pathlib import Path
from typing import Optional

import typer
import httpx
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.align import Align

# For cross-platform keyboard input
import readchar
import ssl
import truststore
import platformdirs

ssl_context = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
client = httpx.Client(verify=ssl_context)

# Agent configuration for ArcKit
# Note: Claude Code support has moved to the ArcKit plugin (arckit-claude/).
# Gemini CLI support has moved to the ArcKit Gemini extension (arckit-gemini/).
# The CLI now only supports Codex.
AGENT_CONFIG = {
    "codex": {
        "name": "OpenAI Codex CLI",
        "folder": ".codex/",
        "install_url": "https://developers.openai.com/codex/cli/",
        "requires_cli": True,
    },
    "opencode": {
        "name": "OpenCode CLI",
        "folder": ".opencode/",
        "install_url": "https://opencode.net/cli/",
        "requires_cli": True,
    },
    "copilot": {
        "name": "GitHub Copilot",
        "folder": ".github/",
        "install_url": "https://github.com/features/copilot",
        "requires_cli": False,
    },
}

BANNER = """
 █████╗ ██████╗  ██████╗██╗  ██╗██╗████████╗
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║╚══██╔══╝
███████║██████╔╝██║     █████╔╝ ██║   ██║
██╔══██║██╔══██╗██║     ██╔═██╗ ██║   ██║
██║  ██║██║  ██║╚██████╗██║  ██╗██║   ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝
"""

TAGLINE = "Enterprise Architecture Governance & Vendor Procurement"

console = Console()

app = typer.Typer(
    name="arckit",
    help="Enterprise Architecture Governance & Vendor Procurement Toolkit",
    add_completion=False,
)


def show_banner():
    """Display the ASCII art banner."""
    banner_lines = BANNER.strip().split("\n")
    colors = ["bright_blue", "blue", "cyan", "bright_cyan", "white", "bright_white"]

    styled_banner = Text()
    for i, line in enumerate(banner_lines):
        color = colors[i % len(colors)]
        styled_banner.append(line + "\n", style=color)

    console.print(Align.center(styled_banner))
    console.print(Align.center(Text(TAGLINE, style="italic bright_yellow")))
    console.print()


def check_tool(tool: str) -> bool:
    """Check if a tool is installed."""
    return shutil.which(tool) is not None


def is_git_repo(path: Path = None) -> bool:
    """Check if the specified path is inside a git repository."""
    if path is None:
        path = Path.cwd()

    if not path.is_dir():
        return False

    try:
        subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            check=True,
            capture_output=True,
            cwd=path,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def init_git_repo(project_path: Path) -> bool:
    """Initialize a git repository in the specified path."""
    try:
        original_cwd = Path.cwd()
        os.chdir(project_path)
        console.print("[cyan]Initializing git repository...[/cyan]")
        subprocess.run(["git", "init"], check=True, capture_output=True, text=True)
        subprocess.run(["git", "add", "."], check=True, capture_output=True, text=True)
        subprocess.run(
            ["git", "commit", "-m", "Initial commit from ArcKit"],
            check=True,
            capture_output=True,
            text=True,
        )
        console.print("[green]✓[/green] Git repository initialized")
        return True
    except subprocess.CalledProcessError as e:
        console.print(f"[red]Error initializing git repository:[/red] {e}")
        return False
    finally:
        os.chdir(original_cwd)


def get_data_paths():
    """Get paths to templates, scripts, and commands from installed package or source."""

    def build_paths(base_path):
        """Build the full paths dictionary from a base path."""
        return {
            "templates": base_path / ".arckit" / "templates",
            "scripts": base_path / "scripts",
            "opencode_root": base_path / "arckit-opencode",
            "opencode_commands": base_path / "arckit-opencode" / "commands",
            "opencode_agents": base_path / "arckit-opencode" / "agents",
            "docs_guides": base_path / "docs" / "guides",
            "docs_readme": base_path / "docs" / "README.md",
            "dependency_matrix": base_path / "docs" / "DEPENDENCY-MATRIX.md",
            "workflow_diagrams": base_path / "docs" / "WORKFLOW-DIAGRAMS.md",
            "version": base_path / "VERSION",
            "changelog": base_path / "CHANGELOG.md",
            "codex_references": base_path / "arckit-codex" / "references",
            "codex_skills": base_path / "arckit-codex" / "skills",
            "codex_agents": base_path / "arckit-codex" / "agents",
            "codex_config": base_path / "arckit-codex" / "config.toml",
            "copilot_prompts": base_path / "arckit-copilot" / "prompts",
            "copilot_agents": base_path / "arckit-copilot" / "agents",
            "copilot_instructions": base_path / "arckit-copilot" / "copilot-instructions.md",
        }

    # First, check if running from source (development mode)
    # This allows testing local changes without re-installing
    source_root = Path(__file__).parent.parent.parent
    if (source_root / ".arckit").exists() and (source_root / "arckit-codex").exists():
        return build_paths(source_root)

    # Then try to find installed package data
    try:
        # Try to find the shared data directory for uv tool installs
        # uv installs tools in ~/.local/share/uv/tools/{package-name}/share/{package}/
        uv_tools_path = (
            Path.home()
            / ".local"
            / "share"
            / "uv"
            / "tools"
            / "arckit-cli"
            / "share"
            / "arckit"
        )
        if uv_tools_path.exists():
            return build_paths(uv_tools_path)

        # Try to find the shared data directory for regular pip installs
        import site

        for site_dir in site.getsitepackages() + [site.getusersitepackages()]:
            if site_dir:
                # Try site-packages/share/arckit
                share_path = Path(site_dir) / "share" / "arckit"
                if share_path.exists():
                    return build_paths(share_path)

                # Try ../../../share/arckit from site-packages (for system installs)
                share_path = Path(site_dir).parent.parent.parent / "share" / "arckit"
                if share_path.exists():
                    return build_paths(share_path)

        # Try platformdirs approach for other installs
        data_dir = Path(platformdirs.user_data_dir("arckit"))
        if data_dir.exists():
            return build_paths(data_dir)

    except Exception:
        pass

    # Fallback to source directory if installation check failed
    return build_paths(source_root)


def create_project_structure(
    project_path: Path, ai_assistant: str, all_ai: bool = False
):
    """Create the basic ArcKit project structure."""

    console.print("[cyan]Creating project structure...[/cyan]")

    # Create directory structure
    directories = [
        ".arckit/scripts/bash",
        ".arckit/templates",
        ".arckit/templates-custom",
        "projects/000-global",
        "projects/000-global/policies",
        "projects/000-global/external",
    ]

    if all_ai:
        # Create directories for all AI assistants (Codex and OpenCode)
        directories.extend(
            [
                ".codex/agents",
                ".agents/skills",
                ".opencode/commands",
                ".opencode/agents",
            ]
        )
    else:
        agent_folder = AGENT_CONFIG[ai_assistant]["folder"]
        if ai_assistant == "codex":
            directories.append(".agents/skills")
            directories.append(f"{agent_folder}agents")
        elif ai_assistant == "opencode":
            directories.append(f"{agent_folder}commands")
            directories.append(f"{agent_folder}agents")
        elif ai_assistant == "copilot":
            directories.append(f"{agent_folder}prompts")
            directories.append(f"{agent_folder}agents")

    for directory in directories:
        (project_path / directory).mkdir(parents=True, exist_ok=True)

    # Add .gitkeep files to empty directories so git tracks them
    gitkeep_dirs = [
        "projects/000-global",
        "projects/000-global/policies",
        "projects/000-global/external",
    ]
    for directory in gitkeep_dirs:
        gitkeep = project_path / directory / ".gitkeep"
        if not gitkeep.exists():
            gitkeep.touch()

    # Create README for templates-custom directory
    templates_custom_readme = (
        project_path / ".arckit" / "templates-custom" / "README.md"
    )
    templates_custom_readme.write_text("""# Custom Templates

This directory is for your customized ArcKit templates.

## How Template Customization Works

1. **Default templates** are in `.arckit/templates/` (refreshed by `arckit init`)
2. **Your customizations** go here in `.arckit/templates-custom/`
3. Commands automatically check here first, falling back to defaults

## Getting Started

Use the `/arckit.customize` command to copy templates for editing:

```
/arckit.customize requirements      # Copy requirements template
/arckit.customize all               # Copy all templates
/arckit.customize list              # See available templates
```

## Why This Pattern?

- Your customizations are preserved when running `arckit init` again
- Default templates can be updated without losing your changes
- Easy to see what you've customized vs defaults

## Common Customizations

- Add organization-specific document control fields
- Include mandatory compliance sections (ISO 27001, PCI-DSS)
- Add department-specific approval workflows
- Customize UK Government classification banners
""", encoding='utf-8')

    console.print("[green]✓[/green] Project structure created")

    return project_path


@app.command()
def init(
    project_name: str = typer.Argument(
        None,
        help="Name for your new project directory (optional, use '.' for current directory)",
    ),
    ai_assistant: str = typer.Option(None, "--ai", help="AI assistant to use: codex, opencode, copilot"),
    no_git: bool = typer.Option(
        False, "--no-git", help="Skip git repository initialization"
    ),
    here: bool = typer.Option(
        False, "--here", help="Initialize project in the current directory"
    ),
    all_ai: bool = typer.Option(
        False,
        "--all-ai",
        help="Install commands for all CLI-supported AI assistants (codex)",
    ),
    minimal: bool = typer.Option(
        False, "--minimal", help="Minimal install: skip docs and guides"
    ),
):
    """
    Initialize a new ArcKit project for enterprise architecture governance.

    This command will:
    1. Create project directory structure
    2. Copy templates for architecture principles, requirements, SOW, etc.
    3. Set up AI assistant commands
    4. Copy documentation and guides (unless --minimal)
    5. Initialize git repository (optional)

    Examples:
        arckit init my-architecture-project
        arckit init my-project --ai codex
        arckit init . --ai codex
        arckit init --here --ai codex --minimal
    """

    show_banner()

    if project_name == ".":
        here = True
        project_name = None

    if here and project_name:
        console.print(
            "[red]Error:[/red] Cannot specify both project name and --here flag"
        )
        raise typer.Exit(1)

    if not here and not project_name:
        console.print(
            "[red]Error:[/red] Must specify either a project name or use '.' / --here flag"
        )
        raise typer.Exit(1)

    if here:
        try:
            project_name = Path.cwd().name
            project_path = Path.cwd()
        except (FileNotFoundError, OSError):
            console.print(
                "[red]Error:[/red] Current directory does not exist. Please cd to a valid directory first."
            )
            raise typer.Exit(1)
    else:
        try:
            project_path = Path(project_name).resolve()
        except (FileNotFoundError, OSError):
            project_path = Path.home() / project_name
        if project_path.exists():
            console.print(
                f"[red]Error:[/red] Directory '{project_name}' already exists"
            )
            raise typer.Exit(1)

    console.print(f"[cyan]Initializing ArcKit project:[/cyan] {project_name}")
    console.print(f"[cyan]Location:[/cyan] {project_path}")

    # Check git
    should_init_git = False
    if not no_git:
        should_init_git = check_tool("git")
        if not should_init_git:
            console.print(
                "[yellow]Git not found - will skip repository initialization[/yellow]"
            )

    # Select AI assistant
    if not ai_assistant:
        console.print("\n[cyan]Select your AI assistant:[/cyan]")
        console.print("1. codex (OpenAI Codex CLI)")
        console.print("2. opencode (OpenCode CLI)")
        console.print("3. copilot (GitHub Copilot in VS Code)")
        console.print()
        console.print("[dim]For Claude Code, use the ArcKit plugin instead:[/dim]")
        console.print("[dim]  /plugin marketplace add tractorjuice/arc-kit[/dim]")
        console.print("[dim]For Gemini CLI, use the ArcKit extension instead:[/dim]")
        console.print(
            "[dim]  gemini extensions install https://github.com/tractorjuice/arckit-gemini[/dim]"
        )

        choice = typer.prompt("Enter choice", default="1")
        ai_map = {"1": "codex", "2": "opencode", "3": "copilot"}
        ai_assistant = ai_map.get(choice, "codex")

    if ai_assistant == "claude":
        console.print(
            "[yellow]Claude Code support has moved to the ArcKit plugin.[/yellow]"
        )
        console.print("Install in Claude Code with:")
        console.print("  [cyan]/plugin marketplace add tractorjuice/arc-kit[/cyan]")
        console.print("\nThen enable the plugin from the Discover tab.")
        raise typer.Exit(0)

    if ai_assistant == "gemini":
        console.print(
            "[yellow]Gemini CLI support has moved to the ArcKit Gemini extension.[/yellow]"
        )
        console.print("Install in Gemini CLI with:")
        console.print(
            "  [cyan]gemini extensions install https://github.com/tractorjuice/arckit-gemini[/cyan]"
        )
        console.print("\nThe extension provides all 48 commands with zero config.")
        console.print("Updates via: [cyan]gemini extensions update arckit[/cyan]")
        raise typer.Exit(0)

    if ai_assistant not in AGENT_CONFIG:
        console.print(f"[red]Error:[/red] Invalid AI assistant '{ai_assistant}'")
        console.print(f"Choose from: {', '.join(AGENT_CONFIG.keys())}")
        raise typer.Exit(1)

    if all_ai:
        console.print(f"[cyan]Selected AI assistant:[/cyan] All (Codex)")
    else:
        console.print(
            f"[cyan]Selected AI assistant:[/cyan] {AGENT_CONFIG[ai_assistant]['name']}"
        )

    # Create project structure
    create_project_structure(project_path, ai_assistant, all_ai)

    # Copy templates from installed package or source
    console.print("[cyan]Setting up templates...[/cyan]")

    data_paths = get_data_paths()
    templates_src = data_paths["templates"]
    scripts_src = data_paths["scripts"]

    console.print(f"[dim]Debug: Resolved data paths:[/dim]")
    console.print(f"[dim]  templates: {templates_src}[/dim]")
    console.print(f"[dim]  scripts: {scripts_src}[/dim]")

    templates_dst = project_path / ".arckit" / "templates"
    scripts_dst = project_path / ".arckit" / "scripts"
    agent_folder = AGENT_CONFIG[ai_assistant]["folder"]

    # Determine destination subfolder based on assistant type
    subfolder = "commands" if ai_assistant == "opencode" else "prompts"
    commands_dst = project_path / agent_folder / subfolder

    # Copy templates if they exist
    if templates_src.exists():
        console.print(f"[dim]Copying templates from: {templates_src}[/dim]")
        template_count = 0
        for template_file in templates_src.glob("*.md"):
            shutil.copy2(template_file, templates_dst / template_file.name)
            template_count += 1
        console.print(f"[green]✓[/green] Copied {template_count} templates")
    else:
        console.print(
            f"[yellow]Warning: Templates not found at {templates_src}[/yellow]"
        )

    # Copy scripts if they exist
    if scripts_src.exists():
        console.print(f"[dim]Copying scripts from: {scripts_src}[/dim]")
        shutil.copytree(
            scripts_src,
            scripts_dst,
            dirs_exist_ok=True,
            ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
        )
        console.print(f"[green]✓[/green] Scripts copied")
    else:
        console.print(f"[yellow]Warning: Scripts not found at {scripts_src}[/yellow]")

    # Copy references if they exist
    references_src = data_paths.get("codex_references")
    if references_src and references_src.exists():
        references_dst = project_path / ".arckit" / "references"
        references_dst.mkdir(parents=True, exist_ok=True)
        shutil.copytree(references_src, references_dst, dirs_exist_ok=True)
        console.print(f"[green]✓[/green] References copied")

    # Copy slash commands
    # Copy Codex prompts (all_ai and single-AI both install codex)
    if ai_assistant == "codex" or all_ai:
        # Copy Codex skills to .agents/skills/ (replaces deprecated .codex/prompts/)
        codex_skills_src = data_paths.get("codex_skills")
        if codex_skills_src and codex_skills_src.exists():
            skills_dst = project_path / ".agents" / "skills"
            skills_dst.mkdir(parents=True, exist_ok=True)
            shutil.copytree(codex_skills_src, skills_dst, dirs_exist_ok=True)
            skill_count = sum(
                1 for d in skills_dst.iterdir()
                if d.is_dir() and not d.name.startswith(".")
            )
            console.print(f"[green]✓[/green] Copied {skill_count} skills to .agents/skills/")
        else:
            console.print(
                f"[yellow]Warning: Codex skills not found at {codex_skills_src}[/yellow]"
            )

        # Copy Codex agent configs
        codex_agents_src = data_paths.get("codex_agents")
        if codex_agents_src and codex_agents_src.exists():
            agents_dst = project_path / ".codex" / "agents"
            agents_dst.mkdir(parents=True, exist_ok=True)
            agent_count = 0
            for agent_file in sorted(codex_agents_src.iterdir()):
                if agent_file.suffix in (".toml", ".md"):
                    shutil.copy2(agent_file, agents_dst / agent_file.name)
                    agent_count += 1
            console.print(f"[green]✓[/green] Copied {agent_count} agent configs to .codex/agents/")

        # Copy Codex config.toml (MCP servers + agent roles)
        codex_config_src = data_paths.get("codex_config")
        if codex_config_src and codex_config_src.exists():
            config_dst = project_path / ".codex" / "config.toml"
            shutil.copy2(codex_config_src, config_dst)
            console.print(f"[green]✓[/green] Copied config.toml (MCP servers + agent roles)")

    # Copy OpenCode commands and agents
    if ai_assistant == "opencode" or all_ai:
        # Copy commands
        commands_src = data_paths["opencode_commands"]
        if all_ai:
            target_cmd_dst = project_path / ".opencode" / "commands"
            target_agent_dst = project_path / ".opencode" / "agents"
        else:
            target_cmd_dst = project_path / agent_folder / "commands"
            target_agent_dst = project_path / agent_folder / "agents"

        if commands_src.exists():
            console.print(f"[dim]Copying OpenCode commands from: {commands_src}[/dim]")
            command_count = 0
            target_cmd_dst.mkdir(parents=True, exist_ok=True)
            for command_file in commands_src.glob("arckit.*.md"):
                shutil.copy2(command_file, target_cmd_dst / command_file.name)
                command_count += 1
            console.print(f"[green]✓[/green] Copied {command_count} OpenCode commands")
        else:
            console.print(
                f"[yellow]Warning: OpenCode commands not found at {commands_src}[/yellow]"
            )

        # Copy agents
        agents_src = data_paths["opencode_agents"]
        if agents_src.exists():
            console.print(f"[dim]Copying OpenCode agents from: {agents_src}[/dim]")
            agent_count = 0
            target_agent_dst.mkdir(parents=True, exist_ok=True)
            for agent_file in agents_src.glob("*.md"):
                shutil.copy2(agent_file, target_agent_dst / agent_file.name)
                agent_count += 1
            console.print(f"[green]✓[/green] Copied {agent_count} OpenCode agents")
        else:
            console.print(
                f"[yellow]Warning: OpenCode agents not found at {agents_src}[/yellow]"
            )

    # Copy Copilot prompt files and agents
    if ai_assistant == "copilot":
        console.print("[cyan]Setting up Copilot environment...[/cyan]")

        # Copy prompt files to .github/prompts/
        copilot_prompts_src = data_paths.get("copilot_prompts")
        if copilot_prompts_src and copilot_prompts_src.exists():
            prompts_dst = project_path / ".github" / "prompts"
            prompts_dst.mkdir(parents=True, exist_ok=True)
            prompt_count = 0
            for prompt_file in copilot_prompts_src.glob("*.prompt.md"):
                shutil.copy2(prompt_file, prompts_dst / prompt_file.name)
                prompt_count += 1
            console.print(f"[green]✓[/green] Copied {prompt_count} prompt files to .github/prompts/")
        else:
            console.print(
                f"[yellow]Warning: Copilot prompts not found at {copilot_prompts_src}[/yellow]"
            )

        # Copy agent files to .github/agents/
        copilot_agents_src = data_paths.get("copilot_agents")
        if copilot_agents_src and copilot_agents_src.exists():
            agents_dst = project_path / ".github" / "agents"
            agents_dst.mkdir(parents=True, exist_ok=True)
            agent_count = 0
            for agent_file in copilot_agents_src.glob("*.agent.md"):
                shutil.copy2(agent_file, agents_dst / agent_file.name)
                agent_count += 1
            console.print(f"[green]✓[/green] Copied {agent_count} agent files to .github/agents/")

        # Copy copilot-instructions.md
        copilot_instructions_src = data_paths.get("copilot_instructions")
        if copilot_instructions_src and copilot_instructions_src.exists():
            instructions_dst = project_path / ".github" / "copilot-instructions.md"
            shutil.copy2(copilot_instructions_src, instructions_dst)
            console.print(f"[green]✓[/green] Copied copilot-instructions.md")

        console.print("[green]✓[/green] Copilot environment configured")

    console.print("[green]✓[/green] Templates configured")

    # Copy documentation (unless --minimal)
    if not minimal:
        console.print("[cyan]Setting up documentation...[/cyan]")

        # Copy docs/guides/
        docs_guides_src = data_paths["docs_guides"]
        if docs_guides_src.exists():
            docs_guides_dst = project_path / "docs" / "guides"
            docs_guides_dst.mkdir(parents=True, exist_ok=True)
            shutil.copytree(docs_guides_src, docs_guides_dst, dirs_exist_ok=True)
            guide_count = len(list(docs_guides_dst.glob("*.md")))
            console.print(f"[green]✓[/green] Copied {guide_count} command guides")

        # Copy docs/README.md
        docs_readme_src = data_paths["docs_readme"]
        if docs_readme_src.exists():
            docs_readme_dst = project_path / "docs" / "README.md"
            docs_readme_dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(docs_readme_src, docs_readme_dst)
            console.print(f"[green]✓[/green] Copied docs/README.md")

        # Copy DEPENDENCY-MATRIX.md
        dep_matrix_src = data_paths["dependency_matrix"]
        if dep_matrix_src.exists():
            shutil.copy2(dep_matrix_src, project_path / "docs" / "DEPENDENCY-MATRIX.md")
            console.print(f"[green]✓[/green] Copied docs/DEPENDENCY-MATRIX.md")

        # Copy WORKFLOW-DIAGRAMS.md
        workflow_src = data_paths["workflow_diagrams"]
        if workflow_src.exists():
            shutil.copy2(workflow_src, project_path / "docs" / "WORKFLOW-DIAGRAMS.md")
            console.print(f"[green]✓[/green] Copied docs/WORKFLOW-DIAGRAMS.md")

        console.print("[green]✓[/green] Documentation configured")

    # Copy VERSION and CHANGELOG.md (always, not gated by --minimal)
    version_src = data_paths["version"]
    if version_src.exists():
        shutil.copy2(version_src, project_path / "VERSION")
        console.print(f"[green]✓[/green] Copied VERSION")

    changelog_src = data_paths["changelog"]
    if changelog_src.exists():
        shutil.copy2(changelog_src, project_path / "CHANGELOG.md")
        console.print(f"[green]✓[/green] Copied CHANGELOG.md")

    # Determine command prefix based on AI assistant
    if ai_assistant == "codex":
        p = "$arckit-"  # skill invocation
    elif ai_assistant == "copilot":
        p = "/arckit-"  # copilot prompt invocation
    else:
        p = "/arckit."  # slash command

    readme_content = f"""# {project_name}

Enterprise Architecture Governance Project

## Getting Started

This project uses ArcKit for enterprise architecture governance and vendor procurement.

### Available Commands

Once you start your AI assistant, you'll have access to these commands:

#### Project Planning
- `{p}plan` - Create project plan with timeline, phases, and gates

#### Core Workflow
- `{p}principles` - Create or update architecture principles
- `{p}stakeholders` - Analyze stakeholder drivers, goals, and outcomes
- `{p}risk` - Create comprehensive risk register (Orange Book)
- `{p}sobc` - Create Strategic Outline Business Case (Green Book 5-case)
- `{p}requirements` - Define comprehensive requirements
- `{p}data-model` - Create data model with ERD, GDPR compliance, data governance
- `{p}research` - Research technology, services, and products with build vs buy analysis
- `{p}wardley` - Create strategic Wardley Maps for build vs buy and procurement strategy

#### Vendor Procurement
- `{p}sow` - Generate Statement of Work (RFP)
- `{p}dos` - Digital Outcomes and Specialists (DOS) procurement (UK Digital Marketplace)
- `{p}gcloud-search` - Search G-Cloud services on UK Digital Marketplace
- `{p}gcloud-clarify` - Validate G-Cloud services and generate clarification questions
- `{p}evaluate` - Create vendor evaluation framework and score vendors

#### Design Review
- `{p}hld-review` - Review High-Level Design
- `{p}dld-review` - Review Detailed Design

#### Architecture Diagrams
- `{p}diagram` - Generate visual architecture diagrams using Mermaid

#### Sprint Planning
- `{p}backlog` - Generate prioritised product backlog with GDS user stories

#### Service Management
- `{p}servicenow` - Generate ServiceNow service design (CMDB, SLAs, incident/change management)

#### Traceability & Quality
- `{p}traceability` - Generate requirements traceability matrix
- `{p}analyze` - Comprehensive governance quality analysis

#### Template Customization
- `{p}customize` - Copy templates for customization (preserves across updates)

#### UK Government Compliance
- `{p}service-assessment` - GDS Service Standard assessment preparation
- `{p}tcop` - Technology Code of Practice assessment (all 13 points)
- `{p}ai-playbook` - AI Playbook compliance for responsible AI
- `{p}atrs` - Algorithmic Transparency Recording Standard (ATRS) record

#### Security Assessment
- `{p}secure` - UK Government Secure by Design (NCSC CAF, Cyber Essentials, UK GDPR)
- `{p}mod-secure` - MOD Secure by Design (JSP 440, IAMM, security clearances)
- `{p}jsp-936` - MOD JSP 936 AI assurance documentation

## Project Structure

```
{project_name}/
├── .arckit/
│   ├── scripts/
│   │   └── bash/
│   ├── templates/           # Default templates (refreshed by arckit init)
│   └── templates-custom/    # Your customizations (preserved across updates)
├── .agents/skills/          # Codex skills (auto-discovered)
├── projects/
│   ├── 000-global/
│   │   └── ARC-000-PRIN-v1.0.md (global principles)
│   └── 001-project-name/
│       ├── requirements.md
│       ├── sow.md
│       └── vendors/
```

## Template Customization

ArcKit templates can be customized without modifying the defaults:

1. Run `{p}customize <template-name>` to copy a template for editing
2. Your customizations are stored in `.arckit/templates-custom/`
3. Commands automatically use your custom templates when present
4. Running `arckit init` again preserves your customizations

Example:
```
{p}customize requirements   # Copy requirements template
{p}customize all            # Copy all templates
```

## Next Steps

1. Start your AI assistant ({AGENT_CONFIG[ai_assistant]["name"]})
2. Run `{p}principles` to establish architecture governance
3. Create your first project with `{p}requirements`

## Documentation

- [ArcKit Documentation](https://github.com/github/arc-kit)
- [Architecture Principles Guide](https://github.com/github/arc-kit/docs/principles.md)
- [Vendor Procurement Guide](https://github.com/github/arc-kit/docs/procurement.md)
"""

    (project_path / "README.md").write_text(readme_content, encoding='utf-8')
    console.print("[green]✓[/green] README created")

    # Initialize git if requested
    if should_init_git and not is_git_repo(project_path):
        init_git_repo(project_path)

    # Set up .gitignore for Codex projects
    if ai_assistant == "codex":
        gitignore_path = project_path / ".gitignore"
        codex_ignore_entries = [
            "# Codex CLI",
            ".codex/*",
            "!.codex/agents/",
            "!.codex/config.toml",
        ]

        if gitignore_path.exists():
            existing_content = gitignore_path.read_text(encoding='utf-8')
            if ".codex" not in existing_content:
                with open(gitignore_path, 'a', encoding='utf-8') as f:
                    f.write("\n" + "\n".join(codex_ignore_entries) + "\n")
        else:
            gitignore_path.write_text("\n".join(codex_ignore_entries) + "\n", encoding='utf-8')

        console.print("[green]✓[/green] Codex environment configured")

    # Create .envrc for OpenCode projects
    if ai_assistant == "opencode":
        console.print("[cyan]Setting up OpenCode environment...[/cyan]")

        # Create .envrc
        envrc_path = project_path / ".envrc"
        envrc_content = f"""# Auto-generated by arckit CLI for OpenCode CLI support
# This file sets OPENCODE_HOME so OpenCode can discover project-specific commands

export OPENCODE_HOME="$PWD/.opencode"
"""
        envrc_path.write_text(envrc_content, encoding="utf-8")

        # Copy .opencode/README.md if it exists
        opencode_src = data_paths.get("opencode_root")
        if opencode_src and opencode_src.exists():
            opencode_readme_src = opencode_src / "README.md"
            opencode_gitignore_src = opencode_src / ".gitignore"
            opencode_dst = project_path / ".opencode"
            opencode_dst.mkdir(parents=True, exist_ok=True)

            if opencode_readme_src.exists():
                shutil.copy2(opencode_readme_src, opencode_dst / "README.md")
                console.print(f"[green]✓[/green] Copied .opencode/README.md")

            if opencode_gitignore_src.exists():
                shutil.copy2(opencode_gitignore_src, opencode_dst / ".gitignore")
                console.print(f"[green]✓[/green] Copied .opencode/.gitignore")

            # Create opencode.json with MCP configuration (workspace config)
            # Using dictionary format with type="remote" matching SDK McpRemoteConfig
            opencode_json_path = opencode_dst / "opencode.json"
            opencode_json_content = """{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "aws-knowledge": {
      "type": "remote",
      "url": "https://knowledge-mcp.global.api.aws/sse",
      "enabled": true
    },
    "microsoft-learn": {
      "type": "remote",
      "url": "https://learn.microsoft.com/api/mcp/sse",
      "enabled": true
    },
    "google-developer-knowledge": {
      "type": "remote",
      "url": "https://developerknowledge.googleapis.com/mcp/sse",
      "headers": {
        "X-Goog-Api-Key": "${GOOGLE_API_KEY}"
      },
      "enabled": false
    }
  }
}
"""
            opencode_json_path.write_text(opencode_json_content, encoding="utf-8")
            console.print(
                f"[green]✓[/green] Created .opencode/opencode.json with MCP servers"
            )

            # Copy skills if they exist
            opencode_skills_src = opencode_src / "skills"
            if opencode_skills_src.exists():
                opencode_skills_dst = opencode_dst / "skills"
                shutil.copytree(
                    opencode_skills_src, opencode_skills_dst, dirs_exist_ok=True
                )
                console.print(f"[green]✓[/green] Copied .opencode/skills")

        # Create/update .gitignore

        gitignore_path = project_path / ".gitignore"
        opencode_ignore_entries = [
            "# OpenCode CLI - exclude auth tokens but include commands",
            ".opencode/*",
            "!.opencode/commands/",
            "!.opencode/README.md",
            "!.opencode/.gitignore",
            "",
            "# direnv",
            ".envrc.local",
        ]

        if gitignore_path.exists():
            existing_content = gitignore_path.read_text(encoding="utf-8")
            if ".opencode" not in existing_content:
                with open(gitignore_path, "a", encoding="utf-8") as f:
                    f.write("\n" + "\n".join(opencode_ignore_entries) + "\n")
        else:
            gitignore_path.write_text("\n".join(opencode_ignore_entries) + "\n", encoding="utf-8")

        console.print(
            "[green]✓[/green] OpenCode environment configured (.envrc created)"
        )

    # Success message
    console.print(
        "\n[bold green]✓ ArcKit project initialized successfully![/bold green]\n"
    )

    next_steps = [
        f"1. Navigate to project: [cyan]cd {project_name if not here else '.'}[/cyan]",
    ]

    if ai_assistant == "codex":
        next_steps.append("2. Start Codex: [cyan]codex[/cyan]")
        next_steps.append(
            "3. Establish architecture principles: [cyan]$arckit-principles[/cyan]"
        )
        next_steps.append(
            "4. Create your first project: [cyan]$arckit-requirements[/cyan]"
        )
    elif ai_assistant == "opencode":
        next_steps.append("2. Set up OPENCODE_HOME environment variable:")
        next_steps.append(
            "   [cyan]RECOMMENDED[/cyan]: Install direnv and run [cyan]direnv allow[/cyan]"
        )
        next_steps.append(
            '   Alternative: Run [cyan]export OPENCODE_HOME="$PWD/.opencode"[/cyan]'
        )
        next_steps.append(f"3. Start OpenCode: [cyan]opencode[/cyan]")
        next_steps.append(
            "4. Establish architecture principles: [cyan]/arckit.principles[/cyan]"
        )
        next_steps.append("5. Create your first project: [cyan]/arckit.requirements[/cyan]"
        )
    elif ai_assistant == "copilot":
        next_steps.append("2. Open in VS Code: [cyan]code .[/cyan]")
        next_steps.append("3. Open Copilot Chat and type: [cyan]/arckit-principles[/cyan]")
        next_steps.append(
            "4. Create your first project: [cyan]/arckit-requirements[/cyan]"
        )

    console.print(Panel("\n".join(next_steps), title="Next Steps", border_style="cyan"))


@app.command(name="migrate-classification")
def migrate_classification(
    apply: bool = typer.Option(
        False,
        "--apply",
        help="Apply the proposed mappings (default: report only).",
    ),
    root: str = typer.Option(
        "projects",
        "--root",
        help="Root directory to walk (default: projects).",
    ),
):
    """Migrate Document Control Classification from UK ladder to UAE Smart Data ladder.

    One-time helper for projects switching to the UAE Federal Overlay (v4.10).
    Walks projects/ for ARC-* artefacts and proposes mappings:

      PUBLIC -> Open, OFFICIAL -> Shared, OFFICIAL-SENSITIVE -> Confidential,
      SECRET -> Secret, TOP SECRET -> Top Secret

    Default is report-only; pass --apply to write the changes.
    """
    # Locate the migration script (works for source/dev, pip install, uv tool install).
    here = Path(__file__).resolve()
    candidates = [
        here.parents[2] / "scripts" / "python" / "migrate_classification.py",  # source/dev
        Path.cwd() / "scripts" / "python" / "migrate_classification.py",  # cwd-relative
    ]
    # Also try the get_data_paths() fallback (covers pip and uv tool installs).
    try:
        data_paths = get_data_paths()  # type: ignore[name-defined]
        if data_paths and "scripts" in data_paths:
            candidates.append(Path(data_paths["scripts"]) / "python" / "migrate_classification.py")
    except Exception:
        pass

    script = next((c for c in candidates if c.is_file()), None)
    if script is None:
        console.print(
            "[red]Error:[/red] migrate_classification.py not found. "
            "Searched: " + ", ".join(str(c) for c in candidates)
        )
        raise typer.Exit(code=2)

    cmd = [sys.executable, str(script), "--root", root]
    if apply:
        cmd.append("--apply")

    result = subprocess.run(cmd)
    raise typer.Exit(code=result.returncode)


@app.command()
def check():
    """Check that all required tools are installed."""
    show_banner()
    console.print("[bold]Checking for installed tools...[/bold]\n")

    tools = {
        "git": "Version control",
        "code": "Visual Studio Code",
    }

    for tool, description in tools.items():
        if check_tool(tool):
            console.print(f"[green]✓[/green] {description} ({tool})")
        else:
            console.print(f"[red]✗[/red] {description} ({tool}) - not found")

    console.print("\n[bold green]ArcKit CLI is ready to use![/bold green]")


@app.callback()
def callback(ctx: typer.Context):
    """Show banner when no subcommand is provided."""
    if (
        ctx.invoked_subcommand is None
        and "--help" not in sys.argv
        and "-h" not in sys.argv
    ):
        show_banner()
        console.print(
            Align.center("[dim]Run 'arckit --help' for usage information[/dim]")
        )
        console.print()


def main():
    """Main entry point for the ArcKit CLI."""
    app()


if __name__ == "__main__":
    main()
