---
name: G-Cloud Framework Questions
description: This skill should be used when the user asks about "character limit", "how many features", "what lots", "CCS questions", "service categories", "declaration questions", "word limit", "mandatory exclusion", "service name limit", "pricing format", "what questions does CCS ask", "lot 1 categories", "lot 2 categories", "lot 3 categories", "how many words", "features limit", "benefits limit", "service description limit", "framework questions", "marketplace questions", "G-Cloud question structure", or needs quick lookups on Digital Marketplace field constraints and lot structures.
---

# G-Cloud Framework Questions

Conversational knowledge about Crown Commercial Service (CCS) framework questions, character limits, lot categories, and declaration requirements for G-Cloud submissions.

## Purpose

Provide instant answers to common questions about the Digital Marketplace question structure without requiring document generation. This covers the ~258 service questions and ~57 declaration questions that suppliers must answer.

## When to Use

Activate when users ask about:

- Character or word limits for specific fields
- How many features, benefits, or categories are allowed
- What lots exist and their categories
- Declaration requirements and exclusion grounds
- Pricing question structure
- Any "how many" or "what limit" question about G-Cloud fields

## Quick Reference: Common Limits

| Field | Limit |
|-------|-------|
| Service name | 100 characters |
| Service description | 50 words / 500 characters |
| Features | 10 items max, 100 chars each |
| Benefits | 10 items max, 100 chars each |
| Constraints | 100 words |
| Textbox (standard) | 200 words / 2,000 characters |
| Support levels | 200 words / 2,000 characters |

## Quick Reference: Lot Structure

| Lot | Name | Max Categories |
|-----|------|----------------|
| Lot 1 | Cloud Hosting | 10 (from 22 IaaS/PaaS categories) |
| Lot 2 | Cloud Software | 20 (from 18 primary + 240+ subcategories) |
| Lot 3 | Cloud Support | 6 (Planning, Setup & migration, QA & testing, Security, Training, Ongoing support) |

## Quick Reference: Declaration

The declaration has ~57 questions across these areas:

- **Mandatory exclusion grounds** (7 questions) — criminal convictions, tax evasion; must answer "No" to pass
- **Discretionary exclusion grounds** (11 questions) — bankruptcy, misconduct, misrepresentation
- **Modern slavery** (4 questions) — required for suppliers with turnover above threshold
- **Insurance** — employers liability minimum £5m
- **Framework agreement** (~19 questions) — T&Cs acceptance, service type, subcontracting

## Answering Questions

When answering framework questions:

1. **Check the quick reference tables above first** for common lookups (limits, lots, categories)
2. **Consult `references/framework-questions.md`** for the full question structure including question IDs, types, and which lots each question applies to
3. **Be specific about lot applicability** — many questions only apply to Lots 1 & 2 (hosting/software) and not Lot 3 (support), or vice versa
4. **Note that limits are strictly enforced** — the Digital Marketplace rejects submissions exceeding character/word limits

## Related Commands

These ArcKit commands generate documents that answer framework questions:

| Command | Framework Area |
|---------|---------------|
| `/arckit:service-design` | Service identity, features, benefits |
| `/arckit:sdd-lot1`, `sdd-lot2`, `sdd-lot3` | Technical, security, data, infrastructure questions |
| `/arckit:pricing` | Pricing questions |
| `/arckit:security` | Security and compliance questions |
| `/arckit:declaration` | All declaration questions |

## Additional Resources

### Reference Files

- **`references/framework-questions.md`** — Complete question structure with all ~258 service questions and ~57 declaration questions, organised by category. Includes question IDs, field types, character limits, and lot applicability. Consult for any question not covered by the quick reference tables above.
