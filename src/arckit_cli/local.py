"""
ArcKit LLM Configuration

Configure an OpenAI-compatible API endpoint (base_url, model, api_key) for
ArcKit to use.  Works with any backend that speaks the OpenAI chat
completions protocol — local servers (Ollama, SGLang, vLLM) or hosted APIs
(OpenAI, Anthropic proxy, etc.).

Commands:
    arckit local setup    Interactive config wizard
    arckit local status   Show current config + connection health
    arckit local test     Ping the configured endpoint
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Optional

import httpx
import platformdirs
import typer
import yaml
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------

CONFIG_KEY = "llm"
CONFIG_FILE = "config.yaml"


def _get_config_path() -> Path:
    return Path(platformdirs.user_config_dir("arckit")) / CONFIG_FILE


def _load_config() -> dict:
    path = _get_config_path()
    if not path.exists():
        return {}
    try:
        return yaml.safe_load(path.read_text()) or {}
    except Exception:
        return {}


def _save_config(cfg: dict) -> Path:
    path = _get_config_path()
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    path.write_text(yaml.dump(cfg, default_flow_style=False))
    path.chmod(0o600)
    return path


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def _ping_endpoint(base_url: str, model: str, timeout: int = 15) -> dict:
    """Send a minimal chat request and return status info."""
    t0 = time.time()
    resp = httpx.post(
        f"{base_url}/v1/chat/completions",
        json={
            "model": model,
            "messages": [{"role": "user", "content": "OK"}],
            "max_tokens": 1,
        },
        timeout=timeout,
    )
    latency_ms = int((time.time() - t0) * 1000)

    result: dict = {
        "connected": resp.status_code == 200,
        "status": resp.status_code,
        "latency_ms": latency_ms,
    }

    if resp.status_code == 200:
        data = resp.json()
        usage = data.get("usage", {})
        result["prompt_tokens"] = usage.get("prompt_tokens", "—")
        result["completion_tokens"] = usage.get("completion_tokens", "—")
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        result["response"] = content.strip()

    return result


# ---------------------------------------------------------------------------
# Typer app
# ---------------------------------------------------------------------------

local_app = typer.Typer(
    name="local",
    help="Configure OpenAI-compatible LLM endpoints",
    add_completion=False,
)


@local_app.command()
def setup(
    base_url: Optional[str] = typer.Option(None, "--base-url", help="API base URL"),
    model: Optional[str] = typer.Option(None, "--model", help="Model name"),
    api_key: Optional[str] = typer.Option(None, "--api-key", help="API key"),
    max_tokens: Optional[int] = typer.Option(None, "--max-tokens", help="Max tokens"),
    temperature: Optional[float] = typer.Option(None, "--temperature", help="Temperature"),
):
    """Interactive wizard to configure an OpenAI-compatible LLM endpoint."""

    cfg = _load_config()
    llm = cfg.get(CONFIG_KEY, {})

    # Pre-fill with existing values
    existing_base = llm.get("base_url", "")
    existing_model = llm.get("model", "")
    existing_key = llm.get("api_key", "")
    existing_max = int(llm.get("max_tokens", 128000))
    existing_temp = float(llm.get("temperature", 0.0))

    console.print(Panel(
        "[bold]ArcKit LLM Configuration[/bold]\n\n"
        "Configure an OpenAI-compatible endpoint for ArcKit. "
        "Works with any server supporting the /v1/chat/completions API — "
        "local (Ollama, SGLang, vLLM) or cloud.\n\n"
        "Config stored at: " + str(_get_config_path()),
        title="🔧 LLM Setup",
        border_style="bright_blue",
    ))

    # ── 1. Base URL ──
    console.print("\n[cyan]1. API Base URL[/cyan]")
    console.print("   The address of your LLM server's OpenAI-compatible endpoint.\n")

    console.print("   [bold]Common presets:[/bold]")
    console.print("     [magenta]1[/magenta].  http://127.0.0.1:11434      — Ollama (default port)")
    console.print("     [magenta]2[/magenta].  http://127.0.0.1:8000       — SGLang / vLLM (default port)")
    console.print("     [magenta]3[/magenta].  http://127.0.0.1:8080       — SGLang custom port")
    console.print("     [magenta]4[/magenta].  https://api.openai.com   — OpenAI cloud API")
    console.print("     [magenta]5[/magenta].  Enter a custom URL\n")

    choice = typer.prompt("Select a preset (1-5)", default="1")
    if choice in ("1",):
        base_url = "http://127.0.0.1:11434"
    elif choice in ("2",):
        base_url = "http://127.0.0.1:8000"
    elif choice in ("3",):
        base_url = "http://127.0.0.1:8080"
    elif choice in ("4",):
        base_url = "https://api.openai.com"
    else:
        base_url = typer.prompt(
            "Custom base URL  (e.g. http://192.168.1.50:8080)",
            default=existing_base if existing_base else "",
            show_default=False,
        )

    if base_url:
        base_url = base_url.rstrip("/")

    # ── 2. Model Name ──
    console.print("\n[cyan]2. Model Name[/cyan]")
    console.print("   The model identifier your server expects.\n")

    console.print("   [bold]Examples by server type:[/bold]")
    console.print("     Ollama:    qwen2.5:32b   |   qwen3:32b   |   llama3.3:8b")
    console.print("     SGLang:    Qwen/Qwen3.6-27B-NVFP4  |  Qwen2.5-14B-Instruct-AWQ")
    console.print("     OpenAI:    gpt-4o  |  gpt-4o-mini\n")
    
    model_input = typer.prompt(
        "Model name",
        default=existing_model or "Qwen3.6-27B",
        show_default=True,
    )

    # ── 3. API Key ──
    console.print("\n[cyan]3. API Key[/cyan]")
    console.print("   Leave empty for local endpoints (Ollama, SGLang, vLLM).")
    console.print("   Required for cloud APIs (OpenAI, Azure, etc.).\n")
    
    api_key = typer.prompt(
        "API key  (press Enter to leave empty for local)",
        default=existing_key,
        show_default=False,
    )

    # ── 4. Max Tokens ──
    console.print("\n[cyan]4. Max Tokens per Response[/cyan]")
    console.print("   Controls the maximum output length.\n")
    console.print("   [bold]Examples:[/bold]")
    console.print("     4096    — short responses (chat, code snippets)")
    console.print("     32768   — medium (reports, design docs)")
    console.print("     128000  — large (full architecture documents)\n")

    max_tokens_str = typer.prompt(
        "Max tokens",
        default=str(existing_max),
        show_default=True,
    )

    # ── 5. Temperature ──
    console.print("\n[cyan]5. Temperature[/cyan]")
    console.print("   Controls randomness. Lower = more deterministic.\n")
    console.print("   [bold]Examples:[/bold]")
    console.print("     0.0  — deterministic (recommended for architecture docs)")
    console.print("     0.3  — slight variation (creative tasks)")
    console.print("     1.0  — maximum variation (brainstorming)\n")

    temp_str = typer.prompt(
        "Temperature",
        default=str(existing_temp),
        show_default=True,
    )

    # ── Save ──
    cfg[CONFIG_KEY] = {
        "provider": "openai-compatible",
        "base_url": base_url,
        "model": model_input,
        "api_key": api_key,
        "max_tokens": int(max_tokens_str),
        "temperature": float(temp_str),
    }

    config_path = _save_config(cfg)
    console.print(f"\n[green]✓[/green] Saved config → {config_path}")
    console.print(f"  Endpoint: {base_url}")
    console.print(f"  Model:    {model_input}")
    console.print(f"  API Key:  {'*' * 8 + '...' if api_key else '(empty)'}")
    console.print(f"  Tokens:   {cfg[CONFIG_KEY]['max_tokens']}  |  Temp: {cfg[CONFIG_KEY]['temperature']}")

    # ── Test connection ──
    console.print(f"\n[cyan]Testing {model_input} @ {base_url}...[/cyan]")
    try:
        result = _ping_endpoint(base_url if base_url else "", model_input, timeout=30)
        if result["connected"]:
            console.print(f"[bold green]✓ Connected[/bold green]  ({result['latency_ms']}ms)")
            console.print(f"  Tokens: {result['prompt_tokens']} in / {result['completion_tokens']} out")
        else:
            console.print(f"[yellow]⚠ Endpoint returned {result['status']}[/yellow]")
    except httpx.ConnectError:
        console.print(f"[yellow]⚠ Cannot connect to {base_url}[/yellow]")
        console.print("  Make sure your LLM server is running and accessible.")
    except httpx.TimeoutException:
        console.print("[yellow]⚠ Connection timed out[/yellow]")
    except Exception as e:
        console.print(f"[yellow]⚠ {e}[/yellow]")

    console.print(f"\n[dim]Ready. Use:[/dim]")
    console.print(f"  arckit init my-project --ai opencode")
    console.print(f"  cd my-project && arckit build --recipe strategy")


@local_app.command()
def status():
    """Show current LLM configuration and connection status."""

    cfg = _load_config()
    llm = cfg.get(CONFIG_KEY, {})

    base_url = llm.get("base_url", "—")
    model = llm.get("model", "—")
    provider = llm.get("provider", "—")
    api_key = llm.get("api_key", "")
    max_tokens = llm.get("max_tokens", "—")
    temperature = llm.get("temperature", "—")

    table = Table(title="LLM Configuration")
    table.add_column("Setting", style="cyan")
    table.add_column("Value")

    table.add_row("Provider", str(provider))
    table.add_row("Base URL", str(base_url))
    table.add_row("Model", str(model))
    table.add_row("API Key", f"{'*' * 8 + '...' if api_key else '(empty)'}")
    table.add_row("Max Tokens", str(max_tokens))
    table.add_row("Temperature", str(temperature))
    table.add_row("Config File", str(_get_config_path()))

    console.print(table)

    # Connectivity
    if base_url != "—" and model != "—":
        console.print(f"\n[dim]Connection test:[/dim]")
        try:
            result = _ping_endpoint(base_url, model, timeout=10)
            if result["connected"]:
                console.print(
                    f"  [green]✓ {model} @ {base_url}  "
                    f"({result['latency_ms']}ms)[/green]"
                )
            else:
                console.print(
                    f"  [red]✗ {model} @ {base_url}  "
                    f"HTTP {result['status']}[/red]"
                )
        except httpx.ConnectError:
            console.print(f"  [red]✗ Cannot connect to {base_url}[/red]")
        except httpx.TimeoutException:
            console.print(f"  [yellow]⚠ Timeout connecting to {base_url}[/yellow]")
        except Exception as e:
            console.print(f"  [red]✗ {e}[/red]")


@local_app.command()
def test(
    model: Optional[str] = typer.Option(None, "--model", help="Override model from config"),
    url: Optional[str] = typer.Option(None, "--url", help="Override base_url from config"),
):
    """Send a test message to the configured LLM endpoint."""

    cfg = _load_config()
    llm = cfg.get(CONFIG_KEY, {})
    base_url = url or llm.get("base_url")
    test_model = model or llm.get("model")

    if not base_url or not test_model:
        console.print("[red]No LLM configured. Run: arckit local setup[/red]")
        raise typer.Exit(1)

    console.print(f"[cyan]Testing: {test_model} @ {base_url}[/cyan]\n")

    try:
        t0 = time.time()
        resp = httpx.post(
            f"{base_url}/v1/chat/completions",
            json={
                "model": test_model,
                "messages": [{"role": "user", "content": "Say 'hello world'."}],
                "max_tokens": 20,
            },
            timeout=120,
        )
        elapsed = time.time() - t0
        status_code = resp.status_code

        console.print(f"  Endpoint:  {base_url}")
        console.print(f"  Model:     {test_model}")
        console.print(f"  Status:    {'✓ OK' if status_code == 200 else f'✗ {status_code}'}")
        console.print(f"  Latency:   {elapsed*1000:.0f}ms")

        if status_code == 200:
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            console.print(f"  Response:  {content.strip()[:200]}")

            usage = data.get("usage", {})
            inp = usage.get("prompt_tokens", "—")
            out = usage.get("completion_tokens", "—")
            console.print(f"  Tokens:    {inp} in / {out} out")
            console.print(f"\n[bold green]✓ LLM is healthy[/bold green]")
        else:
            body = resp.text[:300]
            console.print(f"  Error body: {body}")
            console.print(f"\n[bold red]✗ LLM returned {status_code}[/bold red]")
    except httpx.ConnectError:
        console.print(f"[red]✗ Cannot connect to {base_url}[/red]")
        console.print("  Is the LLM server running?")
        raise typer.Exit(1)
    except httpx.TimeoutException:
        console.print(f"[yellow]Timeout connecting to {base_url}[/yellow]")
        console.print("  The model may still be loading. Wait and retry.")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)