from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
W, H = 1200, 630


def font(size, bold=False):
    names = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for name in names:
        path = Path(name)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def t(draw, xy, value, size, fill, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def pill(draw, xy, label, fill, fg="#07111f"):
    x, y = xy
    f = font(20, True)
    bbox = draw.textbbox((0, 0), label, font=f)
    width = bbox[2] - bbox[0] + 32
    draw.rounded_rectangle((x, y, x + width, y + 36), radius=18, fill=fill)
    draw.text((x + 16, y + 7), label, font=f, fill=fg)
    return width


def base():
    img = Image.new("RGB", (W, H), "#07111f")
    draw = ImageDraw.Draw(img)
    for y in range(H):
        mix = y / H
        draw.line((0, y, W, y), fill=(7, int(17 + 24 * mix), int(31 + 50 * mix)))
    for x in range(0, W, 90):
        draw.line((x, 0, x + 260, H), fill="#10233f", width=1)
    for y in range(35, H, 78):
        draw.line((0, y, W, y), fill="#0f294b", width=1)
    return img, draw


def save_svg(path, title, subtitle, accent, body):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="#07111f"/>
  <rect x="70" y="230" width="1060" height="250" rx="18" fill="#0b1f33" stroke="{accent}" stroke-width="2"/>
  <text x="72" y="150" fill="#f8fafc" font-family="Arial, sans-serif" font-size="54" font-weight="700">{title}</text>
  <text x="74" y="192" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="27">{subtitle}</text>
  {body}
</svg>
"""
    path.write_text(svg)


def oaa_hero():
    img, draw = base()
    x = 72
    x += pill(draw, (x, 56), "ARCKIT OAA", "#a7f3d0") + 16
    x += pill(draw, (x, 56), "5 COMMANDS", "#facc15") + 16
    pill(draw, (x, 56), "COMMUNITY", "#c4b5fd")
    t(draw, (72, 128), "Open Agile Architecture", 56, "#f8fafc", True)
    t(draw, (74, 195), "O-AA (C208) as versioned artefacts, in 2–4 week sprint windows", 27, "#cbd5e1")

    draw.rounded_rectangle((70, 230, 1130, 485), radius=18, fill="#0b1f33", outline="#a7f3d0", width=2)
    stages = [
        (170, 330, "Strategy", "#a7f3d0"),
        (375, 330, "Product", "#facc15"),
        (585, 330, "ADM Lite", "#7dd3fc"),
        (795, 330, "Security", "#fda4af"),
        (1005, 330, "Governance", "#c4b5fd"),
    ]
    for i in range(len(stages) - 1):
        x1, y1, _, _ = stages[i]
        x2, y2, _, _ = stages[i + 1]
        draw.line((x1 + 84, y1, x2 - 84, y2), fill="#d6e4ff", width=4)
    # Sprint loop: governance feeds the next sprint's strategy. Keep the arc
    # inside the panel (bottom 485) so it doesn't strike the codes line below.
    draw.arc((170, 340, 1005, 466), start=15, end=165, fill="#d6e4ff", width=4)
    draw.polygon([(168, 400), (202, 424), (196, 386)], fill="#d6e4ff")
    t(draw, (587, 440), "next sprint", 20, "#cbd5e1", True, anchor="mm")
    for cx, cy, label, fill in stages:
        draw.rounded_rectangle((cx - 84, cy - 30, cx + 84, cy + 30), radius=16, fill=fill)
        t(draw, (cx, cy), label, 20, "#07111f", True, anchor="mm")

    t(draw, (88, 532), "OASTR  |  OAPR  |  OAAL  |  OASEC  |  OAGOV", 25, "#f8fafc", True)
    t(draw, (88, 585), "oaa-full recipe  |  split from togaf-adm  |  MIT community overlay", 21, "#cbd5e1")

    img.save(ROOT / "2026-09-01-arckit-oaa-standalone-plugin-hero.png", optimize=True)
    save_svg(
        ROOT / "2026-09-01-arckit-oaa-standalone-plugin-hero.svg",
        "Open Agile Architecture",
        "O-AA (C208) as versioned artefacts, in 2–4 week sprint windows",
        "#a7f3d0",
        '<text x="88" y="532" fill="#f8fafc" font-family="Arial, sans-serif" font-size="25" font-weight="700">OASTR | OAPR | OAAL | OASEC | OAGOV</text>',
    )


if __name__ == "__main__":
    oaa_hero()
