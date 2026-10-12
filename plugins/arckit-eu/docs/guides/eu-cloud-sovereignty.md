# EU Cloud Sovereignty Framework Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-cloud-sovereignty` assesses a cloud service against the European Commission's Cloud Sovereignty Framework (v1.2.1, October 2025). The framework supplements security assurance schemes — SecNumCloud, EUCS, ISO 27001 — with sovereignty-specific safeguards for cloud procurement. It scores eight weighted objectives and expresses the result on a five-level Sovereignty Effectiveness Assurance Level (SEAL) scale.

Use it when specifying a tender, when evaluating a candidate service against one, or both.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Workload description, data sensitivity, hosting constraints |
| Risk register | Existing cloud, supply chain and foreign-interference risks |
| SecNumCloud assessment (`ARC-<id>-SECNUM-v1.0.md`) | Security qualification status, if a French dimension applies |
| Architecture principles (`000-global`) | Cloud strategy, data sovereignty, foreign-dependency policy |

---

## Command

```bash
/arckit:eu-cloud-sovereignty Assess sovereignty posture for <cloud service or tender>
```

Output: `projects/<id>/ARC-<id>-EUCSF-v1.0.md`

---

## The Eight Sovereignty Objectives

Weights are set by the framework and sum to 100%. Treat them as the framework's defaults: ArcKit applies them as published, and the command does not offer a way to re-weight them. If a tender specification states its own weighting, follow the tender and record the deviation.

| Objective | Weight |
|-----------|--------|
| SOV-1 Strategic Sovereignty | 20% |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% |
| SOV-3 Data & AI Sovereignty | 10% |
| SOV-4 Operational Sovereignty | 15% |
| SOV-5 Supply Chain Sovereignty | 10% |
| SOV-6 Technology Sovereignty | 15% |
| SOV-7 Security & Compliance Sovereignty | 15% |
| SOV-8 Environmental Sustainability | 5% |

Strategic sovereignty carries the heaviest weight, and together with technology and operational sovereignty accounts for 50% — the framework treats dependency as the core sovereignty question, not data location alone.

---

## The SEAL Scale

| Level | Meaning |
|-------|---------|
| SEAL-0 | No sovereignty — exclusive non-EU control, governed entirely outside the EU |
| SEAL-1 | Jurisdictional sovereignty — EU law formally applies, limited practical enforceability |
| SEAL-2 | Data sovereignty — EU law applicable and enforceable, material non-EU dependencies remain |
| SEAL-3 | Digital resilience — EU actors exercise meaningful but not full influence |
| SEAL-4 | Full digital sovereignty — technology and operations under complete EU control |

---

## Score(SOVn) and Max.Score(SOVn), Defined

The command used to state `Sovereignty Score = Σ (Score(SOVn) / Max.Score(SOVn)) × Weight(SOVn)` without ever defining `Score(SOVn)` or `Max.Score(SOVn)` — so two runs over identical evidence could land on different numbers (arc-kit#782). The command now reads the official Annex calculator, transcribed at `plugins/arckit-eu/data/csf-criteria-calculator-2026-06-01.json`, and defines both terms from it:

- **Score(SOVn)** is the sum of the point values of whichever answers were selected for that objective's criteria — an unanswered criterion contributes nothing and is recorded as a gap, not a zero.
- **Max.Score(SOVn)** is a nominal **1000** for every objective, shared across all eight — not each objective's own computed maximum. Because the workbook rounds individual answer values to two decimal places, each objective's actual maximum lands slightly above 1000 (1000.03 to 1002.00, depending on the objective). A maximal response therefore scores **100.0756%**, not 100% — that overshoot is the framework's own documented behaviour, not a bug to clamp away.

The generated artefact carries an **Appendix A** with the per-criterion arithmetic for all 48 criteria (selected answer, Score value, SEAL) so the Sovereignty Score is checkable by a reader with no access to the scorer at all.

**SEAL is not an input to the Score, and the Score does not determine SEAL.** The same 48 answers determine both readings independently — each answer carries its own Score value and its own SEAL level. Overall SEAL is the *minimum* SEAL across every answered criterion, not an average and not a function of the weighted Score.

The Implementation guidance's narrative describes 43 sovereignty questions; the published calculator workbook scores 48 criteria across the eight objectives. The command records both counts, with the discrepancy stated, rather than silently picking one.

Where the catalogue lives depends on how you installed ArcKit. Under the Claude Code plugin it resolves inside the `arckit-eu` plugin's own `data/` directory. On a project scaffolded by `arckit init` — Codex, OpenCode or Copilot — it is copied to **`.arckit/data/`**, alongside `.arckit/templates/` and `.arckit/references/`, and the command bodies are rewritten to that path.

---

## Two Things This Command Is Deliberately Loud About

Both change the outcome of a procurement, and both are easy to get backwards.

**Minimum SEAL levels come from the tender specification, not from the framework.** The framework supplies the scale; the contracting authority supplies the floor, as a Minimum Assurance Level. A tender that does not reach the required minimum across all objectives is rejected. Reading the framework as prescribing a floor is the single most common misreading.

**A supplier's self-declared SEAL is an unverified claim until the assessor records evidence.** The template carries an evidence column per objective, drawn from the framework's own contributing factors — observable things rather than assertions: who holds decisive authority over the service, which legal system governs the contract, whether the customer alone holds cryptographic access, where support staff sit and under whose jurisdiction, the provenance of hardware, firmware and software including sub-suppliers, and whether APIs and licences actually permit exit.

The command records an assessment. It does not certify.

---

## Two Scores, Two Different Jobs

Keep these separate in the output, because they gate differently:

- The **Sovereignty Score** is a weighted percentage across all eight objectives, contributing to the tender's quality score as an **award criterion**.
- The **minimum SEAL per objective** is a **rejection gate**, set in the tender specification.

A service can score well overall and still be rejected for missing one objective's floor.

---

## The Overall SEAL: The Framework's Actual Rejection Gate

The eight objectives each carry their own SEAL, but the framework also defines an aggregate across all of them — and it is deliberately a **minimum**, never an average and never a mode. Two levels of the same rule apply, and the command cites them separately:

- **Per-objective SEAL** = the minimum SEAL across every criterion answered within that objective. The Commission's own Annex calculator implements exactly this at cell F2 — `="SEAL-"&MIN(H5:H251)` — the minimum over every answered row.
- **Overall SEAL** = the minimum SEAL evidenced across all eight objectives. The Implementation guidance states this plainly (p.9): *"The overall SEAL level is the lowest SEAL level achieved in any of the objectives."*

Those two levels agree because an objective's own SEAL is already a minimum — the Overall SEAL is a minimum-of-minimums, not a second independent calculation.

One consequence worth knowing before you read a scorecard: a criterion answered SEAL-4 on every question **cannot** drag the minimum down, and the guidance says so directly — *"When all responses grant SEAL-4, it must be understood that the criterion has no impact on the SEAL calculation."* It still feeds the weighted Sovereignty Score; it just can never be the reason a candidate misses a floor.

And the guidance is explicit about which of the two published numbers actually decides a procurement (p.10): *"It is important to emphasize the prevalence of the SEAL criterion over the Sovereignty Score... Sovereignty score is used to compare the offers that have reached the minimum required SEAL."* Read the Overall SEAL first. The Sovereignty Score only matters among candidates that already cleared it.

The template records the Overall SEAL alongside its **governing criterion** — the objective, and where identifiable the specific contributing factor, that set the minimum — so a reviewer can see at a glance why a candidate landed where it did rather than trusting an unattributed number.

One caveat on SEAL-4 itself, from the Commission's own "Lessons learnt" (p.13, published 1 June 2026): *"The level SEAL-4, however relevant, since it describes the highest level of Sovereignty, is not today relevant in the context of EU Sovereignty considering existing dependence to specific supply chains (chips, hardware)."* That is the Commission flagging a limitation of the current framework version it intends to revisit — not a reason to treat SEAL-4 as unreachable in an assessment you write today.

---

## One-Page Workflow

1. Establish the assessment context — tender specification, candidate assessment, or both
2. Record the minimum SEAL per objective, with its source in the tender documents
3. Assess each objective against its contributing factors, recording evidence alongside the claimed SEAL
4. Compute the weighted Sovereignty Score
5. Check each objective against its required minimum
6. Log the evidence basis and verification status per objective
7. Note member-state adoption context where a national programme applies

---

## Review Checklist

- [ ] All eight objectives assessed, none skipped
- [ ] Weights sum to 100% and match the framework's values
- [ ] SEAL claimed and SEAL evidenced recorded separately per objective
- [ ] Overall SEAL present and computed as a minimum (never an average or mode), with its governing objective/criterion named
- [ ] Minimum SEAL levels attributed to the tender specification, never to the framework
- [ ] Award criterion and rejection gate presented as distinct
- [ ] Evidence recorded per objective, not a blanket statement
- [ ] No commercial cloud provider named as sovereign or as achieving any SEAL level
- [ ] No vendor-analyst market research cited as a sovereignty source

---

## Key Notes

**There is no published EU list of assessed providers.** Anyone arriving from `/arckit:fr-secnumcloud`, which does have a qualification scheme, will expect one. The command says so explicitly for that reason.

**SecNumCloud and EUCS are complementary, not substitutes.** They address security assurance; this framework addresses sovereignty — jurisdictional, supply chain, operational and technology independence. A SecNumCloud qualification does not by itself establish a SEAL level.

**Member states are adopting the framework nationally.** The Netherlands is the first documented example, via the NDS Cloudprogramma, which applies SEAL on the demand side: a workplace requiring SEAL3 requires a service reaching at least SEAL3. That framing is the part most likely to transfer to other member states.

---

## Related Commands

| Command | Relationship |
|---------|--------------|
| `/arckit:eu-nis2` | Security baseline that SOV-7 intersects with |
| `/arckit:fr-secnumcloud` | French security qualification, complementary where a French dimension applies |
| `/arckit:risk` | Sovereignty and supply chain risks belong in the register |
