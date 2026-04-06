# Testing Plugin Branches

How to test an ArcKit plugin branch before merging.

## Quick start

Create `.claude/settings.json` in any test project:

```json
{
  "enabledPlugins": {
    "arckit@arc-kit": true
  },
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arc-kit",
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
claude --plugin-dir /path/to/arc-kit/arckit-claude
```

## Verifying the correct branch loaded

1. Bump the VERSION file on your branch to a recognisable value (e.g. `4.6.3-rc.1`)
2. Run `/arckit.health` — the version in the output confirms which branch loaded
3. Check the plugin list: `/plugin` shows the installed version

## Switching back to production

Replace your test `settings.json` with the standard config (no `ref`):

```json
{
  "enabledPlugins": {
    "arckit@arc-kit": true
  },
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arc-kit"
      },
      "autoUpdate": true
    }
  }
}
```

Or delete `.claude/settings.json` entirely to use the marketplace default.
