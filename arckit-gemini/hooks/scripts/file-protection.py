#!/usr/bin/env python3
"""
ArcKit BeforeTool Hook for Gemini CLI -- File Protection.

Blocks edits to sensitive files (environment files, credentials,
private keys, lock files).

Python equivalent of arckit-claude/hooks/file-protection.mjs.

Hook Type: BeforeTool
Input (stdin): JSON with tool_name, tool_input, etc.
Output (stdout): JSON with decision:block if blocked
Exit codes: 0 = allow, 2 = block
"""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from hook_utils import parse_hook_input, output_json, output_block

# Files and paths to protect
PROTECTED_PATHS = [
    # Environment files
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    # Lock files
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Gemfile.lock",
    "poetry.lock",
    "Cargo.lock",
    # Version control
    ".git/",
    # Credentials directories
    ".aws/",
    ".ssh/",
    ".gnupg/",
    # Common secret files
    "credentials",
    "credentials.json",
    "secrets.json",
    "secrets.yaml",
    "secrets.yml",
    ".secrets",
    # Private keys and certificates
    "*.pem",
    "*.key",
    "*.p12",
    "*.pfx",
    "id_rsa",
    "id_ed25519",
    "id_ecdsa",
    # Token files
    ".npmrc",
    ".pypirc",
    ".netrc",
    # Local configuration with secrets
    "config.local.json",
]

# Sensitive keywords in filenames (case-insensitive substring match)
SENSITIVE_FILENAME_KEYWORDS = [
    "api key",
    "apikey",
    "api-key",
    "api_key",
    "password",
    "passwd",
    "secret",
    "token",
    "credential",
    "private key",
    "privatekey",
]

# Keywords that must match as whole words only
SENSITIVE_WHOLE_WORD_KEYWORDS = [
    "pin",
    "pat",
]

# Files that are allowed exceptions to the sensitive keyword rule
ALLOWED_EXCEPTIONS = [
    ".secrets.baseline",
    ".pre-commit-config.yaml",
    "secret-detection.mjs",
    "secret-file-scanner.mjs",
]

# Directories where sensitive keywords in filenames are allowed
ALLOWED_DIRECTORIES = [
    "arckit-gemini/commands/",
    "arckit-gemini/templates/",
    "arckit-gemini/agents/",
    "arckit-gemini/hooks/",
    "docs/",
    ".arckit/templates/",
    "projects/",
]


def is_protected(file_path):
    """Check if a file path is protected. Returns (blocked, reason)."""
    parts = file_path.replace("\\", "/").split("/")
    file_name = os.path.basename(file_path)
    file_name_lower = file_name.lower()

    # Check for allowed exceptions first
    if file_name in ALLOWED_EXCEPTIONS:
        return False, ""

    # Check if file is in an allowed directory
    for allowed_dir in ALLOWED_DIRECTORIES:
        if allowed_dir in file_path:
            return False, ""

    # Check protected paths
    for protected in PROTECTED_PATHS:
        if protected.startswith("*"):
            # Wildcard suffix match (e.g., *.pem)
            if file_path.endswith(protected[1:]):
                return True, f"Protected file type: {protected}"
        elif protected.endswith("/"):
            # Directory match - check if directory appears as a path segment
            dir_name = protected[:-1]
            if dir_name in parts:
                return True, f"Protected directory: {protected}"
        else:
            # Exact filename match (not substring)
            if file_name == protected or file_path.endswith("/" + protected):
                return True, f"Protected file: {protected}"

    # Check for sensitive keywords in filename (case-insensitive substring match)
    for keyword in SENSITIVE_FILENAME_KEYWORDS:
        if keyword in file_name_lower:
            return True, f"Sensitive keyword in filename: '{keyword}'"

    # Check for whole-word sensitive keywords
    for keyword in SENSITIVE_WHOLE_WORD_KEYWORDS:
        escaped = re.escape(keyword)
        if re.search(rf"\b{escaped}\b", file_name_lower, re.IGNORECASE):
            return True, f"Sensitive keyword in filename: '{keyword}'"

    return False, ""


# --- Main ---
input_data = parse_hook_input()
if not input_data:
    sys.exit(0)

tool_name = input_data.get("tool_name", "")
file_path = input_data.get("tool_input", {}).get("file_path", "")

# Only check write-related tools
if tool_name not in ("write_file", "edit_file", "Edit", "Write"):
    sys.exit(0)
if not file_path:
    sys.exit(0)

blocked, reason = is_protected(file_path)

if blocked:
    output_block(
        f"Protected: {reason}\n"
        f"File: {file_path}\n"
        f"Edit manually outside Gemini CLI, or add an exception in file-protection.py."
    )

# Return additionalContext for allowed files with hints
file_path_lower = file_path.lower()
if any(kw in file_path_lower for kw in ("config", "settings", "setup")):
    output_json({
        "hookSpecificOutput": {
            "additionalContext": (
                f"Note: {file_path} may contain configuration. "
                "Ensure no secrets are included."
            ),
        }
    })

sys.exit(0)
