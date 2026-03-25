# WIBERG Catalogs — Cursor 项目

## 给客户看的就四样（别绕弯）

| 册子 | 文件 | 干什么 |
|------|------|--------|
| **总册** | `general-brochure.html` | **约 10 页**：封面、公司简介、六大理由、产品（两页）、**应用领域**（6 行业）、**典型场景**（6 应用）、快速选型、合作流程、联系方式；插图用 `../assets/images/solutions/` 与 `../docs/assets/catalog/` |
| **产品册** | `product-catalog.html` | 各产品线介绍、规格、应用（可继续往厚了写） |
| **钢格板专册** | 已迁移到独立站 `downloads/steel-grating-catalog/index.html`；由 `node build-site-steel-grating.mjs` 从 `master-data1.js` 生成 |
| **技术册** | `technical-manual.html` | 设计假定、公式说明、**荷载与挠度表**、安装与标准 |
| **询价册** | `rfq-inquiry.html` | **给客户填的询价单**，打印或填 PDF 回传 |

**单页 datasheet**（`datasheets/ds01`…`ds09`）是某一产品的「一页说明」，可随邮件附在询价前后，不算单独「一册」。

**`master-data1.js`** 只是后台数字库，用来生成技术册里的表、对齐 datasheet；**客户不需要看这个文件。**

打开方式：用浏览器直接打开上表中的 `.html` 即可；需要 PDF 时用 `node export-pdf.js`（需先 `npm install puppeteer`）。

---

## 主数据：`master-data1.js`

单一源码文件（ES module），与 `CURSOR-INSTRUCTIONS.md` 中的 Word/PDF 来源一致，内含：

| 导出常量 | 用途（对应 HTML） |
|----------|-------------------|
| `SPANS_MM`, `TABLE_E1_30MM` … `TABLE_E3_20MM`, `TABLE_E4_IBAR_30MM`, `TABLE_E5_IBAR_40MM`, `TABLE_E6_HEAVY` | `technical-manual.html` 荷载表、产品目录荷载页（U 数组单位为 **0.01 kN/m²**，显示时 ÷100） |
| `VULCRAFT_*`, `MCNICHOLS_*`, `WEBFORGE_*` | 对照、英制跨度、快速选型 |
| `GT_GUTTER_COVERS`, `GU_GUTTER_COVERS`, `GM_MANHOLE_COVERS`, `COVER_LOAD_CLASSES` | `datasheets/ds05-trench-covers.html` |
| `STAIR_TREAD_TYPES`, `YBT_TREAD_*`, `VULCRAFT_TREAD_*` | `datasheets/ds04-stair-treads.html` |
| `FIXING_CLIPS`, `ACCESSORIES` | `datasheets/ds08-accessories.html` |
| `FRP_*`, `WEBFORGE_FRP`, `MCNICHOLS_FRP_*` | `datasheets/ds09-frp.html` |
| `MATERIAL_PROPERTIES`, `lookupLoad`, `lookupDeflection` | 技术手册设计假定与工具函数 |

在 Node 中可用 `import './master-data1.js'` 读入并生成表格 HTML（或导出 CSV）。**荷载表列数**：`SPANS_MM` 为 15 个跨度（200–3000 mm，步长 200）；若打印页放不下，可取子集（例如 600–3000 每 200 mm）。

### 重新生成 `technical-manual.html`

模板拆分为 `tm-before.html`（封面—第 10 页说明）与 `tm-after.html`（锯齿/铝、安装、清单、标准、术语、封底）。荷载横向页由脚本注入。

```bash
cd wiberg-catalogs1
node build-master-html.mjs
node build-site-steel-grating.mjs   # → ../downloads/steel-grating-catalog/index.html
```

（Windows 下需 Node 18+；脚本使用 `pathToFileURL` 导入 ES 模块。）

---

## 项目结构

```
wiberg-catalogs1/
├── README.md
├── shared.css
├── general-brochure.html        ← 总册
├── build-site-steel-grating.mjs ← 生成独立站钢格板专册到 ../downloads/steel-grating-catalog/
├── product-catalog.html         ← 产品册
├── technical-manual.html        ← 技术册
├── rfq-inquiry.html             ← 询价册（客户填写）
├── datasheets/
│   ├── ds01-press-welded.html   ← DS-01: Press-Welded Steel Grating
│   ├── ds02-press-locked.html   ← DS-02: Press-Locked Steel Grating
│   ├── ds03-heavy-duty.html     ← DS-03: Heavy-Duty Welded Grating
│   ├── ds04-stair-treads.html   ← DS-04: Stair Treads
│   ├── ds05-trench-covers.html  ← DS-05: Trench & Drain Covers
│   ├── ds06-aluminum.html       ← DS-06: Aluminum Grating
│   ├── ds07-stainless.html      ← DS-07: Stainless Steel Grating
│   ├── ds08-accessories.html    ← DS-08: Fixing Clips & Accessories
│   └── ds09-frp.html            ← DS-09: FRP Grating
└── assets/
    ├── logo-dark.png            ← 深色logo（放在浅色背景上）
    ├── logo-white.png           ← 白色logo（放在深色背景上）
    └── photos/                  ← 产品图、工厂照片等
        ├── press-welded.jpg
        ├── press-locked.jpg
        ├── stair-tread.jpg
        ├── trench-cover.jpg
        ├── frp-grating.jpg
        ├── factory-line.jpg
        ├── factory-galvanizing.jpg
        └── ...
```

## 使用方法

### 1. 预览
直接用浏览器打开任何一个 HTML 文件即可预览。
推荐用 VS Code / Cursor 的 Live Server 插件实时预览。

### 2. 编辑内容
在 Cursor 中打开对应 HTML 文件，直接修改文字/数据/图片路径。
所有占位符都标注为 `<!-- PLACEHOLDER: xxx -->` 方便搜索替换。

### 3. 替换图片
把你的产品图放进 `assets/photos/` 文件夹，然后替换 HTML 中的图片路径。
占位图用灰色虚线框表示，搜索 `placeholder-img` 类名找到所有占位。

### 4. 导出 PDF
方法A（最简单）：浏览器打开 → Ctrl+P → 保存为PDF → 勾选"背景图形"
方法B（推荐）：用 Puppeteer 脚本自动导出（见下方）

### 5. Puppeteer 自动导出（可选）
```bash
npm install puppeteer
node export-pdf.js
```
会自动把所有 HTML 导出为同名 PDF 文件。

## 品牌设定

| 用途 | 色号 | CSS变量 |
|---|---|---|
| 主色 Navy | #1B3A5C | --c-navy |
| 副色 Blue | #2E75B6 | --c-blue |
| 强调 Orange | #E67E22 | --c-accent |
| 浅灰底 | #F2F2F2 | --c-light |
| 深灰文字 | #4A4A4A | --c-dark |

字体：Inter（标题）+ Inter（正文）— Google Fonts 免费，等同于 Arial/Helvetica 但更现代。

## 设计原则

- 每页 A4 尺寸（210mm × 297mm）
- 打印时自动分页（CSS page-break）
- 表头 Navy 底白字，数据行灰白交替
- 占位图用虚线框 + 灰色说明文字
- 所有内容数据来自之前生成的 Word 文件
