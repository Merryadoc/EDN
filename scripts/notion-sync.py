#!/usr/bin/env python3
"""
Synchronise la base Notion « Items » vers le site (API officielle Notion, sans dépendance).

  NOTION_TOKEN=secret_xxx python3 scripts/notion-sync.py [--all] [--force] [--limit N]

Étapes :
  1. liste les pages de la base -> data/notion/items.tsv
  2. régénère data/notion/index.js (organes, numéros d'items)
  3. pour chaque page « Terminé » ou « En cours » (--all : toutes) modifiée depuis la
     dernière synchronisation : télécharge les blocs, les convertit en fiche
     (data/notion/fiches/<id>.js) et rapatrie les images (assets/notion/<id>/)
  4. régénère l'index (statut « consultable » des fiches)

Prérequis : une intégration Notion (https://www.notion.so/my-integrations) avec accès en
lecture à la base « Items » (menu ••• de la base > Connexions > ajouter l'intégration).
Variables : NOTION_TOKEN (obligatoire), NOTION_DATABASE_ID (par défaut : base Items).
"""
import argparse
import datetime
import importlib.util
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from notion_convert import api_to_nodes, fiche_js, nodes_to_fiche  # noqa: E402

API = "https://api.notion.com/v1"
VERSION = "2022-06-28"
DEFAULT_DB = "cd38f5229e3f4ee1b0f13b94be9a3673"
ITEMS = ROOT / "data" / "notion" / "items.tsv"
FICHES = ROOT / "data" / "notion" / "fiches"
ASSETS = ROOT / "assets" / "notion"
STATE = ROOT / "data" / "notion" / "sync-state.json"
ETAT_CODE = {"Terminé": "T", "En cours": "E", "Pas commencé": "P"}

TOKEN = os.environ.get("NOTION_TOKEN", "")


def request(method, path, body=None, retries=5):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method, headers={
        "Authorization": f"Bearer {TOKEN}",
        "Notion-Version": VERSION,
        "Content-Type": "application/json",
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                time.sleep(0.34)  # limite de l'API : ~3 requêtes/s
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                time.sleep(float(e.headers.get("Retry-After", 2 ** attempt)))
                continue
            raise SystemExit(f"Erreur API Notion {e.code} sur {path} : {e.read().decode()[:300]}")
        except urllib.error.URLError:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise


def plain(rt):
    return "".join(t.get("plain_text", "") for t in rt or [])


def query_database(db):
    pages, cursor = [], None
    while True:
        body = {"page_size": 100, **({"start_cursor": cursor} if cursor else {})}
        r = request("POST", f"/databases/{db}/query", body)
        pages += r["results"]
        if not r.get("has_more"):
            return pages
        cursor = r["next_cursor"]


def children(block_id):
    out, cursor = [], None
    while True:
        q = f"?page_size=100" + (f"&start_cursor={cursor}" if cursor else "")
        r = request("GET", f"/blocks/{block_id}/children{q}")
        for b in r["results"]:
            if b.get("has_children") and b["type"] not in ("child_page", "child_database"):
                b["children"] = children(b["id"])
            out.append(b)
        if not r.get("has_more"):
            return out
        cursor = r["next_cursor"]


def page_row(p):
    props = p["properties"]
    nom = next((plain(v["title"]) for v in props.values() if v["type"] == "title"), "")
    mat = props.get("Matière", {}).get("multi_select", []) or []
    etat = (props.get("État", {}).get("status") or {}).get("name", "")
    return {
        "nom": nom.replace("|", "/").strip(),
        "matieres": ",".join(m["name"] for m in mat),
        "etat": ETAT_CODE.get(etat, "?"),
        "id": p["id"].replace("-", ""),
        "edited": p["last_edited_time"],
    }


def build_index():
    spec = importlib.util.spec_from_file_location("bni", ROOT / "scripts" / "build-notion-index.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()
    s = (ROOT / "data" / "notion" / "index.js").read_text(encoding="utf-8")
    return {e["notion"]: e for e in json.loads(s[s.index("["): s.rindex("]") + 1])}


def download_images(fiche, fid):
    """Les URL de fichiers Notion expirent au bout d'une heure : on les rapatrie dans le dépôt."""
    folder = ASSETS / fid
    for s in fiche["sections"]:
        for b in _walk(s["blocs"]):
            if b.get("type") != "image":
                continue
            src = b["src"]
            name = b.pop("block_id", None) or str(abs(hash(src)))
            try:
                with urllib.request.urlopen(src, timeout=60) as r:
                    ext = mimetypes.guess_extension(r.headers.get_content_type()) or ".png"
                    folder.mkdir(parents=True, exist_ok=True)
                    path = folder / f"{name}{ext}"
                    path.write_bytes(r.read())
                b["src"] = path.relative_to(ROOT).as_posix()
            except Exception as e:  # image inaccessible : on la retire
                print(f"    image ignorée ({e})")
                b["type"] = "p"
                b["texte"] = "*[image non disponible]*"


def _walk(blocs):
    for b in blocs:
        yield b
        if b.get("type") == "colonnes":
            for c in b["items"]:
                yield from _walk(c["blocs"])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--all", action="store_true", help="importer aussi les fiches « Pas commencé »")
    ap.add_argument("--force", action="store_true", help="réimporter même les pages non modifiées")
    ap.add_argument("--limit", type=int, default=0, help="nombre maximal de pages à importer (test)")
    args = ap.parse_args()
    if not TOKEN:
        raise SystemExit("NOTION_TOKEN manquant (voir l'en-tête du script).")

    db = os.environ.get("NOTION_DATABASE_ID", DEFAULT_DB)
    print(f"Lecture de la base {db}…")
    rows = sorted((page_row(p) for p in query_database(db)), key=lambda r: r["nom"])
    ITEMS.write_text("nom|matieres|etat|notion_id\n" + "".join(
        f"{r['nom']}|{r['matieres']}|{r['etat']}|{r['id']}\n" for r in rows), encoding="utf-8")
    print(f"{len(rows)} pages listées")

    index = build_index()
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    FICHES.mkdir(parents=True, exist_ok=True)
    wanted = {"T", "E"} | ({"P"} if args.all else set())
    todo = [r for r in rows if r["etat"] in wanted and r["id"] in index and (
        args.force or state.get(r["id"]) != r["edited"]
        or not (FICHES / f"{index[r['id']]['id']}.js").exists())]
    if args.limit:
        todo = todo[: args.limit]
    print(f"{len(todo)} page(s) à importer")

    today = datetime.date.today().isoformat()
    for n, r in enumerate(todo, 1):
        fid = index[r["id"]]["id"]
        print(f"[{n}/{len(todo)}] {fid}")
        fiche = nodes_to_fiche(api_to_nodes(children(r["id"])))
        if not fiche["sections"]:
            state[r["id"]] = r["edited"]
            continue
        download_images(fiche, fid)
        fiche["maj"] = today
        (FICHES / f"{fid}.js").write_text(fiche_js(fid, fiche), encoding="utf-8")
        state[r["id"]] = r["edited"]
        if n % 25 == 0:
            STATE.write_text(json.dumps(state, indent=0, sort_keys=True))

    # Fiches dont la page a disparu de Notion
    valid = {e["id"] for e in index.values()}
    for f in FICHES.glob("*.js"):
        if f.stem not in valid:
            f.unlink()
            print(f"supprimée : {f.name}")

    STATE.write_text(json.dumps(state, indent=0, sort_keys=True))
    build_index()


if __name__ == "__main__":
    main()
