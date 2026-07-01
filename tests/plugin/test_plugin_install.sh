#!/usr/bin/env bash
# Test local plugin installation for Claude Code

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Validate plugin manifests first
echo "=== Validating plugin manifests ==="
python3 "$REPO_ROOT/scripts/validate-plugins.py"

echo ""
echo "=== Testing local plugin installation ==="

# Test loading both arckit core and TOGAF ADM plugin together
echo "Loading plugins via --plugin-dir..."
RESULT=$(claude \
  --plugin-dir "$REPO_ROOT/plugins/arckit-claude" \
  --plugin-dir "$REPO_ROOT/plugins/arckit-togaf-adm" \
  --print "list /arckit:adm-* commands available" 2>&1)

# Verify TOGAF ADM commands are present
REQUIRED_COMMANDS=(
  "adm-preliminary"
  "application-inventory"
  "application-rationalization"
  "architecture-board"
  "architecture-change"
  "architecture-repository"
  "business-capability-map"
  "gap-analysis"
  "transition-architecture"
)

echo ""
echo "=== Checking for required TOGAF ADM commands ==="
MISSING=()
for cmd in "${REQUIRED_COMMANDS[@]}"; do
  if echo "$RESULT" | grep -q "/arckit:$cmd"; then
    echo "✅ /arckit:$cmd"
  else
    echo "❌ /arckit:$cmd (MISSING)"
    MISSING+=("$cmd")
  fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
  echo ""
  echo "✅ All TOGAF ADM commands loaded successfully"
else
  echo ""
  echo "❌ Missing commands: ${MISSING[*]}"
  exit 1
fi

echo ""
echo "=== Testing agent architecture plugin ==="
RESULT2=$(claude \
  --plugin-dir "$REPO_ROOT/plugins/arckit-claude" \
  --plugin-dir "$REPO_ROOT/plugins/arckit-agent-architecture" \
  --print "list /arckit:agent-* commands available" 2>&1)

AGENT_COMMANDS=(
  "agent-design"
  "agent-governance"
  "agent-integration"
  "agent-inventory"
  "agent-maturity"
  "agent-security"
)

for cmd in "${AGENT_COMMANDS[@]}"; do
  if echo "$RESULT2" | grep -q "/arckit:$cmd"; then
    echo "✅ /arckit:$cmd"
  else
    echo "❌ /arckit:$cmd (MISSING)"
  fi
done

echo ""
echo "=== Testing standalone plugin installation ==="
# Test that each plugin can be installed as a standalone overlay
for plugin in arckit-togaf-adm arckit-agent-architecture; do
  echo "Testing $plugin..."
  PLUGINS="$REPO_ROOT/plugins/arckit-claude"
  if [ "$plugin" != "arckit-claude" ]; then
    PLUGINS="$PLUGINS,$REPO_ROOT/plugins/$plugin"
  fi
  
  RESULT=$(claude \
    --plugin-dir "$REPO_ROOT/plugins/arckit-claude" \
    --plugin-dir "$REPO_ROOT/plugins/$plugin" \
    --print "list available arckit commands" 2>&1)
  
  if echo "$RESULT" | grep -q "arckit"; then
    echo "✅ $plugin loads successfully"
  else
    echo "❌ $plugin failed to load"
    exit 1
  fi
done

echo ""
echo "✅ All plugin tests passed"
