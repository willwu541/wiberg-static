# -*- coding: utf-8 -*-
"""SEO-Friendly Rename Script for E-commerce Images"""
import os
import re

BASE = r"E:\独立站用图片"

FOLDER_MAP = {
    "I型钢格板": "i-beam-steel-grating",
    "产品实拍图1000px": "product-photos-1000px",
    "复合钢格板-1000": "composite-steel-grating-1000",
    "平台钢格板-1000": "platform-steel-grating-1000",
    "异型钢格板-1000": "shaped-steel-grating-1000",
    "踏步板-1000": "stair-tread-1000",
    "齿形钢格板-1000": "serrated-steel-grating-1000",
    "复合钢格板": "composite-steel-grating",
    "平台钢格板": "platform-steel-grating",
    "插接钢格板": "interlocking-steel-grating",
    "楼梯踏步板": "stair-tread-plate",
    "楼梯踏步板1": "stair-tread-plate-v2",
    "沟盖板": "trench-grating",
    "渗锌钢格板": "sherardized-steel-grating",
    "玻璃格栅板": "fiberglass-grating",
    "配件": "accessories",
    "黑件齿形钢格板": "black-serrated-steel-grating",
    "齿形钢格板": "serrated-steel-grating",
    "220V变电站": "220v-substation",
    "丙烷脱氢项目": "propane-dehydrogenation-project",
    "凯赛生物科技": "cathay-biotech",
    "快递平台": "express-platform",
    "数据中心": "data-center",
    "新疆大全多晶硅": "xinjiang-polysilicon-project",
    "有色多晶硅项目": "colored-polysilicon-project",
    "机场": "airport",
    "林场": "forest-farm",
    "林场1": "forest-farm-v2",
    "核电站项目": "nuclear-power-plant-project",
    "海湾化学": "gulf-chemistry",
    "煤场管道项目": "coal-yard-pipeline-project",
    "煤基合成油": "coal-to-liquid",
    "电厂": "power-plant",
    "石油化工丙烷脱氢及环氧丙烷项目": "petrochemical-propane-dehydrogenation-project",
    "粮食物流园": "grain-logistics-park",
    "聚苯乙烯项目": "polystyrene-project",
    "高端有机胺项目": "high-end-organic-amine-project",
    "产品图": "product-images",
    "产品应用场景图": "product-application-scenarios",
    "案例图片": "case-studies",
    "生产过程图": "production-process",
}

FILE_MAP = {
    "主图.jpg": "main-product-image.jpg",
    "主图.png": "main-product-image.png",
    "产品.jpg": "product-overview.jpg",
    "侧视图.jpg": "side-view.jpg",
    "侧视图1.jpg": "side-view-1.jpg",
    "侧视图2.jpg": "side-view-2.jpg",
    "侧视图3.jpg": "side-view-3.jpg",
    "侧视图-1.jpg": "side-view-1.jpg",
    "俯视图.jpg": "top-view.jpg",
    "俯视图1.jpg": "top-view-1.jpg",
    "俯视图2.jpg": "top-view-2.jpg",
    "俯视图3.jpg": "top-view-3.jpg",
    "俯视图-1.jpg": "top-view-1.jpg",
    "俯视图-2.jpg": "top-view-2.jpg",
    "俯视图1-1.jpg": "top-view-detail-1.jpg",
    "斜侧视图.jpg": "angled-side-view.jpg",
    "斜侧视图1.jpg": "angled-side-view-1.jpg",
    "斜侧视图2.jpg": "angled-side-view-2.jpg",
    "斜侧视图3.jpg": "angled-side-view-3.jpg",
    "斜俯视图.jpg": "angled-top-view.jpg",
    "焊点.jpg": "weld-point-detail.jpg",
    "焊点1.jpg": "weld-point-detail-1.jpg",
    "背面.jpg": "back-view.jpg",
    "切面对比.jpg": "cross-section-comparison.jpg",
    "复合板花纹.jpg": "composite-pattern-detail.jpg",
    "对比背面.jpg": "back-comparison.jpg",
    "俯视侧视.jpg": "top-side-view.jpg",
    "侧面.jpg": "side-view.jpg",
    "侧面1.jpg": "side-view-1.jpg",
    "卡扣.jpg": "clamp-buckle.jpg",
    "快速夹.png": "quick-clip.png",
    "托架.png": "bracket.png",
    "球接栏杆.png": "ball-joint-railing.png",
    "踢脚板.png": "kick-plate.png",
    "实拍图1.jpg": "product-photo-1.jpg",
    "实拍图2.jpg": "product-photo-2.jpg",
    "实拍图3.jpg": "product-photo-3.jpg",
    "储能.jpg": "energy-storage.jpg",
    "储能集装箱.jpg": "energy-storage-container.jpg",
    "光伏.jpg": "solar-pv.jpg",
    "工厂.jpg": "factory.jpg",
    "弱电井.jpg": "weak-current-well.jpg",
    "排水.jpg": "drainage.jpg",
    "数据中心.avif": "data-center.avif",
    "物流.jpg": "logistics.jpg",
    "现场图片 (2).jpg": "site-photo-2.jpg",
    "电厂.jpg": "power-plant.jpg",
    "风电.jpg": "wind-power.jpg",
    "云南有机硅2.jpg": "yunnan-silicone-2.jpg",
    "粮食仓储.webp": "grain-storage.webp",
    "办公楼.jpg": "office-building.jpg",
    "办公楼.webp": "office-building.webp",
    "鸟瞰图.webp": "aerial-view.webp",
    "项目宏观图.jpg": "project-overview.jpg",
    "仓库-成品区.jpg": "warehouse-finished-products.jpg",
    "仓库-成品区1.jpg": "warehouse-finished-products-1.jpg",
    "仓库-成品区2.jpg": "warehouse-finished-products-2.jpg",
    "仓库-打包发货.jpg": "warehouse-packing-shipping.jpg",
    "仓库.JPG": "warehouse.jpg",
    "会议室.png": "meeting-room.png",
    "办公区.png": "office-area.png",
    "办公区1.JPG": "office-area-1.jpg",
    "团队合影.jpg": "team-photo.jpg",
    "大门口.jpg": "factory-entrance.jpg",
    "大门口1.JPG": "factory-entrance-1.jpg",
    "生产设备-切割机.jpg": "production-equipment-cutting-machine.jpg",
    "生产设备-切割机1.JPG": "production-equipment-cutting-machine-1.jpg",
    "生产设备-压焊机.jpg": "production-equipment-pressure-welder.jpg",
    "生产设备-压焊机1.jpg": "production-equipment-pressure-welder-1.jpg",
    "生产设备-镀锌线.jpg": "production-equipment-galvanizing-line.jpg",
    "生产设备-镀锌线1.jpg": "production-equipment-galvanizing-line-1.jpg",
    "生产设备-镀锌线2.jpg": "production-equipment-galvanizing-line-2.jpg",
    "生产设备-镀锌线3.jpg": "production-equipment-galvanizing-line-3.jpg",
    "生产设备-镀锌线4.jpg": "production-equipment-galvanizing-line-4.jpg",
    "生产过程-下料.jpg": "production-process-blanking.jpg",
    "生产过程-下料1.jpg": "production-process-blanking-1.jpg",
    "生产过程-下料2.jpg": "production-process-blanking-2.jpg",
    "生产过程-打包.jpg": "production-process-packing.jpg",
    "生产过程-打包1.jpg": "production-process-packing-1.jpg",
    "生产过程-打包2.jpg": "production-process-packing-2.jpg",
    "生产过程-整形.jpg": "production-process-shaping.jpg",
    "生产过程-整形1.jpg": "production-process-shaping-1.jpg",
    "生产过程-焊接.jpg": "production-process-welding.jpg",
    "生产过程-焊接1.jpg": "production-process-welding-1.jpg",
    "生产过程-质检.jpg": "production-process-quality-inspection.jpg",
    "生产过程-质检1.jpg": "production-process-quality-inspection-1.jpg",
    "生产过程-质检2.jpg": "production-process-quality-inspection-2.jpg",
    "生产过程-镀锌.jpg": "production-process-galvanizing.jpg",
    "生产过程-镀锌1.jpg": "production-process-galvanizing-1.jpg",
    "生产过程-镀锌2.jpg": "production-process-galvanizing-2.jpg",
    "质检过程.jpg": "quality-inspection-process.jpg",
    "质检过程1.jpg": "quality-inspection-process-1.jpg",
    "质检过程2.jpg": "quality-inspection-process-2.jpg",
    "车间.JPG": "workshop.jpg",
    "车间1.JPG": "workshop-1.jpg",
    "车间2.jpg": "workshop-2.jpg",
    "车间3.JPG": "workshop-3.jpg",
    "镀锌.jpg": "galvanizing.jpg",
}

LONG_PATTERNS = {
    "淄博市齐翔腾达化工股份有限公司年产70万吨丙烷脱氢项目": "qixiang-propane-dehydrogenation-700kt",
    "振华石油化工有限公司丙烷脱氢及环氧丙烷项目": "zhenhua-petrochemical-propane-epoxy-propane",
    "志丹绿能新材料科技有限公司年产10万吨高端有机胺项目": "zhidan-organic-amine-100kt",
}

PARENT_SLUG = {
    "产品应用场景图": "product-application",
    "220V变电站": "220v-substation",
    "丙烷脱氢项目": "qixiang-propane-dehydrogenation",
    "凯赛生物科技": "cathay-biotech",
    "快递平台": "express-platform",
    "数据中心": "data-center",
    "新疆大全多晶硅": "xinjiang-polysilicon",
    "有色多晶硅项目": "colored-polysilicon",
    "机场": "airport",
    "林场": "forest-farm",
    "林场1": "forest-farm-v2",
    "核电站项目": "nuclear-power-plant",
    "海湾化学": "gulf-chemistry",
    "煤场管道项目": "coal-pipeline",
    "煤基合成油": "coal-to-liquid",
    "电厂": "power-plant",
    "石油化工丙烷脱氢及环氧丙烷项目": "zhenhua-petrochemical",
    "粮食物流园": "grain-logistics",
    "聚苯乙烯项目": "polystyrene",
    "高端有机胺项目": "zhidan-organic-amine",
}


def get_new_filename(filepath):
    filename = os.path.basename(filepath)
    parent = os.path.basename(os.path.dirname(filepath))

    if filename in FILE_MAP:
        return FILE_MAP[filename]

    for pattern, base in LONG_PATTERNS.items():
        if filename.startswith(pattern):
            suffix = filename[len(pattern):].lower().replace(" ", "-").replace("(", "-").replace(")", "")
            return base + suffix

    m = re.match(r"^(\d{4}_\d{2}_\d{2}.*IMG_)(\d+)(\.(jpg|jpeg|png))$", filename)
    if m:
        slug = re.sub(r"-\d+$", "", parent).replace(" ", "-")
        return f"{slug}-product-photo-{m.group(2)}{m.group(3)}"

    m = re.match(r"^([a-f0-9]{15,32})\.(jpg|jpeg|png|webp)$", filename)
    if m:
        slug = PARENT_SLUG.get(parent, "case-study")
        return f"{slug}-{m.group(1)[:8]}.{m.group(2)}"

    m = re.match(r"^(\d+)\.(jpg|jpeg|png|webp)$", filename)
    if m:
        slug = PARENT_SLUG.get(parent, "image")
        return f"{slug}-{m.group(1)}.{m.group(2)}"

    m = re.match(r"istockphoto-(\d+)-[\dx]+\.(jpg|avif)$", filename)
    if m:
        return f"stock-photo-{m.group(1)}.{m.group(2)}"

    if "u=" in filename and filename.endswith(".webp.jpg"):
        slug = PARENT_SLUG.get(parent, "project")
        return f"{slug}-aerial-view.jpg"

    m = re.match(r"^(\d{13})\.(png|jpg)$", filename)
    if m:
        slug = PARENT_SLUG.get(parent, "project")
        return f"{slug}-{m.group(1)}.{m.group(2)}"

    m = re.match(r"微信图片_(\d+)\.(jpg|jpeg|png)$", filename)
    if m:
        return f"nuclear-power-plant-{m.group(1)}.{m.group(2)}"

    return None


def main():
    print("=== Starting SEO Rename Process ===\n")

    # Step 1: Rename files
    print("Step 1: Renaming files...")
    renamed_files = 0
    for root, dirs, files in os.walk(BASE, topdown=False):
        for f in files:
            if f in ("file_list.txt", "rename-to-seo.ps1", "rename_to_seo.py"):
                continue
            filepath = os.path.join(root, f)
            new_name = get_new_filename(filepath)
            if new_name and new_name != f:
                new_path = os.path.join(root, new_name)
                counter = 1
                while os.path.exists(new_path):
                    base, ext = os.path.splitext(new_name)
                    new_name = f"{base}-{counter}{ext}"
                    new_path = os.path.join(root, new_name)
                    counter += 1
                try:
                    os.rename(filepath, new_path)
                    print(f"  {f} -> {new_name}")
                    renamed_files += 1
                except Exception as e:
                    print(f"  ERROR: {f}: {e}")
    print(f"  Renamed {renamed_files} files\n")

    # Step 2: Rename folders (deepest first)
    print("Step 2: Renaming folders...")
    all_dirs = []
    for root, dirs, _ in os.walk(BASE, topdown=False):
        for d in dirs:
            all_dirs.append(os.path.join(root, d))
    all_dirs.sort(key=len, reverse=True)

    renamed_dirs = 0
    for dirpath in all_dirs:
        dirname = os.path.basename(dirpath)
        if dirname in FOLDER_MAP:
            new_name = FOLDER_MAP[dirname]
            new_path = os.path.join(os.path.dirname(dirpath), new_name)
            if dirpath != new_path and not os.path.exists(new_path):
                try:
                    os.rename(dirpath, new_path)
                    print(f"  {dirname} -> {new_name}")
                    renamed_dirs += 1
                except Exception as e:
                    print(f"  ERROR: {dirname}: {e}")
    print(f"  Renamed {renamed_dirs} folders\n")

    print("=== Rename Complete ===")
    print("Tip: Manually rename root folder to 'ecommerce-steel-grating-images' for full SEO compliance.")


if __name__ == "__main__":
    main()
