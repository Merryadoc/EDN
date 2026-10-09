# Atlas EDN

Atlas interactif du corps humain pour réviser l'EDN : on clique sur un organe pour voir les items R2C qui s'y rapportent, puis on ouvre la fiche de chaque item. Les fiches viennent de la base Notion « Items », complétées par quelques fiches de synthèse rédigées pour le site (schémas, scores interactifs, algorithmes).

Le site est **100 % statique** : pas de build ni de dépendance. Il fonctionne sur GitHub Pages et s'ouvre aussi en local en double-cliquant sur `index.html`.

## Structure

```
index.html              Accueil : corps interactif (femme / homme) et recherche
organe.html?o=<id>      Fiches d'un organe, regroupées par item R2C
fiche.html?id=<id>      Une fiche (synthèse Atlas ou fiche Notion)
css/style.css           Styles (thème clair/sombre, impression)
js/anatomy.js           Corps interactif (organes cliquables, animations)
js/render.js            Rendu des blocs de contenu d'une fiche
data/organes.js         Organes / appareils
data/index.js           Fiches de synthèse Atlas (contenu : data/fiches/<id>.js)
data/notion/items.tsv   Liste des pages de la base Notion « Items »
data/notion/index.js    Index généré (organes, n° d'item) — ne pas modifier
data/notion/fiches/     Fiches converties depuis Notion — ne pas modifier
assets/anatomogram/     Illustration anatomique (CC BY 4.0, voir LICENSE.md)
scripts/                Outils (Python 3, sans dépendance)
```

## Synchroniser Notion (toutes les fiches, automatiquement)

Le script `scripts/notion-sync.py` lit la base « Items » via l'API officielle de Notion. Il convertit chaque page « Terminé » ou « En cours » en fiche du site, en conservant les sections colorées, les colonnes, les dépliants et les tableaux. Les images sont rapatriées dans `assets/notion/`.

1. **Créer une intégration Notion** sur <https://www.notion.so/my-integrations>, de type « Interne », avec la seule capacité « Lire le contenu ». Copier le jeton secret.
2. **Lui donner accès à la base** : ouvrir la base « Items » dans Notion, cliquer sur `•••` puis Connexions, et ajouter l'intégration.
3. **Ajouter le jeton dans GitHub** : Settings → Secrets and variables → Actions → New repository secret. Nom : `NOTION_TOKEN`.
4. **Lancer la synchronisation** : onglet Actions → « Synchronisation Notion » → Run workflow. Elle tourne ensuite automatiquement chaque nuit et n'importe que les pages modifiées.

En local :

```bash
NOTION_TOKEN=secret_xxx python3 scripts/notion-sync.py            # pages modifiées
NOTION_TOKEN=secret_xxx python3 scripts/notion-sync.py --force    # tout réimporter
NOTION_TOKEN=secret_xxx python3 scripts/notion-sync.py --limit 5  # test rapide
```

Autres scripts :

- `scripts/build-notion-index.py` régénère `data/notion/index.js` depuis `items.tsv`. Le rattachement aux organes se fait d'abord par mots-clés du titre, puis par matière. Pour corriger un classement, ajuster `ORGAN_RULES`.
- `scripts/import-notion-md.py DOSSIER` importe des pages au format Markdown Notion (un fichier `<id_notion>.md` par page).
- `scripts/build-anatomy.py` régénère les silhouettes.

## Ajouter une fiche de synthèse Atlas

1. Ajouter l'entrée dans `data/index.js`.
2. Copier `data/fiches/_modele.js` vers `data/fiches/<id>.js`. Les blocs disponibles sont documentés dans le modèle : `p`, `liste`, `encadre`, `tableau`, `cartes`, `colonnes`, `algo`, `schema`, `score`, `image`.

Mise en forme utilisable dans tous les textes : `**gras**`, `*italique*`, `==surligné==`, `` `code` `` et `[lien](fiche.html?id=…)`.

## Publier sur GitHub Pages

Settings → Pages → *Deploy from a branch*, puis choisir la branche et le dossier `/ (root)`.

> ⚠️ **Droits d'auteur.** Une partie des fiches Notion reprend des contenus de plateformes payantes : de nombreux liens pointent vers hypocampus.fr. Le site retire ces liens et images, mais le texte reste. Un site GitHub Pages est **public** : ne publie le contenu importé de Notion que s'il s'agit de ta propre rédaction. À défaut, garde le site en local ou dans un dépôt privé avec un hébergement privé.

## Crédits

- Illustration anatomique : EMBL-EBI Expression Atlas anatomogram, CC BY 4.0 (`assets/anatomogram/LICENSE.md`).
- Fiches : notes personnelles fondées sur les items du R2C. Elles ne remplacent pas les référentiels des collèges.
