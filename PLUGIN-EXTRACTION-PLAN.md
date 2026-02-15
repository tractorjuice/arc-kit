# Plan: Extract Claude Plugin to `tractorjuice/arckit-claude`

## Context

The ArcKit monorepo (`tractorjuice/arc-kit`) contains three distribution formats side-by-side: CLI, Claude Code plugin, and Gemini extension. The plugin (`arckit-plugin/`) has grown into the primary distribution (48 commands, 5 agents, 1 skill, 4 MCP servers) and deserves its own repo for cleaner separation, independent versioning, and marketplace identity. The CLI is being considered for deprecation, making this a natural time to extract.

**Key decisions:**
- New repo: `tractorjuice/arckit-claude`
- Converter stays in main repo, reads from git submodule at `arckit-plugin/` (same path, zero converter changes)
- All 44 test repos migrated to new marketplace
- Dual marketplace maintained for backward compatibility

---

## Phase 0: Pre-flight Checks

- [ ] Confirm `arc-kit` main branch is clean and pushed
- [ ] Confirm current plugin version: 2.4.3
- [ ] Verify all 44 test repos have current `arc-kit` marketplace settings

---

## Phase 1: Create New Repo (`tractorjuice/arckit-claude`)

### Step 1.1: Create the GitHub repository
```bash
gh repo create tractorjuice/arckit-claude --public \
  --description "ArcKit - Claude Code Plugin for Enterprise Architecture Governance" \
  --license MIT
```

### Step 1.2: Copy plugin contents to new repo
```bash
git clone git@github.com:tractorjuice/arckit-claude.git /tmp/arckit-claude
cp -r arckit-plugin/* /tmp/arckit-claude/
cp -r arckit-plugin/.claude-plugin /tmp/arckit-claude/
cp arckit-plugin/.mcp.json /tmp/arckit-claude/
```

### Step 1.3: Create marketplace.json at new repo root

Create `/tmp/arckit-claude/.claude-plugin/marketplace.json`:
```json
{
  "name": "arckit-claude",
  "owner": {
    "name": "TractorJuice",
    "email": "tractorjuice@users.noreply.github.com"
  },
  "metadata": {
    "description": "Enterprise Architecture Governance & Vendor Procurement Toolkit for Claude Code",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "arckit",
      "source": ".",
      "description": "48 slash commands for enterprise architecture artifacts, vendor procurement, and UK Government compliance",
      "version": "2.4.3",
      "author": { "name": "TractorJuice" },
      "homepage": "https://github.com/tractorjuice/arckit-claude",
      "repository": "https://github.com/tractorjuice/arckit-claude",
      "license": "MIT",
      "keywords": ["architecture", "governance", "enterprise", "procurement", "vendor-evaluation", "uk-government"],
      "category": "productivity"
    }
  ]
}
```

Key differences from `arc-kit` marketplace: `name` = `"arckit-claude"`, `source` = `"."` (repo root IS the plugin).

### Step 1.4: Update plugin.json in new repo

Edit `.claude-plugin/plugin.json` — only change `repository`:
```json
"repository": "https://github.com/tractorjuice/arckit-claude"
```

### Step 1.5: Update README.md in new repo

- Installation command: `/plugin marketplace add tractorjuice/arckit-claude`
- Repository links: point to `tractorjuice/arckit-claude`
- Add note that `tractorjuice/arc-kit` is the main project repo (CLI, converter, Gemini extension)

### Step 1.6: Update repo references in plugin files

**Change to `arckit-claude`** (plugin-specific references):
- `commands/service-assessment.md`: issue link
- Any other command/guide that references plugin issues or plugin installation

**Keep as `arc-kit`** (project-level references):
- `templates/pages-template.html`: main project link
- `templates/architecture-diagram-template.md`: main project link
- `docs/guides/upgrading.md`: CLI upgrade instructions

### Step 1.7: Commit and push
```bash
cd /tmp/arckit-claude
git add -A
git commit -m "feat: initial plugin extraction from tractorjuice/arc-kit"
git push origin main
```

### Step 1.8: Verify
- [ ] Repo accessible at `https://github.com/tractorjuice/arckit-claude`
- [ ] `.claude-plugin/marketplace.json` exists at root
- [ ] Test: `/plugin marketplace add tractorjuice/arckit-claude` works
- [ ] Test: Commands are discoverable after install

---

## Phase 2: Update Main Repo (`tractorjuice/arc-kit`)

### Step 2.1: Remove `arckit-plugin/` directory
```bash
git rm -r arckit-plugin/
```

### Step 2.2: Add git submodule at same path
```bash
git submodule add git@github.com:tractorjuice/arckit-claude.git arckit-plugin
```

This creates `.gitmodules` and checks out plugin at `arckit-plugin/`. **Same path = zero converter changes.**

### Step 2.3: Verify converter works unchanged
```bash
python scripts/converter.py
```
Paths `arckit-plugin/commands/`, `arckit-plugin/agents/` resolve through the submodule identically.

### Step 2.4: Update root `.claude-plugin/marketplace.json`

Keep the marketplace working (backward compatibility). Update `homepage`/`repository` to `arckit-claude`:
```json
"homepage": "https://github.com/tractorjuice/arckit-claude",
"repository": "https://github.com/tractorjuice/arckit-claude"
```
Keep `source: "./arckit-plugin"` (resolves through submodule).

### Step 2.5: Update documentation in main repo

| File | Changes |
|------|---------|
| `CLAUDE.md` | Describe submodule architecture, update "Adding a New Slash Command" workflow, update version management |
| `README.md` | Add both marketplace install options (old `arc-kit` still works, `arckit-claude` recommended) |
| `CONTRIBUTING.md` | Add submodule instructions (`--recurse-submodules`), update marketplace command |
| `src/arckit_cli/__init__.py` | Update plugin install instructions in help text (lines 331, 342) |
| `docs/index.html` | Update plugin installation commands (lines 1409, 1587) |
| `arckit-gemini/README.md` | Update Claude Code plugin install reference |

### Step 2.6: Commit
```bash
git add .gitmodules arckit-plugin .claude-plugin/marketplace.json
git add CLAUDE.md README.md CONTRIBUTING.md src/arckit_cli/__init__.py
git add docs/index.html arckit-gemini/README.md
git commit -m "refactor: extract plugin to tractorjuice/arckit-claude, add as submodule"
```

### Step 2.7: Verify
- [ ] Fresh clone with `--recurse-submodules` works
- [ ] `ls arckit-plugin/commands/` lists 48 files
- [ ] `python scripts/converter.py` generates output successfully
- [ ] `pip install -e . && arckit --help` works
- [ ] Old marketplace (`arc-kit`) still resolves the plugin

---

## Phase 3: Migrate Test Repos (44 repos, v0-v43)

### Step 3.1: Bulk update `.claude/settings.json`

Change from:
```json
{
  "extraKnownMarketplaces": {
    "arc-kit": { "source": { "source": "github", "repo": "tractorjuice/arc-kit" } }
  },
  "enabledPlugins": { "arckit@arc-kit": true }
}
```

To:
```json
{
  "extraKnownMarketplaces": {
    "arckit-claude": { "source": { "source": "github", "repo": "tractorjuice/arckit-claude" } }
  },
  "enabledPlugins": { "arckit@arckit-claude": true }
}
```

### Step 3.2: Execute bulk script
```bash
mkdir -p /tmp/arckit-sync
for i in $(seq 0 43); do
  [ "$i" -eq 22 ] && continue  # Skip v22 (separate project)
  REPO_NAME=$(gh repo list tractorjuice --json name -q ".[].name" | grep "arckit-test-project-v${i}-")
  [ -z "$REPO_NAME" ] && continue
  gh repo clone "tractorjuice/${REPO_NAME}" "/tmp/arckit-sync/${REPO_NAME}" -- --depth 1
  cd "/tmp/arckit-sync/${REPO_NAME}"
  sed -i 's/"arc-kit"/"arckit-claude"/g' .claude/settings.json
  sed -i 's|tractorjuice/arc-kit|tractorjuice/arckit-claude|g' .claude/settings.json
  git add .claude/settings.json
  git commit -m "chore: migrate marketplace from arc-kit to arckit-claude"
  git push
  cd /tmp/arckit-sync
done
rm -rf /tmp/arckit-sync
```

### Step 3.3: Verify
- [ ] Spot-check 3-4 repos (mix of public/private)
- [ ] Open in Claude Code, restart, verify plugin loads
- [ ] Run a command (e.g., `/arckit:init`) to confirm

---

## Phase 4: Update Memory and Changelogs

### Step 4.1: Update MEMORY.md
- Triple Distribution Model: plugin lives at `tractorjuice/arckit-claude`, submodule in main repo
- Test Repo Setup: new settings.json format
- Release Process: add submodule update step

### Step 4.2: Update changelogs
- `arc-kit/CHANGELOG.md`: "Plugin extracted to tractorjuice/arckit-claude, added as submodule"
- `arckit-claude/CHANGELOG.md`: "Repository migrated from tractorjuice/arc-kit/arckit-plugin/ to tractorjuice/arckit-claude"

---

## Post-Extraction: Version Bump Workflow

**Plugin-only change** (command fix, template update):
1. Commit + push to `tractorjuice/arckit-claude`
2. Bump version in `arckit-claude`: `VERSION`, `plugin.json`, `marketplace.json`, `CHANGELOG.md`
3. In `arc-kit`: `cd arckit-plugin && git pull origin main && cd .. && git add arckit-plugin && git commit -m "chore: update plugin submodule to vX.Y.Z"`
4. Run converter if output changed, commit generated files
5. Update `arc-kit` root `marketplace.json` version to match

**CLI-only change**: Commit to `arc-kit` directly, no submodule change needed.

---

## Rollback Plan

| Phase | Rollback |
|-------|----------|
| Phase 1 | Delete `tractorjuice/arckit-claude` repo. No main repo changes yet. |
| Phase 2 | `git submodule deinit arckit-plugin && git rm arckit-plugin && git checkout HEAD~1 -- arckit-plugin/ .claude-plugin/ CLAUDE.md README.md ...` |
| Phase 3 | Reverse sed: `s/"arckit-claude"/"arc-kit"/g` in test repo settings |

**Zero-downtime guarantee**: The `arc-kit` root marketplace continues to serve the plugin via submodule, so old references (`arckit@arc-kit`) keep working indefinitely alongside new ones (`arckit@arckit-claude`).

---

## Risks

| Risk | Mitigation |
|------|------------|
| Submodule not initialized after clone | Document `--recurse-submodules` everywhere, update `.devcontainer/` if exists |
| Version drift between repos | Document workflow, consider `scripts/bump-version.sh` |
| Users have `arc-kit` marketplace cached | Dual marketplace — both paths serve same plugin |
| Converter breaks | Paths identical through submodule — tested in Step 2.3 |

---

## Files Modified

### New repo (`tractorjuice/arckit-claude`) — created from `arckit-plugin/` contents:
- `.claude-plugin/marketplace.json` (new — makes repo a marketplace)
- `.claude-plugin/plugin.json` (update `repository` field)
- `README.md` (update install commands and repo links)
- Select commands/guides (update issue links)

### Main repo (`tractorjuice/arc-kit`):
- `arckit-plugin/` — removed as directory, added as submodule
- `.gitmodules` — new file (submodule config)
- `.claude-plugin/marketplace.json` — update `homepage`/`repository`
- `CLAUDE.md` — rewrite for submodule architecture
- `README.md` — update marketplace install commands
- `CONTRIBUTING.md` — add submodule workflow
- `src/arckit_cli/__init__.py` — update help text
- `docs/index.html` — update install commands
- `arckit-gemini/README.md` — update plugin reference

### Test repos (44 repos, v0-v43 excluding v22):
- `.claude/settings.json` — marketplace name + repo URL
