"""Generate the hero image for the "Is Max Effort Worth It?" testing article.

Requirements on Opus 5.5 at high and max (cost, minutes, requirements) on the
left, the template finding on the right. Same house style as the sibling
generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-is-max-effort-worth-it.py
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
d.text((76, 66), "ARCKIT · TESTING", font=font(28, True, True), fill=CYAN)
d.text((76, 108), "Is max effort worth it?", font=font(64, True), fill=TEXT)
d.text((76, 184), "53 test runs on Opus 5.5 and Sonnet 5.5. About $150. Max mostly bought length; the fix was the templates.",
       font=font(24), fill=MUTED)

# Left panel: requirements on Opus 5.5, high vs max
px, py, pw, ph = 76, 250, 700, 470
rrect((px, py, px + pw, py + ph), 22, fill=PANEL, outline=LINE, width=2)
d.text((px + 28, py + 24), "REQUIREMENTS · OPUS 5.5", font=font(20, True, True), fill=GOLD)
rows = [
    ("Cost", 2.90, 9.82, "$2.90", "$9.82", 10.0),
    ("Minutes", 12, 48, "12", "48", 50.0),
    ("Requirements", 100, 100, "100", "100", 110.0),
]
bx, bw = px + 210, 330
y = py + 86
for label, hi, mx, hs, ms, scale in rows:
    d.text((px + 28, y + 14), label, font=font(24, True), fill=TEXT)
    for i, (v, s, col, tag) in enumerate(((hi, hs, CYAN, "high"), (mx, ms, VIOLET, "max"))):
        yy = y + i * 44
        L = int(bw * v / scale)
        rrect((bx, yy, bx + L, yy + 32), 8, fill=col)
        d.text((bx + L + 12, yy + 2), f"{tag}  {s}", font=font(20, True, True), fill=col)
    y += 124

# Right panel: the finding
qx, qw = 800, 724
rrect((qx, py, qx + qw, py + ph), 22, fill=(18, 22, 28), outline=GREEN, width=3)
d.text((qx + 28, py + 24), "THE REAL PROBLEM", font=font(20, True, True), fill=GREEN)
lines = [
    ("13 of 55 templates", TEXT, 34, True),
    ("contradicted their own commands.", MUTED, 24, False),
    ("", MUTED, 12, False),
    ("Requirements: 1 in 30 examples", TEXT, 28, True),
    ("had acceptance criteria.", MUTED, 24, False),
    ("", MUTED, 12, False),
    ("Fixed templates at high effort:", TEXT, 28, True),
    ("every requirement complete,", GREEN, 24, True),
    ("in 4 of 4 runs.", GREEN, 24, True),
]
ty = py + 76
for text, col, size, bold in lines:
    if text:
        d.text((qx + 28, ty), text, font=font(size, bold), fill=col)
    ty += size + 14

# Footer
d.text((76, H - 52), "ArcKit · The Enterprise Architecture Governance Harness · github.com/tractorjuice/arc-kit", font=font(17, False, True), fill=DIM)

out = Path(__file__).with_name("2026-09-29-is-max-effort-worth-it-hero.png")
img.save(out, optimize=True)
print(f"wrote {out}")
