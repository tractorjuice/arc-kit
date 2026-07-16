# NHS clinical-safety quality checklist

> Generation guidance for `/arckit:uk-nhs-dcb0129` and `/arckit:uk-nhs-dcb0160`
> (and, where relevant, DTAC clinical-safety sections).
> Verify these checks before writing the SAFETY.md file set.
> They supplement the common checks in `references/quality-checklist.md`.

(The three Marcus Baw SAFETY.md files carry no ARC- doc-type code; these checks apply to them and, where relevant, to DTAC clinical-safety evidence.)

- **Roles distinct** -- Manufacturer/supplier and deployer/use roles are clearly separated; operator, maintainer, and DUAA 2025 "relevant IT provider" status are explicit or marked pending.
- **No overclaiming** -- No unsupported "compliant", "approved", "safe", or "complete" claim; DRAFT/IN_REVIEW status is clear where CSO review is incomplete; CSO approval is never invented.
- **Hazards well-formed** -- Every hazard has a stable ID; cause and effect are separated; controls are linked by ID; residual risk is recorded or marked pending; any HIGH or unknown residual risk has a review/acceptance path.
- **Hazard coverage** -- Every hazard-archetype family (see `references/hazard-archetypes.md`) is represented or explicitly recorded as not applicable.
- **DUAA 2025 register** -- The "Applicable standards and assurance domains" table is present or consciously omitted; interoperability, portability, access, storage, and information-security interfaces are considered; adjacent-domain owners are named.
- **No stale references** -- No accidental present-tense reference to NHSX, superseded NHS Digital ownership, or a prior project name; deliberate attribution/provenance is preserved.

---

Design informed by Dr Marcus Baw's SAFETY.md review and DUAA2025 skill references (CC BY-SA 4.0), <https://github.com/pacharanero/SAFETY.md>
