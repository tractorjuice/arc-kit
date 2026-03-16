#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name // "unknown"')
DIR=$(echo "$input" | jq -r '.workspace.current_dir // ""')
PCT_RAW=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
VERSION=$(echo "$input" | jq -r '.version // ""')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 0')

# Handle null/empty used_percentage (no messages yet)
if [ -z "$PCT_RAW" ]; then
  PCT=0
else
  PCT=$(printf "%.0f" "$PCT_RAW" 2>/dev/null || echo "0")
fi

# Calculate tokens used as integer via jq to avoid floating point/scientific notation issues
TOTAL_USED=$(echo "$input" | jq -r '
  (.context_window.current_usage.input_tokens // 0) +
  (.context_window.current_usage.cache_creation_input_tokens // 0) +
  (.context_window.current_usage.cache_read_input_tokens // 0)
')

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; BLUE='\033[34m'; RESET='\033[0m'

# Pick bar color based on context usage
if [ "$PCT" -ge 90 ] 2>/dev/null; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ] 2>/dev/null; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

FILLED=$((PCT / 10)); EMPTY=$((10 - FILLED))
BAR=$(printf "%${FILLED}s" | tr ' ' '█')$(printf "%${EMPTY}s" | tr ' ' '░')

BRANCH=""
if git -C "${DIR:-$(pwd)}" rev-parse --git-dir > /dev/null 2>&1; then
  BRANCH_NAME=$(git -C "${DIR:-$(pwd)}" --no-optional-locks branch --show-current 2>/dev/null)
  [ -n "$BRANCH_NAME" ] && BRANCH=" | branch:${BRANCH_NAME}"
fi

CONTEXT_K=$((CONTEXT_SIZE / 1000))

printf "${CYAN}[%s]${RESET} dir:%s%s | ${BLUE}v%s${RESET}\n" "$MODEL" "${DIR##*/}" "$BRANCH" "$VERSION"
printf "${BAR_COLOR}%s${RESET} %s%% context used (%s/%s tokens | %sK window)\n" "$BAR" "$PCT" "$TOTAL_USED" "$CONTEXT_SIZE" "$CONTEXT_K"