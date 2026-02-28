# Architecture Productivity Guide

ArcKit generates architecture artifacts in Markdown, but governance boards, procurement panels, and senior stakeholders expect Word documents, PDF packs, slide decks, and spreadsheets. Anthropic's document skills bridge that gap — letting you convert ArcKit output into polished, client-ready deliverables without leaving Claude Code.

---

## Installing the Document Skills

```text
/plugin marketplace add anthropics/skills
/plugin
```

Navigate to **Discover** > **anthropic-agent-skills** > **document-skills** and install. The skills work in both Claude Code and Claude Cowork.

---

## Skill-by-Skill Playbook

### PDF (`/pdf`)

Create sealed, read-only documents for compliance evidence and formal sign-off.

| ArcKit Command | Why PDF |
|----------------|---------|
| `/arckit:secure` | Security assessment locked for audit trail |
| `/arckit:dpia` | Data Protection Impact Assessment for the DPO |
| `/arckit:tcop` | Technology Code of Practice compliance record |
| `/arckit:risk` | Risk register snapshot for governance review |
| `/arckit:principles-compliance` | Principles compliance evidence for architecture board |

**Example** — compliance evidence pack from a Scottish Courts AI governance project:

```text
Read projects/014-scottish-courts/ARC-014-SECD-v1.0.md and
projects/014-scottish-courts/ARC-014-DPIA-v1.0.md and
projects/014-scottish-courts/ARC-014-TCOP-v1.0.md then use /pdf
to create a combined compliance evidence PDF with
"OFFICIAL-SENSITIVE" classification banner on every page.
Save to exports/ARC-014-compliance-evidence.pdf
```

---

### DOCX (`/docx`)

Create editable Word documents for governance boards that mark up and comment on submissions.

| ArcKit Command | Why DOCX |
|----------------|----------|
| `/arckit:sobc` | Strategic Outline Business Case for board approval |
| `/arckit:sow` | Statement of Work for procurement negotiation |
| `/arckit:requirements` | Requirements specification for stakeholder review |
| `/arckit:strategy` | Strategy document for executive circulation |
| `/arckit:stakeholders` | Stakeholder analysis for project initiation |

**Example** — board submission from a Windows 11 deployment project:

```text
Read projects/003-windows11/ARC-003-SOBC-v1.0.md then use /docx
to create a Word document with Document Control table on page 1,
executive summary on page 2, and all sections following.
Add "DRAFT — For Board Review" watermark.
Save to exports/ARC-003-SOBC-board-submission.docx
```

---

### PPTX (`/pptx`)

Create slide decks for steering committees, show-and-tells, and stakeholder briefings.

| ArcKit Command | Why PPTX |
|----------------|----------|
| `/arckit:presentation` | Architecture overview already structured for slides |
| `/arckit:stakeholders` | Stakeholder map and power/interest grid for kick-off |
| `/arckit:roadmap` | Technology roadmap for steering committee |
| `/arckit:plan` | Architecture plan milestones for project board |
| `/arckit:sobc` | Executive summary slides from business case |

**Example** — steering committee deck from a fuel price transparency project:

```text
Read projects/017-fuel-prices/ARC-017-PRES-v1.0.md then use /pptx
to create a 12-slide deck with: title slide, problem statement,
proposed architecture, key risks, roadmap, and next steps.
Use dark blue title bars and white body text.
Save to exports/ARC-017-steering-deck.pptx
```

---

### XLSX (`/xlsx`)

Create sortable, filterable spreadsheets for analysis workflows and tool imports.

| ArcKit Command | Why XLSX |
|----------------|----------|
| `/arckit:evaluate` | Vendor evaluation matrix with weighted scores |
| `/arckit:risk` | Risk register with likelihood/impact heatmap |
| `/arckit:backlog` | User stories for Jira or Azure DevOps import |
| `/arckit:finops` | Cost breakdown with pivot-ready data |
| `/arckit:requirements` | Requirements table for traceability matrix |

**Example** — vendor evaluation matrix from a Windows 11 deployment project:

```text
Read projects/003-windows11/ARC-003-EVAL-v1.0.md then use /xlsx
to create a spreadsheet with: Sheet 1 "Scoring Matrix" with
weighted scores and conditional formatting (green/amber/red),
Sheet 2 "Raw Data" with all vendor responses.
Save to exports/ARC-003-vendor-evaluation.xlsx
```

---

## End-to-End Use Cases

These scenarios show how ArcKit commands chain with document skills to produce complete deliverable packs. Each references a real ArcKit test repo.

### 1. Architecture Board Submission

**Scenario**: Windows 11 Intune migration needs board approval.

| Step | Action |
|------|--------|
| 1 | `/arckit:stakeholders` — identify board members and their concerns |
| 2 | `/arckit:risk` — assess migration risks |
| 3 | `/arckit:sobc` — build the Strategic Outline Business Case |
| 4 | `/docx` — convert SOBC to editable Word for board mark-up |
| 5 | `/pptx` — create executive summary deck for the meeting |

### 2. Vendor Procurement Pack

**Scenario**: Windows 11 deployment vendor evaluation for procurement.

| Step | Action |
|------|--------|
| 1 | `/arckit:sow` — define Statement of Work |
| 2 | `/arckit:evaluate` — score vendor proposals |
| 3 | `/xlsx` — export evaluation matrix as sortable spreadsheet |
| 4 | `/pdf` — create sealed PDF of final scores for procurement audit |

### 3. Stakeholder Briefing Deck

**Scenario**: Fuel Price Transparency Service kick-off with BEIS stakeholders.

| Step | Action |
|------|--------|
| 1 | `/arckit:stakeholders` — map stakeholders and their interests |
| 2 | `/arckit:requirements` — capture high-level requirements |
| 3 | `/pptx` — build briefing deck with stakeholder map and top requirements |

### 4. Compliance Evidence Pack

**Scenario**: Scottish Courts AI governance review requires sealed evidence.

| Step | Action |
|------|--------|
| 1 | `/arckit:secure` — run security assessment |
| 2 | `/arckit:tcop` — assess Technology Code of Practice compliance |
| 3 | `/arckit:dpia` — complete Data Protection Impact Assessment |
| 4 | `/pdf` — bundle all three into a sealed compliance PDF pack |

### 5. Sprint Planning Handoff

**Scenario**: Criminal Courts technology review backlog ready for development.

| Step | Action |
|------|--------|
| 1 | `/arckit:backlog` — generate user stories from requirements |
| 2 | `/xlsx` — export as spreadsheet for Jira or Azure DevOps CSV import |

---

## Audience-to-Format Mapping

Use this table to pick the right export format for your audience.

| Audience | Preferred Format | Skill | Typical Artifacts |
|----------|-----------------|-------|-------------------|
| Architecture board | Word (editable) | `/docx` | SOBC, strategy, requirements |
| Steering committee | PowerPoint | `/pptx` | Presentation, roadmap, plan |
| Procurement panel | Excel + PDF | `/xlsx` `/pdf` | Evaluation matrix, SOW, sealed scores |
| Development team | Excel | `/xlsx` | Backlog, data model, requirements table |
| Auditors / compliance | PDF (sealed) | `/pdf` | Security assessment, DPIA, TCoP |
| Data Protection Officer | PDF | `/pdf` | DPIA, data model, privacy assessment |
| Project sponsor | PowerPoint | `/pptx` | Executive summary, stakeholder briefing |
| Finance / CFO | Excel | `/xlsx` | FinOps, cost model, business case numbers |

---

## Tips

**Branding in prompts** — Include your organisation's colours, logo placement, and font preferences in the skill prompt. For UK Government documents, add the classification banner (e.g., "OFFICIAL-SENSITIVE") as a header on every page.

**MARP vs `/pptx`** — ArcKit's `/arckit:presentation` command generates MARP Markdown for quick slide previews. Use `/pptx` when you need a polished PowerPoint file with custom formatting, animations, or corporate templates. Both approaches work — MARP for speed, `/pptx` for polish.

**Keep exports outside `projects/`** — Save document skill output to an `exports/` folder at the repo root. The `projects/` directory is for ArcKit's versioned Markdown artifacts. Keeping exports separate avoids cluttering the artifact tree and makes `.gitignore` patterns simpler.

**Re-export after updates** — When ArcKit auto-versions an artifact (e.g., `v1.0` to `v1.1`), re-run the document skill to keep exports in sync. The Markdown source is always the single source of truth.

**Batch processing** — You can convert multiple artifacts in a single prompt. Ask Claude to read several files and produce one combined document, or create separate files in a batch.

---

## Related Guides

- [Plugin Setup & MCP Servers](mcp-servers.md) — Installing ArcKit and configuring MCP servers
- [Presentation Guide](presentation.md) — Creating MARP slide decks with `/arckit:presentation`
- [Vendor Evaluation Guide](evaluate.md) — Scoring vendors with `/arckit:evaluate`
- [Business Case Guide](sobc.md) — Building Strategic Outline Business Cases
- [Backlog Guide](backlog.md) — Generating user stories for sprint planning
- [Security Assessment Guide](secure.md) — Running security assessments
- [DPIA Guide](dpia.md) — Data Protection Impact Assessments
