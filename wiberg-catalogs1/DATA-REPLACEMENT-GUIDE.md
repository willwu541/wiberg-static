# WIBERG 数据替换指南
# 对照此表，用Word文件中的真实数据替换HTML中的示意数据

## 状态总览

> **主数据文件：** `wiberg-catalogs1/master-data1.js` 已包含从 YB/T、NAAMM、Vulcraft、Webforge、McNICHOLS、`原始文件.docx` 等整理后的 **结构化数据**（荷载数组、GT/GU/GM 沟盖、楼梯、FRP、夹具等）。优先以此为准同步 HTML；若与 `Wiberg-Datasheets-2026.docx` 有出入，以 Word 盖章版为准并回写该 JS。
>
> **注意：** 网站根目录 `assets/files/*.pdf` 若为占位 PDF，仍不能替代上述数据。

| 文件 | 页数 | 结构 | 数据 | 待办 |
|---|---|---|---|---|
| general-brochure.html | 10页 | ✅ 完成 | ✅ 真实 | 只需替换图片 |
| product-catalog.html | 32页 | ✅ 完成 | ✅ 主数据摘要已嵌入第3–4页 | 其余层仍可对照 Word 扩写 |
| technical-manual.html | 28页 | ✅ 完成 | ✅ 由 `build-master-html.mjs` 自 `master-data1.js` 生成荷载表 | 改数据后请重新运行 node 脚本 |
| ds01-press-welded.html | 1页 | ✅ 完成 | ✅ 真实 | 只需替换图片 |
| ds02-press-locked.html | 1页 | ✅ 完成 | ✅ 真实 | 只需替换图片 |
| ds03-ds09 | 各1页（DS-05 为2页） | ✅ 完成 | ✅ 已与 `master-data1.js` 对齐 | 以 JS 为准；Word 盖章版冲突时回写 JS |

---

## 一、Datasheets 数据替换

### 数据来源：`Wiberg-Datasheets-2026.docx`

在Cursor中操作：打开Word文件 → 找到对应DS编号 → 复制表格数据 → 粘贴到HTML对应位置

| HTML文件 | Word中的章节 | 需要替换的内容 |
|---|---|---|
| ds03-heavy-duty.html | DS-03 Rev.A | spec-tbl 的9行规格 + 车辆荷载表5行 |
| ds04-stair-treads.html | DS-04 Rev.A | spec-tbl 的8行规格 + T1-T6类型表 + 尺寸表8行 |
| ds05-trench-covers.html | DS-05 Rev.A | spec-tbl 的7行规格 + GT型号表6行 + 荷载分级5行 |
| ds06-aluminum.html | DS-06 Rev.A | spec-tbl 的12行规格 + 荷载表7行×8列 |
| ds07-stainless.html | DS-07 Rev.A | spec-tbl 的9行规格 + 304/316L选型2行 |
| ds08-accessories.html | DS-08 Rev.A | clip表7行 + accessories表7行 |
| ds09-frp.html | DS-09 Rev.A | Molded规格11行 + Pultruded表9行 + 树脂选型4行 |

### 替换方法（给Cursor的指令）：

```
打开 Wiberg-Datasheets-2026.docx，找到 DS-03 Heavy-Duty 章节。
把里面的 Specifications 表格数据替换到 ds03-heavy-duty.html 的 <table class="spec-tbl"> 中。
把 Vehicular Load Classification 表格替换到底部的 models table 中。
保持 HTML 结构不变，只改 <td> 里的文字内容。
```

---

## 二、Product Catalog 数据替换

### 数据来源：`Wiberg-Product-Catalog-2026-v3.docx`

| 页面 | 需要替换的数据 | Word中的位置 |
|---|---|---|
| 第6页 HOW TO CHOOSE | 选型决策表12行 | Word: "HOW TO CHOOSE YOUR GRATING" 章节 |
| 第11页 Press-Welded Specs | 技术规格表12行 | Word: "Technical Specifications — Press-Welded" |
| 第12页 Press-Welded Models | 型号表16行×10列 | Word: "Available Models" → press-welded section |
| 第14-16页 Load Tables | 荷载表数据（3张表） | 见下方"荷载表数据" |
| 第17页 Press-Locked Specs | 规格表9行 + 型号表9行 | Word: Press-Locked sections |
| 第19页 Heavy-Duty | 规格表 + 车辆荷载表 | Word: Heavy-Duty section |
| 第20-21页 Stair Treads | T1-T6 + nosing表 + 尺寸表 | Word: Stair Treads section |
| 第22页 Trench Covers | 类型表 + GT型号表 + 荷载表 | Word: Trench Covers section |
| 第23-24页 FRP | Molded/Pultruded对比表 | Word: FRP Grating section |
| 第25页 Accessories | clip表 + accessories表 | Word: Fixing Clips section |
| 第26页 Materials | 3种材质对比 + 5种表面处理 | Word: Materials & Surface Treatment |
| 第30页 Standards | 12项标准 + 5项认证 | Word: Standards & Certifications |
| 第31页 Glossary | 16个术语 | Word: Glossary |

---

## 三、Technical Manual 数据替换

### 数据来源：`Wiberg-Technical-Manual-2026.docx`

| 页面 | 需要替换的数据 | Word中的位置 |
|---|---|---|
| 第3-4页 Design Basis | 参数表9行 | Word: Introduction → design basis table |
| 第5-7页 Formulas | 公式文本 | Word: Design Formulas 章节（公式是文本，直接copy） |
| 第8-9页 Sample Calcs | 3个计算示例 | Word: Sample Calculations |
| 第10页 Marking System | 标注表 + 公制英制对照 | Word: Standard Marking System |
| **第11页 Load Table 1** | **30mm pitch, 12×12 数据** | **Word: Table 1 (d30_100 数组)** |
| **第12页 Load Table 2** | **40mm pitch, 9×12 数据** | **Word: Table 2 (d40_100 数组)** |
| **第13页 Load Table 3** | **20mm pitch, 6×12 数据** | **Word: Table 3 (d20_50 数组)** |
| **第14页 Load Table 4** | **30mm pitch 50mm cross, 6×12** | **Word: Table 4 (d30_50 数组)** |
| **第15页 Deflection** | **8×12 挠度值** | **Word: Table 5 (defl30 数组)** |
| **第16页 Serrated Factors** | **12种规格的转换因子** | **Word: Table 6** |
| **第17页 Aluminum** | **7×12 铝合金荷载** | **Word: Table 7 (dAlum 数组)** |
| 第18-19页 Installation | 10条安装要求 + 3种固定方式 | Word: Installation Guidelines |
| 第20页 Checklist | 13+6项 | Word: Specification Checklist |
| 第21页 Standards | 17项标准 | Word: Standards Reference |
| 第22页 Glossary | 26个符号/术语 | Word: Glossary & Notation |

---

## 四、荷载表数据（最关键的数据块）

**权威源：** `wiberg-catalogs1/master-data1.js`（YB/T 附录 E 等）。

- **U**（均布 kN/m²）与 **C**（线荷载 kN/m）在 JS 内为 **×100** 存储，HTML 中已 ÷100 显示（见 `README.md`）。
- **跨度轴：** `SPANS_MM` = 200…3000 mm，步长 200（共 15 列）。

### 与旧 `technical.js` 命名对照（若你仍有老文件）

```
TABLE_E1_30MM   → 30 mm 承载间距，U=50 mm 横杆，C=100 mm 横杆
TABLE_E2_40MM   → 40 mm 承载间距
TABLE_E3_20MM   → 20 mm 承载间距（密肋）
TABLE_E6_HEAVY  → 重型规格（8×8 横杆）
D_U / D_C       → 与 U/C 对应的挠度 (mm)，已在 master-data1 同条目中
```

### 更新 Technical Manual 荷载页

在本目录执行：

```bash
node build-master-html.mjs
```

会读取 `tm-before.html` + `tm-after.html`，注入生成的 10 个横向荷载/挠度页，输出 **`technical-manual.html`**。

---

## 五、图片替换清单

搜索所有 HTML 文件中的 `placeholder-img` 类名，逐个替换：

### 必须替换（产品图 — 你应该有的）
- [ ] 压焊格栅板 close-up → 替换所有 "Press-Welded Grating Panel" 占位
- [ ] 压锁格栅板 close-up → 替换所有 "Press-Locked Grating" 占位  
- [ ] 重型格栅板 → 替换 "Heavy-Duty Grating" 占位
- [ ] 楼梯踏步板 → 替换 "Stair Tread" 占位
- [ ] 沟盖板 → 替换 "Trench Cover" 占位
- [ ] FRP格栅板（绿/黄） → 替换 "FRP Grating" 占位
- [ ] 固定夹集合 → 替换 "Clips & Accessories" 占位
- [ ] 工厂生产线 → 替换 "Factory" 占位
- [ ] Wiberg logo → 替换所有 "WIBERG" 文字logo

### 可选替换（行业应用图 — 可用Stock图或Canva素材）
- [ ] 石油平台/炼厂 → "Oil & Gas Photo"
- [ ] 电厂 → "Power Plant Photo"  
- [ ] 数据中心 → "Data Center Photo"
- [ ] 水处理厂 → "Water Treatment Photo"
- [ ] 市政道路排水 → "Infrastructure Photo"
- [ ] 仓库/物流中心 → "Warehouse Photo"

### 需要制作的（截面图/详图）
- [ ] 压焊格栅板截面图（bearing bar + twisted cross bar）
- [ ] 压锁格栅板锁扣详图（dovetail slot）
- [ ] 楼梯踏步板端板详图（dimensions A/B/C）
- [ ] 格栅板间距示意图（30mm/20mm/40mm pitch）
- [ ] 安装截面详图（边缘截面、开孔、支撑）
- [ ] QR码（链接到官网）

这些截面图可以：
1. 用CAD导出PNG/SVG
2. 在PPT里画简单示意图然后截图
3. 让Cursor用HTML/CSS画简单的示意图
4. 找Fiverr/淘宝外包画（$20-50一套）

---

## 六、给Cursor的批量替换指令模板

### 替换单个Datasheet：
```
请打开 ds05-trench-covers.html。
参照 ds01-press-welded.html 的完整格式。
用以下数据替换 spec-tbl 中的占位内容：

Construction: Press-welded steel grating
Material: Carbon Steel, Hot-Dip Galvanized
Bar Pitch: 30–50 mm (50 mm for manhole covers)
Load Classes: T-2 (8 kN) to T-25 (100 kN) per YB/T 4001
...（粘贴Word中的数据）

然后用以下数据替换底部的型号表：
GT100-20, 100, 160×995×20, 4.0, L40×25×5, T-2
GT150-25, 150, 214×995×25, 10.2, L40×28×3, T-6
...（粘贴Word中的数据）
```

### 替换荷载表：
```
请打开 technical-manual.html 的第11页（Table 1: 30mm pitch）。
用以下数据替换表格中的所有数字：

25×3, ~18, 47.3, 30.3, 21.0, 15.4, 11.8, 9.3, 7.6, 4.5, 2.9, 2.0, 1.4, 1.1
25×5, ~26, 83.6, 53.5, 37.2, 27.3, 20.9, 16.5, 13.4, 7.9, 5.2, 3.5, 2.5, 1.9
...（粘贴完整数组）

每行一个 <tr>，第一列bar size，第二列weight，后面12列是spans 600-3000mm的kPa值。
```

---

## 完成后的检查清单

- [ ] 所有 `<!-- TODO -->` 注释已处理或删除
- [ ] 所有 `placeholder-img` 已替换为真实图片或标注为"pending"
- [ ] 所有荷载表数字与 `master-data1.js` 一致（技术手册请用 `node build-master-html.mjs` 重生成）
- [ ] 品牌色统一（Navy #1B3A5C / Blue #2E75B6 / Orange #E67E22）
- [ ] 浏览器 Ctrl+P 预览每个文件的打印效果
- [ ] 页码正确
- [ ] 联系信息正确（邮箱、电话、网址）
- [ ] 没有遗漏的 Lorem ipsum 或 "Value 1" 之类的占位文字
