# Architecture Strategy Playbook

`/arckit.strategy` synthesises multiple strategic artifacts into a single executive-level Architecture Strategy document.

---

## Purpose

Most enterprise architecture initiatives produce multiple strategic artifacts: principles, stakeholder analysis, Wardley maps, roadmaps, and business cases. Executives and senior stakeholders shouldn't need to read 5 separate documents to understand the strategy.

The `/arckit.strategy` command **synthesises** these artifacts into a coherent narrative that:
- Articulates the strategic vision
- Links stakeholder drivers to strategic themes
- Shows how principles guide decisions
- Summarises the investment and expected returns
- Highlights strategic risks and mitigations

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Architecture Principles | **MANDATORY** | Decision framework, technology standards |
| Stakeholder Analysis | **MANDATORY** | Business drivers, goals, measurable outcomes |
| Wardley Maps | Recommended | Build vs buy decisions, technology evolution |
| Architecture Roadmap | Recommended | Timeline, phases, milestones, investment |
| Strategic Business Case (SOBC) | Recommended | Investment figures, ROI, benefits |
| Risk Register | Optional | Strategic risks, mitigations |

> **Note**: The command will STOP if principles or stakeholders are missing. These are fundamental to any strategy.

---

## Command

```bash
/arckit.strategy Create architecture strategy for <initiative-name>
```

Outputs: `projects/<id>/ARC-<id>-STRAT-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| **Executive Summary** | Vision, context, key decisions, strategic outcomes |
| **Strategic Drivers** | Business drivers, external drivers, stakeholder alignment |
| **Guiding Principles** | Principles summary with strategic implications |
| **Current State Assessment** | Technology landscape, capability maturity, SWOT |
| **Target State Vision** | Future architecture, maturity targets, vision diagram |
| **Technology Evolution** | Build vs buy, technology radar, strategic positioning |
| **Strategic Themes** | 3-5 investment themes with objectives and initiatives |
| **Delivery Roadmap Summary** | Timeline, phases, milestones |
| **Investment Summary** | CAPEX/OPEX, by year, by theme, business case metrics |
| **Strategic Risks** | Top risks, heat map, assumptions, constraints |
| **Success Metrics** | KPIs with baselines and targets |
| **Governance Model** | Forums, decision rights, review cadence |
| **Traceability** | Links back to all source artifacts |

---

## Workflow Position

The strategy command sits at a synthesis point in the ArcKit workflow:

```
                           ┌─────────────┐
                           │  Principles │
                           └──────┬──────┘
                                  │
┌──────────────┐    ┌─────────────▼──────────────┐    ┌────────────────┐
│ Stakeholders │───▶│       /arckit.strategy      │◀───│  Wardley Maps  │
└──────────────┘    └─────────────┬──────────────┘    └────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
    ┌─────────┐            ┌───────────┐            ┌──────────┐
    │ Roadmap │            │   SOBC    │            │   Risk   │
    └─────────┘            └───────────┘            └──────────┘
```

**Best Practice**: Create strategy AFTER you have at least principles and stakeholders. Add Wardley maps, roadmap, and SOBC for a more comprehensive strategy.

---

## Example Usage

### Minimal (Principles + Stakeholders only)

```bash
# Ensure prerequisites exist
/arckit.principles Create principles for NHS Appointment Booking
/arckit.stakeholders Analyze stakeholders for NHS Appointment Booking

# Create strategy
/arckit.strategy Create architecture strategy for NHS Appointment Booking
```

### Comprehensive (All strategic artifacts)

```bash
# Create all strategic inputs
/arckit.principles Create principles for Digital Courts
/arckit.stakeholders Analyze stakeholders for Digital Courts
/arckit.risk Create risk register for Digital Courts
/arckit.sobc Create business case for Digital Courts
/arckit.wardley Create Wardley map for Digital Courts
/arckit.roadmap Create roadmap for Digital Courts

# Synthesise into strategy
/arckit.strategy Create architecture strategy for Digital Courts
```

---

## Key Differentiators

| Aspect | /arckit.roadmap | /arckit.strategy |
|--------|-----------------|------------------|
| **Focus** | Timeline and delivery | Executive narrative |
| **Audience** | Programme managers, delivery teams | CTO, Strategy Board, executives |
| **Detail Level** | Detailed milestones, investments by quarter | High-level themes, strategic decisions |
| **Prerequisites** | Principles, requirements | Principles, stakeholders |
| **Output** | Gantt charts, phase details | Vision, SWOT, strategic themes |

> **Use roadmap** when you need to plan delivery. **Use strategy** when you need to communicate the strategic vision.

---

## Tips

- **Run after strategic artifacts are stable**: The strategy synthesises existing decisions. Run it after your principles, stakeholders, and (ideally) Wardley maps are agreed.

- **Executive language**: The strategy is for senior stakeholders. Avoid technical jargon; focus on business outcomes, investment, and risk.

- **Traceability is key**: Every element should trace back to source documents. This builds confidence that the strategy is grounded in agreed artifacts.

- **Update quarterly**: Strategies should be reviewed and refreshed quarterly. Use versioning (v1.0, v2.0) to track evolution.

- **Gaps are OK**: If some artifacts are missing, the strategy will note them as gaps. This is valuable information for the reader.

---

## Follow-On Commands

After creating the strategy, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.requirements` | Capture detailed requirements (BR/FR/NFR) |
| `/arckit.roadmap` | Expand timeline with detailed phases and milestones |
| `/arckit.plan` | Create detailed project plan for Phase 1 |
| `/arckit.diagram` | Visualise target architecture |
| `/arckit.backlog` | Convert requirements to user stories |

---

## UK Government Context

For UK Government projects, the strategy will include:

- **Financial year notation**: FY 2024/25, FY 2025/26
- **GDS Service Standard**: Discovery/Alpha/Beta/Live phases
- **TCoP alignment**: Technology Code of Practice references
- **Spending Review**: SR period alignment
- **G-Cloud/DOS**: Procurement route references

---

## Output Example

```
## Architecture Strategy Created

**Document**: `projects/007-digital-courts/ARC-007-STRAT-v1.0.md`
**Document ID**: ARC-007-STRAT-v1.0

### Strategy Overview
- **Strategic Horizon**: FY 2024/25 - FY 2027/28 (4 years)
- **Total Investment**: £12.5M (65% CAPEX / 35% OPEX)
- **Expected ROI**: 185% by FY 2027/28
- **Risk Appetite**: MEDIUM

### Key Strategic Decisions
- **Build vs Buy**: Hybrid (build differentiators, buy commodity)
- **Cloud Strategy**: Cloud-Native on Azure
- **Vendor Strategy**: Multi-vendor with strategic partners

### Strategic Themes
1. **Digital Services Platform**: £5.2M - Modernise citizen-facing services
2. **Data & Analytics**: £3.1M - Enable data-driven case management
3. **Integration & Interoperability**: £2.4M - Connect justice system components
4. **Security & Compliance**: £1.8M - Achieve MOJ security standards

### Synthesised From
- ✅ Architecture Principles: ARC-000-PRIN-v1.0.md
- ✅ Stakeholder Analysis: ARC-007-STKE-v1.0.md
- ✅ Wardley Maps: ARC-007-WARD-001-v1.0.md
- ✅ Architecture Roadmap: ARC-007-ROAD-v1.0.md
- ✅ Strategic Business Case: ARC-007-SOBC-v1.0.md
- ⚠️ Risk Register: Not available (recommended)

**File location**: `projects/007-digital-courts/ARC-007-STRAT-v1.0.md`
```
