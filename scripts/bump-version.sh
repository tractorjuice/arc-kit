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

if [[ ! -f VERSION ]] || [[ ! -d plugins/arckit-claude ]]; then
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

# `while read` rather than mapfile so the script runs under macOS's stock
# bash 3.2 (mapfile is bash 4+, and `/usr/bin/env bash` resolves to /bin/bash
# 3.2 on a Mac without a brew-installed bash).
ALL_PLUGINS=()
while IFS= read -r p; do ALL_PLUGINS+=("$p"); done < <(
  find . -maxdepth 4 -path '*/.claude-plugin/plugin.json' -not -path '*/node_modules/*' \
    | sed -E 's|^\./||; s|/\.claude-plugin/plugin\.json$||' \
    | sort
)

if [[ ${#ALL_PLUGINS[@]} -eq 0 ]]; then
  echo "Error: no plugins discovered on disk." >&2
  exit 1
fi

COMMUNITY_PLUGINS=()
for p in "${ALL_PLUGINS[@]}"; do
  [[ "$p" == "plugins/arckit-claude" ]] && continue
  COMMUNITY_PLUGINS+=("$p")
done

# ── Drift check: every plugin on disk must be in marketplace.json ──────────
#
# bump-version.sh can sync versions but cannot fabricate marketplace entries
# (description, keywords, etc.). Catches the v5.3.0 backfill gotcha where a
# new plugin shipped without its marketplace entry.

MARKETPLACE_PLUGIN_NAMES=()
while IFS= read -r m; do MARKETPLACE_PLUGIN_NAMES+=("$m"); done < <(
  jq -r '.plugins[].name' .claude-plugin/marketplace.json | sort
)

if [[ ${#MARKETPLACE_PLUGIN_NAMES[@]} -eq 0 ]]; then
  echo "Error: no plugins found in .claude-plugin/marketplace.json." >&2
  exit 1
fi
MISSING_FROM_MARKETPLACE=()
for p in "${ALL_PLUGINS[@]}"; do
  plugin_name=$(jq -r '.name' "$p/.claude-plugin/plugin.json")
  found=0
  for m in "${MARKETPLACE_PLUGIN_NAMES[@]}"; do
    [[ "$plugin_name" == "$m" ]] && { found=1; break; }
  done
  [[ $found -eq 0 ]] && MISSING_FROM_MARKETPLACE+=("$p ($plugin_name)")
done

if [[ ${#MISSING_FROM_MARKETPLACE[@]} -gt 0 ]]; then
  echo "Error: plugin manifests exist on disk but are missing from .claude-plugin/marketplace.json:" >&2
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

# ── Portable in-place sed with landing check ────────────────────────────────
#
# BSD (macOS) sed parses `sed -i -E` as -i with backup suffix "-E": it writes
# a `file-E` backup, evaluates the expression as BRE (where `+` is a literal),
# and every substitution silently no-ops — which left pyproject.toml stale
# during the v6.13.0 release until fixed by hand. Avoid -i entirely: write to
# a temp file and move it back, exactly like the jq edits below. Then assert
# the expected literal is present, so a pattern that stops matching the file
# (the fate of the old docs/index.html "Version X.Y.Z - Month Year" sed)
# fails the bump loudly instead of silently. `grep -qF` keeps a re-run with
# the same version idempotent.
sed_edit() {
  local expr="$1" file="$2" expect="$3"
  sed -E "$expr" "$file" > "${file}.tmp"
  mv "${file}.tmp" "$file"
  if ! grep -qF "$expect" "$file"; then
    echo "Error: $file does not contain \"$expect\" after edit." >&2
    echo "       The sed pattern no longer matches this file — fix the pattern or the file." >&2
    exit 1
  fi
}

# ── 1. VERSION (plain text) ────────────────────────────────────────────────

echo "$NEW_VERSION" > VERSION
update_file "VERSION" "overwrite"

# ── 2. pyproject.toml ──────────────────────────────────────────────────────

sed_edit "s/^version = \"[0-9]+\.[0-9]+\.[0-9]+\"/version = \"$NEW_VERSION\"/" pyproject.toml \
  "version = \"$NEW_VERSION\""
update_file "pyproject.toml" "version field"

# ── 3. README.md (2 occurrences: badge-style link with version in text and URL) ──

sed_edit "s/\[v[0-9]+\.[0-9]+\.[0-9]+\]\(https:\/\/github\.com\/tractorjuice\/arc-kit\/releases\/tag\/v[0-9]+\.[0-9]+\.[0-9]+\)/[v$NEW_VERSION](https:\/\/github.com\/tractorjuice\/arc-kit\/releases\/tag\/v$NEW_VERSION)/g" README.md \
  "[v$NEW_VERSION](https://github.com/tractorjuice/arc-kit/releases/tag/v$NEW_VERSION)"
update_file "README.md" "release links (2 occurrences)"

# ── 4. docs/README.md ──────────────────────────────────────────────────────

sed_edit "s/\*\*ArcKit Version\*\*: [0-9]+\.[0-9]+\.[0-9]+/**ArcKit Version**: $NEW_VERSION/" docs/README.md \
  "**ArcKit Version**: $NEW_VERSION"
update_file "docs/README.md" "footer version"

# ── 5. docs/index.html (JSON-LD softwareVersion) ────────────────────────────
#
# The page's visible "Version X.Y.Z - Month Year" line this section once
# targeted was removed long ago; the JSON-LD SoftwareApplication block (which
# feeds search engines' rich results) is what still carries a version, and it
# had sat stale at 4.21.0 while the old sed matched nothing.

sed_edit "s/\"softwareVersion\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"softwareVersion\": \"$NEW_VERSION\"/" docs/index.html \
  "\"softwareVersion\": \"$NEW_VERSION\""
update_file "docs/index.html" "JSON-LD softwareVersion"

# ── 6. plugins/arckit-claude/VERSION ───────────────────────────────────────

echo "$NEW_VERSION" > plugins/arckit-claude/VERSION
update_file "plugins/arckit-claude/VERSION" "overwrite"

# ── 7. plugins/arckit-claude/.claude-plugin/plugin.json ────────────────────

jq --arg v "$NEW_VERSION" '.version = $v' plugins/arckit-claude/.claude-plugin/plugin.json > plugins/arckit-claude/.claude-plugin/plugin.json.tmp
mv plugins/arckit-claude/.claude-plugin/plugin.json.tmp plugins/arckit-claude/.claude-plugin/plugin.json
update_file "plugins/arckit-claude/.claude-plugin/plugin.json" ".version"

# ── 8. plugins/arckit-claude/.claude-plugin/marketplace.json ───────────────
#
# Standalone Claude marketplace metadata. The core plugin source is "." once
# plugins/arckit-claude/ is mirrored to tractorjuice/arckit-claude; overlay
# sources live under structured plugins/... paths in that standalone repo.

jq --arg v "$NEW_VERSION" '.plugins |= map(.version = $v)' plugins/arckit-claude/.claude-plugin/marketplace.json > plugins/arckit-claude/.claude-plugin/marketplace.json.tmp
mv plugins/arckit-claude/.claude-plugin/marketplace.json.tmp plugins/arckit-claude/.claude-plugin/marketplace.json
update_file "plugins/arckit-claude/.claude-plugin/marketplace.json" "all .plugins[].version (metadata.version unchanged)"

# ── 9. .claude-plugin/marketplace.json (all Claude plugin entries) ─────────
#
# All Claude plugins share one version; v6.0.0 publishes them together from
# the standalone tractorjuice/arckit-claude marketplace repo.
# metadata.version stays at 1.0.0.

jq --arg v "$NEW_VERSION" '.plugins |= map(.version = $v)' .claude-plugin/marketplace.json > .claude-plugin/marketplace.json.tmp
mv .claude-plugin/marketplace.json.tmp .claude-plugin/marketplace.json
update_file ".claude-plugin/marketplace.json" "all .plugins[].version (metadata.version unchanged)"

# ── 9a–9f. Community plugin manifests + VERSION files ─────────────────────
#
# Each community plugin pins its `arckit` dependency to the current core
# version with an exact (`=`) semver constraint. bump-version.sh keeps
# .version AND .dependencies[arckit].version in lockstep so all community
# plugins always ship as a coherent set. Discovery is filesystem-driven:
# any arckit-*/.claude-plugin/plugin.json directory is treated as a
# community plugin (excluding the core arckit-claude).

# ${arr[@]+…} guards the expansion: bash 3.2's `set -u` treats expanding an
# empty array as an unbound-variable error (fixed in bash 4.4).
for plugin_dir in ${COMMUNITY_PLUGINS[@]+"${COMMUNITY_PLUGINS[@]}"}; do
  manifest="${plugin_dir}/.claude-plugin/plugin.json"
  version_file="${plugin_dir}/VERSION"
  if [[ -f "$manifest" ]]; then
    jq --arg v "$NEW_VERSION" '
      .version = $v
      | .dependencies = (
          (.dependencies // [])
          | map(
              # All ArcKit plugins (core + community overlays) ship in
              # lockstep, so pin every inter-plugin "arckit*" dependency to
              # the new version — not just the core "arckit" dependency.
              # Covers community->community deps like arckit-au-energy -> arckit-au.
              if type == "object" and ((.name // "") | startswith("arckit"))
              then .version = "=" + $v
              else .
              end
            )
        )
    ' "$manifest" > "${manifest}.tmp"
    mv "${manifest}.tmp" "$manifest"
    update_file "$manifest" ".version + .dependencies[arckit*].version"
  fi
  if [[ -f "$version_file" ]]; then
    echo "$NEW_VERSION" > "$version_file"
    update_file "$version_file" "overwrite"
  fi
done

# ── 9. extensions/arckit-gemini/VERSION ───────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-gemini/VERSION
update_file "extensions/arckit-gemini/VERSION" "overwrite"

# ── 10. extensions/arckit-gemini/gemini-extension.json ────────────────────────────────

jq --arg v "$NEW_VERSION" '.version = $v' extensions/arckit-gemini/gemini-extension.json > extensions/arckit-gemini/gemini-extension.json.tmp
mv extensions/arckit-gemini/gemini-extension.json.tmp extensions/arckit-gemini/gemini-extension.json
update_file "extensions/arckit-gemini/gemini-extension.json" ".version"

# ── 11. extensions/arckit-opencode/VERSION ────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-opencode/VERSION
update_file "extensions/arckit-opencode/VERSION" "overwrite"

# ── 12. extensions/arckit-codex/VERSION ──────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-codex/VERSION
update_file "extensions/arckit-codex/VERSION" "overwrite"

# ── 13. extensions/arckit-copilot/VERSION ─────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-copilot/VERSION
update_file "extensions/arckit-copilot/VERSION" "overwrite"

# ── 14. extensions/arckit-paperclip/VERSION ──────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-paperclip/VERSION
update_file "extensions/arckit-paperclip/VERSION" "overwrite"

# ── 15. extensions/arckit-vibe/VERSION ────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-vibe/VERSION
update_file "extensions/arckit-vibe/VERSION" "overwrite"

# ── 16. extensions/arckit-kimi/VERSION ────────────────────────────────────────────

echo "$NEW_VERSION" > extensions/arckit-kimi/VERSION
update_file "extensions/arckit-kimi/VERSION" "overwrite"

# ── 17. extensions/arckit-paperclip/package.json ─────────────────────────────────────

if [[ -f extensions/arckit-paperclip/package.json ]]; then
  jq --arg v "$NEW_VERSION" '.version = $v' extensions/arckit-paperclip/package.json > extensions/arckit-paperclip/package.json.tmp
  mv extensions/arckit-paperclip/package.json.tmp extensions/arckit-paperclip/package.json
  update_file "extensions/arckit-paperclip/package.json" ".version"
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
for ext in extensions/arckit-gemini extensions/arckit-opencode extensions/arckit-codex extensions/arckit-copilot extensions/arckit-paperclip extensions/arckit-vibe extensions/arckit-kimi; do
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
echo "standalone Claude marketplace.json:"
echo "  metadata.version:   $(jq -r '.metadata.version' plugins/arckit-claude/.claude-plugin/marketplace.json)  (should be 1.0.0)"
jq -r '.plugins[] | "  \(.name): \(.version)"' plugins/arckit-claude/.claude-plugin/marketplace.json | sed 's/^/  /'
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
echo "  plugins/arckit-claude/CHANGELOG.md — Add release notes manually"
echo ""
echo "  Validate plugin/marketplace agreement (Claude Code v2.1.118+):"
echo "    claude plugin tag plugins/arckit-claude --dry-run"
echo ""
echo "  Optional dependency cleanup before tagging:"
echo "    claude plugin prune --dry-run"
echo ""
echo "Done."
