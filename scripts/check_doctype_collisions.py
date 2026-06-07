#!/usr/bin/env python3
"""Assert that every doc-type code in plugins/arckit-claude/config/doc-types.mjs is unique.

No JS parser dependency — use a regex on the keys of the KNOWN_TYPES object.
The format is stable:
    'CODE': { name: '...', category: '...', regime: '...' }
"""
import re
import sys
from pathlib import Path

src = Path("plugins/arckit-claude/config/doc-types.mjs").read_text()
codes = re.findall(r"^\s*'([A-Z][A-Z0-9_-]*)':\s*\{", src, re.MULTILINE)

if not codes:
    print("FAIL: no doc-type codes found — regex may be out of date", file=sys.stderr)
    sys.exit(2)

seen = {}
collisions = []
for c in codes:
    if c in seen:
        collisions.append(c)
    seen[c] = seen.get(c, 0) + 1

if collisions:
    print(f"FAIL: duplicate doc-type codes: {sorted(set(collisions))}", file=sys.stderr)
    sys.exit(1)

print(f"OK: {len(codes)} unique doc-type code(s)")
