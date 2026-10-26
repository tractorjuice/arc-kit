# UAE AI Autonomy Tier Posture Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:uae-ai-autonomy-tier` generates a three-tier AI Autonomy Posture for a UAE federal entity AI deployment. Tier 1 covers internal productivity, Tier 2 covers investor / external-facing with approval, and Tier 3 covers regulated / financial deployments. Captures per-tier guard-rails, approval gates, audit obligations, and tier-promotion criteria.

> This artefact is internal ArcKit synthesis on the federal three-tier model — no single public regulatory anchor exists. The underlying obligations come from the UAE AI Charter and PDPL.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI use cases and scope |
| Architecture (`diagrams/ARC-<id>-DIAG-*-v*.md`) | Model placement and inference path |
| Security NFRs (`NFR-SEC-*` in `ARC-<id>-REQ-v*.md`) | Confidentiality and integrity requirements |
| AI Charter assessment (`ARC-<id>-AICH-v*.md`) | Charter posture per use case |

---

## Command

```bash
/arckit:uae-ai-autonomy-tier <project ID or AI system description>
```

Output: `projects/<id>/ARC-<id>-AUTI-v1.0.md`

---

## The Three Tiers

| Tier | Use case | Posture |
|------|----------|---------|
| Tier 1 | Internal productivity (drafting, summarisation, internal copilots) | Lighter guard-rails, low-blast-radius decisions, log + review |
| Tier 2 | Investor / external-facing with approval (citizen-facing assistants, decision-support) | Approval gates per externally-visible output, full audit |
| Tier 3 | Regulated / financial (consequential decisions, regulated transactions) | Pre-deployment assurance, in-loop human, real-time audit, regulator notification |

---

## Posture Structure

| Section | Contents |
|---------|----------|
| AI Use-Case Inventory | Per use case: tier, owner, decision class, blast radius |
| Per-Tier Guard-Rail Matrix | Controls applied at each tier (input, model, output, monitoring) |
| Approval Gates per Tier | Who approves what, when, and on what evidence |
| Audit Obligations per Tier | Logging, retention, regulator notification cadence |
| Tier-Promotion Criteria | Conditions to graduate a use case from Tier 1 → 2 → 3 |
| External References | UAE AI Charter and PDPL citations |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Charter | 12-principle assessment | `/arckit:uae-ai-charter` |
| Tier posture | Per-tier guard-rails + promotion criteria | `/arckit:uae-ai-autonomy-tier` |
| Decisions | Tier-promotion is architecturally significant | `/arckit:adr` |
| Risk | Per-tier residual risks | `/arckit:risk` |

---

## Review Checklist

- Every AI use case in scope assigned to a tier with documented rationale.
- Guard-rails differ meaningfully across tiers (no one-size-fits-all).
- Approval gates name the role (not just "the team").
- Audit retention windows stated per tier.
- Tier-promotion criteria are objective and measurable.
- Tier promotions captured as ADRs.
- Per-tier residual risks fed to the project risk register.

---

## Key Notes

- **Central Bank AI guidance**: For Tier 3 workloads at an institution licensed by the Central Bank of the UAE (CBUAE), including insurance providers, the sector instrument is the CBUAE *Guidance Note on the Consumer Protection and Responsible Adoption and Use of Artificial Intelligence and Machine Learning by Licensed Financial Institutions in the U.A.E.*, issued 11 February 2026 and published in the CBUAE Rulebook under Market Conduct & Consumer Protection. It is to be read with the UAE Charter for the Development and Use of AI and with the *Guidelines for Financial Institutions Adopting Enabling Technologies*, issued 15 November 2021 jointly by CBUAE, the Securities and Commodities Authority (SCA), the DFSA and the ADGM FSRA. For a capital-markets entity supervised by SCA, the joint 2021 Guidelines are the instrument SCA co-issued; the 2026 Guidance Note is a CBUAE instrument. Source: <https://rulebook.centralbank.ae>.
- **No single regulatory anchor**: The three-tier model is an ArcKit synthesis. Run alongside `/arckit:uae-ai-charter` for the regulatory grounding.
- **Cabinet 50% mandate**: Federal entities pursuing the 23 April 2026 agentic-AI mandate should keep tier-promotion criteria pre-published — the regulator may request them.
- **Run after charter**: Charter posture is an input — run `/arckit:uae-ai-charter` first.
- **Community-contributed**: Output should be reviewed by qualified AI ethics / federal compliance counsel before reliance.
