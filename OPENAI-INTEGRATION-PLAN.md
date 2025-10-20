# OpenAI Integration for ArcKit

## ✅ IMPLEMENTED: Codex CLI Support

**Status**: ArcKit now fully supports OpenAI Codex CLI (v0.2.2)

**What is Codex CLI?**
- OpenAI's coding agent (similar to Claude Code)
- Runs locally with file system access
- Supports custom slash commands
- Included with ChatGPT Plus, Pro, Business, Edu, Enterprise ($20/month)
- [Learn more](https://chatgpt.com/features/codex)

**How to Use:**
1. Set `CODEX_HOME="$(pwd)/.codex"` environment variable
2. Start `codex --auto`
3. Use commands with `/prompts:arckit.command-name` format

**Full documentation**: See [.codex/README.md](.codex/README.md)

---

## Alternative Approaches (For Reference)

If Codex CLI doesn't meet your needs, here are three alternative approaches:

### Approach Comparison

| Approach | Effort | Cost | Best For | Status |
|----------|--------|------|----------|--------|
| **Codex CLI** ✅ | 0 (built-in) | $20/month ChatGPT Plus | Everyone | **IMPLEMENTED** |
| Custom GPT + Actions | 2-3 weeks | $20/month + hosting | Non-technical users | Not implemented |
| Copy-Paste Workflow | 2-3 days | $0-20/month | Quick validation | Not needed (use Codex) |
| OpenAI API CLI | 1-2 weeks | $3-5 per project | CI/CD automation | Future consideration |

**Recommendation**: Use Codex CLI (already implemented). Only consider alternatives for specialized use cases.

---

### Option 1: Custom GPT + Actions (Best UX, Most Complex)

**Architecture:**
```
User → Custom GPT → GPT Actions (API calls) → Backend API → File System
                                                    ↓
                                              GitHub Repo
```

**Implementation:**

1. **Create Custom GPT**:
   - Name: "ArcKit Enterprise Architect"
   - Upload all templates as knowledge files
   - Upload constitution, stakeholder template, requirements template
   - Add instructions that mirror the slash command logic

2. **Build Backend API** (Python FastAPI or Node.js Express):
   ```
   POST /api/create-project
   POST /api/create-stakeholder-analysis
   POST /api/create-requirements
   POST /api/create-sow
   POST /api/create-hld
   POST /api/create-dld
   POST /api/evaluate-vendor
   etc.
   ```

3. **Configure GPT Actions**:
   - Each action corresponds to an ArcKit command
   - Actions call the backend API
   - Backend handles file creation, git operations, template processing

4. **Backend Implementation**:
   ```python
   from fastapi import FastAPI
   from pydantic import BaseModel

   app = FastAPI()

   class StakeholderRequest(BaseModel):
       project_name: str
       description: str
       github_token: str  # for git operations

   @app.post("/api/create-stakeholder-analysis")
   async def create_stakeholder_analysis(req: StakeholderRequest):
       # 1. Clone/access the user's repo
       # 2. Run create-project.sh script
       # 3. Generate stakeholder-drivers.md from template
       # 4. Commit and push to GitHub
       # 5. Return the generated content to GPT
       return {"status": "success", "file_path": "...", "content": "..."}
   ```

**Pros:**
- ✅ Best user experience (native ChatGPT interface)
- ✅ Can integrate with GitHub directly
- ✅ Scalable to multiple users
- ✅ Can store user preferences/settings
- ✅ Works on mobile, web, anywhere ChatGPT works

**Cons:**
- ❌ Requires building and hosting a backend API
- ❌ Requires ChatGPT Plus subscription ($20/month)
- ❌ Users must trust your backend with GitHub tokens
- ❌ Higher maintenance burden (API + Custom GPT)
- ❌ Action limits (45 requests per 3 hours)

**Estimated Effort:** 2-3 weeks for MVP

---

### Option 2: Copy-Paste Workflow (Quickest, Manual)

**Architecture:**
```
User → ChatGPT (with pasted instructions) → User copies output → User pastes to files
```

**Implementation:**

1. **Create "OpenAI-Friendly" Command Files**:
   - Strip out bash script calls
   - Include full template inline
   - Make instructions self-contained
   - Example:

   ```markdown
   # /arckit.stakeholders (OpenAI Version)

   You are helping analyze stakeholders for an enterprise architecture project.

   ## User will provide:
   - Project name
   - Brief description

   ## You will generate:
   A complete stakeholder analysis following this template:

   [FULL TEMPLATE PASTED HERE - 400 lines]

   ## Instructions:
   1. Identify all stakeholders...
   2. Document drivers...
   3. Map to goals...
   4. Define outcomes...

   ## Output:
   Provide the complete markdown document that the user can save as:
   `projects/{project-name}/stakeholder-drivers.md`

   At the end, tell them:
   - Where to save the file
   - What to do next (run /arckit.requirements)
   ```

2. **Create OpenAI-Specific Documentation**:
   - `OPENAI-WORKFLOW.md` - Step-by-step guide
   - `openai-commands/` folder with standalone command files
   - Each command is self-contained (no external file dependencies)

3. **Workflow**:
   ```
   User: [Pastes stakeholder command + project description]
   GPT: [Generates full stakeholder-drivers.md content]
   User: [Copies output, saves to projects/001-project-name/stakeholder-drivers.md]
   User: [Pastes requirements command + same description]
   GPT: [Reads the stakeholder analysis from user's pasted context]
   User: [Copies output, saves to requirements.md]
   ```

**Pros:**
- ✅ Quickest to implement (1-2 days)
- ✅ Works with any ChatGPT tier (even free)
- ✅ No backend infrastructure needed
- ✅ User has full control over files
- ✅ No security concerns (no API tokens needed)
- ✅ Can work offline (user manages files locally)

**Cons:**
- ❌ Manual copy-paste workflow (tedious)
- ❌ No automatic git operations
- ❌ User must manage file structure manually
- ❌ Context window issues (must paste previous outputs for traceability)
- ❌ Error-prone (user might save to wrong location)
- ❌ No automated consistency checks

**Estimated Effort:** 2-3 days

---

### Option 3: OpenAI API + CLI Tool (Best Developer Experience)

**Architecture:**
```
User → CLI Tool → OpenAI API (GPT-4) → CLI saves files locally
```

**Implementation:**

1. **Build CLI Tool** (Python with Typer):
   ```bash
   pip install arckit-openai
   arckit-openai init my-project
   arckit-openai stakeholders "Analyze stakeholders for cloud migration"
   arckit-openai requirements "Create requirements based on stakeholder analysis"
   arckit-openai sow "Generate statement of work for RFP"
   ```

2. **CLI Implementation**:
   ```python
   import typer
   from openai import OpenAI

   app = typer.Typer()
   client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

   @app.command()
   def stakeholders(description: str):
       # 1. Run create-project.sh to create structure
       # 2. Read stakeholder-drivers-template.md
       # 3. Read constitution.md and principles.md
       # 4. Send to OpenAI API with system prompt
       system_prompt = """You are an enterprise architect creating stakeholder analysis.
       Use this template: [TEMPLATE]
       Follow these principles: [PRINCIPLES]
       """

       response = client.chat.completions.create(
           model="gpt-4-turbo-preview",
           messages=[
               {"role": "system", "content": system_prompt},
               {"role": "user", "content": description}
           ]
       )

       # 5. Save output to projects/{project}/stakeholder-drivers.md
       # 6. Git commit
       # 7. Show summary
   ```

3. **Features**:
   - Automatic project structure creation
   - Template processing
   - Git integration
   - Context management (reads previous artifacts for traceability)
   - Cost tracking (OpenAI API usage)
   - Streaming output (see generation in real-time)

**Pros:**
- ✅ Excellent developer experience (similar to Claude Code)
- ✅ Automatic file/git operations
- ✅ Can optimize API costs (use GPT-4 Turbo or GPT-3.5)
- ✅ Full context management (CLI reads previous files)
- ✅ Extensible (can add custom commands)
- ✅ Works in CI/CD pipelines
- ✅ Can batch operations

**Cons:**
- ❌ Requires OpenAI API key and credits (~$0.01-$0.10 per command)
- ❌ CLI-only (no web interface)
- ❌ Requires Python installation
- ❌ Context window limitations (128K max)
- ❌ May need chunking for large templates
- ❌ Development effort (1-2 weeks)

**Estimated Effort:** 1-2 weeks for MVP

---

## Recommended Approach

**Start with Option 2 (Copy-Paste), then evolve to Option 3 (CLI)**

### Phase 1: Copy-Paste MVP (Week 1)
1. Create `openai-commands/` folder in arc-kit repo
2. Convert each slash command to standalone markdown files:
   - Include full templates inline
   - Remove bash script dependencies
   - Add "where to save this file" instructions
3. Create `OPENAI-WORKFLOW.md` guide
4. Test with GPT-4 to ensure quality matches Claude Code

### Phase 2: CLI Tool (Weeks 2-3)
1. Create new repo: `arckit-openai-cli`
2. Implement core commands:
   - `init`, `principles`, `stakeholders`, `requirements`, `sow`
3. Add context management (read previous artifacts)
4. Add git integration
5. Publish to PyPI

### Phase 3: Custom GPT (Future)
- If there's demand, build backend API
- Create Custom GPT for non-technical users
- Add team collaboration features

---

## Context Window Optimization

OpenAI models have smaller context windows than Claude. Strategies:

### 1. Template Chunking
Instead of sending full 400-line templates, send sections:
```python
# First, generate stakeholder identification
# Then, generate driver analysis
# Then, generate goal mapping
# Finally, combine all sections
```

### 2. Progressive Disclosure
```
Round 1: "List all stakeholders for this project"
Round 2: "For each stakeholder, identify their drivers"
Round 3: "Map drivers to goals"
Round 4: "Define measurable outcomes"
Round 5: "Create traceability matrix"
```

### 3. Template Summaries
Provide condensed versions for OpenAI:
- Full template for Claude (400 lines)
- Condensed template for OpenAI (150 lines, same structure)

---

## Template Adaptations Needed

### Current (Claude Code):
```markdown
1. **Check for architecture principles**:
   - First, check if `.arckit/memory/architecture-principles.md` exists
   - Read it to understand organizational context
```

### OpenAI Copy-Paste Version:
```markdown
1. **Architecture Principles**:
   If you have already created architecture principles, paste them below.
   Otherwise, this analysis will proceed without principle alignment.

   [User can paste principles here]
```

### OpenAI CLI Version:
```python
# CLI handles this automatically
if os.path.exists(".arckit/memory/architecture-principles.md"):
    principles = read_file(...)
    context += f"\n\nArchitecture Principles:\n{principles}"
```

---

## Testing Strategy

### Test Projects:
1. Create same project with Claude Code and OpenAI
2. Compare output quality
3. Measure:
   - Time to complete workflow
   - Cost (OpenAI API usage)
   - User satisfaction
   - Output consistency

### Quality Metrics:
- Stakeholder coverage (should identify same stakeholders)
- Goal specificity (SMART criteria)
- Traceability completeness (every outcome traces to driver)
- Conflict identification (should catch same conflicts)

---

## Cost Analysis

### OpenAI API Pricing (GPT-4 Turbo):
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

### Estimated Token Usage per Command:

| Command | Input Tokens | Output Tokens | Cost per Run |
|---------|--------------|---------------|--------------|
| `/arckit.principles` | ~5K (template + context) | ~3K (output) | ~$0.14 |
| `/arckit.stakeholders` | ~15K (template + previous) | ~8K (detailed analysis) | ~$0.39 |
| `/arckit.requirements` | ~20K (templates + stakeholders) | ~12K (comprehensive reqs) | ~$0.56 |
| `/arckit.sow` | ~25K (all previous context) | ~10K (RFP document) | ~$0.55 |
| `/arckit.hld` | ~30K (requirements + principles) | ~15K (architecture) | ~$0.75 |

**Total for full workflow**: ~$3-5 per project

### Comparison:
- **Claude Code**: Included in subscription (~$20/month unlimited)
- **ChatGPT Plus + Copy-Paste**: $20/month (manual labor)
- **OpenAI API**: Pay per use (~$3-5 per project, no subscription)
- **Custom GPT**: $20/month ChatGPT Plus + API costs

---

## Migration Path

### For Existing ArcKit Users:
1. Continue using Claude Code (no changes)
2. OpenAI becomes an *alternative* for users who:
   - Prefer GPT-4 output style
   - Already have OpenAI API credits
   - Need to run in environments without Claude access
   - Want programmatic/CI integration

### Compatibility:
- All templates remain the same
- File structure remains the same
- Git workflow remains the same
- Only the *execution engine* changes (Claude Code vs OpenAI)

---

## Next Steps

1. **Decision**: Choose Phase 1, 2, or 3 approach
2. **If Copy-Paste (Phase 1)**:
   - Create `openai-commands/` folder
   - Convert 17 commands to standalone files
   - Write `OPENAI-WORKFLOW.md`
   - Test with GPT-4
3. **If CLI (Phase 2)**:
   - Create `arckit-openai-cli` repo
   - Implement core commands
   - Publish to PyPI
4. **If Custom GPT (Phase 3)**:
   - Design backend API
   - Build Custom GPT
   - Deploy and test

---

## Questions to Answer

1. **Target Audience**: Who needs OpenAI support? (Developers? Non-technical users? Enterprise teams?)
2. **Quality Bar**: Is GPT-4 Turbo output quality acceptable compared to Claude Sonnet?
3. **Context Limits**: Can we fit all necessary context in 128K tokens?
4. **Maintenance**: Who will maintain the OpenAI-specific code?
5. **Pricing**: Should we offer this as a separate paid service?

---

## Appendix: Example OpenAI Command File

**`openai-commands/arckit.stakeholders.md`** (Standalone, no dependencies):

````markdown
# ArcKit Stakeholders Analysis (OpenAI Version)

## What This Does

Analyzes stakeholder drivers, maps them to goals, and defines measurable outcomes for your project.

## How to Use

1. **Copy this entire prompt and paste into ChatGPT**
2. **Provide**: Project name and brief description
3. **ChatGPT will generate**: Complete stakeholder analysis
4. **Save the output** to: `projects/{project-number}-{project-name}/stakeholder-drivers.md`
5. **Next step**: Run `/arckit.requirements` with this analysis

---

## Your Task

I need you to analyze stakeholders for my project:

**Project Name**: [PASTE YOUR PROJECT NAME]

**Description**: [PASTE YOUR PROJECT DESCRIPTION]

**Architecture Principles** (if you have them, paste here):
```
[Optional: paste your architecture principles]
```

---

## Instructions for ChatGPT

Generate a comprehensive stakeholder analysis following this structure:

### 1. Project Context
- What: [1 sentence project summary]
- Why: [Business justification]
- When: [Timeline]
- Budget: [If known]

### 2. Stakeholder Identification

**Power-Interest Grid**:

| High Power, High Interest | High Power, Low Interest |
|---------------------------|--------------------------|
| [Key Players - Manage Closely] | [Keep Satisfied] |

| Low Power, High Interest | Low Power, Low Interest |
|--------------------------|-------------------------|
| [Keep Informed] | [Monitor] |

### 3. Stakeholder Drivers

For each key stakeholder, document:

**[Stakeholder Name]** - [Role/Title]

**STRATEGIC Drivers**:
- Driver: [What motivates them strategically]
- Context: [Why this matters]
- Intensity: [CRITICAL | HIGH | MEDIUM | LOW]

**OPERATIONAL Drivers**:
- [Same format]

**FINANCIAL Drivers**:
- [Same format]

**COMPLIANCE Drivers**:
- [Same format]

**PERSONAL Drivers**:
- [What's in it for them personally - career, reputation, workload]

**RISK Drivers**:
- [What they're afraid of]

### 4. Driver-to-Goal Mapping

| Driver ID | Driver | Goal ID | SMART Goal | Success Metric |
|-----------|--------|---------|------------|----------------|
| D-001 | CFO wants cost reduction | G-001 | Reduce infrastructure costs 40% by Q4 2025 | Monthly cost reports show 40% reduction |

### 5. Goal-to-Outcome Mapping

| Goal ID | Goal | Outcome ID | Measurable Outcome | Baseline | Target | Timeline |
|---------|------|------------|-------------------|----------|--------|----------|
| G-001 | Reduce costs 40% | O-001 | Infrastructure spend | $500K/month | $300K/month | Q4 2025 |

### 6. Conflict Analysis

**Conflict C-1**: [Conflict Name]
- **Competing Drivers**: D-001 (CFO wants speed) vs D-005 (CTO wants quality)
- **Manifestation**: Requirements will conflict on timeline vs testing coverage
- **Resolution Strategy**: PHASE - MVP fast delivery (CFO), comprehensive testing in Phase 2 (CTO)
- **Decision Authority**: CEO (per RACI matrix)

### 7. Complete Traceability Matrix

| Stakeholder | Driver ID | Driver | Goal ID | Goal | Outcome ID | Outcome | KPI |
|-------------|-----------|--------|---------|------|------------|---------|-----|
| CFO | D-001 | Cost reduction | G-001 | 40% cost savings | O-001 | $200K/month savings | Monthly P&L |

### 8. Engagement Plan

| Stakeholder | Engagement Level | Communication Frequency | Channel | Key Message | Change Impact | Resistance Risk |
|-------------|------------------|-------------------------|---------|-------------|---------------|-----------------|
| CFO | MANAGE CLOSELY | Weekly | Email + Monthly review | Cost savings tracking | Medium | Low |

### 9. RACI Matrix

| Decision | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Budget approval | CFO | CEO | CTO, CPO | All |
| Technical approach | CTO | CTO | Engineering leads | CEO, CFO |

### 10. Stakeholder Risks

| Risk ID | Risk | Stakeholder | Likelihood | Impact | Mitigation |
|---------|------|-------------|------------|--------|------------|
| SR-001 | CFO pulls funding mid-project | CFO | MEDIUM | CRITICAL | Monthly value demos |

---

## Output Format

Provide the complete markdown document ready to save as `stakeholder-drivers.md`.

At the end, tell the user:
1. Where to save this file
2. What to do next: "Now run `/arckit.requirements` to create requirements informed by these stakeholder goals"
3. Any [NEEDS CLARIFICATION] items to follow up on
````

This standalone file can be pasted directly into ChatGPT with zero dependencies on file system, bash scripts, or slash command infrastructure.
