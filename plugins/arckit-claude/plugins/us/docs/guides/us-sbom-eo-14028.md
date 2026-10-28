# US EO 14028 Secure-Software Self-Attestation + SBOM

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit-us:us-sbom-eo-14028` records the secure-software evidence a federal civilian agency asks of a software producer under Executive Order 14028 §4 and OMB M-26-05: (1) what the agency's software assurance policy and the contract require, (2) the CISA Secure Software Development Attestation Form, where the agency uses it, and (3) the Software Bill of Materials (SBOM). The secure-development practices are those of **NIST SP 800-218 (SSDF)**, and the SBOM is checked against CISA's **2026 Minimum Elements for a Software Bill of Materials**.

OMB M-26-05 (23 January 2026) rescinded M-22-18 and M-23-16, which had required agencies to collect a self-attestation from every software producer. Agencies must still keep a complete inventory of software and hardware and set software and hardware assurance policies that match their risk; they **may choose** to use the attestation form and **may choose** contract terms requiring a current SBOM on request (for a cloud platform, an SBOM of the runtime production environment). The FAR Council withdrew its secure-software attestation rule (FAR Case 2023-002) on 6 March 2026. So check the agency's policy and the contract before treating any item as required.

Reviewed by the agency software supply-chain security function, the System Owner, the procurement / contracts team, and (where the form is used) the vendor's senior executive who signs the attestation.

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

1. Record what the acquiring agency requires: the attestation form, an SBOM on request, a third-party assessment, a hardware bill of materials, or none of these.
2. Inventory the software components in scope (vendor product + dependencies).
3. Where the agency uses the form, check the form's scope and complete Sections I–III for each in-scope product line.
4. Generate the SBOM in a single agreed format (CycloneDX or SPDX — pick one, do not mix).
5. Check the SBOM against the CISA 2026 Minimum Elements: 17 data fields (including SBOM author signature, component hash and licence) and 6 practices and processes.
6. Sign provenance attestations; the verifier (agency or downstream consumer) must validate signatures.
7. Record any gap with its mitigations and a POA&M for the agency's decision.

---

## Regulatory Anchors

- **EO 14028** — <https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity>
- **OMB M-26-05** (23 January 2026) — <https://www.whitehouse.gov/wp-content/uploads/2026/01/M-26-05-Adopting-a-Risk-based-Approach-to-Software-and-Hardware-Security.pdf>
- **CISA Secure Software Development Attestation Form** (agency choice) — <https://www.cisa.gov/resources-tools/resources/secure-software-development-attestation-form>
- **CISA 2026 Minimum Elements for an SBOM** (replaces the NTIA 2021 elements) — <https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom>
- **NIST SP 800-218 (SSDF v1.1)** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf>
- **OMB M-22-18 and M-23-16** — rescinded by M-26-05; archived copies: <https://bidenwhitehouse.archives.gov/wp-content/uploads/2022/09/M-22-18.pdf>, <https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security.pdf>

---

## Example Usage

```bash
/arckit-us:us-sbom-eo-14028 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Treating the attestation as mandatory.** Since 23 January 2026 it is the agency's choice. Cite the agency policy or contract clause that requires it, or record that none does.
- **Incomplete SBOM minimum elements.** Check all 17 CISA 2026 data fields, and mark any value that is unknown or withheld rather than leaving it out.
- **Mixing CycloneDX and SPDX.** Pick one format and stay with it; downstream tooling does not seamlessly merge the two.
- **Weak attestations.** "We follow secure development practices" is not an attestation; the CISA form has specific items to be signed by the CEO or a designee who can bind the company.
- **Signing without verifying.** A signed SBOM whose signature is never validated by the consumer is theatre. Validate at acquisition and at every update.

---

## Handoffs

- **`us-nist-800-53`** — SR family controls cross-reference the attestation and SBOM
- **`adr`** — SBOM format choice (CycloneDX vs. SPDX) is architecturally significant
- **`risk`** — vulnerable components surfaced in the SBOM flow into the risk register
