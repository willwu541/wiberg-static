/**
 * master-data.js  — COMPLETE EDITION
 *
 * All grating load tables, specification data, and weights
 * extracted from project reference files.
 *
 * SOURCES:
 *   YB/T  - 原始文件.docx  (YB/T 4001.1-2007, Appendix E)
 *   NAAMM - mbg_531-24_ansi_approved.docx, mbg_534-24_final.docx
 *   VULCRAFT - Vulcraft_Grating_Manual_Aug_23.docx (NAAMM MBG 534-19)
 *   McNICHOLS - McNICHOLS-2018-Gratings-Catalog_Web.docx
 *   WEBFORGE - webforge-access-03-2025.docx
 *
 * METRIC TABLES (YB/T 4001.1-2007):
 *   SPANS_MM                 — shared span axis [200…3000 mm, step 200]
 *   TABLE_E1_30MM            — flat bar, 30 mm pitch
 *   TABLE_E2_40MM            — flat bar, 40 mm pitch
 *   TABLE_E3_20MM            — flat bar, 20 mm pitch
 *   TABLE_E4_IBAR_30MM       — I-bar, 30 mm pitch
 *   TABLE_E5_IBAR_40MM       — I-bar, 40 mm pitch
 *   TABLE_E6_HEAVY           — heavy-load, 40 mm pitch
 *   TABLE_E7_WIDTH_BY_BARS   — bar count → nominal panel width
 *
 * IMPERIAL TABLES (NAAMM / Vulcraft):
 *   VULCRAFT_SPANS_IN        — [24,30,36,42,48,54,60,66,72,78,84,90,96] inches
 *   VULCRAFT_19W4_SMOOTH/SERRATED
 *   VULCRAFT_15W4_SMOOTH
 *   VULCRAFT_11W4_SMOOTH
 *   VULCRAFT_PANEL_WIDTHS
 *
 * McNICHOLS:
 *   MCNICHOLS_GW_SPANS_IN    — [24,30,36,42,48,54,60,66,72,84,96] inches
 *   MCNICHOLS_GHB_SPANS_IN   — [12,18,24,30,36,42,48,54,60,66,72,78,84,90,96] inches
 *   MCNICHOLS_GW_STEEL       — GW series (19-W-4), 1-3/16" bar pitch
 *   MCNICHOLS_GHB_STEEL      — GHB heavy-duty series, 1/4" bars
 *   MCNICHOLS_GW_WEIGHTS_PSF
 *   MCNICHOLS_GHB_WEIGHTS_PSF
 *
 * WEBFORGE:
 *   WEBFORGE_QUICK_GUIDE     — span × load → minimum grating code
 *   WEBFORGE_BAR_SIZES       — code → [depth, thickness] mm
 *   WEBFORGE_STEEL_WEIGHTS_KG_M2
 *   WEBFORGE_WEBPLATE
 *
 * REFERENCE:
 *   MATERIAL_PROPERTIES      — allowable stress, Fy, E (imperial + metric)
 *   CONVERSIONS              — unit factors
 *   LOAD_TABLES_BY_PITCH     — YB/T index: 20/30/40 → table
 *   lookupLoad()             — helper function
 *   lookupDeflection()       — helper function
 */

/**
 * master-data.js
 * Source: YB/T 4001.1-2007, Appendix E (informative annex)
 * "Safety load and deflection table for press-welded steel grating"
 *
 * Spans: 200–3000 mm in 200 mm increments
 * U = uniformly distributed safe load (kN/m²)
 * C = safe line load along centerline perpendicular to bearing bars (kN/m)
 * D = maximum deflection under specified safe load (mm)
 *
 * Material design strength: 170×10³ kN/m² (carbon structural steel)
 * Weight: hot-dip galvanized, includes grating self-weight.
 * Crossbar contribution ignored in calculations.
 * "■" in original = deflection under 2 kN/m² UDL < 4 mm (very stiff range).
 *
 * Naming convention: G[width][thickness]/[pitch]/[crossbar_pitch][W]
 *   e.g. G655/30/50W → bearing bar 65×5 mm, 30 mm pitch, 50 mm crossbar pitch, welded
 */

// ---------------------------------------------------------------------------
// Span axis (mm) – shared by all tables
// ---------------------------------------------------------------------------
export const SPANS_MM = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000];

// ---------------------------------------------------------------------------
// Table E.1 – Bearing bar pitch 30 mm, press-welded (YB/T 4001.1-2007)
// ---------------------------------------------------------------------------
// Each entry: { model, width_mm, thickness_mm, weight_kg_m2,
//               U: [...], C: [...], D_U: [...], D_C: [...] }
// Arrays are indexed to SPANS_MM. null = not listed (beyond usable range).
// U row and its deflection share the same model (50 mm crossbar variant).
// C row and its deflection are the 100 mm crossbar variant.
// ---------------------------------------------------------------------------
export const TABLE_E1_30MM = [
  {
    model_U: "G655/30/50W",   model_C: "G655/30/100W",
    width_mm: 65, thickness_mm: 5,
    weight_50: 103.4, weight_100: 100.4,
    U:   [3990, 997, 443, 249, 159, 110, 81, 62, 49, 39, 32, 27, 23, 20, 17],
    D_U: [0.11, 0.42, 0.95, 1.7, 2.65, 3.81, 5.22, 6.84, 8.7, 10.61, 12.82, 15.4, 18.18, 21.4, 24.18],
    C:   [399, 199, 133, 99, 79, 66, 57, 49, 44, 39, 36, 33, 30, 28, 26],
    D_C: [0.08, 0.34, 0.76, 1.35, 2.11, 3.06, 4.21, 5.43, 6.98, 8.54, 10.56, 12.65, 14.75, 17.33, 19.97],
  },
  {
    model_U: "G605/30/50W",   model_C: "G605/30/100W",
    width_mm: 60, thickness_mm: 5,
    weight_50: 95.9, weight_100: 92.9,
    U:   [3400, 850, 377, 212, 136, 94, 69, 53, 41, 34, 28, 23, 20, 17, null],
    D_U: [0.11, 0.46, 1.03, 1.84, 2.89, 4.15, 5.66, 7.45, 9.28, 11.78, 14.28, 16.73, 20.16, 23.23, null],
    C:   [340, 170, 113, 85, 68, 56, 48, 42, 37, 34, 30, 28, 26, 24, null],
    D_C: [0.09, 0.37, 0.83, 1.48, 2.31, 3.3, 4.52, 5.93, 7.48, 9.49, 11.23, 13.71, 16.31, 18.98, null],
  },
  {
    model_U: "G555/30/50W",   model_C: "G555/30/100W",
    width_mm: 55, thickness_mm: 5,
    weight_50: 88.4, weight_100: 85.4,
    U:   [2856, 714, 317, 178, 114, 79, 58, 44, 35, 28, 23, 19, 16, null, null],
    D_U: [0.13, 0.5, 1.13, 2.0, 3.14, 4.53, 6.19, 8.04, 10.3, 12.63, 15.29, 18.03, 21.08, null, null],
    C:   [285, 142, 95, 71, 57, 47, 40, 35, 31, 28, 25, 23, 21, null, null],
    D_C: [0.1, 0.4, 0.9, 1.6, 2.52, 3.6, 4.89, 6.43, 8.16, 10.18, 12.2, 14.7, 17.24, null, null],
  },
  {
    model_U: "G505/30/50W",   model_C: "G505/30/100W",
    width_mm: 50, thickness_mm: 5,
    weight_50: 80.9, weight_100: 77.9,
    U:   [2361, 590, 262, 147, 94, 65, 48, 36, 29, 23, 19, 16, null, null, null],
    D_U: [0.14, 0.55, 1.24, 2.2, 3.45, 4.97, 6.82, 8.78, 11.39, 13.86, 16.88, 20.28, null, null, null],
    C:   [236, 118, 78, 59, 47, 39, 33, 29, 26, 23, 21, 19, null, null, null],
    D_C: [0.11, 0.44, 0.99, 1.77, 2.77, 3.99, 5.39, 7.11, 9.14, 11.18, 13.7, 16.26, null, null, null],
  },
  {
    model_U: "G503/30/50W",   model_C: "G503/30/100W",
    width_mm: 50, thickness_mm: 3,
    weight_50: 52.6, weight_100: 49.6,
    U:   [1416, 354, 157, 88, 56, 39, 28, 22, 17, 14, 11, null, null, null, null],
    D_U: [0.14, 0.55, 1.24, 2.2, 3.43, 4.97, 6.65, 8.95, 11.16, 14.09, 16.37, null, null, null, null],
    C:   [141, 70, 47, 35, 28, 23, 20, 17, 15, 14, 12, null, null, null, null],
    D_C: [0.11, 0.44, 0.99, 1.75, 2.75, 3.92, 5.45, 6.97, 8.82, 11.37, 13.14, null, null, null, null],
  },
  {
    model_U: "G455/30/50W",   model_C: "G455/30/100W",
    width_mm: 45, thickness_mm: 5,
    weight_50: 73.4, weight_100: 70.4,
    U:   [1912, 478, 212, 119, 76, 53, 39, 29, 23, 19, 15, null, null, null, null],
    D_U: [0.15, 0.61, 1.38, 2.45, 3.83, 5.56, 7.62, 9.73, 12.44, 15.76, 18.39, null, null, null, null],
    C:   [191, 95, 63, 47, 38, 31, 27, 23, 21, 19, 17, null, null, null, null],
    D_C: [0.12, 0.49, 1.09, 1.94, 3.07, 4.35, 6.06, 7.76, 10.16, 12.72, 15.3, null, null, null, null],
  },
  {
    model_U: "G405/30/50W",   model_C: "G405/30/100W",
    width_mm: 40, thickness_mm: 5,
    weight_50: 65.9, weight_100: 62.9,
    U:   [1511, 377, 167, 94, 60, 41, 30, 23, 18, 15, null, null, null, null, null],
    D_U: [0.17, 0.69, 1.54, 2.76, 4.31, 6.14, 8.37, 11.02, 13.92, 17.8, null, null, null, null, null],
    C:   [151, 75, 50, 37, 30, 25, 21, 18, 16, 15, null, null, null, null, null],
    D_C: [0.14, 0.55, 1.23, 2.17, 3.46, 5.01, 6.73, 8.69, 11.1, 14.39, null, null, null, null, null],
  },
  {
    model_U: "G403/30/50W",   model_C: "G403/30/100W",
    width_mm: 40, thickness_mm: 3,
    weight_50: 43.3, weight_100: 40.3,
    U:   [906, 226, 100, 56, 36, 25, 18, 14, 11, null, null, null, null, null, null],
    D_U: [0.17, 0.69, 1.54, 2.74, 4.32, 6.25, 8.39, 11.2, 14.2, null, null, null, null, null, null],
    C:   [90, 45, 30, 22, 18, 15, 12, 11, 10, null, null, null, null, null, null],
    D_C: [0.14, 0.55, 1.24, 2.16, 3.46, 5.02, 6.44, 8.87, 11.59, null, null, null, null, null, null],
  },
  {
    model_U: "G355/30/50W",   model_C: "G355/30/100W",
    width_mm: 35, thickness_mm: 5,
    weight_50: 58.4, weight_100: 55.4,
    U:   [1156, 289, 128, 72, 46, 32, 23, 18, 14, null, null, null, null, null, null],
    D_U: [0.2, 0.79, 1.77, 3.16, 4.94, 7.17, 9.61, 12.92, 16.24, null, null, null, null, null, null],
    C:   [115, 57, 38, 28, 23, 19, 16, 14, 12, null, null, null, null, null, null],
    D_C: [0.16, 0.62, 1.4, 2.46, 3.97, 5.7, 7.69, 10.14, 12.52, null, null, null, null, null, null],
  },
  {
    model_U: "G353/30/50W",   model_C: "G353/30/100W",
    width_mm: 35, thickness_mm: 3,
    weight_50: 38.6, weight_100: 35.6,
    U:   [694, 173, 77, 43, 27, 19, 14, 10, null, null, null, null, null, null, null],
    D_U: [0.2, 0.79, 1.77, 3.14, 4.84, 7.11, 9.77, 12.03, null, null, null, null, null, null, null],
    C:   [69, 34, 23, 17, 13, 11, 9, 8, null, null, null, null, null, null, null],
    D_C: [0.16, 0.62, 1.41, 2.49, 3.75, 5.52, 7.25, 9.71, null, null, null, null, null, null, null],
  },
  {
    model_U: "G325/30/50W",   model_C: "G325/30/100W",
    width_mm: 32, thickness_mm: 5,
    weight_50: 53.9, weight_100: 50.9,
    U:   [967, 241, 107, 60, 38, 26, 19, 15, 11, null, null, null, null, null, null],
    D_U: [0.22, 0.86, 1.94, 3.44, 5.35, 7.64, 10.42, 14.13, 16.8, null, null, null, null, null, null],
    C:   [96, 48, 32, 24, 19, 16, 13, 12, 10, null, null, null, null, null, null],
    D_C: [0.17, 0.68, 1.55, 2.76, 4.3, 6.3, 8.21, 11.4, 13.73, null, null, null, null, null, null],
  },
  {
    model_U: "G323/30/50W",   model_C: "G323/30/100W",
    width_mm: 32, thickness_mm: 3,
    weight_50: 35.8, weight_100: 32.8,
    U:   [580, 145, 64, 36, 23, 16, 11, 9, null, null, null, null, null, null, null],
    D_U: [0.21, 0.86, 1.93, 3.45, 5.41, 7.85, 10.09, 14.19, null, null, null, null, null, null, null],
    C:   [58, 29, 19, 14, 11, 9, 8, 7, null, null, null, null, null, null, null],
    D_C: [0.17, 0.69, 1.53, 2.69, 4.16, 5.93, 8.44, 11.15, null, null, null, null, null, null, null],
  },
  {
    model_U: "G255/30/50W",   model_C: "G255/30/100W",
    width_mm: 25, thickness_mm: 5,
    weight_50: 43.4, weight_100: 40.4,
    U:   [590, 147, 65, 36, 23, 16, 12, null, null, null, null, null, null, null, null],
    D_U: [0.28, 1.1, 2.47, 4.35, 6.82, 9.92, 13.9, null, null, null, null, null, null, null, null],
    C:   [59, 29, 19, 14, 11, 9, 8, null, null, null, null, null, null, null, null],
    D_C: [0.22, 0.87, 1.93, 3.39, 5.25, 7.5, 10.7, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G253/30/50W",   model_C: "G253/30/100W",
    width_mm: 25, thickness_mm: 3,
    weight_50: 29.3, weight_100: 26.3,
    U:   [354, 88, 39, 22, 14, 9, null, null, null, null, null, null, null, null, null],
    D_U: [0.28, 1.1, 2.47, 4.43, 6.94, 9.35, null, null, null, null, null, null, null, null, null],
    C:   [35, 17, 11, 8, 7, 5, null, null, null, null, null, null, null, null, null],
    D_C: [0.22, 0.85, 1.86, 3.24, 5.58, 7.0, null, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G205/30/50W",   model_C: "G205/30/100W",
    width_mm: 20, thickness_mm: 5,
    weight_50: 36.0, weight_100: 33.0,
    U:   [377, 94, 41, 23, 15, 10, null, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.37, 3.05, 5.44, 8.73, 12.2, null, null, null, null, null, null, null, null, null],
    C:   [37, 18, 12, 9, 7, 6, null, null, null, null, null, null, null, null, null],
    D_C: [0.27, 1.05, 2.39, 4.28, 6.57, 9.85, null, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G203/30/50W",   model_C: "G203/30/100W",
    width_mm: 20, thickness_mm: 3,
    weight_50: 24.6, weight_100: 21.6,
    U:   [226, 56, 25, 14, 9, null, null, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.37, 3.1, 5.53, 8.76, null, null, null, null, null, null, null, null, null, null],
    C:   [22, 11, 7, 5, 4, null, null, null, null, null, null, null, null, null, null],
    D_C: [0.27, 1.07, 2.32, 3.98, 6.3, null, null, null, null, null, null, null, null, null, null],
  },
];

// ---------------------------------------------------------------------------
// Table E.2 – Bearing bar pitch 40 mm, press-welded (YB/T 4001.1-2007)
// ---------------------------------------------------------------------------
export const TABLE_E2_40MM = [
  {
    model_U: "G655/40/50W",   model_C: "G655/40/100W",
    width_mm: 65, thickness_mm: 5,
    weight_50: 81.7, weight_100: 78.7,
    U:   [2992, 748, 332, 187, 119, 83, 61, 46, 36, 29, 24, 20, 17, 15, null],
    D_U: [0.11, 0.42, 0.95, 1.7, 2.65, 3.84, 3.93, 6.78, 8.54, 10.54, 12.84, 15.25, 17.97, 21.46, null],
    C:   [299, 149, 99, 74, 59, 49, 42, 37, 33, 29, 27, 24, 23, 21, null],
    D_C: [0.08, 0.34, 0.76, 1.35, 2.1, 3.03, 4.14, 5.47, 6.99, 8.49, 10.58, 12.32, 15.1, 17.39, null],
  },
  {
    model_U: "G605/40/50W",   model_C: "G605/40/100W",
    width_mm: 60, thickness_mm: 5,
    weight_50: 75.9, weight_100: 72.9,
    U:   [2550, 637, 283, 159, 102, 70, 52, 39, 31, 25, 21, 17, 15, null, null],
    D_U: [0.11, 0.46, 1.03, 1.84, 2.89, 4.12, 4.27, 7.32, 9.36, 11.5, 14.3, 16.5, 20.21, null, null],
    C:   [255, 127, 85, 63, 51, 42, 36, 31, 28, 25, 23, 21, 19, null, null],
    D_C: [0.09, 0.37, 0.83, 1.46, 2.31, 3.31, 4.52, 5.84, 7.56, 9.32, 11.5, 13.74, 15.97, null, null],
  },
  {
    model_U: "G555/40/50W",   model_C: "G555/40/100W",
    width_mm: 55, thickness_mm: 5,
    weight_50: 70.1, weight_100: 67.1,
    U:   [2142, 535, 238, 133, 85, 59, 43, 33, 26, 21, 17, 14, null, null, null],
    D_U: [0.13, 0.5, 1.13, 2.0, 3.13, 4.51, 5.59, 8.05, 10.22, 12.66, 15.11, 17.77, null, null, null],
    C:   [214, 107, 71, 53, 42, 35, 30, 26, 23, 21, 19, 17, null, null, null],
    D_C: [0.1, 0.4, 0.9, 1.59, 2.48, 3.58, 4.9, 6.38, 8.09, 10.2, 12.39, 14.54, null, null, null],
  },
  {
    model_U: "G505/40/50W",   model_C: "G505/40/100W",
    width_mm: 50, thickness_mm: 5,
    weight_50: 64.2, weight_100: 61.2,
    U:   [1770, 442, 196, 110, 70, 49, 36, 27, 21, 17, 14, null, null, null, null],
    D_U: [0.14, 0.55, 1.24, 2.2, 3.43, 5.0, 5.12, 8.79, 11.02, 13.69, 16.64, null, null, null, null],
    C:   [177, 88, 59, 44, 35, 29, 25, 22, 19, 17, 16, null, null, null, null],
    D_C: [0.11, 0.44, 0.99, 1.76, 2.75, 3.96, 5.45, 7.2, 8.93, 11.05, 13.95, null, null, null, null],
  },
  {
    model_U: "G503/40/50W",   model_C: "G503/40/100W",
    width_mm: 50, thickness_mm: 3,
    weight_50: 42.6, weight_100: 39.6,
    U:   [1062, 265, 118, 66, 42, 29, 21, 16, 13, 10, null, null, null, null, null],
    D_U: [0.14, 0.55, 1.24, 2.2, 3.43, 4.94, 4.99, 8.71, 11.4, 13.49, null, null, null, null, null],
    C:   [106, 53, 35, 26, 21, 17, 15, 13, 11, 10, null, null, null, null, null],
    D_C: [0.11, 0.44, 0.98, 1.74, 2.75, 3.87, 5.46, 7.11, 8.66, 10.9, null, null, null, null, null],
  },
  {
    model_U: "G455/40/50W",   model_C: "G455/40/100W",
    width_mm: 45, thickness_mm: 5,
    weight_50: 58.4, weight_100: 55.4,
    U:   [1434, 358, 159, 89, 57, 39, 29, 22, 17, 14, 11, null, null, null, null],
    D_U: [0.15, 0.61, 1.38, 2.44, 3.83, 5.46, 5.67, 9.85, 12.28, 15.53, 18.05, null, null, null, null],
    C:   [143, 71, 47, 35, 28, 23, 20, 17, 15, 14, 13, null, null, null, null],
    D_C: [0.12, 0.49, 1.09, 1.92, 3.02, 4.31, 5.99, 7.67, 9.72, 12.54, 15.64, null, null, null, null],
  },
  {
    model_U: "G405/40/50W",   model_C: "G405/40/100W",
    width_mm: 40, thickness_mm: 5,
    weight_50: 52.6, weight_100: 49.6,
    U:   [1133, 283, 125, 70, 45, 31, 23, 17, 13, 11, null, null, null, null, null],
    D_U: [0.17, 0.69, 1.54, 2.74, 4.32, 6.2, 6.42, 10.88, 13.45, 17.47, null, null, null, null, null],
    C:   [113, 56, 37, 28, 22, 18, 16, 14, 12, 11, null, null, null, null, null],
    D_C: [0.14, 0.54, 1.22, 2.19, 3.39, 4.82, 6.85, 9.02, 11.13, 14.13, null, null, null, null, null],
  },
  {
    model_U: "G403/40/50W",   model_C: "G403/40/100W",
    width_mm: 40, thickness_mm: 3,
    weight_50: 35.3, weight_100: 32.3,
    U:   [680, 170, 75, 42, 27, 18, 13, 10, 8, null, null, null, null, null, null],
    D_U: [0.17, 0.69, 1.54, 2.74, 4.32, 6.01, 6.08, 10.7, 13.84, null, null, null, null, null, null],
    C:   [68, 34, 22, 17, 13, 11, 9, 8, 7, null, null, null, null, null, null],
    D_C: [0.14, 0.55, 1.21, 2.22, 3.34, 4.92, 6.45, 8.64, 10.9, null, null, null, null, null, null],
  },
  {
    model_U: "G355/40/50W",   model_C: "G355/40/100W",
    width_mm: 35, thickness_mm: 5,
    weight_50: 46.8, weight_100: 43.8,
    U:   [867, 216, 96, 54, 34, 24, 17, 13, 10, null, null, null, null, null, null],
    D_U: [0.2, 0.78, 1.77, 3.16, 4.88, 7.18, 7.12, 12.48, 15.54, null, null, null, null, null, null],
    C:   [86, 43, 28, 21, 17, 14, 12, 10, 9, null, null, null, null, null, null],
    D_C: [0.16, 0.62, 1.38, 2.46, 3.91, 5.61, 7.71, 9.7, 12.57, null, null, null, null, null, null],
  },
  {
    model_U: "G353/40/50W",   model_C: "G353/40/100W",
    width_mm: 35, thickness_mm: 3,
    weight_50: 31.6, weight_100: 28.6,
    U:   [520, 130, 57, 32, 20, 14, 10, 8, null, null, null, null, null, null, null],
    D_U: [0.2, 0.79, 1.75, 3.12, 4.79, 7.0, 7.01, 12.85, null, null, null, null, null, null, null],
    C:   [52, 28, 17, 13, 10, 8, 7, 6, null, null, null, null, null, null, null],
    D_C: [0.16, 0.63, 1.4, 2.54, 3.85, 5.37, 7.53, 9.75, null, null, null, null, null, null, null],
  },
  {
    model_U: "G325/40/50W",   model_C: "G325/40/100W",
    width_mm: 32, thickness_mm: 5,
    weight_50: 43.3, weight_100: 40.3,
    U:   [725, 181, 80, 45, 29, 20, 14, 11, null, null, null, null, null, null, null],
    D_U: [0.21, 0.86, 1.93, 3.45, 5.45, 7.84, 7.7, 13.86, null, null, null, null, null, null, null],
    C:   [72, 36, 24, 18, 14, 12, 10, 9, null, null, null, null, null, null, null],
    D_C: [0.17, 0.68, 1.55, 2.76, 4.23, 6.31, 8.43, 11.44, null, null, null, null, null, null, null],
  },
  {
    model_U: "G323/40/50W",   model_C: "G323/40/100W",
    width_mm: 32, thickness_mm: 3,
    weight_50: 29.4, weight_100: 26.4,
    U:   [435, 108, 48, 27, 17, 12, 8, null, null, null, null, null, null, null, null],
    D_U: [0.21, 0.86, 1.93, 3.45, 5.34, 7.86, 7.37, null, null, null, null, null, null, null, null],
    C:   [43, 21, 14, 10, 8, 7, 6, null, null, null, null, null, null, null, null],
    D_C: [0.17, 0.67, 1.5, 2.56, 4.04, 6.16, 8.47, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G255/40/50W",   model_C: "G255/40/100W",
    width_mm: 25, thickness_mm: 5,
    weight_50: 35.1, weight_100: 32.1,
    U:   [442, 110, 49, 27, 17, 12, 9, null, null, null, null, null, null, null, null],
    D_U: [0.27, 1.1, 2.48, 4.35, 6.74, 9.94, 10.46, null, null, null, null, null, null, null, null],
    C:   [44, 22, 14, 11, 8, 7, 6, null, null, null, null, null, null, null, null],
    D_C: [0.22, 0.88, 1.9, 3.55, 5.1, 7.79, 10.74, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G253/40/50W",   model_C: "G253/40/100W",
    width_mm: 25, thickness_mm: 3,
    weight_50: 24.3, weight_100: 21.3,
    U:   [265, 66, 29, 16, 10, 7, null, null, null, null, null, null, null, null, null],
    D_U: [0.27, 1.1, 2.45, 4.3, 6.63, 9.71, null, null, null, null, null, null, null, null, null],
    C:   [26, 13, 8, 6, 5, 4, null, null, null, null, null, null, null, null, null],
    D_C: [0.22, 0.87, 1.81, 3.24, 5.33, 7.48, null, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G205/40/50W",   model_C: "G205/40/100W",
    width_mm: 20, thickness_mm: 5,
    weight_50: 29.3, weight_100: 26.3,
    U:   [283, 70, 31, 17, 11, 7, null, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.36, 3.08, 5.37, 8.56, 11.46, null, null, null, null, null, null, null, null, null],
    C:   [28, 14, 9, 7, 5, 4, null, null, null, null, null, null, null, null, null],
    D_C: [0.27, 1.09, 2.39, 4.44, 6.29, 8.84, null, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G203/40/50W",   model_C: "G203/40/100W",
    width_mm: 20, thickness_mm: 3,
    weight_50: 20.6, weight_100: 17.6,
    U:   [170, 42, 18, 10, 6, null, null, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.37, 2.98, 5.28, 7.84, null, null, null, null, null, null, null, null, null, null],
    C:   [17, 8, 5, 4, 3, null, null, null, null, null, null, null, null, null, null],
    D_C: [0.28, 1.04, 2.22, 4.25, 6.32, null, null, null, null, null, null, null, null, null, null],
  },
];

// ---------------------------------------------------------------------------
// Table E.3 – Bearing bar pitch 20 mm, press-welded (YB/T 4001.1-2007)
// ---------------------------------------------------------------------------
export const TABLE_E3_20MM = [
  {
    model_U: "G605/20/50W",   model_C: "G605/20/100W",
    width_mm: 60, thickness_mm: 5,
    weight_50: 138.3, weight_100: 135.3,
    U:   [5100, 1275, 566, 318, 204, 141, 104, 79, 62, 51, 42, 35, 30, 26, 22],
    D_U: [0.11, 0.46, 1.03, 1.84, 2.88, 4.15, 5.69, 7.4, 9.34, 11.77, 14.27, 16.94, 20.13, 23.62, 26.57],
    C:   [510, 255, 170, 127, 102, 85, 72, 63, 56, 51, 46, 42, 39, 36, 34],
    D_C: [0.09, 0.37, 0.83, 1.47, 2.31, 3.34, 4.51, 5.92, 7.54, 9.47, 11.45, 13.68, 16.28, 18.93, 22.17],
  },
  {
    model_U: "G555/20/50W",   model_C: "G555/20/100W",
    width_mm: 55, thickness_mm: 5,
    weight_50: 127.3, weight_100: 124.3,
    U:   [4285, 1071, 476, 267, 171, 119, 87, 66, 52, 42, 35, 29, 25, 21, null],
    D_U: [0.13, 0.5, 1.13, 2.0, 3.14, 4.55, 6.18, 8.04, 10.19, 12.62, 15.48, 18.3, 21.87, 24.94, null],
    C:   [428, 214, 142, 107, 85, 71, 61, 53, 47, 42, 38, 35, 32, 30, null],
    D_C: [0.1, 0.4, 0.9, 1.61, 2.5, 3.63, 4.97, 6.48, 8.24, 10.17, 12.34, 14.87, 17.45, 20.6, null],
  },
  {
    model_U: "G505/20/50W",   model_C: "G505/20/100W",
    width_mm: 50, thickness_mm: 5,
    weight_50: 116.3, weight_100: 113.3,
    U:   [3541, 885, 393, 221, 141, 98, 72, 55, 43, 35, 29, 24, 20, null, null],
    D_U: [0.14, 0.55, 1.24, 2.21, 3.45, 4.99, 6.82, 8.93, 11.25, 14.03, 17.14, 20.24, 23.45, null, null],
    C:   [354, 177, 118, 88, 70, 59, 50, 44, 39, 35, 32, 29, 27, null, null],
    D_C: [0.11, 0.44, 0.99, 1.76, 2.75, 4.02, 5.43, 7.18, 9.12, 11.32, 13.88, 16.49, 19.69, null, null],
  },
  {
    model_U: "G503/20/50W",   model_C: "G503/20/100W",
    width_mm: 50, thickness_mm: 3,
    weight_50: 73.8, weight_100: 70.8,
    U:   [2125, 531, 236, 132, 85, 59, 43, 33, 26, 21, 17, 14, null, null, null],
    D_U: [0.14, 0.55, 1.24, 2.2, 3.47, 5.01, 6.79, 8.94, 11.35, 14.06, 16.8, 19.76, null, null, null],
    C:   [212, 106, 70, 53, 42, 35, 30, 26, 23, 21, 19, 17, null, null, null],
    D_C: [0.11, 0.44, 0.98, 1.77, 2.75, 3.98, 5.44, 7.08, 8.99, 11.34, 13.78, 16.18, null, null, null],
  },
  {
    model_U: "G455/20/50W",   model_C: "G455/20/100W",
    width_mm: 45, thickness_mm: 5,
    weight_50: 105.2, weight_100: 102.2,
    U:   [2868, 717, 318, 179, 114, 79, 58, 44, 35, 28, 23, 19, null, null, null],
    D_U: [0.15, 0.61, 1.38, 2.46, 3.83, 5.53, 7.55, 9.83, 12.59, 15.47, 18.74, 22.13, null, null, null],
    C:   [286, 143, 95, 71, 57, 47, 40, 35, 31, 28, 26, 23, null, null, null],
    D_C: [0.12, 0.49, 1.1, 1.95, 3.07, 4.4, 5.98, 7.86, 9.99, 12.48, 15.55, 18.08, null, null, null],
  },
  {
    model_U: "G405/20/50W",   model_C: "G405/20/100W",
    width_mm: 40, thickness_mm: 5,
    weight_50: 94.2, weight_100: 91.2,
    U:   [2266, 566, 251, 141, 90, 62, 46, 35, 27, 22, 18, null, null, null, null],
    D_U: [0.17, 0.69, 1.55, 2.76, 4.31, 6.19, 8.55, 11.16, 13.9, 17.39, 21.0, null, null, null, null],
    C:   [226, 113, 75, 56, 45, 37, 32, 28, 25, 22, 20, null, null, null, null],
    D_C: [0.14, 0.55, 1.23, 2.19, 3.46, 4.94, 6.83, 8.99, 11.52, 14.0, 17.18, null, null, null, null],
  },
  {
    model_U: "G403/20/50W",   model_C: "G403/20/100W",
    width_mm: 40, thickness_mm: 3,
    weight_50: 60.3, weight_100: 57.3,
    U:   [1360, 340, 151, 85, 54, 37, 27, 21, 16, 13, null, null, null, null, null],
    D_U: [0.17, 0.69, 1.55, 2.77, 4.31, 6.16, 8.37, 11.1, 13.76, 17.18, null, null, null, null, null],
    C:   [136, 68, 45, 34, 27, 22, 19, 17, 15, 13, null, null, null, null, null],
    D_C: [0.14, 0.55, 1.23, 2.22, 3.46, 4.9, 6.77, 9.11, 11.55, 13.89, null, null, null, null, null],
  },
  {
    model_U: "G355/20/50W",   model_C: "G355/20/100W",
    width_mm: 35, thickness_mm: 5,
    weight_50: 83.2, weight_100: 80.2,
    U:   [1735, 433, 192, 108, 69, 48, 35, 27, 21, 17, null, null, null, null, null],
    D_U: [0.2, 0.79, 1.77, 3.15, 4.94, 7.16, 9.74, 12.9, 16.21, 20.17, null, null, null, null, null],
    C:   [173, 86, 57, 43, 34, 28, 24, 21, 19, 17, null, null, null, null, null],
    D_C: [0.16, 0.62, 1.4, 2.52, 3.91, 5.6, 7.68, 10.12, 13.15, 16.32, null, null, null, null, null],
  },
  {
    model_U: "G353/20/50W",   model_C: "G353/20/100W",
    width_mm: 35, thickness_mm: 3,
    weight_50: 53.5, weight_100: 50.5,
    U:   [1041, 260, 115, 65, 41, 28, 21, 16, 12, null, null, null, null, null, null],
    D_U: [0.2, 0.79, 1.77, 3.17, 4.9, 6.98, 9.75, 12.77, 15.5, null, null, null, null, null, null],
    C:   [104, 52, 34, 26, 20, 17, 14, 13, 11, null, null, null, null, null, null],
    D_C: [0.16, 0.63, 1.39, 2.54, 3.84, 5.67, 7.49, 10.45, 12.75, null, null, null, null, null, null],
  },
  {
    model_U: "G325/20/50W",   model_C: "G325/20/100W",
    width_mm: 32, thickness_mm: 5,
    weight_50: 76.6, weight_100: 73.6,
    U:   [1450, 362, 161, 90, 58, 40, 29, 22, 17, 14, null, null, null, null, null],
    D_U: [0.21, 0.86, 1.94, 3.44, 5.44, 7.82, 10.58, 13.8, 17.25, 21.85, null, null, null, null, null],
    C:   [145, 72, 48, 36, 29, 24, 20, 18, 16, 14, null, null, null, null, null],
    D_C: [0.17, 0.68, 1.54, 2.76, 4.37, 6.29, 8.4, 11.38, 14.55, 17.7, null, null, null, null, null],
  },
  {
    model_U: "G323/20/50W",   model_C: "G323/20/100W",
    width_mm: 32, thickness_mm: 3,
    weight_50: 49.4, weight_100: 46.4,
    U:   [870, 217, 96, 54, 34, 24, 17, 13, 10, null, null, null, null, null, null],
    D_U: [0.21, 0.86, 1.93, 3.44, 5.32, 7.83, 10.37, 13.64, 16.98, null, null, null, null, null, null],
    C:   [87, 43, 29, 21, 17, 14, 12, 10, 9, null, null, null, null, null, null],
    D_C: [0.17, 0.68, 1.56, 2.69, 4.27, 6.13, 8.42, 10.6, 13.74, null, null, null, null, null, null],
  },
  {
    model_U: "G255/20/50W",   model_C: "G255/20/100W",
    width_mm: 25, thickness_mm: 5,
    weight_50: 61.1, weight_100: 58.1,
    U:   [885, 221, 98, 55, 35, 24, 18, 13, null, null, null, null, null, null, null],
    D_U: [0.28, 1.1, 2.48, 4.42, 6.91, 9.9, 13.87, 17.3, null, null, null, null, null, null, null],
    C:   [88, 44, 29, 22, 17, 14, 12, 11, null, null, null, null, null, null, null],
    D_C: [0.22, 0.88, 1.96, 3.55, 5.4, 7.76, 10.68, 14.76, null, null, null, null, null, null, null],
  },
  {
    model_U: "G253/20/50W",   model_C: "G253/20/100W",
    width_mm: 25, thickness_mm: 3,
    weight_50: 39.9, weight_100: 36.9,
    U:   [531, 132, 59, 33, 21, 14, 10, null, null, null, null, null, null, null, null],
    D_U: [0.28, 1.1, 2.49, 4.43, 6.92, 9.66, 12.92, null, null, null, null, null, null, null, null],
    C:   [53, 26, 17, 13, 10, 8, 7, null, null, null, null, null, null, null, null],
    D_C: [0.22, 0.86, 1.92, 3.5, 5.3, 7.42, 10.43, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G205/20/50W",   model_C: "G205/20/100W",
    width_mm: 20, thickness_mm: 5,
    weight_50: 50.1, weight_100: 47.1,
    U:   [566, 141, 62, 35, 22, 15, 11, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.37, 3.07, 5.51, 8.53, 12.18, 16.74, null, null, null, null, null, null, null, null],
    C:   [56, 28, 18, 14, 11, 9, 8, null, null, null, null, null, null, null, null],
    D_C: [0.27, 1.09, 2.38, 4.43, 6.86, 9.82, 14.04, null, null, null, null, null, null, null, null],
  },
  {
    model_U: "G203/20/50W",   model_C: "G203/20/100W",
    width_mm: 20, thickness_mm: 3,
    weight_50: 33.1, weight_100: 30.1,
    U:   [340, 85, 37, 21, 13, 9, null, null, null, null, null, null, null, null, null],
    D_U: [0.34, 1.38, 3.06, 5.52, 8.42, 12.22, null, null, null, null, null, null, null, null, null],
    C:   [34, 17, 11, 8, 6, 5, null, null, null, null, null, null, null, null, null],
    D_C: [0.28, 1.11, 2.43, 4.23, 6.27, 9.16, null, null, null, null, null, null, null, null, null],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Look up a specific load value from a table.
 * @param {Array} table - one of TABLE_E1_30MM / TABLE_E2_40MM / TABLE_E3_20MM
 * @param {string} model - e.g. "G505/30/50W"
 * @param {"U"|"C"} loadType
 * @param {number} spanMm - must be a value in SPANS_MM
 * @returns {number|null}
 */
export function lookupLoad(table, model, loadType, spanMm) {
  const spanIdx = SPANS_MM.indexOf(spanMm);
  if (spanIdx === -1) return null;
  const row = table.find(r => r.model_U === model || r.model_C === model);
  if (!row) return null;
  return loadType === "U" ? row.U[spanIdx] : row.C[spanIdx];
}

/**
 * Look up deflection for a given model / load type / span.
 */
export function lookupDeflection(table, model, loadType, spanMm) {
  const spanIdx = SPANS_MM.indexOf(spanMm);
  if (spanIdx === -1) return null;
  const row = table.find(r => r.model_U === model || r.model_C === model);
  if (!row) return null;
  return loadType === "U" ? row.D_U[spanIdx] : row.D_C[spanIdx];
}

// ---------------------------------------------------------------------------
// Convenience: all tables indexed by pitch
// ---------------------------------------------------------------------------
export const LOAD_TABLES_BY_PITCH = {
  20: TABLE_E3_20MM,
  30: TABLE_E1_30MM,
  40: TABLE_E2_40MM,
};
// ============================================================================
// TABLE E.4 – I-Bar bearing bar, pitch 30 mm (YB/T 4001.1-2007)
// I-Bar: width=flange_mm, flange_t_mm, web_t_mm, flange_w_mm
// ============================================================================
export const TABLE_E4_IBAR_30MM = [
  {
    model_U:"G757/30/50WI",  model_C:"G757/30/100WI",
    width_mm:75, flange_t_mm:7, web_t_mm:4, flange_w_mm:12,
    weight_50:126.1, weight_100:120.7,
    U:   [6460,1615,717,403,258,179,131,100,79,64,53,44,38,32,28],
    D_U: [0.09,0.37,0.83,1.47,2.3,3.31,4.5,5.88,7.47,9.25,11.26,13.3,15.89,18.1,20.99],
    C:   [646,323,215,161,129,107,92,80,71,64,58,53,49,46,43],
    D_C: [0.07,0.29,0.66,1.17,1.84,2.65,3.62,4.72,5.99,7.44,9.02,10.76,12.72,15.0,17.36],
  },
  {
    model_U:"G657/30/50WI",  model_C:"G657/30/100WI",
    width_mm:65, flange_t_mm:7, web_t_mm:4, flange_w_mm:10,
    weight_50:110.1, weight_100:104.8,
    U:   [4862,1215,540,303,194,135,99,75,60,48,40,33,28,24,21],
    D_U: [0.11,0.42,0.95,1.69,2.65,3.83,5.22,6.77,8.71,10.67,13.07,15.3,18.05,20.94,24.29],
    C:   [486,243,162,121,97,81,69,60,54,48,44,40,37,34,32],
    D_C: [0.08,0.34,0.76,1.35,2.12,3.07,4.17,5.44,7.0,8.58,10.53,12.5,14.8,17.12,19.96],
  },
  {
    model_U:"G607/30/50WI",  model_C:"G607/30/100WI",
    width_mm:60, flange_t_mm:7, web_t_mm:4, flange_w_mm:10,
    weight_50:99.1, weight_100:96.1,
    U:   [4216,1054,468,263,168,117,86,65,52,42,34,29,24,21,18],
    D_U: [0.11,0.46,1.03,1.83,2.86,4.13,5.65,7.31,9.4,11.62,13.85,16.8,19.29,22.82,25.97],
    C:   [421,210,140,105,84,70,60,52,46,42,38,35,32,30,28],
    D_C: [0.09,0.36,0.82,1.46,2.29,3.3,4.52,5.87,7.43,9.35,11.33,13.63,15.96,18.82,21.77],
  },
  {
    model_U:"G557/30/50WI",  model_C:"G557/30/100WI",
    width_mm:55, flange_t_mm:7, web_t_mm:4, flange_w_mm:8.5,
    weight_50:90.3, weight_100:87.3,
    U:   [3502,875,389,218,140,97,71,54,43,35,28,24,20,17,null],
    D_U: [0.13,0.5,1.13,2.0,3.15,4.53,6.17,8.03,10.29,12.82,15.11,18.44,21.32,24.55,null],
    C:   [350,175,116,87,70,58,50,43,38,35,31,29,26,25,null],
    D_C: [0.1,0.4,0.9,1.6,2.52,3.62,4.98,6.42,8.13,10.32,12.26,14.98,17.23,20.83,null],
  },
  {
    model_U:"G507/30/50WI",  model_C:"G507/30/100WI",
    width_mm:50, flange_t_mm:7, web_t_mm:4, flange_w_mm:8,
    weight_50:83.2, weight_100:80.2,
    U:   [2912,728,323,182,116,80,59,45,35,29,24,20,17,null,null],
    D_U: [0.14,0.55,1.24,2.21,3.44,4.94,6.78,8.85,11.09,14.07,17.14,20.37,24.0,null,null],
    C:   [291,145,97,72,58,48,41,36,32,29,26,24,22,null,null],
    D_C: [0.11,0.44,0.99,1.75,2.76,3.96,5.4,7.12,9.06,11.33,13.63,16.45,19.34,null,null],
  },
  {
    model_U:"G505/30/50WI",  model_C:"G505/30/100WI",
    width_mm:50, flange_t_mm:5, web_t_mm:3, flange_w_mm:8.5,
    weight_50:62.8, weight_100:59.8,
    U:   [2085,521,231,130,83,57,42,32,25,20,17,14,null,null,null],
    D_U: [0.14,0.55,1.23,2.2,3.44,4.91,6.73,8.79,11.06,13.57,16.97,19.95,null,null,null],
    C:   [208,104,69,52,41,34,29,26,23,20,18,17,null,null,null],
    D_C: [0.11,0.44,0.98,1.76,2.72,3.92,5.33,7.17,9.09,10.94,13.2,16.3,null,null,null],
  },
  {
    model_U:"G445/30/50WI",  model_C:"G445/30/100WI",
    width_mm:44, flange_t_mm:5, web_t_mm:3, flange_w_mm:8,
    weight_50:56.5, weight_100:53.5,
    U:   [1654,413,183,103,66,45,33,25,20,16,13,null,null,null,null],
    D_U: [0.16,0.62,1.4,2.5,3.92,5.56,7.59,9.86,12.71,15.6,18.7,null,null,null,null],
    C:   [165,82,55,41,33,27,23,20,18,16,15,null,null,null,null],
    D_C: [0.12,0.5,1.12,1.99,3.14,4.46,6.07,7.93,10.23,12.58,15.81,null,null,null,null],
  },
  {
    model_U:"G385/30/50WI",  model_C:"G385/30/100WI",
    width_mm:38, flange_t_mm:5, web_t_mm:3, flange_w_mm:7,
    weight_50:49.9, weight_100:46.9,
    U:   [1246,311,138,77,49,34,25,19,15,12,null,null,null,null,null],
    D_U: [0.18,0.73,1.64,2.89,4.51,6.52,8.93,11.64,14.82,18.22,null,null,null,null,null],
    C:   [124,62,41,31,24,20,17,15,13,12,null,null,null,null,null],
    D_C: [0.14,0.58,1.3,2.33,3.55,5.13,6.98,9.25,11.53,14.72,null,null,null,null,null],
  },
  {
    model_U:"G325/30/50WI",  model_C:"G325/30/100WI",
    width_mm:32, flange_t_mm:5, web_t_mm:3, flange_w_mm:6,
    weight_50:43.3, weight_100:40.3,
    U:   [884,221,98,55,35,24,18,13,10,null,null,null,null,null,null],
    D_U: [0.21,0.86,1.94,3.44,5.37,7.68,10.74,13.35,16.6,null,null,null,null,null,null],
    C:   [88,44,29,22,17,14,12,11,9,null,null,null,null,null,null],
    D_C: [0.17,0.69,1.53,2.76,4.19,6.01,8.24,11.36,13.42,null,null,null,null,null,null],
  },
  {
    model_U:"G255/30/50WI",  model_C:"G255/30/100WI",
    width_mm:25, flange_t_mm:5, web_t_mm:3, flange_w_mm:4.5,
    weight_50:35.1, weight_100:32.1,
    U:   [544,136,60,34,21,15,11,null,null,null,null,null,null,null,null],
    D_U: [0.28,1.1,2.47,4.45,6.75,10.06,13.77,null,null,null,null,null,null,null,null],
    C:   [54,27,18,13,10,9,7,null,null,null,null,null,null,null,null],
    D_C: [0.22,0.88,1.98,3.41,5.17,8.09,10.13,null,null,null,null,null,null,null,null],
  },
];

// ============================================================================
// TABLE E.5 – I-Bar bearing bar, pitch 40 mm (YB/T 4001.1-2007)
// ============================================================================
export const TABLE_E5_IBAR_40MM = [
  {
    model_U:"G757/40/50WI",  model_C:"G757/40/100WI",
    width_mm:75, flange_t_mm:7, web_t_mm:4, flange_w_mm:12,
    weight_50:101.0, weight_100:95.6,
    U:   [4845,1211,538,302,193,134,98,75,75,59,48,40,33,28,24],
    D_U: [0.09,0.37,0.83,1.47,2.29,3.31,4.49,5.89,5.89,7.44,9.27,11.35,13.33,15.66,18.16],
    C:   [484,242,161,121,96,80,69,60,60,53,48,44,40,37,34],
    D_C: [0.07,0.29,0.66,1.18,1.83,2.64,3.63,4.72,4.72,5.97,7.45,9.13,10.85,12.83,14.83],
  },
  {
    model_U:"G657/40/50WI",  model_C:"G657/40/100WI",
    width_mm:65, flange_t_mm:7, web_t_mm:4, flange_w_mm:10,
    weight_50:88.5, weight_100:83.2,
    U:   [3646,911,405,227,145,101,74,56,56,45,36,30,25,21,18],
    D_U: [0.11,0.42,0.95,1.69,2.64,3.83,5.21,6.75,6.75,8.72,10.68,13.1,15.54,18.1,21.0],
    C:   [364,182,121,91,72,60,52,45,45,40,36,33,30,28,26],
    D_C: [0.08,0.34,0.76,1.36,2.1,3.04,4.2,5.44,5.44,6.92,8.6,10.55,12.54,14.98,17.5],
  },
  {
    model_U:"G607/40/50WI",  model_C:"G607/40/100WI",
    width_mm:60, flange_t_mm:7, web_t_mm:4, flange_w_mm:10,
    weight_50:78.9, weight_100:75.9,
    U:   [3162,790,351,197,126,87,64,49,49,39,31,26,21,18,16],
    D_U: [0.11,0.46,1.03,1.83,2.86,4.1,5.61,7.35,7.35,9.41,11.46,14.13,16.28,19.33,23.23],
    C:   [316,158,105,79,63,52,45,39,39,35,31,28,26,24,22],
    D_C: [0.09,0.37,0.82,1.47,2.29,3.28,4.52,5.87,5.87,7.54,9.22,11.16,13.54,16.0,18.48],
  },
  {
    model_U:"G557/40/50WI",  model_C:"G557/40/100WI",
    width_mm:55, flange_t_mm:7, web_t_mm:4, flange_w_mm:8.5,
    weight_50:71.9, weight_100:68.9,
    U:   [2626,656,291,164,105,72,53,41,41,32,26,21,18,15,null],
    D_U: [0.13,0.5,1.13,2.01,3.15,4.49,6.14,8.14,8.14,10.22,12.72,15.14,18.48,21.37,null],
    C:   [262,131,87,65,52,43,37,32,32,29,26,23,21,20,null],
    D_C: [0.1,0.4,0.9,1.59,2.5,3.58,4.92,6.38,6.38,8.28,10.25,12.16,14.53,17.71,null],
  },
  {
    model_U:"G507/40/50WI",  model_C:"G507/40/100WI",
    width_mm:50, flange_t_mm:7, web_t_mm:4, flange_w_mm:8,
    weight_50:66.4, weight_100:63.4,
    U:   [2184,546,242,136,87,60,44,34,34,26,21,18,15,null,null],
    D_U: [0.14,0.55,1.24,2.2,3.45,4.95,6.74,8.93,8.93,11.0,13.62,17.18,20.42,null,null],
    C:   [218,109,72,54,43,36,31,27,27,24,21,19,18,null,null],
    D_C: [0.11,0.44,0.98,1.75,2.73,3.97,5.45,7.13,7.13,9.07,10.98,13.33,16.5,null,null],
  },
  {
    model_U:"G505/40/50WI",  model_C:"G505/40/100WI",
    width_mm:50, flange_t_mm:5, web_t_mm:3, flange_w_mm:8.5,
    weight_50:50.4, weight_100:47.4,
    U:   [1564,391,173,97,62,43,31,24,24,19,15,12,null,null,null],
    D_U: [0.14,0.55,1.23,2.19,3.43,4.95,6.64,8.8,8.8,11.22,13.6,16.05,null,null,null],
    C:   [156,78,52,39,31,26,22,19,19,17,15,14,null,null,null],
    D_C: [0.11,0.44,0.99,1.76,2.75,4.0,5.4,7.01,7.01,8.98,10.96,13.72,null,null,null],
  },
  {
    model_U:"G445/40/50WI",  model_C:"G445/40/100WI",
    width_mm:44, flange_t_mm:5, web_t_mm:3, flange_w_mm:8,
    weight_50:45.5, weight_100:42.5,
    U:   [1241,310,137,77,49,34,25,19,19,15,12,null,null,null,null],
    D_U: [0.16,0.62,1.4,2.49,3.88,5.61,7.68,10.01,10.01,12.73,15.64,null,null,null,null],
    C:   [124,62,41,31,24,20,17,15,15,13,12,null,null,null,null],
    D_C: [0.12,0.5,1.12,2.01,3.05,4.41,5.99,7.95,7.95,9.89,12.62,null,null,null,null],
  },
  {
    model_U:"G385/40/50WI",  model_C:"G385/40/100WI",
    width_mm:38, flange_t_mm:5, web_t_mm:3, flange_w_mm:7,
    weight_50:40.3, weight_100:37.3,
    U:   [935,233,103,58,37,25,19,14,14,11,null,null,null,null,null],
    D_U: [0.18,0.73,1.63,2.91,4.55,6.4,9.06,11.47,11.47,14.54,null,null,null,null,null],
    C:   [93,46,31,23,18,15,13,11,11,10,null,null,null,null,null],
    D_C: [0.14,0.57,1.31,2.31,3.55,5.14,7.12,9.08,9.08,11.85,null,null,null,null,null],
  },
  {
    model_U:"G325/40/50WI",  model_C:"G325/40/100WI",
    width_mm:32, flange_t_mm:5, web_t_mm:3, flange_w_mm:6,
    weight_50:35.1, weight_100:32.1,
    U:   [663,165,73,41,26,18,13,10,10,null,null,null,null,null,null],
    D_U: [0.21,0.86,1.92,3.43,5.33,7.69,10.37,13.71,13.71,null,null,null,null,null,null],
    C:   [66,33,22,16,13,11,9,8,8,null,null,null,null,null,null],
    D_C: [0.17,0.69,1.55,2.68,4.28,6.3,8.26,11.06,11.06,null,null,null,null,null,null],
  },
  {
    model_U:"G255/40/50WI",  model_C:"G255/40/100WI",
    width_mm:25, flange_t_mm:5, web_t_mm:3, flange_w_mm:4.5,
    weight_50:28.7, weight_100:25.8,
    U:   [408,102,45,25,16,11,8,null,null,null,null,null,null,null,null],
    D_U: [0.28,1.1,2.47,4.36,6.86,9.86,13.41,null,null,null,null,null,null,null,null],
    C:   [40,20,13,10,8,6,5,null,null,null,null,null,null,null,null],
    D_C: [0.22,0.87,1.91,3.5,5.51,7.24,9.71,null,null,null,null,null,null,null,null],
  },
];

// ============================================================================
// TABLE E.6 – Heavy-load press-welded steel grating (YB/T 4001.1-2007)
// All use 40mm pitch, 8×8mm crossbar. U and C/D listed per row.
// ============================================================================
export const TABLE_E6_HEAVY = [
  {
    model:"G1508/40/100", width_mm:150, thickness_mm:8, crossbar:"8×8", weight_kg_m2:284.9,
    U:   [25500,6375,2833,1593,1020,708,520,398,314,255,210,177,150,130,113],
    D_U: [0.05,0.18,0.41,0.73,1.15,1.66,2.26,2.95,3.74,4.63,5.6,6.7,7.85,9.17,10.54],
    C:   [2550,1275,850,637,510,425,364,318,283,255,231,212,196,182,170],
    D_C: [0.04,0.15,0.33,0.59,0.92,1.33,1.8,2.36,3.0,3.72,4.5,5.37,6.34,7.38,8.51],
  },
  {
    model:"G1308/40/100", width_mm:130, thickness_mm:8, crossbar:"8×8", weight_kg_m2:247.6,
    U:   [19153,4788,2128,1197,766,532,390,299,236,191,158,133,113,97,85],
    D_U: [0.05,0.21,0.48,0.85,1.33,1.91,2.6,3.41,4.32,5.34,6.49,7.76,9.11,10.55,12.22],
    C:   [1915,957,638,478,383,319,273,239,212,191,174,159,147,136,127],
    D_C: [0.04,0.17,0.38,0.68,1.06,1.53,2.09,2.73,3.46,4.29,5.22,6.21,7.33,8.5,9.81],
  },
  {
    model:"G1208/40/100", width_mm:120, thickness_mm:8, crossbar:"8×8", weight_kg_m2:229.0,
    U:   [16320,4080,1813,1020,653,453,333,255,201,163,134,113,96,83,72],
    D_U: [0.06,0.23,0.52,0.92,1.44,2.07,2.83,3.7,4.68,5.8,7.0,8.39,9.85,11.5,13.2],
    C:   [1632,816,544,408,326,272,233,204,181,163,148,136,125,116,108],
    D_C: [0.05,0.18,0.41,0.74,1.15,1.66,2.26,2.97,3.76,4.66,5.65,6.77,7.94,9.24,10.64],
  },
  {
    model:"G1008/40/100", width_mm:100, thickness_mm:8, crossbar:"8×8", weight_kg_m2:191.7,
    U:   [11333,2833,1259,708,453,314,231,177,139,113,93,78,67,57,50],
    D_U: [0.07,0.28,0.62,1.1,1.73,2.48,3.39,4.45,5.61,6.97,8.43,10.05,11.94,13.73,15.94],
    C:   [1133,566,377,283,226,188,161,141,125,113,103,94,87,80,75],
    D_C: [0.06,0.22,0.5,0.88,1.38,1.99,2.71,3.55,4.5,5.6,6.82,8.12,9.6,11.09,12.86],
  },
  {
    model:"G908/40/100", width_mm:90, thickness_mm:8, crossbar:"8×8", weight_kg_m2:173.1,
    U:   [9180,2295,1020,573,367,255,187,143,113,91,75,63,54,46,40],
    D_U: [0.08,0.31,0.69,1.22,1.92,2.77,3.77,4.93,6.26,7.72,9.35,11.17,13.24,15.25,17.57],
    C:   [918,459,306,229,183,153,131,114,102,91,83,76,70,65,61],
    D_C: [0.06,0.24,0.55,0.98,1.53,2.22,3.03,3.94,5.04,6.2,7.56,9.04,10.64,12.42,14.42],
  },
  {
    model:"G808/40/100", width_mm:80, thickness_mm:8, crossbar:"8×8", weight_kg_m2:154.4,
    U:   [7253,1813,805,453,290,201,148,113,89,72,59,50,42,37,32],
    D_U: [0.09,0.34,0.77,1.38,2.16,3.11,4.25,5.56,7.04,8.71,10.5,12.66,14.73,17.53,20.1],
    C:   [725,362,241,181,145,120,103,90,80,72,65,60,55,51,48],
    D_C: [0.07,0.27,0.62,1.1,1.73,2.48,3.39,4.44,5.65,7.01,8.47,10.2,11.97,13.96,16.27],
  },
  {
    model:"G758/40/100", width_mm:75, thickness_mm:8, crossbar:"8×8", weight_kg_m2:145.1,
    U:   [6375,1593,708,398,255,177,130,99,78,63,52,44,37,32,28],
    D_U: [0.09,0.37,0.83,1.47,2.31,3.33,4.54,5.92,7.5,9.27,11.25,13.55,15.78,18.47,21.42],
    C:   [637,318,212,159,127,106,91,79,70,63,57,53,49,45,42],
    D_C: [0.07,0.29,0.66,1.18,1.84,2.66,3.64,4.74,6.01,7.45,9.03,10.96,12.97,14.99,17.35],
  },
  {
    model:"G756/30/100", width_mm:75, thickness_mm:6, crossbar:"8×8", pitch_mm:30, weight_kg_m2:140.1,
    U:   [6375,1593,708,398,255,177,130,99,78,63,52,44,37,32,28],
    D_U: [0.09,0.37,0.83,1.47,2.3,3.33,4.54,5.91,7.49,9.26,11.24,13.53,15.76,18.44,21.39],
    C:   [637,318,212,159,127,106,91,79,70,63,57,53,49,45,42],
    D_C: [0.07,0.29,0.66,1.18,1.84,2.66,3.64,4.74,6.0,7.45,9.02,10.95,12.95,14.97,17.31],
  },
  {
    model:"G756/40/100", width_mm:75, thickness_mm:6, crossbar:"8×8", pitch_mm:40, weight_kg_m2:110.1,
    U:   [4781,1195,531,298,191,132,97,74,59,47,39,33,28,24,21],
    D_U: [0.09,0.37,0.83,1.47,2.3,3.31,4.52,5.9,7.56,9.22,11.25,13.55,15.93,18.48,21.44],
    C:   [478,239,159,119,95,79,68,59,53,47,43,39,36,34,31],
    D_C: [0.07,0.29,0.66,1.17,1.83,2.64,3.63,4.72,6.06,7.42,9.08,10.77,12.73,15.11,17.1],
  },
  {
    model:"G706/30/100", width_mm:70, thickness_mm:6, crossbar:"8×8", pitch_mm:30, weight_kg_m2:131.1,
    U:   [5553,1388,617,347,222,154,113,86,68,55,45,38,32,28,24],
    D_U: [0.1,0.39,0.89,1.58,2.47,3.56,4.85,6.32,8.04,9.96,11.99,14.41,16.82,19.9,22.65],
    C:   [555,277,185,138,111,92,79,69,61,55,50,46,42,39,37],
    D_C: [0.08,0.31,0.71,1.26,1.98,2.84,3.89,5.09,6.44,8.01,9.75,11.72,13.71,16.02,18.82],
  },
  {
    model:"G706/40/100", width_mm:70, thickness_mm:6, crossbar:"8×8", pitch_mm:40, weight_kg_m2:103.2,
    U:   [4165,1041,462,260,166,115,85,65,51,41,34,28,24,21,18],
    D_U: [0.1,0.39,0.88,1.58,2.46,3.55,4.87,6.38,8.05,9.91,12.09,14.19,16.85,19.95,22.7],
    C:   [416,208,138,104,83,69,59,52,46,41,37,34,32,29,27],
    D_C: [0.08,0.31,0.71,1.26,1.97,2.84,3.88,5.12,6.48,7.98,9.64,11.58,13.95,15.93,18.4],
  },
];

// ============================================================================
// TABLE E.7 – Bearing bar count → nominal panel width (YB/T 4001.1-2007)
// ============================================================================
export const TABLE_E7_WIDTH_BY_BARS = {
  pitch_30mm: {
    // bars: [width_t3mm, width_t5mm]
    8:[213,215], 9:[243,245], 10:[273,275], 11:[303,305], 12:[333,335],
    13:[363,365], 14:[393,395], 15:[423,425], 16:[453,455], 17:[483,485],
    18:[513,515], 19:[543,545], 20:[573,575], 21:[603,605], 22:[633,635],
    23:[663,665], 24:[693,695], 25:[723,725], 26:[753,755], 27:[783,785],
    28:[813,815], 29:[843,845], 30:[873,875], 31:[903,905], 32:[933,935],
    33:[963,965], 34:[993,995],
  },
  pitch_40mm: {
    4:[123,125], 5:[163,165], 6:[203,205], 7:[243,245], 8:[283,285],
    9:[323,325], 10:[363,365], 11:[403,405], 12:[443,445], 13:[483,485],
    14:[523,525], 15:[563,565], 16:[603,605], 17:[643,645], 18:[683,685],
    19:[723,725], 20:[763,765], 21:[803,805], 22:[843,845], 23:[883,885],
    24:[923,925], 25:[963,965], 26:[1003,1005],
  },
  pitch_20mm: {
    10:[183,185], 11:[203,205], 12:[223,225], 13:[243,245], 14:[263,265],
    15:[283,285], 16:[303,305], 17:[323,325], 18:[343,345], 19:[363,365],
    20:[383,385], 21:[403,405], 22:[423,425], 23:[443,445], 24:[463,465],
    25:[483,485], 26:[503,505], 27:[523,525], 28:[543,545], 29:[563,565],
    30:[583,585], 31:[603,605], 32:[623,625], 33:[643,645], 34:[663,665],
    35:[683,685], 36:[703,705], 37:[723,725], 38:[743,745], 39:[763,765],
    40:[783,785], 41:[803,805], 42:[823,825], 43:[843,845], 44:[863,865],
    45:[883,885], 46:[903,905], 47:[923,925], 48:[943,945], 49:[963,965],
    50:[983,985], 51:[1003,1005],
  },
};

// ============================================================================
// VULCRAFT GRATING – NAAMM MBG 534-19
// Source: Vulcraft_Grating_Manual_Aug_23.docx
// Standard Duty (SD) – ASTM A1011CS Type B, F=18 ksi
// Heavy Duty (HD)    – ASTM A1011CS Grade 36, F=20 ksi
//
// Spans: 2'0" / 2'6" / 3'0" / 3'6" / 4'0" / 4'6" / 5'0" / 5'6" / 6'0" / 6'6" / 7'0" / 7'6" / 8'0"
// Spans in inches:     24   /  30  /  36  /  42  /  48  /  54  /  60  /  66  /  72  /  78  /  84  /  90  /  96
// U = safe uniform load (lbs/ft²), C = safe concentrated load (lbs/ft of width), D = deflection (in)
// ============================================================================

export const VULCRAFT_SPANS_IN = [24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96];

// --- 19W4 Smooth (bar pitch 1-3/16", crossbar 4") ASTM A1011CS Type B 18 ksi ---
export const VULCRAFT_19W4_SMOOTH = [
  { bar:"1\"×⅛\"",   depth_in:1,    thick_in:0.125, weight_psf:5.14,  ped_span_in:51,
    Sx:0.211, Ix:0.105,
    U:  [632,404,281,206,158,125,null,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,null,null,null,null,null,null,null],
    C:  [632,505,421,361,316,281,null,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,null,null,null,null,null,null,null] },
  { bar:"1\"×³⁄₁₆\"", depth_in:1,   thick_in:0.1875,weight_psf:7.33,  ped_span_in:57,
    Sx:0.316, Ix:0.158,
    U:  [947,606,421,309,237,187,152,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,0.47,null,null,null,null,null,null],
    C:  [947,758,632,541,474,421,379,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,null,null,null,null,null,null] },
  { bar:"1¼\"×⅛\"",  depth_in:1.25, thick_in:0.125, weight_psf:6.23,  ped_span_in:61,
    Sx:0.329, Ix:0.206,
    U:  [987,632,439,322,247,195,158,130,null,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,null,null,null,null,null],
    C:  [987,789,658,564,493,439,395,359,null,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,null,null,null,null,null] },
  { bar:"1¼\"×³⁄₁₆\"",depth_in:1.25,thick_in:0.1875,weight_psf:8.98,  ped_span_in:67,
    Sx:0.493, Ix:0.308,
    U:  [1480,947,658,483,370,292,237,196,164,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,0.54,null,null,null,null],
    C:  [1480,1184,987,846,740,658,592,538,493,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,0.43,null,null,null,null] },
  { bar:"1½\"×⅛\"",  depth_in:1.5,  thick_in:0.125, weight_psf:7.33,  ped_span_in:70,
    Sx:0.474, Ix:0.355,
    U:  [1421,909,632,464,355,281,227,188,158,null,null,null,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,null,null,null,null],
    C:  [1421,1137,947,812,711,632,568,517,474,null,null,null,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,null,null,null,null] },
  { bar:"1½\"×³⁄₁₆\"",depth_in:1.5, thick_in:0.1875,weight_psf:10.63, ped_span_in:77,
    Sx:0.711, Ix:0.533,
    U:  [2132,1364,947,696,533,421,341,282,237,202,null,null,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,0.52,null,null,null],
    C:  [2132,1705,1421,1218,1066,947,853,775,711,656,null,null,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,0.42,null,null,null] },
  { bar:"1¾\"×³⁄₁₆\"",depth_in:1.75,thick_in:0.1875,weight_psf:12.27, ped_span_in:87,
    Sx:0.967, Ix:0.846,
    U:  [2901,1857,1289,947,725,573,464,384,322,275,237,206,null],
    DU: [0.04,0.07,0.10,0.13,0.17,0.22,0.27,0.32,0.38,0.45,0.52,0.60,null],
    C:  [2901,2321,1934,1658,1451,1289,1161,1055,967,893,829,774,null],
    DC: [0.03,0.05,0.08,0.10,0.14,0.17,0.21,0.26,0.31,0.36,0.42,0.48,null] },
  { bar:"2\"×³⁄₁₆\"", depth_in:2,   thick_in:0.1875,weight_psf:13.92, ped_span_in:96,
    Sx:1.263, Ix:1.263,
    U:  [3789,2425,1684,1237,947,749,606,501,421,359,309,269,237],
    DU: [0.04,0.06,0.08,0.11,0.15,0.19,0.23,0.28,0.34,0.39,0.46,0.52,0.60],
    C:  [3789,3032,2526,2165,1895,1684,1516,1378,1263,1166,1083,1011,947],
    DC: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48] },
  { bar:"2½\"×³⁄₁₆\"",depth_in:2.5, thick_in:0.1875,weight_psf:17.21, ped_span_in:113,
    Sx:1.974, Ix:2.467,
    U:  [5921,3789,2632,1933,1480,1170,947,783,658,561,483,421,370],
    DU: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48],
    C:  [5921,4737,3947,3383,2961,2632,2368,2153,1974,1822,1692,1579,1480],
    DC: [0.02,0.04,0.05,0.07,0.10,0.12,0.15,0.18,0.21,0.25,0.29,0.34,0.38] },
];

// --- 19W4 Serrated (bar pitch 1-3/16", crossbar 4") ASTM A1011CS Type B 18 ksi ---
// Note: serrated reduces effective depth. Ped span ~10% shorter than smooth.
export const VULCRAFT_19W4_SERRATED = [
  { bar:"1\"×⅛\"",   depth_in:1,    thick_in:0.125, weight_psf:5.14,  ped_span_in:42,
    Sx:0.118, Ix:0.044,
    U:  [355,227,158,116,null,null,null,null,null,null,null,null,null],
    DU: [0.10,0.16,0.22,0.30,null,null,null,null,null,null,null,null,null],
    C:  [355,284,237,203,null,null,null,null,null,null,null,null,null],
    DC: [0.08,0.12,0.18,0.24,null,null,null,null,null,null,null,null,null] },
  { bar:"1\"×³⁄₁₆\"", depth_in:1,   thick_in:0.1875,weight_psf:7.33,  ped_span_in:46,
    Sx:0.178, Ix:0.067,
    U:  [533,341,237,174,133,null,null,null,null,null,null,null,null],
    DU: [0.10,0.16,0.22,0.30,0.40,null,null,null,null,null,null,null,null],
    C:  [533,426,355,305,266,null,null,null,null,null,null,null,null],
    DC: [0.08,0.12,0.18,0.24,0.32,null,null,null,null,null,null,null,null] },
  { bar:"1¼\"×⅛\"",  depth_in:1.25, thick_in:0.125, weight_psf:6.23,  ped_span_in:51,
    Sx:0.211, Ix:0.105,
    U:  [632,404,281,206,158,125,null,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,null,null,null,null,null,null,null],
    C:  [632,505,421,361,316,281,null,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,null,null,null,null,null,null,null] },
  { bar:"1¼\"×³⁄₁₆\"",depth_in:1.25,thick_in:0.1875,weight_psf:8.98,  ped_span_in:57,
    Sx:0.316, Ix:0.158,
    U:  [947,606,421,309,237,187,152,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,0.47,null,null,null,null,null,null],
    C:  [947,758,632,541,474,421,379,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,null,null,null,null,null,null] },
  { bar:"1½\"×⅛\"",  depth_in:1.5,  thick_in:0.125, weight_psf:7.33,  ped_span_in:61,
    Sx:0.329, Ix:0.206,
    U:  [987,632,439,322,247,195,158,130,null,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,null,null,null,null,null],
    C:  [987,789,658,564,493,439,395,359,null,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,null,null,null,null,null] },
  { bar:"1½\"×³⁄₁₆\"",depth_in:1.5, thick_in:0.1875,weight_psf:10.63, ped_span_in:67,
    Sx:0.493, Ix:0.308,
    U:  [1480,947,658,483,370,292,237,196,164,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,0.54,null,null,null,null],
    C:  [1480,1184,987,846,740,658,592,538,493,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,0.43,null,null,null,null] },
  { bar:"1¾\"×³⁄₁₆\"",depth_in:1.75,thick_in:0.1875,weight_psf:12.27, ped_span_in:77,
    Sx:0.711, Ix:0.533,
    U:  [2132,1364,947,696,533,421,341,282,237,202,null,null,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,0.52,null,null,null],
    C:  [2132,1705,1421,1218,1066,947,853,775,711,656,null,null,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,0.42,null,null,null] },
  { bar:"2\"×³⁄₁₆\"", depth_in:2,   thick_in:0.1875,weight_psf:13.92, ped_span_in:87,
    Sx:0.967, Ix:0.846,
    U:  [2901,1857,1289,947,725,573,464,384,322,275,237,206,null],
    DU: [0.04,0.07,0.10,0.13,0.17,0.22,0.27,0.32,0.38,0.45,0.52,0.60,null],
    C:  [2901,2321,1934,1658,1451,1289,1161,1055,967,893,829,774,null],
    DC: [0.03,0.05,0.08,0.10,0.14,0.17,0.21,0.26,0.31,0.36,0.42,0.48,null] },
  { bar:"2½\"×³⁄₁₆\"",depth_in:2.5, thick_in:0.1875,weight_psf:17.21, ped_span_in:105,
    Sx:1.599, Ix:1.799,
    U:  [4796,3069,2132,1566,1199,947,767,634,533,454,392,341,300],
    DU: [0.03,0.05,0.07,0.10,0.13,0.17,0.21,0.25,0.30,0.35,0.41,0.47,0.53],
    C:  [4796,3837,3197,2741,2398,2132,1918,1744,1599,1476,1370,1279,1199],
    DC: [0.03,0.04,0.06,0.08,0.11,0.13,0.17,0.20,0.24,0.28,0.32,0.37,0.42] },
];

// --- 15W4 Smooth (bar pitch 15/16", crossbar 4") ASTM A1011CS Type B 18 ksi ---
export const VULCRAFT_15W4_SMOOTH = [
  { bar:"1\"×⅛\"",   depth_in:1,    thick_in:0.125, weight_psf:6.27,  ped_span_in:55,
    Sx:0.267, Ix:0.133,
    U:  [800,512,356,261,200,158,128,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,0.47,null,null,null,null,null,null],
    C:  [800,640,533,457,400,356,320,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,null,null,null,null,null,null] },
  { bar:"1\"×³⁄₁₆\"", depth_in:1,   thick_in:0.1875,weight_psf:9.03,  ped_span_in:60,
    Sx:0.400, Ix:0.200,
    U:  [1200,768,533,392,300,237,192,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,0.47,null,null,null,null,null,null],
    C:  [1200,960,800,686,600,533,480,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,null,null,null,null,null,null] },
  { bar:"1¼\"×⅛\"",  depth_in:1.25, thick_in:0.125, weight_psf:7.65,  ped_span_in:65,
    Sx:0.417, Ix:0.260,
    U:  [1250,800,556,408,313,247,200,165,null,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,null,null,null,null,null],
    C:  [1250,1000,833,714,625,556,500,455,null,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,null,null,null,null,null] },
  { bar:"1¼\"×³⁄₁₆\"",depth_in:1.25,thick_in:0.1875,weight_psf:11.10, ped_span_in:71,
    Sx:0.625, Ix:0.391,
    U:  [1875,1200,833,612,469,370,300,248,208,null,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,0.54,null,null,null,null],
    C:  [1875,1500,1250,1071,938,833,750,682,625,null,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,0.43,null,null,null,null] },
  { bar:"1½\"×⅛\"",  depth_in:1.5,  thick_in:0.125, weight_psf:9.03,  ped_span_in:74,
    Sx:0.600, Ix:0.450,
    U:  [1800,1152,800,588,450,356,288,238,200,170,null,null,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,0.52,null,null,null],
    C:  [1800,1440,1200,1029,900,800,720,655,600,554,null,null,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,0.42,null,null,null] },
  { bar:"1½\"×³⁄₁₆\"",depth_in:1.5, thick_in:0.1875,weight_psf:13.18, ped_span_in:82,
    Sx:0.900, Ix:0.675,
    U:  [2700,1728,1200,882,675,533,432,357,300,256,220,null,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,0.52,0.61,null,null],
    C:  [2700,2160,1800,1543,1350,1200,1080,982,900,831,771,null,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,0.42,0.49,null,null] },
  { bar:"1¾\"×³⁄₁₆\"",depth_in:1.75,thick_in:0.1875,weight_psf:15.25, ped_span_in:92,
    Sx:1.225, Ix:1.072,
    U:  [3675,2352,1633,1200,919,726,588,486,408,348,300,261,230],
    DU: [0.04,0.07,0.10,0.13,0.17,0.22,0.27,0.32,0.38,0.45,0.52,0.60,0.68],
    C:  [3675,2940,2450,2100,1838,1633,1470,1336,1225,1131,1050,980,919],
    DC: [0.03,0.05,0.08,0.10,0.14,0.17,0.21,0.26,0.31,0.36,0.42,0.48,0.54] },
  { bar:"2\"×³⁄₁₆\"", depth_in:2,   thick_in:0.1875,weight_psf:17.32, ped_span_in:102,
    Sx:1.600, Ix:1.600,
    U:  [4800,3072,2133,1567,1200,948,768,635,533,454,392,341,300],
    DU: [0.04,0.06,0.08,0.11,0.15,0.19,0.23,0.28,0.34,0.39,0.46,0.52,0.60],
    C:  [4800,3840,3200,2743,2400,2133,1920,1745,1600,1477,1371,1280,1200],
    DC: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48] },
  { bar:"2½\"×³⁄₁₆\"",depth_in:2.5, thick_in:0.1875,weight_psf:21.46, ped_span_in:120,
    Sx:2.500, Ix:3.125,
    U:  [7500,4800,3333,2449,1875,1481,1200,992,833,710,612,533,469],
    DU: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48],
    C:  [7500,6000,5000,4286,3750,3333,3000,2727,2500,2308,2143,2000,1875],
    DC: [0.02,0.04,0.05,0.07,0.10,0.12,0.15,0.18,0.21,0.25,0.29,0.34,0.38] },
];

// --- 11W4 Smooth (bar pitch 11/16", close mesh, crossbar 4") ASTM A1011CS Type B 18 ksi ---
export const VULCRAFT_11W4_SMOOTH = [
  { bar:"1\"×⅛\"",   depth_in:1,    thick_in:0.125, weight_psf:8.25,  ped_span_in:59,
    Sx:0.364, Ix:0.182,
    U:  [1091,698,485,356,273,215,175,null,null,null,null,null,null],
    DU: [0.07,0.12,0.17,0.23,0.30,0.38,0.47,null,null,null,null,null,null],
    C:  [1091,873,727,623,545,485,436,null,null,null,null,null,null],
    DC: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,null,null,null,null,null,null] },
  { bar:"1¼\"×³⁄₁₆\"",depth_in:1.25,thick_in:0.1875,weight_psf:14.82, ped_span_in:77,
    Sx:0.852, Ix:0.533,
    U:  [2557,1636,1136,835,639,505,409,338,284,242,null,null,null],
    DU: [0.06,0.09,0.13,0.18,0.24,0.30,0.37,0.45,0.54,0.63,null,null,null],
    C:  [2557,2045,1705,1461,1278,1136,1023,930,852,787,null,null,null],
    DC: [0.05,0.07,0.11,0.15,0.19,0.24,0.30,0.36,0.43,0.50,null,null,null] },
  { bar:"1½\"×³⁄₁₆\"",depth_in:1.5, thick_in:0.1875,weight_psf:17.64, ped_span_in:89,
    Sx:1.227, Ix:0.920,
    U:  [3682,2356,1636,1202,920,727,589,487,409,349,301,262,null],
    DU: [0.05,0.08,0.11,0.15,0.20,0.25,0.31,0.38,0.45,0.52,0.61,0.70,null],
    C:  [3682,2945,2455,2104,1841,1636,1473,1339,1227,1133,1052,982,null],
    DC: [0.04,0.06,0.09,0.12,0.16,0.20,0.25,0.30,0.36,0.42,0.49,0.56,null] },
  { bar:"1¾\"×³⁄₁₆\"",depth_in:1.75,thick_in:0.1875,weight_psf:20.45, ped_span_in:99,
    Sx:1.670, Ix:1.462,
    U:  [5011,3207,2227,1636,1253,990,802,663,557,474,409,356,313],
    DU: [0.04,0.07,0.10,0.13,0.17,0.22,0.27,0.32,0.38,0.45,0.52,0.60,0.68],
    C:  [5011,4009,3341,2864,2506,2227,2005,1822,1670,1542,1432,1336,1253],
    DC: [0.03,0.05,0.08,0.10,0.14,0.17,0.21,0.26,0.31,0.36,0.42,0.48,0.54] },
  { bar:"2\"×³⁄₁₆\"", depth_in:2,   thick_in:0.1875,weight_psf:23.27, ped_span_in:110,
    Sx:2.182, Ix:2.182,
    U:  [6545,4189,2909,2137,1636,1293,1047,866,727,620,534,465,409],
    DU: [0.04,0.06,0.08,0.11,0.15,0.19,0.23,0.28,0.34,0.39,0.46,0.52,0.60],
    C:  [6545,5236,4364,3740,3273,2909,2618,2380,2182,2014,1870,1745,1636],
    DC: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48] },
  { bar:"2½\"×³⁄₁₆\"",depth_in:2.5, thick_in:0.1875,weight_psf:28.90, ped_span_in:130,
    Sx:3.409, Ix:4.261,
    U:  [10227,6545,4545,3340,2557,2020,1636,1352,1136,968,835,727,639],
    DU: [0.03,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.27,0.31,0.36,0.42,0.48],
    C:  [10227,8182,6818,5844,5114,4545,4091,3719,3409,3147,2922,2727,2557],
    DC: [0.02,0.04,0.05,0.07,0.10,0.12,0.15,0.18,0.21,0.25,0.29,0.34,0.38] },
];

// --- Panel width tables (inches, for # of bearing bars) ---
export const VULCRAFT_PANEL_WIDTHS = {
  "19W4": { bars_to_width_3_16: {
    2:"1-3/8", 3:"2-9/16", 4:"3-3/4", 5:"4-15/16", 6:"6-1/8", 7:"7-5/16",
    8:"8-1/2", 9:"9-11/16", 10:"10-7/8", 11:"12-1/16", 12:"13-1/4",
    13:"14-7/16", 14:"15-5/8", 15:"16-13/16", 16:"18", 17:"19-3/16",
    18:"20-3/8", 19:"21-9/16", 20:"22-3/4", 21:"23-15/16", 22:"25-1/8",
    23:"26-5/16", 24:"27-1/2", 25:"28-11/16", 26:"29-7/8", 27:"31-1/16",
    28:"32-1/4", 29:"33-7/16", 30:"34-5/8", 31:"35-13/16"
  }, note:"Deduct 1/16\" for 1/8\" bearing bars" },
  "15W4": { bars_to_width_3_16: {
    2:"1-1/8", 3:"2-1/16", 4:"3", 5:"3-15/16", 6:"4-7/8", 7:"5-13/16",
    8:"6-3/4", 9:"7-11/16", 10:"8-5/8", 11:"9-9/16", 12:"10-1/2",
    13:"11-7/16", 14:"12-3/8", 15:"13-5/16", 16:"14-1/4", 17:"15-3/16",
    18:"16-1/8", 19:"17-1/16", 20:"18", 21:"18-15/16", 22:"19-7/8",
    23:"20-13/16", 24:"21-3/4", 25:"22-11/16", 26:"23-5/8", 27:"24-9/16",
    28:"25-1/2", 29:"26-7/16", 30:"27-3/8", 31:"28-5/16", 32:"29-1/4",
    33:"30-3/16", 34:"31-1/8", 35:"32-1/16", 36:"33", 37:"33-15/16",
    38:"34-7/8", 39:"35-13/16", 40:"36-3/4", 41:"37-11/16"
  }, note:"Deduct 1/16\" for 1/8\" bearing bars" },
  "11W4": { bars_to_width_3_16: {
    2:"7/8", 3:"1-9/16", 4:"2-1/4", 5:"2-15/16", 6:"3-5/8", 7:"4-5/16",
    8:"5", 9:"5-11/16", 10:"6-3/8", 11:"7-1/16", 12:"7-3/4", 13:"8-7/16",
    14:"9-1/8", 15:"9-13/16", 16:"10-1/2", 17:"11-3/16", 18:"11-7/8",
    19:"12-9/16", 20:"13-1/4", 21:"13-15/16", 22:"14-5/8", 23:"15-5/16",
    24:"16", 25:"16-11/16", 26:"17-3/8", 27:"18-1/16", 28:"18-3/4",
    29:"19-7/16", 30:"20-1/8", 31:"20-13/16", 32:"21-1/2", 33:"22-3/16",
    34:"22-7/8", 35:"23-9/16", 36:"24-1/4", 37:"24-15/16", 38:"24-15/16",
    39:"26-5/16", 40:"27", 41:"27-11/16"
  } },
};

// ============================================================================
// McNICHOLS® BAR GRATING – 2018 Catalog
// Source: McNICHOLS-2018-Gratings-Catalog_Web.docx
// GW/SGW Series: Welded, ASTM A1011CS Type B, F=18 ksi, bar pitch 1-3/16"
// GHB Series:    Heavy-Duty Welded, ASTM A1011CS, F=24 ksi (1/4" thick bars)
// Spans: 2' / 2'6" / 3' / 3'6" / 4' / 4'6" / 5' / 5'6" / 6' / 7' / 8'
//        in inches: 24 / 30 / 36 / 42 / 48 / 54 / 60 / 66 / 72 / 84 / 96
// U=lbs/ft², C=lbs/ft of width, D=inches deflection
// ============================================================================

export const MCNICHOLS_GW_SPANS_IN = [24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96];

// GW Series (19-W-4), bar pitch 1-3/16"
// SGW factor: multiply U or C values × 1.27 for SGW (15/16" pitch); D unchanged
export const MCNICHOLS_GW_STEEL = [
  { bar:"3/4\"×1/8\"",  weight_psf:4.1,
    U:  [355,227,158,116,89,70,null,null,null,null,null],
    DU: [0.099,0.155,0.223,0.304,0.397,0.503,null,null,null,null,null],
    C:  [355,284,237,203,178,158,null,null,null,null,null],
    DC: [0.079,0.124,0.179,0.243,0.318,0.402,null,null,null,null,null] },
  { bar:"3/4\"×3/16\"", weight_psf:5.8,
    U:  [533,341,237,174,133,105,null,null,null,null,null],
    DU: [0.099,0.155,0.223,0.304,0.397,0.503,null,null,null,null,null],
    C:  [533,426,355,305,266,237,null,null,null,null,null],
    DC: [0.079,0.124,0.179,0.243,0.318,0.402,null,null,null,null,null] },
  { bar:"1\"×1/8\"",    weight_psf:5.2,
    U:  [632,404,281,206,158,125,101,84,70,null,null],
    DU: [0.074,0.116,0.168,0.228,0.298,0.377,0.466,0.563,0.670,null,null],
    C:  [632,505,421,361,316,281,253,230,211,null,null],
    DC: [0.060,0.093,0.134,0.182,0.238,0.302,0.372,0.451,0.536,null,null] },
  { bar:"1\"×3/16\"",   weight_psf:7.5,
    U:  [947,606,421,309,237,187,152,125,105,null,null],
    DU: [0.074,0.116,0.168,0.228,0.298,0.377,0.466,0.563,0.670,null,null],
    C:  [947,758,632,541,474,421,379,344,316,null,null],
    DC: [0.060,0.093,0.134,0.182,0.238,0.302,0.372,0.451,0.536,null,null] },
  { bar:"1-1/4\"×1/8\"",weight_psf:6.3,
    U:  [987,632,439,322,247,195,158,130,110,81,null],
    DU: [0.060,0.093,0.134,0.182,0.238,0.302,0.372,0.451,0.536,0.730,null],
    C:  [987,789,658,564,493,439,395,359,329,282,null],
    DC: [0.048,0.074,0.107,0.146,0.191,0.241,0.298,0.360,0.429,0.584,null] },
  { bar:"1-1/4\"×3/16\"",weight_psf:9.1,
    U:  [1480,947,658,483,370,292,237,196,164,121,null],
    DU: [0.060,0.093,0.134,0.182,0.238,0.302,0.372,0.451,0.536,0.730,null],
    C:  [1480,1184,987,846,740,658,592,538,493,423,null],
    DC: [0.048,0.074,0.107,0.146,0.191,0.241,0.298,0.360,0.429,0.584,null] },
  { bar:"1-1/2\"×1/8\"",weight_psf:7.4,
    U:  [1421,909,632,464,355,281,227,188,158,116,89],
    DU: [0.050,0.078,0.112,0.152,0.199,0.251,0.310,0.376,0.447,0.608,0.794],
    C:  [1421,1137,947,812,711,632,568,517,474,406,355],
    DC: [0.040,0.062,0.089,0.122,0.159,0.201,0.248,0.300,0.358,0.487,0.636] },
  { bar:"1-1/2\"×3/16\"",weight_psf:10.8,
    U:  [2132,1364,947,696,533,421,341,282,237,174,133],
    DU: [0.050,0.078,0.112,0.152,0.199,0.251,0.310,0.376,0.447,0.608,0.794],
    C:  [2132,1705,1421,1218,1066,947,853,775,711,609,533],
    DC: [0.040,0.062,0.089,0.122,0.159,0.201,0.248,0.300,0.358,0.487,0.636] },
  { bar:"1-3/4\"×3/16\"",weight_psf:12.5,
    U:  [2901,1857,1289,947,725,573,464,384,322,237,181],
    DU: [0.043,0.067,0.096,0.130,0.170,0.215,0.266,0.322,0.383,0.521,0.681],
    C:  [2901,2321,1934,1658,1451,1289,1161,1055,967,829,725],
    DC: [0.034,0.053,0.077,0.104,0.136,0.172,0.213,0.257,0.306,0.417,0.545] },
  { bar:"2\"×3/16\"",   weight_psf:14.1,
    U:  [3789,2425,1684,1237,947,749,606,501,421,309,237],
    DU: [0.037,0.058,0.084,0.114,0.149,0.189,0.233,0.282,0.335,0.456,0.596],
    C:  [3789,3032,2526,2165,1895,1684,1516,1378,1263,1083,947],
    DC: [0.030,0.047,0.067,0.091,0.119,0.151,0.186,0.225,0.268,0.365,0.477] },
  { bar:"2-1/4\"×3/16\"",weight_psf:15.8,
    U:  [4796,3069,2132,1566,1199,947,767,634,533,392,300],
    DU: [0.033,0.052,0.074,0.101,0.132,0.168,0.207,0.250,0.298,0.406,0.530],
    C:  [4796,3837,3197,2741,2398,2132,1918,1744,1599,1370,1199],
    DC: [0.026,0.041,0.060,0.081,0.106,0.134,0.166,0.200,0.238,0.324,0.424] },
  { bar:"2-1/2\"×3/16\"",weight_psf:17.4,
    U:  [5921,3789,2632,1933,1480,1170,947,783,658,483,370],
    DU: [0.030,0.047,0.067,0.091,0.119,0.151,0.186,0.225,0.268,0.365,0.477],
    C:  [5921,4737,3947,3383,2961,2632,2368,2153,1974,1692,1480],
    DC: [0.024,0.037,0.054,0.073,0.095,0.121,0.149,0.180,0.215,0.292,0.381] },
];

// GHB Heavy-Duty Series – ASTM A1011CS, 1/4" thick bars, pitch 1-3/16"
// Spans: 1' / 1'6" / 2' / 2'6" / 3' / 3'6" / 4' / 4'6" / 5' / 5'6" / 6' / 6'6" / 7' / 7'6" / 8'
//        in inches: 12/18/24/30/36/42/48/54/60/66/72/78/84/90/96
export const MCNICHOLS_GHB_SPANS_IN = [12,18,24,30,36,42,48,54,60,66,72,78,84,90,96];

export const MCNICHOLS_GHB_STEEL = [
  { bar:"1\"×1/4\"",    weight_psf:9.8,
    U:  [5615,2495,1404,898,624,458,351,277,225,186,156,133,115,100,88],
    DU: [0.021,0.047,0.083,0.129,0.186,0.253,0.331,0.419,0.518,0.627,0.745,0.875,1.018,1.166,1.329],
    C:  [2807,1872,1404,1123,936,802,702,624,561,510,468,432,401,374,351],
    DC: [0.016,0.037,0.066,0.104,0.149,0.203,0.265,0.335,0.414,0.500,0.596,0.700,0.811,0.931,1.060] },
  { bar:"1-1/4\"×1/4\"",weight_psf:12.0,
    U:  [8772,3899,2193,1404,975,716,548,433,351,290,244,208,179,156,137],
    DU: [0.017,0.037,0.066,0.104,0.149,0.203,0.265,0.335,0.414,0.501,0.597,0.701,0.811,0.931,1.059],
    C:  [4386,2924,2193,1754,1462,1253,1097,975,877,797,731,675,627,585,548],
    DC: [0.013,0.030,0.053,0.083,0.119,0.162,0.212,0.268,0.331,0.400,0.477,0.560,0.649,0.745,0.847] },
  { bar:"1-1/2\"×1/4\"",weight_psf:14.3,
    U:  [12632,5614,3158,2021,1404,1031,790,624,505,418,351,299,258,225,197],
    DU: [0.014,0.031,0.055,0.086,0.124,0.169,0.221,0.279,0.345,0.418,0.497,0.583,0.676,0.777,0.881],
    C:  [6316,4211,3158,2526,2105,1805,1579,1404,1263,1148,1053,972,902,842,790],
    DC: [0.011,0.025,0.044,0.069,0.099,0.135,0.177,0.224,0.276,0.334,0.397,0.466,0.541,0.621,0.707] },
  { bar:"1-3/4\"×1/4\"",weight_psf:16.5,
    U:  [17193,7641,4298,2751,1910,1404,1075,849,688,568,478,407,351,306,269],
    DU: [0.012,0.027,0.047,0.074,0.106,0.145,0.189,0.239,0.296,0.357,0.426,0.500,0.580,0.666,0.758],
    C:  [8597,5731,4298,3439,2866,2456,2149,1910,1719,1563,1433,1323,1228,1146,1075],
    DC: [0.010,0.021,0.038,0.059,0.085,0.116,0.151,0.192,0.236,0.286,0.341,0.400,0.463,0.532,0.606] },
  { bar:"2\"×1/4\"",    weight_psf:18.7,
    U:  [22456,9980,5614,3593,2495,1833,1404,1109,898,742,624,532,458,399,351],
    DU: [0.010,0.023,0.041,0.065,0.093,0.127,0.166,0.210,0.259,0.313,0.373,0.438,0.507,0.582,0.662],
    C:  [11228,7485,5614,4491,3743,3208,2807,2495,2246,2041,1871,1727,1604,1497,1404],
    DC: [0.008,0.019,0.033,0.052,0.075,0.101,0.132,0.168,0.207,0.250,0.298,0.350,0.406,0.466,0.530] },
  { bar:"2-1/2\"×1/4\"",weight_psf:23.2,
    U:  [35088,15595,8772,5614,3899,2864,2193,1733,1404,1160,975,830,716,624,548],
    DU: [0.008,0.019,0.033,0.052,0.075,0.101,0.132,0.168,0.207,0.250,0.298,0.350,0.406,0.466,0.529],
    C:  [17544,11696,8772,7018,5848,5013,4386,3899,3509,3190,2924,2699,2506,2339,2193],
    DC: [0.007,0.015,0.027,0.041,0.060,0.081,0.106,0.134,0.166,0.200,0.238,0.280,0.324,0.372,0.424] },
  { bar:"3\"×1/4\"",    weight_psf:27.9,
    U:  [50527,22456,12632,8084,5614,4125,3158,2495,2021,1670,1404,1196,1031,898,789],
    DU: [0.007,0.016,0.028,0.043,0.062,0.085,0.110,0.140,0.172,0.209,0.248,0.291,0.338,0.388,0.441],
    C:  [25263,16842,12632,10105,8421,7218,6316,5614,5053,4593,4211,3887,3609,3368,3158],
    DC: [0.006,0.012,0.022,0.035,0.050,0.068,0.088,0.112,0.138,0.167,0.199,0.233,0.270,0.310,0.353] },
  { bar:"3-1/2\"×1/4\"",weight_psf:null,
    U:  [68772,30565,17193,11004,7641,5614,4298,3396,2751,2273,1910,1628,1404,1223,1075],
    DU: [0.006,0.013,0.024,0.037,0.053,0.072,0.095,0.120,0.148,0.179,0.213,0.250,0.290,0.333,0.379],
    C:  [34386,22924,17193,13754,11462,9825,8597,7641,6877,6252,5731,5290,4912,4585,4298],
    DC: [0.005,0.011,0.019,0.030,0.043,0.058,0.076,0.096,0.118,0.143,0.170,0.200,0.232,0.266,0.303] },
  { bar:"4\"×1/4\"",    weight_psf:null,
    U:  [89825,39922,22456,14372,9981,7333,5614,4436,3593,2969,2495,2126,1833,1597,1404],
    DU: [0.005,0.012,0.021,0.032,0.047,0.063,0.083,0.105,0.129,0.156,0.186,0.219,0.253,0.291,0.331],
    C:  [44913,29942,22456,17965,14971,12832,11228,9981,8983,8166,7485,6910,6416,5988,5614],
    DC: [0.004,0.009,0.017,0.026,0.037,0.051,0.066,0.084,0.104,0.125,0.149,0.175,0.203,0.233,0.265] },
];

// McNichols GW/SGW bar spacing and weights table
export const MCNICHOLS_GW_SERIES_INFO = {
  GW:  { bar_pitch_in:"1-3/16", xbar_pitch_in:4, note:"19-W-4" },
  GW2: { bar_pitch_in:"1-3/16", xbar_pitch_in:2, note:"19-W-2" },
  SGW: { bar_pitch_in:"15/16",  xbar_pitch_in:4, note:"15-W-4", load_factor:1.27 },
  SGW2:{ bar_pitch_in:"15/16",  xbar_pitch_in:2, note:"15-W-2", load_factor:1.27 },
};

export const MCNICHOLS_GW_WEIGHTS_PSF = {
  "3/4\"×1/8\"":  { GW:4.1,  GW2:5.0,  SGW:5.0,  SGW2:5.9 },
  "3/4\"×3/16\"": { GW:5.8,  GW2:6.7,  SGW:7.2,  SGW2:8.1 },
  "1\"×1/8\"":    { GW:5.2,  GW2:6.1,  SGW:6.4,  SGW2:7.3 },
  "1\"×3/16\"":   { GW:7.5,  GW2:8.4,  SGW:9.3,  SGW2:10.2 },
  "1-1/4\"×1/8\"":{ GW:6.3,  GW2:7.2,  SGW:7.9,  SGW2:8.8 },
  "1-1/4\"×3/16\"":{ GW:9.1, GW2:10.0, SGW:11.3, SGW2:12.2 },
  "1-1/2\"×1/8\"":{ GW:7.4,  GW2:8.3,  SGW:9.3,  SGW2:10.2 },
  "1-1/2\"×3/16\"":{ GW:10.8,GW2:11.7, SGW:13.5, SGW2:14.4 },
  "1-3/4\"×3/16\"":{ GW:12.5,GW2:13.4, SGW:15.6, SGW2:16.5 },
  "2\"×3/16\"":   { GW:14.1, GW2:15.0, SGW:17.7, SGW2:18.6 },
  "2-1/4\"×3/16\"":{ GW:15.8,GW2:16.7, SGW:19.8, SGW2:20.7 },
  "2-1/2\"×3/16\"":{ GW:17.4,GW2:18.3, SGW:21.9, SGW2:22.8 },
};

// McNichols GHB weights
export const MCNICHOLS_GHB_WEIGHTS_PSF = {
  "1\"×1/4\"":    { GHB:9.8,  GHB2:10.7 },
  "1-1/4\"×1/4\"":{ GHB:12.0, GHB2:12.9 },
  "1-1/2\"×1/4\"":{ GHB:14.3, GHB2:15.1 },
  "1-3/4\"×1/4\"":{ GHB:16.5, GHB2:17.4 },
  "2\"×1/4\"":    { GHB:18.7, GHB2:19.6 },
  "2-1/2\"×1/4\"":{ GHB:23.2, GHB2:24.0 },
  "3\"×1/4\"":    { GHB:27.9, GHB2:null },
};

// ============================================================================
// WEBFORGE ACCESS GRATING – Quick Flooring Guide (March 2025)
// Source: webforge-access-03-2025.docx
// Material: Grade 250 Mild Steel (min) / 6063-T6 Aluminium / FRP
// Allowable stress: 171 MPa (steel). U = superimposed UDL (kPa). D = deflection (mm).
// Pattern codes: A/B/C/D/F + depth×thickness + M(ild)/S(tainless) + P(lain)/S(errated) + U(ntreated)
// Depth×thickness examples: 205=20×5mm, 253=25×3mm, 255=25×5mm, 325=32×5mm, etc.
// ============================================================================

// Quick selection guide: minimum grating code per span & load level
// Steel / Aluminium / FRP  (null = not available at that span)
export const WEBFORGE_QUICK_GUIDE = {
  "2.5kPa_5mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","C255MP","A325MP","A405MP","A505MP"],
    aluminium:["A253AP","A253AP","A325AP","A503AP","A503AP",null],
    FRP:      ["G256",  "G386",  null,    null,    null,    null],
  },
  "3kPa_5mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","C205MP","A255MP","A325MP","A405MP"],
    aluminium:["A253AP","A253AP","A255AP","A403AP","A503AP",null],
    FRP:      ["G256",  "G386",  "G386",  null,    null,    null],
  },
  "4kPa_5mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","C205MP","A255MP","A325MP","A405MP"],
    aluminium:["A253AP","A253AP","A255AP","A405AP","A505AP",null],
    FRP:      ["G256",  "G386",  null,    null,    null,    null],
  },
  "5kPa_5mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","C255MP","A325MP","A405MP","A505MP"],
    aluminium:["A253AP","A253AP","A325AP","A503AP","A503AP",null],
    FRP:      ["G256",  "G386",  null,    null,    null,    null],
  },
  "5kPa_10mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","C205MP","A255MP","A325MP","C405MP"],
    aluminium:["A253AP","A253AP","A255AP","A403AP","A503AP",null],
    FRP:      ["G256",  "G386",  "G386",  null,    null,    null],
  },
  "7.5kPa_10mm": {
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["A205MP","A205MP","A205MP","C325MP","A405MP","C505MP"],
    aluminium:["A253AP","A255AP","A325AP","A405AP","A505AP",null],
    FRP:      [null,    null,    null,    null,    null,    null],
  },
  "4kPa_5mm_industrial": {
    note:"Heavy frequent use. No public access. AS/NZS1170",
    spans_mm: [600, 900, 1200, 1500, 1800, 2100],
    steel:    ["C205MP","C205MP","F255MP","F325MP","C405MP","C505MP"],
    aluminium:["A253AP","A255AP","A325AP","A405AP","A505AP",null],
    FRP:      ["G256",  "G386",  null,    null,    null,    null],
  },
};

// Webforge pattern codes decoded
// Pattern letter: A/B=flat top, C/D=raised pattern, F=floorplate-style
// Steel bar sizes (depth×thickness mm): common Webforge codes
export const WEBFORGE_BAR_SIZES = {
  // code: [depth_mm, thickness_mm]
  "205":[20,5], "253":[25,3], "255":[25,5],
  "323":[32,3], "325":[32,5],
  "403":[40,3], "405":[40,5],
  "503":[50,3], "505":[50,5],
  "655":[65,5], "756":[75,6],
};

// Webforge panel weights (untreated, unbanded) kg/m² – from catalog p.6 table
// Listed in ascending strength order (4kPa/5mm column = design reference)
export const WEBFORGE_STEEL_WEIGHTS_KG_M2 = {
  "F205MPU": 19.8, "C205MPU": 23.3, "C253MPU": 18.3, "D253MPU": 21.3,
  "F255MPU": 23.2, "A205MPU": 29.7, "C255MSU": 27.4, "A253MPU": 23.1,
  "B253MPU": 26.1, "C255MPU": 28.3, "D255MPU": 31.3, "A255MSU": 35.1,
  "F325MSU": 27.3, "C323MPU": 22.5, "A255MPU": 36.5, "B255MPU": 39.5,
  "F325MPU": 28.1, "A323MPU": 28.8, "C325MSU": 34.4, "C325MPU": 35.4,
  "D325MPU": 38.4, "A325MSU": 44.5, "C403MPU": 27.4, "F405MPU": 33.6,
  "A325MPU": 45.8, "B325MPU": 48.9, "A403MPU": 35.2, "C405MPU": 43.6,
  "A405MPU": 56.6, "B405MPU": 59.6, "C455MPU": 48.7, "A455MPU": 63.3,
  "C505MPU": 53.7, "A505MPU": 70.0, "A655MPU": 90.2, "A756MPU": 123.6,
};

// Webforge Webplate specifications (floorplate + grating composite)
export const WEBFORGE_WEBPLATE = [
  { code:"WP3 F255MP*", material:"Steel",  plate_mm:3, grating:"F255MP*", weight_kg_m2:44.49, span_4kPa_5mm_mm:1390 },
  { code:"WP5 F325MP*", material:"Steel",  plate_mm:5, grating:"F325MP*", weight_kg_m2:64.78, span_4kPa_5mm_mm:1625 },
  { code:"WP3 F255AP*", material:"Aluminium", plate_mm:3, grating:"F255AP*", weight_kg_m2:16.21, span_4kPa_5mm_mm:1100 },
  { code:"WP5 F325AP*", material:"Aluminium", plate_mm:5, grating:"F325AP*", weight_kg_m2:23.21, span_4kPa_5mm_mm:1350 },
];

// ============================================================================
// MATERIAL PROPERTIES – Reference (MBG 534-24 / YB/T 4001.1)
// ============================================================================
export const MATERIAL_PROPERTIES = {
  // Imperial (psi)
  imperial: [
    { material:"Steel – ASTM A1011 CS Type B", F_psi:18000, Fy_psi:30000, Fu_psi:null,  E_psi:29000000 },
    { material:"Steel – ASTM A1011 SS GR36",   F_psi:20000, Fy_psi:36000, Fu_psi:53000, E_psi:29000000 },
    { material:"Steel – ASTM A36",             F_psi:20000, Fy_psi:36000, Fu_psi:58000, E_psi:29000000 },
    { material:"SS 304/316 (ASTM A666)",        F_psi:20000, Fy_psi:30000, Fu_psi:75000, E_psi:28000000 },
    { material:"SS 304L/316L (ASTM A666)",      F_psi:16500, Fy_psi:25000, Fu_psi:70000, E_psi:28000000 },
    { material:"Aluminium 6061-T6 (B221)",      F_psi:12000, Fy_psi:35000, Fu_psi:38000, E_psi:10000000 },
    { material:"Aluminium 6063-T6 (B221)",      F_psi:12000, Fy_psi:25000, Fu_psi:30000, E_psi:10000000 },
    { material:"Aluminium 6005A-T61 (B221)",    F_psi:12000, Fy_psi:35000, Fu_psi:38000, E_psi:10000000 },
    { material:"Aluminium 6105-T5 (B221)",      F_psi:12000, Fy_psi:35000, Fu_psi:38000, E_psi:10000000 },
  ],
  // Metric (MPa)
  metric: [
    { material:"Steel – ASTM A1011M CS Type B", F_MPa:124.11, Fy_MPa:205,   Fu_MPa:null,  E_MPa:200000 },
    { material:"Steel – ASTM A1011M SS GR250",  F_MPa:137.90, Fy_MPa:250,   Fu_MPa:365,   E_MPa:200000 },
    { material:"Steel – ASTM A36M",             F_MPa:137.90, Fy_MPa:250,   Fu_MPa:400,   E_MPa:200000 },
    { material:"SS 304/316 (ASTM A666)",        F_MPa:137.90, Fy_MPa:207,   Fu_MPa:517,   E_MPa:193000 },
    { material:"SS 304L/316L (ASTM A666)",      F_MPa:113.77, Fy_MPa:172,   Fu_MPa:483,   E_MPa:193000 },
    { material:"Aluminium 6061-T6",             F_MPa:82.74,  Fy_MPa:241,   Fu_MPa:262,   E_MPa:68950  },
    { material:"Aluminium 6063-T6",             F_MPa:82.74,  Fy_MPa:172,   Fu_MPa:207,   E_MPa:68950  },
  ],
  // YB/T 4001.1-2007 (carbon structural steel)
  ybt: {
    material:"Carbon structural steel (YB/T 4001.1)",
    F_kN_m2:170000, E_kN_m2:206000000,
    note:"Design strength 170×10³ kN/m². Load tables include self-weight.",
  },
  // Webforge
  webforge: { material:"Grade 250 Mild Steel", allowable_MPa:171 },
};

// ============================================================================
// UNIT CONVERSION HELPERS
// ============================================================================
export const CONVERSIONS = {
  psf_to_kPa: 0.04788,       // lbs/ft² → kPa
  kPa_to_psf: 20.885,        // kPa → lbs/ft²
  in_to_mm:   25.4,
  mm_to_in:   0.03937,
  lbft_to_kNm: 0.01459,      // lbs/ft of width → kN/m
  kNm_to_lbft: 68.52,
  lb_to_kg:   0.4536,
  psf_to_kgm2: 4.882,        // lbs/ft² → kg/m²
  kgm2_to_psf: 0.2048,
};


// ============================================================================
// ██████████████████████████████████████████████████████████████████████████
//  SUPPLEMENT — STAIR TREADS / TRENCH COVERS / FRP / ACCESSORIES
// ██████████████████████████████████████████████████████████████████████████
// ============================================================================

// ============================================================================
// STAIR TREADS — YB/T 4001.3-2020
// Source: 踏步板目录.docx
// ============================================================================

/** Load requirements per YB/T 4001.3-2020 §5 */
export const YBT_TREAD_LOAD_REQUIREMENTS = {
  concentrated_kN: 1.5,
  damage_test_kN: 4.4,
  udl_kN_m: 2.2,            // uniformly distributed along full length
  max_deflection_rule: "min(L/300, 6mm)",  // under 1.5kN concentrated
  load_area_mm: "100×100",  // footprint of concentrated load
  stiffness_factor_gamma: 0.729, // bending stiffness adjustment for flat steel
  note: "After 1.5kN test load removed, permanent deformation ≤ L/1000"
};

/** Tread types */
export const YBT_TREAD_TYPES = {
  TA: { desc:"Welded end-plate, direct weld to stringer, no mounting holes", connection:"weld" },
  TB: { desc:"Bolted end-plate with mounting holes (65mm wide), bolt M12 to stringer", connection:"bolt" },
};

/** Nosing (anti-slip flange) requirements */
export const YBT_TREAD_NOSING = {
  min_width_mm: 25,
  typical_width_mm: 30,
  materials: ["Patterned steel plate","Cold-formed angle steel","Steel with anti-slip protrusions","Sand strips"],
};

/** TB-type end plate mounting hole centre distance (Table 1, YB/T 4001.3-2020) */
export const YBT_TREAD_BOLT_HOLE_CENTRES = [
  { end_plate_t_mm:[125,125],     hole_centre_A_mm:45  },
  { end_plate_t_mm:[155,185],     hole_centre_A_mm:75  },
  { end_plate_t_mm:[215,245],     hole_centre_A_mm:100 },
  { end_plate_t_mm:[275,305],     hole_centre_A_mm:150 },
  { end_plate_t_mm:[306,999],     hole_centre_A_mm:200 },
];

/** Tread sizing guide */
export const YBT_TREAD_SIZING = {
  length_mm:      { min:600, max:2000, note:"= stair width" },
  width_mm:       { min:125, max:305,  note:"grating + flange" },
  single_pass_L:  { min:600, max:1199 },
  double_pass_L:  { min:1200, max:1599 },
  triple_pass_L:  { min:1600, max:2000 },
};

// ============================================================================
// STAIR TREADS — VULCRAFT (NAAMM MBG 531-17/531-19)
// Source: Vulcraft_Grating_Manual_Aug_23.docx
// Basis: 300-lb (1.32kN) point load, L/240 deflection limit
// ============================================================================

/** Maximum tread span/length in inches — Imperial */
export const VULCRAFT_TREAD_MAX_SPAN_IN = {
  // bar_size → { smooth: {19W4, 11W4, 7W4}, serrated: {19W4, 11W4, 7W4} }
  "1\"×3/16\"":    { smooth:{W19:41, W11:51, W7:59}, serrated:{W19:34, W11:45, W7:51} },
  "1¼\"×3/16\"":   { smooth:{W19:56, W11:66, W7:66}, serrated:{W19:50, W11:58, W7:66} },
  "1½\"×3/16\"":   { smooth:{W19:66, W11:66, W7:76}, serrated:{W19:63, W11:66, W7:68} },
  note:"Spans > 5'6\" use third-point loads; L/240 governs",
};

/** Maximum tread span/length in mm — Metric */
export const VULCRAFT_TREAD_MAX_SPAN_MM = {
  "25×5":  { smooth:{W19:1041, W11:1295, W7:1498}, serrated:{W19:863,  W11:1143, W7:1295} },
  "32×5":  { smooth:{W19:1422, W11:1676, W7:1676}, serrated:{W19:1270, W11:1473, W7:1676} },
  "38×5":  { smooth:{W19:1676, W11:1676, W7:1930}, serrated:{W19:1600, W11:1676, W7:1727} },
  note:"1.32kN point load; L/240 deflection limit",
};

/** 19W4 tread widths and bolt hole spacing */
export const VULCRAFT_TREAD_19W4_WIDTHS = {
  // bars+nosing: [tread_width, bolt_hole_A]
  5: ["6-3/16\"","2-1/2\""],  6: ["7-3/8\"","4-1/2\""],  7: ["8-9/16\"","4-1/2\""],
  8: ["9-3/4\"","7\""],       9: ["10-15/16\"","7\""],   10: ["12-1/8\"","7\""],
};

/** 11W4 tread widths and bolt hole spacing */
export const VULCRAFT_TREAD_11W4_WIDTHS = {
  9:  ["6-15/16\"","2-1/2\""], 11: ["8-5/16\"","4-1/2\""], 13: ["8-9/16\"","4-1/2\""],
  15: ["11-1/16\"","7\""],    16: ["11-3/4\"","7\""],      18: ["13-1/8\"","7\""],
};

/** End plate dimensions */
export const VULCRAFT_TREAD_END_PLATE = {
  "up_to_1.25in": { B_in:"1-3/4", C_in:"2-1/2" },
  "1.5in":        { B_in:"2-1/4", C_in:"3"     },
};

// ============================================================================
// TRENCH / GUTTER COVERS — YB/T 4001.1-2007, Appendix B
// Source: 原始文件.docx
// Units: dimensions mm, weight kg/piece
// ============================================================================

/** Load classes for vehicle-traffic grating covers */
export const COVER_LOAD_CLASSES = [
  { class:"T-25", full_load_kg:25000, rear_wheel_kN:100, contact_area_mm:"200×500" },
  { class:"T-20", full_load_kg:20000, rear_wheel_kN:80,  contact_area_mm:"200×500" },
  { class:"T-14", full_load_kg:14000, rear_wheel_kN:56,  contact_area_mm:"200×500" },
  { class:"T-6",  full_load_kg:6000,  rear_wheel_kN:24,  contact_area_mm:"200×240" },
  { class:"T-2",  full_load_kg:2000,  rear_wheel_kN:8,   contact_area_mm:"200×160" },
];

/**
 * TABLE B.2 — GT-type side/cross ditch steel grating covers
 * T-shaped support (angle steel edge). HDG finish.
 * model format: GT{trench_width}-{bar_depth}
 * dims: b×a×h mm  (b=length ~995mm, a=overall cover width, h=bearing bar depth)
 */
export const GT_GUTTER_COVERS = {
  "T-2_pedestrian": [
    {trench_mm:100, model:"GT100-20", dims:"995×160×20", weight_kg:4.0, angle:"L40×25×5"},
    {trench_mm:120, model:"GT120-20", dims:"995×180×20", weight_kg:4.4, angle:"L40×25×5"},
    {trench_mm:150, model:"GT150-20", dims:"995×210×20", weight_kg:5.2, angle:"L40×25×5"},
    {trench_mm:180, model:"GT180-20", dims:"995×240×20", weight_kg:5.7, angle:"L40×25×5"},
    {trench_mm:200, model:"GT200-20", dims:"995×260×20", weight_kg:6.0, angle:"L40×25×5"},
    {trench_mm:240, model:"GT240-25", dims:"995×304×25", weight_kg:13.4,angle:"L40×28×3"},
    {trench_mm:300, model:"GT300-25", dims:"995×364×25", weight_kg:15.9,angle:"L40×28×3"},
    {trench_mm:360, model:"GT360-25", dims:"995×424×25", weight_kg:18.3,angle:"L40×28×3"},
    {trench_mm:400, model:"GT400-25", dims:"995×464×25", weight_kg:19.7,angle:"L40×28×3"},
    {trench_mm:450, model:"GT450-32", dims:"995×544×32", weight_kg:28.8,angle:"L56×36×4"},
    {trench_mm:500, model:"GT500-45", dims:"995×580×45", weight_kg:42.2,angle:"L50×50×5"},
    {trench_mm:600, model:"GT600-50", dims:"995×690×50", weight_kg:54.8,angle:"L56×56×6"},
  ],
  "T-6": [
    {trench_mm:100, model:"GT100-25", dims:"995×164×25", weight_kg:8.2, angle:"L40×28×3"},
    {trench_mm:120, model:"GT120-25", dims:"995×184×25", weight_kg:9.2, angle:"L40×28×3"},
    {trench_mm:150, model:"GT150-25", dims:"995×214×25", weight_kg:10.2,angle:"L40×28×3"},
    {trench_mm:180, model:"GT180-25", dims:"995×244×25", weight_kg:11.3,angle:"L40×28×3"},
    {trench_mm:200, model:"GT200-32", dims:"995×294×32", weight_kg:16.6,angle:"L56×36×4"},
    {trench_mm:240, model:"GT240-32", dims:"995×334×32", weight_kg:18.7,angle:"L56×36×4"},
    {trench_mm:300, model:"GT300-38", dims:"995×416×38", weight_kg:26.7,angle:"L70×45×7"},
    {trench_mm:360, model:"GT360-45", dims:"995×440×45", weight_kg:33.0,angle:"L50×50×5"},
    {trench_mm:400, model:"GT400-50", dims:"995×490×50", weight_kg:40.0,angle:"L56×56×6"},
    {trench_mm:450, model:"GT450-50", dims:"995×540×50", weight_kg:43.4,angle:"L56×56×6"},
    {trench_mm:500, model:"GT500-50", dims:"995×590×50", weight_kg:47.4,angle:"L56×56×6"},
    {trench_mm:600, model:"GT600-55", dims:"995×700×55", weight_kg:60.8,angle:"L60×60×5"},
  ],
  "T-14": [
    {trench_mm:100, model:"GT100-25", dims:"995×164×25", weight_kg:8.2, angle:"L40×28×3"},
    {trench_mm:120, model:"GT120-25", dims:"995×184×25", weight_kg:9.2, angle:"L40×28×3"},
    {trench_mm:150, model:"GT150-25", dims:"995×214×25", weight_kg:10.2,angle:"L40×28×3"},
    {trench_mm:180, model:"GT180-32", dims:"995×274×32", weight_kg:15.7,angle:"L56×36×4"},
    {trench_mm:200, model:"GT200-32", dims:"995×294×32", weight_kg:16.6,angle:"L56×36×4"},
    {trench_mm:240, model:"GT240-38", dims:"995×356×38", weight_kg:23.2,angle:"L70×45×7"},
    {trench_mm:300, model:"GT300-45", dims:"995×380×45", weight_kg:28.8,angle:"L50×50×5"},
    {trench_mm:360, model:"GT360-50", dims:"995×440×50", weight_kg:36.5,angle:"L56×56×6"},
    {trench_mm:400, model:"GT400-50", dims:"995×480×50", weight_kg:39.3,angle:"L56×56×6"},
    {trench_mm:450, model:"GT450-55", dims:"995×550×55", weight_kg:48.9,angle:"L60×60×5"},
    {trench_mm:500, model:"GT500-60", dims:"995×610×60", weight_kg:58.6,angle:"L65×65×5"},
    {trench_mm:600, model:"GT600-75", dims:"995×750×75", weight_kg:87.9,angle:"L80×80×5"},
  ],
  "T-20": [
    {trench_mm:100, model:"GT100-25", dims:"995×164×25", weight_kg:8.2, angle:"L40×28×3"},
    {trench_mm:120, model:"GT120-25", dims:"995×214×32", weight_kg:12.9,angle:"L56×36×4"},
    {trench_mm:150, model:"GT150-32", dims:"995×244×32", weight_kg:14.3,angle:"L56×36×4"},
    {trench_mm:180, model:"GT180-38", dims:"995×296×38", weight_kg:19.7,angle:"L70×45×7"},
    {trench_mm:200, model:"GT200-38", dims:"995×316×38", weight_kg:21.1,angle:"L70×45×7"},
    {trench_mm:240, model:"GT240-45", dims:"995×320×45", weight_kg:25.0,angle:"L50×50×5"},
    {trench_mm:300, model:"GT300-50", dims:"995×390×50", weight_kg:32.6,angle:"L56×56×6"},
    {trench_mm:360, model:"GT360-55", dims:"995×400×55", weight_kg:41.6,angle:"L60×60×5"},
    {trench_mm:400, model:"GT400-55", dims:"995×500×55", weight_kg:44.7,angle:"L60×60×5"},
    {trench_mm:450, model:"GT450-65", dims:"995×590×65", weight_kg:59.3,angle:"L70×70×5"},
    {trench_mm:500, model:"GT500-75", dims:"995×640×75", weight_kg:75.9,angle:"L80×80×5"},
  ],
  "T-25": [
    {trench_mm:100, model:"GT100-32", dims:"995×194×32", weight_kg:11.4,angle:"L56×36×4"},
    {trench_mm:120, model:"GT120-32", dims:"995×214×32", weight_kg:12.9,angle:"L56×36×4"},
    {trench_mm:150, model:"GT150-38", dims:"995×266×38", weight_kg:18.1,angle:"L70×45×7"},
    {trench_mm:180, model:"GT180-45", dims:"955×260×45", weight_kg:20.9,angle:"L50×50×5"},
    {trench_mm:200, model:"GT200-45", dims:"955×280×45", weight_kg:22.2,angle:"L50×50×5"},
    {trench_mm:240, model:"GT240-45", dims:"955×320×45", weight_kg:25.0,angle:"L50×50×5"},
    {trench_mm:300, model:"GT300-50", dims:"955×390×50", weight_kg:32.6,angle:"L56×56×6"},
    {trench_mm:360, model:"GT360-55", dims:"955×460×55", weight_kg:41.6,angle:"L60×60×5"},
    {trench_mm:400, model:"GT400-65", dims:"955×520×65", weight_kg:54.7,angle:"L70×70×5"},
    {trench_mm:450, model:"GT450-75", dims:"995×590×75", weight_kg:70.3,angle:"L80×80×5"},
  ],
};

/**
 * TABLE B.3 — GU-type U-channel grating covers (no T-edge required)
 * dims: b×W×h  (b=length 995mm, W=grating width, h=bar depth)
 */
export const GU_GUTTER_COVERS = {
  "T-2_pedestrian": [
    {trench_mm:100, model:"GU100-20", dims:"995×90×20",  angle:"L30×3", weight_kg:4.4},
    {trench_mm:120, model:"GU120-20", dims:"995×110×20", angle:"L30×3", weight_kg:5.0},
    {trench_mm:150, model:"GU150-20", dims:"995×140×20", angle:"L30×3", weight_kg:5.5},
    {trench_mm:180, model:"GU180-20", dims:"995×170×20", angle:"L30×3", weight_kg:6.0},
    {trench_mm:200, model:"GU200-25", dims:"995×190×25", angle:"L40×5", weight_kg:12.2},
    {trench_mm:240, model:"GU240-25", dims:"995×230×25", angle:"L40×5", weight_kg:13.9},
    {trench_mm:300, model:"GU300-25", dims:"995×290×25", angle:"L40×5", weight_kg:16.0},
    {trench_mm:360, model:"GU360-25", dims:"995×350×25", angle:"L40×5", weight_kg:18.4},
    {trench_mm:400, model:"GU400-32", dims:"995×390×32", angle:"L40×5", weight_kg:23.7},
    {trench_mm:450, model:"GU450-32", dims:"995×443×32", angle:"L40×5", weight_kg:26.3},
    {trench_mm:500, model:"GU500-45", dims:"995×488×45", angle:"L50×6", weight_kg:41.7},
    {trench_mm:600, model:"GU600-50", dims:"995×588×50", angle:"L56×6", weight_kg:53.8},
  ],
  "T-6": [
    {trench_mm:100, model:"GU100-25", dims:"995×90×25",  angle:"L40×5", weight_kg:8.3},
    {trench_mm:120, model:"GU120-25", dims:"995×110×25", angle:"L40×5", weight_kg:9.3},
    {trench_mm:150, model:"GU150-25", dims:"995×140×25", angle:"L40×5", weight_kg:10.4},
    {trench_mm:180, model:"GU180-25", dims:"995×170×25", angle:"L40×5", weight_kg:11.4},
    {trench_mm:200, model:"GU200-25", dims:"995×190×25", angle:"L40×5", weight_kg:12.2},
    {trench_mm:240, model:"GU240-32", dims:"995×230×32", angle:"L40×5", weight_kg:16.1},
    {trench_mm:300, model:"GU300-38", dims:"995×290×38", angle:"L40×5", weight_kg:21.3},
    {trench_mm:360, model:"GU360-45", dims:"995×350×45", angle:"L50×6", weight_kg:32.5},
    {trench_mm:400, model:"GU400-45", dims:"995×390×45", angle:"L50×6", weight_kg:35.1},
    {trench_mm:450, model:"GU450-50", dims:"995×440×50", angle:"L50×6", weight_kg:41.6},
    {trench_mm:500, model:"GU500-50", dims:"995×490×50", angle:"L50×6", weight_kg:45.2},
    {trench_mm:600, model:"GU600-55", dims:"995×590×55", angle:"L63×6", weight_kg:59.4},
  ],
  "T-14": [
    {trench_mm:100, model:"GU100-25", dims:"995×90×25",  angle:"L40×5", weight_kg:8.3},
    {trench_mm:120, model:"GU120-25", dims:"995×110×25", angle:"L40×5", weight_kg:9.3},
    {trench_mm:150, model:"GU150-25", dims:"995×140×25", angle:"L40×5", weight_kg:10.4},
    {trench_mm:180, model:"GU180-25", dims:"995×170×25", angle:"L40×5", weight_kg:11.4},
    {trench_mm:200, model:"GU200-32", dims:"995×190×32", angle:"L40×5", weight_kg:14.0},
    {trench_mm:240, model:"GU240-32", dims:"995×230×32", angle:"L40×5", weight_kg:16.1},
    {trench_mm:300, model:"GU300-45", dims:"995×290×45", angle:"L50×6", weight_kg:28.4},
    {trench_mm:360, model:"GU360-50", dims:"995×350×45", angle:"L50×6", weight_kg:32.5},
    {trench_mm:400, model:"GU400-50", dims:"995×390×50", angle:"L50×6", weight_kg:37.8},
    {trench_mm:450, model:"GU450-55", dims:"995×440×55", angle:"L63×6", weight_kg:47.4},
  ],
};

/**
 * TABLE B.4 — GM-type manhole / wellhole steel grating covers
 * dims: h×a×b (h=depth, a=length, b=width in mm)
 * Frame dims: B×A×H
 */
export const GM_MANHOLE_COVERS = [
  // T-25
  {load:"T-25",hole_mm:"300×400",model:"GM34-55",grating_mm:"305×500×55",g_kg:14.2,frame_mm:"335×520×60",f_angle:"L60×5",f_kg:7.6},
  {load:"T-25",hole_mm:"400×400",model:"GM44-55",grating_mm:"395×500×55",g_kg:18.3,frame_mm:"425×520×60",f_angle:"L60×5",f_kg:8.5},
  {load:"T-25",hole_mm:"500×400",model:"GM54-55",grating_mm:"485×500×55",g_kg:22.5,frame_mm:"515×520×60",f_angle:"L60×5",f_kg:9.3},
  {load:"T-25",hole_mm:"300×500",model:"GM35-65",grating_mm:"305×620×65",g_kg:22.8,frame_mm:"335×640×70",f_angle:"L70×5",f_kg:9.4},
  {load:"T-25",hole_mm:"400×500",model:"GM45-65",grating_mm:"395×620×65",g_kg:29.5,frame_mm:"425×640×70",f_angle:"L70×5",f_kg:10.4},
  {load:"T-25",hole_mm:"500×500",model:"GM55-65",grating_mm:"485×620×65",g_kg:36.2,frame_mm:"515×640×70",f_angle:"L70×5",f_kg:11.4},
  {load:"T-25",hole_mm:"300×600",model:"GM36-75",grating_mm:"305×740×75",g_kg:28.6,frame_mm:"335×760×80",f_angle:"L80×5",f_kg:11.5},
  {load:"T-25",hole_mm:"400×600",model:"GM46-75",grating_mm:"395×740×75",g_kg:36.4,frame_mm:"425×760×80",f_angle:"L80×5",f_kg:12.6},
  {load:"T-25",hole_mm:"500×600",model:"GM56-75",grating_mm:"485×740×75",g_kg:44.3,frame_mm:"515×760×80",f_angle:"L80×5",f_kg:13.7},
  {load:"T-25",hole_mm:"500×700",model:"GM57-75",grating_mm:"485×840×75",g_kg:49.9,frame_mm:"515×860×80",f_angle:"L80×5",f_kg:14.5},
  {load:"T-25",hole_mm:"700×700",model:"GM77-75",grating_mm:"695×840×75",g_kg:70.6,frame_mm:"725×860×80",f_angle:"L80×5",f_kg:17.1},
  // T-20
  {load:"T-20",hole_mm:"300×400",model:"GM34-50",grating_mm:"305×490×50",g_kg:12.8,frame_mm:"335×510×56",f_angle:"L56×6",f_kg:7.7},
  {load:"T-20",hole_mm:"400×400",model:"GM44-50",grating_mm:"395×490×50",g_kg:16.5,frame_mm:"425×510×56",f_angle:"L56×6",f_kg:8.6},
  {load:"T-20",hole_mm:"500×400",model:"GM54-50",grating_mm:"485×490×50",g_kg:20.3,frame_mm:"515×510×56",f_angle:"L56×6",f_kg:9.5},
  {load:"T-20",hole_mm:"300×500",model:"GM35-55",grating_mm:"305×600×55",g_kg:16.7,frame_mm:"335×620×60",f_angle:"L60×5",f_kg:8.2},
  {load:"T-20",hole_mm:"400×500",model:"GM45-55",grating_mm:"395×600×55",g_kg:21.7,frame_mm:"425×620×60",f_angle:"L60×5",f_kg:9.0},
  {load:"T-20",hole_mm:"500×600",model:"GM36-55",grating_mm:"485×600×55",g_kg:26.6,frame_mm:"515×620×60",f_angle:"L60×5",f_kg:9.8},
  {load:"T-20",hole_mm:"400×600",model:"GM46-65",grating_mm:"305×720×65",g_kg:26.2,frame_mm:"335×740×70",f_angle:"L70×5",f_kg:10.8},
  {load:"T-20",hole_mm:"500×600",model:"GM56-65",grating_mm:"485×720×65",g_kg:41.6,frame_mm:"515×740×70",f_angle:"L70×5",f_kg:13.1},
  {load:"T-20",hole_mm:"600×600",model:"GM66-65",grating_mm:"605×720×65",g_kg:51.9,frame_mm:"635×740×70",f_angle:"L70×5",f_kg:14.6},
  {load:"T-20",hole_mm:"500×700",model:"GM57-75",grating_mm:"485×840×75",g_kg:49.9,frame_mm:"515×860×80",f_angle:"L80×5",f_kg:14.5},
  {load:"T-20",hole_mm:"700×700",model:"GM77-75",grating_mm:"695×840×75",g_kg:68.0,frame_mm:"725×860×80",f_angle:"L80×5",f_kg:17.1},
  // T-14 (also covers T-6)
  {load:"T-14",hole_mm:"300×400",model:"GM34-45",grating_mm:"305×480×45",g_kg:11.3,frame_mm:"335×500×50",f_angle:"L50×5",f_kg:6.5},
  {load:"T-14",hole_mm:"400×400",model:"GM44-45",grating_mm:"395×480×45",g_kg:14.7,frame_mm:"425×500×50",f_angle:"L50×5",f_kg:7.2},
  {load:"T-14",hole_mm:"500×400",model:"GM54-45",grating_mm:"485×480×45",g_kg:18.0,frame_mm:"515×500×50",f_angle:"L50×5",f_kg:7.8},
  {load:"T-14",hole_mm:"300×500",model:"GM35-50",grating_mm:"305×590×50",g_kg:15.1,frame_mm:"335×610×56",f_angle:"L56×6",f_kg:8.2},
  {load:"T-14",hole_mm:"400×500",model:"GM45-50",grating_mm:"395×590×50",g_kg:19.5,frame_mm:"425×610×56",f_angle:"L56×6",f_kg:9.2},
  {load:"T-14",hole_mm:"500×500",model:"GM55-50",grating_mm:"485×590×50",g_kg:24.0,frame_mm:"515×610×56",f_angle:"L56×6",f_kg:10.1},
  {load:"T-14",hole_mm:"300×600",model:"GM36-55",grating_mm:"305×700×55",g_kg:19.3,frame_mm:"335×720×60",f_angle:"L60×5",f_kg:8.7},
  {load:"T-14",hole_mm:"400×600",model:"GM46-55",grating_mm:"395×700×55",g_kg:25.0,frame_mm:"425×720×60",f_angle:"L60×5",f_kg:9.6},
  {load:"T-14",hole_mm:"500×600",model:"GM56-55",grating_mm:"485×700×55",g_kg:34.6,frame_mm:"515×720×60",f_angle:"L60×5",f_kg:10.4},
  {load:"T-14",hole_mm:"600×600",model:"GM66-55",grating_mm:"605×700×55",g_kg:38.2,frame_mm:"635×720×60",f_angle:"L60×5",f_kg:11.5},
  {load:"T-14",hole_mm:"500×700",model:"GM57-60",grating_mm:"485×810×60",g_kg:38.1,frame_mm:"515×830×65",f_angle:"L65×5",f_kg:12.7},
  {load:"T-14",hole_mm:"700×700",model:"GM77-60",grating_mm:"695×810×60",g_kg:54.6,frame_mm:"725×830×65",f_angle:"L65×5",f_kg:15.2},
  // T-2 (pedestrian)
  {load:"T-2",hole_mm:"300×400",model:"GM34-32",grating_mm:"305×454×32",g_kg:7.9, frame_mm:"335×472×36",f_angle:"L36×4",f_kg:4.4},
  {load:"T-2",hole_mm:"400×400",model:"GM44-32",grating_mm:"395×454×32",g_kg:10.3,frame_mm:"425×472×36",f_angle:"L36×4",f_kg:4.8},
  {load:"T-2",hole_mm:"500×400",model:"GM54-32",grating_mm:"485×454×32",g_kg:12.6,frame_mm:"485×472×36",f_angle:"L36×4",f_kg:5.0},
  {load:"T-2",hole_mm:"300×500",model:"GM35-40",grating_mm:"305×570×40",g_kg:11.9,frame_mm:"335×590×45",f_angle:"L45×5",f_kg:5.9},
  {load:"T-2",hole_mm:"400×500",model:"GM45-40",grating_mm:"395×570×40",g_kg:15.4,frame_mm:"425×590×45",f_angle:"L45×5",f_kg:6.5},
  {load:"T-2",hole_mm:"500×500",model:"GM55-40",grating_mm:"485×570×40",g_kg:18.9,frame_mm:"515×590×45",f_angle:"L45×5",f_kg:7.2},
  {load:"T-2",hole_mm:"300×600",model:"GM36-40",grating_mm:"305×670×40",g_kg:13.8,frame_mm:"335×690×45",f_angle:"L45×5",f_kg:6.3},
  {load:"T-2",hole_mm:"400×600",model:"GM46-40",grating_mm:"395×670×40",g_kg:17.9,frame_mm:"425×690×45",f_angle:"L45×5",f_kg:6.9},
  {load:"T-2",hole_mm:"500×600",model:"GM56-40",grating_mm:"485×670×40",g_kg:21.9,frame_mm:"515×690×45",f_angle:"L45×5",f_kg:7.5},
  {load:"T-2",hole_mm:"600×600",model:"GM66-40",grating_mm:"605×670×40",g_kg:27.4,frame_mm:"635×690×45",f_angle:"L45×5",f_kg:8.3},
  {load:"T-2",hole_mm:"500×700",model:"GM57-45",grating_mm:"485×780×45",g_kg:28.2,frame_mm:"515×800×50",f_angle:"L50×5",f_kg:8.6},
  {load:"T-2",hole_mm:"700×700",model:"GM77-45",grating_mm:"695×780×45",g_kg:40.4,frame_mm:"725×800×50",f_angle:"L50×5",f_kg:10.2},
];

// ============================================================================
// FRP GRATING — WEBFORGE
// Source: webforge-access-03-2025.docx
// U = kPa uniformly distributed load. D = deflection mm.
// Spans: 450/600/750/900/1200 mm. Panel: 1220×3660 mm.
// ============================================================================
export const WEBFORGE_FRP_SPANS_MM = [450, 600, 750, 900, 1200];

export const WEBFORGE_FRP = [
  {
    code:"G256",  bar_mm:"6×25", pitch_mm:38, weight_kg_m2:12.1,
    min_span_4kPa_mm:785,
    // [U kPa, D mm] at each span
    loads:[
      {span_mm:450,  U:15, D:1.6},
      {span_mm:600,  U:10, D:4.1},
      {span_mm:750,  U:4,  D:4.1},
      {span_mm:900,  U:2.5,D:5.1},
      {span_mm:1200, U:2.5,D:15.3},
    ],
  },
  {
    code:"G386",  bar_mm:"6×38", pitch_mm:38, weight_kg_m2:18.6,
    min_span_4kPa_mm:990,
    loads:[
      {span_mm:450,  U:15, D:1.0},
      {span_mm:600,  U:15, D:2.4},
      {span_mm:750,  U:10, D:3.7},
      {span_mm:900,  U:5,  D:3.8},
      {span_mm:1200, U:2.5,D:5.9},
    ],
  },
  {
    code:"G38619",bar_mm:"6×38", pitch_mm:19, note:"Mini Mesh, aperture 12×12mm",
    weight_kg_m2:23.1, min_span_4kPa_mm:1035,
    loads:[
      {span_mm:450,  U:15, D:1.0},
      {span_mm:600,  U:15, D:2.4},
      {span_mm:750,  U:10, D:3.6},
      {span_mm:900,  U:7.5,D:4.7},
      {span_mm:1200, U:2.5,D:4.8},
    ],
  },
];

export const WEBFORGE_FRP_INFO = {
  panel_size_mm: "1220×3660",
  material: { I:"Isopthalic Polyester – ASTM E-84 Class A, flame spread ≤25",
              V:"Vinyl Ester – ASTM E-84 Class A, flame spread ≤25" },
  surface: "Grit (G) standard; Plain (P) on request",
  colors: { G:"Green (Isopthalic Polyester)", Y:"Yellow (Vinyl Ester)", D:"Dark Grey (Mini Mesh only)" },
  design_basis: "Single span, allowable stress 171 MPa equivalent",
  U_note:"Superimposed UDL only, excludes self-weight. 100kg/m² ≈ 0.98kPa",
};

// ============================================================================
// FRP GRATING — McNICHOLS (Molded & Pultruded)
// Source: McNICHOLS-2018-Gratings-Catalog_Web.docx
// U=deflection (in) under uniform load (lbs/ft²)
// C=deflection (in) under concentrated load (lbs/ft of width)
// Safe Load = 5:1 safety factor (lbs/ft² for U, lbs/ft for C)
// ============================================================================

export const MCNICHOLS_FRP_MOLDED_SPANS_IN = [12,18,24,30,36,42,48,54];

// MS-S-100: 1" height, 1-1/2"×1-1/2" grid, 70% OA, 2.6 lbs/sf
export const MCNICHOLS_FRP_MS_S_100 = {
  height_in:1, grid:"1-1/2\"×1-1/2\"", weight_psf:2.6, open_area_pct:70, safe_load_U:5,
  data:[
    {span_in:12, U_safe:1360, C_safe:680,
     U_defl:[null,null,0.013,0.017,0.021,0.025,0.034,0.042],
     C_defl:[null,0.014,0.020,0.027,0.034,0.041,0.054,0.068]},
    {span_in:18, U_safe:666,  C_safe:500,
     U_defl:[0.021,0.041,0.062,0.082,0.103,0.123,0.164,0.205],
     C_defl:[0.022,0.044,0.066,0.088,0.110,0.131,0.175,0.219]},
    {span_in:24, U_safe:380,  C_safe:380,
     U_defl:[0.064,0.128,0.192,0.256,0.320,0.384,0.512,0.640],
     C_defl:[0.051,0.102,0.154,0.205,0.256,0.307,0.409,0.512]},
    {span_in:30, U_safe:240,  C_safe:300,
     U_defl:[0.155,0.309,0.464,0.619,null,null,null,null],
     C_defl:[0.099,0.198,0.297,0.396,0.495,0.594,null,null]},
    {span_in:36, U_safe:160,  C_safe:240,
     U_defl:[0.318,0.635,null,null,null,null,null,null],
     C_defl:[0.169,0.339,0.508,0.677,null,null,null,null]},
  ],
  load_levels_psf:[50,100,150,200,250,300,400,500],
};

// MS-S-150: 1-1/2" height, 1-1/2"×1-1/2" grid, 72% OA
export const MCNICHOLS_FRP_MS_S_150 = {
  height_in:1.5, grid:"1-1/2\"×1-1/2\"", weight_psf:null, open_area_pct:72, safe_load_U:5,
  data:[
    {span_in:12,U_safe:3120,C_safe:1560},
    {span_in:18,U_safe:1386,C_safe:1040},
    {span_in:24,U_safe:780, C_safe:780},
    {span_in:30,U_safe:496, C_safe:620},
    {span_in:36,U_safe:347, C_safe:520},
    {span_in:42,U_safe:251, C_safe:440},
    {span_in:48,U_safe:170, C_safe:340},
  ],
};

// MS-S-200: 2" height, 2"×2" grid
export const MCNICHOLS_FRP_MS_S_200 = {
  height_in:2, grid:"2\"×2\"", safe_load_U:5,
  data:[
    {span_in:12,U_safe:4000,C_safe:2000},
    {span_in:18,U_safe:1813,C_safe:1360},
    {span_in:24,U_safe:960, C_safe:960},
    {span_in:30,U_safe:640, C_safe:800},
    {span_in:36,U_safe:453, C_safe:680},
    {span_in:42,U_safe:331, C_safe:580},
    {span_in:48,U_safe:260, C_safe:520},
    {span_in:54,U_safe:204, C_safe:460},
  ],
};

// MS-M-150: 1-1/2" height, 3/4"×3/4" top / 1-1/2"×1-1/2" bottom, 40% OA (ADA)
export const MCNICHOLS_FRP_MS_M_150 = {
  height_in:1.5, grid_top:"3/4\"×3/4\"", grid_bottom:"1-1/2\"×1-1/2\"",
  weight_psf:4.4, open_area_pct:40, safe_load_U:5,
  data:[
    {span_in:12,U_safe:3860,C_safe:1930},
    {span_in:18,U_safe:1776,C_safe:1332},
    {span_in:24,U_safe:1052,C_safe:1052},
    {span_in:30,U_safe:632, C_safe:790},
    {span_in:36,U_safe:456, C_safe:684},
    {span_in:42,U_safe:332, C_safe:582},
    {span_in:48,U_safe:215, C_safe:null},
  ],
};

// MS-I-6010: Pultruded I-Bar, 1"×0.600", safe load 2:1
export const MCNICHOLS_FRP_MS_I_6010 = {
  series:"MS-I-6010", height_in:1, bar:"1\"×0.600\"",
  A_in:1.500, B_in:0.900, C_in:0.900, open_area_pct:60,
  weight_psf:2.4, safe_load_factor:2,
  data:[
    {span_in:12,U_safe:10401,C_safe:5200},{span_in:18,U_safe:4954,C_safe:3716},
    {span_in:24,U_safe:2900,C_safe:2900},{span_in:30,U_safe:1856,C_safe:2320},
    {span_in:36,U_safe:1289,C_safe:1933},{span_in:42,U_safe:943, C_safe:1649},
    {span_in:48,U_safe:566, C_safe:1437},{span_in:54,U_safe:null,C_safe:1274},
  ],
};

// MS-I-6015: Pultruded I-Bar, 1-1/2"×0.600"
export const MCNICHOLS_FRP_MS_I_6015 = {
  series:"MS-I-6015", height_in:1.5, bar:"1-1/2\"×0.600\"",
  A_in:1.500, B_in:0.900, C_in:0.900, open_area_pct:60,
  weight_psf:3.0, safe_load_factor:2,
  data:[
    {span_in:12,U_safe:17601,C_safe:8800},{span_in:18,U_safe:7823,C_safe:5867},
    {span_in:24,U_safe:4400,C_safe:4400},{span_in:30,U_safe:2773,C_safe:3467},
    {span_in:36,U_safe:1896,C_safe:2845},{span_in:42,U_safe:1361,C_safe:2381},
    {span_in:48,U_safe:1017,C_safe:2033},{span_in:54,U_safe:777, C_safe:1748},
  ],
};

// MS-I-6515: Pultruded I-Bar (DURADEK), 1-1/2"×0.600", 8" cross bar spacing, 65% OA
export const MCNICHOLS_FRP_MS_I_6515 = {
  series:"MS-I-6515", height_in:1.5, bar:"1-1/2\"×0.600\"",
  A_in:1.710, B_in:1.100, C_in:1.110, open_area_pct:65, xbar_spacing_in:8,
  weight_psf:2.7, safe_load_factor:2,
  data:[
    {span_in:12,U_safe:15439,C_safe:7719},{span_in:18,U_safe:6862,C_safe:5146},
    {span_in:24,U_safe:3860,C_safe:3860},{span_in:30,U_safe:2433,C_safe:3041},
    {span_in:36,U_safe:1663,C_safe:2495},{span_in:42,U_safe:1194,C_safe:2088},
    {span_in:48,U_safe:892, C_safe:1784},{span_in:54,U_safe:681, C_safe:1533},
    {span_in:60,U_safe:533, C_safe:1333},{span_in:66,U_safe:425, C_safe:1170},
  ],
};

// ============================================================================
// ACCESSORIES / FIXING CLIPS
// Sources: Meiser meisergratingcatalogue.pdf, McNichols, IKG, Vulcraft
// ============================================================================

export const FIXING_CLIPS = {
  // MEISER clips (mesh-width dependent, galvanised or V2A stainless)
  meiser: [
    { type:"Clamp B",     code_galv:"M0531", mesh_mm:["33×33","34×38"], material:["galvanised","V2A"],
      desc:"Saddle top clip + clamp lower part + M8×60 hex screw + M8 square nut" },
    { type:"Clamp B10",   code_galv:"M2331", mesh_mm:["33×11","33×21"], material:["galvanised","V2A"],
      desc:"Stirrup top clip + hex socket screw + clip lower part + nut" },
    { type:"Safety Clamp A", code_galv:"M0731", mesh_mm:["34×38"], material:["galvanised","V2A"],
      desc:"Safety upper part + clamp lower part + hex screw + square nut" },
    { type:"Safety Clamp C", code_galv:"M2133", mesh_mm:["33×33","34×38"], material:["galvanised","V2A"],
      desc:"Safety upper part + clamp lower part + hex screw + square nut" },
    { type:"Safety Clamp D", code_galv:"M0833", mesh_mm:["34×38"], material:["galvanised","V2A"],
      desc:"Safety upper part + clamp lower part + hex screw + square nut" },
    { type:"Double Clamp B", code_galv:"M0540", mesh_mm:["33×33","33×22","33×11"], material:["galvanised","V2A"],
      desc:"2 saddle top clips + clamp lower part + 2 hex screws + 2 square nuts" },
    { type:"Head Bolt Fastener", code_galv:"X-FCM+X-M8", mesh_mm:["22×22 to 44×44"], material:["galvanised","V4A"],
      desc:"Head bolts + retaining flange; for highly corrosive/offshore use. Pre-mounted: X-GR-RU" },
  ],

  // McNICHOLS clips (bar grating)
  mcnichols_bar_grating: [
    { type:"Type CB", fit:"1-3/16\" bar pitch (Type CA for 15/16\")",
      material:["Aluminum","Galvanized Steel","Stainless Steel"],
      desc:"Saddle clip placed over two bearing bars, fastens to support" },
    { type:"Type GFS", fit:"5/8\" to 1-3/8\" bar spacing, up to 1-3/4\" height",
      material:"Galvanized Steel body, Stainless bracket",
      desc:"Saddle clip with cast malleable iron body, one offset wing" },
    { type:"Type GG",  fit:"15/16\" to 1-1/16\" bar spacing",
      material:["Galvanized Steel","Stainless Steel"],
      desc:"Hold-Down clip attaches grating to structural shape horizontally" },
    { type:"Type Z",   fit:"1\" or 1-1/2\" bar height",
      material:"Stainless Steel", hardware:"Available separately",
      desc:"Hold-Down clip secures panel to support frame" },
    { type:"Type J",   fit:"1\" or 1-1/2\" bar height",
      material:"Stainless Steel", hardware:"Integral with clip",
      desc:"Hold-Down clip secures panel to support frame" },
  ],

  // IKG / Generic bar grating
  ikg_generic: [
    { type:"Saddle Clip",   material:["Aluminum","Stainless Steel","Galvanized Steel"],
      desc:"Bent clip slides over cross bars. Cross bars may need field trimming." },
    { type:"G-Clip",        material:["Aluminum","Stainless Steel","Galvanized Steel"],
      desc:"Used with bar grating and embedded grating frames." },
    { type:"Z-Clip",        material:"Stainless Steel",
      sizes_in:["1\"(1\"&1-1/4\")","1-1/2\"(1-1/2\"&1-3/4\")","2\"(2\"-2-1/2\")"],
      desc:"Holds riveted grating. Pre-punched 1/4\" bolt or TEK screw hole." },
    { type:"Plate Fastener (Lug/Anchor Block)", thickness_in:["1/4\"","3/16\""],
      material:["Aluminum","Steel"],
      desc:"Shop-welded by manufacturer. Recessed, trip-free surface." },
    { type:"Hilti Disk",    application:"Oil & gas, offshore, shipbuilding, industrial",
      desc:"Suitable for wide range of fastening applications." },
    { type:"Weld Install",  desc:"Tack weld 3rd bar from each side, 3/16\" fillet × 3/4\" long." },
  ],

  // Vulcraft installation notes
  vulcraft_note:"Grating anchored per NAAMM recommendations. Minimum 1\" (25mm) bearing at each support for bar depths up to 2-1/4\"; 2\" (51mm) minimum for depths 2-1/2\" and over.",
};

// ============================================================================
// GUTTER COVERS (沟盖板) — YB/T 4001.1-2007, Appendix B
// Source: 原始文件.docx
//
// Load grades (Table B.1):
//   T-2:  2,000 kg total,  8 kN axle, contact 200×160 mm²
//   T-6:  6,000 kg total, 24 kN axle, contact 200×240 mm²
//   T-14:14,000 kg total, 56 kN axle, contact 200×500 mm²
//   T-20:20,000 kg total, 80 kN axle, contact 200×500 mm²
//   T-25:25,000 kg total,100 kN axle, contact 200×500 mm²
//
// Dimensions: trench_width_mm, cover b×a×h mm, weight kg/unit, seat angle
// Deflection limit: ≤ span/500 for road gutter covers
// ============================================================================

export const GUTTER_LOAD_GRADES = [
  { grade:"T-2",  total_mass_kg:2000,  axle_kN:8,   contact_mm:"200×160" },
  { grade:"T-6",  total_mass_kg:6000,  axle_kN:24,  contact_mm:"200×240" },
  { grade:"T-14", total_mass_kg:14000, axle_kN:56,  contact_mm:"200×500" },
  { grade:"T-20", total_mass_kg:20000, axle_kN:80,  contact_mm:"200×500" },
  { grade:"T-25", total_mass_kg:25000, axle_kN:100, contact_mm:"200×500" },
];

// GT-type: side and cross-section gutter covers (channel edge with T-support angle)
// model, cover_dim: "b×a×h" (length×width×depth, mm), weight_kg, seat_angle
export const TABLE_GT_GUTTER_COVERS = {
  "T-2_pedestrian": [
    { trench_mm:100, model:"GT100-20", dim:"995×160×20", weight_kg:4.0,  seat:"L40×25×5" },
    { trench_mm:120, model:"GT120-20", dim:"995×180×20", weight_kg:4.4,  seat:"L40×25×5" },
    { trench_mm:150, model:"GT150-20", dim:"995×210×20", weight_kg:5.2,  seat:"L40×25×5" },
    { trench_mm:180, model:"GT180-20", dim:"995×240×20", weight_kg:5.7,  seat:"L40×25×5" },
    { trench_mm:200, model:"GT200-20", dim:"995×260×20", weight_kg:6.0,  seat:"L40×25×5" },
    { trench_mm:240, model:"GT240-25", dim:"995×304×25", weight_kg:13.4, seat:"L40×28×3" },
    { trench_mm:300, model:"GT300-25", dim:"995×364×25", weight_kg:15.9, seat:"L40×28×3" },
    { trench_mm:360, model:"GT360-25", dim:"995×424×25", weight_kg:18.3, seat:"L40×28×3" },
    { trench_mm:400, model:"GT400-25", dim:"995×464×25", weight_kg:19.7, seat:"L40×28×3" },
    { trench_mm:450, model:"GT450-32", dim:"995×544×32", weight_kg:28.8, seat:"L56×36×4" },
    { trench_mm:500, model:"GT500-45", dim:"995×580×45", weight_kg:42.2, seat:"L50×50×5" },
    { trench_mm:600, model:"GT600-50", dim:"995×690×50", weight_kg:54.8, seat:"L56×56×6" },
  ],
  "T-6": [
    { trench_mm:100, model:"GT100-25", dim:"995×164×25", weight_kg:8.2,  seat:"L40×28×3" },
    { trench_mm:120, model:"GT120-25", dim:"995×184×25", weight_kg:9.2,  seat:"L40×28×3" },
    { trench_mm:150, model:"GT150-25", dim:"995×214×25", weight_kg:10.2, seat:"L40×28×3" },
    { trench_mm:180, model:"GT180-25", dim:"995×244×25", weight_kg:11.3, seat:"L40×28×3" },
    { trench_mm:200, model:"GT200-32", dim:"995×294×32", weight_kg:16.6, seat:"L56×36×4" },
    { trench_mm:240, model:"GT240-32", dim:"995×334×32", weight_kg:18.7, seat:"L56×36×4" },
    { trench_mm:300, model:"GT300-38", dim:"995×416×38", weight_kg:26.7, seat:"L70×45×7" },
    { trench_mm:360, model:"GT360-45", dim:"995×440×45", weight_kg:33.0, seat:"L50×50×5" },
    { trench_mm:400, model:"GT400-50", dim:"995×490×50", weight_kg:40.0, seat:"L56×56×6" },
    { trench_mm:450, model:"GT450-50", dim:"995×540×50", weight_kg:43.4, seat:"L56×56×6" },
    { trench_mm:500, model:"GT500-50", dim:"995×590×50", weight_kg:47.4, seat:"L56×56×6" },
    { trench_mm:600, model:"GT600-50", dim:"995×700×55", weight_kg:60.8, seat:"L60×60×5" },
  ],
  "T-14": [
    { trench_mm:100, model:"GT100-25", dim:"995×164×25", weight_kg:8.2,  seat:"L40×28×3" },
    { trench_mm:120, model:"GT120-25", dim:"995×184×25", weight_kg:9.2,  seat:"L40×28×3" },
    { trench_mm:150, model:"GT150-25", dim:"995×214×25", weight_kg:10.2, seat:"L40×28×3" },
    { trench_mm:180, model:"GT180-32", dim:"995×274×32", weight_kg:15.7, seat:"L56×36×4" },
    { trench_mm:200, model:"GT200-32", dim:"995×294×32", weight_kg:16.6, seat:"L56×36×4" },
    { trench_mm:240, model:"GT240-38", dim:"995×356×38", weight_kg:23.2, seat:"L70×45×7" },
    { trench_mm:300, model:"GT300-45", dim:"995×380×45", weight_kg:28.8, seat:"L50×50×5" },
    { trench_mm:360, model:"GT360-50", dim:"995×440×50", weight_kg:36.5, seat:"L56×56×6" },
    { trench_mm:400, model:"GT400-50", dim:"995×480×50", weight_kg:39.3, seat:"L56×56×6" },
    { trench_mm:450, model:"GT450-55", dim:"995×550×55", weight_kg:48.9, seat:"L60×60×5" },
    { trench_mm:500, model:"GT500-60", dim:"995×610×60", weight_kg:58.6, seat:"L65×65×5" },
    { trench_mm:600, model:"GT600-75", dim:"995×750×75", weight_kg:87.9, seat:"L80×80×5" },
  ],
  "T-20": [
    { trench_mm:100, model:"GT100-25", dim:"995×164×25", weight_kg:8.2,  seat:"L40×28×3" },
    { trench_mm:120, model:"GT120-25", dim:"995×214×32", weight_kg:12.9, seat:"L56×36×4" },
    { trench_mm:150, model:"GT150-32", dim:"995×244×32", weight_kg:14.3, seat:"L56×36×4" },
    { trench_mm:180, model:"GT180-38", dim:"995×296×38", weight_kg:19.7, seat:"L70×45×7" },
    { trench_mm:200, model:"GT200-38", dim:"995×316×38", weight_kg:21.1, seat:"L70×45×7" },
    { trench_mm:240, model:"GT240-45", dim:"995×320×45", weight_kg:25.0, seat:"L50×50×5" },
    { trench_mm:300, model:"GT300-50", dim:"995×390×50", weight_kg:32.6, seat:"L56×56×6" },
    { trench_mm:360, model:"GT360-55", dim:"995×400×55", weight_kg:41.6, seat:"L60×60×5" },
    { trench_mm:400, model:"GT400-55", dim:"995×500×55", weight_kg:44.7, seat:"L60×60×5" },
    { trench_mm:450, model:"GT450-65", dim:"995×590×65", weight_kg:59.3, seat:"L70×70×5" },
    { trench_mm:500, model:"GT500-75", dim:"995×640×75", weight_kg:75.9, seat:"L80×80×5" },
  ],
  "T-25": [
    { trench_mm:100, model:"GT100-32", dim:"995×194×32", weight_kg:11.4, seat:"L56×36×4" },
    { trench_mm:120, model:"GT120-32", dim:"995×214×32", weight_kg:12.9, seat:"L56×36×4" },
    { trench_mm:150, model:"GT150-38", dim:"995×266×38", weight_kg:18.1, seat:"L70×45×7" },
    { trench_mm:180, model:"GT180-45", dim:"955×260×45", weight_kg:20.9, seat:"L50×50×5" },
    { trench_mm:200, model:"GT200-45", dim:"955×280×45", weight_kg:22.2, seat:"L50×50×5" },
    { trench_mm:240, model:"GT240-45", dim:"955×320×45", weight_kg:25.0, seat:"L50×50×5" },
    { trench_mm:300, model:"GT300-50", dim:"955×390×50", weight_kg:32.6, seat:"L56×56×6" },
    { trench_mm:360, model:"GT360-55", dim:"955×460×55", weight_kg:41.6, seat:"L60×60×5" },
    { trench_mm:400, model:"GT400-65", dim:"955×520×65", weight_kg:54.7, seat:"L70×70×5" },
    { trench_mm:450, model:"GT450-75", dim:"995×590×75", weight_kg:70.3, seat:"L80×80×5" },
  ],
};

// GU-type: U-channel gutter covers (for concrete U-channel without side openings)
// b×W×h = length × width × depth
export const TABLE_GU_GUTTER_COVERS = {
  "T-2_pedestrian": [
    { trench_mm:100, model:"GU100-20", dim:"995×90×20",  edge:"L30×3", weight_kg:4.4 },
    { trench_mm:120, model:"GU120-20", dim:"995×110×20", edge:"L30×3", weight_kg:5.0 },
    { trench_mm:150, model:"GU150-20", dim:"995×140×20", edge:"L30×3", weight_kg:5.5 },
    { trench_mm:180, model:"GU180-20", dim:"995×170×20", edge:"L30×3", weight_kg:6.0 },
    { trench_mm:200, model:"GU200-25", dim:"995×190×25", edge:"L40×5", weight_kg:12.2 },
    { trench_mm:240, model:"GU240-25", dim:"995×230×25", edge:"L40×5", weight_kg:13.9 },
    { trench_mm:300, model:"GU300-25", dim:"995×290×25", edge:"L40×5", weight_kg:16.0 },
    { trench_mm:360, model:"GU360-25", dim:"995×350×25", edge:"L40×5", weight_kg:18.4 },
    { trench_mm:400, model:"GU400-32", dim:"995×390×32", edge:"L40×5", weight_kg:23.7 },
    { trench_mm:450, model:"GU450-32", dim:"995×443×32", edge:"L40×5", weight_kg:26.3 },
    { trench_mm:500, model:"GU500-45", dim:"995×488×45", edge:"L50×6", weight_kg:41.7 },
    { trench_mm:600, model:"GU600-50", dim:"995×588×50", edge:"L56×6", weight_kg:53.8 },
  ],
  "T-6": [
    { trench_mm:100, model:"GU100-25", dim:"995×90×25",  edge:"L40×5", weight_kg:8.3 },
    { trench_mm:120, model:"GU120-25", dim:"995×110×25", edge:"L40×5", weight_kg:9.3 },
    { trench_mm:150, model:"GU150-25", dim:"995×140×25", edge:"L40×5", weight_kg:10.4 },
    { trench_mm:180, model:"GU180-25", dim:"995×170×25", edge:"L40×5", weight_kg:11.4 },
    { trench_mm:200, model:"GU200-25", dim:"995×190×25", edge:"L40×5", weight_kg:12.2 },
    { trench_mm:240, model:"GU240-32", dim:"995×230×32", edge:"L40×5", weight_kg:16.1 },
    { trench_mm:300, model:"GU300-38", dim:"995×290×38", edge:"L40×5", weight_kg:21.3 },
    { trench_mm:360, model:"GU360-45", dim:"995×350×45", edge:"L50×6", weight_kg:32.5 },
    { trench_mm:400, model:"GU400-45", dim:"995×390×45", edge:"L50×6", weight_kg:35.1 },
    { trench_mm:450, model:"GU450-50", dim:"995×440×50", edge:"L50×6", weight_kg:41.6 },
    { trench_mm:500, model:"GU500-50", dim:"995×490×50", edge:"L50×6", weight_kg:45.2 },
    { trench_mm:600, model:"GU600-55", dim:"995×590×55", edge:"L63×6", weight_kg:59.4 },
  ],
  "T-14": [
    { trench_mm:100, model:"GU100-25", dim:"995×90×25",  edge:"L40×5", weight_kg:8.3 },
    { trench_mm:120, model:"GU120-25", dim:"995×110×25", edge:"L40×5", weight_kg:9.3 },
    { trench_mm:150, model:"GU150-25", dim:"995×140×25", edge:"L40×5", weight_kg:10.4 },
    { trench_mm:180, model:"GU180-25", dim:"995×170×25", edge:"L40×5", weight_kg:11.4 },
    { trench_mm:200, model:"GU200-32", dim:"995×190×32", edge:"L40×5", weight_kg:14.0 },
    { trench_mm:240, model:"GU240-32", dim:"995×230×32", edge:"L40×5", weight_kg:16.1 },
    { trench_mm:300, model:"GU300-45", dim:"995×290×45", edge:"L50×6", weight_kg:28.4 },
    { trench_mm:360, model:"GU360-50", dim:"995×350×45", edge:"L50×6", weight_kg:32.5 },
    { trench_mm:400, model:"GU400-50", dim:"995×390×50", edge:"L50×6", weight_kg:37.8 },
    { trench_mm:450, model:"GU450-55", dim:"995×440×55", edge:"L63×6", weight_kg:47.4 },
  ],
};

// GM-type: manhole / wellhole steel grating covers
// h×a×b = grating height×length×width; frame B×A×H
export const TABLE_GM_WELLHOLE_COVERS = {
  "T-25": [
    { well:"300×400", model:"GM34-55", grating:"305×500×55", grating_kg:14.2, frame:"335×520×60", seat:"L60×5", frame_kg:7.6 },
    { well:"400×400", model:"GM44-55", grating:"395×500×55", grating_kg:18.3, frame:"425×520×60", seat:"L60×5", frame_kg:8.5 },
    { well:"500×400", model:"GM54-55", grating:"485×500×55", grating_kg:22.5, frame:"515×520×60", seat:"L60×5", frame_kg:9.3 },
    { well:"300×500", model:"GM35-65", grating:"305×620×65", grating_kg:22.8, frame:"335×640×70", seat:"L70×5", frame_kg:9.4 },
    { well:"400×500", model:"GM45-65", grating:"395×620×65", grating_kg:29.5, frame:"425×640×70", seat:"L70×5", frame_kg:10.4 },
    { well:"500×500", model:"GM55-65", grating:"485×620×65", grating_kg:36.2, frame:"515×640×70", seat:"L70×5", frame_kg:11.4 },
    { well:"300×600", model:"GM36-75", grating:"305×740×75", grating_kg:28.6, frame:"335×760×80", seat:"L80×5", frame_kg:11.5 },
    { well:"400×600", model:"GM46-75", grating:"395×740×75", grating_kg:36.4, frame:"425×760×80", seat:"L80×5", frame_kg:12.6 },
    { well:"500×600", model:"GM56-75", grating:"485×740×75", grating_kg:44.3, frame:"515×760×80", seat:"L80×5", frame_kg:13.7 },
    { well:"500×700", model:"GM57-75", grating:"485×840×75", grating_kg:49.9, frame:"515×860×80", seat:"L80×5", frame_kg:14.5 },
    { well:"700×700", model:"GM77-75", grating:"695×840×75", grating_kg:70.6, frame:"725×860×80", seat:"L80×5", frame_kg:17.1 },
  ],
  "T-20": [
    { well:"300×400", model:"GM34-50", grating:"305×490×50", grating_kg:12.8, frame:"335×510×56", seat:"L56×6", frame_kg:7.7 },
    { well:"400×400", model:"GM44-50", grating:"395×490×50", grating_kg:16.5, frame:"425×510×56", seat:"L56×6", frame_kg:8.6 },
    { well:"500×400", model:"GM54-50", grating:"485×490×50", grating_kg:20.3, frame:"515×510×56", seat:"L56×6", frame_kg:9.5 },
    { well:"300×500", model:"GM35-55", grating:"305×600×55", grating_kg:16.7, frame:"335×620×60", seat:"L60×5", frame_kg:8.2 },
    { well:"400×500", model:"GM45-55", grating:"395×600×55", grating_kg:21.7, frame:"425×620×60", seat:"L60×5", frame_kg:9.0 },
    { well:"300×600", model:"GM36-55", grating:"485×600×55", grating_kg:26.6, frame:"515×620×60", seat:"L60×5", frame_kg:9.8 },
    { well:"400×600", model:"GM46-65", grating:"305×720×65", grating_kg:26.2, frame:"335×740×70", seat:"L70×5", frame_kg:10.8 },
    { well:"500×600", model:"GM56-65", grating:"485×720×65", grating_kg:41.6, frame:"515×740×70", seat:"L70×5", frame_kg:13.1 },
    { well:"600×600", model:"GM66-65", grating:"605×720×65", grating_kg:51.9, frame:"635×740×70", seat:"L70×5", frame_kg:14.6 },
    { well:"500×700", model:"GM57-75", grating:"485×840×75", grating_kg:49.9, frame:"515×860×80", seat:"L80×5", frame_kg:14.5 },
    { well:"700×700", model:"GM77-75", grating:"695×840×75", grating_kg:68.0, frame:"725×860×80", seat:"L80×5", frame_kg:17.1 },
  ],
  "T-14_T-6": [
    { well:"300×400", model:"GM34-45", grating:"305×480×45", grating_kg:11.3, frame:"335×500×50", seat:"L50×5", frame_kg:6.5 },
    { well:"400×400", model:"GM44-45", grating:"395×480×45", grating_kg:14.7, frame:"425×500×50", seat:"L50×5", frame_kg:7.2 },
    { well:"500×400", model:"GM54-45", grating:"485×480×45", grating_kg:18.0, frame:"515×500×50", seat:"L50×5", frame_kg:7.8 },
    { well:"300×500", model:"GM35-50", grating:"305×590×50", grating_kg:15.1, frame:"335×610×56", seat:"L56×6", frame_kg:8.2 },
    { well:"400×500", model:"GM45-50", grating:"395×590×50", grating_kg:19.5, frame:"425×610×56", seat:"L56×6", frame_kg:9.2 },
    { well:"500×500", model:"GM55-50", grating:"485×590×50", grating_kg:24.0, frame:"515×610×56", seat:"L56×6", frame_kg:10.1 },
    { well:"300×600", model:"GM36-55", grating:"305×700×55", grating_kg:19.3, frame:"335×720×60", seat:"L60×5", frame_kg:8.7 },
    { well:"400×600", model:"GM46-55", grating:"395×700×55", grating_kg:25.0, frame:"425×720×60", seat:"L60×5", frame_kg:9.6 },
    { well:"500×600", model:"GM56-55", grating:"485×700×55", grating_kg:34.6, frame:"515×720×60", seat:"L60×5", frame_kg:10.4 },
    { well:"600×600", model:"GM66-55", grating:"605×700×55", grating_kg:38.2, frame:"635×720×60", seat:"L60×5", frame_kg:11.5 },
    { well:"500×700", model:"GM57-60", grating:"485×810×60", grating_kg:38.1, frame:"515×830×65", seat:"L65×5", frame_kg:12.7 },
    { well:"700×700", model:"GM77-60", grating:"695×810×60", grating_kg:54.6, frame:"725×830×65", seat:"L65×5", frame_kg:15.2 },
  ],
  "T-2_pedestrian": [
    { well:"300×400", model:"GM34-32", grating:"305×454×32", grating_kg:7.9,  frame:"335×472×36", seat:"L36×4", frame_kg:4.4 },
    { well:"400×400", model:"GM44-32", grating:"395×454×32", grating_kg:10.3, frame:"425×472×36", seat:"L36×4", frame_kg:4.8 },
    { well:"500×400", model:"GM54-32", grating:"485×454×32", grating_kg:12.6, frame:"485×472×36", seat:"L36×4", frame_kg:5.0 },
    { well:"300×500", model:"GM35-40", grating:"305×570×40", grating_kg:11.9, frame:"335×590×45", seat:"L45×5", frame_kg:5.9 },
    { well:"400×500", model:"GM45-40", grating:"395×570×40", grating_kg:15.4, frame:"425×590×45", seat:"L45×5", frame_kg:6.5 },
    { well:"500×500", model:"GM55-40", grating:"485×570×40", grating_kg:18.9, frame:"515×590×45", seat:"L45×5", frame_kg:7.2 },
    { well:"300×600", model:"GM36-40", grating:"305×670×40", grating_kg:13.8, frame:"335×690×45", seat:"L45×5", frame_kg:6.3 },
    { well:"400×600", model:"GM46-40", grating:"395×670×40", grating_kg:17.9, frame:"425×690×45", seat:"L45×5", frame_kg:6.9 },
    { well:"500×600", model:"GM56-40", grating:"485×670×40", grating_kg:21.9, frame:"515×690×45", seat:"L45×5", frame_kg:7.5 },
    { well:"600×600", model:"GM66-40", grating:"605×670×40", grating_kg:27.4, frame:"635×690×45", seat:"L45×5", frame_kg:8.3 },
    { well:"500×700", model:"GM57-45", grating:"485×780×45", grating_kg:28.2, frame:"515×800×50", seat:"L50×5", frame_kg:8.6 },
    { well:"700×700", model:"GM77-45", grating:"695×780×45", grating_kg:40.4, frame:"725×800×50", seat:"L50×5", frame_kg:10.2 },
  ],
};

// ============================================================================
// STAIR TREADS (踏步板) — YB/T 4001.3-2020
// Source: 踏步板目录.docx
// ============================================================================

// Structural types
export const STAIR_TREAD_TYPES = {
  TA: {
    name:"TA type – welded",
    desc:"End plates welded directly to stair beam. No mounting holes. Front anti-slip nosing through full width.",
    fastening:"welding",
  },
  TB: {
    name:"TB type – bolted",
    desc:"End plates with mounting holes (rec. 65 mm wide). Bolted to stair beam. Front anti-slip nosing through full width.",
    fastening:"bolt M12",
  },
};

// Naming convention: TB-[grating_model]-[length]×[width]
// Example: TB-325/30/100-800×275 = TB type, G325/30/100 grating, 800 mm long, 275 mm wide
export const STAIR_TREAD_NAMING = {
  pattern:"[Type]-[GratingModel]-[Length]×[Width]",
  example:"TB-325/30/100-800×275",
  length_range_mm:[600, 2000],
  width_range_mm:[125, 305],
  nosing_min_width_mm:25,
  nosing_typical_mm:30,
};

// End plate mounting hole center spacing (Table 1)
export const TB_HOLE_SPACING = [
  { end_plate_length_t_mm:125,           hole_center_A_mm:45 },
  { end_plate_length_t_mm:"155–185",     hole_center_A_mm:75 },
  { end_plate_length_t_mm:"215–245",     hole_center_A_mm:100 },
  { end_plate_length_t_mm:"275–305",     hole_center_A_mm:150 },
  { end_plate_length_t_mm:">305",        hole_center_A_mm:200 },
];

// Load requirements (YB/T 4001.3-2020 §5)
export const STAIR_TREAD_LOAD_REQUIREMENTS = {
  concentrated_test_kN:1.5,
  ultimate_test_kN:4.4,
  max_deflection:"min(L/300, 6mm)",
  permanent_deform_limit:"L/1000 after 4.4kN removed",
  udl_along_length_kN_m:2.2,
  load_area_mm:"100×100",
  // Load application position by tread length
  load_positions: [
    { length_range:"600–1199mm", position:"centerline, one edge at nosing outer edge" },
    { length_range:"1200–1599mm", position:"two zones 600mm apart, symmetric, one edge at nosing" },
    { length_range:"1600–2000mm", position:"two zones 600mm apart, symmetric on centerline" },
  ],
};

// NAAMM MBG 531-24 stair tread load criterion
export const NAAMM_TREAD_LOAD = {
  concentrated_lb:300,
  position:"front 5 inches at midspan",
  max_deflection_limit:"L/240",
  treads_over_5ft6in:"load at 1/3 points",
  // Max span by bar size (carbon steel, ASTM A1011 CS Type B)
  max_spans: [
    { bars:"1-1/4\"×3/16\", 1-3/16\" centers", material:"A1011 CS Type B", max_span_in:58.5 },
    { bars:"1\"×3/16\", 1-3/16\" centers",      material:"A1011 CS Type B", max_span_in:41.8 },
    { bars:"1-1/4\"×3/16\", 1-3/16\" centers", material:"6063-T6 Alum",    max_span_in:42.5 },
    { bars:"1\"×3/16\", 1-3/16\" centers",      material:"6063-T6 Alum",    max_span_in:31.3 },
  ],
};

// Carrier plate dimensions (NAAMM MBG 531-24)
export const NAAMM_TREAD_CARRIER = [
  { grating_depth:"3/4\" to 1-1/4\"", dim_B_in:"1-3/4\"", dim_C_in:"2-1/2\"" },
  { grating_depth:"1-1/2\" to 1-3/4\"", dim_B_in:"2-1/4\"", dim_C_in:"3\"" },
];

// McNichols stair tread max spans
export const MCNICHOLS_TREAD_SPECS = [
  { series:"GW",  material:"Steel",   bar_sizes:["1\"","1-1/4\"","1-1/2\""], thickness:"1/8\",3/16\"", widths_in:["8-9/16\"","9-3/4\"","10-15/16\"","12-1/8\""] },
  { series:"GHB", material:"Steel",   bar_sizes:["1\"","1-1/4\"","1-1/2\""], thickness:"1/4\"",         widths_in:["8-9/16\"","9-3/4\"","10-15/16\"","12-1/8\""] },
  { series:"GAL", material:"Alum",    bar_sizes:["1\"","1-1/4\"","1-1/2\"","1-3/4\""], thickness:"3/16\"", widths_in:["8-9/16\"","9-3/4\"","11\"","12-3/16\""] },
  { series:"GIA", material:"Alum",    bar_sizes:["1\"","1-1/4\"","1-1/2\""],            thickness:"1/4\" I-Bar", note:"Up to 42\" for 1-1/2\" ht TB-940 only" },
  { series:"FRP", material:"FRP",     model:"MS-T-C",    width_in:"9\",10\"",    length_in:144, span_max_in:null, note:"MS-T-C stair tread cover" },
  { series:"FRP", material:"FRP",     model:"MS-T-R-150", width_in:"22-1/2\"",  length_in:120, span_1_8_in:31, span_1_4_in:38, note:"Rectangular 1-1/2×6 grid" },
  { series:"FRP", material:"FRP",     model:"MS-T-I-6015", width_in:"11\",12-1/2\"", length_in:144, span_1_8_in:40, span_1_4_in:52, note:"Pultruded I-bar" },
];

// ============================================================================
// ACCESSORIES (配件) — Multiple sources
// ============================================================================

export const ACCESSORIES = {
  // Fastening clips (IKG Catalog 2020 + YB/T 1684823489649541.docx)
  fasteners: [
    {
      name:"Saddle Clip",
      name_cn:"鞍形夹",
      materials:["aluminum","stainless steel","galvanized steel"],
      desc:"Bent-clip type for removable panels. Cross bars may need field trimming.",
      standard:null,
    },
    {
      name:"G-Clip / Bar Grating Clamp",
      name_cn:"G型夹",
      materials:["aluminum","stainless steel","galvanized steel"],
      desc:"Used with bar grating and embedded frames. Cross bars may need field trimming.",
      standard:null,
    },
    {
      name:"Plate Fastener (Lug / Anchor Block)",
      name_cn:"板夹/锚块",
      materials:["aluminum","steel"],
      thickness_in:["1/4\"","3/16\""],
      desc:"Shop-welded by manufacturer. Recessed for trip-free surface. Suitable for permanent or removable panels.",
      standard:null,
    },
    {
      name:"Z-Clip",
      name_cn:"Z型夹",
      materials:["stainless steel"],
      sizes:["1\" (for 1\" and 1-1/4\" grating)","1-1/2\" (for 1-1/2\" and 1-3/4\" grating)","2\" (for 2\", 2-1/4\" and 2-1/2\" grating)"],
      bolt:"1/4\" bolt or TEK screw",
      desc:"Especially for riveted grating. Pre-punched hole.",
    },
    {
      name:"Hilti Disk",
      name_cn:"Hilti盘",
      desc:"For oil & gas, offshore, shipbuilding, industrial. Wide range of fastening applications.",
    },
    {
      name:"Countersunk Land",
      name_cn:"沉头座",
      desc:"For close-mesh aluminum grating (7/16\" bar centers). Drilled by manufacturer for 1/4\" TEK screw.",
    },
    {
      name:"Installation Clip (安装夹)",
      name_cn:"安装夹",
      standard:"YB/T 4001.1 §8.4.5",
      bolt_min_dia_mm:8,
      min_qty_per_panel:4,
      finish:"hot-dip galvanized (carbon steel) or stainless steel",
      note:"Removable grating must use clips or powder-actuated fasteners.",
    },
    {
      name:"Powder-Actuated Fastener (射钉紧固件)",
      name_cn:"射钉紧固件",
      standard:"YB/T 4001.1 §8.4.5",
      min_penetration_mm:10,
      env_note:"Use stainless steel in corrosive environments.",
    },
  ],

  // Welding requirements (YB/T standard + NAAMM)
  welding: {
    tack_weld_per_YBT:"Four-corner welding; fillet weld ≥20 mm long, ≥3 mm height",
    tack_weld_per_NAAMM:"3/16\" fillet × 3/4\" long, 3rd bar from each panel edge; plus center weld at intermediate supports",
    end_plate_to_bar:"Full fillet weld both sides, ≥3 mm",
    banding_to_bar:"Intermittent weld, spacing ≤150 mm",
  },

  // Banding / edging options
  banding: [
    { type:"Flat bar edge",   standard:"YB/T", note:"Full-perimeter or selected edges" },
    { type:"Angle steel edge", standard:"YB/T", note:"Used as seat angle for gutter covers" },
    { type:"C-channel edge",   standard:"YB/T" },
    { type:"Cross-bar edge",   standard:"YB/T", note:"Cross bar material used as banding" },
    { type:"Shallow banding bar", standard:"NAAMM", note:"1/4\"–1/2\" less than grating depth to permit drainage" },
  ],

  // Anti-slip nosing types (NAAMM MBG 531-24)
  nosing_types: [
    { type:"Abrasive nosing",     standard:"NAAMM", desc:"Mineral grit strip bonded to nosing plate" },
    { type:"Carrier plate nosing", standard:"NAAMM", desc:"1/8\" min carrier plate welded to front bars and nosing" },
    { type:"Carrier angle nosing", standard:"NAAMM", desc:"Angle iron carrier welded to front bars" },
    { type:"Tapered nose",         standard:"YB/T",  desc:"Anti-slip front edge of tread, width ≥25 mm, typical 30 mm" },
  ],

  // Webforge accessories
  webforge_accessories: [
    { name:"WebGrip Anti-Slip Stair Nosing", material:"Galvabond/SS/Aluminium", certified:"AS/NZ" },
    { name:"WebGrip Metal Plating",          material:"Galvabond/SS/Aluminium" },
    { name:"WebGrip Metal Strips",           material:"Galvabond/SS/Aluminium" },
    { name:"Webmesh",                        desc:"Grating + light gauge expanded mesh welded underside, prevents tool drop-through. Meets AS/NZS1657 Cl.4.5 with mesh 1216F(steel)/1216AF(alum)." },
    { name:"Panel joining clips",            note:"Required when L/200 or 10mm deflection used (Safegrid/Lionweld Kennedy)" },
  ],

  // Support bearing requirements (NAAMM)
  bearing_requirements: [
    { depth_in:"up to 2-1/4\"",  min_bearing_in:1  },
    { depth_in:"2-1/2\" and over", min_bearing_in:2 },
  ],
  clearance_note:"1/4\" (6mm) nominal clearance between ends of cross bars and rectangular grating, or rivet heads",
};

// ============================================================================
// FRP GRATING — McNichols 2018 Catalog
// Source: McNICHOLS-2018-Gratings-Catalog_Web.docx
//
// Load tables: U = deflection (in) at applied uniform load (lbs/ft²)
//              C = deflection (in) at concentrated load (lbs/ft of width)
//              Safe Load = maximum safe load (lbs/ft² for U, lbs/ft for C)
// Safety factor: 5:1 (molded), 2:1 (pultruded)
// Spans in inches: 12, 18, 24, 30, 36, 42, 48, 54, 60, 66
// Applied loads in lbs/ft² (U) or lbs (C)
// ============================================================================

export const FRP_SPANS_IN = [12, 18, 24, 30, 36, 42, 48, 54, 60, 66];
export const FRP_MOLDED_LOADS_PSF = [50, 100, 150, 200, 250, 300, 400, 500];
export const FRP_PULTRUDED_LOADS_PSF = [100, 200, 300, 400, 500, 750, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];

// Resin types
export const FRP_RESINS = {
  SPF: "Polyester – Fire Retardant, Class 1 (ASTM E-84 ≤25)",
  SVF: "Vinyl Ester – Fire Retardant, Class 1",
  SGF: "Orthophthalic Polyester – Architectural Grade, Fire Retardant, Class 1",
  SFF: "Polyester – Food Grade, Fire Retardant, Class 2 (≤30)",
  SPH: "Phenolic – Fire Retardant, Class 1, Flame 10, Smoke 10",
  NFR: "Non-Fire Retardant",
};

// ---- MOLDED FRP (Safe Load 5:1) ----
// U = deflection at that load (in); SAFE_LOAD = max safe load (lbs/ft²)
// Loads: 50/100/150/200/250/300/400/500 psf
// null = exceeds limit / not listed

export const FRP_MS_S_100 = { // Square 1-1/2"×1-1/2", H=1", 70% OA, 2.6 lb/ft²
  series:"MS-S-100", grid:"1-1/2\"×1-1/2\"", height_in:1, weight_psf:2.6, open_area:"70%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,0.013,0.017,0.021,0.025,0.034,0.042], C:[null,0.014,0.020,0.027,0.034,0.041,0.054,0.068], safe_U:1360, safe_C:680 },
    { span_in:18, U:[0.021,0.041,0.062,0.082,0.103,0.123,0.164,0.205], C:[0.022,0.044,0.066,0.088,0.110,0.131,0.175,0.219], safe_U:666, safe_C:500 },
    { span_in:24, U:[0.064,0.128,0.192,0.256,0.320,0.384,0.512,0.640], C:[0.051,0.102,0.154,0.205,0.256,0.307,0.409,0.512], safe_U:380, safe_C:380 },
    { span_in:30, U:[0.155,0.309,0.464,0.619,null,null,null,null],     C:[0.099,0.198,0.297,0.396,0.495,0.594,null,null],    safe_U:240, safe_C:300 },
    { span_in:36, U:[0.318,0.635,null,null,null,null,null,null],         C:[0.169,0.339,0.508,0.677,null,null,null,null],      safe_U:160, safe_C:240 },
  ],
};

export const FRP_MS_S_150 = { // Square 1-1/2"×1-1/2", H=1-1/2", 70% OA, 3.8 lb/ft²
  series:"MS-S-150", grid:"1-1/2\"×1-1/2\"", height_in:1.5, weight_psf:3.8, open_area:"70%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,null,null,null,0.011,0.014,0.018], C:[null,null,null,0.011,0.014,0.017,0.023,0.028], safe_U:3120, safe_C:1560 },
    { span_in:18, U:[null,null,0.021,0.028,0.036,0.043,0.057,0.071], C:[null,0.015,0.023,0.030,0.038,0.046,0.061,0.076], safe_U:1386, safe_C:1040 },
    { span_in:24, U:[0.021,0.042,0.063,0.084,0.104,0.125,0.167,0.209], C:[0.017,0.033,0.050,0.067,0.084,0.100,0.134,0.167], safe_U:780, safe_C:780 },
    { span_in:30, U:[0.047,0.094,0.141,0.188,0.235,0.283,0.377,0.471], C:[0.030,0.060,0.090,0.121,0.151,0.181,0.241,0.301], safe_U:496, safe_C:620 },
    { span_in:36, U:[0.096,0.192,0.288,0.384,0.480,0.576,null,null],   C:[0.051,0.102,0.154,0.205,0.256,0.307,0.410,0.512], safe_U:347, safe_C:520 },
    { span_in:42, U:[0.175,0.350,0.525,null,null,null,null,null],       C:[0.080,0.160,0.240,0.320,0.400,0.480,0.641,0.801], safe_U:251, safe_C:440 },
    { span_in:48, U:[0.287,0.573,null,null,null,null,null,null],         C:[0.115,0.229,0.344,0.459,0.573,0.688,null,null],   safe_U:170, safe_C:340 },
  ],
};

export const FRP_MS_S_200 = { // Square 2"×2", H=2", 72% OA, 4.0 lb/ft²
  series:"MS-S-200", grid:"2\"×2\"", height_in:2, weight_psf:4.0, open_area:"72%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,null,null,null,null,null,0.010], C:[null,null,null,null,null,0.010,0.013,0.016], safe_U:4000, safe_C:2000 },
    { span_in:18, U:[null,null,0.012,0.016,0.020,0.024,0.032,0.040], C:[null,null,0.013,0.017,0.021,0.026,0.034,0.043], safe_U:1813, safe_C:1360 },
    { span_in:24, U:[0.010,0.021,0.031,0.042,0.052,0.063,0.083,0.104], C:[null,0.017,0.025,0.033,0.042,0.050,0.067,0.083], safe_U:960, safe_C:960 },
    { span_in:30, U:[0.023,0.046,0.069,0.092,0.114,0.137,0.183,0.229], C:[0.015,0.029,0.044,0.059,0.073,0.088,0.117,0.146], safe_U:640, safe_C:800 },
    { span_in:36, U:[0.044,0.089,0.133,0.177,0.222,0.266,0.355,0.444], C:[0.024,0.047,0.071,0.095,0.118,0.142,0.189,0.237], safe_U:453, safe_C:680 },
    { span_in:42, U:[0.082,0.164,0.245,0.327,0.409,0.491,0.654,null],  C:[0.037,0.075,0.112,0.150,0.187,0.224,0.299,0.374], safe_U:331, safe_C:580 },
    { span_in:48, U:[0.135,0.270,0.405,0.541,null,null,null,null],      C:[0.054,0.108,0.162,0.216,0.270,0.324,0.432,0.541], safe_U:260, safe_C:520 },
    { span_in:54, U:[0.210,0.420,0.630,null,null,null,null,null],        C:[0.075,0.149,0.224,0.298,0.373,0.448,0.597,null],  safe_U:204, safe_C:460 },
  ],
};

export const FRP_MS_M_150 = { // Combo: top 3/4"×3/4", bottom 1-1/2"×1-1/2", H=1-1/2", 40% OA, 4.4 lb/ft²
  series:"MS-M-150", grid_top:"3/4\"×3/4\"", grid_bottom:"1-1/2\"×1-1/2\"", height_in:1.5, weight_psf:4.4, open_area:"40%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,0.011,0.014,0.017,0.021,0.028,0.035], C:[null,0.011,0.017,0.022,0.028,0.034,0.045,0.056], safe_U:3860, safe_C:1930 },
    { span_in:18, U:[0.013,0.026,0.039,0.052,0.065,0.078,0.104,0.130], C:[0.014,0.028,0.042,0.056,0.070,0.084,0.112,0.139], safe_U:1776, safe_C:1332 },
    { span_in:24, U:[0.025,0.050,0.075,0.100,0.126,0.151,0.201,0.251], C:[0.020,0.040,0.060,0.080,0.101,0.121,0.161,0.201], safe_U:1052, safe_C:1052 },
    { span_in:30, U:[0.055,0.110,0.165,0.219,0.274,0.329,0.439,0.548], C:[0.035,0.070,0.105,0.140,0.176,0.211,0.281,0.351], safe_U:632, safe_C:790 },
    { span_in:36, U:[0.087,0.173,0.260,0.346,0.433,0.520,0.692,null],  C:[0.046,0.092,0.139,0.185,0.231,0.277,0.370,0.462], safe_U:456, safe_C:684 },
    { span_in:42, U:[0.150,0.300,0.450,0.600,null,null,null,null],      C:[0.069,0.138,0.207,0.276,null,null,null,null],      safe_U:332, safe_C:582 },
    { span_in:48, U:[0.245,0.490,0.735,null,null,null,null,null],        C:[0.098,0.196,0.294,null,null,null,null,null],       safe_U:215, safe_C:430 },
  ],
};

export const FRP_MS_R_100 = { // Rectangular 1"×4", H=1", 69% OA, 2.80 lb/ft²
  series:"MS-R-100", grid:"1\"×4\"", height_in:1, weight_psf:2.80, open_area:"69%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,null,0.011,0.014,0.017,0.022,0.028], C:[null,null,0.013,0.018,0.022,0.027,0.035,0.044], safe_U:1960, safe_C:980 },
    { span_in:18, U:[0.012,0.025,0.037,0.049,0.062,0.074,0.099,0.123], C:[0.013,0.026,0.039,0.053,0.066,0.079,0.105,0.131], safe_U:960, safe_C:720 },
    { span_in:24, U:[0.037,0.074,0.112,0.149,0.186,0.223,0.298,0.372], C:[0.030,0.060,0.089,0.119,0.149,0.179,0.238,0.298], safe_U:560, safe_C:560 },
    { span_in:30, U:[0.088,0.176,0.264,0.352,0.440,0.528,null,null],   C:[0.056,0.113,0.169,0.225,0.282,0.338,0.451,0.563], safe_U:336, safe_C:420 },
    { span_in:36, U:[0.176,0.353,0.529,null,null,null,null,null],       C:[0.094,0.188,0.282,0.376,0.470,0.564,null,null],   safe_U:240, safe_C:360 },
    { span_in:42, U:[0.316,0.632,null,null,null,null,null,null],         C:[0.144,0.289,0.433,0.577,null,null,null,null],     safe_U:183, safe_C:320 },
  ],
};

export const FRP_MS_R_150 = { // Rectangular 1-1/2"×6", H=1-1/2", 67% OA, 3.75 lb/ft²
  series:"MS-R-150", grid:"1-1/2\"×6\"", height_in:1.5, weight_psf:3.75, open_area:"67%",
  safety:5,
  spans: [
    { span_in:12, U:[null,null,null,null,0.011,0.014,0.018,0.023], C:[null,null,0.011,0.015,0.018,0.022,0.029,0.037], safe_U:4272, safe_C:2136 },
    { span_in:18, U:[null,0.018,0.027,0.035,0.044,0.053,0.071,0.089], C:[0.010,0.019,0.028,0.038,0.047,0.057,0.076,0.095], safe_U:1712, safe_C:1284 },
    { span_in:24, U:[0.019,0.038,0.056,0.075,0.094,0.112,0.150,0.188], C:[0.015,0.030,0.045,0.060,0.075,0.090,0.120,0.150], safe_U:956, safe_C:956 },
    { span_in:30, U:[0.039,0.078,0.117,0.156,0.195,0.233,0.311,0.389], C:[0.025,0.050,0.075,0.100,0.125,0.150,0.200,0.250], safe_U:587, safe_C:734 },
    { span_in:36, U:[0.071,0.143,0.214,0.285,0.357,0.428,null,null],   C:[0.038,0.076,0.114,0.152,0.190,0.228,0.304,0.381], safe_U:385, safe_C:578 },
    { span_in:42, U:[0.126,0.252,0.378,0.504,0.630,null,null,null],     C:[0.058,0.115,0.173,0.230,0.288,0.346,0.461,null],  safe_U:370, safe_C:472 },
    { span_in:48, U:[0.207,0.414,0.621,null,null,null,null,null],        C:[0.083,0.160,0.248,0.331,0.414,0.497,null,null],  safe_U:184, safe_C:368 },
  ],
};

// ---- PULTRUDED I-BAR FRP (Safe Load 2:1) ----
// Loads: 100/200/300/400/500/750/1000/2000/3000/4000/5000 psf

export const FRP_MS_I_6010 = { // I-Bar 1"×0.600", 6" xbar, 60% OA, 2.4 lb/ft²
  series:"MS-I-6010", bar:"1\"×0.600\" I-Bar", xbar_spacing_in:6, weight_psf:2.4, open_area:"60%",
  safety:2,
  spans: [
    { span_in:12, U:[0.002,0.004,0.005,0.007,0.009,0.014,0.018,0.036,0.054,0.073,0.091], safe_U:10401, C:[0.003,0.006,0.009,0.012,0.015,0.022,0.029,0.058,0.087,0.116,0.145], safe_C:5200 },
    { span_in:18, U:[0.008,0.017,0.025,0.033,0.042,0.063,0.084,0.167,0.251,0.335,0.418], safe_U:4954, C:[0.009,0.018,0.027,0.036,0.045,0.067,0.089,0.179,0.268,0.357,0.446], safe_C:3716 },
    { span_in:24, U:[0.025,0.050,0.075,0.100,0.124,0.187,0.249,0.498,null,null,null],    safe_U:2900, C:[0.020,0.040,0.060,0.080,0.100,0.149,0.199,0.398,0.597,null,null],    safe_C:2900 },
    { span_in:30, U:[0.058,0.116,0.174,0.231,0.289,0.434,0.579,null,null,null,null],      safe_U:1856, C:[0.037,0.074,0.111,0.148,0.185,0.278,0.370,null,null,null,null],      safe_C:2320 },
    { span_in:36, U:[0.115,0.230,0.345,0.460,0.575,null,null,null,null,null,null],         safe_U:1289, C:[0.061,0.123,0.184,0.245,0.307,0.460,0.614,null,null,null,null],      safe_C:1933 },
    { span_in:42, U:[0.211,0.422,0.633,null,null,null,null,null,null,null,null],            safe_U:943,  C:[0.096,0.193,0.289,0.386,0.482,null,null,null,null,null,null],         safe_C:1649 },
    { span_in:48, U:[0.353,0.705,null,null,null,null,null,null,null,null,null],             safe_U:719,  C:[0.141,0.282,0.423,0.564,null,null,null,null,null,null,null],          safe_C:1437 },
    { span_in:54, U:[0.563,null,null,null,null,null,null,null,null,null,null],              safe_U:566,  C:[0.200,0.400,0.600,null,null,null,null,null,null,null,null],           safe_C:1274 },
  ],
};

export const FRP_MS_I_6015 = { // I-Bar 1-1/2"×0.600", 6" xbar, 60% OA, 3.0 lb/ft²
  series:"MS-I-6015", bar:"1-1/2\"×0.600\" I-Bar", xbar_spacing_in:6, weight_psf:3.0, open_area:"60%",
  safety:2,
  // Loads extend to 7000 psf
  spans: [
    { span_in:12, safe_U:17601, safe_C:8800,  U:[0.001,0.001,0.002,0.003,0.003,0.005,0.006,0.013,0.019,0.026,0.032], C:[0.001,0.002,0.003,0.004,0.005,0.008,0.010,0.020,0.031,0.041,0.051] },
    { span_in:18, safe_U:7823,  safe_C:5867,  U:[0.003,0.006,0.009,0.012,0.015,0.023,0.030,0.061,0.091,0.121,0.152], C:[0.003,0.006,0.010,0.013,0.016,0.024,0.032,0.065,0.097,0.129,0.162] },
    { span_in:24, safe_U:4400,  safe_C:4400,  U:[0.009,0.018,0.027,0.037,0.046,0.069,0.091,0.183,0.274,0.366,0.457], C:[0.007,0.015,0.022,0.029,0.037,0.055,0.073,0.146,0.220,0.293,0.366] },
    { span_in:30, safe_U:2773,  safe_C:3467,  U:[0.022,0.043,0.065,0.086,0.108,0.161,0.215,0.430,0.646,null,null],   C:[0.014,0.028,0.041,0.055,0.069,0.103,0.138,0.276,0.413,0.551,null] },
    { span_in:36, safe_U:1896,  safe_C:2845,  U:[0.044,0.087,0.131,0.175,0.218,0.327,0.436,null,null,null,null],      C:[0.023,0.047,0.070,0.093,0.116,0.175,0.233,0.466,null,null,null] },
    { span_in:42, safe_U:1361,  safe_C:2381,  U:[0.079,0.159,0.238,0.317,0.396,0.595,null,null,null,null,null],        C:[0.036,0.072,0.109,0.145,0.181,0.272,0.362,null,null,null,null] },
    { span_in:48, safe_U:1017,  safe_C:2033,  U:[0.133,0.266,0.400,0.533,0.666,null,null,null,null,null,null],          C:[0.053,0.107,0.160,0.213,0.266,0.400,0.533,null,null,null,null] },
    { span_in:54, safe_U:777,   safe_C:1748,  U:[0.211,0.422,0.633,null,null,null,null,null,null,null,null],            C:[0.075,0.150,0.225,0.300,0.375,0.563,null,null,null,null,null] },
  ],
};

export const FRP_MS_I_6515 = { // I-Bar 1-1/2"×0.600", 8" xbar (DURADEK), 65% OA, 2.7 lb/ft²
  series:"MS-I-6515", bar:"1-1/2\"×0.600\" I-Bar", xbar_spacing_in:8, weight_psf:2.7, open_area:"65%",
  safety:2,
  spans: [
    { span_in:12, safe_U:15439, safe_C:7719,  U:[0.001,0.001,0.002,0.003,0.004,0.005,0.007,0.015,0.022,0.029,0.038], C:[0.001,0.002,0.004,0.005,0.006,0.009,0.012,0.023,0.035,0.047,0.058] },
    { span_in:18, safe_U:6862,  safe_C:5146,  U:[0.003,0.007,0.010,0.014,0.017,0.026,0.035,0.069,0.091,0.104,0.138], C:[0.004,0.007,0.011,0.015,0.018,0.028,0.037,0.074,0.111,0.147,0.184] },
    { span_in:24, safe_U:3860,  safe_C:3860,  U:[0.010,0.021,0.031,0.042,0.052,0.078,0.104,0.209,0.313,0.417,0.522], C:[0.008,0.017,0.025,0.033,0.042,0.063,0.083,0.167,0.250,0.334,0.417] },
    { span_in:30, safe_U:2433,  safe_C:3041,  U:[0.025,0.049,0.074,0.098,0.123,0.184,0.245,0.491,null,null,null],    C:[0.016,0.031,0.047,0.063,0.079,0.118,0.157,0.314,0.471,0.628,null] },
    { span_in:36, safe_U:1663,  safe_C:2495,  U:[0.050,0.100,0.149,0.199,0.249,0.373,0.498,null,null,null,null],      C:[0.027,0.053,0.080,0.106,0.133,0.199,0.265,null,null,null,null] },
    { span_in:42, safe_U:1194,  safe_C:2088,  U:[0.090,0.181,0.271,0.361,0.452,0.678,null,null,null,null,null],        C:[0.041,0.083,0.124,0.165,0.207,0.310,0.413,null,null,null,null] },
    { span_in:48, safe_U:892,   safe_C:1784,  U:[0.152,0.304,0.456,0.607,null,null,null,null,null,null,null],          C:[0.061,0.121,0.182,0.243,0.304,0.456,0.607,null,null,null,null] },
    { span_in:54, safe_U:681,   safe_C:1533,  U:[0.241,0.481,null,null,null,null,null,null,null,null,null],            C:[0.086,0.171,0.257,0.342,0.428,0.642,null,null,null,null,null] },
    { span_in:60, safe_U:533,   safe_C:1333,  U:[0.364,null,null,null,null,null,null,null,null,null,null],             C:[0.117,0.233,0.350,0.467,0.583,null,null,null,null,null,null] },
    { span_in:66, safe_U:425,   safe_C:1170,  U:[0.531,null,null,null,null,null,null,null,null,null,null],             C:[0.155,0.309,0.464,0.618,null,null,null,null,null,null,null] },
  ],
};

export const FRP_MS_I_4010 = { // I-Bar 1"×0.600", 40% OA, 3.4 lb/ft²
  series:"MS-I-4010", bar:"1\"×0.600\" I-Bar", xbar_spacing_in:6, weight_psf:3.4, open_area:"40%",
  safety:2,
  spans: [
    { span_in:12, safe_U:15600, safe_C:7800, U:[0.001,0.002,0.004,0.005,0.006,0.009,0.012,0.024,0.030,0.036,0.048], C:[0.002,0.004,0.006,0.008,0.010,0.015,0.019,0.039,0.048,0.058,0.077] },
    { span_in:18, safe_U:7431,  safe_C:5573, U:[0.006,0.011,0.017,0.022,0.028,0.042,0.056,0.112,0.139,0.167,0.223], C:[0.006,0.012,0.018,0.024,0.030,0.045,0.060,0.119,0.149,0.179,0.238] },
    { span_in:24, safe_U:4350,  safe_C:4350, U:[0.017,0.033,0.050,0.066,0.083,0.124,0.166,0.332,0.415,0.498,0.664], C:[0.013,0.027,0.040,0.053,0.066,0.100,0.133,0.265,0.332,0.398,0.531] },
    { span_in:30, safe_U:2784,  safe_C:3480, U:[0.039,0.077,0.116,0.154,0.193,0.289,0.386,null,null,null,null],      C:[0.025,0.049,0.074,0.099,0.123,0.185,0.247,0.494,0.617,null,null] },
    { span_in:36, safe_U:1933,  safe_C:2900, U:[0.077,0.153,0.230,0.307,0.383,0.575,null,null,null,null,null],        C:[0.041,0.082,0.123,0.164,0.205,0.307,0.409,null,null,null,null] },
    { span_in:42, safe_U:1414,  safe_C:2474, U:[0.141,0.281,0.422,0.563,0.703,null,null,null,null,null,null],          C:[0.064,0.129,0.193,0.257,0.321,0.482,0.643,null,null,null,null] },
    { span_in:48, safe_U:1078,  safe_C:2155, U:[0.235,0.470,0.705,null,null,null,null,null,null,null,null],            C:[0.094,0.188,0.282,0.376,0.470,null,null,null,null,null,null] },
  ],
};

export const FRP_MS_I_4015 = { // I-Bar 1-1/2"×0.600", 40% OA, 4.2 lb/ft²
  series:"MS-I-4015", bar:"1-1/2\"×0.600\" I-Bar", xbar_spacing_in:6, weight_psf:4.2, open_area:"40%",
  safety:2,
  // Loads extend to 9000 psf
  spans: [
    { span_in:12, safe_U:26400, safe_C:13200 },
    { span_in:18, safe_U:11734, safe_C:8800 },
    { span_in:24, safe_U:6600,  safe_C:6600 },
    { span_in:30, safe_U:4160,  safe_C:5200 },
    { span_in:36, safe_U:2844,  safe_C:4267 },
    { span_in:42, safe_U:2041,  safe_C:3571 },
    { span_in:48, safe_U:1525,  safe_C:3050 },
  ],
};

export const FRP_MS_T_5020 = { // T-Bar 2"×1", 50% OA, 3.0 lb/ft²
  series:"MS-T-5020", bar:"2\"×1\" T-Bar", xbar_spacing_in:6, weight_psf:3.0, open_area:"50%",
  safety:2,
  spans: [
    { span_in:12, safe_U:11333, safe_C:5666 },
    { span_in:18, safe_U:7536,  safe_C:5666 },
    { span_in:24, safe_U:5666,  safe_C:5666 },
    { span_in:30, safe_U:3626,  safe_C:4534 },
    { span_in:36, safe_U:2519,  safe_C:3778 },
    { span_in:42, safe_U:1850,  safe_C:3238 },
    { span_in:48, safe_U:1417,  safe_C:2834 },
    { span_in:54, safe_U:1120,  safe_C:2519 },
    { span_in:60, safe_U:907,   safe_C:2267 },
    { span_in:66, safe_U:749,   safe_C:2060 },
  ],
};

// FRP product index
export const FRP_PRODUCT_INDEX = {
  molded: [
    { series:"MS-S-100", type:"Square",      grid:"1-1/2\"×1-1/2\"", H_in:1,   wt_psf:2.6, OA:"70%", safety:5, export:"FRP_MS_S_100" },
    { series:"MS-S-150", type:"Square",      grid:"1-1/2\"×1-1/2\"", H_in:1.5, wt_psf:3.8, OA:"70%", safety:5, export:"FRP_MS_S_150" },
    { series:"MS-S-200", type:"Square",      grid:"2\"×2\"",          H_in:2,   wt_psf:4.0, OA:"72%", safety:5, export:"FRP_MS_S_200" },
    { series:"MS-M-150", type:"Square combo",grid:"3/4\" top / 1-1/2\" bottom", H_in:1.5, wt_psf:4.4, OA:"44%", safety:5, export:"FRP_MS_M_150" },
    { series:"MS-R-100", type:"Rectangular", grid:"1\"×4\"",           H_in:1,   wt_psf:2.80,OA:"69%", safety:5, export:"FRP_MS_R_100" },
    { series:"MS-R-150", type:"Rectangular", grid:"1-1/2\"×6\"",       H_in:1.5, wt_psf:3.75,OA:"67%", safety:5, export:"FRP_MS_R_150" },
  ],
  pultruded_ibar: [
    { series:"MS-I-6010", bar:"1\"×0.600\"",   xbar_in:6,  wt_psf:2.4, OA:"60%", safety:2, export:"FRP_MS_I_6010" },
    { series:"MS-I-6015", bar:"1-1/2\"×0.600\"",xbar_in:6, wt_psf:3.0, OA:"60%", safety:2, export:"FRP_MS_I_6015" },
    { series:"MS-I-6515", bar:"1-1/2\"×0.600\"",xbar_in:8, wt_psf:2.7, OA:"65%", safety:2, export:"FRP_MS_I_6515", note:"DURADEK" },
    { series:"MS-I-4010", bar:"1\"×0.600\"",   xbar_in:6,  wt_psf:3.4, OA:"40%", safety:2, export:"FRP_MS_I_4010", note:"VGB approved" },
    { series:"MS-I-4015", bar:"1-1/2\"×0.600\"",xbar_in:6, wt_psf:4.2, OA:"40%", safety:2, export:"FRP_MS_I_4015", note:"VGB approved" },
  ],
  pultruded_tbar: [
    { series:"MS-T-5020", bar:"2\"×1\"",        xbar_in:6,  wt_psf:3.0, OA:"50%", safety:2, export:"FRP_MS_T_5020" },
  ],
};

// ============================================================================
// SAFEGRID / LIONWELD KENNEDY – Ball-Proof Grating Load Tables
// Source: SAFEGRID-BALL-PROOF-FLYER.docx
// Standard: BS4592-0:2006+A1:2012, BS EN ISO 14122-2:2016, BS5950-1:2000
// Material: BS EN 10025 Grade S275JR
// Allowable stress (implied): per BS5950-1:2000
//
// Three products:
//   LK20BP – 20mm ball-proof (mesh 21/100 @ 3mm, 23/100 @ 5mm)
//   LK35BP – 35mm ball-proof (mesh 37/125 @ 3mm, 38/125 @ 5mm)
//   LK_UTL – Utility grating (mesh 47/125 @ 3mm and 5mm)
//
// Table columns:
//   Load: 5 or 7.5 kN/m²
//   Max Clear Span @ 4mm deflection (mm)
//   Deflection at that span (mm)
//   Max Clear Span @ L/200 or 10mm deflection (mm)
//   Deflection at that span (mm)
//   Self Colour Weight (kg/m²)
//   Binding Bar Weight (kg per 2×1m panel)
// ============================================================================

export const SAFEGRID_LOAD_TABLES = {
  LK20BP_3mm: { // Mesh 21/100, binding bar 3mm
    product:"LK20BP", bar_t_mm:3, mesh:"21/100",
    std:"BS4592-0:2006+A1:2012",
    note:"20mm ball-proof. Fire escape stairs, regular pedestrian with personnel below.",
    data: [
      { bar:"25×5", load_kNm2:5,   span_4mm:1215, def_4mm:3.96, span_L200:1400, def_L200:6.98,  wt_kg_m2:45.01, binding_kg:1.96 },
      { bar:"25×5", load_kNm2:7.5, span_4mm:1105, def_4mm:3.95, span_L200:1235, def_L200:6.17,  wt_kg_m2:45.01, binding_kg:1.96 },
      { bar:"25×3", load_kNm2:5,   span_4mm:985,  def_4mm:3.98, span_L200:1155, def_L200:5.75,  wt_kg_m2:30.49, binding_kg:1.18 },
      { bar:"25×3", load_kNm2:7.5, span_4mm:985,  def_4mm:3.98, span_L200:1060, def_L200:5.24,  wt_kg_m2:30.49, binding_kg:1.18 },
      { bar:"30×5", load_kNm2:5,   span_4mm:1410, def_4mm:3.99, span_L200:1700, def_L200:8.43,  wt_kg_m2:53.45, binding_kg:2.36 },
      { bar:"30×5", load_kNm2:7.5, span_4mm:1280, def_4mm:3.94, span_L200:1500, def_L200:7.43,  wt_kg_m2:53.45, binding_kg:2.36 },
      { bar:"30×3", load_kNm2:5,   span_4mm:1210, def_4mm:3.97, span_L200:1470, def_L200:7.28,  wt_kg_m2:36.03, binding_kg:1.41 },
      { bar:"30×3", load_kNm2:7.5, span_4mm:1145, def_4mm:3.93, span_L200:1295, def_L200:6.43,  wt_kg_m2:36.03, binding_kg:1.41 },
      { bar:"35×5", load_kNm2:5,   span_4mm:1590, def_4mm:3.97, span_L200:2000, def_L200:9.93,  wt_kg_m2:61.89, binding_kg:2.75 },
      { bar:"35×5", load_kNm2:7.5, span_4mm:1450, def_4mm:3.97, span_L200:1770, def_L200:8.82,  wt_kg_m2:61.89, binding_kg:2.75 },
      { bar:"35×3", load_kNm2:5,   span_4mm:1430, def_4mm:3.99, span_L200:1735, def_L200:8.64,  wt_kg_m2:41.56, binding_kg:1.65 },
      { bar:"35×3", load_kNm2:7.5, span_4mm:1300, def_4mm:3.99, span_L200:1530, def_L200:7.65,  wt_kg_m2:41.56, binding_kg:1.65 },
      { bar:"40×5", load_kNm2:5,   span_4mm:1765, def_4mm:3.98, span_L200:2220, def_L200:9.96,  wt_kg_m2:70.33, binding_kg:3.14 },
      { bar:"40×5", load_kNm2:7.5, span_4mm:1610, def_4mm:3.97, span_L200:2025, def_L200:9.93,  wt_kg_m2:70.33, binding_kg:3.14 },
      { bar:"40×3", load_kNm2:5,   span_4mm:1585, def_4mm:3.96, span_L200:1995, def_L200:9.93,  wt_kg_m2:47.09, binding_kg:1.88 },
      { bar:"40×3", load_kNm2:7.5, span_4mm:1445, def_4mm:3.99, span_L200:1760, def_L200:8.76,  wt_kg_m2:47.09, binding_kg:1.88 },
      { bar:"45×5", load_kNm2:5,   span_4mm:1930, def_4mm:3.96, span_L200:2430, def_L200:9.96,  wt_kg_m2:78.77, binding_kg:3.53 },
      { bar:"45×5", load_kNm2:7.5, span_4mm:1765, def_4mm:3.98, span_L200:2220, def_L200:9.95,  wt_kg_m2:78.77, binding_kg:3.53 },
      { bar:"50×5", load_kNm2:5,   span_4mm:2095, def_4mm:4.00, span_L200:2630, def_L200:9.93,  wt_kg_m2:87.21, binding_kg:3.93 },
      { bar:"50×5", load_kNm2:7.5, span_4mm:1915, def_4mm:3.99, span_L200:2405, def_L200:9.92,  wt_kg_m2:87.21, binding_kg:3.93 },
      { bar:"60×5", load_kNm2:5,   span_4mm:2400, def_4mm:3.99, span_L200:3015, def_L200:9.94,  wt_kg_m2:104.09, binding_kg:4.71 },
      { bar:"60×5", load_kNm2:7.5, span_4mm:2200, def_4mm:3.99, span_L200:2765, def_L200:9.96,  wt_kg_m2:104.09, binding_kg:4.71 },
    ],
  },
  LK35BP_3mm: { // Mesh 37/125, bar 3mm
    product:"LK35BP", bar_t_mm:3, mesh:"37/125",
    std:"BS4592-0:2006+A1:2012",
    note:"35mm ball-proof. Occasional pedestrian, no personnel below. Alternative to 41/100(W).",
    data: [
      { bar:"25×5", load_kNm2:5,   span_4mm:1050, def_4mm:4.00, span_L200:1205, def_L200:6.01,  wt_kg_m2:28.74, binding_kg:1.96 },
      { bar:"25×5", load_kNm2:7.5, span_4mm:985,  def_4mm:3.96, span_L200:1055, def_L200:5.21,  wt_kg_m2:28.74, binding_kg:1.96 },
      { bar:"25×3", load_kNm2:5,   span_4mm:800,  def_4mm:3.96, span_L200:805,  def_L200:4.02,  wt_kg_m2:18.74, binding_kg:1.18 },
      { bar:"25×3", load_kNm2:7.5, span_4mm:800,  def_4mm:3.96, span_L200:805,  def_L200:4.02,  wt_kg_m2:18.74, binding_kg:1.18 },
      { bar:"30×5", load_kNm2:5,   span_4mm:1260, def_4mm:3.97, span_L200:1465, def_L200:7.26,  wt_kg_m2:34.04, binding_kg:2.36 },
      { bar:"30×5", load_kNm2:7.5, span_4mm:1145, def_4mm:3.98, span_L200:1290, def_L200:6.42,  wt_kg_m2:34.04, binding_kg:2.36 },
      { bar:"30×3", load_kNm2:5,   span_4mm:985,  def_4mm:3.99, span_L200:1070, def_L200:4.86,  wt_kg_m2:22.03, binding_kg:1.41 },
      { bar:"30×3", load_kNm2:7.5, span_4mm:985,  def_4mm:3.99, span_L200:1070, def_L200:5.02,  wt_kg_m2:22.03, binding_kg:1.41 },
      { bar:"35×5", load_kNm2:5,   span_4mm:1425, def_4mm:3.97, span_L200:1730, def_L200:8.63,  wt_kg_m2:39.34, binding_kg:2.75 },
      { bar:"35×5", load_kNm2:7.5, span_4mm:1295, def_4mm:3.97, span_L200:1520, def_L200:7.54,  wt_kg_m2:39.34, binding_kg:2.75 },
      { bar:"40×5", load_kNm2:5,   span_4mm:1585, def_4mm:4.00, span_L200:1990, def_L200:9.93,  wt_kg_m2:44.64, binding_kg:3.14 },
      { bar:"40×5", load_kNm2:7.5, span_4mm:1440, def_4mm:3.98, span_L200:1750, def_L200:8.68,  wt_kg_m2:44.64, binding_kg:3.14 },
      { bar:"40×3", load_kNm2:5,   span_4mm:1355, def_4mm:3.98, span_L200:1585, def_L200:5.72,  wt_kg_m2:28.63, binding_kg:1.88 },
      { bar:"40×3", load_kNm2:7.5, span_4mm:1270, def_4mm:3.96, span_L200:1485, def_L200:7.40,  wt_kg_m2:28.63, binding_kg:1.88 },
      { bar:"45×5", load_kNm2:5,   span_4mm:1735, def_4mm:3.98, span_L200:2180, def_L200:9.92,  wt_kg_m2:49.94, binding_kg:3.53 },
      { bar:"45×5", load_kNm2:7.5, span_4mm:1580, def_4mm:3.99, span_L200:1980, def_L200:9.84,  wt_kg_m2:49.94, binding_kg:3.53 },
      { bar:"50×5", load_kNm2:5,   span_4mm:1880, def_4mm:3.97, span_L200:2365, def_L200:9.93,  wt_kg_m2:55.24, binding_kg:3.93 },
      { bar:"50×5", load_kNm2:7.5, span_4mm:1715, def_4mm:3.99, span_L200:2155, def_L200:9.95,  wt_kg_m2:55.24, binding_kg:3.93 },
      { bar:"60×5", load_kNm2:5,   span_4mm:2160, def_4mm:3.97, span_L200:2720, def_L200:9.98,  wt_kg_m2:65.84, binding_kg:4.71 },
      { bar:"60×5", load_kNm2:7.5, span_4mm:1970, def_4mm:3.97, span_L200:2480, def_L200:9.96,  wt_kg_m2:65.84, binding_kg:4.71 },
    ],
  },
  LK_UTILITY_3mm: { // Mesh 47/125, bar 3mm – Utility (no ball-proof requirement)
    product:"LK Utility", bar_t_mm:3, mesh:"47/125",
    std:"BS4592-0:2006+A1:2012",
    note:"Most efficient/sustainable. No ball-proof. No personnel access below.",
    data: [
      { bar:"25×5", load_kNm2:5,   span_4mm:960,  def_4mm:3.95, span_L200:1115, def_L200:5.57,  wt_kg_m2:23.84, binding_kg:1.96 },
      { bar:"25×5", load_kNm2:7.5, span_4mm:935,  def_4mm:3.95, span_L200:985,  def_L200:4.86,  wt_kg_m2:23.84, binding_kg:1.96 },
      { bar:"30×5", load_kNm2:5,   span_4mm:1180, def_4mm:3.97, span_L200:1370, def_L200:6.79,  wt_kg_m2:28.16, binding_kg:2.36 },
      { bar:"30×5", load_kNm2:7.5, span_4mm:1085, def_4mm:3.94, span_L200:1205, def_L200:6.00,  wt_kg_m2:28.16, binding_kg:2.36 },
      { bar:"35×5", load_kNm2:5,   span_4mm:1355, def_4mm:3.97, span_L200:1615, def_L200:8.01,  wt_kg_m2:32.47, binding_kg:2.75 },
      { bar:"35×5", load_kNm2:7.5, span_4mm:1230, def_4mm:3.96, span_L200:1420, def_L200:7.04,  wt_kg_m2:32.47, binding_kg:2.75 },
      { bar:"45×5", load_kNm2:5,   span_4mm:1650, def_4mm:3.96, span_L200:2075, def_L200:9.91,  wt_kg_m2:41.11, binding_kg:3.53 },
      { bar:"45×5", load_kNm2:7.5, span_4mm:1500, def_4mm:3.96, span_L200:1855, def_L200:9.27,  wt_kg_m2:41.11, binding_kg:3.53 },
      { bar:"50×5", load_kNm2:5,   span_4mm:1790, def_4mm:3.96, span_L200:2255, def_L200:9.97,  wt_kg_m2:45.43, binding_kg:3.93 },
      { bar:"50×5", load_kNm2:7.5, span_4mm:1630, def_4mm:3.98, span_L200:2050, def_L200:9.95,  wt_kg_m2:45.43, binding_kg:3.93 },
      { bar:"60×5", load_kNm2:5,   span_4mm:2060, def_4mm:3.98, span_L200:2590, def_L200:9.93,  wt_kg_m2:54.06, binding_kg:4.71 },
      { bar:"60×5", load_kNm2:7.5, span_4mm:1875, def_4mm:3.97, span_L200:2360, def_L200:9.96,  wt_kg_m2:54.06, binding_kg:4.71 },
      // 3mm thin bars
      { bar:"40×3", load_kNm2:5,   span_4mm:1235, def_4mm:3.97, span_L200:1395, def_L200:5.28,  wt_kg_m2:22.97, binding_kg:1.88 },
      { bar:"40×3", load_kNm2:7.5, span_4mm:1195, def_4mm:3.96, span_L200:1370, def_L200:6.83,  wt_kg_m2:22.97, binding_kg:1.88 },
      // Special thin 3mm entries
      { bar:"25×3", load_kNm2:5,   span_4mm:1065, def_4mm:3.97, span_L200:1165, def_L200:4.91,  wt_kg_m2:20.38, binding_kg:null },
      { bar:"25×3", load_kNm2:7.5, span_4mm:1065, def_4mm:3.97, span_L200:1165, def_L200:5.47,  wt_kg_m2:20.38, binding_kg:null },
      { bar:"30×3", load_kNm2:5,   span_4mm:900,  def_4mm:4.00, span_L200:950,  def_L200:4.55,  wt_kg_m2:17.79, binding_kg:1.41 },
      { bar:"30×3", load_kNm2:7.5, span_4mm:900,  def_4mm:4.00, span_L200:950,  def_L200:4.55,  wt_kg_m2:17.79, binding_kg:1.41 },
      { bar:"35×3", load_kNm2:5,   span_4mm:635,  def_4mm:2.78, span_L200:635,  def_L200:2.78,  wt_kg_m2:15.20, binding_kg:null },
      { bar:"35×3", load_kNm2:7.5, span_4mm:635,  def_4mm:2.78, span_L200:635,  def_L200:2.78,  wt_kg_m2:15.20, binding_kg:null },
    ],
  },
};

