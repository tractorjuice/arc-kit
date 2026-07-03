# Testing Plugin Branches

How to test an ArcKit plugin branch before merging.

## Quick start

To test an unmerged standalone `tractorjuice/arckit-claude` branch, create
`.claude/settings.json` in any test project:

```json
{
  "enabledPlugins": {
    "arckit@arckit-claude": true
  },
  "extraKnownMarketplaces": {
    "arckit-claude": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arckit-claude",
        "ref": "feat/your-branch-name"
      }
    }
  }
}
```

Then start Claude Code in that directory:

```bash
cd your-test-project
claude
```

> **Claude Code v2.1.200+ recommended:** project-scoped plugin loading from
> git worktrees is reliable from this floor. Earlier clients can fail to pick up
> the expected branch, which makes `/arckit:health` look like the branch test is
> passing against the marketplace copy.

## Source fields

| Field | Required | Description |
|-------|----------|-------------|
| `repo` | Yes | GitHub repository (`owner/repo`) |
| `ref` | No | Branch or tag name (defaults to repo default branch) |
| `sha` | No | Full 40-character commit SHA to pin an exact version |

> **Important:** The field is `ref`, not `branch`. Using `branch` is silently ignored.

## Alternative: local directory

To test from a local checkout without pushing:

```bash
claude --plugin-dir /path/to/arc-kit/plugins/arckit-claude
```

On Claude Code v2.1.200+, `claude agents --plugin-dir
/path/to/arc-kit/plugins/arckit-claude` also shows the plugin's agents and
skills. Use it when you are testing agent/skill visibility before opening a PR.

## Validate local source

Run local validation before relying on a branch test:

```bash
claude plugin validate /path/to/arc-kit/plugins/arckit-claude
```

Claude Code v2.1.200+ handles local `source: "."` plugin metadata correctly and
reports all validation errors instead of stopping at the first one. It also
honours local folder and git marketplace dependency pins, which matters when an
overlay branch depends on an unmerged ArcKit core branch.

## Verifying the correct branch loaded

1. Bump the VERSION file on your branch to a recognisable value (e.g. `4.6.3-rc.1`)
2. Run `/arckit:health` — the version in the output confirms which branch loaded
3. Check the plugin list: `/plugin` shows the installed version

## Switching back to production

Replace your test `settings.json` with the production marketplace config:

```json
{
  "enabledPlugins": {
    "arckit@arckit-claude": true
  },
  "extraKnownMarketplaces": {
    "arckit-claude": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arckit-claude"
      },
      "autoUpdate": true
    }
  }
}
```

Or delete `.claude/settings.json` entirely to use the marketplace default.
