# Voltiq Analytics — Engagement Scope (Supplier Cyber Posture)

**Prepared for:** Chief Technology Officer (synthetic role), Voltiq Analytics
**Author:** Synthetic assessment team | May 2026 | Public synthetic evaluation fixture

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** Fictional supplier; negative/non-SOCI case. See `../REFERENCES_AND_METHODOLOGY.md`.

## 1. Context

Voltiq's energy-sector customers — several of them SOCI-designated critical-asset operators — increasingly require evidence of AESCSF alignment and SOCI supply-chain posture before and during contracts. Voltiq needs a defensible, supplier-scoped position it can hand to procurement teams.

## 2. Objectives

- Establish whether SOCI Act obligations apply to Voltiq **as an entity** (expected: **no** — not a responsible entity for a designated critical asset).
- Document the **flow-down** and **sensitive-supplier** obligations Voltiq carries because of *who its customers are*.
- Produce a **supplier-scoped AESCSF** position (IT-only; OT overlay N/A) focused on Voltiq's exposure surface.
- Reconcile with the federal baseline (E8, ISM, Privacy/NDB) and the in-progress SOC 2.

## 3. Scope

**In scope:** Voltiq's multi-tenant Azure SaaS, client-data ingestion and DOE outputs, support remote-access paths, identity/access, open-source and subprocessor dependencies, privacy handling of client/customer data.

**Out of scope:** Any client's own network/OT estate; client CIRMPs (referenced only as the source of flow-down requirements).

## 4. The four lenses, applied to a supplier

- **SOCI / CIRMP (`au-soci-cirmp`):** expected outcome = **non-applicability statement** + flow-down + sensitive-supplier exposure. *This is the primary test of the recipe's graceful handling.*
- **AESCSF (`au-aescsf`):** supplier-scoped; **OT overlay explicitly N/A**; focus on tenant isolation, data handling, access, supply chain (OSS + subprocessors).
- **AER ring-fencing:** **N/A** (not a DNSP) — recipe should state this cleanly.
- **Federal baseline:** E8 / ISM / Privacy / NDB composition for a SaaS supplier.

## 5. Deliverables

- SOCI applicability determination (non-applicability statement + flow-down/sensitive-supplier note).
- Supplier-scoped AESCSF position (IT-only).
- Privacy & data-handling note (controller vs processor; APP exposure for DER/NMI data).
- Prioritised remediation (Quick Wins / Short / Medium).

*(Synthetic test-fixture document. Not a real engagement.)*
