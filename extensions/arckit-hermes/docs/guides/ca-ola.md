# Canada Official Languages Act Review Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-ola` generates an Official Languages Act review for a federal digital service. It builds a service surface inventory across every user-facing channel, scores Parts IV (services), V (language of work), and VI (federal language obligations) of the *Official Languages Act* (R.S.C., 1985, c. 31 (4th Supp.)), captures the active-offer mechanism per surface, runs an equivalent-quality assessment to surface "translation lag" risk, documents the Translation Bureau pipeline, and acknowledges OQLF *Charter of the French Language* considerations where the service has Quebec exposure.

The Act was substantively amended by *An Act for the Substantive Equality of Canada's Official Languages* (S.C. 2023, c. 15) — Bill C-13. The amendments expand the *Air Canada Public Participation Act*, sharpen federal-undertaking employer rules, and reinforce Part VII positive measures. Several provisions are still phasing in via Order in Council, so cite the consolidated post-2023 text and track outstanding commencements at every refresh. Treat this artefact as a delivery and governance gate — Part IV obligations attach to public-facing surfaces, Part V to internal tooling in designated bilingual regions, and Part VI to staffing impact wherever the system supports HR or staffing decisions.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, user populations, surfaces in scope |
| Service assessment (`ARC-<id>-SAS-v1.0.md`) | Bilingualism evidence and active-offer posture |
| FITAA assessment (`ARC-<id>-FITAA-v1.0.md`) | Any public register triggers Part IV bilingual obligations |

---

## Command

```bash
/arckit:ca-ola <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-OLA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | OLA posture across Parts IV/V/VI, active-offer mechanism, top remediation actions |
| Service Description | Service, owner, audience, lifecycle stage, bilingual designation basis |
| Service Surface Inventory | Every user-facing surface with language posture, audience, channel, and active-offer mechanism |
| Part IV — Communications and Services | Bilingual obligation rationale, active offer, bilingual capacity, status |
| Part V — Language of Work | Tool / system per region, designated language posture, supervision language |
| Part VI — Federal Language Obligations | Equitable participation, non-discrimination, staffing, career development |
| Equivalent Quality Assessment | Content depth, usability, response time, release cadence per surface |
| Translation Pipeline | Lead time, cadence, owner, release-gate per content class |
| OQLF Acknowledgement | Quebec exposure, OQLF consideration, federal supremacy note |
| Risk and Mitigation Register | Complaint exposure, court remedies under Part X, reputational risk |
| Open Items | Outstanding decisions, deferred remediations, owners, review dates |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- Pre-launch — before go-live for any new federal digital service that has public-facing surfaces or internal tooling in a designated bilingual region.
- Pre-major-release — any substantive change to surfaces, content models, IVR scripts, or release cadence.
- New region of operation — when the service starts operating in a designated bilingual region or in Quebec, where OQLF acknowledgement attaches.
- Quarterly governance review — refresh the active-offer evidence and the Translation Bureau lead times so the pipeline remains predictable.

---

## Common pitfalls

- **Passive signage as active offer.** A bilingual sign on the wall is not active offer. The greeting, the screen, the IVR opening, and the written initiation must all extend the offer before the user has to ask. Active offer is a verb.
- **"Translation lag" releases.** Shipping the English version first and promising the French version "soon" violates the OLA. Equal quality means release-gating in both languages — same content depth, same usability, same response times, same release cadence.
- **Part V invisibility for internal tooling.** Public-facing surfaces dominate the conversation, but Part V obligations attach to internal tools in designated bilingual regions and to the language of supervision. Audit the back office, not only the storefront.
- **Missing OQLF acknowledgement for Quebec-located services.** OQLF does not bind federal entities, but it does bind their Quebec-based suppliers. Document the parallel obligation in the supplier brief; do not assume federal supremacy makes the OQLF question disappear.
- **Treating Bill C-13 as fully in force.** The substantive-equality amendments include provisions still phasing in via Order in Council. Cite the consolidated post-2023 text and track the commencement schedule at every refresh.

---

## Handoffs

- **`ca-gc-digital-standards`** — OLA service equivalence is a baseline expectation under the GC Digital Standards conformance scorecard. Cross-link the Part IV active-offer evidence and the equivalent-quality assessment into the digital-standards artefact so the two regimes share evidence rather than duplicating it.
- **`service-assessment`** — The OLA review feeds the service assessment evidence base for bilingualism and active offer. The same surface inventory and active-offer mechanism populate the GDS-style assessment for the user-research and accessibility points; carry the per-surface posture forward.

---

## Statutory currency

Bill C-13 (2023) commencements are still phasing in via Order in Council, so cite the consolidated post-2023 text of the *Official Languages Act* and record any provisions not yet in force at the verification date in the Document Register. The Commissioner of Official Languages publishes operational guidance regularly and adjusts complaint patterns in response — refresh the OLA review on every substantive surface change, and at every quarterly governance review cycle. The OQLF *Charter of the French Language* evolves independently of federal law; track Quebec-side amendments where the service has Quebec exposure even though the federal entity is not directly bound.
