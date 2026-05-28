#!/usr/bin/env python3
"""Render PNG exports for ArcKit brand SVGs.

Run from repo root:
    python scripts/render-brand-pngs.py
"""

from pathlib import Path

import cairosvg


REPO_ROOT = Path(__file__).resolve().parent.parent
ASSETS = REPO_ROOT / "docs" / "assets"


def render(svg_path: Path, png_path: Path, width: int, height: int | None = None) -> None:
    png_path.parent.mkdir(parents=True, exist_ok=True)
    kwargs: dict[str, object] = {"output_width": width}
    if height is not None:
        kwargs["output_height"] = height
    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), **kwargs)
    size_kb = png_path.stat().st_size / 1024
    print(f"  {png_path.relative_to(REPO_ROOT)} ({size_kb:.1f} KB)")


def main() -> None:
    targets = [
        # Banners (580×155 native)
        ("arckit-banner-light.svg", "arckit-banner-light.png", 580, 155),
        ("arckit-banner-light.svg", "arckit-banner-light@2x.png", 1160, 310),
        ("arckit-banner-dark.svg", "arckit-banner-dark.png", 580, 155),
        ("arckit-banner-dark.svg", "arckit-banner-dark@2x.png", 1160, 310),
        # Horizontal lockups (570×130 native)
        ("ArcKit_Logo_Horizontal_Light.svg", "ArcKit_Logo_Horizontal_Light.png", 570, 130),
        ("ArcKit_Logo_Horizontal_Light.svg", "ArcKit_Logo_Horizontal_Light@2x.png", 1140, 260),
        ("ArcKit_Logo_Horizontal_Dark.svg", "ArcKit_Logo_Horizontal_Dark.png", 570, 130),
        ("ArcKit_Logo_Horizontal_Dark.svg", "ArcKit_Logo_Horizontal_Dark@2x.png", 1140, 260),
        # Stacked lockups (340×335 native — widened from 280 so wordmark fits)
        ("ArcKit_Logo_Stacked_Light.svg", "ArcKit_Logo_Stacked_Light.png", 340, 335),
        ("ArcKit_Logo_Stacked_Light.svg", "ArcKit_Logo_Stacked_Light@2x.png", 680, 670),
        ("ArcKit_Logo_Stacked_Dark.svg", "ArcKit_Logo_Stacked_Dark.png", 340, 335),
        ("ArcKit_Logo_Stacked_Dark.svg", "ArcKit_Logo_Stacked_Dark@2x.png", 680, 670),
        # Mark only (165×75 native)
        ("ArcKit_Mark_Light.svg", "ArcKit_Mark_Light.png", 165, 75),
        ("ArcKit_Mark_Light.svg", "ArcKit_Mark_Light@2x.png", 330, 150),
        ("ArcKit_Mark_Dark.svg", "ArcKit_Mark_Dark.png", 165, 75),
        ("ArcKit_Mark_Dark.svg", "ArcKit_Mark_Dark@2x.png", 330, 150),
        # OG / social card (1200×630)
        ("og-card.svg", "og-card.png", 1200, 630),
        ("og-card.svg", "og-card@2x.png", 2400, 1260),
        # Favicons — main from favicon.svg
        ("favicon.svg", "favicon-512.png", 512, 512),
        ("favicon.svg", "favicon-192.png", 192, 192),
        # Small variants for OS tabs from favicon-small.svg
        ("favicon-small.svg", "favicon-32.png", 32, 32),
        ("favicon-small.svg", "favicon-16.png", 16, 16),
    ]

    print(f"Rendering {len(targets)} PNGs to {ASSETS.relative_to(REPO_ROOT)}/...")
    for src, dst, width, height in targets:
        src_path = ASSETS / src
        dst_path = ASSETS / dst
        if not src_path.exists():
            print(f"  SKIP {dst} (source missing: {src})")
            continue
        render(src_path, dst_path, width, height)
    print("Done.")


if __name__ == "__main__":
    main()
