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
| SOV-1 Strategic Sovereignty | 15% |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% |
| SOV-3 Data & AI Sovereignty | 10% |
| SOV-4 Operational Sovereignty | 15% |
| SOV-5 Supply Chain Sovereignty | 20% |
| SOV-6 Technology Sovereignty | 15% |
| SOV-7 Security & Compliance Sovereignty | 10% |
| SOV-8 Environmental Sustainability | 5% |

Supply chain carries the heaviest weight, and technology, strategic and operational sovereignty together carry 45% — the framework treats dependency as the core sovereignty question, not data location alone.

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
