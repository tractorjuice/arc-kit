# Gemini CLI Full Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring the ArcKit Gemini CLI extension to full feature parity with the Claude Code plugin by adding sub-agents, hooks, policies, and a theme.

**Architecture:** Extend `scripts/converter.py` with new generator functions that convert Claude Code agents to Gemini sub-agent format, generate Gemini hooks.json + Python hook scripts, generate policy rules, and update the manifest with a theme. All Gemini-specific output lives in `arckit-gemini/`.

**Tech Stack:** Python 3 (converter + hook scripts), YAML/JSON/TOML generation, Gemini CLI extension API

---

### Task 1: Add `generate_gemini_agents()` to converter

**Files:**
- Modify: `scripts/converter.py`

**Step 1: Add the function after `rewrite_codex_skills()`**

```python
def generate_gemini_agents(agents_dir, output_dir, path_prefix="~/.gemini/extensions/arckit"):
    """Generate Gemini CLI sub-agent .md files from Claude Code agents."""
    if not os.path.isdir(agents_dir):
        return

    os.makedirs(output_dir, exist_ok=True)
    count = 0

    for filename in sorted(os.listdir(agents_dir)):
        if not (filename.startswith("arckit-") and filename.endswith(".md")):
            continue

        agent_path = os.path.join(agents_dir, filename)
        with open(agent_path, "r") as f:
            content = f.read()

        frontmatter, prompt = extract_frontmatter_and_prompt(content)

        # Build Gemini frontmatter: keep name/description, add Gemini-specific fields
        gemini_fm = {
            "name": frontmatter.get("name", filename.replace(".md", "")),
            "description": frontmatter.get("description", ""),
            "max_turns": 25,
            "timeout_mins": 10,
        }

        # Rewrite paths in prompt body
        prompt = prompt.replace("${CLAUDE_PLUGIN_ROOT}", path_prefix)
        prompt = re.sub(
            r"Read `(" + re.escape(path_prefix) + r"/[^`]+)`",
            r"Run `cat \1` to read the file",
            prompt,
        )

        # Prepend extension file access block
        prompt = EXTENSION_FILE_ACCESS_BLOCK + prompt

        # Build output: YAML frontmatter + prompt body
        fm_lines = ["---"]
        fm_lines.append(f"name: {gemini_fm['name']}")
        # Use block scalar for multi-line description
        desc = gemini_fm["description"]
        if "\n" in desc.strip():
            fm_lines.append("description: |")
            for line in desc.strip().split("\n"):
                fm_lines.append(f"  {line}")
        else:
            fm_lines.append(f"description: \"{desc.strip()}\"")
        fm_lines.append(f"max_turns: {gemini_fm['max_turns']}")
        fm_lines.append(f"timeout_mins: {gemini_fm['timeout_mins']}")
        fm_lines.append("---")
        fm_lines.append("")

        out_content = "\n".join(fm_lines) + prompt + "\n"
        out_path = os.path.join(output_dir, filename)
        with open(out_path, "w") as f:
            f.write(out_content)
        count += 1

    print(f"  Generated {count} Gemini sub-agent files in {output_dir}")
```

**Step 2: Call it from `__main__` after the Codex agent generation block**

Add these lines after `rewrite_codex_skills("arckit-codex/skills")`:

```python
print()
print("Generating Gemini extension agents...")
generate_gemini_agents(
    agents_dir,
    "arckit-gemini/agents",
    path_prefix="~/.gemini/extensions/arckit",
)
```

**Step 3: Run converter to verify**

Run: `python scripts/converter.py`
Expected: See "Generated 6 Gemini sub-agent files in arckit-gemini/agents"

**Step 4: Verify output**

Run: `head -15 arckit-gemini/agents/arckit-research.md`
Expected: YAML frontmatter with `name`, `description`, `max_turns: 25`, `timeout_mins: 10`, no `model` field. Body starts with `**IMPORTANT — Gemini Extension File Access**`.

**Step 5: Commit**

```bash
git add scripts/converter.py arckit-gemini/agents/
git commit -m "feat(gemini): add sub-agent generation to converter"
```

---

### Task 2: Create Python hook scripts

**Files:**
- Create: `arckit-gemini/hooks/scripts/session-start.py`
- Create: `arckit-gemini/hooks/scripts/context-inject.py`
- Create: `arckit-gemini/hooks/scripts/validate-filename.py`
- Create: `arckit-gemini/hooks/scripts/file-protection.py`
- Create: `arckit-gemini/hooks/scripts/update-manifest.py`
- Create: `arckit-gemini/hooks/scripts/hook_utils.py`

These are Python ports of the Claude Code `.mjs` hooks. All read JSON from stdin and write JSON to stdout. Exit 0 = success, exit 2 = block.

**Step 1: Create shared utilities `hook_utils.py`**

Port the key functions from `arckit-claude/hooks/hook-utils.mjs`:

```python
#!/usr/bin/env python3
"""Shared utilities for ArcKit Gemini CLI hooks."""

import json
import os
import re
import sys


def parse_hook_input():
    """Read and parse JSON from stdin. Return empty dict on failure."""
    try:
        return json.load(sys.stdin)
    except Exception:
        return {}


def find_repo_root(cwd):
    """Walk up from cwd until we find a directory containing projects/."""
    d = os.path.abspath(cwd)
    for _ in range(20):
        if os.path.isdir(os.path.join(d, "projects")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    return None


def output_json(data):
    """Write JSON to stdout."""
    json.dump(data, sys.stdout)
    sys.stdout.write("\n")


def output_context(context_text):
    """Output additionalContext for SessionStart/BeforeAgent hooks."""
    output_json({
        "hookSpecificOutput": {
            "additionalContext": context_text
        }
    })


def output_block(reason):
    """Block an action (exit code 2) with a reason on stderr."""
    sys.stderr.write(reason + "\n")
    sys.exit(2)


# Document type mappings
DOC_TYPES = {
    "REQ": "Requirements", "STKE": "Stakeholders", "RISK": "Risk Register",
    "SOBC": "Business Case", "ADR": "Architecture Decision",
    "DIAG": "Diagram", "WARD": "Wardley Map", "PRIN": "Principles",
    "HLD": "High-Level Design", "DLD": "Detailed Design",
    "DMC": "Data Mesh Contract", "DATA": "Data Model",
    "DPIA": "Data Protection Impact", "ROAD": "Roadmap",
    "SECD": "Security Design", "SECD-MOD": "MOD Security Design",
    "PRIN-COMP": "Principles Compliance", "SVC": "ServiceNow Design",
    "TRACE": "Traceability Matrix", "PRES": "Presentation",
    "CONF": "Conformance Review", "SAR": "Service Assessment",
    "RFP": "RFP Document", "EVAL": "Vendor Evaluation",
    "SOW": "Statement of Work", "DOS": "Digital Outcomes",
    "OPS": "Operations Runbook", "DEVOPS": "DevOps Pipeline",
    "FINOPS": "FinOps Framework", "GLOSS": "Glossary",
    "STORY": "User Stories", "PLAN": "Project Plan",
    "PLAT": "Platform Design", "STRAT": "Strategy",
    "FRAME": "Framework", "DFD": "Data Flow Diagram",
    "TCOP": "TCoP Compliance", "MATURE": "Maturity Model",
    "MLOPS": "MLOps Pipeline", "AIPLAY": "AI Playbook",
    "TMPL": "Template Builder", "JSP936": "JSP 936 Assessment",
}

MULTI_INSTANCE_TYPES = {"ADR", "DIAG", "WARD", "DMC", "SAR"}

ARC_PATTERN = re.compile(
    r"^ARC-(\d+)-([A-Z][\w-]*?)(?:-(\d{3}))?-v(\d+(?:\.\d+)?)\.md$"
)


def extract_doc_type(filename):
    """Extract document type code from ARC filename."""
    m = ARC_PATTERN.match(filename)
    if not m:
        return None
    return m.group(2)
```

**Step 2: Create `session-start.py`**

Port from `arckit-claude/hooks/arckit-session.mjs`:

```python
#!/usr/bin/env python3
"""ArcKit SessionStart hook for Gemini CLI.

Injects ArcKit version and project status into session context.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import parse_hook_input, output_context, find_repo_root

data = parse_hook_input()
cwd = data.get("cwd", ".")

# Read extension version
ext_dir = os.environ.get("extensionPath", "")
if not ext_dir:
    ext_dir = os.path.join(os.path.dirname(__file__), "..", "..")
version_file = os.path.join(ext_dir, "VERSION")
version = "unknown"
if os.path.isfile(version_file):
    try:
        version = open(version_file).read().strip()
    except Exception:
        pass

lines = [f"ArcKit Gemini Extension v{version} loaded."]

# Check for projects directory
root = find_repo_root(cwd)
if root:
    projects_dir = os.path.join(root, "projects")
    lines.append(f"Projects directory: {projects_dir}")
    try:
        dirs = sorted(d for d in os.listdir(projects_dir)
                      if os.path.isdir(os.path.join(projects_dir, d)))
        if dirs:
            lines.append(f"Found {len(dirs)} project(s): {', '.join(dirs)}")
    except Exception:
        pass
else:
    lines.append("No projects/ directory found. Run /arckit:init to create one.")

output_context("\n".join(lines))
```

**Step 3: Create `context-inject.py`**

Port from `arckit-claude/hooks/arckit-context.mjs`:

```python
#!/usr/bin/env python3
"""ArcKit BeforeAgent hook for Gemini CLI.

Injects project artifact inventory before agent planning.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import (
    parse_hook_input, output_context, find_repo_root,
    DOC_TYPES, extract_doc_type
)

data = parse_hook_input()
prompt = data.get("prompt", "")
cwd = data.get("cwd", ".")

# Only inject for arckit commands
if not prompt.strip().startswith("/arckit:"):
    sys.exit(0)

# Skip commands that don't need context
SKIP = {"pages", "customize", "create", "init", "list", "trello"}
cmd = prompt.strip().split()[0].replace("/arckit:", "")
if cmd in SKIP:
    sys.exit(0)

root = find_repo_root(cwd)
if not root:
    sys.exit(0)

projects_dir = os.path.join(root, "projects")
if not os.path.isdir(projects_dir):
    sys.exit(0)

lines = ["## ArcKit Project Context (auto-detected)", ""]

try:
    project_dirs = sorted(
        d for d in os.listdir(projects_dir)
        if os.path.isdir(os.path.join(projects_dir, d))
    )
except Exception:
    sys.exit(0)

for proj_dir in project_dirs:
    proj_path = os.path.join(projects_dir, proj_dir)
    lines.append(f"### {proj_dir}")
    lines.append(f"Path: `{proj_path}`")
    lines.append("")

    # Scan for ARC-* files in project root and subdirs
    artifacts = []
    for scan_dir in [proj_path] + [
        os.path.join(proj_path, d) for d in os.listdir(proj_path)
        if os.path.isdir(os.path.join(proj_path, d))
    ]:
        try:
            for f in os.listdir(scan_dir):
                if f.startswith("ARC-") and f.endswith(".md"):
                    doc_type = extract_doc_type(f)
                    type_name = DOC_TYPES.get(doc_type, doc_type or "Unknown")
                    rel = os.path.relpath(os.path.join(scan_dir, f), root)
                    artifacts.append(f"- `{rel}` ({type_name})")
        except Exception:
            continue

    if artifacts:
        lines.append("**Artifacts:**")
        lines.extend(artifacts)
    else:
        lines.append("*No artifacts yet*")
    lines.append("")

output_context("\n".join(lines))
```

**Step 4: Create `validate-filename.py`**

Port from `arckit-claude/hooks/validate-arc-filename.mjs`:

```python
#!/usr/bin/env python3
"""ArcKit BeforeTool hook for Gemini CLI.

Validates and corrects ARC-xxx filename conventions on write_file.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import parse_hook_input, output_json, DOC_TYPES, MULTI_INSTANCE_TYPES

data = parse_hook_input()
tool_input = data.get("tool_input", {})
file_path = tool_input.get("path", tool_input.get("file_path", ""))

if not file_path:
    sys.exit(0)

# Only process ARC-*.md files in projects/
if "/projects/" not in file_path:
    sys.exit(0)

filename = os.path.basename(file_path)
if not filename.startswith("ARC-") or not filename.endswith(".md"):
    sys.exit(0)

# Parse filename
pattern = re.compile(
    r"^ARC-(\d+)-([A-Z][\w-]*?)(?:-(\d{3}))?-v(\d+(?:\.\d+)?)\.md$"
)
m = pattern.match(filename)
if not m:
    sys.exit(0)

pid, type_code, seq, ver = m.group(1), m.group(2), m.group(3), m.group(4)

# Validate type code
if type_code not in DOC_TYPES:
    sys.stderr.write(
        f"Unknown document type code '{type_code}'. "
        f"Known types: {', '.join(sorted(DOC_TYPES.keys()))}\n"
    )
    sys.exit(2)

# Normalize project ID to 3 digits
pid = pid.zfill(3)

# Normalize version (1 -> 1.0)
if "." not in ver:
    ver = ver + ".0"

corrected = f"ARC-{pid}-{type_code}"
if seq:
    corrected += f"-{seq}"
corrected += f"-v{ver}.md"

corrected_path = os.path.join(os.path.dirname(file_path), corrected)

if corrected_path != file_path:
    tool_input_copy = dict(tool_input)
    if "path" in tool_input_copy:
        tool_input_copy["path"] = corrected_path
    elif "file_path" in tool_input_copy:
        tool_input_copy["file_path"] = corrected_path
    output_json({"updatedInput": tool_input_copy})
```

**Step 5: Create `file-protection.py`**

Port from `arckit-claude/hooks/file-protection.mjs`:

```python
#!/usr/bin/env python3
"""ArcKit BeforeTool hook for Gemini CLI.

Blocks writes to sensitive/protected files.
"""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import parse_hook_input, output_json

data = parse_hook_input()
tool_input = data.get("tool_input", {})
file_path = tool_input.get("path", tool_input.get("file_path", ""))

if not file_path:
    sys.exit(0)

basename = os.path.basename(file_path)
lower_path = file_path.lower()

# Protected exact filenames
PROTECTED = {
    ".env", ".env.local", ".env.production", ".env.staging",
    ".npmrc", "credentials.json", "service-account.json",
    "id_rsa", "id_ed25519", "id_ecdsa",
}

# Protected extensions
PROTECTED_EXT = {".pem", ".key", ".p12", ".pfx", ".jks", ".keystore"}

# Protected directories
PROTECTED_DIRS = {".git/", ".aws/", ".ssh/", ".gnupg/"}

# Sensitive keywords in filename
SENSITIVE_KEYWORDS = [
    "api-key", "apikey", "password", "passwd", "secret",
    "token", "credential", "private-key", "privatekey",
]

# Directories where sensitive keywords are allowed
ALLOWED_DIRS = [
    "commands/", "templates/", "docs/", "projects/",
    "hooks/", "skills/", "guides/",
]

# Check protected files
if basename in PROTECTED:
    sys.stderr.write(f"Protected file: {basename} cannot be modified.\n")
    sys.exit(2)

# Check protected extensions
_, ext = os.path.splitext(basename)
if ext.lower() in PROTECTED_EXT:
    sys.stderr.write(f"Protected file type: {ext} files cannot be modified.\n")
    sys.exit(2)

# Check protected directories
for pd in PROTECTED_DIRS:
    if pd in file_path:
        sys.stderr.write(f"Protected directory: {pd} cannot be modified.\n")
        sys.exit(2)

# Check sensitive keywords (skip if in allowed directories)
in_allowed_dir = any(ad in file_path for ad in ALLOWED_DIRS)
if not in_allowed_dir:
    for kw in SENSITIVE_KEYWORDS:
        if kw in lower_path:
            sys.stderr.write(
                f"Filename contains sensitive keyword '{kw}'. "
                f"Cannot write to: {file_path}\n"
            )
            sys.exit(2)

# Silent success
sys.exit(0)
```

**Step 6: Create `update-manifest.py`**

Port from `arckit-claude/hooks/update-manifest.mjs`:

```python
#!/usr/bin/env python3
"""ArcKit AfterTool hook for Gemini CLI.

Updates docs/manifest.json after writing ARC-* project files.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import parse_hook_input, find_repo_root, DOC_TYPES, ARC_PATTERN

data = parse_hook_input()
tool_input = data.get("tool_input", {})
file_path = tool_input.get("path", tool_input.get("file_path", ""))
content = tool_input.get("content", "")

if not file_path or "/projects/" not in file_path:
    sys.exit(0)

filename = os.path.basename(file_path)
m = ARC_PATTERN.match(filename)
if not m:
    sys.exit(0)

cwd = data.get("cwd", ".")
root = find_repo_root(cwd)
if not root:
    sys.exit(0)

manifest_path = os.path.join(root, "docs", "manifest.json")
if not os.path.isfile(manifest_path):
    sys.exit(0)

try:
    with open(manifest_path) as f:
        manifest = json.load(f)
except Exception:
    sys.exit(0)

pid, type_code = m.group(1), m.group(2)
doc_id = filename.replace(".md", "")
# Base ID for dedup: strip version
base_id = re.sub(r"-v[\d.]+$", "", doc_id)

rel_path = os.path.relpath(file_path, root)
type_name = DOC_TYPES.get(type_code, type_code)

# Extract title from content (first # heading) or use type name
title = type_name
for line in content.split("\n"):
    if line.startswith("# "):
        title = line[2:].strip()
        break

entry = {"path": rel_path, "title": title, "documentId": doc_id}

# Determine if global or project
if "/000-global/" in file_path or "/000-global\\" in file_path:
    arr = manifest.setdefault("global", [])
    arr[:] = [e for e in arr if not e.get("documentId", "").startswith(base_id)]
    if type_code == "PRIN":
        entry["isDefault"] = True
    arr.append(entry)
else:
    # Find or create project entry
    projects = manifest.setdefault("projects", [])
    # Extract project dir name
    parts = rel_path.split("/")
    proj_idx = parts.index("projects") if "projects" in parts else -1
    if proj_idx < 0 or proj_idx + 1 >= len(parts):
        sys.exit(0)
    proj_dir_name = parts[proj_idx + 1]

    proj_entry = None
    for p in projects:
        if p.get("directory") == proj_dir_name or p.get("name") == proj_dir_name:
            proj_entry = p
            break

    if not proj_entry:
        proj_entry = {"name": proj_dir_name, "directory": proj_dir_name, "documents": []}
        projects.append(proj_entry)

    docs = proj_entry.setdefault("documents", [])
    docs[:] = [e for e in docs if not e.get("documentId", "").startswith(base_id)]
    docs.append(entry)

# Update timestamp
from datetime import datetime, timezone
manifest["generated"] = datetime.now(timezone.utc).isoformat()

with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
```

**Step 7: Commit**

```bash
git add arckit-gemini/hooks/
git commit -m "feat(gemini): add Python hook scripts for Gemini CLI"
```

---

### Task 3: Generate `hooks/hooks.json` from converter

**Files:**
- Modify: `scripts/converter.py`

**Step 1: Add `generate_gemini_hooks()` function**

```python
def generate_gemini_hooks(output_dir):
    """Generate hooks/hooks.json for Gemini CLI extension."""
    hooks_dir = os.path.join(output_dir, "hooks")
    os.makedirs(hooks_dir, exist_ok=True)

    hooks_json = {
        "hooks": {
            "SessionStart": [
                {
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/session-start.py",
                            "name": "ArcKit Session Init",
                            "timeout": 5000,
                            "description": "Inject ArcKit version and project context",
                        }
                    ]
                }
            ],
            "BeforeAgent": [
                {
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/context-inject.py",
                            "name": "ArcKit Context",
                            "timeout": 10000,
                            "description": "Inject project context before agent planning",
                        }
                    ]
                }
            ],
            "BeforeTool": [
                {
                    "matcher": "write_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/validate-filename.py",
                            "name": "ARC Filename Validator",
                            "timeout": 5000,
                            "description": "Validate ARC-xxx filename convention",
                        }
                    ],
                },
                {
                    "matcher": "write_file|edit_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/file-protection.py",
                            "name": "File Protection",
                            "timeout": 5000,
                            "description": "Protect ArcKit system files from modification",
                        }
                    ],
                },
            ],
            "AfterTool": [
                {
                    "matcher": "write_file",
                    "hooks": [
                        {
                            "type": "command",
                            "command": "python3 ${extensionPath}/hooks/scripts/update-manifest.py",
                            "name": "Manifest Updater",
                            "timeout": 5000,
                            "description": "Update manifest.json after writing project files",
                        }
                    ],
                }
            ],
        }
    }

    hooks_path = os.path.join(hooks_dir, "hooks.json")
    with open(hooks_path, "w") as f:
        json.dump(hooks_json, f, indent=2)
        f.write("\n")
    print(f"  Generated: {hooks_path}")
```

**Step 2: Call from `__main__`**

Add after the `generate_gemini_agents` call:

```python
print()
print("Generating Gemini extension hooks...")
generate_gemini_hooks("arckit-gemini")
```

**Step 3: Run and verify**

Run: `python scripts/converter.py`
Expected: See "Generated: arckit-gemini/hooks/hooks.json"

Run: `python3 -m json.tool arckit-gemini/hooks/hooks.json > /dev/null && echo valid`
Expected: "valid"

**Step 4: Commit**

```bash
git add scripts/converter.py arckit-gemini/hooks/hooks.json
git commit -m "feat(gemini): generate hooks.json from converter"
```

---

### Task 4: Add policies and theme

**Files:**
- Modify: `scripts/converter.py`
- Modify: `arckit-gemini/gemini-extension.json`

**Step 1: Add `generate_gemini_policies()` function**

```python
def generate_gemini_policies(output_dir):
    """Generate policies/rules.toml for Gemini CLI extension."""
    policies_dir = os.path.join(output_dir, "policies")
    os.makedirs(policies_dir, exist_ok=True)

    rules = '''\
# ArcKit Gemini Extension Policies
# Auto-generated by scripts/converter.py

# Protect ArcKit extension files from modification
[[rules]]
description = "Prevent modification of ArcKit extension system files"
when = "tool_name in ['write_file', 'edit_file'] and '~/.gemini/extensions/arckit/' in tool_input.get('path', '')"
decision = "deny"
reason = "Cannot modify ArcKit extension files. These are managed by the extension."

# Warn on potential secret patterns in file content
[[rules]]
description = "Warn when writing files containing potential secrets"
when = "tool_name == 'write_file' and any(p in tool_input.get('content', '') for p in ['PRIVATE KEY', 'password=', 'secret=', 'api_key='])"
decision = "ask"
reason = "File content may contain secrets. Please confirm this is intentional."
'''

    rules_path = os.path.join(policies_dir, "rules.toml")
    with open(rules_path, "w") as f:
        f.write(rules)
    print(f"  Generated: {rules_path}")
```

**Step 2: Call from `__main__`**

Add after `generate_gemini_hooks`:

```python
print()
print("Generating Gemini extension policies...")
generate_gemini_policies("arckit-gemini")
```

**Step 3: Update `gemini-extension.json` to add theme and fix description count**

Update `arckit-gemini/gemini-extension.json`:
- Change description from "54 commands" to "57 commands"
- Add `themes` array with GDS-branded ArcKit theme

```json
{
  "name": "arckit",
  "version": "4.0.0",
  "description": "Enterprise Architecture Governance & Vendor Procurement Toolkit - 57 commands for architecture artifacts, vendor procurement, and UK Government compliance",
  "contextFileName": "GEMINI.md",
  "mcpServers": { ... },
  "settings": [ ... ],
  "themes": [
    {
      "name": "arckit",
      "type": "custom",
      "background": { "primary": "#0b0c0c" },
      "text": { "primary": "#f0f0f0", "secondary": "#b1b4b6", "link": "#1d70b8" },
      "status": { "success": "#00703c", "warning": "#f47738", "error": "#d4351c" },
      "border": { "default": "#505a5f" },
      "ui": { "comment": "#a0a8b0" }
    }
  ]
}
```

**Step 4: Run and verify**

Run: `python scripts/converter.py`
Expected: See "Generated: arckit-gemini/policies/rules.toml"

Run: `python3 -c "import json; json.load(open('arckit-gemini/gemini-extension.json')); print('valid')"`
Expected: "valid"

**Step 5: Commit**

```bash
git add scripts/converter.py arckit-gemini/policies/ arckit-gemini/gemini-extension.json
git commit -m "feat(gemini): add policies and GDS-branded theme"
```

---

### Task 5: Update GEMINI.md and README.md

**Files:**
- Modify: `arckit-gemini/GEMINI.md`
- Modify: `arckit-gemini/README.md`

**Step 1: Update GEMINI.md**

Add sections documenting agents and hooks after the existing content:

```markdown
## Agents (Sub-agents)

ArcKit includes 6 autonomous research agents that run as sub-agents. These handle research-heavy tasks in isolated context:

| Agent | Purpose |
|-------|---------|
| `arckit-research` | Market research, vendor evaluation, build vs buy, TCO |
| `arckit-datascout` | Data source discovery, API catalogue search |
| `arckit-aws-research` | AWS service research via AWS Knowledge MCP |
| `arckit-azure-research` | Azure service research via Microsoft Learn MCP |
| `arckit-gcp-research` | GCP service research via Google Developer Knowledge MCP |
| `arckit-framework` | Transform artifacts into structured framework |

Agents are invoked automatically by commands that need heavy web research.

## Hooks

ArcKit includes automation hooks that fire during your session:

| Event | Hook | Purpose |
|-------|------|---------|
| SessionStart | Session Init | Inject ArcKit version and project status |
| BeforeAgent | Context Inject | Inject project artifact inventory |
| BeforeTool | Filename Validator | Validate ARC-xxx naming convention |
| BeforeTool | File Protection | Block writes to sensitive/protected files |
| AfterTool | Manifest Updater | Update manifest.json after writing project files |

## Policies

ArcKit includes policy rules that:
- Prevent modification of extension system files
- Warn when file content may contain secrets
```

**Step 2: Update README.md feature list**

Update the feature summary in `arckit-gemini/README.md` to mention agents, hooks, policies, and theme.

**Step 3: Commit**

```bash
git add arckit-gemini/GEMINI.md arckit-gemini/README.md
git commit -m "docs(gemini): document agents, hooks, policies, and theme"
```

---

### Task 6: Update project docs and CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (if needed — update Gemini extension description)
- Modify: `docs/DEPENDENCY-MATRIX.md` (if Gemini column needs updating)

**Step 1: Update CLAUDE.md Gemini extension description**

In the overview section, update the Gemini CLI extension description to mention agents, hooks, and policies.

**Step 2: Run full converter and verify end-to-end**

Run: `python scripts/converter.py`
Expected: All outputs generated without errors, including:
- 57 Gemini TOML commands
- 6 Gemini sub-agent .md files
- hooks/hooks.json
- policies/rules.toml
- Supporting files copied

Verify directory structure:
```bash
ls arckit-gemini/agents/
ls arckit-gemini/hooks/
ls arckit-gemini/hooks/scripts/
ls arckit-gemini/policies/
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(gemini): complete full parity with Claude Code plugin"
```
