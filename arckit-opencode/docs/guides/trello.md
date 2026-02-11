# Trello Export Quick Guide

Export your ArcKit product backlog to a Trello board with `/arckit.trello`. The command reads the JSON output from `/arckit.backlog FORMAT=json` and creates a fully structured board with sprint lists, labelled cards, and acceptance criteria checklists.

---

## Prerequisites

| Requirement | How to get it |
|-------------|---------------|
| Backlog JSON file (`ARC-*-BKLG-*.json`) | Run `/arckit.backlog FORMAT=json` |
| `TRELLO_API_KEY` environment variable | [Trello Power-Ups Admin](https://trello.com/power-ups/admin) — create or select a Power-Up, copy the API key |
| `TRELLO_TOKEN` environment variable | Visit `https://trello.com/1/authorize?expiration=30days&scope=read,write&response_type=token&key=YOUR_API_KEY` and copy the token |

Set credentials in your shell:

```bash
export TRELLO_API_KEY="your-api-key-here"
export TRELLO_TOKEN="your-token-here"
```

---

## Command Patterns

```bash
/arckit.trello                                    # default board name from project
/arckit.trello BOARD_NAME="Q1 Sprint Board"       # custom board name
/arckit.trello WORKSPACE_ID="60f1a2b3c4d5e6f7"    # create in specific workspace
```

---

## Board Structure

```
Board: "{Project Name} - Sprint Backlog"
├── List: "Product Backlog"        ← unscheduled/overflow items
├── List: "Sprint 1: Foundation"   ← stories assigned to sprint 1
├── List: "Sprint 2: Core"        ← stories assigned to sprint 2
├── ...                            ← one list per planned sprint
├── List: "In Progress"
└── List: "Done"
```

---

## Card Format

| Field | Example |
|-------|---------|
| **Name** | `STORY-001: Create user account [8pts]` |
| **Description** | GDS user story format + metadata |
| **Labels** | `Must Have` (red) + `Story` (blue) |
| **Checklist** | Acceptance criteria as check items |

**Card description example**:

```
**As a** new user
**I want** to create an account
**So that** I can access the service

**Story Points**: 8
**Priority**: Must Have
**Component**: User Service
**Requirements**: FR-001, NFR-008, NFR-012
**Epic**: EPIC-001 - User Management
**Dependencies**: None
```

---

## Labels

| Label | Colour | Purpose |
|-------|--------|---------|
| Must Have | Red | MoSCoW priority |
| Should Have | Orange | MoSCoW priority |
| Could Have | Yellow | MoSCoW priority |
| Epic | Purple | Item type |
| Story | Blue | Item type |
| Task | Green | Item type |

---

## Workflow

| Stage | Action |
|-------|--------|
| 1. Generate backlog | `/arckit.backlog FORMAT=json` (or `FORMAT=all` for markdown + CSV + JSON) |
| 2. Set credentials | Export `TRELLO_API_KEY` and `TRELLO_TOKEN` |
| 3. Run export | `/arckit.trello` |
| 4. Review board | Open the returned Trello URL |
| 5. Invite team | Add team members to the board in Trello |
| 6. Start sprints | Drag cards from sprint lists to "In Progress" as work begins |

---

## Rate Limits

Trello allows **100 requests per 10-second window** per API token. The command adds a small delay between API calls to stay within limits. For large backlogs (80+ stories), expect the export to take a couple of minutes.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `unauthorized` error | Token may have expired — generate a new one with the authorize URL |
| `invalid key` error | Check `TRELLO_API_KEY` is set correctly |
| `board not found` after creation | Trello API may be slow — wait a moment and check your boards list |
| Rate limit (429) errors | Re-run the command; it will create a new board for remaining items |
| Wrong workspace | Specify `WORKSPACE_ID` to target the correct organization |

---

## Re-exporting

This command always creates a **new board**. To re-export:
1. Delete or archive the old board in Trello
2. Re-run `/arckit.trello`

Or use a different board name:
```bash
/arckit.trello BOARD_NAME="Sprint Board v2"
```

---

## Useful References

- [Trello REST API documentation](https://developer.atlassian.com/cloud/trello/rest/)
- `/arckit.backlog` to generate the source JSON
- `/arckit.traceability` to verify requirements coverage before export
