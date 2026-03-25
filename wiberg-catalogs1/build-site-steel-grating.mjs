/**
 * Generates downloads/steel-grating-catalog/index.html
 * matching the main website layout (style.css, header, nav, footer).
 *
 * Run: node wiberg-catalogs1/build-site-steel-grating.mjs
 * (from the repo root, or cd wiberg-catalogs1 && node build-site-steel-grating.mjs)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const md = await import(pathToFileURL(path.join(__dirname, "master-data1.js")).href);

const {
  SPANS_MM,
  TABLE_E1_30MM,
  TABLE_E2_40MM,
  TABLE_E3_20MM,
  TABLE_E4_IBAR_30MM,
  TABLE_E5_IBAR_40MM,
  TABLE_E6_HEAVY,
  TABLE_E7_WIDTH_BY_BARS,
} = md;

const R = "../../"; // relative prefix from downloads/steel-grating-catalog/ to site root

// ── helpers ──

function esc(v) {
  if (v == null) return "—";
  const x = v / 100;
  return x >= 100 ? String(Math.round(x)) : Number.isInteger(x) ? String(x) : x.toFixed(1);
}

function fmtMm(v) {
  if (v == null) return "—";
  return v < 10 ? v.toFixed(2) : v.toFixed(1);
}

function spanHeaders() {
  return SPANS_MM.map((s) => `<th scope="col">${s}</th>`).join("");
}

function loadTableHTML(id, title, caption, rows) {
  return `
        <h3 id="${id}">${title}</h3>
        <div class="table-wrap">
          <table aria-label="${caption}">
            <thead><tr><th scope="col">Bearing bar</th>${spanHeaders()}</tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>`;
}

function flatBarRows(table, key, fmt) {
  return table
    .map((r) => {
      const label = `${r.width_mm}×${r.thickness_mm}`;
      const cells = r[key].map((v) => `<td>${fmt(v)}</td>`).join("");
      return `              <tr><th scope="row">${label}</th>${cells}</tr>`;
    })
    .join("\n");
}

function ibarRows(table, key, fmt) {
  return table
    .map((r) => {
      const label = `${r.width_mm}×${r.flange_t_mm}`;
      const cells = r[key].map((v) => `<td>${fmt(v)}</td>`).join("");
      return `              <tr><th scope="row">${label}</th>${cells}</tr>`;
    })
    .join("\n");
}

function heavyRows(key, fmt) {
  return TABLE_E6_HEAVY.map((r) => {
    const label = `${r.width_mm}×${r.thickness_mm}`;
    const cells = r[key].map((v) => `<td>${fmt(v)}</td>`).join("");
    return `              <tr><th scope="row">${r.model} <span style="font-weight:400;color:var(--muted);font-size:12px">${label}</span></th>${cells}</tr>`;
  }).join("\n");
}

function e7Block(title, obj) {
  const rows = Object.entries(obj)
    .map(([bars, [w3, w5]]) => `<tr><td>${bars}</td><td>${w3}</td><td>${w5}</td></tr>`)
    .join("\n              ");
  return `<div>
            <p class="text-small" style="font-weight:600;margin-bottom:var(--space-2);">${title}</p>
            <div class="table-wrap">
              <table aria-label="E.7 ${title}">
                <thead><tr><th>Bars</th><th>t ≈ 3</th><th>t ≈ 5</th></tr></thead>
                <tbody>
              ${rows}
                </tbody>
              </table>
            </div>
          </div>`;
}

// ── build load tables ──

const loadTables = [
  loadTableHTML("e1-u", "E.1 — 30 mm pitch · 50 mm cross · Uniform load U (kN/m²)",
    "YB/T E.1 uniform load 30mm pitch", flatBarRows(TABLE_E1_30MM, "U", esc)),
  loadTableHTML("e1-c", "E.1 — 30 mm pitch · 100 mm cross · Line load C (kN/m)",
    "YB/T E.1 line load 30mm pitch", flatBarRows(TABLE_E1_30MM, "C", esc)),
  loadTableHTML("e1-du", "E.1 — 30 mm pitch · Deflection under U (mm)",
    "YB/T E.1 deflection under U", flatBarRows(TABLE_E1_30MM, "D_U", fmtMm)),
  loadTableHTML("e1-dc", "E.1 — 30 mm pitch · Deflection under C (mm)",
    "YB/T E.1 deflection under C", flatBarRows(TABLE_E1_30MM, "D_C", fmtMm)),

  loadTableHTML("e2-u", "E.2 — 40 mm pitch · 50 mm cross · U (kN/m²)",
    "YB/T E.2 uniform load 40mm pitch", flatBarRows(TABLE_E2_40MM, "U", esc)),
  loadTableHTML("e2-c", "E.2 — 40 mm pitch · 100 mm cross · C (kN/m)",
    "YB/T E.2 line load 40mm pitch", flatBarRows(TABLE_E2_40MM, "C", esc)),

  loadTableHTML("e3-u", "E.3 — 20 mm pitch · 50 mm cross · U (kN/m²)",
    "YB/T E.3 uniform load 20mm pitch", flatBarRows(TABLE_E3_20MM, "U", esc)),
  loadTableHTML("e3-c", "E.3 — 20 mm pitch · 100 mm cross · C (kN/m)",
    "YB/T E.3 line load 20mm pitch", flatBarRows(TABLE_E3_20MM, "C", esc)),

  loadTableHTML("e4-u", "E.4 — I-bar · 30 mm pitch · U (kN/m²)",
    "YB/T E.4 I-bar uniform load", ibarRows(TABLE_E4_IBAR_30MM, "U", esc)),
  loadTableHTML("e4-c", "E.4 — I-bar · 30 mm pitch · C (kN/m)",
    "YB/T E.4 I-bar line load", ibarRows(TABLE_E4_IBAR_30MM, "C", esc)),

  loadTableHTML("e5-u", "E.5 — I-bar · 40 mm pitch · U (kN/m²)",
    "YB/T E.5 I-bar uniform load", ibarRows(TABLE_E5_IBAR_40MM, "U", esc)),
  loadTableHTML("e5-c", "E.5 — I-bar · 40 mm pitch · C (kN/m)",
    "YB/T E.5 I-bar line load", ibarRows(TABLE_E5_IBAR_40MM, "C", esc)),

  loadTableHTML("e6-u", "E.6 — Heavy-duty · U (kN/m²)",
    "YB/T E.6 heavy duty uniform load", heavyRows("U", esc)),
  loadTableHTML("e6-c", "E.6 — Heavy-duty · C (kN/m)",
    "YB/T E.6 heavy duty line load", heavyRows("C", esc)),
].join("\n");

// ── jump nav entries for load tables ──

const loadJumpLinks = [
  ["#e1-u", "E.1 U"],
  ["#e1-c", "E.1 C"],
  ["#e1-du", "E.1 δ(U)"],
  ["#e1-dc", "E.1 δ(C)"],
  ["#e2-u", "E.2 U"],
  ["#e2-c", "E.2 C"],
  ["#e3-u", "E.3 U"],
  ["#e3-c", "E.3 C"],
  ["#e4-u", "E.4 I-U"],
  ["#e4-c", "E.4 I-C"],
  ["#e5-u", "E.5 I-U"],
  ["#e5-c", "E.5 I-C"],
  ["#e6-u", "E.6 HD-U"],
  ["#e6-c", "E.6 HD-C"],
].map(([href, label]) => `<a href="${href}">${label}</a>`).join("\n            ");

// ── E.7 width table ──

const e7Section = `
        <h2 id="e7">Panel width by bar count (E.7)</h2>
        <p>Nominal panel widths in mm, based on bearing bar count and pitch, per YB/T 4001.1 Appendix E.7. Two columns per pitch: t ≈ 3 mm and t ≈ 5 mm bar thickness.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--space-5);">
          ${e7Block("30 mm pitch", TABLE_E7_WIDTH_BY_BARS.pitch_30mm)}
          ${e7Block("40 mm pitch", TABLE_E7_WIDTH_BY_BARS.pitch_40mm)}
          ${e7Block("20 mm pitch", TABLE_E7_WIDTH_BY_BARS.pitch_20mm)}
        </div>`;

// ── full page ──

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Steel Grating Catalog | Specifications, Models &amp; Load Tables | Wiberg Metal</title>
  <meta name="description" content="Complete steel bar grating catalog: press-welded specifications, common models, YB/T Appendix E load and deflection tables (30/40/20 mm pitch, I-bar, heavy-duty), panel width reference." />

  <link rel="canonical" href="https://wibergmetal.com/downloads/steel-grating-catalog/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Steel Grating Catalog | Wiberg Metal" />
  <meta property="og:description" content="Full specifications, common models, and YB/T load tables for press-welded steel bar grating." />
  <meta property="og:url" content="https://wibergmetal.com/downloads/steel-grating-catalog/" />

  <link rel="stylesheet" href="${R}assets/css/style.css" />
  <script src="${R}assets/js/main.js" defer></script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://wibergmetal.com/#organization", "name": "Wiberg Metal", "url": "https://wibergmetal.com/", "telephone": "+86 132 7317 7087", "email": "info@wibergmetal.com" },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wibergmetal.com/" },
          { "@type": "ListItem", "position": 2, "name": "Downloads", "item": "https://wibergmetal.com/downloads/" },
          { "@type": "ListItem", "position": 3, "name": "Steel Grating Catalog", "item": "https://wibergmetal.com/downloads/steel-grating-catalog/" }
        ]
      }
    ]
  }
  </script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="top-bar">
    <div class="container top-bar-inner">
      <div class="top-bar-left">
        <a href="mailto:info@wibergmetal.com">info@wibergmetal.com</a>
        <span class="top-bar-sep" aria-hidden="true">|</span>
        <a href="https://wa.me/8613273177087">+86 132 7317 7087</a>
        <span class="top-bar-sep" aria-hidden="true">|</span>
        <span>China Manufacturer</span>
      </div>
      <div class="top-bar-right social-links">
        <a href="#" aria-label="LinkedIn">LinkedIn</a>
        <span class="top-bar-sep" aria-hidden="true">&middot;</span>
        <a href="#" aria-label="YouTube">YouTube</a>
        <span class="top-bar-sep" aria-hidden="true">&middot;</span>
        <a href="#" aria-label="Facebook">Facebook</a>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${R}" aria-label="Wiberg Metal homepage">
        <img src="${R}assets/images/logo.webp" alt="Wiberg Metal" width="160" height="44" class="brand-logo" />
      </a>
      <nav class="nav" id="primary-nav" data-nav aria-label="Primary navigation">
        <div class="nav-dropdown">
          <a href="${R}products/" class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Products</a>
          <div class="nav-dropdown-menu">
            <a href="${R}products/bar-grating/">Bar Grating</a>
            <a href="${R}products/stair-treads/">Stair Treads</a>
            <a href="${R}products/trench-covers/">Trench Covers</a>
            <a href="${R}products/accessories/">Accessories</a>
            <a href="${R}products/frp-grating/">FRP Grating</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <a href="${R}solutions/" class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Solutions</a>
          <div class="nav-dropdown-menu">
            <a href="${R}solutions/applications/">Applications</a>
            <a href="${R}solutions/industries/">Industries</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <a href="${R}engineering/" class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Engineering</a>
          <div class="nav-dropdown-menu">
            <a href="${R}engineering/grating-terminology/">Grating Terminology</a>
            <a href="${R}engineering/product-spacing-guide/">Product Spacing Guide</a>
            <a href="${R}engineering/materials-finishes/">Materials and Finishes</a>
            <a href="${R}engineering/load-tables/">Load Tables</a>
            <a href="${R}engineering/load-calculator/">Load Calculator</a>
            <a href="${R}engineering/installation-fixings/">Installation and Fixings</a>
            <a href="${R}engineering/how-to-specify/">How to Specify</a>
            <a href="${R}engineering/faq/">FAQ</a>
            <a href="${R}engineering/standards/">Standards and References</a>
          </div>
        </div>
        <a href="${R}downloads/" aria-current="page">Downloads</a>
        <a href="${R}about/">About</a>
        <a href="${R}cases/">Projects</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn--primary" href="${R}rfq/">Request a Quote</a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-nav">Menu</button>
      </div>
    </div>
  </header>

  <main id="main">
    <section class="section section--tight">
      <div class="container stack">
        <div class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="${R}">Home</a> <span aria-hidden="true">/</span>
          <a href="${R}downloads/">Downloads</a> <span aria-hidden="true">/</span>
          <span>Steel Grating Catalog</span>
        </div>

        <header class="stack--sm">
          <h1>Steel Grating Catalog</h1>
          <p class="lead">Press-welded steel bar grating — specifications, common models, and full YB/T 4001.1 Appendix E load &amp; deflection tables for flat bar (30 / 40 / 20 mm pitch), I-bar, and heavy-duty series.</p>
          <nav class="product-jump" aria-label="On this page">
            <a href="#overview">Overview</a>
            <a href="#specs">Specifications</a>
            <a href="#models">Models</a>
            <a href="#design">Design notes</a>
            <a href="#e7">Width table</a>
            <a href="#load-tables">Load tables</a>
          </nav>
          <div class="btn-row">
            <a class="btn btn--primary" href="${R}rfq/">Request a Quote</a>
            <a class="btn btn--ghost" href="${R}products/bar-grating/">Bar Grating Products</a>
            <a class="btn btn--ghost" href="${R}engineering/load-tables/">Engineering Load Tables</a>
          </div>
        </header>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container stack">

        <h2 id="overview">Product overview</h2>
        <div class="product-media-grid">
          <figure>
            <img src="${R}docs/assets/catalog/s6-welded-panel.svg" width="360" height="240" alt="Schematic plan view of press-welded steel bar grating panel" />
            <figcaption class="text-small" style="margin-top:var(--space-2);color:var(--muted);">Press-welded panel — illustrative only.</figcaption>
          </figure>
          <figure>
            <img src="${R}docs/assets/catalog/s2-open-grid-detail.svg" width="320" height="240" alt="Cross-section detail of press-welded bearing bar and twisted cross bar" />
            <figcaption class="text-small" style="margin-top:var(--space-2);color:var(--muted);">Open-grid detail showing bearing and cross bar.</figcaption>
          </figure>
        </div>
        <p>Press-welded (electro-forged) steel bar grating: bearing bars and twisted square cross bars are resistance-welded at every intersection under approximately 1,000 kN forge pressure. The result is a permanently fused grid with high structural integrity, open area for ventilation, light and drainage, and predictable load paths for engineering design.</p>

        <h2 id="specs">Technical specifications</h2>
        <div class="table-wrap">
          <table aria-label="Steel grating specification parameters">
            <thead><tr><th scope="col">Parameter</th><th scope="col">Range / description</th></tr></thead>
            <tbody>
              <tr><th scope="row">Construction</th><td>Press-welded (electro-forged) at every crossing</td></tr>
              <tr><th scope="row">Material</th><td>Carbon steel Q235B / A36 / S235JR (stainless on request)</td></tr>
              <tr><th scope="row">Bearing bar height</th><td>20, 25, 30, 32, 40, 45, 50, 55, 60, 65, 70 mm</td></tr>
              <tr><th scope="row">Bearing bar thickness</th><td>2, 3, 4, 5 mm (6–10 mm for heavy-duty)</td></tr>
              <tr><th scope="row">Bearing pitch s₁</th><td>12.5, 15, 20, 25, 30, 34.3, 40 mm c/c</td></tr>
              <tr><th scope="row">Cross bar pitch s₂</th><td>25, 38.1, 50, 76.2, 100, 101.6 mm c/c</td></tr>
              <tr><th scope="row">Cross bar</th><td>Twisted square: 5, 6, 8, 10 mm</td></tr>
              <tr><th scope="row">Surface</th><td>Plain (smooth) or serrated (slip-resistant)</td></tr>
              <tr><th scope="row">Finish</th><td>Hot-dip galvanized (≥ 610 g/m²), untreated, powder coated, painted</td></tr>
              <tr><th scope="row">Panel size</th><td>Up to approx. 1,000 × 6,000 mm (custom available)</td></tr>
              <tr><th scope="row">Open area</th><td>65%–85% (varies with pitch)</td></tr>
              <tr><th scope="row">Tolerances &amp; standards</th><td>NAAMM MBG 531, EN ISO 24637, YB/T 4001.1</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Designation example</h3>
        <p><code>W-30-100, 30×5, Q235B, Serrated, Hot-Dip Galvanized</code> — welded, 30 mm bar pitch, 100 mm cross pitch, 30×5 mm bearing bar, carbon steel, serrated, HDG. YB/T model codes (e.g. G305/30/100W) may also be used.</p>

        <h2 id="models">Common models</h2>
        <p class="text-small" style="color:var(--muted);">Approximate weights for untreated, unbanded panels. HDG adds ~5–10%. T = twisted square cross bar. Ball = heel-proof clear opening.</p>
        <div class="table-wrap">
          <table aria-label="Common steel grating models">
            <thead>
              <tr>
                <th scope="col">Model</th><th scope="col">H mm</th><th scope="col">T mm</th>
                <th scope="col">s₁</th><th scope="col">s₂</th><th scope="col">Cross</th>
                <th scope="col">kg/m²</th><th scope="col">Open %</th><th scope="col">Ball</th><th scope="col">Use</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>WA253-30100</td><td>25</td><td>3</td><td>30</td><td>100</td><td>6T</td><td>~18</td><td>83</td><td>—</td><td>Standard</td></tr>
              <tr><td>WA255-30100</td><td>25</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~26</td><td>82</td><td>—</td><td>General</td></tr>
              <tr><td>WA305-30100</td><td>30</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~30</td><td>81</td><td>—</td><td>General</td></tr>
              <tr><td>WA305-3050</td><td>30</td><td>5</td><td>30</td><td>50</td><td>6T</td><td>~34</td><td>75</td><td>35 mm</td><td>Close mesh</td></tr>
              <tr><td>WA305-2050</td><td>30</td><td>5</td><td>20</td><td>50</td><td>6T</td><td>~45</td><td>65</td><td>20 mm</td><td>Pedestrian</td></tr>
              <tr><td>WA325-30100</td><td>32</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~33</td><td>81</td><td>—</td><td>General</td></tr>
              <tr><td>WA405-30100</td><td>40</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~39</td><td>80</td><td>—</td><td>Medium</td></tr>
              <tr><td>WA505-30100</td><td>50</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~48</td><td>79</td><td>—</td><td>Heavy</td></tr>
              <tr><td>WA605-30100</td><td>60</td><td>5</td><td>30</td><td>100</td><td>6T</td><td>~57</td><td>78</td><td>—</td><td>Heavy</td></tr>
              <tr><td>WA305-40100</td><td>30</td><td>5</td><td>40</td><td>100</td><td>6T</td><td>~21</td><td>85</td><td>—</td><td>Economy</td></tr>
              <tr><td>WA255-40100</td><td>25</td><td>5</td><td>40</td><td>100</td><td>6T</td><td>~19</td><td>86</td><td>—</td><td>Light</td></tr>
              <tr><td>WA305-50100</td><td>30</td><td>5</td><td>50</td><td>100</td><td>6T</td><td>~17</td><td>88</td><td>—</td><td>Open</td></tr>
              <tr><td>WA405-3050</td><td>40</td><td>5</td><td>30</td><td>50</td><td>6T</td><td>~44</td><td>74</td><td>35 mm</td><td>Cover</td></tr>
              <tr><td>WA505-3050</td><td>50</td><td>5</td><td>30</td><td>50</td><td>6T</td><td>~54</td><td>72</td><td>35 mm</td><td>HD Cover</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="design">Design notes</h2>
        <ul class="checklist">
          <li><strong>Simply supported:</strong> All tables below assume simply supported spans perpendicular to bearing bars. Span range: ${SPANS_MM[0]}–${SPANS_MM[SPANS_MM.length - 1]} mm in 200 mm steps.</li>
          <li><strong>U vs C:</strong> <strong>U</strong> tables are for 50 mm cross-bar pitch (uniform load, kN/m²). <strong>C</strong> tables are for 100 mm cross-bar pitch (line load, kN/m). This follows YB/T Appendix E conventions.</li>
          <li><strong>Safe loads:</strong> Values are safe working loads extracted from YB/T 4001.1-2007 Appendix E — they do not include national partial safety factors. Request stamped calculation sheets for code compliance.</li>
          <li><strong>Deflection:</strong> Typical limit is span/200 or stricter (owner specification governs). Serrated bars reduce effective depth slightly.</li>
          <li><strong>Continuous spans, dynamic loads, and vehicular wheel loads</strong> require project-specific analysis — contact Wiberg engineering.</li>
          <li><strong>Installation:</strong> Welded or clip-fixed. Removable grating per YB/T requires minimum 4 clips per panel. See <a href="${R}engineering/installation-fixings/">Installation and Fixings</a>.</li>
        </ul>

${e7Section}

        <h2 id="load-tables">Load &amp; deflection tables (YB/T 4001.1 Appendix E)</h2>
        <p>Spans in mm (column headers): ${SPANS_MM.join(", ")}. Bearing bar noted as depth × thickness (mm). "—" = beyond usable range for that bar size. Values from <code>master-data1.js</code>; reference only — verify on released submittals.</p>
        <nav class="product-jump" aria-label="Jump to load table" style="margin-bottom:var(--space-4);">
            ${loadJumpLinks}
        </nav>

${loadTables}

        <p class="product-note" style="margin-top:var(--space-5);"><strong>Disclaimer:</strong> Load and deflection values are extracted from YB/T 4001.1-2007 Appendix E for reference and design selection only. They do not constitute a compliance guarantee for any specific national code. Final engineering responsibility rests with the Engineer of Record. Contact Wiberg for project-specific stamped calculations and shop drawings.</p>

        <div class="btn-row">
          <a class="btn btn--primary" href="${R}rfq/">Request a Quote</a>
          <a class="btn btn--ghost" href="${R}engineering/load-tables/">Engineering Load Tables</a>
          <a class="btn btn--ghost" href="${R}downloads/">All Downloads</a>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="cta-strip">
          <div>
            <h2>Need a quotation?</h2>
            <p>Send product type, spacing, material, finish, panel size, quantity, and drawings.</p>
          </div>
          <a class="btn btn--primary" href="${R}rfq/">Request a Quote</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-title">Products</div>
          <ul class="footer-list">
            <li><a href="${R}products/bar-grating/">Bar Grating</a></li>
            <li><a href="${R}products/stair-treads/">Stair Treads</a></li>
            <li><a href="${R}products/trench-covers/">Trench Covers</a></li>
            <li><a href="${R}products/accessories/">Accessories</a></li>
            <li><a href="${R}products/frp-grating/">FRP Grating</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-title">Resources</div>
          <ul class="footer-list">
            <li><a href="${R}engineering/load-tables/">Load Tables</a></li>
            <li><a href="${R}engineering/how-to-specify/">How to Specify</a></li>
            <li><a href="${R}rfq/">RFQ</a></li>
            <li><a href="${R}downloads/">Downloads</a></li>
            <li><a href="${R}contact/">Contact</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-title">Company</div>
          <ul class="footer-list">
            <li><a href="${R}about/">About</a></li>
            <li><a href="${R}solutions/applications/">Applications</a></li>
            <li><a href="${R}solutions/industries/">Industries</a></li>
            <li><a href="${R}engineering/">Engineering</a></li>
            <li><a href="${R}contact/">Contact</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-title">Contact</div>
          <div class="footer-meta">
            <div><a href="mailto:info@wibergmetal.com">info@wibergmetal.com</a></div>
            <div><a href="https://wa.me/8613273177087">+86 132 7317 7087</a> (WhatsApp)</div>
            <div>Mon&ndash;Sat &middot; 09:00&ndash;18:00 (UTC+8)</div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; <span data-year></span> Wiberg Metal. All rights reserved.</div>
        <div class="footer-legal">
          <a href="${R}privacy/">Privacy Policy</a>
          <a href="${R}terms/">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>
`;

const outDir = path.join(root, "downloads", "steel-grating-catalog");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "index.html");
fs.writeFileSync(outPath, html, "utf8");
console.log("Wrote", outPath);
