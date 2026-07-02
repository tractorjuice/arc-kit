# ArcKit — Hermes Agent Extension

Enterprise architecture governance commands as [Hermes Agent](https://github.com/NousResearch/hermes-agent) skills.

## Structure

```text
extensions/arckit-hermes/
├── skills/                  # Auto-generated per-command skills
│   ├── arckit-adr/
│   │   └── SKILL.md
│   ├── arckit-analyze/
│   │   └── SKILL.md
│   └── ...
├── templates/               # Merged templates from all plugin sources
├── scripts/                 # Bash/Python scripts
├── references/            # Reference documents
└── schemas/               # JSON schemas
```

## Install

### Option 1: Install Individual Skills (Recommended)

Use the Hermes CLI to install skills by name:

```bash
# Install a single skill (example: arckit-adr)
hermes skills install "https://raw.githubusercontent.com/terrygzhou/arc-kit/main/extensions/arckit-hermes/skills/arckit-adr/SKILL.md"

# Or install all skills from this extension
for skill_dir in extensions/arckit-hermes/skills/*/; do
  hermes skills install "https://raw.githubusercontent.com/terrygzhou/arc-kit/main/$skill_dir/SKILL.md" -y
done
```

### Option 2: Manual Copy

For quick local development:

```bash
# Copy all skills
cp -r extensions/arckit-hermes/skills/* ~/.hermes/skills/
```

## Usage

After installing, ArcKit commands are available as Hermes skills. Invoke by name:

- `skill_view(name='arckit-adr')` to load a command
- Trigger keywords like `arckit-adr`, `/arckit:adr` will auto-load the skill

## Regenerate

```bash
python scripts/converter.py
```

This reads source commands from all plugins and generates extension files for all targets including Hermes.
