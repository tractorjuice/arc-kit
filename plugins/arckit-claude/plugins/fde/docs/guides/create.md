# FDE Site Generator Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-fde:create` generates a brandable Forward Deploy Engineering consulting site into
`docs/`. It interviews the user for market preset, brand, pricing, contact details, CTA, and site
metadata, then writes `fde-site.config.yaml` so the site can be regenerated later.

---

## When to Use

- You need a white-label FDE consulting website for GitHub Pages or another static host.
- You want a repeatable site generator rather than hand-editing `docs/index.html`.
- You need market-specific copy, pricing tiers, worked examples, and discovery metadata.
- You want to hand-edit a saved configuration and regenerate the site consistently.

---

## Command

```bash
/arckit-fde:create
```

Primary outputs:

| Output | Purpose |
|--------|---------|
| `fde-site.config.yaml` | Saved site configuration for future regeneration |
| `docs/index.html` | Generated static website |
| `docs/assets/*` | Copied or generated visual assets |
| `docs/llms.txt` | Discovery metadata when enabled by the template |

---

## Workflow

1. Run `/arckit-fde:create` from the repository that should receive the site.
2. Pick a preset: UK Public Sector, Generic, or Custom.
3. Confirm brand, colours, pricing, contact, booking URL, and CTA text.
4. Review before overwriting an existing `docs/index.html`.
5. Commit the generated `docs/` site and `fde-site.config.yaml`.

---

## Guardrails

- The command should not overwrite an existing `docs/index.html` without confirmation.
- Keep `fde-site.config.yaml` under version control if the site is intended to be repeatable.
- Use a valid hex brand colour and a canonical `site_url` with a trailing slash.
- Treat generated copy as a starting point; review claims, pricing, and contact routes before
  publishing.

---

## Related Commands

- `/arckit:pages` - Generate an ArcKit project documentation site.
- `/arckit:story` - Produce a stakeholder narrative for project evidence.
- `/arckit:presentation` - Generate board-ready presentation material.
