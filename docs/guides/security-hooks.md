# Security Hooks Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit includes three security hooks that provide layered protection against accidental secret exposure during Claude Code sessions. These hooks run automatically and require no manual configuration. They are Node.js scripts (`.mjs`) that Claude Code runs with `node`, so Node.js must be on your `PATH`.

## Three-Layer Protection Model

The security hooks implement defence in depth with three complementary layers:

| Layer | Hook | Hook Type | Trigger | Purpose |
|-------|------|-----------|---------|---------|
| 1 | `secret-detection.mjs` | UserPromptSubmit | Every user message | Catches secrets pasted into prompts |
| 2 | `file-protection.mjs` | PreToolUse (Edit\|Write\|NotebookEdit) | File edit/write operations | Blocks writes to sensitive file paths |
| 3 | `secret-file-scanner.mjs` | PreToolUse (Edit\|Write) | File edit/write operations | Scans content being written for embedded secrets |

### How the layers work together

1. **Layer 1 — Prompt scanning**: Before your message reaches the model, `secret-detection.mjs` scans the prompt text for known secret patterns (API keys, tokens, passwords, connection strings). If a secret is detected, the message is blocked before it is sent.

2. **Layer 2 — Path protection**: When Claude attempts to edit or write a file, `file-protection.mjs` checks whether the target file path is sensitive (environment files, credential stores, private keys, lock files). Protected files are blocked regardless of content.

3. **Layer 3 — Content scanning**: For files that pass the path check, `secret-file-scanner.mjs` examines the actual content being written for secret patterns. This catches cases where a secret is embedded in an otherwise safe file path.

## What Each Hook Detects

### secret-detection.mjs (Prompt Scanner)

Scans user prompts for:

- **Key-value secrets**: `pwd=`, `api_key=`, `auth_token=`, `api_secret=`
- **Provider-specific tokens**: OpenAI (`sk-`), Anthropic (`sk-ant-`), GitHub (`ghp_`, `gho_`, `ghs_`), AWS (`AKIA`), Notion (`ntn_`), Atlassian (`ATATT`), Slack (`xox`), Google (`AIza`)
- **Bearer tokens**: `bearer <value>`
- **Connection strings**: `mongodb://`, `postgres://`, `mysql://`, `redis://` with credentials
- **PEM private keys**: `-----BEGIN ... KEY-----` headers
- **High-entropy credentials**: Long base64-like strings assigned to key/secret variables

**Example block:**

```text
$ fake="sk-ant-$(printf 'x%.0s' {1..24})"   # a made-up key, built at run time
$ echo "{\"prompt\": \"Use this key $fake\"}" \
    | node plugins/arckit-claude/hooks/secret-detection.mjs
# Output: {"decision": "block", "reason": "Warning: Potential secrets detected: ..."}
```

### file-protection.mjs (Path Guard)

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

```text
$ echo '{"tool_name": "Write", "tool_input": {"file_path": ".env", "content": "DB_HOST=localhost"}}' \
    | node plugins/arckit-claude/hooks/file-protection.mjs
# Output: {"decision":"block","reason":"Protected: Protected file: .env*\nFile: .env\n..."}
```

### secret-file-scanner.mjs (Content Scanner)

Scans the content of files being written or edited using the same pattern library as `secret-detection.mjs`. This catches secrets that might be embedded in source code, configuration files, or documentation.

**Example block:**

```text
$ echo '{"tool_name": "Write", "tool_input": {"file_path": "config.py", "content": "db_host=localhost"}}' \
    | node plugins/arckit-claude/hooks/secret-file-scanner.mjs
# Output: no output (safe content passes through)
```

## Adding Exceptions

### File protection exceptions

To allow edits to files that would normally be blocked by `file-protection.mjs`, you have two options. Both relax only the sensitive-keyword check on filenames; protected paths such as `.env*`, lock files and `*.pem` are always blocked.

**1. Add to `ALLOWED_EXCEPTIONS`** — for specific filenames that are legitimate security tools:

```js
const ALLOWED_EXCEPTIONS = [
  '.secrets.baseline',
  '.pre-commit-config.yaml',
  'secret-detection.mjs',
  'secret-file-scanner.mjs',
  'your-new-exception.mjs', // Add here
];
```

**2. Add to the allowed directories** — for directories containing documentation or tool files that discuss secrets. Plugin directories are matched relative to the plugin root, repository directories relative to the repository root:

```js
// Relative to the plugin root
const ALLOWED_PLUGIN_DIRECTORIES = [
  'commands/',
  'templates/',
  'agents/',
  'hooks/',
];

// Relative to the repository root
const ALLOWED_REPO_DIRECTORIES = [
  'docs/',
  '.arckit/templates/',
  'projects/',
  'your-folder/', // Add here
];
```

### Content scanner skip patterns

`secret-file-scanner.mjs` skips only ArcKit's own security tooling and documentation, which legitimately discuss secret formats. Paths are resolved (so `..` and symlinks cannot escape) and matched relative to the plugin root, and — when the plugin runs from an ArcKit source checkout (`<repo>/plugins/arckit-claude`) — relative to that repo root. Files in your own projects, including `docs/*.md`, `README.md` and `CHANGELOG.md`, are always scanned.

```js
// Relative to the plugin root
const PLUGIN_SKIP_PATTERNS = [
  /^hooks\/(?:secret-detection|secret-file-scanner|file-protection)\.mjs$/,
  /^commands\/[^/]+\.md$/,
  /^templates\/[^/]+\.md$/,
  /^docs\/(?:[^/]+\/)*[^/]+\.md$/,
  /^(?:README|CHANGELOG)\.md$/,
];

// Relative to the ArcKit source repo root
const SOURCE_REPO_SKIP_PATTERNS = [
  /^\.pre-commit-config\.yaml$/,
  /^\.secrets\.baseline$/,
  /^docs\/(?:[^/]+\/)*[^/]+\.md$/,
  /^(?:README|CHANGELOG)\.md$/,
];
```

Keep new patterns anchored (`^...$`) to a path relative to one of these roots; an unanchored pattern such as `docs/.*\.md$` would exempt any path containing that substring.

## Restricting web access for research agents

ArcKit's web-research agents (`research`, `datascout`, `aws-research`, `azure-research`, `gcp-research`, `gov-*`, `grants`) use `WebFetch`. For a regulated or OFFICIAL-SENSITIVE deployment you may want to confine that traffic to an approved set of domains. As of Claude Code v2.1.162, explicit `WebFetch(domain:...)` permission rules **take precedence over the built-in preapproved-host auto-allow** (previously the preapproved hosts leaked through), so a deny/allow policy now actually holds.

Add rules to `.claude/settings.json` (or org managed settings for fleet-wide enforcement — see [Fleet & Version Governance](enterprise-scale.md#fleet--version-governance-managed-settings)):

```json
{
  "permissions": {
    "deny": ["WebFetch"],
    "allow": [
      "WebFetch(domain:*.gov.uk)",
      "WebFetch(domain:*.service.gov.uk)",
      "WebFetch(domain:docs.aws.amazon.com)"
    ]
  }
}
```

This is a Claude Code permission policy, not an ArcKit hook — ArcKit ships no domain restrictions by default, leaving the choice to the deployment.

**Sandboxed commands can be restricted harder (Claude Code v2.1.219+).** `WebFetch` rules govern the model's own fetches. Commands that run inside the sandbox reach the network on their own, and `sandbox.network.strictAllowlist` denies any non-allowlisted host outright rather than prompting for it. Pair it with the MCP endpoint allowlist — see [the enterprise security baseline](enterprise-scale.md#5-set-the-security-and-network-baseline).

## Testing

You can test each hook by piping JSON to stdin, from the root of an ArcKit source checkout. All hooks handle empty input gracefully.

### Test file protection blocks .env writes

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": ".env", "content": "VALUE=abc"}}' \
    | node plugins/arckit-claude/hooks/file-protection.mjs
```

Expected: `{"decision":"block", ...}`

### Test secret detection blocks API keys in prompts

```bash
fake="sk-ant-$(printf 'x%.0s' {1..24})"   # a made-up key, built at run time
echo "{\"prompt\": \"Use this key $fake\"}" \
    | node plugins/arckit-claude/hooks/secret-detection.mjs
```

Expected: `{"decision":"block", ...}`

### Test secret file scanner blocks secrets in content

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "test.md", "content": "pwd=hunter2"}}' \
    | node plugins/arckit-claude/hooks/secret-file-scanner.mjs
```

Expected: `{"decision":"block", ...}`

### Test that allowed files pass through

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "plugins/arckit-claude/commands/research.md", "content": "Use API key format: sk-xxx"}}' \
    | node plugins/arckit-claude/hooks/secret-file-scanner.mjs
```

Expected: no output (exit code 0, file is in a skip pattern)

### Test that empty input does not crash

```bash
echo '' | node plugins/arckit-claude/hooks/file-protection.mjs
echo '' | node plugins/arckit-claude/hooks/secret-detection.mjs
echo '' | node plugins/arckit-claude/hooks/secret-file-scanner.mjs
```

Expected: no output or `{}` (exit code 0 for all)
