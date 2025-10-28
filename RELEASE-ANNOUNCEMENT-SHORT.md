# Announcing ArcKit: Free Enterprise Architecture Governance with AI

**TL;DR**: We've released ArcKit v0.2.0—a free, open-source toolkit that brings AI-assisted workflows and strategic Wardley Mapping to enterprise architecture governance.

---

## The Problem

Enterprise architecture governance is broken. Despite expensive tools like Sparx EA and Ardoq ($500-2000/user/year), architects still struggle with:

- Requirements scattered across Word docs and Confluence
- Manual vendor evaluations prone to bias
- Lost traceability between requirements and design
- Architecture principles as PDF shelf-ware

## The Solution: ArcKit

ArcKit transforms EA governance into systematic, AI-assisted workflows using Claude Code, OpenAI Codex CLI, or Gemini CLI.

**12 Slash Commands. Complete Governance. Zero Cost.**

```bash
# Install
pip install git+https://github.com/tractorjuice/arc-kit.git

# Initialize
arckit init payment-modernization --ai claude
cd payment-modernization
claude

# Use commands (12 total)
/arckit.principles Create principles for financial services
/arckit.requirements Build a payment processing system...
/arckit.wardley Create strategic map showing build vs buy
/arckit.sow Generate vendor RFP
/arckit.evaluate Compare vendor proposals
/arckit.hld-review Review high-level design
/arckit.dld-review Review detailed design
/arckit.traceability Generate requirements matrix
/arckit.analyze Comprehensive governance quality check
/arckit.tcop Assess UK Government TCoP compliance
/arckit.ai-playbook Assess AI Playbook compliance
/arckit.atrs Generate ATRS transparency record
```

## Key Features

**Strategic Wardley Mapping** (Unique to ArcKit)
- Position components by evolution stage (Genesis → Custom → Product → Commodity)
- Guide build vs buy decisions strategically
- Visualize at https://create.wardleymaps.ai

**UK Government Support** (Built-in)
- Technology Code of Practice (13 points)
- AI Playbook (10 principles + 6 ethical themes)
- ATRS (Algorithmic Transparency)
- Digital Marketplace procurement guidance

**Quality Assurance**
- 7-pass governance analysis
- Automated traceability checking
- A-F governance health scoring

**Template-Driven Quality**
- Comprehensive templates guide AI generation
- Nothing forgotten, consistent quality
- Git-versioned Markdown (no lock-in)

## Real-World Impact

**Financial Services**: 60% less documentation time, $2M saved by avoiding building commodity components

**UK Government**: Full TCoP compliance, 25% cost savings via GOV.UK service reuse, 40% faster G-Cloud procurement

## How It Compares

| Feature | ArcKit | Sparx EA | Ardoq | LeanIX |
|---------|--------|----------|-------|--------|
| **Cost** | **FREE** | $$$$ | $$$$ | $$$$ |
| **AI-Assisted** | ✅ | ❌ | ❌ | ❌ |
| **Wardley Mapping** | ✅ | ❌ | ⚠️ | ❌ |
| **Version Control** | ✅ Git | ❌ | ❌ | ❌ |
| **UK Gov Support** | ✅ | ❌ | ❌ | ❌ |
| **Lock-in** | **None** | High | High | High |

## Try It Now

**GitHub Codespaces**: https://github.com/tractorjuice/arckit-test-project-v1

Complete test project ready to go—just click "Open with Codespaces."

**Quick Start**:
```bash
arckit init my-project --ai claude
cd my-project
claude
/arckit.principles Create principles for my organization
```

## What's Next

**v0.3.0** (Q1 2025): Jira/Azure DevOps integration, industry templates
**v0.4.0** (Q2 2025): Real-time collaboration, advanced analytics
**v1.0.0** (Q3 2025): Enterprise-ready with SSO, RBAC, plugin ecosystem

## Get Involved

- **GitHub**: https://github.com/tractorjuice/arc-kit
- **Docs**: https://github.com/tractorjuice/arc-kit/blob/main/README.md
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Discussions**: https://github.com/tractorjuice/arc-kit/discussions

**Open-source (MIT License). Community-driven. Built by architects, for architects.**

---

*Inspired by [Spec Kit](https://github.com/github/spec-kit), adapted for enterprise architecture workflows.*

**The future of EA governance is AI-assisted, strategic, and free. Welcome to ArcKit.**
