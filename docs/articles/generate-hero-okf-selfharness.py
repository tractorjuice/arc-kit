"""Generate hero PNGs for the OKF and Self-Harness articles."""

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
GREEN = (52, 211, 153)
VIOLET = (139, 92, 246)
RED = (248, 113, 113)


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


def base_canvas():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for x in range(0, W, 40):
        d.line((x, 0, x, H), fill=(18, 24, 31), width=1)
    for y in range(0, H, 40):
        d.line((0, y, W, y), fill=(18, 24, 31), width=1)
    for x in range(W):
        t = x / W
        if t < 0.34:
            col = GOLD
        elif t < 0.67:
            f = (t - 0.34) / 0.33
            col = tuple(int(GOLD[i] + (CYAN[i] - GOLD[i]) * f) for i in range(3))
        else:
            f = (t - 0.67) / 0.33
            col = tuple(int(CYAN[i] + (VIOLET[i] - CYAN[i]) * f) for i in range(3))
        d.line((x, 0, x, 6), fill=col)
        d.line((x, H - 5, x, H), fill=tuple(max(0, c - 35) for c in col))
    return img, d


def rrect(d, box, radius=18, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def pill(d, xy, text, fill, text_fill=TEXT):
    x, y = xy
    pad_x = 18
    bbox = d.textbbox((0, 0), text, font=font(18, True, True))
    tw = bbox[2] - bbox[0]
    rrect(d, (x, y, x + tw + pad_x * 2, y + 36), 18, fill=fill)
    d.text((x + pad_x, y + 9), text, font=font(18, True, True), fill=text_fill)
    return x + tw + pad_x * 2


def arrow(d, start, end, color, width=5):
    d.line((start, end), fill=color, width=width)
    ex, ey = end
    sx, sy = start
    if ex >= sx:
        pts = [(ex, ey), (ex - 18, ey - 10), (ex - 18, ey + 10)]
    else:
        pts = [(ex, ey), (ex + 18, ey - 10), (ex + 18, ey + 10)]
    d.polygon(pts, fill=color)


def draw_okf():
    img, d = base_canvas()
    d.text((76, 70), "ARCKIT  |  OPEN KNOWLEDGE FORMAT", font=font(28, True, True), fill=CYAN)
    d.text((76, 112), "Governed artifacts. Portable knowledge.", font=font(60, True), fill=TEXT)
    d.text(
        (76, 184),
        "Export and import OKF bundles without replacing ArcKit's native governance model.",
        font=font(26),
        fill=MUTED,
    )

    rrect(d, (80, 292, 460, 682), 24, fill=PANEL, outline=GOLD, width=3)
    d.text((112, 330), "NATIVE ARCKIT", font=font(22, True, True), fill=GOLD)
    rows = [
        ("ARC-001-ADR-001-v1.0.md", CYAN),
        ("Document Control", GREEN),
        ("Traceability hooks", VIOLET),
        ("Health checks", GOLD),
    ]
    y = 390
    for label, color in rows:
        rrect(d, (112, y, 426, y + 52), 12, fill=PANEL_2, outline=LINE)
        d.rectangle((128, y + 17, 148, y + 35), fill=color)
        d.text((164, y + 14), label, font=font(17, True), fill=TEXT)
        y += 66

    rrect(d, (575, 320, 1025, 650), 24, fill=(18, 22, 28), outline=CYAN, width=3)
    d.text((622, 356), "OKF BOUNDARY", font=font(25, True, True), fill=CYAN)
    d.text((622, 396), "export-okf  /  import-okf", font=font(28, True), fill=TEXT)
    middle_rows = [
        ("portable frontmatter", CYAN),
        ("index + export log", GREEN),
        ("review report", GOLD),
        ("RSCH import notes", VIOLET),
    ]
    y = 458
    for label, color in middle_rows:
        pill(d, (622, y), label, (30, 39, 51), color)
        y += 44

    rrect(d, (1140, 292, 1520, 682), 24, fill=PANEL, outline=VIOLET, width=3)
    d.text((1172, 330), "OKF CONSUMERS", font=font(22, True, True), fill=(196, 181, 253))
    consumers = [
        ("knowledge catalogues", CYAN),
        ("research agents", GREEN),
        ("static visualizers", GOLD),
        ("other Markdown tools", VIOLET),
    ]
    y = 390
    for label, color in consumers:
        rrect(d, (1172, y, 1484, y + 52), 12, fill=PANEL_2, outline=LINE)
        d.ellipse((1192, y + 16, 1212, y + 36), fill=color)
        d.text((1230, y + 14), label, font=font(18, True), fill=TEXT)
        y += 66

    arrow(d, (462, 486), (570, 486), GOLD)
    arrow(d, (1028, 486), (1136, 486), VIOLET)
    d.text((512, 448), "export", font=font(18, True, True), fill=GOLD, anchor="mm")
    d.text((1082, 448), "share", font=font(18, True, True), fill=VIOLET, anchor="mm")
    d.text((800, 703), "native ARC remains canonical; OKF is the exchange layer", font=font(24, True), fill=TEXT, anchor="mm")

    d.line((80, 770, 1520, 770), fill=LINE, width=2)
    stats = [
        ("export", "portable bundle"),
        ("import", "review gate"),
        ("opt-in", "source frontmatter"),
        ("Git", "diffable knowledge"),
    ]
    x = 80
    for value, label in stats:
        d.text((x, 802), value, font=font(34, True), fill=GOLD if value == "export" else TEXT)
        d.text((x, 844), label, font=font(18, True, True), fill=MUTED)
        x += 340

    out = "docs/articles/2026-06-19-okf-compatibility-workflows-hero.png"
    img.save(out)
    print(f"wrote {out}")


def draw_self_harness():
    img, d = base_canvas()
    d.text((76, 70), "ARCKIT  |  SELF-HARNESS AUTORESEARCH", font=font(28, True, True), fill=GREEN)
    d.text((76, 112), "The harness learns from its own traces.", font=font(58, True), fill=TEXT)
    d.text(
        (76, 184),
        "Mine failures, propose minimal edits, validate on held-out tasks, keep only robust improvements.",
        font=font(26),
        fill=MUTED,
    )

    steps = [
        ("TRACE", "tool calls\\ntokens\\nartifacts", CYAN),
        ("MINE", "failure\\nclusters", RED),
        ("PROPOSE", "prompt\\nagent\\nhook", GOLD),
        ("VALIDATE", "held-in\\nheld-out", GREEN),
        ("KEEP", "small\\nreviewable\\ndiff", VIOLET),
    ]
    x0 = 72
    y0 = 300
    card_w = 258
    gap = 38
    centers = []
    for i, (title, body, color) in enumerate(steps):
        x = x0 + i * (card_w + gap)
        rrect(d, (x, y0, x + card_w, y0 + 250), 22, fill=PANEL, outline=color, width=3)
        d.text((x + 28, y0 + 30), title, font=font(24, True, True), fill=color)
        for j, line in enumerate(body.split("\\n")):
            d.text((x + 28, y0 + 88 + j * 42), line, font=font(25, True), fill=TEXT)
        centers.append((x + card_w, y0 + 125))
        if i < len(steps) - 1:
            arrow(d, (x + card_w + 6, y0 + 125), (x + card_w + gap - 8, y0 + 125), color, 4)

    rrect(d, (140, 620, 1460, 735), 22, fill=(18, 22, 28), outline=LINE, width=2)
    d.text((180, 650), "ACCEPTANCE RULE", font=font(20, True, True), fill=GREEN)
    d.text((180, 688), "held-in >= 0  +  held-out >= 0  +  max(delta) > threshold", font=font(28, True), fill=TEXT)
    d.text((1268, 650), "NO OVERFIT", font=font(20, True, True), fill=GOLD, anchor="mm")
    rrect(d, (1212, 676, 1406, 716), 14, fill=(30, 39, 51), outline=GOLD, width=2)
    d.text((1309, 696), "keep / discard", font=font(18, True, True), fill=GOLD, anchor="mm")

    d.line((80, 792, 1520, 792), fill=LINE, width=2)
    stats = [
        ("4", "optimization modes"),
        ("traces", "evidence first"),
        ("clusters", "weakness mining"),
        ("held-out", "generalization gate"),
    ]
    x = 80
    for value, label in stats:
        d.text((x, 818), value, font=font(34, True), fill=GREEN if value == "4" else TEXT)
        d.text((x, 860), label, font=font(18, True, True), fill=MUTED)
        x += 340

    out = "docs/articles/2026-06-19-self-harness-autoresearch-hero.png"
    img.save(out)
    print(f"wrote {out}")


if __name__ == "__main__":
    draw_okf()
    draw_self_harness()
