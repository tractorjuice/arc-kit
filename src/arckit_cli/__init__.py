#!/usr/bin/env python3
"""
ArcKit CLI - The Enterprise Architecture Governance Harness

A toolkit for enterprise architects to manage:
- Architecture principles and governance
- Requirements documentation
- Vendor RFP/SOW generation
- Vendor evaluation and selection
- Design review processes (HLD/DLD)
- Requirements traceability
"""

import asyncio
import os
import re
import subprocess
import sys
import time
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
import yaml
import ssl
import truststore
import platformdirs

ssl_context = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
client = httpx.Client(verify=ssl_context)

# Agent configuration for ArcKit
# Note: Claude Code support has moved to the ArcKit plugin (plugins/arckit-claude/).
# Gemini CLI support has moved to the ArcKit Gemini extension (extensions/arckit-gemini/).
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

TAGLINE = "The Enterprise Architecture Governance Harness"

console = Console()

app = typer.Typer(
    name="arckit",
    help="The Enterprise Architecture Governance Harness",
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
            "opencode_root": base_path / "extensions" / "arckit-opencode",
            "opencode_commands": base_path / "extensions" / "arckit-opencode" / "commands",
            "opencode_agents": base_path / "extensions" / "arckit-opencode" / "agents",
            "docs_guides": base_path / "docs" / "guides",
            "docs_readme": base_path / "docs" / "README.md",
            "dependency_matrix": base_path / "docs" / "DEPENDENCY-MATRIX.md",
            "workflow_diagrams": base_path / "docs" / "WORKFLOW-DIAGRAMS.md",
            "version": base_path / "VERSION",
            "changelog": base_path / "CHANGELOG.md",
            "codex_references": base_path / "extensions" / "arckit-codex" / "references",
            "codex_skills": base_path / "extensions" / "arckit-codex" / "skills",
            "codex_agents": base_path / "extensions" / "arckit-codex" / "agents",
            "codex_hooks": base_path / "extensions" / "arckit-codex" / "hooks",
            "codex_schemas": base_path / "extensions" / "arckit-codex" / "schemas",
            "codex_validator": base_path / "extensions" / "arckit-codex" / "scripts" / "validate-handoff.mjs",
            "codex_config": base_path / "extensions" / "arckit-codex" / "config.toml",
            "copilot_prompts": base_path / "extensions" / "arckit-copilot" / "prompts",
            "copilot_agents": base_path / "extensions" / "arckit-copilot" / "agents",
            "copilot_instructions": base_path / "extensions" / "arckit-copilot" / "copilot-instructions.md",
        }

    # First, check if running from source (development mode)
    # This allows testing local changes without re-installing
    source_root = Path(__file__).parent.parent.parent
    if (source_root / ".arckit").exists() and (source_root / "extensions" / "arckit-codex").exists():
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

    # Try pipx installation (macOS/Linux)
    # pipx installs data in ~/.local/pipx/venvs/<name>/share/arckit/
    try:
        pipx_base = Path.home() / ".local" / "pipx" / "venvs" / "arckit-cli"
        # Check inside the venv itself first
        share_path = pipx_base / "share" / "arckit"
        if share_path.exists():
            return build_paths(share_path)
        # Also try ~/.local/share/arckit
        share_path = Path.home() / ".local" / "share" / "arckit"
        if share_path.exists():
            return build_paths(share_path)
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
                ".codex/hooks",
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
            directories.append(f"{agent_folder}hooks")
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

Use the `/arckit:customize` command to copy templates for editing:

```
/arckit:customize requirements      # Copy requirements template
/arckit:customize all               # Copy all templates
/arckit:customize list              # See available templates
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

    # Check LLM config first — if base_url is set, auto-select opencode (local LLM)
    if not ai_assistant:
        cfg = _load_config()
        base_url = _get_nested(cfg, "llm.base_url")
        model = _get_nested(cfg, "llm.model")
        if base_url:
            ai_assistant = "opencode"
            console.print(f"\n[cyan]Detected local LLM config:[/cyan]")
            console.print(f"  Base URL: {base_url}")
            if model:
                console.print(f"  Model: {model}")
            console.print(f"  → Auto-selecting [green]opencode[/green] for local LLM\n")

    # Select AI assistant interactively if not set by --ai or config
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
            console.print(f"[green]✓[/green] Copied config.toml (MCP servers + hooks + agent roles)")

        # Copy Codex lifecycle hooks
        codex_hooks_src = data_paths.get("codex_hooks")
        if codex_hooks_src and codex_hooks_src.exists():
            hooks_dst = project_path / ".codex" / "hooks"
            hooks_dst.mkdir(parents=True, exist_ok=True)
            for hook_file in sorted(codex_hooks_src.iterdir()):
                if hook_file.is_file() and hook_file.name != "hooks.json":
                    shutil.copy2(hook_file, hooks_dst / hook_file.name)
            console.print(f"[green]✓[/green] Copied Codex lifecycle hooks to .codex/hooks/")

        # Copy Codex schemas and deterministic validators used by research workflows
        codex_schemas_src = data_paths.get("codex_schemas")
        if codex_schemas_src and codex_schemas_src.exists():
            schemas_dst = project_path / ".arckit" / "schemas"
            shutil.copytree(codex_schemas_src, schemas_dst, dirs_exist_ok=True)
            console.print(f"[green]✓[/green] Copied Codex schemas to .arckit/schemas/")

        codex_validator_src = data_paths.get("codex_validator")
        if codex_validator_src and codex_validator_src.exists():
            validator_dst = project_path / ".arckit" / "scripts" / "validate-handoff.mjs"
            validator_dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(codex_validator_src, validator_dst)
            console.print(f"[green]✓[/green] Copied handoff validator to .arckit/scripts/")

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

This project uses ArcKit — The Enterprise Architecture Governance Harness — for strategy, architecture, delivery, and assurance.

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
            "!.codex/agents/**",
            "!.codex/hooks/",
            "!.codex/hooks/**",
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
            "4. Establish architecture principles: [cyan]/arckit:principles[/cyan]"
        )
        next_steps.append("5. Create your first project: [cyan]/arckit:requirements[/cyan]"
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


@app.command()
def version():
    """Show ArcKit version."""
    # Try to read version from VERSION file or package metadata
    version = "unknown"
    # Try package metadata first
    try:
        from importlib.metadata import version as get_version
        version = get_version("arckit-cli")
    except Exception:
        # Fallback to VERSION file
        version_path = Path(__file__).parent.parent.parent / "VERSION"
        if version_path.exists():
            version = version_path.read_text().strip()
    console.print(f"arckit {version}")


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------
def _get_config_path():
    """Return the path to the user config file."""
    return Path(platformdirs.user_config_dir("arckit")) / "config.yaml"


def _load_config():
    """Load config from YAML file; returns empty dict when file does not exist."""
    cfg_path = _get_config_path()
    if not cfg_path.exists():
        return {}
    try:
        return yaml.safe_load(cfg_path.read_text()) or {}
    except Exception:
        return {}


def _save_config(cfg):
    """Write config dict to YAML file (creates parent dir if needed)."""
    cfg_path = _get_config_path()
    cfg_path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    cfg_path.write_text(yaml.dump(cfg, default_flow_style=False))
    cfg_path.chmod(0o600)


def _is_sensitive_key(key: str) -> bool:
    """Return True if *key* is a dotted config path for a secret value."""
    leaf = key.split(".")[-1].lower()
    return leaf in ("api_key", "token", "secret")


def _get_nested(data, dotted_key):
    """Resolve a dotted key (e.g. 'llm.base_url') into a nested dict."""
    parts = dotted_key.split(".")
    current = data
    for part in parts:
        if isinstance(current, dict):
            current = current.get(part)
        else:
            return None
    return current


def _set_nested(data, dotted_key, value):
    """Set a value at the path implied by a dotted key, creating intermediate dicts."""
    parts = dotted_key.split(".")
    current = data
    for part in parts[:-1]:
        if part not in current or not isinstance(current[part], dict):
            current[part] = {}
        current = current[part]
    current[parts[-1]] = value


def _unset_nested(data, dotted_key):
    """Remove a leaf key from a nested dict."""
    parts = dotted_key.split(".")
    current = data
    for part in parts[:-1]:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return  # key does not exist — nothing to remove
    if isinstance(current, dict) and parts[-1] in current:
        del current[parts[-1]]


# Registered config keys (informational, used for listing)
_CONFIG_KEYS = [
    "llm.provider", "llm.base_url", "llm.model", "llm.api_key",
    "llm.max_tokens", "llm.temperature",
    "project.default_recipe", "project.default_ai", "project.recipes_dir",
]


# ---------------------------------------------------------------------------
# arckit config sub-commands
# ---------------------------------------------------------------------------
config_app = typer.Typer(help="Manage ArcKit configuration (YAML)")

# Local LLM management (setup, status, models, test)
from arckit_cli.local import local_app

app.add_typer(local_app, name="local")

app.add_typer(config_app, name="config")


@config_app.command(name="set")
def _config_set(key: str = typer.Argument(..., help="Dot-notation key (e.g. llm.base_url)"),
                value: str = typer.Argument(..., help="Value to set")):
    """Set a configuration key."""
    cfg = _load_config()
    _set_nested(cfg, key, value)
    _save_config(cfg)
    if _is_sensitive_key(key):
        console.print(f"[green]✓[/green] Set {key} = {'*' * 8 + '...'}")
    else:
        console.print(f"[green]✓[/green] Set {key} = {value}")


@config_app.command(name="get")
def _config_get(key: str = typer.Argument(..., help="Dot-notation key (e.g. llm.base_url)")):
    """Get the value for a single configuration key."""
    cfg = _load_config()
    val = _get_nested(cfg, key)
    if val is None:
        console.print(f"[red]Error:[/red] Key '{key}' not found")
        raise typer.Exit(1)
    if _is_sensitive_key(key):
        console.print("*" * 8 + "...")
    else:
        console.print(val)


@config_app.command(name="list")
def _config_list():
    """List all configuration keys and their values."""
    cfg = _load_config()
    if not cfg:
        console.print("[yellow]No configuration set yet. Use 'arckit config set' to add keys.[/yellow]")
        return
    # Flatten nested dict into dot-notation keys for display
    def flatten(d, prefix=""):
        items = []
        for k, v in d.items():
            full_key = f"{prefix}{k}" if not prefix else f"{prefix}.{k}"
            if isinstance(v, dict):
                items.extend(flatten(v, full_key))
            else:
                items.append((full_key, v))
        return items

    flat = flatten(cfg)
    if flat:
        table_rows = []
        for k, v in flat:
            display_value = "*" * 8 + "..." if _is_sensitive_key(k) else str(v)
            table_rows.append((k, display_value))
        from rich.table import Table
        t = Table(show_header=True, header_style="bold cyan")
        t.add_column("Key", style="cyan")
        t.add_column("Value")
        for row in table_rows:
            t.add_row(*row)
        console.print(t)
    else:
        console.print("[yellow]Configuration file exists but is empty.[/yellow]")


@config_app.command()
def config_show():
    """Display the full configuration as YAML."""
    cfg = _load_config()
    if not cfg:
        console.print("[yellow]No configuration set yet. Use 'arckit config set' to add keys.[/yellow]")
        return

    # Flatten with masking, then rebuild YAML that way
    def flatten(d, prefix=""):
        items = []
        for k, v in d.items():
            full_key = f"{prefix}{k}" if not prefix else f"{prefix}.{k}"
            if isinstance(v, dict):
                items.extend(flatten(v, full_key))
            else:
                display_value = "***" if _is_sensitive_key(full_key) else v
                items.append((full_key, display_value))
        return items

    lines = ["# ArcKit configuration (sensitive values masked)"]
    for key, value in flatten(cfg):
        lines.append(f"{key}: {value}")
    console.print("\n".join(lines))


@config_app.command()
def config_unset(key: str = typer.Argument(..., help="Dot-notation key to remove")):
    """Remove a configuration key."""
    cfg = _load_config()
    _unset_nested(cfg, key)
    _save_config(cfg)
    console.print(f"[green]✓[/green] Unset {key}")


# ---------------------------------------------------------------------------
# arckit build — helpers
# ---------------------------------------------------------------------------


def resolve_project_path(project_arg: str) -> Path:
    """Resolve the project path from the project argument."""
    # If it's an existing directory, use it directly
    p = Path(project_arg).resolve()
    if p.is_dir() and (p / ".arckit").exists():
        return p

    # Check if we're inside an ArcKit project
    cwd = Path.cwd().resolve()
    if (cwd / ".arckit").exists():
        return cwd

    # Check parent directories
    current = cwd
    for _ in range(10):
        if (current / ".arckit").exists():
            return current
        parent = current.parent
        if parent == current:
            break
        current = parent

    # Fall back to cwd
    return cwd


def resolve_recipe_path(recipe_name: str, project_root: Path) -> Path:
    """Resolve a recipe name to a YAML file path via precedence.

    Precedence:
        1. project_root/.arckit/recipes/{recipe}.yaml  (project override)
        2. project_root/plugins/arckit-*/recipes/{recipe}.yaml (community plugins)
        3. project_root/plugins/arckit-*/skills/*/recipes/{recipe}.yaml (nested skills)
        4a. share/arckit/scripts/{recipe}.yaml           (legacy system install)
        4b. share/arckit/plugins/arckit-*/recipes/{recipe}.yaml (installed plugins)
        5. project_root/scripts/recipes/{recipe}.yaml    (local scripts)
    """
    all_searched: list[tuple[str, Path]] = []

    def try_path(label: str, path: Path) -> Path | None:
        all_searched.append((label, path))
        if path.exists():
            return path
        return None

    # 1. Project override
    override = project_root / ".arckit" / "recipes" / f"{recipe_name}.yaml"
    if try_path("project override", override) is not None:
        return override

    # 2. Community plugins (shallow: plugins/arckit-*/recipes/)
    plugin_base = project_root / "plugins"
    if plugin_base.is_dir():
        for plugin_dir in sorted(plugin_base.glob("arckit-*/recipes")):
            plugin_file = plugin_dir / f"{recipe_name}.yaml"
            if try_path(f"plugin: {plugin_dir.parent.name}", plugin_file) is not None:
                return plugin_file

        # 3. Nested skills (plugins/arckit-*/skills/*/recipes/)
        for skills_recipes in sorted(plugin_base.glob("arckit-*/skills/*/recipes")):
            skill_file = skills_recipes / f"{recipe_name}.yaml"
            label = f"skill: {skills_recipes.parent.name}"
            if try_path(label, skill_file) is not None:
                return skill_file

    # 4. System share directory (for pip/uv installs)
    try:
        data_paths = get_data_paths()  # type: ignore[name-defined]
        # 4a. Check scripts/recipes/ (legacy)
        recipes_base = data_paths.get("scripts")
        if recipes_base and recipes_base.exists():
            for yaml_file in sorted(recipes_base.glob("*.yaml")):
                if yaml_file.stem == recipe_name:
                    if try_path("system share", yaml_file) is not None:
                        return yaml_file
        # 4b. Check share/arckit/plugins/arckit-*/recipes/ (installed plugin recipes)
        share_root = data_paths.get("scripts")
        if share_root:
            plugins_base = share_root.parent / "plugins"
            if plugins_base.exists():
                for plugin_recipes in sorted(plugins_base.glob("arckit-*/recipes")):
                    plugin_file = plugin_recipes / f"{recipe_name}.yaml"
                    label = f"plugin share: {plugin_recipes.parent.name}"
                    if try_path(label, plugin_file) is not None:
                        return plugin_file
    except Exception:
        pass

    # 5. Also check scripts/recipes/ at repo root
    scripts_recipes = project_root / "scripts" / "recipes"
    if scripts_recipes.is_dir():
        for yaml_file in sorted(scripts_recipes.glob("*.yaml")):
            if yaml_file.stem == recipe_name:
                if try_path("scripts/recipes", yaml_file) is not None:
                    return yaml_file

    # Not found — report all searched paths
    raise FileNotFoundError(
        f"Recipe '{recipe_name}' not found.\n"
        f"Searched:\n" + "\n".join(f"  - {path} ({label})" for label, path in all_searched) + "\n"
        f"Tip: Place a '{recipe_name}.yaml' file in .arckit/recipes/"
    )


def _git_commit(project_path: Path, message: str) -> bool:
    """Run git add + commit in the project directory. Returns True on success."""
    try:
        subprocess.run(
            ["git", "add", "."],
            cwd=str(project_path),
            capture_output=True,
            timeout=10,
        )
        result = subprocess.run(
            ["git", "commit", "-m", message, "--allow-empty"],
            cwd=str(project_path),
            capture_output=True,
            timeout=10,
        )
        return result.returncode == 0
    except (subprocess.SubprocessError, FileNotFoundError):
        return False


# ---------------------------------------------------------------------------
# Build configuration loader
# ---------------------------------------------------------------------------


def _serialize_discovery(discovery_cfg: dict) -> str:
    """Serialize discovery config to structured text for LLM injection."""
    lines = ["---"]
    if not discovery_cfg:
        lines.append("discovery_scope: {}")
        lines.append("---")
        return "\n".join(lines)

    # Systems
    systems = discovery_cfg.get("systems", [])
    if systems:
        lines.append("discovery_scope:")
        lines.append("  systems:")
        for s in systems:
            lines.append(f"    - {s}")
    # Capabilities
    capabilities = discovery_cfg.get("capabilities", [])
    if capabilities:
        lines.append("  capabilities:")
        for cap in capabilities:
            maturity = cap.get("maturity", "?")
            notes = cap.get("notes", "")
            domain = cap.get("domain", "unknown")
            lines.append(f"    - domain: {domain} (maturity: {maturity})")
            if notes:
                lines.append(f"      notes: {notes}")
    # Pain points
    pain_points = discovery_cfg.get("pain_points", [])
    if pain_points:
        lines.append("  pain_points:")
        for pp in pain_points:
            ptype = pp.get("type", "unknown")
            desc = pp.get("description", "")
            impact = pp.get("impact", "")
            impact_tag = f" ({impact} impact)" if impact else ""
            lines.append(f"    - {ptype}: {desc}{impact_tag}")
    # Constraints
    constraints = discovery_cfg.get("constraints", [])
    if constraints:
        lines.append("  constraints:")
        for c in constraints:
            lines.append(f"    - {c}")
    lines.append("---")
    return "\n".join(lines)


def _serialize_requirements(req_cfg: dict) -> str:
    """Serialize requirements config to comma-separated focus areas."""
    focus = req_cfg.get("focus_areas", [])
    return ", ".join(focus) if focus else ""


def _serialize_stakeholders(stake_cfg: dict) -> str:
    """Serialize stakeholder config to structured text for LLM injection."""
    lines = ["---"]
    if not stake_cfg:
        lines.append("stakeholder_priorities: {}")
        lines.append("---")
        return "\n".join(lines)

    priorities = stake_cfg.get("priorities", [])
    if priorities:
        lines.append("stakeholder_priorities:")
        for p in priorities:
            role = p.get("role", "unknown")
            weight = p.get("weight", "")
            weight_tag = f" ({weight})" if weight else ""
            priority = p.get("priority", "")
            lines.append(f"  {role}{weight_tag}: {priority}")

    groups = stake_cfg.get("groups", [])
    if groups:
        lines.append("stakeholder_groups:")
        for g in groups:
            name = g.get("name", "unknown")
            members = g.get("members", [])
            lines.append(f"  {name}: [{', '.join(members)}]")
    lines.append("---")
    return "\n".join(lines)


def _load_build_config(config_path: Path) -> dict[str, str]:
    """Load build-config.yaml and produce placeholder key-value pairs.

    Returns a dict suitable for updating wave_values. Missing sections
    are silently skipped (interactive prompts fill gaps).
    """
    values: dict[str, str] = {}

    try:
        raw = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    except Exception:
        return values

    if not isinstance(raw, dict):
        return values

    # ── project: {P}, {NAME} ──────────────────────────────────────────
    project = raw.get("project") or {}
    if project.get("id"):
        values["P"] = str(project["id"])
    if project.get("name"):
        values["NAME"] = str(project["name"])

    # ── discovery: {DISC_SCOPE} ───────────────────────────────────────
    discovery = raw.get("discovery")
    if discovery:
        values["DISC_SCOPE"] = _serialize_discovery(discovery)

    # ── requirements: {REQ_SCOPE} ─────────────────────────────────────
    requirements = raw.get("requirements")
    if requirements:
        val = _serialize_requirements(requirements)
        if val:
            values["REQ_SCOPE"] = val

    # ── stakeholders: {STKE_SCOPE} ──────────────────────────────────
    stakeholders = raw.get("stakeholders")
    if stakeholders:
        values["STKE_SCOPE"] = _serialize_stakeholders(stakeholders)

    # ── phase_ids: {P_<ID>} overrides ───────────────────────────────
    phase_ids = raw.get("phase_ids") or {}
    for phase_id, phase_val in phase_ids.items():
        key = f"P_{phase_id}"
        if phase_val:
            values[key] = str(phase_val)

    return values


def _resolve_config_path(project_root: Path, config_flag: str | None) -> Path | None:
    """Resolve build-config.yaml via flag > project override > project root."""
    if config_flag:
        return Path(config_flag).resolve()

    # Project-level override
    override = project_root / ".arckit" / "build-config.yaml"
    if override.exists():
        return override

    # Project root
    root_config = project_root / "build-config.yaml"
    if root_config.exists():
        return root_config

    return None


# ---------------------------------------------------------------------------
# arckit build command
# ---------------------------------------------------------------------------


@app.command()
def build(
    project: str = typer.Argument(
        ".", help="Project ID or path (e.g. '001', '.', or directory path)"
    ),
    recipe: str = typer.Option(
        "togaf-adm-full", "--recipe", help="Recipe name (resolves via precedence)"
    ),
    plan: bool = typer.Option(
        False, "--plan", help="Dry run — print wave plan, do not execute"
    ),
    resume: bool = typer.Option(
        False, "--resume", help="Resume from last incomplete wave"
    ),
    target: str = typer.Option(
        None, "--target", help="Build only this target and its dependencies"
    ),
    refresh: str = typer.Option(
        None, "--refresh", help="Force-rebuild this target and downstream"
    ),
    no_commit: bool = typer.Option(
        False, "--no-commit", help="Skip per-wave git commits"
    ),
    parallel: int = typer.Option(
        4, "--parallel", help="Max concurrent LLM calls per wave"
    ),
    base_url: str = typer.Option(
        None, "--base-url", help="Override LLM base URL"
    ),
    model: str = typer.Option(
        None, "--model", help="Override LLM model"
    ),
    config: str = typer.Option(
        None, "--config", help="Path to build-config.yaml with structured placeholder values"
    ),
):
    """Execute an ArcKit recipe against a project (DAG → waves → LLM execution)."""

    from arckit_cli.recipe import (
        Target, Wave as RecipeWave, load_recipe, validate_recipe, compute_waves,
    )
    from arckit_cli.state import (
        State, load_state, save_state, mark_target_complete,
        mark_target_failed, is_target_stale, mark_target_skipped,
    )
    from arckit_cli.llm import (
        LLMConfig, resolve_config, execute_wave,
    )
    from rich.table import Table
    from rich.console import Group
    from datetime import datetime

    console.print()
    console.print("[bold cyan]ArcKit Build[/bold cyan]")
    console.print(f"  Project: [green]{project}[/green]")
    console.print(f"  Recipe:  [green]{recipe}[/green]")
    console.print()

    # ── 1. Resolve project path ──────────────────────────────────────────
    project_root = resolve_project_path(project)
    if not (project_root / ".arckit").exists():
        console.print(
            f"[yellow]Warning:[/yellow] '{project_root}' does not appear to be "
            "an ArcKit project (no .arckit/ directory). "
            "Running `arckit init` first is recommended."
        )

    # ── 2. Resolve recipe path ───────────────────────────────────────────
    try:
        recipe_path = resolve_recipe_path(recipe, project_root)
    except FileNotFoundError as exc:
        console.print(f"[red]Error:[/red] {exc}")
        raise typer.Exit(1)

    console.print(f"  Recipe file: [cyan]{recipe_path}[/cyan]")

    # ── 3. Load and validate recipe ──────────────────────────────────────
    try:
        recipe_obj = load_recipe(str(recipe_path))
    except (FileNotFoundError, ValueError) as exc:
        console.print(f"[red]Error loading recipe:[/red] {exc}")
        raise typer.Exit(1)

    errors = validate_recipe(recipe_obj)
    if errors:
        console.print("[red]Recipe validation errors:[/red]")
        for err in errors:
            console.print(f"  ✗ {err}")
        raise typer.Exit(1)

    console.print(f"  Loaded: [green]{recipe_obj.name}[/green] "
                  f"(v{recipe_obj.schema_version}, {len(recipe_obj.targets)} targets)")

    # ── 4. Compute waves ─────────────────────────────────────────────────
    enabled: set[str] = set()
    excluded: set[str] = set()

    # --target filters to a single target (and its deps are kept implicitly)
    if target:
        # Find matching target IDs
        all_ids = [t.id for t in recipe_obj.targets]
        import fnmatch
        matched = [tid for tid in all_ids if fnmatch.fnmatch(tid, target)]
        if matched:
            enabled = set(matched)
        else:
            console.print(f"[red]Error:[/red] No target matches '{target}'")
            console.print(f"  Available targets: {', '.join(all_ids)}")
            raise typer.Exit(1)

    waves = compute_waves(recipe_obj, enabled, excluded, filter_targets=enabled if target else None)

    # ── 5. Plan mode ─────────────────────────────────────────────────────
    if plan:
        console.print("[bold]Wave Plan:[/bold]")
        for wave in waves:
            targets = [t.id for t in wave.targets]
            console.print(
                f"  [cyan]Wave {wave.number}[/cyan]: "
                f"[magenta]{', '.join(targets)}[/magenta]"
            )
        console.print(
            f"\n  Total: {len(waves)} waves, "
            f"{sum(len(w.targets) for w in waves)} targets"
        )
        raise typer.Exit(0)

    # ── 6. Resolve LLM config ──────────────────────────────────────────
    try:
        llm_config = resolve_config(cli_base_url=base_url, cli_model=model)
    except RuntimeError as exc:
        console.print(f"[red]LLM config error:[/red] {exc}")
        raise typer.Exit(1)

    console.print(f"  LLM: [cyan]{llm_config.model}[/cyan] @ {llm_config.base_url}")
    console.print()

    # ── 6b. Load build config (structured placeholders) ───────────────
    config_path = _resolve_config_path(project_root, config)
    if config_path and config_path.exists():
        config_values = _load_build_config(config_path)
        console.print(f"  Build config: [cyan]{config_path}[/cyan]")
        if config_values:
            cfg_keys = [k for k in config_values if k not in ("P_DISC", "P_REQ", "P_STKE", "P_ADMP", "P_BPCM", "P_APP", "P_DATA", "P_TECH", "P_APPR", "P_GAPA", "P_TRANS", "P_BORD", "P_ACHG")]
            if cfg_keys:
                console.print(f"  Placeholders from config: {', '.join(cfg_keys)}")
    else:
        config_values = {}
        if config:
            console.print(f"  [yellow]Config not found: {config}[/yellow]")

    # ── 7. Load or create state ─────────────────────────────────────────
    state = load_state(str(project_root))
    if state is None or resume:
        if state is None:
            state = State(
                version="1.0",
                recipe=recipe_obj.name,
                recipe_path=str(recipe_path),
                project=project_root.name,
            )
        elif resume:
            console.print("[cyan]Resuming previous build...[/cyan]")
    else:
        console.print("[cyan]Fresh build (no previous state).[/cyan]")

    # ── 8. Filter waves based on --resume ───────────────────────────────
    if resume and state.completed_waves:
        waves = [w for w in waves if w.number not in state.completed_waves]
        if not waves:
            console.print(
                "[green]All waves already completed. Nothing to do.[/green]"
            )
            _print_summary(state, recipe_obj, project_root)
            raise typer.Exit(0)

    # --refresh forces specific target + downstream
    refresh_set: set[str] = set()
    if refresh:
        refresh_set = {refresh}

    # ── 9. Execute waves ─────────────────────────────────────────────────
    build_start = time.monotonic()
    all_results: list[dict] = []  # Per-target build results for summary

    # Persistent placeholder values — collected once, reused across all waves
    # Map: placeholder → (base_label, default)
    _PLACEHOLDER_BASES: dict[str, tuple[str, str]] = {
        "P": ("Project short ID for artifact naming (e.g. ent-mod)", "001"),
        "NAME": ("Project display name (e.g. Enterprise Modernization)", "myproject"),
        "DISC_SCOPE": ("Discovery scope for current-state capture. Include:\n- Current enterprise systems (applications, platforms, infrastructure)\n- Current business capabilities (and optionally business processes, customer journeys)\n- Business/technology pain points or improvement opportunities", "all enterprise systems"),
        "REQ_SCOPE": ("Requirements focus areas (comma-separated topics)", "cloud migration, PCI-DSS compliance"),
        "STKE_SCOPE": ("Stakeholder priorities to capture (comma-separated)", "CFO cost savings, CTO innovation"),
        # Phase-specific derived placeholders — auto-derived from {P} with inheritance.
        # Labels used only when the user explicitly overrides the default.
        "P_DISC": ("Discovery phase project ID", None),
        "P_REQ": ("Requirements phase project ID", None),
        "P_STKE": ("Stakeholder phase project ID", None),
        "P_ADMP": ("Preliminary phase project ID", None),
        "P_BPCM": ("Business capability phase project ID", None),
        "P_APP": ("Application inventory phase project ID", None),
        "P_DATA": ("Data architecture phase project ID", None),
        "P_TECH": ("Technology architecture phase project ID", None),
        "P_APPR": ("Application rationalization phase project ID", None),
        "P_GAPA": ("Gap analysis phase project ID", None),
        "P_TRANS": ("Transition planning phase project ID", None),
        "P_BORD": ("Architecture board phase project ID", None),
        "P_ACHG": ("Change management phase project ID", None),
    }
    # Phase context per target (target_id → ADM phase description)
    _TARGET_PHASES: dict[str, str] = {
        "PRIN": "Preliminary: Foundations",
        "DISC": "Preliminary: Current State Discovery",
        "REQ": "Phase A: Requirements Vision",
        "STKE": "Phase A: Stakeholder Alignment",
        "STRATEGY": "Phase A: Strategic Positioning",
        "ADMP": "Preliminary Phase",
        "BPCM": "Phase B: Business Capability",
        "APP": "Phase C: Application Inventory",
        "DATA": "Phase C: Data Architecture",
        "TECH": "Phase D: Technology Architecture",
        "APPR": "Phase C/D: Rationalization",
        "GAPA": "Phase E: Gap Analysis",
        "TRANS": "Phase F: Transition Planning",
        "BORD": "Governance: Architecture Board",
        "ACHG": "Phase H: Change Management",
        "REPO": "Phase G: Repository Synthesis",
    }
    # Persistent placeholder values — load from state, seed with project defaults
    wave_values: dict[str, str] = {
        "P": "001",
        "NAME": project_root.name,
    }
    # Merge with previously collected values from state
    if state.wave_values:
        wave_values.update(state.wave_values)

    # ── Load build config (if available) ──────────────────────────────
    # Config values override seeds but NOT --resume state values.
    # On fresh builds, config takes full precedence.
    if not resume:
        config_path = _resolve_config_path(project_root, config)
        if config_path and config_path.exists():
            config_values = _load_build_config(config_path)
            console.print(f"  Build config: [cyan]{config_path}[/cyan]")
            cfg_main = [k for k in config_values
                        if k not in ("P_DISC", "P_REQ", "P_STKE", "P_ADMP", "P_BPCM",
                                     "P_APP", "P_DATA", "P_TECH", "P_APPR", "P_GAPA",
                                     "P_TRANS", "P_BORD", "P_ACHG")]
            if cfg_main:
                console.print(f"  Placeholders from config: {', '.join(cfg_main)}")
            wave_values.update(config_values)
        elif config:
            console.print(f"  [yellow]Config not found: {config}[/yellow]")

    # Phase IDs that get {P_<ID>} derived from {P}
    _PHASE_IDS = ["DISC", "REQ", "STKE", "ADMP", "BPCM", "APP", "DATA", "TECH",
                  "APPR", "GAPA", "TRANS", "BORD", "ACHG"]
    # Track user overrides — overridden keys never re-derived
    _user_overrides: set[str] = set()

    def _derive_p_placeholders():
        """Auto-derive {P_<ID>} from {P}. Re-derives each wave unless user explicitly overrode."""
        base_p = wave_values.get("P") or project_root.name
        for phase_id in _PHASE_IDS:
            key = f"P_{phase_id}"
            if key not in _user_overrides:
                wave_values[key] = f"{base_p}-{phase_id}"

    # Initial derivation (from seed or state)
    _derive_p_placeholders()

    for wave in waves:
        # Re-derive each wave — picks up any newly captured {P} or {NAME}
        _derive_p_placeholders()
        wave_number = wave.number
        wave_start = time.monotonic()

        # Filter out already-complete targets (--resume)
        active_targets: list[Target] = []
        skip_count = 0
        for t in wave.targets:
            # First check state-based skipping (--resume)
            if resume and state.targets.get(t.id, {}).status == "complete":
                skip_count += 1
                continue
            if refresh_set and t.id not in refresh_set:
                # Check if it's downstream of refresh target
                # For simplicity, only skip if already complete
                if state.targets.get(t.id, {}).status == "complete":
                    skip_count += 1
                    continue
            active_targets.append(t)

        if not active_targets:
            console.print(
                f"  [dim]Wave {wave_number}[/dim]: "
                f"[green]all targets up-to-date[/green]"
            )
            state.completed_waves.append(wave_number)
            save_state(str(project_root), state)
            continue

        # ── Check file existence BEFORE prompting (deduplicated helper) ──
        def _check_target_file_exists(target: Target) -> str | None:
            """Resolve candidate paths and return existing file path, or None."""
            if not target.output:
                return None
            possible_paths: list[str] = []
            if "path" in target.output:
                possible_paths.append(target.output["path"])
            elif "project" in target.output:
                artifact = f"ARC-001-{target.output.get('type', 'OUT')}-v1.0.md"
                possible_paths.append(f"projects/{target.output['project']}/{artifact}")
                for pid in (wave_values.get('P', ''), project_root.name):
                    if pid:
                        possible_paths.append(f"projects/{pid}/{artifact}")
                fixture_dir = project_root / ".arckit" / "scripts" / "autoresearch" / "fixtures"
                if fixture_dir.is_dir():
                    for sd in sorted(fixture_dir.iterdir()):
                        if sd.is_dir():
                            possible_paths.append(str(sd / artifact))
            for raw in possible_paths:
                resolved = raw
                for k, v in wave_values.items():
                    resolved = resolved.replace("{" + k + "}", v)
                if not Path(resolved).is_absolute():
                    resolved = str(project_root / resolved)
                if Path(resolved).is_file():
                    return resolved
            return None

        # Filter active_targets by file existence BEFORE prompting
        still_active: list[Target] = []
        early_skipped: list[Target] = []
        for t in active_targets:
            existing_path = _check_target_file_exists(t)
            if existing_path:
                console.print(
                    f"  [dim]⏭ {t.id}: skipped (file exists: {Path(existing_path).name})[/dim]"
                )
                early_skipped.append(t)
            else:
                still_active.append(t)

        # Replace active_targets with non-file-satisfied targets
        active_targets = still_active

        # Mark early-skipped targets in state
        for t in early_skipped:
            existing_path = _check_target_file_exists(t)
            if existing_path:
                mark_target_skipped(state, t.id, existing_path)
                all_results.append({
                    "target_id": t.id,
                    "status": "skipped",
                    "status_icon": "[dim]⏭[/dim]",
                    "duration": 0,
                    "tokens": 0,
                    "output_path": existing_path,
                })

        if not active_targets:
            console.print(
                f"  [dim]Skipping wave (all targets have valid outputs)[/dim]"
            )
            state.completed_waves.append(wave_number)
            save_state(str(project_root), state)
            continue

        target_ids = [t.id for t in active_targets]
        console.print(
            f"  [bold]Wave {wave_number}[/bold]: "
            f"[magenta]{', '.join(target_ids)}[/magenta]"
            + (f" (skipped {skip_count + len(early_skipped)})" if skip_count + len(early_skipped) else "")
        )

        # Determine which placeholders are needed by remaining active targets
        needed_placeholders: set[str] = set()
        for t in active_targets:
            if t.args:
                for m in re.finditer(r"\{(\w+)\}", str(t.args)):
                    needed_placeholders.add(m.group(1))
            if t.output:
                for v in t.output.values():
                    for m in re.finditer(r"\{(\w+)\}", str(v)):
                        needed_placeholders.add(m.group(1))

        # Prompt only for uncollected placeholders needed by remaining targets
        uncollected = needed_placeholders - set(wave_values.keys())
        if uncollected and sys.stdin.isatty():
            console.print()
            console.print("[yellow]Wave requires placeholder values:[/yellow]")
            try:
                for placeholder in sorted(uncollected):
                    base_label, default = _PLACEHOLDER_BASES.get(placeholder, (placeholder, ""))
                    target_ids = []
                    for t in active_targets:
                        if re.search(r"\{" + placeholder + r"\}", str(t.args or "") + str(t.output or {})):
                            target_ids.append(t.id)
                    if target_ids:
                        phases = [_TARGET_PHASES.get(tid) or tid for tid in target_ids]
                        label = f"[{', '.join(phases)}] {base_label}"
                    else:
                        label = base_label
                    result = typer.prompt(f"  {label}", default=default)
                    value = result if result.strip() else default
                    wave_values[placeholder] = value
                    # Track override: if user typed something different from the default,
                    # mark as user-overridden so _derive_p_placeholders won't clobber it
                    if placeholder.startswith("P_") and result.strip() != default:
                        _user_overrides.add(placeholder)
            except (EOFError, KeyboardInterrupt):
                console.print("[yellow]  (Aborted — using defaults)[/yellow]")

        # Resolve targets
        import dataclasses
        resolved_targets: list[Target] = []
        for t in active_targets:
            resolved_args = str(t.args) if t.args else ""
            for k, v in wave_values.items():
                resolved_args = resolved_args.replace("{" + k + "}", v)
            resolved_output = None
            if t.output:
                resolved_output = {}
                for out_k, out_v in t.output.items():
                    resolved_output[out_k] = str(out_v)
                    for k, v in wave_values.items():
                        resolved_output[out_k] = resolved_output[out_k].replace("{" + k + "}", v)
            new_t = t
            if t.args:
                new_t = dataclasses.replace(new_t, args=resolved_args)
            if resolved_output:
                new_t = dataclasses.replace(new_t, output=resolved_output)
            resolved_targets.append(new_t)

        active_targets = resolved_targets

        # ── Check dependencies for remaining targets ──
        def _dep_satisfied(dep_id: str) -> bool:
            ts = state.targets.get(dep_id)
            if ts and ts.status in ("complete", "skipped"):
                return True
            # Check dep file exists on disk
            for cand in recipe_obj.targets:
                if cand.id == dep_id:
                    return _check_target_file_exists(cand) is not None
            return False

        targets_to_execute: list[Target] = []
        targets_skipped: list[tuple[Target, str]] = []
        for t in active_targets:
            # Only required deps block execution; optional_deps never block
            deps_complete = all(_dep_satisfied(dep_id) for dep_id in t.deps)
            if not deps_complete:
                # Hard block: skip targets with unsatisfied required deps
                missing = [d for d in t.deps if not _dep_satisfied(d)]
                console.print(
                    f"  [yellow]⏭ {t.id}: skipped (missing required deps: {', '.join(missing)})[/yellow]"
                )
                continue
            existing_path = _check_target_file_exists(t)
            if existing_path:
                console.print(
                    f"  [dim]⏭ {t.id}: skipped (file exists: {Path(existing_path).name})[/dim]"
                )
                targets_skipped.append((t, existing_path))
                continue
            targets_to_execute.append(t)

        # Mark skipped targets in state
        for t, existing_path in targets_skipped:
            mark_target_skipped(state, t.id, existing_path)
            all_results.append({
                "target_id": t.id,
                "status": "skipped",
                "status_icon": "[dim]⏭[/dim]",
                "duration": 0,
                "tokens": 0,
                "output_path": existing_path,
            })

        active_targets = targets_to_execute

        if not active_targets:
            console.print("  [dim]Skipping wave (all targets have valid outputs)[/dim]")
            save_state(str(project_root), state)
            continue

        # NOW build tasks_for_wave from resolved targets
        tasks_for_wave: list[tuple[Target, Path, dict]] = []
        for t in active_targets:
            # Resolve skill path
            try:
                skill_path = _resolve_skill_path_cli(t.skill, project_root)
            except FileNotFoundError as exc:
                console.print(f"  [red]✗ {t.id}[/red] {exc}")
                mark_target_failed(state, t.id, str(exc))
                save_state(str(project_root), state)
                raise typer.Exit(1)

            # Gather input artifacts from dependency outputs
            # Summarize to avoid context overflow (raw artifacts can be 50K+ tokens)
            def _summarize_artifact(content: str, max_chars: int = 8000) -> str:
                """Summarize artifact: keep headings/structure, trim body text."""
                if len(content) <= max_chars:
                    return content
                # Keep title and first few sections, truncate rest
                lines = content.split("\n")
                result_lines: list[str] = []
                section_count = 0
                max_sections = 3
                for line in lines:
                    if line.startswith("#"):
                        result_lines.append(line)
                        section_count += 1
                        if section_count > max_sections:
                            result_lines.append(f"\n... ({len(lines) - len(result_lines)} lines omitted for brevity)")
                            break
                    elif line.strip() and not line.startswith("#"):
                        if section_count <= max_sections:
                            result_lines.append(line)
                if len(result_lines) < len(lines):
                    result_lines.append(f"\n[Truncated: full artifact not shown]")
                return "\n".join(result_lines)

            # ── Gather input artifacts from deps (state + disk) ──
            def _get_dep_file_path(dep_id: str) -> str | None:
                # Check state first
                dep_state = state.targets.get(dep_id)
                if dep_state and dep_state.output_path:
                    p = Path(dep_state.output_path)
                    for k, v in wave_values.items():
                        ps = str(p)
                        ps = ps.replace("{" + k + "}", v)
                        if not Path(ps).is_absolute():
                            ps = str(project_root / ps)
                        if Path(ps).is_file():
                            return ps
                # Fallback: search disk via recipe
                for cand in recipe_obj.targets:
                    if cand.id == dep_id:
                        path = _check_target_file_exists(cand)
                        if path:
                            return path
                return None

            input_artifacts: dict[str, str] = {}
            # Gather from required deps (always present) + optional deps (if available)
            all_dep_ids = list(t.deps) + list(t.optional_deps)
            for dep_id in all_dep_ids:
                dep_path = _get_dep_file_path(dep_id)
                if dep_path and Path(dep_path).is_file():
                    raw = Path(dep_path).read_text(encoding="utf-8", errors="replace")
                    input_artifacts[dep_id] = _summarize_artifact(raw)

            tasks_for_wave.append((t, skill_path, input_artifacts))

        # Execute wave via asyncio
        wave_results = asyncio.run(
            _execute_wave_with_artifacts(
                wave, tasks_for_wave, llm_config, project_root, parallel
            )
        )

        # Process results
        for result in wave_results:
            duration = time.monotonic() - wave_start

            # Determine output path for state tracking
            output_path = result.output_path or ""
            input_files: list[str] = []
            for t in active_targets:
                if t.id == result.target_id and t.output:
                    # Handle output formats: {"path": "..."} or {"project": "...", "type": "..."}
                    if "path" in t.output:
                        output_path = t.output["path"]
                    elif "project" in t.output:
                        # Construct conventional path: projects/{project}/{type}.md
                        output_path = f"projects/{t.output['project']}/ARC-001-{t.output.get('type', 'OUT')}-v1.0.md"
                    # Expand to absolute path
                    if output_path and not Path(output_path).is_absolute():
                        output_path = str(project_root / output_path)
                    if output_path:
                        input_files = [
                            str(project_root / "**/*.md"),
                            str(project_root / "projects" / "**/*.md"),
                        ]

            if result.status == "success":
                # Resolve output path — guard against empty/invalid paths
                resolved_path = None
                if output_path and Path(output_path).is_file():
                    resolved_path = output_path
                elif result.output_path and Path(result.output_path).is_file():
                    resolved_path = result.output_path

                if resolved_path:
                    mark_target_complete(state, result.target_id, resolved_path, input_files)
                else:
                    # Output path unresolved (e.g. template placeholders not expanded)
                    # Mark complete with result's own path to avoid crash
                    from arckit_cli.state import TargetState as _TS
                    import datetime as _dt
                    state.targets[result.target_id] = _TS(
                        status="complete",
                        output_path=output_path or result.output_path,
                        completed_at=_dt.datetime.now(_dt.timezone.utc).isoformat(),
                    )
                status_icon = "[green]✓[/green]"
                status_label = "complete"
            else:
                mark_target_failed(
                    state, result.target_id, result.error or "unknown error"
                )
                status_icon = "[red]✗[/red]"
                status_label = "failed"

            elapsed = time.monotonic() - wave_start
            all_results.append({
                "target_id": result.target_id,
                "status": status_label,
                "status_icon": status_icon,
                "duration": elapsed,
                "tokens": result.tokens_used,
                "output_path": output_path,
            })

            console.print(
                f"    {status_icon} {result.target_id}: "
                            f"[{'green' if result.status == 'success' else 'red'}]"
                            f"{status_label}[/{'green' if result.status == 'success' else 'red'}]"
                            f" ({result.tokens_used:,} tokens)"
            )

            if result.status != "success":
                console.print(f"      [red]Error: {result.error}[/red]")
                # Halt on failure by default
                save_state(str(project_root), state)
                console.print(
                    "\n[red]Build halted due to failed target.[/red]"
                    " Use --continue (future flag) to proceed."
                )
                _print_summary(state, recipe_obj, project_root, all_results)
                raise typer.Exit(1)

        wave_duration = time.monotonic() - wave_start
        state.completed_waves.append(wave_number)
        state.wave_values = wave_values
        save_state(str(project_root), state)

        console.print(
            f"  [dim]Wave {wave_number} done in "
            f"{_format_duration(wave_duration)}[/dim]"
        )

        # Per-wave git commit
        if not no_commit:
            commit_msg = f"arckit: wave {wave_number} ({', '.join(target_ids)})"
            if _git_commit(project_root, commit_msg):
                console.print(f"  [dim]Committed: {commit_msg}[/dim]")
            else:
                console.print(
                    f"  [yellow]Warning:[/yellow] Git commit failed (wave {wave_number})"
                )

    # ── 10. Post-build hooks ────────────────────────────────────────────
    if recipe_obj.post_build_hooks:
        console.print()
        console.print("[bold]Post-build hooks...[/bold]")
        for hook in recipe_obj.post_build_hooks:
            hook_name = hook.get("name", "unknown")
            console.print(f"  - {hook_name}: [dim]skipped (hooks not implemented yet)[/dim]")
    else:
        console.print()
        console.print("[dim]No post-build hooks defined[/dim]")

    # ── 11. Summary ─────────────────────────────────────────────────────
    total_duration = time.monotonic() - build_start
    console.print()
    _print_summary(state, recipe_obj, project_root, all_results, total_duration)


async def _execute_wave_with_artifacts(
    wave,  # Wave from arckit_cli.recipe
    tasks: list[tuple],
    config,  # LLMConfig
    project_path: Path,
    max_parallel: int = 4,
) -> list:
    """Execute wave targets with pre-resolved artifacts.

    Wraps the llm.execute_wave logic but accepts already-gathered artifacts
    so the build command can inject dependency outputs from prior waves.
    """
    from arckit_cli.llm import execute_target, ExecutionResult

    semaphore = asyncio.Semaphore(max_parallel)

    async def _run(target: object, skill_path: Path, artifacts: dict) -> object:
        async with semaphore:
            return await execute_target(
                target, config, project_path, skill_path, artifacts
            )

    coros = [_run(t, sp, a) for t, sp, a in tasks]
    raw = await asyncio.gather(*coros, return_exceptions=True)

    results: list = []
    for i, r in enumerate(raw):
        if isinstance(r, BaseException):
            results.append(
                ExecutionResult(
                    target_id=tasks[i][0].id,
                    status="failed",
                    error=str(r),
                )
            )
        else:
            results.append(r)

    return results


def _resolve_skill_path_cli(skill_name: str, project_path: Path) -> Path:
    """Resolve a skill name to an absolute file path.

    Precedence:
        1. Direct path (absolute or relative)
        2. extensions/arckit-codex/skills/arckit-{name}/SKILL.md
        3. plugins/*/commands/{command}.md
        4. .agents/skills/arckit-{name}/SKILL.md
        5. Installed package share dirs (Codex, OpenCode, Copilot, etc.)

    Strips 'arckit:' prefix from skill names (e.g. 'arckit:principles' → 'principles').
    """
    # Direct path (absolute or relative to project)
    direct = Path(skill_name)
    if direct.is_absolute() and direct.is_file():
        return direct
    if not direct.is_absolute() and (project_path / direct).is_file():
        return project_path / direct

    # Strip 'arckit:' prefix for command name lookup
    cmd_name = skill_name
    if cmd_name.startswith("arckit:"):
        cmd_name = cmd_name[len("arckit:"):]

    search_paths: list[tuple[str, Path]] = []

    # 1. Codex skills directory (project-local)
    skill_file = project_path / "extensions" / "arckit-codex" / "skills" / f"arckit-{cmd_name}" / "SKILL.md"
    search_paths.append(("Codex skills", skill_file))
    if skill_file.is_file():
        return skill_file

    # 2. Search all plugin commands dirs (project-local)
    plugin_base = project_path / "plugins"
    if plugin_base.is_dir():
        for plugin_cmd_dir in sorted(plugin_base.glob("arckit-*/commands")):
            cmd_file = plugin_cmd_dir / f"{cmd_name}.md"
            search_paths.append((f"plugin: {plugin_cmd_dir.parent.name}", cmd_file))
            if cmd_file.is_file():
                return cmd_file

    # 3. Also check .agents/skills/ (from arckit init)
    agent_skill = project_path / ".agents" / "skills" / f"arckit-{cmd_name}" / "SKILL.md"
    search_paths.append((".agents/skills", agent_skill))
    if agent_skill.is_file():
        return agent_skill

    # 4. Installed package share directories (fallback for pipx/git installs)
    try:
        data_paths = get_data_paths()  # type: ignore[name-defined]

        # 4a. Codex skills (share/arckit/extensions/arckit-codex/skills/arckit-{name}/SKILL.md)
        codex_skills = data_paths.get("codex_skills")
        if codex_skills and codex_skills.is_dir():
            sf = codex_skills / f"arckit-{cmd_name}" / "SKILL.md"
            search_paths.append(("share: Codex skills", sf))
            if sf.is_file():
                return sf

        # 4b. OpenCode commands (share/arckit/extensions/arckit-opencode/commands/arckit.{name}.md)
        oc_commands = data_paths.get("opencode_commands")
        if oc_commands and oc_commands.is_dir():
            cf = oc_commands / f"arckit.{cmd_name}.md"
            search_paths.append(("share: OpenCode commands", cf))
            if cf.is_file():
                return cf

        # 4c. Copilot prompts (share/arckit/extensions/arckit-copilot/prompts/arckit-{name}.prompt.md)
        cp_prompts = data_paths.get("copilot_prompts")
        if cp_prompts and cp_prompts.is_dir():
            pf = cp_prompts / f"arckit-{cmd_name}.prompt.md"
            search_paths.append(("share: Copilot prompts", pf))
            if pf.is_file():
                return pf
    except Exception:
        # get_data_paths() may fail if package is installed via pipx with missing data files
        # Step 5 below provides a direct fallback
        pass

    # 5. Direct pipx share path (fallback in case get_data_paths() fails)
    for pipx_share in [
        Path.home() / ".local" / "pipx" / "venvs" / "arckit-cli" / "share" / "arckit",
        Path.home() / ".local" / "share" / "arckit",
    ]:
        share_ext = pipx_share / "extensions"
        if share_ext.exists():
            # 5a. Codex skills
            sf = share_ext / "arckit-codex" / "skills" / f"arckit-{cmd_name}" / "SKILL.md"
            search_paths.append(("direct share: Codex skills", sf))
            if sf.is_file():
                return sf
            # 5b. OpenCode commands
            cf = share_ext / "arckit-opencode" / "commands" / f"arckit.{cmd_name}.md"
            search_paths.append(("direct share: OpenCode commands", cf))
            if cf.is_file():
                return cf
            # 5c. Copilot prompts
            pf = share_ext / "arckit-copilot" / "prompts" / f"arckit-{cmd_name}.prompt.md"
            search_paths.append(("direct share: Copilot prompts", pf))
            if pf.is_file():
                return pf

    # All search paths exhausted
    path_list = "\n".join(f"  - {p}" for _, p in search_paths)
    raise FileNotFoundError(
        f"Skill '{skill_name}' not found at:\n"
        f"{path_list}"
    )


def _format_duration(seconds: float) -> str:
    """Format a duration in seconds to a human-readable string."""
    if seconds < 60:
        return f"{seconds:.0f}s"
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}m {secs}s"


def _print_summary(
    state: object,
    recipe: object,
    project_root: Path,
    all_results: list[dict] | None = None,
    total_duration: float | None = None,
):
    """Print a Rich summary table of the build results."""
    from rich.table import Table
    from rich.panel import Panel

    table = Table(show_header=True, header_style="bold cyan", show_edge=True)
    table.add_column("Target", style="green")
    table.add_column("Status")
    table.add_column("Duration", justify="right")
    table.add_column("Tokens", justify="right")
    table.add_column("File")

    if all_results:
        for r in all_results:
            out = r["output_path"]
            file_str = Path(out).name if out else "—"
            table.add_row(
                r["target_id"],
                f"{r['status_icon']} {r['status']}",
                _format_duration(r["duration"]),
                f"{r['tokens']:,}" if r["tokens"] else "—",
                file_str,
            )
    elif state.targets:
        for tid, ts in state.targets.items():
            out = ts.output_path or ""
            file_str = Path(out).name if out else "—"
            if ts.status == "complete":
                icon = "✓"
            elif ts.status == "skipped":
                icon = "⏭"
            else:
                icon = "✗"
            table.add_row(
                tid,
                f"{icon} {ts.status}",
                "—",
                "—",
                file_str,
            )

    # Totals row
    total_targets = len(all_results) if all_results else len(state.targets)
    complete = sum(
        1 for r in (all_results or [{"status": ts.status} for ts in state.targets.values()])
        if r.get("status") == "complete"
    ) if all_results else sum(
        1 for ts in state.targets.values() if ts.status == "complete"
    )
    skipped = sum(
        1 for r in (all_results or [{"status": ts.status} for ts in state.targets.values()])
        if r.get("status") == "skipped"
    ) if all_results else sum(
        1 for ts in state.targets.values() if ts.status == "skipped"
    )
    failed = total_targets - complete - skipped
    total_tokens = sum(
        r.get("tokens", 0) or 0 for r in (all_results or [])
    )

    if total_duration is not None:
        duration_str = _format_duration(total_duration)
    else:
        duration_str = "—"

    summary_text = (
        f"Total: {total_targets} targets, "
        f"[green]{complete} complete[/green], "
        f"[dim]{skipped} skipped[/dim], "
        f"{'[red]' if failed else ''}{failed} failed{'[/red]' if failed else ''}, "
        f"{duration_str}"
        + (f", {total_tokens:,} tokens" if total_tokens else "")
    )

    console.print(table)
    console.print(Panel(summary_text, title="Build Summary", border_style="green"))


def main():
    """Main entry point for the ArcKit CLI."""
    app()


if __name__ == "__main__":
    main()
