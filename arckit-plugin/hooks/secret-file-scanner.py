#!/usr/bin/env python3
"""
Secret File Scanner Hook for ArcKit
Scans file content being written for potential secrets.

Hook Type: PreToolUse
Matcher: Edit|Write
Blocking is via JSON {"decision": "block"} on stdout.
Exit code is always 0.
"""

import json
import re
import sys

# Secret patterns - synced with secret-detection.py
SECRET_PATTERNS = [
    # Explicit key-value patterns
    (r"(?i)\b(password|passwd|pwd)\s*[:=]\s*\S+", "password"),
    (r"(?i)\b(secret|api_?secret)\s*[:=]\s*\S+", "secret"),
    (r"(?i)\b(api_?key|apikey)\s*[:=]\s*\S+", "API key"),
    (r"(?i)\b(token|auth_?token|access_?token)\s*[:=]\s*\S+", "token"),
    (r"(?i)\b(private_?key)\s*[:=]\s*\S+", "private key"),

    # Common API key formats
    (r"sk-[a-zA-Z0-9]{20,}", "OpenAI API key"),
    (r"sk-ant-[a-zA-Z0-9-]{20,}", "Anthropic API key"),
    (r"ghp_[a-zA-Z0-9]{36}", "GitHub personal access token"),
    (r"gho_[a-zA-Z0-9]{36}", "GitHub OAuth token"),
    (r"ghs_[a-zA-Z0-9]{36}", "GitHub server token"),
    (r"AKIA[0-9A-Z]{16}", "AWS access key ID"),
    (r"(?i)aws_secret_access_key\s*[:=]\s*\S+", "AWS secret key"),

    # Notion tokens
    (r"ntn_[a-zA-Z0-9]{40,}", "Notion integration token"),
    (r"secret_[a-zA-Z0-9]{40,}", "potential secret token"),

    # Atlassian tokens
    (r"(?i)atlassian[-_]?token\s*[:=]\s*\S+", "Atlassian token"),
    (r"(?i)confluence[-_]?token\s*[:=]\s*\S+", "Confluence token"),
    (r"(?i)jira[-_]?token\s*[:=]\s*\S+", "Jira token"),
    (r"ATATT[a-zA-Z0-9]{20,}", "Atlassian API token"),

    # Slack tokens
    (r"xox[baprs]-[0-9A-Za-z\-]{10,}", "Slack token"),

    # Google API keys
    (r"AIza[0-9A-Za-z\-_]{35}", "Google API key"),

    # Bearer tokens
    (r"(?i)bearer\s+[a-zA-Z0-9\-_\.]{20,}", "Bearer token"),

    # Connection strings
    (r"(?i)(mongodb|postgres|mysql|redis)://[^\s]+:[^\s]+@", "database connection string"),

    # Private keys (PEM format headers)
    (r"-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----", "private key (PEM)"),
    (r"-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----", "SSH private key"),

    # Generic high-entropy credentials
    (r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?[A-Za-z0-9+/=]{32,}['\"]?", "high-entropy credential"),
]

# Files to skip scanning (legitimate security tool files, documentation, etc.)
SKIP_PATTERNS = [
    r"\.pre-commit-config\.yaml$",
    r"secret-detection\.py$",
    r"secret-file-scanner\.py$",
    r"file-protection\.py$",
    r"\.secrets\.baseline$",
    r"arckit-plugin/commands/.*\.md$",
    r"arckit-plugin/templates/.*\.md$",
    r"docs/.*\.md$",
    r"CHANGELOG\.md$",
    r"README\.md$",
]


def should_skip_file(file_path: str) -> bool:
    """Check if file should be skipped from scanning."""
    for pattern in SKIP_PATTERNS:
        if re.search(pattern, file_path):
            return True
    return False


def check_content_for_secrets(content: str) -> list[tuple[str, int]]:
    """Check content for potential secrets. Returns list of (type, count) tuples."""
    findings = []
    for pattern, secret_type in SECRET_PATTERNS:
        matches = re.findall(pattern, content)
        if matches:
            findings.append((secret_type, len(matches)))
    return findings


def main():
    # Startup guard: exit gracefully if no valid input
    try:
        raw_input = sys.stdin.read()
        if not raw_input or not raw_input.strip():
            sys.exit(0)
        input_data = json.loads(raw_input)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(0)
    except Exception:
        sys.exit(0)

    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    # Only check Edit and Write tools
    if tool_name not in ("Edit", "Write"):
        sys.exit(0)

    file_path = tool_input.get("file_path", "")

    # Skip certain files (documentation, security tools themselves)
    if should_skip_file(file_path):
        sys.exit(0)

    # Get the content being written
    content = ""
    if tool_name == "Write":
        content = tool_input.get("content", "")
    elif tool_name == "Edit":
        content = tool_input.get("new_string", "")

    if not content:
        sys.exit(0)

    findings = check_content_for_secrets(content)

    if findings:
        # Build warning message
        secret_types = [f"{stype} ({count}x)" for stype, count in findings]
        warning = f"Potential secrets detected in file content: {', '.join(secret_types)}"

        # Output blocking decision
        output = {
            "decision": "block",
            "reason": f"Warning: {warning}\n\nFile: {file_path}\n\nPlease remove sensitive data before writing."
        }
        print(json.dumps(output))
        sys.exit(0)

    # No secrets found - allow the write
    sys.exit(0)


if __name__ == "__main__":
    main()
