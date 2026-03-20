#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
VERSION=$(echo "$input" | jq -r '.version')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 0')
TOTAL_USED=$(echo "$input" | jq -r '(.context_window.used_percentage // 0) * (.context_window.context_window_size // 0) / 100' | cut -d. -f1)

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; BLUE='\033[34m'; MAGENTA='\033[35m'; RESET='\033[0m'

# Pick bar color based on context usage
if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

FILLED=$((PCT / 10)); EMPTY=$((10 - FILLED))
BAR=$(printf "%${FILLED}s" | tr ' ' '█')$(printf "%${EMPTY}s" | tr ' ' '░')

BRANCH=""
git -C "$DIR" rev-parse --git-dir > /dev/null 2>&1 && BRANCH=" | 🌿 $(git -C "$DIR" branch --show-current 2>/dev/null)"

echo -e "${CYAN}[$MODEL]${RESET} 📁 ${DIR##*/}$BRANCH | ${BLUE}v${VERSION}${RESET}"
CONTEXT_K=$((CONTEXT_SIZE / 1000))
echo -e "${BAR_COLOR}${BAR}${RESET} ${PCT}% context used (${TOTAL_USED}/${CONTEXT_SIZE} tokens | ${CONTEXT_K}K window)"

# Rate limits (Claude.ai subscription only — fields absent when not applicable)
FIVE_PCT=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
FIVE_RESET=$(echo "$input" | jq -r '.rate_limits.five_hour.resets_at // empty')
WEEK_PCT=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')
WEEK_RESET=$(echo "$input" | jq -r '.rate_limits.seven_day.resets_at // empty')

RATE_LINE=""

if [ -n "$FIVE_PCT" ]; then
  FIVE_INT=$(printf '%.0f' "$FIVE_PCT")
  if [ "$FIVE_INT" -ge 90 ]; then FIVE_COLOR="$RED"
  elif [ "$FIVE_INT" -ge 70 ]; then FIVE_COLOR="$YELLOW"
  else FIVE_COLOR="$GREEN"; fi
  FIVE_RESET_FMT=""
  if [ -n "$FIVE_RESET" ]; then
    FIVE_RESET_FMT=" resets $(date -d "@${FIVE_RESET}" +%H:%M 2>/dev/null || date -r "${FIVE_RESET}" +%H:%M 2>/dev/null)"
  fi
  RATE_LINE="${RATE_LINE}${MAGENTA}5h:${RESET}${FIVE_COLOR}${FIVE_INT}%${RESET}${FIVE_RESET_FMT}"
fi

if [ -n "$WEEK_PCT" ]; then
  WEEK_INT=$(printf '%.0f' "$WEEK_PCT")
  if [ "$WEEK_INT" -ge 90 ]; then WEEK_COLOR="$RED"
  elif [ "$WEEK_INT" -ge 70 ]; then WEEK_COLOR="$YELLOW"
  else WEEK_COLOR="$GREEN"; fi
  WEEK_RESET_FMT=""
  if [ -n "$WEEK_RESET" ]; then
    WEEK_RESET_FMT=" resets $(date -d "@${WEEK_RESET}" +%Y-%m-%d 2>/dev/null || date -r "${WEEK_RESET}" +%Y-%m-%d 2>/dev/null)"
  fi
  [ -n "$RATE_LINE" ] && RATE_LINE="${RATE_LINE} | "
  RATE_LINE="${RATE_LINE}${MAGENTA}7d:${RESET}${WEEK_COLOR}${WEEK_INT}%${RESET}${WEEK_RESET_FMT}"
fi

[ -n "$RATE_LINE" ] && echo -e "Rate limits: ${RATE_LINE}"