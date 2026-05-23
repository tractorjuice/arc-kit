# US ICAM Architecture

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-icam` generates an Identity, Credential, and Access Management (ICAM) architecture artefact for a federal civilian system, aligned to OMB M-19-17 and the GSA IDmanagement.gov ICAM reference. It documents identity sources, Identity Assurance Level / Authenticator Assurance Level / Federation Assurance Level (IAL/AAL/FAL) selections per NIST SP 800-63-3, federal employee/contractor PIV usage (FIPS 201-3), public-facing identity via login.gov, and the lifecycle for credential issuance, recovery, suspension, and revocation.

ICAM is the load-bearing layer for both **Zero Trust** (CISA ZTMM Identity pillar) and **FedRAMP** (AC/IA control families). Misaligned assurance levels are a top finding pattern: too high (IAL3 for low-risk identity) burns user goodwill and budget; too low (AAL1 for sensitive transactions) is a control gap that flows into the SSP and POA&M.

Reviewed by the ISSO, System Owner, the agency ICAM lead (where one exists), and Privacy Office (IAL drives PII handling decisions).

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| FIPS 199 Categorization (`ARC-<id>-FIPS199-v1.0.md`) | Impact drives the floor for IAL/AAL/FAL |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | User populations, transactions, integration points |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Reuse / shared-service posture |

---

## Output

- **Doc-type**: `ICAM`
- **Filename**: `ARC-<PID>-ICAM-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Inventory user populations (federal employees, contractors, citizens, business partners, system accounts).
2. Apply the SP 800-63-3 risk assessment per transaction to select IAL / AAL / FAL.
3. Map populations to credentials — PIV for federal employees, login.gov for public, agency-issued for partners.
4. Document lifecycle — provisioning source, recertification, JIT vs. standing, recovery, suspension, revocation.
5. Capture federation patterns, attribute release, and downstream RP integration.

---

## Regulatory Anchors

- **OMB M-19-17** — <https://www.whitehouse.gov/wp-content/uploads/2019/05/M-19-17.pdf>
- **NIST SP 800-63-3 (A / B / C)** — <https://pages.nist.gov/800-63-3/>
- **FIPS 201-3** — <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.201-3.pdf>
- **login.gov developer documentation** — <https://developers.login.gov/>

---

## Example Usage

```bash
/arckit:us-icam 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Misaligning IAL/AAL/FAL choices.** IAL3 (in-person proofing) for a low-risk citizen account is over-engineering; AAL1 for a Moderate-impact transaction is under-control. Run the SP 800-63-3 risk assessment per transaction.
- **Ignoring PIV for federal employees.** HSPD-12 requires PIV; AAL3 for federal employees is the default unless a documented derived credential is in place.
- **Under-using login.gov for public services.** login.gov already meets IAL2/AAL2 and reduces credential proliferation across agencies. Rolling your own public identity service warrants an ADR.
- **Treating federation as plumbing.** FAL choices drive PII attribute release, log retention, and incident response scope — these need ICAM-level decisions, not just an IdP config flag.

---

## Handoffs

- **`us-zero-trust`** — ICAM is the Identity pillar of CISA ZTMM
- **`us-privacy-pia`** — IAL choice and attribute release are PIA inputs
- **`adr`** — identity-provider choice (login.gov vs. agency vs. custom) is architecturally significant
