# File Locations Reference

Exact grep patterns, file paths, and insertion points for each file that needs updating when a new ArcKit command is added.

## 1. README.md (root)

**File**: `README.md`

### Count Locations (4 places)

| Location | Grep Pattern | Context |
|----------|-------------|---------|
| ~Line 35 | `all {N} commands, autonomous agents` | Claude Code plugin install section |
| ~Line 41 | `all {N} commands, templates, scripts` | Gemini CLI extension install section |
| ~Line 742 | `All {N} ArcKit commands with maturity status` | Command Reference intro paragraph |
| ~Line 995 | `the {N}x{N} command matrix` | Reference packs section |

**Search**: `grep -n "[0-9]* commands\|[0-9]* ArcKit\|[0-9]*x[0-9]* command" README.md`

### Command Table

The README has a "Complete Command Reference" section with commands grouped by category. Each category has its own markdown table with this header:

```markdown
| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
```

**Categories and their approximate locations** (search for the `###` heading):
- `### Foundation` - init, plan, principles
- `### Strategic Context` - stakeholders, risk, sobc
- `### Requirements & Data` - requirements, data-model, data-mesh-contract, dpia
- `### Research & Strategy` - research, wardley, roadmap, strategy, adr
- `### Cloud Research (MCP)` - azure-research, aws-research, gcp-research
- `### Data Source Discovery` - datascout
- `### Procurement` - sow, dos, gcloud-search, gcloud-clarify, evaluate
- `### Design & Architecture` - diagram, hld-review, dld-review, platform-design
- `### Implementation` - backlog, trello, servicenow, devops, mlops, finops, operationalize
- `### Quality & Governance` - traceability, analyze, principles-compliance, service-assessment
- `### UK Government` - tcop, ai-playbook, atrs, secure
- `### UK MOD` - mod-secure, jsp-936
- `### Documentation & Publishing` - story, pages, customize

**Row format**:
```markdown
| `/arckit.{name}` | {Description} | [{label}]({url}) | {Status} |
```

Where Status is one of: `Live`, `Beta`, `Experimental` (with corresponding emoji if used).

**Search for category**: `grep -n "^### " README.md | grep -i "{category}"`

## 2. docs/index.html

**File**: `docs/index.html`

### Count Locations (8 places)

| Location | Grep Pattern | What to Change |
|----------|-------------|----------------|
| ~Line 6 | `content="ArcKit.*{N} AI-assisted commands` | `<meta name="description">` |
| ~Line 10 | `content="{N} AI-assisted commands` | `<meta property="og:description">` |
| ~Line 459 | `{N} AI-assisted commands that generate` | Intro paragraph text |
| ~Line 670 | `{N} ArcKit Commands` | `<h2>` section heading |
| ~Line 729 | `<span id="visible-count">{N}</span> of {N} commands` | Filter counter (TWO numbers on this line) |
| ~Line 1423 | `all {N} commands, templates` | Gemini CLI section |
| ~Line 1558 | `All {N} commands documented` | Footer links |

**Search**: `grep -n "[0-9]* commands\|[0-9]* AI-assisted\|visible-count\|[0-9]* ArcKit Commands" docs/index.html`

### Command Card HTML

Insert a new `<tr>` element in the appropriate category section. Cards are grouped by HTML comments like `<!-- Requirements & Data -->`, `<!-- Research & Strategy -->`, etc.

See [html-patterns.md](html-patterns.md) for the full HTML template.

**Search for category comment**: `grep -n "<!-- " docs/index.html | grep -i "{category}"`

## 3. arckit-plugin/.claude-plugin/plugin.json

**File**: `arckit-plugin/.claude-plugin/plugin.json`

### Count Location (1 place)

| Location | Grep Pattern |
|----------|-------------|
| Line 4 | `"description": "Enterprise Architecture.*{N} slash commands` |

**Search**: `grep -n "slash commands" arckit-plugin/.claude-plugin/plugin.json`

**Replace pattern**:
```
OLD: "{N} slash commands for generating architecture artifacts"
NEW: "{N+1} slash commands for generating architecture artifacts"
```

## 4. .claude-plugin/marketplace.json (root)

**File**: `.claude-plugin/marketplace.json`

### Count Location (1 place)

| Location | Grep Pattern |
|----------|-------------|
| ~Line 15 | `"description": "{N} slash commands for enterprise` |

**Search**: `grep -n "slash commands" .claude-plugin/marketplace.json`

**Replace pattern**:
```
OLD: "{N} slash commands for enterprise architecture artifacts"
NEW: "{N+1} slash commands for enterprise architecture artifacts"
```

## 5. arckit-plugin/README.md

**File**: `arckit-plugin/README.md`

**Search**: `grep -n "[0-9]* commands\|[0-9]* slash" arckit-plugin/README.md`

Check for count references. This file may or may not have explicit counts. Update any that appear.

## 6. DEPENDENCY-MATRIX.md

**File**: `DEPENDENCY-MATRIX.md`

### Header Row (Line 20)

The header row lists all commands as columns. Insert the new command name alphabetically.

**Current header format**:
```
| PRODUCES -> | plan | principles | stakeholders | risk | sobc | requirements | ... | pages |
```

**Search**: `grep -n "PRODUCES" DEPENDENCY-MATRIX.md`

### Existing Rows (Lines 21-69)

Every existing row needs a new empty cell `|  |` added at the column position matching where the new command was inserted in the header.

### New Command Row

Add a new row at the alphabetically correct position among existing command rows (lines 22-67).

**Row format**: The first cell is `| **{name}** |` followed by dependency markers for each column command.

### Tier Groupings (Lines 71-184)

Find the appropriate tier and add a bullet point:
```markdown
- **{name}** -> Depends on: {dep1} (M), {dep2} (R)
```

**Search for tier**: `grep -n "### Tier" DEPENDENCY-MATRIX.md`

### Version Section (~Line 286)

Update `Commands Documented: {N}` and `Matrix Rows: {N}`.

**Search**: `grep -n "Commands Documented" DEPENDENCY-MATRIX.md`

### Changelog Section (~Line 294)

Add new entry at the TOP of the Changelog (before existing entries). See [dependency-matrix-format.md](dependency-matrix-format.md) for format.

**Search**: `grep -n "^## Changelog\|^### 20" DEPENDENCY-MATRIX.md`

## 7. WORKFLOW-DIAGRAMS.md

**File**: `WORKFLOW-DIAGRAMS.md`

Only update if the command fits into the sequential workflow. Utility commands (customize, pages, trello) typically don't need workflow entries.

**Search for Mermaid blocks**: `grep -n "graph TD\|style " WORKFLOW-DIAGRAMS.md`

See [dependency-matrix-format.md](dependency-matrix-format.md) for Mermaid node format and style colors.

## 8. docs/README.md

**File**: `docs/README.md`

### Coverage Table (~Lines 113-163)

Add a row for the new command:
```markdown
| `/arckit.{name}` | [{name}.md](guides/{name}.md) | Complete |
```

If the guide is in a subdirectory (e.g., `uk-government/`, `uk-mod/`), adjust the path accordingly.

**Search**: `grep -n "arckit\." docs/README.md | tail -5` (find the end of the table)

### Coverage Count (~Line 164)

```markdown
**Coverage**: {N}/{N} commands documented (100%)
```

**Search**: `grep -n "Coverage" docs/README.md`

## 9. CLAUDE.md

**File**: `CLAUDE.md`

### Command Count

**Search**: `grep -n "[0-9]* commands\|[0-9]* slash" CLAUDE.md`

Update any count references found. Common locations:
- Overview section ("48 slash commands")
- Agent System table (if adding an agent)
- Multi-instance types in `generate-document-id.sh` section

### Agent Table

If the command delegates to an agent, add a row to the Agent System table:

```markdown
| `arckit-{name}` | `/arckit.{name}` | Purpose description |
```

**Search**: `grep -n "arckit-research\|arckit-datascout" CLAUDE.md` (find the agent table)

## 10. CHANGELOG.md (root)

**File**: `CHANGELOG.md`

Add entry under the current or next version. If no unreleased section exists, create one.

**Search**: `grep -n "^## \|^### " CHANGELOG.md | head -10` (find the latest version section)

## 11. arckit-plugin/CHANGELOG.md

**File**: `arckit-plugin/CHANGELOG.md`

Same format as root CHANGELOG.md but for the plugin.

**Search**: `grep -n "^## \|^### " arckit-plugin/CHANGELOG.md | head -10`

---

## Quick Verification Commands

```bash
# Find ALL remaining old count references (replace 48 with old count)
grep -rn "\b48 commands\b\|48 slash commands\|48 AI-assisted\|48/48\|of 48 " \
  README.md docs/index.html docs/README.md CLAUDE.md \
  arckit-plugin/.claude-plugin/plugin.json \
  arckit-plugin/README.md \
  .claude-plugin/marketplace.json \
  DEPENDENCY-MATRIX.md

# Verify new command appears in key files
grep -l "arckit\.{name}" \
  README.md docs/index.html docs/README.md DEPENDENCY-MATRIX.md

# Check DEPENDENCY-MATRIX header has the new column
head -21 DEPENDENCY-MATRIX.md | grep "{name}"
```
