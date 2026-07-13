# DeepBook Guide

> **Guide Origin**: Official | **ArcKit Version**: 4.20.1+ | **Status**: BETA
> **Licence**: PROPRIETARY — not open source, not publicly available

`/arckit:deepbook` generates comprehensive books using DeepBook's large mode workflow with stateful checkpoints and per-topic generation.

---

## Licence and Availability

**DeepBook is proprietary software and is not part of the open-source ArcKit distribution.**

Unlike every other plugin documented here, `arckit-deepbook` is **not** published in the ArcKit marketplace and is **not** covered by the licence that governs the rest of ArcKit. It lives in a separate, private repository.

- **Licence**: Proprietary and confidential. Copyright (c) 2026 Mark Craddock. All rights reserved.
- **Availability**: Private. It cannot be installed from the public ArcKit marketplace.
- **Permission**: No right is granted to use, copy, modify, distribute, or sublicense the plugin without prior written consent of the copyright holder.
- **Generated output**: Books you generate remain your own. The licence governs the software, not its output.

This guide is published for reference and for licensed users. If you want access, contact the copyright holder — installing it is not a self-service step.

---

## Overview

DeepBook is an autonomous book generation agent that executes a 6-stage workflow to create comprehensive non-fiction books. It replicates DeepBook's large mode behavior with faithful prompt replication and ArcKit formatting.

**Source**: DeepBook repository, which is owned by the same copyright holder and covered by the same proprietary terms.

---

## Inputs

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| Book topic | Yes | - | The subject matter for the book |
| `--sector` | No | `government` | Sector context: government, neutral, healthcare, finance, technology |
| `--reference-url` | No | - | URL for grounding knowledge |
| `--reference-file` | No | - | Local file path for grounding knowledge |
| `--use-external` | No | - | Load external knowledge from ArcKit folders |
| `--external-dir` | No | - | Additional custom external directory |
| `--resume` | No | - | Resume from existing checkpoint |
| `--auto-approve` | No | - | Skip structure review, auto-proceed to generation |
| `--output-dir` | No | `./books/` | Custom output directory |
| `--max-topics` | No | - | Maximum number of topics to generate |
| `--model` | No | Current model | LLM model to use |

---

## Command

```bash
# Basic book generation
/arckit:deepbook <book topic>

# With sector and auto-approval
/arckit:deepbook "Network Effects and GenAI" --sector technology --auto-approve

# With grounding from URL
/arckit:deepbook "AI Governance" --reference-url https://example.com/ai-guidelines

# With grounding from file
/arckit:deepbook "Cloud Architecture" --reference-file ./cloud-strategy.md

# Resume from checkpoint
/arckit:deepbook --resume

# Limited test with 2 topics
/arckit:deepbook "Test Book" --auto-approve --max-topics 2

# With custom output directory
/arckit:deepbook "Enterprise AI" --output-dir ./output/my-book/
```

---

## Workflow Stages

### Step 0: Initialize State and Check Resume

- Generate session identity (`deepbook-{YYYYMMDD}-{HHMMSS}-{random-6-chars}`)
- Create safe book title slug
- Check for existing checkpoint in `.arckit/deepbook-checkpoints/`
- Restore state if `--resume` flag is present

**Checkpoint location**: `.arckit/deepbook-checkpoints/{session_id}.json`

### Step 1: Grounding and Topic Refinement

- Assemble external knowledge from URL, file, or external directories
- Execute refinement prompt (`pp-refine-top-78c850`)
- Extract: Refined Topic, Potential Subtitle, Explanation, Key Areas, Differentiation
- Save checkpoint at step 1

**Prompt**: `plugins/arckit-deepbook/prompts/refine-topic-large.md`
**Temperature**: 0.3

### Step 2: Book Structure Generation

- Execute structure prompt (`pp-prepare-bo-87a490`) with refined topic and key areas
- Parse JSON output for chapters, sections, subsections
- Fallback to text parsing if JSON invalid
- Create default structure (4 chapters x 4 sections x 4 subsections) if parsing fails
- Save structure to `original_book_structure.json`
- Save checkpoint at step 2

**Prompt**: `plugins/arckit-deepbook/prompts/prepare-book-structure-large.md`
**Temperature**: 0.3

### Step 3: Structure Review

- Display formatted book structure as markdown
- Use `AskUserQuestion` for user interaction
- Options: Approve, Reject, Refresh
  - **Approve**: Mark structure as approved, proceed to Step 4
  - **Reject**: Clear structure, return to Step 1
  - **Refresh**: Select specific element (chapter/section/subsection) to regenerate

**Refresh prompt**: `plugins/arckit-deepbook/prompts/update-book-structure.md`
**Temperature**: 0.5

### Step 4: Topic List and Placeholders

- Flatten structure into topic list: `(subsection, section_title, chapter_title)` tuples
- Initialize state for tracking:
  - `all_topics`: List of all topic tuples
  - `processed_topics`: Successfully generated topics
  - `failed_topics`: Topics that failed generation
  - `book_content`: Dictionary mapping topics to content
- Save checkpoint

### Step 5: Per-Topic Generation Loop

**Main loop** processing each topic in order:

1. **Skip if already processed** (check `processed_topics`)
2. **Retry if previously failed** (remove from `failed_topics`)
3. **Check max topics limit** (if configured)
4. **Build previous content context**:
   - Sort by: same chapter first, most recent first
   - Chapter limit: 50,000 characters
   - Total limit: 200,000 characters
5. **Execute topic expansion** (`pp-expansion-81fea3`)
6. **Validate response** (3 attempts):
   - Schema: title (optional), content (required array of 1-200 items)
   - Recovery rules if validation fails
7. **Render markdown** from JSON content list
8. **Save topic file**: `{output_dir}/{session_id}/{safe_book_title}/topics/{slugified_topic}.md`
9. **Update state** and save checkpoint

**Prompt**: `plugins/arckit-deepbook/prompts/expansion-prompt-large.md`
**Temperature**: 0.3

**Content types supported**:

- paragraph: Plain text
- heading: Levels 4 or 5
- list: Bullet list with items
- quote: Block quote
- code: Code block
- placeholder: Placeholder text

### Step 6: Final Book Assembly

**Executes when**: `len(processed_topics) + len(failed_topics) >= len(all_topics)`

1. **Combine content**:
   - Add title and metadata
   - Generate table of contents with anchor links
   - Concatenate all chapter/section/subsection content
2. **Write outputs**:
   - Final book: `{output_dir}/{session_id}/{safe_book_title}.md`
   - ZIP archive: `{output_dir}/{session_id}/{safe_book_title}.zip`
   - Topic files: Individual `.md` files in `topics/` directory
   - Structure: `original_book_structure.json`
3. **Delete checkpoint**
4. **Report results**: Status, output files, statistics, failed topics

---

## Outputs

| File | Description | Location |
|------|-------------|----------|
| `{book_title}.md` | Complete assembled book | `{output_dir}/{session_id}/` |
| `{book_title}.zip` | ZIP archive with book + topics + structure | `{output_dir}/{session_id}/` |
| `original_book_structure.json` | Book structure metadata | `{output_dir}/{session_id}/` |
| `topics/*.md` | Individual topic files | `{output_dir}/{session_id}/topics/` |

---

## Sector Contexts

### Government

- **Context**: Public sector and government digital transformation
- **Example Sources**: GOV.UK, Government Digital Service, Cabinet Office, UK Government frameworks
- **Target Audience**: Senior civil servants, digital leaders, policy makers, public sector CIOs
- **Guidance**: Focus on citizen outcomes, service delivery, policy implementation, and public value

### Neutral

- **Context**: General business and enterprise
- **Example Sources**: Harvard Business Review, McKinsey, BCG, Deloitte Insights
- **Target Audience**: Business executives, managers, consultants, entrepreneurs
- **Guidance**: Focus on commercial outcomes, ROI, competitive advantage, and market positioning

### Healthcare

- **Context**: Healthcare and life sciences
- **Example Sources**: NHS, WHO, BMJ, medical journals, healthcare providers
- **Target Audience**: Clinical leaders, healthcare administrators, health tech professionals, CIOs
- **Guidance**: Focus on patient outcomes, clinical effectiveness, regulatory compliance, and care quality

### Finance

- **Context**: Financial services and fintech
- **Example Sources**: Bank of England, FCA, financial institutions, fintech startups
- **Target Audience**: CFOs, risk officers, fintech entrepreneurs, regulators, compliance officers
- **Guidance**: Focus on risk management, compliance, financial innovation, and market stability

### Technology

- **Context**: Technology and digital innovation
- **Example Sources**: TechCrunch, Gartner, IEEE, major tech companies, CTO publications
- **Target Audience**: CTOs, engineers, product managers, innovators, architects
- **Guidance**: Focus on technical depth, innovation, practical implementation, and scalability

---

## Checkpoint Format

```json
{
  "version": "1.0",
  "session_id": "deepbook-20260704-143022-abc123",
  "initial_topic": "User's original topic",
  "refined_topic": "Refined topic from Step 1",
  "key_areas": ["area 1", "area 2", ...],
  "book_topic": "Final topic used for structure",
  "book_structure": { ... },
  "is_structure_created": false,
  "is_structure_approved": false,
  "all_topics": [["subsection", "section", "chapter"], ...],
  "processed_topics": [["subsection", "section", "chapter"], ...],
  "failed_topics": [["subsection", "section", "chapter"], ...],
  "book_content": {},
  "generation_config": {
    "sector": "technology",
    "model": "claude-3-5-sonnet-latest",
    "detail_level": "large",
    "temperature": 0.3
  },
  "checkpoint_step": 0,
  "cost_tracking": {
    "total_prompt_tokens": 0,
    "total_completion_tokens": 0,
    "api_calls": 0,
    "retry_count": 0
  },
  "settings": {
    "output_dir": "./books/",
    "reference_url": null,
    "reference_file": null,
    "auto_approve": false,
    "max_topics": null
  },
  "created_at": "2026-07-04T14:30:22Z",
  "updated_at": "2026-07-04T14:30:22Z"
}
```

---

## File Loading Rules

**Supported extensions**: `.md`, `.txt`, `.json`, `.yaml`, `.yml`

**Constraints**:

- Skip files > 10MB
- Skip binary files
- Truncate individual files to first 50,000 characters
- Max total external knowledge: 200,000 characters
- Deduplication: First occurrence only

---

## Error Handling

| Scenario | Action |
|----------|--------|
| No topic provided, no resume | Stop with error |
| Prompt rendering fails | Retry 3x, then stop |
| Model API fails (limit reached) | Stop with error |
| Refined topic parsing fails | Stop with error |
| Structure JSON invalid | Use text fallback, warn |
| Structure text fallback fails | Create default, warn |
| Topic expansion validation fails 3x | Mark failed, continue |
| Topic save fails | Mark error, continue |
| Checkpoint corrupted | Start fresh, warn |
| Resume no checkpoint | Start fresh, warn |

---

## Prompt Inventory

| Stage | Prompt File | DeepBook ID | Temperature | Output Format |
|-------|-------------|-------------|-------------|----------------|
| Topic Refinement | `refine-topic-large.md` | `pp-refine-top-78c850` | 0.3 | Plain text |
| Book Structure | `prepare-book-structure-large.md` | `pp-prepare-bo-87a490` | 0.3 | JSON |
| Topic Expansion | `expansion-prompt-large.md` | `pp-expansion-81fea3` | 0.3 | JSON |
| Structure Refresh | `update-book-structure.md` | N/A | 0.5 | Plain text |

---

## Best Practices

1. **Start with clear topic**: Be specific about the book subject for best results
2. **Use sector context**: Select appropriate sector for relevant examples and guidance
3. **Ground with references**: Provide URL or file references for factual accuracy
4. **Review structure**: Take time to approve or refine the book structure before generation
5. **Set max-topics for testing**: Use `--max-topics 2` for quick validation
6. **Use auto-approve for automation**: Skip interactive prompts with `--auto-approve`
7. **Monitor checkpoints**: Check `.arckit/deepbook-checkpoints/` for progress

---

## Example Workflow

### 1. Start a new book

```bash
/arckit:deepbook "AI Governance in Enterprise"
```

- DeepBook will refine the topic
- Generate book structure
- Present structure for your approval
- Upon approval, begin per-topic generation

### 2. Resume interrupted session

```bash
/arckit:deepbook --resume
```

- Finds most recent checkpoint
- Restores all state
- Continues from where it left off

### 3. Generate with grounding

```bash
/arckit:deepbook "Cloud Migration Strategy" \
  --reference-url https://aws.amazon.com/cloud-migration \
  --sector technology \
  --auto-approve
```

- Fetches external knowledge from URL
- Uses technology sector context
- Skips structure review
- Auto-generates all topics

---

## Related Files

| Location | Purpose |
|----------|---------|
| `plugins/arckit-deepbook/` | Plugin directory |
| `plugins/arckit-deepbook/commands/deepbook.md` | Main command implementation |
| `plugins/arckit-deepbook/agents/arckit-deepbook.md` | Autonomous agent |
| `plugins/arckit-deepbook/agents/arckit-deepbook-writer.md` | Subagent for topic expansion |
| `plugins/arckit-deepbook/prompts/` | DeepBook prompt files |
| `docs/plans/2026-07-04-deepbook-large-plan-book-flow.md` | Technical specification |

---

## Version History

- **v1.0.0**: Initial release with 3-stage workflow
- **v1.0.1**: Added checkpoint resume capability
- **v1.0.2**: Improved error handling and validation
- **v4.20.1+**: Current production-ready version

---

## Support

For issues or questions:

- Check the checkpoint file for state information
- Review the structure JSON for book organization
- Verify external knowledge sources are accessible
- Ensure sufficient API quota for large book generation

**Status**: Production-ready
**Plugin Type**: Private repository plugin
**Prompt Source**: DeepBook's actual prompts, reworked for ArcKit format
