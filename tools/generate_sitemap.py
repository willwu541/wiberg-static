"""Generate public/sitemap.xml from all index.html pages (excludes _site-dist, etc.)."""
from __future__ import annotations

import os
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUDE_DIRS = frozenset(
    {
        "_site-dist",
        ".git",
        ".github",
        "node_modules",
        "wiberg-catalogs1",
        "wiberg-catalogs",
        "catalog 1",
        "docs",
        "tools",
        ".cursor",
        "public",
    }
)
BASE = "https://wibergmetal.com"


def url_from_relpath(rel: str) -> str:
    rel = rel.replace(os.sep, "/")
    if rel == "index.html":
        return f"{BASE}/"
    return f"{BASE}/{rel[: -len('/index.html')]}/"


def priority_changefreq(rel: str) -> tuple[str, str]:
    rel = rel.replace(os.sep, "/").lower()
    if rel == "index.html":
        return "1.0", "weekly"
    if rel == "rfq/index.html":
        return "0.9", "weekly"
    if rel in ("products/index.html", "engineering/index.html", "solutions/index.html"):
        return "0.9", "weekly"
    if "contact" in rel:
        return "0.8", "monthly"
    if rel == "blog/index.html":
        return "0.75", "weekly"
    if rel.startswith("blog/"):
        return "0.65", "monthly"
    if rel.startswith(("products/", "engineering/", "solutions/")):
        return "0.8", "weekly"
    if rel.startswith("downloads/"):
        return "0.65", "monthly"
    if rel.startswith("about/"):
        return "0.7", "monthly"
    if rel.startswith("cases/"):
        return "0.6", "monthly"
    if rel.startswith(("ar/", "id/", "th/", "vi/")):
        if rel.count("/") <= 1:
            return "0.6", "monthly"
        return "0.55", "monthly"
    if rel in ("privacy/index.html", "terms/index.html"):
        return "0.3", "yearly"
    if "standards" in rel:
        return "0.5", "monthly"
    return "0.6", "monthly"


def main() -> None:
    entries: list[tuple[str, str, str, str]] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")]
        if "index.html" not in filenames:
            continue
        full = os.path.join(dirpath, "index.html")
        rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
        if rel.startswith("_"):
            continue
        mtime = os.path.getmtime(full)
        lastmod = datetime.fromtimestamp(mtime, tz=timezone.utc).strftime("%Y-%m-%d")
        loc = url_from_relpath(rel)
        pri, cf = priority_changefreq(rel)
        entries.append((loc, lastmod, cf, pri))

    entries.sort(key=lambda x: x[0])

    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    for loc, lastmod, cf, pri in entries:
        u = ET.SubElement(urlset, "url")
        ET.SubElement(u, "loc").text = loc
        ET.SubElement(u, "lastmod").text = lastmod
        ET.SubElement(u, "changefreq").text = cf
        ET.SubElement(u, "priority").text = pri

    out_dir = os.path.join(ROOT, "public")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "sitemap.xml")
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    tree.write(out_path, encoding="UTF-8", xml_declaration=True)
    print(f"Wrote {out_path} ({len(entries)} URLs)")


if __name__ == "__main__":
    main()
