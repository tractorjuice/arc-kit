# ArcKit Template Rendering Rules

When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command that reads the template MUST resolve the marker to the contents of one of the partials in this directory before writing the artefact to disk:

1. **Determine the artefact's regime.** Take the command's own `doc-type:` frontmatter value and find it in the **Regime index** below. This file is self-contained: everything needed to resolve the marker is in the tables here, and no other file needs to be read. In particular, do **not** try to read `config/doc-types.mjs` — it ships only with the core `arckit` plugin, and every community overlay (AT, AU, CA, UAE and the rest) has `templates/_partials/` but no `config/` directory, so the lookup would fail exactly where the regimes matter most.
   - **If the doc-type's regime hard-routes** (AT, AU, CA, FR, NL, UAE), use the partial named for it in the **Regime routing** table and skip step 2. Regime beats user config: a Canadian PIA uses the Canadian ladder whoever runs it.
   - **If the doc-type's regime falls through** (UK, MOD, EU, US), go to step 2. These regimes have no ladder of their own in this repository, so hard-routing them would override the user's own scheme; they behave exactly as they did before regime routing existed.
   - **If the doc-type is not in the regime index at all** — the jurisdiction-agnostic types, REQ, ADR, RISK, DATA and similar — go to step 2.
2. **Otherwise read the user's plugin userConfig** for `governance_framework` and `classification_scheme`:
   - `governance_framework: UAE Federal` OR `classification_scheme: UAE Smart Data` → `document-control-uae.md`
   - `governance_framework: AT Gov` OR `classification_scheme: AT InfoSiG` → `document-control-at.md`
   - otherwise → `document-control-uk.md`
3. **Inline the chosen partial's contents** at the marker location, applying the standard `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions.
4. **Remove the `<!-- DOC-CONTROL-HEADER -->` marker line and its descriptive comment** from the final output.
5. **Populate the UAE-specific fields** (Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier) from upstream artefacts where available, or leave the `[PENDING — ...]` placeholder for the architect to fill.
6. **For the AT partial**, set the `Classification` field from the InfoSiG ladder (Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim) — not the UK ladder. If `default_classification` holds a UK value, map it (PUBLIC → Offen, OFFICIAL → Eingeschränkt, OFFICIAL-SENSITIVE → Eingeschränkt or Vertraulich, SECRET → Geheim/Streng geheim).

The marker comment is informational only; it does not appear in any rendered artefact.

## Regime routing

Checked first, and taken from the artefact rather than from the user:

| Regime | Partial | Classification ladder | Routing |
|---|---|---|---|
| AT | `document-control-at.md` | Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim | hard-routes |
| AU | `document-control-au.md` | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | hard-routes |
| CA | `document-control-ca.md` | UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET | hard-routes |
| FR | `document-control-fr.md` | Non protégé / Diffusion Restreinte / Secret / Très Secret | hard-routes |
| NL | `document-control-nl.md` | Ongerubriceerd / Departementaal VERTROUWELIJK / Stg. CONFIDENTIEEL / Stg. GEHEIM / Stg. ZEER GEHEIM | hard-routes |
| UAE | `document-control-uae.md` | Open / Shared / Confidential / Secret / Top Secret | hard-routes |
| UK | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET | falls through to step 2 |
| MOD | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET | falls through to step 2 |
| EU | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET | falls through to step 2 |
| US | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET | falls through to step 2 — ladder deferred, no authoritative wording in-repo yet |

A regime that falls through resolves through the user-config table below, which lands on `document-control-uk.md` unless the user has set a UAE or AT scheme. The Partial column above therefore records the default outcome for those regimes, not an override.

## Regime index

The doc-type codes that carry a regime. A `doc-type:` value absent from this table has no regime and goes straight to step 2.

| Regime | Label | Routing | Doc-type codes |
|---|---|---|---|
| UK | UK Gov | falls through to step 2 | `TNDR`, `CMPT`, `TCOP`, `AIPB`, `ATRS`, `DPIA`, `SVCASS`, `SUPP`, `SVCD`, `SDD`, `DECL`, `PRIC`, `SECA`, `GCMP`, `GCRV`, `FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`, `NHSDTAC`, `NHSMDR` |
| MOD | MOD | falls through to step 2 | `SECD-MOD`, `JSP936` |
| AT | Austria | hard-routes | `ATBFR`, `ATDSG`, `ATNISG`, `BVERGG` |
| AU | Australia | hard-routes | `AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUOT`, `AUSOCI`, `AUAESCSF`, `AUENERGY`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP` |
| CA | Canada | hard-routes | `FITAA`, `PIA`, `ATIP`, `AIA`, `CHRT`, `ITSG`, `SOIA`, `CACR`, `DIGSTD`, `OLA`, `PROC`, `OCAP` |
| EU | EU | falls through to step 2 | `RGPD`, `NIS2`, `AIACT`, `DORA`, `CRA`, `DSA`, `DATAACT`, `EUCSF` |
| FR | France | hard-routes | `IRN`, `CNIL`, `SECNUM`, `MARPUB`, `DINUM`, `EBIOS`, `ANSSI`, `CARTO`, `DR`, `ALGO`, `PSSI`, `REUSE` |
| NL | Netherlands | hard-routes | `RBCLOUD`, `TBB`, `BIO2`, `NLEXIT` |
| UAE | UAE | hard-routes | `PDPL`, `IAS`, `CRES`, `CLAS`, `UPASS`, `ZBUR`, `DREC`, `DSHR`, `NPRA`, `AICH`, `AUTI`, `FPRO` |
| US | USA Federal | falls through to step 2 | `FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `USPIA`, `SBOM` |

## User config fallback

Reached from step 2 — by a doc-type with no regime, or by one whose regime falls through:

| User config | Partial |
|---|---|
| `classification_scheme: UAE Smart Data` OR `governance_framework: UAE Federal` | `document-control-uae.md` |
| `classification_scheme: AT InfoSiG` OR `governance_framework: AT Gov` (and not UAE) | `document-control-at.md` |
| otherwise (`UK Gov` / `Generic`, blank scheme) | `document-control-uk.md` |

Both tables above are generated from the doc-type registry and checked against it in CI by `scripts/tests/test-regime-registration.mjs`. Edit the registry, then bring these tables into line — not the other way round.
