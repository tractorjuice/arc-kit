# ArcKit Token Limit Solutions

## The Problem

ArcKit commands can hit Claude Code's 32,000 output token limit, causing this error:

```
API Error: Claude's response exceeded the 32000 output token maximum.
To configure this behaviour, set the CLAUDE_CODE_MAX_OUTPUT_TOKENS environment variable
```

## Why This Happens

ArcKit generates **large documents** from **large templates**:

| Command | Template Size | Typical Output | Risk Level |
|---------|---------------|----------------|------------|
| /arckit.sobc | 1012 lines | 1500-2000 lines | 🔴 HIGH |
| /arckit.requirements | 933 lines | 1200-1500 lines | 🔴 HIGH |
| /arckit.data-model | 913 lines | 1000-1200 lines | 🔴 HIGH |
| /arckit.research | 832 lines | 1500-3000 lines | 🔴 VERY HIGH |
| /arckit.risk | 800 lines | 900-1200 lines | 🟡 MEDIUM |
| /arckit.sow | 701 lines | 1000-1500 lines | 🔴 HIGH |
| /arckit.evaluation | 660 lines | 800-1000 lines | 🟡 MEDIUM |
| /arckit.principles | 544 lines | 600-800 lines | 🟡 MEDIUM |

**Token consumption breakdown**:
- Command prompt: 3,000-5,000 tokens
- Template reading: 2,000-4,000 tokens
- Generated content: 10,000-30,000 tokens
- Explanations: 2,000-5,000 tokens
- **TOTAL**: Can exceed 40,000 tokens

## Solutions

### ⚠️ IMPORTANT: Environment Variable Limitation

Setting `CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000` **only works if your Claude subscription plan supports it**.

**Current limits by plan**:
- 🔴 Free/Pro plans: **Maximum 32K tokens** (cannot be increased via environment variable)
- ✅ Team/Enterprise plans: Up to 64K tokens (can be configured)

**If you're on Free/Pro plan**: Skip to Solution 2 (Command Redesign) - that's the only solution that will work.

### Solution 1: Increase Token Limit (Only for Team/Enterprise Plans)

⚠️ **This will NOT work on Free/Pro plans** - the API enforces a 32K limit regardless of environment variable.

If you have Team/Enterprise plan, you can configure a higher limit:

#### Option A: Codespaces

Update `.devcontainer/devcontainer.json`:

```json
{
  "postCreateCommand": "npm install -g @anthropic-ai/claude-code",
  "remoteEnv": {
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "64000"
  }
}
```

#### Option B: Local Environment

```bash
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
```

### Solution 2: Command Redesign (PRIMARY FIX - Works on All Plans)

We need to redesign high-risk commands to be **token-efficient**.

#### Current Pattern (Token-Heavy)

```markdown
1. Read entire template (3K tokens)
2. Analyze requirements (1K tokens)
3. Generate full document (20K tokens)
4. Explain what was generated (5K tokens)
5. Show next steps (1K tokens)
TOTAL: 30K tokens ← Can exceed limit!
```

#### New Pattern (Token-Efficient)

```markdown
1. Analyze requirements (1K tokens)
2. Show outline/plan (1K tokens)
3. **Use Write tool to create file directly** (no output tokens!)
4. Show summary only (1K tokens)
5. Show next steps (1K tokens)
TOTAL: 5K tokens ← Safe!
```

#### Key Principles

**DO**:
- ✅ Use `Write` tool to create files (doesn't count toward output tokens)
- ✅ Show summaries instead of full content
- ✅ Work in phases (outline → write → summarise)
- ✅ Use `Edit` tool for incremental updates
- ✅ Provide statistics ("Created 127 requirements in 8 categories")

**DON'T**:
- ❌ Output full document in response
- ❌ Repeat template content back to user
- ❌ Include verbose explanations of every section
- ❌ Generate everything in one massive response

### Solution 3: Chunking Strategy (For Long Commands)

For commands that MUST show content, break into phases:

```markdown
## Strategy: Phased Execution

### Phase 1: Planning (2K tokens)
- Analyze input
- Create outline
- Show plan to user
- Wait for approval

### Phase 2: Core Content (15K tokens)
- Generate main sections
- Use Write tool where possible
- Show progress indicators

### Phase 3: Details (15K tokens)
- Fill in detailed sections
- Add examples and guidance
- Final review

### Phase 4: Summary (2K tokens)
- Show what was created
- Provide statistics
- Show next steps
```

**User experience**:
```
User: /arckit.requirements
Claude: [Phase 1 - shows outline]
User: continue
Claude: [Phase 2 - shows core requirements]
User: continue
Claude: [Phase 3 - shows detailed requirements]
User: continue
Claude: [Phase 4 - shows summary]
```

### Solution 4: Section-by-Section Mode

Allow users to generate specific sections only:

```markdown
## Usage Examples

# Generate full document (may hit token limit)
/arckit.requirements

# Generate specific sections only (safe)
/arckit.requirements --sections "business-requirements,functional-requirements"

# Generate outline first, then expand sections
/arckit.requirements --outline
[User reviews outline]
/arckit.requirements --expand "data-requirements"
```

### Solution 5: Resume Capability

If a command hits the token limit mid-execution:

```markdown
## Strategy: Resumable Execution

Track progress in memory:
- memory/arckit-progress.json

If interrupted:
1. Save state (which sections completed)
2. User says "continue" or "resume"
3. Pick up where it left off
4. Complete remaining sections
```

## Implementation Plan

### Phase 1: Immediate Fix
- ✅ Document environment variable solution
- ✅ Update `.devcontainer/devcontainer.json` with token limit
- ✅ Add troubleshooting guide

### Phase 2: Command Updates (Priority Order)

**High Priority** (Most likely to hit limit):
1. `/arckit.research` - 🔴 VERY HIGH RISK
2. `/arckit.sobc` - 🔴 HIGH RISK
3. `/arckit.requirements` - 🔴 HIGH RISK
4. `/arckit.data-model` - 🔴 HIGH RISK
5. `/arckit.sow` - 🔴 HIGH RISK

**Medium Priority**:
6. `/arckit.risk` - 🟡 MEDIUM RISK
7. `/arckit.evaluation` - 🟡 MEDIUM RISK
8. `/arckit.principles` - 🟡 MEDIUM RISK

### Phase 3: Framework Improvements
- Create token-efficient command template
- Add chunking utility functions
- Add progress tracking system
- Add section-by-section mode

## Testing Strategy

### Test Each Command With Real Data

```bash
# Create test project
./scripts/bash/create-project.sh --name "Token Limit Test Project"

# Run high-risk commands and monitor token usage
/arckit.principles   # Check: Does it complete?
/arckit.requirements # Check: Does it hit limit?
/arckit.research     # Check: Does it hit limit?
/arckit.sobc        # Check: Does it hit limit?
```

### Monitor Token Usage

Claude Code shows token usage at bottom of response:
```
Token usage: 28491/32000 (89% of limit) ← DANGER!
Token usage: 15234/64000 (24% of limit) ← SAFE
```

## Command-Specific Fixes

### /arckit.research (HIGHEST RISK)

**Current behaviour**:
- Runs 10 research strategies
- Each strategy generates 1000-3000 tokens
- Total: 10,000-30,000 tokens
- Plus explanations: 5,000 tokens
- **TOTAL: 15,000-35,000 tokens** ← EXCEEDS LIMIT!

**New behaviour**:
```markdown
1. Identify research categories (1K tokens)
2. Show research plan (1K tokens)
3. Execute research, write findings directly to file using Write tool (0 output tokens!)
4. Show summary table only (2K tokens)
   - "Researched 15 vendors across 5 categories"
   - "Found 3 SaaS options, 2 open source, 1 UK Gov service"
5. Show next steps (1K tokens)
TOTAL: 5K tokens ← SAFE!
```

### /arckit.requirements (HIGH RISK)

**New behaviour**:
```markdown
1. Analyze context (1K tokens)
2. Show requirements outline (2K tokens)
3. Use Write tool to create requirements.md (0 output tokens!)
4. Show statistics only (1K tokens)
   - "Created 127 requirements"
   - "  - 23 business requirements"
   - "  - 45 functional requirements"
   - "  - 31 data requirements"
   - "  - 28 non-functional requirements"
5. Show next steps (1K tokens)
TOTAL: 5K tokens ← SAFE!
```

### /arckit.sobc (HIGH RISK)

**New behaviour with chunking**:
```markdown
## Phase 1: Strategic Case (10K tokens)
- Generate strategic case section
- Show to user

## Phase 2: Economic Case (10K tokens)
- Generate economic case section
- Show to user

## Phase 3: Remaining Cases (10K tokens)
- Generate commercial, financial, management cases
- Show to user

## Phase 4: Consolidate (2K tokens)
- Combine all sections using Write tool
- Show summary
TOTAL per phase: ~10K tokens ← SAFE!
```

## Troubleshooting

### Error: "Claude's response exceeded the 32000 output token maximum"

**Immediate fix**:
1. Set environment variable: `export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000`
2. Restart Claude Code
3. Try command again

**Long-term fix**:
1. Update `.devcontainer/devcontainer.json` with higher limit
2. Report which command hit the limit (create GitHub issue)
3. We'll update that command to be more token-efficient

### Error: "Command still hits limit even with 64K tokens"

**This means the command is generating >64K tokens. Solutions**:

1. **Use chunking**: Instead of running full command, break into phases
   ```
   User: /arckit.research
   Claude: [Shows plan and starts Phase 1]
   User: continue
   Claude: [Shows Phase 2]
   ```

2. **Use section mode**: Generate only what you need
   ```
   User: /arckit.requirements --sections "business,functional"
   ```

3. **Report it**: Create GitHub issue with:
   - Which command
   - What you were trying to do
   - How much of the output you saw before it failed

### Command stops mid-execution

If a command is interrupted:

1. Check if output file was created
   ```bash
   ls -lh projects/001-*/requirements.md
   ```

2. If file exists but incomplete:
   ```
   User: Continue the /arckit.requirements command from where it left off
   ```

3. If file doesn't exist:
   ```
   User: /arckit.requirements
   [Try again with higher token limit]
   ```

## Best Practices for Users

### 1. Set Higher Token Limit First

Before running ArcKit commands:
```bash
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
```

### 2. Start with Outlines

For large documents, request outline first:
```
User: /arckit.requirements but show me an outline first before generating the full document
```

### 3. Be Specific

Instead of full document, request specific parts:
```
User: /arckit.requirements - focus on data requirements only
```

### 4. Use Resume

If interrupted:
```
User: continue
```
or
```
User: resume the requirements document
```

### 5. Monitor Token Usage

Watch the token counter at bottom of responses:
- <20K = Safe
- 20-28K = Warning
- >28K = Danger (might hit limit)

## Statistics

Based on template sizes:

| Document | Lines | Est. Tokens | Safe at 32K? | Safe at 64K? |
|----------|-------|-------------|--------------|--------------|
| SOBC | 1012 | ~35K | ❌ No | ✅ Yes |
| Requirements | 933 | ~30K | ⚠️ Close | ✅ Yes |
| Data Model | 913 | ~28K | ⚠️ Close | ✅ Yes |
| Research | 832 | ~40K | ❌ No | ⚠️ Close |
| Risk Register | 800 | ~25K | ✅ Yes | ✅ Yes |
| SOW | 701 | ~28K | ⚠️ Close | ✅ Yes |

**Recommendation**: Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000` by default.

## Future Improvements

1. **Smart templates**: Detect when template is large, automatically use Write tool
2. **Progress tracking**: Save state so commands can resume
3. **Streaming output**: Show content as it's generated, write to file in chunks
4. **Section selectors**: Built-in `--sections` flag for all commands
5. **Token estimator**: Warn user if command might hit limit before running

## References

- Claude Code docs: https://docs.claude.com/claude-code
- Environment variables: https://docs.claude.com/claude-code/configuration
- Token limits: https://docs.anthropic.com/claude/reference/token-limits

## Version History

- **v0.3.2**: Initial documentation
- Future: Command updates to be more token-efficient
