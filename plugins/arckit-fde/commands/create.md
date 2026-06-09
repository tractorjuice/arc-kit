---
description: Generate a brandable, GitHub-Pages-ready Forward Deploy Engineering consulting website into docs/ — interviews you for brand, pricing and contact, saves fde-site.config.yaml, and renders from a market preset.
effort: high
---

# /arckit-fde:create

You generate a white-label FDE consulting website by rendering this plugin's
templates into `docs/` in the user's current repository. Work carefully and never
clobber existing files without confirmation.

## 0. Resolve paths

- `REPO_ROOT` = `git rev-parse --show-toplevel` if inside a git repo, else the current
  working directory. State which you used.
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`. Presets: `${CLAUDE_PLUGIN_ROOT}/presets/`.
  Schema: `${CLAUDE_PLUGIN_ROOT}/references/config-schema.md`.

## 1. Detect existing state

- If `REPO_ROOT/fde-site.config.yaml` exists, read it and ask (AskUserQuestion):
  **Regenerate** from it unchanged · **Edit fields** (pre-fill the wizard from it) ·
  **Start fresh**.
- If `REPO_ROOT/docs/index.html` exists, show its first few lines and CONFIRM before
  overwriting. If declined, stop and explain options (back up `docs/`, or run elsewhere).

## 2. Wizard (skip when "Regenerate")

Ask in this order, one concern at a time. AskUserQuestion for choices, plain prompts for
free text. Pre-fill from existing config when editing. Keep all prose em-dash-free.

1. **Market preset** — UK Public Sector (default) or Generic / Custom. Load
   `presets/<preset>.yaml` as the default layer.
2. **Brand and identity** — `site_name`, `tagline`, `brand_color` (offer a palette
   including `#0e7a5f`, plus custom hex; validate `^#[0-9a-fA-F]{6}$`, re-ask once then
   fall back to `#0e7a5f`), `brand_accent` (default `#1ed3c6`), `logo` (path or blank for
   the bundled default), `hero_image` (path or blank), `site_url` (ensure a trailing `/`).
3. **Pricing** — two tiers; for each: `tag`, `amount`, `amount_numeric`, `currency`,
   `note`, `body`. Pre-fill from the preset.
4. **Contact and CTA** — `contact_email`, `booking_url` (default
   `mailto:{contact_email}?subject=FDE%20enquiry`), `cta_primary`, `cta_headline`.

## 3. Merge, derive, persist

- Deep-merge wizard answers OVER the preset defaults.
- Derive the computed tokens: `PAGE_TITLE` = `"{site_name} | {page_title_suffix}"`;
  `THEME_COLOR` = `#101612`; `LOGO_FILE`/`HERO_FILE` = basename of the chosen asset or
  `default-mark.svg`/`default-hero.png`; `OG_IMAGE_URL` = `{site_url}assets/{HERO_FILE}`;
  `REPO_URL` from config or blank; `BUILD_DATE` = today's date (ask or read the
  environment; never invent); `PRICE_1_*`/`PRICE_2_*` from `pricing[0]`/`pricing[1]`.
- Write `REPO_ROOT/fde-site.config.yaml` with EVERY field (prompted + the editable preset
  defaults: `eyebrow`, `page_title_suffix`, `meta_description`, `hero_alt`, `footer_tagline`,
  `cta_eyebrow`, `examples_heading`, `area_served`, `powered_by_arckit`, `signal_band`,
  `value_props`, `offer_pack`, `public_sector_benefits`, `follow_on_areas`,
  `policy_frameworks`, `worked_examples`, `bootstrap_cadence`). Add a top comment explaining
  that re-running the command reads this file, so users can hand-edit and regenerate.

## 4. Render (use the Write tool, one file per call)

For each template under `templates/`, produce the output by:

- Substituting every scalar `{{TOKEN}}` from the resolved config/derived values.
- Expanding each `<!-- BEGIN: region -->...<!-- END: region -->` once per matching config
  list item, using the region → config mapping below and the item tokens
  `{{ITEM_TITLE}}`, `{{ITEM_BODY}}`, `{{ITEM_STRONG}}`, `{{ITEM_SPAN}}`, `{{ITEM_URL}}`,
  `{{ITEM_DAY}}`.
- If a region's list is EMPTY (e.g. `policy_frameworks`/`worked_examples` in the generic
  preset), omit the WHOLE enclosing `<section>` rather than leaving an empty heading.
- If `powered_by_arckit` is false, drop every `powered-by-arckit` region (both the
  `<!-- ... -->` HTML form and the `# BEGIN/END` form in `llms.txt`).
- HTML-escape user text placed into element content or attributes.

Region → config mapping:

| Region | Config list | Item fields |
|--------|-------------|-------------|
| `hero-pack` | `offer_pack[]` | `{{ITEM_TITLE}}` (title only) |
| `signal-band` | `signal_band[]` | `{{ITEM_STRONG}}`, `{{ITEM_SPAN}}` |
| `value-props` | `value_props[]` | `{{ITEM_TITLE}}`, `{{ITEM_BODY}}` |
| `offer-pack` | `offer_pack[]` | `{{ITEM_TITLE}}`, `{{ITEM_BODY}}` |
| `public-sector-benefits` | `public_sector_benefits[]` | `{{ITEM_TITLE}}`, `{{ITEM_BODY}}` |
| `follow-on-areas` | `follow_on_areas[]` | `{{ITEM_TITLE}}`, `{{ITEM_BODY}}` |
| `policy-frameworks` | `policy_frameworks[]` (omit section if empty) | `{{ITEM_STRONG}}` (strong), `{{ITEM_TITLE}}` (title), `{{ITEM_URL}}` (url), `{{ITEM_BODY}}` (body) |
| `worked-examples` | `worked_examples[]` (omit section if empty) | `{{ITEM_SPAN}}` (span), `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body), `{{ITEM_URL}}` (url) |
| `bootstrap-cadence` | `bootstrap_cadence[]` | `{{ITEM_DAY}}` (day), `{{ITEM_SPAN}}` (span), `{{ITEM_TITLE}}` (title), `{{ITEM_BODY}}` (body) |
| `powered-by-arckit` | dropped when `powered_by_arckit: false` | — |

Write these files to `REPO_ROOT/docs/`: `index.html`, `styles.css`, `llms.txt`,
`sitemap.xml`, `robots.txt`, `.nojekyll`, `samples/governance-pack.html`.

Assets: if `logo`/`hero_image` were given and the files exist, copy them into
`docs/assets/` under their basenames; otherwise copy the bundled
`templates/assets/default-mark.svg` / `default-hero.png`. Always populate `docs/assets/`.

Before writing each file, confirm NO `{{` remains in the rendered output.

## 5. Summarise

Report the files written and the resolved brand colour / pricing / contact, then:

- Preview: `cd docs && python3 -m http.server 8000`, open `http://localhost:8000/`.
- Publish: GitHub Pages → Deploy from branch → `main` → `/docs`.
- Note that `fde-site.config.yaml` holds editable defaults (value props, offer pack,
  policy frameworks, worked examples, cadence, `powered_by_arckit`); edit and re-run
  `/arckit-fde:create` → Regenerate to apply.
