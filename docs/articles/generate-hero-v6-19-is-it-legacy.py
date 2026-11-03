"""Generate the hero image for the ArcKit v6.19.0 release article.

The seven tests of the UK's updated definition of legacy IT, the three
outcomes, a dependency carrying Legacy to a new application, the separate
risk score, and a strip for the security fixes. Same house style as the
sibling generate-hero-*.py scripts.

The published hero is a redesigned version of this layout, supplied by the
maintainer on 2 November 2026 (1672x941). Running this script writes the
original draft over it, so don't run it unless you mean to replace that image.

    uv run --with pillow python docs/articles/generate-hero-v6-19-is-it-legacy.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
DIM = (88, 96, 110)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
VIOLET = (139, 92, 246)
GREEN = (52, 211, 153)
RED = (248, 113, 113)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def font(size, bold=False, mono=False):
    candidates = []
    if mono:
        candidates += [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
            "/System/Library/Fonts/Menlo.ttc",
        ]
    else:
        candidates += [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    for path in candidates:
        try:
            if path.endswith(".ttc"):
                return ImageFont.truetype(path, size, index=1 if bold else 0)
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rrect(box, radius=18, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(x0, y, x1, color, width=4):
    d.line((x0, y, x1 - 14, y), fill=color, width=width)
    d.polygon([(x1, y), (x1 - 16, y - 9), (x1 - 16, y + 9)], fill=color)


# Subtle grid
for x in range(0, W, 40):
    d.line((x, 0, x, H), fill=(18, 24, 31), width=1)
for y in range(0, H, 40):
    d.line((0, y, W, y), fill=(18, 24, 31), width=1)

# Accent bars: gold -> cyan -> violet
for x in range(W):
    t = x / W
    if t < 0.40:
        col = GOLD
    elif t < 0.70:
        f = (t - 0.40) / 0.30
        col = tuple(int(GOLD[i] + (CYAN[i] - GOLD[i]) * f) for i in range(3))
    else:
        f = (t - 0.70) / 0.30
        col = tuple(int(CYAN[i] + (VIOLET[i] - CYAN[i]) * f) for i in range(3))
    d.line((x, 0, x, 6), fill=col)
    d.line((x, H - 5, x, H), fill=tuple(max(0, c - 35) for c in col))

# Header
d.text((76, 62), "ARCKIT · v6.19.0", font=font(28, True, True), fill=CYAN)
d.text((76, 104), "Is it legacy?", font=font(64, True), fill=TEXT)
d.text(
    (76, 180),
    "Assess existing systems against the UK's updated definition of legacy IT, with evidence and owned actions.",
    font=font(24),
    fill=MUTED,
)

# Left: the seven tests
top = 250
rrect((76, top, 520, top + 420), 22, fill=PANEL, outline=LINE, width=2)
d.text((102, top + 22), "SEVEN TESTS", font=font(20, True, True), fill=GOLD)
tests = [
    "Out of support",
    "Missing or weak contracts",
    "Skills not there",
    "Can't meet user needs",
    "Unsuitable hardware",
    "Below cyber security minimums",
    "Relies on something legacy",
]
for i, label in enumerate(tests):
    y = top + 70 + i * 48
    d.ellipse((104, y + 8, 118, y + 22), fill=GOLD if i < 6 else RED)
    d.text((134, y), label, font=font(22), fill=TEXT)

# Middle: the three outcomes
mx, mw = 552, 470
d.text((mx, top + 2), "THREE OUTCOMES", font=font(20, True, True), fill=CYAN)
outcomes = [
    ("ACCEPTED", GREEN, "Within normal risk"),
    ("ACTION-REQUIRED", GOLD, "Legacy within 12 months without action"),
    ("LEGACY", RED, "Unacceptable risk: fix it urgently"),
]
for i, (name, color, note) in enumerate(outcomes):
    y = top + 40 + i * 90
    rrect((mx, y, mx + mw, y + 76), 16, fill=PANEL, outline=color, width=3)
    d.text((mx + 22, y + 10), name, font=font(24, True, True), fill=color)
    d.text((mx + 22, y + 44), note, font=font(19), fill=MUTED)

# Middle bottom: Legacy carried through a dependency
dy = top + 322
rrect((mx, dy, mx + mw, dy + 98), 16, fill=(18, 22, 28), outline=LINE, width=2)
d.text((mx + 20, dy + 12), "RISK FOLLOWS DEPENDENCIES", font=font(16, True, True), fill=DIM)
d.text((mx + 20, dy + 46), "New app", font=font(22, True), fill=TEXT)
arrow(mx + 126, dy + 60, mx + 222, RED)
d.text((mx + 234, dy + 46), "Unsupported system", font=font(22, True), fill=RED)

# Right: the separate score
rx = 1054
rrect((rx, top, 1524, top + 420), 22, fill=PANEL, outline=VIOLET, width=3)
d.text((rx + 26, top + 22), "A SEPARATE SCORE", font=font(20, True, True), fill=VIOLET)
d.text((rx + 26, top + 70), "16+", font=font(96, True), fill=RED)
d.text((rx + 26, top + 186), "out of 30 is red-rated", font=font(24), fill=TEXT)
d.text((rx + 26, top + 240), "Kept apart from the", font=font(21), fill=MUTED)
d.text((rx + 26, top + 270), "yes-or-no answer, as the", font=font(21), fill=MUTED)
d.text((rx + 26, top + 300), "guidance does", font=font(21), fill=MUTED)
d.text((rx + 26, top + 356), "Charts · bundled sources · verified", font=font(19, False, True), fill=DIM)

# Bottom strip: the security fixes
sy = 700
rrect((76, sy, 1524, sy + 112), 18, fill=(18, 22, 28), outline=GREEN, width=3)
d.text((104, sy + 18), "ALSO: A HARDER HARNESS", font=font(20, True, True), fill=GREEN)
items = [
    "Your site can't run code from your documents",
    "Edits can't be redirected onto credentials",
    "Untrusted text arrives as data",
]
ix = 104
for item in items:
    d.ellipse((ix, sy + 66, ix + 12, sy + 78), fill=GREEN)
    d.text((ix + 22, sy + 58), item, font=font(20), fill=TEXT)
    ix += 478

# Footer
d.text((76, H - 52), "ArcKit · The Enterprise Architecture Governance Harness · github.com/tractorjuice/arc-kit", font=font(17, False, True), fill=DIM)

out = Path(__file__).with_name("2026-11-02-arckit-v6-19-is-it-legacy-hero.png")
img.save(out, optimize=True)
print(f"wrote {out}")
