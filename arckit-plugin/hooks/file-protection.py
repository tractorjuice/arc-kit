#!/usr/bin/env python3
"""
File Protection Hook for ArcKit
Blocks edits to sensitive files (environment files, credentials, private keys, lock files).

Hook Type: PreToolUse
Matcher: Edit|Write
Blocking is via JSON {"decision": "block"} on stdout.
Exit code is always 0.
"""

import json
import re
import sys

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

# Sensitive keywords in filenames - block creation of files containing these
# Case-insensitive matching
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

# Keywords that must match as whole words only (using word boundary regex)
# to avoid false positives like "pin" in "Mapping" or "pat" in "Pattern"
SENSITIVE_WHOLE_WORD_KEYWORDS = [
    "pin",
    "pat",
]

# Files that are allowed exceptions to the sensitive keyword rule
# These are legitimate security tool files, not actual secrets
ALLOWED_EXCEPTIONS = [
    ".secrets.baseline",  # detect-secrets baseline file
    ".pre-commit-config.yaml",  # pre-commit config may reference secrets detection
    "secret-detection.py",  # secret detection hook itself
    "secret-file-scanner.py",  # secret file scanner hook itself
]

# Directories where sensitive keywords in filenames are allowed
# (documentation/skill files that discuss secrets, not actual secrets)
ALLOWED_DIRECTORIES = [
    "arckit-plugin/commands/",  # Command documentation may reference secret management
    "arckit-plugin/templates/",  # Templates may reference credential patterns
    "arckit-plugin/agents/",  # Agent definitions
    "arckit-plugin/hooks/",  # Hook scripts (including this one)
    "docs/",  # Documentation files
    ".arckit/templates/",  # Project-level templates
    "projects/",  # ArcKit governance artifacts may discuss security topics
]


def is_protected(file_path: str) -> tuple[bool, str]:
    """Check if file path matches any protected pattern."""
    from pathlib import Path

    # Normalise path for consistent matching
    path_parts = Path(file_path).parts
    filename = Path(file_path).name
    filename_lower = filename.lower()

    # Check for allowed exceptions first
    if filename in ALLOWED_EXCEPTIONS:
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
            if dir_name in path_parts:
                return True, f"Protected directory: {protected}"
        else:
            # Exact filename match (not substring)
            if filename == protected or file_path.endswith("/" + protected):
                return True, f"Protected file: {protected}"

    # Check for sensitive keywords in filename (case-insensitive substring match)
    for keyword in SENSITIVE_FILENAME_KEYWORDS:
        if keyword in filename_lower:
            return True, f"Sensitive keyword in filename: '{keyword}'"

    # Check for whole-word sensitive keywords (avoids "pin" in "Mapping", "pat" in "Pattern")
    for keyword in SENSITIVE_WHOLE_WORD_KEYWORDS:
        if re.search(rf'\b{re.escape(keyword)}\b', filename_lower):
            return True, f"Sensitive keyword in filename: '{keyword}'"

    return False, ""


def main():
    # Startup guard: exit gracefully if no valid input
    try:
        raw_input = sys.stdin.read()
        if not raw_input or not raw_input.strip():
            sys.exit(0)
        input_data = json.loads(raw_input)
    except (json.JSONDecodeError, ValueError, EOFError):
        # Exit gracefully during startup or invalid input
        sys.exit(0)
    except Exception:
        # Any other error - exit gracefully
        sys.exit(0)

    tool_name = input_data.get("tool_name", "")
    file_path = input_data.get("tool_input", {}).get("file_path", "")

    # Only check Edit and Write tools
    if tool_name not in ("Edit", "Write"):
        sys.exit(0)

    if not file_path:
        sys.exit(0)

    is_blocked, reason = is_protected(file_path)

    if is_blocked:
        output = {
            "decision": "block",
            "reason": f"Protected: {reason}\nFile: {file_path}\nEdit manually outside Claude Code, or add an exception in file-protection.py."
        }
        print(json.dumps(output))
        sys.exit(0)

    # Return additionalContext for allowed files with hints
    if any(kw in file_path.lower() for kw in ["config", "settings", "setup"]):
        output = {
            "additionalContext": f"Note: {file_path} may contain configuration. Ensure no secrets are included."
        }
        print(json.dumps(output))

    sys.exit(0)


if __name__ == "__main__":
    main()
