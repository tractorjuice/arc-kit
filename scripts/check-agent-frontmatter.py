#!/usr/bin/env python3
"""Guard the security-relevant frontmatter on plugin agent files.

Three failure modes, all of which have already shipped to users once:

1. **Missing `tools:` allowlist.** PR #445 migrated every research agent
   from a `disallowedTools` denylist to an explicit `tools:` allowlist so
   that tools added by future Claude Code versions do not auto-grant to
   existing agents. PR #446 then silently reverted it on three of them.

2. **Silent frontmatter stripping.** The regression in (1) was mechanical:
   `converter.py::copy_agent_stripped()` pops `CLAUDE_ONLY_AGENT_FIELDS`
   and rebuilds the block with `yaml.dump()`. Run with its destination
   pointing at the source tree, it strips `tools`/`effort`/`maxTurns` from
   the plugin itself and leaves behind a tell-tale alphabetised
   `description, model, name` block. Nothing detected it for three months
   and seven minor releases.

3. **Non-agent files in `agents/`.** Claude Code registers every `.md`
   under `agents/` as a dispatchable agent. A file with no frontmatter
   still registers, and resolves to an unrestricted tool grant --- which
   is what happened to `READER-PATTERN.md`.

Exit 0 on success, 1 on any violation.
"""

import os
import sys

import yaml

PLUGIN_ROOT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "plugins",
)

# Fields converter.py strips for non-Claude targets. If a file in the plugin
# source is missing ALL of these while carrying exactly the keys yaml.dump
# leaves behind, it has almost certainly been through copy_agent_stripped().
CLAUDE_ONLY_AGENT_FIELDS = ("effort", "initialPrompt", "maxTurns", "disallowedTools", "tools")
STRIPPED_SIGNATURE = {"description", "model", "name"}


def agent_dirs():
    """Yield every plugins/*/agents directory that exists."""
    for entry in sorted(os.listdir(PLUGIN_ROOT)):
        candidate = os.path.join(PLUGIN_ROOT, entry, "agents")
        if os.path.isdir(candidate):
            yield entry, candidate


def parse_frontmatter(path):
    """Return (frontmatter_dict_or_None, error_string_or_None)."""
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    if not content.startswith("---"):
        return None, "no YAML frontmatter"
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, "unterminated YAML frontmatter"
    try:
        return yaml.safe_load(parts[1]) or {}, None
    except yaml.YAMLError as exc:
        return None, f"unparseable frontmatter: {exc}"


def main():
    errors = []

    for plugin, directory in agent_dirs():
        for filename in sorted(os.listdir(directory)):
            if not filename.endswith(".md"):
                continue
            path = os.path.join(directory, filename)
            rel = os.path.relpath(path, os.path.dirname(PLUGIN_ROOT))

            # (3) Only agent files belong here. Claude Code registers
            # everything else as an all-tools agent.
            if not filename.startswith("arckit-"):
                errors.append(
                    f"{rel}: not an agent file. Claude Code registers every .md under "
                    f"agents/ as a dispatchable agent, so a reference doc here surfaces "
                    f"with an unrestricted tool grant. Move it to {plugin}/docs/."
                )
                continue

            frontmatter, error = parse_frontmatter(path)
            if error:
                errors.append(f"{rel}: {error}")
                continue

            for required in ("name", "description"):
                if not frontmatter.get(required):
                    errors.append(f"{rel}: missing required `{required}:`")

            # (1) Every agent needs an explicit allowlist. Deny-by-default
            # is the whole point; absence grants every tool in the harness.
            if "tools" not in frontmatter:
                errors.append(
                    f"{rel}: no `tools:` allowlist. Without one this agent receives every "
                    f"tool in the harness, including tools added by future Claude Code "
                    f"versions (see PR #445)."
                )
            elif not isinstance(frontmatter["tools"], list) or not frontmatter["tools"]:
                errors.append(f"{rel}: `tools:` must be a non-empty list")

            # (2) The converter-writeback signature.
            if set(frontmatter) == STRIPPED_SIGNATURE:
                errors.append(
                    f"{rel}: frontmatter is exactly {sorted(STRIPPED_SIGNATURE)}, the shape "
                    f"converter.py::copy_agent_stripped() leaves behind. The Claude-only "
                    f"fields ({', '.join(CLAUDE_ONLY_AGENT_FIELDS)}) were stripped from the "
                    f"plugin source. Restore them from git history."
                )

            # Plugin MCP tools resolve only under the mcp__plugin_<pkg>_<server>__
            # prefix; a bare mcp__<server>__<tool> entry matches nothing.
            for tool in frontmatter.get("tools", []) or []:
                if isinstance(tool, str) and tool.startswith("mcp__") and not tool.startswith("mcp__plugin_"):
                    errors.append(
                        f"{rel}: tool `{tool}` uses the bare MCP prefix, which matches nothing "
                        f"in plugin context. Use mcp__plugin_<package>_<server>__<tool>."
                    )

    if errors:
        print("Agent frontmatter check FAILED:\n")
        for err in errors:
            print(f"  - {err}")
        print(f"\n{len(errors)} problem(s) found.")
        return 1

    total = sum(
        len([f for f in os.listdir(d) if f.endswith(".md")]) for _, d in agent_dirs()
    )
    print(f"Agent frontmatter check passed ({total} agent files).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
