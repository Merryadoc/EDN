# Illustrations anatomiques — crédits et licence

Les silhouettes et les organes affichés sur la page d'accueil et sur les pages organe proviennent des
**anatomogrammes de l'EMBL-EBI Expression Atlas** :

- Projet : <https://github.com/ebi-gene-expression-group/anatomogram>
  (paquet npm `@ebi-gene-expression-group/anatomogram` 2.4.0)
- Fichiers d'origine : `source/homo_sapiens.female.svg`, `source/homo_sapiens.male.svg`
- Licence des images : **Creative Commons Attribution 4.0 International (CC BY 4.0)** —
  <https://creativecommons.org/licenses/by/4.0/deed.fr>
- Le code du projet d'origine est sous licence Apache 2.0 (il n'est pas réutilisé ici).

## Modifications apportées

`scripts/build-anatomy.py` produit `corps-femme.js` et `corps-homme.js` à partir des fichiers
d'origine. Le script :

- supprime les métadonnées et les styles ;
- regroupe les organes par appareil ;
- remplit la silhouette ;
- duplique en miroir le cartilage du genou.

Les couleurs, les dégradés et les animations sont ensuite ajoutés par le site (`js/anatomy.js`,
`css/style.css`).

Le crédit est également affiché sous l'illustration de la page d'accueil.
