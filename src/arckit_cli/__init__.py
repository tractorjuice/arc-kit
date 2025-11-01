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
AGENT_CONFIG = {
    "claude": {
        "name": "Claude Code",
        "folder": ".claude/",
        "install_url": "https://docs.anthropic.com/en/docs/claude-code/setup",
        "requires_cli": True,
    },
    "gemini": {
        "name": "Gemini CLI",
        "folder": ".gemini/",
        "install_url": "https://github.com/google-gemini/gemini-cli",
        "requires_cli": True,
    },
    "codex": {
        "name": "OpenAI Codex CLI",
        "folder": ".codex/",
        "install_url": "https://developers.openai.com/codex/cli/",
        "requires_cli": True,
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
    banner_lines = BANNER.strip().split('\n')
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
    # Special handling for Claude CLI
    claude_local_path = Path.home() / ".claude" / "local" / "claude"
    if tool == "claude" and claude_local_path.exists() and claude_local_path.is_file():
        return True

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
            text=True
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
    # First try to find installed package data
    try:
        # Try to find the shared data directory for uv tool installs
        # uv installs tools in ~/.local/share/uv/tools/{package-name}/share/{package}/
        uv_tools_path = Path.home() / ".local" / "share" / "uv" / "tools" / "arckit-cli" / "share" / "arckit"
        if uv_tools_path.exists():
            return {
                "templates": uv_tools_path / ".arckit" / "templates",
                "scripts": uv_tools_path / "scripts",
                "claude_commands": uv_tools_path / ".claude" / "commands",
                "gemini_commands": uv_tools_path / ".gemini" / "commands",
            }

        # Try to find the shared data directory for regular pip installs
        import site
        for site_dir in site.getsitepackages() + [site.getusersitepackages()]:
            if site_dir:
                # Try site-packages/share/arckit
                share_path = Path(site_dir) / "share" / "arckit"
                if share_path.exists():
                    return {
                        "templates": share_path / ".arckit" / "templates",
                        "scripts": share_path / "scripts",
                        "claude_commands": share_path / ".claude" / "commands",
                        "gemini_commands": share_path / ".gemini" / "commands",
                    }

                # Try ../../../share/arckit from site-packages (for system installs)
                share_path = Path(site_dir).parent.parent.parent / "share" / "arckit"
                if share_path.exists():
                    return {
                        "templates": share_path / ".arckit" / "templates",
                        "scripts": share_path / "scripts",
                        "claude_commands": share_path / ".claude" / "commands",
                        "gemini_commands": share_path / ".gemini" / "commands",
                    }

        # Try platformdirs approach for other installs
        data_dir = Path(platformdirs.user_data_dir("arckit"))
        if data_dir.exists():
            return {
                "templates": data_dir / ".arckit" / "templates",
                "scripts": data_dir / "scripts",
                "claude_commands": data_dir / ".claude" / "commands",
                "gemini_commands": data_dir / ".gemini" / "commands",
            }

    except Exception:
        pass

    # Fallback to source directory (development mode)
    source_root = Path(__file__).parent.parent.parent
    return {
        "templates": source_root / ".arckit" / "templates",
        "scripts": source_root / "scripts",
        "claude_commands": source_root / ".claude" / "commands",
        "gemini_commands": source_root / ".gemini" / "commands",
    }


def create_project_structure(project_path: Path, ai_assistant: str):
    """Create the basic ArcKit project structure."""

    console.print("[cyan]Creating project structure...[/cyan]")

    # Create directory structure
    directories = [
        ".arckit/memory",
        ".arckit/scripts/bash",
        ".arckit/templates",
        "projects",
    ]

    agent_folder = AGENT_CONFIG[ai_assistant]["folder"]
    directories.append(f"{agent_folder}commands")

    for directory in directories:
        (project_path / directory).mkdir(parents=True, exist_ok=True)

    console.print("[green]✓[/green] Project structure created")

    return project_path


@app.command()
def init(
    project_name: str = typer.Argument(None, help="Name for your new project directory (optional, use '.' for current directory)"),
    ai_assistant: str = typer.Option(None, "--ai", help="AI assistant to use: claude, gemini, codex"),
    no_git: bool = typer.Option(False, "--no-git", help="Skip git repository initialization"),
    here: bool = typer.Option(False, "--here", help="Initialize project in the current directory"),
):
    """
    Initialize a new ArcKit project for enterprise architecture governance.

    This command will:
    1. Create project directory structure
    2. Copy templates for architecture principles, requirements, SOW, etc.
    3. Set up AI assistant commands
    4. Initialize git repository (optional)

    Examples:
        arckit init my-architecture-project
        arckit init my-project --ai claude
        arckit init . --ai gemini
        arckit init --here --ai claude
    """

    show_banner()

    if project_name == ".":
        here = True
        project_name = None

    if here and project_name:
        console.print("[red]Error:[/red] Cannot specify both project name and --here flag")
        raise typer.Exit(1)

    if not here and not project_name:
        console.print("[red]Error:[/red] Must specify either a project name or use '.' / --here flag")
        raise typer.Exit(1)

    if here:
        project_name = Path.cwd().name
        project_path = Path.cwd()
    else:
        project_path = Path(project_name).resolve()
        if project_path.exists():
            console.print(f"[red]Error:[/red] Directory '{project_name}' already exists")
            raise typer.Exit(1)

    console.print(f"[cyan]Initializing ArcKit project:[/cyan] {project_name}")
    console.print(f"[cyan]Location:[/cyan] {project_path}")

    # Check git
    should_init_git = False
    if not no_git:
        should_init_git = check_tool("git")
        if not should_init_git:
            console.print("[yellow]Git not found - will skip repository initialization[/yellow]")

    # Select AI assistant
    if not ai_assistant:
        console.print("\n[cyan]Select your AI assistant:[/cyan]")
        console.print("1. claude (Claude Code)")
        console.print("2. gemini (Gemini CLI)")
        console.print("3. codex (OpenAI Codex CLI)")

        choice = typer.prompt("Enter choice", default="1")
        ai_map = {"1": "claude", "2": "gemini", "3": "codex"}
        ai_assistant = ai_map.get(choice, "claude")

    if ai_assistant not in AGENT_CONFIG:
        console.print(f"[red]Error:[/red] Invalid AI assistant '{ai_assistant}'")
        console.print(f"Choose from: {', '.join(AGENT_CONFIG.keys())}")
        raise typer.Exit(1)

    console.print(f"[cyan]Selected AI assistant:[/cyan] {AGENT_CONFIG[ai_assistant]['name']}")

    # Create project structure
    create_project_structure(project_path, ai_assistant)

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
    commands_dst = project_path / agent_folder / "commands"

    # Copy templates if they exist
    if templates_src.exists():
        console.print(f"[dim]Copying templates from: {templates_src}[/dim]")
        template_count = 0
        for template_file in templates_src.glob("*.md"):
            shutil.copy2(template_file, templates_dst / template_file.name)
            template_count += 1
        console.print(f"[green]✓[/green] Copied {template_count} templates")
    else:
        console.print(f"[yellow]Warning: Templates not found at {templates_src}[/yellow]")

    # Copy scripts if they exist
    if scripts_src.exists():
        console.print(f"[dim]Copying scripts from: {scripts_src}[/dim]")
        shutil.copytree(scripts_src, scripts_dst, dirs_exist_ok=True)
        console.print(f"[green]✓[/green] Scripts copied")
    else:
        console.print(f"[yellow]Warning: Scripts not found at {scripts_src}[/yellow]")

    # Copy slash commands if they exist (for Claude and Codex)
    if ai_assistant in ["claude", "codex"]:
        commands_src = data_paths["claude_commands"]
        if commands_src.exists():
            console.print(f"[dim]Copying Claude commands from: {commands_src}[/dim]")
            command_count = 0
            for command_file in commands_src.glob("arckit.*.md"):
                shutil.copy2(command_file, commands_dst / command_file.name)
                command_count += 1
            console.print(f"[green]✓[/green] Copied {command_count} Claude commands")
        else:
            console.print(f"[yellow]Warning: Claude commands not found at {commands_src}[/yellow]")
    elif ai_assistant == "gemini":
        commands_src = data_paths["gemini_commands"]
        if commands_src.exists():
            console.print(f"[dim]Copying Gemini commands from: {commands_src}[/dim]")
            shutil.copytree(commands_src, commands_dst, dirs_exist_ok=True)
            console.print(f"[green]✓[/green] Gemini commands copied")
        else:
            console.print(f"[yellow]Warning: Gemini commands not found at {commands_src}[/yellow]")

    console.print("[green]✓[/green] Templates configured")

    # Create README
    readme_content = f"""# {project_name}

Enterprise Architecture Governance Project

## Getting Started

This project uses ArcKit for enterprise architecture governance and vendor procurement.

### Available Commands

Once you start your AI assistant, you'll have access to these commands:

#### Core Workflow
- `/arckit.principles` - Create or update architecture principles
- `/arckit.requirements` - Define comprehensive requirements
- `/arckit.sow` - Generate Statement of Work (RFP)

#### Vendor Management
- `/arckit.evaluate` - Create vendor evaluation framework
- `/arckit.compare` - Compare vendor proposals

#### Design Review
- `/arckit.hld-review` - Review High-Level Design
- `/arckit.dld-review` - Review Detailed Design

#### Traceability
- `/arckit.traceability` - Generate requirements traceability matrix

## Project Structure

```
{project_name}/
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md (global principles)
│   ├── scripts/
│   │   └── bash/
│   └── templates/
├── projects/
│   └── 001-project-name/
│       ├── requirements.md
│       ├── sow.md
│       └── vendors/
└── {AGENT_CONFIG[ai_assistant]['folder']}commands/
```

## Next Steps

1. Start your AI assistant ({AGENT_CONFIG[ai_assistant]['name']})
2. Run `/arckit.principles` to establish architecture governance
3. Create your first project with `/arckit.requirements`

## Documentation

- [ArcKit Documentation](https://github.com/github/arc-kit)
- [Architecture Principles Guide](https://github.com/github/arc-kit/docs/principles.md)
- [Vendor Procurement Guide](https://github.com/github/arc-kit/docs/procurement.md)
"""

    (project_path / "README.md").write_text(readme_content)
    console.print("[green]✓[/green] README created")

    # Initialize git if requested
    if should_init_git and not is_git_repo(project_path):
        init_git_repo(project_path)

    # Create .envrc for Codex projects
    if ai_assistant == "codex":
        console.print("[cyan]Setting up Codex environment...[/cyan]")

        # Create .envrc
        envrc_path = project_path / ".envrc"
        envrc_content = f"""# Auto-generated by arckit CLI for Codex CLI support
# This file sets CODEX_HOME so Codex can discover project-specific prompts
# See: https://developers.openai.com/codex/cli/

export CODEX_HOME="$PWD/.codex"
"""
        envrc_path.write_text(envrc_content)

        # Create/update .gitignore
        gitignore_path = project_path / ".gitignore"
        codex_ignore_entries = [
            "# Codex CLI - exclude auth tokens but include prompts",
            ".codex/*",
            "!.codex/prompts/",
            "",
            "# direnv",
            ".envrc.local",
        ]

        if gitignore_path.exists():
            existing_content = gitignore_path.read_text()
            if ".codex" not in existing_content:
                with open(gitignore_path, 'a') as f:
                    f.write("\n" + "\n".join(codex_ignore_entries) + "\n")
        else:
            gitignore_path.write_text("\n".join(codex_ignore_entries) + "\n")

        console.print("[green]✓[/green] Codex environment configured (.envrc created)")

    # Success message
    console.print("\n[bold green]✓ ArcKit project initialized successfully![/bold green]\n")

    next_steps = [
        f"1. Navigate to project: [cyan]cd {project_name if not here else '.'}[/cyan]",
    ]

    # Add Codex-specific setup steps
    if ai_assistant == "codex":
        next_steps.append("2. Set up CODEX_HOME environment variable:")
        next_steps.append("   [cyan]RECOMMENDED[/cyan]: Install direnv and run [cyan]direnv allow[/cyan]")
        next_steps.append("   Alternative: Run [cyan]export CODEX_HOME=\"$PWD/.codex\"[/cyan]")
        next_steps.append(f"3. Start Codex: [cyan]{ai_assistant}[/cyan]")
        next_steps.append("4. Establish architecture principles: [cyan]/arckit.principles[/cyan]")
        next_steps.append("5. Create your first project: [cyan]/arckit.requirements[/cyan]")
    else:
        next_steps.append(f"2. Start your AI assistant: [cyan]{ai_assistant}[/cyan]")
        next_steps.append("3. Establish architecture principles: [cyan]/arckit.principles[/cyan]")
        next_steps.append("4. Create your first project: [cyan]/arckit.requirements[/cyan]")

    console.print(Panel("\n".join(next_steps), title="Next Steps", border_style="cyan"))


@app.command()
def check():
    """Check that all required tools are installed."""
    show_banner()
    console.print("[bold]Checking for installed tools...[/bold]\n")

    tools = {
        "git": "Version control",
        "claude": "Claude Code",
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
    if ctx.invoked_subcommand is None and "--help" not in sys.argv and "-h" not in sys.argv:
        show_banner()
        console.print(Align.center("[dim]Run 'arckit --help' for usage information[/dim]"))
        console.print()


def main():
    """Main entry point for the ArcKit CLI."""
    app()


if __name__ == "__main__":
    main()
