#!/usr/bin/env python3
"""
ArcKit Managed Agent Launcher

Deploys any of the 10 ArcKit agents as a Claude Managed Agent via the API.
Loads the full agent prompt from the canonical source file with only path
rewrites, auto-discovers MCP servers, and creates vault credentials for
servers that need API keys.

Prerequisites:
    pip install anthropic
    export ANTHROPIC_API_KEY="your-api-key"

Usage:
    # List available agents:
    python arckit-agent.py --list

    # Deploy with a project repo (recommended):
    python arckit-agent.py research \
        --repo "https://github.com/tractorjuice/arckit-test-project-v1" \
        --github-token "$GITHUB_TOKEN" \
        --prompt "Research technology options for the M365 migration project"

    # Deploy without a repo:
    python arckit-agent.py grants \
        --prompt "Research UK funding for a digital identity programme"

    # Resume an existing session:
    python arckit-agent.py research \
        --session-id "sess_abc123" \
        --prompt "Also research payment processing options"

    # Reuse agent and environment from a previous run:
    python arckit-agent.py research \
        --agent-id "agent_abc123" \
        --environment-id "env_abc123" \
        --prompt "Research options for a new project"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import textwrap

from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ARCKIT_REPO = "https://github.com/tractorjuice/arc-kit"
ARCKIT_MOUNT = "/workspace/arc-kit"

REPO_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
AGENTS_DIR = os.path.join(REPO_ROOT, "arckit-claude", "agents")
MCP_JSON = os.path.join(REPO_ROOT, "arckit-claude", ".mcp.json")

# Map agent names to descriptions for the --list output and API metadata
AGENT_DESCRIPTIONS = {
    "research": "Market research, vendor evaluation, build vs buy, TCO comparison",
    "grants": "UK government grants, charitable funding, accelerator programmes",
    "datascout": "Data source discovery, API catalogue search, scoring",
    "framework": "Transform artifacts into structured framework with principles and patterns",
    "aws-research": "AWS service research via AWS Knowledge MCP",
    "azure-research": "Azure service research via Microsoft Learn MCP",
    "gcp-research": "GCP service research via Google Developer Knowledge MCP",
    "gov-reuse": "Government code reuse assessment via govreposcrape",
    "gov-code-search": "Government code semantic search via govreposcrape",
    "gov-landscape": "Government code landscape analysis via govreposcrape",
}


# ---------------------------------------------------------------------------
# Agent prompt loading
# ---------------------------------------------------------------------------

def list_agents() -> list[str]:
    """Return sorted list of available agent names."""
    agents = []
    for f in sorted(os.listdir(AGENTS_DIR)):
        if f.startswith("arckit-") and f.endswith(".md"):
            agents.append(f.removeprefix("arckit-").removesuffix(".md"))
    return agents


def load_agent_config(name: str) -> dict:
    """Load agent frontmatter and prompt from the canonical source file.

    Returns dict with keys: name, system, maxTurns, disallowedTools.
    """
    path = os.path.join(AGENTS_DIR, f"arckit-{name}.md")
    if not os.path.isfile(path):
        available = ", ".join(list_agents())
        print(f"Error: agent '{name}' not found. Available: {available}", file=sys.stderr)
        sys.exit(1)

    with open(path) as f:
        content = f.read()

    # Extract YAML frontmatter
    fm_match = re.match(r"\A---\n(.*?)^---\n", content, re.DOTALL | re.MULTILINE)
    frontmatter = {}
    if fm_match:
        for line in fm_match.group(1).splitlines():
            if ":" in line and not line.startswith(" ") and not line.startswith("#"):
                key, _, val = line.partition(":")
                val = val.strip().strip('"').strip("'")
                if val.isdigit():
                    val = int(val)
                frontmatter[key.strip()] = val

    # Strip frontmatter to get prompt body
    prompt = re.sub(r"\A---\n.*?^---\n", "", content, count=1, flags=re.DOTALL | re.MULTILINE)

    # Rewrite plugin paths to mounted repo paths
    prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", f"{ARCKIT_MOUNT}/arckit-claude")

    return {
        "name": name,
        "system": prompt.strip(),
        "maxTurns": frontmatter.get("maxTurns", 50),
        "disallowedTools": frontmatter.get("disallowedTools", ""),
    }


# ---------------------------------------------------------------------------
# MCP servers and vaults
# ---------------------------------------------------------------------------

def load_mcp_servers() -> tuple[list[dict], list[dict]]:
    """Load MCP server definitions from .mcp.json.

    Returns (mcp_servers, mcp_toolsets).
    - mcp_servers: for the agent definition (type, name, url only)
    - mcp_toolsets: tool entries for the agent tools array
    """
    with open(MCP_JSON) as f:
        config = json.load(f)

    servers = []
    toolsets = []
    auth_needed = []

    for name, spec in config.get("mcpServers", {}).items():
        url = spec.get("url", "")

        # Skip servers that require custom header auth (X-Goog-Api-Key,
        # X-API-Key) — managed agents only supports Bearer token vaults,
        # so these fail on connect and generate session errors.
        # TODO: re-enable when managed agents supports custom header vaults.
        if spec.get("headers"):
            continue

        servers.append({"type": "url", "name": name, "url": url})
        toolsets.append({
            "type": "mcp_toolset",
            "mcp_server_name": name,
            "default_config": {
                "enabled": True,
                "permission_policy": {"type": "always_allow"},
            },
        })

    return servers, toolsets


def create_vault(client: Anthropic, auth_needed: list[tuple]) -> str | None:
    """Create a vault with static_bearer credentials for MCP servers needing auth.

    Returns the vault ID, or None if no credentials were available.
    """
    credentials = []
    for name, url, env_var, env_val in auth_needed:
        if env_val:
            credentials.append((name, url, env_val))
        else:
            print(f"  Skipping {name} vault credential ({env_var} not set)")

    if not credentials:
        return None

    vault = client.beta.vaults.create(display_name="ArcKit MCP credentials")
    print(f"Vault created: {vault.id}")

    for name, url, token in credentials:
        client.beta.vaults.credentials.create(
            vault_id=vault.id,
            display_name=f"ArcKit {name}",
            auth={
                "type": "static_bearer",
                "mcp_server_url": url,
                "token": token,
            },
        )
        print(f"  Credential: {name}")

    return vault.id


# ---------------------------------------------------------------------------
# Managed agent lifecycle
# ---------------------------------------------------------------------------

def create_agent(client: Anthropic, agent_config: dict) -> tuple:
    """Create a managed agent from an ArcKit agent config.

    """
    name = agent_config["name"]
    system = agent_config["system"]
    desc = AGENT_DESCRIPTIONS.get(name, f"ArcKit {name} agent")

    print(f"Loading agent: arckit-{name} ({len(system)} chars)")

    mcp_servers, mcp_toolsets = load_mcp_servers()
    print(f"MCP servers: {[s['name'] for s in mcp_servers]}")

    tools = [{"type": "agent_toolset_20260401"}] + mcp_toolsets

    agent = client.beta.agents.create(
        name=f"ArcKit {name.replace('-', ' ').title()} Agent",
        description=desc,
        model="claude-sonnet-4-6",
        system=system,
        tools=tools,
        mcp_servers=mcp_servers if mcp_servers else None,
    )
    print(f"Agent created: {agent.id} (version {agent.version})")
    return agent


def get_or_create_environment(client: Anthropic) -> str:
    """Get environment ID from ARCKIT_ENVIRONMENT_ID env var, or create one.

    Set ARCKIT_ENVIRONMENT_ID to reuse a single environment across runs.
    """
    env_id = os.environ.get("ARCKIT_ENVIRONMENT_ID")
    if env_id:
        print(f"Using environment: {env_id}")
        return env_id

    environment = client.beta.environments.create(
        name="arckit-env",
        config={"type": "cloud", "networking": {"type": "unrestricted"}},
    )
    print(f"Environment created: {environment.id}")
    print(f"  Tip: export ARCKIT_ENVIRONMENT_ID={environment.id} to reuse")
    return environment.id


def create_session(
    client: Anthropic,
    agent_id: str,
    environment_id: str,
    *,
    repo_url: str | None = None,
    github_token: str | None = None,
) -> object:
    """Start a session, optionally mounting GitHub repos."""
    resources = []

    if github_token:
        # Mount ArcKit repo for templates and references
        resources.append({
            "type": "github_repository",
            "url": ARCKIT_REPO,
            "authorization_token": github_token,
            "mount_path": ARCKIT_MOUNT,
        })

    if repo_url:
        if not github_token:
            print("Warning: --github-token required for repo mount, skipping", file=sys.stderr)
        else:
            resources.append({
                "type": "github_repository",
                "url": repo_url,
                "authorization_token": github_token,
                "mount_path": "/workspace/project",
            })

    kwargs = {
        "agent": agent_id,
        "environment_id": environment_id,
        "title": "ArcKit Agent Session",
    }
    if resources:
        kwargs["resources"] = resources
    session = client.beta.sessions.create(**kwargs)
    print(f"Session created: {session.id} (status: {session.status})")
    return session


def run_session(client: Anthropic, session_id: str, prompt: str) -> None:
    """Send a prompt and stream the agent's response."""
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[{
                "type": "user.message",
                "content": [{"type": "text", "text": prompt}],
            }],
        )

        for event in stream:
            match event.type:
                case "agent.message":
                    for block in event.content:
                        print(block.text, end="", flush=True)
                case "agent.tool_use":
                    print(f"\n  [{event.name}]", flush=True)
                case "agent.mcp_tool_use":
                    print(f"\n  [mcp:{event.mcp_server_name}.{event.name}]", flush=True)
                case "session.status_idle":
                    print("\n\nAgent finished.", flush=True)
                    break
                case "session.error":
                    msg = getattr(event.error, "message", str(event))
                    print(f"\nError: {msg}", file=sys.stderr)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Deploy ArcKit agents as Claude Managed Agents",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Available agents:
              research, grants, datascout, framework,
              aws-research, azure-research, gcp-research,
              gov-reuse, gov-code-search, gov-landscape

            Environment variables:
              ANTHROPIC_API_KEY       Required. Anthropic API key.
              ARCKIT_ENVIRONMENT_ID   Optional. Reuse a shared environment.

            Examples:
              %(prog)s --list
              %(prog)s research --repo https://github.com/user/project \\
                       --github-token $GH_TOKEN \\
                       --prompt "Research technology options"
              %(prog)s grants --prompt "Research UK funding for digital identity"
              %(prog)s research --session-id sess_abc123 --prompt "Follow up"
        """),
    )
    parser.add_argument(
        "agent",
        nargs="?",
        help="Agent name (e.g., research, grants, aws-research)",
    )
    parser.add_argument("--list", action="store_true", help="List available agents")
    parser.add_argument("--prompt", help="Prompt to send to the agent")
    parser.add_argument("--repo", help="GitHub repo URL for the project")
    parser.add_argument("--github-token", help="GitHub token for repo access")
    parser.add_argument("--session-id", help="Resume an existing session")
    parser.add_argument("--agent-id", help="Reuse an existing agent ID")

    args = parser.parse_args()

    if args.list:
        print("Available ArcKit agents:\n")
        for name in list_agents():
            desc = AGENT_DESCRIPTIONS.get(name, "")
            print(f"  {name:<20} {desc}")
        return

    if not args.agent:
        parser.error("agent name is required (use --list to see available agents)")

    if not args.session_id and not args.prompt:
        parser.error("--prompt is required when not resuming a session")

    client = Anthropic()

    # Resume existing session
    if args.session_id:
        if not args.prompt:
            parser.error("--prompt is required to send a message")
        run_session(client, args.session_id, args.prompt)
        return

    # Load agent config
    agent_config = load_agent_config(args.agent)

    # Create agent (or reuse)
    if args.agent_id:
        agent_id = args.agent_id
        print(f"Reusing agent: {agent_id}")
    else:
        agent = create_agent(client, agent_config)
        agent_id = agent.id

    # Get or create environment
    env_id = get_or_create_environment(client)

    # Create session and run
    session = create_session(
        client, agent_id, env_id,
        repo_url=args.repo,
        github_token=args.github_token,
    )
    run_session(client, session.id, args.prompt)

    # Print reuse hints
    print(f"\n--- Reuse IDs ---")
    print(f"  --agent-id {agent_id}")
    print(f"  --environment-id {env_id}")
    print(f"  --session-id {session.id}")


if __name__ == "__main__":
    main()
