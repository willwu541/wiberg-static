# -*- coding: utf-8 -*-
"""Extract structure hints from catalogs in this folder for analysis."""
import os
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from docx import Document
except ImportError:
    Document = None

ROOT = Path(__file__).resolve().parent
NS = {"w": "http://schemas.openformats.org/wordprocessingml/2006/main"}


def text_from_docx_xml(path: Path, max_chars: int = 12000) -> str:
    """Fallback: read word/document.xml without python-docx."""
    out = []
    with zipfile.ZipFile(path, "r") as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    for t in root.iter("{http://schemas.openformats.org/wordprocessingml/2006/main}t"):
        if t.text:
            out.append(t.text)
        if t.tail:
            out.append(t.tail)
    s = " ".join(out)
    s = re.sub(r"\s+", " ", s).strip()
    return s[:max_chars]


def analyze_docx(path: Path) -> dict:
    headings = []
    preview = ""
    if Document is not None:
        try:
            doc = Document(path)
            for p in doc.paragraphs[:200]:
                st = (p.style.name or "").lower()
                t = (p.text or "").strip()
                if not t:
                    continue
                if "heading" in st or st.startswith("title"):
                    headings.append(t[:200])
                if len(preview) < 8000:
                    preview += t + "\n"
        except Exception as e:
            preview = text_from_docx_xml(path) + f"\n[docx error: {e}]"
    else:
        preview = text_from_docx_xml(path)
    return {"headings": headings[:80], "preview": preview[:10000]}


def analyze_pdf(path: Path) -> dict:
    if not fitz:
        return {"error": "no fitz"}
    doc = fitz.open(path)
    toc = doc.get_toc(simple=True) or []
    # sample pages: first 12 + spread for long docs
    n = doc.page_count
    idxs = sorted(set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                       min(n - 1, n // 4), min(n - 1, n // 2), min(n - 1, 3 * n // 4), n - 1]))
    idxs = [i for i in idxs if 0 <= i < n][:20]
    chunks = []
    for i in idxs:
        t = doc.load_page(i).get_text("text") or ""
        t = re.sub(r"\n{3,}", "\n\n", t).strip()
        chunks.append(f"--- page {i + 1}/{n} ---\n{t[:3500]}")
    doc.close()
    return {
        "pages": n,
        "toc": toc[:60],
        "samples": "\n\n".join(chunks),
    }


def main():
    files = sorted(ROOT.iterdir(), key=lambda p: p.name.lower())
    report = []
    for p in files:
        if p.name.startswith("_") or p.suffix.lower() not in {".pdf", ".docx"}:
            continue
        report.append("\n" + "=" * 80)
        report.append(f"FILE: {p.name} ({p.stat().st_size // 1024} KB)")
        report.append("=" * 80)
        try:
            if p.suffix.lower() == ".pdf":
                d = analyze_pdf(p)
                if "error" in d:
                    report.append(str(d))
                    continue
                report.append(f"Pages: {d['pages']}")
                if d["toc"]:
                    report.append("TOC (first 60):")
                    for item in d["toc"]:
                        report.append(f"  {item}")
                else:
                    report.append("TOC: (none embedded)")
                report.append("\nTEXT SAMPLES:\n" + d["samples"])
            else:
                d = analyze_docx(p)
                report.append("HEADINGS (from styles, first 80):")
                for h in d["headings"]:
                    report.append(f"  • {h}")
                if not d["headings"]:
                    report.append("  (none detected)")
                report.append("\nPREVIEW:\n" + d["preview"][:12000])
        except Exception as e:
            report.append(f"ERROR: {e}")
    out = ROOT / "_extraction_report.txt"
    out.write_text("\n".join(report), encoding="utf-8", errors="replace")
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
