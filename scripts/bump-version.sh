#!/usr/bin/env bash
set -euo pipefail

# bump-version.sh — Update all ArcKit version strings in one go.
# Usage: ./scripts/bump-version.sh 2.14.0

NEW_VERSION="${1:-}"

# ── Validate input ──────────────────────────────────────────────────────────

if [[ -z "$NEW_VERSION" ]]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 2.14.0"
  exit 1
fi

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must be semver (X.Y.Z), got: $NEW_VERSION"
  exit 1
fi

# ── Must run from repo root ─────────────────────────────────────────────────

if [[ ! -f VERSION ]] || [[ ! -d arckit-claude ]]; then
  echo "Error: Must be run from the arc-kit repo root."
  exit 1
fi

OLD_VERSION=$(cat VERSION)
echo "Bumping version: $OLD_VERSION → $NEW_VERSION"
echo ""

# ── Auto-discover all Claude Code plugins on disk ───────────────────────────
#
# Anything with .claude-plugin/plugin.json is a plugin. Splitting out the core
# `arckit-claude` separately mirrors how the script (and marketplace.json)
# treats it as the umbrella plugin all community overlays depend on.

mapfile -t ALL_PLUGINS < <(
  find . -maxdepth 3 -path '*/.claude-plugin/plugin.json' -not -path '*/node_modules/*' \
    | sed -E 's|^\./||; s|/\.claude-plugin/plugin\.json$||' \
    | sort
)
COMMUNITY_PLUGINS=()
for p in "${ALL_PLUGINS[@]}"; do
  [[ "$p" == "arckit-claude" ]] && continue
  COMMUNITY_PLUGINS+=("$p")
done

if [[ ${#ALL_PLUGINS[@]} -eq 0 ]]; then
  echo "Error: no plugins discovered on disk." >&2
  exit 1
fi

# ── Drift check: every plugin on disk must be in marketplace.json ──────────
#
# bump-version.sh can sync versions but cannot fabricate marketplace entries
# (description, keywords, etc.). Catches the v5.3.0 backfill gotcha where a
# new plugin shipped without its marketplace entry.

mapfile -t MARKETPLACE_SOURCES < <(
  jq -r '.plugins[].source | ltrimstr("./")' .claude-plugin/marketplace.json | sort
)
MISSING_FROM_MARKETPLACE=()
for p in "${ALL_PLUGINS[@]}"; do
  found=0
  for m in "${MARKETPLACE_SOURCES[@]}"; do
    [[ "$p" == "$m" ]] && { found=1; break; }
  done
  [[ $found -eq 0 ]] && MISSING_FROM_MARKETPLACE+=("$p")
done

if [[ ${#MISSING_FROM_MARKETPLACE[@]} -gt 0 ]]; then
  echo "Error: plugin directories exist on disk but are missing from .claude-plugin/marketplace.json:" >&2
  for p in "${MISSING_FROM_MARKETPLACE[@]}"; do
    echo "  - $p" >&2
  done
  echo "" >&2
  echo "Add a marketplace.json entry (name, source, description, keywords, etc.) for each before re-running." >&2
  exit 1
fi

UPDATED=0

update_file() {
  local file="$1"
  local label="$2"
  printf "  %-50s " "$file"
  echo "✓ $label"
  UPDATED=$((UPDATED + 1))
}

# ── 1. VERSION (plain text) ────────────────────────────────────────────────

echo "$NEW_VERSION" > VERSION
update_file "VERSION" "overwrite"

# ── 2. pyproject.toml ──────────────────────────────────────────────────────

sed -i -E "s/^version = \"[0-9]+\.[0-9]+\.[0-9]+\"/version = \"$NEW_VERSION\"/" pyproject.toml
update_file "pyproject.toml" "version field"

# ── 3. README.md (2 occurrences: badge-style link with version in text and URL) ──

sed -i -E "s/\[v[0-9]+\.[0-9]+\.[0-9]+\]\(https:\/\/github\.com\/tractorjuice\/arc-kit\/releases\/tag\/v[0-9]+\.[0-9]+\.[0-9]+\)/[v$NEW_VERSION](https:\/\/github.com\/tractorjuice\/arc-kit\/releases\/tag\/v$NEW_VERSION)/g" README.md
update_file "README.md" "release links (2 occurrences)"

# ── 4. docs/README.md ──────────────────────────────────────────────────────

sed -i -E "s/\*\*ArcKit Version\*\*: [0-9]+\.[0-9]+\.[0-9]+/**ArcKit Version**: $NEW_VERSION/" docs/README.md
update_file "docs/README.md" "footer version"

# ── 5. docs/index.html (version + month) ───────────────────────────────────

MONTH_YEAR=$(date +"%B %Y")
sed -i -E "s/Version [0-9]+\.[0-9]+\.[0-9]+ - [A-Za-z]+ [0-9]{4}/Version $NEW_VERSION - $MONTH_YEAR/" docs/index.html
update_file "docs/index.html" "version + date → $MONTH_YEAR"

# ── 6. arckit-claude/VERSION ───────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-claude/VERSION
update_file "arckit-claude/VERSION" "overwrite"

# ── 7. arckit-claude/.claude-plugin/plugin.json ────────────────────────────

jq --arg v "$NEW_VERSION" '.version = $v' arckit-claude/.claude-plugin/plugin.json > arckit-claude/.claude-plugin/plugin.json.tmp
mv arckit-claude/.claude-plugin/plugin.json.tmp arckit-claude/.claude-plugin/plugin.json
update_file "arckit-claude/.claude-plugin/plugin.json" ".version"

# ── 8. .claude-plugin/marketplace.json (all 6 plugin entries) ──────────────
#
# All 6 plugins (arckit core + 5 community: uae, fr, ca, eu, at) share one
# version per the v5.0.0 split design. metadata.version stays at 1.0.0.

jq --arg v "$NEW_VERSION" '.plugins |= map(.version = $v)' .claude-plugin/marketplace.json > .claude-plugin/marketplace.json.tmp
mv .claude-plugin/marketplace.json.tmp .claude-plugin/marketplace.json
update_file ".claude-plugin/marketplace.json" "all .plugins[].version (metadata.version unchanged)"

# ── 8a–8f. Community plugin manifests + VERSION files ─────────────────────
#
# Each community plugin pins its `arckit` dependency to the current core
# version with an exact (`=`) semver constraint. bump-version.sh keeps
# .version AND .dependencies[arckit].version in lockstep so all community
# plugins always ship as a coherent set. Discovery is filesystem-driven:
# any arckit-*/.claude-plugin/plugin.json directory is treated as a
# community plugin (excluding the core arckit-claude).

for plugin_dir in "${COMMUNITY_PLUGINS[@]}"; do
  manifest="${plugin_dir}/.claude-plugin/plugin.json"
  version_file="${plugin_dir}/VERSION"
  if [[ -f "$manifest" ]]; then
    jq --arg v "$NEW_VERSION" '
      .version = $v
      | .dependencies = (
          (.dependencies // [])
          | map(
              if type == "object" and .name == "arckit"
              then .version = "=" + $v
              else .
              end
            )
        )
    ' "$manifest" > "${manifest}.tmp"
    mv "${manifest}.tmp" "$manifest"
    update_file "$manifest" ".version + .dependencies[arckit].version"
  fi
  if [[ -f "$version_file" ]]; then
    echo "$NEW_VERSION" > "$version_file"
    update_file "$version_file" "overwrite"
  fi
done

# ── 9. arckit-gemini/VERSION ───────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-gemini/VERSION
update_file "arckit-gemini/VERSION" "overwrite"

# ── 10. arckit-gemini/gemini-extension.json ────────────────────────────────

jq --arg v "$NEW_VERSION" '.version = $v' arckit-gemini/gemini-extension.json > arckit-gemini/gemini-extension.json.tmp
mv arckit-gemini/gemini-extension.json.tmp arckit-gemini/gemini-extension.json
update_file "arckit-gemini/gemini-extension.json" ".version"

# ── 11. arckit-opencode/VERSION ────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-opencode/VERSION
update_file "arckit-opencode/VERSION" "overwrite"

# ── 12. arckit-codex/VERSION ──────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-codex/VERSION
update_file "arckit-codex/VERSION" "overwrite"

# ── 13. arckit-copilot/VERSION ─────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-copilot/VERSION
update_file "arckit-copilot/VERSION" "overwrite"

# ── 14. arckit-paperclip/VERSION ──────────────────────────────────────────

echo "$NEW_VERSION" > arckit-paperclip/VERSION
update_file "arckit-paperclip/VERSION" "overwrite"

# ── 15. arckit-paperclip/package.json ─────────────────────────────────────

if [[ -f arckit-paperclip/package.json ]]; then
  jq --arg v "$NEW_VERSION" '.version = $v' arckit-paperclip/package.json > arckit-paperclip/package.json.tmp
  mv arckit-paperclip/package.json.tmp arckit-paperclip/package.json
  update_file "arckit-paperclip/package.json" ".version"
fi

# ── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo "Updated $UPDATED files."
echo ""

# Verification
echo "── Verification ──"
echo ""
echo "VERSION files:"
VERSION_FILES=(VERSION)
for p in "${ALL_PLUGINS[@]}"; do
  [[ -f "$p/VERSION" ]] && VERSION_FILES+=("$p/VERSION")
done
# Extension repos (no plugin.json — added explicitly)
for ext in arckit-gemini arckit-opencode arckit-codex arckit-copilot arckit-paperclip; do
  [[ -f "$ext/VERSION" ]] && VERSION_FILES+=("$ext/VERSION")
done
grep -H "$NEW_VERSION" "${VERSION_FILES[@]}"
echo ""
echo "pyproject.toml:"
grep "^version" pyproject.toml
echo ""
echo "plugin.json (${#ALL_PLUGINS[@]} plugins):"
for src in "${ALL_PLUGINS[@]}"; do
  printf "  %-26s %s\n" "$src/plugin.json:" "$(jq -r '.version' "$src/.claude-plugin/plugin.json")"
done
echo ""
echo "marketplace.json:"
echo "  metadata.version:   $(jq -r '.metadata.version' .claude-plugin/marketplace.json)  (should be 1.0.0)"
jq -r '.plugins[] | "  \(.name): \(.version)"' .claude-plugin/marketplace.json | sed 's/^/  /'
echo ""

# Lint check
echo "── Lint ──"
echo ""
if npx markdownlint-cli2 "**/*.md" 2>&1; then
  echo "  ✓ No lint errors"
else
  echo ""
  echo "  ⚠ Lint errors found — fix before committing"
fi
echo ""

# Reminders
echo "── Reminders ──"
echo ""
echo "  CHANGELOG.md              — Add release notes manually"
echo "  arckit-claude/CHANGELOG.md — Add release notes manually"
echo ""
echo "  Validate plugin/marketplace agreement (Claude Code v2.1.118+):"
echo "    claude plugin tag arckit-claude --dry-run"
echo ""
echo "  Optional dependency cleanup before tagging:"
echo "    claude plugin prune --dry-run"
echo ""
echo "Done."
