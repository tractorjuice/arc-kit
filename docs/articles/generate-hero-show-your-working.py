"""Generate the hero image for the "Show Your Working" adopter-campaign article.

An adopters board with three listing options (named, anonymous, not listed)
and the three things adopters get back. Same house style as the sibling
generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-show-your-working.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
PANEL_2 = (17, 24, 32)
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
d.text((76, 66), "ARCKIT · COMMUNITY", font=font(28, True, True), fill=CYAN)
d.text((76, 108), "Show your working.", font=font(64, True), fill=TEXT)
d.text(
    (76, 184),
    "ArcKit collects no usage data, so the only way to know who uses it is to ask. Tell us, named or anonymously.",
    font=font(24),
    fill=MUTED,
)

# Three listing options
cols = [
    ("NAMED", GOLD, "Your organisation, and a line", "about what you use it for"),
    ("ANONYMOUS", CYAN, "Counted by sector only:", "\"a central government department\""),
    ("NOT LISTED", VIOLET, "Only the maintainer knows.", "Still shapes the roadmap."),
]
x0, top, colw, gap = 76, 262, 470, 22
for i, (title, color, l1, l2) in enumerate(cols):
    x = x0 + i * (colw + gap)
    rrect((x, top, x + colw, top + 200), 22, fill=PANEL, outline=color, width=3)
    d.ellipse((x + 26, top + 30, x + 44, top + 48), fill=color)
    d.text((x + 58, top + 24), title, font=font(26, True, True), fill=color)
    d.text((x + 26, top + 92), l1, font=font(21), fill=TEXT)
    d.text((x + 26, top + 126), l2, font=font(21), fill=MUTED)

# What you get back
ey = 500
rrect((76, ey, 1524, ey + 260), 22, fill=(18, 22, 28), outline=GREEN, width=3)
d.text((104, ey + 24), "WHAT YOU GET BACK", font=font(20, True, True), fill=GREEN)
gets = [
    ("Office hours", "Monthly, open call, bring", "the awkward questions"),
    ("Pilot workshop", "2 hours with your team,", "on your own project"),
    ("Case study", "Your voice, your problem,", "you approve every word"),
]
cx = 104
for name, a, b in gets:
    w = 454
    rrect((cx, ey + 70, cx + w, ey + 226), 12, fill=PANEL, outline=LINE)
    d.text((cx + 22, ey + 88), name, font=font(26, True), fill=TEXT)
    d.text((cx + 22, ey + 136), a, font=font(19), fill=MUTED)
    d.text((cx + 22, ey + 166), b, font=font(19), fill=MUTED)
    cx += w + 14

# Footer
d.text((76, H - 52), "ArcKit · The Enterprise Architecture Governance Harness · github.com/tractorjuice/arc-kit", font=font(17, False, True), fill=DIM)

out = Path(__file__).with_name("2026-09-23-show-your-working-hero.png")
img.save(out, optimize=True)
print(f"wrote {out}")
