#!/usr/bin/env python3
"""
Importe des pages Notion au format Markdown Notion (« enhanced markdown », tel que renvoyé
par l'outil Notion MCP) : un fichier <notion_id>.md par page.

Usage : python3 scripts/import-notion-md.py DOSSIER
Écrit data/notion/fiches/<id>.js puis régénère data/notion/index.js.
Pour une synchronisation complète et automatique, préférer scripts/notion-sync.py (API officielle).
"""
import datetime
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from notion_convert import fiche_js, md_to_nodes, nodes_to_fiche  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
FICHES = ROOT / "data" / "notion" / "fiches"


def load_index():
    s = (ROOT / "data" / "notion" / "index.js").read_text(encoding="utf-8")
    return {e["notion"]: e for e in json.loads(s[s.index("["): s.rindex("]") + 1])}


def main(folder):
    index = load_index()
    FICHES.mkdir(parents=True, exist_ok=True)
    today = datetime.date.today().isoformat()
    ok = 0
    for md in sorted(Path(folder).glob("*.md")):
        entry = index.get(md.stem)
        if not entry:
            print(f"  ? {md.name} : page absente de data/notion/items.tsv, ignorée")
            continue
        fiche = nodes_to_fiche(md_to_nodes(md.read_text(encoding="utf-8")))
        # Les URL d'images Notion sont signées et expirent : on ne les garde pas ici
        for s in fiche["sections"]:
            s["blocs"] = [b for b in s["blocs"] if b["type"] != "image"]
        if not fiche["sections"]:
            print(f"  - {entry['titre']} : page vide, ignorée")
            continue
        fiche["maj"] = today
        (FICHES / f"{entry['id']}.js").write_text(fiche_js(entry["id"], fiche), encoding="utf-8")
        ok += 1
        print(f"  ✓ {entry['id']}")
    print(f"{ok} fiche(s) importée(s)")
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-notion-index.py")], check=True)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "notion-md")
