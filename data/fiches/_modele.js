/*
 * MODÈLE DE FICHE — copier ce fichier en data/fiches/<id>.js
 * (<id> = l'id déclaré dans data/index.js), puis passer statut: 'redigee' dans l'index.
 *
 * Mise en forme inline dans tous les textes :
 *   **gras**   *italique*   ==surligné==   `code`
 *
 * Types de blocs disponibles (champ "rang" optionnel sur chaque bloc : 'A' | 'B' | 'C') :
 *   { type: 'p', texte }
 *   { type: 'liste', titre?, items: [ 'texte' | { texte, sous: [...] } ], ordonnee? }
 *   { type: 'encadre', style: 'info'|'important'|'urgence'|'piege'|'astuce', titre?, texte?, items? }
 *   { type: 'tableau', titre?, colonnes: [...], lignes: [[...], ...], comparatif?, note? }
 *   { type: 'cartes', items: [{ titre, texte: 'texte' | [liste], accent?: 'rouge'|'bleu'|'ambre'|'violet' }] }
 *   { type: 'algo', titre?, noeuds: [ 'étape' | { texte, style?: 'question'|'action'|'fin' } |
 *                                     { choix: [{ si: 'condition', alors: [noeuds...] }] } ] }
 *   { type: 'colonnes', items: [{ titre, blocs: [blocs...] }] }   (une carte par colonne, comme dans Notion)
 *   { type: 'titre', texte }                                       (intertitre)
 *   { type: 'image', src, legende? }
 *   Élément de liste dépliant : { texte, sous: [...], replie: true } ; tableau dans une liste : { tableau: {…} }
 *   { type: 'schema', svg: '<svg viewBox=...>…</svg>', legende? }
 *        → classes SVG qui suivent le thème : s-line s-thin s-accent s-teal s-violet
 *          s-box s-box-accent s-box-teal s-box-violet s-text s-small s-bold s-fill-accent s-arrow
 *   { type: 'score', titre, criteres: [['critère', points], ...], interpretation?: [...] }
 */
window.EDN.fiches['mon-id'] = {
  definition: 'Une phrase de définition.',
  pointsCles: ['Point clé 1', 'Point clé 2'],
  sections: [
    {
      titre: 'Définition',
      rang: 'A',
      blocs: [{ type: 'p', texte: '…' }],
    },
  ],
  sources: ['Référentiel du collège de …'],
  maj: '2026-10',
};
