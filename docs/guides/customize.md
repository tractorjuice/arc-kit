# Template Customization Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:customize` copies templates to `.arckit/templates-custom/` for customization, preserving changes across updates.

---

## Command

```bash
# Copy a specific template
/arckit:customize requirements

# Copy all templates
/arckit:customize all

# List available templates
/arckit:customize list

# Show template info
/arckit:customize info requirements
```

---

## How It Works

| Location | Purpose |
|----------|---------|
| `${CLAUDE_PLUGIN_ROOT}/templates/` | Default templates (Claude Code plugin) |
| `.arckit/templates/` | Default templates (CLI and non-Claude extensions, refreshed by `arckit init`) |
| `.arckit/templates-custom/` | Your customizations (preserved across updates) |

Commands automatically check for custom templates first, falling back to defaults.

### Scope

In Claude Code, `/arckit:customize` covers the **core `arckit` plugin only**. Community overlay plugins (`arckit-uae`, `arckit-ca`, `arckit-uk-nhs`, `arckit-repo` and the rest) ship their own templates, and `list` and `all` do not cover them. The command will tell you which scope it used.

The core plugin does bundle a copy of every overlay, so an overlay template can still be copied by hand:

```bash
# Locate it under the installed core plugin, then copy it
find ~/.claude/plugins/cache -path '*/arckit/*/plugins/*/templates/codebase-audit-template.md' \
  | sort -V | tail -1 \
  | xargs -I{} cp {} .arckit/templates-custom/codebase-audit-template.md
```

Ask `/arckit:customize codebase-audit` and the command will locate it for you and explain the copy. Making this a first-class path is tracked on [issue #717](https://github.com/tractorjuice/arc-kit/issues/717).

On the CLI and the non-Claude extensions this distinction does not apply: `arckit init` writes every template into a single flat `.arckit/templates/` directory.

---

## Common Customizations

| Customization | Example |
|---------------|---------|
| Document Control | Add organization-specific fields |
| Compliance Sections | Include ISO 27001, PCI-DSS, SOC 2 requirements |
| Approval Workflows | Add department-specific sign-off sections |
| Classification Banners | Customize UK Government classification headers |
| Branding | Add organization logo, footer, contact information |

---

## Workflow

1. **Copy template**: `/arckit:customize requirements`
2. **Edit**: Modify `.arckit/templates-custom/requirements-template.md`
3. **Use**: Run `/arckit:requirements` — automatically uses your custom template
4. **Update ArcKit**: Run `arckit init` — your customizations preserved

---

## Template Structure

Templates use placeholders that commands replace:

| Placeholder | Replaced With |
|-------------|---------------|
| `[PROJECT_ID]` | Project number (e.g., "001") |
| `[PROJECT_NAME]` | Project name |
| `[VERSION]` | Document version |
| `[DATE]` | Current date |
| `[STATUS]` | Document status (DRAFT, etc.) |

---

## Best Practices

1. **Start minimal**: Copy only templates you need to customize
2. **Document changes**: Add comments explaining customizations
3. **Test first**: Verify custom template works before production use
4. **Version control**: Commit `.arckit/templates-custom/` to git
5. **Review updates**: Check ArcKit release notes for template changes

---

## Reverting to Defaults

To revert a template to default:

```bash
# Delete the custom template
rm .arckit/templates-custom/requirements-template.md

# Command will now use default from .arckit/templates/
```

---

## Available Templates

| Template | Command |
|----------|---------|
| `requirements-template.md` | `/arckit:requirements` |
| `stakeholder-drivers-template.md` | `/arckit:stakeholders` |
| `risk-register-template.md` | `/arckit:risk` |
| `sobc-template.md` | `/arckit:sobc` |
| `architecture-principles-template.md` | `/arckit:principles` |
| `data-model-template.md` | `/arckit:data-model` |
| `sow-template.md` | `/arckit:sow` |
| `pages-template.html` | `/arckit:pages` |
| ... | (run `/arckit:customize list` for the full core list) |

The core plugin ships 65 templates and the overlays add well over a hundred more, so the extract above is a sample rather than a catalogue. `/arckit:customize list` is the authoritative core list.
