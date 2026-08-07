# EU Cloud Sovereignty Framework Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-cloud-sovereignty` generates an EU Cloud Sovereignty Framework (v1.2.1, October 2025) assessment for organisations procuring, specifying, or evaluating cloud services. The Commission published the framework to supplement security assurance (SecNumCloud, EUCS, ISO 27001) with sovereignty-specific safeguards, and member states are beginning to adopt it as a national yardstick rather than only a Commission procurement tool.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Cloud service type, data sensitivity/classification, sovereignty-related NFRs |
| Risk register | Existing cloud/hosting risks, supply chain risks, foreign-interference risks |
| SecNumCloud assessment | Security qualification status — complementary, not interchangeable |
| Tender specification (`external/`) | The **only** valid source of minimum SEAL levels per objective |

---

## Command

```bash
/arckit:eu-cloud-sovereignty Assess sovereignty posture for <cloud service/procurement and role>
```

Output: `projects/<id>/ARC-<id>-EUCSF-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Procurement Context and Scope | Assessment purpose, cloud service type, workload, member state(s) |
| Minimum Assurance Levels | Per-objective minimum SEAL from the tender specification, with source |
| Sovereignty Score | SEAL definitions, weight table, formula, scored result |
| Objective-by-Objective Assessment | SOV-1 to SOV-8: SEAL claimed vs. evidenced, evidence table, gaps |
| Evidence Basis and Verification Status | Assessor evidence log; self-declared vs. evidenced SEAL |
| Member State Adoption Context | National adoption, Netherlands worked example |
| Gap Analysis and Remediation Plan | Gaps against minimum and target SEAL, priority, owner, timeline |
| Recommendation | Assessment record, not a certification; next steps |

---

## Eight Objectives and SEAL Scale at a Glance

The framework scores eight weighted Sovereignty Objectives (weights sum to 100%) and records a Sovereignty Effectiveness Assurance Level (SEAL) per objective.

| Objective | Weight | Focus |
|-----------|--------|-------|
| SOV-1 Strategic Sovereignty | 15% | EU control of decisive authority, financing, investment, resilience to vendor withdrawal |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% | Governing law, exposure to non-EU compelled-access regimes (e.g. US CLOUD Act) |
| SOV-3 Data & AI Sovereignty | 10% | Customer-only cryptographic access, EU confinement, AI pipeline governance |
| SOV-4 Operational Sovereignty | 15% | Migration/exit ease, EU operator capacity, documentation and know-how |
| SOV-5 Supply Chain Sovereignty | 20% | Hardware/firmware provenance, software supply chain, sub-supplier visibility |
| SOV-6 Technology Sovereignty | 15% | Open, non-proprietary APIs and standards; EU independence in HPC/processors |
| SOV-7 Security & Compliance Sovereignty | 10% | EU-jurisdiction certifications, SOC, GDPR/NIS2/DORA adherence |
| SOV-8 Environmental Sustainability | 5% | Energy efficiency, circular hardware, carbon/water disclosure |

| Level | Name | Definition |
|-------|------|------------|
| SEAL-0 | No Sovereignty | Exclusive non-EU control, governed entirely outside the EU |
| SEAL-1 | Jurisdictional Sovereignty | EU law formally applies, limited practical enforceability; exclusive non-EU control |
| SEAL-2 | Data Sovereignty | EU law applicable and enforceable; material non-EU dependencies remain |
| SEAL-3 | Digital Resilience | EU law applicable and enforceable; EU actors have meaningful, not full, influence |
| SEAL-4 | Full Digital Sovereignty | Complete EU control, subject only to EU law, no critical non-EU dependencies |

---

## Integration with Other EU Commands

| Command | Relationship |
|---------|--------------|
| `/arckit:eu-nis2` | SOV-7 (Security & Compliance Sovereignty) maps onto NIS2 Article 21 obligations for entities in NIS2 scope |
| `/arckit:risk` | Registers unmet minimum SEAL levels and sovereignty gaps in the project risk register |
| `/arckit:fr-secnumcloud` | Cross-check French SecNumCloud qualification alongside the sovereignty score — SecNumCloud and EUCS address **security assurance**; this framework addresses **sovereignty** (jurisdictional, supply chain, operational, technology independence). A SecNumCloud qualification does not, by itself, establish a SEAL level |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Cloud service type, workload sensitivity, member state(s) | `/arckit:requirements` |
| Security baseline | Security assurance qualification (France: SecNumCloud) | `/arckit:fr-secnumcloud` |
| Assessment | Sovereignty score and per-objective SEAL evidence | `/arckit:eu-cloud-sovereignty` |
| NIS2 layer | Map SOV-7 findings onto Article 21 | `/arckit:eu-nis2` |
| Risk | Register unmet minimum SEAL and sovereignty gaps | `/arckit:risk` |

---

## Review Checklist

- Assessment context determined (tender minimum-setting / candidate assessment / both).
- Minimum SEAL per objective sourced only from a tender specification, or marked "not yet set" — never derived from the framework.
- All eight objectives (SOV-1 to SOV-8) present with exact weights, summing to 100%.
- Sovereignty Score computed with the stated formula, reported as an award-criterion contribution.
- All five SEAL levels used with the correct definitions.
- Evidence table per objective drawn only from that objective's contributing factors.
- Self-declared SEAL explicitly flagged as an unverified claim pending evidence.
- No commercial cloud provider named as sovereign, compliant, or achieving any SEAL level.
- Member State Adoption section included with the Dutch worked example.

---

## Key Notes

- **Minimum SEAL comes from the tender specification, not the framework — deliberately loud.** The framework fixes the eight objectives, their weights, and the five-level SEAL scale. It does **not** fix which minimum SEAL a given procurement must reach per objective — that is a Minimum Assurance Level the contracting authority sets in the tender specification. A tender that does not consistently reach the required minimum across all objectives is rejected. Confusing "the framework's scale" with "the framework's floor" is the single most common misreading, and the command never lets the generated document imply a framework-mandated minimum.
- **A self-declared SEAL is an unverified claim until evidenced — deliberately loud.** A supplier's or project's self-declared SEAL level is never presented as fact. It stays an unverified claim until the assessor records objective-by-objective evidence drawn from the framework's own contributing factors (who holds decisive authority, which legal system governs the contract, whether the customer alone holds cryptographic access, where support staff sit, hardware/firmware/software provenance, whether APIs and licences actually permit exit). The document records an assessment; it does not certify.
- **No provider naming**: there is no published EU list of providers assessed against this framework. No commercial cloud provider is named as sovereign, compliant, or achieving a specific SEAL level.
- **Two independent scoring mechanisms**: the weighted Sovereignty Score is an award criterion contributing to the tender's quality score; the per-objective minimum SEAL is a separate pass/fail rejection gate. A high Sovereignty Score does not excuse failing a stated minimum SEAL on a single objective.
- **Netherlands worked example**: the Dutch *Notitie: Verkenning Overheidsbrede Soevereine Clouddiensten* (NDS Cloudprogramma, v1.0, 11 June 2026) adopts the framework as its sovereignty measure, publishes an official Dutch rendering of the SEAL levels, sets SEAL4 as the target for a government-wide sovereign cloud service, and applies SEAL on the demand side — a workplace requiring SEAL3 requires a service achieving at least SEAL3.
- **SecNumCloud intersection**: SecNumCloud (France) and EUCS are complementary security-assurance schemes, not a substitute for a sovereignty assessment — run `/arckit:fr-secnumcloud` alongside this command for French procurements.
