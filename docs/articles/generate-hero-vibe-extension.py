"""Generate hero image for the ArcKit v5.14 Mistral Vibe extension article."""

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

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def font(size, bold=False, mono=False):
    family = "DejaVuSansMono" if mono else "DejaVuSans"
    suffix = "-Bold" if bold else ""
    paths = [
        f"/usr/share/fonts/truetype/dejavu/{family}{suffix}.ttf",
        f"/usr/share/fonts/truetype/dejavu/{family}.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rrect(box, radius=18, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def glow_line(points, fill, width=4):
    for extra, alpha in [(12, 50), (8, 70), (4, 100)]:
        d.line(points, fill=(*fill, alpha), width=width + extra)
    d.line(points, fill=fill, width=width)


# Subtle grid
for x in range(0, W, 40):
    d.line((x, 0, x, H), fill=(18, 24, 31), width=1)
for y in range(0, H, 40):
    d.line((0, y, W, y), fill=(18, 24, 31), width=1)

# Accent bars
for x in range(W):
    t = x / W
    if t < 0.48:
        col = GOLD
    elif t < 0.72:
        f = (t - 0.48) / 0.24
        col = tuple(int(GOLD[i] + (CYAN[i] - GOLD[i]) * f) for i in range(3))
    else:
        f = (t - 0.72) / 0.28
        col = tuple(int(CYAN[i] + (VIOLET[i] - CYAN[i]) * f) for i in range(3))
    d.line((x, 0, x, 6), fill=col)
    d.line((x, H - 5, x, H), fill=tuple(max(0, c - 35) for c in col))

# Header
d.text((76, 70), "ARCKIT v5.14.0 RELEASE", font=font(28, True, True), fill=CYAN)
d.text((76, 112), "Mistral Vibe joins the harness", font=font(64, True), fill=TEXT)
d.text(
    (76, 188),
    "Generated skills, agents, templates and MCP config now publish to a standalone extension repo.",
    font=font(26),
    fill=MUTED,
)

# Left source repo
rrect((80, 290, 455, 665), 22, fill=PANEL, outline=LINE, width=2)
d.text((110, 324), "CANONICAL SOURCE", font=font(20, True, True), fill=GOLD)
d.text((110, 360), "plugins/arckit-claude", font=font(23, True), fill=TEXT)
source_rows = [
    ("commands", 68, CYAN),
    ("agents", 80, GREEN),
    ("templates", 92, GOLD),
    ("schemas", 56, VIOLET),
]
y = 420
for label, w, color in source_rows:
    rrect((112, y, 420, y + 44), 10, fill=PANEL_2, outline=LINE)
    d.text((132, y + 11), label, font=font(18, True, True), fill=TEXT)
    d.rectangle((292, y + 16, 292 + w, y + 28), fill=color)
    y += 58

# Converter core
rrect((560, 338, 995, 620), 24, fill=(18, 22, 28), outline=GOLD, width=3)
d.text((610, 374), "CONVERTER", font=font(24, True, True), fill=GOLD)
d.text((610, 412), "one source -> many AI CLI surfaces", font=font(22), fill=TEXT)
for i, label in enumerate(["Codex", "Gemini", "OpenCode", "Copilot", "Paperclip", "Vibe"]):
    x = 610 + (i % 3) * 120
    y = 472 + (i // 3) * 56
    fill = (30, 39, 51) if label != "Vibe" else (38, 28, 58)
    outline = VIOLET if label == "Vibe" else LINE
    rrect((x, y, x + 104, y + 36), 9, fill=fill, outline=outline)
    d.text((x + 13, y + 9), label, font=font(15, True), fill=TEXT if label != "Vibe" else (221, 214, 254))

# Right standalone repo
rrect((1100, 280, 1510, 700), 24, fill=PANEL, outline=VIOLET, width=3)
d.text((1134, 320), "STANDALONE REPO", font=font(20, True, True), fill=(196, 181, 253))
d.text((1134, 356), "tractorjuice/arckit-vibe", font=font(30, True), fill=TEXT)
tiles = [
    ("skills", CYAN),
    ("agent TOML", VIOLET),
    ("templates", GOLD),
    ("MCP config", GREEN),
]
y = 425
for label, color in tiles:
    rrect((1134, y, 1474, y + 52), 12, fill=PANEL_2, outline=LINE)
    d.ellipse((1154, y + 17, 1172, y + 35), fill=color)
    d.text((1190, y + 15), label, font=font(19, True), fill=TEXT)
    y += 66

# Flow lines and package nodes
glow_line([(455, 475), (545, 475), (560, 475)], GOLD, 5)
glow_line([(995, 475), (1066, 475), (1100, 475)], VIOLET, 5)
for cx, cy, color in [(505, 475, GOLD), (1046, 475, VIOLET)]:
    d.ellipse((cx - 15, cy - 15, cx + 15, cy + 15), fill=color)

# Footer stat strip
d.line((80, 760, 1510, 760), fill=LINE, width=2)
stats = [
    ("5.14.0", "release"),
    ("148", "Vibe skills"),
    ("19", "Vibe agents"),
    ("6", "generated extension repos"),
]
x = 80
for value, label in stats:
    d.text((x, 790), value, font=font(34, True), fill=GOLD if value == "5.14.0" else TEXT)
    d.text((x, 832), label, font=font(18, True, True), fill=MUTED)
    x += 300

img.save("docs/articles/2026-06-17-arckit-vibe-extension-hero.png")
print("wrote docs/articles/2026-06-17-arckit-vibe-extension-hero.png")
