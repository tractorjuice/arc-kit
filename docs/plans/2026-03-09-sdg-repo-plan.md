# SDG Mono-Repo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `scripts/create-sdg-repo.py` that builds a single GitHub repo with 17 SDG workspaces and 78 pre-created UK Government projects.

**Architecture:** Single Python script with embedded SDG data structure. Creates repo via `gh` CLI, scaffolds all files using `os`/`pathlib`, copies docs from main repo, commits and pushes.

**Tech Stack:** Python 3 (stdlib only: `os`, `pathlib`, `subprocess`, `json`, `shutil`, `datetime`), `gh` CLI for GitHub operations.

**Design doc:** `docs/plans/2026-03-09-sdg-repo-design.md`

---

### Task 1: Create the script and run it

**Files:**
- Create: `scripts/create-sdg-repo.py`

**Step 1: Create the complete script**

Create `scripts/create-sdg-repo.py` with all SDG data (17 SDGs, 78 projects), file scaffolding functions, and main entry point. The script:

1. Reads `VERSION` from the main arc-kit repo
2. Creates the GitHub repo via `gh repo create`
3. Scaffolds top-level files: `.claude/settings.json`, `.devcontainer/devcontainer.json`, `.mcp.json`, `CLAUDE.md`, `README.md`, `CHANGELOG.md`, `VERSION`, `docs/`
4. Loops through 17 SDGs creating self-contained workspaces with `.arckit/.gitkeep`, `projects/000-global/`, SDG README, and all numbered project dirs
5. Each project gets `README.md` (matching `create-project.sh` output format), `external/.gitkeep`, `vendors/.gitkeep`
6. Copies `DEPENDENCY-MATRIX.md` and `WORKFLOW-DIAGRAMS.md` from main repo
7. Commits and pushes
8. Cleans up `/tmp/`

Key data: all 78 projects from issue #44 with full names and descriptions. SDG slugs match issue #44 (`no-poverty`, `zero-hunger`, `good-health`, etc.).

The script uses `subprocess.run()` with hardcoded commands only (no user input) for `gh` and `git` CLI calls.

**Step 2: Verify data integrity**

Run: `python -c "import importlib.util; spec = importlib.util.spec_from_file_location('m', 'scripts/create-sdg-repo.py'); mod = importlib.util.module_from_spec(spec); exec(open('scripts/create-sdg-repo.py').read().split('def slugify')[0]); print(f'{len(SDGS)} SDGs, {sum(len(s[\"projects\"]) for s in SDGS)} projects')"`

Expected: `17 SDGs, 78 projects`

**Step 3: Run the script**

Run: `cd /workspaces/arc-kit && python scripts/create-sdg-repo.py`

Expected: Repo created, all files scaffolded, committed, pushed. Final summary printed.

**Step 4: Verify the repo exists**

Run: `gh repo view tractorjuice/arckit-test-project-v46-sdg --json name,description`

Expected: `{"name":"arckit-test-project-v46-sdg","description":"ArcKit test project: UN Sustainable Development Goals — UK Government Technology Initiatives"}`

**Step 5: Spot-check file structure**

Run: `gh api repos/tractorjuice/arckit-test-project-v46-sdg/git/trees/main?recursive=1 --jq '.tree[].path' | head -40`

Expected: Correct directory structure with `.claude/settings.json`, `.mcp.json`, SDG dirs, project dirs, READMEs.

**Step 6: Commit the script to arc-kit repo**

```bash
git add scripts/create-sdg-repo.py docs/plans/2026-03-09-sdg-repo-design.md docs/plans/2026-03-09-sdg-repo-plan.md
git commit -m "feat: add SDG mono-repo creation script (#44)

Creates arckit-test-project-v46-sdg with 17 SDG workspaces
and 78 UK Government technology projects. Implements #44
as a single mono-repo instead of 17 separate repos.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Script Reference

The complete script source is embedded in this plan. Key details:

### SDG Data (SDGS list)

All 17 SDGs with slug, name, and projects array. Each project has `name` and `desc`. Full data from issue #44.

### File Templates

- **`.claude/settings.json`**: Plugin marketplace config (matches `create-test-repo` command)
- **`.devcontainer/devcontainer.json`**: Claude Code auto-install (matches `create-test-repo`)
- **`.mcp.json`**: 4 MCP servers — `aws-knowledge`, `microsoft-learn`, `google-developer-knowledge`, `datacommons-mcp` (from `arckit-claude/.mcp.json`)
- **`CLAUDE.md`**: SDG-specific with workspace listing and navigation instructions
- **`README.md`**: Full SDG overview with project tables
- **SDG `README.md`**: Per-SDG overview with project table and getting started
- **Project `README.md`**: Matches `create-project.sh` output — workflow phases, document type codes, status checklist, SDG alignment note added

### Functions

- `slugify(name)` — kebab-case conversion
- `run(cmd)` — shell command with logging
- `write_file(path, content)` — write with auto-mkdir
- `create_gitkeep(path)` — create dir with .gitkeep
- `create_github_repo()` — `gh repo create`
- `scaffold_top_level(version, today)` — all top-level files
- `scaffold_sdg(sdg, version, today)` — one SDG workspace with all projects
- `commit_and_push(version)` — git add/commit/push
- `cleanup()` — remove /tmp/ dir
- `main()` — orchestrate everything
