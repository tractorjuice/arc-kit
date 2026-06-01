#!/usr/bin/env bash
set -euo pipefail
# Order matters: longer/compound names first so 'mod-secure' and 'gov-*' are
# rewritten before the 'secure'/'gov-reuse' substrings; the /arckit[:.] anchor
# plus \b prevents partial hits.
declare -a MAP=(
  "mod-secure:arckit-uk-mod:uk-mod-secure"
  "jsp-936:arckit-uk-mod:uk-mod-jsp-936"
  "service-assessment:arckit-uk:uk-service-assessment"
  "gcloud-search:arckit-uk:uk-gcloud-search"
  "gcloud-clarify:arckit-uk:uk-gcloud-clarify"
  "gov-code-search:arckit-uk:uk-gov-code-search"
  "gov-landscape:arckit-uk:uk-gov-landscape"
  "gov-reuse:arckit-uk:uk-gov-reuse"
  "ai-playbook:arckit-uk:uk-ai-playbook"
  "service-assessment:arckit-uk:uk-service-assessment"
  "tcop:arckit-uk:uk-tcop"
  "secure:arckit-uk:uk-secure"
  "dpia:arckit-uk:uk-dpia"
  "atrs:arckit-uk:uk-atrs"
  "dos:arckit-uk:uk-dos"
  "grants:arckit-uk:uk-grants"
)
for f in "$@"; do
  for m in "${MAP[@]}"; do
    IFS=: read -r old plug new <<<"$m"
    sed -i -E "s#/arckit[:.]${old}\b#/${plug}:${new}#g" "$f"
  done
done
