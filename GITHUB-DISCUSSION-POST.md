# Introducing ArcKit: AI-Assisted Enterprise Architecture Governance

**TL;DR**: Free, open-source toolkit that brings systematic governance to enterprise architecture using AI assistants (Claude Code, Copilot, Cursor). Think "Spec Kit for enterprise architects."

## What is ArcKit?

ArcKit transforms EA governance from scattered Word docs and PowerPoint into Git-versioned, AI-assisted workflows:

- **Architecture Principles** → Establish organizational standards
- **Requirements Management** → Comprehensive, traceable requirements
- **Wardley Mapping** → Strategic build vs buy decisions
- **Vendor Procurement** → Generate RFPs and unbiased evaluation frameworks
- **Design Reviews** → Formal HLD/DLD validation gates
- **Traceability** → Automated gap detection

## Quick Start

```bash
# Install
pip install git+https://github.com/tractorjuice/arc-kit.git

# Initialize project
arckit init payment-modernization --ai claude
cd payment-modernization
claude

# Use ArcKit commands
/arckit.principles Create principles for financial services
/arckit.requirements Build a payment processing system...
/arckit.wardley Create strategic map showing build vs buy
/arckit.sow Generate vendor RFP
```

## Why ArcKit?

**Traditional EA tools** (Sparx EA, Ardoq, LeanIX):
- ❌ Expensive ($500-2000/user/year)
- ❌ Vendor lock-in
- ❌ Manual documentation
- ❌ No AI assistance
- ❌ Proprietary formats

**ArcKit**:
- ✅ Free and open-source
- ✅ Works with Claude Code, Copilot, Cursor, Gemini
- ✅ Git-versioned Markdown (no lock-in)
- ✅ Template-driven quality (comprehensive prompts guide AI)
- ✅ Strategic decision-making (built-in Wardley Mapping)

## Unique Features

**Wardley Mapping Integration**: Position components by evolution stage (Genesis → Custom → Product → Commodity) to guide build vs buy decisions strategically.

**UK Government Support**: Built-in Technology Code of Practice (13 points), AI Playbook (10 principles), and ATRS (Algorithmic Transparency) templates.

**Quality Assurance**: `/arckit.analyze` performs 7-pass governance analysis with A-F scoring.

## Try It Now

**Test in GitHub Codespaces**: https://github.com/tractorjuice/arckit-test-project-v1

**Full Article**: [ARTICLE.md](ARTICLE.md) (~7,000 words)

**Inspired by**: [Spec Kit](https://github.com/github/spec-kit) (adapted for EA workflows)

---

**Questions?**
- How are you currently managing EA governance?
- What features would be most valuable?
- Interested in contributing?

Let's discuss! 👇
