# US FIPS 199 System Categorization

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-fisma-categorization` produces a FIPS Publication 199 security categorization for a federal civilian information system. It walks the system's information types (using NIST SP 800-60 Vol 2 Rev 1 as the catalogue), assigns provisional impact levels (Low / Moderate / High) to each of the CIA objectives, then applies the high-water mark to derive the overall system categorization.

The categorization is the **anchor artefact for FISMA compliance** — it determines the NIST SP 800-53 baseline (Low / Moderate / High), drives FedRAMP impact-level selection, and informs the rigour of every downstream control, assessment, and authorization activity. Without a defensible categorization, no Authority to Operate (ATO) package can be assembled.

Reviewed by the Information System Security Officer (ISSO), the System Owner, and ratified by the Authorizing Official (AO) or their designated representative. Agency CIO / CISO sign-off may be required for High-impact systems.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | System description, data requirements (DR-*), security NFRs (NFR-SEC-*) |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Agency security posture, data-handling principles |

---

## Output

- **Doc-type**: `FIPS199`
- **Filename**: `ARC-<PID>-FIPS199-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Enumerate information types stored, processed, or transmitted by the system.
2. Map each information type to a NIST SP 800-60 Vol 2 Rev 1 entry; capture provisional CIA impact.
3. Adjust provisional impacts per the agency-specific overlay (mission criticality, legal obligations, special factors).
4. Apply the high-water mark across all information types to derive system categorization.
5. Document rationale, dissenting opinions, and the AO concurrence path.

---

## Regulatory Anchors

- **FIPS Publication 199** — <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.199.pdf>
- **NIST SP 800-60 Vol 2 Rev 1** — <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-60v2r1.pdf>
- **FISMA Modernization Act of 2014** (44 U.S.C. §3551 et seq.)

---

## Example Usage

```bash
/arckit:us-fisma-categorization 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Confusing impact level with risk level.** FIPS 199 categorizes the *potential impact* of a compromise; it is not a risk score. Risk treatment lives in `/arckit:risk`.
- **Over-categorising at High when Moderate suffices.** High impact triggers a substantially heavier control baseline. Use the high-water mark, but resist the urge to round up "for safety" — document the rationale per information type.
- **Ignoring agency-specific overlays.** Many agencies (DOJ, HHS, ED, Treasury) publish overlays that adjust provisional impacts. Failing to apply these is a finding waiting to happen.
- **Missing PII or CUI-specific adjustments.** PII typically drives confidentiality up; CUI categorisation rules add a further floor.

---

## Handoffs

- **`us-nist-800-53`** — categorization sets the tailored control baseline (Low / Moderate / High)
- **`us-privacy-pia`** — PII categorisation feeds the PIA scope
- **`risk`** — categorization rationale informs the risk register's confidentiality / integrity / availability columns
