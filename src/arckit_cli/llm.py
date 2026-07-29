"""
LLM Execution Layer

Core engine for the ``arckit build`` command. Executes skills against an
LLM API using OpenAI-compatible chat completions with function calling.

Supports tool-use loops (Read / Write / Glob) where the model can request
file operations and receive results before continuing.
"""

import json
import asyncio
import hashlib
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import httpx
import yaml

# Config helpers — self-contained (avoids circular import with __init__.py)
import platformdirs

def _get_config_path():
    return Path(platformdirs.user_config_dir("arckit")) / "config.yaml"

def _load_config():
    cfg_path = _get_config_path()
    if not cfg_path.exists():
        return {}
    try:
        return yaml.safe_load(cfg_path.read_text()) or {}
    except Exception:
        return {}

def _get_nested(data, dotted_key):
    parts = dotted_key.split(".")
    current = data
    for part in parts:
        if isinstance(current, dict):
            current = current.get(part)
        else:
            return None
    return current
from arckit_cli.recipe import Target, Wave

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass
class LLMConfig:
    """Configuration for connecting to an LLM API endpoint."""

    provider: str  # "openai-compatible" | "openai" | "anthropic" | "ollama"
    base_url: str  # e.g. "http://172.25.0.1:8080"
    model: str     # e.g. "Qwen3.6-27B"
    api_key: str   # empty string for local endpoints
    max_tokens: int = 128000
    temperature: float = 0.0


@dataclass
class ExecutionResult:
    """Result of executing a single target through the LLM."""

    target_id: str
    status: str  # "success" | "failed" | "skipped"
    output_path: str | None = None
    output_sha256: str | None = None
    tokens_used: int = 0
    error: str | None = None
    tool_calls_count: int = 0


# ---------------------------------------------------------------------------
# Tool registry (OpenAI function-calling format)
# ---------------------------------------------------------------------------

TOOLS: list[dict] = [
    {
        "type": "function",
        "function": {
            "name": "Read",
            "description": "Read a file's content",
            "parameters": {
                "type": "object",
                "properties": {"path": {"type": "string"}},
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "Write",
            "description": "Write content to a file (creates parents)",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"},
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "Glob",
            "description": "Find files matching a glob pattern",
            "parameters": {
                "type": "object",
                "properties": {
                    "pattern": {"type": "string"},
                    "root": {"type": "string"},
                },
                "required": ["pattern"],
            },
        },
    },
]


# ---------------------------------------------------------------------------
# Config resolution
# ---------------------------------------------------------------------------


def resolve_config(
    cli_base_url: Optional[str] = None,
    cli_model: Optional[str] = None,
    cli_provider: Optional[str] = None,
) -> LLMConfig:
    """Resolve LLM configuration from multiple sources.

    Resolution precedence:
        1. CLI flags (--base-url, --model, --provider)
        2. ArcKit config file (~/.arckit/config.yaml)
        3. Environment variables (LLM_BASE_URL, LLM_MODEL, etc.)
        4. Fail fast with clear error if no config found.

    Args:
        cli_base_url: Base URL from CLI flag, if provided.
        cli_model: Model name from CLI flag, if provided.
        cli_provider: Provider name from CLI flag, if provided.

    Returns:
        Fully-resolved LLMConfig.

    Raises:
        RuntimeError: If required configuration cannot be resolved.
    """
    # Load persisted config
    cfg = _load_config()
    llm_cfg = cfg.get("llm", {})

    # --- Provider ---
    provider = cli_provider or llm_cfg.get("provider", "openai-compatible")

    # --- Base URL ---
    base_url = cli_base_url or llm_cfg.get("base_url") or ""
    if not base_url:
        base_url = _resolve_env("LLM_BASE_URL") or ""
    if not base_url:
        raise RuntimeError(
            "No LLM base URL configured. Set via:\n"
            "  1. CLI flag: --base-url http://localhost:8080\n"
            "  2. Config:   arckit config set llm.base_url http://localhost:8080\n"
            "  3. Env var:  LLM_BASE_URL=http://localhost:8080"
        )

    # --- Model ---
    model = cli_model or llm_cfg.get("model") or ""
    if not model:
        model = _resolve_env("LLM_MODEL") or ""
    if not model:
        raise RuntimeError(
            "No LLM model configured. Set via:\n"
            "  1. CLI flag: --model Qwen3.6-27B\n"
            "  2. Config:   arckit config set llm.model Qwen3.6-27B\n"
            "  3. Env var:  LLM_MODEL=Qwen3.6-27B"
        )

    # --- API Key ---
    api_key = llm_cfg.get("api_key", "") or ""
    if not api_key:
        api_key = _resolve_env("OPENAI_API_KEY") or ""
    if not api_key:
        api_key = _resolve_env("ANTHROPIC_API_KEY") or ""

    # --- Optional settings ---
    max_tokens = int(llm_cfg.get("max_tokens", 128000))
    temperature = float(llm_cfg.get("temperature", 0.0))

    return LLMConfig(
        provider=provider,
        base_url=base_url,
        model=model,
        api_key=api_key,
        max_tokens=max_tokens,
        temperature=temperature,
    )


# ---------------------------------------------------------------------------
# LLM API client
# ---------------------------------------------------------------------------

# Retry backoff schedule: 2s, 4s, 8s (max 3 retries)
_RETRY_DELAYS = [2.0, 4.0, 8.0]


async def call_llm(
    messages: list[dict],
    tools: list[dict],
    config: LLMConfig,
) -> dict:
    """Call OpenAI-compatible chat completions endpoint with retries.

    Retries on HTTP 429 (rate limit) and connection errors with exponential
    backoff (2s, 4s, 8s, max 3 retries). Other HTTP errors are raised
    immediately with the response body.

    Args:
        messages: Chat messages in OpenAI format.
        tools: Tool definitions in OpenAI function-calling format.
        config: Resolved LLMConfig.

    Returns:
        Raw API response as a dict.

    Raises:
        httpx.HTTPStatusError: On non-retryable HTTP errors.
        RuntimeError: On connection failure after all retries exhausted.
    """
    url = f"{config.base_url}/v1/chat/completions"
    headers: dict[str, str] = {"Content-Type": "application/json"}
    if config.api_key:
        headers["Authorization"] = f"Bearer {config.api_key}"

    body: dict = {
        "model": config.model,
        "messages": messages,
        "tools": tools,
        "max_tokens": config.max_tokens,
        "temperature": config.temperature,
    }

    last_error: Exception | None = None
    for attempt in range(len(_RETRY_DELAYS) + 1):
        if attempt > 0:
            delay = _RETRY_DELAYS[attempt - 1]
            logger.warning(
                "Retrying LLM call (attempt %d/%d) after %.1fs delay...",
                attempt,
                len(_RETRY_DELAYS),
                delay,
            )
            await asyncio.sleep(delay)

        try:
            async with httpx.AsyncClient(timeout=300) as client:
                resp = await client.post(url, json=body, headers=headers)

                if resp.status_code == 429:
                    last_error = httpx.HTTPStatusError(
                        "Rate limit exceeded (429)",
                        request=resp.request,
                        response=resp,
                    )
                    continue

                if resp.status_code >= 400:
                    error_detail = resp.text[:500]
                    raise httpx.HTTPStatusError(
                        f"HTTP {resp.status_code}: {error_detail}",
                        request=resp.request,
                        response=resp,
                    )

                return resp.json()

        except httpx.ConnectError:
            last_error = httpx.ConnectError(
                f"Connection failed to {url} (attempt {attempt + 1})"
            )
            continue

        except httpx.TimeoutException:
            last_error = httpx.TimeoutException(f"Request to {url} timed out")
            continue

        except httpx.HTTPStatusError:
            # Non-429 errors are not retried
            raise

    raise RuntimeError(
        f"LLM API call failed after {len(_RETRY_DELAYS) + 1} attempts. "
        f"Last error: {last_error}"
    )


# ---------------------------------------------------------------------------
# Tool dispatch
# ---------------------------------------------------------------------------


async def dispatch_tool(tool_call: dict, project_path: Path) -> str:
    """Execute a tool call and return the result as a string.

    Supported tools: Read, Write, Glob.

    Args:
        tool_call: Tool call dict from the LLM response.
        project_path: Project root for resolving relative paths.

    Returns:
        Tool result as a string.

    Raises:
        ValueError: If the tool name is unknown.
        RuntimeError: If the tool execution fails.
    """
    name = tool_call["function"]["name"]
    try:
        args = json.loads(tool_call["function"]["arguments"])
    except json.JSONDecodeError as exc:
        return f"Error parsing tool arguments: {exc}"

    if name == "Read":
        return _tool_read(args, project_path)
    elif name == "Write":
        return _tool_write(args, project_path)
    elif name == "Glob":
        return _tool_glob(args, project_path)
    else:
        raise ValueError(f"Unknown tool: {name}")


def _tool_read(args: dict, project_path: Path) -> str:
    """Read a file and return its content."""
    if "path" not in args:
        return "Error: missing required argument 'path'"
    filepath = Path(args["path"])
    if not filepath.is_absolute():
        filepath = project_path / filepath
    if not filepath.is_file():
        return f"Error: file not found: {filepath}"
    try:
        return filepath.read_text(encoding="utf-8")
    except Exception as exc:
        return f"Error reading {filepath}: {exc}"


def _tool_write(args: dict, project_path: Path) -> str:
    """Write content to a file, creating parent directories as needed."""
    if "path" not in args:
        return "Error: missing required argument 'path'"
    if "content" not in args:
        return "Error: missing required argument 'content'"
    filepath = Path(args["path"])
    if not filepath.is_absolute():
        filepath = project_path / filepath
    try:
        filepath.parent.mkdir(parents=True, exist_ok=True)
        filepath.write_text(args["content"], encoding="utf-8")
        return f"Written to {filepath}"
    except Exception as exc:
        return f"Error writing {filepath}: {exc}"


def _tool_glob(args: dict, project_path: Path) -> str:
    """Find files matching a glob pattern."""
    from glob import glob as glob_fn

    if "pattern" not in args:
        return "Error: missing required argument 'pattern'"
    pattern = args["pattern"]
    root = args.get("root", str(project_path))
    matches = glob_fn(pattern, root_dir=root, recursive=True)
    return json.dumps(matches)


# ---------------------------------------------------------------------------
# Prompt building
# ---------------------------------------------------------------------------


def _build_system_prompt(skill_path: Path) -> str:
    """Read a skill file and return it as the system prompt.

    Args:
        skill_path: Path to the SKILL.md or .md command file.

    Returns:
        Skill content as a string.

    Raises:
        FileNotFoundError: If the skill file does not exist.
    """
    if not skill_path.is_file():
        raise FileNotFoundError(f"Skill file not found: {skill_path}")
    return skill_path.read_text(encoding="utf-8")


def _build_user_prompt(target, input_artifacts: dict[str, str]) -> str:
    """Build the user prompt with target instructions and input context.

    Args:
        target: Target object with id, skill, args, output fields.
        input_artifacts: Mapping of dependency output names to their content.

    Returns:
        User prompt string.
    """
    parts: list[str] = []

    # Target instructions
    parts.append(f"# Target: {target.id}")
    if target.args:
        parts.append(f"\n## Instructions\n{target.args}")

    # Input artifacts from dependencies
    if input_artifacts:
        parts.append("\n## Input Artifacts")
        for name, content in input_artifacts.items():
            parts.append(f"\n### {name}\n```\n{content}\n```\n")

    # Output expectations
    output = target.output
    if output:
        parts.append("\n## Expected Output")
        if "path" in output:
            parts.append(f"- Write output to: {output['path']}")
        elif "project" in output:
            proj = output["project"]
            typ = output.get("type", "OUT")
            parts.append(f"- Write output to: projects/{proj}/ARC-001-{typ}-v1.0.md")
        if "format" in output:
            parts.append(f"- Format: {output['format']}")

    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Target execution
# ---------------------------------------------------------------------------


async def execute_target(
    target,
    config: LLMConfig,
    project_path: Path,
    skill_path: Path,
    input_artifacts: dict[str, str],
) -> ExecutionResult:
    """Execute a single target through the LLM.

    Flow:
        1. Read skill file → system prompt
        2. Inject input artifacts into user message
        3. Loop: call LLM → check tool calls → dispatch → append result
        4. On final response: extract output from Write tool results
        5. Return ExecutionResult

    Args:
        target: Target to execute.
        config: Resolved LLM configuration.
        project_path: Project root directory.
        skill_path: Path to the skill file (SKILL.md or .md).
        input_artifacts: Content from dependency outputs.

    Returns:
        ExecutionResult with status, output path, token usage, etc.
    """
    result = ExecutionResult(target_id=target.id, status="failed")

    # Pre-execution: check if output file already exists
    if target.output:
        expected_paths: list[str] = []
        artifact = f"ARC-001-{target.output.get('type', 'OUT')}-v1.0.md"
        if "path" in target.output:
            expected_paths.append(target.output["path"])
        elif "project" in target.output:
            expected_paths.append(f"projects/{target.output['project']}/{artifact}")
            # Fallback: project ID only
            if project_path.name:
                expected_paths.append(f"projects/{project_path.name}/{artifact}")
        
        for path in expected_paths:
            if not Path(path).is_absolute():
                path = str(project_path / path)
            if Path(path).is_file():
                result.status = "success"
                result.output_path = path
                result.tokens_used = 0
                logger.info(f"Target {target.id}: skipped (file exists: {path})")
                return result

    try:
        # Step 1: Build system prompt from skill file
        system_prompt = _build_system_prompt(skill_path)

        # Step 2: Build user prompt with input context
        user_prompt = _build_user_prompt(target, input_artifacts)

        # Step 3: Initialize conversation
        messages: list[dict] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        total_tokens = 0
        tool_calls_count = 0
        written_paths: list[str] = []

        # Step 4: Tool-use loop
        max_iterations = 20
        for _iteration in range(max_iterations):
            response = await call_llm(messages, TOOLS, config)

            # Track tokens
            usage = response.get("usage", {})
            total_tokens += usage.get("total_tokens", 0)

            choices = response.get("choices", [])
            if not choices:
                result.error = "LLM returned no choices"
                result.tokens_used = total_tokens
                result.tool_calls_count = tool_calls_count
                logger.error(f"Target {target.id}: LLM returned no choices")
                return result

            choice = choices[0]
            message = choice.get("message", {})

            # Check for tool calls
            tool_calls = message.get("tool_calls", [])
            if not tool_calls:
                # Final response — no more tool calls
                result.tokens_used = total_tokens
                result.tool_calls_count = tool_calls_count
                result.status = "success"

                # Extract output path from last Write result
                if written_paths:
                    result.output_path = written_paths[-1]
                    # Compute SHA-256
                    try:
                        out_path = Path(written_paths[-1])
                        if out_path.is_file():
                            h = hashlib.sha256()
                            for chunk in out_path.open("rb"):
                                h.update(chunk)
                            result.output_sha256 = h.hexdigest()
                    except Exception:
                        pass

                logger.info(
                    f"Target {target.id}: success (tokens={total_tokens}, "
                    f"tool_calls={tool_calls_count})"
                )
                return result

            # Dispatch tool calls
            tool_calls_count += len(tool_calls)
            for tc in tool_calls:
                tool_result = await dispatch_tool(tc, project_path)

                # Track written paths
                if tc["function"]["name"] == "Write":
                    # Extract path from "Written to <path>" result
                    if tool_result.startswith("Written to "):
                        written_paths.append(tool_result[len("Written to "):])

                messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [tc],
                })
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.get("id", ""),
                    "content": tool_result,
                })

        # If we exhausted iterations
        result.error = (
            f"Tool-use loop exceeded {max_iterations} iterations"
        )
        result.tokens_used = total_tokens
        result.tool_calls_count = tool_calls_count
        logger.warning(
            f"Target {target.id}: exceeded {max_iterations} tool-use iterations"
        )

    except FileNotFoundError as exc:
        result.error = str(exc)
        logger.error(f"Target {target.id}: {exc}")
    except Exception as exc:
        result.error = str(exc)
        logger.error(f"Target {target.id}: execution failed: {exc}")

    return result


# ---------------------------------------------------------------------------
# Batch execution
# ---------------------------------------------------------------------------


async def execute_wave(
    wave,
    config: LLMConfig,
    project_path: Path,
    max_parallel: int = 4,
) -> list[ExecutionResult]:
    """Execute all targets in a wave concurrently.

    Args:
        wave: Wave of targets that can run in parallel.
        config: Resolved LLM configuration.
        project_path: Project root directory.
        max_parallel: Maximum number of concurrent LLM calls.

    Returns:
        List of ExecutionResult, one per target in the wave.
    """
    if not wave.targets:
        return []

    tasks: list[tuple[Target, Path, dict[str, str]]] = []

    for target in wave.targets:
        # Resolve skill path
        skill_path = _resolve_skill_path(target.skill, project_path)

        # Gather input artifacts from dependency outputs
        input_artifacts: dict[str, str] = {}
        # Dependencies will be filled by the caller (build command)

        tasks.append((target, skill_path, input_artifacts))

    semaphore = asyncio.Semaphore(max_parallel)

    async def _run(
        target: Target,
        skill_path: Path,
        artifacts: dict[str, str],
    ) -> ExecutionResult:
        async with semaphore:
            return await execute_target(
                target, config, project_path, skill_path, artifacts
            )

    # Run all targets in the wave concurrently (bounded by semaphore)
    coros = [_run(t, sp, a) for t, sp, a in tasks]
    raw_results: list[ExecutionResult | BaseException] = await asyncio.gather(
        *coros, return_exceptions=True
    )

    # Unwrap any exceptions that leaked through
    final_results: list[ExecutionResult] = []
    for i, r in enumerate(raw_results):
        if isinstance(r, BaseException):
            final_results.append(ExecutionResult(
                target_id=tasks[i][0].id,
                status="failed",
                error=str(r),
            ))
        else:
            final_results.append(r)

    return final_results


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _resolve_env(key: str) -> Optional[str]:
    """Get an environment variable, returning None if unset or empty."""
    value = None
    # Use os.environ to avoid polluting the module namespace
    import os
    value = os.environ.get(key)
    return value if value else None


def _resolve_skill_path(skill_name: str, project_path: Path) -> Path:
    """Resolve a skill name to a file path.

    Checks:
        1. Direct path (absolute or relative)
        2. extensions/arckit-codex/skills/arckit-{name}/SKILL.md
        3. All plugin commands dirs for {command}.md
        4. .agents/skills/arckit-{name}/SKILL.md

    Args:
        skill_name: Skill identifier (e.g. 'arckit:principles') or path.
        project_path: Project root directory.

    Returns:
        Resolved Path to the skill file.

    Raises:
        FileNotFoundError: If the skill cannot be resolved.
    """
    # Direct path
    direct = Path(skill_name)
    if direct.is_absolute() and direct.is_file():
        return direct
    if not direct.is_absolute() and (project_path / direct).is_file():
        return project_path / direct

    # Strip 'arckit:' prefix for command name lookup
    cmd_name = skill_name
    if cmd_name.startswith("arckit:"):
        cmd_name = cmd_name[len("arckit:"):]

    # extensions/arckit-codex/skills/arckit-{name}/SKILL.md
    skill_dir = project_path / "extensions" / "arckit-codex" / "skills" / f"arckit-{cmd_name}"
    skill_file = skill_dir / "SKILL.md"
    if skill_file.is_file():
        return skill_file

    # .agents/skills/arckit-{name}/SKILL.md
    agent_skill = project_path / ".agents" / "skills" / f"arckit-{cmd_name}" / "SKILL.md"
    if agent_skill.is_file():
        return agent_skill

    # Search all plugin commands dirs
    plugin_base = project_path / "plugins"
    if plugin_base.is_dir():
        for plugin_cmd_dir in sorted(plugin_base.glob("arckit-*/commands")):
            cmd_file = plugin_cmd_dir / f"{cmd_name}.md"
            if cmd_file.is_file():
                return cmd_file

    raise FileNotFoundError(
        f"Skill '{skill_name}' not found at:\n"
        f"  - {skill_file}\n"
        f"  - {agent_skill}\n"
        f"  - plugins/*/commands/{cmd_name}.md\n"
    )