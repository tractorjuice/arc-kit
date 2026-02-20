# Security Hooks Guide

ArcKit includes three security hooks that provide layered protection against accidental secret exposure during Claude Code sessions. These hooks run automatically and require no manual configuration.

## Three-Layer Protection Model

The security hooks implement defence in depth with three complementary layers:

| Layer | Hook | Hook Type | Trigger | Purpose |
|-------|------|-----------|---------|---------|
| 1 | `secret-detection.py` | UserPromptSubmit | Every user message | Catches secrets pasted into prompts |
| 2 | `file-protection.py` | PreToolUse (Edit\|Write) | File edit/write operations | Blocks writes to sensitive file paths |
| 3 | `secret-file-scanner.py` | PreToolUse (Edit\|Write) | File edit/write operations | Scans content being written for embedded secrets |

### How the layers work together

1. **Layer 1 — Prompt scanning**: Before your message reaches the model, `secret-detection.py` scans the prompt text for known secret patterns (API keys, tokens, passwords, connection strings). If a secret is detected, the message is blocked before it is sent.

2. **Layer 2 — Path protection**: When Claude attempts to edit or write a file, `file-protection.py` checks whether the target file path is sensitive (environment files, credential stores, private keys, lock files). Protected files are blocked regardless of content.

3. **Layer 3 — Content scanning**: For files that pass the path check, `secret-file-scanner.py` examines the actual content being written for secret patterns. This catches cases where a secret is embedded in an otherwise safe file path.

## What Each Hook Detects

### secret-detection.py (Prompt Scanner)

Scans user prompts for:

- **Key-value secrets**: `pwd=`, `api_key=`, `auth_token=`, `api_secret=`
- **Provider-specific tokens**: OpenAI (`sk-`), Anthropic (`sk-ant-`), GitHub (`ghp_`, `gho_`, `ghs_`), AWS (`AKIA`), Notion (`ntn_`), Atlassian (`ATATT`), Slack (`xox`), Google (`AIza`)
- **Bearer tokens**: `bearer <value>`
- **Connection strings**: `mongodb://`, `postgres://`, `mysql://`, `redis://` with credentials
- **PEM private keys**: `-----BEGIN ... KEY-----` headers
- **High-entropy credentials**: Long base64-like strings assigned to key/secret variables

**Example block:**

```
$ echo '{"userPrompt": "Use this key sk-ant-abc123def456ghi789"}' \
    | python3 arckit-plugin/hooks/secret-detection.py
# Output: {"decision": "block", "reason": "Warning: Potential secrets detected: ..."}
```

### file-protection.py (Path Guard)

Blocks writes to:

- **Environment files**: `.env`, `.env.local`, `.env.production`, `.env.development`
- **Lock files**: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Gemfile.lock`, `poetry.lock`, `Cargo.lock`
- **Version control**: `.git/`
- **Credential directories**: `.aws/`, `.ssh/`, `.gnupg/`
- **Secret files**: `credentials`, `credentials.json`, `secrets.json`, `secrets.yaml`, `secrets.yml`, `.secrets`
- **Private keys**: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa`, `id_ed25519`, `id_ecdsa`
- **Auth config files**: `.npmrc`, `.pypirc`, `.netrc`
- **Files with sensitive keywords**: filenames containing terms like "credential", "api-key", etc.

**Example block:**

```
$ echo '{"tool_name": "Write", "tool_input": {"file_path": ".env", "content": "DB_HOST=localhost"}}' \
    | python3 arckit-plugin/hooks/file-protection.py
# Output: {"decision": "block", "reason": "Protected: Protected file: .env\nFile: .env\n..."}
```

### secret-file-scanner.py (Content Scanner)

Scans the content of files being written or edited using the same pattern library as `secret-detection.py`. This catches secrets that might be embedded in source code, configuration files, or documentation.

**Example block:**

```
$ echo '{"tool_name": "Write", "tool_input": {"file_path": "config.py", "content": "db_host=localhost"}}' \
    | python3 arckit-plugin/hooks/secret-file-scanner.py
# Output: no output (safe content passes through)
```

## Adding Exceptions

### File protection exceptions

To allow edits to files that would normally be blocked by `file-protection.py`, you have three options:

**1. Add to `ALLOWED_EXCEPTIONS`** — for specific filenames that are legitimate security tools:

```python
ALLOWED_EXCEPTIONS = [
    ".secrets.baseline",
    ".pre-commit-config.yaml",
    "secret-detection.py",
    "secret-file-scanner.py",
    "your-new-exception.py",  # Add here
]
```

**2. Add to `ALLOWED_DIRECTORIES`** — for directories containing documentation or tool files that discuss secrets:

```python
ALLOWED_DIRECTORIES = [
    "arckit-plugin/commands/",
    "arckit-plugin/templates/",
    "arckit-plugin/agents/",
    "arckit-plugin/hooks/",
    "docs/",
    ".arckit/templates/",
    "your-project/docs/",  # Add here
]
```

### Content scanner skip patterns

To prevent `secret-file-scanner.py` from scanning certain files (e.g., documentation that legitimately discusses secret formats), add a regex to `SKIP_PATTERNS`:

```python
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
    r"your-custom-pattern\.md$",  # Add here
]
```

## Testing

You can test each hook by piping JSON to stdin. All hooks handle empty input gracefully.

### Test file protection blocks .env writes

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": ".env", "content": "VALUE=abc"}}' \
    | python3 arckit-plugin/hooks/file-protection.py
```

Expected: `{"decision": "block", ...}`

### Test secret detection blocks API keys in prompts

```bash
echo '{"userPrompt": "Use this key sk-ant-abc123def456ghi789"}' \
    | python3 arckit-plugin/hooks/secret-detection.py
```

Expected: `{"decision": "block", ...}`

### Test secret file scanner blocks secrets in content

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "test.md", "content": "pwd=hunter2"}}' \
    | python3 arckit-plugin/hooks/secret-file-scanner.py
```

Expected: `{"decision": "block", ...}`

### Test that allowed files pass through

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "arckit-plugin/commands/research.md", "content": "Use API key format: sk-xxx"}}' \
    | python3 arckit-plugin/hooks/secret-file-scanner.py
```

Expected: no output (exit code 0, file is in a skip pattern)

### Test that empty input does not crash

```bash
echo '' | python3 arckit-plugin/hooks/file-protection.py
echo '' | python3 arckit-plugin/hooks/secret-detection.py
echo '' | python3 arckit-plugin/hooks/secret-file-scanner.py
```

Expected: no output or `{}` (exit code 0 for all)
