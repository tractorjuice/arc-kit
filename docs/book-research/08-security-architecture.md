# Security Architecture

## Threat Model

A comprehensive security analysis was performed on 2 April 2026 for ArcKit's 5 MCP servers. All are read-only HTTP APIs with no write capabilities.

### Threat Vectors (Ranked)

| Priority | Threat | Risk Level | Details |
|----------|--------|------------|---------|
| 1 | Indirect prompt injection via govreposcrape | HIGH | Indexes 24,500+ UK gov repos with user-generated README content. Attacker could embed adversarial instructions in a README that enters agent context |
| 2 | Data integrity / stale information | MEDIUM | Outdated pricing, deprecated services, wrong regional availability in procurement-grade documents |
| 3 | MCP server compromise / rug pull | LOW-MEDIUM | govreposcrape is single Cloud Run instance; AWS/MS/Google are hardened |
| 4 | Tool description manipulation | LOW | All servers are known publishers, no dynamic discovery |
| 5 | API key leakage | LOW | GOOGLE_API_KEY and DATA_COMMONS_API_KEY via env vars in headers |

### Current Defenses

**Layer 1: Agent Isolation**

- Research agents run as subprocesses via Task tool
- Each agent has its own context window
- Agent output is summarized before returning to main conversation

**Layer 2: Hook-Based Validation**

- `allow-mcp-tools.mjs`: Prefix allowlist for MCP tool invocations
- `file-protection.mjs`: Prevents writes to protected paths
- `secret-file-scanner.mjs`: Scans for secrets in file operations
- `validate-arc-filename.mjs`: Ensures document IDs follow conventions
- `secret-detection.mjs`: UserPromptSubmit hook for detecting secrets in user input

**Layer 3: Agent Constraints**

- `disallowedTools` in agent frontmatter (available since Claude Code v2.1.78)
- STANDALONE fallback for platforms without hook support

### Identified Gaps

- No validation of MCP response content before it enters agent context
- No injection detection in MCP responses
- No URL domain validation
- No output structure verification

### Recommended Protections (Prioritized)

| Priority | Protection | Effort | Status |
|----------|-----------|--------|--------|
| Do first | Agent prompt hardening (untrusted-data instructions) | 1-2 hrs | Not implemented |
| Do first | `disallowedTools` in agent frontmatter | 30 min | Not implemented |
| Do first | URL domain allowlists per agent | 1 hr | Not implemented |
| Next sprint | PostToolUse MCP response scanner hook | 4-6 hrs | Not implemented |
| Next sprint | Output document validator (PreToolUse Write) | 4-6 hrs | Not implemented |
| Next sprint | govreposcrape content quarantine pattern | 2-3 hrs | Not implemented |
| Nice to have | Data freshness stamps in documents | 2 hrs | Not implemented |
| Quarterly | MCP tool definition integrity monitor | 4-6 hrs | Not implemented |

### Why This Matters

ArcKit documents inform procurement decisions. Corrupted governance artifacts could mislead spending. The govreposcrape server serving user-generated content is the weakest link in the chain.
