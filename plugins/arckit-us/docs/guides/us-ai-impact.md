# US AI Impact Assessment (OMB M-24-10 / M-25-21)

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-ai-impact` generates an AI Impact Assessment under OMB M-24-10 (Advancing Governance, Innovation, and Risk Management for Agency Use of AI) and OMB M-25-21 (Accelerating Federal Use of AI through Innovation, Governance, and Public Trust). It determines whether the AI use case is **rights-impacting**, **safety-impacting**, both, or neither; applies the corresponding minimum practices; captures the AI use-case inventory entry for federal.ai.gov; and documents the M-25-21 acquisition clauses where the AI is procured rather than built.

The assessment is the **agency-facing AI governance artefact** — it is what the agency Chief AI Officer (CAIO) reviews, what the public AI use-case inventory cites, and what underpins the disclosures owed to affected individuals. Failing to mark a rights-impacting use case as such (or failing to publish it) is the single biggest M-24-10 finding pattern.

Reviewed by the CAIO, the SAOP for privacy alignment, the System Owner, and the agency procurement / contracts function where M-25-21 acquisition clauses apply.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| AI RMF Assessment (`ARC-<id>-AIRMF-v1.0.md`) | Risk evidence base |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI use case, decision logic, user population |
| Privacy Impact Assessment (`ARC-<id>-USPIA-v1.0.md`) | PII handling, individual notice posture |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Affected populations, decision recipients |

---

## Output

- **Doc-type**: `AIIA`
- **Filename**: `ARC-<PID>-AIIA-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Determine rights-impacting / safety-impacting classification per M-24-10 definitions.
2. Apply the minimum-practices checklist (impact assessment, real-world testing, monitoring, human review, public notice, opt-out).
3. Capture the federal.ai.gov use-case inventory record.
4. Where the AI is procured, build the M-25-21 acquisition clauses into the SOW / contract.
5. Surface disclosures, opt-out pathways, and feedback channels.

---

## Regulatory Anchors

- **OMB M-24-10** — <https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf>
- **OMB M-25-21** — <https://www.whitehouse.gov/omb/management/ofcio/>
- **federal.ai.gov AI use-case inventory** — <https://ai.gov/ai-use-cases/>
- **NIST AI 600-1 (Generative AI Profile)** — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>

---

## Example Usage

```bash
/arckit:us-ai-impact 001-claims-triage-llm
```

---

## Common Pitfalls

- **Failing to mark rights-impacting AI as such.** The definitions in M-24-10 are deliberately broad. If the AI affects access to benefits, employment, housing, healthcare, education, immigration, criminal justice, or civil rights — it is rights-impacting. Treat the default as "yes" and argue otherwise with evidence.
- **Skipping public disclosure.** M-24-10 requires the AI use case to be entered in the agency's inventory at federal.ai.gov, and rights-impacting AI requires individual notice. Internal-only documentation is non-compliance.
- **Not building M-25-21 acquisition clauses into vendor contracts.** Procured AI inherits the same M-24-10 minimum practices. Without acquisition clauses, the vendor is not obliged to support the agency in meeting them.
- **Treating "AI" narrowly.** Rule-based decision aids that drive consequential decisions can be in scope under the M-24-10 definition; not only ML / LLM systems.

---

## Handoffs

- **`us-ai-rmf`** — the AI RMF assessment is the evidence base
- **`us-privacy-pia`** — privacy notice and AI notice obligations interact
- **`risk`** — AIIA-surfaced residual risks flow into the project risk register
