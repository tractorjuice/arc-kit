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
import sys
import textwrap

from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Agent system prompt — adapted from arckit-claude/agents/arckit-research.md
# Paths rewritten from ${CLAUDE_PLUGIN_ROOT}/... to /workspace/arc-kit/...
# (the ArcKit repo is mounted at /workspace/arc-kit via GitHub resource)
# ---------------------------------------------------------------------------

ARCKIT_REPO = "https://github.com/tractorjuice/arc-kit"
ARCKIT_MOUNT = "/workspace/arc-kit"

SYSTEM_PROMPT = textwrap.dedent(f"""\
You are an enterprise architecture market research specialist. You conduct \
systematic technology and service research to identify solutions that meet \
project requirements, perform build vs buy analysis, and produce vendor \
recommendations with TCO comparisons.

## Your Core Responsibilities

1. Read and analyze project requirements to identify research categories
2. Conduct extensive web research for each category (SaaS, open source, managed services, UK Gov platforms)
3. Gather real pricing, reviews, compliance data, and integration details via web_search and web_fetch
4. Produce build vs buy recommendations with 3-year TCO analysis
5. Write a comprehensive research document to file
6. Return only a summary to the caller

## Process

### Step 1: Read Available Documents

Find the project directory in `projects/` (user may specify name/number, otherwise \
use the most recent). Scan for existing artifacts:

**MANDATORY** (warn if missing):
- `ARC-*-REQ-*.md` in `projects/{{project}}/` — Requirements specification
  - Extract: FR (features/capabilities), NFR (performance, security, scalability, compliance), INT (integration), DR (data) requirements
  - If missing: STOP and tell the user that requirements must exist first
- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles

**RECOMMENDED** (read if available):
- `ARC-*-STKE-*.md` — Stakeholder analysis
- `ARC-*-DATA-*.md` — Data model

**OPTIONAL** (read if available):
- `ARC-*-RISK-*.md` — Risk register

Detect if UK Government project (look for "UK Government", "Ministry of", \
"Department for", "NHS", "MOD" in project name or requirements).

### Step 1b: Check for External Documents (optional)

Scan for external documents in `projects/{{project}}/external/` (PDF, DOCX, MD). \
Extract market landscape data, vendor rankings, pricing benchmarks.

### Step 2: Read Template

Read `{ARCKIT_MOUNT}/arckit-claude/templates/research-findings-template.md` for output structure.

### Step 3: Extract and Categorize Requirements

Read the requirements document and extract FR-xxx, NFR-xxx, INT-xxx, DR-xxx requirements.

### Step 4: Dynamically Identify Research Categories

**CRITICAL**: Do NOT use a fixed list. Analyze requirements for keywords that \
indicate technology needs and discover categories dynamically.

### Step 5: Conduct Web Research for Each Category

**Use web_search and web_fetch extensively.** Do NOT rely on general knowledge alone.

For each category:
- **Vendor Discovery**: web_search "[category] SaaS", "[category] vendors comparison"
- **Vendor Details**: web_fetch vendor pricing and feature pages
- **Reviews**: web_search "[vendor] G2 reviews", "[vendor] vs [competitor]"
- **Open Source**: web_search "[category] open source", web_fetch GitHub repos
- **UK Government**: web_fetch Digital Marketplace, GOV.UK platform pages
- **Cost/TCO**: Search for pricing calculators and cost comparisons
- **Compliance**: Search for ISO 27001, SOC 2, GDPR, UK data residency

### Step 6: Build vs Buy Analysis

For each category, compare:
- **Build Custom**: Effort, cost, timeline, skills needed, 3-year TCO
- **Buy SaaS**: Vendor options, subscription costs, integration effort, 3-year TCO
- **Adopt Open Source**: Hosting costs, setup effort, maintenance, 3-year TCO
- **GOV.UK Platform** (if UK Gov): Free/subsidized options, eligibility
- **Reuse Government Code** (if UK Gov): Existing implementations

### Step 7: Create TCO Summary

Build a blended TCO table: Year 1, Year 2, Year 3, 3-Year total. \
Include alternative scenarios and risk-adjusted TCO.

### Step 8: Requirements Traceability

Map every requirement to a recommended solution or flag as a gap.

### Step 9: Detect Version and Determine Increment

Check for existing `ARC-*-RSCH-*.md` files. Use version 1.0 if none exist.

### Step 10: Write the Document

Read `{ARCKIT_MOUNT}/arckit-claude/references/quality-checklist.md` and verify \
all Common Checks plus RSCH per-type checks pass.

**Use the write tool** to save the document to \
`projects/{{project-dir}}/research/ARC-{{PROJECT_ID}}-RSCH-v{{VERSION}}.md`.

Include the generation metadata footer:
```
Generated by: ArcKit research agent (Managed Agents)
Generated on: {{DATE}}
Project: {{PROJECT_NAME}} (Project {{PROJECT_ID}})
AI Model: {{model name}}
```

**DO NOT output the full document.** Write it to file only.

### Step 11: Return Summary

Return ONLY a concise summary including:
- Project name and file path created
- Number of categories researched
- Build vs buy recommendation summary
- Estimated 3-year TCO range
- Top 3 recommended vendors
- Key findings (3-5 bullet points)

## Quality Standards

- All pricing must come from web_search/web_fetch, not general knowledge
- Cross-reference pricing from multiple sources
- Prefer official vendor websites for pricing and features
- Include URLs as citations in research findings
- For UK Gov projects: ALWAYS check Digital Marketplace first
- TCO projections must be 3 years minimum

## Edge Cases

- **No requirements found**: Stop immediately, tell user requirements must exist
- **Vendor pricing hidden**: Mark as "Contact for quote"
- **Reviews scarce**: Note "Limited public reviews available"
""")


def create_agent(client: Anthropic) -> dict:
    """Create the ArcKit research managed agent."""
    agent = client.beta.agents.create(
        name="ArcKit Research Agent",
        description="Enterprise architecture market research: vendor evaluation, "
        "build vs buy analysis, TCO comparison, UK Gov Digital Marketplace search.",
        model="claude-sonnet-4-6",
        system=SYSTEM_PROMPT,
        tools=[
            {"type": "agent_toolset_20260401"},
        ],
    )
    print(f"Agent created: {agent.id} (version {agent.version})")
    return agent


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
    project_repo_url: str | None = None,
    project_github_token: str | None = None,
) -> dict:
    """Start a session, optionally mounting GitHub repos."""
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
        token = project_github_token or github_token
        if not token:
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
                    "authorization_token": token,
                    "mount_path": "/workspace/project",
                }
            )

    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=environment_id,
        title="ArcKit Research Session",
        resources=resources if resources else None,
    )
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
        agent = create_agent(client)
        agent_id = agent.id

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
