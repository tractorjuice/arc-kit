# Trello Export Quick Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Export your ArcKit product backlog to a Trello board with `/arckit:trello`. The command reads the JSON output from `/arckit:backlog FORMAT=json` and creates a fully structured board with sprint lists, labelled cards, and acceptance criteria checklists.

---

## Prerequisites

| Requirement | How to get it |
|-------------|---------------|
| Backlog JSON file (`ARC-*-BKLG-*.json`) | Run `/arckit:backlog FORMAT=json` |
| A Trello account | Any plan works |
| Trello connected to Claude Code | One-time sign-in: run `/mcp`, choose **trello**, select **Authenticate**, and sign in to Trello in the browser |

ArcKit uses [Atlassian's official Trello MCP server](https://github.com/atlassian/trello-mcp-server), which it bundles as the `trello` MCP server. You sign in with your Trello account; Claude Code keeps the sign-in in its own credential store. You don't create an API key or token, and ArcKit never sees one. If your organisation manages Trello through Atlassian Administration, an admin may need to allow MCP access for your workspace.

The first time `/arckit:trello` calls Trello in a session, Claude Code asks you to approve the Trello tools. To stop it asking, add `"mcp__plugin_arckit_trello"` to `permissions.allow` in your settings.

---

## Command Patterns

```bash
/arckit:trello                                    # default board name from project
/arckit:trello BOARD_NAME="Q1 Sprint Board"       # custom board name
/arckit:trello WORKSPACE="Digital Delivery"      # create in a named workspace
```

---

## Board Structure

```text
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
| **Name** | `STORY-001: Create user account [8pts] · Must Have · Story` |
| **Description** | GDS user story format + metadata |
| **Labels** | red (Must Have) + blue (Story) |
| **Checklist** | Acceptance criteria as check items |

**Card description example**:

```text
**As a** new user
**I want** to create an account
**So that** I can access the service

**Story Points**: 8
**Priority**: Must Have
**Type**: Story
**Component**: User Service
**Requirements**: FR-001, NFR-008, NFR-012
**Epic**: EPIC-001 - User Management
**Dependencies**: None
```

---

## Labels

Cards use the six colour labels every new Trello board comes with. Trello's MCP server can attach labels but can't yet create or rename them (it's on Atlassian's roadmap), so the labels have colours but no names. The board's first card, **Label key**, explains them, and each card's name and description also state its priority and type.

| Colour | Meaning |
|--------|---------|
| Red | Must Have |
| Orange | Should Have |
| Yellow | Could Have |
| Purple | Epic |
| Blue | Story |
| Green | Task |

---

## Workflow

| Stage | Action |
|-------|--------|
| 1. Generate backlog | `/arckit:backlog FORMAT=json` (or `FORMAT=all` for markdown + CSV + JSON) |
| 2. Connect Trello (once) | `/mcp` → **trello** → **Authenticate** |
| 3. Run export | `/arckit:trello` |
| 4. Review board | Open the returned Trello URL |
| 5. Invite team | Add team members to the board in Trello |
| 6. Start sprints | Drag cards from sprint lists to "In Progress" as work begins |

---

## Large Backlogs

Each list, card and checklist item is one Trello tool call, so a 100-story backlog takes a few hundred calls. The command creates one list's cards at a time and reports progress as it goes.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Trello isn't connected" | Run `/mcp`, choose **trello**, select **Authenticate**, then re-run |
| Trello tools missing | Check `/mcp` lists **trello**, and that no managed setting blocks it |
| Workspace access error | Your Atlassian admin may need to allow MCP access for the workspace |
| Labels have no names | Expected until Atlassian ships label management; see the **Label key** card |
| Some cards failed | The summary lists them; re-run with a new `BOARD_NAME` if you need a clean board |

---

## Re-exporting

This command always creates a **new board**. To re-export:

1. Archive the old board in Trello
2. Re-run `/arckit:trello`

Or use a different board name:

```bash
/arckit:trello BOARD_NAME="Sprint Board v2"
```

---

## Useful References

- [Atlassian's Trello MCP server](https://github.com/atlassian/trello-mcp-server)
- [Connect Trello to AI assistants](https://support.atlassian.com/trello/docs/connect-trello-to-ai-assistants-with-trello-mcp/)
- `/arckit:backlog` to generate the source JSON
- `/arckit:traceability` to verify requirements coverage before export
