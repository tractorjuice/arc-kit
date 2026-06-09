# `arckit-fde` configuration schema

`fde-site.config.yaml` lives at the end-user repo root. The wizard writes it; re-runs
read it. Values flow into the templates as `{{TOKEN}}` substitutions and `<!-- BEGIN/END -->`
list regions.

## Scalar tokens (must match the templates exactly)

```tokens
{{AREA_SERVED}}
{{BOOKING_URL}}
{{BRAND_ACCENT}}
{{BRAND_COLOR}}
{{BUILD_DATE}}
{{CONTACT_EMAIL}}
{{CTA_EYEBROW}}
{{CTA_HEADLINE}}
{{CTA_PRIMARY}}
{{EXAMPLES_HEADING}}
{{EYEBROW}}
{{FOOTER_TAGLINE}}
{{HERO_ALT}}
{{HERO_FILE}}
{{INTRO_BODY}}
{{LOGO_FILE}}
{{META_DESCRIPTION}}
{{OG_IMAGE_URL}}
{{PAGE_TITLE}}
{{PRICE_1_AMOUNT}}
{{PRICE_1_BODY}}
{{PRICE_1_CURRENCY}}
{{PRICE_1_NOTE}}
{{PRICE_1_NUMERIC}}
{{PRICE_1_TAG}}
{{PRICE_2_AMOUNT}}
{{PRICE_2_BODY}}
{{PRICE_2_CURRENCY}}
{{PRICE_2_NOTE}}
{{PRICE_2_NUMERIC}}
{{PRICE_2_TAG}}
{{PUBLIC_HEADING}}
{{PUBLIC_KICKER}}
{{PUBLIC_LEAD}}
{{REPO_URL}}
{{SERVICE_TYPE}}
{{SITE_NAME}}
{{SITE_URL}}
{{TAGLINE}}
{{THEME_COLOR}}
```

## List-region item tokens

Inside `<!-- BEGIN: region -->...<!-- END: region -->`, the renderer repeats the block per
list item using these item-scoped tokens (not part of the scalar set): `{{ITEM_TITLE}}`,
`{{ITEM_BODY}}`, `{{ITEM_STRONG}}`, `{{ITEM_SPAN}}`, `{{ITEM_URL}}`, `{{ITEM_DAY}}`.

Each region maps to one config list, and each item token draws from one field of that list's
items (token shown with its source field in parentheses):

| Region | Config list | Item fields |
|--------|-------------|-------------|
| `hero-pack` | `offer_pack[]` | `{{ITEM_TITLE}}` (title) |
| `signal-band` | `signal_band[]` | `{{ITEM_STRONG}}` (strong), `{{ITEM_SPAN}}` (span) |
| `value-props` | `value_props[]` | `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `offer-pack` | `offer_pack[]` | `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `public-sector-benefits` | `public_sector_benefits[]` | `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `follow-on-areas` | `follow_on_areas[]` | `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `policy-frameworks` | `policy_frameworks[]` (omit section if empty) | `{{ITEM_STRONG}}` (strong), `{{ITEM_TITLE}}` (title), `{{ITEM_URL}}` (url), `{{ITEM_BODY}}` (body) |
| `worked-examples` | `worked_examples[]` (omit section if empty) | `{{ITEM_SPAN}}` (span), `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body), `{{ITEM_URL}}` (url) |
| `bootstrap-cadence` | `bootstrap_cadence[]` | `{{ITEM_DAY}}` (day), `{{ITEM_SPAN}}` (span), `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `powered-by-arckit` | — (dropped when `powered_by_arckit: false`) | — |

So `policy_frameworks` items carry `{strong, title, url, body}`, `worked_examples` items
carry `{span, title, url, body}`, and `bootstrap_cadence` items carry `{day, span, title, body}`;
the other content lists carry `{title, body}` (or `{strong, span}` for `signal_band`).

## Config fields

Prompted by the wizard: `market_preset`, `site_name`, `tagline`, `brand_color`,
`brand_accent`, `logo`, `hero_image`, `site_url`, `contact_email`, `booking_url`,
`cta_primary`, `cta_headline`, and `pricing[0|1].{tag,amount,amount_numeric,currency,note,body}`.

Defaulted from the preset and editable: `eyebrow`, `page_title_suffix`, `meta_description`,
`hero_alt`, `footer_tagline`, `cta_eyebrow`, `examples_heading`, `area_served`,
`intro_body`, `public_kicker`, `public_heading`, `public_lead`, `service_type`,
`powered_by_arckit`, `signal_band[]`, `value_props[]`, `offer_pack[]`,
`public_sector_benefits[]`, `follow_on_areas[]`, `policy_frameworks[]`, `worked_examples[]`,
`bootstrap_cadence[]`.

## Derived by the command (not stored in config as tokens)

- `{{PAGE_TITLE}}` = `"{site_name} | {page_title_suffix}"`
- `{{THEME_COLOR}}` = `#101612`
- `{{OG_IMAGE_URL}}` = `{site_url}assets/{hero_file}`
- `{{LOGO_FILE}}` / `{{HERO_FILE}}` = basename of the chosen asset, or `default-mark.svg` / `default-hero.png`
- `{{REPO_URL}}` = optional; from config or blank
- `{{BUILD_DATE}}` = the generation date, supplied by the command at render time (never invented)
- `{{PRICE_1_*}}` / `{{PRICE_2_*}}` = from `pricing[0]` / `pricing[1]`
- Preset prose is brand-neutral; ArcKit attribution renders only inside `powered-by-arckit` template regions, which the `powered_by_arckit` flag toggles.
