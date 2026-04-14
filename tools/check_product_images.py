# -*- coding: utf-8 -*-
"""Verify local img src on all products/**/index.html resolve to existing files."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "products"
IMG_SRC = re.compile(r'<img[^>]+src=(["\'])([^"\']+)\1', re.I)


def resolve(base_html: Path, src: str) -> Path | None:
    s = unquote(src.strip()).split("?")[0].split("#")[0]
    if not s or s.startswith("data:"):
        return None
    if s.startswith("http://") or s.startswith("https://"):
        return None
    if s.startswith("/"):
        return (ROOT / s.lstrip("/").replace("/", os.sep)).resolve()
    return (base_html.parent / s).resolve()


def main() -> int:
    missing: list[tuple[str, str, str]] = []
    external = 0
    local_ok = 0
    html_files = sorted(PRODUCTS.rglob("index.html"))
    for html in html_files:
        text = html.read_text(encoding="utf-8", errors="replace")
        for m in IMG_SRC.finditer(text):
            src = m.group(2)
            resolved = resolve(html, src)
            if resolved is None:
                if src.startswith("http"):
                    external += 1
                continue
            rel_page = html.relative_to(ROOT)
            if resolved.is_file():
                local_ok += 1
            else:
                try:
                    rel_miss = resolved.relative_to(ROOT)
                except ValueError:
                    rel_miss = resolved
                missing.append((str(rel_page), src, str(rel_miss)))

    print(f"Product pages: {len(html_files)}")
    print(f"Local images OK: {local_ok}")
    print(f"External / skipped src: {external}")
    print(f"Missing files: {len(missing)}")
    for page, src, path in missing:
        print(f"  PAGE: {page}")
        print(f"    src: {src}")
        print(f"    expected: {path}")
    return 1 if missing else 0


def is_product_visual_src(src: str) -> bool:
    s = unquote(src.lower())
    if "logo.webp" in s or "logo.png" in s:
        return False
    markers = (
        "/products/",
        "core product",
        "bar grating",
        "bar%20grating",
        "trench",
        "stair",
        "fiberglass",
        "frp",
        "accessories",
        "seo-apps",
        "/hero/",
        "/solutions/",
        "/home/",
        "welding-bar",
        "press-locked",
        "molded",
        "docs/assets",
    )
    return any(m in s for m in markers)


def report_gaps() -> None:
    """Pages with no <img> or card-media missing an image."""
    card_media = re.compile(
        r'<div class="card-media"[^>]*>([\s\S]*?)</div>',
        re.I,
    )
    for html in sorted(PRODUCTS.rglob("index.html")):
        text = html.read_text(encoding="utf-8", errors="replace")
        rel = str(html.relative_to(ROOT))
        n_img = len(re.findall(r"<img\b", text, re.I))
        if n_img == 0:
            print(f"NO_IMG: {rel}")
        for m in card_media.finditer(text):
            inner = m.group(1)
            if "<img" not in inner.lower():
                print(f"EMPTY_CARD_MEDIA: {rel}")
                break

        product_visuals = 0
        for m in IMG_SRC.finditer(text):
            if is_product_visual_src(m.group(2)):
                product_visuals += 1
        if product_visuals == 0:
            print(f"NO_PRODUCT_IMAGE (logo only or no assets): {rel}")


if __name__ == "__main__":
    code = main()
    print()
    print("--- Coverage (empty slots) ---")
    report_gaps()
    sys.exit(code)
