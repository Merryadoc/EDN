"""
Conversion d'une page Notion en fiche du site (format lu par js/render.js).

Deux entrées possibles, converties en un même arbre intermédiaire de « nœuds » :
  - md_to_nodes()  : Markdown Notion (format renvoyé par l'outil Notion MCP / « enhanced markdown ») ;
  - api_to_nodes() : blocs JSON de l'API officielle Notion (scripts/notion-sync.py).
Puis nodes_to_fiche() produit la fiche.

Nœud : {"kind": str, "text": str, "color": str, "children": [nœuds], ...}
  kind ∈ h1 h2 h3 p li oli toggle callout columns column divider table image quote
"""
import html
import json
import re

# --------------------------------------------------------------------------
# Texte enrichi -> balisage inline du site (**gras**, *italique*, ==surligné==, `code`, [lien](url))
# --------------------------------------------------------------------------

# Liens vers des contenus payants / privés : on garde le texte, on retire le lien
DEAD_LINK = re.compile(r"hypocampus\.fr|hypo-media")


def md_inline(s, br=" "):
    """Texte enrichi Markdown Notion -> balisage du site."""
    s = re.sub(r"\[([^\]]*)\]\(([^)]*)\)", lambda m: m.group(1) if DEAD_LINK.search(m.group(2)) else m.group(0), s)
    s = re.sub(r"<span[^>]*color=\"[^\"]+\"[^>]*>(.*?)</span>", r"==\1==", s)
    s = re.sub(r"</?span[^>]*>", "", s)
    s = re.sub(r"<mention-[a-z-]+[^>]*>(.*?)</mention-[a-z-]+>", r"\1", s)
    s = re.sub(r"<mention-[a-z-]+[^>]*/>", "", s)
    s = re.sub(r"\$`(.+?)`\$", r"`\1`", s)
    s = s.replace("<br>", br).replace("~~", "")
    s = re.sub(r"\[\^[^\]]*\]", "", s)  # citations
    s = re.sub(r"\\([\\*~`$\[\]<>{}|^_#+\-.!])", r"\1", s)  # échappements
    s = html.unescape(s)
    s = re.sub(r"\*\*\s*\*\*", "", s)
    s = re.sub(r"====", "", s)
    return s.strip()


def api_rich_text(rt):
    """Liste rich_text de l'API -> balisage du site."""
    out = []
    for t in rt or []:
        txt = t.get("plain_text", "")
        if not txt:
            continue
        a = t.get("annotations", {})
        lead = len(txt) - len(txt.lstrip())
        trail = len(txt) - len(txt.rstrip())
        core = txt.strip()
        if core:
            if a.get("code"):
                core = f"`{core}`"
            if a.get("italic"):
                core = f"*{core}*"
            if a.get("bold"):
                core = f"**{core}**"
            if a.get("color", "default") != "default":
                core = f"=={core}=="
            href = t.get("href")
            if href and href.startswith("http") and not DEAD_LINK.search(href):
                core = f"[{core}]({href})"
        out.append(" " * lead + core + " " * trail)
    s = "".join(out)
    s = re.sub(r"\*\*\s*\*\*", "", s)
    return s.strip()


def norm_color(c):
    c = (c or "default").replace("_background", "").replace("_bg", "")
    return "" if c == "default" else c


# --------------------------------------------------------------------------
# Markdown Notion -> nœuds
# --------------------------------------------------------------------------

ATTR = re.compile(r"\s*\{([a-z-]+=\"[^\"]*\"\s*)+\}\s*$")


def _attrs(s):
    return dict(re.findall(r'([a-z-]+)="([^"]*)"', s))


def _split_attrs(s):
    m = ATTR.search(s)
    if not m:
        return s, {}
    return s[: m.start()], _attrs(m.group(0))


def _depth(line):
    return len(line) - len(line.lstrip("\t"))


def md_to_nodes(text):
    lines = text.replace("\r", "").split("\n")
    nodes, _ = _parse(lines, 0, 0)
    return nodes


def _parse(lines, i, depth):
    nodes = []
    while i < len(lines):
        raw = lines[i]
        s = raw.strip()
        if not s:
            i += 1
            continue
        d = _depth(raw)
        if d < depth or s.startswith("</"):
            return nodes, i
        i += 1
        if s in ("<empty-block/>",) or s.startswith("<table_of_contents"):
            continue
        if s == "---":
            nodes.append({"kind": "divider"})
            continue

        m = re.match(r"<(columns|column|callout|details|synced_block|synced_block_reference)(\s[^>]*)?>$", s)
        if m:
            tag, attrs = m.group(1), _attrs(m.group(2) or "")
            node = {"kind": {"details": "toggle", "synced_block": "group",
                             "synced_block_reference": "group"}.get(tag, tag),
                    "color": norm_color(attrs.get("color")), "text": ""}
            if tag == "details":
                # <summary> sur la ligne suivante, au même niveau
                while i < len(lines) and not lines[i].strip():
                    i += 1
                sm = re.match(r"<summary>(.*)</summary>$", lines[i].strip()) if i < len(lines) else None
                if sm:
                    node["text"] = md_inline(sm.group(1))
                    i += 1
            node["children"], i = _parse(lines, i, d + 1)
            if i < len(lines) and lines[i].strip() == f"</{tag}>":
                i += 1
            if tag == "callout" and node["children"] and node["children"][0]["kind"] == "p":
                node["text"] = node["children"].pop(0)["text"]
            nodes.append(node)
            continue

        if s.startswith("<table"):
            rows, header = [], 'header-row="true"' in s
            while i < len(lines) and lines[i].strip() != "</table>":
                rows.append(lines[i].strip())
                i += 1
            i += 1
            body = " ".join(rows)
            table = [[md_inline(c, br="\n") for c in re.findall(r"<td[^>]*>(.*?)</td>", tr)]
                     for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", body)]
            nodes.append({"kind": "table", "rows": table, "header": header})
            continue

        mi = re.match(r"!\[(.*?)\]\((.+?)\)", s)
        if mi and DEAD_LINK.search(mi.group(2)):
            continue
        if mi:
            nodes.append({"kind": "image", "text": md_inline(mi.group(1)), "src": mi.group(2)})
            continue
        if re.match(r"<(page|database|file|pdf|audio|video|embed|unknown|custom-block|folder)\b", s):
            continue

        mh = re.match(r"(#{1,4})\s+(.*)$", s)
        body, attrs = _split_attrs(s)
        node = None
        if mh:
            level = min(len(mh.group(1)), 3)
            node = {"kind": f"h{level}", "text": md_inline(_split_attrs(mh.group(2))[0])}
        elif re.match(r"- \[[ x]\] ", s):
            node = {"kind": "li", "text": md_inline(body[6:])}
        elif s.startswith("- ") or s == "-":
            node = {"kind": "li", "text": md_inline(body[2:])}
        elif re.match(r"\d+\. ", s):
            node = {"kind": "oli", "text": md_inline(re.sub(r"^\d+\.\s", "", body))}
        elif s.startswith("> "):
            node = {"kind": "quote", "text": md_inline(body[2:])}
        else:
            node = {"kind": "p", "text": md_inline(body)}
        node["color"] = norm_color(attrs.get("color"))
        node["children"], i = _parse(lines, i, d + 1)
        nodes.append(node)
    return nodes, i


# --------------------------------------------------------------------------
# Blocs de l'API Notion -> nœuds (les enfants doivent être déjà chargés dans block["children"])
# --------------------------------------------------------------------------

API_KIND = {
    "paragraph": "p", "heading_1": "h1", "heading_2": "h2", "heading_3": "h3",
    "bulleted_list_item": "li", "numbered_list_item": "oli", "to_do": "li", "toggle": "toggle",
    "callout": "callout", "column_list": "columns", "column": "column", "divider": "divider",
    "quote": "quote", "synced_block": "group", "code": "p", "equation": "p",
}


def api_to_nodes(blocks):
    nodes = []
    for b in blocks:
        t = b.get("type")
        data = b.get(t, {}) or {}
        children = api_to_nodes(b.get("children", []))
        if t == "table":
            rows = [[api_rich_text(c) for c in r.get("table_row", {}).get("cells", [])]
                    for r in b.get("children", []) if r.get("type") == "table_row"]
            nodes.append({"kind": "table", "rows": rows, "header": data.get("has_column_header", False)})
            continue
        if t == "image":
            src = (data.get("file") or data.get("external") or {}).get("url", "")
            if DEAD_LINK.search(src):
                continue
            nodes.append({"kind": "image", "src": src, "text": api_rich_text(data.get("caption")),
                          "block_id": b.get("id")})
            continue
        if t in ("bookmark", "link_preview", "embed") and data.get("url"):
            nodes.append({"kind": "p", "text": f"[{data['url']}]({data['url']})", "children": []})
            continue
        if t == "equation":
            nodes.append({"kind": "p", "text": f"`{data.get('expression', '')}`", "children": []})
            continue
        kind = API_KIND.get(t)
        if not kind:
            continue  # child_page, child_database, unsupported…
        text = api_rich_text(data.get("rich_text"))
        if t == "code":
            text = f"`{text.strip('`')}`"
        nodes.append({"kind": kind, "text": text, "color": norm_color(data.get("color")), "children": children})
    return nodes


# --------------------------------------------------------------------------
# Nœuds -> fiche
# --------------------------------------------------------------------------

PLACEHOLDERS = {"titre", "title", ""}
CALLOUT_STYLE = {"red": "urgence", "orange": "piege", "yellow": "piege", "brown": "piege",
                 "blue": "info", "green": "astuce", "purple": "astuce", "pink": "important", "gray": "info", "": "info"}


def _flatten_groups(nodes):
    out = []
    for n in nodes:
        if n["kind"] == "group":
            out.extend(_flatten_groups(n.get("children", [])))
        else:
            out.append(n)
    return out


def _is_empty(nodes):
    for n in _flatten_groups(nodes):
        if n["kind"] == "divider":
            continue
        if n["kind"] in ("table", "image"):
            return False
        if n.get("text") and n["text"].strip(" -—*") or not _is_empty(n.get("children", [])):
            if n["kind"] in ("h1", "h2", "h3") and n["text"].strip("* ").lower() in PLACEHOLDERS:
                continue
            return False
    return True


def _list_item(n):
    item = {"texte": n.get("text", "")}
    sous = _items(n.get("children", []))
    if sous:
        item["sous"] = sous
    if n["kind"] == "toggle":
        item["replie"] = True
    return item


def _items(nodes):
    """Enfants d'un élément de liste -> sous-éléments."""
    out = []
    for n in _flatten_groups(nodes):
        k = n["kind"]
        if k in ("li", "oli", "toggle", "p", "quote", "callout", "h1", "h2", "h3"):
            if k == "p" and not n.get("text") and not n.get("children"):
                continue
            it = _list_item(n)
            if k.startswith("h"):
                it["texte"] = f"**{it['texte'].strip('*')}**"
            out.append(it)
        elif k == "table" and n["rows"]:
            out.append({"texte": "", "tableau": _table_bloc(n)})
    return out


def _table_bloc(n):
    rows = n["rows"]
    if n.get("header") and len(rows) > 1:
        return {"type": "tableau", "colonnes": rows[0], "lignes": rows[1:]}
    return {"type": "tableau", "colonnes": [""] * len(rows[0]), "lignes": rows, "sansEntete": True}


def content_to_blocs(nodes):
    blocs, pending, ordered = [], [], False

    def flush():
        nonlocal pending
        if pending:
            blocs.append({"type": "liste", "items": pending, **({"ordonnee": True} if ordered else {})})
            pending = []

    for n in _flatten_groups(nodes):
        k = n["kind"]
        if k in ("li", "toggle", "oli"):
            if pending and (k == "oli") != ordered:
                flush()
            ordered = k == "oli"
            if n.get("text") or n.get("children"):
                pending.append(_list_item(n))
            continue
        flush()
        if k == "divider":
            continue
        if k == "p":
            if n.get("text"):
                blocs.append({"type": "p", "texte": n["text"]})
            if n.get("children"):
                blocs.extend(content_to_blocs(n["children"]))
        elif k in ("h1", "h2", "h3"):
            t = n["text"].strip("* ")
            if t.lower() not in PLACEHOLDERS:
                blocs.append({"type": "titre", "texte": n["text"]})
            if n.get("children"):
                blocs.extend(content_to_blocs(n["children"]))
        elif k in ("callout", "quote"):
            items = _items(n.get("children", []))
            if n.get("text") or items:
                b = {"type": "encadre", "style": CALLOUT_STYLE.get(n.get("color", ""), "info")}
                if n.get("text"):
                    b["texte"] = n["text"]
                if items:
                    b["items"] = items
                blocs.append(b)
        elif k == "table" and n["rows"]:
            blocs.append(_table_bloc(n))
        elif k == "image" and n.get("src"):
            blocs.append({"type": "image", "src": n["src"], "legende": n.get("text", ""),
                          **({"block_id": n["block_id"]} if n.get("block_id") else {})})
        elif k in ("columns", "column"):
            blocs.extend(columns_to_blocs(n) if k == "columns" else content_to_blocs(n.get("children", [])))
    flush()
    return blocs


def _card(column):
    kids = [c for c in _flatten_groups(column.get("children", [])) if c["kind"] != "divider"]
    titre = ""
    if kids and kids[0]["kind"] in ("h1", "h2", "h3"):
        h = kids.pop(0)
        titre = h["text"].strip()
        kids = h.get("children", []) + kids  # titre dépliable : ses enfants font partie de la carte
        if titre.strip("* ").lower() in PLACEHOLDERS:
            titre = ""
    blocs = content_to_blocs(kids)
    if not blocs:
        return None
    return {"titre": titre.replace("**", ""), "blocs": blocs}


def columns_to_blocs(node):
    cards = [c for c in (_card(col) for col in node.get("children", []) if col["kind"] == "column") if c]
    if not cards:
        return []
    if len(cards) == 1 and not cards[0]["titre"]:
        return cards[0]["blocs"]
    return [{"type": "colonnes", "items": cards}]


def _section_header(node):
    """Rangée de colonnes ne contenant qu'un titre (modèle des fiches Notion) -> (titre, couleur)."""
    if node["kind"] in ("h1", "h2") and not node.get("children"):
        return node["text"], node.get("color", "")
    if node["kind"] != "columns":
        return None
    found = []
    for col in node.get("children", []):
        kids = [k for k in _flatten_groups(col.get("children", []))
                if k["kind"] != "divider" and not (k["kind"] == "p" and not k.get("text") and not k.get("children"))]
        if not kids:
            continue
        if len(kids) == 1 and kids[0]["kind"] in ("h1", "h2") and not kids[0].get("children"):
            found.append(kids[0])
        else:
            return None
    if len(found) == 1:
        return found[0]["text"], found[0].get("color", "")
    return None


def nodes_to_fiche(nodes):
    sections = []
    cur = {"titre": "Généralités", "couleur": "", "blocs": []}

    def push():
        if cur["blocs"]:
            sections.append(cur)

    nodes = _flatten_groups(nodes)
    definition = None
    # Encadré placé en tête de page (sans enfants) : c'est la définition de la fiche
    first = next((n for n in nodes if not _is_empty([n])), None)
    if first and first["kind"] == "callout" and first.get("text") and not first.get("children"):
        definition = first["text"]
        nodes = [n for n in nodes if n is not first]

    for n in nodes:
        hdr = _section_header(n)
        if hdr:
            push()
            cur = {"titre": re.sub(r"\s+", " ", hdr[0]).replace("**", "").strip(), "couleur": hdr[1], "blocs": []}
            continue
        if n["kind"] in ("h1", "h2") and n.get("children"):  # titre dépliable
            push()
            cur = {"titre": n["text"].replace("**", "").strip(), "couleur": n.get("color", ""), "blocs": []}
            cur["blocs"].extend(content_to_blocs(n["children"]))
            continue
        if _is_empty([n]):
            continue
        cur["blocs"].extend(content_to_blocs([n]))
    push()

    fiche = {"sections": [s for s in sections if s["blocs"]]}
    if definition:
        fiche["definition"] = definition
        return fiche
    # Sinon, définition mise en avant si une carte « Définition » existe
    for s in fiche["sections"][:2]:
        for b in s["blocs"]:
            if b["type"] == "colonnes":
                for c in b["items"]:
                    if c["titre"].lower().startswith("définition"):
                        lst = next((x for x in c["blocs"] if x["type"] == "liste"), None)
                        if lst and lst["items"]:
                            fiche["definition"] = lst["items"][0]["texte"]
                        break
            if "definition" in fiche:
                break
        if "definition" in fiche:
            break
    return fiche


def fiche_js(fid, fiche):
    return ("/* Généré depuis Notion — ne pas modifier à la main (relancer la synchronisation). */\n"
            f"window.EDN.fiches[{json.dumps(fid)}] = "
            f"{json.dumps(fiche, ensure_ascii=False, separators=(',', ':'))};\n")
