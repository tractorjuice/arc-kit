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

if [[ ! -f VERSION ]] || [[ ! -d arckit-plugin ]]; then
  echo "Error: Must be run from the arc-kit repo root."
  exit 1
fi

OLD_VERSION=$(cat VERSION)
echo "Bumping version: $OLD_VERSION → $NEW_VERSION"
echo ""

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

# ── 6. arckit-plugin/VERSION ───────────────────────────────────────────────

echo "$NEW_VERSION" > arckit-plugin/VERSION
update_file "arckit-plugin/VERSION" "overwrite"

# ── 7. arckit-plugin/.claude-plugin/plugin.json ────────────────────────────

jq --arg v "$NEW_VERSION" '.version = $v' arckit-plugin/.claude-plugin/plugin.json > arckit-plugin/.claude-plugin/plugin.json.tmp
mv arckit-plugin/.claude-plugin/plugin.json.tmp arckit-plugin/.claude-plugin/plugin.json
update_file "arckit-plugin/.claude-plugin/plugin.json" ".version"

# ── 8. .claude-plugin/marketplace.json (plugins[0].version only) ───────────

jq --arg v "$NEW_VERSION" '.plugins[0].version = $v' .claude-plugin/marketplace.json > .claude-plugin/marketplace.json.tmp
mv .claude-plugin/marketplace.json.tmp .claude-plugin/marketplace.json
update_file ".claude-plugin/marketplace.json" ".plugins[0].version (metadata.version unchanged)"

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

# ── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo "Updated $UPDATED files."
echo ""

# Verification
echo "── Verification ──"
echo ""
echo "VERSION files:"
grep -H "$NEW_VERSION" VERSION arckit-plugin/VERSION arckit-gemini/VERSION arckit-opencode/VERSION
echo ""
echo "pyproject.toml:"
grep "^version" pyproject.toml
echo ""
echo "plugin.json:"
jq -r '.version' arckit-plugin/.claude-plugin/plugin.json
echo ""
echo "marketplace.json:"
echo "  plugins[0].version: $(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)"
echo "  metadata.version:   $(jq -r '.metadata.version' .claude-plugin/marketplace.json)  (should be 1.0.0)"
echo ""

# Reminders
echo "── Reminders ──"
echo ""
echo "  CHANGELOG.md              — Add release notes manually"
echo "  arckit-plugin/CHANGELOG.md — Add release notes manually"
echo ""
echo "Done."
