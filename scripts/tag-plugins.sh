#!/usr/bin/env bash
set -euo pipefail

# tag-plugins.sh — Create per-plugin Claude Code native tags after the umbrella tag.
#
# The umbrella tag `vX.Y.Z` triggers `.github/workflows/release.yml`. Each
# individual plugin also gets a native tag `<plugin-name>--vX.Y.Z` for the
# Claude Code plugin system's bookkeeping (resolving exact versions from
# marketplace history, etc.).
#
# Usage: ./scripts/tag-plugins.sh <version>
# Example: ./scripts/tag-plugins.sh 5.0.0

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 <version>" >&2
  echo "Example: $0 5.0.0" >&2
  exit 1
fi

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be semver (X.Y.Z), got: $VERSION" >&2
  exit 1
fi

# Auto-discover plugin directories: anything containing a Claude Code manifest.
# Avoids the manual-edit gotcha caught mid-v5.4.0 release where a new plugin
# (arckit-uk-nhs) shipped without its tag because the array wasn't updated.
mapfile -t PLUGINS < <(
  find . -maxdepth 3 -path '*/.claude-plugin/plugin.json' -not -path '*/node_modules/*' \
    | sed -E 's|^\./||; s|/\.claude-plugin/plugin\.json$||' \
    | sort
)

if [[ ${#PLUGINS[@]} -eq 0 ]]; then
  echo "Error: no plugins discovered (no */.claude-plugin/plugin.json files found)" >&2
  exit 1
fi

CREATED=0
SKIPPED=0

for plugin_dir in "${PLUGINS[@]}"; do
  manifest="$plugin_dir/.claude-plugin/plugin.json"
  if [[ ! -f "$manifest" ]]; then
    echo "Skipping $plugin_dir (no manifest)" >&2
    continue
  fi
  plugin_name=$(python3 -c "import json; print(json.load(open('$manifest'))['name'])")
  tag="${plugin_name}--v${VERSION}"

  if git rev-parse "$tag" >/dev/null 2>&1; then
    echo "Tag $tag already exists, skipping"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "Creating tag $tag"
  git tag -a "$tag" -m "$plugin_name $VERSION"
  git push origin "$tag"
  CREATED=$((CREATED + 1))
done

echo ""
echo "Done — created $CREATED native plugin tag(s), skipped $SKIPPED already-existing tag(s)."
