# ArcKit — Hermes Agent Extension

Enterprise architecture governance commands as [Hermes Agent](https://github.com/NousResearch/hermes-agent) skills.

## Structure

```
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

```bash
# Copy skills to your Hermes workspace
cp -r extensions/arckit-hermes/skills/* ~/.hermes/skills/

# Or symlink for live updates
ln -sf $(pwd)/extensions/arckit-hermes/skills ~/.hermes/skills/arckit-commands
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
