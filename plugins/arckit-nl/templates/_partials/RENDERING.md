# ArcKit Template Rendering Rules

When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command that reads the template MUST resolve the marker to the contents of one of the partials in this directory before writing the artefact to disk:

1. **Read the user's plugin userConfig** for `governance_framework` and `classification_scheme`.
2. **Choose the partial**:
   - If `governance_framework` is `UAE Federal` OR `classification_scheme` is `UAE Smart Data` → use `document-control-uae.md`.
   - Else if `governance_framework` is `AT Gov` OR `classification_scheme` is `AT InfoSiG` → use `document-control-at.md`.
   - Otherwise → use `document-control-uk.md`.
3. **Inline the chosen partial's contents** at the marker location, applying the standard `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions.
4. **Remove the `<!-- DOC-CONTROL-HEADER -->` marker line and its descriptive comment** from the final output.
5. **Populate the UAE-specific fields** (Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier) from upstream artefacts where available, or leave the `[PENDING — ...]` placeholder for the architect to fill.
6. **For the AT partial**, set the `Classification` field from the InfoSiG ladder (Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim) — not the UK ladder. If `default_classification` holds a UK value, map it (PUBLIC → Offen, OFFICIAL → Eingeschränkt, OFFICIAL-SENSITIVE → Eingeschränkt or Vertraulich, SECRET → Geheim/Streng geheim).

The marker comment is informational only; it does not appear in any rendered artefact.

## Quick reference

Resolution is ordered — UAE first, then AT, then UK as the default:

| User config | Partial used | Classification ladder |
|---|---|---|
| `classification_scheme: UAE Smart Data` OR `governance_framework: UAE Federal` | `document-control-uae.md` | Open / Shared / Confidential / Secret / Top Secret (+ UAE fields) |
| `classification_scheme: AT InfoSiG` OR `governance_framework: AT Gov` (and not UAE) | `document-control-at.md` | Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim (InfoSiG) |
| otherwise (`UK Gov` / `Generic`, blank scheme) | `document-control-uk.md` | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET |
