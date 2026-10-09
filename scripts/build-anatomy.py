#!/usr/bin/env python3
"""
Construit les silhouettes interactives du site à partir des anatomogrammes
de l'EMBL-EBI Expression Atlas (CC BY 4.0, voir assets/anatomogram/LICENSE.md).

Entrée  : assets/anatomogram/source/homo_sapiens.{female,male}.svg
Sortie  : assets/anatomogram/corps-{femme,homme}.js
          (le SVG nettoyé, stocké dans window.EDN.SVG pour fonctionner aussi en file://)

Chaque organe du site (data/organes.js) regroupe un ou plusieurs identifiants UBERON.
Usage : python3 scripts/build-anatomy.py
"""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "anatomogram" / "source"
OUT = ROOT / "assets" / "anatomogram"
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

# Organe du site -> identifiants UBERON, du plan le plus profond au plus superficiel.
# L'ordre du dictionnaire fixe l'ordre d'empilement (premier = dessous).
ORGANS = {
    # Cartilage du genou (dupliqué en miroir pour l'autre genou, voir MIRROR)
    "articulations": ["UBERON_0007844"],
    "vaisseaux": ["UBERON_0000947"],
    "estomac": ["UBERON_0001043", "UBERON_0000945", "UBERON_0007650"],
    "intestins": ["UBERON_0001155", "UBERON_0002108", "UBERON_0002116", "UBERON_0002114",
                  "UBERON_0001153", "UBERON_0001154", "UBERON_0001052"],
    "pancreas": ["UBERON_0001264"],
    "rate": ["UBERON_0002106"],
    "foie": ["UBERON_0002107", "UBERON_0002110"],
    # Reins rétropéritonéaux : affichés au-dessus des intestins pour rester cliquables
    "reins": ["UBERON_0002113", "UBERON_0002369"],
    "vessie": ["UBERON_0001255"],
    "genital-feminin": ["UBERON_0000995", "UBERON_0000992", "UBERON_0003889", "UBERON_0000002",
                        "UBERON_0000996"],
    "genital-masculin": ["UBERON_0002367", "UBERON_0000473", "UBERON_0001301", "UBERON_0000998",
                         "UBERON_0001000"],
    "seins": ["UBERON_0000310"],
    "poumons": ["UBERON_0002048", "UBERON_0003126", "UBERON_0002185"],
    "coeur": ["UBERON_0000948"],
    "thyroide": ["UBERON_0002046"],
    "orl": ["UBERON_0001728", "UBERON_0000341", "UBERON_0002372", "UBERON_0001831",
            "UBERON_0001736"],
    "cerveau": ["UBERON_0000955"],
    "yeux": ["UBERON_0000970"],
}
SKIN = "UBERON_0000014"
# Organes présents d'un seul côté dans la source, recopiés en miroir (symétrie gauche/droite)
MIRROR = {"articulations"}

# Attributs de présentation retirés : l'apparence est gérée par css/style.css
STRIP = {"style", "fill", "stroke", "opacity", "fill-opacity", "stroke-width", "clip-path",
         "filter", "mask", "display", "visibility"}
KEEP = {"d", "cx", "cy", "rx", "ry", "r", "x", "y", "width", "height", "transform", "points"}
NUM = re.compile(r"-?\d+\.\d{3,}")


def tag(e):
    return e.tag.split("}")[-1]


def clean(e):
    """Copie profonde sans métadonnées Inkscape ni styles, nombres arrondis."""
    t = tag(e)
    if t in ("title", "desc", "metadata", "use", "text", "a"):
        return None
    c = ET.Element(f"{{{SVG_NS}}}{t}")
    for k, v in e.attrib.items():
        k = k.split("}")[-1]
        if k in KEEP and k not in STRIP:
            c.set(k, NUM.sub(lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), v))
    for child in e:
        cc = clean(child)
        if cc is not None:
            c.append(cc)
    if t == "g" and not len(c):
        return None
    return c


def build(src_name, out_name, label):
    root = ET.parse(SRC / src_name).getroot()
    by_id = {e.get("id"): e for e in root.iter() if e.get("id")}
    layer_efo = by_id["LAYER_EFO"]

    svg = ET.Element(f"{{{SVG_NS}}}svg", {
        "viewBox": root.get("viewBox"),
        "class": "body-svg",
        "role": "img",
        "aria-label": f"Corps humain ({label}) interactif : cliquez sur un organe",
    })
    fig = ET.SubElement(svg, f"{{{SVG_NS}}}g", {"class": "body-figure"})

    # Peau = silhouette remplie (cliquable) + contour d'origine par-dessus
    skin_g = ET.SubElement(fig, f"{{{SVG_NS}}}g", {"class": "organ organ-skin", "data-organ": "peau"})
    efo_wrap = {}
    for k in ("transform",):
        if layer_efo.get(k):
            efo_wrap[k] = layer_efo.get(k)
    skin = clean(by_id[SKIN])
    # Dans la source, la peau est un anneau (contour externe + interne) :
    # on ne garde que le contour interne pour obtenir une silhouette pleine.
    subpaths = [sp for sp in re.split(r"(?=M)", skin.get("d").strip()) if sp.strip()]
    skin.set("d", subpaths[-1])
    skin.set("class", "skin-fill")
    ET.SubElement(skin_g, f"{{{SVG_NS}}}g", efo_wrap).append(skin)
    outline = clean(by_id["LAYER_OUTLINE"])
    outline.set("class", "skin-outline")
    skin_g.append(outline)

    organs = ET.SubElement(fig, f"{{{SVG_NS}}}g", {"class": "organs", **efo_wrap})
    present = []
    for organ, ids in ORGANS.items():
        parts = [clean(by_id[i]) for i in ids if i in by_id]
        parts = [p for p in parts if p is not None]
        if not parts:
            continue
        g = ET.SubElement(organs, f"{{{SVG_NS}}}g", {"class": "organ", "data-organ": organ})
        inner = ET.SubElement(g, f"{{{SVG_NS}}}g", {"class": "organ-inner"})
        for p in parts:
            inner.append(p)
        if organ in MIRROR:
            width = float(root.get("viewBox").split()[2])
            mirror = ET.SubElement(inner, f"{{{SVG_NS}}}g", {"transform": f"matrix(-1,0,0,1,{width:.2f},0)"})
            for p in parts:
                mirror.append(clean(p))
        present.append(organ)

    xml = ET.tostring(svg, encoding="unicode")
    xml = xml.replace(' xmlns:ns0="http://www.w3.org/2000/svg"', "").replace("ns0:", "")
    xml = re.sub(r">\s+<", "><", xml)
    js = (
        "/* Généré par scripts/build-anatomy.py — ne pas modifier à la main.\n"
        " * Illustration : EMBL-EBI Expression Atlas anatomogram, CC BY 4.0 (assets/anatomogram/LICENSE.md) */\n"
        "window.EDN = window.EDN || {};\nwindow.EDN.SVG = window.EDN.SVG || {};\n"
        f"window.EDN.SVG[{json.dumps(label)}] = {json.dumps(xml, ensure_ascii=False)};\n"
    )
    (OUT / out_name).write_text(js, encoding="utf-8")
    print(f"{out_name}: {len(js) // 1024} Ko, organes : {', '.join(present)}")


if __name__ == "__main__":
    build("homo_sapiens.female.svg", "corps-femme.js", "femme")
    build("homo_sapiens.male.svg", "corps-homme.js", "homme")
