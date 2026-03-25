# catalog 1 — reference extractions

This folder is the **internal reference library** for catalog / standard PDFs and Word files.

## What is in git

- `_extract_catalogs.py` — scans this folder for `.pdf` / `.docx`, writes a merged text report.
- `_extraction_report.txt` — **output only** (large). Generated when the script is run with source files present.
- `README.md` — this note.

**Original PDFs and DOCX files are not committed** (size, licensing). Keep them on your machine or document storage and re-run the script when they change.

## What the report contains

The report aggregates text samples from whatever files were in the folder at extraction time — e.g. **YB/T 4001.1—2019** (Chinese industry standard for steel bar grating), plus various manufacturer and regional reference catalogs. Use it for **comparison and drafting**, not as the single source of truth for Wiberg legal binding data.

## Customer-facing catalog

Unified **YB/T 4001.1—2019** marking (§5), the standard’s **clause 5.2 example**, and the **§7.1.1.3** walkway clear-spacing limits are summarised on:

`docs/WIBERG-STEEL-GRATING-CATALOG.html` → **Specification & technical data** (`#catalog-spec-data`).

Load–span tables and other appendices from standards are **not** pasted there; use the Wiberg technical appendix **§13** and the **quotation** for numeric capacity tied to your order.

## Regenerate the report

```bash
cd "catalog 1"
pip install pymupdf python-docx   # optional; script has fallbacks
python _extract_catalogs.py
```
