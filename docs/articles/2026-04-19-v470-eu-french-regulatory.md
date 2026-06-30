# ArcKit v4.7: 18 EU and French Regulatory Commands, Community-Maintained

ArcKit has always worn its UK government heritage openly. The Technology Code of Practice, the Service Standard, NCSC's Cyber Assessment Framework, the Orange and Green Books, JSP 936 for defence AI, the Digital Marketplace for procurement — these are the spine of the toolkit. For an architect working inside a UK department or for a vendor selling into one, that focus is exactly the point.

For everyone else, it has been a barrier.

Earlier this year an architect on the continent opened [issue #304](https://github.com/tractorjuice/arc-kit/issues/304): "this architecture approach is doing exactly what I was looking for, congratulations! Since I am sitting on the continent I wonder whether you'd be planning having a non UK specific version." The attached analysis was uncomfortable reading. Of the toolkit's 68 commands, 13 were UK-only, 8 were UK-heavy, and another 12 had UK references baked into otherwise generic commands. Roughly half the toolkit assumed Whitehall.

The v4.7 release, shipped today, closes part of that gap. It adds 18 community-contributed commands covering EU regulations and French government compliance — the first non-UK jurisdiction overlay to land in the toolkit. The pattern it establishes is the more important contribution.

## What's in the Release

The seven EU commands cover the regulatory baseline that applies across all member states and the EEA:

- `eu-rgpd` for GDPR compliance assessment, member-state-neutral, covering legal basis under Article 6, special category data under Article 9, the EDPB nine-criteria DPIA screening, and Schrems II requirements for international transfers
- `eu-nis2` for NIS2 Directive scoping under Annex I and II, the ten Article 21 minimum security measures, and the four-stage incident reporting timeline of 24 hours, 72 hours, on request, and one month
- `eu-ai-act` for risk classification under Regulation 2024/1689, covering prohibited practices in Article 5, the high-risk Annex III categories, GPAI obligations under Articles 53 to 55, and the staged application timeline through August 2026 and December 2027
- `eu-dora` for the Digital Operational Resilience Act, covering ICT third-party register requirements, threat-led penetration testing, and the four-hour initial incident reporting window for significant entities
- `eu-cra` for the Cyber Resilience Act, covering products with digital elements, the Annex I essential requirements, SBOM generation in SPDX or CycloneDX format, and CE marking
- `eu-dsa` for the Digital Services Act, distinguishing intermediaries from hosting from online platforms from very large online platforms above 45 million monthly EU users
- `eu-data-act` for the Data Act, covering connected products, B2B FRAND data sharing terms, cloud switching obligations under Chapter VI, and the international transfer restrictions of Article 27

The eleven French commands sit on top of the EU baseline. Several are SecNumCloud, ANSSI, and CNIL specific where French practice differs from the EU floor:

- `fr-secnumcloud` for ANSSI's SecNumCloud 3.2 cloud qualification scheme, with provider matrices for S3NS, Outscale, OVHcloud, Bleu, NumSpot, and Cloud Temple, and explicit treatment of FISA Section 702 residual risk for US-lineage providers
- `fr-rgpd` adds the CNIL-specific layer on top of `eu-rgpd`: the Délibération 2020-091 cookie rules, HDS certification for health data, the French age of digital consent at 15 rather than the GDPR default of 16, CNIL référentiels, and the Matomo-versus-Google-Analytics enforcement pattern
- `fr-ebios` runs the five-workshop EBIOS Risk Manager methodology that ANSSI publishes, producing strategic and operational risk scenarios with MITRE ATT&CK mapping and a homologation recommendation
- `fr-anssi` assesses the 42 measures of the Guide d'hygiène informatique and ANSSI's cloud security recommendations
- `fr-anssi-carto` produces an information system cartography across the four reading levels ANSSI defines: business, application, system, and network
- `fr-pssi` generates an Information System Security Policy in the form French organisations expect, drawing on RGS and ANSSI references
- `fr-dr` covers Diffusion Restreinte handling under Instruction Interministérielle 901 from SGDSN/ANSSI: marking, storage, transmission, and destruction rules
- `fr-marche-public` handles French public procurement under the code de la commande publique, with UGAP catalogue alignment, the threshold tiers at 40,000 euros and 215,000 euros, and the sovereignty clauses that have to be present
- `fr-dinum` assesses the five DINUM référentiels — RGI, RGAA, RGESN, RGS, and the doctrine cloud de l'État — plus FranceConnect and DSFR applicability for citizen-facing services
- `fr-algorithme-public` produces the public algorithm transparency notice required by Article L311-3-1 of the Code des relations entre le public et l'administration, the Loi République Numérique transparency obligation
- `fr-code-reuse` runs the build-versus-reuse decision matrix against code.gouv.fr, the SILL, and EUPL-licensed European public code repositories before procurement starts

Together these eighteen commands plug the most visible gap for architects working in EU public sector or French regulated industries. Like every other ArcKit command they read templates, integrate with the project context hook, write versioned ARC artefacts to the project directory, and chain to other commands through the handoffs schema. `fr-rgpd` cleanly extends `eu-rgpd`. `fr-pssi` references `eu-nis2`. `fr-secnumcloud` integrates with the existing `arckit.research` and `arckit.evaluate` procurement workflows.

## Marked as Community, Not Official

The 68 commands ArcKit has shipped to date are officially maintained, regression tested across 47 reference repositories, and held to the quality bar that the maintainer sets. The 18 new commands are not in that tier yet. They were contributed by [Thomas Jardinet](https://github.com/thomas-jardinet), an architect with deep French public sector experience, and they need to be validated against the current text of every regulation they cite.

Rather than letting that distinction get lost, the release marks it explicitly at three layers.

In `/help` listings, every community command shows a `[COMMUNITY]` prefix on its description. A user typing `/help` in Claude Code, Gemini CLI, or any of the other supported AI assistants sees `[COMMUNITY] Generate GDPR (EU 2016/679) compliance assessment...` rather than just the description. The provenance is visible at the moment of choice.

When a user invokes a community command, a warning banner renders before the prompt body executes:

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

The templates carry the same signal in their Document Control header: `Template Origin: Community` rather than the `Official` value the maintained set uses. This propagates into every artefact the commands generate, so a generated SecNumCloud assessment or EBIOS study carries its provenance into the document control table where reviewers will see it.

The aim is not to discourage use. It is to set the expectation: this is a starting point that a qualified DPO or RSSI should validate before it goes anywhere near a real procurement or homologation decision. Regulatory text moves; community maintenance can lag; the warning sets the right reading frame.

## Domain Maintainership Through CODEOWNERS

The release also establishes a pattern for how community-contributed jurisdictions are maintained going forward. A new `.github/CODEOWNERS` file marks Thomas as the domain owner for the `eu-*` and `fr-*` paths:

```
*                                              @tractorjuice
arckit-claude/commands/eu-*.md                 @thomas-jardinet @tractorjuice
arckit-claude/commands/fr-*.md                 @thomas-jardinet @tractorjuice
arckit-claude/templates/eu-*-template.md       @thomas-jardinet @tractorjuice
arckit-claude/templates/fr-*-template.md       @thomas-jardinet @tractorjuice
.arckit/templates/eu-*-template.md             @thomas-jardinet @tractorjuice
.arckit/templates/fr-*-template.md             @thomas-jardinet @tractorjuice
```

When anyone opens a PR that touches one of those paths, GitHub auto-requests review from Thomas. He sees the change before it merges, can flag a regulatory citation that has shifted, and stays in the loop on the maintenance trajectory of his contribution. The repo owner remains the final approver via the default `*` rule. Thomas is not in the merge path; he is in the review path.

This is the lightweight version of the pattern. It does not require a governance committee, a contributor agreement, or a separate maintainer council. It uses GitHub's native CODEOWNERS mechanism to encode "ask the person who knows" into the workflow. For a toolkit that wants to grow jurisdiction coverage without centralising the regulatory expertise the maintainer doesn't have, this is the right shape.

## A Hook Layer Lesson

Two follow-up patches landed on the same day as v4.7.0 and they are worth describing because they reflect a genuine architectural lesson.

The first, in v4.7.0 itself, fixed a subtle hook compatibility issue. ArcKit's `validate-arc-filename` PreToolUse hook intercepts every Write call targeting an ARC artefact and validates the type code against a registry. Type codes like `REQ` for requirements, `RISK` for the risk register, and `ADR` for architecture decisions are registered in `arckit-claude/config/doc-types.mjs`, the single source of truth that every ArcKit hook imports. If a Write call uses a type code that is not in the registry, the hook exits with code 2 and blocks the operation.

The eighteen new commands needed eighteen new type codes: `RGPD`, `NIS2`, `AIACT`, `DORA`, `CRA`, `DSA`, `DATAACT`, `CNIL`, `SECNUM`, `MARPUB`, `DINUM`, `EBIOS`, `ANSSI`, `CARTO`, `DR`, `ALGO`, `PSSI`, `REUSE`. Without registration, every Write call from a community command would have been blocked at the hook layer with `ArcKit: Unknown document type code 'RGPD'. Valid codes: ...`. The commands would have appeared to work — they would parse, they would render — and then the hook would silently refuse the file write. The fix was simple: register all eighteen in `doc-types.mjs` with their display names and categories. All six other ArcKit hooks that import from that registry pick up the new types automatically.

The second patch, v4.7.1 thirty minutes later, fixed a related issue in the `/arckit.pages` dashboard generator. The hooks were correct, the manifest was correct, but the AI prompt that renders the dashboard had its own hardcoded "Only include these known artifact types" allow-list at `arckit-claude/commands/pages.md:198`. None of the eighteen new types were in that list, so the dashboard silently omitted any community-generated artefact even though the underlying manifest had the entries. The fix was again straightforward, but the lesson is more interesting: ArcKit currently maintains two parallel type registries, one in TypeScript-flavoured ESM that the hooks read, one as a markdown table that the AI prompt reads, and they have to be updated together. A prominent comment now warns about the dual registration; longer term the prompt should read from the canonical registry.

For anyone building extensible AI tooling: have one source of truth for type codes, and treat the AI prompt as a consumer of that source rather than a duplicate.

## A Pattern for Other Jurisdictions

The most useful thing about this release is not the eighteen commands themselves. It is the pattern they establish for everyone else.

The framework is now demonstrated for non-UK contributions: pick a country code prefix (`at-` for Austria, `de-` for Germany, `es-` for Spain), write commands that handoff to the `eu-*` baseline rather than duplicating it, register your type codes in both `doc-types.mjs` and `pages.md`, add a CODEOWNERS line for your prefix pointing to your handle, ship with `[COMMUNITY]` provenance markings, and PR.

Issue #304's analysis identified the candidates: BSI IT-Grundschutz and the Vergabeverordnung for Germany; ENS and the Ley de Contratos del Sector Público for Spain; Italy's AgID guidelines and the Codice dei contratti pubblici; the Dutch BIO and Aanbestedingswet; the Nordic equivalents. Each needs a domain-expert contributor willing to take the maintainer role, a handful of jurisdiction-specific commands, and the willingness to keep them current as regulations shift.

The pattern is not theoretical anymore. There is a worked example to copy.

## How to Use

For users on the existing ArcKit Claude Code plugin, the v4.7.1 update arrives through the marketplace. Run `claude plugin update` and the eighteen new commands appear in `/help` with their `[COMMUNITY]` prefix. The Gemini CLI extension users get the same through `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands through their respective extension repositories or through `arckit init`.

The full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v4.7.1](https://github.com/tractorjuice/arc-kit/releases/tag/v4.7.1). The README's [EU & French Regulatory Compliance section](https://github.com/tractorjuice/arc-kit/blob/main/README.md#eu--french-regulatory-compliance-community) lists every command with a one-line summary. The contributor card for Thomas is on the [contributors page](https://arckit.org/contributors.html).

For domain experts in other jurisdictions: the doors are open, the pattern is established, and the maintainer review path is set up. If you have the regulatory expertise to validate citations and the willingness to keep them current, [open an issue](https://github.com/tractorjuice/arc-kit/issues/new) with the country code you want to claim and the commands you'd add. Eighteen commands have just shown how it works.

<!-- arckit:related-articles -->
## Related Articles

- [What You Can Now Do in Austria with ArcKit v4.8](article-viewer.html?a=2026-04-20-v480-austrian-overlay)
- [ArcKit v4.10: 12 UAE Federal Commands, Community Overlay](article-viewer.html?a=2026-04-30-uae-overlay-launch)
- [ArcKit v5.1: 10 US Federal Civilian Commands, Community Overlay](article-viewer.html?a=2026-05-24-v510-us-federal-civilian-overlay)
- [Wanted: /arckit:build Recipes for Your Jurisdiction](article-viewer.html?a=2026-05-03-community-recipes-wanted)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
