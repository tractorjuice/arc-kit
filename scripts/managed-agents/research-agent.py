#!/usr/bin/env python3
"""
ArcKit Research Agent — Claude Managed Agents Prototype

Deploys the arckit-research agent as a Claude Managed Agent via the API.
The agent performs market research, vendor evaluation, build vs buy analysis,
and TCO comparison for a project's requirements.

Prerequisites:
    pip install anthropic
    export ANTHROPIC_API_KEY="your-api-key"

Usage:
    # With a GitHub repo (recommended — agent reads/writes project artifacts):
    python research-agent.py \
        --repo "https://github.com/tractorjuice/arckit-test-project-v1" \
        --github-token "$GITHUB_TOKEN" \
        --prompt "Research technology options for the M365 migration project"

    # Without a repo (agent uses web research only, no artifact access):
    python research-agent.py \
        --prompt "Research authentication solutions for a UK Government project"

    # Resume an existing session:
    python research-agent.py --session-id "sess_abc123"
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import textwrap

from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Agent system prompt — loaded from arckit-claude/agents/arckit-research.md
# with ${CLAUDE_PLUGIN_ROOT} paths rewritten to /workspace/arc-kit/arckit-claude
# (the ArcKit repo is mounted at /workspace/arc-kit via GitHub resource)
# ---------------------------------------------------------------------------

ARCKIT_REPO = "https://github.com/tractorjuice/arc-kit"
ARCKIT_MOUNT = "/workspace/arc-kit"

# Path to the canonical agent prompt (relative to repo root)
_AGENT_FILE = os.path.join(
    os.path.dirname(__file__), "..", "..", "arckit-claude", "agents", "arckit-research.md"
)


def load_system_prompt() -> str:
    """Load the full agent prompt from the canonical source file.

    Strips YAML frontmatter and rewrites ${CLAUDE_PLUGIN_ROOT} paths
    to the managed-agent mount path. This ensures the managed agent
    always uses the exact same prompt as the plugin agent.
    """
    with open(os.path.normpath(_AGENT_FILE)) as f:
        content = f.read()

    # Strip YAML frontmatter (--- ... ---)
    content = re.sub(r"\A---\n.*?^---\n", "", content, count=1, flags=re.DOTALL | re.MULTILINE)

    # Rewrite plugin paths to mounted repo paths
    content = content.replace(
        "${CLAUDE_PLUGIN_ROOT}",
        f"{ARCKIT_MOUNT}/arckit-claude",
    )

    return content.strip()


def load_mcp_servers() -> tuple[list[dict], list[dict]]:
    """Load MCP server definitions from the plugin's .mcp.json.

    Returns (mcp_servers, mcp_toolsets) for the agent definition.
    Servers requiring API keys are included only if the env var is set.
    """
    import json

    mcp_json = os.path.join(
        os.path.dirname(__file__), "..", "..", "arckit-claude", ".mcp.json"
    )
    with open(os.path.normpath(mcp_json)) as f:
        config = json.load(f)

    servers = []
    toolsets = []
    auth_needed = []  # (name, url, env_var, env_val) for vault creation

    for name, spec in config.get("mcpServers", {}).items():
        url = spec.get("url", "")

        # All servers go into the agent definition (no headers — auth via vaults)
        server = {"type": "url", "name": name, "url": url}
        servers.append(server)
        toolsets.append({"type": "mcp_toolset", "mcp_server_name": name})

        # Track servers that need vault credentials
        for hdr_val in spec.get("headers", {}).values():
            if hdr_val.startswith("${") and hdr_val.endswith("}"):
                env_var = hdr_val[2:-1]
                env_val = os.environ.get(env_var, "")
                auth_needed.append((name, url, env_var, env_val))

    return servers, toolsets, auth_needed


def create_vault(client: Anthropic, auth_needed: list[tuple]) -> str | None:
    """Create a vault with static_bearer credentials for MCP servers that need auth.

    Returns the vault ID, or None if no credentials were needed/available.
    """
    credentials = []
    for name, url, env_var, env_val in auth_needed:
        if env_val:
            credentials.append((name, url, env_val))
        else:
            print(f"  Warning: {name} needs {env_var} but it's not set — skipping credential")

    if not credentials:
        return None

    vault = client.beta.vaults.create(
        display_name="ArcKit MCP credentials",
    )
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
        print(f"  Credential added: {name}")

    return vault.id


def create_agent(client: Anthropic) -> tuple:
    """Create the ArcKit research managed agent with MCP servers.

    Returns (agent, auth_needed) where auth_needed is a list of
    MCP servers that require vault credentials.
    """
    system_prompt = load_system_prompt()
    print(f"Loaded system prompt: {len(system_prompt)} chars from {os.path.normpath(_AGENT_FILE)}")

    mcp_servers, mcp_toolsets, auth_needed = load_mcp_servers()
    print(f"MCP servers: {[s['name'] for s in mcp_servers]}")

    tools = [{"type": "agent_toolset_20260401"}] + mcp_toolsets

    agent = client.beta.agents.create(
        name="ArcKit Research Agent",
        description="Enterprise architecture market research: vendor evaluation, "
        "build vs buy analysis, TCO comparison, UK Gov Digital Marketplace search.",
        model="claude-sonnet-4-6",
        system=system_prompt,
        tools=tools,
        mcp_servers=mcp_servers if mcp_servers else None,
    )
    print(f"Agent created: {agent.id} (version {agent.version})")
    return agent, auth_needed


def create_environment(client: Anthropic) -> dict:
    """Create a cloud environment with unrestricted networking."""
    environment = client.beta.environments.create(
        name="arckit-research-env",
        config={
            "type": "cloud",
            "networking": {"type": "unrestricted"},
        },
    )
    print(f"Environment created: {environment.id}")
    return environment


def create_session(
    client: Anthropic,
    agent_id: str,
    environment_id: str,
    *,
    repo_url: str | None = None,
    github_token: str | None = None,
    vault_id: str | None = None,
) -> dict:
    """Start a session, optionally mounting GitHub repos and vault credentials."""
    resources = []

    # Always mount ArcKit repo for templates and references
    if github_token:
        resources.append(
            {
                "type": "github_repository",
                "url": ARCKIT_REPO,
                "authorization_token": github_token,
                "mount_path": ARCKIT_MOUNT,
            }
        )

    # Optionally mount the user's project repo
    if repo_url:
        if not github_token:
            print(
                "Warning: --github-token required to mount repos. "
                "Skipping repo mount.",
                file=sys.stderr,
            )
        else:
            resources.append(
                {
                    "type": "github_repository",
                    "url": repo_url,
                    "authorization_token": github_token,
                    "mount_path": "/workspace/project",
                }
            )

    kwargs = {
        "agent": agent_id,
        "environment_id": environment_id,
        "title": "ArcKit Research Session",
    }
    if resources:
        kwargs["resources"] = resources
    if vault_id:
        kwargs["vault_ids"] = [vault_id]

    session = client.beta.sessions.create(**kwargs)
    print(f"Session created: {session.id} (status: {session.status})")
    return session


def run_session(client: Anthropic, session_id: str, prompt: str) -> None:
    """Send a prompt and stream the agent's response."""
    with client.beta.sessions.events.stream(session_id) as stream:
        # Send the user message
        client.beta.sessions.events.send(
            session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": prompt}],
                },
            ],
        )

        # Stream events
        for event in stream:
            match event.type:
                case "agent.message":
                    for block in event.content:
                        print(block.text, end="", flush=True)
                case "agent.tool_use":
                    print(f"\n  [{event.name}]", flush=True)
                case "session.status_idle":
                    print("\n\nAgent finished.", flush=True)
                    break
                case "session.error":
                    print(
                        f"\nError: {getattr(event, 'message', event)}",
                        file=sys.stderr,
                    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Deploy ArcKit research agent as a Claude Managed Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              %(prog)s --repo https://github.com/user/project \\
                       --github-token $GH_TOKEN \\
                       --prompt "Research technology options for the NHS project"

              %(prog)s --prompt "Research auth solutions for UK Gov"

              %(prog)s --session-id sess_abc123
        """),
    )
    parser.add_argument(
        "--prompt",
        help="Research prompt to send to the agent",
    )
    parser.add_argument(
        "--repo",
        help="GitHub repo URL for the project (agent reads/writes artifacts here)",
    )
    parser.add_argument(
        "--github-token",
        help="GitHub token for repo access (also used for ArcKit template repo)",
    )
    parser.add_argument(
        "--session-id",
        help="Resume an existing session instead of creating a new one",
    )
    parser.add_argument(
        "--agent-id",
        help="Reuse an existing agent ID instead of creating a new one",
    )
    parser.add_argument(
        "--environment-id",
        help="Reuse an existing environment ID instead of creating a new one",
    )

    args = parser.parse_args()

    if not args.session_id and not args.prompt:
        parser.error("--prompt is required when not resuming a session")

    client = Anthropic()

    if args.session_id:
        # Resume existing session
        if not args.prompt:
            parser.error("--prompt is required to send a message to the session")
        run_session(client, args.session_id, args.prompt)
        return

    # Create agent (or reuse)
    if args.agent_id:
        agent_id = args.agent_id
        print(f"Reusing agent: {agent_id}")
    else:
        agent, _ = create_agent(client)
        agent_id = agent.id

    # Always check for MCP servers needing vault credentials
    # (vault is per-session, so create fresh each time)
    _, _, auth_needed = load_mcp_servers()
    vault_id = None
    if auth_needed:
        vault_id = create_vault(client, auth_needed)

    # Create environment (or reuse)
    if args.environment_id:
        env_id = args.environment_id
        print(f"Reusing environment: {env_id}")
    else:
        environment = create_environment(client)
        env_id = environment.id

    # Create session
    session = create_session(
        client,
        agent_id,
        env_id,
        repo_url=args.repo,
        github_token=args.github_token,
        vault_id=vault_id,
    )

    # Run
    run_session(client, session.id, args.prompt)

    # Print reuse hints
    print(f"\n--- Reuse IDs ---")
    print(f"  --agent-id {agent_id}")
    print(f"  --environment-id {env_id}")
    print(f"  --session-id {session.id}")


if __name__ == "__main__":
    main()
