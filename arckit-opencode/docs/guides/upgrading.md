# Upgrading ArcKit

How to upgrade the ArcKit CLI and update your existing projects.

---

## Step 1: Upgrade the CLI

```bash
# If installed with pip:
pip install --upgrade git+https://github.com/tractorjuice/arc-kit.git

# If installed with uv:
uv tool upgrade arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Verify the new version:
arckit --help
```

---

## Step 2: Update Your Existing Project

Navigate to your existing ArcKit project directory and re-run init with `--here`:

```bash
cd /path/to/your-existing-project

# Re-initialize in place (updates commands, templates, scripts)
arckit init --here --ai codex
```

### What Gets Updated

| Updated | Preserved |
|---------|-----------|
| Slash commands (`.codex/prompts/`) | Project data (`projects/`) |
| Default templates (`.arckit/templates/`) | Custom templates (`.arckit/templates-custom/`) |
| Helper scripts (`.arckit/scripts/`) | |
| Documentation and guides (`docs/`) | |
| `VERSION`, `CHANGELOG.md` | |

> **Note:** For Claude Code users, commands and agents are provided by the ArcKit plugin and update automatically via the marketplace. No `arckit init` needed.

> **Note:** For Gemini CLI users, use the ArcKit extension (`gemini extensions install https://github.com/tractorjuice/arckit-gemini`). Updates via `gemini extensions update arckit`.

> **Note:** `README.md` will be overwritten. If you've customized it, back it up first:
> ```bash
> cp README.md README.md.bak
> arckit init --here --ai codex
> mv README.md.bak README.md
> ```

### Options

| Flag | Description |
|------|-------------|
| `--ai codex` | Update Codex CLI commands |
| `--minimal` | Skip updating docs and guides |

---

## Step 3 (Optional): Migrate Legacy Filenames

If upgrading from **v0.x** to **v1.x**, your project artifacts may use old-style filenames (e.g., `requirements.md`, `stakeholder-drivers.md`). ArcKit v1.x uses standardized Document IDs:

```
Old: requirements.md
New: ARC-001-REQ-v1.0.md
```

Run the migration script to rename files automatically:

```bash
# Preview changes first (no files modified)
.arckit/scripts/bash/migrate-filenames.sh --all --dry-run

# Apply the migration
.arckit/scripts/bash/migrate-filenames.sh --all
```

The script:
- Creates timestamped backups before making changes
- Skips files that are already migrated
- Handles subdirectories (decisions, diagrams, wardley-maps, etc.)
- Moves legacy locations (e.g., `.arckit/memory/principles.md` to `projects/000-global/`)

See the [migration guide](migration.md) for the complete filename mapping table and advanced options.

---

## Checking Your Version

```bash
# Check installed CLI version
arckit --help

# Check project version (in an ArcKit project directory)
cat VERSION
```

---

## Troubleshooting

### "Directory already exists" error

Use `--here` (or `.`) to update an existing project in place:

```bash
# These are equivalent:
arckit init --here --ai codex
arckit init . --ai codex
```

### Commands not updating

Make sure you upgraded the CLI first (Step 1), then re-ran init (Step 2). The init command copies the latest commands from the installed package.

### Custom templates lost

Custom templates in `.arckit/templates-custom/` are preserved across upgrades. Only default templates in `.arckit/templates/` are refreshed. If you edited files in `.arckit/templates/` directly (instead of `.arckit/templates-custom/`), those edits will be overwritten. Use `/arckit.customize` to set up the override workflow:

```bash
/arckit.customize requirements   # Copy template for safe customization
```
