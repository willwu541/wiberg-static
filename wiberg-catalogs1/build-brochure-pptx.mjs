/**
 * Generates Wiberg company brochure PPTX (~10 slides).
 * Uses real photos from the site's assets/images.
 * Run: node build-brochure-pptx.mjs
 * Output: ../downloads/Wiberg-Company-Brochure-2026.pptx
 */
import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const img = (...segs) => path.join(root, "assets", "images", ...segs);

// resolve image as base64 data URI for embedding
function imgData(relPath) {
  const full = path.isAbsolute(relPath) ? relPath : path.join(root, relPath);
  if (!fs.existsSync(full)) {
    console.warn("  ⚠ missing:", full);
    return null;
  }
  const ext = path.extname(full).toLowerCase().replace(".", "");
  const mime = ext === "jpg" ? "jpeg" : ext === "png" ? "png" : ext;
  const buf = fs.readFileSync(full);
  return `image/${mime};base64,${buf.toString("base64")}`;
}

// ── brand colours (from site CSS) ──
const NAVY  = "0f172a";
const BRAND = "0369a1";
const ACCENT = "0ea5e9";
const WHITE = "ffffff";
const MUTED = "64748b";
const LIGHT_BG = "f0f5fa";

const pptx = new PptxGenJS();
pptx.author = "Wiberg Metal";
pptx.company = "Wiberg Metal";
pptx.subject = "Company Brochure 2026";
pptx.title = "WIBERG — Industrial Grating Solutions";
pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 in

function footer(slide, pageNum) {
  slide.addText("www.wiberg-grating.com  |  wibergmetal.com", {
    x: 0.5, y: 7.0, w: 8, h: 0.35,
    fontSize: 9, color: MUTED, fontFace: "Arial",
  });
  if (pageNum) {
    slide.addText(String(pageNum), {
      x: 12.0, y: 7.0, w: 0.8, h: 0.35,
      fontSize: 9, color: MUTED, fontFace: "Arial", align: "right",
    });
  }
}

// ════════════════════════════════════════════
// SLIDE 1 — COVER
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: NAVY };

  const heroImg = imgData("assets/images/hero-bar-grating.jpg");
  if (heroImg) {
    s.addImage({ data: heroImg, x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: "cover" } });
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 13.33, h: 7.5,
      fill: { color: NAVY, transparency: 40 },
    });
  }

  const logoImg = imgData("assets/images/logo.png");
  if (logoImg) {
    s.addImage({ data: logoImg, x: 0.8, y: 0.6, w: 2.4, h: 0.66 });
  }

  s.addText("WIBERG", {
    x: 0.8, y: 2.0, w: 11, h: 1.4,
    fontSize: 72, bold: true, color: WHITE, fontFace: "Arial",
    letterSpacing: 6,
  });
  s.addText("Industrial Grating Solutions", {
    x: 0.8, y: 3.3, w: 11, h: 0.6,
    fontSize: 26, color: ACCENT, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 4.1, w: 3, h: 0.06, fill: { color: ACCENT },
  });
  s.addText("Steel Grating  ·  Stair Treads  ·  Trench Covers  ·  FRP  ·  Accessories", {
    x: 0.8, y: 4.4, w: 11, h: 0.5,
    fontSize: 16, color: WHITE, fontFace: "Arial",
  });
  s.addText("China  ·  Serving 40+ Countries", {
    x: 0.8, y: 5.2, w: 6, h: 0.35,
    fontSize: 14, color: MUTED, fontFace: "Arial",
  });
  s.addText("ISO 9001  ·  CE  ·  EN 1090", {
    x: 0.8, y: 6.6, w: 6, h: 0.3,
    fontSize: 11, color: MUTED, fontFace: "Arial",
  });
}

// ════════════════════════════════════════════
// SLIDE 2 — ABOUT WIBERG
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("About Wiberg", {
    x: 0.8, y: 0.4, w: 6, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND },
  });

  const factoryImg = imgData("assets/images/about/factory/factory.png");
  if (factoryImg) {
    s.addImage({ data: factoryImg, x: 0.8, y: 1.4, w: 5.5, h: 3.5, sizing: { type: "cover" }, rounding: true });
  }

  s.addText([
    { text: "Headquartered in Hebei, China, ", options: { fontSize: 14, color: NAVY } },
    { text: "Wiberg", options: { fontSize: 14, bold: true, color: BRAND } },
    { text: " manufactures press-welded, press-locked, and heavy-duty steel bar grating, stair treads, trench covers, and FRP grating.", options: { fontSize: 14, color: NAVY } },
  ], { x: 7.0, y: 1.4, w: 5.5, h: 1.4, valign: "top", fontFace: "Arial", lineSpacingMultiple: 1.4 });

  s.addText("With in-house galvanizing, coating, and fabrication — from single panels to complete platform packages.", {
    x: 7.0, y: 3.0, w: 5.5, h: 0.8,
    fontSize: 13, color: MUTED, fontFace: "Arial", lineSpacingMultiple: 1.4,
  });

  s.addText("One factory. One contact. One solution.", {
    x: 7.0, y: 3.9, w: 5.5, h: 0.5,
    fontSize: 16, bold: true, color: BRAND, fontFace: "Arial",
  });

  // Stats
  const stats = [
    ["50,000+", "MT Annual\nCapacity"],
    ["40+", "Countries\n& Regions"],
    ["500+", "Active\nCustomers"],
    ["15+", "Years\nExperience"],
  ];
  stats.forEach(([num, label], i) => {
    const left = 0.8 + i * 3.1;
    s.addText(num, { x: left, y: 5.3, w: 2.8, h: 0.7, fontSize: 28, bold: true, color: ACCENT, fontFace: "Arial", align: "center" });
    s.addText(label, { x: left, y: 6.0, w: 2.8, h: 0.6, fontSize: 11, color: MUTED, fontFace: "Arial", align: "center", lineSpacingMultiple: 1.2 });
  });

  footer(s, 2);
}

// ════════════════════════════════════════════
// SLIDE 3 — WHY WIBERG
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_BG };

  s.addText("Why Wiberg", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND },
  });

  const reasons = [
    ["Full Product Range", "Press-welded, press-locked, heavy-duty, close-mesh, serrated, I-bar, composite, stainless, aluminum, and FRP — all from one supplier."],
    ["In-House Galvanizing", "Hot-dip galvanizing (≥ 610 g/m²), powder coating, and painting — surface treatment under our roof, no outsourcing delays."],
    ["Custom Fabrication", "CNC cutting, notching, banding, toe plates, bolt holes, curved panels, and platform assemblies — delivered ready to install."],
    ["Certified Quality", "ISO 9001:2015 quality management, CE / EN 1090 structural certification, SGS / BV third-party inspection available."],
    ["Engineering Support", "Load calculations, stamped shop drawings, material selection guidance, and specification review — before and after order."],
    ["Global Logistics", "Export-standard packing (steel banding + plywood crate), FOB / CIF / DDP, container optimization, and on-time delivery to 40+ countries."],
  ];

  reasons.forEach(([title, desc], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.5 + row * 2.8;
    s.addShape(pptx.ShapeType.rect, {
      x, y, w: 3.7, h: 2.4,
      fill: { color: WHITE },
      shadow: { type: "outer", blur: 6, offset: 2, color: "d0d0d0", opacity: 0.3 },
      rectRadius: 0.1,
    });
    s.addText(String(i + 1), {
      x: x + 0.2, y: y + 0.15, w: 0.5, h: 0.5,
      fontSize: 20, bold: true, color: ACCENT, fontFace: "Arial",
    });
    s.addText(title, {
      x: x + 0.7, y: y + 0.15, w: 2.7, h: 0.4,
      fontSize: 14, bold: true, color: NAVY, fontFace: "Arial",
    });
    s.addText(desc, {
      x: x + 0.2, y: y + 0.65, w: 3.3, h: 1.6,
      fontSize: 11, color: MUTED, fontFace: "Arial", lineSpacingMultiple: 1.35, valign: "top",
    });
  });

  footer(s, 3);
}

// ════════════════════════════════════════════
// SLIDE 4 — PRODUCTS (1): Core categories
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Product Range", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND },
  });

  const products = [
    { name: "Bar Grating", desc: "Press-welded, press-locked, heavy-duty,\nclose-mesh, serrated, composite", img: "assets/images/products/Core Product Categories/bar-grating.png" },
    { name: "Stair Treads", desc: "Welded & bolted types, plain / serrated,\nwith anti-slip nosing options", img: "assets/images/products/Core Product Categories/stair-tread.png" },
    { name: "Trench Covers", desc: "Grating, channel, and manhole covers\nfor plant trenches and drains", img: "assets/images/products/Core Product Categories/trench-cover.png" },
    { name: "FRP Grating", desc: "Molded fiberglass grating for corrosive\nand non-conductive environments", img: "assets/images/products/Core Product Categories/fiberglass-grating.png" },
    { name: "Accessories", desc: "Fixing clips, saddle clamps, toe plates,\nbanding bars, brackets", img: "assets/images/products/Core Product Categories/accessories.png" },
  ];

  products.forEach((p, i) => {
    const x = 0.5 + i * 2.5;
    const y = 1.5;
    const d = imgData(p.img);
    if (d) {
      s.addImage({ data: d, x: x + 0.15, y, w: 2.2, h: 2.2, sizing: { type: "contain" } });
    } else {
      s.addShape(pptx.ShapeType.rect, { x: x + 0.15, y, w: 2.2, h: 2.2, fill: { color: LIGHT_BG }, rectRadius: 0.08 });
    }
    s.addText(p.name, { x, y: 3.9, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: NAVY, fontFace: "Arial", align: "center" });
    s.addText(p.desc, { x, y: 4.3, w: 2.5, h: 0.9, fontSize: 10, color: MUTED, fontFace: "Arial", align: "center", lineSpacingMultiple: 1.3 });
  });

  // Extra: bar grating detail photos row
  const detailPhotos = [
    "assets/images/products/bar grating/welding-bar-grating/main-product-image.jpg",
    "assets/images/products/bar grating/Press-Locked Grating/main-product-image.jpg",
    "assets/images/products/bar grating/serrated-steel-grating/main-product-image.jpg",
  ];
  detailPhotos.forEach((p, i) => {
    const d = imgData(p);
    if (d) {
      s.addImage({ data: d, x: 0.8 + i * 4.0, y: 5.4, w: 3.6, h: 1.4, sizing: { type: "cover" }, rounding: true });
    }
  });

  footer(s, 4);
}

// ════════════════════════════════════════════
// SLIDE 5 — PRODUCTS (2): Welded grating details
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Steel Bar Grating — Product Families", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2, h: 0.05, fill: { color: BRAND } });

  const families = [
    ["Press-Welded (Type W)", "Electro-forged at every crossing.\nThe industry standard for platforms,\nwalkways, and industrial flooring."],
    ["Press-Locked (Type P)", "Mechanical lock, no weld at crossing.\nSmooth surface for architectural\nand clean-line applications."],
    ["Heavy-Duty (Type HD)", "Deep bearing bars for wheel loads,\ndock traffic, and industrial drive lanes.\nH up to 150 mm."],
    ["Close-Mesh", "20–30 mm bar pitch, 50 mm cross.\nHeel-proof / ball-proof.\nPedestrian-safe ADA compliant."],
    ["Serrated", "Slip-resistant tooth profile on\nbearing bars. For wet, oily,\nor icy environments."],
    ["Composite (Checker Plate)", "Grating + checker plate top.\nCombines strength with\nsolid walking surface."],
  ];

  families.forEach(([title, desc], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.3 + row * 2.5;
    s.addShape(pptx.ShapeType.rect, {
      x, y, w: 3.7, h: 2.1,
      fill: { color: LIGHT_BG }, rectRadius: 0.08,
    });
    s.addText(title, { x: x + 0.2, y: y + 0.15, w: 3.3, h: 0.4, fontSize: 13, bold: true, color: BRAND, fontFace: "Arial" });
    s.addText(desc, { x: x + 0.2, y: y + 0.6, w: 3.3, h: 1.3, fontSize: 11, color: NAVY, fontFace: "Arial", lineSpacingMultiple: 1.35, valign: "top" });
  });

  s.addText("Materials: Carbon steel (Q235B / A36 / S235JR), stainless steel (304/316), aluminum. Finishes: HDG, painted, powder coated, untreated.", {
    x: 0.8, y: 6.4, w: 11.5, h: 0.4,
    fontSize: 10, color: MUTED, fontFace: "Arial",
  });

  footer(s, 5);
}

// ════════════════════════════════════════════
// SLIDE 6 — APPLICATIONS
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Applications", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND } });

  const apps = [
    { name: "Platform Flooring", img: "assets/images/home/Solutions/Applications/Platform Flooring/product-application-fd1aa74d.jpg" },
    { name: "Walkways & Passages", img: "assets/images/home/Solutions/Applications/Walkways/product-application-68710195.jpg" },
    { name: "Drainage Covers", img: "assets/images/home/Solutions/Applications/Drainage Covers/drainage.jpg" },
    { name: "Stair Systems", img: "assets/images/home/Solutions/Applications/Stair Systems/stock-photo-119555657.jpg" },
    { name: "Safety Flooring", img: "assets/images/home/Solutions/Applications/Safety Flooring/product-application-4.jpg" },
  ];

  apps.forEach((a, i) => {
    const x = 0.4 + i * 2.55;
    const d = imgData(a.img);
    if (d) {
      s.addImage({ data: d, x, y: 1.5, w: 2.35, h: 3.5, sizing: { type: "cover" }, rounding: true });
    } else {
      s.addShape(pptx.ShapeType.rect, { x, y: 1.5, w: 2.35, h: 3.5, fill: { color: LIGHT_BG }, rectRadius: 0.08 });
    }
    s.addText(a.name, { x, y: 5.1, w: 2.35, h: 0.4, fontSize: 12, bold: true, color: NAVY, fontFace: "Arial", align: "center" });
  });

  s.addText("Also used for: rooftop walkways, mezzanine decks, facade screens, ventilation grilles, security barriers, cable trays, and more.", {
    x: 0.8, y: 5.8, w: 11.5, h: 0.5,
    fontSize: 11, color: MUTED, fontFace: "Arial",
  });

  footer(s, 6);
}

// ════════════════════════════════════════════
// SLIDE 7 — INDUSTRIES
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: NAVY };

  s.addText("Industries We Serve", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 32, bold: true, color: WHITE, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } });

  const industries = [
    { name: "Oil & Gas", img: "assets/images/home/Solutions/Industries/Oil & Gas/istockphoto-582256640-612x612.jpg" },
    { name: "Power Plants", img: "assets/images/home/Solutions/Industries/Power Plants/istockphoto-682839254-612x612.jpg" },
    { name: "Chemical &\nPetrochemical", img: "assets/images/home/Solutions/Industries/Chemical & Petrochemical/istockphoto-932140864-612x612.jpg" },
    { name: "Water\nTreatment", img: "assets/images/home/Solutions/Industries/Water Treatment/water.jpg" },
    { name: "Transportation\nInfrastructure", img: "assets/images/home/Solutions/Industries/Transportation Infrastructure/bridge.jpg" },
    { name: "Warehousing\n& Logistics", img: "assets/images/home/Solutions/Industries/Warehousing & Logistics/warehousing.jpg" },
    { name: "Marine &\nOffshore", img: "assets/images/home/Solutions/Industries/Marine & Offshore/istockphoto-1317214769-612x612.jpg" },
    { name: "Industrial\nManufacturing", img: "assets/images/home/Solutions/Industries/Industrial Manufacturing/istockphoto-1352825159-612x612.jpg" },
    { name: "Renewable\nEnergy", img: "assets/images/home/Solutions/Industries/Renewable Energy/istockphoto-1337173750-612x612.jpg" },
  ];

  industries.forEach((ind, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.4 + row * 2.0;

    const d = imgData(ind.img);
    if (d) {
      s.addImage({ data: d, x, y, w: 2.6, h: 1.7, sizing: { type: "cover" }, rounding: true });
    } else {
      s.addShape(pptx.ShapeType.rect, { x, y, w: 2.6, h: 1.7, fill: { color: "1e293b" }, rectRadius: 0.08 });
    }
    s.addText(ind.name, { x: x + 2.7, y, w: 1.0, h: 1.7, fontSize: 11, bold: true, color: WHITE, fontFace: "Arial", valign: "middle", lineSpacingMultiple: 1.2 });
  });

  s.addText("www.wiberg-grating.com  |  wibergmetal.com", {
    x: 0.5, y: 7.0, w: 8, h: 0.35,
    fontSize: 9, color: MUTED, fontFace: "Arial",
  });
  s.addText("7", { x: 12.0, y: 7.0, w: 0.8, h: 0.35, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right" });
}

// ════════════════════════════════════════════
// SLIDE 8 — PROJECT CASES
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Project Experience", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND } });

  const projects = [
    { name: "Nuclear Power Plant", img: "assets/images/cases/project/nuclear-power-plant-project/nuclear-power-plant-20240315115933.jpg" },
    { name: "Polysilicon Plant", img: "assets/images/cases/project/polysilicon-project/xinjiang-polysilicon-aerial-view.jpg" },
    { name: "Data Center", img: "assets/images/cases/project/data-center/data-center-c68a06ed.jpg" },
    { name: "220kV Substation", img: "assets/images/cases/project/220v-substation/220v-substation-90139b8f.jpg" },
    { name: "Gulf Chemistry", img: "assets/images/cases/project/gulf-chemistry/gulf-chemistry-01.jpg" },
    { name: "Airport Platform", img: "assets/images/cases/project/airport/airport-bb07768d.jpg" },
  ];

  projects.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.4 + row * 2.9;
    const d = imgData(p.img);
    if (d) {
      s.addImage({ data: d, x, y, w: 3.7, h: 2.2, sizing: { type: "cover" }, rounding: true });
    } else {
      s.addShape(pptx.ShapeType.rect, { x, y, w: 3.7, h: 2.2, fill: { color: LIGHT_BG }, rectRadius: 0.08 });
    }
    s.addText(p.name, {
      x, y: y + 1.7, w: 3.7, h: 0.4,
      fontSize: 12, bold: true, color: WHITE, fontFace: "Arial", align: "center",
    });
  });

  footer(s, 8);
}

// ════════════════════════════════════════════
// SLIDE 9 — MANUFACTURING & QC
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: WHITE };

  s.addText("Manufacturing & Quality", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.05, w: 2, h: 0.05, fill: { color: BRAND } });

  const mfg = [
    { label: "Pressure Welding", img: "assets/images/about/production-process/production-process-welding.jpg" },
    { label: "CNC Cutting", img: "assets/images/about/production-process/production-equipment-cutting-machine-1.jpg" },
    { label: "Shaping", img: "assets/images/about/production-process/production-process-shaping.jpg" },
    { label: "Hot-Dip Galvanizing", img: "assets/images/about/production-process/galvanizing.jpg" },
    { label: "Quality Inspection", img: "assets/images/about/production-process/production-process-quality-inspection.jpg" },
    { label: "Packing & Shipping", img: "assets/images/about/production-process/production-process-packing.jpg" },
  ];

  mfg.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.35 + row * 2.9;
    const d = imgData(m.img);
    if (d) {
      s.addImage({ data: d, x, y, w: 3.7, h: 2.3, sizing: { type: "cover" }, rounding: true });
    }
    s.addShape(pptx.ShapeType.rect, {
      x, y: y + 1.75, w: 3.7, h: 0.55,
      fill: { color: NAVY, transparency: 30 },
    });
    s.addText(m.label, {
      x, y: y + 1.78, w: 3.7, h: 0.5,
      fontSize: 13, bold: true, color: WHITE, fontFace: "Arial", align: "center",
    });
  });

  footer(s, 9);
}

// ════════════════════════════════════════════
// SLIDE 10 — CONTACT
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: NAVY };

  s.addText("Let's Talk", {
    x: 0.8, y: 1.0, w: 11, h: 1.0,
    fontSize: 42, bold: true, color: WHITE, fontFace: "Arial",
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 2.0, w: 3, h: 0.06, fill: { color: ACCENT } });

  s.addText("Request a quotation — send product type, spacing, material, finish, panel size, quantity, and drawings.", {
    x: 0.8, y: 2.4, w: 8, h: 0.6,
    fontSize: 15, color: ACCENT, fontFace: "Arial", lineSpacingMultiple: 1.4,
  });

  const contacts = [
    ["Email", "sales@wiberg-grating.com"],
    ["Email", "info@wibergmetal.com"],
    ["Phone / WhatsApp", "+86 132 7317 7087"],
    ["Website", "www.wiberg-grating.com"],
    ["Website", "wibergmetal.com"],
    ["Hours", "Mon–Sat  09:00–18:00 (UTC+8)"],
  ];

  contacts.forEach(([label, value], i) => {
    const y = 3.4 + i * 0.48;
    s.addText(label, { x: 0.8, y, w: 2.5, h: 0.4, fontSize: 13, bold: true, color: ACCENT, fontFace: "Arial" });
    s.addText(value, { x: 3.5, y, w: 6, h: 0.4, fontSize: 13, color: WHITE, fontFace: "Arial" });
  });

  s.addText("ISO 9001:2015  ·  CE / EN 1090  ·  Green Enterprise  ·  SGS / BV Available", {
    x: 0.8, y: 6.5, w: 10, h: 0.35,
    fontSize: 11, color: MUTED, fontFace: "Arial",
  });

  const logoImg = imgData("assets/images/logo.png");
  if (logoImg) {
    s.addImage({ data: logoImg, x: 9.5, y: 1.0, w: 3.0, h: 0.83 });
  }

  s.addText("www.wiberg-grating.com  |  wibergmetal.com", {
    x: 0.5, y: 7.0, w: 8, h: 0.35,
    fontSize: 9, color: MUTED, fontFace: "Arial",
  });
  s.addText("10", { x: 12.0, y: 7.0, w: 0.8, h: 0.35, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right" });
}

// ── write file ──

const outDir = path.join(root, "downloads");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "Wiberg-Company-Brochure-2026.pptx");
await pptx.writeFile({ fileName: outPath });
console.log("✅ Wrote", outPath);
