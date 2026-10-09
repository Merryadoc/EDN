#!/usr/bin/env python3
"""
Construit data/notion/index.js à partir de data/notion/items.tsv
(export de la base Notion « Items » : nom|matieres|etat|notion_id).

Chaque fiche est rattachée à un ou plusieurs organes du site :
  1. par mots-clés dans le titre (ORGAN_RULES) ;
  2. à défaut, par ses matières (MATIERE_ORGAN) ;
  3. à défaut, à « transversal ».

Usage : python3 scripts/build-notion-index.py
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "notion" / "items.tsv"
OUT = ROOT / "data" / "notion" / "index.js"
FICHES = ROOT / "data" / "notion" / "fiches"


def norm(s):
    s = unicodedata.normalize("NFD", s.lower().replace("œ", "oe").replace("æ", "ae"))
    return "".join(c for c in s if unicodedata.category(c) != "Mn").replace("’", "'")


# Mots-clés (sur le titre normalisé, sans accents) -> organe
ORGAN_RULES = [
    ("seins", r"\bsein|mammaire|gynecomastie|allaitement"),
    ("genital-masculin", r"prostat|testic|scrot|penis|phimosis|erecti|priapisme|lapeyronie|varicocele|"
                         r"hydrocele|cordon spermatique|orchi|fournier|andropause|cryptorchid|meat uretral|"
                         r"rupture du frein|infertilite de l'homme|contraception masculine"),
    ("genital-feminin", r"grossesse|trimestre|accouchement|uter|endometr|ovair|menstru|menopause|"
                        r"contraception feminine|interruption volontaire|infertilite de la femme|prolapsus|"
                        r"fibrome|pelvien|vagin|vulvo|cervicite|genitale haute|genitales de la femme|eclampsie|"
                        r"gestationnel|post-partum|suites de couche|amenorrhee|endometriose|procreation|"
                        r"hemorragie genitale|materni|premenstruel"),
    ("vessie", r"miction|incontinence|cystite|urinaire|retention aigue d'urines|vesic|sonde"),
    ("reins", r"renal|\brein|nephr|glomerul|dialyse|creatinin|proteinurie|hematurie|polykystose|surrenal|"
              r"hydro-sod|kali|acido-basique|acidose|alcalose|calcemie|deshydratation|hyperhydratation|"
              r"\badh\b|oligurie|anurie|diabete insipide|cushing|goodpasture|biopsie renale"),
    ("thyroide", r"thyro|goitre|basedow|hypophys|acromegal|prolactin|parathyro"),
    ("pancreas", r"pancrea|diabet|hypoglyc|acidocetose|hyperosmolaire|\blada\b|insuline"),
    ("foie", r"hepat|cirrhose|biliaire|cholecyst|angiocholite|ictere|ascite|varices oesophag|"
             r"hemochromatose|wilson|steatose"),
    ("estomac", r"oesophag|gastr|ulcere gastrique|reflux|hiatale|dyspepsie|dysphagie|achalasie|vomissement|"
                r"pylore|estomac|barrett|hemorragie digestive"),
    ("intestins", r"intestin|\bcolo|colique|rect|crohn|diarrhee|constipation|diverticul|appendic|occlusi|"
                  r"hemorroid|anus|coeliaque|invagination|peritonite|hernie parietale|parasitoses digestives|"
                  r"amoebose|anguillulose|ascaridiose|giardiose|oxyurose|taeniose|cryptosporidiose|lynch|"
                  r"polypose|mesenterique|douleurs abdominales|hemorragie digestive"),
    ("rate", r"splen|anemi|thrombop|purpura|hemostas|hemogramme|leucemi|lymphom|myelom|myelodysplas|"
             r"myeloprolif|vaquez|thrombocyt|drepanocyt|eosinophil|adenopathie|mononucleosique|"
             r"hemorragique d'origine|transfusion|agranulocytose|neutropenie|carence martiale|fer\b|"
             r"cellules souches"),
    ("vaisseaux", r"aort|arter|membres inferieurs|thrombose veineuse|embolie|veineu|vascularite|takayasu|"
                  r"raynaud|ulcere de jambe|athero|carotide|malformations vasculaires|acrocyanose|"
                  r"ischemies digitales|angiodermite|cellules geantes"),
    ("coeur", r"cardi|coronar|\bsca\b|angor|infarctus|tako|fibrillation|flutter|tachycardie|\bbloc|conduction|"
              r"extrasystole|palpitation|valv|mitral|insuffisance aortique|retrecissement aortique|endocardite|"
              r"pericard|myocard|\becg\b|souffle cardiaque|inter-auriculaire|inter-ventriculaire|fallot|"
              r"transposition|canal arteriel|\bhta\b|hypertension arterielle|urgence hypertensive|"
              r"risque cardio|dyslipidemie|arret cardio|acr et rcp|douleur thoracique|oedemes de membres|"
              r"anti-hypertenseurs|hypolipemiants|anti-agregants|sinusale"),
    ("poumons", r"pulmon|pneumo|bronch|asthme|bpco|toux|dyspnee|hemoptysie|pleur|respiratoire|tuberculose pulmonaire|"
                r"sarcoidose|mucovi|coqueluche|grippe|legionell|aspergill|apnee|tabac|detresse respiratoire|"
                r"corps etranger des voies aeriennes|sars-cov|anaphyla|quincke|thorax|thoracique|intra-thoraciques"),
    ("orl", r"otite|oreille|audit|surdit|presbyacousie|otospongiose|vertige|meniere|vestibul|labyrinth|rocher|"
            r"\bnez\b|nasal|sinus|rhino|epistaxis|angine|pharyn|laryn|dysphonie|saliva|sialad|parotid|"
            r"aero-digestives|cavite buccale|paralysie faciale|cholesteatome|zona auriculaire|schwan|dentaire|"
            r"mandibul|zygoma|le fort|centro-faciales|tissus mous de la face|labio-palatines|cellulite faciale|"
            r"crânio-facial|cranio-facial|oreillons|corps etranger du"),
    ("yeux", r"\boeil|ocul|ophtalm|visuel|\bvue\b|vision|retin|macul|glaucom|cataract|uveit|kerat|conjonctiv|"
             r"papill|diplopie|strabisme|amblyopie|palpebr|chalazion|orgelet|ptosis|entropion|ectropion|"
             r"blepharite|lagophtalmie|myopie|presbytie|astigmat|hypermetropie|orbit|cornee|endophtalmie|"
             r"sclerite|bernard-horner|vitre|refraction|champ visuel|fermeture de l'angle|hyphema|neuropathie optique"),
    ("cerveau", r"cerebr|encephal|mening|\bavc\b|accident vasculaire|ischemique transitoire|epilep|convuls|"
                r"cephal|migraine|parkinson|demence|alzheimer|sclerose en plaques|sclerose laterale|myasthenie|"
                r"lambert-eaton|guillain|neuropathie|coma|confusion|cranien|hematome extra|hematome sous|gliome|"
                r"meningiome|intracranien|sommeil|narcolepsie|hypersomnolence|insomnie|parasomnie|circadien|"
                r"chore|dystonie|huntington|myoclonie|tics|tremblement|atrophie multi|supranucleaire|deficit neuro|"
                r"deficit moteur|compression medullaire|queue de cheval|trijumeau|algies vasculaires|"
                r"douleurs cranio|neuropathies craniennes|cognitif|marche et de l'equilibre|psychomoteur|"
                r"perte de connaissance|tumeurs intracraniennes|tumeurs cerebrales"),
    ("peau", r"cutan|derm|eczema|psoriasis|acne|urticaire|prurit|melanome|naevus|carcinome basocellulaire|"
             r"carcinome epidermoide|keratose|bulleuse|pemphig|toxidermie|exanthem|erythem|escarre|brulure|"
             r"\bgale\b|pediculose|mycose|dermatophyt|impetigo|folliculite|\bzona\b|herpes|varicelle|verrue|"
             r"molluscum|rosacee|seborrheique|lupus cutane|sclerodermie|erythrodermie|photo|dress|pustulose|"
             r"necrolyse|pityriasis|intertrigo|erythrasma|teigne|larva migrans|lyell|stevens|engelures|"
             r"erythromelalgie|pyoderma|necrobiose|mal perforant|angiome|hemangiome|abces cutane|"
             r"grosse jambe rouge|lymphangite|rougeole|rubeole|scarlatine|kawasaki|megalerytheme|"
             r"eruption febrile|cancer de la peau|syphilis|condylome|chancre"),
    ("articulations", r"arthr|spondyl|goutte|rhumatisme|chondrocalcinose|osteo|fracture|luxation|entorse|tendin|"
                      r"bursit|bursopathie|capsulite|epicondyl|menisc|ligament|rachi|lumbago|cervicalgie|"
                      r"sciatique|cruralgie|radicul|canal carpien|hernie discale|infections de prothese|syndrome des loges|"
                      r"platre|boiterie|hanche|epiphysiolyse|tumeurs osseuses|pseudopolyarthrite|osteosynthese|"
                      r"douloureux regional|panaris|phlegmon|plexopathie|parsonage|defile thoraco|"
                      r"osgood|kyste poplite|coiffe des rotateurs|tendon|scaphoide|bennett|bassin|traumatisme des membres|"
                      r"traumatisme du pied|traumatisme du rachis|traumatisme vertebro|fractures pediatriques|"
                      r"douleur et epanchement articulaire|lombalgie|douleurs lombaires|anomalies orthopediques"),
]

# Matière Notion -> organe (repli quand aucun mot-clé ne correspond)
MATIERE_ORGAN = {
    "Cardio": "coeur", "Pneumo": "poumons", "Neuro": "cerveau", "Ophtalmo": "yeux", "ORL": "orl",
    "CMF": "orl", "Néphro": "reins", "Uro": "vessie", "Gynéco": "genital-feminin", "Dermato": "peau",
    "Rhumato": "articulations", "Ortho": "articulations", "Hémato": "rate", "HGE": "intestins",
    "Psy": "psychiatrie",
}


def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")
    return s[:60].rstrip("-")


def main():
    lines = SRC.read_text(encoding="utf-8").strip().split("\n")[1:]
    entries, used = [], set()
    for line in lines:
        nom, matieres, etat, nid = line.split("|")
        m = re.match(r"Item\s+(\d+)\s*-\s*(.+)", nom.strip())
        item, titre = (int(m.group(1)), m.group(2).strip()) if m else (None, nom.strip())
        matieres = [x.strip() for x in matieres.split(",") if x.strip()]
        t = norm(titre)
        organes = [o for o, rx in ORGAN_RULES if re.search(rx, t)]
        if not organes:
            organes = list(dict.fromkeys(MATIERE_ORGAN[x] for x in matieres if x in MATIERE_ORGAN))
        if not organes:
            organes = ["transversal"]
        base = f"{item}-{slug(titre)}" if item is not None else slug(titre)
        fid, k = base, 2
        while fid in used:
            fid, k = f"{base}-{k}", k + 1
        used.add(fid)
        entries.append({
            "id": fid,
            "titre": titre,
            "items": [item] if item else [],
            "organes": organes,
            "matieres": matieres,
            "notion": nid,
            "etat": {"T": "termine", "E": "en-cours", "P": "pas-commence"}.get(etat, etat),
            "statut": "redigee" if (FICHES / f"{fid}.js").exists() else "notion",
        })
    entries.sort(key=lambda e: (e["items"][0] if e["items"] else 0, norm(e["titre"])))
    js = (
        "/* Généré par scripts/build-notion-index.py depuis data/notion/items.tsv — ne pas modifier à la main. */\n"
        "window.EDN = window.EDN || {};\n"
        f"window.EDN.NOTION = {json.dumps(entries, ensure_ascii=False, separators=(',', ':'))};\n"
    )
    OUT.write_text(js.replace('},{', '},\n{'), encoding="utf-8")
    from collections import Counter
    c = Counter(o for e in entries for o in e["organes"])
    print(f"{len(entries)} fiches → {OUT.relative_to(ROOT)}")
    for o, n in c.most_common():
        print(f"  {o:18} {n}")


if __name__ == "__main__":
    main()
