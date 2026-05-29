# Voltiq Analytics — Customer Flow-down Requirements (extract)

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** Illustrative summary of the kinds of contractual requirements SOCI-covered energy customers place on a supplier like Voltiq. Not real contract terms. See `../REFERENCES_AND_METHODOLOGY.md`.

This document captures the security/compliance obligations Voltiq's energy-sector customers push **down** the supply chain — the reason a non-SOCI entity still has to engage seriously with AESCSF and SOCI concepts.

## From DNSP / retailer customers (SOCI-covered)

| Requirement | Source | What it means for Voltiq |
|-------------|--------|--------------------------|
| AESCSF supplier alignment | Customer's CIRMP cyber chapter (AESCSF EDM domain) | Voltiq must evidence a supplier-scoped AESCSF position |
| Security attestation | Customer procurement | SOC 2 Type II / ISO 27001 / IRAP increasingly required |
| Incident notification | Customer's SOCI 12/72-hr obligations | Voltiq must notify customers of incidents **fast enough** for them to meet their own clocks |
| Data handling & residency | Privacy Act + customer policy | Australian data residency; APP-aligned handling of DER/NMI data |
| Sensitive-supplier provisions | SOCI supplier-influence provisions | Customer may assess Voltiq as a sensitive supplier (it touches DOE/constraint data) |
| Access governance | Customer security policy | Brokered, logged, time-boxed access to any customer-adjacent systems |
| Sub-processor disclosure | Customer DPA | Voltiq must disclose Azure regions + sub-SaaS (fourth-party risk) |
| Right to audit | Customer contract | Customer may audit Voltiq's controls |

## Why this matters to the recipe

A naive run might say "supplier is not SOCI-covered, nothing to do." The correct, useful output is: **not a covered entity, AND here are the flow-down + sensitive-supplier obligations it must satisfy to keep selling to covered entities.** This document gives the recipe the hooks to produce that nuanced result.

*(Synthetic test-fixture document.)*
