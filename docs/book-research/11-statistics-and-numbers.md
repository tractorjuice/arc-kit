# ArcKit by the Numbers (as of v4.6.6, April 2026)

## Scale

| Metric | Count |
|--------|-------|
| Slash commands | 68 |
| Autonomous agents | 10 |
| Skills | 4 |
| MCP servers | 5 |
| Registered hooks | 17 (18 handler files, 1 unwired) |
| Hook event types | 7 |
| Distribution formats | 7 |
| Document templates | 59 |
| Version files | 15 (managed by bump-version.sh) |
| Test repositories | 22 |
| Tagged releases | 129 |
| Total commits | 971 |
| Contributors | 5 (tractorjuice, David R Oliver, Magistr, Yehuda Korotkin, Claude) |
| Feature commits | 243 |
| Fix commits | 247 |
| Published articles | 11 |
| GitHub issues filed | 280+ |
| Document type codes | 30+ |

## Timeline

| Metric | Value |
|--------|-------|
| First commit | 14 October 2025 |
| Latest version | v4.6.6 (9 April 2026) |
| Project age | ~6 months |
| Average releases per month | ~21.5 |
| Peak month (commits) | February 2026 (306 commits) |
| Quietest month | December 2025 (3 commits) |
| Days between first commit and v1.0 | ~106 days |
| Days between v1.0 and v4.0 | ~37 days |
| v2.x releases | 56 (most of any major version) |

## Growth Trajectory

| Date | Commands | Agents | Formats |
|------|----------|--------|---------|
| Oct 2025 (v0.1) | ~10 | 0 | 1 (CLI) |
| Nov 2025 (v0.9) | ~25 | 0 | 2 (CLI + Codex) |
| Jan 2026 (v1.0) | ~40 | 2 | 3 (+ Gemini) |
| Feb 2026 (v2.0) | ~53 | 5 | 5 (+ plugin, OpenCode) |
| Mar 2026 (v4.0) | ~57 | 6 | 6 (+ Copilot) |
| Mar 2026 (v4.5) | ~67 | 9 | 6 |
| Apr 2026 (v4.6) | 68 | 10 | 7 (+ Paperclip) |

## Autoresearch Results

| Command | Before | After | Improvement |
|---------|--------|-------|-------------|
| gov-reuse (agent) | 8.4 | 9.4 | +1.0 (12%) |
| gov-code-search (agent) | 7.4 | 8.8 | +1.4 (19%) |
| gov-landscape (agent) | 7.6 | 8.6 | +1.0 (13%) |

Typical improvement from autoresearch: ~20% when verified against actual UK Gov framework content.

## Wardley Map Test Suite

| Category | Pass Rate |
|----------|-----------|
| Synthetic fixtures | 18/18 (100%) |
| Real-world maps | 144/147 (98%) |
| ArcKit-generated syntax | 100% valid |
| Maps with pipeline boxes | 124/147 |

## MCP Server Coverage

| Server | Repositories/Documents | API Key |
|--------|----------------------|---------|
| govreposcrape | 24,500+ UK gov repos | No |
| AWS Knowledge | AWS documentation | No |
| Microsoft Learn | Azure/Microsoft docs | No |
| Google Developer Knowledge | GCP documentation | Yes |
| Data Commons | Statistical data | Yes |

## UK Government Coverage

| Area | Commands |
|------|----------|
| GDS/Cabinet Office | service-assessment, tcop, dos |
| HM Treasury | sobc (Green Book), risk (Orange Book) |
| NCSC | secure (CAF) |
| MOD | mod-secure (JSP 453), jsp-936 |
| AI/Data | ai-playbook, atrs, dpia |
| Code reuse | gov-reuse, gov-code-search, gov-landscape |
| Funding | grants |
