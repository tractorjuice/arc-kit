# Dependency Matrix & Workflow Diagram Format

## DSM Header Row Format

The header row is a pipe-delimited markdown table. Commands are listed as column headers:

```markdown
| PRODUCES -> | plan | principles | stakeholders | risk | sobc | requirements | ... | pages |
|------------|------|------|------|------|------|------|------|------|
```

### Adding a New Column

1. Find the alphabetical position for the new command name in the header row
2. Insert `| {name} ` at that position in the header row
3. Insert `|------` at the same position in the separator row (line 21)
4. Insert `|  ` (empty cell) at the same column position in **every** existing data row (lines 22-69)

**Important**: The column position must be consistent across all rows. Count pipes from the left to ensure alignment.

## Command Row Format

Each command has a row showing what it produces and which other commands depend on it:

```markdown
| **{name}** |  |  | R |  | M |  |  |  | O |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
```

### Dependency Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `M` | Mandatory | Command will fail or produce poor results without this input |
| `R` | Recommended | Command works better with this input but can function without |
| `O` | Optional | Command can use this input if available |
| `-` | Self | Diagonal (command references itself) |
| ` ` | None | No dependency relationship |

### Reading the Matrix

- **Rows** = Commands that PRODUCE outputs
- **Columns** = Commands that CONSUME those outputs
- Example: Row "principles" with "M" in column "stakeholders" means stakeholders MANDATORILY depends on principles

### Row Insertion Position

Insert the new row alphabetically among existing command rows (lines 22-67). The row for `**HLD (external)**` and `**DLD (external)**` always go at the end (lines 68-69).

## Tier Groupings Format

Commands are organized into tiers based on dependency depth. Each tier has a heading and bullet list:

```markdown
### Tier {N}: {Tier Name} ({Dependency Description})
{Optional description}
- **{command}** -> Depends on: {dep1} (M), {dep2} (R), {dep3} (O)
  - Note: {Additional context about when/why to use this command}
```

### Current Tiers

| Tier | Name | Description |
|------|------|-------------|
| 0 | Foundation | No mandatory dependencies |
| 1 | Strategic Context | Depends on Foundation |
| 1.5 | Risk Assessment | Depends on Stakeholders |
| 2 | Business Justification | Depends on Stakeholders + Risk |
| 3 | Requirements Definition | Depends on Business Case |
| 3.5 | Strategic Planning | Platform Strategy, Roadmaps, Strategy |
| 4 | Detailed Design | Depends on Requirements |
| 5 | Procurement | Depends on Requirements |
| 6 | Design Reviews | Depends on Design Documents |
| 7 | Implementation Planning | Depends on Design Reviews |
| 7.5 | Backlog Export | Depends on Backlog |
| 8 | Operations | Depends on Architecture |
| 9 | Quality Assurance | Can run iteratively |
| 10 | Compliance Assessment | Depends on Multiple Artifacts |
| 11 | Project Story & Reporting | Depends on All Artifacts |
| 12 | Documentation Publishing | Utility |

### Choosing the Right Tier

Place the new command in the tier that matches its highest mandatory dependency:
- If it depends on nothing mandatory: Tier 0
- If it depends on principles/plan: Tier 1
- If it depends on requirements: Tier 3-5 (depending on other dependencies)
- If it depends on design outputs: Tier 6-8
- If it assesses compliance: Tier 10
- If it's a utility or publishing tool: Tier 12

## Changelog Entry Format

Add new entries at the **top** of the Changelog section (below the `## Changelog` heading, before existing entries).

### Standard Entry

```markdown
### YYYY-MM-DD - Added {Command Display Name} Command
- **Added**: `/arckit.{name}` command ({N}th ArcKit command) for {brief description}
- **Added**: {name} row and column to dependency matrix
- **Updated**: Tier {X} {Tier Name} to include {name} command
- **Dependencies**: {dep1} (M), {dep2} (R), {dep3} (O)
- **Consumed by**: {consumer1} (M/R/O), {consumer2} (M/R/O)
- **Note**: {Any special requirements like MCP servers, API keys, or unusual behavior}
```

### Utility Command Entry (no matrix row)

```markdown
### YYYY-MM-DD - Added {Command Display Name} Command
- **Added**: `/arckit.{name}` command ({N}th ArcKit command) for {brief description}
- **Not in matrix**: Utility command with no dependencies and no outputs consumed by other commands
- **Purpose**: {What the command does}
```

### Ordinal Suffixes

Use correct English ordinals: 1st, 2nd, 3rd, 4th, 5th, ..., 21st, 22nd, 23rd, 24th, ..., 41st, 42nd, 43rd, 44th, ..., 49th, 50th, 51st, etc.

## Version Section Format

```markdown
## Version

- **ArcKit Version**: {version}
- **Matrix Date**: YYYY-MM-DD
- **Commands Documented**: {N}
- **Matrix Rows**: {N} ({N-2} document-generating commands + 2 external documents)
- **Note**: `/arckit.customize` is a utility command not in the matrix -- it has no dependencies and produces no outputs consumed by other commands
```

Update:
- `Commands Documented` to new count
- `Matrix Rows` to new count (if command is in the matrix; utility commands don't add rows)
- `Matrix Date` to today's date

## WORKFLOW-DIAGRAMS.md Mermaid Format

### Node Definition

```mermaid
{ID}[{command-name}]
```

Where `{ID}` is a short unique identifier (e.g., A, B, C, or descriptive like `WD` for wardley).

### Arrow Types

```mermaid
A --> B       %% Mandatory (solid arrow)
A -.-> B      %% Recommended/Optional (dotted arrow)
```

### Style Colors by Tier

```mermaid
style {ID} fill:#87CEEB    %% Blue - Foundation (Tier 0-1)
style {ID} fill:#90EE90    %% Green - Core workflow (Tier 2-5)
style {ID} fill:#FFA500    %% Orange - Design & Implementation (Tier 6-7)
style {ID} fill:#9370DB    %% Purple - Quality & Operations (Tier 8-9)
style {ID} fill:#FF6B6B    %% Red - Compliance (Tier 10)
style {ID} fill:#FFD700    %% Gold - Project Story & Reporting (Tier 11)
```

### Adding a Node

1. Choose a unique ID (check existing IDs in the diagram)
2. Define the node: `{ID}[{command-name}]`
3. Add arrows from/to dependent commands
4. Add style definition with appropriate tier color
5. Place the node in the correct position in the diagram flow

### Example: Adding a New Tier 4 Command

```mermaid
%% In the Tier 4 section of a diagram:
NEW[new-command]
F --> NEW          %% requirements -> new-command (mandatory)
B -.-> NEW         %% principles -> new-command (recommended)
NEW -.-> Q         %% new-command -> hld-review (recommended)

%% In the style section:
style NEW fill:#90EE90    %% Green - Core workflow
```

### Workflow Paths

There are 5 workflow diagrams in WORKFLOW-DIAGRAMS.md:
1. **Standard Project Path** (Non-AI, Non-Government)
2. **UK Government Project Path**
3. **UK Government Platform Strategy Path**
4. **UK Government AI Project Path**
5. **MOD Defence AI Project Path**

Not every command appears in every path. Choose which paths are relevant based on the command's purpose:
- Government-specific commands only appear in UK Gov paths
- MOD commands only appear in MOD paths
- AI commands only appear in AI paths
- General commands appear in all paths where relevant
