"""Hero for 2026-05-28-v540-uk-nhs-clinical-safety-overlay.md.

Concept: the sector axis now has two cards.
  Row 1  - eyebrow + headline ("the second sector overlay").
  Row 2  - the same jurisdiction strip from the UK Finance hero so the
           continuity is obvious.
  Row 3  - two stacked sector cards on the left, both branching from the UK
           chip via dashed green lines. UK Finance (yesterday's launch, dimmed)
           on top, NHS Clinical Safety (today's launch, full strength) below.
  Row 3' - four NHS command chips on the right, each with its doc-type chip,
           command name, and primary regulatory anchor.
  Footer - stat strip (commands, plugins, jurisdictions, sectors).

1200 x 630 (Open Graph standard). Dark background.
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

# Finance accent (used yesterday, dimmed today).
FIN_GREEN = (52, 211, 153)
FIN_GREEN_TEXT = (167, 243, 208)

# NHS accent. Avoid the literal NHS-blue brand colour (#005EB8) and pick a
# clinical teal / cyan that reads as "healthcare" without infringing.
NHS_BLUE = (56, 189, 248)
NHS_BLUE_TEXT = (186, 230, 253)

CRITICAL = (244, 63, 94)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle vertical gradient instead of the visible grid pattern ---
for y in range(HEIGHT):
    t = y / HEIGHT
    dim = int(8 * t)
    if dim:
        draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, dim))


def draw_gradient_bar(y_start, y_end, alpha):
    """Top / bottom accent stripe, indigo into NHS blue into green into gold."""
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.3:
            r, g, b = INDIGO
        elif t < 0.55:
            f = (t - 0.3) / 0.25
            r = int(INDIGO[0] + (NHS_BLUE[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (NHS_BLUE[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (NHS_BLUE[2] - INDIGO[2]) * f)
        elif t < 0.8:
            f = (t - 0.55) / 0.25
            r = int(NHS_BLUE[0] + (FIN_GREEN[0] - NHS_BLUE[0]) * f)
            g = int(NHS_BLUE[1] + (FIN_GREEN[1] - NHS_BLUE[1]) * f)
            b = int(NHS_BLUE[2] + (FIN_GREEN[2] - NHS_BLUE[2]) * f)
        else:
            f = (t - 0.8) / 0.2
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

font_sector_eyebrow = load_font(font_mono_paths, 10)
font_sector_name = load_font(font_bold_paths, 18)
font_sector_meta = load_font(font_mono_paths, 10)

font_cmd_name = load_font(font_mono_paths, 15)
font_cmd_meta = load_font(font_mono_paths, 11)
font_cmd_chip = load_font(font_mono_paths, 11)

font_footer_stat = load_font(font_bold_paths, 14)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block (left aligned) ---
draw.text((PAD, 30), "ARCKIT V5.4.0  ·  RELEASED 28 MAY 2026  ·  COMMUNITY OVERLAY",
          font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 54), "The second sector overlay.",
          font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 96), "NHS Clinical Safety.",
          font=font_title, fill=NHS_BLUE_TEXT)
draw.text((PAD, 146),
          "Patient safety stakes. SAFETY.md spec inherited verbatim. Marcus Baw as proposed co-maintainer.",
          font=font_subtitle, fill=TEXT_SECONDARY)

# --- Row 2: Jurisdiction strip (continuity with yesterday's hero) ---
STRIP_Y = 200
CHIP_W = 64
CHIP_H = 36
CHIP_GAP = 18
STRIP_TOTAL_W = 8 * CHIP_W + 7 * CHIP_GAP
STRIP_LEFT = (WIDTH - STRIP_TOTAL_W) // 2

draw.text((STRIP_LEFT - 10, STRIP_Y + CHIP_H // 2), "JURISDICTION  →",
          font=font_axis_label, fill=TEXT_TERTIARY, anchor="rm")

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
uk_chip_bottom_y = STRIP_Y + CHIP_H

for idx, (code, ring) in enumerate(jurisdictions):
    cx0 = STRIP_LEFT + idx * (CHIP_W + CHIP_GAP)
    cy0 = STRIP_Y
    cx1 = cx0 + CHIP_W
    cy1 = cy0 + CHIP_H
    is_uk = code == "UK"
    border_w = 3 if is_uk else 2

    if is_uk:
        shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow)
        sdraw.rounded_rectangle((cx0 + 3, cy0 + 5, cx1 + 3, cy1 + 5),
                                radius=8, fill=(0, 0, 0, 120))
        img.alpha_composite(shadow)

    draw.rounded_rectangle((cx0, cy0, cx1, cy1),
                           radius=8, fill=(22, 27, 34, 255),
                           outline=ring + (255,), width=border_w)
    cx_mid = (cx0 + cx1) // 2
    draw.text((cx_mid, cy0 + CHIP_H // 2 - 1), code,
              font=font_juris_code, fill=ring, anchor="mm")

    if is_uk:
        uk_chip_centre_x = cx_mid


# --- Sector axis: two cards on the left, dashed branch lines from UK chip ---

def dashed_line(x1, y1, x2, y2, colour, dash=10, gap=6, width=2, alpha=200):
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
                  fill=colour + (alpha,), width=width)
        pos += dash + gap


SECTOR_X0 = PAD + 40
SECTOR_W = 360
SECTOR_X1 = SECTOR_X0 + SECTOR_W
SECTOR_CENTRE_X = (SECTOR_X0 + SECTOR_X1) // 2

# --- Sector card 1: UK Finance (yesterday, dimmed) ---
FIN_Y0 = 290
FIN_H = 70
FIN_Y1 = FIN_Y0 + FIN_H

# Branch line from UK chip down to this card (dimmed green).
dashed_line(uk_chip_centre_x, uk_chip_bottom_y,
            uk_chip_centre_x, FIN_Y0 + FIN_H // 2 - 1,
            FIN_GREEN, alpha=110)
dashed_line(uk_chip_centre_x, FIN_Y0 + FIN_H // 2 - 1,
            SECTOR_X0, FIN_Y0 + FIN_H // 2 - 1,
            FIN_GREEN, alpha=110)

# Card itself (dimmed, no shadow).
draw.rounded_rectangle((SECTOR_X0, FIN_Y0, SECTOR_X1, FIN_Y1),
                       radius=10, fill=(20, 24, 30, 255),
                       outline=FIN_GREEN + (170,), width=2)
draw.text((SECTOR_X0 + 18, FIN_Y0 + 14), "YESTERDAY  ·  v5.3.0",
          font=font_sector_eyebrow, fill=FIN_GREEN_TEXT)
draw.text((SECTOR_X0 + 18, FIN_Y0 + 30), "arckit-uk-finance",
          font=font_sector_name, fill=TEXT_SECONDARY)
draw.text((SECTOR_X1 - 18, FIN_Y0 + FIN_H // 2 - 1), "Payments  ·  4 cmds",
          font=font_sector_meta, fill=TEXT_TERTIARY, anchor="rm")

# --- Sector card 2: NHS (today, full strength) ---
NHS_Y0 = 386
NHS_H = 116
NHS_Y1 = NHS_Y0 + NHS_H

# Branch line from UK chip down past the UK Finance card to NHS card.
# A vertical drop, then horizontal jog to NHS card centre.
elbow_x = uk_chip_centre_x
elbow_y = NHS_Y0 - 18
dashed_line(uk_chip_centre_x, FIN_Y1, elbow_x, elbow_y, NHS_BLUE)
dashed_line(elbow_x, elbow_y, SECTOR_CENTRE_X, elbow_y, NHS_BLUE)
dashed_line(SECTOR_CENTRE_X, elbow_y, SECTOR_CENTRE_X, NHS_Y0, NHS_BLUE)

draw.text((elbow_x + 14, (FIN_Y1 + elbow_y) // 2 - 1), "↓  SECTOR",
          font=font_axis_label, fill=NHS_BLUE_TEXT, anchor="lm")

# Drop shadow on the NHS card to mark it as the focus.
shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle((SECTOR_X0 + 4, NHS_Y0 + 6, SECTOR_X1 + 4, NHS_Y1 + 6),
                        radius=14, fill=(0, 0, 0, 130))
img.alpha_composite(shadow)

draw.rounded_rectangle((SECTOR_X0, NHS_Y0, SECTOR_X1, NHS_Y1),
                       radius=14, fill=(22, 27, 34, 255),
                       outline=NHS_BLUE + (255,), width=3)
draw.text((SECTOR_CENTRE_X, NHS_Y0 + 12),
          "TODAY  ·  SECTOR OVERLAY  ·  EXPERIMENTAL",
          font=font_sector_eyebrow, fill=NHS_BLUE_TEXT, anchor="mt")
draw.text((SECTOR_CENTRE_X, NHS_Y0 + 32), "arckit-uk-nhs",
          font=font_sector_name, fill=TEXT_PRIMARY, anchor="mt")
draw.text((SECTOR_CENTRE_X, NHS_Y0 + 60),
          "Clinical safety  ·  DCB0129 / 0160 / DTAC / MDR",
          font=font_sector_meta, fill=TEXT_SECONDARY, anchor="mt")
draw.text((SECTOR_CENTRE_X, NHS_Y0 + 80),
          "4 cmds  ·  recipe: uk-nhs-clinical-safety  ·  44 targets",
          font=font_sector_meta, fill=TEXT_TERTIARY, anchor="mt")
draw.text((SECTOR_CENTRE_X, NHS_Y0 + 98),
          "co-maintainer (proposed): Dr Marcus Baw",
          font=font_sector_meta, fill=NHS_BLUE_TEXT, anchor="mt")

# --- Right column: four command chips ---
CMD_X0 = SECTOR_X1 + 56
CMD_W = WIDTH - CMD_X0 - PAD
CMD_ROW_H = 40
CMD_ROW_GAP = 8
CMD_TOP = NHS_Y0 - 40   # align column header above the NHS card top edge

draw.text((CMD_X0, CMD_TOP),
          "FOUR COMMANDS  ·  TWO DOC-TYPES  ·  CLINICAL + REGULATORY",
          font=font_axis_label, fill=TEXT_TERTIARY)

commands = [
    ("uk-nhs-dcb0129",        "SAFETY", "DCB0129 manufacturer · ISO 14971", NHS_BLUE, NHS_BLUE_TEXT),
    ("uk-nhs-dcb0160",        "SAFETY", "DCB0160 deployer · HSCA s250",     NHS_BLUE, NHS_BLUE_TEXT),
    ("uk-nhs-dtac",           "NHSDTAC", "DTAC v3 · 5 sections + AI annex",  GOLD,     (250, 215, 76)),
    ("uk-mdr-classification", "NHSMDR",  "UK MDR 2002 · EU MDR 2017/745",   CRITICAL, (254, 205, 211)),
]

CMD_PANEL_TOP = CMD_TOP + 18
for idx, (cmd, doc_type, anchor, ring, text_col) in enumerate(commands):
    ry0 = CMD_PANEL_TOP + idx * (CMD_ROW_H + CMD_ROW_GAP)
    ry1 = ry0 + CMD_ROW_H
    rx0 = CMD_X0
    rx1 = CMD_X0 + CMD_W

    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((rx0 + 2, ry0 + 3, rx1 + 2, ry1 + 3),
                            radius=8, fill=(0, 0, 0, 100))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((rx0, ry0, rx1, ry1),
                           radius=8, fill=(22, 27, 34, 255),
                           outline=ring + (255,), width=2)

    chip_w = 82
    chip_x0 = rx0 + 10
    chip_y0 = ry0 + 8
    chip_x1 = chip_x0 + chip_w
    chip_y1 = ry1 - 8
    draw.rounded_rectangle((chip_x0, chip_y0, chip_x1, chip_y1),
                           radius=5, fill=ring + (255,))
    draw.text(((chip_x0 + chip_x1) // 2, (chip_y0 + chip_y1) // 2 - 1),
              doc_type, font=font_cmd_chip, fill=(13, 17, 23), anchor="mm")

    draw.text((chip_x1 + 12, ry0 + CMD_ROW_H // 2 - 1),
              "/" + cmd, font=font_cmd_name, fill=text_col, anchor="lm")

    draw.text((rx1 - 12, ry0 + CMD_ROW_H // 2 - 1),
              anchor, font=font_cmd_meta, fill=TEXT_SECONDARY, anchor="rm")

# --- Footer stat strip ---
FOOTER_Y = HEIGHT - 58
draw.text((PAD, FOOTER_Y),
          "143 commands  ·  10 marketplace plugins  ·  8 jurisdictions  ·  2 sectors",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "arckit.org  ·  claude plugin install arckit arckit-uk-nhs",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                        "2026-05-28-v540-uk-nhs-clinical-safety-overlay-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
