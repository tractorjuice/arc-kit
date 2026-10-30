# US AI Impact Assessment (OMB M-25-21 / M-25-22)

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit-us:us-ai-impact` generates an AI Impact Assessment under OMB M-25-21 (Accelerating Federal Use of AI through Innovation, Governance, and Public Trust, April 2025), which rescinded and replaced M-24-10. It determines whether the AI use case is **high-impact**, checks it against the purposes M-25-21 presumes to be high-impact, applies the seven minimum risk-management practices, records any CAIO waiver, captures the AI use-case inventory entry, and documents the OMB M-25-22 acquisition terms where the AI is procured rather than built.

The assessment is the **agency-facing AI governance artefact** — it is what the agency Chief AI Officer (CAIO) reviews, what the public AI use-case inventory reflects, and what underpins the agency's appeal and feedback routes. Since 3 April 2026, a high-impact use case that does not meet the minimum practices, and has no waiver, must be safely discontinued.

Reviewed by the CAIO, an independent reviewer who was not involved in development, the official who accepts the risk, the SAOP for privacy alignment, the System Owner, and the agency procurement / contracts function where M-25-22 acquisition terms apply.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| AI RMF Assessment (`ARC-<id>-AIRMF-v1.0.md`) | Risk evidence base |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI use case, decision logic, user population |
| Privacy Impact Assessment (`ARC-<id>-USPIA-v1.0.md`) | PII handling; the impact assessment should reference it |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Affected populations, decision recipients |

---

## Output

- **Doc-type**: `AIIA`
- **Filename**: `ARC-<PID>-AIIA-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Check the use case against the fifteen purposes M-25-21 §6 presumes to be high-impact.
2. Apply the §5 high-impact test: is the AI's output a principal basis for a decision or action with a legal, material, binding, or significant effect on rights, access to programs or services, health and safety, critical infrastructure, or strategic assets? Record a not-high-impact conclusion for a §6 purpose with the written notice to the CAIO.
3. Apply the seven minimum practices (pre-deployment testing, impact assessment, ongoing monitoring, operator training, human oversight with a fail-safe, remedies and appeals, end-user and public feedback), including the seven elements of the impact assessment.
4. Record the waiver posture for any practice not met: the CAIO's written determination, the ground, compensating measures, OMB reporting and annual certification.
5. Capture the AI use-case inventory record, published at `[agency.gov]/ai`.
6. Where the AI is procured, build the M-25-22 acquisition terms into the solicitation and contract (and the M-26-04 terms for a large language model).

---

## Regulatory Anchors

- **OMB M-25-21** — <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf>
- **OMB M-25-22** — <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-22-Driving-Efficient-Acquisition-of-Artificial-Intelligence-in-Government.pdf>
- **OMB M-26-04 (large language model procurement)** — <https://www.whitehouse.gov/wp-content/uploads/2025/12/M-26-04-Increasing-Public-Trust-in-Artificial-Intelligence-Through-Unbiased-AI-Principles-1.pdf>
- **OMB AI reporting guidance and consolidated AI use-case inventory** — <https://github.com/ombegov/2025-Federal-Agency-AI-Use-Case-Inventory>
- **NIST AI 600-1 (Generative AI Profile)** — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>

---

## Example Usage

```bash
/arckit-us:us-ai-impact 001-claims-triage-llm
```

---

## Common Pitfalls

- **Assessing against M-24-10.** M-25-21 rescinded M-24-10 on 3 April 2025. "Rights-impacting" and "safety-impacting" are no longer the categories; "high-impact" is. Re-run older assessments.
- **Treating a §6 purpose as automatically decisive, either way.** A §6 purpose is presumed high-impact, but the test is whether the AI's output is a principal basis for the decision. Concluding that a §6 use case is not high-impact needs written notice to the CAIO, and the CAIO can revisit it. Where the evidence is unclear, treat it as high-impact.
- **Assuming human review takes a use case out of scope.** M-25-21 says a use case can be high-impact whether or not a human oversees the decision.
- **Skipping public reporting.** Agencies must publish their AI use-case inventory and summaries of each not-high-impact determination and waiver. Internal-only documentation is non-compliance.
- **Not building M-25-22 terms into vendor contracts.** Procured high-impact AI must still meet the M-25-21 practices. Without the contract terms, the vendor is not obliged to give the agency the documentation and testing access it needs.
- **Misjudging what counts as AI.** M-25-21 excludes robotic process automation and systems whose behaviour is defined only by human-defined rules, but says no system is too simple to qualify as covered AI. Machine-learning components in an otherwise rule-based workflow are in scope.

---

## Handoffs

- **`us-ai-rmf`** — the AI RMF assessment is the evidence base
- **`us-privacy-pia`** — the impact assessment should reference the PIA where PII is involved
- **`risk`** — AIIA-surfaced residual risks flow into the project risk register
