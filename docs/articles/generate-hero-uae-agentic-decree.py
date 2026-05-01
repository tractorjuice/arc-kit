"""Hero for 2026-04-30-uae-agentic-decree-arckit-v4-10.md.

Concept: three-tier policy stack showing how the toolkit operationalises the
Cabinet decree.
  Top:    The 23 April Cabinet decree (one bar)
  Middle: 4 Cabinet instruments (4 boxes)
  Bottom: 12 commands grouped by category, with arrows linking instruments
          to their corresponding commands.

Visually distinct from the launch hero's flat 4x3 grid by introducing the
top-down policy hierarchy.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (72, 79, 88)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
ORANGE = (217, 119, 67)
ORANGE_TEXT = (232, 149, 106)
PURPLE = (168, 85, 247)
PURPLE_TEXT = (192, 132, 252)
GREEN = (34, 197, 94)
GREEN_TEXT = (134, 239, 172)
GOLD = (234, 179, 8)
GOLD_TEXT = (250, 204, 21)
SALMON = (251, 113, 133)
SALMON_TEXT = (253, 164, 175)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle grid ---
for x in range(0, WIDTH, 28):
    draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 8), width=1)
for y in range(0, HEIGHT, 28):
    draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 8), width=1)


def draw_gradient_bar(y_start, y_end, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.25:
            r, g, b = INDIGO
        elif t < 0.5:
            f = (t - 0.25) / 0.25
            r = int(INDIGO[0] + (ORANGE[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (ORANGE[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (ORANGE[2] - INDIGO[2]) * f)
        elif t < 0.75:
            f = (t - 0.5) / 0.25
            r = int(ORANGE[0] + (PURPLE[0] - ORANGE[0]) * f)
            g = int(ORANGE[1] + (PURPLE[1] - ORANGE[1]) * f)
            b = int(ORANGE[2] + (PURPLE[2] - ORANGE[2]) * f)
        else:
            f = (t - 0.75) / 0.25
            r = int(PURPLE[0] + (GREEN[0] - PURPLE[0]) * f)
            g = int(PURPLE[1] + (GREEN[1] - PURPLE[1]) * f)
            b = int(PURPLE[2] + (GREEN[2] - PURPLE[2]) * f)
        draw.line([(x, y_start), (x, y_end)], fill=(r, g, b, alpha))


draw_gradient_bar(0, 4, 200)
draw_gradient_bar(HEIGHT - 3, HEIGHT, 150)

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


font_eyebrow = load_font(font_mono_paths, 11)
font_title = load_font(font_bold_paths, 30)
font_subtitle = load_font(font_regular_paths, 14)
font_badge_mono = load_font(font_mono_paths, 11)
font_tier_label = load_font(font_mono_paths, 10)
font_tier_main = load_font(font_bold_paths, 14)
font_tier_main_small = load_font(font_bold_paths, 12)
font_cmd = load_font(font_mono_paths, 10)
font_cmd_group = load_font(font_bold_paths, 10)
font_stat_value = load_font(font_bold_paths, 22)
font_stat_label = load_font(font_regular_paths, 10)
font_source = load_font(font_bold_paths, 12)
font_source_detail = load_font(font_regular_paths, 11)


# --- UAE flag (Pantone-matched, standard 1:2 proportions) ---
# PMS 485 red, PMS 348 green, black, white. Vertical red band on the left
# at 1/4 of the width; three equal horizontal bands (green/white/black) on
# the right.
UAE_RED = (206, 17, 38)
UAE_GREEN = (0, 122, 51)
UAE_BLACK = (0, 0, 0)
UAE_WHITE = (255, 255, 255)


def draw_uae_flag(x, y, w):
    """Draw the UAE flag at (x, y) with width w. Height is w/2 (1:2 ratio)."""
    h = w // 2
    red_w = w // 4
    band_h = h // 3

    # Red vertical band (left)
    draw.rectangle([(x, y), (x + red_w, y + h)], fill=UAE_RED)
    # Green band (top right)
    draw.rectangle([(x + red_w, y), (x + w, y + band_h)], fill=UAE_GREEN)
    # White band (middle right)
    draw.rectangle([(x + red_w, y + band_h), (x + w, y + 2 * band_h)], fill=UAE_WHITE)
    # Black band (bottom right)
    draw.rectangle([(x + red_w, y + 2 * band_h), (x + w, y + h)], fill=UAE_BLACK)
    # Subtle outline so the flag reads cleanly on the dark background
    draw.rectangle([(x, y), (x + w - 1, y + h - 1)], outline=(255, 255, 255, 40), width=1)


# --- Top-right badges ---
def draw_badge(text, x, y, fill_colour, outline_colour, text_colour):
    bb = draw.textbbox((0, 0), text, font=font_badge_mono)
    bw = bb[2] - bb[0] + 18
    bh = bb[3] - bb[1] + 12
    draw.rounded_rectangle(
        [(x, y), (x + bw, y + bh)],
        radius=5,
        fill=(*fill_colour, 13),
        outline=(*outline_colour, 90),
        width=1,
    )
    draw.text((x + 9, y + 4), text, fill=text_colour, font=font_badge_mono)
    return bw


badge_text = "ArcKit v4.10.0"
bb = draw.textbbox((0, 0), badge_text, font=font_badge_mono)
bw = bb[2] - bb[0] + 18
bx = WIDTH - bw - 40
by = 18
draw_badge(badge_text, bx, by, INDIGO, INDIGO, INDIGO_TEXT)

decree_text = "Cabinet · 23 Apr 2026"
bb = draw.textbbox((0, 0), decree_text, font=font_badge_mono)
ubw = bb[2] - bb[0] + 18
ubx = bx - ubw - 8
draw_badge(decree_text, ubx, by, GREEN, GREEN, GREEN_TEXT)

# UAE flag to the left of the badges (44px wide, 22px tall)
flag_w = 44
flag_x = ubx - flag_w - 10
flag_y = by + 1  # align vertically with the badge text baseline
draw_uae_flag(flag_x, flag_y, flag_w)

# --- Eyebrow + Title ---
tx, ty = 40, 52
draw.text((tx, ty), "OPERATIONALISING THE UAE AGENTIC DECREE", fill=INDIGO_TEXT, font=font_eyebrow)
draw.text((tx, ty + 22), "Decree → 4 Instruments → 12 Commands", fill=TEXT_PRIMARY, font=font_title)
draw.text((tx, ty + 60), "How ArcKit v4.10 maps the policy stack to an artefact pipeline.", fill=TEXT_SECONDARY, font=font_subtitle)


# --- Tier 1: The Decree ---
tier1_y = 158
tier1_h = 50
tier1_x = 40
tier1_w = WIDTH - 80

draw.rounded_rectangle(
    [(tier1_x, tier1_y), (tier1_x + tier1_w, tier1_y + tier1_h)],
    radius=8,
    fill=(*GOLD, 18),
    outline=(*GOLD, 150),
    width=1,
)
draw.text((tier1_x + 16, tier1_y + 8), "THE DECREE", fill=GOLD_TEXT, font=font_tier_label)
draw.text((tier1_x + 16, tier1_y + 24), "50% of UAE federal sectors on Agentic AI within 24 months", fill=TEXT_PRIMARY, font=font_tier_main)
right_text = "Taskforce: H.E. Al Gergawi"
bb = draw.textbbox((0, 0), right_text, font=font_tier_main_small)
draw.text((tier1_x + tier1_w - (bb[2] - bb[0]) - 16, tier1_y + 26), right_text, fill=TEXT_SECONDARY, font=font_tier_main_small)


# Connector down to tier 2
arrow_x = WIDTH // 2
arrow_y_start = tier1_y + tier1_h
arrow_y_end = arrow_y_start + 14
draw.line([(arrow_x, arrow_y_start), (arrow_x, arrow_y_end)], fill=(*GOLD, 130), width=2)
draw.polygon(
    [(arrow_x, arrow_y_end + 4), (arrow_x - 5, arrow_y_end - 2), (arrow_x + 5, arrow_y_end - 2)],
    fill=(*GOLD, 130),
)


# --- Tier 2: 4 Cabinet Instruments ---
tier2_y = 232
tier2_h = 60
tier2_gap = 12
tier2_x = 40
tier2_total_w = WIDTH - 80
tier2_box_w = (tier2_total_w - 3 * tier2_gap) // 4

instruments = [
    ("ZERO BUREAUCRACY", "Code for Government Services"),
    ("DIGITAL RECORDS", "Digital Records Policy"),
    ("DATA SHARING", "Collect once, use securely"),
    ("PRIORITIES ALIGNMENT", "Federal Priorities Guide"),
]
instrument_colours = [PURPLE, PURPLE, PURPLE, PURPLE]
instrument_text_colours = [PURPLE_TEXT, PURPLE_TEXT, PURPLE_TEXT, PURPLE_TEXT]

instrument_centres = []
for i, (label, sub) in enumerate(instruments):
    x = tier2_x + i * (tier2_box_w + tier2_gap)
    colour = instrument_colours[i]
    text_colour = instrument_text_colours[i]
    draw.rounded_rectangle(
        [(x, tier2_y), (x + tier2_box_w, tier2_y + tier2_h)],
        radius=6,
        fill=(*colour, 18),
        outline=(*colour, 150),
        width=1,
    )
    draw.text((x + 12, tier2_y + 10), label, fill=text_colour, font=font_tier_label)
    draw.text((x + 12, tier2_y + 28), sub, fill=TEXT_PRIMARY, font=font_tier_main_small)
    instrument_centres.append(x + tier2_box_w // 2)


# --- Tier 3: 12 Commands grouped by category ---
tier3_y = 340
group_h = 96
group_gap = 10
tier3_x = 40
tier3_total_w = WIDTH - 80

# Five groups: Data+Sec(4), Identity(1), Cabinet(4), AI(2), Procurement(1)
# Allocate widths proportional to count for visual balance
group_specs = [
    ("FEDERAL DATA + SECURITY", ORANGE, ORANGE_TEXT, [
        "uae-classification", "uae-pdpl", "uae-ias", "uae-cloud-residency"
    ], 4),
    ("IDENTITY", INDIGO, INDIGO_TEXT, ["uae-uaepass"], 1),
    ("CABINET INSTRUMENTS", PURPLE, PURPLE_TEXT, [
        "uae-zero-bureaucracy", "uae-digital-records", "uae-data-sharing", "uae-priorities-alignment"
    ], 4),
    ("AI GOVERNANCE", GOLD, GOLD_TEXT, [
        "uae-ai-charter", "uae-ai-autonomy-tier"
    ], 2),
    ("PROCUREMENT", SALMON, SALMON_TEXT, ["uae-procurement"], 1),
]
# Allocate widths: single-command groups need at least 120 to fit the longest
# command name ("uae-procurement"). Two-command groups: 180. Four-command
# groups split the remainder.
gap_total = group_gap * (len(group_specs) - 1)
single_w = 120
two_w = 180
single_count = sum(1 for g in group_specs if g[4] == 1)
two_count = sum(1 for g in group_specs if g[4] == 2)
four_count = sum(1 for g in group_specs if g[4] == 4)
remaining = tier3_total_w - gap_total - (single_count * single_w) - (two_count * two_w)
four_w = remaining // four_count if four_count else 0

current_x = tier3_x
group_centres = {}
cabinet_command_centres = []  # for arrows

for label, colour, text_colour, cmds, count in group_specs:
    if count == 1:
        box_w = single_w
    elif count == 2:
        box_w = two_w
    else:
        box_w = four_w

    # group container
    draw.rounded_rectangle(
        [(current_x, tier3_y), (current_x + box_w, tier3_y + group_h)],
        radius=6,
        fill=(*colour, 12),
        outline=(*colour, 100),
        width=1,
    )
    # group header
    draw.text((current_x + 8, tier3_y + 6), label, fill=text_colour, font=font_cmd_group)

    # commands list
    cmd_start_y = tier3_y + 22
    line_h = 14
    for i, cmd in enumerate(cmds):
        cy = cmd_start_y + i * line_h
        draw.text((current_x + 10, cy), cmd, fill=TEXT_PRIMARY, font=font_cmd)
        if label == "CABINET INSTRUMENTS":
            cabinet_command_centres.append((current_x + 10, cy + 5))

    group_centres[label] = current_x + box_w // 2
    current_x += box_w + group_gap


# Arrows from each Cabinet instrument (tier 2) down to its corresponding command (tier 3 cabinet group)
# Map instrument position to cabinet command y (each instrument lines up with one cabinet command)
cabinet_group_x_start = None
cabinet_group_x_end = None
running_x = tier3_x
for label, _, _, _, count in group_specs:
    if count == 1:
        box_w = single_w
    elif count == 2:
        box_w = two_w
    else:
        box_w = four_w
    if label == "CABINET INSTRUMENTS":
        cabinet_group_x_start = running_x
        cabinet_group_x_end = running_x + box_w
    running_x += box_w + group_gap

if cabinet_group_x_start is not None:
    cabinet_inner_w = cabinet_group_x_end - cabinet_group_x_start
    for i in range(4):
        # source x = centre of instrument i
        src_x = instrument_centres[i]
        # target x = corresponding command position in cabinet group
        tgt_x = cabinet_group_x_start + cabinet_inner_w * (i + 0.5) / 4
        # arrow from bottom of tier2 to top of tier3 cabinet group
        y_src = tier2_y + tier2_h
        y_tgt = tier3_y - 2
        # bezier-ish: vertical line with bend
        mid_y = (y_src + y_tgt) // 2
        draw.line([(src_x, y_src), (src_x, mid_y)], fill=(*PURPLE, 110), width=1)
        draw.line([(src_x, mid_y), (tgt_x, mid_y)], fill=(*PURPLE, 110), width=1)
        draw.line([(tgt_x, mid_y), (tgt_x, y_tgt)], fill=(*PURPLE, 110), width=1)
        # tiny arrow head
        draw.polygon(
            [(tgt_x, y_tgt + 3), (tgt_x - 3, y_tgt - 1), (tgt_x + 3, y_tgt - 1)],
            fill=(*PURPLE, 130),
        )


# --- Stats bar at bottom ---
stats_y = 478
stat_items = [
    ("12", "NEW COMMANDS"),
    ("4", "CABINET INSTRUMENTS"),
    ("8", "FEDERAL BASELINE"),
    ("80", "OFFICIAL TOTAL"),
]

stats_x_start = 40
stat_spacing = 165

for i, (value, label) in enumerate(stat_items):
    sx = stats_x_start + i * stat_spacing + stat_spacing // 2
    if i > 0:
        sep_x = stats_x_start + i * stat_spacing
        draw.line([(sep_x, stats_y), (sep_x, stats_y + 42)], fill=(255, 255, 255, 20), width=1)
    vbb = draw.textbbox((0, 0), value, font=font_stat_value)
    vw = vbb[2] - vbb[0]
    draw.text((sx - vw // 2, stats_y), value, fill=TEXT_PRIMARY, font=font_stat_value)
    lbb = draw.textbbox((0, 0), label, font=font_stat_label)
    lw = lbb[2] - lbb[0]
    draw.text((sx - lw // 2, stats_y + 30), label, fill=TEXT_TERTIARY, font=font_stat_label)


# --- Bottom-right callout ---
src_w = 320
src_h = 48
src_x = WIDTH - src_w - 40
src_y = stats_y - 2
draw.rounded_rectangle(
    [(src_x, src_y), (src_x + src_w, src_y + src_h)],
    radius=6,
    fill=(*GREEN, 12),
    outline=(*GREEN, 80),
    width=1,
)
draw.text((src_x + 16, src_y + 8), "Two years to deliver. Tooling now available.", fill=GREEN_TEXT, font=font_source)
draw.text((src_x + 16, src_y + 28), "Open source · 7 AI runtimes · install today", fill=TEXT_SECONDARY, font=font_source_detail)


# --- Bottom helper note (below stats) ---
note_y = HEIGHT - 50
note = "Each Cabinet instrument operationalised by one ArcKit command, sitting on the federal baseline of PDPL, IAS, residency, classification, identity and procurement."
draw.text((40, note_y), note, fill=TEXT_TERTIARY, font=font_subtitle)


# --- Save as RGB PNG ---
final = Image.new("RGB", (WIDTH, HEIGHT), BG)
final.paste(img, mask=img.split()[3])

output_path = "/workspaces/arc-kit/docs/articles/2026-04-30-uae-agentic-decree-arckit-v4-10-hero.png"
final.save(output_path, "PNG")
print(f"Hero image saved to {output_path}")
print(f"Size: {final.size[0]}x{final.size[1]}")
