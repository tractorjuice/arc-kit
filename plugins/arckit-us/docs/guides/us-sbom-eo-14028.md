# US EO 14028 Secure-Software Self-Attestation + SBOM

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-sbom-eo-14028` produces the dual artefact required under Executive Order 14028 and OMB M-22-18 / M-23-16: (1) the CISA Secure Software Development Attestation Form completion, and (2) the Software Bill of Materials (SBOM) covering the agency-acquired software. The artefact aligns to **NIST SP 800-218 (SSDF)** for the secure-development practices being attested to, and to the **NTIA Minimum Elements for an SBOM** for the SBOM payload.

This is the **software supply-chain evidence artefact**. Agencies cannot use a vendor's software for federal use without the vendor having attested to SSDF conformance; SBOM is required as supporting evidence at the agency's discretion (and increasingly as a hard requirement). Weak provenance attestations are a finding pattern that ripples through every downstream contract.

Reviewed by the agency software supply-chain security function, the System Owner, the procurement / contracts team, and (for the attestation form) the vendor's senior executive who signs the attestation.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Tailored Control Set (`ARC-<id>-NIST-v1.0.md`) | SR (Supply Chain Risk Management) family cross-reference |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Software components in scope, integration points |

---

## Output

- **Doc-type**: `SBOM`
- **Filename**: `ARC-<PID>-SBOM-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Inventory the software components in scope (vendor product + dependencies).
2. Complete the CISA Secure Software Development Attestation Form for each in-scope product line.
3. Generate the SBOM in a single agreed format (CycloneDX or SPDX — pick one, do not mix).
4. Verify the SBOM minimum elements per NTIA guidance — supplier name, component name, version, unique identifier, dependency relationship, author of SBOM data, timestamp.
5. Sign provenance attestations; the verifier (agency or downstream consumer) must validate signatures.

---

## Regulatory Anchors

- **EO 14028** — <https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity>
- **OMB M-22-18** — <https://www.whitehouse.gov/wp-content/uploads/2022/09/M-22-18.pdf>
- **OMB M-23-16** — <https://www.whitehouse.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security-.pdf>
- **CISA Secure Software Development Attestation Form** — <https://www.cisa.gov/secure-software-attestation-form>
- **NTIA Minimum Elements for an SBOM** — <https://www.ntia.doc.gov/files/ntia/publications/sbom_minimum_elements_report.pdf>
- **NIST SP 800-218 (SSDF)** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf>

---

## Example Usage

```bash
/arckit:us-sbom-eo-14028 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Incomplete SBOM minimum elements.** Missing any of the seven NTIA minimum elements invalidates the SBOM. Verify before publishing.
- **Mixing CycloneDX and SPDX.** Pick one format and stay with it; downstream tooling does not seamlessly merge the two.
- **Weak provenance attestations.** "We follow secure development practices" is not an attestation; the CISA form has specific clauses to be signed by a senior executive.
- **Signing without verifying.** A signed SBOM whose signature is never validated by the consumer is theatre. Validate at acquisition and at every update.

---

## Handoffs

- **`us-nist-800-53`** — SR family controls cross-reference the attestation and SBOM
- **`adr`** — SBOM format choice (CycloneDX vs. SPDX) is architecturally significant
- **`risk`** — vulnerable components surfaced in the SBOM flow into the risk register
