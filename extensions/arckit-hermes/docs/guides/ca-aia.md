# Canada Algorithmic Impact Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-aia` generates a Canada Algorithmic Impact Assessment under the TBS *Directive on Automated Decision-Making*. It scores the system against the six-dimension questionnaire (Project, System, Algorithm, Decision, Impact, Data), computes the Impact Level (I, II, III, or IV), and applies the Directive's mandated mitigations for that Level — peer review tier, bilingual transparency notice, human-in-the-loop design, quality assurance plan, and a recourse mechanism for affected individuals.

The AIA is mandatory for any federal automated decision-making system that produces administrative decisions about individuals or businesses. The computed Level gates the system: Level III/IV systems require external peer review and pre-launch publication 30 days ahead of go-live, and the AIA itself is published on the Open Government portal by default. AIDA (Bill C-27) was stalled in Parliament, so the TBS Directive remains the federal public-sector floor for algorithmic accountability.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Decisions automated, NFR-AI / NFR-DEC requirements covering bias, contestability, override |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Training-data lineage and decision boundary inputs |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entity-level data structures feeding the model |
| Privacy Impact Assessment (`ARC-<id>-PIA-v1.0.md`) | Lawful authority and personal-information posture; AIA depth must match PIA depth |

---

## Command

```bash
/arckit:ca-aia <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AIA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Computed Impact Level, headline mitigations, residual risk posture |
| System Description | Purpose, decisions automated, training-data lineage, vendor / model provenance, stewardship |
| Levels I–IV Questionnaire Scoring | Six-dimension scoring tables (Project, System, Algorithm, Decision, Impact, Data) and computed Level |
| Per-Level Mitigation Requirements | Peer review, transparency notice, human-in-the-loop, QA, recourse — by Level |
| Algorithmic Risks Register | Bias, drift, proxies, contestability, fairness, severity with residual rating |
| Training-Data Provenance | Per-dataset source, licence, refresh cadence, drift trigger, steward |
| Disclosure Plan | Audience, channel, cadence, bilingual flag |
| Reassessment Triggers | Material-change triggers and periodic-reassessment cadence |
| Open Items | Pending peer-review nominations, publication, recourse, downstream artefacts |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- Any new automated decision-making system that touches individuals or businesses, before service launch.
- Vendor selection of an ML / AI tool that will be used in administrative decisions — the AIA validates Level and feeds procurement evaluation.
- Substantive change to training data, model architecture, decision boundary, or operating environment of a live system.
- Periodic reassessment — annual default, accelerated for Level III/IV systems.

---

## Common pitfalls

- **Self-declaring Level I to skip peer review.** The questionnaire output is the source of truth, not an architect's intuition. Reviewers will check the score-to-level mapping against the Directive's threshold matrix and a downward bias is a Directive breach.
- **Missing the 30-day pre-launch notification window.** Level III and IV systems require pre-launch publication 30 days before go-live and external peer review with realistic lead time. Booking these late forces a launch slip or a Directive non-conformance.
- **Treating the AIA as a launch artefact rather than a continuous compliance asset.** The Directive requires reassessment on material change to data, model, decision boundary, or operating environment, plus periodic reassessment. A static AIA produced once at launch is non-compliant over the system's lifecycle.
- **Conflating internal-productivity AI with decision-making AI.** Internal copilots that do not produce administrative decisions about individuals fall outside the Directive; running an AIA against them dilutes review capacity. Run the AIA where the Directive bites — automated administrative decisions — and pair internal-productivity AI with a separate posture (cross-reference `uae-ai-autonomy-tier` for a tiered model).

---

## Handoffs

- **`risk`** — AIA findings (bias, drift, contestability, fairness gaps) feed the operational risk register. Each algorithmic risk row in the AIA should map to a project-level risk entry with owner and review cadence.
- **`adr`** — Material AIA outcomes warrant Architecture Decision Records. Vendor selection of an ML model, autonomy tier (full automation vs decision-support vs human-only), and recourse-mechanism design are all ADR-worthy decisions with options analysis.
- **`ca-pia`** — Personal-information feeding the algorithmic system inherits the PIA controls. The AIA depth must match the PIA depth: a Level III/IV AIA against a thin PIA is a red flag, and vice versa.

---

## Statutory currency

The TBS *Directive on Automated Decision-Making* evolves on a published cadence; verify the current version on the TBS policy site before relying on threshold or mitigation cites. AIDA (Bill C-27) was stalled in Parliament, so the federal public-sector floor for algorithmic accountability remains the TBS Directive — not statutory AI legislation. The *Algorithmic Impact Assessment Tool* questionnaire is open-source and versioned on the Open Government portal; cite the specific release used to score the system.

The Directive is operational, not aspirational: the Treasury Board Secretariat tracks compliance through the AIA publications listed on the Open Government portal and through the policy suite's regular reviews. Architects should treat the published AIA as the single authoritative version of the assessment; severance of Protected B/C content for the public copy is acceptable, but withholding the whole assessment is not. Where a national-security exemption is claimed, document the exemption rationale and cross-reference `ca-soia` rather than silently dropping the publication step.
