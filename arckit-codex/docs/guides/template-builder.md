# Template Builder Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.template-builder` creates entirely new document templates tailored to your organization's needs through an interactive interview process.

---

## When to Use

| Scenario | Use This | Use `/arckit:customize` Instead |
|----------|----------|-------------------------------|
| Need a completely new document type | Yes | No |
| Want to modify an existing ArcKit template | No | Yes |
| Creating organization-specific assessments | Yes | No |
| Adjusting UK Gov sections in requirements | No | Yes |

---

## Command

```text
/arckit.template-builder security assessment
/arckit.template-builder vendor scorecard
/arckit.template-builder migration checklist
```

---

## Interview Process

The command conducts a 2-round interview (4 questions total):

### Round 1: Purpose & Structure

1. **Template Category** — Governance, Technical, Procurement, or Strategy
2. **Structural Elements** — Scoring matrix, compliance checklist, approval workflow, risk assessment (multi-select)

### Round 2: Context & Options

1. **Organizational Context** — UK Government, Enterprise, Regulated Industry, or Startup
2. **Additional Outputs** — Slash command, shareable bundle, minimal template (multi-select)

---

## Output Files

| File | Location | Always? |
|------|----------|---------|
| Document template | `.arckit/templates-custom/{name}-template.md` | Yes |
| Usage guide | `.arckit/guides-custom/{name}.md` | Yes |
| Slash command | `.claude/commands/arckit.community.{name}.md` | If selected |
| Shareable bundle | `.arckit/community/{name}/` | If selected |

---

## Three-Tier Origin Model

Every template and guide in ArcKit carries an origin banner:

| Tier | Banner | Source |
|------|--------|--------|
| **Official** | `Template Origin: Official` | Shipped with ArcKit |
| **Custom** | `Template Origin: Custom` | Modified via `/arckit:customize` |
| **Community** | `Template Origin: Community` | Created via `/arckit:template-builder` |

Community templates use the `community.` prefix for commands (e.g., `/arckit.community.security-assessment`), making them instantly recognizable in autocomplete.

---

## Sharing Templates

### Export Bundle

If you selected "Shareable Bundle", find the export at:

```text
.arckit/community/{name}/
  README.md                  # Usage instructions and author info
  {name}-template.md         # The template
  {name}.md                  # Usage guide
  arckit.community.{name}.md  # Slash command (if generated)
```

Share this folder via Git, email, or any file transfer method.

### Promotion to Official

To submit a community template for official ArcKit inclusion:

1. Fork [tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
2. Copy template to `.arckit/templates/` and `arckit-plugin/templates/`
3. Move command from `.claude/commands/` to `arckit-plugin/commands/` and drop the `arckit.community.` prefix
4. Change `Template Origin: Community` to `Template Origin: Official`
5. Change `Guide Origin: Community` to `Guide Origin: Official`
6. Add guide to the category map in `arckit-plugin/hooks/sync-guides.mjs`
7. Open a PR describing the template's purpose and use cases

---

## Examples

### Security Assessment Template

```text
/arckit.template-builder security assessment
```

Creates a template with compliance checklist, risk assessment matrix, and approval workflow sections tailored to your organizational context.

### Vendor Scorecard

```text
/arckit.template-builder vendor scorecard
```

Creates a procurement template with weighted scoring matrix, evaluation criteria, and comparison tables.

### Migration Checklist

```text
/arckit.template-builder migration checklist
```

Creates a technical template with phased checklist, rollback procedures, and sign-off gates.
