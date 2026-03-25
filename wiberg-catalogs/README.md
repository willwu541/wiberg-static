# WIBERG Catalogs — Cursor 项目

## 项目结构

```
wiberg-catalogs/
├── README.md                    ← 你在看的这个
├── shared.css                   ← 所有文件共用的样式（品牌色、表格、打印设置）
├── general-brochure.html        ← 文件1：General Brochure（8-10页）
├── product-catalog.html         ← 文件2：Product Catalog（30-40页）
├── technical-manual.html        ← 文件3：Technical Manual（20+页）
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
