# Hints, Tips, and Lessons Learned

## Design Principles That Emerged

### 1. Template-Driven, Never Freeform

Every generated document comes from a template in `.arckit/templates/`. This ensures consistency, proper document control sections, and the ability for users to customize output.

**Why it matters**: Freeform generation produces inconsistent results across sessions. Templates enforce structure while still allowing AI creativity in content.

### 2. Write Tool, Not Inline Output

Commands MUST use the Write tool to save documents to files. This was learned the hard way when the ServiceNow template exceeded Claude's 32K output token limit and truncated.

**Pattern**: Generate document -> Write to file -> Show summary to user.

### 3. Agent Isolation for Heavy Research

If a command makes >10 WebSearch/WebFetch calls, it should delegate to an agent. The agent runs in its own context window, preventing research results from consuming the main conversation's context.

**The thin wrapper pattern**:

```text
Slash command (5-10 lines) -> Task tool -> Agent (full prompt) -> Write document -> Return summary
```

### 4. One Source, Many Targets

Never maintain parallel command files. The plugin (`arckit-claude/commands/`) is the single source of truth. `scripts/converter.py` generates all other formats.

### 5. Handoffs Guide the Workflow

Commands declare `handoffs:` in frontmatter to suggest logical next steps. This creates a guided workflow without being prescriptive.

## Bugs That Taught Us Something

### The Orange Book 4Ts Error

The risk command originally used the "4Ts" risk treatment framework (Tolerate, Treat, Transfer, Terminate). Autoresearch discovered this was wrong when verified against actual UK Government Orange Book content via WebFetch. The Orange Book actually defines 6 treatment options. This led to a complete rewrite of the risk framework.

**Lesson**: Always verify AI-generated governance content against source documents. Framework names that sound authoritative can be subtly wrong.

### The Green Book Terminology

The SOBC command used generic business case terminology. Autoresearch verification against the Green Book 2026 revealed specific required terms: "BAU" (not "status quo"), "Do Minimum" (not "baseline"), "Preferred Way Forward" (not "recommended option"). Also needed Theory of Change and SMART objectives.

**Lesson**: UK Government frameworks have precise terminology. Close enough isn't good enough for governance documents.

### The `effort: high` Trap

During autoresearch optimization, applying `effort: high` to the glossary command actually *reduced* quality. Higher effort made definitions more generic and less contextually specific.

**Lesson**: More reasoning isn't always better. Simple, utility-style commands benefit from lower effort -- they need precision, not depth.

### The `branch` vs `ref` Gotcha

When testing plugin branches via `extraKnownMarketplaces`, using `"branch": "feat/some-branch"` silently fails. Claude Code ignores the `branch` field and loads from the default branch. The correct field is `"ref"`.

**Lesson**: Silent failures are the hardest bugs. If your plugin test seems to load but has stale content, check the field name.

### Hook Async Timing

Early hooks were marked `async: true` for performance. But async hooks run in the background and can't inject context into the current response being composed. Hooks that need to influence the current turn (like context injection) must be synchronous.

**Lesson**: Understand the execution model. Async is not always better.

### The Slugify Encoding Bug

The `slugify()` function in bash scripts used `[a-z0-9]` to filter characters. This stripped accented characters (e, u, etc.) common in non-English project names. Fixed by using locale-aware `[:alnum:]`.

**Lesson**: Internationalization matters even in architecture governance tools. Test with non-ASCII input.

## Tips for Command Authors

### Prerequisites Check

Every command should check prerequisites before generating:

1. Run `check-prerequisites.sh` to validate environment
2. Check for required input documents (e.g., requirements before data model)
3. Read the project structure via `list-projects.sh`

### Template Customization

Users can override any template by placing a modified copy in `.arckit/templates-custom/`. The `/arckit.customize` command makes this easy. Common customizations:

- Remove UK Government sections for non-UK projects
- Add organization-specific Document Control fields
- Change requirement ID prefixes
- Add branding, headers, footers

### Multi-Instance Document Types

Some document types allow multiple instances per project: ADR, DIAG, WARD (Wardley), DMC (Data Mesh Contract). Use `generate-document-id.sh --next-num` to get the next sequential number.

### Citation Traceability

If your command reads external documents, add citation traceability:

1. Reference the shared citation instructions file
2. Add inline markers: `[DOC_ID-CN]`
3. Populate the External References section (Document Register, Citations, Unreferenced Documents)

### Effort Tuning

Set `effort:` in frontmatter based on command complexity:

- **max**: Deep analysis that benefits from extended reasoning (requirements, research, SOBC)
- **high**: Analytical commands (analyze, diagrams, impact)
- **medium**: Standard generation (most commands)
- **low**: Simple utility commands (customize, init)

Don't default to max -- it wastes tokens on simple commands and can sometimes reduce quality.

## Tips for Plugin Users

### Version Checking

ArcKit checks for updates on session start. If you see an update notification, restart Claude Code to pick up the new plugin version.

**Minimum Claude Code version**: v2.1.97 (as of April 2026)

### Project Structure

Always let ArcKit manage project structure:

1. Use `create-project.sh` to create numbered project directories
2. Use `generate-document-id.sh` for document IDs
3. Put cross-project artifacts in `projects/000-global/`

### The Pages Dashboard

`/arckit.pages` generates an interactive HTML dashboard with:

- Document listing with version badges
- Interactive dependency map visualization
- Health indicators for stale artifacts
- Vendor scores section
- Guide library
- Dark mode support

### Search and Impact Analysis

- `/arckit.search`: Find artifacts by keyword, type, or requirement ID
- `/arckit.impact`: Trace reverse dependencies -- "what breaks if I change this?"
- Both use hooks for pre-processing to build search indices

## Security Considerations

### MCP Server Risks

The highest risk is **indirect prompt injection via govreposcrape** -- it indexes 24,500+ UK gov repos with user-generated README content. An attacker could embed adversarial instructions in a README.

**Mitigations**: Agent isolation (subprocesses), tool prefix allowlisting, file protection hooks, secret scanning.

### What's Not Yet Protected

No validation of MCP response content before it enters agent context. No injection detection, no URL domain validation, no output structure verification. These are identified gaps with prioritized remediation plans.

## The Autoresearch Workflow

For command authors who want to optimize their prompts:

1. Follow `scripts/autoresearch/program.md`
2. Use git worktree isolation (automatic)
3. Expect ~20% improvement from framework verification
4. Watch for regression on simple commands with high effort
5. The plateau threshold (15 consecutive discards) prevents infinite optimization loops
