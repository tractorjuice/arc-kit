# File Migration Playbook

`migrate-filenames.sh` converts legacy ArcKit filenames to the standardized Document ID naming convention.

---

## Overview

ArcKit uses standardized Document IDs for all artifacts:

```
ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md
```

Examples:
- `ARC-001-REQ-v1.0.md` - Requirements for project 001
- `ARC-001-ADR-001-v1.0.md` - First ADR for project 001
- `ARC-000-PRIN-v1.0.md` - Global architecture principles

---

## Command

```bash
# Single project
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh projects/001-my-project

# Dry run (preview changes)
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh projects/001-my-project --dry-run

# All projects
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh --all

# Global directory only
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh --global
```

---

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without modifying files |
| `--all` | Migrate all projects in `projects/` directory |
| `--global` | Migrate only `projects/000-global/` |
| `--force` | Overwrite existing files if they exist |
| `--no-backup` | Skip creating backup (not recommended) |
| `--help`, `-h` | Show help message |

---

## File Mappings

### Core Documents

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `requirements.md` | REQ | `ARC-{PID}-REQ-v1.0.md` |
| `stakeholder-drivers.md` | STKE | `ARC-{PID}-STKE-v1.0.md` |
| `stakeholder-analysis.md` | STKE | `ARC-{PID}-STKE-v1.0.md` |
| `risk-register.md` | RISK | `ARC-{PID}-RISK-v1.0.md` |
| `sobc.md` | SOBC | `ARC-{PID}-SOBC-v1.0.md` |
| `data-model.md` | DATA | `ARC-{PID}-DATA-v1.0.md` |
| `research-findings.md` | RSCH | `ARC-{PID}-RSCH-v1.0.md` |
| `traceability-matrix.md` | TRAC | `ARC-{PID}-TRAC-v1.0.md` |
| `analysis-report.md` | ANAL | `ARC-{PID}-ANAL-v1.0.md` |

### Global Documents (000-global)

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `architecture-principles.md` | PRIN | `ARC-000-PRIN-v1.0.md` |
| `principles.md` | PRIN | `ARC-000-PRIN-v1.0.md` |

### Strategy & Operations

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `project-plan.md` | PLAN | `ARC-{PID}-PLAN-v1.0.md` |
| `roadmap.md` | ROAD | `ARC-{PID}-ROAD-v1.0.md` |
| `backlog.md` | BKLG | `ARC-{PID}-BKLG-v1.0.md` |
| `devops-strategy.md` | DEVOPS | `ARC-{PID}-DEVOPS-v1.0.md` |
| `mlops-strategy.md` | MLOPS | `ARC-{PID}-MLOPS-v1.0.md` |
| `finops-strategy.md` | FINOPS | `ARC-{PID}-FINOPS-v1.0.md` |
| `operational-readiness.md` | OPS | `ARC-{PID}-OPS-v1.0.md` |
| `servicenow-design.md` | SNOW | `ARC-{PID}-SNOW-v1.0.md` |
| `platform-design.md` | PLAT | `ARC-{PID}-PLAT-v1.0.md` |

### Procurement

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `sow.md` | SOW | `ARC-{PID}-SOW-v1.0.md` |
| `dos-requirements.md` | DOS | `ARC-{PID}-DOS-v1.0.md` |
| `digital-marketplace-dos.md` | DOS | `ARC-{PID}-DOS-v1.0.md` |
| `gcloud-requirements.md` | GCLD | `ARC-{PID}-GCLD-v1.0.md` |
| `gcloud-clarification-questions.md` | GCLC | `ARC-{PID}-GCLC-v1.0.md` |
| `evaluation-criteria.md` | EVAL | `ARC-{PID}-EVAL-v1.0.md` |

### Compliance

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `tcop-review.md` | TCOP | `ARC-{PID}-TCOP-v1.0.md` |
| `tcop-assessment.md` | TCOP | `ARC-{PID}-TCOP-v1.0.md` |
| `ukgov-secure-by-design.md` | SECD | `ARC-{PID}-SECD-v1.0.md` |
| `secure-by-design.md` | SECD | `ARC-{PID}-SECD-v1.0.md` |
| `mod-secure-by-design.md` | SECD-MOD | `ARC-{PID}-SECD-MOD-v1.0.md` |
| `ai-playbook-assessment.md` | AIPB | `ARC-{PID}-AIPB-v1.0.md` |
| `atrs-record.md` | ATRS | `ARC-{PID}-ATRS-v1.0.md` |
| `jsp-936.md` | JSP936 | `ARC-{PID}-JSP936-v1.0.md` |
| `jsp936.md` | JSP936 | `ARC-{PID}-JSP936-v1.0.md` |
| `dpia.md` | DPIA | `ARC-{PID}-DPIA-v1.0.md` |
| `principles-compliance-assessment.md` | PRIN-COMP | `ARC-{PID}-PRIN-COMP-v1.0.md` |

### Reviews

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `hld-review.md` | HLDR | `ARC-{PID}-HLDR-v1.0.md` |
| `dld-review.md` | DLDR | `ARC-{PID}-DLDR-v1.0.md` |

### Other

| Old Filename | Type Code | New Filename |
|--------------|-----------|--------------|
| `PROJECT-STORY.md` | STORY | `ARC-{PID}-STORY-v1.0.md` |

---

## Subdirectory Handling

### Multi-Instance Documents

Files in these subdirectories are renamed with sequence numbers:

| Subdirectory | Type Code | New Pattern |
|--------------|-----------|-------------|
| `decisions/` | ADR | `ARC-{PID}-ADR-{NNN}-v1.0.md` |
| `diagrams/` | DIAG | `ARC-{PID}-DIAG-{NNN}-v1.0.md` |
| `wardley-maps/` | WARD | `ARC-{PID}-WARD-{NNN}-v1.0.md` |
| `data-contracts/` | DMC | `ARC-{PID}-DMC-{NNN}-v1.0.md` |
| `research/` | RSCH | `ARC-{PID}-RSCH-{NNN}-v1.0.md` |

### Research Files

Root-level research files are moved to `research/` subdirectory:

| Pattern | Migrated To |
|---------|-------------|
| `research-*.md` | `research/ARC-{PID}-RSCH-{NNN}-v1.0.md` |
| `research.md` | `research/ARC-{PID}-RSCH-{NNN}-v1.0.md` |

### Procurement Subdirectory

Files in `procurement/` are migrated to the project root:

```
Before:
  projects/001-project/procurement/gcloud-requirements.md
  projects/001-project/procurement/digital-marketplace-dos.md

After:
  projects/001-project/ARC-001-GCLD-v1.0.md
  projects/001-project/ARC-001-DOS-v1.0.md
```

### Reviews Subdirectory

HLD and DLD review files are moved to `reviews/`:

```
Before:
  projects/001-project/hld-review.md

After:
  projects/001-project/reviews/ARC-001-HLDR-v1.0.md
```

---

## Legacy Locations

### Global Principles

The migration script checks these legacy locations for principles:

| Legacy Location | Migrated To |
|-----------------|-------------|
| `.arckit/memory/architecture-principles.md` | `projects/000-global/ARC-000-PRIN-v1.0.md` |
| `.arckit/memory/principles.md` | `projects/000-global/ARC-000-PRIN-v1.0.md` |

### Root-Level Diagrams

Files matching these patterns are moved to `diagrams/`:

| Pattern | Migrated To |
|---------|-------------|
| `*-diagram.md` | `diagrams/ARC-{PID}-DIAG-{NNN}-v1.0.md` |
| `diagram-*.md` | `diagrams/ARC-{PID}-DIAG-{NNN}-v1.0.md` |

### Root-Level Wardley Maps

Files matching these patterns are moved to `wardley-maps/`:

| Pattern | Migrated To |
|---------|-------------|
| `*-wardley.md` | `wardley-maps/ARC-{PID}-WARD-{NNN}-v1.0.md` |
| `*-map.md` | `wardley-maps/ARC-{PID}-WARD-{NNN}-v1.0.md` |

---

## Date-Suffixed Files

Some compliance files have date suffixes. These are handled specially:

| Pattern | Migrated To |
|---------|-------------|
| `principles-compliance-assessment-YYYY-MM-DD.md` | `ARC-{PID}-PRIN-COMP-v1.0.md` |
| `service-assessment-*-prep.md` | `ARC-{PID}-SVCASS-v1.0.md` |

---

## Backups

By default, the script creates a timestamped backup before making changes:

```
projects/001-project/.backup/20260128_143022/
├── requirements.md
├── stakeholder-drivers.md
└── risk-register.md
```

Use `--no-backup` to skip backups (not recommended).

---

## Examples

### Preview All Changes

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh --all --dry-run
```

Output:
```
[INFO] Migrating project: 001-payment-gateway (ID: 001)
[DRY-RUN] Would rename: requirements.md → ARC-001-REQ-v1.0.md
[DRY-RUN] Would rename: stakeholder-drivers.md → ARC-001-STKE-v1.0.md
[DRY-RUN] Would rename: risk-register.md → ARC-001-RISK-v1.0.md
[DRY-RUN] No changes made
```

### Migrate Global Principles

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh --global
```

This will:
1. Create `projects/000-global/` if it doesn't exist
2. Check `.arckit/memory/` for legacy principles files
3. Migrate to `projects/000-global/ARC-000-PRIN-v1.0.md`

### Migrate Single Project

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh projects/001-payment-gateway
```

### Force Overwrite Existing

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/bash/migrate-filenames.sh projects/001-payment-gateway --force
```

---

## Post-Migration Steps

1. **Review backups**: Check `.backup/` directories for original files
2. **Update references**: Search for old filenames in documentation
3. **Run pages command**: Regenerate documentation site with `/arckit.pages`
4. **Commit changes**: Add migrated files to version control

---

## Troubleshooting

### "Cannot extract project ID"

Project directories must follow the pattern `{NNN}-{name}`:
- Valid: `001-payment-gateway`, `002-user-auth`
- Invalid: `payment-gateway`, `project1`

### "Target exists, skipping"

A file with the new name already exists. Use `--force` to overwrite.

### Files Not Migrated

Check that the filename matches a known mapping. The script only migrates recognized ArcKit artifact names.

---

## Review Checklist

- [ ] Ran `--dry-run` first to preview changes
- [ ] Verified backup directory was created
- [ ] Checked all expected files were migrated
- [ ] Updated cross-references in documentation
- [ ] Regenerated GitHub Pages with `/arckit.pages`
- [ ] Committed changes to version control

---

## Key Principles

1. **Non-destructive**: Original files are backed up before migration
2. **Idempotent**: Already-migrated files are skipped
3. **Predictable**: Consistent naming pattern across all projects
4. **Traceable**: Document IDs enable cross-referencing
