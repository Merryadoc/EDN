# Atlas EDN

Atlas interactif du corps humain pour réviser l'EDN : on clique sur un organe, on obtient ses principales pathologies, et chaque pathologie a sa fiche récapitulative avec schémas, tableaux comparatifs, algorithmes et scores interactifs. Les fiches suivent les items du R2C.

Le site est **100 % statique** : pas de build, pas de dépendance. Il fonctionne sur GitHub Pages et s'ouvre aussi en local en double-cliquant sur `index.html`.

## Structure

```
index.html            Accueil : corps humain animé et cliquable
organe.html?o=<id>    Liste des pathologies d'un organe
fiche.html?id=<id>    Fiche d'une pathologie
css/style.css         Styles (thème clair/sombre, impression)
js/anatomy.js         Dessin SVG du corps et des organes
js/render.js          Rendu des blocs de contenu d'une fiche
data/organes.js       Liste des organes
data/index.js         Index des pathologies (titre, organes, items R2C, statut)
data/fiches/<id>.js   Contenu détaillé de chaque fiche
data/fiches/_modele.js  Modèle commenté pour écrire une nouvelle fiche
```

## Ajouter une fiche

1. Dans `data/index.js`, repérer (ou ajouter) la pathologie, par exemple `{ id: 'sca', … }`.
2. Copier `data/fiches/_modele.js` vers `data/fiches/sca.js` et remplacer `'mon-id'` par `'sca'`.
3. Rédiger le contenu à l'aide des blocs disponibles : `p`, `liste`, `encadre`, `tableau`, `cartes`, `algo`, `schema`, `score`. Le modèle documente chacun d'eux.
4. Passer `statut: 'redigee'` dans `data/index.js` et renseigner `items: [numéro]`.

Mise en forme utilisable dans tous les textes : `**gras**`, `*italique*`, `==surligné==`, `` `code` `` et `[lien](fiche.html?id=bpco)`.

Chaque section (ou chaque bloc) peut recevoir un `rang: 'A'` ou `'B'`. Le bouton « Rang A uniquement » de la fiche s'en sert pour filtrer.

## Ajouter un organe

1. Ajouter l'organe dans `data/organes.js`.
2. Pour le rendre cliquable sur le corps, ajouter sa forme dans `ORGAN_SHAPES` (`js/anatomy.js`, viewBox 0 0 400 900) et son id dans le tableau `order` de `EDN.buildBody`.
   Un organe absent du dessin reste accessible depuis la liste « Tous les organes ».

## Publier sur GitHub Pages

Settings → Pages → *Build and deployment* → Source : **Deploy from a branch**, puis choisir la branche et le dossier `/ (root)`.
Le site sera servi à l'adresse `https://<utilisateur>.github.io/<dépôt>/`.

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Avertissement

Ces fiches sont des notes de révision personnelles et ne remplacent pas les référentiels des collèges. **Les numéros d'items et les rangs A/B sont indicatifs** : vérifiez-les sur la liste officielle du R2C.
