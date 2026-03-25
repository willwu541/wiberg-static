# 给 Cursor 的完整工作指令

> 把这个文件放到项目根目录，然后在 Cursor 中打开，对它说：
> "读一下这个指令文件，然后按步骤执行。"

---

## 项目背景

你正在为一家叫 **WIBERG** 的中国钢格板制造商制作4份英文catalog：
1. `general-brochure.html` — 8-10页销售手册（已基本完成）
2. `product-catalog.html` — 30-40页产品目录（结构已搭好，需要填充真实数据）
3. `technical-manual.html` — 20+页技术手册（结构已搭好，需要填充真实数据）
4. `datasheets/ds01-ds09` — 9份单页数据表（ds01-ds02已完成，ds03-09需填充真实数据）

**样式系统已就绪**：`shared.css` 定义了品牌色、表格样式、页面布局、打印CSS。不要修改 shared.css，直接用里面的 class。

---

## 你的参考资料（项目文件夹中已有）

这些是真实的行业目录和标准文件，你需要从中提取数据：

### 主要数据来源（按优先级）

| 文件 | 用途 | 提取什么 |
|---|---|---|
| `Vulcraft_Grating_Manual_Aug_23.docx` | 美国Nucor/Vulcraft钢格板手册（最新版） | 产品类型、荷载表格式、安装指南、规格checklist、截面详图描述 |
| `Vulcraft_Grating_Manual_JAN21.docx` | Vulcraft旧版（对照用） | 同上，交叉验证 |
| `McNICHOLS-2018-Gratings-Catalog_Web.docx` | 美国McNICHOLS格栅目录 | 产品分类方式、How to Order/Specify、型号表格式、FRP参数 |
| `2020-IKG-Catalog.docx` | 美国IKG格栅目录 | 焊接/压锁/铝合金型号、固定夹类型、术语表 |
| `meisergratingcatalogue.pdf` | 德国MEISER格栅目录（72页） | 欧式压锁格栅参数、固定夹系统、楼梯踏步板、安全标准 |
| `meiserpresentation.pdf` | MEISER公司介绍 | 产品类型描述（press-welded vs press-locked vs louvre） |
| `Lichtgitter-Overview.docx` | 德国Lichtgitter格栅概览 | 压焊/压锁/特殊格栅技术数据 |
| `webforge-access-03-2025.docx` | 澳洲Webforge格栅目录 | 荷载表（kPa格式）、楼梯踏步板尺寸、固定夹规格 |
| `mbg_531-24_ansi_approved.docx` | NAAMM MBG 531-24 标准 | 标准标注系统、公差、荷载表公式 |
| `mbg_534-24_final.docx` | NAAMM MBG 534-24 工程设计手册 | 设计公式、计算示例、车辆荷载计算 |
| `原始文件.docx` | YB/T 4001.1 中国标准翻译 | 沟盖板型号(GT/GU/GM)、荷载分级(T-2到T-25)、挠度公式 |
| `SAFEGRID-BALL-PROOF-FLYER.docx` | 英国SafeGrid防坠物格栅 | ball-proof概念、20mm/35mm球测试 |

### 图片/Logo 来源
- `assets/` 文件夹中的 logo 文件和产品照片
- 如果有的话，优先使用 WIBERG 自己的产品图
- 没有的位置保留 `placeholder-img`，不要用其他品牌的图

---

## 执行步骤

### 步骤 1：完成 Datasheets（ds03-ds09）

**目标**：让每张 datasheet 的数据与参考资料一致，格式与 ds01 完全统一。

**对每个 ds03-ds09 执行以下操作：**

1. 打开对应的 HTML 文件
2. 参照 `ds01-press-welded.html` 的完整结构（这是标准模板）
3. 从参考资料中提取对应产品的真实规格数据，填入 `<table class="spec-tbl">` 
4. 从参考资料中提取型号/尺寸表数据，填入底部的 models table
5. 确保 How to Specify 示例正确
6. 如果 `assets/` 中有对应产品的图片，替换 `placeholder-img` 为 `<img>` 标签

**各 DS 的数据来源指引：**

**DS-03 Heavy-Duty：**
- 规格：从 `Vulcraft_Grating_Manual_Aug_23.docx` 的 "HEAVY DUTY (HD)" 章节提取 bar sizes, thicknesses
- 车辆荷载：从 `mbg_534-24_final.docx` 提取 AASHTO H-10 到 HS-25 分级
- 中国标准荷载：从 `原始文件.docx` 提取 T-2 到 T-25 荷载分级表（Table B.1）
- How to Specify 示例：`HD-30-100, 50×6, Q235B, Serrated, HDG`

**DS-04 Stair Treads：**
- 类型 T1-T6：从 `webforge-access-03-2025.docx` 的 "Stair Treads" 章节（T1=Welded No Nosing... T6=Bolted Abrasive Nosing）
- 尺寸表：从 `webforge-access-03-2025.docx` 的 tread width/stringer holes/max span 表格
- Nosing 类型：从 `McNICHOLS-2018-Gratings-Catalog_Web.docx` 的 stair treads 页面
- End plate 详图描述：从 `Vulcraft_Grating_Manual_Aug_23.docx` 的 tread 章节
- How to Specify：`Tread T4, W-30-100, 30×5, 245mm wide, 1200mm span, Checkered Plate Nosing, HDG`

**DS-05 Trench Covers：**
- GT/GU/GM 类型：从 `原始文件.docx` 的附录 B（B.1 GT型, B.2 GU型, B.3 GM型）
- GT 标准型号尺寸表：从 `原始文件.docx` Table B.2（GT100-20 到 GT400-50，含尺寸、重量、支撑角钢）
- 荷载分级：从 `原始文件.docx` Table B.1（T-2 到 T-25）
- How to Specify：`GT200-32, T-6 rated, HDG, with L56×36×4 support angle`

**DS-06 Aluminum：**
- 规格：从 `2020-IKG-Catalog.docx` 的 "Swage Locked Aluminum" 章节（6063-T6, bar shapes IB/BS）
- 荷载表：从 `mbg_531-24_ansi_approved.docx` 的 aluminum load table（Type P-19）
- 也参考 `webforge-access-03-2025.docx` 的铝合金部分
- How to Specify：`P-19-4, 32×5, 6063-T6, Plain, Mill Finish`

**DS-07 Stainless Steel：**
- 材质牌号：304 / 304L / 316 / 316L，从 `2020-IKG-Catalog.docx` 的 Materials 章节
- 适用格栅类型：press-welded 和 press-locked 均可
- 应用场景：从 `meiserpresentation.pdf` 提取（chemical, offshore, food, pharmaceutical）
- How to Specify：`W-30-100, 30×5, SS 316L, Serrated, Mill Finish`

**DS-08 Accessories：**
- Clip 类型：从 `2020-IKG-Catalog.docx` 的 "Fastening Methods" 章节（Saddle Clip, G-Clip, Z-Clip, Hilti, Plate Fasteners, Weld）
- 也参照 `meisergratingcatalogue.pdf` 第54-59页的 Fixing Clips 章节（Safety Clamp C/D, Head Bolt Fastener, XMGR）
- 也参照 `webforge-access-03-2025.docx` 的 Fixing Clips 页面
- 配件：Banding Bar, Kick Plate, Safety Chain, Hinge（从 `meisergratingcatalogue.pdf` 术语部分）
- Clip frequency：从 `webforge-access-03-2025.docx`："Nominal 4 per panel, or 4 per m², whichever is greater"

**DS-09 FRP：**
- Molded vs Pultruded：从 `McNICHOLS-2018-Gratings-Catalog_Web.docx` 的 "FIBERGLASS GRATING" 章节
- 树脂类型（SPF/SVF/SGF/SPH）：从 McNICHOLS 的 Resin Characteristics 表
- Grid sizes, heights, surfaces：从 McNICHOLS 的 product specifications 表
- Panel sizes, open area：从 McNICHOLS 的 MS-R-100, MS-R-150 等产品数据

---

### 步骤 2：完成 Product Catalog

**目标**：把 `product-catalog.html` 中的所有 TODO 填充完毕，数据来自参考资料。

**按页面顺序处理：**

1. **第3页 WHY WIBERG** — 内容已在 `general-brochure.html` 中写好，直接复制过来
2. **第4-5页 Industries** — 同上，从 brochure 复制
3. **第6页 HOW TO CHOOSE** — 选型表12行，从 brochure 复制
4. **第7页 HOW TO SPECIFY** — 标注系统从 `mbg_531-24_ansi_approved.docx` 第6页 "STANDARD GRATINGS" 提取（W-19-4, P-19-4, R-18-7 的含义）。Checklist 从 `Vulcraft_Grating_Manual_Aug_23.docx` 的 "Specification/Detailing Checklist" 提取
5. **第8-16页 Press-Welded** — 
   - 章节封面（Type A页）：大图+标题
   - 应用+优势（Type B）：从 Vulcraft 的 "WHY GRATING?" 和 "APPLICATIONS" 提取
   - 变体4种（Type D）：Standard/Close Mesh/ADA/Heavy Traffic，从 Vulcraft 的 SD/CM/ADA/Heel Friendly 提取
   - 技术规格（Type C）：从所有参考资料综合，以 Wiberg 实际能做的为准
   - 型号表：综合 Vulcraft + Webforge + IKG 的型号命名方式，用 Wiberg 的WA-命名
   - **荷载表3页（landscape）**：从 `webforge-access-03-2025.docx` 的 Steel Load Table 提取（这个有kPa格式，最直接可用）。如果 Webforge 数据不够，用 Vulcraft + MBG 531 的数据交叉验证

6. **第17-18页 Press-Locked** — 从 `meisergratingcatalogue.pdf` 提取（press locked grating, mesh widths, bar sizes）+ `Lichtgitter-Overview.docx` + `2020-IKG-Catalog.docx` 的 Pressure Locked 章节
7. **第19页 Heavy-Duty** — 从 Vulcraft HD 章节 + `mbg_534-24_final.docx` 的车辆荷载计算
8. **第20-21页 Stair Treads** — 从 Webforge + McNICHOLS + IKG 的 treads 数据
9. **第22页 Trench Covers** — 从 `原始文件.docx` 附录B
10. **第23-24页 FRP** — 从 McNICHOLS Fiberglass 章节
11. **第25页 Accessories** — 从 IKG + MEISER + Webforge 的 clips 数据
12. **第26-31页 技术层** — Materials, Installation, Fabrication, Standards, Glossary — 综合所有参考资料

**关键注意事项：**
- 所有荷载表数据标注 "For reference only. Consult Wiberg engineering for project-specific calculations."
- 不要直接复制任何品牌名（McNICHOLS, Vulcraft, MEISER等）到 Wiberg 的 catalog 中
- 所有数据要转换成 Wiberg 的产品命名体系（WA-xxx 系列）
- 公制为主（mm, kPa, kg/m²），括号内附英制参考

---

### 步骤 3：完成 Technical Manual

**目标**：把 `technical-manual.html` 填充完毕，这是纯技术文件。

1. **Design Basis 表**：从 `mbg_534-24_final.docx` 第一部分提取设计假定（F=20,000 psi for A36, E=29,000,000 psi）。转换成公制（F=140 MPa conservative / 171 MPa for Q235B, E=206,000 MPa）
2. **设计公式**：从 `mbg_534-24_final.docx` 逐个提取：
   - Section properties: K, Sg, Ig
   - Uniform load: M = F×Sg/12, U = 96M/L²
   - Concentrated load: C = 4M/L
   - Vehicular: partially distributed load formulas（Example 7, 8 in MBG 534）
3. **计算示例**：从 `mbg_534-24_final.docx` 的 Example 1（W-19-4 uniform/concentrated）和 Example 7（vehicular partial distribution）改编成 Wiberg 规格
4. **标注系统**：从 `mbg_531-24_ansi_approved.docx` 的 Standard Gratings 页面
5. **荷载表**（landscape 页面）：
   - **Table 1-4（钢）**：从 `webforge-access-03-2025.docx` 的 Steel Load Table 提取。Webforge 的表格格式直接是 kPa + mm 跨度，可以直接用。如果缺少某些规格，从 Vulcraft 的 imperial 表格转换
   - **Table 5（挠度）**：从 Webforge 的挠度数据行提取
   - **Table 6（锯齿因子）**：从 `2020-IKG-Catalog.docx` 的 "CONVERSION DATA: SERRATED GRATING" 表
   - **Table 7（铝合金）**：从 `mbg_531-24_ansi_approved.docx` 的 aluminum load table
6. **安装指南**：综合 Vulcraft 的 "SAFE INSTALLATION" + Webforge 的 span direction 图 + MEISER 的 fixing clips
7. **规格checklist**：从 Vulcraft 的 "Specification/Detailing Checklist"
8. **标准列表**：列出所有参考文件的标准编号和全称
9. **术语表**：综合 IKG 的 "GLOSSARY OF TERMS" + MEISER 的 "Technical terms" + Vulcraft 的术语

---

### 步骤 4：替换图片

扫描 `assets/` 文件夹，找到所有可用的 logo 和产品图。

对每个 HTML 文件：
1. 搜索所有 `class="placeholder-img"` 的元素
2. 如果 `assets/` 中有对应的图片，替换为 `<img src="assets/xxx.jpg" class="real-img" alt="描述">`
3. 如果没有对应图片，保留 placeholder 不变

Logo 替换：
- 搜索所有 `<div class="brand">WIBERG</div>` 
- 如果有 logo 文件，替换为 `<img src="assets/logo-dark.png" height="28" alt="WIBERG">`
- 封面和封底用白色版 logo（如果有）

---

### 步骤 5：最终检查

完成所有填充后，对每个 HTML 文件执行以下检查：

1. 浏览器打开 → 检查是否有明显的排版错误
2. 搜索 `TODO` → 确认所有 TODO 已处理
3. 搜索 `Value 1` / `Parameter 1` → 确认没有遗漏的占位文字
4. 搜索 `placeholder-img` → 确认所有有图的位置已替换
5. Ctrl+P → 检查打印预览，确认分页正确
6. 确认所有页面的 page-header 和 page-footer 一致
7. 确认没有出现其他品牌名（McNICHOLS, Vulcraft, MEISER, IKG, Webforge 等）

---

## 重要规则

1. **不要复制其他品牌的原文**。提取数据和参数，用 Wiberg 的语言重写。
2. **所有荷载数据加免责声明**："Values shown are for reference and design selection only. Contact Wiberg engineering for project-specific calculations."
3. **品牌色严格遵守**：Navy #1B3A5C, Blue #2E75B6, Orange #E67E22, Light gray #F2F2F2
4. **表格格式统一**：用 shared.css 中定义的 `.tbl` / `.spec-tbl` / `.tbl-compact` 类
5. **不要修改 shared.css**。如果需要页面特有样式，用 `<style>` 标签写在该 HTML 的 `<head>` 中
6. **公制优先**：mm, kPa, kg/m², °C。括号内附英制参考值。
7. **页面用 `<div class="page">` 包裹**，一个 div 一页 A4。横版用 `<div class="page landscape">`。
