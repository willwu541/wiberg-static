/**
 * Builds technical-manual.html from tm-before.html + master-data1.js + tm-after.html
 * Run: node build-master-html.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const md = await import(pathToFileURL(path.join(__dirname, "master-data1.js")).href);

const { SPANS_MM, TABLE_E1_30MM, TABLE_E2_40MM, TABLE_E3_20MM, TABLE_E6_HEAVY } = md;

function fmtScaled(v) {
  if (v == null) return '<td class="center-td">—</td>';
  const x = v / 100;
  const s = x >= 100 ? String(Math.round(x)) : Number.isInteger(x) ? String(x) : x.toFixed(1);
  return `<td class="center-td">${s}</td>`;
}

function fmtMm(v) {
  if (v == null) return '<td class="center-td">—</td>';
  const s = v < 10 ? v.toFixed(2) : v.toFixed(1);
  return `<td class="center-td">${s}</td>`;
}

function thRow() {
  return `<tr><th>Bar</th>${SPANS_MM.map((s) => `<th>${s}</th>`).join("")}</tr>`;
}

function pageShell(pageNum, title, innerTable, footnote = "") {
  return `<div class="page landscape">
  <div class="page-header"><span class="logo-text">WIBERG</span><span class="doc-type">Technical Manual 2026</span></div>
  <div class="h3">${title}</div>
  ${innerTable}
  ${footnote ? `<div class="tiny italic mt-1">${footnote}</div>` : ""}
  <div class="page-footer"><span>www.wiberg-grating.com</span><span>${pageNum}</span></div>
</div>
`;
}

function rowsU(table) {
  return table
    .map((r) => {
      const bar = `${r.width_mm}×${r.thickness_mm}`;
      return `<tr><td>${bar}</td>${r.U.map(fmtScaled).join("")}</tr>`;
    })
    .join("\n");
}

function rowsC(table) {
  return table
    .map((r) => {
      const bar = `${r.width_mm}×${r.thickness_mm}`;
      return `<tr><td>${bar}</td>${r.C.map(fmtScaled).join("")}</tr>`;
    })
    .join("\n");
}

function tableE6Rows(key) {
  return TABLE_E6_HEAVY.map((r) => {
    const bar = `${r.width_mm}×${r.thickness_mm}`;
    const pitch = r.pitch_mm != null ? ` (${r.pitch_mm}p)` : "";
    const arr = r[key];
    return `<tr><td>${r.model}<br><span class="tiny">${bar}${pitch}</span></td>${arr.map(fmtScaled).join("")}</tr>`;
  }).join("\n");
}

function tableDeflRows(table, dKey) {
  return table
    .map((r) => {
      const bar = `${r.width_mm}×${r.thickness_mm}`;
      return `<tr><td>${bar}</td>${r[dKey].map(fmtMm).join("")}</tr>`;
    })
    .join("\n");
}

const footU =
  "Source: <code>master-data1.js</code> (YB/T Appendix E). <strong>U</strong> = uniform safe load (kN/m²), 50 mm crossbar pitch. Values stored ×100 in JS — display ÷100. Reference only; verify on stamped submittals.";

const footC =
  "Source: <code>master-data1.js</code>. <strong>C</strong> = line load (kN/m), 100 mm crossbar pitch. Stored ×100 in JS — display ÷100.";

const footE6 =
  "Source: <code>TABLE_E6_HEAVY</code> — heavy press-welded, 8×8 mm crossbar. U (kN/m²), C (kN/m); stored ×100 in JS.";

const footD =
  "Deflection (mm) under the tabulated safe U or C for the same row. <code>D_U</code> / <code>D_C</code> in <code>master-data1.js</code>.";

function buildLoadSection() {
  const parts = [];
  let p = 11;

  const t1u = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsU(TABLE_E1_30MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 1 — YB/T E.1 · 30 mm pitch · 50 mm cross · U (kN/m²)", t1u, footU));

  const t1c = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsC(TABLE_E1_30MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 2 — YB/T E.1 · 30 mm pitch · 100 mm cross · C (kN/m)", t1c, footC));

  const t2u = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsU(TABLE_E2_40MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 3 — YB/T E.2 · 40 mm pitch · 50 mm cross · U (kN/m²)", t2u, footU));

  const t2c = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsC(TABLE_E2_40MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 4 — YB/T E.2 · 40 mm pitch · 100 mm cross · C (kN/m)", t2c, footC));

  const t3u = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsU(TABLE_E3_20MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 5 — YB/T E.3 · 20 mm pitch · 50 mm cross · U (kN/m²)", t3u, footU));

  const t3c = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${rowsC(TABLE_E3_20MM)}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 6 — YB/T E.3 · 20 mm pitch · 100 mm cross · C (kN/m)", t3c, footC));

  const t6u = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${tableE6Rows("U")}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 7 — YB/T E.6 · Heavy-duty · U (kN/m²)", t6u, footE6));

  const t6c = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${tableE6Rows("C")}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 8 — YB/T E.6 · Heavy-duty · C (kN/m)", t6c, footE6));

  const du = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${tableDeflRows(TABLE_E1_30MM, "D_U")}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 9 — YB/T E.1 · Deflection (mm) under U · 50 mm cross", du, footD));

  const dc = `<table class="tbl tbl-compact mt-1"><thead>${thRow()}</thead><tbody>${tableDeflRows(TABLE_E1_30MM, "D_C")}</tbody></table>`;
  parts.push(pageShell(p++, "TABLE 10 — YB/T E.1 · Deflection (mm) under C · 100 mm cross", dc, footD));

  return parts.join("\n\n");
}

const beforePath = path.join(__dirname, "tm-before.html");
const afterPath = path.join(__dirname, "tm-after.html");
const outPath = path.join(__dirname, "technical-manual.html");

const before = fs.readFileSync(beforePath, "utf8");
const after = fs.readFileSync(afterPath, "utf8");
const mid = buildLoadSection();

const html = `${before}\n${mid}\n${after}`;
fs.writeFileSync(outPath, html, "utf8");
console.log("Wrote", outPath);
