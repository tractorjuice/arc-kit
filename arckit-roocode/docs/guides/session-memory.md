# Session Memory

ArcKit includes automated session capture that records what happened during each Claude Code session. This complements Claude Code's built-in auto-memory by tracking the *actual work done* (git commits, artifact types) rather than relying on what Claude decides to remember.

## How It Works

```text
Session N ends
  └── session-learner.mjs (Stop hook) analyses recent git commits
       └── appends summary to .arckit/memory/sessions.md

Session N+1 starts
  └── arckit-session.mjs (SessionStart hook) reads sessions.md
       └── surfaces last 3 sessions as context
```

The Stop hook fires automatically when a session ends. No configuration needed beyond installing the ArcKit plugin.

## What Gets Captured

Each session entry includes:

- **Session classification** — compliance, governance, research, procurement, architecture, planning, discovery, operations, or general (auto-detected from artifact types)
- **Commit count and files changed** — quantitative measure of session activity
- **Artifact types** — which ArcKit document types (ADR, HLDR, WARD, etc.) were created or modified
- **Commit summaries** — up to 8 commit messages for context

## Session Classification

Sessions are classified by the highest-priority category of artifacts touched:

| Priority | Classification | Triggered by category |
|---|---|---|
| 1 | `compliance` | Compliance artifacts (TCOP, SECD, DPIA, JSP936, SVCASS, etc.) |
| 2 | `governance` | Governance artifacts (RISK, TRAC, PRIN-COMP, CONF, etc.) |
| 3 | `research` | Cloud research artifacts (AWRS, AZRS, GCRS) |
| 4 | `procurement` | Procurement artifacts (SOW, EVAL, DOS, GCLD, VEND, etc.) |
| 5 | `architecture` | Architecture artifacts (ADR, HLDR, DLDR, DIAG, WARD, etc.) |
| 6 | `planning` | Planning artifacts (SOBC, PLAN, ROAD, STRAT, BKLG) |
| 7 | `discovery` | Discovery artifacts (REQ, STKE, RSCH, DSCT) |
| 8 | `operations` | Operations artifacts (SNOW, DEVOPS, MLOPS, FINOPS, OPS) |
| 9 | `general` | No ARC artifacts or Other category only |

## Timestamp Tracking

The session-learner uses timestamp-based tracking to capture exactly the commits from each session:

- Timestamp stored in `.arckit/memory/.last-session`
- Each session captures commits since the previous session ended
- First run uses `--since=4 hours ago` as a bootstrap
- No overlap between sessions, no missed commits

## Storage

Session history is stored in `.arckit/memory/sessions.md` — a rolling log of the last 30 sessions. This file is committed to git by default for team visibility.

### Example Entry

```markdown
### 2026-03-08 14:30 — governance

- **Commits:** 4 | **Files changed:** 7
- **Artifacts:**
  - [001] Governance: Risk Register | Architecture: Architecture Decision Records
  - [002] Compliance: Secure by Design
- **Summary:**
  - feat: add SECD assessment for cloud migration
  - docs: update ADR-003 with security review outcome
  - fix: correct risk rating in RISK register
  - chore: update traceability matrix
```

Artifacts are grouped by project number (e.g., `[001]`) and organized by category, making it easy to see which projects were active and what type of work was done.

## Relationship to Auto-Memory

| Feature | Claude Auto-Memory | Session Learner |
|---|---|---|
| **What it captures** | What Claude decides is important | What actually happened (git commits) |
| **Trigger** | Automatic (Claude's judgement) | Deterministic (Stop hook on every session) |
| **Storage** | `~/.claude/projects/<project>/memory/` (machine-local) | `.arckit/memory/sessions.md` (in-repo) |
| **Team sharing** | Not shareable | Committed to git |
| **Content** | Freeform insights, preferences | Structured session summaries |

The two systems are complementary, not competing. Auto-memory captures *insights*; session-learner captures *activity*.

## Troubleshooting

**No sessions.md created after ending a session:**

- Check that `.arckit/` directory exists in your project root
- Verify there were git commits since the last recorded session (or within 4 hours on first run)
- Check hook registration: `hooks.json` should include a `Stop` event

**Session classification seems wrong:**

- Classification is based on artifact type codes in filenames (e.g., `ARC-001-SECD-v1.md`)
- Non-ARC files don't contribute to classification
- Sessions with no detected ARC artifacts default to `general`
- When multiple categories are present, the highest-priority one wins (compliance > governance > research > ...)
