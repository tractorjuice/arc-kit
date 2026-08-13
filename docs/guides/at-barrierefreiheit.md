# Austrian Accessibility (BaFG / WZG) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:at-barrierefreiheit` assesses Austrian digital accessibility obligations across the country's **two separate transposition tracks**, determines which apply, and produces a conformance assessment with a remediation roadmap.

- **BaFG** — *Bundesgesetz über Barrierefreiheitsanforderungen für Produkte und Dienstleistungen*, BGBl. I Nr. 76/2023, applicable since **28 June 2025**. Transposes Directive (EU) 2019/882, the **European Accessibility Act**. Binds manufacturers, importers, distributors and service providers.
- **WZG** — *Web-Zugänglichkeits-Gesetz*, BGBl. I Nr. 59/2019, in force **23 July 2019**. Transposes Directive (EU) 2016/2102. Binds federal public bodies for their websites and mobile applications.

An entity can be subject to both. A federal body running an in-scope e-commerce or banking service is the common case.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v*.md`) | NFR-UX targets and the user-facing functional scope |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | User groups, assistive-technology users, consumers vs citizens |
| Diagrams / HLD | The actual surfaces — web, mobile, kiosk, terminal, documents |
| AT procurement (`ARC-<id>-BVERGG-v*.md`) | Any accessibility clause already imposed on a supplier |
| Existing Barrierefreiheitserklärung (`external/`) | Current published conformance position |

---

## Command

```bash
/arckit:at-barrierefreiheit <project ID or entity/service description>
```

Output: `projects/<id>/ARC-<id>-ATBFR-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Applicability Determination | Each track decided independently, with reasoning; microenterprise exemption; Land-level routing |
| Standard and Conformance | EN 301 549 v3.2.1 → WCAG 2.1 AA per-criterion table, test method, non-web clauses |
| Barrierefreiheitserklärung | WZG track — the five required elements of the statutory statement |
| Product and Service Requirements | BaFG track — requirements mapping, conformity route, statutory defences |
| Market Surveillance and Monitoring | SMS versus FFG, with the exposures kept separate |
| Gap Analysis and Roadmap | Prioritised by user impact, with owners, dates and NFR-UX references |
| External References | BaFG, WZG, both Directives, EN 301 549, WCAG 2.1 |

---

## Which Track Applies

| Entity | Surface | Track |
|--------|---------|-------|
| Federal ministry | Citizen portal, mobile app | WZG |
| Land or municipal body | Any | **Neither** — the applicable Landesgesetz |
| Bank, retailer, telco | Consumer-facing service in Annex scope | BaFG |
| Terminal manufacturer or importer | Self-service terminal, e-reader | BaFG (products — no microenterprise exemption) |
| Federal body running an in-scope e-commerce service | Website plus that service | **Both**, assessed separately |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Requirements | Capture NFR-UX accessibility targets | `/arckit:requirements` |
| Applicability and conformance | Determine tracks, assess EN 301 549 | `/arckit:at-barrierefreiheit` |
| Remediation procurement | Carry the target into the tender | `/arckit:at-bvergg` |
| Feedback-channel privacy | Where the channel collects personal data | `/arckit:at-dsgvo` |
| Traceability | Link gaps back to requirements | `/arckit:traceability` |

---

## Review Checklist

- Both tracks determined independently, with the reasoning recorded rather than only the verdict.
- Microenterprise exemption applied to **services only**, never to products.
- Headcount and financial evidence for any claimed exemption recorded in the assessment.
- Land-level bodies routed to the Landesgesetz, not assessed under the federal WZG.
- Conformance assessed against EN 301 549 v3.2.1 / WCAG 2.1 AA; any use of 2.2 AA recorded as a deliberate forward-looking choice.
- Test method stated per criterion, distinguishing automated tooling from manual and assistive-technology testing.
- Accessibility statement assessed against all five required elements where WZG applies.
- CE marking applied to products only, never to services.
- Disproportionate burden and fundamental alteration claims backed by a retained, dated assessment.
- No fine regime asserted under the WZG.

---

## Common Gaps

- **Treating the microenterprise exemption as entity-wide.** § 6 BaFG exempts Kleinstunternehmen for the **services** they offer or provide. Products are not exempt at any size. A nine-person importer of ticketing terminals is fully in scope, and this is the single most common misreading of the act.
- **An exemption with nothing behind it.** The Sozialministeriumservice can require an entity claiming the exemption to produce its headcount and financial evidence. A tick-box claim with no figures on file is a gap.
- **Assuming the federal WZG covers everything public.** The Länder legislate separately. A Land hospital or a municipal portal is outside the federal act.
- **Importing the EUR 80,000 figure into a public-sector assessment.** That ceiling is BaFG. The WZG carries monitoring, complaints and publication — no administrative fines.
- **A statement that recites conformance and lists nothing.** The Barrierefreiheitserklärung must enumerate non-accessible content in three categories. A clean statement over a site that fails an automated scan is the fastest way to attract a complaint.
- **Automated scanning presented as conformance evidence.** A tool finds a minority of WCAG failures. Keyboard traps, focus order and meaningful alternative text need manual and assistive-technology testing.
- **CE marking a service.** Products take a declaration of conformity and CE marking; services take a published description and retained documentation.
- **Assessing emergency calls under the BaFG.** Notrufe are transposed through the TKG 2021.

---

## Key Notes

- **Standard version**: EN 301 549 **v3.2.1** is the version cited in the *Official Journal*, so it is what carries the presumption of conformity under both Directives, and it normatively references **WCAG 2.1 AA**. Draft v4.1.0 went to public review in November 2025; final **v4.1.1**, expected to carry WCAG 2.2 AA, is anticipated to be OJ-cited around **October 2026** `[NEEDS VERIFICATION]`. This matches the position `/arckit:at-bvergg` takes on §107 BVergG, and it differs from the UK, where SI 2022/1097 made the WCAG reference rolling and 2.2 AA is already the monitored target.
- **Paragraph references**: the BaFG § numbers used by this command (§ 3 Z 19 definition, § 6 exemption, § 21 surveillance, § 36 penalties) are drawn from secondary sources because RIS was unavailable at authoring time. Confirm against RIS before external reliance.
- **Scope of this command**: the entity's own products, services, websites and apps. Accessibility as a *procurement clause* (§107 BVergG) is `/arckit:at-bvergg`.
