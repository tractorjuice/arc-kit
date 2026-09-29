---
type: regex
pattern: "STRIDE[\\s\\S]*(Spoofing|Tampering|Repudiation|Information Disclosure|Denial of Service|Elevation of Privilege)"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-v1.0.md
---

The threat model is in the artefact, not quietly dropped. A model that writes the assessment but leaves out the part its safeguards dislike passes the file check and fails this one.
