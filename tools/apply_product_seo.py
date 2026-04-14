# -*- coding: utf-8 -*-
"""One-off batch: inject applications, related links, FAQ, H1 updates on product pages."""
from __future__ import annotations

import json
import os
import re
from typing import Any

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS = os.path.join(ROOT, "products")


def root_prefix(rel: str) -> str:
    parts = rel.split("/")
    return "../" * len(parts)


def strip_tags(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s).replace("  ", " ").strip()


def faq_html(faqs: list[tuple[str, str]]) -> str:
    lines = ['        <section class="stack" id="faq">', "          <h2>Frequently asked questions</h2>"]
    for q, a in faqs:
        lines.append("          <details>")
        lines.append(f"            <summary>{q}</summary>")
        lines.append(f"            <p>{a}</p>")
        lines.append("          </details>")
    lines.append("        </section>")
    return "\n".join(lines)


def block(
    prefix: str,
    apps_title: str,
    dc: str,
    power: str,
    og: str,
    mid_title: str,
    mid_body: str,
    related_title: str,
    related_items: list[str],
    faqs: list[tuple[str, str]],
) -> str:
    rel_items = "\n".join(f'            <li><a href="{prefix}{href}">{label}</a></li>' for href, label in related_items)
    mid_section = f"""        <h2>{mid_title}</h2>
        {mid_body}"""

    return f"""    <!--product-seo-enhanced-->
    <section class="section section--tight">
      <div class="container stack">
        <h2>{apps_title}</h2>
        <h3>Data centers</h3>
        <p>{dc}</p>
        <h3>Power generation</h3>
        <p>{power}</p>
        <h3>Oil &amp; gas</h3>
        <p>{og}</p>
        <h2>{related_title}</h2>
        <ul class="checklist">
{rel_items}
        </ul>
{mid_section}
{faq_html(faqs)}
      </div>
    </section>
    <!--/product-seo-enhanced-->

"""


def block_products_hub(
    prefix: str,
    apps_title: str,
    dc: str,
    power: str,
    og: str,
    mid_title: str,
    mid_body: str,
    related_title: str,
    related_items: list[str],
    faqs: list[tuple[str, str]],
) -> str:
    """Products index only: application scenarios with matching imagery; visually secondary to product grid."""
    rel_items = "\n".join(f'            <li><a href="{prefix}{href}">{label}</a></li>' for href, label in related_items)
    mid_section = f"""        <h2>{mid_title}</h2>
        {mid_body}"""
    img = f"{prefix}assets/images/products/seo-apps"
    return f"""    <!--product-seo-enhanced-->
    <section class="section section--surface product-seo-support" aria-label="Application context">
      <div class="container stack">
        <header class="stack--sm">
          <h2 class="h2-muted">{apps_title}</h2>
          <p class="text-small product-seo-support__lede">Supporting context for specification—browse product categories above first.</p>
        </header>
        <div class="product-seo-apps-grid">
          <article class="product-seo-app-card">
            <div class="product-seo-app-card__media">
              <img loading="lazy" src="{img}/seo-app-data-center.png" width="640" height="400" alt="Galvanized steel bar grating walkway in a data center service corridor" />
            </div>
            <h3>Data centers</h3>
            <p>{dc}</p>
          </article>
          <article class="product-seo-app-card">
            <div class="product-seo-app-card__media">
              <img loading="lazy" src="{img}/seo-app-power-plant.png" width="640" height="400" alt="Steel bar grating platform at a power generation facility" />
            </div>
            <h3>Power generation</h3>
            <p>{power}</p>
          </article>
          <article class="product-seo-app-card">
            <div class="product-seo-app-card__media">
              <img loading="lazy" src="{img}/seo-app-oil-gas.png" width="640" height="400" alt="Steel grating walkway on an oil and gas pipe rack" />
            </div>
            <h3>Oil &amp; gas</h3>
            <p>{og}</p>
          </article>
        </div>
        <h2>{related_title}</h2>
        <ul class="checklist">
{rel_items}
        </ul>
{mid_section}
{faq_html(faqs)}
      </div>
    </section>
    <!--/product-seo-enhanced-->

"""


def faq_json_ld(url: str, faqs: list[tuple[str, str]]) -> str:
    entities = []
    for q, a in faqs:
        entities.append(
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)},
            }
        )
    obj = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities}
    return f'  <script type="application/ld+json">\n  {json.dumps(obj, ensure_ascii=False)}\n  </script>\n'


def strip_old_faq(content: str) -> str:
    return re.sub(
        r"\s*<section class=\"stack\" id=\"faq\">[\s\S]*?</section>\s*",
        "\n\n",
        content,
    )


def strip_prior_seo_block(content: str) -> str:
    return re.sub(
        r"\s*<!--product-seo-enhanced-->[\s\S]*?<!--/product-seo-enhanced-->\s*",
        "\n\n",
        content,
    )


def remove_duplicate_faq_json(content: str) -> str:
    """Keep first FAQPage script only."""
    scripts = list(re.finditer(r'<script type="application/ld\+json">\s*\{[\s\S]*?"@type"\s*:\s*"FAQPage"[\s\S]*?</script>', content))
    if len(scripts) <= 1:
        return content
    for m in scripts[1:]:
        content = content[: m.start()] + content[m.end() :]
    return content


def inject_block(content: str, block_str: str) -> str:
    idx = content.rfind('<div class="cta-strip">')
    if idx == -1:
        return content
    sec = content.rfind('<section class="section section--tight">', 0, idx)
    if sec == -1:
        return content
    return content[:sec] + block_str + content[sec:]


def replace_h1(content: str, new_h1: str) -> str:
    main_i = content.find("<main")
    if main_i == -1:
        return content
    sub = content[main_i:]
    return content[: main_i] + re.sub(
        r"<h1>[^<]*</h1>", f"<h1>{new_h1}</h1>", sub, count=1
    )


def upsert_faq_json(content: str, page_url: str, faqs: list[tuple[str, str]]) -> str:
    content = remove_duplicate_faq_json(content)
    new_script = faq_json_ld(page_url, faqs)
    if '"@type": "FAQPage"' in content or '"@type":"FAQPage"' in content:
        content = re.sub(
            r'<script type="application/ld\+json">\s*\{[\s\S]*?"@type"\s*:\s*"FAQPage"[\s\S]*?</script>\s*',
            new_script,
            content,
            count=1,
        )
    else:
        content = content.replace(
            "<!-- Google Analytics 4 -->",
            new_script + "  <!-- Google Analytics 4 -->",
            1,
        )
    return content


# --- Per-page data: rel_path from products/ ---
SPECS: dict[str, dict[str, Any]] = {}

# Bar grating family
SPECS["bar-grating/welded-bar-grating/index.html"] = {
    "h1": "Welded steel bar grating for platforms and walkways",
    "apps_title": "Where welded bar grating is specified",
    "dc": "Mezzanine maintenance decks, cable-bridge approaches, and outdoor generator yards often use galvanized welded mesh when loads and spans match standard tables. Coordinate open area with mechanical if the walk is near containment boundaries.",
    "power": "Turbine auxiliary platforms, boiler access, and coal-handling galleries standardize on forge-welded mesh for wheel paths and tool loads. Serrated tops are common in steam-adjacent zones—pair with the correct span in released load tables.",
    "og": "Pipe racks, module walkways, and offshore cellar decks specify welded grating for high familiarity in fabrication yards. Quote ball-proof or close-mesh variants where dropped-object rules apply.",
    "mid_title": "Design inputs that belong on every RFQ",
    "mid_body": """<p>State clear span, bearing bar direction, uniform and concentrated loads, deflection limit, material (carbon vs stainless), and finish. Cross-check mesh names against our <a href="{p}engineering/product-spacing-guide/">spacing guide</a> and <a href="{p}blog/how-to-choose-steel-grating/">selection guide</a>.</p>""",
    "related_title": "Related products and engineering",
    "related": [
        ("engineering/load-tables/", "Load tables"),
        ("products/bar-grating/serrated-bar-grating/", "Serrated bar grating"),
        ("products/bar-grating/heavy-duty-welded-bar-grating/", "Heavy-duty welded grating"),
        ("products/stair-treads/", "Stair treads"),
        ("products/trench-covers/", "Trench covers"),
        ("blog/steel-grating-load-capacity-explained/", "Load capacity explained (guide)"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("How does welded bar grating differ from press-locked?", "Welded grating fuses cross bars to bearing bars at every intersection with a forge weld. Press-locked grating mechanically locks bars without weld beads. Both can meet similar duties if bar sizes and spacing are chosen to match loads at the quoted span."),
        ("Which designation is most common for industrial platforms?", "Projects reference GB-style meshes such as G325/30/100 or NAAMM-style 19-W-4 depending on region. The designation fixes bar depth, thickness, and pitch—always tie it to a load table row for your span."),
        ("Can welded grating be hot-dip galvanized after cutting?", "Yes, with attention to venting and drainage holes per galvanizing practice. Field cuts after galvanizing expose bare steel and need zinc repair per project standards."),
        ("What slip treatment pairs with welded mesh?", "Specify plain or serrated bearing bar tops. Serrated improves wet/oily traction without changing mesh identification if bar dimensions stay the same."),
        ("How do I avoid the wrong bearing bar direction on site?", "Show bearing bar orientation relative to supporting beams on the drawing and repeat it in the RFQ. Installation rotated 90° from design sharply reduces capacity."),
        ("Where do composite or close-mesh variants fit?", "Use <a href=\"{p}products/bar-grating/close-mesh-bar-grating/\">close-mesh</a> or <a href=\"{p}products/bar-grating/ball-proof-grating/\">ball-proof</a> patterns for drop protection; use <a href=\"{p}products/bar-grating/composite-steel-grating/\">composite</a> when a solid top is required."),
        ("Do you supply cut-to-size panels?", "Yes—provide net dimensions, banding, and notch details so quotations match fabrication and tolerances."),
    ],
}

SPECS["bar-grating/press-locked-bar-grating/index.html"] = {
    "h1": "Press-locked steel bar grating (flush face)",
    "apps_title": "Typical press-locked grating applications",
    "dc": "Clean-appearance mezzanines and service bridges where weld beads are undesirable for washdown or architectural bands next to glass facades.",
    "power": "Indoor auxiliary platforms in control buildings or BOP areas where a flat bottom face simplifies lighting or cable tray layout beneath the walk.",
    "og": "Onshore LNG balance-of-plant walkways when owners want uniform mesh appearance and predictable panel flatness for gasketed edge details.",
    "mid_title": "Structural check remains mandatory",
    "mid_body": """<p>Flush faces do not remove the need for span/load verification. Compare against <a href="{p}engineering/load-tables/">load tables</a> and document fixings with <a href="{p}products/accessories/">clips</a>.</p>""",
    "related_title": "Compare and specify",
    "related": [
        ("products/bar-grating/welded-bar-grating/", "Welded bar grating"),
        ("products/bar-grating/serrated-bar-grating/", "Serrated bar grating"),
        ("engineering/how-to-specify/", "How to specify"),
        ("engineering/installation-fixings/", "Installation and fixings"),
        ("solutions/industries/chemical-petrochemical/", "Chemical & petrochemical solutions"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Is press-locked grating weaker than welded?", "Not inherently—capacity follows bar size, spacing, and span. Some meshes overlap between welded and press-locked families; verify the quoted panel against the same deflection criteria used for welded options."),
        ("Why choose press-locked over welded?", "Mechanical locking yields smooth top and bottom surfaces without weld ripples—preferred in food, pharma, and architectural sightlines."),
        ("Can press-locked panels be galvanized?", "Yes when venting and drainage follow galvanizer rules. Confirm distortion limits for thin bars with your supplier."),
        ("What fixings suit press-locked panels?", "Saddle and hold-down clips from the <a href=\"{p}products/accessories/saddle-clips/\">accessories</a> range; torque and substrate material must match the support steel."),
        ("How is mesh designated on drawings?", "Use factory spacing codes or section properties referenced to <a href=\"{p}engineering/product-spacing-guide/\">spacing guide</a> notes."),
        ("Is serrated press-locked available?", "Yes where the top face must improve wet traction; confirm availability for the mesh you select."),
    ],
}

SPECS["bar-grating/heavy-duty-welded-bar-grating/index.html"] = {
    "h1": "Heavy-duty welded bar grating for wheel loads",
    "apps_title": "Heavy-duty grating in industrial sites",
    "dc": "Limited—mainly yards and loading aprons where equipment moves across short spans; confirm vibration and deflection with the structural engineer.",
    "power": "Coal crusher mezzanines, ash handling crossings, and maintenance paths under conveyor galleries where pallet jacks and drum rollers create patch loads.",
    "og": "Module skids, pipe rack drive lanes, and laydown areas needing catalog loads beyond standard-duty welded mesh at the same span.",
    "mid_title": "Quote with wheel loads, not slogans",
    "mid_body": """<p>Provide wheel load, tire width or patch size, and span. Review <a href="{p}engineering/load-tables/heavy-duty/">heavy-duty tables</a> and the <a href="{p}blog/steel-grating-load-capacity-explained/">load capacity guide</a>.</p>""",
    "related_title": "Also review",
    "related": [
        ("products/trench-covers/heavy-duty-trench-covers/", "Heavy-duty trench covers"),
        ("products/bar-grating/welded-bar-grating/", "Standard welded grating"),
        ("engineering/load-tables/", "Load tables hub"),
        ("solutions/industries/power-plants/", "Power plant solutions"),
        ("solutions/industries/oil-gas/", "Oil & gas solutions"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("When is heavy-duty grating required?", "When concentrated loads or vehicle paths exceed the allowable values for standard-duty mesh at the project span and deflection limit."),
        ("Does heavy-duty mean only thicker bars?", "Usually deeper/thicker bearing bars and sometimes tighter cross bar spacing. The exact combination is table-specific."),
        ("Can heavy-duty mesh be serrated?", "Yes, for wet or oily routes where slip resistance is part of the hazard assessment."),
        ("How does this relate to trench covers?", "Both use load classes; see <a href=\"{p}products/trench-covers/heavy-duty-trench-covers/\">heavy-duty trench covers</a> for linear openings."),
        ("What drawings help quotation?", "Plan showing wheel track, support spacing, and any trench or cut-out."),
        ("Is stainless available in heavy duty?", "Yes for corrosive yards; note deflection and fastening compatibility with stainless supports."),
    ],
}

SPECS["bar-grating/serrated-bar-grating/index.html"] = {
    "h1": "Serrated steel bar grating for wet and oily walkways",
    "apps_title": "Where serrated bearing bars are specified",
    "dc": "Outdoor plant bridges and humid mechanical yards where condensate creates slip risk on plain steel.",
    "power": "Turbine decks, HRSG access, and washdown areas adjacent to steam or cooling water mist.",
    "og": "Offshore modules, refinery process decks, and loading docks with intermittent oil films.",
    "mid_title": "Slip performance without guessing mesh strength",
    "mid_body": """<p>Serrations address friction; bar size still must satisfy bending. Pair with <a href="{p}products/stair-treads/serrated-stair-treads/">serrated stair treads</a> for consistent gait on stairs.</p>""",
    "related_title": "Related specification links",
    "related": [
        ("products/bar-grating/welded-bar-grating/", "Welded bar grating"),
        ("products/stair-treads/serrated-stair-treads/", "Serrated stair treads"),
        ("solutions/applications/walkways/", "Walkway applications"),
        ("engineering/materials-finishes/", "Materials and finishes"),
        ("blog/how-to-choose-steel-grating/", "How to choose grating"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Does serration reduce load capacity?", "For the same bar dimensions and spacing, capacity is taken as equivalent to plain top in most catalogs; confirm with the supplier table footnotes."),
        ("Can serrated grating be galvanized?", "Yes; serrated profiles are routinely hot-dip galvanized after fabrication."),
        ("When is serrated unnecessary?", "Dry indoor storage mezzanines with low slip hazard may use plain tops—document the HSE basis."),
        ("How do I match stair treads?", "Specify the same mesh family and nosing detail as platforms for visual and gait continuity."),
        ("Is press-locked serrated available?", "Yes in many meshes; ask during RFQ if architectural flatness is also required."),
        ("What standards reference slip?", "Owner HSE and local codes govern; grating provides the surface texture input to those rules."),
    ],
}

SPECS["bar-grating/close-mesh-bar-grating/index.html"] = {
    "h1": "Close-mesh steel grating for small openings",
    "apps_title": "Close-mesh deployment contexts",
    "dc": "Walkways above sensitive cable zones where small hardware must not fall through open mesh.",
    "power": "Platforms above rotating equipment or conveyors where owner standards limit opening size.",
    "og": "Offshore cellar decks and modules referencing dropped-object programs alongside walkway use.",
    "mid_title": "Coordinate with ball-proof rules",
    "mid_body": """<p>Compare to <a href="{p}products/bar-grating/ball-proof-grating/">ball-proof grating</a> when the specification names a reference sphere size. Check <a href="{p}engineering/load-tables/ball-proof/">ball-proof load data</a>.</p>""",
    "related_title": "Related products",
    "related": [
        ("products/bar-grating/ball-proof-grating/", "Ball-proof grating"),
        ("engineering/load-tables/ball-proof/", "Ball-proof load tables"),
        ("products/bar-grating/welded-bar-grating/", "Welded bar grating"),
        ("solutions/applications/platform-flooring/", "Platform flooring"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("How is close-mesh different from standard pitch?", "Bearing bars and/or cross bars are spaced tighter, shrinking openings and increasing steel weight per square metre."),
        ("Does close-mesh affect drainage?", "Yes—open area drops; hydraulic designers should confirm run-off where washdown or rain loads exist."),
        ("Is close-mesh suitable for public walkways?", "Often yes when openings must limit high-heel intrusion; cite the governing rule set in the RFQ."),
        ("Can it be galvanized?", "Yes with standard venting practices for trapped pockets."),
        ("What loads apply?", "Same span/load methodology as other welded meshes—use released tables."),
        ("When is composite used instead?", "When zero open area is required, consider <a href=\"{p}products/bar-grating/composite-steel-grating/\">composite grating</a>."),
    ],
}

SPECS["bar-grating/composite-steel-grating/index.html"] = {
    "h1": "Composite steel grating (checker plate on mesh)",
    "apps_title": "Where composite grating replaces open mesh",
    "dc": "Walkways above cold-aisle cable zones where drips must not reach energized gear, when mechanical approves solid tops locally.",
    "power": "Electrical equipment galleries and MCC rooms requiring a continuous top while retaining a steel support grid.",
    "og": "Analyzer shelters and instrument buildings where small parts must not fall into lower pipe racks.",
    "mid_title": "Drainage and weight trade-offs",
    "mid_body": """<p>Checker plate removes through-mesh drainage unless detailed cutouts are added. Dead load rises versus open <a href="{p}products/bar-grating/welded-bar-grating/">welded grating</a>; verify secondary steel.</p>""",
    "related_title": "See also",
    "related": [
        ("products/bar-grating/welded-bar-grating/", "Welded bar grating"),
        ("products/bar-grating/close-mesh-bar-grating/", "Close-mesh grating"),
        ("engineering/load-tables/", "Load tables"),
        ("solutions/industries/data-centers/", "Data center solutions"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("How is the checker plate attached?", "Factory-bonded or welded laminate per quotation; method affects torsion stiffness and repair strategy."),
        ("Can composite panels be galvanized after lamination?", "Depends on plate thickness and venting; confirm with the supplier’s process."),
        ("Is slip resistance from the checker pattern enough?", "Project HSE decides; serrated open mesh may still be required in wet zones."),
        ("What spans are realistic?", "Treat as a heavier deck—check tables or project engineering for deflection."),
        ("Do you supply cut-outs for columns?", "Yes with drawings showing net sizes and tolerances."),
        ("Alternative to composite?", "<a href=\"{p}products/bar-grating/close-mesh-bar-grating/\">Close-mesh</a> if limited openings suffice without a full plate."),
    ],
}

SPECS["bar-grating/ball-proof-grating/index.html"] = {
    "h1": "Ball-proof steel grating (20 mm / 35 mm)",
    "apps_title": "Ball-proof grating applications",
    "dc": "Walkways over white-space adjacencies where owner dropped-object programs reference sphere passage limits.",
    "power": "Elevated routes above turbine or boiler auxiliaries when insurance or owner standards mandate proof against reference ball sizes.",
    "og": "Offshore and module walkways tied to DROPS-style rules; always cite the governing sphere diameter in the RFQ.",
    "mid_title": "Documentation engineers expect",
    "mid_body": """<p>State 20 mm or 35 mm proof, mesh designation, span, and standard reference. Use <a href="{p}engineering/load-tables/ball-proof/">ball-proof load tables</a> and compare with <a href="{p}products/bar-grating/close-mesh-bar-grating/">close-mesh</a> alternatives.</p>""",
    "related_title": "Related links",
    "related": [
        ("engineering/load-tables/ball-proof/", "Ball-proof load tables"),
        ("products/bar-grating/close-mesh-bar-grating/", "Close-mesh grating"),
        ("solutions/industries/marine-offshore/", "Marine & offshore"),
        ("engineering/standards/", "Standards and references"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("What does ball-proof mean?", "Openings are configured so a defined test sphere (commonly 20 mm or 35 mm) cannot pass—wording varies by owner; cite the rule you follow."),
        ("Is ball-proof the same as close-mesh?", "Close-mesh is a geometric description; ball-proof ties to a specific test sphere and jurisdiction."),
        ("Can ball-proof mesh be galvanized?", "Yes with venting suitable for tight patterns."),
        ("How are loads determined?", "Use the supplier ball-proof table for the mesh and span; do not assume standard-duty values."),
        ("Does serrated top affect proof geometry?", "The opening check must still be satisfied; confirm with drawings."),
        ("Offshore vs onshore specs?", "Regulatory and owner standards differ—attach the applicable document to the RFQ."),
    ],
}

SPECS["bar-grating/sherardized-steel-grating/index.html"] = {
    "h1": "Sherardized steel grating and small steelwork",
    "apps_title": "Where sherardizing is specified",
    "dc": "Clips and small hardware bundles shipped with raised-floor or cable-tray packages needing uniform zinc diffusion in threads.",
    "power": "Attachment kits for maintenance platforms in corrosive indoor atmospheres where hot-dip tank size is awkward for mixed small parts.",
    "og": "Fastener-adjacent components in modules where galvanizing drips are unacceptable but zinc protection is still required.",
    "mid_title": "Compared to hot-dip galvanizing",
    "mid_body": """<p>Sherardizing diffuses zinc onto steel in a batch process suited to complex small sections. Large walk-off panels more often use <a href="{p}products/bar-grating/welded-bar-grating/">hot-dip galvanized welded grating</a>.</p>""",
    "related_title": "Related",
    "related": [
        ("products/bar-grating/untreated-grating/", "Untreated grating"),
        ("engineering/materials-finishes/", "Materials and finishes"),
        ("products/accessories/", "Accessories"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("What thickness of zinc is typical?", "Depends on process cycle and part geometry; request a coating thickness range on the mill sheet."),
        ("Can full walkway panels be sherardized?", "Less common than batch small parts—ask for maximum single-piece size limits."),
        ("Touch-up after field cutting?", "Follow zinc repair guidance similar to other zinc systems."),
        ("Stainless alternative?", "Where chlorides dominate, compare to stainless meshes."),
        ("ASTM or ISO references?", "List required test reports in the RFQ for supplier alignment."),
        ("Batch size limits?", "Ask maximum part length/weight per furnace charge—oversized panels may need hot-dip instead."),
    ],
}

SPECS["bar-grating/untreated-grating/index.html"] = {
    "h1": "Untreated (black) steel grating",
    "apps_title": "When untreated grating is acceptable",
    "dc": "Short-duration construction walkways inside dry halls prior to owner coating systems.",
    "power": "Indoor BOP mezzanines that receive a field paint system after structural completion.",
    "og": "Temporary offshore access during hook-up when a later paint cycle is planned.",
    "mid_title": "Corrosion and fire-paint coordination",
    "mid_body": """<p>Mill scale is not a durable finish. If the site is not dry, default to <a href="{p}products/bar-grating/welded-bar-grating/">galvanized welded grating</a>. Coordinate intumescent or epoxy systems with the coating supplier.</p>""",
    "related_title": "Also see",
    "related": [
        ("products/bar-grating/welded-bar-grating/", "Galvanized welded grating"),
        ("engineering/materials-finishes/", "Materials and finishes"),
        ("downloads/bar-grating-datasheet/", "Bar grating datasheet"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Is untreated suitable outdoors?", "Generally no unless a site coating is applied immediately and maintained."),
        ("Can untreated be painted in the shop?", "Yes when the paint system is qualified for shop application and transport."),
        ("Does untreated cost less?", "Material saving exists, but lifecycle corrosion risk often favors galvanizing."),
        ("Welded or press-locked untreated?", "Both can be supplied mill finish—state which fabrication type."),
        ("Storage requirements?", "Keep dry to avoid flash rust before coating."),
        ("Blasting before paint?", "Many specs require Sa 2½ or commercial blast—state surface prep class."),
    ],
}

# FRP
for slug, cfg in [
    (
        "frp-grating/molded-frp-grating/index.html",
        {
            "h1": "Molded FRP grating (open mesh)",
            "apps_title": "Molded FRP grating applications",
            "dc": "Cooling yard trenches and washdown adjacent to chillers when chemistry and weight favor non-metallic mesh.",
            "power": "FGD and chemical dosing galleries where stainless steel cost is high and resin compatibility is documented.",
            "og": "Offshore living quarter walkways and sump covers in splash zones; confirm fire notes for escape routes.",
            "mid_title": "Resin selection drives chemical life",
            "mid_body": """<p>Match orthophthalic, isophthalic, vinyl ester, or phenolic systems to the chemical list. Read <a href="{p}blog/frp-vs-steel-grating/">steel vs FRP</a> and <a href="{p}engineering/load-tables/frp-span-guide/">FRP span guide</a>.</p>""",
            "related_title": "Related",
            "related": [
                ("products/frp-grating/chemical-resistant-frp-grating/", "Chemical-resistant FRP"),
                ("products/frp-grating/anti-slip-frp-grating/", "Anti-slip FRP"),
                ("solutions/industries/chemical-petrochemical/", "Chemical solutions"),
                ("engineering/load-tables/frp-span-guide/", "FRP span guide"),
                ("rfq/", "Request a quote"),
            ],
            "faqs": [
                ("Is molded FRP bidirectional?", "Yes in typical square mesh molded panels; verify load axes with the manufacturer table."),
                ("Can FRP support vehicle loads?", "Only when heavy-duty pultruded or specialized systems are engineered for the wheel patch—do not extrapolate from light walkway tables."),
                ("Fire performance?", "Product- and resin-specific; obtain ratings for escape routes."),
                ("Stainless clips with FRP?", "Common; ensure isolation if galvanic rules apply."),
                ("UV exposure?", "Surfacing and resin type must suit outdoor UV."),
                ("Compared to steel economically?", "Weigh first cost against coating maintenance for the actual environment."),
            ],
        },
    ),
    (
        "frp-grating/anti-slip-frp-grating/index.html",
        {
            "h1": "Anti-slip FRP grating surfaces",
            "apps_title": "Anti-slip FRP in the field",
            "dc": "Outdoor stepovers and washdown pads where metallic corrosion products are undesirable.",
            "power": "Cooling tower perimeter maintenance paths with mist and algae growth.",
            "og": "Marine terminal approaches and berth maintenance where gritted tops improve barefoot or boot traction.",
            "mid_title": "Specify grit system and resin together",
            "mid_body": """<p>Grit bond durability depends on resin and exposure. Pair with <a href="{p}products/frp-grating/molded-frp-grating/">molded FRP</a> or pultruded layouts per loads.</p>""",
            "related_title": "Related",
            "related": [
                ("products/frp-grating/molded-frp-grating/", "Molded FRP"),
                ("products/bar-grating/serrated-bar-grating/", "Serrated steel grating"),
                ("solutions/applications/walkways/", "Walkways"),
                ("rfq/", "Request a quote"),
            ],
            "faqs": [
                ("Does grit reduce open area?", "Slightly; confirm drainage if important."),
                ("Cleaning?", "Pressure washing may require grit retention checks."),
                ("Replacement interval?", "Depends on traffic and chemical exposure."),
                ("Colors?", "Often available for safety zoning."),
                ("Steel alternative?", "Compare to <a href=\"{p}products/bar-grating/serrated-bar-grating/\">serrated steel</a> for high wheel loads."),
            ],
        },
    ),
    (
        "frp-grating/chemical-resistant-frp-grating/index.html",
        {
            "h1": "Chemical-resistant FRP grating",
            "apps_title": "Chemical plant use cases",
            "dc": "Hypochlorite or chemical storage pads where stainless is overkill or isolation matters.",
            "power": "Wastewater tie-ins from demin plants when resists acids/alkalis in the listed concentrations.",
            "og": "Refinery sump and dike walkways with documented resin compatibility sheets.",
            "mid_title": "Engineering package for RFQ",
            "mid_body": """<p>Attach chemical names, concentration range, temperature spikes, and immersion vs splash. Cross-link to <a href="{p}solutions/industries/chemical-petrochemical/">chemical solutions</a>.</p>""",
            "related_title": "Related",
            "related": [
                ("products/frp-grating/molded-frp-grating/", "Molded FRP"),
                ("blog/frp-vs-steel-grating/", "Steel vs FRP guide"),
                ("engineering/standards/", "Standards"),
                ("rfq/", "Request a quote"),
            ],
            "faqs": [
                ("Vinyl ester vs polyester?", "Vinyl ester generally suits stronger solvents; confirm with compatibility letter."),
                ("Temperature ceiling?", "Resin-specific—list max operating temperature."),
                ("Fire smoke?", "Ask for product test summaries."),
                ("Conductive grit?", "Some sites require conductivity—state if needed."),
                ("Stainless comparison?", "FRP wins on certain chemistries; steel wins on wheel loads."),
            ],
        },
    ),
    (
        "frp-grating/mini-mesh-frp-grating/index.html",
        {
            "h1": "Mini-mesh FRP grating",
            "apps_title": "Mini-mesh FRP applications",
            "dc": "Pedestrian bridges near public areas where small openings improve comfort.",
            "power": "Platforms above cable spreads needing smaller openings than standard FRP mesh.",
            "og": "Temporary maintenance pads over sensitive equipment.",
            "mid_title": "Open area vs strength",
            "mid_body": """<p>Tighter mesh increases laminate density; verify spans against <a href="{p}engineering/load-tables/frp-span-guide/">FRP span tables</a>.</p>""",
            "related_title": "Related",
            "related": [
                ("products/frp-grating/molded-frp-grating/", "Molded FRP"),
                ("products/bar-grating/close-mesh-bar-grating/", "Steel close-mesh"),
                ("rfq/", "Request a quote"),
            ],
            "faqs": [
                ("Difference vs standard FRP mesh?", "Smaller openings, typically higher weight per area."),
                ("Suitable for heels?", "Often specified for that reason—cite local accessibility rules."),
                ("Colors?", "Available on many lines."),
                ("Chemical compatibility?", "Same resin rules as other FRP."),
                ("Pultruded vs molded mini-mesh?", "Molded is common; pultruded may be used for longer spans—ask for line-specific data."),
                ("Cleaning debris in tight mesh?", "Smaller openings trap fines faster—state maintenance method in O&M."),
            ],
        },
    ),
]:
    SPECS[slug] = dict(cfg)

# Stair treads
STAIR_FAQ = [
    ("How is stair tread span defined?", "Clear distance between stringers supporting the tread; verify with the supplier table for the model."),
    ("Plain or serrated nosing?", "Match platform slip strategy; serrated nosing is common in wet plants."),
    ("Bolted vs welded treads?", "Bolted eases replacement; welded is common for fixed industrial stairs."),
    ("Load basis?", "Typically uniform load per stair width plus maintenance concentrated load if owner requires."),
    ("Galvanizing after fabrication?", "Standard for carbon steel; vent per detail drawings."),
    ("Riser and going tolerances?", "State expected fabrication tolerance class so nosing lines stay straight across flights."),
]
for slug, h1, extra_mid, rel in [
    (
        "stair-treads/welded-stair-treads/index.html",
        "Welded steel stair treads",
        "<p>Usually matches <a href=\"{p}products/bar-grating/welded-bar-grating/\">welded platform mesh</a> for visual continuity.</p>",
        [
            ("products/stair-treads/serrated-stair-treads/", "Serrated stair treads"),
            ("products/stair-treads/bolted-stair-treads/", "Bolted stair treads"),
            ("engineering/load-tables/stair-treads/", "Stair tread load tables"),
            ("solutions/applications/stair-systems/", "Stair systems"),
            ("blog/anti-slip-stair-treads-guide/", "Anti-slip stair guide"),
            ("rfq/", "Request a quote"),
        ],
    ),
    (
        "stair-treads/serrated-stair-treads/index.html",
        "Serrated steel stair treads",
        "<p>Specify for wet turbine, HRSG, or offshore stairs; align with <a href=\"{p}products/bar-grating/serrated-bar-grating/\">serrated platforms</a>.</p>",
        [
            ("products/stair-treads/welded-stair-treads/", "Welded stair treads"),
            ("solutions/industries/oil-gas/", "Oil & gas"),
            ("solutions/industries/power-plants/", "Power plants"),
            ("rfq/", "Request a quote"),
        ],
    ),
    (
        "stair-treads/bolted-stair-treads/index.html",
        "Bolted steel stair treads",
        "<p>Used when treads must be removed for cable pulls or future retrofits without cutting welds.</p>",
        [
            ("products/accessories/hold-down-clips/", "Hold-down clips"),
            ("engineering/installation-fixings/", "Installation fixings"),
            ("rfq/", "Request a quote"),
        ],
    ),
    (
        "stair-treads/custom-stair-treads/index.html",
        "Custom fabricated stair treads",
        "<p>Send stringer spacing, rise/run, nosing detail, and load cases; include hole patterns for <a href=\"{p}products/accessories/\">clips</a>.</p>",
        [
            ("engineering/how-to-specify/", "How to specify"),
            ("cases/", "Project cases"),
            ("rfq/", "Request a quote"),
        ],
    ),
]:
    SPECS[slug] = {
        "h1": h1,
        "apps_title": "Stair tread applications by sector",
        "dc": "Access stairs to roof plant and data-hall mezzanines—match slip and load to owner standards.",
        "power": "Boiler and turbine stair towers with washdown and condensate exposure.",
        "og": "Module escape stairs and offshore companionways requiring serrated profiles and documented loads.",
        "mid_title": "Detailing notes",
        "mid_body": extra_mid,
        "related_title": "Related pages",
        "related": rel,
        "faqs": STAIR_FAQ + [
            ("Custom marking for escape routes?", "Photoluminescent nosing or paint bands may be added—state in RFQ."),
        ],
    }

# Trench covers
SPECS["trench-covers/standard-trench-covers/index.html"] = {
    "h1": "Standard-duty steel trench covers",
    "apps_title": "Standard trench cover applications",
    "dc": "Pedestrian-only cable trenches in campus and colocation yards where occasional hand-cart access occurs.",
    "power": "Light BOP trenches away from forklift routes.",
    "og": "Non-traffic pipe sleepers and inspection trenches in process areas.",
    "mid_title": "Load class must be written",
    "mid_body": """<p>Define pedestrian vs occasional trolley vs vehicle crossing. Compare with <a href="{p}products/trench-covers/heavy-duty-trench-covers/">heavy-duty covers</a>.</p>""",
    "related_title": "Related",
    "related": [
        ("products/trench-covers/heavy-duty-trench-covers/", "Heavy-duty trench covers"),
        ("products/trench-covers/drainage-channel-covers/", "Drainage channel covers"),
        ("blog/trench-covers-selection-guide/", "Trench cover selection guide"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("How are standard covers lifted?", "Specify recessed lift or hinged detail."),
        ("Galvanized finish?", "Typical for outdoor buried frames."),
        ("Sealing?", "Gasketed frames may be required in washdown plants."),
        ("Length modules?", "Panel length affects deflection—state support spacing."),
        ("Security?", "Bolt-down or lockable versions available."),
        ("Fire routes?", "Confirm rating if part of escape path."),
    ],
}

SPECS["trench-covers/heavy-duty-trench-covers/index.html"] = {
    "h1": "Heavy-duty trench covers for vehicle traffic",
    "apps_title": "Heavy-duty cover placements",
    "dc": "Yard crossings for delivery trucks near data halls when trenches cross drive lanes.",
    "power": "Coal and limestone truck paths over utility trenches.",
    "og": "Refinery and LNG logistics roads over cable or utility runs.",
    "mid_title": "Quote with wheel loads",
    "mid_body": """<p>Provide single-wheel or axle load, impact factor if any, and frame embed detail. See <a href="{p}products/bar-grating/heavy-duty-welded-bar-grating/">heavy-duty grating</a> for platform analogies.</p>""",
    "related_title": "Related",
    "related": [
        ("products/trench-covers/standard-trench-covers/", "Standard trench covers"),
        ("products/trench-covers/custom-fabricated-covers/", "Custom trench covers"),
        ("engineering/load-tables/", "Load tables"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Difference vs standard?", "Structural depth and reinforcement to meet higher mid-span bending."),
        ("Hinged vs lift-out?", "Hinged speeds frequent access; lift-out suits long runs."),
        ("Composite infill?", "Possible where electromagnetic or corrosion constraints exist—ask."),
        ("Frame tolerance?", "Cast-in frames need concrete pour tolerances on drawings."),
        ("Testing evidence?", "Request load test or calculation package for owner review."),
    ],
}

SPECS["trench-covers/drainage-channel-covers/index.html"] = {
    "h1": "Drainage channel covers (industrial)",
    "apps_title": "Drainage cover scenarios",
    "dc": "Storm and condensate runs around chillers when grating tops aid inspection.",
    "power": "Yard drainage intersecting cable trenches—coordinate hydraulic opening with structural rating.",
    "og": "Tank farm dikes and sump grates in petrochemical sites.",
    "mid_title": "Hydraulics plus structure",
    "mid_body": """<p>State required inlet open area and simultaneous wheel load if trucks can track the channel.</p>""",
    "related_title": "Related",
    "related": [
        ("solutions/applications/drainage-covers/", "Drainage applications"),
        ("products/trench-covers/standard-trench-covers/", "Standard covers"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Slotted vs mesh top?", "Depends on debris tolerance and heel rules."),
        ("Locking?", "Specify tamper resistance for public edges."),
        ("Material?", "Galvanized steel typical; stainless near chemicals."),
        ("Maintenance?", "Document lift weight for O&M manuals."),
        ("Combined hydraulic and traffic load?", "If trucks can straddle the channel, state simultaneous hydraulic and structural checks."),
        ("Stainless frames?", "Specify for aggressive chemical dikes or coastal yards."),
    ],
}

SPECS["trench-covers/custom-fabricated-covers/index.html"] = {
    "h1": "Custom fabricated trench covers",
    "apps_title": "Custom cover use cases",
    "dc": "Irregular trench widths beside bespoke cable vaults.",
    "power": "Combined steam and electrical trenches needing stepped levels.",
    "og": "Skid-mounted packages with trench interfaces not matching catalog modules.",
    "mid_title": "Send fabrication-critical dimensions",
    "mid_body": """<p>Provide shop weld maps, radii, and interface to <a href="{p}products/accessories/">fixings</a>.</p>""",
    "related_title": "Related",
    "related": [
        ("products/trench-covers/heavy-duty-trench-covers/", "Heavy-duty covers"),
        ("engineering/how-to-specify/", "How to specify"),
        ("cases/", "Projects"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Lead time?", "Custom jobs depend on drawing approval cycles."),
        ("NDE requirements?", "State UT/MT expectations up front."),
        ("Coating systems?", "Duplex systems may need separate spec section."),
        ("Site measurement?", "Confirm as-built trench before final fab lock."),
        ("Split covers for long runs?", "Modular splits ease lifting—define joint detail and seal strategy."),
        ("Lifting points?", "Certified lift lugs may be required for heavy single-leaf covers."),
    ],
}

# Accessories
ACC = [
    (
        "accessories/saddle-clips/index.html",
        "Saddle clips for grating fixation",
        "Saddle clips straddle the bearing bar and bolt to the support flange. Common on <a href=\"{p}products/bar-grating/welded-bar-grating/\">welded</a> and <a href=\"{p}products/bar-grating/press-locked-bar-grating/\">press-locked</a> platforms.",
        [
            ("How many clips per panel?", "Typically four corners minimum; dense vibration zones may require mid-edge clips."),
            ("Stainless vs carbon clips?", "Match support and environment to avoid galvanic pairs."),
            ("Torque values?", "Follow supplier tables to avoid over-compression of mesh."),
            ("Use with FRP?", "Yes with hardware suited to pultruded or molded edges."),
            ("Earth continuity?", "Steel clips participate in bonding—confirm electrical details."),
            ("Alternatives?", "See <a href=\"{p}products/accessories/hold-down-clips/\">hold-down clips</a> for different load paths."),
        ],
    ),
    (
        "accessories/hold-down-clips/index.html",
        "Hold-down clips for grating security",
        "Hold-downs resist uplift or vibration on offshore modules and rotating-equipment mezzanines.",
        [
            ("When are hold-downs mandatory?", "When owner specs or vibration study calls for positive retention beyond friction."),
            ("Bolt grade?", "Match environment: stainless vs galvanized carbon."),
            ("Installation clearance?", "Confirm wrench access before fabricating banding."),
            ("With seismic?", "Anchor layout may densify—structural engineer directs."),
            ("Compatible meshes?", "Works with most bar grating; verify bar depth."),
            ("Inspection marking?", "Torque-check paint dots are common on offshore projects."),
        ],
    ),
    (
        "accessories/panel-joining-clips/index.html",
        "Panel joining clips",
        "Joining clips align abutting panels for continuous walk lines on long rack platforms.",
        [
            ("Do joins carry load?", "They align and tie panels; primary load path remains supports."),
            ("Expansion?", "Ask about slotted holes if thermal movement is large."),
            ("Corrosion?", "Match clip finish to grating finish."),
            ("Thermal expansion?", "Long straight runs may need slip joints—coordinate with structural."),
            ("Stock vs custom?", "Catalog clips cover common bar pitches; odd pitches need shop review."),
            ("Misalignment tolerance?", "Joining clips forgive small panel offset but not gross beam level errors."),
        ],
    ),
    (
        "accessories/banding-bars/index.html",
        "Banding bars and edge trim",
        "Banding closes cut edges and stiffens panels for lifting; specify banding thickness with mesh depth.",
        [
            ("Welded or bolted banding?", "Welded is typical for shop-fabricated panels."),
            ("Toe plate next?", "Pair with <a href=\"{p}products/accessories/toe-plates/\">toe plates</a> for kick protection."),
            ("Galvanizing distortion?", "Thin bands need bracing strategy in fab drawings."),
            ("Banding height vs mesh depth?", "Deeper bars may need taller band to clear welds."),
            ("Cut-out for drains?", "Coordinate banding interruptions with drainage cutouts."),
        ],
    ),
    (
        "accessories/toe-plates/index.html",
        "Toe plates for open edges",
        "Toe plates provide kick protection at open grating edges on racks and stair landings.",
        [
            ("Height?", "Commonly 100 mm / 4 in unless code states otherwise."),
            ("Continuous weld?", "Specify stitch vs continuous per structural detail."),
            ("Coating?", "Match handrail spec for duplex systems."),
            ("Grating projection past toe?", "Define whether mesh stops flush with toe or steps back for drip."),
            ("Handrail post attachment?", "Posts often weld to toe plate—show load path on drawings."),
        ],
    ),
]

for path, h1, mid, faqs in ACC:
    SPECS[path] = {
        "h1": h1,
        "apps_title": "Accessory applications across sectors",
        "dc": "Cable-tray and CRAC maintenance platforms use saddle clips with documented torque in O&M manuals.",
        "power": "Turbine decks subject to vibration may specify hold-downs at panel corners per mechanical package.",
        "og": "Offshore modules require positive retention and inspection paint marking for clip integrity surveys.",
        "mid_title": "Installation practice",
        "mid_body": f"<p>{mid}</p>",
        "related_title": "Related products",
        "related": [
            ("engineering/installation-fixings/", "Installation and fixings"),
            ("products/bar-grating/welded-bar-grating/", "Welded grating"),
            ("products/stair-treads/", "Stair treads"),
            ("rfq/", "Request a quote"),
        ],
        "faqs": faqs,
    }

# Category hubs — shorter but unique
SPECS["index.html"] = {
    "h1": "Industrial steel grating, stair treads & trench covers",
    "apps_title": "Product families by facility type",
    "dc": "Colocation providers combine galvanized walkways, mezzanine grating, and rated trench systems in yards and halls.",
    "power": "Utilities standardize welded mesh, serrated stairs, and heavy trench covers across coal, CCGT, and biomass sites.",
    "og": "EPCs procure bar grating packages for racks, modules, and tank farms with consistent clip hardware.",
    "mid_title": "Start from application or standard",
    "mid_body": """<p>Browse <a href="{p}products/bar-grating/">bar grating</a>, <a href="{p}products/stair-treads/">stair treads</a>, <a href="{p}products/trench-covers/">trench covers</a>, <a href="{p}products/frp-grating/">FRP</a>, and <a href="{p}products/accessories/">accessories</a>. Technical depth: <a href="{p}engineering/">engineering hub</a>, <a href="{p}blog/how-to-choose-steel-grating/">selection guide</a>.</p>""",
    "related_title": "Popular entry points",
    "related": [
        ("products/bar-grating/welded-bar-grating/", "Welded bar grating"),
        ("products/bar-grating/heavy-duty-welded-bar-grating/", "Heavy-duty grating"),
        ("solutions/industries/data-centers/", "Data centers"),
        ("solutions/industries/power-plants/", "Power plants"),
        ("solutions/industries/oil-gas/", "Oil & gas"),
        ("engineering/load-tables/", "Load tables"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Do you export fabricated panels?", "Yes—include incoterms, port, and documentation needs in the RFQ."),
        ("Which standards do you work to?", "NAAMM MBG 531, GB YB/T 4001, EN ISO 24637 among others—state the governing code."),
        ("Can you match an existing mesh name?", "Provide photos, drawings, or sample measurements for reverse matching."),
        ("FRP and steel in one PO?", "Yes; segregate zones and resin specs on the bill of materials."),
        ("Lead times for export?", "Ask current mill schedule and documentation lead for your port."),
        ("Third-party inspection?", "SGS/BV or owner inspectors can be accommodated—name the standard early."),
    ],
}

SPECS["steel-grating/index.html"] = {
    "h1": "Steel grating overview (bar & platform systems)",
    "apps_title": "Steel grating across industries",
    "dc": "Indoor plant steel walkways and mezzanines with galvanized finishes.",
    "power": "Outdoor and indoor power-station platforms with serrated options.",
    "og": "Refinery and LNG steel decking on racks and skids.",
    "mid_title": "Navigate to the exact mesh type",
    "mid_body": """<p>Detailed types live under <a href="{p}products/bar-grating/">bar grating</a>; compare <a href="{p}products/bar-grating/welded-bar-grating/">welded</a> vs <a href="{p}products/bar-grating/press-locked-bar-grating/">press-locked</a>.</p>""",
    "related_title": "Deep links",
    "related": [
        ("products/bar-grating/", "Bar grating family"),
        ("products/trench-covers/", "Trench covers"),
        ("blog/steel-grating-load-capacity-explained/", "Load capacity guide"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Is this page a substitute for bar-grating?", "Use <a href=\"{p}products/bar-grating/\">bar grating</a> for model tables and imagery."),
        ("Stainless supply?", "Yes—state grade and finish."),
        ("Aluminum grating?", "Available for selected spans—request alloy and finish."),
        ("Who uses this hub?", "EPC buyers comparing umbrella specs before drilling into mesh types."),
    ],
}

SPECS["bar-grating/index.html"] = {
    "h1": "Steel bar grating product family",
    "apps_title": "Bar grating in major sectors",
    "dc": "Mezzanines, cable bridges, and generator yards.",
    "power": "Turbine, boiler, and materials-handling platforms.",
    "og": "Rack walkways, module decks, and trench-adjacent routes.",
    "mid_title": "Pick a construction type",
    "mid_body": """<p>Start with <a href="{p}products/bar-grating/welded-bar-grating/">welded</a>, then compare <a href="{p}products/bar-grating/serrated-bar-grating/">serrated</a>, <a href="{p}products/bar-grating/heavy-duty-welded-bar-grating/">heavy-duty</a>, and special patterns.</p>""",
    "related_title": "Engineering support",
    "related": [
        ("engineering/load-tables/", "Load tables"),
        ("engineering/product-spacing-guide/", "Spacing guide"),
        ("downloads/bar-grating-datasheet/", "Datasheet"),
        ("blog/how-to-choose-steel-grating/", "Selection guide"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Fastest path to a quote?", "Send spans, loads, mesh preference, finish, and quantities."),
        ("Custom patterns?", "Yes—include drawings."),
        ("Ball-proof or close-mesh?", "See dedicated pages when dropped-object rules apply."),
        ("Documentation package?", "Mill sheets and galvanizing certificates are listed per PO requirements."),
    ],
}

SPECS["frp-grating/index.html"] = {
    "h1": "FRP grating systems (molded & specialty)",
    "apps_title": "FRP grating by environment",
    "dc": "Cooling and chemical-adjacent pads where metallic corrosion is costly.",
    "power": "Scrubber and chemical areas in power stations.",
    "og": "Marine and offshore splash-zone walkways.",
    "mid_title": "Choose resin before mesh pitch",
    "mid_body": """<p>Read <a href="{p}products/frp-grating/molded-frp-grating/">molded FRP</a>, <a href="{p}products/frp-grating/chemical-resistant-frp-grating/">chemical-resistant</a>, and <a href="{p}blog/frp-vs-steel-grating/">steel vs FRP</a>.</p>""",
    "related_title": "Related",
    "related": [
        ("engineering/load-tables/frp-span-guide/", "FRP span guide"),
        ("solutions/industries/water-treatment/", "Water treatment"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Can FRP meet stair loads?", "Yes with pultruded or heavy molded systems—verify tables."),
        ("Fire requirements?", "Provide escape-route classification."),
        ("UV outdoors?", "Surfacing and resin must suit exterior exposure."),
        ("Conductive grit needed?", "State if static dissipation is a design input."),
    ],
}

SPECS["stair-treads/index.html"] = {
    "h1": "Industrial stair treads (steel)",
    "apps_title": "Stair tread applications",
    "dc": "Roof and mezzanine stairs in mission-critical buildings.",
    "power": "Boiler and turbine stair towers.",
    "og": "Module and offshore escape stairs.",
    "mid_title": "Select tread type",
    "mid_body": """<p>Compare <a href="{p}products/stair-treads/welded-stair-treads/">welded</a>, <a href="{p}products/stair-treads/serrated-stair-treads/">serrated</a>, <a href="{p}products/stair-treads/bolted-stair-treads/">bolted</a>, and <a href="{p}products/stair-treads/custom-stair-treads/">custom</a>.</p>""",
    "related_title": "Related",
    "related": [
        ("engineering/load-tables/stair-treads/", "Stair tread tables"),
        ("solutions/applications/stair-systems/", "Stair systems"),
        ("blog/anti-slip-stair-treads-guide/", "Anti-slip guide"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Do you need stringer drawings?", "Yes for every quotation."),
        ("Nosing options?", "Checker, abrasive, or luminous—state preference."),
        ("Open risers?", "Confirm local code acceptance before detailing."),
        ("Ship loose or welded?", "State preferred shipping form for site logistics."),
    ],
}

SPECS["trench-covers/index.html"] = {
    "h1": "Industrial trench covers & access hatches",
    "apps_title": "Trench cover applications",
    "dc": "Campus utility trenches and data-hall perimeter routes.",
    "power": "Plant roads crossing buried services.",
    "og": "Tank farm and pipe rack crossings.",
    "mid_title": "Choose load class first",
    "mid_body": """<p>Review <a href="{p}products/trench-covers/standard-trench-covers/">standard</a>, <a href="{p}products/trench-covers/heavy-duty-trench-covers/">heavy-duty</a>, and <a href="{p}products/trench-covers/custom-fabricated-covers/">custom</a> lines.</p>""",
    "related_title": "Related",
    "related": [
        ("blog/trench-covers-selection-guide/", "Selection guide"),
        ("solutions/applications/drainage-covers/", "Drainage covers"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Hinged vs removable?", "Depends on access frequency and safety rules."),
        ("Load testing?", "Available—request in RFQ."),
        ("Traffic growth?", "Future forklift use may force upgrade from standard to heavy-duty class."),
        ("Coordination with civil?", "Embed tolerances belong on both structural and MEP drawings."),
    ],
}

SPECS["accessories/index.html"] = {
    "h1": "Grating clips, banding & edge components",
    "apps_title": "Accessories in operation",
    "dc": "Demountable platforms for future cable upgrades.",
    "power": "Vibration-prone decks needing hold-downs.",
    "og": "Offshore inspection programs tracking clip torque paint.",
    "mid_title": "Specify with the mesh package",
    "mid_body": """<p>Order <a href="{p}products/accessories/saddle-clips/">saddle clips</a>, <a href="{p}products/accessories/hold-down-clips/">hold-downs</a>, <a href="{p}products/accessories/banding-bars/">banding</a>, and <a href="{p}products/accessories/toe-plates/">toe plates</a> alongside panels.</p>""",
    "related_title": "Related",
    "related": [
        ("engineering/installation-fixings/", "Installation fixings"),
        ("products/bar-grating/welded-bar-grating/", "Welded grating"),
        ("rfq/", "Request a quote"),
    ],
    "faqs": [
        ("Kit format?", "Yes—panel counts drive clip quantities."),
        ("Hot-dip small parts?", "Sherardized or galvanized per part size."),
        ("Spare parts?", "Owners often order clip spares for O&M—state percentage."),
        ("Mixed materials?", "Isolate stainless clips from carbon supports if galvanic risk exists."),
    ],
}


def page_url(rel: str) -> str:
    path = rel.replace("index.html", "").replace("\\", "/")
    return f"https://wibergmetal.com/products/{path}"


def process_file(rel: str, spec: dict[str, Any]) -> None:
    path = os.path.join(PRODUCTS, rel.replace("/", os.sep))
    with open(path, encoding="utf-8") as f:
        content = f.read()
    prefix = root_prefix(rel)
    p = prefix  # noqa

    faqs = []
    for q, a in spec["faqs"]:
        faqs.append((q, a.format(p=prefix)))

    mid_body = spec["mid_body"].format(p=prefix)
    if rel == "index.html":
        blk = block_products_hub(
            prefix,
            spec["apps_title"],
            spec["dc"],
            spec["power"],
            spec["og"],
            spec["mid_title"],
            mid_body,
            spec["related_title"],
            [(h, lbl) for h, lbl in spec["related"]],
            faqs,
        )
    else:
        blk = block(
            prefix,
            spec["apps_title"],
            spec["dc"],
            spec["power"],
            spec["og"],
            spec["mid_title"],
            mid_body,
            spec["related_title"],
            [(h, lbl) for h, lbl in spec["related"]],
            faqs,
        )

    content = strip_old_faq(content)
    content = strip_prior_seo_block(content)
    content = inject_block(content, blk)
    content = replace_h1(content, spec["h1"])
    content = upsert_faq_json(content, page_url(rel), faqs)

    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("OK", rel)


def main() -> None:
    for rel in sorted(SPECS.keys()):
        process_file(rel, SPECS[rel])


if __name__ == "__main__":
    main()
