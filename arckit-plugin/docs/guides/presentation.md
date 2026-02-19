# Presentation Guide

`/arckit.presentation` produces a MARP-format slide deck from existing project artifacts — ideal for governance boards, stakeholder briefings, and gate reviews.

---

## Inputs

- Multiple ArcKit artefacts committed (principles, stakeholders, requirements, plan, risk, diagrams, strategy).
- At least 3 artefacts recommended for a meaningful presentation.
- Optional: focus preference (executive, technical, stakeholder, procurement) and target slide count.

---

## Command

```bash
/arckit.presentation Generate executive presentation for <project>
/arckit.presentation <project> FOCUS=technical SLIDES=15
```

Output: `projects/<id>/ARC-<id>-PRES-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed focus/audience) instead of overwriting.

---

## What is MARP?

[MARP](https://marp.app/) (Markdown Presentation Ecosystem) converts markdown files into presentations. ArcKit generates MARP-formatted markdown with `---` slide separators and YAML frontmatter. The output can be:

- **Previewed** in VS Code with the [MARP extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- **Exported** to PDF, PPTX, or HTML via [MARP CLI](https://github.com/marp-team/marp-cli) (`marp --pdf`, `marp --pptx`)
- **Read** as plain markdown without any tooling

Mermaid diagrams (Gantt, pie, C4, quadrant) render natively in MARP.

---

## Presentation Focus Options

| Focus | Audience | Emphasis | Typical Slides |
|-------|----------|----------|---------------|
| **Executive** | Board, SRO, Programme Director | Business case, timeline, risks, decisions needed | 10-12 |
| **Technical** | Architects, developers, tech leads | Diagrams, technology decisions, integration, data model | 12-15 |
| **Stakeholder** | Users, service owners, change teams | Benefits, user impact, timeline, change management | 10-12 |
| **Procurement** | Commercial, vendors, evaluation panel | Requirements summary, evaluation criteria, contract structure | 10-12 |

---

## Presentation Structure

| Slide | Content | Source Artefact |
|-------|---------|----------------|
| Title | Project name, date, classification | Project metadata |
| Context & Objectives | Business challenge, strategic objectives, success criteria | STRAT, SOBC, REQ |
| Stakeholder Landscape | Key stakeholders, influence/interest mapping | STKE |
| Architecture Overview | Current → target state, C4 context diagram | DIAG, STRAT |
| Technology Decisions | Key choices with rationale | RSCH, AWSR, AZUR, ADR |
| Key Requirements | Category counts, critical requirements | REQ |
| Risk Summary | Top risks, mitigation, distribution chart | RISK |
| Roadmap & Timeline | Gantt chart, milestones, status | PLAN, ROAD |
| Compliance & Governance | Standards compliance status | TCOP, SECD, MSBD, DPIA |
| Recommendations & Next Steps | Actions, decisions, owners, deadlines | Synthesised |
| Questions & Discussion | Contact, next review date | Project metadata |

---

## Review Checklist

- Content matches latest artefact versions (not stale data).
- Slide count appropriate for meeting duration (rule of thumb: 2 minutes per slide).
- Mermaid diagrams render correctly in MARP preview.
- Classification banner matches project sensitivity.
- No sensitive information on slides intended for wider distribution.
- Stakeholder names and roles are current.
- Dates and milestones reflect latest plan.
- Recommendations have clear owners and deadlines.

---

## When to Regenerate

| Moment | Rationale |
|--------|-----------|
| Before governance boards or gate reviews | Ensure latest data is presented |
| After significant artefact updates | Refresh slides with new requirements, risks, or decisions |
| When audience changes | Switch focus (e.g., executive → technical) |
| Quarterly portfolio reviews | Consistent format across projects |
| Before stakeholder workshops | Provide context and discussion framework |

---

## Rendering the Presentation

**VS Code** (recommended for previewing):
```bash
# Install the MARP extension
code --install-extension marp-team.marp-vscode
# Open the .md file and click the MARP preview icon
```

**MARP CLI** (for export):
```bash
# Install
npm install -g @marp-team/marp-cli

# Export to PDF
marp --pdf ARC-001-PRES-v1.0.md

# Export to PowerPoint
marp --pptx ARC-001-PRES-v1.0.md

# Export to HTML
marp ARC-001-PRES-v1.0.md

# Custom theme
marp --theme gaia --pdf ARC-001-PRES-v1.0.md
```

Store the presentation alongside project artefacts and share with stakeholders ahead of meetings.
