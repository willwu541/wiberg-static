# -*- coding: utf-8 -*-
"""Insert lead product imagery on product pages that only had the site logo."""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "products"

# (relative path under products/, anchor after which we insert, HTML snippet)
# Anchor = unique string that appears once in file, immediately before insertion point.
PATCHES: list[tuple[str, str, str]] = [
    (
        "accessories/banding-bars/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/accessories/bracket.jpg" width="800" height="500" alt="Steel banding bar and edge trim at grating panel" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Typical edge banding / trim (illustrative).</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "accessories/hold-down-clips/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/accessories/quick-clip.jpg" width="800" height="500" alt="Hold-down clip hardware for steel grating panels" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Hold-down style clip (illustrative).</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "accessories/panel-joining-clips/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/accessories/clamp-buckle.jpg" width="800" height="500" alt="Panel joining clip for grating seams" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Joining / clamp hardware (illustrative).</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "accessories/toe-plates/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/accessories/kick-plate.jpg" width="800" height="500" alt="Steel toe plate at grating edge" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Kick / toe plate at open edge (illustrative).</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "bar-grating/ball-proof-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/i-bear-steel-grating/main-product-image.jpg" width="800" height="500" alt="Fine mesh steel bar grating for ball-proof and small-opening applications" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Close / fine mesh pattern—verify ball-proof rules against your standard.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/close-mesh-bar-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/i-bear-steel-grating/main-product-image.jpg" width="800" height="500" alt="Close mesh steel bar grating panel" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Close-spacing bearing bars for smaller openings.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/composite-steel-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/composite-steel-grating/main-product-image.jpg" width="800" height="500" alt="Composite steel grating with checker plate top" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Checker plate laminated to open mesh—drainage per detailing.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/heavy-duty-welded-bar-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/welding-bar-grating/main-product-image.jpg" width="800" height="500" alt="Heavy-duty welded steel bar grating for industrial traffic" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Heavy bar construction—always tie mesh to load tables for your span.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/serrated-bar-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/serrated-steel-grating/main-product-image.jpg" width="800" height="500" alt="Serrated steel bar grating for slip-resistant walkways" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Serrated bearing bar tops for wet or oily service.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/sherardized-steel-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/sherardized-steel-grating/angled-top-view.jpg" width="800" height="500" alt="Sherardized zinc diffusion coated steel grating" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Sherardized coating for small parts and selected meshes.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "bar-grating/untreated-grating/index.html",
        '<div class="container stack">\n\n        <p>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/Untreated%20-grating/top-view-1.jpg" width="800" height="500" alt="Untreated carbon steel bar grating before field coating" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Mill finish suitable for shop primer or site paint systems.</figcaption>
          </figure>
        </div>

        <p>''',
    ),
    (
        "frp-grating/molded-frp-grating/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/fiberglass-grating/angled-side-view-1.jpg" width="800" height="500" alt="Molded FRP fiberglass grating panel" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Molded FRP mesh—confirm resin system in RFQ.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "frp-grating/mini-mesh-frp-grating/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/fiberglass-grating/angled-side-view-2.jpg" width="800" height="500" alt="Mini-mesh FRP grating with tight openings" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Tighter mesh for pedestrian comfort and small debris control.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "frp-grating/chemical-resistant-frp-grating/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/fiberglass-grating/angled-side-view-3.jpg" width="800" height="500" alt="Chemical-resistant FRP grating for corrosive environments" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Vinyl ester / isophthalic options per chemical list.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "frp-grating/anti-slip-frp-grating/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/fiberglass-grating/angled-side-view-1.jpg" width="800" height="500" alt="Anti-slip grit surface on FRP grating" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Gritted top for wet service—state wear class if required.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "stair-treads/welded-stair-treads/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/stair%20tread/stair-tread-plate-v2/main-product-image.jpg" width="800" height="500" alt="Welded steel stair tread with open grating" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Fabricated tread—send stringer spacing with RFQ.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "stair-treads/serrated-stair-treads/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/stair%20tread/stair-tread-plate-v2/side-view.jpg" width="800" height="500" alt="Serrated steel stair tread for industrial stairs" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Serrated nosing / top for wet or oily stairs.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "stair-treads/bolted-stair-treads/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/stair%20tread/stair-tread-plate-v2/weld-point-detail.jpg" width="800" height="500" alt="Bolted or demountable stair tread construction detail" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Field-bolted options—confirm hardware grade in spec.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "stair-treads/custom-stair-treads/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/stair%20tread/stair-tread-plate-v2/main-product-image.jpg" width="800" height="500" alt="Custom fabricated industrial stair tread" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Custom geometry from approved shop drawings.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "trench-covers/standard-trench-covers/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/trench-cover/main-product-image.jpg" width="800" height="500" alt="Standard steel trench cover over drainage channel" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Typical light- to medium-duty cover—confirm load class in RFQ.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "trench-covers/heavy-duty-trench-covers/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/trench-cover/main-product-image.jpg" width="800" height="500" alt="Heavy-duty steel trench cover for vehicle traffic" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Thicker mesh / frame for fork trucks—state wheel loads.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "trench-covers/drainage-channel-covers/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/trench-cover/main-product-image.jpg" width="800" height="500" alt="Grating cover for modular drainage channel" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Coordinate free area with channel manufacturer data.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "trench-covers/custom-fabricated-covers/index.html",
        '<div class="container stack">\n\n        <h2>Product Description</h2>',
        '''<div class="container stack">

        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/trench-cover/main-product-image.jpg" width="800" height="500" alt="Custom fabricated trench or pit cover" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Notched / framed covers from approved fabrication drawings.</figcaption>
          </figure>
        </div>

        <h2>Product Description</h2>''',
    ),
    (
        "steel-grating/index.html",
        '      <div class="container stack">\n        <header class="stack--sm">\n          <h2>Product types</h2>',
        '''      <div class="container stack">
        <div class="product-media-grid product-media-grid--lead">
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../assets/images/products/Core%20Product%20Categories/bar-grating.jpg" width="800" height="500" alt="Industrial steel bar grating for platforms and walkways" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Welded and press-locked families—see bar grating for detailed models.</figcaption>
          </figure>
        </div>
        <header class="stack--sm">
          <h2>Product types</h2>''',
    ),
]


def main() -> None:
    for rel, old, new in PATCHES:
        path = PRODUCTS / rel.replace("/", os.sep)
        text = path.read_text(encoding="utf-8")
        if "product-media-grid--lead" in text:
            print("skip (already patched):", rel)
            continue
        if old not in text:
            raise SystemExit(f"Anchor not found in {rel}")
        path.write_text(text.replace(old, new, 1), encoding="utf-8", newline="\n")
        print("OK", rel)

    # Press-locked: add photo third column to existing grid
    pl = PRODUCTS / "bar-grating" / "press-locked-bar-grating" / "index.html"
    t = pl.read_text(encoding="utf-8")
    needle = '''            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Mechanical interlock at crossing.</figcaption>
          </figure>
        </div>'''
    photo = '''            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Mechanical interlock at crossing.</figcaption>
          </figure>
          <figure>
            <div class="img-wrap">
              <img loading="lazy" src="../../../assets/images/products/bar%20grating/Press-Locked%20Grating/main-product-image.jpg" width="800" height="500" alt="Press-locked steel bar grating panel photograph" />
            </div>
            <figcaption class="text-small" style="margin-top: var(--space-2); color: var(--muted);">Physical panel reference—compare with diagrams above.</figcaption>
          </figure>
        </div>'''
    if "Press-Locked%20Grating/main-product-image.jpg" in t:
        print("skip press-locked (photo present)")
    elif needle not in t:
        raise SystemExit("press-locked anchor missing")
    else:
        pl.write_text(t.replace(needle, photo, 1), encoding="utf-8", newline="\n")
        print("OK bar-grating/press-locked-bar-grating/index.html")


if __name__ == "__main__":
    main()
