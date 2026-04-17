# Key Milestones and Architectural Decisions

## The Plugin Pivot (v2.0.0, 7 February 2026)

The most significant architectural decision in ArcKit's history. Claude Code support moved from CLI-distributed files to a plugin-only model.

**Before**: `arckit init` copied commands, templates, and scripts into user projects. Every update required re-running init or manual file syncing.

**After**: Plugin auto-updates via the marketplace. All 22 test repos switched to a simple settings.json:

```json
{
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": { "source": "github", "repo": "tractorjuice/arc-kit" }
    }
  },
  "enabledPlugins": { "arckit@arc-kit": true }
}
```

**Impact**: Eliminated file syncing entirely. Plugin updates are picked up automatically. Users never need to run `arckit init` for Claude Code again.

## Gemini CLI Support -- The Multi-Platform Moment (Oct 2025)

@umag (Magistr) was one of ArcKit's earliest contributors. They submitted a fix for package distribution, then built Gemini CLI support from scratch (PR #5). This made ArcKit the multi-platform toolkit it is today and established the pattern that led to the converter.

## The Converter Architecture (v0.3.5 onwards)

Initially, each AI target had hand-maintained command files. The converter automated this:

1. **First version**: Simple path rewriting from Claude to Codex format
2. **Config-driven refactor**: `AGENT_CONFIG` dictionary made adding targets declarative
3. **Agent extraction**: Non-Claude targets get full agent prompts inlined (they can't spawn subagents)
4. **Hook-aware conversion**: Standalone overrides for platforms without hook support
5. **Current state**: One `python scripts/converter.py` call generates all 6 non-Claude formats

## The Agent System -- Context Isolation (v1.0.3 onwards)

The agent pattern emerged from a practical constraint: research commands that make dozens of web searches flood the main conversation's context window with search results.

**Solution**: Thin slash command wrapper -> Task tool launch -> agent runs in isolated context -> writes document via Write tool -> returns summary only.

**Growth**: aws-research (1st) -> azure-research, gcp-research -> datascout -> research -> framework -> gov-reuse, gov-code-search, gov-landscape -> grants (10th)

**Key evolution** (v4.6.0): All agents switched from `model: sonnet` to `model: inherit`, so they use whatever model the user is running. Opus users get Opus agents.

## The Hooks System -- Reactive Automation (v2.7.1 onwards)

Hooks evolved from a single Wardley Map validation experiment to a comprehensive automation layer:

1. **v2.7.1**: First hook -- `validate-wardley-math.mjs` (Stop event, never actually wired)
2. **v2.8.0**: Security hooks (secret detection, file protection) from @DavidROliverBA
3. **v2.8.3**: Guide auto-sync hook, dark mode
4. **v3.0.8**: Shared `hook-utils.mjs` extracted to eliminate duplication
5. **v4.1.1**: Command-specific UserPromptSubmit hooks (search-scan, health-scan, etc.)
6. **v4.2.11**: Version check SessionStart hook
7. **Current**: 17 registered handlers across 7 event types

**Lesson learned** (v2.21.2): Removing the `async` flag from hooks that need context on the current turn. Async hooks run in the background and can't inject context into the response being composed.

## Wardley Mapping Suite (v4.3.0)

Four specialized commands built from three Wardley Mapping books:

- **wardley.value-chain**: Decompose user needs into value chains
- **wardley.doctrine**: 40+ organizational principles across 4 maturity phases
- **wardley.gameplay**: 60+ strategic plays with D&D alignment categorization
- **wardley.climate**: 32 climatic patterns across 6 categories

**Mermaid wardley-beta support** (v4.3.1): Dual output -- both OWM syntax (for create.wardleymaps.ai) and Mermaid diagram blocks.

**Test suite** (v4.6.2): 98% pass rate on 147 real-world maps from swardley/WARDLEY-MAP-REPOSITORY. 18/18 synthetic fixtures pass. The 3 failures are source data errors, not ArcKit issues. ArcKit's Wardley syntax is 100% valid.

**Notable findings from testing**:

- `#` comments not supported in wardley-beta grammar
- Component names with special chars or keyword prefixes require quoting
- OWM pipeline `[min, max]` ranges converted via visibility/evolution matching

## Autoresearch -- Self-Improving Prompts (v4.4.0)

An automated prompt optimization system (`scripts/autoresearch/program.md`):

**How it works**:

1. Uses git worktree isolation to test prompt variations without affecting main
2. Scores on 5 dimensions: Completeness, Specificity, Traceability, Actionability, Clarity (mean 1-10)
3. Keep threshold: >= 0.3 improvement. Plateau: 15 consecutive discards
4. Tuneable parameters: prompt text, `effort:` frontmatter, `model:` frontmatter

**Key findings**:

- Verifying commands against actual UK Gov framework content (WebFetch gov.uk) yields ~20% improvement
- `effort: high` can sometimes HURT quality (observed on glossary command -- reduced contextual specificity)
- **risk command**: Orange Book had wrong 4Ts framework -- replaced with 6 treatment options. Added Three Lines Model, cascade analysis
- **sobc command**: Green Book 2026 alignment needed Theory of Change, SMART objectives, correct options terminology
- **secure command**: Added Security Remediation Roadmap (25-33 items), CAF Maturity Summary
- **Gov agents**: gov-reuse 8.4->9.4, gov-code-search 7.4->8.8, gov-landscape 7.6->8.6

All 48 command optimizations consolidated into PR #265.

## Citation Traceability (v4.6.3)

Driven by client need: verify ArcKit reviewed all input documents and trace findings back to source material.

- 59 templates updated with 3-table External References structure
- 43 commands and 7 agents have citation instruction line
- Shared citation logic in `arckit-claude/references/citation-instructions.md`
- All 4 extension formats regenerated with correct path rewriting

## Government Code Discovery (v4.5.0)

govreposcrape MCP integration -- semantic search over 24,500+ UK government repositories:

- `/arckit.gov-reuse`: Discover reusable code before building from scratch
- `/arckit.gov-code-search`: Natural language search across gov repos
- `/arckit.gov-landscape`: Map the code landscape for a domain

Also wired into existing agents: research (5th build-vs-buy option), datascout (API client libraries), cloud research agents (government precedent check).

## The Token Limit Crisis (v0.3.3)

Early on, commands that generated large documents (requirements, SOBC, research reports) would hit Claude's 32K output token limit and truncate. The fix: all commands MUST use the Write tool to save output to a file, then show only a summary to the user. This was learned the hard way with the ServiceNow template, which had to be condensed.

## Managed Agent Deployment (v4.6.6)

The latest milestone: deploying ArcKit agents as Claude Managed Agents via the Anthropic API. `scripts/managed-agents/arckit-agent.py` can deploy any of the 10 agents with 3 MCP servers and 4 custom skills.
