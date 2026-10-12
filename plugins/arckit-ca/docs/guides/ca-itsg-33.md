# Canada ITSG-33 Statement of Applicability Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-itsg-33` generates an ITSG-33 Statement of Applicability for a Canadian federal information system. ITSG-33 is the *IT Security Risk Management: A Lifecycle Approach* publication issued by the Communications Security Establishment / Canadian Centre for Cyber Security and is the federal baseline for security control selection. The artefact this command produces walks through information-asset categorisation, control-profile selection, per-family applicability, cryptographic module validation, supply-chain screening, continuous monitoring, and the authorisation chain.

The TBS *Standard on Security Categorization* sits upstream of ITSG-33 — it is the source of the injury-based Confidentiality / Integrity / Availability scoring matrix that produces the system-level categorisation (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET). The categorisation drives every downstream choice, so the categorisation section is the load-bearing part of the artefact: get it wrong and the chosen control profile, the tailoring envelope, and the authorisation cycle all propagate the error.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Functional context and NFR-SEC-* security requirements |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element sensitivity classifications feeding categorisation |
| Privacy Impact Assessment (`ARC-<id>-PIA-v1.0.md`) | Personal-information drivers for the categorisation, especially Confidentiality scoring |
| Statement of Initial Authority (`ARC-<id>-SOIA-v1.0.md`, if classified) | Classified-information envelope and lawful-handling chain |

---

## Command

```bash
/arckit:ca-itsg-33 <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-ITSG-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | System-level categorisation, chosen profile, tailoring posture, CMVP / supply-chain status |
| Information Asset Categorisation | Per-asset C / I / A scores (Low / Medium / High), aggregated to system-level categorisation |
| Control Profile Selection | PBMM / PBMM-Cloud / Secret-High / Top-Secret-High with rationale and tailoring summary |
| Statement of Applicability | Per-family applicability across all 16 ITSG-33 control families (AC, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PS, RA, SA, SC, SI) |
| Cryptographic Module Validation | CMVP / FIPS 140-3 certificate per module, validation level, algorithm scope, status |
| Supply Chain Security | Vulnerable Suppliers and sanctioned-entities screen across prime, sub-processors, equipment, managed services |
| Continuous Monitoring Plan | Frequency, tooling, reporting cadence, re-categorisation triggers |
| Authorisation Chain | System Owner → Security Authority → Authorising Official with cycle and conditions |
| Open Items | Outstanding tailoring, unfinished CMVP checks, unresolved supplier flags |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- Pre-authorisation — generate the Statement of Applicability before the authorising official considers the package; an Authority to Operate cannot be granted without it.
- ATO renewal — re-run at the published re-authorisation cycle (typical federal cycle is annual or triennial depending on categorisation).
- Substantive change to the system or its operating environment — new data elements, new processing purposes, new operating environment (on-prem to cloud, region change), new supplier, or a security incident that materially changes the threat picture.

---

## Common pitfalls

- **Under-scoring categorisation.** The temptation is to score down to keep the control envelope manageable. The TBS Standard is injury-based — score the realistic worst-case injury, not the convenient one. Under-scoring is the failure mode that propagates the furthest.
- **Tailoring-by-preference.** Every deviation from the published CSE profile must be justified with a residual-risk statement and named acceptance. "We don't want to do this" is not a tailoring rationale; "the compensating control delivers equivalent or greater assurance because X" is.
- **Non-CMVP cryptography slipping in.** Modules drift to *Historical* status on the CMVP list without a code change in the system. Verify each module against the active list at generation time, not the list that was current at procurement.
- **Missing the Vulnerable Suppliers screen.** The *Direction on Vulnerable Suppliers* attaches to sub-processors and telecommunications equipment, not just the prime contractor. A clean prime with a flagged sub-processor is still flagged.
- **Categorisation that does not match the PIA.** Personal-information sensitivity in the PIA must reconcile with the Confidentiality score in the ITSG-33 categorisation. Divergence is a finding by inspection.
- **Continuous monitoring as a sign-off, not an operating mode.** Authorisation is conditional on the monitoring plan actually running. List the tooling, the cadence, and the role accountable for the evidence — otherwise the authorisation is brittle.

---

## Handoffs

- **`ca-cloud-residency`** — The system-level categorisation and the chosen control profile are direct inputs to the sovereign cloud residency assessment. Cloud-hosted Protected B and above attracts a tighter residency envelope under the TBS *Direction on the Secure Use of Commercial Cloud Services*.
- **`risk`** — Residual security risks from the SoA (Compensating Controls with residual risk, supplier flags with mitigation in place, cryptographic-module gaps awaiting resolution) flow into the operational risk register. Carry the same risk IDs forward so the residual posture is traceable.
- **`adr`** — Material control tailoring decisions, compensating-control choices, and supplier-of-concern accommodations warrant Architecture Decision Records. The SoA captures the decision; the ADR captures the architectural rationale and the alternatives considered.

---

## Statutory currency

ITSG-33 itself is comparatively stable but the surrounding TBS guidance moves: the *Direction on the Secure Use of Commercial Cloud Services* and the *Direction on Vulnerable Suppliers* both update on TBS cycles, and the CMVP active-modules list churns continuously. Cite the current versions of TBS guidance and verify each cryptographic module against the live CMVP list at the time of generation. Record the verification date in the Document Register so a reviewer can audit currency.
