/**
 * Generates Wiberg Ordering Guide PPTX (~8 slides).
 * Run: node build-ordering-guide-pptx.mjs
 * Output: ../downloads/Wiberg-Ordering-Guide-2026.pptx
 */
import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function imgData(relPath) {
  const full = path.join(root, relPath);
  if (!fs.existsSync(full)) { console.warn("  ⚠ missing:", full); return null; }
  const ext = path.extname(full).toLowerCase().replace(".", "");
  const mime = ext === "jpg" ? "jpeg" : ext === "png" ? "png" : ext;
  return `image/${mime};base64,${fs.readFileSync(full).toString("base64")}`;
}

const NAVY = "0f172a";
const BRAND = "0369a1";
const ACCENT = "0ea5e9";
const WHITE = "ffffff";
const MUTED = "64748b";
const LIGHT = "f0f5fa";
const GREEN = "059669";
const ORANGE = "d97706";

const pptx = new PptxGenJS();
pptx.author = "Wiberg Metal";
pptx.company = "Wiberg Metal";
pptx.subject = "Ordering Guide 2026";
pptx.title = "WIBERG — Customer Ordering Guide";
pptx.layout = "LAYOUT_WIDE";

function footer(slide, num) {
  slide.addText("www.wiberg-grating.com  |  wibergmetal.com", {
    x: 0.5, y: 7.0, w: 8, h: 0.35, fontSize: 9, color: MUTED, fontFace: "Arial",
  });
  if (num) slide.addText(String(num), {
    x: 12.0, y: 7.0, w: 0.8, h: 0.35, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right",
  });
}

function accentBar(slide, y) {
  slide.addShape(pptx.ShapeType.rect, { x: 0.8, y, w: 2, h: 0.05, fill: { color: BRAND } });
}

// ════════════════════════════════════════════
// SLIDE 1 — COVER
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: NAVY };

  const hero = imgData("assets/images/hero-manufacturing.png");
  if (hero) {
    s.addImage({ data: hero, x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: "cover" } });
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY, transparency: 35 } });
  }

  const logo = imgData("assets/images/logo.png");
  if (logo) s.addImage({ data: logo, x: 0.8, y: 0.6, w: 2.4, h: 0.66 });

  s.addText("Customer Ordering Guide", {
    x: 0.8, y: 2.2, w: 11, h: 1.2,
    fontSize: 48, bold: true, color: WHITE, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 3.5, w: 3, h: 0.06, fill: { color: ACCENT } });
  s.addText("How to specify, order, and receive\nyour steel grating from Wiberg", {
    x: 0.8, y: 3.8, w: 8, h: 0.8,
    fontSize: 18, color: ACCENT, fontFace: "Arial", lineSpacingMultiple: 1.5,
  });
  s.addText("From inquiry to delivery — everything you need to know", {
    x: 0.8, y: 4.9, w: 8, h: 0.4,
    fontSize: 14, color: MUTED, fontFace: "Arial",
  });
}

// ════════════════════════════════════════════
// SLIDE 2 — ORDER PROCESS OVERVIEW (timeline)
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Order Process — From Inquiry to Delivery", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);

  const steps = [
    { num: "1", title: "Inquiry", desc: "Send RFQ with product\ntype, spacing, material,\nfinish, size, quantity", time: "Day 0" },
    { num: "2", title: "Quotation", desc: "Receive pricing,\ntechnical confirmation,\nand delivery schedule", time: "1–2 days" },
    { num: "3", title: "Order", desc: "Confirm PO, agree on\nspecs & payment terms,\nshop drawings issued", time: "Day 3–5" },
    { num: "4", title: "Production", desc: "Manufacturing, surface\ntreatment, QC inspection\nand test reports", time: "15–25 days" },
    { num: "5", title: "Shipping", desc: "Export packing, container\nloading, B/L & documents,\ntracking provided", time: "3–5 days" },
    { num: "6", title: "Delivery", desc: "Arrival at destination\nport or site, after-sales\nsupport continues", time: "15–35 days" },
  ];

  // Arrow line
  s.addShape(pptx.ShapeType.rect, { x: 1.2, y: 2.55, w: 11.0, h: 0.06, fill: { color: ACCENT } });

  steps.forEach((st, i) => {
    const x = 0.6 + i * 2.05;
    // Circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.5, y: 2.15, w: 0.8, h: 0.8,
      fill: { color: BRAND },
    });
    s.addText(st.num, {
      x: x + 0.5, y: 2.2, w: 0.8, h: 0.75,
      fontSize: 22, bold: true, color: WHITE, fontFace: "Arial", align: "center", valign: "middle",
    });
    s.addText(st.title, {
      x, y: 3.1, w: 1.8, h: 0.4,
      fontSize: 13, bold: true, color: NAVY, fontFace: "Arial", align: "center",
    });
    s.addText(st.desc, {
      x, y: 3.5, w: 1.8, h: 1.1,
      fontSize: 10, color: MUTED, fontFace: "Arial", align: "center", lineSpacingMultiple: 1.35,
    });
    s.addText(st.time, {
      x, y: 4.65, w: 1.8, h: 0.3,
      fontSize: 10, bold: true, color: ACCENT, fontFace: "Arial", align: "center",
    });
  });

  s.addText("Typical lead time: 4–8 weeks (inquiry to arrival), depending on quantity, complexity, and destination.", {
    x: 0.8, y: 5.3, w: 11, h: 0.4,
    fontSize: 12, color: MUTED, fontFace: "Arial", italic: true,
  });

  // production photo
  const welding = imgData("assets/images/about/production-process/production-process-welding.jpg");
  if (welding) {
    s.addImage({ data: welding, x: 0.8, y: 5.8, w: 3.8, h: 1.0, sizing: { type: "cover" }, rounding: true });
  }
  const packing = imgData("assets/images/about/production-process/production-process-packing.jpg");
  if (packing) {
    s.addImage({ data: packing, x: 4.9, y: 5.8, w: 3.8, h: 1.0, sizing: { type: "cover" }, rounding: true });
  }
  const warehouse = imgData("assets/images/about/production-process/warehouse-packing-shipping.jpg");
  if (warehouse) {
    s.addImage({ data: warehouse, x: 9.0, y: 5.8, w: 3.8, h: 1.0, sizing: { type: "cover" }, rounding: true });
  }

  footer(s, 2);
}

// ════════════════════════════════════════════
// SLIDE 3 — WHAT TO SPECIFY (RFQ checklist)
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("What Information to Provide", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);
  s.addText("The more complete your inquiry, the faster and more accurate our quotation.", {
    x: 0.8, y: 1.2, w: 11, h: 0.35,
    fontSize: 13, color: MUTED, fontFace: "Arial", italic: true,
  });

  const items = [
    { icon: "☑", label: "Product Type", detail: "Bar grating, stair treads, trench covers,\nFRP grating, accessories, or platform packages", required: true },
    { icon: "☑", label: "Spacing / Mesh", detail: 'e.g. 30×100 (metric), 19-W-4 (US/NAAMM),\nor "standard duty" — we\'ll confirm mapping', required: true },
    { icon: "☑", label: "Material & Finish", detail: "Carbon steel + HDG, stainless (304/316),\naluminum, painted, powder coated, untreated", required: true },
    { icon: "☑", label: "Panel Dimensions", detail: "Length × width (mm), bearing bar direction,\nspan, and support locations", required: true },
    { icon: "☑", label: "Quantity", detail: "Number of panels, m², or tonnes.\nApproximate OK — we'll optimize.", required: true },
    { icon: "○", label: "Load / Span", detail: "Design live load (kN/m² or psf), span,\ndeflection limit — helps verify bar size", required: false },
    { icon: "○", label: "Drawings / Sketches", detail: "PDF, DWG, or hand sketch accepted.\nSpeeds up accurate quotation.", required: false },
    { icon: "○", label: "Standards", detail: "Target standard: YB/T, ANSI/NAAMM,\nEN, BS, AS — if specified by owner", required: false },
    { icon: "○", label: "Delivery Details", detail: "Destination port/site, incoterm\n(FOB / CIF / DDP), timeline", required: false },
    { icon: "○", label: "Special Requirements", detail: "Cut-outs, banding, nosing, toe plates,\nbolt holes, curved panels, platform assembly", required: false },
  ];

  items.forEach((it, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i < 5 ? i : i - 5;
    const x = 0.8 + col * 6.2;
    const y = 1.7 + row * 1.05;

    const bgColor = it.required ? "e8f4fd" : LIGHT;
    s.addShape(pptx.ShapeType.rect, { x, y, w: 5.9, h: 0.9, fill: { color: bgColor }, rectRadius: 0.06 });

    s.addText(it.required ? "✓" : "○", {
      x, y, w: 0.45, h: 0.9,
      fontSize: 16, bold: true, color: it.required ? GREEN : MUTED, fontFace: "Arial", align: "center", valign: "middle",
    });
    s.addText(it.label, {
      x: x + 0.45, y, w: 1.8, h: 0.9,
      fontSize: 12, bold: true, color: NAVY, fontFace: "Arial", valign: "middle",
    });
    s.addText(it.detail, {
      x: x + 2.3, y, w: 3.4, h: 0.9,
      fontSize: 9.5, color: MUTED, fontFace: "Arial", valign: "middle", lineSpacingMultiple: 1.3,
    });
  });

  s.addText("✓ = Required for quotation     ○ = Helpful (can discuss later)", {
    x: 0.8, y: 6.95, w: 8, h: 0.3,
    fontSize: 10, color: MUTED, fontFace: "Arial",
  });

  footer(s, 3);
}

// ════════════════════════════════════════════
// SLIDE 4 — PRODUCT QUICK-REFERENCE
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Product Quick-Reference", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);

  const tableRows = [
    ["Product", "Common Spec (metric)", "Typical Use", "Finish"],
    ["Press-welded grating", "30×100, 30×5 bar, 6mm cross", "Platforms, walkways, mezzanines", "HDG / painted"],
    ["Close-mesh grating", "20×50 or 30×50, 30×5", "Pedestrian, heel-proof, ADA", "HDG"],
    ["Heavy-duty grating", "40×100, 50×6 ~ 150×8 bar", "Vehicle lanes, docks, heavy plant", "HDG"],
    ["Press-locked grating", "30×100, 25×5 bar, flat cross", "Architectural, clean finish", "HDG / SS"],
    ["Stair treads (welded)", "T1–T3, 30×100 mesh, nosing", "Industrial stairs, ladders", "HDG + nosing"],
    ["Stair treads (bolted)", "T4–T6, bolt-on carriers", "Retrofit, easy replacement", "HDG + nosing"],
    ["Trench / drain covers", "30×100 or 30×50, framed", "Plant trenches, drains, sumps", "HDG / SS"],
    ["FRP molded grating", "38×38 mesh, 25/38 mm deep", "Chemical, wet, non-conductive", "As-molded"],
    ["Accessories", "Clips, brackets, banding, nosing", "Fixing, edge trim, safety", "Match grating"],
  ];

  const colW = [2.4, 2.8, 3.3, 1.8];

  tableRows.forEach((row, ri) => {
    const y = 1.3 + ri * 0.55;
    const isHeader = ri === 0;
    const bg = isHeader ? BRAND : ri % 2 === 0 ? LIGHT : WHITE;
    const txtColor = isHeader ? WHITE : NAVY;
    let xOff = 0.6;
    row.forEach((cell, ci) => {
      s.addShape(pptx.ShapeType.rect, { x: xOff, y, w: colW[ci], h: 0.5, fill: { color: bg } });
      s.addText(cell, {
        x: xOff + 0.1, y, w: colW[ci] - 0.2, h: 0.5,
        fontSize: isHeader ? 10 : 9.5, bold: isHeader, color: txtColor, fontFace: "Arial", valign: "middle",
      });
      xOff += colW[ci];
    });
  });

  s.addText("Not sure which product? Tell us the application and we'll recommend the right type.", {
    x: 0.8, y: 6.95, w: 10, h: 0.3,
    fontSize: 11, color: BRAND, fontFace: "Arial", italic: true,
  });

  footer(s, 4);
}

// ════════════════════════════════════════════
// SLIDE 5 — DESIGNATION / HOW TO READ A SPEC
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("How to Read a Grating Specification", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);

  // Example spec
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.3, w: 11.7, h: 1.3, fill: { color: LIGHT }, rectRadius: 0.1 });
  s.addText("W-30-100,  30×5,  Q235B,  Serrated,  Hot-Dip Galvanized", {
    x: 1.2, y: 1.4, w: 11, h: 0.6,
    fontSize: 22, bold: true, color: BRAND, fontFace: "Consolas",
  });
  s.addText("↑ Type     ↑ Pitch   ↑ Bar      ↑ Steel     ↑ Surface    ↑ Finish", {
    x: 1.2, y: 2.0, w: 11, h: 0.4,
    fontSize: 12, color: MUTED, fontFace: "Consolas",
  });

  const fields = [
    ["W / P / HD", "Type", "W = Welded, P = Press-locked, HD = Heavy-duty"],
    ["30-100", "Pitch (s₁ × s₂)", "Bearing bar pitch 30 mm, cross bar pitch 100 mm"],
    ["30×5", "Bar size (H × T)", "Bar height 30 mm, thickness 5 mm"],
    ["Q235B / A36 / S235JR", "Material grade", "Steel grade — stainless quoted separately (304/316)"],
    ["Plain / Serrated", "Surface", "Plain = smooth, Serrated = slip-resistant teeth"],
    ["HDG / Painted / Untreated", "Finish", "Hot-dip galvanized (≥610 g/m²), powder coat, or bare"],
    ["1000 × 6000", "Panel size (L × W)", "Net length × width in mm; state bearing bar direction"],
    ["G305/30/100W", "YB/T model code", "Alternative designation per Chinese standard YB/T 4001.1"],
  ];

  fields.forEach(([code, name, desc], i) => {
    const y = 2.8 + i * 0.55;
    const bg = i % 2 === 0 ? LIGHT : WHITE;
    s.addShape(pptx.ShapeType.rect, { x: 0.8, y, w: 11.7, h: 0.5, fill: { color: bg } });
    s.addText(code, { x: 0.9, y, w: 3.0, h: 0.5, fontSize: 11, bold: true, color: BRAND, fontFace: "Consolas", valign: "middle" });
    s.addText(name, { x: 4.0, y, w: 2.2, h: 0.5, fontSize: 11, bold: true, color: NAVY, fontFace: "Arial", valign: "middle" });
    s.addText(desc, { x: 6.3, y, w: 6.0, h: 0.5, fontSize: 10, color: MUTED, fontFace: "Arial", valign: "middle" });
  });

  footer(s, 5);
}

// ════════════════════════════════════════════
// SLIDE 6 — PAYMENT, PACKING, SHIPPING
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Payment, Packing & Shipping", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);

  // 3 columns
  const cols = [
    {
      title: "Payment Terms",
      items: [
        "T/T: 30% deposit + 70% before shipment",
        "L/C at sight — accepted for larger orders",
        "Other terms negotiable for repeat customers",
        "Currency: USD (EUR / RMB on request)",
      ],
    },
    {
      title: "Export Packing",
      items: [
        "Steel strapping + plywood crate (standard)",
        "Bundled with plastic corner protectors",
        "Fumigation-free plywood (ISPM-15)",
        "Custom packing per buyer requirement",
      ],
    },
    {
      title: "Shipping & Logistics",
      items: [
        "Incoterms: FOB Tianjin / CIF / DDP",
        "20' GP / 40' GP / 40' HC / flat rack",
        "Container optimization for cost saving",
        "Full B/L, packing list, CO, test certs",
      ],
    },
  ];

  cols.forEach((col, ci) => {
    const x = 0.8 + ci * 4.0;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.3, w: 3.7, h: 3.2, fill: { color: LIGHT }, rectRadius: 0.1 });
    s.addText(col.title, {
      x: x + 0.2, y: 1.4, w: 3.3, h: 0.5,
      fontSize: 16, bold: true, color: BRAND, fontFace: "Arial",
    });
    col.items.forEach((item, ii) => {
      s.addText(`• ${item}`, {
        x: x + 0.25, y: 2.0 + ii * 0.55, w: 3.2, h: 0.5,
        fontSize: 11, color: NAVY, fontFace: "Arial", lineSpacingMultiple: 1.3,
      });
    });
  });

  // Documents section
  s.addText("Documents Provided", {
    x: 0.8, y: 4.7, w: 5, h: 0.45,
    fontSize: 16, bold: true, color: NAVY, fontFace: "Arial",
  });
  const docs = [
    "Commercial Invoice",
    "Packing List",
    "Bill of Lading (B/L)",
    "Certificate of Origin (CO)",
    "Mill Test Certificate (MTC / EN 10204 3.1)",
    "Galvanizing Certificate",
    "SGS / BV Inspection Report (optional)",
    "Shop Drawings (stamped)",
  ];
  docs.forEach((d, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    s.addText(`✓  ${d}`, {
      x: 0.8 + col * 6.0, y: 5.2 + row * 0.38, w: 5.5, h: 0.35,
      fontSize: 11, color: NAVY, fontFace: "Arial",
    });
  });

  footer(s, 6);
}

// ════════════════════════════════════════════
// SLIDE 7 — QUALITY ASSURANCE
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Quality Assurance", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  accentBar(s, 1.05);

  const certs = [
    { title: "ISO 9001:2015", desc: "Quality management system\ncovering design, production,\ninspection, and delivery" },
    { title: "CE / EN 1090", desc: "Structural steel certification\nfor European market\ncompliance" },
    { title: "Green Enterprise", desc: "Environmental qualification\nfor sustainable manufacturing\nprocesses" },
    { title: "SGS / BV", desc: "Third-party inspection\navailable on request\nfor pre-shipment QC" },
  ];

  certs.forEach((c, i) => {
    const x = 0.8 + i * 3.1;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.3, w: 2.8, h: 1.8, fill: { color: LIGHT }, rectRadius: 0.1 });
    s.addText(c.title, { x: x + 0.15, y: 1.4, w: 2.5, h: 0.45, fontSize: 14, bold: true, color: BRAND, fontFace: "Arial", align: "center" });
    s.addText(c.desc, { x: x + 0.15, y: 1.9, w: 2.5, h: 1.0, fontSize: 10, color: NAVY, fontFace: "Arial", align: "center", lineSpacingMultiple: 1.35 });
  });

  // QC process
  s.addText("In-Process Quality Control", {
    x: 0.8, y: 3.4, w: 8, h: 0.5,
    fontSize: 16, bold: true, color: NAVY, fontFace: "Arial",
  });

  const qcSteps = [
    "Raw material inspection — mill certs verified, bar dimensions checked",
    "Welding QC — forge pressure monitoring, cross-bar pull-off test",
    "Dimensional check — panel size, pitch, flatness tolerance per standard",
    "Surface treatment — zinc coating thickness, adhesion test (HDG)",
    "Final inspection — visual, dimensional, weight, and packing check",
    "Loading supervision — container photos, loading plan, seal number recorded",
  ];

  qcSteps.forEach((step, i) => {
    const y = 4.0 + i * 0.42;
    s.addText(`${i + 1}.  ${step}`, {
      x: 0.8, y, w: 11, h: 0.38,
      fontSize: 11, color: NAVY, fontFace: "Arial",
    });
  });

  // Photos
  const qcImg = imgData("assets/images/about/production-process/production-process-quality-inspection.jpg");
  if (qcImg) {
    s.addImage({ data: qcImg, x: 9.0, y: 3.3, w: 3.8, h: 1.5, sizing: { type: "cover" }, rounding: true });
  }
  const galvImg = imgData("assets/images/about/production-process/galvanizing.jpg");
  if (galvImg) {
    s.addImage({ data: galvImg, x: 9.0, y: 5.0, w: 3.8, h: 1.5, sizing: { type: "cover" }, rounding: true });
  }

  footer(s, 7);
}

// ════════════════════════════════════════════
// SLIDE 8 — CONTACT & NEXT STEPS
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: NAVY };

  s.addText("Ready to Order?", {
    x: 0.8, y: 0.8, w: 11, h: 1.0,
    fontSize: 42, bold: true, color: WHITE, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.85, w: 3, h: 0.06, fill: { color: ACCENT } });

  s.addText("3 easy ways to start your inquiry:", {
    x: 0.8, y: 2.2, w: 8, h: 0.5,
    fontSize: 16, color: ACCENT, fontFace: "Arial",
  });

  const ways = [
    { num: "1", title: "Email Us", detail: "Send your requirements to\nsales@wiberg-grating.com\nor info@wibergmetal.com" },
    { num: "2", title: "WhatsApp", detail: "Quick chat at\n+86 132 7317 7087\nFiles & photos welcome" },
    { num: "3", title: "Online RFQ", detail: "Fill out the form at\nwibergmetal.com/rfq/\nUpload drawings directly" },
  ];

  ways.forEach((w, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.ShapeType.rect, { x, y: 2.9, w: 3.7, h: 2.2, fill: { color: "1e293b" }, rectRadius: 0.1 });
    s.addShape(pptx.ShapeType.ellipse, { x: x + 1.3, y: 3.05, w: 0.8, h: 0.8, fill: { color: BRAND } });
    s.addText(w.num, { x: x + 1.3, y: 3.08, w: 0.8, h: 0.75, fontSize: 22, bold: true, color: WHITE, fontFace: "Arial", align: "center", valign: "middle" });
    s.addText(w.title, { x: x + 0.2, y: 3.9, w: 3.3, h: 0.4, fontSize: 15, bold: true, color: WHITE, fontFace: "Arial", align: "center" });
    s.addText(w.detail, { x: x + 0.2, y: 4.3, w: 3.3, h: 0.7, fontSize: 11, color: MUTED, fontFace: "Arial", align: "center", lineSpacingMultiple: 1.4 });
  });

  // Response time
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 5.4, w: 11.7, h: 0.7, fill: { color: BRAND }, rectRadius: 0.08 });
  s.addText("Typical response: within 24 business hours  ·  Mon–Sat 09:00–18:00 (UTC+8)", {
    x: 1.0, y: 5.4, w: 11.3, h: 0.7,
    fontSize: 14, bold: true, color: WHITE, fontFace: "Arial", align: "center", valign: "middle",
  });

  const logo = imgData("assets/images/logo.png");
  if (logo) s.addImage({ data: logo, x: 9.5, y: 0.5, w: 3.0, h: 0.83 });

  s.addText("www.wiberg-grating.com  |  wibergmetal.com", {
    x: 0.8, y: 6.4, w: 8, h: 0.3,
    fontSize: 11, color: MUTED, fontFace: "Arial",
  });
  s.addText("ISO 9001  ·  CE / EN 1090  ·  SGS / BV Available", {
    x: 0.8, y: 6.75, w: 8, h: 0.3,
    fontSize: 10, color: MUTED, fontFace: "Arial",
  });
  s.addText("8", { x: 12.0, y: 7.0, w: 0.8, h: 0.35, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right" });
}

// ── write ──
const outDir = path.join(root, "downloads");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "Wiberg-Ordering-Guide-2026.pptx");
await pptx.writeFile({ fileName: outPath });
console.log("✅ Wrote", outPath);
