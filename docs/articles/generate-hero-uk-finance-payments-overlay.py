"""Hero for 2026-05-27-v530-uk-finance-payments-overlay.md.

Concept: a 2-D axis diagram.
  X axis  ─ JURISDICTION (eight prior community overlays sit along this row).
  Y axis  ─ SECTOR (UK Finance Payments breaks off perpendicularly, the new axis).
  Row 1  ─ eyebrow + headline (the "first sector overlay" framing).
  Row 2  ─ horizontal strip of eight jurisdiction-overlay chips.
  Row 3  ─ vertical column rising from the UK chip with one sector card,
           the four payments command IDs as small chips beneath it.
  Footer ─ stat strip (commands, plugins, sector vs jurisdiction count).

1200 x 630 (Open Graph standard). Dark background, GOV.UK-adjacent palette.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 110)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
CYAN = (34, 211, 238)
GREEN = (34, 197, 94)
GOLD = (234, 179, 8)
SALMON = (251, 113, 133)
PURPLE = (168, 85, 247)
ORANGE = (217, 119, 67)
TEAL = (45, 212, 191)

# Payments / finance accent — a desaturated emerald that reads as "money" without
# resembling any specific regulator's brand colour.
FIN_GREEN = (52, 211, 153)
FIN_GREEN_TEXT = (167, 243, 208)

# Stripe red for the CRITICAL safeguarding command chip.
CRITICAL = (244, 63, 94)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle radial vignette (replaces the visible grid hash pattern) ---
# A very faint top-to-bottom darkening keeps the background interesting without
# the regular cross-hatch the 28px grid produced.
for y in range(HEIGHT):
    t = y / HEIGHT
    dim = int(8 * t)
    if dim:
        draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, dim))


def draw_gradient_bar(y_start, y_end, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.3:
            r, g, b = INDIGO
        elif t < 0.6:
            f = (t - 0.3) / 0.3
            r = int(INDIGO[0] + (FIN_GREEN[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (FIN_GREEN[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (FIN_GREEN[2] - INDIGO[2]) * f)
        else:
            f = (t - 0.6) / 0.4
            r = int(FIN_GREEN[0] + (GOLD[0] - FIN_GREEN[0]) * f)
            g = int(FIN_GREEN[1] + (GOLD[1] - FIN_GREEN[1]) * f)
            b = int(FIN_GREEN[2] + (GOLD[2] - FIN_GREEN[2]) * f)
        draw.line([(x, y_start), (x, y_end)], fill=(r, g, b, alpha))


draw_gradient_bar(0, 4, 220)
draw_gradient_bar(HEIGHT - 3, HEIGHT, 170)

# --- Fonts ---
font_bold_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
font_regular_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
font_mono_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_eyebrow = load_font(font_mono_paths, 12)
font_title = load_font(font_bold_paths, 38)
font_subtitle = load_font(font_regular_paths, 16)

font_axis_label = load_font(font_mono_paths, 10)

font_juris_code = load_font(font_bold_paths, 14)
font_juris_label = load_font(font_regular_paths, 10)

font_sector_eyebrow = load_font(font_mono_paths, 11)
font_sector_name = load_font(font_bold_paths, 22)
font_sector_meta = load_font(font_mono_paths, 11)

font_cmd_name = load_font(font_mono_paths, 15)
font_cmd_meta = load_font(font_mono_paths, 11)
font_cmd_chip = load_font(font_mono_paths, 11)

font_footer_stat = load_font(font_bold_paths, 14)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block, left aligned ---
draw.text((PAD, 30), "ARCKIT V5.3.0  ·  RELEASED 27 MAY 2026  ·  COMMUNITY OVERLAY",
          font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 54), "The first sector overlay.",
          font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 96), "UK Finance Payments.",
          font=font_title, fill=FIN_GREEN_TEXT)
draw.text((PAD, 146),
          "Seven jurisdictions live along one axis. Sector now opens a new one.",
          font=font_subtitle, fill=TEXT_SECONDARY)

# --- Row 2: Horizontal strip of eight jurisdiction-overlay chips. ---
# Layout: chips run left to right, the UK chip is highlighted so the vertical
# branch can rise from it without ambiguity.
STRIP_Y = 220
CHIP_W = 64
CHIP_H = 40
CHIP_GAP = 18
# 8 chips, total width = 8*92 + 7*12 = 736+84 = 820. Centre at WIDTH/2.
STRIP_TOTAL_W = 8 * CHIP_W + 7 * CHIP_GAP
STRIP_LEFT = (WIDTH - STRIP_TOTAL_W) // 2

# Axis label on the left of the strip.
draw.text((STRIP_LEFT - 10, STRIP_Y + CHIP_H // 2), "JURISDICTION  →",
          font=font_axis_label, fill=TEXT_TERTIARY, anchor="rm")

# Order matches launch chronology so the UK anchor sits on the left, then the
# seven existing community overlays. The UK chip is the official baseline so it
# uses the indigo accent; the seven overlays are coloured per their card colour
# on the v5 plugin-split hero, kept consistent.
jurisdictions = [
    ("UK", INDIGO),
    ("UAE", PURPLE),
    ("FR", ORANGE),
    ("CA", SALMON),
    ("EU", GOLD),
    ("AT", CYAN),
    ("AU", GREEN),
    ("US", TEAL),
]

uk_chip_centre_x = None

for idx, (code, ring) in enumerate(jurisdictions):
    cx0 = STRIP_LEFT + idx * (CHIP_W + CHIP_GAP)
    cy0 = STRIP_Y
    cx1 = cx0 + CHIP_W
    cy1 = cy0 + CHIP_H

    is_uk = code == "UK"
    border_w = 3 if is_uk else 2
    fill = (22, 27, 34, 255)

    # Drop shadow on UK only so it visually anchors the vertical branch.
    if is_uk:
        shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow)
        sdraw.rounded_rectangle((cx0 + 3, cy0 + 5, cx1 + 3, cy1 + 5),
                                radius=8, fill=(0, 0, 0, 120))
        img.alpha_composite(shadow)

    draw.rounded_rectangle((cx0, cy0, cx1, cy1),
                           radius=8, fill=fill, outline=ring + (255,), width=border_w)
    cx_mid = (cx0 + cx1) // 2
    draw.text((cx_mid, cy0 + CHIP_H // 2 - 1), code,
              font=font_juris_code, fill=ring, anchor="mm")

    if is_uk:
        uk_chip_centre_x = cx_mid

# --- Branch line: UK chip → sector card (vertical drop). ---
SECTOR_X0 = PAD + 40
SECTOR_Y0 = 320
SECTOR_W = 360
SECTOR_H = 124
SECTOR_X1 = SECTOR_X0 + SECTOR_W
SECTOR_Y1 = SECTOR_Y0 + SECTOR_H
SECTOR_CENTRE_X = (SECTOR_X0 + SECTOR_X1) // 2

# An elbow line: down from UK chip, then a horizontal jog to the sector card centre.
# Dashed, FIN_GREEN, so the new axis reads as the new thing.
def dashed_line(x1, y1, x2, y2, colour, dash=10, gap=6, width=2):
    total = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
    if total == 0:
        return
    dx = (x2 - x1) / total
    dy = (y2 - y1) / total
    pos = 0
    while pos < total:
        end = min(pos + dash, total)
        draw.line([(x1 + dx * pos, y1 + dy * pos),
                   (x1 + dx * end, y1 + dy * end)],
                  fill=colour + (200,), width=width)
        pos += dash + gap


# UK chip bottom y is STRIP_Y + CHIP_H = 254.
elbow_x = uk_chip_centre_x
elbow_y = SECTOR_Y0 - 28
dashed_line(uk_chip_centre_x, STRIP_Y + CHIP_H, elbow_x, elbow_y, FIN_GREEN)
dashed_line(elbow_x, elbow_y, SECTOR_CENTRE_X, elbow_y, FIN_GREEN)
dashed_line(SECTOR_CENTRE_X, elbow_y, SECTOR_CENTRE_X, SECTOR_Y0, FIN_GREEN)

# Axis label on the line.
draw.text((elbow_x + 14, (STRIP_Y + CHIP_H + elbow_y) // 2 - 1), "↓  SECTOR",
          font=font_axis_label, fill=FIN_GREEN_TEXT, anchor="lm")

# --- Row 3a: Sector card ---
shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle((SECTOR_X0 + 4, SECTOR_Y0 + 6, SECTOR_X1 + 4, SECTOR_Y1 + 6),
                        radius=14, fill=(0, 0, 0, 130))
img.alpha_composite(shadow)

draw.rounded_rectangle((SECTOR_X0, SECTOR_Y0, SECTOR_X1, SECTOR_Y1),
                       radius=14, fill=(22, 27, 34, 255),
                       outline=FIN_GREEN + (255,), width=3)
draw.text((SECTOR_CENTRE_X, SECTOR_Y0 + 12),
          "NEW AXIS  ·  SECTOR OVERLAY  ·  EXPERIMENTAL",
          font=font_sector_eyebrow, fill=FIN_GREEN_TEXT, anchor="mt")
draw.text((SECTOR_CENTRE_X, SECTOR_Y0 + 36), "arckit-uk-finance",
          font=font_sector_name, fill=TEXT_PRIMARY, anchor="mt")
draw.text((SECTOR_CENTRE_X, SECTOR_Y0 + 70), "Payments  ·  PSPs · EMIs · PIs",
          font=font_sector_meta, fill=TEXT_SECONDARY, anchor="mt")
draw.text((SECTOR_CENTRE_X, SECTOR_Y0 + 92),
          "4 cmds  ·  recipe: uk-fs-payments  ·  11 targets",
          font=font_sector_meta, fill=TEXT_TERTIARY, anchor="mt")

# --- Row 3b: Four command chips on the right, with regulatory-anchor labels. ---
CMD_X0 = SECTOR_X1 + 56
CMD_W = WIDTH - CMD_X0 - PAD
CMD_ROW_H = 40
CMD_ROW_GAP = 8
CMD_TOP = SECTOR_Y0

commands = [
    ("uk-fs-sca-rts",        "FSSCA",  "PSRs 2017 · PS21/19",        FIN_GREEN, FIN_GREEN_TEXT),
    ("uk-fs-safeguarding",   "FSSAFE", "EMR 2011 · PS24/9 · CRITICAL", CRITICAL,  (254, 205, 211)),
    ("uk-fs-consumer-duty",  "FSCD",   "PS22/9 · FG22/5 · PRIN 2A",  GOLD,      (250, 215, 76)),
    ("uk-fs-ctp-dependency", "FSCTP",  "PS24/16 · FSMA 2023",        CYAN,      (125, 234, 246)),
]

# Anchor label above the column.
draw.text((CMD_X0, CMD_TOP - 16),
          "FOUR COMMANDS  ·  FOUR DOC-TYPES  ·  FOUR REGULATORY ANCHORS",
          font=font_axis_label, fill=TEXT_TERTIARY)

for idx, (cmd, doc_type, anchor, ring, text_col) in enumerate(commands):
    ry0 = CMD_TOP + idx * (CMD_ROW_H + CMD_ROW_GAP)
    ry1 = ry0 + CMD_ROW_H
    rx0 = CMD_X0
    rx1 = CMD_X0 + CMD_W

    # Slim shadow.
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((rx0 + 2, ry0 + 3, rx1 + 2, ry1 + 3),
                            radius=8, fill=(0, 0, 0, 100))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((rx0, ry0, rx1, ry1),
                           radius=8, fill=(22, 27, 34, 255),
                           outline=ring + (255,), width=2)

    # Doc-type chip on the left.
    chip_w = 82
    chip_x0 = rx0 + 10
    chip_y0 = ry0 + 8
    chip_x1 = chip_x0 + chip_w
    chip_y1 = ry1 - 8
    draw.rounded_rectangle((chip_x0, chip_y0, chip_x1, chip_y1),
                           radius=5, fill=ring + (255,))
    draw.text(((chip_x0 + chip_x1) // 2, (chip_y0 + chip_y1) // 2 - 1),
              doc_type, font=font_cmd_chip, fill=(13, 17, 23), anchor="mm")

    # Command name (mono, accent).
    draw.text((chip_x1 + 12, ry0 + CMD_ROW_H // 2 - 1),
              "/" + cmd, font=font_cmd_name, fill=text_col, anchor="lm")

    # Anchor label on the right.
    draw.text((rx1 - 12, ry0 + CMD_ROW_H // 2 - 1),
              anchor, font=font_cmd_meta, fill=TEXT_SECONDARY, anchor="rm")

# --- Footer stat strip ---
FOOTER_Y = HEIGHT - 58
draw.text((PAD, FOOTER_Y),
          "139 commands  ·  9 marketplace plugins  ·  8 jurisdictions  ·  1 sector",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "arckit.org  ·  claude plugin install arckit arckit-uk-finance",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                        "2026-05-27-v530-uk-finance-payments-overlay-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
