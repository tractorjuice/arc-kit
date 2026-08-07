# ArcKit Template Rendering Rules

When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command that reads the template MUST resolve the marker to the contents of one of the partials in this directory before writing the artefact to disk:

1. **Determine the artefact's regime.** Read the command's own `doc-type:` frontmatter value, look it up in `config/doc-types.mjs`, and take its `regime` field.
   - **If the doc-type has a regime**, use `REGIME_PARTIALS[regime]` from the same file. This wins over user config: a Canadian PIA uses the Canadian ladder whoever runs it.
   - **If the doc-type has no regime** (the jurisdiction-agnostic types — REQ, ADR, RISK, DATA and similar), fall through to step 2.
2. **Otherwise read the user's plugin userConfig** for `governance_framework` and `classification_scheme`:
   - `governance_framework: UAE Federal` OR `classification_scheme: UAE Smart Data` → `document-control-uae.md`
   - `governance_framework: AT Gov` OR `classification_scheme: AT InfoSiG` → `document-control-at.md`
   - otherwise → `document-control-uk.md`
3. **Inline the chosen partial's contents** at the marker location, applying the standard `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions.
4. **Remove the `<!-- DOC-CONTROL-HEADER -->` marker line and its descriptive comment** from the final output.
5. **Populate the UAE-specific fields** (Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier) from upstream artefacts where available, or leave the `[PENDING — ...]` placeholder for the architect to fill.
6. **For the AT partial**, set the `Classification` field from the InfoSiG ladder (Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim) — not the UK ladder. If `default_classification` holds a UK value, map it (PUBLIC → Offen, OFFICIAL → Eingeschränkt, OFFICIAL-SENSITIVE → Eingeschränkt or Vertraulich, SECRET → Geheim/Streng geheim).

The marker comment is informational only; it does not appear in any rendered artefact.

## Quick reference

Regime routing is checked first and comes from the artefact, not the user:

| Regime | Partial | Classification ladder |
|---|---|---|
| UK, MOD, EU | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET |
| UAE | `document-control-uae.md` | Open / Shared / Confidential / Secret / Top Secret |
| AT | `document-control-at.md` | Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim |
| CA | `document-control-ca.md` | UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET |
| AU | `document-control-au.md` | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET |
| US, FR | `document-control-uk.md` | deferred — no authoritative ladder wording in-repo yet |

Doc-types with **no** regime fall through to user config:

| User config | Partial |
|---|---|
| `classification_scheme: UAE Smart Data` OR `governance_framework: UAE Federal` | `document-control-uae.md` |
| `classification_scheme: AT InfoSiG` OR `governance_framework: AT Gov` (and not UAE) | `document-control-at.md` |
| otherwise (`UK Gov` / `Generic`, blank scheme) | `document-control-uk.md` |
