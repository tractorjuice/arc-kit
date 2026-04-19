---
description: '[COMMUNITY] Assess public code reuse opportunities before building from scratch — search code.gouv.fr, the SILL, and European public code repositories; produce a build-vs-reuse decision matrix'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect assess **public code reuse opportunities** before commissioning new development for a French public administration project. French administrations are required by the **Circulaire du Premier Ministre n°6264-SG (27 April 2021)** and the **Loi pour une République Numérique (2016, Art. 16)** to:

1. **Search for and reuse existing public code** before building from scratch
2. **Publish code developed for the administration** as open source (unless exceptions apply)
3. **Contribute improvements back upstream** when forking existing public code

The primary French public code resources are:

- **[code.gouv.fr](https://code.gouv.fr/sources/)**: Open source repositories published by French public administrations
- **[SILL](https://code.gouv.fr/sill/)** (Socle Interministériel de Logiciels Libres): DINUM-maintained list of recommended free and open source software for the French State

## User Input

```text
${input:topic:Enter project name or topic}
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: functional requirements (FR-xxx) describing what needs to be built, integration requirements (INT-xxx), technology constraints, build-or-buy decisions already made
  - If missing: warn that the reuse assessment requires defined functional requirements to identify candidate components

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: data architecture requirements that constrain component selection (storage type, data classification)
- **STKE** (Stakeholder Analysis) — Extract: technology preferences or constraints from stakeholders, procurement authority constraints
- **DINUM** (DINUM Assessment) — Extract: DINUM open source obligations already identified, SILL compliance requirements

**OPTIONAL** (read if available, skip silently):

- **PRIN** (Architecture Principles, 000-global) — Extract: open source preference principles, technology standards, approved stack constraints
- **MARPUB** (Procurement) — Extract: if a procurement is already planned, which components are being sourced vs built

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract any technology selection studies, ADRs, vendor assessments, or previous reuse decisions
- Read any **global policies** in `000-global/policies/` — extract open source policy, technology standardisation policy, data governance policy (affects which data can be processed by third-party open source components)

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract:

- All components or functional areas that need to be built or sourced
- Technology stack constraints (language, framework, deployment platform)
- Data classification constraints (e.g. cannot use components that send data to third parties for sensitive data)
- Any open source licence constraints (e.g. copyleft licences may not be compatible with project structure)

### Step 3: Code Reuse Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-code-reuse-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-code-reuse-template.md`

### Step 4: Reuse Assessment

#### Step 4a: Component Decomposition

Break down the system into discrete components that can each be assessed independently for reuse. For each component, assign a COMP-xx ID and note:

- Functional domain (identity, document management, API gateway, notification, payment, etc.)
- Technical complexity (high/medium/low)
- Data sensitivity (does this component handle sensitive or classified data?)
- Priority (must-have for MVP vs nice-to-have)

#### Step 4b: code.gouv.fr Assessment

For each COMP-xx, search [code.gouv.fr/sources](https://code.gouv.fr/sources/) for existing public administration code in the same domain. Assess each candidate repository:

1. **Relevance**: Does it address the same functional need?
2. **Maintenance**: When was the last commit? Are issues being addressed? Is there an active community?
3. **Documentation**: Is the code documented sufficiently for reuse?
4. **Test coverage**: Is there an automated test suite?
5. **Deployment**: Can it be deployed in the project's environment (containerised, cloud-native, on-premise)?
6. **Licence**: Is the licence compatible with the project's intended licence?
7. **Data handling**: Does the component send data to third-party services (analytics, error tracking)?
8. **Publisher credibility**: Is the publishing entity a reputable public administration, and is the code actively maintained?

Notable code.gouv.fr repositories to always consider by domain:

- **Identity/authentication**: check for FranceConnect integration components, Keycloak configurations published by ministries
- **Document management**: check for open source ECM or GED components published by DGFIP, MEF, or similar
- **API management**: check for API gateways and catalogue tools published by API.gouv.fr / DINUM
- **Forms/surveys**: Démarches Simplifiées components
- **Cartography/maps**: IGN and Geoportail open components

#### Step 4c: SILL Assessment

For each COMP-xx, check the [SILL](https://code.gouv.fr/sill/) for recommended software in the same category:

1. **SILL listing**: Is a relevant tool listed in the SILL?
2. **Status**: What is the SILL status (in use / recommended)?
3. **Referent ministry**: Which ministry is the referent — can they be contacted for implementation advice?
4. **Version**: Is the listed version current?
5. **Support**: Is commercial support available from a SILL-accredited provider?

The SILL is organised by category. Key categories to check: identity and access management, content management, databases, monitoring, collaboration, productivity, development tools, security.

#### Step 4d: European and International Public Code

For components with no French public code match, extend the search to:

- **Joinup (EU)**: [joinup.ec.europa.eu](https://joinup.ec.europa.eu) — EU institutions and member state public code
- **GitHub government organisations**: Other EU member state government organisations publishing relevant code
- **eGovernment core vocabularies**: Semantic interoperability components from data.europa.eu

#### Step 4e: Licence Compatibility Analysis

For each component selected for reuse, verify licence compatibility:

- **EUPL-1.2** is the recommended licence for French public code (Circulaire 2021)
- Assess compatibility between the candidate licence and the project's intended licence
- Flag any copyleft obligations (GPL, AGPL) that require publishing modifications
- Flag any patent-related clauses (Apache 2.0 patent grant vs GPL v2 patent silence)
- Identify components whose licences are incompatible and therefore cannot be used

#### Step 4f: Build-vs-Reuse Decision Matrix

For each component, produce a decision with justification:

- **Reuse as-is**: Component meets requirements without modification; integrate directly
- **Fork and adapt**: Component partially meets requirements; fork and adapt with a commitment to contribute improvements back
- **Assemble from SILL components**: No single component meets needs but SILL software can be assembled to cover requirements
- **Procure**: No suitable public code exists; proceed to procurement via `/arckit.fr-marche-public`
- **Build from scratch**: No existing solution; custom development required — document justification as required by Circulaire 2021

#### Step 4g: Contribution-Back Plan

For any component that is forked:

- Document planned improvements that will be contributed back upstream
- Identify the upstream repository and contribution process
- Note timeline for contribution (aligned with project delivery milestones)

#### Step 4h: Publication Obligation

Assess which code developed for this project must be published as open source:

- Code developed by or for a public administration must be published unless: national security, trade secrets, third-party intellectual property, or legal prohibition prevents publication
- Document exceptions with justification
- For publishable code: recommend publishing on code.gouv.fr via the DINUM publication process

### Step 5: Generate Code Reuse Assessment Document

**CRITICAL**: Use the **Write tool** to create the full assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-REUSE-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if additional components assessed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-REUSE-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: PUBLIC / OFFICIAL (reuse assessment is typically not sensitive)

3. Write the complete assessment following the template.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **REUSE** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-REUSE-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Public Code Reuse Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-REUSE-v{VERSION}.md
📋 Document ID: {document_id}
📅 Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Reuse Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Components assessed:    {N}
Reuse (as-is):          {N}
Fork and adapt:         {N}
SILL assembly:          {N}
Procure:                {N}
Build from scratch:     {N}

Estimated effort saved by reuse: {estimate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Publication Obligation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code to publish on code.gouv.fr: {Yes — N components / No / Partial}
{If exceptions: list with justification}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If procurement needed: Run /arckit.fr-marche-public for components requiring sourcing}
2. {If technology selection needed: Run /arckit.research for market alternatives}
3. Run /arckit.fr-dinum to verify alignment with DINUM open source doctrine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Legal obligation for public administrations**: The Circulaire PM n°6264-SG (2021) makes searching for and reusing public code a required step before commissioning new development. This is not optional. The reuse assessment is the evidence that this step was completed.
- **SILL is maintained by DINUM**: The SILL changes regularly as new software is added and removed. Always check the current version at code.gouv.fr/sill — do not rely on cached or printed versions.
- **code.gouv.fr is the publication destination**: When French public code must be published, code.gouv.fr is the centralised catalogue. Publication is coordinated through the DINUM mission logiciels libres.
- **Contribution-back is encouraged, not always mandatory**: The Circulaire encourages contributing improvements back upstream but does not make it legally mandatory in all cases. However, it is a strong recommendation and expected for OIV and major public IS projects.
- **EUPL-1.2 is the recommended licence**: When publishing code developed for a French public administration, the EUPL-1.2 licence is recommended by DINUM. It is compatible with most major open source licences.
- **Joinup for EU public code**: Beyond France, the EU Joinup platform catalogues public code from EU institutions and all member states. Consider it for components where no French equivalent exists.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| code.gouv.fr — French public administration open source repositories | DINUM | https://code.gouv.fr/sources/ |
| SILL (Socle Interministériel de Logiciels Libres) — recommended open source software for the French State | DINUM | https://code.gouv.fr/sill/ |
| Circulaire PM n°6264-SG (2021) — open source obligation for public administrations | DINUM | https://www.numerique.gouv.fr/publications/politique-logiciel-libre/ |
| Loi République Numérique Art. 16 — code publication obligation | Légifrance | https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033202746 |
| EUPL-1.2 licence — recommended for French public code | Joinup / EC | https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12 |
| Joinup — EU public code catalogue | European Commission | https://joinup.ec.europa.eu/ |
| DINUM mission logiciels libres | DINUM | https://code.gouv.fr/ |

> **Note for reviewers**: French public administrations are legally required to search for existing open source code before commissioning new development (Circulaire 2021), and to publish code developed for them as open source unless exceptions apply (Loi République Numérique 2016). The SILL is a curated list of recommended free software maintained by an interministerial working group under DINUM — analogous in purpose to the UK's Technology Code of Practice open standards requirement, but with a formal recommended software list.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-REUSE-v{VERSION}.md`
- ✅ All components decomposed and assigned COMP-xx IDs
- ✅ code.gouv.fr searched for each component with results documented
- ✅ SILL checked for each functional domain with results documented
- ✅ European/international public code checked for components with no French match
- ✅ Licence compatibility assessed for all candidate components
- ✅ Build-vs-reuse decision made with justification for each component
- ✅ Contribution-back plan documented for forked components
- ✅ Publication obligation assessed (which project code must be published on code.gouv.fr)
- ✅ Reused components register populated (source, version, licence, integration method)
- ✅ REUSE per-type quality checks passed

## Example Usage

```text
/arckit.fr-code-reuse Assess reuse opportunities for a French ministry citizen portal — needs: identity/authentication, document management, notification service, content management, API gateway

/arckit.fr-code-reuse Code reuse assessment for 001 — DINUM digital services platform, check code.gouv.fr and SILL for dashboard, forms, and data visualisation components

/arckit.fr-code-reuse Reuse assessment for a French regional council digital services platform — citizen portal, internal workflow engine, GIS mapping, document signing
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-fr-marche-public` -- If no reusable code found, generate procurement documentation to source the component *(when Build-vs-reuse decision concludes that procurement is required for one or more components)*
- `/arckit-research` -- Research commercial and open source market alternatives for components with no public code match *(when No public code reuse candidate found and a technology selection decision is needed)*
- `/arckit-fr-dinum` -- Align code reuse and open source decisions with DINUM doctrine obligations *(when Project is a French public administration IS subject to DINUM circulaire on open source)*
