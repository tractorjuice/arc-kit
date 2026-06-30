# ArcKit FDE Site Generator (`arckit-fde`)

A lean, Claude Code only ArcKit plugin that generates a brandable Forward Deploy
Engineering (FDE) consulting website. One command interviews you and renders a
GitHub-Pages-ready static site into `docs/`.

## Install

```bash
claude plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit-fde@arckit-claude
```

`arckit-fde` is independent of the ArcKit governance core: no dependency on the
`arckit` plugin, no governance doc-types, Claude Code only.

## Use

```text
/arckit-fde:create
```

The command:

1. Asks for a market preset (UK Public Sector or Generic), brand and identity,
   pricing tiers, and contact and call to action.
2. Writes `fde-site.config.yaml` at your repo root (re-runs read it, so you can
   hand-edit and regenerate).
3. Renders a single-page site to `docs/`: `index.html`, `styles.css`, `assets/`,
   `samples/`, plus `llms.txt`, `sitemap.xml`, `robots.txt` and `.nojekyll`.

Preview locally with `cd docs && python3 -m http.server 8000`, then publish with
GitHub Pages set to deploy from the `main` branch `/docs` folder.

## What is configurable

Prompted: market preset, site name, tagline, brand colour, logo, hero image,
site URL, two pricing tiers, contact email, booking link and CTA wording.

Defaulted from the preset and editable in `fde-site.config.yaml`: value props,
the four-artefact bootstrap pack, follow-on areas, policy frameworks, worked
examples, public-sector benefits, the Day 0-5 cadence and the powered-by-ArcKit
block.

## License

MIT.
