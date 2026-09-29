---
description: Export product backlog to Trello - create board, lists, cards with labels and checklists from backlog JSON
doc-type: none
argument-hint: "<project ID, e.g. '001'>"
alwaysShow: true
---

# Export Backlog to Trello

You are exporting an ArcKit product backlog to **Trello** by creating a board with sprint lists, labelled cards, and acceptance criteria checklists through **Atlassian's official Trello MCP server** (`https://mcp.trello.com/v1`), which ArcKit bundles as the `trello` MCP server. It signs in with OAuth: ArcKit never sees or stores a Trello key or token, and you never run a shell command or read an environment variable for Trello.

## User Input

```text
$ARGUMENTS
```

## Arguments

**BOARD_NAME** (optional): Override the board name

- Default: `{Project Name} - Sprint Backlog`

**WORKSPACE** (optional): the Trello workspace to create the board in, by name

- If omitted, use the user's default workspace, or ask if they have several

---

## What This Command Does

Reads the JSON backlog produced by `/arckit:backlog FORMAT=json` and pushes it to Trello:

1. Creates a **board** with sprint-based lists
2. Uses the board's six **colour labels** for priority (MoSCoW) and item type (Epic/Story/Task), with a **Label key** card that names them
3. Creates **lists**: Product Backlog + one per sprint + In Progress + Done
4. Creates **cards** for each story/task with name, description, labels
5. Adds **checklists** with acceptance criteria to each card
6. Returns the board URL and a summary of what was created

**No template needed** - this command exports to an external service, it does not generate a document.

---

## Process

### Step 1: Identify Project and Locate Backlog JSON

Find the project directory:

- Look in `projects/` for subdirectories
- If multiple projects, ask which one
- If single project, use it

Locate the backlog JSON file:

- Look for `ARC-*-BKLG-*.json` in `projects/{project-dir}/`
- This is produced by `/arckit:backlog FORMAT=json`

**If no JSON file found**:

```text
No backlog JSON file found in projects/{project-dir}/

Please generate one first:
  /arckit:backlog FORMAT=json

Then re-run /arckit:trello
```

### Step 2: Connect to Trello

The Trello tools come from the bundled `trello` MCP server: `trelloReadMember`, `trelloReadBoard`, `trelloWriteBoard`, `trelloReadList`, `trelloWriteList`, `trelloReadCard`, `trelloWriteCard`, `trelloReadChecklist` and `trelloWriteChecklist`. If they aren't loaded yet, find them with tool search.

**If the tools are missing, or a call reports that authentication is needed**, stop and tell the user:

```text
Trello isn't connected yet. Sign in to the "trello" MCP server once: run /mcp,
choose "trello", and select Authenticate (other assistants have their own MCP
sign-in command). Sign in to Trello in the browser, then re-run /arckit:trello.
```

Then call `trelloReadMember` with `action: "get_me"`. It confirms the connection and tells you who is signed in.

**How the Trello tools work** (from Atlassian's own usage guide; follow it exactly):

- Every tool takes an `action` that selects the operation, and rejects any field the chosen action doesn't use. Read each tool's schema for the exact action names and fields.
- Every id (`boardId`, `listId`, `cardId`, `checklistId`, `labelId`, `workspaceId`) is an **ARI** such as `ari:cloud:trello::board/workspace/<workspaceId>/<boardId>`. Take every ARI from a tool response. Never build or guess one, and never pass a Trello URL to a write tool.
- To keep an order, give sibling items distinct sequential `pos` values (1, 2, 3, …): lists per board, cards per list, check items per checklist. With distinct values you can create them in parallel.
- List reads are paginated. Keep reading while `hasNextPage` or `hasMore` is true.

### Step 3: Read and Parse Backlog JSON

Read the `ARC-*-BKLG-*.json` file. Extract:

- `project` - project name
- `epics[]` - epic definitions
- `stories[]` - all stories with sprint assignments, priorities, acceptance criteria
- `sprints[]` - sprint definitions with themes

### Step 4: Create the Trello Board

Create the board with `trelloWriteBoard`, named `{BOARD_NAME or '{Project Name} - Sprint Backlog'}`, in the chosen workspace (take the workspace ARI from `trelloReadBoard` or `trelloReadMember`). Keep the board's ARI and URL from the response.

**If the call fails**, show the error message and stop.

### Step 5: Map the Colour Labels

A new Trello board comes with six unnamed colour labels. The Trello MCP server can attach existing labels to cards but can't yet create or rename them (label management is on Atlassian's published roadmap), so ArcKit uses the colours and explains them on a card.

Call `trelloReadBoard` with `action: "list_labels"` for the new board and record each label's ARI by colour:

| Colour | Meaning |
|--------|---------|
| red | Must Have |
| orange | Should Have |
| yellow | Could Have |
| purple | Epic |
| blue | Story |
| green | Task |

If a colour is missing, carry on without that label; the priority and type are also written into every card.

### Step 6: Create Lists

Create the lists with `trelloWriteList`, giving each a `pos` in this left-to-right order:

1. **Product Backlog** (unscheduled and overflow items), `pos: 1`
2. **Sprint N: {Theme}** for each sprint, in sprint order, `pos: 2, 3, …`
3. **In Progress**
4. **Done**

Keep each list's ARI and map sprint numbers to lists.

### Step 7: Create Cards

First, create a **Label key** card at the top of Product Backlog (`pos: 1`), with the description:

```text
Label colours on this board (Trello's MCP server can't name labels yet):
red = Must Have · orange = Should Have · yellow = Could Have
purple = Epic · blue = Story · green = Task
```

Then, for each story and task in the backlog JSON, create a card with `trelloWriteCard` on its list, in backlog order (`pos` 2, 3, … in Product Backlog, 1, 2, … in each sprint list):

**Target list**: the sprint list for the item's `sprint` number, or Product Backlog if it has none.

**Card name**, with the priority and type in the name because the labels have no names:

```text
{id}: {title} [{story_points}pts] · {priority} · {type}
```

Example: `STORY-001: Create user account [8pts] · Must Have · Story`

**Card description**:

```text
**As a** {as_a}
**I want** {i_want}
**So that** {so_that}

**Story Points**: {story_points}
**Priority**: {priority}
**Type**: {type}
**Component**: {component}
**Requirements**: {requirements joined by ', '}
**Epic**: {epic id} - {epic title}
**Dependencies**: {dependencies joined by ', ' or 'None'}
```

For tasks (items without `as_a`/`i_want`/`so_that`), use the description field directly instead of the user story format.

**Labels**: attach the priority colour and the type colour from Step 5.

Keep each card's ARI for its checklist. A large backlog takes many tool calls: create the cards for one list at a time, in parallel within that list, and report progress after each list.

### Step 8: Add Acceptance Criteria Checklists

For each card with `acceptance_criteria` in the JSON, use `trelloWriteChecklist` to create a checklist named **Acceptance Criteria** on the card, then add each criterion as a check item, in order (`pos` 1, 2, …).

### Step 9: Show Summary

After all calls complete, display:

```text
Backlog exported to Trello successfully!

Board: {board_name}
URL: {board_url}

Lists created:
  - Product Backlog
  - Sprint 1: {theme} ({N} cards)
  - Sprint 2: {theme} ({N} cards)
  - ...
  - In Progress
  - Done

Label colours: red Must Have, orange Should Have, yellow Could Have, purple Epic, blue Story, green Task
(see the Label key card; Trello's MCP server can't name labels yet)

Cards created: {total_cards}
  - Stories: {N}
  - Tasks: {N}
  - With acceptance criteria checklists: {N}

Next steps:
  1. Open the board: {board_url}
  2. Invite team members to the board
  3. Review card assignments and adjust sprint boundaries
  4. Begin sprint planning with Sprint 1
```

---

## Error Handling

**No backlog JSON**:

```text
No ARC-*-BKLG-*.json file found in projects/{project-dir}/

Please generate one first:
  /arckit:backlog FORMAT=json

Then re-run /arckit:trello
```

**Trello not connected**: see Step 2. Don't ask for an API key or token, and don't fall back to the Trello REST API.

**A Trello tool returns an error** (for example, the workspace isn't allowed MCP access by its admin):

```text
Trello returned an error: {error_message}

If your organisation manages Trello through Atlassian Administration, an admin may need
to allow MCP access for this workspace.
```

**Partial failure (some cards failed)**: continue creating the remaining cards. At the end, report:

```text
Warning: {N} cards failed to create. Errors:
  - STORY-005: {error}
  - TASK-012: {error}

Successfully created {M} of {total} cards.
Board URL: {board_url}
```

---

## Integration with Other Commands

### Inputs From

- `/arckit:backlog FORMAT=json` - Backlog JSON file (MANDATORY)

### Outputs To

- Trello board (external) - ready for sprint planning

---

## Important Notes

### Signing in

The first `/arckit:trello` in a session may ask you to approve the Trello tools, and the first ever use needs a one-time sign-in to the `trello` MCP server. Your assistant keeps the sign-in in its own credential store. ArcKit doesn't hold a Trello key or token.

### Board Cleanup

The Trello MCP server can archive but not delete. To re-export, either archive the old board in Trello and re-run, or use a different BOARD_NAME to create a new board.

This command always creates a **new board**; it doesn't update an existing one.
